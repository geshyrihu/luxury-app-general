# Prompt 22 — Fase 6: cierre de Grupo 1 (ecosistema de tabla completo)

Con `p-table` cerrado al 100%, quedan 4 piezas más del mismo Grupo 1
del inventario. Investigadas todas antes de escribir esto — 2 ya
están limpias (solo falta confirmarlo), 1 necesita migración real
pequeña, 1 es import muerto.

## 1. Solo verificar — ya están 100% limpias de PrimeNG

```
src/app/shared/ui/web/primeng-custom-caption/primeng-custom-caption.ts
src/app/shared/ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage.ts
src/app/shared/ui/web/primeng-custom-table-footer/primeng-custom-table-footer.ts
```

Los 3 ya tienen **cero imports de PrimeNG** — `primeng-custom-caption`
tipa `dt` como `any` (no `Table` de PrimeNG) y solo llama
`dt.filterGlobal(term, "contains")`, que `AppTable` ya implementa con
la misma firma — funciona por duck-typing sin cambios. Los otros 2 son
componentes propios (`app-empty-state`, contador simple). **No hace
falta tocar código**, solo confirma con `grep -n "primeng\|TableModule"`
en los 3 que sigue sin salida, y prueba visualmente una pantalla que
use `primeng-custom-caption` con búsqueda global para confirmar que
filtra de verdad contra la nueva `AppTable`.

## 2. Migrar — `primeng-custom-global-filter.ts` (0 consumidores reales, migra igual por completitud del catálogo)

```
src/app/shared/ui/web/primeng-custom-global-filter/primeng-custom-global-filter.ts
```

Sin consumidores reales en `src/app/modules` (solo aparece como
entrada de metadata en `ui-dictionary.ts`, el catálogo de componentes
— no es uso real). Aun así, se migra para que el catálogo del design
system no tenga una pieza con PrimeNG real por dentro:

```diff
-import { IconFieldModule } from "primeng/iconfield";
-import { InputIconModule } from "primeng/inputicon";
-import { InputTextModule } from "primeng/inputtext";
-import { Table } from "primeng/table";
+import { AppTable } from "@ui/web/table/table";
```

```diff
-  imports: [
-    FormsModule,
-    InputTextModule,
-    IconFieldModule,
-    InputIconModule,
-    AppIcon,
-  ],
+  imports: [FormsModule, AppIcon],
```

```diff
-  template: `
-    <p-iconfield iconPosition="left" fluid>
-      <p-inputicon>
-        <app-icon icon="material-symbols-light:search" />
-      </p-inputicon>
-      <input
-        pInputText
-        type="text"
-        (input)="onFilter($event)"
-        placeholder="Buscar..."
-        fluid
-        pSize="small"
-      />
-    </p-iconfield>
-  `,
+  template: `
+    <div class="input-group input-group-sm">
+      <span class="input-group-text">
+        <app-icon icon="material-symbols-light:search" />
+      </span>
+      <input
+        type="text"
+        (input)="onFilter($event)"
+        placeholder="Buscar..."
+        class="form-control"
+      />
+    </div>
+  `,
```

```diff
-  dt = input<Table | undefined>(undefined);
+  dt = input<AppTable | undefined>(undefined);
```

## 3. Retirar import muerto — `p-dataview` nunca se usa en las plantillas

```
src/app/modules/operations.luxuryapp/custom-documents/custom-document/acta-constitutiva-list.ts
src/app/modules/operations.luxuryapp/task-engine/tasks/work-group/task-group-list.ts
```

Ambos importan `DataViewModule` desde
`@ui/web/primeng-dataview/primeng-dataview`, pero **ninguno de los 2
`.html` tiene un solo `<p-dataview>`** (confirmado con `grep -c`, 0 en
ambos) — usan `DataViewMobile` (propio, sin PrimeNG) para la versión
móvil y nada para escritorio, o cubren el caso de otra forma. Es un
import huérfano. Quita `DataViewModule` del import y del arreglo
`imports:` en los 2 archivos — no debería cambiar nada visualmente,
confirma con una captura que la pantalla se ve igual antes/después.

**No toques** `src/app/shared/ui/web/primeng-dataview/primeng-dataview.ts`
(el barrel `export * from "primeng/dataview"` en sí) — con 0
consumidores reales tras este cambio, queda catalogado para retirarlo
en Fase 7 junto con el resto de dependencias PrimeNG del `package.json`,
no ahora.

## Verificación

- `npx tsc --noEmit` limpio.
- `ng build` **redirigido a archivo completo (`> log 2>&1`), revisa el
  log entero con `grep -c ERROR`, no uses `tail`**.
- Capturas reales: una pantalla con `primeng-custom-caption` (búsqueda
  funcionando), y las 2 pantallas del punto 3 antes/después (deberían
  verse idénticas).

## Listo cuando

- Punto 1: confirmado sin cambios de código, verificado visualmente.
- Punto 2: `primeng-custom-global-filter.ts` migrado, cero PrimeNG.
- Punto 3: los 2 imports muertos retirados.
- `tsc`/build limpios (log completo, no `tail`).
- Con esto, **Grupo 1 del inventario (tabla y ecosistema directo)
  queda 100% cerrado**, salvo `p-dataview` en sí (el barrel), que se
  cataloga para Fase 7.
