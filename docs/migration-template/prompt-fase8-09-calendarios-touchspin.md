# Prompt Fase 8 — 4 componentes: rango-calendario-yyyymmdd, mesanio, calendar-range, touchspin

## 1. `web/rango-calendario-yyyymmdd/rango-calendario-yyyymmdd.ts` — trivial

`pInputText` es solo estilo (la fecha real la maneja `mwlFlatpickr`).

```
src/app/shared/ui/web/rango-calendario-yyyymmdd/rango-calendario-yyyymmdd.ts
src/app/shared/ui/web/rango-calendario-yyyymmdd/rango-calendario-yyyymmdd.html
```
```diff
```
```diff
-  imports: [FormsModule, FlatpickrDirective, InputTextModule],
+  imports: [FormsModule, FlatpickrDirective],
```
En el `.html` (2 inputs, líneas ~5-15 y ~16-26):
```diff
   <input
-    pInputText
+    class="form-control"
     type="text"
     monthSelectorType="dropdown"
```
(aplica el mismo cambio en el segundo `<input>`)

## 2. `web/mesanio/mesanio.ts` — trivial + corrección de estándar de tooltip

`pInputText` es solo estilo. **De paso**: este archivo usa
`NgbTooltip`/`ngbTooltip=` **directo**, lo cual va contra el estándar
confirmado del repo (todo tooltip pasa por `[lxTooltip]`, el wrapper
propio sobre `NgbTooltip` con `hostDirectives`, usado en ~128 lugares)
— corrígelo también aquí.

```
src/app/shared/ui/web/mesanio/mesanio.ts
```
```diff
-import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
+import { LxTooltipDirective } from "@ui/adaptive/tooltip";
 import { FiltroCalendarService } from "@core/services/filtro-calendar.service";
```
```diff
-  imports: [FormsModule, NgbTooltip, InputTextModule],
+  imports: [FormsModule, LxTooltipDirective],
```
```diff
         <input
           type="month"
-          ngbTooltip="SELECCIONA PERIODO"
-          pInputText
+          lxTooltip="SELECCIONA PERIODO"
+          class="form-control"
           [(ngModel)]="periodo"
           (change)="onChangePeriodo()"
         />
```

## 3. `web/rango-calendario-mes-anio/calendar-range.ts` — `p-inputgroup` real

```
src/app/shared/ui/web/rango-calendario-mes-anio/calendar-range.ts
src/app/shared/ui/web/rango-calendario-mes-anio/calendar-range.html
```
```diff
 import { DateService } from "@core/services/date.service";
```
```diff
-  imports: [
-    FormsModule,
-    LxTooltipDirective,
-    InputTextModule,
-    InputGroupModule,
-    InputGroupAddonModule,
-  ],
+  imports: [FormsModule, LxTooltipDirective],
```
En el `.html`:
```diff
-<div class="d-flex align-items-center gap-2">
-  <p-inputgroup>
-    <p-inputgroup-addon>De</p-inputgroup-addon>
-    <input
-      pInputText
-      type="month"
-      [(ngModel)]="fechaInicial"
-      lxTooltip="Selecciona mes inicial"
-      tooltipPosition="top"
-      (change)="onSendDateRange(fechaInicial, fechaFinal)"
-    />
-  </p-inputgroup>
-  <p-inputgroup>
-    <p-inputgroup-addon>a</p-inputgroup-addon>
-    <input
-      pInputText
-      type="month"
-      [(ngModel)]="fechaFinal"
-      lxTooltip="Selecciona mes final"
-      tooltipPosition="top"
-      (change)="onSendDateRange(fechaInicial, fechaFinal)"
-    />
-  </p-inputgroup>
-</div>
+<div class="d-flex align-items-center gap-2">
+  <div class="input-group">
+    <span class="input-group-text">De</span>
+    <input
+      class="form-control"
+      type="month"
+      [(ngModel)]="fechaInicial"
+      lxTooltip="Selecciona mes inicial"
+      tooltipPosition="top"
+      (change)="onSendDateRange(fechaInicial, fechaFinal)"
+    />
+  </div>
+  <div class="input-group">
+    <span class="input-group-text">a</span>
+    <input
+      class="form-control"
+      type="month"
+      [(ngModel)]="fechaFinal"
+      lxTooltip="Selecciona mes final"
+      tooltipPosition="top"
+      (change)="onSendDateRange(fechaInicial, fechaFinal)"
+    />
+  </div>
+</div>
```

## 4. `web/touchspin/touchspin.ts` — `p-inputgroup` + `p-button` reales

```
src/app/shared/ui/web/touchspin/touchspin.ts
```
```diff
 import { LxTooltipDirective } from "@ui/adaptive/tooltip";
+import { WebButtonLabel } from "@ui/buttons/web-label/button";
```
```diff
-  imports: [
-    ReactiveFormsModule,
-    ButtonModule,
-    InputTextModule,
-    InputGroupModule,
-    InputGroupAddonModule,
-    LxTooltipDirective,
-  ],
+  imports: [ReactiveFormsModule, LxTooltipDirective, WebButtonLabel],
```
```diff
   template: `
-    <p-inputgroup>
-      <!-- 1. Addon con fondo blanco y botón rojo -->
-      <p-inputgroup-addon styleClass="surface-card">
-        <p-button
-          label="➖"
-          (onClick)="decrement()"
-          [disabled]="disabled() || isMin()"
-          [outlined]="outlined()"
-          lxTooltip="Disminuir"
-          tooltipPosition="top"
-          size="small"
-        />
-      </p-inputgroup-addon>
-
-      <input
-        pInputText
-        class="text-center"
-        style="width: 60px"
-        type="number"
-        [formControl]="control()"
-        [min]="minValue()"
-        [max]="maxValue()"
-        [disabled]="disabled()"
-        readonly
-        pSize="small"
-      />
-
-      <!-- 2. Addon con fondo blanco y botón verde -->
-      <p-inputgroup-addon styleClass="surface-card">
-        <p-button
-          label="➕"
-          (onClick)="increment()"
-          [disabled]="disabled() || isMax()"
-          [outlined]="outlined()"
-          lxTooltip="Aumentar"
-          tooltipPosition="top"
-          size="small"
-        />
-      </p-inputgroup-addon>
-    </p-inputgroup>
+    <div class="input-group" style="width: auto;">
+      <span class="input-group-text surface-card p-0">
+        <il-button
+          label="➖"
+          (clicked)="decrement()"
+          [disabled]="disabled() || isMin()"
+          [variant]="outlined() ? 'outline' : 'solid'"
+          lxTooltip="Disminuir"
+          tooltipPosition="top"
+          size="sm"
+        />
+      </span>
+
+      <input
+        class="form-control form-control-sm text-center"
+        style="width: 60px"
+        type="number"
+        [formControl]="control()"
+        [min]="minValue()"
+        [max]="maxValue()"
+        [disabled]="disabled()"
+        readonly
+      />
+
+      <span class="input-group-text surface-card p-0">
+        <il-button
+          label="➕"
+          (clicked)="increment()"
+          [disabled]="disabled() || isMax()"
+          [variant]="outlined() ? 'outline' : 'solid'"
+          lxTooltip="Aumentar"
+          tooltipPosition="top"
+          size="sm"
+        />
+      </span>
+    </div>
   `,
```
(`il-button` dentro de `.input-group-text` con `p-0` para que no le
sobre padding al botón; ajusta si visualmente no calza bien, es un
detalle de estilo, no de lógica)

## Verificación

- `grep -n "ngbTooltip\|NgbTooltip" mesanio.ts` → 0 resultados (debe
  quedar solo `lxTooltip`).
- `npx tsc --noEmit`: 0 errores nuevos.
- `ng build` **redirigido a archivo completo (`> log 2>&1`), espera a
  que el proceso termine de verdad, revisa el log entero con
  `grep -c ERROR`**.
- **Prueba real en navegador**: cada uno de los 4 en al menos 1
  consumidor real (búscalos con
  `grep -rl "app-rango-calendario-yyyymmdd\|app-mesanio\|app-calendar-range\|app-touchspin" src/app/modules --include="*.html"`)
  — confirma que los selectores de fecha siguen abriendo/funcionando
  igual, y que los botones +/- del touchspin incrementan/decrementan
  respetando min/max.

## Listo cuando

- `mesanio.ts` usando `lxTooltip` en vez de `ngbTooltip` directo.
- Capturas de los 4 en al menos 1 consumidor real cada uno.
- `tsc`/build limpios.
  a 14.
