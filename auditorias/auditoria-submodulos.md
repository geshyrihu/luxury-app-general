# Auditoria de Submodulos - LuxuryApp

**Fecha:** 2026-09-09 00:13
**Regla:** Un submódulo vive en un único módulo padre (2.2 CONVENTIONSFOLDER.MD)

---

## Backend - Resumen

**Ruta:** `D:\repos\luxuryapp-api\api\LuxuryApp.Application\Modules`

| Modulo | Submodulos | Total |
|--------|-----------|-------|
| AdminLuxuryApp | CatalogosGenerales, ConfiguracionSistema, GestionDeCliente, Infraestructura, SeguridadPermisos | 5 |
| AuthLuxuryApp | AccountRecovery, Auth, Identity, PasswordManager, ProfileUsers | 5 |
| CobranzaLuxuryApp | AspelCobranzaHausLive, AspelCobranzaHausLocal, CobranzaNativa, CobranzaOnline | 4 |
| CommitteeLuxuryApp | DTOs, EndPoints, Interfaces, Services | 4 |
| ComprasLuxuryApp | HistorialCompras, PurchaseOrders, SolicitudesCompra | 3 |
| ContabilidadLuxuryApp | AccountingCatalog, AutitoriaCuentasAspel, CatalogoGastosFijos, ContabilidadConfig, ContabilidadMigration, ContabilidadOnline, DynamicReports, EspejoAspelFull, ExpenseCatalogBudget, ExpenseCatalogDetail, FinancialAccounting, Fondeos, FundingFile, MaintenanceReport, Persistence, Presupuesto, PresupuestoPropuesta, PresupuestoShared, PresupuestoWebAspel, ProjectedExpenses, Reports, Shared | 22 |
| DireccionLuxuryApp | JuntasMensuales | 1 |
| LegalLuxuryApp | EmployeeContracts, Employees, Legal | 3 |
| MantenimientoLuxuryApp | BudgetMaintenance, CalendarioMaestro, CalendarioMaestroEquipo, ElevatorEmergencyCall, ElevatorSpareParts, EquipmentInspections, FireEquipment, FireExtinguisherInventory, FireExtinguisherLog, FireInspectionPeriods, HydrantInventory, HydrantLog, Machinery, MachineryAsset, MachineryDocument, MaintenanceCalendars, MaintenanceLog, ManualCallPointInventory, ManualCallPointLog, Medidores, Persistence, Piscina, PiscinaBitacora, RecepcionPipasAgua, SmokeDetectorInventory, SmokeDetectorLog, ToolLoan | 27 |
| OperationsLuxuryApp | AccessControl, Announcement, BuildingCustomer, Comite, CustomDocument, Dashboard, DeliveryReception, Diagram, DireccionDashboard, GoogleCalendar, IncidenciasAdministrativas, Inspections, Inventory, JuntasMensuales, MiEdificio, Owner, PanicAlert, Persistence, Property, PropertyOccupant, Recruitment, ResumenGeneral, ScheduledTasks, ServiceOrder, Supervision, Tasks, WorkPosition | 27 |
| ReclutamientoLuxuryApp | CandidateApplications, CandidateProcesses, Candidates, CandidatesWorkExperience, CustomerProviders, Employee, EmployeeBankData, EmployeeBeneficiary, EmployeeClinicalData, EmployeeDocument, EmployeeEmergenContact, EmployeeFile, Employees, InterviewerMatrices, JobDescriptions, Notifications, Persistence, ProviderSupports, RecruitmentRequests, RecruitmentSourceCatalogs, RecurringTasks, RequestDismissalDiscounts, RequestDismissals, RequestEmployeeRegisters, RequestPositions, SalaryModifications, Shared, SolicitudAltas, SolicitudBajas, SolicitudModificacionesSueldo, SolicitudVacantes, WorkPositions | 32 |
| RecursosHumanosLuxuryApp | ChekadorEmpleados, Evaluacion, ManualsAndProcesses, Nomina, Notifications, Persistence, TimeOff | 7 |
| ResidentesLuxuryApp |  | 0 |
| SupplierLuxuryApp | Provider, ProviderQualification, Purchases | 3 |
| SystemLuxuryApp | Approvals, Common, ConfiguracionSistema, Diagnostics, Persistence, SelectItem, SendEmailGlobal, SystemAI, SystemAuditLogs, SystemTenant | 10 |

## Frontend - Resumen

**Ruta:** `D:\repos\luxuryapp-api\appsweb\angular\src\app\apps`

| Modulo | Submodulos | Total |
|--------|-----------|-------|
| admin.luxuryapp | access-control, admin-wrapper, analisis-registros, catalogos-generales, configuracion-correo, configuracion-sistema, herramientas-dev, reportes, seguridad-permisos | 9 |
| auth.luxuryapp | login, password-manager, recovery-code, recovery-password, reset-password, user-profile | 6 |
| cobranza.luxuryapp | aspel-cobranza-haus, cobranza-nativa, cobranza-online | 3 |
| committee.luxuryapp | board-directors-financial-reports, board-directors-library, board-directors-meeting-minutes, board-directors-monthly-meetings, cobranza, directorio, home-committee, interfaces, poliza-seguro-edificio, profile | 10 |
| compras.luxuryapp | historial-compras, solicitudes-compras | 2 |
| contabilidad.luxuryapp | ar, budgeting, fondeos-y-reporteo, general-ledger, mock-aspel | 5 |
| direccion.luxuryapp | home-direccion, juntas-comite | 2 |
| legal.luxuryapp | asuntos-legales-y-seguros, comite-vigilancia, employees-contracts | 3 |
| mantenimiento.luxuryapp | catalogos-tickets-mantenimiento, equipos-y-maquinaria, fire-equipment, inspection, logs, planificacin-de-mantenimiento, reports-mantenance | 7 |
| operations.luxuryapp | announcements, custom-documents, dashboard, diagrams, directorios, field-service, google-calendar, incidencias-sanciones, initial-implementation, inspecciones-y-auditora, inventarios-y-almacn, manuals, meetings, panic-alert, properties, reclutamiento-solicitudes, reports, staff-board, supervision, task-engine, templates, work-position | 22 |
| public.luxuryapp | telefonos-emergencia | 1 |
| reclutamiento.luxuryapp | candidate, candidate-application, candidate-applications, candidate-interview, candidate-interviewer-queue, candidate-recruitment-interviews, candidate-work-position-candidates, candidates, employee, employee-bank-data, employee-beneficiary, employee-clinical-data, employee-document, employee-emergen-contact, employee-external, expediente-del-empleado, reclutamiento-y-altas-bajas, solicitud-alta, solicitud-altas, solicitud-baja, solicitud-bajas, solicitud-modificacion-sueldo, solicitud-modificaciones-sueldo, solicitud-vacante, solicitud-vacantes, work-position, work-positions | 27 |
| recursos-humanos.luxuryapp | chekador-empleados, evaluaciones-de-desempeo, expediente-del-empleado, interfaces, recursos-humanos-admin, time-off | 6 |
| resident.luxuryapp | owner, property | 2 |
| supplier.luxuryapp | customer-provider, lighting-inventory, paint-inventory, po, pr, product, provider, provider-qualification, provider-support, providers | 10 |
| system.luxuryapp | configuracion-sistema | 1 |
| web.luxuryapp | accounting, hr, landing, legal, maintenance, operations | 6 |

## Backend - Violaciones Detectadas

⚠️ **Se detectaron 6 submódulos repetidos:**

- **ConfiguracionSistema** aparece en: AdminLuxuryApp, SystemLuxuryApp
- **Employees** aparece en: LegalLuxuryApp, ReclutamientoLuxuryApp
- **JuntasMensuales** aparece en: DireccionLuxuryApp, OperationsLuxuryApp
- **Notifications** aparece en: ReclutamientoLuxuryApp, RecursosHumanosLuxuryApp
- **Persistence** aparece en: ContabilidadLuxuryApp, MantenimientoLuxuryApp, ContabilidadLuxuryApp, OperationsLuxuryApp, ContabilidadLuxuryApp, ReclutamientoLuxuryApp, ContabilidadLuxuryApp, RecursosHumanosLuxuryApp, ContabilidadLuxuryApp, SystemLuxuryApp
- **Shared** aparece en: ContabilidadLuxuryApp, ReclutamientoLuxuryApp


## Frontend - Violaciones Detectadas

⚠️ **Se detectaron 4 submódulos repetidos:**

- **configuracion-sistema** aparece en: admin.luxuryapp, system.luxuryapp
- **expediente-del-empleado** aparece en: reclutamiento.luxuryapp, recursos-humanos.luxuryapp
- **interfaces** aparece en: committee.luxuryapp, recursos-humanos.luxuryapp
- **work-position** aparece en: operations.luxuryapp, reclutamiento.luxuryapp


## Backend - Estructura Detallada por Modulo

### AdminLuxuryApp

```
D:\repos\luxuryapp-api\api\LuxuryApp.Application\Modules\AdminLuxuryApp/
|-- CatalogosGenerales/
|   |-- Other/ (21 archivos)
|-- ConfiguracionSistema/
|   |-- Other/ (1 archivos)
|-- GestionDeCliente/
|   |-- Other/ (11 archivos)
|-- Infraestructura/
|   |-- Other/ (37 archivos)
|-- SeguridadPermisos/
|   |-- Other/ (29 archivos)
```

### AuthLuxuryApp

```
D:\repos\luxuryapp-api\api\LuxuryApp.Application\Modules\AuthLuxuryApp/
|-- AccountRecovery/
|   |-- DTOs/ (2 archivos)
|   |-- Services/ (2 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (11 archivos)
|-- Auth/
|   |-- DTOs/ (9 archivos)
|   |-- Services/ (4 archivos)
|   |-- EndPoints/ (2 archivos)
|   |-- Other/ (21 archivos)
|-- Identity/
|-- PasswordManager/
|   |-- DTOs/ (2 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (6 archivos)
|-- ProfileUsers/
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (3 archivos)
```

### CobranzaLuxuryApp

```
D:\repos\luxuryapp-api\api\LuxuryApp.Application\Modules\CobranzaLuxuryApp/
|-- AspelCobranzaHausLive/
|   |-- Entities/ (1 archivos)
|   |-- DTOs/ (2 archivos)
|   |-- Services/ (2 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (8 archivos)
|-- AspelCobranzaHausLocal/
|   |-- DTOs/ (1 archivos)
|   |-- Services/ (3 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (7 archivos)
|-- CobranzaNativa/
|   |-- Other/ (178 archivos)
|-- CobranzaOnline/
|   |-- Services/ (13 archivos)
|   |-- EndPoints/ (9 archivos)
|   |-- Other/ (22 archivos)
```

### CommitteeLuxuryApp

```
D:\repos\luxuryapp-api\api\LuxuryApp.Application\Modules\CommitteeLuxuryApp/
|-- DTOs/
|-- EndPoints/
|-- Interfaces/
|-- Services/
```

### ComprasLuxuryApp

```
D:\repos\luxuryapp-api\api\LuxuryApp.Application\Modules\ComprasLuxuryApp/
|-- HistorialCompras/
|   |-- DTOs/ (4 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (7 archivos)
|-- PurchaseOrders/
|   |-- Entities/ (9 archivos)
|   |-- Other/ (9 archivos)
|-- SolicitudesCompra/
|   |-- Other/ (13 archivos)
```

### ContabilidadLuxuryApp

```
D:\repos\luxuryapp-api\api\LuxuryApp.Application\Modules\ContabilidadLuxuryApp/
|-- AccountingCatalog/
|   |-- Entities/ (1 archivos)
|   |-- DTOs/ (4 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (9 archivos)
|-- AutitoriaCuentasAspel/
|   |-- DTOs/ (1 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (4 archivos)
|-- CatalogoGastosFijos/
|   |-- DTOs/ (2 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (6 archivos)
|-- ContabilidadConfig/
|   |-- DTOs/ (5 archivos)
|   |-- Services/ (3 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (13 archivos)
|-- ContabilidadMigration/
|   |-- DTOs/ (7 archivos)
|   |-- Services/ (3 archivos)
|   |-- Other/ (10 archivos)
|-- ContabilidadOnline/
|   |-- Entities/ (11 archivos)
|   |-- DTOs/ (30 archivos)
|   |-- Services/ (16 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (72 archivos)
|-- DynamicReports/
|   |-- DTOs/ (12 archivos)
|   |-- Services/ (8 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (27 archivos)
|-- EspejoAspelFull/
|   |-- DTOs/ (6 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (9 archivos)
|-- ExpenseCatalogBudget/
|   |-- DTOs/ (2 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (5 archivos)
|-- ExpenseCatalogDetail/
|   |-- DTOs/ (3 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (7 archivos)
|-- FinancialAccounting/
|   |-- Entities/ (8 archivos)
|   |-- DTOs/ (6 archivos)
|   |-- Services/ (2 archivos)
|   |-- EndPoints/ (3 archivos)
|   |-- Other/ (21 archivos)
|-- Fondeos/
|   |-- Entities/ (1 archivos)
|   |-- DTOs/ (12 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Helpers/ (2 archivos)
|   |-- Other/ (19 archivos)
|-- FundingFile/
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (3 archivos)
|-- MaintenanceReport/
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (3 archivos)
|-- Persistence/
|   |-- Other/ (23 archivos)
|-- Presupuesto/
|   |-- Entities/ (2 archivos)
|   |-- DTOs/ (2 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (6 archivos)
|-- PresupuestoPropuesta/
|   |-- Entities/ (4 archivos)
|   |-- DTOs/ (16 archivos)
|   |-- Services/ (2 archivos)
|   |-- EndPoints/ (2 archivos)
|   |-- Other/ (27 archivos)
|-- PresupuestoShared/
|   |-- DTOs/ (2 archivos)
|   |-- Services/ (2 archivos)
|   |-- Other/ (6 archivos)
|-- PresupuestoWebAspel/
|   |-- DTOs/ (5 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (8 archivos)
|-- ProjectedExpenses/
|   |-- DTOs/ (3 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (8 archivos)
|-- Reports/
|   |-- DTOs/ (1 archivos)
|   |-- Services/ (1 archivos)
|   |-- Other/ (4 archivos)
|-- Shared/
|   |-- DTOs/ (2 archivos)
|   |-- Services/ (3 archivos)
|   |-- Other/ (8 archivos)
```

### DireccionLuxuryApp

```
D:\repos\luxuryapp-api\api\LuxuryApp.Application\Modules\DireccionLuxuryApp/
|-- JuntasMensuales/
|   |-- Other/ (7 archivos)
```

### LegalLuxuryApp

```
D:\repos\luxuryapp-api\api\LuxuryApp.Application\Modules\LegalLuxuryApp/
|-- EmployeeContracts/
|   |-- Entities/ (7 archivos)
|   |-- DTOs/ (6 archivos)
|   |-- Services/ (4 archivos)
|   |-- EndPoints/ (2 archivos)
|   |-- Other/ (23 archivos)
|-- Employees/
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (1 archivos)
|-- Legal/
|   |-- Other/ (6 archivos)
```

### MantenimientoLuxuryApp

```
D:\repos\luxuryapp-api\api\LuxuryApp.Application\Modules\MantenimientoLuxuryApp/
|-- BudgetMaintenance/
|   |-- Entities/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (2 archivos)
|-- CalendarioMaestro/
|   |-- Entities/ (2 archivos)
|   |-- DTOs/ (1 archivos)
|   |-- Services/ (2 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (8 archivos)
|-- CalendarioMaestroEquipo/
|   |-- Entities/ (1 archivos)
|   |-- DTOs/ (2 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (7 archivos)
|-- ElevatorEmergencyCall/
|   |-- Entities/ (1 archivos)
|   |-- DTOs/ (2 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (6 archivos)
|-- ElevatorSpareParts/
|   |-- Entities/ (1 archivos)
|   |-- DTOs/ (2 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (7 archivos)
|-- EquipmentInspections/
|   |-- Entities/ (8 archivos)
|   |-- DTOs/ (4 archivos)
|   |-- Services/ (3 archivos)
|   |-- EndPoints/ (3 archivos)
|   |-- Other/ (21 archivos)
|-- FireEquipment/
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (1 archivos)
|-- FireExtinguisherInventory/
|   |-- DTOs/ (2 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (6 archivos)
|-- FireExtinguisherLog/
|   |-- Entities/ (1 archivos)
|   |-- DTOs/ (2 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (6 archivos)
|-- FireInspectionPeriods/
|   |-- Entities/ (12 archivos)
|   |-- DTOs/ (9 archivos)
|   |-- Services/ (4 archivos)
|   |-- EndPoints/ (4 archivos)
|   |-- Other/ (33 archivos)
|-- HydrantInventory/
|   |-- DTOs/ (2 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (6 archivos)
|-- HydrantLog/
|   |-- Entities/ (1 archivos)
|   |-- DTOs/ (2 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (6 archivos)
|-- Machinery/
|   |-- Entities/ (2 archivos)
|   |-- DTOs/ (8 archivos)
|   |-- Services/ (3 archivos)
|   |-- EndPoints/ (2 archivos)
|   |-- Other/ (21 archivos)
|-- MachineryAsset/
|   |-- Entities/ (1 archivos)
|   |-- DTOs/ (2 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (6 archivos)
|-- MachineryDocument/
|   |-- Entities/ (1 archivos)
|   |-- DTOs/ (1 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (5 archivos)
|-- MaintenanceCalendars/
|   |-- Entities/ (1 archivos)
|   |-- DTOs/ (9 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (14 archivos)
|-- MaintenanceLog/
|   |-- Entities/ (2 archivos)
|   |-- DTOs/ (3 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (9 archivos)
|-- ManualCallPointInventory/
|   |-- DTOs/ (2 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (6 archivos)
|-- ManualCallPointLog/
|   |-- Entities/ (1 archivos)
|   |-- DTOs/ (2 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (6 archivos)
|-- Medidores/
|   |-- Entities/ (2 archivos)
|   |-- DTOs/ (9 archivos)
|   |-- Services/ (3 archivos)
|   |-- EndPoints/ (3 archivos)
|   |-- Other/ (22 archivos)
|-- Persistence/
|   |-- Other/ (1 archivos)
|-- Piscina/
|   |-- Entities/ (1 archivos)
|   |-- DTOs/ (2 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (7 archivos)
|-- PiscinaBitacora/
|   |-- Entities/ (1 archivos)
|   |-- DTOs/ (6 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (11 archivos)
|-- RecepcionPipasAgua/
|   |-- Entities/ (1 archivos)
|   |-- DTOs/ (3 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (7 archivos)
|-- SmokeDetectorInventory/
|   |-- DTOs/ (2 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (6 archivos)
|-- SmokeDetectorLog/
|   |-- Entities/ (1 archivos)
|   |-- DTOs/ (2 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (6 archivos)
|-- ToolLoan/
|   |-- Entities/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (2 archivos)
```

### OperationsLuxuryApp

```
D:\repos\luxuryapp-api\api\LuxuryApp.Application\Modules\OperationsLuxuryApp/
|-- AccessControl/
|   |-- Entities/ (7 archivos)
|   |-- DTOs/ (19 archivos)
|   |-- Services/ (9 archivos)
|   |-- EndPoints/ (6 archivos)
|   |-- Other/ (51 archivos)
|-- Announcement/
|   |-- Entities/ (5 archivos)
|   |-- DTOs/ (9 archivos)
|   |-- Services/ (2 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (20 archivos)
|-- BuildingCustomer/
|   |-- Services/ (1 archivos)
|   |-- Other/ (1 archivos)
|-- Comite/
|   |-- Other/ (2 archivos)
|-- CustomDocument/
|   |-- Entities/ (2 archivos)
|   |-- DTOs/ (4 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (9 archivos)
|-- Dashboard/
|   |-- DTOs/ (1 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (4 archivos)
|-- DeliveryReception/
|   |-- Entities/ (3 archivos)
|   |-- DTOs/ (3 archivos)
|   |-- Services/ (4 archivos)
|   |-- EndPoints/ (4 archivos)
|   |-- Other/ (19 archivos)
|-- Diagram/
|   |-- Entities/ (3 archivos)
|   |-- DTOs/ (3 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (10 archivos)
|-- DireccionDashboard/
|   |-- Other/ (5 archivos)
|-- GoogleCalendar/
|   |-- Entities/ (2 archivos)
|   |-- DTOs/ (13 archivos)
|   |-- Services/ (2 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (21 archivos)
|-- IncidenciasAdministrativas/
|   |-- Entities/ (7 archivos)
|   |-- Other/ (25 archivos)
|-- Inspections/
|   |-- Entities/ (10 archivos)
|   |-- DTOs/ (18 archivos)
|   |-- Services/ (6 archivos)
|   |-- EndPoints/ (5 archivos)
|   |-- Other/ (45 archivos)
|-- Inventory/
|   |-- Entities/ (18 archivos)
|   |-- DTOs/ (17 archivos)
|   |-- Services/ (6 archivos)
|   |-- EndPoints/ (5 archivos)
|   |-- Other/ (65 archivos)
|-- JuntasMensuales/
|   |-- Other/ (16 archivos)
|-- MiEdificio/
|   |-- DTOs/ (3 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (4 archivos)
|-- Owner/
|   |-- DTOs/ (2 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (6 archivos)
|-- PanicAlert/
|   |-- Entities/ (1 archivos)
|   |-- DTOs/ (4 archivos)
|   |-- Services/ (2 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (10 archivos)
|-- Persistence/
|   |-- Other/ (21 archivos)
|-- Property/
|   |-- Entities/ (2 archivos)
|   |-- DTOs/ (4 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (10 archivos)
|-- PropertyOccupant/
|   |-- Entities/ (1 archivos)
|   |-- DTOs/ (2 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (6 archivos)
|-- Recruitment/
|   |-- EndPoints/ (9 archivos)
|   |-- Other/ (13 archivos)
|-- ResumenGeneral/
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (3 archivos)
|-- ScheduledTasks/
|   |-- Services/ (2 archivos)
|   |-- Other/ (12 archivos)
|-- ServiceOrder/
|   |-- Entities/ (3 archivos)
|   |-- DTOs/ (5 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (12 archivos)
|-- Supervision/
|   |-- Other/ (3 archivos)
|-- Tasks/
|   |-- Other/ (27 archivos)
|-- WorkPosition/
```

### ReclutamientoLuxuryApp

```
D:\repos\luxuryapp-api\api\LuxuryApp.Application\Modules\ReclutamientoLuxuryApp/
|-- CandidateApplications/
|   |-- Services/ (1 archivos)
|   |-- Other/ (2 archivos)
|-- CandidateProcesses/
|   |-- Entities/ (1 archivos)
|   |-- DTOs/ (26 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (30 archivos)
|-- Candidates/
|   |-- Entities/ (4 archivos)
|   |-- DTOs/ (11 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Mappings/ (1 archivos)
|   |-- Other/ (19 archivos)
|-- CandidatesWorkExperience/
|   |-- Entities/ (1 archivos)
|   |-- DTOs/ (2 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Mappings/ (1 archivos)
|   |-- Other/ (7 archivos)
|-- CustomerProviders/
|   |-- DTOs/ (5 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (9 archivos)
|-- Employee/
|   |-- DTOs/ (7 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (11 archivos)
|-- EmployeeBankData/
|   |-- DTOs/ (2 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (6 archivos)
|-- EmployeeBeneficiary/
|   |-- DTOs/ (2 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (6 archivos)
|-- EmployeeClinicalData/
|   |-- DTOs/ (1 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (4 archivos)
|-- EmployeeDocument/
|   |-- DTOs/ (2 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (5 archivos)
|-- EmployeeEmergenContact/
|   |-- DTOs/ (2 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (6 archivos)
|-- EmployeeFile/
|   |-- Entities/ (11 archivos)
|   |-- DTOs/ (13 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (28 archivos)
|-- Employees/
|   |-- Other/ (8 archivos)
|-- InterviewerMatrices/
|   |-- Entities/ (1 archivos)
|   |-- DTOs/ (5 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Mappings/ (1 archivos)
|   |-- Other/ (10 archivos)
|-- JobDescriptions/
|   |-- Entities/ (1 archivos)
|   |-- DTOs/ (4 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (9 archivos)
|-- Notifications/
|   |-- Services/ (2 archivos)
|   |-- Other/ (4 archivos)
|-- Persistence/
|   |-- Other/ (2 archivos)
|-- ProviderSupports/
|   |-- DTOs/ (2 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (5 archivos)
|-- RecruitmentRequests/
|   |-- DTOs/ (1 archivos)
|   |-- Services/ (2 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (6 archivos)
|-- RecruitmentSourceCatalogs/
|   |-- Entities/ (1 archivos)
|   |-- DTOs/ (1 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (5 archivos)
|-- RecurringTasks/
|   |-- DTOs/ (13 archivos)
|   |-- Services/ (3 archivos)
|   |-- EndPoints/ (2 archivos)
|   |-- Other/ (22 archivos)
|-- RequestDismissalDiscounts/
|   |-- Entities/ (1 archivos)
|   |-- DTOs/ (3 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (8 archivos)
|-- RequestDismissals/
|   |-- Entities/ (4 archivos)
|   |-- DTOs/ (9 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (17 archivos)
|-- RequestEmployeeRegisters/
|   |-- Entities/ (2 archivos)
|   |-- DTOs/ (12 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (18 archivos)
|-- RequestPositions/
|   |-- Entities/ (1 archivos)
|   |-- DTOs/ (4 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (9 archivos)
|-- SalaryModifications/
|   |-- Entities/ (1 archivos)
|   |-- DTOs/ (5 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (10 archivos)
|-- Shared/
|   |-- Other/ (1 archivos)
|-- SolicitudAltas/
|   |-- Other/ (2 archivos)
|-- SolicitudBajas/
|   |-- Other/ (2 archivos)
|-- SolicitudModificacionesSueldo/
|   |-- Other/ (2 archivos)
|-- SolicitudVacantes/
|   |-- Other/ (2 archivos)
|-- WorkPositions/
|   |-- Entities/ (3 archivos)
|   |-- DTOs/ (4 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (11 archivos)
```

### RecursosHumanosLuxuryApp

```
D:\repos\luxuryapp-api\api\LuxuryApp.Application\Modules\RecursosHumanosLuxuryApp/
|-- ChekadorEmpleados/
|   |-- Entities/ (2 archivos)
|   |-- DTOs/ (1 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (6 archivos)
|-- Evaluacion/
|   |-- Entities/ (5 archivos)
|   |-- Other/ (9 archivos)
|-- ManualsAndProcesses/
|   |-- DTOs/ (2 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (5 archivos)
|-- Nomina/
|   |-- Entities/ (10 archivos)
|   |-- Other/ (31 archivos)
|-- Notifications/
|   |-- DTOs/ (1 archivos)
|   |-- Services/ (1 archivos)
|   |-- Other/ (3 archivos)
|-- Persistence/
|   |-- Other/ (2 archivos)
|-- TimeOff/
|   |-- Entities/ (6 archivos)
|   |-- Other/ (44 archivos)
```

### ResidentesLuxuryApp

```
D:\repos\luxuryapp-api\api\LuxuryApp.Application\Modules\ResidentesLuxuryApp/
```

### SupplierLuxuryApp

```
D:\repos\luxuryapp-api\api\LuxuryApp.Application\Modules\SupplierLuxuryApp/
|-- Provider/
|   |-- Entities/ (3 archivos)
|   |-- DTOs/ (4 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (11 archivos)
|-- ProviderQualification/
|   |-- Entities/ (1 archivos)
|   |-- DTOs/ (2 archivos)
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (7 archivos)
|-- Purchases/
|   |-- Other/ (21 archivos)
```

### SystemLuxuryApp

```
D:\repos\luxuryapp-api\api\LuxuryApp.Application\Modules\SystemLuxuryApp/
|-- Approvals/
|   |-- Entities/ (1 archivos)
|   |-- Other/ (1 archivos)
|-- Common/
|   |-- Other/ (1 archivos)
|-- ConfiguracionSistema/
|   |-- Other/ (3 archivos)
|-- Diagnostics/
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (1 archivos)
|-- Persistence/
|   |-- Other/ (1 archivos)
|-- SelectItem/
|   |-- Services/ (1 archivos)
|   |-- EndPoints/ (1 archivos)
|   |-- Other/ (3 archivos)
|-- SendEmailGlobal/
|   |-- Other/ (50 archivos)
|-- SystemAI/
|   |-- Other/ (3 archivos)
|-- SystemAuditLogs/
|   |-- Other/ (4 archivos)
|-- SystemTenant/
|   |-- Other/ (6 archivos)
```

## Frontend - Estructura Detallada por Modulo

### admin.luxuryapp

```
D:\repos\luxuryapp-api\appsweb\angular\src\app\apps\admin.luxuryapp/
|-- access-control/
|   |-- Components/ (4 archivos)
|   |-- Desktop/ (4 archivos)
|   |-- Mobile/ (4 archivos)
|   |-- Interfaces/ (2 archivos)
|   |-- Services/ (4 archivos)
|   |-- Pipes/ (4 archivos)
|-- admin-wrapper/
|   |-- Components/ (2 archivos)
|   |-- Desktop/ (3 archivos)
|   |-- Mobile/ (3 archivos)
|   |-- Interfaces/ (2 archivos)
|   |-- Services/ (3 archivos)
|   |-- Pipes/ (3 archivos)
|-- analisis-registros/
|-- catalogos-generales/
|-- configuracion-correo/
|-- configuracion-sistema/
|-- herramientas-dev/
|-- reportes/
|-- seguridad-permisos/
```

### auth.luxuryapp

```
D:\repos\luxuryapp-api\appsweb\angular\src\app\apps\auth.luxuryapp/
|-- login/
|   |-- Components/ (2 archivos)
|   |-- Desktop/ (4 archivos)
|   |-- Mobile/ (4 archivos)
|   |-- Services/ (4 archivos)
|   |-- Pipes/ (4 archivos)
|-- password-manager/
|   |-- Components/ (4 archivos)
|   |-- Desktop/ (7 archivos)
|   |-- Mobile/ (7 archivos)
|   |-- Interfaces/ (2 archivos)
|   |-- Services/ (7 archivos)
|   |-- Pipes/ (7 archivos)
|-- recovery-code/
|   |-- Components/ (3 archivos)
|   |-- Desktop/ (4 archivos)
|   |-- Mobile/ (4 archivos)
|   |-- Interfaces/ (2 archivos)
|   |-- Services/ (4 archivos)
|   |-- Pipes/ (4 archivos)
|-- recovery-password/
|   |-- Components/ (2 archivos)
|   |-- Desktop/ (5 archivos)
|   |-- Mobile/ (5 archivos)
|   |-- Services/ (5 archivos)
|   |-- Pipes/ (5 archivos)
|-- reset-password/
|   |-- Components/ (2 archivos)
|   |-- Desktop/ (4 archivos)
|   |-- Mobile/ (4 archivos)
|   |-- Services/ (4 archivos)
|   |-- Pipes/ (4 archivos)
|-- user-profile/
|   |-- Components/ (3 archivos)
|   |-- Desktop/ (3 archivos)
|   |-- Mobile/ (3 archivos)
|   |-- Services/ (3 archivos)
|   |-- Pipes/ (3 archivos)
```

### cobranza.luxuryapp

```
D:\repos\luxuryapp-api\appsweb\angular\src\app\apps\cobranza.luxuryapp/
|-- aspel-cobranza-haus/
|   |-- Components/ (5 archivos)
|   |-- Desktop/ (6 archivos)
|   |-- Mobile/ (6 archivos)
|   |-- Services/ (6 archivos)
|   |-- Pipes/ (6 archivos)
|-- cobranza-nativa/
|   |-- Components/ (1 archivos)
|   |-- Desktop/ (1 archivos)
|   |-- Mobile/ (1 archivos)
|   |-- Interfaces/ (19 archivos)
|   |-- Services/ (1 archivos)
|   |-- Pipes/ (1 archivos)
|-- cobranza-online/
|   |-- Components/ (3 archivos)
|   |-- Desktop/ (3 archivos)
|   |-- Mobile/ (3 archivos)
|   |-- Interfaces/ (6 archivos)
|   |-- Services/ (3 archivos)
|   |-- Helpers/ (2 archivos)
|   |-- Pipes/ (3 archivos)
```

### committee.luxuryapp

```
D:\repos\luxuryapp-api\appsweb\angular\src\app\apps\committee.luxuryapp/
|-- board-directors-financial-reports/
|   |-- Components/ (1 archivos)
|   |-- Desktop/ (1 archivos)
|   |-- Mobile/ (1 archivos)
|   |-- Services/ (1 archivos)
|   |-- Pipes/ (1 archivos)
|-- board-directors-library/
|   |-- Components/ (2 archivos)
|   |-- Desktop/ (2 archivos)
|   |-- Mobile/ (2 archivos)
|   |-- Services/ (2 archivos)
|   |-- Pipes/ (2 archivos)
|-- board-directors-meeting-minutes/
|   |-- Components/ (2 archivos)
|   |-- Desktop/ (2 archivos)
|   |-- Mobile/ (2 archivos)
|   |-- Services/ (2 archivos)
|   |-- Pipes/ (2 archivos)
|-- board-directors-monthly-meetings/
|   |-- Components/ (1 archivos)
|   |-- Desktop/ (1 archivos)
|   |-- Mobile/ (1 archivos)
|   |-- Services/ (1 archivos)
|   |-- Pipes/ (1 archivos)
|-- cobranza/
|   |-- Components/ (3 archivos)
|   |-- Desktop/ (5 archivos)
|   |-- Mobile/ (5 archivos)
|   |-- Services/ (5 archivos)
|   |-- Pipes/ (5 archivos)
|-- directorio/
|   |-- Components/ (1 archivos)
|   |-- Desktop/ (1 archivos)
|   |-- Mobile/ (1 archivos)
|   |-- Services/ (1 archivos)
|   |-- Pipes/ (1 archivos)
|-- home-committee/
|   |-- Components/ (1 archivos)
|   |-- Desktop/ (1 archivos)
|   |-- Mobile/ (1 archivos)
|   |-- Services/ (1 archivos)
|   |-- Pipes/ (1 archivos)
|-- interfaces/
|   |-- Components/ (2 archivos)
|   |-- Desktop/ (2 archivos)
|   |-- Mobile/ (2 archivos)
|   |-- Services/ (2 archivos)
|   |-- Pipes/ (2 archivos)
|-- poliza-seguro-edificio/
|   |-- Components/ (1 archivos)
|   |-- Desktop/ (1 archivos)
|   |-- Mobile/ (1 archivos)
|   |-- Services/ (1 archivos)
|   |-- Pipes/ (1 archivos)
|-- profile/
|   |-- Components/ (1 archivos)
|   |-- Desktop/ (1 archivos)
|   |-- Mobile/ (1 archivos)
|   |-- Services/ (1 archivos)
|   |-- Pipes/ (1 archivos)
```

### compras.luxuryapp

```
D:\repos\luxuryapp-api\appsweb\angular\src\app\apps\compras.luxuryapp/
|-- historial-compras/
|   |-- Components/ (2 archivos)
|   |-- Desktop/ (2 archivos)
|   |-- Mobile/ (2 archivos)
|   |-- Interfaces/ (1 archivos)
|   |-- Services/ (2 archivos)
|   |-- Pipes/ (2 archivos)
|-- solicitudes-compras/
```

### contabilidad.luxuryapp

```
D:\repos\luxuryapp-api\appsweb\angular\src\app\apps\contabilidad.luxuryapp/
|-- ar/
|-- budgeting/
|-- fondeos-y-reporteo/
|-- general-ledger/
|   |-- Components/ (1 archivos)
|   |-- Desktop/ (2 archivos)
|   |-- Mobile/ (2 archivos)
|   |-- Interfaces/ (1 archivos)
|   |-- Services/ (2 archivos)
|   |-- Pipes/ (2 archivos)
|-- mock-aspel/
|   |-- Components/ (3 archivos)
|   |-- Desktop/ (3 archivos)
|   |-- Mobile/ (3 archivos)
|   |-- Services/ (3 archivos)
|   |-- Pipes/ (3 archivos)
```

### direccion.luxuryapp

```
D:\repos\luxuryapp-api\appsweb\angular\src\app\apps\direccion.luxuryapp/
|-- home-direccion/
|   |-- Components/ (1 archivos)
|   |-- Desktop/ (1 archivos)
|   |-- Mobile/ (1 archivos)
|   |-- Services/ (1 archivos)
|   |-- Pipes/ (1 archivos)
|-- juntas-comite/
```

### legal.luxuryapp

```
D:\repos\luxuryapp-api\appsweb\angular\src\app\apps\legal.luxuryapp/
|-- asuntos-legales-y-seguros/
|   |-- Interfaces/ (2 archivos)
|-- comite-vigilancia/
|   |-- Components/ (3 archivos)
|   |-- Desktop/ (6 archivos)
|   |-- Mobile/ (6 archivos)
|   |-- Services/ (6 archivos)
|   |-- Pipes/ (6 archivos)
|-- employees-contracts/
|   |-- Components/ (1 archivos)
|   |-- Desktop/ (2 archivos)
|   |-- Mobile/ (2 archivos)
|   |-- Services/ (2 archivos)
|   |-- Pipes/ (2 archivos)
```

### mantenimiento.luxuryapp

```
D:\repos\luxuryapp-api\appsweb\angular\src\app\apps\mantenimiento.luxuryapp/
|-- catalogos-tickets-mantenimiento/
|-- equipos-y-maquinaria/
|-- fire-equipment/
|-- inspection/
|   |-- Desktop/ (1 archivos)
|   |-- Mobile/ (1 archivos)
|   |-- Services/ (1 archivos)
|   |-- Pipes/ (1 archivos)
|-- logs/
|-- planificacin-de-mantenimiento/
|-- reports-mantenance/
|   |-- Components/ (2 archivos)
|   |-- Desktop/ (2 archivos)
|   |-- Mobile/ (2 archivos)
|   |-- Services/ (2 archivos)
|   |-- Pipes/ (2 archivos)
```

### operations.luxuryapp

```
D:\repos\luxuryapp-api\appsweb\angular\src\app\apps\operations.luxuryapp/
|-- announcements/
|-- custom-documents/
|-- dashboard/
|   |-- Components/ (3 archivos)
|   |-- Desktop/ (8 archivos)
|   |-- Mobile/ (8 archivos)
|   |-- Interfaces/ (1 archivos)
|   |-- Services/ (8 archivos)
|   |-- Pipes/ (8 archivos)
|-- diagrams/
|-- directorios/
|-- field-service/
|-- google-calendar/
|-- incidencias-sanciones/
|-- initial-implementation/
|   |-- Components/ (1 archivos)
|   |-- Desktop/ (1 archivos)
|   |-- Mobile/ (1 archivos)
|   |-- Services/ (1 archivos)
|   |-- Pipes/ (1 archivos)
|-- inspecciones-y-auditora/
|-- inventarios-y-almacn/
|-- manuals/
|-- meetings/
|-- panic-alert/
|   |-- Interfaces/ (4 archivos)
|-- properties/
|-- reclutamiento-solicitudes/
|-- reports/
|-- staff-board/
|   |-- Components/ (1 archivos)
|   |-- Desktop/ (1 archivos)
|   |-- Mobile/ (1 archivos)
|   |-- Services/ (1 archivos)
|   |-- Pipes/ (1 archivos)
|-- supervision/
|-- task-engine/
|-- templates/
|   |-- Components/ (2 archivos)
|   |-- Desktop/ (2 archivos)
|   |-- Mobile/ (2 archivos)
|   |-- Services/ (2 archivos)
|   |-- Pipes/ (2 archivos)
|-- work-position/
|   |-- Components/ (5 archivos)
|   |-- Desktop/ (5 archivos)
|   |-- Mobile/ (5 archivos)
|   |-- Interfaces/ (1 archivos)
|   |-- Services/ (5 archivos)
|   |-- Pipes/ (5 archivos)
```

### public.luxuryapp

```
D:\repos\luxuryapp-api\appsweb\angular\src\app\apps\public.luxuryapp/
|-- telefonos-emergencia/
|   |-- Components/ (2 archivos)
|   |-- Desktop/ (2 archivos)
|   |-- Mobile/ (2 archivos)
|   |-- Services/ (2 archivos)
|   |-- Pipes/ (2 archivos)
```

### reclutamiento.luxuryapp

```
D:\repos\luxuryapp-api\appsweb\angular\src\app\apps\reclutamiento.luxuryapp/
|-- candidate/
|   |-- Components/ (6 archivos)
|   |-- Desktop/ (11 archivos)
|   |-- Mobile/ (11 archivos)
|   |-- Interfaces/ (2 archivos)
|   |-- Services/ (9 archivos)
|   |-- Pipes/ (9 archivos)
|-- candidate-application/
|   |-- Components/ (5 archivos)
|   |-- Desktop/ (6 archivos)
|   |-- Mobile/ (6 archivos)
|   |-- Interfaces/ (6 archivos)
|   |-- Services/ (5 archivos)
|   |-- Pipes/ (5 archivos)
|-- candidate-applications/
|   |-- Components/ (5 archivos)
|   |-- Desktop/ (6 archivos)
|   |-- Mobile/ (6 archivos)
|   |-- Interfaces/ (6 archivos)
|   |-- Services/ (5 archivos)
|   |-- Pipes/ (5 archivos)
|-- candidate-interview/
|   |-- Components/ (3 archivos)
|   |-- Desktop/ (7 archivos)
|   |-- Mobile/ (7 archivos)
|   |-- Interfaces/ (6 archivos)
|   |-- Services/ (6 archivos)
|   |-- Pipes/ (6 archivos)
|-- candidate-interviewer-queue/
|   |-- Components/ (1 archivos)
|   |-- Desktop/ (3 archivos)
|   |-- Mobile/ (3 archivos)
|   |-- Interfaces/ (1 archivos)
|   |-- Services/ (3 archivos)
|   |-- Pipes/ (3 archivos)
|-- candidate-recruitment-interviews/
|   |-- Components/ (2 archivos)
|   |-- Desktop/ (4 archivos)
|   |-- Mobile/ (4 archivos)
|   |-- Services/ (4 archivos)
|   |-- Pipes/ (4 archivos)
|-- candidate-work-position-candidates/
|   |-- Components/ (1 archivos)
|   |-- Desktop/ (1 archivos)
|   |-- Mobile/ (1 archivos)
|   |-- Services/ (1 archivos)
|   |-- Pipes/ (1 archivos)
|-- candidates/
|   |-- Components/ (6 archivos)
|   |-- Desktop/ (11 archivos)
|   |-- Mobile/ (11 archivos)
|   |-- Interfaces/ (2 archivos)
|   |-- Services/ (9 archivos)
|   |-- Pipes/ (9 archivos)
|-- employee/
|   |-- Components/ (5 archivos)
|   |-- Desktop/ (12 archivos)
|   |-- Mobile/ (12 archivos)
|   |-- Interfaces/ (3 archivos)
|   |-- Services/ (12 archivos)
|   |-- Pipes/ (12 archivos)
|-- employee-bank-data/
|   |-- Components/ (2 archivos)
|   |-- Desktop/ (4 archivos)
|   |-- Mobile/ (4 archivos)
|   |-- Interfaces/ (1 archivos)
|   |-- Services/ (4 archivos)
|   |-- Pipes/ (4 archivos)
|-- employee-beneficiary/
|   |-- Components/ (2 archivos)
|   |-- Desktop/ (2 archivos)
|   |-- Mobile/ (2 archivos)
|   |-- Interfaces/ (1 archivos)
|   |-- Services/ (2 archivos)
|   |-- Pipes/ (2 archivos)
|-- employee-clinical-data/
|   |-- Components/ (2 archivos)
|   |-- Desktop/ (4 archivos)
|   |-- Mobile/ (4 archivos)
|   |-- Interfaces/ (1 archivos)
|   |-- Services/ (4 archivos)
|   |-- Pipes/ (4 archivos)
|-- employee-document/
|   |-- Components/ (1 archivos)
|   |-- Desktop/ (1 archivos)
|   |-- Mobile/ (1 archivos)
|   |-- Services/ (1 archivos)
|   |-- Pipes/ (1 archivos)
|-- employee-emergen-contact/
|   |-- Components/ (2 archivos)
|   |-- Desktop/ (4 archivos)
|   |-- Mobile/ (4 archivos)
|   |-- Services/ (4 archivos)
|   |-- Pipes/ (4 archivos)
|-- employee-external/
|   |-- Components/ (3 archivos)
|   |-- Desktop/ (3 archivos)
|   |-- Mobile/ (3 archivos)
|   |-- Services/ (3 archivos)
|   |-- Pipes/ (3 archivos)
|-- expediente-del-empleado/
|-- reclutamiento-y-altas-bajas/
|   |-- Components/ (1 archivos)
|   |-- Desktop/ (1 archivos)
|   |-- Mobile/ (1 archivos)
|   |-- Services/ (1 archivos)
|   |-- Pipes/ (1 archivos)
|-- solicitud-alta/
|   |-- Components/ (4 archivos)
|   |-- Desktop/ (4 archivos)
|   |-- Mobile/ (4 archivos)
|   |-- Services/ (4 archivos)
|   |-- Pipes/ (4 archivos)
|-- solicitud-altas/
|   |-- Components/ (4 archivos)
|   |-- Desktop/ (4 archivos)
|   |-- Mobile/ (4 archivos)
|   |-- Services/ (4 archivos)
|   |-- Pipes/ (4 archivos)
|-- solicitud-baja/
|   |-- Components/ (3 archivos)
|   |-- Desktop/ (3 archivos)
|   |-- Mobile/ (3 archivos)
|   |-- Services/ (3 archivos)
|   |-- Pipes/ (3 archivos)
|-- solicitud-bajas/
|   |-- Components/ (3 archivos)
|   |-- Desktop/ (3 archivos)
|   |-- Mobile/ (3 archivos)
|   |-- Services/ (3 archivos)
|   |-- Pipes/ (3 archivos)
|-- solicitud-modificacion-sueldo/
|   |-- Components/ (4 archivos)
|   |-- Desktop/ (4 archivos)
|   |-- Mobile/ (4 archivos)
|   |-- Services/ (4 archivos)
|   |-- Pipes/ (4 archivos)
|-- solicitud-modificaciones-sueldo/
|   |-- Components/ (4 archivos)
|   |-- Desktop/ (4 archivos)
|   |-- Mobile/ (4 archivos)
|   |-- Services/ (4 archivos)
|   |-- Pipes/ (4 archivos)
|-- solicitud-vacante/
|   |-- Components/ (3 archivos)
|   |-- Desktop/ (3 archivos)
|   |-- Mobile/ (3 archivos)
|   |-- Services/ (3 archivos)
|   |-- Pipes/ (3 archivos)
|-- solicitud-vacantes/
|   |-- Components/ (3 archivos)
|   |-- Desktop/ (3 archivos)
|   |-- Mobile/ (3 archivos)
|   |-- Services/ (3 archivos)
|   |-- Pipes/ (3 archivos)
|-- work-position/
|-- work-positions/
```

### recursos-humanos.luxuryapp

```
D:\repos\luxuryapp-api\appsweb\angular\src\app\apps\recursos-humanos.luxuryapp/
|-- chekador-empleados/
|   |-- Components/ (1 archivos)
|   |-- Desktop/ (2 archivos)
|   |-- Mobile/ (2 archivos)
|   |-- Interfaces/ (1 archivos)
|   |-- Services/ (2 archivos)
|   |-- Pipes/ (2 archivos)
|-- evaluaciones-de-desempeo/
|-- expediente-del-empleado/
|-- interfaces/
|   |-- Components/ (1 archivos)
|   |-- Desktop/ (8 archivos)
|   |-- Mobile/ (8 archivos)
|   |-- Services/ (8 archivos)
|   |-- Pipes/ (8 archivos)
|-- recursos-humanos-admin/
|-- time-off/
```

### resident.luxuryapp

```
D:\repos\luxuryapp-api\appsweb\angular\src\app\apps\resident.luxuryapp/
|-- owner/
|   |-- Components/ (2 archivos)
|   |-- Desktop/ (2 archivos)
|   |-- Mobile/ (2 archivos)
|   |-- Services/ (2 archivos)
|   |-- Pipes/ (2 archivos)
|-- property/
|   |-- Components/ (3 archivos)
|   |-- Desktop/ (6 archivos)
|   |-- Mobile/ (6 archivos)
|   |-- Services/ (6 archivos)
|   |-- Pipes/ (6 archivos)
```

### supplier.luxuryapp

```
D:\repos\luxuryapp-api\appsweb\angular\src\app\apps\supplier.luxuryapp/
|-- customer-provider/
|   |-- Components/ (2 archivos)
|   |-- Desktop/ (2 archivos)
|   |-- Mobile/ (2 archivos)
|   |-- Services/ (2 archivos)
|   |-- Pipes/ (2 archivos)
|-- lighting-inventory/
|   |-- Components/ (2 archivos)
|   |-- Desktop/ (2 archivos)
|   |-- Mobile/ (2 archivos)
|   |-- Services/ (2 archivos)
|   |-- Pipes/ (2 archivos)
|-- paint-inventory/
|   |-- Components/ (2 archivos)
|   |-- Desktop/ (2 archivos)
|   |-- Mobile/ (2 archivos)
|   |-- Services/ (2 archivos)
|   |-- Pipes/ (2 archivos)
|-- po/
|-- pr/
|-- product/
|   |-- Components/ (3 archivos)
|   |-- Desktop/ (6 archivos)
|   |-- Mobile/ (6 archivos)
|   |-- Services/ (6 archivos)
|   |-- Pipes/ (6 archivos)
|-- provider/
|   |-- Components/ (5 archivos)
|   |-- Desktop/ (10 archivos)
|   |-- Mobile/ (10 archivos)
|   |-- Services/ (10 archivos)
|   |-- Pipes/ (10 archivos)
|-- provider-qualification/
|   |-- Components/ (1 archivos)
|   |-- Desktop/ (1 archivos)
|   |-- Mobile/ (1 archivos)
|   |-- Services/ (1 archivos)
|   |-- Pipes/ (1 archivos)
|-- provider-support/
|   |-- Components/ (2 archivos)
|   |-- Desktop/ (2 archivos)
|   |-- Mobile/ (2 archivos)
|   |-- Services/ (2 archivos)
|   |-- Pipes/ (2 archivos)
|-- providers/
```

### system.luxuryapp

```
D:\repos\luxuryapp-api\appsweb\angular\src\app\apps\system.luxuryapp/
|-- configuracion-sistema/
```

### web.luxuryapp

```
D:\repos\luxuryapp-api\appsweb\angular\src\app\apps\web.luxuryapp/
|-- accounting/
|   |-- Components/ (1 archivos)
|   |-- Desktop/ (1 archivos)
|   |-- Mobile/ (1 archivos)
|   |-- Services/ (1 archivos)
|   |-- Pipes/ (1 archivos)
|-- hr/
|   |-- Components/ (1 archivos)
|   |-- Desktop/ (1 archivos)
|   |-- Mobile/ (1 archivos)
|   |-- Services/ (1 archivos)
|   |-- Pipes/ (1 archivos)
|-- landing/
|   |-- Components/ (1 archivos)
|   |-- Desktop/ (1 archivos)
|   |-- Mobile/ (1 archivos)
|   |-- Services/ (1 archivos)
|   |-- Pipes/ (1 archivos)
|-- legal/
|   |-- Components/ (1 archivos)
|   |-- Desktop/ (1 archivos)
|   |-- Mobile/ (1 archivos)
|   |-- Services/ (1 archivos)
|   |-- Pipes/ (1 archivos)
|-- maintenance/
|   |-- Components/ (2 archivos)
|   |-- Desktop/ (2 archivos)
|   |-- Mobile/ (2 archivos)
|   |-- Services/ (2 archivos)
|   |-- Pipes/ (2 archivos)
|-- operations/
|   |-- Components/ (1 archivos)
|   |-- Desktop/ (1 archivos)
|   |-- Mobile/ (1 archivos)
|   |-- Services/ (1 archivos)
|   |-- Pipes/ (1 archivos)
```

## Backend - Archivos por Submodulo

### AdminLuxuryApp/CatalogosGenerales

**Other:** IBankAppService.cs, BankMapper.cs, IDocumentCatalogAppService.cs, IEmailDataAppService.cs, EmailDataMapper.cs, IAddressAppService.cs, ICatalogAssetAppService.cs, ICategoryAppService.cs, IToolAppService.cs, AddressMapper.cs, CategoryMapper.cs, ToolMapper.cs, IMeasurementUnitAppService.cs, UnidadMedidaMapper.cs, IMetodoDePagoAppService.cs, MetodoDePagoMapper.cs, IPaymentMethodAppService.cs, PaymentMethodMapper.cs, ITelefonosEmergenciaAppService.cs, IUsoCFDIAppService.cs, IWorkPositionScheduleAppService.cs

### AdminLuxuryApp/ConfiguracionSistema

**Other:** IAsambleaChecklistTemplateAppService.cs

### AdminLuxuryApp/GestionDeCliente

**Other:** ICustomerAddressAppService.cs, ICustomerDataCompanyAppService.cs, ICustomerImageAppService.cs, ICustomerLocationAppService.cs, CustomerLocationMapper.cs, ICustomerModulAppService.cs, ICustomerAppService.cs, IDataCustomerAppService.cs, CustomerMapper.cs, DataCustomerRepository.cs, IModuleAppAppService.cs

### AdminLuxuryApp/Infraestructura

**Other:** EmployeeMissingDataDTO.cs, IEmployeeDataValidationService.cs, EmployeeDataValidationService.cs, MenuItemDTO.cs, SubMenuItemDTO.cs, MenuItemsEndPoints.cs, IMenuItemsAppService.cs, MenuItemsAppService.cs, WorkPositionMissingDataDTO.cs, IOrgStructureValidationService.cs, OrgStructureValidationService.cs, HangfireJobCatalog.cs, IJobService.cs, AspelMigrationSchedulerJob.cs, BankReconciliationJob.cs, CandidatePipelineAutomationJob.cs, CollectionEscalationJob.cs, ContabilidadMigrationJob.cs, ContractRenewalNotifierJob.cs, DailyLateFeeCalculatorJob.cs, DatabaseBackupJob.cs, EmployeeDataValidationJob.cs, ExpireCredentialsJob.cs, ExpireVisitsJob.cs, FireInspectionCycleGenerationJob.cs, MonthlyChargeGenerationJob.cs, NotificationEngineJob.cs, NotifyExpiringVacationsJob.cs, OnboardingChecklistSlaJob.cs, OverstayDetectionJob.cs, RecurringTaskGenerationEngineJob.cs, RecurringTaskGenerationJob.cs, RecurringTaskSchedulerJob.cs, TaskAlertEngineJob.cs, TaskEscalationEngineJob.cs, VacationUpdaterJob.cs, IUpdateDataBaseService.cs

### AdminLuxuryApp/SeguridadPermisos

**Other:** ApplicationRoleDTO.cs, ApplicationRolesDTO.cs, CreateUpdateApplicationRoleDTO.cs, ApplicationRolesEndPoints.cs, IApplicationRoleAppService.cs, ApplicationRoleMapper.cs, ApplicationRoleAppService.cs, ApprovalMatrixDTO.cs, ApprovalRuleDTO.cs, UpdateApprovalRulesDTO.cs, ApprovalRulesEndPoints.cs, IApprovalRulesAdminService.cs, ApprovalRulesAdminService.cs, AddApplicationRoleToUserDTO.cs, ChangePasswordDTO.cs, EmployeeOrganigramaDTO.cs, ListApplicationUserDTO.cs, UserRoleService.cs, ModuleAppRolAssignedDTO.cs, ModuleAppRolDTO.cs, ModuleGroupRolDTO.cs, UpdateModuleAppRolAssignedDTO.cs, ModuleAppRolEndPoints.cs, IModuleAppRolAppService.cs, ModuleAppRolAppService.cs, RoleAssignmentMatrixService.cs, UserAccountEndpoints.cs, IUserAccountAppService.cs, UserAccountAppService.cs

### AuthLuxuryApp/AccountRecovery

**DTOs:** CredentialNotificationRequestDTO.cs, CredentialNotificationTemplate.cs

**Services:** CredentialNotificationService.cs, RecoveryAccountUserAppService.cs

**EndPoints:** ApplicationUserAccountRecoveryEndpoints.cs

**Other:** CredentialNotificationRequestDTO.cs, CredentialNotificationTemplate.cs, ApplicationUserAccountRecoveryEndpoints.cs, ICredentialNotificationService.cs, IRecoveryAccountUserAppService.cs, AccountRecoveryNotificationServices.cs, PasswordRecoveryEmailDTO.cs, RecoveryCodeEmailDTO.cs, UserCredentialsEmailDTO.cs, CredentialNotificationService.cs, RecoveryAccountUserAppService.cs

### AuthLuxuryApp/Auth

**DTOs:** ApplicationUserEditDTO.cs, ApplicationUserGetInfoDTO.cs, InitiateRecoveryByCodeDTO.cs, PersonDataEditDTO.cs, RecoverPasswordDTO.cs, UserNameDTO.cs, ValidarRfcDTO.cs, ValidateRecoveryCodeDTO.cs, ValidateRecoveryCodeResultDTO.cs

**Services:** AuthAppService.cs, JwtService.cs, PersonDataAppService.cs, UserConnectionStatusService.cs

**EndPoints:** AccesoCustomersEndPoints.cs, AuthEndpoints.cs

**Other:** IAccesoCustomersAppService.cs, ApplicationUserEditDTO.cs, ApplicationUserGetInfoDTO.cs, InitiateRecoveryByCodeDTO.cs, PersonDataEditDTO.cs, RecoverPasswordDTO.cs, UserNameDTO.cs, ValidarRfcDTO.cs, ValidateRecoveryCodeDTO.cs, ValidateRecoveryCodeResultDTO.cs, AccesoCustomersEndPoints.cs, AuthEndpoints.cs, IAuthAppService.cs, IJwtService.cs, IPersonDataAppService.cs, IUserConnectionStatusService.cs, ApplicationUserMapper.cs, AuthAppService.cs, JwtService.cs, PersonDataAppService.cs, UserConnectionStatusService.cs

### AuthLuxuryApp/Identity

### AuthLuxuryApp/PasswordManager

**DTOs:** CredentialAddOrEditDTO.cs, CredentialDTOs.cs

**Services:** PasswordAppService.cs

**EndPoints:** PasswordsEndpoints.cs

**Other:** CredentialAddOrEditDTO.cs, CredentialDTOs.cs, PasswordsEndpoints.cs, IPasswordAppService.cs, PasswordMappingProfile.cs, PasswordAppService.cs

### AuthLuxuryApp/ProfileUsers

**Services:** UserProfileAppService.cs

**EndPoints:** UsersEndpoints.cs

**Other:** UsersEndpoints.cs, IUserProfileAppService.cs, UserProfileAppService.cs

### CobranzaLuxuryApp/AspelCobranzaHausLive

**Entities:** AspelCustomerEmpresa.cs

**DTOs:** AspelCobranzaHausAuditDTOs.cs, AspelCobranzaHausDTOs.cs

**Services:** AspelCobranzaHausAppService.cs, AspelCobranzaHausDetalleAppService.cs

**EndPoints:** AspelCobranzaEndPoints.cs

**Other:** AspelCobranzaHausAuditDTOs.cs, AspelCobranzaHausDTOs.cs, AspelCobranzaEndPoints.cs, AspelCustomerEmpresa.cs, IAspelCobranzaHausAppService.cs, IAspelCobranzaHausDetalleAppService.cs, AspelCobranzaHausAppService.cs, AspelCobranzaHausDetalleAppService.cs

### CobranzaLuxuryApp/AspelCobranzaHausLocal

**DTOs:** AspelCobranzaHausLocalDTOs.cs

**Services:** AspelCobranzaHausLocalAppService.cs, AspelCobranzaHausLocalDetalleAppService.cs, AspelCobranzaHausLocalSupport.cs

**EndPoints:** AspelCobranzaHausLocalEndPoints.cs

**Other:** AspelCobranzaHausLocalDTOs.cs, AspelCobranzaHausLocalEndPoints.cs, IAspelCobranzaHausLocalAppService.cs, IAspelCobranzaHausLocalDetalleAppService.cs, AspelCobranzaHausLocalAppService.cs, AspelCobranzaHausLocalDetalleAppService.cs, AspelCobranzaHausLocalSupport.cs

### CobranzaLuxuryApp/CobranzaNativa

**Other:** ChargeResponseDTO.cs, CobranzaPaymentAllocationDetailDTO.cs, CobranzaPaymentResponseDTO.cs, CreateChargeDTO.cs, CreateCobranzaPaymentDTO.cs, UpdateChargeDTO.cs, UpdateCobranzaPaymentDTO.cs, BillingConfigEndPoints.cs, BillingConfig.cs, AdjustmentResponseDTO.cs, CancelApprovalDTO.cs, CreateAdjustmentDTO.cs, CreateCreditNoteDTO.cs, CreditNoteResponseDTO.cs, ReviewApprovalDTO.cs, AdjustmentsEndPoints.cs, FinancialApprovalsEndPoints.cs, AdjustmentRecord.cs, CreditNote.cs, IAdjustmentService.cs, IFinancialApprovalService.cs, AdjustmentService.cs, FinancialApprovalService.cs, FinancialAuditEndPoints.cs, IFinancialAuditService.cs, FinancialAuditService.cs, BulkChargeImportDTO.cs, BulkSetInitialBalanceDTO.cs, BulkSetInitialBalanceResultDTO.cs, FeePreviewRequestDTO.cs, PropertyInitialBalanceDTO.cs, SetInitialBalanceItemDTO.cs, ChargesEndPoints.cs, CatalogoGastosFijos.cs, CatalogoGastosFijosDetalles.cs, Charge.cs, ChargePaymentAllocation.cs, IChargeAppService.cs, IChargesGeneratorService.cs, ChargeAppService.cs, ChargesGeneratorService.cs, ChargeTypeCatalogResponseDTO.cs, CreateChargeTypeCatalogDTO.cs, UpdateChargeTypeCatalogDTO.cs, ChargeTypesEndPoints.cs, ChargeTypeCatalog.cs, IChargeTypeCatalogAppService.cs, ChargeTypeCatalogAppService.cs, ChargeTypeCatalogSupport.cs, CollectionActivityDTO.cs, CollectionCaseResponseDTO.cs, CreateCollectionCaseDTO.cs, LogCollectionActivityDTO.cs, UpdateCollectionCaseDTO.cs, CollectionCasesEndpoints.cs, CollectionActivity.cs, CollectionCase.cs, CollectionCaseCharge.cs, ICollectionCaseAppService.cs, ICollectionManagerService.cs, CollectionCaseAppService.cs, CollectionManagerService.cs, CreatePropertyFineDTO.cs, CreateRegulationArticleDTO.cs, FineEvidenceResponseDTO.cs, IssueFineChargeDTO.cs, PropertyFineResponseDTO.cs, RegulationArticleResponseDTO.cs, UpdatePropertyFineDTO.cs, UpdateRegulationArticleDTO.cs, PropertyFinesEndpoints.cs, RegulationArticlesEndPoints.cs, IPropertyFineAppService.cs, IRegulationArticleAppService.cs, PropertyFineAppService.cs, RegulationArticleAppService.cs, CancelInvoiceRequestDTO.cs, GenerateInvoiceRequestDTO.cs, InvoiceResponseDTO.cs, InvoicesEndpoints.cs, Invoice.cs, UsoCFDI.cs, IInvoiceQueryAppService.cs, IInvoiceService.cs, InvoiceQueryAppService.cs, InvoiceService.cs, CreateLateFeePolicyDTO.cs, LateFeePolicyResponseDTO.cs, UpdateLateFeePolicyDTO.cs, LateFeePoliciesEndPoints.cs, LateFeePolicy.cs, MorosidadPolicy.cs, ILateFeeCalculatorService.cs, ILateFeePolicyAppService.cs, LateFeeCalculatorService.cs, LateFeePolicyAppService.cs, FinancialLedgerEntryResponseDTO.cs, LedgerEndPoints.cs, CobranzaPoliza.cs, CobranzaSaldo.cs, ILedgerIntegrityService.cs, ILedgerService.cs, LedgerIntegrityService.cs, LedgerService.cs, EndMembershipDTO.cs, PropertyMembersEndPoints.cs, IPropertyMemberService.cs, PropertyMemberService.cs, CobranzaMetricasResponseDTO.cs, TendenciaMensualDTO.cs, TopDeudorDTO.cs, CobranzaMetricasEndPoints.cs, ICobranzaMetricasService.cs, CobranzaMetricasService.cs, NativeCollectionNotificationSettingsResponseDTO.cs, NativeCollectionRealTimeUpdateDTO.cs, SaveNativeCollectionNotificationSettingsDTO.cs, SendNativeStatementBatchRequestDTO.cs, SendNativeStatementBatchResponseDTO.cs, SendNativeStatementEmailRequestDTO.cs, NativeCollectionNotificationsEndpoints.cs, NotificationSettingsEndPoints.cs, NativeCollectionNotificationSetting.cs, ICobranzaNativaNotificationService.cs, INativeCollectionNotificationSettingsService.cs, INativeCollectionRealTimeService.cs, INotificationEngineService.cs, CobranzaNativaNotificationService.cs, NativeCollectionNotificationSettingsService.cs, NativeCollectionRealTimeService.cs, NotificationEngineService.cs, ApplyPaymentResultDTO.cs, ApplyPaymentToChargesDTO.cs, CancelPaymentDTO.cs, ChargeAllocationItemDTO.cs, ChargeAllocationResultDTO.cs, CobranzaWebhookPayloadDTO.cs, PendingChargeDTO.cs, CobranzaPaymentsEndPoints.cs, WebhooksEndPoints.cs, Bank.cs, CobranzaCuenta.cs, CobranzaPayment.cs, FormaPago.cs, MetodoDePago.cs, ICobranzaPaymentAppService.cs, IPaymentAllocationService.cs, IWebhookHandlerService.cs, CobranzaPaymentAppService.cs, PaymentAllocationService.cs, WebhookHandlerService.cs, ClosePeriodDTO.cs, ReopenPeriodDTO.cs, PeriodClosuresEndPoints.cs, CobranzaPeriodClosure.cs, IPeriodClosureService.cs, PeriodClosureService.cs, ReconciliationsEndpoints.cs, CobranzaAuxiliar.cs, CobranzaExcludedAccount.cs, IReconciliationService.cs, ReconciliationService.cs, AgingDTO.cs, LedgerEntryDTO.cs, NativeStatementResponseDTO.cs, PropertyInfoDTO.cs, StatementSummaryDTO.cs, NativeStatementsEndpoints.cs, INativeStatementService.cs, NativeStatementPdfExportService.cs, NativeStatementService.cs, ChargeTemplateResponseDTO.cs, CreateChargeTemplateDTO.cs, UpdateChargeTemplateDTO.cs, ChargeTemplatesEndPoints.cs, ChargeTemplate.cs, IChargeTemplateAppService.cs, ChargeTemplateAppService.cs

### CobranzaLuxuryApp/CobranzaOnline

**Services:** CobranzaOnlineAccountAppService.cs, CobranzaOnlineBalanceAppService.cs, CobranzaOnlineClasificador.cs, CobranzaOnlineDashboardAppService.cs, CobranzaOnlineHelpers.cs, CobranzaOnlineMovementAppService.cs, CobranzaOnlinePolicyAppService.cs, CobranzaOnlinePortfolioAppService.cs, CobranzaOnlineReporteFinancieroAppService.cs, CobranzaOnlineStatementAppService.cs, CobranzaOnlineTypes.cs, ExclusionesBuilder.cs, IExclusionesBuilder.cs

**EndPoints:** AspelSyncEndPoints.cs, CobranzaOnlineAccountEndPoints.cs, CobranzaOnlineBalanceEndPoints.cs, CobranzaOnlineDashboardEndPoints.cs, CobranzaOnlineMovementEndPoints.cs, CobranzaOnlinePolicyEndPoints.cs, CobranzaOnlinePortfolioEndPoints.cs, CobranzaOnlineReporteFinancieroEndPoints.cs, CobranzaOnlineStatementEndPoints.cs

**Other:** AspelSyncEndPoints.cs, CobranzaOnlineAccountEndPoints.cs, CobranzaOnlineBalanceEndPoints.cs, CobranzaOnlineDashboardEndPoints.cs, CobranzaOnlineMovementEndPoints.cs, CobranzaOnlinePolicyEndPoints.cs, CobranzaOnlinePortfolioEndPoints.cs, CobranzaOnlineReporteFinancieroEndPoints.cs, CobranzaOnlineStatementEndPoints.cs, CobranzaOnlineAccountAppService.cs, CobranzaOnlineBalanceAppService.cs, CobranzaOnlineClasificador.cs, CobranzaOnlineDashboardAppService.cs, CobranzaOnlineHelpers.cs, CobranzaOnlineMovementAppService.cs, CobranzaOnlinePolicyAppService.cs, CobranzaOnlinePortfolioAppService.cs, CobranzaOnlineReporteFinancieroAppService.cs, CobranzaOnlineStatementAppService.cs, CobranzaOnlineTypes.cs, ExclusionesBuilder.cs, IExclusionesBuilder.cs

### CommitteeLuxuryApp/DTOs

### CommitteeLuxuryApp/EndPoints

### CommitteeLuxuryApp/Interfaces

### CommitteeLuxuryApp/Services

### ComprasLuxuryApp/HistorialCompras

**DTOs:** EstadoPagoHistorialCompra.cs, HistorialComprasFilterDTO.cs, OrdenesCompraPagadasDTO.cs, TipoOrdenHistorialCompra.cs

**Services:** HistorialComprasAppService.cs

**EndPoints:** HistorialComprasEndPoints.cs

**Other:** EstadoPagoHistorialCompra.cs, HistorialComprasFilterDTO.cs, OrdenesCompraPagadasDTO.cs, TipoOrdenHistorialCompra.cs, HistorialComprasEndPoints.cs, IHistorialComprasAppService.cs, HistorialComprasAppService.cs

### ComprasLuxuryApp/PurchaseOrders

**Entities:** CatalogPurchaseOrderBudget.cs, OrdenCompra.cs, OrdenCompraAuth.cs, OrdenCompraComprobantePago.cs, OrdenCompraDatosPago.cs, OrdenCompraDetalle.cs, OrdenCompraFactura.cs, OrdenCompraStatus.cs, PurchaseOrderBudget.cs

**Other:** CatalogPurchaseOrderBudget.cs, OrdenCompra.cs, OrdenCompraAuth.cs, OrdenCompraComprobantePago.cs, OrdenCompraDatosPago.cs, OrdenCompraDetalle.cs, OrdenCompraFactura.cs, OrdenCompraStatus.cs, PurchaseOrderBudget.cs

### ComprasLuxuryApp/SolicitudesCompra

**Other:** IComparativoAppService.cs, ICotizacionProveedorAppService.cs, CotizacionMapper.cs, ISolicitudCompraDetalleAppService.cs, DetalleMapper.cs, IEvidenciaAppService.cs, EvidenciaMapper.cs, IPresupuestoAppService.cs, PresupuestoMapper.cs, NivelPrioridad.cs, TipoSolicitudCompra.cs, ISolicitudCompraAppService.cs, SolicitudCompraMapper.cs

### ContabilidadLuxuryApp/AccountingCatalog

**Entities:** AccountingCatalog.cs

**DTOs:** AccountingCatalogDTO.cs, CreateAccountingCatalogDTO.cs, GroupedAccountingCatalogDTO.cs, UpdateAccountingCatalogDTO.cs

**Services:** AccountingCatalogAppService.cs

**EndPoints:** AccountingCatalogEndPoints.cs

**Other:** AccountingCatalogDTO.cs, CreateAccountingCatalogDTO.cs, GroupedAccountingCatalogDTO.cs, UpdateAccountingCatalogDTO.cs, AccountingCatalogEndPoints.cs, AccountingCatalog.cs, IAccountingCatalogAppService.cs, AccountingCatalogMapper.cs, AccountingCatalogAppService.cs

### ContabilidadLuxuryApp/AutitoriaCuentasAspel

**DTOs:** AutitoriaCuentasAspelDTOs.cs

**Services:** AutitoriaCuentasAspelService.cs

**EndPoints:** AutitoriaCuentasAspelEndPoints.cs

**Other:** AutitoriaCuentasAspelDTOs.cs, AutitoriaCuentasAspelEndPoints.cs, IAutitoriaCuentasAspelService.cs, AutitoriaCuentasAspelService.cs

### ContabilidadLuxuryApp/CatalogoGastosFijos

**DTOs:** CatalogoGastosFijosAddOrEditDTO.cs, CatalogoGastosFijosDTO.cs

**Services:** CatalogoGastosFijosAppService.cs

**EndPoints:** CatalogoGastosFijosEndPoints.cs

**Other:** CatalogoGastosFijosAddOrEditDTO.cs, CatalogoGastosFijosDTO.cs, CatalogoGastosFijosEndPoints.cs, ICatalogoGastosFijosAppService.cs, CatalogoGastosFijosMapper.cs, CatalogoGastosFijosAppService.cs

### ContabilidadLuxuryApp/ContabilidadConfig

**DTOs:** AspelCustomerEmpresaCreateDTO.cs, AspelCustomerEmpresaDTO.cs, AspelCustomerEmpresaUpdateDTO.cs, BillingConfigDTO.cs, CoiMapeoDTO.cs

**Services:** AspelCustomerEmpresaAppService.cs, BillingConfigAppService.cs, CoiMapeoAppService.cs

**EndPoints:** AspelCustomerEmpresaEndPoints.cs

**Other:** AspelCustomerEmpresaCreateDTO.cs, AspelCustomerEmpresaDTO.cs, AspelCustomerEmpresaUpdateDTO.cs, BillingConfigDTO.cs, CoiMapeoDTO.cs, AspelCustomerEmpresaEndPoints.cs, IAspelCustomerEmpresaAppService.cs, IBillingConfigAppService.cs, ICoiMapeoAppService.cs, AspelCustomerEmpresaMappingProfile.cs, AspelCustomerEmpresaAppService.cs, BillingConfigAppService.cs, CoiMapeoAppService.cs

### ContabilidadLuxuryApp/ContabilidadMigration

**DTOs:** AspelAuxiliarRaw.cs, AspelCoiGlobalDataDTO.cs, AspelCoiGlobalResponseDTO.cs, AspelCuentaRaw.cs, AspelPolizaRaw.cs, AspelPresupuestoRaw.cs, AspelRawModels.cs

**Services:** AspelCoiMigrationApiClient.cs, CobranzaMigratorService.cs, ContabilidadMigratorService.cs

**Other:** AspelAuxiliarRaw.cs, AspelCoiGlobalDataDTO.cs, AspelCoiGlobalResponseDTO.cs, AspelCuentaRaw.cs, AspelPolizaRaw.cs, AspelPresupuestoRaw.cs, AspelRawModels.cs, AspelCoiMigrationApiClient.cs, CobranzaMigratorService.cs, ContabilidadMigratorService.cs

### ContabilidadLuxuryApp/ContabilidadOnline

**Entities:** CoiCobranzaAccount.cs, CoiCobranzaBalance.cs, CoiCobranzaMovement.cs, CoiCobranzaPolicy.cs, CoiFiscalPeriod.cs, ContabilidadAuxiliar.cs, ContabilidadCuenta.cs, ContabilidadFiscalPeriod.cs, ContabilidadPoliza.cs, ContabilidadPresupuesto.cs, ContabilidadSaldo.cs

**DTOs:** AnalisisCobranzaDTO.cs, AskAccountingAiDTO.cs, AskContabilidadOnlineAiDTO.cs, AspelAuxiliarDTO.cs, AspelCuentaDTO.cs, AspelDatosCombinadosDTO.cs, AspelPolizaDTO.cs, AspelPresupuestoDTO.cs, AspelRawDataDTO.cs, AspelRawResponseDTO.cs, AspelSaldoDTO.cs, BancosInversionesDTO.cs, BaseAccountDTO.cs, CedulaExtraordinariaDTO.cs, ClasificacionCuentasDTO.cs, CobranzaCondominoDTO.cs, CuentaDetalleDTO.cs, CuentaFaltanteDTO.cs, CuentaMayorDTO.cs, EpfCuentaDTO.cs, EpfDTO.cs, FinancialStatementDTO.cs, FlujoCajaDTO.cs, FondoReservaDTO.cs, ObsoleteAccountDTO.cs, PresupuestoContabilidadDTO.cs, ProyectosAprobadosDTO.cs, RawAspelAccountDTO.cs, ReporteFinancieroDTO.cs, SubcuentaDTO.cs

**Services:** AnalisisCobranzaOnlineService.cs, AnalisisCobranzaService.cs, BancosInversionesService.cs, CedulaExtraordinariaService.cs, CedulaPresupuestalService.cs, ContabilidadOnlineLocalService.cs, ContabilidadReportBaseService.cs, EpfService.cs, EstadoResultadosService.cs, EstadoResultadosServiceV2.cs, FlujoCajaService.cs, FondoReservaService.cs, PresupuestoContabilidadService.cs, ProyectosAprobadosService.cs, ReporteFinancieroService.cs, ValidacionCatalogoService.cs

**EndPoints:** ContabilidadOnlineEndPoints.cs

**Other:** AnalisisCobranzaDTO.cs, AskAccountingAiDTO.cs, AskContabilidadOnlineAiDTO.cs, AspelAuxiliarDTO.cs, AspelCuentaDTO.cs, AspelDatosCombinadosDTO.cs, AspelPolizaDTO.cs, AspelPresupuestoDTO.cs, AspelRawDataDTO.cs, AspelRawResponseDTO.cs, AspelSaldoDTO.cs, BancosInversionesDTO.cs, BaseAccountDTO.cs, CedulaExtraordinariaDTO.cs, ClasificacionCuentasDTO.cs, CobranzaCondominoDTO.cs, CuentaDetalleDTO.cs, CuentaFaltanteDTO.cs, CuentaMayorDTO.cs, EpfCuentaDTO.cs, EpfDTO.cs, FinancialStatementDTO.cs, FlujoCajaDTO.cs, FondoReservaDTO.cs, ObsoleteAccountDTO.cs, PresupuestoContabilidadDTO.cs, ProyectosAprobadosDTO.cs, RawAspelAccountDTO.cs, ReporteFinancieroDTO.cs, SubcuentaDTO.cs, ContabilidadOnlineEndPoints.cs, CoiCobranzaAccount.cs, CoiCobranzaBalance.cs, CoiCobranzaMovement.cs, CoiCobranzaPolicy.cs, CoiFiscalPeriod.cs, ContabilidadAuxiliar.cs, ContabilidadCuenta.cs, ContabilidadFiscalPeriod.cs, ContabilidadPoliza.cs, ContabilidadPresupuesto.cs, ContabilidadSaldo.cs, IAnalisisCobranzaOnlineService.cs, IAnalisisCobranzaService.cs, IBancosInversionesService.cs, ICedulaExtraordinariaService.cs, ICedulaPresupuestalService.cs, IEpfService.cs, IEstadoResultadosService.cs, IEstadoResultadosServiceV2.cs, IFlujoCajaService.cs, IFondoReservaService.cs, IPresupuestoContabilidadService.cs, IProyectosAprobadosService.cs, IReporteFinancieroService.cs, IValidacionCatalogoService.cs, AnalisisCobranzaOnlineService.cs, AnalisisCobranzaService.cs, BancosInversionesService.cs, CedulaExtraordinariaService.cs, CedulaPresupuestalService.cs, ContabilidadOnlineLocalService.cs, ContabilidadReportBaseService.cs, EpfService.cs, EstadoResultadosService.cs, EstadoResultadosServiceV2.cs, FlujoCajaService.cs, FondoReservaService.cs, PresupuestoContabilidadService.cs, ProyectosAprobadosService.cs, ReporteFinancieroService.cs, ValidacionCatalogoService.cs

### ContabilidadLuxuryApp/DynamicReports

**DTOs:** AccountCatalogItemDTO.cs, AccountFilterDTO.cs, ExecuteReportRequestDTO.cs, LivePreviewDTO.cs, ReportBodyDTO.cs, ReportChangeEntryDTO.cs, ReportColumnDTO.cs, ReportDefinitionDTO.cs, ReportDefinitionListDTO.cs, ReportResultDTO.cs, ReportRowDTO.cs, ReportSectionDTO.cs

**Services:** AccountFilterResolver.cs, DynamicReportEngineService.cs, FormulaEvaluatorService.cs, LivePreviewEngineService.cs, PeriodValueExtractor.cs, ReportDefinitionService.cs, ReportExcelExportService.cs, ReportPdfExportService.cs

**EndPoints:** DynamicReportEndpoints.cs

**Other:** AccountCatalogItemDTO.cs, AccountFilterDTO.cs, ExecuteReportRequestDTO.cs, LivePreviewDTO.cs, ReportBodyDTO.cs, ReportChangeEntryDTO.cs, ReportColumnDTO.cs, ReportDefinitionDTO.cs, ReportDefinitionListDTO.cs, ReportResultDTO.cs, ReportRowDTO.cs, ReportSectionDTO.cs, DynamicReportEndpoints.cs, AspelFastDTOs.cs, IAspelFastReportQueryService.cs, AspelFastReportQueryService.cs, IDynamicReportEngineService.cs, ILivePreviewEngineService.cs, IReportDefinitionService.cs, AccountFilterResolver.cs, DynamicReportEngineService.cs, FormulaEvaluatorService.cs, LivePreviewEngineService.cs, PeriodValueExtractor.cs, ReportDefinitionService.cs, ReportExcelExportService.cs, ReportPdfExportService.cs

### ContabilidadLuxuryApp/EspejoAspelFull

**DTOs:** EspejoAspelFullResponseDTO.cs, EspejoCuentaNivel1DTO.cs, EspejoCuentaNivel2DTO.cs, EspejoCuentaNivel3DTO.cs, EspejoCuentaNivel4DTO.cs, EspejoGrupoDTO.cs

**Services:** EspejoAspelFullService.cs

**EndPoints:** EspejoAspelFullEndPoints.cs

**Other:** EspejoAspelFullResponseDTO.cs, EspejoCuentaNivel1DTO.cs, EspejoCuentaNivel2DTO.cs, EspejoCuentaNivel3DTO.cs, EspejoCuentaNivel4DTO.cs, EspejoGrupoDTO.cs, EspejoAspelFullEndPoints.cs, IEspejoAspelFullService.cs, EspejoAspelFullService.cs

### ContabilidadLuxuryApp/ExpenseCatalogBudget

**DTOs:** CatalogPurchaseOrderBudgetAddOrEditDTO.cs, CatalogPurchaseOrderBudgetDTO.cs

**Services:** CatalogoGastosFijosPresupuestoAppService.cs

**EndPoints:** CatalogoGastosFijosPresupuestoEndPoints.cs

**Other:** CatalogPurchaseOrderBudgetAddOrEditDTO.cs, CatalogPurchaseOrderBudgetDTO.cs, CatalogoGastosFijosPresupuestoEndPoints.cs, ICatalogoGastosFijosPresupuestoAppService.cs, CatalogoGastosFijosPresupuestoAppService.cs

### ContabilidadLuxuryApp/ExpenseCatalogDetail

**DTOs:** CatalogoGastosFijosDetalleAddOrEditDTO.cs, CatalogoGastosFijosDetalleDTO.cs, CatalogoGastosFijosDetallesDTO.cs

**Services:** CatalogoGastosFijosDetallesAppService.cs

**EndPoints:** CatalogoGastosFijosDetallesEndPoints.cs

**Other:** CatalogoGastosFijosDetalleAddOrEditDTO.cs, CatalogoGastosFijosDetalleDTO.cs, CatalogoGastosFijosDetallesDTO.cs, CatalogoGastosFijosDetallesEndPoints.cs, ICatalogoGastosFijosDetallesAppService.cs, CatalogoGastosFijosDetallesMapper.cs, CatalogoGastosFijosDetallesAppService.cs

### ContabilidadLuxuryApp/FinancialAccounting

**Entities:** EstadoFinanciero.cs, FinancialApprovalRequest.cs, FinancialAuditLog.cs, FinancialBatch.cs, FinancialLedgerEntry.cs, FinancialReport.cs, FinancialReportRow.cs, FinancialReportRowSource.cs

**DTOs:** FinancialReportCreateDTO.cs, FinancialReportFileDTO.cs, FinancialReportListCustomerDTO.cs, FinancialReportYearlyStatusDTO.cs, MeetingContabilidadDTO.cs, SeguimientosMinutaContabilidadDTO.cs

**Services:** ContabilidadMinutaAppService.cs, FinancialReportAppService.cs

**EndPoints:** ContabilidadMinutaEndPoints.cs, FinancialReportEndpoints.cs, FundingAccountingEndPoints.cs

**Other:** FinancialReportCreateDTO.cs, FinancialReportFileDTO.cs, FinancialReportListCustomerDTO.cs, FinancialReportYearlyStatusDTO.cs, MeetingContabilidadDTO.cs, SeguimientosMinutaContabilidadDTO.cs, ContabilidadMinutaEndPoints.cs, FinancialReportEndpoints.cs, FundingAccountingEndPoints.cs, EstadoFinanciero.cs, FinancialApprovalRequest.cs, FinancialAuditLog.cs, FinancialBatch.cs, FinancialLedgerEntry.cs, FinancialReport.cs, FinancialReportRow.cs, FinancialReportRowSource.cs, IContabilidadMinutaAppService.cs, IFinancialReportAppService.cs, ContabilidadMinutaAppService.cs, FinancialReportAppService.cs

### ContabilidadLuxuryApp/Fondeos

**Entities:** Funding.cs

**DTOs:** AnalyzedInvoiceDTO.cs, BulkSolicitudesPagoRequestDTO.cs, CreateOrdersFromInvoicesRequestDTO.cs, FondeoCaratulaDTO.cs, FundingAccountingListDTO.cs, FundingAddOrEditDTO.cs, FundingCreateDTO.cs, FundingDetailDTO.cs, ItemsFondeoCaratulaDTO.cs, RequestFondeoCaratulaDTO.cs, UpdateOrderDTO.cs, ValidationResultDTO.cs

**Services:** FundingAppService.cs

**EndPoints:** FundingEndpoints.cs

**Helpers:** FundingHelper.cs, FundingProjections.cs

**Other:** AnalyzedInvoiceDTO.cs, BulkSolicitudesPagoRequestDTO.cs, CreateOrdersFromInvoicesRequestDTO.cs, FondeoCaratulaDTO.cs, FundingAccountingListDTO.cs, FundingAddOrEditDTO.cs, FundingCreateDTO.cs, FundingDetailDTO.cs, ItemsFondeoCaratulaDTO.cs, RequestFondeoCaratulaDTO.cs, UpdateOrderDTO.cs, ValidationResultDTO.cs, FundingEndpoints.cs, Funding.cs, FundingHelper.cs, FundingProjections.cs, IFundingAppService.cs, FundingMapper.cs, FundingAppService.cs

### ContabilidadLuxuryApp/FundingFile

**Services:** FundingFileAppService.cs

**EndPoints:** FundingFileEndpoints.cs

**Other:** FundingFileEndpoints.cs, IFundingFileAppService.cs, FundingFileAppService.cs

### ContabilidadLuxuryApp/MaintenanceReport

**Services:** MaintenanceReportAppService.cs

**EndPoints:** MaintenanceReportEndPoints.cs

**Other:** MaintenanceReportEndPoints.cs, IMaintenanceReportAppService.cs, MaintenanceReportAppService.cs

### ContabilidadLuxuryApp/Persistence

**Other:** AdjustmentRecordConfiguration.cs, ChargeConfiguration.cs, ChargePaymentAllocationConfiguration.cs, ChargeTemplateConfiguration.cs, ChargeTypeCatalogConfiguration.cs, CobranzaPaymentConfiguration.cs, CobranzaPeriodClosureConfiguration.cs, CollectionActivityConfiguration.cs, CollectionCaseChargeConfiguration.cs, CollectionCaseConfiguration.cs, CreditNoteConfiguration.cs, FinancialApprovalRequestConfiguration.cs, FinancialAuditLogConfiguration.cs, FinancialBatchConfiguration.cs, FinancialLedgerEntryConfiguration.cs, FineEvidenceConfiguration.cs, InvoiceConfiguration.cs, NotificationLogConfiguration.cs, PolicySnapshotConfiguration.cs, PropertyFineConfiguration.cs, PropertyMemberConfiguration.cs, RegulationArticleConfiguration.cs, ResponsiblePartySnapshotConfiguration.cs

### ContabilidadLuxuryApp/Presupuesto

**Entities:** BudgetAccountRule.cs, BudgetExecution.cs

**DTOs:** BudgetAccountRuleDTOs.cs, PresupuestoCuentaDTO.cs

**Services:** BudgetAccountRuleAppService.cs

**EndPoints:** BudgetAccountRulesEndPoints.cs

**Other:** BudgetAccountRuleDTOs.cs, PresupuestoCuentaDTO.cs, BudgetAccountRulesEndPoints.cs, BudgetAccountRule.cs, BudgetExecution.cs, BudgetAccountRuleAppService.cs

### ContabilidadLuxuryApp/PresupuestoPropuesta

**Entities:** BudgetProposal.cs, BudgetProposalItem.cs, BudgetProposalItemHistory.cs, BudgetProposalItemSupportFile.cs

**DTOs:** AddBudgetProposalItemSupportFilesDTO.cs, AvailableAccountDTO.cs, BudgetAuditDTO.cs, BudgetForecastRequestDTO.cs, BudgetProposalDTO.cs, BudgetProposalItemDTO.cs, BudgetProposalItemHistoryDTO.cs, BudgetProposalItemSupportDetailsDTO.cs, BudgetProposalItemSupportFileDTO.cs, CreateBudgetProposalDTO.cs, IndivisoFeeComparisonDTO.cs, ProjectedExpenseItemDTO.cs, PropertyIndivisoDetailDTO.cs, UniformFeeComparisonDTO.cs, UpdateBudgetProposalItemSupportInfoDTO.cs, UpdateProposalItemDTO.cs

**Services:** BudgetProposalItemSupportService.cs, BudgetProposalService.cs

**EndPoints:** BudgetProposalEndPoints.cs, BudgetProposalItemSupportEndpoints.cs

**Other:** AddBudgetProposalItemSupportFilesDTO.cs, AvailableAccountDTO.cs, BudgetAuditDTO.cs, BudgetForecastRequestDTO.cs, BudgetProposalDTO.cs, BudgetProposalItemDTO.cs, BudgetProposalItemHistoryDTO.cs, BudgetProposalItemSupportDetailsDTO.cs, BudgetProposalItemSupportFileDTO.cs, CreateBudgetProposalDTO.cs, IndivisoFeeComparisonDTO.cs, ProjectedExpenseItemDTO.cs, PropertyIndivisoDetailDTO.cs, UniformFeeComparisonDTO.cs, UpdateBudgetProposalItemSupportInfoDTO.cs, UpdateProposalItemDTO.cs, BudgetProposalEndPoints.cs, BudgetProposalItemSupportEndpoints.cs, BudgetProposal.cs, BudgetProposalItem.cs, BudgetProposalItemHistory.cs, BudgetProposalItemSupportFile.cs, IBudgetProposalItemSupportService.cs, IBudgetProposalService.cs, BudgetProposalProfile.cs, BudgetProposalItemSupportService.cs, BudgetProposalService.cs

### ContabilidadLuxuryApp/PresupuestoShared

**DTOs:** AspelBudgetDTO.cs, CuentaAspelTercerNivelDTO.cs

**Services:** AspelQuotationService.cs, HelperAspel.cs

**Other:** AspelBudgetDTO.cs, CuentaAspelTercerNivelDTO.cs, IAspelQuotationService.cs, IHelperAspel.cs, AspelQuotationService.cs, HelperAspel.cs

### ContabilidadLuxuryApp/PresupuestoWebAspel

**DTOs:** ApBalanceReportDTO.cs, BalanceSheetDTO.cs, BudgetExecutionItemDTO.cs, FinancialAnalysisDTO.cs, SimpleReportItemDTO.cs

**Services:** AspelMappingService.cs

**EndPoints:** PresupuestoEndPoints.cs

**Other:** ApBalanceReportDTO.cs, BalanceSheetDTO.cs, BudgetExecutionItemDTO.cs, FinancialAnalysisDTO.cs, SimpleReportItemDTO.cs, PresupuestoEndPoints.cs, IAspelMappingService.cs, AspelMappingService.cs

### ContabilidadLuxuryApp/ProjectedExpenses

**DTOs:** ProjectedExpenseAddOrEditDTO.cs, ProjectedExpenseDTO.cs, ProjectedExpenseRecurrenceDTO.cs

**Services:** ProjectedExpenseAppService.cs

**EndPoints:** ProjectedExpensesEndPoints.cs

**Other:** ProjectedExpenseAddOrEditDTO.cs, ProjectedExpenseDTO.cs, ProjectedExpenseRecurrenceDTO.cs, ProjectedExpensesEndPoints.cs, IProjectedExpenseAppService.cs, BudgetExecutionProfile.cs, ProjectedExpenseMapper.cs, ProjectedExpenseAppService.cs

### ContabilidadLuxuryApp/Reports

**DTOs:** DestinatariosEmailReporteDTO.cs

**Services:** ReportSubmissionRecordAppService.cs

**Other:** DestinatariosEmailReporteDTO.cs, IReportSubmissionRecordAppService.cs, EmergencyMapper.cs, ReportSubmissionRecordAppService.cs

### ContabilidadLuxuryApp/Shared

**DTOs:** AccountFlatItemDTO.cs, AccountTreeNodeDTO.cs

**Services:** AccountCatalogService.cs, AspelAccountFormatter.cs, AspelCoiApiClient.cs

**Other:** AccountFlatItemDTO.cs, AccountTreeNodeDTO.cs, IAccountCatalogService.cs, IAspelCoiApiClient.cs, IContabilidadOnlineLocalService.cs, AccountCatalogService.cs, AspelAccountFormatter.cs, AspelCoiApiClient.cs

### DireccionLuxuryApp/JuntasMensuales

**Other:** AsambleaChecklistExecutionDTO.cs, AsambleaChecklistUpdateStatusDTO.cs, AsambleaChecklistEndpoints.cs, IAsambleaChecklistAppService.cs, IAsambleaChecklistService.cs, AsambleaChecklistAppService.cs, AsambleaChecklistService.cs

### LegalLuxuryApp/EmployeeContracts

**Entities:** AddendumTemplate.cs, ContractAddendum.cs, ContractRenewalEnums.cs, ContractRenewalEvaluation.cs, ContractTemplate.cs, EmployeeWorkContract.cs, WorkContract.cs

**DTOs:** ContractAddendumDTOs.cs, ContractRenewalDTOs.cs, EmployeeWorkContractCreateDTO.cs, EmployeeWorkContractDTO.cs, EmployeeWorkContractTerminateDTO.cs, EmployeeWorkContractUpdateDTO.cs

**Services:** ContractAddendumAppService.cs, ContractRenewalAppService.cs, EmployeeContractGeneratorService.cs, EmployeeWorkContractAppService.cs

**EndPoints:** ContractAddendumsEndPoints.cs, EmployeeWorkContractsEndPoints.cs

**Other:** ContractAddendumDTOs.cs, ContractRenewalDTOs.cs, EmployeeWorkContractCreateDTO.cs, EmployeeWorkContractDTO.cs, EmployeeWorkContractTerminateDTO.cs, EmployeeWorkContractUpdateDTO.cs, ContractAddendumsEndPoints.cs, EmployeeWorkContractsEndPoints.cs, AddendumTemplate.cs, ContractAddendum.cs, ContractRenewalEnums.cs, ContractRenewalEvaluation.cs, ContractTemplate.cs, EmployeeWorkContract.cs, WorkContract.cs, IContractAddendumAppService.cs, IContractRenewalAppService.cs, IEmployeeContractGeneratorService.cs, IEmployeeWorkContractAppService.cs, ContractAddendumAppService.cs, ContractRenewalAppService.cs, EmployeeContractGeneratorService.cs, EmployeeWorkContractAppService.cs

### LegalLuxuryApp/Employees

**EndPoints:** LegalEmployeesEndPoints.cs

**Other:** LegalEmployeesEndPoints.cs

### LegalLuxuryApp/Legal

**Other:** BoardDirectorsAppService.cs, IContratoPolizaAppService.cs, PolicyContractMapper.cs, ILegalMatterAppService.cs, ILegalMatterCategoryAppService.cs, ILegalReportAppService.cs

### MantenimientoLuxuryApp/BudgetMaintenance

**Entities:** MaintenanceBudgetForecast.cs

**EndPoints:** BudgetMaintenanceEndPoints.cs

**Other:** BudgetMaintenanceEndPoints.cs, MaintenanceBudgetForecast.cs

### MantenimientoLuxuryApp/CalendarioMaestro

**Entities:** CalendarioMaestro.cs, CalendarioMaestroProvider.cs

**DTOs:** CalendarioMaestroAddOrEditDTO.cs

**Services:** CalendarioMaestroAppService.cs, CalendarioMaestroProviderAppService.cs

**EndPoints:** CalendarioMaestroEndpoints.cs

**Other:** CalendarioMaestroAddOrEditDTO.cs, CalendarioMaestroEndpoints.cs, CalendarioMaestro.cs, CalendarioMaestroProvider.cs, ICalendarioMaestroAppService.cs, ICalendarioMaestroProviderAppService.cs, CalendarioMaestroAppService.cs, CalendarioMaestroProviderAppService.cs

### MantenimientoLuxuryApp/CalendarioMaestroEquipo

**Entities:** CalendarioMaestroEquipo.cs

**DTOs:** CalendarioMaestroEquipoAddOrEditDTO.cs, CalendarioMaestroEquipoDTO.cs

**Services:** CalendarioMaestroEquipoAppService.cs

**EndPoints:** CalendarioMaestroEquipoEndpoints.cs

**Other:** CalendarioMaestroEquipoAddOrEditDTO.cs, CalendarioMaestroEquipoDTO.cs, CalendarioMaestroEquipoEndpoints.cs, CalendarioMaestroEquipo.cs, ICalendarioMaestroEquipoAppService.cs, CalendarioMaestroEquipoMapper.cs, CalendarioMaestroEquipoAppService.cs

### MantenimientoLuxuryApp/ElevatorEmergencyCall

**Entities:** ElevatorsEmergencyCall.cs

**DTOs:** ElevatorsEmergencyCallAddOrEditDTO.cs, ElevatorsEmergencyCallDTO.cs

**Services:** ElevatorsEmergencyCallAppService.cs

**EndPoints:** ElevatorsEmergencyCallEndPoints.cs

**Other:** ElevatorsEmergencyCallAddOrEditDTO.cs, ElevatorsEmergencyCallDTO.cs, ElevatorsEmergencyCallEndPoints.cs, ElevatorsEmergencyCall.cs, IElevatorsEmergencyCallAppService.cs, ElevatorsEmergencyCallAppService.cs

### MantenimientoLuxuryApp/ElevatorSpareParts

**Entities:** ElevatorSparePartsChange.cs

**DTOs:** ElevatorSparePartsChangeAddOrEditDTO.cs, ElevatorSparePartsChangeDTO.cs

**Services:** ElevatorSparePartsChangeAppService.cs

**EndPoints:** ElevatorSparePartsChangeEndPoints.cs

**Other:** ElevatorSparePartsChangeAddOrEditDTO.cs, ElevatorSparePartsChangeDTO.cs, ElevatorSparePartsChangeEndPoints.cs, ElevatorSparePartsChange.cs, IElevatorSparePartsChangeAppService.cs, ElevatorMapper.cs, ElevatorSparePartsChangeAppService.cs

### MantenimientoLuxuryApp/EquipmentInspections

**Entities:** EquipmentInspectionCriterion.cs, EquipmentInspectionDefinition.cs, EquipmentInspectionDefinitionAssignee.cs, EquipmentInspectionDefinitionWeekDay.cs, EquipmentInspectionExecution.cs, EquipmentInspectionExecutionImage.cs, EquipmentInspectionExecutionItem.cs, EquipmentQrLabel.cs

**DTOs:** EquipmentInspectionDefinitionAddOrEditDTO.cs, EquipmentInspectionDefinitionDTO.cs, EquipmentInspectionExecutionDTO.cs, EquipmentQrLabelDTO.cs

**Services:** EquipmentInspectionDefinitionAppService.cs, EquipmentInspectionExecutionAppService.cs, EquipmentQrLabelAppService.cs

**EndPoints:** EquipmentInspectionDefinitionsEndPoints.cs, EquipmentInspectionExecutionsEndPoints.cs, EquipmentQrLabelsEndPoints.cs

**Other:** EquipmentInspectionDefinitionAddOrEditDTO.cs, EquipmentInspectionDefinitionDTO.cs, EquipmentInspectionExecutionDTO.cs, EquipmentQrLabelDTO.cs, EquipmentInspectionDefinitionsEndPoints.cs, EquipmentInspectionExecutionsEndPoints.cs, EquipmentQrLabelsEndPoints.cs, EquipmentInspectionCriterion.cs, EquipmentInspectionDefinition.cs, EquipmentInspectionDefinitionAssignee.cs, EquipmentInspectionDefinitionWeekDay.cs, EquipmentInspectionExecution.cs, EquipmentInspectionExecutionImage.cs, EquipmentInspectionExecutionItem.cs, EquipmentQrLabel.cs, IEquipmentInspectionDefinitionAppService.cs, IEquipmentInspectionExecutionAppService.cs, IEquipmentQrLabelAppService.cs, EquipmentInspectionDefinitionAppService.cs, EquipmentInspectionExecutionAppService.cs, EquipmentQrLabelAppService.cs

### MantenimientoLuxuryApp/FireEquipment

**EndPoints:** FireEquipmentResolveEndpoints.cs

**Other:** FireEquipmentResolveEndpoints.cs

### MantenimientoLuxuryApp/FireExtinguisherInventory

**DTOs:** InventarioExtintorAddOrEditDTO.cs, InventarioExtintorDTO.cs

**Services:** InventarioExtintorAppService.cs

**EndPoints:** InventarioExtintorEndpoints.cs

**Other:** InventarioExtintorAddOrEditDTO.cs, InventarioExtintorDTO.cs, InventarioExtintorEndpoints.cs, IInventarioExtintorAppService.cs, InventarioExtintorMapper.cs, InventarioExtintorAppService.cs

### MantenimientoLuxuryApp/FireExtinguisherLog

**Entities:** BitacoraExtintor.cs

**DTOs:** BitacoraExtintorAddOrEditDTO.cs, BitacoraExtintorDTO.cs

**Services:** BitacoraExtintorAppService.cs

**EndPoints:** BitacoraExtintorEndPoints.cs

**Other:** BitacoraExtintorAddOrEditDTO.cs, BitacoraExtintorDTO.cs, BitacoraExtintorEndPoints.cs, BitacoraExtintor.cs, IBitacoraExtintorAppService.cs, BitacoraExtintorAppService.cs

### MantenimientoLuxuryApp/FireInspectionPeriods

**Entities:** FireCycleInspectionBase.cs, FireCycleInspectionDetector.cs, FireCycleInspectionEstacion.cs, FireCycleInspectionExtintor.cs, FireCycleInspectionHidrante.cs, FireInspectionCycle.cs, FireInspectionPeriod.cs, FireInspectionPeriodDetector.cs, FireInspectionPeriodEstacion.cs, FireInspectionPeriodExtintor.cs, FireInspectionPeriodHidrante.cs, FireInspectionPeriodItemBase.cs

**DTOs:** FireCycleInspectionDetectorAddOrEditDTO.cs, FireCycleInspectionEstacionAddOrEditDTO.cs, FireCycleInspectionExtintorAddOrEditDTO.cs, FireCycleInspectionHidranteAddOrEditDTO.cs, FireCycleInspectionItemSummaryDTO.cs, FireInspectionCycleDetailDTO.cs, FireInspectionCycleDTO.cs, FireInspectionPeriodAddOrEditDTO.cs, FireInspectionPeriodDTO.cs

**Services:** FireCycleInspectionAppService.cs, FireInspectionCycleAppService.cs, FireInspectionPeriodAppService.cs, FireInspectionPeriodItemsAppService.cs

**EndPoints:** FireCycleInspectionEndPoints.cs, FireInspectionCycleEndPoints.cs, FireInspectionPeriodEndPoints.cs, FireInspectionPeriodItemsEndPoints.cs

**Other:** FireCycleInspectionDetectorAddOrEditDTO.cs, FireCycleInspectionEstacionAddOrEditDTO.cs, FireCycleInspectionExtintorAddOrEditDTO.cs, FireCycleInspectionHidranteAddOrEditDTO.cs, FireCycleInspectionItemSummaryDTO.cs, FireInspectionCycleDetailDTO.cs, FireInspectionCycleDTO.cs, FireInspectionPeriodAddOrEditDTO.cs, FireInspectionPeriodDTO.cs, FireCycleInspectionEndPoints.cs, FireInspectionCycleEndPoints.cs, FireInspectionPeriodEndPoints.cs, FireInspectionPeriodItemsEndPoints.cs, FireCycleInspectionBase.cs, FireCycleInspectionDetector.cs, FireCycleInspectionEstacion.cs, FireCycleInspectionExtintor.cs, FireCycleInspectionHidrante.cs, FireInspectionCycle.cs, FireInspectionPeriod.cs, FireInspectionPeriodDetector.cs, FireInspectionPeriodEstacion.cs, FireInspectionPeriodExtintor.cs, FireInspectionPeriodHidrante.cs, FireInspectionPeriodItemBase.cs, IFireCycleInspectionAppService.cs, IFireInspectionCycleAppService.cs, IFireInspectionPeriodAppService.cs, IFireInspectionPeriodItemsAppService.cs, FireCycleInspectionAppService.cs, FireInspectionCycleAppService.cs, FireInspectionPeriodAppService.cs, FireInspectionPeriodItemsAppService.cs

### MantenimientoLuxuryApp/HydrantInventory

**DTOs:** InventarioHidranteAddOrEditDTO.cs, InventarioHidranteDTO.cs

**Services:** InventarioHidranteAppService.cs

**EndPoints:** InventarioHidranteEndpoints.cs

**Other:** InventarioHidranteAddOrEditDTO.cs, InventarioHidranteDTO.cs, InventarioHidranteEndpoints.cs, IInventarioHidranteAppService.cs, InventarioHidranteMapper.cs, InventarioHidranteAppService.cs

### MantenimientoLuxuryApp/HydrantLog

**Entities:** BitacoraHidrante.cs

**DTOs:** BitacoraHidranteAddOrEditDTO.cs, BitacoraHidranteDTO.cs

**Services:** BitacoraHidranteAppService.cs

**EndPoints:** BitacoraHidranteEndPoints.cs

**Other:** BitacoraHidranteAddOrEditDTO.cs, BitacoraHidranteDTO.cs, BitacoraHidranteEndPoints.cs, BitacoraHidrante.cs, IBitacoraHidranteAppService.cs, BitacoraHidranteAppService.cs

### MantenimientoLuxuryApp/Machinery

**Entities:** Equipment.cs, EquipoClasificacion.cs

**DTOs:** ControlPrestamoHerramientaAddOrEditDTO.cs, ControlPrestamoHerramientaDTO.cs, ControlPrestamoHerramientaListDTO.cs, ControlPrestamoHerramientaPagedListDTO.cs, EquipoClasificacionAddOrEditDTO.cs, EquipoClasificacionDTO.cs, MachineryAddOrEditDTO.cs, MachineryDTO.cs

**Services:** ControlPrestamoHerramientaAppService.cs, EquipoClasificacionAppService.cs, MachineryAppService.cs

**EndPoints:** EquipoClasificacionEndPoints.cs, MachineriesEndpoints.cs

**Other:** ControlPrestamoHerramientaAddOrEditDTO.cs, ControlPrestamoHerramientaDTO.cs, ControlPrestamoHerramientaListDTO.cs, ControlPrestamoHerramientaPagedListDTO.cs, EquipoClasificacionAddOrEditDTO.cs, EquipoClasificacionDTO.cs, MachineryAddOrEditDTO.cs, MachineryDTO.cs, EquipoClasificacionEndPoints.cs, MachineriesEndpoints.cs, Equipment.cs, EquipoClasificacion.cs, IControlPrestamoHerramientaAppService.cs, IEquipoClasificacionAppService.cs, IMachineryAppService.cs, ControlPrestamoHerramientaMapper.cs, EquipoClasificacionMapper.cs, MachineryMapper.cs, ControlPrestamoHerramientaAppService.cs, EquipoClasificacionAppService.cs, MachineryAppService.cs

### MantenimientoLuxuryApp/MachineryAsset

**Entities:** CatalogAsset.cs

**DTOs:** MachineryDetailDTO.cs, MachineryFichaTecnicaDTO.cs

**Services:** MachineryAssetAppService.cs

**EndPoints:** MachineryAssetEndPoints.cs

**Other:** MachineryDetailDTO.cs, MachineryFichaTecnicaDTO.cs, MachineryAssetEndPoints.cs, CatalogAsset.cs, IMachineryAssetAppService.cs, MachineryAssetAppService.cs

### MantenimientoLuxuryApp/MachineryDocument

**Entities:** EquipmentDocuments.cs

**DTOs:** MachineryDocumentDTO.cs

**Services:** MachineryDocumentAppService.cs

**EndPoints:** MachineryDocumentEndPoints.cs

**Other:** MachineryDocumentDTO.cs, MachineryDocumentEndPoints.cs, EquipmentDocuments.cs, IMachineryDocumentAppService.cs, MachineryDocumentAppService.cs

### MantenimientoLuxuryApp/MaintenanceCalendars

**Entities:** MaintenanceCalendar.cs

**DTOs:** CalendarioMantenimientoDTO.cs, CalendarioMantenimientoItemsDTO.cs, CronogramaAnualPdfStatusDTO.cs, CronogramaAnualPdfStatusItemDTO.cs, MaintenanceCalendarAddOrEditDTO.cs, MaintenanceCalendarDTO.cs, MaintenanceCalendarIndexDTO.cs, MaintenanceCalendarListDTO.cs, ResumenGastosDTO.cs

**Services:** MaintenanceCalendarAppService.cs

**EndPoints:** MaintenanceCalendarsEndpoints.cs

**Other:** CalendarioMantenimientoDTO.cs, CalendarioMantenimientoItemsDTO.cs, CronogramaAnualPdfStatusDTO.cs, CronogramaAnualPdfStatusItemDTO.cs, MaintenanceCalendarAddOrEditDTO.cs, MaintenanceCalendarDTO.cs, MaintenanceCalendarIndexDTO.cs, MaintenanceCalendarListDTO.cs, ResumenGastosDTO.cs, MaintenanceCalendarsEndpoints.cs, MaintenanceCalendar.cs, IMaintenanceCalendarAppService.cs, MaintenanceCalendarMapper.cs, MaintenanceCalendarAppService.cs

### MantenimientoLuxuryApp/MaintenanceLog

**Entities:** BitacoraEquipoBase.cs, BitacoraMantenimiento.cs

**DTOs:** BitacoraMantenimientoAddOrEditDTO.cs, BitacoraMantenimientoDashboardDTO.cs, BitacoraMantenimientoDTO.cs

**Services:** BitacoraMantenimientoAppService.cs

**EndPoints:** BitacoraMantenimientoEndpoints.cs

**Other:** BitacoraMantenimientoAddOrEditDTO.cs, BitacoraMantenimientoDashboardDTO.cs, BitacoraMantenimientoDTO.cs, BitacoraMantenimientoEndpoints.cs, BitacoraEquipoBase.cs, BitacoraMantenimiento.cs, IBitacoraMantenimientoAppService.cs, BitacoraMantenimientoMapper.cs, BitacoraMantenimientoAppService.cs

### MantenimientoLuxuryApp/ManualCallPointInventory

**DTOs:** InventarioEstacionManualAddOrEditDTO.cs, InventarioEstacionManualDTO.cs

**Services:** InventarioEstacionManualAppService.cs

**EndPoints:** InventarioEstacionManualEndpoints.cs

**Other:** InventarioEstacionManualAddOrEditDTO.cs, InventarioEstacionManualDTO.cs, InventarioEstacionManualEndpoints.cs, IInventarioEstacionManualAppService.cs, InventarioEstacionManualMapper.cs, InventarioEstacionManualAppService.cs

### MantenimientoLuxuryApp/ManualCallPointLog

**Entities:** BitacoraEstacionManual.cs

**DTOs:** BitacoraEstacionManualAddOrEditDTO.cs, BitacoraEstacionManualDTO.cs

**Services:** BitacoraEstacionManualAppService.cs

**EndPoints:** BitacoraEstacionManualEndPoints.cs

**Other:** BitacoraEstacionManualAddOrEditDTO.cs, BitacoraEstacionManualDTO.cs, BitacoraEstacionManualEndPoints.cs, BitacoraEstacionManual.cs, IBitacoraEstacionManualAppService.cs, BitacoraEstacionManualAppService.cs

### MantenimientoLuxuryApp/Medidores

**Entities:** Medidor.cs, MedidorLectura.cs

**DTOs:** MedidorAddOrEditDTO.cs, MedidorCategoriaAddOrEditDTO.cs, MedidorCategoriaDTO.cs, MedidorDTO.cs, MedidorLecturaAddOrEditDTO.cs, MedidorLecturaCharDTO.cs, MedidorLecturaCharMonthDTO.cs, MedidorLecturaDTO.cs, MedidorLecturaExcelDTO.cs

**Services:** MedidorAppService.cs, MedidorCategoriaAppService.cs, MedidorLecturaAppService.cs

**EndPoints:** MedidorCategoriaEndPoints.cs, MedidorEndpoints.cs, MedidorLecturaEndpoints.cs

**Other:** MedidorAddOrEditDTO.cs, MedidorCategoriaAddOrEditDTO.cs, MedidorCategoriaDTO.cs, MedidorDTO.cs, MedidorLecturaAddOrEditDTO.cs, MedidorLecturaCharDTO.cs, MedidorLecturaCharMonthDTO.cs, MedidorLecturaDTO.cs, MedidorLecturaExcelDTO.cs, MedidorCategoriaEndPoints.cs, MedidorEndpoints.cs, MedidorLecturaEndpoints.cs, Medidor.cs, MedidorLectura.cs, IMedidorAppService.cs, IMedidorCategoriaAppService.cs, IMedidorLecturaAppService.cs, MedidorLecturaMapper.cs, MedidorMapper.cs, MedidorAppService.cs, MedidorCategoriaAppService.cs, MedidorLecturaAppService.cs

### MantenimientoLuxuryApp/Persistence

**Other:** EquipmentInspectionsConfiguration.cs

### MantenimientoLuxuryApp/Piscina

**Entities:** Piscina.cs

**DTOs:** PiscinaAddOrEditDTO.cs, PiscinaDTO.cs

**Services:** PiscinaAppService.cs

**EndPoints:** PiscinaEndpoints.cs

**Other:** PiscinaAddOrEditDTO.cs, PiscinaDTO.cs, PiscinaEndpoints.cs, Piscina.cs, IPiscinaAppService.cs, PiscinaMapper.cs, PiscinaAppService.cs

### MantenimientoLuxuryApp/PiscinaBitacora

**Entities:** PiscinaBitacora.cs

**DTOs:** PiscinaBitacoraAddOrEditDTO.cs, PiscinaBitacoraDTO.cs, PiscinaBitacoraExcelDTO.cs, PiscinaBitacoraExcelRowDTO.cs, PiscinaBitacoraImportRequest.cs, PiscinaBitacoraImportResultDTO.cs

**Services:** PiscinaBitacoraAppService.cs

**EndPoints:** PiscinaBitacoraEndpoints.cs

**Other:** PiscinaBitacoraAddOrEditDTO.cs, PiscinaBitacoraDTO.cs, PiscinaBitacoraExcelDTO.cs, PiscinaBitacoraExcelRowDTO.cs, PiscinaBitacoraImportRequest.cs, PiscinaBitacoraImportResultDTO.cs, PiscinaBitacoraEndpoints.cs, PiscinaBitacora.cs, IPiscinaBitacoraAppService.cs, PiscinaBitacoraMapper.cs, PiscinaBitacoraAppService.cs

### MantenimientoLuxuryApp/RecepcionPipasAgua

**Entities:** RecepcionPipaAgua.cs

**DTOs:** RecepcionPipaAguaAddDTO.cs, RecepcionPipaAguaDTO.cs, RecepcionPipaAguaUpdateDTO.cs

**Services:** RecepcionPipasAguaAppService.cs

**EndPoints:** RecepcionPipasAguaEndpoints.cs

**Other:** RecepcionPipaAguaAddDTO.cs, RecepcionPipaAguaDTO.cs, RecepcionPipaAguaUpdateDTO.cs, RecepcionPipasAguaEndpoints.cs, RecepcionPipaAgua.cs, IRecepcionPipasAguaAppService.cs, RecepcionPipasAguaAppService.cs

### MantenimientoLuxuryApp/SmokeDetectorInventory

**DTOs:** InventarioDetectorHumoAddOrEditDTO.cs, InventarioDetectorHumoDTO.cs

**Services:** InventarioDetectorHumoAppService.cs

**EndPoints:** InventarioDetectorHumoEndpoints.cs

**Other:** InventarioDetectorHumoAddOrEditDTO.cs, InventarioDetectorHumoDTO.cs, InventarioDetectorHumoEndpoints.cs, IInventarioDetectorHumoAppService.cs, InventarioDetectorHumoMapper.cs, InventarioDetectorHumoAppService.cs

### MantenimientoLuxuryApp/SmokeDetectorLog

**Entities:** BitacoraDetectorHumo.cs

**DTOs:** BitacoraDetectorHumoAddOrEditDTO.cs, BitacoraDetectorHumoDTO.cs

**Services:** BitacoraDetectorHumoAppService.cs

**EndPoints:** BitacoraDetectorHumoEndPoints.cs

**Other:** BitacoraDetectorHumoAddOrEditDTO.cs, BitacoraDetectorHumoDTO.cs, BitacoraDetectorHumoEndPoints.cs, BitacoraDetectorHumo.cs, IBitacoraDetectorHumoAppService.cs, BitacoraDetectorHumoAppService.cs

### MantenimientoLuxuryApp/ToolLoan

**Entities:** ControlPrestamoHerramienta.cs

**EndPoints:** ControlPrestamoHerramientasEndPoints.cs

**Other:** ControlPrestamoHerramientasEndPoints.cs, ControlPrestamoHerramienta.cs

### OperationsLuxuryApp/AccessControl

**Entities:** AccessCredential.cs, AccessEvent.cs, AccessPoint.cs, GuardShift.cs, Invitation.cs, Visit.cs, Visitor.cs

**DTOs:** AccessCredentialDTO.cs, AccessEventDTO.cs, AccessPointDTO.cs, AccessScanResultDTO.cs, CancelVisitRequestDTO.cs, CreateAccessPointRequestDTO.cs, CreateVisitorRequestDTO.cs, CreateVisitRequestDTO.cs, DashboardStatsDTO.cs, GenerateQrCredentialRequestDTO.cs, InvitationDTO.cs, OccupancyDTO.cs, RevokeAccessCredentialRequestDTO.cs, ScanAccessCredentialRequestDTO.cs, SendInvitationRequestDTO.cs, UpdateAccessPointRequestDTO.cs, UpdateVisitorRequestDTO.cs, VisitDTO.cs, VisitorDTO.cs

**Services:** AccessCredentialSecurity.cs, AccessCredentialService.cs, AccessDashboardService.cs, AccessEventService.cs, AccessPointService.cs, AccessScanService.cs, InvitationAppService.cs, VisitAppService.cs, VisitorService.cs

**EndPoints:** AccessCredentialsEndpoints.cs, AccessOperationsEndpoints.cs, AccessPointsEndpoints.cs, InvitationsEndpoints.cs, VisitorsEndpoints.cs, VisitsEndpoints.cs

**Other:** AccessCredentialDTO.cs, AccessEventDTO.cs, AccessPointDTO.cs, AccessScanResultDTO.cs, CancelVisitRequestDTO.cs, CreateAccessPointRequestDTO.cs, CreateVisitorRequestDTO.cs, CreateVisitRequestDTO.cs, DashboardStatsDTO.cs, GenerateQrCredentialRequestDTO.cs, InvitationDTO.cs, OccupancyDTO.cs, RevokeAccessCredentialRequestDTO.cs, ScanAccessCredentialRequestDTO.cs, SendInvitationRequestDTO.cs, UpdateAccessPointRequestDTO.cs, UpdateVisitorRequestDTO.cs, VisitDTO.cs, VisitorDTO.cs, AccessCredentialsEndpoints.cs, AccessOperationsEndpoints.cs, AccessPointsEndpoints.cs, InvitationsEndpoints.cs, VisitorsEndpoints.cs, VisitsEndpoints.cs, AccessCredential.cs, AccessEvent.cs, AccessPoint.cs, GuardShift.cs, Invitation.cs, Visit.cs, Visitor.cs, IAccessCredentialSecurity.cs, IAccessCredentialService.cs, IAccessDashboardService.cs, IAccessEventService.cs, IAccessPointService.cs, IAccessScanService.cs, IInvitationAppService.cs, IVisitAppService.cs, IVisitorService.cs, AccessControlMapper.cs, AccessCredentialSecurity.cs, AccessCredentialService.cs, AccessDashboardService.cs, AccessEventService.cs, AccessPointService.cs, AccessScanService.cs, InvitationAppService.cs, VisitAppService.cs, VisitorService.cs

### OperationsLuxuryApp/Announcement

**Entities:** Announcement.cs, AnnouncementAnalytics.cs, AnnouncementAttachments.cs, AnnouncementCustomers.cs, AnnouncementRoles.cs

**DTOs:** AnnouncementAddOrEditDTO.cs, AnnouncementAdminListDTO.cs, AnnouncementAnalyticsDTO.cs, AnnouncementAttachmentDTO.cs, AnnouncementDTO.cs, AnnouncementListDTO.cs, GenerateDraftDTO.cs, GenerateOfficialDraftDTO.cs, OfficialAnnouncementDraftDTO.cs

**Services:** AnnouncementAppService.cs, AnnouncementNotificationService.cs

**EndPoints:** AnnouncementsEndpoints.cs

**Other:** AnnouncementAddOrEditDTO.cs, AnnouncementAdminListDTO.cs, AnnouncementAnalyticsDTO.cs, AnnouncementAttachmentDTO.cs, AnnouncementDTO.cs, AnnouncementListDTO.cs, GenerateDraftDTO.cs, GenerateOfficialDraftDTO.cs, OfficialAnnouncementDraftDTO.cs, AnnouncementsEndpoints.cs, Announcement.cs, AnnouncementAnalytics.cs, AnnouncementAttachments.cs, AnnouncementCustomers.cs, AnnouncementRoles.cs, IAnnouncementAppService.cs, IAnnouncementNotificationService.cs, AnnouncementMapper.cs, AnnouncementAppService.cs, AnnouncementNotificationService.cs

### OperationsLuxuryApp/BuildingCustomer

**Services:** BuildingCustomerAppService.cs

**Other:** BuildingCustomerAppService.cs

### OperationsLuxuryApp/Comite

**Other:** IComiteVigilanciaAppService.cs, ComiteVigilanciaMapper.cs

### OperationsLuxuryApp/CustomDocument

**Entities:** CustomDocument.cs, CustomDocumentRole.cs

**DTOs:** BuildingDocumentsRecipentsAddOrEditDTO.cs, DocumentLegalRecordAddOrEditDTO.cs, DocumentLegalRecordCreatedDTO.cs, DocumentLegalRecordRecipentsAddOrEditDTO.cs

**Services:** CustomDocumentAppService.cs

**EndPoints:** CustomDocumentsEndpoints.cs

**Other:** BuildingDocumentsRecipentsAddOrEditDTO.cs, DocumentLegalRecordAddOrEditDTO.cs, DocumentLegalRecordCreatedDTO.cs, DocumentLegalRecordRecipentsAddOrEditDTO.cs, CustomDocumentsEndpoints.cs, CustomDocument.cs, CustomDocumentRole.cs, ICustomDocumentAppService.cs, CustomDocumentAppService.cs

### OperationsLuxuryApp/Dashboard

**DTOs:** DashboardAnalysisDTO.cs

**Services:** DashboardAppService.cs

**EndPoints:** DashboardEndpoints.cs

**Other:** DashboardAnalysisDTO.cs, DashboardEndpoints.cs, IDashboardAppService.cs, DashboardAppService.cs

### OperationsLuxuryApp/DeliveryReception

**Entities:** CatalogoEntregaRecepcionDescripcion.cs, EntregaRecepcionCliente.cs, EntregaRecepcionDescripcion.cs

**DTOs:** CatalogoEntregaRecepcionDescripcionAddOrEditDTO.cs, CatalogoEntregaRecepcionDescripcionDTO.cs, EntregaRecepcionDescripcionAddOrEditDTO.cs

**Services:** CatalogoEntregaRecepcionDescripcionAppService.cs, EntregaRecepcionAppService.cs, EntregaRecepcionClienteAppService.cs, EntregaRecepcionDescripcionAppService.cs

**EndPoints:** CatalogoEntregaRecepcionDescripcionEndpoints.cs, EntregaRecepcionClienteEndpoints.cs, EntregaRecepcionDescripcionEndpoints.cs, EntregaRecepcionEndpoints.cs

**Other:** CatalogoEntregaRecepcionDescripcionAddOrEditDTO.cs, CatalogoEntregaRecepcionDescripcionDTO.cs, EntregaRecepcionDescripcionAddOrEditDTO.cs, CatalogoEntregaRecepcionDescripcionEndpoints.cs, EntregaRecepcionClienteEndpoints.cs, EntregaRecepcionDescripcionEndpoints.cs, EntregaRecepcionEndpoints.cs, CatalogoEntregaRecepcionDescripcion.cs, EntregaRecepcionCliente.cs, EntregaRecepcionDescripcion.cs, ICatalogoEntregaRecepcionDescripcionAppService.cs, IEntregaRecepcionAppService.cs, IEntregaRecepcionClienteAppService.cs, IEntregaRecepcionDescripcionAppService.cs, CatalogoEntregaRecepcionDescripcionMapper.cs, CatalogoEntregaRecepcionDescripcionAppService.cs, EntregaRecepcionAppService.cs, EntregaRecepcionClienteAppService.cs, EntregaRecepcionDescripcionAppService.cs

### OperationsLuxuryApp/Diagram

**Entities:** DiagramDraw.cs, DiagramDrawTargetCustomer.cs, DiagramDrawTargetRole.cs

**DTOs:** CreateDiagramDrawDTO.cs, DiagramDrawDTO.cs, UpdateDiagramDrawDTO.cs

**Services:** DiagramDrawService.cs

**EndPoints:** DiagramDrawEndpoints.cs

**Other:** CreateDiagramDrawDTO.cs, DiagramDrawDTO.cs, UpdateDiagramDrawDTO.cs, DiagramDrawEndpoints.cs, DiagramDraw.cs, DiagramDrawTargetCustomer.cs, DiagramDrawTargetRole.cs, IDiagramDrawService.cs, DiagramDrawMapping.cs, DiagramDrawService.cs

### OperationsLuxuryApp/DireccionDashboard

**Other:** IAgendaSemanalAppService.cs, IContratosLegalAppService.cs, IPersonalAusenteAppService.cs, IReclutamientoResumenAppService.cs, ITareasLegalAppService.cs

### OperationsLuxuryApp/GoogleCalendar

**Entities:** GoogleCalendarEvent.cs, GoogleCalendarGuest.cs

**DTOs:** GoogleCalendarAssemblyChecklistExecutionDTO.cs, GoogleCalendarAssemblyInviteeDTO.cs, GoogleCalendarAssemblyPlanDTO.cs, GoogleCalendarAssemblySupportRequestDTO.cs, GoogleCalendarConnectionStatusDTO.cs, GoogleCalendarEventAddOrEditDTO.cs, GoogleCalendarEventDetailDTO.cs, GoogleCalendarEventListItemDTO.cs, GoogleCalendarEventRealTimeUpdateDTO.cs, GoogleCalendarEventSyncRequestDTO.cs, GoogleCalendarGuestDTO.cs, GoogleCalendarGuestSyncDTO.cs, GoogleCalendarSyncResultDTO.cs

**Services:** GoogleCalendarEventAppService.cs, GoogleCalendarService.cs

**EndPoints:** GoogleCalendarEventsEndpoints.cs

**Other:** GoogleCalendarAssemblyChecklistExecutionDTO.cs, GoogleCalendarAssemblyInviteeDTO.cs, GoogleCalendarAssemblyPlanDTO.cs, GoogleCalendarAssemblySupportRequestDTO.cs, GoogleCalendarConnectionStatusDTO.cs, GoogleCalendarEventAddOrEditDTO.cs, GoogleCalendarEventDetailDTO.cs, GoogleCalendarEventListItemDTO.cs, GoogleCalendarEventRealTimeUpdateDTO.cs, GoogleCalendarEventSyncRequestDTO.cs, GoogleCalendarGuestDTO.cs, GoogleCalendarGuestSyncDTO.cs, GoogleCalendarSyncResultDTO.cs, GoogleCalendarEventsEndpoints.cs, GoogleCalendarEvent.cs, GoogleCalendarGuest.cs, GoogleCalendarEventOccurrenceData.cs, IGoogleCalendarEventAppService.cs, IGoogleCalendarService.cs, GoogleCalendarEventAppService.cs, GoogleCalendarService.cs

### OperationsLuxuryApp/IncidenciasAdministrativas

**Entities:** Incident.cs, IncidentAttachment.cs, IncidentType.cs, IncidentWitness.cs, Sanction.cs, SanctionType.cs, SuspensionDay.cs

**Other:** Incident.cs, IncidentAttachment.cs, IncidentType.cs, IncidentWitness.cs, Sanction.cs, SanctionType.cs, SuspensionDay.cs, IIncidentAppService.cs, IIncidentAttachmentAppService.cs, IIncidentPdfService.cs, IIncidentWitnessAppService.cs, ISuspensionDayAppService.cs, IncidentMappingProfile.cs, IIncidentNotificationService.cs, IncidentNotificationService.cs, IIncidentReportAppService.cs, HRIncidentReportMappingProfile.cs, ISanctionAppService.cs, SanctionMappingProfile.cs, ISanctionNotificationService.cs, SanctionNotificationService.cs, IIncidentTypeAppService.cs, IncidentTypeMappingProfile.cs, ISanctionTypeAppService.cs, SanctionTypeMappingProfile.cs

### OperationsLuxuryApp/Inspections

**Entities:** CustomerInspection.cs, Inspection.cs, InspectionCondominiumAsset.cs, InspectionResult.cs, InspectionResultImage.cs, InspectionReviews.cs, InspectionReviewsCatalog.cs, InspectionWeeklyDay.cs, ReportDefinition.cs, ReportSubmissionRecord.cs

**DTOs:** CatalogInspectionAddOrEditDTO.cs, CatalogInspectionDTO.cs, CustomerInspectionDTO.cs, CustomerInspectionReportDTO.cs, GroupedInspectionDataDTO.cs, InspectionAddOrEditDTO.cs, InspectionCondominiumAssetAddOrEditDTO.cs, InspectionCondominiumAssetDTO.cs, InspectionDTO.cs, InspectionEditDTO.cs, InspectionImageDTO.cs, InspectionImageListDTO.cs, InspectionItemUpdateDTO.cs, InspectionListItemDTO.cs, InspectionResultItemDTO.cs, InspectionSummaryDTO.cs, ReportImageDTO.cs, ReportResultItemDTO.cs

**Services:** CatalogInspectionAppService.cs, CustomerInspectionAppService.cs, InspectionAppService.cs, InspectionCondominiumAssetAppService.cs, InspectionResultImageAppService.cs, InspectionReviewsCatalogAppService.cs

**EndPoints:** InspectionCondominiumAssetEndpoints.cs, InspectionEndpoints.cs, InspectionResultEndpoints.cs, InspectionResultImagesEndpoints.cs, InspectionReviewsCatalogEndpoints.cs

**Other:** CatalogInspectionAddOrEditDTO.cs, CatalogInspectionDTO.cs, CustomerInspectionDTO.cs, CustomerInspectionReportDTO.cs, GroupedInspectionDataDTO.cs, InspectionAddOrEditDTO.cs, InspectionCondominiumAssetAddOrEditDTO.cs, InspectionCondominiumAssetDTO.cs, InspectionDTO.cs, InspectionEditDTO.cs, InspectionImageDTO.cs, InspectionImageListDTO.cs, InspectionItemUpdateDTO.cs, InspectionListItemDTO.cs, InspectionResultItemDTO.cs, InspectionSummaryDTO.cs, ReportImageDTO.cs, ReportResultItemDTO.cs, InspectionCondominiumAssetEndpoints.cs, InspectionEndpoints.cs, InspectionResultEndpoints.cs, InspectionResultImagesEndpoints.cs, InspectionReviewsCatalogEndpoints.cs, CustomerInspection.cs, Inspection.cs, InspectionCondominiumAsset.cs, InspectionResult.cs, InspectionResultImage.cs, InspectionReviews.cs, InspectionReviewsCatalog.cs, InspectionWeeklyDay.cs, ReportDefinition.cs, ReportSubmissionRecord.cs, ICatalogInspectionAppService.cs, ICustomerInspectionAppService.cs, IInspectionAppService.cs, IInspectionCondominiumAssetAppService.cs, IInspectionResultImageAppService.cs, IInspectionReviewsCatalogAppService.cs, CatalogInspectionAppService.cs, CustomerInspectionAppService.cs, InspectionAppService.cs, InspectionCondominiumAssetAppService.cs, InspectionResultImageAppService.cs, InspectionReviewsCatalogAppService.cs

### OperationsLuxuryApp/Inventory

**Entities:** Almacen.cs, AlmacenUsuarioResponsable.cs, Category.cs, EntradaProducto.cs, EquipoContraIncendioBase.cs, InventarioDetectorHumo.cs, InventarioEstacionManual.cs, InventarioExtintor.cs, InventarioHidrante.cs, InventarioIluminacion.cs, InventarioLlave.cs, InventarioPintura.cs, Producto.cs, RadioComunicacion.cs, SalidaProducto.cs, StockPorAlmacen.cs, Tool.cs, UnidadMedida.cs

**DTOs:** AlmacenAddOrEditDTO.cs, AlmacenDTO.cs, AsignarResponsablesDTO.cs, DevolucionProductoDTO.cs, EntradaProductoAddOrEditDTO.cs, EntradaProductoDTO.cs, ListProductoToOrderDTO.cs, ListProductoToOrderPagedListDTO.cs, ProductoAddOrEditDTO.cs, ProductoDTO.cs, ProductoIndexDTO.cs, ProductoListAddDTO.cs, SalidaProductoAddOrEditDTO.cs, SalidaProductoDTO.cs, StockPorAlmacenAddOrEditDTO.cs, StockPorAlmacenDTO.cs, StockPorAlmacenIndexDTO.cs

**Services:** AlmacenAppService.cs, EntradaProductoAppService.cs, ProductAppService.cs, SalidaProductoAppService.cs, StockPorAlmacenAppService.cs, WarehouseAuthorizationService.cs

**EndPoints:** AlmacenEndpoints.cs, EntradaProductoEndpoints.cs, InventarioProductoEndpoints.cs, ProductosEndpoints.cs, SalidasProductosEndpoints.cs

**Other:** AlmacenAddOrEditDTO.cs, AlmacenDTO.cs, AsignarResponsablesDTO.cs, DevolucionProductoDTO.cs, EntradaProductoAddOrEditDTO.cs, EntradaProductoDTO.cs, ListProductoToOrderDTO.cs, ListProductoToOrderPagedListDTO.cs, ProductoAddOrEditDTO.cs, ProductoDTO.cs, ProductoIndexDTO.cs, ProductoListAddDTO.cs, SalidaProductoAddOrEditDTO.cs, SalidaProductoDTO.cs, StockPorAlmacenAddOrEditDTO.cs, StockPorAlmacenDTO.cs, StockPorAlmacenIndexDTO.cs, AlmacenEndpoints.cs, EntradaProductoEndpoints.cs, InventarioProductoEndpoints.cs, ProductosEndpoints.cs, SalidasProductosEndpoints.cs, Almacen.cs, AlmacenUsuarioResponsable.cs, Category.cs, EntradaProducto.cs, EquipoContraIncendioBase.cs, InventarioDetectorHumo.cs, InventarioEstacionManual.cs, InventarioExtintor.cs, InventarioHidrante.cs, InventarioIluminacion.cs, InventarioLlave.cs, InventarioPintura.cs, Producto.cs, RadioComunicacion.cs, SalidaProducto.cs, StockPorAlmacen.cs, Tool.cs, UnidadMedida.cs, IAlmacenAppService.cs, IEntradaProductoAppService.cs, IProductAppService.cs, ISalidaProductoAppService.cs, IStockPorAlmacenAppService.cs, IWarehouseAuthorizationService.cs, IInventarioLlaveAppService.cs, InventarioLlaveMapper.cs, IInventarioIluminacionAppService.cs, InventarioIluminacionMapper.cs, AlmacenMapper.cs, EntradaProductoMapper.cs, ProductoMapper.cs, SalidaProductoMapper.cs, StockPorAlmacenMapper.cs, IInventarioPinturaAppService.cs, InventarioPinturaMapper.cs, IRadioComunicacionAppService.cs, RadioComunicacionMapper.cs, AlmacenAppService.cs, EntradaProductoAppService.cs, ProductAppService.cs, SalidaProductoAppService.cs, StockPorAlmacenAppService.cs, WarehouseAuthorizationService.cs

### OperationsLuxuryApp/JuntasMensuales

**Other:** IJuntaMensualSessionBackfillAppService.cs, IMeetingAdministracionAppService.cs, IMeetingAppService.cs, IMeetingComiteAppService.cs, IMeetingDetailsAppService.cs, IMeetingDetailsSeguimientoAppService.cs, IMeetingInvitadoAppService.cs, MeetingMapper.cs, MeetingReportEmailViewModel.cs, IJuntaMensualNotificationOrchestrator.cs, IPresentacionJuntaComiteAppService.cs, PresentacionJuntaComiteMapper.cs, CommitteePresentationEmailViewModel.cs, FinancialStatementsEmailViewModel.cs, IJuntaMensualSessionAppService.cs, IJuntaMensualSessionMaintenanceAppService.cs

### OperationsLuxuryApp/MiEdificio

**DTOs:** CaratulaDTO.cs, PersonalGroupDTO.cs, UpdateSortOrderDTO.cs

**EndPoints:** MiEdificioEndpoints.cs

**Other:** CaratulaDTO.cs, PersonalGroupDTO.cs, UpdateSortOrderDTO.cs, MiEdificioEndpoints.cs

### OperationsLuxuryApp/Owner

**DTOs:** OwnerAddOrEditDTO.cs, OwnerDTO.cs

**Services:** OwnerAppService.cs

**EndPoints:** OwnersEndpoints.cs

**Other:** OwnerAddOrEditDTO.cs, OwnerDTO.cs, OwnersEndpoints.cs, IOwnerAppService.cs, OwnerMapper.cs, OwnerAppService.cs

### OperationsLuxuryApp/PanicAlert

**Entities:** PanicAlert.cs

**DTOs:** PanicAlertCreateDTO.cs, PanicAlertDTO.cs, PanicAlertRealTimeDTO.cs, PanicAlertResolveDTO.cs

**Services:** PanicAlertAppService.cs, PanicAlertNotificationService.cs

**EndPoints:** PanicAlertsEndpoints.cs

**Other:** PanicAlertCreateDTO.cs, PanicAlertDTO.cs, PanicAlertRealTimeDTO.cs, PanicAlertResolveDTO.cs, PanicAlertsEndpoints.cs, PanicAlert.cs, IPanicAlertAppService.cs, IPanicAlertNotificationService.cs, PanicAlertAppService.cs, PanicAlertNotificationService.cs

### OperationsLuxuryApp/Persistence

**Other:** AccessCredentialConfiguration.cs, AccessEventConfiguration.cs, AccessPointConfiguration.cs, GuardShiftConfiguration.cs, InvitationConfiguration.cs, VisitConfiguration.cs, VisitorConfiguration.cs, ManualDiagramConfiguration.cs, ManualPasoConfiguration.cs, ManualPasoImagenConfiguration.cs, ManualPasoResponsableConfiguration.cs, AsambleaConfigurations.cs, JuntaMensualSessionConfigurations.cs, CotizacionProveedorConfiguration.cs, GoogleCalendarConfigurations.cs, PanicAlertConfiguration.cs, RecepcionPipaAguaConfiguration.cs, SolicitudCompraConfiguration.cs, TaskOperationalConfigurations.cs, TasksConfiguration.cs, UserAndLogisticsConfigurations.cs

### OperationsLuxuryApp/Property

**Entities:** Property.cs, PropertyMember.cs

**DTOs:** PropertyAddOrEditDTO.cs, PropertyAssignAccountDTO.cs, PropertyDTO.cs, PropertyOccupantDTO.cs

**Services:** PropertyAppService.cs

**EndPoints:** PropertiesEndpoints.cs

**Other:** PropertyAddOrEditDTO.cs, PropertyAssignAccountDTO.cs, PropertyDTO.cs, PropertyOccupantDTO.cs, PropertiesEndpoints.cs, Property.cs, PropertyMember.cs, IPropertyAppService.cs, PropertyMapper.cs, PropertyAppService.cs

### OperationsLuxuryApp/PropertyOccupant

**Entities:** PropertyOccupant.cs

**DTOs:** CreatePropertyOccupantDTO.cs, UpdatePropertyOccupantDTO.cs

**Services:** PropertyOccupantAppService.cs

**EndPoints:** PropertyOccupantEndpoints.cs

**Other:** CreatePropertyOccupantDTO.cs, UpdatePropertyOccupantDTO.cs, PropertyOccupantEndpoints.cs, PropertyOccupant.cs, IPropertyOccupantAppService.cs, PropertyOccupantAppService.cs

### OperationsLuxuryApp/Recruitment

**EndPoints:** CandidateProcessEndPoint.cs, EmployeeOnboardingChecklistEndpoints.cs, JobDescriptionEndPoints.cs, OperationRecruitmentPerformanceEvaluationsEndPoints.cs, OperationRecruitmentSelectItemEndPoints.cs, RequestDismissalEndPoints.cs, RequestSalaryModificationEndPoints.cs, SolicitudesReclutamientoEndPoints.cs, WorkPositionEndPoints.cs

**Other:** CandidateProcessEndPoint.cs, EmployeeOnboardingChecklistEndpoints.cs, JobDescriptionEndPoints.cs, OperationRecruitmentPerformanceEvaluationsEndPoints.cs, OperationRecruitmentSelectItemEndPoints.cs, RequestDismissalEndPoints.cs, RequestSalaryModificationEndPoints.cs, SolicitudesReclutamientoEndPoints.cs, WorkPositionEndPoints.cs, IJobDescriptionAppService.cs, JobDescriptionMapper.cs, IWorkPositionAppService.cs, WorkPositionMapper.cs

### OperationsLuxuryApp/ResumenGeneral

**Services:** GeneralSummaryService.cs

**EndPoints:** ResumenGeneralEndpoints.cs

**Other:** ResumenGeneralEndpoints.cs, IGeneralSummaryService.cs, GeneralSummaryService.cs

### OperationsLuxuryApp/ScheduledTasks

**Services:** ScheduledTaskEmailGenerator.cs, ScheduledTaskService.cs

**Other:** IScheduledTaskEmailGenerator.cs, IScheduledTaskService.cs, ScheduledTaskMapping.cs, ScheduledTaskEmailGenerator.cs, ScheduledTaskService.cs, ContractsPoliciesExpirationEmailViewModel.cs, LegalPendingTaskEmailItemDTO.cs, LegalReportEmailViewModel.cs, LegalTicketReportToCustomerEmailViewModel.cs, RecruitmentTestEmailViewModel.cs, TaskNotificationEmailViewModel.cs, VacanciesReportEmailViewModel.cs

### OperationsLuxuryApp/ServiceOrder

**Entities:** ServiceOrder.cs, ServiceOrderDocument.cs, ServiceOrderImg.cs

**DTOs:** ServiceOrderAddOrEditDTO.cs, ServiceOrderDocumentDTO.cs, ServiceOrderDTO.cs, ServiceOrderImgDTO.cs, ServiceOrderInformeDTO.cs

**Services:** ServiceOrderAppService.cs

**EndPoints:** ServiceOrdersEndpoints.cs

**Other:** ServiceOrderAddOrEditDTO.cs, ServiceOrderDocumentDTO.cs, ServiceOrderDTO.cs, ServiceOrderImgDTO.cs, ServiceOrderInformeDTO.cs, ServiceOrdersEndpoints.cs, ServiceOrder.cs, ServiceOrderDocument.cs, ServiceOrderImg.cs, IServiceOrderAppService.cs, ServiceOrderMapper.cs, ServiceOrderAppService.cs

### OperationsLuxuryApp/Supervision

**Other:** IAgendaSupervisionAppService.cs, AgendaSupervisionMapper.cs, ISupervisionReportsAppService.cs

### OperationsLuxuryApp/Tasks

**Other:** ITaskAlertEngineService.cs, IRecurringTaskCatalogAppService.cs, RecurringTaskCatalogMapper.cs, IRecurringTaskComplianceAppService.cs, ITaskEscalationService.cs, IRecurringTaskGenerationService.cs, ITaskAttachmentAppService.cs, TaskAttachmentMapper.cs, ITaskChecklistAppService.cs, TaskChecklistMapper.cs, ITaskFollowUpAppService.cs, ITaskJustificationService.cs, TaskJustificationMapper.cs, ITaskLegalAppService.cs, TaskLegalMapper.cs, ITaskMessageReadAppService.cs, IPendingTaskReportAppService.cs, IGanttAppService.cs, ITaskAppService.cs, ITasksReportAppService.cs, TasksMapper.cs, ITaskWorkPlanAppService.cs, ITaskGroupAppService.cs, WorkGroupMapper.cs, ITaskGroupCategoryAppService.cs, WorkGroupCategoriesMapper.cs, ITaskGroupMemberAppService.cs

### OperationsLuxuryApp/WorkPosition

### ReclutamientoLuxuryApp/CandidateApplications

**Services:** CandidateAutomationService.cs

**Other:** ICandidateAutomationService.cs, CandidateAutomationService.cs

### ReclutamientoLuxuryApp/CandidateProcesses

**Entities:** CandidateProcess.cs

**DTOs:** CandidateApplicationCreateOrUpdateDto.cs, CandidateApplicationProcessHiringDto.cs, CandidateDecisionRequest.cs, CandidateHiringDocumentListItemDto.cs, CandidateHiringDocumentUploadDto.cs, CandidateHiringDocumentValidateDto.cs, CandidateInterviewerQueueDto.cs, CandidateInterviewerQueueItemDto.cs, CandidateInterviewResponseDto.cs, CandidateInterviewTimelineItem.cs, CandidateProcessCreateOrUpdateDto.cs, CandidateProcessDetailDto.cs, CandidateProcessKpisDto.cs, CandidateProcessListItemDto.cs, CandidateProcessVacancyDetailDto.cs, CandidateProcessWorkPositionDetailDto.cs, CandidateRecruitmentAgendaItemDto.cs, CandidateRecruitmentInterviewBoardDto.cs, CandidateRecruitmentInterviewBoardItemDto.cs, ChangeStageApplicationRequest.cs, ConfirmPresentationRequestDto.cs, FuenteKpiItem.cs, InterviewerActionRequest.cs, InterviewerApplicationViewDto.cs, ScheduleRecruitmentInterviewRequest.cs, VacancyTimelineEventDTO.cs

**Services:** CandidateProcessAppService.cs

**EndPoints:** CandidateProcessEndPoint.cs

**Other:** CandidateApplicationCreateOrUpdateDto.cs, CandidateApplicationProcessHiringDto.cs, CandidateDecisionRequest.cs, CandidateHiringDocumentListItemDto.cs, CandidateHiringDocumentUploadDto.cs, CandidateHiringDocumentValidateDto.cs, CandidateInterviewerQueueDto.cs, CandidateInterviewerQueueItemDto.cs, CandidateInterviewResponseDto.cs, CandidateInterviewTimelineItem.cs, CandidateProcessCreateOrUpdateDto.cs, CandidateProcessDetailDto.cs, CandidateProcessKpisDto.cs, CandidateProcessListItemDto.cs, CandidateProcessVacancyDetailDto.cs, CandidateProcessWorkPositionDetailDto.cs, CandidateRecruitmentAgendaItemDto.cs, CandidateRecruitmentInterviewBoardDto.cs, CandidateRecruitmentInterviewBoardItemDto.cs, ChangeStageApplicationRequest.cs, ConfirmPresentationRequestDto.cs, FuenteKpiItem.cs, InterviewerActionRequest.cs, InterviewerApplicationViewDto.cs, ScheduleRecruitmentInterviewRequest.cs, VacancyTimelineEventDTO.cs, CandidateProcessEndPoint.cs, CandidateProcess.cs, ICandidateProcessAppService.cs, CandidateProcessAppService.cs

### ReclutamientoLuxuryApp/Candidates

**Entities:** Candidate.cs, CandidateApplicationRole.cs, CandidateInterview.cs, CandidateStageHistory.cs

**DTOs:** CandidateCreateOrUpdateDto.cs, CandidateDeleteImpactDto.cs, CandidateDetailDto.cs, CandidateDuplicateCheckInputDto.cs, CandidateDuplicateCheckResultDto.cs, CandidateDuplicateMatchType.cs, CandidateListItemDto.cs, CandidateStageHistoryItemDto.cs, CandidateUserDataForImportDto.cs, FormerEmployeeCandidateResultDto.cs, FormerEmployeeTalentPoolItemDto.cs

**Services:** CandidateAppService.cs

**EndPoints:** CandidateEndPoint.cs

**Mappings:** CandidateMapping.cs

**Other:** CandidateCreateOrUpdateDto.cs, CandidateDeleteImpactDto.cs, CandidateDetailDto.cs, CandidateDuplicateCheckInputDto.cs, CandidateDuplicateCheckResultDto.cs, CandidateDuplicateMatchType.cs, CandidateListItemDto.cs, CandidateStageHistoryItemDto.cs, CandidateUserDataForImportDto.cs, FormerEmployeeCandidateResultDto.cs, FormerEmployeeTalentPoolItemDto.cs, CandidateEndPoint.cs, Candidate.cs, CandidateApplicationRole.cs, CandidateInterview.cs, CandidateStageHistory.cs, ICandidateAppService.cs, CandidateMapping.cs, CandidateAppService.cs

### ReclutamientoLuxuryApp/CandidatesWorkExperience

**Entities:** CandidateWorkExperience.cs

**DTOs:** CandidateWorkExperienceCreateOrUpdateDto.cs, CandidateWorkExperienceItemDto.cs

**Services:** CandidateWorkExperienceAppService.cs

**EndPoints:** CandidateWorkExperienceEndPoint.cs

**Mappings:** CandidateWorkExperienceMapping.cs

**Other:** CandidateWorkExperienceCreateOrUpdateDto.cs, CandidateWorkExperienceItemDto.cs, CandidateWorkExperienceEndPoint.cs, CandidateWorkExperience.cs, ICandidateWorkExperienceAppService.cs, CandidateWorkExperienceMapping.cs, CandidateWorkExperienceAppService.cs

### ReclutamientoLuxuryApp/CustomerProviders

**DTOs:** BusquedaProveedorDTO.cs, CustomerProviderAddOrEditDTO.cs, CustomerProviderListDTO.cs, ProviderIndexDTO.cs, ProviderIndexDTOCategoriaDTO.cs

**Services:** CustomerProviderAppService.cs

**EndPoints:** CustomerProviderEndPoints.cs

**Other:** BusquedaProveedorDTO.cs, CustomerProviderAddOrEditDTO.cs, CustomerProviderListDTO.cs, ProviderIndexDTO.cs, ProviderIndexDTOCategoriaDTO.cs, CustomerProviderEndPoints.cs, ICustomerProviderAppService.cs, CustomerProviderMapper.cs, CustomerProviderAppService.cs

### ReclutamientoLuxuryApp/Employee

**DTOs:** EmployeeAddressDataEditDTO.cs, EmployeeDuplicateDTO.cs, EmployeeLaboralDataEditDTO.cs, EmployeeOpenRequestsDTO.cs, EmployeePersonalDataEditDTO.cs, EmployeeRecoveryPasswordDTO.cs, EmployeeUnifiedProfileEditDTO.cs

**Services:** EmployeeInternalAppService.cs

**EndPoints:** EmployeeInternalEndpoints.cs

**Other:** EmployeeAddressDataEditDTO.cs, EmployeeDuplicateDTO.cs, EmployeeLaboralDataEditDTO.cs, EmployeeOpenRequestsDTO.cs, EmployeePersonalDataEditDTO.cs, EmployeeRecoveryPasswordDTO.cs, EmployeeUnifiedProfileEditDTO.cs, EmployeeInternalEndpoints.cs, IEmployeeInternalAppService.cs, EmployeeInternalMappingProfile.cs, EmployeeInternalAppService.cs

### ReclutamientoLuxuryApp/EmployeeBankData

**DTOs:** EmployeeBankDataAddOrEditDTO.cs, EmployeeBankDataDTO.cs

**Services:** EmployeeBankDataAppService.cs

**EndPoints:** EmployeeBankDataEndPoints.cs

**Other:** EmployeeBankDataAddOrEditDTO.cs, EmployeeBankDataDTO.cs, EmployeeBankDataEndPoints.cs, IEmployeeBankDataAppService.cs, EmployeeBankDataMappingProfile.cs, EmployeeBankDataAppService.cs

### ReclutamientoLuxuryApp/EmployeeBeneficiary

**DTOs:** EmployeeBeneficiaryAddOrEditDTO.cs, EmployeeBeneficiaryDTO.cs

**Services:** EmployeeBeneficiaryAppService.cs

**EndPoints:** EmployeeBeneficiaryEndPoints.cs

**Other:** EmployeeBeneficiaryAddOrEditDTO.cs, EmployeeBeneficiaryDTO.cs, EmployeeBeneficiaryEndPoints.cs, IEmployeeBeneficiaryAppService.cs, EmployeeBeneficiaryMappingProfile.cs, EmployeeBeneficiaryAppService.cs

### ReclutamientoLuxuryApp/EmployeeClinicalData

**DTOs:** EmployeeClinicalDataDTOs.cs

**Services:** EmployeeClinicalDataAppService.cs

**EndPoints:** EmployeeClinicalDataEndPoints.cs

**Other:** EmployeeClinicalDataDTOs.cs, EmployeeClinicalDataEndPoints.cs, IEmployeeClinicalDataAppService.cs, EmployeeClinicalDataAppService.cs

### ReclutamientoLuxuryApp/EmployeeDocument

**DTOs:** DocumentCatalogSelectItemDto.cs, EmployeeDocumentReorderDto.cs

**Services:** EmployeeDocumentAppService.cs

**EndPoints:** EmployeeDocumentEndpoints.cs

**Other:** DocumentCatalogSelectItemDto.cs, EmployeeDocumentReorderDto.cs, EmployeeDocumentEndpoints.cs, IEmployeeDocumentAppService.cs, EmployeeDocumentAppService.cs

### ReclutamientoLuxuryApp/EmployeeEmergenContact

**DTOs:** EmployeeEmergencyContactAddOrEditDTO.cs, EmployeeEmergencyContactDTO.cs

**Services:** EmployeeEmergencyContactAppService.cs

**EndPoints:** EmployeeEmergencyContactEndPoints.cs

**Other:** EmployeeEmergencyContactAddOrEditDTO.cs, EmployeeEmergencyContactDTO.cs, EmployeeEmergencyContactEndPoints.cs, IEmployeeEmergencyContactAppService.cs, EmployeeEmergencyContactMapper.cs, EmployeeEmergencyContactAppService.cs

### ReclutamientoLuxuryApp/EmployeeFile

**Entities:** ChecklistOptionCatalog.cs, ChecklistOptionCatalogRole.cs, DocumentCatalog.cs, Employee.cs, EmployeeBankData.cs, EmployeeBeneficiary.cs, EmployeeClinicalData.cs, EmployeeDocument.cs, EmployeeEmergencyContact.cs, EmployeeOnboardingChecklist.cs, PersonData.cs

**DTOs:** EmployeeFileBankDataDTO.cs, EmployeeFileBeneficiaryDTO.cs, EmployeeFileClinicalDataDTO.cs, EmployeeFileContractDTO.cs, EmployeeFileEmergencyContactDTO.cs, EmployeeFileEvaluationDTO.cs, EmployeeFileHeaderDTO.cs, EmployeeFileIncidentDTO.cs, EmployeeFilePersonalDataDTO.cs, EmployeeFileRequestsDTO.cs, EmployeeFileSummaryDTO.cs, EmployeeFileVacationsLeavesDTO.cs, EmployeeFileWorkPositionDTO.cs

**Services:** EmployeeFileAppService.cs

**EndPoints:** EmployeeFileEndPoints.cs

**Other:** EmployeeFileBankDataDTO.cs, EmployeeFileBeneficiaryDTO.cs, EmployeeFileClinicalDataDTO.cs, EmployeeFileContractDTO.cs, EmployeeFileEmergencyContactDTO.cs, EmployeeFileEvaluationDTO.cs, EmployeeFileHeaderDTO.cs, EmployeeFileIncidentDTO.cs, EmployeeFilePersonalDataDTO.cs, EmployeeFileRequestsDTO.cs, EmployeeFileSummaryDTO.cs, EmployeeFileVacationsLeavesDTO.cs, EmployeeFileWorkPositionDTO.cs, EmployeeFileEndPoints.cs, ChecklistOptionCatalog.cs, ChecklistOptionCatalogRole.cs, DocumentCatalog.cs, Employee.cs, EmployeeBankData.cs, EmployeeBeneficiary.cs, EmployeeClinicalData.cs, EmployeeDocument.cs, EmployeeEmergencyContact.cs, EmployeeOnboardingChecklist.cs, PersonData.cs, IEmployeeFileAppService.cs, EmployeeFileMappingProfile.cs, EmployeeFileAppService.cs

### ReclutamientoLuxuryApp/Employees

**Other:** IEmployeeBirthdayAppService.cs, EmployeeBirthdayMappingProfile.cs, IChecklistOptionCatalogAppService.cs, IEmployeeOnboardingChecklistAppService.cs, IWorkPositionOrgChartAppService.cs, WorkPositionOrgChartMappingProfile.cs, IEmployeeExternalAppService.cs, EmployeeMapper.cs

### ReclutamientoLuxuryApp/InterviewerMatrices

**Entities:** InterviewerMatrix.cs

**DTOs:** EligibleInterviewerOptionDto.cs, InterviewerMatrixBoardDto.cs, InterviewerMatrixCreateOrUpdateDto.cs, InterviewerMatrixItemDto.cs, InterviewerMatrixRoleOptionDto.cs

**Services:** InterviewerMatrixAppService.cs

**EndPoints:** InterviewerMatrixEndPoint.cs

**Mappings:** InterviewerMatrixMapping.cs

**Other:** EligibleInterviewerOptionDto.cs, InterviewerMatrixBoardDto.cs, InterviewerMatrixCreateOrUpdateDto.cs, InterviewerMatrixItemDto.cs, InterviewerMatrixRoleOptionDto.cs, InterviewerMatrixEndPoint.cs, InterviewerMatrix.cs, IInterviewerMatrixAppService.cs, InterviewerMatrixMapping.cs, InterviewerMatrixAppService.cs

### ReclutamientoLuxuryApp/JobDescriptions

**Entities:** JobDescription.cs

**DTOs:** JobDescriptionAddOrEditDTO.cs, JobDescriptionAnalysisRequestDTO.cs, JobDescriptionDTO.cs, JobDescriptionProposalRequestDTO.cs

**Services:** JobDescriptionAppService.cs

**EndPoints:** JobDescriptionEndPoints.cs

**Other:** JobDescriptionAddOrEditDTO.cs, JobDescriptionAnalysisRequestDTO.cs, JobDescriptionDTO.cs, JobDescriptionProposalRequestDTO.cs, JobDescriptionEndPoints.cs, JobDescription.cs, IJobDescriptionAppService.cs, JobDescriptionMapper.cs, JobDescriptionAppService.cs

### ReclutamientoLuxuryApp/Notifications

**Services:** CandidateNotificationCoordinatorService.cs, MultiChannelAlertService.cs

**Other:** ICandidateNotificationCoordinatorService.cs, IMultiChannelAlertService.cs, CandidateNotificationCoordinatorService.cs, MultiChannelAlertService.cs

### ReclutamientoLuxuryApp/Persistence

**Other:** WorkPositionScheduleConfiguration.cs, WorkPositionScheduleDaysConfiguration.cs

### ReclutamientoLuxuryApp/ProviderSupports

**DTOs:** ProviderSupportAddOrEditDTO.cs, ProviderSupportListDTO.cs

**Services:** PersonProviderSupportAppService.cs

**EndPoints:** ProviderSupportEndPoints.cs

**Other:** ProviderSupportAddOrEditDTO.cs, ProviderSupportListDTO.cs, ProviderSupportEndPoints.cs, IPersonProviderSupportAppService.cs, PersonProviderSupportAppService.cs

### ReclutamientoLuxuryApp/RecruitmentRequests

**DTOs:** SolicitudesVacanteListDTO.cs

**Services:** ReclutamientoIntegrationService.cs, ReclutamientoQueryService.cs

**EndPoints:** SolicitudesReclutamientoEndPoints.cs

**Other:** SolicitudesVacanteListDTO.cs, SolicitudesReclutamientoEndPoints.cs, IReclutamientoIntegrationService.cs, IReclutamientoQueryService.cs, ReclutamientoIntegrationService.cs, ReclutamientoQueryService.cs

### ReclutamientoLuxuryApp/RecruitmentSourceCatalogs

**Entities:** RecruitmentSourceCatalog.cs

**DTOs:** RecruitmentSourceCatalogDTO.cs

**Services:** RecruitmentSourceCatalogAppService.cs

**EndPoints:** RecruitmentSourceCatalogEndpoints.cs

**Other:** RecruitmentSourceCatalogDTO.cs, RecruitmentSourceCatalogEndpoints.cs, RecruitmentSourceCatalog.cs, IRecruitmentSourceCatalogAppService.cs, RecruitmentSourceCatalogAppService.cs

### ReclutamientoLuxuryApp/RecurringTasks

**DTOs:** CompleteTaskInstanceDTO.cs, CreateTaskCommentDTO.cs, CreateTaskTemplateDTO.cs, CreateTaskTemplateItemDTO.cs, CustomerTaskItemConfigDTO.cs, TaskAttachmentDTO.cs, TaskCommentDTO.cs, TaskInstanceDTO.cs, TaskTemplateDTO.cs, TaskTemplateItemDTO.cs, TaskTemplateItemsReorderDTO.cs, UpdateTaskTemplateDTO.cs, UpdateTaskTemplateItemDTO.cs

**Services:** RecurringTaskGeneratorService.cs, TaskInstanceAppService.cs, TaskTemplateAppService.cs

**EndPoints:** TaskInstancesEndPoints.cs, TaskTemplatesEndPoints.cs

**Other:** CompleteTaskInstanceDTO.cs, CreateTaskCommentDTO.cs, CreateTaskTemplateDTO.cs, CreateTaskTemplateItemDTO.cs, CustomerTaskItemConfigDTO.cs, TaskAttachmentDTO.cs, TaskCommentDTO.cs, TaskInstanceDTO.cs, TaskTemplateDTO.cs, TaskTemplateItemDTO.cs, TaskTemplateItemsReorderDTO.cs, UpdateTaskTemplateDTO.cs, UpdateTaskTemplateItemDTO.cs, TaskInstancesEndPoints.cs, TaskTemplatesEndPoints.cs, IRecurringTaskGeneratorService.cs, ITaskInstanceAppService.cs, ITaskTemplateAppService.cs, RecurringTasksProfile.cs, RecurringTaskGeneratorService.cs, TaskInstanceAppService.cs, TaskTemplateAppService.cs

### ReclutamientoLuxuryApp/RequestDismissalDiscounts

**Entities:** RequestDismissalDiscount.cs

**DTOs:** DiscountDescriptionDTO.cs, RequestDismissalDiscountAddOrEditDTO.cs, RequestDismissalDiscountDTO.cs

**Services:** RequestDismissalDiscountAppService.cs

**EndPoints:** RequestDismissalDiscountEndPoints.cs

**Other:** DiscountDescriptionDTO.cs, RequestDismissalDiscountAddOrEditDTO.cs, RequestDismissalDiscountDTO.cs, RequestDismissalDiscountEndPoints.cs, RequestDismissalDiscount.cs, IRequestDismissalDiscountAppService.cs, RequestDismissalDiscountMappingProfile.cs, RequestDismissalDiscountAppService.cs

### ReclutamientoLuxuryApp/RequestDismissals

**Entities:** RequestDismissal.cs, RequestDismissalEvaluation.cs, RequestDismissalFile.cs, RequestDismissalIncident.cs

**DTOs:** RequestDismissalAddOrEditDTO.cs, RequestDismissalDTO.cs, RequestDismissalEvaluationDTO.cs, RequestDismissalFileDTO.cs, RequestDismissalIncidentDTO.cs, RequestDismissalListDTO.cs, RequestDismissalSendRequestDTO.cs, RequestDismissalStatusUpdateDTO.cs, SolicitudBajaEmailDTO.cs

**Services:** SolicitudBajaAppService.cs

**EndPoints:** RequestDismissalEndPoints.cs

**Other:** RequestDismissalAddOrEditDTO.cs, RequestDismissalDTO.cs, RequestDismissalEvaluationDTO.cs, RequestDismissalFileDTO.cs, RequestDismissalIncidentDTO.cs, RequestDismissalListDTO.cs, RequestDismissalSendRequestDTO.cs, RequestDismissalStatusUpdateDTO.cs, SolicitudBajaEmailDTO.cs, RequestDismissalEndPoints.cs, RequestDismissal.cs, RequestDismissalEvaluation.cs, RequestDismissalFile.cs, RequestDismissalIncident.cs, ISolicitudBajaAppService.cs, RequestDismissalMapper.cs, SolicitudBajaAppService.cs

### ReclutamientoLuxuryApp/RequestEmployeeRegisters

**Entities:** RequestEmployeeRegister.cs, RequestEmployeeRegisterFile.cs

**DTOs:** DataToExcelRequestEmployeeRegisterDTO.cs, DuplicateEmployeeMatchDTO.cs, GetRequestEmployeeRegisterDTO.cs, IndividualRequestEmployee.cs, ReactivateAndMigrateEmployeeDTO.cs, RequestEmployeeRegisterAddOrEditDTO.cs, RequestEmployeeRegisterBasicInfoDTO.cs, RequestEmployeeRegisterDTO.cs, RequestEmployeeRegisterDuplicateSearchDTO.cs, RequestEmployeeRegisterGetByIdDTO.cs, RequestEmployeeRegisterListDTO.cs, RequestEmployeeRegisterUpdateStatusDTO.cs

**Services:** RequestEmployeeRegisterAppService.cs

**EndPoints:** RequestEmployeeRegisterEndPoints.cs

**Other:** DataToExcelRequestEmployeeRegisterDTO.cs, DuplicateEmployeeMatchDTO.cs, GetRequestEmployeeRegisterDTO.cs, IndividualRequestEmployee.cs, ReactivateAndMigrateEmployeeDTO.cs, RequestEmployeeRegisterAddOrEditDTO.cs, RequestEmployeeRegisterBasicInfoDTO.cs, RequestEmployeeRegisterDTO.cs, RequestEmployeeRegisterDuplicateSearchDTO.cs, RequestEmployeeRegisterGetByIdDTO.cs, RequestEmployeeRegisterListDTO.cs, RequestEmployeeRegisterUpdateStatusDTO.cs, RequestEmployeeRegisterEndPoints.cs, RequestEmployeeRegister.cs, RequestEmployeeRegisterFile.cs, IRequestEmployeeRegisterAppService.cs, RequestEmployeeRegisterMappingProfile.cs, RequestEmployeeRegisterAppService.cs

### ReclutamientoLuxuryApp/RequestPositions

**Entities:** RequestPosition.cs

**DTOs:** RequestPositionAddOrEditDTO.cs, RequestPositionDeleteImpactDto.cs, RequestPositionDTO.cs, RequestPositionSendEmailDTO.cs

**Services:** RequestPositionAppService.cs

**EndPoints:** RequestPositionEndPoints.cs

**Other:** RequestPositionAddOrEditDTO.cs, RequestPositionDeleteImpactDto.cs, RequestPositionDTO.cs, RequestPositionSendEmailDTO.cs, RequestPositionEndPoints.cs, RequestPosition.cs, IRequestPositionAppService.cs, RequestPositionMapper.cs, RequestPositionAppService.cs

### ReclutamientoLuxuryApp/SalaryModifications

**Entities:** RequestSalaryModification.cs

**DTOs:** GetDataForModificacionSalarioDTO.cs, RequestSalaryModificationAddOrEditDTO.cs, RequestSalaryModificationDTO.cs, RequestSalaryModificationListDTO.cs, StatusRequestSalaryModificationDTO.cs

**Services:** RequestSalaryModificationAppService.cs

**EndPoints:** RequestSalaryModificationEndPoints.cs

**Other:** GetDataForModificacionSalarioDTO.cs, RequestSalaryModificationAddOrEditDTO.cs, RequestSalaryModificationDTO.cs, RequestSalaryModificationListDTO.cs, StatusRequestSalaryModificationDTO.cs, RequestSalaryModificationEndPoints.cs, RequestSalaryModification.cs, IRequestSalaryModificationAppService.cs, SalaryModificationMapper.cs, RequestSalaryModificationAppService.cs

### ReclutamientoLuxuryApp/Shared

**Other:** IHrActionPolicyService.cs

### ReclutamientoLuxuryApp/SolicitudAltas

**Other:** RequestEmployeeRegisterEvents.cs, RequestEmployeeRegisterHandler.cs

### ReclutamientoLuxuryApp/SolicitudBajas

**Other:** RequestDismissalRequestedEvent.cs, RequestDismissalRequestedHandler.cs

### ReclutamientoLuxuryApp/SolicitudModificacionesSueldo

**Other:** RequestSalaryModificationEvents.cs, RequestSalaryModificationHandler.cs

### ReclutamientoLuxuryApp/SolicitudVacantes

**Other:** RequestPositionEvents.cs, RequestPositionHandler.cs

### ReclutamientoLuxuryApp/WorkPositions

**Entities:** DiaDeTrabajo.cs, WorkPosition.cs, WorkPositionSchedule.cs

**DTOs:** WorkPositionAddOrEditDTO.cs, WorkPositionDTO.cs, WorkPositionHoursDTO.cs, WorkPositionListDto.cs

**Services:** WorkPositionAppService.cs

**EndPoints:** WorkPositionEndPoints.cs

**Other:** WorkPositionAddOrEditDTO.cs, WorkPositionDTO.cs, WorkPositionHoursDTO.cs, WorkPositionListDto.cs, WorkPositionEndPoints.cs, DiaDeTrabajo.cs, WorkPosition.cs, WorkPositionSchedule.cs, IWorkPositionAppService.cs, WorkPositionMapper.cs, WorkPositionAppService.cs

### RecursosHumanosLuxuryApp/ChekadorEmpleados

**Entities:** RegistroChecador.cs, SedeChecador.cs

**DTOs:** ChekadorEmpleadosDTOs.cs

**Services:** ChekadorEmpleadosAppService.cs

**EndPoints:** ChekadorEmpleadosEndpoints.cs

**Other:** ChekadorEmpleadosDTOs.cs, ChekadorEmpleadosEndpoints.cs, RegistroChecador.cs, SedeChecador.cs, IChekadorEmpleadosAppService.cs, ChekadorEmpleadosAppService.cs

### RecursosHumanosLuxuryApp/Evaluacion

**Entities:** EvaluationAnswer.cs, PerformanceEvaluation.cs, TemplateCategory.cs, TemplateEvaluation.cs, TemplateQuestion.cs

**Other:** EvaluationAnswer.cs, PerformanceEvaluation.cs, TemplateCategory.cs, TemplateEvaluation.cs, TemplateQuestion.cs, ITemplateEvaluationAppService.cs, EmployeeEvaluationMapper.cs, IPerformanceEvaluationAppService.cs, PerformanceEvaluationMappingProfile.cs

### RecursosHumanosLuxuryApp/ManualsAndProcesses

**DTOs:** ManualPasoDTO.cs, ManualPasoEnlaceDTO.cs

**Services:** ManualTemplateService.cs

**EndPoints:** ManualPasosEndPoints.cs

**Other:** ManualPasoDTO.cs, ManualPasoEnlaceDTO.cs, ManualPasosEndPoints.cs, IManualTemplateService.cs, ManualTemplateService.cs

### RecursosHumanosLuxuryApp/Nomina

**Entities:** ConfiguracionNomina.cs, DiasNoHabiles.cs, EvidenciaNomina.cs, IncidenciaNomina.cs, NominaDetalle.cs, NominaEncabezado.cs, PagoPrestamoNomina.cs, PeriodoNomina.cs, PrestamoEmpleado.cs, TiempoExtra.cs

**Other:** IConfiguracionNominaAppService.cs, ConfiguracionNominaMappingProfile.cs, ConfiguracionNomina.cs, DiasNoHabiles.cs, EvidenciaNomina.cs, IncidenciaNomina.cs, NominaDetalle.cs, NominaEncabezado.cs, PagoPrestamoNomina.cs, PeriodoNomina.cs, PrestamoEmpleado.cs, TiempoExtra.cs, IEvidenciaNominaAppService.cs, EvidenciasNominaMappingProfile.cs, IIncidenciaNominaAppService.cs, IncidenciaNominaMappingProfile.cs, INominaDetalleAppService.cs, NominaDetalleMappingProfile.cs, INominaEncabezadoAppService.cs, NominaEncabezadoMappingProfile.cs, IPeriodoNominaAppService.cs, PeriodoNominaMappingProfile.cs, IPrestamoEmpleadoAppService.cs, PrestamosMappingProfile.cs, ImssCalculatorService.cs, IsrCalculatorService.cs, NominaCalculatorService.cs, NominaDraftRecalculationService.cs, PeriodoNominaHelperService.cs, ITiempoExtraAppService.cs, TiempoExtraMappingProfile.cs

### RecursosHumanosLuxuryApp/Notifications

**DTOs:** NotificationRequestDataDTO.cs

**Services:** HrNotificationCoordinatorService.cs

**Other:** NotificationRequestDataDTO.cs, IHrNotificationCoordinatorService.cs, HrNotificationCoordinatorService.cs

### RecursosHumanosLuxuryApp/Persistence

**Other:** CheckadorConfiguration.cs, NominaEntityConfigurations.cs

### RecursosHumanosLuxuryApp/TimeOff

**Entities:** LeaveRequest.cs, LeaveRequestHistory.cs, ManualBalanceChangeLog.cs, VacationBalance.cs, VacationRequest.cs, VacationRequestHistory.cs

**Other:** IApprovalRuleService.cs, LeaveRequest.cs, LeaveRequestHistory.cs, ManualBalanceChangeLog.cs, VacationBalance.cs, VacationRequest.cs, VacationRequestHistory.cs, ILeaveRequestEmailGenerator.cs, ILeaveRequestService.cs, LeaveRequestMapping.cs, IAprobacionPermisoService.cs, LeaveRequestApprovalMappingProfile.cs, VacationRequestMyDTO.cs, MyVacationRequestsEndpoints.cs, ISolicitudVacacionesService.cs, MyVacationRequestsMappingProfile.cs, SolicitudVacacionesService.cs, RegisterPastVacationDTO.cs, PastVacationsEndPoints.cs, IPastVacationsAppService.cs, PastVacationsMappingProfile.cs, PastVacationsAppService.cs, VacationBalanceAdminViewDTO.cs, VacationBalanceAdminEndpoints.cs, IVacationBalanceAdminService.cs, VacationBalanceAdminMappingProfile.cs, VacationBalanceAdminService.cs, VacationApproveDTO.cs, VacationRequestApprovalEndPoints.cs, IAprobacionVacacionesService.cs, VacationRequestApprovalMappingProfile.cs, AprobacionVacacionesService.cs, VacationBalanceDTO.cs, VacationHistoryItemDTO.cs, VacationRequestAddOrEditDTO.cs, VacationRequestDetailDTO.cs, VacationRequestDTO.cs, VacationRequestFilterDTO.cs, IVacationEmailGenerator.cs, VacacionesProfile.cs, VacationBalanceMapping.cs, VacationEmailGenerator.cs, VacationHelperService.cs, GenericEmailViewModel.cs

### SupplierLuxuryApp/Provider

**Entities:** CategoryProvider.cs, PersonProviderSupport.cs, Provider.cs

**DTOs:** BusquedaCategoriaDTO.cs, ProviderAddOrEditDTO.cs, ProviderCoincidenciaDTO.cs, ProviderDTO.cs

**Services:** ProviderAppService.cs

**EndPoints:** ProvidersEndPoints.cs

**Other:** BusquedaCategoriaDTO.cs, ProviderAddOrEditDTO.cs, ProviderCoincidenciaDTO.cs, ProviderDTO.cs, ProvidersEndPoints.cs, CategoryProvider.cs, PersonProviderSupport.cs, Provider.cs, IProviderAppService.cs, ProviderMapper.cs, ProviderAppService.cs

### SupplierLuxuryApp/ProviderQualification

**Entities:** QualificationProvider.cs

**DTOs:** QualificationProviderAddOrEditDTO.cs, QualificationProviderDTO.cs

**Services:** QualificationProviderAppService.cs

**EndPoints:** QualificationProviderEndpoints.cs

**Other:** QualificationProviderAddOrEditDTO.cs, QualificationProviderDTO.cs, QualificationProviderEndpoints.cs, QualificationProvider.cs, IQualificationProviderAppService.cs, QualificationProviderMapper.cs, QualificationProviderAppService.cs

### SupplierLuxuryApp/Purchases

**Other:** PurchaseResponseOrderBudgetPdfDTO.cs, SolicitudPagoAuthPdfDTO.cs, SolicitudPagoDatosPagoPdfDTO.cs, SolicitudPagoDetallePdfDTO.cs, SolicitudPagoPdfDTO.cs, SolicitudPagoPdfResponseDTO.cs, SolicitudPagoPresupuestoPdfDTO.cs, SolicitudPagoResponseAuthPdfDTO.cs, SolicitudPagoResponseDatosPagoPdfDTO.cs, SolicitudPagoResponseStatusDTO.cs, SolicitudPagoStatusDTO.cs, SolicitudPagoMapper.cs, IOrdenCompraAppService.cs, PurchaseOrderBudgetMapping.cs, IOrdenCompraAuthAppService.cs, IOrdenCompraPresupuestoAppService.cs, IOrdenCompraDetalleAppService.cs, ITotalesOrdenCompraDetallleService.cs, IOrdenCompraComprobantePagoAppService.cs, IOrdenCompraDatosPagoAppService.cs, IOrdenCompraStatusAppService.cs

### SystemLuxuryApp/Approvals

**Entities:** ApprovalRoleHierarchy.cs

**Other:** ApprovalRoleHierarchy.cs

### SystemLuxuryApp/Common

**Other:** UrlPathResolver.cs

### SystemLuxuryApp/ConfiguracionSistema

**Other:** IAuditEntryAppService.cs, IDatabaseBackupService.cs, IOneDriveGraphService.cs

### SystemLuxuryApp/Diagnostics

**EndPoints:** DiagnosticsEndPoints.cs

**Other:** DiagnosticsEndPoints.cs

### SystemLuxuryApp/Persistence

**Other:** PasswordRecoveryCodeConfiguration.cs

### SystemLuxuryApp/SelectItem

**Services:** SelectItemAppService.cs

**EndPoints:** SelectItemEndPoints.cs

**Other:** SelectItemEndPoints.cs, ISelectItemAppService.cs, SelectItemAppService.cs

### SystemLuxuryApp/SendEmailGlobal

**Other:** CollectionNotificationServices.cs, CollectionNotificationEmailDTO.cs, IAppImplementationEmailService.cs, AppImplementationEmailService.cs, EmployeeMissingDataEmailDTO.cs, CommitteeNotificationServices.cs, CommitteeWelcomeEmailDTO.cs, IMeetingEmailService.cs, MeetingNotificationServices.cs, MeetingPendingItemsEmailDTO.cs, MeetingResponsibleItemDTO.cs, IEmailMessageAppService.cs, ISendEmailAppService.cs, GenericTestEmailViewModel.cs, OperationReportEmailViewModel.cs, ReportPendingTicketGroupEmailViewModel.cs, TestMailEmailViewModel.cs, TicketMessageEmailViewModel.cs, ExecutivePendingReportEmailDTO.cs, FinancialNotificationServices.cs, FinancialReportEmailDTO.cs, IFundingNotificationInterfaces.cs, FundingNotificationOrchestrator.cs, IBudgetProposalRealTimeService.cs, IProjectedExpenseRealTimeService.cs, IRecruitmentEmailService.cs, RecruitmentEmailService.cs, RecruitmentAltaSistemasEmailDTO.cs, RecruitmentCandidateApplicationCreatedEmailDTO.cs, RecruitmentCandidateInterviewDecisionEmailDTO.cs, RecruitmentCandidateReceptionConfirmedEmailDTO.cs, RecruitmentCandidateSentToInterviewEmailDTO.cs, RecruitmentModificacionSalarioEmailDTO.cs, RecruitmentSolicitudAltaEmailDTO.cs, RecruitmentSolicitudBajaEmailDTO.cs, RecruitmentSolicitudVacanteEmailDTO.cs, HrNotificationOrchestrator.cs, IHrNotificationInterfaces.cs, HrNotificationServices.cs, HrGenericNotificationDTO.cs, VacationExpiringReminderEmailDTO.cs, IScheduledTaskEmailService.cs, ScheduledTaskEmailService.cs, TaskNotificationEmailDTO.cs, ITaskWorkPlanEmailService.cs, TaskWorkPlanEmailService.cs, TaskWorkPlanEmailDTO.cs, TicketReportItemDTO.cs, ITaskLegalWhatsAppService.cs, TaskLegalWhatsAppService.cs

### SystemLuxuryApp/SystemAI

**Other:** IAiChatAppService.cs, IAiKnowledgeBaseAppService.cs, IElevenLabsAppService.cs

### SystemLuxuryApp/SystemAuditLogs

**Other:** IBrevoEmailLogService.cs, ILogService.cs, IUserActivityHistoryAppService.cs, IUserActivityService.cs

### SystemLuxuryApp/SystemTenant

**Other:** IAiAssistantService.cs, INotificationDispatcher.cs, INotificationUserAppService.cs, ISendSignalRService.cs, NotificationCleanupJob.cs, NotificationUserMapper.cs

## Frontend - Archivos por Submodulo

### admin.luxuryapp/access-control

**Components:** access-dashboard.ts, access-events.ts, access-point-list.ts, visitor-list.ts

**Desktop:** access-dashboard.ts, access-events.ts, access-point-list.ts, visitor-list.ts

**Mobile:** access-dashboard.ts, access-events.ts, access-point-list.ts, visitor-list.ts

**Interfaces:** access-point-form.interface.ts, visitor-form.interface.ts

**Services:** access-dashboard.ts, access-events.ts, access-point-list.ts, visitor-list.ts

**Pipes:** access-dashboard.ts, access-events.ts, access-point-list.ts, visitor-list.ts

### admin.luxuryapp/admin-wrapper

**Components:** admin-modules.ts, admin-wrapper.ts

**Desktop:** admin-modules.ts, admin-wrapper.spec.ts, admin-wrapper.ts

**Mobile:** admin-modules.ts, admin-wrapper.spec.ts, admin-wrapper.ts

**Interfaces:** admin-module-card.interface.ts, admin-module-group.interface.ts

**Services:** admin-modules.ts, admin-wrapper.spec.ts, admin-wrapper.ts

**Pipes:** admin-modules.ts, admin-wrapper.spec.ts, admin-wrapper.ts

### admin.luxuryapp/analisis-registros

### admin.luxuryapp/catalogos-generales

### admin.luxuryapp/configuracion-correo

### admin.luxuryapp/configuracion-sistema

### admin.luxuryapp/herramientas-dev

### admin.luxuryapp/reportes

### admin.luxuryapp/seguridad-permisos

### auth.luxuryapp/login

**Components:** login-wrapper.ts, login.ts

**Desktop:** login-mobile.ts, login-wrapper.ts, login.spec.ts, login.ts

**Mobile:** login-mobile.ts, login-wrapper.ts, login.spec.ts, login.ts

**Services:** login-mobile.ts, login-wrapper.ts, login.spec.ts, login.ts

**Pipes:** login-mobile.ts, login-wrapper.ts, login.spec.ts, login.ts

### auth.luxuryapp/password-manager

**Components:** index.ts, password-form.ts, password-list.ts, password-manager.routes.ts

**Desktop:** index.ts, password-form.spec.ts, password-form.ts, password-list.spec.ts, password-list.ts, password-manager.routes.spec.ts, password-manager.routes.ts

**Mobile:** index.ts, password-form.spec.ts, password-form.ts, password-list.spec.ts, password-list.ts, password-manager.routes.spec.ts, password-manager.routes.ts

**Interfaces:** credential-detail.dto.ts, password-form.interface.ts

**Services:** index.ts, password-form.spec.ts, password-form.ts, password-list.spec.ts, password-list.ts, password-manager.routes.spec.ts, password-manager.routes.ts

**Pipes:** index.ts, password-form.spec.ts, password-form.ts, password-list.spec.ts, password-list.ts, password-manager.routes.spec.ts, password-manager.routes.ts

### auth.luxuryapp/recovery-code

**Components:** feature-flag.ts, recovery-code-wrapper.ts, recovery-code.ts

**Desktop:** feature-flag.ts, recovery-code-mobile.ts, recovery-code-wrapper.ts, recovery-code.ts

**Mobile:** feature-flag.ts, recovery-code-mobile.ts, recovery-code-wrapper.ts, recovery-code.ts

**Interfaces:** initiate-recovery-by-code.interface.ts, validate-recovery-code.interface.ts

**Services:** feature-flag.ts, recovery-code-mobile.ts, recovery-code-wrapper.ts, recovery-code.ts

**Pipes:** feature-flag.ts, recovery-code-mobile.ts, recovery-code-wrapper.ts, recovery-code.ts

### auth.luxuryapp/recovery-password

**Components:** recover-password.ts, recovery-wrapper.ts

**Desktop:** recover-password.spec.ts, recover-password.ts, recovery-mobile.ts, recovery-wrapper.spec.ts, recovery-wrapper.ts

**Mobile:** recover-password.spec.ts, recover-password.ts, recovery-mobile.ts, recovery-wrapper.spec.ts, recovery-wrapper.ts

**Services:** recover-password.spec.ts, recover-password.ts, recovery-mobile.ts, recovery-wrapper.spec.ts, recovery-wrapper.ts

**Pipes:** recover-password.spec.ts, recover-password.ts, recovery-mobile.ts, recovery-wrapper.spec.ts, recovery-wrapper.ts

### auth.luxuryapp/reset-password

**Components:** reset-password-wrapper.ts, reset-password.ts

**Desktop:** reset-password-mobile.ts, reset-password-wrapper.ts, reset-password.spec.ts, reset-password.ts

**Mobile:** reset-password-mobile.ts, reset-password-wrapper.ts, reset-password.spec.ts, reset-password.ts

**Services:** reset-password-mobile.ts, reset-password-wrapper.ts, reset-password.spec.ts, reset-password.ts

**Pipes:** reset-password-mobile.ts, reset-password-wrapper.ts, reset-password.spec.ts, reset-password.ts

### auth.luxuryapp/user-profile

**Components:** update-password.ts, update-profile-wrapper.ts, update-user-photo.ts

**Desktop:** update-password.ts, update-profile-wrapper.ts, update-user-photo.ts

**Mobile:** update-password.ts, update-profile-wrapper.ts, update-user-photo.ts

**Services:** update-password.ts, update-profile-wrapper.ts, update-user-photo.ts

**Pipes:** update-password.ts, update-profile-wrapper.ts, update-user-photo.ts

### cobranza.luxuryapp/aspel-cobranza-haus

**Components:** aspel-cobranza-haus-debt-detail-modal.ts, aspel-cobranza-haus-query-panel.ts, aspel-cobranza-haus-source-toolbar.ts, aspel-cobranza-haus.models.ts, aspel-cobranza-haus.ts

**Desktop:** aspel-cobranza-haus-debt-detail-modal.ts, aspel-cobranza-haus-pdf.service.ts, aspel-cobranza-haus-query-panel.ts, aspel-cobranza-haus-source-toolbar.ts, aspel-cobranza-haus.models.ts, aspel-cobranza-haus.ts

**Mobile:** aspel-cobranza-haus-debt-detail-modal.ts, aspel-cobranza-haus-pdf.service.ts, aspel-cobranza-haus-query-panel.ts, aspel-cobranza-haus-source-toolbar.ts, aspel-cobranza-haus.models.ts, aspel-cobranza-haus.ts

**Services:** aspel-cobranza-haus-debt-detail-modal.ts, aspel-cobranza-haus-pdf.service.ts, aspel-cobranza-haus-query-panel.ts, aspel-cobranza-haus-source-toolbar.ts, aspel-cobranza-haus.models.ts, aspel-cobranza-haus.ts

**Pipes:** aspel-cobranza-haus-debt-detail-modal.ts, aspel-cobranza-haus-pdf.service.ts, aspel-cobranza-haus-query-panel.ts, aspel-cobranza-haus-source-toolbar.ts, aspel-cobranza-haus.models.ts, aspel-cobranza-haus.ts

### cobranza.luxuryapp/cobranza-nativa

**Components:** cobranza-nativa.routing.ts

**Desktop:** cobranza-nativa.routing.ts

**Mobile:** cobranza-nativa.routing.ts

**Interfaces:** charge-allocation.dto.ts, charge-template.dto.ts, charge-type-catalog.dto.ts, charge.dto.ts, cobranza-nativa.interface.ts, cobranza-payment.dto.ts, collection-case.dto.ts, enums.ts, financial-approval.dto.ts, financial-audit.dto.ts, invoice.dto.ts, late-fee-policy.dto.ts, ledger.dto.ts, native-statement.dto.ts, notification-settings.dto.ts, period-closure.dto.ts, property-fine.dto.ts, property-member.dto.ts, template-coverage.dto.ts

**Services:** cobranza-nativa.routing.ts

**Pipes:** cobranza-nativa.routing.ts

### cobranza.luxuryapp/cobranza-online

**Components:** aspel-cobranza-online.routes.ts, cobranza-date-picker-modal.ts, cobranza-online-wrapper.ts

**Desktop:** aspel-cobranza-online.routes.ts, cobranza-date-picker-modal.ts, cobranza-online-wrapper.ts

**Mobile:** aspel-cobranza-online.routes.ts, cobranza-date-picker-modal.ts, cobranza-online-wrapper.ts

**Interfaces:** cobranza-online-analysis.model.ts, cobranza-online-dashboard.model.ts, cobranza-online-exclusions.model.ts, cobranza-online-inspection.model.ts, cobranza-online-sync.model.ts, presupuesto-contabilidad.model.ts

**Services:** aspel-cobranza-online.routes.ts, cobranza-date-picker-modal.ts, cobranza-online-wrapper.ts

**Helpers:** cobranza-clasificacion.ts, cobranza-conceptos.ts

**Pipes:** aspel-cobranza-online.routes.ts, cobranza-date-picker-modal.ts, cobranza-online-wrapper.ts

### committee.luxuryapp/board-directors-financial-reports

**Components:** informes-financieros-consejo-directivo.ts

**Desktop:** informes-financieros-consejo-directivo.ts

**Mobile:** informes-financieros-consejo-directivo.ts

**Services:** informes-financieros-consejo-directivo.ts

**Pipes:** informes-financieros-consejo-directivo.ts

### committee.luxuryapp/board-directors-library

**Components:** biblioteca-consejo-directivo-detalle.ts, biblioteca-consejo-directivo.ts

**Desktop:** biblioteca-consejo-directivo-detalle.ts, biblioteca-consejo-directivo.ts

**Mobile:** biblioteca-consejo-directivo-detalle.ts, biblioteca-consejo-directivo.ts

**Services:** biblioteca-consejo-directivo-detalle.ts, biblioteca-consejo-directivo.ts

**Pipes:** biblioteca-consejo-directivo-detalle.ts, biblioteca-consejo-directivo.ts

### committee.luxuryapp/board-directors-meeting-minutes

**Components:** minutas-reuniones-consejo-directivo-detalle.ts, minutas-reuniones-consejo-directivo.ts

**Desktop:** minutas-reuniones-consejo-directivo-detalle.ts, minutas-reuniones-consejo-directivo.ts

**Mobile:** minutas-reuniones-consejo-directivo-detalle.ts, minutas-reuniones-consejo-directivo.ts

**Services:** minutas-reuniones-consejo-directivo-detalle.ts, minutas-reuniones-consejo-directivo.ts

**Pipes:** minutas-reuniones-consejo-directivo-detalle.ts, minutas-reuniones-consejo-directivo.ts

### committee.luxuryapp/board-directors-monthly-meetings

**Components:** reuniones-mensuales-consejo-directivo.ts

**Desktop:** reuniones-mensuales-consejo-directivo.ts

**Mobile:** reuniones-mensuales-consejo-directivo.ts

**Services:** reuniones-mensuales-consejo-directivo.ts

**Pipes:** reuniones-mensuales-consejo-directivo.ts

### committee.luxuryapp/cobranza

**Components:** committee-cobranza-detail-modal.ts, committee-cobranza-web.ts, committee-cobranza-wrapper.ts

**Desktop:** committee-cobranza-base.service.ts, committee-cobranza-detail-modal.ts, committee-cobranza-mobile.ts, committee-cobranza-web.ts, committee-cobranza-wrapper.ts

**Mobile:** committee-cobranza-base.service.ts, committee-cobranza-detail-modal.ts, committee-cobranza-mobile.ts, committee-cobranza-web.ts, committee-cobranza-wrapper.ts

**Services:** committee-cobranza-base.service.ts, committee-cobranza-detail-modal.ts, committee-cobranza-mobile.ts, committee-cobranza-web.ts, committee-cobranza-wrapper.ts

**Pipes:** committee-cobranza-base.service.ts, committee-cobranza-detail-modal.ts, committee-cobranza-mobile.ts, committee-cobranza-web.ts, committee-cobranza-wrapper.ts

### committee.luxuryapp/directorio

**Components:** directorio.ts

**Desktop:** directorio.ts

**Mobile:** directorio.ts

**Services:** directorio.ts

**Pipes:** directorio.ts

### committee.luxuryapp/home-committee

**Components:** home-comite.ts

**Desktop:** home-comite.ts

**Mobile:** home-comite.ts

**Services:** home-comite.ts

**Pipes:** home-comite.ts

### committee.luxuryapp/interfaces

**Components:** committee-cobranza.dto.ts, committee-directorio.dto.ts

**Desktop:** committee-cobranza.dto.ts, committee-directorio.dto.ts

**Mobile:** committee-cobranza.dto.ts, committee-directorio.dto.ts

**Services:** committee-cobranza.dto.ts, committee-directorio.dto.ts

**Pipes:** committee-cobranza.dto.ts, committee-directorio.dto.ts

### committee.luxuryapp/poliza-seguro-edificio

**Components:** poliza-seguro-edificio.ts

**Desktop:** poliza-seguro-edificio.ts

**Mobile:** poliza-seguro-edificio.ts

**Services:** poliza-seguro-edificio.ts

**Pipes:** poliza-seguro-edificio.ts

### committee.luxuryapp/profile

**Components:** committee-profile.ts

**Desktop:** committee-profile.ts

**Mobile:** committee-profile.ts

**Services:** committee-profile.ts

**Pipes:** committee-profile.ts

### compras.luxuryapp/historial-compras

**Components:** historial-compras-list.ts, historial-compras-wrapper.ts

**Desktop:** historial-compras-list.ts, historial-compras-wrapper.ts

**Mobile:** historial-compras-list.ts, historial-compras-wrapper.ts

**Interfaces:** historial-compras-item.interface.ts

**Services:** historial-compras-list.ts, historial-compras-wrapper.ts

**Pipes:** historial-compras-list.ts, historial-compras-wrapper.ts

### compras.luxuryapp/solicitudes-compras

### contabilidad.luxuryapp/ar

### contabilidad.luxuryapp/budgeting

### contabilidad.luxuryapp/fondeos-y-reporteo

### contabilidad.luxuryapp/general-ledger

**Components:** contabilidad.routing.ts

**Desktop:** contabilidad.routing.ts, funding-excel-export.service.ts

**Mobile:** contabilidad.routing.ts, funding-excel-export.service.ts

**Interfaces:** presupuesto-shared.models.ts

**Services:** contabilidad.routing.ts, funding-excel-export.service.ts

**Pipes:** contabilidad.routing.ts, funding-excel-export.service.ts

### contabilidad.luxuryapp/mock-aspel

**Components:** mock-aspel-dashboard.ts, mock-aspel-poliza-form.ts, mock-aspel.routes.ts

**Desktop:** mock-aspel-dashboard.ts, mock-aspel-poliza-form.ts, mock-aspel.routes.ts

**Mobile:** mock-aspel-dashboard.ts, mock-aspel-poliza-form.ts, mock-aspel.routes.ts

**Services:** mock-aspel-dashboard.ts, mock-aspel-poliza-form.ts, mock-aspel.routes.ts

**Pipes:** mock-aspel-dashboard.ts, mock-aspel-poliza-form.ts, mock-aspel.routes.ts

### direccion.luxuryapp/home-direccion

**Components:** home-direccion.ts

**Desktop:** home-direccion.ts

**Mobile:** home-direccion.ts

**Services:** home-direccion.ts

**Pipes:** home-direccion.ts

### direccion.luxuryapp/juntas-comite

### legal.luxuryapp/asuntos-legales-y-seguros

**Interfaces:** document-type.enum.ts, documentTypeRoutesConfig.ts

### legal.luxuryapp/comite-vigilancia

**Components:** comite-vigilancia-form.ts, comite-vigilancia-list.ts, comites-list.ts

**Desktop:** comite-vigilancia-form.spec.ts, comite-vigilancia-form.ts, comite-vigilancia-list.spec.ts, comite-vigilancia-list.ts, comites-list.spec.ts, comites-list.ts

**Mobile:** comite-vigilancia-form.spec.ts, comite-vigilancia-form.ts, comite-vigilancia-list.spec.ts, comite-vigilancia-list.ts, comites-list.spec.ts, comites-list.ts

**Services:** comite-vigilancia-form.spec.ts, comite-vigilancia-form.ts, comite-vigilancia-list.spec.ts, comite-vigilancia-list.ts, comites-list.spec.ts, comites-list.ts

**Pipes:** comite-vigilancia-form.spec.ts, comite-vigilancia-form.ts, comite-vigilancia-list.spec.ts, comite-vigilancia-list.ts, comites-list.spec.ts, comites-list.ts

### legal.luxuryapp/employees-contracts

**Components:** legal-staff-board.ts

**Desktop:** legal-employee.service.ts, legal-staff-board.ts

**Mobile:** legal-employee.service.ts, legal-staff-board.ts

**Services:** legal-employee.service.ts, legal-staff-board.ts

**Pipes:** legal-employee.service.ts, legal-staff-board.ts

### mantenimiento.luxuryapp/catalogos-tickets-mantenimiento

### mantenimiento.luxuryapp/equipos-y-maquinaria

### mantenimiento.luxuryapp/fire-equipment

### mantenimiento.luxuryapp/inspection

**Desktop:** inspeccion-pdf.service.ts

**Mobile:** inspeccion-pdf.service.ts

**Services:** inspeccion-pdf.service.ts

**Pipes:** inspeccion-pdf.service.ts

### mantenimiento.luxuryapp/logs

### mantenimiento.luxuryapp/planificacin-de-mantenimiento

### mantenimiento.luxuryapp/reports-mantenance

**Components:** maintenance-reports-list.ts, menu-report-maintenance.ts

**Desktop:** maintenance-reports-list.ts, menu-report-maintenance.ts

**Mobile:** maintenance-reports-list.ts, menu-report-maintenance.ts

**Services:** maintenance-reports-list.ts, menu-report-maintenance.ts

**Pipes:** maintenance-reports-list.ts, menu-report-maintenance.ts

### operations.luxuryapp/announcements

### operations.luxuryapp/custom-documents

### operations.luxuryapp/dashboard

**Components:** container-dashboard.ts, dashboard-pending-items.ts, unified-pending-dashboard.ts

**Desktop:** container-dashboard.spec.ts, container-dashboard.ts, dashboard-pending-items.spec.ts, dashboard-pending-items.ts, unified-pending-dashboard-mobile.spec.ts, unified-pending-dashboard-mobile.ts, unified-pending-dashboard.spec.ts, unified-pending-dashboard.ts

**Mobile:** container-dashboard.spec.ts, container-dashboard.ts, dashboard-pending-items.spec.ts, dashboard-pending-items.ts, unified-pending-dashboard-mobile.spec.ts, unified-pending-dashboard-mobile.ts, unified-pending-dashboard.spec.ts, unified-pending-dashboard.ts

**Interfaces:** pending-item.dto.ts

**Services:** container-dashboard.spec.ts, container-dashboard.ts, dashboard-pending-items.spec.ts, dashboard-pending-items.ts, unified-pending-dashboard-mobile.spec.ts, unified-pending-dashboard-mobile.ts, unified-pending-dashboard.spec.ts, unified-pending-dashboard.ts

**Pipes:** container-dashboard.spec.ts, container-dashboard.ts, dashboard-pending-items.spec.ts, dashboard-pending-items.ts, unified-pending-dashboard-mobile.spec.ts, unified-pending-dashboard-mobile.ts, unified-pending-dashboard.spec.ts, unified-pending-dashboard.ts

### operations.luxuryapp/diagrams

### operations.luxuryapp/directorios

### operations.luxuryapp/field-service

### operations.luxuryapp/google-calendar

### operations.luxuryapp/incidencias-sanciones

### operations.luxuryapp/initial-implementation

**Components:** initial-implementation.routing.ts

**Desktop:** initial-implementation.routing.ts

**Mobile:** initial-implementation.routing.ts

**Services:** initial-implementation.routing.ts

**Pipes:** initial-implementation.routing.ts

### operations.luxuryapp/inspecciones-y-auditora

### operations.luxuryapp/inventarios-y-almacn

### operations.luxuryapp/manuals

### operations.luxuryapp/meetings

### operations.luxuryapp/panic-alert

**Interfaces:** panic-alert-create.dto.ts, panic-alert-real-time.dto.ts, panic-alert-resolve.dto.ts, panic-alert.dto.ts

### operations.luxuryapp/properties

### operations.luxuryapp/reclutamiento-solicitudes

### operations.luxuryapp/reports

### operations.luxuryapp/staff-board

**Components:** staff-board-list.ts

**Desktop:** staff-board-list.ts

**Mobile:** staff-board-list.ts

**Services:** staff-board-list.ts

**Pipes:** staff-board-list.ts

### operations.luxuryapp/supervision

### operations.luxuryapp/task-engine

### operations.luxuryapp/templates

**Components:** templates-form.ts, templates-list.ts

**Desktop:** templates-form.ts, templates-list.ts

**Mobile:** templates-form.ts, templates-list.ts

**Services:** templates-form.ts, templates-list.ts

**Pipes:** templates-form.ts, templates-list.ts

### operations.luxuryapp/work-position

**Components:** job-description-form.ts, work-position-details.ts, work-position-form.ts, work-position-hours.ts, work-position-list.ts

**Desktop:** job-description-form.ts, work-position-details.ts, work-position-form.ts, work-position-hours.ts, work-position-list.ts

**Mobile:** job-description-form.ts, work-position-details.ts, work-position-form.ts, work-position-hours.ts, work-position-list.ts

**Interfaces:** work-position.model.ts

**Services:** job-description-form.ts, work-position-details.ts, work-position-form.ts, work-position-hours.ts, work-position-list.ts

**Pipes:** job-description-form.ts, work-position-details.ts, work-position-form.ts, work-position-hours.ts, work-position-list.ts

### public.luxuryapp/telefonos-emergencia

**Components:** telefonos-emergencia-form.ts, telefonos-emergencia.ts

**Desktop:** telefonos-emergencia-form.ts, telefonos-emergencia.ts

**Mobile:** telefonos-emergencia-form.ts, telefonos-emergencia.ts

**Services:** telefonos-emergencia-form.ts, telefonos-emergencia.ts

**Pipes:** telefonos-emergencia-form.ts, telefonos-emergencia.ts

### reclutamiento.luxuryapp/candidate

**Components:** candidate-detail.ts, candidate-form.ts, candidate-interview-detail-modal.ts, candidate-interview-progress-tag-options.ts, candidate-list.ts, candidate-status-tag-options.ts

**Desktop:** candidate-detail.spec.ts, candidate-detail.ts, candidate-form.spec.ts, candidate-form.ts, candidate-interview-detail-modal.ts, candidate-interview-progress-tag-options.ts, candidate-list.spec.ts, candidate-list.ts, candidate-status-tag-options.ts, candidate-list-desktop.spec.ts, candidate-list-desktop.ts

**Mobile:** candidate-detail.spec.ts, candidate-detail.ts, candidate-form.spec.ts, candidate-form.ts, candidate-interview-detail-modal.ts, candidate-interview-progress-tag-options.ts, candidate-list.spec.ts, candidate-list.ts, candidate-status-tag-options.ts, candidate-list-mobile.spec.ts, candidate-list-mobile.ts

**Interfaces:** candidate-form.interface.ts, candidate.dto.ts

**Services:** candidate-detail.spec.ts, candidate-detail.ts, candidate-form.spec.ts, candidate-form.ts, candidate-interview-detail-modal.ts, candidate-interview-progress-tag-options.ts, candidate-list.spec.ts, candidate-list.ts, candidate-status-tag-options.ts

**Pipes:** candidate-detail.spec.ts, candidate-detail.ts, candidate-form.spec.ts, candidate-form.ts, candidate-interview-detail-modal.ts, candidate-interview-progress-tag-options.ts, candidate-list.spec.ts, candidate-list.ts, candidate-status-tag-options.ts

### reclutamiento.luxuryapp/candidate-application

**Components:** candidate-application-form.ts, candidate-application-kpis.ts, candidate-application-list.ts, candidate-hiring-documents-modal.ts, candidate-process-hiring-modal.ts

**Desktop:** candidate-application-form.ts, candidate-application-kpis.ts, candidate-application-list.ts, candidate-hiring-documents-modal.ts, candidate-process-hiring-modal.ts, candidate-application-list-desktop.ts

**Mobile:** candidate-application-form.ts, candidate-application-kpis.ts, candidate-application-list.ts, candidate-hiring-documents-modal.ts, candidate-process-hiring-modal.ts, candidate-application-list-mobile.ts

**Interfaces:** candidate-application.ts, candidate-hiring-document.dto.ts, candidate-hiring-documents-dialog-data.dto.ts, candidate-process-hiring-form.interface.ts, candidate-process-hiring.dto.ts, candidate-process-kpis.dto.ts

**Services:** candidate-application-form.ts, candidate-application-kpis.ts, candidate-application-list.ts, candidate-hiring-documents-modal.ts, candidate-process-hiring-modal.ts

**Pipes:** candidate-application-form.ts, candidate-application-kpis.ts, candidate-application-list.ts, candidate-hiring-documents-modal.ts, candidate-process-hiring-modal.ts

### reclutamiento.luxuryapp/candidate-applications

**Components:** candidate-application-form.ts, candidate-application-kpis.ts, candidate-application-list.ts, candidate-hiring-documents-modal.ts, candidate-process-hiring-modal.ts

**Desktop:** candidate-application-form.ts, candidate-application-kpis.ts, candidate-application-list.ts, candidate-hiring-documents-modal.ts, candidate-process-hiring-modal.ts, candidate-application-list-desktop.ts

**Mobile:** candidate-application-form.ts, candidate-application-kpis.ts, candidate-application-list.ts, candidate-hiring-documents-modal.ts, candidate-process-hiring-modal.ts, candidate-application-list-mobile.ts

**Interfaces:** candidate-application.ts, candidate-hiring-document.dto.ts, candidate-hiring-documents-dialog-data.dto.ts, candidate-process-hiring-form.interface.ts, candidate-process-hiring.dto.ts, candidate-process-kpis.dto.ts

**Services:** candidate-application-form.ts, candidate-application-kpis.ts, candidate-application-list.ts, candidate-hiring-documents-modal.ts, candidate-process-hiring-modal.ts

**Pipes:** candidate-application-form.ts, candidate-application-kpis.ts, candidate-application-list.ts, candidate-hiring-documents-modal.ts, candidate-process-hiring-modal.ts

### reclutamiento.luxuryapp/candidate-interview

**Components:** candidate-interview-feedback-form.ts, candidate-interview-pending-list.ts, candidate-interview-response.ts

**Desktop:** candidate-interview-feedback-form.spec.ts, candidate-interview-feedback-form.ts, candidate-interview-pending-list.spec.ts, candidate-interview-pending-list.ts, candidate-interview-response.spec.ts, candidate-interview-response.ts, candidate-interview-pending-desktop.ts

**Mobile:** candidate-interview-feedback-form.spec.ts, candidate-interview-feedback-form.ts, candidate-interview-pending-list.spec.ts, candidate-interview-pending-list.ts, candidate-interview-response.spec.ts, candidate-interview-response.ts, candidate-interview-pending-mobile.ts

**Interfaces:** candidate-interview-feedback-form-dialog-data.interface.ts, candidate-interview-feedback-target.interface.ts, candidate-interview-response.dto.ts, candidate-interview-timeline-item.interface.ts, candidate-interview.ts, interviewer-action-request.dto.ts

**Services:** candidate-interview-feedback-form.spec.ts, candidate-interview-feedback-form.ts, candidate-interview-pending-list.spec.ts, candidate-interview-pending-list.ts, candidate-interview-response.spec.ts, candidate-interview-response.ts

**Pipes:** candidate-interview-feedback-form.spec.ts, candidate-interview-feedback-form.ts, candidate-interview-pending-list.spec.ts, candidate-interview-pending-list.ts, candidate-interview-response.spec.ts, candidate-interview-response.ts

### reclutamiento.luxuryapp/candidate-interviewer-queue

**Components:** candidate-interviewer-queue.ts

**Desktop:** candidate-interviewer-queue.service.ts, candidate-interviewer-queue.spec.ts, candidate-interviewer-queue.ts

**Mobile:** candidate-interviewer-queue.service.ts, candidate-interviewer-queue.spec.ts, candidate-interviewer-queue.ts

**Interfaces:** candidate-interviewer-queue.interface.ts

**Services:** candidate-interviewer-queue.service.ts, candidate-interviewer-queue.spec.ts, candidate-interviewer-queue.ts

**Pipes:** candidate-interviewer-queue.service.ts, candidate-interviewer-queue.spec.ts, candidate-interviewer-queue.ts

### reclutamiento.luxuryapp/candidate-recruitment-interviews

**Components:** candidate-recruitment-interviews.ts, candidate-recruitment-schedule-modal.ts

**Desktop:** candidate-recruitment-interviews.interface.ts, candidate-recruitment-interviews.service.ts, candidate-recruitment-interviews.ts, candidate-recruitment-schedule-modal.ts

**Mobile:** candidate-recruitment-interviews.interface.ts, candidate-recruitment-interviews.service.ts, candidate-recruitment-interviews.ts, candidate-recruitment-schedule-modal.ts

**Services:** candidate-recruitment-interviews.interface.ts, candidate-recruitment-interviews.service.ts, candidate-recruitment-interviews.ts, candidate-recruitment-schedule-modal.ts

**Pipes:** candidate-recruitment-interviews.interface.ts, candidate-recruitment-interviews.service.ts, candidate-recruitment-interviews.ts, candidate-recruitment-schedule-modal.ts

### reclutamiento.luxuryapp/candidate-work-position-candidates

**Components:** candidate-work-position-candidates.ts

**Desktop:** candidate-work-position-candidates.ts

**Mobile:** candidate-work-position-candidates.ts

**Services:** candidate-work-position-candidates.ts

**Pipes:** candidate-work-position-candidates.ts

### reclutamiento.luxuryapp/candidates

**Components:** candidate-detail.ts, candidate-form.ts, candidate-interview-detail-modal.ts, candidate-interview-progress-tag-options.ts, candidate-list.ts, candidate-status-tag-options.ts

**Desktop:** candidate-detail.spec.ts, candidate-detail.ts, candidate-form.spec.ts, candidate-form.ts, candidate-interview-detail-modal.ts, candidate-interview-progress-tag-options.ts, candidate-list.spec.ts, candidate-list.ts, candidate-status-tag-options.ts, candidate-list-desktop.spec.ts, candidate-list-desktop.ts

**Mobile:** candidate-detail.spec.ts, candidate-detail.ts, candidate-form.spec.ts, candidate-form.ts, candidate-interview-detail-modal.ts, candidate-interview-progress-tag-options.ts, candidate-list.spec.ts, candidate-list.ts, candidate-status-tag-options.ts, candidate-list-mobile.spec.ts, candidate-list-mobile.ts

**Interfaces:** candidate-form.interface.ts, candidate.dto.ts

**Services:** candidate-detail.spec.ts, candidate-detail.ts, candidate-form.spec.ts, candidate-form.ts, candidate-interview-detail-modal.ts, candidate-interview-progress-tag-options.ts, candidate-list.spec.ts, candidate-list.ts, candidate-status-tag-options.ts

**Pipes:** candidate-detail.spec.ts, candidate-detail.ts, candidate-form.spec.ts, candidate-form.ts, candidate-interview-detail-modal.ts, candidate-interview-progress-tag-options.ts, candidate-list.spec.ts, candidate-list.ts, candidate-status-tag-options.ts

### reclutamiento.luxuryapp/employee

**Components:** employee-address-form.ts, employee-avatar-form.ts, employee-laboral-data-form.ts, employee-personal-data-form.ts, employee-principal-data-form.ts

**Desktop:** active-select-repro.spec.ts, employee-address-form.spec.ts, employee-address-form.ts, employee-avatar-form.spec.ts, employee-avatar-form.ts, employee-internal.service.ts, employee-laboral-data-form.spec.ts, employee-laboral-data-form.ts, employee-personal-data-form.spec.ts, employee-personal-data-form.ts, employee-principal-data-form.spec.ts, employee-principal-data-form.ts

**Mobile:** active-select-repro.spec.ts, employee-address-form.spec.ts, employee-address-form.ts, employee-avatar-form.spec.ts, employee-avatar-form.ts, employee-internal.service.ts, employee-laboral-data-form.spec.ts, employee-laboral-data-form.ts, employee-personal-data-form.spec.ts, employee-personal-data-form.ts, employee-principal-data-form.spec.ts, employee-principal-data-form.ts

**Interfaces:** employee-address-form.interface.ts, employee-laboral-data-form.interface.ts, employee-personal-data-form.interface.ts

**Services:** active-select-repro.spec.ts, employee-address-form.spec.ts, employee-address-form.ts, employee-avatar-form.spec.ts, employee-avatar-form.ts, employee-internal.service.ts, employee-laboral-data-form.spec.ts, employee-laboral-data-form.ts, employee-personal-data-form.spec.ts, employee-personal-data-form.ts, employee-principal-data-form.spec.ts, employee-principal-data-form.ts

**Pipes:** active-select-repro.spec.ts, employee-address-form.spec.ts, employee-address-form.ts, employee-avatar-form.spec.ts, employee-avatar-form.ts, employee-internal.service.ts, employee-laboral-data-form.spec.ts, employee-laboral-data-form.ts, employee-personal-data-form.spec.ts, employee-personal-data-form.ts, employee-principal-data-form.spec.ts, employee-principal-data-form.ts

### reclutamiento.luxuryapp/employee-bank-data

**Components:** employee-bank-data-form.ts, employee-bank-data-list.ts

**Desktop:** employee-bank-data-form.spec.ts, employee-bank-data-form.ts, employee-bank-data-list.spec.ts, employee-bank-data-list.ts

**Mobile:** employee-bank-data-form.spec.ts, employee-bank-data-form.ts, employee-bank-data-list.spec.ts, employee-bank-data-list.ts

**Interfaces:** employee-bank-data.interface.ts

**Services:** employee-bank-data-form.spec.ts, employee-bank-data-form.ts, employee-bank-data-list.spec.ts, employee-bank-data-list.ts

**Pipes:** employee-bank-data-form.spec.ts, employee-bank-data-form.ts, employee-bank-data-list.spec.ts, employee-bank-data-list.ts

### reclutamiento.luxuryapp/employee-beneficiary

**Components:** employee-beneficiary-form.ts, employee-beneficiary-list.ts

**Desktop:** employee-beneficiary-form.ts, employee-beneficiary-list.ts

**Mobile:** employee-beneficiary-form.ts, employee-beneficiary-list.ts

**Interfaces:** employee-beneficiary.interface.ts

**Services:** employee-beneficiary-form.ts, employee-beneficiary-list.ts

**Pipes:** employee-beneficiary-form.ts, employee-beneficiary-list.ts

### reclutamiento.luxuryapp/employee-clinical-data

**Components:** employee-clinical-data-form.ts, employee-clinical-data-list.ts

**Desktop:** employee-clinical-data-form.spec.ts, employee-clinical-data-form.ts, employee-clinical-data-list.spec.ts, employee-clinical-data-list.ts

**Mobile:** employee-clinical-data-form.spec.ts, employee-clinical-data-form.ts, employee-clinical-data-list.spec.ts, employee-clinical-data-list.ts

**Interfaces:** employee-clinical-data.interface.ts

**Services:** employee-clinical-data-form.spec.ts, employee-clinical-data-form.ts, employee-clinical-data-list.spec.ts, employee-clinical-data-list.ts

**Pipes:** employee-clinical-data-form.spec.ts, employee-clinical-data-form.ts, employee-clinical-data-list.spec.ts, employee-clinical-data-list.ts

### reclutamiento.luxuryapp/employee-document

**Components:** employee-document-list.ts

**Desktop:** employee-document-list.ts

**Mobile:** employee-document-list.ts

**Services:** employee-document-list.ts

**Pipes:** employee-document-list.ts

### reclutamiento.luxuryapp/employee-emergen-contact

**Components:** employee-emergency-contact-form.ts, employee-emergency-contact-list.ts

**Desktop:** employee-emergency-contact-form.spec.ts, employee-emergency-contact-form.ts, employee-emergency-contact-list.spec.ts, employee-emergency-contact-list.ts

**Mobile:** employee-emergency-contact-form.spec.ts, employee-emergency-contact-form.ts, employee-emergency-contact-list.spec.ts, employee-emergency-contact-list.ts

**Services:** employee-emergency-contact-form.spec.ts, employee-emergency-contact-form.ts, employee-emergency-contact-list.spec.ts, employee-emergency-contact-list.ts

**Pipes:** employee-emergency-contact-form.spec.ts, employee-emergency-contact-form.ts, employee-emergency-contact-list.spec.ts, employee-emergency-contact-list.ts

### reclutamiento.luxuryapp/employee-external

**Components:** employee-external-app-user.ts, employee-external-form.ts, employee-external-list.ts

**Desktop:** employee-external-app-user.ts, employee-external-form.ts, employee-external-list.ts

**Mobile:** employee-external-app-user.ts, employee-external-form.ts, employee-external-list.ts

**Services:** employee-external-app-user.ts, employee-external-form.ts, employee-external-list.ts

**Pipes:** employee-external-app-user.ts, employee-external-form.ts, employee-external-list.ts

### reclutamiento.luxuryapp/expediente-del-empleado

### reclutamiento.luxuryapp/reclutamiento-y-altas-bajas

**Components:** employee-reclutamiento.ts

**Desktop:** employee-reclutamiento.ts

**Mobile:** employee-reclutamiento.ts

**Services:** employee-reclutamiento.ts

**Pipes:** employee-reclutamiento.ts

### reclutamiento.luxuryapp/solicitud-alta

**Components:** solicitud-alta-form.ts, solicitud-alta-list.ts, solicitud-alta-status-form.ts, SolicitudAltaListItem.ts

**Desktop:** solicitud-alta-form.ts, solicitud-alta-list.ts, solicitud-alta-status-form.ts, SolicitudAltaListItem.ts

**Mobile:** solicitud-alta-form.ts, solicitud-alta-list.ts, solicitud-alta-status-form.ts, SolicitudAltaListItem.ts

**Services:** solicitud-alta-form.ts, solicitud-alta-list.ts, solicitud-alta-status-form.ts, SolicitudAltaListItem.ts

**Pipes:** solicitud-alta-form.ts, solicitud-alta-list.ts, solicitud-alta-status-form.ts, SolicitudAltaListItem.ts

### reclutamiento.luxuryapp/solicitud-altas

**Components:** solicitud-alta-form.ts, solicitud-alta-list.ts, solicitud-alta-status-form.ts, SolicitudAltaListItem.ts

**Desktop:** solicitud-alta-form.ts, solicitud-alta-list.ts, solicitud-alta-status-form.ts, SolicitudAltaListItem.ts

**Mobile:** solicitud-alta-form.ts, solicitud-alta-list.ts, solicitud-alta-status-form.ts, SolicitudAltaListItem.ts

**Services:** solicitud-alta-form.ts, solicitud-alta-list.ts, solicitud-alta-status-form.ts, SolicitudAltaListItem.ts

**Pipes:** solicitud-alta-form.ts, solicitud-alta-list.ts, solicitud-alta-status-form.ts, SolicitudAltaListItem.ts

### reclutamiento.luxuryapp/solicitud-baja

**Components:** solicitud-baja-list.ts, solicitud-baja-update-status.ts, status-request-dismissal.ts

**Desktop:** solicitud-baja-list.ts, solicitud-baja-update-status.ts, status-request-dismissal.ts

**Mobile:** solicitud-baja-list.ts, solicitud-baja-update-status.ts, status-request-dismissal.ts

**Services:** solicitud-baja-list.ts, solicitud-baja-update-status.ts, status-request-dismissal.ts

**Pipes:** solicitud-baja-list.ts, solicitud-baja-update-status.ts, status-request-dismissal.ts

### reclutamiento.luxuryapp/solicitud-bajas

**Components:** solicitud-baja-list.ts, solicitud-baja-update-status.ts, status-request-dismissal.ts

**Desktop:** solicitud-baja-list.ts, solicitud-baja-update-status.ts, status-request-dismissal.ts

**Mobile:** solicitud-baja-list.ts, solicitud-baja-update-status.ts, status-request-dismissal.ts

**Services:** solicitud-baja-list.ts, solicitud-baja-update-status.ts, status-request-dismissal.ts

**Pipes:** solicitud-baja-list.ts, solicitud-baja-update-status.ts, status-request-dismissal.ts

### reclutamiento.luxuryapp/solicitud-modificacion-sueldo

**Components:** modificacion-salario-form.ts, solicitud-modificacion-list.ts, status-request-salary-modification-form.ts, status-request-salary-modification.ts

**Desktop:** modificacion-salario-form.ts, solicitud-modificacion-list.ts, status-request-salary-modification-form.ts, status-request-salary-modification.ts

**Mobile:** modificacion-salario-form.ts, solicitud-modificacion-list.ts, status-request-salary-modification-form.ts, status-request-salary-modification.ts

**Services:** modificacion-salario-form.ts, solicitud-modificacion-list.ts, status-request-salary-modification-form.ts, status-request-salary-modification.ts

**Pipes:** modificacion-salario-form.ts, solicitud-modificacion-list.ts, status-request-salary-modification-form.ts, status-request-salary-modification.ts

### reclutamiento.luxuryapp/solicitud-modificaciones-sueldo

**Components:** modificacion-salario-form.ts, solicitud-modificacion-list.ts, status-request-salary-modification-form.ts, status-request-salary-modification.ts

**Desktop:** modificacion-salario-form.ts, solicitud-modificacion-list.ts, status-request-salary-modification-form.ts, status-request-salary-modification.ts

**Mobile:** modificacion-salario-form.ts, solicitud-modificacion-list.ts, status-request-salary-modification-form.ts, status-request-salary-modification.ts

**Services:** modificacion-salario-form.ts, solicitud-modificacion-list.ts, status-request-salary-modification-form.ts, status-request-salary-modification.ts

**Pipes:** modificacion-salario-form.ts, solicitud-modificacion-list.ts, status-request-salary-modification-form.ts, status-request-salary-modification.ts

### reclutamiento.luxuryapp/solicitud-vacante

**Components:** vacante-detail-modal.ts, vacante-form.ts, vacantes-list.ts

**Desktop:** vacante-detail-modal.ts, vacante-form.ts, vacantes-list.ts

**Mobile:** vacante-detail-modal.ts, vacante-form.ts, vacantes-list.ts

**Services:** vacante-detail-modal.ts, vacante-form.ts, vacantes-list.ts

**Pipes:** vacante-detail-modal.ts, vacante-form.ts, vacantes-list.ts

### reclutamiento.luxuryapp/solicitud-vacantes

**Components:** vacante-detail-modal.ts, vacante-form.ts, vacantes-list.ts

**Desktop:** vacante-detail-modal.ts, vacante-form.ts, vacantes-list.ts

**Mobile:** vacante-detail-modal.ts, vacante-form.ts, vacantes-list.ts

**Services:** vacante-detail-modal.ts, vacante-form.ts, vacantes-list.ts

**Pipes:** vacante-detail-modal.ts, vacante-form.ts, vacantes-list.ts

### reclutamiento.luxuryapp/work-position

### reclutamiento.luxuryapp/work-positions

### recursos-humanos.luxuryapp/chekador-empleados

**Components:** chekador-list.ts

**Desktop:** chekador-empleados.service.ts, chekador-list.ts

**Mobile:** chekador-empleados.service.ts, chekador-list.ts

**Interfaces:** chekador-empleados.models.ts

**Services:** chekador-empleados.service.ts, chekador-list.ts

**Pipes:** chekador-empleados.service.ts, chekador-list.ts

### recursos-humanos.luxuryapp/evaluaciones-de-desempeo

### recursos-humanos.luxuryapp/expediente-del-empleado

### recursos-humanos.luxuryapp/interfaces

**Components:** manual-balance-update.dto.ts

**Desktop:** approval.interface.ts, calendar-event.interface.ts, leave-request.interface.ts, manual-balance-update.dto.ts, register-past-vacation.interface.ts, vacation-balance-admin-view.interface.ts, vacation-balance.interface.ts, vacation-request.interface.ts

**Mobile:** approval.interface.ts, calendar-event.interface.ts, leave-request.interface.ts, manual-balance-update.dto.ts, register-past-vacation.interface.ts, vacation-balance-admin-view.interface.ts, vacation-balance.interface.ts, vacation-request.interface.ts

**Services:** approval.interface.ts, calendar-event.interface.ts, leave-request.interface.ts, manual-balance-update.dto.ts, register-past-vacation.interface.ts, vacation-balance-admin-view.interface.ts, vacation-balance.interface.ts, vacation-request.interface.ts

**Pipes:** approval.interface.ts, calendar-event.interface.ts, leave-request.interface.ts, manual-balance-update.dto.ts, register-past-vacation.interface.ts, vacation-balance-admin-view.interface.ts, vacation-balance.interface.ts, vacation-request.interface.ts

### recursos-humanos.luxuryapp/recursos-humanos-admin

### recursos-humanos.luxuryapp/time-off

### resident.luxuryapp/owner

**Components:** owner-form.ts, owner-list.ts

**Desktop:** owner-form.ts, owner-list.ts

**Mobile:** owner-form.ts, owner-list.ts

**Services:** owner-form.ts, owner-list.ts

**Pipes:** owner-form.ts, owner-list.ts

### resident.luxuryapp/property

**Components:** property-occupant-manager.ts, propiedades-form.ts, propiedades-list.ts

**Desktop:** property-occupant-manager.spec.ts, property-occupant-manager.ts, propiedades-form.spec.ts, propiedades-form.ts, propiedades-list.spec.ts, propiedades-list.ts

**Mobile:** property-occupant-manager.spec.ts, property-occupant-manager.ts, propiedades-form.spec.ts, propiedades-form.ts, propiedades-list.spec.ts, propiedades-list.ts

**Services:** property-occupant-manager.spec.ts, property-occupant-manager.ts, propiedades-form.spec.ts, propiedades-form.ts, propiedades-list.spec.ts, propiedades-list.ts

**Pipes:** property-occupant-manager.spec.ts, property-occupant-manager.ts, propiedades-form.spec.ts, propiedades-form.ts, propiedades-list.spec.ts, propiedades-list.ts

### supplier.luxuryapp/customer-provider

**Components:** customer-provider-form.ts, mis-proveedores-list.ts

**Desktop:** customer-provider-form.ts, mis-proveedores-list.ts

**Mobile:** customer-provider-form.ts, mis-proveedores-list.ts

**Services:** customer-provider-form.ts, mis-proveedores-list.ts

**Pipes:** customer-provider-form.ts, mis-proveedores-list.ts

### supplier.luxuryapp/lighting-inventory

**Components:** inventario-iluminacion-form.ts, inventario-iluminacion.ts

**Desktop:** inventario-iluminacion-form.ts, inventario-iluminacion.ts

**Mobile:** inventario-iluminacion-form.ts, inventario-iluminacion.ts

**Services:** inventario-iluminacion-form.ts, inventario-iluminacion.ts

**Pipes:** inventario-iluminacion-form.ts, inventario-iluminacion.ts

### supplier.luxuryapp/paint-inventory

**Components:** inventario-pintura-form.ts, inventario-pintura.ts

**Desktop:** inventario-pintura-form.ts, inventario-pintura.ts

**Mobile:** inventario-pintura-form.ts, inventario-pintura.ts

**Services:** inventario-pintura-form.ts, inventario-pintura.ts

**Pipes:** inventario-pintura-form.ts, inventario-pintura.ts

### supplier.luxuryapp/po

### supplier.luxuryapp/pr

### supplier.luxuryapp/product

**Components:** productos-form.ts, productos-list.ts, tarjeta-producto.ts

**Desktop:** productos-form.spec.ts, productos-form.ts, productos-list.spec.ts, productos-list.ts, tarjeta-producto.spec.ts, tarjeta-producto.ts

**Mobile:** productos-form.spec.ts, productos-form.ts, productos-list.spec.ts, productos-list.ts, tarjeta-producto.spec.ts, tarjeta-producto.ts

**Services:** productos-form.spec.ts, productos-form.ts, productos-list.spec.ts, productos-list.ts, tarjeta-producto.spec.ts, tarjeta-producto.ts

**Pipes:** productos-form.spec.ts, productos-form.ts, productos-list.spec.ts, productos-list.ts, tarjeta-producto.spec.ts, tarjeta-producto.ts

### supplier.luxuryapp/provider

**Components:** employee-provider-form.ts, proveedor-form.ts, provider-card.ts, provider-list.ts, provider-use.ts

**Desktop:** employee-provider-form.spec.ts, employee-provider-form.ts, proveedor-form.spec.ts, proveedor-form.ts, provider-card.spec.ts, provider-card.ts, provider-list.spec.ts, provider-list.ts, provider-use.spec.ts, provider-use.ts

**Mobile:** employee-provider-form.spec.ts, employee-provider-form.ts, proveedor-form.spec.ts, proveedor-form.ts, provider-card.spec.ts, provider-card.ts, provider-list.spec.ts, provider-list.ts, provider-use.spec.ts, provider-use.ts

**Services:** employee-provider-form.spec.ts, employee-provider-form.ts, proveedor-form.spec.ts, proveedor-form.ts, provider-card.spec.ts, provider-card.ts, provider-list.spec.ts, provider-list.ts, provider-use.spec.ts, provider-use.ts

**Pipes:** employee-provider-form.spec.ts, employee-provider-form.ts, proveedor-form.spec.ts, proveedor-form.ts, provider-card.spec.ts, provider-card.ts, provider-list.spec.ts, provider-list.ts, provider-use.spec.ts, provider-use.ts

### supplier.luxuryapp/provider-qualification

**Components:** calificacion-proveedor.ts

**Desktop:** calificacion-proveedor.ts

**Mobile:** calificacion-proveedor.ts

**Services:** calificacion-proveedor.ts

**Pipes:** calificacion-proveedor.ts

### supplier.luxuryapp/provider-support

**Components:** provider-support-form.ts, provider-support.ts

**Desktop:** provider-support-form.ts, provider-support.ts

**Mobile:** provider-support-form.ts, provider-support.ts

**Services:** provider-support-form.ts, provider-support.ts

**Pipes:** provider-support-form.ts, provider-support.ts

### supplier.luxuryapp/providers

### system.luxuryapp/configuracion-sistema

### web.luxuryapp/accounting

**Components:** accounting-page.ts

**Desktop:** accounting-page.ts

**Mobile:** accounting-page.ts

**Services:** accounting-page.ts

**Pipes:** accounting-page.ts

### web.luxuryapp/hr

**Components:** hr-page.ts

**Desktop:** hr-page.ts

**Mobile:** hr-page.ts

**Services:** hr-page.ts

**Pipes:** hr-page.ts

### web.luxuryapp/landing

**Components:** landing-page.ts

**Desktop:** landing-page.ts

**Mobile:** landing-page.ts

**Services:** landing-page.ts

**Pipes:** landing-page.ts

### web.luxuryapp/legal

**Components:** legal-page.ts

**Desktop:** legal-page.ts

**Mobile:** legal-page.ts

**Services:** legal-page.ts

**Pipes:** legal-page.ts

### web.luxuryapp/maintenance

**Components:** maintenance-page.ts, maintenance.routing.ts

**Desktop:** maintenance-page.ts, maintenance.routing.ts

**Mobile:** maintenance-page.ts, maintenance.routing.ts

**Services:** maintenance-page.ts, maintenance.routing.ts

**Pipes:** maintenance-page.ts, maintenance.routing.ts

### web.luxuryapp/operations

**Components:** operations-page.ts

**Desktop:** operations-page.ts

**Mobile:** operations-page.ts

**Services:** operations-page.ts

**Pipes:** operations-page.ts

## Recomendaciones

Se detectaron 10 violaciones de la regla 2.2.

### Acciones correctivas sugeridas

1. **Renombrar submódulos duplicados:** Cada submódulo debe tener un nombre único dentro de su módulo padre.
2. **Actualizar namespaces:** Los namespaces deben reflejar la nueva ruta física.
3. **Actualizar imports:** Revisar todos los imports en el código afectado.
4. **Actualizar rutas frontend:** Verificar rutas de módulos y componentes.
5. **Actualizar documentación:** Reflejar los cambios en README.md y documentación del módulo.

---
*Generado automaticamente por auditoria de submódulos*