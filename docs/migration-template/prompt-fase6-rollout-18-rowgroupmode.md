# Prompt 18 — Fase 6: rollout de `rowGroupMode` (agrupación de filas), 26 archivos

`AppTable` ahora soporta agrupación de filas (`rowGroupMode="subheader"`):
nuevos inputs/templates `groupRowsBy`, `#groupheader`, `#groupfooter`,
implementados y verificados con `tsc`/`ng build` limpios (incluyendo
los 8 archivos ya migrados antes que tenían estos atributos como
markup muerto — ahora deberían agrupar solos, sin que se les toque
nada).

Este lote cruza varios módulos porque agrupa por **atributo especial**,
no por carpeta — son los 26 archivos con `rowGroupMode` que quedaron
excluidos en sus respectivos lotes anteriores (`admin`, `management`,
`operations`, `purchases`, `recruitment`).

## 1. Lote automático — 25 archivos vía script

```
node scripts/migrate-p-table-standard.mjs --write \
  src/app/modules/admin.luxuryapp/configuracion-correo/customer-data-company/customer-data-company-list.html \
  src/app/modules/admin.luxuryapp/seguridad-permisos/application-role/roles-list.html \
  src/app/modules/admin.luxuryapp/seguridad-permisos/module-app-rol/module-app-rol-list.html \
  src/app/modules/admin.luxuryapp/seguridad-permisos/module-app/module-app-list.html \
  src/app/modules/management.luxuryapp/juntas-comite/junta-comite-minutas/meeting-detail-form.html \
  src/app/modules/operations.luxuryapp/custom-documents/custom-document/policy-contract/policy-contract-list.html \
  src/app/modules/operations.luxuryapp/field-service/service-order/ordenes-servicio-list.html \
  src/app/modules/operations.luxuryapp/google-calendar/calendar/listado-anual-mantenimiento/listado-anual-mantenimiento.html \
  src/app/modules/operations.luxuryapp/google-calendar/calendar/mantenimiento-preventivo/cronograma-anual-mantenimiento.html \
  src/app/modules/operations.luxuryapp/google-calendar/calendar/mantenimiento-preventivo/cronograma-completo-status-dialog.html \
  src/app/modules/operations.luxuryapp/properties/entrega-recepcion-cliente/entrega-recepcion-cliente.html \
  src/app/modules/operations.luxuryapp/properties/entrega-recepcion/entrega-recepcion-equipos.html \
  src/app/modules/operations.luxuryapp/properties/entrega-recepcion/entrega-recepcion-herramientas.html \
  src/app/modules/operations.luxuryapp/properties/entrega-recepcion/entrega-recepcion-hidrantes.html \
  src/app/modules/operations.luxuryapp/properties/entrega-recepcion/entrega-recepcion-instalaciones.html \
  src/app/modules/operations.luxuryapp/properties/entrega-recepcion/entrega-recepcion-insumos.html \
  src/app/modules/operations.luxuryapp/properties/entrega-recepcion/entrega-recepcion-llaves.html \
  src/app/modules/operations.luxuryapp/staff-board/staff-board-list.html \
  src/app/modules/operations.luxuryapp/task-engine/tasks/reports/task-report-work-plan-preview.html \
  src/app/modules/purchases.luxuryapp/solicitudes-compras/solicitudes/solicitud-compra-presentacion.html \
  src/app/modules/recruitment.luxuryapp/employee-external/employee-external-list.html \
  src/app/modules/recruitment.luxuryapp/expediente-del-empleado/employees/employees/employee-list.html \
  src/app/modules/recruitment.luxuryapp/expediente-del-empleado/recursos-humanos/employee-bank-data/employee-bank-data-list.html \
  src/app/modules/recruitment.luxuryapp/expediente-del-empleado/recursos-humanos/employee-beneficiary/employee-beneficiary-list.html \
  src/app/modules/recruitment.luxuryapp/reclutamiento-y-altas-bajas/recruitment-staff-board/recruitment-staff-board.html
```

Espera **25 archivos transformados, 0 exclusiones, 0 advertencias**
(ya validado con dry-run de esta misma lista). Todos usan `#groupheader`
consistentemente; 8 de ellos también tienen `#groupfooter` — el script
no toca los `ng-template`, solo el tag `<p-table>`/`pSortableColumn`/
`p-sorticon`, así que esos templates quedan intactos y ahora deberían
funcionar de verdad.

## 2. Manual — 1 archivo con `Table` (tipo) + `TableModule` en el mismo import

```
src/app/modules/operations.luxuryapp/work-position/work-position-list.ts (+ .html)
```

Mismo patrón ya visto varias veces (`accounting.luxuryapp`,
`recruitment.luxuryapp`): `@ViewChild("dt") dt?: Table;` requiere
retipar a `AppTable`.

```diff
+import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";
```

```diff
-  @ViewChild("dt") dt?: Table;
+  @ViewChild("dt") dt?: AppTable;
```

y `TableModule,` → `AppTable,` / `AppSortableColumn,` / `AppSorticon,`
en el array `imports:`. El `.html` es estándar, aplica las 5 reglas de
siempre (`<p-table>`→`<app-table>`, etc.).

## 3. No tocar — 1 archivo con `[(selection)]` además de `rowGroupMode`

```
src/app/modules/accounting.luxuryapp/fondeos-y-reporteo/sat-funding/sat-funding-detail/sat-funding-detail.html
```

Tiene selección de filas (`[(selection)]`), que `AppTable` sigue sin
soportar (categoría aparte, no relacionada con agrupación). Queda en
`p-table`.

## Verificación

- `npx tsc --noEmit` limpio.
- `ng build` sin errores nuevos (warnings `NG8113` aceptables).
- `git diff --stat`: 26 `.html` + 26 `.ts` = 52 archivos (25
  automáticos + 1 manual).
- **Capturas reales de al menos 6 pantallas, priorizando confirmar
  visualmente que el agrupamiento funciona** (subencabezado gris/bold
  separando grupos, no filas planas repitiendo valores): al menos 2
  con `#groupheader` solo, y 2 con `#groupheader` + `#groupfooter`
  juntos (ej. `entrega-recepcion-equipos`, que muestra "Total: X" al
  final de cada grupo). Si tu herramienta de navegador sigue sin poder
  persistir PNG, repórtalo igual que las rondas anteriores sin
  fabricar archivos.

## Listo cuando

- 26 archivos migrados (25 automáticos + 1 manual), verificados,
  agrupación confirmada visualmente si es posible.
- 1 archivo sin tocar (`sat-funding-detail.html`), confirmado que
  sigue en `p-table`.
- `tsc`/build limpios.
- Con esto, el rollout llega a **314 de 336 archivos** (288 previos +
  26 de este lote). Quedarían solo: `pTemplate=` (7), reordenar
  columnas (7), selección de filas (7: 2 `selectionMode` + 4
  `[(selection)]` de `accounting` + este `sat-funding-detail`),
  columnas congeladas (7, ya migradas sin la función).
