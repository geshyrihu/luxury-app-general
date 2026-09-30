
`pTemplate="header"`/`pTemplate="body"` es solo la sintaxis **vieja**
`#header`/`#body`, que `AppTable` ya soporta desde el piloto. No hace
falta ninguna función nueva para estos 6 archivos.

**Aparte, ya implementado y verificado (`tsc`/`ng build` limpios en
los 336 archivos):** `AppTable` ahora tiene un slot `#footer`
(pie de tabla / fila de totales, ej. `<tfoot>`) que no existía antes.
Esto significa que **28 archivos ya migrados en lotes anteriores**
tienen un `<ng-template #footer>` que hasta ahora nunca se renderizaba
— a partir de este cambio debería empezar a mostrarse solo, sin tocar
esos 28 archivos. Si al revisar capturas de otros módulos ves una
fila de "TOTAL" que antes no aparecía, es esto, no un bug.

## 1. Cinco archivos — renombrar `pTemplate=` a mano, luego correr el script

El codemod excluye cualquier archivo que contenga la cadena
`pTemplate=` en **cualquier parte** (no solo dentro de `<p-table>`),
así que hay que quitarla primero a mano y después correr el script
normal.

En cada uno de estos 5 archivos, cambia **todas** las apariciones de
`pTemplate="header"` → `#header` y `pTemplate="body"` → `#body`
(dentro de `<ng-template ...>`, nada más cambia en esa línea):

```
src/app/modules/collections.luxuryapp/aspel-cobranza-haus/aspel-cobranza-reglas-negocio/aspel-cobranza-reglas-negocio.html
  (3 tablas, 3× pTemplate="header" + 3× pTemplate="body" = 6 ocurrencias)
src/app/modules/maintenance.luxuryapp/reports-mantenance/report-consumos/report-consumos.html
  (1× pTemplate="header")
src/app/modules/management.luxuryapp/juntas-comite/junta-comite-minutas/resumen-minuta.html
  (1× pTemplate="header")
src/app/modules/operations.luxuryapp/reports/report-meeting/report-meeting.html
  (3 tablas, 3× pTemplate="header")
src/app/modules/system.luxuryapp/configuracion-sistema/juntas-mensuales-backfill/juntas-mensuales-backfill.html
  (1× pTemplate="header")
```

Después de ese cambio, corre el script normal sobre los 5:

```
node scripts/migrate-p-table-standard.mjs --write \
  src/app/modules/collections.luxuryapp/aspel-cobranza-haus/aspel-cobranza-reglas-negocio/aspel-cobranza-reglas-negocio.html \
  src/app/modules/maintenance.luxuryapp/reports-mantenance/report-consumos/report-consumos.html \
  src/app/modules/management.luxuryapp/juntas-comite/junta-comite-minutas/resumen-minuta.html \
  src/app/modules/operations.luxuryapp/reports/report-meeting/report-meeting.html \
  src/app/modules/system.luxuryapp/configuracion-sistema/juntas-mensuales-backfill/juntas-mensuales-backfill.html
```

Espera **5 archivos transformados, 0 exclusiones, 0 advertencias**
(ya que quitaste `pTemplate=` primero). Nota:
`aspel-cobranza-reglas-negocio.ts` importa `TableModule` desde
sabe manejar ese patrón exacto también.

## 2. Manual completo — `cuadro-comparativo-list.html`

```
src/app/modules/purchases.luxuryapp/solicitudes-compras/comparativo/cuadro-comparativo-list.html
```

Este es un falso positivo: sus 3 `<p-table>` **ya usan** `#header`/
`#body`/`#footer` correctamente — el único `pTemplate="footer"` del
archivo pertenece a `<lx-modal>` (un componente distinto, nuestro
modal propio), no a ninguna tabla. **No toques esa línea de
`lx-modal`.** Como el script excluye el archivo completo por esa
cadena, aplica a mano las reglas estándar de siempre solo a los 3
bloques `<p-table>`:

- `<p-table` → `<app-table`, `</p-table>` → `</app-table>`
- (revisa si hay `pSortableColumn`/`p-sorticon` en estos 3 bloques —
  si no hay, no hace falta tocar nada más ahí)

Y en `cuadro-comparativo-list.ts`:

```diff
+import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";
```

y `TableModule,` → `AppTable,` / `AppSortableColumn,` / `AppSorticon,`
en `imports:`. El `#footer` de la primera tabla (fila de "TOTAL") debería
empezar a renderizar por primera vez con el nuevo soporte.

## 3. No tocar — `juntas-mensuales-session.html`

```
src/app/modules/management.luxuryapp/juntas-comite/juntas-mensuales-session/juntas-mensuales-session.html
```

Sigue excluido: además de `pTemplate`, tiene `selectionMode="single"`
— función de selección todavía sin soporte en `AppTable`, categoría
aparte. No lo toques en este prompt.

## Verificación

- `npx tsc --noEmit` limpio.
- `ng build` sin errores nuevos (warnings `NG8113` aceptables).
- `git diff --stat`: 6 `.html` + 6 `.ts` = 12 archivos.
- Capturas reales de las 6 pantallas, priorizando confirmar
  `cuadro-comparativo-list` (fila de "TOTAL" visible por primera vez)
  y que las tablas de `aspel-cobranza-reglas-negocio`/`report-meeting`
  (con 3 tablas cada una) se vean todas correctas.

## Listo cuando

- 6 archivos migrados (5 automáticos + 1 manual), verificados.
- 1 archivo sin tocar (`juntas-mensuales-session.html`).
- `tsc`/build limpios.
- Con esto, el rollout llega a **320 de 336 archivos** (314 previos +
  6 de este lote). Quedarían solo: reordenar columnas (7), selección
  de filas (8: 7 previos + `juntas-mensuales-session.html`), columnas
  congeladas (7, ya migradas sin la función).
