# Prompt 11 — Fase 6: módulo `admin.luxuryapp` (20 archivos)

Mismo procedimiento que los lotes anteriores. Este módulo es más
chico: 16 automáticos vía script, 0 manuales, 4 exclusiones
catalogadas.

## 1. Lote automático — 16 archivos vía script

```
node scripts/migrate-p-table-standard.mjs --write \
  src/app/modules/admin.luxuryapp/access-control/access-dashboard.html \
  src/app/modules/admin.luxuryapp/access-control/access-events.html \
  src/app/modules/admin.luxuryapp/access-control/access-point-list.html \
  src/app/modules/admin.luxuryapp/access-control/visitor-list.html \
  src/app/modules/admin.luxuryapp/analisis-registros/brevo/brevo-email-logs.html \
  src/app/modules/admin.luxuryapp/analisis-registros/user-activity-history/user-activity-history.html \
  src/app/modules/admin.luxuryapp/configuracion-correo/email-data/email-data-list.html \
  src/app/modules/admin.luxuryapp/configuracion-sistema/asamblea-checklist-template/asamblea-checklist-template-list.html \
  src/app/modules/admin.luxuryapp/herramientas-dev/catalog-component-ui/foundations/catalog-guia/catalog-guia.html \
  src/app/modules/admin.luxuryapp/reportes/access-history/bitacora-acceso-list.html \
  src/app/modules/admin.luxuryapp/reportes/customer-provider/mis-proveedores-list.html \
  src/app/modules/admin.luxuryapp/seguridad-permisos/approval-rules/approval-rules.html \
  src/app/modules/admin.luxuryapp/seguridad-permisos/customer-location/customer-location-list.html \
  src/app/modules/admin.luxuryapp/seguridad-permisos/customer-modul/customer-modul-list.html \
  src/app/modules/admin.luxuryapp/seguridad-permisos/customer/customer-list.html \
  src/app/modules/admin.luxuryapp/seguridad-permisos/user-accounts/user-account-list.html
```

Espera **16 archivos transformados, 0 exclusiones, 0 advertencias**
(ya validado con dry-run de esta misma lista).

**Nota sobre `approval-rules.html`**: tiene `pFrozenColumn`/
`frozenWidth` (columnas congeladas) — mismo caso ya visto y aceptado
en `presupuesto-propuesta.html` y otros 5 archivos de módulos
anteriores. Se migra igual con el script, sin excluirlo: solo pierde
el efecto de "pin" al hacer scroll horizontal, el resto de la tabla
sigue funcionando. No hace falta que hagas nada especial con este
archivo, el script ya lo procesa bien.

## 2. No tocar — 4 archivos con `rowGroupMode` (agrupación de filas, sin soporte en `AppTable`)

```
src/app/modules/admin.luxuryapp/configuracion-correo/customer-data-company/customer-data-company-list.html
src/app/modules/admin.luxuryapp/seguridad-permisos/application-role/roles-list.html
src/app/modules/admin.luxuryapp/seguridad-permisos/module-app/module-app-list.html
src/app/modules/admin.luxuryapp/seguridad-permisos/module-app-rol/module-app-rol-list.html
```

Mismo criterio decidido para `operations.luxuryapp`: `AppTable` no
implementa `rowGroupMode`/`groupRowsBy`, así que estos 4 quedan en
`p-table` hasta que se diseñe soporte de agrupación. No los toques.

## Verificación

- `npx tsc --noEmit` limpio.
- `ng build` sin errores nuevos (warnings `NG8113` de imports sin usar
  en plantilla son aceptables si aparecen, igual que en el lote de
  `operations.luxuryapp` — no bloquean).
- `git diff --stat`: 16 `.html` + 16 `.ts` = 32 archivos.
- Capturas reales (archivo en disco) de al menos 5 pantallas de
  carpetas distintas, incluyendo `approval-rules` (confirma que las
  columnas con `pFrozenColumn` siguen mostrando datos, solo sin el
  efecto de fijar al hacer scroll) y al menos una de
  `seguridad-permisos/`. Confirma ordenar y paginar en 2 de ellas.

## Listo cuando

- 16 archivos migrados y verificados.
- 4 archivos sin tocar, confirmado que siguen en `p-table`.
- `tsc`/build limpios, capturas reales adjuntas.
- Con esto, el rollout llega a **233 de 336 archivos** (217 previos +
  16 de este lote).
