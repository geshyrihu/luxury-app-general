# Regla Crítica: Tokens CSS Obligatorios (NUNCA Hardcoding)

**Versión:** 1.0  
**Fecha:** 2026-07-30  
**Severidad:** 🔴 CRÍTICA  
**Aplica a:** Todos los módulos frontend (Angular, Ionic, web, mobile)

---

## Propósito

Garantizar que **TODOS los valores visuales** (colores, spacing, tipografía, shadows, border-radius) provengan de **tokens CSS centralizados**, NUNCA hardcodeados como valores literales.

---

## La Regla Explícita

### ✅ OBLIGATORIO: Usar Tokens

```scss
// Colores
color: var(--primary-700);           // NOT #1B365D
background: var(--surface-card);     // NOT #FFFFFF
border-color: var(--ds-border-default); // NOT #E2E8F0

// Spacing
padding: var(--ds-space-lg);         // NOT 16px
margin-bottom: var(--ds-space-md);   // NOT 12px
gap: var(--ds-space-sm);             // NOT 8px

// Tipografía
font-size: var(--ds-type-body-lg);   // NOT 14px
font-weight: 600;                    // OK: hardcoded weights are fine
line-height: var(--ds-line-height-base); // NOT 1.5

// Shadows
box-shadow: var(--ds-shadow-2);      // NOT 0 2px 8px rgba(...)
filter: drop-shadow(var(--ds-shadow-1)); // NOT custom drop-shadow

// Border Radius
border-radius: var(--ds-radius-md);  // NOT hardcodeado (estándar 3px)
```

### ❌ PROHIBIDO: Hardcoding

```scss
// ❌ VIOLACIÓN CRÍTICA
.button {
  color: #1B365D;                    // ← Hex hardcodeado
  background: #D4A74A;               // ← Hex hardcodeado
  padding: 16px 24px;                // ← Spacing literal
  margin: 12px 0;                    // ← Margin literal
  border-radius: 8px;                // ← Radius literal
  box-shadow: 0 2px 8px rgba(...);   // ← Shadow literal
  font-size: 14px;                   // ← Size literal
}

// ❌ VIOLACIÓN CRÍTICA (inline styles)
<div style="color: #333; padding: 20px; border-radius: 12px;">
  Content
</div>

// ❌ VIOLACIÓN CRÍTICA (rgb/rgba)
.card {
  background: rgba(255, 255, 255, 0.95); // ← Hardcodeado
}
```

---

## Autoridad: Dónde Están los Tokens

**Ubicación única de verdad:**

```
appsweb/angular/src/styles/
├── core/
│   ├── _colors.scss          ← Paleta de colores (source of truth)
│   ├── _typography.scss      ← Escalas tipográficas
│   ├── _spacing.scss         ← Espaciado 4px grid
│   ├── _shadows.scss         ← Elevación (Level 1-4)
│   └── _borders.scss         ← Border radius tokens
├── theme/
│   ├── _variables.scss       ← CSS variables exported
│   ├── mypreset.ts           ← PrimeNG preset (colors)
│   └── _global.scss          ← Global rules
└── base/
    └── _dark-mode.scss       ← Dark mode overrides
```

**Acceso en componentes:**

```scss
// ✅ Todos los tokens disponibles vía CSS variables
:host {
  --ds-primary: var(--primary-700);
  --ds-spacing: var(--ds-space-lg);
  --ds-radius: var(--ds-radius-md);
  --ds-shadow: var(--ds-shadow-2);
}

.component {
  color: var(--ds-primary);
  padding: var(--ds-spacing);
  border-radius: var(--ds-radius);
  box-shadow: var(--ds-shadow);
}
```

---

## Categorías de Tokens

### 1. Colores (Autoridad: `_colors.scss`)

| Token | Valor | Variable | Uso |
|:---|:---|:---|:---|
| `primary-700` | `#003152` | `--primary-700` | Headers, navs, primary buttons |
| `primary-600` | `#00568F` | `--primary-600` | Hover states, secondary emphasis |
| `secondary-600` | `#5A6878` | `--secondary-600` | Secondary text, disabled |
| `success-600` | `#1E9B6D` | `--success-600` | Confirmaciones, save |
| `danger-600` | `#D34B4B` | `--danger-600` | Errores, delete |
| `warning-600` | `#FFB300` | `--warning-600` | Operational warnings |
| `report-gold-600` | `#D4A74A` | `--ds-luxury-gold` | Reports and documentary premium elements |
| `info-600` | `#3678C2` | `--info-600` | Info, help, links |
| `surface` | `#F8F9FC` | `--ds-bg-surface` | Main app background |
| `surface-card` | `#FFFFFF` | (native) | Cards, modals, elevated |
| `outline` | `#E2E8F0` | `--ds-border-default` | Borders, dividers |

### 2. Spacing (Autoridad: `_spacing.scss`)

| Token | Valor | Variable | Uso |
|:---|:---|:---|:---|
| `xs` | 4px | `--ds-space-xs` | Icon gaps, tight spacing |
| `sm` | 8px | `--ds-space-sm` | Default padding |
| `md` | 12px | `--ds-space-md` | Section padding, form gaps |
| `lg` | 16px | `--ds-space-lg` | Card padding, large gaps |
| `xl` | 24px | `--ds-space-xl` | Section margins, list spacing |
| `2xl` | 32px | `--ds-space-2xl` | Hero/page padding |
| `3xl` | 48px | `--ds-space-3xl` | Largest containers |

### 3. Tipografía (Autoridad: `_typography.scss`)

| Token | Size | Weight | Line-Height | Variable | Uso |
|:---|:---|:---|:---|:---|:---|
| `display-lg` | 48px | 700 | 56px | `--ds-type-display-lg` | Hero titles |
| `headline-lg` | 32px | 600 | 40px | `--ds-type-headline-lg` | Section headers |
| `title-lg` | 20px | 600 | 28px | `--ds-type-title-lg` | Subsection headers |
| `body-lg` | 16px | 400 | 24px | `--ds-type-body-lg` | Primary text |
| `body-md` | 14px | 400 | 20px | `--ds-type-body-md` | Standard body (default) |
| `body-sm` | 13px | 400 | 18px | `--ds-type-body-sm` | Secondary text |
| `label-lg` | 14px | 500 | 20px | `--ds-type-label-lg` | Form labels |

> **Nota de transición (FASE 1 del plan de remediación):** la escala canónica
> `--ds-type-*` está definida en `theme/_variables.scss` y `--ds-font-size-*`
> (sistema anterior, ~340 usos) queda como **alias de compatibilidad** durante
> 1 release. Los valores de la tabla (escala DESIGN.md) se re-anclan con la
> fuente real en FASE 3 (T11); hoy `--ds-type-*` expone los valores vigentes
> para no producir regresión visual. Migración de consumidores:
> `node scripts/migrate-tokens.mjs --apply` (codemod T02).

**Regla:** NUNCA font-size literal. Siempre usar escala tipográfica.

### 4. Shadows (Autoridad: `_shadows.scss`)

| Level | Value | Variable | Uso |
|:---|:---|:---|:---|
| None | `none` | `--ds-shadow-none` | Flat surfaces |
| Level 1 | `0 1px 2px rgba(27,54,93,0.06)` | `--ds-shadow-1` | Subtle lift |
| Level 2 | `0 2px 8px rgba(27,54,93,0.08)` | `--ds-shadow-2` | Cards, inputs (default) |
| Level 3 | `0 4px 16px rgba(27,54,93,0.10)` | `--ds-shadow-3` | Modals, popovers |
| Level 4 | `0 8px 32px rgba(27,54,93,0.12)` | `--ds-shadow-4` | Hero images, featured |
| Focus | `0 0 0 3px var(--ds-color-focus)` | `--ds-shadow-focus-md` | Focus rings |

### 5. Border Radius (Autoridad: `_borders.scss`)

| Token | Value | Variable | Uso |
|:---|:---|:---|:---|
| `xs` | 3px | `--ds-radius-xs` | Buttons, small inputs |
| `sm` | 3px | `--ds-radius-sm` | Standard controls |
| `md` | 3px | `--ds-radius-md` | Cards, modals, standard |
| `lg` | 3px | `--ds-radius-lg` | Large cards, tall modals |
| `xl` | 3px | `--ds-radius-xl` | Hero sections, featured |
| `full` | 9999px | `--ds-radius-full` | Chips, badges, rounded buttons |

---

## Auditoría: Validaciones

### STEP 1.10: Verificar Tokens CSS (Búsqueda 1-6)

**Búsqueda 1: Colores Hardcodeados**

```bash
# ❌ BUSCAR: Hex colors literal
grep -r "#[0-9A-F]\{6\}\|#[0-9A-F]\{3\}" {frontend_path} \
  --include="*.scss" --include="*.css" \
  | grep -v "node_modules" \
  | grep -v "src/styles/core/" \
  | grep -v "// "

# Esperado: 0 resultados (excepto en comments)

# Si encuentra algo:
# ❌ VIOLACIÓN CRÍTICA: Color hardcodeado
# Ejemplo: .button { color: #1B365D; } ← Debe ser var(--primary-700)
```

**Búsqueda 2: RGBA/RGB Literals**

```bash
# ❌ BUSCAR: rgba() o rgb() calls
grep -r "rgba(\|rgb(" {frontend_path} \
  --include="*.scss" --include="*.css" \
  --include="*.ts" \
  | grep -v "node_modules" \
  | grep -v "src/styles/core/" \
  | grep -v "WCAG\|contrast"

# Esperado: 0 resultados

# Si encuentra: Convertir a var(--ds-*)
```

**Búsqueda 3: Spacing Literals (px hardcodeado)**

```bash
# ❌ BUSCAR: padding/margin/gap con valores px
grep -r "padding: [0-9]\|margin: [0-9]\|gap: [0-9]" {frontend_path} \
  --include="*.scss" --include="*.css" \
  | grep -v "node_modules" \
  | grep -v "src/styles/core/"

# Esperado: 0 resultados (excepto en reset/normalize)

# Conversión:
# padding: 16px; → padding: var(--ds-space-lg);
# margin: 12px;  → margin: var(--ds-space-md);
# gap: 8px;      → gap: var(--ds-space-sm);
```

**Búsqueda 4: Font-size Literals**

```bash
# ❌ BUSCAR: font-size con px
grep -r "font-size: [0-9]" {frontend_path} \
  --include="*.scss" --include="*.css" \
  | grep -v "node_modules" \
  | grep -v "src/styles/core/"

# Esperado: 0 resultados

# Conversión:
# font-size: 14px; → font-size: var(--ds-type-body-md);
```

**Búsqueda 5: Shadow Literals**

```bash
# ❌ BUSCAR: box-shadow custom
grep -r "box-shadow: 0 [0-9]\|box-shadow: [0-9]" {frontend_path} \
  --include="*.scss" --include="*.css" \
  | grep -v "node_modules" \
  | grep -v "src/styles/core/" \
  | grep -v "var(--ds-shadow"

# Esperado: 0 resultados

# Conversión:
# box-shadow: 0 2px 8px rgba(...); → box-shadow: var(--ds-shadow-2);
```

**Búsqueda 6: Border-radius Literals**

```bash
# ❌ BUSCAR: border-radius con px
grep -r "border-radius: [0-9]" {frontend_path} \
  --include="*.scss" --include="*.css" \
  | grep -v "node_modules" \
  | grep -v "src/styles/core/" \
  | grep -v "var(--ds-radius"

# Esperado: 0 resultados

# Conversión:
# border-radius: 8px; → border-radius: var(--ds-radius-md);
```

### Tabla de Resultados

| Búsqueda | Tipo | Esperado | Status | Severidad |
|:---|:---|:---|:---|:---|
| 1 | Colores hex | 0 | ✓/❌ | CRÍTICA |
| 2 | RGBA/RGB | 0 | ✓/❌ | CRÍTICA |
| 3 | Spacing px | 0 | ✓/❌ | CRÍTICA |
| 4 | Font-size px | 0 | ✓/❌ | CRÍTICA |
| 5 | Shadows custom | 0 | ✓/❌ | CRÍTICA |
| 6 | Border-radius px | 0 | ✓/❌ | CRÍTICA |

**Criterio de PASO:** ✅ si todos los valores = 0 (todo via tokens)

**Criterio de FALLO:** 🔴 CRÍTICO si cualquiera > 0

---

## En Creación de Módulo Nuevo

### FASE 0 (Pre-Planeación)

**Sección nueva: §0.4 Tokens de Diseño Requeridos**

```markdown
Identificar qué tokens nuevos (si alguno) el módulo necesita:
- Colores específicos del módulo (ej: "status-pending")
- Spacing especial (ej: "dashboard-padding")
- Tipografía nueva (ej: "metric-value" para números grandes)

Decisión: ¿Agregar a sistema global o local del módulo?
Regla: Si es reutilizable en otros módulos → global (_colors.scss)
       Si es específico → variable local :host del componente
```

### Plan (11 Secciones)

**Sección 5.3 (Nueva subsección): Tokens de Diseño**

```markdown
### 5.3 Tokens de Diseño Utilizados

Listar TODOS los tokens que el módulo consumirá:

**Colores:**
- Primary: --primary-700, --primary-50 (backgrounds)
- Status: --success-600 (approved), --danger-600 (rejected), --info-600 (pending)

**Spacing:**
- Card padding: --ds-space-lg (16px)
- Form gaps: --ds-space-md (12px)
- Section margins: --ds-space-xl (24px)

**Tipografía:**
- Headers: --ds-type-title-lg (20px, 600 weight)
- Body: --ds-type-body-md (14px, 400 weight)

**Shadows:**
- Cards: --ds-shadow-2 (default elevation)
- Modals: --ds-shadow-3 (raised elevation)

**Border Radius:**
- Buttons/Inputs: --ds-radius-md (8px)
- Cards: --ds-radius-md (8px)

Validar: Todos los valores enumerados deben existir en:
- src/styles/core/_colors.scss
- src/styles/core/_spacing.scss
- src/styles/core/_typography.scss
- src/styles/core/_shadows.scss
- src/styles/core/_borders.scss

Si falta un token: Crear en autoridad + documentar por qué
```

---

## Checklist: Pre-Delivery

**Antes de mergear cualquier módulo frontend:**

```markdown
## Design Tokens Checklist

- [ ] ¿Todos los colores usan var(--ds-*) o var(--primary-*), etc?
- [ ] ¿Hay hex colors hardcodeados? (grep -r "#" → 0 resultados)
- [ ] ¿Todos los espacios (padding/margin/gap) usan var(--ds-space-*)?
- [ ] ¿Hay valores px literal en spacing? (grep -r "padding: [0-9]" → 0)
- [ ] ¿Todas las font-size usan var(--ds-type-*)?
- [ ] ¿Hay font-size px literal? (grep -r "font-size: [0-9]" → 0)
- [ ] ¿Todos los shadows usan var(--ds-shadow-*)?
- [ ] ¿Todos los border-radius usan var(--ds-radius-*)?
- [ ] ¿Inline styles reemplazados con clases? (NO <div style="...">)
- [ ] ¿Dark mode testado? (si aplica)
```

---

## Por Qué Esta Regla (Why)

### Mantenibilidad

- **Un cambio = Un lugar:** Si brand pide cambiar primary color, cambiar 1 línea en `_colors.scss`
- **Sin duplicación:** No buscar 50 lugares con #1B365D

### Consistencia

- **Coherencia global:** Todos los módulos usan mismo azul, mismo spacing
- **Escalabilidad:** 200+ módulos + 1 sistema de tokens = coherencia garantizada

### Auditoría

- **Automatizable:** grep simples detectan violaciones
- **Escalable:** Mismo checklist aplica a todos los módulos

### Accesibilidad

- **Ratios de contraste garantizados:** Los tokens ya están validados WCAG AAA
- **Dark mode incluido:** Los tokens adaptan automáticamente

### Performance

- **Caché CSS:** Cambiar color en 1 lugar, caché regenera
- **Bundle size:** No duplicar valores, compilador optimiza

---

## Referencias

- [Design System Master File](../../appsweb/angular/design-system/luxuryapp-inspections/MASTER.md) — Autoridad de diseño
- [DESIGN.md](../../appsweb/angular/src/styles/DESIGN.md) — Documentación de styles
- [Estandar Hoja de Estilos](../../appsweb/angular/src/styles/estandar-hoja-estilos.md) — Guía SCSS

---

**Vigente desde:** 2026-07-30  
**Severidad:** 🔴 CRÍTICA (igual que DTOs, SELECTs, DisplayName)  
**Auditoría:** STEP 1.10 (6 búsquedas grep)  
**Excepción:** NO HAY. Todos los valores visuales vía tokens.
