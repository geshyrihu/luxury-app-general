# Bitácora — RecruitmentLuxuryApp

> Registro cronológico append-only de cambios reales ejecutados sobre el módulo.
> Convención: `conventions/CONVENTIONS.md` §4.9.

## 2026-10-05 - Migración Fase 3 de botones legacy a `lux-button-web/mobile` + Fase 4 residuales

**Fase/Plan relacionado:** `docs/SystemLuxuryApp/Shared/20261005-contrato-fase3-delete-confirm.md` (PoC `d75a31630`).
**Ejecutado por:** Agente B (Front 2 / Fase 4).

**Cambios aplicados (Frontend):**
- **Fase 3 — Tier 1:** `item` (con `(clicked)`), `add`, `download`, `view-pdf` migrados a `lux-button-web`/`lux-button-mobile`. `view-pdf` reemplazado por el bridge `lux-pdf-viewer-trigger` (`[url]`/`[fileName]`, `displayMode="icon"` para `iw-`, conservando `size`/`severity`/`variant`/`label`/`styleClass`/`ariaLabel`).
- **Fase 3 — Tier 2:** `delete` → `lux-button-web/mobile kind="delete" (clicked)` con la confirmación movida al consumidor vía `ConfirmService` (12 contenedores). `confirm` → `kind="confirm" (clicked)` con `SwalService.confirm(...)` replicado en el consumidor (status-request-dismissal, status-request-salary-modification, employee-document-list, hiring-document-validation, solicitud-alta-list).
- **Fase 4 — `active-desactive`:** los 3 usos (`iw-button-active-desactive`, `il-button-active-desactive`) migrados a `lux-button-web` mapeando `icon`/`label`/`severity` dinámicamente por estado: `equipos-list-desktop`, `former-employee-talent-pool`, `employee-list-desktop`.
- **Fase 4 — residuales:** 5 `iw-button-item` con `(click)`/sin evento (`employee-file-detail`, `employee-file-list-desktop`) migrados a `lux-button-web kind="item"`.
- **Imports:** retirados todos los `Web/MobileButton*` legacy de los `.ts`; agregados `ButtonWeb`/`ButtonMobile`/`PdfViewerTrigger`.
- **Specs:** mocks de `ConfirmService` y pruebas de la rama de cancelación (`confirm → false` ⇒ no se ejecuta la acción destructiva) en `candidate-list`, `employee-bank-data-list`, `employee-clinical-data-list`, `employee-emergency-contact-list`. Corregidos setups rotos preexistentes (ruta de import `../employees/...`, `sizeLg: this.dialogHandlerS.sizeXl`).

**Desviaciones del plan original:** Los `item` con `(click)`/`[routerLink]`/sin evento se habían omitido en Fase 3 según el contrato §2; Fase 4 los liquidó (los de `[routerLink]` de maintenance se migraron en su módulo). No se migró `tracking` (ya erradicado en fase previa) ni file pickers.

**Pruebas ejecutadas:** `npm run audit:ui` ✅; `npm run build` ✅; suite de specs de recruitment sin regresiones (baseline idéntico; los fallos restantes son preexistentes).

**Pendientes / deuda generada:** los `item` migrados desde `(click)` conservan el handler en `(clicked)`; verificar en QA que el bridge `lux-pdf-viewer-trigger` con `[routerLink]`/sin `url` no altere la navegación.

## 2026-10-05 - Fase 4: limpieza de residuales `[routerLink]` y specs de cancelación

**Fase/Plan relacionado:** `prompts/agenteB-fase4-residuals.md`.
**Ejecutado por:** Agente B (Fase 4).

**Cambios aplicados (Frontend):**
- Sin botones legacy restantes en el módulo (`git grep` de selectores `iw/il/ii/ili-button-*` = 0).
- Sin código muerto de botones comentado (verificado; no había).
- Specs de cancelación agregadas/verificadas (ver entrada anterior).

**Desviaciones del plan original:** N/A.
**Pruebas ejecutadas:** `npm run audit:ui` ✅; `npm run build` ✅.
**Pendientes / deuda generada:** N/A.
