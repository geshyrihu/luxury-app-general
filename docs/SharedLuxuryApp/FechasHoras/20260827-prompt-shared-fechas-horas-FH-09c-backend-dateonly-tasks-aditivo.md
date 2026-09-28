# TICKET FH-09c — Backend: columnas `DateOnly?` aditivas + backfill (Tasks)

Trabajas en el repositorio LuxuryApp (.NET 10, `api/`). Antes de escribir código, lee
`CONVENTIONS.md` y `conventions/backend/backend-rules.md` (sección "🔴 REGLA
CRÍTICA: Fechas y horas..."). Lee también
`docs/reporte_maestro/temas-transversales/20260826-auditoria-manejo-fechas-horas.md`, sección 5.4
("Estrategia de migración segura") — este ticket implementa **solo los pasos 1 y 2** de esa
estrategia, igual que `FH-09a`/`FH-09b` (ya cerrados y aprobados) — úsalos de referencia de estilo.

## Contexto

FH-07 (diagnóstico, ya cerrado) resolvió, campo por campo, cuáles de los 14 campos `DateTime`
involucrados son candidatos a `DateOnly` y con qué criterio de día:

- 12 campos (8 de `Task`, 3 de `TaskInstance`, 1 de `TaskMessageReads`) tienen **0 filas pobladas**
  hoy — sin riesgo, se agregan de forma aditiva por consistencia hacia adelante.
- `Task.ScheduledDate` y `TaskWorkPlan.SendDate` sí tienen datos con variación horaria real, pero
  verificado en código que el negocio nunca consume la hora (siempre se muestran como
  `"dd-MMM-yy"`) — candidatos confirmados.
- **`Task.ClosedDate` queda EXCLUIDO de este ticket.** El usuario confirmó explícitamente que la
  hora de cierre sí importa para el negocio (se muestra con `HH:mm` en al menos un punto de
  `TaskAppService.cs`). No agregues ninguna columna relacionada con `ClosedDate`, no lo toques de
  ninguna forma.

En los 4 casos, el criterio de día es el mismo que en FH-05/06: **día calendario de México**.

Catorce campos, cuatro entidades:

| Entidad | Campo `DateTime` existente | Tipo | Tabla física | Nueva propiedad |
|---|---|---|---|---|
| `Tasks` (`Operations/TaskEngine/Tasks.cs`) | `ScheduledDate` | `DateTime?` | `Task` | `ScheduledDay` |
| `Tasks` | `BreachedAt` | `DateTime?` | `Task` | `BreachedDay` |
| `Tasks` | `LastAlertAt` | `DateTime?` | `Task` | `LastAlertDay` |
| `Tasks` | `RecurrenceSourceDate` | `DateTime?` | `Task` | `RecurrenceSourceDay` |
| `Tasks` | `PlannedStartDate` | `DateTime?` | `Task` | `PlannedStartDay` |
| `Tasks` | `PlannedEndDate` | `DateTime?` | `Task` | `PlannedEndDay` |
| `Tasks` | `ActualStartDate` | `DateTime?` | `Task` | `ActualStartDay` |
| `Tasks` | `ActualEndDate` | `DateTime?` | `Task` | `ActualEndDay` |
| `Tasks` | `RecurrenceEndDate` | `DateTime?` | `Task` | `RecurrenceEndDay` |
| `TaskInstance` | `ScheduledDate` | `DateTime` (no nulo) | `TaskInstances` | `ScheduledDay` |
| `TaskInstance` | `DueDate` | `DateTime?` | `TaskInstances` | `DueDay` |
| `TaskInstance` | `CreatedFromRecurrenceDate` | `DateTime?` | `TaskInstances` | `CreatedFromRecurrenceDay` |
| `TaskMessageReads` | `ReadingDate` | `DateTime` (no nulo) | `TaskMessageReads` | `ReadingDay` |
| `TaskWorkPlan` | `SendDate` | `DateTime` (no nulo) | `TaskWorkPlans` | `SendDay` |

**Este ticket NO renombra ni toca los 14 campos `DateTime` existentes (ni `ClosedDate`), y NO toca
ningún DTO ni servicio de aplicación.** Solo agrega, por cada uno, una columna nueva, nullable, tipo
`DateOnly?`, y hace el backfill verificado (no-op donde la tabla está vacía).

## Tarea 1 — `Tasks.cs`

Archivo: `api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Operations/TaskEngine/Tasks.cs`

Después de `ScheduledDate` (línea ~88, justo antes del comentario de `BreachedAt`):
```csharp
/// <summary>Día calendario de México derivado de <see cref="ScheduledDate"/> UTC. Columna aditiva
/// para migración a DateOnly — no reemplaza a ScheduledDate todavía.</summary>
public DateOnly? ScheduledDay { get; set; }
```

Después de `BreachedAt` (línea ~92):
```csharp
/// <summary>Día calendario de México derivado de <see cref="BreachedAt"/> UTC. Columna aditiva
/// para migración a DateOnly — no reemplaza a BreachedAt todavía.</summary>
public DateOnly? BreachedDay { get; set; }
```

Después de `LastAlertAt` (línea ~96):
```csharp
/// <summary>Día calendario de México derivado de <see cref="LastAlertAt"/> UTC. Columna aditiva
/// para migración a DateOnly — no reemplaza a LastAlertAt todavía.</summary>
public DateOnly? LastAlertDay { get; set; }
```

Después de `RecurrenceSourceDate` (línea ~100):
```csharp
/// <summary>Día calendario de México derivado de <see cref="RecurrenceSourceDate"/> UTC. Columna
/// aditiva para migración a DateOnly — no reemplaza a RecurrenceSourceDate todavía.</summary>
public DateOnly? RecurrenceSourceDay { get; set; }
```

Después de `PlannedStartDate` (línea ~108):
```csharp
/// <summary>Día calendario de México derivado de <see cref="PlannedStartDate"/> UTC. Columna
/// aditiva para migración a DateOnly — no reemplaza a PlannedStartDate todavía.</summary>
public DateOnly? PlannedStartDay { get; set; }
```

Después de `PlannedEndDate` (línea ~111):
```csharp
/// <summary>Día calendario de México derivado de <see cref="PlannedEndDate"/> UTC. Columna aditiva
/// para migración a DateOnly — no reemplaza a PlannedEndDate todavía.</summary>
public DateOnly? PlannedEndDay { get; set; }
```

Después de `ActualStartDate` (línea ~114):
```csharp
/// <summary>Día calendario de México derivado de <see cref="ActualStartDate"/> UTC. Columna aditiva
/// para migración a DateOnly — no reemplaza a ActualStartDate todavía.</summary>
public DateOnly? ActualStartDay { get; set; }
```

Después de `ActualEndDate` (línea ~117):
```csharp
/// <summary>Día calendario de México derivado de <see cref="ActualEndDate"/> UTC. Columna aditiva
/// para migración a DateOnly — no reemplaza a ActualEndDate todavía.</summary>
public DateOnly? ActualEndDay { get; set; }
```

Después de `RecurrenceEndDate` (línea ~261):
```csharp
/// <summary>Día calendario de México derivado de <see cref="RecurrenceEndDate"/> UTC. Columna
/// aditiva para migración a DateOnly — no reemplaza a RecurrenceEndDate todavía.</summary>
public DateOnly? RecurrenceEndDay { get; set; }
```

**No toques `ClosedDate` (línea ~84) — déjalo exactamente como está, sin ninguna propiedad nueva
asociada.**

## Tarea 2 — `TaskInstance.cs`

Archivo: `api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Operations/TaskEngine/TaskInstance.cs`

Después de `ScheduledDate` (línea ~66), `DueDate` (línea ~71) y `CreatedFromRecurrenceDate` (línea
~91), agrega respectivamente:
```csharp
/// <summary>Día calendario de México derivado de <see cref="ScheduledDate"/> UTC. Columna aditiva
/// para migración a DateOnly — no reemplaza a ScheduledDate todavía.</summary>
public DateOnly? ScheduledDay { get; set; }
```
```csharp
/// <summary>Día calendario de México derivado de <see cref="DueDate"/> UTC. Columna aditiva para
/// migración a DateOnly — no reemplaza a DueDate todavía.</summary>
public DateOnly? DueDay { get; set; }
```
```csharp
/// <summary>Día calendario de México derivado de <see cref="CreatedFromRecurrenceDate"/> UTC.
/// Columna aditiva para migración a DateOnly — no reemplaza a CreatedFromRecurrenceDate
/// todavía.</summary>
public DateOnly? CreatedFromRecurrenceDay { get; set; }
```

## Tarea 3 — `TaskMessageReads.cs`

Archivo: `api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Operations/TaskEngine/TaskMessageReads.cs`

Después de `ReadingDate` (línea ~17):
```csharp
/// <summary>Día calendario de México derivado de <see cref="ReadingDate"/> UTC. Columna aditiva
/// para migración a DateOnly — no reemplaza a ReadingDate todavía.</summary>
public DateOnly? ReadingDay { get; set; }
```

## Tarea 4 — `TaskWorkPlan.cs`

Archivo: `api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Operations/TaskEngine/TaskWorkPlan.cs`

Después de `SendDate` (línea ~22):
```csharp
/// <summary>Día calendario de México derivado de <see cref="SendDate"/> UTC. Columna aditiva para
/// migración a DateOnly — no reemplaza a SendDate todavía.</summary>
public DateOnly? SendDay { get; set; }
```

## Migración EF Core

Genera la migración con `dotnet ef migrations add DateOnlyTasksAditivo` — debería salir como 14
`AddColumn<DateOnly>(..., nullable: true)`, sin tocar ninguna columna existente (y sin ningún
`AddColumn` relacionado con `ClosedDate`). **Verifica que sea así antes de continuar.**

Luego edita el `Up()` generado para agregar el backfill, después de los 14 `AddColumn`:

```csharp
migrationBuilder.Sql(@"
UPDATE Task SET ScheduledDay =
    CAST(ScheduledDate AT TIME ZONE 'UTC' AT TIME ZONE 'Central Standard Time (Mexico)' AS date)
WHERE ScheduledDate IS NOT NULL AND ScheduledDay IS NULL;

UPDATE Task SET BreachedDay =
    CAST(BreachedAt AT TIME ZONE 'UTC' AT TIME ZONE 'Central Standard Time (Mexico)' AS date)
WHERE BreachedAt IS NOT NULL AND BreachedDay IS NULL;

UPDATE Task SET LastAlertDay =
    CAST(LastAlertAt AT TIME ZONE 'UTC' AT TIME ZONE 'Central Standard Time (Mexico)' AS date)
WHERE LastAlertAt IS NOT NULL AND LastAlertDay IS NULL;

UPDATE Task SET RecurrenceSourceDay =
    CAST(RecurrenceSourceDate AT TIME ZONE 'UTC' AT TIME ZONE 'Central Standard Time (Mexico)' AS date)
WHERE RecurrenceSourceDate IS NOT NULL AND RecurrenceSourceDay IS NULL;

UPDATE Task SET PlannedStartDay =
    CAST(PlannedStartDate AT TIME ZONE 'UTC' AT TIME ZONE 'Central Standard Time (Mexico)' AS date)
WHERE PlannedStartDate IS NOT NULL AND PlannedStartDay IS NULL;

UPDATE Task SET PlannedEndDay =
    CAST(PlannedEndDate AT TIME ZONE 'UTC' AT TIME ZONE 'Central Standard Time (Mexico)' AS date)
WHERE PlannedEndDate IS NOT NULL AND PlannedEndDay IS NULL;

UPDATE Task SET ActualStartDay =
    CAST(ActualStartDate AT TIME ZONE 'UTC' AT TIME ZONE 'Central Standard Time (Mexico)' AS date)
WHERE ActualStartDate IS NOT NULL AND ActualStartDay IS NULL;

UPDATE Task SET ActualEndDay =
    CAST(ActualEndDate AT TIME ZONE 'UTC' AT TIME ZONE 'Central Standard Time (Mexico)' AS date)
WHERE ActualEndDate IS NOT NULL AND ActualEndDay IS NULL;

UPDATE Task SET RecurrenceEndDay =
    CAST(RecurrenceEndDate AT TIME ZONE 'UTC' AT TIME ZONE 'Central Standard Time (Mexico)' AS date)
WHERE RecurrenceEndDate IS NOT NULL AND RecurrenceEndDay IS NULL;

UPDATE TaskInstances SET ScheduledDay =
    CAST(ScheduledDate AT TIME ZONE 'UTC' AT TIME ZONE 'Central Standard Time (Mexico)' AS date)
WHERE ScheduledDay IS NULL;

UPDATE TaskInstances SET DueDay =
    CAST(DueDate AT TIME ZONE 'UTC' AT TIME ZONE 'Central Standard Time (Mexico)' AS date)
WHERE DueDate IS NOT NULL AND DueDay IS NULL;

UPDATE TaskInstances SET CreatedFromRecurrenceDay =
    CAST(CreatedFromRecurrenceDate AT TIME ZONE 'UTC' AT TIME ZONE 'Central Standard Time (Mexico)' AS date)
WHERE CreatedFromRecurrenceDate IS NOT NULL AND CreatedFromRecurrenceDay IS NULL;

UPDATE TaskMessageReads SET ReadingDay =
    CAST(ReadingDate AT TIME ZONE 'UTC' AT TIME ZONE 'Central Standard Time (Mexico)' AS date)
WHERE ReadingDay IS NULL;

UPDATE TaskWorkPlans SET SendDay =
    CAST(SendDate AT TIME ZONE 'UTC' AT TIME ZONE 'Central Standard Time (Mexico)' AS date)
WHERE SendDay IS NULL;
");
```

El `Down()` generado por EF (14 `DropColumn`) no necesita cambios.

**No ejecutes `dotnet ef database update`** — igual que en el resto de este proyecto.

## Lo que NO debes hacer

- No toques `Task.ClosedDate` de ninguna forma — ni agregarle una columna `Day`, ni tocar su tipo,
  nombre o nullability. Es una exclusión explícita, no un olvido.
- No toques los otros 14 campos `DateTime`/`DateTime?` existentes — ni su tipo, ni su nombre, ni su
  `[Column(...)]`, ni su nullability.
- No toques ningún DTO, servicio de aplicación, ni endpoint.
- No hagas `AlterColumn` para endurecer ninguna columna nueva a `NOT NULL`.
- No ejecutes `dotnet ef database update`.

## Verificación obligatoria

```bash
dotnet build api/LuxuryApp.sln -o .tmp-audit-build

grep -rn "\.ScheduledDay\b\|\.BreachedDay\b\|\.LastAlertDay\b\|\.RecurrenceSourceDay\b\|\.PlannedStartDay\b\|\.PlannedEndDay\b\|\.ActualStartDay\b\|\.ActualEndDay\b\|\.RecurrenceEndDay\b\|\.DueDay\b\|\.CreatedFromRecurrenceDay\b\|\.ReadingDay\b\|\.SendDay\b" api/LuxuryApp.Application/ --include="*.cs"
# Resultado esperado: 0 líneas

node scripts/audit-conventions.mjs
node scripts/scan-mojibake.mjs api
```

## Criterio de PASO

- Las 4 entidades tienen sus propiedades `DateOnly?` nuevas (9 en `Tasks`, 3 en `TaskInstance`, 1 en
  `TaskMessageReads`, 1 en `TaskWorkPlan`), sin tocar ninguna propiedad `DateTime` existente ni
  `ClosedDate`.
- La migración generada tiene únicamente 14 `AddColumn<DateOnly>(..., nullable: true)` más el
  backfill agregado a mano — nada de `RenameColumn`/`DropColumn`/`AlterColumn` sobre columnas viejas,
  nada relacionado con `ClosedDate`.
- `dotnet build` sin errores nuevos.
- El grep de verificación da 0 resultados.
- `audit-conventions.mjs`/`scan-mojibake.mjs` sin regresión respecto al baseline (10 / 69).

## Reporte de finalización

1. Diff exacto de las 4 entidades.
2. Contenido completo de la migración generada (`Up()`/`Down()`).
3. Salida literal de los comandos de verificación.
4. Decisiones que tomaste por tu cuenta y por qué.

No avances a ningún otro ticket. Espera la auditoría.
