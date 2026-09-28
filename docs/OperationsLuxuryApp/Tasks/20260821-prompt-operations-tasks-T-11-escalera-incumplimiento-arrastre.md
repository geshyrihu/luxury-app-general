# TICKET T-11 — Escalera de incumplimiento y arrastre

Trabajas en el repositorio LuxuryApp. Antes de escribir código, lee `CONVENTIONS.md` y
`AGENTS.md`. Lee este prompt completo antes de empezar.

## Contexto

El motor de alertas (T-09b/T-09c/T-10) ya avisa con anticipación, detecta el vencimiento y
recuerda a diario. Lo que falta: cuando una tarea sigue sin cerrarse varios días después de
vencida, alguien más allá del responsable directo tiene que enterarse — y a los 5 días, el
sistema debe dejar de tratarla como "recordatorio más" y marcarla como **incumplimiento formal**,
sin por eso dejar de alertar (`RN-ALT-014`, `RN-ALT-051`).

## Decisión de alcance: la escalera omite el día 1

La escalera completa (`RN-ALT-053`) definía cuatro niveles: día 0 (responsable), día 1 (jefe vía
organigrama), día 3 (respaldo), día 5 (incumplimiento formal). **El organigrama por rol
(decisión #19, bloqueador D-11) todavía no existe** — `OrgHierarchy` sigue anclado a
`WorkPosition` y, por diseño actual, no filtra por cliente (`ParentWorkPositionId`/
`ChildWorkPositionId`, sin `CustomerId`). Implementar el nivel "día 1: jefe" contra ese esquema
reabriría el riesgo de fuga entre clientes que la decisión #19 cerró en el diseño.

El propio plan ya preveía esto: *"Si el refactor no está listo, F4 se libera con escalación de
nivel 1 (dentro del grupo) + respaldo"*. Este ticket **no implementa el nivel "día 1: jefe"**. La
escalera queda: día 0 (ya cubierto por el motor de alertas) → día 3 (respaldo) → día 5
(incumplimiento formal, arrastre). No toques `OrgHierarchy` ni intentes resolver "el jefe" por
ningún medio.

## Reglas de negocio

| Regla | Qué exige |
| --- | --- |
| `RN-ALT-053` (con la reducción de alcance de arriba) | Día 3: respaldo + `SupervisionOperativa`. Día 5: `Direccion`, `SuperUsuario`, `SupervisionOperativa` |
| `RN-ALT-014` | A los 5 días vencida, incumplimiento formal — **no deja de alertar**, cambia de cadencia |
| `RN-ALT-051` | Arrastre: conserva antigüedad, cadencia semanal, nunca se apaga |
| `RN-ALT-015` | Al marcarse el incumplimiento se notifica a `Direccion`, `SuperUsuario`, `SupervisionOperativa` |

## Alcance: sólo tareas de este módulo

Igual que T-09b: **sólo tareas con `IsRecurring == true`**. No toques tickets manuales.

## Tareas de Backend

### 1. Ubicación

```
api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Tasks/RecurringTaskEscalation/
├── Interfaces/
└── Services/
```

Submódulo hermano de `RecurringTaskAlerting/`. **Servicio separado**, no lo mezcles dentro de
`TaskAlertEngineService` — son responsabilidades distintas y ese archivo ya es grande.

### 2. Interfaz

```csharp
public interface ITaskEscalationService
{
    Task<TaskEscalationRunResult> RunAsync();
}

public record TaskEscalationRunResult(
    int TasksEvaluated,
    int EscalatedToBackup,
    int MarkedAsIncumplimiento,
    int ArrastreRemindersSent,
    int Failed);
```

### 3. Servicio

Inyecta `ApplicationDbContext`, `INotificationDispatcher`, `ILogger<TaskEscalationService>`. Un
`try/catch` por tarea, mismo patrón que los servicios anteriores — un fallo no detiene la corrida.

**Consulta base:** `IsRecurring == true`, `ClosedDate == null`, `Status != GanttStatus.Cancelled`,
`PlannedEndDate < DateTime.UtcNow` (sólo tareas ya vencidas — las que no lo están, no son de este
ticket). Incluye `RecurringTemplate` (necesitas `BackupUserId`).

**Por cada tarea, calcula los días vencida** (`(hoy - PlannedEndDate.Date).Days`, usa el mismo
criterio de fecha/hora que ya establecieron T-08/T-09b) y decide:

**Si han pasado 5 días o más:**

- **Si `Tasks.BreachedAt` es nulo** (primera vez que cruza el umbral): márcalo con
  `DateTime.UtcNow`, notifica en una sola alerta agrupada a los usuarios de los roles
  `Direccion`, `SuperUsuario` y `SupervisionOperativa` (mismo patrón de búsqueda de rol y
  usuarios que ya usaron T-01 y T-08 para `SistemasGeneral` — revísalos como referencia), registra
  `TaskAlertLog` con `AlertType.Incumplimiento` (una fila por destinatario y canal, mismo criterio
  de T-09c). Cuenta en `MarkedAsIncumplimiento`.
- **Si `Tasks.BreachedAt` ya tiene valor** (arrastre en curso): consulta cuándo fue la última
  alerta `Arrastre` registrada para esta tarea (`MAX(SentAt)` en `TaskAlertLog` filtrando por
  `TasksId` y `AlertType == Arrastre` — **no uses `Tasks.LastAlertAt` para esto**, ver nota
  abajo). Si no existe ninguna, o pasaron 7 días o más desde la última: notifica al responsable
  (`AssigneeId`) y a los usuarios de `SupervisionOperativa` que la tarea sigue arrastrada, registra
  `TaskAlertLog` con `AlertType.Arrastre`. Cuenta en `ArrastreRemindersSent`. Si no han pasado los
  7 días, no hagas nada con esta tarea.

**Si han pasado entre 3 y 4 días (inclusive) y no han pasado 5:**

- Si **no existe todavía** un `TaskAlertLog` con `AlertType == Escalacion` para esta tarea:
  arma la lista de destinatarios — el `BackupUserId` de la plantilla **si no es nulo o vacío**,
  más los usuarios del rol `SupervisionOperativa`. Notifica a cada uno, registra `TaskAlertLog`
  con `AlertType.Escalacion` (una fila por destinatario y canal). Cuenta en `EscalatedToBackup`.
- Si ya existe una `Escalacion` registrada para esta tarea, no hagas nada más en este nivel (no se
  repite; la tarea seguirá su curso hacia el día 5).

**Si han pasado menos de 3 días:** no hagas nada con esta tarea en este ticket — el motor de
alertas (T-09b/T-10) ya la cubre con `Vencida`/`Recordatorio`.

**Nota importante sobre `Tasks.LastAlertAt`:** ese campo lo usa `TaskAlertEngineService` (T-09b)
para su propio throttle de 24 horas. **No lo leas ni lo escribas desde este servicio** — si lo
tocas, vas a interferir con la cadencia diaria del motor de alertas. Este servicio determina su
propia cadencia consultando `TaskAlertLog` directamente, como se especifica arriba.

**Notificación agrupada por rol:** reutiliza el mismo patrón de búsqueda que
`RecurringTaskGenerationService`/`RecurringTaskGeneratorService` (T-01) usan para `SistemasGeneral`
— buscar el rol por `Name == nameof(ApplicationRoleEnum.X)`, listar sus `UserRoles`, notificar a
cada uno. Envuélvelo en `try/catch`: si no se encuentra el rol o no tiene usuarios, regístralo en
el log y sigue sin lanzar la corrida completa.

**Canales:** `InApp`, `Push`, `PushWeb`. Nunca `WhatsApp`.

**Categoría de notificación:** `Urgente` para `Incumplimiento`, `Personal` para `Escalacion` y
`Arrastre` (mismo criterio que T-09b usó para `Vencida`).

### 4. Registro en el contenedor de dependencias

Junto a `ITaskAlertEngineService` en `DependencyInjection.Controllers.cs`.

### 5. Pruebas

Mismo estilo que `TaskAlertEngineServiceTests.cs`. Cubre al menos:

- Tarea vencida hace 3 días, sin `Escalacion` previa, con `BackupUserId` en su plantilla → se
  notifica al respaldo y a `SupervisionOperativa`, se registra `Escalacion`.
- La misma tarea, plantilla **sin** `BackupUserId` → sólo se notifica a `SupervisionOperativa`,
  no falla por la ausencia del respaldo.
- Tarea vencida hace 3 días que **ya tiene** `Escalacion` registrada → no se genera una segunda.
- Tarea vencida hace 5 días, `BreachedAt` nulo → se marca `BreachedAt`, se notifica a
  `Direccion`/`SuperUsuario`/`SupervisionOperativa`, se registra `Incumplimiento`.
- Tarea vencida hace 12 días, `BreachedAt` ya establecido hace 8 días, **sin** `Arrastre` previo
  registrado → se envía el primer recordatorio de arrastre.
- La misma tarea, con un `Arrastre` registrado hace 2 días → no se envía otro todavía (no han
  pasado los 7 días).
- Una tarea con `IsRecurring == false` → el servicio no la toca.

## Lo que NO debes hacer

- No implementes el nivel "día 1: jefe vía organigrama" ni toques `OrgHierarchy`.
- No leas ni escribas `Tasks.LastAlertAt` desde este servicio.
- No toques `TaskAlertEngineService.cs` ni ningún archivo de T-08/T-08c/T-09/T-09b/T-09c/T-10.
- No implementes justificación ni su flujo de aprobación — es otro ticket, no está en este.
- No registres nada en Hangfire.
- Si algo fuera de esta lista deja de compilar por una dependencia real, corrígelo de forma
  mínima y decláralo en tu reporte.

## Convenciones aplicables

- `CONVENTIONS.md` §4.1
- Archivos en UTF-8 sin mojibake

## Verificación obligatoria

```bash
dotnet build api/LuxuryApp.sln
dotnet test api/LuxuryApp.Tests/LuxuryApp.Tests.csproj --filter TaskEscalationServiceTests --no-restore
node scripts/audit-conventions.mjs
node scripts/scan-mojibake.mjs api
```

Ajusta el nombre del filtro si nombras la clase de test distinto, y dilo en tu reporte.

## Criterio de PASO del ticket

Los 7 escenarios de la sección de pruebas están cubiertos y pasan. Ningún test depende de en qué
día corre — usa fechas relativas a `DateTime.UtcNow`.

## Reporte de finalización

1. Archivos creados, con una línea de qué hace cada uno
2. Salida literal de los cuatro comandos, con el conteo de tests
3. Decisiones que tomaste por tu cuenta y por qué
4. Lo que NO hiciste del ticket y el motivo
5. Riesgos detectados que no estaban en este prompt

No avances al siguiente ticket. Espera la auditoría.
