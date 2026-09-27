# Mapa — qué borra hoy la purga de cliente respecto de activos de contra incendio (T-007)

> **Tipo:** informe de solo lectura (R0, T-007). **No se cambió código.**
> **Fecha:** 2026-09-26
> **Módulo:** `AdminLuxuryApp` / `Customers` (purga) · consumidores de `Equipment` (MaintenanceLuxuryApp)
> **Archivo auditado:** `api/LuxuryApp.Application/Modules/AdminLuxuryApp/Customers/Customers/Services/CustomerAppService.cs`

## 1. Conclusión

**La purga de cliente NO elimina hoy ningún dato de los 4 inventarios de contra incendio ni de sus
dependentes.** Tampoco elimina las filas de fuego porque esas tablas no se referencian en el flujo de
borrado. El único vínculo con fuego es un nombre en una lista de strings que **no tiene `case`** en el
`switch` que la consume, por lo que es inerte.

Consecuencia para el plan: tras R2 (fuego dentro de `Equipment`) el borrado de `Equipment` por cliente
fallará por FK `RESTRICT` de los 12 dependentes de fuego, salvo que T-204 agregue su borrado **antes**
de `Equipment` (`RN-MAQ-021`).

## 2. Mapa archivo:línea

| Ubicación | Qué hace | ¿Toca fuego? |
| :--- | :--- | :---: |
| `CustomerAppService.cs:415-430` | Region 1.10: por `machineryIds` (todos los `Equipment` del cliente, `:417-420`) borra dependientes existentes: `LightingStock` (`:424`), `PaintStock` (`:425`), `MaintenanceLogs` (`:426`), `ElevatorSparePartsChanges` (`:427`), `ElevatorsEmergencyCall` (`:428`), `EquipmentDocuments` (`:429`). | No |
| `CustomerAppService.cs:445-448` | `Equipment.RemoveRange(machineryToDelete)` + `SaveChangesAsync`. Es el borrado masivo de activos. | No (solo `Equipment`) |
| `CustomerAppService.cs:788-794` | Arreglo `directTables` (strings) que incluye `"InventarioExtintor"` (`:792`). | Solo como string |
| `CustomerAppService.cs:796-834` | `foreach` + `switch (table)` que consume `directTables`. **No existe `case "InventarioExtintor"`** ni ningún `case` para `FireExtinguishers`, `Hydrants`, `SmokeDetectors` o `ManualCallPoints`. | No |
| `grep` en `CustomerAppService.cs` de `FireExtinguisher\|Hydrant\|SmokeDetector\|ManualCallPoint` | Única coincidencia: la cadena `"InventarioExtintor"` en `:792`. No hay `DbSet` de fuego ni borrado por cliente. | No |

## 3. Lo que sí borra respecto de `Equipment`

Todo lo que hoy cuelga de `Equipment` por `MachineryId` (11 FK entrantes) se borra explícitamente
cuando aplica; el listado real en la purga es el de la tabla anterior (`LightingStock`, `PaintStock`,
`MaintenanceLogs`, `ElevatorSparePartsChanges`, `ElevatorsEmergencyCall`, `EquipmentDocuments`). No
se enumeran aquí las demás FK entrantes (`MaintenanceCalendar`, `ServiceOrder`, `EquipmentQrLabel`,
`EquipmentInspection*`), que la purga resuelve en otras regiones del mismo método.

## 4. Riesgo para R2 (T-204)

- Los 12 dependientes de fuego apuntan a las tablas de fuego con `ON DELETE RESTRICT` (análisis §2.3).
  Cuando en R2 pasen a apuntar a `Equipment(Id)`, el `Equipment.RemoveRange` de `:445-446` fallará
  mientras existan filas dependientes.
- La purga debe incorporar el borrado de los 12 dependientes y de `EquipmentFireDetails` antes de
  `Equipment`, y de las 4 filas de fuego (espejo) según corresponda.

## 5. Registro

| Fecha | Actor | Acción |
| :--- | :--- | :--- |
| 2026-09-26 | Agente ejecutor (R0) | Mapa de purga entregado (T-007). Solo lectura; sin cambios de código. |
