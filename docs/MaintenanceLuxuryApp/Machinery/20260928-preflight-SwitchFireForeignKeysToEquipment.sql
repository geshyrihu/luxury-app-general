/* =====================================================================================================
   PRE-VUELO · T-203 · SwitchFireForeignKeysToEquipment
   Correr en PRODUCCIÓN (solo lectura, no modifica nada) ANTES de desplegar la migración de FK.
   Esperado: 0 en las 12 filas. Si cualquiera da > 0, DETENERSE — no desplegar la migración todavía.
   Nombres de tabla/columna verificados directo del SQL real de la migración
   (20260928-migracion-SwitchFireForeignKeysToEquipment.sql).
   ===================================================================================================== */
SELECT 'FireExtinguisherLogs' AS Tabla, COUNT(*) AS Huerfanos
FROM FireExtinguisherLogs x
LEFT JOIN Equipment e ON e.Id = x.ExtinguisherId AND e.InventoryCategory = 10
WHERE e.Id IS NULL

UNION ALL SELECT 'HydrantLogs', COUNT(*) FROM HydrantLogs x
LEFT JOIN Equipment e ON e.Id = x.HydrantId AND e.InventoryCategory = 10
WHERE e.Id IS NULL

UNION ALL SELECT 'SmokeDetectorLogs', COUNT(*) FROM SmokeDetectorLogs x
LEFT JOIN Equipment e ON e.Id = x.DetectorId AND e.InventoryCategory = 10
WHERE e.Id IS NULL

UNION ALL SELECT 'ManualCallPointLogs', COUNT(*) FROM ManualCallPointLogs x
LEFT JOIN Equipment e ON e.Id = x.StationId AND e.InventoryCategory = 10
WHERE e.Id IS NULL

UNION ALL SELECT 'FireInspectionPeriodExtinguishers', COUNT(*) FROM FireInspectionPeriodExtinguishers x
LEFT JOIN Equipment e ON e.Id = x.ExtinguisherId AND e.InventoryCategory = 10
WHERE e.Id IS NULL

UNION ALL SELECT 'FireInspectionPeriodHydrants', COUNT(*) FROM FireInspectionPeriodHydrants x
LEFT JOIN Equipment e ON e.Id = x.HydrantId AND e.InventoryCategory = 10
WHERE e.Id IS NULL

UNION ALL SELECT 'FireInspectionPeriodDetectors', COUNT(*) FROM FireInspectionPeriodDetectors x
LEFT JOIN Equipment e ON e.Id = x.DetectorId AND e.InventoryCategory = 10
WHERE e.Id IS NULL

UNION ALL SELECT 'FireInspectionPeriodStations', COUNT(*) FROM FireInspectionPeriodStations x
LEFT JOIN Equipment e ON e.Id = x.StationId AND e.InventoryCategory = 10
WHERE e.Id IS NULL

UNION ALL SELECT 'FireCycleInspectionExtinguishers', COUNT(*) FROM FireCycleInspectionExtinguishers x
LEFT JOIN Equipment e ON e.Id = x.ExtinguisherId AND e.InventoryCategory = 10
WHERE e.Id IS NULL

UNION ALL SELECT 'FireCycleInspectionHydrants', COUNT(*) FROM FireCycleInspectionHydrants x
LEFT JOIN Equipment e ON e.Id = x.HydrantId AND e.InventoryCategory = 10
WHERE e.Id IS NULL

UNION ALL SELECT 'FireCycleInspectionDetectors', COUNT(*) FROM FireCycleInspectionDetectors x
LEFT JOIN Equipment e ON e.Id = x.DetectorId AND e.InventoryCategory = 10
WHERE e.Id IS NULL

UNION ALL SELECT 'FireCycleInspectionStations', COUNT(*) FROM FireCycleInspectionStations x
LEFT JOIN Equipment e ON e.Id = x.StationId AND e.InventoryCategory = 10
WHERE e.Id IS NULL;

/* Nota: aunque esta query diera 0 en las 12 (esperado, porque D1 ya migró todo con el mismo Id),
   la migración es autoprotegida de todos modos: el ADD CONSTRAINT del SQL real (sin NOCHECK) hace que
   SQL Server valide TODAS las filas existentes contra la nueva FK; si hubiera un huérfano, todo el
   ALTER falla dentro del BEGIN TRANSACTION / COMMIT y no se aplica nada. Esta query es para saberlo
   ANTES del despliegue, no para que la migración dependa de ella. */
