# Prompt Fase 7 — Paso 4: borrar 3 wrappers PrimeNG sin consumidores

Verificado (2026-09-16): estos 3 archivos son barrels puros
(`export * from "primeng/X"`, una sola línea, nunca migrados) y tienen
**0 consumidores** en `src/app/modules` (`grep -rl` sin resultados):

```
src/app/shared/ui/web/primeng-progressbar/primeng-progressbar.ts
src/app/shared/ui/web/primeng-breadcrumb/primeng-breadcrumb.ts
src/app/shared/ui/web/primeng-dataview/primeng-dataview.ts
```

## Acción

Borra las 3 carpetas completas:
```
src/app/shared/ui/web/primeng-progressbar/
src/app/shared/ui/web/primeng-breadcrumb/
src/app/shared/ui/web/primeng-dataview/
```

## No tocar

`src/app/shared/ui/web/primeng-custom-global-filter/` — aunque también
tiene 0 consumidores de negocio, **ya fue migrado a Bootstrap** (Prompt
22, 2026-09-16) y se conserva a propósito como pieza del catálogo de
design system (aparece en `ui-dictionary.ts` como entrada de
metadata). No es residuo de PrimeNG, no borrar.

## Verificación

- `grep -rn "primeng-progressbar\|primeng-breadcrumb\|primeng-dataview"
  src/app` debe devolver **0 resultados** tras el borrado (ni imports
  ni menciones en `ui-dictionary.ts` u otro catálogo).
- `npx tsc --noEmit`: no debe crecer el conteo de errores respecto al
  estado previo.
- `ng build` **redirigido a archivo completo (`> log 2>&1`), revisa el
  log entero con `grep -c ERROR`, no uses `tail`**.

## Listo cuando

- Las 3 carpetas ya no existen.
- `tsc`/build limpios (sin crecer respecto al estado previo).
- `primeng-custom-global-filter` intacto.
