Ruta: 📂 docs > 🤝 SharedLuxuryApp > 🎨 DesignSystem

> 📅 Fecha: 2026-10-02
> 🛡️ Estado: **AUDITORÍA VERIFICADA — solo lectura, no se modificó código.**
> 🔎 Verifica la propuesta `20261002-propuesta-catalogo-marca-componentes.md` (Preguntas 1-7).
> 👤 Autor: agente IA

---

# Verificación profunda — Propuesta de catálogo de marca `lux-*`

## 0. Método y alcance

- Fuentes de verdad leídas completas: `shared/ui/arquitectura-shared-ui.md`,
  `scripts/audit-ui-boundaries.mjs`, `docs/.../20261002-propuesta-catalogo-marca-componentes.md`,
  `package.json`, `tsconfig.json`, `.storybook/main.ts`, `angular.json`,
  `.github/workflows/design-system.yml`, `core/services/platform.service.ts`.
- Cobertura: **100%** de las Preguntas 1-4 y 6 (conteos exhaustivos, no muestras).
  Pregunta 5: muestras completas de import por símbolo + `tag` en el 100% de las
  plantillas de la app. Pregunta 7: conteos exhaustivos sobre los 454 `.ts` de
  `shared/ui` (357 `@Component`).
- Anexos con evidencia cruda:
  - `20261002-verificacion-anexo-imports-web-mobile.txt` (lista completa de los
    1 724 imports directos a `web/`/`mobile/`, archivo:línea).
  - `20261002-verificacion-anexo-css-breakpoints.txt` (144 reglas candidatas y
    todos los `@media`).

> ⚠️ Nota metodológica honesta: el escaneo de "CSS por nombre de tag" produjo 144
> coincidencias; de ellas, **19 son reglas CSS reales** (el resto son comentarios,
> cadenas de documentación o nombres de componente dentro de `.spec.ts`). La
> depuración se hizo leyendo cada archivo, y se listan aparte en §6.2.

---

## 1. Veredicto ejecutivo

**1) Premisas de arquitectura (Preguntas 1-4): FALSAS, con excepciones masivas.**
La premisa «*nunca se escribe `lux-*-web`/`lux-*-mobile` en HTML de negocio*» y
«*solo `adaptive/` cruza*» **no se cumple hoy**. Hay **1 724 imports directos a
`web/`/`mobile/` desde 454 archivos fuera de `shared/ui`** (1 172 a `web/`, 552 a
`mobile/`). Sumando el resto de capas, hay **5 188 imports directos a `@ui/*`
desde 861 archivos de negocio/core** — incluyendo **1 085 imports a
`@ui/buttons/web-*`** y **309 a `@ui/buttons/mobile-*`** (los botones **no tienen
capa `adaptive/`**: 0 directorio). La premisa de agnósticos también falla:
`app-icon` tiene contraparte móvil (`ili-icon`) y adaptativo (`lx-icon`), y el
propio catálogo propuesto crearía **dos componentes con el mismo selector
`lux-icon`**.

**2) Riesgo de UI/UX rota en silencio (Pregunta 6): REAL, no teórico.** Existen
**19 reglas CSS que seleccionan por nombre de tag** de componentes de la librería
(`app-icon`, `iw-button-*`, `ili-button`, `app-sortables`, `app-badge`,
`app-tabs`, `app-table-caption`, `base-input-signal`, `custom-input-date-signal`,
`custom-input-select-button-signal`, `custom-search-input-signal`, `ili-badge`,
`ili-chip`, `ili-image`, `lx-card`, `lx-section-nav`…). Además hay **15
thresholds de `@media` distintos** (366→1999px) frente al único breakpoint real de
`PlatformService` (768px): la inconsistencia ya existe hoy, sin rename.

**3) Distancia a "nivel PrimeNG" (Pregunta 7):**

| # | Dimensión | Estado | Dato que lo sostiene |
|---|---|---|---|
| 7.1 | Docs/catálogo visual | **Inexistente** | 4 stories para 357 componentes (1 real + 3 scaffold); 3 README; 0 CHANGELOG; Storybook no corre en CI |
| 7.2 | Accesibilidad | **Inexistente/Parcial** | 57/463 archivos con `aria-*`/`role` (12.3%); overlays sin focus-trap; axe solo app-level y no bloqueante |
| 7.3 | i18n | **Inexistente** | 0 referencias a translate en `shared/ui`; 28 archivos con textos default en español |
| 7.4 | Theming/tokens | **Parcial-Bueno** | 1 solo archivo con hex hardcodeado (`module-guide.ts`, 22); dark mode existe (`base/_dark-mode.scss`) |
| 7.5 | API pública/paquete | **Inexistente** | 0 `index.ts` raíz, 0 `public-api.ts`, 0 `package.json` en `shared/ui` |
| 7.6 | Rendimiento (OnPush/lazy) | **Parcial** | Angular 22 hace OnPush default; **222 componentes declaran `Eager` (opt-out)**; 0 `@defer` en `shared/ui` |
| 7.7 | Tests | **Parcial/Vacío** | 355 specs, 916 `it`, 2.58 avg; **68.5% superficiales** (≤2 tests + `toBeTruthy`, sin eventos) |
| 7.8 | Extensibilidad | **Parcial** | 81 archivos usan `ng-content`/`TemplateRef`/`ContentChild`; el resto son caja negra |

**Conclusión de secuencia:** el rename **no** debe ir primero. Antes hay que
(a) migrar el CSS por tag a selectores por clase y (b) decidir la relación
`app-icon`/`lx-icon`. Hacer el rename hoy rompería compilación en cientos de
archivos **y**, peor, estilos en silencio. Ver §11.

---

## 2. Pregunta 1 — Imports directos a `web/`/`mobile/` desde negocio

**Respuesta: SÍ, masivamente. La premisa es falsa.**

Conteo exhaustivo (`src/app/modules/**`, `src/app/core/**`, `src/app/shared/**`
excluyendo `shared/ui/**`):

| Métrica | Valor |
|---|---|
| Líneas de import directo a `web/` o `mobile/` | **1 724** |
| Archivos afectados | **454** |
| → a `@ui/web/...` | 1 172 |
| → a `@ui/mobile/...` | 552 |
| Especificadores distintos | 64 |

Desglose por área de negocio (top):

| Área | Líneas |
|---|---|
| `modules/operations.luxuryapp` | 405 |
| `modules/maintenance.luxuryapp` | 241 |
| `modules/admin.luxuryapp` | 200 |
| `modules/accounting.luxuryapp` | 194 |
| `modules/recruitment.luxuryapp` | 151 |
| `modules/collections.luxuryapp` | 133 |
| `modules/human-resources.luxuryapp` | 110 |
| `modules/legal.luxuryapp` | 98 |
| `modules/purchases.luxuryapp` | 70 |
| `modules/shared.luxuryapp` | 56 |
| `core/layout` | 17 |
| `core/pages-extras` | 4 |
| `core/services` | 1 |

Evidencia de que son **páginas/features reales** (no `adaptive/`):

- `modules/purchases.luxuryapp/products/productos-list.ts:11-16,34-36` —
  `DataViewMobile`, `MobileListItem`, `TableCaption`, `TableEmptyMessage`,
  `TableFooter`, `AppTable`, `WebButtonIconDelete/Edit`, `MobileButtonLabel*`.
- `modules/admin.luxuryapp/system-configuration/vault-secrets/vault-secrets-list.ts:8-20,33-36`
  — importa **a la vez** implementaciones web y mobile en el mismo componente.
- `core/layout/employee-view/desktop/sidebar/sidebar.ts:14,24-25` —
  `AppDivider`, `AppSpinner`, `AppAvatar` desde `@ui/web/...`.
- `core/pages-extras/page404/page404.ts:8-9` — `@ui/buttons/web-label` + `@ui/web/divider`.

**Patrón dominante:** las páginas de listado renderizan web y mobile en el mismo
template y ramifican manualmente; **importan la implementación de plataforma
directamente**, sin `adaptive/`. Por eso marcar `web/`/`mobile/` como "interno"
en el rename sería engañoso: ya son superficie pública de facto.

Anexo completo: `20261002-verificacion-anexo-imports-web-mobile.txt`.

### 1b. Además: botones e inputs también se consumen directo (fuera de web/mobile)

Conteo de **todos** los imports `@ui/*` desde negocio/core:

| Categoría | Líneas | Archivos |
|---|---|---|
| `web/` | 1 172 | 428 |
| `buttons/web-*` | **1 085** | 615 |
| `inputs/web/` (puentes al adaptativo) | 822 | 362 |
| `adaptive/` | 569 | 359 |
| `mobile/` | 552 | 234 |
| `shared/` (primitivos) | 502 | 461 |
| `buttons/mobile-*` | 309 | 152 |
| `inputs/adaptive/` | 117 | 85 |
| `base/` | 21 | 21 |
| `inputs/mobile/` | 20 | 14 |
| otros | 19 | 19 |
| **Total** | **5 188** | **861** |

Consecuencias directas para la propuesta:
- `buttons/` **no tiene** capa `adaptive/` (no existe `adaptive/button`). Negocio
  importa `WebButtonLabel` (`il-button`) 718 veces y `WebButtonIcon` (`iw-button`)
  219 veces directo. La Fase 2 de la propuesta ("solo los consume `adaptive/`") es
  **falsa** para botones.
- `inputs/web/custom-input-*-signal` (los "puentes") se importan directo desde
  ~190 formularios (`custom-input-text-signal` solo). El archivo es un puente al
  adaptativo, pero **la ruta está bajo `web/`**, que la propuesta llama "interno".
- `lx-section-nav` vive en `web/section-nav/section-nav.ts:12` con prefijo `lx-`
  (ya mezcla capas) y se consume desde negocio.

---

## 3. Pregunta 2 — ¿El lint de fronteras protege esto hoy?

**Respuesta: NO. Solo protege fronteras internas entre capas de `shared/ui/`.**

Lectura de `scripts/audit-ui-boundaries.mjs`:

- Las reglas (líneas 16-41) apuntan únicamente a `shared/ui/mobile`,
  `shared/ui/web`, `shared/ui/base`:
  ```js
  {
    layer: "mobile",
    dir: path.join(uiRoot, "mobile"),
    forbidden: [ { re: /from\s+["']@ui\/web\//, ... } ]
  },
  {
    layer: "web",
    dir: path.join(uiRoot, "web"),
    forbidden: [ { re: /from\s+["']@ionic\//, ... } ]
  },
  {
    layer: "base",
    dir: path.join(uiRoot, "base"),
    forbidden: [ { re: /from\s+["']@ionic\//, ... } ]
  }
  ```
- `collectTs(rule.dir)` (líneas 43-57, 60-61) recorre **solo esos tres
  directorios**. Ninguna regla inspecciona `src/app/modules/**` ni `core/**`.
- **Conclusión exacta**: *el lint actual NO protege contra que un módulo de
  negocio importe directo de `web/` o `mobile/`; solo protege las fronteras
  internas entre capas de `shared/ui`.*

Ejecución real:

```
> luxury-app@5.0.1 audit:ui
> node scripts/audit-ui-boundaries.mjs

✅ shared/ui: fronteras web/móvil/base respetadas.
EXIT=0
```

Compila y "pasa" a pesar de 1 724 imports de negocio hacia `web/`/`mobile/`.

---

## 4. Pregunta 3 — Barrels/`index.ts`: fugas de encapsulamiento

Barrels reales en `shared/ui` (el prompt listaba 11; hay **13**):

| Barrels extra no listados en el prompt | Contenido |
|---|---|
| `adaptive/tooltip/index.ts` | re-export del directorio (inofensivo) |
| `charts/index.ts` | re-exporta **implementaciones web** (`@ui/web/charts/*`) |

### Fugas confirmadas

1. **`buttons/index.ts`** (4 líneas) exporta las **4 carpetas de plataforma
   internas**, incluidas web y mobile, en el mismo namespace:
   ```ts
   export * from "./web-icon";
   export * from "./web-label";
   export * from "./mobile-icon";
   export * from "./mobile-label";
   ```
   → Un consumidor que haga `import { X } from "@ui/buttons"` obtiene tanto
   `WebButtonLabel` como `MobileButtonLabel`/`WebButtonIcon`/`MobileButtonIcon`.
   **Fuga directa** de lo que la propuesta llama "interno".

2. **`inputs/index.ts`** exporta `./web` **y** `./mobile`:
   - `inputs/mobile/index.ts` exporta los `IonInput*` (implementaciones Ionic
     internas) al público.
   - `inputs/web/index.ts` exporta 30 símbolos, incluidos los puentes y
     `CustomInput*Signal`.
   → El barrel mezcla adaptativo (público vía puente) e Ionic interno.

3. **`charts/index.ts`** re-exporta `ChartWrapper`, `AdvancedPieChart`,
   `CustomBarChart`, `MultiAxisChart`, `PieChart`, `RadarChart` desde
   `@ui/web/charts/*` (líneas 6-12). Fuga de `web/`.

4. Sub-barrels de plataforma (`buttons/web-icon/index.ts`,
   `buttons/mobile-label/index.ts`, etc.) listan todas las variantes; no son
   fuga por sí mismos, pero su consumo desde negocio sí lo es.

### ¿Negocio consume los barrels (en vez del adaptativo)?

Sí:

| Import | Usos | Ejemplo archivo:línea |
|---|---|---|
| `@ui/buttons/web-label` (barrel) | 52 | `core/pages-extras/page404/page404.ts:8` |
| `@ui/buttons/web-icon` (barrel) | 9 | `core/layout/.../notifications-gadget.ts:12` |
| `@ui/buttons` (barrel raíz) | 3 | `modules/legal.../ticket-legal-lista.ts:12` |
| `@ui/buttons/mobile-label/...` directo | 8+ | `modules/shared.../unit-of-measurement-list.ts:9` |

**Veredicto Q3:** los barrels exponen lo interno (`web/`, Ionic, botones de
plataforma) en el mismo namespace que lo público, y negocio los usa. La premisa
"web/mobile son internos" se rompe ya en el barrel, no solo en el import directo.

---

## 5. Pregunta 4 — Componentes "agnósticos" (`shared/`)

`shared/ui/shared/` contiene **20 directorios**, no 18: los 18 del prompt **más**
`focus-trap` (directiva) y `live-region-announcer` (servicio). `app-icon` tiene 3
`.ts`.

### 4.1 ¿Ramifican por plataforma dentro de su propio template?

Escaneo de `PlatformService|isMobile|platform.|innerWidth|@media|window.` en las
22 fuentes: **1 sola coincidencia**, y no es ramificación de plataforma:

- `shared/breakdown-list/breakdown-list.ts:197` → `@media (prefers-reduced-motion: reduce)`.

**Ninguno de los 18 componentes agnósticos importa `PlatformService` ni tiene
`@if`/`*ngIf` por `isMobile()`.** En ese sentido, son puros.

Selectores actuales (todos `app-*`):
`app-action-icons-group`, `app-activity-log`, `app-icon`, `app-approval-workflow`,
`app-avatar-group`, `app-breakdown-list`, `app-gauge`, `app-inventory-level`,
`app-kpi-card`, `app-lead-scoring`, `app-multiple-segmented-control`,
`app-order-status`, `app-ranked-list`, `app-realtime-indicator`,
`app-segmented-control`, `app-stat-card`, `app-tour`, `app-tristate-switch`.

### 4.2 ¿Existe duplicado con el mismo propósito en `web/` o `mobile/`?

- **`app-icon` → SÍ hay duplicado.** Existe `mobile/app-icon/app-icon.ts` con
  selector `ili-icon` (clase `AppIconMobile`, renderiza `<ion-icon>`) y
  `adaptive/icon/icon.ts` con selector `lx-icon` (clase `LxIcon`).
  - `shared/app-icon/app-icon.ts:12` → `selector: "app-icon"`
  - `mobile/app-icon/app-icon.ts:23` → `selector: "ili-icon"`
  - `adaptive/icon/icon.ts:14` → `selector: "lx-icon"`
  - Uso real: `app-icon` **1 513 veces / 548 archivos**; `lx-icon` **1 vez**.
  → `app-icon` no es "la única implementación": es la variante **web** (iconify)
  consumida directamente en todos lados, incluso en móvil, mientras el adaptativo
  `lx-icon` casi no se usa.

- **Ningún otro** de los 18 tiene contraparte en `web/`/`mobile/` (no existen
  `web/kpi-card`, `mobile/stat-card`, etc.).

### 4.3 Colisión de nombres que introduce la propuesta

La propuesta mapea:
- §3.1: adaptativo `lx-icon` → **`lux-icon`**
- §3.6: primitivo `app-icon` → **`lux-icon`**

Ambos apuntan al **mismo selector público `lux-icon`**. Es una **colisión
directa** no resuelta en el catálogo. (Lo mismo aplica conceptualmente a cualquier
primitivo que tenga adaptativo homónimo.)

### 4.4 Componentes muertos detectados en `shared/`

Conteo de tags en el 100% de plantillas: `app-kpi-card` **0 usos**, `app-gauge`
**0 usos**, mientras `app-stat-card` tiene 23. La propuesta los eleva a
"primitivos de marca" sin notar que dos no se usan.

---

## 6. Pregunta 5 — Radio de impacto de los selectores de mayor uso

Uso real de tags (100% de `.html` + templates inline de la app):

| Selector | Apariciones | Archivos |
|---|---|---|
| `app-icon` | 1 513 | 548 |
| `il-button` | 718 | 262 |
| `app-sorticon` | 683 | 180 |
| `custom-input-text-signal` | 505 | 199 |
| `lx-tag` | 414 | 163 |
| `app-table` | 408 | 341 |
| `custom-input-select-signal` | 350 | 204 |
| `app-table-caption` | 231 | 215 |
| `app-data-view-mobile` | 227 | 217 |
| `il-button-save` | 221 | 215 |
| `iw-button` | 219 | 109 |
| `ili-list-item` | 208 | 196 |
| `lx-card` | 200 | 69 |
| `custom-input-textarea-signal` | 157 | 112 |
| `ili-action-menu` | 146 | 145 |
| `iw-button-delete` | 138 | 132 |
| `custom-input-date-signal` | 137 | 96 |
| `iw-button-edit` | 135 | 131 |
| `custom-input-number-signal` | 122 | 69 |
| `ili-button` | 35 | 10 |
| `ii-button` | 3 | 2 |

Import por SÍMBOLO (cómo lo trae el consumidor):

| Símbolo | Tag | Ruta(s) de import | Aliases `as` |
|---|---|---|---|
| `AppIcon` | `app-icon` | `@ui/shared/app-icon/app-icon` (444), `…app-icon.catalog` (6) | 5 (`AppIcon as AppIconComponent`/`Catalog`) |
| `WebButtonLabel` | `il-button` | directo `…/web-label/button` (201), barrel `@ui/buttons/web-label` (52) | — |
| `WebButtonIcon` | `iw-button` | directo `…/web-icon/button` (96), barrel (9) | — |
| `MobileButtonLabel` | `ili-button` | directo (8), barrel `@ui/buttons` (1) | — |
| `MobileButtonIcon` | `ii-button` | directo (1) | — |
| `CustomInputTextSignal` | `custom-input-text-signal` | `@ui/inputs/web/custom-input-text-signal` (190) | — |
| `LxTag` | `lx-tag` | `@ui/adaptive/tag/tag` (161) | — |
| `LxCard` | `lx-card` | `@ui/adaptive/card/card` (67) | — |

Hallazgos para un rename/codemod:
- **Aliases manuales**: `AppIcon as AppIconComponent` en 4 dashboards + `as
  AppIconCatalog` en `solicitud-compra-presentacion.ts:23`. Renombrar la **clase**
  `AppIcon`→`LuxIcon` rompe estos 5 aliases si el codemod no los contempla.
- **Doble vía de import** (ruta directa + barrel) para botones: 52+9 usos por
  barrel. Un codemod que solo reescriba rutas directas deja el barrel roto o
  apuntando al componente renombrado.
- CSS por nombre de tag (§7) rompe en `app-icon`, `iw-button`, `ili-button` — la
  mayoría de los "top 5".
- `AppIcon` no usa `[attr.data-...]` ni `ng-content` con selector por tag, pero sí
  es atacado por CSS de tag en plantillas de terceros (§7.2), que es el riesgo
  real.

---

## 7. Pregunta 6 — Riesgo de romper UI/UX en silencio

### 7.1 Cómo decide la app si algo es "mobile"

`core/services/platform.service.ts` (completo):

- Criterio real (líneas 35-40):
  ```ts
  private _check(): boolean {
    return this.ionicPlatform.is("hybrid") || window.innerWidth < 768;
  }
  ```
  → **Capacitor/Cordova (`hybrid`) O `window.innerWidth < 768`**.
- Es un **signal reactivo a `resize`** (líneas 11, 16-22): en escritorio, achicar
  la ventana por debajo de 768 dispara `isMobile.set(...)` **en vivo**, sin
  recargar.
- También actualiza clases del body (líneas 25-33): `is-mobile` / `is-web`.

Corrección a la documentación: `arquitectura-shared-ui.md` dice "reactivo por
`BreakpointObserver`", pero el código usa `window.innerWidth` + `fromEvent(window,
'resize')`. El doc está desactualizado en ese punto.

### 7.2 CSS que selecciona por nombre de tag (reglas reales)

**19 reglas reales.** Clasificación:

**A. Alto riesgo — tag como selector raíz (rompe siempre):**

| Archivo:línea | Regla | Selector que se renombraría |
|---|---|---|
| `src/styles/custom/_committee.scss:954` | `lx-card { display:block }` | `lx-card`→`lux-card` |
| `src/styles/custom/_committee.scss:1006` | `ili-button { flex:1 1 0; min-width:0 }` | `ili-button`→`lux-button-mobile` |
| `src/styles/custom/_committee.scss:1355` | `app-icon { font-size:1.15rem }` | `app-icon`→`lux-icon`/`lux-icon-web` |
| `src/styles/custom/_custom-table.scss:116` | `app-sorticon, .app-table-sorticon, svg { … }` | `app-sorticon`→`lux-*-web` |
| `src/styles/custom/_print.scss:167` | `app-data-view-mobile { … }` | `app-data-view-mobile`→`lux-data-view-mobile` |
| `src/styles/shared/_sidebar.scss:322-325` | `app-header-employee-monitor ... app-icon, ... iw-button app-icon { font-size:1.4rem }` | `app-icon`, `iw-button` |
| `src/styles/shared/_sidebar.scss:383-386` | `app-icon { flex:0 0 auto; margin-left:auto }` | `app-icon` |
| `src/styles/mobile/_ili-buttons.scss:59-63` | `ion-button app-icon, ion-button ion-icon { margin-inline-end:14px }` | `app-icon` |
| `src/styles/web/_buttons.scss:506-526` | `:is(iw-button-edit, iw-button-delete, … iw-button) > .btn { … }` | 12 selectores `iw-button-*` |
| `src/styles/web/_buttons.scss:530-559` | `:is(iw-button-*) + :is(iw-button-*) { margin-inline-start:.25rem }` | 12 selectores `iw-button-*` |
| `src/app/shared/ui/mobile/badge/badge.ts:19,23` | `ili-badge .ili-badge-small/large { … }` | `ili-badge`→`lux-badge-mobile` |
| `src/app/shared/ui/mobile/chip/chip.ts:43` | `ili-chip ion-chip.ili-chip-clickable { cursor:pointer }` | `ili-chip` |
| `src/app/shared/ui/mobile/image/image.ts:65` | `ili-image ion-img::part(image) { object-fit:contain }` | `ili-image` |
| `src/app/shared/ui/buttons/web-icon/button-tracking.ts:46` | `.tracking-badge-anchor app-badge { … }` | `app-badge`→`lux-badge-web` |
| `src/app/shared/ui/web/toast/toast.ts:96-103` | `.app-toast-success app-icon, … ` (4 reglas) | `app-icon` |
| `src/app/shared/ui/buttons/mobile-label/button.ts:38,41` | `app-icon[slot="start"], app-icon[slot="end"] { … }` | `app-icon` |
| `src/app/modules/operations.../task-list.ts:115,118,121` | `:host ::ng-deep app-table-caption`, `app-task-status`, `base-input-signal` | `app-table-caption` |
| `src/app/modules/recruitment.../filter-requests.ts:57-90` | `:host ::ng-deep base-input-signal`, `custom-search-input-signal`, `custom-input-date-signal`, `custom-input-select-button-signal` | 4 selectores |
| `src/app/modules/recruitment.../employee-form.ts:43` | `.employee-shell-header lx-section-nav { flex:1 1 720px }` | `lx-section-nav` |
| `src/app/modules/recruitment.../vacante-detail-modal.ts:34-55` | `:host ::ng-deep app-tabs > .nav.nav-tabs …` (4 reglas) | `app-tabs`→`lux-tabs-web` |

**B. Riesgo medio — tag como ancestro/descendiente** (ya incluidos arriba los
que son descendientes; el rename rompe un sub-estilo, no todo el componente):
`app-sorticon` (custom-table), `app-icon` dentro de `ion-button`, `app-badge`
dentro de `.tracking-badge-anchor`, `app-tabs`.

**C. Falsos positivos descartados** (no son CSS, verificado leyendo): coincidencias
en comentarios de `.ts` (`base/*.base.ts`, `ion-input-*.ts`), cadenas de
documentación del catálogo de componentes
(`modules/admin.../catalog-*/*.ts`), y `_spec.ts`.

> Ninguno de los tags `ion-*` (Ionic nativo) se ve afectado por el rename; se
> listan solo para descartar.

### 7.3 Breakpoints inconsistentes (riesgo HOY, sin rename)

Thresholds `@media` encontrados en `src/styles` + estilos de componentes:

`366, 414, 480, 560, 575, 575.98, 640, 767, 768, 900, 992, 1199, 1200, 1216, 1999`.

- El breakpoint real de `PlatformService` es **768** (`< 768`).
- `src/styles/custom/_list.scss:114,120,145` usa **992/1199**; `_list.scss:170`
  usa **1216**; `src/styles/shared/_auth.scss:26,46` usa **992**;
  `src/styles/custom/_committee.scss:762` usa **900**.
- `src/app/shared/ui/web/action-menu/action-menu.ts:61` usa `max-width:767px`
  (coincide numéricamente con `<768`).
- `src/app/shared/ui/inputs/base/base-input-signal.ts:113` usa `max-width:768px`.

**Consecuencia:** a 800px de ancho, `PlatformService.isMobile()` = `false`
(desktop) pero `_list.scss`/`_auth.scss` ya cambiaron de layout por su
`@media (max-width:992px)`. La app queda en un estado intermedio ni mobile ni
desktop. Es deuda de UX **preexistente**; el rename es buena excusa para unificar,
pero no la causa.

### 7.4 ¿Adaptativos que renderizan AMBAS implementaciones a la vez?

Escaneo de los 54 `.ts` de `adaptive/`:

| Patrón | Archivos |
|---|---|
| `@if (platform.isMobile())` (destruye/crea) | 50 |
| `[hidden]` / `display:none` (mantiene ambos en DOM) | **0** |
| Importa web **y** mobile | 46 |
| Usa `PlatformService`/`isMobile` | 52 |
| Sin plataforma | 2 (`debug-console.ts`, `tooltip/index.ts` — no son delegadores) |

Ejemplo patrón (destruye el no usado):
`adaptive/icon/icon.ts:16-22`:
```html
@if (platform.isMobile()) {
  <ili-icon [icon]="icon()" [class]="styleClass()" />
} @else {
  <app-icon [icon]="icon()" [class]="styleClass()" />
}
```
**No hay doble render oculto.** El riesgo de foco/recursos en elemento oculto
**no se materializa hoy**. Único efecto: recreación al cruzar el breakpoint
(posible parpadeo / pérdida de estado), pero es un patrón limpio y aceptable.

### 7.5 Veredicto del bloque

- **¿Hay evidencia real (no hipotética) de CSS que se rompería con el rename?**
  **Sí. 19 reglas reales** listadas en §7.2, en 15 archivos distintos.
- **¿El riesgo "se ve mal solo en cierto tamaño" es real?** **Sí**, por dos vías:
  (a) varias reglas viven bajo `.is-mobile`/`.is-web` o bajo `@media` cercanos a
  768 (p. ej. `action-menu.ts:61`), y (b) los breakpoints inconsistentes de §7.3
  ya generan estados intermedios. Un rename sin migrar el CSS rompe en silencio.
- **Recomendación obligatoria:** **CONFIRMADA.** Antes de tocar cualquier selector
  de componente hay que migrar todas las reglas de §7.2 a selectores por clase
  (`:host`, `.lux-*`, `[data-component]`) en un PR previo e independiente. Si no,
  el rename compila pero el estilo desaparece.

---

## 8. Pregunta 7 — Brechas de madurez de librería

### 7.1 Documentación y catálogo visual

- **`.stories.ts`: 4 en total.** Solo **1 pertenece a `shared/ui`**
  (`web/charts/chart-wrapper.stories.ts`); los otros 3 son scaffold de Storybook
  (`src/stories/button.stories.ts`, `header.stories.ts`, `page.stories.ts`, fecha
  de plantilla 1984). Cobertura real: **1 / 357 componentes (0.3%)**.
- `.mdx`: 1.
- Storybook **sí está cableado** en `angular.json` (targets `storybook` y
  `build-storybook`, líneas 163-176) y `.storybook/main.ts` incluye
  `@storybook/addon-a11y` y `@storybook/addon-docs`. Pero **el CI no lo ejecuta**
  (`design-system.yml` no invoca storybook). Con 4 stories, es un experimento
  casi vacío.
- **`README.md`: 3** (`adaptive/debug-console`, `adaptive/processing-overlay`,
  `web/table`). Leídos los 3: **no hay estándar** — `debug-console` y
  `processing-overlay` son ad-hoc con mojibake heredado; `web/table/README.md` es
  una guía completa de API. Formatos y alcances incompatibles entre sí.
- **CHANGELOG: 0.** No existe versionado ni canal documentado de breaking changes.
  Un consumidor no tiene forma de saber que un componente cambió.

### 7.2 Accesibilidad

- Atributos `aria-*`/`role`/`tabindex` en `shared/ui`: **140 en 57 de 463
  archivos (12.3%)**. Los componentes interactivos (botones, inputs, modales,
  menús, tabs, accordion, tooltip) mayormente no declaran ARIA.
- **Focus trap / restauración de foco:** el único mecanismo es la directiva
  `shared/focus-trap/focus-trap.ts` (`selector: "[appFocusTrap]"`, líneas 11-42).
  **Ningún overlay la usa.** Búsqueda de `cdkTrapFocus|ConfigurableFocusTrap|
  FocusMonitor|aria-modal|role="dialog"` en `shared/ui`:
  - `role="dialog"` solo en `image-analysis-dialog.ts:23`, `mobile/image.ts:47`,
    `web/dialog/dialog.ts:12`, `web/confirm-dialog/confirm-dialog.ts:17`.
  - `aria-modal="true"` solo en `mobile/image.ts:48`.
  - `lx-modal`, `lx-popover`, `lx-menu`, `lx-action-sheet`, `lx-tooltip` **no**
    atrapan ni restauran foco.
  - `.focus()` aparece solo en `focus-trap.ts` y `mobile/image.ts` (no en
    overlays).
- **Tests de a11y:** 0 archivos con `axe`/`toHaveNoViolations` en
  `shared/ui`. Existe un job CI (`design-system.yml:77-109`, `npm run audit:a11y`
  con `@axe-core/playwright`) pero es **app-level, sobre rutas públicas y
  `continue-on-error: true`** (no bloquea). No cubre componentes aislados.

### 7.3 Internacionalización

- **0 referencias** a `TranslateService`/`.instant(`/`transloco`/`@ngx-translate`/
  `$localize` en los componentes de `shared/ui`.
- **28 archivos** con textos default en español en inputs (`label`/`placeholder`/
  `title`), p. ej. `buttons/mobile-label/button.ts` (`label() || "Continuar"`).
- La app sí configura `@ngx-translate` (`app.config.ts:104-110`), pero la
  librería no lo usa. Mitigación parcial: muchos textos son **inputs
  configurables** por el consumidor (no hardcode inaccesible), pero los defaults
  son es-MX.

### 7.4 Theming / design tokens

- **1 solo archivo** de `shared/ui` con hex no trivial hardcodeado:
  `web/module-guide/module-guide.ts` (22 ocurrencias: `#61affe`, `#49cc90`,
  `#fca130`, `#f93e3e` — paleta tipo Swagger de una guía interna). El resto usa
  `var(--ds-*)`.
- **Dark mode existe**: `src/styles/base/_dark-mode.scss` (178 líneas) y los
  tokens giran por tema (ver comentario en `_custom-table.scss:100-111`). No se
  detectaron componentes con colores fijos que se vean mal en dark mode dentro de
  `shared/ui` (solo el `module-guide`).

### 7.5 API pública y superficie de paquete

- **0 `index.ts`/`public-api.ts` en la raíz de `shared/ui`.** Solo existen
  `arquitectura-shared-ui.md` y `guia-patron-b.md`, y barrels parciales
  (`buttons/`, `inputs/`, `charts/`). Cualquier archivo es técnicamente
  importable desde fuera.
- **0 `package.json`/versión** dentro de `shared/ui`. No hay forma de versionar
  cambios breaking de un componente independiente de la app.

### 7.6 Rendimiento

- Proyecto: **Angular 22.1.6** con `provideZonelessChangeDetection()`
  (`app.config.ts:23,65`).
- **Corrección importante:** en Angular v22 **`OnPush` es la estrategia por
  defecto**. `ChangeDetectionStrategy.Eager` (renombrado de `Default`) es el
  **opt-in** al modo antiguo. Por tanto la métrica "solo 55 declaran OnPush" está
  invertida:
  - 357 componentes.
  - **222** declaran explícitamente `ChangeDetectionStrategy.Eager` (**opt-out**
    de OnPush → sí vuelven a comprobación amplia).
  - 55 declaran `OnPush` (redundante, ya es default).
  - ~80 no declaran nada (default OnPush).
- Evidencia oficial (Angular docs): *"`ChangeDetectionStrategy.Eager`/`Default`
  is an optional mode"* y *"`OnPush` is the default strategy (since v22)"*
  (`angular.dev/guide/components/advanced-configuration`,
  `angular.dev/best-practices/skipping-subtrees`). En zoneless, *"OnPush is not
  required, but recommended"*; los componentes `Eager`/`Default` deben notificar
  con signals/`markForCheck` o no se refrescan
  (`angular.dev/guide/zoneless`). En un componente de librería que hospeda
  componentes de usuario no siempre se puede usar OnPush.
- Implicación: la métrica relevante no es "cuántos tienen OnPush" sino **"222
  componentes piden `Eager`"**, lo que en zoneless exige disciplina de
  notificación. Identificados entre los de mayor uso: `mobile/chip` (Eager),
  `adaptive/*` (varios), etc.
- **Lazy loading de componentes pesados: 0 `@defer`** en `shared/ui` (y 0 en toda
  la app). Las rutas sí usan `loadComponent` (59 veces), pero `lx-table`,
  `lx-editor`, `lx-carousel`, charts se cargan eager donde se importan.

### 7.7 Profundidad real de tests

- 355 specs / 454 `.ts` no-spec (357 componentes). Total **916 `it/test`**,
  promedio **2.58**.
- **243 specs (68.5%)** son superficiales: ≤2 tests, usan `toBeTruthy()` y no
  disparan eventos ni interacción.
- Los adaptativos son los más vacíos: `adaptive/tag/tag.spec.ts` (1),
  `adaptive/card/card.spec.ts` (1), `adaptive/modal/modal.spec.ts` (1),
  `adaptive/editor/editor.spec.ts` (1), `adaptive/carousel/carousel.spec.ts` (1).
- Los inputs sí tienen cobertura real: `custom-input-img-signal.spec.ts` (23),
  `custom-input-number-signal.spec.ts` (18), `custom-input-select-signal.spec.ts`
  (16), `custom-input-textarea-signal.spec.ts` (14).
- 0 specs con 0 tests.
- **Veredicto:** el "78% de specs" es medianamente vacío: la mayoría prueba
  montaje, no comportamiento. No es una métrica de calidad.

### 7.8 Extensibilidad

- **81 archivos** usan `ng-content`/`TemplateRef`/`@ContentChild`/`ng-template`
  (adaptive 23, web 27, mobile 22).
- Caso rico documentado: `web/table/README.md` expone slots `#caption`, `#header`,
  `#body`, `#emptymessage`, `#paginatorleft`, `#groupheader`, `#groupfooter`,
  `#footer`, `#colgroup` — extensibilidad real al nivel PrimeNG.
- **El resto son caja negra**: `lx-tree`, `lx-menu`, `lx-stepper`, `lx-carousel`
  no exponen slots de sub-partes. Cualquier necesidad no prevista obliga a editar
  el componente de la librería.

---

## 9. Riesgos concretos si se ejecuta el rename tal cual

### A. Compilación / referencias rotas (Preguntas 1-5)

1. **454 archivos de negocio** importan `web/`/`mobile/` directo; 1 724 líneas
   que un codemod tendría que reescribir (o el build rompe).
2. **615 archivos** importan `@ui/buttons/web-*` y **152** `@ui/buttons/mobile-*`
   (1 394 líneas). Los botones **no** tienen adaptativo; los consumidores están
   acoplados a la implementación de plataforma.
3. **362 archivos** importan `@ui/inputs/web/custom-*-signal` (822 líneas). La
   propuesta los declara "internos" pero son la puerta pública real de los forms.
4. **5 aliases** `AppIcon as ...` rompen si se renombra la clase.
5. **52+9 usos** vía barrels `@ui/buttons/web-label`/`web-icon`: un rename de
   archivo/ruta rompe el barrel si no se actualiza.
6. **Colisión `lux-icon`**: `app-icon` (primitivo) y `lx-icon` (adaptativo)
   apuntarían al mismo selector → componente duplicado/ambiguo.
7. **`lx-section-nav`** vive en `web/` con prefijo `lx-`; la regla "web = `app-*`"
   ya no es cierta y el catálogo no lo contempla.

### B. UI/UX rota en silencio (Pregunta 6) — **PRIORIDAD MÁXIMA**

No lo detecta `ng build` ni `audit:ui`. **19 reglas CSS** (§7.2) dejarían de
aplicarse sin error. Ejemplos:
- `app-icon` aparece en **1 513 tags / 548 archivos** y es blanco de CSS en
  `_sidebar.scss`, `_committee.scss`, `_ili-buttons.scss`, `toast.ts`,
  `mobile-label/button.ts`. Renombrarlo rompe tamaños y márgenes de iconos en
  sidebar, botones y toasts, silenciosamente.
- Los 12 `iw-button-*` de `_buttons.scss:506-559` definen el look circular de los
  botones de acción de fila: sin ellos, todos los botones de acción de todas las
  tablas se ven mal.
- `custom-input-date-signal` / `custom-input-select-button-signal` en
  `filter-requests.ts` alinean filtros; su rename desalinea la barra de filtros.

---

## 10. Brechas de madurez priorizadas (impacto para el usuario final)

Ordenadas por impacto **en la app de usuario**, no en el equipo:

1. **a11y de overlays (crítico).** Modales/popovers/menús sin focus-trap ni
   restauración de foco. Afecta a usuarios de teclado/lector de pantalla en cada
   interacción. Hay una directiva `appFocusTrap` sin usar: adopción pendiente.
2. **Unificación de breakpoints (crítico UX).** 15 thresholds vs 768 de
   `PlatformService`: layouts rotos en viewports intermedios.
3. **Extensibilidad de componentes complejos (alto).** `lx-tree`/`lx-menu`/
   `lx-stepper`/`lx-carousel` como caja negra obligan a tocar la librería.
4. **i18n (alto para multi-cliente).** 0 soporte; 28 defaults en español.
5. **Migración de CSS por tag a clases + theming por tokens (alto, habilita el
   rename).** Es el prerrequisito técnico del rename.
6. **Tests de comportamiento (medio).** 68.5% superficiales; sin ellos, ningún
   refactor es seguro.
7. **API pública + versionado (medio).** Sin `public-api.ts`/`package.json` no hay
   librería consumible ni changelog.
8. **Storybook/catálogo (bajo).** Nice-to-have; 1/357 con story.

---

## 11. Recomendación de secuencia

**El rename de nomenclatura NO debe ir primero.** Orden propuesto:

1. **PR previo obligatorio — migrar CSS por nombre de tag a selectores por
   clase.** Toca las 19 reglas de §7.2 (`_sidebar`, `_committee`, `_buttons`,
   `_ili-buttons`, `toast`, `mobile/badge|chip|image`,
   `buttons/web-icon/button-tracking`, `buttons/mobile-label/button`, y los
   `:host ::ng-deep` de `filter-requests`, `task-list`, `vacante-detail-modal`,
   `employee-form`). Migrar a `.lux-*`/`:host`/`[data-component]`. Este PR es
   independiente y no necesita el rename.
2. **PR de unificación de breakpoints** (o incluirlo en el mismo PR anterior,
   porque toca los mismos archivos de estilos): fijar 768 como único umbral de
   plataforma y eliminar los 992/900/1199/1216 de layout compartido.
3. **Decidir el conflicto `app-icon`/`lx-icon`** antes de nombrar: ¿el primitivo
   es `lux-icon` y el adaptativo desaparece (`lx-icon` solo se usa 1 vez)? ¿O el
   primitivo es `lux-icon-web`? Sin esta decisión, la Fase 1 del catálogo es
   incoherente.
4. **Rename mecánico por capas, con codemod y barrels incluidos** (Fases 1-2 de
   la propuesta), usando los puentes que ya probó el equipo con inputs. Debe
   cubrir barrels (`@ui/buttons`, `@ui/inputs`, `@ui/charts`) y aliases
   (`AppIcon as ...`).
5. **Resolución de `buttons`**: la fusión 4→2 carpetas (Fase 3) es un rediseño de
   API, no un rename; va al final y con bridge.
6. **Brechas PrimeNG**: a11y de overlays, i18n y `public-api.ts` son PRs
   separados y **de mayor valor que el rename**; pueden ir en paralelo a partir
   del paso 3.

En una frase: **primero los estilos y los breakpoints, después decidir
`icon`, y solo entonces renombrar.** El rename sobre el estado actual compila
pero rompe la UI sin que ningún pipeline lo detecte.

---

## 12. Cierre

- Premisas centrales de la propuesta: **refutadas con 1 724 + 1 394 + 822
  referencias reales** (no estimadas).
- Riesgo de UX silenciosa: **confirmado con 19 reglas CSS**.
- Madurez de librería: **lejos de PrimeNG** en a11y, i18n, API pública y tests;
  cercana en theming/tokens y extensibilidad parcial.
- No se modificó ningún archivo de código. Este documento y sus dos anexos son
  solo lectura.
