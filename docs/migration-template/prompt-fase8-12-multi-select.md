# Prompt Fase 8 — `multi-select.ts`: reescritura interna (3 consumidores, dentro de scaffolding muerto)

## Hallazgo importante antes de migrar

Los 3 consumidores reales de `<lx-multi-select>`
(`agenda-supervision.html`, `minutas-resumen.html`,
`resultado-general-dashboard.html`) están **dentro de un
`<p-columnfilter>`** sin ningún `ColumnFilterModule` importado en su
`.ts` — es markup muerto (mismo patrón ya detectado en una auditoría
previa: Angular tolera el tag desconocido sin error, pero como
`<p-columnfilter>` no es un componente Angular real, los
`<ng-template>` que contiene (`#headerSupervisor`, `#filter`) **nunca
se instancian**, así que `<lx-multi-select>` dentro de ellos **nunca
se renderiza hoy**. Es una funcionalidad ya rota desde antes de esta
(sería un cambio de alcance mayor, hay que decidir si esos filtros de
columna se reconstruyen con algún mecanismo propio de `AppTable` o se
retiran). Solo repórtalo, deja el `<p-columnfilter>` tal cual.

Esto SÍ importa para el diseño: como esa instancia nunca se ejecuta,
no hay forma de probar visualmente el resultado ahí — verifica el
componente aparte (ej. en el catálogo interno o un test manual
aislado).

## Migración de `AppMultiSelect`

```
src/app/shared/ui/web/multi-select/multi-select.ts
```

Reemplaza el `<p-multiselect>` interno por
`custom-input-multiselect-signal` (real, sobre `@ng-select/ng-select`),
preservando la API pública exacta de `MultiSelectBase`
(`options`/`placeholder`/`optionLabel`/`ngModel`/`onChange`/
`styleClass`) para no tener que tocar ningún consumidor:

```diff
-import {
-  ChangeDetectionStrategy,
-  Component,
-  ViewEncapsulation,
-} from "@angular/core";
-import { FormsModule } from "@angular/forms";
+import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
+import { FormsModule } from "@angular/forms";
 import { MultiSelectBase } from "@ui/base/multi-select.base";
+import { CustomInputMultiselectSignal } from "@ui/inputs/web/custom-input-multiselect-signal";

 @Component({
   selector: "app-multi-select",
-
-  imports: [FormsModule, MultiSelectModule],
-  template: `<p-multiselect
-    [options]="options()"
-    [placeholder]="placeholder()"
-    [optionLabel]="optionLabel()"
-    [ngModel]="ngModel()"
-    (ngModelChange)="ngModel.set($event)"
-    (onChange)="onChange.emit($event)"
-    [class]="styleClass()"
-    ><ng-content
-  /></p-multiselect>`,
+  imports: [FormsModule, CustomInputMultiselectSignal],
+  template: `
+    <custom-input-multiselect-signal
+      [data]="options() ?? []"
+      [optionLabel]="optionLabel() ?? 'label'"
+      [placeholder]="placeholder()"
+      [ngModel]="ngModel()"
+      (ngModelChange)="onModelChange($event)"
+      [customClass]="styleClass()"
+      [onlyInput]="true"
+    />
+  `,
   changeDetection: ChangeDetectionStrategy.OnPush,
   encapsulation: ViewEncapsulation.None,
 })
-export class AppMultiSelect extends MultiSelectBase {}
+export class AppMultiSelect extends MultiSelectBase {
+  protected onModelChange(value: unknown): void {
+    this.ngModel.set(value);
+    this.onChange.emit({ value });
+  }
+}
```

**Detalle de compatibilidad importante**: el `(onChange)` original de
consumidores reales que sí usan `(onChange)` (fuera del scaffolding
muerto, verifica con
`grep -rn "onChange)=\"filter" src/app/modules --include="*.html"` si
hay otros además de los 3 del `<p-columnfilter>`) leen `$event.value`.
El código de arriba ya emite `{ value }` para mantener esa
compatibilidad exacta.

**Limitación aceptada y documentada**: el `<ng-content />` original
permitía proyectar un `<ng-template let-option #item>` para
personalizar cómo se ve cada opción — `custom-input-multiselect-signal`
no soporta esa plantilla custom (su renderizado de opciones está fijo
internamente). Como el único lugar que la usaba está dentro del
scaffolding muerto (nunca se ejecuta), no hay pérdida real de
funcionalidad activa. Si en el futuro alguien necesita plantillas
custom de opción, hay que ampliar `custom-input-multiselect-signal` o
construir un componente nuevo — no es parte de este prompt.

## Verificación

- `npx tsc --noEmit`: 0 errores nuevos.
- `ng build` **redirigido a archivo completo (`> log 2>&1`), espera a
  que el proceso termine de verdad, revisa el log entero con
  `grep -c ERROR`**.
- Ya que los 3 consumidores reales están en scaffolding muerto (nunca
  se renderiza), no hay una pantalla real donde probar esto
  visualmente — si encuentras alguna OTRA pantalla real donde sí se
  vea `<lx-multi-select>`/`<app-multi-select>` funcionando (fuera de
  `<p-columnfilter>`), pruébala ahí. Si no, es aceptable cerrar solo
  con `tsc`/build verdes, dejándolo anotado.

## Listo cuando

- El hallazgo del `<p-columnfilter>` muerto reportado (no arreglado).
- `tsc`/build limpios.
  a 8.
