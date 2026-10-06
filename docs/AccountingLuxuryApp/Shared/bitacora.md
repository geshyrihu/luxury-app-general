# Bitácora — AccountingLuxuryApp

> Registro cronológico de cambios reales aplicados al módulo `accounting.luxuryapp`.
> Append-only. Una entrada por sesión/fase de trabajo. Ver `CONVENTIONS.md` §4.9.

---

## 2026-10-06 — Migración de botones `shared/ui` (Fase 3 + Fase 4) y limpieza de código muerto en Accounting

**Fase/Plan relacionado:** `docs/SystemLuxuryApp/Shared/20261005-contrato-fase3-delete-confirm.md` (contrato) y `docs/SystemLuxuryApp/Shared/20261005-catalogo-shared-ui-refactor.md` (estado de fases).
**Ejecutado por:** agente de migración (Fase 4 cleanup).

**Cambios aplicados:**
- Frontend — `general-ledger/accounting-accounts/desktop/level-three-account-list-desktop.html`: se sustituyó el legacy `<iw-button-active-desactive [state] (stateChange)>` por `<lux-button-web kind="active-desactive" displayMode="icon" severity="secondary" variant="soft" [icon]="state() ? 'material-symbols-light:lock' : 'material-symbols-light:lock-open'" (clicked)="stateChange.emit(!state())" />`, preservando la semántica exacta (icono bloqueado/desbloqueado, `severity=secondary`, `variant=soft`, emite `!state`).
- Frontend — `general-ledger/accounting-accounts/desktop/level-three-account-list-desktop.ts`: se retiró el import y la entrada de `WebButtonIconActiveDesactive`; se mantuvo `ButtonWeb` (`@ui/buttons/web`) que ya estaba importado.
- Frontend — limpieza de código muerto: eliminados 13 archivos totalmente comentados (`// CODIGO MUERTO`) en `general-ledger/fixed-expense-catalogs/` (5) y `general-ledger/aspel-customer-company/` (8), más sus carpetas vacías. Verificado cero referencias activas: el routing (`routing/accounting.routing.ts`, `routing/compras.routing.ts`, `accounting.luxuryapp/accounting.routes.ts`, `purchases.luxuryapp/purchases.routes.ts`) apunta a las copias vivas bajo `accounting-catalogs/**`, no a `general-ledger/**`.
- Backend: sin cambios.
- Migraciones EF: ninguna.

**Desviaciones del plan original:** ninguna. Los archivos listados resultaron realmente sin referencias activas, por lo que se procedió al borrado íntegro.

**Pruebas ejecutadas:**
- `npm run audit:ui` — PASS.
- `git diff --check -- src/app/modules/accounting.luxuryapp` — sin errores de whitespace.
- Verificación estática de referencias (grep de basenames, clases y selectores) antes del borrado — sin referencias activas.

**Pendientes / deuda generada:**
- `general-ledger/budget-proposals/**` permanece **protegido** y sin tocar: contiene selectores legacy de Fase 3 (`iw/il-button-delete`) y `il-button-view-pdf` que deben migrarse en una fase posterior con su contrato state-aware.
- Persiste un legacy vivo `iw-button-edit` en `accounting-catalogs/fixed-expense-catalogs/desktop/catalogo-gastos-fijos-list-desktop.html` (el `delete` del mismo bloque ya fue migrado en Fase 3); pendiente de Fase 2/edit.
- No se ejecutó build (fuera de alcance de esta sesión); la validación real de plantillas es `audit:ui` + specs, dado que `strictTemplates` está en `false`.
