# AppTable Component - Guia Completa de Funcionamiento e Implementacion

> **Estado verificado:** 2026-09-18. Esta guia describe `table.ts` actual,
> deben asumirse por compatibilidad de nombres.

Diseñado con el motor moderno de **Angular Signals** (`input`, `computed`, `model`, `linkedSignal`), este componente elimina la necesidad de depender de librerías externas pesadas mientras mantiene compatibilidad casi total con los nombres de APIs, inputs, outputs y selectores existentes en el proyecto. Esto permite una transición transparente durante los procesos de refactorización y migración.

---

## 🗺️ Índice de Contenidos

1. [Características Clave](#-características-clave)
2. [Estructura del Archivo y Directivas Coadyuvantes](#-estructura-del-archivo-y-directivas-coadyuvantes)
3. [API del Componente Principal (`AppTable`)](#-api-del-componente-principal-apptable)
   - [Inputs (Señales de Entrada)](#inputs-señales-de-entrada)
   - [Outputs (Eventos de Salida)](#outputs-eventos-de-salida)
   - [Plantillas Soportadas (ContentChildren)](#plantillas-soportadas-contentchildren)
4. [Funcionalidades en Detalle (Under the Hood)](#-funcionalidades-en-detalle-under-the-hood)
   - [Ordenación (Client-side vs Server-side)](#ordenación-client-side-vs-server-side)
   - [Paginación Inteligente](#paginación-inteligente)
   - [Selección Unificada (Checkboxes)](#selección-unificada-checkboxes)
   - [Reordenación por Arrastre (Drag & Drop)](#reordenación-por-arrastre-drag--drop)
   - [Columnas Congeladas (Sticky Columns)](#columnas-congeladas-sticky-columns)
5. [Ejemplos de Uso Práctico](#-ejemplos-de-uso-práctico)
   - [Caso 1: Tabla Básica con Filtro Global, Ordenación y Paginación (Cliente)](#caso-1-tabla-básica-con-filtro-global-ordenación-y-paginación-cliente)
   - [Caso 2: Tabla Server-Side (Lazy Loading)](#caso-2-tabla-server-side-lazy-loading)
   - [Caso 3: Tabla con Selección y Checkboxes](#caso-3-tabla-con-selección-y-checkboxes)
   - [Caso 4: Reordenación de Filas y Columnas](#caso-4-reordenación-de-filas-y-columnas)
   - [Caso 5: Agrupamiento de Filas (Row Grouping)](#caso-5-agrupamiento-de-filas-row-grouping)

---

## ⚡ Características Clave

- **Rendimiento Reactivo Extremo:** Utiliza Angular Signals y estrategia `ChangeDetectionStrategy.OnPush` para evitar ejecuciones innecesarias del ciclo de detección de cambios.
- **Arquitectura de Plantillas Declarativa:** Soporta múltiples slots dinámicos mediante `@if` y `@for` nativos de Angular, logrando un código limpio y legible.
- **Drag & Drop Integrado:** Soporte nativo para reordenación de filas y columnas arrastrando elementos en la interfaz de usuario.
- **Uso de Effects Modernos:** Implementa `afterRenderEffect` para realizar mediciones y layouts precisos del DOM de forma segura (ej. posicionamiento sticky de columnas congeladas y orden dinámico de columnas).

### Contrato real de render

El flujo interno es:

```text
value()
  -> reorderedValue() ?? value()
  -> filteredValue
  -> sortedValue
  -> pagedValue
  -> render de filas
```

- En modo no-lazy, filtro, orden y paginacion se calculan localmente.
- En modo lazy, la tabla no filtra, ordena ni corta localmente; el backend debe
  devolver la ventana solicitada.
- Un cambio de referencia en `[value]` limpia el preview interno de reorder.
  El consumidor debe actualizar su signal despues de `onRowReorder`.

---

## 🧩 Estructura del Archivo y Directivas Coadyuvantes

El archivo `table.ts` expone un ecosistema de directivas y micro-componentes que colaboran de manera transparente:

### 1. `AppSortableColumn` (Directiva `[appSortableColumn]`)

- **Selector:** `[appSortableColumn]`
- **Uso:** Se aplica en cabeceras `<th>` para habilitar la ordenación al hacer clic o presionar Enter.
- **Comportamiento:** Añade automáticamente atributos de accesibilidad (`role="button"`, `tabindex="0"`) y la clase activa `.lux-table-sorted` cuando la columna es el criterio de ordenación actual.

### 2. `AppReorderableRow` y `AppReorderableRowHandle`

- **Directiva de Fila (`[pReorderableRow]`):** Convierte una fila `<tr>` en un elemento arrastrable (`draggable="true"`). Aplica estilos visuales de arrastre (`.lux-table-row-dragover`).
- **Directiva de Manija (`[pReorderableRowHandle]`):** Identifica el ícono o zona específica de la fila desde donde se permite iniciar el arrastre, protegiendo interacciones con botones u otros controles de la fila.

### 3. `AppFrozenColumn` (Directiva `[pFrozenColumn]`)

- **Selector:** `[pFrozenColumn]`
- **Uso:** Convierte celdas (`<th>` o `<td>`) en columnas fijas/congeladas.
- **Propiedades:** `alignFrozen = input<"left" | "right">("left")` define si se congela al extremo izquierdo o derecho.

### 4. `AppSorticon` (Componente `app-sorticon`)

- **Selector:** `app-sorticon`
- **Uso:** Renderiza un ícono de estado de ordenación (neutral, ascendente o descendente) sincronizado automáticamente con el estado actual de la tabla.

### 5. `AppTableCheckbox` y `AppTableHeaderCheckbox`

- **Checkbox de Fila (`p-tablecheckbox`):** Renderiza un checkbox nativo de Bootstrap vinculado al estado de selección del elemento actual.
- **Checkbox de Cabecera (`p-tableheadercheckbox`):** Renderiza un checkbox para seleccionar/deseleccionar todas las filas actualmente visibles en la página.

---

## 🔌 API del Componente Principal (`AppTable`)

### Inputs (Señales de Entrada)

| Input                       | Tipo                     | Valor por Defecto             | Descripción                                                                               |
| --------------------------- | ------------------------ | ----------------------------- | ----------------------------------------------------------------------------------------- |
| `value`                     | `any[]`                  | `[]`                          | Colección de datos a renderizar en la tabla.                                              |
| `loading`                   | `boolean`                | `false`                       | Activa estados visuales de carga (si es requerido).                                       |
| `lazy`                      | `boolean`                | `false`                       | Indica si los datos se paginan, ordenan y filtran en el servidor.                         |
| `paginator`                 | `boolean`                | `false`                       | Habilita o deshabilita la barra de paginación.                                            |
| `rows`                      | `number`                 | `30`                          | Número inicial de filas por página.                                                       |
| `rowsPerPageOptions`        | `number[]`               | `[30, 50, 75, 100, 150, 200]` | Opciones del combo de tamaño de página en el paginador.                                   |
| `totalRecords`              | `number`                 | `0`                           | Total de registros en la base de datos (requerido si `lazy` es `true`).                   |
| `showCurrentPageReport`     | `boolean`                | `false`                       | Muestra un texto con el resumen de la página actual.                                      |
| `currentPageReportTemplate` | `string`                 | `"Mostrando {first} a..."`    | Plantilla de texto para el reporte de páginas.                                            |
| `globalFilterFields`        | `string[]`               | `[]`                          | Campos de los objetos fila en los que se buscará el término de filtrado global (cliente). |
| `scrollable`                | `boolean`                | `false`                       | Habilita scroll vertical si el contenido excede el alto máximo.                           |
| `scrollHeight`              | `string`                 | `undefined`                   | Alto máximo del contenedor scrollable (ej: `"400px"`).                                    |
| `tableStyle`                | `Record<string, string>` | `undefined`                   | Estilos CSS en formato clave-valor para aplicar a la etiqueta `<table>`.                  |
| `size`                      | `"small" \| undefined`   | `undefined`                   | Si es `"small"`, aplica la clase compacta `.table-sm`.                                    |
| `initialSortField`          | `string`                 | `undefined`                   | Campo inicial por el cual ordenar los datos.                                              |
| `initialSortOrder`          | `1 \| -1`                | `1`                           | Dirección inicial de la ordenación (`1` ascendente, `-1` descendente).                    |
| `groupRowsBy`               | `string`                 | `undefined`                   | Campo clave para habilitar la agrupación de filas.                                        |
| `dataKey`                   | `string`                 | `undefined`                   | Propiedad única del registro usada para identificar y comparar selecciones.               |
| `selection`                 | `model<unknown[]>`       | `[]`                          | **Two-way binding (Signal Model)** para almacenar los registros seleccionados.            |
| `reorderableRows`           | `boolean`                | `false`                       | Permite reordenar filas mediante Drag & Drop.                                             |
| `reorderableColumns`        | `boolean`                | `false`                       | Permite reordenar columnas arrastrando las cabeceras `<th>`.                              |

`reorderableRows` forma parte del contrato para aceptar bindings migrados desde
`[pReorderableRow]` en cada `<tr>`, `pReorderableRowHandle` en un descendiente y
los imports standalone de ambas directivas.

### Outputs (Eventos de Salida)

- **`onPage`**: Emite `{ first: number, rows: number }` al cambiar de página o de tamaño de filas por página.
- **`onRowReorder`**: Emite `{ dragIndex: number, dropIndex: number }` cuando el usuario suelta una fila arrastrada en una nueva posición.
- **`onLazyLoad`**: Emite un evento de tipo `AppTableLazyEvent` que contiene el estado actual de paginación y ordenamiento para realizar la petición al servidor.

```typescript
export interface AppTableLazyEvent {
  first: number;
  rows: number;
  globalFilter: string;
  sortField: string | null;
  sortOrder: 1 | -1;
}
```

### Plantillas Soportadas (ContentChildren)

El componente detecta automáticamente las plantillas declaradas con `#` dentro de su cuerpo:

- **`#caption`**: Cabecera externa de la tabla (útil para títulos, buscadores, botones de acción).
- **`#colgroup`**: Definición opcional de `<colgroup>` para anchos y estilos de columnas; se renderiza dentro de `<table>` antes de `<thead>`.
- **`#header`**: Estructura de cabecera `<thead>` (contiene los elementos `<th>`).
- **`#body`**: Estructura de fila `<tr>` (contiene los elementos `<td>`). Recibe contextualmente el elemento actual (`let-item`) y su índice (`let-rowIndex`).
- **`#emptymessage`**: Fila de fallback para renderizar cuando la tabla no tiene datos.
- **`#paginatorleft`**: Contenido dinámico colocado en la esquina inferior izquierda de la barra del paginador.
- **`#groupheader`**: Fila especial que encabeza cada grupo de datos. Recibe el item actual.
- **`#groupfooter`**: Fila especial que cierra cada grupo de datos. Recibe el item actual.
- **`#footer`**: Estructura de pie de tabla `<tfoot>`.

---

## 🔍 Funcionalidades en Detalle (Under the Hood)

### Ordenación (Client-side vs Server-side)

La propiedad `sortedValue` es una señal computada (`computed`) que gestiona el ordenamiento de los datos de forma inteligente:

- Si **`lazy === true`**: La tabla omite el procesamiento de ordenación local y emite el evento `onLazyLoad` para que el servidor resuelva los datos correspondientes.
- Si **`lazy === false`**: La tabla procesa el ordenamiento de forma local basándose en el tipo de dato y respeta la agrupación si se definió `groupRowsBy`.

### Paginación Inteligente

`AppTable` calcula dinámicamente los botones del paginador ofreciendo un máximo de 5 botones de páginas consecutivas alrededor de la página actual.
La navegación utiliza transiciones seguras mediante índices calculados por señales:

- `pageCount` determina dinámicamente cuántas páginas existen.
- `pageReport` interpola los valores `{first}`, `{last}` y `{totalRecords}` dinámicamente según los elementos visibles y el conteo de registros total.

### Selección Unificada (Checkboxes)

Para comparar registros robustamente (especialmente al trabajar con paginación), `AppTable` utiliza la propiedad `dataKey()`. Si `dataKey` está especificado, las celdas de selección compararán las propiedades únicas (ej: `id` o `code`) para evitar errores por referencias de objetos distintas en memoria.

- **`toggleAllSelection()`**: Identifica el estado de los elementos de la página actual. Si todos están seleccionados, los remueve de la señal `selection`. De lo contrario, añade los faltantes.

### Reordenación por Arrastre (Drag & Drop)

- **Columnas (`reorderableColumns`):** Al activarse, cada `<th>` en el `thead` recibe el atributo `draggable="true"`. A través de un `afterRenderEffect` y de la asignación del atributo de datos `data-lux-table-col`, el componente reordena físicamente los nodos hijos (`Element.appendChild`) del `thead` y del `tbody` cada vez que el orden de columnas cambia, sin necesidad de destruir y volver a pintar el componente.
- **Filas (`reorderableRows`):** Cuando arrastras una fila (usando obligatoriamente un elemento con `[pReorderableRowHandle]`), se dispara la reordenación local modificando la señal `reorderedValue` y emitiendo el evento `onRowReorder` con los índices correspondientes.

#### Markup completo para reorder de filas

```html
<lux-table
  [value]="items()"
  [reorderableRows]="true"
  (onRowReorder)="onRowReorder($event)"
>
  <ng-template #body let-item let-rowIndex="rowIndex">
    <tr [pReorderableRow]="rowIndex">
      <td>
        <app-icon icon="material-symbols-light:menu" pReorderableRowHandle />
      </td>
      <td>{{ item.name }}</td>
    </tr>
  </ng-template>
</lux-table>
```

```typescript
imports: [AppTable, AppReorderableRow, AppReorderableRowHandle];
```

El flujo es `dragstart` en la fila, validacion del descendiente handle,
`startRowDrag(rowIndex)`, `dragover`, `dropRow(dropIndex)` y emision de
`{ dragIndex, dropIndex }`. `AppTable` no conoce endpoints ni DTOs; persistir
el orden es responsabilidad del consumidor:

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

Los indices corresponden a `pagedValue()`. No mezclar reorder con orden activo
o esperar indices globales cuando la tabla pagina localmente.

### Anchos de columnas

`table-col-*` funciona en `<col>` dentro de `#colgroup` y directamente en
`<th>`/`<td>`. Las variantes porcentuales (`table-col-10`) y rem (`table-col-9rem`)
usan el mismo contrato visual; los anchos fijos rem son útiles para columnas de
acciones, iconos y controles dentro de tablas con layout automático.

### Columnas Congeladas (Sticky Columns)

El soporte de columnas congeladas (`[pFrozenColumn]`) se resuelve mediante CSS Sticky dinámico.
Un `afterRenderEffect` recorre las filas del `thead` y `tbody`, localiza los elementos con la clase `.lux-table-frozen-column`, y calcula acumulativamente el desplazamiento en pixeles en base al ancho físico de las columnas anteriores (`offsetWidth`):

```typescript
cell.style.position = "sticky";
cell.style.left = `${leftOffset}px`;
leftOffset += cell.offsetWidth;
```

Esto permite tener múltiples columnas congeladas contiguas del lado izquierdo o derecho sin solapamiento de contenido.

### Filtro global

`filterGlobal(term, mode)` guarda el termino y reinicia la pagina. `mode` se
recibe por compatibilidad pero actualmente no cambia la estrategia.

- No-lazy: busca con `includes` en `globalFilterFields`, ignorando mayusculas.
- Lazy: no filtra localmente y no emite `onLazyLoad`.
- El consumidor lazy debe escuchar el evento de busqueda de su caption, llamar
  al backend y reemplazar `[value]`.

### Paginacion lazy

`onLazyLoad` se emite una vez por cambio de pagina, tamano u orden cuando
`lazy()` es verdadero. No se emite por cambios de inputs, para evitar loops.
`onPage` se mantiene para compatibilidad.

### Agrupacion

`groupRowsBy` solo detecta cambios entre filas contiguas de `pagedValue()`.
`#groupheader` y `#groupfooter` son slots visuales; no realizan agrupacion de
datos ni solicitan agrupacion al backend.

### Limites actuales

No implementados en `table.ts`: virtual scroll, expansion de filas, resize de
columnas, filtros por columna, seleccion global server-side, persistencia
generica del orden de columnas, exportacion, context menu y drag/drop por
teclado.

---

## 🚀 Ejemplos de Uso Práctico

### Caso 1: Tabla Básica con Filtro Global, Ordenación y Paginación (Cliente)

Para tablas donde el volumen de datos es moderado y el filtrado/paginado se realiza en el cliente:

```html
<!-- Componente TypeScript o HTML de cabecera -->
<div class="card">
  <lux-table
    [value]="usuarios"
    [paginator]="true"
    [rows]="10"
    [globalFilterFields]="['nombre', 'email', 'puesto']"
    #dt
  >
    <!-- Template para la cabecera/caption -->
    <ng-template #caption>
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="m-0">Gestión de Usuarios</h5>
        <input
          type="text"
          class="form-control form-control-sm w-25"
          placeholder="Buscar..."
          (input)="dt.filterGlobal($any($event.target).value, 'contains')"
        />
      </div>
    </ng-template>

    <!-- Columnas de Cabecera -->
    <ng-template #header>
      <tr>
        <th appSortableColumn="nombre">
          Nombre <app-sorticon field="nombre" />
        </th>
        <th appSortableColumn="email">Email <app-sorticon field="email" /></th>
        <th appSortableColumn="puesto">
          Puesto <app-sorticon field="puesto" />
        </th>
      </tr>
    </ng-template>

    <!-- Filas del Cuerpo -->
    <ng-template #body let-usuario>
      <tr>
        <td>{{ usuario.nombre }}</td>
        <td>{{ usuario.email }}</td>
        <td>{{ usuario.puesto }}</td>
      </tr>
    </ng-template>

    <!-- Mensaje vacío opcional -->
    <ng-template #emptymessage>
      <tr>
        <td colspan="3" class="text-center p-4">
          No se encontraron usuarios disponibles.
        </td>
      </tr>
    </ng-template>
  </lux-table>
</div>
```

---

### Caso 2: Tabla Server-Side (Lazy Loading)

Ideal para millones de registros donde la base de datos procesa las peticiones:

```html
<lux-table
  [value]="items"
  [lazy]="true"
  [paginator]="true"
  [rows]="30"
  [totalRecords]="totalItems"
  [loading]="isLoading"
  (onLazyLoad)="cargarDatosServer($event)"
>
  <ng-template #header>
    <tr>
      <th appSortableColumn="codigo">Código <app-sorticon field="codigo" /></th>
      <th appSortableColumn="descripcion">
        Descripción <app-sorticon field="descripcion" />
      </th>
      <th>Acciones</th>
    </tr>
  </ng-template>

  <ng-template #body let-item>
    <tr>
      <td>{{ item.codigo }}</td>
      <td>{{ item.descripcion }}</td>
      <td>
        <button class="btn btn-sm btn-icon"><i class="fa fa-edit"></i></button>
      </td></tr
  ></ng-template>
</lux-table>
```

```typescript
// Componente TypeScript
cargarDatosServer(event: AppTableLazyEvent) {
  this.isLoading = true;
  this.service.getItems(event.first, event.rows, event.sortField, event.sortOrder, event.globalFilter)
    .subscribe(res => {
      this.items = res.data;
      this.totalItems = res.total;
      this.isLoading = false;
    });
}
```

---

### Caso 3: Tabla con Selección y Checkboxes

Habilita selección múltiple interactiva vinculada a un modelo bidireccional.

```html
<lux-table
  [value]="productos"
  dataKey="id"
  [(selection)]="productosSeleccionados"
>
  <ng-template #header>
    <tr>
      <th style="width: 4rem">
        <p-tableheadercheckbox />
      </th>
      <th appSortableColumn="nombre">
        Producto <app-sorticon field="nombre" />
      </th>
      <th>Precio</th>
    </tr>
  </ng-template>

  <ng-template #body let-prod>
    <tr>
      <td>
        <p-tablecheckbox [value]="prod" />
      </td>
      <td>{{ prod.nombre }}</td>
      <td>{{ prod.precio | currency }}</td>
    </tr>
  </ng-template>
</lux-table>

<div class="mt-3">
  <strong>Items Seleccionados:</strong> {{ productosSeleccionados.length }}
</div>
```

---

### Caso 4: Reordenación de Filas y Columnas

Habilita arrastrar filas y reordenar las columnas en caliente.

```html
<lux-table
  [value]="tareas"
  [reorderableRows]="true"
  [reorderableColumns]="true"
  (onRowReorder)="ordenarTareas($event)"
>
  <ng-template #header>
    <tr>
      <th style="width: 3rem"></th>
      <!-- Columna vacía para la manija de arrastre -->
      <th appSortableColumn="titulo" data-lux-table-col="col-titulo">Título</th>
      <th appSortableColumn="prioridad" data-lux-table-col="col-prioridad">
        Prioridad
      </th>
    </tr>
  </ng-template>

  <ng-template #body let-tarea let-rowIndex="rowIndex">
    <tr [pReorderableRow]="rowIndex">
      <td>
        <span pReorderableRowHandle class="lux-table-row-handle">
          <app-icon icon="material-symbols-light:drag-handle" />
        </span>
      </td>
      <td>{{ tarea.titulo }}</td>
      <td>
        <span class="badge" [class.bg-danger]="tarea.prioridad === 'Alta'">
          {{ tarea.prioridad }}
        </span>
      </td>
    </tr>
  </ng-template>
</lux-table>
```

---

### Caso 5: Agrupamiento de Filas (Row Grouping)

Permite colapsar visualmente los registros agrupados por un campo común:

```html
<lux-table [value]="empleados" groupRowsBy="departamento">
  <ng-template #header>
    <tr>
      <th>Nombre</th>
      <th>Puesto</th>
      <th>Salario</th>
    </tr>
  </ng-template>

  <!-- Encabezado de Grupo: Se dispara automáticamente cuando cambia el valor de groupRowsBy -->
  <ng-template #groupheader let-emp>
    <tr class="table-dark">
      <td colspan="3">
        <strong>Departamento: {{ emp.departamento }}</strong>
      </td>
    </tr>
  </ng-template>

  <!-- Cuerpo de Fila Estándar -->
  <ng-template #body let-emp>
    <tr>
      <td>{{ emp.nombre }}</td>
      <td>{{ emp.puesto }}</td>
      <td>{{ emp.salario | currency }}</td>
    </tr>
  </ng-template>

  <!-- Pie de Grupo Opcional -->
  <ng-template #groupfooter let-emp>
    <tr class="table-light">
      <td colspan="3" class="text-end">
        <small>Fin de registros del departamento: {{ emp.departamento }}</small>
      </td>
    </tr>
  </ng-template>
</lux-table>
```

---

## 🎨 Personalización de Estilos CSS

El componente provee las siguientes variables de personalización que se acoplan con el diseño de LuxuryApp:

```css
.lux-table {
  /* Contenedor del scroll de la tabla */
  --bs-table-bg: var(--ds-bg-surface);
  --bs-table-color: var(--ds-text);
}

/* Modificadores de ordenación */
.lux-table-sortable-column {
  cursor: pointer;
  user-select: none;
}

.lux-table-sortable-column:hover {
  background-color: var(--ds-bg-hover, #f8f9fa);
}

.lux-table-sorted {
  font-weight: bold;
  color: var(--ds-primary, #0d6efd);
}

/* Manija de arrastre */
.lux-table-row-handle {
  cursor: grab;
}
.lux-table-row-handle:active {
  cursor: grabbing;
}
```

Este componente unifica y simplifica la manipulación de datos tabulares, otorgando a los desarrolladores de **LuxuryApp** un control absoluto del flujo de información y del diseño UX.
