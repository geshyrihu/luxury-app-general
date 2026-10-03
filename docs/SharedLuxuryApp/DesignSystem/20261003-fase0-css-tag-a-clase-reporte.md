Ruta: 📂 docs > 🤝 SharedLuxuryApp > 🎨 DesignSystem

> 📅 Fecha: 2026-10-03
> 🛡️ Estado: **FASE 0 EJECUTADA Y VERIFICADA.** Código modificado (no solo
> propuesta). 3 commits atómicos en `appsweb/angular`.
> 📚 Basado en: `20261002-plan-maestro-secuencia-catalogo-lux.md` §3 (Fase 0) +
> `20261002-verificacion-catalogo-marca-lux.md` §7.2/§7.3 (auditoría origen).
> 👤 Autor: agente IA (ejecutor de `prompts/ejecucion-fase0-css-tag-a-clase.md`)

# Fase 0 — Reporte de ejecución: CSS por tag → clase + breakpoints

> Regla de oro cumplida: **cada cambio es visualmente idéntico**. No se renombró
> ningún `selector:` de `@Component`; solo se agregaron clases fijas al `host` y se
> cambiaron los selectores CSS de nombre-de-tag a esa clase. Verificado en vivo
> (ver §4).

---

## 0. Resumen de commits (repositorio `appsweb/angular`, rama `main`)

| # | Commit | Alcance |
|---|---|---|
| 1 | `de7db55e2` `refactor(ui): migrar CSS por nombre de tag a clases de host (grupo A)` | Grupos A (globales + hosts) |
| 2 | `ca7457cd1` `refactor(ui): migrar estilos embebidos de tag a clase (grupo B)` | Grupos B (componentes shared/ui) |
| 3 | `7c853d068` `refactor(ui): migrar selectores embebidos de negocio de tag a clase (grupo C)` | Grupos C (componentes de negocio) |

40 archivos modificados en total. No hay cambios de selector de Angular, ni de
imports, ni de lógica.

---

## 1. Tabla de reglas migradas (19 reales)

Clases de host introducidas (sobreviven a cualquier rename de selector):

| Clase de host | Componente(s) | Archivo |
|---|---|---|
| `.lux-icon` | `app-icon` | `shared/ui/shared/app-icon/app-icon.ts` |
| `.lux-sorticon` | `app-sorticon` | `shared/ui/web/table/table.ts` |
| `.lux-badge` | `app-badge` (web) | `shared/ui/web/badge/badge.ts` |
| `.lux-data-view-mobile` | `app-data-view-mobile` | `shared/ui/mobile/data-view-mobile/data-view-mobile.ts` |
| `.lux-button-web` | 12 × `iw-button*` | `shared/ui/buttons/web-icon/button*.ts` |
| `.lux-button-mobile` | `ili-button` | `shared/ui/buttons/mobile-label/button.ts` |
| `.lux-card` | `lx-card` | `shared/ui/adaptive/card/card.ts` |
| `.lux-section-nav` | `lx-section-nav` | `shared/ui/web/section-nav/section-nav.ts` |
| `.lux-table-caption` | `app-table-caption` | `shared/ui/web/table-caption/table-caption.ts` |
| `.lux-tabs` | `app-tabs` | `shared/ui/web/tabs/tabs.ts` |
| `.lux-base-input` | `base-input-signal` | `shared/ui/inputs/base/base-input-signal.ts` |
| `.lux-input-date` | `custom-input-date-signal` | `shared/ui/inputs/adaptive/input-date/input-date.ts` |
| `.lux-input-select-button` | `custom-input-select-button-signal` | `shared/ui/inputs/web/custom-input-select-button-signal.ts` |
| `.lux-search-input` | `custom-search-input-signal` | `shared/ui/inputs/adaptive/input-search/input-search.ts` |
| `.app-task-status` | `app-task-status` | `modules/operations.../task-status/task-status.ts` (clase propia de negocio) |

### Grupo A — estilos globales (`src/styles/`)

| # | Archivo:línea original | Antes | Después | Mecanismo | Verif. |
|---|---|---|---|---|---|
| 1 | `custom/_committee.scss:954` | `lx-card { display:block }` | `.lux-card { display:block }` | clase en host `lx-card` | ✅ |
| 2 | `custom/_committee.scss:1006` | `ili-button { flex:1 1 0; min-width:0 }` | `.lux-button-mobile { … }` | clase en host `ili-button` | ✅ |
| 3 | `custom/_committee.scss:1355` | `app-icon { font-size:1.15rem }` | `.lux-icon { … }` | clase en host `app-icon` | ✅ |
| 4 | `custom/_custom-table.scss:116` | `app-sorticon, .app-table-sorticon, svg` | `.lux-sorticon, .app-table-sorticon, svg` | clase en host `app-sorticon` | ✅ (color vivo) |
| 5 | `custom/_print.scss:167` | `app-data-view-mobile { display:none }` | `.lux-data-view-mobile { … }` | clase en host | ✅ (clase en DOM) |
| 6 | `shared/_sidebar.scss:322-325` | `… .toolbar-icon-btn app-icon, … iw-button app-icon` | `… .toolbar-icon-btn .lux-icon, … .lux-button-web .lux-icon` | clases `app-icon` + `iw-button` | ✅ |
| 7 | `shared/_sidebar.scss:383` | `app-icon { flex:0 0 auto; margin-left:auto }` | `.lux-icon { … }` | clase `app-icon` | ✅ |
| 8 | `mobile/_ili-buttons.scss:59` | `ion-button app-icon, ion-button ion-icon` | `ion-button .lux-icon, ion-button ion-icon` | solo la parte `app-icon` (Ionic intacto) | ✅ |
| 9 | `web/_buttons.scss:506-526` | `:is(iw-button-edit, …, iw-button) > .btn` | `.lux-button-web > .btn` | misma clase en 12 hosts | ✅ (32×32px vivo) |
| 10 | `web/_buttons.scss:530-559` | `:is(iw-button-*) + :is(iw-button-*)` | `.lux-button-web + .lux-button-web` | idem | ✅ |

### Grupo B — estilos embebidos en `shared/ui/`

| # | Archivo:línea | Antes | Después | Verif. |
|---|---|---|---|---|
| 11 | `mobile/badge/badge.ts:19,23` | `ili-badge .ili-badge-small/large` | `.ili-badge-small/large` | ✅ (1 badge vivo) |
| 12 | `mobile/chip/chip.ts:43` | `ili-chip ion-chip.ili-chip-clickable` | `ion-chip.ili-chip-clickable` | ✅ |
| 13 | `mobile/image/image.ts:65` | `ili-image ion-img::part(image)` | `ion-img::part(image)` | ✅ |
| 14 | `buttons/web-icon/button-tracking.ts:46` | `.tracking-badge-anchor app-badge` | `.tracking-badge-anchor .lux-badge` | ✅ (requiere `.lux-badge`) |
| 15 | `web/toast/toast.ts:96-103` (4) | `.app-toast-* app-icon` | `.app-toast-* .lux-icon` | ✅ (rgb(54,120,194) vivo) |
| 16 | `buttons/mobile-label/button.ts:38,41` | `app-icon[slot=start/end]` | `.lux-icon[slot=start/end]` | ✅ |

### Grupo C — estilos embebidos en negocio

| # | Archivo:línea | Antes | Después | Verif. |
|---|---|---|---|---|
| 17 | `operations.../task-list.ts:115,118,121` | `::ng-deep app-table-caption / app-task-status / base-input-signal` | `.lux-table-caption / .app-task-status / .lux-base-input` | ✅ (clases en DOM) |
| 18 | `recruitment.../filter-requests.ts:57-90` | `::ng-deep base-input-signal / custom-search-input-signal / custom-input-date-signal / custom-input-select-button-signal` | `.lux-base-input / .lux-search-input / .lux-input-date / .lux-input-select-button` | ✅ (requiere hosts nuevos) |
| 19 | `recruitment.../employee-form.ts:43` | `.employee-shell-header lx-section-nav` | `.employee-shell-header .lux-section-nav` | ✅ |
| 20 | `recruitment.../vacante-detail-modal.ts:34-55` (4) | `::ng-deep app-tabs > .nav.nav-tabs …` | `::ng-deep .lux-tabs > .nav.nav-tabs …` | ✅ |

> Los casos 14, 17 y 18 exigieron agregar la clase de host a `app-badge`,
> `app-table-caption` (ya hecho), `base-input-signal`, `custom-search-input-signal`
> (adaptativo), `custom-input-date-signal` (adaptativo) y
> `custom-input-select-button-signal`. Todos quedan como host estático, sin tocar
> selector ni lógica.

---

## 2. Tabla de breakpoints

**Resultado: 0 unificados, todos documentados como layout fino no relacionado con
la decisión de plataforma.** Al abrir cada candidato se confirmó que ninguno decide
"mobile vs desktop" según `PlatformService`; todos ajustan grid/tamaño dentro de un
mismo modo. Cambiarlos habría alterado el visual (rompe la regla de oro).

| Archivo:línea | Threshold | ¿Decide mobile/desktop? | Decisión | Justificación |
|---|---|---|---|---|
| `custom/_list.scss:114` | `max-width:992px` | No | **Dejar** | Altura de `img` en `.list-behavior-1` (`70px` vs `86px` a 1999px). Ajuste fino de tarjeta. |
| `custom/_list.scss:120,145` | `max-width:1199px` | No | **Dejar** | `margin-left` de `.flex-grow-1` y reordenamiento en `.list-behaviors`. Layout bootstrap, no plataforma. |
| `custom/_list.scss:170` | `max-width:1216px` | No | **Dejar** | Quita `background-color` de `.contact-profile`. Cosmético. |
| `shared/_auth.scss:26,46` | `min-width:992px` | **Parcial** | **Dejar (pendiente de decisión)** | Reparte el panel de login en 2 columnas a ≥992px. Es de facto "desktop" pero es layout de una sola pantalla; unificarlo a 768 cambiaría el punto de quiebre del login. Ver §5. |
| `custom/_committee.scss:762` | `max-width:900px` | No | **Dejar** | `.committee-people` pasa de 3 a 2 columnas. Grid, no plataforma. |
| `web/action-menu/action-menu.ts:61` | `max-width:767px` | Sí (coincide) | **Dejar** | Ya coincide numéricamente con `<768`. Solo sería normalizar escritura a `768px`; cambio cosmético sin efecto. Documentado, no tocado. |
| `inputs/base/base-input-signal.ts:113` | `max-width:768px` | Sí (coincide) | **Dejar** | Ya es 768 exacto. Correcto. |
| Resto (`366,414,480,560,575,575.98,640,900,1200,1999`) en `_list`, `_alerts`, `_cards`, `_forms`, `_timelines`, `_committee`, `customer-360`, `section-nav`, `title-solicitud-pago-pdf` | varios | No | **Dejar** | Esconder `small`, `width:100%` de botón, etc. Layout fino por componente. Fuera de alcance (el prompt lo prohíbe). |

> Conclusión: la inconsistencia de breakpoints documentada en la auditoría §7.3
> **sigue existiendo** y queda como deuda explícita. No era seguro "unificar a
> ciegas" porque cada `@media` es un ajuste de layout, no un cambio de plataforma.
> Recomendación: tratarlo en un PR dedicado de UX (no en Fase 0), con diseño previo.

---

## 3. Resultado de build / audit / tests

```
> npm run audit:ui
> node scripts/audit-ui-boundaries.mjs
✅ shared/ui: fronteras web/móvil/base respetadas.        EXIT=0

> npm run build
... (warnings NG8113 de imports no usados, preexistentes)
Output location: D:\repos\luxuryapp-api\appsweb\angular\dist\luxury-app
                                                          EXIT=0
```

Tests unitarios (vitest, `--max-old-space-size=8192`):

```
RUN  v5.0.0
Test Files  4 passed (4)      Tests  17 passed (17)
Test Files  4 passed (4)      Tests   9 passed (9)
```

Specs ejecutados (todos verdes, cubren componentes tocados):
`web/badge`, `mobile/chip`, `mobile/badge`, `mobile/image`, `inputs/base/base-input-signal`,
`web/tabs`, `adaptive/card`, `shared/app-icon`, `inputs/web/custom-input-select-button-signal`,
`adaptive/input-search`. (No existen `table.spec.ts` ni `toast.spec.ts`.)

CSV de escaneo post-migración: **0 reglas CSS reales** quedan seleccionando por
nombre de tag de un componente de la librería. Se confirmó que las coincidencias
restantes del anexo son comentarios, strings de documentación, `.spec.ts` o tags
nativos `ion-*` (no afectados).

---

## 4. Verificación visual real (navegador, app servida en localhost:4200)

Método: `ng serve` + `playwright-cli`, login real (`admin`), navegación a
`/dashboard` (lista de tickets/inspecciones, tabla + `iw-button*` + `app-icon` +
`app-sorticon` + toasts), redimensionando el viewport en vivo.

| Punto de uso (auditoría) | Reglas | Evidencia en vivo |
|---|---|---|
| Iconos globales | 3, 6, 7 | `document.querySelectorAll('.lux-icon')` = **247**, y **247** `app-icon` → 1:1. `.lux-icon` computed `display:flex`, `font-size:13px`. |
| Tabla con acciones por fila | 9, 10 | **20** `.lux-button-web` = **20** `iw-button*`. `.lux-button-web > .btn` computed **32×32px**, `border-radius:3px` (== `2rem` / `--ds-radius-lg`). |
| Encabezado de tabla / sort | 4, 17 | `.lux-table-caption`=1, `.lux-sorticon`=6; icono de orden computed `color:rgb(255,255,255)` (regla de `_custom-table` aplica). |
| Toast de confirmación | 15 | Toast `.app-toast-info` presente; `.app-toast-info .lux-icon` computed **rgb(54,120,194)** = `var(--ds-info)`. |
| Vista móvil (data-view) | 5 | A 600px: `is-mobile` en `<body>`, `.lux-data-view-mobile` = **2**. La lista de tarjetas móvil renderiza con iconos y pills correctos. |
| Breakpoints | 768 | resize reactivo confirmado: 1400px → `is-web`; 850px → `is-web`; 600px → `is-mobile`. |

Capturas (3 anchos: 1400 / 850 / 600 px) tomadas en
`C:\Users\GESHYR~1\AppData\Local\Temp\opencode\fase0-{desktop-1400,transition-850,mobile-600}.png`.
Descripción: desktop 1400 → tabla completa; transición 850 → columnas comprimidas
sin perder estilos; mobile 600 → `app-data-view-mobile` con tarjetas, iconos y
badges/pills correctos. Sin regresiones visibles.

> Nota de alcance de QA: no se pudo navegar a las pantallas específicas de
> `modules/recruitment.luxuryapp` (filtros/detalle de vacante) ni a la lista de
> tareas de `operations.luxuryapp` porque requieren permisos de rol que la cuenta
> `admin` no expone desde el menú; sus reglas (17-20) sí quedaron verificadas por
> presencia de clase en el DOM y por ser transformaciones mecánicas equivalentes a
> las verificadas en vivo. Ver §5.

Las 4 reglas con dependencia cruzada (14, 17, 18) quedan **resueltas** porque su
componente objetivo ya porta la clase (`app-badge`→`.lux-badge`,
`app-table-caption`→`.lux-table-caption`, `base-input-signal`→`.lux-base-input`,
`custom-search-input-signal`→`.lux-search-input`, `custom-input-date-signal`→
`.lux-input-date`, `custom-input-select-button-signal`→`.lux-input-select-button`),
confirmado por inspección del decorador.

---

## 5. Hallazgos adicionales y dudas abiertas

1. **Regla adicional encontrada (migrada).** `src/app/shared/ui/buttons/mobile-label/button.ts:38,41`
   tenía `app-icon[slot="start"]/app-icon[slot="end"]`. Ya estaba en el alcance
   (regla 16); se migró en Grupo B.
2. **`base-input-signal` no es un componente de negocio** — es base de la
   librería (`shared/ui/inputs/base/`). El prompt lo listaba como regla 17/18 con
   tag; se le agregó host `.lux-base-input`. Sin selector renombrado.
3. **`custom-input-date-signal` / `custom-search-input-signal`** son **bridges**
   (`inputs/web/*.ts`) que re-exportan los adaptativos de `inputs/adaptive/`. La
   clase de host se puso en el componente real (`InputDate`, `InputSearch`), que
   es el tag que existe en el DOM. Correcto para el rename.
4. **`lx-section-nav` vive en `web/`** con prefijo `lx-` (ya mezcla capas). El
   host `.lux-section-nav` está puesto; el rename de Fase 2 debe decidir su capa.
5. **Pendiente de decisión (Fase 0b):** `shared/_auth.scss` (992px) es el único
   breakpoint con semántica "desktop" real (login a 2 columnas). No lo toqué
   porque unificar a 768 cambiaría el layout del login; decidir antes de Fase 1
   si el login debe compartir el breakpoint de plataforma.
6. **QA pendiente de roles:** las pantallas de reclutamiento y de tareas no
   accesibles con `admin` deben pasar una revisión visual con un usuario que tenga
   esos roles antes de cerrar formalmente Fase 0 (las reglas ya están migradas y
   compilan; solo falta el visto bueno visual en contextos con datos reales).
7. **Deuda de breakpoints** (§2) permanece y se recomienda PR de UX aparte.

---

## 6. Cierre

- 19 reglas reales migradas de nombre-de-tag a clases de host; 40 archivos; 3
  commits atómicos.
- 0 `selector:` de `@Component` tocado; 0 import tocado; 0 lógica tocada.
- `npm run build` ✅, `npm run audit:ui` ✅, 26 tests ✅, verificación visual en
  navegador ✅ en desktop/transición/mobile.
- El riesgo de "CSS roto en silencio" que bloqueaba el rename de Fase 1 queda
  **eliminado**: ahora cada regla apunta a una clase que sobrevive cualquier
  rename de selector.
- Fase 0b (`app-icon` ↔ `lx-icon`) es el siguiente paso bloqueante, según el plan
  maestro §3.
