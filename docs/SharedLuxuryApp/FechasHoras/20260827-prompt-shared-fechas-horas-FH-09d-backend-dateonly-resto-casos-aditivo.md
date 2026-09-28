# TICKET FH-09d — Backend: columnas `DateOnly?` aditivas + backfill (resto de casos sueltos)

Trabajas en el repositorio LuxuryApp (.NET 10, `api/`). Antes de escribir código, lee
`CONVENTIONS.md` y `conventions/backend/backend-rules.md` (sección "🔴 REGLA
CRÍTICA: Fechas y horas..."). Lee también
`docs/reporte_maestro/temas-transversales/20260826-auditoria-manejo-fechas-horas.md`, sección 5.4
("Estrategia de migración segura") — este ticket implementa **solo los pasos 1 y 2** de esa
estrategia, igual que `FH-09a`/`FH-09b`/`FH-09c` (ya cerrados y aprobados) — úsalos de referencia de
estilo. Este es el **último ticket aditivo de la Fase 3** — con este se completa el diagnóstico
completo del informe original.

## Contexto

FH-08 (diagnóstico, ya cerrado) resolvió, campo por campo, los 12 campos `DateTime` restantes en 10
entidades heterogéneas. **`BudgetProposal.CreatedDate` NO está en este ticket** — ya no existe, fue
renombrado a `CreatedAt` por FH-04a. El criterio de día es el mismo que en FH-05/06/07: **día
calendario de México**, confirmado por el usuario para todos los campos de este ticket.

**Ojo con los nombres de tabla/columna — casi ninguno coincide con el nombre de la clase C#:**

| Entidad | Campo `DateTime` existente | Tipo | Tabla física | Columna física | Nueva propiedad |
|---|---|---|---|---|---|
| `MigrationVerificationLog` (`System/System-AuditLogs/`) | `VerificationDate` | `DateTime` (no nulo) | `MigrationLogs` | `VerificationDate` | `VerificationDay` |
| `EstadoFinanciero` (`Accounting/FondeosyReporteo/`) | `UploadDate` | `DateTime?` | `FinancialStatements` | `UploadDate` | `UploadDay` |
| `EstadoFinanciero` | `AuthorizationDate` | `DateTime?` | `FinancialStatements` | `AuthorizationDate` | `AuthorizationDay` |
| `EstadoFinanciero` | `SendDate` | `DateTime?` | `FinancialStatements` | `SendDate` | `SendDay` |
| `AnnouncementAnalytics` (`Operations/Announcements/`) | `ViewDate` | `DateTime` (no nulo) | `AnnouncementAnalytics` | `ViewDate` | `ViewDay` |
| `AsambleaChecklistExecution` (`Operations/AsambleasyPlanificacin/`) | `DueDate` | `DateTime` (no nulo) | `AssemblyChecklistLogs` | `DueDate` | `DueDay` |
| `GoogleCalendarEvent` (`Operations/GoogleCalendar/`) | `RecurrenceEndDate` | `DateTime?` | `GoogleCalendarEvents` | `RecurrenceEndDate` | `RecurrenceEndDay` |
| `ReportSubmissionRecord` (`Operations/InspeccionesyAuditora/`) | `RegisterDate` | `DateTime` (no nulo) | `ReportSubmissions` | `RegisterDate` | `RegisterDay` |
| `EntregaRecepcionCliente` (`Operations/Properties/`) | `Fecha` | `DateTime` (no nulo) | `UnitDeliveries` | **`Date`** (¡no "Fecha"!) | `FechaDay` |
| `OrdenCompraComprobantePago` (`Purchasing/PO/`) | `UploadDate` | `DateTime` (no nulo) | `PurchaseOrderPayments` | `UploadDate` | `UploadDay` |
| `RequestEmployeeRegisterFile` (`Recruitment/ReclutamientoyAltasBajas/`) | `UploadDate` | `DateTime?` | `RecruitmentRequestEmployeeRegisterFiles` | `UploadDate` | `UploadDay` |
| `CollectionActivity` (`Accounting/AR/`) | `ActivityDate` | `DateTime` (no nulo) | `CollectionActivities` | `ActivityDate` | `ActivityDay` |

**Caso especial — `EntregaRecepcionCliente.Fecha`:** la propiedad C# se llama `Fecha` pero tiene
`[Column("Date")]` — la columna física real es `Date`. El backfill SQL debe leer de `[Date]`
(entre corchetes, es palabra reservada), no de `Fecha`.

**Este ticket NO renombra ni toca los 12 campos `DateTime` existentes, y NO toca ningún DTO ni
servicio de aplicación.** Solo agrega, por cada uno, una columna nueva, nullable, tipo `DateOnly?`.

## Tarea 1 — `MigrationVerificationLog.cs`

Archivo: `api/LuxuryApp.Infrastructure.Data/Data/Entities/System/System-AuditLogs/MigrationVerificationLog.cs`

Después de `VerificationDate`:
```csharp
/// <summary>Día calendario de México derivado de <see cref="VerificationDate"/> UTC. Columna
/// aditiva para migración a DateOnly — no reemplaza a VerificationDate todavía.</summary>
public DateOnly? VerificationDay { get; set; }
```

## Tarea 2 — `EstadoFinanciero.cs`

Archivo: `api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Accounting/FondeosyReporteo/EstadoFinanciero.cs`

Después de `UploadDate`, `AuthorizationDate` y `SendDate` respectivamente:
```csharp
/// <summary>Día calendario de México derivado de <see cref="UploadDate"/> UTC. Columna aditiva
/// para migración a DateOnly — no reemplaza a UploadDate todavía.</summary>
public DateOnly? UploadDay { get; set; }
```
```csharp
/// <summary>Día calendario de México derivado de <see cref="AuthorizationDate"/> UTC. Columna
/// aditiva para migración a DateOnly — no reemplaza a AuthorizationDate todavía.</summary>
public DateOnly? AuthorizationDay { get; set; }
```
```csharp
/// <summary>Día calendario de México derivado de <see cref="SendDate"/> UTC. Columna aditiva para
/// migración a DateOnly — no reemplaza a SendDate todavía.</summary>
public DateOnly? SendDay { get; set; }
```

## Tarea 3 — `AnnouncementAnalytics.cs`

Archivo: `api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Operations/Announcements/AnnouncementAnalytics.cs`

Después de `ViewDate`:
```csharp
/// <summary>Día calendario de México derivado de <see cref="ViewDate"/> UTC. Columna aditiva para
/// migración a DateOnly — no reemplaza a ViewDate todavía.</summary>
public DateOnly? ViewDay { get; set; }
```

## Tarea 4 — `AsambleaChecklistExecution.cs`

Archivo: `api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Operations/AsambleasyPlanificacin/AsambleaChecklistExecution.cs`

Después de `DueDate`:
```csharp
/// <summary>Día calendario de México derivado de <see cref="DueDate"/> UTC. Columna aditiva para
/// migración a DateOnly — no reemplaza a DueDate todavía.</summary>
public DateOnly? DueDay { get; set; }
```

## Tarea 5 — `GoogleCalendarEvent.cs`

Archivo: `api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Operations/GoogleCalendar/GoogleCalendarEvent.cs`

Después de `RecurrenceEndDate`:
```csharp
/// <summary>Día calendario de México derivado de <see cref="RecurrenceEndDate"/> UTC. Columna
/// aditiva para migración a DateOnly — no reemplaza a RecurrenceEndDate todavía.</summary>
public DateOnly? RecurrenceEndDay { get; set; }
```
**No toques `StartAt`/`EndAt`** — son horarios reales de eventos de calendario, fuera de alcance.

## Tarea 6 — `ReportSubmissionRecord.cs`

Archivo: `api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Operations/InspeccionesyAuditora/ReportSubmissionRecord.cs`

Después de `RegisterDate`:
```csharp
/// <summary>Día calendario de México derivado de <see cref="RegisterDate"/> UTC. Columna aditiva
/// para migración a DateOnly — no reemplaza a RegisterDate todavía.</summary>
public DateOnly? RegisterDay { get; set; }
```

## Tarea 7 — `EntregaRecepcionCliente.cs`

Archivo: `api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Operations/Properties/EntregaRecepcionCliente.cs`

Después de `Fecha`:
```csharp
/// <summary>Día calendario de México derivado de <see cref="Fecha"/> UTC. Columna aditiva para
/// migración a DateOnly — no reemplaza a Fecha todavía.</summary>
public DateOnly? FechaDay { get; set; }
```

## Tarea 8 — `OrdenCompraComprobantePago.cs`

Archivo: `api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Purchasing/PO/OrdenCompraComprobantePago.cs`

Después de `UploadDate`:
```csharp
/// <summary>Día calendario de México derivado de <see cref="UploadDate"/> UTC. Columna aditiva
/// para migración a DateOnly — no reemplaza a UploadDate todavía.</summary>
public DateOnly? UploadDay { get; set; }
```

## Tarea 9 — `RequestEmployeeRegisterFile.cs`

Archivo: `api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Recruitment/ReclutamientoyAltasBajas/RequestEmployeeRegisterFile.cs`

Después de `UploadDate` (línea ~52, **no confundir con `ValidatedAt`**, que está fuera de alcance):
```csharp
/// <summary>Día calendario de México derivado de <see cref="UploadDate"/> UTC. Columna aditiva
/// para migración a DateOnly — no reemplaza a UploadDate todavía.</summary>
public DateOnly? UploadDay { get; set; }
```

## Tarea 10 — `CollectionActivity.cs`

Archivo: `api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Accounting/AR/CollectionActivity.cs`

Después de `ActivityDate`:
```csharp
/// <summary>Día calendario de México derivado de <see cref="ActivityDate"/> UTC. Columna aditiva
/// para migración a DateOnly — no reemplaza a ActivityDate todavía.</summary>
public DateOnly? ActivityDay { get; set; }
```
**No toques `PromisedDate`** — ya es `DateOnly?`, fuera de alcance.

## Migración EF Core

Genera la migración con `dotnet ef migrations add DateOnlyRestoCasosAditivo` — debería salir como 12
`AddColumn<DateOnly>(..., nullable: true)`, sin tocar ninguna columna existente. **Verifica que sea
así antes de continuar.**

Luego edita el `Up()` generado para agregar el backfill:

```csharp
migrationBuilder.Sql(@"
UPDATE MigrationLogs SET VerificationDay =
    CAST(VerificationDate AT TIME ZONE 'UTC' AT TIME ZONE 'Central Standard Time (Mexico)' AS date)
WHERE VerificationDay IS NULL;

UPDATE FinancialStatements SET UploadDay =
    CAST(UploadDate AT TIME ZONE 'UTC' AT TIME ZONE 'Central Standard Time (Mexico)' AS date)
WHERE UploadDate IS NOT NULL AND UploadDay IS NULL;

UPDATE FinancialStatements SET AuthorizationDay =
    CAST(AuthorizationDate AT TIME ZONE 'UTC' AT TIME ZONE 'Central Standard Time (Mexico)' AS date)
WHERE AuthorizationDate IS NOT NULL AND AuthorizationDay IS NULL;

UPDATE FinancialStatements SET SendDay =
    CAST(SendDate AT TIME ZONE 'UTC' AT TIME ZONE 'Central Standard Time (Mexico)' AS date)
WHERE SendDate IS NOT NULL AND SendDay IS NULL;

UPDATE AnnouncementAnalytics SET ViewDay =
    CAST(ViewDate AT TIME ZONE 'UTC' AT TIME ZONE 'Central Standard Time (Mexico)' AS date)
WHERE ViewDay IS NULL;

UPDATE AssemblyChecklistLogs SET DueDay =
    CAST(DueDate AT TIME ZONE 'UTC' AT TIME ZONE 'Central Standard Time (Mexico)' AS date)
WHERE DueDay IS NULL;

UPDATE GoogleCalendarEvents SET RecurrenceEndDay =
    CAST(RecurrenceEndDate AT TIME ZONE 'UTC' AT TIME ZONE 'Central Standard Time (Mexico)' AS date)
WHERE RecurrenceEndDate IS NOT NULL AND RecurrenceEndDay IS NULL;

UPDATE ReportSubmissions SET RegisterDay =
    CAST(RegisterDate AT TIME ZONE 'UTC' AT TIME ZONE 'Central Standard Time (Mexico)' AS date)
WHERE RegisterDay IS NULL;

UPDATE UnitDeliveries SET FechaDay =
    CAST([Date] AT TIME ZONE 'UTC' AT TIME ZONE 'Central Standard Time (Mexico)' AS date)
WHERE FechaDay IS NULL;

UPDATE PurchaseOrderPayments SET UploadDay =
    CAST(UploadDate AT TIME ZONE 'UTC' AT TIME ZONE 'Central Standard Time (Mexico)' AS date)
WHERE UploadDay IS NULL;

UPDATE RecruitmentRequestEmployeeRegisterFiles SET UploadDay =
    CAST(UploadDate AT TIME ZONE 'UTC' AT TIME ZONE 'Central Standard Time (Mexico)' AS date)
WHERE UploadDate IS NOT NULL AND UploadDay IS NULL;

UPDATE CollectionActivities SET ActivityDay =
    CAST(ActivityDate AT TIME ZONE 'UTC' AT TIME ZONE 'Central Standard Time (Mexico)' AS date)
WHERE ActivityDay IS NULL;
");
```

El `Down()` generado por EF (12 `DropColumn`) no necesita cambios.

**No ejecutes `dotnet ef database update`** — igual que en el resto de este proyecto.

## Lo que NO debes hacer

- No toques `BudgetProposal.cs` — no está en este ticket, `CreatedDate` ya no existe (es `CreatedAt`
  desde FH-04a).
- No toques `GoogleCalendarEvent.StartAt`/`EndAt` ni `CollectionActivity.PromisedDate`.
- No toques `RequestEmployeeRegisterFile.ValidatedAt`.
- No toques los 12 campos `DateTime`/`DateTime?` existentes — ni su tipo, ni su nombre, ni su
  `[Column(...)]`, ni su nullability.
- No toques ningún DTO, servicio de aplicación, ni endpoint.
- No hagas `AlterColumn` para endurecer ninguna columna nueva a `NOT NULL`.
- No ejecutes `dotnet ef database update`.

## Verificación obligatoria

```bash
dotnet build api/LuxuryApp.sln -o .tmp-audit-build

grep -rn "\.VerificationDay\b\|\.UploadDay\b\|\.AuthorizationDay\b\|\.SendDay\b\|\.ViewDay\b\|\.DueDay\b\|\.RecurrenceEndDay\b\|\.RegisterDay\b\|\.FechaDay\b\|\.ActivityDay\b" api/LuxuryApp.Application/ --include="*.cs"
# Resultado esperado: 0 líneas

node scripts/audit-conventions.mjs
node scripts/scan-mojibake.mjs api
```

## Criterio de PASO

- Las 10 entidades tienen sus propiedades `DateOnly?` nuevas (12 en total), sin tocar ninguna
  propiedad `DateTime` existente ni los campos explícitamente excluidos.
- La migración generada tiene únicamente 12 `AddColumn<DateOnly>(..., nullable: true)` más el
  backfill agregado a mano — nada de `RenameColumn`/`DropColumn`/`AlterColumn` sobre columnas viejas.
- El backfill de `UnitDeliveries` usa `[Date]`, no `Fecha`.
- `dotnet build` sin errores nuevos.
- El grep de verificación da 0 resultados.
- `audit-conventions.mjs`/`scan-mojibake.mjs` sin regresión respecto al baseline (10 / 71, o el
  baseline vigente si cambió por trabajo externo — verifica cuál es el actual antes de comparar).

## Reporte de finalización

1. Diff exacto de las 10 entidades.
2. Contenido completo de la migración generada (`Up()`/`Down()`).
3. Salida literal de los comandos de verificación.
4. Decisiones que tomaste por tu cuenta y por qué.

No avances a ningún otro ticket. Espera la auditoría. Con este ticket se completa toda la Fase 3
(diagnóstico + columnas aditivas). El siguiente paso, después de la auditoría, es decidir entre el
cutover de código (leer/escribir las columnas `*Day` desde servicios y DTOs) o la Fase 4 (frontend).
