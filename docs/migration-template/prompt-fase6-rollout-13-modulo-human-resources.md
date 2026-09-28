# Prompt 13 — Fase 6: módulo `human-resources.luxuryapp` (20 archivos)

Mismo procedimiento de siempre. Lote simple: 19 automáticos, 0
manuales, 1 exclusión.

## 1. Lote automático — 19 archivos vía script

```
node scripts/migrate-p-table-standard.mjs --write \
  src/app/modules/human-resources.luxuryapp/chekador-empleados/chekador-list.html \
  src/app/modules/human-resources.luxuryapp/evaluaciones-de-desempeo/evaluation-template/lista-plantilla-evaluacion.html \
  src/app/modules/human-resources.luxuryapp/evaluaciones-de-desempeo/evaluation-template/performance-evaluation/lista-evaluacion-realizada.html \
  src/app/modules/human-resources.luxuryapp/expediente-del-empleado/recursos-humanos/nomina/incidencias-nomina/incidencias-nomina.html \
  src/app/modules/human-resources.luxuryapp/expediente-del-empleado/recursos-humanos/nomina/nomina-detalle/nomina-detalle.html \
  src/app/modules/human-resources.luxuryapp/expediente-del-empleado/recursos-humanos/nomina/nominas/nominas.html \
  src/app/modules/human-resources.luxuryapp/expediente-del-empleado/recursos-humanos/nomina/periodos-nomina/modal-dias-no-habiles/modal-dias-no-habiles.html \
  src/app/modules/human-resources.luxuryapp/expediente-del-empleado/recursos-humanos/nomina/periodos-nomina/periodos-nomina.html \
  src/app/modules/human-resources.luxuryapp/expediente-del-empleado/recursos-humanos/nomina/prestamos-empleado/modal-prestamo-detalle/modal-prestamo-detalle.html \
  src/app/modules/human-resources.luxuryapp/expediente-del-empleado/recursos-humanos/nomina/prestamos-empleado/prestamos-empleado.html \
  src/app/modules/human-resources.luxuryapp/expediente-del-empleado/recursos-humanos/nomina/tiempo-extra/tiempo-extra.html \
  src/app/modules/human-resources.luxuryapp/recursos-humanos-admin/incident-type-list/incident-type-list.html \
  src/app/modules/human-resources.luxuryapp/recursos-humanos-admin/sanction-type-list/sanction-type-list.html \
  src/app/modules/human-resources.luxuryapp/time-off/admin-vacaciones-balance/admin-vacaciones-balance.html \
  src/app/modules/human-resources.luxuryapp/time-off/historial-solicitudes/solicitudes-historial.html \
  src/app/modules/human-resources.luxuryapp/time-off/leave-request/mis-permisos-listado.html \
  src/app/modules/human-resources.luxuryapp/time-off/my-vacation-requests/mis-vacaciones-listado.html \
  src/app/modules/human-resources.luxuryapp/time-off/vacation-balance-admin/vacaciones-admin-auditoria.html \
  src/app/modules/human-resources.luxuryapp/time-off/vacation-balance-admin/vacaciones-saldo.html
```

Espera **19 archivos transformados, 0 exclusiones, 0 advertencias**
(ya validado con dry-run de esta misma lista). 2 de los 19 tienen
`p-sorticon` de cierre separado
(`lista-plantilla-evaluacion.html`,
`solicitudes-historial.html`) — el script ya sabe normalizarlos, no
requiere nada especial de tu parte.

## 2. No tocar — 1 archivo con `selectionMode` (selección de filas, sin soporte en `AppTable`)

```
src/app/modules/human-resources.luxuryapp/time-off/past-vacations/vacaciones-pasadas-registro.html
```

Mismo criterio ya establecido para selección de filas: queda en
`p-table` hasta que se diseñe soporte en `AppTable`. No lo toques.

## Verificación

- `npx tsc --noEmit` limpio.
- `ng build` sin errores nuevos (warnings `NG8113` aceptables, igual
  que en lotes anteriores).
- `git diff --stat`: 19 `.html` + 19 `.ts` = 38 archivos.
- Capturas reales (archivo en disco) de al menos 5 pantallas de
  carpetas distintas, incluyendo alguna de `nomina/` y alguna de
  `time-off/`. Confirma ordenar y paginar en 2 de ellas.

## Listo cuando

- 19 archivos migrados y verificados.
- 1 archivo sin tocar, confirmado que sigue en `p-table`.
- `tsc`/build limpios, capturas reales adjuntas.
- Con esto, el rollout llega a **272 de 336 archivos** (253 previos +
  19 de este lote).
