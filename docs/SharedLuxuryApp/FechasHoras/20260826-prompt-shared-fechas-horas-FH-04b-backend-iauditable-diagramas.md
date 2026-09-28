# TICKET FH-04b — Backend: `DiagramDraw` y `ManualDiagram` a `IAuditable` (sin `CreatedAt` previo)

Trabajas en el repositorio LuxuryApp (.NET 10, `api/`). Antes de escribir código, lee
`CONVENTIONS.md`, `conventions/backend/backend-rules.md` (sección "🔴 REGLA
CRÍTICA: Fechas y horas...") y `RecruitmentSourceCatalog.cs`
(`api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Recruitment/ReclutamientoyAltasBajas/RecruitmentSourceCatalog.cs`,
patrón de referencia para el bloque `IAuditable`). Continuación de FH-04a (mismo objetivo, entidades
distintas) — no dependes de su código, solo del mismo patrón ya aplicado ahí.

## Contexto y diferencia clave con FH-04a

`DiagramDraw` y `ManualDiagram` **no tienen ningún campo de creación** — solo tienen un campo de
"última actualización" (`UpdateAt`/`ActualizadoEn`) que además, en la práctica, se usa también como
fecha de creación (se asigna al crear el registro, no solo al modificarlo). Esto significa dos
cosas que no aplicaban en FH-04a:

1. **`CreatedAt` (no nulo) no tiene ningún valor histórico real que backfillear** — la única fecha
   conocida para las filas existentes es su fecha de "actualización". La decisión (ya tomada, no
   hace falta preguntar): usar el valor existente de `UpdateAt`/`ActualizadoEn` como backfill de
   `CreatedAt` para las filas actuales — es la mejor aproximación disponible, no hay otra fecha en
   la base de datos.
2. **Los consumidores que leían `UpdateAt`/`ActualizadoEn` como "última fecha relevante" deben
   ahora usar `UpdatedAt ?? CreatedAt`** — porque `UpdatedAt` en `IAuditable` es `DateTime?` y solo
   se llena en modificaciones reales (`SaveChangesAsync` nunca lo toca en `Added`), así que un
   registro recién creado y nunca editado tendría `UpdatedAt == null`. El comportamiento actual
   (mostrar/ordenar por "la fecha más reciente conocida del registro") se preserva exactamente con
   `UpdatedAt ?? CreatedAt`.

## Tarea 1 — `DiagramDraw.cs`

Archivo: `api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Operations/Diagrams/DiagramDraw.cs`

1. Cambia `public class DiagramDraw : GuidIdEntity, ITenantEntity` → `public class DiagramDraw : GuidIdEntity, ITenantEntity, IAuditable`.
2. Reemplaza:
   ```csharp
   /// <summary>
   /// Fecha y hora de la última actualización del diagrama.
   /// </summary>
   [Required]
   [Display(Name = "Fecha de Actualización")]
   [Column("Fecha de Actualización")]
   public DateTime UpdateAt { get; set; } = DateTime.UtcNow;
   ```
   por:
   ```csharp
   /// <summary>Fecha y hora de creación del diagrama.</summary>
   public DateTime CreatedAt { get; set; }

   /// <summary>Usuario que creó el registro.</summary>
   public string CreatedBy { get; set; } = string.Empty;

   /// <summary>Fecha de la última actualización del diagrama. Null si nunca se editó tras crearse.</summary>
   public DateTime? UpdatedAt { get; set; }

   /// <summary>Usuario que realizó la última modificación.</summary>
   public string UpdatedBy { get; set; } = string.Empty;
   ```
   Nota: la columna original `[Column("Fecha de Actualización")]` tenía espacios y acentos en el
   nombre físico — de paso se corrige a `UpdatedAt` (nombre EF por defecto para la propiedad, sin
   necesidad de `[Column]` explícito), aprovechando que ya se está renombrando esa columna.

3. Archivo: `api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Diagram/Services/DiagramDrawService.cs`
   - Línea 19: `.OrderByDescending(x => x.UpdateAt)` → `.OrderByDescending(x => x.UpdatedAt ?? x.CreatedAt)`
   - Línea 26: `UpdateAt = x.UpdateAt,` → `UpdateAt = x.UpdatedAt ?? x.CreatedAt,` (el nombre del
     campo del DTO a la izquierda, `UpdateAt`, **no se toca** — es el contrato de salida hacia el
     frontend, que no cambia).
   - Línea 57 (dentro de `CreateDiagramAsync`, justo después de `diagram.Id = Guid.NewGuid();`):
     `diagram.UpdateAt = DateTime.UtcNow;` — **elimina esta línea completa** (`CreatedAt` lo asigna
     `SaveChangesAsync` automáticamente en `Added`; `UpdatedAt` debe quedar `null` en un registro
     recién creado, no una fecha).
   - Línea 85 (dentro de `UpdateDiagramAsync`, tras mutar `Name`/`Content`):
     `diagram.UpdateAt = DateTime.UtcNow;` — **elimina esta línea completa** (`SaveChangesAsync` lo
     asigna automáticamente al detectar `EntityState.Modified`, porque `diagram` está *tracked* en
     este método, sin `.AsNoTracking()`).

## Tarea 2 — `ManualDiagram.cs`

Archivo: `api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Operations/Manuals/ManualDiagram.cs`

1. Cambia `public class ManualDiagram : GuidIdEntity` → `public class ManualDiagram : GuidIdEntity, IAuditable`.
2. Reemplaza:
   ```csharp
   public DateTime? EditTokenExpiry { get; set; }
   public DateTime ActualizadoEn { get; set; } = DateTime.UtcNow;
   ```
   por:
   ```csharp
   public DateTime? EditTokenExpiry { get; set; }

   /// <summary>Fecha y hora de creación del diagrama.</summary>
   public DateTime CreatedAt { get; set; }

   /// <summary>Usuario que creó el registro.</summary>
   public string CreatedBy { get; set; } = string.Empty;

   /// <summary>Fecha de la última actualización. Null si nunca se editó tras crearse.</summary>
   public DateTime? UpdatedAt { get; set; }

   /// <summary>Usuario que realizó la última modificación.</summary>
   public string UpdatedBy { get; set; } = string.Empty;
   ```

3. Archivo: `api/LuxuryApp.Application/Moduls/RecursosHumanosLuxuryApp/ManualsAndProcesses/Services/ManualTemplateService.cs`
   - Línea 736: `ActualizadoEn = paso.Diagrama.ActualizadoEn` → `ActualizadoEn = paso.Diagrama.UpdatedAt ?? paso.Diagrama.CreatedAt`
   - Línea 744 (dentro de `new ManualDiagram { ... }`, creación): `ActualizadoEn = DateTime.UtcNow` — **elimina esta línea del inicializador** (incluye la coma de la línea anterior si queda colgando).
   - Línea 756: `ActualizadoEn = diagrama.ActualizadoEn` → `ActualizadoEn = diagrama.UpdatedAt ?? diagrama.CreatedAt`
   - Línea 775: `ActualizadoEn = diagrama.ActualizadoEn` → `ActualizadoEn = diagrama.UpdatedAt ?? diagrama.CreatedAt`
   - Línea 786 (dentro de `ActualizarDiagramaAsync`, tras mutar `XmlContent`): `diagrama.ActualizadoEn = DateTime.UtcNow;` — **elimina esta línea completa** (`diagrama` está *tracked* en este método, sin `.AsNoTracking()` — `SaveChangesAsync` asigna `UpdatedAt` automáticamente).
   - Línea 796: `ActualizadoEn = diagrama.ActualizadoEn` → `ActualizadoEn = diagrama.UpdatedAt ?? diagrama.CreatedAt`

   No toques `ManualPasoDTO.cs:208` (`public DateTime ActualizadoEn`) — es un campo de un DTO
   distinto (`ManualPaso`, no `ManualDiagram`); no se encontró ningún mapeo explícito hacia ese
   campo desde `ManualDiagram.ActualizadoEn` en el código actual, pero **verifica tú mismo con
   grep** (`grep -rn "ManualPasoDTO" api/LuxuryApp.Application/Moduls/RecursosHumanosLuxuryApp/ManualsAndProcesses/Mapping/`)
   antes de dar el ticket por cerrado — si encuentras un mapeo real hacia ese campo, repórtalo, no
   lo cambies sin que se audite primero.

## Migración EF Core — requiere backfill manual, no uses lo que `dotnet ef` genere por defecto

Genera la migración con `dotnet ef migrations add`, nómbrala `OrphanAuditFieldsBatchB`, pero
**edítala a mano después de generarla** — por defecto, EF intentará agregar `CreatedAt` como
columna `NOT NULL` con `DateTime.MinValue` (`0001-01-01`) como valor por defecto para las filas
existentes, lo cual sería un dato falso y engañoso. En su lugar, el `Up()` debe seguir esta
secuencia de 3 pasos para cada tabla (`Diagrams`, `ManualFlows`):

```csharp
// 1) Renombrar la columna de actualización existente (preserva los datos)
migrationBuilder.RenameColumn(name: "Fecha de Actualización", table: "Diagrams", newName: "UpdatedAt");
migrationBuilder.RenameColumn(name: "ActualizadoEn", table: "ManualFlows", newName: "UpdatedAt");

// 2) Agregar CreatedAt como NULLABLE primero (no se puede agregar NOT NULL sin valor para filas existentes)
migrationBuilder.AddColumn<DateTime>(name: "CreatedAt", table: "Diagrams", type: "datetime2", nullable: true);
migrationBuilder.AddColumn<DateTime>(name: "CreatedAt", table: "ManualFlows", type: "datetime2", nullable: true);

// 3) Backfill: usa el valor que antes era "fecha de actualización" como mejor aproximación disponible
migrationBuilder.Sql("UPDATE Diagrams SET CreatedAt = UpdatedAt WHERE CreatedAt IS NULL;");
migrationBuilder.Sql("UPDATE ManualFlows SET CreatedAt = UpdatedAt WHERE CreatedAt IS NULL;");

// 4) Ahora sí, endurecer a NOT NULL (ya no hay filas con CreatedAt nulo)
migrationBuilder.AlterColumn<DateTime>(name: "CreatedAt", table: "Diagrams", type: "datetime2", nullable: false, oldClrType: typeof(DateTime), oldType: "datetime2", oldNullable: true);
migrationBuilder.AlterColumn<DateTime>(name: "CreatedAt", table: "ManualFlows", type: "datetime2", nullable: false, oldClrType: typeof(DateTime), oldType: "datetime2", oldNullable: true);

// 5) UpdatedAt pasa a nullable (antes era NOT NULL con default)
migrationBuilder.AlterColumn<DateTime>(name: "UpdatedAt", table: "Diagrams", type: "datetime2", nullable: true, oldClrType: typeof(DateTime), oldType: "datetime2", oldNullable: false);
migrationBuilder.AlterColumn<DateTime>(name: "UpdatedAt", table: "ManualFlows", type: "datetime2", nullable: true, oldClrType: typeof(DateTime), oldType: "datetime2", oldNullable: false);

// 6) Columnas nuevas de autor (igual patrón que FH-04a)
migrationBuilder.AddColumn<string>(name: "CreatedBy", table: "Diagrams", type: "nvarchar(max)", nullable: true);
migrationBuilder.AddColumn<string>(name: "UpdatedBy", table: "Diagrams", type: "nvarchar(max)", nullable: true);
migrationBuilder.AddColumn<string>(name: "CreatedBy", table: "ManualFlows", type: "nvarchar(max)", nullable: true);
migrationBuilder.AddColumn<string>(name: "UpdatedBy", table: "ManualFlows", type: "nvarchar(max)", nullable: true);
```

Este bloque es una **guía del orden y la lógica**, no una copia literal obligatoria — ajusta la
sintaxis exacta a lo que `dotnet ef migrations add` genere realmente para tu esquema (nombres de
parámICOS, `oldClrType`, etc.), pero **el `Up()` final debe seguir esta secuencia de 6 pasos**, con
el `UPDATE ... SET CreatedAt = UpdatedAt` como paso intermedio explícito. Si `dotnet ef` genera un
`AddColumn` de `CreatedAt` directamente como `nullable: false` con un `defaultValue`, bórralo y
reemplázalo por esta secuencia — no dejes pasar un backfill con `DateTime.MinValue` o cualquier
fecha inventada.

`Down()` debe revertir en orden inverso (no hace falta el backfill inverso — al hacer rollback,
`UpdatedAt` recupera su nombre y su `NOT NULL`, pero su valor para filas que solo tenían `CreatedAt`
por backfill quedaría con lo que tenga `UpdatedAt` en ese momento — es aceptable, un rollback de
esta migración no necesita ser perfectamente simétrico en datos, solo en esquema).

**Antes de generar la migración**, corre `SELECT COUNT(*) FROM Diagrams` y
`SELECT COUNT(*) FROM ManualFlows` contra la base de datos de desarrollo y reporta los resultados
literales — no es una guardia bloqueante, es registro para la auditoría.

**No ejecutes `dotnet ef database update`.**

## Lo que NO debes hacer

- No toques `DiagramDraw`/`ManualDiagram` fuera de lo descrito, ni ninguna otra entidad.
- No cambies el nombre de los campos de los DTOs de salida (`UpdateAt` en `DiagramDrawDTO`,
  `ActualizadoEn` en `ManualDiagramSimpleDTO`) — son contratos de API hacia el frontend, que sigue
  esperando esos nombres exactos.
- No agregues un valor de backfill inventado (`DateTime.MinValue`, fecha fija, etc.) para
  `CreatedAt` — usa el valor de `UpdatedAt` existente, como se especifica arriba.
- No ejecutes `dotnet ef database update`.

## Verificación obligatoria

```bash
dotnet build api/LuxuryApp.sln -o .tmp-audit-build

grep -rn "\.UpdateAt\b" api/LuxuryApp.Application/ api/LuxuryApp.Infrastructure.Data/ --include="*.cs"
grep -rn "\.ActualizadoEn\b" api/LuxuryApp.Application/ api/LuxuryApp.Infrastructure.Data/ --include="*.cs"
# Resultado esperado: 0 líneas en el lado de la ENTIDAD (los campos de los DTOs de salida,
# "UpdateAt"/"ActualizadoEn" como nombre de propiedad del DTO, sí pueden seguir apareciendo — son
# el contrato, no la entidad; confirma cuáles quedan y por qué)

node scripts/audit-conventions.mjs
node scripts/scan-mojibake.mjs api
```

## Criterio de PASO

- Las 2 entidades implementan `IAuditable` con el bloque completo de 4 propiedades.
- La migración sigue la secuencia de 6 pasos (rename → add nullable → backfill SQL → alter not
  null → alter UpdatedAt nullable → add CreatedBy/UpdatedBy), sin `DateTime.MinValue` ni fecha
  inventada.
- `dotnet build` sin errores nuevos.
- Los greps no devuelven referencias sin actualizar en el lado de la entidad.
- `audit-conventions.mjs`/`scan-mojibake.mjs` sin regresión (10 / 68).

## Reporte de finalización

1. Resultado literal de los 2 `SELECT COUNT(*)`.
2. Diff exacto de las 2 entidades y de los 2 archivos de servicio tocados.
3. Contenido completo del `Up()`/`Down()` de la migración.
4. Qué encontraste al verificar `ManualPasoDTO`/mapeo hacia `ActualizadoEn` (Tarea 2).
5. Salida literal de los comandos de verificación.
6. Decisiones que tomaste por tu cuenta y por qué.

No avances a ningún otro ticket. Espera la auditoría.
