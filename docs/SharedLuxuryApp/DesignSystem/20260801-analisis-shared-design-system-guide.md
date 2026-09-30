# ROL


# CONTEXTO

Se te proporcionará el documento **"Luxury Design System & Guide"** que contiene la propuesta completa de colores, tipografía, tokens, componentes y su aplicación. Este design system será la base de una plataforma empresarial con dos dominios:

- **luxury-app.com** (información pública, marketing, landing)
- **luxurybuildingapp.com** (aplicación funcional, portal de residentes/admin/guardias)

Stack técnico objetivo:
- **Frontend Móvil**: Ionic 8 (Standalone, Capacitor 6, CSS Custom Properties theming), Angular 22
- **Backend**: .NET 10, EF Core 10, Minimal APIs
- **SSR/Hydration**: Angular Universal con hydration activada
- **View Transitions**: Para navegación SPA sin flash
- **Testing**: Vitest + Testing Library + Playwright + Chromatic/Percy (visual regression) + axe-core (a11y)

# OBJETIVO

Realizar un **análisis exhaustivo, técnico y accionable (FASE 1)** de la propuesta de diseño, evaluando su coherencia visual, arquitectura técnica de implementación, accesibilidad real (WCAG 2.2 AA/AAA), performance, escalabilidad y gobernanza en todos los contextos de uso.

# ALCANCE DEL ANÁLISIS

---

## 1. ANÁLISIS DE COLOR

### 1.1 Paleta de Colores
- Identificación de colores primarios, secundarios, terciarios, neutros y de acento.
- Análisis de la armonía cromática y coherencia con la identidad "luxury".
- Verificación de la consistencia entre la paleta pública (luxury-app.com) y la de la aplicación (luxurybuildingapp.com).
- **Gamut amplio**: Verificar si la paleta define colores en **OKLCH / Display-P3** además de sRGB, para gradientes y brand en pantallas modernas.

### 1.2 Modo Claro (Light Mode)
- Revisión de los valores de color asignados al tema claro.
- Evaluación de la legibilidad sobre fondos claros.
- Análisis de la jerarquía visual y contraste.

### 1.3 Modo Oscuro (Dark Mode)
- Revisión de los valores de color asignados al tema oscuro.
- Verificación de que no se usen colores saturados que causen fatiga visual (evitar #000 puro, usar --surface-950).
- Evaluación de la profundidad y elevación (surfaces, overlays, elevation tokens).
- Confirmación de que existe un **mapeo 1:1 de tokens semánticos** entre modo claro y oscuro (no valores hardcodeados).

### 1.4 Accesibilidad (WCAG 2.2 AA/AAA)
- Cálculo de ratios de contraste para texto normal (mínimo 4.5:1 AA, 7:1 AAA) y texto grande (mínimo 3:1 AA, 4.5:1 AAA).
- Identificación de combinaciones de color que fallen en accesibilidad.
- Análisis del uso del color como único medio para transmitir información (daltonismo: protanopia, deuteranopia, tritanopia).
- **Nuevos criterios WCAG 2.2**:
  - 2.4.11 Focus Not Obscured (Minimum) - Focus visible no ocultado
  - 2.4.12 Focus Not Obscured (Enhanced) - Focus completamente visible
  - 2.5.7 Dragging Movements - Alternativa a drag-drop
  - 2.5.8 Target Size (Minimum) - 44x44px MÍNIMO
  - 3.2.6 Consistent Help - Ayuda consistente
  - 3.3.7 Redundant Entry - No re-ingresar datos
  - 3.3.8 Accessible Authentication - Autenticación accesible

### 1.5 Semántica del Color
- Revisión de colores de estado: éxito, error, advertencia, información.
- Coherencia semántica entre modo claro y oscuro.
- **High Contrast Mode**: Soporte `prefers-contrast: more` con tokens dedicados.

---

## 2. ANÁLISIS DE TIPOGRAFÍA

### 2.1 Familias Tipográficas
- Identificación de la(s) familia(s) tipográfica(s) seleccionada(s).
- Justificación de la elección en el contexto "luxury".
- Compatibilidad y disponibilidad (web fonts, licencias, self-hosting).
- **Variable Fonts**: Verificar uso de `font-variation-settings` para peso/eje óptico.

### 2.2 Escala Tipográfica (Type Scale)
- Revisión de la escala definida (display-1..4, heading-1..6, body-lg/md/sm, caption, overline).
- Análisis de la proporción matemática utilizada (major third 1.25, perfect fourth 1.333, golden ratio 1.618).
- Consistencia de la escala entre breakpoints (fluid typography con `clamp()`).

### 2.3 Jerarquía y Legibilidad
- Evaluación de la diferenciación visual entre niveles.
- Análisis de interlineado (line-height), espaciado entre letras (letter-spacing) y longitud de línea (max 65-75ch).
- Legibilidad en tamaños pequeños para dispositivos móviles (mín 16px body).

### 2.4 Responsive Typography
- Verificación de cómo se adapta la tipografía en móvil, tablet y desktop.
- Uso de **unidades relativas (rem, em, clamp())** vs. absolutas (px).
- **Fluid type**: `clamp(1rem, 0.875rem + 0.5vw, 1.25rem)` pattern.

### 2.5 Pesos y Estilos
- Revisión de los pesos tipográficos definidos (light 300, regular 400, medium 500, semibold 600, bold 700).
- Coherencia en el uso de italic, uppercase, small-caps.
- **Font-display**: `swap` con fallback system-ui stack.

---

## 3. ANÁLISIS DE APLICACIÓN Y COMPONENTES

### 3.1 Tokens de Diseño (Design Tokens como Código)
- **Formato de exportación**: JSON (Style Dictionary / Figma Tokens), CSS Custom Properties, TypeScript types.
- **Estructura**: `color`, `spacing`, `typography`, `borderRadius`, `shadow`, `motion`, `zIndex`, `breakpoints`, `opacity`, `fontFamily`, `fontWeight`, `lineHeight`, `letterSpacing`, `sizing`, `transition`.
- **Nombrado**: CTI (Category-Type-Item) o BEM-like: `color-primary-500`, `spacing-md`, `fontSize-heading-1`, `shadow-elevation-2`.
- **Compatibilidad Ionic 8**: Mapeo directo a `--ion-color-*` (ej. `--ion-color-primary`, `--ion-background-color`).
- **TypeScript types**: Generación automática de `DesignToken` types para type-safety en componentes.
- **Agnósticos al contexto**: Tokens NO hardcodeados a componentes específicos.

- **Angular 22 Signals API**: `input()`, `output()`, `model()`, `signal()`, `computed()`, `linkedSignal()`, `resource()`, `effect()`.
- **Change Detection**: `OnPush` por defecto + Signals (compatibilidad con `provideExperimentalZonelessChangeDetection()`).
- **Host bindings para theming**: `host: { "[class.dark]": "isDark()", "[attr.data-theme]": "theme()" }`.
- **Content projection**: Typed `NgContent` selectores + `NgTemplateOutlet` + `*ngTemplateOutlet`.
- **Ionic integration**: Standalone components + CSS Custom Properties override + `AnimationController`.
- **Lazy loading**: `@defer (on viewport) { LargeComponent }` para componentes pesados (charts, editors, maps).

### 3.3 Theming Strategy (Multi-brand / Multi-theme / Runtime Switching)
- **Mecanismo**: CSS Custom Properties + `@layer` + `data-theme` attribute (`<html data-theme="luxury-dark">`).
- **Capas CSS obligatorias**: `@layer reset, tokens, base, components, utilities, overrides;`
- **Dark mode**: `prefers-color-scheme` + manual toggle + persistencia (localStorage/cookie) + sincronización cross-tab.
- **Runtime switching**: Sin recarga, **sin FOUC** (Flash of Unstyled Content) - tokens inyectados en `<head>` para SSR.
- **High contrast mode**: Soporte `prefers-contrast: more` con tokens dedicados `--contrast-*`.
- **Reduced motion**: `prefers-reduced-motion: reduce` -> durations 0ms en motion tokens.
- **Multi-brand**: Tokens de brand como layer separado (`@layer brand { --brand-primary: ... }`).

### 3.4 Motion & Animation System (CRÍTICO PARA LUXURY)
- **Easing curves**: Custom cubic-bezier para brand (ej. `cubic-bezier(0.4, 0, 0.2, 1)` Material, o custom `cubic-bezier(0.25, 0.46, 0.45, 0.94)` luxury).
- **Duration scale**: `instant (0ms) | fast (100ms) | normal (200ms) | slow (300ms) | slower (500ms)`.
- **Motion tokens**: `motion-easing-standard`, `motion-easing-emphasized`, `motion-duration-fast`, etc.
- **Reduced motion**: `prefers-reduced-motion: reduce` -> `0ms` durations automático via token.
- **View Transitions API**: Integración con `::view-transition-old/new`, `::view-transition-group`, `view-transition-name` para navegación SPA.
- **Scroll-driven animations**: `animation-timeline: scroll()` para parallax/reveal.

### 3.5 Iconography System
- **Fuente**: SVG sprite / Font subset / Individual SVG components (tree-shaking).
- **Tamaños**: `xs (12px) | sm (16px) | md (24px) | lg (32px) | xl (48px)` via `font-size` o `width/height`.
- **Estilos**: `outline | filled | sharp | two-tone` (coherencia Material 3 / Ionicons).
- **Accesibilidad**: `aria-hidden="true"` en decorativos + `role="img" aria-label="..."` en semánticos.
- **Tree-shaking**: Import individual (`import { HomeIcon } from "@luxury/icons/home"`).

- **Validation states**: `ng-invalid.ng-dirty` + DS tokens (`--ds-input-border-error`, `--ds-input-focus-ring-error`).
- **Density**: `compact | standard | comfortable` via spacing tokens (`--ds-density-compact: 0.5`).
- **Autofill styles**: Override `-webkit-autofill` con tokens DS.

---


- **CSS Variables mapping**: Tokens mapeados a `--p-primary-500`, `--p-surface-0`, `--p-content-border-radius`, `--p-focus-ring`, etc.

### 4.2 Ionic 8 + Angular 22 Integration
- **CSS Custom Properties mapping**: `--ion-color-primary` <-> DS tokens (`--ds-color-primary-500`).
- **Standalone components**: Componentes Ionic como standalone en Angular 22 (`import { IonButton } from "@ionic/angular/standalone"`).
- **SSR/Hydration**: Tokens disponibles en server-side rendering (inyectados en `index.html` `<head>`).
- **Platform detection**: `ionicPlatform` vs responsive breakpoints (container queries preferidas).
- **Gesture/animation integration**: `AnimationController` + Angular animations + DS motion tokens.
- **Safe areas**: `env(safe-area-inset-*)` integrados en spacing tokens.

### 4.3 Angular 22 Modern Patterns
- **Signal-based components**: `input()`, `output()`, `model()`, `linkedSignal()`, `resource()`, `effect()`.
- **Zoneless change detection**: Componentes compatibles con `provideExperimentalZonelessChangeDetection()`.
- **Resource API**: Data fetching declarativo en componentes de UI (`resource({ loader: () => fetchData() })`).
- **Host bindings**: Theming via `host: { "[class.dark]": "isDark()", "[attr.data-theme]": "theme()" }`.
- **Content projection patterns**: `NgContent` con selectores tipados + `NgTemplateOutlet`.
- **Control Flow**: `@if`, `@for`, `@switch`, `@defer` (no `*ngIf`/`*ngFor`).
- **Hybrid rendering**: `@defer (on viewport)`, `@defer (on interaction)`, `@defer (timer 2s)`.

### 4.4 Performance & Bundle Budgets
- **Tree-shaking**: Componentes individuales exportados (ESM), sideEffects: false en package.json.
- **Lazy loading**: `@defer` blocks para componentes pesados (charts, editors, maps, PDF viewers).
- **CSS budget**: Tokens < 5KB gzipped, Component CSS < 2KB gzipped cada uno.
- **Font loading**: `font-display: swap`, subsetting (latin-ext), preload critical fonts (`<link rel="preload" as="font" crossorigin>`).
- **Icon system**: SVG sprite / Font subset / Angular `ng-component` inline (sin font icon legacy).
- **Code splitting**: Route-level + component-level (`loadComponent: () => import(...)`).

### 4.5 SSR / Hydration / SEO
- **Token availability**: CSS vars inyectadas en `index.html` `<head>` para SSR (evita FOUC).
- **Hydration mismatch**: Prevención de FOUC en theme switching (`ngSkipHydration` selectivo).
- **Meta tags**: Open Graph / Twitter Cards / JSON-LD usando design tokens.
- **View Transitions**: `document.startViewTransition(() => router.navigate(...))` integración.

### 4.6 Developer Experience (DX)
- **Storybook 8+**: Stories con `argTypes` generados desde tokens (auto-docs).
- **Testing**: `TestBed` + `ComponentHarness` (Angular CDK) + Visual regression (Chromatic/Percy) + a11y (axe-core).
- **Linting**: ESLint rules para tokens prohibidos (`color: #fff` -> `var(--ds-white)`, `margin: 16px` -> `var(--ds-spacing-md)`).
- **IDE support**: VS Code extension / IntelliSense para tokens (CSS var autocomplete).
- **Documentation**: Auto-generada desde JSDoc + Storybook Docs + TypeDoc.

---

## 5. ANÁLISIS RESPONSIVO: WEB Y MÓVIL

### 5.1 Diseño Web (Desktop)
- Evaluación del uso del espacio horizontal (max-width containers, sidebars).
- Análisis de layouts multi-columna (CSS Grid / PrimeFlex).
- Densidad de información y jerarquía visual.
- **Container Queries**: Componentes responsivos reales (no media queries globales).

### 5.2 Diseño Móvil (Ionic 8 + Capacitor 6)
- Evaluación de la adaptación de tipografía a pantallas pequeñas (fluid type).
- Análisis de tamaños de toque (mínimo **44x44px** WCAG 2.2 2.5.8).
- Revisión de la simplificación de layouts y priorización de contenido (progressive disclosure).
- Verificación de la legibilidad en modo claro y oscuro en móvil.
- **Safe areas**: `env(safe-area-inset-top/bottom/left/right)` en spacing tokens.
- **Virtual keyboard**: `ionic-keyboard-offset` + `ion-content` keyboard handling.
- **Pull-to-refresh / Infinite scroll**: `ion-refresher` + `ion-infinite-scroll` en listados.

### 5.3 Breakpoints & Container Queries
- Identificación de los breakpoints definidos (mobile: <768, tablet: 768-1024, desktop: >1024, wide: >1440).
- **Container Queries**: `@container (min-width: 400px) { .card { grid-template-columns: 1fr 1fr; } }`.
- Evaluación de la fluidez de la transición entre breakpoints.
- **CSS Grid / Flexbox** patterns con PrimeFlex 4 utilities.

---

## 6. ANÁLISIS DE MODO CLARO VS MODO OSCURO

### 6.1 Consistencia de la Experiencia
- Verificación de que la experiencia sea equivalente en ambos modos (no pérdida de funcionalidad).
- Análisis de la transición entre modos (animaciones 200ms, easing standard, sin flash).

### 6.2 Superficies y Elevación
- Revisión de cómo se manejan las sombras en modo claro vs. bordes/iluminación en modo oscuro.
- **Elevation tokens**: `--ds-elevation-1` (shadow) <-> `--ds-elevation-1-dark` (border + lighter surface).
- Análisis de la jerarquía de profundidad en ambos modos (surface-0, surface-1, surface-2, surface-3, surface-4).

### 6.3 Imágenes e Iconografía
- Verificación de que iconos e imágenes se adapten correctamente a ambos modos.
- Análisis de opacidades y overlays (scrims).
- **SVG icons**: `currentColor` para herencia automática de color de texto.

---



| Categoría | Componentes | Estado DS | Notas Críticas |
|-----------|-------------|-----------|----------------|
| **Form** | InputText, FloatLabel, Select, MultiSelect, AutoComplete, Dropdown, Calendar, ColorPicker, InputMask, InputNumber, InputSwitch, InputTextarea, KeyFilter, Knob, Listbox, Password, RadioButton, Rating, SelectButton, Slider, ToggleButton, TriStateCheckbox | 🟢/🟡/🔴 | FloatLabel nativo, validación states |
| **Button** | Button, SplitButton, SpeedDial, Dropdown (button mode) | | Loading state, icon position |
| **Data** | Table, DataView, Listbox, OrderList, PickList, Tree, TreeTable, VirtualScroller | | **Virtual scrolling performance**, row expansion |
| **Panel** | Accordion, Card, Divider, Fieldset, Panel, Splitter, ScrollPanel, TabView, Toolbar | | Lazy tabs, splitter persistence |
| **Overlay** | Dialog, Sidebar, OverlayPanel, Tooltip, Popover, ConfirmDialog, DynamicDialog | | Focus trap, ARIA, portal |
| **Menu** | Menu, TieredMenu, SlideMenu, Steps, BreadCrumb, ContextMenu, Dock, MegaMenu, Menubar | | Keyboard nav, RTL |
| **Message** | Messages, Toast, InlineMessage, ProgressBar, ProgressSpinner, Skeleton | | Loading states, a11y |
| **File** | FileUpload, Uploader | | Drag-drop, chunked, preview |
| **Chart** | Chart (Chart.js wrapper) | | Tree-shakeable, responsive |
| **Misc** | Avatar, Badge, BlockUI, Captcha, Chip, Divider, FocusTrap, Image, ScrollTop, Separator, Spinner, Tag, Terminal, Timeline | | Skeleton loading states |

### 7.2 Estados por Componente (Mínimo Requerido)
`default | hover | active | focus | focus-visible | disabled | loading | error | invalid | readonly | skeleton`

### 7.3 Variantes por Componente
`primary | secondary | success | warning | danger | info | contrast | plain | text | outlined | rounded | raised | unelevated | tonal | soft`

- Cada componente tiene versión unstyled/headless documentada?
- Hooks de comportamiento expuestos (`useButton`, `useDialog`, `useTable`, etc.)?

---

## 8. ANÁLISIS DE ACCESIBILIDAD AVANZADA

### 8.1 WCAG 2.2 AA/AAA Compliance Matrix
| Criterio | Nivel | Implementación | Verificación |
|----------|-------|----------------|--------------|
| 1.4.3 Contrast (Minimum) | AA | Tokens semánticos | axe-core + manual |
| 1.4.6 Contrast (Enhanced) | AAA | Tokens `--ds-contrast-*` | axe-core + manual |
| 1.4.11 Non-text Contrast | AA | UI components borders | axe-core |
| 2.4.7 Focus Visible | AA | `--ds-focus-ring-*` tokens | axe-core + tab nav |
| 2.4.11 Focus Not Obscured | AA | `scroll-padding`, sticky headers | Manual |
| 2.4.12 Focus Not Obscured Enhanced | AAA | Focus totalmente visible | Manual |
| 2.5.7 Dragging Movements | AA | Alternativa click targets | Manual |
| 2.5.8 Target Size | AA | 44x44px mínimo | axe-core + manual |
| 3.2.6 Consistent Help | A | Help pattern consistente | Manual |
| 3.3.7 Redundant Entry | A | Autocomplete, prefill | Manual |
| 3.3.8 Accessible Authentication | AA | No solo cognitivo | Manual |

### 8.2 Pruebas Requeridas
- **Automatizadas**: axe-core en CI (Playwright + axe), eslint-plugin-jsx-a11y.
- **Manuales**: Navegación solo teclado, Screen readers (NVDA, JAWS, VoiceOver), Zoom 200/400%, High contrast mode, Reduced motion.

---

## 9. GOBERNANZA Y OPERACIONES DEL DESIGN SYSTEM

### 9.1 Versioning & Release Strategy
- **SemVer estricto**: MAJOR (breaking), MINOR (features), PATCH (fixes).
- **Cadencia**: Monthly patch, Quarterly minor, Annual major.
- **LTS**: 12 meses soporte para major versions.
- **Deprecation policy**: 2 major versions mínimo antes de remover.

### 9.2 Migration Tooling
- **Schematics/Codemods**: `ng generate @luxury/ds:migrate-v2` para upgrades automáticos.
- **Breaking changes guide**: Documentado por versión con ejemplos before/after.

### 9.3 Contribution & Design Review
- **RFC process**: Propuesta -> Review (Design + Eng + A11y) -> Approve -> Implement.
- **Design review gates**: Token changes -> Component changes -> Documentation -> Release.

### 9.4 Quality Gates (CI/CD)
- **Bundle size**: `webpack-bundle-analyzer` + budgets (tokens <5KB, component <2KB).
- **Visual regression**: Chromatic/Percy en PR (threshold 0.1% pixel diff).
- **Accessibility**: axe-core en CI (0 violations AA).
- **Type safety**: `strict: true`, no `any`, generated token types.
- **Token linting**: `stylelint` + custom rules (no hardcoded values).

---

## 10. ENTREGABLES ESPERADOS

El análisis debe generar un reporte estructurado en **Markdown** con:

1. **Resumen Ejecutivo**: Hallazgos principales + puntuación global (1-10) por categoría.
2. **Matriz de Hallazgos**: 
   | # | Categoría | Hallazgo | Severidad (Crítico/Alto/Medio/Bajo) | Esfuerzo (S/M/L) | Recomendación | Referencia |
3. **Auditoría de Contraste Completa**: Tabla con TODAS las combinaciones evaluadas y ratio.
4. **Inventario de Tokens**: Catálogo completo con valor light/dark, uso semántico, componentes afectados.
6. **Recomendaciones Priorizadas**: Lista ordenada por **Impacto x Esfuerzo** (matriz ICE/RICE).
7. **Checklist de Cumplimiento**: Atomic design, tokenización, documentación, testing, a11y, performance.
8. **Análisis FODA**: Fortalezas, Oportunidades, Debilidades, Amenazas.
9. **Especificación de Design Tokens** (JSON + CSS + Figma sync ready).
10. **Component API Reference** (Auto-generable: inputs, outputs, slots, CSS vars, methods, harness).
12. **Performance Budget Report** (Bundle size, LCP <2.5s, CLS <0.1, INP <200ms, TBT <150ms).
13. **Accessibility Conformance Report** (WCAG 2.2 AA + AAA targeting, VPAT-ready).
14. **Browser Support Matrix** (Evergreen + Safari 17+ + iOS Safari 17+ + Chrome 120+ + Firefox 120+ + Edge 120+).
15. **Design System Governance Charter** (RFC process, versioning, deprecation, contribution model).
16. **Próximos Pasos (FASE 2)**: Animaciones avanzadas, patrones de interacción compleja, iconografía, charts, internacionalización (RTL), theming multi-brand.

---

# FORMATO DE SALIDA

- **Lenguaje**: Español (México)
- **Tono**: Profesional, técnico, crítico pero constructivo
- **Formato**: Markdown estructurado con tablas, listas, secciones claras, bloques de código anotados
- **Incluir**: Referencias a líneas/archivos del documento analizado, capturas conceptuales cuando aplique
- **Métricas**: Cuantificar siempre (ratios, KB, ms, %, número de componentes)

---

# INSTRUCCIONES FINALES

- **Sé crítico pero constructivo**: Cada hallazgo debe tener recomendación accionable.
- **Prioriza**: Accesibilidad (legal/ético) -> Consistencia técnica (mantenibilidad) -> Consistencia visual (brand) -> Performance (UX) -> Gobernanza (escalabilidad).
- **Contexto "luxury"**: Cada evaluación debe considerar la promesa de marca (exclusividad, atención al detalle, calidad percibida).
- **Si falta información**: Indícalo claramente como hallazgo "Información faltante" con severidad según impacto.
- **No asumas**: Solo evalúa lo explícito en el documento + mejores prácticas del stack declarado.

--- 

_Este prompt está optimizado para auditoría de Design Systems en stacks empresariales modernos (2026)._
