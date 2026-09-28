# Reporte: Caption Alignment Rule — Propuesta para CONVENTIONS.md

**Status:** 🟡 PROPUESTA (Pendiente aprobación Tech Lead)  
**Requisito:** "Alinear elementos en una sola fila dentro de caption"  
**Validación:** ✅ Implementado exitosamente en `recruitment-agenda-list.html`  
**Fecha:** 2026-08-13

---

## Resumen

**Problema:**
Cuando `<ng-template #caption>` en `p-table` contiene filtros + `<primeng-custom-caption>`, hay ambigüedad sobre cómo alinearlo.

**Solución:**
Usar estructura estándar: `flex flex-wrap gap-3 align-items-center justify-content-between`

**Validación:**
Implementado en `recruitment-agenda-list.html` (líneas 71-88) → funciona correctamente ✅

---

## Propuesta de Texto para CONVENTIONS.md

### Ubicación Sugerida: §4.2.3bis (Frontend UI Patterns - PrimeNG Tables)

```markdown
## 4.2.3bis PrimeNG Table Caption Alignment (Single Row)

### Requisito: Alinear filtros + caption en una sola fila

Cuando `<ng-template #caption>` contiene filtros/controles LADO IZQUIERDO + 
`<primeng-custom-caption>` LADO DERECHO:

**Estructura obligatoria:**

<ng-template #caption>
  <div class="flex flex-wrap gap-3 align-items-center justify-content-between">
    <!-- Filtros/controles a la IZQUIERDA -->
    <div class="flex flex-wrap gap-2">
      <span class="text-sm text-color-secondary">Filtrar por estado:</span>
      <!-- Botones, select, input -->
      <button class="btn btn-sm">Opción 1</button>
      <button class="btn btn-sm">Opción 2</button>
    </div>

    <!-- Componente caption a la DERECHA -->
    <primeng-custom-caption [dt]="dt" [showAdd]="true" />
  </div>
</ng-template>

**Clases OBLIGATORIAS:**
- `flex flex-wrap` — Layout horizontal, wrappable en mobile
- `gap-3` — Espaciado 1rem entre bloques izquierda/derecha
- `align-items-center` — Alineación vertical de todos elementos
- `justify-content-between` — Distribución: izquierda vs derecha

**Referencia:** [../../../docs/SharedLuxuryApp/DesignSystem/20260813-especificacion-shared-caption-alignment.md](../../../docs/SharedLuxuryApp/DesignSystem/20260813-especificacion-shared-caption-alignment.md)
```

---

## Impacto

### Archivos que pueden aplicar esta regla:

**Actuales (requerimiento):**
- ✅ `recruitment-agenda-list.html` — YA implementado

**Potenciales (futuras):**
- `candidate-list-desktop.html` — Si se requiere "fila única"
- `candidate-list-mobile.html` — Adaptado a mobile
- Cualquier tabla con filtros + caption

### Beneficios:

✅ Claridad: Patrón estándar, no ambigüedad  
✅ Consistencia: Mismo styling en todas las tablas  
✅ Responsividad: `flex-wrap` adapta a mobile  
✅ Mantenibilidad: Menos CSS custom, más PrimeFlex

---

## Decisión Pendiente Tech Lead

### Opción A (Recomendada): Agregar a CONVENTIONS.md

- Sección: §4.2.3bis (Frontend UI Patterns)
- Referencia: Link a ../../../docs/SharedLuxuryApp/DesignSystem/20260813-especificacion-shared-caption-alignment.md
- Aplicación: Inmediata en nuevas tablas

### Opción B: Documentar en archivo separado

- Ubicación: `conventions/frontend/primeng-caption-alignment.md`
- Referencia desde CONVENTIONS.md: Breve mención + link
- Aplicación: Cuando necesario

### Opción C: Ignorar (no formalizar)

- Riesgo: Inconsistencia en futuras tablas
- No recomendado

---

## Validación en Codebase

**Archivo:** `recruitment-agenda-list.html` (Líneas 71-88)

```html
✅ <div class="flex flex-wrap gap-3 align-items-center justify-content-between">
✅   <div class="flex flex-wrap gap-2">
✅     Filtros con gap-2
✅   </div>
✅   <primeng-custom-caption ... />
✅ </div>
```

**Resultado:** A+ (cumple todas las clases obligatorias)

---

## Próximos Pasos

1. **Tech Lead aprueba** Opción A
2. **Agregar a CONVENTIONS.md §4.2.3bis** (10 min)
3. **Actualizar conventions-viewer** si aplica
4. **Referencia en code review:** "Usa caption-alignment pattern"

---

**Propuesta creada:** 2026-08-13  
**Validación:** ✅ recruitment-agenda-list.html cumple  
**Recomendación:** Formalizar en CONVENTIONS.md
