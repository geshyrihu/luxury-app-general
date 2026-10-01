# 05 — Caso profundo: Tablas (`p-table`) y Modales (`DynamicDialog`)

📅 Creado: 2026-09-12
🎯 Motivo: estos son los dos puntos más grandes y más transversales de todo
el plan (`02-plan-migracion.md` Fase 6 para tablas y Fase 4 para modales —
numeración v2, reordenada por riesgo — y Grupo 1/Grupo 4 de
`03-inventario-componentes.md`). Este documento baja el análisis a código
real usando dos ejemplos concretos pedidos:

- Tabla: `appsweb/angular/src/app/modules/shared.luxuryapp/catalogos-generales/banks/desktop/bank-list-desktop.html`
- Modal: `appsweb/angular/src/app/core/services/dialog-handler.service.ts`

Corrige y afina lo dicho en `01-analisis-estado-actual.md` y
`03-inventario-componentes.md`: al leer el código real, la complejidad
resultó **menor de lo estimado** en varias piezas y **hay un patrón ya
probado en el propio repo** que resuelve el problema difícil de los
modales.

---

## Parte A — Tablas

### A.1 Lo que hace hoy `bank-list-desktop.html` (caso real, representativo)

```html
<p-table
  [globalFilterFields]="globalFilterFields()"
  [paginator]="true"
  [rowsPerPageOptions]="rowsPerPageOptions"
  [scrollable]="true"
  [scrollHeight]="scrollHeight()"
  [showCurrentPageReport]="true"
  [tableStyle]="{ 'min-width': '50rem' }"
  [value]="data()"
  #dt
  currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
  class="custom-table card"
>
  <ng-template #caption>
  </ng-template>
  <ng-template #header>
    <tr><th pSortableColumn="code">Codigo <p-sorticon field="code" /></th>...</tr>
  </ng-template>
  <ng-template #body let-item>
    <tr><td>{{ item.code }}</td>...<td><iw-button-edit .../><iw-button-delete .../></td></tr>
  </ng-template>
  <ng-template #emptymessage>
  </ng-template>
  <ng-template #paginatorleft>
  </ng-template>
</p-table>
```

Esto es el patrón usado en **341 plantillas** (medido en el análisis). Es
prácticamente idéntico en todas: paginación cliente, scroll vertical,
ordenamiento por columna, filtro global disparado desde el caption, fila
vacía con `app-empty-state`, pie con conteo. Los botones de fila
(`iw-button-edit`, `iw-button-delete`) **ya son Bootstrap** (ver hallazgo
del análisis §4).


Se leyó el código de los 3 sub-wrappers para separar mito de realidad:

|---|---|---|
| `p-table` en sí (paginación, orden, scroll, filtro, slots `#header/#body/#caption/#emptymessage/#paginatorleft`) | **Sí, 100%.** | Esto es lo único que realmente hay que reconstruir. |

> ⚠️ **Corrección grave 2026-09-15 (auditoría de maestro antes de escribir el
> prompt del lote piloto): la fila de `.custom-table` de la tabla de arriba
> era falsa.** No se había leído el archivo real. Se corrige aparte porque
> el hallazgo es grande — ver A.2bis.

### A.2bis `.custom-table`/`_prime-table.scss` — hallazgo real (2026-09-15)

Se leyeron completos `src/styles/custom/_custom-table.scss` (273 líneas) y
override visual base — uno de los "9 archivos `web/_prime-*.scss`" que
`03-inventario-componentes.md` Grupo 6 da por "retirar en Fase 7 cuando el
componente asociado esté 🟢", asumiendo implícitamente que para entonces ya
no hace falta. **Esa asunción es incorrecta si nadie porta sus reglas
antes** — ver por qué abajo).

**Lo único genuinamente genérico** en `_custom-table.scss` son las reglas
`colgroup col.table-col-*` (líneas 16-64, anchos de columna por clase
`table-col-N`/`table-col-sm`/etc.) — esas sí sobreviven tal cual, coincide
con lo que decía este documento.

**Todo lo demás de `_custom-table.scss` (líneas 66-272) y el 100% de
`app-table` no va a generar:**

|---|---|---|
| `.custom-table.p-datatable` / `.custom-table .p-datatable` | Layout flex/altura del contenedor completo | La tabla deja de llenar su contenedor con scroll interno |
| `.p-datatable-wrapper` | El área con scroll vertical real | `[scrollable]`/`[scrollHeight]` deja de funcionar |
| `.p-datatable-table` / `table` (dentro de `.p-datatable`) | `min-width`, `border-collapse`, `font-size` base | Tabla sin tamaño de fuente ni ancho mínimo consistente |
| `.p-datatable-thead > tr > th` | **Encabezado azul de marca**, texto centrado, color de ícono de orden heredado | Encabezado vuelve al gris por defecto de Bootstrap, sin centrar |
| `.p-datatable-thead > tr > th.p-sortable-column:hover` | Hover del encabezado ordenable | Sin feedback visual al pasar el mouse sobre columnas ordenables |
| `.p-datatable-tbody > tr.row-status-{completed,in-progress,reopened,not-started} > td:first-child` | Borde izquierdo de color por estado de tarea (usado en tableros de tareas) | Filas pierden el indicador visual de estado |
| `.p-datatable-thead > tr > th.th-{selected,deselected,col-dark,col-green,col-orange,col-red,col-blue-medium,col-blue-dark,col-navy}` | 9 variantes de color de encabezado por columna (usadas para resaltar columnas específicas en varias tablas financieras/reportes) | Todas las columnas resaltadas vuelven al color por defecto |
| `.custom-table-fixed` (modificador completo, `.p-datatable-table`/`table` + `.table-col-{7,5,12,50,3,13,10}`) | Modo "sin scroll horizontal" con anchos fijos, usado explícitamente en algunas tablas | Se rompe el modo `custom-table-fixed` donde se use |
| **Todo `_prime-table.scss`** (`.p-datatable` completo: `border-radius`, `box-shadow`, `border`, `.p-datatable-thead`/`.p-datatable-tbody`/`.p-datatable-tfoot`, `.p-paginator`/`.p-paginator-element`/`.p-highlight`) | **La piel visual base de absolutamente todas las tablas de la app**: radio de borde, sombra, borde, padding de celda, hover de fila, y el paginador completo (botones, página activa) | **Cada una de las 334 tablas pierde su aspecto base** — no es un caso de borde, es el default de todas |

**Consecuencia real para el diseño de A.4:** construir `app-table` no es
solo "un componente nuevo que reemplace `p-table`" — también requiere
**renombrar en el sitio** (mismos valores, mismos tokens `--ds-*`, sin
tocar ningún color) los selectores de estos dos archivos SCSS para que
apunten al DOM que `app-table` sí genera. Es trabajo mecánico (tabla de
mapeo 1:1 abajo) pero es **trabajo real y bloqueante** — sin él, el lote
piloto se vería visualmente roto aunque el componente funcione
correctamente. Se incluye como parte del mismo prompt de construcción del
componente (ver `04-bitacora-cambios.md`, entrada 2026-09-15, para el
mapeo exacto de clases entregado al chalán).

**Corrección a `03-inventario-componentes.md` Grupo 6:** la fila de los
"9 archivos `web/_prime-*.scss`, retirar en Fase 7" es correcta como
destino final, pero **`_prime-table.scss` específicamente no se puede
borrar sin más en Fase 7** — sus reglas deben migrar (renombradas) a la
hoja de `app-table` antes, no después. Igual aplica a `_custom-table.scss`
(ese no está en la lista de retiro, pero su acoplamiento interno sí debe
corregirse ahora, no en Fase 7).

**Conclusión revisada:** de las 4 piezas que forman "el ecosistema de
tocar. Pero el ecosistema real tiene una **quinta pieza no contada antes**
— el CSS base (2 archivos) — que sí requiere trabajo mecánico dirigido
antes de que el lote piloto se vea bien.

### A.3 Datos de uso que definen el diseño del reemplazo

Medido sobre `app/modules/**`:

| Característica usada | Nº de plantillas | Lectura |
|---|---:|---|
| `pSortableColumn` (orden por columna) | 178 | Más de la mitad de las tablas ordenan — el reemplazo necesita orden por columna de fábrica |
| `[scrollable]="true"` (scroll interno con header fijo) | 183 | Mayoría con scroll interno — el reemplazo necesita contenedor con `overflow` + header sticky |
| `[lazy]="true"` / `(onLazyLoad)` (paginación server-side) | **12** | Minoría clara — la mayoría de tablas pagina/ordena/filtra sobre un array ya cargado en memoria (client-side) |

**Decisión de diseño que se desprende de estos números:** construir el
nuevo componente **primero para el caso client-side** (que cubre la
inmensa mayoría: paginar/ordenar/filtrar un array ya cargado), y resolver
las 12 pantallas con `lazy`/`onLazyLoad` como un modo aparte explícito
(`[lazy]="true"` + `(onLazyLoad)`) en una segunda pasada dentro de la
misma Fase 6, no como bloqueante del resto.

### A.4 Propuesta concreta de componente de reemplazo

**No se propone traducir cada tabla a HTML de Bootstrap "a pelo".** Se
propone construir un componente propio (`app-table`, en
`@ui/web/table/`) que:

1. Renderiza un `<table class="table">` real de Bootstrap por debajo,
   envuelto en `.custom-table` (se reutiliza el SCSS existente).
2. **Conserva la ergonomía de slots por `ng-template` con nombre**
   (`#caption`, `#header`, `#body let-item`, `#emptymessage`,
   `#paginatorleft`/`#footer`), leyéndolos vía `@ContentChild(TemplateRef)`
   + `ngTemplateOutlet` — la misma técnica que usa Angular nativo (y que
   respeta el mismo contrato de nombres de template, el contenido interno
   de cada `<ng-template>` (el `<tr><td>...` de cada fila, las columnas del
   header) **no cambia**, solo cambia la etiqueta contenedora de
   `<p-table ...>` a `<app-table ...>` y el nombre de un puñado de
   `@Input` (`[value]` se mantiene, `[paginator]`/`[rows]` se mantienen o
   se renombran de forma mínima).
3. Expone `filterGlobal(term, mode)` públicamente (para no tocar
4. Implementa orden por columna con una directiva propia
   `appSortableColumn="campo"` (mismo nombre de atributo que
   `pSortableColumn` es tentador para minimizar diffs, pero **se decide en
   Fase 6** si conservar el nombre histórico o renombrar — cualquiera de
   las dos formas es un `sed` masivo, no una reescritura manual).
5. Paginación client-side con `NgbPagination` o `.pagination` nativo de
   Bootstrap; scroll interno con CSS (`max-height` + `overflow-y: auto` +
   `position: sticky` en `thead`) reemplazando `[scrollable]`/
6. Modo `[lazy]="true"` + `(onLazyLoad)` como capa opcional para las 12
   pantallas server-side, con la misma forma de evento que hoy (para no
   reescribir la lógica de esas 12 pantallas, solo el componente que la
   dispara).

### A.5 Costo real estimado por fila de plantilla

Con el diseño de A.4, el cambio típico en cada una de las 341 plantillas
se reduce a:

```diff
- <p-table
+ <app-table
    [globalFilterFields]="globalFilterFields()"
    [paginator]="true"
    ...
    #dt
    class="custom-table card"
- >
+ >
    <ng-template #caption> ... sin cambios ... </ng-template>
    <ng-template #header>
-     <th pSortableColumn="code">Codigo <p-sorticon field="code" /></th>
+     <th appSortableColumn="code">Codigo <app-sorticon field="code" /></th>
    </ng-template>
    <ng-template #body let-item> ... sin cambios ... </ng-template>
    <ng-template #emptymessage> ... sin cambios (mismo sub-componente) ... </ng-template>
    <ng-template #paginatorleft> ... sin cambios (mismo sub-componente) ... </ng-template>
- </p-table>
+ </app-table>
```

Esto **no elimina** el trabajo de tocar 341 archivos, pero sí lo reduce de
"reescribir la tabla" a "un cambio mecánico y acotado por archivo",
viable con un codemod/`sed` guiado tras el lote piloto (ver
`02-plan-migracion.md` Fase 6, punto 4-5).

### A.6 Reorder de filas: contrato implementado — 2026-09-18

El contrato final de reorder en `AppTable` es:

```html
<app-table
  [reorderableRows]="true"
  (onRowReorder)="onRowReorder($event)"
>
  <ng-template #body let-item let-rowIndex="rowIndex">
    <tr [pReorderableRow]="rowIndex">
      <td>
        <app-icon pReorderableRowHandle />
      </td>
    </tr>
  </ng-template>
</app-table>
```

La directiva `pReorderableRowHandle` marca el elemento handle como
`draggable="true"`. La directiva `pReorderableRow` escucha el `dragstart` que
burbujea desde ese elemento y controla el destino. El gate
`[reorderableRows]` cancela drag/drop cuando está desactivado.

El primer intento colocaba `draggable="true"` en `<tr>` y validaba que
`event.target` fuera el handle. En eventos nativos de drag, `event.target` era
la fila, por lo que el arrastre siempre se cancelaba. La corrección conserva
la protección contra arrastre desde cualquier otra celda y permite iniciar
solo desde el handle.

`onRowReorder` no muta automáticamente la fuente del consumidor. Cada pantalla
debe aplicar `dragIndex`/`dropIndex`, actualizar su signal y persistir el orden
según su API. `task-list` además conserva un flujo independiente para arrastrar
dependencias, identificado por `application/task-link`.

Estado: implementado en `AppTable`, aplicado a 10 consumidores y probado en
navegador en Listado de Tickets. TypeScript, build production y `audit:ui`
verificados correctamente.

### A.7 `colgroup` y anchos explícitos — 2026-09-18

Se cerraron dos brechas de paridad detectadas después de la migración:

- `AppTable` expone `#colgroup` como plantilla soportada y la inserta dentro de
  `<table>` antes de `<thead>`. Esto reactiva los 7 `colgroup` existentes que
  antes quedaban ignorados.
- `table-col-*` rem/px se aplica tanto a `<col>` como a `<th>`/`<td>`. Antes,
  las reglas rem solo existían bajo `colgroup col`, dejando inertes 21 usos en
  celdas.
- Selectores específicos de orden de compra fueron migrados de
  `.p-datatable-*` a `.app-table-*`.
- El control de unidad usa `customClass="w-9rem"`, evitando que
  `width: 100%` dependa del ancho min-content de la celda.

Verificación: `npx tsc --noEmit`, `npm run audit:ui` y
`npx ng build --configuration production` pasan. El CSS compilado contiene
`.custom-table colgroup col.table-col-15rem` y reglas directas para
`.table-col-9rem`.

---

## Parte B — Modales (`DynamicDialog`)

### B.1 Lo que hace hoy `dialog-handler.service.ts`

Es el único punto de entrada para abrir formularios/diálogos en toda la
app: `openDialog(component, data, title, size)` y
`openDialogCustom(component, config)`, ambos devuelven `Promise<T>`. Por
dentro:

- **Rama móvil** (`PlatformService.isMobile()`): usa `ModalController` de
  Ionic con un wrapper propio, `IonicDialogModal`.
- El archivo **re-exporta** los tipos: `export { DialogService,
  DynamicDialogConfig, DynamicDialogRef, DialogSize };` — es decir, ya
  actúa como un barrel local.

### B.2 El dato que cambia todo: quién importa qué

| Origen del import | Nº de archivos |
|---|---:|
| `from ".../core/services/dialog-handler.service"` (barrel local) | **610** |

**Lectura:** el 90%+ del consumo real de "abrir un modal" en la app ya
pasa por un único archivo. Si ese archivo sigue exportando los mismos
4 símbolos (`DialogService`, `DynamicDialogConfig`, `DynamicDialogRef`,
`DialogSize`) con la misma forma de uso (`config.data`, `ref.close(value)`,
`ref.onClose`, `ref.onDestroy`), **los 610 archivos no cambian una sola
línea**. Solo hay que reconciliar (Fase 0, ya lo dice el plan general) los
mayoría son specs o los propios archivos de infraestructura que sí se
tocan de todas formas al implementar el reemplazo.

### B.2bis Qué API se usa realmente (reverificado 2026-09-15, código real)

Antes de diseñar el motor propio se midió exactamente qué parte de la
API de `DialogHandlerService`/`DialogConfig` se ejerce de verdad en
producción (no specs), para no construir soporte para superficie que
nadie usa:

| Método/opción | Consumidores reales | Lectura |
|---|---:|---|
| `openDialog(component, data, title, size, autoMaximize?)` | **262** | Es prácticamente el 100% del uso real |
| `openDialogCustom(component, config)` | **3** (`committee-cobranza-mobile.ts`, `committee-cobranza-web.ts`, `directorio.ts`) — y los 3 solo pasan `{ title, size, data }`, **ningún otro campo del `DialogConfig`** | El método "avanzado" existe pero nadie ejerce nada que `openDialog()` no ofrezca ya |
| `autoMaximize: true` | **12**, todos visores de reportes grandes (fondeos, estados financieros, informes de comité, biblioteca de consejo) | Real y deliberado — se preserva |
| `dismissableMask` | **0** en `DialogConfig` real (el único hit de grep, `command-palette.ts`, es un componente aparte que **no** usa `DialogHandlerService`, es su propio overlay CDK) | Sin uso real |
| `position` (`DialogConfig.position`) | **0** en `DialogConfig` real (todos los hits de grep eran de otros sistemas: `echarts`, `toast`, páginas de catálogo/demo) | Sin uso real |
| `extraOptions` | **0** | Sin uso real |
| `width`/`height`/`breakpoints`/`contentStyle`/`closeOnEscape`/`modal`/`baseZIndex` overrides | **0** (solo los defaults hardcodeados en el propio servicio) | Sin uso real |

**Distribución real de `size`** (sobre los 262+3 consumidores, contando
tanto las constantes `dialogS.sizeXx` como `DialogSize.xx` directo):
`sm` ≈ 22, `md` ≈ 55, **`lg` ≈ 192 (dominante)**, `full` ≈ 64. Prioridad
de prueba manual: `lg` primero, `full` segundo.

**Conclusión de diseño:** el motor propio solo necesita cubrir
`openDialog()` con sus 5 parámetros y las 4 constantes de tamaño. No
hace falta replicar `position`, `dismissableMask`, `extraOptions`, ni
overrides de `width`/`height`/`contentStyle` — se pueden retirar de
`DialogConfig`/`openDialogCustom` sin perder nada real (si se prefiere
mantener el método por compatibilidad de firma, puede quedar como alias
delgado de `openDialog()`, ya que eso es exactamente lo que hacen sus 3
únicos consumidores).

**Decisión registrada 2026-09-15 (confirmada con el usuario):**
`draggable`/`resizable` **quedan fuera de alcance** del motor propio —
0 evidencia de uso deliberado en los 265 consumidores reales, siempre
están en su valor por defecto. Es una decisión consciente y documentada,
no una pérdida silenciosa; se puede agregar puntualmente después si
algún flujo real lo reclama. `maximizable`/`autoMaximize` **sí se
preserva** (12 usos reales) vía `NgbModalRef.update({ fullscreen: true
})`.

### B.3 El hueco real no es "abrir un modal" — es la carcasa (header + botón cerrar)

renderiza el header (`title`), el botón de cerrar (X) y el ícono de
maximizar **por fuera** del componente de formulario — es chrome propio
de `<p-dynamicdialog>`, no algo que cada uno de los ~170+ formularios
dibuje. Ninguno de esos formularios tiene en su propio template un
`<div class="modal-header">` ni un botón de cerrar: asumen que ya viene
puesto.

`NgbModal.open(MiFormulario, {...})` de ng-bootstrap **no genera esa
carcasa automáticamente** — si se migrara así, sin más, cada modal se
abriría mostrando *solo* el contenido del formulario, sin título ni
botón de cerrar visibles. Este es el verdadero riesgo de "perder el
beneficio actual", no `draggable`/`resizable`.

**La solución ya existe en este mismo repo, para el caso móvil.** Ver
B.3bis abajo.

### B.3bis El patrón que ya existe en el repo y resuelve el problema (hallazgo clave)

`IonicDialogModal` (`core/services/ionic-dialog-modal.ts`) **ya resuelve
exactamente este problema para el caso móvil**, y su técnica es
directamente trasladable a Bootstrap:

```ts
// Extracto real de ionic-dialog-modal.ts
const dialogRefStub = {
  onClose: this.closeSubject.asObservable(),
  onDestroy: this.destroySubject.asObservable(),
  close: (result) => this.finish(result),
} as unknown as DynamicDialogRef;

const dialogConfigStub = {
  data: this.data,
  header: this.title,
} as unknown as DynamicDialogConfig;

this.formInjector = Injector.create({
  parent: this.parentInjector,
  providers: [
    { provide: DynamicDialogConfig, useValue: dialogConfigStub },
    { provide: DynamicDialogRef, useValue: dialogRefStub },
  ],
});
```

El formulario que se renderiza dentro (`ngComponentOutlet` +
`formInjector`) sigue haciendo `inject(DynamicDialogConfig).data` e
real detrás**. Es un stub inyectado por DI.

### B.3ter Diseño confirmado: `DesktopDialogShell`, gemelo de `IonicDialogModal`

**Verificado directamente contra
`node_modules/@ng-bootstrap/ng-bootstrap` (versión instalada `21.0.0`,
tipos en `types/ng-bootstrap-ng-bootstrap-modal.d.ts`) — ya no es una
decisión pendiente:**

- `NgbModalOptions.injector?: Injector` **existe** — la técnica de stub
  vía `Injector.create()` funciona tal cual, sin cambiar de versión.
- `NgbModalOptions.backdrop: boolean | 'static'` → mapea directo a
  fuera).
- `NgbModalOptions.keyboard: boolean` → mapea directo a `closeOnEscape`.
- `NgbModalOptions.size: 'sm' | 'lg' | 'xl' | string` → cualquier string
  no estándar se pasa como clase `modal-{size}`, suficiente para los 4
  tamaños propios (`DialogSize` ya usa nombres de clase Bootstrap:
  `modal-sm`/`modal-md`/`modal-lg`/`modal-fullscreen` — ver B.2bis, el
- `NgbModalOptions.fullscreen` + `NgbModalRef.update({ fullscreen: true
  })` → cubre `autoMaximize` (12 usos reales) de forma más simple que
- `NgbModalRef.result: Promise<any>` **se resuelve** con `.close(value)`
  `subscribeToDialogClose` actual siempre *resuelve* (nunca rechaza),
  incluso al cerrar con X/Escape/backdrop sin pasar valor. **Hay que
  replicar ese comportamiento explícitamente** (capturar el rechazo y
  resolver con `undefined`) para no introducir `UnhandledPromiseRejection`
  en los 265 consumidores que hoy esperan que la promesa siempre resuelva.

**Componente nuevo, `DesktopDialogShell`** (mismo rol que
`IonicDialogModal`, pero para escritorio):

```ts
// Boceto — misma técnica que IonicDialogModal, con markup Bootstrap
@Component({
  selector: "lx-desktop-dialog-shell",
  imports: [NgComponentOutlet],
  template: `
    <div class="modal-header">
      <h5 class="modal-title">{{ title }}</h5>
      <button type="button" class="btn-close" (click)="dismiss()" aria-label="Cerrar"></button>
    </div>
    <div class="modal-body">
      <ng-container *ngComponentOutlet="formComponent; injector: formInjector" />
    </div>
  `,
})
export class DesktopDialogShell implements OnInit {
  private readonly activeModal = inject(NgbActiveModal);
  private readonly parentInjector = inject(Injector);
  formComponent!: Type<unknown>;
  data: unknown;
  title = "";
  protected formInjector!: Injector;

  ngOnInit(): void {
    const dialogRefStub = {
      onClose: this.closeSubject.asObservable(),
      onDestroy: this.destroySubject.asObservable(),
      onChildComponentLoaded: this.loadedSubject.asObservable(),
      close: (result?: unknown) => this.finish(result),
    } as unknown as DynamicDialogRef;
    const dialogConfigStub = { data: this.data, header: this.title } as unknown as DynamicDialogConfig;
    this.formInjector = Injector.create({
      parent: this.parentInjector,
      providers: [
        { provide: DynamicDialogConfig, useValue: dialogConfigStub },
        { provide: DynamicDialogRef, useValue: dialogRefStub },
      ],
    });
    // dispara onChildComponentLoaded tras el primer ciclo de detección de
    // cambios, para que `autoMaximize` (que se suscribe a este evento) siga
  }

  private finish(result: unknown): void {
    this.closeSubject.next(result);
    this.destroySubject.next();
    this.activeModal.close(result); // dispara NgbModalRef.result (resuelve)
  }

  protected dismiss(): void {
    this.finish(undefined); // cerrar con X = mismo resultado que hoy (resuelve con undefined, no rechaza)
  }
}
```

`DialogHandlerService.openDialog()` pasaría a hacer, en la rama
desktop:

```ts
const modalRef = this.ngbModal.open(DesktopDialogShell, {
  size: this.getSizeClass(size),      // 'modal-sm' | 'modal-md' | 'modal-lg' | 'modal-fullscreen' → ver nota abajo
  backdrop: true,
  keyboard: true,
  centered: true,
  windowClass: size === DialogSize.full ? "modal-fullscreen" : undefined,
});
modalRef.componentInstance.formComponent = component;
modalRef.componentInstance.data = data;
modalRef.componentInstance.title = title;

if (autoMaximize) {
  modalRef.componentInstance.onLoaded$.subscribe(() => modalRef.update({ fullscreen: true }));
}

return modalRef.result.catch(() => undefined); // dismiss (X/Esc/backdrop) resuelve con undefined, igual que hoy
```

> Nota tamaño: `NgbModalOptions.size` solo reconoce nativamente
> `'sm'|'lg'|'xl'`; como `DialogSize` ya usa nombres de clase Bootstrap
> completos (`modal-sm`, `modal-md`, `modal-fullscreen`), lo más simple
> es **no** usar `size` y en su lugar aplicar la clase directamente vía
> `windowClass`/`modalDialogClass` con el valor del enum — evita
> reinterpretar el mapeo y reutiliza el enum tal cual está hoy.

Con esto, los 265 consumidores reales (`openDialog`/`openDialogCustom`)
no cambian una sola línea: siguen llamando `dialogS.openDialog(Form,
data, title, size)` y el formulario inyectado sigue leyendo
`inject(DynamicDialogConfig).data` / `inject(DynamicDialogRef).close(v)`
que ya funciona hoy en móvil. `DynamicDialogConfig`/`DynamicDialogRef`/
`DialogService`/`DialogSize` se redefinen como **clases/tipos propios**
(mismo nombre, mismo shape mínimo) y se siguen exportando desde
`dialog-handler.service.ts` — los 610 archivos que importan el barrel
por cualquier motivo (tipos, el enum, etc.) no se enteran del cambio.
producción real se redirigen con un cambio de una línea al barrel local
(Fase 0 general, ya en `02-plan-migracion.md`).

### B.4 Piezas de la API actual — estado resuelto tras la verificación 2026-09-15

|---|---:|---|---|
| `DialogSize.sm/md/lg/full` | 265 consumidores reales (`lg` ≈192 dominante, `full` ≈64, `md` ≈55, `sm` ≈22) | El enum **ya usa nombres de clase Bootstrap** (`modal-sm`/`modal-md`/`modal-lg`/`modal-fullscreen`) — se aplican vía `windowClass`, no hace falta reinterpretar nada | ✅ Resuelto — ver B.3ter, nota de tamaño |
| `dialogS.getInstance(ref).maximize()` (auto-maximize) | **12 archivos reales** (no 2 — cifra corregida), todos visores de reportes grandes | `NgbModalRef.update({ fullscreen: true })`, confirmado que existe en `NgbModalOptions`/`NgbModalRef` v21.0.0 | ✅ Resuelto — se preserva, ver B.3ter |
| `draggable` / `resizable` | **0 overrides explícitos** en 265 consumidores — siempre en el default `true`, sin evidencia de uso deliberado | Bootstrap no trae drag/resize nativo; requeriría directivas propias desde cero | ⚪ **Fuera de alcance — decisión confirmada con el usuario 2026-09-15.** Ver B.2bis. Se puede reconsiderar puntualmente si un flujo real lo reclama después |
| `dismissableMask` | **0 usos reales** en `DialogConfig` (el único hit de grep pertenece a otro componente que no usa `DialogHandlerService`) | `NgbModalOptions.backdrop: 'static'`, confirmado en el tipo instalado | ✅ Resuelto — no hace falta exponerlo, o se mapea directo si se decide mantener por compatibilidad de firma |
| `position` (`center/top/bottom/left/right/...`) | **0 usos reales** en `DialogConfig` (los 30 archivos que contenían la palabra `position:` eran de `echarts`, `toast`, páginas demo de catálogo — nada relacionado con `DialogHandlerService`) | Bootstrap centra por defecto (`centered: true`); sin necesidad de más | ✅ Resuelto — no hace falta construir posiciones no-centro |
| `NgbModalRef.result` rechaza en dismiss (X/Esc/backdrop), a diferencia del `subscribeToDialogClose` actual que siempre resuelve | Comportamiento transversal a los 265 consumidores | `.result.catch(() => undefined)` en `openDialog()`/`openDialogCustom()` | ✅ Resuelto — ver snippet B.3ter, **es la única pieza que requiere código explícito de compatibilidad, no un simple mapeo 1:1** |

### B.5 Resumen del enfoque para modales

1. Mantener `DialogHandlerService` como único punto de entrada (no se
   toca su firma pública).
2. Reimplementar la rama desktop sobre `NgbModal` usando **exactamente**
   la técnica de stub-vía-`Injector` que ya usa `IonicDialogModal` para
   móvil — es un patrón probado en este mismo repo, no una apuesta nueva.
   Confirmado que `NgbModalOptions.injector` existe en la versión
   instalada (`21.0.0`), ya no es una decisión pendiente.
3. Construir `DesktopDialogShell` (ver B.3ter) — el componente que
   automáticamente y que ningún formulario dibuja por su cuenta. Este
   es el hueco real a cubrir, no un detalle menor.
4. Redefinir `DynamicDialogConfig`/`DynamicDialogRef`/`DialogService` como
   tipos propios con el mismo shape mínimo, exportados desde el mismo
   archivo. Manejar explícitamente que `NgbModalRef.result` rechaza en
   dismiss (`.catch(() => undefined)`), a diferencia del comportamiento
   actual que siempre resuelve.
5. `draggable`/`resizable` quedan **fuera de alcance** (decisión
   confirmada 2026-09-15, ver B.2bis) — no se construyen. `autoMaximize`
   (12 usos reales) sí se preserva vía `NgbModalRef.update({ fullscreen:
   true })`. `dismissableMask`/`position`/`extraOptions` no tienen uso
   real medido — no hace falta construir soporte para ellos.
   código de producción real hacia el barrel local.
7. Criterio de aceptación: un formulario real (ej. `bank-form` del mismo
   módulo de bancos) abierto vía `openDialog()` debe verse y comportarse
   igual (título visible, botón cerrar visible, abrir, leer
   `config.data`, cerrar con `ref.close(resultado)`, recibir el
   resultado en el `Promise`), más un caso `autoMaximize` (ej.
   `funding-detail.ts`) y un caso `size = full` (el más usado tras `lg`)
   antes de dar la fase por buena.

---

## Actualización a documentos previos

- `03-inventario-componentes.md`: la complejidad de
  ver detalle en A.2 de este documento.
- `02-plan-migracion.md` Fase 6: se incorpora el hallazgo de A.3 (178
  usan sort, 183 usan scroll, solo 12 son lazy/server-side) para
  secuenciar primero el caso client-side.
- `02-plan-migracion.md` Grupo "Feedback y overlays" (`p-dialog`/
  `p-dynamicdialog`): se reemplaza la nota genérica "Alta (DynamicDialog
  tiene lógica propia)" por el enfoque concreto de B.3–B.5.
- **2026-09-15, verificación profunda pedida por el usuario antes de
  ejecutar Fase 4** ("ir a fondo para tener nuestro propio motor que dé
  los beneficios que tenemos con estos modales"): se releyó código real
  (`dialog-handler.service.ts`, `ionic-dialog-modal.ts`, los tipos
  instalados de `@ng-bootstrap/ng-bootstrap`) y se remidieron los 265
  consumidores reales uno por uno. Resultado: decisión #7 del checklist
  de Fase 0 (firma de `Injector` en `NgbModalOptions`) queda **resuelta
  y confirmada** (sí existe en la v21.0.0 instalada); se descubrió que
  el verdadero riesgo no era la reapertura del diálogo sino la carcasa
  B.3ter); y se confirmó con el usuario que `draggable`/`resizable`
  quedan fuera de alcance por falta de evidencia de uso real (B.2bis).
  Ver secciones B.2bis, B.3, B.3bis, B.3ter y B.4 (reescritas).
