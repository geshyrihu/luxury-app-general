
**Fecha:** 2026-09-18  
**Proyecto:** `luxuryapp-api/appsweb/angular`  
**Fuente tecnica:** `src/app/shared/ui/web/table/table.ts`  
**Documentacion operativa:** `src/app/shared/ui/web/table/README.md`

## 1. Objetivo


- diferencia entre el snapshot historico y el estado migrado actual;
- inventario funcional real de `AppTable`;
- contrato de uso para consumidores standalone;
- estado de `pReorderableRowHandle`;
- limites que no deben declararse como implementados;
- verificaciones y pendientes de runtime.

No sustituye `CONVENTIONS.md` ni convierte este reporte en una especificacion
normativa del framework.

## 2. Reconciliacion del reporte original

`<p-table>`, 734 `<p-sorticon>`, 678 `pSortableColumn` y 71 `pFrozenColumn`.
Esas cifras no representan el estado actual del codigo migrado.

La auditoria posterior detecto dos causas:

1. El reporte fue generado antes del cierre de la migracion de tablas.
2. Varios conteos usaban coincidencia de subcadena o incluian wrappers,
   comentarios, snapshots y usos ya reemplazados.

La fuente vigente para el estado de migracion es:

- `docs/migration-template/03-inventario-componentes.md`;
- `docs/migration-template/04-bitacora-cambios.md`;
- codigo actual de `src/app/shared/ui/web/table/table.ts`;
- consumidores actuales bajo `src/app/modules/**`.

### Estado reconciliado

| Area | Reporte historico | Estado actual documentado |
|---|---:|---|
| Tablas de features | 833 `<p-table>` | Migracion a `app-table` cerrada segun inventario |
| Orden de columnas | 71 `pFrozenColumn` reportados | Directiva propia `AppFrozenColumn`; runtime debe verificarse por lote |
| Orden de filas | 9 handles reportados | Directivas propias `AppReorderableRow` y `AppReorderableRowHandle` |
| Orden por columna | 734 `p-sorticon`/678 `pSortableColumn` | `AppSorticon` y `AppSortableColumn` |
| Persistencia | No descrita por componente | Responsabilidad de cada consumidor mediante outputs |

`p-table` en una pantalla sin verificar el template actual.

## 3. Inventario actual de `AppTable`

### 3.1 Componente y directivas

| Simbolo | Selector | Responsabilidad |
|---|---|---|
| `AppTable` | `app-table` | Render, estado derivado, paginacion y outputs |
| `AppSortableColumn` | `[appSortableColumn]` | Click/teclado y orden de columna |
| `AppReorderableRow` | `[pReorderableRow]` | Drag/drop de una fila |
| `AppReorderableRowHandle` | `[pReorderableRowHandle]` | Zona permitida para iniciar drag |
| `AppFrozenColumn` | `[pFrozenColumn]` | Sticky izquierdo/derecho |
| `AppSorticon` | `app-sorticon` | Indicador neutral/ascendente/descendente |
| `AppTableCheckbox` | `p-tablecheckbox` | Seleccion individual |
| `AppTableHeaderCheckbox` | `p-tableheadercheckbox` | Seleccion de filas visibles |

### 3.2 Capacidades implementadas

- Slots `caption`, `header`, `body`, `emptymessage`, `groupheader`,
  `groupfooter`, `footer` y `paginatorleft`.
- Orden local por campo y direccion.
- Orden inicial mediante `initialSortField` y `initialSortOrder`.
- Filtro global local mediante `filterGlobal()`.
- Paginacion client-side.
- Paginacion y orden server-side mediante `[lazy]` y `onLazyLoad`.
- Reordenamiento de filas con preview interno y output de indices.
- Reordenamiento visual de columnas mediante DOM.
- Columnas congeladas con `position: sticky` y offsets medidos.
- Agrupacion visual por campo contiguo.
- Seleccion bidireccional por `dataKey`.
- Scroll interno y tamanos visuales de tabla.

## 4. Contrato de templates

```html
<app-table [value]="items()">
  <ng-template #header>
    <tr>
      <th appSortableColumn="name">
        Nombre
        <app-sorticon field="name" />
      </th>
    </tr>
  </ng-template>

  <ng-template #body let-item let-rowIndex="rowIndex">
    <tr>
      <td>{{ item.name }}</td>
    </tr>
  </ng-template>
</app-table>
```

`#body` recibe:

- `$implicit`: item actual;
- `rowIndex`: indice dentro de `pagedValue()`.

El indice no es necesariamente indice global del backend cuando existe
paginacion o una ventana lazy.

## 5. `pReorderableRowHandle`: contrato completo

### Markup requerido

```html
<app-table
  [value]="items()"
  [reorderableRows]="true"
  (onRowReorder)="onRowReorder($event)"
>
  <ng-template #body let-item let-rowIndex="rowIndex">
    <tr [pReorderableRow]="rowIndex">
      <td>
        <app-icon
          icon="material-symbols-light:menu"
          pReorderableRowHandle
        />
      </td>
      <td>{{ item.name }}</td>
    </tr>
  </ng-template>
</app-table>
```

### Imports standalone obligatorios

```typescript
imports: [
  AppTable,
  AppReorderableRow,
  AppReorderableRowHandle,
]
```

El input `[reorderableRows]` habilita el gate del drag, pero el consumidor debe
usar tambien las dos directivas de fila y handle.

### Flujo de ejecucion

1. `AppReorderableRow` agrega `draggable="true"` al `<tr>`.
2. En `dragstart`, busca `.app-table-row-handle` dentro de la fila.
3. Si el evento no proviene del handle, cancela el drag.
4. Si proviene del handle, guarda el `rowIndex` en `AppTable`.
5. Configura `effectAllowed` y `dropEffect` como `move`.
6. `dragover` habilita el drop y marca la fila destino.
7. `drop` llama `AppTable.dropRow(dropIndex)`.
8. `dropRow()` crea un splice sobre `pagedValue()` y guarda preview en
   `reorderedValue`.
9. `onRowReorder` emite `{ dragIndex, dropIndex }`.
10. El consumidor debe aplicar el splice a su fuente de verdad y persistirlo.

### Handler minimo correcto

```typescript
onRowReorder(event: { dragIndex: number; dropIndex: number }): void {
  const items = [...this.data().items];
  const [moved] = items.splice(event.dragIndex, 1);
  if (!moved) return;
  items.splice(event.dropIndex, 0, moved);

  this.data.update((current) => ({ ...current, items }));
  this.api.updateOrder(items.map((item) => item.id));
}
```

### Caso `task-list`

El uso de `task-list.html` es estructuralmente correcto cuando se cumplen las
condiciones anteriores:

```html
<tr [pReorderableRow]="rowIndex">
  <app-icon
    icon="material-symbols-light:menu"
    pReorderableRowHandle
    lxTooltip="Arrastra para reordenar la tarea"
    tooltipPosition="top"
  />
</tr>
```

El componente debe importar `AppReorderableRow` y
`AppReorderableRowHandle`. Su handler debe usar `dragIndex` y `dropIndex`; no

Si la misma fila soporta otro drag, como enlace de dependencia, el handler de
ese flujo debe filtrar por su MIME propio (`application/task-link`) y no
consumir drops de reorder.

## 6. Lazy loading

```typescript
interface AppTableLazyEvent {
  first: number;
  rows: number;
  globalFilter: string;
  sortField: string | null;
  sortOrder: 1 | -1;
}
```

Con `[lazy]="true"`:

- `filteredValue` no filtra localmente;
- `sortedValue` no ordena localmente;
- `pagedValue` devuelve los registros recibidos sin hacer `slice`;
- `totalRecords` controla el numero de paginas;
- `onLazyLoad` se emite por pagina, tamano u orden;
- `filterGlobal()` no emite `onLazyLoad`.

La busqueda server-side debe conectarse desde el consumidor, normalmente por
el evento `search` del caption.


|---|---|---|
| `value` | Implementada | Input reemplazado por el consumidor |
| `pTemplate` | Implementada mediante templates nombrados | Slots propios |
| `pSortableColumn` | `appSortableColumn` | Local o output lazy |
| `p-sorticon` | `app-sorticon` | Estado derivado de señales |
| `paginator` | Implementada | Local o lazy |
| `onLazyLoad` | Implementada | `AppTableLazyEvent` |
| `pFrozenColumn` | Implementada | Sticky calculado en DOM |
| `pReorderableRow` | Implementada | Requiere directiva importada |
| `pReorderableRowHandle` | Implementada | Marca handle; no persiste |
| `onRowReorder` | Implementada | Consumidor aplica/persiste indices |
| `reorderableColumns` | Implementada visualmente | No persiste fuera de instancia |
| `selection` | Implementada | Filas de `pagedValue()` |
| `p-tablecheckbox` | Implementada | Usa `dataKey` si existe |
| `p-tableheadercheckbox` | Implementada | Selecciona filas visibles |
| `rowGroupMode` equivalente | Implementada visualmente | `groupRowsBy` y slots |
| `loading` visual | Input declarado | No dibuja loader propio en `table.ts` |
| virtual scroll | No implementada | No asumir soporte |
| row expansion | No implementada | No asumir soporte |
| resize de columnas | No implementada | No asumir soporte |
| filtros por columna | No implementada | Solo filtro global local |
| seleccion global server-side | No implementada | Requiere diseño adicional |
| exportacion | No implementada | Servicio externo |

## 8. Hallazgos de auditoria

### Alta prioridad

1. Cerrar prueba runtime real de `pReorderableRowHandle` en `task-list` y
   al menos un consumidor adicional.
2. Confirmar que el API de persistencia recibe el orden esperado despues del
   drop.
3. Confirmar que una recarga conserva el orden.
4. Verificar que un drag de dependencia no dispara reorder y viceversa.

### Media prioridad

1. Definir si `reorderableRows` debe ser solo declarativo o si debe bloquear
   directivas cuando sea `false`.
2. Definir contrato global de reorder en modo lazy; actualmente los indices
   son de la ventana entregada.
3. Persistir orden de columnas si el negocio lo requiere.
4. Agregar pruebas unitarias para `dropRow`, `sort`, `goToPage` y seleccion.

### Baja prioridad

1. Reemplazar `any[]` de `value` por un tipo generico si Angular y el contrato
   de consumidores lo permiten.
2. Agregar indicador visual propio para `loading`.

## 9. Verificacion requerida

### Estatica

```powershell
npx tsc --noEmit
npx ng build --configuration production > C:\Windows\TEMP\luxuryapp-apptable-build.log 2>&1
npm run audit:ui
git diff --check
```

El build debe ejecutarse sin truncar el log. Revisar el archivo completo y
confirmar cero `ERROR`.

### Runtime

- abrir `task-list` autenticado;
- confirmar filas visibles;
- confirmar `tr.app-table-reorderable-row`;
- confirmar `.app-table-row-handle`;
- confirmar `draggable="true"` en las filas;
- arrastrar usando exclusivamente el icono menu;
- soltar en otra fila;
- confirmar cambio visual;
- confirmar llamada de persistencia;
- recargar y confirmar orden conservado;
- repetir en tema claro y oscuro;
- probar drag de dependencia sin activar reorder.

## 10. Conclusion

evaluar la implementacion propia actual. `AppTable` ya tiene un nucleo amplio
de tabla, incluyendo las directivas necesarias para `pReorderableRowHandle`.

El punto que requiere cierre no es declarar mas compatibilidad por nombre: es
probar el circuito completo `handle -> dragstart -> drop -> output -> signal
del consumidor -> endpoint -> recarga`. Hasta completar esa prueba, el
reordenamiento debe considerarse implementado en codigo pero pendiente de
validacion runtime.
