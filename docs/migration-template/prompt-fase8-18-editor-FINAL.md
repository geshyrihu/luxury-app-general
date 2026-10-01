# Prompt Fase 8 — ÚLTIMO archivo: `editor.ts` (Quill real, 2 consumidores)

compartida) queda completa.

`quill` (`^2.0.3`) **ya es una dependencia real del proyecto**
(confirmado en `package.json`). No hay ningún wrapper Quill existente
que reutilizar (el único que había, `rich-text-editor`, se borró en
el Paso 1 de Fase 8 por no tener consumidores) — hay que integrar
Quill directamente, es la única pieza de toda esta limpieza que
requiere conectar una librería nueva de cero.

Los 2 consumidores reales (`announcement-admin-form.html`,
`service-order.html`) usan uso simple: `formControlName`/
`[formControl]` (vía `ControlValueAccessor`, que `EditorBase` ya
implementa) + `[placeholder]`. Sin configuración de toolbar custom
solicitada por ningún consumidor — usa el toolbar por defecto de Quill.

## 1. Agregar el CSS de Quill al build global

```
angular.json
```
En el array `styles` del proyecto (busca donde ya está
`"flatpickr/dist/flatpickr.css"`, mismo patrón, agrega junto a esa
línea):
```diff
   "styles": [
     "flatpickr/dist/flatpickr.css",
+    "quill/dist/quill.snow.css",
     ...
   ]
```

## 2. `web/editor/editor.ts`

```
src/app/shared/ui/web/editor/editor.ts
```
```diff
-import {
-  ChangeDetectionStrategy,
-  Component,
-  ViewEncapsulation,
-  forwardRef,
-} from "@angular/core";
-import { FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
+import {
+  AfterViewInit,
+  ChangeDetectionStrategy,
+  Component,
+  ElementRef,
+  OnDestroy,
+  ViewEncapsulation,
+  forwardRef,
+  viewChild,
+} from "@angular/core";
+import { NG_VALUE_ACCESSOR } from "@angular/forms";
 import { EditorBase } from "@ui/base/editor.base";
+import Quill from "quill";

 @Component({
   selector: "app-editor",
-
-  imports: [FormsModule, EditorModule],
-  template: `<p-editor
-    [(ngModel)]="_value"
-    (ngModelChange)="onChange($event)"
-    [style]="style()"
-    [placeholder]="placeholder()"
-    [class]="styleClass()"
-  ></p-editor>`,
+  template: `
+    <div class="app-editor" [class]="styleClass()" [ngStyle]="style()">
+      <div #editorEl></div>
+    </div>
+  `,
+  styles: [
+    `
+      .app-editor {
+        display: block;
+      }
+      .app-editor ::ng-deep .ql-container {
+        min-height: 150px;
+        font-size: inherit;
+      }
+    `,
+  ],
   changeDetection: ChangeDetectionStrategy.Eager,
   encapsulation: ViewEncapsulation.None,
   providers: [
     {
       provide: NG_VALUE_ACCESSOR,
       useExisting: forwardRef(() => AppEditor),
       multi: true,
     },
   ],
 })
-export class AppEditor extends EditorBase {}
+export class AppEditor extends EditorBase implements AfterViewInit, OnDestroy {
+  private editorEl = viewChild.required<ElementRef<HTMLDivElement>>("editorEl");
+  private quill?: Quill;
+  private pendingValue: string | undefined;
+  private isDisabled = false;
+
+  ngAfterViewInit(): void {
+    this.quill = new Quill(this.editorEl().nativeElement, {
+      theme: "snow",
+      placeholder: this.placeholder() ?? "",
+    });
+    if (this.pendingValue !== undefined) {
+      this.quill.clipboard.dangerouslyPasteHTML(this.pendingValue ?? "");
+    }
+    this.quill.enable(!this.isDisabled);
+    this.quill.on("text-change", () => {
+      const isEmpty = this.quill!.getText().trim().length === 0;
+      const value = isEmpty ? "" : this.quill!.root.innerHTML;
+      this._value = value;
+      this.onChange(value);
+      this.onTouch();
+    });
+  }
+
+  override writeValue(val: string | null | undefined): void {
+    this._value = val;
+    if (this.quill) {
+      const current = this.quill.root.innerHTML;
+      const next = val ?? "";
+      if (current !== next) {
+        this.quill.clipboard.dangerouslyPasteHTML(next);
+      }
+    } else {
+      this.pendingValue = val ?? "";
+    }
+  }
+
+  override setDisabledState(isDisabled: boolean): void {
+    this.isDisabled = isDisabled;
+    this.quill?.enable(!isDisabled);
+  }
+
+  ngOnDestroy(): void {
+    this.quill = undefined;
+  }
+}
```

**Verifica antes de dar por bueno**: importa `NgStyle` de
`@angular/common` en `imports:` del `@Component` (el template usa
`[ngStyle]="style()"`, que se me quedó fuera de la lista de imports —
agrégalo).

## Verificación

- `npx tsc --noEmit`: 0 errores nuevos.
- `ng build` **redirigido a archivo completo (`> log 2>&1`), espera a
  que el proceso termine de verdad, revisa el log entero con
  `grep -c ERROR`**. Confirma también que `quill/dist/quill.snow.css`
  se cargó bien (sin error 404 en la consola del navegador si logras
  probarlo).
- **Prueba real en navegador, ambos consumidores**:
  - `announcement-admin-form.html`: escribe contenido con formato
    (negrita, lista, etc.) en el editor, guarda el formulario,
    confirma que el HTML se persiste correctamente y se recarga bien
    al reabrir para editar.
  - `service-order.html`: confirma que el editor dentro de la tabla
    funciona igual (es un editor por fila, dentro de un `@for`).
- Confirma que el placeholder se ve cuando el editor está vacío, y
  que escribir/borrar dispara el `formControlName` correctamente
  (revisa que el formulario detecte el campo como "dirty"/"touched").

## Listo cuando

- `quill/dist/quill.snow.css` cargado globalmente.
- Capturas de los 2 consumidores con contenido con formato.
- `tsc`/build limpios.
