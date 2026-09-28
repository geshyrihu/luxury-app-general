# TICKET FH-09a — Backend: columnas `DateOnly?` aditivas + backfill (RRHH-Permisos)

Trabajas en el repositorio LuxuryApp (.NET 10, `api/`). Antes de escribir código, lee
`CONVENTIONS.md` y `conventions/backend/backend-rules.md` (sección "🔴 REGLA
CRÍTICA: Fechas y horas..."). Lee también
`docs/reporte_maestro/temas-transversales/20260826-auditoria-manejo-fechas-horas.md`, sección 5.4
("Estrategia de migración segura") — este ticket implementa **solo los pasos 1 y 2** de esa
estrategia de 5 pasos (aditivo + backfill verificado). Los pasos 3-5 (validación en producción,
cutover del código de aplicación, limpieza de la columna vieja) son tickets futuros, NO este.

## Contexto

FH-05 (diagnóstico, ya cerrado) corrió una consulta de distribución de horas sobre 6 campos
`DateTime` de RRHH-Permisos y confirmó que **todos tienen variación horaria real** (patrón de
horario laboral de México en UTC: concentración en horas UTC 14-23, con una cola real de ~4% de
filas en horas UTC 0-7 — solicitudes hechas de noche en México que UTC empuja al día calendario
siguiente). El usuario, como dueño de negocio de este dato, confirmó explícitamente: **el día
correcto para los 6 campos es el día calendario de México**, no el día UTC.

Los 6 campos (4 entidades, todas en `api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Hr/AsistenciayVacaciones/`):

| Entidad | Campo `DateTime` existente | Tipo | Tabla física |
|---|---|---|---|
| `LeaveRequest` | `RequestDate` | `DateTime` (no nulo) | `LeaveRequests` |
| `LeaveRequest` | `ApprovalDate` | `DateTime?` | `LeaveRequests` |
| `LeaveRequestHistory` | `ChangeDate` | `DateTime` (no nulo) | `LeaveRequestHistory` (tabla vacía, 0 filas) |
| `VacationRequest` | `RequestDate` | `DateTime` (no nulo) | `VacationRequests` |
| `VacationRequest` | `ApprovalDate` | `DateTime?` | `VacationRequests` |
| `VacationRequestHistory` | `ChangeDate` | `DateTime` (no nulo) | `VacationRequestHistory` |

**Este ticket NO renombra ni toca esos 6 campos `DateTime` existentes, y NO toca ningún DTO ni
servicio de aplicación.** Solo agrega, por cada uno, una columna **nueva, nullable, aditiva**, con
el mismo nombre + sufijo `Day` (`RequestDay`, `ApprovalDay`, `ChangeDay`), tipo `DateOnly?`, y hace
el backfill verificado desde el campo `DateTime` existente convertido a día calendario de México.
El código de la aplicación sigue leyendo/escribiendo los campos `DateTime` viejos exactamente igual
que hoy — el cutover a las columnas nuevas es un ticket posterior, después de un período de
validación.

## Tarea 1 — `LeaveRequest.cs`

Archivo: `api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Hr/AsistenciayVacaciones/LeaveRequest.cs`

Después de la propiedad `RequestDate` (línea ~82), agrega:
```csharp
/// <summary>
/// Día calendario de México (derivado de <see cref="RequestDate"/> UTC) en el que se registró la
/// solicitud. Columna aditiva para migración a DateOnly — no reemplaza a RequestDate todavía.
/// </summary>
public DateOnly? RequestDay { get; set; }
```

Después de la propiedad `ApprovalDate` (línea ~99), agrega:
```csharp
/// <summary>
/// Día calendario de México (derivado de <see cref="ApprovalDate"/> UTC) en el que se aprobó la
/// solicitud. Columna aditiva para migración a DateOnly — no reemplaza a ApprovalDate todavía.
/// </summary>
public DateOnly? ApprovalDay { get; set; }
```

## Tarea 2 — `LeaveRequestHistory.cs`

Archivo: `api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Hr/AsistenciayVacaciones/LeaveRequestHistory.cs`

Después de la propiedad `ChangeDate` (línea ~53), agrega:
```csharp
/// <summary>
/// Día calendario de México (derivado de <see cref="ChangeDate"/> UTC) en el que se registró el
/// cambio. Columna aditiva para migración a DateOnly — no reemplaza a ChangeDate todavía.
/// </summary>
public DateOnly? ChangeDay { get; set; }
```

## Tarea 3 — `VacationRequest.cs`

Archivo: `api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Hr/AsistenciayVacaciones/VacationRequest.cs`

Mismo patrón que la Tarea 1: agrega `RequestDay` (`DateOnly?`) después de `RequestDate` (línea
~58) y `ApprovalDay` (`DateOnly?`) después de `ApprovalDate` (línea ~75), con comentarios análogos.

## Tarea 4 — `VacationRequestHistory.cs`

Archivo: `api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Hr/AsistenciayVacaciones/VacationRequestHistory.cs`

Mismo patrón que la Tarea 2: agrega `ChangeDay` (`DateOnly?`) después de `ChangeDate` (línea ~43),
con comentario análogo.

## Migración EF Core

Genera la migración base con `dotnet ef migrations add DateOnlyRrhhPermisosAditivo` — debería salir
como 6 `AddColumn<DateOnly>(..., nullable: true)`, uno por campo nuevo, sin tocar ninguna columna
existente. **Verifica que sea así antes de continuar** (si aparece cualquier `RenameColumn`,
`DropColumn` o `AlterColumn` sobre los 6 campos `DateTime` originales, detente y repórtalo — este
ticket no toca esas columnas).

Luego edita el `Up()` generado para agregar el backfill, **después** de los 6 `AddColumn` y antes de
que termine el método:

```csharp
migrationBuilder.Sql(@"
UPDATE LeaveRequests SET RequestDay =
    CAST(RequestDate AT TIME ZONE 'UTC' AT TIME ZONE 'Central Standard Time (Mexico)' AS date)
WHERE RequestDay IS NULL;

UPDATE LeaveRequests SET ApprovalDay =
    CAST(ApprovalDate AT TIME ZONE 'UTC' AT TIME ZONE 'Central Standard Time (Mexico)' AS date)
WHERE ApprovalDate IS NOT NULL AND ApprovalDay IS NULL;

UPDATE LeaveRequestHistory SET ChangeDay =
    CAST(ChangeDate AT TIME ZONE 'UTC' AT TIME ZONE 'Central Standard Time (Mexico)' AS date)
WHERE ChangeDay IS NULL;

UPDATE VacationRequests SET RequestDay =
    CAST(RequestDate AT TIME ZONE 'UTC' AT TIME ZONE 'Central Standard Time (Mexico)' AS date)
WHERE RequestDay IS NULL;

UPDATE VacationRequests SET ApprovalDay =
    CAST(ApprovalDate AT TIME ZONE 'UTC' AT TIME ZONE 'Central Standard Time (Mexico)' AS date)
WHERE ApprovalDate IS NOT NULL AND ApprovalDay IS NULL;

UPDATE VacationRequestHistory SET ChangeDay =
    CAST(ChangeDate AT TIME ZONE 'UTC' AT TIME ZONE 'Central Standard Time (Mexico)' AS date)
WHERE ChangeDay IS NULL;
");
```

El `Down()` generado por EF (6 `DropColumn`) no necesita cambios — es correcto tal cual (borrar
columnas aditivas no pierde nada del campo `DateTime` original, que nunca se tocó).

**Ya se confirmó** (por el usuario, contra la base real) que `AT TIME ZONE 'Central Standard Time
(Mexico)'` es reconocido por la instancia de SQL Server de este proyecto — no hace falta volver a
verificarlo, pero si tu entorno de build/test da un error distinto de reconocimiento de zona
horaria, repórtalo explícitamente antes de continuar.

**No ejecutes `dotnet ef database update`** — igual que en el resto de este proyecto, la aplicación
a una base de datos concreta es una decisión separada del usuario.

## Lo que NO debes hacer

- No toques los 6 campos `DateTime` existentes (`RequestDate`, `ApprovalDate`, `ChangeDate` en las 4
  entidades) — ni su tipo, ni su nombre, ni su nullability.
- No toques ningún DTO, servicio de aplicación, ni endpoint — este ticket es puramente de esquema
  (entidad + migración). El cutover del código de aplicación a las columnas `*Day` es un ticket
  futuro, después de un período de validación en producción.
- No hagas `AlterColumn` para endurecer las columnas nuevas a `NOT NULL` — quedan `DateOnly?`
  nullable por ahora a propósito, incluso las que en teoría tendrían 100% de cobertura tras el
  backfill (`RequestDay`, `ChangeDay`). Endurecerlas es un paso posterior, no de este ticket.
- No ejecutes `dotnet ef database update`.

## Verificación obligatoria

```bash
dotnet build api/LuxuryApp.sln -o .tmp-audit-build

# Confirma que las 6 columnas nuevas no se leen/escriben en ningún servicio todavía (deben ser 0):
grep -rn "\.RequestDay\b\|\.ApprovalDay\b\|\.ChangeDay\b" api/LuxuryApp.Application/ --include="*.cs"

node scripts/audit-conventions.mjs
node scripts/scan-mojibake.mjs api
```

## Criterio de PASO

- Las 4 entidades tienen las 6 propiedades nuevas `DateOnly?`, sin tocar las propiedades `DateTime`
  existentes.
- La migración generada tiene únicamente 6 `AddColumn<DateOnly>(..., nullable: true)` más el bloque
  `migrationBuilder.Sql(...)` de backfill agregado a mano — nada de `RenameColumn`/`DropColumn`/
  `AlterColumn` sobre las columnas viejas.
- `dotnet build` sin errores nuevos.
- El grep de verificación da 0 resultados (nadie consume las columnas nuevas todavía).
- `audit-conventions.mjs`/`scan-mojibake.mjs` sin regresión respecto al baseline (10 / 69).

## Reporte de finalización

1. Diff exacto de las 4 entidades.
2. Contenido completo de la migración generada (`Up()`/`Down()`), confirmando que el `Up()` original
   de EF (antes de tu edición manual) solo tenía los 6 `AddColumn` — pega también el `Up()` final con
   el backfill ya agregado.
3. Salida literal de los comandos de verificación.
4. Decisiones que tomaste por tu cuenta y por qué.

No avances a ningún otro ticket. Espera la auditoría.
