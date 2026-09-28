Reporte de uso de aliases using ... = en LuxuryApp.Api
Resumen: 27 archivos con aliases distribuidos en 10 módulos + capa de API + pruebas. Un total de 43 declaraciones de alias (algunos archivos declaran múltiples).

1. Capa de presentación (API)
   Archivo Alias
   LuxuryApp.Api/ServiceExtensions/DatabaseProviderServiceExtensions.cs:7-9 MsSqlColumn, MsSqlColumnOptions, MsSqlStandardColumn
2. Módulo AdminLuxuryApp
   Archivo
   AdminLuxuryApp/Infraestructura/Jobs/Workers/RecurringTaskSchedulerJob.cs:3
3. Módulo AuthLuxuryApp
   Archivo Alias
   AuthLuxuryApp/Auth/Services/AuthAppService.cs:1 ApplicationUser
   AuthLuxuryApp/Auth/Services/AuthAppService.cs:2 SignInResult
   AuthLuxuryApp/Auth/Services/AuthAppService.cs:3 UserActivity
4. Módulo CobranzaLuxuryApp
   Archivo
   CobranzaLuxuryApp/CobranzaOnline/EndPoints/AspelSyncEndPoints.cs:2
5. Módulo ContabilidadLuxuryApp
   Archivo
   ContabilidadLuxuryApp/CatalogoGastosFijos/Mapping/CatalogoGastosFijosMapper.cs:1
   ContabilidadLuxuryApp/CatalogoGastosFijos/Services/CatalogoGastosFijosAppService.cs:1
   ContabilidadLuxuryApp/FundingFile/Services/FundingFileAppService.cs:14
   ContabilidadLuxuryApp/PresupuestoPropuesta/Services/BudgetProposalService.cs:4
   ContabilidadLuxuryApp/PresupuestoPropuesta/Services/BudgetProposalService.cs:5
   ContabilidadLuxuryApp/PresupuestoPropuesta/Services/BudgetProposalService.cs:6
   ContabilidadLuxuryApp/PresupuestoPropuesta/Services/BudgetProposalItemSupportService.cs:1
6. Módulo OperationsLuxuryApp — Recruitment
   Alias para servicios e interfaces de otros módulos:
   Archivo Alias
   OperationsLuxuryApp/Recruitment/EndPoints/JobDescriptionEndPoints.cs:2-5 IJobDescriptionAppService, JobDescriptionAddOrEditDTO, JobDescriptionAnalysisRequestDTO, JobDescriptionProposalRequestDTO
   OperationsLuxuryApp/Recruitment/EndPoints/WorkPositionEndPoints.cs:2 IWorkPositionAppService
   OperationsLuxuryApp/Recruitment/JobDescriptions/Interfaces/IJobDescriptionAppService.cs:1-2 JobDescriptionAddOrEditDTO, JobDescriptionDTO
   OperationsLuxuryApp/Recruitment/JobDescriptions/Mapping/JobDescriptionMapper.cs:2-3 JobDescriptionAddOrEditDTO, JobDescriptionDTO
   OperationsLuxuryApp/Recruitment/JobDescriptions/Services/JobDescriptionAppService.cs:2-4 IJobDescriptionAppService, JobDescriptionAddOrEditDTO, JobDescriptionDTO
   OperationsLuxuryApp/Recruitment/WorkPositions/Mapping/WorkPositionMapper.cs:1 WorkPositionEntity
   OperationsLuxuryApp/Recruitment/WorkPositions/Services/WorkPositionAppService.cs:2 IWorkPositionAppService
   6b. Módulo OperationsLuxuryApp — Task
   Archivo
   OperationsLuxuryApp/Task/RecurringTaskCatalog/Services/RecurringTaskCatalogAppService.cs:2
   OperationsLuxuryApp/Task/RecurringTaskGeneration/Services/RecurringTaskGenerationService.cs:5
7. Módulo RecursosHumanosLuxuryApp
   Archivo
   RecursosHumanosLuxuryApp/Evaluacion/EvaluationTemplate/Mapping/EmployeeEvaluationMapper.cs:1
   RecursosHumanosLuxuryApp/Evaluacion/PerformanceEvaluation/Mapping/PerformanceEvaluationMappingProfile.cs:1
   RecursosHumanosLuxuryApp/Evaluacion/PerformanceEvaluation/Services/PerformanceEvaluationAppService.cs:1
8. Módulo SystemLuxuryApp
   Archivo
   SystemLuxuryApp/SystemAI/AiKnowledgeBase/Services/AiKnowledgeBaseAppService.cs:1
9. Módulo Shared
   Archivo Alias
   Shared/Services/IRazorViewToStringRenderer.cs:1 IView
10. Pruebas (Tests)
    Archivo Alias
    Tests/AuthLuxuryApp/AccountRecovery/RecoveryByCodeTests.cs:7 RecoveryCodeEmailDTO
    Tests/AccountRecovery/RecoveryByCodeTests.cs:8 SHA
    Tests/AccountRecovery/RecoveryByCodeTests.cs:9 Utf8
    Tests/Contabilidad/CobranzaNativa/CobranzaNativaNotificationServiceTests.cs:8 NotificationService
    Tests/RecursosHumanos/EmployeeBankData/EmployeeBankDataAppServiceTests.cs:3 BankData
    Tests/RecursosHumanos/EmployeeClinicalData/EmployeeClinicalDataAppServiceTests.cs:3 ClinicalData
    Tests/System/Notifications/NotificationDispatcherTests.cs:6 Dispatcher
    Clasificación temática
    Patrón Cantidad
    Entidad de otro módulo 5 aliases (CatalogoGastosFijosEntity, WorkPositionEntity, BudgetProposal*, AiKnowledgeBaseEntity, PerformanceEvaluationEntity)
    Interface/DTO de otro módulo 8 aliases (IJobDescriptionAppService, IWorkPositionAppService, 6 DTOs)
    Librería externa (abreviatura) 5 aliases (MsSql*, Ical\*, SHA, Utf8)
    Resolución de ambigüedades 3 aliases (Path, SignInResult, IView)
    Librería de pruebas 7 aliases (todos en Tests)
    Alias con propósito explícito 1 (CobranzaOnlineCustomerScopeAlias)
    Total: 27 archivos, 43 declaraciones de alias.
