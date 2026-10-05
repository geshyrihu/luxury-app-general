# Prompt de Ejecución — Fase 2: `download` y `tracking`

Continúa migración desde commit `69fe56995` con lote pequeño y reversible.

## Alcance

- Migrar solo descargas con click directo y API equivalente a `ButtonWeb` o
  `ButtonMobile`.
- Priorizar `maintenance/report-consumption` y
  `operations/google-calendar/calendar/fundings` después de verificar contratos.
- No migrar controles que abren file picker, reciben nombre/URL/configuración propia
  ni componentes con flujo especial.
- Mantener fuera los 3 usos de tracking con `ticketId`, `badgeCount` o `clickTracking`.

## Método

1. Recolectar baseline por módulo y separar desktop/mobile.
2. Revisar inputs, outputs y evento real de cada candidato.
3. Migrar máximo 5-10 consumidores seguros.
4. Ejecutar `npm run audit:ui` y `git diff --check`.
5. Verificar que no queden imports legacy sin uso.

## Restricciones

- No tocar contratos de `shared/ui`.
- No migrar `delete`, `confirm`, `send-email`, PDF ni `customClick`.
- No incluir cambios concurrentes.
- No hacer commit ni push.

Entregar conteos antes/después, tabla de archivos, riesgos y evidencia de validación.
