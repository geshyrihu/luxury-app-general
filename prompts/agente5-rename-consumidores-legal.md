# Agente 5 - Actualización de Consumidores (Legal, Purchases, Collections, Public)

**Misión:** Eres responsable de actualizar todas las plantillas y TypeScript en tus módulos asignados para reflejar los nuevos nombres de selectores e imports arquitectónicos de las Fases 1 y 2.

**Módulos asignados:**
- `appsweb/angular/src/app/modules/legal`
- `appsweb/angular/src/app/modules/purchases`
- `appsweb/angular/src/app/modules/collections`
- `appsweb/angular/src/app/modules/public`

## Tareas de Reemplazo

1. **Imports:**
   - Reemplazar `@ui/base/` por `@ui/core/`
   - Reemplazar `@ui/shared/` por `@ui/primitives/`

2. **Tags Adaptativos (`lx-`):**
   - Cambiar `<lx-...>` y `</lx-...>` por `<lux-...>` y `</lux-...>`.

3. **Tags Primitivos Especiales (sin sufijo web):**
   - Los siguientes 24 selectores cambian de `<app-X>` a `<lux-X>` (ej. `app-icon` -> `lux-icon`):
     `app-action-icons-group`, `app-activity-log`, `app-icon`, `app-approval-workflow`, `app-avatar-group`, `app-breakdown-list`, `app-gauge`, `app-inventory-level`, `app-kpi-card`, `app-lead-scoring`, `app-multiple-segmented-control`, `app-order-status`, `app-ranked-list`, `app-realtime-indicator`, `app-segmented-control`, `app-stat-card`, `app-tour`, `app-tristate-switch`, `app-custom-input-upload-pdf-signal`, `app-subir-pdf`, `app-validation-errors-custom-input`, `app-ds-chart`, `app-ai-chat-widget`, `app-image-analysis-dialog`.

4. **Tags Web Generales (con sufijo `-web`):**
   - CUALQUIER OTRO tag que empiece con `<app-` debe cambiar a `<lux-...-web>`.
   - No toques directivas de atributo.

**Restricciones:** No modifiques archivos fuera de tus módulos asignados. Crea commits atómicos por módulo.