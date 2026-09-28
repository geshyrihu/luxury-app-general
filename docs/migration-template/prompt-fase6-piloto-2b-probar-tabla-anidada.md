# Prompt 2b — Fase 6: probar de verdad la tabla anidada de `audit-entries`

Continúa `prompt-fase6-piloto-2-migrar-4-pantallas.md`, ya ejecutado y
auditado (diff correcto, `tsc --noEmit` limpio salvo los 4 archivos
corruptos preexistentes y ajenos a este trabajo). Falta un solo punto:
la tabla `<app-table>` anidada dentro de una fila expandida de
`audit-entries` nunca se llegó a ver — la página inicial no traía
ningún registro con `operationType === 'Update'` (es el único tipo que
muestra el botón de expandir).

## Qué hacer

En `/admin/audit-entries`, usa el filtro de operación que ya existe en
el caption (`custom-input-select-signal` con `[control]="filterOperationControl"`,
`optionLabel`/`optionValue` sobre `operationOptions`) para filtrar
explícitamente por **"Update"** y recargar (botón "Buscar"). Con eso
deberían aparecer filas con el botón de expandir habilitado.

1. Filtra por `Update`, confirma que aparecen filas con el ícono de
   expandir.
2. Haz clic en una para expandirla — confirma que la tabla anidada
   (`<app-table>` dentro de la fila) se ve con columnas "Propiedad /
   Valor Anterior / Valor Nuevo" y datos reales.
3. Colapsa esa fila y expande otra distinta — confirma que no queda
   nada "pegado" de la anterior (cada instancia de `<app-table>`
   anidada se monta/desmonta limpio con el `@if`).
4. Si es posible, expande dos filas seguidas sin colapsar la primera
   (si la UI lo permite) para confirmar que dos instancias de
   `<app-table>` anidadas al mismo tiempo no colisionan entre sí.
5. Captura de al menos un caso con la fila expandida mostrando la
   tabla anidada con datos.

## Listo cuando

- Captura real mostrando la tabla anidada con datos.
- Confirmación explícita de que expandir/colapsar funciona sin
  contenido cruzado entre filas.
- Si algo falla, repórtalo con el detalle exacto (qué esperabas, qué
  viste) — es la señal más importante de todo el lote piloto para
  decidir si `app-table` está listo para el rollout de las 337
  plantillas restantes.
