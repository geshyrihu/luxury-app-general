# Plan: Fragmentación de ApplicationDbContext.cs con IEntityTypeConfiguration

**Fecha:** 2026-09-11  
**Estado:** Propuesta  
**Archivo actual:** `Infrastructure/Data/ApplicationDbContext.cs` (~2020 líneas)

---

## 1. Problema Actual

`ApplicationDbContext.cs` contiene:
- **319 DbSets** distribuidos en 8 módulos
- **OnModelCreating** con ~385 líneas de configuración inline
- **Lógica de auditoría** (SaveChanges + helpers)
- **Filtros globales** y **configuraciones TPC**

El archivo es difícil de mantener, navegar y hacer merge.

---

## 2. Estrategia: IEntityTypeConfiguration\<T\>

### 2.1 Principio

Cada entidad recibe su propia clase de configuración. El DbContext solo:
1. Declara los DbSets
2. Ejecuta `ApplyConfigurationsFromAssembly()`
3. Contiene lógica de auditoría (SaveChanges)

### 2.2 Estructura de carpetas (espejo de Entities)

La estructura de `Configurations/` es **idéntica** a `Entities/`:

```
Infrastructure/Data/
├── ApplicationDbContext.cs              ← ~250 líneas (DbSets + auditoría)
├── ApplicationDbContextFactory.cs      ← sin cambios
│
├── Entities/                           ← YA EXISTE
│   ├── AdminLuxuryApp/
│   ├── CobranzaLuxuryApp/
│   ├── ComprasLuxuryApp/
│   ├── ContabilidadLuxuryApp/
│   ├── LegalLuxuryApp/
│   ├── MantenimientoLuxuryApp/
│   ├── OperationsLuxuryApp/
│   ├── ReclutamientoLuxuryApp/
│   ├── RecursosHumanosLuxuryApp/
│   └── SharedLuxuryApp/
│
└── Configurations/                     ← NUEVO (mismo patrón)
    ├── AdminLuxuryApp/
    │   ├── CustomerUserConfiguration.cs
    │   ├── CustomerModulConfiguration.cs
    │   ├── ApplicationRoleConfiguration.cs
    │   ├── ApplicationUserConfiguration.cs
    │   ├── ModuleAppConfiguration.cs
    │   ├── ModuleAppRolConfiguration.cs
    │   ├── UserRefreshTokenConfiguration.cs
    │   ├── PasswordRecoveryCodeConfiguration.cs
    │   ├── CustomerConfiguration.cs
    │   ├── CustomerAddressConfiguration.cs
    │   ├── CustomerLocationConfiguration.cs
    │   ├── CustomerEmailConfigurationConfiguration.cs
    │   ├── CustomerImageConfiguration.cs
    │   ├── CustomerProviderConfiguration.cs
    │   ├── ApprovalRoleHierarchyConfiguration.cs
    │   ├── DatabaseBackupConfigConfiguration.cs
    │   ├── DatabaseBackupHistoryConfiguration.cs
    │   ├── AiChatMessageConfiguration.cs
    │   ├── AiChatSessionConfiguration.cs
    │   ├── AuditEntryConfiguration.cs
    │   ├── LegacyIdMapConfiguration.cs
    │   ├── MigrationVerificationLogConfiguration.cs
    │   ├── NotificationLogConfiguration.cs
    │   └── NotificationUserConfiguration.cs
    │
    ├── CobranzaLuxuryApp/
    │   ├── AspelCustomerEmpresaConfiguration.cs
    │   ├── BillingConfigConfiguration.cs
    │   ├── AdjustmentRecordConfiguration.cs
    │   ├── CreditNoteConfiguration.cs
    │   ├── ChargeConfiguration.cs
    │   ├── ChargePaymentAllocationConfiguration.cs
    │   ├── FixedExpenseCatalogConfiguration.cs
    │   ├── FixedExpenseCatalogDetailConfiguration.cs
    │   ├── ChargeTypeCatalogConfiguration.cs
    │   ├── CollectionActivityConfiguration.cs
    │   ├── CollectionCaseConfiguration.cs
    │   ├── CollectionCaseChargeConfiguration.cs
    │   ├── InvoiceConfiguration.cs
    │   ├── UsoCFDIConfiguration.cs
    │   ├── LateFeePolicyConfiguration.cs
    │   ├── MorosidadPolicyConfiguration.cs
    │   ├── CobranzaPolizaConfiguration.cs
    │   ├── CobranzaSaldoConfiguration.cs
    │   ├── NativeCollectionNotificationSettingConfiguration.cs
    │   ├── BankConfiguration.cs
    │   ├── CobranzaCuentaConfiguration.cs
    │   ├── CobranzaPaymentConfiguration.cs
    │   ├── FormaPagoConfiguration.cs
    │   ├── MetodoDePagoConfiguration.cs
    │   ├── CollectionPeriodClosureConfiguration.cs
    │   ├── CobranzaAuxiliarConfiguration.cs
    │   ├── CobranzaExcludedAccountConfiguration.cs
    │   └── ChargeTemplateConfiguration.cs
    │
    ├── ComprasLuxuryApp/
    │   ├── SolicitudCompraConfiguration.cs
    │   ├── SolicitudCompraDetalleConfiguration.cs
    │   ├── SolicitudCompraEvidenceConfiguration.cs
    │   ├── SolicitudCompraBudgetConfiguration.cs
    │   ├── CotizacionProveedorConfiguration.cs
    │   ├── CotizacionDetalleConfiguration.cs
    │   ├── CotizacionProveedorEvidenceConfiguration.cs
    │   ├── OrdenCompraConfiguration.cs
    │   ├── OrdenCompraDetalleConfiguration.cs
    │   ├── OrdenCompraAuthConfiguration.cs
    │   ├── OrdenCompraFacturaConfiguration.cs
    │   ├── OrdenCompraComprobantePagoConfiguration.cs
    │   ├── OrdenCompraStatusConfiguration.cs
    │   ├── OrdenCompraDatosPagoConfiguration.cs
    │   ├── PurchaseOrderBudgetConfiguration.cs
    │   └── CatalogPurchaseOrderBudgetConfiguration.cs
    │
    ├── ContabilidadLuxuryApp/
    │   ├── AccountingCatalogConfiguration.cs
    │   ├── ContabilidadAuxiliarConfiguration.cs
    │   ├── ContabilidadCuentaConfiguration.cs
    │   ├── ContabilidadFiscalPeriodConfiguration.cs
    │   ├── ContabilidadPolizaConfiguration.cs
    │   ├── ContabilidadPresupuestoConfiguration.cs
    │   ├── ContabilidadSaldoConfiguration.cs
    │   ├── CoiCobranzaAccountConfiguration.cs
    │   ├── CoiCobranzaBalanceConfiguration.cs
    │   ├── CoiCobranzaMovementConfiguration.cs
    │   ├── CoiCobranzaPolicyConfiguration.cs
    │   ├── CoiFiscalPeriodConfiguration.cs
    │   ├── BudgetAccountRuleConfiguration.cs
    │   ├── BudgetExecutionConfiguration.cs
    │   ├── BudgetProposalConfiguration.cs
    │   ├── BudgetProposalItemConfiguration.cs
    │   ├── BudgetProposalItemHistoryConfiguration.cs
    │   ├── BudgetProposalItemSupportFileConfiguration.cs
    │   ├── FundingConfiguration.cs
    │   ├── EstadoFinancieroConfiguration.cs
    │   ├── FinancialApprovalRequestConfiguration.cs
    │   ├── FinancialAuditLogConfiguration.cs
    │   ├── FinancialBatchConfiguration.cs
    │   ├── FinancialLedgerEntryConfiguration.cs
    │   ├── FinancialReportConfiguration.cs
    │   ├── FinancialReportRowConfiguration.cs
    │   └── FinancialReportRowSourceConfiguration.cs
    │
    ├── LegalLuxuryApp/
    │   ├── EmployeeWorkContractConfiguration.cs
    │   ├── ContractAddendumConfiguration.cs
    │   ├── ContractRenewalEvaluationConfiguration.cs
    │   ├── LegalMatterCategoryConfiguration.cs
    │   ├── LegalMatterConfiguration.cs
    │   ├── ContratoPolizaConfiguration.cs
    │   ├── PolicySnapshotConfiguration.cs
    │   ├── RegulationArticleConfiguration.cs
    │   ├── ResponsiblePartySnapshotConfiguration.cs
    │   ├── PropertyFineConfiguration.cs
    │   └── FineEvidenceConfiguration.cs
    │
    ├── MantenimientoLuxuryApp/
    │   ├── MaintenanceCalendarConfiguration.cs
    │   ├── MaintenanceBudgetForecastConfiguration.cs
    │   ├── MasterCalendarConfiguration.cs
    │   ├── MasterCalendarEquipmentConfiguration.cs
    │   ├── MasterCalendarProviderConfiguration.cs
    │   ├── MaintenanceLogConfiguration.cs
    │   ├── ElevatorSparePartsChangeConfiguration.cs
    │   ├── ElevatorsEmergencyCallConfiguration.cs
    │   ├── MeterConfiguration.cs
    │   ├── MeterReadingConfiguration.cs
    │   ├── PoolConfiguration.cs
    │   ├── PoolLogConfiguration.cs
    │   ├── WaterTruckDeliveryConfiguration.cs
    │   ├── ToolLoanConfiguration.cs
    │   ├── BitacoraExtintorConfiguration.cs
    │   ├── BitacoraHidranteConfiguration.cs
    │   ├── BitacoraEstacionManualConfiguration.cs
    │   ├── BitacoraDetectorHumoConfiguration.cs
    │   ├── FireInspectionPeriodConfiguration.cs
    │   ├── FireInspectionPeriodExtinguisherConfiguration.cs
    │   ├── FireInspectionPeriodHydrantConfiguration.cs
    │   ├── FireInspectionPeriodStationConfiguration.cs
    │   ├── FireInspectionPeriodDetectorConfiguration.cs
    │   ├── FireInspectionCycleConfiguration.cs
    │   ├── FireCycleInspectionExtinguisherConfiguration.cs
    │   ├── FireCycleInspectionHydrantConfiguration.cs
    │   ├── FireCycleInspectionStationConfiguration.cs
    │   ├── FireCycleInspectionDetectorConfiguration.cs
    │   ├── EquipmentConfiguration.cs
    │   ├── EquipmentDocumentConfiguration.cs
    │   ├── EquipmentInspectionDefinitionConfiguration.cs
    │   ├── EquipmentInspectionDefinitionAssigneeConfiguration.cs
    │   ├── EquipmentInspectionDefinitionWeekDayConfiguration.cs
    │   ├── EquipmentInspectionCriterionConfiguration.cs
    │   ├── EquipmentInspectionExecutionConfiguration.cs
    │   ├── EquipmentInspectionExecutionItemConfiguration.cs
    │   ├── EquipmentInspectionExecutionImageConfiguration.cs
    │   └── EquipmentQrLabelConfiguration.cs
    │
    ├── OperationsLuxuryApp/
    │   ├── TaskRecordConfiguration.cs
    │   ├── TaskInstanceConfiguration.cs
    │   ├── TaskAttachmentConfiguration.cs
    │   ├── TaskAlertLogConfiguration.cs
    │   ├── TaskChecklistItemConfiguration.cs
    │   ├── TaskJustificationConfiguration.cs
    │   ├── TaskChangeLogConfiguration.cs
    │   ├── TaskCommentConfiguration.cs
    │   ├── TaskFollowUpConfiguration.cs
    │   ├── TaskMessageReadConfiguration.cs
    │   ├── TaskServiceOrderConfiguration.cs
    │   ├── TaskWeeklyWorkConfiguration.cs
    │   ├── TaskWorkPlanConfiguration.cs
    │   ├── RecurringTaskTemplateConfiguration.cs
    │   ├── TaskTemplateConfiguration.cs
    │   ├── TaskTemplateCustomerConfiguration.cs
    │   ├── TaskTemplateItemConfiguration.cs
    │   ├── WorkGroupConfiguration.cs
    │   ├── WorkGroupMemberConfiguration.cs
    │   ├── CustomerTaskItemConfigConfiguration.cs
    │   ├── AnnouncementConfiguration.cs
    │   ├── AnnouncementAnalyticsEntryConfiguration.cs
    │   ├── AnnouncementAttachmentConfiguration.cs
    │   ├── AnnouncementCustomerConfiguration.cs
    │   ├── AnnouncementRoleConfiguration.cs
    │   ├── PanicAlertConfiguration.cs
    │   ├── VisitorConfiguration.cs
    │   ├── VisitConfiguration.cs
    │   ├── AccessCredentialConfiguration.cs
    │   ├── AccessEventConfiguration.cs
    │   ├── AccessPointConfiguration.cs
    │   ├── InvitationConfiguration.cs
    │   ├── GuardShiftConfiguration.cs
    │   ├── AgendaSupervisionConfiguration.cs
    │   ├── DiagramDrawConfiguration.cs
    │   ├── DiagramDrawTargetCustomerConfiguration.cs
    │   ├── DiagramDrawTargetRoleConfiguration.cs
    │   ├── AsambleaPlanConfiguration.cs
    │   ├── AsambleaInvitadoConfiguration.cs
    │   ├── AssemblySupportRequestConfiguration.cs
    │   ├── AsambleaChecklistTemplateConfiguration.cs
    │   ├── AsambleaChecklistExecutionConfiguration.cs
    │   ├── MeetingConfiguration.cs
    │   ├── MeetingAdministracionConfiguration.cs
    │   ├── MeetingComiteConfiguration.cs
    │   ├── MeetingInvitadoConfiguration.cs
    │   ├── MeetingDetailsConfiguration.cs
    │   ├── MeetingDetailsSeguimientoConfiguration.cs
    │   ├── PresentacionJuntaComiteConfiguration.cs
    │   ├── VigilanceCommitteeConfiguration.cs
    │   ├── TaskMeetingConfiguration.cs
    │   ├── ManualTemplateConfiguration.cs
    │   ├── ManualTemplateAttachmentConfiguration.cs
    │   ├── ManualTemplateCustomerConfiguration.cs
    │   ├── ManualTemplateRoleConfiguration.cs
    │   ├── ManualTemplateVersionConfiguration.cs
    │   ├── ManualPasoConfiguration.cs
    │   ├── ManualPasoEnlaceConfiguration.cs
    │   ├── ManualPasoImagenConfiguration.cs
    │   ├── ManualPasoResponsableConfiguration.cs
    │   ├── ManualDiagramConfiguration.cs
    │   ├── CustomDocumentConfiguration.cs
    │   ├── CustomDocumentRoleConfiguration.cs
    │   ├── AlmacenConfiguration.cs
    │   ├── AlmacenUsuarioResponsableConfiguration.cs
    │   ├── WarehouseStockConfiguration.cs
    │   ├── EntradaProductoConfiguration.cs
    │   ├── SalidaProductoConfiguration.cs
    │   ├── InventarioExtintorConfiguration.cs
    │   ├── InventarioHidranteConfiguration.cs
    │   ├── InventarioEstacionManualConfiguration.cs
    │   ├── InventarioDetectorHumoConfiguration.cs
    │   ├── LightingStockConfiguration.cs
    │   ├── KeyInventoryConfiguration.cs
    │   ├── PaintStockConfiguration.cs
    │   ├── RadioComunicacionConfiguration.cs
    │   ├── ToolConfiguration.cs
    │   ├── InspectionConfiguration.cs
    │   ├── InspectionResultConfiguration.cs
    │   ├── InspectionResultImageConfiguration.cs
    │   ├── InspectionReviewConfiguration.cs
    │   ├── InspectionReviewsCatalogConfiguration.cs
    │   ├── InspectionCondominiumAssetConfiguration.cs
    │   ├── InspectionWeeklyDayConfiguration.cs
    │   ├── CustomerInspectionConfiguration.cs
    │   ├── ReportDefinitionConfiguration.cs
    │   ├── ReportSubmissionRecordConfiguration.cs
    │   ├── PropertyConfiguration.cs
    │   ├── PropertyMemberConfiguration.cs
    │   ├── PropertyOccupantConfiguration.cs
    │   ├── EntregaRecepcionClienteConfiguration.cs
    │   ├── EntregaRecepcionDescripcionConfiguration.cs
    │   ├── DeliveryCriterionConfiguration.cs
    │   ├── ServiceOrderConfiguration.cs
    │   ├── ServiceOrderDocumentConfiguration.cs
    │   ├── ServiceOrderImgConfiguration.cs
    │   ├── GoogleCalendarEventConfiguration.cs
    │   ├── GoogleCalendarGuestConfiguration.cs
    │   ├── JuntaMensualSessionConfiguration.cs
    │   ├── CategoryConfiguration.cs
    │   ├── ProductoConfiguration.cs
    │   ├── UnitOfMeasureConfiguration.cs
    │   ├── EquipoClasificacionConfiguration.cs
    │   └── WorkGroupCategoriesConfiguration.cs
    │
    ├── ReclutamientoLuxuryApp/
    │   ├── EmployeeConfiguration.cs
    │   ├── EmployeeBankDataConfiguration.cs
    │   ├── EmployeeBeneficiaryConfiguration.cs
    │   ├── EmployeeClinicalDataConfiguration.cs
    │   ├── EmployeeEmergencyContactConfiguration.cs
    │   ├── EmployeeDocumentConfiguration.cs
    │   ├── DocumentCatalogConfiguration.cs
    │   ├── ChecklistOptionCatalogConfiguration.cs
    │   ├── ChecklistOptionCatalogRoleConfiguration.cs
    │   ├── EmployeeOnboardingChecklistConfiguration.cs
    │   ├── PersonDataConfiguration.cs
    │   ├── ExternalStaffConfiguration.cs
    │   ├── WorkPositionConfiguration.cs
    │   ├── WorkPositionScheduleConfiguration.cs
    │   ├── DiaDeTrabajoConfiguration.cs
    │   ├── OrganizationHierarchyConfiguration.cs
    │   ├── JobDescriptionConfiguration.cs
    │   ├── RequestEmployeeRegisterConfiguration.cs
    │   ├── RequestPositionConfiguration.cs
    │   ├── RequestSalaryModificationConfiguration.cs
    │   ├── RequestDismissalConfiguration.cs
    │   ├── RequestDismissalDiscountConfiguration.cs
    │   ├── RequestDismissalEvaluationConfiguration.cs
    │   ├── RequestDismissalFileConfiguration.cs
    │   ├── RequestDismissalIncidentConfiguration.cs
    │   ├── RecruitmentSourceCatalogConfiguration.cs
    │   ├── CandidateConfiguration.cs
    │   ├── CandidateProcessConfiguration.cs
    │   ├── CandidateApplicationRoleConfiguration.cs
    │   ├── CandidateWorkExperienceConfiguration.cs
    │   ├── CandidateInterviewConfiguration.cs
    │   ├── InterviewerMatrixConfiguration.cs
    │   └── RequestEmployeeRegisterFileConfiguration.cs
    │
    ├── RecursosHumanosLuxuryApp/
    │   ├── TimeClockRecordConfiguration.cs
    │   ├── TimeClockLocationConfiguration.cs
    │   ├── ConfiguracionNominaConfiguration.cs
    │   ├── DiasNoHabilesConfiguration.cs
    │   ├── PayrollEvidenceConfiguration.cs
    │   ├── IncidenciaNominaConfiguration.cs
    │   ├── NominaDetalleConfiguration.cs
    │   ├── NominaEncabezadoConfiguration.cs
    │   ├── PagoPrestamoNominaConfiguration.cs
    │   ├── PeriodoNominaConfiguration.cs
    │   ├── PrestamoEmpleadoConfiguration.cs
    │   ├── TiempoExtraConfiguration.cs
    │   ├── LeaveRequestConfiguration.cs
    │   ├── LeaveRequestHistoryConfiguration.cs
    │   ├── ManualBalanceChangeLogConfiguration.cs
    │   ├── VacationBalanceConfiguration.cs
    │   ├── VacationRequestConfiguration.cs
    │   ├── VacationRequestHistoryConfiguration.cs
    │   ├── PerformanceEvaluationConfiguration.cs
    │   ├── TemplateCategoryConfiguration.cs
    │   ├── TemplateEvaluationConfiguration.cs
    │   ├── TemplateQuestionConfiguration.cs
    │   └── EvaluationAnswerConfiguration.cs
    │
    └── SharedLuxuryApp/
        ├── AddressConfiguration.cs
        ├── MedidorCategoriaConfiguration.cs
        └── TelefonosEmergenciaConfiguration.cs
```

---

## 3. Implementación por Archivo

### 3.1 ApplicationDbContext.cs (Resultado final ~250 líneas)

```csharp
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Microsoft.IdentityModel.JsonWebTokens;

namespace Infrastructure.Data;

/// <summary>
/// Contexto de base de datos principal de la aplicación.
/// Centraliza los DbSets y aplica auditoría automática.
/// Las configuraciones de entidades están en Configurations/
/// </summary>
public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, string>
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options,
        IHttpContextAccessor httpContextAccessor) : base(options)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    protected ApplicationDbContext(DbContextOptions options) : base(options) { }

    // ==================================================================================
    // DBSETS POR MÓDULO
    // ==================================================================================

    #region System
    public DbSet<CustomerUser> CustomerUsers { get; set; }
    public DbSet<CustomerModul> ModuleCustomers { get; set; }
    public DbSet<ApplicationRole> Roles { get; set; }
    public DbSet<ApplicationUser> Users { get; set; }
    public DbSet<ModuleApp> Modules { get; set; }
    public DbSet<ModuleAppRol> ModuleRoles { get; set; }
    public DbSet<UserRefreshToken> UserRefreshTokens { get; set; }
    public DbSet<PasswordRecoveryCode> PasswordRecoveryCodes { get; set; }
    public DbSet<Customer> Customers { get; set; }
    public DbSet<CustomerAddress> CustomerAddresses { get; set; }
    public DbSet<CustomerLocation> CustomerLocations { get; set; }
    public DbSet<CustomerEmailConfiguration> CustomerEmailConfigs { get; set; }
    public DbSet<CustomerImage> CustomerImages { get; set; }
    public DbSet<CustomerProvider> CustomerProviders { get; set; }
    // ... (resto de DbSets System)
    #endregion

    #region Accounting
    // ... (DbSets contabilidad, cobranza, presupuesto, fondeos)
    #endregion

    #region HR
    // ... (DbSets expediente, nómina, vacaciones, legal)
    #endregion

    #region Maintenance
    // ... (DbSets calendarios, bitácoras, equipos, inspección incendio)
    #endregion

    #region Operations
    // ... (DbSets tareas, acceso, inventario, inspecciones, propiedades, juntas, manuales)
    #endregion

    #region Purchasing
    // ... (DbSets solicitud compra, cotizaciones, órdenes compra, proveedores)
    #endregion

    #region Recruitment
    // ... (DbSets estructura, candidatos, altas/bajas)
    #endregion

    // ==================================================================================
    // AUDITORÍA AUTOMÁTICA
    // ==================================================================================

    public override int SaveChanges()
    {
        AplicarCamposAuditoria();
        return base.SaveChanges();
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        AplicarCamposAuditoria();
        return await base.SaveChangesAsync(cancellationToken);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // TPC: Equipos Contra Incendio
        modelBuilder.Entity<EquipoContraIncendioBase>().UseTpcMappingStrategy();
        modelBuilder.Entity<BitacoraEquipoBase>().UseTpcMappingStrategy();
        modelBuilder.Entity<FireInspectionPeriodItemBase>().UseTpcMappingStrategy();
        modelBuilder.Entity<FireCycleInspectionBase>().UseTpcMappingStrategy();

        // Query Filter Global: Soft Delete
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            if (typeof(ISoftDeletable).IsAssignableFrom(entityType.ClrType))
            {
                var parameter = Expression.Parameter(entityType.ClrType, "e");
                var property = Expression.Property(parameter, nameof(ISoftDeletable.DeletedAt));
                var filter = Expression.Lambda(
                    Expression.Equal(property, Expression.Constant(null, typeof(DateTime?))),
                    parameter
                );
                modelBuilder.Entity(entityType.ClrType).HasQueryFilter(filter);
            }
        }

        // Auto-registro de IEntityTypeConfiguration
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);

        // Prevención de borrados en cascada cíclicos
        foreach (var foreignKey in modelBuilder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
        {
            foreignKey.DeleteBehavior = DeleteBehavior.Restrict;
        }

        // Normalización UTC
        // ... (DateTime y DateTimeOffset converters)
    }

    // ... (métodos privados de auditoría sin cambios)
}
```

### 3.2 Ejemplo: CustomerConfiguration.cs

```csharp
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using AdminLuxuryApp.GestionDeCliente.Customers.Entities;

namespace Infrastructure.Data.Configurations.System.Customers;

public class CustomerConfiguration : IEntityTypeConfiguration<Customer>
{
    public void Configure(EntityTypeBuilder<Customer> builder)
    {
        builder.ToTable("Customers");
        
        builder.HasKey(e => e.Id);
        
        builder.Property(e => e.NameCustomer)
            .HasMaxLength(50)
            .HasColumnName("Name");
            
        builder.Property(e => e.NombreCorto)
            .HasColumnName("ShortName");
            
        // Relaciones
        builder.HasMany(e => e.Addresses)
            .WithOne(e => e.Customer)
            .HasForeignKey(e => e.CustomerId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
```

### 3.3 Ejemplo: DatabaseBackupHistoryConfiguration.cs

```csharp
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SystemLuxuryApp.ConfiguracionSistema.DatabaseBackup.Entities;

namespace Infrastructure.Data.Configurations.System.DatabaseBackup;

public class DatabaseBackupHistoryConfiguration : IEntityTypeConfiguration<DatabaseBackupHistory>
{
    public void Configure(EntityTypeBuilder<DatabaseBackupHistory> builder)
    {
        builder.ToTable("DatabaseBackupHistories");
        
        builder.HasOne(b => b.BackupConfig)
            .WithMany(b => b.DatabaseBackupHistories)
            .HasForeignKey(b => b.BackupConfigId)
            .OnDelete(DeleteBehavior.Restrict)
            .IsRequired();
    }
}
```

### 3.4 Ejemplo: CandidateConfiguration.cs (con índices)

```csharp
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ReclutamientoLuxuryApp.CandidateCore.Entities;

namespace Infrastructure.Data.Configurations.Recruitment.Candidates;

public class CandidateConfiguration : IEntityTypeConfiguration<Candidate>
{
    public void Configure(EntityTypeBuilder<Candidate> builder)
    {
        builder.ToTable("Candidates");
        
        builder.HasIndex(x => x.NormalizedPhoneNumber)
            .IsUnique()
            .HasDatabaseName("IX_RecruitmentCandidates_NormalizedPhoneNumber_Unique");

        builder.HasIndex(x => x.NormalizedEmail)
            .HasDatabaseName("IX_RecruitmentCandidates_NormalizedEmail");

        builder.HasOne(x => x.RecruitmentSourceCatalog)
            .WithMany()
            .HasForeignKey(x => x.RecruitmentSourceId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
```

---

## 4. Mapeo de Configuraciones Actuales → Archivos Nuevos

### 4.1 Líneas 1642-1647: DatabaseBackupHistory
| Actual | Nuevo |
|--------|-------|
| `OnModelCreating` inline | `DatabaseBackupHistoryConfiguration.cs` |

### 4.2 Líneas 1681-1687: Decimal Precision
| Actual | Nuevo |
|--------|-------|
| `ConfiguracionNomina.FactorPrimaVacacional` | `ConfiguracionNominaConfiguration.cs` |
| `OrdenCompraFactura.Monto` | `OrdenCompraFacturaConfiguration.cs` |

### 4.3 Líneas 1690-1772: Query Filters manuales
| Actual | Nuevo |
|--------|-------|
| `NominaDetalle` filter | `NominaDetalleConfiguration.cs` |
| `RequestDismissalIncident` filter | `RequestDismissalIncidentConfiguration.cs` |
| `SuspensionDay` filter | `SuspensionDayConfiguration.cs` |
| `PagoPrestamoNomina` filter | `PagoPrestamoNominaConfiguration.cs` |
| `DiasNoHabiles` filter | `DiasNoHabilesConfiguration.cs` |
| `GoogleCalendarGuest` filter | `GoogleCalendarGuestConfiguration.cs` |

> **Nota:** Estos filtros manuales pueden eliminarse si la entidad ya implementa `ISoftDeletable` y el filtro global los captura automáticamente.

### 4.4 Líneas 1812-1828: OrganizationHierarchy
| Actual | Nuevo |
|--------|-------|
| `OnModelCreating` inline | `OrganizationHierarchyConfiguration.cs` |

### 4.5 Líneas 1831-1959: Reclutamiento (Candidate, Process, Interview, etc.)
| Actual | Nuevo |
|--------|-------|
| `Candidate` config | `CandidateConfiguration.cs` |
| `CandidateProcess` config | `CandidateProcessConfiguration.cs` |
| `CandidateApplicationRole` config | `CandidateApplicationRoleConfiguration.cs` |
| `CandidateInterview` config | `CandidateInterviewConfiguration.cs` |
| `CandidateWorkExperience` config | `CandidateWorkExperienceConfiguration.cs` |
| `InterviewerMatrix` config | `InterviewerMatrixConfiguration.cs` |
| `RequestEmployeeRegister` config | `RequestEmployeeRegisterConfiguration.cs` |
| `RequestEmployeeRegisterFile` config | `RequestEmployeeRegisterFileConfiguration.cs` |
| `CandidateStageHistory` config | `CandidateStageHistoryConfiguration.cs` |

### 4.6 Líneas 1961-2018: Employee Documents & Checklists
| Actual | Nuevo |
|--------|-------|
| `EmployeeDocument` config | `EmployeeDocumentConfiguration.cs` |
| `ChecklistOptionCatalog` config | `ChecklistOptionCatalogConfiguration.cs` |
| `ChecklistOptionCatalogRole` config | `ChecklistOptionCatalogRoleConfiguration.cs` |
| `EmployeeOnboardingChecklist` config | `EmployeeOnboardingChecklistConfiguration.cs` |

---

## 5. Scripts de Creación

### 5.1 Script PowerShell: Crear carpetas (espejo de Entities)

```powershell
$sourceBase = "D:\repos\luxuryapp-api\api\LuxuryApp.Application\Infrastructure\Data\Entities"
$destBase = "D:\repos\luxuryapp-api\api\LuxuryApp.Application\Infrastructure\Data\Configurations"

# Obtener todas las carpetas de módulos que tienen entidades
$modules = Get-ChildItem -Path $sourceBase -Directory | Where-Object { 
    (Get-ChildItem -Path $_.FullName -Filter "*.cs" -ErrorAction SilentlyContinue).Count -gt 0
}

foreach ($module in $modules) {
    $destModule = Join-Path $destBase $module.Name
    if (!(Test-Path $destModule)) {
        New-Item -ItemType Directory -Path $destModule -Force | Out-Null
        Write-Host "Creada: Configurations/$($module.Name)"
    }
}

Write-Host ""
Write-Host "Módulos con entidades: $($modules.Count)"
$modules | ForEach-Object { 
    $count = (Get-ChildItem -Path $_.FullName -Filter "*.cs").Count
    Write-Host "  $($_.Name): $count entidades"
}
```

### 5.2 Script PowerShell: Generar Configuration stubs

```powershell
# Genera archivos stub para cada DbSet encontrado en el DbContext
$file = "D:\repos\luxuryapp-api\api\LuxuryApp.Application\Infrastructure\Data\ApplicationDbContext.cs"
$content = Get-Content $file -Raw

$pattern = 'public DbSet<(\w+)>\s+(\w+)\s*\{.*?\}'
$matches = [regex]::Matches($content, $pattern)

foreach ($m in $matches) {
    $entityType = $m.Groups[1].Value
    $dbSetName = $m.Groups[2].Value
    
    $stub = @"
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class ${entityType}Configuration : IEntityTypeConfiguration<$entityType>
{
    public void Configure(EntityTypeBuilder<$entityType> builder)
    {
        // TODO: Migrar configuración desde OnModelCreating
    }
}
"@
    
    Write-Host "$entityType -> $dbSetName"
}
```

---

## 6. Orden de Implementación

| Fase | Acción | Archivos | Riesgo |
|------|--------|----------|--------|
| **0** | Crear estructura de carpetas `Configurations/` | 0 (solo dirs) | Ninguno |
| **1** | Crear stubs vacíos para las 10 configuraciones que tienen código en OnModelCreating | 10 | Bajo |
| **2** | Migrar configuraciones de Reclutamiento (líneas 1831-1959) | 9 | Bajo |
| **3** | Migrar configuraciones de Employee/Checklist (líneas 1961-2018) | 4 | Bajo |
| **4** | Migrar DatabaseBackupHistory (líneas 1642-1647) | 1 | Bajo |
| **5** | Migrar Decimal Precision (líneas 1681-1687) | 2 | Bajo |
| **6** | Migrar Query Filters manuales (líneas 1690-1772) → evaluar si son redundantes | 6 | Medio |
| **7** | Migrar OrganizationHierarchy (líneas 1812-1828) | 1 | Bajo |
| **8** | Eliminar código migrado de OnModelCreating | 1 | Medio |
| **9** | Build + Tests | - | - |
| **10** | Crear configuraciones stub para las ~310 entidades restantes (sin código迁移, solo ToTable) | ~310 | Bajo |

---

## 7. Reglas de Convención para Configurations

### 7.1 Namespace
```
Infrastructure.Data.Configurations.{Modulo}
```
Ejemplos:
- `Infrastructure.Data.Configurations.AdminLuxuryApp`
- `Infrastructure.Data.Configurations.CobranzaLuxuryApp`
- `Infrastructure.Data.Configurations.OperationsLuxuryApp`

> **Regla:** El namespace es **idéntico** al namespace de la entidad en `Entities/{Modulo}/`

### 7.2 Naming
```
{EntityName}Configuration.cs
```
Ejemplo: `CustomerConfiguration.cs`

### 7.3 Contenido mínimo
```csharp
public class XConfiguration : IEntityTypeConfiguration<X>
{
    public void Configure(EntityTypeBuilder<X> builder)
    {
        builder.ToTable("TableName");
        // Solo agregar lo que esté en OnModelCreating actualmente
        // No duplicar lo que EF Core infiere por convención
    }
}
```

### 7.4 Qué MIGRAR vs qué NO

| Migrar | NO Migrar (EF infiere) |
|--------|------------------------|
| `ToTable("Nombre")` | `HasKey(e => e.Id)` si se llama `Id` |
| `HasIndex()` | `HasOne().WithMany()` si las FK siguen convención |
| `HasPrecision()` | `IsRequired()` si la propiedad es obligatoria |
| `HasQueryFilter()` manual | `HasMaxLength()` si ya está en el modelo |
| Relaciones con `OnDelete(DeleteBehavior.X)` | |
| `HasColumnName()` cuando difiere | |
| `UseTpcMappingStrategy()` | |

---

## 8. Verificación

### 8.1 Comandos de validación
```bash
dotnet build api/LuxuryApp.Application/LuxuryApp.Application.csproj
dotnet build api/LuxuryApp.Api/LuxuryApp.Api.csproj
dotnet test api/LuxuryApp.Tests/LuxuryApp.Tests.csproj
```

### 8.2 Checklist
- [ ] Todas las configuraciones migradas compilan
- [ ] OnModelCreating ya no tiene código inline (solo llamadas globales)
- [ ] Los 319 DbSets siguen en el DbContext
- [ ] La auditoría (SaveChanges) no se modificó
- [ ] Los filtros globales de ISoftDeletable funcionan igual
- [ ] Migraciones existentes siguen siendo válidas
- [ ] Tests pasan sin regressions

---

## 9. Beneficios Esperados

| Métrica | Antes | Después |
|---------|-------|---------|
| Líneas en DbContext | ~2020 | ~250 |
| Archivos de configuración | 1 | ~320 |
| Tiempo de búsqueda de config | Buscar en 2000 líneas | Abrir 1 archivo |
| Conflicto de merge | Alto (1 archivo central) | Bajo (archivos independientes) |
| Testing de configuración | Solo integración | Unit tests por config |
