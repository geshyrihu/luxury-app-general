# Protocolo de Auditoría de UI/Componentes

**Versión:** 1.0  
**Fecha:** 2026-07-30  
**Aplica a:** Auditoría de módulos frontend, componentes Angular, diseño responsive

---

## Propósito

Garantizar que la capa de UI de un módulo cumple con:

✅ **Componentes:** Reutiliza shared/ui, no duplica  
✅ **Responsive:** Funciona en desktop, tablet, mobile  
✅ **Accesibilidad:** ARIA labels, color contrast, keyboard nav  
✅ **Diseño:** Design tokens, sin hardcoding, tipografía consistente

---

## Auditoría de UI: 4 STEPs

### STEP 1: Componentes (Reutilización vs Específico)

**Objetivo:** Verificar que cada componente está en el lugar correcto.

```bash
# Encontrar componentes
find {frontend_path} -name "*.component.ts" | head -50

# Verificar que están en carpetas correctas
find {frontend_path}/shared/ui -name "*.component.ts"  # Shared
find {frontend_path}/{modulo} -name "*.component.ts"   # Específicos
```

**Tabla de Hallazgos:**

| Componente | Ubicación | Tipo | Reutilizado | Estado |
|:---|:---|:---|:---|:---|
| ReportForm | {modulo}/components/ | Específico | NO | ✓ OK |
| FilterPanel | shared/ui/filter-panel/ | Shared | SÍ (5 usos) | ✓ OK |
| ModalDialog | shared/ui/modal-dialog/ | Shared | SÍ (3 usos) | ✓ OK |
| CustomButton | {modulo}/components/ | Específico | NO (1 uso) | ⚠️ Considerar mover a shared |

**Validación:**
- [ ] ¿Componentes shared están en `shared/ui/`?
- [ ] ¿Componentes específicos NO están en `shared/ui/`?
- [ ] ¿Componentes reutilizados NO están duplicados en otros módulos?
- [ ] ¿Estilos específicos están en carpeta del componente, no en global?

---

### STEP 2: Responsive Design (Mobile/Tablet/Desktop)

**Objetivo:** Verificar que funciona en los 3 breakpoints.

```bash
# Buscar media queries
grep -r "@media" {frontend_path}/*.scss | head -30

# Buscar breakpoints definidos
grep -r "\$breakpoint\|--breakpoint" {frontend_path}
```

**Tabla de Breakpoints:**

| Breakpoint | Ancho | Usado | Componentes |
|:---|:---|:---|:---|
| Desktop | 1024px+ | ✓ | report-table, report-chart |
| Tablet | 768px-1023px | ✓ | sidebar, grid |
| Mobile | 320px-767px | ⚠️ | Falta en some forms |

**Validación (Mobile-First):**

```scss
/* ✅ BIEN: Mobile-first */
.component {
  display: block;
  width: 100%;
}
@media (min-width: 768px) {
  .component { width: 50%; }
}

/* ❌ MAL: Desktop-first */
.component {
  width: 50%;
}
@media (max-width: 768px) {
  .component { width: 100%; }
}
```

**Checklist:**

- [ ] ¿Todas las media queries usan mobile-first (min-width)?
- [ ] ¿Breakpoints están definidos como variables?
- [ ] ¿Componentes adaptan en 320px, 768px, 1024px?
- [ ] ¿Grid systems son responsive (flex/CSS Grid)?
- [ ] ¿Imágenes usan srcset o picture para responsive?

---

### STEP 3: Accesibilidad (a11y)

**Objetivo:** Verificar WCAG 2.1 Level AA compliance.

```bash
# Buscar aria-labels en botones
grep -r "aria-label\|aria-describedby" {frontend_path} | head -20

# Buscar img sin alt (PROHIBIDO)
grep -r "<img" {frontend_path}/*.html | grep -v "alt=" 

# Buscar heading hierarchy
grep -r "<h[1-6]" {frontend_path}/*.html | sort
```

**Tabla de Hallazgos:**

| Aspecto | Encontrado | Esperado | Estado | Ejemplar |
|:---|:---|:---|:---|:---|
| **ARIA Labels** | | | | |
| Botones con aria-label | 8 | ✓ | ✓ OK | `<button aria-label="Cerrar">X</button>` |
| Inputs con aria-label | 5 | ✓ | ✓ OK | `<input aria-label="Buscar">` |
| Links sin aria | 2 | 0 | ⚠️ Revisar | `<a href="#">Ver más</a>` |
| **Imágenes** | | | | |
| IMG con alt | 12 | 12 | ✓ OK | `<img alt="Logo" src="...">` |
| IMG sin alt | 0 | 0 | ✓ OK | - |
| **Color Contrast** | | | | |
| Texto oscuro sobre claro | ✓ (5:1) | ≥4.5:1 | ✓ OK | - |
| Texto claro sobre oscuro | ✓ (5:1) | ≥4.5:1 | ✓ OK | - |
| Contraste bajo encontrado | 1 | 0 | ⚠️ | `#999 on #f0f0f0` (3.5:1) |
| **Headings** | | | | |
| H1 presente | 1 | ≥1 | ✓ OK | Page title |
| Jerarquía H1→H2→H3 | ✓ | Orden correcto | ✓ OK | - |
| Saltos de heading | 0 | 0 | ✓ OK | - |

**Validación:**

- [ ] ¿Todos los botones tienen aria-label o texto visible?
- [ ] ¿Todas las imágenes tienen alt (excepto decorativas)?
- [ ] ¿Contraste de texto es ≥4.5:1 (normal) o ≥3:1 (grande)?
- [ ] ¿Headings siguen jerarquía sin saltos?
- [ ] ¿Formularios tienen labels asociados (for/id)?
- [ ] ¿Teclado puede navegar (tab, enter, escape)?

---

### STEP 4: Diseño y Consistencia Visual

**Objetivo:** Verificar que usa design tokens y es coherente.

```bash
# Buscar design token usage
grep -r "var(--color\|var(--spacing\|var(--font" {frontend_path}/*.scss | wc -l

# Buscar colores hardcodeados (PROHIBIDO si hay tokens)
grep -r "color: #\|background: #" {frontend_path}/*.scss | wc -l

# Buscar spacing hardcodeado
grep -r "padding: [0-9]\|margin: [0-9]" {frontend_path}/*.scss | head -20
```

**Tabla de Hallazgos:**

| Aspecto | Encontrado | Esperado | Estado | Ejemplar |
|:---|:---|:---|:---|:---|
| **Design Tokens** | | | | |
| Variables de color | 15 definidas | ≥15 | ✓ OK | `--color-primary: #0066cc` |
| Variables de spacing | 8 definidas | ≥8 | ✓ OK | `--spacing-unit: 8px` |
| Colores hardcodeados | 8 encontrados | 0 | ✗ VIOLACIÓN | `color: #333` |
| Spacing hardcodeado | 12 encontrados | 0 | ✗ VIOLACIÓN | `padding: 16px` |
| **Tipografía** | | | | |
| Font-sizes definidas | 4 | 3-5 | ✓ OK | `--font-size-base: 14px` |
| Font-weights consistentes | 3 (400, 600, 700) | Estándar | ✓ OK | - |
| Font-families consistentes | 1 (Sans) | 1-2 | ✓ OK | - |
| **Espaciado** | | | | |
| Padding/margin con variables | 30 usos | ✓ | ✓ OK | `padding: var(--spacing-unit)` |
| Espaciado inconsistente | 5 casos | 0 | ⚠️ | `padding: 12px` vs `14px` |

**Validación:**

- [ ] ¿Se usan variables de color (no #rgb hardcodeados)?
- [ ] ¿Se usan variables de spacing (no valores fijos)?
- [ ] ¿Tipografía es consistente (1-2 familias, 3-5 sizes)?
- [ ] ¿No hay colores/spacing duplicados?
- [ ] ¿Design system está documentado?

---

## Matriz de Severidad (UI Hallazgos)

| Problema | Severidad | Impacto | Ejemplar |
|:---|:---|:---|:---|
| IMG sin alt | MEDIA | Accesibilidad falla (screen readers) | Rehén de WCAG 2.1 |
| aria-label faltante en botón | MEDIA | Usuarios ciegos no saben qué hace | "Cerrar" debe tener aria-label |
| Colores hardcodeados (con tokens) | ALTA | Mantenimiento imposible, inconsistencia | `color: #333` en vez de `var(--color-text)` |
| Sin responsive (solo desktop) | CRÍTICA | Módulo no funciona en mobile | Table sin media queries |
| Contraste bajo | MEDIA | Usuarios con visión baja no leen | #999 on #f0f0f0 (3.5:1) |
| Spacing inconsistente | BAJA | UI se ve mal | Padding 12px vs 16px vs 8px |

---

## Checklist Completo de Auditoría de UI

### STEP 1: Componentes

- [ ] ¿Componentes están en ubicación correcta (shared/ui vs módulo)?
- [ ] ¿Componentes shared son reutilizados (≥2 usos)?
- [ ] ¿NO hay componentes duplicados en varios módulos?
- [ ] ¿Estilos están en carpeta del componente, no global?

### STEP 2: Responsive

- [ ] ¿Funciona en 320px (mobile), 768px (tablet), 1024px (desktop)?
- [ ] ¿Media queries usan mobile-first (min-width)?
- [ ] ¿Breakpoints están definidos como variables?
- [ ] ¿Imágenes son responsive (srcset/picture)?
- [ ] ¿No hay overflow horizontal en viewport pequeño?

### STEP 3: Accesibilidad

- [ ] ¿Botones tienen aria-label o texto visible?
- [ ] ¿Imágenes tienen alt (0 encontradas sin alt)?
- [ ] ¿Contraste de texto es ≥4.5:1?
- [ ] ¿Headings sin saltos (H1→H2→H3)?
- [ ] ¿Formularios con labels asociados (for/id)?
- [ ] ¿Navegación por teclado funciona (tab, enter)?

### STEP 4: Diseño

- [ ] ¿Usa design tokens (no colores hardcodeados)?
- [ ] ¿Usa spacing variables (no padding/margin fijos)?
- [ ] ¿Tipografía consistente (1-2 familias)?
- [ ] ¿No hay duplicación de colores/spacing?

---

## Reporte de Auditoría de UI

Incluir en el reporte de auditoría estas secciones:

```markdown
## 🎨 UI/COMPONENTES

### Componentes Encontrados
[Tabla de componentes]

### Responsive Design
[Tabla de breakpoints]

### Accesibilidad (a11y)
[Tabla de hallazgos]

### Diseño y Consistencia
[Tabla de tokens vs hardcoding]

### Hallazgos CRÍTICOS
[Lista de problemas que bloquean]

### Hallazgos ALTOS
[Lista de problemas que deben arreglarse]
```

---

## Referencias

- [UI Desktop Rules](./ui-desktop-rules.md)
- [UI Mobile Rules](./ui-mobile-rules.md)
- [CONVENTIONS.md §5.5 UI](../CONVENTIONS.md)
- [WCAG 2.1 Level AA](https://www.w3.org/WAI/WCAG21/quickref/)

---

*Protocolo: UI_AUDIT_PROTOCOL.md*  
*Versión: 1.0*  
*Vigente desde: 2026-07-30*

