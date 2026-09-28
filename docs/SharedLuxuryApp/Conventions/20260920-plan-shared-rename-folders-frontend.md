# Plan Fase 1 — Renombrado de carpetas frontend (espejo backend, solo nombre)

**Fecha:** 2026-09-20
**Ámbito:** `appsweb/angular/src/app/modules/` y `appsweb/angular/src/app/core/constants/endpoints/`
**Base normativa:** `CONVENTIONS.md`, `CONVENTIONS_FOLDER-FRONT.MD`, `CONVENTIONS_FOLDER_API.MD`
**Referencia de nombres:** `api/LuxuryApp.Application/Modules/<Modulo>LuxuryApp/<Submodulo>/` (nombres ya en inglés aprobados en la migración backend 2026-09-19).

---

## 1. Alcance

- **Fase 1 (este plan): renombrar carpetas in-place.** Mismo padre, mismo contenido, cero archivos renombrados (solo carpetas). Prevalece el nombre inglés del backend.
- **Fase 2 (fuera de este plan): reubicar** para que el layout quede idéntico al backend: `modules/<modulo>.luxuryapp/<grupo>/<submodulo>/`.

## 2. Reglas de nomenclatura

1. kebab-case, inglés.
2. **Espejo estricto backend (D1):** si el backend tiene `X`, la carpeta frontend se llama `x`. Plural/singular exactamente como backend (`WorkPositions`→`work-positions`, `Owner`→`owner`, `Properties`→`properties`).
3. Carpetas-categoría no se tocan: `interfaces`, `desktop`, `mobile`, `models`, `state`, `helpers`, `services`, `components`, `dtos`, `docs`, `pipes`, `enums`, `shared`.
4. Se corrigen acentos perdidos y typos en el mismo `git mv`.
5. Alias `@<modulo>.luxuryapp/*` se actualiza en `tsconfig.json` solo si cambia el nombre del módulo (único caso: `resident`→`residents`, D2).

## 3. Decisiones aprobadas

| ID | Decisión |
|----|----------|
| D1 | Espejo estricto backend (plural/singular como backend). |
| D2 | Renombrar módulo `resident.luxuryapp` → `residents.luxuryapp` (backend `ResidentsLuxuryApp`); actualizar alias `@resident.luxuryapp`. |
| D3 | `public.luxuryapp` y `web.luxuryapp` se quedan como están (sin contraparte backend). |
| D4 | Solo carpetas. No se renombran archivos en Fase 1. |
| D5 | Colisiones/duplicados se resuelven en Fase 2. `supplier.luxuryapp` es un dominio distinto de `providers` (no se fusionan). |

## 4. Colisiones reales detectadas (bloquean rename, van a Fase 2)

Definición: el nombre propuesto ya existe como hermano en el mismo padre.

| # | Carpeta actual | Propuesto | Choca con | Acción |
|---|----------------|-----------|-----------|--------|
| C1 | `supplier.luxuryapp/provider` | `providers` | `supplier.luxuryapp/providers/` (ya existe) | Fase 2 (dominios distintos, según D5) |
| C2 | `human-resources.luxuryapp/time-off/admin-vacaciones-balance` | `vacation-balance-admin` | `human-resources.luxuryapp/time-off/vacation-balance-admin/` (ya existe) | Fase 2 |

No hay más colisiones estricto mismo-padre en las 747 carpetas.

## 5. Método de ejecución por bloque

1. `git mv <origen> <destino>` por carpeta.
2. Reescribir import specifiers (relativos y alias) afectados en todo `appsweb/angular`.
3. Actualizar `tsconfig.json` → `compilerOptions.paths` si cambió nombre de módulo (solo D2).
4. Gates obligatorios:
   - `npm run build` (Angular) verde.
   - `grep`/`rg` del nombre viejo = 0 ocurrencias.
   - `node scripts/scan-mojibake.mjs api` (y frontend) = 0.
5. Commit por módulo: `Renombra carpetas de <modulo>.luxuryapp a ingles (fase 1)`.

## 6. Inventario de candidatas (actual → propuesto)

### 6.1 Nivel módulo (1)
| actual | propuesto |
|---|---|
| `resident.luxuryapp` | `residents.luxuryapp` (D2) |

### 6.2 `accounting.luxuryapp`
| actual | propuesto |
|---|---|
| `budgeting` | `budget` |
| `fondeos-y-reporteo` | `fundings` |
| `general-ledger/contabilidad-cliente` | `client-accounting` |
| `general-ledger/contabilidad-online` | `accounting-online` |
| `general-ledger/estados-financieros` | `financial-statements` |
| `general-ledger/pendientes-minuta` | `pending-minutes` |
| `general-ledger/presupuesto-propuesta` | `budget-proposals` |
| `general-ledger/presupuesto-web-aspel` | `aspel-web-budget` |
| `general-ledger/reporte-envio-financieros` | `financial-report-delivery` |
| `general-ledger/autitoria-cuentas-aspel` | `aspel-account-audit` (typo) |
| `general-ledger/espejo-aspel` | `aspel-mirror` |
| `general-ledger/espejo-aspel-full` | `aspel-full-mirror` |
| `general-ledger/catalogo-gastos-fijos` | `fixed-expense-catalogs` |
| `general-ledger/resumen-financiero` | `financial-summary` |
| `general-ledger/funding` | `fundings` |
| `general-ledger/contabilidad-cliente/analisis-cobranza-cliente` | `client-collection-analysis` |
| `general-ledger/contabilidad-cliente/bancos-inversiones-cliente` | `client-banks-investments` |
| `general-ledger/contabilidad-cliente/cedula-extraordinaria-cliente` | `client-extraordinary-statement` |
| `general-ledger/contabilidad-cliente/cedula-presupuestal-cliente` | `client-budget-statement` |
| `general-ledger/contabilidad-cliente/epf-cliente` | `client-financial-position` |
| `general-ledger/contabilidad-cliente/estado-resultados-cliente` | `client-income-statement` |
| `general-ledger/contabilidad-cliente/estado-resultados-v2-cliente` | `client-income-statement-v2` |
| `general-ledger/contabilidad-cliente/flujo-efectivo-cliente` | `client-cash-flow` |
| `general-ledger/contabilidad-cliente/fondo-reserva-cliente` | `client-reserve-fund` |
| `general-ledger/contabilidad-cliente/presupuesto-contabilidad-cliente` | `client-accounting-budget` |
| `general-ledger/contabilidad-cliente/proyectos-aprobados-cliente` | `client-approved-projects` |
| `general-ledger/contabilidad-cliente/reporte-financiero-cliente` | `client-financial-report` |
| `general-ledger/contabilidad-online/analisis-cobranza` | `collection-analysis` |
| `general-ledger/contabilidad-online/bancos-inversiones` | `banks-investments` |
| `general-ledger/contabilidad-online/cedula-extraordinaria` | `extraordinary-statement` |
| `general-ledger/contabilidad-online/cedula-presupuestal` | `budget-statement` |
| `general-ledger/contabilidad-online/estado-resultados` | `income-statement` |
| `general-ledger/contabilidad-online/estado-resultados-v2` | `income-statement-v2` |
| `general-ledger/contabilidad-online/flujo-efectivo` | `cash-flow` |
| `general-ledger/contabilidad-online/fondo-reserva` | `reserve-fund` |
| `general-ledger/contabilidad-online/presupuesto-contabilidad` | `accounting-budget` |
| `general-ledger/contabilidad-online/proyectos-aprobados` | `approved-projects` |
| `general-ledger/contabilidad-online/ai-agent-contabilidad-online` | `accounting-online-ai-agent` |
| `general-ledger/contabilidad-online/ai-agent-explicador-contabilidad-online` | `accounting-online-ai-explainer-agent` |
| `ar/aspel-customer-empresa` | `aspel-customer-company` |
| `ar/catalogo-gastos-fijos` | `fixed-expense-catalogs` |
| `ar/espejo-aspel` | `aspel-mirror` |

### 6.3 `admin.luxuryapp`
| actual | propuesto |
|---|---|
| `analisis-registros` | `system-audit-logs` |
| `configuracion-correo` | `email-configuration` |
| `configuracion-sistema` | `system-configuration` |
| `herramientas-dev` | `dev-tools` |
| `reportes` | `reports` |
| `seguridad-permisos` | `security-permissions` |
| `seguridad-permisos/acceso-customer` | `customer-access` |
| `seguridad-permisos/application-role` | `application-roles` |
| `seguridad-permisos/customer-location` | `customer-locations` |
| `seguridad-permisos/customer-modul` | `customer-modules` |
| `seguridad-permisos/interviewer-matrix` | `interviewer-matrices` |
| `seguridad-permisos/module-app` | `module-apps` |
| `seguridad-permisos/module-app-rol` | `module-app-roles` |
| `herramientas-dev/cotizador` | `quotations` |
| `herramientas-dev/ia-test` | `ai-test` |
| `herramientas-dev/testsignalr` | `signalr-test` |
| `configuracion-sistema/asamblea-checklist-template` | `assembly-checklist-templates` |
| `herramientas-dev/catalog-component-ui/foundations/catalog-guia` | `catalog-guide` |
| `herramientas-dev/catalog-component-ui/foundations/catalog-guia-item` | `catalog-guide-item` |
| `configuracion-correo/customer-data-company` | `customer-data-companies` |

### 6.4 `auth.luxuryapp`
Sin nombres ES. No aplica en Fase 1.

### 6.5 `collections.luxuryapp`
| actual | propuesto |
|---|---|
| `aspel-cobranza-haus` | `aspel-collections-haus` |
| `cobranza-nativa` | `native-collections` |
| `cobranza-online` | `online-collections` |
| `aspel-cobranza-haus/aspel-cobranza-reglas-negocio` | `aspel-collections-business-rules` |
| `cobranza-nativa/14-08-2026-arqchitecture` | `architecture` |
| `cobranza-nativa/core/cobranza-dashboard` | `collections-dashboard` |
| `cobranza-nativa/entry/cobranza-nativa-wrapper` | `native-collections-wrapper` |
| `cobranza-online/detalle-condominos` | `condo-owners-detail` |
| `cobranza-online/morosidad` | `delinquency` |
| `cobranza-online/movimientos` | `transactions` |
| `cobranza-online/otros-cargos` | `other-charges` |
| `cobranza-online/resumen` | `summary` |

### 6.6 `committee.luxuryapp`
| actual | propuesto |
|---|---|
| `cobranza` | `collections` |
| `directorio` | `board-directors` |
| `poliza-seguro-edificio` | `building-insurance-policy` |

### 6.7 `human-resources.luxuryapp`
| actual | propuesto |
|---|---|
| `chekador-empleados` | `employee-time-clock` |
| `evaluaciones-de-desempeo` | `performance-evaluations` |
| `expediente-del-empleado` | `employee-file` |
| `recursos-humanos-admin` | `hr-admin` |
| `expediente-del-empleado/recursos-humanos` | `employee-file/human-resources` |
| `expediente-del-empleado/recursos-humanos/nomina` | `employee-file/human-resources/payroll` |
| `.../nomina/configuracion-nomina` | `payroll/configuration` |
| `.../nomina/evidencias-nomina` | `payroll/evidence` |
| `.../nomina/hoja-incidencias` | `payroll/incident-sheet` |
| `.../nomina/incidencias-nomina` | `payroll/incidents` |
| `.../nomina/nomina-dashboard` | `payroll/dashboard` |
| `.../nomina/nomina-detalle` | `payroll/details` |
| `.../nomina/nominas` | `payroll/headers` |
| `.../nomina/periodos-nomina` | `payroll/periods` |
| `.../nomina/prestamos-empleado` | `payroll/loans` |
| `.../nomina/tiempo-extra` | `payroll/overtime` |
| `.../nomina/incidencias-nomina/modal-incidencia-add` | `add-incident-modal` |
| `.../nomina/nomina-detalle/modal-editar-empleado-nomina` | `edit-payroll-employee-modal` |
| `.../nomina/nominas/modal-generar-nomina` | `generate-payroll-modal` |
| `.../nomina/periodos-nomina/modal-dias-no-habiles` | `non-working-days-modal` |
| `.../nomina/periodos-nomina/modal-periodo-add` | `add-period-modal` |
| `.../nomina/prestamos-empleado/modal-prestamo-add` | `add-loan-modal` |
| `.../nomina/prestamos-empleado/modal-prestamo-detalle` | `loan-detail-modal` |
| `.../nomina/tiempo-extra/modal-tiempo-extra-add` | `add-overtime-modal` |
| `time-off/calendario-vacaciones-permisos` | `leave-calendar` |
| `time-off/historial-solicitudes` | `request-history` |
| `time-off/motivo-rechazo-formulario` | `rejection-reason-form` |
| `time-off/panel-aprobaciones` | `approval-panel` |
| `time-off/admin-vacaciones-balance` | **C2 → Fase 2** |

### 6.8 `legal.luxuryapp`
| actual | propuesto |
|---|---|
| `asuntos-legales-y-seguros` | `legal-matters` |
| `comite-vigilancia` | `vigilance-committees` |
| `asuntos-legales-y-seguros/asunto-legal` | `legal-matter` |
| `asuntos-legales-y-seguros/documento-personalizado` | `custom-documents` |
| `asuntos-legales-y-seguros/minutas` | `meeting-minutes` |
| `asuntos-legales-y-seguros/ticket-legal` | `legal-tickets` |
| `asuntos-legales-y-seguros/committee/poliza-seguro-edificio` | `building-insurance-policy` |

### 6.9 `maintenance.luxuryapp`
| actual | propuesto |
|---|---|
| `catalogos-tickets-mantenimiento` | `maintenance-ticket-catalogs` |
| `equipos-y-maquinaria` | `machinery` |
| `planificacin-de-mantenimiento` | `maintenance-planning` |
| `reports-mantenance` | `maintenance-reports` |
| `catalogos-tickets-mantenimiento/catalogo-activo-lista` | `asset-catalog-list` |
| `catalogos-tickets-mantenimiento/catalogo-revisiones-inspeccion` | `inspection-revision-catalog` |
| `inspection/areas-inspeccion` | `inspection-areas` |
| `inspection/detalles-inspeccion` | `inspection-details` |
| `inspection/inspeccion-activo-condominio-agregar` | `inspection-asset-add` |
| `inspection/inspeccion-activo-condominio-editar` | `inspection-asset-edit` |
| `inspection/inspeccion-agregar-revision` | `inspection-revision-add` |
| `inspection/inspecciones-agregar-editar` | `inspections-add-edit` |
| `inspection/lista-inspecciones` | `inspection-list` |
| `inspection/lista-reportes-inspeccion` | `inspection-report-list` |
| `inspection/resultado-inspeccion` | `inspection-result` |
| `logs/bitacoras` | `logbooks` |
| `logs/piscina` | `pool` |
| `logs/piscina-bitacora` | `pool-logbook` |
| `logs/recepcion-pipas-agua` | `water-truck-receipts` |
| `logs/bitacoras/medidores` | `meters` |
| `logs/bitacoras/prestamo-herramienta` | `tool-loan` |
| `planificacin-de-mantenimiento/calendario-maestro-equipo` | `master-equipment-calendar` |
| `reports-mantenance/report-entrada-almacen` | `report-warehouse-entry` |
| `reports-mantenance/report-salida-almacen` | `report-warehouse-exit` |
| `reports-mantenance/report-solicitud-compra` | `report-purchase-request` |
| `reports-mantenance/resumen-mantenimientos` | `maintenance-summary` |

### 6.10 `management.luxuryapp`
| actual | propuesto |
|---|---|
| `home-direccion` | `management-home` |
| `juntas-comite` | `monthly-meetings` |
| `juntas-comite/junta-comite-minutas` | `meeting-minutes` |
| `juntas-comite/juntas-mensuales-session` | `session` |
| `juntas-comite/presentacion-junta-comite` | `presentation` |

### 6.11 `operations.luxuryapp`
| actual | propuesto |
|---|---|
| `directorios` | `directories` |
| `incidencias-sanciones` | `administrative-incidents` |
| `inspecciones-y-auditora` | `inspections` |
| `inventarios-y-almacn` | `inventory` |
| `reclutamiento-solicitudes` | `recruitment-requests` |
| `work-position` | `work-positions` |
| `google-calendar/calendar/fiestas-cristianas` | `christian-holidays` |
| `google-calendar/calendar/fiestas-judias` | `jewish-holidays` |
| `google-calendar/calendar/fondeos` | `fundings` |
| `google-calendar/calendar/general-anual-mantenimiento` | `annual-maintenance-general` |
| `google-calendar/calendar/listado-anual-mantenimiento` | `annual-maintenance-list` |
| `google-calendar/calendar/mantenimiento-preventivo` | `preventive-maintenance` |
| `google-calendar/calendar/reuniones-comite` | `committee-meetings` |
| `inventarios-y-almacn/stock-por-almacen` | `stock-by-warehouse` |
| `manuals/biblioteca` | `library` |
| `properties/entrega-recepcion` | `delivery-reception` |
| `properties/entrega-recepcion-check` | `delivery-reception-check` |
| `properties/entrega-recepcion-cliente` | `client-delivery-reception` |
| `properties/mi-edificio` | `my-building` |
| `reports/estados-financieros` | `financial-statements` |
| `reports/mantenimiento-presupuesto` | `maintenance-budget` |
| `reports/reporte-ticket-pendientes-proveedor` | `report-pending-provider-tickets` |
| `supervision/supervision/agenda-supervision` | `supervision-agenda` |
| `supervision/supervision/filtro-minutas-area` | `area-minutes-filter` |
| `supervision/supervision/minutas-resumen` | `minutes-summary` |
| `supervision/supervision/presentaciones-juntas-comite` | `committee-meeting-presentations` |
| `supervision/supervision/reporte-tickets` | `ticket-report` |
| `supervision/supervision/resultado-general-dashboard` | `general-result-dashboard` |
| `supervision/supervision/resultado-general-evaluacion-areas` | `general-result-area-evaluation` |
| `supervision/supervision/resultado-general-grafico` | `general-result-chart` |
| `supervision/supervision/resultado-general-posicion` | `general-result-ranking` |

### 6.12 `purchases.luxuryapp`
| actual | propuesto |
|---|---|
| `historial-compras` | `purchase-history` |
| `solicitudes-compras` | `purchase-requests` |
| `solicitudes-compras/comparativo` | `comparison` |
| `solicitudes-compras/detalle` | `details` |
| `solicitudes-compras/solicitudes` | `requests` |

### 6.13 `recruitment.luxuryapp`
| actual | propuesto |
|---|---|
| `employee` | `employees` |
| `employee-bank-data` | `employee-bank-data-records` |
| `employee-beneficiary` | `employee-beneficiaries` |
| `employee-clinical-data` | `employee-clinical-data-records` |
| `employee-document` | `employee-documents` |
| `employee-emergen-contact` | `employee-emergency-contacts` |
| `employee-external` | `external-staffs` |
| `expediente-del-empleado` | `employee-file` |
| `reclutamiento-y-altas-bajas` | `recruitment-requests` |
| `solicitud-altas` | `employee-registration-requests` |
| `solicitud-bajas` | `dismissal-requests` |
| `solicitud-modificaciones-sueldo` | `salary-modification-requests` |
| `solicitud-vacantes` | `vacancy-requests` |
| `docs/arquitectura` | `architecture` |
| `docs/audotoria` | `audits` |
| `expediente-del-empleado/recursos-humanos` | `human-resources` |
| `expediente-del-empleado/recursos-humanos/employee-file` | `employee-registry` |
| `expediente-del-empleado/employees` | `employees` |
| `expediente-del-empleado/employees/employees` | `employee-registry` |
| `reclutamiento-y-altas-bajas/reclutamiento-solicitudes` | `recruitment-requests` |

### 6.14 `resident.luxuryapp`
| actual | propuesto |
|---|---|
| `property` | `properties` |

### 6.15 `shared.luxuryapp`
| actual | propuesto |
|---|---|
| `catalogos-generales` | `catalogs` |
| `catalogos-generales/cfdi-use` | `cfdi-usage` |

### 6.16 `supplier.luxuryapp`
| actual | propuesto |
|---|---|
| `po` | `purchase-orders` |
| `pr` | `purchase-requests` |
| `product` | `products` |
| `provider` | **C1 → Fase 2** |
| `provider-qualification` | `provider-qualifications` |
| `provider-support` | `provider-supports` |
| `pr/cedula-presupuestal` | `budget-statement` |
| `po/purchase-order/create-orden-compra-wizard` | `create-purchase-order-wizard` |
| `po/purchase-order/orden-compra-detalle-form` | `purchase-order-detail-form` |
| `po/purchase-order/orden-compra-pagadas` | `paid-purchase-orders` |
| `po/purchase-order/orden-compra-pdf` | `purchase-order-pdf` |
| `po/purchase-order/orden-compra-presupuesto` | `purchase-order-budget` |
| `po/purchase-order/solicitud-pago-pdf` | `payment-request-pdf` |

### 6.17 `system.luxuryapp`
| actual | propuesto |
|---|---|
| `configuracion-sistema` | `system-configuration` |
| `configuracion-sistema/juntas-mensuales-backfill` | `monthly-meetings-backfill` |

### 6.18 `public.luxuryapp`
| actual | propuesto |
|---|---|
| `telefonos-emergencia` | `emergency-phones` |

### 6.19 `web.luxuryapp`
Sin nombres ES. No aplica en Fase 1.

## 7. `core/constants/endpoints` (Fase 1.5, aparte)

Renombrado de archivos NO entra en Fase 1 (D4). Queda como bloque separado:
`cobranza`→`collections`, `compras`→`purchases`, `contabilidad`→`accounting`, `direccion`→`management`, `mantenimiento`→`maintenance`, `reclutamiento`→`recruitment`, `recursos-humanos`→`human-resources`; resolver duplicado `operation-recruitment`/`reclutamiento`.

## 8. Fase 2 (enunciado)

Llevar el layout a espejo backend `modules/<modulo>.luxuryapp/<grupo>/<submodulo>/`: mover submódulos sueltos a su grupo, fusionar duplicados cross-módulo, resolver C1/C2, bajar profundidad ≥6, sacar `docs/` de submódulos, retirar `14-08-2026-arqchitecture`. Requiere análisis de imports por pieza (§1.2bis) y su propio plan aprobado.
