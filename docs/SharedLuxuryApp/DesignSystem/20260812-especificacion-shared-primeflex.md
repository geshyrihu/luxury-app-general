# Estándar PrimeFlex Usage — Propuesta 2026-08-12

**Status:** 🟡 PROPUESTA (Pendiente aprobación Tech Lead)  
**Scope:** Frontend Angular — Layout & Spacing utilities  
**Auditoría asociada:** docs/audit/20260812-AUDITORIA-PRIMEFLEX-CODEBASE.md

---

## 1. Propósito

PrimeFlex es la librería de utilidades CSS que viene integrada con PrimeNG. Este estándar clarifica:
- Cuándo SÍ usar PrimeFlex
- Cuándo NO usar (alternativas)
- Cómo validar cumplimiento

---

## 2. Qué es PrimeFlex

```
PrimeFlex = utility CSS library (como Tailwind, pero oficial de PrimeNG)
Mapea internamente a: CSS variables (--ds-*, --primary-*, etc.)
Ejemplos: flex, gap-3, p-2, m-1, w-100, h-50, text-center
```

**Diferencia con Tailwind:**
- Tailwind: Custom framework, color palette distinto, utility classes propietarias
- PrimeFlex: Framework integrado con PrimeNG, utiliza Design System tokens internamente

**PrimeFlex viene en:** `node_modules/primeflex/primeflex.css` (ya instalado)

---

## 3. Regla Propuesta

### ✅ PERMITIDO: PrimeFlex Utilities

Para **layout, spacing, sizing, typography** que NO requieren personalizaci ón de marca:

```html
<!-- ✅ CORRECTO: PrimeFlex utilities -->
<div class="flex flex-column gap-3 px-2 py-3">
  <p class="font-semibold text-lg">Título</p>
  <button class="p-button p-button-primary w-full">Guardar</button>
</div>

<!-- ✅ CORRECTO: PrimeFlex para responsivo -->
<div class="flex flex-column md:flex-row gap-3">
  <div class="w-full md:w-6">Columna 1</div>
  <div class="w-full md:w-6">Columna 2</div>
</div>

<!-- ✅ CORRECTO: PrimeFlex stacking -->
<div class="flex flex-wrap gap-2">
  <button class="p-button-sm">Opción 1</button>
  <button class="p-button-sm">Opción 2</button>
  <button class="p-button-sm">Opción 3</button>
</div>
```

**Utilities permitidas por categoría:**

| Categoría | Ejemplos | Caso de Uso |
|-----------|----------|-----------|
| **Flexbox** | flex, flex-column, flex-wrap, align-items-center, justify-content-between | Layout, alineación |
| **Spacing** | gap-1/2/3, p-1/2/3, m-1/2/3, px-*, py-* | Padding/margin |
| **Sizing** | w-full, w-6, h-100, min-h-screen | Ancho/alto |
| **Typography** | text-center, text-right, font-semibold, text-lg, text-xs, line-height-2 | Texto |
| **Margin/Padding** | mb-3, mt-2, ml-1, mr-2 | Espaciado directo |
| **Color** | text-color, text-color-secondary, bg-surface-*  | Colores básicos |
| **Display** | block, inline, hidden, md:hidden | Display control |
| **Responsive** | md:, lg:, sm: prefixes | Breakpoints |

### ❌ PROHIBIDO: Inline Styles para valores visuales

Si necesitas color, fondo, o tamaño personalizado → usa **tokens CSS** vía `[ngStyle]`:

```html
<!-- ❌ PROHIBIDO: Inline style hardcodeado -->
<div style="color: #1B365D; background-color: #E8F0F7; padding: 16px;">
  Contenido
</div>

<!-- ❌ PROHIBIDO: PrimeFlex con valores hardcodeados -->
<div class="flex" style="gap: 1rem;">  <!-- gap ya tiene PrimeFlex -->
  Item 1
</div>

<!-- ✅ CORRECTO: Usar PrimeFlex para spacing -->
<div class="flex gap-3">
  Item 1
</div>

<!-- ✅ CORRECTO: Usar [ngStyle] con tokens para colores dinámicos -->
<div [ngStyle]="{ 
  backgroundColor: 'var(--primary-50)', 
  color: 'var(--primary-900)',
  padding: 'var(--ds-space-md)'
}">
  Contenido personalizado
</div>
```

### ❌ PROHIBIDO: Custom utility classes

No crear clases CSS personalizadas que repliquen PrimeFlex:

```html
<!-- ❌ PROHIBIDO: Custom utility (gap-custom no debe existir) -->
<div class="gap-custom">  <!-- NO CREAR -->
  Item
</div>

<!-- ✅ CORRECTO: Usar PrimeFlex o tokens -->
<div class="gap-3">  <!-- gap-3 = 1rem from PrimeFlex -->
  Item
</div>
```

---

## 4. Integración con Design Tokens (§6.1 CONVENTIONS.md)

**Relación:**
```
Design Tokens (§6.1)
  ├─ Colores: var(--ds-primary-*), var(--surface-*), var(--primary-*)
  ├─ Spacing: var(--ds-space-xs), --ds-space-md, --ds-space-lg
  └─ Typography: var(--ds-font-size-*), var(--ds-line-height-*)

PrimeFlex Utilities
  ├─ gap-3 = gap: 1rem (mapea internamente)
  ├─ p-2 = padding: 0.5rem
  └─ text-lg = font-size: 1.125rem
```

**Regla de coherencia:**
- PrimeFlex utilities = valores predefinidos (no personalizables)
- Diseño personalizado (marca, colores específicos) = tokens CSS vía [ngStyle]

---

## 5. Patrón: Cuándo usar qué

```
¿Necesitas layout/espaciado estándar?
  ├─ SÍ → PrimeFlex: class="flex gap-3 px-2"
  └─ NO → Siguiente pregunta

¿Es color/background/tamaño personalizado?
  ├─ SÍ → Tokens CSS: [ngStyle]="{ backgroundColor: 'var(--primary-50)' }"
  └─ NO → Siguiente pregunta

¿Es flex/grid/alineación?
  ├─ SÍ → PrimeFlex: class="flex flex-column justify-content-center"
  └─ NO → Siguiente pregunta

¿Necesita breakpoints responsivos?
  ├─ SÍ → PrimeFlex: class="w-full md:w-6 lg:w-4"
  └─ NO → Tokens CSS o componente compartido

```

---

## 6. Ejemplos Reales (Permitidos)

### Ejemplo 1: Header con PrimeFlex + Tokens

```html
<!-- ✅ CORRECTO: Layout PrimeFlex + tokens dinámicos -->
<div class="flex flex-column gap-3 px-3 py-2">
  <div class="flex justify-content-between align-items-center">
    <h2 class="text-2xl font-semibold m-0">Candidatos</h2>
    <button class="p-button p-button-rounded p-button-text">
      <i class="material-symbols-light:close"></i>
    </button>
  </div>
  
  <div class="flex flex-wrap gap-2">
    <iw-button-item
      label="Vigentes"
      [severity]="statusFilter() === 'active' ? 'primary' : 'secondary'"
      [variant]="statusFilter() === 'active' ? 'solid' : 'outline'"
      (clicked)="changeStatusFilter.emit('active')"
    />
    <iw-button-item label="Archivados" />
  </div>
</div>
```

**Análisis:**
- ✅ `class="flex flex-column gap-3"` → PrimeFlex para layout
- ✅ `class="flex justify-content-between"` → PrimeFlex para alineación
- ✅ `class="text-2xl font-semibold"` → PrimeFlex para typography
- ✅ `[severity]` y `[variant]` → Atributos de componente (no inline styles)

### Ejemplo 2: DataTable Header con Token Dinámico

```html
<!-- ✅ CORRECTO: PrimeFlex + [ngStyle] con token -->
<ng-template #header>
  <tr>
    <th [ngStyle]="{ backgroundColor: 'var(--blue-300)' }">
      Nombre
    </th>
    <th [ngStyle]="{ backgroundColor: 'var(--blue-300)' }">
      Teléfono
    </th>
  </tr>
</ng-template>
```

**Análisis:**
- ✅ `[ngStyle]="{ backgroundColor: 'var(--blue-300)' }"` → Token CSS, no hardcoding
- ✅ Dato dinámico, requiere [ngStyle]

---

## 7. Checklist de Validación

### Code Review Checklist

- [ ] ¿Hay `class="flex"` + `class="gap-"` en lugar de `style="gap: 1rem"`?
- [ ] ¿Hay `[ngStyle]` solo para colores/fondos/tamaños dinámicos?
- [ ] ¿Se usan tokens CSS en `[ngStyle]` (var(--ds-*)) NO hardcoding (#FFF, 16px)?
- [ ] ¿No hay utility classes personalizadas (class="gap-custom")?
- [ ] ¿Se usa PrimeFlex para responsive (md:, lg: prefixes)?
- [ ] ¿Se respeta la jerarquía: PrimeFlex > Tokens > [ngStyle]?

### Búsqueda automatizada (grep)

**Violaciones esperadas (0):**
```bash
# Debería retornar 0:
grep -r 'style=".*\(color\|padding\|margin\|gap\|width\|height\):' client/angular/src/app/ | grep -v 'var(--'

# Debería retornar 0:
grep -r 'class=".*gap-.*" style="gap:' client/angular/src/app/

# Debería retornar solo casos legítimos:
grep -r '\[ngStyle\].*backgroundColor\|color\|margin\|padding' client/angular/src/app/ | grep -v 'var(--'
```

---

## 8. Migración (Si aplica)

Si existe código viejo con inline styles:

**Antes (❌ Prohibido):**
```html
<div style="display: flex; gap: 1rem; padding: 0.5rem;">
```

**Después (✅ Correcto):**
```html
<div class="flex gap-3 p-2">
```

---

## 9. Referencias

- **PrimeFlex docs:** https://www.primefaces.org/primeflex/
- **CONVENTIONS.md §6.1:** Tokens CSS Obligatorios
- **Design System:** client/angular/src/styles/core/_colors.scss, _spacing.scss

---

## 10. Decisión Pendiente

**Para Tech Lead:**

1. ¿Aprobar uso de PrimeFlex utilities para layout/spacing?
2. ¿Requireir tokens CSS SOLO para colores/backgrounds dinámicos?
3. ¿Agregar checklist de validación al code review?

**Alternativa (más restrictiva):**
- Prohibir PrimeFlex completamente
- Usar solo SCSS/CSS + Design Tokens para TODO
- (Actualmente 500+ usos en codebase, impacto alto)

---

**Propuesta creada:** 2026-08-12  
**Auditoría:** docs/audit/20260812-AUDITORIA-PRIMEFLEX-CODEBASE.md  
**Status:** Aguardando aprobación Tech Lead
