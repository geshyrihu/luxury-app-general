# Prompt Fase 7 — Catálogo: 6 archivos pequeños (button, selectbutton, toggleswitch, inputtext, tabs, multiselect, toast)

El usuario decidió migrar el catálogo interno de componentes
(`herramientas-dev/catalog-component-ui/*`) a Bootstrap en vez de
`04-bitacora-cambios.md`) confirmó la API real de cada reemplazo —
sigue las instrucciones exactas de este prompt, no improvises props.

**Advertencia importante descubierta en la investigación**: `app-dialog`
(`@ui/web/dialog/dialog`) y `app-multi-select`
reemplazo — para multiselect usa `custom-input-multiselect-signal` (ver
punto 6 abajo). El caso de dialog se resuelve en un prompt aparte con
markup Bootstrap nativo.

## 1. `foundations/catalog-guia-item/button-catalog/button-catalog.ts`

Reemplaza (líneas ~415-458, panel de controles global del catálogo de
botones):

```diff
+import { AppSelectButton } from "@ui/web/select-button/select-button";
+import { AppToggleSwitch } from "@ui/web/toggle-switch/toggle-switch";
```
(agrega/quita en `imports:` del `@Component` acorde)

```diff
-<p-selectbutton [options]="webSizeCtrl" [ngModel]="webSize()" (ngModelChange)="webSize.set($event)" optionLabel="label" optionValue="value" />
-<p-selectbutton [options]="ionicSizeCtrl" [ngModel]="ionicSize()" (ngModelChange)="ionicSize.set($event)" optionLabel="label" optionValue="value" />
-<p-toggleswitch [ngModel]="isDisabled()" (ngModelChange)="isDisabled.set($event)" inputId="btn-dis" />
-<p-toggleswitch [ngModel]="isLoading()" (ngModelChange)="isLoading.set($event)" inputId="btn-load" />
+<app-select-button [options]="webSizeCtrl" [value]="webSize()" (valueChange)="webSize.set($event)" />
+<app-select-button [options]="ionicSizeCtrl" [value]="ionicSize()" (valueChange)="ionicSize.set($event)" />
+<app-toggle-switch [checked]="isDisabled()" (checkedChange)="isDisabled.set($event)" inputId="btn-dis" />
+<app-toggle-switch [checked]="isLoading()" (checkedChange)="isLoading.set($event)" inputId="btn-load" />
```

`AppSelectButton` (`select-button.base.ts`) espera `options` como
`{label, value}[]` — `webSizeCtrl`/`ionicSizeCtrl` ya vienen así
(`.map()` en el `.ts`, no los toques), **no** tiene
`optionLabel`/`optionValue` configurables, quítalos. `value`/`checked`
son `model()` en ambos componentes — usa binding de dos vías
`[(value)]`/`[(checked)]` si prefieres en vez de
`[value]`+`(valueChange)` explícito, funcionalmente es lo mismo.

## 2. `patterns-layouts/catalog-layouts-item/catalog-layouts-item.ts`

```diff
+import { WebButtonLabel } from "@ui/buttons/web-label/button";
```

```diff
-<p-button
-  label="Ver todos los Layouts"
-  icon="icon.grid"
-  (click)="router.navigate(['/', 'settings', 'ui-catalog', 'layouts'])"
-/>
+<il-button
+  label="Ver todos los Layouts"
+  iconClass="icon.grid"
+  (clicked)="router.navigate(['/', 'settings', 'ui-catalog', 'layouts'])"
+/>
```
(`il-button` es el selector real de `WebButtonLabel`, confírmalo en
cualquier archivo ya migrado que lo use; el evento es `(clicked)`, no
`(click)`)

## 3. `patterns-layouts/catalog-patterns-item/catalog-patterns-item.ts`

```diff
+import { WebButtonLabel } from "@ui/buttons/web-label/button";
+import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
+import { Tabs } from "@ui/web/tabs/tabs";
```

`@case ("loginreference")` (líneas ~91-125):
```diff
-<input pInputText [(ngModel)]="email" placeholder="admin@luxuryapp.com" class="w-full mb-2" />
-<input pInputText type="password" [(ngModel)]="password" placeholder="Contraseóa" class="w-full mb-2" />
-<p-button label="Iniciar Sesión" class="w-full" class="w-full" />
+<custom-input-text-signal [(ngModel)]="email" placeholder="admin@luxuryapp.com" [onlyInput]="true" class="w-full mb-2" />
+<custom-input-text-signal type="password" [(ngModel)]="password" placeholder="Contraseña" [onlyInput]="true" class="w-full mb-2" />
+<il-button label="Iniciar Sesión" class="w-full" />
```
(de paso corrige el typo `Contraseóa`→`Contraseña` y el `class="w-full"`
duplicado — ambos bugs preexistentes que ya identificamos)

`@case ("navigationreference")` (líneas ~126-144):
```diff
-<p-tabs value="0">
-  <p-tablist>
-    <p-tab value="0">Dashboard</p-tab>
-    <p-tab value="1">Reportes</p-tab>
-  </p-tablist>
-  <p-tabpanels>
-    <p-tabpanel value="0"><p>Contenido Dashboard.</p></p-tabpanel>
-    <p-tabpanel value="1"><p>Reportes.</p></p-tabpanel>
-  </p-tabpanels>
-</p-tabs>
+<app-tabs [tabs]="[{id:'0',label:'Dashboard'},{id:'1',label:'Reportes'}]" [(activeId)]="patternsTabActiveId">
+  <div tab="0"><p>Contenido Dashboard.</p></div>
+  <div tab="1"><p>Reportes.</p></div>
+</app-tabs>
```
Agrega en el `.ts`: `patternsTabActiveId = signal("0");` (o el nombre
que prefieras, solo úsalo consistente con el `[(activeId)]` de arriba).

## 4. `catalog-core-item/catalog-core-item.ts`

```diff
+import { WebButtonLabel } from "@ui/buttons/web-label/button";
```

`@case ("commandpalette")` (líneas ~827-857):
```diff
-<p-button label="Abrir Command Palette (Ctrl+K)" (onClick)="cmdPaletteVisible.set(true)">
-  <ng-template #icon>
-    <app-icon icon="material-symbols-light:search" />
-  </ng-template>
-</p-button>
+<il-button label="Abrir Command Palette (Ctrl+K)" icon="material-symbols-light:search" (clicked)="cmdPaletteVisible.set(true)" />
```

`@case ("tour")` (líneas ~858-881), mismo patrón:
```diff
-<p-button label="Iniciar Tour" (onClick)="tourVisible.set(true)">
-  <ng-template #icon>
-    <app-icon icon="material-symbols-light:route" />
-  </ng-template>
-</p-button>
+<il-button label="Iniciar Tour" icon="material-symbols-light:route" (clicked)="tourVisible.set(true)" />
```
(`il-button` recibe el icono por el input `icon` directo, no necesita
`<ng-template #icon>` — esa API era específica de `p-button`)

## 5. `catalog-core-item/catalog-web-extras.ts`

**Corrección de alcance**: este archivo NO tiene `p-checkbox` (ya
migrado a `<app-checkbox>`, 100% Bootstrap, no tocar). Lo que sí sigue
que usarlo no cuenta como migrado.

```diff
-<app-multi-select [options]="multiOptions" optionLabel="label" placeholder="Choose options">
+<custom-input-multiselect-signal [data]="multiOptions" optionLabel="label" placeholder="Choose options" [onlyInput]="true" />
```
Ajusta el import (`CustomInputMultiselectSignal` desde
`@ui/inputs/web/custom-input-multiselect-signal` o el barrel
`@ui/inputs/web`, confirma el path real en otro consumidor ya
migrado) y quita el import de `AppMultiSelect` si ya no se usa en
ningún otro lugar del archivo.

**No toques** el import de `MegaMenuItem, MenuItem, TreeNode` desde
datos demo, no requieren componente Angular; catalogar aparte, fuera
de este prompt (no bloquea nada, es solo un acoplamiento de tipos).

## 6. `shared/tokens-colors/tokens-colors.ts`

```diff
+import { MessageService } from "@core/services/message.service";
+import { AppToast } from "@ui/web/toast/toast";
```
(ajusta `imports:` del `@Component` igual)

```diff
-<p-toast position="top-right" />
+<app-toast />
```

**Antes de tocar el template**, confirma si `app.html` ya monta un
`<app-toast />` global para toda la app (como con `ConfirmDialog`) —
si es así, **elimina el `<p-toast>` de este archivo sin reemplazarlo**
(el toast global ya cubre las llamadas de `MessageService.add()` desde
cualquier componente, este local sería redundante). Si no hay uno
global, usa el reemplazo de arriba.

El método `copy()` (línea ~176) y el `providers: [MessageService]`
**no cambian de lógica**, solo el import — `@core/services/message.service`
tiene la misma firma `.add({severity,summary,detail,life})`.

## Verificación (para los 6 archivos)

  `MegaMenuItem/MenuItem/TreeNode` de `catalog-web-extras.ts` (ese se
  queda, ver punto 5).
- `npx tsc --noEmit`: 0 errores nuevos.
- `ng build` **redirigido a archivo completo (`> log 2>&1`), revisa el
  log entero con `grep -c ERROR`, no uses `tail`**.
- Capturas reales de cada uno de los 6 en el catálogo (`/admin/...`
  ruta del catálogo de componentes, sección correspondiente) — deben
  verse y comportarse igual que antes (los toggles/selects siguen
  funcionando, el botón de comando palette sigue abriendo el overlay,
  etc.)

## Listo cuando

  anotada).
- Capturas confirmando que cada demo se ve/funciona igual.
- `tsc`/build limpios.
