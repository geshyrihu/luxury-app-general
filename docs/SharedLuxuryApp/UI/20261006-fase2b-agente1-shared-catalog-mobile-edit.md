# Prompt para Agente externo 1 (Fase 2b) — reparar botones malformados mobile en catálogos compartidos

Eres implementador Angular. Corrige el selector inventado `lux-button-mobile-edit` en los listados **mobile** de `shared.luxuryapp` (hermanos mobile de los 8 archivos desktop que ya repararon en la tanda anterior, Fase 2, Agente 3). Este scope es módulo de negocio, no `src/app/shared/ui`.

> Nota de numeración: este prompt es de la **Fase 2b** (tanda nueva); cuando se mencione "Agente N de Fase 2" sin "2b", es la tanda anterior ya integrada en `main`, no este mismo prompt.

## Scope exclusivo

- `src/app/modules/shared.luxuryapp/catalogs/banks/mobile/bank-list-mobile.html`
- `src/app/modules/shared.luxuryapp/catalogs/cfdi-usage/mobile/cfdi-use-list-mobile.html`
- `src/app/modules/shared.luxuryapp/catalogs/document-catalog/mobile/document-catalog-list-mobile.html`
- `src/app/modules/shared.luxuryapp/catalogs/onboarding-checklist-options/mobile/onboarding-checklist-option-list-mobile.html`
- `src/app/modules/shared.luxuryapp/catalogs/payment-method/mobile/payment-method-list-mobile.html`
- `src/app/modules/shared.luxuryapp/catalogs/payment-type/mobile/payment-type-list-mobile.html`
- `src/app/modules/shared.luxuryapp/catalogs/recruitment-sources/mobile/recruitment-source-catalog-list-mobile.html`
- `src/app/modules/shared.luxuryapp/catalogs/units-of-measurement/mobile/unit-of-measurement-list-mobile.html`

## Trabajo

- El selector actual `<lux-button-mobile-edit ...>` no existe en el repo (solo existe `lux-button-mobile`, ver `src/app/shared/ui/buttons/mobile/button.ts`). Reemplázalo por `<lux-button-mobile kind="edit" ...>`, usando los inputs públicos reales de `ButtonMobile`.
- Verifica el `.ts` hermano de cada template para preservar el handler/evento real (`(clicked)`, navegación, etc.) y cualquier `label`/`color`/`disabled` ya presente.
- No inventes `displayMode` ni ningún input que no exista en `ButtonMobile`. Si el legacy no mostraba icon-only, no lo conviertas a icon-only.
- No toques las versiones desktop (ya reparadas) ni ningún otro botón de estos archivos fuera del de "editar".

Worktree aislado desde el `main` local actual (post Fase 2), solo estos 8 paths, sin staging global (`git add` con pathspec explícito). Reporta conteo de archivos/botones corregidos, build (`ng build`) y `npm run audit:ui`.

## Reporte de ejecución

Cuando termines, **escribe tu reporte aquí mismo, al final de este archivo**, debajo de este encabezado (no lo borres, agrégalo). Incluye: commit/branch/worktree usado, diff o antes/después por archivo, resultado de `ng build` y `npm run audit:ui`, y cualquier residual o duda encontrada fuera de tu scope.

## Reporte de ejecución

- **Commit:** `50c3ad3d8 fix(shared): repara botones edit mobile de catalogos`
- **Branch:** `fix/shared-catalog-mobile-edit`
- **Base:** `main` local `77bde2294`
- **Worktree:** `C:\Users\geshyrihu\AppData\Local\Temp\opencode\wt-mobile-catalogs`
- **Archivos corregidos:** 8 templates; 8 botones.
- **TS modificados:** ninguno. Los 8 `.ts` ya importaban `ButtonMobile` y exponían `edit`.

### Antes / después

- `catalogs/banks/mobile/bank-list-mobile.html`: `<lux-button-mobile-edit>` -> `<lux-button-mobile kind="edit">`; handler y label conservados; `[attr.aria-label]` migrado a input público `[ariaLabel]`.
- `catalogs/cfdi-usage/mobile/cfdi-use-list-mobile.html`: `<lux-button-mobile-edit>` -> `<lux-button-mobile kind="edit">`; handler y `label="Editar"` conservados.
- `catalogs/document-catalog/mobile/document-catalog-list-mobile.html`: `<lux-button-mobile-edit>` -> `<lux-button-mobile kind="edit">`; handler/title `Editar Documento` y label conservados.
- `catalogs/onboarding-checklist-options/mobile/onboarding-checklist-option-list-mobile.html`: `<lux-button-mobile-edit>` -> `<lux-button-mobile kind="edit">`; handler/title y label conservados.
- `catalogs/payment-method/mobile/payment-method-list-mobile.html`: `<lux-button-mobile-edit>` -> `<lux-button-mobile kind="edit">`; handler y label conservados.
- `catalogs/payment-type/mobile/payment-type-list-mobile.html`: `<lux-button-mobile-edit>` -> `<lux-button-mobile kind="edit">`; handler y label conservados.
- `catalogs/recruitment-sources/mobile/recruitment-source-catalog-list-mobile.html`: `<lux-button-mobile-edit>` -> `<lux-button-mobile kind="edit">`; handler/title `Editar Fuente` y label conservados.
- `catalogs/units-of-measurement/mobile/unit-of-measurement-list-mobile.html`: `<lux-button-mobile-edit>` -> `<lux-button-mobile kind="edit">`; handler y label conservados.

### Verificación

- `ng build` (ejecutado mediante `npm run build`): **exit 0**, `Application bundle generation complete`.
- `npm run audit:ui`: **verde**.
- `git diff --check`: **verde**.
- Residuales globales `lux-button-mobile-edit` bajo `src`: **0**.
- Dudas o residuos fuera de scope: **ninguno encontrado**.
