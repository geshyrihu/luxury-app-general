# Prompt para Agente 1: Build y Contrato Sensible (Fase 3)

Eres el Agente 1. Tu misión es desbloquear la compilación global y establecer el patrón de diseño para migraciones destructivas.

## Objetivos

1. **Desbloquear Build (`PropiedadesListDesktop`)**:
   - Localiza `appsweb/angular/src/app/modules/operations.luxuryapp/properties/desktop/propiedades-list-desktop.ts`.
   - Repara el error de dependencias o propiedades relacionadas con `tableRows` y `rowsPerPageOptions` que rompe `npm run build`.
   - Verifica compilación global exitosa.

2. **Diseñar Contrato `Delete` / `Confirm` (Prueba de Concepto)**:
   - Los legacy `<iw-button-delete>` o `<il-button-confirm>` incluían lógica de confirmación automática (PrimeNG ConfirmationService o similar).
   - El moderno `<lux-button-web kind="delete">` emite `(clicked)` pero NO confirma por sí solo.
   - Diseña el patrón de migración: ¿extender `ButtonWeb`? ¿O inyectar `ConfirmationService` en el `.ts` del consumidor?
   - Selecciona **UN (1)** consumidor de `delete` de la Fase 3, mígralo aplicando tu patrón, verifica `npm run audit:ui` y comportamiento.

## Entregables
- Commit atómico con el fix del build.
- Commit atómico con la prueba de concepto (PoC) de `delete`.
- Resumen en Markdown de cómo los demás agentes deberán migrar los 220 botones de Fase 3 restantes basándose en tu PoC.