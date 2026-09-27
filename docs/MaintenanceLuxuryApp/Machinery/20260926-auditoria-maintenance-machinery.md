# Auditoría — operaciones por Id sin `CustomerId` en módulos de fuego y `MachineryAppService` (T-009)

> **Tipo:** informe de solo lectura (R0, T-009). **No se corrigió código** (fuera de alcance de este plan).
> **Fecha:** 2026-09-26
> **Módulo:** `MaintenanceLuxuryApp` (Machinery + los 4 inventarios de contra incendio)
> **Hallazgo relacionado:** análisis §11.4-3 y §2 de `20260926-analisis-equipment-unico-y-control-de-datos.md` (deuda previa).

## 1. Conclusión

Las **operaciones por Id** (GetById / Update / Delete / carga de documentos) no filtran por
`CustomerId`. Un usuario autenticado de un cliente puede operar sobre un activo de otro cliente
conociendo su `Guid`. Es **deuda previa** (no la introduce este plan) y **no se corrige** aquí
(`RN-MAQ-023`). Los métodos de listado sí filtran por `CustomerId`.

## 2. Módulos de contra incendio

| Archivo | Línea | Método | Consulta | Filtra `CustomerId` |
| :--- | :--- | :--- | :--- | :---: |
| `FireExtinguisherInventory/Services/InventarioExtintorAppService.cs` | 27 | `GetByIdAsync` | `dbContext.FireExtinguishers.FindAsync(id)` | No |
| idem | 159 | `UpdateAsync` | `FirstOrDefaultAsync(x => x.Id == id)` | No |
| idem | 197 | `DeleteByIdAsync` | `FindAsync(id)` | No |
| `HydrantInventory/Services/InventarioHidranteAppService.cs` | 23 | `GetByIdAsync` | `dbContext.Hydrants.FindAsync(id)` | No |
| idem | 103 | `UpdateAsync` | `FirstOrDefaultAsync(x => x.Id == id)` | No |
| idem | 143 | `DeleteByIdAsync` | `FindAsync(id)` | No |
| `SmokeDetectorInventory/Services/InventarioDetectorHumoAppService.cs` | 25 | `GetByIdAsync` | `dbContext.SmokeDetectors.FindAsync(id)` | No |
| idem | 103 | `UpdateAsync` | `FirstOrDefaultAsync(x => x.Id == id)` | No |
| idem | 143 | `DeleteByIdAsync` | `FindAsync(id)` | No |
| `ManualCallPointInventory/Services/InventarioEstacionManualAppService.cs` | 25 | `GetByIdAsync` | `dbContext.ManualCallPoints.FindAsync(id)` | No |
| idem | 103 | `UpdateAsync` | `FirstOrDefaultAsync(x => x.Id == id)` | No |
| idem | 143 | `DeleteByIdAsync` | `FindAsync(id)` | No |

Métodos que **sí** filtran por cliente (referencia, sin hallazgo): `GetAllAsync` / `GetAllGroupAsync`
en los 4 servicios; `DeleteAllByCustomerAsync` e `ImportFromExcelAsync` en DetectorHumo y
EstaciónManual.

## 3. `MachineryAppService`

| Línea | Método | Consulta | Filtra `CustomerId` |
| :--- | :--- | :--- | :---: |
| 157 | `GetById` | `FirstOrDefaultAsync(x => x.Id == id)` | No |
| 169 | `GetFichaTecnica` | `Include(...).FirstOrDefaultAsync(x => x.Id == id)` | No |
| 341 | `GetMachinerySelectItemAsync` | `FindAsync(id)` | No |
| 373 | `UpdateAsync` | `FirstOrDefaultAsync(x => x.Id == id)` | No |
| 411 | `DeleteAsync` | `FindAsync(id)` | No |
| 473 | `SubirDocumentoAsync` | `FirstOrDefaultAsync(x => x.Id == machineryId)` | No |
| 509 | `DeleteDocumentAsync` | `EquipmentDocuments.FirstOrDefaultAsync(x => x.Id == id)` | No |
| 513 | `DeleteDocumentAsync` | `Equipment.FirstOrDefaultAsync(x => x.Id == machineryDocument.MachineryId)` | No |

## 4. Nota de numeración

El plan citó para `MachineryAppService` las líneas `157,169,337,365,403,487`. Tras las tareas R0
(T-001 eliminó `UpdateCategoryAsync` y T-003 agregó validaciones) las líneas reales son las de la
§3 de este informe. El contenido de cada hallazgo es el mismo.

## 5. Recomendación (no ejecutada)

En un ticket aparte (post-R2 o T-204), añadir `&& x.CustomerId == customerId` a las consultas por Id
listadas, o validar el `CustomerId` tras cargar la entidad. No se hace en R0 por `RN-MAQ-023`.

## 6. Registro

| Fecha | Actor | Acción |
| :--- | :--- | :--- |
| 2026-09-26 | Agente ejecutor (R0) | Auditoría de operaciones por Id sin `CustomerId` entregada (T-009). Solo informe. |
