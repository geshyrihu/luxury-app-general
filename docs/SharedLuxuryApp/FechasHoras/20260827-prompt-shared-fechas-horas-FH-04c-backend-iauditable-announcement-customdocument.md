# TICKET FH-04c — Backend: `Announcement` y `CustomDocument` a `IAuditable` (colisión de nombre)

Trabajas en el repositorio LuxuryApp (.NET 10, `api/`). Antes de escribir código, lee
`CONVENTIONS.md`, `conventions/backend/backend-rules.md` (sección "🔴 REGLA
CRÍTICA: Fechas y horas...") y `RecruitmentSourceCatalog.cs`
(`api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Recruitment/ReclutamientoyAltasBajas/RecruitmentSourceCatalog.cs`,
patrón de referencia). Continuación de FH-04a/FH-04b (mismo objetivo, entidades distintas) — no
dependes de su código.

## Contexto y diferencia clave

`Announcement` y `CustomDocument` **ya tienen una propiedad de navegación llamada `CreatedBy`**
(tipo `ApplicationUser`, con su FK `CreatedById` de tipo `string`), activamente usada:

| Entidad | `.Include(x => x.CreatedBy)` | `.CreatedBy.FullName`/`.FirstName`/`.LastName` |
|---|---|---|
| `Announcement` | `AnnouncementAppService.cs:33,96,116` (3) | `AnnouncementMapper.cs:15,22` (2, vía `CreatedBy.FullName`) |
| `CustomDocument` | `CustomDocumentAppService.cs:21,56` (2) | `CustomDocumentAppService.cs:33,68` (2, vía `CreatedBy.FirstName`/`.LastName`) |

`IAuditable.CreatedBy` es `string`, no `ApplicationUser` — **no se puede agregar tal cual**, el
nombre ya está ocupado por la propiedad de navegación. La solución: renombrar la navegación
existente a `CreatedByUser` (con un `[ForeignKey(nameof(CreatedById))]` explícito, porque el
convenio de EF Core para detectar la FK depende del nombre de la navegación — `CreatedBy` +
`CreatedById` calzan por convención; `CreatedByUser` + `CreatedById` **no**, y sin el atributo
explícito EF podría no relacionarlos, o peor, generar una FK nueva por error), y así dejar libre
el nombre `CreatedBy` para el `string` de `IAuditable`.

`CreatedById` (la columna FK) **no se toca ni se renombra** — sigue siendo la relación fuerte hacia
`ApplicationUser`. El nuevo `CreatedBy` (string) de `IAuditable` es un campo aditivo independiente,
que `SaveChangesAsync` llenará con el ID del usuario (claim `sub`) — en la práctica normalmente
coincidirá con el valor de `CreatedById`, pero son dos mecanismos separados (uno ya existía y se
sigue llenando a mano en el servicio; el otro es nuevo y automático) — no los unifiques ni intentes
hacer que uno alimente al otro, es el mismo patrón que ya se aceptó para `WorkGroup.UserCreateId`
en FH-04a.

## Tarea 1 — `Announcement.cs`

Archivo: `api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Operations/Announcements/Announcement.cs`

1. Cambia `public class Announcement : GuidIdEntity` → `public class Announcement : GuidIdEntity, IAuditable`.
2. Reemplaza:
   ```csharp
   /// <summary>
   /// Fecha y hora de creación del registro.
   /// </summary>
   [Display(Name = "Fecha de creación")]
   [Column("CreatedAt")]
   public DateTime CreateAt { get; set; }

   /// <summary>
   /// Identificador del usuario que creó el comunicado.
   /// </summary>
   [Column("CreatedById")]
   public string CreatedById { get; set; }

   /// <summary>
   /// Referencia al usuario creador.
   /// </summary>
   public ApplicationUser CreatedBy { get; set; }
   ```
   por:
   ```csharp
   /// <summary>Fecha y hora de creación del registro.</summary>
   [Display(Name = "Fecha de creación")]
   public DateTime CreatedAt { get; set; }

   /// <summary>Usuario que creó el registro (IAuditable, ID del claim de sesión).</summary>
   public string CreatedBy { get; set; } = string.Empty;

   /// <summary>Fecha de la última actualización.</summary>
   public DateTime? UpdatedAt { get; set; }

   /// <summary>Usuario que realizó la última modificación.</summary>
   public string UpdatedBy { get; set; } = string.Empty;

   /// <summary>Identificador del usuario que creó el comunicado (relación fuerte, existente).</summary>
   [Column("CreatedById")]
   public string CreatedById { get; set; }

   /// <summary>Referencia al usuario creador.</summary>
   [ForeignKey(nameof(CreatedById))]
   public ApplicationUser CreatedByUser { get; set; }
   ```
   (se quita `[Column("CreatedAt")]` de la propiedad `CreatedAt` — ya no hace falta, el nombre de
   la propiedad coincide por convención con el de la columna).

3. Archivo: `api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Announcement/Services/AnnouncementAppService.cs`
   - Líneas 33, 96, 116: `.Include(a => a.CreatedBy)` → `.Include(a => a.CreatedByUser)` (las 3).

4. Archivo: `api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Announcement/Mapping/AnnouncementMapper.cs`
   - Líneas 15, 22: `.ForMember(dest => dest.CreatedByName, opt => opt.MapFrom(src => src.CreatedBy.FullName))` → cambia `src.CreatedBy.FullName` por `src.CreatedByUser.FullName` (las 2; no toques `dest.CreatedByName`, es el DTO, no cambia).

## Tarea 2 — `CustomDocument.cs`

Archivo: `api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Operations/CustomDocuments/CustomDocument.cs`

1. Cambia `public class CustomDocument : GuidIdEntity, ITenantEntity` → `public class CustomDocument : GuidIdEntity, ITenantEntity, IAuditable`.
2. Reemplaza:
   ```csharp
   /// <summary>
   /// Identificador del usuario que realizó la carga.
   /// </summary>
   [Display(Name = "Usuario que cargo")]
   [Column("CreatedById")]
   public string CreatedById { get; set; }

   /// <summary>
   /// Referencia al usuario creador.
   /// </summary>
   public ApplicationUser CreatedBy { get; set; }

   /// <summary>
   /// Fecha y hora de creación del registro.
   /// </summary>
   [Display(Name = "Fecha de Creación")]
   [Column("CreatedAt")]
   public DateTime CreateAt { get; set; }
   ```
   por:
   ```csharp
   /// <summary>Identificador del usuario que realizó la carga (relación fuerte, existente).</summary>
   [Display(Name = "Usuario que cargo")]
   [Column("CreatedById")]
   public string CreatedById { get; set; }

   /// <summary>Referencia al usuario creador.</summary>
   [ForeignKey(nameof(CreatedById))]
   public ApplicationUser CreatedByUser { get; set; }

   /// <summary>Fecha y hora de creación del registro.</summary>
   [Display(Name = "Fecha de Creación")]
   public DateTime CreatedAt { get; set; }

   /// <summary>Usuario que creó el registro (IAuditable, ID del claim de sesión).</summary>
   public string CreatedBy { get; set; } = string.Empty;

   /// <summary>Fecha de la última actualización.</summary>
   public DateTime? UpdatedAt { get; set; }

   /// <summary>Usuario que realizó la última modificación.</summary>
   public string UpdatedBy { get; set; } = string.Empty;
   ```
   (mismo criterio: se quita `[Column("CreatedAt")]` de `CreatedAt`, ya no hace falta).

3. Archivo: `api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/CustomDocument/Services/CustomDocumentAppService.cs`
   - Líneas 21, 56: `.Include(d => d.CreatedBy)` → `.Include(d => d.CreatedByUser)` (las 2).
   - Líneas 33, 68: `CreatedById = d.CreatedBy.FirstName + " " + d.CreatedBy.LastName,` → cambia el
     lado derecho a `d.CreatedByUser.FirstName + " " + d.CreatedByUser.LastName,`. **No toques el
     nombre del campo del DTO a la izquierda** (`CreatedById`, que en este DTO en particular
     contiene un nombre completo, no un ID — es una rareza preexistente del contrato de salida, no
     se corrige en este ticket).

## Migración EF Core

A diferencia de FH-04a/FH-04b, **este ticket no necesita `RenameColumn`** — la columna física
`CreatedAt` ya se llama así (no cambia), y `CreatedById` tampoco se toca (sigue apuntando a la
misma columna FK, solo cambia el nombre de la navegación C# que la referencia, vía el
`[ForeignKey]` explícito). Genera la migración con `dotnet ef migrations add
OrphanAuditFieldsBatchC`; el `Up()` esperado son solo 6 `AddColumn` (nullable: true, mismo patrón
de siempre):
- `Announcements`: `CreatedBy`, `UpdatedAt`, `UpdatedBy`
- `CustomDocuments`: `CreatedBy`, `UpdatedAt`, `UpdatedBy`

**Si `dotnet ef` genera algo más que estos 6 `AddColumn`** (por ejemplo, si detecta un cambio en la
relación FK de `Announcement`/`CustomDocument` hacia `ApplicationUser` y quiere hacer un
`DropForeignKey`/`AddForeignKey`, o si intenta agregar una columna FK nueva tipo
`CreatedByUserId`), **detente y repórtalo** — significaría que el `[ForeignKey(nameof(CreatedById))]`
no se interpretó como se esperaba, y hay que revisar el mapeo antes de aplicar nada.

**Antes de generar la migración**, corre `SELECT COUNT(*) FROM Announcements` y
`SELECT COUNT(*) FROM CustomDocuments` contra la base de datos de desarrollo y reporta los
resultados literales.

**No ejecutes `dotnet ef database update`.**

## Lo que NO debes hacer

- No toques `CreatedById` (la columna FK) en ninguna de las 2 entidades — solo se renombra la
  navegación C# que la usa (`CreatedBy` → `CreatedByUser`).
- No cambies el nombre del campo `CreatedById` del DTO de `CustomDocumentAppService.cs` (el que
  contiene un nombre completo, no un ID) — es un contrato de salida existente, ajeno a este ticket.
- No toques `ITenantEntity` en `CustomDocument`.
- No ejecutes `dotnet ef database update`.

## Verificación obligatoria

```bash
dotnet build api/LuxuryApp.sln -o .tmp-audit-build

grep -rn "\.CreateAt\b" api/LuxuryApp.Application/ api/LuxuryApp.Infrastructure.Data/ --include="*.cs"
grep -rn "\.CreatedBy\.FullName\|\.CreatedBy\.FirstName\|\.CreatedBy\.LastName\|Include(\w => \w\.CreatedBy)" api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Announcement/ api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/CustomDocument/ --include="*.cs"
# Resultado esperado en ambos: 0 líneas (todo debe apuntar ya a CreatedByUser)

node scripts/audit-conventions.mjs
node scripts/scan-mojibake.mjs api
```

## Criterio de PASO

- Las 2 entidades implementan `IAuditable`; la navegación vieja quedó como `CreatedByUser` con
  `[ForeignKey(nameof(CreatedById))]` explícito.
- La migración `OrphanAuditFieldsBatchC` son solo 6 `AddColumn`, sin tocar la FK existente.
- `dotnet build` sin errores nuevos.
- Los greps no devuelven referencias sin actualizar.
- `audit-conventions.mjs`/`scan-mojibake.mjs` sin regresión (10 / 68).

## Reporte de finalización

1. Resultado literal de los 2 `SELECT COUNT(*)`.
2. Diff exacto de las 2 entidades y de los 3 archivos de servicio/mapper tocados.
3. Contenido completo del `Up()`/`Down()` de la migración — confirmando que son solo 6
   `AddColumn`, sin cambios de FK.
4. Salida literal de los comandos de verificación.
5. Decisiones que tomaste por tu cuenta y por qué.

No avances a ningún otro ticket. Espera la auditoría.
