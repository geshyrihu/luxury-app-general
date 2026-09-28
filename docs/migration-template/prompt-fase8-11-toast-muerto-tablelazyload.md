# Prompt Fase 8 — Categoría D: borrar `primeng-custom-toast` muerto + tipo `TableLazyLoadEvent`

## 1. Borrar `primeng-custom-toast` (0 consumidores reales)

```
src/app/shared/ui/web/primeng-custom-toast/
```
Verificado: `grep -rl "primeng-custom-toast" src/app/modules
--include="*.ts"` solo devuelve `ui-dictionary.ts` (metadata del
catálogo, no un import real) — sus 2 consumidores reales anteriores
(`orden-compra.ts`, `orden-compra-presupuesto.ts`) ya se migraron al
`<app-toast/>` global en una limpieza previa de Fase 7. Borra la
carpeta completa (`.ts` + `.spec.ts`).

Si `ui-dictionary.ts` tiene una entrada de catálogo con
`"path": "shared/ui/web/primeng-custom-toast/..."`, bórrala también
(mismo patrón de limpieza de metadatos huérfanos ya aplicado antes).

## 2. `TableLazyLoadEvent` → tipo local (3 archivos)

Solo se usa como tipo, mismos campos en los 3:
`first`/`rows`/`sortField`/`globalFilter`.

Crea `src/app/core/interfaces/lazy-load-event.interface.ts`:
```ts
export interface LazyLoadEvent {
  first?: number | null;
  rows?: number | null;
  sortField?: string | string[] | null;
  sortOrder?: number | null;
  globalFilter?: string | string[] | null;
  last?: number | null;
}
```

Actualiza los 3 imports:
```
src/app/core/interfaces/pagination-request.dto.ts
src/app/core/services/pagination-store.ts
src/app/modules/operations.luxuryapp/inventarios-y-almacn/stock-por-almacen/warehouse-stock-add.ts
```
```diff
-import { TableLazyLoadEvent } from "primeng/table";
+import { LazyLoadEvent } from "@core/interfaces/lazy-load-event.interface";
```
(en `warehouse-stock-add.ts` el import actual es
`import { TableLazyLoadEvent } from "@ui/web/primeng-table/primeng-table";`
— mismo cambio, solo cambia el origen)

Y cada uso del tipo `TableLazyLoadEvent` → `LazyLoadEvent` (nombre del
parámetro, no hace falta cambiarlo, solo el tipo):
```diff
-export function lazyLoadToPaginationRequest(
-  event: TableLazyLoadEvent,
+export function lazyLoadToPaginationRequest(
+  event: LazyLoadEvent,
```
```diff
-  onLazyLoad(event: TableLazyLoadEvent): void {
+  onLazyLoad(event: LazyLoadEvent): void {
```
(aplica en los 3 archivos, cada uno tiene 1 uso del tipo)

## No tocar

`src/app/shared/ui/web/primeng-table/primeng-table.ts` (el barril en
sí, `export * from "primeng/table"`) — bórralo **solo después** de
confirmar que los 3 archivos de arriba ya no lo importan (con este
prompt debería quedar en 0 consumidores — verifica con
`grep -rl "primeng-table" src/app/core src/app/modules --include="*.ts"`
antes de borrar el barril, y bórralo si da 0).

`PrimeNgCustomTableFooter`/`PrimeNgCustomCaption` en
`warehouse-stock-add.ts` — son wrappers con nombre "primeng-" pero ya
100% Bootstrap por dentro (confirmado en auditorías anteriores), no
forman parte de este prompt.

## Verificación

- `grep -rn "primeng" pagination-request.dto.ts pagination-store.ts warehouse-stock-add.ts`
  → 0 resultados de `primeng/table`/`primeng-table` (pueden quedar
  `PrimeNgCustomTableFooter`/`PrimeNgCustomCaption`, esos sí se
  quedan).
- `npx tsc --noEmit`: 0 errores nuevos.
- `ng build` **redirigido a archivo completo (`> log 2>&1`), espera a
  que el proceso termine de verdad, revisa el log entero con
  `grep -c ERROR`**.
- No requiere capturas — son cambios de tipo puro + borrado de código
  sin consumidores, sin efecto visual.

## Listo cuando

- `primeng-custom-toast` borrado.
- Los 3 archivos usando `LazyLoadEvent` local.
- `primeng-table` (el barril) borrado si quedó en 0 consumidores.
- `tsc`/build limpios.
- Con esto, el conteo de `primeng/*` directo en `shared/ui` baja de 11
  a 9 (quedan: `multi-select`, `listbox`, `rating`, `editor`, `steps`,
  `timeline`, `tree`, `image-analysis-dialog`,
  `custom-input-upload-pdf-signal`).
