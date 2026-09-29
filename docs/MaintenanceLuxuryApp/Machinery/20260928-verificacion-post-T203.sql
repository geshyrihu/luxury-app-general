/* Verificacion de solo lectura tras desplegar T-203. Correr en el entorno de desarrollo
   (donde se acaba de reiniciar la app), contra la BD LuxuryBuildingGroup. */

-- 1) Confirma que la migracion quedo registrada
SELECT TOP 5 [MigrationId], [ProductVersion]
FROM [__EFMigrationsHistory]
ORDER BY [MigrationId] DESC;
-- Esperado: la primera fila debe ser '20260928162110_SwitchFireForeignKeysToEquipment'

-- 2) Confirma que las 12 FK ya apuntan a Equipment (no a las tablas de fuego)
SELECT
    fk.name AS NombreFK,
    OBJECT_NAME(fk.parent_object_id) AS TablaDependiente,
    COL_NAME(fkc.parent_object_id, fkc.parent_column_id) AS Columna,
    OBJECT_NAME(fk.referenced_object_id) AS TablaReferenciada
FROM sys.foreign_keys fk
JOIN sys.foreign_key_columns fkc ON fkc.constraint_object_id = fk.object_id
WHERE OBJECT_NAME(fk.parent_object_id) IN (
    'FireExtinguisherLogs', 'HydrantLogs', 'SmokeDetectorLogs', 'ManualCallPointLogs',
    'FireInspectionPeriodExtinguishers', 'FireInspectionPeriodHydrants',
    'FireInspectionPeriodDetectors', 'FireInspectionPeriodStations',
    'FireCycleInspectionExtinguishers', 'FireCycleInspectionHydrants',
    'FireCycleInspectionDetectors', 'FireCycleInspectionStations'
)
AND COL_NAME(fkc.parent_object_id, fkc.parent_column_id) IN ('ExtinguisherId','HydrantId','DetectorId','StationId')
ORDER BY TablaDependiente;
-- Esperado: TablaReferenciada = 'Equipment' en las 12 filas (antes decia FireExtinguishers/Hydrants/SmokeDetectors/ManualCallPoints)
