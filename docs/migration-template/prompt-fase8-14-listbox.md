# Prompt Fase 8 — `listbox.ts`: reescritura completa (3 consumidores, uso rico)

Investigado a fondo: los 3 consumidores reales usan `multiple`,
`checkbox` (a veces junto con `multiple`, a veces `multiple` solo),
`filter` (búsqueda), `listStyle` (altura máxima con scroll),
`emptyFilterMessage`, `formControlName` (integración real de
Angular Forms vía `ControlValueAccessor`, ya implementado en
`ListboxBase`), y **1 consumidor usa `[group]`/`optionGroupLabel`/
`optionGroupChildren`** (opciones agrupadas) y **otro usa una
plantilla de ítem custom** (`<ng-template let-customer #item>`).

```
src/app/shared/ui/web/listbox/listbox.ts
```

`ListboxBase` ya implementa `ControlValueAccessor` completo
(`writeValue`/`registerOnChange`/`registerOnTouched`/
`setDisabledState`, más `value` como `model`) — no la toques, solo
consúmela.

```diff
-import {
-  ChangeDetectionStrategy,
-  Component,
-  ViewEncapsulation,
-} from "@angular/core";
-import { FormsModule } from "@angular/forms";
-import { ListboxBase } from "@ui/base/listbox.base";
+import {
+  ChangeDetectionStrategy,
+  Component,
+  computed,
+  contentChild,
+  signal,
+  TemplateRef,
+  ViewEncapsulation,
+} from "@angular/core";
+import { FormsModule } from "@angular/forms";
+import { NgTemplateOutlet } from "@angular/common";
+import { ListboxBase } from "@ui/base/listbox.base";

 @Component({
   selector: "app-listbox",
-
-  imports: [ListboxModule, FormsModule],
-  template: `<p-listbox
-    [ngModel]="value()"
-    (ngModelChange)="value.set($event)"
-    [options]="options()"
-    [optionLabel]="optionLabel()"
-    [optionValue]="optionValue()"
-    [multiple]="multiple()"
-    [checkbox]="checkbox()"
-    [filter]="filter()"
-    [style]="style()"
-    [listStyle]="listStyle()"
-    [emptyFilterMessage]="emptyFilterMessage()"
-    [group]="group()"
-    [optionGroupLabel]="optionGroupLabel()"
-    [optionGroupChildren]="optionGroupChildren()"
-    [metaKeySelection]="metaKeySelection()"
-    [class]="styleClass()"
-    ><ng-content
-  /></p-listbox>`,
+  imports: [FormsModule, NgTemplateOutlet],
+  template: `
+    <div class="app-listbox" [class]="styleClass()" [ngStyle]="style()">
+      @if (filter()) {
+        <div class="app-listbox-filter">
+          <input
+            type="text"
+            class="form-control form-control-sm"
+            placeholder="Buscar..."
+            [ngModel]="searchTerm()"
+            (ngModelChange)="searchTerm.set($event)"
+          />
+        </div>
+      }
+      <div class="app-listbox-list" [ngStyle]="listStyle()">
+        @if (group()) {
+          @for (grp of filteredGroups(); track $index) {
+            @if (grp.items.length) {
+              <div class="app-listbox-group-header">{{ groupLabelOf(grp.source) }}</div>
+              @for (option of grp.items; track $index) {
+                <ng-container [ngTemplateOutlet]="itemRow" [ngTemplateOutletContext]="{ $implicit: option }" />
+              }
+            }
+          }
+        } @else {
+          @for (option of filteredFlat(); track $index) {
+            <ng-container [ngTemplateOutlet]="itemRow" [ngTemplateOutletContext]="{ $implicit: option }" />
+          }
+          @if (!filteredFlat().length) {
+            <div class="app-listbox-empty">{{ emptyFilterMessage() || "Sin resultados" }}</div>
+          }
+        }
+      </div>
+    </div>
+
+    <ng-template #itemRow let-option>
+      <div
+        class="app-listbox-item"
+        [class.app-listbox-item-selected]="isSelected(option)"
+        (click)="toggle(option)"
+      >
+        @if (checkbox()) {
+          <input
+            type="checkbox"
+            class="form-check-input me-2"
+            [checked]="isSelected(option)"
+            (click)="$event.stopPropagation()"
+            (change)="toggle(option)"
+          />
+        }
+        @if (itemTpl(); as tpl) {
+          <ng-container [ngTemplateOutlet]="tpl" [ngTemplateOutletContext]="{ $implicit: option }" />
+        } @else {
+          <span>{{ optionLabelText(option) }}</span>
+        }
+      </div>
+    </ng-template>
+  `,
+  styles: [
+    `
+      .app-listbox { display: flex; flex-direction: column; border: 1px solid var(--ds-border, #dee2e6); border-radius: var(--ds-radius, 0.375rem); overflow: hidden; }
+      .app-listbox-filter { padding: 0.5rem; border-bottom: 1px solid var(--ds-border, #dee2e6); }
+      .app-listbox-list { overflow-y: auto; }
+      .app-listbox-group-header { padding: 0.375rem 0.75rem; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--ds-text-muted); background: var(--ds-bg-sunken); }
+      .app-listbox-item { display: flex; align-items: center; padding: 0.5rem 0.75rem; cursor: pointer; }
+      .app-listbox-item:hover { background: var(--ds-bg-sunken); }
+      .app-listbox-item-selected { background: var(--ds-primary-light, #e7f1ff); }
+      .app-listbox-empty { padding: 0.75rem; color: var(--ds-text-muted); font-size: 0.875rem; text-align: center; }
+    `,
+  ],
   changeDetection: ChangeDetectionStrategy.OnPush,
   encapsulation: ViewEncapsulation.None,
 })
-export class AppListbox extends ListboxBase {}
+export class AppListbox extends ListboxBase {
+  private itemTpl = contentChild<TemplateRef<unknown>>("item");
+
+  protected searchTerm = signal("");
+
+  private matchesFilter(option: any): boolean {
+    const term = this.searchTerm().trim().toLowerCase();
+    if (!term) return true;
+    return this.optionLabelText(option).toLowerCase().includes(term);
+  }
+
+  protected filteredFlat = computed(() =>
+    (this.options() ?? []).filter((o: any) => this.matchesFilter(o)),
+  );
+
+  protected filteredGroups = computed(() => {
+    const childrenKey = this.optionGroupChildren() ?? "items";
+    return (this.options() ?? []).map((grp: any) => ({
+      source: grp,
+      items: (grp[childrenKey] ?? []).filter((o: any) => this.matchesFilter(o)),
+    }));
+  });
+
+  protected groupLabelOf(group: any): string {
+    const key = this.optionGroupLabel() ?? "label";
+    return group[key] ?? "";
+  }
+
+  protected optionLabelText(option: any): string {
+    const key = this.optionLabel();
+    return key ? option[key] : String(option);
+  }
+
+  private valueOf(option: any): unknown {
+    const key = this.optionValue();
+    return key ? option[key] : option;
+  }
+
+  protected isSelected(option: any): boolean {
+    const val = this.valueOf(option);
+    const current = this.value();
+    if (this.multiple()) {
+      return Array.isArray(current) && current.includes(val);
+    }
+    return current === val;
+  }
+
+  protected toggle(option: any): void {
+    const val = this.valueOf(option);
+    let next: unknown;
+    if (this.multiple()) {
+      const current: unknown[] = Array.isArray(this.value()) ? [...this.value()] : [];
+      const idx = current.indexOf(val);
+      if (idx >= 0) current.splice(idx, 1);
+      else current.push(val);
+      next = current;
+    } else {
+      next = val;
+    }
+    this.value.set(next);
+    this.onChangeCva(next);
+    this.onTouchCva();
+  }
+}
```

**Verifica antes de dar por bueno**: el consumidor con `[group]="true"`
(`manuals-and-processes-form.html`) — confirma que sus `options()`
son un arreglo de GRUPOS (cada uno con `optionGroupLabel` y
`optionGroupChildren`), no un arreglo plano — si la estructura real
difiere de lo asumido aquí, ajusta `filteredGroups` antes de darlo
por cerrado.

## Verificación

- `npx tsc --noEmit`: 0 errores nuevos.
- `ng build` **redirigido a archivo completo (`> log 2>&1`), espera a
  que el proceso termine de verdad, revisa el log entero con
  `grep -c ERROR`**.
- **Prueba real en navegador, los 3 consumidores**:
  - `announcement-admin-form.html`: confirma que el ítem custom (con
    ícono + check verde cuando seleccionado) se ve bien, filtro de
    búsqueda funciona, selección múltiple sin checkbox visible
    (usa el highlight verde del template custom).
  - `diagram-form.html`: confirma checkboxes visibles, selección
    múltiple, filtro, mensaje de "sin resultados" si buscas algo que
    no existe.
  - `manuals-and-processes-form.html`: confirma que el listbox de
    roles con `[group]="true"` muestra encabezados de grupo
    correctamente con sus opciones anidadas.
- Confirma que `formControlName` sigue funcionando (el formulario
  guarda/lee el valor correcto al enviar).

## Listo cuando

- Capturas de los 3 consumidores, incluyendo el caso agrupado.
- `tsc`/build limpios.
  a 5 (quedan: `timeline`, `tree`, `image-analysis-dialog`,
  `custom-input-upload-pdf-signal`, `editor`).
