# TICKET T-07c — Regenerar las migraciones de T-03 y T-07

Trabajas en el repositorio LuxuryApp. Este ticket **no cambia ninguna entidad**: las de T-03
(`RecurringTaskTemplate`) y T-07 (`Tasks`) ya están correctas y completas. Lo único que falta es
volver a generar sus migraciones, que fueron eliminadas durante una reversión de base de datos.

## Contexto

Las migraciones `RecurringTaskTemplateAlertsFields` (T-03) y `TasksAlertFieldsAndIndices` (T-07)
se generaron, se auditaron y quedaron aprobadas. Después, el dueño del módulo revirtió la base de
datos a la que se habían aplicado por accidente —`Program.cs` corre
`await dbContext.Database.MigrateAsync()` en cada arranque de la API, así que cualquier migración
presente en la carpeta se aplica sola la próxima vez que alguien levanta el servicio— y en el
proceso **eliminó los archivos de ambas migraciones** (`.cs` y `.Designer.cs`) junto con su
efecto en `ApplicationDbContextModelSnapshot.cs`.

Las entidades en C# **no se tocaron**: siguen teniendo todos los campos e índices de T-03 y T-07.
Sólo falta que exista de nuevo la migración que los traduce a cambios de esquema.

**Dato importante, ya confirmado por el dueño del módulo con acceso directo a la base de datos:
el nombre físico real de la tabla de `Tasks` es `Task` (singular), no `Tasks`.** La entidad
declara `[Table("Tasks")]`, y aun así el nombre real es `Task` — probablemente por un mecanismo a
nivel de base de datos (posible sinónimo) que no está documentado en el código. **Esto es
correcto y esperado, no un error a corregir.** Cuando regeneres la migración de `Tasks`, es
normal y correcto que EF Core produzca `table: "Task"` en las operaciones — no lo cambies a
`"Tasks"` bajo ninguna circunstancia. Ya se intentó esa "corrección" antes (ticket T-07b) y
quedó descartada por evidencia real: la migración con `"Task"` es la que funciona.

## Tarea

Regenera, en este orden, las dos migraciones — mantenlas **separadas**, no las combines en una
sola, para conservar la trazabilidad de auditoría que ya existía:

### 1. Migración de `RecurringTaskTemplate` (equivalente a T-03)

Genera la migración para los cambios ya presentes en
`api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Operations/TaskEngine/RecurringTaskTemplate.cs`
(implementa `ITenantEntity`, `RecurrenceRule`, `Criticality`, `AdvanceNoticeDays`, `BackupUserId`,
`ExpectedDeliverableName`, `RequiresAttachment`, índice `(CustomerId, WorkGroupId)`).

Nómbrala igual que antes: `RecurringTaskTemplateAlertsFields`.

**Debe incluir el mismo backfill de datos que la versión original tenía** (si tu herramienta no
lo genera automáticamente, agrégalo a mano, igual que se hizo la primera vez):
- `CustomerId` relleno desde `TaskWorkGroups.CustomerId` vía `JOIN` sobre `WorkGroupId`.
- `Criticality = 1` (Low), `AdvanceNoticeDays = 3`, `RequiresAttachment = 0` por defecto donde sea
  nulo.
- `RecurrenceRule` construida desde los campos legados `Pattern`/`Interval`/`DayOfWeek`/
  `DayOfMonth` con el mismo `CASE` que la versión original (Daily/Weekly/Monthly/Yearly/
  EveryXDays → RRULE correspondiente; cualquier otro valor → `'FREQ=DAILY;INTERVAL=1'`).

**No debe contener `DropColumn`** para `Pattern`, `Interval`, `DayOfWeek`, `DayOfMonth` — esas
columnas se quedan en la base de datos aunque ya no estén en la clase C#, igual que la primera
vez. Si tu herramienta genera un `DropColumn` automático para ellas, edítalo a mano para
quitarlo.

### 2. Migración de `Tasks` (equivalente a T-07)

Genera la migración para los cambios ya presentes en
`api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Operations/TaskEngine/Tasks.cs`
(`BreachedAt`, `LastAlertAt`, `RecurrenceSourceDate`, y los 3 índices
`(CustomerId, Status, PlannedEndDate)`, `(RecurringTemplateId, PlannedEndDate)`,
`(WorkGroupId, Status)`).

Nómbrala igual que antes: `TasksAlertFieldsAndIndices`.

Es 100% aditiva: los tres campos son `DateTime?`, sin backfill necesario.

**Verifica que apunte a `table: "Task"` (singular).** Si tu herramienta genera `"Tasks"` en vez de
`"Task"`, algo cambió respecto al estado anterior — detente y repórtalo en vez de continuar,
porque significaría que el snapshot base ya no coincide con lo que sabemos del entorno real.

## Lo que NO debes hacer

- No toques ninguna entidad — ya están correctas.
- No toques `LuxuryApp.Api/Program.cs`. El `MigrateAsync()` automático está comentado a propósito
  por el dueño del módulo, como medida de protección mientras se sigue iterando el esquema. No lo
  reactives ni lo comentes de otra forma.
- No ejecutes `dotnet ef database update` en este ticket. Sólo generar los archivos.
- No toques ningún servicio, endpoint, ni la carpeta `RecurringTaskCatalog/` de T-04.
- No cambies `"Task"` a `"Tasks"` en ninguna parte de la migración de `Tasks` — es intencional.

## Convenciones aplicables

- `CONVENTIONS.md` §4.1
- Archivos en UTF-8 sin mojibake

## Verificación obligatoria

Corre y **pega la salida literal** de:

```bash
dotnet build api/LuxuryApp.sln
node scripts/audit-conventions.mjs
node scripts/scan-mojibake.mjs api
```

No apliques la migración a ninguna base de datos.

Criterio de éxito:
- La compilación pasa sin errores nuevos
- `audit-conventions.mjs` **no aumenta** su conteo actual de 10 errores
- `scan-mojibake.mjs` da cero sobre los archivos que tocaste
- La migración de `Tasks` apunta a `"Task"` (singular) — si no, repórtalo y detente

## Criterio de PASO del ticket

Pega en tu reporte el contenido completo de `Up()` de ambas migraciones, para poder compararlas
contra las que ya se auditaron en T-03 y T-07.

## Reporte de finalización

1. Archivos creados, con una línea de qué contiene cada uno
2. Salida literal de los tres comandos
3. Confirmación explícita de que `Tasks` sigue apuntando a `"Task"` singular
4. Cualquier diferencia que notes entre estas migraciones regeneradas y lo que describen los
   prompts originales de T-03/T-07 (por ejemplo, si el backfill salió distinto)
5. Riesgos que detectaste y no estaban en este prompt

No avances al siguiente ticket. Espera la auditoría.
