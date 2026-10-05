# Prompt de Ejecución — Fase 5: catálogo y demo

Audita y migra ejemplos de `catalog-component-ui` y demos Admin sin mezclarlos con
consumidores productivos.

## Alcance

- Localizar los 9 usos legacy de Edit identificados en catálogo/demo Admin.
- Confirmar si cada uso es ejemplo ejecutable, fixture, snippet o código productivo.
- Migrar solo ejemplos con equivalencia clara a `ButtonWeb`/`ButtonMobile`.
- Actualizar documentación o diccionario únicamente cuando la evidencia confirme que
  el ejemplo debe mostrar la API moderna.

## No hacer

- No eliminar variantes legacy de `shared/ui`.
- No tocar confirmación, delete, tracking, PDF ni acciones especiales.
- No cambiar contratos públicos sin aprobación separada.
- No incluir logs, screenshots, credenciales ni artefactos de browser.

## Verificación

1. Registrar inventario archivo:línea y clasificación del uso.
2. Migrar lote cerrado y conservar comportamiento del ejemplo.
3. Ejecutar `npm run audit:ui` y `git diff --check`.
4. Verificar que el catálogo no documente selectores o imports obsoletos.
5. Entregar tabla de migrados, excluidos y razones.

No hacer commit ni push. Separar explícitamente cualquier cambio concurrente.
