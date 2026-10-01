
Verificado (2026-09-16): estos 3 archivos son barrels puros
**0 consumidores** en `src/app/modules` (`grep -rl` sin resultados):

```
```

## Acción

Borra las 3 carpetas completas:
```
```

## No tocar

tiene 0 consumidores de negocio, **ya fue migrado a Bootstrap** (Prompt
22, 2026-09-16) y se conserva a propósito como pieza del catálogo de
design system (aparece en `ui-dictionary.ts` como entrada de

## Verificación

  src/app` debe devolver **0 resultados** tras el borrado (ni imports
  ni menciones en `ui-dictionary.ts` u otro catálogo).
- `npx tsc --noEmit`: no debe crecer el conteo de errores respecto al
  estado previo.
- `ng build` **redirigido a archivo completo (`> log 2>&1`), revisa el
  log entero con `grep -c ERROR`, no uses `tail`**.

## Listo cuando

- Las 3 carpetas ya no existen.
- `tsc`/build limpios (sin crecer respecto al estado previo).
