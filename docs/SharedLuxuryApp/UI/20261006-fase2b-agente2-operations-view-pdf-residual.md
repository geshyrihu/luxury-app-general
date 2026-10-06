# Prompt para Agente externo 2 (Fase 2b) — reparar view-pdf malformado residual en Operations (web)

Eres implementador Angular. Repara el selector inventado `lux-button-web-view-pdf` en un archivo de Operations que quedó fuera del lote anterior del **Agente 1 de Fase 2** (tanda anterior, ya integrada en `main`; que ya migró 5 archivos hermanos al mismo bridge).

> Nota de numeración: este prompt es de la **Fase 2b** (tanda nueva); toda referencia a "Agente 1" en este texto es al Agente 1 de la Fase 2 original, no a un agente de esta tanda.

## Scope exclusivo

- `src/app/modules/operations.luxuryapp/manuals/library/financial-report/informe-financiero-list.html` (líneas ~14 y ~58, dos botones)
- `src/app/modules/operations.luxuryapp/manuals/library/financial-report/informe-financiero-list.ts` (únicamente el import/registro de `PdfViewerTrigger`, igual que hizo el Agente 1 de Fase 2 en los otros 5 `.ts`)

## Trabajo

- Reemplaza `<lux-button-web-view-pdf [url]="item.nameFileEstadoFinanciero" ... />` por `<lux-pdf-viewer-trigger [url]="item.nameFileEstadoFinanciero" ... />` (componente real en `src/app/shared/ui/web/pdf-viewer-trigger/pdf-viewer-trigger.ts`). Usa exactamente el mismo patrón de migración que el Agente 1 de Fase 2 aplicó en `templates-list-desktop.html`, `task-checklist-panel.html`, `incident-list-desktop.html`, `entrega-recepcion-cliente-desktop.html` y `contracts-policies-desktop.html` (ver sus diffs ya integrados en `main`).
- Preserva cualquier prop existente (`fileName`, `pdf="informe"` revisa si ese input existe realmente en `PdfViewerTrigger`; si no existe, no lo inventes, usa el equivalente real o quítalo si es basura heredada — verifica antes de decidir).
- Agrega el import de `PdfViewerTrigger` al array `imports` del componente; si `ButtonWeb` queda sin otro uso en el archivo, quítalo del import (evita NG8113), igual que hizo el Agente 1 de Fase 2.
- No toques ningún otro botón del archivo.

Worktree aislado desde el `main` local actual (post Fase 2), solo estos 2 paths. Verificación: `ng build` sin NG8001/NG8002/NG1010, `npm run audit:ui` verde, `git diff --check` limpio. Reporta antes/después de cada botón.

## Reporte de ejecución

Cuando termines, **escribe tu reporte aquí mismo, al final de este archivo**, debajo de este encabezado (no lo borres, agrégalo). Incluye: commit/branch/worktree usado, antes/después de cada botón, qué input hiciste con `pdf="informe"` (lo mantuviste/removiste/mapeaste y por qué), resultado de `ng build` y `npm run audit:ui`, y cualquier residual fuera de tu scope.

---

## Reporte de ejecución (Agente 2, Fase 2b)

**Commit:** `6258463fe` — `fix(operations): repara selector view-pdf malformado en informe financiero`
**Branch:** `fix/ops-informe-financiero-view-pdf`
**Worktree:** `C:\Users\geshyrihu\AppData\Local\Temp\opencode\wt-ops-pdf` (aislado desde `main` = `77bde2294`)
**Archivos (2):**
- `src/app/modules/operations.luxuryapp/manuals/library/financial-report/informe-financiero-list.html`
- `src/app/modules/operations.luxuryapp/manuals/library/financial-report/informe-financiero-list.ts`

### Antes / después por botón

**Botón 1 — desktop (`.d-none.d-md-block`, líneas ~14-17)**
- Antes:
  ```html
  <lux-button-web-view-pdf
    [url]="item.nameFileEstadoFinanciero"
    fileName="Informe Financiero"
  />
  ```
- Después:
  ```html
  <lux-pdf-viewer-trigger
    [url]="item.nameFileEstadoFinanciero"
    fileName="Informe Financiero"
  />
  ```
- Selector inventado (NG8001) → bridge real. `fileName` preservado.

**Botón 2 — mobile (`app-data-view-mobile` `#listItemTemplate`, líneas ~58-61)**
- Antes:
  ```html
  <lux-button-web-view-pdf
    [url]="item.nameFileEstadoFinanciero"
    pdf="informe"
  />
  ```
- Después:
  ```html
  <lux-pdf-viewer-trigger [url]="item.nameFileEstadoFinanciero" />
  ```

### `pdf="informe"` → **removido**

Verifiqué que `pdf` no existe en `PdfViewerTrigger` (inputs: `url`, `fileName`, `label`, `iconClass`, `displayMode`, `severity`, `variant`, `size`, `tooltip`, `ariaLabel`, `styleClass`, `disabled`, `loading`, `clicked`) ni en el legacy `iw/il-button-view-pdf` (solo `url` + `fileName`, confirmado en `3f5344850~1:src/app/shared/ui/buttons/{web-icon,web-label}/button-view-pdf.ts`). Era atributo inerte (basura heredada). No lo mapeé a `fileName` porque el botón mobile original no declaraba nombre de archivo y no quise inventar uno; `PdfViewerTrigger` ya cae a `"Documento"` como título. `[url]` preservado.

### `.ts`

- Añadido `import { PdfViewerTrigger } from "@ui/web/pdf-viewer-trigger/pdf-viewer-trigger";`.
- Registrado en `imports: [DataViewMobile, MobileListItem, LxIcon, PdfViewerTrigger]`.
- `ButtonWeb` **no** estaba importado en este archivo → no había import huérfano que retirar.

### Verificación

- `ng build`: **0 NG8001 / NG8002 / NG1010**; sin menciones a `informe-financiero`. El build aborta por artefacto del worktree ajeno al cambio: `ENOENT ... ngx-owl-carousel-o\...\owl.video.play.png` (el junction `node_modules` hace que el `url()` del CSS resuelva `cwd\D:\...\node_modules\...`). No es del código.
- `npm run audit:ui`: `✅ shared/ui: fronteras web/móvil/base respetadas.`
- `git diff --check`: limpio (exit 0). Hook `[fix-eol]`: `OK: sin CR repetido`.

### Residual fuera de scope

- Este archivo queda sin `lux-button-web-view-pdf`. Repo-wide siguen otros malformados ajenos a este prompt (p. ej. `-view-pdf` en operations `administrative-incidents`, `delivery-receptions`, `contracts-policies`, `task-checklist-panel`, `templates-list-desktop`; `displayMode="icon"-delete` en `shared/ui/inputs/web/input-file/input-file.ts:47`; catálogos `shared.luxuryapp` con selectores inventados `lux-button-mobile-*`). Ninguno tocado aquí.
- Nota: existe un worktree previo `luxuryapp-wt` (rama `fix/ops-view-pdf-malformed`, commit `895432711`) ya integrado en `main`, que cubrió 5 archivos hermanos pero **no** este; el presente commit cierra ese hueco.
