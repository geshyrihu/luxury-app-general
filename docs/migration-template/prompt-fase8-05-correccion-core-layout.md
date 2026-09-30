# Prompt Fase 8 — Corrección: `core/layout` quedó incompleto y con una desviación funcional

Auditoría del prompt anterior (`prompt-fase8-04-core-layout-shell.md`):
`tsc`/build están limpios en realidad (el bloqueo reportado por un
módulo ajeno no se reprodujo — probablemente se resolvió solo, era
del WIP del usuario, no relacionado). Pero de los 4 archivos, **2 no
se tocaron en absoluto** y uno de los 2 que sí se tocaron cambió a un
componente equivocado.

## 1. `sidebar.ts` — no se tocó, aplicar tal cual se pidió

```
src/app/core/layout/employee-view/desktop/sidebar/sidebar.ts
```
```diff
+import type { MenuItem } from "@core/interfaces/menu-item.interface";
```
```diff
```
Quita `InputTextModule` también del arreglo `imports:` — confirmado
de nuevo, 0 uso de `pInputText` en `sidebar.html`.

## 2. `home-menu-mobile.ts` — no se tocó, ni se mencionó en el reporte anterior

```
src/app/core/layout/employee-view/movil/home-menu-mobile/home-menu-mobile.ts
```
```diff
+import type { MenuItem } from "@core/interfaces/menu-item.interface";
```

## 3. `header-direccion-desktop.ts` — revertir `AppMenu` por `custom-input-select-signal`

```
src/app/core/layout/direccion-view/desktop/header-direccion-desktop/header-direccion-desktop.ts
src/app/core/layout/direccion-view/desktop/header-direccion-desktop/header-direccion-desktop.html
```

Se implementó con `<app-menu>` en vez de un select real — funciona,
pero **pierde el filtro/búsqueda** que tenía el `<p-select>` original
para clientes (`[filter]="cb_customer.length > 10"`) y rompe la
consistencia con el resto de esta migración (todo `<p-select>` en el
repo se migró a `custom-input-select-signal`, no a menús). Revierte al
patrón original:

```diff
-import { AppMenu } from "@ui/web/menu/menu";
+import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
+import type { MenuItem } from "@core/interfaces/menu-item.interface";
```
(ajusta `imports:` del `@Component`; puedes quitar `customerMenuItems`
si ya no lo usa nada más en el archivo — revísalo primero, no lo
borres a ciegas si algo más lo consume)

En el `.html`, dentro de `<ng-template #center>`:
```diff
-@if (cb_customer.length > 1) {
-  <app-menu [model]="customerMenuItems" [itemTemplate]="customerItem">
-    <button appMenuTrigger type="button" class="customer-selector-btn">
-      <img class="customer-selector-image" [src]="customerPhotoPath()" alt="" aria-hidden="true" />
-      <span>{{ customerName() }}</span>
-      <app-icon icon="material-symbols-light:keyboard-arrow-down" />
-    </button>
-  </app-menu>
-  <ng-template #customerItem let-item>
-    <div class="d-flex align-items-center gap-2 px-3 py-2">
-      <img class="customer-menu-image" [src]="item.data.image" alt="" aria-hidden="true" />
-      <span [class.font-bold]="item.styleClass === 'font-bold'">{{ item.label }}</span>
-    </div>
-  </ng-template>
-} @else {
+@if (cb_customer.length > 1) {
+  <custom-input-select-signal
+    [data]="cb_customer"
+    [ngModel]="customerId()"
+    (ngModelChange)="selectCustomer($event)"
+    optionValue="value"
+    optionLabel="label"
+    [filter]="cb_customer.length > 10"
+    [onlyInput]="true"
+    class="w-100"
+  />
+} @else {
```
Revisa el resto del `<p-select>` original en el historial (props que
no se copiaron arriba, como `styleClass`/`fluid`) y mapéalas a la API
real de `custom-input-select-signal`
(`data`/`optionLabel`/`optionValue`/`optionDisabled`/`showClear`/
`filter`/`filterBy`/`customClass`/`size`) — si alguna no tiene
equivalente directo, repórtalo en vez de omitirla en silencio.

## 4. `header-employee-desktop.ts` — mantener el enfoque, solo falta el tipo

El cambio a `DialogHandlerService` + `HeaderEmployeeAiModal` (con
`TemplateRef` vía `NgTemplateOutlet`) es una **buena decisión**, no la
reviertas — reutiliza la infraestructura de diálogos ya establecida en
el resto de la app en vez de reinventar markup de modal. Solo falta:

```diff
+import type { MenuItem } from "@core/interfaces/menu-item.interface";
```

## Verificación

- `npx tsc --noEmit`: 0 errores.
- `ng build` **redirigido a archivo completo (`> log 2>&1`), espera a
  que el proceso termine de verdad — si sigues viendo el error de
  `task-refactor.interface`/`task-photos-viewer.ts`, confírmalo con un
  `grep` directo sobre esos archivos antes de reportarlo como bloqueo,
  no asumas que sigue ahí sin comprobarlo (en la última verificación
  independiente ya no existía)**.
- **Prueba real en navegador** (es el shell de escritorio): entra
  como dirección y confirma que el selector de cliente sigue
  funcionando igual que antes (incluye probar el filtro si hay más de
  10 clientes en el ambiente de prueba), y que el modal de IA de
  empleado sigue abriendo/cerrando bien.

## Listo cuando

- `header-direccion-desktop` usando `custom-input-select-signal`, con
  el filtro funcionando para listas largas.
- `header-employee-desktop` conserva `DialogHandlerService`.
- Capturas del selector de cliente y del modal de IA.
- `tsc`/build limpios, confirmados con log completo real.
