# Prompt para Agente 4: Migración Masiva Fase 3 (Sensibles)

Eres el Agente 4. Tu misión es migrar los 220 botones legacy de alto riesgo (`delete`, `confirm`, `send-email`, `active-desactive`) usando EXCLUSIVAMENTE el patrón de diseño (PoC) que el Agente 1 acaba de establecer.

## Requisitos Previos (¡No avanzar sin esto!)
1. Revisa el último commit o el PR del Agente 1 donde migró exitosamente el primer botón `delete` o `confirm`.
2. Identifica si el patrón usa un wrapper semántico (ej. `lux-confirm-dialog`) o inyecta el `ConfirmationService` en el `.ts`.
3. ¡Debes usar ese mismo patrón exacto para el resto de la aplicación!

## Tareas

1. **Migración por Lotes (Archivos limpios primero)**:
   - Usa `grep` para buscar usos de `il-button-delete`, `iw-button-delete`, `il-button-confirm`, `iw-button-confirm`, `il-button-send-email`, y `il-button-active-desactive`.
   - Agrúpalos por módulo (Operations, Recruitment, Accounting, etc.).
   - Migra módulo por módulo. Asegúrate de no romper las confirmaciones destructivas. Si un botón legacy no confirmaba, el nuevo tampoco debe hacerlo (a menos que el nuevo componente lo fuerce).

2. **Migración de `active-desactive`**:
   - Este botón legacy alternaba booleanos o estados. Mígralo a `lux-button-web kind="active-desactive"`. Verifica el binding de datos (ej. `[state]="true"`).

## Reglas Estrictas
- Commits separados por módulo.
- Después de cada módulo, ejecuta `npm run audit:ui`. Si falla, revierte y arregla.
- NO modifiques la lógica de negocio subyacente. Solo el disparador de UI.