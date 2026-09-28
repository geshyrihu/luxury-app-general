# 📘 CONVENTIONS_ENTITIES.md

> **Master reference for entity naming conventions in `ApplicationDbContext`.**

**Archivo rector:** `api/LuxuryApp.Application/Infrastructure/Data/ApplicationDbContext.cs`  
**Total de entidades activas:** 302 (1 inactivo: `TaskTemplateRole`, comentado)  
**Regla aplicada:** Carpeta/namespace plural, clase singular, archivo singular, DbSet plural, tabla plural, DTOs terminan en `DTO` y cada uno en archivo propio.

---

## 1️⃣ Convenciones de Número y Naming

| Artifact | Regla | Ejemplo |
|----------|-------|---------|
| 📁 Carpeta / Namespace | Plural | `Entities/` |
| 🏷️ Clase / Entidad | Singular | `Bank` |
| 📄 Archivo | Singular | `Bank.cs` |
| 📚 DbSet | Plural | `Banks` |
| 🗄️ Tabla | Plural | `[Table("Banks")]` |
| 📦 DTO | Sufijo `DTO` | `BankDetailDTO` |

---

## 2️⃣ Checklist de Convención para PRs

| # | Ítem | Estado |
|---|------|--------|
| 1 | 📁 Carpeta / Namespace en plural | ✅ |
| 2 | 🏷️ Clase y archivo en singular | ✅ |
| 3 | 📚 DbSet en plural | ✅ |
| 4 | 🗄️ Tabla en plural (`[Table]`) | ✅ |
| 5 | 📦 DTOs terminan en `DTO` | ✅ |
| 6 | 📄 Un DTO por clase | ✅ |
| 7 | ⚠️ Sin colisiones folder/clase | ✅ |

---

## 3️⃣ Entidades por Módulo

### Resumen

| Módulo | Total |
|--------|-------|
| 🛠️ SystemLuxuryApp | 12 |
| 🔐 AdminLuxuryApp | 14 |
| 📊 ContabilidadLuxuryApp | 27 |
| 💸 CobranzaLuxuryApp | 28 |
| 👥 RecursosHumanosLuxuryApp | 23 |
| ⚖️ LegalLuxuryApp | 11 |
| 🔧 MantenimientoLuxuryApp | 29 |
| ⚙️ OperationsLuxuryApp | 109 |
| 🛒 ComprasLuxuryApp | 16 |
| 🎯 ReclutamientoLuxuryApp | 29 |
| 🤝 SupplierLuxuryApp | 4 |

---

### 🛠️ SystemLuxuryApp

**12 entidades**


#### Catálogos Maestros (Catalogs)

| DbSet | Clase | Tabla | Namespace (corto) |
|-------|-------|-------|-------------------|
| Address | Address | Addresses | SystemLuxuryApp.ConfiguracionSistema.Catalogs.Entities; |
| ApprovalRoleHierarchy | ApprovalRoleHierarchy | ApprovalHierarchies | SystemLuxuryApp.Approvals.Entities; |
| MedidorCategoria | MedidorCategoria | MeterCategories | SystemLuxuryApp.ConfiguracionSistema.Catalogs.Entities; |
| TelefonosEmergencia | TelefonosEmergencia | EmergencyPhones | SystemLuxuryApp.ConfiguracionSistema.Catalogs.Entities; |

#### Database Backup (Respaldo de BD)

| DbSet | Clase | Tabla | Namespace (corto) |
|-------|-------|-------|-------------------|
| DatabaseBackupConfigs | DatabaseBackupConfig | DatabaseBackupConfigs | SystemLuxuryApp.ConfiguracionSistema.DatabaseBackup.Entities; |

#### System-AI

| DbSet | Clase | Tabla | Namespace (corto) |
|-------|-------|-------|-------------------|
| AiChatMessages | AiChatMessage | AiChatMessages | SystemLuxuryApp.SystemAI.AiChat.Entities; |
| AiChatSessions | AiChatSession | AiChatSessions | SystemLuxuryApp.SystemAI.AiChat.Entities; |

#### System-Audit & Logs

| DbSet | Clase | Tabla | Namespace (corto) |
|-------|-------|-------|-------------------|
| AuditEntries | AuditEntry | AuditEntries | SystemLuxuryApp.SystemAuditLogs.LogApp.Entities; |
| LegacyIdMaps | LegacyIdMap | LegacyIdMappings | SystemLuxuryApp.SystemAuditLogs.LogApp.Entities; |
| MigrationVerificationLogs | MigrationVerificationLog | MigrationLogs | SystemLuxuryApp.SystemAuditLogs.LogApp.Entities; |
| NotificationLogs | NotificationLog | NotificationLogs | SystemLuxuryApp.SystemTenant.Notification.Entities; |
| NotificationUser | NotificationUser | NotificationUsers | SystemLuxuryApp.SystemTenant.Notification.Entities; |

---

### 🔐 AdminLuxuryApp

**14 entidades**


#### Customer (Gestión de Cliente)

| DbSet | Clase | Tabla | Namespace (corto) |
|-------|-------|-------|-------------------|
| Customer | Customer | Customers | AdminLuxuryApp.GestionDeCliente.Customers.Entities; |
| CustomerAddress | CustomerAddress | CustomerAddresses | AdminLuxuryApp.GestionDeCliente.Customers.Entities; |
| CustomerDataCompany | CustomerEmailConfiguration | CustomerEmailConfigs | AdminLuxuryApp.GestionDeCliente.Customers.Entities; |
| CustomerImage | CustomerImage | CustomerImages | AdminLuxuryApp.GestionDeCliente.Customers.Entities; |
| CustomerLocation | CustomerLocation | CustomerLocations | AdminLuxuryApp.GestionDeCliente.Customers.Entities; |
| CustomerProvider | CustomerProvider | CustomerProviders | AdminLuxuryApp.GestionDeCliente.Customers.Entities; |

#### Identidad y Acceso (Access)

| DbSet | Clase | Tabla | Namespace (corto) |
|-------|-------|-------|-------------------|
| AccesoCustomers | AccesoCustomers | CustomerUsers | AdminLuxuryApp.SeguridadPermisos.Access.Entities; |
| ApplicationRole | ApplicationRole | Roles | AdminLuxuryApp.SeguridadPermisos.Access.Entities; |
| ApplicationUsers | ApplicationUser | Users | AdminLuxuryApp.SeguridadPermisos.Access.Entities; |
| CustomerModul | CustomerModul | ModuleCustomers | AdminLuxuryApp.SeguridadPermisos.Access.Entities; |
| ModuleApp | ModuleApp | Modules | AdminLuxuryApp.SeguridadPermisos.Access.Entities; |
| ModuleAppRol | ModuleAppRol | ModuleRoles | AdminLuxuryApp.SeguridadPermisos.Access.Entities; |
| PasswordRecoveryCodes | PasswordRecoveryCode | PasswordRecoveryCodes | AdminLuxuryApp.SeguridadPermisos.Access.Entities; |
| UserRefreshToken | UserRefreshToken | UserRefreshTokens | AdminLuxuryApp.SeguridadPermisos.Access.Entities; |

---

### 📊 ContabilidadLuxuryApp

**27 entidades**


#### Contabilidad y COI (General Ledger) 📊

| DbSet | Clase | Tabla | Namespace (corto) |
|-------|-------|-------|-------------------|
| AccountingCatalog | AccountingCatalog | AccountingCatalogs | ContabilidadLuxuryApp.AccountingCatalog.Entities; |
| CoiCobranzaAccounts | CoiCobranzaAccount | CoiAccounts | ContabilidadLuxuryApp.ContabilidadOnline.Entities; |
| CoiCobranzaBalances | CoiCobranzaBalance | CoiBalances | ContabilidadLuxuryApp.ContabilidadOnline.Entities; |
| CoiCobranzaMovements | CoiCobranzaMovement | CoiMovements | ContabilidadLuxuryApp.ContabilidadOnline.Entities; |
| CoiCobranzaPolicies | CoiCobranzaPolicy | CoiPolicies | ContabilidadLuxuryApp.ContabilidadOnline.Entities; |
| CoiFiscalPeriods | CoiFiscalPeriod | CoiFiscalPeriods | ContabilidadLuxuryApp.ContabilidadOnline.Entities; |
| ContabilidadAuxiliares | ContabilidadAuxiliar | AccountingLedgers | ContabilidadLuxuryApp.ContabilidadOnline.Entities; |
| ContabilidadCuentas | ContabilidadCuenta | AccountingAccounts | ContabilidadLuxuryApp.ContabilidadOnline.Entities; |
| ContabilidadFiscalPeriods | ContabilidadFiscalPeriod | FiscalPeriods | ContabilidadLuxuryApp.ContabilidadOnline.Entities; |
| ContabilidadPolizas | ContabilidadPoliza | AccountingPolicies | ContabilidadLuxuryApp.ContabilidadOnline.Entities; |
| ContabilidadPresupuestos | ContabilidadPresupuesto | AccountingBudgets | ContabilidadLuxuryApp.ContabilidadOnline.Entities; |
| ContabilidadSaldos | ContabilidadSaldo | AccountingBalances | ContabilidadLuxuryApp.ContabilidadOnline.Entities; |

#### Fondeos y Reporteo

| DbSet | Clase | Tabla | Namespace (corto) |
|-------|-------|-------|-------------------|
| EstadoFinanciero | EstadoFinanciero | FinancialStatements | ContabilidadLuxuryApp.FinancialAccounting.Entities; |
| FinancialApprovalRequests | FinancialApprovalRequest | ApprovalRequests | ContabilidadLuxuryApp.FinancialAccounting.Entities; |
| FinancialAuditLogs | FinancialAuditLog | FinanceAuditLogs | ContabilidadLuxuryApp.FinancialAccounting.Entities; |
| FinancialBatches | FinancialBatch | FinancialBatches | ContabilidadLuxuryApp.FinancialAccounting.Entities; |
| FinancialLedgerEntries | FinancialLedgerEntry | FinancialLedger | ContabilidadLuxuryApp.FinancialAccounting.Entities; |
| FinancialReport | FinancialReport | FinancialReportDefinitions | ContabilidadLuxuryApp.FinancialAccounting.Entities; |
| FinancialReportRow | FinancialReportRow | FinancialReportRows | ContabilidadLuxuryApp.FinancialAccounting.Entities; |
| FinancialReportRowSource | FinancialReportRowSource | FinancialReportSources | ContabilidadLuxuryApp.FinancialAccounting.Entities; |
| Funding | Funding | Fundings | ContabilidadLuxuryApp.Fondeos.Entities; |

#### Presupuestos (Budgeting)

| DbSet | Clase | Tabla | Namespace (corto) |
|-------|-------|-------|-------------------|
| BudgetAccountRule | BudgetAccountRule | BudgetAccountRules | ContabilidadLuxuryApp.Presupuesto.Entities; |
| BudgetExecution | BudgetExecution | BudgetExecutions | ContabilidadLuxuryApp.Presupuesto.Entities; |
| BudgetProposal | BudgetProposal | BudgetProposals | ContabilidadLuxuryApp.PresupuestoPropuesta.Entities; |
| BudgetProposalItem | BudgetProposalItem | BudgetProposalItems | ContabilidadLuxuryApp.PresupuestoPropuesta.Entities; |
| BudgetProposalItemHistory | BudgetProposalItemHistory | BudgetProposalHistory | ContabilidadLuxuryApp.PresupuestoPropuesta.Entities; |
| BudgetProposalItemSupportFile | BudgetProposalItemSupportFile | BudgetProposalFiles | ContabilidadLuxuryApp.PresupuestoPropuesta.Entities; |

---

### 💸 CobranzaLuxuryApp

**28 entidades**


#### Catálogos Maestros (Catalogs)

| DbSet | Clase | Tabla | Namespace (corto) |
|-------|-------|-------|-------------------|
| Bank | Bank | Banks | CobranzaLuxuryApp.CobranzaNativa.Core.Payments.Entities; |
| FormaPago | FormaPago | PaymentForms | CobranzaLuxuryApp.CobranzaNativa.Core.Payments.Entities; |
| MetodoDePago | MetodoDePago | PaymentMethods | CobranzaLuxuryApp.CobranzaNativa.Core.Payments.Entities; |
| UsoCFDI | UsoCFDI | TaxUsages | CobranzaLuxuryApp.CobranzaNativa.Core.Invoices.Entities; |

#### Cobranza y Facturación (AR)

| DbSet | Clase | Tabla | Namespace (corto) |
|-------|-------|-------|-------------------|
| AdjustmentRecords | AdjustmentRecord | AdjustmentRecords | CobranzaLuxuryApp.CobranzaNativa.Core.Approvals.Entities; |
| AspelCustomerEmpresa | AspelCustomerEmpresa | AspelCompanies | CobranzaLuxuryApp.AspelCobranzaHausLive.Entities; |
| BillingConfigs | BillingConfig | BillingConfigs | CobranzaLuxuryApp.CobranzaNativa.Contracts.ExternalCompatibility.Entities; |
| CatalogoGastosFijos | CatalogoGastosFijos | CatalogoGastosFijos | CobranzaLuxuryApp.CobranzaNativa.Core.Charges.Entities; |
| CatalogoGastosFijosDetalles | CatalogoGastosFijosDetalles | CatalogoGastosFijosDetalles | CobranzaLuxuryApp.CobranzaNativa.Core.Charges.Entities; |
| Charges | Charge | Charges | CobranzaLuxuryApp.CobranzaNativa.Core.Charges.Entities; |
| ChargePaymentAllocations | ChargePaymentAllocation | PaymentAllocations | CobranzaLuxuryApp.CobranzaNativa.Core.Charges.Entities; |
| ChargeTemplates | ChargeTemplate | ChargeTemplates | CobranzaLuxuryApp.CobranzaNativa.Core.Templates.Entities; |
| ChargeTypeCatalogs | ChargeTypeCatalog | ChargeTypeCatalogs | CobranzaLuxuryApp.CobranzaNativa.Core.ChargeTypes.Entities; |
| CobranzaAuxiliares | CobranzaAuxiliar | CollectionLedgers | CobranzaLuxuryApp.CobranzaNativa.Core.Reconciliation.Entities; |
| CobranzaCuentas | CobranzaCuenta | CollectionAccounts | CobranzaLuxuryApp.CobranzaNativa.Core.Payments.Entities; |
| CobranzaExcludedAccounts | CobranzaExcludedAccount | CollectionExclusions | CobranzaLuxuryApp.CobranzaNativa.Core.Reconciliation.Entities; |
| CobranzaPayments | CobranzaPayment | Payments | CobranzaLuxuryApp.CobranzaNativa.Core.Payments.Entities; |
| CobranzaPeriodClosures | CobranzaPeriodClosure | CollectionClosures | CobranzaLuxuryApp.CobranzaNativa.Core.PeriodClosures.Entities; |
| CobranzaPolizas | CobranzaPoliza | CollectionPolicies | CobranzaLuxuryApp.CobranzaNativa.Core.Ledger.Entities; |
| CobranzaSaldos | CobranzaSaldo | CollectionBalances | CobranzaLuxuryApp.CobranzaNativa.Core.Ledger.Entities; |
| CollectionActivities | CollectionActivity | CollectionActivities | CobranzaLuxuryApp.CobranzaNativa.Core.CollectionCases.Entities; |
| CollectionCases | CollectionCase | CollectionCases | CobranzaLuxuryApp.CobranzaNativa.Core.CollectionCases.Entities; |
| CollectionCaseCharges | CollectionCaseCharge | CaseCharges | CobranzaLuxuryApp.CobranzaNativa.Core.CollectionCases.Entities; |
| CreditNotes | CreditNote | CreditNotes | CobranzaLuxuryApp.CobranzaNativa.Core.Approvals.Entities; |
| Invoices | Invoice | Invoices | CobranzaLuxuryApp.CobranzaNativa.Core.Invoices.Entities; |
| LateFeePolicies | LateFeePolicy | InterestPolicies | CobranzaLuxuryApp.CobranzaNativa.Core.LateFees.Entities; |
| MorosidadPolicies | MorosidadPolicy | DelinquencyPolicies | CobranzaLuxuryApp.CobranzaNativa.Core.LateFees.Entities; |
| NativeCollectionNotificationSettings | NativeCollectionNotificationSetting | NativeCollectionNotificationSettings | CobranzaLuxuryApp.CobranzaNativa.Core.Notifications.Entities; |

---

### 👥 RecursosHumanosLuxuryApp

**23 entidades**


#### Asistencia y Vacaciones 🏖️

| DbSet | Clase | Tabla | Namespace (corto) |
|-------|-------|-------|-------------------|
| LeaveRequest | LeaveRequest | LeaveRequests | RecursosHumanosLuxuryApp.TimeOff.Entities; |
| LeaveRequestHistory | LeaveRequestHistory | LeaveRequestHistory | RecursosHumanosLuxuryApp.TimeOff.Entities; |
| ManualBalanceChangeLog | ManualBalanceChangeLog | VacationAdjustments | RecursosHumanosLuxuryApp.TimeOff.Entities; |
| VacationBalance | VacationBalance | VacationBalances | RecursosHumanosLuxuryApp.TimeOff.Entities; |
| VacationRequest | VacationRequest | VacationRequests | RecursosHumanosLuxuryApp.TimeOff.Entities; |
| VacationRequestHistory | VacationRequestHistory | VacationRequestHistory | RecursosHumanosLuxuryApp.TimeOff.Entities; |

#### Checador de Empleados ⏱️

| DbSet | Clase | Tabla | Namespace (corto) |
|-------|-------|-------|-------------------|
| RegistrosChecador | RegistroChecador | RegistrosChecador | RecursosHumanosLuxuryApp.ChekadorEmpleados.Entities; |
| SedesChecador | SedeChecador | SedesChecador | RecursosHumanosLuxuryApp.ChekadorEmpleados.Entities; |

#### Evaluaciones de Desempeño 🎯

| DbSet | Clase | Tabla | Namespace (corto) |
|-------|-------|-------|-------------------|
| EvaluationAnswer | EvaluationAnswer | EvaluationAnswers | RecursosHumanosLuxuryApp.Evaluacion.Entities; |
| PerformanceEvaluation | PerformanceEvaluation | EvaluationStaffs | RecursosHumanosLuxuryApp.Evaluacion.Entities; |
| TemplateCategory | TemplateCategory | EvaluationCategories | RecursosHumanosLuxuryApp.Evaluacion.Entities; |
| TemplateEvaluation | TemplateEvaluation | EvaluationTemplates | RecursosHumanosLuxuryApp.Evaluacion.Entities; |
| TemplateQuestion | TemplateQuestion | EvaluationQuestions | RecursosHumanosLuxuryApp.Evaluacion.Entities; |

#### Nómina (Payroll) 💰

| DbSet | Clase | Tabla | Namespace (corto) |
|-------|-------|-------|-------------------|
| ConfiguracionesNomina | ConfiguracionNomina | PayrollConfigs | RecursosHumanosLuxuryApp.Nomina.Entities; |
| DiasNoHabiles | DiasNoHabiles | NonWorkingDays | RecursosHumanosLuxuryApp.Nomina.Entities; |
| EvidenciasNomina | EvidenciaNomina | PayrollEvidence | RecursosHumanosLuxuryApp.Nomina.Entities; |
| IncidenciasNomina | IncidenciaNomina | PayrollIncidents | RecursosHumanosLuxuryApp.Nomina.Entities; |
| NominasDetalle | NominaDetalle | PayrollDetails | RecursosHumanosLuxuryApp.Nomina.Entities; |
| NominasEncabezado | NominaEncabezado | PayrollSummaries | RecursosHumanosLuxuryApp.Nomina.Entities; |
| PagosPrestamosNomina | PagoPrestamoNomina | LoanRepayments | RecursosHumanosLuxuryApp.Nomina.Entities; |
| PeriodosNomina | PeriodoNomina | PayrollPeriods | RecursosHumanosLuxuryApp.Nomina.Entities; |
| PrestamosEmpleado | PrestamoEmpleado | EmployeeLoans | RecursosHumanosLuxuryApp.Nomina.Entities; |
| TiemposExtra | TiempoExtra | OvertimeRecords | RecursosHumanosLuxuryApp.Nomina.Entities; |

---

### ⚖️ LegalLuxuryApp

**11 entidades**


#### Asuntos Legales y Seguros 🏛️

| DbSet | Clase | Tabla | Namespace (corto) |
|-------|-------|-------|-------------------|
| ContratoPoliza | ContratoPoliza | InsurancePolicies | LegalLuxuryApp.Legal.ContractPolicy.Entities; |
| LegalMatter | LegalMatter | LegalMatters | LegalLuxuryApp.Legal.LegalMatter.Entities; |
| PolicySnapshots | PolicySnapshot | PolicySnapshots | LegalLuxuryApp.Legal.LegalMatter.Entities; |
| RegulationArticles | RegulationArticle | RegulationArticles | LegalLuxuryApp.Legal.LegalMatter.Entities; |
| ResponsiblePartySnapshots | ResponsiblePartySnapshot | LegalResponsibleHistory | LegalLuxuryApp.Legal.LegalMatter.Entities; |

#### Catálogos Maestros (Catalogs)

| DbSet | Clase | Tabla | Namespace (corto) |
|-------|-------|-------|-------------------|
| LegalMatterCategory | LegalMatterCategory | LegalMatterCategories | LegalLuxuryApp.Legal.LegalMatter.Entities; |

#### Contratación y Legal 📜

| DbSet | Clase | Tabla | Namespace (corto) |
|-------|-------|-------|-------------------|
| ContractAddendums | ContractAddendum | ContractAddendums | LegalLuxuryApp.EmployeeContracts.Entities; |
| ContractRenewalEvaluations | ContractRenewalEvaluation | ContractRenewalEvaluations | LegalLuxuryApp.EmployeeContracts.Entities; |
| EmployeeWorkContracts | EmployeeWorkContract | EmployeeWorkContracts | LegalLuxuryApp.EmployeeContracts.Entities; |

#### Sanciones (Fines) 🚔

| DbSet | Clase | Tabla | Namespace (corto) |
|-------|-------|-------|-------------------|
| FineEvidences | FineEvidence | FineEvidence | LegalLuxuryApp.Legal.Fines.Entities; |
| PropertyFines | PropertyFine | Fines | LegalLuxuryApp.Legal.Fines.Entities; |

---

### 🔧 MantenimientoLuxuryApp

**29 entidades**


#### Bitácoras (Logs) 📓

| DbSet | Clase | Tabla | Namespace (corto) |
|-------|-------|-------|-------------------|
| BitacoraDetectorHumo | BitacoraDetectorHumo | SmokeDetectorLogs | MantenimientoLuxuryApp.SmokeDetectorLog.Entities; |
| BitacoraHidrante | BitacoraHidrante | HydrantLogs | MantenimientoLuxuryApp.HydrantLog.Entities; |
| BitacoraMantenimiento | BitacoraMantenimiento | BitacoraMantenimiento | MantenimientoLuxuryApp.MaintenanceLog.Entities; |
| ControlPrestamoHerramienta | ControlPrestamoHerramienta | ControlPrestamoHerramienta | MantenimientoLuxuryApp.ToolLoan.Entities; |
| ElevatorsEmergencyCall | ElevatorsEmergencyCall | ElevatorsEmergencyCall | MantenimientoLuxuryApp.ElevatorEmergencyCall.Entities; |
| ElevatorSparePartsChange | ElevatorSparePartsChange | ElevatorSparePartsChange | MantenimientoLuxuryApp.ElevatorSpareParts.Entities; |
| FireCycleInspectionDetector | FireCycleInspectionDetector | FireCycleInspectionDetectores | MantenimientoLuxuryApp.FireInspectionPeriods.Entities; |
| FireCycleInspectionHidrante | FireCycleInspectionHidrante | FireCycleInspectionHidrantes | MantenimientoLuxuryApp.FireInspectionPeriods.Entities; |
| FireInspectionCycle | FireInspectionCycle | FireInspectionCycles | MantenimientoLuxuryApp.FireInspectionPeriods.Entities; |
| FireInspectionPeriodEstacion | FireInspectionPeriodEstacion | FireInspectionPeriodEstaciones | MantenimientoLuxuryApp.FireInspectionPeriods.Entities; |
| FireInspectionPeriodExtintor | FireInspectionPeriodExtintor | FireInspectionPeriodExtintores | MantenimientoLuxuryApp.FireInspectionPeriods.Entities; |
| Medidor | Medidor | Medidor | MantenimientoLuxuryApp.Medidores.Entities; |
| MedidorLectura | MedidorLectura | MedidorLectura | MantenimientoLuxuryApp.Medidores.Entities; |
| Piscina | Piscina | Piscina | MantenimientoLuxuryApp.Piscina.Entities; |
| PiscinaBitacora | PiscinaBitacora | PiscinaBitacora | MantenimientoLuxuryApp.PiscinaBitacora.Entities; |
| RecepcionPipaAgua | RecepcionPipaAgua | RecepcionPipaAgua | MantenimientoLuxuryApp.RecepcionPipasAgua.Entities; |

#### Catálogos Maestros (Catalogs)

| DbSet | Clase | Tabla | Namespace (corto) |
|-------|-------|-------|-------------------|
| CatalogAsset | CatalogAsset | CatalogAssets | MantenimientoLuxuryApp.MachineryAsset.Entities; |
| EquipoClasificacion | EquipoClasificacion | EquipmentClassifications | MantenimientoLuxuryApp.Machinery.Entities; |

#### Equipos y Maquinaria 🚜

| DbSet | Clase | Tabla | Namespace (corto) |
|-------|-------|-------|-------------------|
| Equipment | Equipment | Equipment | MantenimientoLuxuryApp.Machinery.Entities; |
| EquipmentDocuments | EquipmentDocument | EquipmentDocuments | MantenimientoLuxuryApp.MachineryDocument.Entities; |
| EquipmentInspectionCriterion | EquipmentInspectionCriterion | EquipmentInspectionCriteria | MantenimientoLuxuryApp.EquipmentInspections.Entities; |
| EquipmentInspectionDefinitionAssignee | EquipmentInspectionDefinitionAssignee | EquipmentInspectionDefinitionAssignees | MantenimientoLuxuryApp.EquipmentInspections.Entities; |
| EquipmentInspectionExecutionItem | EquipmentInspectionExecutionItem | EquipmentInspectionExecutionItems | MantenimientoLuxuryApp.EquipmentInspections.Entities; |
| EquipmentQrLabel | EquipmentQrLabel | EquipmentQrLabels | MantenimientoLuxuryApp.EquipmentInspections.Entities; |

#### Planificación de Mantenimiento 🗓️

| DbSet | Clase | Tabla | Namespace (corto) |
|-------|-------|-------|-------------------|
| CalendarioMaestro | CalendarioMaestro | CalendarioMaestro | MantenimientoLuxuryApp.CalendarioMaestro.Entities; |
| CalendarioMaestroEquipo | CalendarioMaestroEquipo | CalendarioMaestroEquipo | MantenimientoLuxuryApp.CalendarioMaestroEquipo.Entities; |
| CalendarioMaestroProvider | CalendarioMaestroProvider | CalendarioMaestroProvider | MantenimientoLuxuryApp.CalendarioMaestro.Entities; |
| MaintenanceBudgetForecast | MaintenanceBudgetForecast | MaintenanceBudgetForecast | MantenimientoLuxuryApp.BudgetMaintenance.Entities; |
| MaintenanceCalendar | MaintenanceCalendar | MaintenanceCalendar | MantenimientoLuxuryApp.MaintenanceCalendars.Entities; |

---

### ⚙️ OperationsLuxuryApp

**109 entidades**


#### Alertas de Pánico (Panic Alert) 🚨

| DbSet | Clase | Tabla | Namespace (corto) |
|-------|-------|-------|-------------------|
| PanicAlerts | PanicAlert | PanicAlerts | OperationsLuxuryApp.PanicAlert.Entities; |

#### Anuncios y Comunicados (Announcements) 📢

| DbSet | Clase | Tabla | Namespace (corto) |
|-------|-------|-------|-------------------|
| Announcement | Announcement | Announcements | OperationsLuxuryApp.Announcement.Entities; |
| AnnouncementAnalytics | AnnouncementAnalyticsEntry | AnnouncementAnalytics | OperationsLuxuryApp.Announcement.Entities; |
| AnnouncementAttachments | AnnouncementAttachment | AnnouncementFiles | OperationsLuxuryApp.Announcement.Entities; |
| AnnouncementCustomers | AnnouncementCustomer | AnnouncementCustomers | OperationsLuxuryApp.Announcement.Entities; |
| AnnouncementRoles | AnnouncementRole | AnnouncementRoles | OperationsLuxuryApp.Announcement.Entities; |

#### Asambleas y Planificación 🏛️

| DbSet | Clase | Tabla | Namespace (corto) |
|-------|-------|-------|-------------------|
| AsambleaChecklistExecution | AsambleaChecklistExecution | AssemblyChecklistLogs | OperationsLuxuryApp.JuntasMensuales.Asamblea.Entities; |
| AsambleaChecklistTemplate | AsambleaChecklistTemplate | AssemblyChecklistTemplates | OperationsLuxuryApp.JuntasMensuales.Asamblea.Entities; |
| AsambleaInvitado | AsambleaInvitado | AssemblyGuests | OperationsLuxuryApp.JuntasMensuales.Asamblea.Entities; |
| AsambleaPlan | AsambleaPlan | AssemblyPlans | OperationsLuxuryApp.JuntasMensuales.Asamblea.Entities; |
| AsambleaSupportRequest | AsambleaSupportRequest | AssemblySupport | OperationsLuxuryApp.JuntasMensuales.Asamblea.Entities; |

#### Catálogos Maestros (Catalogs)

| DbSet | Clase | Tabla | Namespace (corto) |
|-------|-------|-------|-------------------|
| Category | Category | Categories | OperationsLuxuryApp.Inventory.Entities; |
| Producto | Producto | Products | OperationsLuxuryApp.Inventory.Entities; |
| UnidadMedida | UnidadMedida | UnitsOfMeasure | OperationsLuxuryApp.Inventory.Entities; |
| WorkGroupCategories | WorkGroupCategories | WorkGroupCategories | OperationsLuxuryApp.Tasks.WorkGroupCategories.Entities; |

#### Control de Acceso (Access Control) 🚪

| DbSet | Clase | Tabla | Namespace (corto) |
|-------|-------|-------|-------------------|
| AccessCredentials | AccessCredential | AccessCredentials | OperationsLuxuryApp.AccessControl.Entities; |
| AccessPoints | AccessPoint | AccessPoints | OperationsLuxuryApp.AccessControl.Entities; |
| AccessGuardShifts | GuardShift | AccessGuardShifts | OperationsLuxuryApp.AccessControl.Entities; |
| AccessVisitors | Visitor | AccessVisitors | OperationsLuxuryApp.AccessControl.Entities; |

#### Diagramas (Diagrams) 📐

| DbSet | Clase | Tabla | Namespace (corto) |
|-------|-------|-------|-------------------|
| DiagramDraw | DiagramDraw | Diagrams | OperationsLuxuryApp.Diagram.Entities; |
| DiagramDrawTargetCustomer | DiagramDrawTargetCustomer | DiagramCustomers | OperationsLuxuryApp.Diagram.Entities; |
| DiagramDrawTargetRole | DiagramDrawTargetRole | DiagramRoles | OperationsLuxuryApp.Diagram.Entities; |

#### Equipos y Maquinaria 🚜

| DbSet | Clase | Tabla | Namespace (corto) |
|-------|-------|-------|-------------------|
| Tool | Tool | Tools | OperationsLuxuryApp.Inventory.Entities; |

#### Estructura Organizacional 🌳

| DbSet | Clase | Tabla | Namespace (corto) |
|-------|-------|-------|-------------------|
| DiaDeTrabajo | DiaDeTrabajo | WorkPositionScheduleDays | OperationsLuxuryApp.Recruitment.WorkPositions.Entities; |
| JobDescription | JobDescription | JobDescriptions | OperationsLuxuryApp.Recruitment.JobDescriptions.Entities; |
| WorkPosition | WorkPosition | JobPositions | OperationsLuxuryApp.Recruitment.WorkPositions.Entities; |

#### Formatos Personalizados (Custom Documents) 📄

| DbSet | Clase | Tabla | Namespace (corto) |
|-------|-------|-------|-------------------|
| CustomDocument | CustomDocument | CustomDocuments | OperationsLuxuryApp.CustomDocument.Entities; |
| CustomDocumentRole | CustomDocumentRole | CustomDocumentPermissions | OperationsLuxuryApp.CustomDocument.Entities; |

#### Gestión de Incidentes y Sanciones ⚠️

| DbSet | Clase | Tabla | Namespace (corto) |
|-------|-------|-------|-------------------|
| Incidents | Incident | Incidents | OperationsLuxuryApp.IncidenciasAdministrativas.Entities; |
| IncidentAttachments | IncidentAttachment | IncidentFiles | OperationsLuxuryApp.IncidenciasAdministrativas.Entities; |
| IncidentTypes | IncidentType | IncidentTypes | OperationsLuxuryApp.IncidenciasAdministrativas.Entities; |
| IncidentWitnesses | IncidentWitness | IncidentWitnesses | OperationsLuxuryApp.IncidenciasAdministrativas.Entities; |
| Sanctions | Sanction | StaffSanctions | OperationsLuxuryApp.IncidenciasAdministrativas.Entities; |
| SanctionTypes | SanctionType | SanctionTypes | OperationsLuxuryApp.IncidenciasAdministrativas.Entities; |
| SuspensionDays | SuspensionDay | StaffSuspensionDays | OperationsLuxuryApp.IncidenciasAdministrativas.Entities; |

#### Gestión de Tareas (Task Engine) 🚀

| DbSet | Clase | Tabla | Namespace (corto) |
|-------|-------|-------|-------------------|
| CustomerTaskItemConfig | CustomerTaskItemConfig | TaskCustomerItemConfigs | OperationsLuxuryApp.Tasks.RecurringTaskCatalog.Entities; |
| RecurringTaskTemplate | RecurringTaskTemplate | TaskRecurringTemplates | OperationsLuxuryApp.Tasks.RecurringTaskCatalog.Entities; |
| TaskAlertLog | TaskAlertLog | TaskAlertLogs | OperationsLuxuryApp.Tasks.RecurringTaskAlerting.Entities; |
| TaskAttachment | TaskAttachment | TaskFiles | OperationsLuxuryApp.Tasks.TaskAttachment.Entities; |
| TaskChangeLog | TaskChangeLog | TaskAuditLogs | OperationsLuxuryApp.Tasks.Tasks.Entities; |
| TaskChecklistItem | TaskChecklistItem | TaskChecklistItems | OperationsLuxuryApp.Tasks.TaskChecklist.Entities; |
| TaskComment | TaskComment | TaskComments | OperationsLuxuryApp.Tasks.Tasks.Entities; |
| TaskFollowUp | TaskFollowUp | TaskFollowUps | OperationsLuxuryApp.Tasks.TaskFollowUp.Entities; |
| TaskInstance | TaskInstance | TaskInstances | OperationsLuxuryApp.Tasks.Tasks.Entities; |
| TaskJustification | TaskJustification | TaskJustifications | OperationsLuxuryApp.Tasks.TaskJustification.Entities; |
| TaskMessageReads | TaskMessageRead | TaskMessageReads | OperationsLuxuryApp.Tasks.TaskMessageReads.Entities |
| Tasks | TaskRecord | Tasks | OperationsLuxuryApp.Task.Tasks.Entities |
| TaskServiceOrder | TaskServiceOrder | TaskServiceOrders | OperationsLuxuryApp.Tasks.Tasks.Entities; |
| TaskTemplate | TaskTemplate | TaskTemplates | OperationsLuxuryApp.Tasks.RecurringTaskCatalog.Entities; |
| TaskTemplateCustomer | TaskTemplateCustomer | TaskCustomerTemplates | OperationsLuxuryApp.Tasks.RecurringTaskCatalog.Entities; |
| TaskTemplateItem | TaskTemplateItem | TaskTemplateItems | OperationsLuxuryApp.Tasks.RecurringTaskCatalog.Entities; |
| TaskTemplateRole | TaskTemplateRole | TaskTemplateRole | NOT_FOUND |
| TaskWeeklyWork | TaskWeeklyWork | TaskWeeklyReports | OperationsLuxuryApp.Tasks.TaskWorkPlan.Entities; |
| TaskWorkPlan | TaskWorkPlan | TaskWorkPlans | OperationsLuxuryApp.Tasks.TaskWorkPlan.Entities; |
| WorkGroup | WorkGroup | TaskWorkGroups | OperationsLuxuryApp.Tasks.WorkGroup.Entities; |
| WorkGroupMembers | WorkGroupMember | TaskWorkGroupMembers | OperationsLuxuryApp.Tasks.WorkGroupMembers.Entities |

#### Inspecciones y Auditoría 🕵️

| DbSet | Clase | Tabla | Namespace (corto) |
|-------|-------|-------|-------------------|
| CustomerInspection | CustomerInspection | CustomerInspections | OperationsLuxuryApp.Inspections.Entities; |
| Inspection | Inspection | Inspections | OperationsLuxuryApp.Inspections.Entities; |
| InspectionCondominiumAsset | InspectionCondominiumAsset | InspectionAssets | OperationsLuxuryApp.Inspections.Entities; |
| InspectionResult | InspectionResult | InspectionFindings | OperationsLuxuryApp.Inspections.Entities; |
| InspectionResultImage | InspectionResultImage | InspectionImages | OperationsLuxuryApp.Inspections.Entities; |
| InspectionReviews | InspectionReview | InspectionReviews | OperationsLuxuryApp.Inspections.Entities |
| InspectionReviewsCatalog | InspectionReviewsCatalog | InspectionCriteria | OperationsLuxuryApp.Inspections.Entities; |
| InspectionWeeklyDay | InspectionWeeklyDay | InspectionSchedules | OperationsLuxuryApp.Inspections.Entities; |
| ReportDefinitions | ReportDefinition | ReportDefinitions | OperationsLuxuryApp.Inspections.Entities; |
| ReportSubmissionRecord | ReportSubmissionRecord | ReportSubmissions | OperationsLuxuryApp.Inspections.Entities; |

#### Inventarios y Almacén 📦

| DbSet | Clase | Tabla | Namespace (corto) |
|-------|-------|-------|-------------------|
| Almacen | Almacen | Warehouses | OperationsLuxuryApp.Inventory.Entities; |
| AlmacenUsuarioResponsable | AlmacenUsuarioResponsable | WarehouseCustodians | OperationsLuxuryApp.Inventory.Entities; |
| EntradaProducto | EntradaProducto | InventoryInputs | OperationsLuxuryApp.Inventory.Entities; |
| InventarioDetectorHumo | InventarioDetectorHumo | SmokeDetectors | OperationsLuxuryApp.Inventory.Entities; |
| InventarioHidrante | InventarioHidrante | Hydrants | OperationsLuxuryApp.Inventory.Entities; |
| InventarioIluminacion | InventarioIluminacion | LightingStock | OperationsLuxuryApp.Inventory.Entities; |
| InventarioLlave | InventarioLlave | KeyInventory | OperationsLuxuryApp.Inventory.Entities; |
| InventarioPintura | InventarioPintura | PaintStock | OperationsLuxuryApp.Inventory.Entities; |
| RadioComunicacion | RadioComunicacion | RadioDevices | OperationsLuxuryApp.Inventory.Entities; |
| SalidaProducto | SalidaProducto | InventoryOutputs | OperationsLuxuryApp.Inventory.Entities; |
| StockPorAlmacen | StockPorAlmacen | WarehouseStock | OperationsLuxuryApp.Inventory.Entities; |

#### Manuales Operativos (Manuals) 📖

| DbSet | Clase | Tabla | Namespace (corto) |
|-------|-------|-------|-------------------|
| ManualDiagram | ManualDiagram | ManualFlows | OperationsLuxuryApp.Comite.Manuals.Entities; |
| ManualPaso | ManualPaso | ManualSteps | OperationsLuxuryApp.Comite.Manuals.Entities; |
| ManualPasoEnlace | ManualPasoEnlace | ManualStepLinks | OperationsLuxuryApp.Comite.Manuals.Entities; |
| ManualPasoImagen | ManualPasoImagen | ManualStepImages | OperationsLuxuryApp.Comite.Manuals.Entities; |
| ManualPasoResponsable | ManualPasoResponsable | ManualStepResponsibles | OperationsLuxuryApp.Comite.Manuals.Entities; |
| ManualTemplate | ManualTemplate | ManualTemplates | OperationsLuxuryApp.Comite.Manuals.Entities; |
| ManualTemplateAttachment | ManualTemplateAttachment | ManualTemplateAttachments | OperationsLuxuryApp.Comite.Manuals.Entities; |
| ManualTemplateCustomer | ManualTemplateCustomer | ManualCustomerTemplates | OperationsLuxuryApp.Comite.Manuals.Entities; |
| ManualTemplateRole | ManualTemplateRole | ManualRoleTemplates | OperationsLuxuryApp.Comite.Manuals.Entities; |
| ManualTemplateVersion | ManualTemplateVersion | ManualVersions | OperationsLuxuryApp.Comite.Manuals.Entities; |

#### Propiedades (Properties) 🏡

| DbSet | Clase | Tabla | Namespace (corto) |
|-------|-------|-------|-------------------|
| CatalogoEntregaRecepcionDescripcion | CatalogoEntregaRecepcionDescripcion | DeliveryCriteria | OperationsLuxuryApp.DeliveryReception.Entities; |
| EntregaRecepcionCliente | EntregaRecepcionCliente | UnitDeliveries | OperationsLuxuryApp.DeliveryReception.Entities; |
| EntregaRecepcionDescripcion | EntregaRecepcionDescripcion | DeliveryDetails | OperationsLuxuryApp.DeliveryReception.Entities; |
| Property | Property | Units | OperationsLuxuryApp.Property.Entities; |
| PropertyMembers | PropertyMember | UnitMembers | OperationsLuxuryApp.Property.Entities; |
| PropertyOccupant | PropertyOccupant | UnitOccupants | OperationsLuxuryApp.PropertyOccupant.Entities; |

#### Reuniones y Juntas (Meetings) 🤝

| DbSet | Clase | Tabla | Namespace (corto) |
|-------|-------|-------|-------------------|
| ComiteVigilancia | ComiteVigilancia | ComiteVigilancia | OperationsLuxuryApp.Comite.ComiteVigilancia.Entities; |
| Meeting | Meeting | Meetings | OperationsLuxuryApp.JuntasMensuales.Minuta.Entities; |
| MeetingAdministracion | MeetingAdministracion | MeetingAdminSessions | OperationsLuxuryApp.JuntasMensuales.Minuta.Entities; |
| MeetingComite | MeetingComite | MeetingBoardSessions | OperationsLuxuryApp.JuntasMensuales.Minuta.Entities; |
| MeetingDetails | MeetingDetails | MeetingAgendas | OperationsLuxuryApp.JuntasMensuales.Minuta.Entities; |
| MeetingDetailsSeguimiento | MeetingDetailsSeguimiento | MeetingFollowUps | OperationsLuxuryApp.JuntasMensuales.Minuta.Entities; |
| MeetingInvitado | MeetingInvitado | MeetingParticipants | OperationsLuxuryApp.JuntasMensuales.Minuta.Entities; |
| PresentacionJuntaComite | PresentacionJuntaComite | MeetingBoardPresentations | OperationsLuxuryApp.JuntasMensuales.Presentacion.Entities; |
| TaskMeetings | TaskMeeting | MeetingTaskLinks | OperationsLuxuryApp.JuntasMensuales.Minuta.Entities; |

#### Supervisión (Supervision) 🛡️

| DbSet | Clase | Tabla | Namespace (corto) |
|-------|-------|-------|-------------------|
| AgendaSupervision | AgendaSupervision | SupervisionVisits | OperationsLuxuryApp.Supervision.Supervision.Entities; |

#### System-GoogleCalendar

| DbSet | Clase | Tabla | Namespace (corto) |
|-------|-------|-------|-------------------|
| GoogleCalendarEvent | GoogleCalendarEvent | GoogleCalendarEvents | OperationsLuxuryApp.GoogleCalendar.Entities; |
| GoogleCalendarGuest | GoogleCalendarGuest | GoogleCalendarGuests | OperationsLuxuryApp.GoogleCalendar.Entities; |
| JuntaMensualSession | JuntaMensualSession | MeetingSessions | OperationsLuxuryApp.JuntasMensuales.Session.Entities; |

#### Órdenes de Servicio (Field Service) 🛠️

| DbSet | Clase | Tabla | Namespace (corto) |
|-------|-------|-------|-------------------|
| ServiceOrder | ServiceOrder | ServiceOrders | OperationsLuxuryApp.ServiceOrder.Entities; |
| ServiceOrderDocument | ServiceOrderDocument | ServiceOrderFiles | OperationsLuxuryApp.ServiceOrder.Entities; |
| ServiceOrderImg | ServiceOrderImg | ServiceOrderImages | OperationsLuxuryApp.ServiceOrder.Entities; |

---

### 🛒 ComprasLuxuryApp

**16 entidades**


#### Cotizaciones (Quotes) 💵

| DbSet | Clase | Tabla | Namespace (corto) |
|-------|-------|-------|-------------------|
| CotizacionDetalle | CotizacionDetalle | QuoteItems | ComprasLuxuryApp.SolicitudesCompra.Detalle.Entities; |
| CotizacionProveedor | CotizacionProveedor | Quotes | ComprasLuxuryApp.SolicitudesCompra.Shared.Entities; |
| CotizacionProveedorEvidence | CotizacionProveedorEvidence | QuoteFiles | ComprasLuxuryApp.SolicitudesCompra.Evidencia.Entities; |

#### Orden de Compra (PO) 🧾

| DbSet | Clase | Tabla | Namespace (corto) |
|-------|-------|-------|-------------------|
| CatalogPurchaseOrderBudget | CatalogPurchaseOrderBudget | PurchaseOrderBudgetTypes | ComprasLuxuryApp.PurchaseOrders.Entities; |
| OrdenCompra | OrdenCompra | PurchaseOrders | ComprasLuxuryApp.PurchaseOrders.Entities; |
| OrdenCompraAuth | OrdenCompraAuth | PurchaseOrderApprovals | ComprasLuxuryApp.PurchaseOrders.Entities; |
| OrdenCompraComprobantePago | OrdenCompraComprobantePago | PurchaseOrderPayments | ComprasLuxuryApp.PurchaseOrders.Entities; |
| OrdenCompraDatosPago | OrdenCompraDatosPago | ProviderBankingInfo | ComprasLuxuryApp.PurchaseOrders.Entities; |
| OrdenCompraDetalle | OrdenCompraDetalle | PurchaseOrderItems | ComprasLuxuryApp.PurchaseOrders.Entities; |
| OrdenCompraFactura | OrdenCompraFactura | PurchaseOrderInvoices | ComprasLuxuryApp.PurchaseOrders.Entities; |
| OrdenCompraStatus | OrdenCompraStatus | PurchaseOrderHistory | ComprasLuxuryApp.PurchaseOrders.Entities; |
| PurchaseOrderBudget | PurchaseOrderBudget | PurchaseOrderBudgets | ComprasLuxuryApp.PurchaseOrders.Entities; |

#### Solicitud de Compra (PR) 📝

| DbSet | Clase | Tabla | Namespace (corto) |
|-------|-------|-------|-------------------|
| SolicitudCompra | SolicitudCompra | PurchaseRequests | ComprasLuxuryApp.SolicitudesCompra.Shared.Entities; |
| SolicitudCompraBudget | SolicitudCompraBudget | PurchaseRequestBudgets | ComprasLuxuryApp.SolicitudesCompra.Presupuesto.Entities; |
| SolicitudCompraDetalle | SolicitudCompraDetalle | PurchaseRequestItems | ComprasLuxuryApp.SolicitudesCompra.Detalle.Entities; |
| SolicitudCompraEvidence | SolicitudCompraEvidence | PurchaseRequestFiles | ComprasLuxuryApp.SolicitudesCompra.Evidencia.Entities; |

---

### 🎯 ReclutamientoLuxuryApp

**29 entidades**


#### Estructura Organizacional 🌳

| DbSet | Clase | Tabla | Namespace (corto) |
|-------|-------|-------|-------------------|
| OrgHierarchy | OrgHierarchy | OrganizationHierarchy | ReclutamientoLuxuryApp.EmployeeOrganigrama.Entities; |

#### Expediente del Empleado 📋

| DbSet | Clase | Tabla | Namespace (corto) |
|-------|-------|-------|-------------------|
| ChecklistOptionCatalog | ChecklistOptionCatalog | ChecklistOptionCatalogs | ReclutamientoLuxuryApp.EmployeeFile.Entities; |
| ChecklistOptionCatalogRole | ChecklistOptionCatalogRole | ChecklistOptionCatalogRoles | ReclutamientoLuxuryApp.EmployeeFile.Entities; |
| DocumentCatalog | DocumentCatalog | DocumentCatalogs | ReclutamientoLuxuryApp.EmployeeFile.Entities; |
| Employee | Employee | Employees | ReclutamientoLuxuryApp.EmployeeFile.Entities; |
| EmployeeBankData | EmployeeBankData | EmployeeBankData | ReclutamientoLuxuryApp.EmployeeFile.Entities; |
| EmployeeBeneficiary | EmployeeBeneficiary | EmployeeBeneficiary | ReclutamientoLuxuryApp.EmployeeFile.Entities; |
| EmployeeClinicalData | EmployeeClinicalData | EmployeeClinicalData | ReclutamientoLuxuryApp.EmployeeFile.Entities; |
| EmployeeDocument | EmployeeDocument | EmployeeDocuments | ReclutamientoLuxuryApp.EmployeeFile.Entities; |
| EmployeeEmergencyContact | EmployeeEmergencyContact | EmployeeEmergencyContacts | ReclutamientoLuxuryApp.EmployeeFile.Entities; |
| EmployeeOnboardingChecklist | EmployeeOnboardingChecklist | EmployeeOnboardingChecklists | ReclutamientoLuxuryApp.EmployeeFile.Entities; |
| PersonData | PersonData | EmployeePersonData | ReclutamientoLuxuryApp.EmployeeFile.Entities; |

#### Gestion de Candidatos 🎯

| DbSet | Clase | Tabla | Namespace (corto) |
|-------|-------|-------|-------------------|
| Candidate | Candidate | RecruitmentCandidates | ReclutamientoLuxuryApp.NewFolder.Candidates.Entities; |
| CandidateApplicationRole | CandidateApplicationRole | RecruitmentCandidateApplicationRoles | ReclutamientoLuxuryApp.NewFolder.Candidates.Entities; |
| CandidateInterview | CandidateInterview | RecruitmentCandidateInterviews | ReclutamientoLuxuryApp.NewFolder.Candidates.Entities; |
| CandidateProcess | CandidateProcess | RecruitmentCandidateProcesses | ReclutamientoLuxuryApp.NewFolder.CandidateProcesses.Entities; |
| CandidateWorkExperience | CandidateWorkExperience | RecruitmentCandidateWorkExperiences | ReclutamientoLuxuryApp.NewFolder.CandidatesWorkExperience.Entities; |
| InterviewerMatrix | InterviewerMatrix | RecruitmentInterviewerMatrix | ReclutamientoLuxuryApp.InterviewerMatrices.Entities; |
| RecruitmentSourceCatalog | RecruitmentSourceCatalog | RecruitmentSourceCatalogs | ReclutamientoLuxuryApp.RecruitmentSourceCatalogs.Entities; |
| RequestEmployeeRegisterFile | RequestEmployeeRegisterFile | RecruitmentRequestEmployeeRegisterFiles | ReclutamientoLuxuryApp.RequestEmployeeRegisters.Entities; |

#### Personal Externo (External Staff) 👷

| DbSet | Clase | Tabla | Namespace (corto) |
|-------|-------|-------|-------------------|
| EmployeeExternal | EmployeeExternal | ExternalStaff | ReclutamientoLuxuryApp.EmployeesExternal.Entities; |

#### Reclutamiento y Altas/Bajas 👨‍💼

| DbSet | Clase | Tabla | Namespace (corto) |
|-------|-------|-------|-------------------|
| RequestDismissal | RequestDismissal | TerminationRequests | ReclutamientoLuxuryApp.RequestDismissals.Entities; |
| RequestDismissalDiscount | RequestDismissalDiscount | TerminationDeductions | ReclutamientoLuxuryApp.RequestDismissalDiscounts.Entities; |
| RequestDismissalEvaluation | RequestDismissalEvaluation | TerminationEvaluations | ReclutamientoLuxuryApp.RequestDismissals.Entities; |
| RequestDismissalFile | RequestDismissalFile | TerminationFiles | ReclutamientoLuxuryApp.RequestDismissals.Entities; |
| RequestDismissalIncident | RequestDismissalIncident | TerminationIncidents | ReclutamientoLuxuryApp.RequestDismissals.Entities; |
| RequestEmployeeRegister | RequestEmployeeRegister | StaffHiringRequests | ReclutamientoLuxuryApp.RequestEmployeeRegisters.Entities; |
| RequestPosition | RequestPosition | JobVacancyRequests | ReclutamientoLuxuryApp.RequestPositions.Entities; |
| RequestSalaryModification | RequestSalaryModification | SalaryChangeRequests | ReclutamientoLuxuryApp.SalaryModifications.Entities; |

---

### 🤝 SupplierLuxuryApp

**4 entidades**

| DbSet | Clase | Tabla | Namespace (corto) |
|-------|-------|-------|-------------------|
| CategoryProvider | CategoryProvider | ProviderCategories | SupplierLuxuryApp.Provider.Entities; |
| PersonProviderSupport | PersonProviderSupport | PersonProviderSupport | SupplierLuxuryApp.Provider.Entities; |
| Provider | Provider | Providers | SupplierLuxuryApp.Provider.Entities; |
| QualificationProvider | QualificationProvider | ProviderRatings | SupplierLuxuryApp.ProviderQualification.Entities; |

---

## 4️⃣ Entidades Inactivas (comentadas)

| Clase | DbSet | Comentario |
|-------|-------|------------|
| `TaskTemplateRole` | `TaskTemplateRole` | Comentado en `ApplicationDbContext.cs:507` — no está registrado como DbSet activo |
