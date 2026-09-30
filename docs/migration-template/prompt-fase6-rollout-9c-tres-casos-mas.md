# Prompt 9c — Fase 6: 3 casos más de `accounting.luxuryapp` (imports indirectos)

El lote normal de 44 (tras sacar los 7 del Prompt 9b) encontró 3
advertencias más. Investigadas contra el código real:

## Caso 1 — 2 archivos: `TableModule` vive en un archivo de constantes compartido, no en el componente

```
src/app/modules/accounting.luxuryapp/ar/catalogo-gastos-fijos/catalogo-gastos-fijos-list-moduls.ts
src/app/modules/accounting.luxuryapp/general-ledger/catalogo-gastos-fijos/catalogo-gastos-fijos-list-moduls.ts
```

(nota: "moduls" sin la segunda "e" — typo real y preexistente en el
nombre de archivo, no lo corrijas, solo úsalo tal cual)

`catalogo-gastos-fijos-list.ts` (en ambas carpetas) hace
`import { CATALOGO_GASTOS_FIJOS_LIST_MODULES } from
"./catalogo-gastos-fijos-list-moduls";` y lo esparce en su propio
`imports: [...CATALOGO_GASTOS_FIJOS_LIST_MODULES]` — el `TableModule`
real está adentro de ese archivo de constantes, no en el componente.
**No toques `catalogo-gastos-fijos-list.ts`** (ya está bien, no
importa `TableModule` directamente) — el cambio va en el archivo
`-moduls.ts`:

```diff
+ import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";
```

y en el array exportado (`TableModule,` está entre `RouterModule,` y
`TagModule,`):

```diff
  RouterModule,
- TableModule,
+ AppTable,
+ AppSortableColumn,
+ AppSorticon,
  TagModule,
```

Aplica esto en **las 2 copias** (`ar/` y `general-ledger/`). El
`.html` de `catalogo-gastos-fijos-list.html` (ambas copias) ya está
incluido en el lote normal de 44 — el script lo procesa bien por su
cuenta, solo necesitabas resolver de dónde sale `TableModule`.

## Caso 2 — 1 archivo: `<p-table>` sin `TableModule` importado en absoluto

```
src/app/modules/accounting.luxuryapp/fondeos-y-reporteo/funding/funding-purchase-detail.ts
```

**Hallazgo real, no un patrón de import distinto**: este componente
tiene `<p-table>` (2 veces) en su `.html`, pero su `imports: [...]`
(`LxSpinner, CommonModule, WebButtonLabel, CurrencyPipe, DecimalPipe,
LxTag`) **nunca incluyó `TableModule`** — ni antes de esta migración.
Con `strictTemplates: false` (confirmado, ya lo verificamos en la
ronda de `collections.luxuryapp`), Angular no marca error por elemento
desconocido, así que esto compilaba pero **el `<p-table>` de esta
registró su directiva ahí). Al agregar `AppTable`/`AppSortableColumn`/
`AppSorticon` de verdad, es posible que la tabla **empiece a
renderizar por primera vez** — no es una regresión, es destapar algo
que ya estaba roto. Repórtalo así de explícito en la verificación.

Cambio: agrega el import y súmalo al array `imports:` existente (no
hay nada que reemplazar, solo agregar):

```diff
+ import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";
```

```diff
  imports: [
    LxSpinner,
    CommonModule,
    WebButtonLabel,
    CurrencyPipe,
    DecimalPipe,
    LxTag,
+   AppTable,
+   AppSortableColumn,
+   AppSorticon,
  ],
```

El `.html` de este archivo **sí está incluido en el lote normal de
44** — el script lo va a transformar bien (tiene 2 `<p-table>`
hermanos, ya verificado que no están anidados), solo faltaba el
import que nunca existió.

## Verificación

Además de lo ya pedido en los Prompts 9/9b: abre
`funding-purchase-detail` (el modal de detalle de compra de fondeo) y
confirma explícitamente si la tabla **ahora se ve** — antes
probablemente no se veía nada donde debía ir. Captura de antes/si es
posible, y de después.

## Listo cuando

- Los 2 archivos `-moduls.ts` corregidos (ambas copias).
- `funding-purchase-detail.ts` con el import agregado.
- Sumado a los Prompts 9 (44) + 9b (7), el lote completo de
  `accounting.luxuryapp` (51 archivos) queda migrado.
- `tsc`/`ng build` limpios, 0 residuales reales.
- Captura confirmando el estado de `funding-purchase-detail` (tabla
  visible o no, repórtalo tal cual lo veas).
