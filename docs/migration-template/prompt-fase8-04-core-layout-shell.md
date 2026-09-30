# Prompt Fase 8 — Shell de escritorio: `core/layout` (4 archivos, siempre renderizados)

Prioridad alta por visibilidad (no por complejidad): estos archivos
son el shell de escritorio que se renderiza en TODA sesión de la app
(sidebar, cabeceras de dirección/empleado, menú móvil). Investigado
uno por uno antes de escribir esto — 2 son triviales (tipo + import
muerto), 2 tienen uso real que migrar.

## 1. `employee-view/desktop/sidebar/sidebar.ts` — tipo + import muerto

```diff
+import type { MenuItem } from "@core/interfaces/menu-item.interface";
```
```diff
```
Quita también `InputTextModule` del arreglo `imports:` — confirmado
con `grep -n "pInputText" sidebar.html` → 0 resultados, import muerto,
no hay campo de búsqueda real usando esa directiva.

siendo válida como `MenuItem[]` con el tipo local) ni la ruta
página del catálogo interno, sin relación).

## 2. `employee-view/movil/home-menu-mobile/home-menu-mobile.ts` — solo tipo

```diff
+import type { MenuItem } from "@core/interfaces/menu-item.interface";
```

## 3. `direccion-view/desktop/header-direccion-desktop/header-direccion-desktop.ts` — select real

```diff
+import type { MenuItem } from "@core/interfaces/menu-item.interface";
+import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
```
(ajusta `imports:` del `@Component` igual)

En `header-direccion-desktop.html` (dentro de `<ng-template #center>`,
línea ~17):
```diff
-<p-select
-  [options]="cb_customer"
-  [ngModel]="customerId()"
-  (onChange)="selectCustomer($event.value)"
-  optionValue="value"
-  optionLabel="label"
-  styleClass="w-full"
-  [filter]="cb_customer.length > 10"
-  fluid
-  ...
-/>
+<custom-input-select-signal
+  [data]="cb_customer"
+  [ngModel]="customerId()"
+  (ngModelChange)="selectCustomer($event)"
+  optionValue="value"
+  optionLabel="label"
+  [filter]="cb_customer.length > 10"
+  [onlyInput]="true"
+  class="w-100"
+/>
```
Revisa el resto de props del `<p-select>` original (hay más líneas
después de `fluid` en el archivo real, no las copié todas aquí) y
mapea cada una a la API real de `custom-input-select-signal`
(`data`/`optionLabel`/`optionValue`/`optionDisabled`/`showClear`/
`filter`/`filterBy`/`customClass`/`size` — si alguna prop del
original no tiene equivalente directo, repórtalo antes de omitirla
silenciosamente).

## 4. `employee-view/desktop/header-employee-desktop/header-employee-desktop.ts` — dialog real, el más grande

```diff
+import type { MenuItem } from "@core/interfaces/menu-item.interface";
```
(quita `DialogModule` de `imports:`)

En `header-employee-desktop.html` (líneas 125-468, dialog completo):
usa el mismo patrón de modal Bootstrap 5 nativo ya establecido en
`prompt-fase7-catalogo-02-dialog-nativo.md` (sin JS plugin, solo
`class.show`/`style.display` atados a un signal + backdrop
condicional). **Cambia SOLO el wrapper** (`<p-dialog ...>` de apertura
y `</p-dialog>` de cierre, más el `<ng-template #header>` convertido a
`.modal-header`) — **todo el contenido entre el header y el cierre
(líneas ~159-467, el cuerpo real del asistente de IA) se mueve tal
cual dentro de `.modal-body`, sin reescribirlo**:

```diff
-<p-dialog
-  header="Generador de Comunicados IA"
-  [visible]="displayAiModal()"
-  (visibleChange)="displayAiModal.set($event)"
-  [modal]="true"
-  [style]="{ width: '800px', 'max-width': '95vw' }"
-  [contentStyle]="{ 'max-height': '80vh', 'overflow-y': 'auto' }"
-  [draggable]="false"
-  [resizable]="false"
-  styleClass="elegant-modal"
->
-  <ng-template #header>
-    <div class="d-flex align-items-center gap-3">
-      <img [src]="customerPhotoPath()" alt="" aria-hidden="true" style="width: 40px; height: 40px; object-fit: contain; border-radius: 8px;" />
-      <div>
-        <span class="fw-bold text-xl d-block text-purple-700">
-          <app-icon icon="material-symbols-light:auto-awesome-motion" class="text-purple-500 me-2 text-xl"></app-icon>Asistente Ejecutivo IA
-        </span>
-        <span class="text-sm text-gray-500">{{ customerName() }}</span>
-      </div>
-    </div>
-  </ng-template>
-
-  <div class="d-flex flex-column gap-4 py-3">
-    (... resto del cuerpo, sin cambios ...)
-  </div>
-</p-dialog>
+<div class="modal fade elegant-modal" [class.show]="displayAiModal()" [style.display]="displayAiModal() ? 'block' : 'none'" tabindex="-1" role="dialog" [attr.aria-hidden]="!displayAiModal()">
+  <div class="modal-dialog modal-dialog-centered" style="max-width: min(95vw, 800px);">
+    <div class="modal-content">
+      <div class="modal-header">
+        <div class="d-flex align-items-center gap-3">
+          <img [src]="customerPhotoPath()" alt="" aria-hidden="true" style="width: 40px; height: 40px; object-fit: contain; border-radius: 8px;" />
+          <div>
+            <span class="fw-bold text-xl d-block text-purple-700">
+              <app-icon icon="material-symbols-light:auto-awesome-motion" class="text-purple-500 me-2 text-xl"></app-icon>Asistente Ejecutivo IA
+            </span>
+            <span class="text-sm text-gray-500">{{ customerName() }}</span>
+          </div>
+        </div>
+        <button type="button" class="btn-close" aria-label="Cerrar" (click)="displayAiModal.set(false)"></button>
+      </div>
+      <div class="modal-body" style="max-height: 80vh; overflow-y: auto;">
+        <div class="d-flex flex-column gap-4 py-3">
+          (... el mismo cuerpo, sin cambios, tal cual estaba entre las líneas ~159 y ~467 ...)
+        </div>
+      </div>
+    </div>
+  </div>
+</div>
+@if (displayAiModal()) {
+<div class="modal-backdrop fade show"></div>
+}
```
Bootstrap nativo — se pierden a propósito, son detalles menores de
interacción, no bloquean nada. `styleClass="elegant-modal"` se
preserva como clase en el `.modal` raíz por si tiene CSS propio en
algún `.scss` — verifica si existe una regla `.elegant-modal` en
algún archivo de estilos antes de asumir que sigue aplicando igual.)

## Verificación

- `npx tsc --noEmit`: 0 errores nuevos.
- `ng build` **redirigido a archivo completo (`> log 2>&1`), espera a
  que el proceso termine de verdad, revisa el log entero con
  `grep -c ERROR`**.
- **Prueba real en navegador, es el shell de toda la app**: entra
  como empleado y como dirección, confirma que el sidebar se ve y
  navega igual, que el selector de cliente en la cabecera de dirección
  funciona, y que el modal "Generador de Comunicados IA" abre, se ve
  bien centrado con backdrop, y cierra correctamente (botón X y click
  fuera si aplica). Captura de los 3 puntos.

## Listo cuando

- Capturas confirmando que el shell se ve y funciona igual.
- `tsc`/build limpios.
  en 0 (solo quedarán los 2 de `pagination-request.dto.ts`/
  `pagination-store.ts`, que se resuelven junto con
