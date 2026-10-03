-- Fase 0: verificación de que las 18 tablas de FireInspectionPeriods/EquipmentInspections
-- están vacías en PRODUCCIÓN antes de autorizar cualquier DROP TABLE.
-- Ejecutar en SSMS contra la base de datos de producción y pegar el resultado.

SELECT 'FireInspectionPeriods' AS Tabla, COUNT(*) AS Filas FROM FireInspectionPeriods
UNION ALL SELECT 'FireInspectionCycles', COUNT(*) FROM FireInspectionCycles
UNION ALL SELECT 'FireInspectionPeriodExtinguishers', COUNT(*) FROM FireInspectionPeriodExtinguishers
UNION ALL SELECT 'FireInspectionPeriodHydrants', COUNT(*) FROM FireInspectionPeriodHydrants
UNION ALL SELECT 'FireInspectionPeriodStations', COUNT(*) FROM FireInspectionPeriodStations
UNION ALL SELECT 'FireInspectionPeriodDetectors', COUNT(*) FROM FireInspectionPeriodDetectors
UNION ALL SELECT 'FireCycleInspectionExtinguishers', COUNT(*) FROM FireCycleInspectionExtinguishers
UNION ALL SELECT 'FireCycleInspectionHydrants', COUNT(*) FROM FireCycleInspectionHydrants
UNION ALL SELECT 'FireCycleInspectionStations', COUNT(*) FROM FireCycleInspectionStations
UNION ALL SELECT 'FireCycleInspectionDetectors', COUNT(*) FROM FireCycleInspectionDetectors
UNION ALL SELECT 'EquipmentInspectionDefinitions', COUNT(*) FROM EquipmentInspectionDefinitions
UNION ALL SELECT 'EquipmentInspectionDefinitionAssignees', COUNT(*) FROM EquipmentInspectionDefinitionAssignees
UNION ALL SELECT 'EquipmentInspectionDefinitionWeekDays', COUNT(*) FROM EquipmentInspectionDefinitionWeekDays
UNION ALL SELECT 'EquipmentInspectionCriteria', COUNT(*) FROM EquipmentInspectionCriteria
UNION ALL SELECT 'EquipmentInspectionExecutions', COUNT(*) FROM EquipmentInspectionExecutions
UNION ALL SELECT 'EquipmentInspectionExecutionItems', COUNT(*) FROM EquipmentInspectionExecutionItems
UNION ALL SELECT 'EquipmentInspectionExecutionImages', COUNT(*) FROM EquipmentInspectionExecutionImages
UNION ALL SELECT 'EquipmentQrLabels', COUNT(*) FROM EquipmentQrLabels
ORDER BY Tabla;

-- Chequeo adicional (igual al que hizo el agente en dev): confirmar que no existen
-- tablas de estos motores fuera de la lista anterior.
SELECT t.name AS TablaEncontrada
FROM sys.tables t
WHERE t.name LIKE 'FireInspection%'
   OR t.name LIKE 'FireCycleInspection%'
   OR t.name LIKE 'EquipmentInspection%'
   OR t.name = 'EquipmentQrLabels';
