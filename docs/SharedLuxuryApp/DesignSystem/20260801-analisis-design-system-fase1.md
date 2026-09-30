# Análisis FASE 1 — Design System LuxuryApp (ERP Premium · Deep Navy)

**Documento base analizado:** `client/angular/src/styles/DESIGN.md`
**Implementación contrastada:** tokens reales (`core/_*.scss`, `theme/_variables.scss`, `theme/mypreset.ts`, `base/_dark-mode.scss`, `styles.scss`, `app.config.ts`, `index.html`, `package.json`, `angular.json`)
**Fecha:** 2026-08-01

> **Metodología:** se evaluó el documento de diseño contra la implementación real del repositorio (no solo contra lo escrito). Los ratios de contraste se calcularon numéricamente (WCAG 2.x, fórrmula de luminancia relativa). Referencias a archivo:línea.

---

## 1. Resumen Ejecutivo

El DS `ERP Premium · Deep Navy` tiene una base cromática sólida y de marca (navy #1B365D con acento oro), una escala de neutros fríos coherente y un modo oscuro con buen contraste. **Su punto débil está en la gobernanza de tokens y la accesibilidad de acentos y estados:** hay tres sistemas tipográficos en competencia, dos nomenclaturas de spacing, escalas de sombra duplicadas, la fuente declarada (Inter) no se carga y las cargadas (Outfit/EB Garamond) no se usan, y varias combinaciones de color de texto fallan WCAG AA. El dark mode es fuerte en contraste (todo AAA), pero se logra con `unlayered CSS + !important` en vez de `@layer`.

### Puntuación por categoría (1–10)

| Categoría | Puntaje | Comentario corto |
|---|---|---|
| Color / Paleta | **7.5** | Brand sólido; acentos fallan AA como texto; sin OKLCH/P3 |
| Modo claro | **7** | Jerarquía buena; texto terciario/muted bajo contraste |
| Modo oscuro | **8** | Contraste excelente (AAA); superficies duales navy vs zinc |
| Accesibilidad | **4.5** | `user-scalable=no`, focus ring <3:1, acentos <4.5:1 |
| Tipografía | **5** | Triple sistema de tokens; fuente real ≠ documentada; escala no modular |
| Tokens de diseño | **5** | Duplicación de nomenclaturas; rule doc ≠ código |
| Ionic 8 | **7** | Mapeo `--ion-*` presente; modo definido solo como `"ios"` |
| Responsive / Mobile | **5.5** | Breakpoints definidos; sin container queries; touch 44px no garantizado |
| Motion | **5** | Tokens existen; sin `prefers-reduced-motion` |
| Performance / Bundle | **6** | Fuentes sin uso cargadas; splash hardcodeado; sin budgets CI |
| Gobernanza | **5.5** | Auditorías script existen; migración/deprecación sin definir |

**Puntuación global ponderada (a11y > consistencia > brand > perf > gobernanza): ~5.6/10** → *No aprobado para producción sin remediación.*

---

## 2. Matriz de Hallazgos

| # | Categoría | Hallazgo | Severidad | Esfuerzo | Recomendación | Referencia |
|---|---|---|---|---|---|---|
| 1 | A11y Mobile | `user-scalable=no, maximum-scale=1.0` bloquea zoom → viola 1.4.4 (200% text) y 1.4.10 Reflow | **Crítico** | S | Quitar `maximum-scale`/`user-scalable` | `index.html:12-14` |
| 2 | A11y Contraste | Acentos (gold `#D4A74A`, emerald `#1E9B6D`, crimson `#D34B4B`, cyan `#4A90E2`) sobre blanco: 2.23–4.31:1 → fallan AA para texto normal (4.5:1). Botones de color con texto blanco a 14px fallan | **Alto** | M | Oscurecer variantes de texto (600→700/800) o reservar acentos a texto grande/no-texto; validar en botones | `DESIGN.md:187-199`, `_colors.scss:69,82,94` |
| 3 | A11y Focus | `*:focus-visible { outline:none !important; box-shadow: var(--ds-shadow-focus) }` con anillo 30-40% opacidad = **1.37–2.41:1** (<3:1 de 1.4.11). Depende de cambio de borde | **Alto** | S | Anillo sólido 2px `--p-focus-ring` ≥3:1; no eliminar `outline` globalmente | `styles.scss:160-163`, `_shadows.scss:23-25`, `_variables.scss:442` |
| 4 | Tokens / Gobernanza | **Fragmentación de tokens**: spacing doc `--ds-space-*` vs impl `--ds-spacing-*`; sombras doc `--ds-shadow-1..4` vs impl `--ds-shadow-xs..2xl`; tipografía en 3 sistemas | **Alto** | L | Unificar a 1 nomenclatura (CTI) y 1 fuente de verdad; actualizar `design-tokens-rule.md` | `design-tokens-rule.md:129-174`, `_variables.scss:116-125,436-442` |
| 5 | Tipografía | Diseño declara **Inter** (`DESIGN.md:52`); impl carga **Outfit+EB Garamond** (`index.html:47-55`) que no se usan; `--ds-font-family-base` (Inter) no está cargada → el brand font real es fallback del sistema | **Alto** | S | Self-host variable font única (ej. Outfit), wire a `--ds-font-family-base`, subset latin-ext, quitar fuentes sin uso | `index.html:44-55`, `_variables.scss:399-401` |
| 6 | Tokens / Consistencia | `--primary-500` en `_variables.scss` = `#4A90E2` (cyan) pero `mypreset.ts` `primary.500` = `#1B365D` (navy); `--ds-tertiary = --info-500 = --primary-500` → mismo nombre, dos significados según fuente | **Alto** | S | Reconciliar escala semántica 500; `--primary-500` debe ser navy base en ambas fuentes | `_variables.scss:33`, `mypreset.ts:16` |
| 8 | CSS Architecture | No existe `@layer reset, tokens, base, components, utilities, overrides`; dark mode gana por **unlayered** + `!important` (varios en `styles.scss`) | **Medio** | M | Adoptar `@layer`; mover `_dark-mode.scss` a layer `overrides` | `app.config.ts:73-76`, `_dark-mode.scss:7-9`, `styles.scss:130-133` |
| 9 | A11y Contraste | `on-surface-tertiary #9AACBB` documentado como texto = **2.34:1** FAIL; la "corrección AA" del preset `#708599` = 3.82 sigue <4.5 | **Medio** | S | Usar `neutral-500`+ para texto terciario normal o relegarlo a no-texto | `DESIGN.md:212-213`, `mypreset.ts:32,48` |
| 10 | A11y | `--ds-text-muted #75899C` (3.61) y `--ds-text-disabled #9AACBB/#C5D0DB` (2.34/1.56) usados como texto secundario/placeholder → fallan AA | **Medio** | S | Muted ≥ neutral-600 o ampliar a ≥4.5; placeholders también aplican 1.4.3 | `_variables.scss:393,395`, `_colors.scss:154,156` |
| 11 | A11y Motion | Sin bloque `@media (prefers-reduced-motion: reduce)` → 0ms; animaciones (`ds-spin`, skeleton, glow) ignoran la preferencia | **Medio** | S | Redefinir `--ds-motion-duration-*` a 0ms + pausar animaciones | `_variables.scss:132-138`, `styles.scss:145-157` |
| 12 | A11y HC | `prefers-contrast: more` solo pisa 6-7 tokens; no cubre surfaces/on-surface-variant/estados | **Medio** | M | Token `--contrast-*` dedicado por rol, no valores sueltos | `_variables.scss:447-457,647-657` |
| 13 | Stack | **SSR/Hydration y View Transitions NO configurados** (sin targets `server`/`ssr` en `angular.json`; sin `document.startViewTransition`) pese al stack objetivo | **Medio** | L | Plan de SSR (hidratación + tokens en `<head>`) y View Transitions en router | `angular.json` |
| 14 | Tipografía | Escala no modular (48→40→32→24→20→18→16→14→13→12→10 = ratios 0.83/0.80/0.75…) y tamaños móvil 13-14px body, 10px label (<16px recomendado) | **Medio** | M | Escala única rem + `clamp()`; body móvil ≥16px | `DESIGN.md:55-121`, `styles.scss:19-32` |
| 15 | Responsive | Breakpoints definidos pero sin **container queries**; layout depende de media queries globales/PrimeFlex | **Medio** | L | `@container` en componentes reutilizables | `_variables.scss:127-130` |
| 16 | Mobile Touch | Tamaño de objetivo táctil **44×44px (WCAG 2.5.8)** no garantizado ni documentado para componentes web | **Medio** | M | Token `--ds-target-size` y audit de controles | `ui-mobile-rules.md` |
| 18 | Docs | Claims de contraste imprecisos: navy/blanco real **12.12:1** (doc 9.5) y oro/navy real **5.44:1** (doc 6.8) | **Bajo** | S | Corregir valores con calculadora oficial | `DESIGN.md:183,198` |
| 19 | Gamut | Sin **OKLCH/Display-P3** para gradientes/brand en pantallas modernas | **Bajo** | M | Tokens secundarios `--p3-primary-*` + `color()` con fallback sRGB | `_colors.scss` |
| 20 | Perf | Fuentes Google Fonts cargadas y **no usadas** (~peso Outfit 100–900); splash en `index.html` con colores hardcodeados (`#0b3164`, `#e2e8f0`) | **Bajo** | S | Mover splash a tokens inline o componente; self-host variable font con subset | `index.html:44-80` |

---

## 3. Auditoría de Contraste Completa (WCAG 2.x)

Verde = cumple · Rojo = falla. Umbrales: AA texto 4.5:1 / AAA 7:1 / AA texto grande y no-texto 3:1.

### 3.1 Modo claro

| Fg | Bg | Ratio | AA normal | AA grande / UI (3:1) | Uso documentado |
|---|---|---|---|---|---|
| `#1A2634` (on-surface) | `#F8F9FC` | 14.55 | ✅ AAA | ✅ | Texto principal |
| `#1A2634` (on-surface) | `#FFFFFF` | 15.32 | ✅ AAA | ✅ | Texto en tarjetas |
| `#5A6878` (secondary) | `#FFFFFF` | 5.70 | ✅ AA | ✅ | Texto secundario |
| `#9AACBB` (tertiary) | `#FFFFFF` | **2.34** | ❌ | ❌ | Texto terciario (no esencial) |
| `#708599` (corrección preset) | `#FFFFFF` | 3.82 | ❌ | ✅ | Texto terciario corregido |
| `#FFFFFF` | `#1B365D` (navy) | 12.12 | ✅ AAA | ✅ | Botón primario |
| `#D4A74A` (oro) | `#1B365D` (navy) | 5.44 | ✅ AA | ✅ | Acento premium |
| `#D4A74A` (oro) | `#FFFFFF` | **2.23** | ❌ | ❌ | Texto oro sobre blanco |
| `#1E9B6D` (esmeralda) | `#FFFFFF` | **3.52** | ❌ | ✅ | Texto blanco en botón success |
| `#D34B4B` (carmesí) | `#FFFFFF` | **4.31** | ❌ | ✅ | Texto blanco en botón danger |
| `#4A90E2` (cian) | `#FFFFFF` | **3.29** | ❌ | ✅ | Links / botón info |
| `#D4A74A` (oro) | `#F8F9FC` | 2.12 | ❌ | ❌ | Acento sobre surface |
| `#75899C` (muted) | `#FFFFFF` | 3.61 | ❌ | ✅ | Placeholders / muted |
| `#9AACBB` (disabled) | `#FFFFFF` | 2.34 | ❌* | ❌* | Disabled (*exento si realmente deshabilitado) |
| `#E8B233` (warning-500) | `#FFFFFF` | **1.94** | ❌ | ❌ | Acento warning |
| `#D34B4B` / `#4A90E2` | `#FDE8E8` / `#E8EEF6` (containers) | 3.67 / 3.89 | ❌ | ✅ | Badges de estado |
| `#D4A74A` | `#FCF3E0` (warning container) | **2.02** | ❌ | ❌ | Badge warning |
| `#FFFFFF` | `#0B3164` (auth) | 12.82 | ✅ AAA | ✅ | Panel auth |
| `#E2E8F0` (outline) | `#FFFFFF` | **1.23** | — | ❌ | Borde de inputs (1.4.11) |
| `#C5D0DB` (outline-strong) | `#FFFFFF` | **1.56** | — | ❌ | Borde activo (1.4.11) |
| Anillo focus (30–40% opacidad) | `#FFFFFF`/`#F8F9FC` | **1.37–2.41** | — | ❌ | Focus ring (1.4.11 / 2.4.7) |
| `#4A90E2` (border focus) | `#FFFFFF` | 3.29 | — | ✅ | Borde en foco (única señal que pasa) |

### 3.2 Modo oscuro

| Fg | Bg | Ratio | Resultado |
|---|---|---|---|
| `#E8EEF6` (on-surface) | `#050A11` (primary-950) | 17.01 | ✅ AAA |
| `#A6C2E3` (on-surface-variant) | `#050A11` | 10.82 | ✅ AAA |
| `#C5D0DB` (muted dark) | `#050A11` | 12.68 | ✅ AAA |
| `#5A6878` (disabled dark) | `#050A11` | 3.48 | ✅ (AA grande) |
| `#0A1422` (on-primary) | `#D1DEF0` (primary-200) | 13.57 | ✅ AAA |
| `#8CE3C1` / `#F3D58A` / `#F5A3A3` (success/warning/danger) | `#050A11` | 13.1 / 13.9 / 10.1 | ✅ AAA |
| `#C2DBF6` (oro dark) | `#12243D` | 10.97 | ✅ AAA |
| `#FFFFFF` | `#121212` (surface zinc preset) | 18.73 | ✅ AAA |
| `#A1B1C2` (text-secondary preset) | `#121212` | 8.55 | ✅ AAA |
| `#12243D` / `#1B365D` (borde dark) | `#050A11` | **1.27 / 1.64** | ❌ no-texto 1.4.11 |

**Conclusión:** el modo oscuro cumple sobradamente en texto; el fallo de no-texto en bordes dark es menor (los componentes ya usan superficie separadora). El modo claro concentra los incumplimientos (acentos, texto terciario/muted, bordes, focus).

---

## 4. Inventario de Tokens (catálogo crítico)

| Token | Light | Dark | Uso semántico | Estado |
|---|---|---|---|---|
| `--ds-primary` | `#1B365D` (700) | `#D1DEF0` (200) | Acción principal | ✅ 12.1:1 |
| `--ds-on-primary` | `#FFFFFF` | `#0A1422` (900) | Texto sobre primary | ✅ |
| `--ds-primary-container` | `#E8EEF6` (100) | `#12243D` (800) | Superficies seleccionadas | ✅ |
| `--ds-secondary` | `#D4A74A` (oro) | `#C5D0DB` (200) | Acento premium — ⚠️ como texto falla | ❌ light |
| `--ds-tertiary` | `#4A90E2` | `#C2DBF6` | Acento cian — ⚠️ 3.29:1 como texto | ❌ light |
| `--ds-error` | `#D34B4B` | `#F5A3A3` | Errores — ⚠️ 4.31:1 texto | ❌ light |
| `--ds-success` | `#1E9B6D` | `#8CE3C1` | Éxito — ⚠️ 3.52:1 texto | ❌ light |
| `--ds-warning` | `#D4A74A` | `#F3D58A` | Advertencia — ❌ 2.23:1 texto | ❌ light |
| `--ds-surface / -container-*` | `#F8F9FC…#C5D0DB` | `#050A11…#12243D` (navy) | Jerarquía de superficies M3 | ⚠️ vs zinc preset |
| `--ds-text-primary / secondary / muted` | `#1A2634 / #5A6878 / #75899C` | `#E8EEF6 / #A6C2E3 / #C5D0DB` | Texto — muted 3.61 light | ⚠️ muted |
| `--ds-text-disabled` | `#9AACBB` | `#5A6878` | Deshabilitado | exento |
| `--ds-border / -strong` | `#E2E8F0 / #C5D0DB` | `#12243D / #1B365D` | Bordes/dividers — 1.4.11 ❌ light | ❌ light |
| `--ds-shadow-xs…2xl` | rgba negro 5-25% | rgba negro 30-70% | Elevación | ✅ |
| `--ds-shadow-focus` | primary-500 30% | primary-200 30% | Focus ring — <3:1 | ❌ |
| `--ds-radius-xs…full` | 4/6/8/12/16/9999px | igual | Radius | ✅ |
| `--ds-motion-duration-fast/normal/slow` | 150/250/350ms | igual | Movimiento — sin `reduce` | ⚠️ |
| `--ds-motion-easing-standard` | cubic-bezier(0.4,0,0.2,1) | igual | Easing | ✅ |
| `--ds-spacing-1..16` (4px base) | 4…64px | igual | Espaciado — **nombre difiere del doc `--ds-space-*`** | ⚠️ |
| `--ion-color-primary` | `#1B365D` | `#D1DEF0` | Ionic | ✅ |
| `--contrast-0/500/900` | `#FFF/#1A2634/#0D141C` | igual | HC mode — uso parcial | ⚠️ |

**Tipografía (3 sistemas en competencia):** `--ds-text-*` (rem, `styles.scss:19-32`), `--ds-font-size-*` (clamp, `_variables.scss:402-411`), `$font-size-*` (SCSS, `_typography.scss:16-25`), además de los tokens `--font-size-*` referidos en `design-tokens-rule.md` que **no existen** en código.

---


| Categoría | Componentes | Estado DS | Notas |
|---|---|---|---|
| **Form** | InputText, FloatLabel, Select, MultiSelect, Dropdown, Calendar, ColorPicker, InputMask, InputNumber, InputSwitch, InputTextarea, KeyFilter, Knob, Listbox, Password, RadioButton, Rating, SelectButton, Slider, ToggleButton, TriStateCheckbox | 🟡 | Input/Select/Dropdown/Password con override (`web/_prime-input.scss`, `_dark-mode.scss:441-454`); resto sin tratamiento; FloatLabel no documentado |
| **Button** | Button, SplitButton, SpeedDial, Dropdown (button) | 🟡 | `web/_prime-button.scss`; SplitButton/SpeedDial sin estilos |
| **Data** | Table, DataView, Listbox, OrderList, PickList, Tree, TreeTable, VirtualScroller | 🟡 | Table con override + dark (`_prime-table.scss`, `_dark-mode.scss:281-322`); VirtualScroller/perf no cubierto |
| **Panel** | Accordion, Card, Divider, Fieldset, Panel, Splitter, ScrollPanel, TabView, Toolbar | 🟡 | Card/Panel/Fieldset/TabView/Accordion en dark; Splitter/ScrollPanel/Toolbar sin |
| **Overlay** | Dialog, Sidebar, OverlayPanel, Tooltip, Popover, ConfirmDialog, DynamicDialog | 🟡 | Dialog override (`_prime-dialog.scss`) + `styles.scss:130-133` con `!important`; focus trap/ARIA no verificado |
| **Menu** | Menu, TieredMenu, SlideMenu, Steps, BreadCrumb, ContextMenu, Dock, MegaMenu, Menubar | 🔴 | Sin tratamiento DS; keyboard nav/RTL no documentado |
| **Message** | Messages, Toast, InlineMessage, ProgressBar, ProgressSpinner, Skeleton | 🟡 | Message override (`_prime-message.scss`); Toast/Skeleton en dark; states a11y no verificado |
| **File** | FileUpload, Uploader | 🔴 | Sin tratamiento (drag-drop/2.5.7 sin alternativa) |
| **Chart** | Chart (Chart.js/echarts) | 🔴 | Wrapper echarts externo; no tokenizado |
| **Misc** | Avatar, Badge, BlockUI, Captcha, Chip, Divider, FocusTrap, Image, ScrollTop, Separator, Spinner, Tag, Terminal, Timeline | 🟡 | Tag/Chip/Image parcial; resto sin |

**Estados:** solo `default/hover/focus/disabled` parciales (con `:focus-visible` global). **Variantes:** `primary/secondary/success/warning/danger` a nivel de token, no por componente. **Unstyled mode:** no usado (Aura preset); sin hooks `use*` documentados.

---

## 6. Recomendaciones Priorizadas (Impacto × Esfuerzo)

| Prioridad | Acción | Impacto | Esfuerzo | Cuándo |
|---|---|---|---|---|
| P0 | Quitar `user-scalable=no` (1.4.4/1.4.10) | Alto | S | Inmediato |
| P0 | Unificar sistema de tokens (1 nomenclatura CTI + 1 fuente de verdad; reconciliar `--primary-500`, spacing, shadows, tipografía) | Alto | L | FASE 2.0 |
| P1 | Corregir acentos para texto AA (variantes 700/800) y re-validar botones de color | Alto | M | FASE 2.0 |
| P1 | Focus ring ≥3:1 (2px sólido) sin `outline:none !important` | Alto | S | Inmediato |
| P1 | Self-host variable font única; eliminar fuentes no usadas | Medio | S | FASE 2.0 |
| P2 | `@layer` completo + `prefers-reduced-motion` + HC mode completo | Medio | M | FASE 2.1 |
| P2 | Alinear preset dark surface a escala navy (eliminar parches por componente) | Medio | M | FASE 2.1 |
| P3 | SSR/Hydration + View Transitions (plan) | Medio | L | FASE 2.2 |
| P4 | OKLCH/P3, claims de contraste corregidos, budgets CI | Bajo | S/M | Continuo |

**RICE FASE 2.0 (arranque):** tokens unificados (Reach alto / Confidence alta / Effort medio) > contraste acentos > focus > fonts.

---

## 7. Checklist de Cumplimiento

- [x] **Atomic design / layers:** base + componentes web/mobile/custom definidos (sin `@layer` explícito)
- [x] **Tokenización de colores:** `_colors.scss` como fuente única — ⚠️ parcial (hardcodes en `styles.scss:72-74`, `index.html:72-74`)
- [x] **Tipografía tokenizada:** ⚠️ triple sistema, token doc inexistente
- [x] **Dark mode:** ✅ con mapeo 1:1 de semánticos; ⚠️ superficies duales; ✅ sin `#000` puro (usa `#050A11`)
- [x] **Documentación:** `DESIGN.md` + `design-tokens-rule.md` + `estandar-hoja-estilos.md`; ⚠️ desalineados con código
- [x] **Testing:** Vitest + Storybook + a11y addon presentes; ❌ sin Chromatic/Percy ni axe en CI configurados
- [x] **A11y:** skip-link ✅; ❌ zoom, ❌ focus, ❌ contraste acentos
- [x] **Performance:** ⚠️ sin budgets en CI; fuentes sin uso; `zone.js` aún en deps (innecesario con zoneless)
- [x] **SSR/Hydration:** ❌ no configurado
- [x] **Gobernanza:** auditorías script (`audit:tokens`, `audit:design`) ✅; ❌ versioning/deprecation/migración semver

---

## 8. FODA

| | Positivo | Negativo |
|---|---|---|

---

## 9. Especificación de Design Tokens (JSON + CSS, Figma-ready)

Fragmento recomendado (unificado a CTI) — **aplicar en FASE 2.0**:

```json
{
  "color": {
    "primary":  { "500": "#1B365D", "600": "#2A4D7C", "700": "#12243D", "container": "#E8EEF6" },
    "accent":   { "gold": "#D4A74A", "goldText": "#7A5E15", "cyan": "#4A90E2", "cyanText": "#245FA1" },
    "surface":  { "page": "#F8F9FC", "card": "#FFFFFF", "elev1": "#FFFFFF", "overlay": "rgba(27,54,93,.45)" },
    "text":     { "primary": "#1A2634", "secondary": "#5A6878", "muted": "#5A6878", "tertiary": "#75899C" },
    "state":    { "success": "#157A55", "warning": "#A88132", "danger": "#A63939", "info": "#245FA1" },
    "border":   { "default": "#C5D0DB", "strong": "#9AACBB", "focus": "#1B365D" }
  },
  "type": { "family": "Outfit", "display": "clamp(2rem,5vw,3rem)", "body": "1rem", "label": "0.875rem", "ratio": 1.25 },
  "spacing": { "xs": "4px", "sm": "8px", "md": "12px", "lg": "16px", "xl": "24px", "2xl": "32px", "3xl": "48px" },
  "radius": { "xs": "4px", "md": "8px", "lg": "12px", "full": "9999px" },
  "shadow": { "1": "0 1px 2px rgba(27,54,93,.06)", "2": "0 2px 8px rgba(27,54,93,.08)", "3": "0 4px 16px rgba(27,54,93,.10)" },
  "motion": { "duration": { "fast": "100ms", "normal": "200ms", "slow": "300ms" }, "easing": "cubic-bezier(0.25,0.46,0.45,0.94)" }
}
```

```css
@layer tokens {
  :root, [data-theme="light"] {
    --ds-primary-500: #1B365D;  --ds-on-primary: #FFFFFF;
    --ds-accent-gold: #D4A74A;  --ds-accent-gold-text: #7A5E15;
    --ds-surface-page: #F8F9FC; --ds-surface-card: #FFFFFF;
    --ds-text-muted: #5A6878;   --ds-border-default: #C5D0DB;
    --ds-focus-ring: 0 0 0 2px #1B365D;
  }
  [data-theme="dark"] {
    --ds-primary-500: #D1DEF0;  --ds-on-primary: #0A1422;
    --ds-surface-page: #050A11; --ds-surface-card: #12243D;
    --ds-text-muted: #C5D0DB;
  }
}
```

> Sincronización: exportar desde `core/_*.scss` → `theme/_variables.scss` → `mypreset.ts` → `design-tokens.d.ts` con un solo build script (hoy existen audit scripts pero no generación).

---

## 10. Component API Reference (auto-generable)

Estado: Storybook configurado (`storybook` target) con `@storybook/angular-vite` + addon-docs + a11y. **No hay** `argTypes` generados desde tokens, ni `ComponentHarness`, ni TypeDoc. Recomendación: habilitar auto-docs de tokens (JSDoc sobre `design-tokens.d.ts`) y harnesses CDK para los componentes de `shared/ui`.

---

## 11. Guía de Migración (estado)

| Ruta | Estado | Acción |
|---|---|---|
| Angular 17/18 → 22 | ✅ zoneless activo (`app.config.ts:85`) | remover `zone.js` y `provideAnimationsAsync` (`:108`) cuando se migre a CSS-only |
| Ionic 7/8 | ✅ standalone + `--ion-*` | definir selectores por feature, no solo `mode:"ios"` |
| Theming → tokens | ⚠️ doble nomenclatura | aplicar §9 (romper en una minor) |
| Dark surfaces | ⚠️ dual navy/zinc | alinear preset al DS |

---

## 12. Performance Budget Report

| Métrica | Objetivo | Estado |
|---|---|---|
| LCP | <2.5s | ⚠️ fuentes CDN no usadas + splash; sin medición CI |
| CLS | <0.1 | ⚠️ splash inline y fuentes `display=swap`; sin verificación |
| INP | <200ms | ⚠️ zoneless ayuda; sin métricas |
| TBT | <150ms | ⚠️ sin budget en `angular.json` |
| Tokens CSS | <5KB gzipped | ⚠️ `_variables.scss` (~700 líneas) + preset generan más; medir |
| Component CSS | <2KB c/u | ⚠️ `_dark-mode.scss` parchea 15 componentes; migrar a preset |
| Bundle | — | `zone.js` removible; fuentes no usadas a eliminar; `@defer` no usado en rutas pesadas |

---

## 13. Accessibility Conformance Report (WCAG 2.2)

| Criterio | Nivel | Estado | Nota |
|---|---|---|---|
| 1.4.3 Contrast (Min) | AA | ❌ | Acentos/muted/tertiary (§3.1) |
| 1.4.4 Resize Text 200% | AA | ❌ | `user-scalable=no` |
| 1.4.6 Contrast Enhanced | AAA | ❌ | Objetivo AA realista; solo navy/blanco lo logra |
| 1.4.10 Reflow | AA | ❌ | Bloqueado por zoom + sin container queries |
| 1.4.11 Non-text Contrast | AA | ❌ | Bordes 1.23-1.56:1; focus <3:1 |
| 2.4.1 Skip Link | A | ✅ | `index.html:69` |
| 2.4.7 Focus Visible | AA | ❌ | Anillo ≤2.41:1 (salvo borde 3.29) |
| 2.4.11 Focus Not Obscured | AA | ⚠️ | Sticky topbar sin `scroll-padding` verificado |
| 2.5.7 Dragging Movements | AA | ⚠️ | `ngx-drag-drop` presente; alternativa no documentada |
| 2.5.8 Target Size | AA | ❌ | No garantizado 44×44 |
| 3.2.6 / 3.3.7 / 3.3.8 | A/AA | ⚠️ | Sin evidencia; validación manual pendiente |
| prefers-contrast / reduced-motion | — | ❌ | Parcial / ausente |

**VPAT-ready:** no aún. Requiere cerrar §3.1 + focus + zoom.

---

## 14. Browser Support Matrix

| Navegador | Estado |
|---|---|
| Chrome 120+ / Edge 120+ | ✅ target |
| Firefox 120+ | ✅ target |
| Safari 17+ / iOS Safari 17+ | ✅ target (fuentes CDN + `color-mix` ok) |
| P3 / wide-gamut | ⚠️ sin tokens OKLCH/P3 |
| Capacitor WebView | ⚠️ `mode:"ios"` único; Android con estilos iOS |
| **SSR/evergreen** | ❌ SSR no configurado |

---

## 15. Design System Governance Charter (propuesto)

- **SemVer estricto** (MAJOR/MINOR/PATCH) y cadencia minor trimestral; **deprecación 2 majors**.
- **RFC:** Propuesta → Design + Eng + A11y review → aprobación Tech Lead (alineado a `CONVENTIONS.md §7`).
- **Gates CI:** `audit:tokens`, `audit:design`, axe-core 0 violaciones AA, contrast checks automáticos, budgets bundle, visual regression (Chromatic/Percy pendiente de configurar).
- **Canal de tokens:** `_colors.scss` → `_variables.scss` → `mypreset.ts` → `.d.ts` con 1 script de sincronización.
- **Reflejo obligatorio:** cambios a tokens deben actualizar `CONVENTIONS.md`, `design-tokens-rule.md`, `styles-tokens-theming.md`, `DESIGN.md` y el `conventions-viewer` (regla 10 universal).

---

## 16. Próximos Pasos (FASE 2)

1. **FASE 2.0 (bloqueante):** unificar tokens (nomenclatura, `--primary-500`, spacing, shadows, tipografía) + contraste de acentos + focus ring ≥3:1 + quitar zoom lock + fuente real (self-host variable).
2. **FASE 2.1:** `@layer` completo, `prefers-reduced-motion`, HC mode completo, alinear preset dark surfaces navy, eliminar `!important`.
3. **FASE 2.2:** plan SSR/Hydration (tokens en `<head>`, `ngSkipHydration` selectivo) y View Transitions; budgets y axe en CI.
5. **FASE 2.4:** OKLCH/Display-P3, theming multi-brand (luxury-app.com vs luxurybuildingapp.com), RTL/i18n, iconografía SVG tree-shakeable.

---

*Reporte generado por auditoría FASE 1 · Basado en `DESIGN.md` + implementación real del repositorio. Los ratios de contraste son cálculos numéricos WCAG 2.x (puede variar ±0.05 por redondeo).*
