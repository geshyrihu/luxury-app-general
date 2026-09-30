# Prompt Fase 8 — `paginator` y `menubar`: reescritura real a Bootstrap nativo

`MenubarBase` son puro Angular) — solo el `template` de cada

## 1. `web/paginator/paginator.ts`

```
src/app/shared/ui/web/paginator/paginator.ts
```
Mismo patrón de ventana deslizante de 5 botones ya aplicado en
`AppTable` (`shared/ui/web/table/table.ts`, fix reciente del
paginador) — reutiliza la misma lógica:

```diff
-import {
-  ChangeDetectionStrategy,
-  Component,
-  ViewEncapsulation,
-} from "@angular/core";
+import {
+  ChangeDetectionStrategy,
+  Component,
+  computed,
+  ViewEncapsulation,
+} from "@angular/core";
 import { PaginatorBase } from "@ui/base/paginator.base";

 @Component({
   selector: "app-paginator",
-
-  imports: [PaginatorModule],
   template: `
-    <p-paginator
-      [first]="page() * rows()"
-      [rows]="rows()"
-      [totalRecords]="totalRecords()"
-      [rowsPerPageOptions]="rowsPerPageOptions()"
-      [showFirstLastIcon]="showFirstLast()"
-      [showJumpToPageDropdown]="showJumpToPage()"
-      [showPageLinks]="showPageLinks()"
-      (onPageChange)="onPrimePageChange($event)"
-    />
+    <nav class="app-paginator" aria-label="Paginación">
+      <ul class="pagination pagination-sm mb-0 flex-wrap align-items-center gap-2">
+        @if (showFirstLast()) {
+          <li class="page-item" [class.disabled]="isFirstPage()">
+            <button type="button" class="page-link" (click)="onPageChange(0)">«</button>
+          </li>
+        }
+        <li class="page-item" [class.disabled]="isFirstPage()">
+          <button type="button" class="page-link" (click)="onPageChange(page() - 1)">‹</button>
+        </li>
+        @if (showPageLinks()) {
+          @for (p of pageIndexes(); track p) {
+            <li class="page-item" [class.active]="p === page()">
+              <button type="button" class="page-link" (click)="onPageChange(p)">{{ p + 1 }}</button>
+            </li>
+          }
+        }
+        <li class="page-item" [class.disabled]="isLastPage()">
+          <button type="button" class="page-link" (click)="onPageChange(page() + 1)">›</button>
+        </li>
+        @if (showFirstLast()) {
+          <li class="page-item" [class.disabled]="isLastPage()">
+            <button type="button" class="page-link" (click)="onPageChange(totalPages() - 1)">»</button>
+          </li>
+        }
+        @if (showJumpToPage() && totalPages() > 1) {
+          <li class="ms-2">
+            <select
+              class="form-select form-select-sm"
+              style="width: auto"
+              [value]="page()"
+              (change)="onPageChange(+$any($event.target).value)"
+            >
+              @for (p of allPageIndexes(); track p) {
+                <option [value]="p">Página {{ p + 1 }}</option>
+              }
+            </select>
+          </li>
+        }
+        <li class="ms-2">
+          <select
+            class="form-select form-select-sm"
+            style="width: auto"
+            [value]="rows()"
+            (change)="onRowsChange(+$any($event.target).value)"
+          >
+            @for (opt of rowsPerPageOptions(); track opt) {
+              <option [value]="opt">{{ opt }} / página</option>
+            }
+          </select>
+        </li>
+      </ul>
+    </nav>
   `,
   styles: [
     `
       :host {
         display: block;
       }
     `,
   ],
   changeDetection: ChangeDetectionStrategy.OnPush,
   encapsulation: ViewEncapsulation.None,
 })
-export class AppPaginator extends PaginatorBase {
-  onPrimePageChange(event: any): void {
-    const newPage = Math.floor(event.first / event.rows);
-    this.page.set(newPage);
-    if (event.rows !== this.rows()) {
-      this.rows.set(event.rows);
-    }
-    this.paginationChange.emit({
-      page: newPage,
-      rows: event.rows,
-      totalRecords: event.totalRecords,
-    });
-  }
-}
+export class AppPaginator extends PaginatorBase {
+  protected readonly maxPageButtons = 5;
+
+  protected pageIndexes = computed(() => {
+    const count = this.totalPages();
+    const max = this.maxPageButtons;
+    if (count <= max) {
+      return Array.from({ length: count }, (_, index) => index);
+    }
+    const current = this.page();
+    let start = Math.max(0, current - Math.floor(max / 2));
+    let end = start + max;
+    if (end > count) {
+      end = count;
+      start = end - max;
+    }
+    return Array.from({ length: end - start }, (_, index) => start + index);
+  });
+
+  protected allPageIndexes = computed(() =>
+    Array.from({ length: this.totalPages() }, (_, index) => index),
+  );
+}
```
`onPageChange`/`onRowsChange`/`totalPages`/`isFirstPage`/`isLastPage`
ya existen en `PaginatorBase`, no los reimplementes — el componente
web solo los consume.

## 2. `web/menubar/menubar.ts`

```
src/app/shared/ui/web/menubar/menubar.ts
```
Único consumidor real (`recruitment-shell.html`) usa **un solo nivel
de anidación** (items de primer nivel con `command` directo, o con
`items: [...]` de hijos sin más anidación) — el diseño de abajo cubre
exactamente eso, sin sobre-construir soporte multinivel que nadie usa.
No uses `NgbDropdown`/`data-bs-toggle` (evita depender del JS bundle
de Bootstrap o de la fricción de `NgbDropdown` con proyección de
contenido que ya causó un crash en `AppMenu` en el pasado) — controla
la visibilidad del submenú con un signal simple, mismo espíritu que
`Dialog`/`ConfirmDialog`.

```diff
-import {
-  ChangeDetectionStrategy,
-  Component,
-  ViewEncapsulation,
-} from "@angular/core";
+import {
+  ChangeDetectionStrategy,
+  Component,
+  signal,
+  ViewEncapsulation,
+} from "@angular/core";
 import { RouterModule } from "@angular/router";
 import { MenubarBase } from "@ui/base/menubar.base";
+import { AppIcon } from "@ui/shared/app-icon/app-icon";
+import type { MenuItem } from "@core/interfaces/menu-item.interface";

 @Component({
   selector: "app-menubar",
-
-  imports: [MenubarModule, RouterModule],
+  imports: [RouterModule, AppIcon],
   template: `
-    <p-menubar
-      [model]="items()"
-      [style]="{ background: 'transparent', border: 'none', padding: '0' }"
-    />
+    <ul class="nav app-menubar-nav" (mouseleave)="closeSubmenu()">
+      @for (item of items(); track $index; let i = $index) {
+        <li class="nav-item app-menubar-item" [class.dropdown]="!!item.items?.length">
+          <a
+            class="nav-link"
+            [class.dropdown-toggle]="!!item.items?.length"
+            href="#"
+            (click)="onItemClick(item, $event, i)"
+          >
+            @if (item.icon) {
+              <app-icon [icon]="iconName(item.icon)" />
+            }
+            {{ item.label }}
+          </a>
+          @if (item.items?.length && openIndex() === i) {
+            <ul class="dropdown-menu show app-menubar-dropdown">
+              @for (sub of item.items; track $index) {
+                <li>
+                  <a class="dropdown-item" href="#" (click)="onItemClick(sub, $event, i)">
+                    @if (sub.icon) {
+                      <app-icon [icon]="iconName(sub.icon)" />
+                    }
+                    {{ sub.label }}
+                  </a>
+                </li>
+              }
+            </ul>
+          }
+        </li>
+      }
+    </ul>
   `,
   styles: [
     `
-      app-menubar .p-menubar {
-        padding: 0;
-      }
-      app-menubar
-        .p-menubar-root-list
-        > .p-menuitem
-        > .p-menuitem-content
-        .p-menuitem-link {
-        padding: 0.625rem 1rem;
-        font-size: var(--ds-font-size-body);
-        color: var(--ds-text-primary);
-      }
-      app-menubar .p-menubar .p-menuitem-text {
-        color: var(--ds-text-primary);
-      }
-      app-menubar .p-menubar .p-submenu-list {
-        background: var(--ds-bg-surface);
-        border: 1px solid var(--ds-border);
-        border-radius: var(--ds-radius-md);
-        box-shadow: var(--ds-shadow-lg);
-      }
+      .app-menubar-nav {
+        background: transparent;
+        border: none;
+        padding: 0;
+      }
+      .app-menubar-item {
+        position: relative;
+      }
+      .app-menubar-nav .nav-link {
+        padding: 0.625rem 1rem;
+        font-size: var(--ds-font-size-body);
+        color: var(--ds-text-primary);
+        cursor: pointer;
+      }
+      .app-menubar-dropdown {
+        background: var(--ds-bg-surface);
+        border: 1px solid var(--ds-border);
+        border-radius: var(--ds-radius-md);
+        box-shadow: var(--ds-shadow-lg);
+      }
     `,
   ],
   changeDetection: ChangeDetectionStrategy.OnPush,
   encapsulation: ViewEncapsulation.None,
 })
-export class Menubar extends MenubarBase {}
+export class Menubar extends MenubarBase {
+  protected openIndex = signal<number | null>(null);
+
+  protected onItemClick(item: MenuItem, event: Event, index: number): void {
+    event.preventDefault();
+    if (item.items?.length) {
+      this.openIndex.update((current) => (current === index ? null : index));
+      return;
+    }
+    this.closeSubmenu();
+    this.runCommand(item, event);
+  }
+
+  protected closeSubmenu(): void {
+    this.openIndex.set(null);
+  }
+}
```
`iconName`/`runCommand` ya existen en `MenubarBase`, protegidos —
solo los consumes. Actualiza también el import de `MenuItem` en
`base/menubar.base.ts`:
```diff
+import type { MenuItem } from "@core/interfaces/menu-item.interface";
```

## Verificación

  resultados en los 3.
- `npx tsc --noEmit`: 0 errores nuevos.
- `ng build` **redirigido a archivo completo (`> log 2>&1`), espera a
  que el proceso termine de verdad, revisa el log entero con
  `grep -c ERROR`**.
- **Prueba real en navegador**:
  - `provider-list.html` (paginator): confirma que los botones
    numéricos, «/‹/›/», y el selector de filas por página funcionan.
  - `recruitment-shell.html` (menubar): confirma que "Solicitudes" y
    "Candidatos" (los que tienen submenú) abren su dropdown al hacer
    clic, que hacer clic en un ítem del submenú navega y cierra el
    dropdown, y que "Plantilla Interna" (sin submenú) navega directo.

## Listo cuando

- Capturas del paginador y del menú con su submenú abierto.
- `tsc`/build limpios.
  a 11.
