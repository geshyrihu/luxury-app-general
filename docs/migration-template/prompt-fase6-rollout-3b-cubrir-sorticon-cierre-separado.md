# Prompt 3b — Fase 6: extender el codemod para `<p-sorticon>` con cierre separado

Continúa `prompt-fase6-rollout-3-codemod-piloto-script.md`. El dry-run
anterior quedó auditado y correcto: el script (`scripts/migrate-p-table-standard.mjs`)
hace reemplazos quirúrgicos por regex (verificado leyendo el código
fuente, no solo el reporte), y excluyó correctamente 2 archivos en vez
de adivinar. Uno de esos 2 (`committee-cobranza-web.html`) no está
realmente roto — usa una forma válida y común de `<p-sorticon>` que el
alcance original no contempló: cierre separado
(`<p-sorticon field="X"></p-sorticon>` en vez de
`<p-sorticon field="X" />`). Se buscó en todo `src/app/modules/**` y
hay **11 archivos** con esta forma (ninguno superpuesto con los 9 que
ya usan `pTemplate=`, ninguno con la variante `[field]` con binding y
cierre separado — solo `field="literal"`).

## Cambio en el script

En `replaceHtml()` de `scripts/migrate-p-table-standard.mjs`:

1. Quita la exclusión `<p-sorticon\b[^>]*>\s*<\/p-sorticon>` — ya no
   es un patrón desconocido, ahora se soporta.
2. Agrega el reemplazo correspondiente (después de los dos que ya
   existen para `<p-sorticon field="` y `<p-sorticon [field]="`):
   ```js
   .replace(/<p-sorticon\s+field="([^"]*)"\s*>\s*<\/p-sorticon>/g, '<app-sorticon field="$1" />')
   ```
   (normaliza a autocerrado — no hace falta preservar la forma abierta,
   es más simple y consistente con el resto del repo). No hace falta
   una variante `[field]` con cierre separado — no existe ningún caso
   real, confirmado.
3. **Deja intacta** la exclusión de `<p-sorticon\s*\/\s*>` (sin
   `field`, el caso de `product-modal-add.html`) — ese sigue siendo
   markup muerto que no se debe migrar automáticamente.

## Verificación

1. Vuelve a correr `--dry-run` sobre el mismo lote de 9 archivos del
   Prompt 3 **más** `committee-cobranza-web.html` (10 en total). Ahora
   deberían salir **8 transformados** (los 7 de antes + este) y
   **1 excluido** (solo `juntas-mensuales-backfill.html`, por
   `pTemplate`).
2. Revisa a mano el diff de `committee-cobranza-web.html` en el
   reporte nuevo — confirma que los 6 `<p-sorticon field="...">...</p-sorticon>`
   quedaron como `<app-sorticon field="..." />` autocerrado, y que
   `pSortableColumn`/`<p-table>` también se migraron igual que en los
   demás.
3. `node --check` sobre el script modificado.
4. `git status --short` sobre los 10 archivos de prueba: debe seguir
   sin ninguno modificado (`--dry-run`, no se escribe nada todavía).

## Listo cuando

- Script actualizado, reporte nuevo con 8 transformados / 1 excluido.
- `committee-cobranza-web.html` con las 6 conversiones de `p-sorticon`
  correctas en el diff.
- Nada escrito en disco todavía.

No hace falta tocar los otros 10 archivos ya reportados del Prompt 3
(su diff no cambia) — repórtalos igual dentro del mismo archivo de
salida para tener todo junto antes de que yo autorice la primera
escritura real.
