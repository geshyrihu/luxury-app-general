# Fase 9: ReclutamientoLuxuryApp (Vertical Slices)

## Alcance

- Se aplicó el estándar de Cortes Verticales Puros y namespaces path-based al módulo `ReclutamientoLuxuryApp`.
- Se preservó el comportamiento: los cambios fueron físicos/de organización y de resolución de referencias.

## Gestión de bitácoras

- Se creó `docs/changelogs/04_fase9_reclutamiento.md` para registrar esta fase.

## Rescate de entidades

- Se revisó `LuxuryApp.Application/Modules/SystemLuxuryApp/Domain/Entities` buscando entidades relacionadas con reclutamiento: candidatos, solicitudes, entrevistas, evaluaciones, vacantes y altas.
- No se encontraron entidades pendientes de rescate en `SystemLuxuryApp`; el contenido de reclutamiento ya estaba dentro de `ReclutamientoLuxuryApp`.

## Aplanamiento físico

Se eliminaron las carpetas envolventes `Domain` e `Infrastructure` del módulo, sacando su contenido al corte vertical correspondiente:

- `Candidate/Domain/Entities` -> `Candidate/Entities`
- `CandidateProcess/Domain/Entities` -> `CandidateProcess/Entities`
- `CandidateWorkExperience/Domain/Entities` -> `CandidateWorkExperience/Entities`
- `InterviewerMatrix/Domain/Entities` -> `InterviewerMatrix/Entities`
- `RecruitmentSourceCatalog/Domain/Entities` -> `RecruitmentSourceCatalog/Entities`
- `WorkPosition/Domain/Entities` -> `WorkPosition/Entities`
- `Reclutamiento/JobDescription/Domain/Entities` -> `Reclutamiento/JobDescription/Entities`
- `Reclutamiento/Recruitment/RequestDismissal/Domain/Entities` -> `Reclutamiento/Recruitment/RequestDismissal/Entities`
- `Reclutamiento/Recruitment/RequestDismissalDiscount/Domain/Entities` -> `Reclutamiento/Recruitment/RequestDismissalDiscount/Entities`
- `Reclutamiento/Recruitment/RequestEmployeeRegister/Domain/Entities` -> `Reclutamiento/Recruitment/RequestEmployeeRegister/Entities`
- `Reclutamiento/Recruitment/RequestPosition/Domain/Entities` -> `Reclutamiento/Recruitment/RequestPosition/Entities`
- `Reclutamiento/Recruitment/SalaryModification/Domain/Entities` -> `Reclutamiento/Recruitment/SalaryModification/Entities`
- `Infrastructure/Persistence` -> `Persistence`

## Sincronización de namespaces

- Se actualizaron 213 archivos `.cs` dentro de `ReclutamientoLuxuryApp`.
- El módulo quedó distribuido en 103 namespaces path-based bajo `LuxuryApp.Application.Modules.ReclutamientoLuxuryApp`.
- Se agregaron los nuevos namespaces del módulo a `LuxuryApp.Application/GlobalUsings.cs`, `LuxuryApp.Api/GlobalUsings.cs` y `LuxuryApp.Tests/GlobalUsings.cs`.
- Se actualizó el puente de handlers en `LuxuryApp.Api/ServiceExtensions/DependencyInjection.Controllers.cs` para usar los namespaces path-based de `SolicitudAlta`, `SolicitudBaja`, `SolicitudModificacionSueldo` y `SolicitudVacante`.

## Resolución limpia de colisiones

Se resolvieron colisiones de nombres con aliases de `using`, evitando `global::` en línea dentro de `ReclutamientoLuxuryApp`. Los alias principales fueron:

- `CandidateEntity`
- `CandidateProcessEntity`
- `CandidateWorkExperienceEntity`
- `CustomerProviderEntity`
- `InterviewerMatrixEntity`
- `JobDescriptionEntity`
- `RecruitmentSourceCatalogEntity`
- `RequestDismissalEntity`
- `RequestDismissalDiscountEntity`
- `RequestEmployeeRegisterEntity`
- `RequestPositionEntity`
- `WorkPositionEntity`
- `RecruitmentWorkPositionScheduleEntity`

Archivos con aliases relevantes:

- `LuxuryApp.Application\Modules\AdminLuxuryApp\CatalogosGenerales\WorkPositionSchedule\Services\WorkPositionScheduleAppService.cs`
- `LuxuryApp.Application\Modules\ReclutamientoLuxuryApp\Candidate\Entities\Candidate.cs`
- `LuxuryApp.Application\Modules\ReclutamientoLuxuryApp\Candidate\Entities\CandidateInterview.cs`
- `LuxuryApp.Application\Modules\ReclutamientoLuxuryApp\Candidate\Entities\CandidateStageHistory.cs`
- `LuxuryApp.Application\Modules\ReclutamientoLuxuryApp\Candidate\Mappings\CandidateMapping.cs`
- `LuxuryApp.Application\Modules\ReclutamientoLuxuryApp\Candidate\Services\CandidateAppService.cs`
- `LuxuryApp.Application\Modules\ReclutamientoLuxuryApp\CandidateApplication\Services\CandidateAutomationService.cs`
- `LuxuryApp.Application\Modules\ReclutamientoLuxuryApp\CandidateProcess\Entities\CandidateProcess.cs`
- `LuxuryApp.Application\Modules\ReclutamientoLuxuryApp\CandidateProcess\Services\CandidateProcessAppService.cs`
- `LuxuryApp.Application\Modules\ReclutamientoLuxuryApp\CandidateWorkExperience\Entities\CandidateWorkExperience.cs`
- `LuxuryApp.Application\Modules\ReclutamientoLuxuryApp\CandidateWorkExperience\Mappings\CandidateWorkExperienceMapping.cs`
- `LuxuryApp.Application\Modules\ReclutamientoLuxuryApp\CandidateWorkExperience\Services\CandidateWorkExperienceAppService.cs`
- `LuxuryApp.Application\Modules\ReclutamientoLuxuryApp\InterviewerMatrix\Mappings\InterviewerMatrixMapping.cs`
- `LuxuryApp.Application\Modules\ReclutamientoLuxuryApp\InterviewerMatrix\Services\InterviewerMatrixAppService.cs`
- `LuxuryApp.Application\Modules\ReclutamientoLuxuryApp\Notifications\Services\CandidateNotificationCoordinatorService.cs`
- `LuxuryApp.Application\Modules\ReclutamientoLuxuryApp\Reclutamiento\CustomerProvider\Interfaces\ICustomerProviderAppService.cs`
- `LuxuryApp.Application\Modules\ReclutamientoLuxuryApp\Reclutamiento\CustomerProvider\Mapping\CustomerProviderMapper.cs`
- `LuxuryApp.Application\Modules\ReclutamientoLuxuryApp\Reclutamiento\CustomerProvider\Services\CustomerProviderAppService.cs`
- `LuxuryApp.Application\Modules\ReclutamientoLuxuryApp\Reclutamiento\JobDescription\Mapping\JobDescriptionMapper.cs`
- `LuxuryApp.Application\Modules\ReclutamientoLuxuryApp\Reclutamiento\JobDescription\Services\JobDescriptionAppService.cs`
- `LuxuryApp.Application\Modules\ReclutamientoLuxuryApp\Reclutamiento\Recruitment\RecruitmentRequests\Services\ReclutamientoQueryService.cs`
- `LuxuryApp.Application\Modules\ReclutamientoLuxuryApp\Reclutamiento\Recruitment\RequestDismissal\DTOs\RequestDismissalAddOrEditDTO.cs`
- `LuxuryApp.Application\Modules\ReclutamientoLuxuryApp\Reclutamiento\Recruitment\RequestDismissal\DTOs\RequestDismissalDTO.cs`
- `LuxuryApp.Application\Modules\ReclutamientoLuxuryApp\Reclutamiento\Recruitment\RequestDismissal\Entities\RequestDismissal.cs`
- `LuxuryApp.Application\Modules\ReclutamientoLuxuryApp\Reclutamiento\Recruitment\RequestDismissal\Interfaces\ISolicitudBajaAppService.cs`
- `LuxuryApp.Application\Modules\ReclutamientoLuxuryApp\Reclutamiento\Recruitment\RequestDismissal\Mapping\RequestDismissalMapper.cs`
- `LuxuryApp.Application\Modules\ReclutamientoLuxuryApp\Reclutamiento\Recruitment\RequestDismissal\Services\SolicitudBajaAppService.cs`
- `LuxuryApp.Application\Modules\ReclutamientoLuxuryApp\Reclutamiento\Recruitment\RequestDismissalDiscount\Entities\RequestDismissalDiscount.cs`
- `LuxuryApp.Application\Modules\ReclutamientoLuxuryApp\Reclutamiento\Recruitment\RequestDismissalDiscount\Mapping\RequestDismissalDiscountMappingProfile.cs`
- `LuxuryApp.Application\Modules\ReclutamientoLuxuryApp\Reclutamiento\Recruitment\RequestDismissalDiscount\Services\RequestDismissalDiscountAppService.cs`
- `LuxuryApp.Application\Modules\ReclutamientoLuxuryApp\Reclutamiento\Recruitment\RequestEmployeeRegister\Entities\RequestEmployeeRegister.cs`
- `LuxuryApp.Application\Modules\ReclutamientoLuxuryApp\Reclutamiento\Recruitment\RequestEmployeeRegister\Interfaces\IRequestEmployeeRegisterAppService.cs`
- `LuxuryApp.Application\Modules\ReclutamientoLuxuryApp\Reclutamiento\Recruitment\RequestEmployeeRegister\Mapping\RequestEmployeeRegisterMappingProfile.cs`
- `LuxuryApp.Application\Modules\ReclutamientoLuxuryApp\Reclutamiento\Recruitment\RequestEmployeeRegister\Services\RequestEmployeeRegisterAppService.cs`
- `LuxuryApp.Application\Modules\ReclutamientoLuxuryApp\Reclutamiento\Recruitment\RequestPosition\Entities\RequestPosition.cs`
- `LuxuryApp.Application\Modules\ReclutamientoLuxuryApp\Reclutamiento\Recruitment\RequestPosition\Interfaces\IRequestPositionAppService.cs`
- `LuxuryApp.Application\Modules\ReclutamientoLuxuryApp\Reclutamiento\Recruitment\RequestPosition\Mapping\RequestPositionMapper.cs`
- `LuxuryApp.Application\Modules\ReclutamientoLuxuryApp\Reclutamiento\Recruitment\RequestPosition\Services\RequestPositionAppService.cs`
- `LuxuryApp.Application\Modules\ReclutamientoLuxuryApp\Reclutamiento\Recruitment\SalaryModification\Entities\RequestSalaryModification.cs`
- `LuxuryApp.Application\Modules\ReclutamientoLuxuryApp\RecruitmentSourceCatalog\Services\RecruitmentSourceCatalogAppService.cs`
- `LuxuryApp.Application\Modules\ReclutamientoLuxuryApp\SolicitudVacante\Events\RequestPositionEvents.cs`
- `LuxuryApp.Application\Modules\ReclutamientoLuxuryApp\WorkPosition\Mapping\WorkPositionMapper.cs`
- `LuxuryApp.Application\Modules\ReclutamientoLuxuryApp\WorkPosition\Services\WorkPositionAppService.cs`

## Verificación

- `dotnet build LuxuryApp.sln` finalizó correctamente.
- Resultado final: 0 advertencias, 0 errores.
- Validación física: no quedan carpetas `Domain`, `Application` ni `Infrastructure` dentro de `ReclutamientoLuxuryApp`.
- Validación de namespaces: no quedan archivos `.cs` del módulo con namespace distinto de su ruta física.
- Validación de estilo: no quedan usos `global::LuxuryApp.Application.Modules.ReclutamientoLuxuryApp...` dentro del módulo.
