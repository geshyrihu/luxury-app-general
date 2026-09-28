# Plan de Movimientos: Entities espejo de Modules

**Fecha:** 2026-09-19  
**Premisa:** `Modules/` es la estructura canonica. Cada entidad debe vivir en `Infrastructure/Data/Entities/<misma ruta relativa que Modules>/`.  
**Regla de namespace (Tech Lead):** `namespace Entities.<Module>.<Submodule>;` y un nivel mas si aplica. Prefijo `Entities.`, NO sufijo `.Entities`.  
**Alcance:** movimiento de archivos en `Entities/` + actualizacion de namespace y referencias (`using`/`GlobalUsings`/`.csproj`). Sin cambios de logica ni de EF.

## Resumen

| Metrica | Valor |
|---|---:|
| Entidades a mover | 338 |
| Configs EF que salen de Entities | 73 |
| Carpetas destino a crear | 111 |

## Movimientos por carpeta destino

| # | Modulo (top actual) | Carpeta destino (bajo Entities/) | Namespace resultante |
|---:|---|---|---|
| 1 | AccountingLuxuryApp | AccountingLuxuryApp/AccountingCatalogs/ | Entities.AccountingLuxuryApp.AccountingCatalogs |
| 11 | AccountingLuxuryApp | AccountingLuxuryApp/AccountingOnline/ | Entities.AccountingLuxuryApp.AccountingOnline |
| 2 | AccountingLuxuryApp | AccountingLuxuryApp/Budget/ | Entities.AccountingLuxuryApp.Budget |
| 4 | AccountingLuxuryApp | AccountingLuxuryApp/BudgetProposals/ | Entities.AccountingLuxuryApp.BudgetProposals |
| 8 | AccountingLuxuryApp | AccountingLuxuryApp/FinancialAccounting/ | Entities.AccountingLuxuryApp.FinancialAccounting |
| 1 | AccountingLuxuryApp | AccountingLuxuryApp/Fundings/ | Entities.AccountingLuxuryApp.Fundings |
| 1 | AdminLuxuryApp | AdminLuxuryApp/Approvals/ | Entities.AdminLuxuryApp.Approvals |
| 6 | AdminLuxuryApp | AdminLuxuryApp/Customers/Customers/ | Entities.AdminLuxuryApp.Customers.Customers |
| 2 | AdminLuxuryApp | AdminLuxuryApp/DatabaseBackup/ | Entities.AdminLuxuryApp.DatabaseBackup |
| 8 | AdminLuxuryApp | AdminLuxuryApp/SecurityPermissions/Access/ | Entities.AdminLuxuryApp.SecurityPermissions.Access |
| 2 | AdminLuxuryApp | AdminLuxuryApp/SystemAI/AiChat/ | Entities.AdminLuxuryApp.SystemAI.AiChat |
| 3 | AdminLuxuryApp | AdminLuxuryApp/SystemAuditLogs/LogApp/ | Entities.AdminLuxuryApp.SystemAuditLogs.LogApp |
| 2 | AdminLuxuryApp | AdminLuxuryApp/SystemTenant/Notification/ | Entities.AdminLuxuryApp.SystemTenant.Notification |
| 1 | CollectionsLuxuryApp | CollectionsLuxuryApp/AspelCollectionsHausLive/ | Entities.CollectionsLuxuryApp.AspelCollectionsHausLive |
| 1 | CollectionsLuxuryApp | CollectionsLuxuryApp/NativeCollections/Contracts/ExternalCompatibility/ | Entities.CollectionsLuxuryApp.NativeCollections.Contracts.ExternalCompatibility |
| 2 | CollectionsLuxuryApp | CollectionsLuxuryApp/NativeCollections/Core/Approvals/ | Entities.CollectionsLuxuryApp.NativeCollections.Core.Approvals |
| 4 | CollectionsLuxuryApp | CollectionsLuxuryApp/NativeCollections/Core/Charges/ | Entities.CollectionsLuxuryApp.NativeCollections.Core.Charges |
| 1 | CollectionsLuxuryApp | CollectionsLuxuryApp/NativeCollections/Core/ChargeTypes/ | Entities.CollectionsLuxuryApp.NativeCollections.Core.ChargeTypes |
| 3 | CollectionsLuxuryApp | CollectionsLuxuryApp/NativeCollections/Core/CollectionCases/ | Entities.CollectionsLuxuryApp.NativeCollections.Core.CollectionCases |
| 2 | CollectionsLuxuryApp | CollectionsLuxuryApp/NativeCollections/Core/Invoices/ | Entities.CollectionsLuxuryApp.NativeCollections.Core.Invoices |
| 2 | CollectionsLuxuryApp | CollectionsLuxuryApp/NativeCollections/Core/LateFees/ | Entities.CollectionsLuxuryApp.NativeCollections.Core.LateFees |
| 2 | CollectionsLuxuryApp | CollectionsLuxuryApp/NativeCollections/Core/Ledger/ | Entities.CollectionsLuxuryApp.NativeCollections.Core.Ledger |
| 1 | CollectionsLuxuryApp | CollectionsLuxuryApp/NativeCollections/Core/Notifications/ | Entities.CollectionsLuxuryApp.NativeCollections.Core.Notifications |
| 5 | CollectionsLuxuryApp | CollectionsLuxuryApp/NativeCollections/Core/Payments/ | Entities.CollectionsLuxuryApp.NativeCollections.Core.Payments |
| 1 | CollectionsLuxuryApp | CollectionsLuxuryApp/NativeCollections/Core/PeriodClosures/ | Entities.CollectionsLuxuryApp.NativeCollections.Core.PeriodClosures |
| 2 | CollectionsLuxuryApp | CollectionsLuxuryApp/NativeCollections/Core/Reconciliation/ | Entities.CollectionsLuxuryApp.NativeCollections.Core.Reconciliation |
| 1 | CollectionsLuxuryApp | CollectionsLuxuryApp/NativeCollections/Core/Templates/ | Entities.CollectionsLuxuryApp.NativeCollections.Core.Templates |
| 2 | HumanResourcesLuxuryApp | HumanResourcesLuxuryApp/EmployeeTimeClock/ | Entities.HumanResourcesLuxuryApp.EmployeeTimeClock |
| 5 | HumanResourcesLuxuryApp | HumanResourcesLuxuryApp/Evaluation/ | Entities.HumanResourcesLuxuryApp.Evaluation |
| 10 | HumanResourcesLuxuryApp | HumanResourcesLuxuryApp/Payroll/ | Entities.HumanResourcesLuxuryApp.Payroll |
| 7 | HumanResourcesLuxuryApp | HumanResourcesLuxuryApp/SalaryProjections/ | Entities.HumanResourcesLuxuryApp.SalaryProjections |
| 6 | HumanResourcesLuxuryApp | HumanResourcesLuxuryApp/TimeOff/ | Entities.HumanResourcesLuxuryApp.TimeOff |
| 7 | LegalLuxuryApp | LegalLuxuryApp/EmployeeContracts/ | Entities.LegalLuxuryApp.EmployeeContracts |
| 6 | LegalLuxuryApp | LegalLuxuryApp/Legal/ContractPolicy/ | Entities.LegalLuxuryApp.Legal.ContractPolicy |
| 2 | LegalLuxuryApp | LegalLuxuryApp/Legal/Fines/ | Entities.LegalLuxuryApp.Legal.Fines |
| 1 | MaintenanceLuxuryApp | MaintenanceLuxuryApp/BudgetMaintenance/ | Entities.MaintenanceLuxuryApp.BudgetMaintenance |
| 1 | MaintenanceLuxuryApp | MaintenanceLuxuryApp/ElevatorEmergencyCall/ | Entities.MaintenanceLuxuryApp.ElevatorEmergencyCall |
| 1 | MaintenanceLuxuryApp | MaintenanceLuxuryApp/ElevatorSpareParts/ | Entities.MaintenanceLuxuryApp.ElevatorSpareParts |
| 8 | MaintenanceLuxuryApp | MaintenanceLuxuryApp/EquipmentInspections/ | Entities.MaintenanceLuxuryApp.EquipmentInspections |
| 1 | MaintenanceLuxuryApp | MaintenanceLuxuryApp/FireExtinguisherLog/ | Entities.MaintenanceLuxuryApp.FireExtinguisherLog |
| 12 | MaintenanceLuxuryApp | MaintenanceLuxuryApp/FireInspectionPeriods/ | Entities.MaintenanceLuxuryApp.FireInspectionPeriods |
| 1 | MaintenanceLuxuryApp | MaintenanceLuxuryApp/HydrantLog/ | Entities.MaintenanceLuxuryApp.HydrantLog |
| 2 | MaintenanceLuxuryApp | MaintenanceLuxuryApp/Machinery/ | Entities.MaintenanceLuxuryApp.Machinery |
| 1 | MaintenanceLuxuryApp | MaintenanceLuxuryApp/MachineryAsset/ | Entities.MaintenanceLuxuryApp.MachineryAsset |
| 1 | MaintenanceLuxuryApp | MaintenanceLuxuryApp/MachineryDocument/ | Entities.MaintenanceLuxuryApp.MachineryDocument |
| 1 | MaintenanceLuxuryApp | MaintenanceLuxuryApp/MaintenanceCalendars/ | Entities.MaintenanceLuxuryApp.MaintenanceCalendars |
| 2 | MaintenanceLuxuryApp | MaintenanceLuxuryApp/MaintenanceLogs/ | Entities.MaintenanceLuxuryApp.MaintenanceLogs |
| 1 | MaintenanceLuxuryApp | MaintenanceLuxuryApp/ManualCallPointLog/ | Entities.MaintenanceLuxuryApp.ManualCallPointLog |
| 3 | MaintenanceLuxuryApp | MaintenanceLuxuryApp/MasterCalendarEquipments/ | Entities.MaintenanceLuxuryApp.MasterCalendarEquipments |
| 2 | MaintenanceLuxuryApp | MaintenanceLuxuryApp/Meters/ | Entities.MaintenanceLuxuryApp.Meters |
| 2 | MaintenanceLuxuryApp | MaintenanceLuxuryApp/PoolLogs/ | Entities.MaintenanceLuxuryApp.PoolLogs |
| 1 | MaintenanceLuxuryApp | MaintenanceLuxuryApp/SmokeDetectorLog/ | Entities.MaintenanceLuxuryApp.SmokeDetectorLog |
| 1 | MaintenanceLuxuryApp | MaintenanceLuxuryApp/ToolLoans/ | Entities.MaintenanceLuxuryApp.ToolLoans |
| 1 | MaintenanceLuxuryApp | MaintenanceLuxuryApp/WaterTruckReceipts/ | Entities.MaintenanceLuxuryApp.WaterTruckReceipts |
| 7 | OperationsLuxuryApp | OperationsLuxuryApp/AccessControl/ | Entities.OperationsLuxuryApp.AccessControl |
| 7 | OperationsLuxuryApp | OperationsLuxuryApp/AdministrativeIncidents/ | Entities.OperationsLuxuryApp.AdministrativeIncidents |
| 5 | OperationsLuxuryApp | OperationsLuxuryApp/Announcements/ | Entities.OperationsLuxuryApp.Announcements |
| 10 | OperationsLuxuryApp | OperationsLuxuryApp/Committee/Manuals/ | Entities.OperationsLuxuryApp.Committee.Manuals |
| 1 | OperationsLuxuryApp | OperationsLuxuryApp/Committee/VigilanceCommittees/ | Entities.OperationsLuxuryApp.Committee.VigilanceCommittees |
| 2 | OperationsLuxuryApp | OperationsLuxuryApp/CustomDocuments/ | Entities.OperationsLuxuryApp.CustomDocuments |
| 3 | OperationsLuxuryApp | OperationsLuxuryApp/DeliveryReception/ | Entities.OperationsLuxuryApp.DeliveryReception |
| 3 | OperationsLuxuryApp | OperationsLuxuryApp/Diagram/ | Entities.OperationsLuxuryApp.Diagram |
| 2 | OperationsLuxuryApp | OperationsLuxuryApp/GoogleCalendar/ | Entities.OperationsLuxuryApp.GoogleCalendar |
| 10 | OperationsLuxuryApp | OperationsLuxuryApp/Inspections/ | Entities.OperationsLuxuryApp.Inspections |
| 18 | OperationsLuxuryApp | OperationsLuxuryApp/Inventory/ | Entities.OperationsLuxuryApp.Inventory |
| 5 | OperationsLuxuryApp | OperationsLuxuryApp/MonthlyMeetings/Assemblies/ | Entities.OperationsLuxuryApp.MonthlyMeetings.Assemblies |
| 7 | OperationsLuxuryApp | OperationsLuxuryApp/MonthlyMeetings/MeetingMinutes/ | Entities.OperationsLuxuryApp.MonthlyMeetings.MeetingMinutes |
| 1 | OperationsLuxuryApp | OperationsLuxuryApp/MonthlyMeetings/Presentation/ | Entities.OperationsLuxuryApp.MonthlyMeetings.Presentation |
| 1 | OperationsLuxuryApp | OperationsLuxuryApp/MonthlyMeetings/Session/ | Entities.OperationsLuxuryApp.MonthlyMeetings.Session |
| 1 | OperationsLuxuryApp | OperationsLuxuryApp/PanicAlerts/ | Entities.OperationsLuxuryApp.PanicAlerts |
| 2 | OperationsLuxuryApp | OperationsLuxuryApp/Properties/ | Entities.OperationsLuxuryApp.Properties |
| 1 | OperationsLuxuryApp | OperationsLuxuryApp/PropertyOccupants/ | Entities.OperationsLuxuryApp.PropertyOccupants |
| 1 | OperationsLuxuryApp | OperationsLuxuryApp/ProviderQualification/ | Entities.OperationsLuxuryApp.ProviderQualification |
| 3 | OperationsLuxuryApp | OperationsLuxuryApp/Providers/ | Entities.OperationsLuxuryApp.Providers |
| 3 | OperationsLuxuryApp | OperationsLuxuryApp/ServiceOrders/ | Entities.OperationsLuxuryApp.ServiceOrders |
| 1 | OperationsLuxuryApp | OperationsLuxuryApp/Supervision/Supervision/ | Entities.OperationsLuxuryApp.Supervision.Supervision |
| 1 | OperationsLuxuryApp | OperationsLuxuryApp/Task/RecurringTaskAlerting/ | Entities.OperationsLuxuryApp.Task.RecurringTaskAlerting |
| 5 | OperationsLuxuryApp | OperationsLuxuryApp/Task/RecurringTaskCatalog/ | Entities.OperationsLuxuryApp.Task.RecurringTaskCatalog |
| 1 | OperationsLuxuryApp | OperationsLuxuryApp/Task/TaskAdditionalImages/ | Entities.OperationsLuxuryApp.Task.TaskAdditionalImages |
| 1 | OperationsLuxuryApp | OperationsLuxuryApp/Task/TaskAttachments/ | Entities.OperationsLuxuryApp.Task.TaskAttachments |
| 1 | OperationsLuxuryApp | OperationsLuxuryApp/Task/TaskChecklist/ | Entities.OperationsLuxuryApp.Task.TaskChecklist |
| 2 | OperationsLuxuryApp | OperationsLuxuryApp/Task/TaskFollowUps/ | Entities.OperationsLuxuryApp.Task.TaskFollowUps |
| 1 | OperationsLuxuryApp | OperationsLuxuryApp/Task/TaskJustifications/ | Entities.OperationsLuxuryApp.Task.TaskJustifications |
| 1 | OperationsLuxuryApp | OperationsLuxuryApp/Task/TaskMessageReads/ | Entities.OperationsLuxuryApp.Task.TaskMessageReads |
| 5 | OperationsLuxuryApp | OperationsLuxuryApp/Task/TaskRecords/ | Entities.OperationsLuxuryApp.Task.TaskRecords |
| 1 | OperationsLuxuryApp | OperationsLuxuryApp/Task/TaskResponsibles/ | Entities.OperationsLuxuryApp.Task.TaskResponsibles |
| 2 | OperationsLuxuryApp | OperationsLuxuryApp/Task/TaskWorkPlans/ | Entities.OperationsLuxuryApp.Task.TaskWorkPlans |
| 1 | OperationsLuxuryApp | OperationsLuxuryApp/Task/WorkGroupCategoriesData/ | Entities.OperationsLuxuryApp.Task.WorkGroupCategoriesData |
| 1 | OperationsLuxuryApp | OperationsLuxuryApp/Task/WorkGroupMembers/ | Entities.OperationsLuxuryApp.Task.WorkGroupMembers |
| 1 | OperationsLuxuryApp | OperationsLuxuryApp/Task/WorkGroups/ | Entities.OperationsLuxuryApp.Task.WorkGroups |
| 1 | PurchasesLuxuryApp | PurchasesLuxuryApp/PurchaseRequests/Budget/ | Entities.PurchasesLuxuryApp.PurchaseRequests.Budget |
| 2 | PurchasesLuxuryApp | PurchasesLuxuryApp/PurchaseRequests/Details/ | Entities.PurchasesLuxuryApp.PurchaseRequests.Details |
| 2 | PurchasesLuxuryApp | PurchasesLuxuryApp/PurchaseRequests/Evidence/ | Entities.PurchasesLuxuryApp.PurchaseRequests.Evidence |
| 2 | PurchasesLuxuryApp | PurchasesLuxuryApp/PurchaseRequests/Shared/ | Entities.PurchasesLuxuryApp.PurchaseRequests.Shared |
| 9 | PurchasesLuxuryApp | PurchasesLuxuryApp/Purchases/PurchaseOrders/ | Entities.PurchasesLuxuryApp.Purchases.PurchaseOrders |
| 4 | RecruitmentLuxuryApp | RecruitmentLuxuryApp/Candidates/CandidateCore/ | Entities.RecruitmentLuxuryApp.Candidates.CandidateCore |
| 1 | RecruitmentLuxuryApp | RecruitmentLuxuryApp/Candidates/CandidateProcesses/ | Entities.RecruitmentLuxuryApp.Candidates.CandidateProcesses |
| 1 | RecruitmentLuxuryApp | RecruitmentLuxuryApp/Candidates/CandidatesWorkExperience/ | Entities.RecruitmentLuxuryApp.Candidates.CandidatesWorkExperience |
| 11 | RecruitmentLuxuryApp | RecruitmentLuxuryApp/EmployeeFile/ | Entities.RecruitmentLuxuryApp.EmployeeFile |
| 1 | RecruitmentLuxuryApp | RecruitmentLuxuryApp/EmployeeOrgChart/ | Entities.RecruitmentLuxuryApp.EmployeeOrgChart |
| 1 | RecruitmentLuxuryApp | RecruitmentLuxuryApp/ExternalStaffs/ | Entities.RecruitmentLuxuryApp.ExternalStaffs |
| 1 | RecruitmentLuxuryApp | RecruitmentLuxuryApp/InterviewerMatrices/ | Entities.RecruitmentLuxuryApp.InterviewerMatrices |
| 1 | RecruitmentLuxuryApp | RecruitmentLuxuryApp/JobDescriptions/ | Entities.RecruitmentLuxuryApp.JobDescriptions |
| 1 | RecruitmentLuxuryApp | RecruitmentLuxuryApp/RecruitmentSourceCatalogs/ | Entities.RecruitmentLuxuryApp.RecruitmentSourceCatalogs |
| 1 | RecruitmentLuxuryApp | RecruitmentLuxuryApp/RequestDismissalDiscounts/ | Entities.RecruitmentLuxuryApp.RequestDismissalDiscounts |
| 4 | RecruitmentLuxuryApp | RecruitmentLuxuryApp/RequestDismissals/ | Entities.RecruitmentLuxuryApp.RequestDismissals |
| 2 | RecruitmentLuxuryApp | RecruitmentLuxuryApp/RequestEmployeeRegisters/ | Entities.RecruitmentLuxuryApp.RequestEmployeeRegisters |
| 1 | RecruitmentLuxuryApp | RecruitmentLuxuryApp/RequestPositions/ | Entities.RecruitmentLuxuryApp.RequestPositions |
| 1 | RecruitmentLuxuryApp | RecruitmentLuxuryApp/SalaryModifications/ | Entities.RecruitmentLuxuryApp.SalaryModifications |
| 3 | RecruitmentLuxuryApp | RecruitmentLuxuryApp/WorkPositions/ | Entities.RecruitmentLuxuryApp.WorkPositions |
| 3 | SharedLuxuryApp | SharedLuxuryApp/Catalogs/ | Entities.SharedLuxuryApp.Catalogs |

## Casos REVIEW (decision de hogar)

| Archivo | Namespace actual | Destino propuesto | Namespace resultante |
|---|---|---|---|
| Customer.cs | AdminLuxuryApp.GestionDeCliente.Customers.Entities | AdminLuxuryApp/Customers/Customers/ | Entities.AdminLuxuryApp.Customers.Customers |
| CustomerAddress.cs | AdminLuxuryApp.GestionDeCliente.Customers.Entities | AdminLuxuryApp/Customers/Customers/ | Entities.AdminLuxuryApp.Customers.Customers |
| CustomerEmailConfiguration.cs | AdminLuxuryApp.GestionDeCliente.Customers.Entities | AdminLuxuryApp/Customers/Customers/ | Entities.AdminLuxuryApp.Customers.Customers |
| CustomerImage.cs | AdminLuxuryApp.GestionDeCliente.Customers.Entities | AdminLuxuryApp/Customers/Customers/ | Entities.AdminLuxuryApp.Customers.Customers |
| CustomerLocation.cs | AdminLuxuryApp.GestionDeCliente.Customers.Entities | AdminLuxuryApp/Customers/Customers/ | Entities.AdminLuxuryApp.Customers.Customers |
| CustomerProvider.cs | AdminLuxuryApp.GestionDeCliente.Customers.Entities | AdminLuxuryApp/Customers/Customers/ | Entities.AdminLuxuryApp.Customers.Customers |

## Configs EF (salen de Entities)

| Namespace de config | # | Destino propuesto |
|---|---:|---|
| Infrastructure.Data.Configurations.AdminLuxuryApp | 9 | Infrastructure/Data/Configurations/AdminLuxuryApp |
| Infrastructure.Data.Configurations.MaintenanceLuxuryApp | 23 | Infrastructure/Data/Configurations/MaintenanceLuxuryApp |
| Infrastructure.Data.Configurations.OperationsLuxuryApp | 38 | Infrastructure/Data/Configurations/OperationsLuxuryApp |
| Infrastructure.Data.Configurations.PurchasesLuxuryApp | 2 | Infrastructure/Data/Configurations/PurchasesLuxuryApp |
| Infrastructure.Data.Configurations.RecruitmentLuxuryApp | 1 | Infrastructure/Data/Configurations/RecruitmentLuxuryApp |

## Anexo: listado por archivo

| Archivo | Top | Estado | Carpeta actual | Carpeta destino | Namespace resultante |
|---|---|---|---|---|---|
| AccountingCatalog.cs | AccountingLuxuryApp | ALIAS | AccountingLuxuryApp | AccountingLuxuryApp/AccountingCatalogs | Entities.AccountingLuxuryApp.AccountingCatalogs |
| CoiCobranzaAccount.cs | AccountingLuxuryApp | SUFFIX | AccountingLuxuryApp | AccountingLuxuryApp/AccountingOnline | Entities.AccountingLuxuryApp.AccountingOnline |
| CoiCobranzaBalance.cs | AccountingLuxuryApp | SUFFIX | AccountingLuxuryApp | AccountingLuxuryApp/AccountingOnline | Entities.AccountingLuxuryApp.AccountingOnline |
| CoiCobranzaMovement.cs | AccountingLuxuryApp | SUFFIX | AccountingLuxuryApp | AccountingLuxuryApp/AccountingOnline | Entities.AccountingLuxuryApp.AccountingOnline |
| CoiCobranzaPolicy.cs | AccountingLuxuryApp | SUFFIX | AccountingLuxuryApp | AccountingLuxuryApp/AccountingOnline | Entities.AccountingLuxuryApp.AccountingOnline |
| CoiFiscalPeriod.cs | AccountingLuxuryApp | SUFFIX | AccountingLuxuryApp | AccountingLuxuryApp/AccountingOnline | Entities.AccountingLuxuryApp.AccountingOnline |
| ContabilidadAuxiliar.cs | AccountingLuxuryApp | SUFFIX | AccountingLuxuryApp | AccountingLuxuryApp/AccountingOnline | Entities.AccountingLuxuryApp.AccountingOnline |
| ContabilidadCuenta.cs | AccountingLuxuryApp | SUFFIX | AccountingLuxuryApp | AccountingLuxuryApp/AccountingOnline | Entities.AccountingLuxuryApp.AccountingOnline |
| ContabilidadFiscalPeriod.cs | AccountingLuxuryApp | SUFFIX | AccountingLuxuryApp | AccountingLuxuryApp/AccountingOnline | Entities.AccountingLuxuryApp.AccountingOnline |
| ContabilidadPoliza.cs | AccountingLuxuryApp | SUFFIX | AccountingLuxuryApp | AccountingLuxuryApp/AccountingOnline | Entities.AccountingLuxuryApp.AccountingOnline |
| ContabilidadPresupuesto.cs | AccountingLuxuryApp | SUFFIX | AccountingLuxuryApp | AccountingLuxuryApp/AccountingOnline | Entities.AccountingLuxuryApp.AccountingOnline |
| ContabilidadSaldo.cs | AccountingLuxuryApp | SUFFIX | AccountingLuxuryApp | AccountingLuxuryApp/AccountingOnline | Entities.AccountingLuxuryApp.AccountingOnline |
| BudgetAccountRule.cs | AccountingLuxuryApp | SUFFIX | AccountingLuxuryApp | AccountingLuxuryApp/Budget | Entities.AccountingLuxuryApp.Budget |
| BudgetExecution.cs | AccountingLuxuryApp | SUFFIX | AccountingLuxuryApp | AccountingLuxuryApp/Budget | Entities.AccountingLuxuryApp.Budget |
| BudgetProposal.cs | AccountingLuxuryApp | SUFFIX | AccountingLuxuryApp | AccountingLuxuryApp/BudgetProposals | Entities.AccountingLuxuryApp.BudgetProposals |
| BudgetProposalItem.cs | AccountingLuxuryApp | SUFFIX | AccountingLuxuryApp | AccountingLuxuryApp/BudgetProposals | Entities.AccountingLuxuryApp.BudgetProposals |
| BudgetProposalItemHistory.cs | AccountingLuxuryApp | SUFFIX | AccountingLuxuryApp | AccountingLuxuryApp/BudgetProposals | Entities.AccountingLuxuryApp.BudgetProposals |
| BudgetProposalItemSupportFile.cs | AccountingLuxuryApp | SUFFIX | AccountingLuxuryApp | AccountingLuxuryApp/BudgetProposals | Entities.AccountingLuxuryApp.BudgetProposals |
| EstadoFinanciero.cs | AccountingLuxuryApp | SUFFIX | AccountingLuxuryApp | AccountingLuxuryApp/FinancialAccounting | Entities.AccountingLuxuryApp.FinancialAccounting |
| FinancialApprovalRequest.cs | AccountingLuxuryApp | SUFFIX | AccountingLuxuryApp | AccountingLuxuryApp/FinancialAccounting | Entities.AccountingLuxuryApp.FinancialAccounting |
| FinancialAuditLog.cs | AccountingLuxuryApp | SUFFIX | AccountingLuxuryApp | AccountingLuxuryApp/FinancialAccounting | Entities.AccountingLuxuryApp.FinancialAccounting |
| FinancialBatch.cs | AccountingLuxuryApp | SUFFIX | AccountingLuxuryApp | AccountingLuxuryApp/FinancialAccounting | Entities.AccountingLuxuryApp.FinancialAccounting |
| FinancialLedgerEntry.cs | AccountingLuxuryApp | SUFFIX | AccountingLuxuryApp | AccountingLuxuryApp/FinancialAccounting | Entities.AccountingLuxuryApp.FinancialAccounting |
| FinancialReport.cs | AccountingLuxuryApp | SUFFIX | AccountingLuxuryApp | AccountingLuxuryApp/FinancialAccounting | Entities.AccountingLuxuryApp.FinancialAccounting |
| FinancialReportRow.cs | AccountingLuxuryApp | SUFFIX | AccountingLuxuryApp | AccountingLuxuryApp/FinancialAccounting | Entities.AccountingLuxuryApp.FinancialAccounting |
| FinancialReportRowSource.cs | AccountingLuxuryApp | SUFFIX | AccountingLuxuryApp | AccountingLuxuryApp/FinancialAccounting | Entities.AccountingLuxuryApp.FinancialAccounting |
| Funding.cs | AccountingLuxuryApp | SUFFIX | AccountingLuxuryApp | AccountingLuxuryApp/Fundings | Entities.AccountingLuxuryApp.Fundings |
| ApprovalRoleHierarchy.cs | AdminLuxuryApp | SUFFIX | AdminLuxuryApp | AdminLuxuryApp/Approvals | Entities.AdminLuxuryApp.Approvals |
| Customer.cs | AdminLuxuryApp | REVIEW | AdminLuxuryApp | AdminLuxuryApp/Customers/Customers | Entities.AdminLuxuryApp.Customers.Customers |
| CustomerAddress.cs | AdminLuxuryApp | REVIEW | AdminLuxuryApp | AdminLuxuryApp/Customers/Customers | Entities.AdminLuxuryApp.Customers.Customers |
| CustomerEmailConfiguration.cs | AdminLuxuryApp | REVIEW | AdminLuxuryApp | AdminLuxuryApp/Customers/Customers | Entities.AdminLuxuryApp.Customers.Customers |
| CustomerImage.cs | AdminLuxuryApp | REVIEW | AdminLuxuryApp | AdminLuxuryApp/Customers/Customers | Entities.AdminLuxuryApp.Customers.Customers |
| CustomerLocation.cs | AdminLuxuryApp | REVIEW | AdminLuxuryApp | AdminLuxuryApp/Customers/Customers | Entities.AdminLuxuryApp.Customers.Customers |
| CustomerProvider.cs | AdminLuxuryApp | REVIEW | AdminLuxuryApp | AdminLuxuryApp/Customers/Customers | Entities.AdminLuxuryApp.Customers.Customers |
| DatabaseBackupConfig.cs | AdminLuxuryApp | SUFFIX | AdminLuxuryApp | AdminLuxuryApp/DatabaseBackup | Entities.AdminLuxuryApp.DatabaseBackup |
| DatabaseBackupHistory.cs | AdminLuxuryApp | SUFFIX | AdminLuxuryApp | AdminLuxuryApp/DatabaseBackup | Entities.AdminLuxuryApp.DatabaseBackup |
| ApplicationRole.cs | AdminLuxuryApp | SUFFIX | AdminLuxuryApp | AdminLuxuryApp/SecurityPermissions/Access | Entities.AdminLuxuryApp.SecurityPermissions.Access |
| ApplicationUser.cs | AdminLuxuryApp | SUFFIX | AdminLuxuryApp | AdminLuxuryApp/SecurityPermissions/Access | Entities.AdminLuxuryApp.SecurityPermissions.Access |
| CustomerModul.cs | AdminLuxuryApp | SUFFIX | AdminLuxuryApp | AdminLuxuryApp/SecurityPermissions/Access | Entities.AdminLuxuryApp.SecurityPermissions.Access |
| CustomerUser.cs | AdminLuxuryApp | SUFFIX | AdminLuxuryApp | AdminLuxuryApp/SecurityPermissions/Access | Entities.AdminLuxuryApp.SecurityPermissions.Access |
| ModuleApp.cs | AdminLuxuryApp | SUFFIX | AdminLuxuryApp | AdminLuxuryApp/SecurityPermissions/Access | Entities.AdminLuxuryApp.SecurityPermissions.Access |
| ModuleAppRol.cs | AdminLuxuryApp | SUFFIX | AdminLuxuryApp | AdminLuxuryApp/SecurityPermissions/Access | Entities.AdminLuxuryApp.SecurityPermissions.Access |
| PasswordRecoveryCode.cs | AdminLuxuryApp | SUFFIX | AdminLuxuryApp | AdminLuxuryApp/SecurityPermissions/Access | Entities.AdminLuxuryApp.SecurityPermissions.Access |
| UserRefreshToken.cs | AdminLuxuryApp | SUFFIX | AdminLuxuryApp | AdminLuxuryApp/SecurityPermissions/Access | Entities.AdminLuxuryApp.SecurityPermissions.Access |
| AiChatMessage.cs | AdminLuxuryApp | SUFFIX | AdminLuxuryApp | AdminLuxuryApp/SystemAI/AiChat | Entities.AdminLuxuryApp.SystemAI.AiChat |
| AiChatSession.cs | AdminLuxuryApp | SUFFIX | AdminLuxuryApp | AdminLuxuryApp/SystemAI/AiChat | Entities.AdminLuxuryApp.SystemAI.AiChat |
| AuditEntry.cs | AdminLuxuryApp | SUFFIX | AdminLuxuryApp | AdminLuxuryApp/SystemAuditLogs/LogApp | Entities.AdminLuxuryApp.SystemAuditLogs.LogApp |
| LegacyIdMap.cs | AdminLuxuryApp | SUFFIX | AdminLuxuryApp | AdminLuxuryApp/SystemAuditLogs/LogApp | Entities.AdminLuxuryApp.SystemAuditLogs.LogApp |
| MigrationVerificationLog.cs | AdminLuxuryApp | SUFFIX | AdminLuxuryApp | AdminLuxuryApp/SystemAuditLogs/LogApp | Entities.AdminLuxuryApp.SystemAuditLogs.LogApp |
| NotificationLog.cs | AdminLuxuryApp | SUFFIX | AdminLuxuryApp | AdminLuxuryApp/SystemTenant/Notification | Entities.AdminLuxuryApp.SystemTenant.Notification |
| NotificationUser.cs | AdminLuxuryApp | SUFFIX | AdminLuxuryApp | AdminLuxuryApp/SystemTenant/Notification | Entities.AdminLuxuryApp.SystemTenant.Notification |
| AiChatMessageConfiguration.cs | AdminLuxuryApp | CONFIG | AdminLuxuryApp | Infrastructure/Data/Configurations/AdminLuxuryApp | Infrastructure.Data.Configurations.AdminLuxuryApp |
| AiChatSessionConfiguration.cs | AdminLuxuryApp | CONFIG | AdminLuxuryApp | Infrastructure/Data/Configurations/AdminLuxuryApp | Infrastructure.Data.Configurations.AdminLuxuryApp |
| CustomerModulConfiguration.cs | AdminLuxuryApp | CONFIG | AdminLuxuryApp | Infrastructure/Data/Configurations/AdminLuxuryApp | Infrastructure.Data.Configurations.AdminLuxuryApp |
| CustomerUserConfiguration.cs | AdminLuxuryApp | CONFIG | AdminLuxuryApp | Infrastructure/Data/Configurations/AdminLuxuryApp | Infrastructure.Data.Configurations.AdminLuxuryApp |
| DatabaseBackupConfigConfiguration.cs | AdminLuxuryApp | CONFIG | AdminLuxuryApp | Infrastructure/Data/Configurations/AdminLuxuryApp | Infrastructure.Data.Configurations.AdminLuxuryApp |
| DatabaseBackupHistoryConfiguration.cs | AdminLuxuryApp | CONFIG | AdminLuxuryApp | Infrastructure/Data/Configurations/AdminLuxuryApp | Infrastructure.Data.Configurations.AdminLuxuryApp |
| ModuleAppConfiguration.cs | AdminLuxuryApp | CONFIG | AdminLuxuryApp | Infrastructure/Data/Configurations/AdminLuxuryApp | Infrastructure.Data.Configurations.AdminLuxuryApp |
| ModuleAppRolConfiguration.cs | AdminLuxuryApp | CONFIG | AdminLuxuryApp | Infrastructure/Data/Configurations/AdminLuxuryApp | Infrastructure.Data.Configurations.AdminLuxuryApp |
| UserRefreshTokenConfiguration.cs | AdminLuxuryApp | CONFIG | AdminLuxuryApp | Infrastructure/Data/Configurations/AdminLuxuryApp | Infrastructure.Data.Configurations.AdminLuxuryApp |
| AspelCustomerEmpresa.cs | CollectionsLuxuryApp | SUFFIX | CollectionsLuxuryApp | CollectionsLuxuryApp/AspelCollectionsHausLive | Entities.CollectionsLuxuryApp.AspelCollectionsHausLive |
| BillingConfig.cs | CollectionsLuxuryApp | SUFFIX | CollectionsLuxuryApp | CollectionsLuxuryApp/NativeCollections/Contracts/ExternalCompatibility | Entities.CollectionsLuxuryApp.NativeCollections.Contracts.ExternalCompatibility |
| AdjustmentRecord.cs | CollectionsLuxuryApp | SUFFIX | CollectionsLuxuryApp | CollectionsLuxuryApp/NativeCollections/Core/Approvals | Entities.CollectionsLuxuryApp.NativeCollections.Core.Approvals |
| CreditNote.cs | CollectionsLuxuryApp | SUFFIX | CollectionsLuxuryApp | CollectionsLuxuryApp/NativeCollections/Core/Approvals | Entities.CollectionsLuxuryApp.NativeCollections.Core.Approvals |
| Charge.cs | CollectionsLuxuryApp | SUFFIX | CollectionsLuxuryApp | CollectionsLuxuryApp/NativeCollections/Core/Charges | Entities.CollectionsLuxuryApp.NativeCollections.Core.Charges |
| ChargePaymentAllocation.cs | CollectionsLuxuryApp | SUFFIX | CollectionsLuxuryApp | CollectionsLuxuryApp/NativeCollections/Core/Charges | Entities.CollectionsLuxuryApp.NativeCollections.Core.Charges |
| FixedExpenseCatalog.cs | CollectionsLuxuryApp | SUFFIX | CollectionsLuxuryApp | CollectionsLuxuryApp/NativeCollections/Core/Charges | Entities.CollectionsLuxuryApp.NativeCollections.Core.Charges |
| FixedExpenseCatalogDetail.cs | CollectionsLuxuryApp | SUFFIX | CollectionsLuxuryApp | CollectionsLuxuryApp/NativeCollections/Core/Charges | Entities.CollectionsLuxuryApp.NativeCollections.Core.Charges |
| ChargeTypeCatalog.cs | CollectionsLuxuryApp | SUFFIX | CollectionsLuxuryApp | CollectionsLuxuryApp/NativeCollections/Core/ChargeTypes | Entities.CollectionsLuxuryApp.NativeCollections.Core.ChargeTypes |
| CollectionActivity.cs | CollectionsLuxuryApp | SUFFIX | CollectionsLuxuryApp | CollectionsLuxuryApp/NativeCollections/Core/CollectionCases | Entities.CollectionsLuxuryApp.NativeCollections.Core.CollectionCases |
| CollectionCase.cs | CollectionsLuxuryApp | SUFFIX | CollectionsLuxuryApp | CollectionsLuxuryApp/NativeCollections/Core/CollectionCases | Entities.CollectionsLuxuryApp.NativeCollections.Core.CollectionCases |
| CollectionCaseCharge.cs | CollectionsLuxuryApp | SUFFIX | CollectionsLuxuryApp | CollectionsLuxuryApp/NativeCollections/Core/CollectionCases | Entities.CollectionsLuxuryApp.NativeCollections.Core.CollectionCases |
| Invoice.cs | CollectionsLuxuryApp | SUFFIX | CollectionsLuxuryApp | CollectionsLuxuryApp/NativeCollections/Core/Invoices | Entities.CollectionsLuxuryApp.NativeCollections.Core.Invoices |
| UsoCFDI.cs | CollectionsLuxuryApp | SUFFIX | CollectionsLuxuryApp | CollectionsLuxuryApp/NativeCollections/Core/Invoices | Entities.CollectionsLuxuryApp.NativeCollections.Core.Invoices |
| LateFeePolicy.cs | CollectionsLuxuryApp | SUFFIX | CollectionsLuxuryApp | CollectionsLuxuryApp/NativeCollections/Core/LateFees | Entities.CollectionsLuxuryApp.NativeCollections.Core.LateFees |
| MorosidadPolicy.cs | CollectionsLuxuryApp | SUFFIX | CollectionsLuxuryApp | CollectionsLuxuryApp/NativeCollections/Core/LateFees | Entities.CollectionsLuxuryApp.NativeCollections.Core.LateFees |
| CobranzaPoliza.cs | CollectionsLuxuryApp | SUFFIX | CollectionsLuxuryApp | CollectionsLuxuryApp/NativeCollections/Core/Ledger | Entities.CollectionsLuxuryApp.NativeCollections.Core.Ledger |
| CobranzaSaldo.cs | CollectionsLuxuryApp | SUFFIX | CollectionsLuxuryApp | CollectionsLuxuryApp/NativeCollections/Core/Ledger | Entities.CollectionsLuxuryApp.NativeCollections.Core.Ledger |
| NativeCollectionNotificationSetting.cs | CollectionsLuxuryApp | SUFFIX | CollectionsLuxuryApp | CollectionsLuxuryApp/NativeCollections/Core/Notifications | Entities.CollectionsLuxuryApp.NativeCollections.Core.Notifications |
| Bank.cs | CollectionsLuxuryApp | ALIAS | CollectionsLuxuryApp | CollectionsLuxuryApp/NativeCollections/Core/Payments | Entities.CollectionsLuxuryApp.NativeCollections.Core.Payments |
| CobranzaCuenta.cs | CollectionsLuxuryApp | ALIAS | CollectionsLuxuryApp | CollectionsLuxuryApp/NativeCollections/Core/Payments | Entities.CollectionsLuxuryApp.NativeCollections.Core.Payments |
| CobranzaPayment.cs | CollectionsLuxuryApp | ALIAS | CollectionsLuxuryApp | CollectionsLuxuryApp/NativeCollections/Core/Payments | Entities.CollectionsLuxuryApp.NativeCollections.Core.Payments |
| FormaPago.cs | CollectionsLuxuryApp | ALIAS | CollectionsLuxuryApp | CollectionsLuxuryApp/NativeCollections/Core/Payments | Entities.CollectionsLuxuryApp.NativeCollections.Core.Payments |
| MetodoDePago.cs | CollectionsLuxuryApp | ALIAS | CollectionsLuxuryApp | CollectionsLuxuryApp/NativeCollections/Core/Payments | Entities.CollectionsLuxuryApp.NativeCollections.Core.Payments |
| CollectionPeriodClosure.cs | CollectionsLuxuryApp | SUFFIX | CollectionsLuxuryApp | CollectionsLuxuryApp/NativeCollections/Core/PeriodClosures | Entities.CollectionsLuxuryApp.NativeCollections.Core.PeriodClosures |
| CobranzaAuxiliar.cs | CollectionsLuxuryApp | SUFFIX | CollectionsLuxuryApp | CollectionsLuxuryApp/NativeCollections/Core/Reconciliation | Entities.CollectionsLuxuryApp.NativeCollections.Core.Reconciliation |
| CobranzaExcludedAccount.cs | CollectionsLuxuryApp | SUFFIX | CollectionsLuxuryApp | CollectionsLuxuryApp/NativeCollections/Core/Reconciliation | Entities.CollectionsLuxuryApp.NativeCollections.Core.Reconciliation |
| ChargeTemplate.cs | CollectionsLuxuryApp | SUFFIX | CollectionsLuxuryApp | CollectionsLuxuryApp/NativeCollections/Core/Templates | Entities.CollectionsLuxuryApp.NativeCollections.Core.Templates |
| TimeClockLocation.cs | HumanResourcesLuxuryApp | SUFFIX | HumanResourcesLuxuryApp | HumanResourcesLuxuryApp/EmployeeTimeClock | Entities.HumanResourcesLuxuryApp.EmployeeTimeClock |
| TimeClockRecord.cs | HumanResourcesLuxuryApp | SUFFIX | HumanResourcesLuxuryApp | HumanResourcesLuxuryApp/EmployeeTimeClock | Entities.HumanResourcesLuxuryApp.EmployeeTimeClock |
| EvaluationAnswer.cs | HumanResourcesLuxuryApp | SUFFIX | HumanResourcesLuxuryApp | HumanResourcesLuxuryApp/Evaluation | Entities.HumanResourcesLuxuryApp.Evaluation |
| PerformanceEvaluation.cs | HumanResourcesLuxuryApp | SUFFIX | HumanResourcesLuxuryApp | HumanResourcesLuxuryApp/Evaluation | Entities.HumanResourcesLuxuryApp.Evaluation |
| TemplateCategory.cs | HumanResourcesLuxuryApp | SUFFIX | HumanResourcesLuxuryApp | HumanResourcesLuxuryApp/Evaluation | Entities.HumanResourcesLuxuryApp.Evaluation |
| TemplateEvaluation.cs | HumanResourcesLuxuryApp | SUFFIX | HumanResourcesLuxuryApp | HumanResourcesLuxuryApp/Evaluation | Entities.HumanResourcesLuxuryApp.Evaluation |
| TemplateQuestion.cs | HumanResourcesLuxuryApp | SUFFIX | HumanResourcesLuxuryApp | HumanResourcesLuxuryApp/Evaluation | Entities.HumanResourcesLuxuryApp.Evaluation |
| ConfiguracionNomina.cs | HumanResourcesLuxuryApp | SUFFIX | HumanResourcesLuxuryApp | HumanResourcesLuxuryApp/Payroll | Entities.HumanResourcesLuxuryApp.Payroll |
| DiasNoHabiles.cs | HumanResourcesLuxuryApp | SUFFIX | HumanResourcesLuxuryApp | HumanResourcesLuxuryApp/Payroll | Entities.HumanResourcesLuxuryApp.Payroll |
| IncidenciaNomina.cs | HumanResourcesLuxuryApp | SUFFIX | HumanResourcesLuxuryApp | HumanResourcesLuxuryApp/Payroll | Entities.HumanResourcesLuxuryApp.Payroll |
| NominaDetalle.cs | HumanResourcesLuxuryApp | SUFFIX | HumanResourcesLuxuryApp | HumanResourcesLuxuryApp/Payroll | Entities.HumanResourcesLuxuryApp.Payroll |
| NominaEncabezado.cs | HumanResourcesLuxuryApp | SUFFIX | HumanResourcesLuxuryApp | HumanResourcesLuxuryApp/Payroll | Entities.HumanResourcesLuxuryApp.Payroll |
| PagoPrestamoNomina.cs | HumanResourcesLuxuryApp | SUFFIX | HumanResourcesLuxuryApp | HumanResourcesLuxuryApp/Payroll | Entities.HumanResourcesLuxuryApp.Payroll |
| PayrollEvidence.cs | HumanResourcesLuxuryApp | SUFFIX | HumanResourcesLuxuryApp | HumanResourcesLuxuryApp/Payroll | Entities.HumanResourcesLuxuryApp.Payroll |
| PeriodoNomina.cs | HumanResourcesLuxuryApp | SUFFIX | HumanResourcesLuxuryApp | HumanResourcesLuxuryApp/Payroll | Entities.HumanResourcesLuxuryApp.Payroll |
| PrestamoEmpleado.cs | HumanResourcesLuxuryApp | SUFFIX | HumanResourcesLuxuryApp | HumanResourcesLuxuryApp/Payroll | Entities.HumanResourcesLuxuryApp.Payroll |
| TiempoExtra.cs | HumanResourcesLuxuryApp | SUFFIX | HumanResourcesLuxuryApp | HumanResourcesLuxuryApp/Payroll | Entities.HumanResourcesLuxuryApp.Payroll |
| FederalLaborLawParameter.cs | HumanResourcesLuxuryApp | SUFFIX | HumanResourcesLuxuryApp/SalaryProjections | HumanResourcesLuxuryApp/SalaryProjections | Entities.HumanResourcesLuxuryApp.SalaryProjections |
| FederalVacationParameter.cs | HumanResourcesLuxuryApp | SUFFIX | HumanResourcesLuxuryApp/SalaryProjections | HumanResourcesLuxuryApp/SalaryProjections | Entities.HumanResourcesLuxuryApp.SalaryProjections |
| SalaryProjection.cs | HumanResourcesLuxuryApp | SUFFIX | HumanResourcesLuxuryApp/SalaryProjections | HumanResourcesLuxuryApp/SalaryProjections | Entities.HumanResourcesLuxuryApp.SalaryProjections |
| SalaryProjectionBonus.cs | HumanResourcesLuxuryApp | SUFFIX | HumanResourcesLuxuryApp/SalaryProjections | HumanResourcesLuxuryApp/SalaryProjections | Entities.HumanResourcesLuxuryApp.SalaryProjections |
| SalaryProjectionItem.cs | HumanResourcesLuxuryApp | SUFFIX | HumanResourcesLuxuryApp/SalaryProjections | HumanResourcesLuxuryApp/SalaryProjections | Entities.HumanResourcesLuxuryApp.SalaryProjections |
| SalaryProjectionScenario.cs | HumanResourcesLuxuryApp | SUFFIX | HumanResourcesLuxuryApp/SalaryProjections | HumanResourcesLuxuryApp/SalaryProjections | Entities.HumanResourcesLuxuryApp.SalaryProjections |
| StateTaxParameter.cs | HumanResourcesLuxuryApp | SUFFIX | HumanResourcesLuxuryApp/SalaryProjections | HumanResourcesLuxuryApp/SalaryProjections | Entities.HumanResourcesLuxuryApp.SalaryProjections |
| LeaveRequest.cs | HumanResourcesLuxuryApp | SUFFIX | HumanResourcesLuxuryApp | HumanResourcesLuxuryApp/TimeOff | Entities.HumanResourcesLuxuryApp.TimeOff |
| LeaveRequestHistory.cs | HumanResourcesLuxuryApp | SUFFIX | HumanResourcesLuxuryApp | HumanResourcesLuxuryApp/TimeOff | Entities.HumanResourcesLuxuryApp.TimeOff |
| ManualBalanceChangeLog.cs | HumanResourcesLuxuryApp | SUFFIX | HumanResourcesLuxuryApp | HumanResourcesLuxuryApp/TimeOff | Entities.HumanResourcesLuxuryApp.TimeOff |
| VacationBalance.cs | HumanResourcesLuxuryApp | SUFFIX | HumanResourcesLuxuryApp | HumanResourcesLuxuryApp/TimeOff | Entities.HumanResourcesLuxuryApp.TimeOff |
| VacationRequest.cs | HumanResourcesLuxuryApp | SUFFIX | HumanResourcesLuxuryApp | HumanResourcesLuxuryApp/TimeOff | Entities.HumanResourcesLuxuryApp.TimeOff |
| VacationRequestHistory.cs | HumanResourcesLuxuryApp | SUFFIX | HumanResourcesLuxuryApp | HumanResourcesLuxuryApp/TimeOff | Entities.HumanResourcesLuxuryApp.TimeOff |
| AddendumTemplate.cs | LegalLuxuryApp | SUFFIX | LegalLuxuryApp | LegalLuxuryApp/EmployeeContracts | Entities.LegalLuxuryApp.EmployeeContracts |
| ContractAddendum.cs | LegalLuxuryApp | SUFFIX | LegalLuxuryApp | LegalLuxuryApp/EmployeeContracts | Entities.LegalLuxuryApp.EmployeeContracts |
| ContractRenewalEnums.cs | LegalLuxuryApp | SUFFIX | LegalLuxuryApp | LegalLuxuryApp/EmployeeContracts | Entities.LegalLuxuryApp.EmployeeContracts |
| ContractRenewalEvaluation.cs | LegalLuxuryApp | SUFFIX | LegalLuxuryApp | LegalLuxuryApp/EmployeeContracts | Entities.LegalLuxuryApp.EmployeeContracts |
| ContractTemplate.cs | LegalLuxuryApp | SUFFIX | LegalLuxuryApp | LegalLuxuryApp/EmployeeContracts | Entities.LegalLuxuryApp.EmployeeContracts |
| EmployeeWorkContract.cs | LegalLuxuryApp | SUFFIX | LegalLuxuryApp | LegalLuxuryApp/EmployeeContracts | Entities.LegalLuxuryApp.EmployeeContracts |
| WorkContract.cs | LegalLuxuryApp | SUFFIX | LegalLuxuryApp | LegalLuxuryApp/EmployeeContracts | Entities.LegalLuxuryApp.EmployeeContracts |
| ContratoPoliza.cs | LegalLuxuryApp | SUFFIX | LegalLuxuryApp | LegalLuxuryApp/Legal/ContractPolicy | Entities.LegalLuxuryApp.Legal.ContractPolicy |
| LegalMatter.cs | LegalLuxuryApp | ALIAS | LegalLuxuryApp | LegalLuxuryApp/Legal/ContractPolicy | Entities.LegalLuxuryApp.Legal.ContractPolicy |
| LegalMatterCategory.cs | LegalLuxuryApp | ALIAS | LegalLuxuryApp | LegalLuxuryApp/Legal/ContractPolicy | Entities.LegalLuxuryApp.Legal.ContractPolicy |
| PolicySnapshot.cs | LegalLuxuryApp | ALIAS | LegalLuxuryApp | LegalLuxuryApp/Legal/ContractPolicy | Entities.LegalLuxuryApp.Legal.ContractPolicy |
| RegulationArticle.cs | LegalLuxuryApp | ALIAS | LegalLuxuryApp | LegalLuxuryApp/Legal/ContractPolicy | Entities.LegalLuxuryApp.Legal.ContractPolicy |
| ResponsiblePartySnapshot.cs | LegalLuxuryApp | ALIAS | LegalLuxuryApp | LegalLuxuryApp/Legal/ContractPolicy | Entities.LegalLuxuryApp.Legal.ContractPolicy |
| FineEvidence.cs | LegalLuxuryApp | SUFFIX | LegalLuxuryApp | LegalLuxuryApp/Legal/Fines | Entities.LegalLuxuryApp.Legal.Fines |
| PropertyFine.cs | LegalLuxuryApp | SUFFIX | LegalLuxuryApp | LegalLuxuryApp/Legal/Fines | Entities.LegalLuxuryApp.Legal.Fines |
| BitacoraDetectorHumoConfiguration.cs | MaintenanceLuxuryApp | CONFIG | MaintenanceLuxuryApp | Infrastructure/Data/Configurations/MaintenanceLuxuryApp | Infrastructure.Data.Configurations.MaintenanceLuxuryApp |
| BitacoraEstacionManualConfiguration.cs | MaintenanceLuxuryApp | CONFIG | MaintenanceLuxuryApp | Infrastructure/Data/Configurations/MaintenanceLuxuryApp | Infrastructure.Data.Configurations.MaintenanceLuxuryApp |
| BitacoraExtintorConfiguration.cs | MaintenanceLuxuryApp | CONFIG | MaintenanceLuxuryApp | Infrastructure/Data/Configurations/MaintenanceLuxuryApp | Infrastructure.Data.Configurations.MaintenanceLuxuryApp |
| BitacoraHidranteConfiguration.cs | MaintenanceLuxuryApp | CONFIG | MaintenanceLuxuryApp | Infrastructure/Data/Configurations/MaintenanceLuxuryApp | Infrastructure.Data.Configurations.MaintenanceLuxuryApp |
| EquipmentInspectionCriterionConfiguration.cs | MaintenanceLuxuryApp | CONFIG | MaintenanceLuxuryApp | Infrastructure/Data/Configurations/MaintenanceLuxuryApp | Infrastructure.Data.Configurations.MaintenanceLuxuryApp |
| EquipmentInspectionDefinitionAssigneeConfiguration.cs | MaintenanceLuxuryApp | CONFIG | MaintenanceLuxuryApp | Infrastructure/Data/Configurations/MaintenanceLuxuryApp | Infrastructure.Data.Configurations.MaintenanceLuxuryApp |
| EquipmentInspectionDefinitionConfiguration.cs | MaintenanceLuxuryApp | CONFIG | MaintenanceLuxuryApp | Infrastructure/Data/Configurations/MaintenanceLuxuryApp | Infrastructure.Data.Configurations.MaintenanceLuxuryApp |
| EquipmentInspectionDefinitionWeekDayConfiguration.cs | MaintenanceLuxuryApp | CONFIG | MaintenanceLuxuryApp | Infrastructure/Data/Configurations/MaintenanceLuxuryApp | Infrastructure.Data.Configurations.MaintenanceLuxuryApp |
| EquipmentInspectionExecutionConfiguration.cs | MaintenanceLuxuryApp | CONFIG | MaintenanceLuxuryApp | Infrastructure/Data/Configurations/MaintenanceLuxuryApp | Infrastructure.Data.Configurations.MaintenanceLuxuryApp |
| EquipmentInspectionExecutionImageConfiguration.cs | MaintenanceLuxuryApp | CONFIG | MaintenanceLuxuryApp | Infrastructure/Data/Configurations/MaintenanceLuxuryApp | Infrastructure.Data.Configurations.MaintenanceLuxuryApp |
| EquipmentInspectionExecutionItemConfiguration.cs | MaintenanceLuxuryApp | CONFIG | MaintenanceLuxuryApp | Infrastructure/Data/Configurations/MaintenanceLuxuryApp | Infrastructure.Data.Configurations.MaintenanceLuxuryApp |
| EquipmentQrLabelConfiguration.cs | MaintenanceLuxuryApp | CONFIG | MaintenanceLuxuryApp | Infrastructure/Data/Configurations/MaintenanceLuxuryApp | Infrastructure.Data.Configurations.MaintenanceLuxuryApp |
| FireCycleInspectionDetectorConfiguration.cs | MaintenanceLuxuryApp | CONFIG | MaintenanceLuxuryApp | Infrastructure/Data/Configurations/MaintenanceLuxuryApp | Infrastructure.Data.Configurations.MaintenanceLuxuryApp |
| FireCycleInspectionExtinguisherConfiguration.cs | MaintenanceLuxuryApp | CONFIG | MaintenanceLuxuryApp | Infrastructure/Data/Configurations/MaintenanceLuxuryApp | Infrastructure.Data.Configurations.MaintenanceLuxuryApp |
| FireCycleInspectionHydrantConfiguration.cs | MaintenanceLuxuryApp | CONFIG | MaintenanceLuxuryApp | Infrastructure/Data/Configurations/MaintenanceLuxuryApp | Infrastructure.Data.Configurations.MaintenanceLuxuryApp |
| FireCycleInspectionStationConfiguration.cs | MaintenanceLuxuryApp | CONFIG | MaintenanceLuxuryApp | Infrastructure/Data/Configurations/MaintenanceLuxuryApp | Infrastructure.Data.Configurations.MaintenanceLuxuryApp |
| FireInspectionCycleConfiguration.cs | MaintenanceLuxuryApp | CONFIG | MaintenanceLuxuryApp | Infrastructure/Data/Configurations/MaintenanceLuxuryApp | Infrastructure.Data.Configurations.MaintenanceLuxuryApp |
| FireInspectionPeriodConfiguration.cs | MaintenanceLuxuryApp | CONFIG | MaintenanceLuxuryApp | Infrastructure/Data/Configurations/MaintenanceLuxuryApp | Infrastructure.Data.Configurations.MaintenanceLuxuryApp |
| FireInspectionPeriodDetectorConfiguration.cs | MaintenanceLuxuryApp | CONFIG | MaintenanceLuxuryApp | Infrastructure/Data/Configurations/MaintenanceLuxuryApp | Infrastructure.Data.Configurations.MaintenanceLuxuryApp |
| FireInspectionPeriodExtinguisherConfiguration.cs | MaintenanceLuxuryApp | CONFIG | MaintenanceLuxuryApp | Infrastructure/Data/Configurations/MaintenanceLuxuryApp | Infrastructure.Data.Configurations.MaintenanceLuxuryApp |
| FireInspectionPeriodHydrantConfiguration.cs | MaintenanceLuxuryApp | CONFIG | MaintenanceLuxuryApp | Infrastructure/Data/Configurations/MaintenanceLuxuryApp | Infrastructure.Data.Configurations.MaintenanceLuxuryApp |
| FireInspectionPeriodStationConfiguration.cs | MaintenanceLuxuryApp | CONFIG | MaintenanceLuxuryApp | Infrastructure/Data/Configurations/MaintenanceLuxuryApp | Infrastructure.Data.Configurations.MaintenanceLuxuryApp |
| WaterTruckDeliveryConfiguration.cs | MaintenanceLuxuryApp | CONFIG | MaintenanceLuxuryApp | Infrastructure/Data/Configurations/MaintenanceLuxuryApp | Infrastructure.Data.Configurations.MaintenanceLuxuryApp |
| MaintenanceBudgetForecast.cs | MaintenanceLuxuryApp | SUFFIX | MaintenanceLuxuryApp | MaintenanceLuxuryApp/BudgetMaintenance | Entities.MaintenanceLuxuryApp.BudgetMaintenance |
| ElevatorsEmergencyCall.cs | MaintenanceLuxuryApp | SUFFIX | MaintenanceLuxuryApp | MaintenanceLuxuryApp/ElevatorEmergencyCall | Entities.MaintenanceLuxuryApp.ElevatorEmergencyCall |
| ElevatorSparePartsChange.cs | MaintenanceLuxuryApp | SUFFIX | MaintenanceLuxuryApp | MaintenanceLuxuryApp/ElevatorSpareParts | Entities.MaintenanceLuxuryApp.ElevatorSpareParts |
| EquipmentInspectionCriterion.cs | MaintenanceLuxuryApp | SUFFIX | MaintenanceLuxuryApp | MaintenanceLuxuryApp/EquipmentInspections | Entities.MaintenanceLuxuryApp.EquipmentInspections |
| EquipmentInspectionDefinition.cs | MaintenanceLuxuryApp | SUFFIX | MaintenanceLuxuryApp | MaintenanceLuxuryApp/EquipmentInspections | Entities.MaintenanceLuxuryApp.EquipmentInspections |
| EquipmentInspectionDefinitionAssignee.cs | MaintenanceLuxuryApp | SUFFIX | MaintenanceLuxuryApp | MaintenanceLuxuryApp/EquipmentInspections | Entities.MaintenanceLuxuryApp.EquipmentInspections |
| EquipmentInspectionDefinitionWeekDay.cs | MaintenanceLuxuryApp | SUFFIX | MaintenanceLuxuryApp | MaintenanceLuxuryApp/EquipmentInspections | Entities.MaintenanceLuxuryApp.EquipmentInspections |
| EquipmentInspectionExecution.cs | MaintenanceLuxuryApp | SUFFIX | MaintenanceLuxuryApp | MaintenanceLuxuryApp/EquipmentInspections | Entities.MaintenanceLuxuryApp.EquipmentInspections |
| EquipmentInspectionExecutionImage.cs | MaintenanceLuxuryApp | SUFFIX | MaintenanceLuxuryApp | MaintenanceLuxuryApp/EquipmentInspections | Entities.MaintenanceLuxuryApp.EquipmentInspections |
| EquipmentInspectionExecutionItem.cs | MaintenanceLuxuryApp | SUFFIX | MaintenanceLuxuryApp | MaintenanceLuxuryApp/EquipmentInspections | Entities.MaintenanceLuxuryApp.EquipmentInspections |
| EquipmentQrLabel.cs | MaintenanceLuxuryApp | SUFFIX | MaintenanceLuxuryApp | MaintenanceLuxuryApp/EquipmentInspections | Entities.MaintenanceLuxuryApp.EquipmentInspections |
| BitacoraExtintor.cs | MaintenanceLuxuryApp | SUFFIX | MaintenanceLuxuryApp | MaintenanceLuxuryApp/FireExtinguisherLog | Entities.MaintenanceLuxuryApp.FireExtinguisherLog |
| FireCycleInspectionBase.cs | MaintenanceLuxuryApp | SUFFIX | MaintenanceLuxuryApp | MaintenanceLuxuryApp/FireInspectionPeriods | Entities.MaintenanceLuxuryApp.FireInspectionPeriods |
| FireCycleInspectionDetector.cs | MaintenanceLuxuryApp | SUFFIX | MaintenanceLuxuryApp | MaintenanceLuxuryApp/FireInspectionPeriods | Entities.MaintenanceLuxuryApp.FireInspectionPeriods |
| FireCycleInspectionExtinguisher.cs | MaintenanceLuxuryApp | SUFFIX | MaintenanceLuxuryApp | MaintenanceLuxuryApp/FireInspectionPeriods | Entities.MaintenanceLuxuryApp.FireInspectionPeriods |
| FireCycleInspectionHydrant.cs | MaintenanceLuxuryApp | SUFFIX | MaintenanceLuxuryApp | MaintenanceLuxuryApp/FireInspectionPeriods | Entities.MaintenanceLuxuryApp.FireInspectionPeriods |
| FireCycleInspectionStation.cs | MaintenanceLuxuryApp | SUFFIX | MaintenanceLuxuryApp | MaintenanceLuxuryApp/FireInspectionPeriods | Entities.MaintenanceLuxuryApp.FireInspectionPeriods |
| FireInspectionCycle.cs | MaintenanceLuxuryApp | SUFFIX | MaintenanceLuxuryApp | MaintenanceLuxuryApp/FireInspectionPeriods | Entities.MaintenanceLuxuryApp.FireInspectionPeriods |
| FireInspectionPeriod.cs | MaintenanceLuxuryApp | SUFFIX | MaintenanceLuxuryApp | MaintenanceLuxuryApp/FireInspectionPeriods | Entities.MaintenanceLuxuryApp.FireInspectionPeriods |
| FireInspectionPeriodDetector.cs | MaintenanceLuxuryApp | SUFFIX | MaintenanceLuxuryApp | MaintenanceLuxuryApp/FireInspectionPeriods | Entities.MaintenanceLuxuryApp.FireInspectionPeriods |
| FireInspectionPeriodExtinguisher.cs | MaintenanceLuxuryApp | SUFFIX | MaintenanceLuxuryApp | MaintenanceLuxuryApp/FireInspectionPeriods | Entities.MaintenanceLuxuryApp.FireInspectionPeriods |
| FireInspectionPeriodHydrant.cs | MaintenanceLuxuryApp | SUFFIX | MaintenanceLuxuryApp | MaintenanceLuxuryApp/FireInspectionPeriods | Entities.MaintenanceLuxuryApp.FireInspectionPeriods |
| FireInspectionPeriodItemBase.cs | MaintenanceLuxuryApp | SUFFIX | MaintenanceLuxuryApp | MaintenanceLuxuryApp/FireInspectionPeriods | Entities.MaintenanceLuxuryApp.FireInspectionPeriods |
| FireInspectionPeriodStation.cs | MaintenanceLuxuryApp | SUFFIX | MaintenanceLuxuryApp | MaintenanceLuxuryApp/FireInspectionPeriods | Entities.MaintenanceLuxuryApp.FireInspectionPeriods |
| BitacoraHidrante.cs | MaintenanceLuxuryApp | SUFFIX | MaintenanceLuxuryApp | MaintenanceLuxuryApp/HydrantLog | Entities.MaintenanceLuxuryApp.HydrantLog |
| Equipment.cs | MaintenanceLuxuryApp | SUFFIX | MaintenanceLuxuryApp | MaintenanceLuxuryApp/Machinery | Entities.MaintenanceLuxuryApp.Machinery |
| EquipoClasificacion.cs | MaintenanceLuxuryApp | SUFFIX | MaintenanceLuxuryApp | MaintenanceLuxuryApp/Machinery | Entities.MaintenanceLuxuryApp.Machinery |
| CatalogAsset.cs | MaintenanceLuxuryApp | SUFFIX | MaintenanceLuxuryApp | MaintenanceLuxuryApp/MachineryAsset | Entities.MaintenanceLuxuryApp.MachineryAsset |
| EquipmentDocument.cs | MaintenanceLuxuryApp | SUFFIX | MaintenanceLuxuryApp | MaintenanceLuxuryApp/MachineryDocument | Entities.MaintenanceLuxuryApp.MachineryDocument |
| MaintenanceCalendar.cs | MaintenanceLuxuryApp | SUFFIX | MaintenanceLuxuryApp | MaintenanceLuxuryApp/MaintenanceCalendars | Entities.MaintenanceLuxuryApp.MaintenanceCalendars |
| BitacoraEquipoBase.cs | MaintenanceLuxuryApp | SUFFIX | MaintenanceLuxuryApp | MaintenanceLuxuryApp/MaintenanceLogs | Entities.MaintenanceLuxuryApp.MaintenanceLogs |
| MaintenanceLog.cs | MaintenanceLuxuryApp | SUFFIX | MaintenanceLuxuryApp | MaintenanceLuxuryApp/MaintenanceLogs | Entities.MaintenanceLuxuryApp.MaintenanceLogs |
| BitacoraEstacionManual.cs | MaintenanceLuxuryApp | SUFFIX | MaintenanceLuxuryApp | MaintenanceLuxuryApp/ManualCallPointLog | Entities.MaintenanceLuxuryApp.ManualCallPointLog |
| MasterCalendar.cs | MaintenanceLuxuryApp | SUFFIX | MaintenanceLuxuryApp | MaintenanceLuxuryApp/MasterCalendarEquipments | Entities.MaintenanceLuxuryApp.MasterCalendarEquipments |
| MasterCalendarEquipment.cs | MaintenanceLuxuryApp | SUFFIX | MaintenanceLuxuryApp | MaintenanceLuxuryApp/MasterCalendarEquipments | Entities.MaintenanceLuxuryApp.MasterCalendarEquipments |
| MasterCalendarProvider.cs | MaintenanceLuxuryApp | SUFFIX | MaintenanceLuxuryApp | MaintenanceLuxuryApp/MasterCalendarEquipments | Entities.MaintenanceLuxuryApp.MasterCalendarEquipments |
| Meter.cs | MaintenanceLuxuryApp | SUFFIX | MaintenanceLuxuryApp | MaintenanceLuxuryApp/Meters | Entities.MaintenanceLuxuryApp.Meters |
| MeterReading.cs | MaintenanceLuxuryApp | SUFFIX | MaintenanceLuxuryApp | MaintenanceLuxuryApp/Meters | Entities.MaintenanceLuxuryApp.Meters |
| Pool.cs | MaintenanceLuxuryApp | SUFFIX | MaintenanceLuxuryApp | MaintenanceLuxuryApp/PoolLogs | Entities.MaintenanceLuxuryApp.PoolLogs |
| PoolLog.cs | MaintenanceLuxuryApp | SUFFIX | MaintenanceLuxuryApp | MaintenanceLuxuryApp/PoolLogs | Entities.MaintenanceLuxuryApp.PoolLogs |
| BitacoraDetectorHumo.cs | MaintenanceLuxuryApp | SUFFIX | MaintenanceLuxuryApp | MaintenanceLuxuryApp/SmokeDetectorLog | Entities.MaintenanceLuxuryApp.SmokeDetectorLog |
| ToolLoan.cs | MaintenanceLuxuryApp | ALIAS | MaintenanceLuxuryApp | MaintenanceLuxuryApp/ToolLoans | Entities.MaintenanceLuxuryApp.ToolLoans |
| WaterTruckDelivery.cs | MaintenanceLuxuryApp | SUFFIX | MaintenanceLuxuryApp | MaintenanceLuxuryApp/WaterTruckReceipts | Entities.MaintenanceLuxuryApp.WaterTruckReceipts |
| AsambleaChecklistExecutionConfiguration.cs | OperationsLuxuryApp | CONFIG | OperationsLuxuryApp | Infrastructure/Data/Configurations/OperationsLuxuryApp | Infrastructure.Data.Configurations.OperationsLuxuryApp |
| AsambleaChecklistTemplateConfiguration.cs | OperationsLuxuryApp | CONFIG | OperationsLuxuryApp | Infrastructure/Data/Configurations/OperationsLuxuryApp | Infrastructure.Data.Configurations.OperationsLuxuryApp |
| AsambleaInvitadoConfiguration.cs | OperationsLuxuryApp | CONFIG | OperationsLuxuryApp | Infrastructure/Data/Configurations/OperationsLuxuryApp | Infrastructure.Data.Configurations.OperationsLuxuryApp |
| AsambleaPlanConfiguration.cs | OperationsLuxuryApp | CONFIG | OperationsLuxuryApp | Infrastructure/Data/Configurations/OperationsLuxuryApp | Infrastructure.Data.Configurations.OperationsLuxuryApp |
| AssemblySupportRequestConfiguration.cs | OperationsLuxuryApp | CONFIG | OperationsLuxuryApp | Infrastructure/Data/Configurations/OperationsLuxuryApp | Infrastructure.Data.Configurations.OperationsLuxuryApp |
| CustomerInspectionConfiguration.cs | OperationsLuxuryApp | CONFIG | OperationsLuxuryApp | Infrastructure/Data/Configurations/OperationsLuxuryApp | Infrastructure.Data.Configurations.OperationsLuxuryApp |
| GoogleCalendarEventConfiguration.cs | OperationsLuxuryApp | CONFIG | OperationsLuxuryApp | Infrastructure/Data/Configurations/OperationsLuxuryApp | Infrastructure.Data.Configurations.OperationsLuxuryApp |
| GoogleCalendarGuestConfiguration.cs | OperationsLuxuryApp | CONFIG | OperationsLuxuryApp | Infrastructure/Data/Configurations/OperationsLuxuryApp | Infrastructure.Data.Configurations.OperationsLuxuryApp |
| InspectionCondominiumAssetConfiguration.cs | OperationsLuxuryApp | CONFIG | OperationsLuxuryApp | Infrastructure/Data/Configurations/OperationsLuxuryApp | Infrastructure.Data.Configurations.OperationsLuxuryApp |
| InspectionConfiguration.cs | OperationsLuxuryApp | CONFIG | OperationsLuxuryApp | Infrastructure/Data/Configurations/OperationsLuxuryApp | Infrastructure.Data.Configurations.OperationsLuxuryApp |
| InspectionResultConfiguration.cs | OperationsLuxuryApp | CONFIG | OperationsLuxuryApp | Infrastructure/Data/Configurations/OperationsLuxuryApp | Infrastructure.Data.Configurations.OperationsLuxuryApp |
| InspectionResultImageConfiguration.cs | OperationsLuxuryApp | CONFIG | OperationsLuxuryApp | Infrastructure/Data/Configurations/OperationsLuxuryApp | Infrastructure.Data.Configurations.OperationsLuxuryApp |
| InspectionReviewConfiguration.cs | OperationsLuxuryApp | CONFIG | OperationsLuxuryApp | Infrastructure/Data/Configurations/OperationsLuxuryApp | Infrastructure.Data.Configurations.OperationsLuxuryApp |
| InspectionReviewsCatalogConfiguration.cs | OperationsLuxuryApp | CONFIG | OperationsLuxuryApp | Infrastructure/Data/Configurations/OperationsLuxuryApp | Infrastructure.Data.Configurations.OperationsLuxuryApp |
| InspectionWeeklyDayConfiguration.cs | OperationsLuxuryApp | CONFIG | OperationsLuxuryApp | Infrastructure/Data/Configurations/OperationsLuxuryApp | Infrastructure.Data.Configurations.OperationsLuxuryApp |
| InventarioDetectorHumoConfiguration.cs | OperationsLuxuryApp | CONFIG | OperationsLuxuryApp | Infrastructure/Data/Configurations/OperationsLuxuryApp | Infrastructure.Data.Configurations.OperationsLuxuryApp |
| InventarioEstacionManualConfiguration.cs | OperationsLuxuryApp | CONFIG | OperationsLuxuryApp | Infrastructure/Data/Configurations/OperationsLuxuryApp | Infrastructure.Data.Configurations.OperationsLuxuryApp |
| InventarioHidranteConfiguration.cs | OperationsLuxuryApp | CONFIG | OperationsLuxuryApp | Infrastructure/Data/Configurations/OperationsLuxuryApp | Infrastructure.Data.Configurations.OperationsLuxuryApp |
| JuntaMensualSessionConfiguration.cs | OperationsLuxuryApp | CONFIG | OperationsLuxuryApp | Infrastructure/Data/Configurations/OperationsLuxuryApp | Infrastructure.Data.Configurations.OperationsLuxuryApp |
| ManualDiagramConfiguration.cs | OperationsLuxuryApp | CONFIG | OperationsLuxuryApp | Infrastructure/Data/Configurations/OperationsLuxuryApp | Infrastructure.Data.Configurations.OperationsLuxuryApp |
| ManualPasoConfiguration.cs | OperationsLuxuryApp | CONFIG | OperationsLuxuryApp | Infrastructure/Data/Configurations/OperationsLuxuryApp | Infrastructure.Data.Configurations.OperationsLuxuryApp |
| ManualPasoEnlaceConfiguration.cs | OperationsLuxuryApp | CONFIG | OperationsLuxuryApp | Infrastructure/Data/Configurations/OperationsLuxuryApp | Infrastructure.Data.Configurations.OperationsLuxuryApp |
| ManualPasoImagenConfiguration.cs | OperationsLuxuryApp | CONFIG | OperationsLuxuryApp | Infrastructure/Data/Configurations/OperationsLuxuryApp | Infrastructure.Data.Configurations.OperationsLuxuryApp |
| ManualPasoResponsableConfiguration.cs | OperationsLuxuryApp | CONFIG | OperationsLuxuryApp | Infrastructure/Data/Configurations/OperationsLuxuryApp | Infrastructure.Data.Configurations.OperationsLuxuryApp |
| RecurringTaskTemplateConfiguration.cs | OperationsLuxuryApp | CONFIG | OperationsLuxuryApp | Infrastructure/Data/Configurations/OperationsLuxuryApp | Infrastructure.Data.Configurations.OperationsLuxuryApp |
| TaskAlertLogConfiguration.cs | OperationsLuxuryApp | CONFIG | OperationsLuxuryApp | Infrastructure/Data/Configurations/OperationsLuxuryApp | Infrastructure.Data.Configurations.OperationsLuxuryApp |
| TaskChangeLogConfiguration.cs | OperationsLuxuryApp | CONFIG | OperationsLuxuryApp | Infrastructure/Data/Configurations/OperationsLuxuryApp | Infrastructure.Data.Configurations.OperationsLuxuryApp |
| TaskChecklistItemConfiguration.cs | OperationsLuxuryApp | CONFIG | OperationsLuxuryApp | Infrastructure/Data/Configurations/OperationsLuxuryApp | Infrastructure.Data.Configurations.OperationsLuxuryApp |
| TaskFollowUpConfiguration.cs | OperationsLuxuryApp | CONFIG | OperationsLuxuryApp | Infrastructure/Data/Configurations/OperationsLuxuryApp | Infrastructure.Data.Configurations.OperationsLuxuryApp |
| TaskJustificationConfiguration.cs | OperationsLuxuryApp | CONFIG | OperationsLuxuryApp | Infrastructure/Data/Configurations/OperationsLuxuryApp | Infrastructure.Data.Configurations.OperationsLuxuryApp |
| TaskMeetingConfiguration.cs | OperationsLuxuryApp | CONFIG | OperationsLuxuryApp | Infrastructure/Data/Configurations/OperationsLuxuryApp | Infrastructure.Data.Configurations.OperationsLuxuryApp |
| TaskMessageReadConfiguration.cs | OperationsLuxuryApp | CONFIG | OperationsLuxuryApp | Infrastructure/Data/Configurations/OperationsLuxuryApp | Infrastructure.Data.Configurations.OperationsLuxuryApp |
| TaskServiceOrderConfiguration.cs | OperationsLuxuryApp | CONFIG | OperationsLuxuryApp | Infrastructure/Data/Configurations/OperationsLuxuryApp | Infrastructure.Data.Configurations.OperationsLuxuryApp |
| TaskWeeklyWorkConfiguration.cs | OperationsLuxuryApp | CONFIG | OperationsLuxuryApp | Infrastructure/Data/Configurations/OperationsLuxuryApp | Infrastructure.Data.Configurations.OperationsLuxuryApp |
| TaskWorkPlanConfiguration.cs | OperationsLuxuryApp | CONFIG | OperationsLuxuryApp | Infrastructure/Data/Configurations/OperationsLuxuryApp | Infrastructure.Data.Configurations.OperationsLuxuryApp |
| WorkGroupCategoriesConfiguration.cs | OperationsLuxuryApp | CONFIG | OperationsLuxuryApp | Infrastructure/Data/Configurations/OperationsLuxuryApp | Infrastructure.Data.Configurations.OperationsLuxuryApp |
| WorkGroupConfiguration.cs | OperationsLuxuryApp | CONFIG | OperationsLuxuryApp | Infrastructure/Data/Configurations/OperationsLuxuryApp | Infrastructure.Data.Configurations.OperationsLuxuryApp |
| WorkGroupMemberConfiguration.cs | OperationsLuxuryApp | CONFIG | OperationsLuxuryApp | Infrastructure/Data/Configurations/OperationsLuxuryApp | Infrastructure.Data.Configurations.OperationsLuxuryApp |
| AccessCredential.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/AccessControl | Entities.OperationsLuxuryApp.AccessControl |
| AccessEvent.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/AccessControl | Entities.OperationsLuxuryApp.AccessControl |
| AccessPoint.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/AccessControl | Entities.OperationsLuxuryApp.AccessControl |
| GuardShift.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/AccessControl | Entities.OperationsLuxuryApp.AccessControl |
| Invitation.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/AccessControl | Entities.OperationsLuxuryApp.AccessControl |
| Visit.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/AccessControl | Entities.OperationsLuxuryApp.AccessControl |
| Visitor.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/AccessControl | Entities.OperationsLuxuryApp.AccessControl |
| Incident.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/AdministrativeIncidents | Entities.OperationsLuxuryApp.AdministrativeIncidents |
| IncidentAttachment.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/AdministrativeIncidents | Entities.OperationsLuxuryApp.AdministrativeIncidents |
| IncidentType.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/AdministrativeIncidents | Entities.OperationsLuxuryApp.AdministrativeIncidents |
| IncidentWitness.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/AdministrativeIncidents | Entities.OperationsLuxuryApp.AdministrativeIncidents |
| Sanction.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/AdministrativeIncidents | Entities.OperationsLuxuryApp.AdministrativeIncidents |
| SanctionType.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/AdministrativeIncidents | Entities.OperationsLuxuryApp.AdministrativeIncidents |
| SuspensionDay.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/AdministrativeIncidents | Entities.OperationsLuxuryApp.AdministrativeIncidents |
| Announcement.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Announcements | Entities.OperationsLuxuryApp.Announcements |
| AnnouncementAnalyticsEntry.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Announcements | Entities.OperationsLuxuryApp.Announcements |
| AnnouncementAttachment.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Announcements | Entities.OperationsLuxuryApp.Announcements |
| AnnouncementCustomer.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Announcements | Entities.OperationsLuxuryApp.Announcements |
| AnnouncementRole.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Announcements | Entities.OperationsLuxuryApp.Announcements |
| ManualDiagram.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Committee/Manuals | Entities.OperationsLuxuryApp.Committee.Manuals |
| ManualPaso.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Committee/Manuals | Entities.OperationsLuxuryApp.Committee.Manuals |
| ManualPasoEnlace.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Committee/Manuals | Entities.OperationsLuxuryApp.Committee.Manuals |
| ManualPasoImagen.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Committee/Manuals | Entities.OperationsLuxuryApp.Committee.Manuals |
| ManualPasoResponsable.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Committee/Manuals | Entities.OperationsLuxuryApp.Committee.Manuals |
| ManualTemplate.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Committee/Manuals | Entities.OperationsLuxuryApp.Committee.Manuals |
| ManualTemplateAttachment.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Committee/Manuals | Entities.OperationsLuxuryApp.Committee.Manuals |
| ManualTemplateCustomer.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Committee/Manuals | Entities.OperationsLuxuryApp.Committee.Manuals |
| ManualTemplateRole.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Committee/Manuals | Entities.OperationsLuxuryApp.Committee.Manuals |
| ManualTemplateVersion.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Committee/Manuals | Entities.OperationsLuxuryApp.Committee.Manuals |
| VigilanceCommittee.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Committee/VigilanceCommittees | Entities.OperationsLuxuryApp.Committee.VigilanceCommittees |
| CustomDocument.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/CustomDocuments | Entities.OperationsLuxuryApp.CustomDocuments |
| CustomDocumentRole.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/CustomDocuments | Entities.OperationsLuxuryApp.CustomDocuments |
| DeliveryCriterion.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/DeliveryReception | Entities.OperationsLuxuryApp.DeliveryReception |
| EntregaRecepcionCliente.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/DeliveryReception | Entities.OperationsLuxuryApp.DeliveryReception |
| EntregaRecepcionDescripcion.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/DeliveryReception | Entities.OperationsLuxuryApp.DeliveryReception |
| DiagramDraw.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Diagram | Entities.OperationsLuxuryApp.Diagram |
| DiagramDrawTargetCustomer.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Diagram | Entities.OperationsLuxuryApp.Diagram |
| DiagramDrawTargetRole.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Diagram | Entities.OperationsLuxuryApp.Diagram |
| GoogleCalendarEvent.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/GoogleCalendar | Entities.OperationsLuxuryApp.GoogleCalendar |
| GoogleCalendarGuest.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/GoogleCalendar | Entities.OperationsLuxuryApp.GoogleCalendar |
| CustomerInspection.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Inspections | Entities.OperationsLuxuryApp.Inspections |
| Inspection.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Inspections | Entities.OperationsLuxuryApp.Inspections |
| InspectionCondominiumAsset.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Inspections | Entities.OperationsLuxuryApp.Inspections |
| InspectionResult.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Inspections | Entities.OperationsLuxuryApp.Inspections |
| InspectionResultImage.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Inspections | Entities.OperationsLuxuryApp.Inspections |
| InspectionReviews.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Inspections | Entities.OperationsLuxuryApp.Inspections |
| InspectionReviewsCatalog.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Inspections | Entities.OperationsLuxuryApp.Inspections |
| InspectionWeeklyDay.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Inspections | Entities.OperationsLuxuryApp.Inspections |
| ReportDefinition.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Inspections | Entities.OperationsLuxuryApp.Inspections |
| ReportSubmissionRecord.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Inspections | Entities.OperationsLuxuryApp.Inspections |
| Almacen.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Inventory | Entities.OperationsLuxuryApp.Inventory |
| AlmacenUsuarioResponsable.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Inventory | Entities.OperationsLuxuryApp.Inventory |
| Category.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Inventory | Entities.OperationsLuxuryApp.Inventory |
| EntradaProducto.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Inventory | Entities.OperationsLuxuryApp.Inventory |
| EquipoContraIncendioBase.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Inventory | Entities.OperationsLuxuryApp.Inventory |
| InventarioDetectorHumo.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Inventory | Entities.OperationsLuxuryApp.Inventory |
| InventarioEstacionManual.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Inventory | Entities.OperationsLuxuryApp.Inventory |
| InventarioExtintor.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Inventory | Entities.OperationsLuxuryApp.Inventory |
| InventarioHidrante.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Inventory | Entities.OperationsLuxuryApp.Inventory |
| KeyInventory.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Inventory | Entities.OperationsLuxuryApp.Inventory |
| LightingStock.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Inventory | Entities.OperationsLuxuryApp.Inventory |
| PaintStock.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Inventory | Entities.OperationsLuxuryApp.Inventory |
| Producto.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Inventory | Entities.OperationsLuxuryApp.Inventory |
| RadioComunicacion.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Inventory | Entities.OperationsLuxuryApp.Inventory |
| SalidaProducto.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Inventory | Entities.OperationsLuxuryApp.Inventory |
| Tool.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Inventory | Entities.OperationsLuxuryApp.Inventory |
| UnitOfMeasure.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Inventory | Entities.OperationsLuxuryApp.Inventory |
| WarehouseStock.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Inventory | Entities.OperationsLuxuryApp.Inventory |
| AsambleaChecklistExecution.cs | OperationsLuxuryApp | ALIAS | OperationsLuxuryApp | OperationsLuxuryApp/MonthlyMeetings/Assemblies | Entities.OperationsLuxuryApp.MonthlyMeetings.Assemblies |
| AsambleaChecklistTemplate.cs | OperationsLuxuryApp | ALIAS | OperationsLuxuryApp | OperationsLuxuryApp/MonthlyMeetings/Assemblies | Entities.OperationsLuxuryApp.MonthlyMeetings.Assemblies |
| AsambleaInvitado.cs | OperationsLuxuryApp | ALIAS | OperationsLuxuryApp | OperationsLuxuryApp/MonthlyMeetings/Assemblies | Entities.OperationsLuxuryApp.MonthlyMeetings.Assemblies |
| AsambleaPlan.cs | OperationsLuxuryApp | ALIAS | OperationsLuxuryApp | OperationsLuxuryApp/MonthlyMeetings/Assemblies | Entities.OperationsLuxuryApp.MonthlyMeetings.Assemblies |
| AssemblySupportRequest.cs | OperationsLuxuryApp | ALIAS | OperationsLuxuryApp | OperationsLuxuryApp/MonthlyMeetings/Assemblies | Entities.OperationsLuxuryApp.MonthlyMeetings.Assemblies |
| Meeting.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/MonthlyMeetings/MeetingMinutes | Entities.OperationsLuxuryApp.MonthlyMeetings.MeetingMinutes |
| MeetingAdministracion.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/MonthlyMeetings/MeetingMinutes | Entities.OperationsLuxuryApp.MonthlyMeetings.MeetingMinutes |
| MeetingComite.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/MonthlyMeetings/MeetingMinutes | Entities.OperationsLuxuryApp.MonthlyMeetings.MeetingMinutes |
| MeetingDetails.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/MonthlyMeetings/MeetingMinutes | Entities.OperationsLuxuryApp.MonthlyMeetings.MeetingMinutes |
| MeetingDetailsSeguimiento.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/MonthlyMeetings/MeetingMinutes | Entities.OperationsLuxuryApp.MonthlyMeetings.MeetingMinutes |
| MeetingInvitado.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/MonthlyMeetings/MeetingMinutes | Entities.OperationsLuxuryApp.MonthlyMeetings.MeetingMinutes |
| TaskMeeting.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/MonthlyMeetings/MeetingMinutes | Entities.OperationsLuxuryApp.MonthlyMeetings.MeetingMinutes |
| PresentacionJuntaComite.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/MonthlyMeetings/Presentation | Entities.OperationsLuxuryApp.MonthlyMeetings.Presentation |
| JuntaMensualSession.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/MonthlyMeetings/Session | Entities.OperationsLuxuryApp.MonthlyMeetings.Session |
| PanicAlert.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/PanicAlerts | Entities.OperationsLuxuryApp.PanicAlerts |
| Property.cs | OperationsLuxuryApp | ALIAS | OperationsLuxuryApp | OperationsLuxuryApp/Properties | Entities.OperationsLuxuryApp.Properties |
| PropertyMember.cs | OperationsLuxuryApp | ALIAS | OperationsLuxuryApp | OperationsLuxuryApp/Properties | Entities.OperationsLuxuryApp.Properties |
| PropertyOccupant.cs | OperationsLuxuryApp | ALIAS | OperationsLuxuryApp | OperationsLuxuryApp/PropertyOccupants | Entities.OperationsLuxuryApp.PropertyOccupants |
| QualificationProvider.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/ProviderQualification | Entities.OperationsLuxuryApp.ProviderQualification |
| CategoryProvider.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Providers | Entities.OperationsLuxuryApp.Providers |
| PersonProviderSupport.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Providers | Entities.OperationsLuxuryApp.Providers |
| Provider.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Providers | Entities.OperationsLuxuryApp.Providers |
| ServiceOrder.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/ServiceOrders | Entities.OperationsLuxuryApp.ServiceOrders |
| ServiceOrderDocument.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/ServiceOrders | Entities.OperationsLuxuryApp.ServiceOrders |
| ServiceOrderImg.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/ServiceOrders | Entities.OperationsLuxuryApp.ServiceOrders |
| AgendaSupervision.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Supervision/Supervision | Entities.OperationsLuxuryApp.Supervision.Supervision |
| TaskAlertLog.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Task/RecurringTaskAlerting | Entities.OperationsLuxuryApp.Task.RecurringTaskAlerting |
| CustomerTaskItemConfig.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Task/RecurringTaskCatalog | Entities.OperationsLuxuryApp.Task.RecurringTaskCatalog |
| RecurringTaskTemplate.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Task/RecurringTaskCatalog | Entities.OperationsLuxuryApp.Task.RecurringTaskCatalog |
| TaskTemplate.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Task/RecurringTaskCatalog | Entities.OperationsLuxuryApp.Task.RecurringTaskCatalog |
| TaskTemplateCustomer.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Task/RecurringTaskCatalog | Entities.OperationsLuxuryApp.Task.RecurringTaskCatalog |
| TaskTemplateItem.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Task/RecurringTaskCatalog | Entities.OperationsLuxuryApp.Task.RecurringTaskCatalog |
| TaskAdditionalImage.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Task/TaskAdditionalImages | Entities.OperationsLuxuryApp.Task.TaskAdditionalImages |
| TaskAttachment.cs | OperationsLuxuryApp | ALIAS | OperationsLuxuryApp | OperationsLuxuryApp/Task/TaskAttachments | Entities.OperationsLuxuryApp.Task.TaskAttachments |
| TaskChecklistItem.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Task/TaskChecklist | Entities.OperationsLuxuryApp.Task.TaskChecklist |
| TaskFollowUp.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Task/TaskFollowUps | Entities.OperationsLuxuryApp.Task.TaskFollowUps |
| TaskFollowUpEvidenceImage.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Task/TaskFollowUps | Entities.OperationsLuxuryApp.Task.TaskFollowUps |
| TaskJustification.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Task/TaskJustifications | Entities.OperationsLuxuryApp.Task.TaskJustifications |
| TaskMessageReads.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Task/TaskMessageReads | Entities.OperationsLuxuryApp.Task.TaskMessageReads |
| TaskChangeLog.cs | OperationsLuxuryApp | ALIAS | OperationsLuxuryApp | OperationsLuxuryApp/Task/TaskRecords | Entities.OperationsLuxuryApp.Task.TaskRecords |
| TaskComment.cs | OperationsLuxuryApp | ALIAS | OperationsLuxuryApp | OperationsLuxuryApp/Task/TaskRecords | Entities.OperationsLuxuryApp.Task.TaskRecords |
| TaskInstance.cs | OperationsLuxuryApp | ALIAS | OperationsLuxuryApp | OperationsLuxuryApp/Task/TaskRecords | Entities.OperationsLuxuryApp.Task.TaskRecords |
| Tasks.cs | OperationsLuxuryApp | ALIAS | OperationsLuxuryApp | OperationsLuxuryApp/Task/TaskRecords | Entities.OperationsLuxuryApp.Task.TaskRecords |
| TaskServiceOrder.cs | OperationsLuxuryApp | ALIAS | OperationsLuxuryApp | OperationsLuxuryApp/Task/TaskRecords | Entities.OperationsLuxuryApp.Task.TaskRecords |
| TaskResponsible.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Task/TaskResponsibles | Entities.OperationsLuxuryApp.Task.TaskResponsibles |
| TaskWeeklyWork.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Task/TaskWorkPlans | Entities.OperationsLuxuryApp.Task.TaskWorkPlans |
| TaskWorkPlan.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Task/TaskWorkPlans | Entities.OperationsLuxuryApp.Task.TaskWorkPlans |
| WorkGroupCategories.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Task/WorkGroupCategoriesData | Entities.OperationsLuxuryApp.Task.WorkGroupCategoriesData |
| WorkGroupMembers.cs | OperationsLuxuryApp | SUFFIX | OperationsLuxuryApp | OperationsLuxuryApp/Task/WorkGroupMembers | Entities.OperationsLuxuryApp.Task.WorkGroupMembers |
| WorkGroup.cs | OperationsLuxuryApp | ALIAS | OperationsLuxuryApp | OperationsLuxuryApp/Task/WorkGroups | Entities.OperationsLuxuryApp.Task.WorkGroups |
| SolicitudCompraBudgetConfiguration.cs | PurchasesLuxuryApp | CONFIG | PurchasesLuxuryApp | Infrastructure/Data/Configurations/PurchasesLuxuryApp | Infrastructure.Data.Configurations.PurchasesLuxuryApp |
| SolicitudCompraEvidenceConfiguration.cs | PurchasesLuxuryApp | CONFIG | PurchasesLuxuryApp | Infrastructure/Data/Configurations/PurchasesLuxuryApp | Infrastructure.Data.Configurations.PurchasesLuxuryApp |
| SolicitudCompraBudget.cs | PurchasesLuxuryApp | SUFFIX | PurchasesLuxuryApp | PurchasesLuxuryApp/PurchaseRequests/Budget | Entities.PurchasesLuxuryApp.PurchaseRequests.Budget |
| CotizacionDetalle.cs | PurchasesLuxuryApp | SUFFIX | PurchasesLuxuryApp | PurchasesLuxuryApp/PurchaseRequests/Details | Entities.PurchasesLuxuryApp.PurchaseRequests.Details |
| SolicitudCompraDetalle.cs | PurchasesLuxuryApp | SUFFIX | PurchasesLuxuryApp | PurchasesLuxuryApp/PurchaseRequests/Details | Entities.PurchasesLuxuryApp.PurchaseRequests.Details |
| CotizacionProveedorEvidence.cs | PurchasesLuxuryApp | SUFFIX | PurchasesLuxuryApp | PurchasesLuxuryApp/PurchaseRequests/Evidence | Entities.PurchasesLuxuryApp.PurchaseRequests.Evidence |
| SolicitudCompraEvidence.cs | PurchasesLuxuryApp | SUFFIX | PurchasesLuxuryApp | PurchasesLuxuryApp/PurchaseRequests/Evidence | Entities.PurchasesLuxuryApp.PurchaseRequests.Evidence |
| CotizacionProveedor.cs | PurchasesLuxuryApp | SUFFIX | PurchasesLuxuryApp | PurchasesLuxuryApp/PurchaseRequests/Shared | Entities.PurchasesLuxuryApp.PurchaseRequests.Shared |
| SolicitudCompra.cs | PurchasesLuxuryApp | SUFFIX | PurchasesLuxuryApp | PurchasesLuxuryApp/PurchaseRequests/Shared | Entities.PurchasesLuxuryApp.PurchaseRequests.Shared |
| CatalogPurchaseOrderBudget.cs | PurchasesLuxuryApp | ALIAS | PurchasesLuxuryApp | PurchasesLuxuryApp/Purchases/PurchaseOrders | Entities.PurchasesLuxuryApp.Purchases.PurchaseOrders |
| OrdenCompra.cs | PurchasesLuxuryApp | ALIAS | PurchasesLuxuryApp | PurchasesLuxuryApp/Purchases/PurchaseOrders | Entities.PurchasesLuxuryApp.Purchases.PurchaseOrders |
| OrdenCompraAuth.cs | PurchasesLuxuryApp | ALIAS | PurchasesLuxuryApp | PurchasesLuxuryApp/Purchases/PurchaseOrders | Entities.PurchasesLuxuryApp.Purchases.PurchaseOrders |
| OrdenCompraComprobantePago.cs | PurchasesLuxuryApp | ALIAS | PurchasesLuxuryApp | PurchasesLuxuryApp/Purchases/PurchaseOrders | Entities.PurchasesLuxuryApp.Purchases.PurchaseOrders |
| OrdenCompraDatosPago.cs | PurchasesLuxuryApp | ALIAS | PurchasesLuxuryApp | PurchasesLuxuryApp/Purchases/PurchaseOrders | Entities.PurchasesLuxuryApp.Purchases.PurchaseOrders |
| OrdenCompraDetalle.cs | PurchasesLuxuryApp | ALIAS | PurchasesLuxuryApp | PurchasesLuxuryApp/Purchases/PurchaseOrders | Entities.PurchasesLuxuryApp.Purchases.PurchaseOrders |
| OrdenCompraFactura.cs | PurchasesLuxuryApp | ALIAS | PurchasesLuxuryApp | PurchasesLuxuryApp/Purchases/PurchaseOrders | Entities.PurchasesLuxuryApp.Purchases.PurchaseOrders |
| OrdenCompraStatus.cs | PurchasesLuxuryApp | ALIAS | PurchasesLuxuryApp | PurchasesLuxuryApp/Purchases/PurchaseOrders | Entities.PurchasesLuxuryApp.Purchases.PurchaseOrders |
| PurchaseOrderBudget.cs | PurchasesLuxuryApp | ALIAS | PurchasesLuxuryApp | PurchasesLuxuryApp/Purchases/PurchaseOrders | Entities.PurchasesLuxuryApp.Purchases.PurchaseOrders |
| ChecklistOptionCatalogRoleConfiguration.cs | RecruitmentLuxuryApp | CONFIG | RecruitmentLuxuryApp | Infrastructure/Data/Configurations/RecruitmentLuxuryApp | Infrastructure.Data.Configurations.RecruitmentLuxuryApp |
| Candidate.cs | RecruitmentLuxuryApp | SUFFIX | RecruitmentLuxuryApp | RecruitmentLuxuryApp/Candidates/CandidateCore | Entities.RecruitmentLuxuryApp.Candidates.CandidateCore |
| CandidateApplicationRole.cs | RecruitmentLuxuryApp | SUFFIX | RecruitmentLuxuryApp | RecruitmentLuxuryApp/Candidates/CandidateCore | Entities.RecruitmentLuxuryApp.Candidates.CandidateCore |
| CandidateInterview.cs | RecruitmentLuxuryApp | SUFFIX | RecruitmentLuxuryApp | RecruitmentLuxuryApp/Candidates/CandidateCore | Entities.RecruitmentLuxuryApp.Candidates.CandidateCore |
| CandidateStageHistory.cs | RecruitmentLuxuryApp | SUFFIX | RecruitmentLuxuryApp | RecruitmentLuxuryApp/Candidates/CandidateCore | Entities.RecruitmentLuxuryApp.Candidates.CandidateCore |
| CandidateProcess.cs | RecruitmentLuxuryApp | SUFFIX | RecruitmentLuxuryApp | RecruitmentLuxuryApp/Candidates/CandidateProcesses | Entities.RecruitmentLuxuryApp.Candidates.CandidateProcesses |
| CandidateWorkExperience.cs | RecruitmentLuxuryApp | SUFFIX | RecruitmentLuxuryApp | RecruitmentLuxuryApp/Candidates/CandidatesWorkExperience | Entities.RecruitmentLuxuryApp.Candidates.CandidatesWorkExperience |
| ChecklistOptionCatalog.cs | RecruitmentLuxuryApp | SUFFIX | RecruitmentLuxuryApp | RecruitmentLuxuryApp/EmployeeFile | Entities.RecruitmentLuxuryApp.EmployeeFile |
| ChecklistOptionCatalogRole.cs | RecruitmentLuxuryApp | SUFFIX | RecruitmentLuxuryApp | RecruitmentLuxuryApp/EmployeeFile | Entities.RecruitmentLuxuryApp.EmployeeFile |
| DocumentCatalog.cs | RecruitmentLuxuryApp | SUFFIX | RecruitmentLuxuryApp | RecruitmentLuxuryApp/EmployeeFile | Entities.RecruitmentLuxuryApp.EmployeeFile |
| Employee.cs | RecruitmentLuxuryApp | SUFFIX | RecruitmentLuxuryApp | RecruitmentLuxuryApp/EmployeeFile | Entities.RecruitmentLuxuryApp.EmployeeFile |
| EmployeeBankData.cs | RecruitmentLuxuryApp | SUFFIX | RecruitmentLuxuryApp | RecruitmentLuxuryApp/EmployeeFile | Entities.RecruitmentLuxuryApp.EmployeeFile |
| EmployeeBeneficiary.cs | RecruitmentLuxuryApp | SUFFIX | RecruitmentLuxuryApp | RecruitmentLuxuryApp/EmployeeFile | Entities.RecruitmentLuxuryApp.EmployeeFile |
| EmployeeClinicalData.cs | RecruitmentLuxuryApp | SUFFIX | RecruitmentLuxuryApp | RecruitmentLuxuryApp/EmployeeFile | Entities.RecruitmentLuxuryApp.EmployeeFile |
| EmployeeDocument.cs | RecruitmentLuxuryApp | SUFFIX | RecruitmentLuxuryApp | RecruitmentLuxuryApp/EmployeeFile | Entities.RecruitmentLuxuryApp.EmployeeFile |
| EmployeeEmergencyContact.cs | RecruitmentLuxuryApp | SUFFIX | RecruitmentLuxuryApp | RecruitmentLuxuryApp/EmployeeFile | Entities.RecruitmentLuxuryApp.EmployeeFile |
| EmployeeOnboardingChecklist.cs | RecruitmentLuxuryApp | SUFFIX | RecruitmentLuxuryApp | RecruitmentLuxuryApp/EmployeeFile | Entities.RecruitmentLuxuryApp.EmployeeFile |
| PersonData.cs | RecruitmentLuxuryApp | SUFFIX | RecruitmentLuxuryApp | RecruitmentLuxuryApp/EmployeeFile | Entities.RecruitmentLuxuryApp.EmployeeFile |
| OrganizationHierarchy.cs | RecruitmentLuxuryApp | SUFFIX | RecruitmentLuxuryApp | RecruitmentLuxuryApp/EmployeeOrgChart | Entities.RecruitmentLuxuryApp.EmployeeOrgChart |
| ExternalStaff.cs | RecruitmentLuxuryApp | SUFFIX | RecruitmentLuxuryApp | RecruitmentLuxuryApp/ExternalStaffs | Entities.RecruitmentLuxuryApp.ExternalStaffs |
| InterviewerMatrix.cs | RecruitmentLuxuryApp | ALIAS | RecruitmentLuxuryApp | RecruitmentLuxuryApp/InterviewerMatrices | Entities.RecruitmentLuxuryApp.InterviewerMatrices |
| JobDescription.cs | RecruitmentLuxuryApp | SUFFIX | RecruitmentLuxuryApp | RecruitmentLuxuryApp/JobDescriptions | Entities.RecruitmentLuxuryApp.JobDescriptions |
| RecruitmentSourceCatalog.cs | RecruitmentLuxuryApp | SUFFIX | RecruitmentLuxuryApp | RecruitmentLuxuryApp/RecruitmentSourceCatalogs | Entities.RecruitmentLuxuryApp.RecruitmentSourceCatalogs |
| RequestDismissalDiscount.cs | RecruitmentLuxuryApp | ALIAS | RecruitmentLuxuryApp | RecruitmentLuxuryApp/RequestDismissalDiscounts | Entities.RecruitmentLuxuryApp.RequestDismissalDiscounts |
| RequestDismissal.cs | RecruitmentLuxuryApp | ALIAS | RecruitmentLuxuryApp | RecruitmentLuxuryApp/RequestDismissals | Entities.RecruitmentLuxuryApp.RequestDismissals |
| RequestDismissalEvaluation.cs | RecruitmentLuxuryApp | ALIAS | RecruitmentLuxuryApp | RecruitmentLuxuryApp/RequestDismissals | Entities.RecruitmentLuxuryApp.RequestDismissals |
| RequestDismissalFile.cs | RecruitmentLuxuryApp | ALIAS | RecruitmentLuxuryApp | RecruitmentLuxuryApp/RequestDismissals | Entities.RecruitmentLuxuryApp.RequestDismissals |
| RequestDismissalIncident.cs | RecruitmentLuxuryApp | ALIAS | RecruitmentLuxuryApp | RecruitmentLuxuryApp/RequestDismissals | Entities.RecruitmentLuxuryApp.RequestDismissals |
| RequestEmployeeRegister.cs | RecruitmentLuxuryApp | SUFFIX | RecruitmentLuxuryApp | RecruitmentLuxuryApp/RequestEmployeeRegisters | Entities.RecruitmentLuxuryApp.RequestEmployeeRegisters |
| RequestEmployeeRegisterFile.cs | RecruitmentLuxuryApp | SUFFIX | RecruitmentLuxuryApp | RecruitmentLuxuryApp/RequestEmployeeRegisters | Entities.RecruitmentLuxuryApp.RequestEmployeeRegisters |
| RequestPosition.cs | RecruitmentLuxuryApp | ALIAS | RecruitmentLuxuryApp | RecruitmentLuxuryApp/RequestPositions | Entities.RecruitmentLuxuryApp.RequestPositions |
| RequestSalaryModification.cs | RecruitmentLuxuryApp | SUFFIX | RecruitmentLuxuryApp | RecruitmentLuxuryApp/SalaryModifications | Entities.RecruitmentLuxuryApp.SalaryModifications |
| DiaDeTrabajo.cs | RecruitmentLuxuryApp | SUFFIX | RecruitmentLuxuryApp | RecruitmentLuxuryApp/WorkPositions | Entities.RecruitmentLuxuryApp.WorkPositions |
| WorkPosition.cs | RecruitmentLuxuryApp | SUFFIX | RecruitmentLuxuryApp | RecruitmentLuxuryApp/WorkPositions | Entities.RecruitmentLuxuryApp.WorkPositions |
| WorkPositionSchedule.cs | RecruitmentLuxuryApp | SUFFIX | RecruitmentLuxuryApp | RecruitmentLuxuryApp/WorkPositions | Entities.RecruitmentLuxuryApp.WorkPositions |
| Address.cs | SharedLuxuryApp | SUFFIX | SharedLuxuryApp | SharedLuxuryApp/Catalogs | Entities.SharedLuxuryApp.Catalogs |
| MedidorCategoria.cs | SharedLuxuryApp | SUFFIX | SharedLuxuryApp | SharedLuxuryApp/Catalogs | Entities.SharedLuxuryApp.Catalogs |
| TelefonosEmergencia.cs | SharedLuxuryApp | SUFFIX | SharedLuxuryApp | SharedLuxuryApp/Catalogs | Entities.SharedLuxuryApp.Catalogs |