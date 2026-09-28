# Verificación Fase 6 — Piloto 1c

Fecha: 2026-09-15  
Pantalla temporal: `/admin/banks`

## Resultado visual

Se probó temporalmente `bank-list-desktop` con `app-table` y se restauró después a `p-table`.

| Propiedad del primer `<th>` | Resultado final |
|---|---|
| `background-color` | `rgb(255, 255, 255)` |
| `color` | `rgb(26, 38, 52)` |
| `padding` | `4px 8px` |
| `font-weight` | `400` |
| `text-transform` | `none` |
| `letter-spacing` | `normal` |
| Celdas del cuerpo | `4px 8px` |

La captura nueva es visualmente equivalente al encabezado blanco/plano de producción:

![app-table con encabezado blanco](fase6-piloto-1c-bank-app-table-white.png)

Referencia anterior:

![PrimeNG de referencia](fase6-piloto-1b-bank-primeng.png)

## Cambios SCSS

Solo se ajustaron los bloques de encabezado y el padding equivalente de celdas:

- `src/styles/custom/_custom-table.scss`: se comentaron los colores azul marino del encabezado y sus variantes hover, conservando las reglas de borde e iconos.
- `src/styles/web/_prime-table.scss`: se comentaron color, peso, mayúsculas y letter-spacing originales; se neutralizó el estilo genérico de Bootstrap con fondo `var(--ds-bg-surface)`, color heredado, texto normal y padding `0.25rem 0.5rem`.
- Se conservaron radio, sombra, hover de filas, `row-status-*`, `th-col-*` y paginador.

## Validación

- `npx tsc --noEmit`: correcto.
- La pantalla temporal fue restaurada a PrimeNG.
- No se modificó `table.ts` ni una feature como parte de este ajuste.
- Los warnings de normalización CRLF/LF del archivo temporal de bancos son solo de finales de línea; su diff semántico está vacío.
