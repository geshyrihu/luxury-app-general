# Auditoria PrimeNG 22 + Abstraccion en `features/`

> Fecha: 2026-07-06
> Alcance: `client/angular/src/app/features/`
> Base: `src/app/features/INVENTARIO-PRIMENG.md`

## Objetivo

Convertir el inventario de uso directo de PrimeNG en una ruta de limpieza compatible con la regla actual del proyecto:

- En `features/` solo se permite uso directo de `p-table`.
- El resto de componentes PrimeNG debe consumirse desde `src/app/shared/`.
- Si no existe wrapper valido en `shared`, primero se crea ahi y luego se migra `features/`.
- Las excepciones documentadas en `AGENTS.md` se respetan.

## Regla operativa

### Permitido directo en `features/`

- `p-table`

### Permitido como excepcion documentada

- `p-splitbutton`
- `p-selectbutton`
- `p-checkbox` inline dentro de tablas
- `p-fileupload`
- `p-select` en toolbars/filtros
- `p-button` con `outerLink` o en drawers/chat
- `p-drawer`
- `p-inputnumber` inline dentro de tablas

### Migracion parcial de `p-tag`

- Migrar a `app-status-badge` o `lx-status-badge` solo cuando represente `EStatus` de entidad.
- No migrar tags de metadatos de documento, estados transitorios de wizard, clasificaciones ni labels de dominio como `Activo/Inactivo` o `fineStatusLabel`.

## Mapa de wrappers existentes

| PrimeNG en `features` | Wrapper/componente en `shared` | Estado | Nota |
|---|---|---|---|
| `p-table` | `primeng-custom-caption`, `primeng-custom-global-filter`, `primeng-custom-table-emptymessage`, `primeng-custom-table-footer`, `app-action-menu`, `app-data-view-mobile` | Permitido | Se mantiene directo, pero con helpers/shared alrededor. |
| `p-tag` | `app-status-badge`, `lx-status-badge` | Parcial | Solo para `EStatus` de entidad. |
| `p-card` | `app-stat-card`, `app-kpi-card`, `app-profile-card`, `app-contact-card` | Parcial | No existe wrapper generico `app-card`. |
| `p-avatar` | `app-avatar-group` | Parcial | No existe wrapper generico para avatar individual. |
| `p-message` | ninguno generico | Gap | Conviene crear `app-inline-message` o similar. |
| `p-image` | ninguno generico | Gap | `custom-input-img-signal` sirve para input, no para display general. |
| `p-progressspinner` | `app-loader` | Parcial | Cubre loading generico, no reemplaza todos los usos inline web. |
| `p-skeleton` | `app-skeleton-presets` | Parcial | Hay wrapper, pero no un API generica para todos los esqueletos. |
| `p-dialog` | `app-confirm-dialog` y dialogos especializados | Parcial | Para formularios/modales conviene usar `DialogHandlerService`; no hay wrapper generico unico. |
| `p-divider` | ninguno generico | Gap | Hoy hay usos directos y algunos componentes especializados. |
| `p-tabs` | ninguno generico | Gap | No hay wrapper transversal. |
| `p-select` | `custom-input-select-signal` | Listo | Para formularios. En toolbar/filtros aplica excepcion. |
| `p-multiselect` | `custom-input-multiselect-signal` | Listo | Para formularios. |
| `p-fieldset` | ninguno generico | Gap | No hay wrapper transversal. |
| `p-fileupload` | `app-file-upload` existe | Excepcion | `AGENTS.md` lo trata como excepcion; no hacer barrido masivo. |
| `p-drawer` | ninguno | Excepcion | Mantener como excepcion documentada. |
| `p-checkbox` | `custom-input-check-signal` | Parcial | Migrar formularios; checkbox inline en tabla queda como excepcion. |
| `p-confirmdialog` | `app-confirm-dialog` | Listo | Sustituible en muchos casos de confirmacion simple. |
| `p-listbox` | ninguno generico | Gap | No hay wrapper transversal. |
| `p-progressbar` | ninguno generico | Gap | `app-file-upload` lo usa internamente, pero no expone wrapper reusable general. |
| `p-autocomplete` | `custom-input-autocomplete-signal`, `custom-input-autocomplete-multiple-signal` | Listo | Para formularios. |
| `p-badge` | ninguno generico | Gap | No existe abstraction base. |
| `p-datepicker` | `custom-input-datepicker-signal` | Listo | Para formularios. |
| `p-editor` | `app-rich-text-editor` | Listo | Candidato directo de migracion. |
| `p-inputnumber` | `custom-input-number-signal` | Parcial | Formularios si; inline en tabla es excepcion. |
| `p-popover` | `app-action-menu` | Parcial | Muy claro para menus de acciones; no para cualquier popover libre. |
| `p-rating` | `app-rating`, `lx-rating`, `ili-rating` | Listo | Ya existe abstraction. |
| `p-toast` | `primeng-custom-toast` | Listo | Migrable. |
| `p-toolbar` | ninguno generico | Gap | No existe wrapper transversal. |
| `p-password` | `custom-input-password-signal` | Listo | Migrable. |
| `p-inputtext` | `custom-input-text-signal` | Listo | Migrable. |
| `p-textarea` | `custom-input-textarea-signal` | Listo | Migrable. |
| `p-toggleswitch` | `custom-input-toggle-switch-signal` | Listo | Migrable. |
| `p-selectbutton` | `custom-input-select-button-signal` existe | Excepcion | `AGENTS.md` lo deja como excepcion. |
| `p-tree` / `p-treetable` | `app-tree-table` | Parcial | Cubre tree-table; no reemplaza cualquier `p-tree`. |

## Prioridad recomendada

### Ola 1: alto volumen y wrapper ya existente

Estas migraciones reducen rapido uso directo sin crear componentes nuevos:

- `p-select` -> `custom-input-select-signal`
- `p-multiselect` -> `custom-input-multiselect-signal`
- `p-autocomplete` -> `custom-input-autocomplete-signal`
- `p-datepicker` -> `custom-input-datepicker-signal`
- `p-password` -> `custom-input-password-signal`
- `p-inputtext` -> `custom-input-text-signal`
- `p-textarea` -> `custom-input-textarea-signal`
- `p-checkbox` en formularios -> `custom-input-check-signal`
- `p-inputnumber` en formularios -> `custom-input-number-signal`
- `p-toggleswitch` -> `custom-input-toggle-switch-signal`
- `p-editor` -> `app-rich-text-editor`
- `p-confirmdialog` -> `app-confirm-dialog`
- `p-toast` -> `primeng-custom-toast`
- `p-rating` -> `app-rating`

### Ola 2: alto impacto, pero requiere criterio de dominio

- `p-tag` -> migrar solo los casos de `EStatus` hacia `app-status-badge`
- `p-dialog` -> revisar si cada uso debe ir a `DialogHandlerService`, `app-confirm-dialog` o un wrapper nuevo
- `p-progressspinner` -> unificar a `app-loader` donde aplique
- `p-skeleton` -> estandarizar con `app-skeleton-presets`
- `p-popover` de acciones -> `app-action-menu`

### Ola 3: gaps reales de libreria compartida

Estos componentes todavia no tienen abstraction transversal suficiente:

- `p-message`
- `p-card`
- `p-avatar`
- `p-image`
- `p-divider`
- `p-tabs`
- `p-fieldset`
- `p-listbox`
- `p-progressbar`
- `p-badge`
- `p-toolbar`

Para estos, la secuencia correcta es:

1. Definir el caso de uso comun.
2. Crear wrapper en `shared/ui`.
3. Migrar consumidores en `features/`.

## Decisiones puntuales por componente

### `p-message`

Es de los gaps mas importantes porque aparece mucho y suele mezclarse con estados, avisos, validaciones y vacios. No conviene migrarlo uno a uno sin antes decidir una API compartida.

Recomendacion:

- Crear `app-inline-message` con variantes `info`, `warn`, `error`, `success`.
- Reusar `app-empty-state` cuando el mensaje realmente representa vacio de datos.

### `p-card`

No hay `app-card` generico. Hay varios cards semanticos (`app-stat-card`, `app-kpi-card`, `app-profile-card`, `app-contact-card`), pero no cubren todos los contenedores visuales actuales.

Recomendacion:

- No sustituir `p-card` por componentes semanticos incorrectos.
- Crear `app-card-shell` si se detecta un patron comun real.

### `p-avatar`

Solo existe `app-avatar-group`; no hay wrapper de avatar individual. Muchos usos en listas y cabeceras seguiran bloqueados hasta crear algo como `app-avatar`.

### `p-dialog`

No todos los `p-dialog` deben terminar en un mismo wrapper. En este repo ya existe una abstraccion de apertura de formularios/dialogos via servicio.

Recomendacion:

- Confirmaciones simples -> `app-confirm-dialog`
- Formularios/dialogos de flujo -> `DialogHandlerService`
- Dialogos visuales especializados -> wrapper dedicado en `shared`

### `p-fileupload`

Aunque existe `app-file-upload`, `AGENTS.md` marca `p-fileupload` como excepcion. Eso sugiere que hoy no debe forzarse una sustitucion masiva. Se puede evaluar despues como iniciativa separada.

## Ruta practica de ejecucion

1. Congelar nuevos imports de PrimeNG en `features/`, salvo `p-table` y excepciones documentadas.
2. Atacar primero los componentes con wrapper ya listo.
3. Convertir `INVENTARIO-PRIMENG.md` en backlog por olas, no solo por conteo.
4. Crear wrappers faltantes solo para patrones repetidos y estables.
5. Mantener `p-table` directo, pero con reglas de botones, caption, filtros y empty states desde `shared`.

## Wrappers clave ubicados

- `src/app/shared/ui/web/status-badge/status-badge.ts`
- `src/app/shared/ui/adaptive/status-badge/status-badge.ts`
- `src/app/shared/ui/web/rich-text-editor/rich-text-editor.ts`
- `src/app/shared/ui/web/confirm-dialog/confirm-dialog.ts`
- `src/app/shared/ui/web/primeng-custom-toast/primeng-custom-toast.ts`
- `src/app/shared/ui/web/action-menu/action-menu.ts`
- `src/app/shared/ui/mobile/action-menu-mobile/action-menu-mobile.ts`
- `src/app/shared/ui/mobile/data-view-mobile/data-view-mobile.ts`
- `src/app/shared/ui/web/skeleton-presets/skeleton-presets.ts`
- `src/app/shared/ui/web/rating/rating.ts`
- `src/app/shared/ui/inputs/web-inputs/custom-input-select-signal.ts`
- `src/app/shared/ui/inputs/web-inputs/custom-input-multiselect-signal.ts`
- `src/app/shared/ui/inputs/web-inputs/custom-input-autocomplete-signal.ts`
- `src/app/shared/ui/inputs/web-inputs/custom-input-datepicker-signal.ts`
- `src/app/shared/ui/inputs/web-inputs/custom-input-password-signal.ts`
- `src/app/shared/ui/inputs/web-inputs/custom-input-number-signal.ts`
- `src/app/shared/ui/inputs/web-inputs/custom-input-text-signal.ts`
- `src/app/shared/ui/inputs/web-inputs/custom-input-textarea-signal.ts`
- `src/app/shared/ui/inputs/web-inputs/custom-input-toggle-switch-signal.ts`

## Conclusion

La migracion a PrimeNG 22 y la limpieza de abstracciones no deben correrse como dos esfuerzos separados. Ya que el proyecto quiere prohibir PrimeNG directo en `features/`, la mejor inversion ahora es:

- migrar primero lo que ya tiene wrapper;
- respetar excepciones reales del repo;
- y crear wrappers nuevos solo para gaps repetidos de alto volumen.

El mayor retorno inmediato esta en inputs/formularios, `toast`, `confirm`, `rating`, `editor` y en convertir casos de `p-tag` de estado real a `app-status-badge`.
