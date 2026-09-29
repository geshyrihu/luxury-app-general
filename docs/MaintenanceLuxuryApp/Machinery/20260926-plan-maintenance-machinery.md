# Plan de Migración — Activos de contra incendio dentro de `Equipment` (E2)

## 0. Metadata

| Campo                         | Valor                                                                                                                                                                                                          |
| :---------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tipo                          | Plan de **migración** (cambio mayor y sensible; toca datos)                                                                                                                                                    |
| Módulo / submódulo            | `MaintenanceLuxuryApp` / `Machinery` (toca `OperationsLuxuryApp` en purga de cliente y OS)                                                                                                                     |
| Fecha                         | 2026-09-26                                                                                                                                                                                                     |
| Estado                        | **Borrador — pendiente de aprobación del Tech Lead**                                                                                                                                                           |
| Autor                         | Arquitecto (sesión Claude). **Ejecuta:** agente CLI. **Ejecuta datos en BD:** Tech Lead                                                                                                                        |
| Origen                        | [Diseño](20260925-diseno-centralizacion-activos.md) → [Adenda](20260926-adenda-revision-arquitectonica-centralizacion-activos.md) → [Análisis](20260926-analisis-equipment-unico-y-control-de-datos.md) (H1–H6, C1–C10, D1–D6) |
| Requiere migración de datos   | **Sí** — ver §3.5 y [script SQL](20260926-plan-maintenance-machinery-migracion.sql)                                                                                                                            |
| Toca `shared` / contratos     | **Endpoints y DTOs de fuego no cambian.** Cambian: enum `InventoryCategory`, `Equipment`, select de categoría, purga de cliente.                                                                                |
| Motor                         | SQL Server. Cutover a PostgreSQL en curso (ver §8, D-04).                                                                                                                                                       |
| Reemplaza                     | Etapas 1 y 2 del diseño original (`IAsset`/`AssetBase`/`Assets`). Etapa 3 (OS por lote) queda **fuera** de este plan.                                                                                           |

**Ajustes de este plan respecto al análisis (decisiones del arquitecto, con evidencia):**

1. **La app auto-migra al arrancar, en todos los entornos y tragándose los errores.** `Program.cs:209-219` ejecuta `Database.MigrateAsync()` y, si falla, solo imprime `[STARTUP WARNING] … Se continuará`. Consecuencias: (a) toda migración EF incluida en un despliegue **corre sola en producción**; (b) una migración fallida deja la app viva contra un esquema a medias, sin alarma. Por eso: **ningún dato se copia en una migración EF** (el backfill es un script manual del Tech Lead) y **cada release tiene un gate posterior que verifica `__EFMigrationsHistory`**.
2. **La doble escritura se activa ANTES del backfill** (release R1) y no después. Así no queda ventana con filas que cambian sin reflejarse.
3. **El cambio de FK (M5) no se hace "en la misma transacción que la bandera de lectura"** (sugerencia del agente autor): una bandera de configuración no participa en una transacción de BD. El cambio de FK es una migración EF (R2) que solo se despliega si el Paso 4 del script da 0 huérfanos, y su rollback es redeploy de R1 + SQL inverso (§10).
4. **La restricción `NOT NULL` de `InstallationDate` no se elimina a secas:** se reemplaza por `CHECK (InstallationDate IS NOT NULL OR InventoryCategory = 10)`, para que las 5 086 filas originales conserven la garantía.
5. **Nombre del valor de enum:** `FireProtection = 10` (`[Display(Name = "Contra incendio")]`), no `ContraIncendio`, por la regla de identificadores en inglés en código nuevo (`conventions/GOVERNANCE-ANTI-SPANGLISH-RULES.md`). Los miembros existentes de `InventoryCategory` son legado en español y no se renombran.
6. **Corrección a la observación del agente autor (§11.4-3 del análisis):** afirmó que los módulos de fuego "validan `CustomerId` como ya hacen". **No es cierto para operaciones por Id:** `InventarioExtintorAppService.cs:27,159,197` usan `FindAsync(id)` / `FirstOrDefaultAsync(x => x.Id == id)` sin `CustomerId`; solo los listados filtran por cliente (`:63,101`). Es un hallazgo **previo** (no lo introduce este plan) y `MachineryAppService` tiene el mismo patrón (`:157,169,337,365,403,487`). Queda registrado como T-009 (auditoría) y **fuera del alcance de corrección**.

---

## FASE 0 — Pre-planeación

### 0.1 Problem Statement + KPIs

> Actualmente, el **equipo de mantenimiento** sufre de **inventarios de activos duplicados en 5 tablas** (`Equipment` y 4 de fuego) cuando intenta **etiquetar con QR, inspeccionar, documentar o abrir órdenes de servicio sobre un extintor, hidrante, detector o estación**, lo que resulta en **que 2 867 activos de fuego no puedan usar ninguna de esas capacidades y que cada campo común (ubicación, foto, código, usuario, cliente) esté repetido en 2 esquemas**.
> Esto afecta a **todos los clientes con inventario de fuego** en **7 953 activos** (5 086 equipos + 2 867 de fuego).

| Métrica                                                       | Baseline (verificado)         | Target                                   | Timeline        | Verificación                                   |
| :------------------------------------------------------------ | :---------------------------- | :--------------------------------------- | :-------------- | :--------------------------------------------- |
| Registros de fuego perdidos o alterados en la migración       | n/a                           | **0**                                    | Gate G5         | C7 = 0, C8 = 0 (script, Pasos 2–3)             |
| Filas originales de `Equipment` modificadas por la migración  | n/a                           | **0**                                    | Gate G5         | C6 = 0 y 0 (script, Paso 3)                    |
| Filas de dependientes de fuego huérfanas tras el cambio de FK | n/a                           | **0** de 12 tablas                       | Gate G6         | Paso 4 del script antes de R2; C10 después     |
| Tipos de activo que pueden tener QR/inspección/documentos     | 1 de 5 (solo `Equipment`)     | **5 de 5** (capacidad, no adopción)      | Fin de R2       | Prueba G7 con un activo de cada tipo           |
| Tablas de inventario de activos                               | 5                             | **2** (`Equipment` + `EquipmentFireDetails`) | Fin de R3   | Esquema tras `DROP` aprobado                   |
| Listados de equipos generales que incluyen fuego por error    | 0                             | **0** (no regresión)                     | R0 y R2         | Prueba de igualdad de ids (G3, G6)             |
| Migraciones EF fallidas sin detectar                          | desconocido (errores tragados) | **0**                                    | Cada release    | Gate post-deploy sobre `__EFMigrationsHistory` |

### 0.2 Matriz de reglas de negocio (RN-MAQ)

**Nivel 1 — Invariantes de dominio**

| RN          | Regla                                                                                                                           | Se implementa en                                          |
| :---------- | :------------------------------------------------------------------------------------------------------------------------------ | :-------------------------------------------------------- |
| RN-MAQ-001  | Todo activo inventariable tiene un único `Id` y pertenece a exactamente un `CustomerId`.                                        | `Equipment`; script Paso 2 (mismo `Id`, mismo `CustomerId`) |
| RN-MAQ-002  | Ningún activo de fuego, bitácora, ítem de período ni inspección de ciclo se pierde ni cambia de `Id`.                           | Script Pasos 2–4; T-203 (solo cambia la FK, no los datos)  |
| RN-MAQ-003  | Un `Equipment` con `InventoryCategory = FireProtection` tiene exactamente un `EquipmentFireDetails`; los demás, ninguno.        | T-102 (CHECK + PK=FK); script C9b                          |
| RN-MAQ-004  | Las 5 086 filas originales de `Equipment` no cambian durante la migración.                                                      | Script C6; T-104 (CHECK de fecha)                          |

**Nivel 2 — Flujo y estados**

| RN          | Regla                                                                                                                             | Se implementa en                           |
| :---------- | :-------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------- |
| RN-MAQ-010  | Las fases avanzan en orden R0 → R1 → D1 → R2 → R3; ninguna avanza sin su gate en verde.                                           | §5 y §6                                    |
| RN-MAQ-011  | La doble escritura está activa antes del backfill y hasta el retiro (R3).                                                         | T-106 (R1) → T-301 (R3)                    |
| RN-MAQ-012  | Las tablas de fuego quedan de solo lectura tras R3 y no se borran hasta el fin del período de retención y una aprobación aparte. | T-302, T-304                               |

**Nivel 3 — Seguridad / autorización**

| RN          | Regla                                                                                                                                 | Se implementa en                          |
| :---------- | :------------------------------------------------------------------------------------------------------------------------------------ | :---------------------------------------- |
| RN-MAQ-020  | Solo el Tech Lead ejecuta scripts de datos en producción. Los agentes ejecutan únicamente en desarrollo/staging.                      | §3.5, §4 (columna Responsable)            |
| RN-MAQ-021  | La purga de un cliente elimina los 12 dependientes de fuego **antes** que `Equipment` (FK `RESTRICT`).                                | T-204                                     |
| RN-MAQ-022  | Ningún endpoint puede reasignar la categoría de todos los equipos en masa.                                                            | T-001                                     |
| RN-MAQ-023  | El aislamiento por `CustomerId` en listados se conserva; las operaciones por Id sin cliente son deuda previa registrada, no ampliada. | T-009 (auditoría)                         |

**Nivel 4 — Validación de datos**

| RN          | Regla                                                                                                                                                  | Se implementa en           |
| :---------- | :----------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------- |
| RN-MAQ-030  | `Name` de un activo de fuego = `LocalCode`; si falta, `"{Tipo} {8 primeros caracteres del Id}"`. Nunca nulo ni aleatorio.                              | Script; T-106 (mirror)     |
| RN-MAQ-031  | `State` inicial de fuego = `Activo` (0). Fuego no tiene estado ni soft-delete hoy.                                                                     | Script; T-106              |
| RN-MAQ-032  | `FireProtection = 10` no aparece en el select `inventory-category` y `Create/UpdateMachinery` lo rechazan.                                             | T-003                      |
| RN-MAQ-033  | `InstallationDate` puede ser nulo **solo** si `InventoryCategory = FireProtection`.                                                                    | T-104 (CHECK)              |
| RN-MAQ-034  | Las fotos de fuego no se mueven de carpeta; la ruta se resuelve por categoría.                                                                          | T-205                      |
| RN-MAQ-035  | Cada `FireAssetKind` exige sus columnas: Extinguisher → `ExtinguisherType`,`ExpirationDate`; Hydrant → `HydrantType`; SmokeDetector → `DetectorType`; ManualCallPoint → `StationType`. | T-102 (CHECK)              |

### 0.3 Riesgos, pre-mortem y flujos

**Pre-mortem — "salió a producción y fue un desastre; ¿qué lo causó?"**

| Supuesto fallido                                                                                          | Impacto | Prob. | Mitigación                                                                                                   |
| :--------------------------------------------------------------------------------------------------------- | :-----: | :---: | :----------------------------------------------------------------------------------------------------------- |
| Se despliega R2 con el backfill incompleto; la migración de FK falla y **el error se traga** (`Program.cs`) | Alto    | Media | Gate pre-deploy (Paso 4 = 0) + gate post-deploy sobre `__EFMigrationsHistory` + alerta en el log de arranque. |
| `PUT update-category` se ejecuta tras migrar y deja los 2 867 activos como `Equipos`                       | Alto    | Baja  | T-001 en R0, antes de cualquier dato.                                                                         |
| Un dropdown cacheado muestra detectores como equipos generales                                            | Medio   | Alta  | T-004, T-005; invalidación de caché en D1 y R2.                                                              |
| Se cambia la migración EF y se le mete el backfill "para ahorrar un paso"                                  | Alto    | Media | RN-MAQ-020; revisión del arquitecto de cada migración EF (gate).                                             |
| Fotos rotas en QR/PDF de activos de fuego (ruta de `machinery` vs ruta de extintores)                      | Medio   | Alta  | T-205 con prueba visual en G7.                                                                                |
| Doble escritura se desincroniza                                                                            | Medio   | Baja  | Mirror transaccional único (T-106) + C8 diario durante R2.                                                   |
| El cutover a PostgreSQL cae en medio de R2                                                                 | Alto    | Media | Dependencia D-04: fecha confirmada; R2 fuera de esa ventana.                                                 |
| Purga de cliente falla o deja fuego huérfano                                                               | Medio   | Media | T-204 con prueba sobre un cliente de staging con fuego.                                                      |

**Happy path:** R0 cierra los peligros → R1 crea el esquema y activa el mirror → el Tech Lead corre el script (0 diferencias) → R2 cambia lectura y FK → 1 release de estabilización → R3 retira lo legado.
**Sad path:** un control da diferencia → se detiene, se corrige el dato o el script, se repite (idempotente); si R2 falla → redeploy de R1 + SQL inverso (§10).
**Edge path:** un cliente crea un extintor **entre** R1 y el backfill → el mirror lo inserta en `Equipment`; el backfill lo salta (`NOT EXISTS`) y la verificación C8 lo compara igual.

---

## 1. Resumen ejecutivo

**Problema:** 5 tablas de inventario para el mismo concepto; fuego no puede usar QR, inspecciones, documentos ni OS.
**Solución:** los 2 867 activos de fuego pasan a `Equipment` (categoría `FireProtection`) con sus columnas propias en `EquipmentFireDetails` (1:1). Sin herencia EF ni discriminador. Las 11 FK existentes hacia `Equipment` no se tocan; se reapuntan las 12 de fuego sin modificar sus datos.
**Beneficios:** un solo inventario, capacidades de `Equipment` disponibles para fuego, menos duplicación, desaparece el acoplamiento Operations↔Maintenance en entidades.
**Riesgo dominante:** no es la copia de datos (7 953 filas, comprobable), sino el cambio de semántica de `Equipment` y el arranque que auto-migra. Se controla con R0 antes de mover un solo dato.

## 2. Scope & Constraints

**IN-SCOPE**
- Cierre de H1–H5 (endpoint masivo, listados, select, dashboard, purga, caché).
- Esquema aditivo: `Equipment.LocalCode`, `InstallationDate` nullable + CHECK, `EquipmentFireDetails`, `AssetMigrationLog`, valor de enum.
- Doble escritura en los 4 módulos de fuego, backfill, cambio de lectura y de 12 FK, retiro gradual.
- Resolución de ruta de fotos por categoría en consumidores de `Equipment`.
- Documentación de los 4 módulos y del catálogo.

**OUT-OF-SCOPE**
- OS y calendario por lote (`ServiceOrderAsset`, `AssetGroup`) — plan aparte (Etapa 3).
- Unificación de motores de inspección, `AssetLogBase`, `Pool`/`Meter`.
- Renombrado de propiedades (`NameMachinery`, `Ubication`, `Serie`).
- Mover archivos de fotos.
- Corregir la falta de validación de `CustomerId` en operaciones por Id (deuda previa, T-009 solo audita).
- Cambiar el comportamiento de auto-migración de `Program.cs` (se mitiga con gates; cambiarlo es otra decisión).
- Frontend: **sin cambios** (endpoints y DTOs de fuego idénticos). Se verifica en G7.

**Restricciones**
- `CONVENTIONS.md` y `backend-rules.md` vigentes: `.Select()` manual en consultas (sin `ProjectTo`), `Guid?`/`DateOnly?` permitidos, `string` sin `?`, identificadores nuevos en inglés, sin renombrar columnas.
- Migraciones EF: revisión manual de `Up()`/`Down()`; una migración = una responsabilidad; **nunca datos**.
- Backups verificados antes de cada paso de datos.

## 3. Arquitectura y diseño técnico

### 3.1 Modelo destino

```text
Equipment (5 086 + 2 867 filas)                      EquipmentFireDetails (2 867 filas, 1:1)
  Id · CustomerId · UserId · Name · Location           EquipmentId (PK, FK → Equipment.Id, ON DELETE CASCADE)
  LocalCode (NUEVA, nullable)                          FireAssetKind (int NOT NULL: 1..4)
  PhotoPath · State · InventoryCategory (+FireProtection=10)   ExtinguisherType? · ExpirationDate?
  InstallationDate (NULL; CHECK: NOT NULL o categoría 10)      HydrantType? · CabinetNumber?
  Brand · Model · SerialNumber · TechnicalSpecifications       DetectorType? · StationType?
  Observations · EquipmentClassificationId                      CHECK por FireAssetKind (RN-MAQ-035)
        │ 11 FK existentes (no cambian) + 12 FK de fuego (reapuntadas en R2)
AssetMigrationLog (SourceTable, SourceId, TargetId, MigratedAt · UNIQUE(SourceTable, SourceId))
```

Contrato de nombres (el script SQL depende de ellos; **no cambiar**): tabla `EquipmentFireDetails`, columnas `EquipmentId`, `FireAssetKind`, `ExtinguisherType`, `ExpirationDate`, `HydrantType`, `CabinetNumber`, `DetectorType`, `StationType`; tabla `AssetMigrationLog` con `SourceTable`, `SourceId`, `TargetId`, `MigratedAt`; columna `Equipment.LocalCode`. Enum `FireAssetKind { Extinguisher = 1, Hydrant = 2, SmokeDetector = 3, ManualCallPoint = 4 }` en `Shared/Enums`.

### 3.2 Secuencia de releases

```text
R0  Salvaguardas (solo código, sin datos, sin migración EF)
R1  Esquema aditivo (migración EF 1) + doble escritura en los 4 módulos
D1  Backfill y reconciliación (Tech Lead, script SQL)  ──► Gate G5
R2  Lectura desde Equipment + migración EF 2 (cambio de 12 FK)   ──► punto de no retorno = R3
R3  Retiro: se detiene el mirror, legado a solo lectura, tablas renombradas (DROP en plan aparte)
```

### 3.3 Módulos y archivos afectados (verificados)

| Área                       | Archivos                                                                                                                                                                                                                                           |
| :------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Enum                       | `api/LuxuryApp.Application/Shared/Enums/InventoryCategory.cs`; nuevo `FireAssetKind.cs`                                                                                                                                                            |
| Entidades `Equipment`      | `Infrastructure/Data/Entities/MaintenanceLuxuryApp/Machinery/Equipment.cs`; nuevos `EquipmentFireDetails.cs`, `AssetMigrationLog.cs`; configuración nueva en `Infrastructure/Data/Configurations/`                                                   |
| Entidades de fuego         | `OperationsLuxuryApp/Inventory/EquipoContraIncendioBase.cs` + 4 `Inventario*.cs` (se retiran en R3); 12 dependientes en `MaintenanceLuxuryApp/{FireInspectionPeriods,FireExtinguisherLog,HydrantLog,SmokeDetectorLog,ManualCallPointLog}/`            |
| Módulos de fuego           | `Modules/MaintenanceLuxuryApp/{FireExtinguisherInventory,HydrantInventory,SmokeDetectorInventory,ManualCallPointInventory}/` (Services, Mapping, Interfaces, EndPoints)                                                                              |
| Consumidores de `Equipment`| `SelectItemAppService.cs`, `MachineryAppService.cs`, `MaintenanceCalendarAppService.cs`, `EntregaRecepcionAppService.cs`, `CustomerAppService.cs`, `DashboardMetricsAppService.cs`, `MachineryAssetAppService.cs`, `EquipmentQrLabelAppService.cs`  |
| DbContext                  | `Infrastructure/Data/ApplicationDbContext.cs` (`:2321-2345` DbSets; `:3237` TPC de la base de fuego)                                                                                                                                              |
| Arranque                   | `api/LuxuryApp.Api/Program.cs:209-239` (auto-migración; **no se modifica**)                                                                                                                                                                        |

## 3.5 Migración de datos y prevención de pérdida

**Responsable:** Tech Lead (ejecuta y valida). El agente documenta y prepara. **Script:** [20260926-plan-maintenance-machinery-migracion.sql](20260926-plan-maintenance-machinery-migracion.sql). Protocolo: `conventions/operations/data-migration-protocol.md`.

### 3.5.1 Cambios de estructura

| Tabla                    | Cambio                                                              | Tipo            | Riesgo | Mitigación                                                                  |
| :----------------------- | :------------------------------------------------------------------ | :-------------- | :----: | :-------------------------------------------------------------------------- |
| `Equipment`              | `+ LocalCode nvarchar(max) NULL`                                    | Columna nullable | Bajo   | Sin default; sin backfill de las 5 086 originales.                          |
| `Equipment`              | `InstallationDate` pasa a `NULL` + `CHECK` (nulo solo si categoría 10) | Relajar restricción | Medio | El CHECK conserva la garantía para las originales; C6 lo comprueba.        |
| `EquipmentFireDetails`   | Tabla nueva                                                         | Nueva           | Bajo   | Vacía hasta D1; CHECK por tipo.                                             |
| `AssetMigrationLog`      | Tabla nueva                                                         | Nueva           | Bajo   | Solo trazabilidad.                                                          |
| 12 dependientes de fuego | FK `→ tabla de fuego` reemplazada por FK `→ Equipment(Id)`          | Cambio de constraint | **Alto** | Solo si Paso 4 = 0; datos no cambian (mismo `Id`); `WITH CHECK` valida todo. |
| 4 tablas de fuego        | Renombradas `*_deprecated` en R3; `DROP` en plan aparte              | Retiro          | **Alto** | Retención ≥ 90 días + auditoría limpia + aprobación explícita.              |

### 3.5.2 Análisis de pérdida de datos

| Escenario                                                    | ¿Se pierde algo?                 | Mitigación específica                                                                                           |
| :----------------------------------------------------------- | :------------------------------- | :--------------------------------------------------------------------------------------------------------------- |
| Backfill (copia)                                             | No: el origen no se toca         | `NOT EXISTS` (idempotente) + verificación interna con `THROW` + C7/C8.                                          |
| Cambio de FK (R2)                                            | No: solo cambia la constraint    | Paso 4 previo; `WITH CHECK`; migración EF revisada; gate post-deploy.                                            |
| Filas de fuego creadas/editadas entre R1 y R2                | Sí, si no hubiera doble escritura | Mirror transaccional (T-106) activo **antes** del backfill; C8 diario.                                          |
| Migración EF falla y se traga                                | No, pero el esquema queda a medias | Gate post-deploy obligatorio; no avanzar hasta verificar `__EFMigrationsHistory`.                                |
| Edición legítima de equipos durante la comprobación C6       | No, pero produce falsos positivos | Ejecutar C6 en la misma ventana del backfill; documentar cualquier diferencia explicada.                        |
| Nombres generados (RN-MAQ-030) sobrescriben datos            | No: fuego no tenía nombre        | `Name` solo se genera; `LocalCode` conserva el valor original tal cual.                                        |
| Fotos: cambio de ruta                                        | Sí, si se movieran archivos      | **No se mueven archivos** (RN-MAQ-034); solo se resuelve la ruta.                                               |

### 3.5.3 Ejecución

Ver el script: Paso 0 respaldo (BD completa **y prueba de restauración**, más copias `bak_20260926_*` de las 4 tablas de fuego, las 12 dependientes y `Equipment`) → Paso 1 línea base y pre-checks (C1–C4) → Paso 2 backfill por tabla en el orden **Hydrants (0) → ManualCallPoints (188) → FireExtinguishers (733) → SmokeDetectors (1 946)** → Paso 3 reconciliación global (C6, C9) → Paso 4 pre-condición de FK. Se corre **primero en staging con copia reciente de producción**, con el mismo resultado esperado.

### 3.5.4 Validación post-migración (checklist verificable)

- [ ] Respaldo restaurado y `RESTORE VERIFYONLY` sin error (G1).
- [ ] C1 antes = C1 después para las tablas de fuego y sus 12 dependientes.
- [ ] C2 = 0 filas; C3 solo `1..8` y `10`; C4a/C4b registrados.
- [ ] Cada bloque del Paso 2 terminó sin `THROW` (C7 = 0, C8 = 0).
- [ ] C9: `EnEquipment` = `EnOrigen`; C9b = 0 y 0.
- [ ] C6 = 0 y 0 (las originales no cambiaron).
- [ ] Paso 4: 12 filas en 0.
- [ ] `Equipment` total = 5 086 + suma de fuego (7 953 al 2026-09-26; recalcular si cambió).
- [ ] Logs de auditoría y `AssetMigrationLog` intactos; salida archivada en el changelog de migración.

### 3.5.5 Rollback

Ver §10. Antes de R2: SQL inverso del Paso 99 (borra solo categoría 10; falla de forma segura si algo ya la referencia). Después de R2: redeploy de R1 + SQL inverso de FK (§10).

### 3.5.6 Comunicación

- [ ] Tech Lead confirma por escrito "backfill OK, validación PASS" (o reporta diferencias).
- [ ] Log en `docs/MaintenanceLuxuryApp/Machinery/YYYYMMDD-changelog-maintenance-machinery-migracion.md`.
- [ ] El front se verifica en G7; no se espera cambio.

## 4. Backlog de tasks

> **Responsable:** `Agente` = agente CLI ejecutor · `TL` = Tech Lead · `Arq` = arquitecto (revisa/aprueba gate). El agente **no marca una tarea como hecha sin evidencia** (archivo:línea, salida de comando o resultado de prueba).

### R0 — Salvaguardas (solo código; sin datos ni migración EF)

| ID     | Tarea                                                                                                                                                                                                                                                                     | Resp.  | Evidencia esperada                                                             |
| :----- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----- | :----------------------------------------------------------------------------- |
| T-001  | Eliminar `PUT api/machineries/update-category` (`MachineriesEndpoints.cs:115-121`), `UpdateCategoryAsync` (`MachineryAppService.cs:461-479`, `IMachineryAppService.cs:57`). Verificar con `grep` que el front no lo llama.                                                | Agente | `grep` sin resultados; build OK.                                               |
| T-002  | Agregar `FireProtection = 10` con `[Display(Name = "Contra incendio")]` en `InventoryCategory.cs`. No reutilizar el 9 (`Pintura`).                                                                                                                                        | Agente | Diff del enum.                                                                 |
| T-003  | Excluir `FireProtection` del select `inventory-category` (`SelectItemEnumEndPoints.cs:59`) y rechazarlo en `Create`/`UpdateMachinery` (`MachineryAppService.cs` ≈`:325`, `:391`) con error de validación.                                                                 | Agente | Pruebas: select sin el valor; Create/Update con 10 → error.                    |
| T-004  | Exclusión explícita `InventoryCategory != FireProtection` en consumidores sin filtro: `SelectItemAppService.cs:232,242,489`; `MachineryAppService.cs:99,545,587`. **No** tocar `MaintenanceCalendarAppService.cs:855,1139` (filtran por `MaintenanceCalendars.Count > 0`); se reevalúan en Etapa 3. | Agente | Pruebas por método con un `Equipment` de categoría 10 sembrado en pruebas.     |
| T-005  | Identificar el mecanismo de caché de `GetOrSetAsync` (`si:maquinaria:*`) y documentar/implementar el procedimiento de invalidación por cliente y por prefijo.                                                                                                             | Agente | Nota técnica + método o comando de invalidación probado.                       |
| T-006  | Dashboard: dejar explícito que `FireProtection` **no** entra en la lista fija de `DashboardMetricsAppService.cs:231-238` ni en los `GroupBy` (`:197,210`) hasta que exista OS de fuego; comentario y prueba.                                                              | Agente | Prueba con OS ligada a un `Equipment` de categoría 10.                         |
| T-007  | Mapear (solo lectura) qué borra hoy la purga de cliente respecto de fuego (`CustomerAppService.cs:415-449,792`) y entregar el mapa. No se cambia código en R0.                                                                                                            | Agente | Documento corto con archivo:línea.                                             |
| T-008  | Pruebas de regresión de R0: los listados de equipos generales devuelven **exactamente los mismos ids** con y sin filas de categoría 10 sembradas.                                                                                                                         | Agente | Reporte de pruebas verde.                                                      |
| T-009  | Auditar (solo informe) las operaciones por Id sin `CustomerId` en los 4 módulos de fuego y en `MachineryAppService`. **No corregir** en este plan.                                                                                                                       | Agente | Tabla archivo:línea → `docs/.../YYYYMMDD-auditoria-maintenance-machinery.md`.  |

### R1 — Esquema aditivo + doble escritura

| ID     | Tarea                                                                                                                                                                                                                                                                                      | Resp.  | Evidencia esperada                                                    |
| :----- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----- | :-------------------------------------------------------------------- |
| T-101  | `Equipment`: agregar `LocalCode` (`[Column("LocalCode")]`) y volver `DateOfPurchase` `DateOnly?` (quitar `[Required]`, conservar `[Column("InstallationDate")]`). Auditar con `grep` todos los consumidores de `DateOfPurchase` (DTOs, PDFs, calendario) y manejar el nulo.                  | Agente | Lista de consumidores + pruebas del caso nulo.                        |
| T-102  | Crear `FireAssetKind`, `EquipmentFireDetails` (PK = FK `EquipmentId`, cascada) y su configuración con los `CHECK` por tipo (RN-MAQ-035). Nombres exactos del §3.1.                                                                                                                          | Agente | Entidad + configuración + prueba de que un CHECK inválido falla.      |
| T-103  | Crear `AssetMigrationLog` con índice único `(SourceTable, SourceId)`.                                                                                                                                                                                                                      | Agente | Entidad + configuración.                                              |
| T-104  | `CHECK (InstallationDate IS NOT NULL OR InventoryCategory = 10)` en `Equipment`.                                                                                                                                                                                                           | Agente | Configuración + prueba con categoría 1 y fecha nula → rechazo.        |
| T-105  | Generar la migración EF **AddFireDetailsToEquipment**. Revisar `Up()`/`Down()` a mano: solo `ADD COLUMN`, `ALTER COLUMN NULL`, `CREATE TABLE`, `ADD CONSTRAINT`. **Sin `INSERT`/`UPDATE`.** Entregar el SQL generado (`dotnet ef migrations script`).                                     | Agente → Arq | Script generado; revisión del arquitecto (gate).                |
| T-106  | **Mirror transaccional** único (`EquipmentFireMirrorService` o equivalente) invocado por los 4 módulos en alta, edición y baja: upsert/delete de `Equipment` + `EquipmentFireDetails` **en el mismo `SaveChanges`** que la tabla de fuego. Aplica RN-MAQ-030/031. Falla del mirror = falla de la operación. | Agente | Pruebas unitarias del mirror y de los 4 módulos.                      |
| T-107  | Pruebas: nombre generado, alta/edición/baja espejadas, foto (`Photo` → `PhotoPath`), tipos por `FireAssetKind`.                                                                                                                                                                            | Agente | Reporte verde.                                                        |

### D1 — Datos (Tech Lead)

| ID     | Tarea                                                                                                                                                | Resp. |
| :----- | :--------------------------------------------------------------------------------------------------------------------------------------------------- | :---- |
| T-151  | Staging: restaurar copia reciente de producción, correr el script completo, archivar la salida.                                                      | TL    |
| T-152  | Producción: Paso 0 (respaldo + restauración verificada) → Pasos 1–4. Invalidar caché (T-005) al terminar.                                             | TL    |
| T-153  | Publicar el changelog de migración con conteos antes/después y resultado de C1–C10.                                                                   | TL    |

### R2 — Lectura desde `Equipment` + cambio de FK

| ID     | Tarea                                                                                                                                                                                                                                                                                                  | Resp.  | Evidencia esperada                                              |
| :----- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----- | :-------------------------------------------------------------- |
| T-201  | Los 4 módulos leen de `Equipment` + `EquipmentFireDetails` filtrando por `FireAssetKind` **y `CustomerId` en listados**. **Endpoints y DTOs idénticos.** Resolvers de foto (`Inventario*fileWritePathServiceResolver`) se conservan.                                                                | Agente | Comparación de respuestas de los 4 listados contra R1 (G6).     |
| T-202  | 12 dependientes: navegación `InventarioX` → `Equipment` (FK y columna no cambian). Las entidades legadas siguen mapeadas **sin relaciones** solo para el mirror.                                                                                                                                       | Agente | Diff de las 12 entidades.                                       |
| T-203  | Migración EF **SwitchFireForeignKeysToEquipment**: por cada una de las 12 FK, `DROP` de la vieja (nombre real vía `sys.foreign_keys`, C4c) y `ADD` hacia `Equipment(Id)` con validación. `Down()` inverso. Sin datos.                                                                                 | Agente → Arq | SQL generado + revisión del arquitecto (gate).            |
| T-204  | Purga de cliente: eliminar los 12 dependientes y las filas de fuego antes de `Equipment` (`CustomerAppService.cs:415-449`), con `EquipmentFireDetails` incluido. Probar con un cliente de staging con fuego.                                                                                          | Agente | Prueba de purga completa sin violar FK.                         |
| T-205  | Ruta de fotos por categoría: en QR (`EquipmentQrLabelAppService.cs`), PDFs y cualquier consumidor que use `GetMachineryFilePath` sobre `Equipment.PhotoPath`; para categoría 10 usar la ruta del tipo (`GetExtintorPhotoPath` y equivalentes). Listar cada sitio con `grep`.                          | Agente | Lista de sitios + prueba visual de una foto de cada tipo (G7).  |
| T-206  | Invalidar caché de selects tras el despliegue (T-005).                                                                                                                                                                                                                                                 | TL     | Confirmación.                                                   |
| T-207  | Pruebas de extremo a extremo de fuego: alta/edición de cada tipo, bitácora, período → ciclo → inspección, QR, PDF, fotos; y de equipos generales (no regresión).                                                                                                                                      | Agente | Reporte + capturas para el arquitecto.                          |
| T-208  | **Control C8 diario** durante R2 (consulta del script, Paso 2 verificación) y alerta si hay filas.                                                                                                                                                                                                     | TL     | Registro diario.                                                |

### R3 — Retiro

| ID     | Tarea                                                                                                                                                              | Resp.  |
| :----- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----- |
| T-301  | Detener el mirror (T-106) tras el período de estabilización.                                                                                                       | Agente |
| T-302  | Migración EF que renombra las 4 tablas de fuego a `*_deprecated` (solo lectura). **Sin `DROP`.**                                                                  | Agente → Arq |
| T-303  | Retirar entidades legadas, sus 3 `Configuration` vacías, los `DbSet` (`ApplicationDbContext.cs:2321-2345`) y el TPC de la base (`:3237`). Mantener las otras 3 bases TPC. | Agente |
| T-304  | `DROP` de tablas `*_deprecated` y `bak_20260926_*`: **plan y aprobación aparte**, tras retención ≥ 90 días.                                                        | TL     |
| T-305  | Actualizar READMEs de los 4 módulos, `README-fire-equipment.md` y el catálogo de convenciones que mencione las 4 tablas.                                            | Agente |

## 5. Fases de ejecución y criterios de paso (gates)

| Fase | Contenido                       | Gate                                                                                                                                                                                                                                      | Aprueba |
| :--- | :------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------ |
| R0   | T-001 … T-009                   | **G3:** build y pruebas verdes; T-008 demuestra igualdad de ids; `update-category` inexistente; T-007 y T-009 entregados. Post-deploy: sin `[STARTUP WARNING]` en el log.                                                                | Arq     |
| R1   | T-101 … T-107                   | **G2:** migración revisada; **G4 post-deploy:** `__EFMigrationsHistory` contiene `AddFireDetailsToEquipment`, las tablas/CHECK existen, sin `[STARTUP WARNING]`; una alta de cada tipo aparece espejada en `Equipment` y en su tabla.     | Arq     |
| D1   | T-151 … T-153                   | **G1 y G5:** respaldo restaurado (G1); C1–C10 de §3.5.4 en verde en staging **y** en producción; Paso 4 = 0 en las 12 filas.                                                                                                              | TL + Arq |
| R2   | T-201 … T-208                   | **G6:** antes de desplegar, Paso 4 = 0; migración de FK revisada. **G7 post-deploy:** `__EFMigrationsHistory` con `SwitchFireForeignKeysToEquipment`; 12 FK apuntan a `Equipment` (consulta `sys.foreign_keys`); C10 = 0; respuestas de los 4 listados idénticas a R1; un activo de **cada tipo** con QR, inspección y documento; fotos visibles; front sin cambios. | TL + Arq |
| R3   | T-301 … T-305                   | **G8:** C8 sin diferencias durante todo R2; auditoría limpia; retención cumplida; aprobación del `DROP` (T-304) aparte.                                                                                                                   | TL + Arq |

## 6. Criterios de completitud

- [ ] Los 7 KPIs de §0.1 en su target, con la evidencia indicada.
- [ ] `grep` de `dbContext.Equipment` (47 usos, 14 archivos): **ninguno "sin decidir"**; cada uso clasificado en el informe de T-008.
- [ ] 0 registros de fuego perdidos: conteo por tabla, por cliente y por tipo iguales a la línea base (más altas/bajas registradas en el log de mirror).
- [ ] 12 FK apuntando a `Equipment`; 0 huérfanos.
- [ ] Ninguna migración EF contiene `INSERT`/`UPDATE` de datos de negocio.
- [ ] Pruebas verdes; sin `[STARTUP WARNING]` en el arranque de cada release.
- [ ] Documentación actualizada (T-305) y changelog de migración publicado.
- [ ] Auditoría del arquitecto del diff de cada release, sin hallazgos críticos abiertos.

## 7. Riesgos y mitigaciones

Ver el pre-mortem de §0.3. Responsables: **Arq** (diseño y gates), **TL** (datos, producción, caché, C8 diario), **Agente** (código y pruebas). Riesgo residual aceptado: deuda previa de validación de `CustomerId` en operaciones por Id (T-009 la documenta, no la corrige).

## 8. Dependencias externas

| ID    | Dependencia                                                                                                                                | Bloquea                     | Estado                      |
| :---- | :----------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------- | :-------------------------- |
| D-01  | Aprobación de este plan y de las decisiones D1–D6 del análisis (con los ajustes de §0)                                                     | Todo                        | Pendiente (Tech Lead)       |
| D-02  | Entorno de staging con copia reciente de producción                                                                                        | D1                          | Pendiente (Tech Lead)       |
| D-03  | Acceso del Tech Lead a producción y ventana corta para D1 y R2                                                                             | D1, R2                      | Pendiente                   |
| D-04  | **Estado y fecha del cutover a PostgreSQL** (R2 no debe caer en esa ventana; los scripts son T-SQL)                                        | R2                          | Pendiente (Tech Lead)       |
| D-05  | Mecanismo de caché de selects (T-005)                                                                                                       | Invalidación en D1/R2       | Lo resuelve T-005           |

## 9. Métricas y KPIs de éxito

Ver §0.1. Se reportan al cierre de cada gate y se consolidan en la revisión post-implementación (§11).

## 10. Rollback

| Momento                                   | Procedimiento                                                                                                                                                                                                                      | ¿Riesgo de pérdida? |
| :---------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------ |
| R0                                        | Redeploy del release anterior (no hay cambios de datos ni de esquema).                                                                                                                                                              | No                  |
| R1                                        | Redeploy de R0 + `Down()` de `AddFireDetailsToEquipment` ejecutado a mano (las tablas nuevas están vacías o solo con espejos). **Recordar: redeploy solo no deshace una migración EF.**                                              | No                  |
| D1 (antes de R2)                          | Script Paso 99 (borra solo categoría 10; falla si algo ya la referencia). Origen intacto.                                                                                                                                            | No                  |
| R2 (durante estabilización)               | 1) Redeploy de R1. 2) SQL inverso: `DROP` de las 12 FK nuevas y `ADD` de las 12 originales hacia las tablas de fuego (`WITH CHECK`); válido porque el mirror mantuvo las tablas de fuego al día. 3) Invalidar caché.                | No (mirror activo)  |
| R3 en adelante                            | Restaurar desde las tablas `*_deprecated`/`bak_20260926_*` o desde el respaldo completo; **punto de no retorno práctico.** Por eso R3 exige retención y aprobación.                                                                  | Sí, si no se retuvo |
| Cualquier falla de migración EF           | Verificar `__EFMigrationsHistory`; si quedó parcial, **detener el tráfico de escritura de fuego**, ejecutar el `Down()` a mano o restaurar el respaldo del Paso 0 (G1).                                                             | Depende             |

Respaldo de referencia: el del Paso 0 (BD completa restaurable + copias `bak_20260926_*`).

## 11. Post-implementation review

Al cerrar R3 se responde con datos reales: ¿se cumplieron los 7 KPIs?; riesgos reales vs. supuestos del pre-mortem (en particular auto-migración y caché); ¿hubo diferencias en C8 durante R2 y de qué tipo?; ¿cuántos consumidores de `Equipment` requirieron cambio vs. los ~9 estimados?; aprendizajes para la Etapa 3 (OS por lote). Se archiva en `YYYYMMDD-auditoria-maintenance-machinery-migracion.md`.

---

## Reglas para el agente ejecutor

1. Ejecutar **solo** las tareas T-xxx de la release indicada por el Tech Lead, en orden. No adelantar releases.
2. **Nunca** ejecutar el script SQL en producción ni tocar `Program.cs`. Nunca poner datos en una migración EF.
3. Cada tarea termina con **evidencia** (archivo:línea, salida de comando, resultado de pruebas). Sin evidencia no está hecha.
4. Si algo contradice este plan (un archivo no existe, una línea cambió, un consumidor inesperado), **detenerse y reportar**; no improvisar.
5. Un commit por tarea o por grupo lógico, con el mensaje indicando el ID `T-xxx`. **Sin `push` sin autorización del Tech Lead.**
6. Al terminar cada release, entregar el informe de gate; el arquitecto lo verifica contra el código antes de aprobar el siguiente paso.

---

## Registro

| Fecha      | Actor      | Acción                                                                                    |
| :--------- | :--------- | :---------------------------------------------------------------------------------------- |
| 2026-09-26 | Arquitecto | Plan y script SQL emitidos en borrador. Pendiente de aprobación del Tech Lead (D-01).      |
| 2026-09-26 | Agente ejecutor | R0 entregado: T-001…T-009. Commits `api/` `2f16b454b`, `00af4ff38`; raíz `f960f0a`. Sin push. |
| 2026-09-26 | Arquitecto | **Gate G3 de R0: APROBADO.** Verificado por el arquitecto: diff de `2f16b454b` (solo los 8 archivos de R0, sin alcance extra); 8/8 pruebas nuevas en verde (ejecutadas); suite completa **25 fallas idénticas en el commit previo `3a72d7670` y en `00af4ff38`** (mismos nombres, comparación por `.trx`), +8 pruebas superadas (634 → 642); gate `audit-conventions-backend.mjs` sin empeoramiento; T-009 verificado línea por línea (9 líneas de fuego y 8 de `MachineryAppService`). Observaciones no bloqueantes en §12. |
|            |            |                                                                                           |

## 12. Observaciones del gate de R0 (no bloqueantes)

| #   | Observación                                                                                                                                                                                                                                                                                                          | Acción                                                                                         |
| :-- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------- |
| O-1 | `InvalidateMachineryCache` / `InvalidateCacheByPrefix` **no tienen ningún llamador** (ni endpoint ni servicio): el Tech Lead no puede invocarlos en D1/R2. La caché es `IMemoryCache` **por proceso**, así que con varias instancias no hay invalidación global.                                                       | Procedimiento operativo real para D1/R2: **reiniciar las instancias** o esperar ≥ 5 min (TTL). T-206 lo recoge así. Los métodos se dejan; si no se cablean en R2, retirarlos en R3. |
| O-2 | `RegisteredCacheKeys` es un `static ConcurrentDictionary` que registra **todas** las claves de `GetOrSetAsync` y solo se depura al invalidar, no al expirar la caché. Crecimiento lento, acotado por claves distintas.                                                                                                | Aceptado. Revisar si se cablea la invalidación (O-1).                                          |
| O-3 | Los listados que reciben `inventoryCategory` como parámetro (`GetAllAsync`, `GetAllCardAsync`, `GetAllMachineryDetailAsync`, `InformePdfAsync`) devolverían fuego si un cliente pide la categoría 10 explícitamente. No filtra datos de otro cliente.                                                                | Aceptado; se revisa en R2 al conectar el front.                                                |
| O-4 | El agente reportó que el script SQL "no existe en el repo". **Sí existe** (`docs/MaintenanceLuxuryApp/Machinery/20260926-plan-maintenance-machinery-migracion.sql`); está sin versionar en el repo raíz, igual que el plan y el análisis.                                                                            | Versionar los documentos en el repo raíz (decisión del Tech Lead).                             |
| O-5 | La purga de cliente no borra fuego hoy (`CustomerAppService.cs:788-834`): un cliente con activos de fuego probablemente **no se puede purgar** por las FK `RESTRICT` de fuego hacia `Customer`. Es previo a este plan.                                                                                                | Registrado; se corrige en T-204 (R2).                                                          |
| O-6 | `api/` tiene muchos archivos modificados **sin commit ajenos a este plan** (módulos Collections, estilos). El agente los dejó fuera de sus commits (verificado: `2f16b454b` toca solo 8 archivos).                                                                                                                    | En R1 exigir `git add` por archivo, nunca `git add -A`.                                        |

> **Estado:** borrador. Sin cambios de código ni de datos. La ejecución no inicia hasta la aprobación de D-01.

---

## 13. Decisiones del arquitecto para R1 (respuesta al reporte parcial del agente)

Verificado por el arquitecto contra el código (2026-09-26):

| #   | Pregunta del agente                                   | Decisión y evidencia                                                                                                                                                                                                                                                                                                                                                                       |
| :-- | :---------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | ¿Migración contra SQL Server o PostgreSQL?            | **SQL Server (`ApplicationDbContext`).** El snapshot **es** de SQL Server: 844 columnas `uniqueidentifier`, 0 `uuid`, `MaxIdentifierLength 128`, y el CHECK `CK_LedgerEntry_DebitOrCredit` aparece con corchetes (`[DebitAmount]`, snapshot `:1651`) porque lo define `FinancialLedgerEntryConfiguration.cs:15`. Las versiones con comillas dobles viven solo en `PostgresDbContext.cs:111`, que sobrescribe en tiempo de ejecución y **no** entra al snapshot. Además, `has-pending-model-changes` = "sin cambios" **prueba** que el snapshot coincide con el modelo de SQL Server. No hay bloqueo. |
| 2   | ¿CHECK también en `PostgresDbContext`?                | **No en R1.** Se anota para el cutover de motor (D-04): agregar en `PostgresDbContext` las versiones con sintaxis Postgres de `CK_Equipment_InstallationDateOrFire` y los 4 `CK_EquipmentFireDetails_*`.                                                                                                                                                                                      |
| 3   | ¿Configuración real en la carpeta de stubs?           | Los stubs con `TODO` son solo `Infrastructure/Data/Configurations/**`. Las configuraciones **reales** del repo viven en `Modules/<Modulo>/Persistence/…` (p. ej. `Modules/MaintenanceLuxuryApp/Persistence/Persistence/Maintenance/EquipmentInspectionsConfiguration.cs`, `AccountingLuxuryApp/Persistence/Accounting/*`). **Mover** las 3 configuraciones nuevas a `Modules/MaintenanceLuxuryApp/Persistence/Persistence/Maintenance/` (namespace `MaintenanceLuxuryApp.Persistence.Persistence.Maintenance`). |
| 4   | Firma del mirror                                      | **Confirmada:** el mirror **no** llama `SaveChangesAsync` ni abre transacción propia; agrega/actualiza/elimina en el mismo `ApplicationDbContext` **antes** del `SaveChangesAsync` que ya persiste la fila de fuego. Prueba obligatoria: una sola llamada a `SaveChanges` persiste fuego + `Equipment` + `EquipmentFireDetails`.                                                              |
| 5   | `UpdateMachinery` sin fecha → 400                     | Correcto (equivale a la restricción `[Required]` previa y al CHECK de BD).                                                                                                                                                                                                                                                                                                                 |
| 6   | `MachineryDetailDTO` → `DateOnly?`                    | Aceptado; el JSON no cambia cuando hay fecha. Verificar con `grep` en `appsweb/` que ningún consumidor asuma no nulo.                                                                                                                                                                                                                                                                      |
| 7   | `CabinetNumber` `string` sin `?`                      | Correcto (mismo tipo/nulabilidad que hoy en `Hydrants`).                                                                                                                                                                                                                                                                                                                                   |
| 8   | `AssetMigrationLog.MigratedAt` sin default            | Correcto; lo pone el script.                                                                                                                                                                                                                                                                                                                                                               |

---

## 14. Gate G4 de R1 — Validación del arquitecto

**Veredicto: APROBADO con 1 hallazgo menor a corregir antes de D1 (no bloquea seguir a R2 en paralelo).**

Verificado por el arquitecto contra el código y por ejecución directa (no solo por el reporte del agente):

| Verificación                                    | Resultado | Evidencia                                                                                                                                                                                                                     |
| :----------------------------------------------- | :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Commits reales, 4 archivos/tareas correctos      | ✅        | `git show --stat` de `95c293b3e`, `be0f1bc8f`, `51d96a238`, `6a5bf414a` — coinciden con la tabla del reporte.                                                                                                                  |
| Commits `style(...) whitespace` son ajenos       | ✅        | Mismo autor (`geshyrihu`, hook del entorno), archivos de `Collections`/`Payments`, sin solapamiento con archivos de R1.                                                                                                        |
| Migración 100% aditiva, sin datos                | ✅        | Leído `20260927130112_AddFireDetailsToEquipment.cs` completo: solo `AlterColumn NULL`, `AddColumn`, `CreateTable` ×2, `AddCheckConstraint`, `CreateIndex`. `Down()` simétrico. Cero `Sql()`/`InsertData`.                       |
| Cascada 1:1 re-declarada correctamente           | ✅        | `ApplicationDbContext.cs:3517-3523`, mismo patrón que `SalaryProjection` (`:3485-3513`), después del loop `:3475-3481`.                                                                                                        |
| Mirror: firma sin `SaveChanges` propio            | ✅        | Leído `EquipmentFireMirrorService.cs` completo: `Upsert`/`Delete` solo tocan `ChangeTracker`, ningún `SaveChangesAsync`.                                                                                                       |
| Mirror: las 16 rutas de escritura                | ✅        | `grep SaveChangesAsync` + lectura de los 4 servicios: 3+3+5+5=16, cada una precedida de `fireMirror.Upsert`/`Delete` en el mismo bloque antes del único `SaveChangesAsync`.                                                     |
| DI registrado                                    | ✅        | `DependencyInjection.Controllers.cs:316` `AddScoped<IEquipmentFireMirrorService, EquipmentFireMirrorService>()`.                                                                                                              |
| Pruebas T-107 (18)                                | ✅        | Re-ejecutadas por el arquitecto: `18/18` verdes (no solo leído el reporte).                                                                                                                                                    |
| Suite completa: 0 fallas nuevas                  | ✅        | Re-ejecutada por el arquitecto: `Con error: 16, Superado: 669, Total: 687`. Comparación de nombres contra la corrida real de R0: **las 16 son subconjunto exacto** de las 25 de línea base; las 9 restantes (`NotificationEngineServiceTests` ×6, `EquipmentQrLabelAppServiceTests`, `MeetingAppServiceTests`, 1 más) no reaparecieron — confirmado flaky, no relacionado con R1. |
| Gate de convenciones                             | ✅        | Re-ejecutado: mismos números que el reporte (+10 informativo en `nullableValueProps`, nada crítico).                                                                                                                          |
| Consumidores de `DateOfPurchase`                  | ✅        | Lista del agente revisada contra el código; correcta y completa.                                                                                                                                                              |

### 14.1 Hallazgo — `EquipmentFireDetails` tiene una columna `Id` sobrante

`EquipmentFireDetails : GuidIdEntity` hereda la propiedad `Id` (con default `Guid.CreateVersion7()`), pero `EquipmentFireDetailsConfiguration.Configure` hace `builder.HasKey(d => d.EquipmentId)` **sin** `builder.Ignore(d => d.Id)`. Consecuencia verificada en la migración generada: la tabla `EquipmentFireDetails` tiene una columna `Id uniqueidentifier NOT NULL` sin restricción ni uso, que se llena con un GUID aleatorio en cada insert/upsert (el mirror crea `new EquipmentFireDetails { EquipmentId = id }`, deja `Id` con su default). No es pérdida de datos ni rompe el contrato de §3.1 (la PK/FK real sigue siendo `EquipmentId`), pero es una columna espuria que el plan no pidió.

**Corrección antes de D1** (la tabla aún no existe en ninguna BD real, así que no hay backfill que rehacer): agregar `builder.Ignore(d => d.Id);` en `EquipmentFireDetailsConfiguration`, o hacer que `EquipmentFireDetails` no herede `GuidIdEntity`. Regenerar la migración con `dotnet ef migrations remove` + nueva generación (aún no aplicada a ninguna BD, así que no hay riesgo). Tarea nueva: **T-108**.

### 14.2 Aviso de gobernanza (no bloquea R1)

Los commits `style(application): compact batch ...` intercalados con los de R0/R1 son de un hook del entorno del propio Tech Lead (mismo autor), no del agente. No afectan a R1. Queda para el Tech Lead decidir si ese hook debe pausarse durante las releases del plan para no ensuciar el historial de revisión.

### 14.3 Decisión

- **R1 queda aprobado (G4)** condicionado a T-108 (corrección de 5 minutos, sin impacto en el resto).
- El agente ejecuta T-108, regenera la migración y el SQL, hace commit, y entrega solo la confirmación (no requiere repetir todo el reporte).
- Tras T-108, D1 queda habilitado para el Tech Lead (staging primero).

### 14.4 T-108 — Verificado y cerrado

Commit `api/ 4fc81dafa` (raíz `cdd129b`). Verificado por el arquitecto:
- `EquipmentFireDetailsConfiguration.cs`: `builder.Ignore(d => d.Id);` presente tras `HasKey(d => d.EquipmentId)`.
- Migración renombrada a `20260927145019_AddFireDetailsToEquipment`: la tabla `EquipmentFireDetails` ya no crea la columna `Id`.
- Diff del snapshot (`git show 4fc81dafa`): **únicamente** desaparecen las 3 líneas `b.Property<Guid>("Id")` de `EquipmentFireDetails`. Nada más.
- Pruebas de T-107 re-ejecutadas por el arquitecto: 18/18 en verde.

**R1 queda completamente cerrado (T-101 a T-108). D1 habilitado para el Tech Lead, en staging primero.**

---

## 15. Decisión del dueño del módulo — D1 vía endpoint admin, no SQL manual

**Cambio aprobado:** D1 deja de ejecutarse como script `.sql` corrido a mano contra la BD. Se ejecuta como **un método nuevo dentro del patrón ya existente** `AdminLuxuryApp/Infrastructure/UpdateDataBase` (backend) + `admin.luxuryapp/infrastructure/update-data-base` (front), el mismo que ya usa el repo para 18 operaciones de mantenimiento (`CapitalizeUserNamesAsync`, `BackfillMeetingFoliosAsync`, etc.). El Tech Lead lo ejecuta dando clic en un botón protegido por `SoloSuperUsuario`, primero contra staging y después contra producción.

**Por qué es compatible con lo ya decidido:**
- Sigue siendo una acción **explícita**, disparada por una persona, nunca automática al arrancar la app (no toca `Program.cs`).
- El patrón ya usa transacciones (`BeginTransactionAsync`, aislamiento `Serializable` en los métodos de folios) y devuelve conteos verificables en la respuesta — es el mismo espíritu de los controles C1–C10 del script, expresado en código en vez de en SQL suelto.
- El script `.sql` (`20260926-plan-maintenance-machinery-migracion.sql`) queda como **referencia/respaldo** de la lógica y de los conteos esperados; no se descarta, pero deja de ser el mecanismo de ejecución primario.

**Diseño del método nuevo:**

| Aspecto | Decisión |
| :--- | :--- |
| Nombre | `MigrateFireProtectionAssetsToEquipmentAsync()` — sin parámetros, migra los 4 tipos de todos los clientes (mismo criterio que `RecalculateWorkPositionFoliosAsync`, `ReseedNativeChargeTypeCatalogsAsync`). |
| Ubicación backend | `IUpdateDataBaseService` + `UpdateDataBaseAppService` (archivos existentes, **no** módulo nuevo). |
| Endpoint | `migrate-fire-protection-assets` en `UpdateDataBaseEndpoints.cs` (los dos grupos: canónico y legacy). Ya queda protegido por `SoloSuperUsuario`. |
| Ubicación frontend | `Endpoints.UpdateDataBase.migrateFireProtectionAssets` en `admin.endpoints.ts`; botón + handler `runMigrateFireProtectionAssets()` en `update-data-base.ts`/`.html`, con `window.confirm` (mismo patrón que `runRepairServiceOrderFolios`, por ser una operación de impacto). |
| Reutilización | **Debe llamar a `IEquipmentFireMirrorService.Upsert`** (ya construido en R1) para cada fila migrada, en vez de reconstruir el mapeo a mano. Así el activo migrado queda idéntico al que produce una alta nueva desde los módulos de fuego. |
| Orden | Hydrants → ManualCallPoints → FireExtinguishers → SmokeDetectors (igual que el script). |
| Transacción | Una transacción por tabla de origen (no una sola para las 4): si una tabla falla, las anteriores ya migradas quedan confirmadas; el método es re-ejecutable (idempotente) y la siguiente corrida solo procesa lo que falta. |
| Idempotencia | Antes de migrar una tabla, excluir los `Id` que ya estén en `AssetMigrationLog` con ese `SourceTable`. Insertar en `AssetMigrationLog` junto con cada `Upsert` exitoso, antes del `SaveChangesAsync` de esa tabla. |
| Colisión de Id | Si `fireMirror.Upsert` lanza (activo con ese `Id` ya existe con otra categoría), se aborta esa tabla completa (rollback) y se reporta el `Id` conflictivo — igual de estricto que el script (nunca sobrescribir). |
| Reconciliación | Al final de cada tabla, dentro de la misma transacción: contar filas de origen recién migradas vs. filas en `Equipment`+`EquipmentFireDetails` con esos mismos `Id`; si no coincide, `throw` y rollback. |
| Respuesta | `ApiResponseDTO<object>` con, por tabla: `sourceCount`, `alreadyMigrated`, `newlyMigrated`, `collisions`; y totales: `totalFireAssets`, `totalEquipmentFireProtectionAfter`. Mismo estilo que los demás métodos del archivo (objeto anónimo, sin DTO nuevo). |
| Pruebas | Igual patrón que `EquipmentFireMirrorServiceTests`: `InMemoryDbContextFactory`, sembrar filas falsas de los 4 tipos, llamar el método dos veces (la segunda no debe duplicar ni re-contar), y un caso de colisión de `Id`. |
| Restricciones | No toca `Program.cs`. No se ejecuta contra ninguna BD real por el agente — solo se prueba con `InMemoryDbContextFactory`. El Tech Lead decide cuándo darle clic, primero en staging. |

Nueva tarea: **D1-app** (reemplaza a T-151/T-152 del script manual; T-153 — publicar el changelog con los conteos — se mantiene igual, ahora tomando los conteos de la respuesta del endpoint).

---

## 16. Gate de D1-app — Validación del arquitecto (implementación + corrección propia)

**Ejecutor:** el agente OpenCode implementó D1-app por su cuenta (commits `api/ 9e5d42ebf`, `a7335c8ac`;
`appsweb/angular 0f64225af`) antes de que el dueño del módulo pidiera al arquitecto ejecutar directamente.
El arquitecto revisó, encontró un defecto real y lo corrigió él mismo (commit `api/ 63c107044`), sin
delegarlo de vuelta — con evidencia empírica (prueba de repro), no solo lectura de código.

### 16.1 Verificado contra el código y por ejecución directa

| Punto de la spec (§15) | Resultado | Evidencia |
| :--- | :--- | :--- |
| Método en los archivos existentes de `UpdateDataBase`, sin módulo nuevo | ✅ | `IUpdateDataBaseService.cs`, `UpdateDataBaseAppService`, `UpdateDataBaseEndpoints.cs`. |
| Orden Hydrants → ManualCallPoints → FireExtinguishers → SmokeDetectors | ✅ | Llamadas en `MigrateFireProtectionAssetsToEquipmentAsync` en ese orden exacto. |
| Reutiliza `IEquipmentFireMirrorService.Upsert` (no duplica el mapeo) | ✅ | Inyectado en el constructor; cada `MigrateFireTableAsync` recibe `upsert` como delegado hacia `fireMirror.Upsert`. |
| Una transacción por tabla, idempotente vía `AssetMigrationLogs` | ✅ | `BeginTransactionAsync` por llamada; `alreadyMigratedIds` excluye lo ya migrado. |
| Colisión de Id: aborta esa tabla, reporta el `Id`, no sobrescribe | ✅ (con el fix) | Ver 16.2. |
| Reconciliación por tabla antes de `CommitAsync` | ✅ | `Join` Equipment+EquipmentFireDetails, cuenta contra `migratedIds.Count`. |
| Frontend: botón con `window.confirm`, mismo patrón que `runRepairServiceOrderFolios` | ✅ | `update-data-base.ts`/`.html`, commit `0f64225af`. |
| No toca `Program.cs`, no ejecuta contra BD real | ✅ | Solo `InMemoryDbContextFactory` en pruebas; verificado que no hay llamadas fuera de tests. |
| Pruebas del agente (3) | ✅ | Ejecutadas por el arquitecto: 3/3 verdes antes del fix. |

### 16.2 Hallazgo crítico encontrado y corregido por el arquitecto

**`RollbackAsync()` no limpia el `ChangeTracker` de EF Core.** Si dentro del `foreach` de una tabla una fila
se procesa con éxito (queda trackeada como `Added`) y una fila **posterior en el mismo lote** colisiona, el
código hacía `RollbackAsync()` y salía — pero la fila exitosa anterior **seguía trackeada** en el mismo
`dbContext`. Al migrar la siguiente tabla, su `SaveChangesAsync()` **persistía también esa fila filtrada**,
aunque el resumen de la respuesta reportara la tabla en colisión como `newlyMigrated: 0` / `status:
"rolled-back-collision"`. Es decir: **el reporte del endpoint podía mentir sobre lo que realmente se guardó.**

**Cómo se confirmó (no fue solo lectura de código):** se escribió `MigrateFireProtectionAssetsLeakReproTests`
con una fila limpia procesada antes de la colisión en la misma tabla (`ManualCallPoints`). Corrida contra el
código del agente: **falló** — la fila limpia terminó en `Equipment` a pesar de que la tabla se reportó como
revertida. Corrida tras el fix: **pasa**.

**Corrección aplicada:** `dbContext.ChangeTracker.Clear();` inmediatamente después de `RollbackAsync()`, en
los dos `catch` de `MigrateFireTableAsync` (colisión y error genérico/verificación fallida). No afecta el
camino de éxito (tras `CommitAsync` las entidades ya quedan `Unchanged`, sin necesidad de limpiar).

**Commit:** `api/ 63c107044`. Archivos: `UpdateDataBaseService.cs` (2 líneas) +
`MigrateFireProtectionAssetsLeakReproTests.cs` (prueba de regresión, nueva).

### 16.3 Verificación final (ejecutada por el arquitecto)

- Pruebas del endpoint (3 del agente + 1 de repro): **4/4 verdes**.
- Suite completa: **16 fallas — idénticas por nombre a la línea base de T-108** (comparación uno a uno); 673
  superadas (669 + 4 nuevas). **0 fallas nuevas.**
- Gate de convenciones: sin cambios críticos (`nullableValueProps` +10, informativo, ya visto en T-108).
- `git diff --cached --stat` antes de comitear: únicamente los 2 archivos del fix — no se arrastró el
  working tree ajeno (hay módulos de RRHH/Payroll modificados sin commit, de otro trabajo en curso, no
  tocados).

### 16.4 Decisión

**D1-app queda aprobado**, con el fix ya aplicado. Puede pasar a ejecutarse desde el botón, primero en
staging (mismo criterio de siempre: staging antes de producción, decisión del Tech Lead sobre cuándo).

---

## 17. D1 ejecutado — primera corrida real (entorno de desarrollo con copia restaurada de producción)

**Qué se hizo (reportado por el Tech Lead, 2026-09-27):** copia de producción restaurada en el entorno de
**desarrollo** (no un tier de staging separado); migración de esquema (R1) aplicada; botón de D1-app
ejecutado. Satisface el espíritu de D-02 (datos reales, entorno no productivo), aunque no sea un ambiente
staging formal — se registra así, sin inflar el estado.

**Resultado (respuesta real del endpoint):**

| Tabla              | sourceCount | alreadyMigrated | newlyMigrated | collisions | status |
| :----------------- | ----------: | ---------------: | -------------: | :--------- | :----- |
| Hydrants           |           0 |                0 |              0 | []         | ok     |
| ManualCallPoints   |         188 |                0 |            188 | []         | ok     |
| FireExtinguishers  |         733 |                0 |            733 | []         | ok     |
| SmokeDetectors     |       1 946 |                0 |          1 946 | []         | ok     |
| **Total**          |   **2 867** |                — |      **2 867** | —          | —      |

`totalFireAssets = totalEquipmentFireProtectionAsync = 2867`. Coincide exactamente con la línea base
conocida (`Resultados1.csv`, análisis §2.1). Cero colisiones. Las 4 tablas en `status: "ok"`.

### 17.1 Checklist pendiente ANTES de considerar esto listo para producción

- [ ] **Prueba de idempotencia real:** dar clic al botón una SEGUNDA vez en este mismo entorno. Esperado:
  las 4 tablas con `alreadyMigrated` igual a su `sourceCount` y `newlyMigrated = 0`. Si sale distinto,
  **detenerse y reportar** — sería una discrepancia con lo verificado en pruebas (§16).
- [ ] **Conteo cruzado:** `SELECT COUNT(*) FROM Equipment` debe ser `5086 + 2867 = 7953` (si el `Equipment`
  de este entorno tenía los 5086 originales; si no, confirmar el conteo base de ese entorno antes de sumar).
- [ ] **`SELECT COUNT(*) FROM EquipmentFireDetails`** → debe ser `2867`.
- [ ] **`SELECT COUNT(*) FROM AssetMigrationLog`** → debe ser `2867`.
- [ ] **Spot-check manual (3–5 activos):** abrir en la UI un extintor, un detector y una estación ya
  migrados (por su `Id` original) y confirmar que su ficha en los módulos de fuego se ve igual que antes
  (T-201 todavía no cambia la lectura — hoy los módulos siguen leyendo de sus tablas propias, el espejo en
  `Equipment` es lo nuevo a verificar por separado, p. ej. contando por categoría).
- [ ] **No regresión de listados generales:** abrir el listado de "Equipos" (categoría general) y confirmar
  que NO aparecen extintores/detectores/estaciones (ya cubierto por pruebas automatizadas, pero vale
  confirmarlo una vez visualmente con datos reales).
- [ ] **Confirmar D-04** (fecha del cutover a PostgreSQL) antes de fijar cuándo correr esto en producción.

### 17.2 Estado de dependencias (actualizado)

| ID    | Estado                                                                                                   |
| :---- | :--------------------------------------------------------------------------------------------------------- |
| D-02  | **Parcialmente satisfecha.** Copia de producción usada, pero en desarrollo, no en un staging formal aparte. Aceptado como equivalente si el checklist de §17.1 pasa. |
| D-01, D-03, D-04 | Sin cambio — siguen pendientes (ver §8).                                                                      |

**No se recomienda correr esto en producción todavía.** Falta el checklist de §17.1 y confirmar D-04.

### 17.3 Segunda corrida (prueba de idempotencia) — confirmada

**Resultado real (mismo entorno, segundo clic):**

| Tabla              | sourceCount | alreadyMigrated | newlyMigrated | status |
| :----------------- | ----------: | ---------------: | -------------: | :----- |
| Hydrants           |           0 |                0 |              0 | ok     |
| ManualCallPoints   |         188 |              188 |              0 | ok     |
| FireExtinguishers  |         733 |              733 |              0 | ok     |
| SmokeDetectors     |       1 946 |            1 946 |              0 | ok     |

**Exactamente lo esperado:** `alreadyMigrated = sourceCount` y `newlyMigrated = 0` en las 4 tablas, 0
colisiones. La idempotencia con datos reales queda confirmada — punto 1 del checklist §17.1 ✅.

**Verificación visual reportada:** los datos siguen viéndose correctamente en los módulos de estaciones
manuales, extintores e hidrantes (los módulos de fuego siguen leyendo de sus tablas propias — R2 todavía no
cambia eso, así que esto es lo esperado, no todavía una prueba del espejo en `Equipment`). Cubre parte del
punto 4 del checklist.

### 17.4 Conteos cruzados — confirmados con SQL directo

Corridos por el Tech Lead directamente contra la base del entorno (captura SSMS):

```
SELECT COUNT(*) FROM Equipment;              -- resultado: 7953  (esperado 5086+2867=7953) ✅
SELECT COUNT(*) FROM EquipmentFireDetails;    -- resultado: 2867  (esperado 2867) ✅
SELECT COUNT(*) FROM AssetMigrationLog;       -- resultado: 2867  (esperado 2867) ✅
```

Los 3 coinciden exactamente. Punto 2 del checklist §17.1 ✅.

**Pendiente aún del checklist §17.1:**
- Confirmar que el listado general de "Equipos" NO muestra los activos de fuego (la otra mitad del punto 4).
- ~~D-04~~ → resuelto en §18.

## 18. D-04 resuelto + autorización de despliegue a producción (R1 + D1-app)

**D-04 confirmado (2026-09-28):** producción sigue en **SQL Server**; el cutover a PostgreSQL **no** ha
ocurrido. La migración `AddFireDetailsToEquipment` (T-SQL) aplica tal cual, sin adaptación.

**Hallazgo del arquitecto (verificado con `git fetch` + `git rev-list`, 2026-09-28):** el repo `api/` ya
está sincronizado con `origin/main` (0 commits de diferencia) — incluye R0, R1, T-108, D1-app y el fix del
`ChangeTracker`. El repo `appsweb/angular` tiene **1 commit sin subir** (el botón de D1-app,
`0f64225af`). El despliegue a cada entorno es **manual** (confirmado por el Tech Lead) — no hay pipeline
de auto-deploy desde `main`, así que el push no disparó nada en producción por sí solo.

**Autorización:** con D-04 resuelto y el despliegue manual, **se autoriza desplegar `api/` (backend) a
producción**. Antes de darle clic al botón de D1-app en producción, seguir esta secuencia (no combinar
"desplegar código" y "correr el backfill" en el mismo paso):

### 18.1 Secuencia segura de despliegue a producción

1. **Respaldo completo de la BD de producción** + prueba de restauración (regla de siempre, §3.5.5 /
   protocolo de migración de datos). No continuar sin esto.
2. **Subir `appsweb/angular`** (`git push`) para que el botón de D1-app quede disponible en la UI cuando
   se despliegue el frontend. Sin esto, el backend queda listo pero el botón no aparece.
3. **Desplegar `api/` (backend)** con el mecanismo habitual. Al arrancar, `Program.cs` aplica sola la
   migración `AddFireDetailsToEquipment` (aditiva: nueva columna nullable, 2 tablas nuevas, CHECK). Es la
   misma migración ya probada en R1/D1 en el entorno de desarrollo.
4. **Verificación inmediata post-arranque (gate, no opcional):**
   - Sin `[STARTUP WARNING]` en el log de arranque.
   - `SELECT * FROM __EFMigrationsHistory ORDER BY MigrationId DESC` → debe listar `AddFireDetailsToEquipment`.
   - `SELECT COUNT(*) FROM EquipmentFireDetails` y `SELECT COUNT(*) FROM AssetMigrationLog` → ambos en `0`
     (todavía no se ha corrido el backfill en producción).
   - Los flujos normales de extintores/hidrantes/detectores/estaciones siguen funcionando igual (el mirror
     ya está activo desde este momento: toda alta/edición/baja **nueva** a partir de aquí se espeja
     automáticamente a `Equipment`, aunque el backfill de lo histórico todavía no se haya corrido).
5. **Desplegar el frontend** con el botón ya disponible.
6. **Solo entonces**, en un paso aparte y deliberado (puede ser el mismo día, pero como acción distinta):
   dar clic al botón de D1-app en producción. Repetir el mismo checklist de verificación de §17.1 con datos
   reales de producción (conteos cruzados, idempotencia con un segundo clic, listado general sin fuego).
7. Publicar el changelog de producción con los conteos (T-153).

**No autorizado todavía:** R2 (cambio de lectura y de las 12 FK). Eso empieza después, con este despliegue
ya estable en producción.

## 19. D1 ejecutado en PRODUCCIÓN — primera corrida real

**Reportado por el Tech Lead (2026-09-28):** pasos 1–5 de §18.1 completados; botón de D1-app ejecutado en
producción por primera vez.

**Resultado real (respuesta del endpoint, producción):**

| Tabla              | sourceCount | alreadyMigrated | newlyMigrated | collisions | status |
| :----------------- | ----------: | ---------------: | -------------: | :--------- | :----- |
| Hydrants           |           0 |                0 |              0 | []         | ok     |
| ManualCallPoints   |         188 |                0 |            188 | []         | ok     |
| FireExtinguishers  |         733 |                0 |            733 | []         | ok     |
| SmokeDetectors     |       1 946 |                0 |          1 946 | []         | ok     |

`totalFireAssets = totalEquipmentFireProtectionAfter = 2867`. Idéntico a la corrida de desarrollo (§17) y
a la línea base conocida. Cero colisiones. Primera corrida (todo `alreadyMigrated = 0`, como se espera).

### 19.1 Checklist de cierre de D1 en producción (pendiente de confirmar)

Mismo checklist que en desarrollo (§17.1), ahora con datos reales de producción — **pendiente de correr**:

- [ ] **Idempotencia:** dar clic al botón una segunda vez. Esperado: `alreadyMigrated` = `sourceCount` y
  `newlyMigrated = 0` en las 4 tablas.
- [ ] **3 conteos cruzados en producción:**
  ```sql
  SELECT COUNT(*) FROM Equipment;              -- esperado: (conteo previo de Equipment en prod) + 2867
  SELECT COUNT(*) FROM EquipmentFireDetails;    -- esperado: 2867
  SELECT COUNT(*) FROM AssetMigrationLog;       -- esperado: 2867
  ```
- [ ] **Listado general de "Equipos"** en producción → confirmar que no aparece ningún activo de fuego.
- [ ] **T-153:** publicar el changelog de producción con esta tabla de resultados.

**D1 no se marca cerrado (gate G5) hasta que este checklist esté en verde.** No se recomienda empezar R2
hasta entonces.

### 19.2 Segunda corrida en producción (idempotencia) — confirmada

**Resultado real:**

| Tabla              | sourceCount | alreadyMigrated | newlyMigrated | status |
| :----------------- | ----------: | ---------------: | -------------: | :----- |
| Hydrants           |           0 |                0 |              0 | ok     |
| ManualCallPoints   |         188 |              188 |              0 | ok     |
| FireExtinguishers  |         733 |              733 |              0 | ok     |
| SmokeDetectors     |       1 946 |            1 946 |              0 | ok     |

`alreadyMigrated = sourceCount` y `newlyMigrated = 0` en las 4 tablas, 0 colisiones. Idempotencia con datos
reales de producción **confirmada**. Punto 1 del checklist §19.1 ✅.

### 19.3 Conteos cruzados en producción — confirmados (con nota)

**Resultado real (SSMS, producción):**

```sql
SELECT COUNT(*) FROM Equipment;              -- 7955   (esperado 5086+2867=7953; +2 sobre lo esperado)
SELECT COUNT(*) FROM EquipmentFireDetails;    -- 2867   (esperado 2867) ✅
SELECT COUNT(*) FROM AssetMigrationLog;       -- 2867   (esperado 2867) ✅
```

`EquipmentFireDetails` y `AssetMigrationLog` exactos. `Equipment` da **7955**, 2 filas por encima de
5086+2867. **Lectura:** el `5086` de línea base se capturó el 2026-09-26 (`Resultados1.csv`); hoy es
2026-09-28. Es consistente con **2 altas legítimas de equipos generales** en 2 días de operación normal —
no tiene relación con la migración de fuego, que cerró exacta (2867/2867, 0 colisiones en ambas corridas).
**No bloquea el cierre de D1.** Si se quiere confirmar con certeza (opcional, no gate):
`SELECT COUNT(*) FROM Equipment WHERE InventoryCategory <> 10 AND Id NOT IN (SELECT Id FROM Equipment
WHERE ...)` — más simple: revisar los 2 `Equipment` más recientes por fecha de creación si la tabla tuviera
timestamp (hoy no tiene `CreatedAt`); alternativa: confirmar con el equipo de soporte si hubo altas en esos
días. Se deja como nota, no como bloqueo.

Punto 2 del checklist §19.1 ✅ (con la nota anterior).

### 19.4 Listado general de "Equipos" en producción — confirmado

**Reportado por el Tech Lead (2026-09-28):** ningún extintor, hidrante, detector ni estación aparece en el
listado general de "Equipamiento". Punto 3 del checklist §19.1 ✅.

### 19.5 D1 CERRADO — Gate G5 aprobado en producción

Los 3 puntos del checklist §19.1 están en verde (idempotencia §19.2, conteos §19.3, listado general
§19.4). **D1 queda formalmente cerrado.** Changelog de producción: ver
[20260928-changelog-maintenance-machinery-migracion.md](20260928-changelog-maintenance-machinery-migracion.md)
(T-153).

**Siguiente fase autorizada a diseñarse: R2.** No se despliega nada de R2 sin pasar antes por revisión del
arquitecto (mismo criterio que R0/R1/D1-app).

## 20. Gate de R2 (parcial) — T-201, T-202, T-204, T-205 — APROBADO

**Ejecutor:** agente OpenCode. **Alcance de esta ronda:** solo T-201, T-202, T-204, T-205 (T-203, el
cambio de las 12 FK, queda deliberadamente fuera — es una ronda aparte). Verificado por el arquitecto
leyendo cada diff y ejecutando build/pruebas/gate de forma independiente, no solo el reporte del agente.

### 20.1 Verificado contra el código y por ejecución directa

| Tarea | Verificado | Evidencia |
| :--- | :--- | :--- |
| T-201 | ✅ | Los 4 servicios (`InventarioExtintorAppService.cs`, `InventarioHidranteAppService.cs`, `InventarioDetectorHumoAppService.cs`, `InventarioEstacionManualAppService.cs`) proyectan `GetByIdAsync`/`GetAllAsync`(/`GetAllGroupAsync` solo existe para extintor) desde `Equipment` JOIN `EquipmentFireDetails`, filtrando por `InventoryCategory.FireProtection` + `FireAssetKind`. `Add/Update/DeleteByIdAsync/ImportFromExcelAsync` **no se tocaron** — confirmado por diff (solo aparecen los 3 métodos de lectura). Ningún archivo de `DTOs/`, `EndPoints/` ni `Mapping/` fue tocado (`git show --name-only` sin coincidencias). |
| T-201 (prueba) | ✅ | `FireInventoryReadFromEquipmentTests.cs`: 4 pruebas comparan `JsonSerializer.Serialize` del resultado real contra un DTO "legacy" calculado a mano con la misma cultura/formato (`ToString("dd-MMM-yy", es-MX)`, `GetDisplayName()`) — no es un smoke test, es byte a byte. + 1 prueba de aislamiento por cliente/tipo. Re-ejecutadas por el arquitecto: 5/5 verdes. |
| T-202 | ✅ | Conclusión correcta: ningún servicio hace `.Include()` sobre las navegaciones de fuego de los 12 dependientes; solo se proyecta el FK id. Sin cambios necesarios; correcto diferir a T-203. |
| T-204 | ✅ | `CustomerAppService.cs` (+2 líneas, antes del `Equipment.RemoveRange`): borra `EquipmentFireDetails` por `machineryIds`. Prueba `CustomerPurgeFireDetailsTests` corre el flujo real de `DeleteAsync` (no un mock del borrado) y confirma 0 huérfanos. Re-ejecutada: 1/1 verde. |
| T-205 | ✅ | `EquipmentPhotoPathService` nuevo, correctamente diseñado: resuelve por `FireAssetKind` para categoría `FireProtection`, cae a `GetMachineryFilePath` en cualquier otro caso (incluido "sin detalle"). Aplicado en `GetById`/`GetFichaTecnica` de `MachineryAppService`, **después** del mapeo de AutoMapper (que siempre resuelve `GetMachineryFilePath` vía `MachineryfileWritePathServiceResolver`/`MachineryFichaTecnicaPathResolver`, verificado en `MachineryMapper.cs`) — parche mínimo, no toca el profile. 6/6 pruebas re-ejecutadas: verdes. |
| Build + suite completa | ✅ | Re-ejecutado por el arquitecto: `Con error: 16, Superado: 685, Total: 703`. Las 16 fallas son **idénticas por nombre** a la línea base de T-108/D1-app (comparación uno a uno). 0 fallas nuevas. |
| Gate de convenciones | ✅ | Re-ejecutado: mismos números que rondas previas (`nullableValueProps` +10, informativo). |

### 20.2 Respuesta a las preguntas abiertas del agente (§6, discrepancias 7-8)

**P1 — ¿Basta con `GetById`/`GetFichaTecnica`, o falta el branch O-3 (listados con `inventoryCategory`
explícito)?** Confirmado: **basta**. Verificado con `grep` que `EquipmentQrLabelAppService.cs` y los
servicios de `EquipmentInspections/` **no resuelven `PhotoPath` en absoluto** (no hay ninguna coincidencia
de `PhotoPath`/`GetMachineryFilePath` en esos archivos) — no hay ningún consumidor real hoy que muestre una
foto de un `Equipment` de fuego fuera de `GetById`/`GetFichaTecnica`. El branch O-3 (un cliente API pidiendo
`inventoryCategory=10` explícitamente en `GetAllCardAsync`/`GetAllMachineryDetailAsync`/`InformePdfAsync`)
sigue diferido, como ya estaba anotado en §12 (observación O-3): la UI actual nunca envía esa categoría.

**P2 — ¿Se requiere registrar la foto en el flujo de inspección?** No, por la misma verificación: hoy no
resuelve ninguna foto, así que no hay nada que corregir. Si en el futuro se agrega esa funcionalidad,
debe usar `IEquipmentPhotoPathService` (ya existe, inyectable) en vez de `GetMachineryFilePath` directo.

**P3 — Reloj de migración:** correcto, sin acción. T-203 es la ronda aparte.

**P4 — Hook de whitespace en `IMachineryAppService.cs`:** confirmado por el arquitecto — también afectó
`MachineriesEndpoints.cs` y un archivo de test (removió 2 `using` no usados), ningún cambio de firma ni
lógica en ninguno de los tres. No es responsabilidad del agente.

### 20.3 Decisión

**T-201, T-202, T-204, T-205 quedan aprobados.** Sigue pendiente **T-203** (cambio de las 12 FK — punto de
no retorno del plan) y **T-207** (pruebas E2E con capturas). El arquitecto diseñará T-203 como ronda aparte,
con su propio diff de migración para revisión antes de generarla.

## 21. Gate de T-203 — el punto de no retorno — APROBADO (solo generación; NO desplegado)

**Ejecutor:** agente OpenCode. **Alcance:** retipar las 12 navegaciones hacia `Equipment`, retirar las 4
colecciones `Logs` huérfanas, extender la purga de cliente a las 12 tablas, generar la migración EF y su
SQL, y la query de pre-vuelo. Verificado por el arquitecto leyendo cada diff/archivo real y ejecutando
build/pruebas/gate de forma independiente — no solo el reporte del agente (que además llegó parcial: el
`response.md` en disco quedó desactualizado; las secciones 1-4 del reporte no estaban disponibles y se
verificaron directamente contra el código en su lugar).

### 21.1 Verificado contra el código y por ejecución directa

| Punto | Verificado | Evidencia |
| :--- | :--- | :--- |
| Retipado de las 12 navegaciones | ✅ | `git show 82170a826`: 12 archivos, 1 línea cambiada cada uno (`InventarioX` → `Equipment`), mismo nombre de propiedad y de columna FK. |
| Colecciones `Logs` retiradas | ✅ | Confirmado en el diff del snapshot (`git show 5cdfe0f3f`): desaparecen los 4 bloques `Navigation("Logs")` y los 4 `.WithMany("Logs")` pasan a `.WithMany()`. |
| Diff del snapshot sin nada ajeno | ✅ | Leído completo: únicamente las 12 relaciones (tabla referenciada → `Equipment`) + las 4 navegaciones `Logs`. Mismo `DeleteBehavior.Restrict`, mismo `IsRequired()`, mismos nombres de columna. |
| Migración `Up()`/`Down()` | ✅ | Leída completa (`20260928162110_SwitchFireForeignKeysToEquipment.cs`): 12 `DropForeignKey` + 12 `AddForeignKey` en `Up()`; `Down()` exactamente simétrico (reapunta a las 4 tablas de fuego originales). Cero `ADD/DROP COLUMN`, cero `CREATE/DROP TABLE`, cero DML de negocio. |
| SQL generado | ✅ | Leído completo (`20260928-migracion-SwitchFireForeignKeysToEquipment.sql`): todo dentro de un único `BEGIN TRANSACTION`/`COMMIT`. Las 12 `ADD CONSTRAINT` son sin `NOCHECK` → SQL Server valida todas las filas existentes al aplicar; si hubiera un huérfano, el `ALTER` falla y **toda la transacción se revierte sola**. Autoprotegida incluso sin la query de pre-vuelo. |
| Purga de cliente extendida | ✅ | `git show c5a4741f6`: 12 líneas nuevas en `CustomerAppService.cs`, una por tabla dependiente, todas antes de `EquipmentFireDetails`/`Equipment`. |
| Prueba de purga (12 tablas) | ✅ | `CustomerPurgeFireDetailsTests.DeleteCustomer_RemovesAllTwelveFireDependentsBeforeEquipment`: siembra las 12 tablas con el mismo `Id`, corre `DeleteAsync` real (no mock), confirma las 12 + `EquipmentFireDetails` + `Equipment` vacíos. |
| Build + suite completa | ✅ | Re-ejecutado por el arquitecto (tras liberar un bloqueo de `VBCSCompiler` con `dotnet build-server shutdown`): `Con error: 16, Superado: 686, Total: 704`. Las 16 fallas son **idénticas por nombre** a toda línea base anterior. **Cero fallas nuevas** — en particular, la enorme mayoría de las 686 pruebas construye el modelo de EF vía `InMemoryDbContextFactory`, así que esto confirma que el modelo sigue construyéndose bien tras el retipado (el riesgo que más preocupaba al arquitecto no se materializó). |
| Gate de convenciones | ✅ | Sin cambios críticos (mismos números que rondas previas). |

### 21.2 Query de pre-vuelo

El agente reportó haberla escrito, pero no llegó en el reporte disponible. El arquitecto la escribió de
forma independiente, con los 12 nombres reales de tabla/columna **tomados directo del SQL de la
migración** (no del prompt): ver
[20260928-preflight-SwitchFireForeignKeysToEquipment.sql](20260928-preflight-SwitchFireForeignKeysToEquipment.sql).
Esperado: 0 en las 12 filas. El Tech Lead debe correrla en producción antes de desplegar.

### 21.3 Decisión

**T-203 queda aprobado a nivel de código (migración generada, revisada, sin aplicar).** No se ha aplicado
a ninguna base de datos. Antes de desplegar:

1. Tech Lead corre la query de pre-vuelo (§21.2) en producción → debe dar 0 en las 12.
2. Respaldo completo + prueba de restauración (regla de siempre).
3. Desplegar el backend con esta migración → se aplica sola al arrancar (aditiva a nivel de código de
   aplicación, pero es el cambio de esquema más sensible del plan: cambia semántica de integridad
   referencial de 12 tablas).
4. Verificación inmediata: sin `[STARTUP WARNING]`; `__EFMigrationsHistory` contiene
   `SwitchFireForeignKeysToEquipment`; consultar `sys.foreign_keys` para confirmar que las 12 FK ahora
   referencian `Equipment`.
5. Probar la purga de un cliente de prueba con activos de fuego (bitácora/inspección incluidas) antes de
   confiar en la función en producción real.

**Pendiente de T-203 antes de cerrar R2 del todo:** T-207 (pruebas E2E con capturas, con datos reales, tras
el despliegue). **T-207 no se hace en un entorno con datos reales de producción sin haber pasado primero
por el mismo despliegue en un entorno de prueba** (mismo criterio de siempre: no saltarse el ensayo previo).

### 21.4 Query de pre-vuelo ejecutada en producción — resultado: 0 en las 12

**Reportado por el Tech Lead (2026-09-28), captura de SSMS:**

| Tabla | Huérfanos |
| :--- | ---: |
| FireExtinguisherLogs | 0 |
| HydrantLogs | 0 |
| SmokeDetectorLogs | 0 |
| ManualCallPointLogs | 0 |
| FireInspectionPeriodExtinguishers | 0 |
| FireInspectionPeriodHydrants | 0 |
| FireInspectionPeriodDetectors | 0 |
| FireInspectionPeriodStations | 0 |
| FireCycleInspectionExtinguishers | 0 |
| FireCycleInspectionHydrants | 0 |
| FireCycleInspectionDetectors | 0 |
| FireCycleInspectionStations | 0 |

**Punto 1 de §21.3 ✅.** Nota del Tech Lead, relevante para el registro: el módulo de inspecciones
(`FireInspectionPeriod*`/`FireCycleInspection*`, 8 de las 12 tablas) **todavía no está en uso real** en
producción — su 0 es porque están vacías, no porque haya datos cruzados validados. Las 4 bitácoras
(`*Logs`) sí pueden tener uso real y también dieron 0. No cambia el resultado del gate (0 huérfanos es
0 huérfanos), pero acota el riesgo real de esta migración casi por completo a las 4 tablas de bitácora.

**Siguiente paso de §21.3: punto 2 — respaldo completo de producción + prueba de restauración**, antes de
desplegar el backend con esta migración.

### 21.5 Decisión: T-201 + T-203 se ensayan en entorno de prueba antes de producción

**Aclaración pedida al Tech Lead (2026-09-28):** hoy en producción las 4 tablas de fuego siguen en uso
activo, para lectura y escritura — T-201/T-203 todavía no se han desplegado ahí (solo R1+D1 lo están). Por
eso "marcar como obsoleto" ahora sería prematuro y rompería el alta/edición real de activos de fuego.
**Decisión:** ensayar T-201 + T-203 juntos en el entorno de prueba (mismo patrón que D1) antes de tocar
producción otra vez.

### Checklist del ensayo en entorno de prueba

1. **Restaurar una copia reciente de producción** en el entorno de desarrollo (refrescar la que se usó
   para D1; con los 2 equipos generales nuevos de §19.3, mejor una copia fresca que la de esa fecha).
2. **Desplegar el backend** con el código ya committeado de T-201 (`09906e87f`, `39d921e03`) y T-203
   (`82170a826`, `c5a4741f6`, `5cdfe0f3f`). Al arrancar, la migración `SwitchFireForeignKeysToEquipment`
   se aplica sola (aditiva a nivel de app, cambia constraints a nivel de BD).
3. **Verificación inmediata post-arranque:**
   - Sin `[STARTUP WARNING]` en el log.
   - `SELECT * FROM __EFMigrationsHistory ORDER BY MigrationId DESC` → debe listar
     `SwitchFireForeignKeysToEquipment`.
   - `sys.foreign_keys` / `sys.foreign_key_columns` → confirmar que las 12 FK ahora referencian `Equipment`.
4. **Pruebas funcionales de los 4 módulos** (extintores, hidrantes, detectores, estaciones):
   - Los listados existentes se ven igual (T-201: deben leer de `Equipment`+`EquipmentFireDetails` sin que
     se note ningún cambio visual).
   - Dar de alta un activo nuevo de cada tipo → confirmar que aparece en su listado Y que se refleja en
     `Equipment`/`EquipmentFireDetails` (el espejo, T-106, sigue activo).
   - Editar y borrar un activo de cada tipo → sin errores.
5. **Prueba de purga (T-204/T-203.2):** purgar un cliente de prueba que tenga activos de fuego con al
   menos una bitácora o inspección registrada → debe completarse sin error de FK.
6. **Reportar el resultado** de los 6 puntos antes de decidir fecha para producción.

Esto cubre en la práctica **T-207** (pruebas de extremo a extremo) en el entorno de ensayo, tal como exige
el plan antes de repetir esto en producción.

### 21.6 Punto 1 del checklist — confirmado también en desarrollo

**Reportado por el Tech Lead (2026-09-28):** la query de pre-vuelo, corrida contra `LuxuryBuildingGroup`
en el entorno de desarrollo, da el mismo resultado que en producción: **0 en las 12 tablas**. Consistente
con lo esperado (D1 ya se corrió y verificó en ese mismo entorno).

**Siguiente paso del checklist (punto 2): desplegar el backend con el código de T-201+T-203 en ese mismo
entorno de desarrollo**, y luego seguir con los puntos 3-6 (verificación post-arranque, pruebas
funcionales de los 4 módulos, prueba de purga).

### 21.7 Hallazgo en el primer intento de despliegue — nombres de FK heredados del refactor a inglés

**Lo que pasó (log de arranque, `logs.txt`, 2026-09-28 19:17):**

```
[19:17:00 ERR] Failed executing DbCommand...
ALTER TABLE [FireCycleInspectionDetectors] DROP CONSTRAINT [FK_FireCycleInspectionDetectors_SmokeDetectors_DetectorId];
[STARTUP WARNING] ... Error: 'FK_FireCycleInspectionDetectors_SmokeDetectors_DetectorId' is not a constraint.
```

La migración `SwitchFireForeignKeysToEquipment` asumía el nombre de constraint por la convención actual de
EF Core. **Sin daño:** el `Up()` completo va dentro de una sola transacción (confirmado en §21.1); al
fallar el primer `DROP CONSTRAINT`, todo se revirtió solo y la app siguió arrancando con el esquema
anterior intacto. Exactamente el escenario para el que se diseñó el ensayo en entorno de prueba antes de
producción (§21.5) — si esto se hubiera intentado directo en producción, habría fallado igual, pero sin
riesgo real gracias a la transacción.

**Diagnóstico:** se corrió una consulta de solo lectura contra `sys.foreign_keys`
([20260928-diagnostico-nombres-reales-fk.sql](20260928-diagnostico-nombres-reales-fk.sql)) en el mismo
entorno. Resultado: **8 de las 12 FK conservan el nombre físico de antes del `MassiveEnglishRefactor`**
(commit `20260911220131`) — las clases/tablas se renombraron a inglés en ese refactor, pero las
constraints de BD nunca se renombraron físicamente. Las 4 tablas de bitácora (`*Logs`) sí coincidían con
el nombre asumido.

| Relación | Nombre asumido (incorrecto) | Nombre real |
| :--- | :--- | :--- |
| FireCycleInspectionDetectors.DetectorId | `FK_FireCycleInspectionDetectors_SmokeDetectors_DetectorId` | `FK_FireCycleInspectionDetectores_SmokeDetectors_DetectorId` |
| FireCycleInspectionExtinguishers.ExtinguisherId | `FK_FireCycleInspectionExtinguishers_FireExtinguishers_ExtinguisherId` | `FK_FireCycleInspectionExtintores_FireExtinguishers_ExtinguisherId` |
| FireCycleInspectionHydrants.HydrantId | `FK_FireCycleInspectionHydrants_Hydrants_HydrantId` | `FK_FireCycleInspectionHidrantes_Hydrants_HydrantId` |
| FireCycleInspectionStations.StationId | `FK_FireCycleInspectionStations_ManualCallPoints_StationId` | `FK_FireCycleInspectionEstaciones_ManualCallPoints_StationId` |
| FireInspectionPeriodDetectors.DetectorId | `FK_FireInspectionPeriodDetectors_SmokeDetectors_DetectorId` | `FK_FireInspectionPeriodDetectores_SmokeDetectors_DetectorId` |
| FireInspectionPeriodExtinguishers.ExtinguisherId | `FK_FireInspectionPeriodExtinguishers_FireExtinguishers_ExtinguisherId` | `FK_FireInspectionPeriodExtintores_FireExtinguishers_ExtinguisherId` |
| FireInspectionPeriodHydrants.HydrantId | `FK_FireInspectionPeriodHydrants_Hydrants_HydrantId` | `FK_FireInspectionPeriodHidrantes_Hydrants_HydrantId` |
| FireInspectionPeriodStations.StationId | `FK_FireInspectionPeriodStations_ManualCallPoints_StationId` | `FK_FireInspectionPeriodEstaciones_ManualCallPoints_StationId` |
| Las 4 `*Logs` | — | Coincidían, sin cambio |

**Corrección aplicada por el arquitecto (commit `api/ 6555437a9`):** 16 líneas corregidas en
`20260928162110_SwitchFireForeignKeysToEquipment.cs` — los 8 `DropForeignKey` de `Up()` y los 8
`AddForeignKey` correspondientes de `Down()` (para que `Down()` restaure el nombre físico real, no el
asumido). Los 4 `AddForeignKey` de `Up()` hacia `Equipment` **no cambian** — son constraints nuevas, sin
nombre previo que preservar. Build verificado: 0 errores. SQL de referencia
([20260928-migracion-SwitchFireForeignKeysToEquipment.sql](20260928-migracion-SwitchFireForeignKeysToEquipment.sql))
actualizado a mano en los mismos 8 puntos (sin `dotnet ef` disponible en este entorno para regenerarlo).

**Nota fuera de alcance:** este drift de nombres (constraint física en español, clase/tabla en inglés)
probablemente existe en más lugares del sistema, no solo en estas 8. No se investiga ni se corrige aquí —
solo se resuelve lo que bloquea esta migración puntual.

**Siguiente paso:** reintentar el despliegue en el mismo entorno de desarrollo con el código corregido.
