# Prompt 12 — Fase 6: módulo `recruitment.luxuryapp` (26 archivos reales)

Mismo procedimiento de siempre. El conteo real (`grep`) es **26**, no
los ~27 estimados en el inventario. 16 automáticos vía script, 4
manuales (patrón `Table` + `TableModule` en el mismo import, ya visto
antes), 6 exclusiones catalogadas.

## 1. Lote automático — 16 archivos vía script

```
node scripts/migrate-p-table-standard.mjs --write \
  src/app/modules/recruitment.luxuryapp/candidates/candidate-applications/candidate-application-kpis.html \
  src/app/modules/recruitment.luxuryapp/candidates/candidate-applications/desktop/candidate-application-list-desktop.html \
  src/app/modules/recruitment.luxuryapp/candidates/candidate-core/desktop/candidate-list-desktop.html \
  src/app/modules/recruitment.luxuryapp/candidates/candidate-interview/candidate-interview-detail-modal.html \
  src/app/modules/recruitment.luxuryapp/candidates/candidate-interview/candidate-interview-response.html \
  src/app/modules/recruitment.luxuryapp/candidates/candidate-interview/desktop/candidate-interview-pending-desktop.html \
  src/app/modules/recruitment.luxuryapp/candidates/former-employee-talent-pool/former-employee-talent-pool.html \
  src/app/modules/recruitment.luxuryapp/employee-bank-data/employee-bank-data-list.html \
  src/app/modules/recruitment.luxuryapp/employee-beneficiary/employee-beneficiary-list.html \
  src/app/modules/recruitment.luxuryapp/employee-clinical-data/employee-clinical-data-list.html \
  src/app/modules/recruitment.luxuryapp/employee-emergen-contact/employee-emergency-contact-list.html \
  src/app/modules/recruitment.luxuryapp/expediente-del-empleado/employees/employee-interviewer-queue/employee-interview-response.html \
  src/app/modules/recruitment.luxuryapp/expediente-del-empleado/recursos-humanos/employee-file/employee-file-detail.html \
  src/app/modules/recruitment.luxuryapp/expediente-del-empleado/recursos-humanos/employee-file/employee-file-list.html \
  src/app/modules/recruitment.luxuryapp/reclutamiento-y-altas-bajas/recruitment-client-requests/solicitudes-cliente-list.html \
  src/app/modules/recruitment.luxuryapp/recruitment-agenda-list.html
```

Espera **16 archivos transformados, 0 exclusiones, 0 advertencias**
(ya validado con dry-run de esta misma lista).

Nota: `former-employee-talent-pool.html` no tiene cambios pendientes
ni conflictos — confirmado con `git status`/`git log`, el último
commit sobre él (`fix talent pool`) ya está resuelto. Trátalo como
cualquier archivo normal del lote.

## 2. Manual — 4 archivos con `Table` (tipo) + `TableModule` en el mismo import

```
src/app/modules/recruitment.luxuryapp/solicitud-altas/solicitud-alta-list.ts (+ .html)
src/app/modules/recruitment.luxuryapp/solicitud-bajas/solicitud-baja-list.ts (+ .html)
src/app/modules/recruitment.luxuryapp/solicitud-modificaciones-sueldo/solicitud-modificacion-list.ts (+ .html)
src/app/modules/recruitment.luxuryapp/solicitud-vacantes/vacantes-list.ts (+ .html)
```

El script los excluye porque el import mezcla el tipo `Table` (para
tipar `@ViewChild("dt") dt?: Table;`) junto con `TableModule` en la
misma línea — mismo patrón ya visto en `accounting.luxuryapp` (Prompt
9b), aunque ahí era `viewChild<Table>()` y aquí es el decorador
`@ViewChild("dt") dt?: Table;`. El `.html` de los 4 es estándar (sin
complicaciones), así que aplica las mismas 5 reglas de siempre a mano
en el `.html` y este cambio en el `.ts`:

```diff
-import { Table, TableModule } from "@ui/web/primeng-table/primeng-table";
+import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";
```

```diff
-  @ViewChild("dt") dt?: Table;
+  @ViewChild("dt") dt?: AppTable;
```

y en el array `imports:` reemplaza `TableModule,` por las 3 líneas
`AppTable,` / `AppSortableColumn,` / `AppSorticon,` (igual que hace el
script en los demás archivos).

Reglas estándar para el `.html` de estos 4 (mismas de siempre):
- `<p-table` → `<app-table`, `</p-table>` → `</app-table>`
- `pSortableColumn="` → `appSortableColumn="` (y su variante `[pSortableColumn]="`)
- `<p-sorticon field="X"></p-sorticon>` → `<app-sorticon field="X" />`
- `<ng-template caption/header/body/emptymessage/paginatorleft>` sin `#` → agregar `#`

## 3. No tocar — 6 archivos con atributos no soportados

- **1 con `[reorderableColumns]`**:
  `employee-document/employee-document-list.html`
- **5 con `rowGroupMode`** (mismo criterio ya establecido, agrupación
  sin soporte en `AppTable`):
  `employee-external/employee-external-list.html`,
  `expediente-del-empleado/employees/employees/employee-list.html`,
  `expediente-del-empleado/recursos-humanos/employee-bank-data/employee-bank-data-list.html`,
  `expediente-del-empleado/recursos-humanos/employee-beneficiary/employee-beneficiary-list.html`,
  `reclutamiento-y-altas-bajas/recruitment-staff-board/recruitment-staff-board.html`

(⚠️ ojo: hay dos pares de nombres muy parecidos en este módulo —
`employee-bank-data/employee-bank-data-list.html` en la raíz del
módulo **sí se migra** (punto 1), pero
`expediente-del-empleado/recursos-humanos/employee-bank-data/employee-bank-data-list.html`
**no** (tiene `rowGroupMode`). Mismo caso con `employee-beneficiary`.
Confirma la ruta completa antes de tocar cualquiera de los dos.)

## Verificación

- `npx tsc --noEmit` limpio.
- `ng build` sin errores nuevos (warnings `NG8113` aceptables).
- `git diff --stat`: 20 `.html` + 20 `.ts` = 40 archivos (16
  automáticos + 4 manuales).
- Capturas reales de al menos 5 pantallas de carpetas distintas,
  incluyendo una de los 4 manuales (para confirmar que el retipado de
  `Table` a `AppTable` no rompió nada) y `former-employee-talent-pool`.

## Listo cuando

- 20 archivos migrados (16 automáticos + 4 manuales), verificados.
- 6 archivos sin tocar, confirmado que siguen en `p-table`.
- `tsc`/build limpios, capturas reales adjuntas.
- Con esto, el rollout llega a **253 de 336 archivos** (233 previos +
  20 de este lote).
