# 🧭 Bitácora — Refactor estructura Desktop / Mobile

> Última actualización: **2026-10-04**

Patrón (referencia: `shared.luxuryapp/catalogs/banks`):

```
{modulo}/
├── {x}-list.ts / .html        contenedor (datos + @if platformS.isMobile())
├── {x}-form.*                 formulario/dialogo compartido
├── interfaces/
├── desktop/{x}-list-desktop.ts/.html   vista web (lux-table)
└── mobile/{x}-list-mobile.ts/.html     vista movil (app-data-view-mobile)
```

**Criterio de candidato:** listado con vista móvil inline (`app-data-view-mobile`) y/o tabla responsive (`d-none d-md-block`) en el mismo template.

**Leyenda:** ✅ aplica · · no aplica

| Estado | Total |
|---|:---:|
| ✅ Refactorizado | **146** |
| ⏳ Pendiente | **17** |
| ⛔ Omitido / no candidato | **49** |
| **Total** | **212** |

---

| # | Módulo | Dominio | ✅ Refactorizado | ⏳ Pendiente | ⛔ Omitido | Nota |
|:---:|---|:---:|:---:|:---:|:---:|---|
| 1 | `accounting-catalogs/aspel-customer-company/aspel-customer-empresa-list.html` | accounting | · | ✅ | · |  |
| 2 | `accounting-catalogs/aspel-mirror/projected-expenses-list.html` | accounting | · | ✅ | · |  |
| 3 | `accounting-catalogs/fixed-expense-catalogs/catalogo-gastos-fijos-list.html` | accounting | · | ✅ | · |  |
| 4 | `cfdi-download/cfdi-list` | accounting | ✅ | · | · |  |
| 5 | `fundings/funding` | accounting | ✅ | · | · |  |
| 6 | `fundings/funding-accounting` | accounting | ✅ | · | · |  |
| 7 | `fundings/sat-funding/sat-funding-list` | accounting | ✅ | · | · |  |
| 8 | `general-ledger/accounting-accounts` | accounting | ✅ | · | · |  |
| 9 | `general-ledger/accounting-catalog` | accounting | ✅ | · | · |  |
| 10 | `general-ledger/aspel-customer-company/aspel-customer-empresa-list.html` | accounting | · | ✅ | · |  |
| 11 | `general-ledger/aspel-mirror/projected-expenses-list.html` | accounting | · | ✅ | · |  |
| 12 | `general-ledger/aspel-web-budget` | accounting | ✅ | · | · |  |
| 13 | `general-ledger/budget-proposals/budget-rule-list/budget-rule-list.html` | accounting | · | · | ✅ | Protegido: autorización Ing. Ricardo Marques |
| 14 | `general-ledger/dynamic-reports/report-catalog/report-catalog.html` | accounting | · | · | ✅ | Página con tabs + 2 listas (caso especial) |
| 15 | `general-ledger/financial-reports/client/client-accounting-budget/presupuesto-contabilidad-cliente.html` | accounting | · | · | ✅ | Reporte denso (evaluar aparte) |
| 16 | `general-ledger/financial-reports/client/client-budget-statement/cedula-presupuestal-cliente.html` | accounting | · | · | ✅ | Reporte denso (evaluar aparte) |
| 17 | `general-ledger/financial-reports/client/client-collection-analysis/analisis-cobranza-cliente.html` | accounting | · | · | ✅ | Reporte denso (evaluar aparte) |
| 18 | `general-ledger/financial-reports/client/client-income-statement-v2/estado-resultados-v2-cliente.html` | accounting | · | · | ✅ | Reporte denso (evaluar aparte) |
| 19 | `general-ledger/financial-reports/client/client-income-statement/estado-resultados-cliente.html` | accounting | · | · | ✅ | Reporte denso (evaluar aparte) |
| 20 | `general-ledger/financial-reports/online/accounting-budget/presupuesto-contabilidad.html` | accounting | · | · | ✅ | Reporte denso (evaluar aparte) |
| 21 | `general-ledger/financial-reports/online/banks-investments/bancos-inversiones.html` | accounting | · | · | ✅ | Reporte denso (evaluar aparte) |
| 22 | `general-ledger/financial-reports/online/budget-statement/cedula-presupuestal.html` | accounting | · | · | ✅ | Reporte denso (evaluar aparte) |
| 23 | `general-ledger/financial-reports/online/extraordinary-results/resultados-extraordinarios.html` | accounting | · | · | ✅ | Reporte denso (evaluar aparte) |
| 24 | `general-ledger/financial-reports/online/income-statement-v2/estado-resultados-v2.html` | accounting | · | · | ✅ | Reporte denso (evaluar aparte) |
| 25 | `general-ledger/financial-reports/online/income-statement/estado-resultados.html` | accounting | · | · | ✅ | Reporte denso (evaluar aparte) |
| 26 | `general-ledger/financial-reports/online/monthly-balance/balance-mensual.html` | accounting | · | · | ✅ | Reporte denso (evaluar aparte) |
| 27 | `general-ledger/financial-statements` | accounting | ✅ | · | · |  |
| 28 | `general-ledger/fixed-expense-catalogs/catalogo-gastos-fijos-list.html` | accounting | · | ✅ | · |  |
| 29 | `general-ledger/funding-accounting/funding-accounting-list.html` | accounting | · | ✅ | · |  |
| 30 | `general-ledger/pending-minutes` | accounting | ✅ | · | · |  |
| 31 | `email-configuration/customer-data-companies` | admin | ✅ | · | · |  |
| 32 | `email-configuration/email-data` | admin | ✅ | · | · |  |
| 33 | `reports/customer-provider` | admin | ✅ | · | · |  |
| 34 | `security-permissions/application-roles` | admin | ✅ | · | · |  |
| 35 | `security-permissions/customer` | admin | ✅ | · | · |  |
| 36 | `security-permissions/customer-locations` | admin | ✅ | · | · |  |
| 37 | `security-permissions/customer-modules` | admin | ✅ | · | · |  |
| 38 | `security-permissions/module-app-roles` | admin | ✅ | · | · |  |
| 39 | `security-permissions/module-apps` | admin | ✅ | · | · |  |
| 40 | `system-audit-logs/audit-entries` | admin | ✅ | · | · |  |
| 41 | `system-audit-logs/log-api-report` | admin | ✅ | · | · |  |
| 42 | `system-audit-logs/user-activity-history` | admin | ✅ | · | · |  |
| 43 | `system-configuration/assembly-checklist-templates` | admin | ✅ | · | · |  |
| 44 | `system-configuration/database-backup` | admin | ✅ | · | · |  |
| 45 | `system-configuration/knowledge-base` | admin | ✅ | · | · |  |
| 46 | `system-configuration/vault-secrets` | admin | ✅ | · | · |  |
| 47 | `password-manager` | auth | ✅ | · | · |  |
| 48 | `native-collections/core/approvals/approval-inbox.html` | collections | · | · | ✅ | Omitido por decisión |
| 49 | `native-collections/core/audit/financial-audit-log.html` | collections | · | · | ✅ | Omitido por decisión |
| 50 | `native-collections/core/charge-templates/charge-template-list.html` | collections | · | · | ✅ | Omitido por decisión |
| 51 | `native-collections/core/charge-types/charge-type-list.html` | collections | · | · | ✅ | Omitido por decisión |
| 52 | `native-collections/core/charges/charge-list.html` | collections | · | · | ✅ | Omitido por decisión |
| 53 | `native-collections/core/collection-cases/collection-case-list.html` | collections | · | · | ✅ | Omitido por decisión |
| 54 | `native-collections/core/initial-balance/initial-balance.html` | collections | · | · | ✅ | Omitido por decisión |
| 55 | `native-collections/core/invoices/invoice-list.html` | collections | · | · | ✅ | Omitido por decisión |
| 56 | `native-collections/core/late-fee-policies/late-fee-policy-list.html` | collections | · | · | ✅ | Omitido por decisión |
| 57 | `native-collections/core/ledger/ledger-viewer.html` | collections | · | · | ✅ | Omitido por decisión |
| 58 | `native-collections/core/members/member-list.html` | collections | · | · | ✅ | Omitido por decisión |
| 59 | `native-collections/core/payments/payment-list.html` | collections | · | · | ✅ | Omitido por decisión |
| 60 | `native-collections/core/period-closures/period-closure-dashboard.html` | collections | · | · | ✅ | Omitido por decisión |
| 61 | `native-collections/core/property-fines/property-fine-list.html` | collections | · | · | ✅ | Omitido por decisión |
| 62 | `native-collections/core/reconciliation/reconciliation-dashboard.html` | collections | · | · | ✅ | Omitido por decisión |
| 63 | `native-collections/core/regulation-articles/regulation-article-list.html` | collections | · | · | ✅ | Omitido por decisión |
| 64 | `online-collections/condo-owners-detail/cobranza-online-detalle-condominos.html` | collections | · | · | ✅ | Omitido por decisión |
| 65 | `online-collections/exclusions/cobranza-online-exclusions.html` | collections | · | · | ✅ | Omitido por decisión |
| 66 | `online-collections/inspection/cobranza-online-inspection.html` | collections | · | · | ✅ | Omitido por decisión |
| 67 | `online-collections/other-charges/cobranza-online-otros-cargos.html` | collections | · | · | ✅ | Omitido por decisión |
| 68 | `online-collections/towers/cobranza-online-towers.html` | collections | · | · | ✅ | Omitido por decisión |
| 69 | `online-collections/transactions/cobranza-online-movimientos.html` | collections | · | · | ✅ | Omitido por decisión |
| 70 | `employee-time-clock` | human-resources | ✅ | · | · |  |
| 71 | `evaluation/evaluation-template` | human-resources | ✅ | · | · |  |
| 72 | `evaluation/evaluation-template/performance-evaluation` | human-resources | ✅ | · | · |  |
| 73 | `hr-admin/incident-type-list` | human-resources | ✅ | · | · |  |
| 74 | `hr-admin/sanction-type-list` | human-resources | ✅ | · | · |  |
| 75 | `payroll/details` | human-resources | ✅ | · | · |  |
| 76 | `payroll/details/nomina-detalle` | human-resources | ✅ | · | · |  |
| 77 | `payroll/headers` | human-resources | ✅ | · | · |  |
| 78 | `payroll/headers/nominas` | human-resources | ✅ | · | · |  |
| 79 | `payroll/incidents` | human-resources | ✅ | · | · |  |
| 80 | `payroll/incidents/incidencias-nomina` | human-resources | ✅ | · | · |  |
| 81 | `payroll/loans` | human-resources | ✅ | · | · |  |
| 82 | `payroll/loans/prestamos-empleado` | human-resources | ✅ | · | · |  |
| 83 | `payroll/overtime` | human-resources | ✅ | · | · |  |
| 84 | `payroll/overtime/tiempo-extra` | human-resources | ✅ | · | · |  |
| 85 | `payroll/periods` | human-resources | ✅ | · | · |  |
| 86 | `payroll/periods/periodos-nomina` | human-resources | ✅ | · | · |  |
| 87 | `time-off/admin-vacaciones-balance` | human-resources | ✅ | · | · |  |
| 88 | `time-off/leave-request` | human-resources | ✅ | · | · |  |
| 89 | `time-off/my-vacation-requests` | human-resources | ✅ | · | · |  |
| 90 | `time-off/request-history` | human-resources | ✅ | · | · |  |
| 91 | `employee-contracts/addendum-template` | legal | ✅ | · | · |  |
| 92 | `employee-contracts/contract-addendum` | legal | ✅ | · | · |  |
| 93 | `employee-contracts/contract-template` | legal | ✅ | · | · |  |
| 94 | `employee-contracts/work-contract` | legal | ✅ | · | · |  |
| 95 | `legal/custom-documents` | legal | ✅ | · | · |  |
| 96 | `legal/legal-matter` | legal | ✅ | · | · |  |
| 97 | `legal/legal-tickets` | legal | ✅ | · | · |  |
| 98 | `legal/meeting-minutes` | legal | ✅ | · | · |  |
| 99 | `vigilance-committees` | legal | ✅ | · | · |  |
| 100 | `fire-equipment/extinguisher-log` | maintenance | ✅ | · | · |  |
| 101 | `fire-equipment/extinguisher-log/extintor-bitacora-list` | maintenance | ✅ | · | · |  |
| 102 | `fire-equipment/hydrant-log` | maintenance | ✅ | · | · |  |
| 103 | `fire-equipment/hydrant-log/hidrante-bitacora-list` | maintenance | ✅ | · | · |  |
| 104 | `fire-equipment/manual-call-point-log` | maintenance | ✅ | · | · |  |
| 105 | `fire-equipment/manual-call-point-log/estacion-manual-bitacora-list` | maintenance | ✅ | · | · |  |
| 106 | `fire-equipment/smoke-detector-log` | maintenance | ✅ | · | · |  |
| 107 | `fire-equipment/smoke-detector-log/detector-humo-bitacora-list` | maintenance | ✅ | · | · |  |
| 108 | `logs/elevator-emergency-call` | maintenance | ✅ | · | · |  |
| 109 | `logs/elevator-spare-parts` | maintenance | ✅ | · | · |  |
| 110 | `logs/logbooks/meters` | maintenance | ✅ | · | · |  |
| 111 | `logs/logbooks/tool-loan` | maintenance | ✅ | · | · |  |
| 112 | `logs/maintenance-log` | maintenance | ✅ | · | · |  |
| 113 | `logs/pool` | maintenance | ✅ | · | · |  |
| 114 | `logs/pool-logbook` | maintenance | ✅ | · | · |  |
| 115 | `logs/tool-loan` | maintenance | ✅ | · | · |  |
| 116 | `logs/water-truck-receipts` | maintenance | ✅ | · | · |  |
| 117 | `machinery/equipment-content` | maintenance | ✅ | · | · |  |
| 118 | `machinery/machinery` | maintenance | ✅ | · | · |  |
| 119 | `maintenance-planning/maintenance-calendar-master` | maintenance | ✅ | · | · |  |
| 120 | `maintenance-planning/master-equipment-calendar` | maintenance | ✅ | · | · |  |
| 121 | `maintenance-reports` | maintenance | ✅ | · | · |  |
| 122 | `maintenance-ticket-catalogs/asset-catalog-list` | maintenance | ✅ | · | · |  |
| 123 | `maintenance-ticket-catalogs/delivery-reception-catalog` | maintenance | ✅ | · | · |  |
| 124 | `maintenance-ticket-catalogs/inspection-revision-catalog` | maintenance | ✅ | · | · |  |
| 125 | `maintenance-ticket-catalogs/machinery-classification` | maintenance | ✅ | · | · |  |
| 126 | `maintenance-ticket-catalogs/meter-category` | maintenance | ✅ | · | · |  |
| 127 | `maintenance-ticket-catalogs/product-category` | maintenance | ✅ | · | · |  |
| 128 | `maintenance-ticket-catalogs/task-group-category-list` | maintenance | ✅ | · | · |  |
| 129 | `monthly-meetings/meeting-minutes/resumen-minuta.html` | management | · | ✅ | · |  |
| 130 | `monthly-meetings/meeting-minutes/seguimiento-minutas.html` | management | · | ✅ | · |  |
| 131 | `monthly-meetings/presentation/presentacion-junta-comite-contador.html` | management | · | ✅ | · |  |
| 132 | `monthly-meetings/presentation/presentacion-junta-comite.html` | management | · | ✅ | · |  |
| 133 | `administrative-incidents/incident` | operations | ✅ | · | · |  |
| 134 | `administrative-incidents/sanction` | operations | ✅ | · | · |  |
| 135 | `announcements/announcement` | operations | ✅ | · | · |  |
| 136 | `custom-documents/custom-document` | operations | ✅ | · | · |  |
| 137 | `custom-documents/custom-document/policy-contract` | operations | ✅ | · | · |  |
| 138 | `customer-providers` | operations | ✅ | · | · |  |
| 139 | `dashboard/unified-pending-dashboard-mobile.html` | operations | · | · | ✅ | No candidato (dashboard) |
| 140 | `dashboard/unified-pending-dashboard.html` | operations | · | · | ✅ | No candidato (dashboard) |
| 141 | `delivery-receptions/client-delivery-reception` | operations | ✅ | · | · |  |
| 142 | `diagram/diagram/diagram-list/diagram-list.html` | operations | · | · | ✅ | No candidato (omitido) |
| 143 | `google-calendar/calendar/annual-maintenance-list/listado-anual-mantenimiento.html` | operations | · | · | ✅ | No candidato (calendario) |
| 144 | `google-calendar/google-calendar/google-calendar.html` | operations | · | · | ✅ | No candidato (calendario) |
| 145 | `inspection/inspection-list` | operations | ✅ | · | · |  |
| 146 | `inspection/logbook` | operations | ✅ | · | · |  |
| 147 | `inventory/fire-extinguisher-inventory` | operations | ✅ | · | · |  |
| 148 | `inventory/hydrant-inventory` | operations | ✅ | · | · |  |
| 149 | `inventory/key-inventory` | operations | ✅ | · | · |  |
| 150 | `inventory/lighting-inventory` | operations | ✅ | · | · |  |
| 151 | `inventory/manual-call-point-inventory` | operations | ✅ | · | · |  |
| 152 | `inventory/paint-inventory` | operations | ✅ | · | · |  |
| 153 | `inventory/product-entry` | operations | ✅ | · | · |  |
| 154 | `inventory/product-exit` | operations | ✅ | · | · |  |
| 155 | `inventory/radio-communication-inventory` | operations | ✅ | · | · |  |
| 156 | `inventory/smoke-detector-inventory` | operations | ✅ | · | · |  |
| 157 | `inventory/stock-by-warehouse` | operations | ✅ | · | · |  |
| 158 | `inventory/warehouse` | operations | ✅ | · | · |  |
| 159 | `manuals/library/financial-report/informe-financiero-list.html` | operations | · | · | ✅ | No candidato (omitido) |
| 160 | `manuals/library/manuals-and-processes/manuals-and-processes-list.html` | operations | · | · | ✅ | No candidato (omitido) |
| 161 | `owner` | operations | ✅ | · | · |  |
| 162 | `properties` | operations | ✅ | · | · |  |
| 163 | `providers` | operations | ✅ | · | · |  |
| 164 | `reports/contracts-policies` | operations | ✅ | · | · |  |
| 165 | `service-orders/service-order` | operations | ✅ | · | · |  |
| 166 | `supervision/supervision/area-minutes-filter/filtro-minutas-area.html` | operations | · | · | ✅ | No candidato (reportes/agendas) |
| 167 | `supervision/supervision/committee-meeting-presentations/presentaciones-juntas-comite.html` | operations | · | · | ✅ | No candidato (reportes/agendas) |
| 168 | `supervision/supervision/general-result-area-evaluation/resultado-general-evaluacion-areas-detalle.html` | operations | · | · | ✅ | No candidato (reportes/agendas) |
| 169 | `supervision/supervision/supervision-agenda/agenda-supervision.html` | operations | · | · | ✅ | No candidato (reportes/agendas) |
| 170 | `task/recurring-tasks/catalog/recurring-task-catalog-list` | operations | ✅ | · | · |  |
| 171 | `task/recurring-tasks/compliance/recurring-task-compliance-dashboard/recurring-task-compliance-dashboard.html` | operations | · | ✅ | · |  |
| 172 | `task/recurring-tasks/instances/task-instance-list` | operations | ✅ | · | · |  |
| 173 | `task/recurring-tasks/templates/task-template-items` | operations | ✅ | · | · |  |
| 174 | `task/recurring-tasks/templates/task-template-list` | operations | ✅ | · | · |  |
| 175 | `task/tasks/my-tasks` | operations | ✅ | · | · |  |
| 176 | `task/tasks/reports/task-operation-report.html` | operations | · | · | ✅ | No candidato (reporte) |
| 177 | `task/tasks/reports/task-report-work-plan.html` | operations | · | · | ✅ | No candidato (reporte) |
| 178 | `task/tasks/task-message` | operations | ✅ | · | · |  |
| 179 | `task/tasks/work-group` | operations | ✅ | · | · |  |
| 180 | `templates` | operations | ✅ | · | · |  |
| 181 | `work-positions` | operations | ✅ | · | · |  |
| 182 | `products/productos-list.html` | purchases | · | ✅ | · |  |
| 183 | `purchase-history/historial-compras-list.html` | purchases | · | ✅ | · |  |
| 184 | `purchase-orders/purchase-order/orden-compra-list.html` | purchases | · | ✅ | · |  |
| 185 | `purchase-requests/budget-statement/ordenes-compra-cedula-list.html` | purchases | · | ✅ | · |  |
| 186 | `purchase-requests/requests/solicitud-compra-list.html` | purchases | · | ✅ | · |  |
| 187 | `candidates/candidate-applications` | recruitment | ✅ | · | · |  |
| 188 | `candidates/candidate-core` | recruitment | ✅ | · | · |  |
| 189 | `candidates/candidate-interview` | recruitment | ✅ | · | · |  |
| 190 | `employee-bank-data-records` | recruitment | ✅ | · | · |  |
| 191 | `employee-beneficiaries` | recruitment | ✅ | · | · |  |
| 192 | `employee-clinical-data-records` | recruitment | ✅ | · | · |  |
| 193 | `employee-dismissal-requests` | recruitment | ✅ | · | · |  |
| 194 | `employee-emergency-contacts` | recruitment | ✅ | · | · |  |
| 195 | `employee-file/employees/employee-registry` | recruitment | ✅ | · | · |  |
| 196 | `employee-file/human-resources/employee-bank-data` | recruitment | ✅ | · | · |  |
| 197 | `employee-file/human-resources/employee-beneficiary` | recruitment | ✅ | · | · |  |
| 198 | `employee-file/human-resources/employee-registry` | recruitment | ✅ | · | · |  |
| 199 | `employee-registration-requests` | recruitment | ✅ | · | · |  |
| 200 | `external-staffs` | recruitment | ✅ | · | · |  |
| 201 | `provider-supports` | recruitment | ✅ | · | · |  |
| 202 | `recruitment-requests/recruitment-client-requests` | recruitment | ✅ | · | · |  |
| 203 | `salary-modification-requests` | recruitment | ✅ | · | · |  |
| 204 | `vacancy-requests` | recruitment | ✅ | · | · |  |
| 205 | `catalogs/banks` | shared | ✅ | · | · |  |
| 206 | `catalogs/cfdi-usage` | shared | ✅ | · | · |  |
| 207 | `catalogs/document-catalog` | shared | ✅ | · | · |  |
| 208 | `catalogs/onboarding-checklist-options` | shared | ✅ | · | · |  |
| 209 | `catalogs/payment-method` | shared | ✅ | · | · |  |
| 210 | `catalogs/payment-type` | shared | ✅ | · | · |  |
| 211 | `catalogs/recruitment-sources` | shared | ✅ | · | · |  |
| 212 | `catalogs/units-of-measurement` | shared | ✅ | · | · |  |
