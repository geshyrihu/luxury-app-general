# Agente 5 - QA Pass (Legal, Purchases, Collections, Public)

**Misión:** Tu dominio superó la recuperación de manera sobresaliente en la tanda anterior. Ahora realizarás un chequeo final de calidad (QA).

**Dominio ESTRICTO:**
- `appsweb/angular/src/app/modules/legal.luxuryapp`
- `appsweb/angular/src/app/modules/purchases.luxuryapp`
- `appsweb/angular/src/app/modules/collections.luxuryapp`
- `appsweb/angular/src/app/modules/public.luxuryapp`

## Tareas de Verificación

1. **Chequeo de Compilación Local:**
   - Asegúrate de que no haya ningún error de compilación (`NG8001`, `NG8002`, etc.) que apunte a archivos dentro de tu dominio.

2. **Chequeo de Tags Silenciosos:**
   - Hay tags rotos "silenciosamente" que se tragó el compilador pero no renderizan (ej. `app-sorticon` -> `lux-sorticon-web`, `app-action-menu` -> `lux-action-menu-web`, `app-select-button` -> `lux-select-button`).
   - Haz un rápido `git grep "<app-"` en tus módulos. Si encuentras componentes oficiales de `shared/ui` que todavía dicen `<app-X>`, actualízalos a su `lux-...` correspondiente.
   - NUNCA toques componentes propios del feature.

## Guardado y Commit Aislado
- Si hiciste cambios: `git add appsweb/angular/src/app/modules/legal.luxuryapp appsweb/angular/src/app/modules/purchases.luxuryapp appsweb/angular/src/app/modules/collections.luxuryapp appsweb/angular/src/app/modules/public.luxuryapp`
- Crea un commit: `fix(legal,purchases,collections,public): fix silencioso de tags faltantes`.
- Si tu dominio ya estaba 100% perfecto, simplemente reporta: "Sin cambios necesarios, dominio limpio."