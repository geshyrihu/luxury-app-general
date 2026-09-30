# 03 — Inventario de Componentes (registro vivo)

📅 Última actualización: 2026-09-13
🛡️ Regla: esta tabla se actualiza **en cada componente tocado**. No se marca
🟢 sin build verde + revisión visual (ver criterios en `02-plan-migracion.md` §7).
Leyenda de estado en `00-INDICE.md`.

Los conteos de "Usos" están medidos por `grep` sobre
`appsweb/angular/src/app/modules/**` el 2026-09-12 (import
`from "@ui/web/<nombre>"`). Si un componente se renombra, re-medir antes de
dar por buena la columna.

---

## Grupo 1 — Tabla y ecosistema directo (Fase 6, al final a propósito — ver `02-plan-migracion.md`)

|---|---|---:|---|---|---|



**Corrección metodológica 2026-09-16**: se descubrió que verificar `ng build` con `| tail -N` dentro del comando en segundo plano trunca el archivo de salida *guardado*, no solo la vista — varios builds "confirmados limpios" en rondas anteriores tenían errores reales fuera de esa ventana (6 archivos con `[rowHover]` residual, 2 con `[responsive]` residual, encontrados y corregidos). Desde entonces, todo build de verificación se redirige a archivo completo (`> log 2>&1`) y se revisa entero, no con `tail`.


**Pendiente de reconstruir por el mismo criterio** (antes aceptados como pérdida, ahora en revisión): `[reorderableColumns]` real (drag-and-drop de columnas, 7 archivos, hoy sin esa función) y `pFrozenColumn` real (columnas fijas al hacer scroll, 7 archivos ya migrados sin esa función).

**Corrección metodológica 2026-09-16**: se descubrió que verificar `ng build` con `| tail -N` dentro del comando en segundo plano trunca el archivo de salida *guardado*, no solo la vista — varios builds "confirmados limpios" en rondas anteriores pudieron tener errores reales fuera de esa ventana. Un barrido dirigido encontró 6 archivos más con `[rowHover]` residual sin detectar antes, ya corregidos. Confirmado con un build completo sin truncar: 1928 líneas, 0 errores. De aquí en adelante los builds de verificación se redirigen a archivo completo, no se truncan con tail. 4 archivos huérfanos eliminados del repo. Detalle completo en `04-bitacora-cambios.md`. Pendiente 🟢 total hasta terminar `reorderableColumns`/`pFrozenColumn` reales |
| `@ui/web/data-grid` (grid genérico de columnas dinámicas) | — | 3 (2 reales: `announcement-analytics.html`, `catalog-core-item.ts`; 1 solo metadata de catálogo) | ✅ **Reescrito 2026-09-16**: usa `AppTable` internamente, columnas dinámicas vía `@for`, botones `il-button`/`iw-button`. No replicó `virtualScroll`/`resizableColumns` (cero uso real en todo el repo) | Media | 🟢 **Cerrado 2026-09-16** |

### Actualización de reorder de filas — 2026-09-18

La implementación de `AppTable` queda documentada con el contrato real y no
solo con la existencia de los bindings:

- 10 consumidores declaran `[reorderableRows]="true"` y usan
  `[pReorderableRow]`/`pReorderableRowHandle`.
- `pReorderableRowHandle` aplica `draggable="true"` al propio elemento handle.
  La fila no es draggable; recibe el `dragstart` por burbujeo y conserva
  `dragover`, `drop` y `dragend`.
- Se corrigió el bug que cancelaba todos los arrastres: el target del
  `dragstart` nativo era la fila, mientras la validación exigía el handle.
- `task-list` persiste el orden con `onRowReorder`, usando `dragIndex` y
  `dropIndex`, y mantiene separado el drag de dependencias mediante MIME
  `application/task-link`.
- `funding-detail`, `sat-funding` y los demás consumidores fueron ajustados a
  imports standalone, gate y handlers compatibles con `AppTable`.
- Validación: TypeScript, build production y `audit:ui` pasan. Reorder probado
  en navegador en Listado de Tickets.

Ver `05-tablas-y-modales.md` §A.6 y `04-bitacora-cambios.md` para detalle de
causa, archivos y verificaciones.

### Actualización de columnas y `colgroup` — 2026-09-18

- `AppTable` ahora soporta `#colgroup` y lo renderiza antes de `<thead>`.
- Se auditaron 7 plantillas con `#colgroup` y 21 usos de clases
  `table-col-Nrem` en celdas.
- Las variantes rem y px de `table-col-*` funcionan ahora en `<col>`, `<th>` y
  `<td>`; se conservan las variantes porcentuales existentes.
  (`.p-datatable-*`) y usa `.app-table-*`.
- El select de unidad en `orden-compra-detalle-add-producto` conserva ancho
  fijo `w-9rem` para evitar cálculo circular de `width: 100%` dentro de `<td>`.

## Grupo 2 — Botones (Fase 1, quick win) — ✅ CERRADA 2026-09-13

| Elemento | Ubicación | Usos medidos | Resultado | Complejidad | Estado |
|---|---|---:|---|---|---|
| Sistema `.btn*` | `src/styles/web/_buttons.scss` | (transversal, 1,376 imports de `@ui/buttons/*`) | ✅ Ya usaba nomenclatura Bootstrap. Se encontró y corrigió una fuga real: `.btn` no declaraba `font-size` propio, Bootstrap sí (1rem/16px) — se colaba pese a la capa, medido en vivo 14px→16px. Fijado explícito a `var(--ds-font-size-label, 0.875rem)`. Ver detalle y nota metodológica en `02-plan-migracion.md` Fase 1 | Baja | 🟢 |
| `buttons/web-label/*` (23 componentes: add, edit, delete, save, confirm, download, send-email, tracking, view-pdf, active-desactive, item, button base…) | `shared/ui/buttons/web-label/` | incluido arriba | ✅ Confirmado en código: 0 uso de `p-button`/`pButton` en todos los componentes | Baja | 🟢 |
| `button-group` | `shared/ui/buttons/button-group/` | — | `.btn-group` de Bootstrap (clase ya definida en DS), sin cambios necesarios | Baja | 🟢 |

## Grupo 3 — Formularios / inputs (Fase 5, coordinar con rollout adaptativo — camino B ya decidido)

| Tipo de input | Ubicación web | Usos (`@ui/inputs/*` total) | Reemplazo propuesto | Estado rollout adaptativo | Estado migración Bootstrap |
|---|---|---:|---|---|---|
| text | `inputs/web/input-text` | (986 total, no desglosado por tipo aún) | `<input class="form-control">` | ✅ adaptativo | 🟢 **Cerrado 2026-09-14**, verificado en código (`tsc`/`ng build` limpios ×5, sin verificación visual en vivo — el usuario declinó, ver `04-bitacora-cambios.md`) |
| number | `inputs/web/input-number` | — | `<input type="number" class="form-control">` | ✅ adaptativo | 🟢 **Cerrado 2026-09-14** |
| textarea | `inputs/web/input-textarea` | — | `<textarea class="form-control">` | ✅ adaptativo | 🟢 **Cerrado 2026-09-14** |
| checkbox | `inputs/web/input-check` | — | `<input class="form-check-input">` | ✅ adaptativo | 🟢 **Cerrado 2026-09-14** |
| date | `inputs/web/input-date` (texto simple, no picker) | — | `<input type="text" class="form-control">` | ✅ adaptativo | 🟢 **Cerrado 2026-09-14** |
| autocomplete | `inputs/web/custom-input-autocomplete-signal.ts` (46 consumidores reales), `custom-input-autocomplete-multiple-signal.ts` (1 consumidor) | — | `@ng-select` modo autocomplete, `[addTag]` según `forceSelection()` | ⏳ pendiente | 🟢 **Cerrado 2026-09-14 por completo**, incluyendo `panelStyleClass`/`panelStyle`/`scrollHeight`. Investigado el código fuente real de `@ng-select` v23.2.0 (no solo los `.d.ts`): `appendTo` reubica el mismo nodo del panel a `<body>` vía `appendChild` sin ofrecer ningún input para clases/estilos del panel portado — no existe tal mecanismo en esta versión, no hacía falta seguir buscándolo. Resuelto con `(open)`/`(close)` en `<ng-select>` aplicando clase/estilo/`scrollHeight` a mano sobre `.ng-dropdown-panel` (único en el documento a la vez, confirmado en vivo), diferido a `setTimeout` para esperar a que `appendChild` termine |
| file | `inputs/web/input-file` | — | `<input type="file" class="form-control">` | ✅ adaptativo | 🟢 **Cerrado 2026-09-14** |
| currency | `inputs/web/input-currency` | — | `<input class="form-control">` + máscara propia | ⏳ pendiente | 🟢 **Cerrado 2026-09-14** |
| decimal | `inputs/web/custom-input-decimal-signal.ts` (archivo suelto, **distinto de `currency`/`number`**, no estaba en este inventario) | — | `<input type="number" class="form-control">` con `step` decimal | — | 🟢 **Cerrado 2026-09-14** |
| password | `inputs/web/input-password` | — | `<input type="password" class="form-control">` + toggle propio | ⏳ pendiente | 🟢 **Cerrado 2026-09-14** |
| multiselect | `inputs/web/input-multiselect` | — | `@ng-select` modo multiple | ⏳ pendiente | 🟢 **Cerrado 2026-09-14**: preserva agrupación (`groupBy`), resumen de seleccionados (`ng-multi-label-tmp`), y el único consumidor real con `panelStyle`/`scrollHeight` personalizados (`presupuesto-propuesta.html`) vía variables CSS heredadas al panel |
| select-bool | `inputs/web/input-select-bool` | — | `.form-check.form-switch` o `@ng-select` con 2 opciones | ⏳ pendiente | 🟢 **Cerrado 2026-09-14** |
| time | `inputs/web/input-time` | — | `<input type="time">` o texto | ⏳ pendiente | 🟢 **Cerrado 2026-09-14** |
| hour | `inputs/web/custom-input-hour-signal.ts` (archivo suelto, **distinto de `time`**, no estaba en este inventario) | — | `<input type="time" class="form-control">` | — | 🟢 **Cerrado 2026-09-14** (incluyó fix de `NG8002: Can't bind to 'pSize'`, un binding roto que dejó de compilar en producción — no lo detecta `tsc`, solo el compilador de plantillas de Angular) |
| search | `inputs/web/input-search` | — | `.input-group` con ícono | ⏳ pendiente | 🟢 **Cerrado 2026-09-14** |
| toggle-switch | `inputs/web/input-toggle-switch` | — | `.form-check.form-switch` de Bootstrap | ⏳ pendiente | 🟢 **Cerrado 2026-09-14** |
| mask, url, email, month | `inputs/web/custom-input-mask-signal.ts`, `custom-input-url-signal.ts`, `custom-input-email-signal.ts`, `custom-input-month-signal.ts` (archivos sueltos) | — | `<input class="form-control">` + máscara/validación propia | ⏳ pendiente | 🟢 **Cerrados 2026-09-14**, los 4 |
| phone-prefix | `inputs/web/custom-input-phone-prefix.ts` (archivo suelto) | — | `@ng-select` (2 consumidores reales) | ⏳ pendiente | 🟢 **Cerrado 2026-09-14** |
| select-prefix | `inputs/web/custom-input-select-prefix-signal.ts` (archivo suelto, no estaba en este inventario) | — | `.input-group` de Bootstrap | — | 🔴 **Pendiente real, nunca documentado antes**, `InputGroupModule` activo |
| ng-select (adaptador legado) | `inputs/web/custom-input-ng-select-signal.ts` (archivo suelto) | — | ❌ **Candidato a retirar, no a migrar**: es un adaptador que imita props de `ng-select` pero renderiza `<p-select>` por dentro — con `input-select` ya usando `@ng-select` de verdad desde hoy, este archivo es redundante. Decisión pendiente con el usuario: ¿tiene consumidores reales que valga la pena redirigir a `input-select` directo, o se borra? | — | 🔴 **Pendiente de decisión** (no es un simple swap) |

## Grupo 4 — Feedback y overlays

|---|---|---:|---|---|---|---|

## Grupo 5 — Navegación y estructura

|---|---|---:|---|---|---|
| `p-selectbutton` | — (no existía) | 0 — ✅ **Creado y migrado 2026-09-13**: `base/select-button.base.ts` (`SelectButtonBase`, API simplificada sin `optionLabel`/`optionValue`, asume `{label,value,disabled?}`) + `web/select-button/select-button.ts` (`AppSelectButton`, radios ocultos `.btn-check`+`.btn-group`). Los 2 consumidores reales (`recruitment-agenda-list.html`, shell `header-employee-monitor.html`) migrados de `[ngModel]`/`(ngModelChange)` a `[value]`/`(valueChange)` | `.btn-group` con radios ocultos (patrón Bootstrap "toolbar de checkbox/radio") | Media | 🟢 |
| `p-button` directo (tag) / `pButton` (directiva) | — (sin wrapper, fuga cruda) | 5 archivos originales | Migrar a `il-button`/`web-label` (sistema de botones de Fase 1) | Baja | 🟢 **Cerrado 2026-09-14**: los 5 archivos migrados a `il-button`/`iw-button`, verificado en código (0 `<p-button>`/`pButton` activos fuera de un comentario muerto en `header-employee-desktop.html:456-462`) |
| `pTooltip` | — | 1 uso, `committee-cobranza-web.html:150` | Migrar a `lxTooltip` (ya adoptado en el resto de la app) | Baja | 🟢 **Cerrado 2026-09-14**, verificado en código |
| `pInputTextarea` | — | 1 uso, `header-employee-monitor.html:169` | Migrar a `<textarea class="form-control">` | Baja | 🟢 **Cerrado 2026-09-14**, verificado en código |
| `p-scrollpanel` | — | 2 usos, `notifications-list-web.html:38`, `notifications-gadget.html:30` | Contenedor propio con `overflow-y:auto` | Baja | 🟢 **Cerrado 2026-09-14**, verificado en código |
| `p-drawer` | — | 1 uso, `notifications-gadget.html:21` | CDK Overlay o `.offcanvas` de Bootstrap | Media | 🟢 **Cerrado 2026-09-14**: migrado a `.offcanvas` nativo de Bootstrap, verificado en código |
| `p-panel` | — | 1 uso directo, `recurring-task-catalog-form.html:62` | `.accordion`/`.card` de Bootstrap | Baja | 🟢 **Cerrado 2026-09-14** para esa fuga puntual — construido con collapse Bootstrap sin usar el componente genérico (ver hallazgo abajo) |
| `p-timeline` | — | 1 uso directo, `vacancy-candidates-timeline-modal.html:36` | Construir timeline propio | Media | 🟢 **Cerrado 2026-09-14** para esa fuga puntual — construido con CSS propio sin usar el componente genérico (ver hallazgo abajo) |
| `app-panel`/`app-timeline`/`app-sidebar` (componentes genéricos reutilizables, distintos de las fugas puntuales de arriba) | `shared/ui/web/panel/panel.ts` (`AppPanel`), `shared/ui/web/timeline/timeline.ts` (`Timeline`), `shared/ui/web/sidebar/sidebar.ts` (`Sidebar`, envuelve `p-drawer` — **no es la barra de navegación principal**, es un componente de drawer/panel lateral genérico, mismo nombre de clase/selector por coincidencia) | `app-panel`: 2 consumidores reales vía `lx-panel`; `app-sidebar`(drawer): **6 consumidores reales** vía `lx-sidebar`; `app-timeline`: 0 consumidores reales vía `lx-timeline` (el único caso real usa la versión bespoke de arriba, no este componente) | `PanelModule`→collapse Bootstrap; `DrawerModule`→`.offcanvas`; `TimelineModule`→CSS propio (ya tiene buena base: templates de marker/content parametrizables) | — | ❌ **Hallazgo nuevo 2026-09-14, nunca documentado**: existen como wrappers genéricos con arquitectura `*Base` (mismo patrón que `badge`/`avatar`/`tag`) pero nadie los migró — no se encontraron en la búsqueda de "precedente existente" de la sesión de hoy (mismo punto ciego que `mapped-p-tag.ts`). No se buscó su reconciliación con las 2 fugas puntuales ya cerradas arriba (bajo riesgo, no bloqueante) — 🔴 pendiente real, prioridad por consumidores reales: `sidebar`(6) > `panel`(2) > `timeline`(0, baja prioridad) |

## Grupo 6 — Estilos y tokens (transversal, no es un "componente")

| Ítem | Ubicación | Acción | Estado |
|---|---|---|---|
| Mapeo de tokens DS → Bootstrap | `src/styles/web/_bootstrap-tokens.scss` | ✅ Creado 2026-09-13. Valores hex literales (no `var(--ds-*)`, ver nota técnica en el propio archivo: Bootstrap usa funciones de color de Sass que no operan sobre `var()`) | 🟢 |
| Entry point Bootstrap | `src/styles/web/_bootstrap-entry.scss` | ✅ Creado y enganchado en `ds-entry.scss` 2026-09-13. Importa el bundle oficial completo (con reboot) dentro de `@layer bootstrap` — ver corrección de diseño en `04-bitacora-cambios.md` (excluir reboot a mano rompía `_type.scss`) | 🟢 |
| `core/_variables.scss` | `src/styles/core/_variables.scss` | ⚠️ **Corregido 2026-09-13: NO es huérfano de import** — `theme/_variables.scss:14` lo usa (`@use … as v;`) pero nunca referencia el namespace `v.`. Huérfano "de facto" (0 CSS de salida), no de import. Borrarlo requiere antes quitar esa línea de `theme/_variables.scss`. No se tocó, queda pendiente, no bloquea la migración. | 🔴 |
| `estandar-hoja-estilos.md` | `src/styles/estandar-hoja-estilos.md` | ✅ Corregido 2026-09-13 (estructura `components/`/`prime-overrides/` actualizada a `web/`, huérfanos corregidos, sección Bootstrap añadida) | 🟢 |
| Los 9 archivos `web/_prime-*.scss` | `src/styles/web/` | Retirar en Fase 7 cuando el componente asociado esté 🟢 — **excepción: `_prime-table.scss` no se retira en Fase 7, se renombra en el sitio como parte de construir `app-table` (Fase 6), ver fila siguiente** | 🔴 |
| `package.json`: `bootstrap` | `appsweb/angular/package.json` | ✅ Instalado 2026-09-13, versión exacta `5.3.8` (`--save-exact`). Requirió `--legacy-peer-deps` por un conflicto preexistente y no relacionado (vitest/@analogjs/storybook) — no es un problema de Bootstrap | 🟢 |
| `package.json`: `marked-katex-extension` | `appsweb/angular/package.json` | ✅ Instalado 2026-09-13 — **fix ajeno a esta migración**, hecho solo para destrabar la verificación visual (dependencia opcional faltante de `ngx-markdown` que el dev-server de Vite no toleraba, ver `04-bitacora-cambios.md`) | ⚪ Fuera de alcance de la migración |

## Grupo 7 — Fuera de alcance (confirmar y no tocar)

| Ítem | Motivo |
|---|---|
| `shared/ui/mobile/**` (94 carpetas, Ionic) | Migración es solo de escritorio |
| `shared/ui/adaptive/**` (90 carpetas) | Cambia de implementación por dentro, no de API pública |
| `@ionic/angular` | Sin relación, capa móvil |

---

## Cómo actualizar este archivo

1. Al iniciar un componente: cambiar su fila a 🟡 y anotar quién lo toma.
2. Al terminarlo: verificar criterios de aceptación transversales
   (`02-plan-migracion.md` §7), cambiar a 🟢, y añadir entrada en
   `04-bitacora-cambios.md`.
3. Si un componente se descubre más complejo de lo listado aquí (ej. tiene
   más consumidores de los medidos, o su API pública no se puede mantener),
   **no seguir migrando en silencio**: anotar la excepción en la columna
   "Estado" con una nota y decidir con el equipo antes de continuar.
