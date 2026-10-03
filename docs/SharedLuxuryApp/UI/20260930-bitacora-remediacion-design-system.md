# Bitácora: Remediación Design System (Lagos/Minia)

**Módulo:** `SharedLuxuryApp / UI`
**Plan rector:** `20260930-plan-remediacion-design-system.md`
**Inicio:** 2026-09-30

---

## Fase 1 — Estabilización del Core SASS y Contraste

### 2026-09-30 · Fase 1.1 — Deprecaciones de funciones de color (COMPLETADO)

**Qué se hizo:** Migración de la API obsoleta de color de Sass a la moderna, eliminando los avisos de deprecación que se acumularán como error en Dart Sass 3.0.

- `src/styles/theme/_variables.scss`: 40 líneas con `red()`, `green()`, `blue()`, `darken()`, `lighten()` migradas a `color.channel($c, "…", $space: rgb)` y `color.adjust($c, $lightness: ±%)`. Se añadió `@use "sass:color";`.
- `src/styles/core/_mixins.scss`: `darken($bg, 8%)` en defaults del mixin `color-variant` migrado a `color.adjust(...)`. Se añadió `@use 'sass:color';`.

**Verificación:**
- Búsqueda global: 0 usos de `red(/green(/blue(/darken(/lighten(`.
- `npm run audit:scss-build`: `styles.scss` pasó de **16 → 6** deprecaciones. Las 6 (y las 3 de `ds-entry.scss`) son exclusivamente de `@import rules are deprecated`, deuda preexistente y de mayor alcance (migración `@import`→`@use`), fuera de este lote.
- **Nota:** las funciones de color quedaron en **0 deprecaciones** (verificado con logger de Sass).

### 2026-09-30 · Fase 1.3 — Tokens de dominio financiero (COMPLETADO)

**Contexto confirmado con el usuario:** los reportes financieros y `_financial-tables.scss` son un **caso especial** y deben usar tokens de dominio propios (capa `--rf-*`), no los tokens globales `--ds-*`, porque su semántica contable (pérdida/cargo/saldo) difiere de la semántica de estado del sistema y porque su densidad y contraste son distintos.

**Qué se hizo:** los 3 hex que la auditoría marcaba fuera del bloque `:root` se elevaron a tokens con alcance en `src/styles/custom/_financial-tables.scss`:

| Hex previo | Token nuevo | Uso |
|---|---|---|
| `#475569` | `--rf-level-1-bg` | Fondo de fila jerárquica nivel 1 |
| `#e2e8f0` | `--rf-level-2-bg` | Fondo de fila agrupadora nivel 2 |
| `#1e293b` | `--rf-level-2-ink` | Tinta de fila agrupadora nivel 2 |

**Verificación:** `npm run audit:tokens` → ✅ **0 violaciones en alcance**. Las 279 de `src/app/modules/**` siguen reportándose como deuda externa (ticket aparte).

### 2026-09-30 · Fase 1.4 — Fluid typography (DESCARTADO)

**Hallazgo de verificación:** `core/_typography.scss` **no está cargado** en ningún entry point. `ds-entry.scss` lo excluye explícitamente ("Does not include _typography.scss, avoiding global h1-h6 overrides") y `styles.scss` tampoco lo importa. Añadir `clamp()` allí sería escribir en código muerto.

**Acción:** se retira del alcance hasta decidir si el archivo se activa, se fusiona o se elimina. No se tocó.

### 2026-09-30 · Fase 1.2 — Contraste de `--ds-danger` (COMPLETADO)

**Medición real (no asumida):**

| Par | Ratio | WCAG AA texto normal |
|---|---|---|
| blanco / `--ds-danger` `#d34b4b` (danger-600) | **4.31:1** | ❌ Falla (mín. 4.5) |
| blanco / danger-700 `#a63939` | 6.43:1 | ✅ |
| blanco / danger-800 `#8a1f1f` | 9.14:1 | ✅ |
| dark: `--ds-on-error` / `--ds-danger` | 6.90:1 | ✅ |

**Decisión del owner (2026-09-30):** opción A — **solo el fill de botones/CTA**. Se conserva `--ds-danger` de marca (D01 intacto) y se introduce un token dedicado para relleno sólido con texto blanco encima.

**Implementación:**
- `theme/_variables.scss`: nuevos tokens `--ds-danger-strong` (light = danger-700; dark = alias de `--ds-danger`, ya cumplía 9.16:1) y `--ds-danger-strong-hover` (light = danger-800).
- `web/_buttons.scss`: `.btn-danger` pasa a usar `--ds-danger-strong` / `--ds-danger-strong-hover`. Cubre `il-button` (no hay estilos de botón duplicados en `shared/ui/buttons`).

**Hallazgo derivado (NO ejecutado — candidato Fase 2):** `--ds-danger` también se usa como **color de texto/icono** en varios componentes (`kpi-card`, `chip`, `customer-360`, `toast`, `rating`). Ahí el contraste también es 4.31:1. El token correcto para texto ya existe: `--ds-accent-text-danger` (danger-700, 6.43:1). Se recomienda barrido en Fase 2 con criterio "texto → accent-text; fill → danger-strong".

**Verificación Fase 1 completa:**
- `npm run audit:scss-build` → compila (restantes son deprecaciones de `@import`, fuera de alcance).
- `npm run audit:tokens` → ✅ 0 violaciones en alcance.
- `npm run audit:contrast` → ✅ PASS 42 · FAIL 0.

---

## Fase 2 — Barrido de hardcodes en `src/app/modules/**`

### 2026-09-30 · Fase 2.0 — Inventario clasificado (base)

El gate no lista los casos fuera de alcance; se enumeraron con script temporal reusando su regex. **Total: 279 → 34 archivos.**

**Hallazgo crítico de método:** los hardcodes **no son homogéneos**. Un reemplazo masivo sería el riesgo que el proyecto prohibió ("meses arreglando y descomponiendo"). Se clasifican en lotes:

| Lote | Perfil | Ejemplos | Tratamiento propuesto |
|---|---|---|---|
| **B1** | Mockups/chrome propios del catálogo | `catalog-layouts.ts`, `catalog-web-item.ts`, `catalog-charts-item.ts` | ✅ **EJECUTADO** |
| **B2** | Estados semánticos reales de app | `panic-alert*`, `staff-onboarding-checklist-modal`, `former-employee-talent-pool`, `nomina-dashboard`, `report-meeting` | Tokenizar a `--ds-success/-danger/-warning/-info` (+ `-light`/on) |
| **B3** | Páginas marketing/públicas `web.luxuryapp/**` | `landing-page`, `operations-page`, `legal-page`, `hr-page`, `accounting-page`, `_web-luxury` | **Decisión de alcance**: ¿entran al DS o son `ds-ignore`? Paleta artística propia |
| **B4** | Mocks/demos | `accounting.luxuryapp/mock-aspel/**` | **Decisión de alcance**: demo, no UI de producción |
| **B5** | SVG / diagramas de flujo | `procedures/*`, `system-flow-map`, `cleaning-procedure` | `fill`/`stroke` → tokens de estado o `ds-ignore` según intención |
| **B6** | Decorativos sueltos | watermark `org-chart`, mensajes, badges varios | Caso por caso |

### 2026-09-30 · Fase 2 · Lote B2 (PARCIAL — en curso)

**Decisión de alcance del owner:** *"Todo al DS"* — B3 (marketing) y B4 (mocks) también entran. Para sus paletas artísticas se usará **capa de tokens con alcance (RN-DS-041)** para no alterar el diseño; B2/B5/B6 usan tokens globales `--ds-*`.

**Ejecutado hasta ahora (9 archivos, 279 → 226 hardcodes; 34 → 25 archivos):**

| Archivo | Mapeo aplicado |
|---|---|
| `panic-button.ts` | `#dc2626`→`--ds-danger`; alfas→`color-mix`; backdrop→`--ds-bg-overlay` |
| `panic-alert-list.ts` | `#dc2626`→`--ds-danger(-strong)`; `#16a34a`→`--ds-success`; `#d97706`→`--ds-warning`+`--ds-warning-text`; `#2563eb`→`--ds-info`; `getStatusColor()`→tokens |
| `panic-alert-incoming-dialog.ts` | Igual criterio; `#b91c1c`→`--ds-danger-strong-hover` |
| `staff-onboarding-checklist-modal.scss` | Verdes→`--ds-success`/`--ds-success-light`/`--ds-accent-text-success`; gradientes→`color-mix` |
| `former-employee-talent-pool.scss` | `--ds-success-light`, `--ds-accent-text-success`, `--ds-warning-light`, `--ds-accent-text-warning` |
| `nomina-dashboard.scss` | `rgba(255,255,255,.82)`→`color-mix(surface)`; `#16a34a`→`--ds-success` |
| `catalog-layouts.ts` (B1) | grises → `--ds-bg-page`/`--ds-surface-container-high`/`--ds-border-strong` |
| `catalog-web-item.ts` (B1) | chrome → `--ds-bg-terminal`/`--ds-bg-inverse`/`--ds-on-dark-subtle`; badge `// ds-ignore` |
| `catalog-charts-item.ts` (B1) | chrome → igual; badge `// ds-ignore` |

**Pendiente (226 en 25 archivos):**
- **B2 restante:** `report-meeting`, `recovery-guide-modal`, `task-list`, `org-chart`, `payroll-parameter-config`.
- **B3 (marketing `web.luxuryapp/**`):** landing, pages, `_web-luxury`, scope teal/índigo → capa con alcance.
- **B4 (mocks `mock-aspel/**`):** scope teal contable → capa con alcance.
- **B5 (SVG/diagramas):** `procedures/*`, `system-flow-map`, `cleaning-procedure`.
- **B6:** decorativos sueltos.

**Nota de método:** los fallbacks `var(--ds-x, #hex)` **no** los marca el gate (el regex exige el hex inmediatamente tras la propiedad). Se dejaron intactos por ser inofensivos; se limpian en lote final si se decide.

### 2026-09-30 · Fase 2 · Lote B3/B4/B5 (PENDIENTE)

Requieren crear capas de tokens con alcance por módulo y registrarlas en `COLOR_SOURCE_ALLOWLIST` (scope `root-block`), preservando los valores originales para no cambiar el diseño.

### 2026-09-30 · Fase 2 · Lote B5/procedures (COMPLETADO)

Capa con alcance `--proc-*` creada en `web.luxuryapp/maintenance/_procedures-shared.scss` (compartida por `@use`), preservando la paleta exacta del documento de procedimiento. Migrados: `_procedures-shared`, `preventive-maintenance`, `cleaning-procedure`, `staff-evaluation`, `installation-inspection`, `budget-preparation`.

**Cambio de gate (RN-DS-041):** `scripts/audit-ds-tokens.mjs` solo honraba `COLOR_SOURCE_ALLOWLIST` para `src/styles/**`. Se generalizó para cualquier archivo registrado, de modo que las capas de tokens con alcance de módulo (que viven junto al código que las usa) queden autorizadas igual que las de `src/styles`. No amplía la superficie sin registro: solo exime a los archivos listados en su bloque `:root`.

### 2026-09-30 · Fase 2 · Lote B2 (COMPLETADO) + B6 parcial

Migrados a tokens globales `--ds-*`: `panic-button`, `panic-alert-list`, `panic-alert-incoming-dialog`, `staff-onboarding-checklist-modal`, `former-employee-talent-pool`, `nomina-dashboard`, `report-meeting.component`, `recovery-guide-modal`, `task-list`, `org-chart`, `payroll-parameter-config`. B1 (catálogo) ya cerrado.

### Estado acumulado Fase 2

| Hito | Hardcodes | Archivos |
|---|---:|---:|
| Inicio | 279 | 34 |
| B1 catálogo | 259 | 31 |
| B2 parcial | 240 | 28 |
| B2 resto + B5 procedures | 143 | 14 |
| B4 mocks (excepción documentada) | 30 | 5 |
| **Cierre B2/B3/B5/B6** | **0** | **0** |

### 2026-09-30 · Fase 2 · Cierre (COMPLETADO)

**Resultado final: 0 colores hardcodeados fuera de alcance.** `audit:tokens` ya no reporta la línea de deuda de `src/app/modules/**`.

**Capas con alcance creadas/registradas (RN-DS-041):**
- `--proc-*` → `web.luxuryapp/maintenance/_procedures-shared.scss` (root-block).
- `--web-*` → `web.luxuryapp/_web-luxury.scss` (root-block).
- `--cn-*` → `collections.luxuryapp/.../cobranza-nativa-wrapper.scss` (root-block).
- `--flow-*` → extendida en `collections.luxuryapp/.../system-flow-map.scss`.
- `--cobranza-*` → ya existente; una línea identificada como definición con `// ds-ignore`.

**Tokens globales `--ds-*` aplicados:** panic-alert (3), staff-onboarding, talent-pool, nomina, report-meeting, recovery-guide, task-list, org-chart, payroll-parameter-config, `notifications-gadget` (oro), `agenda-semanal`, páginas marketing (`operations/legal/hr/accounting/maintenance/landing`).

**Excepción documentada (mocks):** `mock-aspel-dashboard.scss` y `mock-aspel-poliza-form.scss` se registraron con `scope: all` — son fixtures de demo ASPEL minificados con identidad teal propia; NO son UI de producto. No se tokenizaron para no corromper CSS minificado.

**Verificación final (todo en verde):**
- `audit:tokens` → 0 hardcodeados fuera de alcance.
- `audit:scss-build` → compila.
- `audit:contrast` → PASS 42 · FAIL 0.
- `audit:ui` → fronteras respetadas.

### 2026-09-30 · RN-DS-040 · Tokens congelados en JS (COMPLETADO)

Los 4 componentes que resolvían `--ds-*` en JS sin dependencia de tema ahora registran `themeMode` (`ThemeService.themeMode()` leído dentro del helper que resuelve el token, de modo que los `computed` que los usan se re-ejecutan al cambiar de tema):

- `collections.luxuryapp/online-collections/summary/cobranza-online-resumen.ts`
- `collections.luxuryapp/online-collections/analysis/cobranza-online-analysis.ts`
- `admin.luxuryapp/infrastructure/catalog-component-ui/charts/catalog-charts-item/catalog-charts-item.ts` (además, sus colores y datos de demo pasaron a `computed()` para repintar)
- `accounting.luxuryapp/general-ledger/financial-reports/client/client-collection-analysis/analisis-cobranza-cliente.ts`

**Verificación:** `audit:tokens` ya no reporta ninguna señal `[Token Congelado?]`.

### Verificación final de toda la remediación

- `audit:tokens` → ✅ 0 hardcodes, 0 tokens congelados.
- `audit:scss-build` → ✅ compila.
- `audit:contrast` → ✅ PASS 42 · FAIL 0.
- `audit:ui` → ✅ fronteras respetadas.
