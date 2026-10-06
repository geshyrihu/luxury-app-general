# Agente 2 - QA Pass (Accounting & Admin)

**Misión:** Tu dominio superó la recuperación de manera sobresaliente en la tanda anterior. Ahora realizarás un chequeo final de calidad (QA).

**Dominio ESTRICTO:**
- `appsweb/angular/src/app/modules/accounting.luxuryapp`
- `appsweb/angular/src/app/modules/admin.luxuryapp`

## Tareas de Verificación

1. **Chequeo de Compilación Local:**
   - Asegúrate de que no haya ningún error de compilación (`NG8001`, `NG8002`, etc.) que apunte a archivos dentro de tu dominio.
   - Si por casualidad se filtró algún `<app-paginator>` o `<app-report-header>`, corrígelo a su equivalente oficial de UI (`lux-...` o `lux-...-web`).

2. **Chequeo de Tags Silenciosos:**
   - Como reportó el Agente 4, hay tags rotos "silenciosamente" que se tragó el compilador pero no renderizan (ej. `app-sorticon` -> `lux-sorticon-web`, `app-action-menu` -> `lux-action-menu-web`, `app-select-button` -> `lux-select-button`).
   - Haz un rápido `git grep "<app-"` en tus módulos. Si encuentras componentes oficiales de `shared/ui` que todavía dicen `<app-X>`, actualízalos a su `lux-...` correspondiente.
   - NUNCA toques componentes propios del feature.

## Guardado y Commit Aislado
- Si hiciste cambios: `git add appsweb/angular/src/app/modules/accounting.luxuryapp appsweb/angular/src/app/modules/admin.luxuryapp`
- Crea un commit: `fix(accounting,admin): fix silencioso de tags faltantes`.
- Si tu dominio ya estaba 100% perfecto, simplemente reporta: "Sin cambios necesarios, dominio limpio."