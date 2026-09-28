# Prompt 1c — Fase 6: revertir el encabezado/padding de `app-table` a la paridad visual actual (blanco, no azul marino)

Continúa `prompt-fase6-piloto-1b-fix-paginador-diagnostico.md`, ya
ejecutado y auditado (paginador con `«`/`»`/selector de registros
funcionando; diagnóstico de CSS confirmado). Con esa evidencia ya en
mano, la decisión es: **`app-table` debe verse igual al blanco/plano
actual de producción, no al azul marino que expuso sin querer.** Este
prompt es solo ese ajuste visual — no toques nada de lo demás.

## Contexto (para que no adivines por qué se pide esto)

El diagnóstico del prompt anterior (`verificacion-fase6-piloto-1b.md`)
midió con `getComputedStyle`/DevTools que, en producción con
`<p-table>` real, el encabezado da `background-color: rgb(255,255,255)`,
`padding: 0px`, `text-transform: none` — el reset genérico `td, th`
neutraliza lo que `.p-datatable-thead > tr > th` intentaba declarar, y
esa regla de color nunca llega a competir siquiera. Con `<app-table>`,
al no existir ya el conflicto, sí se aplican de lleno:

- `src/styles/custom/_custom-table.scss:114-126` (aprox., verifica el
  número real tras el renombrado del Prompt 1) — bloque
  `.app-table-thead > tr > th { background-color: var(--ds-primary);
  color: var(--ds-primary-text); ... }` y su `:hover` en
  `.app-table-sortable-column`.
- `src/styles/web/_prime-table.scss:29-38` (aprox.) — bloque
  `.app-table-thead > tr > th { background-color: var(--ds-bg-sunken);
  ...; font-weight: 600; text-transform: uppercase; letter-spacing:
  0.04em; padding: 0.75rem 1rem; ... }`.

## Qué hacer

**No borres las reglas.** Coméntalas o neutralízalas explícitamente
(deja constancia en el propio SCSS de por qué, una línea de comentario
basta — algo como `// Neutralizado 2026-09-15: paridad visual con el
blanco actual de producción, ver docs/migration-template/verificacion-fase6-piloto-1b.md`),
para que quien lea el archivo entienda que la intención de diseño
original (azul marino) sigue documentada, solo que deliberadamente no
se aplica todavía.

Concretamente, para los selectores `.app-table-thead > tr > th` (en
ambos archivos) y `.app-table-tbody > tr > td` si aplica un padding
equivalente:

1. Quita/comenta `background-color`, `color`, `font-weight`,
   `text-transform`, `letter-spacing` de ambos bloques — deja que el
   `<th>` herede el color de texto normal y el fondo transparente (el
   blanco de `.table` de Bootstrap).
2. **El padding no lo pongas en `0` literal** — la medición de `0px`
   en producción es sobre el `<th>` mismo, pero PrimeNG probablemente
   consigue el espaciado visual con un elemento interno (un wrapper de
   título de columna) que nuestro `<th>` no tiene. Poner `padding: 0`
   a secas casi seguro se va a ver amontonado, no igual al "before".
   En vez de eso: **compara visualmente contra
   `appsweb/angular/docs/migration-template/fase6-piloto-1b-bank-primeng.png`**
   (la captura real del "antes") ajustando el padding hasta que el
   espaciado se vea equivalente a simple vista — no persigas el
   número `0px` a ciegas.
3. Dejas intactas el resto de las reglas que no se identificaron como
   problema (radio de borde, sombra, hover de fila, `row-status-*`,
   `th-col-*`, paginador) — esas no se tocan en este prompt.

## Verificación

1. Repite el mismo banco de pruebas temporal de los prompts 1/1b
   (`bank-list-desktop.html` apuntando a `<app-table>`, sin dejarlo en
   el diff final).
2. Captura nueva del resultado y compárala lado a lado con
   `fase6-piloto-1b-bank-primeng.png` — deben verse equivalentes:
   mismo color de fondo de encabezado, mismo caso de texto (no
   mayúsculas), espaciado de fila comparable.
3. `npx tsc --noEmit` limpio.
4. Confirma que el resto de reglas de `_custom-table.scss`/
   `_prime-table.scss` (radio, sombra, hover, `row-status-*`,
   `th-col-*`, paginador) siguen sin cambios respecto al Prompt 1b —
   solo tocaste el bloque de color/tipografía/padding del header.

## Listo cuando

- Captura nueva del header de `app-table` visualmente indistinguible
  de `fase6-piloto-1b-bank-primeng.png` (adjunta ambas para comparar).
- Las reglas neutralizadas quedan comentadas en el SCSS (no borradas),
  con la nota de por qué.
- `git diff --stat` mostrando solo cambios en los 2 SCSS (nada de
  `table.ts` ni de features).
- Reporta el `git diff` real de las 2 hojas SCSS, no solo un resumen.
