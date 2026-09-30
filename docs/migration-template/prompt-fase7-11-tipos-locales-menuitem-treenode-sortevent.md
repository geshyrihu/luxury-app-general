# Prompt Fase 7 — Último paso: reemplazar `MenuItem`/`TreeNode`/`SortEvent` por tipos locales

(sin lógica, sin componente), así que se pueden reemplazar por
interfaces locales sin cambiar nada del comportamiento. Con esto
`src/app/modules` (queda solo el import documental en
`conventions-viewer.service.ts`, que no cuenta, y `calendario-maestro-lista.ts`
que usa el tipo `Menu` del bug ya catalogado aparte — ambos fuera de
alcance de este prompt).

## 1. Crear los 3 archivos de tipos locales

`src/app/core/interfaces/menu-item.interface.ts`:
```ts
export interface MenuItem {
  label?: string;
  icon?: string;
  command?: (event: { originalEvent: Event; item: MenuItem }) => void;
  url?: string;
  items?: MenuItem[];
  expanded?: boolean;
  disabled?: boolean;
  visible?: boolean;
  routerLink?: unknown;
  separator?: boolean;
  badge?: string;
  styleClass?: string;
  id?: string;
  [key: string]: unknown;
}
```

`src/app/core/interfaces/tree-node.interface.ts`:
```ts
export interface TreeNode<T = unknown> {
  label?: string;
  data?: T;
  icon?: string;
  children?: TreeNode<T>[];
  leaf?: boolean;
  expanded?: boolean;
  type?: string;
  key?: string;
  styleClass?: string;
  selectable?: boolean;
}
```

`src/app/core/interfaces/sort-event.interface.ts`:
```ts
export interface SortEvent {
  data?: unknown[];
  mode?: string;
  field?: string;
  order?: number;
}
```

recortadas a los campos que de verdad se usan en los 7 consumidores —
`MenuItem` conserva `[key: string]: unknown` porque el original de
extra que no se listó aquí.)

## 2. Actualizar los 7 imports

```
src/app/modules/accounting.luxuryapp/fondeos-y-reporteo/funding/funding-detail.ts
```
```diff
+import { MenuItem } from "@core/interfaces/menu-item.interface";
+import { SortEvent } from "@core/interfaces/sort-event.interface";
```

```
src/app/modules/accounting.luxuryapp/general-ledger/dynamic-reports/account-tree-select/account-tree-select.ts
```
```diff
+import { TreeNode } from "@core/interfaces/tree-node.interface";
```

```
src/app/modules/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts
```
```diff
+import { MenuItem } from "@core/interfaces/menu-item.interface";
+import { TreeNode } from "@core/interfaces/tree-node.interface";
```

```
src/app/modules/operations.luxuryapp/properties/entrega-recepcion/entrega-recepcion-organigrama.ts
```
```diff
+import { TreeNode } from "@core/interfaces/tree-node.interface";
```

```
src/app/modules/recruitment.luxuryapp/recruitment-shell/recruitment-shell.ts
```
```diff
+import { MenuItem } from "@core/interfaces/menu-item.interface";
```

```
src/app/modules/supplier.luxuryapp/po/purchase-order/create-orden-compra-wizard/create-orden-compra-wizard.ts
```
```diff
+import { MenuItem } from "@core/interfaces/menu-item.interface";
```

## No tocar

`src/app/modules/maintenance.luxuryapp/planificacin-de-mantenimiento/maintenance-calendar-master/calendario-maestro-lista.ts`
— importa `MenuItem` de la misma fuente, pero este archivo tiene el
bug preexistente ya catalogado (`menu.toggle(event)` sobre un
`LxMenu` sin ese método) y **también importa el tipo `Menu`** de
solo el `MenuItem` sin resolver el bug de fondo dejaría el archivo a
medias. Se deja fuera de este prompt a propósito.

`src/app/modules/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-web-extras.ts`
documentado como excepción de tipos en `04-bitácora-cambios.md`. Si
quieres cerrarlo también de una vez, puedes migrar `MenuItem`/`TreeNode`
a los mismos tipos locales de este prompt, pero `MegaMenuItem` no
tiene equivalente definido aquí — verifica su uso real antes de
decidir si vale la pena definir un cuarto tipo local o dejarlo como
excepción de todos modos.

## Verificación

  debe dar solo los 2 archivos explícitamente excluidos
  (`calendario-maestro-lista.ts`, `catalog-web-extras.ts`).
- `npx tsc --noEmit`: 0 errores nuevos (los literales existentes de
  `MenuItem`/`TreeNode`/`SortEvent` en los 7 archivos deben seguir
  siendo válidos contra las interfaces locales — si alguno falla,
  revisa qué campo usa ese literal que no esté en la interfaz local y
  agrégalo, no elimines el campo del literal).
- `ng build` **redirigido a archivo completo (`> log 2>&1`), espera a
  que el proceso termine de verdad, revisa el log entero con
  `grep -c ERROR`, no uses `tail` ni reportes "inconcluso"**.
- No requiere capturas — son solo tipos, sin efecto en runtime ni en
  el render.

## Listo cuando

- Los 3 archivos de tipos creados en `src/app/core/interfaces/`.
- Los 7 imports redirigidos.
- `tsc`/build limpios, build confirmado terminado.
  src/app/modules --include="*.ts"` — debería quedar en 2 (los
  excluidos a propósito).
