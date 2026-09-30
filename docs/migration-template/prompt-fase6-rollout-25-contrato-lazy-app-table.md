# Prompt Fase 6 (seguimiento) — Contrato lazy incompleto en `app-table`

## Estado: EJECUTADO (2026-09-17) por el agente CLI, a pedido del usuario

Implementado en `src/app/shared/ui/web/table/table.ts`:

- Nuevo `output<AppTableLazyEvent>()` con la forma
  `{ first, rows, globalFilter, sortField, sortOrder }`.
- Se emite desde `goToPage()`, `changeRows()` y `sort()`, **solo cuando
  `lazy()` es true**, vía el helper privado `emitLazy()`.
- Nunca se emite por cambios de inputs (evita bucles de carga).
- Se conserva `onPage` sin cambios.

**Desviación respecto al plan original de este documento:**
`filterGlobal()` **no** emite. Motivo: `task-list` (y otros) manejan el
término con `(search)` del caption; si `filterGlobal()` también emitiera,
cada búsqueda dispararía **dos** peticiones. El filtro queda como
responsabilidad del consumidor.

**Consumidores reactivados** (tenían `(onLazyLoad)` muerto y ahora sí
reciben el evento; verificado que sus handlers usan `event.first` /
`event.rows` / `event.globalFilter`):

`task-list`, `provider-list`, `brevo-email-logs`, `product-modal-add`,
`orden-compra-detalle-add-producto`, `product-output-list`,
`prestamo-herramientas-control`, `warehouse-stock-add`.

Pendiente del ítem 2 de este documento (`DataViewMobile` sin output de
búsqueda): sigue abierto.

## Contexto

`app-table` (entregable de Fase 6) reemplazó a `p-table`. Los consumidores
evento `onLazyLoad` con `{ first, rows, globalFilter, sortField,
sortOrder }`.

**`app-table` no implementa ese contrato.**

## Evidencia (verificada en código, no asumida)

`src/app/shared/ui/web/table/table.ts`:

- `:378-379` — los únicos outputs son `onPage` y `onRowReorder`.
  **No existe `onLazyLoad`.**
- `:439-441` — `filteredValue` devuelve los datos sin filtrar cuando
  `lazy()` es true.
- `:482-488` — `pagedValue` no corta la lista cuando `lazy()` es true.
- `:704-711` — `sort()` cambia señales internas y **no emite nada**.
- `:713-716` — `filterGlobal()` setea `filterTerm` y resetea la página,
  **no emite nada**.
- `:724-731` — `goToPage()` sí emite, pero solo `onPage`.

## Síntoma real

Verificado en `operations.luxuryapp/task-engine/.../task-list`:

- **Buscador**: escribe "1202", no filtra ni consulta al servidor.
- **Paginador**: click en página 2 no cambia las filas (el índice interno
  cambia, `pagedValue` no corta en lazy).
- **Ordenar**: el icono del header cambia pero las filas no se reordenan.
- `loadDataLazy` estaba bindeado a `(onLazyLoad)`, un output inexistente:
  Angular lo trata como evento DOM y **nunca disparaba** (código muerto).

La parte feature de `task-list` **ya quedó parcheada** (bindea `(onPage)`
y `(search)`, y el contador usa `totalRecords()`). **Ordenar sigue roto**
porque no existe evento que lo notifique.

## Alcance

Agregar a `app-table` la notificación de cambios en modo lazy. Se
recomienda un evento unificado para no fragmentar la API:

```ts
onLazyLoad = output<{
  first: number;
  rows: number;
  globalFilter: string;
  sortField: string | null;
  sortOrder: 1 | -1;
}>();
```

Emitirlo desde `sort()`, `filterGlobal()` y `goToPage()` **cuando
`lazy()` es true**.

Reglas de emisión:

- Emitir **una sola vez** por acción del usuario.
- **No** emitir durante cambios de inputs (`value`, `totalRecords`,
  `rows`), para evitar loops de carga.
- **No** romper `onPage`: ya hay consumidores que lo usan.
- Mantener intacto el comportamiento client-side (no-lazy).

## Consumidor objetivo y afectados

- `task-list`: queda listo para bindear `(onLazyLoad)` y hacer
  ordenamiento server-side.
- **12 archivos** con `[lazy]="true"` (medido 2026-09-17). Verificar
  cuáles usan `app-table` y reportar la lista con su estado:
  `audit-entries`, `brevo-email-logs`, `log-api-report`,
  `user-activity-history`, `password-list`,
  `prestamo-herramientas-control`, `product-output-list`,
  `warehouse-stock-add`, `task-list`, `product-modal-add`,
  `orden-compra-detalle-add-producto`, `provider-list`.

## Ítem 2 (decisión aparte, no bloquea)

`DataViewMobile` (`shared/ui/mobile/data-view-mobile/data-view-mobile.ts:177-187`)
llama `table.filterGlobal(val, 'contains')` y **no expone ningún output
de búsqueda**; solo emite `add` y `nextPage`. Por eso en móvil la
búsqueda filtra únicamente los registros ya cargados (client-side).
Para búsqueda server-side en móvil hace falta un output nuevo. Reportar
como pendiente; no incluirlo en este cambio salvo indicación.

## Restricciones

- **No** cambiar el comportamiento de `app-table` en modo no-lazy.
- **No** agregar dependencias.
- Cambio en `shared/ui`: registrar el análisis de impacto (1 componente,
  consumidores lazy identificados) en la bitácora.

## Verificación

- `npx tsc --noEmit` → 0 errores.
- `npx ng build --configuration production` con log completo
  (`> log 2>&1`, sin `tail`) → exit 0, 0 `ERROR`.
- `npm run audit:ui` verde.
- `git diff --check` sin errores.
- **Runtime obligatorio** en `task-list`:
  - escribir "1202" → la tabla muestra lo que devuelve el backend;
  - click en página 2 → cambian las filas (31–60);
  - click en el header "DIAS" → el servidor reordena y el icono lo
    refleja.
  - capturas en tema claro y oscuro.

## Listo cuando

- `onLazyLoad` disponible en `app-table` y `task-list` ordenando
  server-side.
- Evidencia runtime de los 3 casos (búsqueda, paginación, orden).
- Lista de los 12 consumidores lazy con su estado.
- Entrada en `04-bitacora-cambios.md` con archivos tocados y resultado
  de build.
