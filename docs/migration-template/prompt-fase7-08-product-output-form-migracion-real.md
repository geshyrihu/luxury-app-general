# Prompt Fase 7 — Paso 8: migración real — `product-output-form.ts` (último `pInputText` genuino)

Confirmado (2026-09-16): este es el **único archivo de negocio real**
que queda con un uso genuino de PrimeNG a nivel de componente/directiva
(los otros 3 candidatos que parecían reales resultaron ser imports
muertos con coincidencia de clase CSS, ver `prompt-fase7-07-*.md`).

Archivo:
```
src/app/modules/operations.luxuryapp/inventarios-y-almacn/product-exit/product-output-form.ts
src/app/modules/operations.luxuryapp/inventarios-y-almacn/product-exit/product-output-form.html
```

## Cambio en el `.ts`

```diff
-import { InputTextModule } from "@ui/web/primeng-inputtext/primeng-inputtext";
```
Quita también `InputTextModule` del arreglo `imports:`.

## Cambio en el `.html` (línea 28)

Es un `<input>` de solo lectura (readonly) que muestra el nombre del
producto seleccionado — patrón estándar ya usado en el resto del
proyecto migrado (`.form-control` de Bootstrap):

```diff
-          <input pInputText [readonly]="true" [value]="nombreProducto()" class="w-100" />
+          <input readonly [value]="nombreProducto()" class="form-control w-100" />
```

(Bootstrap no requiere una directiva para el input, solo la clase
`.form-control`; `readonly` es un atributo nativo, no necesita el
binding `[readonly]="true"` — pero si el resto del formulario en este
mismo archivo usa `[readonly]="true"` como convención, mantenlo igual
para no introducir inconsistencia dentro del mismo archivo, a tu
criterio.)

## Verificación

- `grep -n "primeng" product-output-form.ts` → 0 resultados.
- `npx tsc --noEmit`: 0 errores.
- `ng build` **redirigido a archivo completo (`> log 2>&1`), revisa el
  log entero con `grep -c ERROR`, no uses `tail`**.
- Captura real de la pantalla (formulario de salida de producto,
  sección "Producto") antes/después — debe verse igual o mejor
  (input de solo lectura con el nombre del producto), sin perder el
  estilo `w-100`.

## Listo cuando

- `product-output-form.ts`/`.html` sin ningún rastro de PrimeNG.
- Captura confirmando que se ve igual.
- `tsc`/build limpios.
- Con esto, **0 archivos de negocio real con PrimeNG genuino quedan
  en todo `src/app/modules`** — solo faltan el catálogo interno
  (`catalog-component-ui/*`) y el `ConfirmDialog` global antes de
  poder retirar el paquete `primeng`.
