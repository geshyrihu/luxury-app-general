
Auditoría (2026-09-16) verificó **archivo por archivo** (cruzando cada
selector/directiva real de ese módulo en la plantilla resuelta —
`.html` externo vía `templateUrl` o `template:` inline) que **109
`imports:`, pero **la plantilla nunca usa ese componente** — residuo
de la migración a Bootstrap donde se cambió el HTML pero no se limpió
el import.

Esto es **distinto** de Paso 2 (specs) y de Paso 1 (PrimeFlex/PrimeIcons)
(ver `04-bitacora-cambios.md`), no son parte de esta limpieza.

## Regla de edición (misma en los 109 archivos)

Para cada archivo de la lista de abajo:

   (el nombre exacto del identificador importado varía por archivo —
   ábrelo y verifícalo, no lo adivines).
2. Confirma tú mismo antes de borrar: `grep` en la plantilla resuelta
   (`.html` si hay `templateUrl`, o el `template:` inline) buscando el
   tag/directiva de ese módulo (ej. `<p-button`, `pButton`, `<p-tag`,
   `<p-message`, etc.) — si de verdad no aparece, borra el import y su
   entrada en el arreglo `imports:` del `@Component`. Si SÍ aparece,
   detente y repórtalo en vez de tocarlo (puede ser un falso negativo
   de la auditoría).
3. Cuidado con arreglos `imports:` en una sola línea (bug recurrente
   en este flujo) — borra solo el token, no la línea completa si hay
   otros imports en la misma línea.

## Lista de 109 archivos (agrupados por módulo wrapper)

**accordion**: (ninguno muerto — el único uso es real, no tocar)

```
src/app/modules/accounting.luxuryapp/general-ledger/dynamic-reports/report-builder/report-builder.ts
```

```
src/app/modules/operations.luxuryapp/task-engine/tasks/my-tasks/my-task-form.ts
src/app/modules/recruitment.luxuryapp/expediente-del-empleado/employees/employees/employee-list.ts
```

```
src/app/modules/accounting.luxuryapp/general-ledger/dynamic-reports/report-builder/report-builder.ts
src/app/modules/maintenance.luxuryapp/logs/tool-loan/tool-list.ts
```

```
src/app/modules/accounting.luxuryapp/general-ledger/contabilidad-online/ai-agent-contabilidad-online/ai-agent-contabilidad-online.ts
src/app/modules/accounting.luxuryapp/general-ledger/contabilidad-online/ai-agent-explicador-contabilidad-online/ai-agent-explicador-contabilidad-online.ts
src/app/modules/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-web-extras.ts
src/app/modules/admin.luxuryapp/herramientas-dev/catalog-component-ui/foundations/catalog-audit/catalog-audit.ts
src/app/modules/admin.luxuryapp/herramientas-dev/catalog-component-ui/patterns-layouts/catalog-layouts/catalog-layouts.ts
src/app/modules/collections.luxuryapp/cobranza-nativa/core/charge-templates/charge-template-form.ts
src/app/modules/collections.luxuryapp/cobranza-nativa/entry/cobranza-nativa-wrapper/cobranza-nativa-wrapper.ts
src/app/modules/collections.luxuryapp/cobranza-online/analysis/cobranza-online-analysis.ts
src/app/modules/collections.luxuryapp/cobranza-online/exclusions/cobranza-online-exclusions.ts
src/app/modules/collections.luxuryapp/cobranza-online/inspection/cobranza-online-inspection.ts
src/app/modules/collections.luxuryapp/cobranza-online/movimientos/cobranza-online-movimientos.ts
src/app/modules/management.luxuryapp/juntas-comite/junta-comite-minutas/minutas-list.ts
src/app/modules/management.luxuryapp/juntas-comite/presentacion-junta-comite/presentacion-junta-comite-form.ts
src/app/modules/operations.luxuryapp/manuals/biblioteca/manuals-and-processes/manuals-and-processes-list.ts
src/app/modules/supplier.luxuryapp/po/purchase-order/parcials/orden-compra-datos-auth-parcial.ts
src/app/modules/supplier.luxuryapp/po/purchase-order/parcials/orden-compra-datos-cotizacion.ts
src/app/modules/supplier.luxuryapp/po/purchase-order/parcials/orden-compra-datos-pago-parcial.ts
src/app/modules/supplier.luxuryapp/po/purchase-order/parcials/orden-compra-status-parcial.ts
```
**No tocar** estos 7 (uso real confirmado de `button`):
`accounting.luxuryapp/general-ledger/contabilidad-online/ai-agent/ai-agent.ts`,
`catalog-core-item/catalog-core-item.ts`, `catalog-web-item/catalog-web-item.ts`,
`catalog-layouts-item/catalog-layouts-item.ts`,
`catalog-patterns-item/catalog-patterns-item.ts`,
`manuals-and-processes-editor/manuals-and-processes-editor.ts`.

```
src/app/modules/purchases.luxuryapp/solicitudes-compras/solicitudes/solicitud-compra-presentacion.ts
```

```
src/app/modules/accounting.luxuryapp/general-ledger/presupuesto-propuesta/presupuesto-propuesta.ts
src/app/modules/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts
src/app/modules/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-web-extras.ts
src/app/modules/operations.luxuryapp/task-engine/recurring-tasks/templates/task-template-item-form/task-template-item-form.ts
```

```
src/app/modules/operations.luxuryapp/task-engine/tasks/my-tasks/my-requests-task.ts
```

```
src/app/modules/accounting.luxuryapp/fondeos-y-reporteo/sat-funding/sat-funding-detail/sat-funding-detail.ts
src/app/modules/admin.luxuryapp/herramientas-dev/catalog-component-ui/foundations/catalog-guia-item/catalog-guia-item.ts
```
**No tocar** (real): `catalog-web-item/catalog-web-item.ts`, `foundations/catalog-guia/catalog-guia.ts`.

```
src/app/modules/accounting.luxuryapp/general-ledger/presupuesto-propuesta/fee-comparison-by-fija.ts
src/app/modules/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-web-extras.ts
src/app/modules/admin.luxuryapp/herramientas-dev/catalog-component-ui/foundations/catalog-audit/catalog-audit.ts
src/app/modules/admin.luxuryapp/herramientas-dev/catalog-component-ui/foundations/catalog-guia-item/catalog-guia-item.ts
src/app/modules/admin.luxuryapp/herramientas-dev/catalog-component-ui/foundations/catalog-guia/catalog-guia.ts
src/app/modules/admin.luxuryapp/herramientas-dev/catalog-component-ui/patterns-layouts/catalog-layouts/catalog-layouts.ts
src/app/modules/admin.luxuryapp/herramientas-dev/catalog-component-ui/shared/tokens-colors/tokens-colors.ts
src/app/modules/purchases.luxuryapp/solicitudes-compras/comparativo/cuadro-comparativo-list.ts
```

```
src/app/modules/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-web-item/catalog-web-item.ts
```
(Ojo: este mismo archivo tiene uso REAL de otros módulos — `accordion`,
`button`, `datepicker`, `dialog`, `inputnumber`, `inputtext`,
`multiselect`, `popover`, `select`, `selectbutton`, `tabs`,
`toggleswitch` — **solo retira `floatlabel` e `iconfield` e `inputicon`**
de este archivo, deja el resto intacto.)

```
src/app/modules/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-web-item/catalog-web-item.ts
src/app/modules/operations.luxuryapp/dashboard/unified-pending-dashboard.ts
```

```
src/app/modules/accounting.luxuryapp/general-ledger/dynamic-reports/report-builder/report-builder.ts
src/app/modules/human-resources.luxuryapp/evaluaciones-de-desempeo/evaluation-template/formulario-plantilla-evaluacion.ts
```

```
src/app/modules/human-resources.luxuryapp/evaluaciones-de-desempeo/evaluation-template/formulario-plantilla-evaluacion.ts
```
**No tocar** (real): `dynamic-reports/report-builder/report-builder.ts` usa `inputgroupaddon` real aunque `inputgroup` esté muerto ahí — revisa cada uno por separado en ese archivo específico.

```
src/app/modules/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-web-item/catalog-web-item.ts
```

```
src/app/modules/supplier.luxuryapp/po/purchase-order/forms/orden-compra-detalle-add-producto.ts
```
**No tocar** (real): `catalog-web-item/catalog-web-item.ts`.

```
src/app/modules/accounting.luxuryapp/ar/catalogo-gastos-fijos/catalogo-gastos-fijos-list-moduls.ts
src/app/modules/accounting.luxuryapp/fondeos-y-reporteo/sat-funding/sat-funding-detail/sat-funding-invoice-edit-form.ts
src/app/modules/accounting.luxuryapp/general-ledger/catalogo-gastos-fijos/catalogo-gastos-fijos-list-moduls.ts
src/app/modules/accounting.luxuryapp/general-ledger/presupuesto-propuesta/budget-support-dialog.ts
src/app/modules/legal.luxuryapp/asuntos-legales-y-seguros/documento-personalizado/documento-personalizado-form.ts
src/app/modules/legal.luxuryapp/asuntos-legales-y-seguros/documento-personalizado/documento-personalizado-lista.ts
src/app/modules/maintenance.luxuryapp/reports-mantenance/maintenance-reports-list.ts
src/app/modules/operations.luxuryapp/dashboard/unified-pending-dashboard.ts
src/app/modules/operations.luxuryapp/field-service/service-order/ordenes-servicio-list.ts
src/app/modules/operations.luxuryapp/inventarios-y-almacn/product-entry/product-entry-form.ts
src/app/modules/operations.luxuryapp/templates/templates-list.ts
src/app/modules/operations.luxuryapp/work-position/work-position-form.ts
src/app/modules/recruitment.luxuryapp/candidates/former-employee-talent-pool/former-employee-talent-pool.ts
src/app/modules/recruitment.luxuryapp/employee-external/employee-external-form.ts
src/app/modules/supplier.luxuryapp/po/purchase-order/forms/orden-compra-status.ts
src/app/modules/supplier.luxuryapp/po/purchase-order/orden-compra-edit-presupusto-utilizado.ts
src/app/modules/supplier.luxuryapp/provider/employee-provider-form.ts
```
**No tocar** (real): `catalog-web-item/catalog-web-item.ts`,
`catalog-patterns-item/catalog-patterns-item.ts`,
`inventarios-y-almacn/product-exit/product-output-form.ts` (este
último usa `pInputText` de verdad, confirmado).

```
src/app/modules/maintenance.luxuryapp/planificacin-de-mantenimiento/maintenance-calendar-master/calendario-maestro-lista.ts
src/app/modules/operations.luxuryapp/task-engine/tasks/reports/task-operation-report.ts
```

```
src/app/modules/accounting.luxuryapp/ar/catalogo-gastos-fijos/catalogo-gastos-fijos-list-moduls.ts
src/app/modules/accounting.luxuryapp/general-ledger/catalogo-gastos-fijos/catalogo-gastos-fijos-list-moduls.ts
src/app/modules/accounting.luxuryapp/general-ledger/presupuesto-web-aspel/espejo-aspel-extraordinarios.ts
src/app/modules/accounting.luxuryapp/general-ledger/presupuesto-web-aspel/espejo-aspel-presupuesto.ts
src/app/modules/admin.luxuryapp/herramientas-dev/catalog-component-ui/foundations/catalog-audit/catalog-audit.ts
src/app/modules/admin.luxuryapp/herramientas-dev/catalog-component-ui/patterns-layouts/catalog-patterns-item/catalog-patterns-item.ts
src/app/modules/admin.luxuryapp/herramientas-dev/catalog-component-ui/shared/tokens-colors/tokens-colors.ts
src/app/modules/admin.luxuryapp/herramientas-dev/catalog-component-ui/shared/tokens-typography/tokens-typography.ts
src/app/modules/auth.luxuryapp/login/login.ts
src/app/modules/auth.luxuryapp/recovery-password/recover-password.ts
src/app/modules/auth.luxuryapp/reset-password/reset-password.ts
```

```
src/app/modules/operations.luxuryapp/supervision/supervision/resultado-general-evaluacion-areas/resultado-general-evaluacion-areas-detalle.ts
```
**No tocar** (real): `catalog-web-item/catalog-web-item.ts`.

```
src/app/modules/accounting.luxuryapp/general-ledger/dynamic-reports/report-builder/report-builder.ts
src/app/modules/admin.luxuryapp/herramientas-dev/catalog-component-ui/foundations/catalog-guia-item/catalog-guia-item.ts
src/app/modules/admin.luxuryapp/seguridad-permisos/module-app-rol/module-app-rol-list.ts
```

```
src/app/modules/maintenance.luxuryapp/logs/bitacoras/medidores/medidor-lectura-chart.ts
```

```
src/app/modules/accounting.luxuryapp/general-ledger/presupuesto-propuesta/account-modal-add.ts
```

```
src/app/modules/admin.luxuryapp/configuracion-correo/customer-data-company/customer-data-company-list.ts
src/app/modules/legal.luxuryapp/asuntos-legales-y-seguros/ticket-legal/ticket-legal-editar.ts
src/app/modules/operations.luxuryapp/announcements/announcement/announcement-admin-list.ts
```
**No tocar** (real): `catalog-web-item/catalog-web-item.ts`.

```
src/app/modules/admin.luxuryapp/configuracion-correo/customer-data-company/customer-data-company-list.ts
```
**No tocar** (real): `catalog-web-item/catalog-web-item.ts`, `button-catalog/button-catalog.ts`.

```
src/app/modules/accounting.luxuryapp/general-ledger/contabilidad-online/bancos-inversiones/bancos-inversiones.ts
src/app/modules/accounting.luxuryapp/general-ledger/contabilidad-online/fondo-reserva/fondo-reserva.ts
src/app/modules/accounting.luxuryapp/general-ledger/contabilidad-online/proyectos-aprobados/proyectos-aprobados.ts
src/app/modules/admin.luxuryapp/herramientas-dev/catalog-component-ui/foundations/catalog-guia-item/catalog-guia-item.ts
src/app/modules/supplier.luxuryapp/po/purchase-order/orden-compra.ts
```

```
src/app/modules/maintenance.luxuryapp/logs/tool-loan/tool-list.ts
src/app/modules/operations.luxuryapp/task-engine/tasks/reports/task-report-work-plan.ts
```

```
src/app/modules/accounting.luxuryapp/ar/catalogo-gastos-fijos/catalogo-gastos-fijos-list-moduls.ts
src/app/modules/accounting.luxuryapp/fondeos-y-reporteo/funding/modal-funding-upload-invoices.ts
src/app/modules/accounting.luxuryapp/general-ledger/catalogo-gastos-fijos/catalogo-gastos-fijos-list-moduls.ts
src/app/modules/accounting.luxuryapp/general-ledger/presupuesto-propuesta/modal-budget-execution-details.ts
src/app/modules/accounting.luxuryapp/general-ledger/presupuesto-web-aspel/espejo-aspel-extraordinarios.ts
src/app/modules/accounting.luxuryapp/general-ledger/reporte-envio-financieros/reporte-envio-financieros.ts
src/app/modules/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts
src/app/modules/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-web-extras.ts
src/app/modules/admin.luxuryapp/herramientas-dev/catalog-component-ui/foundations/catalog-audit/catalog-audit.ts
src/app/modules/admin.luxuryapp/herramientas-dev/catalog-component-ui/patterns-layouts/catalog-layouts-item/catalog-layouts-item.ts
src/app/modules/admin.luxuryapp/herramientas-dev/catalog-component-ui/shared/tokens-colors/tokens-colors.ts
src/app/modules/purchases.luxuryapp/solicitudes-compras/solicitudes/solicitud-compra-list.ts
```

```
src/app/modules/operations.luxuryapp/diagrams/diagram/diagram-editor/diagram-editor.ts
src/app/modules/operations.luxuryapp/manuals/biblioteca/manuals-and-processes/manual-flowchart-editor/manual-flowchart-editor.ts
```

```
src/app/modules/admin.luxuryapp/herramientas-dev/catalog-component-ui/foundations/catalog-guia-item/catalog-guia-item.ts
```

## No incluidos en esta limpieza (dejar tal cual)

  fuera de alcance — es el bloqueo estructural de Paso 5
  (`ConfirmDialog` global), no lo toques aquí.
  `warehouse-stock-add.ts`): ya catalogado como correcto, no tocar.
  paso aparte junto con sus barrels.

## Verificación

- `npx tsc --noEmit`: no debe crecer el conteo de errores respecto al
  estado previo (ignora los 3 errores preexistentes ajenos en
  `work-positions-for-edit.component.ts`, no relacionados).
- `ng build` **redirigido a archivo completo (`> log 2>&1`), revisa el
  log entero con `grep -c ERROR`, no uses `tail`**.
- No debería cambiar nada visualmente (son imports sin efecto en el
  render) — si tienes dudas en algún archivo específico, toma captura
  antes/después.

## Listo cuando

- Los 109 imports muertos retirados, agrupados y verificados como se
  listó arriba.
- Los "no tocar" explícitos permanecen intactos.
- `tsc`/build no empeoraron.
- Reporta cualquier caso donde el grep de verificación (paso 2 de la
  regla de edición) SÍ encontró uso real pese a estar en esta lista —
  no lo toques, repórtalo aparte.
