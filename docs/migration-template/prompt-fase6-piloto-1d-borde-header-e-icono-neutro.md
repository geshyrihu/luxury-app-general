# Prompt 1d — Fase 6: restaurar borde del header y el ícono de orden neutro

Continúa `prompt-fase6-piloto-1c-revertir-header-a-blanco.md`, ya
ejecutado y auditado (header blanco confirmado). Comparando la captura
resultante (`fase6-piloto-1c-bank-app-table-white.png`) contra la
más, no cubiertas por el Prompt 1c porque no estaban en su alcance:

## 1. Falta la línea divisoria debajo del header

En la captura de `app-table`, la fila de encabezado no tiene borde
inferior — se nota comparado con las filas de datos, que sí lo tienen.
Causa: en `src/styles/custom/_custom-table.scss`, dentro del bloque
`.app-table-thead > tr > th` que se neutralizó en el Prompt 1c, quedó
sin comentar `border-color: var(--ds-border-on-dark, var(--ds-border));`
— ese primer token (`--ds-border-on-dark`) es
`rgba(255, 255, 255, 0.12)` (`src/styles/theme/_variables.scss:539`),
pensado para verse sobre fondo oscuro. Contra fondo blanco es casi
invisible.

**Cambio:** en ese mismo bloque, cambia esa línea a
`border-color: var(--ds-border);` (sin el fallback a `-on-dark`, ya
no aplica porque el fondo dejó de ser oscuro). No toques nada más del
bloque.

## 2. Falta el ícono neutro de "columna ordenable" en `app-sorticon`

En la captura "antes" cada encabezado ordenable muestra un ícono
neutro (↕) incluso sin estar ordenado todavía — es la señal visual de
"esta columna se puede ordenar, haz clic". El diseño original de
`AppSorticon` (Prompt 1) solo pinta un ícono cuando la columna está
activamente ordenada (flecha arriba/abajo) y no pinta nada en el
estado neutro — eso hace que las 3 columnas ordenables de la captura
de `app-table` se vean sin ningún indicador.

**Cambio en `shared/ui/shared/app-icon/app-icon.catalog.ts`:** agrega
una entrada nueva al catálogo (no existe ninguna hoy con este
propósito — se buscó `unfold`/`swap`/`height`/`sort` y solo existe
`SwapHorizontal`, que es horizontal, no sirve aquí):
```ts
SortNeutral: "material-symbols-light:swap-vert",
```
(mismo lugar/formato que las demás entradas del catálogo, p. ej.
`SortDescending` en la línea 470 — ponla junto a esa).

**Cambio en `shared/ui/web/table/table.ts`, componente `AppSorticon`:**
agrega la rama neutra. Reemplaza el `@if` actual (que no pinta nada
cuando la columna no está activa) para que en ese caso muestre el
ícono nuevo, con opacidad reducida para no competir visualmente con el
ícono activo (usa una clase, no un estilo inline):

```html
<span class="app-table-sorticon">
  @if (table.sortField() === field()) {
    @if (table.sortOrder() === 1) {
      <app-icon icon="material-symbols-light:arrow-upward" />
    } @else {
      <app-icon icon="material-symbols-light:arrow-downward" />
    }
  } @else {
    <app-icon icon="material-symbols-light:swap-vert" class="app-table-sorticon-neutral" />
  }
</span>
```

Agrega en el bloque `styles` del mismo archivo (junto a
`.app-table-sorticon`):
```scss
.app-table-sorticon-neutral {
  opacity: 0.4;
}
```

## Verificación

Mismo banco de pruebas temporal de los prompts anteriores
(`bank-list-desktop` → `app-table`, restaurado al final). Captura

1. La fila de encabezado debe tener la misma línea divisoria inferior
   que las filas de datos.
2. Las 3 columnas ordenables deben mostrar un ícono ↕-like tenue
   cuando no están ordenadas, y cambiar a flecha arriba/abajo llena al
   hacer clic — pruébalo interactivamente (clic en "Codigo", confirma
   que cambia de ícono y que las filas se reordenan).
3. `npx tsc --noEmit` limpio.

## Listo cuando

- Captura nueva visualmente equivalente a la referencia real en estas
  2 cosas puntuales (borde de header, ícono neutro visible).
- `git diff --stat`: solo `app-icon.catalog.ts`, `table.ts`,
  `_custom-table.scss` — nada de features.
- Reporta el diff real de los 3 archivos, no solo el resumen.
