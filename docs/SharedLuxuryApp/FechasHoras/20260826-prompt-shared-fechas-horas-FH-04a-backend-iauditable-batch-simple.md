# TICKET FH-04a — Backend: 4 entidades a `IAuditable` (grupo simple, bajo riesgo)

Trabajas en el repositorio LuxuryApp (.NET 10, `api/`). Antes de escribir código, lee
`CONVENTIONS.md` y `conventions/backend/backend-rules.md` (sección "🔴 REGLA
CRÍTICA: Fechas y horas..."). Lee también `RecruitmentSourceCatalog.cs`
(`api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Recruitment/ReclutamientoyAltasBajas/RecruitmentSourceCatalog.cs`)
— es el **patrón exacto** a replicar para el bloque `IAuditable` (líneas 21-35 de ese archivo).

## Contexto

El informe (`../../../docs/SharedLuxuryApp/FechasHoras/20260826-auditoria-shared-fechas-horas.md`,
sección 4) identificó 9 entidades con un campo de auditoría no estándar (no implementan
`IAuditable`, así que no se benefician del completado automático en UTC de
`ApplicationDbContext.SaveChangesAsync`, ni del registro en `AuditEntry`). Este ticket cubre **4 de
las 9** — las de menor riesgo, verificadas una por una antes de escribir el prompt:

| Entidad | Campo actual | Consumidores fuera de la entidad | Colisión de nombres |
|---|---|---|---|
| `RegistroChecador` | `CreadoEn` (`DateTime`) | 1 (`ChekadorEmpleadosAppService.cs:84`) | Ninguna |
| `UserRefreshToken` | `CreationDate` (`DateTime`) | 0 (solo el valor por defecto en la propia entidad) | Ninguna |
| `WorkGroup` | `DateCreation` (`DateTime`) | 3, todos en `TaskGroupAppService.cs` | Ninguna |
| `BudgetProposal` | `CreatedDate` (`DateTime`) + `CreatedBy` (`string`, ya existe pero **confirmado sin ningún uso** en todo el repo — ni se lee ni se asigna fuera de dos inicializaciones a `DateTime.UtcNow` de `CreatedDate`) | 2, ambos en `BudgetProposalService.cs` | Ninguna (el `CreatedBy` existente está muerto, se reutiliza tal cual) |

**Las otras 5 entidades del informe original NO están en este ticket** — se entregan después, en
tickets separados, porque cada una tiene una complicación real distinta que no comparte con este
grupo:
- `Announcement` y `CustomDocument` ya tienen una propiedad de navegación llamada `CreatedBy`
  (`ApplicationUser`, activamente usada en 5 y 4 puntos respectivamente) — colisiona con el
  `string CreatedBy` de `IAuditable` y necesita un ticket propio para renombrarla sin romper nada.
- `DiagramDraw` y `ManualDiagram` no tienen ningún campo de creación (solo de actualización) — hay
  que decidir cómo poblar `CreatedAt` para las filas existentes.
- `Tasks` (legacy) tiene ~40 referencias a `CreateDate` repartidas en 4 archivos — demasiado grande
  para mezclar con este grupo simple.

## Tarea 1 — `RegistroChecador.cs`

Archivo: `api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Hr/ChekadorEmpleados/RegistroChecador.cs`

1. Cambia `public class RegistroChecador : GuidIdEntity` → `public class RegistroChecador : GuidIdEntity, IAuditable`.
2. Reemplaza:
   ```csharp
   /// <summary>Fecha y hora UTC en que se guardó el registro en base de datos.</summary>
   [Column("CreadoEn")]
   public DateTime CreadoEn { get; set; }
   ```
   por (mismo estilo que `RecruitmentSourceCatalog.cs`, sin `[Column]` — el nombre de propiedad ya
   coincide con la columna destino):
   ```csharp
   /// <summary>Fecha y hora UTC en que se guardó el registro en base de datos.</summary>
   public DateTime CreatedAt { get; set; }

   /// <summary>Usuario que creó el registro.</summary>
   public string CreatedBy { get; set; } = string.Empty;

   /// <summary>Fecha de la última actualización.</summary>
   public DateTime? UpdatedAt { get; set; }

   /// <summary>Usuario que realizó la última modificación.</summary>
   public string UpdatedBy { get; set; } = string.Empty;
   ```

3. Archivo: `api/LuxuryApp.Application/Moduls/RecursosHumanosLuxuryApp/ChekadorEmpleados/Services/ChekadorEmpleadosAppService.cs:84`
   ```csharp
   CreadoEn = ahora,
   ```
   **Elimina esta línea por completo** (no la reemplaces por `CreatedAt = ahora,`) — una vez que la
   entidad implementa `IAuditable`, `ApplicationDbContext.SaveChangesAsync` completa `CreatedAt`
   automáticamente en `Added`; asignarlo a mano aquí sería redundante y, si `ahora` no es exactamente
   `DateTime.UtcNow`, hasta contradictorio. Verifica que la variable `ahora` de esa línea no se use
   para nada más cercano antes de borrar la línea completa (si se usa en otro punto de ese mismo
   método, dilo en el reporte y no la borres, deja solo la asignación a `CreadoEn`/`CreatedAt`).

## Tarea 2 — `UserRefreshToken.cs`

Archivo: `api/LuxuryApp.Infrastructure.Data/Data/Entities/System/Access/UserRefreshToken.cs`

1. Cambia `public class UserRefreshToken : GuidIdEntity` → `public class UserRefreshToken : GuidIdEntity, IAuditable`.
2. Reemplaza:
   ```csharp
   [Display(Name = "Fecha de creación")]
   [Column("CreationDate")]
   public DateTime CreationDate { get; set; } = DateTime.UtcNow;
   ```
   por:
   ```csharp
   [Display(Name = "Fecha de creación")]
   public DateTime CreatedAt { get; set; }

   /// <summary>Usuario que creó el registro.</summary>
   public string CreatedBy { get; set; } = string.Empty;

   /// <summary>Fecha de la última actualización.</summary>
   public DateTime? UpdatedAt { get; set; }

   /// <summary>Usuario que realizó la última modificación.</summary>
   public string UpdatedBy { get; set; } = string.Empty;
   ```
   (se quita el `= DateTime.UtcNow` por defecto — `SaveChangesAsync` lo asigna en `Added`; no hay
   ningún consumidor de `CreationDate` fuera de esta entidad, confirmado por grep — no toques
   ningún otro archivo para esta entidad.)

## Tarea 3 — `WorkGroup.cs`

Archivo: `api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Operations/TaskEngine/WorkGroup.cs`

1. Cambia `public class WorkGroup : GuidIdEntity, ITenantEntity` → `public class WorkGroup : GuidIdEntity, ITenantEntity, IAuditable` (conserva `ITenantEntity`).
2. Reemplaza:
   ```csharp
   [Required(ErrorMessage = "El campo {0} es obligatorio")]
   [Display(Name = "Fecha de creación")]
   [Column("DateCreation")]
   public DateTime DateCreation { get; set; }
   ```
   por:
   ```csharp
   [Display(Name = "Fecha de creación")]
   public DateTime CreatedAt { get; set; }

   /// <summary>Usuario que creó el registro.</summary>
   public string CreatedBy { get; set; } = string.Empty;

   /// <summary>Fecha de la última actualización.</summary>
   public DateTime? UpdatedAt { get; set; }

   /// <summary>Usuario que realizó la última modificación.</summary>
   public string UpdatedBy { get; set; } = string.Empty;
   ```
   (se quita `[Required]` — ya no es un campo capturado por el usuario, lo gestiona el sistema; no
   toques `UserCreateId`/`UserCreate`, son un campo distinto sin relación con `IAuditable`, déjalos
   tal cual.)

3. Archivo: `api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Tasks/WorkGroup/Services/TaskGroupAppService.cs`
   - Línea 80: `x.DateCreation,` → `x.CreatedAt,`
   - Línea 102: `DateCreation = x.DateCreation.ToString("dd-MMM-yyyy"),` → cambia el lado derecho a
     `x.CreatedAt.ToString("dd-MMM-yyyy")`. **No cambies el nombre del campo del DTO a la izquierda
     del `=`** (`DateCreation`) — es un contrato de salida que puede estar consumido por el
     frontend; solo cambia qué propiedad de la entidad se lee.
   - Línea 130: `DateCreation = DateTime.UtcNow,` — **elimina esta línea completa** (redundante, la
     gestiona `SaveChangesAsync`).

## Tarea 4 — `BudgetProposal.cs`

Archivo: `api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Accounting/Budgeting/BudgetProposal.cs`

1. Cambia `public class BudgetProposal : GuidIdEntity, ITenantEntity` → `public class BudgetProposal : GuidIdEntity, ITenantEntity, IAuditable`.
2. Reemplaza:
   ```csharp
   /// <summary>
   /// Nombre del usuario que creó la propuesta.
   /// </summary>
   public string CreatedBy { get; set; }

   /// <summary>
   /// Fecha y hora de creación de la propuesta.
   /// </summary>
   public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
   ```
   por:
   ```csharp
   /// <summary>Fecha y hora de creación de la propuesta.</summary>
   public DateTime CreatedAt { get; set; }

   /// <summary>Usuario que creó el registro.</summary>
   public string CreatedBy { get; set; } = string.Empty;

   /// <summary>Fecha de la última actualización.</summary>
   public DateTime? UpdatedAt { get; set; }

   /// <summary>Usuario que realizó la última modificación.</summary>
   public string UpdatedBy { get; set; } = string.Empty;
   ```
   Nota: el `CreatedBy` viejo se documentaba como "nombre del usuario" pero está confirmado sin
   ningún uso en el repo (ni lectura ni escritura fuera de la propia clase) — se reemplaza
   directamente por el `CreatedBy` estándar de `IAuditable` (que `SaveChangesAsync` llena con el ID
   del usuario, no el nombre) sin necesidad de renombrar nada ni de avisar a ningún consumidor.

3. Archivo: `api/LuxuryApp.Application/Moduls/ContabilidadLuxuryApp/PresupuestoPropuesta/Services/BudgetProposalService.cs`
   - Línea 198: `CreatedDate = DateTime.UtcNow,` — **elimina esta línea completa**.
   - Línea 354: `CreatedDate = DateTime.UtcNow,` — **elimina esta línea completa**.

## Migración EF Core

Genera **una sola migración** para las 4 entidades, nómbrala `OrphanAuditFieldsBatchA`. Antes de
correr `dotnet ef migrations add`, confirma con `SELECT COUNT(*) FROM RegistrosChecador`,
`SELECT COUNT(*) FROM UserRefreshTokens`, `SELECT COUNT(*) FROM TaskWorkGroups`,
`SELECT COUNT(*) FROM BudgetProposals` contra la base de datos de desarrollo y reporta los 4
resultados literales — no es una guardia bloqueante (a diferencia de D11-01, aquí sí sabemos que
`RenameColumn` preserva los datos de la columna existente), es solo para que quede registrado
cuántas filas existentes se ven afectadas.

**Verifica la migración generada, no la des por buena a ciegas:**
- Los 4 campos renombrados (`CreadoEn`→`CreatedAt`, `CreationDate`→`CreatedAt`,
  `DateCreation`→`CreatedAt`, `CreatedDate`→`CreatedAt`) deben aparecer como
  `migrationBuilder.RenameColumn(...)`, **no** como un `DropColumn` + `AddColumn` separados — si EF
  genera un drop+add en vez de un rename para alguno de los 4, **detente y repórtalo** antes de
  aplicar nada; eso perdería los valores existentes de esa columna, y el ticket no está autorizado
  para aceptar esa pérdida.
- Los 3 campos nuevos por entidad (`CreatedBy`, `UpdatedAt`, `UpdatedBy` — excepto `BudgetProposal`,
  que solo necesita `UpdatedAt`/`UpdatedBy` nuevos, porque su `CreatedBy` ya existía) deben aparecer
  como `migrationBuilder.AddColumn<...>(..., nullable: true)` — sigue el patrón exacto ya usado en
  el proyecto (`CreatedBy`/`UpdatedBy`: `nvarchar(max)`, `nullable: true`; `UpdatedAt`: `datetime2`,
  `nullable: true`) — puedes verificarlo en cualquier migración reciente que cree una entidad
  `IAuditable` (ej. `20260811203819_RefactorCandidates.cs`, líneas 82-85).

**No ejecutes `dotnet ef database update`** — la aplicación a una base de datos concreta es una
decisión separada del usuario, igual que en el resto de este proyecto.

## Lo que NO debes hacer

- No toques las 5 entidades que no están en este ticket (`Announcement`, `CustomDocument`,
  `DiagramDraw`, `ManualDiagram`, `Tasks`).
- No toques `UserCreateId`/`UserCreate` en `WorkGroup`, ni `ITenantEntity` en `WorkGroup`/`BudgetProposal`.
- No cambies el nombre del campo `DateCreation` en el DTO de salida de `TaskGroupAppService.cs`
  (línea 102, lado izquierdo del `=`) — es un contrato de API, no lo toques aunque el nombre ya no
  coincida con la propiedad de la entidad.
- No ejecutes `dotnet ef database update`.

## Verificación obligatoria

```bash
dotnet build api/LuxuryApp.sln -o .tmp-audit-build

grep -rn "\.CreadoEn\b\|CreadoEn\s*=" api/LuxuryApp.Application/ api/LuxuryApp.Infrastructure.Data/ --include="*.cs"
grep -rn "\.CreationDate\b\|CreationDate\s*=" api/LuxuryApp.Application/ api/LuxuryApp.Infrastructure.Data/ --include="*.cs"
grep -rn "\.DateCreation\b" api/LuxuryApp.Application/ api/LuxuryApp.Infrastructure.Data/ --include="*.cs"
grep -rn "\.CreatedDate\b\|CreatedDate\s*=" api/LuxuryApp.Application/Moduls/ContabilidadLuxuryApp/PresupuestoPropuesta --include="*.cs"
# Resultado esperado en los 4: 0 líneas (o solo el "DateCreation" del lado izquierdo del DTO en
# TaskGroupAppService.cs:102, que es intencional y no se toca)

node scripts/audit-conventions.mjs
node scripts/scan-mojibake.mjs api
```

## Criterio de PASO

- Las 4 entidades implementan `IAuditable` con el bloque de 4 propiedades exacto (o 2 nuevas en el
  caso de `BudgetProposal`).
- La migración `OrphanAuditFieldsBatchA` usa `RenameColumn` para los 4 campos, no drop+add.
- `dotnet build` sin errores nuevos.
- Los greps de arriba no devuelven referencias sin actualizar (salvo la excepción documentada).
- `audit-conventions.mjs`/`scan-mojibake.mjs` sin regresión respecto al baseline (10 / 68).

## Reporte de finalización

1. Resultado literal de los 4 `SELECT COUNT(*)`.
2. Diff exacto de las 4 entidades y de los 3 archivos de servicio tocados.
3. Contenido completo de la migración generada (o al menos las secciones `Up()`/`Down()` con los
   `RenameColumn`/`AddColumn`) — confirmando explícitamente que son `RenameColumn`, no drop+add.
4. Salida literal de los comandos de verificación.
5. Decisiones que tomaste por tu cuenta y por qué.

No avances a ningún otro ticket. Espera la auditoría.
