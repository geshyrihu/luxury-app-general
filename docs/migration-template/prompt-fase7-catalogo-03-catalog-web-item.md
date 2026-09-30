
`@switch (item())` gigante, cada `@case` es una demo independiente.
Migra los 12 casos listados abajo, uno por uno. **No toques** los
demás `@case` del archivo (ya son Bootstrap-nativos).

Archivo:
```
src/app/modules/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-web-item/catalog-web-item.ts
```
(plantilla inline, no hay `.html` separado)

## Imports a cambiar (líneas ~61-73)

```diff
+import { Accordion } from "@ui/web/accordion/accordion";
+import { AccordionPanel } from "@ui/web/accordion/accordion";
+import { WebButtonLabel } from "@ui/buttons/web-label/button";
+import { CustomInputDatepicker } from "@ui/inputs/web/custom-input-datepicker-signal";
+import { CustomInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
+import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
+import { CustomInputMultiselectSignal } from "@ui/inputs/web/custom-input-multiselect-signal";
+import { AppPopover } from "@ui/web/popover/popover";
+import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
+import { AppSelectButton } from "@ui/web/select-button/select-button";
+import { Tabs } from "@ui/web/tabs/tabs";
+import { AppToggleSwitch } from "@ui/web/toggle-switch/toggle-switch";
```
(nombres de clase exportada exactos — verifícalos abriendo cada
archivo fuente antes de usarlos, por si difieren; ajusta `imports:`
del `@Component` para que coincida con lo que uses en el template)

## 1. `@case ("accordion")` (líneas ~252-286)

```diff
-<p-accordion>
-  <p-accordion-panel value="0">
-    <p-accordion-header>Sección 1</p-accordion-header>
-    <p-accordion-content><p class="m-0">Contenido de la primera sección.</p></p-accordion-content>
-  </p-accordion-panel>
-  <p-accordion-panel value="1">...</p-accordion-panel>
-  <p-accordion-panel value="2">...</p-accordion-panel>
-</p-accordion>
+<app-accordion
+  [items]="[
+    { id: '0', title: 'Sección 1' },
+    { id: '1', title: 'Sección 2' },
+    { id: '2', title: 'Sección 3' }
+  ]"
+  [(expandedIds)]="accordionExpandedIds"
+>
+  <ng-template accordionPanel="0"><p class="m-0">Contenido de la primera sección.</p></ng-template>
+  <ng-template accordionPanel="1"><p class="m-0">Contenido de la segunda sección.</p></ng-template>
+  <ng-template accordionPanel="2"><p class="m-0">Contenido de la tercera sección.</p></ng-template>
+</app-accordion>
```
(usa el texto real de los otros 2 paneles, que no se copió completo
arriba — ábrelo y reutilízalo tal cual). Agrega en el `.ts`:
`accordionExpandedIds = signal<string[]>(["0"]);` (o el id que estaba
expandido por defecto).

## 2. `@case ("button")` (líneas ~322-503) — solo la sección de `p-button`

de `il-button` (mismos nombres salvo `warn`→`warning`):

```diff
-<p-button label="Primary" />
-<p-button label="Secondary" severity="secondary" />
-<p-button label="Success" severity="success" />
-<p-button label="Info" severity="info" />
-<p-button label="Warning" severity="warn" />
-<p-button label="Danger" severity="danger" />
-<p-button label="Help" severity="help" />
-<p-button label="Contrast" severity="contrast" />
+<il-button label="Primary" />
+<il-button label="Secondary" severity="secondary" />
+<il-button label="Success" severity="success" />
+<il-button label="Info" severity="info" />
+<il-button label="Warning" severity="warning" />
+<il-button label="Danger" severity="danger" />
+<il-button label="Help" severity="help" />
+<il-button label="Contrast" severity="contrast" />
```
```diff
-<p-button label="Small" size="small" />
-<p-button label="Normal" />
-<p-button label="Large" size="large" />
-<p-button label="Disabled" [disabled]="true" />
-<p-button label="Loading" [loading]="true" />
+<il-button label="Small" size="sm" />
+<il-button label="Normal" />
+<il-button label="Large" size="lg" />
+<il-button label="Disabled" [disabled]="true" />
+<il-button label="Loading" [loading]="true" />
```
(`il-button` usa `size="sm"|"md"|"lg"`, no `"small"|"large"` — ajusta)

**No toques** la sección "Action Buttons - il-button-*/iw-button-*" que
está justo debajo (ya migrada) ni "Icon Button con borde" (guía de

**Los otros 4 `<p-button>` sueltos en otros `@case` de este mismo
archivo** (dentro de `"card"` línea ~525, `"table"` línea ~846,
`"toolbar"` línea ~965, `"tooltip"` líneas ~992-1008) — migra cada uno
a `<il-button>` con el mismo mapeo de props. El de `"toolbar"` usa
`<ng-template #icon>` — conviértelo al input `icon`/`iconClass` de
`il-button` (mismo patrón que en `prompt-fase7-catalogo-01-*.md`
punto 4).

## 3. `@case ("datepicker")` (líneas ~552-565)

```diff
-<p-datepicker [(ngModel)]="dateVal" dateFormat="dd/mm/yy" appendTo="body" />
+<custom-input-datepicker-signal [(ngModel)]="dateVal" dateFormat="dd/mm/yy" [onlyInput]="true" />
```
`dateVal` sigue siendo `Date | null` en el `.ts`, no cambia.

## 4. `@case ("dialog")` (líneas ~566-593)

Mismo problema que `catalog-guia.ts`: NO uses `<app-dialog>` (sigue
`prompt-fase7-catalogo-02-dialog-nativo.md`:

```diff
-<p-button label="Abrir Dialog" (onClick)="dialogVisible.set(true)" />
-<p-dialog header="Ejemplo de Dialog" [(visible)]="dialogVisible" [modal]="true" [style]="{ width: 'min(92vw,30rem)' }">
-  <p>Contenido del dialog. Reservalo para decisiones breves.</p>
-  <ng-template #footer><p-button label="Cerrar" (onClick)="dialogVisible.set(false)" /></ng-template>
-</p-dialog>
+<il-button label="Abrir Dialog" (clicked)="dialogVisible.set(true)" />
+<div class="modal fade" [class.show]="dialogVisible()" [style.display]="dialogVisible() ? 'block' : 'none'" tabindex="-1" role="dialog" [attr.aria-hidden]="!dialogVisible()">
+  <div class="modal-dialog modal-dialog-centered" style="max-width: min(92vw, 30rem);">
+    <div class="modal-content">
+      <div class="modal-header">
+        <h5 class="modal-title">Ejemplo de Dialog</h5>
+        <button type="button" class="btn-close" aria-label="Cerrar" (click)="dialogVisible.set(false)"></button>
+      </div>
+      <div class="modal-body"><p>Contenido del dialog. Reservalo para decisiones breves.</p></div>
+      <div class="modal-footer"><il-button label="Cerrar" (clicked)="dialogVisible.set(false)" /></div>
+    </div>
+  </div>
+</div>
+@if (dialogVisible()) {
+<div class="modal-backdrop fade show"></div>
+}
```
Nota: aquí `dialogVisible` YA es un signal (`signal(false)`) a
diferencia de `catalog-guia.ts` donde era boolean plano — por eso se
llama como función `dialogVisible()` en el template.

## 5. `@case ("inputnumber")` (líneas ~608-636)

```diff
-<p-inputnumber [(ngModel)]="numVal" [showButtons]="true" [min]="0" [max]="100" class="w-full" />
-<p-inputnumber [(ngModel)]="numVal2" mode="currency" currency="MXN" locale="es-MX" class="w-full" />
+<custom-input-number-signal [(ngModel)]="numVal" [min]="0" [max]="100" [onlyInput]="true" class="w-full" />
+<custom-input-number-signal [(ngModel)]="numVal2" [onlyInput]="true" class="w-full" />
```
**Regresión visual aceptada y documentada**: el `<input type="number">`
nativo de `custom-input-number-signal` no formatea con separador de
miles ni símbolo de moneda como hacía `p-inputnumber mode="currency"`
— es una limitación conocida del componente Bootstrap real, no un
error tuyo. Si quieres conservar la etiqueta visual de moneda, agrega
un `<span>` con "MXN" al lado en vez de depender del formateo interno.

## 6. `@case ("multiselect")` (líneas ~674-690)

```diff
-<p-multiselect [options]="selectOptions" [(ngModel)]="multiVal" optionLabel="label" placeholder="Selecciona opciones" appendTo="body" class="w-full" />
+<custom-input-multiselect-signal [data]="selectOptions" [(ngModel)]="multiVal" optionLabel="label" placeholder="Selecciona opciones" [onlyInput]="true" class="w-full" />
```

## 7. `@case ("popover")` (líneas ~691-710)

Cambia de estructura: el trigger se proyecta DENTRO de
`<app-popover>`, no es un botón externo con referencia local:

```diff
-<p-button label="Abrir Popover" #popoverBtn (click)="popover.toggle($event)" />
-<p-popover #popover><div class="p-3">Contenido del popover. Ideal para menus contextuales rapidos.</div></p-popover>
+<app-popover>
+  <il-button appPopoverTrigger label="Abrir Popover" />
+  <div class="p-3">Contenido del popover. Ideal para menus contextuales rapidos.</div>
+</app-popover>
```
Verifica que `appPopoverTrigger` sea el nombre real de la directiva
(revisa `popover.ts`/`popover.base.ts`) antes de usarla — si el
trigger espera un elemento nativo en vez de un componente Angular,
usa `<button appPopoverTrigger class="btn btn-primary">Abrir
Popover</button>` en su lugar.

## 8. `@case ("select")` (líneas ~771-787)

```diff
-<p-select [options]="selectOptions" [(ngModel)]="selectVal" optionLabel="label" placeholder="Selecciona una opcion" appendTo="body" class="w-full" />
+<custom-input-select-signal [data]="selectOptions" [(ngModel)]="selectVal" optionLabel="label" placeholder="Selecciona una opcion" [onlyInput]="true" class="w-full" />
```

## 9. `@case ("selectbutton")` (líneas ~788-801)

```diff
-<p-selectbutton [options]="selectOptions" [(ngModel)]="selectBtnVal" optionLabel="label" />
+<app-select-button [options]="selectOptions" [(value)]="selectBtnVal" />
```

## 10. `@case ("tabs")` (líneas ~861-887)

```diff
-<p-tabs value="0">
-  <p-tablist>
-    <p-tab value="0">General</p-tab>
-    <p-tab value="1">Detalle</p-tab>
-    <p-tab value="2">Documentos</p-tab>
-  </p-tablist>
-  <p-tabpanels>
-    <p-tabpanel value="0"><p class="m-0">Contenido General.</p></p-tabpanel>
-    <p-tabpanel value="1">...</p-tabpanel>
-    <p-tabpanel value="2">...</p-tabpanel>
-  </p-tabpanels>
-</p-tabs>
+<app-tabs
+  [tabs]="[
+    { id: '0', label: 'General' },
+    { id: '1', label: 'Detalle' },
+    { id: '2', label: 'Documentos' }
+  ]"
+  [(activeId)]="webItemTabActiveId"
+>
+  <div tab="0"><p class="m-0">Contenido General.</p></div>
+  <div tab="1"><p class="m-0">Contenido de Detalle.</p></div>
+  <div tab="2"><p class="m-0">Documentos adjuntos.</p></div>
+</app-tabs>
```
(usa el texto real de los paneles 2 y 3, no se copió completo arriba).
Agrega en el `.ts`: `webItemTabActiveId = signal("0");`

## 11. `@case ("toggleswitch")` (líneas ~941-953)

```diff
-<p-toggleswitch [(ngModel)]="toggleVal" />
+<app-toggle-switch [(checked)]="toggleVal" />
```
`toggleVal` ya es un `signal(false)` — el binding de dos vías
`[(checked)]` funciona igual con `model()`.

## Verificación

- `npx tsc --noEmit`: 0 errores nuevos.
- `ng build` **redirigido a archivo completo (`> log 2>&1`), revisa el
  log entero con `grep -c ERROR`, no uses `tail`**.
- Capturas reales de los 12 casos en el catálogo — cada demo debe
  verse y comportarse igual (con la única excepción documentada y
  aceptada del formateo de moneda en inputnumber).

## Listo cuando

- Capturas de los 12.
- `tsc`/build limpios.
