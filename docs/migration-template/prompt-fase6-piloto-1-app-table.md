# Prompt 1/2 — Fase 6: construir `app-table` (sin tocar features todavía)

Contexto: migración PrimeNG→Bootstrap de `appsweb/angular`. Toda la
bitácora vive en `docs/migration-template/`. Este prompt es la base del
lote piloto de Fase 6 (tabla). **No migres ninguna de las 341 plantillas
que usan `<p-table>` en este paso** — solo construye el componente nuevo
y arregla el CSS base. La migración de pantallas reales es un prompt
aparte, después de que esto se audite.

## 1. Archivo nuevo: `appsweb/angular/src/app/shared/ui/web/table/table.ts`

Un solo archivo con 3 exports. Usa Angular signals (`input()`, `output()`,
`signal()`, `computed()`, `contentChild()` — API de queries por señal, no
`@ContentChild` de decorador) y `changeDetection: ChangeDetectionStrategy.OnPush`.

### 1.1 `AppSortableColumn` (directiva)

```ts
@Directive({
  selector: "[appSortableColumn]",
  host: {
    role: "button",
    tabindex: "0",
    class: "app-table-sortable-column",
    "[class.app-table-sorted]": "isActive()",
    "(click)": "onActivate()",
    "(keydown.enter)": "onActivate()",
  },
})
export class AppSortableColumn {
  appSortableColumn = input.required<string>();
  private table = inject(AppTable);
  protected isActive = computed(() => this.table.sortField() === this.appSortableColumn());
  protected onActivate(): void {
    this.table.sort(this.appSortableColumn());
  }
}
```

Debe funcionar tanto con atributo estático (`appSortableColumn="code"`)
como con binding (`[appSortableColumn]="col.field"`) — es el mismo
`input()`, no hace falta nada especial.

### 1.2 `AppSorticon` (componente)

Selector `app-sorticon`. Un solo input `field = input.required<string>()`.
Inyecta `AppTable` igual que la directiva. Renderiza (usando `<app-icon>`
de `@ui/shared/app-icon/app-icon`, mismo patrón que usa `accordion.ts`):

- Si `table.sortField() === field()` y `table.sortOrder() === 1`: ícono
  `material-symbols-light:arrow-upward`.
- Si `table.sortField() === field()` y `table.sortOrder() === -1`: ícono
  `material-symbols-light:arrow-downward`.
- Si no está activo: no renderiza ningún ícono (deja el espacio vacío,
  sin parpadeo de layout — usa una clase `.app-table-sorticon` con
  `min-width`/`display:inline-block` fijo en el SCSS para reservar el
  espacio incluso vacío).

### 1.3 `AppTable` (componente principal)

Selector `app-table`. **Importante:** usa `host: { class: "app-table" }`
en el decorador — esto hace que la clase `app-table` se combine con
cualquier `class="custom-table card"` que ponga el consumidor en el
mismo elemento host (`<app-table class="custom-table card">` termina
generando `class="app-table custom-table card"` en el DOM real), igual
que hace PrimeNG hoy con `.p-datatable` + `styleClass`. Esto es clave
para que el CSS renombrado (§3) enganche.

**Inputs** (todos `input()`, con estos nombres y defaults exactos —
deben poder recibir binding directo desde los 4 consumidores del piloto
sin cambiar el nombre del `@Input` en ninguno de ellos):

| Input | Tipo | Default |
|---|---|---|
| `value` | `any[]` | `[]` |
| `loading` | `boolean` | `false` |
| `lazy` | `boolean` | `false` |
| `paginator` | `boolean` | `false` |
| `rows` | `number` | `30` |
| `rowsPerPageOptions` | `number[]` | `[30,50,75,100,150,200]` |
| `totalRecords` | `number` | `0` |
| `showCurrentPageReport` | `boolean` | `false` |
| `currentPageReportTemplate` | `string` | `"Mostrando {first} a {last} de {totalRecords} registros"` |
| `globalFilterFields` | `string[]` | `[]` |
| `scrollable` | `boolean` | `false` |
| `scrollHeight` | `string \| undefined` | `undefined` |
| `tableStyle` | `Record<string,string> \| undefined` | `undefined` (se aplica como `[ngStyle]` al `<table>` interno) |
| `size` | `"small" \| undefined` | `undefined` (si es `"small"`, agrega clase `app-table-sm` al elemento `<table>`) |

**Output:** `onPage = output<{ first: number; rows: number }>()` — mismo
shape que usan hoy `onPageChange(event)` en los consumidores reales
(`event.first`, `event.rows`), no cambies esa forma.

**Slots de contenido**, leídos con `contentChild('<nombre>', { read: TemplateRef })`
(uno por cada nombre exacto — son los mismos nombres de `#referencia`
que ya usan las 341 plantillas hoy, no se renombran):
`caption`, `header`, `body`, `emptymessage`, `paginatorleft`.

- `body` se proyecta con contexto `{ $implicit: item }` por cada fila
  (igual que hoy `let-item` en `<ng-template #body let-item>`).
- Si `paginator()` es `true`, el slot `paginatorleft` se renderiza junto
  a los controles de paginación (ver plantilla abajo).

**Estado interno y lógica (signals privados, expuestos donde haga falta
como `protected`/público para que `AppSortableColumn`/`AppSorticon` los
lean vía `inject(AppTable)`):**

- `sortField = signal<string | null>(null)`, `sortOrder = signal<1|-1>(1)`
  — públicos (los lee `AppSorticon`). Método público `sort(field: string)`:
  si `field === sortField()` invierte `sortOrder`, si no, fija
  `sortField = field` y `sortOrder = 1`.
- `filterTerm = signal("")`, privado. Método público
  `filterGlobal(term: string, _mode: string): void` — fija `filterTerm`
  y resetea la página actual a 0. El segundo parámetro (`mode`) se
  recibe pero no se usa todavía (los 4 consumidores del piloto solo
  llaman con `"contains"`, no hace falta soportar otros modos ahora).
- `currentPageIndex = signal(0)`, privado (0-based).
- `filteredValue = computed()`: si `lazy()` es `true`, devuelve `value()`
  tal cual (el filtrado ya lo hizo el backend). Si no, filtra `value()`
  por `filterTerm()` contra los campos de `globalFilterFields()`
  (comparación `String(item[field]).toLowerCase().includes(term.toLowerCase())`,
  ignorar si `filterTerm()` está vacío).
- `sortedValue = computed()`: si `lazy()` es `true`, devuelve
  `filteredValue()` tal cual (el orden ya lo hizo el backend). Si no y
  `sortField()` tiene valor, ordena `filteredValue()` por ese campo con
  `sortOrder()`.
- `pagedValue = computed()`: si `lazy()` es `true`, devuelve
  `sortedValue()` tal cual (el consumidor ya manda solo la página
  actual). Si `paginator()` es `false`, devuelve `sortedValue()`
  completo. Si no, corta `sortedValue()` en
  `[currentPageIndex()*rows(), +rows()]`.
- `effectiveTotal = computed()`: `lazy() ? totalRecords() : filteredValue().length`.
- `pageCount = computed(() => Math.max(1, Math.ceil(effectiveTotal() / rows())))`.
- `pageReport = computed()`: sustituye `{first}`/`{last}`/`{totalRecords}`
  en `currentPageReportTemplate()` (first = `currentPageIndex()*rows()+1`
  acotado a `effectiveTotal()`; last = `min((currentPageIndex()+1)*rows(), effectiveTotal())`).
- Método `goToPage(index: number)`: fija `currentPageIndex`, emite
  `onPage.emit({ first: index*rows(), rows: rows() })`.

**Plantilla** (estructura exacta — los nombres de clase deben coincidir
con la tabla de mapeo del §3, porque el CSS ya renombrado los va a
buscar por ese nombre):

```html
@if (captionTpl(); as caption) {
  <div class="app-table-caption">
    <ng-container [ngTemplateOutlet]="caption" />
  </div>
}
<div class="app-table-scroll" [style.max-height]="scrollable() ? scrollHeight() : null">
  <table class="app-table-table table" [class.app-table-sm]="size() === 'small'" [ngStyle]="tableStyle()">
    <thead class="app-table-thead">
      <ng-container [ngTemplateOutlet]="headerTpl() ?? null" />
    </thead>
    <tbody class="app-table-tbody">
      @if (pagedValue().length === 0) {
        <ng-container [ngTemplateOutlet]="emptymessageTpl() ?? null" />
      } @else {
        @for (item of pagedValue(); track $index) {
          <ng-container [ngTemplateOutlet]="bodyTpl() ?? null"
                        [ngTemplateOutletContext]="{ $implicit: item }" />
        }
      }
    </tbody>
  </table>
</div>
@if (paginator()) {
  <div class="app-table-paginator">
    @if (paginatorleftTpl(); as footer) {
      <div class="app-table-paginator-left">
        <ng-container [ngTemplateOutlet]="footer" />
      </div>
    }
    @if (showCurrentPageReport()) {
      <span class="app-table-page-report">{{ pageReport() }}</span>
    }
    <div class="app-table-paginator-controls">
      <button type="button" class="app-table-paginator-element"
              [disabled]="currentPageIndex() === 0"
              (click)="goToPage(currentPageIndex() - 1)">‹</button>
      @for (p of pageCount() | numberRange; track p) {
        <button type="button" class="app-table-paginator-element"
                [class.is-active]="p === currentPageIndex()"
                (click)="goToPage(p)">{{ p + 1 }}</button>
      }
      <button type="button" class="app-table-paginator-element"
              [disabled]="currentPageIndex() >= pageCount() - 1"
              (click)="goToPage(currentPageIndex() + 1)">›</button>
    </div>
  </div>
}
```

`numberRange` no existe todavía — no inventes un pipe nuevo si no hace
falta: puedes reemplazar el `@for (p of pageCount() | numberRange)` por
un `computed()` que devuelva `Array.from({length: pageCount()}, (_, i) => i)`
y iterar ese array directo. Usa lo que sea más simple, no es una decisión
que necesite confirmarse.

**Antes de seguir con el resto del prompt**, verifica esto en aislamiento
(un solo `ng serve` rápido con `bank-list-desktop.html` apuntando ya al
nuevo `<app-table>`, ver §4): que `inject(AppTable)` funcione de verdad
dentro de `AppSortableColumn`/`AppSorticon` cuando están declarados
dentro de un `<ng-template #header>` que se proyecta vía `contentChild`
+ `ngTemplateOutlet`. Es una técnica estándar de Angular (el
`ViewContainerRef` donde vive el `[ngTemplateOutlet]` es el de
`AppTable`, así que la inyección debería resolver hacia arriba sin
problema), pero **no se ha probado antes en este repo con esta
combinación exacta** — si `inject(AppTable)` da error de "no provider",
avisa antes de seguir en vez de improvisar un workaround silencioso.

## 2. Reusar tal cual (no tocar su lógica, solo el tipo si hiciera falta)

- `primeng-custom-caption.ts` — su input `dt` ya es `input<any>()`, no
  hace falta cambiar nada, `table.filterGlobal(term, "contains")` va a
  llamar al método nuevo de `AppTable` sin saber que cambió de clase.
- `primeng-custom-table-emptymessage.ts` y `primeng-custom-table-footer.ts`
  — cero cambios, ya son 100% propios.

## 3. Renombrar selectores en 2 hojas SCSS (mismos valores, ni un color cambia)

Archivos: `appsweb/angular/src/styles/custom/_custom-table.scss` y
`appsweb/angular/src/styles/web/_prime-table.scss`. **Lee el archivo
completo antes de tocarlo** — no asumas la estructura por este resumen.
Renombra exactamente estos selectores (deja intactas todas las
declaraciones de propiedades/valores/`var(--ds-*)`, solo cambia el
nombre de la clase que los activa):

| Selector actual | Selector nuevo |
|---|---|
| `.custom-table.p-datatable`, `.custom-table .p-datatable`, `&.p-datatable` (dentro de `.custom-table {}`) | `.custom-table.app-table`, `&.app-table` |
| `.p-datatable-header` | `.app-table-caption` |
| `.p-datatable-wrapper` | `.app-table-scroll` |
| `.p-datatable-table` | `.app-table-table` (deja también el selector genérico `table` tal cual, sin tocar) |
| `.p-datatable-thead` | `.app-table-thead` |
| `.p-datatable-tbody` | `.app-table-tbody` |
| `.p-datatable-tfoot` | `.app-table-tfoot` (sin consumidor real todavía, pórtalo igual) |
| `.p-paginator` | `.app-table-paginator` |
| `.p-paginator-element` | `.app-table-paginator-element` |
| `.p-highlight` (aplicado sobre `.p-paginator-element`, página activa) | `.is-active` (sobre `.app-table-paginator-element.is-active`) |
| `.p-sortable-column` (selector `:hover`) | `.app-table-sortable-column` |
| `p-sorticon`, `.p-sortable-column-icon` (regla de herencia de color) | `app-sorticon`, `.app-table-sorticon` |

**No toques** las clases `row-status-*`, `th-col-*`, `th-selected`,
`th-deselected` — son clases que ponen las propias plantillas de
feature en sus `<tr>`/`<th>`, no cambian de nombre. Solo el selector
PADRE que las envuelve cambia (de `.p-datatable-tbody > tr.row-status-x`
a `.app-table-tbody > tr.row-status-x`, etc.) — sigue la misma regla de
la tabla de arriba.

**El modificador `.custom-table-fixed`** (bloque aparte, al final de
`_custom-table.scss`) usa los mismos selectores `.p-datatable`/
`.p-datatable-table`/`table` — aplícale el mismo renombrado.

## 4. Verificación mínima antes de entregar (no migres las 341 plantillas)

Usa **una sola pantalla real** como banco de pruebas temporal, sin
comprometerte todavía a que quede así: copia
`bank-list-desktop.html`/`.ts` a un archivo de prueba aparte (o
edítalo directamente si prefieres, avisando que lo hiciste) y cambia
`<p-table ...>` por `<app-table ...>` con los mismos inputs/slots
(no debería requerir tocar nada del `<ng-template>` interno salvo
`pSortableColumn="code"` → `appSortableColumn="code"` y
`<p-sorticon field="code" />` → `<app-sorticon field="code" />`).
Verifica en `ng serve`:

1. La tabla renderiza filas, ordena al hacer clic en un encabezado,
   pagina, y el botón "agregar" del caption sigue funcionando
   (`primeng-custom-caption` sin cambios).
2. Visualmente: encabezado azul de marca, bordes redondeados, sombra,
   hover de fila, paginador con el mismo aspecto que tenía con PrimeNG
   — si algo de esto falta, revisa el renombrado del §3 antes de seguir.
3. `npx tsc --noEmit` limpio.
4. **No dejes ese archivo de prueba como cambio final** si lo hiciste
   aparte — bórralo antes de entregar (la migración real de
   `bank-list-desktop.html` es el Prompt 2, que revisamos después de
   auditar este).

## 5. Listo cuando

- `shared/ui/web/table/table.ts` existe con los 3 exports, compilando
  limpio (`npx tsc --noEmit`).
- Las 2 hojas SCSS renombradas, sin ningún valor/color/token cambiado
  (solo nombres de selector) — confírmalo con un `git diff` que muestre
  únicamente renombres de selector, cero cambios de línea con `var(--ds`
  o valores hex/rgba.
- La verificación del §4 hecha y reportada con capturas reales
  (`ng serve`, no descripción) del antes/después visual de una tabla,
  más confirmación de que `inject(AppTable)` funcionó sin error dentro
  del template proyectado.
- Ningún archivo de las 341 plantillas de feature reales tocado (el
  archivo de prueba del §4, si se usó aparte, fue borrado).
- Reporta el `git diff --stat` completo al entregar.
