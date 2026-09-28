# TICKET FH-09b — Backend: columnas `DateOnly?` aditivas + backfill (Nómina + Mantenimiento)

Trabajas en el repositorio LuxuryApp (.NET 10, `api/`). Antes de escribir código, lee
`CONVENTIONS.md` y `conventions/backend/backend-rules.md` (sección "🔴 REGLA
CRÍTICA: Fechas y horas..."). Lee también
`docs/reporte_maestro/temas-transversales/20260826-auditoria-manejo-fechas-horas.md`, sección 5.4
("Estrategia de migración segura") — este ticket implementa **solo los pasos 1 y 2** de esa
estrategia (aditivo + backfill verificado), igual que `FH-09a` (ya cerrado y aprobado) — usa ese
ticket como referencia de estilo si necesitas un ejemplo de un `Up()` ya verificado.

## Contexto

FH-06 (diagnóstico, ya cerrado) confirmó que las dos tablas involucradas están **actualmente
vacías** en la base de datos de referencia (`PayrollSummaries`: 0 filas, `BitacoraMantenimiento`: 0
filas) — no hay riesgo de datos existentes con el día equivocado hoy. Aun así, el usuario confirmó
aplicar el mismo criterio de negocio que en FH-05: **el día correcto es el día calendario de
México**, por consistencia hacia adelante (en cuanto haya datos reales, el backfill ya sabe qué
regla aplicar).

Tres campos, dos entidades (ambas en `api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/`):

| Entidad | Campo `DateTime` existente | Tipo | Tabla física | Columna física |
|---|---|---|---|---|
| `NominaEncabezado` (`Hr/Payroll/NominaEncabezado.cs`) | `FechaAprobacion` | `DateTime?` | `PayrollSummaries` | `FechaAprobacion` (sin override) |
| `NominaEncabezado` (`Hr/Payroll/NominaEncabezado.cs`) | `FechaCierre` | `DateTime?` | `PayrollSummaries` | `FechaCierre` (sin override) |
| `BitacoraMantenimiento` (`Maintenance/Logs/BitacoraMantenimiento.cs`) | `FechaRegistro` | `DateTime` (no nulo) | `BitacoraMantenimiento` | **`RegisteredAt`** (`[Column("RegisteredAt")]` — ¡el nombre de columna NO coincide con el de la propiedad!) |

**Ojo con `BitacoraMantenimiento`:** la propiedad C# se llama `FechaRegistro` pero la columna real
en SQL Server es `RegisteredAt` (mapeada explícitamente vía `[Column("RegisteredAt")]`). El backfill
SQL debe usar `RegisteredAt`, no `FechaRegistro`, o fallará igual que el `sp_rename` de `Diagrams`
en el incidente de Fase 2.

**Este ticket NO renombra ni toca los 3 campos `DateTime` existentes, y NO toca ningún DTO ni
servicio de aplicación.** Solo agrega, por cada uno, una columna nueva, nullable, aditiva, tipo
`DateOnly?`, con el nombre de la propiedad + sufijo `Day`, y hace el backfill verificado desde el
campo `DateTime` existente convertido a día calendario de México (aunque hoy no haya filas que
backfillear).

## Tarea 1 — `NominaEncabezado.cs`

Archivo: `api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Hr/Payroll/NominaEncabezado.cs`

Después de la propiedad `FechaAprobacion` (línea ~61), agrega:
```csharp
/// <summary>
/// Día calendario de México (derivado de <see cref="FechaAprobacion"/> UTC) en el que se aprobó la
/// nómina. Columna aditiva para migración a DateOnly — no reemplaza a FechaAprobacion todavía.
/// </summary>
public DateOnly? FechaAprobacionDay { get; set; }
```

Después de la propiedad `FechaCierre` (línea ~71), agrega:
```csharp
/// <summary>
/// Día calendario de México (derivado de <see cref="FechaCierre"/> UTC) en el que se cerró la
/// nómina. Columna aditiva para migración a DateOnly — no reemplaza a FechaCierre todavía.
/// </summary>
public DateOnly? FechaCierreDay { get; set; }
```

## Tarea 2 — `BitacoraMantenimiento.cs`

Archivo: `api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Maintenance/Logs/BitacoraMantenimiento.cs`

Después de la propiedad `FechaRegistro` (línea ~24), agrega:
```csharp
/// <summary>
/// Día calendario de México (derivado de <see cref="FechaRegistro"/> UTC) en el que se registró el
/// evento. Columna aditiva para migración a DateOnly — no reemplaza a FechaRegistro todavía.
/// </summary>
public DateOnly? FechaRegistroDay { get; set; }
```
No agregues `[Column(...)]` a esta propiedad nueva — a diferencia de `FechaRegistro`, no hace falta
mapeo explícito, el nombre de columna por convención (`FechaRegistroDay`) es el que queremos.

## Migración EF Core

Genera la migración con `dotnet ef migrations add DateOnlyNominaMantenimientoAditivo` — debería
salir como 3 `AddColumn<DateOnly>(..., nullable: true)`, sin tocar ninguna columna existente.
**Verifica que sea así antes de continuar** (si aparece cualquier `RenameColumn`, `DropColumn` o
`AlterColumn` sobre los 3 campos `DateTime` originales, o sobre cualquier otra columna, detente y
repórtalo).

Luego edita el `Up()` generado para agregar el backfill, después de los 3 `AddColumn`:

```csharp
migrationBuilder.Sql(@"
UPDATE PayrollSummaries SET FechaAprobacionDay =
    CAST(FechaAprobacion AT TIME ZONE 'UTC' AT TIME ZONE 'Central Standard Time (Mexico)' AS date)
WHERE FechaAprobacion IS NOT NULL AND FechaAprobacionDay IS NULL;

UPDATE PayrollSummaries SET FechaCierreDay =
    CAST(FechaCierre AT TIME ZONE 'UTC' AT TIME ZONE 'Central Standard Time (Mexico)' AS date)
WHERE FechaCierre IS NOT NULL AND FechaCierreDay IS NULL;

UPDATE BitacoraMantenimiento SET FechaRegistroDay =
    CAST(RegisteredAt AT TIME ZONE 'UTC' AT TIME ZONE 'Central Standard Time (Mexico)' AS date)
WHERE FechaRegistroDay IS NULL;
");
```

Nota que el backfill de `BitacoraMantenimiento` lee de la columna física `RegisteredAt`, no de
`FechaRegistro` (que no existe como nombre de columna en SQL Server).

El `Down()` generado por EF (3 `DropColumn`) no necesita cambios.

**No ejecutes `dotnet ef database update`** — igual que en el resto de este proyecto.

## Lo que NO debes hacer

- No toques los 3 campos `DateTime` existentes (`FechaAprobacion`, `FechaCierre`, `FechaRegistro`)
  — ni su tipo, ni su nombre, ni su `[Column(...)]`, ni su nullability.
- No toques ningún DTO, servicio de aplicación, ni endpoint.
- No hagas `AlterColumn` para endurecer las columnas nuevas a `NOT NULL`.
- No ejecutes `dotnet ef database update`.

## Verificación obligatoria

```bash
dotnet build api/LuxuryApp.sln -o .tmp-audit-build

grep -rn "\.FechaAprobacionDay\b\|\.FechaCierreDay\b\|\.FechaRegistroDay\b" api/LuxuryApp.Application/ --include="*.cs"
# Resultado esperado: 0 líneas

node scripts/audit-conventions.mjs
node scripts/scan-mojibake.mjs api
```

## Criterio de PASO

- Las 2 entidades tienen las 3 propiedades nuevas `DateOnly?`, sin tocar las propiedades `DateTime`
  existentes ni sus atributos `[Column(...)]`.
- La migración generada tiene únicamente 3 `AddColumn<DateOnly>(..., nullable: true)` más el
  backfill agregado a mano — nada de `RenameColumn`/`DropColumn`/`AlterColumn` sobre columnas viejas.
- El backfill de `BitacoraMantenimiento` usa `RegisteredAt`, no `FechaRegistro`.
- `dotnet build` sin errores nuevos.
- El grep de verificación da 0 resultados.
- `audit-conventions.mjs`/`scan-mojibake.mjs` sin regresión respecto al baseline (10 / 69).

## Reporte de finalización

1. Diff exacto de las 2 entidades.
2. Contenido completo de la migración generada (`Up()`/`Down()`).
3. Salida literal de los comandos de verificación.
4. Decisiones que tomaste por tu cuenta y por qué.

No avances a ningún otro ticket. Espera la auditoría.
