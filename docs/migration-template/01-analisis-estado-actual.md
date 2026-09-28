# 01 — Análisis del Estado Actual

📅 Análisis realizado: 2026-09-12
📂 Fuentes revisadas:
- `appsweb/angular/src/styles/**`
- `appsweb/angular/src/app/shared/ui/**`
- `conventions/CONVENTIONS.md` + `conventions/ui/**` + `conventions/styles/**`
- `appsweb/angular/src/app/shared/ui/arquitectura-shared-ui.md` (fuente oficial de la librería)
- `appsweb/angular/package.json`, `appsweb/angular/angular.json`, `appsweb/angular/tsconfig.json`
- `templates_admin/lagos/**`, `templates_admin/minia/**`
- Conteos reales por `grep` sobre `appsweb/angular/src/app/modules/**` (1,492 archivos `.ts`)

> Todos los conteos de este documento son medidos, no estimados. Donde el
> dato es una aproximación (por posible diferencia de comillas, alias de
> import, etc.) se indica explícitamente con ⚠️.

---

## 1. Arquitectura actual de `shared/ui` (esto lo hace posible)

La app **ya está diseñada** para tener dos implementaciones de UI en
paralelo — esto es la base que hace viable una migración progresiva en vez
de un "big bang":

```
src/app/shared/ui/
├── base/       🧠 lógica compartida, sin UI de plataforma (BaseInputSignal, etc.)
├── web/        🖥️ implementación ESCRITORIO — PrimeNG — selector app-*
├── mobile/     📱 implementación MÓVIL — Ionic — selector ili-*
├── adaptive/   🔀 delegador que elige web/mobile en runtime — selector lx-*
├── shared/     🔧 piezas agnósticas de plataforma (app-icon, kpi-card, focus-trap…)
├── buttons/    🔘 sistema de botones (base + web-icon/web-label + mobile-icon/mobile-label)
└── inputs/     ✍️ sistema de inputs (base + web/ + mobile/ + adaptive/ + bridges)
```

Reglas de frontera **ya existentes y auditadas** (`npm run audit:ui` →
`scripts/audit-ui-boundaries.mjs`, corre dentro de `npm run lint`):

- `web/` **nunca** importa Ionic/mobile.
- `mobile/` **nunca** importa PrimeNG/web.
- `base/` no importa ninguna librería visual de plataforma.
- `adaptive/` es la única capa exenta (cruza intencionalmente).

**Consecuencia clave para la migración:** el layer `mobile/` (94 carpetas,
Ionic) **no se toca**. El layer `adaptive/` (90 carpetas) en principio **no
cambia su API pública** (`lx-*`) — solo debe seguir apuntando a una
implementación `web/` que, por dentro, dejará de usar PrimeNG y empezará a
usar Bootstrap. Si esto se cumple estrictamente, una feature que solo
consume `lx-*` o wrappers `app-*` reales no debería necesitar tocar su
HTML. El riesgo real está concentrado en:

1. Las **fugas** donde una feature ya importa PrimeNG directo (ver §5).
2. Los componentes `web/` que son **demasiado específicos de PrimeNG** para
   sobrevivir con la misma API pública (ej. `p-table` con `templates`
   PrimeNG-only, `p-dynamicdialog`, `pTemplate`).

### Convención de selectores (vigente, de `arquitectura-shared-ui.md`)

| Capa | Tecnología | Selector | Ejemplo |
|---|---|---|---|
| Web | PrimeNG | `app-*` | `app-status-badge` |
| Móvil | Ionic | `ili-*` | `ili-status-badge` |
| Adaptativo | runtime | `lx-*` | `lx-status-badge` |
| Botón web (label / icon) | PrimeNG | `il-*` / `iw-*` | `iw-button-edit` |
| Botón móvil (label / icon) | Ionic | `ili-*` / `ii-*` | `ii-button-edit` |
| Input adaptativo | runtime (selector histórico conservado) | `custom-input-*-signal` | `custom-input-text-signal` |

Esta tabla es la que hay que "traducir" en el plan: cada fila `app-*` /
`il-*` / `iw-*` es candidata a reimplementarse en Bootstrap sin que el
selector cambie.

---

## 2. Inventario cuantitativo de `shared/ui`

| Carpeta | Nº de subcarpetas de componente | Líneas TS+HTML+SCSS |
|---|---:|---:|
| `web/` (desktop, PrimeNG) | 173 (de las cuales **45** son wrappers `primeng-*` internos) | 19,135 |
| `mobile/` (Ionic — fuera de alcance) | 94 | — |
| `adaptive/` (delegador) | 90 | — |
| `inputs/web` | 26 | 13,938 (todo `inputs/`) |
| `inputs/adaptive` | 26 | incluido arriba |
| `buttons/` (sistema completo) | — | 3,480 |
| `shared/` (agnóstico) | 19 | — |
| **Total archivos en `shared/ui`** | **1,198 archivos** | — |

**Total de features consumidoras:** 1,492 archivos `.ts` bajo
`appsweb/angular/src/app/modules/**`.

### Uso real medido de la librería (imports en `app/modules/**`)

⚠️ Los imports en este repo usan **comillas dobles** (`from "@ui/..."`), no
simples. Los primeros conteos de esta sesión con comillas simples dieron
falsos negativos (0 resultados); los números de abajo ya están corregidos y
verificados.

| Import | Nº de ocurrencias en `app/modules/**` |
|---|---:|
| `@ui/web/*` | 1,368 |
| `@ui/buttons/*` | 1,376 |
| `@ui/inputs/*` | 986 |
| `@ui/mobile/*` | 613 |
| `@ui/adaptive/*` | 558 |

---

## 3. Huella real de PrimeNG por componente (el dato más importante del análisis)

Conteo de `import … from "@ui/web/primeng-*"` en `app/modules/**`:

| Wrapper PrimeNG | Usos | Peso relativo |
|---|---:|---|
| `primeng-table` | **341** | 🔴 Crítico |
| `primeng-custom-caption` | **215** | 🔴 Crítico (satélite de tabla) |
| `primeng-custom-table-emptymessage` | **187** | 🔴 Crítico (satélite de tabla) |
| `primeng-custom-table-footer` | **135** | 🔴 Crítico (satélite de tabla) |
| `primeng-api` | 29 | 🟡 Medio (tipos `MenuItem`, etc.) |
| `primeng-button` | 26 | 🟡 Medio |
| `primeng-tag` | 20 | 🟡 Medio |
| `primeng-inputtext` | 19 | 🟡 Medio |
| `primeng-message` | 13 | 🟡 Medio |
| `primeng-divider` | 12 | 🟢 Bajo |
| `primeng-checkbox` | 11 | 🟢 Bajo |
| `primeng-skeleton` | 7 | 🟢 Bajo |
| `primeng-progressspinner` | 5 | 🟢 Bajo |
| `primeng-select`, `primeng-radiobutton`, `primeng-dialog` | 4 c/u | 🟢 Bajo |
| `primeng-toolbar`, `primeng-toast`, `primeng-selectbutton` | 3 c/u | 🟢 Bajo |
| resto (accordion, autocomplete, avatar, badge, breadcrumb, carousel, chip, dataview, datepicker, dynamicdialog, floatlabel, iconfield, inputgroup(addon), inputicon, inputnumber, menu, multiselect, popover, progressbar, ripple, splitbutton, tabs, toggleswitch, custom-toast) | 1–2 c/u | ⚪ Cola larga (~30 componentes) |

**Hallazgo central:** el ecosistema de **tabla** (`primeng-table` +
`primeng-custom-caption` + `primeng-custom-table-emptymessage` +
`primeng-custom-table-footer`) concentra **878 de ~1,074 imports
`primeng-*`** medidos, es decir, **más del 80% de toda la huella de
PrimeNG en features**. Esto no es casualidad: `conventions/CONVENTIONS.md`
(sección "Regla especial vigente de PrimeNG") declara **explícitamente**
que `p-table` y su ecosistema directo son la **única excepción vigente**
para usar PrimeNG sin pasar por un wrapper adaptativo completo. En la
práctica, esto significa que la tabla **no está detrás de un
`lx-data-view`/`app-data-grid` único** como el resto de la librería —
está compuesta directamente en cada feature. `@ui/web/data-grid` solo tiene
**2 usos** medidos; la inmensa mayoría de listados arma la tabla "a mano"
con `p-table` + los 3 sub-wrappers.

**Consecuencia para el plan:** la tabla es, con enorme diferencia, el
ítem de mayor costo y mayor riesgo de toda la migración. No es un
problema de "reemplazar un componente", es un problema de **tocar
potencialmente cientos de plantillas de feature** (aunque los 3
sub-wrappers sí están encapsulados y se pueden rediseñar una sola vez).

### Fuga de PrimeNG fuera del wrapper oficial

- **77 archivos** fuera de `shared/ui` importan `primeng` **directamente**
  (`from "primeng/..."`), sin pasar por `@ui/web/primeng-*`.
- **83 archivos en total** en el proyecto importan `primeng` directo → solo
  **6 estarían dentro de `shared/ui`**, lo cual es sorprendentemente bajo
  frente a las 45 carpetas `primeng-*` — probablemente varias de esas
  carpetas (`primeng-custom-caption`, `primeng-custom-table-emptymessage`,
  `primeng-custom-table-footer`, `primeng-custom-global-filter`,
  `primeng-custom-toast`) son componentes **propios** que decoran `p-table`
  sin importar el paquete `primeng` en sí (usan `pTemplate`/proyección, no
  imports directos). Este número debe reconciliarse con precisión en la
  Fase 0 (ver plan), no se debe asumir que los 77 archivos son 77
  violaciones — muchos serán uso legítimo de `p-table` bajo la excepción
  vigente.

---

## 4. Sistema de tokens de diseño (la buena noticia del análisis)

Jerarquía de una sola fuente de verdad, ya documentada y respetada:

```
core/_colors.scss  (232 variables SCSS, ÚNICA fuente de hex/rgba)
      ↓ (#{c.$*})
theme/_variables.scss  (expone --primary-*, --secondary-*, --ds-*, --ds-m-* como CSS custom properties)
      ↓ (var(--*))
theme/mypreset.ts  (preset PrimeNG — SOLO referencia var(--*), nunca hex/rgba)
      ↓
Componentes PrimeNG
```

`src/styles/DESIGN.md` fija el espíritu de marca en un frontmatter YAML
formal:

- **Color ancla único:** `#003152` (Deep Navy, slot 700 de una rampa
  monocroma H=204), contraste 13.45:1 con texto blanco (AAA).
- **Acentos:** oro `#D4A74A`, esmeralda `#1E9B6D`, carmesí `#D34B4B`, cian
  `#4A90E2`.
- **Tipografía:** Figtree como familia base, escala modular con tokens
  `display/headline/title/body/label`.
- **Radios:** estandarizados a **3px** en todo lo rectangular (botones,
  inputs, cards, modales, overlays), `9999px` en circular/pill.
- **Espaciado:** grid de 8px, `stack-xs..2xl` de 4px a 48px.
- **Elevación:** 5 niveles de sombra ya definidos como `rgba(27,54,93,*)`.

**Por qué esto es una ventaja crítica para migrar a Bootstrap:** esta
especificación **ya está desacoplada de PrimeNG**. Los valores hex viven
en un solo archivo (`core/_colors.scss`) y se exponen como variables CSS
(`--ds-*`, `--primary-*`) consumidas por **cualquier** capa, no solo por
PrimeNG. Mapear estos mismos tokens a las variables SCSS de Bootstrap
(`$primary`, `$secondary`, `$success`, `$danger`, `$warning`, `$info`,
`$border-radius`, `$spacer`, `$font-family-base`) es un ejercicio acotado
de "puente", no una reescritura de la paleta. Ver mapeo propuesto en
`02-plan-migracion.md` §5.

### Hallazgo: `web/_buttons.scss` YA es casi Bootstrap

El sistema de botones del DS (`src/styles/web/_buttons.scss`, 894 líneas)
define `.btn`, `.btn-primary/secondary/danger/success/warning/info/help/
contrast/ai`, variantes `outline-*`, `ghost-*`, `text-*`, tamaños
`btn-xs..xl`, `.btn-group`, `.btn-icon` — **nomenclatura idéntica a la de
Bootstrap** (`.btn`, `.btn-primary`, `.btn-outline-primary`, `.btn-group`,
`.btn-sm/lg`). Se verificó además que los componentes TypeScript de
`shared/ui/buttons/web-label/*` y `web-icon/*` **no usan `p-button` ni
`pButton` en absoluto** (grep sin resultados) — renderizan `<button
class="btn ...">` plano. Esto significa que la capa de botones **ya está
construida como si fuera Bootstrap**, y el trabajo real de migración ahí es
sobre todo de **reconciliación de especificidad/orden de carga** (que el
`.btn` de Bootstrap no gane por cascada al `.btn` del DS) más que una
reescritura de componentes.

### Archivos de tokens huérfanos detectados (deuda preexistente, no causada por PrimeNG)

- `core/_variables.scss`: **no importado por nada** (breakpoints, z-index,
  tamaños) — confirmado también por `estandar-hoja-estilos.md`.
- `primeng-overrides.css`: **no referenciado por `angular.json`** — archivo
  huérfano de 319 líneas de overrides PrimeNG que hoy no se ejecuta.
- `src/app/mypreset.ts`: preset PrimeNG alternativo (basado en Lara) que
  **no está activo** (el activo es `src/styles/theme/mypreset.ts`, basado
  en Aura). Candidato a borrado independientemente de esta migración.

---

## 5. Arquitectura de hojas de estilo (`appsweb/angular/src/styles/`)

Estructura real verificada en disco (7 carpetas + 4 archivos raíz):

```
styles/
├── ds-entry.scss          🚀 entrada DS — @use — SIN alcance sobre reset/tipografía global
├── styles.scss            📜 hoja maestra legacy — @import — capas CSS + Ionic + dark mode
├── primeng-overrides.css  🅿️ HUÉRFANO — no cargado por angular.json
├── DESIGN.md              🎨 especificación de marca (frontmatter YAML, ver §4)
├── estandar-hoja-estilos.md  📋 documentación interna — ⚠️ parcialmente desactualizada (ver abajo)
├── core/     (8 archivos)  tokens SSOT: colors, spacing, borders, shadows, typography, functions, mixins
├── web/      (18 archivos) PrimeNG overrides (`prime-*.scss`) + clases DS puras (`buttons, cards, inputs, forms, tables, alerts, dropdowns`) + `flatpickr`
├── mobile/   (3 archivos)  Ionic (`ionic-rn-theme`, `ili-buttons`, `header-mobile`)
├── theme/    (2 archivos)  `_variables.scss` (puente a CSS vars) + `mypreset.ts` (preset PrimeNG)
├── shared/   (4 archivos)  cross-cutting: `cdk-overrides`, `toast`, `auth`, `sidebar`
├── base/     (2 archivos)  `_global.scss`, `_dark-mode.scss`
└── custom/   (6 archivos)  legacy/específico: avatars, list, custom-table, financial-tables, print, utilities
```

Orden de capas CSS declarado en `styles.scss` (RN-DS-012):

```
@layer ionic, reset, tokens, primeng, primevue, primeng-brand, base, components, utilities, overrides;
```

`angular.json` carga, en este orden: `primeflex.css` → `flatpickr.css` →
`primeicons.css` → `@angular/cdk/overlay-prebuilt.css` → `ds-entry.scss` →
`styles.scss` → `animate.css`. **Bootstrap no está en esta lista.**

### ⚠️ Hallazgo: documentación interna desactualizada

`src/styles/estandar-hoja-estilos.md` (391 líneas, "última revisión
27-jun-26") describe en su cuerpo principal (líneas ~100–247) una
estructura con carpetas `components/` y `prime-overrides/` que **ya no
existen en disco** — el propio documento reconoce en una nota (líneas
58–62) que ambas se fusionaron dentro de `web/` en una reorganización del
04-jul-26, pero no se actualizó el resto del archivo. La estructura real y
vigente hoy es la de 7 carpetas listada arriba, y coincide con
`conventions/styles/styles-structure.md` (fechado 29-jul-26), que **sí**
está correcto. Esto debe corregirse en la Fase 0 del plan para no guiar a
nadie al lugar equivocado durante la migración.

### ⚠️ Hallazgo: `@ng-bootstrap/ng-bootstrap` ya instalado pero sin CSS de Bootstrap

`package.json` de `appsweb/angular` ya declara `"@ng-bootstrap/
ng-bootstrap": "21.0.0"` como dependencia, y se usa activamente en **25
archivos** de features (módulos de accounting, admin, legal, maintenance,
management, operations, recruitment, supplier — mezclados sin patrón
único). Sin embargo, **no existe** el paquete `bootstrap` en
`package.json`, y `angular.json` **no carga ningún `bootstrap.scss`/
`bootstrap.css`**. Esto significa que esos 25 usos de `ng-bootstrap` hoy
corren **sin la hoja de estilos de Bootstrap**, dependiendo únicamente de
los estilos internos encapsulados del propio paquete. Es una
inconsistencia preexistente e independiente de esta migración, pero la
migración es la oportunidad natural para resolverla (instalar `bootstrap`
real + decidir el punto de entrada SCSS, ver plan).

### Riesgo de versión: PrimeNG en Release Candidate

`package.json` fija `"primeng": "^22.0.0-rc.1"` — el proyecto corre hoy
sobre un **release candidate**, no una versión estable. Esto es un riesgo
independiente de la migración (una app en producción sobre un RC), pero
también implica que **no conviene dejar flotante (`^`) esta dependencia
durante la ventana de migración**: un bump automático de PrimeNG a mitad
de la migración podría romper wrappers que ya se planean retirar. Se
recomienda fijar la versión exacta (`22.0.0-rc.1`, sin `^`) al iniciar la
Fase 0.

---

## 6. Comparación de plantillas de referencia

| Aspecto | `templates_admin/lagos` | `templates_admin/minia` |
|---|---|---|
| Angular | `^21.1.0` | `^21.0.4` |
| Bootstrap | `^5.3.3` | `^5.3.8` |
| `@ng-bootstrap/ng-bootstrap` | `^20.0.0` | `^19.0.1` |
| Estrategia SCSS | Importa `bootstrap/scss/bootstrap.scss` **directo, sin capa de override previa** (`public/assets/scss/app.scss`) — tema por defecto de Bootstrap (azul), overrides posteriores dispersos | Importa `functions` → `variables` (Bootstrap) → **`variables` propio** → **`variables-dark` propio** → `bootstrap` completo → overrides por componente. Variables custom ya usan `var(--#{$prefix}xxx)` (puente CSS-vars ↔ SCSS) |
| Dark mode | No se detectó arquitectura dedicada en el vistazo realizado | Archivo `_variables-dark.scss` dedicado + soporte RTL completo (`rtl/` con 9 archivos) |
| Estructura de carpetas | `component/` (galería enorme de demos: blog, bonus-ui con variantes de card/breadcrumb/creative-cards, dropzone…) + `pages/` + `auth/` — arquitectura de módulos NgModule clásica con `.scss` por componente | `structure/` (footer, topbar, sidebar vertical/horizontal, page-head) + `components/` (28 archivos: accordion, buttons, card, dropdown, forms, table, toasts, waves…) + `plugins/` (23 archivos: apexcharts, echarts, datepicker, colorpicker, sweetalert2, vector-maps, session-timeout, form-wizard, table-editable, responsive-table…) + `pages/` (auth, chat, email, timeline…) |
| Librerías adicionales relevantes | `apexcharts`, `ng-apexcharts`, `chartist`, `ngx-owl-carousel-o`, `ngx-bar-rating`, `leaflet`, `ngx-toastr`, `angular-calendar`, `@ng-select` (tema propio), `photoswipe`, `dropzone` | `apexcharts`, `ng-apexcharts`, `@popperjs/core`, `simplebar-angular` |
| Relevancia para LuxuryApp | **Galería visual de referencia** (variantes de card, breadcrumb, badges, formularios) — útil para "robar" composiciones puntuales, pero su base SCSS no aporta un puente de tokens reutilizable | **Base arquitectónica preferida**: su cascada `functions → variables → overrides propios → bootstrap → componentes → estructura` es filosóficamente idéntica a la cascada que ya usamos (`core/_colors → theme/_variables → mypreset`), y ya resuelve sidebar/topbar/dark-mode/RTL, que son problemas reales que tendríamos que resolver de cero si migramos "a mano" |

**Recomendación preliminar (a confirmar en el plan):** usar la
**arquitectura de `minia`** como columna vertebral del puente
Bootstrap-tokens (su patrón `variables` + `variables-dark` antes de
`@import "bootstrap"`) y **el catálogo visual de `lagos`** como banco de
composiciones de UI a inspeccionar componente por componente, sin adoptar
su forma de cargar Bootstrap "a pelo".

### Nota de compatibilidad a verificar en Fase 0

Ambas plantillas están en **Angular 21**, un mayor por debajo de nuestro
**Angular 22**. No se verificó en esta pasada si `@ng-bootstrap/
ng-bootstrap@21.0.0` (la versión ya instalada en nuestro `package.json`)
declara soporte de peer-dependencies para Angular 22 — dado que el
versionado de `ng-bootstrap` no seis directamente el de Angular, esto no es
necesariamente un problema, pero debe confirmarse explícitamente antes de
apoyarse en componentes de `ng-bootstrap` a gran escala.

---

## 7. Resumen de hallazgos (para priorizar la Fase 0 del plan)

| # | Hallazgo | Tipo | Acción sugerida |
|---|---|---|---|
| 1 | Tabla (`p-table` + 3 sub-wrappers) = 80%+ de la huella de PrimeNG en features | Alcance | Es el ítem #1 del plan, no un ítem más |
| 2 | Botones (`web/_buttons.scss` + `buttons/web-*`) ya usan markup y nomenclatura Bootstrap-like, sin `p-button` | Oportunidad | Migrar primero como "quick win" y piloto del patrón de trabajo |
| 3 | 77 archivos con import directo de `primeng` fuera de `shared/ui` | Deuda / riesgo | Reconciliar en Fase 0: separar uso legítimo (`p-table`) de fuga real |
| 4 | `@ng-bootstrap/ng-bootstrap` ya instalado y usado en 25 archivos, sin `bootstrap.css` cargado | Inconsistencia preexistente | Resolver como parte de la Fase 0 (instalar `bootstrap`, decidir entry point) |
| 5 | `estandar-hoja-estilos.md` desactualizado (describe carpetas ya fusionadas) | Deuda documental | Corregir antes de que alguien lo use como guía durante la migración |
| 6 | `primeng-overrides.css`, `core/_variables.scss`, `src/app/mypreset.ts` huérfanos | Deuda documental/código | Confirmar borrado (independiente de la migración, pero se cruza con ella) |
| 7 | PrimeNG fijado en `^22.0.0-rc.1` (release candidate, versión flotante) | Riesgo de estabilidad | Fijar versión exacta al iniciar Fase 0 |
| 8 | `inputs/` tiene un rollout adaptativo **en curso e incompleto** (solo 5 de ~15+ tipos migrados a patrón adaptativo) | Coordinación | Secuenciar la migración de inputs a Bootstrap **después** de terminar (o congelar) el rollout adaptativo en curso, para no duplicar trabajo |
| 9 | `@ng-select/ng-select` ya es dependencia y ya existe `inputs/web/input-ng-select` | Oportunidad | Candidato natural para reemplazar `p-select`/`p-multiselect`/`p-autocomplete`; ambas plantillas de referencia también usan selects con tema Bootstrap |
| 10 | `mobile/` (Ionic, 94 carpetas) y `adaptive/` (90 carpetas) quedan fuera del alcance directo de esta migración | Alcance | Confirmar explícitamente en el plan para que nadie migre módulos que no corresponde tocar |
