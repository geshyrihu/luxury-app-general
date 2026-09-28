# TICKET T-13a — Esquema: reapuntar `TaskAttachment` + crear `TaskChecklistItem`

Trabajas en el repositorio LuxuryApp (.NET 10, `api/`). Antes de escribir código, lee
`CONVENTIONS.md` y `AGENTS.md`. **Este ticket es sólo esquema** (entidades + migración EF Core),
sin lógica de negocio, sin servicios nuevos, sin endpoints, sin frontend — mismo patrón que T-03,
T-07 y T-09 en esta misma orquestación: primero el esquema se audita solo, después la lógica
(vendrá en T-13b/T-13c).

## Contexto

El plan base (`../../../docs/OperationsLuxuryApp/Tasks/20260820-plan-operations-tasks-alertas-v2.md`,
GAPs G-15 y G-16) exige dos cosas para el cierre de tareas críticas:

1. **Comprobante documental** — ya existe la entidad `TaskAttachment` (tabla física `TaskFiles`,
   `api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Operations/TaskEngine/TaskAttachment.cs`),
   pero apunta al motor viejo que se retira en T-15: hoy tiene `TaskInstanceId` (obligatorio, FK a
   `TaskInstance`) y `TaskTemplateId` (obligatorio, FK a `TaskTemplate`). Hay que **reapuntarla**
   al motor único: `TasksId` (FK a `Tasks`) y `RecurringTemplateId` (FK a `RecurringTaskTemplate`,
   nullable).
2. **Checklist de pasos** — no existe ninguna entidad. Hay que crearla: `TaskChecklistItem`.

Este ticket **no toca** `CloseTaskAsync` (`TaskAppService.cs:875`) ni ningún endpoint — esa
validación de "cierre endurecido" es T-13c, después de que este esquema esté aprobado.

## Riesgo de datos (ya evaluado, bajo)

`../../../docs/OperationsLuxuryApp/Tasks/20260820-plan-operations-tasks-alertas-v2.md:464` clasifica el
reapunte de `TaskFiles` como **"Bajo — sin datos en uso"**, a diferencia del borrado destructivo
de F7 (que sí exige conteo y respaldo antes de tocarse). No se requiere script de verificación de
filas para este ticket, pero si al generar la migración `dotnet ef migrations add` reporta datos
existentes en `TaskFiles` que no puedan reasignarse (por ejemplo, si `TaskInstanceId` no tiene
equivalente en `Tasks`), **detente y repórtalo** en vez de forzar un `UPDATE` que invente datos.

## Tarea 1 — Reapuntar `TaskAttachment`

Archivo: `api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Operations/TaskEngine/TaskAttachment.cs`

Cambia:
- `public Guid TaskInstanceId { get; set; }` + `public TaskInstance TaskInstance { get; set; }`
  → `public Guid TasksId { get; set; }` + `public Tasks Tasks { get; set; }` (obligatorio, igual
  que hoy — sigue las mismas convenciones de nombre de propiedad de navegación que
  `TaskAlertLog.cs:9-10` en el mismo directorio: `TasksId` + `Tasks Tasks`).
- `public Guid TaskTemplateId { get; set; }` + `public TaskTemplate TaskTemplate { get; set; }`
  → `public Guid? RecurringTemplateId { get; set; }` + `public RecurringTaskTemplate
  RecurringTemplate { get; set; }` (**nullable**, tal como indica el plan — no todo adjunto viene
  de una plantilla recurrente).

No toques los campos de archivo (`FilePath`, `MimeType`, `FileName`, `CreatedAt`, `CreatedBy`) — el
plan es explícito en que se conservan tal cual.

Agrega `[Table("TaskFiles")]` si no está ya (ya está, no lo dupliques) y un índice
`[Index(nameof(TasksId))]` sobre la clase, siguiendo el mismo patrón de
`TaskAlertLog.cs:3` (`[Index(nameof(TasksId), nameof(AlertType), nameof(SentAt))]`) pero sólo con
`TasksId` — no hay más columnas de filtro frecuente todavía.

## Tarea 2 — Crear `TaskChecklistItem`

Archivo nuevo:
`api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Operations/TaskEngine/TaskChecklistItem.cs`

Copia la estructura exacta de `TaskAlertLog.cs` como referencia de convención (namespace,
`GuidIdEntity`, `[Table(...)]`, `[Index(...)]`, `[Required]`, `[Column(...)]`), con estos campos —
tomados literalmente del ER del plan (`../../../docs/HumanResourcesLuxuryApp/HrPolicyEngine/20260902-plan-hr-policy-engine.md:204-210`):

```csharp
[Index(nameof(TasksId))]
[Table("TaskChecklistItems")]
public class TaskChecklistItem : GuidIdEntity
{
    [Required]
    [Column("TasksId")]
    public Guid TasksId { get; set; }
    public Tasks Tasks { get; set; }

    [Required]
    [MaxLength(300)]
    [Display(Name = "Descripción")]
    [Column("Description")]
    public string Description { get; set; }

    [Required]
    [Column("IsDone")]
    public bool IsDone { get; set; } = false;

    [Column("DoneByUserId")]
    public string DoneByUserId { get; set; }

    [ForeignKey("DoneByUserId")]
    public ApplicationUser DoneByUser { get; set; }

    [Column("DoneAt")]
    public DateTime? DoneAt { get; set; }
}
```

Ajusta el `using`/namespace exacto al que ya usa `TaskAlertLog.cs` si difiere de lo mostrado arriba
— cópialo del archivo real, no de este ejemplo, si hay diferencias de convención del proyecto.

## Tarea 3 — Registrar en `ApplicationDbContext`

Archivo: `api/LuxuryApp.Infrastructure.Data/Data/ApplicationDbContext.cs`

Junto al `DbSet<TaskAlertLog>` existente (línea ~473), agrega:

```csharp
public DbSet<TaskChecklistItem> TaskChecklistItem { get; set; }
```

Sigue el mismo estilo de nombre de propiedad (singular, como `TaskAlertLog`, `TaskAttachment` —
no lo pluralices aunque la tabla física sí lo esté).

## Tarea 4 — Migración

Genera la migración EF Core de la forma estándar del proyecto (revisa cómo se generaron las tres
migraciones más recientes en `api/LuxuryApp.Infrastructure.Data/Data/Migrations/` —
`20260821144014_RecurringTaskTemplateAlertsFields`, `20260821144714_TasksAlertFieldsAndIndices`,
`20260821155307_TaskAlertLog` — mismo comando, mismo proyecto de arranque). Nombra la migración
`TaskChecklistItemAndAttachmentRepoint`.

**No asumas el nombre físico de ninguna tabla ni columna** — la migración debe reflejar
exactamente lo que las anotaciones de las entidades declaran (`[Table]`/`[Column]`), tal como se
corrigió el criterio en la auditoría de T-07 (`../../../docs/OperationsLuxuryApp/Tasks/20260820-plan-operations-tasks-alertas.md`,
sección "Reversión de diagnóstico — T-07 / T-07b").

## Lo que NO debes hacer

- No modifiques `CloseTaskAsync`, ningún endpoint, ni ningún servicio de aplicación.
- No crees frontend, DTOs, ni AutoMapper profiles nuevos.
- No toques `TaskInstance` ni `TaskTemplate` (las entidades del motor viejo) — sólo cambias a qué
  apuntan las FKs de `TaskAttachment`, no borras nada del motor viejo (eso es F7 / T-15).
- No implementes la validación de "comprobante obligatorio" ni "checklist completo" — es T-13c.

## Verificación obligatoria

```bash
dotnet build api/LuxuryApp.sln
```

Pega la salida literal. Si el proyecto tiene una base de datos de desarrollo accesible y es
práctica ya establecida en tickets anteriores de esta orquestación aplicar la migración
(`dotnet ef database update`), hazlo y pega el resultado; si no, dilo explícitamente en el reporte
en vez de omitirlo.

## Criterio de PASO

- `TaskAttachment` compila con `TasksId`/`Tasks` y `RecurringTemplateId`/`RecurringTemplate`
  (nullable), sin rastro de `TaskInstanceId`/`TaskTemplateId`.
- `TaskChecklistItem` existe, con los 5 campos del ER del plan, registrada en
  `ApplicationDbContext`.
- La migración generada no inventa nombres de tabla/columna — coincide con las anotaciones.
- `dotnet build` pasa sin errores nuevos.

## Reporte de finalización

1. Archivos creados/modificados, con una línea de qué cambió en cada uno
2. Salida literal de `dotnet build` (y de `dotnet ef database update` si aplica)
3. Decisiones que tomaste por tu cuenta y por qué
4. Lo que NO hiciste del ticket y el motivo
5. Riesgos detectados que no estaban en este prompt (en particular: si encontraste filas
   existentes en `TaskFiles` que complican el reapunte, repórtalo aquí en vez de improvisar una
   migración de datos)

No avances al siguiente ticket. Espera la auditoría.
