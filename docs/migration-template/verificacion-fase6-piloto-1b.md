# Verificación Fase 6 — Piloto 1b

Fecha: 2026-09-15  
Pantalla: `/admin/banks`  
Servidor: `ng serve` en `http://localhost:4200`

## Corrección del paginador

Se actualizó `appsweb/angular/src/app/shared/ui/web/table/table.ts` para:

- mantener un `rowsOverride` local y calcular `effectiveRows`;
- permitir cambiar registros por página sin escribir sobre el `input rows`;
- agregar navegación a primera (`«`) y última (`»`) página;
- emitir `{ first: 0, rows: newRows }` al cambiar el tamaño.

Verificación en vivo:

| Acción | Resultado |
|---|---|
| Estado inicial | 30 filas visibles, 8 controles del paginador incluyendo primera/última página |
| Cambiar a página 2 | Primera fila cambió de `138 ABC CAPITALX` a `000 BX+` |
| Cambiar registros por página a 50 | El selector quedó en `50` y se mostraron 50 filas |
| Ir a última página | La primera fila fue `036 INBURSA`; el botón de última página quedó deshabilitado |

![Paginador app-table](fase6-piloto-1b-bank-app-table-paginator.png)

## Diagnóstico visual del encabezado

Las mediciones se obtuvieron con `getComputedStyle` y las reglas coincidentes mediante CDP DevTools.

| Estado | `background-color` | `padding` | `text-transform` |
|---|---|---|---|
| Bootstrap (`app-table`) | `rgb(0, 49, 82)` (`--ds-primary`) | `12px 16px` | `uppercase` |

### Reglas ganadoras observadas

- `app-table`: `body .app-table .app-table-thead > tr > th` en `styles.css:2977` aporta `padding: 0.75rem 1rem` y `text-transform: uppercase`.
- `app-table`: `.custom-table.app-table .app-table-thead > tr > th, .custom-table .app-table .app-table-thead > tr > th` en `styles.css:22305` gana por especificidad y aporta `background-color: var(--ds-primary)`.
- Origen SCSS del encabezado de marca: `src/styles/custom/_custom-table.scss:114-117`.
- Origen SCSS de padding y transformación base: `src/styles/web/_prime-table.scss:29-38`.


![app-table después](fase6-piloto-1b-bank-app-table.png)

## Consola durante la prueba

No aparecieron errores de Angular, del paginador ni de `app-table`. El navegador registró solicitudes bloqueadas por el entorno (`net::ERR_NETWORK_ACCESS_DENIED`) y warnings `NG0913` por el tamaño intrínseco de imágenes del logo; son ruido externo a este cambio y no impidieron la interacción.

## Validación final

- `npx tsc --noEmit`: correcto.
- `git diff --check`: correcto; solo reportó avisos de normalización CRLF/LF en los SCSS existentes.
- No se modificó ningún SCSS en este prompt.
