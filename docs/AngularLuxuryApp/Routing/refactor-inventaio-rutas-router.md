# Inventario de Navegaciones en la App

> Fecha: 2026-07-01
> Fuentes: `router.navigate()`, `router.navigateByUrl()`, `routerLink` en templates
> Total navegaciones: ~259 (182 programáticas + 77 declarativas)

---

## 1. Navegación Programática — `router.navigate()` / `router.navigateByUrl()`

### 1.1 Login / Auth

| Archivo                                      | Línea | Método          | Ruta                                   | Componente     |
| -------------------------------------------- | ----- | --------------- | -------------------------------------- | -------------- |
| `login/login/login-mobile.ts`                | 383   | `navigateByUrl` | `this.preservedRedirectUrl` (dinámico) | LoginMobile    |
| `login/login/login-mobile.ts`                | 391   | `navigate`      | `/auth/recovery-password`              | LoginMobile    |
| `login/login/login.ts`                       | 206   | `navigateByUrl` | `this.preservedRedirectUrl` (dinámico) | LoginComponent |
| `login/recovery-password/recovery-mobile.ts` | 298   | `navigate`      | `/auth/login`                          | RecoveryMobile |
| `login/reset-password/reset-password.ts`     | 335   | `navigate`      | `/auth/login`                          | ResetPassword  |

### 1.2 Core / Guards / Layout

| Archivo                                 | Línea | Método          | Ruta                          | Componente          |
| --------------------------------------- | ----- | --------------- | ----------------------------- | ------------------- |
| `core/guard/auth.guard.ts`              | 46    | `navigate`      | `/auth/login` (con returnUrl) | authGuard           |
| `core/guard/super-usuario.guard.ts`     | 14    | `navigate`      | `/dashboard`                  | superUsuarioGuard   |
| `core/guard/super-user.guard.ts`        | 37    | `navigate`      | `/unauthorized`               | superUserGuard      |
| `core/services/back-blocker.service.ts` | 60    | `navigate`      | `/dashboard`                  | BackBlockerService  |
| `core/services/connectivity.service.ts` | 41    | `navigateByUrl` | `this.lastUrl()` (dinámico)   | ConnectivityService |
| `core/services/auth.service.ts`         | 220   | `navigateByUrl` | `/auth/login`                 | AuthService         |
| `core/services/one-signal.service.ts`   | 164   | `navigateByUrl` | `customData.route` (dinámico) | OneSignalService    |
| `core/pages-extras/offline/offline.ts`  | 67    | `navigateByUrl` | `this.returnUrl` (dinámico)   | Offline             |
| `core/pages-extras/offline/offline.ts`  | 73    | `navigate`      | `/`                           | Offline             |

### 1.3 Layout

| Archivo                                                 | Línea | Método          | Ruta                             | Componente              |
| ------------------------------------------------------- | ----- | --------------- | -------------------------------- | ----------------------- |
| `layout/employee-view/.../profile-monitor.ts`           | 42    | `navigate`      | `this.profileRoute()` (dinámico) | ProfileMonitor          |
| `layout/employee-view/.../notifications-gadget.ts`      | 74    | `navigate`      | `url` (dinámico)                 | NotificationsGadget     |
| `layout/employee-view/.../header-employee-monitor.ts`   | 324   | `navigateByUrl` | `currentUrl` (dinámico)          | HeaderEmployeeMonitor   |
| `layout/employee-view/.../header-employee-monitor.ts`   | 331   | `navigateByUrl` | `/dashboard`                     | HeaderEmployeeMonitor   |
| `layout/employee-view/.../header-employee-monitor.ts`   | 335   | `navigateByUrl` | `/admin`                         | HeaderEmployeeMonitor   |
| `layout/employee-view/.../header-employee-monitor.ts`   | 339   | `navigateByUrl` | `/announcements/list`            | HeaderEmployeeMonitor   |
| `layout/employee-view/.../header-employee-monitor.ts`   | 343   | `navigateByUrl` | `/operations/my-building`        | HeaderEmployeeMonitor   |
| `layout/employee-view/.../header-employee-monitor.ts`   | 347   | `navigateByUrl` | `/directory/emergency-phones`    | HeaderEmployeeMonitor   |
| `layout/.../notifications-list-web.ts`                  | 58    | `navigateByUrl` | `url` (dinámico)                 | NotificationsListWeb    |
| `layout/.../notifications-list-mobile.ts`               | 109   | `navigateByUrl` | `url` (dinámico)                 | NotificationsListMobile |
| `layout/shared/header-mobile.ts`                        | 37    | `navigateByUrl` | `/committee`                     | HeaderCommitteeMobile   |
| `layout/direccion-view/.../header-direccion-monitor.ts` | 86    | `navigateByUrl` | `/direccion`                     | HeaderDireccionMonitor  |

### 1.4 Contabilidad

| Archivo                                              | Línea | Método          | Ruta                                         | Componente                    |
| ---------------------------------------------------- | ----- | --------------- | -------------------------------------------- | ----------------------------- |
| `accounting/.../sat-funding-list.ts`                 | 65    | `navigate`      | `/sat-funding` + id                          | SatFundingListComponent       |
| `accounting/.../sat-funding-list.ts`                 | 65    | `navigate`      | `/sat-funding` + id                          | SatFundingListComponent (dup) |
| `accounting/.../report-catalog.ts`                   | 85    | `navigate`      | `/contabilidad/reportes/nuevo`               | ReportCatalog                 |
| `accounting/.../report-catalog.ts`                   | 89    | `navigate`      | `/contabilidad/reportes/editar` + id         | ReportCatalog                 |
| `accounting/.../report-catalog.ts`                   | 93    | `navigate`      | `/contabilidad/reportes/ver` + id            | ReportCatalog                 |
| `accounting/.../report-builder.ts`                   | 455   | `navigate`      | `/contabilidad/reportes`                     | ReportBuilder                 |
| `accounting/.../report-builder.ts`                   | 459   | `navigate`      | `/contabilidad/reportes`                     | ReportBuilder                 |
| `accounting/.../cobranza-dashboard.ts`               | 87    | `navigate`      | `/cobranza-nativa/payments`                  | CobranzaDashboard             |
| `accounting/.../cobranza-nativa-dashboard.ts`        | 73    | `navigateByUrl` | `route` (dinámico)                           | CobranzaNativaDashboard       |
| `accounting/.../cobranza-online-inspection.ts`       | 169   | `navigateByUrl` | `route` (dinámico)                           | CobranzaOnlineInspection      |
| `accounting/.../cobranza-online-dashboard.ts`        | 945   | `navigateByUrl` | `route` (dinámico)                           | CobranzaOnlineDashboard       |
| `accounting/.../cobranza-online-analysis.ts`         | 227   | `navigateByUrl` | `route` (dinámico)                           | CobranzaOnlineAnalysis        |
| `accounting/.../master-dashboard.ts`                 | 35    | `navigateByUrl` | `route` (dinámico)                           | MasterDashboard               |
| `accounting/.../funding-accounting-list.ts`          | 76    | `navigateByUrl` | `/contabilidad/funding-details/${id}`        | FundingAccountingList         |
| `accounting/.../funding-list.ts`                     | 86    | `navigateByUrl` | `/funding/details/${id}`                     | FundingList                   |
| `accounting/.../create-orden-compra-fuera-fondeo.ts` | 105   | `navigateByUrl` | `/purchases/orden-compra/${result.id}`       | CreateOrdenCompraFueraFondeo  |
| `accounting/ar/.../catalogo-gastos-fijos-list.ts`    | 328   | `navigate`      | `/catalogo-gastos-fijos/create`              | CatalogoGastosFijosList       |
| `accounting/ar/.../catalogo-gastos-fijos-list.ts`    | 331   | `navigate`      | `/catalogo-gastos-fijos/edit` + id           | CatalogoGastosFijosList       |
| `accounting/ar/.../catalogo-gastos-fijos-list.ts`    | 335   | `navigate`      | `/purchases/catalogo-gastos-fijos-form` + id | CatalogoGastosFijosList       |

### 1.5 Recursos Humanos

| Archivo                                | Línea | Método          | Ruta                                          | Componente               |
| -------------------------------------- | ----- | --------------- | --------------------------------------------- | ------------------------ |
| `hr/.../vacacion-solicitud-detalle.ts` | 48    | `navigate`      | `/recursos-humanos/my-vacations`              | VacacionSolicitudDetalle |
| `hr/.../vacacion-solicitud-detalle.ts` | 65    | `navigate`      | `/recursos-humanos/my-vacations`              | VacacionSolicitudDetalle |
| `hr/.../vacacion-solicitud-detalle.ts` | 76    | `navigate`      | `/recursos-humanos/approval`                  | VacacionSolicitudDetalle |
| `hr/.../vacacion-solicitud-detalle.ts` | 91    | `navigate`      | `/recursos-humanos/approval`                  | VacacionSolicitudDetalle |
| `hr/.../permiso-detalle-aprobar.ts`    | 46    | `navigate`      | `/recursos-humanos/my-requests`               | PermisoDetalleAprobar    |
| `hr/.../permiso-detalle-aprobar.ts`    | 63    | `navigate`      | `/recursos-humanos/my-requests`               | PermisoDetalleAprobar    |
| `hr/.../permiso-detalle-aprobar.ts`    | 78    | `navigate`      | `/recursos-humanos/approval`                  | PermisoDetalleAprobar    |
| `hr/.../permiso-detalle-aprobar.ts`    | 97    | `navigate`      | `/recursos-humanos/approval`                  | PermisoDetalleAprobar    |
| `hr/.../employee-file-list.ts`         | 87    | `navigate`      | `/recursos-humanos/employee-files` + id       | EmployeeFileList         |
| `hr/.../employee-file-detail.ts`       | 182   | `navigate`      | `/recursos-humanos/employee-files`            | EmployeeFileDetail       |
| `hr/.../mis-vacaciones-listado.ts`     | 97    | `navigate`      | `/recursos-humanos/saldo-vacaciones`          | MisVacacionesListado     |
| `hr/.../mis-vacaciones-listado.ts`     | 100   | `navigate`      | `/recursos-humanos/vacaciones` + id + detalle | MisVacacionesListado     |
| `hr/.../nominas.ts`                    | 87    | `navigateByUrl` | `/rh/nomina/nominas/${id}/detalle`            | Nominas                  |
| `hr/.../nomina-dashboard.ts`           | 618   | `navigateByUrl` | `route` (dinámico)                            | NominaDashboard          |
| `hr/.../hr-dashboard.ts`               | 335   | `navigateByUrl` | `route` (dinámico)                            | HRDashboard              |
| `hr/.../employee-form.ts`              | 77    | `navigate`      | `/directory/empleados/interno`                | EmployeeForm             |
| `hr/.../staff-board.ts`                | 205   | `navigateByUrl` | `/directory/work-position-org-chart`          | StaffBoard               |
| `hr/.../staff-board.ts`                | 311   | `navigateByUrl` | `directory/empleado/${id}/${appId}`           | StaffBoard               |
| `hr/.../staff-board.ts`                | 325   | `navigateByUrl` | `/recursos-humanos/employee-files/${id}`      | StaffBoard               |
| `hr/.../employee-list.ts`              | 152   | `navigateByUrl` | `urlApi` (dinámico)                           | EmployeeList             |

### 1.6 Evaluaciones de Empleado

| Archivo                                                  | Línea | Método     | Ruta                                       | Componente                    |
| -------------------------------------------------------- | ----- | ---------- | ------------------------------------------ | ----------------------------- |
| `hr/evaluaciones/.../realizar-evaluacion.ts`             | 283   | `navigate` | `/employee-evaluation/conduct/edit` + id   | RealizarEvaluacion            |
| `hr/evaluaciones/.../lista-evaluacion-realizada.ts`      | 95    | `navigate` | `/employee-evaluation/conduct/create`      | ListaEvaluacionRealizada      |
| `hr/evaluaciones/.../lista-evaluacion-realizada.ts`      | 98    | `navigate` | `/employee-evaluation/conduct/edit` + id   | ListaEvaluacionRealizada      |
| `hr/evaluaciones/.../lista-evaluacion-realizada.ts`      | 101   | `navigate` | `/employee-evaluation/result` + id         | ListaEvaluacionRealizada      |
| `hr/evaluaciones/.../formulario-plantilla-evaluacion.ts` | 215   | `navigate` | `/employee-evaluation/templates/edit` + id | FormularioPlantillaEvaluacion |

### 1.7 Compras

| Archivo                                   | Línea | Método          | Ruta                                       | Componente                |
| ----------------------------------------- | ----- | --------------- | ------------------------------------------ | ------------------------- |
| `purchasing/.../solicitud-compra-list.ts` | 130   | `navigateByUrl` | `/purchases/solicitud-compra/${id}`        | SolicitudCompraList       |
| `purchasing/.../solicitud-compra-list.ts` | 214   | `navigate`      | `/purchases/solicitud-compra-presentacion` | SolicitudCompraList       |
| `purchasing/.../solicitud-compra-list.ts` | 248   | `navigateByUrl` | `/purchases/cuadro-comparativo/${id}`      | SolicitudCompraList       |
| `purchasing/.../solicitud-compra-list.ts` | 265   | `navigateByUrl` | `/purchases/orden-compra/${0}/${id}`       | SolicitudCompraList       |
| `purchasing/.../solicitud-compra-list.ts` | 269   | `navigateByUrl` | `/purchases/orden-compra/${id}`            | SolicitudCompraList       |
| `purchasing/.../pdf-solicitud-compra.ts`  | 69    | `navigate`      | `/purchases/solicitud-compra` + id         | PdfSolicitudCompra        |
| `purchasing/.../solicitud-compra.ts`      | 292   | `navigateByUrl` | `/purchases/orden-compra/${id}`            | SolicitudCompra           |
| `purchasing/.../solicitud-compra.ts`      | 298   | `navigateByUrl` | `/purchases/orden-compra/${id}`            | SolicitudCompra           |
| `purchasing/.../solicitud-pago-pdf.ts`    | 51    | `navigate`      | `/purchases/purchase-orders`               | SolicitudPagoPdfComponent |
| `purchasing/.../solicitud-pago-pdf.ts`    | 60    | `navigate`      | `/purchases/purchase-orders`               | SolicitudPagoPdfComponent |
| `purchasing/.../solicitud-pago-pdf.ts`    | 69    | `navigate`      | `/purchases/orden-compra` + id             | SolicitudPagoPdfComponent |
| `purchasing/.../orden-compra-pdf.ts`      | 41    | `navigate`      | `/purchases/purchase-orders`               | OrdenCompraPdf            |
| `purchasing/.../orden-compra-pdf.ts`      | 53    | `navigate`      | `/purchases/orden-compra` + id             | OrdenCompraPdf            |
| `purchasing/.../orden-compra-list.ts`     | 263   | `navigateByUrl` | `/purchases/orden-compra/${id}`            | OrdenCompraList           |
| `purchasing/.../create-orden-compra.ts`   | 143   | `navigateByUrl` | `/purchases/orden-compra/${result.id}`     | CreateOrdenCompra         |
| `purchasing/.../purchase-request.ts`      | 98    | `navigateByUrl` | `route` (dinámico)                         | PurchaseRequest           |

### 1.8 Operaciones / Task Engine

| Archivo                                               | Línea | Método     | Ruta                             | Componente                 |
| ----------------------------------------------------- | ----- | ---------- | -------------------------------- | -------------------------- |
| `operations/task/.../task-list.ts`             | 492   | `navigate` | `/tickets/message/` + ids        | TaskList                   |
| `operations/task/.../task-list.ts`             | 615   | `navigate` | `/tickets/weekly-report-preview` | TaskList                   |
| `operations/task/.../task-list.ts`             | 665   | `navigate` | `/tickets/work-plan-preview`     | TaskList                   |
| `operations/task/.../task-list.ts`             | 669   | `navigate` | `/tickets/pending-board` + id    | TaskList                   |
| `operations/task/.../task-view.ts`             | 223   | `navigate` | `/Tasks/messages` + id           | TaskView                   |
| `operations/task/.../task-pending-board.ts`    | 67    | `navigate` | `/tickets/messages` + id         | TaskPendingBoard           |
| `operations/task/.../task-group-list.ts`       | 170   | `navigate` | `/tickets/messages/` + id        | TaskGroupList              |
| `operations/task/.../task-report-work-plan.ts` | 109   | `navigate` | `/tickets/work-plan-preview`     | TaskReportWorkPlan         |
| `operations/task/.../task-operation-report.ts` | 192   | `navigate` | `/tickets/weekly-report-preview` | TaskMessageOperationReport |
| `operations/task/.../task-template-list.ts`    | 75    | `navigate` | `/recurring-tasks` + id + items  | TaskTemplateList           |

### 1.9 Operaciones / Juntas y Comités

| Archivo                                                   | Línea   | Método          | Ruta                                         | Componente                 |
| --------------------------------------------------------- | ------- | --------------- | -------------------------------------------- | -------------------------- |
| `operations/meetings/.../juntas-mensuales-session.ts`     | 217     | `navigateByUrl` | `/calendars/google-calendar`                 | JuntasMensualesSession     |
| `operations/meetings/.../juntas-mensuales-session.ts`     | 231     | `navigateByUrl` | `/committee-meetings/presentations-contador` | JuntasMensualesSession     |
| `operations/meetings/.../juntas-mensuales-session.ts`     | 233     | `navigateByUrl` | `/committee-meetings/presentations`          | JuntasMensualesSession     |
| `operations/meetings/.../juntas-mensuales-session.ts`     | 240-243 | `navigate`      | `/committee-meetings/gestion-minuta` + id    | JuntasMensualesSession     |
| `operations/meetings/.../juntas-mensuales-session.ts`     | 247     | `navigateByUrl` | `/committee-meetings/minutes`                | JuntasMensualesSession     |
| `operations/meetings/.../juntas-mensuales-session.ts`     | 263-266 | `navigate`      | `/committee-meetings/gestion-minuta` + id    | JuntasMensualesSession     |
| `operations/meetings/.../home-comite.ts`                  | 99      | `navigate`      | `route` (relativo)                           | HomeComite                 |
| `operations/meetings/.../biblioteca-consejo-directivo.ts` | 126     | `navigate`      | `route` (relativo)                           | BibliotecaConsejoDirectivo |
| `operations/meetings/.../minutas-list.ts`                 | 297     | `navigate`      | `/committee-meetings/resumen-minuta` + id    | MinutasList                |

### 1.10 Operaciones / Manuales y Diagramas

| Archivo                                                  | Línea | Método          | Ruta                                                   | Componente                |
| -------------------------------------------------------- | ----- | --------------- | ------------------------------------------------------ | ------------------------- |
| `operations/manuals/.../manuals-and-processes-list.ts`   | 178   | `navigate`      | `/library/manuals-and-processes/detail` + id           | ManualsAndProcessesList   |
| `operations/manuals/.../manuals-and-processes-list.ts`   | 182   | `navigate`      | `/library/manuals-and-processes/editor` + id           | ManualsAndProcessesList   |
| `operations/manuals/.../manuals-and-processes-detail.ts` | 145   | `navigate`      | `/library/manuals-and-processes`                       | ManualsAndProcessesDetail |
| `operations/manuals/.../manuals-and-processes-detail.ts` | 149   | `navigate`      | `/library/manuals-and-processes/editor` + id           | ManualsAndProcessesDetail |
| `operations/manuals/.../manuals-and-processes-guide.ts`  | 31    | `navigate`      | `/library/manuals-and-processes/list`                  | ManualsAndProcessesGuide  |
| `operations/manuals/.../manuals-and-processes-editor.ts` | 481   | `navigate`      | `/library/manuals-and-processes/flowchart-editor` + id | ManualsAndProcessesEditor |
| `operations/manuals/.../manuals-and-processes-editor.ts` | 609   | `navigate`      | `/library/manuals-and-processes`                       | ManualsAndProcessesEditor |
| `operations/manuals/.../manual-flowchart-editor.ts`      | 137   | `navigateByUrl` | `this.returnTo()` (dinámico)                           | ManualFlowchartEditor     |
| `operations/diagram/.../diagram-list.ts`                | 102   | `navigate`      | `/diagram/editor` + id                                 | DiagramList               |
| `operations/diagram/.../diagram-list.ts`                | 106   | `navigate`      | `/diagram/view` + id                                   | DiagramList               |
| `operations/diagram/.../diagram-list.ts`                | 110   | `navigate`      | `/diagram/gallery`                                     | DiagramList               |
| `operations/diagram/.../diagram-editor.ts`              | 93    | `navigate`      | `/diagram`                                             | DiagramEditor             |
| `operations/diagram/.../diagram-gallery.ts`             | 122   | `navigate`      | `/diagram/view` + id                                   | DiagramGallery            |
| `operations/diagram/.../diagram-gallery.ts`             | 126   | `navigate`      | `/diagram`                                             | DiagramGallery            |

### 1.11 Operaciones / Inventarios

| Archivo                                                    | Línea | Método     | Ruta                                  | Componente               |
| ---------------------------------------------------------- | ----- | ---------- | ------------------------------------- | ------------------------ |
| `operations/inventarios/.../warehouse-list.ts`             | 137   | `navigate` | `/warehouse/products` + id            | WarehouseList            |
| `operations/inventarios/.../inventario-extintor.ts`        | 103   | `navigate` | `/logbook/fire-extinguisher-log` + id | InventarioExtintor       |
| `operations/inventarios/.../inventario-extintor.ts`        | 107   | `navigate` | `/logbook/fire-equipment-scanner`     | InventarioExtintor       |
| `operations/inventarios/.../inventario-extintor.ts`        | 111   | `navigate` | `/logbook/fire-inspection-periods`    | InventarioExtintor       |
| `operations/inventarios/.../inventario-hidrante.ts`        | 94    | `navigate` | `/logbook/fire-equipment-scanner`     | InventarioHidrante       |
| `operations/inventarios/.../inventario-hidrante.ts`        | 106   | `navigate` | `/logbook/hydrant-log` + id           | InventarioHidrante       |
| `operations/inventarios/.../inventario-hidrante.ts`        | 110   | `navigate` | `/logbook/fire-inspection-periods`    | InventarioHidrante       |
| `operations/inventarios/.../inventario-estacion-manual.ts` | 94    | `navigate` | `/logbook/fire-equipment-scanner`     | InventarioEstacionManual |
| `operations/inventarios/.../inventario-estacion-manual.ts` | 106   | `navigate` | `/logbook/manual-call-point-log` + id | InventarioEstacionManual |
| `operations/inventarios/.../inventario-estacion-manual.ts` | 110   | `navigate` | `/logbook/fire-inspection-periods`    | InventarioEstacionManual |
| `operations/inventarios/.../inventario-detector-humo.ts`   | 94    | `navigate` | `/logbook/fire-equipment-scanner`     | InventarioDetectorHumo   |
| `operations/inventarios/.../inventario-detector-humo.ts`   | 106   | `navigate` | `/logbook/smoke-detector-log` + id    | InventarioDetectorHumo   |
| `operations/inventarios/.../inventario-detector-humo.ts`   | 110   | `navigate` | `/logbook/fire-inspection-periods`    | InventarioDetectorHumo   |
| `operations/inventarios/.../ordenes-servicio.ts`           | 337   | `navigate` | `/tickets/ticket-messages` + ids      | OrdenesServicio          |

### 1.12 Operaciones / Dashboards y Supervisión

| Archivo                                                    | Línea | Método          | Ruta                       | Componente                    |
| ---------------------------------------------------------- | ----- | --------------- | -------------------------- | ----------------------------- |
| `operations/dashboard/unified-pending-dashboard.ts`        | 310   | `navigateByUrl` | `item.urlRoute` (dinámico) | UnifiedPendingDashboard       |
| `operations/dashboard/unified-pending-dashboard-mobile.ts` | 187   | `navigateByUrl` | `item.urlRoute` (dinámico) | UnifiedPendingDashboardMobile |
| `operations/supervision/.../master-dashboard.ts`           | 21    | `navigateByUrl` | `route` (dinámico)         | SupervisionMasterDashboard    |

### 1.13 Mantenimiento / Equipo Contra Incendios

| Archivo                                                         | Línea   | Método          | Ruta                                   | Componente                 |
| --------------------------------------------------------------- | ------- | --------------- | -------------------------------------- | -------------------------- |
| `maintenance/fire-equipment/.../detector-humo-checklist.ts`     | 117     | `navigate`      | `/logbook/smoke-detector-log` + id     | DetectorHumoChecklist      |
| `maintenance/fire-equipment/.../qr-scanner.ts`                  | 92      | `navigate`      | `/logbook/equipment-inspection` + code | QrScanner                  |
| `maintenance/fire-equipment/.../qr-scanner.ts`                  | 104     | `navigate`      | `route` + id (dinámico)                | QrScanner                  |
| `maintenance/fire-equipment/.../qr-scanner.ts`                  | 124     | `navigate`      | `route` + id (dinámico)                | QrScanner                  |
| `maintenance/fire-equipment/.../estacion-manual-checklist.ts`   | 120     | `navigate`      | `/logbook/manual-call-point-log` + id  | EstacionManualChecklist    |
| `maintenance/fire-equipment/.../fire-inspection-period-list.ts` | 117     | `navigate`      | `/logbook` + segment + id              | FireInspectionPeriodList   |
| `maintenance/fire-equipment/.../fire-inspection-cycle-list.ts`  | 62      | `navigate`      | `/logbook/fire-inspection-cycle` + id  | FireInspectionCycleList    |
| `maintenance/fire-equipment/.../hidrante-checklist.ts`          | 135     | `navigate`      | `/logbook/hydrant-log` + id            | HidranteChecklist          |
| `maintenance/fire-equipment/.../extintor-checklist.ts`          | 117-120 | `navigate`      | `/logbook/fire-extinguisher-log` + id  | ExtintorChecklist          |
| `maintenance/equipment/.../equipment-inspection-qr-entry.ts`    | 50      | `navigateByUrl` | `/inventory/areas-equipment`           | EquipmentInspectionQrEntry |
| `maintenance/logs/.../medidores-list.ts`                        | 173     | `navigate`      | `/logbook/lista-medidor-lectura` + id  | MedidoresList              |
| `maintenance/logs/.../medidores-list.ts`                        | 177     | `navigate`      | `/logbook/grafico` + id                | MedidoresList              |

### 1.14 Legal

| Archivo                                     | Línea | Método     | Ruta               | Componente                 |
| ------------------------------------------- | ----- | ---------- | ------------------ | -------------------------- |
| `legal/.../home-comite.ts`                  | 99    | `navigate` | `route` (relativo) | HomeComite                 |
| `legal/.../biblioteca-consejo-directivo.ts` | 126   | `navigate` | `route` (relativo) | BibliotecaConsejoDirectivo |

### 1.15 Reclutamiento

| Archivo                                                 | Línea | Método          | Ruta                                      | Componente                      |
| ------------------------------------------------------- | ----- | --------------- | ----------------------------------------- | ------------------------------- |
| `recruitment/.../solicitudes-cliente-list.ts`           | 94    | `navigate`      | `/reclutamiento/status-solicitud-vacante` | SolicitudesClienteList          |
| `recruitment/.../status-request-salary-modification.ts` | 41    | `navigateByUrl` | `/reclutamiento/plantilla-interna`        | StatusRequestSalaryModification |
| `recruitment/.../status-request-dismissal.ts`           | 49    | `navigateByUrl` | `/reclutamiento/plantilla-interna`        | StatusRequestDismissal          |
| `recruitment/.../solicitud-baja-form.ts`                | 261   | `navigateByUrl` | `/employee-evaluation/conduct/list`       | SolicitudBajaForm               |

### 1.16 Anuncios

| Archivo                                                   | Línea | Método     | Ruta                         | Componente            |
| --------------------------------------------------------- | ----- | ---------- | ---------------------------- | --------------------- |
| `operations/announcements/.../announcement-list.ts`       | 70    | `navigate` | `../detail` + id (relativo)  | AnnouncementList      |
| `operations/announcements/.../announcement-admin-list.ts` | 132   | `navigate` | `/announcements/detail` + id | AnnouncementAdminList |

---

## 2. Navegación Declarativa — `routerLink` en Templates

### 2.1 `routerLink` Estático (23 ocurrencias)

| Archivo                                                    | Ruta                                      | Contexto           |
| ---------------------------------------------------------- | ----------------------------------------- | ------------------ |
| `core/pages-extras/unauthorized/unauthorized.html`         | `/`                                       | Volver al inicio   |
| `core/pages-extras/unauthorized/unauthorized.html`         | `/auth/login`                             | Ir a login         |
| `core/pages-extras/page500/page500.html`                   | `/`                                       | Volver al inicio   |
| `core/pages-extras/page404/page404.html`                   | `/`                                       | Volver al inicio   |
| `core/pages-extras/maintenance/maintenance.html`           | `/`                                       | Volver al inicio   |
| `core/pages-extras/comingsoon/comingsoon.html`             | `/`                                       | Volver al inicio   |
| `maintenance/logs/.../recepcion-pipas-agua-list.html`      | `/logbook/water-truck-reception`          | Pestaña navegación |
| `maintenance/logs/.../recepcion-pipas-agua-list.html`      | `/logbook/water-truck-reception/reporte`  | Pestaña navegación |
| `maintenance/logs/.../recepcion-pipas-agua-list.html`      | `/logbook/water-truck-reception/analisis` | Pestaña navegación |
| `accounting/.../funding-detail.html`                       | `/purchases/fixed-expenses-catalog`       | Enlace a catálogo  |
| `accounting/.../report-guide.html`                         | `/contabilidad/reportes/nuevo`            | Crear reporte      |
| `accounting/.../report-catalog.html`                       | `/contabilidad/reportes/guia`             | Guía de reportes   |
| `operations/announcements/.../announcement-detail.html`    | `../` (relativo)                          | Volver             |
| `operations/announcements/.../announcement-analytics.html` | `/announcements/manage`                   | Volver a admin     |
| `operations/manuals/.../manuals-and-processes-guide.html`  | `/settings/ui-catalog`                    | Ir a catálogo UI   |
| `operations/meetings/.../meeting-management.html`          | `/junta-comite/list-minutas`              | Volver a minutas   |
| `purchasing/.../purchase-request-list.html`                | `/purchase-request/detail/{{item.id}}`    | Detalle solicitud  |

### 2.2 `[routerLink]` Dinámico (54 ocurrencias)

| Archivo                                                            | Ruta / Binding                                                              | Contexto                        |
| ------------------------------------------------------------------ | --------------------------------------------------------------------------- | ------------------------------- |
| `layout/.../profile-user.html`                                     | `[profileRoute()]`                                                          | Perfil usuario                  |
| `login/login/login.html`                                           | `['/auth/recovery-password']`                                               | Recuperar contraseña            |
| `login/recovery-password/recover-password.html`                    | `['/auth/login']`                                                           | Volver a login                  |
| `layout/.../notifications-gadget.html`                             | `['/notifications']`                                                        | Notificaciones                  |
| `layout/.../sidebar.html`                                          | `item.routerLink`                                                           | Menú lateral (sidebar dinámico) |
| `layout/.../profile-committee-monitor.html`                        | `['/profile/update-user-profile']`                                          | Perfil comité                   |
| `layout/.../home-menu-mobile.html`                                 | `subItem.routerLink` / `item.routerLink`                                    | Menú inicio móvil               |
| `layout/.../footer-employee-mobile.html`                           | `item.link \|\| []`                                                         | Footer móvil                    |
| `purchasing/.../solicitud-compra.html`                             | `['/purchases/pdf-solicitud-compra', id]`                                   | PDF solicitud                   |
| `system/.../settings-home.html`                                    | `item.routerLink`                                                           | Menú configuración              |
| `recruitment/.../filter-requests.html`                             | `['/recruitment/requests/', item.path]`                                     | Filtro solicitudes              |
| `operations/task/.../task-report.html`                      | `['/tickets/weekly-report']`                                                | Reporte semanal                 |
| `operations/task/.../task-report.html`                      | `['/tickets/work-plan']`                                                    | Plan de trabajo                 |
| `operations/task/.../task-report.html`                      | `['/tickets/resumen']`                                                      | Resumen                         |
| `maintenance/logs/.../piscina-list.html`                           | `['/logbook/piscina-bitacora/', item.id]`                                   | Bitácora alberca                |
| `purchasing/.../orden-compra-datos-cotizacion.html`                | `['/purchases/solicitud-compra/', id]`                                      | Vínculo solicitud               |
| `purchasing/.../orden-compra.html`                                 | `['//purchases/cuadro-comparativo/', id]`                                   | Cuadro comparativo              |
| `legal/.../home-comite.html`                                       | `[option.routeParam]`                                                       | Menú comité legal               |
| `legal/.../minutas-reuniones-consejo-directivo.html`               | `['../meeting-minutes-detail', item.id]`                                    | Detalle minuta                  |
| `legal/.../biblioteca-consejo-directivo.html`                      | `[category.routeParam]`                                                     | Biblioteca consejo              |
| `core/components/.../data-view-mobile.html`                        | `item.routerLink`                                                           | Vista móvil genérica            |
| `accounting/.../catalogo-gastos-fijos-list.html`                   | `['/purchases/catalogo-gastos-fijos-form', id]`                             | Form gasto fijo                 |
| `operations/announcements/.../announcement-admin-list.html`        | `['/announcements/analytics', id]`                                          | Analytics anuncio               |
| `operations/service-orders/.../ordenes-servicio-list.html`          | `['/report/maintenance-report/soporte-orden-servicio', id]`                 | Soporte OS                      |
| `operations/inspecciones/.../maintenance-reports-list.html`        | `[item.route]`                                                              | Reportes mtto                   |
| `operations/inspecciones/.../mis-inspecciones-lista.html`          | `['/inspections/result', id]` / `['/logbook/my-inspection', id]`            | Inspecciones                    |
| `operations/inspecciones/.../lista-inspecciones.html`              | `['/inspections/inspection-report-list']` / `['/inspections/details/', id]` | Lista inspecciones              |
| `operations/meetings/.../minutas-reuniones-consejo-directivo.html` | `['../meeting-minutes-detail', item.id]`                                    | Detalle minuta                  |
| `operations/meetings/.../home-comite.html`                         | `[option.routeParam]`                                                       | Menú comité ops                 |
| `operations/meetings/.../biblioteca-consejo-directivo.html`        | `[category.routeParam]`                                                     | Biblioteca consejo              |
| `operations/meetings/.../minutas-list.html`                        | `['/committee-meetings/minuta-pendientes']`                                 | Pendientes minuta               |
| `operations/meetings/.../minutas-list.html`                        | `['/committee-meetings/seguimiento-minutas/operaciones']`                   | Seguimiento minuta              |
| `operations/meetings/.../minutas-list.html`                        | `['/committee-meetings/gestion-minuta', item.id]`                           | Gestión minuta                  |

### 2.3 Definiciones de Ruta en Datos de Menú (TypeScript)

| Archivo                                            | Cantidad     | Detalle                                                       |
| -------------------------------------------------- | ------------ | ------------------------------------------------------------- |
| `core/interfaces/menu.model.ts`                    | 3 interfaces | `routerLink: string` en IMenuItem, ISubMenuItem, SearchResult |
| `core/services/menu.service.ts`                    | Lógica       | Filtrado de rutas permitidas por rol                          |
| `core/services/search.service.ts`                  | Lógica       | Búsqueda en items de menú por routerLink                      |
| `layout/.../sidebar.ts`                            | ~70 items    | Catálogo UI sidebar con `routerLink`                          |
| `features/system/.../settings-menu.ts`             | ~35 items    | Menú de configuración con `routerLink`                        |
| `features/system/.../customer-modul.interfaces.ts` | 1 interfaz   | `routerLink: string`                                          |

---

## 3. Resumen

| Tipo                                  | Cantidad |
| ------------------------------------- | -------- |
| `router.navigate()` programático      | ~102     |
| `router.navigateByUrl()` programático | ~66      |
| `routerLink` estático en HTML         | 23       |
| `[routerLink]` dinámico en HTML       | 54       |
| Archivos con navegación               | ~103     |
| **Total navegaciones**                | **~259** |

### Rutas más navegadas (top 10)

| Ruta                                     | Veces |
| ---------------------------------------- | ----- |
| `/auth/login`                            | 5     |
| `/purchases/orden-compra/:id`            | 5     |
| `/purchases/purchase-orders`             | 4     |
| `/recursos-humanos/approval`             | 4     |
| `/recursos-humanos/my-vacations`         | 3     |
| `/recursos-humanos/my-requests`          | 3     |
| `/contabilidad/reportes`                 | 3     |
| `/logbook/fire-inspection-periods`       | 4     |
| `/logbook/fire-equipment-scanner`        | 4     |
| `/committee-meetings/gestion-minuta/:id` | 3     |

### Patrones Detectados

1. **Rutas inconsistentes**: `/Tasks` vs `/tasks` vs `/tickets` (case-sensitive)
2. **Rutas huérfanas**: `/reclutamiento/status-solicitud-vacante`, `/rh/nomina/nominas/:id/detalle`, `/directory/empleados/interno` no existen en archivos .routing.ts
3. **Rutas relativas**: `../detail`, `../meeting-minutes-detail` en templates (frágil ante cambios de estructura)
4. **Rutas dinámicas desde BD**: `item.urlRoute`, `item.routerLink`, `customData.route` (sin tipo seguro)
5. **Duplicación legacy**: Mismas rutas existen en `features/` y `routing/` (módulo 8 vs módulo legacy)
