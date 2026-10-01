# Prompt Fase 7 — Último detalle: `MenuItem` en `calendario-maestro-lista.ts`

Con el bug de `LxMenu.toggle()` ya corregido (Prompt 12), este archivo
ya no tiene ninguna razón para seguir importando desde
en los otros 6 archivos en Prompt 11.

```
src/app/modules/maintenance.luxuryapp/planificacin-de-mantenimiento/maintenance-calendar-master/calendario-maestro-lista.ts
```

```diff
+import { MenuItem } from "@core/interfaces/menu-item.interface";
```

## Verificación

- `npx tsc --noEmit`: 0 errores.
- `ng build` **redirigido a archivo completo (`> log 2>&1`), espera a
  que el proceso termine, revisa el log entero con `grep -c ERROR`**.

## Listo cuando

- El import redirigido, `tsc`/build limpios.
- Reporta el resultado de
  — debería dar solo 2 resultados (`conventions-viewer.service.ts`
  string de documentación, `catalog-web-extras.ts` tipos). Con eso,
  excepción funcional pendiente.
