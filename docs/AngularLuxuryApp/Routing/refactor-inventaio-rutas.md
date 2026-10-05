# Inventario de Routings — App Angular

> Fecha: 2026-07-01
> Fuentes: `src/app/routing/*.ts`, `src/app/features/**/*.routing.ts`, `src/app/app.routes.ts`

---

## 1. Arquitectura de Routing

```
app.config.ts (provideRouter con appRoutes)
  └── app.routes.ts (top-level)
       ├── /auth                  → auth.routing.ts
       ├── /publico               → public.routing.ts
       ├── /offline, /unauthorized, /page404
       ├── /committee             → LayoutCommittee → committee.routing.ts
       ├── /direccion             → LayoutDireccion → direccion.routing.ts
       └── "" (employee default)  → LayoutEmployee → pages.routing.ts (HUB)
```

**Total archivos de routing:** ~48
**Total rutas activas:** ~315
**Layouts principales:** `LayoutEmployee`, `LayoutCommittee`, `LayoutDireccion`

---

## 2. Hub Central — `pages.routing.ts`

Rutas de empleado que cargan módulos lazy:

| Path                       | Módulo                         | Archivo                                       |
| -------------------------- | ------------------------------ | --------------------------------------------- |
| `/dashboard`               | ContainerDashboard             | directo                                       |
| `/notifications`           | NotificationsWrapper           | directo                                       |
| `/home`                    | HomeMenu                       | directo                                       |
| `/settings`                | settings                       | `settings.routing.ts`                         |
| `/profile`                 | profile                        | `profile.routing.ts`                          |
| `/announcements`           | announcements                  | `announcements.routing.ts`                    |
| `/warehouse`               | warehouse                      | `warehouse.routing.ts`                        |
| `/calendars`               | calendars                      | `calendars.routing.ts`                        |
| `/contabilidad`            | contabilidad                   | `contabilidad.routing.ts`                     |
| `/cobranza-nativa`         | cobranza-nativa                | `cobranza-nativa.routing.ts`                  |
| `/funding`                 | funding                        | `funding.routing.ts`                          |
| `/directory`               | directory                      | `directory.routing.ts`                        |
| `/library`                 | library                        | `library.routing.ts`                          |
| `/delivery-reception`      | delivery-reception             | `delivery-reception.routing.ts`               |
| `/inspections`             | inspections                    | `inspection.routing.ts`                       |
| `/committee-meetings`      | committee-meetings             | `committee-meetings.routing.ts`               |
| `/purchases`               | compras                        | `compras.routing.ts`                          |
| `/legal`                   | legal                          | `legal.routing.ts`                            |
| `/logbook`                 | logbook                        | `logbook.routing.ts`                          |
| `/inventory`               | inventory                      | `inventories.routing.ts`                      |
| `/maintenance`             | maintenance                    | `maintenance.routing.ts`                      |
| `/operations`              | operations                     | `operations.routing.ts`                       |
| `/recruitment`             | recruitment                    | `recruitment.routing.ts`                      |
| `/report`                  | report                         | `reports.routing.ts`                          |
| `/diagram`                 | diagram                        | `diagram.routing.ts`                          |
| `/supervision`             | supervision                    | `supervision.routing.ts`                      |
| `/tickets`                 | tickets                        | `tickets.routing.ts`                          |
| `/tasks` / `/Tasks`        | tickets (alias)                | `tickets.routing.ts`                          |
| `/utilities`               | utilities                      | `utilities.routing.ts`                        |
| `/employee-evaluation`     | employee-evaluation            | `employee-evaluation.routing.ts`              |
| `/recursos-humanos`        | human-resources                | `human-resources.routing.ts`                  |
| `/human-resources`         | human-resources (alias)        | `human-resources.routing.ts`                  |
| `/sat-funding`             | sat-funding                    | `sat-funding.routes.ts`                       |
| `/recurring-tasks`         | recurring-tasks                | `recurring-tasks.routing.ts`                  |
| `/password-manager`        | password-manager               | `password-manager.routes.ts`                  |
| `/system`                  | system (8 módulos)             | `features/system/system.routing.ts`           |
| `/accounting`              | accounting (8 módulos)         | `features/accounting/accounting.routing.ts`   |
| `/hr`                      | hr (8 módulos)                 | `features/hr/hr.routing.ts`                   |
| `/legal`                   | legal (8 módulos)              | `features/legal/legal.routing.ts`             |
| `/maintenance`             | maintenance (8 módulos)        | `features/maintenance/maintenance.routing.ts` |
| `/operations`              | operations (8 módulos)         | `features/operations/operations.routing.ts`   |
| `/initial-implementation`  | initial-implementation         | `initial-implementation.routing.ts`           |
| `/purchasing`              | purchasing (8 módulos)         | `features/purchasing/purchasing.routing.ts`   |
| `/recruitment`             | recruitment (8 módulos)        | `features/recruitment/recruitment.routing.ts` |
| `/entrega-recepcion-check` | EntregaRecepcionCheckComponent | directo                                       |
| `/catalog-replica`         | CatalogReplica                 | directo                                       |
| `/balance-mensual`         | BalanceMensual                 | directo                                       |

---

## 3. Inventario Completo de Rutas por Módulo

### 3.1 AUTH — `auth.routing.ts`

| Ruta                        | Componente      |
| --------------------------- | --------------- |
| `/auth`                     | LoginWrapper    |
| `/auth/login`               | LoginWrapper    |
| `/auth/recovery-password`   | RecoveryWrapper |
| `/auth/reset-password`      | ResetPassword   |
| `/auth/update-user-profile` | UpdateProfile   |

### 3.2 SETTINGS — `settings.routing.ts` (~40 rutas)

| Ruta                                                       | Componente                      |
| ---------------------------------------------------------- | ------------------------------- |
| `/admin`                                                   | SettingsHome                    |
| `/settings/user-accounts`                                  | UserAccountList                 |
| `/settings/customers`                                      | CustomerList                    |
| `/settings/customer-module`                                | CustomerModulList               |
| `/settings/customer-module-edit/:customerId/:customerName` | CustomerModulEdit               |
| `/settings/roles`                                          | RolesList                       |
| `/settings/module-app-role`                                | ModuleAppRol                    |
| `/settings/module-app`                                     | ModuleAppList                   |
| `/settings/module-app-role-update/:roleId/:roleName`       | ModuleAppRolUpdate              |
| `/settings/approval-rules`                                 | ApprovalRules                   |
| `/settings/customer-data-company`                          | CustomerDataCompanyList         |
| `/settings/email-data`                                     | EmailDataList                   |
| `/settings/depuration`                                     | UpdateDataBase                  |
| `/settings/banks`                                          | BankList                        |
| `/settings/payment-method`                                 | PaymentMethodList               |
| `/settings/payment-type`                                   | PaymentTypeList                 |
| `/settings/cfdi-use`                                       | CfdiUseList                     |
| `/settings/jobs`                                           | JobsDashboard                   |
| `/settings/app-implementation-report`                      | AppImplementationTrackingManual |
| `/settings/meter-category`                                 | MeterCategoryList               |
| `/settings/product-category`                               | ProductCategoryList             |
| `/settings/machinery-classification`                       | MachineryClassificationList     |
| `/settings/units-of-measurement`                           | UnitOfMeasurementList           |
| `/settings/audit-entries`                                  | AuditEntries                    |
| `/settings/user-activity-history`                          | UserActivityHistory             |
| `/settings/incident-types`                                 | IncidentTypeList                |
| `/settings/sanction-types`                                 | SanctionTypeList                |
| `/settings/log-api-report`                                 | LogApiReport                    |
| `/settings/brevo-logs`                                     | BrevoEmailLogs                  |
| `/settings/testsignalr`                                    | Testsignalr                     |
| `/settings/test-email`                                     | TextEmail                       |
| `/settings/mini-postman`                                   | MiniPostman                     |
| `/settings/ticket-group-category`                          | TaskGroupCategoryList           |
| `/settings/assembly-checklist-catalog`                     | AsambleaChecklistTemplateList   |
| `/settings/monthly-meetings-reconciliation`                | JuntasMensualesBackfill         |
| `/settings/inspection-reviews-catalog`                     | CatalogoRevisionesInspeccion    |
| `/settings/catalog-asset`                                  | CatalogoActivoLista             |
| `/settings/client-delivery-reception`                      | CatalogoDescripcionList         |
| `/settings/ui-catalog`                                     | CatalogLayout                   |
| `/settings/ui-catalog/tokens`                              | (redirect)                      |
| `/settings/ui-catalog/tokens/:item`                        | CatalogTokensItem               |
| `/settings/ui-catalog/web/:item`                           | CatalogWebItem                  |
| `/settings/ui-catalog/mobile/:item`                        | CatalogMobileItem               |
| `/settings/ui-catalog/core/:item`                          | CatalogCoreItem                 |
| `/settings/ui-catalog/charts/:item`                        | CatalogChartsItem               |
| `/settings/ui-catalog/patterns/:item`                      | CatalogPatternsItem             |
| `/settings/ui-catalog/layouts/:item`                       | CatalogLayoutsItem              |
| `/settings/ui-catalog/docs/:item`                          | CatalogDocsItem                 |
| `/settings/ui-catalog/audit/:item`                         | CatalogAuditItem                |
| `/settings/ui-catalog/guia/:item`                          | CatalogGuiaItem                 |
| `/settings/ai-knowledge-base`                              | AiKnowledgeBaseList             |
| `/settings/vault-secrets`                                  | VaultSecretsList                |
| `/settings/eleven-labs`                                    | ElevenLabsSettingsComponent     |
| `/settings/ai-test`                                        | IaTestComponent                 |

### 3.3 ANNOUNCEMENTS — `announcements.routing.ts`

| Ruta                           | Componente            |
| ------------------------------ | --------------------- |
| `/announcements/manage`        | AnnouncementAdminList |
| `/announcements/list`          | AnnouncementList      |
| `/announcements/detail/:id`    | announcementDetail    |
| `/announcements/analytics/:id` | AnnouncementAnalytics |

### 3.4 WAREHOUSE — `warehouse.routing.ts`

| Ruta                             | Componente                  |
| -------------------------------- | --------------------------- |
| `/warehouse/list`                | WarehouseList               |
| `/warehouse/products/:almacenId` | WarehouseStockList          |
| `/warehouse/product-output`      | ProductOutputList           |
| `/warehouse/product-entry`       | ProductEntryList            |
| `/warehouse/tool-loan`           | PrestamoHerramientasControl |

### 3.5 CALENDARS — `calendars.routing.ts`

| Ruta                              | Componente              |
| --------------------------------- | ----------------------- |
| `/calendars/jewish-holidays`      | FiestasJudias           |
| `/calendars/christian-holidays`   | FiestasCristianas       |
| `/calendars/birthdays`            | Cumpleanos              |
| `/calendars/maintenance-master`   | CalendarioMaestroLista  |
| `/calendars/fundings`             | Fondeos                 |
| `/calendars/team-master-calendar` | CalendarioMaestroEquipo |
| `/calendars/google-calendar`      | GoogleCalendar          |

### 3.6 CONTABILIDAD — `contabilidad.routing.ts` (COBRANZA_NATIVA_ROUTES)

| Ruta                                                 | Componente                      |
| ---------------------------------------------------- | ------------------------------- |
| `/contabilidad`                                      | MasterDashboard                 |
| `/contabilidad/budget`                               | PresupuestoWebAspelWrapper      |
| `/contabilidad/accounting-catalog`                   | AccountingCatalog               |
| `/contabilidad/minutes-pendings`                     | ContListMinutaPendientes        |
| `/contabilidad/funding-list`                         | FundingAccountingList           |
| `/contabilidad/funding-details/:id`                  | FundingAccountingDetail         |
| `/contabilidad/legal-minutes-pendings`               | LegalPendientesMinuta           |
| `/contabilidad/budget-execution`                     | ProjectedExpensesList           |
| `/contabilidad/financial-report-sending`             | ReporteEnvioFinancieros         |
| `/contabilidad/financial-statements`                 | EstadoFinancieroList            |
| `/contabilidad/financial-summary`                    | FinancialSummary                |
| `/contabilidad/budget-proposal`                      | PresupuestoPropuesta            |
| `/contabilidad/collections/presupuesto-contabilidad` | PresupuestoContabilidad         |
| `/contabilidad/accounts`                             | AccountingCatalog               |
| `/contabilidad/financial-statements-reports`         | FinancialReportsWrapper         |
| `/contabilidad/aspel-cobranza`                       | AspelCobranzaHaus               |
| `/contabilidad/espejo-aspel-full`                    | EspejoAspelFull                 |
| `/contabilidad/autitoria-cuentas-aspel`              | AutitoriaCuentasAspel           |
| `/contabilidad/reportes`                             | ReportCatalog                   |
| `/contabilidad/reportes/nuevo`                       | ReportBuilder                   |
| `/contabilidad/reportes/editar/:id`                  | ReportBuilder                   |
| `/contabilidad/reportes/ver/:id`                     | ReportViewer                    |
| `/contabilidad/reportes/guia`                        | ReportGuide                     |

### 3.7 COBRANZA NATIVA — `cobranza-nativa.routing.ts`

| Ruta                                        | Componente              |
| ------------------------------------------- | ----------------------- |
| `/cobranza-nativa`                          | CobranzaNativaDashboard |
| `/cobranza-nativa/dashboard`                | CobranzaDashboard       |
| `/cobranza-nativa/charge-templates`         | ChargeTemplateList      |
| `/cobranza-nativa/charges`                  | ChargeList              |
| `/cobranza-nativa/payments`                 | Payments                |
| `/cobranza-nativa/late-fee-policies`        | LateFeePolicyList       |
| `/cobranza-nativa/estado-cuenta`            | NativeStatement         |
| `/cobranza-nativa/properties`               | PropiedadesList         |
| `/cobranza-nativa/members`                  | MemberList              |
| `/cobranza-nativa/approvals`                | ApprovalInbox           |
| `/cobranza-nativa/ledger`                   | LedgerViewer            |
| `/cobranza-nativa/period-closures`          | PeriodClosureDashboard  |
| `/cobranza-nativa/regulation-articles`      | RegulationArticleList   |
| `/cobranza-nativa/property-fines`           | PropertyFineList        |
| `/cobranza-nativa/collection-cases`         | CollectionCaseList      |
| `/cobranza-nativa/invoices`                 | InvoiceList             |
| `/cobranza-nativa/reconciliation`           | ReconciliationDashboard |
| `/cobranza-nativa/audit`                    | FinancialAuditLog       |
| `/cobranza-nativa/automated-services`       | AutomatedServices       |
| `/cobranza-nativa/charge-template-coverage` | ChargeTemplateCoverage  |
| `/cobranza-nativa/initial-balance`          | InitialBalance          |
| `/cobranza-nativa/system-overview`          | SystemOverview          |

### 3.8 FUNDING — `funding.routing.ts`

| Ruta                   | Componente    |
| ---------------------- | ------------- |
| `/funding/list`        | FundingList   |
| `/funding/details/:id` | FundingDetail |

### 3.9 DIRECTORY — `directory.routing.ts`

| Ruta                                                 | Componente           |
| ---------------------------------------------------- | -------------------- |
| `/directory/provider`                                | ListProvider         |
| `/directory/condos`                                  | OwnerList            |
| `/directory/properties`                              | PropiedadesList      |
| `/directory/vigilance-committee`                     | ComiteVigilanciaList |
| `/directory/staff`                                   | StaffBoard           |
| `/directory/work-position-org-chart`                 | OrgChart             |
| `/directory/internal-staff`                          | EmployeeList         |
| `/directory/external-staff`                          | EmployeeExternalList |
| `/directory/empleado/:employeeId/:applicationUserId` | EmployeeForm         |
| `/directory/emergency-phones`                        | TelefonosEmergencia  |
| `/directory/mis-proveedores`                         | MisProveedores       |

### 3.10 LIBRARY — `library.routing.ts`

| Ruta                                                  | Componente                |
| ----------------------------------------------------- | ------------------------- |
| `/library/incorporation-deed`                         | ActaConstitutivaList      |
| `/library/financial-report`                           | InformeFinanciero         |
| `/library/templates`                                  | TemplatesList             |
| `/library/manuals-and-processes`                      | ManualsAndProcessesList   |
| `/library/manuals-and-processes/guide`                | ManualsAndProcessesGuide  |
| `/library/manuals-and-processes/detail/:id`           | ManualsAndProcessesDetail |
| `/library/manuals-and-processes/editor/:id`           | ManualsAndProcessesEditor |
| `/library/manuals-and-processes/flowchart-editor/:id` | ManualFlowchartEditor     |
| `/library/maintenance-policies`                       | PolicyContractList        |
| `/library/contracts-policies-view-legal`              | ContractsPolicies         |
| `/library/assemblies`                                 | Asambleas                 |
| `/library/regulations`                                | Reglamentos               |
| `/library/ravine-concession`                          | SpecialDocumentList       |
| `/library/well-concession`                            | SpecialDocumentList       |
| `/library/painting`                                   | InventarioPintura         |
| `/library/lighting`                                   | InventarioIluminacion     |

### 3.11 DELIVERY-RECEPTION — `delivery-reception.routing.ts`

| Ruta                                            | Componente                               |
| ----------------------------------------------- | ---------------------------------------- |
| `/delivery-reception/general`                   | EntregaRecepcionClienteLista             |
| `/delivery-reception/equipment`                 | EntregaRecepcionEquipos                  |
| `/delivery-reception/installations`             | EntregaRecepcionInstalaciones            |
| `/delivery-reception/tools`                     | EntregaRecepcionHerramientas             |
| `/delivery-reception/supplies`                  | EntregaRecepcionInsumos                  |
| `/delivery-reception/maintenance`               | EntregaRecepcionMantenimientos           |
| `/delivery-reception/organigrama`               | EntregaRecepcionOrganigrama              |
| `/delivery-reception/keys`                      | EntregaRecepcionLlaves                   |
| `/delivery-reception/hydrants`                  | EntregaRecepcionHidrantes                |
| `/delivery-reception/mantenimientos-pendientes` | EntregaRecepcionMantenimientosPendientes |

### 3.12 INSPECTIONS — `inspection.routing.ts`

| Ruta                                  | Componente              |
| ------------------------------------- | ----------------------- |
| `/inspections/catalog`                | ListaInspecciones       |
| `/inspections/details/:id`            | DetallesInspeccion      |
| `/inspections/inspection-report-list` | ListaInformeInspeccion  |
| `/inspections/my-inspection-list`     | MisInspeccionesLista    |
| `/inspections/my-inspection`          | MisInspeccionesEjecutar |
| `/inspections/result/:id`             | ResultadoInspeccion     |

### 3.13 COMMITTEE-MEETINGS — `committee-meetings.routing.ts`

| Ruta                                            | Componente                      |
| ----------------------------------------------- | ------------------------------- |
| `/committee-meetings/sessions`                  | JuntasMensualesSession          |
| `/committee-meetings/presentations`             | PresentacionJuntaComite         |
| `/committee-meetings/presentations-contador`    | PresentacionJuntaComiteContador |
| `/committee-meetings/minutes`                   | MinutasList                     |
| `/committee-meetings/resumen-minuta/:meetingId` | ResumenMinuta                   |
| `/committee-meetings/gestion-minuta/:id`        | MeetingManagement               |
| `/committee-meetings/minuta-pendientes`         | MinutaPendientes                |
| `/committee-meetings/seguimiento-minutas/:area` | SeguimientoMinuta               |

### 3.14 COMPRAS / PURCHASES — `compras.routing.ts`

| Ruta                                        | Componente                  |
| ------------------------------------------- | --------------------------- |
| `/purchases/presupuesto`                    | PresupuestoWebAspelWrapper  |
| `/purchases/products-services`              | ProductosList               |
| `/purchases/purchase-requests`              | SolicitudCompraList         |
| `/purchases/solicitud-compra/:id`           | SolicitudCompra             |
| `/purchases/pdf-solicitud-compra/:id`       | PdfSolicitudCompra          |
| `/purchases/cuadro-comparativo/:id`         | CuadroComparativoList       |
| `/purchases/solicitud-compra-presentacion`  | SolicitudCompraPresentacion |
| `/purchases/fixed-expenses-catalog`         | CatalogoGastosFijosList     |
| `/purchases/catalogo-gastos-fijos-form/:id` | CatalogoGastoFijoForm       |
| `/purchases/purchase-orders`                | OrdenCompraList             |
| `/purchases/orden-compra/:id`               | OrdenCompra                 |
| `/purchases/orden-compra-pdf/:id`           | OrdenCompraPdf              |
| `/purchases/solicitud-pago-pdf/:id`         | SolicitudPagoPdfComponent   |
| `/purchases/paid`                           | OrdenCompraPagadas          |
| `/purchases/maintenance-budget`             | GastosMantenimiento         |

### 3.15 LEGAL — `legal.routing.ts`

| Ruta                            | Componente                    |
| ------------------------------- | ----------------------------- |
| `/legal/legal-minutes-pendings` | LegalPendientesMinuta         |
| `/legal/list-ticket-legal`      | TicketLegalLista              |
| `/legal/pendings`               | TicketLegalReportesPendientes |
| `/legal/reports-internal`       | TicketLegalReportesInternos   |
| `/legal/reports-external`       | TicketLegalReportesExternos   |
| `/legal/committee-directory`    | ComitesList                   |
| `/legal/legal-matter`           | AsuntoLegalLista              |
| `/legal/list-ticket-customer`   | TicketLegalListaCliente       |
| `/legal/ticket/:ticketId`       | TicketLegalIndividual         |
| `/legal/documents`              | (hijos dinámicos)             |

**Rutas dinámicas bajo `/legal/documents`:**

- `/legal/documents/financial-report`
- `/legal/documents/templates`
- `/legal/documents/manuals-and-processes`
- `/legal/documents/maintenance-policy`
- `/legal/documents/incorporation-deeds`
- `/legal/documents/assemblies`
- `/legal/documents/regulations`
- `/legal/documents/employee-contracts`
- `/legal/documents/lawsuits`
- `/legal/documents/blueprints`
- `/legal/documents/ravine-concession`
- `/legal/documents/well-concession`

### 3.16 LOGBOOK — `logbook.routing.ts`

| Ruta                                                 | Componente                         |
| ---------------------------------------------------- | ---------------------------------- |
| `/logbook/maintenance-orders`                        | OrdenesServicio                    |
| `/logbook/inspections-areas`                         | InspectionsAreas                   |
| `/logbook/pool`                                      | PiscinaList                        |
| `/logbook/piscina-bitacora/:piscinaId`               | PiscinaBitacoraList                |
| `/logbook/meter-list`                                | MedidoresList                      |
| `/logbook/lista-medidor-lectura/:id`                 | MedidorLecturaList                 |
| `/logbook/grafico/:id`                               | MedidorLecturaChart                |
| `/logbook/elevator-spare-parts-change`               | ElevatorSparePartsChangeList       |
| `/logbook/elevators-emergency-call`                  | ElevatorsEmergencyCallList         |
| `/logbook/my-inspection/:customerInspectionId`       | MisInspeccionesEjecutar            |
| `/logbook/water-truck-reception`                     | RecepcionPipasAguaList             |
| `/logbook/water-truck-reception/reporte`             | RecepcionPipasAguaReporte          |
| `/logbook/water-truck-reception/analisis`            | RecepcionPipasAguaAnalisis         |
| `/logbook/fire-extinguisher-log/:extinguisherId`     | ExtintorBitacoraList               |
| `/logbook/fire-extinguisher-checklist/:id`           | ExtintorChecklist                  |
| `/logbook/fire-equipment-scanner`                    | QrScanner                          |
| `/logbook/equipment-inspection/:code`                | EquipmentInspectionQrEntry         |
| `/logbook/hydrant-log/:hydrantId`                    | HidranteBitacoraList               |
| `/logbook/hydrant-checklist/:id`                     | HidranteChecklist                  |
| `/logbook/manual-call-point-log/:stationId`          | EstacionManualBitacoraList         |
| `/logbook/manual-call-point-checklist/:id`           | EstacionManualChecklist            |
| `/logbook/smoke-detector-log/:detectorId`            | DetectorHumoBitacoraList           |
| `/logbook/smoke-detector-checklist/:id`              | DetectorHumoChecklist              |
| `/logbook/fire-inspection-periods`                   | FireInspectionPeriodList           |
| `/logbook/fire-inspection-cycles`                    | FireInspectionCycleList            |
| `/logbook/fire-inspection-cycle/:cycleId`            | FireInspectionCycleDetail          |
| `/logbook/fire-inspection-period-extintor/:periodId` | FireInspectionPeriodExtintorDetail |
| `/logbook/fire-inspection-period-hidrante/:periodId` | FireInspectionPeriodHidranteDetail |
| `/logbook/fire-inspection-period-estacion/:periodId` | FireInspectionPeriodEstacionDetail |
| `/logbook/fire-inspection-period-detector/:periodId` | FireInspectionPeriodDetectorDetail |

### 3.17 INVENTORY — `inventories.routing.ts`

| Ruta                                     | Componente               |
| ---------------------------------------- | ------------------------ |
| `/inventory/inventory-engine-system`     | InventoryEngineSystem    |
| `/inventory/areas-equipment`             | EquiposList              |
| `/inventory/gimnasio`                    | EquiposList              |
| `/inventory/tools`                       | ToolList                 |
| `/inventory/pintura`                     | InventarioPintura        |
| `/inventory/keys`                        | InventarioLlavesList     |
| `/inventory/reporte-equipos`             | ReporteCompletoActivos   |
| `/inventory/radios`                      | RadioComunicacionList    |
| `/inventory/cedula-anual-mantenimientos` | GastosMantenimiento      |
| `/inventory/extinguishers`               | InventarioExtintor       |
| `/inventory/extintores-group`            | InventarioExtintorGroup  |
| `/inventory/hydrants`                    | InventarioHidrante       |
| `/inventory/manual-call-points`          | InventarioEstacionManual |
| `/inventory/smoke-detectors`             | InventarioDetectorHumo   |

### 3.18 MAINTENANCE — `maintenance.routing.ts`

| Ruta                           | Componente         |
| ------------------------------ | ------------------ |
| `/maintenance/annual-calendar` | CalendarioMttoList |

### 3.19 REPORTS — `reports.routing.ts`

| Ruta                               | Componente             |
| ---------------------------------- | ---------------------- |
| `/report/supervision-report`       | ReportSupervision      |
| `/report/access-history`           | BitacoraAcceso         |
| `/report/maintenance-report`       | (sub-rutas)            |
| `/report/resumen-ordenes-servicio` | ResumenOrdenesServicio |
| `/report/pending-minutes`          | PendingMinutes         |
| `/report/financial-statements`     | EstadosFinancieros     |

### 3.20 MAINTENANCE-REPORT (sub-módulo)

| Ruta                                                    | Componente                 |
| ------------------------------------------------------- | -------------------------- |
| `/report/maintenance-report/panel`                      | MaintenanceReports         |
| `/report/maintenance-report/maintenances-summary`       | ResumenMantenimientos      |
| `/report/maintenance-report/consumptions`               | ReportConsumos             |
| `/report/maintenance-report/warehouse-entry`            | ReportEntradaAlmacen       |
| `/report/maintenance-report/warehouse-exit`             | ReportSalidaAlmacen        |
| `/report/maintenance-report/daily-tour`                 | ReportRecorridoDiario      |
| `/report/maintenance-report/tool-loan-report`           | ReportPrestamoHerramienta  |
| `/report/maintenance-report/purchase-request-report`    | ReportSolicitudCompra      |
| `/report/maintenance-report/pool-report`                | ReportBitacoraAlberca      |
| `/report/maintenance-report/tickets`                    | ReportTicket               |
| `/report/maintenance-report/elevators`                  | ElevatorsEmergencyCallList |
| `/report/maintenance-report/soporte-orden-servicio/:id` | SoporteOrdenServicio       |

### 3.21 DIAGRAM — `diagram.routing.ts`

| Ruta                  | Componente     |
| --------------------- | -------------- |
| `/diagram`            | DiagramList    |
| `/diagram/editor/:id` | DiagramEditor  |
| `/diagram/gallery`    | DiagramGallery |
| `/diagram/view/:id`   | DiagramView    |

### 3.22 SUPERVISION — `supervision.routing.ts`

| Ruta                                        | Componente                      |
| ------------------------------------------- | ------------------------------- |
| `/supervision`                              | SupervisionMasterDashboard      |
| `/supervision/supervision-agenda`           | AgendaSupervision               |
| `/supervision/minutes-summary`              | MinutasResumen                  |
| `/supervision/tickets-report`               | ReporteTickets                  |
| `/supervision/grafico-resultado-general`    | ResultadoGeneralGrafico         |
| `/supervision/resultado-general-posicion`   | ResultadoGeneralPosicion        |
| `/supervision/areas-evaluation`             | ResultadoGeneralEvaluacionAreas |
| `/supervision/general-result-dashboard`     | ResultadoGeneralDashboard       |
| `/supervision/supervision-report`           | ReportSupervision               |
| `/supervision/presentaciones-juntas-comite` | PresentacionesJuntasComite      |

### 3.23 TICKETS — `tickets.routing.ts`

| Ruta                                               | Componente                 |
| -------------------------------------------------- | -------------------------- |
| `/tickets/groups-list`                             | TaskGroupList              |
| `/tickets/my-assignments`                          | MyAssignedTasksList        |
| `/tickets/my-requests`                             | MyRequestsTask             |
| `/tickets/messages/:ticketGroupId`                 | TaskList                   |
| `/tickets/pending-board/:ticketGroupId`            | TaskPendingBoard           |
| `/tickets/message/:ticketMessageId/:ticketGroupId` | TaskView                   |
| `/tickets/reports`                                 | TaskReport                 |
| `/tickets/summary`                                 | TaskMessageReportResumen   |
| `/tickets/work-plan`                               | TaskReportWorkPlan         |
| `/tickets/work-plan-preview`                       | TaskReportWorkPlanPreview  |
| `/tickets/weekly-report`                           | TaskMessageOperationReport |
| `/tickets/weekly-report-preview`                   | TaskWeeklyReportPreview    |
| `/tickets/legal`                                   | TicketLegalListaCliente    |
| `/tickets/legal/:ticketGroupId`                    | TaskList                   |

### 3.24 UTILITIES — `utilities.routing.ts`

| Ruta                       | Componente     |
| -------------------------- | -------------- |
| `/utilities/calculate-vat` | CalculatorList |

### 3.25 RECRUITMENT — `recruitment.routing.ts`

| Ruta                                                 | Componente                      |
| ---------------------------------------------------- | ------------------------------- |
| `/recruitment`                                       | (redirect a plantilla-interna)  |
| `/recruitment/plantilla-interna`                     | WorkPositionList                |
| `/recruitment/requests`                              | (sub-rutas)                     |
| `/recruitment/solicitudes`                           | (redirect a requests)           |
| `/recruitment/status-solicitud-baja`                 | StatusRequestDismissal          |
| `/recruitment/status-solicitud-modificacion-salario` | StatusRequestSalaryModification |
| `/recruitment/solicitudes_cliente`                   | SolicitudesClienteList          |
| `/recruitment/dismissal-requests`                    | SolicitudBajaList               |

**Sub-rutas `/recruitment/requests`:**

| Ruta                                    | Componente                |
| --------------------------------------- | ------------------------- |
| `/recruitment/requests/vacancies`       | VacantesList              |
| `/recruitment/requests/hirings`         | SolicitudAltaList         |
| `/recruitment/requests/dismissals`      | SolicitudBajaList         |
| `/recruitment/requests/salary-increase` | SolicitudModificacionList |

### 3.26 HUMAN RESOURCES — `human-resources.routing.ts` (~40 rutas)

| Ruta                                           | Componente                   |
| ---------------------------------------------- | ---------------------------- |
| `/recursos-humanos`                            | HRDashboard                  |
| `/recursos-humanos/my-requests`                | MisPermisosListado           |
| `/recursos-humanos/solicitar-permiso`          | PermisoForm                  |
| `/recursos-humanos/permiso/:id/detalle`        | PermisoDetalleAprobar        |
| `/recursos-humanos/approval`                   | PanelAprobaciones            |
| `/recursos-humanos/solicitar-vacaciones`       | VacacionesForm               |
| `/recursos-humanos/my-vacations`               | MisVacacionesListado         |
| `/recursos-humanos/vacaciones/:id/detalle`     | VacacionSolicitudDetalle     |
| `/recursos-humanos/saldo-vacaciones`           | VacacionesSaldo              |
| `/recursos-humanos/vacation-calendar`          | CalendarioVacacionesPermisos |
| `/recursos-humanos/register-past-vacations`    | VacacionesPasadasRegistro    |
| `/recursos-humanos/requests-history`           | SolicitudesHistorial         |
| `/recursos-humanos/admin-balances-vacaciones`  | AdminVacacionesBalance       |
| `/recursos-humanos/auditoria-vacaciones`       | VacacionesAdminAuditoria     |
| `/recursos-humanos/chekador-empleados`         | ChekadorList                 |
| `/recursos-humanos/contracts`                  | WorkContractList             |
| `/recursos-humanos/contract-templates`         | ContractTemplateList         |
| `/recursos-humanos/contract-addendums`         | ContractAddendumList         |
| `/recursos-humanos/addendum-templates`         | AddendumTemplateList         |
| `/recursos-humanos/incidents`                  | IncidentList                 |
| `/recursos-humanos/incident-dashboard`         | IncidentDashboardComponent   |
| `/recursos-humanos/incident-reports`           | IncidentReport               |
| `/recursos-humanos/employee-files`             | EmployeeFileList             |
| `/recursos-humanos/employee-files/:employeeId` | EmployeeFileDetail           |
| `/recursos-humanos/sanctions`                  | SanctionList                 |
| `/recursos-humanos/bank-data`                  | EmployeeBankDataList         |
| `/recursos-humanos/nomina`                     | NominaDashboard              |
| `/recursos-humanos/nomina/configuracion`       | ConfiguracionNomina          |
| `/recursos-humanos/nomina/periodos`            | PeriodosNomina               |
| `/recursos-humanos/nomina/nominas`             | Nominas                      |
| `/recursos-humanos/nomina/nominas/:id/detalle` | NominaDetalle                |
| `/recursos-humanos/nomina/incidencias`         | IncidenciasNomina            |
| `/recursos-humanos/nomina/tiempo-extra`        | TiempoExtra                  |
| `/recursos-humanos/nomina/prestamos`           | PrestamosEmpleado            |
| `/recursos-humanos/nomina/evidencias`          | EvidenciasNomina             |
| `/recursos-humanos/nomina/hoja-incidencias`    | HojaIncidencias              |

### 3.27 EMPLOYEE EVALUATION — `employee-evaluation.routing.ts`

| Ruta                                                | Componente                    |
| --------------------------------------------------- | ----------------------------- |
| `/employee-evaluation/templates/list`               | ListaPlantillaEvaluacion      |
| `/employee-evaluation/templates/create`             | FormularioPlantillaEvaluacion |
| `/employee-evaluation/templates/edit/:id`           | FormularioPlantillaEvaluacion |
| `/employee-evaluation/conduct/create`               | RealizarEvaluacion            |
| `/employee-evaluation/conduct/edit/:id`             | RealizarEvaluacion            |
| `/employee-evaluation/conduct/list`                 | ListaEvaluacionRealizada      |
| `/employee-evaluation/employee/:employeeId/history` | HistorialEvaluacion           |
| `/employee-evaluation/result/:id`                   | ResultadoEvaluacion           |

### 3.28 COMMITTEE (Mesa Directiva) — `committee.routing.ts`

| Ruta                                                    | Componente                              |
| ------------------------------------------------------- | --------------------------------------- |
| `/committee`                                            | HomeComite                              |
| `/committee/board-directors/monthly-meetings`           | ReunionesMensualesConsejoDirectivo      |
| `/committee/board-directors/meeting-minutes`            | MinutasReunionesConsejoDirectivo        |
| `/committee/board-directors/meeting-minutes-detail/:id` | MinutasReunionesConsejoDirectivoDetalle |
| `/committee/board-directors/building-insurance-policy`  | PolizaSeguroEdificio                    |
| `/committee/board-directors/financial-reports`          | InformesFinancierosConsejoDirectivo     |
| `/committee/board-directors/documents`                  | (hijos dinámicos)                       |

### 3.29 DIRECCION — `direccion.routing.ts`

| Ruta                 | Componente          |
| -------------------- | ------------------- |
| `/direccion`         | HomeDireccion       |
| `/direccion/profile` | (profile sub-rutas) |

### 3.30 INITIAL IMPLEMENTATION — `initial-implementation.routing.ts`

| Ruta                                              | Componente            |
| ------------------------------------------------- | --------------------- |
| `/initial-implementation/machinery-survey`        | MachinerySurvey       |
| `/initial-implementation/staff-evaluation`        | StaffEvaluation       |
| `/initial-implementation/pending-vendor-projects` | PendingVendorProjects |
| `/initial-implementation/active-policies`         | ActivePolicies        |

### 3.31 RECURRING TASKS — `recurring-tasks.routing.ts`

| Ruta                               | Componente        |
| ---------------------------------- | ----------------- |
| `/recurring-tasks`                 | TaskTemplateList  |
| `/recurring-tasks/:id/items`       | TaskTemplateItems |
| `/recurring-tasks/customer-config` | CustomerConfig    |
| `/recurring-tasks/my-tasks`        | DailyTaskList     |

### 3.32 ACCOUNTING (legacy) — `accounting.routing.ts`

| Ruta                                   | Componente                 |
| -------------------------------------- | -------------------------- |
| `/accounting/budget`                   | PresupuestoWebAspelWrapper |
| `/accounting/accounting-catalog`       | AccountingCatalog          |
| `/accounting/minutes-pendings`         | ContListMinutaPendientes   |
| `/accounting/funding-list`             | FundingAccountingList      |
| `/accounting/funding-details/:id`      | FundingAccountingDetail    |
| `/accounting/legal-minutes-pendings`   | LegalPendientesMinuta      |
| `/accounting/budget-execution`         | ProjectedExpensesList      |
| `/accounting/financial-report-sending` | ReporteEnvioFinancieros    |
| `/accounting/financial-statements`     | EstadoFinancieroList       |
| `/accounting/financial-summary`        | FinancialSummary           |
| `/accounting/budget-proposal`          | PresupuestoPropuesta       |
| `/accounting/aspel-customer-empresa`   | AspelCustomerEmpresaList   |
| `/accounting/aspel-sync`               | AspelSyncComponent         |

### 3.33 PUBLIC — `public.routing.ts`

| Ruta                                                                      | Componente                       |
| ------------------------------------------------------------------------- | -------------------------------- |
| `/publico/reporte-operacion/:customer/:inicio/:final`                     | ReportClient                     |
| `/publico/operation-report-client/:customer/:inicio/:final`               | OperationReportClient            |
| `/publico/reporte-minuta/:customer/:id`                                   | ReportMeeting                    |
| `/publico/reporte-ticket-pendientes-proveedor/:customerId/:departamentId` | ReporteTicketPendientesProveedor |
| `/publico/contabilidad-cliente/:customerId/:anio/:mes`                    | ContabilidadClienteWrapper       |

### 3.34 OPERATIONS — `operations.routing.ts`

| Ruta                               | Componente              |
| ---------------------------------- | ----------------------- |
| `/operations/my-building`          | MiEdificio              |
| `/operations/inventario-productos` | WarehouseStockList      |
| `/operations/extintores`           | InventarioExtintor      |
| `/operations/extintores-group`     | InventarioExtintorGroup |

### 3.35 COBRANZA — `cobranza.routes.ts`

| Ruta                                        | Componente                    |
| ------------------------------------------- | ----------------------------- |
| `/cobranza/online`                          | CobranzaOnlineWrapper         |
| `/cobranza/online/inspection`               | CobranzaOnlineInspection      |
| `/cobranza/online/analysis`                 | CobranzaOnlineAnalysis        |
| `/cobranza/online/reporte-financiero`       | CobranzaOnlineReporteFinanciero |
| `/cobranza/online/exclusions`               | CobranzaOnlineExclusions      |
| `/cobranza/online/department-charges`       | DepartmentCharges             |
| `/cobranza/online/department-payments`      | DepartmentPayments            |
| `/cobranza/online/towers`                   | CobranzaOnlineTowers          |
| `/cobranza/online/advances`                 | CobranzaOnlineAdvances        |
| `/cobranza/online/debtors`                  | CobranzaOnlineDebtors         |

---

## 4. Rutas sin Ruta en la App (BB.DD sin implementar)

Rutas definidas en `refactor-rutas-bbdd.md` que **no tienen correlato** en ningún archivo `.routing.ts`:

| Código | Nombre                       | Ruta BD                              |
| ------ | ---------------------------- | ------------------------------------ |
| 08.5   | PRESTAMO HERRAMIENTAS        | `/warehouse/tool-loan`               | ✅ existe                          |
| 16.1   | PLANTILLA INTERNA            | `/directory/staff`                   | ✅ existe                          |
| 16.2   | SOLICITUDES CLIENTE          | `/recruitment/requests`              | ✅ existe                          |
| 16.3   | SOLICITUDES                  | `/recruitment/requests/vacantes`     | ✅ existe                          |
| 18     | RESERVACIONES                | (solo icono)                         | Sin ruta asociada                  |
| 19     | PASES QR                     | (solo icono)                         | Sin ruta asociada                  |
| 20     | PAQUETERIA                   | (solo icono)                         | Sin ruta asociada                  |
| 07.2.0 | RECORRIDO DIARIO Jav         | `/logbook/equipment`                 | ❌ no existe en logbook.routing.ts |
| 21.03  | CALENDARIO DE VACACIONES     | `/human-resources/vacation-calendar` | ✅ existe                          |
| 10.04  | CONCESION BARRANCA (library) | `/library/ravine-concession`         | ✅ existe                          |
| 10.05  | CONCESION DE POZO            | `/library/well-concession`           | ✅ existe                          |
| 40.01  | JUNTA MENSUAL                | `/board-directors/monthly-meetings`  | ✅ existe (bajo /committee)        |
| 40.02  | MINUTAS (mesa directiva)     | `/board-directors/meeting-minutes`   | ✅ existe (bajo /committee)        |
| 40.03  | INFORME FINANCIERO           | `/board-directors/financial-reports` | ✅ existe (bajo /committee)        |
| 40.03  | BIBLIOTECA (mesa directiva)  | `/board-directors/documents`         | ✅ existe (bajo /committee)        |

---

## 5. Discrepancias Detectadas

| Problema                             | Detalle                                                                                                    |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| **Rutas duplicadas**                 | `02.1` tiene PRESENTACIONES y CONTABILIDAD con mismos Code                                                 |
| **Rutas sin ruta**                   | Códigos 18, 19, 20 solo tienen icono, sin path navegable                                                   |
| **Ruta `recursos-humanos`**          | La BD apunta a `recursos-humanos` (sin `/`) mientras la app usa `/recursos-humanos`                        |
| **`/logbook/equipment`**             | Ruta definida en BD (código 07.2.0) pero no existe en `logbook.routing.ts`                                 |
| **`/recruitment/requests/vacantes`** | Es ruta hija de `recruitment-requests`, no ruta directa                                                    |
| **Módulo 8 (8 módulos)**             | Las rutas `/system`, `/accounting`, `/hr`, etc. duplican funcionalidad de las rutas legacy                 |
| **Board-directors**                  | Las rutas 40.x están bajo `/committee`, no bajo ruta raíz                                                  |
| **Sin módulo físico**                | Códigos 17 (SISTEMAS), 18 (RESERVACIONES), 19 (PASES QR), 20 (PAQUETERIA) no tienen implementación visible |

---

## 6. Resumen

| Métrica                              | Valor                              |
| ------------------------------------ | ---------------------------------- |
| Archivos de routing                  | ~48                                |
| Rutas activas totales                | ~315                               |
| Rutas en BD (refactor-rutas-bbdd.md) | 138                                |
| Rutas BD sin implementar en app      | 4 (18, 19, 20, 07.2.0)             |
| Layouts principales                  | 3 (Employee, Committee, Direccion) |
| Guards de ruta                       | 7                                  |
