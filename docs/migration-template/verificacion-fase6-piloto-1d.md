# Verificación Fase 6 — Piloto 1d

## Cambios aplicados

- `_custom-table.scss`: `border-color` del encabezado cambiado a `var(--ds-border)`.
- `app-icon.catalog.ts`: añadido `SortNeutral: "material-symbols-light:swap-vert"`.
- `table.ts`: añadido el estado neutro del ordenamiento y `.app-table-sorticon-neutral { opacity: 0.4; }`.

## Validación técnica

- `npx tsc --noEmit`: correcto.
- El banco temporal fue restaurado a `p-table`.
- El diff semántico del feature temporal queda vacío; solo se mantienen diferencias de finales de línea del archivo heredado.

## Verificación visual/interactiva

La prueba pudo confirmar en una ejecución autenticada:

- `background-color: rgb(255, 255, 255)`.
- `border-bottom-color: rgb(226, 232, 240)` y `border-bottom-width: 1px`.
- Al hacer clic en `Codigo`, apareció `material-symbols-light:arrow-upward` y la primera fila cambió de `138 ABC CAPITALX` a `--- INTERCAM`.

La primera ejecución quedó bloqueada por backend/cache. Después de detener los `ng serve` de esta tarea y limpiar `.angular/cache`, la verificación final fue exitosa:

- estado neutro: `3` iconos `swap-vert` visibles;
- borde: `rgb(226, 232, 240)`, `1px`;
- clic en `Codigo`: el primer registro cambió de `138 ABC CAPITALX` a `--- INTERCAM` y el icono cambió a `material-symbols-light:arrow-upward`;
- tras ordenar quedaron `2` iconos neutros en las otras columnas.

![Estado neutro](fase6-piloto-1d-bank-neutral.png)

![Estado ordenado](fase6-piloto-1d-bank-sorted.png)
