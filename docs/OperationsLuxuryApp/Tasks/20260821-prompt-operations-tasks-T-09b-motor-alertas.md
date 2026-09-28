# TICKET T-09b — Motor de alertas: aviso previo, recordatorio y detección de vencidas

Trabajas en el repositorio LuxuryApp. Antes de escribir código, lee `CONVENTIONS.md` y
`AGENTS.md`. Lee este prompt completo antes de empezar.

## Contexto

Con T-08/T-08c generando tareas y T-09 con la bitácora lista, falta la pieza que insiste: hoy el
sistema crea la tarea y notifica una vez (T-08); después nunca vuelve a avisar, ni detecta cuando
se vence. Es exactamente el problema original que originó este módulo — el motor `TaskEngine`
viejo avisaba una sola vez al crear y nunca más.

Este ticket construye el motor que:
1. Avisa con anticipación, calculada desde `RecurringTaskTemplate.AdvanceNoticeDays` (decisión A5
   del plan — el aviso se ata a la plantilla, no a inventar lógica nueva sobre la instancia).
2. Insiste con un recordatorio diario mientras la tarea siga abierta.
3. Detecta el momento exacto en que una tarea vence y lo registra como evento propio, no como un
   recordatorio más.

**No incluye** la escalera de incumplimiento a 5 días, el arrastre, ni la agrupación/tope de
alertas por persona — son T-11 y T-10, tickets siguientes. Este motor es la base sobre la que
esos se apoyan.

## Alcance: sólo tareas de este módulo

`Tasks` es una tabla compartida con el sistema de tickets manual (`TaskAppService`), que ya tiene
sus propias notificaciones. **Este motor sólo debe considerar tareas con `IsRecurring == true`**
(el campo que T-08 ya pone en `true` al generar). Cualquier consulta de este ticket debe llevar
ese filtro — si se te olvida, vas a empezar a alertar sobre tickets manuales que nunca pidieron
esto.

## Reglas de negocio

| Regla | Qué exige |
| --- | --- |
| A5 | Aviso previo calculado desde `RecurringTaskTemplate.AdvanceNoticeDays`, vía `Tasks.RecurringTemplateId` |
| `RN-ALT-011` | Vencida = `PlannedEndDate < ahora AND ClosedDate IS NULL` — derivado, nunca se persiste como estado |
| `RN-ALT-006` | Nunca marcar `Delivered = true` sin que el despacho haya tenido éxito real (ver sección de entrega abajo) |
| RT-16 | Sin tope de alertas todavía (eso es T-10) — pero **sí** un mínimo de cordura: nunca más de una alerta por tarea cada 24 horas |

## Tareas de Backend

### 1. Ubicación

```
api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Tasks/RecurringTaskAlerting/
├── Interfaces/
└── Services/
```

Submódulo hermano de `RecurringTaskCatalog/` y `RecurringTaskGeneration/`.

### 2. Interfaz

`Interfaces/ITaskAlertEngineService.cs`, namespace `LuxuryApp.Application.Interfaces`:

```csharp
public interface ITaskAlertEngineService
{
    Task<TaskAlertEngineRunResult> RunAsync();
}

public record TaskAlertEngineRunResult(
    int TasksEvaluated,
    int AvisosPreviosSent,
    int RecordatoriosSent,
    int VencidasDetected,
    int Failed);
```

### 3. Servicio

`Services/TaskAlertEngineService.cs`. Inyecta `ApplicationDbContext`,
`INotificationDispatcher`, `ILogger<TaskAlertEngineService>`.

**Consulta base:** tareas con `IsRecurring == true`, `ClosedDate == null`,
`Status != GanttStatus.Cancelled`. Incluye (`Include`/`join`) el `AdvanceNoticeDays` de la
plantilla relacionada vía `RecurringTemplateId` — necesitas ese valor por tarea.

Procesa cada tarea en su propio `try/catch` (mismo patrón que T-08: un fallo no detiene la
corrida completa, se cuenta en `Failed`).

**Por cada tarea, en este orden:**

1. **Throttle de 24 horas.** Si `Tasks.LastAlertAt` no es nulo y han pasado menos de 24 horas
   desde entonces, no hagas nada con esta tarea en esta corrida. Sigue con la siguiente.

2. **¿Ya venció?** `PlannedEndDate < DateTime.UtcNow` (usa el mismo criterio horario que el resto
   del módulo — revisa cómo comparan fechas los servicios vecinos si tienes dudas sobre UTC vs
   hora local, y sé consistente con eso).
   - Si venció **y no existe todavía** un `TaskAlertLog` con `AlertType == Vencida` para esta
     tarea: envía la alerta de tipo `Vencida` (una sola vez por tarea, es el evento de cruce, no
     se repite). Cuenta en `VencidasDetected`.
   - Si venció y **ya existe** una alerta `Vencida` registrada: envía `Recordatorio` (sigue
     abierta, sigue insistiendo). Cuenta en `RecordatoriosSent`.
   - Continúa con la siguiente tarea.

3. **¿Está dentro de la ventana de aviso previo?** Es decir,
   `hoy >= PlannedEndDate.AddDays(-AdvanceNoticeDays) && hoy < PlannedEndDate`.
   - Si **no existe todavía** un `TaskAlertLog` con `AlertType == AvisoPrevio` para esta tarea:
     envía `AvisoPrevio` (una sola vez, marca el inicio de la ventana). Cuenta en
     `AvisosPreviosSent`.
   - Si **ya existe** un aviso previo registrado: envía `Recordatorio`. Cuenta en
     `RecordatoriosSent`.
   - Si `AdvanceNoticeDays == 0`, esta ventana está vacía por definición — no hay aviso previo
     para esa tarea, pasa directo al punto 4.

4. **Fuera de cualquier ventana** (todavía falta más que `AdvanceNoticeDays` para el vencimiento):
   no hagas nada con esta tarea.

**Al enviar cualquier alerta** (los tres tipos):
- Despacha vía `INotificationDispatcher`, canales `InApp`, `Push`, `PushWeb` — **nunca
  `WhatsApp`**, el dispatcher lo rechaza (bloqueador B1 sigue abierto).
- Envuelve el despacho en `try/catch`. Si no lanza excepción, registra el `TaskAlertLog` con
  `Delivered = true`. Si lanza, registra `Delivered = false` **de todas formas** (no omitas el
  registro: la bitácora debe reflejar el intento fallido, no desaparecerlo) y cuenta la tarea en
  `Failed`.
- **Interpretación de "entregado" en este ticket, explícita para que no la adivines distinto:**
  `Delivered = true` significa que el despacho no lanzó excepción — **no** que el dispositivo del
  usuario confirmó recepción. Una confirmación real de entrega (por ejemplo, vía webhook de
  Twilio) es un problema aparte, ya documentado como bloqueador B9, y no se resuelve aquí. No
  inventes un mecanismo de confirmación más fuerte del que el dispatcher ofrece.
- Actualiza `Tasks.LastAlertAt = DateTime.UtcNow` después de cada envío (exitoso o fallido —
  el throttle de 24 horas debe respetarse aunque el envío haya fallado, para no reintentar en
  bucle contra un canal caído).

**Textos de cada tipo de alerta**, ajusta el fraseo si hace falta pero mantén la intención:
- `AvisoPrevio`: menciona cuántos días faltan y el título de la tarea.
- `Recordatorio`: menciona que sigue pendiente y su fecha límite.
- `Vencida`: menciona que venció y su fecha límite.

### 4. Registro en el contenedor de dependencias

`api/LuxuryApp.Api/ServiceExtensions/DependencyInjection.Controllers.cs`, junto a
`IRecurringTaskGenerationService`.

### 5. Pruebas

Sigue el patrón ya establecido en
`api/LuxuryApp.Tests/Application/Modules/OperationsLuxuryApp/Tasks/RecurringTaskGeneration/RecurringTaskGenerationServiceTests.cs`
(mismo estilo de `CreateService`, contexto en memoria, mocks de dependencias). Cubre al menos:

- Una tarea dentro de la ventana de aviso previo, sin alerta previa registrada → genera
  `AvisoPrevio`.
- La misma tarea, corrida de nuevo el mismo día → **no** genera una segunda alerta (throttle de
  24 horas).
- Una tarea vencida sin `TaskAlertLog` de tipo `Vencida` → genera `Vencida`, exactamente una vez.
- Una tarea vencida que ya tiene un `Vencida` registrado → la siguiente alerta es `Recordatorio`,
  no otra `Vencida`.
- Una tarea con `IsRecurring == false` → el motor no la toca, aunque cumpla todas las demás
  condiciones.
- Un fallo en el despacho de una tarea no detiene el procesamiento de las demás, y la tarea
  fallida queda con `LastAlertAt` actualizado y un `TaskAlertLog` con `Delivered = false`.

## Lo que NO debes hacer

- No implementes la escalera de incumplimiento a 5 días, arrastre, ni notificación a
  `Direccion`/`SuperUsuario`/`SupervisionOperativa` — es T-11.
- No implementes agrupación de alertas por destinatario ni tope diario más allá del throttle de
  24 horas por tarea especificado arriba — es T-10.
- No toques tareas con `IsRecurring == false`.
- No toques `RecurringTaskGenerationService.cs`, `RecurringTaskCatalogAppService.cs`, ni ningún
  archivo de T-08/T-08c/T-09.
- No registres nada en `HangfireJobCatalog.cs` — igual que T-08, este motor se activa más
  adelante, no en este ticket.
- No implementes el canal WhatsApp ni un mecanismo de confirmación de entrega más allá de lo
  especificado.
- Si algo fuera de esta lista deja de compilar por una dependencia real, corrígelo de forma
  mínima y decláralo en tu reporte.

## Convenciones aplicables

- `CONVENTIONS.md` §4.1
- Archivos en UTF-8 sin mojibake

## Verificación obligatoria

```bash
dotnet build api/LuxuryApp.sln
dotnet test api/LuxuryApp.Tests/LuxuryApp.Tests.csproj --filter TaskAlertEngineServiceTests --no-restore
node scripts/audit-conventions.mjs
node scripts/scan-mojibake.mjs api
```

Ajusta el nombre del filtro de pruebas al nombre real de tu clase de test si lo nombras distinto,
y dilo en tu reporte.

Criterio de éxito: compila sin errores nuevos, todos los tests pasan, `audit-conventions.mjs` no
aumenta de 10, mojibake en cero sobre lo tocado.

## Criterio de PASO del ticket

Los 6 escenarios de la sección de pruebas están cubiertos y pasan. Ningún test depende de en qué
día de la semana o del mes corre (usa fechas relativas a `DateOnly.FromDateTime(DateTime.Today)`,
no fechas fijas de calendario, salvo que estés probando específicamente el ajuste por festivo).

## Reporte de finalización

1. Archivos creados, con una línea de qué hace cada uno
2. Salida literal de los cuatro comandos, con el conteo de tests
3. Decisiones que tomaste por tu cuenta y por qué
4. Lo que NO hiciste del ticket y el motivo
5. Riesgos que detectaste y no estaban en este prompt

No avances al siguiente ticket. Espera la auditoría.
