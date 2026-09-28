/* =====================================================================================================
   PLAN: 20260926-plan-maintenance-machinery.md  ·  Sección 3.5 (Migración de datos)
   Migración: activos de contra incendio (4 tablas) → Equipment + EquipmentFireDetails

   RESPONSABLE : Tech Lead. Los agentes NO ejecutan este script en producción.
   MOTOR       : SQL Server (T-SQL). Reescribir para PostgreSQL si el cutover de motor ocurre antes.
   PRE-REQUISITO: Release R1 desplegado (esquema aditivo + doble escritura activa) y verificado
                  (__EFMigrationsHistory contiene la migración AddFireDetailsToEquipment).
   CONSTANTES  : State.Activo = 0 (Shared/Enums/State.cs) · InventoryCategory.FireProtection = 10
                 FireAssetKind: Extinguisher=1, Hydrant=2, SmokeDetector=3, ManualCallPoint=4

   REGLAS      : - Copia, nunca movimiento: las tablas de fuego NO se modifican en este script.
                 - Idempotente: cada INSERT usa NOT EXISTS; se puede repetir sin duplicar.
                 - Ejecutar por secciones, en orden. Cada sección de datos termina con verificación
                   dentro de la transacción; si falla, THROW + rollback automático (XACT_ABORT).
                 - Ejecutar en staging con una copia reciente de producción ANTES de producción.
   ===================================================================================================== */
SET NOCOUNT ON;
SET XACT_ABORT ON;

/* =====================================================================================================
   PASO 0 · RESPALDO
   0.1 (MANUAL) Respaldo completo de la BD y PRUEBA DE RESTAURACIÓN en otro entorno (Gate G1):
       DECLARE @db sysname = DB_NAME();
       BACKUP DATABASE @db TO DISK = N'<ruta>\luxuryapp-20260926-pre-fuego.bak' WITH CHECKSUM, INIT;
       RESTORE VERIFYONLY FROM DISK = N'<ruta>\luxuryapp-20260926-pre-fuego.bak' WITH CHECKSUM;
   ===================================================================================================== */

-- 0.2 Copias de trabajo en la misma BD (solo si no existen)
IF OBJECT_ID(N'bak_20260926_Equipment')          IS NULL SELECT * INTO bak_20260926_Equipment          FROM Equipment;
IF OBJECT_ID(N'bak_20260926_FireExtinguishers')  IS NULL SELECT * INTO bak_20260926_FireExtinguishers  FROM FireExtinguishers;
IF OBJECT_ID(N'bak_20260926_Hydrants')           IS NULL SELECT * INTO bak_20260926_Hydrants           FROM Hydrants;
IF OBJECT_ID(N'bak_20260926_SmokeDetectors')     IS NULL SELECT * INTO bak_20260926_SmokeDetectors     FROM SmokeDetectors;
IF OBJECT_ID(N'bak_20260926_ManualCallPoints')   IS NULL SELECT * INTO bak_20260926_ManualCallPoints   FROM ManualCallPoints;
IF OBJECT_ID(N'bak_20260926_FireExtinguisherLogs')            IS NULL SELECT * INTO bak_20260926_FireExtinguisherLogs            FROM FireExtinguisherLogs;
IF OBJECT_ID(N'bak_20260926_HydrantLogs')                     IS NULL SELECT * INTO bak_20260926_HydrantLogs                     FROM HydrantLogs;
IF OBJECT_ID(N'bak_20260926_SmokeDetectorLogs')               IS NULL SELECT * INTO bak_20260926_SmokeDetectorLogs               FROM SmokeDetectorLogs;
IF OBJECT_ID(N'bak_20260926_ManualCallPointLogs')             IS NULL SELECT * INTO bak_20260926_ManualCallPointLogs             FROM ManualCallPointLogs;
IF OBJECT_ID(N'bak_20260926_FireInspectionPeriodExtinguishers') IS NULL SELECT * INTO bak_20260926_FireInspectionPeriodExtinguishers FROM FireInspectionPeriodExtinguishers;
IF OBJECT_ID(N'bak_20260926_FireInspectionPeriodHydrants')      IS NULL SELECT * INTO bak_20260926_FireInspectionPeriodHydrants      FROM FireInspectionPeriodHydrants;
IF OBJECT_ID(N'bak_20260926_FireInspectionPeriodDetectors')     IS NULL SELECT * INTO bak_20260926_FireInspectionPeriodDetectors     FROM FireInspectionPeriodDetectors;
IF OBJECT_ID(N'bak_20260926_FireInspectionPeriodStations')      IS NULL SELECT * INTO bak_20260926_FireInspectionPeriodStations      FROM FireInspectionPeriodStations;
IF OBJECT_ID(N'bak_20260926_FireCycleInspectionExtinguishers')  IS NULL SELECT * INTO bak_20260926_FireCycleInspectionExtinguishers  FROM FireCycleInspectionExtinguishers;
IF OBJECT_ID(N'bak_20260926_FireCycleInspectionHydrants')       IS NULL SELECT * INTO bak_20260926_FireCycleInspectionHydrants       FROM FireCycleInspectionHydrants;
IF OBJECT_ID(N'bak_20260926_FireCycleInspectionDetectors')      IS NULL SELECT * INTO bak_20260926_FireCycleInspectionDetectors      FROM FireCycleInspectionDetectors;
IF OBJECT_ID(N'bak_20260926_FireCycleInspectionStations')       IS NULL SELECT * INTO bak_20260926_FireCycleInspectionStations       FROM FireCycleInspectionStations;

/* =====================================================================================================
   PASO 1 · LÍNEA BASE Y PRE-CHECKS (solo SELECT). Guardar la salida en el changelog de migración.
   Esperado 2026-09-26: Equipment 5086 · Extintores 733 · Hidrantes 0 · Detectores 1946 · Estaciones 188
   ===================================================================================================== */
-- C1 · Conteos
SELECT N'Equipment' AS T, COUNT(*) AS N FROM Equipment
UNION ALL SELECT N'FireExtinguishers', COUNT(*) FROM FireExtinguishers
UNION ALL SELECT N'Hydrants',          COUNT(*) FROM Hydrants
UNION ALL SELECT N'SmokeDetectors',    COUNT(*) FROM SmokeDetectors
UNION ALL SELECT N'ManualCallPoints',  COUNT(*) FROM ManualCallPoints
UNION ALL SELECT N'FireExtinguisherLogs', COUNT(*) FROM FireExtinguisherLogs
UNION ALL SELECT N'HydrantLogs',          COUNT(*) FROM HydrantLogs
UNION ALL SELECT N'SmokeDetectorLogs',    COUNT(*) FROM SmokeDetectorLogs
UNION ALL SELECT N'ManualCallPointLogs',  COUNT(*) FROM ManualCallPointLogs
UNION ALL SELECT N'FireInspectionPeriodExtinguishers', COUNT(*) FROM FireInspectionPeriodExtinguishers
UNION ALL SELECT N'FireInspectionPeriodHydrants',      COUNT(*) FROM FireInspectionPeriodHydrants
UNION ALL SELECT N'FireInspectionPeriodDetectors',     COUNT(*) FROM FireInspectionPeriodDetectors
UNION ALL SELECT N'FireInspectionPeriodStations',      COUNT(*) FROM FireInspectionPeriodStations
UNION ALL SELECT N'FireCycleInspectionExtinguishers',  COUNT(*) FROM FireCycleInspectionExtinguishers
UNION ALL SELECT N'FireCycleInspectionHydrants',       COUNT(*) FROM FireCycleInspectionHydrants
UNION ALL SELECT N'FireCycleInspectionDetectors',      COUNT(*) FROM FireCycleInspectionDetectors
UNION ALL SELECT N'FireCycleInspectionStations',       COUNT(*) FROM FireCycleInspectionStations;

-- C2 · Id repetido entre Equipment y fuego. ESPERADO: 0 filas. (Con doble escritura activa, los Id de fuego
--      ya presentes en Equipment con InventoryCategory = 10 son legítimos y se excluyen.)
SELECT Id, COUNT(*) AS C FROM (
    SELECT Id FROM Equipment WHERE InventoryCategory <> 10
    UNION ALL SELECT Id FROM FireExtinguishers UNION ALL SELECT Id FROM Hydrants
    UNION ALL SELECT Id FROM SmokeDetectors    UNION ALL SELECT Id FROM ManualCallPoints) x
GROUP BY Id HAVING COUNT(*) > 1;

-- C3 · Categorías persistidas. ESPERADO: solo 1..8 y 10.
SELECT InventoryCategory, COUNT(*) AS N FROM Equipment GROUP BY InventoryCategory ORDER BY 1;

-- C4a · LocalCode vacío (se resuelve con la regla de nombre; informar el número al Tech Lead)
SELECT COUNT(*) AS SinLocalCode FROM (
    SELECT LocalCode FROM FireExtinguishers UNION ALL SELECT LocalCode FROM Hydrants
    UNION ALL SELECT LocalCode FROM SmokeDetectors UNION ALL SELECT LocalCode FROM ManualCallPoints) f
WHERE LocalCode IS NULL OR LTRIM(RTRIM(LocalCode)) = N'';

-- C4b · LocalCode duplicado por cliente (informativo; no bloquea, no hay índice único hoy)
SELECT CustomerId, LocalCode, COUNT(*) AS C FROM (
    SELECT CustomerId, LocalCode FROM FireExtinguishers UNION ALL SELECT CustomerId, LocalCode FROM Hydrants
    UNION ALL SELECT CustomerId, LocalCode FROM SmokeDetectors UNION ALL SELECT CustomerId, LocalCode FROM ManualCallPoints) f
WHERE LocalCode IS NOT NULL AND LTRIM(RTRIM(LocalCode)) <> N''
GROUP BY CustomerId, LocalCode HAVING COUNT(*) > 1;

-- C4c · Nombres reales de las 12 FK que reemplazará la migración SwitchFireForeignKeysToEquipment (documentar)
SELECT OBJECT_NAME(fk.parent_object_id) AS Tabla, fk.name AS Constraint_, OBJECT_NAME(fk.referenced_object_id) AS Referencia
FROM sys.foreign_keys fk
WHERE OBJECT_NAME(fk.referenced_object_id) IN (N'FireExtinguishers', N'Hydrants', N'SmokeDetectors', N'ManualCallPoints')
ORDER BY 1;

/* =====================================================================================================
   PASO 2 · BACKFILL (uno por tabla, en este orden: Hydrants → ManualCallPoints → FireExtinguishers
   → SmokeDetectors). Cada bloque es una transacción con verificación interna.
   ===================================================================================================== */

/* ---- 2.1 Hydrants (0 filas: ensayo del flujo) ---- */
BEGIN TRAN;
INSERT INTO Equipment (Id, CustomerId, UserId, Name, Location, LocalCode, PhotoPath, State, InventoryCategory, InstallationDate)
SELECT s.Id, s.CustomerId, s.ApplicationUserId,
       COALESCE(NULLIF(LTRIM(RTRIM(s.LocalCode)), N''), N'Hidrante ' + LEFT(CONVERT(nvarchar(36), s.Id), 8)),
       s.Location, s.LocalCode, s.Photo, 0, 10, NULL
FROM Hydrants s WHERE NOT EXISTS (SELECT 1 FROM Equipment e WHERE e.Id = s.Id);

INSERT INTO EquipmentFireDetails (EquipmentId, FireAssetKind, HydrantType, CabinetNumber)
SELECT s.Id, 2, s.HydrantType, s.CabinetNumber
FROM Hydrants s WHERE NOT EXISTS (SELECT 1 FROM EquipmentFireDetails d WHERE d.EquipmentId = s.Id);

INSERT INTO AssetMigrationLog (SourceTable, SourceId, TargetId, MigratedAt)
SELECT N'Hydrants', s.Id, s.Id, SYSUTCDATETIME()
FROM Hydrants s WHERE NOT EXISTS (SELECT 1 FROM AssetMigrationLog l WHERE l.SourceTable = N'Hydrants' AND l.SourceId = s.Id);

IF EXISTS (SELECT 1 FROM Hydrants s
           LEFT JOIN Equipment e ON e.Id = s.Id AND e.InventoryCategory = 10
           LEFT JOIN EquipmentFireDetails d ON d.EquipmentId = s.Id AND d.FireAssetKind = 2
           WHERE e.Id IS NULL OR d.EquipmentId IS NULL)
    THROW 50001, N'Hydrants: filas de origen sin destino (C7).', 1;
IF EXISTS (SELECT 1 FROM Hydrants s JOIN Equipment e ON e.Id = s.Id JOIN EquipmentFireDetails d ON d.EquipmentId = s.Id
           WHERE s.CustomerId <> e.CustomerId
              OR ISNULL(s.ApplicationUserId, N'') <> ISNULL(e.UserId, N'')
              OR ISNULL(s.Location,  N'') <> ISNULL(e.Location,  N'')
              OR ISNULL(s.LocalCode, N'') <> ISNULL(e.LocalCode, N'')
              OR ISNULL(s.Photo,     N'') <> ISNULL(e.PhotoPath, N'')
              OR s.HydrantType <> d.HydrantType
              OR ISNULL(s.CabinetNumber, N'') <> ISNULL(d.CabinetNumber, N''))
    THROW 50002, N'Hydrants: diferencias campo a campo (C8).', 1;
COMMIT;

/* ---- 2.2 ManualCallPoints (188) ---- */
BEGIN TRAN;
INSERT INTO Equipment (Id, CustomerId, UserId, Name, Location, LocalCode, PhotoPath, State, InventoryCategory, InstallationDate)
SELECT s.Id, s.CustomerId, s.ApplicationUserId,
       COALESCE(NULLIF(LTRIM(RTRIM(s.LocalCode)), N''), N'Estación manual ' + LEFT(CONVERT(nvarchar(36), s.Id), 8)),
       s.Location, s.LocalCode, s.Photo, 0, 10, NULL
FROM ManualCallPoints s WHERE NOT EXISTS (SELECT 1 FROM Equipment e WHERE e.Id = s.Id);

INSERT INTO EquipmentFireDetails (EquipmentId, FireAssetKind, StationType)
SELECT s.Id, 4, s.StationType
FROM ManualCallPoints s WHERE NOT EXISTS (SELECT 1 FROM EquipmentFireDetails d WHERE d.EquipmentId = s.Id);

INSERT INTO AssetMigrationLog (SourceTable, SourceId, TargetId, MigratedAt)
SELECT N'ManualCallPoints', s.Id, s.Id, SYSUTCDATETIME()
FROM ManualCallPoints s WHERE NOT EXISTS (SELECT 1 FROM AssetMigrationLog l WHERE l.SourceTable = N'ManualCallPoints' AND l.SourceId = s.Id);

IF EXISTS (SELECT 1 FROM ManualCallPoints s
           LEFT JOIN Equipment e ON e.Id = s.Id AND e.InventoryCategory = 10
           LEFT JOIN EquipmentFireDetails d ON d.EquipmentId = s.Id AND d.FireAssetKind = 4
           WHERE e.Id IS NULL OR d.EquipmentId IS NULL)
    THROW 50011, N'ManualCallPoints: filas de origen sin destino (C7).', 1;
IF EXISTS (SELECT 1 FROM ManualCallPoints s JOIN Equipment e ON e.Id = s.Id JOIN EquipmentFireDetails d ON d.EquipmentId = s.Id
           WHERE s.CustomerId <> e.CustomerId
              OR ISNULL(s.ApplicationUserId, N'') <> ISNULL(e.UserId, N'')
              OR ISNULL(s.Location,  N'') <> ISNULL(e.Location,  N'')
              OR ISNULL(s.LocalCode, N'') <> ISNULL(e.LocalCode, N'')
              OR ISNULL(s.Photo,     N'') <> ISNULL(e.PhotoPath, N'')
              OR s.StationType <> d.StationType)
    THROW 50012, N'ManualCallPoints: diferencias campo a campo (C8).', 1;
COMMIT;

/* ---- 2.3 FireExtinguishers (733) ---- */
BEGIN TRAN;
INSERT INTO Equipment (Id, CustomerId, UserId, Name, Location, LocalCode, PhotoPath, State, InventoryCategory, InstallationDate)
SELECT s.Id, s.CustomerId, s.ApplicationUserId,
       COALESCE(NULLIF(LTRIM(RTRIM(s.LocalCode)), N''), N'Extintor ' + LEFT(CONVERT(nvarchar(36), s.Id), 8)),
       s.Location, s.LocalCode, s.Photo, 0, 10, NULL
FROM FireExtinguishers s WHERE NOT EXISTS (SELECT 1 FROM Equipment e WHERE e.Id = s.Id);

INSERT INTO EquipmentFireDetails (EquipmentId, FireAssetKind, ExtinguisherType, ExpirationDate)
SELECT s.Id, 1, s.ExtinguisherType, s.ExpirationDate
FROM FireExtinguishers s WHERE NOT EXISTS (SELECT 1 FROM EquipmentFireDetails d WHERE d.EquipmentId = s.Id);

INSERT INTO AssetMigrationLog (SourceTable, SourceId, TargetId, MigratedAt)
SELECT N'FireExtinguishers', s.Id, s.Id, SYSUTCDATETIME()
FROM FireExtinguishers s WHERE NOT EXISTS (SELECT 1 FROM AssetMigrationLog l WHERE l.SourceTable = N'FireExtinguishers' AND l.SourceId = s.Id);

IF EXISTS (SELECT 1 FROM FireExtinguishers s
           LEFT JOIN Equipment e ON e.Id = s.Id AND e.InventoryCategory = 10
           LEFT JOIN EquipmentFireDetails d ON d.EquipmentId = s.Id AND d.FireAssetKind = 1
           WHERE e.Id IS NULL OR d.EquipmentId IS NULL)
    THROW 50021, N'FireExtinguishers: filas de origen sin destino (C7).', 1;
IF EXISTS (SELECT 1 FROM FireExtinguishers s JOIN Equipment e ON e.Id = s.Id JOIN EquipmentFireDetails d ON d.EquipmentId = s.Id
           WHERE s.CustomerId <> e.CustomerId
              OR ISNULL(s.ApplicationUserId, N'') <> ISNULL(e.UserId, N'')
              OR ISNULL(s.Location,  N'') <> ISNULL(e.Location,  N'')
              OR ISNULL(s.LocalCode, N'') <> ISNULL(e.LocalCode, N'')
              OR ISNULL(s.Photo,     N'') <> ISNULL(e.PhotoPath, N'')
              OR s.ExtinguisherType <> d.ExtinguisherType
              OR s.ExpirationDate   <> d.ExpirationDate)
    THROW 50022, N'FireExtinguishers: diferencias campo a campo (C8).', 1;
COMMIT;

/* ---- 2.4 SmokeDetectors (1946) ---- */
BEGIN TRAN;
INSERT INTO Equipment (Id, CustomerId, UserId, Name, Location, LocalCode, PhotoPath, State, InventoryCategory, InstallationDate)
SELECT s.Id, s.CustomerId, s.ApplicationUserId,
       COALESCE(NULLIF(LTRIM(RTRIM(s.LocalCode)), N''), N'Detector de humo ' + LEFT(CONVERT(nvarchar(36), s.Id), 8)),
       s.Location, s.LocalCode, s.Photo, 0, 10, NULL
FROM SmokeDetectors s WHERE NOT EXISTS (SELECT 1 FROM Equipment e WHERE e.Id = s.Id);

INSERT INTO EquipmentFireDetails (EquipmentId, FireAssetKind, DetectorType)
SELECT s.Id, 3, s.DetectorType
FROM SmokeDetectors s WHERE NOT EXISTS (SELECT 1 FROM EquipmentFireDetails d WHERE d.EquipmentId = s.Id);

INSERT INTO AssetMigrationLog (SourceTable, SourceId, TargetId, MigratedAt)
SELECT N'SmokeDetectors', s.Id, s.Id, SYSUTCDATETIME()
FROM SmokeDetectors s WHERE NOT EXISTS (SELECT 1 FROM AssetMigrationLog l WHERE l.SourceTable = N'SmokeDetectors' AND l.SourceId = s.Id);

IF EXISTS (SELECT 1 FROM SmokeDetectors s
           LEFT JOIN Equipment e ON e.Id = s.Id AND e.InventoryCategory = 10
           LEFT JOIN EquipmentFireDetails d ON d.EquipmentId = s.Id AND d.FireAssetKind = 3
           WHERE e.Id IS NULL OR d.EquipmentId IS NULL)
    THROW 50031, N'SmokeDetectors: filas de origen sin destino (C7).', 1;
IF EXISTS (SELECT 1 FROM SmokeDetectors s JOIN Equipment e ON e.Id = s.Id JOIN EquipmentFireDetails d ON d.EquipmentId = s.Id
           WHERE s.CustomerId <> e.CustomerId
              OR ISNULL(s.ApplicationUserId, N'') <> ISNULL(e.UserId, N'')
              OR ISNULL(s.Location,  N'') <> ISNULL(e.Location,  N'')
              OR ISNULL(s.LocalCode, N'') <> ISNULL(e.LocalCode, N'')
              OR ISNULL(s.Photo,     N'') <> ISNULL(e.PhotoPath, N'')
              OR s.DetectorType <> d.DetectorType)
    THROW 50032, N'SmokeDetectors: diferencias campo a campo (C8).', 1;
COMMIT;

/* =====================================================================================================
   PASO 3 · RECONCILIACIÓN GLOBAL (solo SELECT). Todas las consultas deben dar el valor esperado.
   ===================================================================================================== */
-- C9 · Equipment de fuego = suma de las 4 tablas de origen (esperado: diferencia 0)
SELECT (SELECT COUNT(*) FROM Equipment WHERE InventoryCategory = 10) AS EnEquipment,
       (SELECT COUNT(*) FROM FireExtinguishers) + (SELECT COUNT(*) FROM Hydrants)
     + (SELECT COUNT(*) FROM SmokeDetectors)    + (SELECT COUNT(*) FROM ManualCallPoints) AS EnOrigen;

-- C9b · Cada Equipment de fuego tiene exactamente un detalle, y ningún otro lo tiene (esperado: 0 y 0)
SELECT COUNT(*) AS FuegoSinDetalle FROM Equipment e
WHERE e.InventoryCategory = 10 AND NOT EXISTS (SELECT 1 FROM EquipmentFireDetails d WHERE d.EquipmentId = e.Id);
SELECT COUNT(*) AS DetalleEnNoFuego FROM EquipmentFireDetails d
JOIN Equipment e ON e.Id = d.EquipmentId WHERE e.InventoryCategory <> 10;

-- C6 · Las filas ORIGINALES de Equipment no cambiaron respecto al respaldo del PASO 0 (esperado: 0 y 0).
--      Ejecutar en la misma ventana del backfill; ediciones legítimas posteriores aparecerán como diferencias.
SELECT COUNT(*) AS OriginalesFaltantes FROM bak_20260926_Equipment b
WHERE NOT EXISTS (SELECT 1 FROM Equipment e WHERE e.Id = b.Id);
SELECT COUNT(*) AS OriginalesModificados FROM bak_20260926_Equipment b
JOIN Equipment e ON e.Id = b.Id
WHERE e.CustomerId <> b.CustomerId
   OR ISNULL(e.UserId, N'')  <> ISNULL(b.UserId, N'')
   OR ISNULL(e.Name, N'')    <> ISNULL(b.Name, N'')
   OR ISNULL(e.Brand, N'')   <> ISNULL(b.Brand, N'')
   OR ISNULL(e.Model, N'')   <> ISNULL(b.Model, N'')
   OR ISNULL(e.SerialNumber, N'') <> ISNULL(b.SerialNumber, N'')
   OR ISNULL(e.InstallationDate, '19000101') <> ISNULL(b.InstallationDate, '19000101')
   OR ISNULL(e.Location, N'')  <> ISNULL(b.Location, N'')
   OR e.State <> b.State
   OR e.InventoryCategory <> b.InventoryCategory
   OR ISNULL(e.TechnicalSpecifications, N'') <> ISNULL(b.TechnicalSpecifications, N'')
   OR ISNULL(e.PhotoPath, N'')     <> ISNULL(b.PhotoPath, N'')
   OR ISNULL(e.Observations, N'')  <> ISNULL(b.Observations, N'')
   OR ISNULL(e.EquipmentClassificationId, '00000000-0000-0000-0000-000000000000')
   <> ISNULL(b.EquipmentClassificationId, '00000000-0000-0000-0000-000000000000');

/* =====================================================================================================
   PASO 4 · PRE-CONDICIÓN DE LA MIGRACIÓN DE FK (antes de desplegar R2). ESPERADO: 0 en las 12 filas.
   Todo Id referenciado por un dependiente debe existir en Equipment.
   ===================================================================================================== */
SELECT N'FireExtinguisherLogs' AS T, COUNT(*) AS Huerfanos FROM FireExtinguisherLogs x WHERE NOT EXISTS (SELECT 1 FROM Equipment e WHERE e.Id = x.ExtinguisherId)
UNION ALL SELECT N'HydrantLogs',            COUNT(*) FROM HydrantLogs x            WHERE NOT EXISTS (SELECT 1 FROM Equipment e WHERE e.Id = x.HydrantId)
UNION ALL SELECT N'SmokeDetectorLogs',      COUNT(*) FROM SmokeDetectorLogs x      WHERE NOT EXISTS (SELECT 1 FROM Equipment e WHERE e.Id = x.DetectorId)
UNION ALL SELECT N'ManualCallPointLogs',    COUNT(*) FROM ManualCallPointLogs x    WHERE NOT EXISTS (SELECT 1 FROM Equipment e WHERE e.Id = x.StationId)
UNION ALL SELECT N'FireInspectionPeriodExtinguishers', COUNT(*) FROM FireInspectionPeriodExtinguishers x WHERE NOT EXISTS (SELECT 1 FROM Equipment e WHERE e.Id = x.ExtinguisherId)
UNION ALL SELECT N'FireInspectionPeriodHydrants',      COUNT(*) FROM FireInspectionPeriodHydrants x      WHERE NOT EXISTS (SELECT 1 FROM Equipment e WHERE e.Id = x.HydrantId)
UNION ALL SELECT N'FireInspectionPeriodDetectors',     COUNT(*) FROM FireInspectionPeriodDetectors x     WHERE NOT EXISTS (SELECT 1 FROM Equipment e WHERE e.Id = x.DetectorId)
UNION ALL SELECT N'FireInspectionPeriodStations',      COUNT(*) FROM FireInspectionPeriodStations x      WHERE NOT EXISTS (SELECT 1 FROM Equipment e WHERE e.Id = x.StationId)
UNION ALL SELECT N'FireCycleInspectionExtinguishers',  COUNT(*) FROM FireCycleInspectionExtinguishers x  WHERE NOT EXISTS (SELECT 1 FROM Equipment e WHERE e.Id = x.ExtinguisherId)
UNION ALL SELECT N'FireCycleInspectionHydrants',       COUNT(*) FROM FireCycleInspectionHydrants x       WHERE NOT EXISTS (SELECT 1 FROM Equipment e WHERE e.Id = x.HydrantId)
UNION ALL SELECT N'FireCycleInspectionDetectors',      COUNT(*) FROM FireCycleInspectionDetectors x      WHERE NOT EXISTS (SELECT 1 FROM Equipment e WHERE e.Id = x.DetectorId)
UNION ALL SELECT N'FireCycleInspectionStations',       COUNT(*) FROM FireCycleInspectionStations x       WHERE NOT EXISTS (SELECT 1 FROM Equipment e WHERE e.Id = x.StationId);

/* =====================================================================================================
   PASO 99 · ROLLBACK DE DATOS (solo ANTES de desplegar R2). NO ejecutar por defecto.
   Con doble escritura, la tabla de fuego original sigue siendo la fuente de verdad hasta R2.
   Falla de forma segura si alguna fila de fuego ya fue referenciada por una FK de Equipment (RESTRICT).
   ===================================================================================================== */
/*
BEGIN TRAN;
DELETE d FROM EquipmentFireDetails d JOIN Equipment e ON e.Id = d.EquipmentId WHERE e.InventoryCategory = 10;
DELETE FROM Equipment WHERE InventoryCategory = 10;
DELETE FROM AssetMigrationLog;
-- Verificar: SELECT COUNT(*) FROM Equipment  → debe igualar la línea base de C1 (5086).
COMMIT;
*/
