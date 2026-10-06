# Bitácora — LegalLuxuryApp / Shared

> Registro cronológico de cambios reales aplicados (CONVENTIONS.md §4.9). Append-only.

## 2026-10-05 — Migración de botones legacy `shared/ui` (Fases 3 y 4)

**Fase/Plan relacionado:** `docs/SystemLuxuryApp/Shared/20261005-contrato-fase3-delete-confirm.md` y `docs/SystemLuxuryApp/Shared/20261005-catalogo-shared-ui-refactor.md`
**Ejecutado por:** Agente D (Fase 3 + Fase 4 residuales)

**Cambios aplicados (Frontend):**
- `employee-contracts`, `legal/custom-documents`, `legal/legal-matter`, `legal/legal-tickets`, `legal/meeting-minutes`, `vigilance-committees`.
- Eliminados los selectores legacy `iw/il/ili-button-{item,add,download,delete,send-email,view-pdf}` → `lux-button-web` / `lux-button-mobile`.
- `delete`: la confirmación se traslada al consumidor con `ConfirmService` (`delete`), `SwalService` (`send-email`). `view-pdf` migra al bridge `lux-pdf-viewer-trigger`.
- Fase 4: sin botones `active-desactive` ni `tracking` en el módulo; sin código muerto de botones; residual `[routerLink]` ya cubierto (no quedaban `-item` con routerLink en legal).
- Specs de cancelación añadidos: `addendum-template-list`, `contract-addendum-list`, `contract-template-list`, `work-contract-list`, `documento-personalizado-lista`, `asunto-legal-lista` (asunto + categoría), `comite-vigilancia-list` (delete + send-email).

**Desviaciones del plan original:** ninguna.

**Pruebas ejecutadas:**
- `npm run audit:ui` → OK.
- `npx vitest run --project unit` sobre `legal.luxuryapp` → verde.

**Pendientes / deuda generada:** ninguno en el alcance de botones legacy.
