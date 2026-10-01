
📅 Versión histórica base: 2026-09-13 (v2 — reordenado por riesgo ascendente + checklist de
decisiones, a partir de la petición del usuario tras estabilizar Angular)
🛡️ Estado histórico: ✅ Fases 0-8 ejecutadas y verificadas. Este documento
remediación Design System) definido el 2026-09-18. El estado vigente es el
addendum de Fase 9; las referencias
Fases 0-8 cerradas (Fase 5/Inputs sustancialmente cerrada
2026-09-14; Fase 4/Modales cerrada 2026-09-15, commit `6b86307ef`) —
próximo y actual: Fase 9 (limpieza semántica y remediación DS). Decisiones #4/#5 del checklist de
Fase 0 resueltas 2026-09-15 al arrancar Fase 6. `toolbar`/`breadcrumbs`
tuvieron un cierre en falso el 2026-09-13 (marcados 🟢 sin reescribirse
de verdad) corregido el 2026-09-14. Ver `04-bitacora-cambios.md` para
el detalle completo de Fase 3 y del arranque de Fase 6.
👤 Responsable: Equipo Frontend LuxuryApp


### 0. Pre-planeación

pero conserva archivos SCSS, wrappers, helpers, nombres de clases, scripts y
documentación heredada. Esto hace que futuras personas o agentes puedan
reintroducir APIs retiradas y dificulta distinguir componentes propios de
adaptadores legacy.

**Objetivo de cierre:** dejar `appsweb/angular` sin dependencias, imports,
selectores, nombres de carpetas/archivos, comentarios operativos ni

`primeflex`, `primeicons`, `primeuix`, `prime-overrides`, nombres de archivos o
carpetas con esos prefijos, selectores legacy `p-*`/`pXxx` y referencias a
componentes retirados. Palabras españolas como `primer`, `primero` o `primera`
no son coincidencias de limpieza.

**KPIs de cierre:**

| Indicador | Baseline 2026-09-18 | Target | Verificación |
|---|---:|---:|---|
| Archivos con nombre legacy | 30+ | 0 | inventario de paths |
| Referencias operativas en docs/scripts | numerosas | 0 | búsqueda global excluyendo historial archivado |
| Build producción | PASS | PASS | `npx ng build --configuration production` |
| Auditorías UI/SCSS | PASS | PASS | `audit:ui`, `audit:scss-build` |
| Auditoría de contraste | parcial | PASS sin bloqueantes | `audit:contrast` + revisión de estados |
| Auditoría de tokens DS | 7 violaciones | 0 sin excepción documentada | `audit:ds-tokens.mjs` |
| Documentación DS alineada | drift detectado | 1 fuente normativa | revisión cruzada `DESIGN.md`/tokens/MASTER |

**Reglas de control:**

- `RN-DS-001`: web usa Bootstrap 5, HTML nativo y `shared/ui`; mobile usa
  Ionic; no se agrega una librería sustituta sin decisión documentada.
- `RN-DS-002`: contratos propios se conservan funcionalmente; los nombres
  legacy internos se renombran de forma atómica con todos sus consumidores.
- `RN-DS-003`: no borrar SCSS custom hasta clasificar cada selector como activo,
  reemplazable o muerto y pasar build/auditoría.
- `RN-DS-004`: referencias históricas se mueven a archivo de archivo fuera del
  árbol operativo o se reescriben; no quedan como guía vigente.
- `RN-DS-005`: toda decisión visual toma `templates_admin/lagos` como catálogo
  de composiciones y `templates_admin/minia` como referencia de estructura,
  tokens, responsive y dark mode.

**Pre-mortem:**

- Se borra un override CSS todavía usado por una tabla financiera. Mitigación:
  inventario de selectores y capturas/build por lote antes de borrar.
- Se renombra un wrapper y queda un consumidor lazy sin compilar. Mitigación:
  búsqueda de imports, tags, rutas y metadata antes/después, más `tsc` y build.
- Se copia diseño de Lagos/Minia sin respetar tokens LuxuryApp. Mitigación:
  mapear cada decisión a `DESIGN.md` y tokens DS antes de editar estilos.
- Se limpia código pero regeneradores vuelven a escribir nombres legacy.
  Mitigación: actualizar o retirar scripts antes del barrido final.

### Decisiones de diseño requeridas antes de la ejecución visual

| ID | Decisión | Recomendación | Bloquea |
|---|---|---|---|
| D-09.1 | `web/_prime-*.scss`: borrar o renombrar/consolidar | Borrar archivos sin selectores activos; mover reglas activas a `_components.scss`, `_forms.scss`, `_tables.scss` o `_overlays.scss` | Fase 9.1 |
| D-09.2 | `.rf-prime-table` | Renombrar a `.rf-table`; es clase propia, no conservar alias | Fase 9.2 |
| D-09.4 | `PRIME_TO_ICONIFY` | Mantener temporalmente solo si existen valores legacy persistidos; renombrar a `LEGACY_ICON_TO_ICONIFY` | Fase 9.4 |
| D-09.5 | Documentos históricos de migración | Conservar fuera de documentación operativa o eliminar referencias legacy si el objetivo es grep cero | Fase 9.3 |

**Decisión visual propuesta:** no introducir componentes nuevos por imitación
directa de Lagos/Minia. Reutilizar `app-table`, `il/iw-button`, Bootstrap,
`NgbModal`, `ng-select`, `flatpickr`, `ngx-editor`, `ng2-charts` y tokens DS.
Lagos aporta composiciones/layouts; Minia aporta estructura de tema y
responsive. Cualquier divergencia de radio, color, densidad, icono o spacing se
registra antes de implementarse.

### 9. Fases de ejecución

#### Fase 9.0 — Baseline e inventario congelado

- [ ] Ejecutar búsqueda case-insensitive en `appsweb/angular`, separando
  código, estilos, documentación, scripts, assets y nombres de paths.
- [ ] Clasificar cada resultado: runtime activo, nombre propio, comentario,
  documentación histórica, script ejecutable o falso positivo.
- [ ] Confirmar decisiones D-09.1 a D-09.5.
- [ ] Crear baseline de `tsc`, build, `audit:ui`, `audit:scss-build` y captura
  de páginas representativas de Lagos/Minia.

**Paso:** inventario revisado y decisiones aprobadas; no se borra código antes.

#### Fase 9.1 — CSS legacy y tokens

- [ ] Auditar selectores de `src/styles/web/_prime-*.scss`, `p-*`, `pXxx`,
- [ ] Migrar reglas activas a nombres neutrales y tokens DS/Bootstrap.
- [ ] Retirar imports legacy de `ds-entry.scss`.
- [ ] Simplificar `styles.scss`, `_dark-mode.scss`, `_variables.scss`,
  `_colors.scss`, `_custom-table.scss` y estilos mobile con comentarios de
  overlay obsoletos.
- [ ] Renombrar `.rf-prime-table` a `.rf-table` en SCSS y templates.

**Paso:** build SCSS, `audit:scss-build`, búsqueda sin nombres legacy y
comparación visual de tablas, dialogs, forms, dark mode y overlays.

#### Fase 9.2 — Wrappers, helpers y servicios

  `@core/services/dialog-handler.service` directamente.
  funcionales.
  `tableRows`/`tableDefaultRows`.
- [x] Actualizar imports, templates, specs, catálogo UI, rutas y metadata.
  equivalentes del shell/catálogo.

**Paso:** cero paths/imports/selectores legacy; consumidores funcionales y
tests compilando. Cumplido el 2026-09-18; comentarios y estilos legacy quedan
en Fase 9.1/9.3.

#### Fase 9.3 — Código y contratos documentales

- [ ] Actualizar comentarios de `shared/ui`, `core`, `styles` y specs.
- [ ] Reescribir `src/styles/estandar-hoja-estilos.md` con estructura real.
- [ ] Regenerar `src/assets/design-conventions.json` desde datos actuales.
- [ ] Actualizar `scripts/extract-design-conventions.mjs` y auditorías para
  reglas Bootstrap/shared UI.
- [ ] Retirar o archivar scripts de migración ya ejecutados que escriban
- [ ] Marcar `docs/audits/*` y reportes históricos como archivo no operativo o
  moverlos fuera del árbol de documentación vigente.

**Paso:** documentación operativa no contiene referencias retiradas y ningún
generador puede reintroducirlas.

#### Fase 9.4 — Validación contra Lagos/Minia

- [ ] Revisar visualmente páginas representativas: tabla densa, formulario,
  modal, navegación, dashboard, charts, editor y media preview.
- [ ] Usar Lagos para composición, densidad y patrones de pantalla.
- [ ] Usar Minia para estructura de tema, responsive, dark mode y layout.
- [ ] Resolver diferencias mediante tokens DS, no hexadecimales locales.
- [ ] Verificar desktop, mobile, claro/oscuro, keyboard, focus y touch targets.

**Paso:** no hay regresiones visuales críticas y toda desviación queda
documentada como decisión DS.

#### Fase 9.5 — Remediación Design System derivada de auditoría FASE 1

Estas acciones vienen de `design-system/auditoria-DS-FASE1.md` y son obligatorias
para cerrar gobernanza, accesibilidad y veracidad documental. No se acepta
"build verde" como sustituto de estas comprobaciones.

**P0 — bloqueantes:**

- [ ] Resolver C-01: declarar `src/styles/DESIGN.md` +
  `src/styles/core/_colors.scss` como fuente normativa; alinear
  `MASTER.md`, `estandar-hoja-estilos.md` y `conventions/ui/design-tokens-rule.md`.
- [ ] Resolver C-03: corregir `.bg-status-pending`, `.bg-status-success` y
  cualquier badge con texto blanco sobre fondos que fallen WCAG AA.
- [ ] Ampliar `scripts/audit-contrast.mjs` para probar pares reales de badges,
  botones, alerts, inputs y estados, no solo tokens aislados.

**P1 — calidad y consistencia:**

- [x] Resolver A-01: corregir `--ds-luxury-gold` para que use la escala
  `report-gold-*` y quede reservado a reportes; mantener cian en
  `info/tertiary` y warning en ámbar operativo.
- [ ] Resolver A-02/A-03/M-07: consolidar sombras y foco en una sola fuente;
  establecer `--ds-focus-ring` canónico visible en light/dark.
- [ ] Resolver A-04: agregar `viewport-fit=cover` al meta viewport y verificar
  safe areas en iOS/Android.
- [ ] Resolver A-05: corregir las 7 violaciones en alcance de
  `audit:ds-tokens.mjs`; cada excepción debe tener `ds-ignore` justificado.
- [ ] Resolver B-02/B-03: tokenizar `theme-color` y corregir documentación del
  contraste terciario para no declarar ratios falsos.

**P2 — consistencia estructural:**

- [ ] Resolver M-02: documentar Figtree self-hosted como fuente real.
- [ ] Resolver M-03: reanclar `--ds-type-*` a la escala declarativa de
  `DESIGN.md`, usando Figtree real y validación visual.
- [ ] Resolver M-04: documentar base de spacing 4px con escala macro de 8px;
  no afirmar que todo valor es múltiplo de 8.
- [ ] Resolver M-05: revisar budgets con medición real; no bajar límites
  arbitrariamente sin dividir estilos/componentes pesados.
- [ ] Resolver M-06: evaluar `@container` solo en componentes adaptativos donde
  mejore comportamiento; no reemplazar media queries globales masivamente.
- [ ] Resolver B-04/B-05: consolidar motion y z-index; eliminar escala huérfana.


- [ ] A-06: ticket separado para los 282 hardcodes de `modules/**`.
- [ ] M-08: evaluar OKLCH/Display-P3 solo para brand/gradientes cuando exista
  necesidad visual real.
- [ ] P3: definir versionado SemVer/RFC del Design System.
- [ ] Completar evidencia WCAG 2.2: focus obscured, dragging alternative,
  redundant entry, accessible authentication, screen readers y daltonismo.

**Paso:** `audit:contrast`, `audit:ds-tokens`, build y documentación rectoras
verdes; toda decisión de color, tipografía, spacing o foco registrada.

#### Fase 9.6 — Decisiones de diseño custom

Estas decisiones no deben resolverse copiando Lagos/Minia literalmente:

| ID | Decisión | Recomendación | Aprobación requerida |
|---|---|---|---|
| DS-01 | Oro de reportes vs cian actual | Mantener `--ds-luxury-gold` para reportes y mapearlo a `report-gold-*`; conservar cian como `info/tertiary` y warning como ámbar operativo | Confirmado |
| DS-02 | Badge pending/success | Fondo semántico + texto oscuro/accent-text, nunca blanco por defecto | No, salvo cambio de marca |
| DS-03 | Escala tipográfica | `DESIGN.md` como autoridad; ajustar implementación a Figtree | Sí si cambia tamaños visibles |
| DS-04 | Grid de spacing | Base 4px; usar múltiplos de 8px solo como macro-grid cuando aplique | Confirmado |
| DS-05 | Radios | Mantener valores reales de `DESIGN.md`; no adoptar radios de Lagos/Minia si contradicen marca | Sí si se cambia marca |
| DS-06 | Gamut P3/OKLCH | No implementar ahora; registrar como evolución opcional | No |

**Regla:** Lagos aporta patrones de composición y Minia aporta arquitectura de
tema/layout. Color, tipografía, radios y spacing siguen tokens LuxuryApp salvo
decisión DS explícita.

#### Fase 9.7 — Barrido final y cierre

- [ ] Búsqueda final de términos y paths prohibidos.
- [ ] `npx tsc --noEmit`.
- [ ] `npx ng build --configuration production` con log completo.
- [ ] `npm run audit:ui`.
- [ ] `npm run audit:scss-build`.
- [ ] `npm run audit:encoding`.
- [ ] `node scripts/scan-mojibake.mjs appsweb/angular` desde raíz.
- [ ] Actualizar `response.md`, `logs.txt`, bitácora e índice de migración.

**Cierre:** cero dependencias, imports, paths, selectores y documentación
verdes; auditoría DS sin bloqueantes; validación visual contra Lagos/Minia
registrada; decisiones custom aprobadas o explícitamente diferidas.

Este plan se apoya en los hallazgos cuantificados de
[01-analisis-estado-actual.md](./01-analisis-estado-actual.md) y en el
detalle de código real de
[05-tablas-y-modales.md](./05-tablas-y-modales.md). No repite el
diagnóstico, lo usa para decidir orden y alcance.

> **Cambio de versión v1 → v2:** se reordenan las fases de **menor a mayor
> riesgo** (petición explícita del usuario, 2026-09-13) y se separan
> "Modales" y "Componentes interactivos" como fases propias en vez de
> quedar mezcladas dentro de una fase genérica de "cola larga". Ver
> `04-bitacora-cambios.md` para el razonamiento completo del reordenamiento.

---

## 1. Objetivo

por **Bootstrap 5** (+ `@ng-bootstrap/ng-bootstrap` para comportamiento
interactivo: modal, dropdown, tooltip, popover, accordion, nav/tabs,
datepicker, pagination), tomando como referencia visual y estructural
`templates_admin/minia` (arquitectura de tokens/layout) y
`templates_admin/lagos` (catálogo de composiciones), **sin romper**:

- La capa `mobile/` (Ionic) — no se toca.
- El contrato de selectores públicos `lx-*` / `app-*` / `il-*` / `iw-*`
  documentado en `arquitectura-shared-ui.md`, salvo que el propio plan
  decida deprecar un selector explícitamente (se registra en
  `03-inventario-componentes.md`).
- El sistema de tokens de marca (`DESIGN.md`, `core/_colors.scss`) — se
  **reutiliza**, no se reemplaza.

## 2. Principios rectores

1. **La capa adaptativa es el escudo.** Mientras una feature consuma
   ocurre *dentro* del wrapper y la feature no se toca. Por eso la Fase 0
   prioriza **cerrar las fugas** antes de tocar visual.
2. **Migrar de menor a mayor riesgo, nunca al revés.** El riesgo se mide
   por: (a) cuántos archivos hay que tocar directamente, (b) si ya existe
   un patrón probado en el propio repo para resolverlo, y (c) qué tan
   reversible es el cambio si algo sale mal. Ver la matriz de riesgo en §6.
3. **Convivencia deliberada y explícita, no accidental.** Durante toda la
   decisión, no una etapa transitoria que "se resuelve sola". Se declara
   el mecanismo de convivencia (capas CSS, ver §4) para que la coexistencia
   no degrade a colisión de especificidad.
4. **Progresivo y verificable en cada paso.** Nada avanza a la siguiente
   fase sin que la fase anterior esté 🟢 según los criterios de aceptación
   (§7). No se abren dos fases de alto riesgo en paralelo.
5. **Un componente migrado = mismo selector público, misma API de
   `@Input`/`@Output`.** Si eso no es posible para algún caso, se
   documenta como excepción explícita en `03-inventario-componentes.md`
   con el listado de features que sí requieren tocarse.
6. **Nada se marca 🟢 sin build verde + revisión visual.** Ver criterios de
   aceptación por fase en §7.
7. **No se reescribe intuición: cada decisión de mapeo de color/tipografía/
   radio se ancla a `DESIGN.md`.** Bootstrap se configura para obedecer la
   marca, no al revés.

## 3. Alcance explícito

| Dentro de alcance | Fuera de alcance |
|---|---|
| `appsweb/angular/src/app/shared/ui/web/**` | `appsweb/angular/src/app/shared/ui/mobile/**` (Ionic) |
| `appsweb/angular/src/app/shared/ui/buttons/web-*` | `appsweb/angular/src/app/shared/ui/buttons/mobile-*` |
| `appsweb/angular/src/app/shared/ui/inputs/web/**` (coordinado con rollout adaptativo, ver Fase 5) | `appsweb/angular/src/app/shared/ui/inputs/mobile*` (no existe hoy; queda igual) |
| `appsweb/angular/src/styles/web/**`, `theme/`, `core/` (consumo, no redefinición de marca) | `appsweb/angular/src/styles/mobile/**` |
| `core/services/dialog-handler.service.ts` (rama desktop) | `core/services/ionic-dialog-modal.ts` (rama móvil, ya resuelta) |
| Las ~340 plantillas de feature que usan `p-table` directo (bajo la excepción vigente) | Flutter (`conventions/flutter/**`) — no aplica, es otro stack |
| Backend (.NET) — cero impacto | — |

---

## 4. Estrategia de convivencia CSS durante la migración

✅ **Implementado en Fase 0 (2026-09-13)** — `src/styles/web/_bootstrap-entry.scss`
+ `_bootstrap-tokens.scss`, enganchados desde `ds-entry.scss`. El diseño
real difiere del planteado en la v1 de este documento, por dos límites
técnicos que se descubrieron implementando y compilando de verdad (no
suposiciones):

1. **Sass no permite intercalar una declaración `@layer nombre, nombre;`
   en medio de un bloque de `@use`.** `ds-entry.scss` usa `@use`
   exclusivamente, y Sass exige que TODOS los `@use` de un archivo estén
   juntos, antes de cualquier otra regla — no antes, no en medio. Se
   intentó de las dos formas y Sass rechazó el archivo ambas veces. Por
   eso **no existe** una declaración explícita `@layer ionic, reset,
   originalmente.
2. **Excluir `reboot` a mano rompe el build.** Se intentó replicar el
   import-stack de `bootstrap/scss/bootstrap` quitando solo la línea
   `@import "reboot"`, y falló de inmediato: `_type.scss` hace `@extend
   h1` esperando que `reboot` ya haya declarado el selector `h1`. El mismo
   patrón se repite en otros partials. Excluir piezas de Bootstrap a mano
   es frágil (una versión futura puede reordenar dependencias internas y
   romper el build en silencio).

**Solución real, verificada por compilación:** se importa el bundle
oficial `bootstrap/scss/bootstrap` **completo** (reboot incluido), pero
**todo envuelto en `@layer bootstrap { … }`**. El mecanismo que evita que
Bootstrap le gane a algo importante no es el orden entre capas nombradas
— es que **todo lo que ya existe en el proyecto que podría chocar
(`web/_buttons.scss`, `_cards.scss`, `web/_prime-*.scss`, `_dark-mode.scss`,
`base/_global.scss`) es "unlayered"**, y por especificación CSS una regla
sin capa **siempre** gana sobre cualquier regla dentro de una capa
nombrada, sin importar el orden entre capas ni la especificidad. Por eso
basta con que Bootstrap esté en UNA capa nombrada (cualquiera) para que
todo el CSS unlayered existente lo siga venciendo automáticamente, sin
tocar nada más y sin `!important`.

- El override de tokens (`_bootstrap-tokens.scss`, ver §5) se importa
  **antes** de `bootstrap/scss/bootstrap` (no después, ver la nota crítica
  de §5 sobre por qué el orden importa de verdad, no solo en teoría).
- **No usar `::ng-deep`** para overrides de Bootstrap, misma regla ya
- Pendiente de verificación visual (no hecho en esta sesión): abrir la app
  con `ng serve`/`ng build` y confirmar en pantalla que ningún elemento
  existente cambió de aspecto por la sola presencia de Bootstrap cargado
  — la compilación SCSS es correcta (verificado con el compilador `sass`
  real), pero eso no reemplaza mirar la pantalla.

Esta convivencia **es la que hace posible migrar de menor a mayor riesgo**:
mientras dure, ambas librerías renderizan en la misma pantalla sin pisarse
(ej. un `p-table` puede convivir con botones ya migrados a `.btn`
Bootstrap dentro de sus mismas filas — de hecho eso es exactamente lo que
va a pasar durante varios meses, ver `05-tablas-y-modales.md` §A.5).

## 5. Mapeo de tokens DS → variables SCSS de Bootstrap

Tabla base a implementar en el nuevo archivo
`src/styles/web/_bootstrap-tokens.scss` (se importa **antes** de
`bootstrap/scss/bootstrap`, después de `bootstrap/scss/variables`):

| Variable Bootstrap | Token DS de origen | Valor (`DESIGN.md`) |
|---|---|---|
| `$primary` | `--ds-primary` / `core/_colors.scss $primary-700` | `#003152` |
| `$secondary` | `--ds-text-secondary` / neutro | `#5A6878` |
| `$success` | `--ds-success` | `#1E9B6D` |
| `$danger` | `--ds-danger` | `#D34B4B` |
| `$warning` | `--ds-warning` | `#FFB300` |
| `$info` | `--ds-info` | `#3678C2` |
| `$body-bg` | `--ds-surface` (`surface`) | `#F8F9FC` |
| `$body-color` | `--ds-text-primary` (`on-surface`) | `#1A2634` |
| `$border-color` | `--ds-border` (`outline`) | `#E2E8F0` |
| `$border-radius` | `--ds-radius-btn`/`md` (estándar unificado) | `3px` |
| `$border-radius-lg` | `--ds-radius-lg` | `3px` (mismo valor, DESIGN.md unifica radios) |
| `$border-radius-pill` | — | `9999px` |
| `$font-family-base` | `--ds-font-family-base` | `Figtree, -apple-system, …` |
| `$spacer` | `spacing.unit` | `8px` (Bootstrap usa `1rem`=16px como `$spacer`; documentar el factor de conversión al mapear `$spacer * .5/.25/1.5` contra la escala `stack-xs..2xl` del DS) |
| `$box-shadow`, `$box-shadow-sm`, `$box-shadow-lg` | `elevation.level-1..4` | `rgba(27,54,93,*)` |

**Regla:** este archivo referencia valores **hex literales** (no
`var(--ds-*)`) — ver la corrección técnica siguiente.

✅ **Verificado y resuelto en Fase 0 (2026-09-13), compilando de verdad con
el `sass` CLI del proyecto — no es una suposición:**

- Bootstrap 5.3.8 **no tiene** una variable `$enable-css-vars` (se buscó en
  `node_modules/bootstrap/scss/_variables.scss` y no existe; la nota de la
  v1 de este plan sobre ese flag era incorrecta y se corrige aquí).
  Bootstrap 5.3+ genera `--bs-*` **siempre**, sin flag, desde
  `_root.scss` (`@each $color, $value in $theme-colors { --#{$prefix}#{$color}: #{$value}; }`).
- El mapa `$theme-colors` (de donde salen `--bs-primary` y las variantes
  hover/active de `.btn-primary`, calculadas con `shade-color()`/
  `tint-color()`) se construye **dentro de `bootstrap/scss/_variables.scss`
  usando el valor de `$primary` en ese momento**. Esas funciones de color
  de Sass **no pueden operar sobre un `var(--ds-*)`** — necesitan un color
  real en tiempo de compilación. Por eso `_bootstrap-tokens.scss` usa hex
  literales, y por eso **debe importarse antes de
  `bootstrap/scss/variables`** (importarlo después, como se planteaba en
  la v1, se probó y NO tiene efecto: el mapa ya quedó armado con los
  colores por defecto).
- Consecuencia: la reactividad de tema oscuro para los componentes de
  Bootstrap **no está resuelta todavía** — los valores son fijos (tema
  claro). No se intentó resolver en Fase 0 porque requiere diseño propio
  (posiblemente una segunda pasada de overrides `:root.theme-dark { --bs-*:
  var(--ds-*) }` sobre variables puntuales, evaluando cuáles admiten un
  `var()` sin romper cálculos internos). Se revisa explícitamente durante
  la verificación visual de la Fase 1 (botones), no se da por hecha.

---

## 6. Fases (orden de menor a mayor riesgo)

### Matriz de riesgo que define el orden

| Fase | Qué migra | Archivos a tocar directamente | ¿Existe patrón ya probado en el repo? | Reversibilidad | Riesgo |
|---|---|---:|---|---|---|
| 0 | Fundaciones (nada visual) | 0 features | N/A (es la base) | Total | Ninguno |
| 1 | Botones | ~50 archivos de wrapper, 0 features | Sí — ya usan markup Bootstrap-like | Alta | 🟢 Muy bajo |
| 2 | Visuales aislados de bajo uso (tag, divider, checkbox/radio, skeleton, progress, avatar, chip, breadcrumb, toolbar, message, badge) | ~15 wrappers, ≤20 usos c/u | Parcial (son swaps de clase CSS) | Alta | 🟢 Bajo |
| 3 | Interactivos de bajo uso (tabs, accordion, menu, carousel, popover, toast, splitbutton, selectbutton, toggleswitch) | ~9 wrappers, ≤5 usos c/u | Parcial (requiere `ng-bootstrap`, ya validado peer-compatible) | Media-alta | 🟡 Medio |
| 4 | Modales (`DialogHandlerService`) | 1 servicio + ~66 imports directos a reconciliar (610 consumidores NO se tocan) | **Sí — `IonicDialogModal` ya resuelve el mismo problema en móvil** | Media (un solo servicio, pero muy usado) | 🟡 Medio-alto (alto apalancamiento, bajo esfuerzo de código) |
| 5 | Inputs | 26 tipos × (web+adaptive+bridge), entrelazado con rollout adaptativo en curso | Sí — patrón CVA adaptativo ya existe | Media | 🟠 Alto |
| 6 | Tabla (`p-table` + ecosistema) | ~341 plantillas de feature + 1 componente nuevo | No hay equivalente propio aún — se construye en esta fase | Baja una vez desplegado a 341 archivos | 🔴 Muy alto |

**⚠️ Decisión 2026-09-14 (usuario): cambio de orden respecto a la
justificación original de abajo.** Modales (Fase 4) deja de ir antes que
Inputs — se agrupa con Tabla (Fase 6) como **el último bloque a revisar**,
después de Inputs (Fase 5). Motivo explícito del usuario: conviene cerrar
primero todo lo demás (incluyendo Inputs) y dejar `DialogHandlerService` +
final antes de la limpieza de Fase 7. Orden real de ejecución desde aquí:
**Fase 5 (Inputs) → Fase 4+6 combinadas (Modales+Tabla, al final) → Fase 7
(limpieza)**. La numeración de fases no se cambia (evita reescribir
referencias cruzadas en toda la carpeta); solo el orden de ejecución.
La justificación original de "Modales antes que Inputs" (párrafo
siguiente) queda como contexto histórico, ya no aplica al orden real.

**Por qué Modales (4) iba a ir antes que Inputs (5) y Tabla (6) — superado, ver nota arriba:** aunque tiene
610 consumidores indirectos, el código que realmente hay que escribir y
probar está concentrado en **un solo servicio** (`DialogHandlerService`),
y el repo ya contiene la técnica exacta para resolverlo (`Injector.create`
con stubs, ya probada en `IonicDialogModal` para móvil — ver
`05-tablas-y-modales.md` §B.3). Es más barato de construir y más fácil de
verificar que Inputs (26 tipos, decisión pendiente de secuenciación con
otro trabajo en curso) o que Tabla (341 archivos, sin componente propio
todavía). Migrarlo temprano además **valida en producción el stack
interactivo de `ng-bootstrap`** (modal, popper) antes de apoyarse en él
para Fase 3 y Fase 6.

---

### Fase 0 — Fundaciones (bloqueante, no se migra nada visual todavía)

#### 0.1 Ya resuelto (verificado 2026-09-13, tras la estabilización de Angular)

  accidental durante la migración ya no existe — no se requiere acción.
- ✅ **`primeicons` fijado:** `"primeicons": "8.0.1"` (antes `^7.0.0`).
- ✅ **`@ng-bootstrap/ng-bootstrap@21.0.0` es compatible con Angular
  22.1.6:** su `peerDependencies` declara `@angular/core: ^22.0.0`,
  `@angular/common/forms/localize: ^22.0.0`, `rxjs: ^6.5.3 || ^7.4.0`,
  `@popperjs/core: ^2.11.8`. Todo ya instalado y coherente
  (`npm ls @ng-bootstrap/ng-bootstrap` sin conflictos). **No se requiere
  actualizar `ng-bootstrap`.**
- ✅ **`@popperjs/core` ya está instalado** (`^2.11.8` en `package.json`,
  presente en `node_modules`) — requisito de `ng-bootstrap` para
  posicionar dropdown/popover/tooltip, ya satisfecho.

#### 0.2 Checklist de decisiones abiertas (esto es lo que falta definir)

Estas son las decisiones que bloquean empezar a escribir código de
Bootstrap real. Cada una necesita una respuesta explícita del equipo, no
una asunción de este documento:

| # | Decisión | Resultado | Bloquea a |
|---|---|---|---|
| 1 | Versión exacta de `bootstrap` a instalar | ✅ **Resuelto 2026-09-13**: `5.3.8` exacto, instalado con `--save-exact` | — |
| 2 | Estrategia de reactividad de tema (dark mode) en variables Bootstrap | ✅ **Resuelto 2026-09-13, distinto a lo planteado**: no existe `$enable-css-vars` en Bootstrap 5.3.8 (verificado en el código fuente). Se usan valores hex fijos en `_bootstrap-tokens.scss`; la reactividad de tema para componentes Bootstrap queda **pendiente de diseño**, no resuelta — ver §5 | Verificación visual de Fase 1 |
| 3 | Desactivar reboot de Bootstrap | ✅ **Resuelto 2026-09-13, distinto a lo planteado**: excluirlo a mano rompe el build (`_type.scss` depende de él). Se mantiene el reboot, envuelto en `@layer bootstrap` — todo el CSS unlayered existente ya le gana por especificación CSS. Ver §4 | — |
| 4 | Nombre del componente de tabla nuevo y si conserva `pSortableColumn` como nombre de atributo o se renombra | ✅ **Resuelto 2026-09-15 (confirmado con el usuario al arrancar Fase 6)**: `app-table` (componente), `appSortableColumn` (directiva de orden), `app-sorticon` (ícono de orden) — consistente con el prefijo `app-*` ya usado en todos los wrappers migrados (`app-tag`, `app-divider`, `app-toolbar`, `app-badge`...). Coincide con lo que ya usaban los ejemplos de código de `05-tablas-y-modales.md` §A.4/A.5, no requirió reescribirlos | — |
| 6 | Camino A/B para inputs frente al rollout adaptativo en curso | ✅ **Decidido**: (B) — congelar el rollout en curso y migrar directo a Bootstrap los tipos que faltan | Fase 5 |
| 7 | Firma exacta de `NgbModalOptions` para inyectar un `Injector` custom en la versión instalada (`ng-bootstrap@21.0.0`) | ✅ **Resuelto 2026-09-15**: `NgbModalOptions.injector?: Injector` existe tal cual en `types/ng-bootstrap-ng-bootstrap-modal.d.ts` de la versión instalada — la técnica de stub-vía-`Injector` de `IonicDialogModal` es directamente trasladable, sin cambiar de versión. Ver `05-tablas-y-modales.md` §B.3ter | — |
| 8 | Tabla de equivalencia `DialogSize` (px) → clases de tamaño de Bootstrap | ✅ **Resuelto 2026-09-15, más simple de lo planteado**: el enum `DialogSize` (`src/app/core/enums/dialog-size.enum.ts`) **ya usa nombres de clase Bootstrap** (`modal-sm`/`modal-md`/`modal-lg`/`modal-fullscreen`, no px) — no hace falta tabla de equivalencia, se aplican directo vía `windowClass`. Ver `05-tablas-y-modales.md` §B.3ter | — |
| 11 | Corrección de `estandar-hoja-estilos.md` (desactualizado) | ✅ **Resuelto 2026-09-13** | — |
| 12 | Política de "code freeze" por componente durante su migración | ✅ **Resuelto 2026-09-13**: no aplica mientras el flujo maestro/chalán mantenga un único ejecutor (agente externo) tocando cada componente a la vez — que es como ha operado toda la migración hasta ahora, sin choques. Si en el futuro hay 2+ desarrolladores trabajando wrappers en paralelo, se activa la política original (congelar el wrapper mientras está 🟡) | Todas las fases con más de un desarrollador/agente en paralelo |
| 13 | Quién aprueba que una fase pasa de 🟡 a 🟢 | ✅ **Resuelto 2026-09-13**: la auditoría de Claude (maestro/auditor) contra el criterio de aceptación de cada prompt — descrita en `00-INDICE.md` "Cambio de flujo de trabajo" — **es** la revisión de "segundo revisor" que pedía la recomendación original de §7; no se agrega un segundo revisor humano adicional | Todas las fases |

#### 0.3 Tareas de ejecución — estado real (actualizado 2026-09-13)

1. ✅ Instalar `bootstrap@5.3.8` exacto. Requirió `--legacy-peer-deps` por
   un conflicto de peer-dependencies **preexistente y no relacionado**
   (`vitest`/`@analogjs/vite-plugin-angular`/Storybook) — cualquier
   instalación nueva en este repo hoy tropieza con el mismo conflicto,
   independiente de Bootstrap. No se intentó resolver ese conflicto de
   fondo (fuera de alcance de esta migración).
2. ✅ Crear `_bootstrap-tokens.scss` + `_bootstrap-entry.scss`, enganchados
   en `ds-entry.scss` — con el diseño corregido de §4 (reboot incluido,
   dentro de `@layer bootstrap`), no el planteado originalmente.
   Verificado compilando con `sass` real (no solo revisado a ojo): el
   `.btn-primary` compilado deriva su color de hover/active correctamente
   de `#003152`, y `.btn`/las clases DS siguen fuera de cualquier `@layer`.
   producción (excluyendo `.spec.ts`): **41 archivos** (21 en `core/`, 18
   en `modules/`, 2 de plumbing raíz `app.ts`/`app.config.ts`). De esos,
   **9 archivos** importaban `DynamicDialogConfig`/`DynamicDialogRef`
   (`core/services/dialog-handler.service.ts`) — ya redirigidos, 0 cambio
   de comportamiento hoy, ver lista completa en `04-bitacora-cambios.md`.
   El resto son la excepción legítima de tabla (`TableModule`/
   `TableLazyLoadEvent`, 5 archivos) o componentes visuales sueltos
   (tag, botón, divider, etc., ~27 archivos) que se migran en su fase
   correspondiente (2 o 3), no ahora. Detalle completo por archivo en
   `03-inventario-componentes.md` y `04-bitacora-cambios.md`.
4. ✅ Corregido `src/styles/estandar-hoja-estilos.md`.
   decisión #10 arriba).
6. ✅ Extendida `scripts/audit-ui-boundaries.mjs` con la regla
   transicional: advierte (no bloquea) componentes de `web/` que importen
   preexistente real: `web/mesanio/mesanio.ts` (usa `ng-bootstrap`).
7. ✅ **Hecho 2026-09-13**: `ng build` de producción verde (con una
   advertencia de presupuesto de bundle esperada y ya ajustada, ver
   `04-bitacora-cambios.md`), más piloto visual real en `ng serve` +
   Playwright sobre la página de login (`/auth`), en tema claro y oscuro.
   se destapó y se corrigió un problema preexistente no relacionado
   (dependencia opcional faltante de `ngx-markdown`) que bloqueaba la
   carga de cualquier página en el dev server — documentado en la
   bitácora como fix fuera de alcance, hecho solo para poder verificar.

**Estado de la Fase 0: ✅ CERRADA (2026-09-13).** Las 7 tareas están
hechas. La Fase 1 (botones) puede arrancar.

---

### Fase 1 — Botones (quick win, valida el patrón de trabajo) ✅ CERRADA (2026-09-13)

Justificación: ya usan markup Bootstrap-like (`.btn`, hallazgo #2 del
análisis), bajo riesgo, alto volumen de uso (1,376 imports de
`@ui/buttons/*`), y sirvió como piloto real del proceso.

1. ✅ Auditado el código de `BaseButton`
   (`shared/ui/buttons/base/base-button.ts`) y de los ~25 componentes
   `buttons/web-label/*` / `web-icon/*`: todos renderizan `<button
   [class]="buttonClasses()">` plano, cero `p-button`/`pButton`, cero
   real encontrada:** `web-icon/button-tracking.ts` usa `<p-overlaybadge>`
   un problema del sistema de botones en sí, es una dependencia de
   Documentado en `03-inventario-componentes.md`, no bloquea esta fase.
2. ✅ **Auditoría propiedad-por-propiedad de `.btn` (Bootstrap) vs `.btn`
   (DS) — no solo visual, se comparó el CSS compilado real.** Encontró y
   corrigió una regresión real, confirmada por medición (no supuesta):
   el `.btn` del DS nunca declaraba `font-size` en el tamaño por defecto
   (solo lo hacían los modificadores `.btn-sm/-lg/-xs/-xl`), confiando en
   heredarlo de `body` (14px). Bootstrap **sí** declara `font-size` en su
   propia regla `.btn` (`1rem` = 16px). Las capas CSS solo deciden un
   ganador cuando hay una regla que **compite** en la misma propiedad; al
   no haber ninguna declaración propia de `font-size` en el `.btn` base,
   la de Bootstrap se aplicaba igual pese a estar en una capa de menor
   prioridad. Medido con `getComputedStyle` en vivo (`ng serve` +
   Playwright) sobre el botón real de "INICIAR SESIÓN" del login:
   **14px → 16px** al cargar Bootstrap. **Corregido** en
   `web/_buttons.scss` fijando `font-size: var(--ds-font-size-label,
   0.875rem)` explícitamente en el `.btn` base — re-verificado en vivo,
   vuelve a dar `14px`. Este hallazgo generaliza: **toda propiedad que
   Bootstrap declare en una regla y que el DS no declare explícitamente
   en la regla equivalente puede filtrarse, sin importar las capas.** Se
   aplica como método de verificación en cada fase siguiente, no solo en
   botones — ver nota metodológica más abajo.
3. ✅ Revisión adicional (bonus, no exhaustiva) de `.card` e `.input` del
   DS contra las reglas base equivalentes de Bootstrap, para detectar el
   mismo patrón de fuga antes de que toque su propia fase: `.input` ya
   declara `font-size` explícito (sin riesgo). `.card` no declara
   `position`, que Bootstrap sí fija en `relative` — se dejó sin tocar
   por ahora: es una diferencia de comportamiento, no visual, y en la
   inmensa mayoría de casos un contenedor de card se beneficia de ser
   contexto de posicionamiento en vez de perjudicarse. Queda anotado como
   ítem de bajo riesgo a confirmar cuando le toque su fase (`.card` no
   está en el alcance de ninguna fase numerada todavía porque no depende
   exposición ya existente a Bootstrap desde la Fase 0).
4. ✅ Sin cambios de selector, sin cambios de `@Input` — cumplido.

> **Nota metodológica (aplica a Fases 2 en adelante):** "Bootstrap está en
> una capa de menor prioridad" **no** significa "Bootstrap nunca gana".
> Solo gana el DS cuando **compite** una declaración propia para la
> **misma propiedad** en la **misma regla**. Antes de dar por cerrada
> cualquier fase futura, hay que comparar la regla base de Bootstrap del
> componente equivalente (`.badge`, `.alert`, `.nav-tabs`, `.modal`, etc.)
> contra la regla propia del DS, propiedad por propiedad — no basta con
> mirar una captura de pantalla, como demostró este caso (el cambio de
> 14px a 16px no era obvio a simple vista en el screenshot del login).

**Criterio de aceptación:** ✅ cumplido — verificación en código (100% de
los componentes de botón revisados) + verificación en vivo con
`getComputedStyle` real (no solo captura de pantalla) en el login,
regresión real encontrada y corregida, accesibilidad (44×44 mínimo táctil
en `.btn-icon`) sin cambios.

### Fase 2 — Componentes visuales aislados de bajo uso — ✅ CERRADA (2026-09-13)

**Progreso:** la tarea de "redirección" está completa para los 3 componentes
que ya tenían reemplazo nativo terminado: `tag` (22 sitios), `divider` (6
sitios) y `message` (1 sitio) ya usan `<app-tag>`/`<app-divider>`/
`<app-message>` en toda la app real (fuera de la herramienta de catálogo
`admin.luxuryapp/herramientas-dev/catalog-component-ui`, que se dejó
deliberadamente sin tocar — no está claro si esa página quiere mostrar
Verificado con `tsc --noEmit` (sin errores nuevos) y `npm run audit:ui`
(verde). La "reescritura interna" de `badge`, `avatar`, `chip`,
`checkbox`, `radio-button`, `skeleton`, `progress-bar`, `spinner`,
`toolbar`, `breadcrumbs` **también está completa** (verificada
componente por componente contra el código real el 2026-09-13, ver
`04-bitacora-cambios.md`) — ver detalle en `03-inventario-componentes.md`.
**Cierre:** verificación visual en vivo ✅ hecha y aceptada 2026-09-13
para los 4 componentes con consumidor real (`progress-bar`, `spinner`,
`badge`, `avatar`); catálogo interno ✅ migrado 2026-09-13 en su totalidad
`grep` sobre todo `catalog-component-ui/`), dejando `p-table`/`p-dialog`/
`p-tabs`/`p-accordion`/`p-toast`/`p-select*`/`p-datepicker`/`p-popover`/
propia fase. **Fase 2 declarada ✅ CERRADA** por decisión del usuario:
las políticas de code-freeze/segundo revisor (decisiones #12/#13 de
Fase 0) son transversales a todas las fases —no se habían exigido
tampoco para cerrar Fases 0 y 1— y el ítem `p-api` es explícitamente
Fase 3/4, no bloquea esta. Ver detalle completo en
`04-bitacora-cambios.md`.

> ⚠️ **Corrección 2026-09-14 (auditoría de maestro): el párrafo de
> arriba tenía afirmaciones falsas, no solo imprecisas.** Al preparar el
> cierre de Fase 4 se auditó contra código real (no contra lo
> documentado) el estado de cada componente de esta fase, y se
> encontró: `divider` y `checkbox` tenían **0% de adopción real** del
> componente propio (`<app-divider>`/`<app-checkbox>` no aparecían en
> ningún consumidor de producción, en ningún archivo) pese a estar
> marcados 🟢 "reescritura completa verificada"; `skeleton` igual, 0%
> de adopción; `badge` tenía solo 1 uso real y la excepción de
> `buttons/web-icon/button-tracking.ts` (citada arriba como parte de la
> "reescritura interna completa") seguía usando `<p-overlaybadge>` de
> cerrados. Se armó un prompt de auditoría profunda + un prompt de
> resolución, ambos ejecutados y verificados en código el 2026-09-14 —
> **ahora sí cerrados de verdad**, ver `03-inventario-componentes.md`
> (filas 🟢 con fecha 2026-09-14) y la sección larga de
> `04-bitacora-cambios.md` del mismo día ("Antes de escribir el prompt
> de resolución...", "Auditoría profunda aplicada al inventario...").
> **Lección para toda fase futura**: "verificado componente por
> componente contra el código real" no es suficiente como afirmación —
> debe ir acompañada de la evidencia concreta (qué se corrió, qué
> devolvió) o se trata como no verificado.

> ⚠️ **Hallazgo que reescribe el costo de esta fase (2026-09-13, al
> empezar a implementar `tag`):** al buscar dónde vive el wrapper de
> `p-tag` para diseñar su reemplazo, se descubrió que **ya existe** un
> componente `app-tag` (`shared/ui/web/tag/tag.ts`) completo, con su
> propia base compartida (`shared/ui/base/tag.base.ts`), **sin ninguna
> `--ds-*`. Es una implementación TERMINADA que nadie está usando todavía
> directo) en vez de `<app-tag>`. Se hizo un barrido de **todas** las
> (`web/<nombre>`, sin el prefijo) y el resultado fue:
>
> | Estado | Componentes |
> |---|---|
> | ✅ **Ya existe, limpio, listo para adoptar** (solo falta redirigir las plantillas de feature) | `tag`, `divider`, `message`, `status-badge` |
> | ❌ **No existe ninguna contraparte, hay que crear el componente desde cero** | `select-button`, `toggle-switch` (Fase 3) |
>
> **Consecuencia práctica:** ningún componente de esta fase (ni de la
> Fase 3) requiere diseñar una API nueva o inventar un selector — o ya
> está resuelto, o el patrón (`*Base` + componente concreto por
> plataforma) ya está establecido y solo falta completar la
> implementación interna. El trabajo real de "Fase 2" se divide en dos
> tareas de naturaleza distinta:
> 1. **Redirección** (`tag`, `divider`, `message`, `status-badge`):
>    cambiar `<p-tag>`/`<p-divider>`/`<p-message>` por
>    `<app-tag>`/`<app-divider>`/`<app-message>` en cada plantilla de
>    feature que los usa — sin tocar CSS, el componente destino ya está
>    terminado y en uso en otras partes de la app.
> 2. **Reescritura interna** (`badge`, `avatar`, `chip`, `checkbox`,
>    `radio-button`, `skeleton`, `progress-bar`, `spinner`, `toolbar`,
>    `breadcrumbs`): mismo selector, mismo `XBase`, se reemplaza el
>    `--ds-*` — análogo a lo que ya se demostró viable en `tag.base.ts`
>    (que ya expone un `colors()` computed reutilizable con el mismo
>    patrón de `bg`/`text`/`border` por severidad).

Componentes sin comportamiento interactivo complejo (no requieren JS de
`ng-bootstrap`), cada uno con ≤20 usos medidos, wrapper autocontenido:

|---|---:|---|
| `p-tag` | 20 | `.badge` + variantes de color del DS |
| `p-message` | 13 | `.alert` (ya existen clases DS en `web/_alerts.scss`) |
| `p-divider` | 12 | `<hr>` / utilitario propio |
| `p-checkbox` | 11 | `<input class="form-check-input">` |
| `p-radiobutton` | 4 | `<input class="form-check-input" type="radio">` |
| `p-skeleton` | 7 | `.placeholder`/`.placeholder-glow` (Bootstrap 5.3+) |
| `p-progressspinner` | 5 | `.spinner-border`/`.spinner-grow` |
| `p-progressbar` | 1 | `.progress`/`.progress-bar` |
| `p-badge` | 2 | `.badge` |
| `p-avatar` | 1 | Clases propias ya semi-existentes (`custom/_avatars.scss`) |
| `p-chip` | 1 | `.badge.rounded-pill` o componente propio |
| `p-breadcrumb` | 1 | `.breadcrumb` |
| `p-toolbar` | 3 | `.d-flex`/`.navbar` utilitario |

**Criterio de aceptación por componente:** mismo selector `app-*`, cero
cambios en las features que lo consumen (excepto fugas ya corregidas en
Fase 0).

### Fase 3 — Componentes interactivos de bajo uso

> ⚠️ **Hallazgo al iniciar el análisis real (2026-09-13):** el conteo de
> "Usos" de esta tabla (medido 2026-09-12 sobre imports `@ui/web/*`) no
> refleja la realidad — mismo patrón que el hallazgo de Fase 2. Se
> verificó código real + `grep` de uso (`<app-X`, `<p-X` directo fuera de
> wrappers) para cada componente:
>
> | Componente | Andamiaje (`*Base`+`web/*`) | Uso real del wrapper `app-*` | Fuga directa `<p-*>` fuera del wrapper (mayor riesgo) |
> |---|---|---|---|
> | `select-button` | ❌ no existe, crear desde cero | — | 2: `recruitment.../recruitment-agenda-list.html` y **el mismo header del shell** (`header-employee-monitor.html`) |
> | `toggle-switch` | ❌ no existe, crear desde cero | — | **0** fuera del catálogo (más bajo riesgo de lo que sugiere la tabla original) |
> | `toast`/`custom-toast` | Servicio central, no un componente visual suelto | — | **No es un simple swap de tag** — ver hallazgo siguiente |
>
> **Hallazgo adicional sobre `toast`:** no es un componente aislado de "3
> usos". `app.ts` hospeda el `<p-toast>`/`<p-custom-toast>` raíz, y **dos
> servicios paralelos** (`core/services/custom-toast.service.ts` y
> superposición de responsabilidad no resuelta, ajena a esta migración)
> archivos de features** (`cont-list-minuta-pendientes.ts`,
> `admin-vacaciones-balance.ts`, `diagram-editor.ts`,
> `ordenes-servicio-fotos.ts`, `ordenes-servicio-reporte-proveedor.ts`,
> `manual-flowchart-editor.ts`, `org-chart.ts`, `orden-compra*.ts/html`).
> Migrar el toast de verdad requiere reemplazar `MessageService` mismo
> patrón que `DialogHandlerService` en Fase 4** (stub vía
> `Injector.create`, barrel intacto para los consumidores). No se
> resuelve como los demás componentes de esta fase.
>
> **Consecuencia — orden de ejecución revisado dentro de Fase 3 (de menor
> a mayor riesgo real, no por el conteo original):**
> 1. `tabs`, `split-button` — cero consumidores en todo el repo, reescritura interna sin riesgo de regresión.
> 2. `toggle-switch` — crear desde cero, cero consumidores reales que romper.
> 3. `accordion`, `carousel` — reescritura interna + 1 fuga directa cada uno, fuera del shell.
> 4. `select-button` — crear desde cero, con 2 usos reales a migrar (uno en el shell).
> 5. `menu` — reescritura interna + 1 fuga en el shell (header).
> 6. `popover` — reescritura interna + 2 fugas en el shell (perfil, visible en cada pantalla autenticada) — el de mayor visibilidad de los componentes "simples".
> 7. `toast`/`custom-toast` — tratamiento especial tipo Fase 4 (reemplazo de `MessageService`), se aborda al final de esta fase o se reprograma junto a Fase 4 — decisión pendiente de confirmar con el usuario.

Requieren el comportamiento JS de `ng-bootstrap` (ya validado
peer-compatible en Fase 0). Se agrupan aparte de la Fase 2 porque su
riesgo es mayor: hay estado (abierto/cerrado), navegación por teclado,
posicionamiento (popper):

|---|---:|---|---|
| `p-tabs`/`p-tabview` | 2 | `NgbNav` / `.nav.nav-tabs` | |
| `p-accordion` | 1 | `NgbAccordion` | |
| `p-menu` | 2 | `NgbDropdown` + `.dropdown-menu` | |
| `p-carousel` | 1 | `NgbCarousel` | |
| `p-popover` | 1 | `NgbPopover` | |
| `p-toast` / `p-custom-toast` | 3 / 2 | `NgbToast` o servicio propio sobre `.toast` | Evaluar si conviene sustituir el servicio de notificaciones central, no solo el componente visual |
| `p-splitbutton` | 1 | `.btn-group` + `.dropdown-toggle-split` | |
| `p-selectbutton` | 3 | `.btn-group` con radios ocultos | |
| `p-toggleswitch` | 2 | `.form-check.form-switch` | |
| `p-select`/`p-multiselect`/`p-autocomplete` (directos, fuera de `inputs/`) | 4/2/1 | `@ng-select` (ya integrado, ver Fase 5) | Si aparecen antes de la Fase 5 de inputs, migrarlos igual — no esperar |
| `p-iconfield`/`p-inputicon`/`p-inputgroup(addon)`/`p-floatlabel` | ≤2 c/u | `.input-group`/`.form-floating` de Bootstrap | |
| `p-api` (tipos `MenuItem`, etc.) | 29 | Tipos propios o los de `@ng-bootstrap` según destino | Transversal a varios de los componentes de esta fase |

**Criterio de aceptación:** además de lo transversal (§7), verificar
explícitamente navegación por teclado y foco visible en cada componente
migrado (son los que más dependen de esto).

> ⚠️ **Cierre real de Fases 2-3, con hallazgos adicionales
> (2026-09-14).** Al auditar el estado de `toolbar`/`breadcrumb` (ver
> nota al inicio del documento) se encontraron, además, **9 tipos de
> plan** — no aparecían ni en la tabla de Fase 2 ni en la de Fase 3
> porque nadie los había medido: `p-button`/`pButton` directo (fuera del
> sistema de botones de Fase 1), `pTooltip`, `pInputTextarea`,
> `p-scrollpanel`, `p-drawer`, `p-panel`, `p-timeline`, `pRipple`. Se
> armó un prompt de resolución con archivo:línea exacto para cada uno
> (ver `04-bitacora-cambios.md`, entradas del 2026-09-14). Estado final
> del día, verificado en código (no solo reportado):
>
> | Ítem | Estado |
> |---|---|
> | `divider`, `checkbox`, `skeleton`, `badge`/`p-overlaybadge`, `avatar`, `tag`, `spinner` (fugas residuales de Fase 2, ver hallazgo arriba) | ✅ Cerrado 2026-09-14 |
> | `pTooltip`, `pInputTextarea`, `p-scrollpanel`, `p-drawer`, `pRipple` | ✅ Cerrado 2026-09-14 |
> | `p-button`/`pButton` directo | 🟡 1 de 5 archivos cerrado (`aspel-cobranza-haus.html`); pendientes: `aspel-cobranza-haus-debt-detail-modal.html:216`, `committee-cobranza-web.html:143`, `password-list.html:55,64`, `analisis-cobranza-cliente.html:46` |
> | `p-panel` | 🔴 Pendiente: `recurring-task-catalog-form.html:62` |
> | `p-timeline` | 🔴 Pendiente: `vacancy-candidates-timeline-modal.html:36` |
>
> Ver `03-inventario-componentes.md` para el detalle fila por fila.
> Durante esta auditoría también se detectó y corrigió un **incidente
> grave no relacionado con el contenido de la migración**: un script de
> reemplazo de texto automático (no pedido, corrido por el chalán)
> corrompió `~350 archivos` en toda la app (`d-md-block`→`d-md-d-block`
> y variantes, `overflow-hidden`→`overflow-d-none`), causando que el
> header y el contenido de la app dejaran de renderizarse. Corregido el
> mismo día — ver la entrada larga de `04-bitacora-cambios.md`
> ("INCIDENTE GRAVE"). **Regla adoptada desde entonces**: el chalán no
> corre scripts de automatización propios sobre el repo salvo que el
> prompt lo pida explícitamente; todo cambio masivo se audita con
> `grep` dirigido antes de aceptarse, sin importar qué tan en verde
> reporte sus propias verificaciones (`tsc`/`ng build` no detectan
> clases CSS semánticamente rotas).

### Fase 4 — Modales (`DialogHandlerService`)

> ⚠️ **Ítem descubierto en Fase 5 (2026-09-14), agregado aquí**:
> `inputs/web/custom-input-upload-pdf-signal.ts` (`app-subir-pdf`) está
> mal ubicado por nombre de archivo — no es un input de formulario, es
> un diálogo modal real (`DynamicDialogRef`/`DynamicDialogConfig`) con
> upload HTTP (`ApiResponseService.onPostFile`) y UI avanzada de
> `p-fileupload` (drag-drop multi-archivo). **Importa
> `DynamicDialogConfig`/`DynamicDialogRef` directo de
> que el punto 4 de abajo debe reconciliar. Agregarlo a la lista exacta
> de archivos a redirigir al barrel antes de migrar `DialogHandlerService`
> en sí.

Ver el análisis completo con código real en
[05-tablas-y-modales.md](./05-tablas-y-modales.md) §B — **ampliado
2026-09-15** con una verificación profunda pedida explícitamente por el
usuario antes de ejecutar esta fase ("ir a fondo para tener nuestro
propio motor que dé los beneficios que tenemos con estos modales").
Hallazgo clave de esa verificación: **el riesgo real no es reabrir el
dibuja automáticamente fuera del formulario — ningún componente de
formulario la dibuja por su cuenta hoy, así que el motor propio debe
incluir un componente `DesktopDialogShell` (gemelo de
`IonicDialogModal`, ya usado en producción para móvil) que la reponga.
Resumen ejecutable:

1. ~~Confirmar la decisión #7 y #8 del checklist de Fase 0~~ ✅
   **Resueltas 2026-09-15** — `NgbModalOptions.injector` sí existe en
   la versión instalada; `DialogSize` ya usa nombres de clase Bootstrap,
   no hace falta tabla de equivalencia px→clase.
2. Construir `DesktopDialogShell` (nuevo) con el header/botón-cerrar que
   hoy falta, y reimplementar la rama desktop de
   `DialogHandlerService.openDialog()`/`openDialogCustom()` sobre
   `NgbModal.open(DesktopDialogShell, { injector, ... })`, replicando
   **exactamente** la técnica de stub ya usada en
   `core/services/ionic-dialog-modal.ts` para la rama móvil. Ver el
   boceto de código completo en `05-tablas-y-modales.md` §B.3ter.
3. Redefinir `DynamicDialogConfig`/`DynamicDialogRef`/`DialogService`/
   `DialogSize` como tipos propios con el mismo shape mínimo (`data` en
   config; `close()`, `onClose`, `onDestroy` en ref), exportados desde el
   mismo archivo — los 610 consumidores del barrel no cambian una línea.
   **Manejar explícitamente** que `NgbModalRef.result` rechaza en
   dismiss (X/Esc/backdrop) a diferencia del comportamiento actual que
   siempre resuelve (`.result.catch(() => undefined)`).
   código de producción real (no specs, no plumbing) hacia el barrel
   local — 16 archivos, ya listados en `03-inventario-componentes.md`.
5. `autoMaximize` (12 usos reales, no 2 — cifra corregida) se preserva
   vía `NgbModalRef.update({ fullscreen: true })`. **`draggable` y
   `resizable` quedan fuera de alcance** — decisión confirmada con el
   usuario 2026-09-15 tras comprobar que los 265 consumidores reales
   nunca los desactivan ni dependen de ellos explícitamente (0 evidencia
   de uso deliberado). `dismissableMask`/`position`/`extraOptions` no
   tienen ningún uso real medido, no requieren construirse. Ver
   `05-tablas-y-modales.md` §B.2bis y §B.4 para el detalle completo.

**Criterio de aceptación:** un formulario real abierto vía `openDialog()`
(ej. `bank-form` del módulo de bancos) se ve y comporta igual: **título y
botón cerrar visibles**, abre, lee `config.data`, cierra con
`ref.close(resultado)`, el `Promise` resuelve con ese resultado; cerrar
con X/Escape/backdrop también resuelve (con `undefined`), no lanza un
rechazo sin capturar. Probar también un caso `autoMaximize` real (ej.
`funding-detail.ts`) y un caso con `size = full` (segundo tamaño más
usado tras `lg`).

> ✅ **Fase 4 cerrada 2026-09-15** (commit `6b86307ef`). Ejecutada por el
> chalán en varias iteraciones auditadas contra código real en cada
> paso (ver `04-bitacora-cambios.md` para el detalle completo del
> proceso, incluyendo dos hallazgos no triviales corregidos en el
> camino): `DesktopDialogShell` construido y funcionando, `DialogHandlerService`
> en todo `src/app` (verificado con grep), build de producción limpio
> desde cero, confirmación visual real del usuario (modal centrado,
> fondo oscurecido, tamaño correcto). Botón de cerrar migrado de
> `.btn-close` a `app-icon` por pedido explícito del usuario (consistencia
> visual con el resto del design system). Pendiente, fuera de alcance de
> esta fase: botón visible de maximizar/restaurar en el header (hoy
> `autoMaximize` solo se dispara programáticamente, no hay toggle manual) —
> queda anotado para una futura pasada de pulido visual, no bloquea el
> cierre de Fase 4.

### Fase 5 — Inputs (coordinada con el rollout adaptativo en curso)

Ver hallazgo #8 del análisis: el patrón adaptativo de inputs está a mitad
de camino (5 de ~15+ tipos: text, select, number, textarea, checkbox).
Decisión ya tomada en el checklist de Fase 0 (#6): **camino B — congelar
los tipos que faltan**, para no construirlos dos veces.

Reemplazo propuesto para los 26 tipos de `inputs/web/*`: `<input
class="form-control">` / `<select class="form-select">` /
`<textarea class="form-control">` nativos de Bootstrap para los tipos
simples; `@ng-select` (ya es dependencia, ya existe
`inputs/web/input-ng-select`) para select/multiselect/autocomplete;
mantener `flatpickr` para date/date-time/date-range (ya sin dependencia

**Criterio de aceptación:** validación de formularios reactivos
(mensajes de error, estados `touched`/`dirty`/`invalid`), comportamiento
de foco y accesibilidad (label asociado, `aria-describedby` en mensajes de
error) verificados explícitamente por tipo — es el área con mayor riesgo
de regresión silenciosa de UX.

### Fase 6 — El ecosistema de tabla (el ítem más grande, al final a propósito)

Se migra **al final** porque es el de mayor huella (341 plantillas), el
único sin componente propio de reemplazo todavía, y porque para entonces
ya se habrá probado en producción: la convivencia CSS (Fase 1-2), el
stack interactivo de `ng-bootstrap` (Fase 3-4), y el patrón de trabajo de
principio a fin (todas las fases previas). Ver detalle completo con código
real en [05-tablas-y-modales.md](./05-tablas-y-modales.md) §A.

1. Resolver las decisiones #4 y #5 del checklist de Fase 0 (nombre del
   componente/atributo de orden, propio vs. librería headless).
2. Diseñar `app-table` sobre `.table` de Bootstrap, conservando la
   ergonomía de slots `<ng-template #caption/#header/#body/
   #emptymessage/#paginatorleft>` (§A.4 de `05-tablas-y-modales.md`),
   `filterGlobal()` del nuevo componente.
3. Diseñar primero el caso client-side (cubre 178 tablas con orden y 183
   con scroll interno) y en una segunda pasada el modo `[lazy]`/
   `(onLazyLoad)` para las 12 pantallas server-side.
4. **No migrar las 341 features de golpe.** Lote piloto de 3-5 pantallas
   de complejidad distinta (simple, con filtro+paginación server-side, con
   columnas dinámicas) antes del rollout masivo.
5. Evaluar codemod/script de reemplazo asistido tras el lote piloto (el
   cambio por archivo es mecánico y acotado si se conserva la ergonomía de
   slots, ver `05-tablas-y-modales.md` §A.5).
6. Actualizar la excepción de `conventions/CONVENTIONS.md` ("Regla

**Criterio de aceptación:** lote piloto con build verde, paridad funcional
(orden, filtro, paginación, export si aplica) verificada manualmente

### Fase 6.5 — Track Flex (Migración masiva de PrimeFlex)

> **Addendum registrado:** `docs/plans/primeflex-migration-audit.md` +
> `docs/plans/primeflex-migration-addendum.md`.
>
> ⚠️ **Alcance corregido 2026-09-15** — ver
> [06-preflight-fase4-6-primeflex-iconos.md](./06-preflight-fase4-6-primeflex-iconos.md).
> Se pidió un escaneo de verificación antes de iniciar Fase 4+6 y se
> encontró que el audit original y dos reportes automáticos nuevos
> cuentan coincidencias de subcadena sin límite de palabra
> (`flex-column` cuenta como "flex"; `table-col-20` cuenta como
> "col-20"). Reverificado con grep de token exacto + cruce contra
> `bootstrap.css` compilado: **la mayoría de las categorías de la tabla
> de abajo ya están migradas (0 archivos reales)** — `flex`, `hidden`,
> `block`, `grid`, `uppercase`/`lowercase`, `border-round`/`-circle`/
> `-none`, `mr-N`/`ml-N`, `text-color`/`surface-*` (1 solo hit, en un
> `.bak.html` que Angular no compila). **El alcance real corregido es
> ~320-390 archivos** (no ~650) en categorías genuinamente muertas no
> detectadas antes: sintaxis responsiva con `:` de PrimeFlex v4
> (`md:col-6`, 63 archivos), `border-{lado}-N` (133), `w-full`/`h-full`
> (176/104), `absolute`/`relative`/`fixed`/`sticky` aisladas (13/30/2/5),
> `line-height-N` (87), `max-w-*` (31), `min-w-0` (69, corrige el audit
> original que la daba por compatible). Ninguna toca `<p-table>` ni
> `DynamicDialog` — no bloquea ni depende de Fase 4/6, puede ejecutarse
> en paralelo. Ver la tabla de mapeo completa en el documento 06.

PrimeFlex **no bloquea** las Fases 0–6 (componentes UI). Sus clases CSS
conviven pacíficamente con Bootstrap durante la migración de componentes.
Sin embargo, **no puede eliminarse en la Fase 7 sin haber ejecutado
antes su propio plan de reemplazo** — hacerlo colapsaría la UI
completamente.

**Alcance:** reemplazo masivo de clases de utilidad PrimeFlex por sus
equivalentes nativos de Bootstrap 5 en **todos** los archivos `.html`
bajo `appsweb/angular/src/`.

| Categoría | Ocurrencias estimadas | Patrones principales |
|-----------|----------------------:|---------------------|
| `flex` (aislada + variantes) | ~4,000+ | `flex` → `d-flex`, `flex-column`/`flex-row` compatibles, `sm:flex-row` → `flex-sm-row` |
| `col-N` (grid columns) | ~2,500+ | `col-N` compatible, `grid` → `row`, `grid-nogutter` → `row g-0` |
| `mr-*`/`ml-*` (espaciado direccional) | ~2,000+ | `mr-N` → `me-N`, `ml-N` → `ms-N` |
| `font-bold`/`font-semibold`/`font-medium` | ~1,200+ | `fw-bold`, `fw-semibold`, `fw-medium` |
| `align-items-*`/`justify-content-*` | ~3,500+ | Compatibles; responsive: `lg:align-items-center` → `align-items-lg-center` |
| `w-full`/`h-full` | ~800+ | `w-100`/`h-100` (⚠️ no usar `vw-100` por scroll horizontal en Windows) |
| `hidden`/`md:block` | ~15 | `d-none d-md-block` |
| `uppercase`/`lowercase` | ~150+ | `text-uppercase`/`text-lowercase` |
| Colores semánticos (`text-color`, `surface-*`) | ~400+ | Requieren mapping a tokens DS (`var(--ds-*)`) — ver addendum §1.1 |
| `white-space-nowrap`/`text-overflow-ellipsis` | ~66 | `text-nowrap`/`text-truncate` |

**Enfoque de ejecución:** codemods / scripts de búsqueda y reemplazo
regex — **no es viable componente por componente** a mano dada la escala
(~650 archivos afectados, ~15,000+ ocurrencias totales). Se seguirá el
siguiente orden:

1. **Preparación:** validar reglas de reemplazo en lote piloto de 5–10
   archivos de diversidad de módulos (ver tabla de equivalencias completa
   en `primeflex-migration-audit.md` §Mapa de Reemplazo).
2. **Script de reemplazo:** implementar regex por categoría (flex, col,
   spacing, typography, sizing, display responsivo), ejecutar contra todo
   `appsweb/angular/src/` excluyendo `*.ts`, `*.scss`, `*.spec.ts`.
3. **Clases sin equivalente directo:** las clases semánticas omitidas
   (`text-color`, `surface-ground`, `surface-card`, `surface-border`,
   etc.) requieren mapping explícito a tokens DS — documentado en
   `primeflex-migration-addendum.md` §1.1. Estas **no** se resuelven con
   regex simple; requieren análisis de contexto por archivo.
4. **Verificación:** `ng build` + `npm run audit:ui` tras cada lote de
   reemplazos. Revisión visual en tema claro/oscuro.
5. **Cierre:** confirmar 0 usos de clases PrimeFlex con grep antes de
   avanzar a la Fase 7.

**Clases omitidas en la auditoría original (documentadas en addendum):**
`text-color` (~167 usos), `surface-ground`/`surface-card` (~250),
`white-space-nowrap` (~35), `text-overflow-ellipsis` (~31), `w-screen`
(⚠️ riesgo de scroll horizontal), `border-1`/`border-2`/`border-3`
(BS5 requiere clase `border` base además del grosor),
`flex-order-*` → `order-*`.

**Criterio de aceptación:** grep de `primeflex` en clases `.html` deve
dar 0 resultados. `ng build` verde. Sin regresiones visuales en muestreo
de al menos 10 pantallas representativas (CRUD, formulario, dashboard,
login).

### Fase 7 — Limpieza final

   el inventario en `03-inventario-componentes.md` esté 100% 🟢.
2. Eliminar `src/styles/theme/mypreset.ts` y toda referencia en
   `app.config.ts`.
4. Eliminar los overrides `web/_prime-*.scss` (9 archivos) y
   `web/_prime-tokens.scss`.
5. Actualizar `conventions/ui/*`, `conventions/styles/*` y
   `arquitectura-shared-ui.md` para reflejar Bootstrap como estándar de
   `web/` — la actualización real de esas reglas vive en `conventions/`,
   este plan solo la dispara.
6. Actualizar `scripts/audit-ui-boundaries.mjs` para que `web/` prohíba
7. Retirar el flag transicional de la Fase 0.

---

## 7. Criterios de aceptación transversales (aplican a toda fase)

- `ng build` sin errores ni warnings nuevos.
- `npm run audit:ui` verde.
- Sin `::ng-deep` nuevo, sin `!important` nuevo salvo los ya documentados
  como excepción (`prefers-reduced-motion`, `_dark-mode.scss`).
- Todo valor visual nuevo vía `var(--ds-*)`, nunca hex/rgba hardcodeado
  (regla crítica ya vigente, `conventions/ui/design-tokens-rule.md`).
- Verificación en ambos temas (claro/oscuro) y en al menos un breakpoint
  móvil si el componente tiene contraparte responsive en desktop.
- Revisión de un segundo desarrollador antes de marcar 🟢 (decisión #13
  del checklist de Fase 0).
- Entrada correspondiente en `04-bitacora-cambios.md` con fecha y alcance.

## 8. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| La tabla (Fase 6) se subestima y bloquea todo el plan | Lote piloto obligatorio antes del rollout masivo; fase con criterio de aceptación propio, no se puede saltar; se hace al final cuando el patrón de trabajo ya está probado |
| Se pierde reactividad de tema (dark mode) al mapear tokens a variables SCSS de Bootstrap | `$enable-css-vars` de Bootstrap 5.3+ (decisión #2 del checklist) |
| Documentación queda inconsistente durante la migración (conventions vs. realidad) | Cada fase que retire un patrón actualiza `conventions/` como parte de su "hecho", no como tarea aparte |

## 9. Cómo medir avance

repo**, medible en cualquier momento con:

```
```

Línea base medida en el análisis inicial (2026-09-12): **83 archivos**.
La meta de la Fase 7 es **0**. `03-inventario-componentes.md` desglosa
esta métrica por componente para seguimiento fino fase a fase.
