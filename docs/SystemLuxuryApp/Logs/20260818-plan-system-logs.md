# 04 - Plan de Implementación

**Módulo:** LuxuryAppLogs
**Fecha:** 2026-08-18
**Estructura:** 11 secciones mínimas (plan-creation-protocol) + §3.5 migración de datos

---

## 1. Metadata

- **Autor:** Agente de planeación (skill planeacion-modulos)
- **Tipo:** A) Módulo nuevo (infraestructura de datos)
- **Estado:** Borrador para aprobación
- **Depende de:** FASE 0 (../../../docs/CollectionsLuxuryApp/CobranzaOnline/20260805-business-rules-collections-cobranza-online.md), Riesgos (03)
- **Convenciones:** CONVENTIONS.md §4.5/§4.6, data-migration-protocol.md

## 2. Resumen Ejecutivo

Se crea una base de datos aislada **`LuxuryAppLogs` (SQL Server)** para alojar las tablas de
auditoría `UserActivities` y `Logs`, hoy acopladas a la BD transaccional `LuxuryBuildingGroup`
(SQL Server). Se migran solo las filas de `UserActivities` con `Timestamp >= 2026-01-01`; los
`Logs` históricos no se migran. Finalmente se eliminan las tablas y la lógica de `LuxuryBuildingGroup`.
Se sigue el patrón de segundo contexto aislado ya existente (`VaultDbContext`).

## 3. Objetivo

Separar datos de auditoría/logs de la BD transaccional hacia `LuxuryAppLogs` (SQL Server),
preservando escritura continua (Serilog) y lectura de historial, sin pérdida de las filas
de `UserActivities` del periodo definido.

## 4. Alcance

**Incluye:**
- Nuevo proyecto `LuxuryApp.Infrastructure.Logs` + `LuxuryAppLogsDbContext` (SQL Server, catálogo `LuxuryAppLogs`).
- Mover entidades `UserActivity` y `Log` al nuevo contexto (sin FK a `ApplicationUser`).
- Nueva connection string `LuxuryAppLogsConnection` (SQL Server).
- Repuntar Serilog a `LuxuryAppLogs`.
- Migración de datos de `UserActivities` (Timestamp ≥ 2026-01-01).
- Actualizar consumidores (`LogUserActivityFilter*`, `UserActivityService`, `UserActivityHistoryAppService`, `LogService`).
- Eliminar `UserActivities` y `Logs` de `LuxuryBuildingGroup` (tras validación).

**Excluye:**
- Migración de datos históricos de `Logs` (decisión de negocio, RN-LOG-007).
- Migración de `UserActivities` anteriores a 2026-01-01.
- Cambios de contrato en frontend (se conservan endpoints/DTOs).

## 5. Restricciones

- `LuxuryAppLogs` **debe ser SQL Server** (decisión dueño).
- Migración entre catálogos SQL Server (`LuxuryBuildingGroup` → `LuxuryAppLogs`) ⇒ posible con T-SQL `INSERT...SELECT` (mismo proveedor).
- El DROP de `UserActivities` en `LuxuryBuildingGroup` es **irreversible** ⇒ solo tras validación + backup.
- No modificar shared/contráctos sin aprobación (CONVENTIONS §6.1).
- Respetar encoding sin mojibake (CONVENTIONS §6.1).

## 6. Fases

### Fase 0 — Preparación de infraestructura (reversible)
1. Crear proyecto `api/LuxuryApp.Infrastructure.Logs` (class library, estilo `LuxuryApp.Infrastructure.Vault`).
2. Definir `LuxuryAppLogsDbContext : DbContext` con `UseSqlServer`.
3. Mover `UserActivity.cs` y `Log.cs` al nuevo proyecto; **eliminar navegación `ApplicationUser`** de `UserActivity`.
4. Configurar `OnModelCreating`: conversor UTC en `Timestamp`; `Log` con `ExcludeFromMigrations` mapeada a tabla `Logs`.
5. Crear migración inicial del nuevo contexto (assembly propio).
6. Registrar `AddLuxuryAppLogsServices(configuration)` en `Program.cs` (leer `LuxuryAppLogsConnection`).

### Fase 1 — Repuntar Serilog (reversible)
7. Añadir `LuxuryAppLogsConnection` (SQL Server, mismo servidor) en `appsettings.json` (dev/staging/prod).
8. Modificar `DatabaseProviderServiceExtensions` para que el sink de Serilog use `LuxuryAppLogsConnection` (MSSqlServer, `AutoCreateSqlTable=true`, columnas de `CreateSqlServerLogColumnOptions` alineadas a `Log.cs`).
9. Smoke test: arrancar app y confirmar que Serilog crea/escribe `Logs` en `LuxuryAppLogs`.

### Fase 2 — Redirigir escritura/lectura de `UserActivity` (reversible)
10. `LogUserActivityFilter`, `LogUserActivityEndPointsFilter`, `UserActivityService`: inyectar `LuxuryAppLogsDbContext`.
11. `UserActivityHistoryAppService`: **reescribir con lookup dual de contexto** (ver 03-riesgos §3.3):
    - Filtros `customerId`/`userType`: resolver `ApplicationUserId`s desde `ApplicationDbContext.ApplicationUsers` y filtrar `UserActivity` (nuevo contexto) por ese conjunto.
    - Proyección DTO (`FullName`, `PhotoPath`, `TypePerson`, `CustomerId`): cargar diccionario `ApplicationUserId → UserDto` desde `ApplicationDbContext` y enriquecer en memoria.
    - Paginación directa desde `LuxuryAppLogsDbContext` cuando no hay filtros de usuario.
12. Compilar y ejecutar prueba feliz (F1): se genera actividad en `LuxuryAppLogs`.

### Fase 3 — Migración de datos `UserActivities` (reversible en destino)
13. Crear script de migración T-SQL `INSERT...SELECT` entre catálogos (origen `LuxuryBuildingGroup` → destino `LuxuryAppLogs`), filtrando `Timestamp >= '2026-01-01'` (UTC) y **preservando `Id`** (RN-LOG-003). Alternativamente, herramienta .NET que lea desde `ApplicationDbContext` y escriba en `LuxuryAppLogsDbContext`.
14. Ejecutar en dev; validar K1 (COUNT por Id origen == destino).

### Fase 4 — Validación y cutover (punto de no retorno controlado)
15. Validar K1–K5; comparar conteos; spot-check de filas.
16. `BACKUP`/`snapshot` de `LuxuryBuildingGroup`.

### Fase 5 — Eliminación en `LuxuryBuildingGroup` (IRREVERSIBLE)
17. Nueva migración en `ApplicationDbContext`: `DropTable("UserActivities")`.
18. Eliminar `DbSet<UserActivity>`, `DbSet<Log>` y `modelBuilder.Entity<Log>()...` de `ApplicationDbContext`; borrar archivos de entidad del proyecto `Data`.
19. Eliminar tabla `Logs` de `LuxuryBuildingGroup` por SQL (fuera de EF, pues era Serilog/ExcludeFromMigrations), tras confirmar que Serilog ya no escribe ahí.
20. grep + compilación para garantizar 0 referencias residuales (K5).

## 7. Checklist por fase

- [ ] F0.1–F0.6: proyecto, contexto, migración inicial, registración
- [ ] F1.7–F1.9: connection string + Serilog + smoke test escritura `Logs`
- [ ] F2.10–F2.12: redirección de filtros/servicios/historial + prueba feliz
- [ ] F3.13–F3.14: script migración + validación K1
- [ ] F4.15–F4.16: validación K1–K5 + backup
- [ ] F5.17–F5.20: drop EF + limpieza código + drop `Logs` SQL + grep/K5

## 8. Criterios de Paso

- **Fase 0→1:** `LuxuryAppLogs` existe en SQL Server y la migración inicial aplica sin error.
- **Fase 1→2:** Serilog escribe `Logs` en `LuxuryAppLogs` (PM-1 mitigado).
- **Fase 2→3:** Al menos 1 `UserActivity` nueva se escribe en `LuxuryAppLogs` tras un request.
- **Fase 3→4:** `COUNT` origen (≥2026-01-01, por Id) == `COUNT` destino (K1); K2 == 0.
- **Fase 4→5:** K3 (Serilog up), K4 (latencia historial), K5 (0 refs) cumplidos; backup realizado.
- **Cierre:** Solución compila, 0 referencias residuales, datos validados.

## 9. Riesgos

Ver `03-riesgos-dependencias.md` (R-01…R-09). Destacados:
- R-03 DROP irreversible ⇒ fase separada + backup.
- R-01 FK cruzada ⇒ eliminar navegación (verificación de usos pendiente §3.3).
- R-04/R-05 Serilog schema ⇒ smoke test + alineación `Log.cs`.

## 10. Dependencias / Impactos

Ver `03-riesgos-dependencias.md` §3.2. Impacto principal en `ApplicationDbContext`, Serilog,
filtros de actividad y servicios de lectura. Frontend sin cambios de contrato.

## 11. Cierre Esperado

- BD `LuxuryAppLogs` (SQL Server) operativa con `UserActivities` (datos ≥2026-01-01) y `Logs` (nuevos).
- `LuxuryBuildingGroup` sin las tablas ni la lógica de auditoría/logs.
- Escritura (Serilog + filtros) y lectura de historial funcionando contra el nuevo contexto.
- Documentación del módulo actualizada; plan marcado como Aprobado/Ejecutado.

---

## 3.5 Migración de Datos & Prevención de Pérdida

**Responsable:** Tech Lead (crear SQL/herramienta, ejecutar, validar). Agentes documentan QUÉ.

### 3.5.1 Cambios de estructura

| Tabla | Cambio | Tipo | Riesgo | Mitigación |
|---|---|---|---|---|
| UserActivities (destino) | Crear en `LuxuryAppLogs` (SQL Server), sin FK a `ApplicationUser` | Crear tabla | Bajo | Mismo esquema; `ApplicationUserId` string |
| UserActivities (origen) | DROP en `LuxuryBuildingGroup` | DROP tabla | 🔴 Crítico | Fase 5, tras validación + backup |
| Logs (origen) | DROP en `LuxuryBuildingGroup` | DROP tabla | Medio | Tras confirmar Serilog apunta a nuevo DB |

### 3.5.2 Análisis de pérdida

- `UserActivities` previas a 2026-01-01: **no se migran** (por diseño, RN-LOG-006). No es pérdida inadvertida.
- `Logs` históricos: **no se migran** (RN-LOG-007).
- Riesgo real: omitir filas del rango por zona horaria (PM-2) ⇒ filtrar en UTC y validar por `Id`.

### 3.5.3 Plan de migración (ejecuta Tech Lead)

Pseudocódigo — Opción A (T-SQL `INSERT...SELECT` entre catálogos, mismo servidor):

```sql
-- Crear tabla destino con mismo esquema (sin FK a ApplicationUser)
-- Luego copiar solo el rango definido, preservando Id
INSERT INTO LuxuryAppLogs.dbo.UserActivities (
    Id, UserId, Timestamp, ActivityType, Details, IpAddress, Endpoint,
    HttpMethod, RequestBody, ResponseStatus, UserAgent,
    Country, Region, City, Latitude, Longitude)
SELECT
    Id, UserId, Timestamp, ActivityType, Details, IpAddress, Endpoint,
    HttpMethod, RequestBody, ResponseStatus, UserAgent,
    Country, Region, City, Latitude, Longitude
FROM LuxuryBuildingGroup.dbo.UserActivities
WHERE Timestamp >= '2026-01-01T00:00:00';
```

Pseudocódigo — Opción B (herramienta .NET, ambos SQL Server):

```csharp
// LEER (LuxuryBuildingGroup)
var source = appDb.UserActivity
    .Where(u => u.Timestamp >= new DateTime(2026,1,1,0,0,0,DateTimeKind.Utc))
    .OrderBy(u => u.Id)
    .ToList(); // por lotes

// ESCRIBIR (LuxuryAppLogs) preservando Id
foreach (var u in source) {
    logsDb.UserActivity.Add(new UserActivity {
        Id = u.Id,                       // preservado (RN-LOG-003)
        ApplicationUserId = u.ApplicationUserId,
        Timestamp = u.Timestamp,
        ActivityType = u.ActivityType,
        Details = u.Details,
        IpAddress = u.IpAddress,
        Endpoint = u.Endpoint,
        HttpMethod = u.HttpMethod,
        RequestBody = u.RequestBody,
        ResponseStatus = u.ResponseStatus,
        UserAgent = u.UserAgent,
        Country = u.Country, Region = u.Region, City = u.City,
        Latitude = u.Latitude, Longitude = u.Longitude
    });
}
await logsDb.SaveChangesAsync();
```

`Logs`: **no hay script de copia** (RN-LOG-007).

### 3.5.4 Validación post-migración (checklist)

- [ ] Backup/snapshot de `LuxuryBuildingGroup` realizado
- [ ] `COUNT` origen (≥2026-01-01, por Id) == `COUNT` destino (K1)
- [ ] `COUNT` destino de `Logs` histórico == 0 (K2)
- [ ] Spot-check de 5 filas (Id, Timestamp, ApplicationUserId) coinciden
- [ ] Endpoint de historial responde en nuevo DB (K4)
- [ ] Serilog escribe en `LuxuryAppLogs` (K3)

### 3.5.5 Rollback

- Creación de `LuxuryAppLogs` y copia de datos: **reversible** (DROP BD / `TRUNCATE` tabla destino).
- Repuntar Serilog: reversible (config).
- **DROP de `UserActivities`/`Logs` en origen: IRREVERSIBLE** ⇒ solo tras validación y backup (Fase 5).

### 3.5.6 Comunicación

- Tech Lead confirma "Migración exitosa, validación PASS".
- Log de ejecución en `docs/reporte_maestro/`.
- Devs notificados si hay cambios en modelo/DTO (no se esperan).
