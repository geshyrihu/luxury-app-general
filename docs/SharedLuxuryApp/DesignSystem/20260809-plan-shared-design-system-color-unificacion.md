# Plan de Unificación de Color — Ancla única `#003152`

**Fecha:** 2026-08-09
**Estado:** Propuesto (pendiente de aprobación del Tech Lead)
**Origen:** Análisis de color `client/angular/src/styles` + `client/angular/src/app/shared/ui` (2026-08-09)
**Antecedente:** [../../../docs/SharedLuxuryApp/DesignSystem/20260801-plan-shared-design-system-remediacion.md](./../../../docs/SharedLuxuryApp/DesignSystem/20260801-plan-shared-design-system-remediacion.md) — este plan **ejecuta y corrige el eje de color** de aquel; no duplica su alcance de tipografía, spacing, fuentes ni budgets.
**Alcance:** `client/angular/src/styles/**`, `client/angular/src/app/shared/ui/**`, `client/angular/scripts/audit-*.mjs`
**Protocolo:** [plan-creation-protocol.md](../../conventions/operations/plan-creation-protocol.md) · [plan-agent-instructions.md](../../conventions/operations/plan-agent-instructions.md) · [design-tokens-rule.md](../../conventions/ui/design-tokens-rule.md)
**Ruta oficial:** `docs/plans/20260809-color-unificacion-ancla-003152-plan.md`

> **Regla de garantía:** el eje de color no se declara remediado hasta que los
> cuatro greps de la §6 devuelvan 0 **y** los dos gates de CI reconstruidos
> (§3.4) pasen leyendo valores reales, no tablas hardcodeadas.

---

## FASE 0: Pre-Planeación

### 0.1 Problem Statement

```
Actualmente, el equipo frontend sufre de tres paletas primarias en conflicto y
639 colores hardcodeados en la librería de UI compartida cuando intenta
garantizar identidad visual y accesibilidad en 200+ módulos,
lo que resulta en dos azules de marca conviviendo en la misma pantalla,
50 usos congelados en tema claro que ignoran el dark mode, y dos gates de CI
que reportan verde sobre datos obsoletos.

Esto afecta a la totalidad de la superficie visual de client/angular:
1,189 archivos en shared/ui y 50 archivos en styles/.
```

**Causa raíz.** `core/_colors.scss` se re-ancló al navy `#003152` en algún punto,
pero nada de lo que depende de él se actualizó: ni `DESIGN.md`, ni
`theme/mypreset.ts`, ni los comentarios de auditoría WCAG, ni la tabla de
contrato de `audit-contrast.mjs`. La declaración *"Fuente Única de Verdad"* del
encabezado de `_colors.scss` no se sostiene hoy.

### KPIs de éxito (baseline → target)

| Métrica | Baseline | Target | Sprint | Verificación |
|:---|:---|:---|:---|:---|
| Paletas primarias en conflicto | 3 | 1 | S1 | `grep -rio "#003152" src/styles \| wc -l` → 1 |
| Hex en `shared/ui` | 639 (69 distintos) | 0 | S3 | `npm run audit:tokens` extendido a `.ts` |
| Fallbacks `var(--x, #hex)` en `shared/ui` | 516 | 0 | S2 | grep §6 |
| Tokens `--ds-*` usados pero indefinidos | 15 (50 usos) | 0 | S2 | script `audit-token-refs.mjs` |
| Tokens con fallbacks contradictorios | 19 | 0 (n/a) | S2 | eliminados con los fallbacks |
| Combinaciones AA que fallan (valor real) | 6 | 0 | S1 | `audit-contrast.mjs` reconstruido |
| Cobertura del gate de tokens | solo `.scss` (2/1189 archivos de shared/ui) | `.scss` + `styles:[]` en `.ts` | S1 | inspección del glob |
| Usos de semánticos como color de texto | 35 | 0 | S3 | grep `color:\s*var(--ds-(warning\|success\|danger))` |
| Escalones duplicados en `$surface-dark-*` | 2 pares (700=800, 900=950) | 0 | S1 | script de monotonía |
| Rupturas de monotonía en `$surface-dark-*` | 1 (slot 400) | 0 | S1 | script de monotonía |

---

### 0.2 Matriz de Reglas del Design System (4 niveles)

Continúa la numeración de [20260801](./../../../docs/SharedLuxuryApp/DesignSystem/20260801-plan-shared-design-system-remediacion.md).
Reglas **nuevas** marcadas con ✦.

**Nivel 1 — Invariantes de dominio (inmutables)**

| RN | Regla | Mapeo a código |
|:---|:---|:---|
| RN-DS-001 | Todo valor visual viene de un token único; prohibido hardcode | `core/_colors.scss` |
| RN-DS-002 | Un token = un valor; un valor no puede tener dos significados | `theme/_variables.scss:33` vs `theme/mypreset.ts:16` |
| RN-DS-003 | Texto ≥4.5:1 (AA); no-texto ≥3:1, validado automáticamente | `scripts/audit-contrast.mjs` |
| RN-DS-004 | La marca no puede imponer un color que viole WCAG 2.2 AA | oro `#D4A74A` sobre blanco = 2.23:1 |
| ✦ RN-DS-005 | **`#003152` es el único ancla de marca. Existe exactamente una vez en todo el repo: `$primary-700` en `core/_colors.scss`. Ninguna otra fuente declara un "primary".** | `core/_colors.scss:31` |
| ✦ RN-DS-006 | **Toda la rampa primary es monocroma: H=204 ±2° en los slots con luminosidad L≤90%. Los slots 50 y 100 (L>90%) se validan por pertenencia a la rampa generada a partir del ancla, no por hue medido — a esa luminosidad el hue es numéricamente inestable en 8 bits.** | `core/_colors.scss:24-34` |
| ✦ RN-DS-007 | **Prohibido el fallback en `var()`. `var(--ds-x, #hex)` está vetado: oculta tokens faltantes y fija valores fuera del tema.** | `shared/ui/**/*.ts` |

**Nivel 2 — Flujo y estados (theming lifecycle)**

| RN | Regla | Mapeo a código |
|:---|:---|:---|
| RN-DS-010 | Tema transita solo entre `light\|dark`, sin FOUC | `core/services/theme.service.ts` |
| RN-DS-011 | Dark mode mantiene mapeo 1:1 de tokens semánticos | `theme/_variables.scss:509-731` |
| RN-DS-012 | `prefers-reduced-motion: reduce` → duraciones 0ms | `styles/styles.scss:165` ✓ implementado |
| RN-DS-013 | `prefers-contrast: more` → set `--ds-contrast-*` completo | `theme/_variables.scss:476,703` |
| ✦ RN-DS-015 | **Todo valor visual debe responder al cambio de tema. Un color que no cambia entre light y dark es un defecto, no una decisión, salvo token explícitamente marcado como invariante.** | `shared/ui/**` |

**Nivel 3 — Seguridad / compliance / gobernanza**

| RN | Regla | Mapeo a código |
|:---|:---|:---|
| RN-DS-020 | Fuentes/assets externos respetan CSP vigente | `src/index.html` |
| RN-DS-022 | Cambios en tokens globales exigen aprobación + análisis de impacto | `conventions/styles/styles-rules.md` |
| ✦ RN-DS-023 | **Un gate de CI debe derivar sus datos del código real. Prohibida toda tabla de contrato hardcodeada que pueda divergir de los tokens que valida.** | `scripts/audit-contrast.mjs` (hoy la viola) |
| ✦ RN-DS-024 | **La cobertura de un gate debe corresponder a dónde vive el código. Un glob que excluye el 99.8% del objetivo es una falla de gate, no una limitación.** | `scripts/audit-ds-tokens.mjs:17` (hoy la viola) |

**Nivel 4 — Validación / constraints ejecutables**

| RN | Regla | Verificación |
|:---|:---|:---|
| RN-DS-030 | Grep de hex fuera de `core/` = 0 | `npm run audit:tokens` |
| RN-DS-033 | Lint de contraste automático en cada PR | `npm run audit:contrast` |
| ✦ RN-DS-034 | **El gate de tokens escanea `.scss` **y** los bloques `styles: []` de los `.ts`** | glob `src/app/**/*.{scss,ts}` |
| ✦ RN-DS-035 | **Cero referencias `var(--ds-*)` a tokens no definidos** | `scripts/audit-token-refs.mjs` (nuevo) |
| ✦ RN-DS-036 | **La paleta categórica cumple: texto sobre fill ≥4.5:1 en ambos temas y separación de hue ≥35° entre miembros adyacentes** | `scripts/audit-contrast.mjs` extendido |

---

### 0.3 Pre-Mortem + Flujos

**Pre-Mortem:** *"Salió a producción y fue un desastre. ¿Qué lo causó?"*

| Supuesto fallido | Impacto | Prob. | Mitigación | Responsable |
|:---|:---|:---|:---|:---|
| La rampa nueva cambia contenedores M3 y dark surfaces; nadie revisó visualmente | Regresión visual masiva en 200+ módulos | **Alta** | Sprint 1 termina con captura comparativa light+dark de 12 pantallas de referencia antes de continuar | Ejecutor + Tech Lead |
| Se eliminan los 516 fallbacks antes de definir los 15 tokens faltantes | 50 propiedades CSS se caen (color inválido → hereda) | **Alta** | Orden estricto: Fase 3 (definir tokens) **antes** de Fase 2 (eliminar fallbacks). El backlog lo fuerza. | Ejecutor |
| `mypreset.ts` se alinea slot a slot sin declarar `colorScheme.*.primary.color` | Aura toma `{primary.500}` = `#097fce` como color de marca → azul claro en todos los botones | **Alta** | Task T1.4 declara explícitamente el ancla en ambos colorScheme; criterio de paso incluye inspección de `--p-primary-color` en runtime | Ejecutor |
| El gate de contraste sigue leyendo su tabla y da PASS falso | Se declara remediado con 6 fallos AA vivos | **Media** | T1.6 reconstruye el gate **antes** de tocar la rampa, para que mida la regresión real | Ejecutor |
| `_financial-tables.scss` se migra junto al resto | Tablas financieras rotas, alto costo de verificación manual | **Media** | Fase 7 aislada al final, con su propio criterio de paso y rollback independiente | Tech Lead |
| Los `--ds-cat-*` se usan para significado semántico (rojo = error) | Se pierde el contraste semántico del sistema | **Baja** | Regla documentada + revisión en auditoría: `--ds-cat-*` solo en avatares, series de chart, gantt y mapas | Auditor |
| Ionic `darken()`/`lighten()` de Sass fallan con los hex nuevos | Build roto en `theme/_variables.scss:170-195` | **Baja** | Verificar compilación SCSS en T1.1; los hex nuevos son válidos, la función opera igual | Ejecutor |

**Happy Path:** Se reconstruyen los gates → miden la regresión real (6 FAIL) → se aplica la rampa H=204 única en las 3 fuentes → gates vuelven a verde → se definen los tokens faltantes → se eliminan los 516 fallbacks → se migran los hex duros a tokens → auditoría PASS.

**Sad Path:** La revisión visual de Sprint 1 rechaza la rampa nueva (contenedores M3 demasiado fríos) → se ajusta la curva de saturación de los slots 50–300 conservando H=204 y el ancla → se repite la revisión. La rampa se ajusta; el ancla nunca.

**Edge Path:** Un componente de `shared/ui` depende visualmente de un fallback obsoleto (p.ej. el índigo `#003d9b` se ve "mejor" que `#003152` en ese contexto) → **no** se conserva el fallback; se documenta como excepción con `// ds-ignore` y justificación, o se corrige el diseño del componente.

---

## 1. Resumen Ejecutivo

**Problema.** Copiar §0.1 tal cual.

**Solución.** Cuatro movimientos, en este orden:
1. Reconstruir los dos gates de CI para que midan el código real (hoy dan verde sobre datos obsoletos).
2. Colapsar las 3 paletas primarias en una sola rampa monocroma H=204 anclada en `#003152`, replicada slot a slot en `_colors.scss`, `mypreset.ts` y `DESIGN.md`.
3. Cerrar los 15 tokens inexistentes y eliminar los 516 fallbacks que los estaban tapando.
4. Migrar los ~123 hex duros restantes a tokens semánticos o a una paleta categórica nueva (`--ds-cat-1..8`).

**Beneficios.** Un solo azul de marca en pantalla; dark mode que funciona en el 100% de `shared/ui`; gates que fallan cuando el código falla; y un único punto de cambio para el color de marca.

---

## 2. Scope & Constraints

**IN-SCOPE**
- `client/angular/src/styles/core/_colors.scss` — rampa primary + `$surface-dark-*` + tokens categóricos nuevos
- `client/angular/src/styles/theme/_variables.scss` — exposición CSS, light + dark + high-contrast
- `client/angular/src/styles/theme/mypreset.ts` — alineación slot a slot + declaración explícita del ancla
- `client/angular/src/styles/DESIGN.md` — spec actualizada
- `client/angular/src/app/shared/ui/**` — 639 hex, 516 fallbacks, 15 tokens faltantes, 35 usos semánticos como texto
- `client/angular/src/styles/custom/_financial-tables.scss` — sistema `--rf-*` paralelo (Fase 7, aislada)
- `client/angular/scripts/audit-ds-tokens.mjs`, `audit-contrast.mjs`, `audit-token-refs.mjs` (nuevo)

**OUT-OF-SCOPE**
- Tipografía, spacing, sombras, radios — cubiertos por [20260801](./../../../docs/SharedLuxuryApp/DesignSystem/20260801-plan-shared-design-system-remediacion.md)
- `client/luxuryapp-nx` — congelado READ-ONLY
- Flutter / app móvil nativa
- Módulos de negocio fuera de `shared/ui` (las 162 violaciones que `audit:tokens` ya reporta en `apps/**` son un ticket aparte que **se beneficia** de este plan pero no lo bloquea)
- Rediseño visual: la rampa cambia por coherencia cromática, no por decisión estética nueva

**Constraints**
- El ancla `#003152` es inamovible (RN-DS-005). Todo lo demás se deriva.
- Los otros 4 anclas de `DESIGN.md` (`#1E9B6D`, `#D4A74A`, `#D34B4B`, `#4A90E2`) **ya están sanos** y no se tocan: la divergencia es exclusiva del ramp primario.
- Sin cambios de API, DTOs ni backend.

---

## 3. Arquitectura & Diseño Técnico

### 3.1 Rampa primary — monocroma H=204, ancla en slot 700

**Por qué el ancla queda en 700 y no en 500 (convención Tailwind):** `#003152`
da 13.45:1 sobre blanco. Colocarlo en 500 comprime 600–950 en un rango casi
negro indistinguible y abre un salto de 3.28:1 → 13.45:1 entre 400 y 500. El
slot 700 es el correcto para un navy de esa profundidad.

| Slot | Actual | Nuevo | H actual | H nuevo | s/blanco |
|:---|:---|:---|:---|:---|:---|
| 50 | `#e8f0fa` | `#f0f6f9` | 213 | 204 | 1.09:1 |
| 100 | `#cbdbf3` | `#ddeaf4` | 216 | 204 | 1.22:1 |
| 200 | `#99b9e7` | `#b6d6ec` | 215 | 204 | 1.52:1 |
| 300 | `#6696db` | `#80bde5` | 215 | 204 | 2.03:1 |
| 400 | `#3374cf` | `#37a0e6` | 215 | 204 | 2.86:1 |
| 500 | `#0052c3` | `#097fce` | 215 | 204 | 4.25:1 |
| 600 | `#00429c` | `#00568f` | 215 | 204 | 7.70:1 |
| **700** | **`#003152`** | **`#003152`** | 204 | 204 | **13.45:1** ← ANCLA |
| 800 | `#002138` | `#00253d` | 205 | 204 | 15.77:1 |
| 900 | `#00151f` | `#001829` | 199 | 204 | 18.06:1 |
| 950 | `#000a10` | `#000c14` | 203 | 204 | 19.76:1 |

La rampa actual cambia de familia cromática en la frontera 600→700: los slots
50–600 son H≈215 S62–100% (azul royal), 700–950 son H≈199–205 (el navy de
marca). `--primary-400` no es una versión clara de la marca; es otro azul.

### 3.2 Rampa `$surface-dark-*` — monótona, sin duplicados

Estado actual (RN-DS-014 incumplida):

```
300 #0052c3  lum 0.0997
400 #c5d0db  lum 0.6210   ← rompe la monotonía (es $secondary-300, "muted text")
500 #00429c  lum 0.0630
700 #00151f  ┐
900 #000a10  ┐
950 #000a10  ┘ idénticos  → campos de formulario = fondo
```

Propuesta H=204 desaturada, estrictamente decreciente:

| Slot | Hex | Rol Aura |
|:---|:---|:---|
| 0 | `#eaeef0` | on-surface / texto |
| 50 | `#ced8de` | |
| 100 | `#a8bbc7` | on-surface-variant |
| 200 | `#7a99ae` | outline |
| 300 | `#557991` | outline-strong |
| 400 | `#3e5c6f` | muted |
| 500 | `#2b475a` | |
| 600 | `#1b3546` | |
| 700 | `#0e2839` | surface-container-low |
| 800 | `#081d2b` | content-hover |
| 900 | `#02131f` | content / bg |
| 950 | `#000b12` | form-field |

Texto (slot 0) sobre fondo (slot 950): **17.02:1**. Hover 700→800 y campo 900→950 vuelven a ser distinguibles.

### 3.3 `mypreset.ts` — alineación slot a slot + ancla explícita

`mypreset.ts` recibe **exactamente la rampa de §3.1**. Como Aura resuelve
`primary.color = {primary.500}` y nuestro ancla vive en 700, hay que declararlo:

```ts
export const LuxuryPreset = definePreset(Aura, {
  semantic: {
    primary: { /* rampa §3.1, slot a slot, idéntica a core/_colors.scss */ },
    colorScheme: {
      light: {
        primary: {
          color:         '{primary.700}',   // #003152 · ancla de marca
          contrastColor: '#ffffff',
          hoverColor:    '{primary.800}',
          activeColor:   '{primary.900}'
        },
        surface: { /* referenciar var(--secondary-*), no hex literales */ }
      },
      dark: {
        primary: {
          color:         '{primary.200}',
          contrastColor: '{primary.900}',
          hoverColor:    '{primary.100}',
          activeColor:   '{primary.300}'
        },
        surface: { /* var(--surface-dark-*) — ya lo hace, mantener */ }
      }
    }
  }
});
```

Esto elimina el hack `--primary-500: #{c.$primary-700}` de
[`theme/_variables.scss:33`](../../client/angular/src/styles/theme/_variables.scss)
y cierra RN-DS-002.

**Nota:** el `surface` light de `mypreset.ts` usa hex literales mientras el dark
usa `var(--surface-dark-*)`. Se corrige la asimetría: ambos por `var()`.

### 3.4 Reconstrucción de los gates de CI

Ambos gates dan verde hoy sobre el problema que deberían detectar.

**`audit-ds-tokens.mjs` (RN-DS-024/034)**
- Actual: `globSync('src/app/**/*.scss')`.
- `shared/ui` tiene **2 archivos `.scss` de 1,189**. El 99.8% de sus estilos vive en bloques `styles: []` dentro de `.ts`. Los 639 hex son invisibles.
- Cambio: extender el glob a `src/app/**/*.{scss,ts}`, y en `.ts` extraer únicamente el contenido de `styles:` / `styleUrls` / `template` antes de aplicar la regex, para no reportar hex de lógica de negocio.
- Mantener el escape `// ds-ignore` existente.

**`audit-contrast.mjs` (RN-DS-023/033)**
- Actual: `CONTRACT` es una tabla hardcodeada de pares fg/bg. Reporta `✅ PASS: 37 · FAIL: 0` usando `#1B365D`, `#78A4D4`, `#4A90E2`, `#D1DEF0`, `#050A11` — todos de la paleta vieja.
- Los mismos hex obsoletos aparecen en los comentarios de `theme/_variables.scss:573,574,672`, confirmando la fuente común.
- Divergencia demostrada: el gate declara `--ds-border-strong` dark en 6.03:1; el valor real (`$primary-500` = `#0052c3`) da **2.85:1** y **falla** 1.4.11.
- Cambio: compilar `styles/theme/_variables.scss` con `sass`, parsear los `--ds-*` resueltos de `:root` y `body.theme-dark`, y evaluar los pares contra **esos** valores. La tabla pasa de definir colores a definir solo **qué pares** validar y con qué umbral.
- Extender con los pares de `--ds-cat-*` (RN-DS-036).

**`audit-token-refs.mjs` (nuevo, RN-DS-035)**
- Extrae todo `var(--ds-*)` de `src/app/**` y todo `--ds-*:` de `src/styles/**`; falla si la diferencia no es vacía.
- Falla también ante cualquier `var(--…, <fallback>)` en `src/app/shared/ui/**` (RN-DS-007).

### 3.5 Migración de Datos & Prevención de Pérdida

**No aplica.** Este plan no toca base de datos, entidades, DTOs, endpoints ni
contratos de API. No hay cambios de schema, backfills ni scripts SQL. El
rollback es exclusivamente de código (§10).

### 3.6 Tokens de Diseño

#### 3.6.1 Tokens existentes que el plan consume

Colores: `--ds-primary`, `--ds-on-primary`, `--ds-primary-{container,light,text,hover,active}`, `--ds-{success,warning,danger,info}`, sus `-light` y `-hover`, `--ds-accent-text-{success,danger,info,warning}`, `--ds-bg-{page,surface,elevated,sunken,overlay}`, `--ds-text-{primary,secondary,muted,inverse,disabled,link}`, `--ds-border{,-strong,-focus,-error,-success}`.

#### 3.6.2 Tokens nuevos

**A. Roles de superficie e interacción faltantes** (hoy referenciados pero inexistentes; ver §3.6.3):

| Token | Light | Dark | Justificación |
|:---|:---|:---|:---|
| `--ds-bg-muted` | `$secondary-100` | `$primary-800` | 12 usos; fondo neutro sin elevación |
| `--ds-bg-hover` | `$secondary-50` | `$primary-700` | 6 usos; estado hover de filas/ítems |
| `--ds-bg-input` | `$neutral-0` | `$primary-950` | 2 usos; campo de formulario |
| `--ds-bg-primary` | `$neutral-0` | `$primary-900` | 4 usos; superficie base de panel |
| `--ds-bg-inverse` | `$secondary-800` | `$secondary-100` | 1 uso; bloque invertido |
| `--ds-secondary-light` | `$warning-100` | `color-mix(warning-400, 88%)` | par de `--ds-secondary`, faltaba |

**B. Paleta categórica `--ds-cat-1..8`** (RN-DS-036) — para avatares, series de
chart, gantt y mapas. **No sustituye a los semánticos**: `--ds-cat-*` codifica
identidad (usuario, serie, región); `--ds-{success,danger,…}` codifica
significado. Anclada en las 4 hues de marca + 4 rellenos separados ≥38°.

| Token | Light (fill, texto blanco) | AA | Dark (fill, texto `#000c14`) | AA | Hue |
|:---|:---|:---|:---|:---|:---|
| `--ds-cat-1` | `#256e9f` | 5.51:1 | `#7cb6dc` | 9.02:1 | 204 · navy, ancla marca |
| `--ds-cat-2` | `#6953d7` | 5.50:1 | `#b2a7e8` | 9.02:1 | 250 · índigo |
| `--ds-cat-3` | `#b129b1` | 5.50:1 | `#e394e3` | 9.04:1 | 300 · magenta |
| `--ds-cat-4` | `#c62e2e` | 5.48:1 | `#e59c9c` | 9.00:1 | 0 · carmesí, ancla danger |
| `--ds-cat-5` | `#85631f` | 5.52:1 | `#d2a957` | 8.99:1 | 40 · oro, ancla warning |
| `--ds-cat-6` | `#55721b` | 5.51:1 | `#98c936` | 10.11:1 | 80 · oliva |
| `--ds-cat-7` | `#1c791c` | 5.52:1 | `#36c936` | 9.00:1 | 120 · verde |
| `--ds-cat-8` | `#1c7755` | 5.50:1 | `#36c993` | 9.35:1 | 158 · esmeralda, ancla success |

Acompañados de `--ds-on-cat` (light `#ffffff`, dark `#000c14`). Separación mínima
de hue: **38°**. Contraste mínimo de texto: **5.48:1** light, **8.99:1** dark.

**C. Pares dedicados**

| Token | Light | Dark | Uso |
|:---|:---|:---|:---|
| `--ds-bg-terminal` | `$secondary-900` | `#1e1e2e` | consola embebida (`mobile/terminal`) |
| `--ds-text-terminal` | `$secondary-100` | `#cdd6f4` | ídem |
| `--ds-ai-gradient-from` | `#6366f1` | `#818cf8` | widget de chat IA — identidad deliberada, fuera de paleta pero formalizada |
| `--ds-ai-gradient-to` | `#a855f7` | `#c084fc` | ídem |

#### 3.6.3 Tokens inexistentes hoy — resolución

| Token usado en `shared/ui` | Usos | Resolución |
|:---|:---|:---|
| `--ds-primary-{50,100,200,700}` | 12 | typo → `--primary-{50,100,200,700}` |
| `--ds-radius-pill` | 6 | alias → `--ds-radius-full` |
| `--ds-font-size-{small,caption}` | 4 | → `--ds-font-size-help` |
| `--ds-bg-{muted,hover,input,primary,inverse}` | 25 | **definir** (§3.6.2 A) |
| `--ds-secondary-light` | 1 | **definir** (§3.6.2 A) |
| `--ds-{bg,text}-terminal` | 2 | **definir** (§3.6.2 C) |
| `var(--primary-color, …)` | 18 | → `var(--ds-primary)` |

#### 3.6.4 Validación Pre-Delivery

- [ ] `npm run audit:tokens` (con glob extendido) → 0 violaciones en `src/app/shared/ui`
- [ ] `npm run audit:contrast` (leyendo tokens reales) → 0 FAIL
- [ ] `node scripts/audit-token-refs.mjs` → 0 referencias huérfanas, 0 fallbacks
- [ ] `grep -rio "#003152" src/styles | wc -l` → 1
- [ ] `grep -rEo "var\(--[a-z0-9-]+, *#" src/app/shared/ui | wc -l` → 0

---

## 4. Backlog de Tasks

**Sprint 1 — Gates + rampa única**
- [ ] T1.1 Extender glob de `audit-ds-tokens.mjs` a `.ts` con extracción de bloques `styles:`
- [ ] T1.2 Reescribir `audit-contrast.mjs` para compilar `_variables.scss` y leer `--ds-*` reales
- [ ] T1.3 Registrar el baseline real de FAIL que arrojan los gates reconstruidos (esperado: ≥6)
- [ ] T1.4 Aplicar rampa §3.1 en `core/_colors.scss`
- [ ] T1.5 Aplicar rampa `$surface-dark-*` §3.2
- [ ] T1.6 Alinear `mypreset.ts` slot a slot + declarar `colorScheme.{light,dark}.primary` (§3.3)
- [ ] T1.7 Eliminar el hack `--primary-500: $primary-700` de `theme/_variables.scss:33`
- [ ] T1.8 Actualizar `DESIGN.md` §colors al ancla `#003152`
- [ ] T1.9 Corregir `--ds-text-link` dark (2.15:1 → `--ds-accent-text-info`) y `--ds-border-strong` dark
- [ ] T1.10 Borrar los comentarios WCAG obsoletos de `theme/_variables.scss:573,574,672` y regenerar con valores reales
- [ ] T1.11 Convertir `mypreset.ts` light `surface` de hex literales a `var(--secondary-*)`
- [ ] T1.12 Captura comparativa light+dark de 12 pantallas de referencia

**Sprint 2 — Tokens faltantes + eliminación de fallbacks**
- [ ] T2.1 Definir los 8 tokens nuevos de §3.6.2 A y C en `_colors.scss` + `theme/_variables.scss` (light, dark y `prefers-contrast: more`)
- [ ] T2.2 Corregir los 12 typos `--ds-primary-*` → `--primary-*`
- [ ] T2.3 Sustituir `--ds-radius-pill` → `--ds-radius-full` y `--ds-font-size-{small,caption}` → `--ds-font-size-help`
- [ ] T2.4 Sustituir los 18 `var(--primary-color, …)` → `var(--ds-primary)`
- [ ] T2.5 Crear `scripts/audit-token-refs.mjs` y añadirlo a `package.json`
- [ ] T2.6 **Verificar T2.5 en verde antes de continuar**
- [ ] T2.7 Eliminar los 516 fallbacks: `var(--x, <valor>)` → `var(--x)` en `shared/ui`

**Sprint 3 — Hex duros de `shared/ui`**
- [ ] T3.1 Definir `--ds-cat-1..8` + `--ds-on-cat` (§3.6.2 B)
- [ ] T3.2 Migrar las 3 paletas de avatar duplicadas a `--ds-cat-{1..6}` y extraer a un único helper compartido
- [ ] T3.3 Migrar ~40 `color: #fff` sobre fondo semántico → `--ds-on-primary` / `--ds-primary-text`
- [ ] T3.4 Migrar pares de estado: `inventory-level`, `stat-card`, `order-status`, `approval-workflow`, `tag.base`, `message.base` → `--ds-*-light` + `--ds-accent-text-*`
- [ ] T3.5 `stat-card.ts:241` — devolver nombre de token, no hex
- [ ] T3.6 Migrar series de chart/gantt/mapa a `--ds-cat-*`: `echarts-adapters`, `territory-map`, `pipeline-crm`, `gantt`, `pivot-table`, `customer-360`, `lead-scoring`
- [ ] T3.7 `mobile/terminal` → `--ds-{bg,text}-terminal`
- [ ] T3.8 `ai-chat-widget` → `--ds-ai-gradient-{from,to}` + resto de hex a tokens
- [ ] T3.9 Sustituir los 35 `color: var(--ds-{warning,success,danger,info})` → `--ds-accent-text-*`

**Sprint 4 — `_financial-tables.scss` (aislado)**
- [ ] T4.1 Mapear cada `--rf-*` a su equivalente `--ds-*`; documentar los que no tengan
- [ ] T4.2 Reescribir los 100 hex sobre tokens
- [ ] T4.3 Verificación visual dedicada de tablas financieras (light + dark + impresión)

**Sprint 5 — Cierre**
- [ ] T5.1 Añadir los 3 gates a CI como bloqueantes de PR
- [ ] T5.2 Documentar RN-DS-005/006/007/014/015/023/024/034/035/036 en `conventions/ui/design-tokens-rule.md`
- [ ] T5.3 Actualizar `styles/estandar-hoja-estilos.md` con la prohibición de fallbacks
- [ ] T5.4 Re-auditoría completa

---

## 5. Fases de Ejecución

**Sprint 1 — Gates + rampa única (3 días)**
Tasks T1.1–T1.12, T1.13–T1.19.
**Criterio de PASO:**
`grep -rio "#003152" src/styles | wc -l` → 1 · `audit-contrast.mjs` reconstruido devuelve 0 FAIL sobre valores reales · script de monotonía de `$surface-dark-*` sin rupturas ni duplicados · compilación SCSS sin errores · `--p-primary-color` en runtime resuelve a `#003152` en light y `#b6d6ec` en dark · las 12 capturas comparativas aprobadas por Tech Lead.

**Revisión visual obligatoria (T1.12/T1.19):** la revisión debe cubrir explícitamente que `--ds-border-strong` light pasó de `#c5d0db` (1.56:1, fallaba WCAG 1.4.11) a `#5a6878` (5.70:1). Cambio deliberado por accesibilidad, pero de alto impacto visual (8 usos en `shared/ui`). Si el Tech Lead lo rechaza, la alternativa es `$secondary-500` (`#75899c`, 3.61:1), el mínimo que cumple 1.4.11.

**Sprint 2 — Tokens faltantes + fallbacks (2 días)**
Tasks T2.1–T2.7. **Orden estricto: T2.7 no se ejecuta hasta que T2.6 esté en verde.**
**Criterio de PASO:**
`audit-token-refs.mjs` → 0 huérfanos y 0 fallbacks en `shared/ui` · `grep -rEo "var\(--[a-z0-9-]+, *#" src/app/shared/ui | wc -l` → 0 · las 50 propiedades que dependían de fallback ahora cambian de valor al alternar tema (verificado en 5 componentes muestra).

**Sprint 3 — Hex duros (4 días)**
Tasks T3.1–T3.9.
**Criterio de PASO:**
`npm run audit:tokens` → 0 violaciones en `src/app/shared/ui` · 0 usos de semánticos como `color:` · `--ds-cat-*` pasa RN-DS-036 en el gate de contraste · avatares idénticos entre los 3 componentes que antes duplicaban la paleta.

**Sprint 4 — `_financial-tables.scss` (2 días)**
Tasks T4.1–T4.3.
**Criterio de PASO:** 0 hex en el archivo · tablas financieras verificadas en light, dark e impresión.

**Sprint 5 — Cierre (1 día)**
Tasks T5.1–T5.4.
**Criterio de PASO:** los 3 gates bloquean PR en CI · re-auditoría PASS.

---

## 6. Criterios de Completitud

```bash
cd client/angular

# 1. Ancla única — #003152 existe exactamente una vez
grep -rio "#003152" src/styles | wc -l                                  # → 1

# 2. Cero fallbacks en shared/ui (RN-DS-007)
grep -rEo "var\(--[a-z0-9-]+, *[^)]+\)" src/app/shared/ui | wc -l        # → 0

# 3. Cero tokens --ds-* referenciados pero no definidos (RN-DS-035)
comm -23 <(grep -rho "var(--ds-[a-z0-9-]*" src/app/shared/ui | sed 's/var(//' | sort -u) \
         <(grep -rhoE "^\s*--ds-[a-z0-9-]*" src/styles | sed 's/^ *//' | sort -u)   # → vacío

# 4. Cero hex en shared/ui (RN-DS-030/034)
grep -rEo "#[0-9a-fA-F]{3,8}\b" src/app/shared/ui | wc -l                # → 0

# 5. Cero semánticos usados como color de texto
grep -rEo "color: *var\(--ds-(warning|success|danger|info)\)" src/app/shared/ui | wc -l  # → 0

# 6. Gates
npm run audit:tokens                       # → 0 violaciones en shared/ui
npm run audit:contrast                     # → 0 FAIL, sobre tokens reales
node scripts/audit-token-refs.mjs          # → exit 0
```

Adicionales no automatizables:
- [ ] Las 12 capturas light+dark aprobadas por Tech Lead
- [ ] `mypreset.ts` y `core/_colors.scss` tienen la rampa **idéntica slot a slot** (diff manual)
- [ ] `DESIGN.md` declara `primary: "#003152"`
- [ ] `$surface-dark-*` estrictamente monótona, sin duplicados

---

## 7. Riesgos & Mitigaciones

Tabla de §0.3 con responsable asignado. Riesgos residuales:

| Riesgo | Impacto | Mitigación | Responsable |
|:---|:---|:---|:---|
| Los 162 hex que `audit:tokens` ya reporta en `apps/**` empiezan a bloquear PR al endurecer el gate | CI rojo para módulos fuera de alcance | Los gates entran como bloqueantes **solo** para `src/app/shared/ui` y `src/styles` en Sprint 5; `apps/**` queda en modo warning con ticket propio | Tech Lead |
| `--ds-cat-6` (oliva `#55721b`) y `--ds-cat-7` (verde `#1c791c`) pueden confundirse en series de chart densas | Legibilidad de gráficas | Documentar que para ≤6 series se usen `cat-1..6`; `cat-7/8` solo en sets de 7–8 | Ejecutor |
| El ejecutor conserva un fallback "por seguridad" | RN-DS-007 incumplida silenciosamente | El grep #2 de §6 es binario y bloqueante | Auditor |
| La revisión visual se hace solo en light | Regresiones dark no detectadas | Las 12 capturas son **pares** light+dark; una sola no cuenta | Tech Lead |

---

## 8. Dependencias Externas

| Dependencia | Versión | Nota |
|:---|:---|:---|
| `@primeuix/themes` | `2.0.3` | Contrato Aura verificado directamente en `dist/aura/base/index.mjs` |
| `sass` | según `package.json` | Requerido por el nuevo `audit-contrast.mjs` para compilar `_variables.scss` |
| `glob` | ya presente | Usado por `audit-ds-tokens.mjs` |
| Ionic | según `package.json` | `theme/_variables.scss:170-195` usa `darken()`/`lighten()` sobre los anclas semánticos — no afectados por la rampa primary |

Sin dependencias nuevas de runtime.

---

## 9. Métricas & KPIs de Éxito

Tabla de §0.1, verificada al cierre de cada sprint. El baseline de la fila
*"Combinaciones AA que fallan"* se **re-mide en T1.3**, después de reconstruir el
gate: el valor de 6 proviene del análisis manual, y el gate actual reporta 0 por
leer datos obsoletos. Cualquier discrepancia entre ambos se documenta antes de
seguir.

---

## 10. Rollback Plan

Rollback exclusivamente de código; no hay datos que restaurar (§3.5).

| Sprint | Disparador de rollback | Acción |
|:---|:---|:---|
| S1 | Capturas rechazadas o build SCSS roto | `git revert` del commit de rampa. Los gates reconstruidos (T1.1–T1.3) **se conservan**: son mejora independiente y su rojo es información válida. |
| S2 | Propiedades caídas tras eliminar fallbacks | `git revert` solo de T2.7; los tokens nuevos (T2.1) se conservan. Reintentar tras cerrar la brecha que `audit-token-refs.mjs` señale. |
| S3 | Regresión visual en un componente concreto | Revert por componente, no por sprint. Cada task de S3 es un commit independiente. |
| S4 | Tablas financieras rotas | `git revert` del commit de `_financial-tables.scss`. Aislado por diseño; no afecta a S1–S3. |

Cada sprint cierra en una rama propia con un commit por task, para permitir
revert granular. Ningún sprint se mergea a la rama base sin su criterio de PASO
en verde.

---

## 11. Post-Implementation Review

A completar tras Sprint 5:

- ¿Se alcanzaron los 10 KPIs de §0.1? Registrar valor final por fila.
- ¿Cuántos FAIL reales reportó el gate de contraste en T1.3 frente a los 6 estimados? ¿Por qué la diferencia?
- ¿Cuántas regresiones visuales aparecieron en las capturas de S1? ¿Fueron atribuibles al cambio de hue o a la de luminosidad?
- ¿Algún componente necesitó `// ds-ignore`? Listar y justificar cada uno.
- **Learning estructural:** los dos gates existían y daban verde sobre el problema exacto que debían detectar (uno por cobertura, otro por datos hardcodeados). ¿Qué otros gates del repo tienen la misma forma de falla? Auditar `audit-css`, `audit-design`, `audit-ui`, `audit-design-conventions` con la misma pregunta.
- ¿Conviene generar la rampa por script desde el ancla en lugar de escribirla a mano, para que RN-DS-006 sea estructuralmente imposible de violar?

---

**Estado:** Propuesto
**Requiere aprobación de:** Tech Lead (Fase 0 + §3 son críticas)
**Siguiente paso:** aprobación → ejecución Sprint 1 → auditoría del diff

---

## Resultado Sprint 4 — `_financial-tables.scss` (2026-08-10)

**Ejecutado.** 103 hex dispersos → 49 tokens `--rf-*` en un solo bloque, 0 hex
fuera de él, 0 tokens huérfanos, 0 sin usar.

### Verificación de equivalencia visual

Sin backend ni navegador no hubo revisión visual. En su lugar se compiló el
archivo antes y después con `sass` y se compararon los valores **resueltos**,
no el texto:

```
declaraciones con color — antes: 145 · después: 145
solo en el original: 0
solo en el nuevo:    0
```

Cero diferencias. El CSS compilado produce exactamente los mismos colores.

### Por qué NO se alinearon los colores a `--ds-*`

Se midió la distancia perceptual (ΔE76) de cada `--rf-*` contra su candidato del
Design System. Solo 3 de 16 resultaron imperceptibles:

| Token | Actual | Candidato DS | ΔE |
|:---|:---|:---|---:|
| `--rf-soft` | `#f5f7fb` | `--ds-document-bg-muted` `#f8f9fc` | 1.0 |
| `--rf-row-group` | `#f8fafc` | idem | 0.7 |
| `--rf-row-alt` | `#f1f5f9` | idem | 2.0 |
| `--rf-line` | `#d7dfeb` | `--ds-border` `#e2e8f0` | 3.9 |
| `--rf-result` | `#111827` | `--ds-document-ink` `#001829` | 5.0 |
| `--rf-head` | `#203453` | `--ds-primary` `#003152` | 5.2 |
| `--rf-ink` | `#0f172a` | `--ds-document-ink` | 5.3 |
| `--rf-header-bg` | `#c8d8ea` | `--primary-200` `#b6d6ec` | 5.7 |
| `--rf-muted` | `#64748b` | `--ds-text-secondary` `#5a6878` | 6.3 |
| `--rf-accent` | `#1e3a5f` | `--primary-800` `#00253d` | 13.1 |

De ΔE 5 en adelante el cambio es visible. Alinearlos es deseable pero es una
**decisión de producto**, no una refactorización, y estas pantallas las usa el
área contable. Al quedar todo centralizado, esa migración pasó de 103 ediciones
a ~20 líneas.

### Error detectado y corregido durante la ejecución

La primera versión derivaba 4 tokens de superficie de `--ds-document-*`. Esos
tokens **cambian de valor en tema oscuro** mientras los otros 45 de la capa son
literales fijos. En oscuro habría quedado `--rf-ink` (`#0f172a`, texto oscuro)
sobre `--rf-surface` (`#0d141c`, fondo oscuro): ilegible.

El archivo nunca tuvo bloque `.theme-dark`; hoy se ve igual en ambos temas. La
capa `--rf-*` se declaró **invariante al tema** para preservar ese
comportamiento. Generalizado como RN-DS-041 en `CONVENTIONS.md` §5.6.2.

### Pendiente

- **Verificación visual** de las tres pantallas consumidoras
  (`espejo-aspel-full`, `presupuesto-propuesta`, `espejo-aspel-presupuesto`).
  Bloqueada por el drift de EF. La equivalencia está probada a nivel de CSS
  compilado, no de píxel.
- **Decisión de alineación cromática** con la marca (tabla de arriba).
- `custom/_print.scss` (31 hex) sigue fuera de alcance.
