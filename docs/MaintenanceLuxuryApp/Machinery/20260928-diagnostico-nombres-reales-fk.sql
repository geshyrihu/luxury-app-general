/* Diagnóstico de solo lectura: nombres REALES de las 12 FK de fuego en esta base de datos.
   Correr en el mismo entorno donde falló la migración (desarrollo), y luego en producción para
   confirmar si tiene el mismo problema. No modifica nada. */
SELECT
    fk.name AS NombreRealDeLaFK,
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
ORDER BY TablaDependiente;
