# Prompt Fase 8 — `tree.ts`: reescritura completa (el más complejo, 1 consumidor real de negocio)

Investigado a fondo: único consumidor de negocio real
(`account-tree-select.ts`, el otro "consumidor" es el catálogo
interno de demo, no cuenta) usa `selectionMode="checkbox"` con
selección en cascada real (marcar un nodo marca a todos sus
descendientes; si todos los hijos de un padre quedan marcados, el
padre se marca también; si algunos-pero-no-todos están marcados, el
padre muestra estado "parcial"/indeterminado), más una plantilla de
nodo 100% custom (`<ng-template #default let-node>`) que incluye
drag&drop de `@angular/cdk/drag-drop` — **ese drag&drop es del
consumidor, no de `Tree` en sí, no necesita ningún cambio, solo hay
que seguir proyectando la plantilla igual que antes**.

Dato importante encontrado: el `set selectedNodes` del consumidor
(líneas ~160-197 de `account-tree-select.ts`) **ya hace su propia
simplificación** de la selección recibida (deduplica, filtra
ancestros redundantes) antes de guardarla como `selectedCodes`. Esto
significa que el algoritmo de cascada de `Tree` no tiene que ser
checkbox-tree correcta (marcar/desmarcar cascada + estado parcial),
el consumidor ya absorbe el resto.

```
src/app/shared/ui/web/tree/tree.ts
```

## Diseño

Renderizado recursivo con el patrón estándar de Angular
(`ng-template` autorreferenciado vía `ngTemplateOutlet`, sin
componente hijo separado):

```diff
-import {
-  ChangeDetectionStrategy,
-  Component,
-  ViewEncapsulation,
-} from "@angular/core";
-import { TreeBase } from "@ui/base/tree.base";
+import {
+  ChangeDetectionStrategy,
+  Component,
+  computed,
+  contentChild,
+  signal,
+  TemplateRef,
+  ViewEncapsulation,
+} from "@angular/core";
+import { NgTemplateOutlet } from "@angular/common";
+import { TreeBase, TreeNode } from "@ui/base/tree.base";
+import { AppIcon } from "@ui/shared/app-icon/app-icon";

 @Component({
   selector: "app-tree",
-
-  imports: [TreeModule],
+  imports: [NgTemplateOutlet, AppIcon],
   template: `
-    <p-tree
-      [value]="value()"
-      [selection]="selection()"
-      (selectionChange)="selection.set($event)"
-      [selectionMode]="selectionMode()"
-      [scrollHeight]="scrollHeight()"
-      [metaKeySelection]="metaKeySelection()"
-      styleClass="w-full"
-    >
-      <ng-content />
-    </p-tree>
+    <div class="app-tree" [style.max-height]="scrollHeight()" [style.overflow]="scrollHeight() ? 'auto' : null">
+      <ng-container [ngTemplateOutlet]="nodeList" [ngTemplateOutletContext]="{ nodes: value() }" />
+    </div>
+
+    <ng-template #nodeList let-nodes="nodes">
+      <ul class="app-tree-list">
+        @for (node of nodes; track $index) {
+          <li class="app-tree-node">
+            <div class="app-tree-node-row">
+              @if (node.children?.length) {
+                <button type="button" class="app-tree-toggle" (click)="toggleExpand(node)">
+                  <app-icon [icon]="isExpanded(node) ? 'material-symbols-light:keyboard-arrow-down' : 'material-symbols-light:chevron-right'" />
+                </button>
+              } @else {
+                <span class="app-tree-toggle-spacer"></span>
+              }
+              @if (selectionMode() === 'checkbox') {
+                <input
+                  type="checkbox"
+                  class="form-check-input app-tree-checkbox"
+                  [checked]="isChecked(node)"
+                  [indeterminate]="isPartial(node)"
+                  (click)="$event.stopPropagation()"
+                  (change)="toggleCheck(node)"
+                />
+              }
+              <div
+                class="app-tree-node-content"
+                [class.app-tree-node-selected]="isSelectedRow(node)"
+                (click)="onNodeClick(node)"
+              >
+                @if (itemTpl(); as tpl) {
+                  <ng-container [ngTemplateOutlet]="tpl" [ngTemplateOutletContext]="{ $implicit: node }" />
+                } @else {
+                  @if (node.icon) { <app-icon [icon]="node.icon" /> }
+                  <span>{{ node.label }}</span>
+                }
+              </div>
+            </div>
+            @if (node.children?.length && isExpanded(node)) {
+              <div class="app-tree-children">
+                <ng-container [ngTemplateOutlet]="nodeList" [ngTemplateOutletContext]="{ nodes: node.children }" />
+              </div>
+            }
+          </li>
+        }
+      </ul>
+    </ng-template>
   `,
   styles: [
     `
+      .app-tree-list { list-style: none; padding-left: 0; margin: 0; }
+      .app-tree-children .app-tree-list { padding-left: 1.5rem; }
+      .app-tree-node-row { display: flex; align-items: center; gap: 0.25rem; padding: 0.125rem 0; }
+      .app-tree-toggle {
+        width: 1.25rem; height: 1.25rem; border: 0; background: none; padding: 0;
+        display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0;
+      }
+      .app-tree-toggle-spacer { width: 1.25rem; flex-shrink: 0; }
+      .app-tree-checkbox { flex-shrink: 0; }
+      .app-tree-node-content { display: flex; align-items: center; gap: 0.375rem; flex: 1 1 auto; min-width: 0; padding: 0.15rem 0.4rem; border-radius: 6px; cursor: pointer; }
+      .app-tree-node-content:hover { background: var(--ds-bg-sunken); }
+      .app-tree-node-selected { background: var(--ds-primary-light, #e7f1ff); }
     `,
   ],
   changeDetection: ChangeDetectionStrategy.OnPush,
   encapsulation: ViewEncapsulation.None,
 })
-export class Tree extends TreeBase {}
+export class Tree extends TreeBase {
+  private itemTpl = contentChild<TemplateRef<unknown>>("default");
+
+  protected expandedSet = signal<Set<TreeNode>>(new Set());
+
+  protected isExpanded(node: TreeNode): boolean {
+    return this.expandedSet().has(node) || !!node.expanded;
+  }
+
+  protected toggleExpand(node: TreeNode): void {
+    this.expandedSet.update((set) => {
+      const next = new Set(set);
+      if (next.has(node)) next.delete(node);
+      else next.add(node);
+      return next;
+    });
+  }
+
+  private selectedSet = computed(() => {
+    const sel = this.selection();
+    if (Array.isArray(sel)) return new Set(sel);
+    return new Set(sel ? [sel] : []);
+  });
+
+  protected isChecked(node: TreeNode): boolean {
+    return this.selectedSet().has(node);
+  }
+
+  protected isSelectedRow(node: TreeNode): boolean {
+    return this.selectionMode() !== "checkbox" && this.isChecked(node);
+  }
+
+  protected isPartial(node: TreeNode): boolean {
+    if (!node.children?.length || this.isChecked(node)) return false;
+    return this.hasSelectedDescendant(node);
+  }
+
+  private hasSelectedDescendant(node: TreeNode): boolean {
+    if (!node.children) return false;
+    for (const child of node.children) {
+      if (this.selectedSet().has(child) || this.hasSelectedDescendant(child)) return true;
+    }
+    return false;
+  }
+
+  protected onNodeClick(node: TreeNode): void {
+    const mode = this.selectionMode();
+    if (mode === "checkbox") return;
+    if (mode === "single") {
+      this.selection.set(node);
+    } else if (mode === "multiple") {
+      const current: TreeNode[] = Array.isArray(this.selection()) ? [...this.selection()] : [];
+      const idx = current.indexOf(node);
+      if (idx >= 0) current.splice(idx, 1);
+      else current.push(node);
+      this.selection.set(current);
+    }
+  }
+
+  protected toggleCheck(node: TreeNode): void {
+    const willCheck = !this.isChecked(node);
+    const next = new Set(this.selectedSet());
+    this.setDescendantsChecked(node, willCheck, next);
+    this.syncAncestors(this.value(), node, next);
+    this.selection.set([...next]);
+  }
+
+  private setDescendantsChecked(node: TreeNode, checked: boolean, set: Set<TreeNode>): void {
+    if (checked) set.add(node);
+    else set.delete(node);
+    node.children?.forEach((child) => this.setDescendantsChecked(child, checked, set));
+  }
+
+  private syncAncestors(roots: TreeNode[], target: TreeNode, set: Set<TreeNode>): void {
+    const path = this.findPath(roots, target, []);
+    if (!path) return;
+    for (let i = path.length - 2; i >= 0; i--) {
+      const ancestor = path[i];
+      const allChildrenChecked = ancestor.children?.every((c) => set.has(c)) ?? false;
+      if (allChildrenChecked) set.add(ancestor);
+      else set.delete(ancestor);
+    }
+  }
+
+  private findPath(nodes: TreeNode[], target: TreeNode, path: TreeNode[]): TreeNode[] | null {
+    for (const node of nodes) {
+      const newPath = [...path, node];
+      if (node === target) return newPath;
+      if (node.children) {
+        const found = this.findPath(node.children, target, newPath);
+        if (found) return found;
+      }
+    }
+    return null;
+  }
+}
```

## Limitaciones aceptadas y documentadas

- **`metaKeySelection`**: no se implementó ctrl/shift-click para modos
  `single`/`multiple` — el único consumidor real usa `selectionMode="checkbox"`
  comportamiento en modo checkbox. Si en el futuro se necesita
  `single`/`multiple` con selección múltiple por teclado, hay que
  ampliarlo — no lo sobre-construyas ahora.
- **`draggable`/`droppable` de `TreeNode`**: no implementados (eran
  drag&drop real que sí usa el consumidor es de `@angular/cdk/drag-drop`,
  aplicado directamente en su propia plantilla `#default` — no pasa
  por `Tree`, sigue funcionando igual sin cambios.
- **`node.expanded` inicial**: se respeta como estado inicial
  (`isExpanded` lo revisa), pero una vez que el usuario expande/colapsa
  manualmente, el signal interno (`expandedSet`) manda — si el array
  `value()` cambia de referencia (nuevos nodos), el estado de expansión
  identidad de objeto).

## Verificación

- `npx tsc --noEmit`: 0 errores nuevos.
- `ng build` **redirigido a archivo completo (`> log 2>&1`), espera a
  que el proceso termine de verdad, revisa el log entero con
  `grep -c ERROR`**.
- **Prueba real en navegador, exhaustiva** (es el componente más
  complejo de toda esta limpieza): abre la pantalla que usa
  `app-account-tree-select` (reportes dinámicos de contabilidad,
  selector de catálogo de cuentas) y confirma:
  1. El árbol se expande/colapsa correctamente al hacer clic en la
     flecha.
  2. Marcar un checkbox de un nodo padre marca automáticamente todos
     sus hijos/nietos.
  3. Desmarcar un hijo dentro de un padre totalmente marcado deja al
     padre en estado "parcial" (checkbox con rayita, no marca completa).
  4. Marcar manualmente todos los hijos de un padre termina marcando
     también al padre automáticamente.
  5. El filtro de búsqueda (input de arriba) sigue funcionando.
  6. El drag&drop de un nodo (arrastrar código de cuenta hacia afuera
     del árbol) sigue funcionando igual que antes.
  7. La selección final se refleja correctamente en `selectedCodes`
     (verifica en la funcionalidad que consume ese selector, ej. un
     reporte dinámico que se arma con las cuentas elegidas).

## Listo cuando

- Los 7 puntos de la prueba real confirmados con capturas.
- `tsc`/build limpios.
  a 3 (quedan: `image-analysis-dialog`,
  `custom-input-upload-pdf-signal`, `editor`).
