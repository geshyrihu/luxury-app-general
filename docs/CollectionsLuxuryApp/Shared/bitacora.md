# Bitácora — CollectionsLuxuryApp / Shared

> Registro cronológico de cambios reales aplicados (CONVENTIONS.md §4.9). Append-only.

## 2026-10-05 — Migración de botones legacy `shared/ui` (Fases 3 y 4)

**Fase/Plan relacionado:** `docs/SystemLuxuryApp/Shared/20261005-contrato-fase3-delete-confirm.md` y `docs/SystemLuxuryApp/Shared/20261005-catalogo-shared-ui-refactor.md`
**Ejecutado por:** Agente D (Fase 3 + Fase 4 residuales)

**Cambios aplicados (Frontend):**
- `native-collections/core`: `charge-templates`, `charge-types`, `late-fee-policies`, `members`, `property-fines`, `regulation-articles`.
- Eliminados `iw/ili-button-delete` → `lux-button-web` / `lux-button-mobile` con `ConfirmService` en el consumidor.
- Fase 4: sin botones `active-desactive` ni `tracking`; sin código muerto de botones; sin residuales `[routerLink]` de botones (los `routerLink` del módulo están sobre `<a>`).
- Specs de cancelación añadidos: `charge-template-list`, `charge-type-list`, `late-fee-policy-list`, `property-fine-list`, `regulation-article-list`; `member-list` ya cubría cancelación de delete y dar de baja.

**Desviaciones del plan original:** ninguna.

**Pruebas ejecutadas:**
- `npm run audit:ui` → OK.
- `npx vitest run --project unit` sobre `collections.luxuryapp` → verde.

**Pendientes / deuda generada:** ninguno en el alcance de botones legacy.
