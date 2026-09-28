# TICKET T-08 — Generador único de tareas recurrentes

Trabajas en el repositorio LuxuryApp (.NET 10 + Angular 22). Antes de escribir código, lee
`CONVENTIONS.md` y `AGENTS.md`. Respeta la jerarquía de convenciones ahí definida.

Este es el ticket más grande de la orquestación. Léelo completo antes de empezar a escribir
código — el orden de las secciones importa.

## Contexto

Hoy existen **dos** motores de generación de tareas recurrentes, y ninguno es el que se necesita:

- `RecurringTaskGeneratorService` (vigente, `ReclutamientoLuxuryApp/.../RecurringTasks/`) genera
  `TaskInstance` anclado a `RoleId`. Se retira en T-15.
- `RecurringTaskSchedulerJob` (legado) genera `Tasks` anclado a `WorkGroupId`, pero calcula folios
  rotos (49 caracteres contra un límite de 20) y nunca notifica nada. También se retira en T-15.

Este ticket construye el **reemplazo de ambos**: un servicio nuevo que lee `RecurringTaskTemplate`
(ya extendida en T-03/T-07c) y genera `Tasks` (ya extendida en T-07/T-07c), anclado al grupo de
trabajo, con folio real, notificación, festivos corregidos y responsable resuelto de forma
determinista.

**No se registra en Hangfire en este ticket.** El job se activa más adelante, cuando exista al
menos el motor de alertas (T-09). Activar la generación sin nada que avise de un vencimiento
crearía tareas huérfanas de aviso. Este ticket entrega el servicio, invocable y probado, sin
programarlo.

## Dato crítico sobre el nombre de tabla

`Tasks.CustomerId` es `Guid?` y `Tasks` **no** implementa `ITenantEntity` — decisión ya tomada
(`RN-ALT-047`), no la cambies. Y aunque la clase declara `[Table("Tasks")]`, **el nombre físico
real de la tabla en la base de datos es `Task` (singular)** — confirmado por el dueño del módulo
con acceso directo. Esto no debería afectarte en este ticket porque **trabajas contra
`ApplicationDbContext.Tasks` (el `DbSet<Tasks>`), nunca con SQL crudo ni con el nombre de tabla
directamente** — EF Core resuelve el nombre real internamente. Se documenta aquí sólo para que, si
en algún punto necesitas generar o tocar una migración, sepas que `"Task"` en singular es lo
correcto y no lo "corrijas".

## Reglas de negocio que este servicio debe implementar

Documentadas en `docs/modulos-existente/alertas-tareas-recurrentes/02-business-rules-analysis.md`,
`02b-enmienda-anclaje-grupos.md` y `03-riesgos-dependencias.md`. Resumen operativo, en el orden en
que se aplican:

| Regla | Qué exige |
| --- | --- |
| `RN-ALT-001` | La obligación existe como `RecurringTaskTemplate` con `RecurrenceRule` válida |
| `RN-ALT-043` | Si el grupo está inactivo o sin administradores **al momento de generar** (no sólo al guardar la plantilla), no se genera y se cuenta como incidencia |
| `RN-ALT-044` (re-chequeo) | Si el grupo pasó a `Visibility == Public` después de creada la plantilla, no se genera |
| `RT-02` / A7 | En festivo o fin de semana, la fecha se recorre al siguiente día hábil — **excepto** si la RRULE es de fin de mes (`BYMONTHDAY=-1`), donde se recorre hacia atrás. Ver sección dedicada abajo |
| `RN-ALT-038` | No duplicar: idempotencia por `(RecurringTemplateId, PlannedEndDate)` |
| `RN-ALT-041` | Responsable = administrador del grupo, elegido de forma **determinista** |
| `RN-ALT-040` | Una obligación = una tarea. Los corresponsables **no se guardan**: se derivan en consulta desde `WorkGroupMembers.IsAdmin`, no se persisten en `Tasks` (decisión ya tomada — no agregues ningún campo ni tabla de corresponsables) |
| `RN-ALT-045` | Folio con el generador oficial (`IGenerateFolioService`), nunca concatenado a mano |
| `RN-ALT-046` | `CustomerId` heredado de la plantilla (`RecurringTaskTemplate.CustomerId`, ya validado contra el grupo en T-04) |
| RT-08 | Un fallo en un cliente no detiene la corrida de los demás, y se reporta, no sólo se registra en log |

## Tareas de Backend

### 1. Ubicación

```
api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Tasks/RecurringTaskGeneration/
├── Interfaces/
└── Services/
```

Submódulo hermano de `RecurringTaskCatalog/` (T-04) dentro de `Tasks/`. No necesita `DTOs/` ni
`EndPoints/`: es un servicio interno, no expuesto por API en este ticket.

### 2. Interfaz

`Interfaces/IRecurringTaskGenerationService.cs`, namespace `LuxuryApp.Application.Interfaces`:

```csharp
public interface IRecurringTaskGenerationService
{
    Task<RecurringTaskGenerationRunResult> GenerateAsync();
}
```

Define `RecurringTaskGenerationRunResult` como un `record` simple en el mismo archivo o uno
propio (`TemplatesProcessed`, `TemplatesFailed`, `TasksGenerated`, `TemplatesWithoutResponsable`,
`TemplatesSkippedInactiveGroup`) — necesitas estos contadores para el reporte de corrida.

### 3. Servicio: estructura y flujo

`Services/RecurringTaskGenerationService.cs`. Inyecta `ApplicationDbContext`,
`IHolidayService`, `IGenerateFolioService`, `INotificationDispatcher`,
`ILogger<RecurringTaskGenerationService>`.

**Estructura en métodos separados y testeables** (no un solo método de 200 líneas):

- `GenerateAsync()` — entrypoint. Lee plantillas activas, agrupa por cliente, procesa cada una en
  su propio `try/catch` (igual que el patrón ya aprobado en T-01 para el generador viejo — un
  fallo no detiene a los demás), acumula contadores, notifica al final si hubo incidencias.
- `ProcessTemplateAsync(RecurringTaskTemplate template)` — procesa una plantilla: valida el grupo,
  calcula ocurrencias, resuelve responsable, crea la tarea si no existe ya.
- `GetOccurrences(string recurrenceRule, DateOnly startDate, DateOnly endDate)` — envuelve
  `Ical.Net`, igual patrón que `RecurringTaskGeneratorService.cs` (el motor vigente que se retira,
  puedes leerlo como referencia de cómo invocar la librería, **no lo modifiques ni lo llames**).
- `AdjustForBusinessDay(DateOnly date, bool isEndOfMonthPattern, HashSet<DateOnly> holidays)` —
  ver sección de festivos abajo.
- `ResolvePrincipalResponsibleAsync(Guid workGroupId)` — ver sección de responsable abajo.

### 4. Horizonte de generación

**Corto, no 35 días.** La razón por la que el motor vigente necesitaba un horizonte largo era que
el aviso previo dependía de que la tarea ya existiera (`RT-01`). Ya no: la decisión de diseño A5
del plan (`../../../docs/HumanResourcesLuxuryApp/HrPolicyEngine/20260902-plan-hr-policy-engine.md`) desacopla el aviso previo del generador — el motor de
alertas (T-09, todavía no construido) calculará el aviso previo directamente desde
`RecurringTaskTemplate.RecurrenceRule` y `AdvanceNoticeDays`, sin depender de que exista una fila
en `Tasks`.

Usa un horizonte de **7 días** (`hoy` hasta `hoy + 7`), igual que tenía el motor vigente antes de
que se identificara el problema — el problema no era el horizonte del generador, era que el aviso
dependía de él. Ampliarlo ahora sólo multiplicaría instancias vivas sin necesidad (RT-04, RT-05).

### 5. Festivos y fin de semana (RT-02 / A7)

**"Día hábil" significa: no sábado, no domingo, y no festivo oficial** (`IHolidayService`, que
sólo cubre festivos de ley — no amplíes su cobertura, es una limitación ya documentada y
aceptada). Antes de esto, el motor vigente **omitía** la ocurrencia en vez de recorrerla — ese es
el bug que corriges aquí.

**Dirección del ajuste:**
- Por defecto: si la fecha calculada no es día hábil, avanza al **siguiente** día hábil.
- **Excepción:** si la `RecurrenceRule` de la plantilla contiene la subcadena `BYMONTHDAY=-1`
  (RRULE estándar para "último día del mes"), y la fecha calculada no es día hábil, retrocede al
  día hábil **anterior** — nunca a un mes distinto. Es la única señal disponible en el esquema
  para detectar este caso; no hay un campo separado para "patrón de fin de mes" y no debes
  agregar uno en este ticket.

**Guarda la fecha original.** El campo `RecurrenceSourceDate` (agregado en T-07) se llena siempre
con la fecha cruda que produjo la RRULE, **antes** de cualquier ajuste — incluso cuando no hubo
ajuste (en ese caso `RecurrenceSourceDate == PlannedEndDate`). Es la clave para trazabilidad y
para el chequeo de idempotencia de la sección siguiente.

### 6. Idempotencia

Antes de crear una tarea para una ocurrencia, verifica si ya existe una `Tasks` con
`RecurringTemplateId == template.Id` y `PlannedEndDate` igual a la fecha **ya ajustada** por
festivo (no la fecha cruda). El índice `(RecurringTemplateId, PlannedEndDate)` de T-07 está hecho
para esta consulta — que la validación use exactamente esas dos columnas, en ese orden, para que
la consulta lo aproveche.

### 7. Grupo: re-validación en tiempo de generación

T-04 valida el grupo **al guardar** la plantilla. Un grupo puede desactivarse, perder a todos sus
administradores, o cambiar a `Visibility.Public` **después**. Antes de generar una ocurrencia,
vuelve a comprobar:

1. `WorkGroup.Active == true` — si no, cuenta como `TemplatesSkippedInactiveGroup`, no generes, no
   falles la corrida completa.
2. Existe al menos un `WorkGroupMembers` con `IsAdmin == true` para ese grupo — si no, cuenta
   como `TemplatesWithoutResponsable`, no generes. **No crees una tarea sin responsable.** Es el
   modo de falla exacto que este módulo existe para eliminar (RT-03): mejor no generar y avisar,
   que generar huérfana y callar.

No es necesario re-chequear `Visibility == Public` de forma separada si ya está cubierto por
`Active` en la práctica — sí, decláralo como chequeo aparte de todas formas, porque un grupo puede
ser público y estar activo a la vez, y ya no debería recibir nuevas obligaciones.

### 8. Responsable: elección determinista

`ResolvePrincipalResponsibleAsync(Guid workGroupId)`: consulta `WorkGroupMembers` con
`WorkGroupId == workGroupId && IsAdmin == true`, **ordena por `UserId` ascendente (comparación
ordinal de cadena)**, y toma el primero. Es simple, determinista, y no depende de ninguna
suposición sobre el orden interno de `Guid` — no ordenes por `Id` de `WorkGroupMembers` asumiendo
que es cronológico; no lo es de forma confiable en .NET.

Este es el único campo que se persiste en `Tasks.AssigneeId`. Los demás administradores del grupo
son corresponsables **derivados**, no se guardan (`RN-ALT-040`, ya explicado arriba).

### 9. Crear la tarea

Cuando todas las validaciones pasan:

```csharp
var folio = await generateFolioService.OnGenerateFolioTicketMessage(template.WorkGroupId);

var task = new Tasks
{
    Folio = folio,
    Title = template.Title,
    Description = template.Description,
    Status = GanttStatus.NotStarted,
    Progress = 0,
    WorkGroupId = template.WorkGroupId,
    CustomerId = template.CustomerId,
    AssigneeId = principalResponsibleUserId,
    RecurringTemplateId = template.Id,
    IsRecurring = true,
    ScheduledDate = adjustedDate.ToDateTime(TimeOnly.MinValue),
    PlannedEndDate = adjustedDate.ToDateTime(TimeOnly.MinValue),
    RecurrenceSourceDate = rawOccurrenceDate.ToDateTime(TimeOnly.MinValue),
    CreateDate = DateTime.UtcNow
};
```

Verifica los nombres exactos de propiedades contra `Tasks.cs` antes de escribir esto —el ejemplo
es orientativo, no lo copies literal si algo no coincide.

Después de `SaveChangesAsync`, notifica al responsable vía `INotificationDispatcher`, canales
`InApp`, `Push`, `PushWeb` (nunca `WhatsApp` — el dispatcher lo rechaza, bloqueador B1 sigue
abierto), con `ActionRoute` apuntando a la tarea.

### 10. Reporte de la corrida

Mismo patrón que T-01 aprobó para el generador viejo: si `TemplatesFailed > 0`,
`TemplatesWithoutResponsable > 0`, o `TemplatesSkippedInactiveGroup > 0`, envía **una notificación
agregada** a los usuarios del rol `SistemasGeneral` con el resumen — no una por incidencia. Usa
`ApplicationRoleEnum.SistemasGeneral` igual que en el generador viejo instrumentado en T-01.

## Lo que NO debes hacer

- No registres nada en `HangfireJobCatalog.cs` ni en `HangfireExtensions.cs`.
- No toques `RecurringTaskGeneratorService.cs` ni `RecurringTaskSchedulerJob.cs` — se retiran en
  T-15, no se modifican aquí.
- No toques `RecurringTaskCatalogAppService.cs` ni ningún endpoint de T-04.
- No agregues ningún campo ni tabla de corresponsables — se derivan en consulta, no se persisten.
- No implementes el motor de alertas, aviso previo, escalación, justificación ni checklist — son
  T-09 en adelante.
- No cambies el nombre de tabla en ninguna migración ni generes una migración nueva en este
  ticket — no hay cambios de esquema.
- No amplíes `IHolidayService` más allá de los festivos de ley que ya cubre.
- Si algo fuera de esta lista deja de compilar por una dependencia real, corrígelo de forma
  mínima y decláralo explícitamente en tu reporte — mismo criterio de todos los tickets
  anteriores desde T-03.

## Convenciones aplicables

- `CONVENTIONS.md` §4.1 — backend .NET
- `ApiResponseDTO<T>` no aplica aquí (no es un endpoint); usa el `record` de resultado definido
  arriba
- Archivos en UTF-8 sin mojibake

## Verificación obligatoria

Corre y **pega la salida literal** de:

```bash
dotnet build api/LuxuryApp.sln
node scripts/audit-conventions.mjs
node scripts/scan-mojibake.mjs api
```

Criterio de éxito:
- La compilación pasa sin errores nuevos
- `audit-conventions.mjs` **no aumenta** su conteo actual de 10 errores
- `scan-mojibake.mjs` da cero sobre los archivos que tocaste

## Criterio de PASO del ticket

Debe quedar demostrado en tu reporte, con razonamiento sobre el código:

1. Una ocurrencia en festivo (no fin de mes) se recorre hacia adelante; una de `BYMONTHDAY=-1` en
   festivo se recorre hacia atrás.
2. Un grupo con 3 administradores produce **una** tarea con **un** responsable, elegido siempre
   igual entre corridas (mismo `UserId` gana siempre para el mismo conjunto de administradores).
3. Correr la generación dos veces seguidas para la misma plantilla y fecha no duplica la tarea.
4. Un grupo sin administradores no genera tarea, y el contador `TemplatesWithoutResponsable` lo
   refleja.
5. Un fallo al procesar una plantilla no detiene el procesamiento de las demás.

## Reporte de finalización

1. Archivos creados, con una línea de qué hace cada uno
2. Salida literal de los tres comandos
3. Decisiones que tomaste por tu cuenta y por qué
4. Lo que NO hiciste del ticket y el motivo
5. Riesgos que detectaste y no estaban en este prompt

No avances al siguiente ticket. Espera la auditoría.
