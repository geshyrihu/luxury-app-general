# Prompt Fase 7 — Catálogo: `catalog-guia.ts` — dialog con markup Bootstrap nativo

`app-dialog` (`@ui/web/dialog/dialog`) sigue envolviendo
`primeng/dialog` por dentro (confirmado leyendo su fuente,
2026-09-16) — usarlo NO elimina PrimeNG, solo lo esconde detrás de
otro selector. Este archivo no tiene ninguna razón para depender de
un componente compartido con ese problema, así que construimos el
dialog con markup Bootstrap 5 nativo directo (sin JS plugin, solo
CSS + un signal boolean — no requiere `bootstrap.bundle.js` ni
`NgbModal`).

Archivo:
```
src/app/modules/admin.luxuryapp/herramientas-dev/catalog-component-ui/foundations/catalog-guia/catalog-guia.ts
src/app/modules/admin.luxuryapp/herramientas-dev/catalog-component-ui/foundations/catalog-guia/catalog-guia.html
```

## Cambio en el `.ts`

```diff
-import { DialogModule } from "@ui/web/primeng-dialog/primeng-dialog";
```
Quita del arreglo `imports:` también. La propiedad `dialogVisible`
(boolean plano, no signal) y el método `openDialog()` **no cambian**.

## Cambio en el `.html` (líneas ~475-499)

```diff
-<p-dialog
-  header="Confirmacion institucional"
-  [(visible)]="dialogVisible"
-  [modal]="true"
-
-  [draggable]="false"
->
-  <p>
-    Los dialogs deben resolver decisiones breves. Si el usuario necesita
-    capturar informacion extensa, navega a una pantalla dedicada.
-  </p>
-  <div class="mt-3 d-flex justify-content-end gap-2">
-    <il-button label="Cancelar" severity="secondary" variant="outline" (clicked)="dialogVisible = false" />
-    <il-button label="Confirmar" iconClass="icon.check" (clicked)="dialogVisible = false" />
-  </div>
-</p-dialog>
+<div
+  class="modal fade"
+  [class.show]="dialogVisible"
+  [style.display]="dialogVisible ? 'block' : 'none'"
+  tabindex="-1"
+  role="dialog"
+  [attr.aria-hidden]="!dialogVisible"
+>
+  <div class="modal-dialog modal-dialog-centered">
+    <div class="modal-content">
+      <div class="modal-header">
+        <h5 class="modal-title">Confirmacion institucional</h5>
+        <button type="button" class="btn-close" aria-label="Cerrar" (click)="dialogVisible = false"></button>
+      </div>
+      <div class="modal-body">
+        <p>
+          Los dialogs deben resolver decisiones breves. Si el usuario necesita
+          capturar informacion extensa, navega a una pantalla dedicada.
+        </p>
+      </div>
+      <div class="modal-footer">
+        <il-button label="Cancelar" severity="secondary" variant="outline" (clicked)="dialogVisible = false" />
+        <il-button label="Confirmar" iconClass="icon.check" (clicked)="dialogVisible = false" />
+      </div>
+    </div>
+  </div>
+</div>
+@if (dialogVisible) {
+<div class="modal-backdrop fade show"></div>
+}
```

(la línea en blanco vacía que tenía el `p-dialog` original entre
`[modal]="true"` y `[draggable]="false"` era un resto de un binding
removido — no la repliques, ya no aplica.)

## Verificación

- `grep -n "primeng" catalog-guia.ts` → 0 resultados.
- `npx tsc --noEmit`: 0 errores nuevos.
- `ng build` **redirigido a archivo completo (`> log 2>&1`), revisa el
  log entero con `grep -c ERROR`, no uses `tail`**.
- Captura real: abre el dialog desde el botón que lo dispara
  (`(clicked)="openDialog()"`, línea ~401 del mismo `.html`) — debe
  verse centrado, con fondo oscurecido (backdrop), y cerrarse con
  "Cancelar"/"Confirmar" igual que antes.

## Listo cuando

- `catalog-guia.ts` sin ningún import de PrimeNG.
- Captura confirmando que el dialog se ve y se comporta igual.
- `tsc`/build limpios.
