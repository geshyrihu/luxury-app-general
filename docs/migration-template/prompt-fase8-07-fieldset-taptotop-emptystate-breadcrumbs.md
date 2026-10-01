# Prompt Fase 8 — 4 componentes: fieldset, tap-to-top, empty-state, breadcrumbs

Nota de estándar del repo (confirmada por el usuario): los tooltips
van siempre por el wrapper `[lxTooltip]` (`adaptive/tooltip`, ya sobre
`NgbTooltip` vía `hostDirectives`) — **no** importar
`@ng-bootstrap/ng-bootstrap` directo en ningún componente nuevo para
tooltips, ya se usa en ~128 lugares y duplicar el import rompería el
estándar. Ninguno de estos 4 necesita tooltip, pero aplica para
cualquier prompt futuro.

## 1. `web/breadcrumbs/breadcrumbs.ts` + `base/breadcrumbs.base.ts` — solo tipo, ya es Bootstrap real

Investigado: el componente **ya renderiza markup Bootstrap puro**
(`<nav><ol class="breadcrumb">`, sin `<p-breadcrumb>` en ningún lado)
desactualizado, corrígelo también. Lo único que queda es un
cero acoplamiento real, pero bloquea poder quitar el paquete).

```
src/app/shared/ui/web/breadcrumbs/breadcrumbs.ts
src/app/shared/ui/base/breadcrumbs.base.ts
```
```diff
+import type { MenuItem } from "@core/interfaces/menu-item.interface";
```
(en `breadcrumbs.base.ts`, actualiza también el comentario JSDoc que
app-breadcrumbs (Bootstrap nativo)", y quita el comentario

## 2. `web/tap-to-top/tap-to-top.ts` — trivial, la lógica ya es propia

`TapToTopBase` (`base/tap-to-top.base.ts`) **ya tiene toda la lógica
`ViewportScroller`) — solo el template del componente web usa
`<p-scrolltop>` de más.

```
src/app/shared/ui/web/tap-to-top/tap-to-top.ts
```
```diff
-import { Component, ViewEncapsulation } from "@angular/core";
+import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
 import { TapToTopBase } from "@ui/base/tap-to-top.base";
 import { AppIcon } from "@ui/shared/app-icon/app-icon";

 @Component({
   selector: "app-scroll-top",
-
-  imports: [ScrollTopModule, AppIcon],
+  imports: [AppIcon],
   template: `
-    <!-- El icono va por plantilla, no por el input "icon"... -->
-    <p-scrolltop
-      [threshold]="600"
-      [style]="{ background: 'var(--ds-primary)', color: 'var(--ds-on-primary)' }"
-    >
-      <ng-template #icon>
-        <app-icon icon="material-symbols-light:arrow-upward" />
-      </ng-template>
-    </p-scrolltop>
+    @if (show) {
+      <button
+        type="button"
+        class="app-scroll-top-btn"
+        aria-label="Volver arriba"
+        (click)="tapToTop()"
+      >
+        <app-icon icon="material-symbols-light:arrow-upward" />
+      </button>
+    }
   `,
   styles: [
     `
       :host {
         display: contents;
       }
+      .app-scroll-top-btn {
+        position: fixed;
+        right: 1.5rem;
+        bottom: 1.5rem;
+        z-index: 1000;
+        width: 3rem;
+        height: 3rem;
+        border-radius: 50%;
+        border: 0;
+        display: flex;
+        align-items: center;
+        justify-content: center;
+        background: var(--ds-primary);
+        color: var(--ds-on-primary);
+        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
+        cursor: pointer;
+      }
     `,
   ],
   encapsulation: ViewEncapsulation.None,
 })
 export class ScrollTop extends TapToTopBase {}
```
(`show` es una propiedad plana de `TapToTopBase`, no un signal — el
`@if (show)` del template sigue funcionando porque Angular hace
change detection por el `@HostListener` del scroll; si el botón no
aparece/desaparece bien al hacer scroll, agrega
`changeDetection: ChangeDetectionStrategy.Default` en vez de dejarlo
sin especificar, o cambia `show` a signal en la base — evalúalo si
hace falta, no lo asumas de antemano.)

## 3. `web/empty-state/empty-state.ts` — trivial, solo el botón

```
src/app/shared/ui/web/empty-state/empty-state.ts
```
```diff
+import { WebButtonLabel } from "@ui/buttons/web-label/button";
```
```diff
-  imports: [ButtonModule, AppIcon],
+  imports: [WebButtonLabel, AppIcon],
```
```diff
-        @if (actionLabel()) {
-          <p-button
-            [label]="actionLabel()"
-            [icon]="actionIcon()"
-            [severity]="actionSeverity()"
-            (onClick)="action.emit()"
-            size="small"
-          />
-        }
+        @if (actionLabel()) {
+          <il-button
+            [label]="actionLabel()"
+            [icon]="actionIcon()"
+            [severity]="actionSeverity()"
+            (clicked)="action.emit()"
+            size="sm"
+          />
+        }
```

## 4. `web/fieldset/fieldset.ts` — necesita lógica real de toggle (14+ consumidores lo usan)

Verificado: `[toggleable]="true"` + `[collapsed]="true/false"` se usan
de verdad en 8+ archivos reales (`presentacion-junta-comite*.html` x6,
`customer-config.html`, `employee-document-list.html`, y más). El
`collapsed()` del base es `input` de solo lectura (no `model`), así
que el estado interno de colapsado debe inicializarse desde ahí pero
vivir como signal propio del componente — usa `linkedSignal` (se
resetea si `collapsed()` cambia de valor desde afuera, pero se puede
togglear localmente sin pelear con el input).

```
src/app/shared/ui/web/fieldset/fieldset.ts
```
```diff
-import {
-  ChangeDetectionStrategy,
-  Component,
-  ViewEncapsulation,
-} from "@angular/core";
+import {
+  ChangeDetectionStrategy,
+  Component,
+  linkedSignal,
+  ViewEncapsulation,
+} from "@angular/core";
 import { FieldsetBase } from "@ui/base/fieldset.base";
+import { AppIcon } from "@ui/shared/app-icon/app-icon";

 @Component({
   selector: "app-fieldset",
-
-  imports: [FieldsetModule],
+  imports: [AppIcon],
   template: `
-    <p-fieldset
-      [legend]="legend()"
-      [toggleable]="toggleable()"
-      [collapsed]="collapsed()"
-    >
-      <ng-content />
-    </p-fieldset>
+    <fieldset class="app-fieldset">
+      <legend
+        class="app-fieldset-legend"
+        [class.app-fieldset-legend-toggleable]="toggleable()"
+        (click)="toggle()"
+      >
+        @if (toggleable()) {
+          <app-icon
+            [icon]="isCollapsed() ? 'material-symbols-light:chevron-right' : 'material-symbols-light:expand-more'"
+          />
+        }
+        {{ legend() }}
+      </legend>
+      @if (!isCollapsed()) {
+        <div class="app-fieldset-content">
+          <ng-content />
+        </div>
+      }
+    </fieldset>
   `,
+  styles: [
+    `
+      .app-fieldset {
+        border: 1px solid var(--ds-border, #dee2e6);
+        border-radius: var(--ds-radius, 0.375rem);
+        padding: 0.75rem 1rem 1rem;
+        margin: 0;
+      }
+      .app-fieldset-legend {
+        display: inline-flex;
+        align-items: center;
+        gap: 0.25rem;
+        width: auto;
+        font-size: 0.9rem;
+        font-weight: 600;
+        padding: 0 0.375rem;
+        margin: 0 0 0.5rem -0.375rem;
+      }
+      .app-fieldset-legend-toggleable {
+        cursor: pointer;
+        user-select: none;
+      }
+    `,
+  ],
   changeDetection: ChangeDetectionStrategy.Eager,
   encapsulation: ViewEncapsulation.None,
 })
-export class AppFieldset extends FieldsetBase {}
+export class AppFieldset extends FieldsetBase {
+  protected isCollapsed = linkedSignal(() => this.collapsed());
+
+  protected toggle(): void {
+    if (!this.toggleable()) return;
+    this.isCollapsed.update((value) => !value);
+  }
+}
```

## Verificación

- `npx tsc --noEmit`: 0 errores nuevos.
- `ng build` **redirigido a archivo completo (`> log 2>&1`), espera a
  que el proceso termine de verdad, revisa el log entero con
  `grep -c ERROR`**.
- **Prueba real en navegador**: el botón scroll-to-top (aparece al
  bajar, sube al hacer clic, en cualquier pantalla larga); un
  `empty-state` con acción (busca uno real, ej. una lista vacía con
  botón "Agregar"); y **especialmente** un `lx-fieldset
  [toggleable]="true"` real (ej. `employee-document-list.html` o
  `presentacion-junta-comite-contador.html`) — confirma que el clic en
  el legend colapsa/expande el contenido correctamente, con el ícono
  de chevron cambiando de dirección.

## Listo cuando

- Fieldset con toggle funcionando de verdad (captura antes/después de
  hacer clic en el legend).
- `tsc`/build limpios.
