# Prompt 21 — Fase 6: `<p-table>` en plantillas inline dentro de `.ts` (7 archivos) + verificación de cambios directos

Se detectó un hueco de todo el rollout: **todas las búsquedas anteriores
usaron `--include="*.html"`**, así que nunca se revisaron plantillas
`template:` inline dentro de archivos `.ts`. Hay 10 archivos con
`<p-table>` real ahí — 2 ya los migré directamente yo (ver punto 1,
solo pide verificación), quedan 7 para ti (punto 2) + 1 descartado
(punto 3, no se toca).

## 1. Verificar cambios que ya apliqué directamente (excepción puntual)

Ya migré y verifiqué con `tsc --noEmit` + `ng build` (2 corridas
completas sin truncar, 0 errores) estos archivos — hazlo tú también,
de forma independiente, antes de continuar:

- `src/app/shared/ui/web/table/table.ts` — agregué a `AppTable`:
  soporte de agrupación (`groupRowsBy`/`#groupheader`/`#groupfooter`),
  pie de tabla (`#footer`), reordenar filas
  (`[pReorderableRow]`/`[pReorderableRowHandle]`/`onRowReorder`),
  reordenar columnas (`[reorderableColumns]`), selección
  (`selection`/`dataKey`/`p-tablecheckbox`/`p-tableheadercheckbox`), y
  columnas congeladas (`[pFrozenColumn]`/`alignFrozen`). También
  corregí que nunca pasaba `rowIndex` al contexto de `#body`.
- `src/styles/web/_prime-table.scss` — agregué layout flex al
  paginador (`.app-table-paginator`/`-controls`/`-left`), que nunca
  tuvo `display:flex` y por eso sus elementos se apilaban en vertical
  en vez de alinearse en una fila (detalle estético reportado por el
  usuario con capturas reales de `/admin/banks` y
  `/admin/payment-method`).
- `src/app/shared/ui/web/data-grid/data-grid.ts` — reescrito completo
  para usar `AppTable` en vez de `p-table` (era un grid genérico de
  columnas dinámicas). Sus 2 consumidores reales
  (`announcement-analytics.html`, `catalog-core-item.ts`) solo usan
  `[data]`/`[columns]`/`[paginator]`/`[rows]`, así que **no se
  replicaron** `virtualScroll`/`resizableColumns` (cero uso real en
  todo el repo, requerirían ingeniería nueva en `AppTable` que no
  existe hoy) — repórtalo si encuentras algún consumidor que sí las
  use, no debería haber ninguno.
- `src/app/modules/recruitment.luxuryapp/expediente-del-empleado/employees/contract-renewal-list.ts` — migrado completo a `AppTable`, con
  botones `il-button`/`iw-button` en vez de `p-button`.

**Verificación pedida**: `npx tsc --noEmit` + `ng build` (sin `tail`,
redirigido a archivo completo, revisa el log entero con `grep -c
ERROR`) + capturas reales de: alguna pantalla con paginador (confirma
que ahora se ve en una sola fila, no apilado) y
`contract-renewal-list` si tiene datos de prueba disponibles.

## 2. Migrar — 7 archivos de catálogo/showcase (`herramientas-dev`, uso interno, bajo riesgo)

Todos con el patrón estándar de siempre (`<p-table` → `<app-table`,
`TableModule` → `AppTable`/`AppSortableColumn`/`AppSorticon`, import
desde `@ui/web/table/table`). Ninguno tiene columnas ordenables
(`pSortableColumn`) excepto revisar por si acaso.

```
src/app/modules/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-web-item/catalog-web-item.ts
src/app/modules/admin.luxuryapp/herramientas-dev/catalog-component-ui/foundations/catalog-docs/catalog-docs.ts
src/app/modules/admin.luxuryapp/herramientas-dev/catalog-component-ui/foundations/catalog-docs-item/catalog-docs-item.ts
src/app/modules/admin.luxuryapp/herramientas-dev/catalog-component-ui/foundations/catalog-guia-item/catalog-guia-item.ts
src/app/modules/admin.luxuryapp/herramientas-dev/catalog-component-ui/patterns-layouts/catalog-patterns-item/catalog-patterns-item.ts
src/app/modules/admin.luxuryapp/herramientas-dev/catalog-component-ui/shared/tokens-typography/tokens-typography.ts
```

**Caso especial — `button-catalog.ts`** (mismo grupo de carpetas,
`foundations/catalog-guia-item/button-catalog/button-catalog.ts`):
tiene 4 apariciones de `pTemplate=` (sintaxis vieja) — conviértelas a
`#nombre` igual que en el Prompt 19 (`pTemplate="header"` → `#header`,
etc.) antes de renombrar las etiquetas.

Como son plantillas inline (no hay script que las procese), aplica
las sustituciones a mano en cada uno:
- `<p-table` → `<app-table`, `</p-table>` → `</app-table>`
- `TableModule,` en el arreglo `imports:` → `AppTable,` / `AppSortableColumn,` / `AppSorticon,`
- Si aparece `pTemplate="X"` → `#X` (solo en `button-catalog.ts`)

## 3. No tocar — texto de ejemplo, no es código real

```
src/app/modules/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.service.ts
```

El `<p-table class="mobile-hack-table"></p-table>` de este archivo es
un **string literal dentro de un bloque de código de ejemplo**
etiquetado "NO" (antipatrón mostrado como documentación en el visor de
convenciones) — no es una plantilla real que se renderice. No lo
toques, migrarlo no tendría sentido (mostraría el patrón nuevo como si
fuera el que hay que evitar).

## Verificación

- `npx tsc --noEmit` limpio.
- `ng build` **redirigido a archivo completo, sin `tail`** (ej.
  `npx ng build --configuration=development > build.log 2>&1`), y
  revisa el archivo entero con `grep -c ERROR build.log` — no
  confíes en las últimas líneas de la terminal, ya hubo un caso esta
  sesión donde `tail` descartó errores reales guardados.
- `git diff --stat`: 7 archivos `.ts` de catálogo modificados (más
  los 4 que yo ya toqué, que tú solo verificas).
- Capturas reales de al menos 3 de los 7 catálogos (busca la ruta de
  "Herramientas Dev" / catálogo de componentes en el menú admin).

## Listo cuando

- Los 4 archivos que edité directamente, verificados por ti de forma
  independiente (tsc + build + capturas).
- Los 7 archivos de catálogo migrados y verificados.
- 1 archivo sin tocar (`conventions-viewer.service.ts`), confirmado
  que sigue igual.
- `tsc`/build limpios (log completo revisado, no solo `tail`).
- Con esto, **cero `<p-table>` reales en todo `src/app`**, incluyendo
  plantillas inline — el hueco de este hallazgo queda cerrado.
