# Prompt Fase 8 — `rating` y `steps`: reescritura real

## 1. `web/rating/rating.ts` (4 consumidores reales)

`RatingBase` **ya tiene toda la lógica** (`setValue()` guarda
readonly/disabled, `starRange` computa `[1..stars]` — el mismo patrón
que ya usa la versión mobile con estrellas táctiles). Solo el
`<p-rating>` interno necesita reemplazo — el resto del wrapper
(label/hint/botón limpiar) **no se toca**.

```
src/app/shared/ui/web/rating/rating.ts
```
```diff
-import { FormsModule } from "@angular/forms";
 import { RatingBase } from "@ui/base/rating.base";
-import { ButtonModule } from "primeng/button";
-import { RatingModule } from "primeng/rating";
+import { AppIcon } from "@ui/shared/app-icon/app-icon";

 @Component({
   selector: "app-rating",
-
-  imports: [FormsModule, RatingModule, ButtonModule],
+  imports: [AppIcon],
   template: `
     <div class="app-rating-root">
       @if (label()) {
         <label class="app-rating-label">{{ label() }}</label>
       }

       <div class="app-rating-row" [class.app-rating-disabled]="disabled()">
-        <p-rating
-          [ngModel]="value()"
-          [stars]="stars()"
-          [readonly]="readonly() || disabled()"
-          (ngModelChange)="setValue($event)"
-        />
+        <div class="app-rating-stars" role="radiogroup" [attr.aria-label]="label() || 'Calificación'">
+          @for (n of starRange(); track n) {
+            <button
+              type="button"
+              class="app-rating-star"
+              [class.app-rating-star-filled]="n <= (value() ?? 0)"
+              [disabled]="readonly() || disabled()"
+              [attr.aria-pressed]="n <= (value() ?? 0)"
+              [attr.aria-label]="n + ' de ' + stars() + ' estrellas'"
+              (click)="setValue(n)"
+            >
+              <app-icon [icon]="n <= (value() ?? 0) ? 'material-symbols-light:star' : 'material-symbols-light:star-outline'" />
+            </button>
+          }
+        </div>

         @if (allowCancel() && value() && !readonly() && !disabled()) {
           <button class="app-rating-clear" type="button" title="Limpiar" (click)="clear()">✕</button>
         }
         @if (showLabel()) { <span class="app-rating-text">{{ ratingLabel() }}</span> }
       </div>
       @if (hint()) { <span class="app-rating-hint">{{ hint() }}</span> }
     </div>
   `,
   styles: [
     `
       /* ... estilos existentes sin cambios ... */
+      .app-rating-stars { display: inline-flex; gap: 0.125rem; }
+      .app-rating-star {
+        border: 0;
+        background: none;
+        padding: 0;
+        cursor: pointer;
+        color: var(--ds-border-strong, #adb5bd);
+        font-size: 1.25rem;
+        line-height: 1;
+        display: flex;
+      }
+      .app-rating-star:disabled { cursor: not-allowed; }
+      .app-rating-star-filled { color: var(--ds-warning, #ffc107); }
     `,
   ],
   changeDetection: ChangeDetectionStrategy.OnPush,
   encapsulation: ViewEncapsulation.None,
 })
 export class AppRating extends RatingBase {}
```
(`starRange`/`setValue`/`ratingLabel`/`clear` ya existen en
`RatingBase`, no los reimplementes — el `[attr.aria-pressed]` en cada
botón no es un toggle real, es solo para indicar visualmente si esa
estrella está "activa" según el valor actual, está bien dejarlo así)

## 2. `web/steps/steps.ts` (2 consumidores reales)

`StepsBase` es trivial (`model`/`readonly`/`activeIndex`/`styleClass`,
sin lógica propia). El consumidor real
(`create-orden-compra-wizard.html`) pasa `MenuItem[]` con solo
`label` por paso — construye un indicador de pasos horizontal simple.

```
src/app/shared/ui/web/steps/steps.ts
```
```diff
-import { StepsBase } from "@ui/base/steps.base";
-import { StepsModule } from "primeng/steps";
+import { StepsBase } from "@ui/base/steps.base";
+import { AppIcon } from "@ui/shared/app-icon/app-icon";
```
```diff
 @Component({
   selector: "app-steps",
-
-  imports: [StepsModule],
-  template: `<p-steps
-    [model]="model()"
-    [readonly]="readonly()"
-    [activeIndex]="activeIndex()"
-    (activeIndexChange)="activeIndex.set($event)"
-    [class]="styleClass()"
-  ></p-steps>`,
+  imports: [AppIcon],
+  template: `
+    <ol class="app-steps" [class]="styleClass()">
+      @for (item of model() ?? []; track $index; let i = $index; let last = $last) {
+        <li
+          class="app-steps-item"
+          [class.app-steps-item-active]="i === activeIndex()"
+          [class.app-steps-item-done]="i < activeIndex()"
+          [class.app-steps-item-clickable]="!readonly()"
+        >
+          <button
+            type="button"
+            class="app-steps-button"
+            [disabled]="readonly()"
+            [attr.aria-current]="i === activeIndex() ? 'step' : null"
+            (click)="activeIndex.set(i)"
+          >
+            <span class="app-steps-index">
+              @if (i < activeIndex()) {
+                <app-icon icon="material-symbols-light:check" />
+              } @else {
+                {{ i + 1 }}
+              }
+            </span>
+            <span class="app-steps-label">{{ item.label }}</span>
+          </button>
+          @if (!last) { <span class="app-steps-connector"></span> }
+        </li>
+      }
+    </ol>
+  `,
+  styles: [
+    `
+      .app-steps { display: flex; list-style: none; padding: 0; margin: 0; width: 100%; }
+      .app-steps-item { display: flex; align-items: center; flex: 1 1 0; }
+      .app-steps-item:last-child { flex: 0 0 auto; }
+      .app-steps-button {
+        display: flex; align-items: center; gap: 0.5rem;
+        background: none; border: 0; padding: 0; cursor: default;
+      }
+      .app-steps-item-clickable .app-steps-button { cursor: pointer; }
+      .app-steps-index {
+        width: 1.75rem; height: 1.75rem; border-radius: 50%;
+        display: flex; align-items: center; justify-content: center;
+        border: 2px solid var(--ds-border-strong, #adb5bd);
+        color: var(--ds-text-secondary); font-size: 0.8rem; font-weight: 600;
+        flex-shrink: 0;
+      }
+      .app-steps-item-active .app-steps-index { border-color: var(--ds-primary); color: var(--ds-primary); }
+      .app-steps-item-done .app-steps-index { border-color: var(--ds-primary); background: var(--ds-primary); color: var(--ds-on-primary); }
+      .app-steps-label { font-size: var(--ds-font-size-body); color: var(--ds-text-primary); white-space: nowrap; }
+      .app-steps-connector { flex: 1 1 auto; height: 2px; background: var(--ds-border-strong, #dee2e6); margin: 0 0.5rem; }
+      .app-steps-item-done + .app-steps-item .app-steps-connector { background: var(--ds-primary); }
+    `,
+  ],
   changeDetection: ChangeDetectionStrategy.OnPush,
   encapsulation: ViewEncapsulation.None,
 })
 export class AppSteps extends StepsBase {}
```
(`model()` puede venir `undefined` per `StepsBase`, de ahí el
`model() ?? []`; `item.label` asume que cada elemento tiene al menos
`label` — verifica el shape real en `create-orden-compra-wizard.ts`
línea ~188 antes de asumir más campos)

## Verificación

- `grep -n "primeng" rating.ts steps.ts` → 0 resultados en ambos.
- `npx tsc --noEmit`: 0 errores nuevos.
- `ng build` **redirigido a archivo completo (`> log 2>&1`), espera a
  que el proceso termine de verdad, revisa el log entero con
  `grep -c ERROR`**.
- **Prueba real en navegador**: un `rating` real (busca con
  `grep -rl "app-rating\|lx-rating" src/app/modules --include="*.html"`)
  — confirma que las estrellas se pintan/despintan al hacer clic,
  respetan `readonly`/`disabled`. `create-orden-compra-wizard.html`
  (steps) — confirma que el wizard de 3+ pasos se ve bien, el paso
  activo se resalta, y los pasos completados muestran el check.

## Listo cuando

- `rating.ts`/`steps.ts` sin PrimeNG.
- Capturas de ambos en consumidores reales.
- `tsc`/build limpios.
- Con esto, el conteo de `primeng/*` directo en `shared/ui` baja de 8
  a 6 (quedan: `listbox`, `timeline`, `tree`, `image-analysis-dialog`,
  `custom-input-upload-pdf-signal`, `editor`).
