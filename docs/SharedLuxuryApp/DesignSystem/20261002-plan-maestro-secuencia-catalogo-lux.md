Ruta: 📂 docs > 🤝 SharedLuxuryApp > 🎨 DesignSystem

> 📅 Fecha: 2026-10-02
> 🛡️ Estado: **PLAN VIGENTE — pendiente de aprobación por fase.** Ningún código
> tocado todavía. Este documento orquesta; no ejecuta.
> 📚 Basado en: `20261002-propuesta-catalogo-marca-componentes.md` (idea original,
> ahora histórica) + `20261002-verificacion-catalogo-marca-lux.md` (auditoría real,
> 728 líneas + 2 anexos con evidencia archivo:línea).
> 👤 Autor: agente IA (orquestador — no modifica código directamente, delega por fase)

# Plan maestro — De "catálogo de marca propuesto" a librería ejecutable

## 0. Qué cambió desde la propuesta original

La propuesta inicial (`lux-*` / `lux-*-web` / `lux-*-mobile`, con web/mobile
"internos") se basaba en 2 premisas que la auditoría **refutó con evidencia
exhaustiva, no muestreada**:

| Premisa original | Realidad verificada |
|---|---|
| "Nunca se escribe `lux-*-web`/`lux-*-mobile` en negocio; solo `adaptive/` cruza" | **1 724 imports directos** desde 454 archivos de negocio a `web/`/`mobile/` (1 172 + 552). Botones **no tienen** capa `adaptive/`: negocio importa `il-button`/`iw-button` directo 1 085+309 veces. |
| "Agnósticos (`app-icon`, `kpi-card`...) van directo a `lux-*` sin sufijo" | `app-icon` (1 513 usos) tiene contraparte móvil (`ili-icon`) y adaptativa (`lx-icon`, 1 uso). El mapeo propuesto crea **colisión**: ambos terminan en `lux-icon`. |

Además, la auditoría encontró un riesgo que la propuesta no contemplaba:
**19 reglas CSS reales seleccionan por nombre de tag** (no por clase) — un rename
hoy compilaría pero rompería estilos en silencio (sin error de build ni de lint).

**Conclusión operativa:** no se ejecuta ningún rename todavía. Se ejecutan primero
los prerrequisitos (Fase 0), después se decide la colisión de iconos (Fase 0b), y
solo entonces el rename mecánico (Fase 1+).

---

## 1. Secuencia de fases (orden obligatorio, no paralelizable entre sí salvo donde se indique)

```
Fase 0   — Migrar CSS por tag → clase + unificar breakpoints       [BLOQUEANTE, primero]
Fase 0b  — Resolver colisión app-icon ↔ lx-icon                     [BLOQUEANTE, antes de nombrar]
Fase 1   — Rename mecánico por capas (adaptive, primitives, core)   [requiere 0 y 0b cerradas]
Fase 2   — Rename de implementaciones internas (web/mobile)         [requiere Fase 1]
Fase 3   — Fusión de botones 4→2 carpetas (rediseño de API, no solo rename) [al final, con bridge]
Fase 4   — Inputs: marca pública + alias @lux/ui opcional           [en paralelo con Fase 3]

Workstream paralelo (independiente del rename, puede arrancar YA):
  Brechas PrimeNG — a11y de overlays, i18n, public-api.ts, tests reales
  (ver §4). Tienen más valor para el usuario final que el rename y no
  dependen de él.
```

### Por qué este orden y no otro

- **Fase 0 primero**: es la única fase que, si se omite, hace que CUALQUIER rename
  posterior rompa UI en producción sin que ningún pipeline lo detecte. No es
  opcional ni se puede hacer "en paralelo" con el rename — tiene que estar cerrada
  antes.
- **Fase 0b antes de Fase 1**: si no se decide qué pasa con `app-icon`/`lx-icon`
  antes de nombrar, la Fase 1 hereda la colisión y hay que repetir trabajo.
- **Fase 1 antes de Fase 2**: Fase 1 es de bajo riesgo (51+18 componentes, cambio
  mecánico de 2-3 caracteres). Fase 2 toca 143 componentes internos pero el
  **radio de impacto real en negocio** es menor de lo que parecía (según la
  propuesta original) — la auditoría demostró que SÍ hay impacto directo en
  negocio (botones, `custom-input-*-signal`), así que Fase 2 necesita el mismo
  cuidado de codemod + bridge que Fase 1, no es "solo interno" como se creía.
- **Fase 3 (botones) al final**: requiere diseñar una API nueva (`displayMode`),
  no es mecánico. Alto impacto de uso (1 085+309 referencias). Se hace con el
  mismo patrón de "bridge" que el equipo ya probó con inputs adaptativos. Diseño
  de API **ya confirmado**, ver §1bis.
- **Workstream de brechas PrimeNG en paralelo**: no depende del rename y, según
  la auditoría, tiene más impacto real para el usuario final (a11y de overlays,
  i18n) que renombrar selectores. Puede arrancar desde ya, sin esperar Fase 0.

---

## 1bis. Decisión confirmada — API de botón (Fase 3), 2 ejes independientes

Durante la revisión de este plan se verificó con evidencia real (no suposición)
que la decisión de mostrar label/icono en un botón **no depende de plataforma ni
de tamaño de pantalla** — depende del diseño de cada pantalla en ese punto
específico. Evidencia: el mismo botón de acción "Ayuda" aparece:
- **CON label** en `modules/accounting.luxuryapp/fundings/funding/funding-list.html`
  (`<il-button label="Ayuda" variant="outline" />`, dentro de un caption de tabla).
- **SOLO ICONO + tooltip** en
  `modules/accounting.luxuryapp/fundings/funding-accounting/funding-accounting-list.html`
  (`<iw-button-item iconClass="..." lxTooltip="Ayuda" />`, mismo tipo de caption).

Se confirmaron **37 casos reales** de botones icon-only dentro de
captions/toolbars (espacio no comprimido) — descarta la hipótesis de que
icon-only es solo "por falta de espacio en filas de tabla".

**Decisión de diseño para Fase 3 (confirmada, no pendiente de revisión):**

1. **Eje plataforma** (web Bootstrap vs. Ionic) sigue **100% separado**, cero
   abstracción forzada entre las dos implementaciones reales. Decidido
   internamente por `adaptive/` vía `PlatformService.isMobile()`, invisible al
   consumidor. **No cambia respecto a hoy.**
2. **Eje presentación** (`displayMode: 'label' | 'icon' | 'both'`) es una **prop
   pública** del componente de botón, decidida por quien lo usa en cada pantalla
   — no por en qué dispositivo corre. Tiene un default razonable pero siempre
   sobreescribible.
3. Consecuencia estructural: las 4 carpetas actuales
   (`buttons/web-label/`, `buttons/web-icon/`, `buttons/mobile-label/`,
   `buttons/mobile-icon/`) se fusionan a 2 (`buttons/web/`, `buttons/mobile/`),
   cada una con un único componente (`ButtonWeb`/`ButtonMobile`) parametrizado por
   `displayMode`, en vez de 2 clases casi idénticas por plataforma que solo
   difieren en si el template imprime el `<span>{{label()}}</span>`.

Esta decisión se ejecuta en Fase 3 (al final de la secuencia), pero queda
**cerrada desde ya** para no reabrirla cuando se llegue ahí.

---

## 2. Artefactos de ejecución por fase

Cada fase tiene su propio prompt de ejecución (documento `.md` separado, para
pasarlo a quien vaya a ejecutarlo — persona o agente). Este plan maestro **no
ejecuta nada**; apunta a los prompts.

| Fase | Prompt de ejecución | Estado |
|---|---|---|
| 0 | `prompts/ejecucion-fase0-css-tag-a-clase.md` | Por crear (ver §3) |
| 0b | `prompts/ejecucion-fase0b-colision-icon.md` | Por crear (ver §3) |
| 1 | `prompts/ejecucion-fase1-rename-adaptive-primitives.md` | Pendiente — se crea después de cerrar 0 y 0b |
| 2 | `prompts/ejecucion-fase2-rename-web-mobile.md` | Pendiente — se crea después de cerrar Fase 1 |
| 3 | `prompts/ejecucion-fase3-fusion-botones.md` | Pendiente — requiere diseño de API primero |
| 4 | `prompts/ejecucion-fase4-inputs-marca.md` | Pendiente |
| Workstream PrimeNG | `prompts/workstream-brechas-primeng.md` | Por crear (ver §4), independiente de las fases anteriores |

**Regla de avance:** no se crea el prompt de la fase N+1 hasta que la fase N esté
ejecutada, verificada (build + visual QA) y tú hayas dado el visto bueno explícito.
Esto evita repetir el error de la propuesta original (planear 4 fases completas
sobre una premisa no verificada).

---

## 3. Qué entra en cada prompt de ejecución (Fase 0 y 0b, los dos siguientes a crear)

### Fase 0 — Migrar CSS por tag a clase + unificar breakpoints

Alcance exacto (de la auditoría §7.2, 19 reglas reales, 15 archivos):
- `src/styles/custom/_committee.scss:954,1006,1355`
- `src/styles/custom/_custom-table.scss:116`
- `src/styles/custom/_print.scss:167`
- `src/styles/shared/_sidebar.scss:322-325,383-386`
- `src/styles/mobile/_ili-buttons.scss:59-63`
- `src/styles/web/_buttons.scss:506-559` (12 selectores `iw-button-*`)
- `src/app/shared/ui/mobile/badge/badge.ts:19,23`
- `src/app/shared/ui/mobile/chip/chip.ts:43`
- `src/app/shared/ui/mobile/image/image.ts:65`
- `src/app/shared/ui/buttons/web-icon/button-tracking.ts:46`
- `src/app/shared/ui/web/toast/toast.ts:96-103`
- `src/app/shared/ui/buttons/mobile-label/button.ts:38,41`
- `src/app/modules/operations.../task-list.ts:115,118,121`
- `src/app/modules/recruitment.../filter-requests.ts:57-90`
- `src/app/modules/recruitment.../employee-form.ts:43`
- `src/app/modules/recruitment.../vacante-detail-modal.ts:34-55`

Más: unificar los 15 thresholds de `@media` (366→1999px) hacia el único breakpoint
real de `PlatformService` (768px) donde aplique a layout compartido con decisión
de plataforma (no aplica a breakpoints puramente de layout fino que no dependan
de mobile/web, como grids internos — el prompt de ejecución debe distinguir esto).

Método: reemplazar cada selector de tag por una clase explícita
(`:host`, `.lux-*`, o `[data-component="..."]`), aplicada tanto en el SCSS como en
el `host`/template del componente afectado. Verificación obligatoria: captura de
pantalla antes/después en los puntos de uso reales listados en la auditoría
(sidebar, tabla, toasts, filtros de reclutamiento) en los 3 tamaños de pantalla
relevantes (< 768, 768-992, > 992).

### Fase 0b — Resolver colisión `app-icon` ↔ `lx-icon`

Decisión pendiente de tu aprobación (no técnica, es de producto/arquitectura):
- **Opción A**: `app-icon` (1 513 usos) se queda como el icono real único; se
  **elimina** `lx-icon` (adaptativo, 1 uso, prácticamente no adoptado) y su
  variante móvil `ili-icon` se evalúa si sigue teniendo razón de ser.
- **Opción B**: `app-icon` se convierte en el nuevo `lux-icon` directo (primitivo,
  sin sufijo, tal como propone el catálogo original para agnósticos) y se
  **retira** el adaptativo `lx-icon` por no estar adoptado.
- **Opción C**: se mantiene la separación (icono web real vs. icono que
  decide por plataforma) pero con nombres sin colisión: `lux-icon` (primitivo,
  = hoy `app-icon`) y `lux-icon-adaptive` o similar para el caso adaptativo, si
  hay alguna razón de negocio para conservarlo.

El prompt de ejecución de esta fase NO decide la opción — la implementa una vez
que tú elijas A, B o C.

---

## 4. Workstream paralelo — Brechas de madurez "nivel PrimeNG"

Priorizado por impacto en el usuario final (de la auditoría §10), no depende del
rename y puede arrancar ya:

1. **a11y de overlays (crítico)** — `lx-modal`, `lx-popover`, `lx-menu`,
   `lx-action-sheet`, `lx-tooltip` no atrapan ni restauran foco. Existe
   `appFocusTrap` sin adoptar.
2. **Unificación de breakpoints** — comparte alcance con Fase 0, se hace junto.
3. **Extensibilidad de componentes complejos** — `lx-tree`/`lx-menu`/
   `lx-stepper`/`lx-carousel` son caja negra (sin slots tipo `ng-content`).
4. **i18n** — 0 soporte de traducción en la librería; 28 archivos con defaults
   en español hardcodeados.
5. **Tests de comportamiento reales** — 68.5% de specs son superficiales
   (`toBeTruthy()` sin interacción). Sin esto, ningún rename ni refactor futuro
   es seguro de verificar.
6. **API pública + versionado** — 0 `public-api.ts`, 0 `package.json` en
   `shared/ui`. Sin esto no hay librería "consumible" real, solo una carpeta.
7. **Storybook/catálogo visual** — 1/357 con story real. Menor prioridad (no
   afecta al usuario final directamente, sí a velocidad de desarrollo futura).

Cada uno de estos puede convertirse en su propio prompt de ejecución independiente
cuando decidas priorizarlo. No bloquean ni son bloqueados por las Fases 0-4 del
rename.

---

## 5. Qué necesito de ti para seguir

1. ¿Apruebas que el siguiente paso sea crear el **prompt de ejecución de Fase 0**
   (migrar las 19 reglas CSS + unificar breakpoints) para pasarlo a quien lo
   ejecute?
2. Para Fase 0b (`app-icon` vs `lx-icon`): ¿opción A, B, o C del §3? (o dime si
   quieres que investigue algo más antes de decidir).
3. ¿Quieres que arranque ya el prompt del workstream de brechas PrimeNG en
   paralelo (no depende de las fases del rename), o prefieres enfocar todo en el
   rename primero y dejar las brechas para después?
</content>
