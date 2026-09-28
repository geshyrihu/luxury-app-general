# Prompt Fase 8 — Paso 1: borrar 94 componentes de `shared/ui` con 0 consumidores reales

Se decidió retirar PrimeNG por completo del repo, incluida la
librería compartida `src/app/shared/ui/**` (135 archivos con imports
directos de `primeng/*` en total). Investigación exhaustiva
(2026-09-16) clasificó 94 de esos archivos como **completamente
muertos**: 0 consumidores reales en todo `src/app` fuera de (a) sus
propios `.spec.ts`, (b) el catálogo interno de componentes
(`herramientas-dev/catalog-component-ui/**`, que "usa" casi todo como
demo pero no es una feature real), y (c) la capa `adaptive/<nombre>`
que solo se importa a sí misma dentro de la misma cadena muerta.

Verificado con muestreo propio antes de escribir esto (ej.
`web/dock/dock.ts`: solo 2 "usos" — el catálogo y
`adaptive/dock/dock.ts`, que a su vez no tiene ningún consumidor real
tampoco — cadena 100% muerta de punta a punta).

## Regla de verificación (aplícala a CADA componente antes de borrar)

```bash
grep -rl "@ui/web/<nombre>/\|@ui/adaptive/<nombre>/\|@ui/mobile/<nombre>/" src/app --include="*.ts" --include="*.html" | grep -v spec
```
Si el resultado son SOLO archivos dentro de
`herramientas-dev/catalog-component-ui/**` y/o dentro de la propia
carpeta `shared/ui/{adaptive,web,mobile}/<nombre>/` — está confirmado
muerto, borra la cadena completa (`web/<nombre>/`,
`adaptive/<nombre>/`, `mobile/<nombre>/` si existen, y el `.base.ts`
asociado en `shared/ui/base/` si existe). **Si encuentras cualquier
otro archivo real fuera de esas excepciones, detente y no borres ese
componente — repórtalo aparte.**

## Lista de 82 componentes a verificar y borrar (carpeta completa: `web/<nombre>/`, `adaptive/<nombre>/`, `mobile/<nombre>/` si existen)

**Barriles `primeng-*` (35, solo `web/primeng-<x>/`, sin adaptive/mobile)**:
```
accordion autocomplete avatar badge button carousel checkbox chip
datepicker dialog divider floatlabel iconfield inputgroup
inputgroupaddon inputicon inputnumber inputtext menu message
multiselect popover progressspinner radiobutton ripple select
selectbutton skeleton splitbutton tabs tag toast toggleswitch toolbar
api
```
(el prefijo real de la carpeta es `primeng-<nombre>`, ej.
`web/primeng-accordion/`, `web/primeng-api/` — no confundir con los
componentes Bootstrap reales que tienen el mismo nombre sin el
prefijo, ej. `web/accordion/` SÍ tiene consumidores reales, no lo
toques)

**Overlays/navegación (7, con `base/*.base.ts` asociado en dock/context-menu/mega-menu)**:
```
dock context-menu mega-menu command-palette confirm-popup panel-menu
notification-center
```

**Data-display/colecciones (9 — nota: `tree` NO está en esta lista, sí tiene 1 consumidor real, no lo toques)**:
```
data-view order-list pick-list org-chart tree-select tree-table
virtual-scroller kanban-board pipeline-crm
```

**Inputs/forms (14)**:
```
cascade-select color-picker date-range iconfield inplace input-group
inputicon knob lang-selector meter-group otp-input slider tag-input
style-class
```

**Feedback/overlays de contenido (11)**:
```
block-ui bottom-nav comment-thread contact-card global-error-alert
email-preview error-boundary profile-card print-view whats-new
session-timeout
```

**Media/captura (8)**:
```
barcode-input barcode-scanner qr-code receipt-scanner signature-pad
gallery rich-text-editor animate-on-scroll
```

**Layout/misc (7)**:
```
fluid form-builder split-pane skeleton-presets terminal theme-switcher
wizard
```

## Cadena de inputs doblemente muerta (4 archivos, verificar aparte)

```
src/app/shared/ui/inputs/web/custom-input-ng-select-signal.ts
src/app/shared/ui/inputs/web/input-ng-select/input-ng-select.ts
src/app/shared/ui/inputs/web/custom-input-select-prefix-signal.ts
src/app/shared/ui/inputs/web/input-select-prefix/input-select-prefix.ts
```
`custom-input-ng-select-signal.ts` envuelve `primeng/select` (pese al
nombre, no usa `@ng-select/ng-select` real); su único "consumidor" es
`input-ng-select.ts`, que a su vez no tiene ningún consumidor real
fuera del catálogo. Mismo patrón para el par
`custom-input-select-prefix-signal.ts`/`input-select-prefix.ts`
(envuelve `primeng/inputgroup`+`inputgroupaddon`+`inputtext`+`select`).
Verifica ambas cadenas con el mismo grep de arriba antes de borrar. Si
en el futuro se necesita un select con prefijo, ya existe
`inputs/web/input-select/input-select.ts` (`WebInputSelect`, con
`@ng-select/ng-select` real y consumidores activos) como base — no se
reconstruye en este prompt, solo se borra lo muerto.

## No tocar (fuera de este prompt, tienen consumidores reales o son decisión aparte)

- `web/tree/tree.ts` — 1 consumidor real vía `adaptive/tree` →
  `account-tree-select.ts`. Es Categoría C (reescribir), no A.
- `core/pages-extras/comingsoon/comingsoon.ts` — 0 consumidores y no
  ruteado, pero es un caso de decisión aparte (¿el equipo lo quiere
  conservar como plantilla "próximamente"?), no lo borres en este
  prompt.
- `web/primeng-custom-caption`, `web/primeng-custom-global-filter`,
  `web/primeng-custom-table-emptymessage`,
  `web/primeng-custom-table-footer`, `web/primeng-dynamicdialog` — NO
  importan PrimeNG directo, ya están limpios, no forman parte de esta
  lista aunque el nombre empiece igual.
- `web/primeng-table` — tiene 1 consumidor real
  (`warehouse-stock-add.ts`) + 2 en `core/` (tipo
  `TableLazyLoadEvent`), se resuelve en un prompt aparte junto con esos
  3 archivos.
- Todos los componentes de la Categoría C listados en la bitácora
  (`action-menu`, `image`, `file-upload`, `dialog`, `confirm-dialog`,
  `fieldset`, `multi-select`, `listbox`, `rating`, `editor`,
  `empty-state`, `steps`, `timeline`, tooltip, rango-calendario/
  mesanio/touchspin, `paginator`, `menubar`, `tap-to-top`,
  `breadcrumbs`, `image-analysis-dialog`, `custom-input-upload-pdf-signal`)
  — tienen consumidores reales, se migran en prompts separados, NO
  se borran.

## Verificación

- Antes de cada borrado, el grep de la regla de arriba debe confirmar
  0 consumidores reales — si alguno da un resultado inesperado,
  detente y repórtalo en vez de borrar.
- `npx tsc --noEmit`: 0 errores nuevos.
- `ng build` **redirigido a archivo completo (`> log 2>&1`), espera a
  que el proceso termine de verdad, revisa el log entero con
  `grep -c ERROR`, no reportes "inconcluso"**.
- No requiere capturas — son componentes sin ningún uso real, no
  deberían afectar ninguna pantalla.

## Listo cuando

- Los ~86 componentes (82 de la lista + 4 de la cadena de inputs)
  verificados y borrados (carpeta completa: web + adaptive + mobile +
  base si existen).
- `tsc`/build limpios.
- Reporta el conteo de archivos con `from "primeng/` que quedan en
  `src/app/shared` tras este borrado (debería bajar de 125 a ~30-35,
  correspondiendo a los componentes de Categoría C que faltan
  reescribir).
