# Changelog de Migración — D1 (activos de contra incendio → `Equipment`)

**Tarea del plan:** T-153. **Plan:** [20260926-plan-maintenance-machinery.md](20260926-plan-maintenance-machinery.md) §17–19.
**Fecha de ejecución en producción:** 2026-09-28. **Ejecutor:** Tech Lead, vía endpoint admin
`POST admin/system-maintenance/migrate-fire-protection-assets` (botón "Migrar activos de contra incendio a
Equipment" en `Mantenimiento de Base de Datos`). **Tipo:** backfill idempotente, sin pérdida de datos —
copia, no mueve; las 4 tablas de origen quedan intactas.

---

## 1. Resumen

| Entorno                                             | Fecha      | Resultado                              |
| :--------------------------------------------------- | :--------- | :-------------------------------------- |
| Desarrollo (copia restaurada de producción, 2026-09-26) | 2026-09-27 | 2867 migrados, 0 colisiones, idempotencia confirmada (2ª corrida) |
| **Producción**                                      | 2026-09-28 | 2867 migrados, 0 colisiones, idempotencia confirmada (2ª corrida) |

## 2. Resultado de la primera corrida en producción

| Tabla              | sourceCount | alreadyMigrated | newlyMigrated | collisions | status |
| :----------------- | ----------: | ---------------: | -------------: | :--------- | :----- |
| Hydrants           |           0 |                0 |              0 | []         | ok     |
| ManualCallPoints   |         188 |                0 |            188 | []         | ok     |
| FireExtinguishers  |         733 |                0 |            733 | []         | ok     |
| SmokeDetectors     |       1 946 |                0 |          1 946 | []         | ok     |

`totalFireAssets = totalEquipmentFireProtectionAfter = 2867`.

## 3. Resultado de la segunda corrida (prueba de idempotencia)

| Tabla              | sourceCount | alreadyMigrated | newlyMigrated | status |
| :----------------- | ----------: | ---------------: | -------------: | :----- |
| Hydrants           |           0 |                0 |              0 | ok     |
| ManualCallPoints   |         188 |              188 |              0 | ok     |
| FireExtinguishers  |         733 |              733 |              0 | ok     |
| SmokeDetectors     |       1 946 |            1 946 |              0 | ok     |

Confirma que el botón es seguro de repetir: nada se duplica ni se sobrescribe.

## 4. Verificación post-migración (checklist §19.1)

| Verificación                                                   | Resultado                                                                                   |
| :--------------------------------------------------------------- | :-------------------------------------------------------------------------------------------- |
| Idempotencia (2ª corrida)                                       | ✅ `newlyMigrated = 0` en las 4 tablas                                                        |
| `SELECT COUNT(*) FROM Equipment`                                 | **7955** (línea base 5086 del 2026-09-26 + 2867 migrados = 7953; +2 por altas normales de equipos generales entre el 26 y el 28 de septiembre, sin relación con esta migración) |
| `SELECT COUNT(*) FROM EquipmentFireDetails`                      | **2867** ✅ (exacto)                                                                          |
| `SELECT COUNT(*) FROM AssetMigrationLog`                         | **2867** ✅ (exacto)                                                                          |
| Listado general de "Equipos" / "Equipamiento"                    | ✅ Ningún extintor, hidrante, detector ni estación aparece ahí                                |

## 5. Estado de las tablas de origen

`FireExtinguishers` (733), `Hydrants` (0), `SmokeDetectors` (1946), `ManualCallPoints` (188): **sin
cambios**. Ningún registro fue movido, editado ni borrado. Siguen siendo la fuente de lectura de los 4
módulos de fuego (R2 es lo que cambiará esto).

## 6. Efecto colateral activo desde el despliegue de R1+D1-app en producción

Desde que este código quedó desplegado, el **espejo** (`EquipmentFireMirrorService`, T-106) queda activo:
toda alta, edición o baja **nueva** en los 4 módulos de fuego se refleja automáticamente en `Equipment` +
`EquipmentFireDetails`, además de guardarse en su tabla de origen como siempre. Esto es intencional y ya
estaba probado (R1, gate G4).

## 7. Rollback disponible

Antes de la migración de FK (R2, todavía no autorizada), el rollback de este backfill es: borrar por
`AssetMigrationLog` las filas con `TargetId` correspondiente, y las filas de `Equipment` /
`EquipmentFireDetails` con `InventoryCategory = 10`. Las 4 tablas de origen nunca se tocaron, así que no
hay pérdida posible en este rollback. Ver plan §6.4 / §3.5.5.

## 8. Siguiente paso

R2: cambio de lectura de los 4 módulos hacia `Equipment` + reapuntar las 12 FK. Requiere diseño y revisión
del arquitecto antes de cualquier despliegue (plan §4, backlog R2, T-201–T-208).

---

## Registro

| Fecha      | Actor      | Acción                                                                          |
| :--------- | :--------- | :------------------------------------------------------------------------------- |
| 2026-09-28 | Tech Lead  | D1 ejecutado en producción (1ª y 2ª corrida) + verificación completa.            |
| 2026-09-28 | Arquitecto | Changelog publicado; D1 marcado cerrado (gate G5) en el plan §19.5.              |
