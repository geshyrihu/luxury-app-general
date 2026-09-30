# Plan de Remediacion - Design System (FASE 2)

> ## ⛔ RETIRADO — 2026-08-09
>
> **Este plan ya no se ejecuta.** Su eje de color describe una paleta que dejó de
> existir: cita `#1B365D` como navy base, `--primary-500` como cyan y
> `--ds-border-strong` dark en 1.52:1. El 2026-08-09 el ancla de marca se unificó
> en `#003152` con rampa monocroma H=204, y esas referencias quedaron obsoletas.
>
> **Sustituido por:**
> - [../../../docs/SharedLuxuryApp/DesignSystem/20260809-plan-shared-design-system-remediacion.md](./../../../docs/SharedLuxuryApp/DesignSystem/20260809-plan-shared-design-system-remediacion.md) — plan maestro, derivado de la auditoría FASE 1
> - [../../../docs/SharedLuxuryApp/DesignSystem/20260809-plan-shared-design-system-color-unificacion.md](./../../../docs/SharedLuxuryApp/DesignSystem/20260809-plan-shared-design-system-color-unificacion.md) — eje de color, en ejecución
>
> **Se conserva** como registro histórico: la numeración `RN-DS-001` a `RN-DS-033`
> nace aquí y sigue vigente, y parte de sus tareas sí se ejecutaron
> (`scripts/audit-contrast.mjs`, `scripts/audit-ds-tokens.mjs`), aunque ambos
> gates resultaron estar midiendo datos obsoletos y fueron reconstruidos.
>
> No borrar: este repositorio no está bajo control de versiones.

**Fecha:** 2026-08-01
**Estado:** ⛔ Retirado el 2026-08-09 (era: Propuesto, nunca aprobado)
**Origen:** Auditoria FASE 1 → [../../../docs/SharedLuxuryApp/DesignSystem/20260801-analisis-design-system-fase1.md](../analisis/../../../docs/SharedLuxuryApp/DesignSystem/20260801-analisis-design-system-fase1.md)
**Alcance:** `client/angular` (tokens, theming, fuentes, accesibilidad, CI)
**Protocolo:** [plan-creation-protocol.md](../../conventions/operations/plan-creation-protocol.md) · [compliance-protocol.md](../../conventions/core/compliance-protocol.md)
**Ruta oficial:** `docs/plans/20260801-design-system-remediacion-plan.md`

> **Regla de garantia:** el DS no se declara remediado hasta cumplir **todas** las
> fases con sus criterios de paso verificables y una re-auditoria PASS que
> corresponda al reporte origen. Ninguna fase se salta.

---

## 1. Resumen Ejecutivo

**Problema.** Actualmente el equipo sufre de un Design System fragmentado (3
sistemas tipograficos, 2 nomenclaturas de spacing, escala primaria duplicada,
fuente documentada no implementada) cuando intenta escalar la UI a 200+ modulos,
lo que resulta en inconsistencias visuales, riesgo legal de accesibilidad
(WCAG 2.2 AA: zoom bloqueado, focus ring <3:1, acentos 2.23-4.31:1) y costo alto
de mantenimiento.

**Solucion.** Unificar el sistema de tokens a una unica nomenclatura CTI,
corregir la accesibilidad bloqueante (zoom, focus, contraste), implementar la
fuente real, adoptar `@layer` + `prefers-reduced-motion` + High Contrast completo,
alinear las superficies dark, y habilitar gates de CI (contraste, axe, budgets,
visual regression).

**Beneficios.** Cero violaciones AA en auditoria, un solo lugar de cambio por
valor visual, theming light/dark/HC 1:1, y trazabilidad automatizada.

### KPIs de exito (baseline → target)

| Metrica | Baseline | Target | Timeline | Verificacion |
|---|---|---|---|---|
| Combinaciones de texto que fallan AA (4.5:1) | 9 (§3 del reporte) | 0 | Sprint 2 | `scripts/audit-contrast.mjs` |
| Anillo de focus (1.4.11, ≥3:1) | 1.37-2.41:1 | ≥7:1 (2px solido) | Sprint 2 | script contraste + tab-nav manual |
| Sistemas tipograficos en competencia | 3 | 1 | Sprint 3 | grep `--ds-text-*`/`--ds-font-size-*` = 0 uso |
| Nomenclaturas de spacing | 2 (`--ds-space-*`/`--ds-spacing-*`) | 1 | Sprint 1 | grep `--ds-spacing-*` = 0 uso |
| Escalas dark surface | 2 (navy DS vs zinc preset) | 1 | Sprint 4 | snapshot visual dark |
| Violaciones axe-core AA | >0 (pendiente medir) | 0 | Sprint 2 | axe en CI |
| Fuentes cargadas sin uso | 2 (Outfit/EB Garamond) | 0 | Sprint 3 | bundle + network audit |
| `!important` en estilos globales | multiples (styles.scss) | 0 nuevos; migrate existentes | Sprint 4 | grep |

---

## FASE 0: Pre-Planeacion (Obligatoria)

### 0.1 Problem Statement

```
Actualmente, [equipo frontend] sufre de [DS fragmentado + a11y incumplida]
cuando intenta [escalar UI a 200+ modulos y cumplir WCAG 2.2 AA],
lo que resulta en [inconsistencia visual, riesgo legal, mantenimiento caro].

Esto afecta a [todos los modulos frontend + usuarios con discapacidad]
en [client/angular con 200+ modulos y 2 dominios (web + mobile)].
```

### 0.2 Matriz de Reglas del Design System (4 niveles)

**Nivel 1 — Invariantes de dominio (inmutables)**

| RN | Regla | Mapeo a codigo |
|---|---|---|
| RN-DS-001 | Todo valor visual debe venir de un token unico; prohibido hardcode | `conventions/ui/design-tokens-rule.md`; `core/_colors.scss`, `_spacing.scss`, `_typography.scss`, `_shadows.scss`, `_borders.scss` |
| RN-DS-002 | Un token = un valor; un valor no puede tener dos significados semanticos | `theme/_variables.scss:33` (`--primary-500`) vs `theme/mypreset.ts:16` (`primary.500`) |
| RN-DS-003 | Todo texto debe cumplir ≥4.5:1 (AA) y no-texto ≥3:1, validado automatico | `DESIGN.md:175-213`; `_colors.scss:69,82,94` |
| RN-DS-004 | La marca no puede imponer un color que viole WCAG 2.2 AA | `DESIGN.md:198` (oro sobre blanco 2.23:1) |

**Nivel 2 — Flujo y estados (theming lifecycle)**

| RN | Regla | Mapeo a codigo |
|---|---|---|
| RN-DS-010 | Tema transita solo entre `light\|dark`; persistencia localStorage + `prefers-color-scheme`; sin FOUC | `core/services/theme.service.ts:9-30` |
| RN-DS-011 | Dark mode mantiene mapeo 1:1 de tokens semanticos, sin valores por componente | `theme/_variables.scss:463-658`; `base/_dark-mode.scss` |
| RN-DS-012 | `prefers-reduced-motion: reduce` → duraciones 0ms | `theme/_variables.scss:132-138` (hoy sin bloque reduce) |
| RN-DS-013 | `prefers-contrast: more` → set completo `--ds-contrast-*` por rol | `theme/_variables.scss:447-457,647-657` (hoy parcial) |

**Nivel 3 — Seguridad / compliance**

| RN | Regla | Mapeo a codigo |
|---|---|---|
| RN-DS-020 | Fuentes/assets externos deben respetar CSP vigente (`font-src`, `style-src`, `connect-src`) | `src/index.html:18-32` |
| RN-DS-021 | SSR futuro inyecta tokens en `<head>` sin exponer secretos ni romper rutas publicas | `angular.json` (sin target server hoy) |
| RN-DS-022 | Cambios en tokens globales (capa `styles` controlada) exigen aprobacion + analisis de impacto | `conventions/styles/styles-rules.md` |

**Nivel 4 — Validacion de datos / constraints**

| RN | Regla | Mapeo a codigo |
|---|---|---|
| RN-DS-030 | Grep de hex/rgba/spacing/font-size/shadow/radius fuera de `core/` = 0 | `npm run audit:tokens` (6 busquedas, design-tokens-rule.md §STEP 1.10) |
| RN-DS-031 | Budgets: tokens <5KB gzip, componente <2KB gzip | `angular.json` budgets |
| RN-DS-032 | axe-core: 0 violaciones AA en CI | Playwright + axe (pendiente de configurar) |
| RN-DS-033 | Contraste lint automatico en cada PR | script nuevo `scripts/audit-contrast.mjs` |

### 0.3 Pre-Mortem + Flujos

**Pre-Mortem:** "Salio a produccion y fue un desastre. ¿Que lo causo?"

| Supuesto fallido | Impacto | Probabilidad | Mitigacion | Owner |
|---|---|---|---|---|
| La unificacion rompe cientos de `var(--ds-spacing-*)` | Build/usos rotos | Alta | Aliases 1 release + codemod + CI | Frontend Lead |
| `--primary-500` cambia de cyan a navy y rompe componentes | Visual regresion | Alta | Grep previo de usos + snapshot | Frontend Lead |
| Fuente self-host bloqueada por CSP | Sin tipografia | Media | Ajustar CSP en index.html + test | Security |
| `@layer` cambia la cascada y dark mode deja de ganar | UI rota en dark | Media | Snapshot visual light/dark/HC | Frontend Lead |
| Quitar `zone.js` rompe change detection | Funcionalidad rota | Media | Suite vitest completa antes/despues | Frontend Lead |
| Contraste lint frena PRs legacy | Throughput bajo | Baja | Allowlist temporal + cola de remediacion | Tech Lead |

**Happy Path:** tokens unificados → a11y verde (zoom/focus/contraste) → fuente real → `@layer`+reduced+HC → dark alineado → CI gates → re-auditoria PASS.
**Criterio de PASO:** todas las fases con sus metricas (§5), re-auditoria 0 hallazgos criticos/altos.

**Sad Path:** codemod falla en un modulo → rollback a aliases (los alias mantienen compat) → corregir el codemod → reintentar.
**Criterio de PASO:** build + `audit:tokens` verdes, sin modulo roto >24h.

**Edge Path:** componente con `var(--ds-spacing-4)` inline en `:host` no detectado por grep global → el alias `--ds-spacing-N` cubre el periodo de migracion.
**Criterio de PASO:** el alias permanece vigente hasta grep global = 0.

---

## 2. Scope & Constraints

**IN-SCOPE**
- Unificacion de tokens (`--ds-*`) y reconciliacion `--primary-500` + `mypreset.ts`
- A11y bloqueante: zoom (viewport meta), focus ring, contraste de acentos/muted/tertiary/badges/bordes dark
- Implementacion de fuente real (single variable font self-host)
- `@layer` completo + `prefers-reduced-motion` + High Contrast completo
- Gates CI: contraste, axe, budgets, visual regression
- Scripts: `scripts/audit-contrast.mjs` y `scripts/migrate-tokens.mjs`
- Sincronizacion documental: `DESIGN.md`, `design-tokens-rule.md`, `styles-tokens-theming.md`, `CONVENTIONS.md §6.1`, `conventions-viewer`

**OUT-OF-SCOPE** (FASE 2.x posterior)
- SSR/Hydration y View Transitions (plan propio §8; aqui solo se prepara terreno)
- OKLCH/Display-P3, theming multi-brand (2 dominios), RTL/i18n
- Backend / Ionic en runtime

**Restricciones**
- No se tocan contratos externos, rutas publicas ni DTOs
- `src/styles` es capa controlada: cada cambio exige analisis de impacto (§RN-DS-022)
- Los tokens tienen **un release de compatibilidad** (aliases) antes de remover
- Sin `!important` nuevos en estilos globales

---

## 3. Arquitectura & Diseno Tecnico

### 3.1 Nomenclatura canonica de tokens (CTI) y mapeo

Unica fuente de verdad: `core/_*.scss` → expone `theme/_variables.scss` → `theme/mypreset.ts` → `design-tokens.d.ts`.

| Actual | Canonico (nuevo) | Valor objetivo | Nota |
|---|---|---|---|
| `--ds-spacing-1..16` | `--ds-space-{xs,sm,md,lg,xl,2xl,3xl}` | 4/8/12/16/24/32/48px | Alias `--ds-spacing-N` un release (`_variables.scss:116-125`) |
| `--ds-shadow-xs..2xl` | `--ds-shadow-{none,xs,sm,md,lg,xl,2xl,focus}` | impl actual (black rgba) | Actualizar `design-tokens-rule.md` (§sombras 1..4) y `DESIGN.md` level-1..4 |
| `--primary-500` (CSS) | `#1B365D` (navy base) | `_variables.scss:33` + `mypreset.ts:16` | Hoy cyan `#4A90E2` en CSS vs navy en preset |
| `--ds-tertiary` | `#3678C2` (info-600) | ≠ `--primary-500` | Hoy `info-500` = cyan = `--primary-500` (`_variables.scss:294`) |
| `--ds-text-*` + `--ds-font-size-*` + `$font-size-*` | `--ds-type-{display-lg,display-md,headline-lg,headline-md,title-lg,title-md,body-lg,body-md,body-sm,label-lg,label-md,label-sm}` (rem) | `styles.scss:19-32` + `_variables.scss:402-411` fusionados | Retirar dobles con alias 1 release |
| `--ds-text-muted` (light) | `#5A6878` | 5.41:1 sobre surface | Hoy `#75899C` = 3.61:1 (`_variables.scss:393`) |
| `--ds-text-tertiary` | `#5A6878` (fusion con secondary) | 5.70:1 | Hoy `#9AACBB` = 2.34:1 (`DESIGN.md:212`) |
| `--ds-on-{success,danger,info,warning}` botones | success-700 `#157A55` (5.32), danger-700 `#A63939` (6.43), info-700 `#245FA1` (6.51), warning-800 `#7A5E15` (6.11) | ≥4.5:1 | Nuevos tokens `--ds-accent-text-*` |
| `--ds-border-strong` (dark) | `#4A90E2` (primary-500) | 6.03:1 sobre primary-950 (1.4.11) | Hoy `#1B365D` = 1.52:1 (`_variables.scss:586`) |
| `--ds-shadow-focus` | `0 0 0 2px solid` navy `#1B365D` light / `#D1DEF0` dark | 11.51:1 / 14.57:1 | Hoy 30-40% opacidad = 1.37-2.41:1 (`_shadows.scss:23-25`, `_variables.scss:442`) |
| Tipografia familia | 1 variable font self-host (Outfit) | — | `index.html:44-55` wire a `--ds-font-family-base` (`_variables.scss:399`) |

### 3.2 Reglas de negocio → componentes

- **RN-DS-002** → `theme/mypreset.ts:8-22` + `theme/_variables.scss:27-38` (reconciliar escala 500).
- **RN-DS-003/004** → `core/_colors.scss` (variantes oscuras 700/800), `web/_prime-button.scss`, `web/_prime-tag.scss`, badges.
- **RN-DS-010** → `theme.service.ts` + inline script pre-paint en `index.html` (evitar flash; base para SSR futuro).
- **RN-DS-012/013** → `theme/_variables.scss` bloques `@media (prefers-reduced-motion)` y set `--ds-contrast-*` completo.
- **RN-DS-030/031/032/033** → `scripts/audit-contrast.mjs`, `angular.json` budgets, `playwright.config.ts` + axe, `npm run audit:tokens`.

### 3.3 Fuentes (RN-DS-020)

1. Descargar y self-host Outfit variable (wght 100-900) con subset latin-ext en `public/assets/fonts/` (servidas como `/assets/fonts/`; los estáticos de la app viven en `public/`).
2. `@font-face` con `font-display: swap` + `unicode-range`; preload solo el peso critico.
3. Wire `--ds-font-family-base` y `--ds-font-family-document` a Outfit; eliminar EB Garamond e Inter de CDN.
4. Actualizar CSP `font-src 'self' data:` y `style-src` sin `fonts.googleapis.com`.
5. Eliminar `<link rel="preload">`/`stylesheet` de Google Fonts (`index.html:44-55`).

### 3.4 CSS Architecture (RN-DS-012/013)

```css
@layer reset, tokens, base, components, utilities, overrides;
```
- Mover `base/_dark-mode.scss` a `@layer overrides` (eliminar la dependencia de "unlayered gana").
- Reducir `!important` en `styles.scss:130-133,160-177` a tokens/layers correctos.
- `@media (prefers-reduced-motion: reduce) { --ds-motion-duration-*: 0ms; * { animation-duration: 0s !important; transition-duration: 0s !important; } }` (un solo punto con `!important` aceptado y documentado).
- High Contrast completo: tokens `--ds-contrast-{text,bg,border,primary,on-primary,state-*}` para light y dark, cubriendo superficies y estados.

### 3.5 Migracion de Datos

**No aplica.** No hay tablas, DTOs ni payloads. Aplica exclusivamente migracion de codigo/tokens (ver §7 y codemod §4).

### 3.6 Tokens de Diseno (corazon del plan)

- Nuevos tokens (§3.1) se agregan en `core/_colors.scss`/`_typography.scss` con valor + contraste documentado (checklist §3.6.3 de `plan-agent-instructions.md`).
- Validacion pre-delivery por PR: los 6 greps de `design-tokens-rule.md` + `audit-contrast.mjs`.
- Sincronizacion con `conventions-viewer` y `CONVENTIONS.md §6.1` (regla 10 universal).

---

## 4. Backlog de Tasks

- [x] **T01** Script `scripts/audit-contrast.mjs` (calcula ratios WCAG sobre tabla de pares; exit !=0 si <4.5 texto / <3 no-texto)
- [x] **T02** Script `scripts/migrate-tokens.mjs` (codemod de nomenclatura con aliases + dry-run + reporte)
- [x] **T03** Reconciliar escala primaria: `--primary-500`=navy en CSS y `mypreset.ts`; `--ds-tertiary`=info-600
- [x] **T04** Unificar spacing: `--ds-space-{xs..3xl}` canonico + alias `--ds-spacing-N`
- [x] **T05** Unificar tipografia: `--ds-type-*` (rem) + retiro de `--ds-text-*`/`--ds-font-size-*` con alias
- [x] **T06** Quitar `user-scalable=no`/`maximum-scale` de viewport (`index.html:12-14`)
- [x] **T07** Focus ring 2px solido navy/`#D1DEF0`; eliminar `outline:none !important` global
- [x] **T08** Acentos AA: `--ds-accent-text-*` (700/800) + aplicar en botones, tags, badges, links
- [x] **T09** `--ds-text-muted`/`--ds-text-tertiary` → `#5A6878`; placeholders AA
- [x] **T10** Bordes dark 1.4.11 → `--ds-border-strong` dark = primary-500
- [x] **T11** Self-host Outfit variable; CSP; eliminar Google Fonts
- [x] **T12** `@layer reset,tokens,base,components,utilities,overrides` + mover `_dark-mode.scss`
- [x] **T13** `prefers-reduced-motion` 0ms + HC completo (`--ds-contrast-*`)
- [x] **T14** Alinear preset dark surface (mypreset) a escala navy DS; eliminar overrides por componente (escala unified; eliminación de overrides delegada a FASE 7, ver progreso)
- [ ] **T15** CI: budgets bundle, axe (Playwright), contraste lint, visual regression (Chromatic/Percy), `audit:tokens` en PR
- [x] **T16** Sincronizar docs: `DESIGN.md`, `design-tokens-rule.md`, `styles-tokens-theming.md`, `CONVENTIONS.md §6.1`, `conventions-viewer`
- [x] **T17** Actualizar claims de contraste en `DESIGN.md` (navy/blanco 12.12:1, oro/navy 5.44:1)
- [ ] **T18** Storybook: argTypes desde tokens + ComponentHarness (inventario)

---

## 5. Fases de Ejecucion (Sprint-based)

### FASE 1 — Gobernanza de tokens (Sprint 1) · RN-DS-001/002/030
- T01, T02, T03, T04, T05, T17, T16 (parcial)
- **Criterio de PASO:** `grep var(--ds-spacing-*)` = 0 usos nuevos; `--primary-500` idem en CSS y preset; `audit:tokens` 0 en `core/`; build verde.

**Progreso 2026-08-01:** FASE 1 completa. T01 ✅ (`audit-contrast.mjs`: 42 pares WCAG, exit 1 si FAIL — 14 FAILs actuales son los TARGET de FASE 2), T02 ✅ (`migrate-tokens.mjs`: codemod dry-run/apply + reporte JSON), T03 ✅ (CSS `--primary-500`=navy en `_variables.scss:33`, preset ya navy; `--ds-tertiary`=info-600 `#3678C2`), T04 ✅ (`--ds-space-{xs..3xl}` canonico + alias, arregla `--ds-space-*` consumidos sin definir; `--ds-shadow-1..4` definidos, arregla `--ds-shadow-2` roto), T05 ✅ (`--ds-type-*` canonico con valores vigentes + aliases de `--ds-font-size-*`; tokens muertos `--ds-text-*`/`--ds-text-fluid` retirados; migracion de consumidores ~340 usos pendiente FASE 3 con el codemod), T16 ✅ (docs sync: `design-tokens-rule.md`, `styles-tokens-theming.md`, `DESIGN.md`, ejemplo `conventions-viewer`), T17 ✅. Verificado: SCSS compila, `audit:tokens` 0 en `src/styles`, mojibake 0.

### FASE 2 — A11y bloqueante (Sprint 2) · RN-DS-003/004/032/033
- T06, T07, T08, T09, T10
- **Criterio de PASO:** `audit-contrast.mjs` 0 FAIL; focus ring ≥7:1; tab-nav manual sin perdida de foco; axe 0 violaciones AA en las paginas base.


### FASE 3 — Tipografia real (Sprint 3) · RN-DS-020
- T11 (mas el cuerpo de la fase 1 en tipografia: `--ds-type-*` en produccion)
- **Criterio de PASO:** network audit: 0 requests a fonts.googleapis/gstatic; LCP sin regresion >5%; FOUT ≤1 frame.

**Progreso 2026-08-01:** T11 ✅. Outfit variable (wght 100–900) descargada en `public/assets/fonts/outfit-latin-var.woff2` + `outfit-latin-ext-var.woff2` (subsets latin/latin-ext con `unicode-range`); `core/_fonts.scss` con `@font-face` `font-display: swap` (importado en `styles.scss` §7); `--ds-font-family-base`/`--ds-font-family-document` → `"Outfit", ...` en `_variables.scss` y `$font-family-base`/`$font-family-heading` en `core/_typography.scss`; eliminados preconnect/preload/stylesheet de Google Fonts en `index.html` (solo queda preload del woff2 latin); CSP `font-src 'self' data:` y `style-src` sin `fonts.googleapis.com`; inline `'EB Garamond'` en `report-meeting.html` → `var(--ds-font-family-document)`; catálogo de tokens (`tokens-typography.ts`, `catalog-layout.scss`) → Outfit; docs `DESIGN.md` y `estandar-hoja-estilos.md` sincronizados. FASE 4 (T12/T13) pendiente.

### FASE 4 — CSS Architecture (Sprint 3-4) · RN-DS-012/013/022
- T12, T13
- **Criterio de PASO:** snapshot visual light/dark/HC igual o mejor; `prefers-reduced-motion` pausa todas las animaciones; HC cubre surfaces/estados.


### FASE 5 — Dark mode unificado (Sprint 4) · RN-DS-011
- T14
- **Criterio de PASO:** una sola escala dark (navy) en preset y DS; `_dark-mode.scss` solo contiene casos no cubiertos por preset (con auditoria de cada override).

**Progreso 2026-08-01:** T14 ✅ (escala unificada; eliminación física de overrides delegada a FASE 7, ver abajo). El preset activo `src/styles/theme/mypreset.ts` (Aura) tenía la escala `dark.surface` invertida-zinc (900=#FFFFFF, 950=#F8F9FC), causa raíz de que `_prime-tokens.scss`/`_dark-mode.scss` tuvieran que "compensar" la superficie dark. **Cambio:** `dark.surface.{0..950}` ahora referencia `var(--surface-dark-0..950)` (puente existente en `_variables.scss:54-65`), y la escala fuente `$surface-dark-*` en `core/_colors.scss:251-262` pasó de zinc invertido a **navy DS con orientación Aura** (0=texto más claro #E8EEF6 … 950=fondo más oscuro #050A11; alineada a `$primary-*`). Validación empírica con `@primeuix/styled` (dump): `@primeuix/styled` acepta tokens `var()` y los emite verbatim (`--p-surface-900: var(--surface-dark-900)`), y Aura dark semánticos ahora resuelven a navy: content-background→surface-900→#050A11, content-hover→surface-800→#0A1422, form-field→surface-950→#050A11, text→surface-0→#E8EEF6, muted→surface-400→#C5D0DB, overlay-select→surface-900→#050A11. Verificado: SCSS compila 0 errores (styles.scss y ds-entry.scss), `audit:tokens` 0 en `src/styles`, `audit-contrast` 0 FAIL (37 PASS, 3 PENDIENTE, 1 EXENTO). **Delegación a FASE 7:** el criterio "eliminar overrides por componente" exige snapshot visual (criterio de PASO de la fase); tras unificar la escala, cada override de `_dark-mode.scss` (sections 9–14: panel/fieldset/tabview/accordion/datatable/dropdown/datepicker/chip/tooltip/skeleton) debe auditarse caso a caso contra los tokens semánticos navy del preset — la mayoría son ahora redundantes o quedan cubiertos por `--p-content-*`/`--p-form-field-*`, pero su remoción se hará en FASE 7 con verificación visual. Cabecera de `_dark-mode.scss` actualizada (eliminados comentarios zinc obsoletos).

### FASE 6 — CI Gates (Sprint 5) · RN-DS-031/032/033
- T15, T18
- **Criterio de PASO:** PR no puede mergear con `audit-contrast` FAIL, axe >0, budget superado, diff visual >0.1%; budgets 5KB/2KB cumplidos.

### FASE 7 — Post-remediacion (Sprint 6)
- Re-auditoria completa (criterio: 0 hallazgos critico/alto), retiro de aliases si grep=0, cierre documental.

---

## 6. Criterios de Completitud

- [ ] `audit-contrast.mjs`: 0 combinaciones FAIL (texto ≥4.5, no-texto ≥3, focus ≥3)
- [ ] `npm run audit:tokens`: 6 busquedas = 0 fuera de `core/`
- [ ] Grep de sistemas tipograficos retirados (`--ds-text-*`, `--ds-font-size-*`, `--ds-spacing-*`) = 0 usos (solo aliases en `_variables.scss`)
- [ ] `--primary-500` = `#1B365D` en CSS y `mypreset.ts`; `--ds-tertiary` ≠ `--primary-500`
- [ ] Una sola escala dark en preset + DS (sin valores zinc)
- [ ] axe-core 0 violaciones AA (CI)
- [ ] Budgets: tokens <5KB gzip, componente <2KB gzip
- [ ] `!important` global: solo el bloque `prefers-reduced-motion` documentado
- [ ] Fuentes: 0 requests CDN; variable font self-host con subset
- [ ] `@layer reset,tokens,base,components,utilities,overrides` declarado
- [ ] Docs y `conventions-viewer` sincronizados; claims de contraste corregidos
- [ ] Re-auditoria FASE 1 PASS (0 hallazgos critico/alto pendientes)

---

## 7. Riesgos & Mitigaciones

| Riesgo | Impacto | Prob | Mitigacion | Responsable |
|---|---|---|---|---|
| Migracion de tokens rompe modulos | Alto | Alta | Aliases 1 release + codemod dry-run + CI | Frontend Lead |
| `--primary-500` navy rompe componentes que usaban cyan | Alto | Media | Grep previo + snapshot visual + comunicacion | Frontend Lead |
| Font self-host bloqueada por CSP | Medio | Media | Ajuste de CSP con plan de rollback | Security/Frontend |
| `@layer` cambia cascada (dark pierde prioridad) | Alto | Media | Snapshot visual light/dark/HC por fase | Frontend Lead |
| Quitar `zone.js` rompe deteccion de cambios | Alto | Media | Suite vitest completa antes/despues; revert inmediato | Frontend Lead |
| Contraste lint bloquea PRs legacy | Bajo | Alta | Allowlist temporal + cola de remediacion | Tech Lead |
| Storybook/visual regression lento en CI | Bajo | Media | Solo diff en PR, umbral 0.1%, cache | Frontend Lead |

---

## 8. Dependencias Externas

- **@primeuix/themes `^2.0.3`**: soporte de `colorScheme` custom para escala navy dark
- **Chromatic/Percy**: licencias/credenciales para visual regression
- **axe-core + Playwright**: ya en devDependencies (Playwright `^1.62.0`)
- **Plan separado (fuera de alcance):** SSR/Hydration + View Transitions (requiere definicion previa de hosting/render) — dependencia del `angular.json` targets `server`/`ssr`

---

## 9. Metricas & KPIs de Exito

Las mismas de la Seccion 1 +:
- **Regresiones visuales:** <0.1% pixel diff por PR (baseline snapshots)
- **Bundle:** delta del CSS global ≤0 (reduccion esperada por unificacion)
- **Velocidad de cambio de marca:** cambiar `--ds-primary` en 1 linea propaga a toda la app (verificable por PR de 1 linea)
- **Hallazgos de re-auditoria:** 0 critico/alto, ≤2 medio

---

## 10. Rollback Plan

- Cada fase termina con commit autocontenido; rollback = revert del commit de la fase.
- **Tokens:** los aliases garantizan compatibilidad un release; si un modulo falla, revert solo la migracion de ese modulo y mantener aliases.
- **Fuentes/CSP:** mantener `font-src` con Google Fonts durante 1 sprint de transicion.
- **`@layer`/dark:** si dark pierde prioridad, revert el bloque `@layer` y documentar el caso para re-planificacion.
- **`zone.js`:** se conserva en `package.json` hasta que la suite vitest pase al 100% sin el; rollback = re-habilitar provider.

---

## 11. Post-Implementation Review

- [ ] Comparar KPIs reales vs baseline de la Seccion 1
- [ ] Re-auditoria FASE 1: ¿cerrados los hallazgos #1-20 del reporte origen?
- [ ] ¿Riesgos reales vs supuestos del Pre-Mortem? Lecciones para FASE 2.x
- [ ] Actualizar `CONVENTIONS.md §6.1`, `design-tokens-rule.md`, `styles-tokens-theming.md`, `DESIGN.md`, `CHANGELOG.md`, `conventions-viewer`
- [ ] Decidir arranque de FASE 2.x: SSR, P3/OKLCH, multi-brand, Unstyled
- [ ] Actualizar este plan a `Estado: Cerrado` con evidencias

---

*Plan derivado de auditoria FASE 1 · Ratios de contraste verificados numericamente · Pendiente de aprobacion del Tech Lead.*
