# Prompt 22 — Fase 6: cierre de Grupo 1 (ecosistema de tabla completo)

Con `p-table` cerrado al 100%, quedan 4 piezas más del mismo Grupo 1
del inventario. Investigadas todas antes de escribir esto — 2 ya
están limpias (solo falta confirmarlo), 1 necesita migración real
pequeña, 1 es import muerto.


```
```

`dt.filterGlobal(term, "contains")`, que `AppTable` ya implementa con
la misma firma — funciona por duck-typing sin cambios. Los otros 2 son
componentes propios (`app-empty-state`, contador simple). **No hace
en los 3 que sigue sin salida, y prueba visualmente una pantalla que
filtra de verdad contra la nueva `AppTable`.


```
```

Sin consumidores reales en `src/app/modules` (solo aparece como
entrada de metadata en `ui-dictionary.ts`, el catálogo de componentes
— no es uso real). Aun así, se migra para que el catálogo del design

```diff
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
`.html` tiene un solo `<p-dataview>`** (confirmado con `grep -c`, 0 en
móvil y nada para escritorio, o cubren el caso de otra forma. Es un
import huérfano. Quita `DataViewModule` del import y del arreglo
`imports:` en los 2 archivos — no debería cambiar nada visualmente,
confirma con una captura que la pantalla se ve igual antes/después.

consumidores reales tras este cambio, queda catalogado para retirarlo
no ahora.

## Verificación

- `npx tsc --noEmit` limpio.
- `ng build` **redirigido a archivo completo (`> log 2>&1`), revisa el
  log entero con `grep -c ERROR`, no uses `tail`**.
  funcionando), y las 2 pantallas del punto 3 antes/después (deberían
  verse idénticas).

## Listo cuando

- Punto 1: confirmado sin cambios de código, verificado visualmente.
- Punto 3: los 2 imports muertos retirados.
- `tsc`/build limpios (log completo, no `tail`).
- Con esto, **Grupo 1 del inventario (tabla y ecosistema directo)
  queda 100% cerrado**, salvo `p-dataview` en sí (el barrel), que se
  cataloga para Fase 7.
