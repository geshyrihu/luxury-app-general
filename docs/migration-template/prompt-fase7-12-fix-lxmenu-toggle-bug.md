# Prompt Fase 7 — Corrección: `LxMenu` no expone `toggle()`, bug en `calendario-maestro-lista.ts`

introducido por esta migración): `calendario-maestro-lista.ts` tipa
`menu.toggle(event)`, pero el `.html` **ya usa `<lx-menu #menu>`**
(Bootstrap real) — y `LxMenu` no tiene ningún método `toggle()`. Esto
casi con certeza falla en runtime (`TypeError: menu.toggle is not a
function`) cada vez que se hace clic en el botón de opciones del
calendario. Único consumidor de `LxMenu` en todo el repo — riesgo de
la corrección: nulo.

## 1. Agregar `toggle()` a `LxMenu`

```
src/app/shared/ui/adaptive/menu/menu.ts
```

`LxMenu` renderiza `<app-menu>` en web (que sí tiene
`toggle(): void`) o `<ili-menu>` en móvil (que no tiene concepto de
overlay/toggle, siempre se muestra inline). Agrega un método público
que delega al `AppMenu` interno cuando existe:

```diff
-import { Component, inject } from "@angular/core";
+import { Component, inject, viewChild } from "@angular/core";
 import { MenuBase } from "@ui/base/menu.base";
 import { MobileMenu } from "@ui/mobile/menu/menu";
 import { AppMenu } from "@ui/web/menu/menu";
 import { PlatformService } from "@core/services/platform.service";

 @Component({
   selector: "lx-menu",
   imports: [AppMenu, MobileMenu],
   template: `
     @if (platform.isMobile()) {
       <ili-menu [model]="model()" [popup]="popup()" [styleClass]="styleClass()"
         ><ng-content
       /></ili-menu>
     } @else {
-      <app-menu [model]="model()" [popup]="popup()" [styleClass]="styleClass()"
+      <app-menu #webMenu [model]="model()" [popup]="popup()" [styleClass]="styleClass()"
         ><ng-content
       /></app-menu>
     }
   `,
 })
 export class LxMenu extends MenuBase {
   protected platform = inject(PlatformService);
+  private webMenuRef = viewChild<AppMenu>("webMenu");
+
+  toggle(): void {
+    this.webMenuRef()?.toggle();
+  }
 }
```
(en móvil `webMenuRef()` es `undefined` porque `<app-menu>` no se
renderiza — `toggle()` simplemente no hace nada ahí, correcto: el menú
móvil ya se muestra inline sin necesidad de alternar visibilidad)

## 2. Corregir el consumidor

```
src/app/modules/maintenance.luxuryapp/planificacin-de-mantenimiento/maintenance-calendar-master/calendario-maestro-lista.ts
src/app/modules/maintenance.luxuryapp/planificacin-de-mantenimiento/maintenance-calendar-master/calendario-maestro-lista.html
```

```diff
+import { LxMenu } from "@ui/adaptive/menu/menu";
```
```diff
-  onSelectItem(item: any, menu: Menu, event: any) {
+  onSelectItem(item: any, menu: LxMenu) {
```
```diff
-    menu.toggle(event);
+    menu.toggle();
```

En el `.html` (línea ~38), quita el `$event` que ya no se necesita:
```diff
-              (clicked)="onSelectItem(evento, menu, $event)"
+              (clicked)="onSelectItem(evento, menu)"
```

## Verificación

  `src/app/modules`.
- `npx tsc --noEmit`: 0 errores nuevos.
- `ng build` **redirigido a archivo completo (`> log 2>&1`), espera a
  que el proceso termine de verdad, revisa el log entero con
  `grep -c ERROR`**.
- **Prueba real en la app** (esta vez es un fix de comportamiento, no
  solo de imports): entra al calendario general de mantenimiento,
  haz clic en el botón de opciones (ícono de menú) de cualquier
  evento, confirma que el menú contextual "Editar"/"Eliminar" se abre
  y se cierra correctamente. Si ya fallaba antes de este fix (que es
  lo esperado dado el bug), la captura de "antes" no aplica — solo
  documenta que funciona "después".

## Listo cuando

- `LxMenu` expone `toggle()`, delega correctamente al `AppMenu` web.
- Prueba real confirmando que el menú contextual abre/cierra bien.
- `tsc`/build limpios.
  sin ninguna excepción pendiente salvo las 2 ya documentadas
  (`conventions-viewer.service.ts` string de documentación,
  `catalog-web-extras.ts` tipos `MegaMenuItem`/etc.).
