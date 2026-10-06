# Bitácora — HumanResourcesLuxuryApp / Shared

> Registro cronológico de cambios reales aplicados (CONVENTIONS.md §4.9). Append-only.

## 2026-10-05 — Migración de botones legacy `shared/ui` (Fases 3 y 4)

**Fase/Plan relacionado:** `docs/SystemLuxuryApp/Shared/20261005-contrato-fase3-delete-confirm.md` y `docs/SystemLuxuryApp/Shared/20261005-catalogo-shared-ui-refactor.md`
**Ejecutado por:** Agente D (Fase 3 + Fase 4 residuales)

**Cambios aplicados (Frontend):**
- `evaluation`, `hr-admin`, `payroll`, `salary-projections`, `shared`, `time-off`.
- Eliminados los selectores legacy `iw/il/ili-button-{item,add,download,view-pdf,delete,confirm}` → `lux-button-web` / `lux-button-mobile`.
- `delete` → `ConfirmService`; `confirm` → `SwalService`; `view-pdf` → bridge `lux-pdf-viewer-trigger` (`generic-approval-panel`).
- Fase 4: sin botones `active-desactive` ni `tracking`; sin código muerto de botones; residual `[routerLink]` migrado en `federal-vacation-parameters.html` (`iw-button` → `lux-button-web [routerLink]`).
- Specs de cancelación añadidos: `lista-plantilla-evaluacion`, `lista-evaluacion-realizada`, `formulario-plantilla-evaluacion`, `incidencias-nomina`, `prestamos-empleado`, `tiempo-extra`, `periodos-nomina`, `salary-projections-list`, `federal-labor-law-parameters`, `federal-vacation-parameters`, `state-tax-parameters`, `mis-permisos-listado`, `mis-vacaciones-listado`; `incident-type-list` y `sanction-type-list` actualizados con mock de `ConfirmService`.

**Desviaciones del plan original:** ninguna.

**Pruebas ejecutadas:**
- `npm run audit:ui` → OK.
- `npx vitest run --project unit` sobre `human-resources.luxuryapp` → verde.

**Pendientes / deuda generada:** ninguno en el alcance de botones legacy.
