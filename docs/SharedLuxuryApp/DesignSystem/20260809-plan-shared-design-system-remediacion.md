# Plan de Remediación Integral — Design System LuxuryApp

**Fecha:** 2026-08-09
**Estado:** Propuesto (pendiente de aprobación del Tech Lead)
**Origen:** Auditoría FASE 1 del DS implementado (2026-08-09) — puntuación global **5.4/10**
**Sustituye a:** [../../../docs/SharedLuxuryApp/DesignSystem/20260801-plan-shared-design-system-remediacion.md](./../../../docs/SharedLuxuryApp/DesignSystem/20260801-plan-shared-design-system-remediacion.md) — retirado por obsolescencia: su eje de color describe la paleta anterior (`#1B365D`, `--primary-500` cyan) que dejó de existir el 2026-08-09.
**Coexiste con:** [../../../docs/SharedLuxuryApp/DesignSystem/20260809-plan-shared-design-system-color-unificacion.md](./../../../docs/SharedLuxuryApp/DesignSystem/20260809-plan-shared-design-system-color-unificacion.md) — vigente y a medio ejecutar (Sprints 1–2 cerrados). Entra aquí como **WS-3** sin renumerar sus tareas.
**Alcance:** `client/angular` — accesibilidad, controles de CI, iconografía, Storybook, patrones Angular 22, tokens como producto
**Protocolo:** [plan-agent-instructions.md](../../conventions/operations/plan-agent-instructions.md) · [design-tokens-rule.md](../../conventions/ui/design-tokens-rule.md)
**Ruta oficial:** `docs/plans/20260809-design-system-remediacion-integral-plan.md`

> **Regla de garantía:** ningún workstream se declara cerrado sin su gate ejecutable
> en verde. Un control que no puede fallar no cuenta como control — es la lección
> que este plan hereda de los dos gates que aprobaban sobre datos obsoletos.

---

## FASE 0: Pre-Planeación

### 0.1 Problem Statement

```
Actualmente, el equipo frontend sufre de un Design System con cimientos
sólidos y adopción casi nula en su capa superior cuando intenta sostener
383 componentes en producción,

lo que resulta en una librería compartida sin accesibilidad implementada
(0 usos de aria-describedby, 1 de aria-hidden), infraestructura de calidad
pagada y sin usar (Storybook con addon-a11y y Chromatic instalados, 3
historias para 383 componentes), y controles de CI calibrados de forma que
no pueden fallar (budget inicial en 5 MB).

Esto afecta a una plataforma con residentes, personal administrativo y
guardias — poblaciones donde la exposición legal por accesibilidad es real.
```

**Causa raíz.** El sistema fue construido de abajo hacia arriba y se detuvo al
llegar a la capa de uso. Tokens, theming y gobernanza documental están por
encima de la media; ARIA, historias, budgets y consolidación de iconos nunca se
completaron. El patrón se repite idéntico en tres ejes: **la herramienta está
instalada, la práctica no existe.**

### KPIs de éxito (baseline → target)

| # | Métrica | Baseline | Target | WS | Verificación |
|:---|:---|:---|:---|:---|:---|
| 1 | Violaciones axe-core AA | 6 rutas autenticadas evaluadas = 25 violaciones (5 reglas: button-name, image-alt, color-contrast, link-name, scrollable-region-focusable) — baseline Fase A (§9.2) | 0 | WS-1 | `npm run audit:a11y` |
| 2 | `aria-describedby` en `shared/ui` | 0 | ≥1 por componente de formulario | WS-1 | grep §6 |
| 3 | `aria-label` en `shared/ui` | 24 / 383 componentes | ≥1 por componente interactivo | WS-1 | grep §6 |
| 4 | Budget inicial de bundle | 4.06 MB raw / 645 KB transfer (medido Fase A) | 3 MB warning / 4.5 MB error (RN-DS-025 camino 2, exceso = deuda) | WS-2 | `angular.json` §9.1 |
| 5 | Budget de CSS de tokens | inexistente | <5 KB gz | WS-2 | `angular.json` |
| 6 | Valores hardcodeados (`audit:tokens`) | 308 | 0 en `shared/ui` + `styles` | WS-3 | `npm run audit:tokens` |
| 7 | Sistemas de iconos instalados | 4 | 2 (primeicons web / ion-icon móvil) | WS-4 | `package.json` |
| 8 | Historias de Storybook | 3 / 383 (0.8%) | 40 componentes clave | WS-5 | `find -name "*.stories.ts"` |
| 9 | Container queries | 0 | ≥12 componentes | WS-6 | grep `@container` |
| 10 | Bloques `@defer` | 0 | ≥6 componentes pesados | WS-6 | grep `@defer` |
| 11 | Tokens exportados a JSON/TS generado | 0 (50 líneas a mano) | 246 generados | WS-7 | build de Style Dictionary |
| 12 | Usos del oro como color de texto | 7 | 0 | WS-3 | grep §6 |

---

### 0.2 Matriz de Reglas del Design System (4 niveles)

Continúa la numeración de [20260809-color](./../../../docs/SharedLuxuryApp/DesignSystem/20260809-plan-shared-design-system-color-unificacion.md).
Reglas **nuevas** marcadas con ✦. Las de color (005-007, 014-015, 023-024, 034-036) siguen vigentes.

**Nivel 1 — Invariantes de dominio**

| RN | Regla | Mapeo |
|:---|:---|:---|
| RN-DS-001 | Todo valor visual viene de un token único | `core/_colors.scss` |
| RN-DS-002 | Un token = un valor; un valor no puede tener dos significados | — |
| RN-DS-003 | Texto ≥4.5:1 (AA); no-texto ≥3:1, validado automáticamente | `scripts/audit-contrast.mjs` |
| RN-DS-004 | La marca no puede imponer un color que viole WCAG 2.2 AA | oro `#D4A74A` = 2.23:1 |
| RN-DS-005 | `#003152` es el único ancla de marca | `core/_colors.scss:32` |
| ✦ RN-DS-008 | **Un componente del DS sin ARIA es un componente defectuoso, no incompleto. Todo componente interactivo expone rol, nombre accesible y estado; todo campo de formulario expone su descripción y su error vía `aria-describedby`.** | `shared/ui/**` |
| ✦ RN-DS-009 (corregida) | **Un wrapper por plataforma, no un paquete por plataforma. `app-icon` para web, `ion-icon` para móvil. Una dependencia de iconos con cero usos es deuda; una con wrapper, mapeo y CSP declarada es el estándar y no se retira.** | `package.json`, `shared/ui/shared/app-icon`, `core/services/icon-preload.service.ts` |

**Nivel 2 — Flujo y estados**

| RN | Regla | Mapeo |
|:---|:---|:---|
| RN-DS-010 | Tema transita solo entre `light\|dark`, sin FOUC | `core/services/theme.service.ts` |
| RN-DS-011 | Dark mantiene mapeo 1:1 de tokens semánticos | `theme/_variables.scss` |
| RN-DS-012 | `prefers-reduced-motion: reduce` → 0ms | `styles/styles.scss:165` ✓ |
| RN-DS-013 | `prefers-contrast: more` → set `--ds-contrast-*` completo | `theme/_variables.scss` ✓ |
| RN-DS-015 | Todo valor visual responde al cambio de tema | `shared/ui/**` |
| ✦ RN-DS-016 | **Todo componente del DS documenta sus estados: `default`, `hover`, `focus-visible`, `disabled` y, si aplica, `loading`, `error`, `readonly`, `skeleton`. Un estado sin historia de Storybook es un estado sin verificar.** | `*.stories.ts` |
| ✦ RN-DS-017 | **Los componentes se adaptan a su contenedor, no a la ventana. Un componente que aparece en más de un ancho usa `@container`, no breakpoint global.** | `shared/ui/**` |

**Nivel 3 — Seguridad / compliance / gobernanza**

| RN | Regla | Mapeo |
|:---|:---|:---|
| RN-DS-020 | Fuentes/assets externos respetan CSP | `src/index.html` |
| RN-DS-022 | Cambios en tokens globales exigen aprobación | `conventions/styles/styles-rules.md` |
| RN-DS-023 | Un gate deriva sus datos del código real, nunca de una tabla | `scripts/audit-contrast.mjs` ✓ |
| RN-DS-024 | La cobertura de un gate corresponde a dónde vive el código | `scripts/audit-ds-tokens.mjs` ✓ |
| ✦ RN-DS-025 | **Un umbral que no puede dispararse no es un control. Todo budget se calibra contra la medición real y se re-calibra cuando la medición cambia.** | `angular.json` (hoy la viola) |
| ✦ RN-DS-026 | **Cuando un gate se pone rojo por algo fuera del alcance declarado, se reporta y se acota el gate. Nunca se amplía la superficie del DS para silenciarlo.** | lección de Sprint 2 del plan de color |
| ✦ RN-DS-027 | **La validación a nivel de token es necesaria y no suficiente. Todo criterio verificable en el DOM renderizado debe además validarse ahí. Un gate estático en verde no autoriza a afirmar que el criterio se cumple.** | `audit-contrast.mjs` + `audit-a11y.mjs` (Fase A-bis) |

**Nivel 4 — Validación ejecutable**

| RN | Regla | Verificación |
|:---|:---|:---|
| RN-DS-030 | Grep de hex fuera de `core/` = 0 | `npm run audit:tokens` |
| RN-DS-033 | Lint de contraste en cada PR | `npm run audit:contrast` |
| RN-DS-035 | Cero referencias `--ds-*` a tokens no definidos | `npm run audit:token-refs` |
| ✦ RN-DS-037 | **0 violaciones axe-core AA en los componentes cubiertos por Storybook** | `npm run audit:a11y` (nuevo) |
| ✦ RN-DS-038 | **Todo componente en la lista de 40 clave tiene historia con sus estados de RN-DS-016** | `scripts/audit-stories.mjs` (nuevo) |
| ✦ RN-DS-039 | **Budgets calibrados: `initial` ≤ medición +10%, CSS de tokens <5 KB gz** | `ng build --configuration production` |
| ✦ RN-DS-040 | **Todo componente que resuelve tokens a valores concretos en JS (canvas, SVG generado, colores calculados) registra un `effect()` sobre `ThemeService.themeMode` que fuerza el repintado. Resolver un token en JS rompe la reactividad de tema que `var()` da gratis.** | `scripts/audit-ds-tokens.mjs` (heurística: `getComputedStyle`/`getPropertyValue` sobre `--ds-*` sin `themeMode`/`ThemeService`) |

---

### 0.3 Pre-Mortem + Flujos

| Supuesto fallido | Impacto | Prob. | Mitigación | Responsable |
|:---|:---|:---|:---|:---|
| Se instala axe-core y arroja cientos de violaciones; el equipo lo desactiva | Se pierde el único control de a11y | **Alta** | WS-1 arranca en modo reporte con baseline registrado; el gate bloquea solo sobre componentes ya remediados, y la lista crece | Tech Lead |
| Se calibra el budget al bundle real y el bundle real ya es enorme | El budget "correcto" legitima un problema | **Alta** | T2.2 exige registrar la medición y compararla con el objetivo de la industria antes de fijarla. Si excede, se abre ticket de reducción, no se acepta el número | Frontend Lead |
| El barrido de ARIA se hace sin lector de pantalla y produce ARIA incorrecto | Peor que no tener ARIA: engaña a la tecnología asistiva | **Media** | Ningún componente se marca remediado sin pasar axe **y** una prueba de navegación por teclado. NVDA o VoiceOver en los 10 de mayor uso | Ejecutor + Tech Lead |
| Poblar Storybook se vuelve una tarea infinita de 383 componentes | Se abandona a medias, otra vez | **Media** | El alcance son 40 componentes nombrados, no cobertura total. La lista se cierra antes de empezar | Tech Lead |
| Quitar `feather-icons` o `iconify-icon` rompe algo no detectado por grep | Iconos rotos en producción | **Baja** | Ambos tienen 0 y 5 usos respectivamente; los 5 de iconify se migran uno por uno antes de desinstalar | Ejecutor |
| WS-3 (color) y WS-1 (a11y) tocan los mismos archivos y chocan | Conflictos y retrabajo | **Media** | WS-3 toca valores CSS; WS-1 toca plantillas y atributos. Superficie distinta dentro del mismo archivo. Si chocan, WS-3 tiene prioridad por estar a medio ejecutar | Ejecutor |

**Happy Path:** Se instala axe y se registra el baseline real → se calibran los budgets contra medición → se termina el eje de color → se consolidan iconos → se pueblan 40 historias, que a su vez habilitan la verificación de estados y el gate de a11y → el barrido de ARIA avanza con verificación automática en vez de a ciegas.

**Sad Path:** axe arroja un volumen inmanejable → se congela el gate en modo reporte, se ordenan las violaciones por tipo y se ataca la más repetida primero (probablemente nombre accesible faltante en botones de icono, que es una sola corrección replicada).

**Edge Path:** un componente no puede cumplir AA sin rediseño (p. ej. un chip con el oro de marca como fondo) → se escala a decisión de marca, no se resuelve en código. RN-DS-004 dice que la marca cede.

---

## 1. Resumen Ejecutivo

**Problema.** Copiar §0.1.

**Solución.** Ocho workstreams, tres de ellos de media jornada cada uno. El orden
no es por importancia sino por **capacidad de medir**: sin axe instalado
cualquier plan de accesibilidad es a ciegas, y sin budgets calibrados cualquier
afirmación sobre performance es opinión.

**Beneficios.** Exposición legal medida y decreciente; controles de CI que pueden
fallar; la inversión ya hecha en Storybook y Chromatic empieza a rendir; y un
catálogo de 383 componentes que pasa de activo latente a activo verificable.

---

## 2. Scope & Constraints

**IN-SCOPE**
- `client/angular/src/app/shared/ui/**` — ARIA, estados, container queries, `@defer`
- `client/angular/scripts/**` — gates nuevos (`audit-a11y`, `audit-stories`)
- `client/angular/angular.json` — budgets
- `client/angular/package.json` — consolidación de iconos, axe-core
- `client/angular/.storybook/**` y `*.stories.ts` — 40 componentes clave
- `client/angular/src/styles/**` — solo lo que quede del eje de color (WS-3)

**OUT-OF-SCOPE**
- Módulos de negocio en `src/app/apps/**`. Se benefician pero no bloquean. Las violaciones de `audit:tokens` fuera de `shared/ui` son ticket aparte.
- SSR / hydration. No está instalado (`@angular/ssr` ausente, sin target de servidor). Los criterios de FOUC en SSR del prompt de auditoría **no aplican a este repo**.
- Separación de dominios público/funcional. El repo tiene un solo target de build; los dos sitios del prompt no existen todavía.
- OKLCH / Display-P3 (hallazgo 12), versionado SemVer del DS (13). Diferidos con justificación en §7.
- `client/luxuryapp-nx` — congelado READ-ONLY.

**Constraints**
- **Control de versiones (corregido 2026-08-10).** `client/angular` **sí** es un repositorio git independiente, igual que `api/` y `client/flutter/`. La raíz `d:\repos\luxuryapp-api` no lo es: es un contenedor. Una comprobación previa desde la raíz concluyó erróneamente que no había git — `git` busca hacia arriba, nunca hacia abajo. El rollback es `git checkout` / `git revert` (§10). Ninguna tarea borra archivos: los documentos obsoletos se marcan como superseded.
- Zoneless activo (`provideZonelessChangeDetection`). Todo componente nuevo o tocado debe ser compatible.

---

## 3. Arquitectura & Diseño Técnico

### 3.1 WS-1 · Accesibilidad medible (hallazgos 1 y 2)

**Estado actual medido en `shared/ui` (383 componentes):**

| Atributo | Usos |
|:---|:---|
| `aria-label` | 24 |
| `role=` | 13 |
| `tabindex` | 5 |
| `aria-live` | 2 |
| `aria-hidden` | 1 |
| `aria-describedby` | **0** |

**Instrumentación primero, remediación después.** El orden importa: sin
medición, el barrido de ARIA produce trabajo no verificable.

1. Instalar `@axe-core/playwright` y `axe-core`.
2. `scripts/audit-a11y.mjs`: corre axe sobre las historias de Storybook publicadas. Arranca en **modo reporte** con el baseline registrado en un JSON versionado.
3. El gate bloquea solo sobre la lista de componentes remediados. La lista crece; el gate nunca retrocede.
4. Barrido por categoría en este orden, que es el de mayor daño: **overlays** (dialog, drawer, popover, tooltip, confirmdialog) → **formularios** (input, select, datepicker, upload) → **navegación** (menu, tabs, breadcrumb) → **datos** (table, tree, paginator) → resto.

Por categoría, el mínimo de RN-DS-008:
- Overlays: `role`, foco atrapado, `aria-modal`, retorno de foco al cerrar, `Escape`.
- Formularios: nombre accesible, `aria-describedby` apuntando a ayuda **y** error, `aria-invalid`.
- Botones de icono: nombre accesible (el caso más repetido y el de corrección más mecánica).
- Iconos decorativos: `aria-hidden="true"`.

### 3.2 WS-2 · Controles que sí controlan (hallazgo 5)

`angular.json` declara hoy:

```json
{ "type": "initial", "maximumWarning": "5mb", "maximumError": "6mb" }
```

Un umbral de 5 MB no puede dispararse en una app Angular sana. Es la misma
forma de falla que los dos gates que aprobaban sobre datos obsoletos: existe,
está en verde, y no mide nada.

1. `ng build --configuration production`. Registrar el tamaño real en el plan.
2. Fijar `maximumWarning` en la medición y `maximumError` en +10%.
3. **Si la medición ya excede lo razonable para un ERP Angular, no se acepta como baseline**: se abre ticket de reducción y el budget se fija en el objetivo, con el exceso documentado como deuda (RN-DS-025).
4. Añadir budget de `anyComponentStyle` más estricto que los 25 KB actuales, y un budget dedicado al CSS de tokens (<5 KB gz).

### 3.3 WS-3 · Eje de color (hallazgos 3 y 8)

**No se replanifica.** Sigue el plan vigente
[../../../docs/SharedLuxuryApp/DesignSystem/20260809-plan-shared-design-system-color-unificacion.md](./../../../docs/SharedLuxuryApp/DesignSystem/20260809-plan-shared-design-system-color-unificacion.md),
Sprints 3 a 5, con su numeración de tareas intacta. Estado: Sprints 1–2 cerrados
y auditados. Pendiente: los 18 tokens puente a revertir, 123 hex en 46 archivos,
`_financial-tables.scss`, y el cableado de gates a CI.

Se añade una tarea que sale de esta auditoría y no estaba en aquel plan:

**T3.10 — Prohibir el oro como color de texto (RN-DS-004).** `--ds-warning` y
`--ds-secondary` son ambos `#D4A74A` = 2.23:1 sobre blanco, y se usan 7 veces
como `color:`. `--ds-accent-text-warning` (6.11:1) existe para eso y tiene 0
usos. Sustitución 1:1 + regla en `audit-contrast.mjs` que falle si un token de
relleno aparece como `color:`.

### 3.4 WS-4 · Consolidación de iconos (hallazgo 6)

| Sistema | Usos reales | Destino |
|:---|:---|:---|
| `ion-icon` | 146 | **Conservar** — móvil |
| `iconify-icon` (vía `<app-icon>`) | 2,141 (`app-icon`) | **Estándar web — conservar; NO desinstalar** |
| `feather-icons` + `@types/feather-icons` | **0** | **Desinstalado** (2026-08-09) |

La separación primeicons/web e ion-icon/móvil es legítima y refleja la
arquitectura dual del catálogo. Lo que no es legítimo es tener dos sistemas más
en dependencias, uno de ellos sin un solo uso. Documentar la regla en
`CONVENTIONS.md` §5.5 tras la limpieza.

### 3.5 WS-5 · Storybook: de 0.8% a útil (hallazgo 4)

Instalado y sin usar: `@storybook/angular-vite`, `@storybook/addon-a11y`,
`@storybook/addon-vitest`, `@storybook/addon-docs`, `@chromatic-com/storybook`.
Tres archivos `.stories.ts` para 383 componentes.

**El alcance son 40 componentes nombrados, no cobertura total.** Criterio de
selección, en este orden: (1) los que WS-1 remedia primero — overlays y
formularios; (2) los de mayor frecuencia de import en `src/app/apps/**`; (3) los
que tienen más estados según RN-DS-016.

La lista de 40 se cierra y se aprueba **antes** de escribir la primera historia.
Cada historia cubre los estados de RN-DS-016. Esto desbloquea tres cosas de
golpe: el gate de axe (WS-1), la regresión visual de Chromatic, y la auditoría
de estados que hoy solo se puede hacer abriendo componentes a mano.

### 3.6 WS-6 · Patrones modernos (hallazgos 7 y 10)

**Container queries — 0 usos.** 383 componentes que se adaptan por breakpoint
global. Adoptar en los que aparecen en anchos distintos: cards de dashboard,
tablas embebidas, paneles de detalle, listados en drawer. Meta: ≥12 componentes.

**`@defer` — 0 usos.** Con zoneless activo y componentes pesados en catálogo, no
hay una sola frontera de carga diferida. Candidatos medidos:
`web/charts` (ECharts), `web/gantt`, `web/territory-map`, `web/pivot-table`,

**Lo que ya está bien y no se toca:** 1171 `input()`, 181 `output()`, 42
`model()`, 95 `computed()`, 77 `OnPush`, zoneless activo. La adopción de señales
es real. `effect()`, `linkedSignal()` y `resource()` en 0 usos **no es un
defecto**: son API para casos que esta librería puede no tener. No se fuerza su
uso.

### 3.7 WS-7 · Tokens como producto (hallazgo 9)

`src/styles/design-tokens.d.ts` son 50 líneas escritas a mano que declaran
nombres semánticos (`'primary' | 'secondary' | …`), no los 246 tokens reales. No
hay exportación JSON ni Style Dictionary.

Pipeline: `core/_colors.scss` → build → `tokens.json` + `tokens.css` + `tokens.ts`
(tipos generados). Habilita sync con diseño y type-safety real. **Diferible** —
no bloquea nada y su valor sube cuando exista un segundo consumidor del DS.

### 3.8 WS-8 · Identidad de movimiento (hallazgo 11)

La curva declarada es `cubic-bezier(0.4, 0, 0.2, 1)`: la estándar de Material.
Para una marca cuya promesa es "luxury", el movimiento es identidad, no utilería.
Definir una curva propia y un token `--ds-motion-easing-emphasized`. Esfuerzo
bajo, impacto de marca alto. Requiere decisión de diseño, no de ingeniería.

### 3.9 Migración de Datos

**No aplica.** Ningún workstream toca base de datos, entidades, DTOs ni contratos
de API. El rollback es exclusivamente de código y de configuración (§10).

### 3.10 Tokens de Diseño

Tokens nuevos: solo `--ds-motion-easing-emphasized` (WS-8). El resto de los
workstreams consume los 246 existentes. WS-3 arrastra los `--ds-cat-1..8` ya
especificados en el plan de color §3.6.2.

**Validación pre-delivery** (además de la del plan de color):

- [ ] `npm run audit:a11y` → 0 violaciones sobre la lista remediada
- [ ] `npm run audit:stories` → los 40 componentes clave tienen historia con sus estados
- [ ] `ng build --configuration production` → dentro de budget
- [ ] `grep -rE "color: *var\(--ds-(warning|secondary)\)" src/app/shared/ui` → 0

---

## 4. Backlog de Tasks

**WS-1 · Accesibilidad**
- [ ] A1.1 Instalar `@axe-core/playwright` + `axe-core`
- [ ] A1.2 Crear `scripts/audit-a11y.mjs` en modo reporte
- [ ] A1.3 Registrar baseline de violaciones en JSON versionado
- [ ] A1.4 Barrido ARIA: overlays (5 componentes)
- [ ] A1.5 Barrido ARIA: formularios (4 categorías)
- [ ] A1.6 Barrido ARIA: navegación
- [ ] A1.7 Barrido ARIA: datos
- [ ] A1.8 Nombre accesible en todos los botones de icono
- [ ] A1.9 `aria-hidden="true"` en todos los iconos decorativos
- [ ] A1.10 Activar el gate como bloqueante sobre la lista remediada
- [ ] A1.11 Prueba manual con lector de pantalla en los 10 de mayor uso

**WS-2 · Controles**
- [ ] A2.1 Build de producción y registro de la medición real
- [ ] A2.2 Calibrar budgets (o abrir ticket de reducción si la medición excede)
- [ ] A2.3 Budget dedicado al CSS de tokens
- [ ] A2.4 Cablear los 3 gates de color + los 2 nuevos como bloqueantes de PR

**WS-3 · Color** — ver plan vigente, Sprints 3–5
- [ ] Revertir los 18 tokens puente (pendiente de Sprint 2)
- [ ] T3.10 Prohibir el oro como color de texto

**WS-4 · Iconos**
- [x] A4.1 Desinstalar `feather-icons` + `@types/feather-icons` (0 usos) — **hecho** 2026-08-09
- [ ] A4.2 ~~Migrar los 5 usos de `iconify-icon` y desinstalar~~ — **CANCELADO**: `iconify-icon` es el estándar web vía `<app-icon>` (2,141 usos); no se retira (RN-DS-009 corregida)
- [x] A4.3 Documentar la regla `app-icon`/web · `ion-icon`/móvil en `CONVENTIONS.md` §5.5 — **hecho** 2026-08-09

**WS-5 · Storybook**
- [ ] A5.1 Cerrar y aprobar la lista de 40 componentes clave
- [ ] A5.2 Escribir historias con los estados de RN-DS-016
- [ ] A5.3 Crear `scripts/audit-stories.mjs`
- [ ] A5.4 Conectar Chromatic a CI

**WS-6 · Patrones**
- [ ] A6.1 `@defer (on viewport)` en los 6 componentes pesados
- [ ] A6.2 Container queries en ≥12 componentes

**WS-7 · Tokens como producto** *(diferible)*
- [ ] A7.1 Style Dictionary: JSON + CSS + tipos TS generados

**WS-8 · Movimiento** *(requiere decisión de diseño)*
- [ ] A8.1 Definir curva de marca + token `emphasized`

---

## 5. Fases de Ejecución

**Fase A — Instrumentación (1 día).** A1.1, A1.2, A1.3, A2.1, A2.2, A2.3.
**Criterio de PASO:** `audit:a11y` corre y produce un baseline numérico; los budgets están calibrados contra una medición registrada. *A partir de aquí, toda afirmación sobre a11y y performance es medible.*

**Fase B — Cierre del eje de color (5 días).** WS-3 completo: revertir puentes, Sprints 3–5 del plan de color, T3.10.
**Criterio de PASO:** los 4 greps del plan de color en 0 · los 3 gates de color en verde.

**Fase C — Limpieza de bajo riesgo (1 día).** WS-4 completo.
**Criterio de PASO:** 2 sistemas de iconos en `package.json`, 0 usos huérfanos, regla documentada.

**Fase D — Storybook (6 días).** WS-5 completo.
**Criterio de PASO:** 40 componentes con historia y estados · `audit:stories` en verde · Chromatic corriendo en PR.

**Fase E — Accesibilidad (10 días).** A1.4 a A1.11.
**Criterio de PASO:** `audit:a11y` bloqueante en verde sobre las 4 categorías · prueba con lector de pantalla en los 10 de mayor uso, con hallazgos documentados.

**Fase F — Modernización (3 días).** WS-6 completo.
**Criterio de PASO:** ≥6 `@defer` · ≥12 `@container` · sin regresión de budget.

**Diferidos:** WS-7 y WS-8, sin fecha. WS-8 se desbloquea con una decisión de diseño; WS-7 cuando exista un segundo consumidor del DS.

---

## 6. Criterios de Completitud

```bash
cd client/angular

# a11y
npm run audit:a11y                                                     # exit 0
grep -rho "aria-describedby" src/app/shared/ui | wc -l                 # > 0
grep -rho "aria-hidden" src/app/shared/ui | wc -l                      # >> 1

# controles
ng build --configuration production                                     # dentro de budget
npm run audit:stories                                                   # exit 0

# color (heredado del plan vigente)
npm run audit:tokens                                                    # 0 en shared/ui
npm run audit:contrast                                                  # 0 FAIL
npm run audit:token-refs                                                # exit 0
grep -rE "color: *var\(--ds-(warning|secondary)\)" src/app/shared/ui | wc -l   # 0

# iconos
node -e "const p=require('./package.json');const d={...p.dependencies,...p.devDependencies};
  console.log(Object.keys(d).filter(k=>/iconify|feather/i.test(k)).length)"    # 0

# patrones
grep -rho "@defer" src/app/shared/ui | wc -l                            # >= 6
grep -rho "@container" src/app/shared/ui | wc -l                        # >= 12
```

No automatizable, obligatorio igual:
- [ ] Prueba con lector de pantalla (NVDA o VoiceOver) en los 10 componentes de mayor uso, con hallazgos escritos
- [ ] Navegación completa solo por teclado en un flujo end-to-end
- [ ] Revisión visual light+dark de las 12 pantallas de referencia (heredada del plan de color, T1.12)
- [ ] Lista de 40 componentes de Storybook aprobada por Tech Lead antes de la Fase D

---

## 7. Riesgos & Mitigaciones

Tabla de §0.3, más los residuales:

| Riesgo | Impacto | Mitigación | Responsable |
|:---|:---|:---|:---|
| Sin git, un error de ejecución no se revierte | Pérdida de trabajo | Ningún workstream borra archivos. Copia de respaldo de `src/styles` y `shared/ui` antes de cada fase (§10) | Ejecutor |
| Las 308 violaciones de `audit:tokens` fuera de alcance bloquean PR al endurecer gates | CI rojo para módulos ajenos | Los gates entran bloqueantes solo para `shared/ui` y `styles`; `apps/**` en modo aviso con ticket propio | Tech Lead |
| WS-8 se queda esperando una decisión de diseño para siempre | Deuda silenciosa | Está explícitamente diferido, no pendiente. Si en 2 meses no hay decisión, se cierra como "no se hará" | Tech Lead |
| **API (.NET) no arranca: `PendingModelChangesWarning` en `ApplicationDbContext` (drift de EF entre el modelo y las migraciones)** | **Activo** — sin backend no hay login, no hay medición de a11y autenticada, y las **Fases D (Storybook) y E (shell) quedan detenidas** | Resuelve el backend (`dotnet ef migrations add` + apply) — **fuera del alcance de este plan**; lo decide el Backend Lead. **No suprimir el warning en `appsettings.Development.json`/config:** silenciar una señal de drift para desbloquear una medición es el mismo anti-patrón que prohíbe RN-DS-026. Dejarlo escalado hasta que el backend se restaure | Backend Lead |

**Hallazgos diferidos con justificación** (no son omisiones):
- **12 · Sin OKLCH/P3.** Baja prioridad para un ERP. Se reevalúa si aparece el sitio público de marketing.
- **13 · Sin versionado del DS.** Hoy es un monolito con un solo consumidor. SemVer, deprecación y RFC se justifican cuando exista el segundo.
- **14 · SSR ausente.** No es un defecto: es una suposición del prompt de auditoría que este repo no cumple.

**Deuda identificada — tokens `--ds-*` huérfanos fuera del alcance cerrado del DS (RN-DS-026).**
Registrado en Fase A. El gate `audit:token-refs` comprueba de forma bloqueante solo
`src/app/shared/ui/**`; el escaneo completo de `src/app/**` queda en modo REPORTE y
no afecta el `exit code`. Estos huérfanos viven en módulos de negocio (`apps/**`),
que la §2 de ambos planes declara OUT-OF-SCOPE. No se amplía la superficie del DS
para silenciarlos: cada uno es un ticket propio del eje correspondiente.

Los 18 tokens puente añadidos en Sprint 2 (T2.6) del plan de color se eliminaron en
Fase A (RN-DS-026: un gate rojo por fuera de alcance se acota, no se tapa). Vuelven a
ser huérfanos; sus call sites reales:

| Token (18 puentes revertidos) | Eje | Call sites (módulos de negocio) |
|:---|:---|:---|
| `--ds-bg-card`, `--ds-bg-secondary`, `--ds-bg-tertiary` | superficie/bg | `operations.luxuryapp/panic-alert/*` (3) |
| `--ds-border-subtle` | borde | `mantenimiento.luxuryapp/inspection/lista-inspecciones.scss` |
| `--ds-color-focus` | borde/foco | `mantenimiento.luxuryapp/inspection/lista-inspecciones.scss` |
| `--ds-secondary-hover` | color | `auth.luxuryapp/{login,reset-password,recovery-password}-mobile.ts` |
| `--ds-primary-dark` | color | `admin.luxuryapp/.../catalog-mobile/*` (5) |
| `--ds-shadow-focus-md` | sombra | `mantenimiento.luxuryapp/inspection/lista-inspecciones.scss` |
| `--ds-md-radius`, `--ds-md-radius-sm` | radio/elevación (Material) | `admin.luxuryapp/.../catalog-layout/catalog-layout.scss` |
| `--ds-md-elevation-1`, `--ds-md-elevation-4` | radio/elevación (Material) | `admin.luxuryapp/.../catalog-layout/catalog-layout.scss` |
| `--ds-font-size-xs` | **tipografía** | `web.luxuryapp/_web-luxury.scss` |
| `--ds-font-size-sm` | **tipografía** | `web.luxuryapp/*` (10: `_web-luxury`, `operations`, `maintenance`, `legal`, `landing`, `hr`, `accounting`, …) |
| `--ds-font-size-base` | **tipografía** | `web.luxuryapp/*` (11: `operations-page`, `legal`, `hr`, `accounting`, `landing`, varios `maintenance/procedures/*`) |
| `--ds-font-size-lg` | **tipografía** | `web.luxuryapp/*` (4: `operations`, `legal`, `hr`, `accounting`) |
| `--ds-font-size-xl` | **tipografía** | `web.luxuryapp/maintenance/procedures/{staff-evaluation,machinery-survey}.scss` |
| `--ds-font-size-3xl` | **tipografía** | `web.luxuryapp/maintenance/procedures/supplier-review.scss` |

> La mayoría de los 18 pertenece al **eje de tipografía** (6 tokens de tamaño de
> fuente, todos en `web.luxuryapp`) y al **eje de radios/elevación estilo Material**
> (4 tokens en un único componente de catálogo). El resto son superficies, bordes,
> color y sombra en módulos aislados. Cada uno debe resolverse en su eje propio
> (tipografía/radios/superficie), no como puente en `theme/_variables.scss`.

**Huérfanos adicionales (pre-existentes, no son puentes de T2.6):**

| Token | Eje | Call site |
|:---|:---|:---|
| `--ds-purple` | color (paleta) | `cobranza.luxuryapp/cobranza-online/analysis/cobranza-online-analysis.html` |
| `--ds-purple-light` | color (paleta) | `cobranza.luxuryapp/cobranza-online/analysis/cobranza-online-analysis.html` |

> `--ds-purple` / `--ds-purple-light` referencian un token de paleta púrpura que
> nunca se definió. Ticket aparte del eje de color (WS-3), no del eje tipográfico.

**Deuda identificada — WS-4 Iconografía (2026-08-09, corregido)**

| Ítem | Detalle |
|:---|:---|
| CDN de Iconify (`api.iconify.design`) | `core/services/icon-preload.service.ts` hace fetch en runtime a `https://api.iconify.design` junto a `api.simplesvg.com` y `api.unisvg.com` (ambos en `connect-src` de la CSP). Es deliberado y funciona. **Trade-off:** para un ERP en redes corporativas, si el CDN está bloqueado o cae, no hay iconos en ninguna pantalla. Iconify soporta sets empaquetados offline (disponibilidad vs privacidad vs tamaño de bundle). **Decisión del Tech Lead:** no se cambia el modo en esta entrega; queda documentado como riesgo. |

---

## 8. Dependencias Externas

| Dependencia | Estado | Nota |
|:---|:---|:---|
| `@axe-core/playwright` + `axe-core` | **A instalar** | Bloquea toda la Fase A |
| `@playwright/test` 1.62.1 | Instalado | Runner para el gate de a11y |
| Storybook (angular-vite) + addon-a11y + addon-vitest | Instalado, sin usar | Base de las Fases D y E |
| `@chromatic-com/storybook` | Instalado, sin usar | Requiere cuenta y token en CI |
| `style-dictionary` | **A instalar** | Solo WS-7 (diferido) |
| `stylelint` | **A evaluar** | Los gates propios ya cubren tokens; puede ser redundante |

---

## 9. Métricas & KPIs de Éxito

Los 12 KPIs de §0.1, verificados al cierre de cada fase. Dos requieren
re-medición del baseline **antes** de poder fijarse: el #1 (violaciones axe,
hoy sin medir) y el #4 (budget, cuya línea base actual no es una medición sino
un número inventado). Ambos se cierran en la Fase A.

### 9.1 Medición real del bundle — Fase A (2026-08-09)

`ng build --configuration production` sobre `client/angular` (build de
aplicación Angular 22, optimization scripts on / styles off, hash all):

| Concepto | Raw | Transfer (gz est.) |
|:---|---:|---:|
| **Initial total** | **4.06 MB** | 645.06 kB |
| ├ `main` (eager) | 3.18 MB | 583.54 kB |
| ├ `styles` (global CSS) | 884.02 kB | 61.02 kB |
| └ `polyfills` | 494 B | 494 B |
| Lazy chunks | ~1300 archivos (heic-to 3.00 MB, index 1.15 MB, …) | — |

**Decisión de calibración (RN-DS-025).** El initial mide **4.06 MB crudos** pero
**645 KB de transferencia** (lo que realmente recibe el usuario). Para un ERP con
rango normal** de esa clase de aplicación: la transferencia no es el problema.
La deuda de reducción sigue siendo válida, pero se justifica por
**mantenibilidad y tiempo de parseo del `main` eager (3.18 MB)**, no porque la
transferencia sea escandalosa. Por tanto los budgets se calibran para **informar,
no para gritar**.

- `budgets.initial`: `maximumWarning: "4.2mb"`, `maximumError: "4.5mb"`. Con
  4.06 MB real **no dispara ni warning ni error** hoy.
- `budgets.anyComponentStyle`: `maximumWarning: "19kb"`, `maximumError: "20kb"`.
  Con máx real 18.11 KB (`preventive-maintenance.scss`) **no dispara warning** hoy.
- `styles` global: 884 KB crudo / 61 KB gz — dentro de lo esperado para el DS

**Meta de reducción de bundle (documentada, NO como warning eterno).** El objetivo
de 3 MB inicial se registra aquí como meta con delta explícito, no como umbral de CI
que se ignora a las dos semanas:

| | Crudo | Transferencia |
|:---|---:|---:|
| Estado actual (Fase A) | 4.06 MB | 645 KB |
| Objetivo | **3.0 MB** | (mantener <700 KB) |
| **Delta a reducir** | **−1.06 MB (−26%)** | — |

- Acción (WS-2 / hallazgo abierto): carga diferida de librerías pesadas (echarts,
  pdfjs, leaflet, quill, fullcalendar) y route-level code splitting del `main`
  eager de 3.18 MB.
- Horizonte sugerido: Fase B/C (post-remediación de color), antes del cierre de
  WS-2. El repo aún no tiene git, así que la fecha se fija al inicializar el repo.

- **Budget dedicado de CSS de tokens (<5 KB gz):** **no se puede aislar** porque
  el CSS de tokens vive dentro del bundle global `styles` (884 KB raw / 61 KB
  gz), no como entrada propia. Se aplica el fallback de A2.3: se endurece
  `anyComponentStyle` (arriba) y se deja registrado como deuda. Requiere separar
  el CSS de tokens en su propia entrada de build (alineado con WS-7 —
  tokens como producto / Style Dictionary) para poder presupuestarlo de forma
  aislada.

### 9.2 Baseline de accesibilidad (axe-core) — Fase A (2026-08-09, sesión autenticada)

`node scripts/a11y-login.mjs` (lee `A11Y_USER`/`A11Y_PASS` por variable de
entorno, guarda `.a11y-auth.json`) + `node scripts/audit-a11y.mjs` (modo
reporte, RN-DS-037, reutiliza `.a11y-auth.json`). **Regla dura:** las
credenciales NO se escriben en ningún archivo del repo. Se sirvió el build por
`ng serve` y axe corrió sobre las rutas de `a11y-targets.json` con sesión
`admin`.

**Resultado: 6/6 rutas evaluadas, 25 violaciones, 5 reglas distintas.** Todas
las rutas objetivo existen y renderizan contenido propio (ninguna cayó en el
muro de auth con sesión válida; se verificó que `/dashboard`, `/home`,
`/operations`, `/admin` y `/cobranza` son rutas reales, no suposiciones). El gate
sigue en modo reporte (`exit 0` siempre).

Violaciones por regla e impacto:

| Regla axe | Impacto | Rutas afectadas | Nodos |
|:---|:---|---:|---:|
| `button-name` | critical | 6 | 75 |
| `image-alt` | critical | 6 | 18 |
| `color-contrast` | serious | 6 | 26 |
| `link-name` | serious | 6 | 6 |
| `scrollable-region-focusable` | serious | 1 | 1 |
| **Total** | | | **25 violaciones / 126 nodos** |

- `button-name`, `image-alt`, `link-name` y `color-contrast` aparecen en las 6
  rutas porque viven en el **shell compartido** (sidebar, topbar, menús, iconos
  decorativos sin `alt`/`aria-label`). Son defectos de la capa shell: se
  corrigen una vez y benefician a todo el sistema.
- `scrollable-region-focusable` es 1 nodo en 1 ruta (panel con scroll sin foco de
  teclado).
- El número **25** es el baseline real del KPI #1 (antes era "0" porque solo se
  alcanzaba el login). No es representativo del riesgo total (383 componentes):
  el baseline crece en la Fase D vía Storybook (sin auth) y en la Fase E al
  barrer más rutas y componentes.
- Artefacto versionado: `docs/analisis/20260809-a11y-baseline.json` (en la raíz,
  junto a `20260801-analisis-design-system-fase1.md`).
- El gate arranca en modo reporte: `exit 0` siempre; no bloquea CI hoy.

---

## 10. Rollback Plan

**CORREGIDO 2026-08-10.** La versión anterior de esta sección afirmaba que no
había repositorio git y definía el rollback como copias manuales de carpeta. Era
falso: `client/angular` es un repositorio git independiente (`main`), igual que
`api/` y `client/flutter/`. La comprobación original se hizo desde la raíz
`d:\repos\luxuryapp-api`, que solo es un contenedor, y `git` busca hacia arriba,
nunca hacia abajo.

Rollback real, por fase:

| Fase | Rollback |
|:---|:---|
| A | `git checkout -- angular.json package.json` · desinstalar axe |
| B | `git checkout -- src/styles/ src/app/shared/ui/`. Los gates se conservan: su rojo es información válida |
| C | `git checkout -- package.json` · `npm i` |
| D | Borrar las historias nuevas (archivos sin seguimiento) |
| E | `git checkout -- <ruta>` por categoría, no en bloque |
| F | `git checkout -- <ruta>` por componente |

**Riesgo activo detectado el 2026-08-10:** el árbol de trabajo tiene **270
cambios de código sin comitear** y el último commit es del 2026-08-07. Todo el
trabajo de este plan y del plan de color está sin proteger, mezclado con cambios
previos ajenos a ambos planes (módulos de cobranza y contabilidad).

Antes de la siguiente fase de alto riesgo visual conviene comitear, separando lo
que pertenece a estos planes de lo que ya estaba en el árbol. Es decisión del
Tech Lead: el repo es suyo y la mezcla es anterior a este trabajo.

---

## 11. Post-Implementation Review

- ¿Los 12 KPIs llegaron a su target? Registrar valor final por fila.
- ¿Cuántas violaciones axe arrojó el baseline real de la Fase A frente a lo que el equipo esperaba?
- De las violaciones de a11y, ¿qué proporción fueron el mismo defecto repetido (botón de icono sin nombre) frente a defectos únicos? Eso indica si el problema era de conocimiento o de plantilla.
- ¿La medición real de bundle justificó el budget, o hubo que abrir ticket de reducción?
- **Learning estructural pendiente de la auditoría de color:** los gates `audit-css`, `audit-design`, `audit-ui` y `audit-design-conventions` no han sido revisados con la pregunta que hundió a los otros dos — ¿de dónde sacan sus datos y qué cubre su glob? Auditarlos.
- **Tercer caso de gate verde sobre fallo real (RN-DS-027):** `audit-contrast.mjs` reporta 26 PASS / 0 FAIL sobre pares de tokens declarados, mientras axe-core encontró 26 nodos con `color-contrast` fallido en el DOM renderizado. Ambos son correctos (uno valida tokens, el otro lo que se pinta), pero el gate estático en verde NO autoriza afirmar que el contraste se cumple. Casos previos de la misma familia: el gate de tokens huérfanos que se silenció con 18 puentes (RN-DS-026) y el budget de 5 MB que nunca podía dispararse (RN-DS-025). Regla general: lo verificable en el DOM debe validarse en el DOM.
- ¿Las 40 historias fueron suficientes para desbloquear el gate de a11y, o hizo falta ampliar la lista?
- **Cuarto caso de la misma familia, esta vez en la planificación (2026-08-10):** se afirmó durante nueve días que el repo no tenía control de versiones, a partir de un `git rev-parse` ejecutado desde el contenedor en vez del repositorio. La conclusión se propagó a §2, §7, §10 y a todos los prompts del ejecutor, que hicieron respaldos manuales innecesarios. Misma forma de falla que los gates ciegos: el comando era correcto, su ámbito no. La regla vale también para quien planifica, no solo para quien ejecuta.
- ¿Cuánto trabajo quedó sin comitear durante la ejecución, y qué se perdió por ello?

---

**Estado:** Propuesto
**Requiere aprobación de:** Tech Lead — Fase 0, §2 (alcance) y §5 (orden de fases) son críticas
**Siguiente paso:** aprobación → Fase A (1 día) → re-medición de los KPIs #1 y #4


---

## Anexo — Extensión del gate de tokens a `src/styles` (2026-08-10)

**Hallazgo.** Hasta hoy `scripts/audit-ds-tokens.mjs` solo inspeccionaba
`src/app/**`. Nunca miró `src/styles/**`, las hojas del propio Design System.
Cuarta brecha de cobertura de la misma familia (RN-DS-024), y la más irónica:
el control que prohíbe colores hardcodeados jamás inspeccionó el sistema de
colores.

**Cambio.** El gate cubre ahora `src/styles/**/*.{scss,css}` con una lista
explícita de lugares autorizados a declarar color (`COLOR_SOURCE_ALLOWLIST`):

| Archivo | Alcance | Por qué |
|:---|:---|:---|
| `core/_colors.scss` | todo | Paleta fuente: es donde nacen los valores |
| `theme/_variables.scss` | todo | Exposición de tokens + alto contraste (RN-DS-013) |
| `custom/_financial-tables.scss` | solo su bloque `:root` | Capa con alcance documentada (RN-DS-041) |

Cualquier otro archivo debe referenciar tokens. Se añadió además el descarte de
líneas comentadas, que producían 3 falsos positivos.

**Inventario real que produjo (85 hallazgos en 11 archivos):**

| Archivo | Hallazgos |
|:---|---:|
| `shared/_sidebar.scss` | 24 |
| `custom/_print.scss` | 24 |
| `shared/_auth.scss` | 19 |
| `web/_buttons.scss` | 6 |
| `web/_tables.scss` | 3 |
| `mobile/_ionic-rn-theme.scss` | 3 |
| `custom/_committee.scss` | 2 |
| `web/_inputs.scss`, `custom/_list.scss`, `core/_mixins.scss`, `base/_global.scss` | 1 c/u |

Nota: el conteo supera lo estimado a mano (~50) porque el gate también detecta
`rgba()`, invisible para una búsqueda de hex.

**Total del gate:** 330 (245 en `src/app/**`, fuera de alcance por §2; 85 en
`src/styles/**`, en alcance).

**Pendiente.** Remediar los 85. `_sidebar.scss` y `_auth.scss` resultaron
mayores que `_print.scss`, que era el candidato original: la mayoría son
`rgba(255,255,255,x)` sobre fondos oscuros, buenos candidatos a un token de
opacidad sobre superficie inversa en vez de 24 literales repetidos.

### Remediación de `src/styles` — primera tanda (2026-08-10)

**85 → 41 hallazgos.** `shared/_sidebar.scss` 24 → 0 · `shared/_auth.scss` 19 → 0.

**Defecto de producto encontrado y corregido.** El header de escritorio fue
oscuro en su origen y se rediseñó a fondo claro, pero la migración quedó a
medias: los iconos y el breadcrumb se corrigieron y el resto del texto siguió en
blanco. Consecuencia: `app-header-employee-monitor .customer-name` era
`rgba(255,255,255,0.95)` sobre `#ffffff` — **el nombre del condominio era
invisible**. Latente, porque solo se renderiza para usuarios con UN condominio
asignado (rama `@else` de `header-employee-monitor.html`); con varios se muestra
el selector. Verificado en pantalla antes y después.

En el mismo bloque: la línea inferior del header era blanca sobre blanco, y
`var(--primary-color)` era una referencia a un token inexistente que se había
escapado de la corrección de T2.4. Se eliminaron 5 declaraciones muertas (tokens
de breadcrumb pisados por un override posterior, y un bloque `.p-select` que no
coincide con ningún elemento).

Ninguno de los tres lo habría detectado `audit:contrast`: valida pares de tokens
y estos eran valores sueltos. Salieron al extender el gate a `src/styles`.

**Escala nueva `--ds-on-dark-*` (RN-DS-041).** Siete niveles de blanco sobre
superficie oscura, más estados y bordes. Los niveles NO se consolidaron: se midió
y sobre fondo oscuro un paso de 0.05 en opacidad da ΔE ≈ 4, perceptible.
Consolidar habría sido un cambio visual, no una refactorización.

Distinción de diseño registrada: `--ds-on-dark-*` es **invariante al tema** (la
tarjeta de login y el desplegable navy son oscuros en ambos temas), mientras
`--ds-state-hover` / `--ds-state-active` **sí giran** — un velo negro sobre el
header navy en modo oscuro no se vería. Corrige un defecto latente adicional.

**Verificación de equivalencia.** Compilado antes/después con valores resueltos:
acceso 24 = 24 declaraciones con un único cambio imperceptible (borde 0.10 →
0.12, ΔE 2.4); sidebar 80 → 75, y los 13 cambios son exactamente los arreglos
listados arriba.

**Afinaciones del gate.** Ignora líneas comentadas (3 falsos positivos) y
`rgba(var(--token), .4)`, que ya usa token y solo aplica opacidad (4 más).

**Pendiente:** 41 hallazgos en 8 archivos — `custom/_print.scss` (24),
`web/_buttons.scss` (6), `web/_tables.scss` (3), `mobile/_ionic-rn-theme.scss`
(3), y 1–2 en cinco archivos más.

### Remediación de `src/styles` — cierre (2026-08-10)

**85 → 0.** Todo el sistema de estilos referencia tokens. Las 245 violaciones que
quedan en el gate son de `src/app/apps/**`, fuera de alcance por §2.

| Archivo | Antes | Después |
|:---|---:|---:|
| `shared/_sidebar.scss` | 24 | 0 |
| `custom/_print.scss` | 24 | 0 |
| `shared/_auth.scss` | 19 | 0 |
| `web/_buttons.scss` | 6 | 0 |
| `web/_tables.scss`, `mobile/_ionic-rn-theme.scss` | 3 c/u | 0 |
| `custom/_committee.scss` | 2 | 0 |
| `web/_inputs.scss`, `core/_mixins.scss`, `base/_global.scss` | 1 c/u | 0 |

**Segundo defecto de producto: imprimir en tema oscuro.** `_print.scss` aplica
`print-color-adjust: exact` sobre `*`, que obliga al navegador a mandar fondos y
colores tal como se ven en pantalla. No había ningún reset de tema, así que
imprimir con el tema oscuro activo enviaba a la impresora **páginas de fondo navy
con texto claro**: tóner desperdiciado y documentos ilegibles, en un ERP donde se
imprimen presupuestos, estados de cuenta y actas. Se añadió un bloque dentro de
`@media print` que restaura los valores claros de los tokens de superficie y
texto; todo lo que use tokens se corrige solo.

**Capas con alcance nuevas (RN-DS-041).** Tres, todas por la misma razón: el
color no tiene equivalente en el DS y alinearlo sería un cambio visible.

| Capa | Archivo | Motivo |
|:---|:---|:---|
| `--pr-*` | `custom/_print.scss` | Densidad de tinta sobre papel: otro medio, invariante al tema por definición |
| `--btn-shell-*` | `web/_buttons.scss` | ΔE 28.3 (warning) y **70.0** (help: el botón es violeta, `--ds-help` es cian por estar aliaseado a info) |
| `--gl-*` | `base/_global.scss` | Placeholder de campo inválido: ΔE 5.3 contra el token más cercano |

**Tokens nuevos del DS.** Familia `--ds-on-dark-*` (7 niveles + estados y bordes),
`--ds-state-hover/active/ripple`, `--ds-surface-glass`. Los `--ds-on-dark-*` son
invariantes al tema; los `--ds-state-*` giran.

**Cambios visuales medidos y aplicados.** Solo tres, los tintes de fila de
`web/_tables.scss`, que pasaron de colores Tailwind a los semánticos del DS:
success ΔE 3.1 · warning ΔE 4.1 · danger ΔE 1.1. Sutiles pero medibles; se
aplicaron porque dejar dos de tres sin alinear producía una inconsistencia peor.
Conviene mirar una tabla con filas tintadas.

**Afinaciones del gate.** Ignora líneas comentadas, `rgba(var(--token), .4)` y
`rgba($param, .08)` dentro de mixins — tres clases de falso positivo, 8 hallazgos
espurios en total.

**Limitación conocida del gate.** Solo detecta las propiedades `color`,
`background`, `border`, `fill` y `stroke`. Una declaración como
`--mi-token: #hex` pasa desapercibida salvo que el nombre termine en `color`.
Las capas con alcance de la tabla de arriba están en `COLOR_SOURCE_ALLOWLIST`
para documentar la intención, aunque hoy el gate no las alcanzaría.

### CI: gates cableados y control muerto retirado (2026-08-10)

**Hallazgo previo al cableado.** `.github/workflows/encoding-gate.yml` vivía en
la raíz del monorepo, que **no es un repositorio**. GitHub Actions solo ejecuta
workflows desde dentro de un repo, así que ese control nunca corrió. Quinto caso
de la misma familia: un control que existe y no puede dispararse (RN-DS-025).

Se retiró el workflow. **El script que invocaba, `scripts/scan-mojibake.mjs`
(8 KB, cubre api + los tres clientes + hooks), se conserva** y puede ejecutarse a
mano. Si esa cobertura debe automatizarse, el workflow tiene que vivir dentro de
cada repositorio que cubra — no en el contenedor.

Nota: `client/angular` tiene su propio `audit:encoding`
(`scripts/audit-encoding.mjs`), de alcance mucho menor. No sustituye al de la
raíz.

**Gates cableados.** `client/angular/.github/workflows/design-system.yml`, que
es donde el repositorio (`github.com/geshyrihu/luxuryapp-angular`) sí los ve.

Bloqueantes en push y PR a `main`:

| Gate | Exige |
|:---|:---|
| `audit:scss-build` | Los 2 puntos de entrada de `angular.json` compilan |
| `audit:tokens` | 0 colores sueltos en `src/styles` + `shared/ui` |
| `audit:contrast` | 42 pares WCAG AA sobre tokens reales |
| `audit:token-refs` | 0 referencias huérfanas, 0 fallbacks |

Informativo, en job aparte con `continue-on-error`: `audit:a11y`. Levanta
Chromium, corre axe sobre rutas públicas y publica el JSON como artefacto. Pasa a
bloqueante cuando la Fase E cubra las categorías del plan; arrancarlo en rojo hoy
es la forma más rápida de que alguien lo desactive.

**Acotado de `audit:tokens` (RN-DS-026).** Bloquea sobre el alcance declarado y
reporta las 245 violaciones de `src/app/apps/**` como deuda sin fallar el sello.

**`scripts/audit-scss-build.mjs` (nuevo).** Lee los puntos de entrada de
`angular.json` y compila cada uno. Existe porque un cambio en `web/_buttons.scss`
rompió el build y la verificación no lo detectó: se compilaba `styles.scss` y ese
archivo entra por `ds-entry.scss`. El comando era correcto; su alcance no.

**`npm run audit:ds`** encadena los cuatro bloqueantes para correrlos en local.

---

## ⚠️ ESTADO TEMPORAL ACTIVO — `strictTemplates: true` (2026-08-11)

**`client/angular/tsconfig.json` línea 48 está en `strictTemplates: true` y debe
volver a `false` al cerrar la Fase 5 de la migración de iconos.**

Mientras esté activo, `ng build` falla con **924 errores**:

| | |
|---:|:---|
| **161** | `AppIconName` — pendientes de la migración de iconos, en 121 archivos |
| **763** | preexistentes, ajenos a iconos |

Se activó deliberadamente: sin verificación de plantillas, el mecanismo de la
Fase 4 (cada literal `mdi:` sin migrar = error de compilación = lista exacta de
pendientes) no opera, y migrar 3,404 ocurrencias sería búsqueda-y-reemplazo a
ciegas.

**Efecto colateral asumido:** el build está roto para todo el equipo mientras
dure. Hay otro ejecutor trabajando en Reclutamiento en paralelo que se
encontrará los 763 errores ajenos.

### Los 763 son hallazgos reales, no ruido

Estaban ocultos porque la verificación de plantillas llevaba apagada quién sabe
cuánto. Sexto control apagado detectado en este plan, y el de mayor alcance: no
valida NINGUNA plantilla de la aplicación.

| # | Defecto | Consecuencia |
|---:|:---|:---|
| **169** | `variant="outlined"` | El tipo es `"solid"\|"outline"\|"ghost"\|"text"\|"link"`. `"outlined"` no existe: esos botones caen al `else` y **renderizan sólidos**, no con borde. |
| 142 | `string` donde se espera `boolean` | Atributos booleanos pasados como cadena |
| 100 | `WritableSignal<string>` sin invocar | La plantilla imprime el signal, no su valor |
| 61 | `variant="ghost-text"` | Variante inexistente |
| 24 | `string` donde se espera `number` | |
| 16 | `TagSeverity` inválido | |

Los 169 `"outlined"` merecen ticket propio: es un defecto visual en producción,
no deuda abstracta. Ninguno se corrige en la tarea de iconos.

### Decisión pendiente al cerrar la Fase 5

O se devuelve a `false` (y los 763 vuelven a ser invisibles), o se abre un plan
para saldarlos y dejar `strictTemplates: true` de forma permanente. La segunda
es la correcta a largo plazo; la primera es la que no bloquea a nadie hoy.

---

## Cierre de la migración de iconos — 606 iconos en blanco (2026-08-11)

`strictTemplates` volvió a `false`, como estaba previsto. Los 763 errores ajenos
quedan otra vez invisibles y la decisión de arriba sigue abierta.

Pero al auditar el cierre apareció un defecto que ningún control detectó.

### Qué pasó

La Fase 4 tradujo el catálogo bien: los 534 valores de `app-icon.catalog.ts`
existen en el set real de Iconify, verificados uno a uno. `mdi:account-supervisor`
quedó en `material-symbols-light:supervised-user-circle`, no en un calco.

Fuera del catálogo la traducción no ocurrió: se cambió el prefijo y se dejó el
nombre de mdi. `mdi:file-pdf-box` quedó en `material-symbols-light:file-pdf-box`,
que no existe. **206 nombres distintos en 606 usos.**

### Por qué el compilador no lo vio

`AppIconName` es la unión de los 534 valores, así que un literal inválido en
`[icon]` sí es error de tipo. El problema es que casi ningún literal llega por
ahí:

| Vía | Tipo | ¿Lo ve el compilador? |
|:---|:---|:---|
| `[icon]="'…'"` sobre `<app-icon>` | `AppIconName` | Sí |
| `iconClass="…"` sobre `il-button` / `iw-button` | `string` | **No** |
| `icon: "…"` en menús y datos de `.ts` | `string` | **No** |

La Fase 3 —tipar esos campos a `AppIconName`— era justamente lo que cerraba esa
puerta, y quedó sin hacer. Sin ella, la premisa de la Fase 4 («migrar guiado por
los errores del compilador») se cae: el compilador solo guiaba en la vía que ya
estaba tipada. En el resto se avanzó a ciegas.

Y la falla es muda: `<iconify-icon>` con un nombre desconocido no lanza error, no
avisa por consola, no rompe el build. No dibuja nada. Solo se ve abriendo la
pantalla.

### Reparación aplicada

El propio catálogo era la tabla de traducción que faltaba: sus claves PascalCase
son el nombre mdi de origen (`AccountGroup` ⇄ `mdi:account-group`), y su valor es
la traducción ya revisada. Con eso se repararon 194 de los 206; los otros 12 se
resolvieron a mano contra el set real.

| | |
|:---|---:|
| Literales corregidos | 606 |
| Nombres alineados al valor curado del catálogo | 40 |
| `resolvedIconClass` ausente en `MobileButtonBase` | 17 botones |
| `<app-icon>` usado sin declarar en `imports` | 8 componentes |
| Traducciones flojas corregidas en el catálogo | 3 |

Las tres del catálogo eran `contactless` para una credencial, `event-note` para
«agregar al calendario» y `photo` para «varias imágenes»: existen y se dibujan,
pero no dicen lo que el sitio necesita decir.

Caso aparte: 13 nombres sobrevivieron porque **por coincidencia** también existen
en Material Symbols (`download-outline`, `layers-outline`, `table-large`,
`cards`…). Renderizaban, así que ninguna validación de existencia los habría
marcado nunca; se alinearon al valor que el catálogo ya tenía para ese concepto.

### Control nuevo: `audit:icon-names`

`scripts/audit-icon-names.mjs`, en `audit:ds` y en el workflow. Exige que todo
literal `material-symbols-light:*` del código sea un valor declarado en el
catálogo. Offline y determinista: valida contra el catálogo, no contra la API de
Iconify, y de paso obliga a que las altas pasen por la traducción curada.

Se verificó que **falla** ante un nombre inventado, no solo que pasa. Es la
lección de RN-DS-025 aplicada al gate que se escribe para no repetir el fallo.

Lo que no puede ver, declarado en el propio script y en `icon-mapping.ts`: los
nombres que se arman en ejecución. `resolveToIconify` termina en
`` `material-symbols-light:${cleanName}` `` para cualquier nombre no mapeado —ahí
es donde nace la falla muda, y ningún análisis estático la alcanza. La defensa es
que todo lo que llegue esté en `PRIME_TO_ICONIFY`.

### Estado

- `mdi:` — 0
- Nombres de icono inválidos — 0 (gate en verde, y comprobado que puede fallar)
- Los 4 gates del DS — en verde
- Compilación — 23 errores, **todos preexistentes y ajenos a iconos**:
  15 en `catalog-guia.html` (HTML mal cerrado, sin modificar desde `d2a72352`),
  4 `p-card` sin importar, y 4 de API de componentes (`customClass` y `tooltip`
  no son inputs; el input real se llama `styleClass` por alias).

### Pendiente

`pi pi-`: **137 usos en 28 archivos** (no 83 en 30). No es reemplazo textual: los
`<i class="pi pi-x">` crudos exigen cambio estructural a `<app-icon>`, y
`pi-spin`/`pi-spinner` son animaciones de carga, otra semántica.

`fluent-color:`: 8 usos en 2 archivos, en `icon-preload.service.ts` y
`header-employee-monitor.ts`. Son precarga para `<iconify-icon>`, no entradas de
`<app-icon>`.
