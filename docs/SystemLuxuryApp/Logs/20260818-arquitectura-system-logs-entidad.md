# 01b - Reconocimiento de Estructura de Entidades (PASO 0.5)

**Módulo:** LuxuryAppLogs (nueva base de datos de auditoría/logs)
**Fecha:** 2026-08-18
**Tipo de trabajo:** A) Crear módulo nuevo (infraestructura de datos)

---

## Contexto descubierto en el código

La "base de datos LuxuryBuildingGroup" es el `DbContext` principal de la aplicación:

- `appsettings.json` → `"SQLServerConnection": "Data Source=.;Initial Catalog=LuxuryBuildingGroup;..."`
- `Database:Provider = SqlServer`
- Existe ya un patrón de **segundo contexto aislado** con su propia BD: `VaultDbContext`
  (`LuxuryApp.Infrastructure.Vault`, BD `LuxuryAppVault`, registrado con `UseSqlServer` directo).
- El sistema ya soporta multi-proveedor (`AppDatabaseProviderSettings`: Application / Logging / Hangfire),
  cada uno con su connection string.

Las dos entidades a migrar viven hoy en `ApplicationDbContext` (SQL Server):

---

## Entidad 1: `UserActivity` → tabla `UserActivities`

**Clase:** `LuxuryApp.Infrastructure.Data.Entities.UserActivity`
**Archivo:** `api/LuxuryApp.Infrastructure.Data/Data/Entities/System/System-AuditLogs/UserActivity.cs`
**Tabla:** `UserActivities` (creada por migración EF de `ApplicationDbContext`)

| Propiedad | Tipo | Propósito de negocio |
|---|---|---|
| `Id` | Guid (GuidIdEntity) | Identificador único. Se genera en cliente (`Guid.CreateVersion7()`), no en BD. |
| `ApplicationUserId` | string (columna `UserId`) | ID del usuario que realizó la acción (denormalizado, viene del claim `sub`). |
| `ApplicationUser` | navegación → `ApplicationUser` | **Relación FK cruzada** a la tabla de usuarios del DB principal. |
| `Timestamp` | DateTime (`Timestamp`) | Fecha/hora de la actividad (UTC). Es el campo de filtro para la migración. |
| `ActivityType` | string | Tipo/clasificación de la actividad. |
| `Details` | string | Detalle legible de la acción. |
| `IpAddress` | string | IP del cliente (PII). |
| `Endpoint` | string | Ruta del endpoint invocado. |
| `HttpMethod` | string | Verbo HTTP. |
| `RequestBody` | string | Cuerpo de la petición (PII potencial). |
| `ResponseStatus` | string | Estado de respuesta. |
| `UserAgent` | string | User-Agent del cliente (PII). |
| `Country` / `Region` / `City` | string (MaxLength 100) | Geolocalización derivada de la IP. |
| `Latitude` / `Longitude` | double? | Coordenadas geográficas. |

**Escritura (quiénes la usan hoy):**
- `LogUserActivityFilter` (filtro de acción) — `dbContext.UserActivity.Add(...)`.
- `LogUserActivityEndPointsFilter` — `dbContext.UserActivity.Add(...)`.
- `UserActivityService.LogActivityAsync` — invocado desde `AuthAppService` (login/logout exitoso/fallido).
- `AuthAppService` construye los objetos `UserActivity`.

**Lectura:**
- `UserActivityHistoryAppService.GetHistoryAsync` — historial paginado (`dbContext.UserActivity` con filtros customer/userType/fechas).

**Configuración:** No tiene `IEntityTypeConfiguration` propio; se mapea por atributos + convenciones globales de `ApplicationDbContext` (filtro soft-delete, conversor UTC, precision decimal).

---

## Entidad 2: `Log` → tabla `Logs` (gestionada por Serilog)

**Clase:** `LuxuryApp.Infrastructure.Data.Entities.Log`
**Archivo:** `api/LuxuryApp.Infrastructure.Data/Data/Entities/System/System-AuditLogs/Log.cs`
**Tabla real:** `Logs` (la clase dice `[Table("SystemLogs")]` pero `OnModelCreating` la sobreescribe a `"Logs"` con `ExcludeFromMigrations()`).

| Propiedad | Tipo | Propósito de negocio |
|---|---|---|
| `Id` | int (identity) | PK autoincremental nativa de Serilog. |
| `Message` | string | Mensaje del evento de log. |
| `MessageTemplate` | string | Plantilla Serilog. |
| `Level` | string | Severidad (Information, Error, Warning…). |
| `Timestamp` | DateTime | Fecha/hora del evento. |
| `Exception` | string | Detalle de excepción (si aplica). |
| `Properties` | string (XML/JSON) | Propiedades estructuradas de Serilog. |
| `UserName` | string | Usuario enriquecido por `LogUserNameMiddleware`. |

**Escritura:** **NO es código de la app**. Serilog escribe vía sink
(`DatabaseProviderServiceExtensions.WriteToConfiguredDatabase` → `MSSqlServer`/`SQL Server`,
`TableName = "Logs"`, `AutoCreateSqlTable = true`). Hoy apunta a la misma BD principal.

**Lectura:**
- `LogService` / `LogsEndPoints` (módulo `SystemLuxuryApp/System-AuditLogs/LogApp`) — consulta `dbContext.Log`.

**Configuración:** `modelBuilder.Entity<Log>().ToTable("Logs", t => t.ExcludeFromMigrations());`
→ EF la lee pero **nunca la crea ni modifica** (Serilog es dueño).

---

## Relaciones y GAPs detectados

1. **FK cruzada** `UserActivity → ApplicationUser`: al mover `UserActivity` a otra BD
   (SQL Server) **debe eliminarse la navegación/FK** y conservarse solo `ApplicationUserId` (string).
   No se halló uso de `Include(u => u.ApplicationUser)` en las búsquedas; el historial proyecta
   directo desde `ApplicationUserId`. *Pendiente verificación exhaustiva en PASO 3.*
2. **`Logs` no es migración EF**: su esquema lo define Serilog. Moverla implica repuntar el
   sink de Serilog a la nueva BD y que el `LogService` de lectura use el nuevo contexto.
3. **DateTime UTC**: el conversor global de `ApplicationDbContext` no existe en el nuevo contexto;
   se debe replicar o decidir explícitamente para `UserActivity.Timestamp`.

---

## Decisión de arquitectura propuesta (a confirmar en plan)

- Nueva BD **SQL Server** `LuxuryAppLogs`.
- Nuevo proyecto aislado `LuxuryApp.Infrastructure.Logs` con `LuxuryAppLogsDbContext`
  (patrón `VaultDbContext`), con **sus propias migraciones** (no mezclar proveedores en el assembly de `ApplicationDbContext`).
- `UserActivity` y `Log` se **mueven** a ese contexto; se **eliminan** de `ApplicationDbContext`.
- Serilog se repunta a `LuxuryAppLogs` (SQL Server).
- Consumidores (`LogUserActivityFilter*`, `UserActivityService`, `UserActivityHistoryAppService`,
  `LogService`) inyectan `LuxuryAppLogsDbContext` en lugar de `ApplicationDbContext`.
