Ruta: 📂 docs > 🤝 SharedLuxuryApp > 🎨 DesignSystem

> 📅 Fecha: 2026-10-02
> 🛡️ Estado: **SUPERADA POR VERIFICACIÓN — ver
> `20261002-verificacion-catalogo-marca-lux.md`.** Las 2 premisas centrales de este
> documento (web/mobile son "solo internos"; los agnósticos no colisionan) resultaron
> **falsas en la práctica** (1 724 imports directos de negocio a web/mobile; colisión
> real `app-icon`↔`lx-icon`). Se conserva como registro histórico de la idea inicial.
> El plan vigente es `20261002-plan-maestro-secuencia-catalogo-lux.md`.
> 👤 Autor: agente IA

# Propuesta — Catálogo de Nombres de Marca para la Librería de Componentes LuxuryApp

## 0. Por qué un catálogo nuevo (y no solo "renombrar a lx-")

La convención actual (`arquitectura-shared-ui.md`) funciona a nivel arquitectónico
(separación web/Ionic/adaptive con lint de fronteras), pero **no tiene marca**. Los
prefijos son siglas internas sin significado para nadie fuera del equipo:

| Prefijo actual | ¿Qué significa para un dev nuevo? |
|---|---|
| `ili-` | Nada obvio ("¿Ionic label icon? ¿Internal?") |
| `ii-` | Nada obvio |
| `il-` | Nada obvio |
| `iw-` | Nada obvio |
| `lx-` | Se parece a marca pero está recortado y solo cubre `adaptive/` |
| `custom-` | Nombre genérico, cualquier librería de terceros podría usarlo |
| `app-` | Choca con el prefijo por defecto de Angular CLI (`ng generate` usa `app-` también) |

Propuesta: un único **root de marca** (`lux`) que se lee en TODOS los selectores,
con una regla simple y consistente para distinguir plataforma — no siglas, sufijos
legibles.

---

## 1. Identidad aplicada al naming

Tomado de `docs/SharedLuxuryApp/DesignSystem/20260813-especificacion-shared-brand.md`:
marca = **LuxuryApp**, personalidad "Institutional Modernism", valores Confianza /
Precisión / Claridad / Eficiencia.

Traducido a reglas de naming:

| Valor de marca | Regla de naming derivada |
|---|---|
| **Precisión** | Un selector = una capa. Nunca mezclar significado de plataforma e icono/label en 4 carpetas distintas (como hoy pasa en `buttons/`). |
| **Claridad** | Nombre completo y legible (`lux-button`) en vez de siglas (`il-`, `iw-`, `ii-`, `ili-`). |
| **Confianza institucional** | Un solo root de marca visible en cada componente público: `lux-*`. Quien lee un template sabe que es "de LuxuryApp", no una librería de terceros. |
| **Eficiencia** | Lo que es implementación interna (web/Ionic) NO debe ensuciar el namespace público; se marca con sufijo, no con prefijo nuevo que hay que memorizar. |

---

## 2. Regla central — 3 capas, 1 marca

```
lux-<nombre>            → PÚBLICO. Lo que cualquier feature/página importa y usa en su HTML.
lux-<nombre>-web        → INTERNO. Implementación Bootstrap/native. Solo lo importa el delegador adaptativo.
lux-<nombre>-mobile     → INTERNO. Implementación Ionic. Solo lo importa el delegador adaptativo.
```

- **Nunca** se escribe `lux-*-web` o `lux-*-mobile` en el HTML de un formulario, página
  o módulo de negocio. Eso sigue siendo responsabilidad exclusiva de `adaptive/`
  (el boundary lint actual se mantiene igual, solo cambian los nombres).
- Componentes verdaderamente agnósticos (sin versión web/mobile separada, ej. `app-icon`,
  `kpi-card`) son directamente `lux-<nombre>` sin sufijo, viven en `primitives/` (ver §4).

### Clases TypeScript (mismo criterio, aplicado al nombre de clase)

| Capa | Patrón de clase | Ejemplo |
|---|---|---|
| Público (adaptive) | `Lux<Nombre>` | `LuxTag`, `LuxButton`, `LuxInputText` |
| Interno web | `Lux<Nombre>Web` | `LuxBadgeWeb` |
| Interno mobile | `Lux<Nombre>Mobile` | `LuxBadgeMobile` |
| Lógica base/core | `Lux<Nombre>Core` o `Base<Nombre>` (sin cambio, no es selector) | `BaseInputSignal` |

---

## 3. Catálogo de selectores — mapeo completo por familia

### 3.1 Componentes adaptativos (`adaptive/` → públicos, 51 componentes)

Cambio mecánico: `lx-*` → `lux-*`. Mismo significado, mismo lugar, solo se completa
la marca (hoy está recortada a 2 letras, que es ambiguo: `lx` también podría leerse
como abreviación de cualquier otra cosa).

| Actual | Propuesto |
|---|---|
| `lx-accordion` | `lux-accordion` |
| `lx-button` *(no existe aún, ver §3.3)* | `lux-button` |
| `lx-card` | `lux-card` |
| `lx-tag` | `lux-tag` |
| `lx-table` | `lux-table` |
| ... (resto de los 51, mismo patrón 1:1) | `lx-*` → `lux-*` |

Impacto: cambio de 2 caracteres (`lx` → `lux`) en 51 selectores. Bajo riesgo técnico,
alto impacto en legibilidad.

### 3.2 Implementaciones web (`web/`, 87 componentes → internos)

Hoy usan `app-*`, que no comunica "esto es la variante web" y choca con el prefijo
default de Angular CLI.

| Actual | Propuesto |
|---|---|
| `app-badge` | `lux-badge-web` |
| `app-avatar` | `lux-avatar-web` |
| `app-breadcrumbs` | `lux-breadcrumbs-web` |
| `app-table-caption` | `lux-table-caption-web` |
| `app-data-view-mobile` *(nombre actual mal ubicado — está en `mobile/` pero usa prefijo `app-`, ver Hallazgo §6)* | `lux-data-view-mobile` |

### 3.3 Implementaciones móviles (`mobile/`, 56 componentes → internos)

| Actual | Propuesto |
|---|---|
| `ili-accordion` | `lux-accordion-mobile` |
| `ili-avatar` | `lux-avatar-mobile` |
| `ili-list-item` | `lux-list-item-mobile` |
| `ili-action-menu` | `lux-action-menu-mobile` |

### 3.4 Botones — fusión de 4 carpetas en 2 (cambio estructural, no solo de nombre)

**Problema real detectado:** hoy existen 4 implementaciones paralelas de "lo mismo"
(label vs icon es una *prop*, no una *plataforma*):

```
buttons/web-label/    (il-*)   12 componentes
buttons/web-icon/     (iw-*)   12 componentes
buttons/mobile-label/ (ili-*)  12 componentes
buttons/mobile-icon/  (ii-*)   11 componentes
```

Esto duplica 47 componentes en 4 variantes cuando debería ser 2 (web/mobile) con una
prop `displayMode: 'label' | 'icon' | 'both'`.

**Propuesta:**

```
buttons/web/     → lux-button-web     (prop displayMode)
buttons/mobile/  → lux-button-mobile  (prop displayMode)
adaptive         → lux-button         (ya delega web/mobile)
```

Esto es un cambio de **comportamiento interno**, no solo de nombre — requiere fusionar
`button-add.ts`, `button-save.ts`, `button-delete.ts`, etc. en variantes de un único
componente parametrizado por `kind` (add/save/delete/confirm/edit/...) + `displayMode`
(label/icon). Se marca como **Fase 3** (ver §7), no parte del rename mecánico de Fase 1.

### 3.5 Inputs — ya tienen el patrón correcto, solo falta la marca

El patrón adaptativo de inputs (`base/web/mobile/adaptive` + bridge) es el **mejor
ejemplo actual de arquitectura correcta**. Solo le falta el root de marca:

| Capa | Actual | Propuesto |
|---|---|---|
| Público (adaptive) | `custom-input-text-signal` | `lux-input-text` |
| Interno web | `web-input-text` | `lux-input-text-web` |
| Interno mobile | `ion-input-text` | `lux-input-text-mobile` |
| Bridge (`inputs/web/custom-input-text-signal.ts`) | re-exporta adaptativo | se elimina una vez completado el rename (ya no hace falta, el bridge era para no tocar los ~360 forms; con codemod sí se tocan, una sola vez, controladamente) |

> Nota: `ion-*` para inputs es razonable porque son wrappers casi directos de componentes
> Ionic (`ion-input`). Se mantiene esa raíz en el nombre de archivo/clase si se quiere,
> pero el **selector público** sigue el root `lux-`.

### 3.6 Agnósticos / primitivos (`shared/`, 18 componentes)

Hoy viven en una carpeta llamada `shared/ui/shared/` (nombre redundante: "shared"
dentro de "shared/ui"). Se renombra la carpeta a `primitives/` y el selector pasa a
`lux-*` directo (sin sufijo, porque no tienen variante web/mobile separada):

| Actual (carpeta `shared/`) | Selector actual | Selector propuesto |
|---|---|---|
| `app-icon/` | `app-icon` | `lux-icon` |
| `kpi-card/` | `app-kpi-card` | `lux-kpi-card` |
| `stat-card/` | `app-stat-card` | `lux-stat-card` |
| `activity-log/` | `app-activity-log` | `lux-activity-log` |
| `gauge/` | `app-gauge` | `lux-gauge` |
| (resto, mismo patrón) | `app-*` | `lux-*` |

---

## 4. Catálogo de carpetas — propuesta final

```
shared/ui/
├── core/          🧠 (antes "base/") lógica compartida, sin UI de plataforma
├── web/           🖥️ implementaciones internas Bootstrap/native · selector lux-*-web
├── mobile/        📱 implementaciones internas Ionic           · selector lux-*-mobile
├── adaptive/      🔀 catálogo público · selector lux-*
├── primitives/    🔧 (antes "shared/") agnósticos puros        · selector lux-*
├── buttons/
│   ├── web/       (fusiona web-label + web-icon)   · lux-button-web
│   └── mobile/    (fusiona mobile-label + mobile-icon) · lux-button-mobile
└── inputs/
    ├── core/      (antes "base/")
    ├── web/       · lux-input-*-web
    ├── mobile/    · lux-input-*-mobile
    └── adaptive/  · lux-input-*  (público)
```

Renombres de carpeta (bajo riesgo, son rutas de import, las resuelve el compilador):
- `base/` → `core/` (en `shared/ui/` y en `inputs/`)
- `shared/` → `primitives/`
- `buttons/web-label/` + `buttons/web-icon/` → `buttons/web/`
- `buttons/mobile-label/` + `buttons/mobile-icon/` → `buttons/mobile/`

---

## 5. Alias de import — opción de marca completa (opcional, Fase 4)

Hoy: `@ui/*` → `src/app/shared/ui/*`. Es funcional pero sin marca. Si se quiere ir
a fondo con identidad (por ejemplo, de cara a extraer un paquete NPM interno
publicable):

```
@lux/ui/*  → src/app/shared/ui/*
```

Esto es **cosmético y de bajo riesgo** (un alias de TypeScript, no mueve archivos),
pero es también el paso que más prepara el terreno para que `shared/ui` algún día
sea literalmente el paquete `@luxuryapp/ui` publicado en un registro privado.
Se deja como Fase 4 opcional — no bloquea nada de lo anterior.

---

## 6. Hallazgo adicional durante el mapeo (no es naming, es bug de ubicación)

`mobile/data-view-mobile/data-view-mobile.ts` usa selector `app-data-view-mobile`
(prefijo `app-`, que según la convención actual es de la capa **web**) pero el archivo
vive físicamente en `mobile/`. Es una inconsistencia real preexistente, no inventada
por esta propuesta. Con el catálogo nuevo se corrige sola: pasa a `lux-data-view-mobile`
(público, sin sufijo de plataforma porque aparentemente no tiene contraparte web).
Confirmar con el equipo si es intencional antes del rename.

---

## 7. Plan de ejecución (solo se activa si se aprueba este catálogo)

### Fase 1 — Mecánico, bajo riesgo (adaptive + primitives + core)
- Rename `lx-*` → `lux-*` (51 componentes, cambio de 2 caracteres)
- Rename `shared/` → `primitives/`, selectores `app-*` → `lux-*` (18 componentes)
- Rename `base/` → `core/` (solo ruta de carpeta/import, no selector)
- Codemod + find-all-references, un solo PR grande pero mecánico y testeable con
  `npm run build` + `npm run audit:ui`.

### Fase 2 — Implementaciones internas web/mobile (143 componentes)
- `app-*` (web) → `lux-*-web`
- `ili-*` (mobile) → `lux-*-mobile`
- Como son **internos** (solo los consume `adaptive/`), el radio de impacto real es
  bajo: se tocan ~51 archivos de `adaptive/` que los referencian, no los ~360 forms
  de negocio.

### Fase 3 — Botones: fusión 4→2 carpetas + parametrización por `displayMode`
- Requiere diseño de API (`kind`, `displayMode`) antes de tocar código.
- Alto impacto de uso (`il-button` 1180 usos, `iw-button` 729 usos) → usar el mismo
  patrón de "bridge" que ya probó el equipo con inputs: el selector viejo se mantiene
  como alias temporal mientras se migra, cero big-bang.

### Fase 4 — Inputs: completar marca + opcionalmente alias `@lux/ui`
- Rename `custom-input-*-signal` → `lux-input-*` (público) — alto impacto (506 + 351
  usos en los dos tipos más usados), usar bridge igual que Fase 3.
- Alias `@lux/*` opcional, sin romper nada (es aditivo).

**Orden recomendado:** 1 → 2 → 4 → 3 (botones de último porque requiere rediseño de
API, no solo rename; los demás son mecánicos).

---

## 8. Qué NO cambia con esta propuesta

- El boundary lint (`audit-ui-boundaries.mjs`) sigue igual en espíritu: mobile no
  importa web, web no importa Ionic, adaptive es la única capa que cruza. Solo se
  actualizan las rutas que vigila (`web/` → sigue siendo `web/`, etc.).
- El patrón adaptativo de inputs (CVA, `BaseInputSignal`, bridge) no cambia de
  mecánica, solo de nombre.
- Nada de esto se ejecuta todavía. Es catálogo + plan, pendiente de tu aprobación.

---

## 9. Qué necesito de ti para aprobar

1. ¿El root de marca `lux-` te gusta, o prefieres otra palabra (`luxapp-`, `la-`,
   algo más corto)?
2. ¿Apruebas la fusión de botones (4 carpetas → 2, con prop `displayMode`) o prefieres
   dejarla fuera de este refactor y solo renombrar sin fusionar?
3. ¿Quieres el alias `@lux/ui` ahora (Fase 4 opcional) o lo dejamos para cuando se
   extraiga la librería de verdad?
4. ¿Orden de fases correcto, o prefieres empezar por otra parte?

Con tus respuestas actualizo este documento a versión final y **entonces** actualizo
`arquitectura-shared-ui.md` para que quede como la única fuente de verdad (este archivo
pasaría a ser histórico/changelog de la decisión).
</content>
