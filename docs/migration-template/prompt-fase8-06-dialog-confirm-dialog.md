# Prompt Fase 8 — `Dialog` y `ConfirmDialog`: reescritura a Bootstrap nativo (0 cambios en consumidores)

Investigado a fondo antes de escribir esto: ambos componentes exponen
una API pública estable (`ModalBase`/`ConfirmDialogBase`) que **no
cambia** — solo se reescribe el `template` interno de cada uno, de
PrimeNG (`p-dialog`+`p-button`) a markup Bootstrap 5 nativo (mismo
patrón ya usado y probado en Fase 7:
`prompt-fase7-catalogo-02-dialog-nativo.md` y
`prompt-fase8-04-core-layout-shell.md` punto 4). **No toques ningún
archivo de `src/app/modules`** — los 7 consumidores reales de
`Dialog` (vía `<lx-modal>`) y los 2 de `ConfirmDialog` (vía
`<lx-confirm-dialog>`) siguen funcionando sin cambios porque la API
(`visible`/`header`/`closable`/`dismiss` para Dialog;
`visible`/`title`/`message`/`type`/`confirmLabel`/`cancelLabel`/
`confirm`/`cancel` para ConfirmDialog) se preserva exacta.

## 1. `src/app/shared/ui/web/dialog/dialog.ts`

```diff
-import {
-  ChangeDetectionStrategy,
-  Component,
-  ViewEncapsulation,
-} from "@angular/core";
+import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
 import { ModalBase } from "@ui/base/modal.base";
-import { DialogModule } from "primeng/dialog";

 @Component({
   selector: "app-dialog",
-
-  imports: [DialogModule],
   template: `
-    <p-dialog
-      [visible]="visible()"
-      (visibleChange)="visible.set($event)"
-      [header]="header()"
-      [modal]="true"
-      [closable]="closable()"
-      [draggable]="false"
-      [resizable]="false"
-      [style]="{ width: '520px' }"
-      [breakpoints]="{ '375px': '96vw', '640px': '96vw' }"
-      (onHide)="onDismiss()"
-    >
-      <ng-content />
-    </p-dialog>
+    <div
+      class="modal fade"
+      [class.show]="visible()"
+      [style.display]="visible() ? 'block' : 'none'"
+      tabindex="-1"
+      role="dialog"
+      [attr.aria-hidden]="!visible()"
+    >
+      <div class="modal-dialog modal-dialog-centered" style="width: 520px; max-width: 96vw;">
+        <div class="modal-content">
+          <div class="modal-header">
+            <h5 class="modal-title">{{ header() }}</h5>
+            @if (closable()) {
+              <button type="button" class="btn-close" aria-label="Cerrar" (click)="onDismiss()"></button>
+            }
+          </div>
+          <div class="modal-body">
+            <ng-content />
+          </div>
+        </div>
+      </div>
+    </div>
+    @if (visible()) {
+      <div class="modal-backdrop fade show"></div>
+    }
   `,
   styles: [
     `
       :host {
         display: contents;
       }
     `,
   ],
   changeDetection: ChangeDetectionStrategy.OnPush,
   encapsulation: ViewEncapsulation.None,
 })
 export class Dialog extends ModalBase {}
```

(`[modal]="true"` de PrimeNG siempre lo era, así que el backdrop
condicional a `visible()` ya cubre ese comportamiento;
`[draggable]`/`[resizable]` no tienen equivalente Bootstrap nativo,
se pierden a propósito, son detalles menores)

## 2. `src/app/shared/ui/web/confirm-dialog/confirm-dialog.ts`

```diff
-import {
-  ChangeDetectionStrategy,
-  Component,
-  ViewEncapsulation,
-} from "@angular/core";
+import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
 import { ConfirmDialogBase } from "@ui/base/confirm-dialog.base";
-import { ButtonModule } from "primeng/button";
-import { DialogModule } from "primeng/dialog";
+import { WebButtonLabel } from "@ui/buttons/web-label/button";
 import { AppIcon } from "@ui/shared/app-icon/app-icon";

 export type { ConfirmType } from "@ui/base/confirm-dialog.base";

 @Component({
   selector: "app-confirm-dialog",
-
-  imports: [DialogModule, ButtonModule, AppIcon],
+  imports: [WebButtonLabel, AppIcon],
   template: `
-    <p-dialog
-      [visible]="visible()"
-      (visibleChange)="visible.set($event)"
-      [header]="title()"
-      [modal]="true"
-      [closable]="false"
-      [draggable]="false"
-      [style]="{ width: '420px' }"
-      [breakpoints]="{ '480px': '90vw' }"
-    >
-      <div class="d-flex flex-column align-items-center text-center gap-3 py-3">
-        <app-icon [icon]="config().icon" class="text-4xl" [style.color]="config().color" />
-        <p class="m-0 text-color-secondary line-height-3">{{ message() }}</p>
-      </div>
-      <ng-template #footer>
-        <div class="d-flex gap-2 justify-content-end">
-          <p-button [label]="cancelLabel()" severity="secondary" [outlined]="true" (onClick)="onCancel()" />
-          <p-button [label]="confirmLabel()" [severity]="config().severity" (onClick)="onConfirm()" />
-        </div>
-      </ng-template>
-    </p-dialog>
+    <div
+      class="modal fade"
+      [class.show]="visible()"
+      [style.display]="visible() ? 'block' : 'none'"
+      tabindex="-1"
+      role="dialog"
+      [attr.aria-hidden]="!visible()"
+    >
+      <div class="modal-dialog modal-dialog-centered" style="width: 420px; max-width: 90vw;">
+        <div class="modal-content">
+          <div class="modal-header">
+            <h5 class="modal-title">{{ title() }}</h5>
+          </div>
+          <div class="modal-body">
+            <div class="d-flex flex-column align-items-center text-center gap-3 py-3">
+              <app-icon [icon]="config().icon" class="text-4xl" [style.color]="config().color" />
+              <p class="m-0 text-color-secondary line-height-3">{{ message() }}</p>
+            </div>
+          </div>
+          <div class="modal-footer">
+            <il-button [label]="cancelLabel()" severity="secondary" variant="outline" (clicked)="onCancel()" />
+            <il-button [label]="confirmLabel()" [severity]="config().severity" (clicked)="onConfirm()" />
+          </div>
+        </div>
+      </div>
+    </div>
+    @if (visible()) {
+      <div class="modal-backdrop fade show"></div>
+    }
   `,
   styles: [
     `
       :host {
         display: contents;
       }
     `,
   ],
   changeDetection: ChangeDetectionStrategy.OnPush,
   encapsulation: ViewEncapsulation.None,
 })
 export class ConfirmDialog extends ConfirmDialogBase {}
```

Nota: el original **no tenía botón de cerrar (X)** en el header
(`[closable]="false"` fijo) — no agregues `btn-close` aquí, es a
propósito, la única salida es Confirmar/Cancelar. `config().severity`
puede ser `"warn"` (viene de `CONFIRM_TYPE_CONFIG` en
`confirm-dialog.base.ts`) — confirma que `il-button`'s `severity`
acepta ese valor tal cual (ya lo hace en el resto del repo, solo
verifica que no truene con el mapeo de estilos).

## Verificación

- `grep -n "primeng" dialog.ts confirm-dialog.ts` → 0 resultados en
  ambos.
- `npx tsc --noEmit`: 0 errores nuevos.
- `ng build` **redirigido a archivo completo (`> log 2>&1`), espera a
  que el proceso termine de verdad, revisa el log entero con
  `grep -c ERROR`**.
- **Prueba real en navegador**, en al menos 2 consumidores reales
  distintos de cada uno (`Dialog`: `funding-detail.html` con el modal
  "Generando Solicitudes"; `ConfirmDialog`: `admin-vacaciones-balance.html`
  o `panel-aprobaciones.html`) — confirma que abren centrados, con
  backdrop, que `ConfirmDialog` NO tiene botón X (solo
  Confirmar/Cancelar), y que `Dialog` sí cierra con su X cuando
  `closable` es `true` (ej. `job-description-form.html`) y no la
  muestra cuando es `false` (ej. el modal "Generando Solicitudes",
  `[closable]="false"`).

## Listo cuando

- `Dialog` y `ConfirmDialog` sin ningún import de PrimeNG.
- 0 archivos de `src/app/modules` tocados (la API no cambió).
- Capturas de al menos 2 consumidores reales de cada uno.
- `tsc`/build limpios.
