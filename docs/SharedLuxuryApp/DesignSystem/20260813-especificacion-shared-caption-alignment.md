
**Status:** 🟡 PROPUESTA (Pendiente aprobación Tech Lead)  
**Scope:** Frontend Angular — `<ng-template #caption>` en `p-table`  
**Fecha:** 2026-08-13

---

## Regla: Alineación en Fila Única (Single Row)

### Cuándo Aplicar

**Requisito:** "Alinear elementos en una sola fila dentro de caption"

### Solución Estándar

**Estructura obligatoria:**

```html
<ng-template #caption>
  <div class="flex flex-wrap gap-3 align-items-center justify-content-between">
    <!-- Filtros/controles a la IZQUIERDA -->
    <div class="flex flex-wrap gap-2">
      <span class="text-sm text-color-secondary">Filtrar por estado:</span>
      <!-- Botones, select, input, etc. -->
    </div>

    <!-- Componente caption a la DERECHA -->
  </div>
</ng-template>
```

### Clases Obligatorias

| Clase | Propósito | Efecto |
|-------|-----------|--------|
| `flex flex-wrap` | Layout horizontal | Elementos en fila, wrappable en mobile |
| `gap-3` | Espaciado entre bloques | 1rem separación horizontal |
| `align-items-center` | Alineación vertical | Todos los items centrados verticalmente |
| `justify-content-between` | Distribución | Controles izquierda, caption derecha |

### Estructura de Componentes

**Bloque izquierdo (filtros/controles):**
```html
<div class="flex flex-wrap gap-2">
  <span class="text-sm text-color-secondary">Etiqueta:</span>
  <!-- Botones, select, input -->
</div>
```

**Bloque derecho (caption):**
```html
```

---

## Ejemplos Implementados

### ✅ Ejemplo 1: Agenda con Filtro por Estado

**Archivo:** `recruitment-agenda-list.html` (líneas 71-88)

```html
<ng-template #caption>
  <div class="flex flex-wrap gap-3 align-items-center justify-content-between">
    <!-- Filtros izquierda -->
    <div class="flex flex-wrap gap-2">
      <span class="text-sm text-color-secondary">Filtrar por estado:</span>
      @for (opt of agendaStatusOptions; track opt.value) {
      <button type="button" class="btn btn-sm" 
        [class.btn-primary]="statusFilter() === opt.value"
        (click)="statusFilter.set(statusFilter() === opt.value ? '' : opt.value)">
        {{ opt.label }}
      </button>
      }
      <button type="button" class="btn btn-sm btn-outline">Todos</button>
    </div>

    <!-- Caption derecha -->
      aria-label="Agenda operativa de reclutamiento" />
  </div>
</ng-template>
```

**Resultado:** ✅ Filtros + Caption en una línea, responsivo

---

### ✅ Ejemplo 2: Candidatos con Filtro por Estado (Desktop)

**Archivo:** `candidate-list-desktop.html` (líneas 15-46)

```html
<ng-template #caption>
  <div class="flex flex-column gap-3">
    <div class="flex flex-wrap gap-2 px-2">
      <iw-button-item label="Vigentes" 
        [severity]="statusFilter() === 'active' ? 'primary' : 'secondary'"
        (clicked)="changeStatusFilter.emit('active')" />
      <iw-button-item label="Archivados" />
      <iw-button-item label="Todos" />
    </div>
  </div>
</ng-template>
```

**Nota:** Este usa `flex-column` (vertical). Cambiar a horizontal si requisito es "una sola fila":

```html
<!-- Si requisito es FILA ÚNICA -->
<div class="flex flex-wrap gap-3 align-items-center justify-content-between">
  <div class="flex flex-wrap gap-2">
    <iw-button-item label="Vigentes" />
    <iw-button-item label="Archivados" />
    <iw-button-item label="Todos" />
  </div>
</div>
```

---

## Responsividad

El patrón `flex flex-wrap` es responsivo:

```
🖥️ Desktop (>768px):
  ┌────────────────────────────┐
  │ Filtros  gap-3  Caption    │  ← Una línea
  └────────────────────────────┘

📱 Mobile (<768px):
  ┌──────────────┐
  │   Filtros    │  ← Se wrappea si es necesario
  │   Caption    │
  └──────────────┘
```

---

## Checklist de Cumplimiento

- [ ] ¿Usar `flex flex-wrap gap-3` en div exterior?
- [ ] ¿Usar `align-items-center`?
- [ ] ¿Usar `justify-content-between`?
- [ ] ¿Agrupar filtros en `flex flex-wrap gap-2`?
- [ ] ¿Sin mb-3, sin saltos de línea innecesarios?
- [ ] ¿Responsivo en mobile?

---

## Cuándo NO Usar Esta Regla

❌ Si caption tiene SOLO un elemento (sin filtros) → usar sin wrapper:
```html
<ng-template #caption>
</ng-template>
```

❌ Si hay 3+ bloques distintos → considerar `grid` o `flex-direction: column`:
```html
<!-- 3+ bloques: mejor usar columnas -->
<div class="flex flex-column gap-2">
  <div class="flex gap-2">Filtros 1</div>
  <div class="flex gap-2">Filtros 2</div>
</div>
```

---

## Decisión Pendiente Tech Lead

### ¿Aprobar como regla formal?

- **Opción A:** Agregar a CONVENTIONS.md §5.3bis (Frontend UI Patterns)
- **Opción C:** Incluir en `ui-desktop-rules.md` bajo "DataTable Captions"

**Recomendación:** Opción A (simple, directa, referenciable)

---

**Propuesta creada:** 2026-08-13  
**Ejemplo validado:** `recruitment-agenda-list.html` ✅  
**Status:** Aguardando aprobación Tech Lead
