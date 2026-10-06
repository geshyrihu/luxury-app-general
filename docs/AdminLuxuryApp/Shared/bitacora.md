# Bitácora — AdminLuxuryApp

> Registro cronológico de cambios reales aplicados al módulo `admin.luxuryapp`.
> Append-only. Una entrada por sesión/fase de trabajo. Ver `CONVENTIONS.md` §4.9.

---

## 2026-10-06 — Migración de botones `shared/ui` (Fase 3 + Fase 4) y limpieza de código muerto en Admin

**Fase/Plan relacionado:** `docs/SystemLuxuryApp/Shared/20261005-contrato-fase3-delete-confirm.md` (contrato) y `docs/SystemLuxuryApp/Shared/20261005-catalogo-shared-ui-refactor.md` (estado de fases). Fase 3 ejecutada en el commit `a4a057012` (`refactor(admin): migrate legacy buttons to lux-button-web/mobile`).
**Ejecutado por:** agente de migración (Fase 4 cleanup).

**Cambios aplicados:**
- Frontend — `security-permissions/customer/desktop/customer-list-desktop.html` + `.ts`: legacy `<iw-button-active-desactive [state] (stateChange)>` → `<lux-button-web kind="active-desactive" displayMode="icon" severity="secondary" variant="soft" [icon]="state() ? 'material-symbols-light:lock' : 'material-symbols-light:lock-open'" (clicked)="sortChange.emit(!state())" />`. Se retiró el import/entrada de `WebButtonIconActiveDesactive` (se mantuvo `ButtonWeb`, ya importado).
- Frontend — `security-permissions/customer/mobile/customer-list-mobile.html` + `.ts`: misma migración a `lux-button-web`, conservando `fluid`; emite `sortChange.emit(!state())`. Se añadió `ButtonWeb` (`@ui/buttons/web`); se retiró `WebButtonIconActiveDesactive`.
- Frontend — `security-permissions/customer-modules/desktop/customer-modul-list-desktop.html` + `.ts`: legacy `iw-` → `lux-button-web` icono/soft/secondary, emite `selectActive.emit(!state())`. Se retiró `WebButtonIconActiveDesactive`; se añadió `ButtonWeb`.
- Frontend — `security-permissions/customer-modules/mobile/customer-modul-list-mobile.html` + `.ts`: misma migración a `lux-button-web`, conservando `fluid`; emite `selectActive.emit(!state())`. Se retiró `WebButtonIconActiveDesactive`; se añadió `ButtonWeb`.
- Frontend — `security-permissions/user-accounts/user-account-list.html` + `.ts`: legacy `il-button-active-desactive` (label) → `<lux-button-web kind="active-desactive" severity="secondary" variant="outline" icon="material-symbols-light:lock-open-outline" [label]="applicationUserState ? 'Inactivos' : 'Activos'" (clicked)="onSelectActive(!applicationUserState)" />`. Se retiró el import/entrada de `WebButtonLabelActiveDesactive` (se mantuvo `ButtonWeb`).
- Frontend — `security-permissions/user-accounts/user-account-list-mobile.html` + `.ts`: legacy `ili-button-active-desactive` (label) → `<lux-button-mobile kind="active-desactive" icon="material-symbols-light:lock-open-outline" [label]="active() ? 'Inactivos' : 'Activos'" (clicked)="activeChange.emit(!active())" />`. Se retiró el import/entrada de `MobileButtonLabelActiveDesactive` (se mantuvo `ButtonMobile`).
- Frontend — limpieza de código muerto: **sin hallazgos**. El grep de bloques legacy comentados (`<!--` con `-button-`, `// CODIGO MUERTO`, selectores `iw/il/ii/ili-button-`) y de archivos totalmente comentados en `admin.luxuryapp` (excluyendo `infrastructure/catalog-component-ui/**`) no encontró código muerto borrable. Las únicas apariciones legacy en comentarios son la muestra documental de `admin-hub/conventions-viewer/conventions-viewer.service.ts` (documentación, no se toca).
- Backend: sin cambios.
- Migraciones EF: ninguna.

**Semántica preservada:** los 6 tags `active-desactive` legacy expuestos en el contrato (§6, Fase 4) se migraron preservando icono, label, `severity` y `variant`, y emitiendo el estado invertido (`!state`) vía `(clicked)`, ya que `ButtonWeb/ButtonMobile` no modelan `state`/`stateChange`. `fluid` se conservó donde el legacy era web (`iw-`).

**Desviaciones del plan original:** ninguna. No hubo código muerto que eliminar en el alcance de Admin.

**Pruebas ejecutadas:**
- `npm run audit:ui` — PASS (`✅ shared/ui: fronteras web/móvil/base respetadas.`).
- `git diff --check -- src/app/modules/admin.luxuryapp` — sin errores de whitespace.
- Verificación estática de selectores: `git grep -E "<(iw|il|ii|ili)-button-active-desactive"` en `admin.luxuryapp` sin coincidencias fuera de la muestra documental de `conventions-viewer.service.ts`.

**Pendientes / deuda generada:**
- `infrastructure/catalog-component-ui/**` queda **excluido** de esta fase por decisión de alcance: contiene selectores legacy de demostración (`iw/il/ii/ili-button-*`) que son material de catálogo, no consumidores reales.
- La implementación legacy de los botones `active-desactive` (`web-icon`, `web-label`, `mobile-label`) permanece en `shared/ui` (aún tiene otros consumidores en el repo); no se borra.
- No se ejecutó build (fuera de alcance de esta sesión); la validación real de plantillas es `audit:ui` + specs, dado que `strictTemplates` está en `false`.
