# Agente 4 - QA Pass (Recruitment & Maintenance)

**Misión:** Tu dominio superó la recuperación de manera sobresaliente en la tanda anterior. Ahora realizarás un chequeo final de calidad (QA).

**Dominio ESTRICTO:**
- `appsweb/angular/src/app/modules/recruitment.luxuryapp`
- `appsweb/angular/src/app/modules/maintenance.luxuryapp`

## Tareas de Verificación

1. **Chequeo de Compilación Local:**
   - Asegúrate de que no haya ningún error de compilación (`NG8001`, `NG8002`, etc.) que apunte a archivos dentro de tu dominio.

2. **Chequeo de Tags Silenciosos (Seguimiento que tú mismo sugeriste):**
   - Hay tags rotos "silenciosamente" que se tragó el compilador pero no renderizan.
   - Aplica estos reemplazos en tu dominio a los componentes de `shared/ui` que quedaron rezagados:
     - `<app-sorticon>` -> `<lux-sorticon-web>`
     - `<app-avatar>` -> `<lux-avatar-web>`
     - `<app-image>` -> `<lux-image-web>` (o `lux-image` dependiendo si el oficial está en adaptive o web)
     - `<app-action-menu>` -> `<lux-action-menu-web>`
     - `<app-calendar-range>` -> `<lux-calendar-range-web>`
     - `<app-custom-bar-chart>` -> `<lux-custom-bar-chart-web>` (revisa el catálogo real para el nombre correcto)
     - `<app-multi-axis-chart>` -> `<lux-multi-axis-chart-web>`
     - `<app-select-button>` -> `<lux-select-button-web>` (o `lux-select-button` si es primitivo)
   - Haz un rápido `git grep "<app-"` para localizar estos tags oficiales huérfanos y actualízalos.
   - NUNCA toques componentes propios del feature (ej. `app-data-view-mobile`).

## Guardado y Commit Aislado
- Si hiciste cambios: `git add appsweb/angular/src/app/modules/recruitment.luxuryapp appsweb/angular/src/app/modules/maintenance.luxuryapp`
- Crea un commit: `fix(recruitment,maintenance): fix silencioso de tags faltantes`.
- Si tu dominio ya estaba 100% perfecto, reporta: "Sin cambios necesarios, dominio limpio."