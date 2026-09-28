# Análisis — `Equipment` único con categoría + control de datos y migración sin pérdida

> **Tipo:** Análisis de solo lectura + estrategia de migración. **No se aplica ningún cambio.**
> **Fecha:** 2026-09-26
> **Relacionado:** [20260925-diseno-centralizacion-activos.md](20260925-diseno-centralizacion-activos.md) ·
> [20260926-adenda-revision-arquitectonica-centralizacion-activos.md](20260926-adenda-revision-arquitectonica-centralizacion-activos.md)
> **Opción analizada (idea del dueño del módulo):** una sola tabla `Equipment` que absorbe los activos de
> contra incendio, distinguidos por una categoría — **sin herencia EF ni discriminador**.
> **Motor actual:** SQL Server (`uniqueidentifier`, `nvarchar`). Migración a PostgreSQL en curso: los scripts
> de este documento marcan lo que es específico de T-SQL.

---

## 1. Resumen ejecutivo

| Pregunta                                                   | Respuesta                                                                                                                                                                        |
| :--------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ¿Es viable?                                                | **Sí.** Se mueven solo **2 867 filas** de fuego; las 11 FK que hoy apuntan a `Equipment` **no se tocan**.                                                                        |
| ¿Se puede migrar sin perder registros?                     | **Sí**, con copia (no movimiento) conservando el mismo `Id`, reconciliación fila a fila, y cambio de FK sin tocar los datos de los dependientes (§6).                            |
| ¿Qué es lo más delicado?                                   | No es la migración de datos; es el **cambio de semántica de `Equipment`**: listados sin filtro, un endpoint de actualización masiva, dropdowns cacheados y el dashboard (§4).    |
| ¿Cuál es el punto de no retorno?                           | El cambio de lectura/escritura de los servicios de fuego hacia `Equipment` (§6, fase M5). Antes de ese punto todo es reversible sin pérdida.                                     |
| Recomendación                                              | Proceder con **`Equipment` + tabla de detalle 1:1 `EquipmentFireDetails`** y categoría nueva, **condicionado** a cerrar los 6 hallazgos críticos de §4 y a la decisión D1–D6 (§9). |

---

## 2. Inventario verificado (hechos, con evidencia)

### 2.1 Volúmenes (producción, `Resultados1.csv`)

| Tabla               | Filas |
| :------------------ | ----: |
| `Equipment`         | 5 086 |
| `FireExtinguishers` |   733 |
| `Hydrants`          |     0 |
| `SmokeDetectors`    | 1 946 |
| `ManualCallPoints`  |   188 |
| **Total**           | 7 953 |

Tras la migración se espera: `Equipment` = **5 086 + 2 867 = 7 953** filas; las 4 tablas de fuego quedan como
respaldo de solo lectura (§6, M6).

### 2.2 Esquema origen y destino (columna a columna)

Origen (`EquipoContraIncendioBase` + delta), destino en `Equipment` (`ApplicationDbContextModelSnapshot.cs`):

| Origen (fuego)                      | Tipo origen       | Destino                                   | Nota                                                                                      |
| :---------------------------------- | :---------------- | :---------------------------------------- | :---------------------------------------------------------------------------------------- |
| `Id`                                | `uniqueidentifier` | `Equipment.Id`                            | **Se conserva** (UUID v7, `Guid.CreateVersion7()`); es lo que evita tocar los dependientes. |
| `CustomerId`                        | `uniqueidentifier` | `Equipment.CustomerId`                    | Directo.                                                                                  |
| `ApplicationUserId`                 | `nvarchar(450)`    | `Equipment.UserId`                        | Directo.                                                                                  |
| `Location`                          | `nvarchar(max)`    | `Equipment.Location`                      | Directo.                                                                                  |
| `LocalCode`                         | `nvarchar(max)`    | **`Equipment.LocalCode` (columna nueva)** | No existe hoy en `Equipment`. Útil también para equipos generales.                        |
| `Photo`                             | `nvarchar(max)`    | `Equipment.PhotoPath`                     | Solo el nombre de archivo; los archivos **no se mueven** (§4, H6).                        |
| — (no existe)                       | —                  | `Equipment.NameMachinery` (`Name`)        | **Regla de nombre** obligatoria (D2). Hoy fuego no tiene nombre.                          |
| — (no existe)                       | —                  | `Equipment.State`                         | Fuego no tiene estado ni soft-delete: todo se mapea a **Activo** (D3).                    |
| — (no existe)                       | —                  | `Equipment.DateOfPurchase` (`InstallationDate`, `date NOT NULL`) | **Bloqueante:** hay que volverla nullable (D5).                       |
| — (no existe)                       | —                  | `Equipment.InventoryCategory`             | Valor nuevo `ContraIncendio` (D1).                                                        |
| `ExtinguisherType`, `ExpirationDate`| `int`, `date`      | `EquipmentFireDetails`                    | Detalle 1:1 (variante E2).                                                                |
| `HydrantType`, `CabinetNumber`      | `int`, `nvarchar`  | `EquipmentFireDetails`                    | idem.                                                                                     |
| `DetectorType`                      | `int`              | `EquipmentFireDetails`                    | idem.                                                                                     |
| `StationType`                       | `int`              | `EquipmentFireDetails`                    | idem.                                                                                     |

Notas de esquema: ni `Equipment` ni las tablas de fuego implementan `ISoftDeletable` (`GuidIdEntity` solo tiene `Id`),
ni tienen índices únicos; solo índices por `CustomerId`, `ApplicationUserId` (y `EquipmentClassificationId` en `Equipment`).
Los únicos campos `NOT NULL` de `Equipment` son `Id`, `CustomerId`, `InstallationDate`, `State` e `InventoryCategory`.

### 2.3 FK salientes hacia las tablas de fuego (deben reapuntarse a `Equipment`)

12 FK, todas `ON DELETE RESTRICT` y requeridas (snapshot `:22793-22982`):

| Grupo                     | Tabla                                                                                                           | Columna FK                                            |
| :------------------------ | :-------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------- |
| Bitácoras (4)             | `FireExtinguisherLogs`, `HydrantLogs`, `SmokeDetectorLogs`, `ManualCallPointLogs`                               | `ExtinguisherId` / `HydrantId` / `DetectorId` / `StationId` |
| Ítems de período (4)      | `FireInspectionPeriodExtinguishers`, `…Hydrants`, `…Detectors`, `…Stations`                                     | ídem                                                  |
| Inspecciones de ciclo (4) | `FireCycleInspectionExtinguishers`, `…Hydrants`, `…Detectors`, `…Stations`                                      | ídem                                                  |

Como `Id` se conserva, **los datos de estas 12 tablas no cambian**: solo se reemplaza la constraint (§6, M5).

### 2.4 FK entrantes a `Equipment` (no se tocan)

11 entidades con `MachineryId`: `MaintenanceCalendar`, `ServiceOrder`, `MaintenanceLog`, `EquipmentDocument`,
`EquipmentInspectionDefinition`, `EquipmentInspectionExecution`, `EquipmentQrLabel`, `ElevatorsEmergencyCall`,
`ElevatorSparePartsChange`, `LightingStock`, `PaintStock`.
**Consecuencia:** al vivir el fuego en `Equipment`, ya podría tener QR, definiciones de inspección, documentos y OS
**sin crear tablas nuevas** para esos servicios.

### 2.5 Semántica de `InventoryCategory` (hallazgo)

8 valores vigentes: `Equipos=1, Amenidades=2, Mobiliarios=3, Equipamiento=4, Gimnasio=5, Sistemas=6,
BodegasCuartosMaquinas=7, AreasComunes=8` (`Pintura=9` está comentado). Es una **categoría funcional/de ubicación**
del inventario, no el "tipo técnico" del activo. Hoy los activos de fuego **no tienen** categoría: agregar
`ContraIncendio` no les quita nada que ya tengan; solo impide expresar "extintor de Gimnasio" con esta columna
(para eso ya existe `Location`).

---

## 3. Diseño objetivo

### 3.1 Variantes

| Variante | Descripción                                                                                                   | Veredicto                                                                            |
| :------- | :------------------------------------------------------------------------------------------------------------ | :----------------------------------------------------------------------------------- |
| **E1**   | Todas las columnas propias de fuego (6) como nullable en `Equipment`.                                         | Válida, pero `Equipment` crece con columnas que solo aplican a una categoría; el `NOT NULL` por tipo pasa a código. |
| **E2** ⭐ | `Equipment` (núcleo) + `EquipmentFireDetails` (1:1, PK = FK `EquipmentId`) con `FireAssetKind` + las 6 columnas. | Recomendada: sin herencia EF, `NOT NULL`/`CHECK` por tipo dentro de la tabla de detalle, escalable a otros tipos con detalle propio. |

### 3.2 Cambios de esquema (todos aditivos)

- `Equipment`: `+ LocalCode nvarchar(max) NULL`; `InstallationDate` pasa a `NULL` (`DateOnly?`).
- `InventoryCategory`: nuevo valor **`ContraIncendio = 10`** (no 9: `Pintura = 9` estuvo definido y comentado; se usa 10
  salvo que el control C3 demuestre que 9 nunca se persistió).
- Nueva tabla `EquipmentFireDetails(EquipmentId PK/FK → Equipment.Id, FireAssetKind int NOT NULL,
  ExtinguisherType int NULL, ExpirationDate date NULL, HydrantType int NULL, CabinetNumber nvarchar(max) NULL,
  DetectorType int NULL, StationType int NULL)` con `CHECK` por `FireAssetKind` (p. ej. kind=Extintor ⇒
  `ExtinguisherType` y `ExpirationDate` no nulos).
- Nueva tabla de control `AssetMigrationLog` (§6, M3).
- Reglas de la regla `?` del repo: `Guid?`/`DateOnly?`/`int?` válidos; `string` sin `?`
  (`conventions/backend/backend-rules.md:423-434`).

### 3.3 Cambios de código (alcance medido)

| Área                                  | Cantidad / detalle                                                                                                      |
| :------------------------------------ | :---------------------------------------------------------------------------------------------------------------------- |
| Entidades de fuego                    | `EquipoContraIncendioBase` + 4 `Inventario*` **se retiran**; `UseTpcMappingStrategy` de la base (`ApplicationDbContext.cs:3237`) se elimina. Las otras 3 bases TPC se conservan. |
| Entidades dependientes                | 12: cambia el tipo de navegación `InventarioX` → `Equipment` (FK y columna no cambian).                                 |
| Módulos de fuego                      | 4 (`FireExtinguisherInventory`, `HydrantInventory`, `SmokeDetectorInventory`, `ManualCallPointInventory`): servicios, mappers, resolvers, interfaces y endpoints (~20 archivos) leen de `Equipment` + `EquipmentFireDetails`. **Endpoints y DTOs no cambian** ⇒ el front (43 archivos con referencias) no cambia. |
| Consumidores de `Equipment`           | 14 archivos / 47 usos (§5).                                                                                             |
| Configuraciones                       | 3 `Inventario*Configuration` (vacías, con `TODO`) se eliminan; nueva configuración de `EquipmentFireDetails`.            |

---

## 4. Hallazgos críticos (deben cerrarse antes de migrar)

| #  | Hallazgo                                                                                                                                                                                                                                                                                       | Evidencia                                                                                           | Severidad |
| :- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------- | :-------: |
| H1 | **`PUT api/machineries/update-category` es un endpoint vivo** que carga **todos** los `Equipment` (sin filtro de cliente) y les asigna `InventoryCategory.Equipos`. Con fuego dentro de `Equipment`, una sola llamada **sobrescribe la categoría de los 2 867 activos** y hoy ya pisa la categoría de todos los equipos de todos los clientes. | `MachineryAppService.cs:461-479`, `MachineriesEndpoints.cs:115-121`                                  | 🔴 Crítica |
| H2 | **Listados sin filtro de categoría** incluirían fuego (+56 % de filas): `SelectItemMachineriesGetAllAsync`, `SelectItemMachineriesActiveAsync`, `SelectItemInstalacionesAsync`, `InventarioCompletoAsync`, `GetAutocompeteInvAsync`, `ActasEntregaAsync`. Los dropdowns además están **cacheados por cliente** (`GetOrSetAsync … TtlCatalogoPorCliente`): hay que invalidar caché al migrar. | `SelectItemAppService.cs:229-248,489`; `MachineryAppService.cs:99,545,587`                          | 🔴 Crítica |
| H3 | **`InventoryCategory` como enum expuesto en formularios:** `Create/UpdateMachineryDTO` y el endpoint `inventory-category` (`SelectItemEnumEndPoints.cs:59`) permitirían crear un "equipo general" con categoría `ContraIncendio` desde el formulario normal. Hay que excluir el valor del select y validar en servicio. | `CreateMachineryDTO.cs:31`, `UpdateMachineryDTO.cs:31`                                              | 🟠 Alta   |
| H4 | **Dashboard con lista fija de 8 categorías:** las OS de activos de fuego (si llegan a existir) no aparecerían por categoría. Decidir si el dashboard debe mostrar `ContraIncendio` o excluirlo explícitamente.                                                                                       | `DashboardMetricsAppService.cs:197-238`                                                              | 🟠 Alta   |
| H5 | **Purga de cliente:** `CustomerAppService` borra `Equipment` por cliente con `RemoveRange`, y las FK de fuego son `RESTRICT`. Con fuego en `Equipment`, la rutina debe borrar antes los 12 dependientes o fallará. Hoy solo referencia `InventarioExtintor` en una lista (línea 792); auditar el orden completo. | `CustomerAppService.cs:417-448,792`                                                                  | 🟠 Alta   |
| H6 | **Fotos con rutas distintas:** fuego usa `IFileReadPathService.GetExtintorPhotoPath(...)` y `Equipment` usa `GetMachineryFilePath` (`customers/{id}/machinery/`). Los archivos físicos **no viven en la BD**: moverlos es un riesgo de pérdida distinto. Decisión: **no mover archivos**; resolver la ruta por categoría/kind. | `InventarioExtintorfileWritePathServiceResolver.cs:13`, `MachineryAppService.cs` (ruta hardcodeada, auditoría 2026-08-12) | 🟠 Alta   |

Hallazgos menores: `DateOfPurchase` `NOT NULL` (D5); `NameMachinery` sin equivalente en fuego (D2); no hay unicidad de
`LocalCode` por cliente (se audita con el control C4 antes de decidir si se agrega índice).

---

## 5. Auditoría de consumidores de `Equipment` (47 usos, 14 archivos)

| Veredicto                     | Usos | Dónde                                                                                                                                                                                                                 | Acción                                                                 |
| :---------------------------- | ---: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------- |
| **Por Id (inocuos)**          |  ~24 | `MaintenanceCalendarAppService` (61, 217, 319, 635), `EquipmentQrLabelAppService` (19, 225), `EquipmentInspectionExecutionAppService` (110), `EquipmentInspectionDefinitionAppService` (175), `ServiceOrderAppService` (439, 636), `MachineryAppService` (157, 169, 325, 337, 365, 391, 403, 413, 487, 527) | Sin cambio. Funcionan igual con activos de fuego.                       |
| **Filtrados por categoría**   |    8 | `MachineryAppService` (37, 187, 245, 571, 629), `MachineryAssetAppService` (27), `EntregaRecepcionAppService` (12, 37)                                                                                                 | **Excluyen fuego automáticamente** (piden `Equipos`, `AreasComunes` o el parámetro). Verificar con prueba. |
| **Sin filtro (a decidir)**    |   ~9 | `SelectItemAppService` (232, 242, 489), `MachineryAppService` (99, 545, 587, 465), `MaintenanceCalendarAppService` (855, 1139)                                                                                          | Agregar exclusión explícita de `ContraIncendio` **o** decidir que deben incluirlo (H2).  |
| **Por clasificación**         |    2 | `ElevatorsEmergencyCallAppService` (58), `ElevatorSparePartsChangeAppService` (58)                                                                                                                                      | Filtran por `ClasificasionEquipoElevadoresId`: sin impacto.            |
| **Mutación masiva (peligro)** |    1 | `MachineryAppService.UpdateCategoryAsync` (465-473)                                                                                                                                                                     | Ver H1: deshabilitar o acotar por cliente y excluir fuego.             |
| **Purga**                     |    2 | `CustomerAppService` (417, 445)                                                                                                                                                                                         | Ver H5.                                                                |

Los conteos "~" se confirman en la fase de ejecución con un `grep` por cada `dbContext.Equipment` (criterio de
aceptación G4, §7).

---

## 6. Estrategia de migración sin pérdida de datos

### 6.1 Principios

1. **Copiar, nunca mover.** Las tablas de fuego no se modifican ni se borran durante toda la migración.
2. **Mismo `Id`.** El `Id` de fuego pasa idéntico a `Equipment` ⇒ los datos de los 12 dependientes no cambian.
3. **Idempotente y reanudable.** Cada script usa `WHERE NOT EXISTS`; se puede repetir sin duplicar.
4. **Nada avanza sin reconciliar.** Cada fase termina con controles (§6.3) que deben dar **0 diferencias**.
5. **Respaldo verificado.** Un respaldo que nunca se restauró no es un respaldo.
6. **Punto de no retorno explícito** (M5) y rollback documentado antes y después de él.

### 6.2 Fases

| Fase   | Acción                                                                                                                                                                                                                               | Reversible | Datos de origen tocados |
| :----- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------: | :---------------------: |
| **M0** | Respaldo completo de BD **y prueba de restauración** en otro entorno. Copia de las 4 tablas de fuego y las 12 dependientes a `*_bak20260926` (`SELECT INTO`) + registro de conteos y checksums base (C1, C6).                            |    ✅      |          No             |
| **M1** | **Pre-checks de calidad** (C2–C5): colisión de `Id`, categorías en uso, nulos, duplicados de `LocalCode`, huérfanos. Si algo falla, se corrige el dato o se ajusta el diseño antes de continuar.                                        |    ✅      |          No             |
| **M2** | **Migración EF aditiva:** `LocalCode`, `InstallationDate` nullable, valor de enum, `EquipmentFireDetails`, `AssetMigrationLog`. Sin datos. Se despliega con el código de compatibilidad (H1, H2, H3 cerrados).                          |    ✅ (`DROP`) |       No             |
| **M3** | **Backfill** idempotente por tabla y por cliente, en transacción, escribiendo `AssetMigrationLog(SourceTable, SourceId, TargetId, RowHash, MigratedAt)`. Primero **Hydrants (0 filas)** como ensayo del flujo; luego **ManualCallPoints (188)**; luego extintores (733) y detectores (1 946). |    ✅ (borrar por log) |  No             |
| **M4** | **Reconciliación** (C7–C10): conteos por tabla y por cliente, comparación campo a campo, hash por fila, y **prueba de que las 5 086 filas originales de `Equipment` no cambiaron** (C6).                                                |    ✅      |          No             |
| **M5** | **Cambio de FK y de lectura/escritura** (punto de no retorno, ver 6.4): ventana corta; se reemplazan las 12 constraints con `WITH CHECK`, y los 4 módulos de fuego pasan a leer/escribir `Equipment` + `EquipmentFireDetails`.        | ⚠️ ver 6.4 |          No             |
| **M6** | **Retiro gradual:** las tablas de fuego quedan **renombradas `*_deprecated` y de solo lectura** durante un período de retención (propuesto: 90 días y una auditoría limpia). El `DROP` es una migración posterior, aparte, aprobada. |    ✅      |     Solo renombre       |

### 6.3 Controles de datos

Scripts en T-SQL sobre nombres verificados en el snapshot. Los específicos de SQL Server (`CHECKSUM_AGG`, `HASHBYTES`,
`CONVERT`) se reescriben para PostgreSQL (`md5`, `::text`) en el cutover de motor.

| Control | Objetivo                                   | Esperado                        |
| :------ | :----------------------------------------- | :------------------------------ |
| **C1**  | Conteos base por tabla (antes de todo)     | 5086 / 733 / 0 / 1946 / 188     |
| **C2**  | `Id` repetido entre `Equipment` y fuego    | 0 filas                         |
| **C3**  | Valores de `InventoryCategory` en uso      | solo 1–8                        |
| **C4**  | Calidad de fuego: nulos y duplicados       | 0 nulos críticos; duplicados listados y resueltos |
| **C5**  | Conteos de los 12 dependientes (antes/después) | idénticos                   |
| **C6**  | Checksum de las 5 086 filas originales     | idéntico antes/después          |
| **C7**  | Filas de fuego sin destino                 | 0                               |
| **C8**  | Diferencias campo a campo origen↔destino   | 0                               |
| **C9**  | Total final de `Equipment`                 | 7 953                           |
| **C10** | Dependientes huérfanos tras M5             | 0                               |

```sql
-- C1 · Conteos base (guardar el resultado en el ticket de M0)
SELECT 'Equipment' t, COUNT(*) n FROM Equipment
UNION ALL SELECT 'FireExtinguishers', COUNT(*) FROM FireExtinguishers
UNION ALL SELECT 'Hydrants',          COUNT(*) FROM Hydrants
UNION ALL SELECT 'SmokeDetectors',    COUNT(*) FROM SmokeDetectors
UNION ALL SELECT 'ManualCallPoints',  COUNT(*) FROM ManualCallPoints;

-- C2 · Colisión de Id entre las 5 tablas (esperado: 0 filas)
SELECT Id, COUNT(*) c FROM (
    SELECT Id FROM Equipment          UNION ALL SELECT Id FROM FireExtinguishers
    UNION ALL SELECT Id FROM Hydrants UNION ALL SELECT Id FROM SmokeDetectors
    UNION ALL SELECT Id FROM ManualCallPoints) x
GROUP BY Id HAVING COUNT(*) > 1;

-- C3 · Categorías realmente persistidas (esperado: solo 1..8)
SELECT InventoryCategory, COUNT(*) FROM Equipment GROUP BY InventoryCategory ORDER BY 1;

-- C4 · Calidad de fuego: LocalCode vacío y duplicados por cliente
SELECT 'sin LocalCode' motivo, COUNT(*) n FROM (
    SELECT LocalCode FROM FireExtinguishers UNION ALL SELECT LocalCode FROM Hydrants
    UNION ALL SELECT LocalCode FROM SmokeDetectors UNION ALL SELECT LocalCode FROM ManualCallPoints) f
WHERE LocalCode IS NULL OR LTRIM(RTRIM(LocalCode)) = '';

SELECT CustomerId, LocalCode, COUNT(*) c FROM (
    SELECT CustomerId, LocalCode FROM FireExtinguishers UNION ALL SELECT CustomerId, LocalCode FROM Hydrants
    UNION ALL SELECT CustomerId, LocalCode FROM SmokeDetectors UNION ALL SELECT CustomerId, LocalCode FROM ManualCallPoints) f
WHERE LocalCode IS NOT NULL
GROUP BY CustomerId, LocalCode HAVING COUNT(*) > 1;

-- C6 · Checksum de las filas ORIGINALES de Equipment (lista explícita: no incluir columnas nuevas)
SELECT COUNT(*) n, CHECKSUM_AGG(CHECKSUM(Id, CustomerId, UserId, Name, Brand, Model, SerialNumber,
       InstallationDate, Location, State, InventoryCategory, TechnicalSpecifications, PhotoPath,
       Observations, EquipmentClassificationId)) h
FROM Equipment WHERE InventoryCategory <> @ContraIncendio;   -- correr antes (sin filtro) y después
```

```sql
-- M3 · Backfill idempotente (ejemplo: extintores). Repetir por tabla; @Activo y @ContraIncendio = valores de enum.
BEGIN TRAN;
INSERT INTO Equipment (Id, CustomerId, UserId, Name, Location, LocalCode, PhotoPath,
                       State, InventoryCategory, InstallationDate)
SELECT f.Id, f.CustomerId, f.ApplicationUserId,
       COALESCE(NULLIF(LTRIM(RTRIM(f.LocalCode)), ''), 'Extintor ' + LEFT(CONVERT(varchar(36), f.Id), 8)),  -- regla D2
       f.Location, f.LocalCode, f.Photo, @Activo, @ContraIncendio, NULL
FROM FireExtinguishers f
WHERE NOT EXISTS (SELECT 1 FROM Equipment e WHERE e.Id = f.Id);

INSERT INTO EquipmentFireDetails (EquipmentId, FireAssetKind, ExtinguisherType, ExpirationDate)
SELECT f.Id, @KindExtintor, f.ExtinguisherType, f.ExpirationDate
FROM FireExtinguishers f
WHERE NOT EXISTS (SELECT 1 FROM EquipmentFireDetails d WHERE d.EquipmentId = f.Id);

INSERT INTO AssetMigrationLog (SourceTable, SourceId, TargetId, MigratedAt)
SELECT 'FireExtinguishers', f.Id, f.Id, SYSUTCDATETIME()
FROM FireExtinguishers f
WHERE NOT EXISTS (SELECT 1 FROM AssetMigrationLog l WHERE l.SourceTable = 'FireExtinguishers' AND l.SourceId = f.Id);
-- Solo si los controles C7/C8 dan 0: COMMIT. Si no: ROLLBACK.
COMMIT;

-- C7 · Filas de origen sin destino (esperado: 0)
SELECT f.Id FROM FireExtinguishers f
LEFT JOIN Equipment e ON e.Id = f.Id AND e.InventoryCategory = @ContraIncendio
LEFT JOIN EquipmentFireDetails d ON d.EquipmentId = f.Id
WHERE e.Id IS NULL OR d.EquipmentId IS NULL;

-- C8 · Diferencias campo a campo (esperado: 0 filas)
SELECT f.Id FROM FireExtinguishers f
JOIN Equipment e ON e.Id = f.Id
JOIN EquipmentFireDetails d ON d.EquipmentId = f.Id
WHERE f.CustomerId <> e.CustomerId
   OR ISNULL(f.ApplicationUserId,'') <> ISNULL(e.UserId,'')
   OR ISNULL(f.Location,'')  <> ISNULL(e.Location,'')
   OR ISNULL(f.LocalCode,'') <> ISNULL(e.LocalCode,'')
   OR ISNULL(f.Photo,'')     <> ISNULL(e.PhotoPath,'')
   OR f.ExtinguisherType <> d.ExtinguisherType
   OR f.ExpirationDate   <> d.ExpirationDate;

-- C9 · Total (esperado: 7953)
SELECT COUNT(*) FROM Equipment;
```

```sql
-- M5 · Cambio de FK (ejemplo: bitácora de extintores). Los nombres reales de constraint se leen de sys.foreign_keys.
ALTER TABLE FireExtinguisherLogs DROP CONSTRAINT <FK_hacia_FireExtinguishers>;
ALTER TABLE FireExtinguisherLogs WITH CHECK
    ADD CONSTRAINT FK_FireExtinguisherLogs_Equipment_ExtinguisherId
    FOREIGN KEY (ExtinguisherId) REFERENCES Equipment(Id);   -- WITH CHECK valida TODAS las filas existentes

-- C10 · Huérfanos (esperado: 0), repetir para las 12 tablas
SELECT COUNT(*) FROM FireExtinguisherLogs l
LEFT JOIN Equipment e ON e.Id = l.ExtinguisherId WHERE e.Id IS NULL;
```

### 6.4 Rollback y punto de no retorno

| Momento                  | Cómo se revierte                                                                                                                                                              | Riesgo de pérdida |
| :----------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------- |
| M0–M4                    | `DELETE` de las filas copiadas usando `AssetMigrationLog` (`TargetId`); `DROP` de columnas/tablas nuevas. Las tablas de fuego nunca se tocaron.                              | Ninguno           |
| M5, **antes** de escrituras nuevas | Reponer las 12 FK originales hacia las tablas de fuego (válidas porque su contenido sigue idéntico) y volver la bandera de lectura.                                | Ninguno           |
| M5, **después** de escrituras nuevas | Las altas/cambios hechos en `Equipment` **no existen** en las tablas de fuego y la FK original fallaría. Requiere **sincronización inversa** (script `Equipment→fuego` por `FireAssetKind`) antes de reponer las FK. | **Sí, si no se sincroniza** |

**Cómo se elimina ese riesgo (decisión D4):**

- **Opción recomendada:** ventana de mantenimiento corta (fuego tiene baja escritura y solo 2 867 filas), bandera de
  configuración para la lectura, **y doble escritura de los inventarios durante un release** (los 4 servicios de fuego
  escriben en `Equipment`+detalle y espejan a la tabla legacy). Así el rollback siempre es válido. Las bitácoras e
  inspecciones **no** necesitan doble escritura: son las mismas filas y solo cambia la constraint.
- El punto de no retorno pasa entonces a ser **M6** (renombrar/retirar las tablas de fuego), no M5.

---

## 7. Plan de pruebas y criterios de aceptación

| Gate   | Criterio                                                                                                                                              | Cuándo            |
| :----- | :---------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------- |
| **G1** | Respaldo restaurado y verificado en otro entorno; conteos C1 idénticos.                                                                               | Fin de M0         |
| **G2** | C2 = 0, C3 solo 1–8, C4 revisado y decidido, C5 registrado.                                                                                            | Fin de M1         |
| **G3** | H1 (`update-category`), H2 (listados y caché), H3 (select/validación) y H4 (dashboard) **resueltos y con prueba**; migración aditiva aplicada sin errores. | Fin de M2         |
| **G4** | `grep` de `dbContext.Equipment` = 47 usos clasificados (§5) sin ninguno "sin decidir"; pruebas de regresión: listados de equipos generales devuelven **exactamente** los mismos ids que antes de la migración (comparación contra C1/C6). | Antes de M5       |
| **G5** | C7 = 0, C8 = 0, C9 = 7 953, C6 idéntico, C10 = 0 en las 12 tablas.                                                                                     | Fin de M4 y M5    |
| **G6** | Flujos de fuego de extremo a extremo: alta/edición de cada tipo, bitácora, período→ciclo→inspección, QR, PDF y fotos; comparación de respuestas de los 4 endpoints de listado contra el legacy. | Antes de cerrar M5 |

Pruebas de regresión mínimas por módulo afectado: `MachineryAppService` (listados, PDF, autocompletado), `SelectItemAppService`
(3 dropdowns, con caché invalidada), `MaintenanceCalendarAppService` (cronograma anual), `EntregaRecepcionAppService`,
`DashboardMetricsAppService`, `ServiceOrderAppService.GetAllAsync`, y la purga de cliente en un cliente de prueba con fuego.

---

## 8. Riesgos residuales

| Riesgo                                                          | Prob. | Impacto | Mitigación                                                                   |
| :-------------------------------------------------------------- | :---: | :-----: | :--------------------------------------------------------------------------- |
| Un listado sin filtro muestra fuego a usuarios de equipos       | Media |  Medio  | Auditoría §5, G4, prueba de igualdad de ids.                                  |
| `update-category` corre por error tras migrar                   | Baja  |  Alto   | Deshabilitar/acotar **antes de M2** (H1).                                     |
| Pérdida de fotos por mover archivos                             | Baja  |  Alto   | No mover archivos; resolver ruta por kind (H6).                               |
| Nombres generados (D2) confunden al operador                    | Media |  Bajo   | Regla determinista y visible (`LocalCode` primero); revisable en UI.          |
| Doble escritura desincronizada durante el release               | Baja  |  Medio  | Control C8 programado a diario durante el release; alerta ante diferencia.    |
| Migración de motor a PostgreSQL en paralelo                     | Media |  Medio  | Scripts marcados T-SQL; no mezclar M5 con el cutover de motor.                |

---

## 9. Decisiones abiertas

| #      | Decisión                                                                                               | Recomendación                                                                                        |
| :----- | :----------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------- |
| **D1** | ¿Eje "tipo de activo": valor nuevo en `InventoryCategory` o columna propia?                            | Valor nuevo **`ContraIncendio = 10`** + `FireAssetKind` en el detalle. La mayoría de listados ya filtra por categoría, así que se excluyen solos. |
| **D2** | Regla de `Name` para fuego (hoy no existe)                                                             | `LocalCode`; si falta, `"{Tipo} {8 primeros del Id}"`. Nunca nulo, nunca aleatorio.                   |
| **D3** | `State` inicial de fuego                                                                               | `Activo` (fuego no tiene estado ni soft-delete hoy).                                                 |
| **D4** | ¿Ventana + doble escritura un release, o solo ventana?                                                 | Ventana **+** doble escritura de los 4 inventarios (elimina el riesgo de rollback con pérdida).      |
| **D5** | `DateOfPurchase` nullable                                                                              | Sí (`DateOnly?`); auditar los consumidores del campo en la fase de ejecución.                        |
| **D6** | `UpdateCategoryAsync`: ¿deshabilitar, acotar por cliente o eliminar?                                   | Deshabilitar el endpoint en M2 y eliminarlo después: es una herramienta de migración de un solo uso. |

---

## 10. Comparación con la opción TPT ligero (`Assets`)

| Aspecto                                  | `Equipment` único (E2)                                   | TPT ligero (`Assets`)                                         |
| :--------------------------------------- | :------------------------------------------------------- | :------------------------------------------------------------ |
| Datos que se mueven                      | 2 867 filas (copia)                                      | 0 (solo backfill de `Assets` con 7 953 ids)                   |
| QR/inspección/OS/documentos para fuego   | **Ya disponibles** (FK existentes a `Equipment`)         | Hay que construir satélites nuevos apuntando a `Assets`       |
| Toca consumidores de `Equipment`         | **Sí** (§5, H1–H5)                                       | No                                                            |
| Riesgo dominante                         | Regresión semántica en listados/dashboard/purga          | Doble identidad y trabajo de satélites                        |
| Reversibilidad                           | Total hasta M6 (con D4)                                  | Total                                                         |

**Lectura:** `Equipment` único da más funcionalidad por menos tablas nuevas; TPT ligero es más seguro para el código
existente. Como los 6 hallazgos de §4 están **acotados y son verificables**, la opción `Equipment` único es viable si
se cierran en M2 (G3).

---

## 11. Opinión del agente autor (validación técnica)

> Verificado contra el código el 2026-09-26. Excluye `.kilo/worktrees`.

### 11.1 Veredicto

**Estoy de acuerdo con el cambio de enfoque y con la recomendación E2.** Es un enfoque **mejor**
que mi TPT ligero `Assets` para este contexto, y lo argumento con datos:

- Mi TPT ligero exigía construir satélites nuevos (QR, inspección, OS, documentos) apuntando a
  `Assets`. El análisis demuestra que **`Equipment` ya tiene esas 11 FK** (`MaintenanceCalendar`,
  `ServiceOrder`, `MaintenanceLog`, `EquipmentDocument`, `EquipmentInspection*`, `EquipmentQrLabel`,
  etc.), así que meter fuego en `Equipment` **da QR/inspección/OS/documentos "gratis"**.
- El costo de mi opción (doble identidad + satélites + backfill de 7 953 ids) es mayor que el de
  cerrar 6 hallazgos **acotados y verificables**.

**Conclusión: E2 (`Equipment` núcleo + `EquipmentFireDetails` 1:1) es la opción correcta.**

### 11.2 Verificación contra el código (hechos)

| Afirmación del análisis | Resultado | Evidencia |
|:---|:---|:---|
| TPC explícito de las 4 bases | ✅ | `ApplicationDbContext.cs:3237,3239,3241,3243` (4 llamadas a `UseTpcMappingStrategy`). |
| `update-category` vivo y peligroso (H1) | ✅ | `MachineryAppService.cs:461-471` `UpdateCategoryAsync` carga todo y asigna `InventoryCategory.Equipos`. |
| 12 FK hacia tablas de fuego, todas `Restrict` | ✅ | snapshot `:22793-22981` (4 bitácoras + 4 ítems de período + 4 inspecciones de ciclo). |
| `CustomerAppService` purga `Equipment` por cliente (H5) | ✅ | `CustomerAppService.cs:417,445-446` (`RemoveRange`); la lista de línea 792 es informativa. |
| `DbSet` de fuego nombrados `FireExtinguishers/Hydrants/SmokeDetectors/ManualCallPoints` | ✅ | `ApplicationDbContext.cs:2321-2345`. |
| SQL Server + migración a PostgreSQL en curso | ⚠️ Confirmado por el repo (`sqlcmd`/`Npgsql`), pero **no verificé el estado del cutover**; lo dejé como supuesto. |

### 11.3 Dónde estoy de acuerdo con las decisiones D1–D6

- **D1 (`ContraIncendio = 10`, no 9):** correcto. `Pintura = 9` estuvo definido y comentado
  (`InventoryCategory.cs:59-60`); usar 10 evita colisión. El control **C3** lo confirma.
- **D2 (regla de `Name`):** correcto y necesario; fuego no tiene nombre y `Equipment.Name`
  (`Name` → hoy `NameMachinery`) es la columna de nombre. `LocalCode` primero es buena regla.
- **D3 (`State = Activo`):** correcto. Ni `Equipment` ni fuego implementan `ISoftDeletable`
  (verificado): el soft-delete es solo `ISoftDeletable`, no `GuidIdEntity`.
- **D4 (ventana + doble escritura):** **de acuerdo**. Es lo que mueve el punto de no retorno de
  M5 a M6 y elimina el único escenario con pérdida. Sin esto, M5 es irreversible de facto.
- **D5 (`DateOfPurchase` nullable):** correcto; es bloqueante porque `InstallationDate` es
  `NOT NULL` (verificado: único campo date no nulo de `Equipment`).
- **D6 (deshabilitar/eliminar `update-category`):** **de acuerdo, y es lo primero**. Es una
  herramienta de migración de un solo uso que hoy pisa categorías de **todos** los clientes.

### 11.4 Observaciones / riesgos que añado

1. **H2 es más grave de lo que se ve.** Los dropdowns cacheados por cliente
   (`TtlCatalogoPorCliente`) pueden **seguir mostrando fuego** desde caché tras migrar aunque el
   código ya filtre. La invalidación de caché es un paso de M5, no un "verificar después" (lo
   listo como riesgo en G3/G4, pero conviene subrayarlo).
2. **`EquipmentFireDetails` con `CHECK` por `FireAssetKind`:** correcto, pero ojo con el
   `CHECK` en **PostgreSQL** durante el cutover (nombres/constraints se recrean). Debe ir en la
   misma tanda que el resto.
3. **Multi-tenant sigue sin filtro automático.** `ITenantEntity` es marca; meter fuego en
   `Equipment` **hereda** el aislamiento manual por servicio. No es un defecto del plan, pero
   conviene que los 4 módulos de fuego validen `CustomerId` como ya hacen.
4. **Riesgo de "listado" (H2) se cruza con §11 de la adenda previa:** 16 002 OS no son presión
   de BD, pero los listados de `Equipment` **sí crecen 56 %** (5 086 → 7 953). Ya está en H2;
   solo confirmo que el driver es de **UX/listados**, no de motor.
5. **Punto de no retorno:** con D4 aceptada, el DDL de M5 (reemplazo de las 12 FK) sigue siendo
   delicado; recomiendo hacerlo en la **misma transacción** que la bandera de lectura, y con la
   doble escritura ya activa.

### 11.5 Lo que falta para arrancar (no bloquea el diseño)

- **Nombres reales de las 12 constraints** (`sys.foreign_keys`): el análisis usa
  `<FK_hacia_FireExtinguishers>` como placeholder. Se resuelve en M1 con un `SELECT`.
- **Valores numéricos de `State`** (para `@Activo`): verificar el enum `State` antes de M3.
- **Confirmar estado del cutover PostgreSQL**: si M5 cae en medio del cambio de motor, los
  scripts T-SQL no aplican. Mantener M5 **fuera** de la ventana del cutover.

### 11.6 Recomendación operativa

1. Cerrar **H1 y H3 en M2** (antes de cualquier dato) — son los únicos que corrompen datos.
2. Ejecutar **M3 en orden**: `Hydrants` (0) → `ManualCallPoints` (188) → `FireExtinguishers`
   (733) → `SmokeDetectors` (1 946). Coincide con lo pedido en la adenda previa (§11.3).
3. **No mover archivos de fotos** (H6): resolver ruta por `FireAssetKind`.
4. D4 con doble escritura: el rollback siempre válido hasta M6.

**Opinión final: aprobado técnicamente. La opción `Equipment` único (E2) es superior a mi TPT
ligero para este caso, y los 6 hallazgos son cerrables. Recomiendo proceder.**

---

## 12. Registro

| Fecha      | Actor            | Acción                                                                                              |
| :--------- | :--------------- | :-------------------------------------------------------------------------------------------------- |
| 2026-09-26 | Arquitecto (rev) | Análisis de solo lectura completado; hallazgos H1–H6, controles C1–C10, gates G1–G6, decisiones D1–D6. |
| 2026-09-26 | Agente (autor)   | Opinión técnica (§11): E2 aprobado; H1/H2/12 FK/H5 verificados en código; D1–D6 aceptadas; 5 observaciones. |
| 2026-09-26 | Arquitecto (rev) | Revisión de §11: aceptada. **Dos correcciones:** (1) "DDL de M5 en la misma transacción que la bandera de lectura" es inviable (una bandera de configuración no es transaccional); (2) "los 4 módulos validan `CustomerId` como ya hacen" es falso en operaciones por Id (`InventarioExtintorAppService.cs:27,159,197`). Hallazgo adicional: `Program.cs:209-219` auto-migra en todos los entornos y traga errores. Todo incorporado al plan `20260926-plan-maintenance-machinery.md`. |
|            |                  |                                                                                                     |

> **Estado:** análisis emitido y validado por el agente autor. Sin cambios de código ni migraciones. Pendiente:
> decisiones D1–D6 del dueño del módulo, nombres reales de las 12 FK (`sys.foreign_keys`), valores numéricos de
> `State` y confirmar ventana vs cutover PostgreSQL.
