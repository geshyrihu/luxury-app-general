-- ============================================================================
-- Migración de datos: LuxuryBuildingGroup -> LuxuryAppLogs
-- Módulo: LuxuryAppLogs  |  Fecha: 2026-08-18
-- Ejecuta: Tech Lead (ver data-migration-protocol.md §3.5)
-- ⚠️ La BD LuxuryAppLogs y la tabla UserActivities deben existir (migración
--    InitialLuxuryAppLogs ya aplicada) antes de ejecutar esto.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- PASO 1: Backup de la tabla origen (opcional pero recomendado)
-- ----------------------------------------------------------------------------
-- SELECT * INTO LuxuryBuildingGroup.dbo.UserActivities_Backup_20260818
-- FROM LuxuryBuildingGroup.dbo.UserActivities;

-- ----------------------------------------------------------------------------
-- PASO 2: Copiar SOLO UserActivities con Timestamp >= 2026-01-01 (UTC)
--         El Id se preserva (trazabilidad, RN-LOG-003).
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- PASO 3: Validación (debe coincidir con el origen filtrado por Id)
-- ----------------------------------------------------------------------------
-- SELECT COUNT(*) FROM LuxuryAppLogs.dbo.UserActivities;          -- == conteo destino
-- SELECT COUNT(*) FROM LuxuryBuildingGroup.dbo.UserActivities
--   WHERE Timestamp >= '2026-01-01T00:00:00';                    -- == conteo origen (rango)
-- Validar que no haya NULLs inesperados y spot-check de 5 filas por Id.

-- ============================================================================
-- FASE 5 (IRREVERSIBLE) — SOLO tras validación + backup
-- ============================================================================

-- Eliminar tabla UserActivities de la BD transaccional (ya migrada)
-- (Se genera vía migración EF DropUserActivities en ApplicationDbContext)
-- EQUIVALENTE SQL:
-- DROP TABLE LuxuryBuildingGroup.dbo.UserActivities;

-- Eliminar tabla Logs de la BD transaccional (Serilog ya apunta a LuxuryAppLogs)
-- La tabla Logs NO es de EF (ExcludeFromMigrations); se elimina por fuera:
-- DROP TABLE LuxuryBuildingGroup.dbo.Logs;

-- Nota: los archivos de entidad origen (UserActivity.cs, Log.cs) en
-- LuxuryApp.Infrastructure.Data y los DbSet en ApplicationDbContext se eliminan
-- en Fase 5 del código tras confirmar el cutover.
