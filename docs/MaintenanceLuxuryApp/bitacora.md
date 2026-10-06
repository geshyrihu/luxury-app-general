# Bitácora — MaintenanceLuxuryApp

> Registro cronológico append-only de cambios reales ejecutados sobre el módulo.
> Convención: `conventions/CONVENTIONS.md` §4.9.

## 2026-10-05 - Migración Fase 3 de botones legacy a `lux-button-web/mobile` + Fase 4 residuales

**Fase/Plan relacionado:** `docs/SystemLuxuryApp/Shared/20261005-contrato-fase3-delete-confirm.md` (PoC `d75a31630`).
**Ejecutado por:** Agente B (Front 2 / Fase 4).

**Cambios aplicados (Frontend):**
- **Fase 3 — Tier 1:** `item` (con `(clicked)`), `add`, `download` migrados a `lux-button-web`/`lux-button-mobile`.
- **Fase 3 — Tier 2:** 47 `delete` → `kind="delete" (clicked)` con confirmación movida al consumidor vía `ConfirmService` (25 contenedores, incluido el template inline de `mantenimientos-dialog.ts`). `confirm` → `kind="confirm" (clicked)` con `SwalService.confirm(...)` en `activos-documentos.ts` y `bitacora-mantenimiento.ts`.
- **Fase 4 — `active-desactive`:** `iw-button-active-desactive` de `equipos-list-desktop` migrado a `lux-button-web` con `icon` dinámico por estado (`lock`/`lock-open`) y `(clicked)="stateChange.emit(!active() ? 0 : 1)"`.
- **Fase 4 — residuales:** 2 `iw/ili-button-item` con `[routerLink]` (`piscina-list-desktop`, `piscina-list-mobile`) migrados a `lux-button-web`/`lux-button-mobile kind="item"` conservando `[routerLink]`.
- **Imports:** retirados todos los `Web/MobileButton*` legacy; agregados `ButtonWeb`/`ButtonMobile`.
- **Specs:** mock de `ConfirmService` + prueba de rama de cancelación en `task-group-category-list.spec.ts`.

**Desviaciones del plan original:** Los `item` con `[routerLink]`/sin evento se omitieron en Fase 3 (contrato §2) y se liquidaron en Fase 4.

**Pruebas ejecutadas:** `npm run audit:ui` ✅; `npm run build` ✅; suite de specs de maintenance ✅ (15 files / 31 tests).

**Pendientes / deuda generada:** Verificar en QA que `lux-button-mobile`/`lux-button-web` con `[routerLink]` navegue correctamente (el `routerLink` vive en el host y el click del botón interno hace bubbling).

## 2026-10-05 - Fase 4: limpieza de residuales `[routerLink]` y specs de cancelación

**Fase/Plan relacionado:** `prompts/agenteB-fase4-residuals.md`.
**Ejecutado por:** Agente B (Fase 4).

**Cambios aplicados (Frontend):**
- Sin botones legacy restantes en el módulo (`git grep` de selectores `iw/il/ii/ili-button-*` = 0).
- Sin código muerto de botones comentado (verificado; no había).
- Spec de cancelación agregada en `task-group-category-list.spec.ts`.

**Desviaciones del plan original:** N/A.
**Pruebas ejecutadas:** `npm run audit:ui` ✅; `npm run build` ✅.
**Pendientes / deuda generada:** N/A.
