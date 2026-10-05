# Prompt de Ejecución — Fase 1: cierre de excepciones

Trabaja únicamente sobre consumidores de botones legacy de bajo riesgo que quedaron
documentados después del commit `69fe56995`.

## Alcance

- Revisar el template Operations que usa `(click)` en lugar de `(clicked)`.
- Revisar los 9 usos del catálogo/demo Admin.
- Revisar el snippet sin evento en `conventions`/viewer.
- Revisar los 8 botones Management mobile que conservan `ButtonWeb`.

## Reglas

- No tocar `shared/ui`.
- No convertir `delete`, `confirm`, `send-email`, `tracking` ni acciones con payload.
- No forzar `ButtonMobile` donde el contrato mobile no sea equivalente.
- Preservar separación desktop/mobile, `displayMode`, severidad, variante, tooltip,
  aria-label y eventos.
- Si un caso no tiene equivalencia segura, dejarlo documentado como excepción.
- No incluir cambios concurrentes.

## Verificación

1. Medir cada caso antes de editar.
2. Ejecutar `npm run audit:ui`.
3. Ejecutar `git diff --check`.
4. Buscar referencias legacy residuales en los archivos revisados.
5. Entregar tabla archivo:línea, cambio, evento conservado y excepciones.

No hacer commit ni push. Reportar evidencia real y cambios pendientes.
