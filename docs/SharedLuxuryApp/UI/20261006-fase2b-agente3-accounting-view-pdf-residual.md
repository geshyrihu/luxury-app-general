# Prompt para Agente externo 3 (Fase 2b) — reparar view-pdf malformado residual en Accounting (web)

Eres implementador Angular. Repara el selector inventado `lux-button-web-view-pdf` en un único archivo de Accounting, **fuera** de `budget-proposals/**` (esa carpeta sigue bloqueada por el dueño, Ing. Ricardo Marques; no la toques bajo ninguna circunstancia).

> Nota de numeración: este prompt es de la **Fase 2b** (tanda nueva); toda referencia a "Agente 1" en este texto es al Agente 1 de la Fase 2 original, no a un agente de esta tanda.

## Scope exclusivo

- `src/app/modules/accounting.luxuryapp/general-ledger/budget-proposals/budget-support-dialog.html` (línea ~93, un botón)
  - Nota: el archivo vive bajo la carpeta `budget-proposals/` pero **no es** `budget-rule-list.html` (el archivo bloqueado). Verifica el nombre exacto antes de editar: solo `budget-support-dialog.html` está autorizado. Si tienes cualquier duda sobre si un archivo es el bloqueado, detente y reporta en vez de editar.
  - `budget-support-dialog.ts` (únicamente el import/registro de `PdfViewerTrigger`, si aplica)

## Trabajo

- Reemplaza `<lux-button-web-view-pdf [url]="file.fileUrl" [fileName]="file.fileName" />` por `<lux-pdf-viewer-trigger [url]="file.fileUrl" [fileName]="file.fileName" />`, igual patrón que usó el Agente 1 de Fase 2 en Operations (ver diffs ya integrados en `main`: `templates-list-desktop.html`, etc.).
- Preserva el botón de eliminar que está justo después (`lux-button-web iconClass="material-symbols-light:delete" ...`), no lo toques.
- Agrega el import de `PdfViewerTrigger`; si `ButtonWeb` queda sin otro uso, quítalo del import.

Worktree aislado desde el `main` local actual (post Fase 2), solo estos 2 paths dentro de `budget-support-dialog.*`. Verificación: `ng build`, `npm run audit:ui`, `git diff --check`, y confirma explícitamente en el reporte que `git diff` sobre `budget-rule-list.html` y el resto de `budget-proposals/**` quedó vacío.

## Reporte de ejecución

### Ejecución 2026-10-06

- Branch/worktree: `main`, `appsweb/angular`; HEAD al iniciar: `77bde2294`.
- Commit nuevo: no creado.
- Antes: `<lux-button-web-view-pdf [url]="file.fileUrl" [fileName]="file.fileName" />`.
- Después: `<lux-pdf-viewer-trigger [url]="file.fileUrl" [fileName]="file.fileName" />`.
- `budget-support-dialog.ts`: agregado `PdfViewerTrigger`; `ButtonWeb` conservado porque sigue usándose en submit/eliminar.
- `budget-rule-list/budget-rule-list.html`: no tocado; `git diff` vacío.
- Resto de `budget-proposals/**`: no tocado; únicamente cambiaron `budget-support-dialog.html` y `budget-support-dialog.ts`.
- `ng build`: PASS.
- `npm run audit:ui`: PASS.
- `git diff --check`: PASS.

Cuando termines, **escribe tu reporte aquí mismo, al final de este archivo**, debajo de este encabezado (no lo borres, agrégalo). Incluye: commit/branch/worktree usado, antes/después del botón, confirmación explícita de que `budget-rule-list.html` y el resto de `budget-proposals/**` no se tocaron, resultado de `ng build` y `npm run audit:ui`.
