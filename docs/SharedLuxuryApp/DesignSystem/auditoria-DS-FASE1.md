# Auditoría de Design System — FASE 1

**Proyecto:** LuxuryApp (`appsweb/angular`)
**Rol:** Senior UI/UX Designer & Design System Specialist (auditoría técnica)
**Fecha:** 2026-09-18
**Ejecutado desde:** `appsweb/angular/design-system/analisisDiseño.md` (prompt de auditoría)
**Idioma:** Español (México) · **Tono:** técnico, crítico, accionable
**Alcance:** FASE 1 — análisis del documento rector de diseño y su implementación real en el repositorio.

---

## 0. Metodología y fuentes verificadas

No se asumió ninguna API, token, archivo ni versión. Todo hallazgo se verificó contra el código real. Fuentes leídas:

| Fuente | Ruta | Rol |
| --- | --- | --- |
| Guía de marca / tokens declarativos | `src/styles/DESIGN.md` | Documento rector (front-matter con color/typography/rounded/spacing/elevation) |
| Master de diseño (stale) | `design-system/luxuryapp-inspections/MASTER.md` | Documento "autoridad de diseño" referenciado en `conventions/ui/design-tokens-rule.md:416` |
| Estandar de hojas de estilo | `src/styles/estandar-hoja-estilos.md` | Guía de arquitectura SCSS |
| Fuente de verdad de color | `src/styles/core/_colors.scss` | Paleta 50–950 |
| Puente de tokens | `src/styles/theme/_variables.scss` | `--ds-*`, `--p-*`, `--ion-*` (light/dark) |
| Tipografía / spacing / sombras / radios | `src/styles/core/_typography.scss`, `_spacing.scss`, `_shadows.scss`, `_borders.scss`, `_fonts.scss` | Escalas |
| Dark mode | `src/styles/base/_dark-mode.scss` | Overrides unlayered |
| Entrada SCSS | `src/styles/styles.scss`, `src/styles/ds-entry.scss` | Orden de capas y cascada |
| Reglas del repo | `conventions/ui/*`, `conventions/styles/*` | Gobernanza de UI/tokens |
| Verificación ejecutada | `scripts/audit-contrast.mjs`, `scripts/audit-ds-tokens.mjs`, `scripts/audit-design-system.mjs` | Auditorías automatizadas del proyecto |

**Auditorías corridas en esta sesión (evidencia empírica):**

- `node scripts/audit-contrast.mjs` → **42/42 PASS** (pero cobertura parcial, ver §4.4).
- `node scripts/audit-ds-tokens.mjs` → **FAIL: 7 violaciones en alcance** + 282 hardcodes fuera de alcance.
- `node scripts/audit-design-system.mjs` → PASS (gobierno de `apps/`).

---

## 1. Resumen ejecutivo

El sistema tiene una base sólida: paleta semántica completa (50–950), tokens CTI, arquitectura de capas CSS, dark mode real con `color-mix()`, contraste auditado en CI y 452 componentes compartidos. Es un sistema *maduro*, no un starter.


Se detectaron **3 hallazgos críticos**, **6 altos**, **8 medios** y **5 bajos**. Entre los más graves: badges de estado que incumplen WCAG AA (blanco sobre dorado = **2.23:1**, blanco sobre verde = **3.52:1**) y tokens con nombre semántico falso (`--ds-luxury-gold` es cian).

### Puntuación por categoría (1–10)

| Categoría | Puntuación | Comentario |
| --- | :---: | --- |
| Color — paleta y armonía | 7 | Escalas completas y coherentes; falencias en acentos y semántica |
| Color — modo claro | 8 | Contraste alto, buena jerarquía |
| Color — modo oscuro | 8 | Navy propio, `color-mix()`, glow; muy por encima del promedio |
| Contraste / a11y de color | 5 | Badges fallan AA; auditoría tiene falso negativo |
| Tipografía — intención | 8 | Escala clara y completa, fuente variable self-hosted |
| Tipografía — implementación | 4 | Drift fuerte vs `DESIGN.md`; `--ds-type-*` no re-anclado |
| Arquitectura de tokens | 7 | CTI correcto; duplicación de definiciones |
| Arquitectura de componentes | 7 | 452 componentes adaptive/web/mobile; madurez alta |
| Theming multi-brand / runtime | 6 | Layer + `data-theme` sí; sin multi-brand ni View Transitions |
| Motion | 6 | Tokens existen; nomenclatura y valores duplicados |
| Iconografía | 8 | Iconify + `app-icon`, sin font-icons legacy |
| Form factor / formularios | 7 | Patrón adaptive sólido |
| Responsive web | 6 | Breakpoints bien; sin container queries; faltan utilidades reales |
| Responsive móvil | 7 | Ionic 9 + safe-areas parciales; falta `viewport-fit=cover` |
| Accesibilidad avanzada | 6 | Focus/reduced-motion sí; falta evidencia WCAG 2.2 completa |
| Gobernanza | 4 | Documentos contradictorios; CI de tokens rojo |
| Developer Experience | 7 | Storybook, Vitest, Playwright, axe, Compodoc, audits |
| Performance / budgets | 6 | Budget de estilo 19–20KB vs objetivo <2KB |

**Puntuación global FASE 1: 6.4 / 10** — sistema usable y maduro, pero con **deuda de gobernanza y veracidad** que erosiona la confianza en el sistema como fuente de verdad.

---

## 2. Matriz de hallazgos

| # | Cat. | Hallazgo | Severidad | Esfuerzo | Recomendación | Referencia |
| --- | --- | --- | :---: | :---: | --- | --- |
| C-01 | Gobernanza | `MASTER.md` contradice a `DESIGN.md` y `core/_colors.scss`: primario `#1B365D` vs `#003152`; tipografía Inter/Hanken Grotesk vs Figtree; radios 4/8/12/16 vs 3px | 🔴 Crítico | S | Marcar `MASTER.md` como obsoleto o regenerarlo desde `DESIGN.md` + `_colors.scss`; un solo documento rector | `MASTER.md:41,64,124-129`, `DESIGN.md:5,53,124-130`, `core/_colors.scss:32` |
| C-03 | A11y color | `.bg-status-pending` blanco sobre `#D4A74A` = **2.23:1**; `.bg-status-success` blanco sobre `#1E9B6D` = **3.52:1** → falla WCAG AA 1.4.3 | 🔴 Crítico | S | Usar `--ds-warning-text`/`--ds-accent-text-*` o fondo claro + texto oscuro | `base/_global.scss:170-203`; `theme/_variables.scss:378-390` |
| A-01 | Tokens | `--ds-luxury-gold` apunta a `$tertiary-400` (cian `#72B3EF`), no a oro. Nombre semántico falso | 🟠 Alto | S | Re-apuntar a `$warning-400/500` o renombrar `--ds-luxury-cyan` | `theme/_variables.scss:402-405,798-805` |
| A-02 | Tokens | Sombras definidas dos veces: `core/_shadows.scss` (3px focus, escala xs–2xl) y `theme/_variables.scss:560-573` redefine `--ds-shadow-xs..2xl` y focus a 2px | 🟠 Alto | S | Definir una sola vez; `theme` solo consume | `core/_shadows.scss:34-50`; `theme/_variables.scss:560-573` |
| A-03 | A11y focus | `--ds-shadow-focus-md` no existe (referenciado en docs); `--ds-shadow-focus` oscila entre 3px `rgba(0,5,14,.35)` (core), 2px navy (theme) y `outline:2px` global | 🟠 Alto | S | Token único `--ds-focus-ring`; verificar visibilidad en light y dark | `design-tokens-rule.md:172`; `styles.scss:170-173`; `core/_shadows.scss:29` |
| A-04 | Responsive móvil | `<meta viewport>` sin `viewport-fit=cover` → contenido bajo notch/home indicator | 🟠 Alto | S | Añadir `viewport-fit=cover` | `index.html:11` |
| A-05 | Calidad/CI | `audit:ds-tokens` **falla**: 7 violaciones en alcance (`mobile/image/image.ts:21,38`, `web/_ng-select-overrides.scss:37,41,45`, `web/_bootstrap-tokens.scss:41,42`) | 🟠 Alto | S | Tokenizar o `// ds-ignore` justificado | salida de `scripts/audit-ds-tokens.mjs` |
| A-06 | Deuda | 282 colores hardcodeados en 34 archivos de `src/app/modules/**` | 🟠 Alto | L | Ticket dedicado; codemod de tokens | salida de `audit-ds-tokens.mjs` |
| M-02 | Doc | `_fonts.scss` self-hosted Figtree, pero el estándar dice "Google Fonts" | 🟡 Medio | S | Corregir doc | `_fonts.scss:9-19` vs `estandar-hoja-estilos.md:193` |
| M-03 | Tipografía | `--ds-type-*` (clamp) no coincide con la escala de `DESIGN.md` (Display LG 48px → máx 40px; Headline MD 24px → 16px) | 🟡 Medio | L | Re-anclaje con fuente real (FASE 3 T11 ya reconocido) | `theme/_variables.scss:491-513` vs `DESIGN.md:55-121` |
| M-04 | Doc | DESIGN.md declara "8px grid" y "every spacing… 8px" pero la escala real es base 4px con múltiplos 4/12/20 | 🟡 Medio | S | Alinear narrativa y tokens; o declarar base 4px | `DESIGN.md:133,162`; `core/_spacing.scss:9-33` |
| M-05 | Performance | Budget `anyComponentStyle` 19–20KB (objetivo prompt <2KB); initial 4.2MB | 🟡 Medio | L | Medir y dividir componentes pesados | `angular.json:109-110` |
| M-06 | Responsive | Sin container queries; layout responsive por clases `hidden md:block` y PrimeFlex | 🟡 Medio | M | Adoptar `@container` en componentes adaptativos | `MASTER.md:664-674` |
| M-07 | A11y color | `--ds-shadow-focus` base usa `rgba(0,5,14,.35)` casi negro, poco visible sobre superficies oscuras | 🟡 Medio | S | Usar acento claro en dark (ya existe override, unificar) | `core/_shadows.scss:29` |
| M-08 | Color | No hay gamut amplio (OKLCH / Display-P3); todo es sRGB hex | 🟡 Medio | M | Añadir `@supports (color: oklch(…))` para brand/gradientes | `core/_colors.scss` (global) |
| B-02 | Tokens | `theme-color: #0b3164` hardcodeado en `index.html` | 🔵 Bajo | S | Exponer token y referenciar | `index.html:45` |
| B-03 | Contraste | `--ds-text-tertiary` `#9AACBB` sobre blanco = **2.34:1**; `MASTER.md` afirma 5.4:1 (falso) | 🔵 Bajo | S | Reservar para no-texto/decorativo; corregir doc | `theme/_variables.scss:455`; `MASTER.md:440` |
| B-04 | Motion | Dos escalas: `--ds-motion-duration-*` (150/250/350) y `--ds-transition-duration:200ms`; falta `instant`/`slower` | 🔵 Bajo | S | Consolidar nomenclatura del prompt (instant/fast/normal/slow/slower) | `theme/_variables.scss:160-166`; `styles.scss:27-32` |
| B-05 | z-index | Dos escalas distintas: `--z-*` (theme) y `$z-*` (core `_variables.scss`, huérfano) | 🔵 Bajo | S | Eliminar el archivo huérfano o consolidar | `theme/_variables.scss:280-289`; `core/_variables.scss:33-42` |

---

## 3. Hallazgo estructural: el stack asumido no es el real (CRÍTICO)

El prompt declara como objetivo implementable:

La realidad verificada:

- **Angular 22.1.6** ✅ coincide.
- Persisten, sin embargo, **artefactos de compatibilidad**: `--p-*` en `web/_prime-tokens.scss`, overrides `web/_prime-{button,input,card,dialog,table,dropdown,tag,message}.scss`, y `base/_dark-mode.scss` cubriendo `.p-datatable`, `.p-dropdown`, `.p-datepicker`, etc. Es **deuda de migración**, no una integración viva.
- **Ionic 9.0.3** (no 8); **Capacitor CLI 8.5.2**; **Bootstrap 5.3.8** (migración activa documentada en `web/_bootstrap-tokens.scss`).


---

## 4. Análisis de color

### 4.1 Paleta

La paleta real (`core/_colors.scss`) es completa y profesional: escalas 50–950 para `primary`, `secondary`, `success`, `warning`, `danger`, `info`, `help`, `ai`, `tertiary`, `neutral`, `contrast`. La marca `#003152` (Deep Navy, H=204, ancla en slot 700) es coherente con "institutional modernism".

- **Fortaleza:** ancla única documentada (`DESIGN.md:174`), rampa monocroma verificada, alias semánticos correctos.
- **Falencia:** `MASTER.md:41` sigue publicando `#1B365D` como primario. En el código real `#1B365D` = `$info-800` / `on-info-container`, no el primario. Un agente que confíe en `MASTER.md` pintará la marca con el color equivocado.
- **Falencia semántica:** `--ds-luxury-gold` = `$tertiary-400` = `#72B3EF` (**cian**). El "oro de lujo" es azul. Ver A-01.
- **Falencia de gamut:** todo es hex sRGB; sin OKLCH/Display-P3 (M-08).

### 4.2 Modo claro

Bien resuelto. Superficies M3 (`--ds-surface-container-*`), texto sobre superficie con ratios ≥ 5.4:1, y excepciones documentadas (`--ds-on-dark-*` invariantes al tema, `RN-DS-041`). Auditoría de contraste del propio repo: 42/42 PASS.

### 4.3 Modo oscuro

Punto fuerte. Escala navy propia `$surface-dark-0..950` (no negro puro — cumple la recomendación del prompt de evitar `#000`), mapeo semántico 1:1 vía `body.theme-dark` (`theme/_variables.scss:622-895`), `color-mix()` para tints, glow neon por severidad. La excepción documentada de la consola (`#1e1e2e` / `#cdd6f4`, T2.1) está correctamente aislada.

- **Observación:** el dark mode se aplica por `body.theme-dark` **y** `html.theme-dark` (`_dark-mode.scss:3`). Hay que verificar que no existan combinaciones donde el `html` no lleve la clase (FOUC de tema). El sistema sí define capas y tokens en `:root` (light) — la estrategia anti-FOUC del prompt (tokens en `<head>` de SSR) **no está evidenciada**; no hay SSR/hydration en el stack detectado (ver §7.5).

### 4.4 Auditoría de contraste — datos reales

**A. Pares cubiertos por `audit-contrast.mjs` (42/42 PASS):**

| FG | BG | Ratio | Rol | Estado |
| --- | --- | :---: | --- | :---: |
| `#1a2634` | `#ffffff` | 15.32 | text-primary / surface | ✅ |
| `#5a6878` | `#ffffff` | 5.70 | text-secondary / surface | ✅ |
| `#245fa1` | `#ffffff` | 6.51 | text-link / surface | ✅ |
| `#ffffff` | `#003152` | 13.45 | on-primary / primary | ✅ |
| `#157a55` | `#ffffff` | 5.32 | accent-text-success | ✅ |
| `#a63939` | `#ffffff` | 6.43 | accent-text-danger | ✅ |
| `#245fa1` | `#ffffff` | 6.51 | accent-text-info | ✅ |
| `#7a5e15` | `#ffffff` | 6.11 | accent-text-warning | ✅ |
| `#75899c` | `#ffffff` | 3.61 | border-control | ✅ |
| `#097fce` | `#ffffff` | 4.25 | border-focus | ✅ |
| `#ffffff` | `#256e9f` | 5.51 | on-cat-1 | ✅ |
| `#ffffff` | `#6953d7` | 5.50 | on-cat-2 | ✅ |
| `#ffffff` | `#b129b1` | 5.50 | on-cat-3 | ✅ |
| `#ffffff` | `#c62e2e` | 5.48 | on-cat-4 | ✅ |
| `#ffffff` | `#85631f` | 5.52 | on-cat-5 | ✅ |
| `#ffffff` | `#55721b` | 5.51 | on-cat-6 | ✅ |
| `#ffffff` | `#1c791c` | 5.52 | on-cat-7 | ✅ |
| `#ffffff` | `#1c7755` | 5.50 | on-cat-8 | ✅ |
| `#ddeaf4` | `#000c14` | 16.14 | dark text/surface | ✅ |
| `#80bde5` | `#000c14` | 9.72 | dark text-secondary | ✅ |
| `#c5d0db` | `#000c14` | 12.63 | dark text-muted | ✅ |
| `#c2dbf6` | `#000c14` | 13.89 | dark text-link | ✅ |
| `#001829` | `#b6d6ec` | 11.89 | dark on-primary | ✅ |
| `#8ce3c1` | `#000c14` | 13.05 | dark success | ✅ |
| `#f5a3a3` | `#000c14` | 10.02 | dark danger | ✅ |
| `#9bc8f3` | `#000c14` | 11.24 | dark info | ✅ |
| `#f3d58a` | `#000c14` | 13.83 | dark warning | ✅ |
| `#37a0e6` | `#000c14` | 6.90 | dark border-control | ✅ |
| `#000c14` | dominios cat 1–8 | 8.99–10.11 | dark on-cat | ✅ |

**B. Pares NO cubiertos por la auditoría (calculados aquí) — aquí está el problema:**

| FG | BG | Ratio | Uso | WCAG |
| --- | --- | :---: | --- | :---: |
| `#ffffff` | `#d4a74a` | **2.23** | `.bg-status-pending` (blanco sobre warning-600) | ❌ Falla AA y AAA, incluso texto grande |
| `#ffffff` | `#1e9b6d` | **3.52** | `.bg-status-success` (blanco sobre success-600) | ❌ Falla AA texto normal |
| `#ffffff` | `#3678c2` | 4.54 | `.bg-status-total` / `.bg-status-rejected` (info-600) | ⚠️ AA justo |
| `#9aacbb` | `#ffffff` | **2.34** | `--ds-text-tertiary` como texto | ❌ Falla si se usa como texto (doc dice 5.4) |
| `#d4a74a` | `#003152` | 6.04 | oro sobre navy (firma premium) | ✅ AA |
| `#ffffff` | `#0b3164` | 12.82 | login / auth panel | ✅ |
| `#ffffff` | `#4a90e2` | 3.29 | blanco sobre info-500 | ❌ Falla AA normal |

**Conclusión de contraste:** la auditoría del proyecto tiene un **falso negativo material**: valida tokens semánticos pero **no valida los pares reales de los badges de estado** definidos en `base/_global.scss:170-203`, que es donde están los incumplimientos. El claim de `conventions/ui/design-tokens-rule.md:404` — *"Los tokens ya están validados WCAG AAA"* — **es falso** tal como se usa en esos componentes.

### 4.5 Semántica y high-contrast

- Estados semánticos coherentes light/dark; `--ds-warning-text` correcto para botón sólido dorado (7.24:1 declarado).
- `prefers-contrast: more` implementado en light y dark (`theme/_variables.scss:578-616,856-894`) — **bien**, es lo que pide el prompt §1.5.
- Daltonismo: la paleta categórica `--ds-cat-1..8` tiene hue separation ≥ 38° declarada (`theme/_variables.scss:472-483`), pero **no hay verificación explícita de protanopia/deuteranopia/tritanopia** como evidencia; recomendable añadir simulación al pipeline visual.

---

## 5. Tipografía

- **Familia real:** Figtree variable (wght 300–900), self-hosted WOFF2, subset latin, `font-display: swap` (`_fonts.scss:9-19`). Esto **sí** cumple la recomendación del prompt (variable fonts + self-hosting + CSP-safe). El prompt asume `Inter`/`Hanken Grotesk`; el código usa `Figtree`.
- **Escala declarativa** (`DESIGN.md:52-121`): display-lg 48 → label-sm 10, con pesos y line-heights, es coherente y bien definida.
- **Escala implementada** (`--ds-type-*`, `theme/_variables.scss:491-513`): usa `clamp()` (fluid), lo que es correcto; **pero los valores no coinciden** con `DESIGN.md`:
  - Display LG: documento 48px; implementación `clamp(1.75rem,4vw,2.5rem)` = 28–40px.
  - Headline MD: documento 24px; implementación `1rem` = 16px.
  - El propio código lo reconoce: *"re-anclaje a escala DESIGN.md con la fuente real en FASE 3 (T11)"* (`theme/_variables.scss:491-492`).
- **Legibilidad:** `p { max-width: 65ch }` (`_typography.scss:131-132`) — cumple la longitud de línea recomendada. Mínimos ≥ 14px en cuerpo.
- **Drift documental:** `estandar-hoja-estilos.md:206` dice "Hanken Grotesk, Inter, JetBrains Mono"; `design-tokens-rule.md:143-151` mezcla valores. Ambos contradictorios con `_typography.scss:10-12` (Figtree).
- **Headings globales:** `h1–h6` tienen overrides globales en `_typography.scss:81-128`, pero `ds-entry.scss:11` dice explícitamente que **no** incluye tipografía para evitar resets globales. → Hay que confirmar qué archivo entra realmente al bundle (`styles.scss` no importa `core/typography`). Riesgo de headings sin estilo del DS.

---

## 6. Aplicación y componentes

### 6.1 Tokens

- **Fortaleza:** nomenclatura CTI, alias de compatibilidad documentados (`--ds-spacing-N`, `--ds-font-size-*`), `design-tokens.d.ts` como contrato TypeScript.
- **Falencia:** `design-tokens.d.ts` **no cubre** los tokens reales usados (`--ds-type-*`, `--ds-space-*`, `--ds-cat-*`, `--ds-on-dark-*`); define tipos genéricos (`SemanticColor`, `Spacing`, etc.) que no se generan desde el SCSS. Es un contrato **declarativo pero no sincronizado** → falsa sensación de type-safety.

### 6.2 Theming multi-brand / multi-theme

- **No:** no hay capa `@layer brand` separada, ni `data-theme="luxury-dark"` (solo clase `theme-dark`), ni multi-brand, ni View Transitions API, ni scroll-driven animations. El prompt §3.3 y §4.5 quedan **parcialmente cumplidos**.
- **FOUC / SSR:** no hay SSR/hydration/Universal en el proyecto (`package.json` no lo evidencia). La estrategia anti-FOUC del prompt §4.5 no aplica.

### 6.3 Motion

Tokens definidos (`--ds-motion-duration-fast/normal/slow`, easings standard/decelerate/accelerate). `prefers-reduced-motion` desactiva animaciones globalmente (`styles.scss:178-193`) — **excelente**. Falencias: nomenclatura duplicada y ausencia de `instant`/`slower` (B-04); no hay easing "luxury" custom (el prompt lo pide).

### 6.4 Iconografía

Iconify (`iconify-icon`) + `<app-icon>`; sin font-icons legacy (Bootstrap Icons eliminado, `index.html:42`). Tamaños vía `1em`. **Cumple** las recomendaciones del prompt (SVG, tree-shaking por API, `aria-hidden`/`role="img"` pendiente de verificar caso a caso). Hay auditoría propia `audit-icon-names`.

### 6.5 Form factor


---

## 7. Análisis técnico de implementación


### 7.2 Ionic 9 + Angular 22

- Mapping `--ion-color-*` ↔ `--ds-*` completo, incluyendo variantes shade/tint y modo oscuro (`theme/_variables.scss:169-275,627-666`). Bien resuelto.
- Corrección importante documentada: Ionic Core en `@layer ionic` (menor prioridad) para que no pise el ancla de marca (`styles.scss:52-69`). Excelente nota de ingeniería.
- **Falta:** `env(safe-area-inset-*)` con `viewport-fit=cover` (A-04); `ion-refresher`/`ion-infinite-scroll` existen como componentes adaptive pero no como patrón global.

### 7.3 Patrones Angular modernos

Signals, `OnPush`, control flow y `@defer` se usan en el proyecto (evidencia en componentes y en `MASTER.md:626-648`). El prompt pide `resource()`/`linkedSignal()`; no se verificó su adopción masiva en esta FASE 1.

### 7.4 Performance / budgets

| Métrica | Valor real | Objetivo prompt | Estado |
| --- | --- | --- | :---: |
| Initial bundle | warn 4.2MB / error 4.5MB | — | ⚠️ alto |
| Component style | warn 19KB / error 20KB | < 2KB | ❌ |
| Tokens CSS | no medido | < 5KB | ❓ |
| Fuente | Figtree WOFF2 subset, swap | swap + subset | ✅ |

### 7.5 SSR / SEO

No evidenciado en `package.json`. View Transitions no implementadas. Meta Open Graph/Twitter/JSON-LD: no verificadas en `index.html` (solo description + theme-color). **Información faltante.**

### 7.6 DX

Storybook 10 + addon-a11y + Chromatic, Vitest 5, Playwright + `@axe-core/playwright`, Compodoc, `webpack-bundle-analyzer`, y **11 scripts de auditoría** propios (`audit:tokens`, `audit:contrast`, `audit:a11y`, etc.). **Nivel de DX muy por encima del promedio.** El problema no es la herramienta, es que **el CI de tokens está en rojo** (A-05) y el de contraste tiene cobertura incompleta (C-03).

---

## 8. Responsive: web y móvil

- **Web:** breakpoints M3 estándar (`--ds-breakpoint-sm/md/lg/xl`) + PrimeFlex/Bootstrap. Density alta, adecuada a ERP.
- **Móvil:** Ionic 9, componentes `mobile/*`, `env(safe-area-*)` parcial. **Falta `viewport-fit=cover`**.
- **Container queries:** ausentes. El propio `MASTER.md:664-674` describe el patrón `hidden md:block` / `md:hidden`, que es media-query global, no componente responsivo real. El prompt §5.3 pide `@container`.
- **Riesgo:** scroll horizontal no auditado; `MASTER.md:678` lo prohíbe pero no hay test automatizado visual por breakpoint en evidencia.

---

## 9. Modo claro vs oscuro

- Consistencia alta: mapeo 1:1 de tokens, `color-mix()` no hardcodes (salvo excepciones documentadas).
- **Elevación:** `--ds-shadow-*` redefinidos en dark (sombras negras) + `--ds-glow-*` por severidad. Correcto.
- **Inconsistencia a corregir:** doble definición de sombras (A-02) y foco (A-03) puede producir diferencias entre lo declarado y lo renderizado según el orden de import.
- Iconos: usar `currentColor` — no verificado exhaustivamente.

---


El inventario real es la librería propia `shared/ui`:

| Capa | Componentes (dirs) | Notas |
| --- | :---: | --- |
| `shared/ui/adaptive` | ~100 | Patrón adaptativo web/mobile (button, card, data-view, table, inputs select, etc.) |
| `shared/ui/mobile` | ~100 | Implementaciones Ionic |
| `shared/ui/inputs/{adaptive,web,mobile}` | ~70 | Inputs especializados (currency, date, phone, mask, otp…) |
| `shared/ui/buttons`, `shared/ui/shared` | ~30 | Botones y compuestos de negocio (kpi-card, gauge, approval-workflow) |
| **Total** | **452 archivos TS** | Excluyendo `.spec.ts` |


---

## 11. Accesibilidad avanzada (WCAG 2.2)

### 11.1 Matriz de cumplimiento

| Criterio | Nivel | Implementación real | Estado |
| --- | :---: | --- | :---: |
| 1.4.3 Contrast (Minimum) | AA | Tokens semánticos auditados, **pero badges fallan** | ❌ |
| 1.4.6 Contrast (Enhanced) | AAA | Mayoría de texto ≥ 7:1; accent text 5.3–6.5 | ⚠️ parcial |
| 1.4.11 Non-text Contrast | AA | `--ds-border-control` 3.61:1 | ✅ |
| 2.4.1 Bypass Blocks | A | `.skip-link` (`_global.scss:45-65`) | ✅ |
| 2.4.7 Focus Visible | AA | `:focus-visible` global 2px `outline` (`styles.scss:170-173`) | ✅ |
| 2.4.11 Focus Not Obscured | AA | Sin evidencia (`scroll-padding`/sticky headers) | ❓ |
| 2.4.12 Focus Not Obscured (Enhanced) | AAA | Sin evidencia | ❓ |
| 2.5.7 Dragging Movements | AA | CDK drag & drop existe; sin alternativa click verificada | ❓ |
| 2.5.8 Target Size (Minimum) | AA | `$component-height-md: 44px` (`core/_variables.scss:48`), pero archivo huérfano | ⚠️ |
| 3.2.6 Consistent Help | A | Sin patrón verificado | ❓ |
| 3.3.7 Redundant Entry | A | Sin verificación | ❓ |
| 3.3.8 Accessible Authentication | AA | Login usa credenciales; sin verificar alternativa a cognitivo | ❓ |

### 11.2 Pruebas

- **Automatizadas:** `@axe-core/playwright`, `axe-core`, Storybook `addon-a11y`, `audit:a11y.mjs`. Presentes.
- **Manuales (NVDA/JAWS/VoiceOver, zoom 200/400%, high contrast):** sin evidencia documentada en FASE 1.
- **Gap crítico:** el pipeline de contraste no cubre pares reales de componentes → el PASS 42/42 da falsa seguridad.

---

## 12. Gobernanza y operaciones

- **SemVer / versioning del DS:** no hay paquete versionado; el DS vive dentro de la app (`package.json` → `luxury-app` v5.0.1). No hay release independiente ni LTS.
- **RFC / contribution:** reglas en `conventions/`, pero **sin proceso RFC formal de cambios de token**.
- **Fuentes de verdad múltiples y contradictorias** (C-01, M-01, M-02): el mayor riesgo de gobernanza.
- **Quality gates:** excelentes herramientas (11 auditorías), pero **el gate de tokens falla** y el de contraste es incompleto.
- **Changelog de convenciones:** existe `conventions/changelog.md` — positivo.

---

## 13. Inventario de tokens (muestra representativa)

| Token | Light | Dark | Uso | Componentes |
| --- | --- | --- | --- | --- |
| `--ds-primary` | `#003152` (primary-700) | `#b6d6ec` (primary-200) | Marca, CTA | botones, nav, badges |
| `--ds-on-primary` | `#ffffff` | `--primary-900` | Texto sobre primary | botones |
| `--ds-primary-hover` | `--primary-600` `#00568f` | `--primary-100` | Hover | botones |
| `--ds-secondary` | `--warning-600` `#d4a74a` (oro) | `--secondary-200` | Acento premium | badges VIP |
| `--ds-tertiary` | `--info-600` `#3678c2` | `--info-200` | Acento info | links, chips |
| `--ds-error` | `--danger-600` `#d34b4b` | `--danger-300` | Error | alerts, inputs |
| `--ds-warning-text` | `--warning-950` `#2b1f04` | idem | Texto sobre fondo dorado | botón warning |
| `--ds-success` | `success-600` `#1e9b6d` | `success-300` | Éxito | badges, alerts |
| `--ds-bg-page` | `--ds-background` | primary-950 | Fondo app | layout |
| `--ds-bg-surface` | `surface-container-lowest` | primary-950 | Cards/modales | card, dialog |
| `--ds-text-primary` | `--ds-on-surface` `#1a2634` | `--primary-100` | Texto | global |
| `--ds-text-muted` | `#5a6878` (5.70:1) | `--neutral-300` | Secundario | captions |
| `--ds-text-tertiary` | `--ds-text-muted` | idem | Terciario (⚠️ no usar como texto) | decorativo |
| `--ds-border` | `--secondary-200` | `--primary-400` | Divisores (exento 1.4.11) | layout |
| `--ds-border-control` | `--secondary-500` (3.61:1) | `--primary-400` (6.90:1) | Bordes de campo | inputs |
| `--ds-shadow-1..4` | navy tint `rgba(27,54,93,.06–.12)` | negro `.3–.55` | Elevación | cards, modales |
| `--ds-shadow-focus` | `0 0 0 2px #003152` (theme) / 3px oscuro (core) | `0 0 0 2px primary-200` | Foco | ⚠️ duplicado |
| `--ds-luxury-gold` | `tertiary-400` `#72b3ef` (**cian**) | `tertiary-200` | ⚠️ nombre falso | — |
| `--ds-cat-1..8` | 8 hues, ≥5.48:1 | 8 hues, ≥8.99:1 | Series/identidad | charts, org-chart |
| `--ds-space-xs..3xl` | 4/8/12/16/24/32/48 | idem | Espaciado | global |
| `--ds-type-*` | clamp variable | idem | Tipografía | global |
| `--ds-motion-*` | 150/250/350ms | idem | Motion | global |
| `--ds-on-dark-*` | blancos con opacidad | **invariantes** | Superficies oscuras en ambos temas | login, header |

---

## 14. Checklist de cumplimiento

| Área | Ítem | Estado |
| --- | --- | :---: |
| Atomic design | Tokens → componentes → patrones | ✅ |
| Tokenización | Cero hardcodes en alcance | ❌ (7 en alcance, 282 fuera) |
| Tokenización | Una sola definición por token | ❌ (sombras duplicadas) |
| Documentación | Documento rector único y vigente | ❌ (4 contradictorios) |
| Documentación | Component API autogenerable | ⚠️ (Storybook sí; doc de tokens no) |
| Testing | Unit + E2E + a11y | ✅ |
| Testing | Visual regression (Chromatic) | ✅ configurado |
| A11y | Contraste AA en componentes reales | ❌ (badges) |
| A11y | WCAG 2.2 criterios nuevos verificados | ❓ |
| Performance | CSS tokens < 5KB | ❓ |
| Performance | Componente < 2KB | ❌ (budget 19–20KB) |
| Dark mode | Paridad 1:1 tokens | ✅ |
| Motion | `prefers-reduced-motion` | ✅ |
| Gobernanza | Versionado SemVer del DS | ❌ |
| Gobernanza | CI verde | ❌ (tokens) |

---

## 15. Análisis FODA

**Fortalezas**
- Paleta y dark mode de calidad enterprise, con tokens CTI y auditorías automatizadas.
- 452 componentes compartidos con patrón adaptive web/mobile.
- DX sobresaliente (Storybook, Vitest, Playwright, axe, 11 auditorías propias).

**Oportunidades**
- Consolidar una **única fuente de verdad** y regenerar la documentación derivada.
- Añadir `@container`, View Transitions y gamut P3 cuando el producto lo justifique.
- Cerrar los gaps WCAG 2.2 (2.4.11/2.4.12/2.5.7/3.3.7/3.3.8) con evidencia.

**Debilidades**
- Documentación contradictoria (riesgo de implementación incorrecta por agentes y devs).
- Badges de estado incumplen AA; auditoría de contraste con falso negativo.
- Tipografía implementada ≠ escala declarada.
- CI de tokens en rojo.

**Amenazas**
- Deriva (drift) acelerada si agentes consumen `MASTER.md` en vez de `DESIGN.md` + código.
- Sobrecrecimiento del bundle (4.2MB) y de estilos por componente (20KB).

---

## 16. Recomendaciones priorizadas (Impacto × Esfuerzo)

| Prioridad | Acción | Impacto | Esfuerzo | Tipo |
| --- | --- | --- | :---: | --- |
| P0 | Corregir contraste de `.bg-status-pending` y `.bg-status-success` (usar `--ds-warning-text` / fondos claros) | Alto | S | Código |
| P0 | Declarar `DESIGN.md` + `core/_colors.scss` como única fuente; marcar `MASTER.md` obsoleto y corregir `design-tokens-rule.md` | Alto | S | Gobernanza |
| P1 | Ampliar `audit-contrast.mjs` para auditar pares reales de componentes (badges, botones, alerts) | Alto | M | CI |
| P1 | Poner `audit:ds-tokens` en verde (7 violaciones) | Alto | S | CI |
| P1 | Añadir `viewport-fit=cover` a `<meta viewport>` | Alto | S | Código |
| P1 | Unificar sombras/focus en una sola definición; crear `--ds-focus-ring` canónico | Alto | S | Tokens |
| P1 | Corregir `--ds-luxury-gold` (semántica falsa) | Medio | S | Tokens |
| P2 | Re-anclar `--ds-type-*` a la escala `DESIGN.md` (FASE 3 T11) | Alto | L | Tipografía |
| P2 | Inventariar y tokenizar 282 hardcodes de `modules/**` | Medio | L | Deuda |
| P2 | Añadir `@container` a componentes adaptativos clave | Medio | M | Responsive |
| P3 | Añadir OKLCH/Display-P3 para brand y gradientes | Bajo | M | Color |
| P3 | Consolidar nomenclatura motion (instant/fast/normal/slow/slower) | Bajo | S | Tokens |
| P3 | Versionado SemVer y proceso RFC del DS | Medio | M | Gobernanza |

---

## 17. Próximos pasos (FASE 2 sugerida)

1. **Remediación P0/P1** con tickets y verificación en CI (contraste, tokens, viewport).
2. **Unificación documental:** un solo documento rector generado; deprecación formal de `MASTER.md`.
3. **Ampliación de la matriz de contraste** a todos los pares de estado reales y simulación de daltonismo.
5. **Motion avanzado, iconografía, charts, i18n/RTL, multi-brand** — una vez estabilizada la base.
6. **Presupuestos de performance** reales (tokens < 5KB, componente < 2KB) y `@defer` en charts/editores/mapas.

---

## 18. Información faltante (declarada explícitamente)

| Ítem solicitado por el prompt | Estado |
| --- | --- |
| Documento único "Luxury Design System & Guide" | No existe como tal; hay 4 documentos parcialmente contradictorios |
| Ionic 8 | No aplica: la versión real es Ionic 9.0.3 |
| Dominios `luxury-app.com` / `luxurybuildingapp.com` | No verificados en el repo; no evidenciado que el DS deba divergir por dominio |
| Colores OKLCH / Display-P3 | No implementados |
| SSR / Hydration / View Transitions | No evidenciados |
| Container queries | No implementadas |
| Browser support matrix | No declarada |
| VPAT / ACR | No generado |
| Métricas LCP/CLS/INP/TBT | No medidas en esta auditoría |
| Simulación de daltonismo | No evidenciada |
| Cobertura de tests UI ≥ 80% | No verificada en esta FASE |

---

*Reporte FASE 1 generado a partir del prompt `design-system/analisisDiseño.md`, verificado contra el código real del repositorio el 2026-09-18. Los ratios de contraste "no cubiertos" fueron calculados con la fórmula de luminancia relativa WCAG 2.x y confirmados por script. Las cifras de auditorías provienen de la ejecución directa de los scripts del proyecto.*
