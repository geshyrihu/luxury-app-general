# Auditoría de Migración PrimeFlex → Bootstrap 5

**Fecha:** 2026-09-13
**Alcance:** `appsweb/angular/src/` — 886 archivos `.html` escaneados
**Archivos afectados:** ~650+ (73% del total)

---

## Resumen Ejecutivo

| Categoría | Ocurrencias | Archivos |
|-----------|-------------|----------|
| `col-N` (grid columns) | ~2,500+ | 397 |
| `flex` (aislada y variantes) | ~4,000+ | 627 |
| `align-items-*` / `justify-content-*` | ~3,500+ | ~500 |
| `mr-*` / `ml-*` / `mt-*` / `mb-*` | ~2,000+ | 572 |
| `font-bold` / `font-semibold` / `font-medium` | ~1,200+ | ~400 |
| `w-full` / `h-full` | ~800+ | ~230 |
| `overflow-hidden` | ~300+ | 87 |
| `border-round` / `border-none` / `border-circle` | ~200+ | 80 |
| `grid` (contenedor) | ~50+ | 42 |
| `hidden` / `md:block` / `md:flex` | ~15 | 7 |
| `uppercase` / `lowercase` | ~150+ | 109 |
| `absolute` / `relative` / `fixed` / `sticky` | ~80+ | ~40 |

---

## Mapa de Reemplazo PrimeFlex → Bootstrap 5

### 1. Grid System

| PrimeFlex | Bootstrap 5 | Notas |
|-----------|-------------|-------|
| `grid` | `row` | Contenedor de grilla |
| `col-N` (1-12) | `col-N` | Compatible, mismos valores |
| `grid-nogutter` | `row g-0` | Sin gutter |
| `sm:grid` / `md:grid` / `lg:grid` | `d-*-grid` / `d-*-flex` | No existe grid responsivo BS5, usar flex |
| `grid-cols-N` | `row-cols-N` | Columnas por fila |

### 2. Flexbox

| PrimeFlex | Bootstrap 5 | Notas |
|-----------|-------------|-------|
| `flex` (aislada) | `d-flex` | Solo clase aislada |
| `flex-column` | `flex-column` | Compatible |
| `flex-row` | `flex-row` | Compatible |
| `flex-wrap` | `flex-wrap` | Compatible |
| `flex-nowrap` | `flex-nowrap` | Compatible |
| `flex-grow-1` | `flex-grow-1` | Compatible |
| `flex-shrink-0` | `flex-shrink-0` | Compatible |
| `flex-1` | `flex-fill` | Equivalente BS5 |
| `flex-auto` | `flex-fill` | Equivalente BS5 |
| `flex-none` | `flex-none` | Compatible |
| `order-N` | `order-N` | Compatible |
| `sm:flex-row` | `flex-sm-row` | Prefijo responsivo cambia posición |
| `lg:flex-row` | `flex-lg-row` | Prefijo responsivo cambia posición |
| `md:flex-nowrap` | `flex-md-nowrap` | Prefijo responsivo cambia posición |

### 3. Align / Justify

| PrimeFlex | Bootstrap 5 | Notas |
|-----------|-------------|-------|
| `align-items-center` | `align-items-center` | Compatible |
| `align-items-start` | `align-items-start` | Compatible |
| `align-items-end` | `align-items-end` | Compatible |
| `justify-content-between` | `justify-content-between` | Compatible |
| `justify-content-center` | `justify-content-center` | Compatible |
| `justify-content-end` | `justify-content-end` | Compatible |
| `lg:align-items-center` | `align-items-lg-center` | Prefijo responsivo cambia posición |
| `align-self-*` | `align-self-*` | Compatible |

### 4. Espaciado Direccional (Right/Left → End/Start)

| PrimeFlex | Bootstrap 5 | Notas |
|-----------|-------------|-------|
| `mr-1` | `me-1` | Margin-end |
| `mr-2` | `me-2` | Margin-end |
| `mr-3` | `me-3` | Margin-end |
| `ml-1` | `ms-1` | Margin-start |
| `ml-2` | `ms-2` | Margin-start |
| `mt-1` | `mt-1` | Compatible |
| `mb-1` | `mb-1` | Compatible |
| `mx-1` | `mx-1` | Compatible |
| `my-1` | `my-1` | Compatible |
| `p-2` | `p-2` | Compatible |
| `gap-N` | `gap-N` | Compatible |

### 5. Tipografía

| PrimeFlex | Bootstrap 5 | Notas |
|-----------|-------------|-------|
| `font-bold` | `fw-bold` | Font weight |
| `font-semibold` | `fw-semibold` | Font weight |
| `font-medium` | `fw-medium` | Font weight |
| `font-light` | `fw-light` | Font weight |
| `font-italic` | `fst-italic` | Font style |
| `uppercase` | `text-uppercase` | Text transform |
| `lowercase` | `text-lowercase` | Text transform |
| `text-center` | `text-center` | Compatible |
| `text-right` | `text-end` | Dirección lógica |
| `text-left` | `text-start` | Dirección lógica |

### 6. Display Responsivo

| PrimeFlex | Bootstrap 5 | Notas |
|-----------|-------------|-------|
| `hidden` | `d-none` | Display none |
| `md:block` | `d-md-block` | Display block en md |
| `md:flex` | `d-md-flex` | Display flex en md |
| `md:hidden` | `d-md-none` | Display none en md |
| `hidden md:block` | `d-none d-md-block` | Oculto, visible en md+ |
| `sm:flex-grow-0` | `flex-grow-sm-0` | Prefijo responsivo |

### 7. Sizing

| PrimeFlex | Bootstrap 5 | Notas |
|-----------|-------------|-------|
| `w-full` | `w-100` | Width 100% |
| `h-full` | `h-100` | Height 100% |
| `min-w-0` | `min-w-0` | Compatible |
| `max-w-*` | `mw-*` | Prefijo diferente |
| `min-h-*` | Sin equivalente directo | Usar CSS custom |

### 8. Overflow

| PrimeFlex | Bootstrap 5 | Notas |
|-----------|-------------|-------|
| `overflow-hidden` | `overflow-hidden` | Compatible |
| `overflow-auto` | `overflow-auto` | Compatible |
| `overflow-scroll` | `overflow-auto` | BS5 usa auto |

### 9. Position

| PrimeFlex | Bootstrap 5 | Notas |
|-----------|-------------|-------|
| `absolute` | `position-absolute` | Clase completa BS5 |
| `relative` | `position-relative` | Clase completa BS5 |
| `fixed` | `position-fixed` | Clase completa BS5 |
| `sticky` | `position-sticky` | Clase completa BS5 |
| `top-0` | `top-0` | Compatible |
| `left-0` | `start-0` | Dirección lógica |
| `right-0` | `end-0` | Dirección lógica |
| `z-1` | `z-1` | Compatible |

### 10. Bordes

| PrimeFlex | Bootstrap 5 | Notas |
|-----------|-------------|-------|
| `border-none` | `border-0` | Sin borde |
| `border-round` | `rounded` | Borde redondeado |
| `border-round-xl` | `rounded-xl` | BS5 no tiene xl, usar CSS custom |
| `border-round-md` | `rounded` | BS5 no tiene md, usar CSS custom |
| `border-circle` | `rounded-circle` | Borde circular |
| `border-dashed` | `border border-dashed` | Borde punteado |

---

## Archivos Críticos (Mayor Densidad PrimeFlex)

### Tier 1 — 50+ ocurrencias (migración pesada)

| Archivo | col-N | flex | align/justify | font | spacing | Total est. |
|---------|-------|------|---------------|------|---------|------------|
| `recruitment/.../employee-file-detail.html` | 67 | ~15 | ~20 | ~10 | ~15 | **127** |
| `operations/.../google-calendar-form.html` | 37 | ~10 | ~12 | ~5 | ~10 | **74** |
| `recruitment/.../employee-unified-profile-form.html` | 37 | ~12 | ~15 | ~8 | ~12 | **84** |
| `recruitment/.../candidate-application-form.html` | 29 | ~10 | ~12 | ~5 | ~8 | **64** |
| `recruitment/.../candidate-form.html` | 25 | ~8 | ~10 | ~5 | ~8 | **56** |

### Tier 2 — 20-49 ocurrencias (migración media)

| Archivo | col-N | flex | align/justify | font | spacing | Total est. |
|---------|-------|------|---------------|------|---------|------------|
| `collections/.../aspel-cobranza-haus.html` | 26 | ~8 | ~10 | ~5 | ~8 | **57** |
| `human-resources/.../mi-permiso-detalle.html` | 26 | ~10 | ~12 | ~5 | ~8 | **61** |
| `accounting/.../gasto-fijo-servicios.html` | 22 | ~8 | ~10 | ~5 | ~8 | **53** |
| `accounting/.../funding-purchase-detail.html` | 22 | ~8 | ~10 | ~5 | ~8 | **53** |
| `supplier/.../orden-compra.html` | 23 | ~8 | ~10 | ~5 | ~10 | **56** |
| `admin/.../catalog-guia.html` | 21 | ~8 | ~10 | ~5 | ~8 | **52** |
| `legal/.../ticket-legal-reportes-pendientes.html` | 21 | ~8 | ~10 | ~5 | ~8 | **52** |
| `management/.../presentacion-junta-comite.html` | ~5 | ~30 | ~15 | ~10 | ~15 | **75** |
| `management/.../presentacion-junta-comite-contador.html` | ~5 | ~25 | ~12 | ~8 | ~12 | **62** |
| `accounting/.../report-builder.html` | ~8 | ~20 | ~15 | ~10 | ~15 | **68** |

### Tier 3 — 10-19 ocurrencias (migración ligera)

~120 archivos en esta categoría.

### Tier 4 — 1-9 ocurrencias (migración mínima)

~400+ archivos en esta categoría.

---

## Módulos Más Impactados

| Módulo | Archivos Afectados | Prioridad |
|--------|-------------------|-----------|
| `operations.luxuryapp` | ~80+ | Alta |
| `recruitment.luxuryapp` | ~60+ | Alta |
| `accounting.luxuryapp` | ~70+ | Alta |
| `admin.luxuryapp` | ~50+ | Alta |
| `human-resources.luxuryapp` | ~40+ | Media |
| `supplier.luxuryapp` | ~30+ | Media |
| `collections.luxuryapp` | ~40+ | Media |
| `maintenance.luxuryapp` | ~35+ | Media |
| `management.luxuryapp` | ~25+ | Media |
| `legal.luxuryapp` | ~20+ | Baja-Media |
| `core/layout` | ~15+ | Media |
| `shared` | ~15+ | Media |
| `core/pages-extras` | ~10+ | Baja |
| `purchases.luxuryapp` | ~15+ | Baja-Media |
| `system.luxuryapp` | ~5+ | Baja |

---

## Patrones ngClass Dinámicos (Requieren Atención Especial)

Estos usan PrimeFlex dentro de `[ngClass]` y necesitan evaluación caso por caso:

| Archivo | Línea | Patrón |
|---------|-------|--------|
| `accounting/.../report-builder.html` | 188 | `[ngClass]="... ? 'flex flex-column' : 'flex flex-column gap-4'"` |
| `accounting/.../report-builder.html` | 209 | `[ngClass]="... ? 'grid m-0 w-full' : 'flex flex-column gap-4'"` |
| `accounting/.../report-builder.html` | 212 | `[ngClass]="... ? 'col-12 xl:col-6 p-2' : ''"` |
| `accounting/.../ai-agent.html` | 27 | `[ngClass]="{'justify-content-end': ..., 'justify-content-start': ...}"` |
| `collections/.../cobranza-online-resumen.html` | 29 | `[ngClass]="... ? 'xl:col-6' : 'xl:col-8'"` |
| `collections/.../cobranza-online-resumen.html` | 156 | `[ngClass]="... ? 'xl:col-12' : 'xl:col-4'"` |
| `admin/.../cotizador.component.html` | 31 | `[ngClass]="{ 'bg-primary-50 border-primary': mod.selected }"` |

---

## Clases PrimeFlex sin Equivalente Directo en BS5

| PrimeFlex | Alternativa BS5 | Notas |
|-----------|-----------------|-------|
| `grid-nogutter` | `row g-0` | |
| `surface-*` (colores) | `bg-*` custom | Requiere definir variables CSS |
| `text-500` / `text-*` (shade) | `text-muted` o custom | BS5 no tiene scales numéricas |
| `p-md-4` / `pr-6` | `p-md-4` / `pe-6` (custom) | BS5 no tiene directional p-* > 3 |
| `shadow-1` / `shadow-*` | `shadow-sm` / `shadow` | BS5 tiene menos niveles |
| `border-top-1` | `border-top` | BS5 no tiene grosores custom |
| `rounded-circle` | `rounded-circle` | Compatible |
| `fadein` | `fade` (con JS) | Animaciones requieren JS en BS5 |
| `cursor-move` | `cursor-grab` o custom | |
| `line-height-*` | `lh-*` | BS5 soporta lh-1, lh-sm, lh-base, lh-lg |
| `min-h-screen` | `min-vh-100` | Equivalente BS5 |

---

## Recomendaciones de Estrategia

1. **Fase 1 — Archivos críticos (Tier 1):** 5 archivos, ~400+ ocurrencias. Migrar primero para validar patrones.
2. **Fase 2 — Módulo por módulo:** Priorizar `operations` → `recruitment` → `accounting` → `admin`.
3. **Fase 3 — ngClass dinámicos:** Requieren revisión manual, no son reemplazo directo.
4. **Fase 4 — Clases sin equivalente:** Definir variables CSS custom en `styles.scss` para `surface-*`, `text-500`, etc.
5. **Verificación:** Correr `ng build` después de cada fase para detectar rotos visuales.

---

## Archivos con `hidden md:block` (Migrados)

| Archivo | Estado |
|---------|--------|
| `admin/.../user-account-list.html` | ✅ Migrado |
| `collections/.../cobranza-online-towers.html` | ⏳ Pendiente |
| `collections/.../cobranza-online-movimientos.html` | ⏳ Pendiente |
| `collections/.../cobranza-online-wrapper.html` | ⏳ Pendiente |
| `collections/.../aspel-cobranza-haus-debt-detail-modal.html` | ⏳ Pendiente |
| `purchases/.../cuadro-comparativo-list.html` | ⏳ Pendiente |
| `public/.../telefonos-emergencia.html` | ⏳ Pendiente |

---

*Generado por escaneo automático del codebase. ~650 archivos afectados de 886 totales (73%).*
