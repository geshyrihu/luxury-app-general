# TICKET D11-06 — `RN-ALT-013`: una justificación aprobada saca la tarea del ciclo

Trabajas en el repositorio LuxuryApp. Antes de escribir código, lee `CONVENTIONS.md` y
`AGENTS.md`.

D11-04 (esquema) y D11-05 (servicio de solicitar/aprobar/rechazar) están aprobados. Hoy nada
consume el resultado: una `TaskJustification` puede quedar `Aprobada` y el motor de alertas sigue
alertando exactamente igual. Este ticket cierra ese hueco. Es deliberadamente pequeño — una
condición añadida en dos archivos, no un rediseño.

## Contexto — la regla exacta

`RN-ALT-013` (`../../../docs/OperationsLuxuryApp/Tasks/20260820-business-rules-operations-tasks-alertas.md:92`):
> `JustificacionAprobada` saca la tarea del ciclo. `JustificacionRechazada` la devuelve a
> `Pendiente`.

La segunda mitad **ya está resuelta y no requiere código**: `Tasks.Status` nunca cambió a ningún
estado de "Justificada" en D11-04/D11-05 (no existe ese valor en `GanttStatus`) — sigue siendo lo
que ya era. Rechazar simplemente no crea ninguna excepción nueva, así que la tarea nunca dejó de
alertar. **No hay nada que hacer para la mitad de "rechazada".**

Lo único pendiente es la primera mitad: cuando existe una `TaskJustification` con `State ==
Aprobada` para una tarea, esa tarea debe dejar de generar alertas nuevas y de escalar.

## Dónde tocar

Dos archivos, mismo patrón en ambos — ambos arrancan su consulta base de tareas con la misma
cadena de `Where`:

### 1. `TaskAlertEngineService.cs`

`api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Tasks/RecurringTaskAlerting/Services/TaskAlertEngineService.cs:16-25`,
método `RunAsync`:

```csharp
var tasks = await dbContext.Tasks
    .Include(x => x.RecurringTemplate)
    .Where(x => x.IsRecurring == true)
    .Where(x => x.ClosedDate == null)
    .Where(x => x.Status != GanttStatus.Cancelled)
    .Where(x => x.PlannedEndDate.HasValue)
    .OrderBy(x => x.CustomerId)
    .ThenBy(x => x.PlannedEndDate)
    .ThenBy(x => x.Id)
    .ToListAsync();
```

Agrega un `.Where(...)` más a esa misma cadena que excluya las tareas con una justificación
aprobada:

```csharp
.Where(x => !dbContext.TaskJustification.Any(j =>
    j.TasksId == x.Id && j.State == TaskJustificationState.Aprobada))
```

### 2. `TaskEscalationService.cs`

`api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Tasks/RecurringTaskEscalation/Services/TaskEscalationService.cs:31-41`,
método `RunAsync` — misma cadena de `Where`, mismo `.Where(...)` adicional.

## Por qué no hace falta nada más

- **No es "la más reciente gana"**: basta con que exista **alguna** fila `Aprobada` para esa
  tarea. Si hubo un rechazo antes y luego una aprobación, la tarea de todas formas queda excluida
  — es el resultado correcto (aprobada, punto). No necesitas ordenar por `RequestedAt` ni tomar la
  última fila.
- **Una `Solicitada` pendiente no excluye nada** (`RN-ALT-012`: solicitar no detiene el ciclo) —
  el filtro sólo mira `State == Aprobada`, así que esto ya sale correcto sin código adicional.
- **No toques `TaskAppService.cs`, `Program.cs`, ni ningún DTO/servicio de D11-04/D11-05.**
- **No agregues ningún `Include` de `TaskJustification`** en la consulta de tareas — el `.Any(...)`
  correlacionado no lo necesita, y evitas cargar filas que no usas.
- **No implementes notificación al jefe ni nada de frontend** — sigue fuera de alcance.

## Tests

Amplía los archivos de test ya existentes de cada servicio (no crees archivos nuevos), mismo
patrón que ya usan (`ApplicationDbContext` en memoria real, `CreateRecurringTask`/`CreateService`
helpers existentes):

**`api/LuxuryApp.Tests/Application/Modules/OperationsLuxuryApp/Tasks/RecurringTaskAlerting/TaskAlertEngineServiceTests.cs`**
1. Tarea vencida (candidata normal a `Vencida`) con una `TaskJustification` `Aprobada` sembrada →
   `RunAsync()` no genera ninguna alerta para esa tarea (`TasksEvaluated` la sigue contando, pero
   `VencidasDetected` en 0 y sin filas nuevas en `TaskAlertLog` para esa tarea).
2. Misma tarea, pero la `TaskJustification` sembrada está `Rechazada` (no `Aprobada`) → la tarea
   **sí** genera su alerta normalmente, sin cambios de comportamiento.
3. Misma tarea, con una `TaskJustification` `Solicitada` (pendiente, sin resolver) → la tarea
   **sí** sigue alertando (`RN-ALT-012`).

**`api/LuxuryApp.Tests/Application/Modules/OperationsLuxuryApp/Tasks/RecurringTaskEscalation/TaskEscalationServiceTests.cs`**
4. Tarea con 3+ días de vencida (candidata normal a escalación) con una `TaskJustification`
   `Aprobada` sembrada → `RunAsync()` no la escala, no genera fila nueva en `TaskAlertLog` para
   esa tarea.
5. Misma tarea con 5+ días vencida (candidata a incumplimiento/arrastre) y una `TaskJustification`
   `Aprobada` sembrada → tampoco se marca `BreachedAt` ni se dispara incumplimiento.

## Convenciones aplicables

- `CONVENTIONS.md` §4.1 (backend .NET 10)
- Archivos en UTF-8 sin mojibake

## Verificación obligatoria

```bash
dotnet build api/LuxuryApp.sln
dotnet test api/LuxuryApp.sln --filter "TaskAlertEngineServiceTests|TaskEscalationServiceTests"
node scripts/audit-conventions.mjs
node scripts/scan-mojibake.mjs api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Tasks/RecurringTaskAlerting api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Tasks/RecurringTaskEscalation api/LuxuryApp.Tests/Application/Modules/OperationsLuxuryApp/Tasks/RecurringTaskAlerting api/LuxuryApp.Tests/Application/Modules/OperationsLuxuryApp/Tasks/RecurringTaskEscalation
```

Pega la salida literal de los cuatro. Criterio: compila sin errores nuevos, **todos** los tests de
ambos archivos pasan (los preexistentes y los 5 nuevos), `audit-conventions.mjs` no aumenta de 10,
mojibake en cero sobre lo tocado.

## Reporte de finalización

1. Archivos tocados, con una línea de qué cambió en cada uno
2. Salida literal de los cuatro comandos
3. Decisiones que tomaste por tu cuenta y por qué
4. Lo que NO hiciste y el motivo
5. Riesgos detectados que no estaban en este prompt

No avances al siguiente ticket. Espera la auditoría.
