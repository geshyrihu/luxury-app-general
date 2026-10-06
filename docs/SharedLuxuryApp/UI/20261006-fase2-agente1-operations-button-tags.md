# Prompt para Agente externo 1 — reparar botones malformados en Operations

Eres implementador Angular senior. Corrige únicamente usos en Operations donde migración mecánica dejó sufijo de acción pegado a `displayMode`, por ejemplo `<lux-button-web displayMode="icon"-view-pdf>`.

## Base y objetivo

- Repo Angular: `D:\repos\luxuryapp-api\appsweb\angular`, base `b01151c30`.
- Los selectores ButtonWeb reales son `lux-button-web`; acciones se expresan mediante input `kind`, según `buttons/web/button.ts`.
- Corrige silenciosa semántica/API; no hagas reemplazo global.

## Scope exclusivo

- `src/app/modules/operations.luxuryapp/templates/desktop/templates-list-desktop.html`
- `src/app/modules/operations.luxuryapp/task/tasks/task-message/task-checklist-panel/task-checklist-panel.html`
- `src/app/modules/operations.luxuryapp/administrative-incidents/incident/desktop/incident-list-desktop.html`
- `src/app/modules/operations.luxuryapp/delivery-receptions/client-delivery-reception/desktop/entrega-recepcion-cliente-desktop.html`
- `src/app/modules/operations.luxuryapp/reports/contracts-policies/desktop/contracts-policies-desktop.html`

## Instrucciones

1. Verifica cada selector malformado con su uso original y hermano `.ts`.
2. Mapea sufijo de acción a `kind="..."` y deja `displayMode="icon"` como input independiente. Preserva bindings, CSS, URL/nombre y callback.
3. `view-pdf` debe usar `lux-pdf-viewer-trigger` si requiere abrir viewer; inspecciona su API real y conserva inputs/eventos. No lo conviertas a botón decorativo.
4. Icon-only debe conservar/añadir nombre accesible apoyado por label/`ariaLabel` sin cambiar intención.
5. Si encuentras `(confirmed)` o una acción destructiva cuya confirmación no está clara, no la conviertas a click directo: revisa consumidor y reporta bloqueo.

## Límites y entrega

- No editar TS salvo que sea necesario para conservar confirmación; en ese caso detén y solicita ampliación de scope.
- No modificar `shared/ui`, otros módulos ni archivos no listados; no `git add .`.
- Trabajar en worktree aislado desde `b01151c30`; commit solo con paths autorizados.
- Entregar listado antes/después, conteo, diff/commit, búsquedas residuales exactas y cualquier evento/prop sin equivalencia.
