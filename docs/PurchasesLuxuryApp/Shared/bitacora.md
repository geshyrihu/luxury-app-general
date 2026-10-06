# Bitácora — PurchasesLuxuryApp / Shared

> Registro cronológico de cambios reales aplicados (CONVENTIONS.md §4.9). Append-only.

## 2026-10-05 — Migración de botones legacy `shared/ui` (Fases 3 y 4)

**Fase/Plan relacionado:** `docs/SystemLuxuryApp/Shared/20261005-contrato-fase3-delete-confirm.md` y `docs/SystemLuxuryApp/Shared/20261005-catalogo-shared-ui-refactor.md`
**Ejecutado por:** Agente D (Fase 3 + Fase 4 residuales)

**Cambios aplicados (Frontend):**
- `products`, `purchase-orders/purchase-order`, `purchase-requests`.
- Eliminados los selectores legacy `iw/il/ili-button-{item,view-pdf,delete}` → `lux-button-web` / `lux-button-mobile`.
- `delete` → `ConfirmService`; `view-pdf` → bridge `lux-pdf-viewer-trigger` (comparison y presentación).
- Fase 4: sin botones `active-desactive` ni `tracking`; sin código muerto de botones; residual `[routerLink]` de `orden-compra.html` migrado a `lux-button-web [routerLink]`.
- Specs de cancelación añadidos: `solicitud-compra-list`, `orden-compra-list`, `orden-compra` (producto + presupuesto), `orden-compra-factura-form`, `payment-voucher-modal`, `solicitud-compra-detalle`; `productos-list` actualizado.
- Fix de spec preexistente: `orden-compra.service.spec.ts` importaba `../http/services/api-response.service` (ruta inexistente) → `@core/http/services/api-response.service`.

**Desviaciones del plan original:** ninguna.

**Pruebas ejecutadas:**
- `npm run audit:ui` → OK.
- `npx vitest run --project unit` sobre `purchases.luxuryapp` → verde.

**Pendientes / deuda generada:** ninguno en el alcance de botones legacy.
