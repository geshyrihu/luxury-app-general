# Prompt Fase 7 — Último detalle: `MenuItem` en `calendario-maestro-lista.ts`

Con el bug de `LxMenu.toggle()` ya corregido (Prompt 12), este archivo
ya no tiene ninguna razón para seguir importando desde
`@ui/web/primeng-api/primeng-api` — cierra el mismo cambio que se hizo
en los otros 6 archivos en Prompt 11.

```
src/app/modules/maintenance.luxuryapp/planificacin-de-mantenimiento/maintenance-calendar-master/calendario-maestro-lista.ts
```

```diff
-import { MenuItem } from "@ui/web/primeng-api/primeng-api";
+import { MenuItem } from "@core/interfaces/menu-item.interface";
```

## Verificación

- `grep -n "primeng" calendario-maestro-lista.ts` → 0 resultados.
- `npx tsc --noEmit`: 0 errores.
- `ng build` **redirigido a archivo completo (`> log 2>&1`), espera a
  que el proceso termine, revisa el log entero con `grep -c ERROR`**.

## Listo cuando

- El import redirigido, `tsc`/build limpios.
- Reporta el resultado de
  `grep -rn "@ui/web/primeng-api\|from ['\"]primeng/" src/app/modules --include="*.ts"`
  — debería dar solo 2 resultados (`conventions-viewer.service.ts`
  string de documentación, `catalog-web-extras.ts` tipos). Con eso,
  **`src/app/modules` queda 100% libre de PrimeNG real**, sin ninguna
  excepción funcional pendiente.
