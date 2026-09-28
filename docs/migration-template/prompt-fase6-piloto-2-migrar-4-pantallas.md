# Prompt 2 — Fase 6: migrar las 4 pantallas del lote piloto a `app-table`

El componente `app-table` (`shared/ui/web/table/table.ts`) ya está
construido, verificado y auditado (paginador completo, orden con ícono
neutro/activo, paridad visual con PrimeNG confirmada — ver
`04-bitacora-cambios.md`, ronda "Prompt 1d cerrado"). Este prompt migra
las 4 pantallas reales del lote piloto, elegidas por complejidad
distinta (ver `04-bitacora-cambios.md`, ronda "Arranque real de
Fase 6"):

1. `bank-list-desktop.html` — simple, client-side.
2. `log-api-report.html` — server-side (`[lazy]`+`onPage`), sin anidado.
3. `generic-approval-panel.ts` — columnas dinámicas.
4. `audit-entries.html` — server-side + `<p-table>` anidado dentro de
   una fila expandida (el único caso real de anidamiento en el repo).

**No toques ninguna otra de las 341 plantillas.** Es un lote piloto,
no el rollout — el criterio de aceptación de Fase 6
(`02-plan-migracion.md` §6) exige verificar paridad funcional antes de
aprobar el rollout masivo, esto es esa verificación.

## Patrón mecánico común a las 4 (ver `05-tablas-y-modales.md` §A.5)

En cada `.ts`/`.html`:

1. Import: reemplaza `import { TableModule } from
   "@ui/web/primeng-table/primeng-table";` por
   `import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";`
   y agrega los 3 al array `imports` del componente (reemplazando
   `TableModule`).
2. Etiqueta: `<p-table` → `<app-table`, `</p-table>` → `</app-table>`.
3. Orden por columna: `pSortableColumn="campo"` → `appSortableColumn="campo"`;
   `[pSortableColumn]="expr"` → `[appSortableColumn]="expr"`.
4. Ícono de orden: `<p-sorticon field="campo" />` → `<app-sorticon field="campo" />`;
   `<p-sorticon [field]="expr" />` → `<app-sorticon [field]="expr" />`.
5. El resto de los `@Input` (`[value]`, `[paginator]`, `[rows]`,
   `[rowsPerPageOptions]`, `[scrollable]`, `[scrollHeight]`,
   `[globalFilterFields]`, `[showCurrentPageReport]`,
   `currentPageReportTemplate`, `[lazy]`, `(onPage)`, `[totalRecords]`,
   `[loading]`, `[tableStyle]`, `class`, `#dt`) **no cambian de
   nombre** — se quedan igual, `app-table` los acepta con la misma
   firma.
6. Los `<ng-template #caption>`, `#header`, `#body let-item>`,
   `#emptymessage`, `#paginatorleft` **no cambian** — mismo nombre de
   referencia, mismo contenido interno, salvo los puntos 3-4 de arriba
   dentro de `#header`.
7. `primeng-custom-caption`, `primeng-custom-table-emptymessage`,
   `primeng-custom-table-footer` **no cambian** — siguen recibiendo
   `[dt]="dt"` igual que antes (su input ya es `any`, no le importa que
   `dt` ahora sea `AppTable` en vez de `Table` de PrimeNG).

## Por archivo

### 1. `bank-list-desktop.html`/`.ts`

Solo aplica el patrón común. No tiene filtros adicionales en el
caption más allá del botón "Agregar" — nada especial.

### 2. `log-api-report.html`/`.ts`

Aplica el patrón común. Fíjate que usa `[lazy]="true"` +
`(onPage)="onPageChange($event)"` + `[totalRecords]="totalRecords()"` +
`[loading]="loading()"` — confirma que el evento sigue disparando
`onPageChange` con `{first, rows}` igual que antes (el método en el
`.ts` no cambia). Las filas de detalle expandible usan `[ngStyle]`
sobre `<tr>` normales dentro de `#body` — no son parte del sistema de
tabla, no se tocan.

### 3. `generic-approval-panel.ts`

Aplica el patrón común, con dos detalles propios de este archivo:

- Las columnas son dinámicas: `[appSortableColumn]="col.field"` y
  `<app-sorticon [field]="col.field" />` dentro del `@for (col of
  columns())` — igual que el resto, solo cambia el nombre.
- **Corrige el bug preexistente ya detectado** (`04-bitacora-cambios.md`,
  ronda "Arranque real de Fase 6"): la línea `<ng-template
  emptymessage>` (sin `#`, nunca estuvo conectada a la tabla) debe
  quedar `<ng-template #emptymessage>`. Antes de este cambio ese
  mensaje de "No hay solicitudes pendientes" nunca se mostraba
  realmente aunque estuviera escrito — ahora sí se va a mostrar
  cuando corresponda, pruébalo con una lista vacía si es fácil de
  forzar (si no es fácil, no bloquea el resto).

### 4. `audit-entries.html`/`.ts`

Aplica el patrón común **dos veces**: la tabla exterior (`#dt`, con
paginador/lazy/caption/las 4 columnas ordenables) y la tabla anidada
dentro de la fila expandida (sin paginador, sin caption, sin orden —
solo `[value]`, `#header`, `#body`). Ambas pasan de `<p-table>` a
`<app-table>`.

**Esto es lo único genuinamente nuevo que no se probó en el Prompt 1**
— confirma explícitamente que:
- El `#header`/`#body` de la tabla anidada no colisiona con el de la
  tabla exterior (cada `<app-table>` debe leer solo su propio
  contenido proyectado, no el de la otra).
- Expandir/colapsar una fila (que monta y desmonta la tabla anidada
  dinámicamente vía `@if`) no rompe nada al remontarse.

Si algo de esto falla, es información valiosa para el rollout — repórtalo
con detalle exacto (qué esperabas, qué pasó) en vez de intentar un
parche silencioso.

## Verificación (para las 4, con capturas reales de `ng serve`)

1. `npx tsc --noEmit` limpio.
2. Cada pantalla renderiza sus filas, ordena al hacer clic en un
   encabezado (ícono cambia de neutro a flecha), pagina, y su caption
   (agregar/buscar/filtros propios) sigue funcionando.
3. `log-api-report` y `audit-entries`: cambiar de página dispara
   `onPageChange` (confírmalo con los mismos datos que trae el backend,
   no simulado).
4. `audit-entries`: expandir una fila con `operationType === 'Update'`
   y confirmar que la tabla anidada de propiedades se ve y tiene datos
   correctos; colapsar y volver a expandir la misma fila u otra.
5. `generic-approval-panel`: probar con datos reales de
   `panel-aprobaciones` (o el módulo que lo consuma), confirmar que las
   columnas dinámicas se ven con sus encabezados correctos y ordenan.
6. Captura de cada una de las 4 pantallas en su estado normal, más una
   captura de `audit-entries` con una fila expandida.
7. `grep -rn "primeng-table\|TableModule" ` sobre los 4 archivos
   `.ts`/`.html` tocados → debe dar 0 resultados.

## Listo cuando

- Las 4 pantallas (5 tablas contando la anidada) migradas, compilando
  limpio, con paridad funcional confirmada punto por punto contra la
  lista de verificación de arriba.
- Ninguna de las otras 337 plantillas con `<p-table>` tocada.
- `git diff --stat` de los archivos exactos tocados (deberían ser 6-7:
  2 archivos por pantalla × 4, menos `generic-approval-panel.ts` que
  es uno solo con template inline).
- Reporta explícitamente cualquier sorpresa con el anidamiento de
  `audit-entries` — es la pieza que más interesa de este lote para
  decidir si el diseño de `app-table` aguanta el rollout de las 341
  plantillas restantes tal como está, o necesita un ajuste antes.
