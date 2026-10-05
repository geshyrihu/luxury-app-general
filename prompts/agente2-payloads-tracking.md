# Prompt para Agente 2: Tracking, QR y Payloads (Fase 2)

Eres el Agente 2. Tu misión es migrar botones legacy que cargan payloads especiales (Tracking, descargas por ID, File Pickers).

## Objetivos

1. **Migración de Tracking**:
   - Botones legacy: `<iw-button-tracking [badgeCount]="X" [ticketId]="Y" (clickTracking)="..."/>`.
   - El botón moderno `lux-button-web` hereda de `BaseButton`, el cual **no** tiene soporte nativo para `badgeCount`.
   - Propuesta: Extiende `BaseButton` o `ButtonWeb` para soportar `badge` de manera nativa, O implementa el badge en el template del consumidor.
   - Aplica el patrón a los 3 casos documentados (ej: `ticket-legal-lista-desktop.html`).

2. **Migración de File Pickers**:
   - Legacy: Ocultaba un `<input type="file">` accionado vía ref (`fileInput.click()`).
   - Mígralo usando `<lux-button-web kind="custom" iconClass="material-symbols-light:upload">` para abrir el picker nativo. Aplícalo a los inventarios de Operations (humo, hidrante, estación manual).

3. **Migración de Payload QR y IDs**:
   - Mueve eventos como `(clicked)="downloadQr.emit(item)"` a `lux-button-web` asegurando que el tipo del evento emitido en el output principal respete el tipado.

## Verificación
- Cero usos de `iw-button-tracking` y `il-button-tracking`.
- Pasa `npm run audit:ui` y `npm run build`.
- Commits atómicos (uno por tema: Tracking, Pickers, QR).