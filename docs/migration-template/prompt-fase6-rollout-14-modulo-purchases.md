# Prompt 14 — Fase 6: módulo `purchases.luxuryapp` (7 archivos)

Módulo chico. 4 automáticos, 1 manual (markup muerto de PrimeNG), 2
exclusiones catalogadas.

## 1. Lote automático — 4 archivos vía script

```
node scripts/migrate-p-table-standard.mjs --write \
  src/app/modules/purchases.luxuryapp/historial-compras/historial-compras-list.html \
  src/app/modules/purchases.luxuryapp/solicitudes-compras/comparativo/cuadro-comparativo-cotizacion.html \
  src/app/modules/purchases.luxuryapp/solicitudes-compras/detalle/solicitud-compra-detalle.html \
  src/app/modules/purchases.luxuryapp/solicitudes-compras/solicitudes/solicitud-compra-list.html
```

Espera **4 archivos transformados, 0 exclusiones, 0 advertencias** (ya
validado con dry-run de esta misma lista).

## 2. Manual — 1 archivo con `<p-sorticon />` muerto (sin `field`, sin columna ordenable real)

```
src/app/modules/purchases.luxuryapp/solicitudes-compras/detalle/product-modal-add.html
```

El script lo excluye por seguridad: `AppSorticon` exige `field` como
input obligatorio (`field = input.required<string>();`), y este
archivo tiene un `<p-sorticon />` **sin `field`** en la columna
"Cantidad" (línea 48). Investigado: esa columna **nunca fue
ordenable** — su `<th>` no tiene `pSortableColumn`, a diferencia de
la columna "DESCRIPCIÓN" que sí lo tiene y sí tiene su
`<p-sorticon field="producto" />` correcto. Es markup muerto/copiado
sin terminar del original PrimeNG, mismo tipo de hallazgo que
`virtualScrollItemSize` sin `virtualScroll` visto en lotes anteriores.

Cambio: **elimina la línea** `<p-sorticon />` (línea 48, dentro de
`<th>Cantidad</th>`) — no le agregues un `field` inventado, ese icono
nunca tuvo función real. El resto del archivo aplica las 5 reglas
estándar de siempre:

```diff
-      <th>
-        Cantidad
-        <p-sorticon />
-      </th>
+      <th>
+        Cantidad
+      </th>
```

Y luego: `<p-table` → `<app-table`, `</p-table>` → `</app-table>`,
`pSortableColumn="` → `appSortableColumn="`,
`<p-sorticon field="producto" />` → `<app-sorticon field="producto" />`,
`<ng-template #caption/#header/#body/#paginatorleft>` (ya tienen `#`,
no hace falta tocarlos). En el `.ts`, mismo import exacto de siempre:

```diff
-import { TableModule } from "@ui/web/primeng-table/primeng-table";
+import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";
```

y `TableModule,` → `AppTable,` / `AppSortableColumn,` / `AppSorticon,`
en el array `imports:`.

## 3. No tocar — 2 archivos con atributos no soportados

- **1 con `pTemplate=`**:
  `solicitudes-compras/comparativo/cuadro-comparativo-list.html`
- **1 con `rowGroupMode`** (agrupación, mismo criterio ya
  establecido):
  `solicitudes-compras/solicitudes/solicitud-compra-presentacion.html`

## Verificación

- `npx tsc --noEmit` limpio.
- `ng build` sin errores nuevos (warnings `NG8113` aceptables).
- `git diff --stat`: 5 `.html` + 5 `.ts` = 10 archivos (4 automáticos
  + 1 manual).
- Capturas reales de las 5 pantallas migradas, incluyendo
  `product-modal-add` (confirma que la columna "Cantidad" se ve bien
  sin el ícono muerto, y que "DESCRIPCIÓN" sigue ordenando
  correctamente).

## Listo cuando

- 5 archivos migrados (4 automáticos + 1 manual), verificados.
- 2 archivos sin tocar, confirmado que siguen en `p-table`.
- `tsc`/build limpios, capturas reales adjuntas.
- Con esto, el rollout llega a **277 de 336 archivos** (272 previos +
  5 de este lote).
