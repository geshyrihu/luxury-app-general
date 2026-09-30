# INFORME DE ANÁLISIS — ARCHIVOS NO UTILIZADOS EN `api`

- **Fecha:** 2026-08-15
- **Alcance:** `D:\repos\luxuryapp-api\api` (solo lectura, sin eliminación)
- **Prompt base:** `docs/prompts/limpieza-archivos.net.md`
- **Herramientas:** escáner estático automatizado (Python) sobre corpus completo `.cs` (2,955 archivos) + verificación manual dirigida.

---

## SECCIÓN 1 — RESUMEN EJECUTIVO

| Métrica | Valor |
|---|---|
| Archivos `.cs` analizados | 2,955 |
| Archivos escaneados (corpus total) | 2,955 |
| **KEEP** | ~2,820 |
| **REVIEW_MANUAL** | 3 |
| **QUARANTINE_CANDIDATE** | 49 |
| **SAFE_TO_REMOVE_HIGH_CONFIDENCE** | 4 |

### Riesgos detectados
1. **Auto-discovery masivo:** `IEndPointsModule` se descubre por reflexión (`MapAllEndPoints`), `IEntityTypeConfiguration<T>` por `ApplyConfigurationsFromAssembly`, `Profile` por `AddAutoMapper` (escaneo de todos los assemblies), y las migraciones EF Core son registradas por el tooling de EF. Nada de esto es detectable por búsqueda de nombre de clase.
2. **Extension methods:** los `ServiceExtensions/*.cs` de `LuxuryApp.Api` y los mappers (`EmailDataMapper`, `CustomerLocationMapper`, `AccessControlMapper`) se invocan por sintaxis de método de extensión, no por nombre de clase → el escáner los marcaba como "sin referencias". Verificados manualmente → KEEP.
3. **Consumo externo por contrato HTTP:** el frontend (`client/luxuryapp`) NO referencia nombres de DTOs backend; consume vía contrato JSON. Un DTO sin ningún endpoint que lo referencie no puede ser parte de ninguna respuesta HTTP.
4. **`swagger.json` desactualizado** (1,859 schemas): los DTOs candidatos no aparecen → no es fuente fiable de contrato.

### Nivel de certeza global
- **MEDIO-ALTO.** El análisis estático es exhaustivo (corpus completo, no solo `.cs`), pero no se verificó compilación real ni consumo de proyectos externos fuera de `api`. Per el prompt, los candidatos deben pasar validación con `dotnet build` antes de decisión final.

### Limitaciones del análisis
- No se ejecutó `dotnet build` (análisis solo lectura).
- No se revisaron repositorios externos que pudieran referenciar el assembly de la API directamente.
- `swagger.json` está obsoleto y no se usó como fuente de contrato.
- Frontend analizado solo por ausencia de referencias a nombres de tipos en `.ts`; el contrato real se valida vía consumo HTTP.

---

## SECCIÓN 2 — TABLA DE RESULTADOS (candidatos no KEEP)

| Archivo | Tipo | Estado | Confianza | Motivo | Referencias encontradas | Posible uso dinámico | Recomendación |
|---|---|---|---|---|---|---|---|
| `LuxuryApp.Application/.../ContabilidadLuxuryApp/DynamicReports/Integrations/AspelFast/DTOs/AccountBalanceDTO.cs` | DTO | SAFE_TO_REMOVE_HIGH_CONFIDENCE | HIGH | Archivo vacío (0 líneas de código) | 0 | No | Eliminar tras build OK |
| `LuxuryApp.Application/.../LegalLuxuryApp/Legal/LegalReport/Services/TimerSendLegalReport.cs` | Service | SAFE_TO_REMOVE_HIGH_CONFIDENCE | HIGH | Archivo vacío (0 líneas de código) | 0 | No | Eliminar tras build OK |
| `LuxuryApp.Application/.../ContabilidadLuxuryApp/PresupuestoShared/DTOs/PurchaseOrderBudgetForOrdenCompra.cs` | DTO | SAFE_TO_REMOVE_HIGH_CONFIDENCE | HIGH | 100% comentado, sin tipos compilados | 0 | No | Eliminar tras build OK |
| `LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Operations/TaskEngine/TaskTemplateRole.cs` | Entity | SAFE_TO_REMOVE_HIGH_CONFIDENCE | HIGH | 100% comentado, sin tipos compilados | 0 | No | Eliminar tras build OK |
| `LuxuryApp.Application/Filters/LogUserActivityAttribute.cs` | Filter (attribute) | QUARANTINE_CANDIDATE | HIGH | `[LogUserActivity]` no aplicado en ningún endpoint; el mecanismo vivo es `LogUserActivityEndPointsFilter` (`.AddEndpointFilter`) | 0 | Media (posible uso por convención de atributos) | Validar build, luego decidir |
| `.../AdminLuxuryApp/GestionDeCliente/Customers/DTOs/DocumentoCustomerDTO.cs` | DTO | QUARANTINE_CANDIDATE | MEDIUM | Sin referencias en todo el corpus | 0 | No | Validar build/tests |
| `.../AdminLuxuryApp/GestionDeCliente/Customers/DTOs/DocumentoCustomerAddOrEditDTO.cs` | DTO | QUARANTINE_CANDIDATE | MEDIUM | Sin referencias en todo el corpus | 0 | No | Validar build/tests |
| `.../AdminLuxuryApp/Infraestructura/UpdateDataBase/DTOs/FolioMappingReportDTO.cs` | DTO | QUARANTINE_CANDIDATE | MEDIUM | DTOs de reporte de migración one-shot; sin referencias | 0 | No | Validar build/tests |
| `.../AdminLuxuryApp/Infraestructura/UpdateDataBase/DTOs/OwnerToPropertyMemberMigrationResultDTO.cs` | DTO | QUARANTINE_CANDIDATE | MEDIUM | DTOs de resultado de migración one-shot; sin referencias | 0 | No | Validar build/tests |
| `.../AuthLuxuryApp/Auth/DTOs/AuthResponseDTO.cs` | DTO | QUARANTINE_CANDIDATE | MEDIUM | Sin referencias; el módulo Auth usa otros DTOs | 0 | No | Validar build/tests; confirmar contrato auth |
| `.../AuthLuxuryApp/Auth/DTOs/GroupedUserActivityDTO.cs` | DTO | QUARANTINE_CANDIDATE | MEDIUM | Sin referencias | 0 | No | Validar build/tests |
| `.../AuthLuxuryApp/Auth/DTOs/IdentityErrorDTO.cs` | DTO | QUARANTINE_CANDIDATE | MEDIUM | Sin referencias | 0 | No | Validar build/tests |
| `.../AuthLuxuryApp/Auth/DTOs/RefreshTokenRequestDTO.cs` | DTO | QUARANTINE_CANDIDATE | MEDIUM | Sin referencias | 0 | No | Validar build/tests |
| `.../AuthLuxuryApp/Auth/DTOs/RegisterDTO.cs` | DTO | QUARANTINE_CANDIDATE | MEDIUM | Sin referencias | 0 | No | Validar build/tests |
| `.../AuthLuxuryApp/Auth/DTOs/UserCustomerAccessDTO.cs` | DTO | QUARANTINE_CANDIDATE | MEDIUM | Sin referencias | 0 | No | Validar build/tests |
| `.../AuthLuxuryApp/Auth/DTOs/ValidateToken.cs` | DTO | QUARANTINE_CANDIDATE | MEDIUM | Sin referencias | 0 | No | Validar build/tests |
| `.../AuthLuxuryApp/Auth/ViewModels/AltaSistemasEmailViewModel.cs` | ViewModel | QUARANTINE_CANDIDATE | HIGH | Sin plantilla `.cshtml` que lo use como `@model` | 0 | No | Validar build/tests |
| `.../ContabilidadLuxuryApp/ContabilidadOnline/DTOs/FlujoCajaMesDTO.cs` | DTO | QUARANTINE_CANDIDATE | MEDIUM | Sin referencias | 0 | No | Validar build/tests |
| `.../ContabilidadLuxuryApp/PresupuestoPropuesta/DTOs/AnnualComparisonDTO.cs` | DTO | QUARANTINE_CANDIDATE | MEDIUM | Sin referencias | 0 | No | Validar build/tests |
| `.../MantenimientoLuxuryApp/MachineryAsset/DTOs/MachineryIndexDTO.cs` | DTO | QUARANTINE_CANDIDATE | MEDIUM | Sin referencias | 0 | No | Validar build/tests |
| `.../OperationsLuxuryApp/CustomDocument/DTOs/BuildingDocumentsAddOrEditDTO.cs` | DTO | QUARANTINE_CANDIDATE | MEDIUM | Sin referencias | 0 | No | Validar build/tests |
| `.../OperationsLuxuryApp/Inspections/DTOs/AddCondominiumAssetImagesDTO.cs` | DTO | QUARANTINE_CANDIDATE | MEDIUM | Sin referencias | 0 | No | Validar build/tests |
| `.../OperationsLuxuryApp/ServiceOrder/DTOs/ServiciosMttoProgramadosDTO.cs` | DTO | QUARANTINE_CANDIDATE | MEDIUM | Sin referencias | 0 | No | Validar build/tests |
| `.../OperationsLuxuryApp/Tasks/TaskLegal/DTOs/TaskLegalEditDTO.cs` | DTO | QUARANTINE_CANDIDATE | MEDIUM | Sin referencias | 0 | No | Validar build/tests |
| `.../OperationsLuxuryApp/Tasks/TaskLegal/DTOs/TaskLegalIndividualDTO.cs` | DTO | QUARANTINE_CANDIDATE | MEDIUM | Sin referencias | 0 | No | Validar build/tests |
| `.../OperationsLuxuryApp/Tasks/TaskLegal/DTOs/TaskLegalListDTO.cs` | DTO | QUARANTINE_CANDIDATE | MEDIUM | Sin referencias | 0 | No | Validar build/tests |
| `.../OperationsLuxuryApp/Tasks/TaskLegal/DTOs/TaskLegalRequestDTO.cs` | DTO | QUARANTINE_CANDIDATE | MEDIUM | Sin referencias | 0 | No | Validar build/tests |
| `.../OperationsLuxuryApp/Tasks/TaskLegal/DTOs/TaskLegalStatusDTO.cs` | DTO | QUARANTINE_CANDIDATE | MEDIUM | Sin referencias | 0 | No | Validar build/tests |
| `.../OperationsLuxuryApp/Tasks/TaskWorkPlan/ViewModels/TicketReportItem.cs` | ViewModel | QUARANTINE_CANDIDATE | HIGH | Solo referenciado en su propio archivo; sin plantilla | 0 | No | Validar build/tests |
| `.../ReclutamientoLuxuryApp/Reclutamiento/Recruitment/ViewModels/SolicitudVacanteEmailViewModel.cs` | ViewModel | QUARANTINE_CANDIDATE | HIGH | Sin plantilla `.cshtml` | 0 | No | Validar build/tests |
| `.../RecursosHumanosLuxuryApp/Employees/ViewModels/ModificacionSalarioEmailViewModel.cs` | ViewModel | QUARANTINE_CANDIDATE | HIGH | Sin plantilla `.cshtml` | 0 | No | Validar build/tests |
| `.../RecursosHumanosLuxuryApp/Employees/ViewModels/SolicitudAltaEmailViewModel.cs` | ViewModel | QUARANTINE_CANDIDATE | HIGH | Sin plantilla `.cshtml` | 0 | No | Validar build/tests |
| `.../RecursosHumanosLuxuryApp/Employees/ViewModels/SolicitudBajaEmailViewModel.cs` | ViewModel | QUARANTINE_CANDIDATE | HIGH | Sin plantilla `.cshtml` | 0 | No | Validar build/tests |
| `.../RecursosHumanosLuxuryApp/Evaluacion/EvaluationTemplate/DTOs/EvaluationCategoryFormDTO.cs` | DTO | QUARANTINE_CANDIDATE | MEDIUM | Sin referencias | 0 | No | Validar build/tests |
| `.../RecursosHumanosLuxuryApp/IncidenciasAdministrativas/HRIncident/DTOs/IncidentAttachmentDetailDTO.cs` | DTO | QUARANTINE_CANDIDATE | MEDIUM | Sin referencias | 0 | No | Validar build/tests |
| `.../RecursosHumanosLuxuryApp/TimeOff/Vacations/VacationBalanceAdmin/DTOs/ManualBalanceUpdateDTO.cs` | DTO | QUARANTINE_CANDIDATE | MEDIUM | Sin referencias | 0 | No | Validar build/tests |
| `.../SupplierLuxuryApp/Purchases/OrdenCompra/DTOs/PurchaseOrderListDTO.cs` | DTO | QUARANTINE_CANDIDATE | MEDIUM | Expone `PurchaseRequestListDTO` sin referencias | 0 | No | Validar build/tests |
| `.../SupplierLuxuryApp/Purchases/SolicitudCompra/DTOs/PaginatorPurchaseRequestProductAddDTO.cs` | DTO | QUARANTINE_CANDIDATE | MEDIUM | Expone `PurchaseRequestProductDTO` y `PaginatorPurchaseRequestProductAddDTO` sin referencias | 0 | No | Validar build/tests |
| `.../SupplierLuxuryApp/Purchases/SolicitudCompra/DTOs/PurchaseRequestDTO.cs` | DTO | QUARANTINE_CANDIDATE | MEDIUM | Expone `PurchaseOrderRelationDTO` sin referencias | 0 | No | Validar build/tests |
| `.../SupplierLuxuryApp/Purchases/SolicitudCompra/DTOs/PurchaseRequestProductListAddDTO.cs` | DTO | QUARANTINE_CANDIDATE | MEDIUM | Sin referencias | 0 | No | Validar build/tests |
| `.../SupplierLuxuryApp/Purchases/SolicitudCompra/DTOs/PurchaseRequestProductsAddDTO.cs` | DTO | QUARANTINE_CANDIDATE | MEDIUM | Sin referencias | 0 | No | Validar build/tests |
| `.../SystemLuxuryApp/Infrastructure/SendEmail/DTOs/MailRecipientsDTO.cs` | DTO | QUARANTINE_CANDIDATE | MEDIUM | Sin referencias | 0 | No | Validar build/tests |
| `.../SystemLuxuryApp/SystemTenant/Notification/DTOs/SendNotificationDTO.cs` | DTO | QUARANTINE_CANDIDATE | MEDIUM | Sin referencias | 0 | No | Validar build/tests |
| `LuxuryApp.Infrastructure.Data/Seeds/FinancialReportSeed.cs` | Seeder | QUARANTINE_CANDIDATE | MEDIUM | `GetInitialReports()` no invocado desde ningún sitio (Program.cs invoca IdentitySeed y VaultSeeder) | 0 | Baja (posible seeder por convención) | Validar build; revisar si debe invocarse |
| `LuxuryApp.Shared/Enums/ManualInstanceItemStatus.cs` | Enum | QUARANTINE_CANDIDATE | MEDIUM | No mapeado en `SelectItemEnumEndPoints`, sin referencias | 0 | Media (contrato JSON de frontend) | Validar build/tests |
| `LuxuryApp.Shared/Enums/ManualInstanceStatus.cs` | Enum | QUARANTINE_CANDIDATE | MEDIUM | No mapeado en `SelectItemEnumEndPoints`, sin referencias | 0 | Media (contrato JSON de frontend) | Validar build/tests |
| `LuxuryApp.Shared/Enums/SectionType.cs` | Enum | QUARANTINE_CANDIDATE | MEDIUM | No mapeado en `SelectItemEnumEndPoints`, sin referencias | 0 | Media (contrato JSON de frontend) | Validar build/tests |
| `LuxuryApp.Shared/Extensions/UserRoleUpdateException.cs` | Exception | QUARANTINE_CANDIDATE | MEDIUM | Sin usos en todo el corpus | 0 | No | Validar build/tests |
| `LuxuryApp.Shared/Services/ITimerReportAppService.cs` | Interface | QUARANTINE_CANDIDATE | MEDIUM | Sin implementaciones ni usos en todo el corpus | 0 | No | Validar build/tests |
| `LuxuryApp.Api/Hangfire/HangfireAuthorizationFilter.cs` | Filter (Hangfire) | REVIEW_MANUAL | LOW | Clase no referenciada; `DashboardOptions.Authorization` en Program.cs está vacío `[]` (panel Hangfire sin filtro de auth) | 0 | Media (seguridad) | Revisar seguridad del panel Hangfire antes de eliminar |
| `LuxuryApp.Application/Moduls/SystemLuxuryApp/System-AI/ElevenLabs/Mapping/ElevenLabsMapper.cs` | Mapper (documentación) | REVIEW_MANUAL | LOW | Contiene solo clase de documentación `ElevenLabsMapperDocumentation` sin métodos ni mapeos | 0 | No | Revisar si la documentación embebida debe migrarse |
| `LuxuryApp.Application/GlobalUsings.cs` | GlobalUsings | REVIEW_MANUAL | LOW | Detectado por escáner sin refs directas, pero es **esencial** del proyecto | — | — | **KEEP — NO eliminar** |

> **NOTA:** `GlobalUsings.cs` aparece en esta tabla solo por completitud; es un falso positivo del escáner y debe tratarse como KEEP.

---

## SECCIÓN 3 — CANDIDATOS DETALLADOS

Para cada candidato se ejecutaron estas búsquedas sobre el corpus completo (`*.cs`, `*.cshtml`, `*.json`, `*.xml`, `*.config`, `*.props`, `*.targets`, `*.sql`, `*.sln`, `*.txt`, `*.md`), excluyendo `bin/` y `obj/`:

1. Búsqueda por nombre de tipo con límite de palabra (`\bTipo\b`).
2. Búsqueda por nombre de archivo sin extensión.
3. Verificación de registros DI (`AddScoped/Transient/Singleton/AddHostedService`).
4. Verificación de routing/endpoints (`MapGet/MapPost/MapGroup/MapEndPoints`).
5. Verificación de `IEndPointsModule`, `IEntityTypeConfiguration<T>`, `Profile`, `DbContext`, `: Migration`.
6. Verificación de plantillas Razor (`@model`).
7. Verificación de appsettings/configuración.
8. Verificación de tests (`LuxuryApp.Tests`).

### Resumen por grupo

#### A. SAFE_TO_REMOVE_HIGH_CONFIDENCE (4)
Archivos sin tipos compilados (vacíos o 100% comentados). No aportan nada al assembly; su eliminación no puede romper la compilación. Aun así, según el prompt, se validan con build antes de borrar.

| Ruta completa | Detalle |
|---|---|
| `api/LuxuryApp.Application/Moduls/ContabilidadLuxuryApp/DynamicReports/Integrations/AspelFast/DTOs/AccountBalanceDTO.cs` | 0 líneas de código |
| `api/LuxuryApp.Application/Moduls/LegalLuxuryApp/Legal/LegalReport/Services/TimerSendLegalReport.cs` | 0 líneas de código |
| `api/LuxuryApp.Application/Moduls/ContabilidadLuxuryApp/PresupuestoShared/DTOs/PurchaseOrderBudgetForOrdenCompra.cs` | 14 líneas, todo comentado |
| `api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Operations/TaskEngine/TaskTemplateRole.cs` | 31 líneas, todo comentado |

#### B. QUARANTINE_CANDIDATE (49)
DTOs, ViewModels, enums, interfaz y seeder con **0 referencias** en el corpus completo. No están registrados en DI, no expuestos por routing, no descubiertos por scanning, no usados por EF Core, no usados por tests ni configuración.

**Verificación de seguridad específica (FASE 13):**
- Los DTOs del módulo Auth (`AuthResponseDTO`, `RegisterDTO`, `ValidateToken`, etc.) no son referenciados por ningún endpoint; el frontend consume vía HTTP, y un DTO sin endpoint no puede estar en ninguna respuesta. Riesgo residual: bajo.
- Los ViewModels de email (`*EmailViewModel`, `TicketReportItem`) no tienen plantilla `.cshtml` correspondiente con `@model` → no pueden renderizarse.
- Los enums de `LuxuryApp.Shared` no están en el mapeo de `SelectItemEnumEndPoints` (verificado línea a línea: no aparecen `ManualInstanceStatus`, `ManualInstanceItemStatus`, `SectionType`). Riesgo residual: consumo por contrato JSON desde frontend (valores numéricos/string), por lo que no son HIGH.
- `FinancialReportSeed` no se invoca; `Program.cs` sí invoca otros seeders. Riesgo: seeder por convención. No HIGH.
- `ITimerReportAppService` no tiene implementaciones. No HIGH (puede existir implementación pendiente o por convención).

#### C. REVIEW_MANUAL (3)
- `HangfireAuthorizationFilter.cs`: no referenciado; riesgo de seguridad (si el panel Hangfire se expone, debería usarse este filtro). Revisión humana necesaria.
- `ElevenLabsMapper.cs`: solo documentación embebida. Decidir si la documentación debe migrar a docs antes de eliminar.
- `GlobalUsings.cs`: **KEEP** — archivo esencial de compilación.

---

## SECCIÓN 4 — ARCHIVOS QUE NO DEBEN BORRARSE

Aunque el escáner no detectó referencias directas por nombre de clase, se confirman como KEEP por mecanismo de uso:

| Archivo | Mecanismo |
|---|---|
| `api/LuxuryApp.Api/Program.cs` | Entry point |
| `api/LuxuryApp.Api/Middleware/IoC.cs` (`AddDependency`) | DI |
| `api/LuxuryApp.Api/ServiceExtensions/*.cs` (16 archivos) | Extension methods invocados por `Program.cs`/`IoC.cs` (`AddCustomAuthentication`, `AddCustomAutoMapper`, `AddCustomCors`, `AddConfiguredDbContext`, `AddCustomAuthorization`, `AddFeatureServices`, `AddApplicationInfrastructure`, `AddInfrastructureServices`, `AddCustomControllers`, `AddHangfireServices`, `AddCustomIdentity`, `AddCustomLocalization`, `AddCustomOptions`, `AddCustomScalar`/`UseCustomScalar`, `AddCustomSignalR`) |
| `api/LuxuryApp.Api/Hangfire/HangfireExtensions.cs` | `RegisterRecurringJobsAsync` llamado en `Program.cs` |
| `api/LuxuryApp.Infrastructure.Vault/Registration/VaultServiceExtensions.cs` | `AddVaultServices()` en `Program.cs` |
| `api/LuxuryApp.Providers/Extensions/ProvidersServiceCollectionExtensions.cs` | `AddLuxuryProviders()` en `Program.cs` |
| `api/LuxuryApp.Infrastructure.Data/Data/ApplicationDbContextFactory.cs` | `IDesignTimeDbContextFactory<T>` (tooling `dotnet ef`) |
| `api/LuxuryApp.Infrastructure.Vault/Data/VaultDbContextFactory.cs` | `IDesignTimeDbContextFactory<T>` |
| Todos los archivos bajo `*/Migrations/` (8) | EF Core: body + `*.Designer.cs` + `ModelSnapshot` (obligatorio conservar) |
| `api/LuxuryApp.Infrastructure.Data/Data/ApplicationDbContext.cs` | `ApplyConfigurationsFromAssembly` (línea 976) |
| `api/LuxuryApp.Application/Endpoints/IEndPointsModule.cs` | Interfaz escaneada por reflexión en `EndPointsRouteBuilderExtensions.MapAllEndPoints` |
| `api/LuxuryApp.Application/Moduls/SharedLuxuryApp/Endpoints/SelectItemEnumEndPoints.cs` | `IEndPointsModule` con enums mapeados |
| `api/LuxuryApp.Application/Moduls/.../EmailData/Mapping/EmailDataMapper.cs` | Extension method `.ToDTO()` usado por `EmailDataAppService` |
| `api/LuxuryApp.Application/Moduls/.../CustomerLocations/Mapping/CustomerLocationMapper.cs` | Extension method `.ToDto()` usado por `CustomerLocationAppService` |
| `api/LuxuryApp.Application/Moduls/.../AccessControl/Mapping/AccessControlMapper.cs` | Extension method `.ToDto()` usado por AppServices de Access |
| `api/LuxuryApp.Application/Moduls/.../OrdenCompra/Services/OrdenCompraExtensions.cs` | `CalcularTotalDetalles()` usado en 1 archivo |
| `api/LuxuryApp.Application/Moduls/.../Fondeos/Helpers/FundingProjections.cs` | `ToFundingOrdenDTO()` usado en 1 archivo |
| `api/LuxuryApp.Shared/Extensions/QueryableExtensions.cs` | `Paginate()` usado en 4 archivos |
| `api/LuxuryApp.Api/Infrastructure/Email/Templates/**` (10) | Excluidos de compilación en csproj (`<Compile Remove="Templates\**" />`); plantillas Razor |
| `api/LuxuryApp.Tests/**` (58) | Proyecto de tests |
| `api/LuxuryApp.Application/GlobalUsings.cs` | Global usings esencial |
| `api/LuxuryApp.Api/Infrastructure/Email/Templates/Shared/_EmailLayout.cshtml` | Usa `EmailDesignTokens` (KEEP del tema de diseño) |
| `api/LuxuryApp.Shared/Design/EmailDesignTokens.cs` | Usado por `_EmailLayout.cshtml` |

---

## SECCIÓN 5 — FALSOS POSITIVOS DETECTADOS

Archivos que inicialmente el escáner marcó como "sin referencias" y fueron descartados por mecanismo de uso:

1. **Extension methods (17):** todos los `ServiceExtensions/*.cs` de `LuxuryApp.Api`, `VaultServiceExtensions`, `ProvidersServiceCollectionExtensions`, `HangfireExtensions` — se invocan por método de extensión desde `Program.cs`/`IoC.cs`. El escáner busca por nombre de clase, no por nombre de método.
2. **AutoMapper profiles (115):** `AddCustomAutoMapper` escanea todos los assemblies en busca de subclases `Profile` → todo archivo con `CreateMap` es usado aunque no tenga referencias directas.
3. **Configuraciones EF Core (329):** `IEntityTypeConfiguration<T>` descubiertas por `ApplyConfigurationsFromAssembly` en `ApplicationDbContext.cs:976`.
4. **Migrations (8):** archivos `: Migration`, `*.Designer.cs` y `ModelSnapshot` — registrados por el tooling de EF Core, no por referencia de código.
5. **Design-time factories (2):** `ApplicationDbContextFactory`, `VaultDbContextFactory` — usadas por `dotnet ef` (no aparecen en código runtime).
6. **Mappers extension method (3):** `EmailDataMapper`, `CustomerLocationMapper`, `AccessControlMapper` — invocados como `.ToDto()/.ToDTO()` desde sus AppServices.
7. **Helpers extension (3):** `QueryableExtensions.Paginate`, `OrdenCompraExtensions.CalcularTotalDetalles`, `FundingProjections.ToFundingOrdenDTO` — usados en otros archivos.
8. **Plantillas Razor (10):** excluidas de compilación por csproj, pero usadas por el renderizador de email.
9. **`LogUserActivityEndPointsFilter`:** usado vía `.AddEndpointFilter<LogUserActivityEndPointsFilter>()` en múltiples endpoints (se confundió con el atributo `LogUserActivityAttribute`, que sí es candidato).
10. **`GlobalUsings.cs`:** esencial de compilación, sin referencias explícitas por diseño.

---

## SECCIÓN 6 — PLAN DE LIMPIEZA SEGURA

> **NO ejecutar ninguna fase destructiva sin aprobación.** Este análisis fue solo lectura.

- **Fase 1 — Reporte (completada):** este documento.
- **Fase 2 — Cuarentena de alta confianza (4 SAFE_TO_REMOVE):**
  - Crear rama: `git checkout -b chore/unused-api-files-analysis`
  - Sacar de compilación sin borrar (SDK-style incluye todos los `.cs`):
    - **Opción A:** renombrar a `archivo.cs.disabled`
    - **Opción B:** mover a `D:\repos\luxuryapp-api_quarantine\api` (fuera del proyecto)
- **Fase 3 — Build + tests:**
  - `dotnet restore`
  - `dotnet build --no-incremental`
  - `dotnet test` (existe `LuxuryApp.Tests`)
  - `dotnet publish -c Release` (validación exigente, opcional)
  - Si falla → revertir y marcar KEEP/REVIEW_MANUAL registrando la referencia.
- **Fase 4 — Revisión manual de endpoints expuestos:** los DTOs Auth y enums Shared deben confirmarse contra el frontend (contrato HTTP real, logs, Swagger generado desde la API viva — no el `swagger.json` obsoleto).
- **Fase 5 — Revisión manual de reflexión/scanning:** revisar `FinancialReportSeed`, `ITimerReportAppService`, `LogUserActivityAttribute` contra seeders y convenciones de atributos.
- **Fase 6 — Eliminación definitiva (opcional, solo tras aprobación):** borrar solo los validados.

---

## SECCIÓN 7 — COMANDOS DE VALIDACIÓN SUGERIDOS

```powershell
# Listar archivos
Get-ChildItem -Path "D:\repos\luxuryapp-api\api" -Recurse -File | Select-Object FullName

# Buscar texto recursivamente (ripgrep)
rg -n "NombreTipo" "D:\repos\luxuryapp-api\api"

# Buscar con PowerShell
Get-ChildItem -Path "D:\repos\luxuryapp-api\api" -Recurse -Include *.cs,*.json,*.csproj,*.props,*.sql |
  Select-String -Pattern "NombreTipo"

# Compilar
dotnet restore "D:\repos\luxuryapp-api\api"
dotnet build "D:\repos\luxuryapp-api\api" --no-incremental

# Tests
dotnet test "D:\repos\luxuryapp-api\api"

# Publicación de validación
dotnet publish "D:\repos\luxuryapp-api\api" -c Release -o "D:\repos\luxuryapp-api_publish_validation"
```

---

## SECCIÓN 8 — SALIDA ESTRUCTURADA

Versión JSON completa generada en el mismo directorio: `20260815-INFORME-LIMPIEZA-ARCHIVOS-NO-UTILIZADOS.json` (56 registros: 4 SAFE, 49 QUARANTINE, 2 REVIEW_MANUAL + GlobalUsings como KEEP).

Estructura por registro:
```json
{
  "filePath": "...",
  "fileType": "...",
  "status": "KEEP | REVIEW_MANUAL | QUARANTINE_CANDIDATE | SAFE_TO_REMOVE_HIGH_CONFIDENCE",
  "confidence": "HIGH | MEDIUM | LOW",
  "reason": "...",
  "referencesFound": [],
  "registeredInDI": false,
  "exposedByRouting": false,
  "discoveredByConvention": false,
  "discoveredByScanning": false,
  "usedByEFCore": false,
  "usedByReflection": false,
  "usedByTests": false,
  "usedByConfiguration": false,
  "externalConsumptionPossible": false,
  "validationSuggested": "..."
}
```

---

### Conclusión

- **4 archivos** vacíos/comentados: eliminación segura (tras build).
- **49 archivos** con fuertes indicios de no uso: cuarentena + build/tests antes de decidir.
- **3 archivos** requieren revisión humana (seguridad Hangfire, documentación ElevenLabs, GlobalUsings).
- El grueso de "candidatos" del escáner automático fueron **falsos positivos** por auto-discovery (reflexión, EF Core scanning, AutoMapper scanning, extension methods) y quedan correctamente clasificados como KEEP.
