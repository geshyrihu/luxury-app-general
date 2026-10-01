# Prompt 10 — Fase 6: módulo `operations.luxuryapp` (73 archivos)

Mismo procedimiento que los lotes anteriores (`legal`, `supplier`,
`collections`, `maintenance`, `accounting`): usar
`scripts/migrate-p-table-standard.mjs` en modo `--write` sobre el lote
estándar, más 1 archivo manual y 22 exclusiones catalogadas.

## 1. Lote automático — 50 archivos vía script

```
node scripts/migrate-p-table-standard.mjs --write \
  src/app/modules/operations.luxuryapp/announcements/announcement/announcement-admin-list.html \
  src/app/modules/operations.luxuryapp/custom-documents/custom-document/acta-constitutiva-list.html \
  src/app/modules/operations.luxuryapp/dashboard/unified-pending-dashboard.html \
  src/app/modules/operations.luxuryapp/diagrams/diagram/diagram-list/diagram-list.html \
  src/app/modules/operations.luxuryapp/field-service/service-order/ordenes-servicio-reporte-proveedor.html \
  src/app/modules/operations.luxuryapp/field-service/service-order/resumen-ordenes-servicio.html \
  src/app/modules/operations.luxuryapp/google-calendar/google-calendar/google-calendar.html \
  src/app/modules/operations.luxuryapp/incidencias-sanciones/incident/incident-attachments/incident-attachments.html \
  src/app/modules/operations.luxuryapp/incidencias-sanciones/incident/incident-dashboard/incident-dashboard.html \
  src/app/modules/operations.luxuryapp/incidencias-sanciones/incident/incident-list.html \
  src/app/modules/operations.luxuryapp/incidencias-sanciones/incident/incident-witnesses/incident-witnesses.html \
  src/app/modules/operations.luxuryapp/incidencias-sanciones/incident/suspension-days-manager/suspension-days-manager.html \
  src/app/modules/operations.luxuryapp/incidencias-sanciones/sanction/sanction-list.html \
  src/app/modules/operations.luxuryapp/inventarios-y-almacn/fire-extinguisher-inventory/inventario-extintor.html \
  src/app/modules/operations.luxuryapp/inventarios-y-almacn/hydrant-inventory/inventario-hidrante.html \
  src/app/modules/operations.luxuryapp/inventarios-y-almacn/key-inventory/inventario-llaves-list.html \
  src/app/modules/operations.luxuryapp/inventarios-y-almacn/manual-call-point-inventory/inventario-estacion-manual.html \
  src/app/modules/operations.luxuryapp/inventarios-y-almacn/product-entry/product-entry-list.html \
  src/app/modules/operations.luxuryapp/inventarios-y-almacn/product-exit/product-output-list.html \
  src/app/modules/operations.luxuryapp/inventarios-y-almacn/radio-communication-inventory/radio-comunicacion-list.html \
  src/app/modules/operations.luxuryapp/inventarios-y-almacn/smoke-detector-inventory/inventario-detector-humo.html \
  src/app/modules/operations.luxuryapp/inventarios-y-almacn/stock-por-almacen/warehouse-stock-add.html \
  src/app/modules/operations.luxuryapp/inventarios-y-almacn/stock-por-almacen/warehouse-stock-list.html \
  src/app/modules/operations.luxuryapp/inventarios-y-almacn/warehouse/warehouse-list.html \
  src/app/modules/operations.luxuryapp/properties/entrega-recepcion-check/entrega-recepcion-check.html \
  src/app/modules/operations.luxuryapp/reports/contracts-policies/contracts-policies.html \
  src/app/modules/operations.luxuryapp/reports/estados-financieros/estados-financieros.html \
  src/app/modules/operations.luxuryapp/reports/mantenimiento-presupuesto/gastos-mantenimiento.html \
  src/app/modules/operations.luxuryapp/reports/pending-minutes/pending-minutes.html \
  src/app/modules/operations.luxuryapp/supervision/supervision/agenda-supervision/agenda-supervision.html \
  src/app/modules/operations.luxuryapp/supervision/supervision/filtro-minutas-area/filtro-minutas-area.html \
  src/app/modules/operations.luxuryapp/supervision/supervision/minutas-resumen/minutas-resumen.html \
  src/app/modules/operations.luxuryapp/supervision/supervision/presentaciones-juntas-comite/presentaciones-juntas-comite.html \
  src/app/modules/operations.luxuryapp/supervision/supervision/reporte-tickets/reporte-tickets.html \
  src/app/modules/operations.luxuryapp/supervision/supervision/resultado-general-dashboard/resultado-general-dashboard.html \
  src/app/modules/operations.luxuryapp/supervision/supervision/resultado-general-evaluacion-areas/resultado-general-evaluacion-areas-detalle.html \
  src/app/modules/operations.luxuryapp/supervision/supervision/resultado-general-evaluacion-areas/resultado-general-evaluacion-areas.html \
  src/app/modules/operations.luxuryapp/supervision/supervision/resultado-general-posicion/resultado-general-posicion.html \
  src/app/modules/operations.luxuryapp/task-engine/recurring-tasks/catalog/recurring-task-catalog-list/recurring-task-catalog-list.html \
  src/app/modules/operations.luxuryapp/task-engine/recurring-tasks/compliance/recurring-task-compliance-dashboard/recurring-task-compliance-dashboard.html \
  src/app/modules/operations.luxuryapp/task-engine/recurring-tasks/instances/task-instance-list/task-instance-list.html \
  src/app/modules/operations.luxuryapp/task-engine/recurring-tasks/templates/task-template-list/task-template-list.html \
  src/app/modules/operations.luxuryapp/task-engine/tasks/my-tasks/my-assigned-tasks-list.html \
  src/app/modules/operations.luxuryapp/task-engine/tasks/my-tasks/my-requests-task.html \
  src/app/modules/operations.luxuryapp/task-engine/tasks/reports/task-operation-report.html \
  src/app/modules/operations.luxuryapp/task-engine/tasks/reports/task-report-resumen.html \
  src/app/modules/operations.luxuryapp/task-engine/tasks/reports/task-report-work-plan.html \
  src/app/modules/operations.luxuryapp/task-engine/tasks/send-operation-report/send-operation-report-web.html \
  src/app/modules/operations.luxuryapp/task-engine/tasks/task-message/task-list.html \
  src/app/modules/operations.luxuryapp/templates/templates-list.html
```

(⚠️ ojo con el nombre: en esa misma carpeta hay dos archivos
parecidos — `task-report-work-plan.html` (arriba, sí se migra con el
script) y `task-report-work-plan-preview.html` (tiene `rowGroupMode`,
va en la lista de exclusión del punto 4, **no** lo toques aquí).
Confirma que el script procesó el que **no** lleva `-preview`.)

Espera **50 archivos transformados, 0 exclusiones, 0 advertencias**
(ya validado con un dry-run de esta misma lista). 2 de los 50 tienen
`p-sorticon` de cierre separado (`unified-pending-dashboard.html` y
`diagram-list.html`) — el script ya sabe normalizarlos, no hace falta
nada especial de tu parte.

## 2. Manual — 1 archivo con tag de cierre partido en dos líneas

```
src/app/modules/operations.luxuryapp/task-engine/recurring-tasks/instances/daily-task-list/daily-task-list.html
```

El script lo excluye con advertencia ("p-table desbalanceado") porque
su cierre está escrito así:

```html
        </ng-template></p-table
      >
```

El `>` de cierre está en la línea siguiente — el regex del script
busca `</p-table>` junto, así que no lo toca (correcto, evita romper
el archivo). Edítalo a mano, mismo criterio que el script:

```diff
-      <p-table
+      <app-table
```
```diff
-        </ng-template></p-table
+        </ng-template></app-table
      >
```

También tiene `<ng-template emptymessage>` **sin** `#` (línea 57) —
igual que otros casos ya vistos, corrígelo a `<ng-template
#emptymessage>`.

En el `.ts` (`daily-task-list.ts`), el import es el patrón exacto
estándar:

```diff
+import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";
```

y en el array `imports:` reemplaza `TableModule,` por las 3 líneas
`AppTable,` / `AppSortableColumn,` / `AppSorticon,`.

## 3. No tocar — 2 archivos huérfanos (dead code, sin `.ts` que los use)

```
src/app/modules/operations.luxuryapp/task-engine/tasks/my-tasks/my-tasks-list.html
src/app/modules/operations.luxuryapp/task-engine/tasks/send-operation-report/send-operation-report.html
```

Confirmado con `grep` en todo `src/app`: ningún `.ts` tiene
`templateUrl` apuntando a ninguno de los dos.
`send-operation-report.ts` (mismo folder) usa **template inline**
propio (`<app-send-operation-report-web />` +
`<app-send-operation-report-mobile />`), no este archivo.
`my-tasks-list.ts` no existe en absoluto — solo el `.html` quedó
huérfano. Mismo patrón que `cedula-cliente-list.html` y
`cobranza-online-resumen.bak.html` de lotes anteriores: no se tocan.

## 4. No tocar en este lote — 20 archivos con atributos que `AppTable` no soporta todavía

**No los tomes al pie de la letra como "hazlos después en otro
prompt"** — quedan catalogados para una fase de diseño aparte, no
tienen fecha. Son:

- **1 con `pTemplate=`** (mismo caso ya visto en otros módulos):
  `reports/report-meeting/report-meeting.html`
- **4 con `[reorderableColumns]`** (reordenar columnas arrastrando):
  `custom-documents/custom-document/asambleas-list.html`,
  `custom-documents/custom-document/reglamentos-list.html`,
  `custom-documents/custom-document/special-document-list.html`,
  `task-engine/recurring-tasks/templates/task-template-items/task-template-items.html`
- **15 con `rowGroupMode="subheader"`** (agrupar filas bajo
  subencabezados, ej. por clasificación o cuenta padre) — **hallazgo
  nuevo de este lote**, ver punto 5 abajo:
  `custom-documents/custom-document/policy-contract/policy-contract-list.html`,
  `field-service/service-order/ordenes-servicio-list.html`,
  `google-calendar/calendar/listado-anual-mantenimiento/listado-anual-mantenimiento.html`,
  `google-calendar/calendar/mantenimiento-preventivo/cronograma-anual-mantenimiento.html`,
  `google-calendar/calendar/mantenimiento-preventivo/cronograma-completo-status-dialog.html`,
  `properties/entrega-recepcion/entrega-recepcion-equipos.html`,
  `properties/entrega-recepcion/entrega-recepcion-herramientas.html`,
  `properties/entrega-recepcion/entrega-recepcion-hidrantes.html`,
  `properties/entrega-recepcion/entrega-recepcion-instalaciones.html`,
  `properties/entrega-recepcion/entrega-recepcion-insumos.html`,
  `properties/entrega-recepcion/entrega-recepcion-llaves.html`,
  `properties/entrega-recepcion-cliente/entrega-recepcion-cliente.html`,
  `staff-board/staff-board-list.html`,
  `task-engine/tasks/reports/task-report-work-plan-preview.html`
  (⚠️ ojo: es otro archivo distinto al de la lista automática con
  nombre parecido — confirma la ruta exacta),
  `work-position/work-position-list.html`

## 5. Hallazgo — no requiere acción tuya, solo para que quede registrado

`AppTable` no implementa `rowGroupMode`/`groupRowsBy` (agrupación de
filas). Se confirmó que **8 archivos ya migrados en lotes anteriores**
(`accounting-catalog.html`, `asunto-legal-lista.html`,
`legal-staff-board.html`, `charge-template-coverage.html`,
`member-list.html`, `task-group-category-list.html`,
`equipos-list.html`, `mis-inspecciones-ejecutar.html`) tienen este
atributo y probablemente perdieron el agrupamiento visual (las filas
se muestran planas, sin el subencabezado que las separaba por grupo).
El usuario ya decidió: **se documenta y difiere**, no se revierte ni
se repara ahora — mismo trato que columnas congeladas/selección/
reordenar. **No toques esos 8 archivos.** Los 15 nuevos de este
módulo se quedan igual, en `p-table`, hasta que se diseñe soporte de
agrupación en `AppTable`.

## Verificación

- `npx tsc --noEmit` limpio.
- `ng build` (o `ng serve` si ya está corriendo) sin errores AOT
  nuevos.
- `git diff --stat`: debe mostrar 50 (script) + 1 (manual) = 51 `.html`
  y 51 `.ts` tocados (algunos módulos comparten `-moduls.ts`, revisa
  si aplica aquí — en este lote no se detectó ningún caso de import
  indirecto tipo `accounting.luxuryapp`).
- Capturas reales (archivo en disco, no solo texto) de al menos 6-8
  pantallas representativas de carpetas distintas: por ejemplo
  `incident-list`, `warehouse-list`, `task-instance-list`,
  `resultado-general-dashboard`, `daily-task-list` (el manual),
  `templates-list`. Confirma ordenar por una columna y paginar en al
  menos 2 de ellas.

## Listo cuando

- 51 archivos migrados (50 automáticos + 1 manual), verificados.
- 22 archivos sin tocar (20 catalogados + 2 huérfanos), confirmado que
  siguen en `p-table` o sin uso.
- `tsc`/build limpios, capturas reales adjuntas.
- Con esto, el rollout llega a **217 de 336 archivos** (166 previos +
  51 de este lote).
