# Prompt 20 — Fase 6: rollout de `[reorderableColumns]`, 7 archivos

Decisión del usuario: **no se construye** reordenar columnas por
drag-and-drop en `AppTable` — en los 7 archivos el atributo es solo
`[reorderableColumns]="true"` sin `(onColReorder)` ni persistencia en
ningún caso, es decir, nunca guardaba el orden en ningún lado. Se
acepta la pérdida de esa comodidad visual, mismo criterio que columnas
congeladas.

**Importante — no es un caso más de "atributo inerte que no rompe
nada"**: `[reorderableColumns]="true"` es un *binding* (con
corchetes), y ya confirmamos en el Prompt 17 (con `[(selection)]`/
`[rowHover]`) que los bindings con corchetes a inputs que no existen
en `AppTable` **sí generan error real `NG8002` en `ng build`**, a
diferencia de un atributo plano sin corchetes. Por eso este prompt
pide quitar la línea explícitamente, no dejarla para que el build la
descubra.

## Paso 1 — quitar `[reorderableColumns]="true"` a mano, en los 7 archivos

```
src/app/modules/accounting.luxuryapp/fondeos-y-reporteo/funding/funding-detail.html
src/app/modules/operations.luxuryapp/custom-documents/custom-document/asambleas-list.html
src/app/modules/operations.luxuryapp/custom-documents/custom-document/reglamentos-list.html
src/app/modules/operations.luxuryapp/custom-documents/custom-document/special-document-list.html
src/app/modules/operations.luxuryapp/task-engine/recurring-tasks/templates/task-template-items/task-template-items.html
src/app/modules/recruitment.luxuryapp/employee-document/employee-document-list.html
src/app/modules/shared.luxuryapp/catalogos-generales/document-catalog/document-catalog-list.html
```

En cada uno, borra la línea `[reorderableColumns]="true"` (una sola
línea por archivo, dentro de la apertura `<p-table ...>`).

## Paso 2 — correr el script normal sobre los 7

```
node scripts/migrate-p-table-standard.mjs --write \
  src/app/modules/accounting.luxuryapp/fondeos-y-reporteo/funding/funding-detail.html \
  src/app/modules/operations.luxuryapp/custom-documents/custom-document/asambleas-list.html \
  src/app/modules/operations.luxuryapp/custom-documents/custom-document/reglamentos-list.html \
  src/app/modules/operations.luxuryapp/custom-documents/custom-document/special-document-list.html \
  src/app/modules/operations.luxuryapp/task-engine/recurring-tasks/templates/task-template-items/task-template-items.html \
  src/app/modules/recruitment.luxuryapp/employee-document/employee-document-list.html \
  src/app/modules/shared.luxuryapp/catalogos-generales/document-catalog/document-catalog-list.html
```

Espera **7 archivos transformados, 0 exclusiones, 0 advertencias** (ya
validado con dry-run de esta misma lista, antes de quitar el
atributo — el script no lo revisa, así que no cambia el resultado).

## Verificación

- `npx tsc --noEmit` limpio.
- **`ng build` sin ningún `NG8002`** — esto es lo que hay que
  confirmar explícitamente esta vez, no solo "sin errores nuevos".
- `git diff --stat`: 7 `.html` + 7 `.ts` = 14 archivos.
- Capturas reales de las 7 pantallas, confirmando que las columnas se
  ven bien (ya no se pueden arrastrar, eso es esperado y aceptado).

## Listo cuando

- 7 archivos migrados, verificados, `ng build` limpio de `NG8002`.
- `tsc`/build limpios.
- Con esto, el rollout llega a **327 de 336 archivos** (320 previos +
  7 de este lote). Quedaría solo selección de filas (8) y columnas
  congeladas (7, ya migradas sin función) — con eso terminaría todo
  el trabajo de Fase 6 salvo esa última categoría.
