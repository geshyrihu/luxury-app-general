**Ruta:** shared/ui/mobile/data-view-mobile/
**Fecha:** 10-jul-26
**Estado:** Plan de Implementación

---

# Plan: Crear vistas móviles para 15 componentes P1

## Patrón base de referencia

Tomado de `bank-list.html` (estándar vigente):

```html
<!-- 💻 WEB -->
<div class="hidden md:block">
  <p-table ...>
    <!-- caption, header, body, empty, paginator -->
  </p-table>
</div>

<!-- 📱 MOBILE -->
<app-data-view-mobile
  [data]="dataSignal()"
  (add)="onModalForm({ id: '', title: 'Nuevo' })"
  [globalFilterFields]="globalFilterFields()"
  [dt]="dt"
>
  <ng-template #listItemTemplate let-item>
    <ili-list-item>
      <p class="font-semibold m-0 text-color">{{ item.campoPrincipal }}</p>
      <p class="text-xs m-0 text-color-secondary">{{ item.campoSecundario }}</p>

      <ili-action-menu end>
        <ng-container actions>
          <ili-button-edit (clicked)="editar(item.id)" label="Editar" />
          <ili-button-delete (confirmed)="eliminar(item.id)" label="Eliminar" />
        </ng-container>
      </ili-action-menu>
    </ili-list-item>
  </ng-template>
</app-data-view-mobile>
```

### Reglas obligatorias (del estándar)

1. **Envolver** el `<p-table>` actual en `<div class="hidden md:block">` (si no lo tiene)
2. **NO** usar `<h3>` — solo `<p>` para texto
3. **NO** usar `ion-no-padding` en `<ili-list-item>`
4. `<ili-action-menu end>` como **hijo directo** de `<ili-list-item>` (nunca dentro de `<div end>`)
5. Botones: `ili-button-*` (no `iw-*` ni `il-*`)
6. El `#dt` debe estar en el `<p-table>` para que `[dt]="dt"` funcione en mobile

---

## FASE 1 — Simples (7 archivos, ~15 min c/u)

Columnas mínimas (2-7), sin paginator complejo, sin agrupaciones.

### 1.1 `equipment-inspection-definitions-list.html`

| Web actual                                                      | Mobile propuesto                                 |
| --------------------------------------------------------------- | ------------------------------------------------ |
| 6 columnas: Nombre, Frecuencia, Criterios, Responsables, Estado | **Línea 1:** `item.title` (font-semibold)        |
| 4 acciones: play-circle, power, edit, delete                    | **Línea 2:** `item.frequency` · `item.status`    |
| Sin paginator                                                   | **Acciones:** iniciar, activar, editar, eliminar |

**Pasos:**

1. Envolver `<p-table>` en `<div class="hidden md:block">`
2. Agregar `<app-data-view-mobile>` debajo con `[data]="data()"` y `(add)="..."` si aplica
3. Crear `#listItemTemplate` con ili-list-item, 2 líneas de texto, ili-action-menu end
4. Mapear las 4 acciones a `ili-button-item` / `ili-button-edit` / `ili-button-delete`

### 1.2 `equipment-inspection-execution-history-list.html`

| Web actual                                                        | Mobile propuesto                               |
| ----------------------------------------------------------------- | ---------------------------------------------- |
| 7 columnas: Inspeccion, Fecha, Asignado, Avance, Estado, Hallazgo | **Línea 1:** `item.inspectionName`             |
| 2 acciones: eye (ver), check-circle (completar)                   | **Línea 2:** `item.assignedTo` · `item.status` |
| Sin paginator, showAdd=false                                      | **Acciones:** ver, completar                   |

**Pasos:**

1. Envolver `<p-table>` en `<div class="hidden md:block">`
2. Agregar `<app-data-view-mobile [showAdd]="false">`
3. Template: nombre inspección + asignado/estado
4. Acciones: ver (ili-button-item), completar (ili-button-item, condicional `!item.isClosed`)

### 1.3 `equipment-inspection-qr-list.html`

| Web actual                                                            | Mobile propuesto                       |
| --------------------------------------------------------------------- | -------------------------------------- |
| 7 columnas: Nombre, Tipo, Codigo, Deep link, Estado, Ultima impresion | **Línea 1:** `item.name`               |
| 2 acciones: printer (imprimir), refresh (regenerar)                   | **Línea 2:** `item.type` · `item.code` |
| Sin paginator, showAdd=false                                          | **Acciones:** imprimir, regenerar      |

**Pasos:**

1. Envolver `<p-table>` en `<div class="hidden md:block">`
2. Agregar `<app-data-view-mobile [showAdd]="false">`
3. Template: nombre + tipo/código
4. Acciones: imprimir (ili-button-item), regenerar (ili-button-item)

### 1.4 `filtro-minutas-area.html`

| Web actual                                                         | Mobile propuesto                                |
| ------------------------------------------------------------------ | ----------------------------------------------- |
| 7 columnas: #, Area, Titulo, Asunto, Estatus, Entrega, Seguimiento | **Línea 1:** `item.title`                       |
| Sin acciones                                                       | **Línea 2:** `item.areaEmpresa` · `item.status` |
| Paginator con footer                                               | **Sin acciones** (solo lectura)                 |

**Pasos:**

1. Envolver `<p-table>` en `<div class="hidden md:block">`
2. Agregar `<app-data-view-mobile [showAdd]="false">`
3. Template: título + área/estado
4. Sin ili-action-menu (solo lectura)

### 1.5 `resultado-general-evaluacion-areas-detalle.html`

| Web actual                                                            | Mobile propuesto                             |
| --------------------------------------------------------------------- | -------------------------------------------- |
| 7 columnas: #, Cliente, Titulo, Asunto, Estatus, Entrega, Seguimiento | **Línea 1:** `item.title`                    |
| Sin acciones                                                          | **Línea 2:** `item.customer` · `item.status` |
| Sin paginator                                                         | **Sin acciones** (solo lectura)              |

**Pasos:**

1. Envolver `<p-table>` en `<div class="hidden md:block">`
2. Agregar `<app-data-view-mobile [showAdd]="false">`
3. Template: título + cliente/estado
4. Sin ili-action-menu

### 1.6 `calendario-maestro-equipo.html`

| Web actual                               | Mobile propuesto                        |
| ---------------------------------------- | --------------------------------------- |
| 2 columnas: Nombre Equipo, Clasificacion | **Línea 1:** `item.nombreEquipo`        |
| 2 acciones: edit, delete                 | **Línea 2:** `item.equipoClasificacion` |
| Paginator con footer                     | **Acciones:** editar, eliminar          |

**Pasos:**

1. Verificar que ya tiene `hidden md:block` (sí)
2. Agregar `<app-data-view-mobile>` con `(add)="onModalForm(...)"`
3. Template: nombre + clasificación
4. Acciones: edit, delete

### 1.7 `resumen-minuta.html`

| Web actual                                             | Mobile propuesto           |
| ------------------------------------------------------ | -------------------------- |
| 3 columnas: Requerimiento, Ultimo Seguimiento, Estatus | **Línea 1:** `item.title`  |
| Sin acciones (solo lectura)                            | **Línea 2:** `item.status` |
| Paginator con footer                                   | **Sin acciones**           |

**Pasos:**

1. Envolver `<p-table>` en `<div class="hidden md:block">`
2. Agregar `<app-data-view-mobile [showAdd]="false">`
3. Template: título + estado
4. Sin ili-action-menu

---

## FASE 2 — Medianos (5 archivos, ~20 min c/u)

Más columnas, filtros, paginator, acciones condicionales.

### 2.1 `contracts-policies.html`

| Web actual                                                                          | Mobile propuesto                                    |
| ----------------------------------------------------------------------------------- | --------------------------------------------------- |
| 6 columnas: #, Proveedor, Descripción, Fecha Contratacion, Fecha Termino, Documento | **Línea 1:** `item.descripcion`                     |
| 1 acción: view-pdf                                                                  | **Línea 2:** `item.proveedor` · `item.fechaTermino` |
| Paginator con footer, globalFilterFields                                            | **Acciones:** ver PDF                               |

**Pasos:**

1. Verificar `hidden md:block` (sí, en p-table)
2. Agregar `<app-data-view-mobile [showAdd]="false" [globalFilterFields]="globalFilterFields()" [dt]="dt">`
3. Template: DESCRIPCIÓN + proveedor/fecha
4. Acción: `ili-button-item` con icono material-symbols-light:file-document para ver PDF

### 2.2 `task-operation-report.html`

| Web actual                                                                         | Mobile propuesto                                          |
| ---------------------------------------------------------------------------------- | --------------------------------------------------------- |
| 8 columnas: FOLIO, FECHA, SOLICITUD, EVIDENCIA, CIERRE, Evidencia, Reporte Semanal | **Línea 1:** `item.folio`                                 |
| 2 acciones: tracking (con badge), custom-input-switch                              | **Línea 2:** `item.responsibleArea` · `item.dateFinished` |
| Filtros complejos (status, actions, date-range)                                    | **Acciones:** tracking                                    |

**Pasos:**

1. Verificar `hidden md:block` (sí)
2. Agregar `<app-data-view-mobile [showAdd]="false">`
3. Mover filtros a `[customFilters]` slot
4. Template: folio + área/fecha cierre
5. Acción: ili-button-item para tracking

### 2.3 `task-report-work-plan.html`

| Web actual                                                                       | Mobile propuesto                                               |
| -------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| 8 columnas: FOLIO, SOLICITUD, EVIDENCIA, PRIORIDAD, ASIGNADO A, PROGRAMADO, DIAS | **Línea 1:** `item.folio`                                      |
| Sin acciones activas                                                             | **Línea 2:** `item.responsibleArea` · `item.responsableNombre` |
| Filtro de assignee                                                               | **Sin acciones**                                               |

**Pasos:**

1. Verificar `hidden md:block` (sí)
2. Agregar `<app-data-view-mobile [showAdd]="false">`
3. Mover filtro de assignee a `[customFilters]`
4. Template: folio + área/asignado
5. Sin ili-action-menu

### 2.4 `unified-pending-dashboard.html`

| Web actual                                                                           | Mobile propuesto                                |
| ------------------------------------------------------------------------------------ | ----------------------------------------------- |
| 7 columnas: Modulo, Fecha, Actividad, Responsable, Ultimo Seguimiento, Estatus, Dias | **Línea 1:** `item.title`                       |
| Sin acciones (row click navega)                                                      | **Línea 2:** `item.module` · `item.responsible` |
| Filtros de módulo (chips), paginator                                                 | **Click:** navegar a detalle                    |

**Pasos:**

1. Envolver `<p-table>` en `<div class="hidden md:block">`
2. Agregar `<app-data-view-mobile [showAdd]="false">`
3. Mover chips de filtro a `[customFilters]`
4. Template: título + módulo/responsable
5. Sin ili-action-menu (usar `(click)` en ili-list-item para navegar)

### 2.5 `agenda-supervision.html`

| Web actual                                                                                | Mobile propuesto                                |
| ----------------------------------------------------------------------------------------- | ----------------------------------------------- |
| 9 columnas: SUPERVISOR, SOLICITUD, CLIENTE, PROBLEMA, SOLUCION, CONCLUSION, DIAS, ESTATUS | **Línea 1:** `item.problema`                    |
| 2 acciones: edit, delete (condicional)                                                    | **Línea 2:** `item.name.label` · `item.estatus` |
| Filtros complejos (multi-select, calendar), paginator                                     | **Acciones:** editar, eliminar                  |

**Pasos:**

1. Verificar `hidden md:block` (sí)
2. Agregar `<app-data-view-mobile [showAdd]="false">`
3. Mover filtros a `[customFilters]`
4. Template: problema + supervisor/estatus
5. Acciones: edit (ili-button-edit), delete condicional (ili-button-delete)

---

## FASE 3 — Complejos (3 archivos, ~30 min c/u)

Agrupaciones, layout especial, o múltiples acciones.

### 3.1 `entrega-recepcion-cliente.html`

| Web actual                                                  | Mobile propuesto                                 |
| ----------------------------------------------------------- | ------------------------------------------------ |
| 8 columnas agrupadas por `grupo` (rowGroupMode="subheader") | **Grupo:** `item.grupo` como divider             |
| 3 acciones: edit, valid/revocar, delete                     | **Línea 1:** `item.descripcion`                  |
| Filtros por departamento                                    | **Línea 2:** `item.observacion` · `item.estatus` |
| Sin paginator                                               | **Acciones:** editar, validar/revocar, eliminar  |

**Pasos:**

1. Verificar `hidden md:block` (sí)
2. Agregar `<app-data-view-mobile>` con `isGrouped=true` y `[groupedData]="groupedData()"`
3. Usar `ion-item-divider` para los grupos (el componente ya lo soporta)
4. Template por grupo con ili-list-item
5. Acciones: edit, valid/revocar (ili-button-item), delete

### 3.2 `bitacora-individual.html`

| Web actual                                  | Mobile propuesto                                    |
| ------------------------------------------- | --------------------------------------------------- |
| Layout de cards (no columnas tradicionales) | **Línea 1:** `item.descripcion`                     |
| Sin acciones (click en userName navega)     | **Línea 2:** `item.fechaRegistro` · `item.userName` |
| Filtro de fecha, paginator                  | **Click:** navegar a empleado                       |

**Pasos:**

1. Verificar `hidden md:block` (sí)
2. Agregar `<app-data-view-mobile [showAdd]="false">`
3. Mover filtro de fecha a `[customFilters]`
4. Template: DESCRIPCIÓN + fecha/usuario
5. Sin ili-action-menu (click en ili-list-item para navegar)

### 3.3 `bitacora-mantenimiento.html`

| Web actual                                       | Mobile propuesto                                     |
| ------------------------------------------------ | ---------------------------------------------------- |
| Layout de cards (una fila por registro)          | **Línea 1:** `item.descripcion`                      |
| 1 acción: delete (condicional JefeMantenimiento) | **Línea 2:** `item.machinery` · `item.fechaRegistro` |
| Filtro de fecha, add button                      | **Acciones:** eliminar                               |

**Pasos:**

1. Verificar `hidden md:block` (sí)
2. Agregar `<app-data-view-mobile>` con `(add)="onModalFormBiacora(...)"`
3. Mover filtro de fecha a `[customFilters]`
4. Template: DESCRIPCIÓN + maquinaria/fecha
5. Acción: ili-button-delete condicional

---

## Orden de implementación sugerido

```
Fase 1 (1 día):
  1.1 → 1.2 → 1.3 → 1.4 → 1.5 → 1.6 → 1.7

Fase 2 (1 día):
  2.1 → 2.2 → 2.3 → 2.4 → 2.5

Fase 3 (1 día):
  3.1 → 3.2 → 3.3
```

## Checklist por archivo

- [ ] `<p-table>` envuelto en `<div class="hidden md:block">`
- [ ] `<app-data-view-mobile>` con data, globalFilterFields, dt
- [ ] `#listItemTemplate` con `<ili-list-item>` (sin ion-no-padding)
- [ ] Texto en `<p>` (no `<h3>`)
- [ ] `<ili-action-menu end>` como hijo directo de `<ili-list-item>`
- [ ] Botones usan prefijo `ili-*` (no `iw-*` ni `il-*`)
- [ ] Filtros movidos a `[customFilters]` slot
- [ ] Build pasa sin errores

## Verificación post-implementación

```bash
# Verificar que no hay headings en templates mobile
grep -rn '<h[1-6]' features/ --include='*.html' | grep -A5 'app-data-view-mobile'

# Verificar que no hay ion-no-padding en ili-list-item
grep -rn 'ili-list-item.*ion-no-padding' features/ --include='*.html'

# Verificar que ili-action-menu no está en div end
grep -rn '<div end' features/ --include='*.html' | while read line; do
  file=$(echo "$line" | cut -d: -f1)
  linenum=$(echo "$line" | cut -d: -f2)
  nextlines=$(sed -n "$((linenum)),$((linenum+15))p" "$file")
  if echo "$nextlines" | grep -q '<ili-action-menu'; then
    echo "VIOLATION: $line"
  fi
done

# Build
npx ng build
```
