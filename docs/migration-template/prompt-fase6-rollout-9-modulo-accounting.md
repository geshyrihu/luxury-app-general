# Prompt 9 — Fase 6: rollout de `accounting.luxuryapp` (51 archivos)

Módulo financiero, el más grande hasta ahora. Mismo procedimiento ya
probado 5 veces. Exclusiones y fixes ya identificados de antemano:

## Excluidos por completo (6 archivos — no los toques, tienen funcionalidad que `app-table` no soporta todavía)

```
src/app/modules/accounting.luxuryapp/budgeting/expense-catalog-detail/gasto-fijo-servicios.html
src/app/modules/accounting.luxuryapp/general-ledger/expense-catalog-detail/gasto-fijo-servicios.html
src/app/modules/accounting.luxuryapp/fondeos-y-reporteo/funding/funding-detail.html
src/app/modules/accounting.luxuryapp/fondeos-y-reporteo/sat-funding/sat-funding-detail/sat-funding-detail.html
src/app/modules/accounting.luxuryapp/fondeos-y-reporteo/sat-funding/sat-funding-list/sat-funding-list.html
src/app/modules/accounting.luxuryapp/general-ledger/presupuesto-propuesta/budget-forecast-dialog.html
```

(los 2 `gasto-fijo-servicios.html` usan selección de filas con
checkbox; `funding-detail.html` usa reordenar columnas arrastrando;
los otros 3 combinan selección de filas con `p-sorticon` de cierre
separado — ya catalogados en `04-bitacora-cambios.md`, "Arranque real
de Fase 6")

## Fix manual puntual antes de correr el script (2 archivos)

Estos 2 **sí van en el lote** (el `<p-table>` en sí es estándar), pero
además tienen el mismo `virtualScrollItemSize` muerto ya visto varias
veces — quítalo antes o después de correr el codemod, como prefieras,
mismo criterio de siempre (sin `[virtualScroll]="true"` que lo
acompañe, nunca tuvo efecto):

```
src/app/modules/accounting.luxuryapp/ar/aspel-customer-empresa/aspel-customer-empresa-list.html
src/app/modules/accounting.luxuryapp/general-ledger/aspel-customer-empresa/aspel-customer-empresa-list.html
```

Estos 2 archivos también usan `<p-sorticon>` con cierre separado — eso
ya lo cubre el script automáticamente, no hace falta tocarlo a mano.

## Lote (51 archivos)

```
src/app/modules/accounting.luxuryapp/ar/aspel-customer-empresa/aspel-customer-empresa-list.html
src/app/modules/accounting.luxuryapp/ar/catalogo-gastos-fijos/catalogo-gasto-fijo-form.html
src/app/modules/accounting.luxuryapp/ar/catalogo-gastos-fijos/catalogo-gastos-fijos-list.html
src/app/modules/accounting.luxuryapp/ar/espejo-aspel/projected-expenses-list.html
src/app/modules/accounting.luxuryapp/budgeting/expense-catalog-budget/gasto-fijo-presupuesto.html
src/app/modules/accounting.luxuryapp/fondeos-y-reporteo/funding-accounting/funding-accounting-detail.html
src/app/modules/accounting.luxuryapp/fondeos-y-reporteo/funding-accounting/funding-accounting-list.html
src/app/modules/accounting.luxuryapp/fondeos-y-reporteo/funding/funding-group-files/funding-group-files.html
src/app/modules/accounting.luxuryapp/fondeos-y-reporteo/funding/funding-list.html
src/app/modules/accounting.luxuryapp/fondeos-y-reporteo/funding/funding-order-invoices/funding-order-invoices.html
src/app/modules/accounting.luxuryapp/fondeos-y-reporteo/funding/funding-purchase-detail.html
src/app/modules/accounting.luxuryapp/fondeos-y-reporteo/funding/funding-upload-invoices-modal.html
src/app/modules/accounting.luxuryapp/general-ledger/accounting-accounts/level-three-account-list.html
src/app/modules/accounting.luxuryapp/general-ledger/accounting-catalog/accounting-catalog.html
src/app/modules/accounting.luxuryapp/general-ledger/aspel-customer-empresa/aspel-customer-empresa-list.html
src/app/modules/accounting.luxuryapp/general-ledger/autitoria-cuentas-aspel/autitoria-cuentas-aspel.html
src/app/modules/accounting.luxuryapp/general-ledger/catalogo-gastos-fijos/catalogo-gasto-fijo-form.html
src/app/modules/accounting.luxuryapp/general-ledger/catalogo-gastos-fijos/catalogo-gastos-fijos-list.html
src/app/modules/accounting.luxuryapp/general-ledger/contabilidad-cliente/analisis-cobranza-cliente/analisis-cobranza-cliente.html
src/app/modules/accounting.luxuryapp/general-ledger/contabilidad-cliente/bancos-inversiones-cliente/bancos-inversiones-cliente.html
src/app/modules/accounting.luxuryapp/general-ledger/contabilidad-cliente/cedula-presupuestal-cliente/cedula-presupuestal-cliente.html
src/app/modules/accounting.luxuryapp/general-ledger/contabilidad-cliente/estado-resultados-cliente/estado-resultados-cliente.html
src/app/modules/accounting.luxuryapp/general-ledger/contabilidad-cliente/estado-resultados-v2-cliente/estado-resultados-v2-cliente.html
src/app/modules/accounting.luxuryapp/general-ledger/contabilidad-cliente/flujo-efectivo-cliente/flujo-efectivo-cliente.html
src/app/modules/accounting.luxuryapp/general-ledger/contabilidad-cliente/proyectos-aprobados-cliente/proyectos-aprobados-cliente.html
src/app/modules/accounting.luxuryapp/general-ledger/contabilidad-online/bancos-inversiones/bancos-inversiones.html
src/app/modules/accounting.luxuryapp/general-ledger/contabilidad-online/cedula-presupuestal/cedula-presupuestal.html
src/app/modules/accounting.luxuryapp/general-ledger/contabilidad-online/estado-resultados-v2/estado-resultados-v2.html
src/app/modules/accounting.luxuryapp/general-ledger/contabilidad-online/estado-resultados/estado-resultados.html
src/app/modules/accounting.luxuryapp/general-ledger/contabilidad-online/monthly-balance/balance-mensual.html
src/app/modules/accounting.luxuryapp/general-ledger/contabilidad-online/proyectos-aprobados/proyectos-aprobados.html
src/app/modules/accounting.luxuryapp/general-ledger/contabilidad-online/validacion-catalogo/catalog-replica.html
src/app/modules/accounting.luxuryapp/general-ledger/dynamic-reports/report-catalog/report-catalog.html
src/app/modules/accounting.luxuryapp/general-ledger/espejo-aspel-full/espejo-aspel-full.html
src/app/modules/accounting.luxuryapp/general-ledger/espejo-aspel/projected-expenses-list.html
src/app/modules/accounting.luxuryapp/general-ledger/estados-financieros/estado-financiero-list.html
src/app/modules/accounting.luxuryapp/general-ledger/expense-catalog-budget/gasto-fijo-presupuesto.html
src/app/modules/accounting.luxuryapp/general-ledger/funding-accounting/funding-accounting-detail.html
src/app/modules/accounting.luxuryapp/general-ledger/funding-accounting/funding-accounting-list.html
src/app/modules/accounting.luxuryapp/general-ledger/pendientes-minuta/cont-minuta-seguimientos.html
src/app/modules/accounting.luxuryapp/general-ledger/pendientes-minuta/minuta-pendientes-list.html
src/app/modules/accounting.luxuryapp/general-ledger/presupuesto-propuesta/budget-execution-details-modal.html
src/app/modules/accounting.luxuryapp/general-ledger/presupuesto-propuesta/budget-history-dialog.html
src/app/modules/accounting.luxuryapp/general-ledger/presupuesto-propuesta/budget-rule-list/budget-rule-list.html
src/app/modules/accounting.luxuryapp/general-ledger/presupuesto-propuesta/modal-fee-comparison-by-indiviso.ts
src/app/modules/accounting.luxuryapp/general-ledger/presupuesto-propuesta/presupuesto-propuesta.html
src/app/modules/accounting.luxuryapp/general-ledger/presupuesto-web-aspel/espejo-aspel-extraordinarios.html
src/app/modules/accounting.luxuryapp/general-ledger/presupuesto-web-aspel/espejo-aspel-presupuesto.html
src/app/modules/accounting.luxuryapp/general-ledger/presupuesto-web-aspel/purchase-history.html
src/app/modules/accounting.luxuryapp/general-ledger/reporte-envio-financieros/reporte-envio-financieros.html
src/app/modules/accounting.luxuryapp/general-ledger/resumen-financiero/financial-summary.html
```

Nota: varios de estos archivos tienen **2 `<p-table>` hermanos en el
mismo archivo** (uno cierra antes de que el otro abra, no están
anidados — ya verificado) — el script los trata bien, es una
sustitución global. Si encuentras algún caso de anidamiento real
(uno dentro del otro, como el único caso ya resuelto de
`audit-entries.html` en el piloto manual), detente y repórtalo antes
de tocar ese archivo específico.

## Procedimiento (idéntico a los lotes anteriores)

1. `node scripts/migrate-p-table-standard.mjs --dry-run <los 51 archivos>`.
2. Debería dar 51 transformados, 0 excluidos, 0 advertencias. Si sale
   distinto, o tu propio `grep -rl "<p-table" src/app/modules/accounting.luxuryapp`
   no coincide con este lote + los 6 excluidos, detente y repórtalo
   sin escribir.
3. Si calza, `--write`.
4. Aplica el fix manual de `virtualScrollItemSize` en los 2 archivos
   `aspel-customer-empresa-list.html`.
5. `npx tsc --noEmit` → limpio.
6. `ng build` sin errores de plantilla — no te quedes solo con `tsc`.
7. `grep -rn "TableModule\|primeng-table\|<p-table\b"` sobre el lote →
   0 resultados reales (ignora imports muertos sin `<p-table>` real).

## Verificación visual

Elige **8-10 pantallas** representativas cubriendo los sub-módulos más
grandes (`ar`, `fondeos-y-reporteo`, `general-ledger/contabilidad-*`,
`general-ledger/presupuesto-*`) — por ejemplo
`catalogo-gastos-fijos-list.html`, `funding-list.html`,
`bancos-inversiones.html`, `cedula-presupuestal.html`,
`estado-resultados.html`, `presupuesto-propuesta.html` (tiene 2
tablas, confirma que ambas se ven), `financial-summary.html`,
`aspel-customer-empresa-list.html` (confirma el fix de
virtualScrollItemSize). Capturas reales, completas (sin cortes a medio
cargar), guardadas como archivo
(`docs/migration-template/fase6-rollout-9-<nombre>.png`).

## Listo cuando

- Los 51 archivos migrados, diff coherente con el dry-run.
- Los 2 fixes de `virtualScrollItemSize` aplicados.
- Los 6 excluidos intactos.
- `tsc` y `ng build` limpios de errores de plantilla.
- 0 residuales reales de PrimeNG.
- 8-10 capturas reales completas.
- `git diff --stat` completo del lote.
- Cualquier hallazgo ajeno documentado con precisión — dado que es un
  módulo financiero, si ves algo que huela a dato incorrecto (no solo
  visual/técnico), repórtalo aparte con más detalle de lo usual.
