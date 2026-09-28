# Prompt 15 — Fase 6: módulo `management.luxuryapp` (7 archivos)

Módulo chico, sin casos manuales. 4 automáticos, 3 exclusiones
catalogadas.

## 1. Lote automático — 4 archivos vía script

```
node scripts/migrate-p-table-standard.mjs --write \
  src/app/modules/management.luxuryapp/juntas-comite/junta-comite-minutas/meeting-area-table/meeting-area-table.html \
  src/app/modules/management.luxuryapp/juntas-comite/junta-comite-minutas/minutas-list.html \
  src/app/modules/management.luxuryapp/juntas-comite/junta-comite-minutas/seguimiento-minutas.html \
  src/app/modules/management.luxuryapp/juntas-comite/juntas-mensuales-session/junta-mensual-session-checklist-dialog.html
```

Espera **4 archivos transformados, 0 exclusiones, 0 advertencias** (ya
validado con dry-run de esta misma lista).

## 2. No tocar — 3 archivos con atributos no soportados

- **2 con `pTemplate=`**:
  `juntas-comite/junta-comite-minutas/resumen-minuta.html`,
  `juntas-comite/juntas-mensuales-session/juntas-mensuales-session.html`
  (este último también tiene `selectionMode`, doble motivo de
  exclusión)
- **1 con `rowGroupMode`** (agrupación, mismo criterio ya
  establecido): `juntas-comite/junta-comite-minutas/meeting-detail-form.html`

## Verificación

- `npx tsc --noEmit` limpio.
- `ng build` sin errores nuevos (warnings `NG8113` aceptables).
- `git diff --stat`: 4 `.html` + 4 `.ts` = 8 archivos.
- Capturas reales de las 4 pantallas migradas. Confirma ordenar y
  paginar en al menos 2 de ellas.

## Listo cuando

- 4 archivos migrados y verificados.
- 3 archivos sin tocar, confirmado que siguen en `p-table`.
- `tsc`/build limpios, capturas reales adjuntas.
- Con esto, el rollout llega a **281 de 336 archivos** (277 previos +
  4 de este lote).
