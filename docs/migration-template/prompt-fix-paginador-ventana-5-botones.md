# Prompt — Fix: paginador de `AppTable` muestra un botón por cada página (debería limitar a 5)

Bug real reportado por el usuario con captura: en tablas con muchos
registros (ej. 13,750 registros / 30 por página = 459 páginas), el
paginador de `AppTable` renderiza **459 botones numerados** en vez de
página (`pageLinkSize`), deslizando la ventana según la página actual.
`AppTable` nunca implementó ese límite.

Archivo:
```
src/app/shared/ui/web/table/table.ts
```

## Causa exacta

Línea ~496:
```ts
protected pageIndexes = computed(() =>
  Array.from({ length: this.pageCount() }, (_, index) => index),
);
```
Genera un índice por cada página existente, sin ventana — de ahí los
459 botones.

## Fix

Reemplaza `pageIndexes` por una ventana deslizante de máximo 5
páginas, centrada en la página actual, con el rango original de la
tabla (0-based) clampeado a los límites válidos:

```diff
+  protected readonly maxPageButtons = 5;
+
-  protected pageIndexes = computed(() =>
-    Array.from({ length: this.pageCount() }, (_, index) => index),
-  );
+  protected pageIndexes = computed(() => {
+    const count = this.pageCount();
+    const max = this.maxPageButtons;
+    if (count <= max) {
+      return Array.from({ length: count }, (_, index) => index);
+    }
+    const current = this.currentPageIndex();
+    let start = Math.max(0, current - Math.floor(max / 2));
+    let end = start + max;
+    if (end > count) {
+      end = count;
+      start = end - max;
+    }
+    return Array.from({ length: end - start }, (_, index) => start + index);
+  });
```

`currentPageIndex` ya es una signal privada de la misma clase (línea
~386), así que `pageIndexes` (que ya es `computed`) puede leerla
directo sin exponer nada nuevo.

**No toques** los botones «/‹/›/» que ya existen alrededor del `@for`
(líneas ~252-293 del template) — siguen funcionando igual, van
primera/anterior/siguiente/última página independientemente de la
ventana de 5.

## Verificación

- `npx tsc --noEmit`: 0 errores.
- `ng build` **redirigido a archivo completo (`> log 2>&1`), espera a
  que el proceso termine de verdad, revisa el log entero con
  `grep -c ERROR`**.
- Prueba real: abre una tabla con muchos registros (ej. el mismo
  selector de productos de la captura del usuario, "Agregar producto"
  en solicitud de compra, 13,750 registros) y confirma que el
  paginador ahora muestra máximo 5 botones numerados, que la ventana
  se desliza correctamente al navegar con «/‹/›/» y al hacer clic en
  un número cercano al borde de la ventana, y que sigue funcionando
  igual en una tabla con pocas páginas (menos de 5) — no debe romperse
  ese caso.
- Prueba también una tabla con exactamente 5, 6, y 7 páginas para
  confirmar el borde de la lógica (`count <= max` vs. el cálculo de
  ventana).

## Listo cuando

- El paginador de `AppTable` muestra máximo 5 botones numerados en
  cualquier tabla, sin importar cuántas páginas totales tenga.
- Capturas antes/después de la tabla de la captura original (selector
  de productos con 13,750 registros).
- `tsc`/build limpios.
