# TICKET D11-04 — Enum `TaskJustificationState` + entidad `TaskJustification` y su migración

Trabajas en el repositorio LuxuryApp. Antes de escribir código, lee `CONVENTIONS.md` y
`AGENTS.md`.

Este ticket **es sólo esquema**, siguiendo el mismo patrón que T-09 y T-13a de
`../../../docs/OperationsLuxuryApp/Tasks/20260820-plan-operations-tasks-alertas.md`: la entidad y su migración,
nada de lógica de negocio, ningún servicio, ningún endpoint, ningún frontend. El servicio que la
usa es el ticket siguiente (D11-05).

## Contexto

Es la retoma de **T-12** de la orquestación de Alertas de Tareas Recurrentes, que quedó bloqueada
esperando este mismo refactor (`../../../docs/OperationsLuxuryApp/Tasks/20260820-plan-operations-tasks-alertas.md`,
tablero, fila T-12). El bloqueo era `OrgHierarchy` anclado a `WorkPosition`, sin `CustomerId` — ya
resuelto por D11-01/01b/02/03: `OrgHierarchy` ahora es rol→rol, con `CustomerId` obligatorio, y
`WorkPositionOrgChartAppService.cs` ya resuelve el árbol sobre roles.

Una tarea crítica vencida no siempre puede cerrarse a tiempo. `TaskJustification` es el registro
de que el responsable **solicitó una justificación con motivo escrito**, y de que su jefe (resuelto
vía `OrgHierarchy` por rol) la aprobó o la rechazó. Reglas de negocio que definen esta entidad
(`../../../docs/OperationsLuxuryApp/Tasks/20260820-business-rules-operations-tasks-alertas.md`):

- `RN-ALT-012`: `Justificada` **no es un estado terminal** — queda en espera de aprobación y no
  detiene el ciclo de alertas.
- `RN-ALT-013`: `JustificacionAprobada` saca la tarea del ciclo de alertas. `JustificacionRechazada`
  la devuelve a `Pendiente`.
- `RN-ALT-023`: aprobar o rechazar es del jefe del responsable, resuelto vía `OrgHierarchy`. **El
  responsable no puede aprobar la suya** (`RN-ALT-004`).
- `RN-ALT-035`: motivo escrito obligatorio, mínimo 20 caracteres.

**Ninguna de estas cuatro reglas se implementa en este ticket.** Son lógica de servicio — las
resuelve D11-05. Aquí sólo defines la forma de los datos que esa lógica va a necesitar.

## Tareas de Backend

### 1. Enum `TaskJustificationState`

Archivo nuevo: `api/LuxuryApp.Shared/Enums/TaskJustificationState.cs`

```csharp
namespace LuxuryApp.Shared.Enums;

public enum TaskJustificationState
{
    [Display(Name = "Solicitada")]
    Solicitada,

    [Display(Name = "Aprobada")]
    Aprobada,

    [Display(Name = "Rechazada")]
    Rechazada
}
```

Regístralo en `api/LuxuryApp.Application/Moduls/SharedLuxuryApp/Endpoints/SelectItemEnumEndPoints.cs`
con `Map<TaskJustificationState>(...)`, mismo patrón que los enums vecinos ya registrados ahí
(por ejemplo `Map<TaskAlertType>("task-alert-type", "EnumSelectItem_GetTaskAlertType", "Consulta de
tipo de alerta de tarea.")` en la línea 80). Elige una ruta (`task-justification-state`) y un
nombre de acción descriptivo, coherente con los existentes.

**No reutilices ni modifiques `GanttStatus`** (`api/LuxuryApp.Shared/Enums/GanttStatus.cs`) — el
estado de la tarea (`Tasks.Status`) y el estado de su justificación son cosas distintas y viven en
tablas distintas. `Tasks.Status` no cambia en este ticket ni la tendrá que cambiar D11-05: la
tarea sigue "vencida" (calculada) incluso con una justificación aprobada; lo que cambia es que
deja de generar alertas nuevas, no su `Status`.

### 2. Entidad `TaskJustification`

Archivo nuevo:
`api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Operations/TaskEngine/TaskJustification.cs`

```csharp
namespace LuxuryApp.Infrastructure.Data.Entities;

[Index(nameof(TasksId), nameof(State))]
[Table("TaskJustifications")]
public class TaskJustification : GuidIdEntity
{
    [Required]
    [Column("TasksId")]
    public Guid TasksId { get; set; }
    public Tasks Tasks { get; set; }

    [Required]
    [MinLength(20)]
    [MaxLength(1000)]
    [Display(Name = "Motivo")]
    [Column("Reason")]
    public string Reason { get; set; }

    [Required]
    [Column("RequestedByUserId")]
    public string RequestedByUserId { get; set; }

    [ForeignKey("RequestedByUserId")]
    public ApplicationUser RequestedByUser { get; set; }

    [Column("ApprovedByUserId")]
    public string ApprovedByUserId { get; set; }

    [ForeignKey("ApprovedByUserId")]
    public ApplicationUser ApprovedByUser { get; set; }

    [Required]
    public TaskJustificationState State { get; set; } = TaskJustificationState.Solicitada;

    [Required]
    [Column("RequestedAt")]
    public DateTime RequestedAt { get; set; } = DateTime.UtcNow;

    [Column("ResolvedAt")]
    public DateTime? ResolvedAt { get; set; }
}
```

Ajusta nombres/tipos si algo no coincide exactamente con las convenciones de las entidades vecinas
en la misma carpeta (`TaskChecklistItem.cs`, `TaskAlertLog.cs`) — sigue el mismo estilo de
anotaciones que ya usan. `ApprovedByUserId` y `ResolvedAt` son nulables a propósito: quedan vacíos
mientras el estado es `Solicitada`.

**No agregues ninguna restricción a nivel de base de datos que impida `ApprovedByUserId ==
RequestedByUserId`** (ni `CHECK`, ni validación en `OnModelCreating`). Esa es exactamente
`RN-ALT-004`, y se valida en el servicio de D11-05 — ahí se resuelve contra `OrgHierarchy`, no es
una comparación de igualdad simple que la base de datos pueda expresar sola.

**Nota, no requiere ninguna acción de tu parte:** `Tasks` declara `[Table("Tasks")]`, pero el
nombre físico real de esa tabla es `Task` (singular) — ya documentado y verificado en T-07/T-08 de
la otra orquestación, y usado sin incidentes en las migraciones de T-09 y T-13a
(`principalTable: "Task"`). La relación FK funciona igual a través de EF sin que tengas que hacer
nada especial; sólo es para que no te sorprenda si lo ves al revisar la migración generada.

### 3. `ApplicationDbContext`

Agrega `public DbSet<TaskJustification> TaskJustification { get; set; }` junto a los `DbSet`
vecinos del submódulo Task Engine (`TaskChecklistItem`, `TaskAlertLog`) en
`api/LuxuryApp.Infrastructure.Data/Data/ApplicationDbContext.cs` (región "Sub-módulo: Gestión de
Tareas (Task Engine)").

### 4. Migración

Genera la migración. Nómbrala `TaskJustification`. Es una tabla nueva, completamente aditiva — no
hay backfill posible ni necesario.

## Lo que NO debes hacer

- No implementes `ITaskJustificationService` ni ningún servicio que escriba en esta tabla — eso es
  D11-05.
- No toques `TaskEscalationService.cs` ni `TaskAlertEngineService.cs` — son los que en D11-05
  tendrán que empezar a consultar si existe una justificación `Aprobada` vigente antes de escalar
  o alertar (`RN-ALT-013`). No adelantes esa lógica aquí.
- No toques `TaskAppService.cs` (`CloseTaskAsync`) ni ningún otro servicio existente.
- No modifiques `GanttStatus` ni ningún otro enum compartido existente.
- No apliques la migración a ninguna base de datos.
- No toques `Program.cs`.

## Convenciones aplicables

- `CONVENTIONS.md` §4.1, y las reglas críticas 6/7 (SELECT centralizado, `DisplayName` en
  español) para el enum nuevo
- Archivos en UTF-8 sin mojibake

## Verificación obligatoria

```bash
dotnet build api/LuxuryApp.sln
node scripts/audit-conventions.mjs
node scripts/scan-mojibake.mjs api
```

Pega la salida literal de los tres. Criterio: compila sin errores nuevos, `audit-conventions.mjs`
no aumenta de 10, mojibake en cero sobre lo tocado.

## Criterio de PASO del ticket

Pega en tu reporte el contenido completo de `Up()` de la migración.

## Reporte de finalización

1. Archivos creados/tocados, con una línea de qué hace cada uno
2. Salida literal de los tres comandos
3. Decisiones que tomaste por tu cuenta y por qué
4. Lo que NO hiciste y el motivo
5. Riesgos detectados que no estaban en este prompt

No avances al siguiente ticket. Espera la auditoría.
