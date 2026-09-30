# REGISTRO DE EJECUCIÓN — LIMPIEZA DE ARCHIVOS NO UTILIZADOS EN `api`

- **Fecha:** 2026-08-15
- **Alcance:** `D:\repos\luxuryapp-api\api` — Fase 2 (cuarentena) + Fase 3 (build/tests) del plan del informe `20260815-INFORME-LIMPIEZA-ARCHIVOS-NO-UTILIZADOS.md`
- **Método aplicado:** Opción A del prompt (`../../../docs/SharedLuxuryApp/Conventions/20260801-prompt-shared-limpieza-archivos.md`, FASE 14): renombrar candidatos a `archivo.cs.disabled` (extensión no compilable en proyectos SDK-style). **No se eliminó ningún archivo.**

---

## Resumen de la ejecución

| Paso | Resultado |
|---|---|
| Build baseline (antes de cuarentena) | ✅ 0 errores |
| Cuarentena aplicada | ✅ 49 archivos renombrados a `.cs.disabled` |
| Build con cuarentena | ✅ 0 errores (`dotnet build api/LuxuryApp.sln`) |
| Tests con cuarentena | ⚠️ 440 superados / 5 fallos / 2 omitidos (447 total) |
| Prueba de preexistencia (cuarentena revertida + tests) | ⚠️ los mismos 5 fallos — **preexistentes, no causados por la limpieza** |
| Cuarentena re-aplicada | ✅ 49 archivos `.cs.disabled` |
| Build final | ✅ 0 errores |

## Los 5 tests fallidos son PREEXISTENTES (no relacionados con la cuarentena)

Se revirtió la cuarentena temporalmente, se compiló y se ejecutaron los mismos tests filtrados → los 5 fallan de forma idéntica con y sin cuarentena. Evidencia:

- `PeriodClosureServiceTests.ClosePeriodAsync_WhenNotClosed_CreatesClosureSuccessfully`
  - `Expected type to be Microsoft.AspNetCore.Mvc.ActionResult<ApiResponseDTO<PeriodClosureResponseDTO>>, but found ApiResponseDTO<...>` → el código devuelve `ApiResponseDTO<T>` directamente; el test espera `ActionResult<T>` (cambio de contrato anterior, no relacionado).
- `MeetingAppServiceTests.AddAsync_ConDatosValidos_CreaMeetingYRetornaDTO` / `UpdateAsync_...`
  - `Expected result.Success to be True, but found False.`
- `ChargeAppServiceTests.UpdateAsync_AllowedFields_UpdatesSuccessfully`
  - `Expected result.Success to be True, but found False.`
- `EmployeeDataValidationServiceTests.GetMissingDataReportAsync_WithEmployeeMissingAllData_ReturnsAllIssues`
  - fallo de aserción (sin mensaje de detalle capturado).

Ninguno de los tipos cuarentenados participa en estos tests (los tests se refieren a `PeriodClosureResponseDTO`, `MeetingAppService`, `ChargeAppService`, `EmployeeDataValidationService`, todos KEEP).

## Archivos en cuarentena (49)

Manifest de reversión en: `/tmp/opencode/quarantine_manifest.json`

### SAFE_TO_REMOVE_HIGH_CONFIDENCE (4)
- `LuxuryApp.Application/Moduls/ContabilidadLuxuryApp/DynamicReports/Integrations/AspelFast/DTOs/AccountBalanceDTO.cs` (vacío)
- `LuxuryApp.Application/Moduls/LegalLuxuryApp/Legal/LegalReport/Services/TimerSendLegalReport.cs` (vacío)
- `LuxuryApp.Application/Moduls/ContabilidadLuxuryApp/PresupuestoShared/DTOs/PurchaseOrderBudgetForOrdenCompra.cs` (100% comentado)
- `LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Operations/TaskEngine/TaskTemplateRole.cs` (100% comentado)

### QUARANTINE_CANDIDATE (45)
- `LuxuryApp.Application/Filters/LogUserActivityAttribute.cs`
- DTOs AdminLuxuryApp: `DocumentoCustomerDTO`, `DocumentoCustomerAddOrEditDTO`, `FolioMappingReportDTO`, `OwnerToPropertyMemberMigrationResultDTO`
- DTOs AuthLuxuryApp: `AuthResponseDTO`, `GroupedUserActivityDTO`, `IdentityErrorDTO`, `RefreshTokenRequestDTO`, `RegisterDTO`, `UserCustomerAccessDTO`, `ValidateToken`, `AltaSistemasEmailViewModel`
- DTOs ContabilidadLuxuryApp: `FlujoCajaMesDTO`, `AnnualComparisonDTO`
- DTOs MantenimientoLuxuryApp: `MachineryIndexDTO`
- DTOs OperationsLuxuryApp: `BuildingDocumentsAddOrEditDTO`, `AddCondominiumAssetImagesDTO`, `ServiciosMttoProgramadosDTO`, `TaskLegalEditDTO`, `TaskLegalIndividualDTO`, `TaskLegalListDTO`, `TaskLegalRequestDTO`, `TaskLegalStatusDTO`, `TicketReportItem`
- ViewModels: `SolicitudVacanteEmailViewModel`, `ModificacionSalarioEmailViewModel`, `SolicitudAltaEmailViewModel`, `SolicitudBajaEmailViewModel`
- DTOs RecursosHumanosLuxuryApp: `EvaluationCategoryFormDTO`, `IncidentAttachmentDetailDTO`, `ManualBalanceUpdateDTO`
- DTOs SupplierLuxuryApp: `PurchaseOrderListDTO`, `PaginatorPurchaseRequestProductAddDTO`, `PurchaseRequestDTO`, `PurchaseRequestProductListAddDTO`, `PurchaseRequestProductsAddDTO`
- DTOs SystemLuxuryApp: `MailRecipientsDTO`, `SendNotificationDTO`
- `LuxuryApp.Infrastructure.Data/Seeds/FinancialReportSeed.cs`
- `LuxuryApp.Shared/Enums/ManualInstanceItemStatus.cs`, `ManualInstanceStatus.cs`, `SectionType.cs`
- `LuxuryApp.Shared/Extensions/UserRoleUpdateException.cs`
- `LuxuryApp.Shared/Services/ITimerReportAppService.cs`

## NO tocados (revisión manual pendiente, no incluidos en cuarentena)
- ~~`LuxuryApp.Api/Hangfire/HangfireAuthorizationFilter.cs`~~ → **ACTIVADO** (2026-08-15): `Authorization = [new HangfireAuthorizationFilter()]` en `Program.cs:286` + `using LuxuryApp.Api.Hangfire`. Solo accede el rol `SuperUsuario`.
- ~~`LuxuryApp.Application/Moduls/SystemLuxuryApp/System-AI/ElevenLabs/Mapping/ElevenLabsMapper.cs`~~ → **ELIMINADO** (2026-08-15): solo documentación, sin tipos ni lógica, sin referencias. La regla "prohibido AutoMapper en consultas" ya está en GEMINI.md/skills.
- `LuxuryApp.Application/GlobalUsings.cs` → KEEP (falso positivo).

## Estado actual de la limpieza
- Los 49 candidatos están **fuera de compilación** (`.cs.disabled`) pero **preservados íntegramente en el repositorio**.
- Reversión inmediata: renombrar cada `archivo.cs.disabled` de vuelta a `archivo.cs` (script/manifest en `/tmp/opencode/quarantine_manifest.json`).

## ACTUALIZACIÓN — Eliminación definitiva parcial aprobada

- **2026-08-15:** con aprobación explícita del usuario se eliminaron definitivamente los **4 SAFE_TO_REMOVE_HIGH_CONFIDENCE** (archivos vacíos/comentados):
  - `AccountBalanceDTO.cs`
  - `TimerSendLegalReport.cs`
  - `PurchaseOrderBudgetForOrdenCompra.cs`
  - `TaskTemplateRole.cs`
- Build posterior a la eliminación: ✅ **0 errores** (`dotnet build api/LuxuryApp.sln`).
- Los **45 QUARANTINE_CANDIDATE** permanecen en cuarentena (`.cs.disabled`), preservados íntegramente, a la espera de validación de consumo externo.

## Próximos pasos (no ejecutados, pendientes de aprobación)
1. **Fase 4 — Revisión de consumo externo:** confirmar DTOs Auth y enums Shared contra el frontend (contrato HTTP real, Swagger vivo).
2. **Fase 5 — Revisión reflexión/scanning:** `FinancialReportSeed`, `ITimerReportAppService`, `LogUserActivityAttribute`.
3. **Fase 6 — Eliminación definitiva de los 45 QUARANTINE (opcional):** solo tras aprobación explícita y validación de consumo externo; requiere `git`/backup (actualmente el directorio NO es un repositorio git). **Los 45 restantes NO han sido eliminados.**
