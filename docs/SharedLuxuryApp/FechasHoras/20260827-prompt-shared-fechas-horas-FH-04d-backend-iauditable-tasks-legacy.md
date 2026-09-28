# TICKET FH-04d — Backend: `Tasks` (legacy) a `IAuditable` (56 referencias, 5 servicios + 6 tests)

Trabajas en el repositorio LuxuryApp (.NET 10, `api/`). Antes de escribir código, lee
`CONVENTIONS.md`, `conventions/backend/backend-rules.md` (sección "🔴 REGLA
CRÍTICA: Fechas y horas...") y `RecruitmentSourceCatalog.cs`
(`api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Recruitment/ReclutamientoyAltasBajas/RecruitmentSourceCatalog.cs`,
patrón de referencia). Último de la serie FH-04a/b/c — mismo objetivo, entidad más grande.

## Contexto

`Tasks` (tabla `Tasks`, clase legacy que coexiste con `TaskInstance` — confirmado activamente
creada hoy en 4+ puntos, no está muerta) tiene el campo `CreateDate` en vez de `CreatedAt`. A
diferencia de FH-04a/b/c, aquí el volumen es el problema: **56 ocurrencias de `.CreateDate` en 5
archivos de servicio + 6 archivos de test**, no una colisión de nombre ni falta de backfill.

**Verificado antes de escribir este ticket:**
- `CreateMap<Tasks, TasksAddOrEditDTO>()` (`TasksMapper.cs`) — `TasksAddOrEditDTO` **no tiene**
  ningún campo `CreateDate`/`CreatedAt`, así que no hay riesgo de AutoMapper (lección de FH-04b-fix
  ya aplicada: revisado explícitamente).
- Los 5 archivos de servicio usan proyecciones manuales (`.Select(x => new { ... })` o DTOs
  construidos a mano), no AutoMapper, para todos los campos relacionados con `CreateDate`.
- 6 archivos de test construyen `new Tasks { ... CreateDate = DateTime.UtcNow }` directamente
  (fixtures de prueba, sin pasar por `SaveChangesAsync`) — **no estaban en el alcance original del
  informe**, se encontraron al preparar este ticket.

## Regla general de reemplazo (en vez de enumerar las 56 líneas una por una)

En los **5 archivos de servicio** (`TaskAppService.cs`, `TasksReportAppService.cs`,
`TaskLegalAppService.cs`, `TaskWorkPlanAppService.cs`,
`RecurringTaskGeneration/Services/RecurringTaskGenerationService.cs` — este último, **no confundir**
con `Reclutamiento/.../RecurringTaskGeneratorService.cs`, que es un archivo distinto de otro módulo
ya tocado en FH-02/FH-14):

1. **Toda lectura `.CreateDate`** (precedida por un punto — `x.CreateDate`, `t.CreateDate`,
   `task.CreateDate`, `entity.CreateDate`, `d.CreateDate`, sin importar el nombre de la variable) →
   renómbrala a `.CreatedAt`. Esto incluye usos dentro de `Where`, `OrderBy`/`OrderByDescending`,
   `ThenByDescending`, restas de fechas (`x.ClosedDate.Value - x.CreateDate`),
   `EF.Functions.DateDiffDay(x.CreateDate, ...)`, `.ToString(...)`, y el lado derecho de cualquier
   asignación a un campo de DTO (ej. `CreateDate = x.CreateDate,` → `CreateDate = x.CreatedAt,`).

2. **NO renombres el nombre de ningún campo de DTO o tipo anónimo** que ya se llame `CreateDate`,
   `CreatedAtDate`, `CreatedAtHour`, `CreatedAtFilter`, `CreateDate` (izquierda del `=`) — son
   contratos de salida existentes (varios ya reportados como usados por el frontend en tickets
   anteriores de este mismo estilo). Solo cambia qué propiedad de la **entidad** se lee del lado
   derecho.

3. **Excepción — 3 inicializadores de la entidad `Tasks` con `CreateDate = DateTime.UtcNow`
   (creación de una tarea nueva): elimina la línea completa**, no la renombres — `SaveChangesAsync`
   asigna `CreatedAt` automáticamente en `Added`:
   - `RecurringTaskGeneration/Services/RecurringTaskGenerationService.cs:213` (dentro de
     `new Tasks { ... }`)
   - `TaskLegal/Services/TaskLegalAppService.cs:38` (dentro de `new Tasks { ... }`)
   - `Tasks/Services/TaskAppService.cs:685` (dentro de `new Tasks() { ... }`)

## Tarea 1 — `Tasks.cs`

Archivo: `api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Operations/TaskEngine/Tasks.cs`

1. Cambia `public class Tasks : GuidIdEntity` → `public class Tasks : GuidIdEntity, IAuditable`
   (conserva los `[Index(...)]` que ya tiene la clase, no los toques).
2. Reemplaza:
   ```csharp
   [Required(ErrorMessage = "El campo {0} es obligatorio")]
   [Display(Name = "Fecha de Creación")]
   [Column("CreateDate")]
   public DateTime CreateDate { get; set; } = DateTime.UtcNow;
   ```
   por:
   ```csharp
   [Display(Name = "Fecha de Creación")]
   public DateTime CreatedAt { get; set; }

   /// <summary>Usuario que creó el registro.</summary>
   public string CreatedBy { get; set; } = string.Empty;

   /// <summary>Fecha de la última actualización.</summary>
   public DateTime? UpdatedAt { get; set; }

   /// <summary>Usuario que realizó la última modificación.</summary>
   public string UpdatedBy { get; set; } = string.Empty;
   ```
   (se quita `[Required]` y el `= DateTime.UtcNow` por defecto — ya no es un campo capturado por el
   usuario ni necesita default en C#, lo gestiona `SaveChangesAsync`; se quita `[Column("CreateDate")]`
   porque tras el `RenameColumn` de la migración el nombre de columna coincidirá con `CreatedAt`).

No toques `CreatorId`/`Creator`, `AssigneeId`/`Assignee`, `ClosedById`/`ClosedBy` — son relaciones
distintas, sin conflicto con `IAuditable`.

## Tarea 2 — Aplicar la regla general en los 5 servicios

Archivos y ocurrencias de `.CreateDate` a renombrar a `.CreatedAt` (confirmado por grep antes de
escribir este ticket; usa esto como lista de verificación, no como límite — si tu editor encuentra
alguna que el grep no listó, inclúyela también, es el mismo patrón):

- `Tasks/Services/TasksReportAppService.cs` — líneas 14, 27, 53, 64, 65, 66, 84, 85 (8)
- `Tasks/Services/TaskAppService.cs` — líneas 125, 221, 228 (×2), 249, 250, 259, 286 (×2), 287, 306,
  322, 366, 368 (×2), 369, 384, 531 (×2), 532, 534, 562, 588, 589 (×2), 608, 1376, 1395, 1457, 1459,
  1478, 1541, 1544 (~34, además de la línea 685 ya cubierta en la excepción de arriba)
- `TaskLegal/Services/TaskLegalAppService.cs` — líneas 203, 207 (×2), 211, 221 (×2) (además de la
  línea 38 ya cubierta en la excepción)
- `TaskWorkPlan/Services/TaskWorkPlanAppService.cs` — líneas 34, 35, 36, 56, 57, 87, 88, 218, 219 (9)
- `RecurringTaskGeneration/Services/RecurringTaskGenerationService.cs` — solo la línea 213, cubierta
  en la excepción (no hay otras lecturas en este archivo)

## Tarea 3 — Corregir los 6 archivos de test (hallazgo previo, no en el informe original)

Estos construyen la entidad `Tasks` directamente en memoria para pruebas, **sin pasar por
`SaveChangesAsync`** — a diferencia de los servicios reales, aquí **no elimines la línea, renómbrala**
(si se elimina, `CreatedAt` quedaría en `0001-01-01` dentro del test, pudiendo romper aserciones que
dependan de una fecha real):

- `api/LuxuryApp.Tests/Application/Modules/OperationsLuxuryApp/Tasks/TaskJustification/TaskJustificationAppServiceTests.cs:269`
- `api/LuxuryApp.Tests/Application/Modules/OperationsLuxuryApp/Tasks/RecurringTaskEscalation/TaskEscalationServiceTests.cs:315`
- `api/LuxuryApp.Tests/Application/Modules/OperationsLuxuryApp/Tasks/RecurringTaskAlerting/TaskAlertEngineServiceTests.cs:352`
- `api/LuxuryApp.Tests/Application/Modules/OperationsLuxuryApp/Tasks/RecurringTaskCompliance/RecurringTaskComplianceAppServiceTests.cs:209`
- `api/LuxuryApp.Tests/Application/Modules/OperationsLuxuryApp/Tasks/TaskChecklist/TaskChecklistAppServiceTests.cs:122`
- `api/LuxuryApp.Tests/Application/Modules/OperationsLuxuryApp/Tasks/TaskAttachment/TaskAttachmentAppServiceTests.cs:329`

En cada una: `CreateDate = DateTime.UtcNow` → `CreatedAt = DateTime.UtcNow` (conserva la coma si la
tenía). Si al compilar `LuxuryApp.Tests` aparece algún otro archivo con el mismo patrón que estos 6
greps no capturaron, corrígelo igual (mismo criterio que FH-04a con
`RecurringTaskComplianceAppServiceTests.cs`/`RecurringTaskGenerationServiceTests.cs` — el build es
la prueba final, no el grep).

## Migración EF Core

Genera la migración con `dotnet ef migrations add OrphanAuditFieldsBatchD`. El `Up()` esperado:

```csharp
migrationBuilder.RenameColumn(name: "CreateDate", table: "Tasks", newName: "CreatedAt");

migrationBuilder.AddColumn<string>(name: "CreatedBy", table: "Tasks", type: "nvarchar(max)", nullable: true);
migrationBuilder.AddColumn<DateTime>(name: "UpdatedAt", table: "Tasks", type: "datetime2", nullable: true);
migrationBuilder.AddColumn<string>(name: "UpdatedBy", table: "Tasks", type: "nvarchar(max)", nullable: true);
```

Un solo `RenameColumn` (preserva los datos existentes de `CreateDate`, no hace falta backfill —
siempre tuvo un valor real, a diferencia de FH-04b) + 3 `AddColumn` nuevos. Si `dotnet ef` genera
otra cosa (drop+add en vez de rename, o algo relacionado con los índices `[Index(...)]` existentes
de la clase), detente y repórtalo antes de aplicar nada.

**Antes de generar la migración**, corre `SELECT COUNT(*) FROM Tasks` contra la base de datos de
desarrollo y reporta el resultado literal.

**No ejecutes `dotnet ef database update`.**

## Lo que NO debes hacer

- No toques `TaskInstance` ni ninguna otra entidad — es `Tasks` (legacy) exclusivamente.
- No toques `CreatorId`/`Creator`, `AssigneeId`/`Assignee`, `ClosedById`/`ClosedBy`.
- No cambies el nombre de ningún campo de DTO/tipo anónimo (`CreateDate`, `CreatedAtDate`,
  `CreatedAtHour`, `CreatedAtFilter` como claves de la izquierda) — son contratos de salida.
- No toques `RecurringTaskGeneratorService.cs` de `ReclutamientoLuxuryApp` — es un archivo de
  nombre parecido pero de otro módulo, ya cerrado en FH-02/FH-14, sin relación con este ticket.
- No ejecutes `dotnet ef database update`.

## Verificación obligatoria

```bash
dotnet build api/LuxuryApp.sln -o .tmp-audit-build

grep -rn "\.CreateDate\b" api/LuxuryApp.Application/ api/LuxuryApp.Infrastructure.Data/ api/LuxuryApp.Tests/ --include="*.cs"
# Resultado esperado: 0 líneas

grep -rn "CreateDate\s*=\s*DateTime\.UtcNow" api/LuxuryApp.Application/ api/LuxuryApp.Tests/ --include="*.cs"
# Resultado esperado: 0 líneas (las 3 de servicios se eliminaron, las 6 de test se renombraron a CreatedAt)

node scripts/audit-conventions.mjs
node scripts/scan-mojibake.mjs api
```

## Criterio de PASO

- `Tasks` implementa `IAuditable` con el bloque completo de 4 propiedades.
- La migración `OrphanAuditFieldsBatchD` es 1 `RenameColumn` + 3 `AddColumn`, sin drop+add.
- `dotnet build` sin errores nuevos (incluye `LuxuryApp.Tests`).
- Los greps no devuelven referencias sin actualizar.
- `audit-conventions.mjs`/`scan-mojibake.mjs` sin regresión (10 / 68).

## Reporte de finalización

1. Resultado literal del `SELECT COUNT(*) FROM Tasks`.
2. Diff exacto de `Tasks.cs`.
3. Confirmación por archivo (los 5 servicios + los 6 tests) de cuántas líneas se cambiaron en cada
   uno — no hace falta pegar las 56 líneas si coinciden con la lista de la Tarea 2, pero si alguna
   difiere (más, menos, o en otra línea), decláralo explícitamente.
4. Contenido completo del `Up()`/`Down()` de la migración.
5. Salida literal de los comandos de verificación.
6. Decisiones que tomaste por tu cuenta y por qué.

Con esto se cierra la Fase 2 completa (FH-04a, b, c, d). No avances a ningún otro ticket. Espera la
auditoría.
