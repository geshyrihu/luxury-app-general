# Prompt para Agente externo 2 — reparar botones malformados de notifications core

Eres implementador Angular. Corrige selectores `lux-button-... displayMode="icon"-delete` en las tres vistas de notificaciones del core. Tu tarea es conservación semántica, no refactor visual.

## Scope exclusivo

- `src/app/core/layout/employee-view/movil/notifications-list-mobile/notifications-list-mobile.html`
- `src/app/core/layout/employee-view/desktop/notifications-list-web/notifications-list-web.html`
- `src/app/core/layout/employee-view/desktop/notifications-gadget/notifications-gadget.html`

## Reglas

1. Lee el `.ts` asociado y verifica que botón tenga `ButtonWeb`/`ButtonMobile` importado y listado en `@Component.imports`.
2. Convierte sufijo a `kind="delete"` más `displayMode="icon"` preservando eventos, disabled, tooltip y estilo.
3. Añade/respeta `ariaLabel` explícito para cada botón de eliminar (usar contexto real de fila/notificación).
4. Si evento depende de confirmación, seguir handler actual; no emitir ejecución destructiva sin guard.

No editar shared UI ni otros paths. Worktree aislado desde `b01151c30`, stage explícito de los 3 archivos y commit solo si pasan revisión. Reportar diff, confirmaciones/eventos y búsquedas residuales.
