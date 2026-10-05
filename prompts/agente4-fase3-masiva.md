# Prompt para Agente 4: Migración Masiva Fase 3 (Sensibles)

Eres el Agente 4. Tu misión es migrar los botones legacy destructivos (`delete`, `confirm`, `send-email`) a la nueva arquitectura.

## Reglas de Arquitectura Obligatorias
El Agente 1 ya definió el estándar exacto que debes seguir. Antes de tocar cualquier código, lee atentamente el contrato en:
`docs/SystemLuxuryApp/Shared/20261005-contrato-fase3-delete-confirm.md`

- **NO implementes alertas nativas en el UI compartido.**
- Debes usar `ConfirmService` en los consumidores (`.ts`) para envolver el evento destructivo si el legacy lo hacía automáticamente.
- Excluido de tu alcance: `active-desactive` (requiere manejo de estado, se aplaza a la Fase 4).

## Tareas

1. **Migración por Lotes (Archivos limpios primero)**:
   - Usa `grep` para buscar: `il-button-delete`, `iw-button-delete`, `il-button-confirm`, `iw-button-confirm`, `il-button-send-email`.
   - Agrúpalos por módulo (Operations, Recruitment, Accounting, etc.).
   - Migra módulo por módulo aplicando estrictamente las "recetas" descritas en el contrato del Agente 1.
   - Todo botón destructivo DEBE incluir la "prueba obligatoria de cancelación" mencionada en la guía. Si el usuario cancela, no se debe invocar el endpoint/borrado.

2. **Manejo de Specs**:
   - Si el archivo `.ts` tiene pruebas (`.spec.ts`), asegúrate de actualizar los mocks para incluir `ConfirmService` si fue inyectado.

## Reglas Estrictas
- Un agente por archivo (evita colisiones).
- Commits separados por módulo.
- Después de cada módulo, ejecuta `npm run audit:ui` y los specs involucrados. Si falla, revierte y arregla.
- NO modifiques la lógica de negocio subyacente. Solo el disparador de UI y la intercepción de la confirmación.