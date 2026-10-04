# INVENTARIO API — LuxuryApp (Modules)

> **Fecha:** 2026-09-11
> **Alcance:** `api/LuxuryApp.Application/Modules/` (16 módulos, excl. `ResidentesLuxuryApp` vacío)
> **Método:** extracción mecánica (regex) sobre archivos `.cs` — endpoints (`*.EndPoints.cs`), servicios (`*AppService/Service/Manager`) e interfaces.
> **Artefactos de datos:** `api/LuxuryApp.Application/Modules/_inventory/*.csv` (datos crudos clasificados).

---

## 1. Resumen Ejecutivo

| Métrica | Valor |
|---|---|
| Módulos | 16 (15 con código; `ResidentesLuxuryApp` vacío) |
| Servicios/Interfaces únicos | ~364 tipos (2058 métodos en interfaces + 1871 en clases) |
| **Métodos públicos extraídos** | **3,929** |
| **Endpoints HTTP** | **1,812** en 291 archivos `EndPoints` |
| DTOs (archivos en `DTOs/` o `*DTO.cs`) | **896** |

### Distribución de métodos por categoría

| Categoría | Métodos | % |
|---|---:|---:|
| GET_LIST | 858 | 21.8% |
| OTHER (naming no CRUD estándar) | 698 | 17.8% |
| GET_SINGLE | 693 | 17.6% |
| SPECIAL | 490 | 12.5% |
| UPDATE | 409 | 10.4% |
| CREATE | 402 | 10.2% |
| DELETE | 379 | 9.6% |

### Distribución de endpoints por verbo/categoría

| Verbo HTTP | # | Categoría derivada | # |
|---|---:|---|---:|
| GET | 986 | GET_SINGLE (con `{id}`) | 695 |
| POST | 398 | GET_LIST | 291 |
| PUT | 210 | CREATE | 320 |
| DELETE | 187 | UPDATE | 241 |
| PATCH | 31 | DELETE | 187 |
| | | SPECIAL | 78 |

**Lectura clave:** GET domina (54% del tráfico de endpoints). `GET_SINGLE` casi triplica a `GET_LIST` — indicio de granularidad fina por `{id}` y queries puntuales, con relativamente pocos listados puros (los listados se concentran en `api/select-items`, 75 rutas).

### Concentración por módulo

| Módulo | Métodos | Endpoints | Comentario |
|---|---:|---:|---|
| **OperationsLuxuryApp** | 932 | 421 | ~1/4 de toda la API; 26+ subdominios |
| ReclutamientoLuxuryApp | 568 | 323 | Mayor % de SPECIAL (120) — workflow de candidatos |
| MantenimientoLuxuryApp | 380 | 206 | CRUD clásico |
| ContabilidadLuxuryApp | 294 | 139 | 21 submódulos, alto OTHER (71) — Aspel/folios |
| SystemLuxuryApp | 338 | 135 | 86 GET_LIST (75 son select-items) + 91 SPECIAL |
| CobranzaLuxuryApp | 249 | 135 | 52 SPECIAL (liquidaciones, ajustes) |
| RecursosHumanosLuxuryApp | 249 | 126 | 85 OTHER (nómina con naming mixto) |
| Resto (8 módulos: Admin, Auth, Compras, Committee, Direccion, Legal, Shared, Supplier) | 808 | 334 | Detalle en Sección 5 |

---

## 2. Patrones identificados

### Patrones correctos (mayoritarios)
- **`GetById{Async}`**: 258 usos — el estándar de facto para GET_SINGLE. ✓
- **`GetAll{Async}` / `GetAllByXxx`**: 191+ usos para GET_LIST. ✓
- **`Update{Entity}Async` / `DeleteByIdAsync` / `Add{Entity}`**: verbos CRUD consistentes en la mayoría de los módulos.
- **`{VerboDeNegocio}{Entity}Async`** para SPECIAL: `ApproveAsync` (8), `RejectAsync` (8), `CancelAsync` (10), `ToggleActiveAsync` (6), `GeneratePdfAsync` (6). ✓
- Endpoints: patrón minimal API `group.MapGroup("api/recurso").MapGet("{id}", ...)` uniforme en los 291 archivos.
- Sufijo `Async` en 93%+ de métodos asíncronos.

### Inconsistencias detectadas

1. **Métodos `OTHER` (698 — 17.8%)**: naming no CRUD. Patrones:
   - **Español/inglés mezclados en el mismo dominio**: `AutorizarAsync`/`AprobarAsync` + `ApproveAsync`; `Calcular`; `SubirDocumentoAsync`; `AgregarAdjuntoAsync`; `SincronizarPermisosAsync`; `GuardarHojaIncidenciasAsync`; `EliminarEnlacePasoAsync` (concentrado en RecursosHumanosLuxuryApp: 85 OTHER de 249 métodos).
   - **`SaveXxx` con semántica upsert ambigua** (15): `SaveAsync`, `SaveSettingsAsync`, `SaveSignedActAsync` → clasificados UPDATE pero ejecutan create+update.
   - **Wrappers de EF en servicios**: `FirstOrDefaultAsync`, `ToListAsync`, `Parse`, `ResolveAsync`, `CanManageStructuralHr` — métodos auxiliares expuestos como públicos en servicios.
   - **Naming por resultado y no por intención**: `DataGraficoMensualAsync`, `EmployeeBirthdayAsync`, `ToRunResult`, `WeeklyReportPreviewAsync`, `OnGetComiteVigilanciaAsync`, familia `OnGenerateFolio*` (Contabilidad, 8+ variantes).

2. **`Get` sin criterio explícito (~324)**: `GetHistoryAsync`(5), `GetPendingAsync`(4), `GetDashboardAsync`, `GetBalanceRealTimeAsync`, `GetDeudasActualesAsync`, `GetEstadoCuentaRangoAsync` — la ruta HTTP no revela si retorna single o list; en el inventario se resolvieron por tipo de retorno.

3. **`GET` ejecutando cambios de estado** (violación REST, ~detectadas):
   - `GET api/orden-compra-auth/autorizar/{ordenCompraId:guid}/{applicationUserId}`
   - `GET api/orden-compra-auth/desautorizar/{ordenCompraId:guid}`
   → Deben ser `POST {id}/approve|reject` (SPECIAL).

4. **`PUT/DELETE` sin `{id}` en ruta** (12 casos) — colecciones completas actualizadas por body:
   - `PUT api/approval-rules/matrix`, `PUT api/funding/update-order`, `PUT api/machineries/update-category`, `PUT api/tasks/update-order`, `PUT api/almacen/assign-responsibles`, `DELETE api/logs/all`.
   → Aceptable para reorden/matríces batch, pero conviene convención `PUT api/recurso/batch` para distinguirlos.

5. **`POST` usado como query** (por filtros complejos — patrón legítimo pero sin convención visible):
   - `POST api/dynamic-reports/execute`, `POST api/dynamic-reports/execute/pdf`, `POST api/financial-report/create-period`, `POST api/maintenance-report/weekly-executive-report`.
   → Estándar propuesto: `POST /recurso/search` o `POST /recurso/reports/execute`.

6. **Rutas mixtas español/inglés**: `api/compras/historial-compras/pagadas`, `api/hr/nomina/periodos/auto-crear`, `PUT api/providers/autorizar/{id}`, `POST api/presentaciones-junta-comite/autorizar-presentacion/...` junto a rutas 100% inglesas en otros módulos.

7. **Duplicación de base path**: `api/select-items` (75) + `api/operation/recruitment/select-items` (75) — hub espejo de catálogos; verificar que no haya handlers duplicados fuera de los hubs oficiales (regla CRÍTICA de select-items).

8. **Interfaces huérfanas/híbridas**: ejemplo `ICobranzaOnline*AppService` — las clases `CobranzaOnline*AppService` aparecen sin interfaz en el extractor (8 clases `CobranzaOnline*` sin `I*` gemela) mientras existen pares huérfanos `IJobService`/`IUpdateDataBaseService` cuyas clases no se ubicaron bajo el mismo nombre.

---

## 3. Propuesta de Estándar de Nomenclatura

### Convenciones de métodos (servicios de aplicación)

| Categoría | Patrón canónico | Ejemplos |
|---|---|---|
| GET_SINGLE | `Get{Entity}ByIdAsync(Guid id)` / `Get{Entity}By{Campo}Async` | `GetCandidateByIdAsync`, `GetOrdenCompraByFolioAsync` |
| GET_LIST | `GetAll{Entity}sAsync(filtro)`, `Get{Entity}sBy{Criterio}Async`, `Search{Entity}sAsync` | `GetAllCandidatesAsync`, `GetPaymentsByCustomerAsync` |
| CREATE | `Create{Entity}Async(dto)` | `CreatePurchaseRequestAsync` |
| UPDATE | `Update{Entity}Async(id, dto)` | `UpdateEmployeeAsync` |
| DELETE | `Delete{Entity}Async(id)` / `Delete{Entity}ByIdAsync` | `DeleteIncidenceAsync` |
| SPECIAL | `{VerboDeNegocio}{Entity}Async(id)` — verbo en inglés | `ApproveOrderAsync`, `RejectCandidateAsync`, `SendInvoiceAsync`, `LiquidatePeriodAsync` |
| Batch/query | `POST /recurso/batch` o `/search` (ruta) con método `Execute{Operación}Async` | `ExecuteDynamicReportAsync` |

**Reglas duras propuestas:**
1. Un solo idioma en nombres de métodos y rutas: **inglés para métodos; kebab-case en rutas** (el inglés ya domina ~90%).
2. Prohibido `GET` con side effects — toda acción de negocio = `POST {id}/{action}`.
3. `Get` siempre calificado: `GetById` | `GetAll` | `GetBy{Criterio}` | `Get{Plural}s`. Prohibido `GetXxx()` bare donde no se distinga single vs list sin leer el tipo de retorno.
4. Eliminar `Save*` ambiguo: dividir en `Create`' | `Update` o renombrar a `Upsert{Entity}Async` (10 ya usan `Upsert`).
5. No exponer helpers de EF/LINQ (`FirstOrDefaultAsync`, `ToListAsync`) en la superficie pública de servicios de aplicación — mover a privados o extensiones.

### Convenciones de endpoints (ruta → categoría)

| Categoría | Plantilla de ruta | Ejemplo |
|---|---|---|
| GET_SINGLE | `GET api/{recurso}/{id:guid}` | `api/candidates/{id:guid}` |
| GET_LIST | `GET api/{recurso}` o `api/{recurso}/search` | `api/candidates?estado=activo` |
| CREATE | `POST api/{recurso}` | `POST api/purchase-requests` |
| UPDATE | `PUT api/{recurso}/{id:guid}` | `PUT api/employees/{id:guid}` |
| UPDATE (batch) | `PUT api/{recurso}/batch` | `PUT api/tasks/batch` |
| DELETE | `DELETE api/{recurso}/{id:guid}` | `DELETE api/machines/{id:guid}` |
| SPECIAL | `POST api/{recurso}/{id:guid}/{accion-kebab}` | `POST api/orders/{id}/approve` |

### Ejemplos de refactorización

| Nombre actual | Propuesto | Justificación |
|---|---|---|
| `GetDataGraficoMensualAsync` | `GetMonthlyChartAsync` | Inglés + criterio explícito |
| `ListAsync` (14 duplicados en distintos servicios) | `GetAll{Entity}sAsync` | Desambiguar por entidad |
| `AutorizarAsync` / `AprobarAsync` | `ApproveAsync` | Homologar con el estándar existente (10 moduleos usan `Approve`) |
| `SubirDocumentoAsync` | `UploadDocumentAsync` | Inglés consistente |
| `GuardarHojaIncidenciasAsync` | `UpsertIncidentSheetAsync` | Semántica upsert explícita |
| `OnGenerateFolioTicketMessage` (+7 hermanos) | `Generate{Concepto}FolioAsync` | Sin prefijo `On` (no es evento), inglés |
| `SincronizarPermisosAsync` | `SyncPermissionsAsync` | SPECIAL con verbo estándar |
| `SaveSignedActAsync` | `SaveSignedActAsync` → `UpsertSignedActAsync` | Eliminar Save ambiguo |
| `GET api/orden-compra-auth/autorizar/...` | `POST api/orden-compra-auth/{id}/approve` | REST + inglés + POST |
| `CanManageStructuralHr` (×3) | `HasStructuralHrPermissionAsync` | Predicado con `Has`/`Can` + sufijo claro |

---

## 4. Recomendaciones prioritarias

1. **Congelar estándar bilingüe → inglés único.** 698 métodos OTHER + rutas mixtas. Prioridad en RecursosHumanosLuxuryApp (85) y ContabilidadLuxuryApp (71).
2. **Corregir los `GET` con side-effect** (`orden-compra-auth/autorizar|desautorizar`) — riesgo de prefetch/browser retry modificando estado.
3. **Formalizar `POST /search` para queries complejos** (dynamic-reports, financial-report) y documentarlo como excepción aprobada.
4. **Decidir hub único de select-items**: resolver `api/operation/recruitment/select-items` vs `api/select-items` (regla crítica de centralización).
5. **Eliminar métodos-auxiliar EF de superficie pública** (`FirstOrDefaultAsync`, `ToListAsync`, `Parse`) → private/internal.
6. **Normalizar familias `OnGenerate*`** (Contabilidad) y naming de nómina (`Guardar*`, `Sincronizar*`) como segunda ola.
7. **Auditar granularidad `GET_SINGLE` (695 endpoints)**: revisar cuántos son variantes ByFolio/ByCustomer repetibles y si conviene consolidar con query-params.
8. **Validar 176 endpoints sin handler detectado** (podrían ser delegaciones a helpers internos o providers — verificar que no haya lógica de negocio inline en `EndPoints.cs`).
9. **Aprobación Tech Lead** para fijar el estándar en `conventions/catalogs/naming-conventions.md` antes de aplicar refactors (CONVENTIONS.md §3.6/§3.7 — cambios importantes requieren flujo formal y plan).

---

## 5. Inventario detallado por módulo

_Leyenda de Observaciones: ✓ conforme | ⚠ naming no CRUD estándar | ⚠ Get sin criterio explícito._
_(EndPoints sin handler = delegación no resuelta por el extractor o lógica inline — punto 8 de Recomendaciones.)_
## Modulo: AdminLuxuryApp

Metodos: 95 | Endpoints HTTP: 80

### Servicios e interfaces

| Servicio/Interfaz | Metodos | Ubicacion |
|---|---|---|
| `CustomerAppService` | 1 | `AdminLuxuryApp/Customers/Customers/Services/CustomerAppService.cs` |
| `IApplicationRoleAppService` | 6 | `AdminLuxuryApp/SeguridadPermisos/Access/ApplicationRole/Interfaces/IApplicationRoleAppService.cs` |
| `IApprovalRulesAdminService` | 2 | `AdminLuxuryApp/SeguridadPermisos/Access/ApprovalRules/Interfaces/IApprovalRulesAdminService.cs` |
| `IAsambleaChecklistTemplateAppService` | 5 | `AdminLuxuryApp/ConfiguracionSistema/AsambleaChecklistTemplates/Interfaces/IAsambleaChecklistTemplateAppService.cs` |
| `ICustomerAddressAppService` | 2 | `AdminLuxuryApp/Customers/CustomerAddress/Interfaces/ICustomerAddressAppService.cs` |
| `ICustomerAppService` | 6 | `AdminLuxuryApp/Customers/Customers/Interfaces/ICustomerAppService.cs` |
| `ICustomerDataCompanyAppService` | 5 | `AdminLuxuryApp/Customers/CustomerDataCompany/Interfaces/ICustomerDataCompanyAppService.cs` |
| `ICustomerImageAppService` | 4 | `AdminLuxuryApp/Customers/CustomerImage/Interfaces/ICustomerImageAppService.cs` |
| `ICustomerLocationAppService` | 5 | `AdminLuxuryApp/Customers/CustomerLocations/Interfaces/ICustomerLocationAppService.cs` |
| `ICustomerModulAppService` | 5 | `AdminLuxuryApp/Customers/CustomerModul/Interfaces/ICustomerModulAppService.cs` |
| `IDataCustomerAppService` | 2 | `AdminLuxuryApp/Customers/Customers/Interfaces/IDataCustomerAppService.cs` |
| `IEmployeeDataValidationService` | 1 | `AdminLuxuryApp/Infraestructura/AppImplementationTracking/EmployeeDataValidation/Interfaces/IEmployeeDataValidationService.cs` |
| `IJobService` | 1 | `AdminLuxuryApp/Infraestructura/Jobs/Interfaces/IJobService.cs` |
| `IMenuItemsAppService` | 1 | `AdminLuxuryApp/Infraestructura/AppImplementationTracking/MenuItems/Interfaces/IMenuItemsAppService.cs` |
| `IModuleAppAppService` | 5 | `AdminLuxuryApp/Customers/ModuleApps/Interfaces/IModuleAppAppService.cs` |
| `IModuleAppRolAppService` | 4 | `AdminLuxuryApp/SeguridadPermisos/Access/ModuleAppRol/Interfaces/IModuleAppRolAppService.cs` |
| `IOrgStructureValidationService` | 1 | `AdminLuxuryApp/Infraestructura/AppImplementationTracking/OrgStructureValidation/Interfaces/IOrgStructureValidationService.cs` |
| `IUpdateDataBaseService` | 11 | `AdminLuxuryApp/Infraestructura/UpdateDataBase/Interfaces/IUpdateDataBaseService.cs` |
| `IUserAccountAppService` | 12 | `AdminLuxuryApp/SeguridadPermisos/Access/UserAccounts/Interfaces/IUserAccountAppService.cs` |
| `IUserRoleService` | 1 | `AdminLuxuryApp/SeguridadPermisos/Access/Authorization/Services/UserRoleService.cs` |
| `RoleAssignmentMatrixService` | 2 | `AdminLuxuryApp/SeguridadPermisos/Access/RoleAssignment/Services/RoleAssignmentMatrixService.cs` |
| `UpdateDataBaseAppService` | 11 | `AdminLuxuryApp/Infraestructura/UpdateDataBase/Services/UpdateDataBaseService.cs` |
| `UserAccountAppService` | 2 | `AdminLuxuryApp/SeguridadPermisos/Access/UserAccounts/Services/UserAccountAppService.cs` |

### Metodos por categoria

| Servicio | Metodo | Categoria | Retorno | Observaciones |
|---|---|---|---|---|
| CustomerAppService | `IncrementCount` | OTHER | `void` | ⚠ naming no CRUD estandar |
| IApplicationRoleAppService | `CreateRole` | CREATE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IApplicationRoleAppService | `CreateRoles` | CREATE | `Task` | ✓ |
| IApplicationRoleAppService | `DeleteRole` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IApplicationRoleAppService | `GetRole` | GET_SINGLE | `Task<ApiResponseDTO<ApplicationRoleDTO>>` | ⚠ Get sin ByXxx/All |
| IApplicationRoleAppService | `GetRoles` | GET_LIST | `Task<ApiResponseDTO<List<ApplicationRolesDTO>>>` | ⚠ Get sin ByXxx/All |
| IApplicationRoleAppService | `UpdateRole` | UPDATE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IApprovalRulesAdminService | `GetMatrixAsync` | GET_SINGLE | `Task<ApiResponseDTO<ApprovalMatrixDTO>>` | ⚠ Get sin ByXxx/All |
| IApprovalRulesAdminService | `UpdateMatrixAsync` | UPDATE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IAsambleaChecklistTemplateAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<AsambleaChecklistTemplateDTO>>` | ✓ |
| IAsambleaChecklistTemplateAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IAsambleaChecklistTemplateAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<List<AsambleaChecklistTemplateDTO>>>` | ✓ |
| IAsambleaChecklistTemplateAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<AsambleaChecklistTemplateAddOrEditDTO>>` | ✓ |
| IAsambleaChecklistTemplateAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<AsambleaChecklistTemplateDTO>>` | ✓ |
| ICustomerAddressAppService | `GetByCustomerIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<CustomerAddressAddOrEditDTO>>` | ✓ |
| ICustomerAddressAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<CustomerAddressAddOrEditDTO>>` | ✓ |
| ICustomerAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<CustomerDTO>>` | ✓ |
| ICustomerAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ICustomerAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<CustomerDTO[]>>` | ✓ |
| ICustomerAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<CustomerDTO>>` | ✓ |
| ICustomerAppService | `GetPointMapsAsync` | GET_LIST | `Task<ApiResponseDTO<List<object>>>` | ⚠ Get sin ByXxx/All |
| ICustomerAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<CustomerDTO>>` | ✓ |
| ICustomerDataCompanyAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<CustomerDataCompanyDTO>>` | ✓ |
| ICustomerDataCompanyAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ICustomerDataCompanyAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<List<CustomerDataCompanyDTO>>>` | ✓ |
| ICustomerDataCompanyAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<CustomerDataCompanyAddOrEditDTO>>` | ✓ |
| ICustomerDataCompanyAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<CustomerDataCompanyDTO>>` | ✓ |
| ICustomerImageAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<CustomerImageDTO>>` | ✓ |
| ICustomerImageAppService | `AddBulkAsync` | CREATE | `Task<ApiResponseDTO<CustomerImageDTO[]>>` | ✓ |
| ICustomerImageAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ICustomerImageAppService | `GetByCustomerIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<CustomerImageDTO[]>>` | ✓ |
| ICustomerLocationAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<CustomerLocationDTO>>` | ✓ |
| ICustomerLocationAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ICustomerLocationAppService | `GetByCustomerIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<CustomerLocationDTO[]>>` | ✓ |
| ICustomerLocationAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<CustomerLocationDTO>>` | ✓ |
| ICustomerLocationAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<CustomerLocationDTO>>` | ✓ |
| ICustomerModulAppService | `GetActiveModulesForCustomerAsync` | GET_LIST | `Task<ApiResponseDTO<List<ActiveModulesForCustomerDTO>>>` | ⚠ Get sin ByXxx/All |
| ICustomerModulAppService | `GetCustomerModulAsync` | GET_LIST | `Task<ApiResponseDTO<List<CustomerModulListDTO>>>` | ⚠ Get sin ByXxx/All |
| ICustomerModulAppService | `GetCustomerModulesAsync` | GET_LIST | `Task<ApiResponseDTO<List<ModuleGroupDTO>>>` | ⚠ Get sin ByXxx/All |
| ICustomerModulAppService | `ListAsync` | OTHER | `Task<ApiResponseDTO<List<ModulePermissionDTO>>>` | ⚠ naming no CRUD estandar |
| ICustomerModulAppService | `UpdateModuleStatusAsync` | UPDATE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IDataCustomerAppService | `GetDataEmailComite` | GET_LIST | `Task<List<string>>` | ⚠ Get sin ByXxx/All |
| IDataCustomerAppService | `GetDataEmailCondominos` | GET_LIST | `Task<List<string>>` | ⚠ Get sin ByXxx/All |
| IEmployeeDataValidationService | `GetMissingDataReportAsync` | GET_LIST | `Task<ApiResponseDTO<List<EmployeeMissingDataDTO>>>` | ⚠ Get sin ByXxx/All |
| IJobService | `ExecuteAsync` | SPECIAL | `Task` | ✓ |
| IMenuItemsAppService | `GetModuleCustomAsync` | GET_LIST | `Task<ApiResponseDTO<List<MenuItemDTO>>>` | ⚠ Get sin ByXxx/All |
| IModuleAppAppService | `CreateAsync` | CREATE | `Task<ApiResponseDTO<ModuleAppDTO>>` | ✓ |
| IModuleAppAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IModuleAppAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<List<ModuleAppDTO>>>` | ✓ |
| IModuleAppAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<ModuleAppGetDTO>>` | ✓ |
| IModuleAppAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<ModuleAppDTO>>` | ✓ |
| IModuleAppRolAppService | `AssignmentsAsync` | SPECIAL | `Task<ApiResponseDTO<List<ModuleGroupRolDTO>>>` | ✓ |
| IModuleAppRolAppService | `ListModuleAsync` | OTHER | `Task<ApiResponseDTO<List<ModuleAppDTO>>>` | ⚠ naming no CRUD estandar |
| IModuleAppRolAppService | `ListRoleAsync` | OTHER | `Task<ApiResponseDTO<List<ModuleAppRolDTO>>>` | ⚠ naming no CRUD estandar |
| IModuleAppRolAppService | `UpdateModuleAppRolAssignedAsync` | UPDATE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IOrgStructureValidationService | `GetMissingOrgStructureReportAsync` | GET_LIST | `Task<ApiResponseDTO<List<WorkPositionMissingDataDTO>>>` | ⚠ Get sin ByXxx/All |
| IUpdateDataBaseService | `BackfillAgendaEventsFromMeetingsAsync` | OTHER | `Task<ApiResponseDTO<object>>` | ⚠ naming no CRUD estandar |
| IUpdateDataBaseService | `BackfillHistoricalMeetingTimesAsync` | OTHER | `Task<ApiResponseDTO<object>>` | ⚠ naming no CRUD estandar |
| IUpdateDataBaseService | `CapitalizeUserNamesAsync` | OTHER | `Task<ApiResponseDTO<object>>` | ⚠ naming no CRUD estandar |
| IUpdateDataBaseService | `ImportAsambleaChecklistCatalogAsync` | SPECIAL | `Task<ApiResponseDTO<object>>` | ✓ |
| IUpdateDataBaseService | `RecalculateWorkPositionFoliosAsync` | SPECIAL | `Task<ApiResponseDTO<object>>` | ✓ |
| IUpdateDataBaseService | `ReseedNativeChargeTypeCatalogsAsync` | OTHER | `Task<ApiResponseDTO<object>>` | ⚠ naming no CRUD estandar |
| IUpdateDataBaseService | `ResyncGoogleCalendarEventTimesAsync` | OTHER | `Task<ApiResponseDTO<object>>` | ⚠ naming no CRUD estandar |
| IUpdateDataBaseService | `RetroactiveAssignEmployeeRolesAsync` | OTHER | `Task<ApiResponseDTO<object>>` | ⚠ naming no CRUD estandar |
| IUpdateDataBaseService | `SeedDocumentCatalogsAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| IUpdateDataBaseService | `SeedNativeCollectionTestDataAsync` | SPECIAL | `Task<ApiResponseDTO<object>>` | ✓ |
| IUpdateDataBaseService | `SeedRecruitmentSourcesAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| IUserAccountAppService | `AddRoleToUser` | CREATE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IUserAccountAppService | `CreateAccountAsync` | CREATE | `Task<ApiResponseDTO<ApplicationUserDTO>>` | ✓ |
| IUserAccountAppService | `DeleteAccountAndRelationsAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IUserAccountAppService | `ExistsApplicationUserUserNameAsync` | GET_SINGLE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IUserAccountAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<List<ApplicationUserDTO>>>` | ✓ |
| IUserAccountAppService | `GetAllRoleAccount` | GET_LIST | `Task<ApiResponseDTO<List<AddApplicationRoleToUserDTO>>>` | ✓ |
| IUserAccountAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<ApplicationUserCreateDTO>>` | ✓ |
| IUserAccountAppService | `SearchExistingPersonAsync` | OTHER | `Task<ApiResponseDTO<List<string>>>` | ⚠ naming no CRUD estandar |
| IUserAccountAppService | `SearchExistingPhoneAsync` | OTHER | `Task<ApiResponseDTO<List<string>>>` | ⚠ naming no CRUD estandar |
| IUserAccountAppService | `ToBlockAccountAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| IUserAccountAppService | `ToUnlockAccountAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| IUserAccountAppService | `UpdateAccountAsync` | UPDATE | `Task<ApiResponseDTO<ApplicationUserDTO>>` | ✓ |
| IUserRoleService | `GetUsersInRoleAsync` | GET_LIST | `Task<List<ApplicationUser>>` | ⚠ Get sin ByXxx/All |
| RoleAssignmentMatrixService | `CanAssignRole` | OTHER | `bool` | ⚠ naming no CRUD estandar |
| RoleAssignmentMatrixService | `GetAllowedRoles` | GET_LIST | `RoleAssignmentMatrixResult` | ✓ |
| UpdateDataBaseAppService | `BackfillAgendaEventsFromMeetingsAsync` | OTHER | `Task<ApiResponseDTO<object>>` | ⚠ naming no CRUD estandar |
| UpdateDataBaseAppService | `BackfillHistoricalMeetingTimesAsync` | OTHER | `Task<ApiResponseDTO<object>>` | ⚠ naming no CRUD estandar |
| UpdateDataBaseAppService | `CapitalizeUserNamesAsync` | OTHER | `Task<ApiResponseDTO<object>>` | ⚠ naming no CRUD estandar |
| UpdateDataBaseAppService | `ImportAsambleaChecklistCatalogAsync` | SPECIAL | `Task<ApiResponseDTO<object>>` | ✓ |
| UpdateDataBaseAppService | `RecalculateWorkPositionFoliosAsync` | SPECIAL | `Task<ApiResponseDTO<object>>` | ✓ |
| UpdateDataBaseAppService | `ReseedNativeChargeTypeCatalogsAsync` | OTHER | `Task<ApiResponseDTO<object>>` | ⚠ naming no CRUD estandar |
| UpdateDataBaseAppService | `ResyncGoogleCalendarEventTimesAsync` | OTHER | `Task<ApiResponseDTO<object>>` | ⚠ naming no CRUD estandar |
| UpdateDataBaseAppService | `RetroactiveAssignEmployeeRolesAsync` | OTHER | `Task<ApiResponseDTO<object>>` | ⚠ naming no CRUD estandar |
| UpdateDataBaseAppService | `SeedDocumentCatalogsAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| UpdateDataBaseAppService | `SeedNativeCollectionTestDataAsync` | SPECIAL | `Task<ApiResponseDTO<object>>` | ✓ |
| UpdateDataBaseAppService | `SeedRecruitmentSourcesAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| UserAccountAppService | `GetUserById` | GET_SINGLE | `Task<ApplicationUser>` | ✓ |
| UserAccountAppService | `UpdateUserRolesDirectly` | UPDATE | `Task<bool>` | ✓ |

### Endpoints

| Verbo | Ruta | Handler | Categoria |
|---|---|---|---|
| POST | `api/admin/realtime-diagnostics/broadcast` | (inline) | CREATE |
| POST | `api/admin/realtime-diagnostics/sendannouncement` | (inline) | SPECIAL |
| POST | `api/admin/realtime-diagnostics/sendmessage` | (inline) | SPECIAL |
| POST | `api/admin/realtime-diagnostics/sendmessagetouser` | (inline) | SPECIAL |
| POST | `api/admin/realtime-diagnostics/sendtestmessage` | `CreateNotificationAsync` | SPECIAL |
| POST | `api/admin/realtime-diagnostics/send-to-group/{groupName}` | (inline) | SPECIAL |
| GET | `api/admin/realtime-diagnostics/test-connection` | `CreateNotificationAsync` | GET_LIST |
| POST | `api/admin/system-maintenance/backfill-agenda-events-from-meetings` | `BackfillAgendaEventsFromMeetingsAsync` | CREATE |
| POST | `api/admin/system-maintenance/backfill-historical-meeting-times` | `BackfillHistoricalMeetingTimesAsync` | CREATE |
| POST | `api/admin/system-maintenance/capitalize-user-names` | `CapitalizeUserNamesAsync` | CREATE |
| POST | `api/admin/system-maintenance/import-asamblea-checklist-catalog` | `ImportAsambleaChecklistCatalogAsync` | SPECIAL |
| POST | `api/admin/system-maintenance/recalculate-work-position-folios` | `RecalculateWorkPositionFoliosAsync` | CREATE |
| POST | `api/admin/system-maintenance/reseed-native-charge-type-catalogs` | `ReseedNativeChargeTypeCatalogsAsync` | CREATE |
| POST | `api/admin/system-maintenance/resync-google-calendar-event-times` | `ResyncGoogleCalendarEventTimesAsync` | CREATE |
| POST | `api/admin/system-maintenance/retroactive-assign-employee-roles` | `RetroactiveAssignEmployeeRolesAsync` | CREATE |
| POST | `api/admin/system-maintenance/seed-documents` | `SeedDocumentCatalogsAsync` | CREATE |
| POST | `api/admin/system-maintenance/seed-native-collection-test-data` | `SeedNativeCollectionTestDataAsync` | CREATE |
| POST | `api/admin/system-maintenance/seed-recruitment-sources` | `SeedRecruitmentSourcesAsync` | CREATE |
| GET | `api/admin/user-accounts/{applicationUserId}` | `GetByIdAsync` | GET_SINGLE |
| POST | `api/admin/user-accounts/add-role-to-user/{applicationUserId}` | `AddRoleToUser` | CREATE |
| POST | `api/admin/user-accounts/create-account` | `CreateAccountAsync` | CREATE |
| DELETE | `api/admin/user-accounts/delete/{applicationUserId}` | `DeleteAccountAndRelationsAsync` | DELETE |
| GET | `api/admin/user-accounts/get-role/{applicationUserId}/{roleType?}` | `GetAllRoleAccount` | GET_SINGLE |
| GET | `api/admin/user-accounts/list/{customerId:guid}/{state:bool}/{typePerson?}` | `GetAllAsync` | GET_SINGLE |
| GET | `api/admin/user-accounts/list/{state:bool}/{typePerson?}` | `GetAllAsync` | GET_LIST |
| GET | `api/admin/user-accounts/to-block-account/{id}` | `ToBlockAccountAsync` | GET_SINGLE |
| GET | `api/admin/user-accounts/to-unlock-account/{id}` | `ToUnlockAccountAsync` | GET_SINGLE |
| PUT | `api/admin/user-accounts/update-account/{applicationUserId}` | `UpdateAccountAsync` | UPDATE |
| POST | `api/app-implementation-tracking/trigger-employee-validation` | (inline) | CREATE |
| POST | `api/application-roles` | `CreateRole` | CREATE |
| GET | `api/application-roles` | `GetRoles` | GET_LIST |
| DELETE | `api/application-roles/{id}` | `DeleteRole` | DELETE |
| PUT | `api/application-roles/{id}` | `UpdateRole` | UPDATE |
| GET | `api/application-roles/{roleId}` | `GetRole` | GET_SINGLE |
| PUT | `api/approval-rules/matrix` | `UpdateMatrixAsync` | UPDATE |
| GET | `api/approval-rules/matrix` | `GetMatrixAsync` | GET_LIST |
| GET | `api/asamblea-checklist-template` | `GetAllAsync` | GET_LIST |
| POST | `api/asamblea-checklist-template` | `AddAsync` | CREATE |
| PUT | `api/asamblea-checklist-template/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/asamblea-checklist-template/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| DELETE | `api/asamblea-checklist-template/{id:guid}` | `DeleteByIdAsync` | DELETE |
| PUT | `api/customer-addresses` | `UpdateAsync` | UPDATE |
| GET | `api/customer-addresses/{customerId:guid}` | `GetByCustomerIdAsync` | GET_SINGLE |
| POST | `api/customer-data-company` | `AddAsync` | CREATE |
| GET | `api/customer-data-company` | `GetAllAsync` | GET_LIST |
| DELETE | `api/customer-data-company/{id:guid}` | `DeleteAsync` | DELETE |
| PUT | `api/customer-data-company/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/customer-data-company/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| POST | `api/customer-images` | `AddAsync` | CREATE |
| GET | `api/customer-images/{customerId:guid}` | `GetByCustomerIdAsync` | GET_SINGLE |
| DELETE | `api/customer-images/{id:guid}` | `DeleteAsync` | DELETE |
| POST | `api/customer-images/bulk` | `AddBulkAsync` | CREATE |
| POST | `api/customer-locations` | `AddAsync` | CREATE |
| PUT | `api/customer-locations/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/customer-locations/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| DELETE | `api/customer-locations/{id:guid}` | `DeleteAsync` | DELETE |
| GET | `api/customer-locations/customer/{customerId:guid}` | `GetByCustomerIdAsync` | GET_SINGLE |
| POST | `api/customers` | `AddAsync` | CREATE |
| DELETE | `api/customers/{id:guid}` | `DeleteAsync` | DELETE |
| PUT | `api/customers/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/customers/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| GET | `api/customers/list/{stateId:bool}` | `GetAllAsync` | GET_SINGLE |
| GET | `api/customers/point-maps` | `GetPointMapsAsync` | GET_LIST |
| GET | `api/menu-items/{customerId:guid}` | `GetModuleCustomAsync` | GET_SINGLE |
| GET | `api/module-app-customers/{customerId:guid}/permissions` | `ListAsync` | GET_SINGLE |
| GET | `api/module-app-customers/customer/{customerId:guid}` | `GetCustomerModulesAsync` | GET_SINGLE |
| GET | `api/module-app-customers/customer/{customerId:guid}/active-modules` | `GetActiveModulesForCustomerAsync` | GET_SINGLE |
| GET | `api/module-app-customers/customers/{state:bool}` | `GetCustomerModulAsync` | GET_LIST |
| POST | `api/module-app-customers/update-module-status` | `UpdateModuleStatusAsync` | CREATE |
| GET | `api/module-app-roles/assignments/{roleId}` | `AssignmentsAsync` | GET_SINGLE |
| GET | `api/module-app-roles/list-module` | `ListModuleAsync` | GET_LIST |
| GET | `api/module-app-roles/list-role` | `ListRoleAsync` | GET_LIST |
| POST | `api/module-app-roles/update-module-app-rol-assigned` | `UpdateModuleAppRolAssignedAsync` | CREATE |
| POST | `api/module-apps` | `CreateAsync` | CREATE |
| GET | `api/module-apps` | `GetAllAsync` | GET_LIST |
| GET | `api/module-apps/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| DELETE | `api/module-apps/{id:guid}` | `DeleteAsync` | DELETE |
| PUT | `api/module-apps/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/user-validation/search-existing-person/{namePerson}` | `SearchExistingPersonAsync` | GET_LIST |
| GET | `api/user-validation/search-existing-phone/{phoneNumber}` | `SearchExistingPhoneAsync` | GET_LIST |

## Modulo: AuthLuxuryApp

Metodos: 24 | Endpoints HTTP: 19

### Servicios e interfaces

| Servicio/Interfaz | Metodos | Ubicacion |
|---|---|---|
| `IAccesoCustomersAppService` | 2 | `AuthLuxuryApp/Auth/AccesoCustomers/Interfaces/IAccesoCustomersAppService.cs` |
| `IAuthAppService` | 5 | `AuthLuxuryApp/Auth/Interfaces/IAuthAppService.cs` |
| `ICredentialNotificationService` | 1 | `AuthLuxuryApp/AccountRecovery/Interfaces/ICredentialNotificationService.cs` |
| `IPasswordAppService` | 5 | `AuthLuxuryApp/PasswordManager/Interfaces/IPasswordAppService.cs` |
| `IPersonDataAppService` | 2 | `AuthLuxuryApp/Auth/Interfaces/IPersonDataAppService.cs` |
| `IRecoveryAccountUserAppService` | 5 | `AuthLuxuryApp/AccountRecovery/Interfaces/IRecoveryAccountUserAppService.cs` |
| `IUserConnectionStatusService` | 1 | `AuthLuxuryApp/Auth/Interfaces/IUserConnectionStatusService.cs` |
| `IUserProfileAppService` | 2 | `AuthLuxuryApp/ProfileUsers/Interfaces/IUserProfileAppService.cs` |
| `JwtService` | 1 | `AuthLuxuryApp/Auth/Services/JwtService.cs` |

### Metodos por categoria

| Servicio | Metodo | Categoria | Retorno | Observaciones |
|---|---|---|---|---|
| IAccesoCustomersAppService | `AddCustomerToUserAccount` | CREATE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IAccesoCustomersAppService | `GetCustomersWithAccessStatus` | GET_LIST | `Task<ApiResponseDTO<List<AccesoCustomerDTO>>>` | ⚠ Get sin ByXxx/All |
| IAuthAppService | `ConfirmRecoverPasswordAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| IAuthAppService | `LoginAsync` | OTHER | `Task<ApiResponseDTO<UserTokenDTO>>` | ⚠ naming no CRUD estandar |
| IAuthAppService | `LogoutAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| IAuthAppService | `RecoverPasswordAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| IAuthAppService | `SetRefreshTokenCookie` | UPDATE | `void` | ✓ |
| ICredentialNotificationService | `SendInitialCredentialsAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| IPasswordAppService | `AddCredentialAsync` | CREATE | `Task<ApiResponseDTO<CredentialDetailDTO>>` | ✓ |
| IPasswordAppService | `DeleteCredentialAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IPasswordAppService | `GetCredentialByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<CredentialDetailDTO>>` | ✓ |
| IPasswordAppService | `GetCredentialsPagedAsync` | GET_LIST | `Task<ApiResponseDTO<PagedResultDTO<CredentialDetailDTO>>>` | ✓ |
| IPasswordAppService | `UpdateCredentialAsync` | UPDATE | `Task<ApiResponseDTO<CredentialDetailDTO>>` | ✓ |
| IPersonDataAppService | `EmployeeBirthdayAsync` | OTHER | `Task<ApiResponseDTO<List<EmployeeBirthdayDTO>>>` | ⚠ naming no CRUD estandar |
| IPersonDataAppService | `UpsertAsync` | UPDATE | `Task<ApiResponseDTO<PersonData>>` | ✓ |
| IRecoveryAccountUserAppService | `InitiateRecoveryByCodeAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| IRecoveryAccountUserAppService | `SendMailRecoverPasswordAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| IRecoveryAccountUserAppService | `SendNewPasswordForEmailAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| IRecoveryAccountUserAppService | `SendNewUserNameForEmailAsync` | SPECIAL | `Task<ApiResponseDTO<UserNameDTO>>` | ✓ |
| IRecoveryAccountUserAppService | `ValidateRecoveryCodeAsync` | SPECIAL | `Task<ApiResponseDTO<ValidateRecoveryCodeResultDTO>>` | ✓ |
| IUserConnectionStatusService | `UpdateStateUser` | UPDATE | `Task` | ✓ |
| IUserProfileAppService | `ChangePasswordAsync` | UPDATE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IUserProfileAppService | `UpdateImageAsync` | UPDATE | `Task<ApiResponseDTO<ImgPathFileCommonDTO>>` | ✓ |
| JwtService | `BuildAndPersistClientTokensAsync` | OTHER | `Task<UserTokenDTO>` | ⚠ naming no CRUD estandar |

### Endpoints

| Verbo | Ruta | Handler | Categoria |
|---|---|---|---|
| POST | `api/auth/acceso-customers/add-customer-acceso-to-user/{id}` | `AddCustomerToUserAccount` | CREATE |
| GET | `api/auth/acceso-customers/get-customers/{id}` | `GetCustomersWithAccessStatus` | GET_SINGLE |
| POST | `api/auth/account-recovery/initiate-by-code` | `InitiateRecoveryByCodeAsync` | CREATE |
| POST | `api/auth/account-recovery/send-mail-recover-password` | `FindByEmailAsync` | SPECIAL |
| GET | `api/auth/account-recovery/send-new-password-for-email/{applicationUserId}` | `SendNewPasswordForEmailAsync` | GET_SINGLE |
| GET | `api/auth/account-recovery/send-new-user-name-for-email/{applicationUserId}` | `SendNewUserNameForEmailAsync` | GET_SINGLE |
| POST | `api/auth/account-recovery/validate-code` | `ValidateRecoveryCodeAsync` | SPECIAL |
| POST | `api/auth/confirm-recover-password` | `ConfirmRecoverPasswordAsync` | CREATE |
| POST | `api/auth/login` | `LoginAsync` | CREATE |
| POST | `api/auth/logout` | `LogoutAsync` | CREATE |
| POST | `api/auth/recover-password` | `RecoverPasswordAsync` | CREATE |
| POST | `api/auth/refresh` | `RefreshTokenAsync` | CREATE |
| POST | `api/password-manager/credentials` | `AddCredentialAsync` | CREATE |
| PUT | `api/password-manager/credentials/{id:guid}` | `UpdateCredentialAsync` | UPDATE |
| DELETE | `api/password-manager/credentials/{id:guid}` | `DeleteCredentialAsync` | DELETE |
| GET | `api/password-manager/credentials/{id:guid}` | `GetCredentialByIdAsync` | GET_SINGLE |
| GET | `api/password-manager/credentials/filter` | `GetCredentialsPagedAsync` | GET_LIST |
| PUT | `api/users/change-password/{applicationUserId}` | `ChangePasswordAsync` | UPDATE |
| PUT | `api/users/update-image/{applicationUserId}` | `UpdateImageAsync` | UPDATE |

## Modulo: CobranzaLuxuryApp

Metodos: 145 | Endpoints HTTP: 135

### Servicios e interfaces

| Servicio/Interfaz | Metodos | Ubicacion |
|---|---|---|
| `AspelCobranzaHausDetalleAppService` | 4 | `CobranzaLuxuryApp/AspelCobranzaHausLive/Services/AspelCobranzaHausDetalleAppService.cs` |
| `CobranzaOnlineAccountAppService` | 1 | `CobranzaLuxuryApp/CobranzaOnline/Services/CobranzaOnlineAccountAppService.cs` |
| `CobranzaOnlineBalanceAppService` | 1 | `CobranzaLuxuryApp/CobranzaOnline/Services/CobranzaOnlineBalanceAppService.cs` |
| `CobranzaOnlineDashboardAppService` | 8 | `CobranzaLuxuryApp/CobranzaOnline/Services/CobranzaOnlineDashboardAppService.cs` |
| `CobranzaOnlineMovementAppService` | 1 | `CobranzaLuxuryApp/CobranzaOnline/Services/CobranzaOnlineMovementAppService.cs` |
| `CobranzaOnlinePolicyAppService` | 1 | `CobranzaLuxuryApp/CobranzaOnline/Services/CobranzaOnlinePolicyAppService.cs` |
| `CobranzaOnlinePortfolioAppService` | 1 | `CobranzaLuxuryApp/CobranzaOnline/Services/CobranzaOnlinePortfolioAppService.cs` |
| `CobranzaOnlineReporteFinancieroAppService` | 1 | `CobranzaLuxuryApp/CobranzaOnline/Services/CobranzaOnlineReporteFinancieroAppService.cs` |
| `CobranzaOnlineStatementAppService` | 2 | `CobranzaLuxuryApp/CobranzaOnline/Services/CobranzaOnlineStatementAppService.cs` |
| `IAdjustmentService` | 4 | `CobranzaLuxuryApp/CobranzaNativa/Core/Approvals/Interfaces/IAdjustmentService.cs` |
| `IAspelCobranzaHausAppService` | 4 | `CobranzaLuxuryApp/AspelCobranzaHausLive/Interfaces/IAspelCobranzaHausAppService.cs` |
| `IAspelCobranzaHausDetalleAppService` | 2 | `CobranzaLuxuryApp/AspelCobranzaHausLive/Interfaces/IAspelCobranzaHausDetalleAppService.cs` |
| `IAspelCobranzaHausLocalAppService` | 5 | `CobranzaLuxuryApp/AspelCobranzaHausLocal/Interfaces/IAspelCobranzaHausLocalAppService.cs` |
| `IAspelCobranzaHausLocalDetalleAppService` | 1 | `CobranzaLuxuryApp/AspelCobranzaHausLocal/Interfaces/IAspelCobranzaHausLocalDetalleAppService.cs` |
| `IChargeAppService` | 9 | `CobranzaLuxuryApp/CobranzaNativa/Core/Charges/Interfaces/IChargeAppService.cs` |
| `IChargesGeneratorService` | 2 | `CobranzaLuxuryApp/CobranzaNativa/Core/Charges/Interfaces/IChargesGeneratorService.cs` |
| `IChargeTemplateAppService` | 7 | `CobranzaLuxuryApp/CobranzaNativa/Core/Templates/Interfaces/IChargeTemplateAppService.cs` |
| `IChargeTypeCatalogAppService` | 5 | `CobranzaLuxuryApp/CobranzaNativa/Core/ChargeTypes/Interfaces/IChargeTypeCatalogAppService.cs` |
| `ICobranzaMetricasService` | 1 | `CobranzaLuxuryApp/CobranzaNativa/Core/Metrics/Interfaces/ICobranzaMetricasService.cs` |
| `ICobranzaNativaNotificationService` | 3 | `CobranzaLuxuryApp/CobranzaNativa/Core/Notifications/Interfaces/ICobranzaNativaNotificationService.cs` |
| `ICobranzaPaymentAppService` | 4 | `CobranzaLuxuryApp/CobranzaNativa/Core/Payments/Interfaces/ICobranzaPaymentAppService.cs` |
| `ICollectionCaseAppService` | 4 | `CobranzaLuxuryApp/CobranzaNativa/Core/CollectionCases/Interfaces/ICollectionCaseAppService.cs` |
| `ICollectionManagerService` | 2 | `CobranzaLuxuryApp/CobranzaNativa/Core/CollectionCases/Interfaces/ICollectionManagerService.cs` |
| `IFinancialApprovalService` | 6 | `CobranzaLuxuryApp/CobranzaNativa/Core/Approvals/Interfaces/IFinancialApprovalService.cs` |
| `IFinancialAuditService` | 3 | `CobranzaLuxuryApp/CobranzaNativa/Core/Audit/Interfaces/IFinancialAuditService.cs` |
| `IInvoiceQueryAppService` | 2 | `CobranzaLuxuryApp/CobranzaNativa/Core/Invoices/Interfaces/IInvoiceQueryAppService.cs` |
| `IInvoiceService` | 2 | `CobranzaLuxuryApp/CobranzaNativa/Core/Invoices/Interfaces/IInvoiceService.cs` |
| `ILateFeeCalculatorService` | 1 | `CobranzaLuxuryApp/CobranzaNativa/Core/LateFees/Interfaces/ILateFeeCalculatorService.cs` |
| `ILateFeePolicyAppService` | 5 | `CobranzaLuxuryApp/CobranzaNativa/Core/LateFees/Interfaces/ILateFeePolicyAppService.cs` |
| `ILedgerIntegrityService` | 2 | `CobranzaLuxuryApp/CobranzaNativa/Core/Ledger/Interfaces/ILedgerIntegrityService.cs` |
| `ILedgerService` | 6 | `CobranzaLuxuryApp/CobranzaNativa/Core/Ledger/Interfaces/ILedgerService.cs` |
| `INativeCollectionNotificationSettingsService` | 3 | `CobranzaLuxuryApp/CobranzaNativa/Core/Notifications/Interfaces/INativeCollectionNotificationSettingsService.cs` |
| `INativeCollectionRealTimeService` | 2 | `CobranzaLuxuryApp/CobranzaNativa/Core/Notifications/Interfaces/INativeCollectionRealTimeService.cs` |
| `INativeStatementService` | 1 | `CobranzaLuxuryApp/CobranzaNativa/Core/Statements/Interfaces/INativeStatementService.cs` |
| `INotificationEngineService` | 1 | `CobranzaLuxuryApp/CobranzaNativa/Core/Notifications/Interfaces/INotificationEngineService.cs` |
| `IPaymentAllocationService` | 4 | `CobranzaLuxuryApp/CobranzaNativa/Core/Payments/Interfaces/IPaymentAllocationService.cs` |
| `IPeriodClosureService` | 5 | `CobranzaLuxuryApp/CobranzaNativa/Core/PeriodClosures/Interfaces/IPeriodClosureService.cs` |
| `IPropertyFineAppService` | 9 | `CobranzaLuxuryApp/CobranzaNativa/Core/Fines/Interfaces/IPropertyFineAppService.cs` |
| `IPropertyMemberService` | 11 | `CobranzaLuxuryApp/CobranzaNativa/Core/Members/Interfaces/IPropertyMemberService.cs` |
| `IReconciliationService` | 2 | `CobranzaLuxuryApp/CobranzaNativa/Core/Reconciliation/Interfaces/IReconciliationService.cs` |
| `IRegulationArticleAppService` | 5 | `CobranzaLuxuryApp/CobranzaNativa/Core/Fines/Interfaces/IRegulationArticleAppService.cs` |
| `IWebhookHandlerService` | 1 | `CobranzaLuxuryApp/CobranzaNativa/Core/Payments/Interfaces/IWebhookHandlerService.cs` |
| `NativeStatementPdfExportService` | 1 | `CobranzaLuxuryApp/CobranzaNativa/Core/Statements/Services/NativeStatementPdfExportService.cs` |

### Metodos por categoria

| Servicio | Metodo | Categoria | Retorno | Observaciones |
|---|---|---|---|---|
| AspelCobranzaHausDetalleAppService | `BuildConceptNameFromAccount` | OTHER | `string` | ⚠ naming no CRUD estandar |
| AspelCobranzaHausDetalleAppService | `LogAudit` | OTHER | `void` | ⚠ naming no CRUD estandar |
| AspelCobranzaHausDetalleAppService | `NormalizeSegmentedAccountCode` | OTHER | `string` | ⚠ naming no CRUD estandar |
| AspelCobranzaHausDetalleAppService | `SplitAccountSegments` | SPECIAL | `string[]` | ✓ |
| CobranzaOnlineAccountAppService | `GetAccountsTreeAsync` | GET_LIST | `Task<ActionResult<ApiResponseDTO<List<CobranzaOnlineAccountResponseDTO>>>>` | ⚠ Get sin ByXxx/All |
| CobranzaOnlineBalanceAppService | `GetBalancesByCustomerAsync` | GET_LIST | `Task<ActionResult<ApiResponseDTO<List<CobranzaOnlineBalanceResponseDTO>>>>` | ✓ |
| CobranzaOnlineDashboardAppService | `GetCollectionAnalysisAsync` | GET_LIST | `Task<ApiResponseDTO<CobranzaOnlineAnalysisResponseDTO>>` | ⚠ Get sin ByXxx/All |
| CobranzaOnlineDashboardAppService | `GetDashboardAsync` | GET_SINGLE | `Task<ApiResponseDTO<CobranzaOnlineDashboardResponseDTO>>` | ⚠ Get sin ByXxx/All |
| CobranzaOnlineDashboardAppService | `GetExcludedAccountsAsync` | GET_LIST | `Task<ApiResponseDTO<CobranzaOnlineExcludedAccountListResponseDTO>>` | ⚠ Get sin ByXxx/All |
| CobranzaOnlineDashboardAppService | `GetInspectionAsync` | GET_SINGLE | `Task<ApiResponseDTO<CobranzaOnlineInspectionResponseDTO>>` | ⚠ Get sin ByXxx/All |
| CobranzaOnlineDashboardAppService | `GetInspectionHistoryAsync` | GET_SINGLE | `Task<ApiResponseDTO<CobranzaOnlineInspectionHistoryResponseDTO>>` | ⚠ Get sin ByXxx/All |
| CobranzaOnlineDashboardAppService | `GetSyncDiagnosticsAsync` | GET_LIST | `Task<CobranzaOnlineSyncDiagnosticsDTO>` | ⚠ Get sin ByXxx/All |
| CobranzaOnlineDashboardAppService | `GetSyncStatusAsync` | GET_LIST | `Task<ApiResponseDTO<CobranzaOnlineSyncMetadataDTO>>` | ⚠ Get sin ByXxx/All |
| CobranzaOnlineDashboardAppService | `UpsertExcludedAccountAsync` | OTHER | `Task<ApiResponseDTO<CobranzaOnlineExcludedAccountRowDTO>>` | ⚠ naming no CRUD estandar |
| CobranzaOnlineMovementAppService | `GetMovimientosAsync` | GET_LIST | `Task<ApiResponseDTO<List<CobranzaOnlineMovementResponseDTO>>>` | ⚠ Get sin ByXxx/All |
| CobranzaOnlinePolicyAppService | `GetPoliciesAsync` | GET_LIST | `Task<ActionResult<ApiResponseDTO<List<CobranzaOnlinePolicyResponseDTO>>>>` | ⚠ Get sin ByXxx/All |
| CobranzaOnlinePortfolioAppService | `GetCarteraAsync` | GET_LIST | `Task<ActionResult<ApiResponseDTO<List<CobranzaOnlinePortfolioDTO>>>>` | ⚠ Get sin ByXxx/All |
| CobranzaOnlineReporteFinancieroAppService | `GetReporteFinancieroAsync` | GET_SINGLE | `Task<ApiResponseDTO<ReporteFinancieroResponseDTO>>` | ⚠ Get sin ByXxx/All |
| CobranzaOnlineStatementAppService | `GetCuentasNivel3Async` | GET_LIST | `Task<ApiResponseDTO<List<CobranzaOnlineAccountResponseDTO>>>` | ⚠ Get sin ByXxx/All |
| CobranzaOnlineStatementAppService | `GetEstadoCuentaAsync` | GET_SINGLE | `Task<ApiResponseDTO<CobranzaOnlineStatementResponseDTO>>` | ⚠ Get sin ByXxx/All |
| IAdjustmentService | `CancelCreditNoteAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| IAdjustmentService | `CreateAdjustmentAsync` | CREATE | `Task<ApiResponseDTO<AdjustmentResponseDTO>>` | ✓ |
| IAdjustmentService | `CreateCreditNoteAsync` | CREATE | `Task<ApiResponseDTO<CreditNoteResponseDTO>>` | ✓ |
| IAdjustmentService | `GetPendingCreditNotesAsync` | GET_LIST | `Task<ApiResponseDTO<List<CreditNoteResponseDTO>>>` | ⚠ Get sin ByXxx/All |
| IAspelCobranzaHausAppService | `GetAccountsByCustomerAsync` | GET_SINGLE | `Task<ApiResponseDTO<AspelAccountsByCustomerResponseDTO>>` | ✓ |
| IAspelCobranzaHausAppService | `GetCustomersAsync` | GET_LIST | `Task<ApiResponseDTO<List<AspelCustomerResponseDTO>>>` | ⚠ Get sin ByXxx/All |
| IAspelCobranzaHausAppService | `GetDeudasActualesAsync` | GET_LIST | `Task<ApiResponseDTO<AspelDeudasActualesResponseDTO>>` | ⚠ Get sin ByXxx/All |
| IAspelCobranzaHausAppService | `GetEstadoCuentaRangoAsync` | GET_SINGLE | `Task<ApiResponseDTO<AspelEstadoCuentaResponseDTO>>` | ⚠ Get sin ByXxx/All |
| IAspelCobranzaHausDetalleAppService | `GetDetalleCobranzaRangoAsync` | GET_SINGLE | `Task<ApiResponseDTO<AspelCobranzaDetalleResponseDTO>>` | ✓ |
| IAspelCobranzaHausDetalleAppService | `GetDetalleCobranzaRangoAuditAsync` | GET_SINGLE | `Task<ApiResponseDTO<AspelCobranzaDetalleAuditResponseDTO>>` | ✓ |
| IAspelCobranzaHausLocalAppService | `GetAccountsByCustomerAsync` | GET_SINGLE | `Task<ApiResponseDTO<AspelCobranzaHausLocalAccountsByCustomerResponseDTO>>` | ✓ |
| IAspelCobranzaHausLocalAppService | `GetCustomersAsync` | GET_LIST | `Task<ApiResponseDTO<List<AspelCobranzaHausLocalCustomerResponseDTO>>>` | ⚠ Get sin ByXxx/All |
| IAspelCobranzaHausLocalAppService | `GetDeudasActualesAsync` | GET_LIST | `Task<ApiResponseDTO<AspelCobranzaHausLocalDeudasActualesResponseDTO>>` | ⚠ Get sin ByXxx/All |
| IAspelCobranzaHausLocalAppService | `GetEstadoCuentaRangoAsync` | GET_SINGLE | `Task<ApiResponseDTO<AspelCobranzaHausLocalEstadoCuentaResponseDTO>>` | ⚠ Get sin ByXxx/All |
| IAspelCobranzaHausLocalAppService | `GetStatusAsync` | GET_LIST | `Task<ApiResponseDTO<AspelCobranzaHausLocalStatusResponseDTO>>` | ⚠ Get sin ByXxx/All |
| IAspelCobranzaHausLocalDetalleAppService | `GetDetalleCobranzaRangoAsync` | GET_SINGLE | `Task<ApiResponseDTO<AspelCobranzaHausLocalCobranzaDetalleResponseDTO>>` | ✓ |
| IChargeAppService | `BulkImportSaldoInicialAsync` | OTHER | `Task<ApiResponseDTO<BulkChargeImportResultDTO>>` | ⚠ naming no CRUD estandar |
| IChargeAppService | `BulkSetInitialBalanceAsync` | OTHER | `Task<ApiResponseDTO<BulkSetInitialBalanceResultDTO>>` | ⚠ naming no CRUD estandar |
| IChargeAppService | `CancelAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| IChargeAppService | `CancelPaidChargeAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| IChargeAppService | `CreateAsync` | CREATE | `Task<ApiResponseDTO<ChargeResponseDTO>>` | ✓ |
| IChargeAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<List<ChargeResponseDTO>>>` | ✓ |
| IChargeAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<ChargeResponseDTO>>` | ✓ |
| IChargeAppService | `GetInitialBalanceStatusAsync` | GET_LIST | `Task<ApiResponseDTO<List<PropertyInitialBalanceDTO>>>` | ⚠ Get sin ByXxx/All |
| IChargeAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<ChargeResponseDTO>>` | ✓ |
| IChargesGeneratorService | `GenerateMonthlyChargesAsync` | SPECIAL | `Task<ApiResponseDTO<int>>` | ✓ |
| IChargesGeneratorService | `GenerateRetroactiveAdjustmentsAsync` | SPECIAL | `Task<ApiResponseDTO<int>>` | ✓ |
| IChargeTemplateAppService | `CreateAsync` | CREATE | `Task<ApiResponseDTO<ChargeTemplateResponseDTO>>` | ✓ |
| IChargeTemplateAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IChargeTemplateAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<List<ChargeTemplateResponseDTO>>>` | ✓ |
| IChargeTemplateAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<ChargeTemplateResponseDTO>>` | ✓ |
| IChargeTemplateAppService | `GetCoverageAsync` | GET_LIST | `Task<ApiResponseDTO<List<TemplateCoverageDTO>>>` | ⚠ Get sin ByXxx/All |
| IChargeTemplateAppService | `PreviewAsync` | SPECIAL | `Task<ApiResponseDTO<IndivisoFeeComparisonDTO>>` | ✓ |
| IChargeTemplateAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<ChargeTemplateResponseDTO>>` | ✓ |
| IChargeTypeCatalogAppService | `CreateAsync` | CREATE | `Task<ApiResponseDTO<ChargeTypeCatalogResponseDTO>>` | ✓ |
| IChargeTypeCatalogAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IChargeTypeCatalogAppService | `GetByCustomerAsync` | GET_LIST | `Task<ApiResponseDTO<List<ChargeTypeCatalogResponseDTO>>>` | ✓ |
| IChargeTypeCatalogAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<ChargeTypeCatalogResponseDTO>>` | ✓ |
| IChargeTypeCatalogAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<ChargeTypeCatalogResponseDTO>>` | ✓ |
| ICobranzaMetricasService | `GetMetricasAsync` | GET_LIST | `Task<ApiResponseDTO<CobranzaMetricasResponseDTO>>` | ⚠ Get sin ByXxx/All |
| ICobranzaNativaNotificationService | `SendMonthlyStatementEmailAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| ICobranzaNativaNotificationService | `SendMonthlyStatementsBatchAsync` | SPECIAL | `Task<ApiResponseDTO<SendNativeStatementBatchResponseDTO>>` | ✓ |
| ICobranzaNativaNotificationService | `SendPaymentReceiptEmailAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| ICobranzaPaymentAppService | `CreateAsync` | CREATE | `Task<ApiResponseDTO<CobranzaPaymentResponseDTO>>` | ✓ |
| ICobranzaPaymentAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<List<CobranzaPaymentResponseDTO>>>` | ✓ |
| ICobranzaPaymentAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<CobranzaPaymentResponseDTO>>` | ✓ |
| ICobranzaPaymentAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<CobranzaPaymentResponseDTO>>` | ✓ |
| ICollectionCaseAppService | `CreateAsync` | CREATE | `Task<ApiResponseDTO<CollectionCaseResponseDTO>>` | ✓ |
| ICollectionCaseAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<List<CollectionCaseResponseDTO>>>` | ✓ |
| ICollectionCaseAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<CollectionCaseResponseDTO>>` | ✓ |
| ICollectionCaseAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<CollectionCaseResponseDTO>>` | ✓ |
| ICollectionManagerService | `EvaluateAndEscalateAccountsAsync` | OTHER | `Task<ApiResponseDTO<int>>` | ⚠ naming no CRUD estandar |
| ICollectionManagerService | `LogCollectionActivityAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| IFinancialApprovalService | `ApproveAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| IFinancialApprovalService | `CancelRequestAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| IFinancialApprovalService | `CreateRequestAsync` | CREATE | `Task<ApiResponseDTO<FinancialApprovalResponseDTO>>` | ✓ |
| IFinancialApprovalService | `GetByPropertyAsync` | GET_LIST | `Task<ApiResponseDTO<List<FinancialApprovalResponseDTO>>>` | ✓ |
| IFinancialApprovalService | `GetPendingAsync` | GET_LIST | `Task<ApiResponseDTO<List<FinancialApprovalResponseDTO>>>` | ⚠ Get sin ByXxx/All |
| IFinancialApprovalService | `RejectAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| IFinancialAuditService | `GetByPropertyAsync` | GET_LIST | `Task<List<FinancialAuditLogDTO>>` | ✓ |
| IFinancialAuditService | `GetByTenantAsync` | GET_LIST | `Task<List<FinancialAuditLogDTO>>` | ✓ |
| IFinancialAuditService | `LogAsync` | OTHER | `Task` | ⚠ naming no CRUD estandar |
| IInvoiceQueryAppService | `GetByChargeAsync` | GET_LIST | `Task<ApiResponseDTO<List<InvoiceResponseDTO>>>` | ✓ |
| IInvoiceQueryAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<InvoiceResponseDTO>>` | ✓ |
| IInvoiceService | `CancelInvoiceAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| IInvoiceService | `GenerateInvoiceAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| ILateFeeCalculatorService | `ProcessLateFeesAsync` | SPECIAL | `Task<ApiResponseDTO<int>>` | ✓ |
| ILateFeePolicyAppService | `CreateAsync` | CREATE | `Task<ApiResponseDTO<LateFeePolicyResponseDTO>>` | ✓ |
| ILateFeePolicyAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ILateFeePolicyAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<List<LateFeePolicyResponseDTO>>>` | ✓ |
| ILateFeePolicyAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<LateFeePolicyResponseDTO>>` | ✓ |
| ILateFeePolicyAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<LateFeePolicyResponseDTO>>` | ✓ |
| ILedgerIntegrityService | `CheckPropertyIntegrityAsync` | SPECIAL | `Task<PropertyIntegrityResultDTO>` | ✓ |
| ILedgerIntegrityService | `CheckTenantIntegrityAsync` | SPECIAL | `Task<LedgerIntegrityReportDTO>` | ✓ |
| ILedgerService | `BeginBatchAsync` | OTHER | `Task<FinancialBatch>` | ⚠ naming no CRUD estandar |
| ILedgerService | `GetBatchEntriesAsync` | GET_LIST | `Task<List<FinancialLedgerEntry>>` | ⚠ Get sin ByXxx/All |
| ILedgerService | `GetChargeBalanceAsync` | GET_SINGLE | `Task<decimal>` | ⚠ Get sin ByXxx/All |
| ILedgerService | `GetPropertyBalanceAsync` | GET_SINGLE | `Task<decimal>` | ⚠ Get sin ByXxx/All |
| ILedgerService | `GetPropertyLedgerAsync` | GET_LIST | `Task<List<FinancialLedgerEntry>>` | ⚠ Get sin ByXxx/All |
| ILedgerService | `WriteAsync` | OTHER | `Task` | ⚠ naming no CRUD estandar |
| INativeCollectionNotificationSettingsService | `GetByCustomerAsync` | GET_SINGLE | `Task<ApiResponseDTO<NativeCollectionNotificationSettingsResponseDTO>>` | ✓ |
| INativeCollectionNotificationSettingsService | `GetEffectiveSettingsAsync` | GET_LIST | `Task<NativeCollectionNotificationSettingsResponseDTO>` | ⚠ Get sin ByXxx/All |
| INativeCollectionNotificationSettingsService | `SaveAsync` | UPDATE | `Task<ApiResponseDTO<NativeCollectionNotificationSettingsResponseDTO>>` | ✓ |
| INativeCollectionRealTimeService | `GetExcludedConnectionIdAsync` | GET_SINGLE | `Task<string>` | ⚠ Get sin ByXxx/All |
| INativeCollectionRealTimeService | `SendUpdateAsync` | SPECIAL | `Task` | ✓ |
| INativeStatementService | `GetStatementByPropertyAsync` | GET_SINGLE | `Task<ApiResponseDTO<NativeStatementResponseDTO>>` | ✓ |
| INotificationEngineService | `ProcessNotificationsAsync` | SPECIAL | `Task<ApiResponseDTO<int>>` | ✓ |
| IPaymentAllocationService | `ApplyPaymentToChargesAsync` | SPECIAL | `Task<ApiResponseDTO<ApplyPaymentResultDTO>>` | ✓ |
| IPaymentAllocationService | `AutoApplyOverpaymentsAsync` | OTHER | `Task<ApiResponseDTO<ApplyPaymentResultDTO>>` | ⚠ naming no CRUD estandar |
| IPaymentAllocationService | `CancelPaymentAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| IPaymentAllocationService | `GetPendingChargesByPropertyAsync` | GET_LIST | `Task<ApiResponseDTO<List<PendingChargeDTO>>>` | ✓ |
| IPeriodClosureService | `ClosePeriodAsync` | SPECIAL | `Task<ApiResponseDTO<PeriodClosureResponseDTO>>` | ✓ |
| IPeriodClosureService | `FindBlockingClosureAsync` | GET_SINGLE | `Task<CollectionPeriodClosure>` | ⚠ Get sin ByXxx/All |
| IPeriodClosureService | `GetPeriodsAsync` | GET_LIST | `Task<ApiResponseDTO<List<PeriodClosureResponseDTO>>>` | ⚠ Get sin ByXxx/All |
| IPeriodClosureService | `IsPeriodClosedAsync` | OTHER | `Task<bool>` | ⚠ naming no CRUD estandar |
| IPeriodClosureService | `ReopenPeriodAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| IPropertyFineAppService | `AddEvidenceAsync` | CREATE | `Task<ApiResponseDTO<PropertyFineResponseDTO>>` | ✓ |
| IPropertyFineAppService | `CreateAsync` | CREATE | `Task<ApiResponseDTO<PropertyFineResponseDTO>>` | ✓ |
| IPropertyFineAppService | `GetByCustomerAsync` | GET_LIST | `Task<ApiResponseDTO<List<PropertyFineResponseDTO>>>` | ✓ |
| IPropertyFineAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<PropertyFineResponseDTO>>` | ✓ |
| IPropertyFineAppService | `GetByPropertyAsync` | GET_LIST | `Task<ApiResponseDTO<List<PropertyFineResponseDTO>>>` | ✓ |
| IPropertyFineAppService | `IssueChargeAsync` | OTHER | `Task<ApiResponseDTO<PropertyFineResponseDTO>>` | ⚠ naming no CRUD estandar |
| IPropertyFineAppService | `RemoveEvidenceAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IPropertyFineAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<PropertyFineResponseDTO>>` | ✓ |
| IPropertyFineAppService | `VoidAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| IPropertyMemberService | `AddMemberAsync` | CREATE | `Task<ApiResponseDTO<PropertyMemberResponseDTO>>` | ✓ |
| IPropertyMemberService | `CreateMemberWithAccountAsync` | CREATE | `Task<ApiResponseDTO<PropertyMemberResponseDTO>>` | ✓ |
| IPropertyMemberService | `DeleteMemberAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IPropertyMemberService | `EndMembershipAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| IPropertyMemberService | `GetByCustomerAsync` | GET_LIST | `Task<ApiResponseDTO<List<PropertyMemberResponseDTO>>>` | ✓ |
| IPropertyMemberService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<PropertyMemberResponseDTO>>` | ✓ |
| IPropertyMemberService | `GetByPropertyAsync` | GET_LIST | `Task<ApiResponseDTO<List<PropertyMemberResponseDTO>>>` | ✓ |
| IPropertyMemberService | `GetFinancialResponsibleAsync` | GET_SINGLE | `Task<PropertyMember>` | ⚠ Get sin ByXxx/All |
| IPropertyMemberService | `GetNotificationRecipientsAsync` | GET_LIST | `Task<List<PropertyMemberNotificationRecipientDTO>>` | ⚠ Get sin ByXxx/All |
| IPropertyMemberService | `MigrateFromLegacyAsync` | SPECIAL | `Task<ApiResponseDTO<MigrationResultDTO>>` | ✓ |
| IPropertyMemberService | `UpdateMemberAsync` | UPDATE | `Task<ApiResponseDTO<PropertyMemberResponseDTO>>` | ✓ |
| IReconciliationService | `GetUnallocatedPaymentsAsync` | GET_LIST | `Task<ApiResponseDTO<List<CobranzaPaymentResponseDTO>>>` | ✓ |
| IReconciliationService | `ReconcileUnallocatedPaymentsAsync` | SPECIAL | `Task<ApiResponseDTO<int>>` | ✓ |
| IRegulationArticleAppService | `CreateAsync` | CREATE | `Task<ApiResponseDTO<RegulationArticleResponseDTO>>` | ✓ |
| IRegulationArticleAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IRegulationArticleAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<List<RegulationArticleResponseDTO>>>` | ✓ |
| IRegulationArticleAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<RegulationArticleResponseDTO>>` | ✓ |
| IRegulationArticleAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<RegulationArticleResponseDTO>>` | ✓ |
| IWebhookHandlerService | `HandlePaymentWebhookAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| NativeStatementPdfExportService | `Export` | SPECIAL | `byte[]` | ✓ |

### Endpoints

| Verbo | Ruta | Handler | Categoria |
|---|---|---|---|
| GET | `api/aspel-cobranza/accounts` | `GetAccountsByCustomerAsync` | GET_LIST |
| GET | `api/aspel-cobranza/customers` | `GetCustomersAsync` | GET_LIST |
| GET | `api/aspel-cobranza/debug-cuotas-extra` | `GetRawDataViaAspelApiAsync` | GET_LIST |
| GET | `api/aspel-cobranza/detalle-cobranza-rango` | `GetDetalleCobranzaRangoAsync` | GET_LIST |
| GET | `api/aspel-cobranza/detalle-cobranza-rango` | `GetDetalleCobranzaRangoAuditAsync` | GET_LIST |
| GET | `api/aspel-cobranza/deudas-actuales` | `GetDeudasActualesAsync` | GET_LIST |
| GET | `api/aspel-cobranza/estado-cuenta-rango` | `GetEstadoCuentaRangoAsync` | GET_LIST |
| POST | `api/cobranza/adjustments` | `CreateAdjustmentAsync` | CREATE |
| POST | `api/cobranza/adjustments/credit-notes` | `CreateCreditNoteAsync` | CREATE |
| POST | `api/cobranza/adjustments/credit-notes/{id:guid}/cancel` | `CancelCreditNoteAsync` | SPECIAL |
| GET | `api/cobranza/adjustments/credit-notes/property/{propertyId:guid}/customer/{customerId:guid}` | `GetPendingCreditNotesAsync` | GET_SINGLE |
| POST | `api/cobranza/approvals` | `CreateRequestAsync` | CREATE |
| POST | `api/cobranza/approvals/{id:guid}/approve` | `ApproveAsync` | SPECIAL |
| POST | `api/cobranza/approvals/{id:guid}/cancel` | `CancelRequestAsync` | SPECIAL |
| POST | `api/cobranza/approvals/{id:guid}/reject` | `RejectAsync` | SPECIAL |
| GET | `api/cobranza/approvals/pending/customer/{customerId:guid}` | `GetPendingAsync` | GET_SINGLE |
| GET | `api/cobranza/approvals/property/{propertyId:guid}/customer/{customerId:guid}` | `GetByPropertyAsync` | GET_SINGLE |
| GET | `api/cobranza/audit-logs/customer/{customerId:guid}` | `GetByTenantAsync` | GET_SINGLE |
| GET | `api/cobranza/audit-logs/property/{propertyId:guid}/customer/{customerId:guid}` | `GetByPropertyAsync` | GET_SINGLE |
| POST | `api/cobranza/billing-config` | `UpsertAsync` | CREATE |
| GET | `api/cobranza/billing-config/customer/{customerId:guid}` | `GetByCustomerIdAsync` | GET_SINGLE |
| POST | `api/cobranza/charges` | `CreateAsync` | CREATE |
| GET | `api/cobranza/charges/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| PUT | `api/cobranza/charges/{id:guid}` | `UpdateAsync` | UPDATE |
| POST | `api/cobranza/charges/{id:guid}/cancel` | `CancelAsync` | SPECIAL |
| POST | `api/cobranza/charges/bulk-import/saldo-inicial` | `BulkImportSaldoInicialAsync` | CREATE |
| POST | `api/cobranza/charges/calculate-late-fees` | `ProcessLateFeesAsync` | SPECIAL |
| GET | `api/cobranza/charges/customer/{customerId:guid}` | `GetAllAsync` | GET_SINGLE |
| POST | `api/cobranza/charges/generate-monthly` | `GenerateMonthlyChargesAsync` | SPECIAL |
| POST | `api/cobranza/charges/initial-balance/bulk` | `BulkSetInitialBalanceAsync` | CREATE |
| GET | `api/cobranza/charges/initial-balance-status/customer/{customerId:guid}` | `GetInitialBalanceStatusAsync` | GET_SINGLE |
| POST | `api/cobranza/charge-templates` | `CreateAsync` | CREATE |
| DELETE | `api/cobranza/charge-templates/{id:guid}` | `DeleteAsync` | DELETE |
| PUT | `api/cobranza/charge-templates/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/cobranza/charge-templates/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| GET | `api/cobranza/charge-templates/coverage/customer/{customerId:guid}` | `GetCoverageAsync` | GET_SINGLE |
| GET | `api/cobranza/charge-templates/customer/{customerId:guid}` | `GetAllAsync` | GET_SINGLE |
| POST | `api/cobranza/charge-templates/preview` | `PreviewAsync` | SPECIAL |
| POST | `api/cobranza/charge-types` | `CreateAsync` | CREATE |
| DELETE | `api/cobranza/charge-types/{id:guid}` | `DeleteAsync` | DELETE |
| PUT | `api/cobranza/charge-types/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/cobranza/charge-types/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| GET | `api/cobranza/charge-types/customer/{customerId:guid}` | `GetByCustomerAsync` | GET_SINGLE |
| POST | `api/cobranza/collection-cases` | `CreateAsync` | CREATE |
| PUT | `api/cobranza/collection-cases/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/cobranza/collection-cases/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| POST | `api/cobranza/collection-cases/{id:guid}/activity` | `LogCollectionActivityAsync` | CREATE |
| GET | `api/cobranza/collection-cases/customer/{customerId:guid}` | `GetAllAsync` | GET_SINGLE |
| POST | `api/cobranza/collection-cases/evaluate-and-escalate/{customerId:guid}` | `EvaluateAndEscalateAccountsAsync` | CREATE |
| POST | `api/cobranza/invoices` | `GenerateInvoiceAsync` | CREATE |
| GET | `api/cobranza/invoices/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| POST | `api/cobranza/invoices/{id:guid}/cancel` | `CancelInvoiceAsync` | SPECIAL |
| GET | `api/cobranza/invoices/charge/{chargeId:guid}` | `GetByChargeAsync` | GET_SINGLE |
| POST | `api/cobranza/late-fee-policies` | `CreateAsync` | CREATE |
| DELETE | `api/cobranza/late-fee-policies/{id:guid}` | `DeleteAsync` | DELETE |
| GET | `api/cobranza/late-fee-policies/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| PUT | `api/cobranza/late-fee-policies/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/cobranza/late-fee-policies/customer/{customerId:guid}` | `GetAllAsync` | GET_SINGLE |
| GET | `api/cobranza/ledger/batch/{batchId:guid}` | `GetBatchEntriesAsync` | GET_SINGLE |
| GET | `api/cobranza/ledger/charge/{chargeId:guid}/balance` | `GetChargeBalanceAsync` | GET_SINGLE |
| POST | `api/cobranza/ledger/integrity/customer/{customerId:guid}` | `CheckTenantIntegrityAsync` | CREATE |
| GET | `api/cobranza/ledger/integrity/customer/{customerId:guid}/property/{propertyId:guid}` | `CheckPropertyIntegrityAsync` | GET_SINGLE |
| GET | `api/cobranza/ledger/property/{propertyId:guid}/customer/{customerId:guid}/balance` | `GetPropertyBalanceAsync` | GET_SINGLE |
| GET | `api/cobranza/ledger/property/{propertyId:guid}/customer/{customerId:guid}/entries` | `GetPropertyLedgerAsync` | GET_SINGLE |
| GET | `api/cobranza/local/accounts` | `GetAccountsByCustomerAsync` | GET_LIST |
| GET | `api/cobranza/local/customers` | `GetCustomersAsync` | GET_LIST |
| GET | `api/cobranza/local/detalle-cobranza-rango` | `GetDetalleCobranzaRangoAsync` | GET_LIST |
| GET | `api/cobranza/local/deudas-actuales` | `GetDeudasActualesAsync` | GET_LIST |
| GET | `api/cobranza/local/estado-cuenta-rango` | `GetEstadoCuentaRangoAsync` | GET_LIST |
| GET | `api/cobranza/local/status` | `GetStatusAsync` | GET_LIST |
| GET | `api/cobranza/metrics/customer/{customerId:guid}` | `GetMetricasAsync` | GET_SINGLE |
| POST | `api/cobranza/notifications/process` | `ProcessNotificationsAsync` | SPECIAL |
| POST | `api/cobranza/notifications/receipts/{paymentId:guid}/send` | `SendPaymentReceiptEmailAsync` | SPECIAL |
| POST | `api/cobranza/notifications/statements/send` | `SendMonthlyStatementEmailAsync` | SPECIAL |
| POST | `api/cobranza/notifications/statements/send-batch` | `SendMonthlyStatementsBatchAsync` | SPECIAL |
| POST | `api/cobranza/notification-settings` | `SaveAsync` | CREATE |
| GET | `api/cobranza/notification-settings/customer/{customerId:guid}` | `GetByCustomerAsync` | GET_SINGLE |
| GET | `api/cobranza/online/accounts/tree/customer/{customerId:guid}` | `GetAccountsTreeAsync` | GET_SINGLE |
| GET | `api/cobranza/online/analysis/customer/{customerId:guid}/year/{year:int}/month/{month:int}/day/{day:int}` | `GetCollectionAnalysisAsync` | GET_SINGLE |
| POST | `api/cobranza/online/aspel-sync/{customerId:guid}/ejercicio/{year:int}/cobranza` | `GetSyncStatusAsync` | CREATE |
| POST | `api/cobranza/online/aspel-sync/{customerId:guid}/ejercicio/{year:int}/completo` | `RunMigrationAsync` | CREATE |
| POST | `api/cobranza/online/aspel-sync/{customerId:guid}/ejercicio/{year:int}/contabilidad` | `RunMigrationAsync` | CREATE |
| GET | `api/cobranza/online/balances/customer/{customerId:guid}/year/{year:int}` | `GetBalancesByCustomerAsync` | GET_SINGLE |
| GET | `api/cobranza/online/cartera/customer/{customerId:guid}/year/{year:int}` | `GetCarteraAsync` | GET_SINGLE |
| GET | `api/cobranza/online/dashboard/customer/{customerId:guid}/year/{year:int}/month/{month:int}` | `GetDashboardAsync` | GET_SINGLE |
| PUT | `api/cobranza/online/excluded-accounts/customer/{customerId:guid}` | `UpsertExcludedAccountAsync` | UPDATE |
| GET | `api/cobranza/online/excluded-accounts/customer/{customerId:guid}/year/{year:int}` | `GetExcludedAccountsAsync` | GET_SINGLE |
| GET | `api/cobranza/online/inspection/customer/{customerId:guid}/year/{year:int}/month/{month:int}` | `GetInspectionAsync` | GET_SINGLE |
| GET | `api/cobranza/online/inspection-history/customer/{customerId:guid}/year/{year:int}/account/{accountNumber}` | `GetInspectionHistoryAsync` | GET_SINGLE |
| GET | `api/cobranza/online/movements/customer/{customerId:guid}/year/{year:int}` | `GetMovimientosAsync` | GET_SINGLE |
| GET | `api/cobranza/online/policies/customer/{customerId:guid}/year/{year:int}` | `GetPoliciesAsync` | GET_SINGLE |
| GET | `api/cobranza/online/reporte-financiero/customer/{customerId:guid}/year/{year:int}/from/{mesInicio:int}/to/{mesFin:int}` | `GetReporteFinancieroAsync` | GET_SINGLE |
| GET | `api/cobranza/online/statements/cuentas-nivel3/customer/{customerId:guid}` | `GetCuentasNivel3Async` | GET_SINGLE |
| GET | `api/cobranza/online/statements/customer/{customerId:guid}/account/{accountId:guid}/year/{year:int}` | `GetEstadoCuentaAsync` | GET_SINGLE |
| GET | `api/cobranza/online/sync-status/customer/{customerId:guid}/year/{year:int}` | `GetSyncStatusAsync` | GET_SINGLE |
| POST | `api/cobranza/payments` | `CreateAsync` | SPECIAL |
| GET | `api/cobranza/payments/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| PUT | `api/cobranza/payments/{id:guid}` | `UpdateAsync` | UPDATE |
| POST | `api/cobranza/payments/{id:guid}/cancel` | `CancelPaymentAsync` | SPECIAL |
| POST | `api/cobranza/payments/apply-to-charges` | `ApplyPaymentToChargesAsync` | SPECIAL |
| POST | `api/cobranza/payments/auto-apply-overpayments` | `AutoApplyOverpaymentsAsync` | SPECIAL |
| GET | `api/cobranza/payments/customer/{customerId:guid}` | `GetAllAsync` | GET_SINGLE |
| GET | `api/cobranza/payments/pending-charges/property/{propertyId:guid}/customer/{customerId:guid}` | `GetPendingChargesByPropertyAsync` | GET_SINGLE |
| POST | `api/cobranza/payment-webhooks/pasarela` | `HandlePaymentWebhookAsync` | SPECIAL |
| GET | `api/cobranza/period-closures/customer/{customerId:guid}` | `GetPeriodsAsync` | GET_SINGLE |
| GET | `api/cobranza/period-closures/customer/{customerId:guid}/{year:int}/{month:int}/is-closed` | `IsPeriodClosedAsync` | GET_SINGLE |
| POST | `api/cobranza/period-closures/customer/{customerId:guid}/close` | `ClosePeriodAsync` | SPECIAL |
| POST | `api/cobranza/period-closures/customer/{customerId:guid}/reopen` | `ReopenPeriodAsync` | SPECIAL |
| POST | `api/cobranza/property-fines` | `CreateAsync` | CREATE |
| POST | `api/cobranza/property-fines/{fineId:guid}/evidences` | `AddEvidenceAsync` | CREATE |
| PUT | `api/cobranza/property-fines/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/cobranza/property-fines/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| POST | `api/cobranza/property-fines/{id:guid}/void` | `VoidAsync` | CREATE |
| GET | `api/cobranza/property-fines/customer/{customerId:guid}` | `GetByCustomerAsync` | GET_SINGLE |
| DELETE | `api/cobranza/property-fines/evidences/{evidenceId:guid}` | `RemoveEvidenceAsync` | DELETE |
| POST | `api/cobranza/property-fines/issue-charge` | `IssueChargeAsync` | CREATE |
| GET | `api/cobranza/property-fines/property/{propertyId:guid}` | `GetByPropertyAsync` | GET_SINGLE |
| POST | `api/cobranza/property-members` | `AddMemberAsync` | CREATE |
| GET | `api/cobranza/property-members/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| DELETE | `api/cobranza/property-members/{id:guid}` | `DeleteMemberAsync` | DELETE |
| PUT | `api/cobranza/property-members/{id:guid}` | `UpdateMemberAsync` | UPDATE |
| POST | `api/cobranza/property-members/{id:guid}/end-membership` | `EndMembershipAsync` | CREATE |
| POST | `api/cobranza/property-members/create-with-account` | `CreateMemberWithAccountAsync` | CREATE |
| GET | `api/cobranza/property-members/customer/{customerId:guid}` | `GetByCustomerAsync` | GET_SINGLE |
| POST | `api/cobranza/property-members/migrate-from-legacy/customer/{customerId:guid}` | `MigrateFromLegacyAsync` | CREATE |
| GET | `api/cobranza/property-members/property/{propertyId:guid}/customer/{customerId:guid}` | `GetByPropertyAsync` | GET_SINGLE |
| POST | `api/cobranza/reconciliations/auto-apply-all` | `ReconcileUnallocatedPaymentsAsync` | CREATE |
| GET | `api/cobranza/reconciliations/unallocated` | `GetUnallocatedPaymentsAsync` | GET_LIST |
| POST | `api/cobranza/regulation-articles` | `CreateAsync` | CREATE |
| PUT | `api/cobranza/regulation-articles/{id:guid}` | `UpdateAsync` | UPDATE |
| DELETE | `api/cobranza/regulation-articles/{id:guid}` | `DeleteAsync` | DELETE |
| GET | `api/cobranza/regulation-articles/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| GET | `api/cobranza/regulation-articles/customer/{customerId:guid}` | `GetAllAsync` | GET_SINGLE |
| GET | `api/cobranza/statements/{propertyId:guid}` | `GetStatementByPropertyAsync` | GET_SINGLE |
| GET | `api/cobranza/statements/{propertyId:guid}/pdf` | `GetStatementByPropertyAsync` | GET_SINGLE |

## Modulo: CommitteeLuxuryApp

Metodos: 11 | Endpoints HTTP: 11

### Servicios e interfaces

| Servicio/Interfaz | Metodos | Ubicacion |
|---|---|---|
| `ICommitteeAppService` | 9 | `CommitteeLuxuryApp/Interfaces/ICommitteeAppService.cs` |
| `ICommitteeCobranzaAppService` | 2 | `CommitteeLuxuryApp/Interfaces/ICommitteeCobranzaAppService.cs` |

### Metodos por categoria

| Servicio | Metodo | Categoria | Retorno | Observaciones |
|---|---|---|---|---|
| ICommitteeAppService | `GetBuildingInsuranceAsync` | GET_SINGLE | `Task<ApiResponseDTO<CommitteeBuildingInsuranceDTO>>` | ⚠ Get sin ByXxx/All |
| ICommitteeAppService | `GetCustomDocumentsAsync` | GET_LIST | `Task<ApiResponseDTO<List<CommitteeCustomDocumentDTO>>>` | ⚠ Get sin ByXxx/All |
| ICommitteeAppService | `GetDirectorioAsync` | GET_LIST | `Task<ApiResponseDTO<List<CommitteeDirectorioDTO>>>` | ⚠ Get sin ByXxx/All |
| ICommitteeAppService | `GetFinancialReportsAsync` | GET_LIST | `Task<ApiResponseDTO<List<CommitteeBoardDirectorsDocumentDTO>>>` | ⚠ Get sin ByXxx/All |
| ICommitteeAppService | `GetHomeImagesAsync` | GET_LIST | `Task<ApiResponseDTO<CommitteeHomeImagesDTO>>` | ⚠ Get sin ByXxx/All |
| ICommitteeAppService | `GetMeetingMinuteDetailAsync` | GET_SINGLE | `Task<ApiResponseDTO<CommitteeMeetingBoardDirectorsDTO>>` | ⚠ Get sin ByXxx/All |
| ICommitteeAppService | `GetMeetingMinutesAsync` | GET_LIST | `Task<ApiResponseDTO<List<CommitteeBoardDirectorsDocumentDTO>>>` | ⚠ Get sin ByXxx/All |
| ICommitteeAppService | `GetMonthlyMeetingsAsync` | GET_LIST | `Task<ApiResponseDTO<List<CommitteeBoardDirectorsDocumentDTO>>>` | ⚠ Get sin ByXxx/All |
| ICommitteeAppService | `GetPolicyContractsAsync` | GET_LIST | `Task<ApiResponseDTO<List<CommitteePolicyContractDTO>>>` | ⚠ Get sin ByXxx/All |
| ICommitteeCobranzaAppService | `GetMorosoDetailAsync` | GET_SINGLE | `Task<ApiResponseDTO<AspelCobranzaDetalleResponseDTO>>` | ⚠ Get sin ByXxx/All |
| ICommitteeCobranzaAppService | `GetMorososReportAsync` | GET_SINGLE | `Task<ApiResponseDTO<CommitteeMorososResponseDTO>>` | ⚠ Get sin ByXxx/All |

### Endpoints

| Verbo | Ruta | Handler | Categoria |
|---|---|---|---|
| GET | `api/committee/board-directors/financial-reports/{customerId:guid}` | `GetFinancialReportsAsync` | GET_SINGLE |
| GET | `api/committee/board-directors/meeting-minutes/{customerId:guid}` | `GetMeetingMinutesAsync` | GET_SINGLE |
| GET | `api/committee/board-directors/meeting-minutes-detail/{meetingId:guid}` | `GetMeetingMinuteDetailAsync` | GET_SINGLE |
| GET | `api/committee/board-directors/monthly-meetings/{customerId:guid}` | `GetMonthlyMeetingsAsync` | GET_SINGLE |
| GET | `api/committee/cobranza/morosos` | `GetMorososReportAsync` | GET_LIST |
| GET | `api/committee/cobranza/morosos/{numCta}/detalle` | `GetMorosoDetailAsync` | GET_LIST |
| GET | `api/committee/directorio/{customerId:guid}` | `GetDirectorioAsync` | GET_SINGLE |
| GET | `api/committee/home-images` | `GetHomeImagesAsync` | GET_LIST |
| GET | `api/committee/library/building-insurance/{customerId:guid}` | `GetBuildingInsuranceAsync` | GET_SINGLE |
| GET | `api/committee/library/custom-documents/{customerId:guid}/{documentType}` | `GetCustomDocumentsAsync` | GET_SINGLE |
| GET | `api/committee/library/policy-contracts/{customerId:guid}/{isCurrent:bool}` | `GetPolicyContractsAsync` | GET_SINGLE |

## Modulo: ComprasLuxuryApp

Metodos: 43 | Endpoints HTTP: 42

### Servicios e interfaces

| Servicio/Interfaz | Metodos | Ubicacion |
|---|---|---|
| `IComparativoAppService` | 6 | `ComprasLuxuryApp/SolicitudesCompra/Comparativo/Interfaces/IComparativoAppService.cs` |
| `ICotizacionProveedorAppService` | 8 | `ComprasLuxuryApp/SolicitudesCompra/Cotizaciones/Interfaces/ICotizacionProveedorAppService.cs` |
| `IEvidenciaAppService` | 4 | `ComprasLuxuryApp/SolicitudesCompra/Evidencia/Interfaces/IEvidenciaAppService.cs` |
| `IHistorialComprasAppService` | 1 | `ComprasLuxuryApp/HistorialCompras/Interfaces/IHistorialComprasAppService.cs` |
| `IPresupuestoAppService` | 3 | `ComprasLuxuryApp/SolicitudesCompra/Presupuesto/Interfaces/IPresupuestoAppService.cs` |
| `ISolicitudCompraAppService` | 13 | `ComprasLuxuryApp/SolicitudesCompra/Solicitudes/Interfaces/ISolicitudCompraAppService.cs` |
| `ISolicitudCompraDetalleAppService` | 8 | `ComprasLuxuryApp/SolicitudesCompra/Detalle/Interfaces/ISolicitudCompraDetalleAppService.cs` |

### Metodos por categoria

| Servicio | Metodo | Categoria | Retorno | Observaciones |
|---|---|---|---|---|
| IComparativoAppService | `AnalyzeComparativeChartAsync` | OTHER | `Task<ApiResponseDTO<string>>` | ⚠ naming no CRUD estandar |
| IComparativoAppService | `DeleteProvider` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IComparativoAppService | `GetPosicionCotizacion` | GET_SINGLE | `ApiResponseDTO<GetPosicionCotizacionDTO>` | ⚠ Get sin ByXxx/All |
| IComparativoAppService | `GetSCDTO` | GET_SINGLE | `Task<ApiResponseDTO<SCDTO>>` | ⚠ Get sin ByXxx/All |
| IComparativoAppService | `GetSolicitudCompraCuadroComparativoDTOAsync` | GET_SINGLE | `Task<ApiResponseDTO<SolicitudCompraCuadroComparativoDTO>>` | ⚠ Get sin ByXxx/All |
| IComparativoAppService | `UpdateCuadroComparativoAsync` | UPDATE | `Task<ApiResponseDTO<SolicitudCompra>>` | ✓ |
| ICotizacionProveedorAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<CotizacionProveedor>>` | ✓ |
| ICotizacionProveedorAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ICotizacionProveedorAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<CotizacionProveedorDTO>>` | ✓ |
| ICotizacionProveedorAppService | `GetProviders` | GET_LIST | `ApiResponseDTO<IEnumerable<SelectItemDTO<Guid>>>` | ⚠ Get sin ByXxx/All |
| ICotizacionProveedorAppService | `ListAsync` | OTHER | `Task<ApiResponseDTO<List<CotizacionProveedorDTO>>>` | ⚠ naming no CRUD estandar |
| ICotizacionProveedorAppService | `RemoveFileAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ICotizacionProveedorAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<CotizacionProveedor>>` | ✓ |
| ICotizacionProveedorAppService | `UpdateProviderAsync` | UPDATE | `Task<ApiResponseDTO<CotizacionProveedor>>` | ✓ |
| IEvidenciaAppService | `AddCotizacionEvidenceAsync` | CREATE | `Task<ApiResponseDTO<CotizacionProveedorEvidenceDTO>>` | ✓ |
| IEvidenciaAppService | `AddSolicitudEvidenceAsync` | CREATE | `Task<ApiResponseDTO<SolicitudCompraEvidenceDTO>>` | ✓ |
| IEvidenciaAppService | `DeleteCotizacionEvidenceAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IEvidenciaAppService | `DeleteSolicitudEvidenceAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IHistorialComprasAppService | `GetPagadasAsync` | GET_LIST | `Task<ApiResponseDTO<List<OrdenesCompraPagadasDTO>>>` | ⚠ Get sin ByXxx/All |
| IPresupuestoAppService | `AddBudgetAsync` | CREATE | `Task<ApiResponseDTO<SolicitudCompraBudgetDTO>>` | ✓ |
| IPresupuestoAppService | `DeleteBudgetAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IPresupuestoAppService | `GetAvailableBudgetsAsync` | GET_LIST | `Task<ApiResponseDTO<BudgetToPurchaseOrderDTO>>` | ⚠ Get sin ByXxx/All |
| ISolicitudCompraAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<SolicitudCompra>>` | ✓ |
| ISolicitudCompraAppService | `DeleteSolicitudComplete` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ISolicitudCompraAppService | `DeleteSupportPdfAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ISolicitudCompraAppService | `GetComiteEventsAsync` | GET_LIST | `ApiResponseDTO<IEnumerable<ComiteEventoDTO>>` | ⚠ Get sin ByXxx/All |
| ISolicitudCompraAppService | `GetIdSolicitudCompraAsync` | GET_SINGLE | `Task<ApiResponseDTO<Guid>>` | ⚠ Get sin ByXxx/All |
| ISolicitudCompraAppService | `GetSelectedForPresentationAsync` | GET_LIST | `Task<ApiResponseDTO<IEnumerable<SolicitudesCompraIndexDTO>>>` | ⚠ Get sin ByXxx/All |
| ISolicitudCompraAppService | `GetSolicitudCompraIndexDTO` | GET_LIST | `Task<ApiResponseDTO<IEnumerable<SolicitudesCompraIndexDTO>>>` | ⚠ Get sin ByXxx/All |
| ISolicitudCompraAppService | `GetSolicitudCompraIndividual` | GET_SINGLE | `Task<ApiResponseDTO<SolicitudCompraIndividualDTO>>` | ⚠ Get sin ByXxx/All |
| ISolicitudCompraAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<SolicitudCompra>>` | ✓ |
| ISolicitudCompraAppService | `UpdatePresentationOrderAsync` | UPDATE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ISolicitudCompraAppService | `UpdatePresentationSelectionAsync` | UPDATE | `Task<ApiResponseDTO<SolicitudCompra>>` | ✓ |
| ISolicitudCompraAppService | `UploadRequestPdfAsync` | SPECIAL | `Task<ApiResponseDTO<string>>` | ✓ |
| ISolicitudCompraAppService | `UploadSupportPdfAsync` | SPECIAL | `Task<ApiResponseDTO<string>>` | ✓ |
| ISolicitudCompraDetalleAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<SolicitudCompraDetalle>>` | ✓ |
| ISolicitudCompraDetalleAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ISolicitudCompraDetalleAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<SolicitudCompraDetalleDTO>>` | ✓ |
| ISolicitudCompraDetalleAppService | `GetProductListAddDTO` | GET_SINGLE | `Task<ApiResponseDTO<SearchProductToAddDTO>>` | ✓ |
| ISolicitudCompraDetalleAppService | `GetSolicitudCompraDetalleEditProductDTO` | GET_SINGLE | `Task<ApiResponseDTO<SolicitudCompraDetalleEditProductDTO>>` | ✓ |
| ISolicitudCompraDetalleAppService | `SearchToAddRequest` | OTHER | `Task<ApiResponseDTO<IEnumerable<SolicitudCompraDetalleProductListAddDTO>>>` | ⚠ naming no CRUD estandar |
| ISolicitudCompraDetalleAppService | `UpdateCantidadUnidadAsync` | UPDATE | `Task<ApiResponseDTO<SolicitudCompraDetalle>>` | ✓ |
| ISolicitudCompraDetalleAppService | `UpdatePriceAsync` | UPDATE | `Task<ApiResponseDTO<SolicitudCompraDetalle>>` | ✓ |

### Endpoints

| Verbo | Ruta | Handler | Categoria |
|---|---|---|---|
| GET | `api/compras/historial-compras/pagadas/{customerId:guid}` | `GetPagadasAsync` | GET_SINGLE |
| POST | `api/cotizacion-proveedor` | `AddAsync` | CREATE |
| GET | `api/cotizacion-proveedor` | `ListAsync` | GET_LIST |
| PUT | `api/cotizacion-proveedor/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/cotizacion-proveedor/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| DELETE | `api/cotizacion-proveedor/{id:guid}` | `DeleteByIdAsync` | DELETE |
| GET | `api/cotizacion-proveedor/provider/{solicitudCompraId:guid}` | `GetProviders` | GET_SINGLE |
| DELETE | `api/cotizacion-proveedor/remove-file/{id:guid}` | `RemoveFileAsync` | DELETE |
| PUT | `api/cotizacion-proveedor/update-provider/{id:guid}` | `UpdateProviderAsync` | UPDATE |
| POST | `api/solicitud-compra` | `AddAsync` | CREATE |
| PUT | `api/solicitud-compra/{id:guid}` | `UpdateAsync` | UPDATE |
| DELETE | `api/solicitud-compra/{id:guid}` | `DeleteSolicitudComplete` | DELETE |
| GET | `api/solicitud-compra/{id:guid}` | `GetSCDTO` | GET_SINGLE |
| POST | `api/solicitud-compra/{id:guid}/evidences` | `AddCotizacionEvidenceAsync` | CREATE |
| POST | `api/solicitud-compra/{id:guid}/support-file` | `UploadSupportPdfAsync` | CREATE |
| DELETE | `api/solicitud-compra/{id:guid}/support-file` | `DeleteSupportPdfAsync` | DELETE |
| POST | `api/solicitud-compra/analyze-comparative-chart/{id:guid}` | `AnalyzeComparativeChartAsync` | CREATE |
| GET | `api/solicitud-compra/comite-events/{customerId:guid}` | `GetComiteEventsAsync` | GET_SINGLE |
| PUT | `api/solicitud-compra/cuadro-comparativo/{id:guid}` | `UpdateCuadroComparativoAsync` | UPDATE |
| GET | `api/solicitud-compra/cuadro-comparativo/{id:guid}` | `GetSolicitudCompraCuadroComparativoDTOAsync` | GET_SINGLE |
| GET | `api/solicitud-compra/cuadro-comparativo/{id:guid}/budgets` | `GetAvailableBudgetsAsync` | GET_SINGLE |
| POST | `api/solicitud-compra/cuadro-comparativo/{id:guid}/budgets` | `AddBudgetAsync` | CREATE |
| POST | `api/solicitud-compra/cuadro-comparativo/{id:guid}/evidences` | `AddSolicitudEvidenceAsync` | CREATE |
| DELETE | `api/solicitud-compra/cuadro-comparativo/budgets/{budgetId:guid}` | `DeleteBudgetAsync` | DELETE |
| DELETE | `api/solicitud-compra/cuadro-comparativo/evidences/{evidenceId:guid}` | `DeleteSolicitudEvidenceAsync` | DELETE |
| DELETE | `api/solicitud-compra/delete-provider/{solicitudCompraId:guid}/{cotizacionProveedorId:guid}` | `DeleteProvider` | DELETE |
| DELETE | `api/solicitud-compra/evidences/{evidenceId:guid}` | `DeleteCotizacionEvidenceAsync` | DELETE |
| GET | `api/solicitud-compra/get-id-solicitud-compra/{folioSolicitudCompra}/{customerId:guid}` | `GetIdSolicitudCompraAsync` | GET_SINGLE |
| GET | `api/solicitud-compra/get-solicitud-compra-individual/{id:guid}` | `GetSolicitudCompraIndividual` | GET_SINGLE |
| GET | `api/solicitud-compra/list/{customerId:guid}/{estatus}` | `GetSolicitudCompraIndexDTO` | GET_SINGLE |
| GET | `api/solicitud-compra/posicion-cotizacion/{solicitudCompraId:guid}/{posicion:int}` | `GetPosicionCotizacion` | GET_SINGLE |
| GET | `api/solicitud-compra/presentation/{customerId:guid}` | `GetSelectedForPresentationAsync` | GET_SINGLE |
| PUT | `api/solicitud-compra/presentation/{id:guid}/selection` | `UpdatePresentationSelectionAsync` | UPDATE |
| PUT | `api/solicitud-compra/presentation/order` | `UpdatePresentationOrderAsync` | UPDATE |
| POST | `api/solicitud-compra-detalle` | `AddAsync` | CREATE |
| DELETE | `api/solicitud-compra-detalle/{id:guid}` | `DeleteByIdAsync` | DELETE |
| GET | `api/solicitud-compra-detalle/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| PUT | `api/solicitud-compra-detalle/{id:guid}` | `UpdateCantidadUnidadAsync` | UPDATE |
| GET | `api/solicitud-compra-detalle/add-product/{solicitudCompraId:guid}` | `GetProductListAddDTO` | GET_SINGLE |
| GET | `api/solicitud-compra-detalle/edit-product/{id:guid}` | `GetSolicitudCompraDetalleEditProductDTO` | GET_SINGLE |
| GET | `api/solicitud-compra-detalle/search-to-add-request/{solicitudCompraId:guid}` | `SearchToAddRequest` | GET_SINGLE |
| PUT | `api/solicitud-compra-detalle/update-price/{id:guid}` | `UpdatePriceAsync` | UPDATE |

## Modulo: ContabilidadLuxuryApp

Metodos: 164 | Endpoints HTTP: 139

### Servicios e interfaces

| Servicio/Interfaz | Metodos | Ubicacion |
|---|---|---|
| `BudgetProposalService` | 1 | `ContabilidadLuxuryApp/PresupuestoPropuesta/Services/BudgetProposalService.cs` |
| `CobranzaMigratorService` | 1 | `ContabilidadLuxuryApp/ContabilidadMigration/Services/CobranzaMigratorService.cs` |
| `ContabilidadMigratorService` | 1 | `ContabilidadLuxuryApp/ContabilidadMigration/Services/ContabilidadMigratorService.cs` |
| `ContabilidadOnlineLocalService` | 4 | `ContabilidadLuxuryApp/ContabilidadOnline/Services/ContabilidadOnlineLocalService.cs` |
| `FinancialReportAppService` | 11 | `ContabilidadLuxuryApp/FinancialAccounting/Services/FinancialReportAppService.cs` |
| `FormulaEvaluatorService` | 2 | `ContabilidadLuxuryApp/DynamicReports/Services/FormulaEvaluatorService.cs` |
| `IAccountCatalogService` | 2 | `ContabilidadLuxuryApp/Shared/Interfaces/IAccountCatalogService.cs` |
| `IAccountingCatalogAppService` | 1 | `ContabilidadLuxuryApp/AccountingCatalogs/Interfaces/IAccountingCatalogAppService.cs` |
| `IAnalisisCobranzaOnlineService` | 1 | `ContabilidadLuxuryApp/ContabilidadOnline/Interfaces/IAnalisisCobranzaOnlineService.cs` |
| `IAnalisisCobranzaService` | 1 | `ContabilidadLuxuryApp/ContabilidadOnline/Interfaces/IAnalisisCobranzaService.cs` |
| `IAspelCustomerEmpresaAppService` | 4 | `ContabilidadLuxuryApp/ContabilidadConfig/Interfaces/IAspelCustomerEmpresaAppService.cs` |
| `IAspelFastReportQueryService` | 1 | `ContabilidadLuxuryApp/DynamicReports/Integrations/AspelFast/Interfaces/IAspelFastReportQueryService.cs` |
| `IAspelMappingService` | 1 | `ContabilidadLuxuryApp/PresupuestoWebAspel/Interfaces/IAspelMappingService.cs` |
| `IAspelQuotationService` | 8 | `ContabilidadLuxuryApp/PresupuestoShared/Interfaces/IAspelQuotationService.cs` |
| `IAutitoriaCuentasAspelService` | 1 | `ContabilidadLuxuryApp/AutitoriaCuentasAspel/Interfaces/IAutitoriaCuentasAspelService.cs` |
| `IBancosInversionesService` | 1 | `ContabilidadLuxuryApp/ContabilidadOnline/Interfaces/IBancosInversionesService.cs` |
| `IBillingConfigAppService` | 2 | `ContabilidadLuxuryApp/ContabilidadConfig/Interfaces/IBillingConfigAppService.cs` |
| `IBudgetAccountRuleAppService` | 4 | `ContabilidadLuxuryApp/Presupuesto/Services/BudgetAccountRuleAppService.cs` |
| `IBudgetProposalItemSupportService` | 4 | `ContabilidadLuxuryApp/PresupuestoPropuesta/Interfaces/IBudgetProposalItemSupportService.cs` |
| `IBudgetProposalService` | 9 | `ContabilidadLuxuryApp/PresupuestoPropuesta/Interfaces/IBudgetProposalService.cs` |
| `ICatalogoGastosFijosAppService` | 6 | `ContabilidadLuxuryApp/CatalogoGastosFijos/Interfaces/ICatalogoGastosFijosAppService.cs` |
| `ICatalogoGastosFijosDetallesAppService` | 7 | `ContabilidadLuxuryApp/ExpenseCatalogDetail/Interfaces/ICatalogoGastosFijosDetallesAppService.cs` |
| `ICatalogoGastosFijosPresupuestoAppService` | 6 | `ContabilidadLuxuryApp/ExpenseCatalogBudget/Interfaces/ICatalogoGastosFijosPresupuestoAppService.cs` |
| `ICedulaExtraordinariaService` | 1 | `ContabilidadLuxuryApp/ContabilidadOnline/Interfaces/ICedulaExtraordinariaService.cs` |
| `ICedulaPresupuestalService` | 1 | `ContabilidadLuxuryApp/ContabilidadOnline/Interfaces/ICedulaPresupuestalService.cs` |
| `ICoiMapeoAppService` | 4 | `ContabilidadLuxuryApp/ContabilidadConfig/Interfaces/ICoiMapeoAppService.cs` |
| `IContabilidadMinutaAppService` | 4 | `ContabilidadLuxuryApp/FinancialAccounting/Interfaces/IContabilidadMinutaAppService.cs` |
| `IDynamicReportEngineService` | 3 | `ContabilidadLuxuryApp/DynamicReports/Interfaces/IDynamicReportEngineService.cs` |
| `IEpfService` | 2 | `ContabilidadLuxuryApp/ContabilidadOnline/Interfaces/IEpfService.cs` |
| `IEspejoAspelFullService` | 1 | `ContabilidadLuxuryApp/EspejoAspelFull/Interfaces/IEspejoAspelFullService.cs` |
| `IEstadoResultadosService` | 1 | `ContabilidadLuxuryApp/ContabilidadOnline/Interfaces/IEstadoResultadosService.cs` |
| `IFinancialReportAppServiceV1` | 11 | `ContabilidadLuxuryApp/FinancialAccounting/Interfaces/IFinancialReportAppService.cs` |
| `IFlujoCajaService` | 1 | `ContabilidadLuxuryApp/ContabilidadOnline/Interfaces/IFlujoCajaService.cs` |
| `IFondoReservaService` | 1 | `ContabilidadLuxuryApp/ContabilidadOnline/Interfaces/IFondoReservaService.cs` |
| `IFundingAppService` | 21 | `ContabilidadLuxuryApp/Fondeos/Interfaces/IFundingAppService.cs` |
| `ILivePreviewEngineService` | 1 | `ContabilidadLuxuryApp/DynamicReports/Interfaces/ILivePreviewEngineService.cs` |
| `IMaintenanceReportAppService` | 13 | `ContabilidadLuxuryApp/MaintenanceReport/Interfaces/IMaintenanceReportAppService.cs` |
| `IPresupuestoContabilidadService` | 1 | `ContabilidadLuxuryApp/ContabilidadOnline/Interfaces/IPresupuestoContabilidadService.cs` |
| `IProjectedExpenseAppService` | 7 | `ContabilidadLuxuryApp/ProjectedExpenses/Interfaces/IProjectedExpenseAppService.cs` |
| `IProyectosAprobadosService` | 1 | `ContabilidadLuxuryApp/ContabilidadOnline/Interfaces/IProyectosAprobadosService.cs` |
| `IReportDefinitionService` | 6 | `ContabilidadLuxuryApp/DynamicReports/Interfaces/IReportDefinitionService.cs` |
| `IReporteFinancieroService` | 1 | `ContabilidadLuxuryApp/ContabilidadOnline/Interfaces/IReporteFinancieroService.cs` |
| `IValidacionCatalogoService` | 1 | `ContabilidadLuxuryApp/ContabilidadOnline/Interfaces/IValidacionCatalogoService.cs` |
| `LivePreviewEngineService` | 1 | `ContabilidadLuxuryApp/DynamicReports/Services/LivePreviewEngineService.cs` |
| `ReportExcelExportService` | 1 | `ContabilidadLuxuryApp/DynamicReports/Services/ReportExcelExportService.cs` |
| `ReportPdfExportService` | 1 | `ContabilidadLuxuryApp/DynamicReports/Services/ReportPdfExportService.cs` |

### Metodos por categoria

| Servicio | Metodo | Categoria | Retorno | Observaciones |
|---|---|---|---|---|
| BudgetProposalService | `GetBudgetProposalItemAsync` | GET_SINGLE | `Task<ApiResponseDTO<BudgetProposalItemDTO>>` | ⚠ Get sin ByXxx/All |
| CobranzaMigratorService | `RunSincronizacionCobranzaAsync` | SPECIAL | `Task<bool>` | ✓ |
| ContabilidadMigratorService | `RunMigrationAsync` | SPECIAL | `Task<bool>` | ✓ |
| ContabilidadOnlineLocalService | `GetDatosBasicosViaAspelApiAsync` | GET_SINGLE | `Task<AspelDatosCombinadosDTO>` | ⚠ Get sin ByXxx/All |
| ContabilidadOnlineLocalService | `GetDatosConsolidadosViaAspelApiAsync` | GET_SINGLE | `Task<AspelDatosCombinadosDTO>` | ⚠ Get sin ByXxx/All |
| ContabilidadOnlineLocalService | `GetDebugRawDataAsync` | GET_SINGLE | `Task<ApiResponseDTO<AspelDatosCombinadosDTO>>` | ⚠ Get sin ByXxx/All |
| ContabilidadOnlineLocalService | `GetRawDataViaAspelApiAsync` | GET_SINGLE | `Task<AspelRawResponseDTO>` | ⚠ Get sin ByXxx/All |
| FinancialReportAppService | `AuthorizeAsync` | SPECIAL | `Task<ApiResponseDTO<EstadoFinanciero>>` | ✓ |
| FinancialReportAppService | `CreatePeriodAsync` | CREATE | `Task<ApiResponseDTO<EstadoFinanciero>>` | ✓ |
| FinancialReportAppService | `DesauthorizeAsync` | OTHER | `Task<ApiResponseDTO<EstadoFinanciero>>` | ⚠ naming no CRUD estandar |
| FinancialReportAppService | `FirstOrDefaultAsync` | OTHER | `Task<ApiResponseDTO<EstadoFinanciero>>` | ⚠ naming no CRUD estandar |
| FinancialReportAppService | `ListAsync` | OTHER | `Task<ApiResponseDTO<List<FinancialReportListCustomerDTO>>>` | ⚠ naming no CRUD estandar |
| FinancialReportAppService | `PropietariosAsync` | OTHER | `Task<ApiResponseDTO<List<object>>>` | ⚠ naming no CRUD estandar |
| FinancialReportAppService | `ReporteEnvioAnualAsync` | OTHER | `Task<ApiResponseDTO<List<object>>>` | ⚠ naming no CRUD estandar |
| FinancialReportAppService | `ReporteEnvioMensualAsync` | OTHER | `Task<ApiResponseDTO<List<object>>>` | ⚠ naming no CRUD estandar |
| FinancialReportAppService | `SendAsync` | SPECIAL | `Task<ApiResponseDTO<EstadoFinanciero>>` | ✓ |
| FinancialReportAppService | `ToCustomerAsync` | OTHER | `Task<ApiResponseDTO<List<object>>>` | ⚠ naming no CRUD estandar |
| FinancialReportAppService | `UploadFileAsync` | SPECIAL | `Task<ApiResponseDTO<EstadoFinanciero>>` | ✓ |
| FormulaEvaluatorService | `Evaluate` | OTHER | `decimal?` | ⚠ naming no CRUD estandar |
| FormulaEvaluatorService | `Parse` | OTHER | `decimal` | ⚠ naming no CRUD estandar |
| IAccountCatalogService | `GetFlatAsync` | GET_LIST | `Task<ApiResponseDTO<List<AccountFlatItemDTO>>>` | ⚠ Get sin ByXxx/All |
| IAccountCatalogService | `GetTreeAsync` | GET_LIST | `Task<ApiResponseDTO<List<AccountTreeNodeDTO>>>` | ⚠ Get sin ByXxx/All |
| IAccountingCatalogAppService | `GetAllByCustomerIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<IEnumerable<GroupedAccountingCatalogDTO>>>` | ✓ |
| IAnalisisCobranzaOnlineService | `GetAnalisisCobranzaOnlineAsync` | GET_SINGLE | `Task<ApiResponseDTO<CobranzaOnlineAnalysisResponseDTO>>` | ⚠ Get sin ByXxx/All |
| IAnalisisCobranzaService | `GetAnalisisCobranzaAsync` | GET_SINGLE | `Task<ApiResponseDTO<AnalisisCobranzaDTO>>` | ⚠ Get sin ByXxx/All |
| IAspelCustomerEmpresaAppService | `CreateAsync` | CREATE | `Task<ApiResponseDTO<AspelCustomerEmpresaDTO>>` | ✓ |
| IAspelCustomerEmpresaAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IAspelCustomerEmpresaAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<IEnumerable<AspelCustomerEmpresaDTO>>>` | ✓ |
| IAspelCustomerEmpresaAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<AspelCustomerEmpresaDTO>>` | ✓ |
| IAspelFastReportQueryService | `GetLiveBalancesAsync` | GET_LIST | `Task<IEnumerable<AspelFastAccountBalanceDTO>>` | ⚠ Get sin ByXxx/All |
| IAspelMappingService | `GetEmpresaIdAsync` | GET_SINGLE | `Task<int?>` | ⚠ Get sin ByXxx/All |
| IAspelQuotationService | `FixedExpensesCatalogSelectAsync` | OTHER | `Task<ApiResponseDTO<object>>` | ⚠ naming no CRUD estandar |
| IAspelQuotationService | `GetAccountBudgetStatusAsync` | GET_LIST | `Task<PurchaseOrderBudgetForOrdenCompraDTO>` | ⚠ Get sin ByXxx/All |
| IAspelQuotationService | `GetAspelFullQuotation` | GET_SINGLE | `Task<ApiResponseDTO<AspelBudgetDTO>>` | ⚠ Get sin ByXxx/All |
| IAspelQuotationService | `GetAspelMirrorAsync` | GET_SINGLE | `Task<ApiResponseDTO<AspelBudgetDTO>>` | ⚠ Get sin ByXxx/All |
| IAspelQuotationService | `GetAspelQuotation` | GET_SINGLE | `Task<ApiResponseDTO<AspelBudgetDTO>>` | ⚠ Get sin ByXxx/All |
| IAspelQuotationService | `GetAspelQuotationSummaryAsync` | GET_SINGLE | `Task<ApiResponseDTO<AspelBudgetDTO>>` | ⚠ Get sin ByXxx/All |
| IAspelQuotationService | `GetMultipleAccountsBudgetStatusAsync` | GET_LIST | `Task<List<PurchaseOrderBudgetForOrdenCompraDTO>>` | ⚠ Get sin ByXxx/All |
| IAspelQuotationService | `ToPurchaseOrderSelectAsync` | OTHER | `Task<ApiResponseDTO<BudgetToPurchaseOrderDTO>>` | ⚠ naming no CRUD estandar |
| IAutitoriaCuentasAspelService | `GetComparativaAsync` | GET_SINGLE | `Task<ApiResponseDTO<AutitoriaCuentasAspelResponseDTO>>` | ⚠ Get sin ByXxx/All |
| IBancosInversionesService | `GetBancosInversionesAsync` | GET_LIST | `Task<ApiResponseDTO<BancosInversionesDTO>>` | ⚠ Get sin ByXxx/All |
| IBillingConfigAppService | `GetByCustomerIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<BillingConfigResponseDTO>>` | ✓ |
| IBillingConfigAppService | `UpsertAsync` | UPDATE | `Task<ApiResponseDTO<BillingConfigResponseDTO>>` | ✓ |
| IBudgetAccountRuleAppService | `CreateAsync` | CREATE | `Task<ApiResponseDTO<BudgetAccountRuleDataDTO>>` | ✓ |
| IBudgetAccountRuleAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IBudgetAccountRuleAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<IEnumerable<BudgetAccountRuleDataDTO>>>` | ✓ |
| IBudgetAccountRuleAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IBudgetProposalItemSupportService | `AddBudgetProposalItemSupportFilesAsync` | CREATE | `Task<ApiResponseDTO<BudgetProposalItemDTO>>` | ✓ |
| IBudgetProposalItemSupportService | `DeleteBudgetProposalItemSupportFileAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IBudgetProposalItemSupportService | `GetBudgetProposalItemWithSupportAsync` | GET_SINGLE | `Task<ApiResponseDTO<BudgetProposalItemSupportDetailsDTO>>` | ⚠ Get sin ByXxx/All |
| IBudgetProposalItemSupportService | `UpdateBudgetProposalItemSupportInfoAsync` | UPDATE | `Task<ApiResponseDTO<BudgetProposalItemDTO>>` | ✓ |
| IBudgetProposalService | `AddAccountsToProposalAsync` | CREATE | `Task<ApiResponseDTO<IEnumerable<BudgetProposalItemDTO>>>` | ✓ |
| IBudgetProposalService | `CreateProposalAsync` | CREATE | `Task<ApiResponseDTO<BudgetProposalDTO>>` | ✓ |
| IBudgetProposalService | `DeleteProposalItemAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IBudgetProposalService | `GetAvailableAspelAccountsAsync` | GET_LIST | `Task<ApiResponseDTO<IEnumerable<AvailableAccountDTO>>>` | ⚠ Get sin ByXxx/All |
| IBudgetProposalService | `GetFeeComparisonAsync` | GET_SINGLE | `Task<ApiResponseDTO<UniformFeeComparisonDTO>>` | ⚠ Get sin ByXxx/All |
| IBudgetProposalService | `GetFeeComparisonByIndivisoAsync` | GET_SINGLE | `Task<ApiResponseDTO<IndivisoFeeComparisonDTO>>` | ✓ |
| IBudgetProposalService | `GetItemHistoryAsync` | GET_LIST | `Task<ApiResponseDTO<IEnumerable<BudgetProposalItemHistoryDTO>>>` | ⚠ Get sin ByXxx/All |
| IBudgetProposalService | `GetProposalsAsync` | GET_LIST | `Task<ApiResponseDTO<BudgetProposalDTO>>` | ⚠ Get sin ByXxx/All |
| IBudgetProposalService | `UpdateProposalItemAsync` | UPDATE | `Task<ApiResponseDTO<BudgetProposalItemDTO>>` | ✓ |
| ICatalogoGastosFijosAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<CatalogoGastosFijosDTO>>` | ✓ |
| ICatalogoGastosFijosAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ICatalogoGastosFijosAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<IEnumerable<CatalogoGastosFijosDTO>>>` | ✓ |
| ICatalogoGastosFijosAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<CatalogoGastosFijosDTO>>` | ✓ |
| ICatalogoGastosFijosAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<CatalogoGastosFijosDTO>>` | ✓ |
| ICatalogoGastosFijosAppService | `ValidarCreateOrderAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| ICatalogoGastosFijosDetallesAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<FixedExpenseCatalogDetail>>` | ✓ |
| ICatalogoGastosFijosDetallesAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ICatalogoGastosFijosDetallesAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<IEnumerable<FixedExpenseCatalogDetail>>>` | ✓ |
| ICatalogoGastosFijosDetallesAppService | `GetAllCatalogoGastosFijosProductoDTOAsync` | GET_LIST | `Task<ApiResponseDTO<IEnumerable<CatalogoGastosFijosDetalleDTO>>>` | ✓ |
| ICatalogoGastosFijosDetallesAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<FixedExpenseCatalogDetail>>` | ✓ |
| ICatalogoGastosFijosDetallesAppService | `GetDetallesOrdenCompraFijosAsync` | GET_LIST | `Task<ApiResponseDTO<List<CatalogoGastosFijosDetallesDTO>>>` | ✓ |
| ICatalogoGastosFijosDetallesAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<FixedExpenseCatalogDetail>>` | ✓ |
| ICatalogoGastosFijosPresupuestoAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<CatalogPurchaseOrderBudgetDTO>>` | ✓ |
| ICatalogoGastosFijosPresupuestoAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ICatalogoGastosFijosPresupuestoAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<IEnumerable<CatalogPurchaseOrderBudgetDTO>>>` | ✓ |
| ICatalogoGastosFijosPresupuestoAppService | `GetByCatalogoGastosFijosIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<IEnumerable<CatalogPurchaseOrderBudgetDTO>>>` | ✓ |
| ICatalogoGastosFijosPresupuestoAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<CatalogPurchaseOrderBudgetDTO>>` | ✓ |
| ICatalogoGastosFijosPresupuestoAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<CatalogPurchaseOrderBudgetDTO>>` | ✓ |
| ICedulaExtraordinariaService | `GetCedulaExtraordinariaAsync` | GET_SINGLE | `Task<ApiResponseDTO<CedulaExtraordinariaDTO>>` | ⚠ Get sin ByXxx/All |
| ICedulaPresupuestalService | `GetCedulaPresupuestalAsync` | GET_SINGLE | `Task<ApiResponseDTO<FinancialStatementDTO>>` | ⚠ Get sin ByXxx/All |
| ICoiMapeoAppService | `ActualizarMapeoAsync` | OTHER | `Task<ActionResult<ApiResponseDTO<CoiMapeoAccountResponseDTO>>>` | ⚠ naming no CRUD estandar |
| ICoiMapeoAppService | `AutoMapeoAsync` | OTHER | `Task<ActionResult<ApiResponseDTO<int>>>` | ⚠ naming no CRUD estandar |
| ICoiMapeoAppService | `GetEstadoMapeoAsync` | GET_LIST | `Task<ActionResult<ApiResponseDTO<List<CoiMapeoAccountResponseDTO>>>>` | ⚠ Get sin ByXxx/All |
| ICoiMapeoAppService | `GetPropertiesDisponiblesAsync` | GET_LIST | `Task<ActionResult<ApiResponseDTO<List<CoiMapeoPropertyOptionDTO>>>>` | ⚠ Get sin ByXxx/All |
| IContabilidadMinutaAppService | `ListaMinutaAsync` | OTHER | `Task<ApiResponseDTO<List<MeetingContabilidadDTO>>>` | ⚠ naming no CRUD estandar |
| IContabilidadMinutaAppService | `ListaMinutaLegalAsync` | OTHER | `Task<ApiResponseDTO<List<MeetingContabilidadDTO>>>` | ⚠ naming no CRUD estandar |
| IContabilidadMinutaAppService | `ListaSeguimientosAsync` | OTHER | `Task<ApiResponseDTO<List<object>>>` | ⚠ naming no CRUD estandar |
| IContabilidadMinutaAppService | `PendientesAsync` | OTHER | `Task<ApiResponseDTO<List<MeetingPendientesDTO>>>` | ⚠ naming no CRUD estandar |
| IDynamicReportEngineService | `ExecuteAsync` | SPECIAL | `Task<ApiResponseDTO<ReportResultDTO>>` | ✓ |
| IDynamicReportEngineService | `GetAccountCatalogAsync` | GET_LIST | `Task<ApiResponseDTO<List<AccountFlatItemDTO>>>` | ⚠ Get sin ByXxx/All |
| IDynamicReportEngineService | `GetAccountTreeAsync` | GET_LIST | `Task<ApiResponseDTO<List<AccountTreeNodeDTO>>>` | ⚠ Get sin ByXxx/All |
| IEpfService | `GetBalanceSheetAsync` | GET_SINGLE | `Task<ApiResponseDTO<FinancialStatementDTO>>` | ⚠ Get sin ByXxx/All |
| IEpfService | `GetEpfAsync` | GET_SINGLE | `Task<ApiResponseDTO<EpfDTO>>` | ⚠ Get sin ByXxx/All |
| IEspejoAspelFullService | `GetEspejoAsync` | GET_SINGLE | `Task<ApiResponseDTO<EspejoAspelFullResponseDTO>>` | ⚠ Get sin ByXxx/All |
| IEstadoResultadosService | `GetEstadoResultadosAsync` | GET_LIST | `Task<ApiResponseDTO<FinancialStatementDTO>>` | ⚠ Get sin ByXxx/All |
| IFinancialReportAppServiceV1 | `AuthorizeAsync` | SPECIAL | `Task<ApiResponseDTO<EstadoFinanciero>>` | ✓ |
| IFinancialReportAppServiceV1 | `CreatePeriodAsync` | CREATE | `Task<ApiResponseDTO<EstadoFinanciero>>` | ✓ |
| IFinancialReportAppServiceV1 | `DesauthorizeAsync` | OTHER | `Task<ApiResponseDTO<EstadoFinanciero>>` | ⚠ naming no CRUD estandar |
| IFinancialReportAppServiceV1 | `FirstOrDefaultAsync` | OTHER | `Task<ApiResponseDTO<EstadoFinanciero>>` | ⚠ naming no CRUD estandar |
| IFinancialReportAppServiceV1 | `ListAsync` | OTHER | `Task<ApiResponseDTO<List<FinancialReportListCustomerDTO>>>` | ⚠ naming no CRUD estandar |
| IFinancialReportAppServiceV1 | `PropietariosAsync` | OTHER | `Task<ApiResponseDTO<List<object>>>` | ⚠ naming no CRUD estandar |
| IFinancialReportAppServiceV1 | `ReporteEnvioAnualAsync` | OTHER | `Task<ApiResponseDTO<List<object>>>` | ⚠ naming no CRUD estandar |
| IFinancialReportAppServiceV1 | `ReporteEnvioMensualAsync` | OTHER | `Task<ApiResponseDTO<List<object>>>` | ⚠ naming no CRUD estandar |
| IFinancialReportAppServiceV1 | `SendAsync` | SPECIAL | `Task<ApiResponseDTO<EstadoFinanciero>>` | ✓ |
| IFinancialReportAppServiceV1 | `ToCustomerAsync` | OTHER | `Task<ApiResponseDTO<List<object>>>` | ⚠ naming no CRUD estandar |
| IFinancialReportAppServiceV1 | `UploadFileAsync` | SPECIAL | `Task<ApiResponseDTO<EstadoFinanciero>>` | ✓ |
| IFlujoCajaService | `GetFlujoCajaAsync` | GET_SINGLE | `Task<ApiResponseDTO<FlujoCajaDTO>>` | ⚠ Get sin ByXxx/All |
| IFondoReservaService | `GetFondoReservaAsync` | GET_SINGLE | `Task<ApiResponseDTO<FondoReservaDTO>>` | ⚠ Get sin ByXxx/All |
| IFundingAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<FundingListDTO>>` | ✓ |
| IFundingAppService | `AnalyzeUploadedFilesAsync` | OTHER | `Task<List<AnalyzedInvoiceDTO>>` | ⚠ naming no CRUD estandar |
| IFundingAppService | `AuthorizeFundingAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| IFundingAppService | `CompleteFundingAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| IFundingAppService | `ConfirmFundingAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| IFundingAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IFundingAppService | `DeleteDetailAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IFundingAppService | `DetailsAsync` | OTHER | `Task<ApiResponseDTO<FundingDetailDTO>>` | ⚠ naming no CRUD estandar |
| IFundingAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<FundingListDTO[]>>` | ✓ |
| IFundingAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<FundingAddOrEditDTO>>` | ✓ |
| IFundingAppService | `GetPurchaseDetailAsync` | GET_SINGLE | `Task<ApiResponseDTO<PurchaseDetailAsyncDTO>>` | ⚠ Get sin ByXxx/All |
| IFundingAppService | `GetPurchaseHistoryAsync` | GET_SINGLE | `Task<ApiResponseDTO<PurchaseHistoryDTO[]>>` | ⚠ Get sin ByXxx/All |
| IFundingAppService | `InvalidateAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| IFundingAppService | `RevertCompleteFundingAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| IFundingAppService | `RevokeAuthorizationAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| IFundingAppService | `RevokeConfirmationAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| IFundingAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<FundingListDTO>>` | ✓ |
| IFundingAppService | `UpdateOrderAsync` | UPDATE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IFundingAppService | `UpdatePurchasePaidStatusAsync` | UPDATE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IFundingAppService | `ValidateFundingAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| IFundingAppService | `ValidateInvoiceAsync` | SPECIAL | `Task<ApiResponseDTO<ValidationResultDTO>>` | ✓ |
| ILivePreviewEngineService | `ComputeAsync` | OTHER | `Task<ApiResponseDTO<LivePreviewResultDTO>>` | ⚠ naming no CRUD estandar |
| IMaintenanceReportAppService | `BitacoraAlbercaParametrosAsync` | OTHER | `Task<ApiResponseDTO<List<ChartPiscinaDTO>>>` | ⚠ naming no CRUD estandar |
| IMaintenanceReportAppService | `BitacoradiariaAsync` | OTHER | `Task<ApiResponseDTO<object>>` | ⚠ naming no CRUD estandar |
| IMaintenanceReportAppService | `CargaTicket` | OTHER | `Task<ApiResponseDTO<object>>` | ⚠ naming no CRUD estandar |
| IMaintenanceReportAppService | `DataGraficoMensualAsync` | OTHER | `Task<ApiResponseDTO<List<MultiAxisPrimeChart>>>` | ⚠ naming no CRUD estandar |
| IMaintenanceReportAppService | `EntradaProductoAsync` | OTHER | `Task<ApiResponseDTO<object>>` | ⚠ naming no CRUD estandar |
| IMaintenanceReportAppService | `PrestamoHerramientaAsync` | OTHER | `Task<ApiResponseDTO<object>>` | ⚠ naming no CRUD estandar |
| IMaintenanceReportAppService | `ProveedorAsync` | OTHER | `Task<ApiResponseDTO<object>>` | ⚠ naming no CRUD estandar |
| IMaintenanceReportAppService | `ReportPurchaseAsync` | OTHER | `Task<ApiResponseDTO<object>>` | ⚠ naming no CRUD estandar |
| IMaintenanceReportAppService | `ResumenAsync` | SPECIAL | `Task<ApiResponseDTO<object>>` | ✓ |
| IMaintenanceReportAppService | `SalidaProductoAsync` | OTHER | `Task<ApiResponseDTO<object>>` | ⚠ naming no CRUD estandar |
| IMaintenanceReportAppService | `TicketAsync` | OTHER | `Task<ApiResponseDTO<object>>` | ⚠ naming no CRUD estandar |
| IMaintenanceReportAppService | `TicketResponsable` | OTHER | `Task<ApiResponseDTO<object>>` | ⚠ naming no CRUD estandar |
| IMaintenanceReportAppService | `WeeklyExecutiveReportAsync` | OTHER | `Task<ApiResponseDTO<MaintenanceWeeklyExecutiveReportDTO>>` | ⚠ naming no CRUD estandar |
| IPresupuestoContabilidadService | `GetPresupuestoContabilidadAsync` | GET_SINGLE | `Task<ApiResponseDTO<PresupuestoContabilidadDTO>>` | ⚠ Get sin ByXxx/All |
| IProjectedExpenseAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<ProjectedExpenseDTO>>` | ✓ |
| IProjectedExpenseAppService | `AddOrUpdateRecurrenceAsync` | CREATE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IProjectedExpenseAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IProjectedExpenseAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<IEnumerable<ProjectedExpenseDTO>>>` | ✓ |
| IProjectedExpenseAppService | `GetByAccountIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<IEnumerable<ProjectedExpenseDTO>>>` | ✓ |
| IProjectedExpenseAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<ProjectedExpenseDTO>>` | ✓ |
| IProjectedExpenseAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<ProjectedExpenseDTO>>` | ✓ |
| IProyectosAprobadosService | `GetProyectosAprobadosAsync` | GET_LIST | `Task<ApiResponseDTO<ProyectosAprobadosDTO>>` | ⚠ Get sin ByXxx/All |
| IReportDefinitionService | `CreateAsync` | CREATE | `Task<ApiResponseDTO<ReportDefinitionDTO>>` | ✓ |
| IReportDefinitionService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IReportDefinitionService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<List<ReportDefinitionListDTO>>>` | ✓ |
| IReportDefinitionService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<ReportDefinitionDTO>>` | ✓ |
| IReportDefinitionService | `GetTemplatesAsync` | GET_LIST | `Task<ApiResponseDTO<List<ReportDefinitionListDTO>>>` | ⚠ Get sin ByXxx/All |
| IReportDefinitionService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<ReportDefinitionDTO>>` | ✓ |
| IReporteFinancieroService | `GetReporteFinancieroAsync` | GET_SINGLE | `Task<ApiResponseDTO<ReporteFinancieroDTO>>` | ⚠ Get sin ByXxx/All |
| IValidacionCatalogoService | `GetCatalogValidationAsync` | GET_SINGLE | `Task<ApiResponseDTO<FinancialStatementDTO>>` | ⚠ Get sin ByXxx/All |
| LivePreviewEngineService | `Parse` | OTHER | `decimal` | ⚠ naming no CRUD estandar |
| ReportExcelExportService | `Export` | SPECIAL | `byte[]` | ✓ |
| ReportPdfExportService | `Export` | SPECIAL | `byte[]` | ✓ |

### Endpoints

| Verbo | Ruta | Handler | Categoria |
|---|---|---|---|
| GET | `api/accounting-catalog/customer/{customerId:guid}` | `GetAllByCustomerIdAsync` | GET_SINGLE |
| GET | `api/aspel-customer-empresa` | `GetAllAsync` | GET_LIST |
| POST | `api/aspel-customer-empresa` | `CreateAsync` | CREATE |
| DELETE | `api/aspel-customer-empresa/{id:guid}` | `DeleteAsync` | DELETE |
| PUT | `api/aspel-customer-empresa/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/autitoria-cuentas-aspel` | `GetComparativaAsync` | GET_LIST |
| POST | `api/budget-account-rules` | `CreateAsync` | CREATE |
| GET | `api/budget-account-rules/{customerId:guid}` | `GetAllAsync` | GET_SINGLE |
| DELETE | `api/budget-account-rules/{id:guid}` | `DeleteAsync` | DELETE |
| PUT | `api/budget-account-rules/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/budget-proposal` | `GetProposalsAsync` | GET_LIST |
| PUT | `api/budget-proposal/{itemId:guid}` | `UpdateProposalItemAsync` | UPDATE |
| POST | `api/budget-proposal/{proposalId:guid}/add-accounts` | `AddAccountsToProposalAsync` | CREATE |
| GET | `api/budget-proposal/{proposalId:guid}/fee-comparison` | `GetFeeComparisonAsync` | GET_SINGLE |
| GET | `api/budget-proposal/{proposalId:guid}/fee-comparison-by-indiviso` | `GetFeeComparisonByIndivisoAsync` | GET_SINGLE |
| POST | `api/budget-proposal/audit` | `GenerateBudgetAuditAsync` | CREATE |
| GET | `api/budget-proposal/available-accounts/{customerId:guid}/{fiscalYear:int}/{proposalId:guid}` | `GetAvailableAspelAccountsAsync` | GET_SINGLE |
| POST | `api/budget-proposal/forecast` | `GenerateBudgetForecastAsync` | CREATE |
| GET | `api/budget-proposal/history/{itemId:guid}` | `GetItemHistoryAsync` | GET_SINGLE |
| DELETE | `api/budget-proposal/item/{itemId:guid}` | `DeleteProposalItemAsync` | DELETE |
| GET | `api/budget-proposal-item-support/{itemId:guid}` | `GetBudgetProposalItemWithSupportAsync` | GET_SINGLE |
| PUT | `api/budget-proposal-item-support/{itemId:guid}/support-info` | `UpdateBudgetProposalItemSupportInfoAsync` | UPDATE |
| DELETE | `api/budget-proposal-item-support/support-file/{fileId:guid}` | `DeleteBudgetProposalItemSupportFileAsync` | DELETE |
| POST | `api/budget-proposal-item-support/support-files` | `AddBudgetProposalItemSupportFilesAsync` | CREATE |
| POST | `api/catalogo-gastos-fijos` | `AddAsync` | CREATE |
| PUT | `api/catalogo-gastos-fijos/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/catalogo-gastos-fijos/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| DELETE | `api/catalogo-gastos-fijos/{id:guid}` | `DeleteByIdAsync` | DELETE |
| GET | `api/catalogo-gastos-fijos/list/{customerId:guid}` | `GetAllAsync` | GET_SINGLE |
| GET | `api/catalogo-gastos-fijos/update-validation/{id:guid}/{value:bool}` | `ValidarCreateOrderAsync` | GET_SINGLE |
| POST | `api/catalogo-gastos-fijos-detalles` | `AddAsync` | CREATE |
| GET | `api/catalogo-gastos-fijos-detalles` | `GetAllAsync` | GET_LIST |
| PUT | `api/catalogo-gastos-fijos-detalles/{id:guid}` | `UpdateAsync` | UPDATE |
| DELETE | `api/catalogo-gastos-fijos-detalles/{id:guid}` | `DeleteByIdAsync` | DELETE |
| GET | `api/catalogo-gastos-fijos-detalles/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| GET | `api/catalogo-gastos-fijos-detalles/detalles-orden-compra-fijos/{catalogoGastosFijosId:guid}` | `GetDetallesOrdenCompraFijosAsync` | GET_SINGLE |
| GET | `api/catalogo-gastos-fijos-detalles/products/{catalogoGastosFijosId:guid}` | `GetAllCatalogoGastosFijosProductoDTOAsync` | GET_SINGLE |
| POST | `api/catalogo-gastos-fijos-presupuesto` | `AddAsync` | CREATE |
| DELETE | `api/catalogo-gastos-fijos-presupuesto/{id:guid}` | `DeleteByIdAsync` | DELETE |
| PUT | `api/catalogo-gastos-fijos-presupuesto/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/catalogo-gastos-fijos-presupuesto/presupuesto-orden-compra-fijos/{catalogoGastosFijosId:guid}` | `GetByCatalogoGastosFijosIdAsync` | GET_SINGLE |
| GET | `api/contabilidad-minuta/lista-minuta/{idAccount}/{status:int}` | `ListaMinutaAsync` | GET_SINGLE |
| GET | `api/contabilidad-minuta/lista-minuta-legal/{idAccount}/{status:int}` | `ListaMinutaLegalAsync` | GET_SINGLE |
| GET | `api/contabilidad-minuta/lista-seguimientos/{id:guid}` | `ListaSeguimientosAsync` | GET_SINGLE |
| GET | `api/contabilidad-minuta/pendientes/{areaResponsable}` | `PendientesAsync` | GET_LIST |
| GET | `api/contabilidad-online/analisis-cobranza/{customerId:guid}/{year:int}/{month:int}` | `GetAnalisisCobranzaAsync` | GET_SINGLE |
| GET | `api/contabilidad-online/analisis-cobranza-online/{customerId:guid}/{year:int}/{month:int}/{day:int}` | `GetAnalisisCobranzaOnlineAsync` | GET_SINGLE |
| POST | `api/contabilidad-online/ask-ai` | (inline) | CREATE |
| POST | `api/contabilidad-online/ask-ai-contabilidad-online` | (inline) | CREATE |
| GET | `api/contabilidad-online/bancos-inversiones/{customerId:guid}/{year:int}/{mes:int}` | `GetBancosInversionesAsync` | GET_SINGLE |
| GET | `api/contabilidad-online/cedula-extraordinaria/{customerId:guid}/{year:int}/{mes:int}` | `GetCedulaExtraordinariaAsync` | GET_SINGLE |
| GET | `api/contabilidad-online/cedula-presupuestal/{customerId:guid}/{year:int}/{mes:int}` | `GetCedulaPresupuestalAsync` | GET_SINGLE |
| GET | `api/contabilidad-online/estado-posicion-financiera/{customerId:guid}/{year:int}` | `GetBalanceSheetAsync` | GET_SINGLE |
| GET | `api/contabilidad-online/estado-posicion-financiera/{customerId:guid}/{year:int}/{mes:int}` | `GetEpfAsync` | GET_SINGLE |
| GET | `api/contabilidad-online/estado-resultados/{customerId:guid}/{year:int}/{mes:int}` | `GetEstadoResultadosAsync` | GET_SINGLE |
| GET | `api/contabilidad-online/estado-resultados-v2/{customerId:guid}/{year:int}/{mes:int}` | `GetCedulaExtraordinariaAsync` | GET_SINGLE |
| POST | `api/contabilidad-online/explain-ai-contabilidad-online` | (inline) | CREATE |
| GET | `api/contabilidad-online/flujo-caja/{customerId:guid}/{year:int}` | `GetFlujoCajaAsync` | GET_SINGLE |
| GET | `api/contabilidad-online/fondo-reserva/{customerId:guid}/{year:int}/{mes:int}` | `GetFondoReservaAsync` | GET_SINGLE |
| GET | `api/contabilidad-online/presupuesto-contabilidad/{customerId:guid}/{year:int}/{mes:int}` | `GetPresupuestoContabilidadAsync` | GET_SINGLE |
| GET | `api/contabilidad-online/proyectos-aprobados/{customerId:guid}/{year:int}` | `GetProyectosAprobadosAsync` | GET_SINGLE |
| GET | `api/contabilidad-online/reporte-financiero/{customerId:guid}/{year:int}/{mes:int}` | `GetReporteFinancieroAsync` | GET_SINGLE |
| GET | `api/contabilidad-online/validacion-catalogo/{customerId:guid}/{year:int}` | `GetCatalogValidationAsync` | GET_SINGLE |
| DELETE | `api/dynamic-reports/{id:guid}` | `Export` | DELETE |
| PUT | `api/dynamic-reports/{id:guid}` | `Export` | UPDATE |
| GET | `api/dynamic-reports/{id:guid}` | `Export` | GET_SINGLE |
| GET | `api/dynamic-reports/accounts/{customerId:guid}/{year:int}` | `Export` | GET_SINGLE |
| GET | `api/dynamic-reports/accounts/{customerId:guid}/{year:int}/tree` | `Export` | GET_SINGLE |
| GET | `api/dynamic-reports/customer/{customerId:guid}` | (inline) | GET_SINGLE |
| POST | `api/dynamic-reports/execute` | `Export` | SPECIAL |
| POST | `api/dynamic-reports/execute/excel` | `Export` | SPECIAL |
| POST | `api/dynamic-reports/execute/pdf` | `Export` | SPECIAL |
| POST | `api/dynamic-reports/live-preview` | `Export` | CREATE |
| GET | `api/dynamic-reports/templates` | `Export` | GET_LIST |
| GET | `api/espejo-aspel-full` | `GetEspejoAsync` | GET_LIST |
| GET | `api/financial-report/{id:guid}` | `FirstOrDefaultAsync` | GET_SINGLE |
| GET | `api/financial-report/authorize/{id:guid}/{applicationUserId}` | `AuthorizeAsync` | GET_SINGLE |
| POST | `api/financial-report/create-period` | `CreatePeriodAsync` | CREATE |
| GET | `api/financial-report/desauthorize/{id:guid}` | `DesauthorizeAsync` | GET_SINGLE |
| GET | `api/financial-report/list/{customerId:guid}` | `ListAsync` | GET_SINGLE |
| GET | `api/financial-report/propietarios/{customerId:guid}` | `PropietariosAsync` | GET_SINGLE |
| GET | `api/financial-report/reporte-envio-anual/{year:int}` | `ReporteEnvioAnualAsync` | GET_LIST |
| GET | `api/financial-report/reporteenviomensual/{periodo:datetime}` | `ReporteEnvioMensualAsync` | GET_LIST |
| POST | `api/financial-report/send/{id:guid}/{applicationUserId}` | `SendAsync` | SPECIAL |
| GET | `api/financial-report/to-customer/{customerId:guid}` | `ToCustomerAsync` | GET_SINGLE |
| POST | `api/financial-report/upload-file/{id:guid}/{applicationUserId}` | `UploadFileAsync` | SPECIAL |
| POST | `api/funding` | `AddAsync` | CREATE |
| PUT | `api/funding/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/funding/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| DELETE | `api/funding/{id:guid}` | `DeleteByIdAsync` | DELETE |
| POST | `api/funding/analyze-invoices/{customerId:guid}` | `AnalyzeUploadedFilesAsync` | CREATE |
| GET | `api/funding/authorize/{id:guid}` | `AuthorizeFundingAsync` | GET_SINGLE |
| GET | `api/funding/completed/{id:guid}` | `CompleteFundingAsync` | GET_SINGLE |
| GET | `api/funding/confirm/{id:guid}` | `ConfirmFundingAsync` | GET_SINGLE |
| POST | `api/funding/create-orders-from-invoices` | `CreateFromInvoicesAsync` | CREATE |
| DELETE | `api/funding/detail/{ordenCompraId:guid}` | `DeleteDetailAsync` | DELETE |
| GET | `api/funding/details/{id:guid}/{customerId:guid}` | `DetailsAsync` | GET_SINGLE |
| POST | `api/funding/download-bulk-invoices-zip` | `GenerateBulkInvoicesZipAsync` | SPECIAL |
| GET | `api/funding/list/{customerId:guid}` | `GetAllAsync` | GET_SINGLE |
| GET | `api/funding/purchase-details/{ordenCompraId:guid}` | `GetPurchaseDetailAsync` | GET_SINGLE |
| GET | `api/funding/purchase-history/{customerId:guid}/{fiscalYear}/{accountNumber}` | `GetPurchaseHistoryAsync` | GET_SINGLE |
| GET | `api/funding/revert-complete/{id:guid}` | `RevertCompleteFundingAsync` | GET_SINGLE |
| GET | `api/funding/revoke-confirmation/{id:guid}` | `RevokeConfirmationAsync` | GET_SINGLE |
| GET | `api/funding/unauthorize/{id:guid}` | `RevokeAuthorizationAsync` | GET_SINGLE |
| GET | `api/funding/unvalidate/{id:guid}` | `InvalidateAsync` | GET_SINGLE |
| PUT | `api/funding/update-order` | `UpdateOrderAsync` | UPDATE |
| PATCH | `api/funding/update-purchase-paid-status/{ordenCompraId:guid}` | `UpdatePurchasePaidStatusAsync` | UPDATE |
| GET | `api/funding/validate/{id:guid}` | `ValidateFundingAsync` | GET_SINGLE |
| POST | `api/funding/validate-invoice/{ordenCompraId:guid}` | `ValidateInvoiceAsync` | SPECIAL |
| GET | `api/funding-accounting/list/{customerId:guid}` | `GetAllAsync` | GET_SINGLE |
| POST | `api/funding-file/download-zip` | `GenerateBulkSolicitudesPagoZipAsync` | SPECIAL |
| GET | `api/maintenance-report/bitacoraalbercaparametros/{customerId:guid}/{periodo}` | `BitacoraAlbercaParametrosAsync` | GET_SINGLE |
| GET | `api/maintenance-report/bitacoradiaria/{customerId:guid}/{periodo}` | `BitacoradiariaAsync` | GET_SINGLE |
| GET | `api/maintenance-report/carga-ticket/{customerId:guid}/{periodo}` | `CargaTicket` | GET_SINGLE |
| GET | `api/maintenance-report/data-grafico-mensual/{customerId:guid}/{periodo}` | `DataGraficoMensualAsync` | GET_SINGLE |
| GET | `api/maintenance-report/entradaproducto/{customerId:guid}/{periodo}` | `EntradaProductoAsync` | GET_SINGLE |
| GET | `api/maintenance-report/presatamoherramienta/{customerId:guid}/{periodo}` | `PrestamoHerramientaAsync` | GET_SINGLE |
| GET | `api/maintenance-report/proveedor/{customerId:guid}/{periodo}` | `ProveedorAsync` | GET_SINGLE |
| GET | `api/maintenance-report/resumen/{customerId:guid}/{periodo}` | `ResumenAsync` | GET_SINGLE |
| GET | `api/maintenance-report/salidaproducto/{customerId:guid}/{periodo}` | `SalidaProductoAsync` | GET_SINGLE |
| GET | `api/maintenance-report/solicitudinsumos/{customerId:guid}/{periodo}` | `ReportPurchaseAsync` | GET_SINGLE |
| GET | `api/maintenance-report/ticket/{customerId:guid}/{periodo}` | `TicketAsync` | GET_SINGLE |
| GET | `api/maintenance-report/ticket-responsable/{customerId:guid}/{periodo}` | `TicketResponsable` | GET_SINGLE |
| POST | `api/maintenance-report/weekly-executive-report` | `WeeklyExecutiveReportAsync` | CREATE |
| POST | `api/presupuesto/analyze` | `GenerateFinancialSummaryAsync` | CREATE |
| GET | `api/presupuesto/aspel` | `GetAspelQuotation` | GET_LIST |
| GET | `api/presupuesto/aspel-full` | `GetAspelFullQuotation` | GET_LIST |
| GET | `api/presupuesto/aspel-summary` | `GetAspelQuotationSummaryAsync` | GET_LIST |
| GET | `api/presupuesto/fixed-expenses-catalog/{customerId:guid}/{year:int}` | `FixedExpensesCatalogSelectAsync` | GET_SINGLE |
| GET | `api/presupuesto/presupuesto-limpio-cobranza` | `GetAspelMirrorAsync` | GET_LIST |
| GET | `api/presupuesto/presupuesto-limpio-ejercicio-fiscal` | `GetAspelMirrorAsync` | GET_LIST |
| GET | `api/presupuesto/to-purchase-order/{customerId:guid}/{ordenCompraId:guid}/{year:int}` | `ToPurchaseOrderSelectAsync` | GET_SINGLE |
| POST | `api/projected-expenses` | `AddAsync` | CREATE |
| GET | `api/projected-expenses/{customerId:guid}` | `GetAllAsync` | GET_SINGLE |
| PUT | `api/projected-expenses/{customerId:guid}/{id:guid}` | `UpdateAsync` | UPDATE |
| DELETE | `api/projected-expenses/{customerId:guid}/{id:guid}` | `DeleteAsync` | DELETE |
| GET | `api/projected-expenses/{customerId:guid}/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| GET | `api/projected-expenses/by-account-id/{customerId:guid}/{month}/{accountNumber}` | `GetByAccountIdAsync` | GET_SINGLE |
| POST | `api/projected-expenses/recurrence` | `AddOrUpdateRecurrenceAsync` | CREATE |

## Modulo: DireccionLuxuryApp

Metodos: 3 | Endpoints HTTP: 2

### Servicios e interfaces

| Servicio/Interfaz | Metodos | Ubicacion |
|---|---|---|
| `IAsambleaChecklistAppService` | 2 | `DireccionLuxuryApp/JuntasMensuales/Asamblea/Checklist/Interfaces/IAsambleaChecklistAppService.cs` |
| `IAsambleaChecklistService` | 1 | `DireccionLuxuryApp/JuntasMensuales/Asamblea/Checklist/Interfaces/IAsambleaChecklistService.cs` |

### Metodos por categoria

| Servicio | Metodo | Categoria | Retorno | Observaciones |
|---|---|---|---|---|
| IAsambleaChecklistAppService | `GetBySessionIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<List<AsambleaChecklistExecutionDTO>>>` | ✓ |
| IAsambleaChecklistAppService | `UpdateStatusAsync` | UPDATE | `Task<ApiResponseDTO<AsambleaChecklistExecutionDTO>>` | ✓ |
| IAsambleaChecklistService | `EnsureChecklistForPlanAsync` | OTHER | `Task` | ⚠ naming no CRUD estandar |

### Endpoints

| Verbo | Ruta | Handler | Categoria |
|---|---|---|---|
| PUT | `api/asamblea-checklist/{executionId:guid}/status` | `UpdateStatusAsync` | UPDATE |
| GET | `api/asamblea-checklist/session/{sessionId:guid}` | `GetBySessionIdAsync` | GET_SINGLE |

## Modulo: LegalLuxuryApp

Metodos: 55 | Endpoints HTTP: 46

### Servicios e interfaces

| Servicio/Interfaz | Metodos | Ubicacion |
|---|---|---|
| `BoardDirectorsAppService` | 6 | `LegalLuxuryApp/Legal/BoardDirectors/Repositories/BoardDirectorsAppService.cs` |
| `IContractAddendumAppService` | 2 | `LegalLuxuryApp/EmployeeContracts/Interfaces/IContractAddendumAppService.cs` |
| `IContractRenewalAppService` | 5 | `LegalLuxuryApp/EmployeeContracts/Interfaces/IContractRenewalAppService.cs` |
| `IContratoPolizaAppService` | 8 | `LegalLuxuryApp/Legal/ContractPolicy/Interfaces/IContratoPolizaAppService.cs` |
| `IEmployeeContractGeneratorService` | 1 | `LegalLuxuryApp/EmployeeContracts/Interfaces/IEmployeeContractGeneratorService.cs` |
| `IEmployeeWorkContractAppService` | 8 | `LegalLuxuryApp/EmployeeContracts/Interfaces/IEmployeeWorkContractAppService.cs` |
| `ILegalEmployeeAppService` | 1 | `LegalLuxuryApp/Employees/ILegalEmployeeAppService.cs` |
| `ILegalMatterAppService` | 12 | `LegalLuxuryApp/Legal/LegalMatters/Interfaces/ILegalMatterAppService.cs` |
| `ILegalReportAppService` | 12 | `LegalLuxuryApp/Legal/LegalReport/Interfaces/ILegalReportAppService.cs` |

### Metodos por categoria

| Servicio | Metodo | Categoria | Retorno | Observaciones |
|---|---|---|---|---|
| BoardDirectorsAppService | `GetBoardDirectorsDocumentsAsync` | GET_LIST | `Task<ApiResponseDTO<List<BoardDirectorsDocumentDTO>>>` | ⚠ Get sin ByXxx/All |
| BoardDirectorsAppService | `GetBoardDirectorsFinancialReportsAsync` | GET_LIST | `Task<ApiResponseDTO<List<BoardDirectorsDocumentDTO>>>` | ⚠ Get sin ByXxx/All |
| BoardDirectorsAppService | `GetBoardDirectorsMeetingAsync` | GET_SINGLE | `Task<ApiResponseDTO<MeetingBoardDirectorsDTO>>` | ⚠ Get sin ByXxx/All |
| BoardDirectorsAppService | `GetBoardDirectorsMeetingMinutesAsync` | GET_LIST | `Task<ApiResponseDTO<List<BoardDirectorsDocumentDTO>>>` | ⚠ Get sin ByXxx/All |
| BoardDirectorsAppService | `GetBoardDirectorsMonthlyMeetingsAsync` | GET_LIST | `Task<ApiResponseDTO<List<BoardDirectorsDocumentDTO>>>` | ⚠ Get sin ByXxx/All |
| BoardDirectorsAppService | `GetCustomDocumentsByTypeAsync` | GET_LIST | `Task<ApiResponseDTO<List<BoardDirectorsDocumentDTO>>>` | ✓ |
| IContractAddendumAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<ContractAddendumListDTO[]>>` | ✓ |
| IContractAddendumAppService | `GetByContractAsync` | GET_SINGLE | `Task<ApiResponseDTO<ContractAddendumListDTO[]>>` | ✓ |
| IContractRenewalAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<ContractRenewalEvaluationDTO[]>>` | ✓ |
| IContractRenewalAppService | `GetByContractAsync` | GET_SINGLE | `Task<ApiResponseDTO<ContractRenewalEvaluationDTO[]>>` | ✓ |
| IContractRenewalAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<ContractRenewalEvaluationDTO>>` | ✓ |
| IContractRenewalAppService | `LinkPerformanceEvaluationAsync` | OTHER | `Task<ApiResponseDTO<ContractRenewalEvaluationDTO>>` | ⚠ naming no CRUD estandar |
| IContractRenewalAppService | `RegisterDecisionAsync` | CREATE | `Task<ApiResponseDTO<ContractRenewalEvaluationDTO>>` | ✓ |
| IContratoPolizaAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<ContratoPoliza>>` | ✓ |
| IContratoPolizaAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<ContratoPoliza>>` | ✓ |
| IContratoPolizaAppService | `DeleteDocumentAsync` | DELETE | `Task<ApiResponseDTO<ContratoPoliza>>` | ✓ |
| IContratoPolizaAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<IEnumerable<object>>>` | ✓ |
| IContratoPolizaAppService | `GetBuildingInsurancePolicyAsync` | GET_SINGLE | `Task<ApiResponseDTO<object>>` | ⚠ Get sin ByXxx/All |
| IContratoPolizaAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<object>>` | ✓ |
| IContratoPolizaAppService | `GetDocumentAsync` | GET_SINGLE | `Task<ApiResponseDTO<ContratoPoliza>>` | ⚠ Get sin ByXxx/All |
| IContratoPolizaAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<ContratoPoliza>>` | ✓ |
| IEmployeeContractGeneratorService | `GenerateContractOnConfirmedAsync` | SPECIAL | `Task<ApiResponseDTO<EmployeeWorkContractDTO>>` | ✓ |
| IEmployeeWorkContractAppService | `CreateAsync` | CREATE | `Task<ApiResponseDTO<EmployeeWorkContractDTO>>` | ✓ |
| IEmployeeWorkContractAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IEmployeeWorkContractAppService | `GetByCustomerAsync` | GET_SINGLE | `Task<ApiResponseDTO<EmployeeWorkContractDTO[]>>` | ✓ |
| IEmployeeWorkContractAppService | `GetByEmployeeAsync` | GET_SINGLE | `Task<ApiResponseDTO<EmployeeWorkContractDTO[]>>` | ✓ |
| IEmployeeWorkContractAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<EmployeeWorkContractDTO>>` | ✓ |
| IEmployeeWorkContractAppService | `TerminateAsync` | OTHER | `Task<ApiResponseDTO<EmployeeWorkContractDTO>>` | ⚠ naming no CRUD estandar |
| IEmployeeWorkContractAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<EmployeeWorkContractDTO>>` | ✓ |
| IEmployeeWorkContractAppService | `UploadSignedAsync` | SPECIAL | `Task<ApiResponseDTO<EmployeeWorkContractDTO>>` | ✓ |
| ILegalEmployeeAppService | `GetActiveEmployeesByCustomerAsync` | GET_SINGLE | `Task<ApiResponseDTO<LegalEmployeeDTO[]>>` | ✓ |
| ILegalMatterAppService | `CategoryPostAsync` | OTHER | `Task<ApiResponseDTO<LegalMatterCategory>>` | ⚠ naming no CRUD estandar |
| ILegalMatterAppService | `CategoryPutAsync` | OTHER | `Task<ApiResponseDTO<LegalMatterCategory>>` | ⚠ naming no CRUD estandar |
| ILegalMatterAppService | `CategorySelectAsync` | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>>` | ⚠ naming no CRUD estandar |
| ILegalMatterAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ILegalMatterAppService | `DeleteCategoryByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ILegalMatterAppService | `GetAsync` | GET_SINGLE | `Task<ApiResponseDTO<LegalMatterAddDTO>>` | ⚠ Get sin ByXxx/All |
| ILegalMatterAppService | `GetCategoriesAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>>` | ⚠ Get sin ByXxx/All |
| ILegalMatterAppService | `GetCategoryAsync` | GET_SINGLE | `Task<ApiResponseDTO<LegalMatterCategoryAddOrEditDTO>>` | ⚠ Get sin ByXxx/All |
| ILegalMatterAppService | `GetListAsync` | GET_LIST | `Task<ApiResponseDTO<List<LegalMatterCategoryWithMattersDTO>>>` | ✓ |
| ILegalMatterAppService | `GetSelectForAddTicketAsync` | GET_LIST | `Task<ApiResponseDTO<List<object>>>` | ⚠ Get sin ByXxx/All |
| ILegalMatterAppService | `PostAsync` | CREATE | `Task<ApiResponseDTO<LegalMatter>>` | ✓ |
| ILegalMatterAppService | `PutAsync` | UPDATE | `Task<ApiResponseDTO<object>>` | ✓ |
| ILegalReportAppService | `EstadosFinancierosAsync` | OTHER | `Task<ApiResponseDTO<object>>` | ⚠ naming no CRUD estandar |
| ILegalReportAppService | `GenerateWeeklyReportAsync` | SPECIAL | `Task<ApiResponseDTO<byte[]>>` | ✓ |
| ILegalReportAppService | `GetPendingMinutesAsync` | GET_LIST | `Task<ApiResponseDTO<object>>` | ⚠ Get sin ByXxx/All |
| ILegalReportAppService | `ObtenerResumenTickets` | OTHER | `Task<ApiResponseDTO<object>>` | ⚠ naming no CRUD estandar |
| ILegalReportAppService | `PendingAsync` | OTHER | `Task<ApiResponseDTO<IEnumerable<object>>>` | ⚠ naming no CRUD estandar |
| ILegalReportAppService | `PendingSummaryAsync` | OTHER | `Task<ApiResponseDTO<IEnumerable<object>>>` | ⚠ naming no CRUD estandar |
| ILegalReportAppService | `PendingUnassignedDataAsync` | OTHER | `Task<ApiResponseDTO<IEnumerable<object>>>` | ⚠ naming no CRUD estandar |
| ILegalReportAppService | `RequestsAttendedAsync` | OTHER | `Task<ApiResponseDTO<IEnumerable<object>>>` | ⚠ naming no CRUD estandar |
| ILegalReportAppService | `RequestsPendingAsync` | OTHER | `Task<ApiResponseDTO<IEnumerable<object>>>` | ⚠ naming no CRUD estandar |
| ILegalReportAppService | `SummaryCustomerAsync` | GET_SINGLE | `Task<ApiResponseDTO<IEnumerable<object>>>` | ✓ |
| ILegalReportAppService | `SummaryIndividualAsync` | GET_SINGLE | `Task<ApiResponseDTO<IEnumerable<object>>>` | ✓ |
| ILegalReportAppService | `TotalRequestsAsync` | GET_SINGLE | `Task<ApiResponseDTO<object>>` | ✓ |

### Endpoints

| Verbo | Ruta | Handler | Categoria |
|---|---|---|---|
| GET | `api/board-directors/document-by-type/{customerId:guid}/{documentType}` | `GetCustomDocumentsByTypeAsync` | GET_SINGLE |
| GET | `api/board-directors/documents/{customerId:guid}/{documentType}` | `GetBoardDirectorsDocumentsAsync` | GET_SINGLE |
| GET | `api/board-directors/financial-reports/{customerId:guid}` | `GetBoardDirectorsFinancialReportsAsync` | GET_SINGLE |
| GET | `api/board-directors/meeting-minutes/{customerId:guid}` | `GetBoardDirectorsMeetingMinutesAsync` | GET_SINGLE |
| GET | `api/board-directors/meeting-minutes-detail/{meetingId:guid}` | `GetBoardDirectorsMeetingAsync` | GET_SINGLE |
| GET | `api/board-directors/monthly-meetings/{customerId:guid}` | `GetBoardDirectorsMonthlyMeetingsAsync` | GET_SINGLE |
| GET | `api/hr/contract-addendums` | `GetAllAsync` | GET_LIST |
| GET | `api/hr/contract-addendums/by-contract/{employeeWorkContractId:guid}` | `GetByContractAsync` | GET_SINGLE |
| POST | `api/hr/employee-work-contracts` | `CreateAsync` | CREATE |
| PUT | `api/hr/employee-work-contracts/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/hr/employee-work-contracts/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| DELETE | `api/hr/employee-work-contracts/{id:guid}` | `DeleteAsync` | DELETE |
| POST | `api/hr/employee-work-contracts/{id:guid}/terminate` | `TerminateAsync` | CREATE |
| POST | `api/hr/employee-work-contracts/{id:guid}/upload-signed` | `UploadSignedAsync` | SPECIAL |
| GET | `api/hr/employee-work-contracts/by-employee/{employeeId:guid}` | `GetByEmployeeAsync` | GET_SINGLE |
| GET | `api/hr/employee-work-contracts/customer/{customerId:guid}` | `GetByCustomerAsync` | GET_SINGLE |
| GET | `api/legal/employees/customer/{customerId:guid}` | `GetActiveEmployeesByCustomerAsync` | GET_SINGLE |
| GET | `api/legal-directories/committees` | `GetAllCommitteesAsync` | GET_LIST |
| POST | `api/legal-matter` | `AddAsync` | CREATE |
| GET | `api/legal-matter` | `GetListLegalMatter` | GET_LIST |
| DELETE | `api/legal-matter/{id:guid}` | `DeleteByIdAsync` | DELETE |
| PUT | `api/legal-matter/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/legal-matter/{id:guid}` | `GetlegalMatterAddDTOAsync` | GET_SINGLE |
| POST | `api/legal-matter/category` | `CreateCategoryAsync` | CREATE |
| DELETE | `api/legal-matter/category/{id:guid}` | `DeleteCategoryByIdAsync` | DELETE |
| GET | `api/legal-matter/category/{id:guid}` | `CategoryAsync` | GET_SINGLE |
| PUT | `api/legal-matter/category/{id:guid}` | `UpdateCategoryAsync` | UPDATE |
| GET | `api/legal-minuta/lista-minuta` | `GetMeetingLegalDTOAsync` | GET_LIST |
| GET | `api/legal-report/generate-weekly-report/{customerId}/{startDate}/{endDate}/{isInternal}` | `GenerateWeeklyReportAsync` | GET_SINGLE |
| GET | `api/legal-report/pending/{typePerson}` | `PendingAsync` | GET_LIST |
| GET | `api/legal-report/pending-unassigned-data` | `PendingUnassignedDataAsync` | GET_LIST |
| GET | `api/legal-report/requests-attended/{startDate}/{endDate}/{isInternal}` | `RequestsAttendedAsync` | GET_LIST |
| GET | `api/legal-report/requests-pending/{isInternal}` | `RequestsPendingAsync` | GET_LIST |
| GET | `api/legal-report/results/{startDate}/{endDate}/{isInternal}` | `ObtenerResumenTickets` | GET_LIST |
| GET | `api/legal-report/summary/{startDate}/{endDate}` | `PendingSummaryAsync` | GET_LIST |
| GET | `api/legal-report/summary-customer/{startDate}/{endDate}` | `SummaryCustomerAsync` | GET_LIST |
| GET | `api/legal-report/summary-individual/{startDate}/{endDate}` | `SummaryIndividualAsync` | GET_LIST |
| GET | `api/legal-report/total-requests/{startDate}/{endDate}` | `TotalRequestsAsync` | GET_LIST |
| POST | `api/policy-contract` | `AddAsync` | CREATE |
| PUT | `api/policy-contract/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/policy-contract/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| DELETE | `api/policy-contract/{id:guid}` | `DeleteAsync` | DELETE |
| GET | `api/policy-contract/building-insurance/{customerId:guid}` | `GetBuildingInsurancePolicyAsync` | GET_SINGLE |
| DELETE | `api/policy-contract/delete-document/{id:guid}` | `DeleteDocumentAsync` | DELETE |
| GET | `api/policy-contract/get-document/{id:int}` | `GetDocumentAsync` | GET_SINGLE |
| GET | `api/policy-contract/list/{customerId:guid}/{isCurrent:bool}` | `GetAllAsync` | GET_SINGLE |

## Modulo: MantenimientoLuxuryApp

Metodos: 200 | Endpoints HTTP: 201

### Servicios e interfaces

| Servicio/Interfaz | Metodos | Ubicacion |
|---|---|---|
| `IBitacoraDetectorHumoAppService` | 4 | `MantenimientoLuxuryApp/SmokeDetectorLog/Interfaces/IBitacoraDetectorHumoAppService.cs` |
| `IBitacoraEstacionManualAppService` | 4 | `MantenimientoLuxuryApp/ManualCallPointLog/Interfaces/IBitacoraEstacionManualAppService.cs` |
| `IBitacoraExtintorAppService` | 4 | `MantenimientoLuxuryApp/FireExtinguisherLog/Interfaces/IBitacoraExtintorAppService.cs` |
| `IBitacoraHidranteAppService` | 4 | `MantenimientoLuxuryApp/HydrantLog/Interfaces/IBitacoraHidranteAppService.cs` |
| `IBitacoraMantenimientoAppService` | 6 | `MantenimientoLuxuryApp/MaintenanceLogs/Interfaces/IBitacoraMantenimientoAppService.cs` |
| `ICalendarioMaestroAppService` | 5 | `MantenimientoLuxuryApp/CalendariosMaestro/Interfaces/ICalendarioMaestroAppService.cs` |
| `ICalendarioMaestroEquipoAppService` | 5 | `MantenimientoLuxuryApp/CalendariosMaestroEquipo/Interfaces/ICalendarioMaestroEquipoAppService.cs` |
| `IControlPrestamoHerramientaAppService` | 5 | `MantenimientoLuxuryApp/Machinery/Interfaces/IControlPrestamoHerramientaAppService.cs` |
| `IElevatorsEmergencyCallAppService` | 6 | `MantenimientoLuxuryApp/ElevatorEmergencyCall/Interfaces/IElevatorsEmergencyCallAppService.cs` |
| `IElevatorSparePartsChangeAppService` | 6 | `MantenimientoLuxuryApp/ElevatorSpareParts/Interfaces/IElevatorSparePartsChangeAppService.cs` |
| `IEquipmentInspectionDefinitionAppService` | 6 | `MantenimientoLuxuryApp/EquipmentInspections/Interfaces/IEquipmentInspectionDefinitionAppService.cs` |
| `IEquipmentInspectionExecutionAppService` | 7 | `MantenimientoLuxuryApp/EquipmentInspections/Interfaces/IEquipmentInspectionExecutionAppService.cs` |
| `IEquipmentQrLabelAppService` | 7 | `MantenimientoLuxuryApp/EquipmentInspections/Interfaces/IEquipmentQrLabelAppService.cs` |
| `IEquipoClasificacionAppService` | 5 | `MantenimientoLuxuryApp/Machinery/Interfaces/IEquipoClasificacionAppService.cs` |
| `IFireCycleInspectionAppService` | 8 | `MantenimientoLuxuryApp/FireInspectionPeriods/Interfaces/IFireCycleInspectionAppService.cs` |
| `IFireInspectionCycleAppService` | 4 | `MantenimientoLuxuryApp/FireInspectionPeriods/Interfaces/IFireInspectionCycleAppService.cs` |
| `IFireInspectionPeriodAppService` | 5 | `MantenimientoLuxuryApp/FireInspectionPeriods/Interfaces/IFireInspectionPeriodAppService.cs` |
| `IFireInspectionPeriodItemsAppService` | 12 | `MantenimientoLuxuryApp/FireInspectionPeriods/Interfaces/IFireInspectionPeriodItemsAppService.cs` |
| `IInventarioDetectorHumoAppService` | 7 | `MantenimientoLuxuryApp/SmokeDetectorInventory/Interfaces/IInventarioDetectorHumoAppService.cs` |
| `IInventarioEstacionManualAppService` | 7 | `MantenimientoLuxuryApp/ManualCallPointInventory/Interfaces/IInventarioEstacionManualAppService.cs` |
| `IInventarioExtintorAppService` | 6 | `MantenimientoLuxuryApp/FireExtinguisherInventory/Interfaces/IInventarioExtintorAppService.cs` |
| `IInventarioHidranteAppService` | 5 | `MantenimientoLuxuryApp/HydrantInventory/Interfaces/IInventarioHidranteAppService.cs` |
| `IMachineryAppService` | 18 | `MantenimientoLuxuryApp/Machinery/Interfaces/IMachineryAppService.cs` |
| `IMachineryAssetAppService` | 1 | `MantenimientoLuxuryApp/MachineryAsset/Interfaces/IMachineryAssetAppService.cs` |
| `IMachineryDocumentAppService` | 1 | `MantenimientoLuxuryApp/MachineryDocument/Interfaces/IMachineryDocumentAppService.cs` |
| `IMaintenanceCalendarAppService` | 14 | `MantenimientoLuxuryApp/MaintenanceCalendars/Interfaces/IMaintenanceCalendarAppService.cs` |
| `IMedidorAppService` | 6 | `MantenimientoLuxuryApp/Medidores/Interfaces/IMedidorAppService.cs` |
| `IMedidorCategoriaAppService` | 5 | `MantenimientoLuxuryApp/Medidores/Interfaces/IMedidorCategoriaAppService.cs` |
| `IMedidorLecturaAppService` | 10 | `MantenimientoLuxuryApp/Medidores/Interfaces/IMedidorLecturaAppService.cs` |
| `IPiscinaAppService` | 5 | `MantenimientoLuxuryApp/Piscinas/Interfaces/IPiscinaAppService.cs` |
| `IPiscinaBitacoraAppService` | 7 | `MantenimientoLuxuryApp/PiscinasBitacora/Interfaces/IPiscinaBitacoraAppService.cs` |
| `IRecepcionPipasAguaAppService` | 5 | `MantenimientoLuxuryApp/RecepcionPipasAgua/Interfaces/IRecepcionPipasAguaAppService.cs` |

### Metodos por categoria

| Servicio | Metodo | Categoria | Retorno | Observaciones |
|---|---|---|---|---|
| IBitacoraDetectorHumoAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<BitacoraDetectorHumo>>` | ✓ |
| IBitacoraDetectorHumoAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IBitacoraDetectorHumoAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<BitacoraDetectorHumoDTO[]>>` | ✓ |
| IBitacoraDetectorHumoAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<BitacoraDetectorHumoAddOrEditDTO>>` | ✓ |
| IBitacoraEstacionManualAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<BitacoraEstacionManual>>` | ✓ |
| IBitacoraEstacionManualAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IBitacoraEstacionManualAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<BitacoraEstacionManualDTO[]>>` | ✓ |
| IBitacoraEstacionManualAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<BitacoraEstacionManualAddOrEditDTO>>` | ✓ |
| IBitacoraExtintorAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<BitacoraExtintor>>` | ✓ |
| IBitacoraExtintorAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IBitacoraExtintorAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<BitacoraExtintorDTO[]>>` | ✓ |
| IBitacoraExtintorAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<BitacoraExtintorAddOrEditDTO>>` | ✓ |
| IBitacoraHidranteAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<BitacoraHidrante>>` | ✓ |
| IBitacoraHidranteAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IBitacoraHidranteAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<BitacoraHidranteDTO[]>>` | ✓ |
| IBitacoraHidranteAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<BitacoraHidranteAddOrEditDTO>>` | ✓ |
| IBitacoraMantenimientoAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<MaintenanceLog>>` | ✓ |
| IBitacoraMantenimientoAppService | `BitacoraDashboardAsync` | OTHER | `Task<ApiResponseDTO<List<BitacoraMantenimientoDashboardDTO>>>` | ⚠ naming no CRUD estandar |
| IBitacoraMantenimientoAppService | `BitacoraIndividualAsync` | OTHER | `Task<ApiResponseDTO<List<BitacoraMantenimientoDTO>>>` | ⚠ naming no CRUD estandar |
| IBitacoraMantenimientoAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IBitacoraMantenimientoAppService | `FindByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<BitacoraMantenimientoDTO>>` | ✓ |
| IBitacoraMantenimientoAppService | `GetAllBitacoraMantenimientoDTO` | GET_LIST | `Task<ApiResponseDTO<List<BitacoraMantenimientoDTO>>>` | ✓ |
| ICalendarioMaestroAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<MasterCalendar>>` | ✓ |
| ICalendarioMaestroAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<int>>` | ✓ |
| ICalendarioMaestroAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<object>>` | ✓ |
| ICalendarioMaestroAppService | `GetAsyncByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<CalendarioMaestroAddOrEditDTO>>` | ✓ |
| ICalendarioMaestroAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<MasterCalendar>>` | ✓ |
| ICalendarioMaestroEquipoAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<MasterCalendarEquipment>>` | ✓ |
| ICalendarioMaestroEquipoAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ICalendarioMaestroEquipoAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<CalendarioMaestroEquipoDTO[]>>` | ✓ |
| ICalendarioMaestroEquipoAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<CalendarioMaestroEquipoDTO>>` | ✓ |
| ICalendarioMaestroEquipoAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<MasterCalendarEquipment>>` | ✓ |
| IControlPrestamoHerramientaAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<ToolLoan>>` | ✓ |
| IControlPrestamoHerramientaAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IControlPrestamoHerramientaAppService | `GetAllIndexDTO` | GET_LIST | `Task<ApiResponseDTO<ControlPrestamoHerramientaPagedListDTO>>` | ✓ |
| IControlPrestamoHerramientaAppService | `GetById` | GET_SINGLE | `Task<ApiResponseDTO<ControlPrestamoHerramientaDTO>>` | ✓ |
| IControlPrestamoHerramientaAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<ToolLoan>>` | ✓ |
| IElevatorsEmergencyCallAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<ElevatorsEmergencyCallDTO>>` | ✓ |
| IElevatorsEmergencyCallAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IElevatorsEmergencyCallAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<List<ElevatorsEmergencyCallDTO>>>` | ✓ |
| IElevatorsEmergencyCallAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<ElevatorsEmergencyCallAddOrEditDTO>>` | ✓ |
| IElevatorsEmergencyCallAppService | `GetElevatorsAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>>` | ⚠ Get sin ByXxx/All |
| IElevatorsEmergencyCallAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<ElevatorsEmergencyCallDTO>>` | ✓ |
| IElevatorSparePartsChangeAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<ElevatorSparePartsChangeDTO>>` | ✓ |
| IElevatorSparePartsChangeAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IElevatorSparePartsChangeAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<List<ElevatorSparePartsChangeDTO>>>` | ✓ |
| IElevatorSparePartsChangeAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<ElevatorSparePartsChangeAddOrEditDTO>>` | ✓ |
| IElevatorSparePartsChangeAppService | `GetElevatorsAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>>` | ⚠ Get sin ByXxx/All |
| IElevatorSparePartsChangeAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<ElevatorSparePartsChangeDTO>>` | ✓ |
| IEquipmentInspectionDefinitionAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<EquipmentInspectionDefinitionDTO>>` | ✓ |
| IEquipmentInspectionDefinitionAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IEquipmentInspectionDefinitionAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<EquipmentInspectionDefinitionDTO>>` | ✓ |
| IEquipmentInspectionDefinitionAppService | `GetByMachineryAsync` | GET_LIST | `Task<ApiResponseDTO<List<EquipmentInspectionDefinitionListDTO>>>` | ✓ |
| IEquipmentInspectionDefinitionAppService | `ToggleActiveAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| IEquipmentInspectionDefinitionAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<EquipmentInspectionDefinitionDTO>>` | ✓ |
| IEquipmentInspectionExecutionAppService | `AdministrativeUpdateAsync` | OTHER | `Task<ApiResponseDTO<EquipmentInspectionExecutionDetailDTO>>` | ⚠ naming no CRUD estandar |
| IEquipmentInspectionExecutionAppService | `CompleteAsync` | SPECIAL | `Task<ApiResponseDTO<EquipmentInspectionExecutionDetailDTO>>` | ✓ |
| IEquipmentInspectionExecutionAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<EquipmentInspectionExecutionDetailDTO>>` | ✓ |
| IEquipmentInspectionExecutionAppService | `GetByMachineryAsync` | GET_LIST | `Task<ApiResponseDTO<List<EquipmentInspectionExecutionListDTO>>>` | ✓ |
| IEquipmentInspectionExecutionAppService | `GetPendingAsync` | GET_LIST | `Task<ApiResponseDTO<List<EquipmentInspectionExecutionListDTO>>>` | ⚠ Get sin ByXxx/All |
| IEquipmentInspectionExecutionAppService | `StartFromQrAsync` | OTHER | `Task<ApiResponseDTO<EquipmentInspectionExecutionDetailDTO>>` | ⚠ naming no CRUD estandar |
| IEquipmentInspectionExecutionAppService | `StartManualAsync` | OTHER | `Task<ApiResponseDTO<EquipmentInspectionExecutionDetailDTO>>` | ⚠ naming no CRUD estandar |
| IEquipmentQrLabelAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<EquipmentQrLabelDTO>>` | ✓ |
| IEquipmentQrLabelAppService | `DownloadAsync` | SPECIAL | `Task<ApiResponseDTO<EquipmentQrDownloadItemDTO>>` | ✓ |
| IEquipmentQrLabelAppService | `DownloadBatchAsync` | SPECIAL | `Task<ApiResponseDTO<List<EquipmentQrDownloadItemDTO>>>` | ✓ |
| IEquipmentQrLabelAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<EquipmentQrLabelDTO>>` | ✓ |
| IEquipmentQrLabelAppService | `GetByMachineryAsync` | GET_LIST | `Task<ApiResponseDTO<List<EquipmentQrLabelListDTO>>>` | ✓ |
| IEquipmentQrLabelAppService | `RegenerateAsync` | OTHER | `Task<ApiResponseDTO<EquipmentQrLabelDTO>>` | ⚠ naming no CRUD estandar |
| IEquipmentQrLabelAppService | `ResolveAsync` | OTHER | `Task<ApiResponseDTO<EquipmentQrResolveDTO>>` | ⚠ naming no CRUD estandar |
| IEquipoClasificacionAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<EquipoClasificacionDTO>>` | ✓ |
| IEquipoClasificacionAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IEquipoClasificacionAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<EquipoClasificacionDTO[]>>` | ✓ |
| IEquipoClasificacionAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<EquipoClasificacionDTO>>` | ✓ |
| IEquipoClasificacionAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<EquipoClasificacionDTO>>` | ✓ |
| IFireCycleInspectionAppService | `GetDetectorAsync` | GET_SINGLE | `Task<ApiResponseDTO<FireCycleInspectionDetectorAddOrEditDTO?>>` | ⚠ Get sin ByXxx/All |
| IFireCycleInspectionAppService | `GetEstacionAsync` | GET_SINGLE | `Task<ApiResponseDTO<FireCycleInspectionEstacionAddOrEditDTO?>>` | ⚠ Get sin ByXxx/All |
| IFireCycleInspectionAppService | `GetExtintorAsync` | GET_SINGLE | `Task<ApiResponseDTO<FireCycleInspectionExtintorAddOrEditDTO?>>` | ⚠ Get sin ByXxx/All |
| IFireCycleInspectionAppService | `GetHidranteAsync` | GET_SINGLE | `Task<ApiResponseDTO<FireCycleInspectionHidranteAddOrEditDTO?>>` | ⚠ Get sin ByXxx/All |
| IFireCycleInspectionAppService | `UpsertDetectorAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| IFireCycleInspectionAppService | `UpsertEstacionAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| IFireCycleInspectionAppService | `UpsertExtintorAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| IFireCycleInspectionAppService | `UpsertHidranteAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| IFireInspectionCycleAppService | `GenerateCycleForPeriodAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| IFireInspectionCycleAppService | `GetActiveByPeriodAsync` | GET_SINGLE | `Task<ApiResponseDTO<FireInspectionCycleDetailDTO>>` | ✓ |
| IFireInspectionCycleAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<FireInspectionCycleDTO[]>>` | ✓ |
| IFireInspectionCycleAppService | `GetDetailAsync` | GET_SINGLE | `Task<ApiResponseDTO<FireInspectionCycleDetailDTO>>` | ⚠ Get sin ByXxx/All |
| IFireInspectionPeriodAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<FireInspectionPeriod>>` | ✓ |
| IFireInspectionPeriodAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IFireInspectionPeriodAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<FireInspectionPeriodDTO[]>>` | ✓ |
| IFireInspectionPeriodAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<FireInspectionPeriodAddOrEditDTO>>` | ✓ |
| IFireInspectionPeriodAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IFireInspectionPeriodItemsAppService | `AddDetectorAsync` | CREATE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IFireInspectionPeriodItemsAppService | `AddEstacionAsync` | CREATE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IFireInspectionPeriodItemsAppService | `AddExtintorAsync` | CREATE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IFireInspectionPeriodItemsAppService | `AddHidranteAsync` | CREATE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IFireInspectionPeriodItemsAppService | `GetDetectoresAsync` | GET_LIST | `Task<ApiResponseDTO<object[]>>` | ⚠ Get sin ByXxx/All |
| IFireInspectionPeriodItemsAppService | `GetEstacionesAsync` | GET_LIST | `Task<ApiResponseDTO<object[]>>` | ⚠ Get sin ByXxx/All |
| IFireInspectionPeriodItemsAppService | `GetExtintoresAsync` | GET_LIST | `Task<ApiResponseDTO<object[]>>` | ⚠ Get sin ByXxx/All |
| IFireInspectionPeriodItemsAppService | `GetHidrantesAsync` | GET_LIST | `Task<ApiResponseDTO<object[]>>` | ⚠ Get sin ByXxx/All |
| IFireInspectionPeriodItemsAppService | `RemoveDetectorAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IFireInspectionPeriodItemsAppService | `RemoveEstacionAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IFireInspectionPeriodItemsAppService | `RemoveExtintorAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IFireInspectionPeriodItemsAppService | `RemoveHidranteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IInventarioDetectorHumoAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<InventarioDetectorHumo>>` | ✓ |
| IInventarioDetectorHumoAppService | `DeleteAllByCustomerAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IInventarioDetectorHumoAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IInventarioDetectorHumoAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<InventarioDetectorHumoDTO[]>>` | ✓ |
| IInventarioDetectorHumoAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<InventarioDetectorHumoAddOrEditDTO>>` | ✓ |
| IInventarioDetectorHumoAppService | `ImportFromExcelAsync` | SPECIAL | `Task<ImportPropertiesResultDTO>` | ✓ |
| IInventarioDetectorHumoAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<InventarioDetectorHumo>>` | ✓ |
| IInventarioEstacionManualAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<InventarioEstacionManual>>` | ✓ |
| IInventarioEstacionManualAppService | `DeleteAllByCustomerAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IInventarioEstacionManualAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IInventarioEstacionManualAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<InventarioEstacionManualDTO[]>>` | ✓ |
| IInventarioEstacionManualAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<InventarioEstacionManualAddOrEditDTO>>` | ✓ |
| IInventarioEstacionManualAppService | `ImportFromExcelAsync` | SPECIAL | `Task<ImportPropertiesResultDTO>` | ✓ |
| IInventarioEstacionManualAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<InventarioEstacionManual>>` | ✓ |
| IInventarioExtintorAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<InventarioExtintor>>` | ✓ |
| IInventarioExtintorAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IInventarioExtintorAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<InventarioExtintorDTO[]>>` | ✓ |
| IInventarioExtintorAppService | `GetAllGroupAsync` | GET_LIST | `Task<ApiResponseDTO<object>>` | ✓ |
| IInventarioExtintorAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<InventarioExtintorAddOrEditDTO>>` | ✓ |
| IInventarioExtintorAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<InventarioExtintor>>` | ✓ |
| IInventarioHidranteAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<InventarioHidrante>>` | ✓ |
| IInventarioHidranteAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IInventarioHidranteAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<InventarioHidranteDTO[]>>` | ✓ |
| IInventarioHidranteAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<InventarioHidranteAddOrEditDTO>>` | ✓ |
| IInventarioHidranteAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<InventarioHidrante>>` | ✓ |
| IMachineryAppService | `ActasEntregaAsync` | OTHER | `Task<ApiResponseDTO<object>>` | ⚠ naming no CRUD estandar |
| IMachineryAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<Equipment>>` | ✓ |
| IMachineryAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<Equipment>>` | ✓ |
| IMachineryAppService | `DeleteDocumentAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IMachineryAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<object>>` | ✓ |
| IMachineryAppService | `GetAllCardAsync` | GET_LIST | `Task<ApiResponseDTO<object>>` | ✓ |
| IMachineryAppService | `GetAllMachineryDetailAsync` | GET_LIST | `Task<ApiResponseDTO<MachineryDetailDTO[]>>` | ✓ |
| IMachineryAppService | `GetAutocompeteInvAsync` | GET_SINGLE | `Task<ApiResponseDTO<object>>` | ⚠ Get sin ByXxx/All |
| IMachineryAppService | `GetById` | GET_SINGLE | `Task<ApiResponseDTO<MachineryDTO>>` | ✓ |
| IMachineryAppService | `GetFichaTecnica` | GET_SINGLE | `Task<ApiResponseDTO<MachineryFichaTecnicaDTO>>` | ⚠ Get sin ByXxx/All |
| IMachineryAppService | `GetListServiceHistory` | GET_LIST | `Task<ApiResponseDTO<List<ListServiceHistoryDTO>>>` | ✓ |
| IMachineryAppService | `GetMachinerySelectItemAsync` | GET_SINGLE | `Task<ApiResponseDTO<SelectItemDTO<Guid>>>` | ⚠ Get sin ByXxx/All |
| IMachineryAppService | `InformePdfAsync` | OTHER | `Task<ApiResponseDTO<object>>` | ⚠ naming no CRUD estandar |
| IMachineryAppService | `InventarioCompletoAsync` | OTHER | `Task<ApiResponseDTO<object>>` | ⚠ naming no CRUD estandar |
| IMachineryAppService | `ListEngineSystemsAsync` | OTHER | `Task<ApiResponseDTO<object>>` | ⚠ naming no CRUD estandar |
| IMachineryAppService | `SubirDocumentoAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| IMachineryAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<Equipment>>` | ✓ |
| IMachineryAppService | `UpdateCategoryAsync` | UPDATE | `Task<ApiResponseDTO<object>>` | ✓ |
| IMachineryAssetAppService | `ListAsync` | OTHER | `Task<ApiResponseDTO<List<object>>>` | ⚠ naming no CRUD estandar |
| IMachineryDocumentAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<MachineryDocumentDTO[]>>` | ✓ |
| IMaintenanceCalendarAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<MaintenanceCalendar>>` | ✓ |
| IMaintenanceCalendarAppService | `CronogramaAnualAsync` | OTHER | `Task<ApiResponseDTO<List<CalendarioMantenimientoDTO>>>` | ⚠ naming no CRUD estandar |
| IMaintenanceCalendarAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IMaintenanceCalendarAppService | `ExportCalendarAsync` | SPECIAL | `Task<ApiResponseDTO<List<object>>>` | ✓ |
| IMaintenanceCalendarAppService | `GeneralMantenimientoAsync` | OTHER | `Task<ApiResponseDTO<List<object>>>` | ⚠ naming no CRUD estandar |
| IMaintenanceCalendarAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<List<object>>>` | ✓ |
| IMaintenanceCalendarAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<MaintenanceCalendarDTO>>` | ✓ |
| IMaintenanceCalendarAppService | `GetCronogramaAnualPdfStatusAsync` | GET_LIST | `Task<ApiResponseDTO<List<CronogramaAnualPdfStatusDTO>>>` | ⚠ Get sin ByXxx/All |
| IMaintenanceCalendarAppService | `GetOfMachineryAsync` | GET_SINGLE | `Task<ApiResponseDTO<MaintenanceCalendarDTO[]>>` | ⚠ Get sin ByXxx/All |
| IMaintenanceCalendarAppService | `GetResumenAsync` | GET_SINGLE | `Task<ApiResponseDTO<object>>` | ⚠ Get sin ByXxx/All |
| IMaintenanceCalendarAppService | `GetResumenGastosAsync` | GET_LIST | `Task<ApiResponseDTO<ResumenGastosDTO>>` | ⚠ Get sin ByXxx/All |
| IMaintenanceCalendarAppService | `ListServiceAsync` | OTHER | `Task<ApiResponseDTO<List<MaintenanceCalendarListDTO>>>` | ⚠ naming no CRUD estandar |
| IMaintenanceCalendarAppService | `ProveedoresCalendarioAsync` | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>>` | ⚠ naming no CRUD estandar |
| IMaintenanceCalendarAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<MaintenanceCalendar>>` | ✓ |
| IMedidorAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<Meter>>` | ✓ |
| IMedidorAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IMedidorAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<MedidorDTO[]>>` | ✓ |
| IMedidorAppService | `GetAllInactiveAsync` | GET_LIST | `Task<ApiResponseDTO<MedidorDTO[]>>` | ✓ |
| IMedidorAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<MedidorDTO>>` | ✓ |
| IMedidorAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<Meter>>` | ✓ |
| IMedidorCategoriaAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<MedidorCategoria>>` | ✓ |
| IMedidorCategoriaAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IMedidorCategoriaAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<MedidorCategoriaDTO[]>>` | ✓ |
| IMedidorCategoriaAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<MedidorCategoriaDTO>>` | ✓ |
| IMedidorCategoriaAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<MedidorCategoria>>` | ✓ |
| IMedidorLecturaAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<MeterReading>>` | ✓ |
| IMedidorLecturaAppService | `DataGraficoDiariaAsync` | OTHER | `Task<ApiResponseDTO<DataSetChart>>` | ⚠ naming no CRUD estandar |
| IMedidorLecturaAppService | `DataGraficoMensualAsync` | OTHER | `Task<ApiResponseDTO<DataSetChart>>` | ⚠ naming no CRUD estandar |
| IMedidorLecturaAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IMedidorLecturaAppService | `ExportExcel` | SPECIAL | `ApiResponseDTO<IEnumerable<MedidorLecturaExcelDTO>>` | ✓ |
| IMedidorLecturaAppService | `GetAll` | GET_LIST | `ApiResponseDTO<MedidorLecturaDTO[]>` | ✓ |
| IMedidorLecturaAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<MedidorLecturaDTO>>` | ✓ |
| IMedidorLecturaAppService | `GetUltimaLecturaAsync` | GET_SINGLE | `Task<ApiResponseDTO<MedidorLecturaDTO>>` | ⚠ Get sin ByXxx/All |
| IMedidorLecturaAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<MeterReading>>` | ✓ |
| IMedidorLecturaAppService | `VerificarRegistroDelDia` | OTHER | `ApiResponseDTO<bool>` | ⚠ naming no CRUD estandar |
| IPiscinaAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<PiscinaDTO>>` | ✓ |
| IPiscinaAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<PiscinaDTO>>` | ✓ |
| IPiscinaAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<PiscinaDTO[]>>` | ✓ |
| IPiscinaAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<PiscinaDTO>>` | ✓ |
| IPiscinaAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<PiscinaDTO>>` | ✓ |
| IPiscinaBitacoraAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<PiscinaBitacoraDTO>>` | ✓ |
| IPiscinaBitacoraAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IPiscinaBitacoraAppService | `ExportExcelAsync` | SPECIAL | `Task<ApiResponseDTO<IEnumerable<PiscinaBitacoraExcelDTO>>>` | ✓ |
| IPiscinaBitacoraAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<PiscinaBitacoraDTO[]>>` | ✓ |
| IPiscinaBitacoraAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<PiscinaBitacoraDTO>>` | ✓ |
| IPiscinaBitacoraAppService | `ImportExcelAsync` | SPECIAL | `Task<ApiResponseDTO<PiscinaBitacoraImportResultDTO>>` | ✓ |
| IPiscinaBitacoraAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<PiscinaBitacoraDTO>>` | ✓ |
| IRecepcionPipasAguaAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<WaterTruckDelivery>>` | ✓ |
| IRecepcionPipasAguaAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IRecepcionPipasAguaAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<List<RecepcionPipaAguaDTO>>>` | ✓ |
| IRecepcionPipasAguaAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<RecepcionPipaAguaDTO>>` | ✓ |
| IRecepcionPipasAguaAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<WaterTruckDelivery>>` | ✓ |

### Endpoints

| Verbo | Ruta | Handler | Categoria |
|---|---|---|---|
| POST | `api/bitacora-detector-humo` | `AddAsync` | CREATE |
| DELETE | `api/bitacora-detector-humo/{id:guid}` | `DeleteByIdAsync` | DELETE |
| GET | `api/bitacora-detector-humo/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| GET | `api/bitacora-detector-humo/list/{detectorId:guid}` | `GetAllAsync` | GET_SINGLE |
| POST | `api/bitacora-estacion-manual` | `AddAsync` | CREATE |
| DELETE | `api/bitacora-estacion-manual/{id:guid}` | `DeleteByIdAsync` | DELETE |
| GET | `api/bitacora-estacion-manual/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| GET | `api/bitacora-estacion-manual/list/{stationId:guid}` | `GetAllAsync` | GET_SINGLE |
| POST | `api/bitacora-extintor` | `AddAsync` | CREATE |
| DELETE | `api/bitacora-extintor/{id:guid}` | `DeleteByIdAsync` | DELETE |
| GET | `api/bitacora-extintor/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| GET | `api/bitacora-extintor/list/{extinguisherId:guid}` | `GetAllAsync` | GET_SINGLE |
| POST | `api/bitacora-hidrante` | `AddAsync` | CREATE |
| GET | `api/bitacora-hidrante/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| DELETE | `api/bitacora-hidrante/{id:guid}` | `DeleteByIdAsync` | DELETE |
| GET | `api/bitacora-hidrante/list/{hydrantId:guid}` | `GetAllAsync` | GET_SINGLE |
| POST | `api/bitacora-mantenimiento` | `AddAsync` | CREATE |
| GET | `api/bitacora-mantenimiento/{id:guid}` | `FindByIdAsync` | GET_SINGLE |
| DELETE | `api/bitacora-mantenimiento/{id:guid}` | `DeleteByIdAsync` | DELETE |
| GET | `api/budget-maintenance/resumen-gastos/{customerId:guid}` | `GetResumenAsync` | GET_SINGLE |
| GET | `api/budget-maintenance/summary-of-expenses/{customerId:guid}` | `GetResumenGastosAsync` | GET_SINGLE |
| POST | `api/calendario-maestro` | `AddAsync` | CREATE |
| GET | `api/calendario-maestro/{id:guid}` | `GetAsyncByIdAsync` | GET_SINGLE |
| DELETE | `api/calendario-maestro/{id:guid}` | `DeleteAsync` | DELETE |
| PUT | `api/calendario-maestro/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/calendario-maestro/list` | `GetAllAsync` | GET_LIST |
| POST | `api/calendario-maestro-equipo` | `AddAsync` | CREATE |
| GET | `api/calendario-maestro-equipo` | `GetAllAsync` | GET_LIST |
| GET | `api/calendario-maestro-equipo/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| DELETE | `api/calendario-maestro-equipo/{id:guid}` | `DeleteByIdAsync` | DELETE |
| PUT | `api/calendario-maestro-equipo/{id:guid}` | `UpdateAsync` | UPDATE |
| POST | `api/control-prestamo-herramientas` | `AddAsync` | CREATE |
| DELETE | `api/control-prestamo-herramientas/{id:guid}` | `DeleteByIdAsync` | DELETE |
| PUT | `api/control-prestamo-herramientas/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/control-prestamo-herramientas/{id:guid}` | `GetById` | GET_SINGLE |
| GET | `api/control-prestamo-herramientas/list/{customerId:guid}` | `GetAllIndexDTO` | GET_SINGLE |
| POST | `api/elevators-emergency-call` | `AddAsync` | CREATE |
| GET | `api/elevators-emergency-call/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| DELETE | `api/elevators-emergency-call/{id:guid}` | `DeleteByIdAsync` | DELETE |
| PUT | `api/elevators-emergency-call/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/elevators-emergency-call/elevators/{customerId:guid}` | `GetElevatorsAsync` | GET_SINGLE |
| GET | `api/elevators-emergency-call/list/{customerId:guid}` | `GetAllAsync` | GET_SINGLE |
| POST | `api/elevator-spare-parts-change` | `AddAsync` | CREATE |
| PUT | `api/elevator-spare-parts-change/{id:guid}` | `UpdateAsync` | UPDATE |
| DELETE | `api/elevator-spare-parts-change/{id:guid}` | `DeleteByIdAsync` | DELETE |
| GET | `api/elevator-spare-parts-change/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| GET | `api/elevator-spare-parts-change/elevators/{customerId:guid}` | `GetElevatorsAsync` | GET_SINGLE |
| GET | `api/elevator-spare-parts-change/list/{customerId:guid}` | `GetAllAsync` | GET_SINGLE |
| POST | `api/equipment-inspection-definitions` | `AddAsync` | CREATE |
| PUT | `api/equipment-inspection-definitions/{id:guid}` | `UpdateAsync` | UPDATE |
| DELETE | `api/equipment-inspection-definitions/{id:guid}` | `DeleteByIdAsync` | DELETE |
| GET | `api/equipment-inspection-definitions/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| PUT | `api/equipment-inspection-definitions/{id:guid}/active/{isActive:bool}` | `ToggleActiveAsync` | UPDATE |
| GET | `api/equipment-inspection-definitions/by-machinery/{machineryId:guid}` | `GetByMachineryAsync` | GET_SINGLE |
| GET | `api/equipment-inspection-executions/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| PUT | `api/equipment-inspection-executions/{id:guid}/administrative-update` | `AdministrativeUpdateAsync` | UPDATE |
| PUT | `api/equipment-inspection-executions/{id:guid}/complete` | `CompleteAsync` | UPDATE |
| GET | `api/equipment-inspection-executions/by-machinery/{machineryId:guid}` | `GetByMachineryAsync` | GET_SINGLE |
| GET | `api/equipment-inspection-executions/pending/{customerId:guid}` | `GetPendingAsync` | GET_SINGLE |
| POST | `api/equipment-inspection-executions/start-from-qr` | `StartFromQrAsync` | CREATE |
| POST | `api/equipment-inspection-executions/start-manual/{definitionId:guid}` | `StartManualAsync` | CREATE |
| POST | `api/equipment-qr-labels` | `AddAsync` | CREATE |
| GET | `api/equipment-qr-labels/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| GET | `api/equipment-qr-labels/{id:guid}/download` | `DownloadAsync` | GET_SINGLE |
| POST | `api/equipment-qr-labels/{id:guid}/regenerate` | `RegenerateAsync` | CREATE |
| GET | `api/equipment-qr-labels/by-machinery/{machineryId:guid}` | `GetByMachineryAsync` | GET_SINGLE |
| POST | `api/equipment-qr-labels/download-batch` | `DownloadBatchAsync` | SPECIAL |
| GET | `api/equipment-qr-labels/resolve/{code}` | `ResolveAsync` | GET_LIST |
| GET | `api/equipo-clasificacion` | `GetAllAsync` | GET_LIST |
| POST | `api/equipo-clasificacion` | `AddAsync` | CREATE |
| PUT | `api/equipo-clasificacion/{id:guid}` | `UpdateAsync` | UPDATE |
| DELETE | `api/equipo-clasificacion/{id:guid}` | `DeleteByIdAsync` | DELETE |
| GET | `api/equipo-clasificacion/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| POST | `api/fire-cycle-inspection/detector` | `UpsertDetectorAsync` | CREATE |
| GET | `api/fire-cycle-inspection/detector/{cycleId:guid}/{detectorId:guid}` | `GetDetectorAsync` | GET_SINGLE |
| POST | `api/fire-cycle-inspection/estacion` | `UpsertEstacionAsync` | CREATE |
| GET | `api/fire-cycle-inspection/estacion/{cycleId:guid}/{stationId:guid}` | `GetEstacionAsync` | GET_SINGLE |
| POST | `api/fire-cycle-inspection/extintor` | `UpsertExtintorAsync` | CREATE |
| GET | `api/fire-cycle-inspection/extintor/{cycleId:guid}/{extinguisherId:guid}` | `GetExtintorAsync` | GET_SINGLE |
| POST | `api/fire-cycle-inspection/hidrante` | `UpsertHidranteAsync` | CREATE |
| GET | `api/fire-cycle-inspection/hidrante/{cycleId:guid}/{hydrantId:guid}` | `GetHidranteAsync` | GET_SINGLE |
| GET | `api/fire-inspection-cycle/{id:guid}` | `GetDetailAsync` | GET_SINGLE |
| GET | `api/fire-inspection-cycle/active/{periodId:guid}` | `GetActiveByPeriodAsync` | GET_SINGLE |
| POST | `api/fire-inspection-cycle/generate/{periodId:guid}` | `GenerateCycleForPeriodAsync` | SPECIAL |
| GET | `api/fire-inspection-cycle/list/{customerId:guid}` | `GetAllAsync` | GET_SINGLE |
| POST | `api/fire-inspection-period` | `AddAsync` | CREATE |
| DELETE | `api/fire-inspection-period/{id:guid}` | `DeleteByIdAsync` | DELETE |
| GET | `api/fire-inspection-period/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| PUT | `api/fire-inspection-period/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/fire-inspection-period/list/{customerId:guid}` | `GetAllAsync` | GET_SINGLE |
| DELETE | `api/fire-inspection-period-items/detector/{id:guid}` | `RemoveDetectorAsync` | DELETE |
| POST | `api/fire-inspection-period-items/detector/{periodId:guid}/{detectorId:guid}` | `AddDetectorAsync` | CREATE |
| GET | `api/fire-inspection-period-items/detector/list/{periodId:guid}` | `GetDetectoresAsync` | GET_SINGLE |
| DELETE | `api/fire-inspection-period-items/estacion/{id:guid}` | `RemoveEstacionAsync` | DELETE |
| POST | `api/fire-inspection-period-items/estacion/{periodId:guid}/{stationId:guid}` | `AddEstacionAsync` | CREATE |
| GET | `api/fire-inspection-period-items/estacion/list/{periodId:guid}` | `GetEstacionesAsync` | GET_SINGLE |
| DELETE | `api/fire-inspection-period-items/extintor/{id:guid}` | `RemoveExtintorAsync` | DELETE |
| POST | `api/fire-inspection-period-items/extintor/{periodId:guid}/{extinguisherId:guid}` | `AddExtintorAsync` | CREATE |
| GET | `api/fire-inspection-period-items/extintor/list/{periodId:guid}` | `GetExtintoresAsync` | GET_SINGLE |
| DELETE | `api/fire-inspection-period-items/hidrante/{id:guid}` | `RemoveHidranteAsync` | DELETE |
| POST | `api/fire-inspection-period-items/hidrante/{periodId:guid}/{hydrantId:guid}` | `AddHidranteAsync` | CREATE |
| GET | `api/fire-inspection-period-items/hidrante/list/{periodId:guid}` | `GetHidrantesAsync` | GET_SINGLE |
| POST | `api/inventario-detector-humo` | `AddAsync` | CREATE |
| DELETE | `api/inventario-detector-humo/{id:guid}` | `DeleteByIdAsync` | DELETE |
| GET | `api/inventario-detector-humo/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| PUT | `api/inventario-detector-humo/{id:guid}` | `UpdateAsync` | UPDATE |
| DELETE | `api/inventario-detector-humo/all/{customerId:guid}` | `DeleteAllByCustomerAsync` | DELETE |
| POST | `api/inventario-detector-humo/import/{customerId:guid}` | `ImportFromExcelAsync` | SPECIAL |
| GET | `api/inventario-detector-humo/list/{customerId:guid}` | `GetAllAsync` | GET_SINGLE |
| POST | `api/inventario-estacion-manual` | `AddAsync` | CREATE |
| PUT | `api/inventario-estacion-manual/{id:guid}` | `UpdateAsync` | UPDATE |
| DELETE | `api/inventario-estacion-manual/{id:guid}` | `DeleteByIdAsync` | DELETE |
| GET | `api/inventario-estacion-manual/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| DELETE | `api/inventario-estacion-manual/all/{customerId:guid}` | `DeleteAllByCustomerAsync` | DELETE |
| POST | `api/inventario-estacion-manual/import/{customerId:guid}` | `ImportFromExcelAsync` | SPECIAL |
| GET | `api/inventario-estacion-manual/list/{customerId:guid}` | `GetAllAsync` | GET_SINGLE |
| POST | `api/inventario-extintor` | `AddAsync` | CREATE |
| DELETE | `api/inventario-extintor/{id:guid}` | `DeleteByIdAsync` | DELETE |
| GET | `api/inventario-extintor/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| PUT | `api/inventario-extintor/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/inventario-extintor/get-all-group/{customerId:guid}` | `GetAllGroupAsync` | GET_SINGLE |
| GET | `api/inventario-extintor/list/{customerId:guid}` | `GetAllAsync` | GET_SINGLE |
| POST | `api/inventario-hidrante` | `AddAsync` | CREATE |
| GET | `api/inventario-hidrante/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| DELETE | `api/inventario-hidrante/{id:guid}` | `DeleteByIdAsync` | DELETE |
| PUT | `api/inventario-hidrante/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/inventario-hidrante/list/{customerId:guid}` | `GetAllAsync` | GET_SINGLE |
| POST | `api/machineries` | `AddAsync` | CREATE |
| GET | `api/machineries/{id:guid}` | `GetById` | GET_SINGLE |
| PUT | `api/machineries/{id:guid}` | `UpdateAsync` | UPDATE |
| DELETE | `api/machineries/{id:guid}` | `DeleteAsync` | DELETE |
| GET | `api/machineries/actas-entrega/{customerId:guid}` | `ActasEntregaAsync` | GET_SINGLE |
| DELETE | `api/machineries/delete-document/{id:guid}` | `DeleteDocumentAsync` | DELETE |
| GET | `api/machineries/fichatecnica/{id:guid}` | `GetFichaTecnica` | GET_SINGLE |
| GET | `api/machineries/get-all/{customerId:guid}` | `GetAllAsync` | GET_SINGLE |
| GET | `api/machineries/get-all-card/{customerId:guid}` | `GetAllCardAsync` | GET_SINGLE |
| GET | `api/machineries/get-all-detail/{customerId:guid}` | `GetAllMachineryDetailAsync` | GET_SINGLE |
| GET | `api/machineries/get-autocompete-inv/{customerId:guid}` | `GetAutocompeteInvAsync` | GET_SINGLE |
| GET | `api/machineries/get-machinery-select-item/{id:guid}` | `GetMachinerySelectItemAsync` | GET_SINGLE |
| GET | `api/machineries/informe-pdf/{customerId:guid}` | `InformePdfAsync` | GET_SINGLE |
| GET | `api/machineries/inventario-completo/{customerId:guid}` | `InventarioCompletoAsync` | GET_SINGLE |
| GET | `api/machineries/list-engine-systems/{customerId:guid}` | `ListEngineSystemsAsync` | GET_SINGLE |
| GET | `api/machineries/service-history/{machineryId:guid}` | `GetListServiceHistory` | GET_SINGLE |
| POST | `api/machineries/subir-documento/{machineryId:guid}` | `SubirDocumentoAsync` | CREATE |
| PUT | `api/machineries/update-category` | `UpdateCategoryAsync` | UPDATE |
| GET | `api/machinery-asset/list/{customerId:guid}` | `ListAsync` | GET_SINGLE |
| GET | `api/machinery-document/list/{machineryId:guid}` | `GetAllAsync` | GET_SINGLE |
| POST | `api/maintenance-calendars` | `AddAsync` | CREATE |
| PUT | `api/maintenance-calendars/{id:guid}` | `UpdateAsync` | UPDATE |
| DELETE | `api/maintenance-calendars/{id:guid}` | `DeleteByIdAsync` | DELETE |
| GET | `api/maintenance-calendars/cronograma-anual/{customerId:guid}` | `CronogramaAnualAsync` | GET_SINGLE |
| GET | `api/maintenance-calendars/cronograma-anual/{customerId:guid}/{filterId:int}` | `CronogramaAnualAsync` | GET_SINGLE |
| GET | `api/maintenance-calendars/cronograma-anual-pdf-status/{customerId:guid}` | `GetCronogramaAnualPdfStatusAsync` | GET_SINGLE |
| GET | `api/maintenance-calendars/export-calendar/{customerId:guid}` | `ExportCalendarAsync` | GET_SINGLE |
| GET | `api/maintenance-calendars/general-mantenimiento/{customerId:guid}/{providerId:guid}` | `GeneralMantenimientoAsync` | GET_SINGLE |
| GET | `api/maintenance-calendars/get/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| GET | `api/maintenance-calendars/list/{customerId:guid}/{month:int}` | `GetAllAsync` | GET_SINGLE |
| GET | `api/maintenance-calendars/list-service/{machineryId:guid}` | `ListServiceAsync` | GET_SINGLE |
| GET | `api/maintenance-calendars/of-machinery/{machineryId:guid}` | `GetOfMachineryAsync` | GET_SINGLE |
| GET | `api/maintenance-calendars/proveedores-calendario/{customerId:guid}` | `ProveedoresCalendarioAsync` | GET_SINGLE |
| GET | `api/maintenance-calendars/resumen/{customerId:guid}` | `GetResumenAsync` | GET_SINGLE |
| GET | `api/maintenance-calendars/resumen-gastos/{customerId:guid}` | `GetResumenGastosAsync` | GET_SINGLE |
| POST | `api/medidor` | `AddAsync` | CREATE |
| DELETE | `api/medidor/{id:guid}` | `DeleteByIdAsync` | DELETE |
| PUT | `api/medidor/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/medidor/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| GET | `api/medidor/get-all-inactive/{customerId:guid}` | `GetAllInactiveAsync` | GET_SINGLE |
| GET | `api/medidor/list/{customerId:guid}` | `GetAllAsync` | GET_SINGLE |
| GET | `api/medidor-categoria` | `GetAllAsync` | GET_LIST |
| POST | `api/medidor-categoria` | `AddAsync` | CREATE |
| PUT | `api/medidor-categoria/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/medidor-categoria/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| DELETE | `api/medidor-categoria/{id:guid}` | `DeleteByIdAsync` | DELETE |
| POST | `api/medidorlectura` | `AddAsync` | CREATE |
| GET | `api/medidorlectura/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| DELETE | `api/medidorlectura/{id:guid}` | `DeleteByIdAsync` | DELETE |
| PUT | `api/medidorlectura/{id:guid}` | `UpdateAsync` | UPDATE |
| POST | `api/medidorlectura/admin-create-lectura` | `AddAsync` | CREATE |
| GET | `api/medidorlectura/data-grafico-diaria/{medidorId:guid}/{fechaInical:datetime}/{fechaFinal:datetime}` | `DataGraficoDiariaAsync` | GET_SINGLE |
| GET | `api/medidorlectura/data-grafico-mensual/{medidorId:guid}/{fechaInical:datetime}/{fechaFinal:datetime}` | `DataGraficoMensualAsync` | GET_SINGLE |
| GET | `api/medidorlectura/export-excel/{medidorId:guid}` | `ExportExcel` | GET_SINGLE |
| GET | `api/medidorlectura/list/{medidorId:guid}` | `GetAll` | GET_SINGLE |
| GET | `api/medidorlectura/ultima-lectura/{medidorId:guid}` | `GetUltimaLecturaAsync` | GET_SINGLE |
| GET | `api/medidorlectura/verificar-registro-del-dia/{medidorId:guid}` | `VerificarRegistroDelDia` | GET_SINGLE |
| POST | `api/piscina` | `AddAsync` | CREATE |
| GET | `api/piscina/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| DELETE | `api/piscina/{id:guid}` | `DeleteAsync` | DELETE |
| PUT | `api/piscina/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/piscina/list/{customerId:guid}` | `GetAllAsync` | GET_SINGLE |
| POST | `api/piscina-bitacora` | `AddAsync` | CREATE |
| DELETE | `api/piscina-bitacora/{id:guid}` | `DeleteByIdAsync` | DELETE |
| PUT | `api/piscina-bitacora/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/piscina-bitacora/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| GET | `api/piscina-bitacora/export-excel/{piscinaId:guid}` | `ExportExcelAsync` | GET_SINGLE |
| POST | `api/piscina-bitacora/import-excel/{piscinaId:guid}` | `ImportExcelAsync` | SPECIAL |
| GET | `api/piscina-bitacora/list/{piscinaId:guid}` | `GetAllAsync` | GET_SINGLE |
| POST | `api/recepcion-pipas-agua` | `AddAsync` | CREATE |
| GET | `api/recepcion-pipas-agua/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| DELETE | `api/recepcion-pipas-agua/{id:guid}` | `DeleteByIdAsync` | DELETE |
| PUT | `api/recepcion-pipas-agua/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/recepcion-pipas-agua/list/{customerId:guid}` | `GetAllAsync` | GET_SINGLE |

## Modulo: OperationsLuxuryApp

Metodos: 486 | Endpoints HTTP: 421

### Servicios e interfaces

| Servicio/Interfaz | Metodos | Ubicacion |
|---|---|---|
| `IAccessCredentialService` | 3 | `OperationsLuxuryApp/AccessControl/Interfaces/IAccessCredentialService.cs` |
| `IAccessDashboardService` | 2 | `OperationsLuxuryApp/AccessControl/Interfaces/IAccessDashboardService.cs` |
| `IAccessEventService` | 2 | `OperationsLuxuryApp/AccessControl/Interfaces/IAccessEventService.cs` |
| `IAccessPointService` | 3 | `OperationsLuxuryApp/AccessControl/Interfaces/IAccessPointService.cs` |
| `IAccessScanService` | 1 | `OperationsLuxuryApp/AccessControl/Interfaces/IAccessScanService.cs` |
| `IAgendaSemanalAppService` | 2 | `OperationsLuxuryApp/DireccionDashboard/AgendaSemanal/Interfaces/IAgendaSemanalAppService.cs` |
| `IAgendaSupervisionAppService` | 5 | `OperationsLuxuryApp/Supervision/Supervision/Interfaces/IAgendaSupervisionAppService.cs` |
| `IAlmacenAppService` | 7 | `OperationsLuxuryApp/Inventory/Interfaces/IAlmacenAppService.cs` |
| `IAnnouncementAppService` | 8 | `OperationsLuxuryApp/Announcements/Interfaces/IAnnouncementAppService.cs` |
| `IAnnouncementNotificationService` | 1 | `OperationsLuxuryApp/Announcements/Interfaces/IAnnouncementNotificationService.cs` |
| `IBuildingCustomerAppService` | 1 | `OperationsLuxuryApp/BuildingCustomer/Services/BuildingCustomerAppService.cs` |
| `ICatalogInspectionAppService` | 5 | `OperationsLuxuryApp/Inspections/Interfaces/ICatalogInspectionAppService.cs` |
| `ICatalogoEntregaRecepcionDescripcionAppService` | 6 | `OperationsLuxuryApp/DeliveryReception/Interfaces/ICatalogoEntregaRecepcionDescripcionAppService.cs` |
| `IComiteVigilanciaAppService` | 7 | `OperationsLuxuryApp/Comite/ComitesVigilancia/Interfaces/IComiteVigilanciaAppService.cs` |
| `IContratosLegalAppService` | 2 | `OperationsLuxuryApp/DireccionDashboard/ContratosLegal/Interfaces/IContratosLegalAppService.cs` |
| `ICustomDocumentAppService` | 7 | `OperationsLuxuryApp/CustomDocuments/Interfaces/ICustomDocumentAppService.cs` |
| `ICustomerInspectionAppService` | 5 | `OperationsLuxuryApp/Inspections/Interfaces/ICustomerInspectionAppService.cs` |
| `ICustomerProviderAppService` | 5 | `OperationsLuxuryApp/CustomerProviders/Interfaces/ICustomerProviderAppService.cs` |
| `IDashboardAppService` | 2 | `OperationsLuxuryApp/Dashboard/Interfaces/IDashboardAppService.cs` |
| `IDiagramDrawService` | 5 | `OperationsLuxuryApp/Diagram/Interfaces/IDiagramDrawService.cs` |
| `IEntradaProductoAppService` | 6 | `OperationsLuxuryApp/Inventory/Interfaces/IEntradaProductoAppService.cs` |
| `IEntregaRecepcionAppService` | 9 | `OperationsLuxuryApp/DeliveryReception/Interfaces/IEntregaRecepcionAppService.cs` |
| `IEntregaRecepcionDescripcionAppService` | 6 | `OperationsLuxuryApp/DeliveryReception/Interfaces/IEntregaRecepcionDescripcionAppService.cs` |
| `IGanttAppService` | 1 | `OperationsLuxuryApp/Task/TaskRecords/Interfaces/IGanttAppService.cs` |
| `IGeneralSummaryService` | 12 | `OperationsLuxuryApp/ResumenGeneral/Interfaces/IGeneralSummaryService.cs` |
| `IGoogleCalendarEventAppService` | 7 | `OperationsLuxuryApp/GoogleCalendar/Interfaces/IGoogleCalendarEventAppService.cs` |
| `IGoogleCalendarService` | 4 | `OperationsLuxuryApp/GoogleCalendar/Interfaces/IGoogleCalendarService.cs` |
| `IIncidentAppService` | 12 | `OperationsLuxuryApp/IncidenciasAdministrativas/HRIncident/Interfaces/IIncidentAppService.cs` |
| `IIncidentAttachmentAppService` | 3 | `OperationsLuxuryApp/IncidenciasAdministrativas/HRIncident/Interfaces/IIncidentAttachmentAppService.cs` |
| `IIncidentNotificationService` | 1 | `OperationsLuxuryApp/IncidenciasAdministrativas/HRIncident/Notifications/IIncidentNotificationService.cs` |
| `IIncidentPdfService` | 3 | `OperationsLuxuryApp/IncidenciasAdministrativas/HRIncident/Interfaces/IIncidentPdfService.cs` |
| `IIncidentReportAppService` | 3 | `OperationsLuxuryApp/IncidenciasAdministrativas/HRIncidentReport/Interfaces/IIncidentReportAppService.cs` |
| `IIncidentTypeAppService` | 6 | `OperationsLuxuryApp/IncidenciasAdministrativas/IncidentTypes/Interfaces/IIncidentTypeAppService.cs` |
| `IIncidentWitnessAppService` | 5 | `OperationsLuxuryApp/IncidenciasAdministrativas/HRIncident/Interfaces/IIncidentWitnessAppService.cs` |
| `IInspectionAppService` | 6 | `OperationsLuxuryApp/Inspections/Interfaces/IInspectionAppService.cs` |
| `IInspectionCondominiumAssetAppService` | 6 | `OperationsLuxuryApp/Inspections/Interfaces/IInspectionCondominiumAssetAppService.cs` |
| `IInspectionResultImageAppService` | 3 | `OperationsLuxuryApp/Inspections/Interfaces/IInspectionResultImageAppService.cs` |
| `IInspectionReviewsCatalogAppService` | 5 | `OperationsLuxuryApp/Inspections/Interfaces/IInspectionReviewsCatalogAppService.cs` |
| `IInventarioIluminacionAppService` | 5 | `OperationsLuxuryApp/Inventory/LightingInventory/Interfaces/IInventarioIluminacionAppService.cs` |
| `IInventarioLlaveAppService` | 5 | `OperationsLuxuryApp/Inventory/KeyInventories/Interfaces/IInventarioLlaveAppService.cs` |
| `IInventarioPinturaAppService` | 5 | `OperationsLuxuryApp/Inventory/PaintInventory/Interfaces/IInventarioPinturaAppService.cs` |
| `IInvitationAppService` | 3 | `OperationsLuxuryApp/AccessControl/Interfaces/IInvitationAppService.cs` |
| `IJuntaMensualSessionAppService` | 10 | `OperationsLuxuryApp/JuntasMensuales/Session/Interfaces/IJuntaMensualSessionAppService.cs` |
| `IJuntaMensualSessionBackfillAppService` | 2 | `OperationsLuxuryApp/JuntasMensuales/Backfill/Interfaces/IJuntaMensualSessionBackfillAppService.cs` |
| `IJuntaMensualSessionMaintenanceAppService` | 1 | `OperationsLuxuryApp/JuntasMensuales/Session/Interfaces/IJuntaMensualSessionMaintenanceAppService.cs` |
| `IMeetingAdministracionAppService` | 3 | `OperationsLuxuryApp/JuntasMensuales/Minuta/Interfaces/IMeetingAdministracionAppService.cs` |
| `IMeetingAppService` | 13 | `OperationsLuxuryApp/JuntasMensuales/Minuta/Interfaces/IMeetingAppService.cs` |
| `IMeetingComiteAppService` | 3 | `OperationsLuxuryApp/JuntasMensuales/Minuta/Interfaces/IMeetingComiteAppService.cs` |
| `IMeetingDetailsAppService` | 7 | `OperationsLuxuryApp/JuntasMensuales/Minuta/Interfaces/IMeetingDetailsAppService.cs` |
| `IMeetingDetailsSeguimientoAppService` | 11 | `OperationsLuxuryApp/JuntasMensuales/Minuta/Interfaces/IMeetingDetailsSeguimientoAppService.cs` |
| `IMeetingInvitadoAppService` | 3 | `OperationsLuxuryApp/JuntasMensuales/Minuta/Interfaces/IMeetingInvitadoAppService.cs` |
| `IOwnerAppService` | 5 | `OperationsLuxuryApp/Owner/Interfaces/IOwnerAppService.cs` |
| `IPanicAlertAppService` | 6 | `OperationsLuxuryApp/PanicAlerts/Interfaces/IPanicAlertAppService.cs` |
| `IPanicAlertNotificationService` | 2 | `OperationsLuxuryApp/PanicAlerts/Interfaces/IPanicAlertNotificationService.cs` |
| `IPendingTaskReportAppService` | 1 | `OperationsLuxuryApp/Task/TaskReport/Interfaces/IPendingTaskReportAppService.cs` |
| `IPersonalAusenteAppService` | 1 | `OperationsLuxuryApp/DireccionDashboard/PersonalAusente/Interfaces/IPersonalAusenteAppService.cs` |
| `IPresentacionJuntaComiteAppService` | 12 | `OperationsLuxuryApp/JuntasMensuales/Presentacion/Interfaces/IPresentacionJuntaComiteAppService.cs` |
| `IProductAppService` | 8 | `OperationsLuxuryApp/Inventory/Interfaces/IProductAppService.cs` |
| `IPropertyAppService` | 8 | `OperationsLuxuryApp/Properties/Interfaces/IPropertyAppService.cs` |
| `IPropertyOccupantAppService` | 5 | `OperationsLuxuryApp/PropertyOccupants/Interfaces/IPropertyOccupantAppService.cs` |
| `IRadioComunicacionAppService` | 5 | `OperationsLuxuryApp/Inventory/RadiosComunicacion/Interfaces/IRadioComunicacionAppService.cs` |
| `IReclutamientoResumenAppService` | 1 | `OperationsLuxuryApp/DireccionDashboard/ReclutamientoResumen/Interfaces/IReclutamientoResumenAppService.cs` |
| `IRecurringTaskCatalogAppService` | 5 | `OperationsLuxuryApp/Task/RecurringTaskCatalog/Interfaces/IRecurringTaskCatalogAppService.cs` |
| `IRecurringTaskComplianceAppService` | 1 | `OperationsLuxuryApp/Task/RecurringTaskCompliance/Interfaces/IRecurringTaskComplianceAppService.cs` |
| `IRecurringTaskGenerationService` | 1 | `OperationsLuxuryApp/Task/RecurringTaskGeneration/Interfaces/IRecurringTaskGenerationService.cs` |
| `ISalidaProductoAppService` | 7 | `OperationsLuxuryApp/Inventory/Interfaces/ISalidaProductoAppService.cs` |
| `ISanctionAppService` | 7 | `OperationsLuxuryApp/IncidenciasAdministrativas/HrSanction/Interfaces/ISanctionAppService.cs` |
| `ISanctionNotificationService` | 1 | `OperationsLuxuryApp/IncidenciasAdministrativas/HrSanction/Notifications/ISanctionNotificationService.cs` |
| `IScheduledTaskService` | 9 | `OperationsLuxuryApp/ScheduledTasks/Interfaces/IScheduledTaskService.cs` |
| `IServiceOrderAppService` | 18 | `OperationsLuxuryApp/ServiceOrders/Interfaces/IServiceOrderAppService.cs` |
| `IStockPorAlmacenAppService` | 9 | `OperationsLuxuryApp/Inventory/Interfaces/IStockPorAlmacenAppService.cs` |
| `ISupervisionReportsAppService` | 4 | `OperationsLuxuryApp/Supervision/SupervisionReport/Interfaces/ISupervisionReportsAppService.cs` |
| `ISuspensionDayAppService` | 3 | `OperationsLuxuryApp/IncidenciasAdministrativas/HRIncident/Interfaces/ISuspensionDayAppService.cs` |
| `ITareasLegalAppService` | 1 | `OperationsLuxuryApp/DireccionDashboard/TareasLegal/Interfaces/ITareasLegalAppService.cs` |
| `ITaskAlertEngineService` | 1 | `OperationsLuxuryApp/Task/RecurringTaskAlerting/Interfaces/ITaskAlertEngineService.cs` |
| `ITaskAppService` | 30 | `OperationsLuxuryApp/Task/TaskRecords/Interfaces/ITaskAppService.cs` |
| `ITaskAttachmentAppService` | 3 | `OperationsLuxuryApp/Task/TaskAttachments/Interfaces/ITaskAttachmentAppService.cs` |
| `ITaskChecklistAppService` | 4 | `OperationsLuxuryApp/Task/TaskChecklist/Interfaces/ITaskChecklistAppService.cs` |
| `ITaskEscalationService` | 1 | `OperationsLuxuryApp/Task/RecurringTaskEscalation/Interfaces/ITaskEscalationService.cs` |
| `ITaskFollowUpAppService` | 3 | `OperationsLuxuryApp/Task/TaskFollowUps/Interfaces/ITaskFollowUpAppService.cs` |
| `ITaskGroupAppService` | 7 | `OperationsLuxuryApp/Task/WorkGroups/Interfaces/ITaskGroupAppService.cs` |
| `ITaskGroupCategoryAppService` | 5 | `OperationsLuxuryApp/Task/WorkGroupCategoriesData/Interfaces/ITaskGroupCategoryAppService.cs` |
| `ITaskGroupMemberAppService` | 5 | `OperationsLuxuryApp/Task/WorkGroupMembers/Interfaces/ITaskGroupMemberAppService.cs` |
| `ITaskJustificationService` | 4 | `OperationsLuxuryApp/Task/TaskJustifications/Interfaces/ITaskJustificationService.cs` |
| `ITaskLegalAppService` | 13 | `OperationsLuxuryApp/Task/TaskLegal/Interfaces/ITaskLegalAppService.cs` |
| `ITaskMessageReadAppService` | 1 | `OperationsLuxuryApp/Task/TaskMessageReads/Interfaces/ITaskMessageReadAppService.cs` |
| `ITasksReportAppService` | 4 | `OperationsLuxuryApp/Task/TaskRecords/Interfaces/ITasksReportAppService.cs` |
| `ITaskWorkPlanAppService` | 3 | `OperationsLuxuryApp/Task/TaskWorkPlans/Interfaces/ITaskWorkPlanAppService.cs` |
| `IVisitAppService` | 5 | `OperationsLuxuryApp/AccessControl/Interfaces/IVisitAppService.cs` |
| `IVisitorService` | 4 | `OperationsLuxuryApp/AccessControl/Interfaces/IVisitorService.cs` |
| `IWarehouseAuthorizationService` | 1 | `OperationsLuxuryApp/Inventory/Interfaces/IWarehouseAuthorizationService.cs` |
| `MeetingDertailsSeguimientoAppService` | 11 | `OperationsLuxuryApp/JuntasMensuales/Minuta/Services/MeetingDertailsSeguimientoAppService.cs` |
| `RecurringTaskGenerationService` | 5 | `OperationsLuxuryApp/Task/RecurringTaskGeneration/Services/RecurringTaskGenerationService.cs` |
| `TaskAlertEngineService` | 2 | `OperationsLuxuryApp/Task/RecurringTaskAlerting/Services/TaskAlertEngineService.cs` |
| `TaskAppService` | 1 | `OperationsLuxuryApp/Task/TaskRecords/Services/TaskAppService.cs` |
| `TaskEscalationService` | 1 | `OperationsLuxuryApp/Task/RecurringTaskEscalation/Services/TaskEscalationService.cs` |
| `TaskJustificationAppService` | 4 | `OperationsLuxuryApp/Task/TaskJustifications/Services/TaskJustificationAppService.cs` |

### Metodos por categoria

| Servicio | Metodo | Categoria | Retorno | Observaciones |
|---|---|---|---|---|
| IAccessCredentialService | `GenerateQrCredentialAsync` | SPECIAL | `Task<ApiResponseDTO<AccessCredentialDTO>>` | ✓ |
| IAccessCredentialService | `GetCredentialByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<AccessCredentialDTO>>` | ✓ |
| IAccessCredentialService | `RevokeCredentialAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| IAccessDashboardService | `GetCurrentOccupancyAsync` | GET_SINGLE | `Task<ApiResponseDTO<OccupancyDTO>>` | ⚠ Get sin ByXxx/All |
| IAccessDashboardService | `GetDashboardStatsAsync` | GET_LIST | `Task<ApiResponseDTO<DashboardStatsDTO>>` | ⚠ Get sin ByXxx/All |
| IAccessEventService | `ExportEventsAsync` | SPECIAL | `Task<byte[]>` | ✓ |
| IAccessEventService | `GetEventsPagedAsync` | GET_LIST | `Task<ApiResponseDTO<PagedResultDTO<AccessEventDTO>>>` | ✓ |
| IAccessPointService | `CreateAsync` | CREATE | `Task<ApiResponseDTO<AccessPointDTO>>` | ✓ |
| IAccessPointService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<List<AccessPointDTO>>>` | ✓ |
| IAccessPointService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<AccessPointDTO>>` | ✓ |
| IAccessScanService | `ScanAsync` | OTHER | `Task<ApiResponseDTO<AccessScanResultDTO>>` | ⚠ naming no CRUD estandar |
| IAgendaSemanalAppService | `GetAgendaMesesAsync` | GET_LIST | `Task<ApiResponseDTO<List<AgendaSemanalEventDTO>>>` | ⚠ Get sin ByXxx/All |
| IAgendaSemanalAppService | `GetAgendaSemanalAsync` | GET_LIST | `Task<ApiResponseDTO<List<AgendaSemanalEventDTO>>>` | ⚠ Get sin ByXxx/All |
| IAgendaSupervisionAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<AgendaSupervision>>` | ✓ |
| IAgendaSupervisionAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IAgendaSupervisionAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<object>>` | ✓ |
| IAgendaSupervisionAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<AgendaSupervisionAddOrEditDTO>>` | ✓ |
| IAgendaSupervisionAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<AgendaSupervisionDTO>>` | ✓ |
| IAlmacenAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<AlmacenDTO>>` | ✓ |
| IAlmacenAppService | `AsignarResponsablesAsync` | OTHER | `Task<ApiResponseDTO<object>>` | ⚠ naming no CRUD estandar |
| IAlmacenAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IAlmacenAppService | `GetAllByCustomerAsync` | GET_LIST | `Task<ApiResponseDTO<List<AlmacenDTO>>>` | ✓ |
| IAlmacenAppService | `GetAllForCurrentUserAsync` | GET_LIST | `Task<ApiResponseDTO<List<AlmacenDTO>>>` | ✓ |
| IAlmacenAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<AlmacenDTO>>` | ✓ |
| IAlmacenAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<AlmacenDTO>>` | ✓ |
| IAnnouncementAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<AnnouncementDTO>>` | ✓ |
| IAnnouncementAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IAnnouncementAppService | `GeneratePdfAsync` | SPECIAL | `Task<ApiResponseDTO<byte[]>>` | ✓ |
| IAnnouncementAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<List<AnnouncementListDTO>>>` | ✓ |
| IAnnouncementAppService | `GetAllForAdminAsync` | GET_LIST | `Task<ApiResponseDTO<List<AnnouncementAdminListDTO>>>` | ✓ |
| IAnnouncementAppService | `GetAnalyticsByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<List<AnnouncementAnalyticsDTO>>>` | ✓ |
| IAnnouncementAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<AnnouncementDTO>>` | ✓ |
| IAnnouncementAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<AnnouncementDTO>>` | ✓ |
| IAnnouncementNotificationService | `SendNewAnnouncementNotificationAsync` | SPECIAL | `Task` | ✓ |
| IBuildingCustomerAppService | `GetCaratulaAsync` | GET_SINGLE | `Task<ApiResponseDTO<CaratulaDTO>>` | ⚠ Get sin ByXxx/All |
| ICatalogInspectionAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<CatalogInspectionDTO>>` | ✓ |
| ICatalogInspectionAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ICatalogInspectionAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<List<CatalogInspectionDTO>>>` | ✓ |
| ICatalogInspectionAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<CatalogInspectionDTO>>` | ✓ |
| ICatalogInspectionAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<CatalogInspectionDTO>>` | ✓ |
| ICatalogoEntregaRecepcionDescripcionAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<CatalogoEntregaRecepcionDescripcionDTO>>` | ✓ |
| ICatalogoEntregaRecepcionDescripcionAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ICatalogoEntregaRecepcionDescripcionAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<CatalogoEntregaRecepcionDescripcionDTO[]>>` | ✓ |
| ICatalogoEntregaRecepcionDescripcionAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<CatalogoEntregaRecepcionDescripcionDTO>>` | ✓ |
| ICatalogoEntregaRecepcionDescripcionAppService | `GetGruposAsync` | GET_LIST | `Task<ApiResponseDTO<IEnumerable<object>>>` | ⚠ Get sin ByXxx/All |
| ICatalogoEntregaRecepcionDescripcionAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<CatalogoEntregaRecepcionDescripcionDTO>>` | ✓ |
| IComiteVigilanciaAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<ComiteVigilanciaSavedDTO>>` | ✓ |
| IComiteVigilanciaAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IComiteVigilanciaAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<ComiteVigilanciaDTO[]>>` | ✓ |
| IComiteVigilanciaAppService | `GetAllCommitteesAsync` | GET_LIST | `Task<ApiResponseDTO<IEnumerable<CommitteeDirectoryDTO>>>` | ✓ |
| IComiteVigilanciaAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<ComiteVigilanciaEditDTO>>` | ✓ |
| IComiteVigilanciaAppService | `SendCredentialsAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| IComiteVigilanciaAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<ComiteVigilanciaSavedDTO>>` | ✓ |
| IContratosLegalAppService | `GetContratosPorVencerAsync` | GET_SINGLE | `Task<ApiResponseDTO<ContratosPorVencerResumenDTO>>` | ⚠ Get sin ByXxx/All |
| IContratosLegalAppService | `GetContratosVigentesAsync` | GET_LIST | `Task<ApiResponseDTO<ContratosVigentesResumenDTO>>` | ⚠ Get sin ByXxx/All |
| ICustomDocumentAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<DocumentLegalRecordCreatedDTO>>` | ✓ |
| ICustomDocumentAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ICustomDocumentAppService | `GetAllByCustomerAsync` | GET_LIST | `Task<ApiResponseDTO<List<object>>>` | ✓ |
| ICustomDocumentAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<DocumentLegalRecordAddOrEditDTO>>` | ✓ |
| ICustomDocumentAppService | `GetDocumentPathAsync` | GET_SINGLE | `Task<string>` | ⚠ Get sin ByXxx/All |
| ICustomDocumentAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ICustomDocumentAppService | `UpdateSortOrderAsync` | UPDATE | `Task<ApiResponseDTO<object>>` | ✓ |
| ICustomerInspectionAppService | `GetCustomerInspectionReportDateDTOAsync` | GET_SINGLE | `Task<ApiResponseDTO<CustomerInspectionReportDTO>>` | ⚠ Get sin ByXxx/All |
| ICustomerInspectionAppService | `GetCustomerInspectionReportDTOAsync` | GET_SINGLE | `Task<ApiResponseDTO<CustomerInspectionReportDTO>>` | ⚠ Get sin ByXxx/All |
| ICustomerInspectionAppService | `GetGroupedInspectionDataAsync` | GET_LIST | `Task<ApiResponseDTO<List<GroupedInspectionDataDTO>>>` | ⚠ Get sin ByXxx/All |
| ICustomerInspectionAppService | `GetInspectionsByCustomerAsync` | GET_LIST | `Task<ApiResponseDTO<List<CustomerInspectionDTO>>>` | ✓ |
| ICustomerInspectionAppService | `UpdateInspectionDataAsync` | UPDATE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ICustomerProviderAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ICustomerProviderAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<CustomerProviderAddOrEditDTO>>` | ✓ |
| ICustomerProviderAppService | `GetCustomerProviderDTOAsync` | GET_LIST | `Task<ApiResponseDTO<List<CustomerProviderListDTO>>>` | ⚠ Get sin ByXxx/All |
| ICustomerProviderAppService | `PostAsync` | CREATE | `Task<ApiResponseDTO<CustomerProvider>>` | ✓ |
| ICustomerProviderAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<object>>` | ✓ |
| IDashboardAppService | `GetFiltroMinutasAreaAsync` | GET_LIST | `Task<ApiResponseDTO<List<object>>>` | ⚠ Get sin ByXxx/All |
| IDashboardAppService | `GetGlobalPendingItemsAsync` | GET_LIST | `Task<ApiResponseDTO<List<PendingItemDTO>>>` | ⚠ Get sin ByXxx/All |
| IDiagramDrawService | `CreateDiagramAsync` | CREATE | `Task<ApiResponseDTO<DiagramDrawDTO>>` | ✓ |
| IDiagramDrawService | `DeleteDiagramAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IDiagramDrawService | `GetDiagramByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<DiagramDrawDTO>>` | ✓ |
| IDiagramDrawService | `GetDiagramsAsync` | GET_LIST | `Task<ApiResponseDTO<IEnumerable<DiagramDrawDTO>>>` | ⚠ Get sin ByXxx/All |
| IDiagramDrawService | `UpdateDiagramAsync` | UPDATE | `Task<ApiResponseDTO<DiagramDrawDTO>>` | ✓ |
| IEntradaProductoAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<EntradaProductoDTO>>` | ✓ |
| IEntradaProductoAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IEntradaProductoAppService | `GetAllByCustomerAsync` | GET_LIST | `Task<ApiResponseDTO<EntradaProductoDTO[]>>` | ✓ |
| IEntradaProductoAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<EntradaProductoDTO>>` | ✓ |
| IEntradaProductoAppService | `GetResumenByCustomerAndPeriodoAsync` | GET_SINGLE | `Task<ApiResponseDTO<object>>` | ✓ |
| IEntradaProductoAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<EntradaProductoDTO>>` | ✓ |
| IEntregaRecepcionAppService | `GetExtintoresAsync` | GET_LIST | `Task<ApiResponseDTO<IEnumerable<object>>>` | ⚠ Get sin ByXxx/All |
| IEntregaRecepcionAppService | `GetInventarioEquiposAsync` | GET_LIST | `Task<ApiResponseDTO<IEnumerable<object>>>` | ⚠ Get sin ByXxx/All |
| IEntregaRecepcionAppService | `GetInventarioHerramientasAsync` | GET_LIST | `Task<ApiResponseDTO<IEnumerable<object>>>` | ⚠ Get sin ByXxx/All |
| IEntregaRecepcionAppService | `GetInventarioInstalacionesAsync` | GET_LIST | `Task<ApiResponseDTO<IEnumerable<object>>>` | ⚠ Get sin ByXxx/All |
| IEntregaRecepcionAppService | `GetInventarioInsumosAsync` | GET_LIST | `Task<ApiResponseDTO<IEnumerable<object>>>` | ⚠ Get sin ByXxx/All |
| IEntregaRecepcionAppService | `GetInventarioLlavesAsync` | GET_LIST | `Task<ApiResponseDTO<IEnumerable<object>>>` | ⚠ Get sin ByXxx/All |
| IEntregaRecepcionAppService | `GetInventarioMantenimientosAsync` | GET_LIST | `Task<ApiResponseDTO<IEnumerable<object>>>` | ⚠ Get sin ByXxx/All |
| IEntregaRecepcionAppService | `GetOrganigramaAsync` | GET_LIST | `Task<ApiResponseDTO<IEnumerable<object>>>` | ⚠ Get sin ByXxx/All |
| IEntregaRecepcionAppService | `GetPendientesAsync` | GET_LIST | `Task<ApiResponseDTO<IEnumerable<object>>>` | ⚠ Get sin ByXxx/All |
| IEntregaRecepcionDescripcionAppService | `DeleteFile` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IEntregaRecepcionDescripcionAppService | `FindByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<EntregaRecepcionDescripcionAddOrEditDTO>>` | ✓ |
| IEntregaRecepcionDescripcionAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<object>>` | ✓ |
| IEntregaRecepcionDescripcionAppService | `InvalidarArchivoAsync` | OTHER | `Task<ApiResponseDTO<object>>` | ⚠ naming no CRUD estandar |
| IEntregaRecepcionDescripcionAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<object>>` | ✓ |
| IEntregaRecepcionDescripcionAppService | `ValidarArchivoAsync` | OTHER | `Task<ApiResponseDTO<object>>` | ⚠ naming no CRUD estandar |
| IGanttAppService | `GetGanttDataByCustomerIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<List<GanttTaskDTO>>>` | ✓ |
| IGeneralSummaryService | `EvaluateAreasAsync` | OTHER | `Task<object>` | ⚠ naming no CRUD estandar |
| IGeneralSummaryService | `GeneralResultFilterAsync` | OTHER | `GeneralResultFilterDTO` | ⚠ naming no CRUD estandar |
| IGeneralSummaryService | `GetAreaEvaluationDetailAsync` | GET_SINGLE | `Task<object>` | ⚠ Get sin ByXxx/All |
| IGeneralSummaryService | `GetGeneralResultAsync` | GET_SINGLE | `Task<object>` | ⚠ Get sin ByXxx/All |
| IGeneralSummaryService | `GetMinutesGeneralSummaryAsync` | GET_SINGLE | `Task<object>` | ⚠ Get sin ByXxx/All |
| IGeneralSummaryService | `GetMinutesGeneralSummaryGroupAsync` | GET_SINGLE | `Task<object>` | ⚠ Get sin ByXxx/All |
| IGeneralSummaryService | `GetMinutesSummaryReportAsync` | GET_SINGLE | `Task<object>` | ⚠ Get sin ByXxx/All |
| IGeneralSummaryService | `GetMinutesSummaryReportFilterAsync` | GET_SINGLE | `Task<object>` | ⚠ Get sin ByXxx/All |
| IGeneralSummaryService | `GetPositionAsync` | GET_SINGLE | `Task<object>` | ⚠ Get sin ByXxx/All |
| IGeneralSummaryService | `GetPreventiveSummaryReportAsync` | GET_SINGLE | `Task<object>` | ⚠ Get sin ByXxx/All |
| IGeneralSummaryService | `GetTicketSummaryReportAsync` | GET_SINGLE | `Task<object>` | ⚠ Get sin ByXxx/All |
| IGeneralSummaryService | `GetTicketSummaryReportByCustomerAsync` | GET_SINGLE | `Task<object>` | ✓ |
| IGoogleCalendarEventAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<GoogleCalendarEventDetailDTO>>` | ✓ |
| IGoogleCalendarEventAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IGoogleCalendarEventAppService | `DeleteSeriesAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IGoogleCalendarEventAppService | `GetByCustomerAsync` | GET_LIST | `Task<ApiResponseDTO<List<GoogleCalendarEventListItemDTO>>>` | ✓ |
| IGoogleCalendarEventAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<GoogleCalendarEventDetailDTO>>` | ✓ |
| IGoogleCalendarEventAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<GoogleCalendarEventDetailDTO>>` | ✓ |
| IGoogleCalendarEventAppService | `UpdateSeriesAsync` | UPDATE | `Task<ApiResponseDTO<GoogleCalendarEventDetailDTO>>` | ✓ |
| IGoogleCalendarService | `CreateEventAsync` | CREATE | `Task<GoogleCalendarSyncResultDTO>` | ✓ |
| IGoogleCalendarService | `DeleteEventAsync` | DELETE | `Task` | ✓ |
| IGoogleCalendarService | `GetConnectionStatusAsync` | GET_LIST | `Task<GoogleCalendarConnectionStatusDTO>` | ⚠ Get sin ByXxx/All |
| IGoogleCalendarService | `UpdateEventAsync` | UPDATE | `Task<GoogleCalendarSyncResultDTO>` | ✓ |
| IIncidentAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<IncidentDetailDTO>>` | ✓ |
| IIncidentAppService | `CancelAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| IIncidentAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IIncidentAppService | `GenerateActAsync` | SPECIAL | `Task<byte[]>` | ✓ |
| IIncidentAppService | `GeneratePdfAsync` | SPECIAL | `Task<byte[]>` | ✓ |
| IIncidentAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<IncidentListDTO[]>>` | ✓ |
| IIncidentAppService | `GetByEmployeeAsync` | GET_SINGLE | `Task<ApiResponseDTO<IncidentListDTO[]>>` | ✓ |
| IIncidentAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<IncidentDetailDTO>>` | ✓ |
| IIncidentAppService | `GetDashboardAsync` | GET_SINGLE | `Task<ApiResponseDTO<IncidentDashboardDTO>>` | ⚠ Get sin ByXxx/All |
| IIncidentAppService | `ResolveAsync` | OTHER | `Task<ApiResponseDTO<IncidentDetailDTO>>` | ⚠ naming no CRUD estandar |
| IIncidentAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<IncidentDetailDTO>>` | ✓ |
| IIncidentAppService | `UploadSignedActAsync` | SPECIAL | `Task<ApiResponseDTO<IncidentDetailDTO>>` | ✓ |
| IIncidentAttachmentAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<IncidentAttachmentListDTO>>` | ✓ |
| IIncidentAttachmentAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IIncidentAttachmentAppService | `GetByIncidentAsync` | GET_SINGLE | `Task<ApiResponseDTO<IncidentAttachmentListDTO[]>>` | ✓ |
| IIncidentNotificationService | `NotifyIncidentCreatedAsync` | SPECIAL | `Task` | ✓ |
| IIncidentPdfService | `GeneratePdfAsync` | SPECIAL | `Task<byte[]>` | ✓ |
| IIncidentPdfService | `SavePdfAsync` | UPDATE | `Task<string>` | ✓ |
| IIncidentPdfService | `SaveSignedActAsync` | UPDATE | `Task<string>` | ✓ |
| IIncidentReportAppService | `ExportAsync` | SPECIAL | `Task<FileContentResult>` | ✓ |
| IIncidentReportAppService | `GetPendingInvestigationAsync` | GET_SINGLE | `Task<ApiResponseDTO<IncidentPendingDTO[]>>` | ⚠ Get sin ByXxx/All |
| IIncidentReportAppService | `GetStatsAsync` | GET_LIST | `Task<ApiResponseDTO<IncidentStatsDTO>>` | ⚠ Get sin ByXxx/All |
| IIncidentTypeAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<IncidentTypeDetailDTO>>` | ✓ |
| IIncidentTypeAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IIncidentTypeAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<IncidentTypeListDTO[]>>` | ✓ |
| IIncidentTypeAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<IncidentTypeDetailDTO>>` | ✓ |
| IIncidentTypeAppService | `ToggleActiveAsync` | SPECIAL | `Task<ApiResponseDTO<IncidentTypeDetailDTO>>` | ✓ |
| IIncidentTypeAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<IncidentTypeDetailDTO>>` | ✓ |
| IIncidentWitnessAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<IncidentWitnessListDTO>>` | ✓ |
| IIncidentWitnessAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IIncidentWitnessAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<IncidentWitnessDetailDTO>>` | ✓ |
| IIncidentWitnessAppService | `GetByIncidentAsync` | GET_SINGLE | `Task<ApiResponseDTO<IncidentWitnessListDTO[]>>` | ✓ |
| IIncidentWitnessAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<IncidentWitnessListDTO>>` | ✓ |
| IInspectionAppService | `AddInspectionAsync` | CREATE | `Task<ApiResponseDTO<object>>` | ✓ |
| IInspectionAppService | `AddOrUpdateCondominiumAssetAsync` | CREATE | `Task<ApiResponseDTO<object>>` | ✓ |
| IInspectionAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<List<InspectionListItemDTO>>>` | ✓ |
| IInspectionAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<InspectionEditDTO>>` | ✓ |
| IInspectionAppService | `GetListInspection` | GET_LIST | `Task<ApiResponseDTO<List<Inspection>>>` | ✓ |
| IInspectionAppService | `UpdateInspectionAsync` | UPDATE | `Task<ApiResponseDTO<object>>` | ✓ |
| IInspectionCondominiumAssetAppService | `DeleteInspectionCondominiumAssetAndRelatedDataAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IInspectionCondominiumAssetAppService | `DeleteReviewByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IInspectionCondominiumAssetAppService | `GetInspectionCondominiumAsset` | GET_SINGLE | `Task<ApiResponseDTO<object>>` | ⚠ Get sin ByXxx/All |
| IInspectionCondominiumAssetAppService | `GetInspectionCondominiumAssetDTOAsync` | GET_SINGLE | `Task<ApiResponseDTO<InspectionCondominiumAssetDTO>>` | ⚠ Get sin ByXxx/All |
| IInspectionCondominiumAssetAppService | `InspectionDetailAsync` | OTHER | `Task<ApiResponseDTO<object>>` | ⚠ naming no CRUD estandar |
| IInspectionCondominiumAssetAppService | `UpdateCondominiumAsset` | UPDATE | `Task<ApiResponseDTO<object>>` | ✓ |
| IInspectionResultImageAppService | `DeleteInspectionImageAsync` | DELETE | `Task<ApiResponseDTO<InspectionResultImage>>` | ✓ |
| IInspectionResultImageAppService | `GetListImagesAsync` | GET_LIST | `Task<ApiResponseDTO<List<InspectionImageListDTO>>>` | ✓ |
| IInspectionResultImageAppService | `UpdateInspectionImagesAsync` | UPDATE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IInspectionReviewsCatalogAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<InspectionReviewsCatalog>>` | ✓ |
| IInspectionReviewsCatalogAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IInspectionReviewsCatalogAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<List<InspectionReviewsCatalog>>>` | ✓ |
| IInspectionReviewsCatalogAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<InspectionReviewsCatalog>>` | ✓ |
| IInspectionReviewsCatalogAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<InspectionReviewsCatalog>>` | ✓ |
| IInventarioIluminacionAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<LightingStock>>` | ✓ |
| IInventarioIluminacionAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IInventarioIluminacionAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<object>>` | ✓ |
| IInventarioIluminacionAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<InventarioIluminacionDTO>>` | ✓ |
| IInventarioIluminacionAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<LightingStock>>` | ✓ |
| IInventarioLlaveAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<KeyInventory>>` | ✓ |
| IInventarioLlaveAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IInventarioLlaveAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<InventarioLlaveDTO[]>>` | ✓ |
| IInventarioLlaveAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<InventarioLlaveDTO>>` | ✓ |
| IInventarioLlaveAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<KeyInventory>>` | ✓ |
| IInventarioPinturaAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<PaintStock>>` | ✓ |
| IInventarioPinturaAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IInventarioPinturaAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<object>>` | ✓ |
| IInventarioPinturaAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<InventarioPinturaDTO>>` | ✓ |
| IInventarioPinturaAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<PaintStock>>` | ✓ |
| IInvitationAppService | `GetByVisitAsync` | GET_LIST | `Task<ApiResponseDTO<List<InvitationDTO>>>` | ✓ |
| IInvitationAppService | `ResendInvitationAsync` | OTHER | `Task<ApiResponseDTO<InvitationDTO>>` | ⚠ naming no CRUD estandar |
| IInvitationAppService | `SendInvitationAsync` | SPECIAL | `Task<ApiResponseDTO<InvitationDTO>>` | ✓ |
| IJuntaMensualSessionAppService | `CancelAsync` | SPECIAL | `Task<ApiResponseDTO<JuntaMensualSessionDTO>>` | ✓ |
| IJuntaMensualSessionAppService | `CreateFromAgendaAsync` | CREATE | `Task<ApiResponseDTO<JuntaMensualSessionDTO>>` | ✓ |
| IJuntaMensualSessionAppService | `CreateMeetingAsync` | CREATE | `Task<ApiResponseDTO<JuntaMensualSessionDTO>>` | ✓ |
| IJuntaMensualSessionAppService | `GetAccessibleAsync` | GET_LIST | `Task<ApiResponseDTO<List<JuntaMensualSessionDTO>>>` | ⚠ Get sin ByXxx/All |
| IJuntaMensualSessionAppService | `GetByCustomerAsync` | GET_LIST | `Task<ApiResponseDTO<List<JuntaMensualSessionDTO>>>` | ✓ |
| IJuntaMensualSessionAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<JuntaMensualSessionDTO>>` | ✓ |
| IJuntaMensualSessionAppService | `GetDetailByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<JuntaMensualSessionDetailDTO>>` | ✓ |
| IJuntaMensualSessionAppService | `LinkMeetingAsync` | OTHER | `Task<ApiResponseDTO<JuntaMensualSessionDTO>>` | ⚠ naming no CRUD estandar |
| IJuntaMensualSessionAppService | `LinkPresentationAsync` | OTHER | `Task<ApiResponseDTO<JuntaMensualSessionDTO>>` | ⚠ naming no CRUD estandar |
| IJuntaMensualSessionAppService | `RescheduleAsync` | OTHER | `Task<ApiResponseDTO<JuntaMensualSessionDTO>>` | ⚠ naming no CRUD estandar |
| IJuntaMensualSessionBackfillAppService | `ApplyAsync` | SPECIAL | `Task<ApiResponseDTO<JuntaMensualSessionDTO>>` | ✓ |
| IJuntaMensualSessionBackfillAppService | `PreviewAsync` | SPECIAL | `Task<ApiResponseDTO<List<JuntaMensualSessionBackfillCandidateDTO>>>` | ✓ |
| IJuntaMensualSessionMaintenanceAppService | `CleanupFutureEmptySessionsAsync` | SPECIAL | `Task` | ✓ |
| IMeetingAdministracionAppService | `AddParticipanteAdministracionAsync` | CREATE | `Task<ApiResponseDTO<MeetingAdministracion>>` | ✓ |
| IMeetingAdministracionAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IMeetingAdministracionAppService | `GetParticipantesAdministracionAsync` | GET_LIST | `Task<ApiResponseDTO<List<object>>>` | ⚠ Get sin ByXxx/All |
| IMeetingAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<MeetingHeaderDTO>>` | ✓ |
| IMeetingAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IMeetingAppService | `EnviarEmailPendientesResponsable` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| IMeetingAppService | `FindByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<MeetingHeaderDTO>>` | ✓ |
| IMeetingAppService | `GetMeetingDetailsById` | GET_SINGLE | `ApiResponseDTO<MeetingDTO>` | ✓ |
| IMeetingAppService | `GetMeetingReportPdf` | GET_SINGLE | `ApiResponseDTO<CreateMinutaPdfDTO>` | ⚠ Get sin ByXxx/All |
| IMeetingAppService | `GetSeguimientoMinutasAsync` | GET_LIST | `Task<ApiResponseDTO<List<SeguimientoMinutasDTO>>>` | ⚠ Get sin ByXxx/All |
| IMeetingAppService | `list` | OTHER | `ApiResponseDTO<List<MeetingDTO>>` | ⚠ naming no CRUD estandar |
| IMeetingAppService | `MinutaAllPendientes` | OTHER | `ApiResponseDTO<object>` | ⚠ naming no CRUD estandar |
| IMeetingAppService | `MinutaPendientes` | OTHER | `ApiResponseDTO<object>` | ⚠ naming no CRUD estandar |
| IMeetingAppService | `OnSendEmailResponsible` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| IMeetingAppService | `SendEmailAllPendingMeeting` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| IMeetingAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<MeetingHeaderDTO>>` | ✓ |
| IMeetingComiteAppService | `AddParticipanteComiteAsync` | CREATE | `Task<ApiResponseDTO<MeetingComite>>` | ✓ |
| IMeetingComiteAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IMeetingComiteAppService | `GetParticipantesComiteAsync` | GET_LIST | `Task<ApiResponseDTO<List<object>>>` | ⚠ Get sin ByXxx/All |
| IMeetingDetailsAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<MeetingDetails>>` | ✓ |
| IMeetingDetailsAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IMeetingDetailsAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<List<MettingetailsDTO>>>` | ✓ |
| IMeetingDetailsAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<MeetingDetailsAddOrEditDTO>>` | ✓ |
| IMeetingDetailsAppService | `GetMeetingLegalDTOAsync` | GET_LIST | `Task<ApiResponseDTO<List<MeetingLegalDTO>>>` | ⚠ Get sin ByXxx/All |
| IMeetingDetailsAppService | `MinutasFiltroAsync` | OTHER | `Task<ApiResponseDTO<List<object>>>` | ⚠ naming no CRUD estandar |
| IMeetingDetailsAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<MeetingDetails>>` | ✓ |
| IMeetingDetailsSeguimientoAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<MeetingDetailsSeguimiento>>` | ✓ |
| IMeetingDetailsSeguimientoAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IMeetingDetailsSeguimientoAppService | `ExportSummaryToExcelAsync` | SPECIAL | `Task<byte[]>` | ✓ |
| IMeetingDetailsSeguimientoAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<MeetingDetailFollowUpsDTO[]>>` | ✓ |
| IMeetingDetailsSeguimientoAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<MeetingDetailFollowUpsDTO>>` | ✓ |
| IMeetingDetailsSeguimientoAppService | `ResumenMinutaPresentacionAsync` | SPECIAL | `Task<ApiResponseDTO<List<object>>>` | ✓ |
| IMeetingDetailsSeguimientoAppService | `ResumenMinutasGraficoPresentacionAsync` | SPECIAL | `Task<ApiResponseDTO<List<object>>>` | ✓ |
| IMeetingDetailsSeguimientoAppService | `ResumenMinutasPresentacionAsync` | SPECIAL | `Task<ApiResponseDTO<List<object>>>` | ✓ |
| IMeetingDetailsSeguimientoAppService | `ResumenPreventivosGraficoPresentacionAsync` | SPECIAL | `Task<ApiResponseDTO<List<object>>>` | ✓ |
| IMeetingDetailsSeguimientoAppService | `ResumenPreventivosPresentacionAsync` | SPECIAL | `Task<ApiResponseDTO<List<object>>>` | ✓ |
| IMeetingDetailsSeguimientoAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<MeetingDetailsSeguimiento>>` | ✓ |
| IMeetingInvitadoAppService | `AddParticipanteInvitadoAsync` | CREATE | `Task<ApiResponseDTO<MeetingInvitado>>` | ✓ |
| IMeetingInvitadoAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IMeetingInvitadoAppService | `GetParticipantesInvitadoAsync` | GET_LIST | `Task<ApiResponseDTO<List<object>>>` | ⚠ Get sin ByXxx/All |
| IOwnerAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<OwnerDTO>>` | ✓ |
| IOwnerAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IOwnerAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<List<OwnerDTO>>>` | ✓ |
| IOwnerAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<OwnerAddOrEditDTO>>` | ✓ |
| IOwnerAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<OwnerDTO>>` | ✓ |
| IPanicAlertAppService | `AttendAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| IPanicAlertAppService | `CreateAsync` | CREATE | `Task<ApiResponseDTO<PanicAlertDTO>>` | ✓ |
| IPanicAlertAppService | `GetActiveAsync` | GET_LIST | `Task<ApiResponseDTO<List<PanicAlertDTO>>>` | ⚠ Get sin ByXxx/All |
| IPanicAlertAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<PanicAlertDTO>>` | ✓ |
| IPanicAlertAppService | `GetHistoryAsync` | GET_LIST | `Task<ApiResponseDTO<List<PanicAlertDTO>>>` | ⚠ Get sin ByXxx/All |
| IPanicAlertAppService | `ResolveAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| IPanicAlertNotificationService | `NotifyEmitterAsync` | SPECIAL | `Task` | ✓ |
| IPanicAlertNotificationService | `NotifyRecipientsAsync` | SPECIAL | `Task` | ✓ |
| IPendingTaskReportAppService | `SendPendingTaskReportAsync` | SPECIAL | `Task` | ✓ |
| IPersonalAusenteAppService | `GetPersonalAusenteAsync` | GET_SINGLE | `Task<ApiResponseDTO<PersonalAusenteResumenDTO>>` | ⚠ Get sin ByXxx/All |
| IPresentacionJuntaComiteAppService | `AddFechaAsync` | CREATE | `Task<ApiResponseDTO<PresentacionJuntaComite>>` | ✓ |
| IPresentacionJuntaComiteAppService | `AddFileAsync` | CREATE | `Task<ApiResponseDTO<PresentacionJuntaComite>>` | ✓ |
| IPresentacionJuntaComiteAppService | `AutorizarPresentacionAsync` | OTHER | `Task<ApiResponseDTO<PresentacionJuntaComite>>` | ⚠ naming no CRUD estandar |
| IPresentacionJuntaComiteAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IPresentacionJuntaComiteAppService | `DeletePdfAsync` | DELETE | `Task<ApiResponseDTO<PresentacionJuntaComite>>` | ✓ |
| IPresentacionJuntaComiteAppService | `GeneralesAsync` | OTHER | `Task<ApiResponseDTO<List<object>>>` | ⚠ naming no CRUD estandar |
| IPresentacionJuntaComiteAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<List<PresentacionJuntaComiteDTO>>>` | ✓ |
| IPresentacionJuntaComiteAppService | `GetBodyEmailEstadosFinancierosCondominos` | GET_LIST | `string` | ⚠ Get sin ByXxx/All |
| IPresentacionJuntaComiteAppService | `GetBodyEmailEstadosFinancierosTesorero` | GET_SINGLE | `string` | ⚠ Get sin ByXxx/All |
| IPresentacionJuntaComiteAppService | `GetBodyEmailPresentacionComite` | GET_SINGLE | `string` | ⚠ Get sin ByXxx/All |
| IPresentacionJuntaComiteAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<PresentacionJuntaComiteDTO>>` | ✓ |
| IPresentacionJuntaComiteAppService | `UpdateFechaAsync` | UPDATE | `Task<ApiResponseDTO<PresentacionJuntaComite>>` | ✓ |
| IProductAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<Producto>>` | ✓ |
| IProductAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IProductAppService | `GetAutoCompleteSelectItemAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>>` | ⚠ Get sin ByXxx/All |
| IProductAppService | `GetMachinerySelectItemAsync` | GET_SINGLE | `Task<ApiResponseDTO<SelectItemDTO<Guid>>>` | ⚠ Get sin ByXxx/All |
| IProductAppService | `GetProductAsync` | GET_SINGLE | `Task<ApiResponseDTO<ProductoDTO>>` | ⚠ Get sin ByXxx/All |
| IProductAppService | `GetProductsAsync` | GET_LIST | `Task<ApiResponseDTO<ProductoIndexDTO[]>>` | ⚠ Get sin ByXxx/All |
| IProductAppService | `GetProductsPagedAsync` | GET_LIST | `Task<ApiResponseDTO<PagedResultDTO<ProductoIndexDTO>>>` | ✓ |
| IProductAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<Producto>>` | ✓ |
| IPropertyAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<PropertyDTO>>` | ✓ |
| IPropertyAppService | `AssignAccountNumberAsync` | SPECIAL | `Task<ApiResponseDTO<PropertyDTO>>` | ✓ |
| IPropertyAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IPropertyAppService | `DownloadTemplateAsync` | SPECIAL | `Task<FileDownloadDTO>` | ✓ |
| IPropertyAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<PropertyDTO[]>>` | ✓ |
| IPropertyAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<PropertyDTO>>` | ✓ |
| IPropertyAppService | `ImportPropertiesFromExcelAsync` | SPECIAL | `Task<ImportPropertiesResultDTO>` | ✓ |
| IPropertyAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<PropertyDTO>>` | ✓ |
| IPropertyOccupantAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<PropertyOccupantDTO>>` | ✓ |
| IPropertyOccupantAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IPropertyOccupantAppService | `GetAllByPropertyIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<List<PropertyOccupantDTO>>>` | ✓ |
| IPropertyOccupantAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<PropertyOccupantDTO>>` | ✓ |
| IPropertyOccupantAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<PropertyOccupantDTO>>` | ✓ |
| IRadioComunicacionAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<RadioComunicacion>>` | ✓ |
| IRadioComunicacionAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<RadioComunicacion>>` | ✓ |
| IRadioComunicacionAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<RadioComunicacionDTO[]>>` | ✓ |
| IRadioComunicacionAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<RadioComunicacionItemDTO>>` | ✓ |
| IRadioComunicacionAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<RadioComunicacion>>` | ✓ |
| IReclutamientoResumenAppService | `GetVacantesPendientesAsync` | GET_LIST | `Task<ApiResponseDTO<VacantesResumenDTO>>` | ⚠ Get sin ByXxx/All |
| IRecurringTaskCatalogAppService | `CreateAsync` | CREATE | `Task<ApiResponseDTO<RecurringTaskTemplateDTO>>` | ✓ |
| IRecurringTaskCatalogAppService | `GetAllByCustomerAsync` | GET_LIST | `Task<ApiResponseDTO<List<RecurringTaskTemplateDTO>>>` | ✓ |
| IRecurringTaskCatalogAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<RecurringTaskTemplateDTO>>` | ✓ |
| IRecurringTaskCatalogAppService | `ToggleStatusAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| IRecurringTaskCatalogAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<RecurringTaskTemplateDTO>>` | ✓ |
| IRecurringTaskComplianceAppService | `GetDashboardAsync` | GET_SINGLE | `Task<ApiResponseDTO<ComplianceDashboardDTO>>` | ⚠ Get sin ByXxx/All |
| IRecurringTaskGenerationService | `GenerateAsync` | SPECIAL | `Task<RecurringTaskGenerationRunResult>` | ✓ |
| ISalidaProductoAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<SalidaProducto>>` | ✓ |
| ISalidaProductoAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<SalidaProducto>>` | ✓ |
| ISalidaProductoAppService | `GenerateReportAsync` | SPECIAL | `Task<ApiResponseDTO<byte[]>>` | ✓ |
| ISalidaProductoAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<SalidaProductoDTO>>` | ✓ |
| ISalidaProductoAppService | `GetPagedByCustomerIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<PagedResultDTO<SalidaProductoDTO>>>` | ✓ |
| ISalidaProductoAppService | `RealizarDevolucionAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| ISalidaProductoAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<SalidaProducto>>` | ✓ |
| ISanctionAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<SanctionDetailDTO>>` | ✓ |
| ISanctionAppService | `ChangeStatusAsync` | UPDATE | `Task<ApiResponseDTO<SanctionDetailDTO>>` | ✓ |
| ISanctionAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ISanctionAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<SanctionListDTO[]>>` | ✓ |
| ISanctionAppService | `GetByEmployeeAsync` | GET_SINGLE | `Task<ApiResponseDTO<SanctionListDTO[]>>` | ✓ |
| ISanctionAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<SanctionDetailDTO>>` | ✓ |
| ISanctionAppService | `GetExpiringAsync` | GET_SINGLE | `Task<ApiResponseDTO<SanctionListDTO[]>>` | ⚠ Get sin ByXxx/All |
| ISanctionNotificationService | `NotifySanctionAppliedAsync` | SPECIAL | `Task` | ✓ |
| IScheduledTaskService | `MarkInactiveUsersOfflineAsync` | OTHER | `Task` | ⚠ naming no CRUD estandar |
| IScheduledTaskService | `OnValidateForCustomer` | OTHER | `Task` | ⚠ naming no CRUD estandar |
| IScheduledTaskService | `SendContractsAndPoliciesExpirationNotificationsAsync` | SPECIAL | `Task` | ✓ |
| IScheduledTaskService | `SendLegalReportAsync` | SPECIAL | `Task` | ✓ |
| IScheduledTaskService | `SendLegalTicketReportToCustomerAsync` | SPECIAL | `Task` | ✓ |
| IScheduledTaskService | `SendPendingTicketGroupReportAsync` | SPECIAL | `Task` | ✓ |
| IScheduledTaskService | `SendRecruitmentReportAsync` | SPECIAL | `Task` | ✓ |
| IScheduledTaskService | `SendTestEmailAsync` | SPECIAL | `Task` | ✓ |
| IScheduledTaskService | `SendVacanciesReportAsync` | SPECIAL | `Task` | ✓ |
| IServiceOrderAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<ServiceOrder>>` | ✓ |
| IServiceOrderAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<object>>` | ✓ |
| IServiceOrderAppService | `DeleteDocumentAsync` | DELETE | `Task<ApiResponseDTO<object>>` | ✓ |
| IServiceOrderAppService | `DeleteImgAsync` | DELETE | `Task<ApiResponseDTO<object>>` | ✓ |
| IServiceOrderAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<List<ServiceOrderDTO>>>` | ✓ |
| IServiceOrderAppService | `GetAllPinturaAsync` | GET_LIST | `Task<ApiResponseDTO<List<ServiceOrderDTO>>>` | ✓ |
| IServiceOrderAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<ServiceOrderDTO>>` | ✓ |
| IServiceOrderAppService | `GetPendingPreventiveAsync` | GET_LIST | `Task<ApiResponseDTO<List<ServiceOrderDTO>>>` | ⚠ Get sin ByXxx/All |
| IServiceOrderAppService | `GetServiceOrderInforme` | GET_LIST | `ApiResponseDTO<IEnumerable<ServiceOrderInformeDTO>>` | ⚠ Get sin ByXxx/All |
| IServiceOrderAppService | `GetServiceOrderSupportAsync` | GET_SINGLE | `Task<ApiResponseDTO<object>>` | ⚠ Get sin ByXxx/All |
| IServiceOrderAppService | `OnGetUserSelectItemAsync` | OTHER | `Task<ApiResponseDTO<SelectItemDTO<string>>>` | ⚠ naming no CRUD estandar |
| IServiceOrderAppService | `OrdenesServicioFotosAsync` | OTHER | `Task<ApiResponseDTO<List<object>>>` | ⚠ naming no CRUD estandar |
| IServiceOrderAppService | `OrdenesServicioReporteProveedorAsync` | OTHER | `Task<ApiResponseDTO<List<object>>>` | ⚠ naming no CRUD estandar |
| IServiceOrderAppService | `SubirDocumentoAsync` | OTHER | `Task<ApiResponseDTO<ServiceOrder>>` | ⚠ naming no CRUD estandar |
| IServiceOrderAppService | `SubirImgAsync` | OTHER | `Task<ApiResponseDTO<ServiceOrder>>` | ⚠ naming no CRUD estandar |
| IServiceOrderAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<ServiceOrder>>` | ✓ |
| IServiceOrderAppService | `UpdateCalendarIdAsync` | UPDATE | `Task<ApiResponseDTO<List<object>>>` | ✓ |
| IServiceOrderAppService | `UpdateCalendarioId` | UPDATE | `ApiResponseDTO<bool>` | ✓ |
| IStockPorAlmacenAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<WarehouseStock>>` | ✓ |
| IStockPorAlmacenAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IStockPorAlmacenAppService | `GetAllInventarioProductoAsync` | GET_LIST | `Task<ApiResponseDTO<List<StockPorAlmacenIndexDTO>>>` | ✓ |
| IStockPorAlmacenAppService | `GetAllInventarioProductoPagedAsync` | GET_LIST | `Task<ApiResponseDTO<PagedResultDTO<StockPorAlmacenIndexDTO>>>` | ✓ |
| IStockPorAlmacenAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<StockPorAlmacenDTO>>` | ✓ |
| IStockPorAlmacenAppService | `GetExistenciaProductoAsync` | GET_SINGLE | `Task<ApiResponseDTO<StockPorAlmacenDTO>>` | ⚠ Get sin ByXxx/All |
| IStockPorAlmacenAppService | `GetProductoDropdownDTOAsync` | GET_LIST | `Task<ApiResponseDTO<List<ProductoListAddDTO>>>` | ⚠ Get sin ByXxx/All |
| IStockPorAlmacenAppService | `GetProductoDropdownPagedAsync` | GET_SINGLE | `Task<ApiResponseDTO<ProductoDropdownListDTO>>` | ✓ |
| IStockPorAlmacenAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<WarehouseStock>>` | ✓ |
| ISupervisionReportsAppService | `GetEstadosFinancierosAsync` | GET_LIST | `Task<ApiResponseDTO<List<object>>>` | ⚠ Get sin ByXxx/All |
| ISupervisionReportsAppService | `GetPendingLegalAsync` | GET_LIST | `Task<ApiResponseDTO<List<object>>>` | ⚠ Get sin ByXxx/All |
| ISupervisionReportsAppService | `GetPendingMinutesAsync` | GET_LIST | `Task<ApiResponseDTO<List<object>>>` | ⚠ Get sin ByXxx/All |
| ISupervisionReportsAppService | `GetPendingTicketsAsync` | GET_LIST | `Task<ApiResponseDTO<List<object>>>` | ⚠ Get sin ByXxx/All |
| ISuspensionDayAppService | `AddBulkAsync` | CREATE | `Task<ApiResponseDTO<SuspensionDayDetailDTO[]>>` | ✓ |
| ISuspensionDayAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ISuspensionDayAppService | `GetByIncidentAsync` | GET_SINGLE | `Task<ApiResponseDTO<SuspensionDayDetailDTO[]>>` | ✓ |
| ITareasLegalAppService | `GetTareasActivasAsync` | GET_LIST | `Task<ApiResponseDTO<TareasLegalResumenDTO>>` | ⚠ Get sin ByXxx/All |
| ITaskAlertEngineService | `RunAsync` | SPECIAL | `Task<TaskAlertEngineRunResult>` | ✓ |
| ITaskAppService | `ClearDependencyAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| ITaskAppService | `CloseTaskAsync` | SPECIAL | `Task<ApiResponseDTO<TasksCloseDTO>>` | ✓ |
| ITaskAppService | `CreateTaskAsync` | CREATE | `Task<ApiResponseDTO<TasksAddOrEditDTO>>` | ✓ |
| ITaskAppService | `DeleteTaskAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ITaskAppService | `GetAvailablePredecessorsAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<string>>>>` | ⚠ Get sin ByXxx/All |
| ITaskAppService | `GetByClosedAsync` | GET_SINGLE | `Task<ApiResponseDTO<TasksCloseDTO>>` | ✓ |
| ITaskAppService | `GetByIdTaskViewDTO` | GET_SINGLE | `Task<ApiResponseDTO<TasksViewDTO>>` | ✓ |
| ITaskAppService | `GetByIdWithGroupAsync` | GET_SINGLE | `Task<ApiResponseDTO<TasksAddOrEditDTO>>` | ✓ |
| ITaskAppService | `GetLegalPendingReportAsync` | GET_LIST | `Task<ApiResponseDTO<List<LegalPendingReportItemDTO>>>` | ⚠ Get sin ByXxx/All |
| ITaskAppService | `GetLegalTasksAllAsync` | GET_LIST | `Task<ApiResponseDTO<List<LegalTaskListItemDTO>>>` | ✓ |
| ITaskAppService | `GetLegalTasksByCustomerAsync` | GET_LIST | `Task<ApiResponseDTO<List<LegalTaskListItemDTO>>>` | ✓ |
| ITaskAppService | `GetListMyAssignedTasksAsync` | GET_LIST | `Task<ApiResponseDTO<IEnumerable<MyAssignedTasksDTO>>>` | ✓ |
| ITaskAppService | `GetListMyRequestAsync` | GET_LIST | `Task<ApiResponseDTO<IEnumerable<MyRequestTasksDTO>>>` | ✓ |
| ITaskAppService | `GetPathReportAsync` | GET_SINGLE | `Task<ApiResponseDTO<string>>` | ⚠ Get sin ByXxx/All |
| ITaskAppService | `GetTasksByCustomerAsync` | GET_LIST | `Task<ApiResponseDTO<IEnumerable<TaskMonitoringDTO>>>` | ✓ |
| ITaskAppService | `GetTaskStatusAsync` | GET_LIST | `Task<ApiResponseDTO<int>>` | ⚠ Get sin ByXxx/All |
| ITaskAppService | `InProgressAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| ITaskAppService | `ListTaskAsync` | OTHER | `Task<ApiResponseDTO<TasksListDTO>>` | ⚠ naming no CRUD estandar |
| ITaskAppService | `MyTaskProgramationAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| ITaskAppService | `OnUpdatePriority` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| ITaskAppService | `ParticipanAsync` | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<string>>>>` | ⚠ naming no CRUD estandar |
| ITaskAppService | `ProgramationAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| ITaskAppService | `ProgramationGetByIdAsync` | OTHER | `Task<ApiResponseDTO<object>>` | ⚠ naming no CRUD estandar |
| ITaskAppService | `ReopenAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| ITaskAppService | `SetDependencyAsync` | UPDATE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ITaskAppService | `UpdateOrderAsync` | UPDATE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ITaskAppService | `UpdateRelevanceAsync` | UPDATE | `Task<ApiResponseDTO<TasksAddOrEditDTO>>` | ✓ |
| ITaskAppService | `UpdateTaskAsync` | UPDATE | `Task<ApiResponseDTO<TasksAddOrEditDTO>>` | ✓ |
| ITaskAppService | `UpdateTaskCustomerAsync` | UPDATE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ITaskAppService | `UpdateTaskStatusAsync` | UPDATE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ITaskAttachmentAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ITaskAttachmentAppService | `GetByTaskIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<List<TaskAttachmentFileDTO>>>` | ✓ |
| ITaskAttachmentAppService | `UploadAsync` | SPECIAL | `Task<ApiResponseDTO<TaskAttachmentFileDTO>>` | ✓ |
| ITaskChecklistAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<TaskChecklistItemDTO>>` | ✓ |
| ITaskChecklistAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ITaskChecklistAppService | `GetByTaskIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<List<TaskChecklistItemDTO>>>` | ✓ |
| ITaskChecklistAppService | `ToggleDoneAsync` | SPECIAL | `Task<ApiResponseDTO<TaskChecklistItemDTO>>` | ✓ |
| ITaskEscalationService | `RunAsync` | SPECIAL | `Task<TaskEscalationRunResult>` | ✓ |
| ITaskFollowUpAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ITaskFollowUpAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ITaskFollowUpAppService | `ListAsync` | OTHER | `Task<ApiResponseDTO<List<TaskFollowUpDTO>>>` | ⚠ naming no CRUD estandar |
| ITaskGroupAppService | `CreateAsync` | CREATE | `Task<ApiResponseDTO<WorkGroup>>` | ✓ |
| ITaskGroupAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<WorkGroup>>` | ✓ |
| ITaskGroupAppService | `GetAllByClientAsync` | GET_LIST | `Task<ApiResponseDTO<List<TaskGroupDTO>>>` | ✓ |
| ITaskGroupAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<TaskGroupAddOrEditDTO>>` | ✓ |
| ITaskGroupAppService | `GetCustomerIdByTaskGroupIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<Guid>>` | ✓ |
| ITaskGroupAppService | `ToggleStatusAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| ITaskGroupAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<TaskGroupAddOrEditDTO>>` | ✓ |
| ITaskGroupCategoryAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<TaskGroupCategoryDTO>>` | ✓ |
| ITaskGroupCategoryAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ITaskGroupCategoryAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<TaskGroupCategoryDTO[]>>` | ✓ |
| ITaskGroupCategoryAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<TaskGroupCategoryAddOrEditDTO>>` | ✓ |
| ITaskGroupCategoryAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<TaskGroupCategoryDTO>>` | ✓ |
| ITaskGroupMemberAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ITaskGroupMemberAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ITaskGroupMemberAppService | `GetAvailableParticipantsAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<string>>>>` | ⚠ Get sin ByXxx/All |
| ITaskGroupMemberAppService | `GetExistingParticipantsAsync` | GET_LIST | `Task<ApiResponseDTO<List<WorkGroupMembersDTO>>>` | ⚠ Get sin ByXxx/All |
| ITaskGroupMemberAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ITaskJustificationService | `ApproveAsync` | SPECIAL | `Task<ApiResponseDTO<TaskJustificationDTO>>` | ✓ |
| ITaskJustificationService | `GetByTaskIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<List<TaskJustificationDTO>>>` | ✓ |
| ITaskJustificationService | `RejectAsync` | SPECIAL | `Task<ApiResponseDTO<TaskJustificationDTO>>` | ✓ |
| ITaskJustificationService | `RequestAsync` | OTHER | `Task<ApiResponseDTO<TaskJustificationDTO>>` | ⚠ naming no CRUD estandar |
| ITaskLegalAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<object>>` | ✓ |
| ITaskLegalAppService | `CategoryAsync` | OTHER | `Task<ApiResponseDTO<LegalMatterCategoryAddOrEditDTO>>` | ⚠ naming no CRUD estandar |
| ITaskLegalAppService | `CreateCategoryAsync` | CREATE | `Task<ApiResponseDTO<LegalMatterCategory>>` | ✓ |
| ITaskLegalAppService | `CreateLegalTaskAsync` | CREATE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ITaskLegalAppService | `CreatePdf` | CREATE | `void` | ✓ |
| ITaskLegalAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ITaskLegalAppService | `DeleteCategoryByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ITaskLegalAppService | `GetlegalMatterAddDTOAsync` | GET_SINGLE | `Task<ApiResponseDTO<LegalMatterAddDTO>>` | ⚠ Get sin ByXxx/All |
| ITaskLegalAppService | `GetListEmployeeLegal` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<string>>>>` | ✓ |
| ITaskLegalAppService | `GetListLegalMatter` | GET_LIST | `Task<ApiResponseDTO<List<LegalMatterCategoryWithMattersDTO>>>` | ✓ |
| ITaskLegalAppService | `ObtenerResumenTickets` | OTHER | `Task<ApiResponseDTO<object>>` | ⚠ naming no CRUD estandar |
| ITaskLegalAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<object>>` | ✓ |
| ITaskLegalAppService | `UpdateCategoryAsync` | UPDATE | `Task<ApiResponseDTO<LegalMatterCategory>>` | ✓ |
| ITaskMessageReadAppService | `GetByTaskMessageIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<List<object>>>` | ✓ |
| ITasksReportAppService | `GetReportClientAsync` | GET_SINGLE | `Task<ApiResponseDTO<object>>` | ⚠ Get sin ByXxx/All |
| ITasksReportAppService | `GetTaskReportAsync` | GET_SINGLE | `Task<ApiResponseDTO<object>>` | ⚠ Get sin ByXxx/All |
| ITasksReportAppService | `WeeklyReportAsync` | OTHER | `Task<ApiResponseDTO<object>>` | ⚠ naming no CRUD estandar |
| ITasksReportAppService | `WeeklyReportPreviewAsync` | OTHER | `Task<ApiResponseDTO<object>>` | ⚠ naming no CRUD estandar |
| ITaskWorkPlanAppService | `CreateWeeklyWorkPlanAsync` | CREATE | `Task<ApiResponseDTO<TaskWorkPlan>>` | ✓ |
| ITaskWorkPlanAppService | `GetPendingAsync` | GET_LIST | `Task<ApiResponseDTO<List<object>>>` | ⚠ Get sin ByXxx/All |
| ITaskWorkPlanAppService | `WeeklyReportPreviewAsync` | OTHER | `Task<ApiResponseDTO<object>>` | ⚠ naming no CRUD estandar |
| IVisitAppService | `CancelVisitAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| IVisitAppService | `CreateVisitAsync` | CREATE | `Task<ApiResponseDTO<VisitDTO>>` | ✓ |
| IVisitAppService | `GetActiveVisitsAsync` | GET_LIST | `Task<ApiResponseDTO<List<VisitDTO>>>` | ⚠ Get sin ByXxx/All |
| IVisitAppService | `GetVisitByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<VisitDTO>>` | ✓ |
| IVisitAppService | `GetVisitsPagedAsync` | GET_LIST | `Task<ApiResponseDTO<PagedResultDTO<VisitDTO>>>` | ✓ |
| IVisitorService | `CreateAsync` | CREATE | `Task<ApiResponseDTO<VisitorDTO>>` | ✓ |
| IVisitorService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<List<VisitorDTO>>>` | ✓ |
| IVisitorService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<VisitorDTO>>` | ✓ |
| IVisitorService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<VisitorDTO>>` | ✓ |
| IWarehouseAuthorizationService | `IsUserAuthorizedForWarehouseAsync` | OTHER | `Task<bool>` | ⚠ naming no CRUD estandar |
| MeetingDertailsSeguimientoAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<MeetingDetailsSeguimiento>>` | ✓ |
| MeetingDertailsSeguimientoAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| MeetingDertailsSeguimientoAppService | `ExportSummaryToExcelAsync` | SPECIAL | `Task<byte[]>` | ✓ |
| MeetingDertailsSeguimientoAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<MeetingDetailFollowUpsDTO[]>>` | ✓ |
| MeetingDertailsSeguimientoAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<MeetingDetailFollowUpsDTO>>` | ✓ |
| MeetingDertailsSeguimientoAppService | `ResumenMinutaPresentacionAsync` | SPECIAL | `Task<ApiResponseDTO<List<object>>>` | ✓ |
| MeetingDertailsSeguimientoAppService | `ResumenMinutasGraficoPresentacionAsync` | SPECIAL | `Task<ApiResponseDTO<List<object>>>` | ✓ |
| MeetingDertailsSeguimientoAppService | `ResumenMinutasPresentacionAsync` | SPECIAL | `Task<ApiResponseDTO<List<object>>>` | ✓ |
| MeetingDertailsSeguimientoAppService | `ResumenPreventivosGraficoPresentacionAsync` | SPECIAL | `Task<ApiResponseDTO<List<object>>>` | ✓ |
| MeetingDertailsSeguimientoAppService | `ResumenPreventivosPresentacionAsync` | SPECIAL | `Task<ApiResponseDTO<List<object>>>` | ✓ |
| MeetingDertailsSeguimientoAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<MeetingDetailsSeguimiento>>` | ✓ |
| RecurringTaskGenerationService | `AdjustForBusinessDay` | SPECIAL | `DateOnly` | ✓ |
| RecurringTaskGenerationService | `GetOccurrences` | GET_LIST | `List<DateOnly>` | ⚠ Get sin ByXxx/All |
| RecurringTaskGenerationService | `ProcessTemplateAsync` | SPECIAL | `Task<TemplateGenerationResult>` | ✓ |
| RecurringTaskGenerationService | `ResolvePrincipalResponsibleAsync` | OTHER | `Task<string>` | ⚠ naming no CRUD estandar |
| RecurringTaskGenerationService | `ToRunResult` | OTHER | `RecurringTaskGenerationRunResult` | ⚠ naming no CRUD estandar |
| TaskAlertEngineService | `Count` | GET_SINGLE | `void` | ✓ |
| TaskAlertEngineService | `ToRunResult` | OTHER | `TaskAlertEngineRunResult` | ⚠ naming no CRUD estandar |
| TaskAppService | `SaveChanged` | UPDATE | `Task` | ✓ |
| TaskEscalationService | `ToRunResult` | OTHER | `TaskEscalationRunResult` | ⚠ naming no CRUD estandar |
| TaskJustificationAppService | `ApproveAsync` | SPECIAL | `Task<ApiResponseDTO<TaskJustificationDTO>>` | ✓ |
| TaskJustificationAppService | `GetByTaskIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<List<TaskJustificationDTO>>>` | ✓ |
| TaskJustificationAppService | `RejectAsync` | SPECIAL | `Task<ApiResponseDTO<TaskJustificationDTO>>` | ✓ |
| TaskJustificationAppService | `RequestAsync` | OTHER | `Task<ApiResponseDTO<TaskJustificationDTO>>` | ⚠ naming no CRUD estandar |

### Endpoints

| Verbo | Ruta | Handler | Categoria |
|---|---|---|---|
| POST | `api/access-controls/access-points` | `CreateAsync` | CREATE |
| GET | `api/access-controls/access-points` | `GetAllAsync` | GET_LIST |
| PUT | `api/access-controls/access-points/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/access-controls/credentials/{id:guid}` | `GetCredentialByIdAsync` | GET_SINGLE |
| PATCH | `api/access-controls/credentials/{id:guid}/revoke` | `RevokeCredentialAsync` | UPDATE |
| POST | `api/access-controls/credentials/qr` | `GenerateQrCredentialAsync` | CREATE |
| POST | `api/access-controls/credentials/scan` | `ScanAsync` | CREATE |
| GET | `api/access-controls/dashboard/occupancy` | `GetCurrentOccupancyAsync` | GET_LIST |
| GET | `api/access-controls/dashboard/stats` | `GetDashboardStatsAsync` | GET_LIST |
| GET | `api/access-controls/events` | `GetEventsPagedAsync` | GET_LIST |
| GET | `api/access-controls/events/export` | `ExportEventsAsync` | GET_LIST |
| POST | `api/access-controls/invitations` | `SendInvitationAsync` | CREATE |
| POST | `api/access-controls/invitations/{id:guid}/resend` | `ResendInvitationAsync` | CREATE |
| GET | `api/access-controls/invitations/by-visit/{visitId:guid}` | `GetByVisitAsync` | GET_SINGLE |
| POST | `api/access-controls/visitors` | `CreateAsync` | CREATE |
| GET | `api/access-controls/visitors` | `GetAllAsync` | GET_LIST |
| PUT | `api/access-controls/visitors/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/access-controls/visitors/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| GET | `api/access-controls/visits` | `GetVisitsPagedAsync` | GET_LIST |
| POST | `api/access-controls/visits` | `CreateVisitAsync` | CREATE |
| GET | `api/access-controls/visits/{id:guid}` | `GetVisitByIdAsync` | GET_SINGLE |
| PATCH | `api/access-controls/visits/{id:guid}/cancel` | `CancelVisitAsync` | UPDATE |
| GET | `api/access-controls/visits/active` | `GetActiveVisitsAsync` | GET_LIST |
| POST | `api/agenda-supervision` | `AddAsync` | CREATE |
| DELETE | `api/agenda-supervision/{id:guid}` | `DeleteByIdAsync` | DELETE |
| GET | `api/agenda-supervision/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| PUT | `api/agenda-supervision/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/agenda-supervision/list/{start}/{end}` | `GetAllAsync` | GET_LIST |
| POST | `api/almacen` | `AddAsync` | CREATE |
| GET | `api/almacen/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| PUT | `api/almacen/{id:guid}` | `UpdateAsync` | UPDATE |
| DELETE | `api/almacen/{id:guid}` | `DeleteAsync` | DELETE |
| PUT | `api/almacen/assign-responsibles` | `AsignarResponsablesAsync` | UPDATE |
| GET | `api/almacen/customer/{customerId:guid}` | `GetAllByCustomerAsync` | GET_SINGLE |
| GET | `api/almacen/my-warehouses/{customerId:guid}` | `GetAllForCurrentUserAsync` | GET_SINGLE |
| POST | `api/announcements` | `AddAsync` | CREATE |
| GET | `api/announcements` | `GetAllAsync` | GET_LIST |
| GET | `api/announcements/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| DELETE | `api/announcements/{id:guid}` | `DeleteAsync` | DELETE |
| PUT | `api/announcements/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/announcements/{id:guid}/analytics` | `GetAnalyticsByIdAsync` | GET_SINGLE |
| GET | `api/announcements/{id:guid}/pdf` | `GeneratePdfAsync` | GET_SINGLE |
| GET | `api/announcements/admin-list` | `GetAllForAdminAsync` | GET_LIST |
| POST | `api/announcements/generate-draft` | `GenerateAnnouncementDraftAsync` | SPECIAL |
| POST | `api/announcements/generate-official-draft` | `GenerateOfficialAnnouncementAsync` | SPECIAL |
| POST | `api/catalogo-entrega-recepcion-descripcion` | `AddAsync` | CREATE |
| GET | `api/catalogo-entrega-recepcion-descripcion` | `GetAllAsync` | GET_LIST |
| DELETE | `api/catalogo-entrega-recepcion-descripcion/{id:guid}` | `DeleteByIdAsync` | DELETE |
| GET | `api/catalogo-entrega-recepcion-descripcion/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| PUT | `api/catalogo-entrega-recepcion-descripcion/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/catalogo-entrega-recepcion-descripcion/grupos` | `GetGruposAsync` | GET_LIST |
| POST | `api/comites-vigilancia` | `AddAsync` | CREATE |
| GET | `api/comites-vigilancia/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| PUT | `api/comites-vigilancia/{id:guid}` | `UpdateAsync` | UPDATE |
| DELETE | `api/comites-vigilancia/{id:guid}` | `DeleteByIdAsync` | DELETE |
| POST | `api/comites-vigilancia/{id:guid}/send-credentials` | `SendCredentialsAsync` | SPECIAL |
| GET | `api/comites-vigilancia/list/{customerId:guid}` | `GetAllAsync` | GET_SINGLE |
| POST | `api/custom-documents` | `AddAsync` | CREATE |
| DELETE | `api/custom-documents/{id:guid}` | `DeleteAsync` | DELETE |
| PUT | `api/custom-documents/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/custom-documents/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| POST | `api/custom-documents/consult-with-ai` | `GetByIdAsync` | CREATE |
| GET | `api/custom-documents/list/{customerId:guid}/{documentType}` | `GetAllByCustomerAsync` | GET_SINGLE |
| PUT | `api/custom-documents/update-order` | `UpdateSortOrderAsync` | UPDATE |
| POST | `api/customer-provider` | `PostAsync` | CREATE |
| GET | `api/customer-provider/{customerId:guid}` | `GetCustomerProviderDTOAsync` | GET_SINGLE |
| DELETE | `api/customer-provider/{id:guid}` | `DeleteByIdAsync` | DELETE |
| PUT | `api/customer-provider/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/customer-provider/get-by-id/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| POST | `api/dashboard/analyze` | `GenerateDashboardSummaryAsync` | CREATE |
| GET | `api/dashboard/filtro-minutas-area/{meetingId:guid}/{areaMinutasDetalles}/{estatus?}` | `GetFiltroMinutasAreaAsync` | GET_SINGLE |
| GET | `api/dashboard/global-pending-items/{customerId:guid}` | `GetGlobalPendingItemsAsync` | GET_SINGLE |
| POST | `api/dashboard/send-executive-report/{customerId:guid}` | `SendExecutivePendingReportAsync` | SPECIAL |
| GET | `api/diagram-draw` | `GetDiagramsAsync` | GET_LIST |
| POST | `api/diagram-draw` | `CreateDiagramAsync` | CREATE |
| DELETE | `api/diagram-draw/{id:guid}` | `DeleteDiagramAsync` | DELETE |
| PUT | `api/diagram-draw/{id:guid}` | `UpdateDiagramAsync` | UPDATE |
| GET | `api/diagram-draw/{id:guid}` | `GetDiagramByIdAsync` | GET_SINGLE |
| GET | `api/direccion-dashboard/agenda-meses` | `GetAgendaMesesAsync` | GET_LIST |
| GET | `api/direccion-dashboard/agenda-semanal` | `GetAgendaSemanalAsync` | GET_LIST |
| GET | `api/direccion-dashboard/contratos-por-vencer` | `GetContratosPorVencerAsync` | GET_LIST |
| GET | `api/direccion-dashboard/contratos-vigentes` | `GetContratosVigentesAsync` | GET_LIST |
| GET | `api/direccion-dashboard/personal-ausente` | `GetPersonalAusenteAsync` | GET_LIST |
| GET | `api/direccion-dashboard/reclutamiento-resumen` | `GetVacantesPendientesAsync` | GET_LIST |
| GET | `api/direccion-dashboard/tareas-legal` | `GetTareasActivasAsync` | GET_LIST |
| POST | `api/entrada-producto` | `AddAsync` | CREATE |
| GET | `api/entrada-producto/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| DELETE | `api/entrada-producto/{id:guid}` | `DeleteAsync` | DELETE |
| PUT | `api/entrada-producto/{id:guid}/{cantidadActual:int}` | `UpdateAsync` | UPDATE |
| GET | `api/entrada-producto/get-entrada-productos/{customerId:guid}` | `GetAllByCustomerAsync` | GET_SINGLE |
| GET | `api/entrega-recepcion/extintores/{customerId:guid}` | `GetExtintoresAsync` | GET_SINGLE |
| GET | `api/entrega-recepcion/inventario-equipos/{customerId:guid}` | `GetInventarioEquiposAsync` | GET_SINGLE |
| GET | `api/entrega-recepcion/inventario-herramientas/{customerId:guid}` | `GetInventarioHerramientasAsync` | GET_SINGLE |
| GET | `api/entrega-recepcion/inventario-instalaciones/{customerId:guid}` | `GetInventarioInstalacionesAsync` | GET_SINGLE |
| GET | `api/entrega-recepcion/inventario-insumos/{customerId:guid}` | `GetInventarioInsumosAsync` | GET_SINGLE |
| GET | `api/entrega-recepcion/inventario-llaves/{customerId:guid}` | `GetInventarioLlavesAsync` | GET_SINGLE |
| GET | `api/entrega-recepcion/inventario-mantenimientos/{customerId:guid}` | `GetInventarioMantenimientosAsync` | GET_SINGLE |
| GET | `api/entrega-recepcion/organigrama/{customerId:guid}` | `GetOrganigramaAsync` | GET_SINGLE |
| GET | `api/entrega-recepcion/pendientes/{customerId:guid}` | `GetPendientesAsync` | GET_SINGLE |
| GET | `api/entrega-recepcion-cliente/{customerId:guid}/{departamento}` | `GetAllAsync` | GET_SINGLE |
| PUT | `api/entrega-recepcion-cliente/{id:guid}/{userId}/{customerId:guid}` | `UpdateAsync` | UPDATE |
| DELETE | `api/entrega-recepcion-cliente/delete-file/{id:guid}` | `DeleteFile` | DELETE |
| PUT | `api/entrega-recepcion-cliente/invalidar-archivo/{id:guid}` | `InvalidarArchivoAsync` | UPDATE |
| PUT | `api/entrega-recepcion-cliente/validar-archivo/{userId}/{id:guid}` | `ValidarArchivoAsync` | UPDATE |
| GET | `api/entrega-recepcion-descripcion/{id:guid}` | `FindByIdAsync` | GET_SINGLE |
| GET | `api/gantt/{customerId:guid}` | `GetGanttDataByCustomerIdAsync` | GET_SINGLE |
| POST | `api/google-calendar-events` | `AddAsync` | CREATE |
| GET | `api/google-calendar-events/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| PUT | `api/google-calendar-events/{id:guid}` | `UpdateAsync` | UPDATE |
| DELETE | `api/google-calendar-events/{id:guid}` | `DeleteAsync` | DELETE |
| PUT | `api/google-calendar-events/{id:guid}/series` | `UpdateSeriesAsync` | UPDATE |
| DELETE | `api/google-calendar-events/{id:guid}/series` | `DeleteSeriesAsync` | DELETE |
| GET | `api/google-calendar-events/customer/{customerId:guid}` | `GetByCustomerAsync` | GET_SINGLE |
| GET | `api/hr/incident-report/export` | `ExportAsync` | GET_LIST |
| GET | `api/hr/incident-report/pending-investigation` | `GetPendingInvestigationAsync` | GET_LIST |
| GET | `api/hr/incident-report/stats` | `GetStatsAsync` | GET_LIST |
| POST | `api/hr/incidents` | `AddAsync` | CREATE |
| GET | `api/hr/incidents` | `GetAllAsync` | GET_LIST |
| PUT | `api/hr/incidents/{id:guid}` | `UpdateAsync` | UPDATE |
| DELETE | `api/hr/incidents/{id:guid}` | `DeleteAsync` | DELETE |
| GET | `api/hr/incidents/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| PATCH | `api/hr/incidents/{id:guid}/cancel` | `CancelAsync` | UPDATE |
| GET | `api/hr/incidents/{id:guid}/export-pdf` | `GeneratePdfAsync` | GET_SINGLE |
| GET | `api/hr/incidents/{id:guid}/generate-act` | `GenerateActAsync` | GET_SINGLE |
| PATCH | `api/hr/incidents/{id:guid}/resolve` | `ResolveAsync` | UPDATE |
| GET | `api/hr/incidents/{id:guid}/signed-act` | `GetSignedActStreamAsync` | GET_SINGLE |
| POST | `api/hr/incidents/{id:guid}/upload-signed-act` | `UploadSignedActAsync` | SPECIAL |
| GET | `api/hr/incidents/{incidentId:guid}/attachments` | `GetByIncidentAsync` | GET_SINGLE |
| POST | `api/hr/incidents/{incidentId:guid}/attachments` | `AddAsync` | CREATE |
| POST | `api/hr/incidents/{incidentId:guid}/suspension-days` | `AddBulkAsync` | CREATE |
| GET | `api/hr/incidents/{incidentId:guid}/suspension-days` | `GetByIncidentAsync` | GET_SINGLE |
| POST | `api/hr/incidents/{incidentId:guid}/witnesses` | `AddAsync` | CREATE |
| GET | `api/hr/incidents/{incidentId:guid}/witnesses` | `GetByIncidentAsync` | GET_SINGLE |
| DELETE | `api/hr/incidents/attachments/{attachmentId:guid}` | `DeleteAsync` | DELETE |
| GET | `api/hr/incidents/by-employee/{employeeId:guid}/{customerId:guid}` | `GetByEmployeeAsync` | GET_SINGLE |
| GET | `api/hr/incidents/dashboard` | `GetDashboardAsync` | GET_LIST |
| DELETE | `api/hr/incidents/suspension-days/{id:guid}` | `DeleteAsync` | DELETE |
| PUT | `api/hr/incidents/witnesses/{witnessId:guid}` | `UpdateAsync` | UPDATE |
| DELETE | `api/hr/incidents/witnesses/{witnessId:guid}` | `DeleteAsync` | DELETE |
| GET | `api/hr/incidents/witnesses/{witnessId:guid}` | `GetByIdAsync` | GET_SINGLE |
| GET | `api/hr/incident-types` | `GetAllAsync` | GET_LIST |
| POST | `api/hr/incident-types` | `AddAsync` | CREATE |
| DELETE | `api/hr/incident-types/{id:guid}` | `DeleteAsync` | DELETE |
| PUT | `api/hr/incident-types/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/hr/incident-types/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| PATCH | `api/hr/incident-types/{id:guid}/toggle` | `ToggleActiveAsync` | UPDATE |
| POST | `api/hr/sanctions` | `AddAsync` | CREATE |
| GET | `api/hr/sanctions` | `GetAllAsync` | GET_LIST |
| GET | `api/hr/sanctions/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| DELETE | `api/hr/sanctions/{id:guid}` | `DeleteAsync` | DELETE |
| PATCH | `api/hr/sanctions/{id:guid}/change-status` | `ChangeStatusAsync` | UPDATE |
| GET | `api/hr/sanctions/by-employee/{employeeId:guid}` | `GetByEmployeeAsync` | GET_SINGLE |
| GET | `api/hr/sanctions/expiring/{days:int}` | `GetExpiringAsync` | GET_LIST |
| POST | `api/inspection` | `AddInspectionAsync` | CREATE |
| PUT | `api/inspection/{id:guid}` | `UpdateInspectionAsync` | UPDATE |
| GET | `api/inspection/{id:guid}` | `AddInspectionAsync` | GET_SINGLE |
| POST | `api/inspection/add-or-update-condominium-asset` | `AddOrUpdateCondominiumAssetAsync` | CREATE |
| GET | `api/inspection/list/{customerId:guid}` | `GetAllAsync` | GET_SINGLE |
| PUT | `api/inspection-condominium-asset/{id:guid}` | `UpdateCondominiumAsset` | UPDATE |
| GET | `api/inspection-condominium-asset/{id:guid}` | `GetInspectionCondominiumAssetDTOAsync` | GET_SINGLE |
| GET | `api/inspection-condominium-asset/condominium-asset/{id:guid}` | `GetInspectionCondominiumAsset` | GET_SINGLE |
| DELETE | `api/inspection-condominium-asset/delete-area/{id:guid}` | `DeleteInspectionCondominiumAssetAndRelatedDataAsync` | DELETE |
| DELETE | `api/inspection-condominium-asset/delete-review/{id:guid}` | `DeleteReviewByIdAsync` | DELETE |
| GET | `api/inspection-condominium-asset/list/{inspectionId:guid}` | `InspectionDetailAsync` | GET_SINGLE |
| GET | `api/inspection-result/get-inspections-by-customer/{applicationUserId}/{customerId:guid}/{date}` | `GetInspectionsByCustomerAsync` | GET_SINGLE |
| GET | `api/inspection-result/inspection-result-get-by-id/{customerInspectionId:guid}` | `GetGroupedInspectionDataAsync` | GET_SINGLE |
| GET | `api/inspection-result/report/{inspectionId:guid}` | `GetCustomerInspectionReportDTOAsync` | GET_SINGLE |
| GET | `api/inspection-result/report/{inspectionId:guid}/{date}` | `GetCustomerInspectionReportDateDTOAsync` | GET_SINGLE |
| POST | `api/inspection-result/update-inspection-data/{customerInspectionId:guid}/{applicationUserId}` | `UpdateInspectionDataAsync` | CREATE |
| DELETE | `api/inspection-result-images/{inspectionImageId:guid}/{customerId:guid}` | `DeleteInspectionImageAsync` | DELETE |
| POST | `api/inspection-result-images/{inspectionResultId:guid}/{customerId:guid}` | `UpdateInspectionImagesAsync` | CREATE |
| GET | `api/inspection-result-images/{inspectionResultId:guid}/{customerId:guid}` | `GetListImagesAsync` | GET_SINGLE |
| POST | `api/inspection-reviews-catalog` | `AddAsync` | CREATE |
| GET | `api/inspection-reviews-catalog` | `GetAllAsync` | GET_LIST |
| DELETE | `api/inspection-reviews-catalog/{id:guid}` | `DeleteByIdAsync` | DELETE |
| PUT | `api/inspection-reviews-catalog/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/inspection-reviews-catalog/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| POST | `api/inventario-iluminacion` | `AddAsync` | CREATE |
| GET | `api/inventario-iluminacion/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| DELETE | `api/inventario-iluminacion/{id:guid}` | `DeleteByIdAsync` | DELETE |
| PUT | `api/inventario-iluminacion/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/inventario-iluminacion/list/{customerId:guid}` | `GetAllAsync` | GET_SINGLE |
| POST | `api/inventario-llave` | `AddAsync` | CREATE |
| DELETE | `api/inventario-llave/{id:guid}` | `DeleteByIdAsync` | DELETE |
| PUT | `api/inventario-llave/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/inventario-llave/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| GET | `api/inventario-llave/list/{customerId:guid}` | `GetAllAsync` | GET_SINGLE |
| POST | `api/inventario-pintura` | `AddAsync` | CREATE |
| GET | `api/inventario-pintura/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| PUT | `api/inventario-pintura/{id:guid}` | `UpdateAsync` | UPDATE |
| DELETE | `api/inventario-pintura/{id:guid}` | `DeleteByIdAsync` | DELETE |
| GET | `api/inventario-pintura/list/{customerId:guid}` | `GetAllAsync` | GET_SINGLE |
| POST | `api/inventario-producto` | `AddAsync` | CREATE |
| PUT | `api/inventario-producto/{id:guid}` | `UpdateAsync` | UPDATE |
| DELETE | `api/inventario-producto/{id:guid}` | `DeleteByIdAsync` | DELETE |
| GET | `api/inventario-producto/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| GET | `api/inventario-producto/get-async-all/{customerId:guid}/{almacenId:guid}` | `GetAllInventarioProductoAsync` | GET_SINGLE |
| GET | `api/inventario-producto/get-async-all-paged/{customerId:guid}/{almacenId:guid}` | `GetAllInventarioProductoPagedAsync` | GET_SINGLE |
| GET | `api/inventario-producto/get-existencia-producto/{customerId:guid}/{productoId:guid}/{almacenId:guid}` | `GetExistenciaProductoAsync` | GET_SINGLE |
| GET | `api/inventario-producto/get-producto-dropdown-dto/{customerId:guid}/{almacenId:guid}` | `GetProductoDropdownDTOAsync` | GET_SINGLE |
| GET | `api/inventario-producto/get-producto-dropdown-paged` | `GetProductoDropdownPagedAsync` | GET_LIST |
| GET | `api/inventory-engine-system/list/{customerId:guid}` | `ListEngineSystemsAsync` | GET_SINGLE |
| POST | `api/junta-mensual-session-backfill/apply` | `ApplyAsync` | SPECIAL |
| GET | `api/junta-mensual-session-backfill/preview` | `PreviewAsync` | GET_LIST |
| GET | `api/junta-mensual-sessions` | `GetAccessibleAsync` | GET_LIST |
| GET | `api/junta-mensual-sessions/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| POST | `api/junta-mensual-sessions/{id:guid}/cancel` | `CancelAsync` | SPECIAL |
| GET | `api/junta-mensual-sessions/{id:guid}/detail` | `GetDetailByIdAsync` | GET_SINGLE |
| POST | `api/junta-mensual-sessions/{id:guid}/meeting` | `LinkMeetingAsync` | CREATE |
| POST | `api/junta-mensual-sessions/{id:guid}/meeting/create` | `CreateMeetingAsync` | CREATE |
| POST | `api/junta-mensual-sessions/{id:guid}/presentation` | `LinkPresentationAsync` | CREATE |
| PUT | `api/junta-mensual-sessions/{id:guid}/reschedule` | `RescheduleAsync` | UPDATE |
| GET | `api/junta-mensual-sessions/customer/{customerId:guid}` | `GetByCustomerAsync` | GET_SINGLE |
| POST | `api/junta-mensual-sessions/from-agenda` | `CreateFromAgendaAsync` | CREATE |
| DELETE | `api/meeting-administracion/{id:guid}` | `DeleteAsync` | DELETE |
| POST | `api/meeting-administracion/agregar-participantes-administracion/{meetingId:guid}/{applicationUserId}/{personId:int}` | `AddParticipanteAdministracionAsync` | CREATE |
| GET | `api/meeting-administracion/participantes-administracion/{meetingId:guid}` | `GetParticipantesAdministracionAsync` | GET_SINGLE |
| DELETE | `api/meeting-comite/{id:guid}` | `DeleteAsync` | DELETE |
| POST | `api/meeting-comite/agregar-participantes-comite/{meetingId:guid}/{applicationUserId}` | `AddParticipanteComiteAsync` | CREATE |
| GET | `api/meeting-comite/participantes-comite/{meetingId:guid}` | `GetParticipantesComiteAsync` | GET_SINGLE |
| GET | `api/meeting-details-seguimientos` | `GetAllAsync` | GET_LIST |
| POST | `api/meeting-details-seguimientos` | `AddAsync` | CREATE |
| PUT | `api/meeting-details-seguimientos/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/meeting-details-seguimientos/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| DELETE | `api/meeting-details-seguimientos/{id:guid}` | `DeleteByIdAsync` | DELETE |
| GET | `api/meeting-details-seguimientos/export-summary-to-excel/{minutaId:guid}` | `ExportSummaryToExcelAsync` | GET_SINGLE |
| GET | `api/meeting-details-seguimientos/resumen-minuta-presentacion/{customerId:guid}/{minutaId:guid}` | `ResumenMinutaPresentacionAsync` | GET_SINGLE |
| GET | `api/meeting-details-seguimientos/resumen-minutas-grafico-presentacion/{minutaId:guid}` | `ResumenMinutasGraficoPresentacionAsync` | GET_SINGLE |
| GET | `api/meeting-details-seguimientos/resumen-minutas-presentacion/{minutaId:guid}` | `ResumenMinutasPresentacionAsync` | GET_SINGLE |
| GET | `api/meeting-details-seguimientos/resumen-preventivos-grafico-presentacion/{customerId:guid}/{fecha}` | `ResumenPreventivosGraficoPresentacionAsync` | GET_SINGLE |
| GET | `api/meeting-details-seguimientos/resumen-preventivos-presentacion/{customerId:guid}/{fecha}` | `ResumenPreventivosPresentacionAsync` | GET_SINGLE |
| DELETE | `api/meeting-invitado/{id:guid}` | `DeleteByIdAsync` | DELETE |
| POST | `api/meeting-invitado/agregar-participantes-invitado/{meetingId:guid}/{invitado}` | `AddParticipanteInvitadoAsync` | CREATE |
| GET | `api/meeting-invitado/participantes-invitado/{meetingId:guid}` | `GetParticipantesInvitadoAsync` | GET_SINGLE |
| POST | `api/meetings` | `AddAsync` | CREATE |
| GET | `api/meetings/{id:guid}` | `FindByIdAsync` | GET_SINGLE |
| DELETE | `api/meetings/{id:guid}` | `DeleteByIdAsync` | DELETE |
| PUT | `api/meetings/{id:guid}` | `UpdateAsync` | UPDATE |
| POST | `api/meetings/enviar-email-pendientes-responsable/{customerId:guid}/{eAreaMinutasDetalles}` | `EnviarEmailPendientesResponsable` | CREATE |
| GET | `api/meetings/get-details/{id:guid}` | `GetMeetingDetailsById` | GET_SINGLE |
| GET | `api/meetings/list/{customerId:guid}/{tipoJunta}` | `list` | GET_SINGLE |
| GET | `api/meetings/meeting-report-pdf/{id:guid}` | `GetMeetingReportPdf` | GET_SINGLE |
| GET | `api/meetings/minuta-all-pendientes/{customerId:guid}` | `MinutaAllPendientes` | GET_SINGLE |
| GET | `api/meetings/minuta-pendientes/{id:guid}` | `MinutaPendientes` | GET_SINGLE |
| GET | `api/meetings/seguimiento-minutas/{customerId:guid}/{status:int}` | `GetSeguimientoMinutasAsync` | GET_SINGLE |
| POST | `api/meetings/send-email-all-pending-meeting` | `SendEmailAllPendingMeeting` | SPECIAL |
| POST | `api/meetings/send-email-responsible/{id:guid}/{customerId:guid}/{eAreaMinutasDetalles}/{applicationUserId}` | `OnSendEmailResponsible` | SPECIAL |
| POST | `api/meetings-details` | `AddAsync` | CREATE |
| GET | `api/meetings-details/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| PUT | `api/meetings-details/{id:guid}` | `UpdateAsync` | UPDATE |
| DELETE | `api/meetings-details/{id:guid}` | `DeleteAsync` | DELETE |
| GET | `api/meetings-details/detalles-filtro/{meetingId:guid}/{estatus:int}` | `MinutasFiltroAsync` | GET_SINGLE |
| GET | `api/meetings-details/get-all/{meetingId:guid}/{status:int}` | `GetAllAsync` | GET_SINGLE |
| GET | `api/mi-edificio/caratula/{customerId:guid}` | `GetCaratulaAsync` | GET_SINGLE |
| POST | `api/owners` | `AddAsync` | CREATE |
| PUT | `api/owners/{id:guid}` | `UpdateAsync` | UPDATE |
| DELETE | `api/owners/{id:guid}` | `DeleteByIdAsync` | DELETE |
| GET | `api/owners/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| GET | `api/owners/list/{customerId:guid}` | `GetAllAsync` | GET_SINGLE |
| POST | `api/panic-alerts` | `CreateAsync` | CREATE |
| GET | `api/panic-alerts/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| PUT | `api/panic-alerts/{id:guid}/attend` | `AttendAsync` | UPDATE |
| PUT | `api/panic-alerts/{id:guid}/resolve` | `ResolveAsync` | UPDATE |
| GET | `api/panic-alerts/active` | `GetActiveAsync` | GET_LIST |
| GET | `api/panic-alerts/history` | `GetHistoryAsync` | GET_LIST |
| DELETE | `api/presentaciones-junta-comite/{id:guid}` | `DeleteAsync` | DELETE |
| DELETE | `api/presentaciones-junta-comite/{id:guid}/{area}` | `DeletePdfAsync` | DELETE |
| POST | `api/presentaciones-junta-comite/add-fecha` | `AddFechaAsync` | CREATE |
| PUT | `api/presentaciones-junta-comite/add-fecha/{id:guid}` | `UpdateFechaAsync` | UPDATE |
| POST | `api/presentaciones-junta-comite/add-file` | `AddFileAsync` | CREATE |
| POST | `api/presentaciones-junta-comite/autorizar-presentacion/{id:guid}/{applicationUserId}` | `AutorizarPresentacionAsync` | CREATE |
| GET | `api/presentaciones-junta-comite/generales/{periodo:datetime}` | `GeneralesAsync` | GET_LIST |
| GET | `api/presentaciones-junta-comite/get/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| GET | `api/presentaciones-junta-comite/list/{customerId:guid}` | `GetAllAsync` | GET_SINGLE |
| GET | `api/productos` | `GetProductsAsync` | GET_LIST |
| POST | `api/productos` | `AddAsync` | CREATE |
| GET | `api/productos/{id:guid}` | `GetProductAsync` | GET_SINGLE |
| PUT | `api/productos/{id:guid}` | `UpdateAsync` | UPDATE |
| DELETE | `api/productos/{id:guid}` | `DeleteAsync` | DELETE |
| GET | `api/productos/get-auto-complete-select-item` | `GetAutoCompleteSelectItemAsync` | GET_LIST |
| GET | `api/productos/get-select-item/{id:int}` | `GetMachinerySelectItemAsync` | GET_SINGLE |
| GET | `api/productos/paged` | `GetProductsPagedAsync` | GET_LIST |
| POST | `api/properties` | `AddAsync` | CREATE |
| DELETE | `api/properties/{id:guid}` | `DeleteByIdAsync` | DELETE |
| PUT | `api/properties/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/properties/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| PATCH | `api/properties/{id:guid}/account-number` | `AssignAccountNumberAsync` | UPDATE |
| GET | `api/properties/download-template/{customerId:guid}` | `DownloadTemplateAsync` | GET_SINGLE |
| POST | `api/properties/import/{customerId:guid}` | `ImportPropertiesFromExcelAsync` | SPECIAL |
| GET | `api/properties/list/{customerId:guid}` | `GetAllAsync` | GET_SINGLE |
| POST | `api/property-occupant` | `AddAsync` | CREATE |
| GET | `api/property-occupant/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| PUT | `api/property-occupant/{id:guid}` | `UpdateAsync` | UPDATE |
| DELETE | `api/property-occupant/{id:guid}` | `DeleteByIdAsync` | DELETE |
| GET | `api/property-occupant/list/{propertyId:guid}` | `GetAllByPropertyIdAsync` | GET_SINGLE |
| POST | `api/radios-comunicacion` | `AddAsync` | CREATE |
| GET | `api/radios-comunicacion/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| PUT | `api/radios-comunicacion/{id:guid}` | `UpdateAsync` | UPDATE |
| DELETE | `api/radios-comunicacion/{id:guid}` | `DeleteAsync` | DELETE |
| GET | `api/radios-comunicacion/list/{customerId:guid}` | `GetAllAsync` | GET_SINGLE |
| GET | `api/recurring-task-compliance/dashboard/{customerId:guid}` | `GetDashboardAsync` | GET_SINGLE |
| POST | `api/recurring-task-templates` | `CreateAsync` | CREATE |
| PUT | `api/recurring-task-templates/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/recurring-task-templates/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| GET | `api/recurring-task-templates/list/{customerId:guid}` | `GetAllByCustomerAsync` | GET_SINGLE |
| PATCH | `api/recurring-task-templates/toggle-status/{id:guid}` | `ToggleStatusAsync` | UPDATE |
| GET | `api/resumen-general/evaluacion-areas/{fechaInicial}/{fechaFinal}` | (inline) | GET_LIST |
| GET | `api/resumen-general/evaluacion-areas-detalle/{fecha}/{area}/{status?}` | (inline) | GET_LIST |
| GET | `api/resumen-general/filtro-dto` | (inline) | GET_LIST |
| GET | `api/resumen-general/posicion/{fechaInicial}/{fechaFinal}` | (inline) | GET_LIST |
| GET | `api/resumen-general/reporte-resumen-minutas/{fechaInicial}/{fechaFinal}/{nivelReporte:int}` | (inline) | GET_LIST |
| GET | `api/resumen-general/reporte-resumen-minutas-filtro/{fechaInicial}/{fechaFinal}/{filtro}/{nivelReporte:int}` | (inline) | GET_LIST |
| GET | `api/resumen-general/reporte-resumen-preventivos/{fechaInicial}/{fechaFinal}` | (inline) | GET_LIST |
| GET | `api/resumen-general/reporte-resumen-ticket/{customerId:guid}/{fechaInicial}/{fechaFinal}` | (inline) | GET_SINGLE |
| GET | `api/resumen-general/reporte-resumen-ticket/{fechaInicial}/{fechaFinal}` | (inline) | GET_LIST |
| GET | `api/resumen-general/resultado-general/{fechaInicial}/{fechaFinal}` | (inline) | GET_LIST |
| GET | `api/resumen-general/resumen-minutas-general-grupo/{fechaInicial}/{fechaFinal}` | (inline) | GET_LIST |
| GET | `api/resumen-general/resumen-minutas-general-lista/{fechaInicial}/{fechaFinal}` | (inline) | GET_LIST |
| POST | `api/salidas-productos` | `AddAsync` | CREATE |
| GET | `api/salidas-productos/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| DELETE | `api/salidas-productos/{id:guid}` | `DeleteAsync` | DELETE |
| PUT | `api/salidas-productos/{id:guid}/{cantidadActual:int}` | `UpdateAsync` | UPDATE |
| POST | `api/salidas-productos/devolver` | `RealizarDevolucionAsync` | CREATE |
| GET | `api/salidas-productos/get-paged-list` | `GetPagedByCustomerIdAsync` | GET_LIST |
| GET | `api/salidas-productos/reporte` | `GenerateReportAsync` | GET_LIST |
| POST | `api/service-orders` | `AddAsync` | CREATE |
| DELETE | `api/service-orders/{id:guid}` | `DeleteAsync` | DELETE |
| PUT | `api/service-orders/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/service-orders/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| DELETE | `api/service-orders/delete-document/{id:guid}` | `DeleteDocumentAsync` | DELETE |
| DELETE | `api/service-orders/delete-img/{id:guid}` | `DeleteImgAsync` | DELETE |
| GET | `api/service-orders/informe/{customerId:guid}/{idMonth:int}/{idYear:int}` | `GetServiceOrderInforme` | GET_SINGLE |
| GET | `api/service-orders/list/{customerId:guid}/{fecha:datetime}` | `GetAllAsync` | GET_SINGLE |
| GET | `api/service-orders/list-pintura/{customerId:guid}/{fecha:datetime}` | `GetAllPinturaAsync` | GET_SINGLE |
| GET | `api/service-orders/on-get-user-select-item/{id}` | `OnGetUserSelectItemAsync` | GET_SINGLE |
| GET | `api/service-orders/ordenes-servicio-fotos/{id:guid}/{customerId:guid}` | `OrdenesServicioFotosAsync` | GET_SINGLE |
| GET | `api/service-orders/ordenes-servicio-reporte-proveedor/{id:guid}/{customerId:guid}` | `OrdenesServicioReporteProveedorAsync` | GET_SINGLE |
| GET | `api/service-orders/pending-preventive/{customerId:guid}` | `GetPendingPreventiveAsync` | GET_SINGLE |
| POST | `api/service-orders/reporte-ordenes-servicio/{customerId:guid}/{fecha:datetime}` | `UpdateCalendarIdAsync` | CREATE |
| GET | `api/service-orders/soporte-orden-servicio/{id:guid}` | `GetServiceOrderSupportAsync` | GET_SINGLE |
| POST | `api/service-orders/subir-documento/{serviceOrderId:guid}` | `SubirDocumentoAsync` | CREATE |
| POST | `api/service-orders/subir-img/{serviceOrderId:guid}` | `SubirImgAsync` | CREATE |
| POST | `api/service-orders/update-calendar-id` | `UpdateCalendarioId` | CREATE |
| GET | `api/supervision-reports/estados-financieros/{customerId:guid}` | `GetEstadosFinancierosAsync` | GET_SINGLE |
| GET | `api/supervision-reports/pending-legal/{customerId:guid}` | `GetPendingLegalAsync` | GET_SINGLE |
| GET | `api/supervision-reports/pending-minutes/{customerId:guid}` | `GetPendingMinutesAsync` | GET_SINGLE |
| GET | `api/supervision-reports/pending-tickets/{customerId:guid}` | `GetPendingTicketsAsync` | GET_SINGLE |
| POST | `api/task-attachments` | `UploadAsync` | CREATE |
| DELETE | `api/task-attachments/{id:guid}` | `DeleteAsync` | DELETE |
| GET | `api/task-attachments/by-task/{tasksId:guid}` | `GetByTaskIdAsync` | GET_SINGLE |
| POST | `api/task-checklist-items` | `AddAsync` | CREATE |
| DELETE | `api/task-checklist-items/{id:guid}` | `DeleteAsync` | DELETE |
| GET | `api/task-checklist-items/by-task/{tasksId:guid}` | `GetByTaskIdAsync` | GET_SINGLE |
| PATCH | `api/task-checklist-items/toggle-done/{id:guid}` | `ToggleDoneAsync` | UPDATE |
| POST | `api/task-follow-up` | `AddAsync` | CREATE |
| DELETE | `api/task-follow-up/{id:guid}` | `DeleteAsync` | DELETE |
| GET | `api/task-follow-up/list/{TaskGroupId:guid}` | `ListAsync` | GET_SINGLE |
| GET | `api/task-group-categories` | `GetAllAsync` | GET_LIST |
| POST | `api/task-group-categories` | `AddAsync` | CREATE |
| DELETE | `api/task-group-categories/{id:guid}` | `DeleteByIdAsync` | DELETE |
| PUT | `api/task-group-categories/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/task-group-categories/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| POST | `api/task-group-participant` | `AddAsync` | CREATE |
| DELETE | `api/task-group-participant/{id:guid}` | `DeleteAsync` | DELETE |
| PUT | `api/task-group-participant/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/task-group-participant/{TaskGroupId:guid}` | `GetExistingParticipantsAsync` | GET_SINGLE |
| GET | `api/task-group-participant/participants/{customerId:guid}/{TaskGroupId:guid}` | `GetAvailableParticipantsAsync` | GET_SINGLE |
| POST | `api/task-groups` | `CreateAsync` | CREATE |
| GET | `api/task-groups/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| PUT | `api/task-groups/{id:guid}` | `UpdateAsync` | UPDATE |
| DELETE | `api/task-groups/{id:guid}` | `DeleteByIdAsync` | DELETE |
| GET | `api/task-groups/list/{customerId:guid}/{state:bool}/{applicationUserId}` | `GetAllByClientAsync` | GET_SINGLE |
| PATCH | `api/task-groups/toggle-status/{id:guid}` | `ToggleStatusAsync` | UPDATE |
| POST | `api/task-justifications` | `RequestAsync` | CREATE |
| PATCH | `api/task-justifications/{id:guid}/approve` | `ApproveAsync` | UPDATE |
| PATCH | `api/task-justifications/{id:guid}/reject` | `RejectAsync` | UPDATE |
| GET | `api/task-justifications/by-task/{tasksId:guid}` | `GetByTaskIdAsync` | GET_SINGLE |
| GET | `api/task-message-read/list/{TaskId:guid}` | `GetByTaskMessageIdAsync` | GET_SINGLE |
| GET | `api/task-report/get-report-client/{customerId:guid}/{fechaInicial}/{fechaFinal}` | `GetReportClientAsync` | GET_SINGLE |
| GET | `api/task-report/get-task-report/{customerId:guid}/{startDate}/{endDate}` | `GetTaskReportAsync` | GET_SINGLE |
| GET | `api/task-report/weekly-report/{customerId:guid}/{startDate}/{endDate}/{status}` | `WeeklyReportAsync` | GET_SINGLE |
| GET | `api/task-report/weekly-report-preview/{customerId:guid}/{year:int}/{weekNumber:int}` | `WeeklyReportPreviewAsync` | GET_SINGLE |
| GET | `api/tasks/{id:guid}` | `GetByIdWithGroupAsync` | GET_SINGLE |
| DELETE | `api/tasks/{id:guid}/{customerId:guid}` | `DeleteTaskAsync` | DELETE |
| PATCH | `api/tasks/{id:guid}/customer` | `UpdateTaskCustomerAsync` | UPDATE |
| GET | `api/tasks/{id:guid}/status` | `GetTaskStatusAsync` | GET_SINGLE |
| PATCH | `api/tasks/{id:guid}/status` | `UpdateTaskStatusAsync` | UPDATE |
| GET | `api/tasks/all-by-customer/{customerId:guid}` | `GetTasksByCustomerAsync` | GET_SINGLE |
| GET | `api/tasks/available-predecessors/{groupId:guid}` | `GetAvailablePredecessorsAsync` | GET_SINGLE |
| GET | `api/tasks/clear-predecessor/{taskId:guid}` | `ClearDependencyAsync` | GET_SINGLE |
| PUT | `api/tasks/closed/{id:guid}` | `CloseTaskAsync` | UPDATE |
| POST | `api/tasks/create` | `CreateTaskAsync` | CREATE |
| GET | `api/tasks/get-by-closed/{id:guid}` | `GetByClosedAsync` | GET_SINGLE |
| GET | `api/tasks/in-progress/{taskId:guid}/{applicationUserId}` | `InProgressAsync` | GET_SINGLE |
| GET | `api/tasks/legal/all` | `GetLegalTasksAllAsync` | GET_LIST |
| GET | `api/tasks/legal/customer` | `GetLegalTasksByCustomerAsync` | GET_LIST |
| GET | `api/tasks/legal/pending` | `GetLegalPendingReportAsync` | GET_LIST |
| GET | `api/tasks/list/{taskGroupId:guid}/{status}` | `ListTaskAsync` | GET_SINGLE |
| GET | `api/tasks/my-assigned-tasks/{applicationUserId}/{status}/{customerId:guid}` | `GetListMyAssignedTasksAsync` | GET_SINGLE |
| GET | `api/tasks/my-request/{applicationUserId}/{status}/{customerId:guid}` | `GetListMyRequestAsync` | GET_SINGLE |
| POST | `api/tasks/my-task/programation/{id:guid}` | `MyTaskProgramationAsync` | CREATE |
| GET | `api/tasks/participant/{taskGroupId:guid}` | `ParticipanAsync` | GET_SINGLE |
| GET | `api/tasks/path-report/{customerId:guid}/{year:int}/{numeroSemana:int}` | `GetPathReportAsync` | GET_SINGLE |
| GET | `api/tasks/programation/{id:guid}` | `ProgramationGetByIdAsync` | GET_SINGLE |
| POST | `api/tasks/programation/{id:guid}` | `ProgramationAsync` | CREATE |
| POST | `api/tasks/reopen` | `ReopenAsync` | SPECIAL |
| POST | `api/tasks/send-report-pending/{taskGroupId:guid}` | `SendReportPendingTicketGroupAsync` | SPECIAL |
| GET | `api/tasks/set-predecessor/{taskId:guid}/{predecessorId:guid}` | `SetDependencyAsync` | GET_SINGLE |
| PUT | `api/tasks/update/{id:guid}` | `UpdateTaskAsync` | UPDATE |
| PUT | `api/tasks/update-order` | `UpdateOrderAsync` | UPDATE |
| GET | `api/tasks/update-priority/{taskId:guid}/{applicationUserId}` | `OnUpdatePriority` | GET_SINGLE |
| GET | `api/tasks/update-relevance/{id:guid}` | `UpdateRelevanceAsync` | GET_SINGLE |
| GET | `api/tasks/view/{id:guid}` | `GetByIdTaskViewDTO` | GET_SINGLE |
| GET | `api/task-work-plan/create/{applicationUserId}/{customerId:guid}/{year:int}/{weekNumber:int}` | `CreateWeeklyWorkPlanAsync` | GET_SINGLE |
| GET | `api/task-work-plan/pending/{customerId:guid}` | `GetPendingAsync` | GET_SINGLE |
| GET | `api/task-work-plan/preview/{customerId:guid}/{year:int}/{weekNumber:int}` | `WeeklyReportPreviewAsync` | GET_SINGLE |
| POST | `api/tools` | `AddAsync` | CREATE |
| GET | `api/tools/{customerId:guid}` | `GetAllAsync` | GET_SINGLE |
| DELETE | `api/tools/{id:guid}` | `DeleteAsync` | DELETE |
| PUT | `api/tools/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/tools/get/{id:guid}` | `GetByIdAsync` | GET_SINGLE |

## Modulo: ReclutamientoLuxuryApp

Metodos: 287 | Endpoints HTTP: 323

### Servicios e interfaces

| Servicio/Interfaz | Metodos | Ubicacion |
|---|---|---|
| `ICandidateAppService` | 12 | `ReclutamientoLuxuryApp/Candidates/CandidateCore/Interfaces/ICandidateAppService.cs` |
| `ICandidateAutomationService` | 1 | `ReclutamientoLuxuryApp/Candidates/CandidateApplications/Interfaces/ICandidateAutomationService.cs` |
| `ICandidateNotificationCoordinatorService` | 26 | `ReclutamientoLuxuryApp/Notifications/Interfaces/ICandidateNotificationCoordinatorService.cs` |
| `ICandidateProcessAppService` | 32 | `ReclutamientoLuxuryApp/Candidates/CandidateProcesses/Interfaces/ICandidateProcessAppService.cs` |
| `ICandidateWorkExperienceAppService` | 4 | `ReclutamientoLuxuryApp/Candidates/CandidatesWorkExperience/Interfaces/ICandidateWorkExperienceAppService.cs` |
| `IChecklistOptionCatalogAppService` | 4 | `ReclutamientoLuxuryApp/EmployeeOnboardingChecklists/Interfaces/IChecklistOptionCatalogAppService.cs` |
| `IEmployeeBankDataAppService` | 6 | `ReclutamientoLuxuryApp/EmployeeBankDataRecords/Interfaces/IEmployeeBankDataAppService.cs` |
| `IEmployeeBeneficiaryAppService` | 6 | `ReclutamientoLuxuryApp/EmployeeBeneficiaries/Interfaces/IEmployeeBeneficiaryAppService.cs` |
| `IEmployeeBirthdayAppService` | 1 | `ReclutamientoLuxuryApp/EmployeeBirthday/Interfaces/IEmployeeBirthdayAppService.cs` |
| `IEmployeeClinicalDataAppService` | 5 | `ReclutamientoLuxuryApp/EmployeeClinicalDataRecords/Interfaces/IEmployeeClinicalDataAppService.cs` |
| `IEmployeeDocumentAppService` | 7 | `ReclutamientoLuxuryApp/EmployeeDocuments/Interfaces/IEmployeeDocumentAppService.cs` |
| `IEmployeeEmergencyContactAppService` | 5 | `ReclutamientoLuxuryApp/EmployeeEmergenContact/Interfaces/IEmployeeEmergencyContactAppService.cs` |
| `IEmployeeExternalAppService` | 9 | `ReclutamientoLuxuryApp/ExternalStaffs/Interfaces/IEmployeeExternalAppService.cs` |
| `IEmployeeFileAppService` | 13 | `ReclutamientoLuxuryApp/EmployeeFile/Interfaces/IEmployeeFileAppService.cs` |
| `IEmployeeInternalAppService` | 27 | `ReclutamientoLuxuryApp/Employees/Interfaces/IEmployeeInternalAppService.cs` |
| `IEmployeeOnboardingChecklistAppService` | 4 | `ReclutamientoLuxuryApp/EmployeeOnboardingChecklists/Interfaces/IEmployeeOnboardingChecklistAppService.cs` |
| `IHrActionPolicyService` | 6 | `ReclutamientoLuxuryApp/Shared/Policies/Interfaces/IHrActionPolicyService.cs` |
| `IInterviewerMatrixAppService` | 7 | `ReclutamientoLuxuryApp/InterviewerMatrices/Interfaces/IInterviewerMatrixAppService.cs` |
| `IJobDescriptionAppService` | 6 | `ReclutamientoLuxuryApp/JobDescriptions/Interfaces/IJobDescriptionAppService.cs` |
| `IMultiChannelAlertService` | 1 | `ReclutamientoLuxuryApp/Notifications/Interfaces/IMultiChannelAlertService.cs` |
| `IPersonProviderSupportAppService` | 4 | `ReclutamientoLuxuryApp/ProviderSupports/Interfaces/IPersonProviderSupportAppService.cs` |
| `IReclutamientoIntegrationService` | 1 | `ReclutamientoLuxuryApp/RecruitmentRequests/Interfaces/IReclutamientoIntegrationService.cs` |
| `IReclutamientoQueryService` | 2 | `ReclutamientoLuxuryApp/RecruitmentRequests/Interfaces/IReclutamientoQueryService.cs` |
| `IRecruitmentSourceCatalogAppService` | 5 | `ReclutamientoLuxuryApp/RecruitmentSourceCatalogs/Interfaces/IRecruitmentSourceCatalogAppService.cs` |
| `IRecurringTaskGeneratorService` | 1 | `ReclutamientoLuxuryApp/RecurringTasks/Interfaces/IRecurringTaskGeneratorService.cs` |
| `IRequestDismissalDiscountAppService` | 4 | `ReclutamientoLuxuryApp/RequestDismissalDiscounts/Interfaces/IRequestDismissalDiscountAppService.cs` |
| `IRequestEmployeeRegisterAppService` | 19 | `ReclutamientoLuxuryApp/RequestEmployeeRegisters/Interfaces/IRequestEmployeeRegisterAppService.cs` |
| `IRequestPositionAppService` | 12 | `ReclutamientoLuxuryApp/RequestPositions/Interfaces/IRequestPositionAppService.cs` |
| `IRequestSalaryModificationAppService` | 7 | `ReclutamientoLuxuryApp/SalaryModifications/Interfaces/IRequestSalaryModificationAppService.cs` |
| `ISanctionTypeAppService` | 6 | `ReclutamientoLuxuryApp/SanctionTypes/Interfaces/ISanctionTypeAppService.cs` |
| `ISolicitudBajaAppService` | 14 | `ReclutamientoLuxuryApp/RequestDismissals/Interfaces/ISolicitudBajaAppService.cs` |
| `ITaskInstanceAppService` | 5 | `ReclutamientoLuxuryApp/RecurringTasks/Interfaces/ITaskInstanceAppService.cs` |
| `ITaskTemplateAppService` | 12 | `ReclutamientoLuxuryApp/RecurringTasks/Interfaces/ITaskTemplateAppService.cs` |
| `IWorkPositionAppService` | 11 | `ReclutamientoLuxuryApp/WorkPositions/Interfaces/IWorkPositionAppService.cs` |
| `IWorkPositionOrgChartAppService` | 2 | `ReclutamientoLuxuryApp/EmployeeOrganigrama/Interfaces/IWorkPositionOrgChartAppService.cs` |

### Metodos por categoria

| Servicio | Metodo | Categoria | Retorno | Observaciones |
|---|---|---|---|---|
| ICandidateAppService | `ArchiveAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| ICandidateAppService | `CheckDuplicateCandidateAsync` | SPECIAL | `Task<ApiResponseDTO<CandidateDuplicateCheckResultDTO>>` | ✓ |
| ICandidateAppService | `CreateAsync` | CREATE | `Task<ApiResponseDTO<CandidateDetailDTO>>` | ✓ |
| ICandidateAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ICandidateAppService | `EnsureCandidateFromFormerEmployeeAsync` | OTHER | `Task<ApiResponseDTO<FormerEmployeeCandidateResultDTO>>` | ⚠ naming no CRUD estandar |
| ICandidateAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<CandidateDetailDTO>>` | ✓ |
| ICandidateAppService | `GetDeleteImpactAsync` | GET_SINGLE | `Task<ApiResponseDTO<CandidateDeleteImpactDTO>>` | ⚠ Get sin ByXxx/All |
| ICandidateAppService | `GetFormerEmployeesAsync` | GET_LIST | `Task<ApiResponseDTO<List<FormerEmployeeTalentPoolItemDTO>>>` | ⚠ Get sin ByXxx/All |
| ICandidateAppService | `GetListAsync` | GET_LIST | `Task<ApiResponseDTO<List<CandidateListItemDTO>>>` | ✓ |
| ICandidateAppService | `SearchByPhoneAsync` | OTHER | `Task<ApiResponseDTO<CandidateListItemDTO>>` | ⚠ naming no CRUD estandar |
| ICandidateAppService | `UnarchiveAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| ICandidateAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<CandidateDetailDTO>>` | ✓ |
| ICandidateAutomationService | `ExecuteDailyMonitoringAsync` | SPECIAL | `Task` | ✓ |
| ICandidateNotificationCoordinatorService | `NotifyApplicationCreatedAsync` | SPECIAL | `Task` | ✓ |
| ICandidateNotificationCoordinatorService | `NotifyApplicationSentToOperationsInterviewAsync` | SPECIAL | `Task` | ✓ |
| ICandidateNotificationCoordinatorService | `NotifyApplicationStageStalledAsync` | SPECIAL | `Task` | ✓ |
| ICandidateNotificationCoordinatorService | `NotifyInterviewCancelledAsync` | SPECIAL | `Task` | ✓ |
| ICandidateNotificationCoordinatorService | `NotifyInterviewDecisionRevertedAsync` | SPECIAL | `Task` | ✓ |
| ICandidateNotificationCoordinatorService | `NotifyInterviewFeedbackSubmittedAsync` | SPECIAL | `Task` | ✓ |
| ICandidateNotificationCoordinatorService | `NotifyInterviewScheduledAsync` | SPECIAL | `Task` | ✓ |
| ICandidateNotificationCoordinatorService | `NotifyOperationsInterviewAgendaPendingAsync` | SPECIAL | `Task` | ✓ |
| ICandidateNotificationCoordinatorService | `NotifyOperationsInterviewEscalatedAsync` | SPECIAL | `Task` | ✓ |
| ICandidateNotificationCoordinatorService | `NotifyOperationsInterviewOverdueAsync` | SPECIAL | `Task` | ✓ |
| ICandidateNotificationCoordinatorService | `NotifyOperationsInterviewReminderAsync` | SPECIAL | `Task` | ✓ |
| ICandidateNotificationCoordinatorService | `NotifyProcessCreatedAsync` | SPECIAL | `Task` | ✓ |
| ICandidateNotificationCoordinatorService | `NotifyProcessInterviewCancelledAsync` | SPECIAL | `Task` | ✓ |
| ICandidateNotificationCoordinatorService | `NotifyProcessInterviewDecisionRevertedAsync` | SPECIAL | `Task` | ✓ |
| ICandidateNotificationCoordinatorService | `NotifyProcessInterviewFeedbackSubmittedAsync` | SPECIAL | `Task` | ✓ |
| ICandidateNotificationCoordinatorService | `NotifyProcessInterviewScheduledAsync` | SPECIAL | `Task` | ✓ |
| ICandidateNotificationCoordinatorService | `NotifyProcessOperationsInterviewAgendaPendingAsync` | SPECIAL | `Task` | ✓ |
| ICandidateNotificationCoordinatorService | `NotifyProcessOperationsInterviewEscalatedAsync` | SPECIAL | `Task` | ✓ |
| ICandidateNotificationCoordinatorService | `NotifyProcessOperationsInterviewOverdueAsync` | SPECIAL | `Task` | ✓ |
| ICandidateNotificationCoordinatorService | `NotifyProcessOperationsInterviewReminderAsync` | SPECIAL | `Task` | ✓ |
| ICandidateNotificationCoordinatorService | `NotifyProcessPresentationHiringRequestGeneratedAsync` | SPECIAL | `Task` | ✓ |
| ICandidateNotificationCoordinatorService | `NotifyProcessReceptionConfirmedAsync` | SPECIAL | `Task` | ✓ |
| ICandidateNotificationCoordinatorService | `NotifyProcessSentToOperationsInterviewAsync` | SPECIAL | `Task` | ✓ |
| ICandidateNotificationCoordinatorService | `NotifyProcessStageStalledAsync` | SPECIAL | `Task` | ✓ |
| ICandidateNotificationCoordinatorService | `NotifyReceptionConfirmedAsync` | SPECIAL | `Task` | ✓ |
| ICandidateNotificationCoordinatorService | `NotifySiblingCandidatesFrozenAsync` | SPECIAL | `Task` | ✓ |
| ICandidateProcessAppService | `CancelScheduleAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| ICandidateProcessAppService | `ChangeStageAsync` | UPDATE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ICandidateProcessAppService | `CompleteHiringAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| ICandidateProcessAppService | `ConfirmPresentationAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| ICandidateProcessAppService | `CreateAsync` | CREATE | `Task<ApiResponseDTO<CandidateProcessDetailDTO>>` | ✓ |
| ICandidateProcessAppService | `CreateFromFormAsync` | CREATE | `Task<ApiResponseDTO<CandidateProcessDetailDTO>>` | ✓ |
| ICandidateProcessAppService | `ExecuteInterviewerActionAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| ICandidateProcessAppService | `GetByCandidateAsync` | GET_LIST | `Task<ApiResponseDTO<List<CandidateProcessListItemDTO>>>` | ✓ |
| ICandidateProcessAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<CandidateProcessDetailDTO>>` | ✓ |
| ICandidateProcessAppService | `GetByRequestPositionAsync` | GET_SINGLE | `Task<ApiResponseDTO<CandidateProcessVacancyDetailDTO>>` | ✓ |
| ICandidateProcessAppService | `GetByStageAsync` | GET_LIST | `Task<ApiResponseDTO<List<CandidateProcessListItemDTO>>>` | ✓ |
| ICandidateProcessAppService | `GetByWorkPositionAsync` | GET_SINGLE | `Task<ApiResponseDTO<CandidateProcessWorkPositionDetailDTO>>` | ✓ |
| ICandidateProcessAppService | `GetEmployeeInterviewerQueueAsync` | GET_LIST | `Task<ApiResponseDTO<List<CandidateInterviewerQueueDTO>>>` | ⚠ Get sin ByXxx/All |
| ICandidateProcessAppService | `GetHiringDocumentsAsync` | GET_LIST | `Task<ApiResponseDTO<List<CandidateHiringDocumentListItemDTO>>>` | ⚠ Get sin ByXxx/All |
| ICandidateProcessAppService | `GetInterviewerQueueAsync` | GET_LIST | `Task<ApiResponseDTO<List<CandidateInterviewerQueueDTO>>>` | ⚠ Get sin ByXxx/All |
| ICandidateProcessAppService | `GetInterviewerViewAsync` | GET_LIST | `Task<ApiResponseDTO<List<InterviewerApplicationViewDTO>>>` | ⚠ Get sin ByXxx/All |
| ICandidateProcessAppService | `GetInterviewResponseAsync` | GET_SINGLE | `Task<ApiResponseDTO<CandidateInterviewResponseDTO>>` | ⚠ Get sin ByXxx/All |
| ICandidateProcessAppService | `GetKpisAsync` | GET_LIST | `Task<ApiResponseDTO<CandidateProcessKpisDTO>>` | ⚠ Get sin ByXxx/All |
| ICandidateProcessAppService | `GetRecruitmentAgendaAsync` | GET_LIST | `Task<ApiResponseDTO<List<CandidateRecruitmentAgendaItemDTO>>>` | ⚠ Get sin ByXxx/All |
| ICandidateProcessAppService | `GetRecruitmentInterviewBoardAsync` | GET_LIST | `Task<ApiResponseDTO<List<CandidateRecruitmentInterviewBoardDTO>>>` | ⚠ Get sin ByXxx/All |
| ICandidateProcessAppService | `GetTimelineByVacancyAsync` | GET_LIST | `Task<ApiResponseDTO<List<VacancyCandidateTimelineDTO>>>` | ✓ |
| ICandidateProcessAppService | `GetTrayAsync` | GET_LIST | `Task<ApiResponseDTO<List<CandidateProcessListItemDTO>>>` | ⚠ Get sin ByXxx/All |
| ICandidateProcessAppService | `ProcessDirectHiringAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| ICandidateProcessAppService | `ProcessHiringAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| ICandidateProcessAppService | `ReconfirmPresentationAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| ICandidateProcessAppService | `RegisterDecisionAsync` | CREATE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ICandidateProcessAppService | `RemoveHiringDocumentFileAsync` | DELETE | `Task<ApiResponseDTO<CandidateHiringDocumentListItemDTO>>` | ✓ |
| ICandidateProcessAppService | `ScheduleAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| ICandidateProcessAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<CandidateProcessDetailDTO>>` | ✓ |
| ICandidateProcessAppService | `UpdateFromFormAsync` | UPDATE | `Task<ApiResponseDTO<CandidateProcessDetailDTO>>` | ✓ |
| ICandidateProcessAppService | `UploadHiringDocumentAsync` | SPECIAL | `Task<ApiResponseDTO<CandidateHiringDocumentListItemDTO>>` | ✓ |
| ICandidateProcessAppService | `ValidateHiringDocumentAsync` | SPECIAL | `Task<ApiResponseDTO<CandidateHiringDocumentListItemDTO>>` | ✓ |
| ICandidateWorkExperienceAppService | `CreateAsync` | CREATE | `Task<ApiResponseDTO<CandidateWorkExperienceItemDTO>>` | ✓ |
| ICandidateWorkExperienceAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ICandidateWorkExperienceAppService | `GetByCandidateAsync` | GET_LIST | `Task<ApiResponseDTO<List<CandidateWorkExperienceItemDTO>>>` | ✓ |
| ICandidateWorkExperienceAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<CandidateWorkExperienceItemDTO>>` | ✓ |
| IChecklistOptionCatalogAppService | `CreateAsync` | CREATE | `Task<ApiResponseDTO<ChecklistOptionCatalogListItemDTO>>` | ✓ |
| IChecklistOptionCatalogAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IChecklistOptionCatalogAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<List<ChecklistOptionCatalogListItemDTO>>>` | ✓ |
| IChecklistOptionCatalogAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<ChecklistOptionCatalogListItemDTO>>` | ✓ |
| IEmployeeBankDataAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IEmployeeBankDataAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<EmployeeBankDataDTO[]>>` | ✓ |
| IEmployeeBankDataAppService | `GetByEmployeeAsync` | GET_SINGLE | `Task<ApiResponseDTO<EmployeeBankDataDTO[]>>` | ✓ |
| IEmployeeBankDataAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<EmployeeBankDataDTO>>` | ✓ |
| IEmployeeBankDataAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<EmployeeBankDataDTO>>` | ✓ |
| IEmployeeBankDataAppService | `UpsertAsync` | UPDATE | `Task<ApiResponseDTO<EmployeeBankDataDTO>>` | ✓ |
| IEmployeeBeneficiaryAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IEmployeeBeneficiaryAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<EmployeeBeneficiaryDTO[]>>` | ✓ |
| IEmployeeBeneficiaryAppService | `GetByEmployeeAsync` | GET_SINGLE | `Task<ApiResponseDTO<EmployeeBeneficiaryDTO[]>>` | ✓ |
| IEmployeeBeneficiaryAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<EmployeeBeneficiaryDTO>>` | ✓ |
| IEmployeeBeneficiaryAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<EmployeeBeneficiaryDTO>>` | ✓ |
| IEmployeeBeneficiaryAppService | `UpsertAsync` | UPDATE | `Task<ApiResponseDTO<EmployeeBeneficiaryDTO>>` | ✓ |
| IEmployeeBirthdayAppService | `EmployeeBirthdayAsync` | OTHER | `Task<ApiResponseDTO<List<EmployeeBirthdayDTO>>>` | ⚠ naming no CRUD estandar |
| IEmployeeClinicalDataAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<EmployeeClinicalDataDTO>>` | ✓ |
| IEmployeeClinicalDataAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IEmployeeClinicalDataAppService | `GetByEmployeeAsync` | GET_SINGLE | `Task<ApiResponseDTO<EmployeeClinicalDataDTO[]>>` | ✓ |
| IEmployeeClinicalDataAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<EmployeeClinicalDataDTO>>` | ✓ |
| IEmployeeClinicalDataAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<EmployeeClinicalDataDTO>>` | ✓ |
| IEmployeeDocumentAppService | `GetDocumentsAsync` | GET_LIST | `Task<ApiResponseDTO<List<CandidateHiringDocumentListItemDTO>>>` | ⚠ Get sin ByXxx/All |
| IEmployeeDocumentAppService | `NotifyDocumentsUploadedAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| IEmployeeDocumentAppService | `RejectDocumentAsync` | SPECIAL | `Task<ApiResponseDTO<CandidateHiringDocumentListItemDTO>>` | ✓ |
| IEmployeeDocumentAppService | `RemoveDocumentFileAsync` | DELETE | `Task<ApiResponseDTO<CandidateHiringDocumentListItemDTO>>` | ✓ |
| IEmployeeDocumentAppService | `ReorderDocumentsAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| IEmployeeDocumentAppService | `UploadDocumentAsync` | SPECIAL | `Task<ApiResponseDTO<CandidateHiringDocumentListItemDTO>>` | ✓ |
| IEmployeeDocumentAppService | `ValidateDocumentAsync` | SPECIAL | `Task<ApiResponseDTO<CandidateHiringDocumentListItemDTO>>` | ✓ |
| IEmployeeEmergencyContactAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<EmployeeEmergencyContact>>` | ✓ |
| IEmployeeEmergencyContactAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IEmployeeEmergencyContactAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<EmployeeEmergencyContactAddOrEditDTO>>` | ✓ |
| IEmployeeEmergencyContactAppService | `GetEmployeeContactsAsync` | GET_LIST | `Task<ApiResponseDTO<List<EmployeeEmergencyContactDTO>>>` | ⚠ Get sin ByXxx/All |
| IEmployeeEmergencyContactAppService | `UpdateEmployeeContactAsync` | UPDATE | `Task<ApiResponseDTO<EmployeeEmergencyContactAddOrEditDTO>>` | ✓ |
| IEmployeeExternalAppService | `AddAccessCustomerAsync` | CREATE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IEmployeeExternalAppService | `CreateAsync` | CREATE | `Task<ApiResponseDTO<EmployeeExternalListDTO>>` | ✓ |
| IEmployeeExternalAppService | `DeleteAccessCutomerAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IEmployeeExternalAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IEmployeeExternalAppService | `ExternoGetByIdAsync` | OTHER | `Task<ApiResponseDTO<EmployeeExternalDTO>>` | ⚠ naming no CRUD estandar |
| IEmployeeExternalAppService | `GetExternalListAsync` | GET_LIST | `Task<ApiResponseDTO<List<EmployeeExternalListDTO>>>` | ✓ |
| IEmployeeExternalAppService | `SearchUserByEmailAsync` | OTHER | `Task<ApiResponseDTO<List<EmployeeExternalMatchDTO>>>` | ⚠ naming no CRUD estandar |
| IEmployeeExternalAppService | `SearchUserByPhoneNumberAsync` | OTHER | `Task<ApiResponseDTO<List<EmployeeExternalMatchDTO>>>` | ⚠ naming no CRUD estandar |
| IEmployeeExternalAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<EmployeeExternalListDTO>>` | ✓ |
| IEmployeeFileAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<EmployeeFileSummaryDTO[]>>` | ✓ |
| IEmployeeFileAppService | `GetBankDataAsync` | GET_SINGLE | `Task<ApiResponseDTO<EmployeeFileBankDataDTO[]>>` | ⚠ Get sin ByXxx/All |
| IEmployeeFileAppService | `GetBeneficiariesAsync` | GET_LIST | `Task<ApiResponseDTO<EmployeeFileBeneficiaryDTO[]>>` | ⚠ Get sin ByXxx/All |
| IEmployeeFileAppService | `GetClinicalDataAsync` | GET_SINGLE | `Task<ApiResponseDTO<EmployeeFileClinicalDataDTO[]>>` | ⚠ Get sin ByXxx/All |
| IEmployeeFileAppService | `GetContractsAsync` | GET_LIST | `Task<ApiResponseDTO<EmployeeFileContractDTO[]>>` | ⚠ Get sin ByXxx/All |
| IEmployeeFileAppService | `GetEmergencyContactsAsync` | GET_LIST | `Task<ApiResponseDTO<EmployeeFileEmergencyContactDTO[]>>` | ⚠ Get sin ByXxx/All |
| IEmployeeFileAppService | `GetEvaluationsAsync` | GET_LIST | `Task<ApiResponseDTO<EmployeeFileEvaluationDTO[]>>` | ⚠ Get sin ByXxx/All |
| IEmployeeFileAppService | `GetHeaderAsync` | GET_SINGLE | `Task<ApiResponseDTO<EmployeeFileHeaderDTO>>` | ⚠ Get sin ByXxx/All |
| IEmployeeFileAppService | `GetIncidentsAsync` | GET_LIST | `Task<ApiResponseDTO<EmployeeFileIncidentDTO[]>>` | ⚠ Get sin ByXxx/All |
| IEmployeeFileAppService | `GetPersonalDataAsync` | GET_SINGLE | `Task<ApiResponseDTO<EmployeeFilePersonalDataDTO>>` | ⚠ Get sin ByXxx/All |
| IEmployeeFileAppService | `GetRequestsAsync` | GET_LIST | `Task<ApiResponseDTO<EmployeeFileRequestsDTO>>` | ⚠ Get sin ByXxx/All |
| IEmployeeFileAppService | `GetVacationsAndLeavesAsync` | GET_LIST | `Task<ApiResponseDTO<EmployeeFileVacationsLeavesDTO>>` | ⚠ Get sin ByXxx/All |
| IEmployeeFileAppService | `GetWorkPositionAsync` | GET_SINGLE | `Task<ApiResponseDTO<EmployeeFileWorkPositionDTO>>` | ⚠ Get sin ByXxx/All |
| IEmployeeInternalAppService | `ActivateEmployeeAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| IEmployeeInternalAppService | `AddressDataAsync` | CREATE | `Task<ApiResponseDTO<EmployeeAddressDataEditDTO>>` | ✓ |
| IEmployeeInternalAppService | `BirthdayAsync` | OTHER | `Task<ApiResponseDTO<List<EmployeeBirthdayDTO>>>` | ⚠ naming no CRUD estandar |
| IEmployeeInternalAppService | `CheckDuplicateEmployeeAsync` | SPECIAL | `Task<ApiResponseDTO<EmployeeDuplicateDTO>>` | ✓ |
| IEmployeeInternalAppService | `CreateEmployeeAsync` | CREATE | `Task<ApiResponseDTO<Employee>>` | ✓ |
| IEmployeeInternalAppService | `CreateEmployeeExternal` | CREATE | `Task<ApiResponseDTO<Employee>>` | ✓ |
| IEmployeeInternalAppService | `DataForRecoveryPasswordAsync` | OTHER | `Task<ApiResponseDTO<EmployeeRecoveryPasswordDTO>>` | ⚠ naming no CRUD estandar |
| IEmployeeInternalAppService | `EmployeeTempAsync` | OTHER | `Task<ApiResponseDTO<List<Employee>>>` | ⚠ naming no CRUD estandar |
| IEmployeeInternalAppService | `GetAsyncById` | GET_SINGLE | `Task<ApiResponseDTO<EmployeeAddOrEditDTO>>` | ✓ |
| IEmployeeInternalAppService | `GetCardUserAsync` | GET_SINGLE | `Task<ApiResponseDTO<UserCardDTO>>` | ⚠ Get sin ByXxx/All |
| IEmployeeInternalAppService | `GetDossierAsync` | GET_SINGLE | `Task<ApiResponseDTO<EmployeeDossierDTO>>` | ⚠ Get sin ByXxx/All |
| IEmployeeInternalAppService | `GetLaboralDataAsync` | GET_SINGLE | `Task<ApiResponseDTO<EmployeeLaboralDataEditDTO>>` | ⚠ Get sin ByXxx/All |
| IEmployeeInternalAppService | `GetListAsync` | GET_LIST | `Task<ApiResponseDTO<List<EmployeeDTO>>>` | ✓ |
| IEmployeeInternalAppService | `GetPrincipalDataAsync` | GET_SINGLE | `Task<ApiResponseDTO<EmployeePrincipalDataEditDTO>>` | ⚠ Get sin ByXxx/All |
| IEmployeeInternalAppService | `GetUnifiedProfileAsync` | GET_SINGLE | `Task<ApiResponseDTO<EmployeeUnifiedProfileEditDTO>>` | ⚠ Get sin ByXxx/All |
| IEmployeeInternalAppService | `OnValidateStateAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| IEmployeeInternalAppService | `PersonalDataAsync` | OTHER | `Task<ApiResponseDTO<EmployeePersonalDataEditDTO>>` | ⚠ naming no CRUD estandar |
| IEmployeeInternalAppService | `PhotoPath` | OTHER | `Task<ApiResponseDTO<ImgPathFileCommonDTO>>` | ⚠ naming no CRUD estandar |
| IEmployeeInternalAppService | `UpdateAddressDataAync` | UPDATE | `Task<ApiResponseDTO<EmployeeAddressDataEditDTO>>` | ✓ |
| IEmployeeInternalAppService | `UpdateImgageAsync` | UPDATE | `Task<ApiResponseDTO<ImgPathFileCommonDTO>>` | ✓ |
| IEmployeeInternalAppService | `UpdateLaboralDataAsync` | UPDATE | `Task<ApiResponseDTO<EmployeeLaboralDataEditDTO>>` | ✓ |
| IEmployeeInternalAppService | `UpdatePersonalDataAsync` | UPDATE | `Task<ApiResponseDTO<EmployeePersonalDataEditDTO>>` | ✓ |
| IEmployeeInternalAppService | `UpdatePrincipalDataAsync` | UPDATE | `Task<ApiResponseDTO<EmployeePrincipalDataEditDTO>>` | ✓ |
| IEmployeeInternalAppService | `UpdateUnifiedProfileAsync` | UPDATE | `Task<ApiResponseDTO<EmployeeUnifiedProfileEditDTO>>` | ✓ |
| IEmployeeInternalAppService | `ValidarAdminAsisAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| IEmployeeInternalAppService | `ValidarRoleAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| IEmployeeInternalAppService | `ValidarSolicitudesAbiertas` | OTHER | `Task<ApiResponseDTO<EmployeeOpenRequestsDTO>>` | ⚠ naming no CRUD estandar |
| IEmployeeOnboardingChecklistAppService | `GetByEmployeeAsync` | GET_LIST | `Task<ApiResponseDTO<List<EmployeeOnboardingChecklistItemDTO>>>` | ✓ |
| IEmployeeOnboardingChecklistAppService | `InitializeChecklistAsync` | OTHER | `Task<ApiResponseDTO<List<EmployeeOnboardingChecklistItemDTO>>>` | ⚠ naming no CRUD estandar |
| IEmployeeOnboardingChecklistAppService | `InitializeChecklistForRoleAsync` | OTHER | `Task<ApiResponseDTO<List<EmployeeOnboardingChecklistItemDTO>>>` | ⚠ naming no CRUD estandar |
| IEmployeeOnboardingChecklistAppService | `UpdateOnboardingChecklistAsync` | UPDATE | `Task<ApiResponseDTO<EmployeeOnboardingChecklistItemDTO>>` | ✓ |
| IHrActionPolicyService | `CanManageStructuralHr` | OTHER | `bool` | ⚠ naming no CRUD estandar |
| IHrActionPolicyService | `CanViewConfidentialHrData` | OTHER | `bool` | ⚠ naming no CRUD estandar |
| IHrActionPolicyService | `EnsureCanManageStructuralHr` | OTHER | `void` | ⚠ naming no CRUD estandar |
| IHrActionPolicyService | `FilterAllowedRecipientRoles` | OTHER | `IEnumerable<ApplicationRoleEnum>` | ⚠ naming no CRUD estandar |
| IHrActionPolicyService | `ResolveCurrentUserRole` | OTHER | `ApplicationRoleEnum?` | ⚠ naming no CRUD estandar |
| IHrActionPolicyService | `ResolveWorkPositionRoleAsync` | OTHER | `Task<ApplicationRoleEnum?>` | ⚠ naming no CRUD estandar |
| IInterviewerMatrixAppService | `CreateAsync` | CREATE | `Task<ApiResponseDTO<InterviewerMatrixItemDTO>>` | ✓ |
| IInterviewerMatrixAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IInterviewerMatrixAppService | `GetBoardByCustomerAsync` | GET_SINGLE | `Task<ApiResponseDTO<InterviewerMatrixBoardDTO>>` | ✓ |
| IInterviewerMatrixAppService | `GetByCustomerAsync` | GET_LIST | `Task<ApiResponseDTO<List<InterviewerMatrixItemDTO>>>` | ✓ |
| IInterviewerMatrixAppService | `GetEligibleInterviewersByRequestPositionAsync` | GET_LIST | `Task<ApiResponseDTO<List<EligibleInterviewerOptionDTO>>>` | ✓ |
| IInterviewerMatrixAppService | `ResolveInterviewerRoleAsync` | OTHER | `Task<ApiResponseDTO<ApplicationRoleEnum?>>` | ⚠ naming no CRUD estandar |
| IInterviewerMatrixAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<InterviewerMatrixItemDTO>>` | ✓ |
| IJobDescriptionAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<JobDescriptionDTO>>` | ✓ |
| IJobDescriptionAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IJobDescriptionAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<JobDescriptionDTO[]>>` | ✓ |
| IJobDescriptionAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<JobDescriptionAddOrEditDTO>>` | ✓ |
| IJobDescriptionAppService | `GetByWorkPositionIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<JobDescriptionDTO>>` | ✓ |
| IJobDescriptionAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<JobDescriptionDTO>>` | ✓ |
| IMultiChannelAlertService | `SendAlertAsync` | SPECIAL | `Task` | ✓ |
| IPersonProviderSupportAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<PersonProviderSupport>>` | ✓ |
| IPersonProviderSupportAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<List<ProviderSupportListDTO>>>` | ✓ |
| IPersonProviderSupportAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<ProviderSupportAddOrEditDTO>>` | ✓ |
| IPersonProviderSupportAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<PersonProviderSupport>>` | ✓ |
| IReclutamientoIntegrationService | `GetEmployeeOpenRequestsAsync` | GET_LIST | `Task<ApiResponseDTO<EmployeeOpenRequestsDTO>>` | ⚠ Get sin ByXxx/All |
| IReclutamientoQueryService | `GetRequestsGlobalPendingAsync` | GET_LIST | `Task<ApiResponseDTO<IEnumerable<ListSolicitudesClienteDTO>>>` | ⚠ Get sin ByXxx/All |
| IReclutamientoQueryService | `RequestsByCustomerAsync` | OTHER | `Task<ApiResponseDTO<IEnumerable<ListSolicitudesClienteDTO>>>` | ⚠ naming no CRUD estandar |
| IRecruitmentSourceCatalogAppService | `CreateAsync` | CREATE | `Task<ApiResponseDTO<RecruitmentSourceCatalogListItemDTO>>` | ✓ |
| IRecruitmentSourceCatalogAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IRecruitmentSourceCatalogAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<List<RecruitmentSourceCatalogListItemDTO>>>` | ✓ |
| IRecruitmentSourceCatalogAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<RecruitmentSourceCatalogListItemDTO>>` | ✓ |
| IRecruitmentSourceCatalogAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<RecruitmentSourceCatalogListItemDTO>>` | ✓ |
| IRecurringTaskGeneratorService | `GenerateInstancesForAllCustomersAsync` | SPECIAL | `Task` | ✓ |
| IRequestDismissalDiscountAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<RequestDismissalDiscountDTO>>` | ✓ |
| IRequestDismissalDiscountAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IRequestDismissalDiscountAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<RequestDismissalDiscountDTO>>` | ✓ |
| IRequestDismissalDiscountAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<RequestDismissalDiscountDTO>>` | ✓ |
| IRequestEmployeeRegisterAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<RequestEmployeeRegister>>` | ✓ |
| IRequestEmployeeRegisterAppService | `CompleteDraftAltaAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| IRequestEmployeeRegisterAppService | `ConcludeAdministrativelyAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| IRequestEmployeeRegisterAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IRequestEmployeeRegisterAppService | `ExportHiringFormatPdfAsync` | SPECIAL | `Task<FileResult>` | ✓ |
| IRequestEmployeeRegisterAppService | `ExportMergedHiringPdfAsync` | SPECIAL | `Task<FileResult>` | ✓ |
| IRequestEmployeeRegisterAppService | `ExportRequestToExcelAsync` | SPECIAL | `Task<FileResult>` | ✓ |
| IRequestEmployeeRegisterAppService | `GetBasicInfoAsync` | GET_SINGLE | `Task<ApiResponseDTO<RequestEmployeeRegisterBasicInfoDTO>>` | ⚠ Get sin ByXxx/All |
| IRequestEmployeeRegisterAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<RequestEmployeeRegisterGetByIdDTO>>` | ✓ |
| IRequestEmployeeRegisterAppService | `GetEmployeeRegisterAsync` | GET_SINGLE | `Task<ApiResponseDTO<GetRequestEmployeeRegisterDTO>>` | ⚠ Get sin ByXxx/All |
| IRequestEmployeeRegisterAppService | `GetListRequestEmployeeRegisterAsync` | GET_LIST | `Task<ApiResponseDTO<List<object>>>` | ✓ |
| IRequestEmployeeRegisterAppService | `OnSendEmailAltaSistemasAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| IRequestEmployeeRegisterAppService | `OnSolicitudAltaAsync` | OTHER | `Task<ApiResponseDTO<RequestEmployeeRegister>>` | ⚠ naming no CRUD estandar |
| IRequestEmployeeRegisterAppService | `ReactivateAndMigrateEmployeeAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| IRequestEmployeeRegisterAppService | `ResendSolicitudAltaEmailAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| IRequestEmployeeRegisterAppService | `SearchEmployeeDuplicatesAsync` | OTHER | `Task<ApiResponseDTO<List<DuplicateEmployeeMatchDTO>>>` | ⚠ naming no CRUD estandar |
| IRequestEmployeeRegisterAppService | `SendMergedHiringPdfAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| IRequestEmployeeRegisterAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<RequestEmployeeRegister>>` | ✓ |
| IRequestEmployeeRegisterAppService | `UpdateStatusAsync` | UPDATE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IRequestPositionAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<RequestPositionDTO>>` | ✓ |
| IRequestPositionAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IRequestPositionAppService | `DeleteCascadeAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IRequestPositionAppService | `ExportToExcelAsync` | SPECIAL | `Task<FileResult>` | ✓ |
| IRequestPositionAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<RequestPositionAddOrEditDTO>>` | ✓ |
| IRequestPositionAppService | `GetDeleteImpactAsync` | GET_SINGLE | `Task<ApiResponseDTO<RequestPositionDeleteImpactDTO>>` | ⚠ Get sin ByXxx/All |
| IRequestPositionAppService | `GetListAsync` | GET_LIST | `Task<ApiResponseDTO<List<SolicitudesVacanteListDTO>>>` | ✓ |
| IRequestPositionAppService | `GetPendingAsync` | GET_LIST | `Task<ApiResponseDTO<List<SolicitudesVacanteListDTO>>>` | ⚠ Get sin ByXxx/All |
| IRequestPositionAppService | `OnGetRequestPositionCandidate` | OTHER | `RequestPosition` | ⚠ naming no CRUD estandar |
| IRequestPositionAppService | `OnGetWorkPosition` | OTHER | `WorkPosition` | ⚠ naming no CRUD estandar |
| IRequestPositionAppService | `OnSolicitudVacanteAsync` | OTHER | `Task<ApiResponseDTO<RequestPosition>>` | ⚠ naming no CRUD estandar |
| IRequestPositionAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<RequestPositionDTO>>` | ✓ |
| IRequestSalaryModificationAppService | `ExportToExcelAsync` | SPECIAL | `Task<FileResult>` | ✓ |
| IRequestSalaryModificationAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<RequestSalaryModificationDTO>>` | ✓ |
| IRequestSalaryModificationAppService | `GetDataForModificacionSalarioAsync` | GET_SINGLE | `Task<ApiResponseDTO<GetDataForModificacionSalarioDTO>>` | ⚠ Get sin ByXxx/All |
| IRequestSalaryModificationAppService | `GetListAsync` | GET_LIST | `Task<ApiResponseDTO<List<RequestSalaryModificationListDTO>>>` | ✓ |
| IRequestSalaryModificationAppService | `GetStatusAsync` | GET_LIST | `Task<ApiResponseDTO<StatusRequestSalaryModificationDTO>>` | ⚠ Get sin ByXxx/All |
| IRequestSalaryModificationAppService | `OnSolicitudModificacionSalarialAsync` | OTHER | `Task<ApiResponseDTO<RequestSalaryModification>>` | ⚠ naming no CRUD estandar |
| IRequestSalaryModificationAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<RequestSalaryModificationDTO>>` | ✓ |
| ISanctionTypeAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<SanctionTypeDetailDTO>>` | ✓ |
| ISanctionTypeAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ISanctionTypeAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<SanctionTypeListDTO[]>>` | ✓ |
| ISanctionTypeAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<SanctionTypeDetailDTO>>` | ✓ |
| ISanctionTypeAppService | `ToggleActiveAsync` | SPECIAL | `Task<ApiResponseDTO<SanctionTypeDetailDTO>>` | ✓ |
| ISanctionTypeAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<SanctionTypeDetailDTO>>` | ✓ |
| ISolicitudBajaAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<RequestDismissal>>` | ✓ |
| ISolicitudBajaAppService | `AttachEvaluationAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| ISolicitudBajaAppService | `AttachIncidentAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| ISolicitudBajaAppService | `AuthorizeDismissalAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| ISolicitudBajaAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ISolicitudBajaAppService | `ExportRequestToExcelAsync` | SPECIAL | `Task<FileResult>` | ✓ |
| ISolicitudBajaAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<RequestDismissalDTO>>` | ✓ |
| ISolicitudBajaAppService | `GetListAsync` | GET_LIST | `Task<ApiResponseDTO<List<RequestDismissalListDTO>>>` | ✓ |
| ISolicitudBajaAppService | `GetRequestDismissal` | GET_SINGLE | `ApiResponseDTO<SolicitudBajaEmailDTO>` | ⚠ Get sin ByXxx/All |
| ISolicitudBajaAppService | `GetRequestDismissalSendRequestDTOAsync` | GET_LIST | `Task<ApiResponseDTO<List<RequestDismissalSendRequestDTO>>>` | ⚠ Get sin ByXxx/All |
| ISolicitudBajaAppService | `OnSendEmailRequestDismissalAsync` | OTHER | `Task<ApiResponseDTO<RequestDismissalSendRequestDTO>>` | ⚠ naming no CRUD estandar |
| ISolicitudBajaAppService | `OnSolicitudBajaAsync` | OTHER | `Task<ApiResponseDTO<RequestDismissal>>` | ⚠ naming no CRUD estandar |
| ISolicitudBajaAppService | `PutRequestDismissalAsync` | UPDATE | `Task<ApiResponseDTO<object>>` | ✓ |
| ISolicitudBajaAppService | `UpdateStatusAsync` | UPDATE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ITaskInstanceAppService | `AddCommentAsync` | CREATE | `Task<ApiResponseDTO<TaskCommentDTO>>` | ✓ |
| ITaskInstanceAppService | `CompleteAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| ITaskInstanceAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<TaskInstanceDTO>>` | ✓ |
| ITaskInstanceAppService | `GetForUserByDateAsync` | GET_LIST | `Task<ApiResponseDTO<IEnumerable<TaskInstanceDTO>>>` | ✓ |
| ITaskInstanceAppService | `ReopenAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| ITaskTemplateAppService | `AddItemToTemplateAsync` | CREATE | `Task<ApiResponseDTO<TaskTemplateItemDTO>>` | ✓ |
| ITaskTemplateAppService | `CreateTemplateAsync` | CREATE | `Task<ApiResponseDTO<TaskTemplateDTO>>` | ✓ |
| ITaskTemplateAppService | `DeleteItemAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ITaskTemplateAppService | `DeleteTemplateAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ITaskTemplateAppService | `GetAllTemplatesAsync` | GET_LIST | `Task<ApiResponseDTO<IEnumerable<TaskTemplateDTO>>>` | ✓ |
| ITaskTemplateAppService | `GetCustomerConfigAsync` | GET_SINGLE | `Task<ApiResponseDTO<CustomerTaskItemConfigDTO>>` | ⚠ Get sin ByXxx/All |
| ITaskTemplateAppService | `GetItemsByTemplateIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<IEnumerable<TaskTemplateItemDTO>>>` | ✓ |
| ITaskTemplateAppService | `GetTemplateByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<TaskTemplateDTO>>` | ✓ |
| ITaskTemplateAppService | `ReorderTemplateItemsAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| ITaskTemplateAppService | `UpdateCustomerConfigAsync` | UPDATE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ITaskTemplateAppService | `UpdateItemInTemplateAsync` | UPDATE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ITaskTemplateAppService | `UpdateTemplateAsync` | UPDATE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IWorkPositionAppService | `ActivateAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| IWorkPositionAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<WorkPositionDTO>>` | ✓ |
| IWorkPositionAppService | `AssignEmployeeAsync` | SPECIAL | `Task<ApiResponseDTO<WorkPositionDTO>>` | ✓ |
| IWorkPositionAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IWorkPositionAppService | `GetAllGeneralAsync` | GET_LIST | `Task<ApiResponseDTO<object>>` | ✓ |
| IWorkPositionAppService | `GetAsyncAll` | GET_LIST | `Task<ApiResponseDTO<List<WorkPositionListDTO>>>` | ✓ |
| IWorkPositionAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<WorkPositionRequestAddOrEditDTO>>` | ✓ |
| IWorkPositionAppService | `GetForEditAsync` | GET_SINGLE | `Task<ApiResponseDTO<WorkPositionAddOrEditDTO>>` | ⚠ Get sin ByXxx/All |
| IWorkPositionAppService | `GetHoursAsync` | GET_LIST | `Task<ApiResponseDTO<WorkPositionHoursDTO>>` | ⚠ Get sin ByXxx/All |
| IWorkPositionAppService | `UnassignEmployeeAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| IWorkPositionAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<WorkPositionDTO>>` | ✓ |
| IWorkPositionOrgChartAppService | `GetTreeAsync` | GET_LIST | `Task<ApiResponseDTO<List<RoleOrgChartNodeDTO>>>` | ⚠ Get sin ByXxx/All |
| IWorkPositionOrgChartAppService | `ReassignAsync` | SPECIAL | `Task<ApiResponseDTO<WorkPositionReassignResponse>>` | ✓ |

### Endpoints

| Verbo | Ruta | Handler | Categoria |
|---|---|---|---|
| GET | `api/birthday/{customerId:guid}/{month:int}` | `EmployeeBirthdayAsync` | GET_SINGLE |
| POST | `api/checklist-options` | `CreateAsync` | CREATE |
| GET | `api/checklist-options` | `GetAllAsync` | GET_LIST |
| PUT | `api/checklist-options/{id:guid}` | `UpdateAsync` | UPDATE |
| DELETE | `api/checklist-options/{id:guid}` | `DeleteAsync` | DELETE |
| POST | `api/employee-bank-data` | `UpsertAsync` | CREATE |
| PUT | `api/employee-bank-data/{id:guid}` | `UpdateAsync` | UPDATE |
| DELETE | `api/employee-bank-data/{id:guid}` | `DeleteAsync` | DELETE |
| GET | `api/employee-bank-data/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| GET | `api/employee-bank-data/employee/{employeeId:guid}` | `GetByEmployeeAsync` | GET_SINGLE |
| GET | `api/employee-bank-data/list/{customerId:guid}` | `GetAllAsync` | GET_SINGLE |
| POST | `api/employee-beneficiary` | `UpsertAsync` | CREATE |
| GET | `api/employee-beneficiary/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| DELETE | `api/employee-beneficiary/{id:guid}` | `DeleteAsync` | DELETE |
| PUT | `api/employee-beneficiary/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/employee-beneficiary/employee/{employeeId:guid}` | `GetByEmployeeAsync` | GET_SINGLE |
| GET | `api/employee-beneficiary/list/{customerId:guid}` | `GetAllAsync` | GET_SINGLE |
| POST | `api/employee-clinical-data` | `AddAsync` | CREATE |
| DELETE | `api/employee-clinical-data/{id:guid}` | `DeleteAsync` | DELETE |
| PUT | `api/employee-clinical-data/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/employee-clinical-data/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| GET | `api/employee-clinical-data/employee/{employeeId:guid}` | `GetByEmployeeAsync` | GET_SINGLE |
| POST | `api/employee-documents/{documentId:guid}/reject` | `RejectDocumentAsync` | SPECIAL |
| POST | `api/employee-documents/{documentId:guid}/validate` | `ValidateDocumentAsync` | SPECIAL |
| GET | `api/employee-documents/{employeeId:guid}` | `GetDocumentsAsync` | GET_SINGLE |
| DELETE | `api/employee-documents/{employeeId:guid}/documents/{documentId:guid}/file` | `RemoveDocumentFileAsync` | DELETE |
| PUT | `api/employee-documents/{employeeId:guid}/reorder` | `ReorderDocumentsAsync` | UPDATE |
| POST | `api/employee-documents/{employeeId:guid}/upload` | `UploadDocumentAsync` | SPECIAL |
| POST | `api/employee-documents/notify-recruitment/{employeeId:guid}` | `NotifyDocumentsUploadedAsync` | SPECIAL |
| POST | `api/employee-emergency-contact` | `AddAsync` | CREATE |
| PUT | `api/employee-emergency-contact/{employeeEmergencyContactId:guid}` | `UpdateEmployeeContactAsync` | UPDATE |
| DELETE | `api/employee-emergency-contact/{id:guid}` | `DeleteByIdAsync` | DELETE |
| GET | `api/employee-emergency-contact/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| GET | `api/employee-emergency-contact/list-employee-contact/{employeeId:guid}/{contacOfBeneficiary}` | `GetEmployeeContactsAsync` | GET_SINGLE |
| POST | `api/employee-external` | `CreateAsync` | CREATE |
| PUT | `api/employee-external/{applicationUserId}` | `UpdateAsync` | UPDATE |
| GET | `api/employee-external/{applicationUserId}` | `ExternoGetByIdAsync` | GET_SINGLE |
| DELETE | `api/employee-external/{applicationUserId}` | `DeleteAsync` | DELETE |
| POST | `api/employee-external/add-access-cutomer/{applicationUserId}/{customerId:guid}` | `AddAccessCustomerAsync` | CREATE |
| DELETE | `api/employee-external/delete-access-cutomer/{applicationUserId}/{customerId:guid}` | `DeleteAccessCutomerAsync` | DELETE |
| GET | `api/employee-external/list/{customerId:guid}/{active:bool}` | `GetExternalListAsync` | GET_SINGLE |
| GET | `api/employee-external/search-by-email/{customerId:guid}` | `SearchUserByEmailAsync` | GET_SINGLE |
| GET | `api/employee-external/search-by-phone/{customerId:guid}` | `SearchUserByPhoneNumberAsync` | GET_SINGLE |
| PATCH | `api/employee-internal/{applicationUserId}/activate` | `ActivateEmployeeAsync` | UPDATE |
| GET | `api/employee-internal/address-data/{employeeId:guid}` | `AddressDataAsync` | GET_SINGLE |
| GET | `api/employee-internal/card-user/{applicationUserId}` | `GetCardUserAsync` | GET_SINGLE |
| GET | `api/employee-internal/check-duplicate` | `CheckDuplicateEmployeeAsync` | GET_LIST |
| GET | `api/employee-internal/data-for-recovery-password/{applicationUserId}` | `DataForRecoveryPasswordAsync` | GET_SINGLE |
| GET | `api/employee-internal/laboral-data/{applicationUserId}` | `GetLaboralDataAsync` | GET_SINGLE |
| GET | `api/employee-internal/list/{customerId:guid}/{active:bool}` | `GetListAsync` | GET_SINGLE |
| GET | `api/employee-internal/on-validate-state/{applicationUserId}` | `OnValidateStateAsync` | GET_SINGLE |
| GET | `api/employee-internal/personal-data/{employeeId:guid}` | `PersonalDataAsync` | GET_SINGLE |
| GET | `api/employee-internal/photo-path/{applicationUserId}` | `PhotoPath` | GET_SINGLE |
| GET | `api/employee-internal/principal-data/{applicationUserId}` | `GetPrincipalDataAsync` | GET_SINGLE |
| GET | `api/employee-internal/unified-profile/{employeeId:guid}/{applicationUserId}` | `GetUnifiedProfileAsync` | GET_SINGLE |
| PUT | `api/employee-internal/unified-profile/{employeeId:guid}/{applicationUserId}` | `UpdateUnifiedProfileAsync` | UPDATE |
| PUT | `api/employee-internal/update-address-data/{addressId:guid}` | `UpdateAddressDataAync` | UPDATE |
| PUT | `api/employee-internal/update-image/{applicationUserId}` | `UpdateImgageAsync` | UPDATE |
| PUT | `api/employee-internal/update-laboral-data/{applicationUserId}` | `UpdateLaboralDataAsync` | UPDATE |
| PUT | `api/employee-internal/update-personal-data/{employeeId:guid}` | `UpdatePersonalDataAsync` | UPDATE |
| PUT | `api/employee-internal/update-principal-data/{applicationUserId}` | `UpdatePrincipalDataAsync` | UPDATE |
| GET | `api/employees/{employeeId:guid}` | `GetAsyncById` | GET_SINGLE |
| GET | `api/employees/{employeeId:guid}/dossier` | `GetDossierAsync` | GET_SINGLE |
| GET | `api/employees/birthday/{customerId:guid}/{month:int}` | `BirthdayAsync` | GET_SINGLE |
| POST | `api/employees/create-employee` | `CreateEmployeeAsync` | CREATE |
| POST | `api/employees/create-employee-external` | `CreateEmployeeExternal` | CREATE |
| GET | `api/employees/employee-temp` | `EmployeeTempAsync` | GET_LIST |
| GET | `api/employees/validar-admin-asis/{applicationUserId}` | `ValidarAdminAsisAsync` | GET_SINGLE |
| GET | `api/employees/validar-solicitudes-abiertas/{employeeId:guid}` | `ValidarSolicitudesAbiertas` | GET_SINGLE |
| GET | `api/hr/employee-files` | `GetAllAsync` | GET_LIST |
| GET | `api/hr/employee-files/{employeeId:guid}/bank-data` | `GetBankDataAsync` | GET_SINGLE |
| GET | `api/hr/employee-files/{employeeId:guid}/beneficiaries` | `GetBeneficiariesAsync` | GET_SINGLE |
| GET | `api/hr/employee-files/{employeeId:guid}/clinical-data` | `GetClinicalDataAsync` | GET_SINGLE |
| GET | `api/hr/employee-files/{employeeId:guid}/contracts` | `GetContractsAsync` | GET_SINGLE |
| GET | `api/hr/employee-files/{employeeId:guid}/emergency-contacts` | `GetEmergencyContactsAsync` | GET_SINGLE |
| GET | `api/hr/employee-files/{employeeId:guid}/evaluations` | `GetEvaluationsAsync` | GET_SINGLE |
| GET | `api/hr/employee-files/{employeeId:guid}/incidents` | `GetIncidentsAsync` | GET_SINGLE |
| GET | `api/hr/employee-files/{employeeId:guid}/onboarding-checklist` | `GetByEmployeeAsync` | GET_SINGLE |
| POST | `api/hr/employee-files/{employeeId:guid}/onboarding-checklist/initialize` | `InitializeChecklistAsync` | CREATE |
| GET | `api/hr/employee-files/{employeeId:guid}/personal-data` | `GetPersonalDataAsync` | GET_SINGLE |
| GET | `api/hr/employee-files/{employeeId:guid}/requests` | `GetRequestsAsync` | GET_SINGLE |
| GET | `api/hr/employee-files/{employeeId:guid}/summary` | `GetHeaderAsync` | GET_SINGLE |
| GET | `api/hr/employee-files/{employeeId:guid}/vacations-leaves` | `GetVacationsAndLeavesAsync` | GET_SINGLE |
| GET | `api/hr/employee-files/{employeeId:guid}/work-position` | `GetWorkPositionAsync` | GET_SINGLE |
| PUT | `api/hr/employee-files/onboarding-checklist/{taskId:guid}` | `UpdateOnboardingChecklistAsync` | UPDATE |
| POST | `api/hr/employee-files/onboarding-checklist/{taskId:guid}/toggle` | `UpdateOnboardingChecklistAsync` | SPECIAL |
| GET | `api/hr/sanction-types` | `GetAllAsync` | GET_LIST |
| POST | `api/hr/sanction-types` | `AddAsync` | CREATE |
| PUT | `api/hr/sanction-types/{id:guid}` | `UpdateAsync` | UPDATE |
| DELETE | `api/hr/sanction-types/{id:guid}` | `DeleteAsync` | DELETE |
| GET | `api/hr/sanction-types/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| PATCH | `api/hr/sanction-types/{id:guid}/toggle` | `ToggleActiveAsync` | UPDATE |
| POST | `api/job-descriptions` | `AddAsync` | CREATE |
| GET | `api/job-descriptions` | `GetAllAsync` | GET_LIST |
| GET | `api/job-descriptions/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| PUT | `api/job-descriptions/{id:guid}` | `UpdateAsync` | UPDATE |
| DELETE | `api/job-descriptions/{id:guid}` | `DeleteByIdAsync` | DELETE |
| POST | `api/job-descriptions/analyze` | `AnalyzeJobDescriptionAsync` | CREATE |
| GET | `api/job-descriptions/by-workposition/{workPositionId:guid}` | `GetByWorkPositionIdAsync` | GET_SINGLE |
| POST | `api/job-descriptions/generate-proposal` | `GenerateJobDescriptionAsync` | SPECIAL |
| DELETE | `api/operation/recruitment/performance-evaluations/{id:guid}` | `DeleteByIdAsync` | DELETE |
| GET | `api/operation/recruitment/performance-evaluations/{id:guid}/result` | `GetResultByIdAsync` | GET_SINGLE |
| POST | `api/operation/recruitment/performance-evaluations/create` | `CreateAsync` | CREATE |
| GET | `api/operation/recruitment/performance-evaluations/customer/{customerId:guid}/history` | `GetHistoryForClientAsync` | GET_SINGLE |
| GET | `api/operation/recruitment/performance-evaluations/employee/{employeeId:guid}/history` | `GetHistoryForEmployeeAsync` | GET_SINGLE |
| PUT | `api/operation/recruitment/performance-evaluations/update/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/operation/recruitment/select-items/accounting-catalogs/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/operation/recruitment/select-items/accounts-for-customer/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/operation/recruitment/select-items/administration-minutes/{customerId:guid}/{meetingId:guid}` | (inline) | GET_SINGLE |
| GET | `api/operation/recruitment/select-items/almacenes/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/operation/recruitment/select-items/application-roles` | (inline) | GET_LIST |
| GET | `api/operation/recruitment/select-items/application-roles-to-administrator` | (inline) | GET_LIST |
| GET | `api/operation/recruitment/select-items/application-roles-to-provider` | (inline) | GET_LIST |
| GET | `api/operation/recruitment/select-items/application-user-providers` | (inline) | GET_LIST |
| GET | `api/operation/recruitment/select-items/application-users` | (inline) | GET_LIST |
| GET | `api/operation/recruitment/select-items/application-users/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/operation/recruitment/select-items/aspel-customer-empresa` | (inline) | GET_LIST |
| GET | `api/operation/recruitment/select-items/banks` | (inline) | GET_LIST |
| GET | `api/operation/recruitment/select-items/boolean-options` | (inline) | GET_LIST |
| GET | `api/operation/recruitment/select-items/building-residents/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/operation/recruitment/select-items/candidates` | (inline) | GET_LIST |
| GET | `api/operation/recruitment/select-items/categories` | (inline) | GET_LIST |
| GET | `api/operation/recruitment/select-items/cfdi-uses` | (inline) | GET_LIST |
| GET | `api/operation/recruitment/select-items/committee-minutes/{customerId:guid}/{meetingId:guid}` | (inline) | GET_SINGLE |
| GET | `api/operation/recruitment/select-items/customer-inspections/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/operation/recruitment/select-items/customers-access/{applicationUserId}` | (inline) | GET_SINGLE |
| GET | `api/operation/recruitment/select-items/customers-active` | (inline) | GET_LIST |
| GET | `api/operation/recruitment/select-items/customers-active-short-name` | (inline) | GET_LIST |
| GET | `api/operation/recruitment/select-items/customers-all` | (inline) | GET_LIST |
| GET | `api/operation/recruitment/select-items/customers-inactive` | (inline) | GET_LIST |
| GET | `api/operation/recruitment/select-items/document-catalog` | (inline) | GET_LIST |
| GET | `api/operation/recruitment/select-items/employees/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/operation/recruitment/select-items/employees-active` | (inline) | GET_LIST |
| GET | `api/operation/recruitment/select-items/employees-active/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/operation/recruitment/select-items/employees-by-user-id/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/operation/recruitment/select-items/equipment-classifications` | (inline) | GET_LIST |
| GET | `api/operation/recruitment/select-items/equipo-calendario-maestro` | (inline) | GET_LIST |
| GET | `api/operation/recruitment/select-items/evaluation-templates/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/operation/recruitment/select-items/funding-period/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/operation/recruitment/select-items/inspection-review-catalogs` | (inline) | GET_LIST |
| GET | `api/operation/recruitment/select-items/legal-matter-categories` | (inline) | GET_LIST |
| GET | `api/operation/recruitment/select-items/legal-matters` | (inline) | GET_LIST |
| GET | `api/operation/recruitment/select-items/listado-instalaciones/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/operation/recruitment/select-items/machineries-active/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/operation/recruitment/select-items/machineries-all/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/operation/recruitment/select-items/measurement-units` | (inline) | GET_LIST |
| GET | `api/operation/recruitment/select-items/medidor-categoria` | (inline) | GET_LIST |
| GET | `api/operation/recruitment/select-items/module-apps` | (inline) | GET_LIST |
| GET | `api/operation/recruitment/select-items/nombre-corto` | (inline) | GET_LIST |
| GET | `api/operation/recruitment/select-items/onboarding-checklist-options` | (inline) | GET_LIST |
| GET | `api/operation/recruitment/select-items/operations-interviewers/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/operation/recruitment/select-items/operations-interviewers/by-request-position/{requestPositionId:guid}` | (inline) | GET_SINGLE |
| GET | `api/operation/recruitment/select-items/owners/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/operation/recruitment/select-items/participant-administration/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/operation/recruitment/select-items/payment-methods` | (inline) | GET_LIST |
| GET | `api/operation/recruitment/select-items/payment-ways` | (inline) | GET_LIST |
| GET | `api/operation/recruitment/select-items/people/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/operation/recruitment/select-items/people-employees/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/operation/recruitment/select-items/products` | (inline) | GET_LIST |
| GET | `api/operation/recruitment/select-items/professions` | (inline) | GET_LIST |
| GET | `api/operation/recruitment/select-items/properties/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/operation/recruitment/select-items/property-accounts/{customerId:guid}/{year:int}` | (inline) | GET_SINGLE |
| GET | `api/operation/recruitment/select-items/property-members/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/operation/recruitment/select-items/providers/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/operation/recruitment/select-items/recruitment-sources` | (inline) | GET_LIST |
| GET | `api/operation/recruitment/select-items/request-positions-pending` | (inline) | GET_LIST |
| GET | `api/operation/recruitment/select-items/residentes-edificio/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/operation/recruitment/select-items/responsable-sistemas` | (inline) | GET_LIST |
| GET | `api/operation/recruitment/select-items/rich-products` | (inline) | GET_LIST |
| GET | `api/operation/recruitment/select-items/roles` | (inline) | GET_LIST |
| GET | `api/operation/recruitment/select-items/roles-by-role-type/{roleType}` | (inline) | GET_LIST |
| GET | `api/operation/recruitment/select-items/roles-for-announcements` | (inline) | GET_LIST |
| GET | `api/operation/recruitment/select-items/roles-for-document` | (inline) | GET_LIST |
| GET | `api/operation/recruitment/select-items/select-for-add-ticket` | (inline) | GET_LIST |
| GET | `api/operation/recruitment/select-items/service-year/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/operation/recruitment/select-items/supervision-list` | (inline) | GET_LIST |
| GET | `api/operation/recruitment/select-items/task-group-category/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/operation/recruitment/select-items/task-group-list/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/operation/recruitment/select-items/tools/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/operation/recruitment/select-items/users-from-customer/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/operation/recruitment/select-items/vacantes/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/provider-support` | `GetAllAsync` | GET_LIST |
| POST | `api/provider-support` | `AddAsync` | CREATE |
| GET | `api/provider-support/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| PUT | `api/provider-support/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/recruitment-candidate-processes` | `GetTrayAsync` | GET_LIST |
| POST | `api/recruitment-candidate-processes` | `CreateAsync` | CREATE |
| GET | `api/recruitment-candidate-processes/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| PUT | `api/recruitment-candidate-processes/{id:guid}` | `UpdateAsync` | UPDATE |
| POST | `api/recruitment-candidate-processes/{id:guid}/cancel-schedule` | `CancelScheduleAsync` | SPECIAL |
| POST | `api/recruitment-candidate-processes/{id:guid}/complete-hiring` | `CompleteHiringAsync` | SPECIAL |
| POST | `api/recruitment-candidate-processes/{id:guid}/decision` | `RegisterDecisionAsync` | CREATE |
| GET | `api/recruitment-candidate-processes/{id:guid}/hiring-documents` | `GetHiringDocumentsAsync` | GET_SINGLE |
| GET | `api/recruitment-candidate-processes/{id:guid}/interview-response` | `GetInterviewResponseAsync` | GET_SINGLE |
| PUT | `api/recruitment-candidate-processes/{id:guid}/multipart` | `UpdateFromFormAsync` | UPDATE |
| POST | `api/recruitment-candidate-processes/{id:guid}/reconfirm-presentation` | `ReconfirmPresentationAsync` | CREATE |
| POST | `api/recruitment-candidate-processes/{id:guid}/schedule` | `ScheduleAsync` | CREATE |
| POST | `api/recruitment-candidate-processes/{id:guid}/stage` | `ChangeStageAsync` | CREATE |
| POST | `api/recruitment-candidate-processes/api/recruitment-candidate-processes/{id:guid}/hiring-documents` | `UploadHiringDocumentAsync` | CREATE |
| DELETE | `api/recruitment-candidate-processes/api/recruitment-candidate-processes/{id:guid}/hiring-documents/{documentId:guid}/file` | `RemoveHiringDocumentFileAsync` | DELETE |
| POST | `api/recruitment-candidate-processes/api/recruitment-candidate-processes/{id:guid}/presentation-result` | `ConfirmPresentationAsync` | CREATE |
| POST | `api/recruitment-candidate-processes/api/recruitment-candidate-processes/{id:guid}/process-hiring` | `ProcessHiringAsync` | SPECIAL |
| POST | `api/recruitment-candidate-processes/api/recruitment-candidate-processes/direct-hire/{requestPositionId:guid}` | `ProcessDirectHiringAsync` | CREATE |
| POST | `api/recruitment-candidate-processes/api/recruitment-candidate-processes/hiring-documents/{documentId:guid}/validate` | `ValidateHiringDocumentAsync` | SPECIAL |
| GET | `api/recruitment-candidate-processes/by-stage/{stage}` | `GetByStageAsync` | GET_LIST |
| GET | `api/recruitment-candidate-processes/candidate/{candidateId:guid}` | `GetByCandidateAsync` | GET_SINGLE |
| GET | `api/recruitment-candidate-processes/employee-interviewer-queue/{customerId:guid}` | `GetEmployeeInterviewerQueueAsync` | GET_SINGLE |
| POST | `api/recruitment-candidate-processes/interviewer-action` | `ExecuteInterviewerActionAsync` | CREATE |
| GET | `api/recruitment-candidate-processes/interviewer-queue` | `GetInterviewerQueueAsync` | GET_LIST |
| GET | `api/recruitment-candidate-processes/interviewer-view` | `GetInterviewerViewAsync` | GET_LIST |
| GET | `api/recruitment-candidate-processes/kpis` | `GetKpisAsync` | GET_LIST |
| POST | `api/recruitment-candidate-processes/multipart` | `CreateFromFormAsync` | CREATE |
| GET | `api/recruitment-candidate-processes/recruitment-agenda` | `GetRecruitmentAgendaAsync` | GET_LIST |
| GET | `api/recruitment-candidate-processes/recruitment-board` | `GetRecruitmentInterviewBoardAsync` | GET_LIST |
| GET | `api/recruitment-candidate-processes/request-position/{requestPositionId:guid}` | `GetByRequestPositionAsync` | GET_SINGLE |
| GET | `api/recruitment-candidate-processes/request-position/{requestPositionId:guid}/timeline` | `GetTimelineByVacancyAsync` | GET_SINGLE |
| POST | `api/recruitment-candidate-processes/run-automation` | `ExecuteDailyMonitoringAsync` | CREATE |
| GET | `api/recruitment-candidate-processes/work-position/{workPositionId:guid}` | `GetByWorkPositionAsync` | GET_SINGLE |
| POST | `api/recruitment-candidates` | `CreateAsync` | CREATE |
| GET | `api/recruitment-candidates` | `GetListAsync` | GET_LIST |
| GET | `api/recruitment-candidates/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| DELETE | `api/recruitment-candidates/{id:guid}` | `DeleteAsync` | DELETE |
| PUT | `api/recruitment-candidates/{id:guid}` | `UpdateAsync` | UPDATE |
| PATCH | `api/recruitment-candidates/{id:guid}/archive` | `ArchiveAsync` | UPDATE |
| GET | `api/recruitment-candidates/{id:guid}/delete-impact` | `GetDeleteImpactAsync` | GET_SINGLE |
| PATCH | `api/recruitment-candidates/{id:guid}/unarchive` | `UnarchiveAsync` | UPDATE |
| POST | `api/recruitment-candidates/check-duplicate` | `CheckDuplicateCandidateAsync` | CREATE |
| GET | `api/recruitment-candidates/former-employees` | `GetFormerEmployeesAsync` | GET_LIST |
| POST | `api/recruitment-candidates/former-employees/{employeeId:guid}/ensure-candidate` | `EnsureCandidateFromFormerEmployeeAsync` | CREATE |
| GET | `api/recruitment-candidates/search-by-phone` | `SearchByPhoneAsync` | GET_LIST |
| POST | `api/recruitment-candidate-work-experiences` | `CreateAsync` | CREATE |
| DELETE | `api/recruitment-candidate-work-experiences/{id:guid}` | `DeleteAsync` | DELETE |
| PUT | `api/recruitment-candidate-work-experiences/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/recruitment-candidate-work-experiences/candidate/{candidateId:guid}` | `GetByCandidateAsync` | GET_SINGLE |
| POST | `api/recruitment-interviewer-matrix` | `CreateAsync` | CREATE |
| PUT | `api/recruitment-interviewer-matrix/{id:guid}` | `UpdateAsync` | UPDATE |
| DELETE | `api/recruitment-interviewer-matrix/{id:guid}` | `DeleteAsync` | DELETE |
| GET | `api/recruitment-interviewer-matrix/customer/{customerId:guid}` | `GetByCustomerAsync` | GET_SINGLE |
| GET | `api/recruitment-interviewer-matrix/customer/{customerId:guid}/board` | `GetBoardByCustomerAsync` | GET_SINGLE |
| GET | `api/recruitment-interviewer-matrix/eligible-interviewers/by-request-position/{requestPositionId:guid}` | `GetEligibleInterviewersByRequestPositionAsync` | GET_SINGLE |
| GET | `api/recruitment-interviewer-matrix/resolve/{customerId:guid}/{workPositionRole:int}` | `ResolveInterviewerRoleAsync` | GET_SINGLE |
| GET | `api/recruitment-requests/pending-global` | `GetRequestsGlobalPendingAsync` | GET_LIST |
| POST | `api/recruitment-requests/solicitud-alta/{applicationUserId}` | `OnSolicitudAltaAsync` | CREATE |
| POST | `api/recruitment-requests/solicitud-baja/{customerId}/{employeeId}` | `OnSolicitudBajaAsync` | CREATE |
| GET | `api/recruitment-requests/solicitudes-por-cliente/{customerId}/{applicationUserId}` | `RequestsByCustomerAsync` | GET_SINGLE |
| POST | `api/recruitment-requests/solicitud-modificacion-salario/{customerId}` | `OnSolicitudModificacionSalarialAsync` | CREATE |
| POST | `api/recruitment-requests/solicitud-vacante` | `OnSolicitudVacanteAsync` | CREATE |
| GET | `api/recruitment-source-catalogs` | `GetAllAsync` | GET_LIST |
| POST | `api/recruitment-source-catalogs` | `CreateAsync` | CREATE |
| DELETE | `api/recruitment-source-catalogs/{id:guid}` | `DeleteAsync` | DELETE |
| GET | `api/recruitment-source-catalogs/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| PUT | `api/recruitment-source-catalogs/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/recurring-tasks/instances/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| POST | `api/recurring-tasks/instances/{id:guid}/comments` | `AddCommentAsync` | CREATE |
| POST | `api/recurring-tasks/instances/{id:guid}/complete` | `CompleteAsync` | SPECIAL |
| POST | `api/recurring-tasks/instances/{id:guid}/reopen` | `ReopenAsync` | SPECIAL |
| GET | `api/recurring-tasks/instances/my-daily-tasks` | `GetForUserByDateAsync` | GET_LIST |
| POST | `api/recurring-tasks/templates` | `CreateTemplateAsync` | CREATE |
| PUT | `api/recurring-tasks/templates/{id:guid}` | `UpdateTemplateAsync` | UPDATE |
| GET | `api/recurring-tasks/templates/{id:guid}` | `GetTemplateByIdAsync` | GET_SINGLE |
| DELETE | `api/recurring-tasks/templates/{id}` | `DeleteTemplateAsync` | DELETE |
| GET | `api/recurring-tasks/templates/{templateId:guid}/items` | `GetItemsByTemplateIdAsync` | GET_SINGLE |
| POST | `api/recurring-tasks/templates/{templateId:guid}/items` | `AddItemToTemplateAsync` | CREATE |
| PUT | `api/recurring-tasks/templates/{templateId:guid}/items/reorder` | `ReorderTemplateItemsAsync` | UPDATE |
| POST | `api/recurring-tasks/templates/config` | `UpdateCustomerConfigAsync` | CREATE |
| GET | `api/recurring-tasks/templates/config/{customerId:guid}` | `GetCustomerConfigAsync` | GET_SINGLE |
| PUT | `api/recurring-tasks/templates/items/{itemId}` | `UpdateItemInTemplateAsync` | UPDATE |
| DELETE | `api/recurring-tasks/templates/items/{itemId}` | `DeleteItemAsync` | DELETE |
| GET | `api/recurring-tasks/templates/list/{state:bool}` | `GetAllTemplatesAsync` | GET_LIST |
| PUT | `api/request-dismissal/{id:guid}` | `PutRequestDismissalAsync` | UPDATE |
| DELETE | `api/request-dismissal/{id:guid}` | `DeleteAsync` | DELETE |
| POST | `api/request-dismissal/{id:guid}/attach-evaluation/{evaluationId:guid}` | `AttachEvaluationAsync` | CREATE |
| POST | `api/request-dismissal/{id:guid}/attach-incident/{incidentId:guid}` | `AttachIncidentAsync` | CREATE |
| PATCH | `api/request-dismissal/{id:guid}/authorize/{department}` | `AuthorizeDismissalAsync` | UPDATE |
| PATCH | `api/request-dismissal/{id:guid}/status` | `UpdateStatusAsync` | UPDATE |
| GET | `api/request-dismissal/export-excel` | `ExportRequestToExcelAsync` | GET_LIST |
| GET | `api/request-dismissal/get-by-id/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| GET | `api/request-dismissal/get-request-dismissal/{employeeId:guid}` | `GetRequestDismissal` | GET_SINGLE |
| GET | `api/request-dismissal/list` | `GetListAsync` | GET_LIST |
| GET | `api/request-dismissal/send-email/{workPositionId:guid}` | `OnSendEmailRequestDismissalAsync` | GET_SINGLE |
| DELETE | `api/request-dismissal-discount/{id:guid}` | `DeleteAsync` | DELETE |
| GET | `api/request-dismissal-discount/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| PUT | `api/request-dismissal-discount/{id:guid}` | `UpdateAsync` | UPDATE |
| DELETE | `api/request-employee-register/{id:guid}` | `DeleteByIdAsync` | DELETE |
| PUT | `api/request-employee-register/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/request-employee-register/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| GET | `api/request-employee-register/{id:guid}/basic-info` | `GetBasicInfoAsync` | GET_SINGLE |
| PUT | `api/request-employee-register/{id:guid}/complete-draft` | `CompleteDraftAltaAsync` | UPDATE |
| PATCH | `api/request-employee-register/{id:guid}/conclude` | `ConcludeAdministrativelyAsync` | UPDATE |
| GET | `api/request-employee-register/{id:guid}/export-merged-pdf` | `ExportMergedHiringPdfAsync` | GET_SINGLE |
| GET | `api/request-employee-register/{id:guid}/export-pdf` | `ExportHiringFormatPdfAsync` | GET_SINGLE |
| POST | `api/request-employee-register/{id:guid}/send-merged-pdf` | `SendMergedHiringPdfAsync` | SPECIAL |
| PUT | `api/request-employee-register/{id:guid}/status` | `UpdateStatusAsync` | UPDATE |
| GET | `api/request-employee-register/export-excel` | `ExportRequestToExcelAsync` | GET_LIST |
| GET | `api/request-employee-register/get-employee-register/{employeeId:guid}/{customerId:guid}` | `GetEmployeeRegisterAsync` | GET_SINGLE |
| GET | `api/request-employee-register/list` | `GetListRequestEmployeeRegisterAsync` | GET_LIST |
| POST | `api/request-employee-register/reactivate-and-migrate` | `ReactivateAndMigrateEmployeeAsync` | CREATE |
| POST | `api/request-employee-register/search-duplicates` | `SearchEmployeeDuplicatesAsync` | CREATE |
| PUT | `api/request-position/{id:guid}` | `UpdateAsync` | UPDATE |
| DELETE | `api/request-position/{id:guid}` | `DeleteByIdAsync` | DELETE |
| GET | `api/request-position/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| DELETE | `api/request-position/{id:guid}/cascade` | `DeleteCascadeAsync` | DELETE |
| GET | `api/request-position/{id:guid}/delete-impact` | `GetDeleteImpactAsync` | GET_SINGLE |
| GET | `api/request-position/export-excel` | `ExportToExcelAsync` | GET_LIST |
| GET | `api/request-position/pending` | `GetPendingAsync` | GET_LIST |
| PUT | `api/request-salary-modification/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/request-salary-modification/{workPositionId:guid}/{employeeId:guid}` | `GetStatusAsync` | GET_SINGLE |
| GET | `api/request-salary-modification/export-excel` | `ExportToExcelAsync` | GET_LIST |
| GET | `api/request-salary-modification/get-by-id/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| GET | `api/request-salary-modification/get-data/{employeeId:guid}` | `GetDataForModificacionSalarioAsync` | GET_SINGLE |
| PATCH | `api/work-position-org-chart/reassign/{customerId:guid}` | `ReassignAsync` | UPDATE |
| GET | `api/work-position-org-chart/tree/{customerId:guid}` | `GetTreeAsync` | GET_SINGLE |
| POST | `api/work-positions` | `AddAsync` | CREATE |
| GET | `api/work-positions/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| DELETE | `api/work-positions/{id:guid}` | `DeleteByIdAsync` | DELETE |
| PUT | `api/work-positions/{id:guid}` | `UpdateAsync` | UPDATE |
| PATCH | `api/work-positions/{id:guid}/activate` | `ActivateAsync` | UPDATE |
| PATCH | `api/work-positions/{id:guid}/unassign-employee` | `UnassignEmployeeAsync` | UPDATE |
| GET | `api/work-positions/all-general` | `GetAllGeneralAsync` | GET_LIST |
| GET | `api/work-positions/assign-employee/{applicationUserId}/{workPositionId:guid}` | `AssignEmployeeAsync` | GET_SINGLE |
| GET | `api/work-positions/for-edit/{id:guid}` | `GetForEditAsync` | GET_SINGLE |
| GET | `api/work-positions/hours/{id:guid}` | `GetHoursAsync` | GET_SINGLE |
| GET | `api/work-positions/list-by-customer/{customerId:guid}/{state}` | `GetAsyncAll` | GET_SINGLE |

## Modulo: RecursosHumanosLuxuryApp

Metodos: 150 | Endpoints HTTP: 126

### Servicios e interfaces

| Servicio/Interfaz | Metodos | Ubicacion |
|---|---|---|
| `IApprovalRuleService` | 2 | `RecursosHumanosLuxuryApp/TimeOff/ApprovalRules/Interfaces/IApprovalRuleService.cs` |
| `IAprobacionPermisoService` | 9 | `RecursosHumanosLuxuryApp/TimeOff/LeaveRequestApproval/Interfaces/IAprobacionPermisoService.cs` |
| `IAprobacionVacacionesService` | 12 | `RecursosHumanosLuxuryApp/TimeOff/Vacations/VacationRequestApproval/Interfaces/IAprobacionVacacionesService.cs` |
| `IChekadorEmpleadosAppService` | 8 | `RecursosHumanosLuxuryApp/ChekadorEmpleados/Interfaces/IChekadorEmpleadosAppService.cs` |
| `IConfiguracionNominaAppService` | 2 | `RecursosHumanosLuxuryApp/Nomina/Configuracion/Interfaces/IConfiguracionNominaAppService.cs` |
| `IEvidenciaNominaAppService` | 3 | `RecursosHumanosLuxuryApp/Nomina/Evidencias/Interfaces/IEvidenciaNominaAppService.cs` |
| `IHrNotificationCoordinatorService` | 6 | `RecursosHumanosLuxuryApp/Notifications/Interfaces/IHrNotificationCoordinatorService.cs` |
| `IIncidenciaNominaAppService` | 9 | `RecursosHumanosLuxuryApp/Nomina/IncidenciasNomina/Interfaces/IIncidenciaNominaAppService.cs` |
| `ILeaveRequestService` | 6 | `RecursosHumanosLuxuryApp/TimeOff/LeaveRequests/Interfaces/ILeaveRequestService.cs` |
| `IManualTemplateService` | 21 | `RecursosHumanosLuxuryApp/ManualsAndProcesses/Interfaces/IManualTemplateService.cs` |
| `ImssCalculatorService` | 1 | `RecursosHumanosLuxuryApp/Nomina/Shared/ImssCalculatorService.cs` |
| `INominaDetalleAppService` | 4 | `RecursosHumanosLuxuryApp/Nomina/NominaDetalles/Interfaces/INominaDetalleAppService.cs` |
| `INominaEncabezadoAppService` | 9 | `RecursosHumanosLuxuryApp/Nomina/NominaEncabezados/Interfaces/INominaEncabezadoAppService.cs` |
| `IPastVacationsAppService` | 1 | `RecursosHumanosLuxuryApp/TimeOff/Vacations/PastVacations/Interfaces/IPastVacationsAppService.cs` |
| `IPerformanceEvaluationAppService` | 6 | `RecursosHumanosLuxuryApp/Evaluacion/PerformanceEvaluation/Interfaces/IPerformanceEvaluationAppService.cs` |
| `IPeriodoNominaAppService` | 9 | `RecursosHumanosLuxuryApp/Nomina/PeriodosNomina/Interfaces/IPeriodoNominaAppService.cs` |
| `IPrestamoEmpleadoAppService` | 8 | `RecursosHumanosLuxuryApp/Nomina/Prestamos/Interfaces/IPrestamoEmpleadoAppService.cs` |
| `ISolicitudVacacionesService` | 9 | `RecursosHumanosLuxuryApp/TimeOff/Vacations/MyVacationRequests/Interfaces/ISolicitudVacacionesService.cs` |
| `IsrCalculatorService` | 1 | `RecursosHumanosLuxuryApp/Nomina/Shared/IsrCalculatorService.cs` |
| `ITemplateEvaluationAppService` | 5 | `RecursosHumanosLuxuryApp/Evaluacion/EvaluationTemplate/Interfaces/ITemplateEvaluationAppService.cs` |
| `ITiempoExtraAppService` | 8 | `RecursosHumanosLuxuryApp/Nomina/TiemposExtra/Interfaces/ITiempoExtraAppService.cs` |
| `IVacationBalanceAdminService` | 1 | `RecursosHumanosLuxuryApp/TimeOff/Vacations/VacationBalanceAdmin/Interfaces/IVacationBalanceAdminService.cs` |
| `NominaCalculatorService` | 1 | `RecursosHumanosLuxuryApp/Nomina/Shared/NominaCalculatorService.cs` |
| `NominaDraftRecalculationService` | 2 | `RecursosHumanosLuxuryApp/Nomina/Shared/NominaDraftRecalculationService.cs` |
| `PeriodoNominaHelperService` | 1 | `RecursosHumanosLuxuryApp/Nomina/Shared/PeriodoNominaHelperService.cs` |
| `VacationHelperService` | 6 | `RecursosHumanosLuxuryApp/TimeOff/Vacations/VacationShared/Services/VacationHelperService.cs` |

### Metodos por categoria

| Servicio | Metodo | Categoria | Retorno | Observaciones |
|---|---|---|---|---|
| IApprovalRuleService | `GetApprovableUserIdsAsync` | GET_LIST | `Task<List<string>>` | ⚠ Get sin ByXxx/All |
| IApprovalRuleService | `GetApproverRolesForRequesterAsync` | GET_LIST | `Task<List<string>>` | ⚠ Get sin ByXxx/All |
| IAprobacionPermisoService | `ApproveAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| IAprobacionPermisoService | `CancelAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| IAprobacionPermisoService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IAprobacionPermisoService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<LeaveRequestDTO[]>>` | ✓ |
| IAprobacionPermisoService | `GetDetailByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<LeaveRequestDetailDTO>>` | ✓ |
| IAprobacionPermisoService | `GetHistoryAsync` | GET_SINGLE | `Task<ApiResponseDTO<LeaveRequestDTO[]>>` | ⚠ Get sin ByXxx/All |
| IAprobacionPermisoService | `GetHistorySummaryAsync` | GET_SINGLE | `Task<ApiResponseDTO<object>>` | ⚠ Get sin ByXxx/All |
| IAprobacionPermisoService | `GetOverlappingRequestsAsync` | GET_LIST | `Task<ApiResponseDTO<object>>` | ⚠ Get sin ByXxx/All |
| IAprobacionPermisoService | `RejectAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| IAprobacionVacacionesService | `ApproveAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| IAprobacionVacacionesService | `CancelAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| IAprobacionVacacionesService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IAprobacionVacacionesService | `DeleteBalanceAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IAprobacionVacacionesService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<VacationRequestDTO[]>>` | ✓ |
| IAprobacionVacacionesService | `GetAllBalancesForEmployeeAsync` | GET_LIST | `Task<ApiResponseDTO<IEnumerable<VacationBalanceDTO>>>` | ✓ |
| IAprobacionVacacionesService | `GetAvailableYearsForEmployeeAsync` | GET_LIST | `Task<ApiResponseDTO<List<YearOptionDTO>>>` | ⚠ Get sin ByXxx/All |
| IAprobacionVacacionesService | `GetBalanceAsync` | GET_SINGLE | `Task<ApiResponseDTO<VacationBalanceDTO>>` | ⚠ Get sin ByXxx/All |
| IAprobacionVacacionesService | `GetBalanceByYearAsync` | GET_SINGLE | `Task<ApiResponseDTO<VacationBalanceDTO>>` | ✓ |
| IAprobacionVacacionesService | `GetHistoryAsync` | GET_SINGLE | `Task<ApiResponseDTO<VacationHistoryItemDTO[]>>` | ⚠ Get sin ByXxx/All |
| IAprobacionVacacionesService | `GetOverlappingRequestsAsync` | GET_LIST | `Task<ApiResponseDTO<object>>` | ⚠ Get sin ByXxx/All |
| IAprobacionVacacionesService | `RejectAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| IChekadorEmpleadosAppService | `AprobarAnomaliaAsync` | OTHER | `Task<ApiResponseDTO<RegistroChecadorDTO>>` | ⚠ naming no CRUD estandar |
| IChekadorEmpleadosAppService | `CrearSedeAsync` | OTHER | `Task<ApiResponseDTO<SedeChecadorDTO>>` | ⚠ naming no CRUD estandar |
| IChekadorEmpleadosAppService | `GetSedesAsync` | GET_LIST | `Task<ApiResponseDTO<List<SedeChecadorDTO>>>` | ⚠ Get sin ByXxx/All |
| IChekadorEmpleadosAppService | `MisRegistrosAsync` | OTHER | `Task<ApiResponseDTO<List<RegistroChecadorDTO>>>` | ⚠ naming no CRUD estandar |
| IChekadorEmpleadosAppService | `PorTenantAsync` | OTHER | `Task<ApiResponseDTO<List<RegistroChecadorDTO>>>` | ⚠ naming no CRUD estandar |
| IChekadorEmpleadosAppService | `RechazarAnomaliaAsync` | OTHER | `Task<ApiResponseDTO<RegistroChecadorDTO>>` | ⚠ naming no CRUD estandar |
| IChekadorEmpleadosAppService | `RegistrarAsync` | OTHER | `Task<ApiResponseDTO<RegistroChecadorDTO>>` | ⚠ naming no CRUD estandar |
| IChekadorEmpleadosAppService | `ResumenHoyAsync` | SPECIAL | `Task<ApiResponseDTO<ResumenAsistenciaDTO>>` | ✓ |
| IConfiguracionNominaAppService | `GetByCustomerIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<ConfiguracionNominaDTO>>` | ✓ |
| IConfiguracionNominaAppService | `UpsertAsync` | UPDATE | `Task<ApiResponseDTO<ConfiguracionNominaDTO>>` | ✓ |
| IEvidenciaNominaAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<EvidenciaNominaDTO>>` | ✓ |
| IEvidenciaNominaAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IEvidenciaNominaAppService | `GetByNominaAsync` | GET_SINGLE | `Task<ApiResponseDTO<EvidenciaNominaDTO[]>>` | ✓ |
| IHrNotificationCoordinatorService | `SendNewRequestNotificationToApproversAsync` | SPECIAL | `Task` | ✓ |
| IHrNotificationCoordinatorService | `SendRequestApprovedNotificationToEmployeeAsync` | SPECIAL | `Task` | ✓ |
| IHrNotificationCoordinatorService | `SendRequestCreatedNotificationToEmployeeAsync` | SPECIAL | `Task` | ✓ |
| IHrNotificationCoordinatorService | `SendRequestDeletedNotificationToEmployeeAsync` | SPECIAL | `Task` | ✓ |
| IHrNotificationCoordinatorService | `SendRequestRejectedNotificationToEmployeeAsync` | SPECIAL | `Task` | ✓ |
| IHrNotificationCoordinatorService | `SendRequestUpdatedNotificationToEmployeeAsync` | SPECIAL | `Task` | ✓ |
| IIncidenciaNominaAppService | `CreateAsync` | CREATE | `Task<ApiResponseDTO<IncidenciaNominaDTO>>` | ✓ |
| IIncidenciaNominaAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IIncidenciaNominaAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<IncidenciaNominaDTO[]>>` | ✓ |
| IIncidenciaNominaAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<IncidenciaNominaDTO>>` | ✓ |
| IIncidenciaNominaAppService | `GetHojaIncidenciasAsync` | GET_LIST | `Task<ApiResponseDTO<HojaIncidenciasDTO>>` | ⚠ Get sin ByXxx/All |
| IIncidenciaNominaAppService | `GuardarHojaIncidenciasAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| IIncidenciaNominaAppService | `SincronizarPermisosAsync` | OTHER | `Task<ApiResponseDTO<IncidenciaNominaDTO[]>>` | ⚠ naming no CRUD estandar |
| IIncidenciaNominaAppService | `SincronizarVacacionesAsync` | OTHER | `Task<ApiResponseDTO<IncidenciaNominaDTO[]>>` | ⚠ naming no CRUD estandar |
| IIncidenciaNominaAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<IncidenciaNominaDTO>>` | ✓ |
| ILeaveRequestService | `CreateAsync` | CREATE | `Task<ApiResponseDTO<LeaveRequestAddOrEditDTO>>` | ✓ |
| ILeaveRequestService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ILeaveRequestService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<LeaveRequestAddOrEditDTO>>` | ✓ |
| ILeaveRequestService | `GetDetailByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<LeaveRequestDetailDTO>>` | ✓ |
| ILeaveRequestService | `GetMyRequestsAsync` | GET_LIST | `Task<ApiResponseDTO<LeaveRequestMyDTO[]>>` | ⚠ Get sin ByXxx/All |
| ILeaveRequestService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<LeaveRequestDTO>>` | ✓ |
| IManualTemplateService | `ActualizarAsync` | OTHER | `Task<ApiResponseDTO<ManualTemplateSimpleDTO>>` | ⚠ naming no CRUD estandar |
| IManualTemplateService | `ActualizarDiagramaAsync` | OTHER | `Task<ApiResponseDTO<ManualDiagramSimpleDTO>>` | ⚠ naming no CRUD estandar |
| IManualTemplateService | `ActualizarPasoAsync` | OTHER | `Task<ApiResponseDTO<ManualPasoDTO>>` | ⚠ naming no CRUD estandar |
| IManualTemplateService | `AgregarAdjuntoAsync` | OTHER | `Task<ApiResponseDTO<ManualAdjuntoSimpleDTO>>` | ⚠ naming no CRUD estandar |
| IManualTemplateService | `AgregarEnlacePasoAsync` | OTHER | `Task<ApiResponseDTO<ManualPasoEnlaceDTO>>` | ⚠ naming no CRUD estandar |
| IManualTemplateService | `AgregarPasoAsync` | OTHER | `Task<ApiResponseDTO<ManualPasoDTO>>` | ⚠ naming no CRUD estandar |
| IManualTemplateService | `AgregarVersionAsync` | OTHER | `Task<ApiResponseDTO<ManualVersionSimpleDTO>>` | ⚠ naming no CRUD estandar |
| IManualTemplateService | `CrearAsync` | OTHER | `Task<ApiResponseDTO<ManualTemplateSimpleDTO>>` | ⚠ naming no CRUD estandar |
| IManualTemplateService | `CrearDiagramaAsync` | OTHER | `Task<ApiResponseDTO<ManualDiagramSimpleDTO>>` | ⚠ naming no CRUD estandar |
| IManualTemplateService | `EliminarAdjuntoAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| IManualTemplateService | `EliminarAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| IManualTemplateService | `EliminarDiagramaAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| IManualTemplateService | `EliminarEnlacePasoAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| IManualTemplateService | `EliminarImagenPasoAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| IManualTemplateService | `EliminarPasoAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| IManualTemplateService | `EliminarVersionAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| IManualTemplateService | `ObtenerAccesiblesAsync` | OTHER | `Task<ApiResponseDTO<ManualTemplateSimpleDTO[]>>` | ⚠ naming no CRUD estandar |
| IManualTemplateService | `ObtenerDiagramaAsync` | OTHER | `Task<ApiResponseDTO<ManualDiagramSimpleDTO>>` | ⚠ naming no CRUD estandar |
| IManualTemplateService | `ObtenerPorIdAsync` | OTHER | `Task<ApiResponseDTO<ManualTemplateDetalleDTO>>` | ⚠ naming no CRUD estandar |
| IManualTemplateService | `ReordenarPasosAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| IManualTemplateService | `SubirImagenPasoAsync` | OTHER | `Task<ApiResponseDTO<ManualPasoImagenDTO>>` | ⚠ naming no CRUD estandar |
| ImssCalculatorService | `Calcular` | OTHER | `decimal` | ⚠ naming no CRUD estandar |
| INominaDetalleAppService | `GenerarReciboPdfAsync` | OTHER | `Task<ApiResponseDTO<byte[]>>` | ⚠ naming no CRUD estandar |
| INominaDetalleAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<NominaDetalleDTO>>` | ✓ |
| INominaDetalleAppService | `GetByNominaAsync` | GET_SINGLE | `Task<ApiResponseDTO<NominaDetalleDTO[]>>` | ✓ |
| INominaDetalleAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<NominaDetalleDTO>>` | ✓ |
| INominaEncabezadoAppService | `AprobarAsync` | OTHER | `Task<ApiResponseDTO<NominaEncabezadoDTO>>` | ⚠ naming no CRUD estandar |
| INominaEncabezadoAppService | `CerrarAsync` | OTHER | `Task<ApiResponseDTO<NominaEncabezadoDTO>>` | ⚠ naming no CRUD estandar |
| INominaEncabezadoAppService | `EnviarRevisionAsync` | OTHER | `Task<ApiResponseDTO<NominaEncabezadoDTO>>` | ⚠ naming no CRUD estandar |
| INominaEncabezadoAppService | `ExportarExcelAsync` | SPECIAL | `Task<ApiResponseDTO<byte[]>>` | ✓ |
| INominaEncabezadoAppService | `GenerarAsync` | OTHER | `Task<ApiResponseDTO<NominaEncabezadoDTO>>` | ⚠ naming no CRUD estandar |
| INominaEncabezadoAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<NominaEncabezadoDTO[]>>` | ✓ |
| INominaEncabezadoAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<NominaEncabezadoDTO>>` | ✓ |
| INominaEncabezadoAppService | `GetResumenAsync` | GET_SINGLE | `Task<ApiResponseDTO<NominaResumenDTO>>` | ⚠ Get sin ByXxx/All |
| INominaEncabezadoAppService | `MarcarPagadaAsync` | OTHER | `Task<ApiResponseDTO<NominaEncabezadoDTO>>` | ⚠ naming no CRUD estandar |
| IPastVacationsAppService | `RegisterPastVacationAsync` | CREATE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IPerformanceEvaluationAppService | `CreateAsync` | CREATE | `Task<ApiResponseDTO<EvaluationResultDTO>>` | ✓ |
| IPerformanceEvaluationAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IPerformanceEvaluationAppService | `GetHistoryForClientAsync` | GET_SINGLE | `Task<ApiResponseDTO<EvaluationHistoryForCustomerDTO[]>>` | ⚠ Get sin ByXxx/All |
| IPerformanceEvaluationAppService | `GetHistoryForEmployeeAsync` | GET_SINGLE | `Task<ApiResponseDTO<EvaluationHistoryItemDTO[]>>` | ⚠ Get sin ByXxx/All |
| IPerformanceEvaluationAppService | `GetResultByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<EvaluationResultDTO>>` | ✓ |
| IPerformanceEvaluationAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<EvaluationResultDTO>>` | ✓ |
| IPeriodoNominaAppService | `AddDiaNoHabilAsync` | CREATE | `Task<ApiResponseDTO<DiasNoHabilesDTO>>` | ✓ |
| IPeriodoNominaAppService | `AutoCrearPeriodosAsync` | OTHER | `Task<ApiResponseDTO<int>>` | ⚠ naming no CRUD estandar |
| IPeriodoNominaAppService | `CreateAsync` | CREATE | `Task<ApiResponseDTO<PeriodoNominaDTO>>` | ✓ |
| IPeriodoNominaAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IPeriodoNominaAppService | `DeleteDiaNoHabilAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IPeriodoNominaAppService | `GetByCustomerAsync` | GET_SINGLE | `Task<ApiResponseDTO<PeriodoNominaDTO[]>>` | ✓ |
| IPeriodoNominaAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<PeriodoNominaDTO>>` | ✓ |
| IPeriodoNominaAppService | `GetDiasNoHabilesAsync` | GET_LIST | `Task<ApiResponseDTO<DiasNoHabilesDTO[]>>` | ⚠ Get sin ByXxx/All |
| IPeriodoNominaAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<PeriodoNominaDTO>>` | ✓ |
| IPrestamoEmpleadoAppService | `AutorizarAsync` | OTHER | `Task<ApiResponseDTO<PrestamoEmpleadoDTO>>` | ⚠ naming no CRUD estandar |
| IPrestamoEmpleadoAppService | `CancelarAsync` | SPECIAL | `Task<ApiResponseDTO<PrestamoEmpleadoDTO>>` | ✓ |
| IPrestamoEmpleadoAppService | `CreateAsync` | CREATE | `Task<ApiResponseDTO<PrestamoEmpleadoDTO>>` | ✓ |
| IPrestamoEmpleadoAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IPrestamoEmpleadoAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<PrestamoEmpleadoDTO[]>>` | ✓ |
| IPrestamoEmpleadoAppService | `GetByEmployeeAsync` | GET_SINGLE | `Task<ApiResponseDTO<PrestamoEmpleadoDTO[]>>` | ✓ |
| IPrestamoEmpleadoAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<PrestamoEmpleadoDTO>>` | ✓ |
| IPrestamoEmpleadoAppService | `GetHistorialPagosAsync` | GET_LIST | `Task<ApiResponseDTO<PagoPrestamoDTO[]>>` | ⚠ Get sin ByXxx/All |
| ISolicitudVacacionesService | `CreateAsync` | CREATE | `Task<ApiResponseDTO<VacationRequestDTO>>` | ✓ |
| ISolicitudVacacionesService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ISolicitudVacacionesService | `GetAvailableVacationYearsAsync` | GET_LIST | `Task<ApiResponseDTO<List<YearOptionDTO>>>` | ⚠ Get sin ByXxx/All |
| ISolicitudVacacionesService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<VacationRequestDTO>>` | ✓ |
| ISolicitudVacacionesService | `GetCalendarEventsAsync` | GET_LIST | `Task<ApiResponseDTO<IEnumerable<CalendarEventDTO>>>` | ⚠ Get sin ByXxx/All |
| ISolicitudVacacionesService | `GetDetailByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<VacationRequestDetailDTO>>` | ✓ |
| ISolicitudVacacionesService | `GetMyRequestsAsync` | GET_LIST | `Task<ApiResponseDTO<VacationRequestMyDTO[]>>` | ⚠ Get sin ByXxx/All |
| ISolicitudVacacionesService | `GetMyVacationBalanceAsync` | GET_SINGLE | `Task<ApiResponseDTO<VacationBalanceDTO>>` | ⚠ Get sin ByXxx/All |
| ISolicitudVacacionesService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<VacationRequestDTO>>` | ✓ |
| IsrCalculatorService | `Calcular` | OTHER | `decimal` | ⚠ naming no CRUD estandar |
| ITemplateEvaluationAppService | `CreateAsync` | CREATE | `Task<ApiResponseDTO<EvaluationTemplateSummaryDTO>>` | ✓ |
| ITemplateEvaluationAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ITemplateEvaluationAppService | `GetAllByCustomerIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<EvaluationTemplateSummaryDTO[]>>` | ✓ |
| ITemplateEvaluationAppService | `GetForEditByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<SaveEvaluationTemplateRequestDTO>>` | ✓ |
| ITemplateEvaluationAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<EvaluationTemplateSummaryDTO>>` | ✓ |
| ITiempoExtraAppService | `AddEvidenceAsync` | CREATE | `Task<ApiResponseDTO<EvidenciaNominaDTO>>` | ✓ |
| ITiempoExtraAppService | `AprobarAsync` | OTHER | `Task<ApiResponseDTO<TiempoExtraDTO>>` | ⚠ naming no CRUD estandar |
| ITiempoExtraAppService | `CreateAsync` | CREATE | `Task<ApiResponseDTO<TiempoExtraDTO>>` | ✓ |
| ITiempoExtraAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ITiempoExtraAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<TiempoExtraDTO[]>>` | ✓ |
| ITiempoExtraAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<TiempoExtraDTO>>` | ✓ |
| ITiempoExtraAppService | `RechazarAsync` | OTHER | `Task<ApiResponseDTO<TiempoExtraDTO>>` | ⚠ naming no CRUD estandar |
| ITiempoExtraAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<TiempoExtraDTO>>` | ✓ |
| IVacationBalanceAdminService | `GetVacationBalancesForCustomerAsync` | GET_LIST | `Task<ApiResponseDTO<IEnumerable<VacationBalanceAdminViewDTO>>>` | ⚠ Get sin ByXxx/All |
| NominaCalculatorService | `Calcular` | OTHER | `NominaCalculationResult` | ⚠ naming no CRUD estandar |
| NominaDraftRecalculationService | `RecalculateForEmployeeAsync` | SPECIAL | `Task` | ✓ |
| NominaDraftRecalculationService | `RecalculateHeaderAsync` | SPECIAL | `Task` | ✓ |
| PeriodoNominaHelperService | `CalcularDiasHabiles` | OTHER | `int` | ⚠ naming no CRUD estandar |
| VacationHelperService | `DecrementUsedVacationDays` | OTHER | `Task` | ⚠ naming no CRUD estandar |
| VacationHelperService | `GetBalanceRealTimeAsync` | GET_SINGLE | `Task<VacationBalanceDTO>` | ⚠ Get sin ByXxx/All |
| VacationHelperService | `GetOrCreateVacationBalance` | GET_SINGLE | `Task<VacationBalance>` | ⚠ Get sin ByXxx/All |
| VacationHelperService | `ProcessVacationRequestApproval` | SPECIAL | `Task` | ✓ |
| VacationHelperService | `ProcessVacationRequestDeletion` | SPECIAL | `Task` | ✓ |
| VacationHelperService | `RegisterPastVacationAsync` | CREATE | `Task<ApiResponseDTO<bool>>` | ✓ |

### Endpoints

| Verbo | Ruta | Handler | Categoria |
|---|---|---|---|
| PATCH | `api/chekador-empleados/{id:guid}/aprobar-anomalia` | `AprobarAnomaliaAsync` | UPDATE |
| PATCH | `api/chekador-empleados/{id:guid}/rechazar-anomalia` | `RechazarAnomaliaAsync` | UPDATE |
| GET | `api/chekador-empleados/mis-registros` | `MisRegistrosAsync` | GET_LIST |
| GET | `api/chekador-empleados/por-tenant` | `PorTenantAsync` | GET_LIST |
| POST | `api/chekador-empleados/registrar` | `RegistrarAsync` | CREATE |
| GET | `api/chekador-empleados/resumen-hoy` | `ResumenHoyAsync` | GET_LIST |
| POST | `api/chekador-empleados/sedes` | `CrearSedeAsync` | CREATE |
| GET | `api/chekador-empleados/sedes` | `GetSedesAsync` | GET_LIST |
| GET | `api/hr/nomina` | `GetAllAsync` | GET_LIST |
| GET | `api/hr/nomina/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| PUT | `api/hr/nomina/{id:guid}/aprobar` | `AprobarAsync` | UPDATE |
| PUT | `api/hr/nomina/{id:guid}/cerrar` | `CerrarAsync` | UPDATE |
| PUT | `api/hr/nomina/{id:guid}/enviar-revision` | `EnviarRevisionAsync` | UPDATE |
| GET | `api/hr/nomina/{id:guid}/exportar-excel` | `ExportarExcelAsync` | GET_SINGLE |
| PUT | `api/hr/nomina/{id:guid}/marcar-pagada` | `MarcarPagadaAsync` | UPDATE |
| GET | `api/hr/nomina/{id:guid}/resumen-ejecutivo` | `GetResumenAsync` | GET_SINGLE |
| GET | `api/hr/nomina/{nominaId:guid}/detalles` | `GetByNominaAsync` | GET_SINGLE |
| PUT | `api/hr/nomina/{nominaId:guid}/detalles/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/hr/nomina/{nominaId:guid}/detalles/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| GET | `api/hr/nomina/{nominaId:guid}/detalles/{id:guid}/recibo` | `GenerarReciboPdfAsync` | GET_SINGLE |
| GET | `api/hr/nomina/{nominaId:guid}/evidencias` | `GetByNominaAsync` | GET_SINGLE |
| POST | `api/hr/nomina/{nominaId:guid}/evidencias` | `AddAsync` | CREATE |
| GET | `api/hr/nomina/configuracion/{customerId:guid}` | `GetByCustomerIdAsync` | GET_SINGLE |
| PUT | `api/hr/nomina/configuracion/{customerId:guid}` | `UpsertAsync` | UPDATE |
| DELETE | `api/hr/nomina/evidencias/{id:guid}` | `DeleteAsync` | DELETE |
| POST | `api/hr/nomina/generar` | `GenerarAsync` | CREATE |
| POST | `api/hr/nomina/incidencias` | `CreateAsync` | CREATE |
| GET | `api/hr/nomina/incidencias` | `GetAllAsync` | GET_LIST |
| PUT | `api/hr/nomina/incidencias/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/hr/nomina/incidencias/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| DELETE | `api/hr/nomina/incidencias/{id:guid}` | `DeleteAsync` | DELETE |
| PUT | `api/hr/nomina/incidencias/hoja` | `GuardarHojaIncidenciasAsync` | UPDATE |
| GET | `api/hr/nomina/incidencias/hoja/{periodoNominaId:guid}` | `GetHojaIncidenciasAsync` | GET_SINGLE |
| POST | `api/hr/nomina/incidencias/sincronizar-permisos` | `SincronizarPermisosAsync` | CREATE |
| POST | `api/hr/nomina/incidencias/sincronizar-vacaciones` | `SincronizarVacacionesAsync` | CREATE |
| GET | `api/hr/nomina/periodos` | `GetByCustomerAsync` | GET_LIST |
| POST | `api/hr/nomina/periodos` | `CreateAsync` | CREATE |
| DELETE | `api/hr/nomina/periodos/{id:guid}` | `DeleteAsync` | DELETE |
| PUT | `api/hr/nomina/periodos/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/hr/nomina/periodos/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| GET | `api/hr/nomina/periodos/{periodoNominaId:guid}/dias-no-habiles` | `GetDiasNoHabilesAsync` | GET_SINGLE |
| POST | `api/hr/nomina/periodos/{periodoNominaId:guid}/dias-no-habiles` | `AddDiaNoHabilAsync` | CREATE |
| DELETE | `api/hr/nomina/periodos/{periodoNominaId:guid}/dias-no-habiles/{diaNoHabilId:guid}` | `DeleteDiaNoHabilAsync` | DELETE |
| POST | `api/hr/nomina/periodos/auto-crear` | `AutoCrearPeriodosAsync` | CREATE |
| POST | `api/hr/nomina/prestamos` | `CreateAsync` | CREATE |
| GET | `api/hr/nomina/prestamos` | `GetAllAsync` | GET_LIST |
| DELETE | `api/hr/nomina/prestamos/{id:guid}` | `DeleteAsync` | DELETE |
| GET | `api/hr/nomina/prestamos/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| PUT | `api/hr/nomina/prestamos/{id:guid}/autorizar` | `AutorizarAsync` | UPDATE |
| PUT | `api/hr/nomina/prestamos/{id:guid}/cancelar` | `CancelarAsync` | UPDATE |
| GET | `api/hr/nomina/prestamos/{id:guid}/historial-pagos` | `GetHistorialPagosAsync` | GET_SINGLE |
| GET | `api/hr/nomina/prestamos/por-empleado/{employeeId:guid}` | `GetByEmployeeAsync` | GET_SINGLE |
| GET | `api/hr/nomina/tiempo-extra` | `GetAllAsync` | GET_LIST |
| POST | `api/hr/nomina/tiempo-extra` | `CreateAsync` | CREATE |
| DELETE | `api/hr/nomina/tiempo-extra/{id:guid}` | `DeleteAsync` | DELETE |
| GET | `api/hr/nomina/tiempo-extra/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| PUT | `api/hr/nomina/tiempo-extra/{id:guid}` | `UpdateAsync` | UPDATE |
| PUT | `api/hr/nomina/tiempo-extra/{id:guid}/aprobar` | `AprobarAsync` | UPDATE |
| POST | `api/hr/nomina/tiempo-extra/{id:guid}/evidencias` | `AddEvidenceAsync` | CREATE |
| PUT | `api/hr/nomina/tiempo-extra/{id:guid}/rechazar` | `RechazarAsync` | UPDATE |
| GET | `api/hr/vacations/approvals` | `GetAllAsync` | GET_LIST |
| GET | `api/hr/vacations/approvals/{employeeId:guid}/available-years` | `GetAvailableYearsForEmployeeAsync` | GET_SINGLE |
| GET | `api/hr/vacations/approvals/{employeeId:guid}/balance` | `GetBalanceAsync` | GET_SINGLE |
| GET | `api/hr/vacations/approvals/{employeeId:guid}/balance-by-year` | `GetBalanceByYearAsync` | GET_SINGLE |
| PUT | `api/hr/vacations/approvals/{id:guid}/approve` | `ApproveAsync` | UPDATE |
| PUT | `api/hr/vacations/approvals/{id:guid}/cancel` | `CancelAsync` | UPDATE |
| PUT | `api/hr/vacations/approvals/{id:guid}/reject` | `RejectAsync` | UPDATE |
| GET | `api/hr/vacations/approvals/calendar-events/{year:int}/{customerId:guid}` | `GetCalendarEventsAsync` | GET_SINGLE |
| GET | `api/hr/vacations/approvals/history` | `GetHistoryAsync` | GET_LIST |
| GET | `api/hr/vacations/approvals/overlapping-requests` | `GetOverlappingRequestsAsync` | GET_LIST |
| GET | `api/hr/vacations/balances/customer/{customerId:guid}` | `GetVacationBalancesForCustomerAsync` | GET_SINGLE |
| GET | `api/hr/vacations/my-requests` | `GetMyRequestsAsync` | GET_LIST |
| POST | `api/hr/vacations/my-requests` | `CreateAsync` | CREATE |
| DELETE | `api/hr/vacations/my-requests/{id:guid}` | `DeleteAsync` | DELETE |
| GET | `api/hr/vacations/my-requests/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| PUT | `api/hr/vacations/my-requests/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/hr/vacations/my-requests/{id:guid}/detail` | `GetDetailByIdAsync` | GET_SINGLE |
| GET | `api/hr/vacations/my-requests/available-years` | `GetAvailableVacationYearsAsync` | GET_LIST |
| GET | `api/hr/vacations/my-requests/my-balance` | `GetMyVacationBalanceAsync` | GET_LIST |
| POST | `api/hr/vacations/past-requests` | `RegisterPastVacationAsync` | CREATE |
| GET | `api/leave-request-approvals` | `GetAllAsync` | GET_LIST |
| GET | `api/leave-request-approvals/{employeeId:guid}/history-summary` | `GetHistorySummaryAsync` | GET_SINGLE |
| PUT | `api/leave-request-approvals/{id:guid}/approve` | `ApproveAsync` | UPDATE |
| PUT | `api/leave-request-approvals/{id:guid}/cancel` | `CancelAsync` | UPDATE |
| GET | `api/leave-request-approvals/{id:guid}/detail` | `GetDetailByIdAsync` | GET_SINGLE |
| PUT | `api/leave-request-approvals/{id:guid}/reject` | `RejectAsync` | UPDATE |
| GET | `api/leave-request-approvals/history` | `GetHistoryAsync` | GET_LIST |
| GET | `api/leave-request-approvals/overlapping-requests` | `GetOverlappingRequestsAsync` | GET_LIST |
| POST | `api/manuals` | `CrearAsync` | CREATE |
| GET | `api/manuals` | `ObtenerAccesiblesAsync` | GET_LIST |
| GET | `api/manuals/{id:guid}` | `ObtenerPorIdAsync` | GET_SINGLE |
| DELETE | `api/manuals/{id:guid}` | `EliminarAsync` | DELETE |
| PUT | `api/manuals/{id:guid}` | `ActualizarAsync` | UPDATE |
| POST | `api/manuals/{manualId:guid}/adjuntos` | `AgregarAdjuntoAsync` | CREATE |
| DELETE | `api/manuals/{manualId:guid}/adjuntos/{adjuntoId:guid}` | `EliminarAdjuntoAsync` | DELETE |
| POST | `api/manuals/{manualId:guid}/pasos` | `AgregarPasoAsync` | CREATE |
| DELETE | `api/manuals/{manualId:guid}/pasos/{pasoId:guid}` | `EliminarPasoAsync` | DELETE |
| PUT | `api/manuals/{manualId:guid}/pasos/{pasoId:guid}` | `ActualizarPasoAsync` | UPDATE |
| POST | `api/manuals/{manualId:guid}/pasos/{pasoId:guid}/diagrama` | `CrearDiagramaAsync` | CREATE |
| DELETE | `api/manuals/{manualId:guid}/pasos/{pasoId:guid}/diagrama` | `EliminarDiagramaAsync` | DELETE |
| POST | `api/manuals/{manualId:guid}/pasos/{pasoId:guid}/enlaces` | `AgregarEnlacePasoAsync` | CREATE |
| DELETE | `api/manuals/{manualId:guid}/pasos/{pasoId:guid}/enlaces/{enlaceId:guid}` | `EliminarEnlacePasoAsync` | DELETE |
| POST | `api/manuals/{manualId:guid}/pasos/{pasoId:guid}/imagenes` | `SubirImagenPasoAsync` | CREATE |
| DELETE | `api/manuals/{manualId:guid}/pasos/{pasoId:guid}/imagenes/{imagenId:guid}` | `EliminarImagenPasoAsync` | DELETE |
| PATCH | `api/manuals/{manualId:guid}/pasos/reordenar` | `ReordenarPasosAsync` | UPDATE |
| POST | `api/manuals/{manualId:guid}/versiones` | `AgregarVersionAsync` | CREATE |
| DELETE | `api/manuals/{manualId:guid}/versiones/{versionId:guid}` | `EliminarVersionAsync` | DELETE |
| PUT | `api/manuals/diagrama/{diagramaId:guid}` | `ActualizarDiagramaAsync` | UPDATE |
| GET | `api/manuals/diagrama/{diagramaId:guid}` | `ObtenerDiagramaAsync` | GET_SINGLE |
| POST | `api/my-leave-requests` | `CreateAsync` | CREATE |
| GET | `api/my-leave-requests` | `GetMyRequestsAsync` | GET_LIST |
| GET | `api/my-leave-requests/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| PUT | `api/my-leave-requests/{id:guid}` | `UpdateAsync` | UPDATE |
| DELETE | `api/my-leave-requests/{id:guid}` | `DeleteAsync` | DELETE |
| GET | `api/my-leave-requests/{id:guid}/detail` | `GetDetailByIdAsync` | GET_SINGLE |
| DELETE | `api/performance-evaluations/{id:guid}` | `DeleteByIdAsync` | DELETE |
| GET | `api/performance-evaluations/{id:guid}/result` | `GetResultByIdAsync` | GET_SINGLE |
| POST | `api/performance-evaluations/create` | `CreateAsync` | CREATE |
| GET | `api/performance-evaluations/customer/{customerId:guid}/history` | `GetHistoryForClientAsync` | GET_SINGLE |
| GET | `api/performance-evaluations/employee/{employeeId:guid}/history` | `GetHistoryForEmployeeAsync` | GET_SINGLE |
| PUT | `api/performance-evaluations/update/{id:guid}` | `UpdateAsync` | UPDATE |
| POST | `api/template-evaluation` | `CreateAsync` | CREATE |
| DELETE | `api/template-evaluation/{id:guid}` | `DeleteByIdAsync` | DELETE |
| GET | `api/template-evaluation/{id:guid}` | `GetForEditByIdAsync` | GET_SINGLE |
| PUT | `api/template-evaluation/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/template-evaluation/list/{customerId:guid}` | `GetAllByCustomerIdAsync` | GET_SINGLE |

## Modulo: SharedLuxuryApp

Metodos: 123 | Endpoints HTTP: 67

### Servicios e interfaces

| Servicio/Interfaz | Metodos | Ubicacion |
|---|---|---|
| `IAddressAppService` | 1 | `SharedLuxuryApp/CatalogosGenerales/GeneralCatalogs/Interfaces/IAddressAppService.cs` |
| `IBankAppService` | 6 | `SharedLuxuryApp/CatalogosGenerales/Banks/Interfaces/IBankAppService.cs` |
| `ICatalogAssetAppService` | 5 | `SharedLuxuryApp/CatalogosGenerales/GeneralCatalogs/Interfaces/ICatalogAssetAppService.cs` |
| `ICategoryAppService` | 5 | `SharedLuxuryApp/CatalogosGenerales/GeneralCatalogs/Interfaces/ICategoryAppService.cs` |
| `IDocumentCatalogAppService` | 7 | `SharedLuxuryApp/CatalogosGenerales/DocumentCatalog/Interfaces/IDocumentCatalogAppService.cs` |
| `IEmailDataAppService` | 4 | `SharedLuxuryApp/CatalogosGenerales/EmailData/Interfaces/IEmailDataAppService.cs` |
| `IGenerateFolioService` | 11 | `SharedLuxuryApp/Folios/Interfaces/IGenerateFolioService.cs` |
| `IMeasurementUnitAppService` | 5 | `SharedLuxuryApp/CatalogosGenerales/MeasurementUnit/Interfaces/IMeasurementUnitAppService.cs` |
| `IMetodoDePagoAppService` | 5 | `SharedLuxuryApp/CatalogosGenerales/MetodoPago/Interfaces/IMetodoDePagoAppService.cs` |
| `IPaymentMethodAppService` | 5 | `SharedLuxuryApp/CatalogosGenerales/PaymentMethod/Interfaces/IPaymentMethodAppService.cs` |
| `IResponsablesClienteAppService` | 46 | `SharedLuxuryApp/ResponsablesCliente/Interfaces/IResponsablesClienteAppService.cs` |
| `ITelefonosEmergenciaAppService` | 5 | `SharedLuxuryApp/CatalogosGenerales/TelefonosEmergencia/Interfaces/ITelefonosEmergenciaAppService.cs` |
| `IToolAppService` | 5 | `SharedLuxuryApp/CatalogosGenerales/GeneralCatalogs/Interfaces/IToolAppService.cs` |
| `IUsoCFDIAppService` | 5 | `SharedLuxuryApp/CatalogosGenerales/UsoCfdi/Interfaces/IUsoCFDIAppService.cs` |
| `IWorkPositionScheduleAppService` | 8 | `SharedLuxuryApp/CatalogosGenerales/WorkPositionSchedules/Interfaces/IWorkPositionScheduleAppService.cs` |

### Metodos por categoria

| Servicio | Metodo | Categoria | Retorno | Observaciones |
|---|---|---|---|---|
| IAddressAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<AddressAddOrEditDTO>>` | ✓ |
| IBankAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<BankDTO>>` | ✓ |
| IBankAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IBankAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<BankDTO[]>>` | ✓ |
| IBankAppService | `GetAllPagedAsync` | GET_LIST | `Task<ApiResponseDTO<BankDTO[]>>` | ✓ |
| IBankAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<BankAddOrEditDTO>>` | ✓ |
| IBankAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<BankDTO>>` | ✓ |
| ICatalogAssetAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<object>>` | ✓ |
| ICatalogAssetAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ICatalogAssetAppService | `FirstOrDefaultAsync` | OTHER | `Task<ApiResponseDTO<object>>` | ⚠ naming no CRUD estandar |
| ICatalogAssetAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<object>>` | ✓ |
| ICatalogAssetAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<object>>` | ✓ |
| ICategoryAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<CategoryDTO>>` | ✓ |
| ICategoryAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ICategoryAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<CategoryDTO[]>>` | ✓ |
| ICategoryAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<CategoryDTO>>` | ✓ |
| ICategoryAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<CategoryDTO>>` | ✓ |
| IDocumentCatalogAppService | `CreateAsync` | CREATE | `Task<ApiResponseDTO<DocumentCatalogDetailDTO>>` | ✓ |
| IDocumentCatalogAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IDocumentCatalogAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<DocumentCatalogDetailDTO>>` | ✓ |
| IDocumentCatalogAppService | `GetListAsync` | GET_LIST | `Task<ApiResponseDTO<List<DocumentCatalogListItemDTO>>>` | ✓ |
| IDocumentCatalogAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<DocumentCatalogDetailDTO>>` | ✓ |
| IDocumentCatalogAppService | `UpdateOrderAsync` | UPDATE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IDocumentCatalogAppService | `UpdateStatusAsync` | UPDATE | `Task<ApiResponseDTO<DocumentCatalogDetailDTO>>` | ✓ |
| IEmailDataAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<EmailDataDTO>>` | ✓ |
| IEmailDataAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<EmailDataDTO>>` | ✓ |
| IEmailDataAppService | `ListAsync` | OTHER | `Task<ApiResponseDTO<List<EmailDataDTO>>>` | ⚠ naming no CRUD estandar |
| IEmailDataAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<EmailDataDTO>>` | ✓ |
| IGenerateFolioService | `OnGenerateDocumentBuilding` | OTHER | `Task<string>` | ⚠ naming no CRUD estandar |
| IGenerateFolioService | `OnGenerateDocumentLegalRecord` | OTHER | `Task<string>` | ⚠ naming no CRUD estandar |
| IGenerateFolioService | `OnGenerateFolioLegal` | OTHER | `string` | ⚠ naming no CRUD estandar |
| IGenerateFolioService | `OnGenerateFolioOC` | OTHER | `string` | ⚠ naming no CRUD estandar |
| IGenerateFolioService | `OnGenerateFolioProfession` | OTHER | `string` | ⚠ naming no CRUD estandar |
| IGenerateFolioService | `OnGenerateFolioPurchaseOrder` | OTHER | `string` | ⚠ naming no CRUD estandar |
| IGenerateFolioService | `OnGenerateFolioPurchaseRequest` | OTHER | `string` | ⚠ naming no CRUD estandar |
| IGenerateFolioService | `OnGenerateFolioSC` | OTHER | `string` | ⚠ naming no CRUD estandar |
| IGenerateFolioService | `OnGenerateFolioTicketMessage` | OTHER | `Task<string>` | ⚠ naming no CRUD estandar |
| IGenerateFolioService | `OnGenerateFormat` | OTHER | `Task<string>` | ⚠ naming no CRUD estandar |
| IGenerateFolioService | `OnGenerateManualsAndProcesses` | OTHER | `Task<string>` | ⚠ naming no CRUD estandar |
| IMeasurementUnitAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<MeasurementUnitsAddOrEditDTO>>` | ✓ |
| IMeasurementUnitAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IMeasurementUnitAppService | `GetAsyncAll` | GET_SINGLE | `Task<ApiResponseDTO<MeasurementUnitsDTO[]>>` | ✓ |
| IMeasurementUnitAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<MeasurementUnitsDTO>>` | ✓ |
| IMeasurementUnitAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<MeasurementUnitsAddOrEditDTO>>` | ✓ |
| IMetodoDePagoAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<MetodoDePago>>` | ✓ |
| IMetodoDePagoAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IMetodoDePagoAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<List<MetodoPagoDTO>>>` | ✓ |
| IMetodoDePagoAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<MetodoPagoDTO>>` | ✓ |
| IMetodoDePagoAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<MetodoDePago>>` | ✓ |
| IPaymentMethodAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<PaymentMethodDTO>>` | ✓ |
| IPaymentMethodAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IPaymentMethodAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<PaymentMethodDTO[]>>` | ✓ |
| IPaymentMethodAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<PaymentMethodDTO>>` | ✓ |
| IPaymentMethodAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<PaymentMethodDTO>>` | ✓ |
| IResponsablesClienteAppService | `DataSmtpEmailAdminDTOAsync` | OTHER | `Task<DataSmtpEmailDTO>` | ⚠ naming no CRUD estandar |
| IResponsablesClienteAppService | `DataSmtpEmailSupervisorOpDTOAsync` | OTHER | `Task<DataSmtpEmailDTO>` | ⚠ naming no CRUD estandar |
| IResponsablesClienteAppService | `GetByRoleAsync` | GET_LIST | `Task<ApiResponseDTO<List<ApplicationUserGetInfoDTO>>>` | ✓ |
| IResponsablesClienteAppService | `GetSuggestedCalendarInviteesAsync` | GET_LIST | `Task<ApiResponseDTO<List<ApplicationUserGetInfoDTO>>>` | ⚠ Get sin ByXxx/All |
| IResponsablesClienteAppService | `OnGetAdministradorAsync` | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | ⚠ naming no CRUD estandar |
| IResponsablesClienteAppService | `OnGetAlmacenistaAsync` | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | ⚠ naming no CRUD estandar |
| IResponsablesClienteAppService | `OnGetAsistenteAsync` | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | ⚠ naming no CRUD estandar |
| IResponsablesClienteAppService | `OnGetBellBoyAsync` | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | ⚠ naming no CRUD estandar |
| IResponsablesClienteAppService | `OnGetChoferAsync` | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | ⚠ naming no CRUD estandar |
| IResponsablesClienteAppService | `OnGetCobranzaAsync` | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | ⚠ naming no CRUD estandar |
| IResponsablesClienteAppService | `OnGetComiteAsync` | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | ⚠ naming no CRUD estandar |
| IResponsablesClienteAppService | `OnGetComiteVigilanciaAsync` | OTHER | `Task<List<string>>` | ⚠ naming no CRUD estandar |
| IResponsablesClienteAppService | `OnGetConciergeAsync` | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | ⚠ naming no CRUD estandar |
| IResponsablesClienteAppService | `OnGetCondominoAsync` | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | ⚠ naming no CRUD estandar |
| IResponsablesClienteAppService | `OnGetContadorAsync` | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | ⚠ naming no CRUD estandar |
| IResponsablesClienteAppService | `OnGetCoordinacionJuridicoAsync` | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | ⚠ naming no CRUD estandar |
| IResponsablesClienteAppService | `OnGetDireccionGeneralAsync` | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | ⚠ naming no CRUD estandar |
| IResponsablesClienteAppService | `OnGetEntrenadorGimnasioAsync` | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | ⚠ naming no CRUD estandar |
| IResponsablesClienteAppService | `OnGetGerenteAtencionAsync` | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | ⚠ naming no CRUD estandar |
| IResponsablesClienteAppService | `OnGetGerenteMantenimientoAsync` | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | ⚠ naming no CRUD estandar |
| IResponsablesClienteAppService | `OnGetGerenteOperacionesAsync` | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | ⚠ naming no CRUD estandar |
| IResponsablesClienteAppService | `OnGetJardineriaAsync` | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | ⚠ naming no CRUD estandar |
| IResponsablesClienteAppService | `OnGetJardineriaInternaAsync` | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | ⚠ naming no CRUD estandar |
| IResponsablesClienteAppService | `OnGetJefeMantenimientoAsync` | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | ⚠ naming no CRUD estandar |
| IResponsablesClienteAppService | `OnGetJefeSeguridadInternaAsync` | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | ⚠ naming no CRUD estandar |
| IResponsablesClienteAppService | `OnGetLegalAsync` | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | ⚠ naming no CRUD estandar |
| IResponsablesClienteAppService | `OnGetLimpiezaAsync` | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | ⚠ naming no CRUD estandar |
| IResponsablesClienteAppService | `OnGetLudotecariaAsync` | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | ⚠ naming no CRUD estandar |
| IResponsablesClienteAppService | `OnGetMasterConciergeAsync` | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | ⚠ naming no CRUD estandar |
| IResponsablesClienteAppService | `OnGetMensajeriaAsync` | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | ⚠ naming no CRUD estandar |
| IResponsablesClienteAppService | `OnGetMonitoristaAsync` | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | ⚠ naming no CRUD estandar |
| IResponsablesClienteAppService | `OnGetPaqueteriaAsync` | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | ⚠ naming no CRUD estandar |
| IResponsablesClienteAppService | `OnGetPhonmeNumberCustomer` | OTHER | `Task<string>` | ⚠ naming no CRUD estandar |
| IResponsablesClienteAppService | `OnGetProveedorAsync` | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | ⚠ naming no CRUD estandar |
| IResponsablesClienteAppService | `OnGetRecepcionistaAsync` | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | ⚠ naming no CRUD estandar |
| IResponsablesClienteAppService | `OnGetReclutamientoAsync` | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | ⚠ naming no CRUD estandar |
| IResponsablesClienteAppService | `OnGetRecursosHumanosAsync` | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | ⚠ naming no CRUD estandar |
| IResponsablesClienteAppService | `OnGetSeguridadAsync` | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | ⚠ naming no CRUD estandar |
| IResponsablesClienteAppService | `OnGetSeguridadInternaAsync` | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | ⚠ naming no CRUD estandar |
| IResponsablesClienteAppService | `OnGetSistemasAsync` | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | ⚠ naming no CRUD estandar |
| IResponsablesClienteAppService | `OnGetSistemasGeneralAsync` | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | ⚠ naming no CRUD estandar |
| IResponsablesClienteAppService | `OnGetSnackBarAsync` | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | ⚠ naming no CRUD estandar |
| IResponsablesClienteAppService | `OnGetSuperUsuarioAsync` | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | ⚠ naming no CRUD estandar |
| IResponsablesClienteAppService | `OnGetSupervisionOperativaAsync` | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | ⚠ naming no CRUD estandar |
| IResponsablesClienteAppService | `OnGetSupervisorObraAsync` | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | ⚠ naming no CRUD estandar |
| IResponsablesClienteAppService | `OnGetTecnicoMantenimientoAsync` | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | ⚠ naming no CRUD estandar |
| ITelefonosEmergenciaAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<SystemLuxuryApp.ConfiguracionSistema.Catalogs.Entities.TelefonosEmergencia>>` | ✓ |
| ITelefonosEmergenciaAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<SystemLuxuryApp.ConfiguracionSistema.Catalogs.Entities.TelefonosEmergencia>>` | ✓ |
| ITelefonosEmergenciaAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<List<TelefonosEmergenciaDTO>>>` | ✓ |
| ITelefonosEmergenciaAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<TelefonosEmergenciaDTO>>` | ✓ |
| ITelefonosEmergenciaAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<SystemLuxuryApp.ConfiguracionSistema.Catalogs.Entities.TelefonosEmergencia>>` | ✓ |
| IToolAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<Tool>>` | ✓ |
| IToolAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<Tool>>` | ✓ |
| IToolAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<List<object>>>` | ✓ |
| IToolAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<ToolDTO>>` | ✓ |
| IToolAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<Tool>>` | ✓ |
| IUsoCFDIAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<UsoCFDI>>` | ✓ |
| IUsoCFDIAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IUsoCFDIAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<UseCfdiDTO[]>>` | ✓ |
| IUsoCFDIAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<UseCfdiDTO>>` | ✓ |
| IUsoCFDIAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<UsoCFDI>>` | ✓ |
| IWorkPositionScheduleAppService | `CreateAsync` | CREATE | `Task<ApiResponseDTO<WorkPositionScheduleDetailDTO>>` | ✓ |
| IWorkPositionScheduleAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IWorkPositionScheduleAppService | `DeleteWithReplacementAsync` | DELETE | `Task<ApiResponseDTO<WorkPositionScheduleDeleteWithReplacementResultDTO>>` | ✓ |
| IWorkPositionScheduleAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<WorkPositionScheduleDetailDTO>>` | ✓ |
| IWorkPositionScheduleAppService | `GetListAsync` | GET_LIST | `Task<ApiResponseDTO<List<WorkPositionScheduleListItemDTO>>>` | ✓ |
| IWorkPositionScheduleAppService | `GetUsageCountAsync` | GET_SINGLE | `Task<ApiResponseDTO<WorkPositionScheduleUsageCountDTO>>` | ⚠ Get sin ByXxx/All |
| IWorkPositionScheduleAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<WorkPositionScheduleDetailDTO>>` | ✓ |
| IWorkPositionScheduleAppService | `UpdateStatusAsync` | UPDATE | `Task<ApiResponseDTO<WorkPositionScheduleDetailDTO>>` | ✓ |

### Endpoints

| Verbo | Ruta | Handler | Categoria |
|---|---|---|---|
| PUT | `api/address/{addressId:guid}` | `UpdateAsync` | UPDATE |
| POST | `api/admin/catalogs/banks` | `AddAsync` | CREATE |
| GET | `api/admin/catalogs/banks` | `GetAllAsync` | GET_LIST |
| DELETE | `api/admin/catalogs/banks/{id:guid}` | `DeleteByIdAsync` | DELETE |
| PUT | `api/admin/catalogs/banks/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/admin/catalogs/banks/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| POST | `api/admin/catalogs/banks/paged` | `GetAllPagedAsync` | CREATE |
| POST | `api/admin/catalogs/email-data` | `AddAsync` | CREATE |
| PUT | `api/admin/catalogs/email-data/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/admin/catalogs/email-data/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| GET | `api/admin/catalogs/email-data/list` | `ListAsync` | GET_LIST |
| GET | `api/admin/general-catalogs/document-catalog` | `GetListAsync` | GET_LIST |
| POST | `api/admin/general-catalogs/document-catalog` | `CreateAsync` | CREATE |
| PUT | `api/admin/general-catalogs/document-catalog/{id:guid}` | `UpdateAsync` | UPDATE |
| DELETE | `api/admin/general-catalogs/document-catalog/{id:guid}` | `DeleteAsync` | DELETE |
| GET | `api/admin/general-catalogs/document-catalog/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| PATCH | `api/admin/general-catalogs/document-catalog/{id:guid}/status` | `UpdateStatusAsync` | UPDATE |
| PUT | `api/admin/general-catalogs/document-catalog/order` | `UpdateOrderAsync` | UPDATE |
| POST | `api/admin/general-catalogs/work-position-schedule` | `CreateAsync` | CREATE |
| GET | `api/admin/general-catalogs/work-position-schedule` | `GetListAsync` | GET_LIST |
| GET | `api/admin/general-catalogs/work-position-schedule/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| DELETE | `api/admin/general-catalogs/work-position-schedule/{id:guid}` | `DeleteAsync` | DELETE |
| PUT | `api/admin/general-catalogs/work-position-schedule/{id:guid}` | `UpdateAsync` | UPDATE |
| POST | `api/admin/general-catalogs/work-position-schedule/{id:guid}/replace-usage` | `DeleteWithReplacementAsync` | CREATE |
| PATCH | `api/admin/general-catalogs/work-position-schedule/{id:guid}/status` | `UpdateStatusAsync` | UPDATE |
| GET | `api/admin/general-catalogs/work-position-schedule/{id:guid}/usage` | `GetUsageCountAsync` | GET_SINGLE |
| POST | `api/catalog-asset` | `AddAsync` | CREATE |
| GET | `api/catalog-asset` | `GetAllAsync` | GET_LIST |
| PUT | `api/catalog-asset/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/catalog-asset/{id:guid}` | `FirstOrDefaultAsync` | GET_SINGLE |
| DELETE | `api/catalog-asset/{id:guid}` | `DeleteByIdAsync` | DELETE |
| GET | `api/categories` | `GetAllAsync` | GET_LIST |
| POST | `api/categories` | `AddAsync` | CREATE |
| DELETE | `api/categories/{id:guid}` | `DeleteByIdAsync` | DELETE |
| GET | `api/categories/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| PUT | `api/categories/{id:guid}` | `UpdateAsync` | UPDATE |
| POST | `api/cfdi-use` | `AddAsync` | CREATE |
| GET | `api/cfdi-use` | `GetAllAsync` | GET_LIST |
| GET | `api/cfdi-use/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| DELETE | `api/cfdi-use/{id:guid}` | `DeleteByIdAsync` | DELETE |
| PUT | `api/cfdi-use/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/configuracion/dias-festivos/{year:int}` | `GetMexicanHolidaysAsync` | GET_LIST |
| GET | `api/files/comite-home-images` | (inline) | GET_LIST |
| GET | `api/files/download` | (inline) | GET_LIST |
| GET | `api/files/sidebar-images` | (inline) | GET_LIST |
| POST | `api/metodo-pago` | `AddAsync` | CREATE |
| GET | `api/metodo-pago` | `GetAllAsync` | GET_LIST |
| DELETE | `api/metodo-pago/{id:guid}` | `DeleteByIdAsync` | DELETE |
| PUT | `api/metodo-pago/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/metodo-pago/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| GET | `api/payment-methods` | `GetAllAsync` | GET_LIST |
| POST | `api/payment-methods` | `AddAsync` | SPECIAL |
| GET | `api/payment-methods/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| DELETE | `api/payment-methods/{id:guid}` | `DeleteByIdAsync` | DELETE |
| PUT | `api/payment-methods/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/responsables-cliente/por-rol` | `GetByRoleAsync` | GET_LIST |
| GET | `api/responsables-cliente/sugeridos-agenda` | `GetSuggestedCalendarInviteesAsync` | GET_LIST |
| POST | `api/telefonosemergencia` | `AddAsync` | CREATE |
| GET | `api/telefonosemergencia` | `GetAllAsync` | GET_LIST |
| DELETE | `api/telefonosemergencia/{id:guid}` | `DeleteAsync` | DELETE |
| GET | `api/telefonosemergencia/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| PUT | `api/telefonosemergencia/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/unidad-medida` | `GetAsyncAll` | GET_LIST |
| POST | `api/unidad-medida` | `AddAsync` | CREATE |
| DELETE | `api/unidad-medida/{id:guid}` | `DeleteByIdAsync` | DELETE |
| GET | `api/unidad-medida/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| PUT | `api/unidad-medida/{id:guid}` | `UpdateAsync` | UPDATE |

## Modulo: SupplierLuxuryApp

Metodos: 73 | Endpoints HTTP: 65

### Servicios e interfaces

| Servicio/Interfaz | Metodos | Ubicacion |
|---|---|---|
| `IOrdenCompraAppService` | 22 | `SupplierLuxuryApp/Purchases/OrdenesCompra/Interfaces/IOrdenCompraAppService.cs` |
| `IOrdenCompraAuthAppService` | 3 | `SupplierLuxuryApp/Purchases/PurchaseOrderAuth/Interfaces/IOrdenCompraAuthAppService.cs` |
| `IOrdenCompraComprobantePagoAppService` | 2 | `SupplierLuxuryApp/Purchases/PurchaseOrderPayment/Interfaces/IOrdenCompraComprobantePagoAppService.cs` |
| `IOrdenCompraDatosPagoAppService` | 2 | `SupplierLuxuryApp/Purchases/PurchaseOrderPayment/Interfaces/IOrdenCompraDatosPagoAppService.cs` |
| `IOrdenCompraDetalleAppService` | 6 | `SupplierLuxuryApp/Purchases/PurchaseOrderDetail/Interfaces/IOrdenCompraDetalleAppService.cs` |
| `IOrdenCompraPresupuestoAppService` | 8 | `SupplierLuxuryApp/Purchases/PurchaseOrderBudgets/Interfaces/IOrdenCompraPresupuestoAppService.cs` |
| `IOrdenCompraStatusAppService` | 6 | `SupplierLuxuryApp/Purchases/PurchaseOrderStatus/Interfaces/IOrdenCompraStatusAppService.cs` |
| `IProviderAppService` | 15 | `SupplierLuxuryApp/Providers/Interfaces/IProviderAppService.cs` |
| `IQualificationProviderAppService` | 5 | `SupplierLuxuryApp/ProviderQualification/Interfaces/IQualificationProviderAppService.cs` |
| `ITotalesOrdenCompraDetallleService` | 4 | `SupplierLuxuryApp/Purchases/PurchaseOrderDetail/Interfaces/ITotalesOrdenCompraDetallleService.cs` |

### Metodos por categoria

| Servicio | Metodo | Categoria | Retorno | Observaciones |
|---|---|---|---|---|
| IOrdenCompraAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<OrdenCompra>>` | ✓ |
| IOrdenCompraAppService | `AddFueraFondeoAsync` | CREATE | `Task<ApiResponseDTO<OrdenCompra>>` | ✓ |
| IOrdenCompraAppService | `AddProgressiveAsync` | CREATE | `Task<ApiResponseDTO<OrdenCompra>>` | ✓ |
| IOrdenCompraAppService | `CotizacionesRelacionadasAsync` | OTHER | `Task<ApiResponseDTO<List<object>>>` | ⚠ naming no CRUD estandar |
| IOrdenCompraAppService | `CreateFromInvoicesAsync` | CREATE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IOrdenCompraAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IOrdenCompraAppService | `FondeoAsync` | OTHER | `Task<ApiResponseDTO<FondeoCaratulaDTO>>` | ⚠ naming no CRUD estandar |
| IOrdenCompraAppService | `GenerarOrdenCompraFijosAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| IOrdenCompraAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<OrdenesCompraDTO[]>>` | ✓ |
| IOrdenCompraAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<OrdenCompraIndividualDTO>>` | ✓ |
| IOrdenCompraAppService | `GetForEdit` | GET_SINGLE | `Task<ApiResponseDTO<object>>` | ⚠ Get sin ByXxx/All |
| IOrdenCompraAppService | `GetForLinkManagerAsync` | GET_LIST | `Task<ApiResponseDTO<IEnumerable<OrdenCompraLinkManagerDTO>>>` | ⚠ Get sin ByXxx/All |
| IOrdenCompraAppService | `GetOrdenCompraPdf` | GET_SINGLE | `Task<ApiResponseDTO<OrdenCompraPdfDTO>>` | ⚠ Get sin ByXxx/All |
| IOrdenCompraAppService | `GetSolicitudPagoPdf` | GET_SINGLE | `Task<ApiResponseDTO<SolicitudPagoPdfResponseDTO>>` | ⚠ Get sin ByXxx/All |
| IOrdenCompraAppService | `GetUnlinkedOrdersAsync` | GET_LIST | `Task<ApiResponseDTO<IEnumerable<UnlinkedOrderDTO>>>` | ⚠ Get sin ByXxx/All |
| IOrdenCompraAppService | `LinkOrderToRequestAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| IOrdenCompraAppService | `OrdenCompraPendientesAsync` | OTHER | `Task<ApiResponseDTO<List<PresupuestoCuentaDTO>>>` | ⚠ naming no CRUD estandar |
| IOrdenCompraAppService | `OrdenesCompraGastosFijosAsync` | OTHER | `Task<ApiResponseDTO<List<OrdenesCompraDTO>>>` | ⚠ naming no CRUD estandar |
| IOrdenCompraAppService | `RemoveFueraFondeoAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IOrdenCompraAppService | `UnlinkSolicitud` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| IOrdenCompraAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<OrdenCompra>>` | ✓ |
| IOrdenCompraAppService | `ValidarOrdenesCompraMismoFolioSolicituCompraAsync` | OTHER | `Task<ApiResponseDTO<decimal>>` | ⚠ naming no CRUD estandar |
| IOrdenCompraAuthAppService | `AutorizarAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| IOrdenCompraAuthAppService | `DesautorizarAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| IOrdenCompraAuthAppService | `NoAutorizadaAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| IOrdenCompraComprobantePagoAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<OrdenCompraComprobantePago>>` | ✓ |
| IOrdenCompraComprobantePagoAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IOrdenCompraDatosPagoAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<OrdenCompraDatosPagoDTO>>` | ✓ |
| IOrdenCompraDatosPagoAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<OrdenCompraDatosPago>>` | ✓ |
| IOrdenCompraDetalleAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<OrdenCompraDetalle>>` | ✓ |
| IOrdenCompraDetalleAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IOrdenCompraDetalleAppService | `GetAllTotalAsync` | GET_LIST | `Task<ApiResponseDTO<List<object>>>` | ✓ |
| IOrdenCompraDetalleAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<OrdenCompraDetalle>>` | ✓ |
| IOrdenCompraDetalleAppService | `GetListProductoToOrder` | GET_LIST | `Task<ApiResponseDTO<ListProductoToOrderPagedListDTO>>` | ✓ |
| IOrdenCompraDetalleAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<OrdenCompraDetalle>>` | ✓ |
| IOrdenCompraPresupuestoAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<PurchaseOrderBudgetDTO>>` | ✓ |
| IOrdenCompraPresupuestoAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IOrdenCompraPresupuestoAppService | `GetAllForOrdenCompraAsync` | GET_LIST | `Task<ApiResponseDTO<List<PurchaseOrderBudgetDTO>>>` | ✓ |
| IOrdenCompraPresupuestoAppService | `GetAllForPurchaseOrderBudgetTotalAsync` | GET_LIST | `Task<ApiResponseDTO<List<object>>>` | ✓ |
| IOrdenCompraPresupuestoAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<PurchaseOrderBudgetDTO>>` | ✓ |
| IOrdenCompraPresupuestoAppService | `GetByIdForEditAsync` | GET_SINGLE | `Task<ApiResponseDTO<PurchaseOrderBudgetAddOrEditDTO>>` | ✓ |
| IOrdenCompraPresupuestoAppService | `GetByIdSimpleAsync` | GET_SINGLE | `Task<ApiResponseDTO<PurchaseOrderBudget>>` | ✓ |
| IOrdenCompraPresupuestoAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<PurchaseOrderBudgetDTO>>` | ✓ |
| IOrdenCompraStatusAppService | `AddInvoiceAsync` | CREATE | `Task<ApiResponseDTO<OrdenCompraFactura>>` | ✓ |
| IOrdenCompraStatusAppService | `DeleteInvoiceAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IOrdenCompraStatusAppService | `GetByOrdenCompraIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<OrdenCompraStatus>>` | ✓ |
| IOrdenCompraStatusAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<OrdenCompraStatus>>` | ✓ |
| IOrdenCompraStatusAppService | `UpdateInvoiceFileAsync` | UPDATE | `Task<ApiResponseDTO<OrdenCompraFactura>>` | ✓ |
| IOrdenCompraStatusAppService | `UpdateInvoiceTypeAsync` | UPDATE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IProviderAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<Provider>>` | ✓ |
| IProviderAppService | `AutorizarAsync` | OTHER | `Task<ApiResponseDTO<Provider>>` | ⚠ naming no CRUD estandar |
| IProviderAppService | `BuscarCoincidenciaAsync` | OTHER | `Task<ApiResponseDTO<ProviderCoincidenciaDTO[]>>` | ⚠ naming no CRUD estandar |
| IProviderAppService | `BuscarPorCategoriaAsync` | OTHER | `Task<ApiResponseDTO<List<ProviderIndexDTO>>>` | ⚠ naming no CRUD estandar |
| IProviderAppService | `BuscarProveedorAsync` | OTHER | `Task<ApiResponseDTO<List<BusquedaProveedorDTO>>>` | ⚠ naming no CRUD estandar |
| IProviderAppService | `ChangeStateAsync` | UPDATE | `Task<ApiResponseDTO<Provider>>` | ✓ |
| IProviderAppService | `CoincidenciasAsync` | OTHER | `Task<ApiResponseDTO<IEnumerable<object>>>` | ⚠ naming no CRUD estandar |
| IProviderAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<Provider>>` | ✓ |
| IProviderAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<ProviderDTO>>` | ✓ |
| IProviderAppService | `GetListBusquedaProveedorDTOAsync` | GET_LIST | `Task<ApiResponseDTO<PagedResultDTO<BusquedaProveedorDTO>>>` | ✓ |
| IProviderAppService | `GetProviderSelectItemAsync` | GET_SINGLE | `Task<ApiResponseDTO<SelectItemDTO<Guid>>>` | ⚠ Get sin ByXxx/All |
| IProviderAppService | `ListProviderIndexDTOAsync` | OTHER | `Task<ApiResponseDTO<List<ProviderIndexDTO>>>` | ⚠ naming no CRUD estandar |
| IProviderAppService | `MigrateProvidersToCustomersAsync` | SPECIAL | `Task<ApiResponseDTO<string>>` | ✓ |
| IProviderAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<Provider>>` | ✓ |
| IProviderAppService | `ValidarRfcAsync` | OTHER | `Task<ApiResponseDTO<List<ValidarRfcDTO>>>` | ⚠ naming no CRUD estandar |
| IQualificationProviderAppService | `AddAsync` | CREATE | `Task<ApiResponseDTO<QualificationProvider>>` | ✓ |
| IQualificationProviderAppService | `DeleteByIdAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IQualificationProviderAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<List<QualificationProviderDTO>>>` | ✓ |
| IQualificationProviderAppService | `GetUserProviderAsync` | GET_SINGLE | `Task<ApiResponseDTO<QualificationProviderDTO>>` | ⚠ Get sin ByXxx/All |
| IQualificationProviderAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<QualificationProvider>>` | ✓ |
| ITotalesOrdenCompraDetallleService | `ImporteTotal` | SPECIAL | `decimal` | ✓ |
| ITotalesOrdenCompraDetallleService | `IvaTotal` | OTHER | `decimal` | ⚠ naming no CRUD estandar |
| ITotalesOrdenCompraDetallleService | `RetencionIsrTotal` | OTHER | `decimal` | ⚠ naming no CRUD estandar |
| ITotalesOrdenCompraDetallleService | `RetencionIvaTotal` | OTHER | `decimal` | ⚠ naming no CRUD estandar |

### Endpoints

| Verbo | Ruta | Handler | Categoria |
|---|---|---|---|
| GET | `api/orden-compra/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| PUT | `api/orden-compra/{id:guid}` | `UpdateAsync` | UPDATE |
| DELETE | `api/orden-compra/{ordenCompraId:guid}` | `DeleteAsync` | DELETE |
| DELETE | `api/orden-compra/{ordenCompraId:guid}/fuera-fondeo` | `RemoveFueraFondeoAsync` | DELETE |
| POST | `api/orden-compra/{providerId:guid}/{posicionCotizacion:int}/{solicitudCompraId?}` | `AddAsync` | CREATE |
| GET | `api/orden-compra/cotizaciones-relacionadas/{solicitudCompraId:guid}` | `CotizacionesRelacionadasAsync` | GET_SINGLE |
| POST | `api/orden-compra/fondeo` | `FondeoAsync` | CREATE |
| POST | `api/orden-compra/fuera-fondeo` | `AddFueraFondeoAsync` | CREATE |
| POST | `api/orden-compra/generar-orden-compra-fijos/{customerId:guid}/{quincena}/{fundingYear:int}/{fundingPeriod:int}` | `GenerarOrdenCompraFijosAsync` | CREATE |
| GET | `api/orden-compra/get-for-edit/{id:guid}` | `GetForEdit` | GET_SINGLE |
| GET | `api/orden-compra/link-manager-list/{customerId:guid}` | `GetForLinkManagerAsync` | GET_SINGLE |
| PUT | `api/orden-compra/link-to-request/{ordenCompraId:guid}/{solicitudCompraId:guid}` | `LinkOrderToRequestAsync` | UPDATE |
| GET | `api/orden-compra/list/{customerId:guid}/{estatus}/{tipoGasto}` | `GetAllAsync` | GET_SINGLE |
| GET | `api/orden-compra/orden-compra-pendientes-por-pagar/{customerId:guid}/{ordenCompraId:guid}` | `OrdenCompraPendientesAsync` | GET_SINGLE |
| GET | `api/orden-compra/ordenes-compra-gastos-fijos/{customerId:guid}/{estatus}` | `OrdenesCompraGastosFijosAsync` | GET_SINGLE |
| GET | `api/orden-compra/pdf/{id:guid}` | `GetOrdenCompraPdf` | GET_SINGLE |
| POST | `api/orden-compra/progressive-create` | `AddProgressiveAsync` | CREATE |
| GET | `api/orden-compra/solicitud-pago/{id:guid}` | `GetSolicitudPagoPdf` | GET_SINGLE |
| GET | `api/orden-compra/unlinked-orders/{customerId:guid}` | `GetUnlinkedOrdersAsync` | GET_SINGLE |
| PUT | `api/orden-compra/unlink-solicitud/{id:guid}` | `UnlinkSolicitud` | UPDATE |
| GET | `api/orden-compra/validar-ordenes-compra-mismo-folio-solicitu-compra/{ordenCompraId:guid}` | `ValidarOrdenesCompraMismoFolioSolicituCompraAsync` | GET_SINGLE |
| GET | `api/orden-compra-auth/autorizar/{ordenCompraId:guid}/{applicationUserId}` | `AutorizarAsync` | GET_SINGLE |
| GET | `api/orden-compra-auth/desautorizar/{ordenCompraId:guid}` | `DesautorizarAsync` | GET_SINGLE |
| PUT | `api/orden-compra-auth/no-autorizada/{ordenCompraAuthId:guid}/{applicationUserId}` | `NoAutorizadaAsync` | UPDATE |
| DELETE | `api/orden-compra-comprobante-pago/{id:guid}` | `DeleteAsync` | DELETE |
| POST | `api/orden-compra-comprobante-pago/{ordenCompraId:guid}` | `AddAsync` | CREATE |
| PUT | `api/orden-compra-datos-pago/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/orden-compra-datos-pago/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| POST | `api/orden-compra-detalle` | `AddAsync` | CREATE |
| GET | `api/orden-compra-detalle/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| PUT | `api/orden-compra-detalle/{id:guid}` | `UpdateAsync` | UPDATE |
| DELETE | `api/orden-compra-detalle/{id:guid}` | `DeleteAsync` | DELETE |
| GET | `api/orden-compra-detalle/add-producto-to-order/{ordenCompraId:guid}` | `GetListProductoToOrder` | GET_SINGLE |
| GET | `api/orden-compra-detalle/get-all-total/{ordenCompraId:guid}` | `GetAllTotalAsync` | GET_SINGLE |
| POST | `api/orden-compra-presupuesto` | `AddAsync` | CREATE |
| GET | `api/orden-compra-presupuesto/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| PUT | `api/orden-compra-presupuesto/{id:guid}` | `UpdateAsync` | UPDATE |
| DELETE | `api/orden-compra-presupuesto/{id:guid}` | `DeleteAsync` | DELETE |
| GET | `api/orden-compra-presupuesto/by-orden-compra/{ordenCompraId:guid}` | `GetAllForOrdenCompraAsync` | GET_SINGLE |
| GET | `api/orden-compra-presupuesto/edit/{id}` | `GetByIdForEditAsync` | GET_SINGLE |
| GET | `api/orden-compra-presupuesto/get-all-for-orden-compra-total/{ordenCompraId:guid}` | `GetAllForPurchaseOrderBudgetTotalAsync` | GET_SINGLE |
| GET | `api/orden-compra-presupuesto/total/{ordenCompraId:guid}` | `GetAllForPurchaseOrderBudgetTotalAsync` | GET_SINGLE |
| PUT | `api/orden-compra-status/{id:guid}` | `UpdateAsync` | UPDATE |
| POST | `api/orden-compra-status/{ordenCompraId:guid}/invoices` | `AddInvoiceAsync` | CREATE |
| GET | `api/orden-compra-status/by-orden-compra/{ordenCompraId:guid}` | `GetByOrdenCompraIdAsync` | GET_SINGLE |
| PUT | `api/orden-compra-status/invoices/{invoiceId:guid}` | `UpdateInvoiceFileAsync` | UPDATE |
| DELETE | `api/orden-compra-status/invoices/{invoiceId:guid}` | `DeleteInvoiceAsync` | DELETE |
| PATCH | `api/orden-compra-status/invoices/{invoiceId:guid}/type` | `UpdateInvoiceTypeAsync` | UPDATE |
| POST | `api/providers` | `AddAsync` | CREATE |
| DELETE | `api/providers/{id:guid}` | `DeleteAsync` | DELETE |
| PUT | `api/providers/{id:guid}` | `UpdateAsync` | UPDATE |
| GET | `api/providers/{id:guid}/{customerId:guid}` | `GetByIdAsync` | GET_SINGLE |
| PUT | `api/providers/autorizar/{providerId:guid}` | `AutorizarAsync` | UPDATE |
| GET | `api/providers/buscar-proveedor/{state:bool}` | `BuscarProveedorAsync` | GET_LIST |
| PUT | `api/providers/change-state/{providerId:guid}/{state:bool}` | `ChangeStateAsync` | UPDATE |
| GET | `api/providers/coincidencias/{providerId:guid}` | `CoincidenciasAsync` | GET_SINGLE |
| GET | `api/providers/get-all/{state:bool}/{customerId:guid}` | `ListProviderIndexDTOAsync` | GET_SINGLE |
| GET | `api/providers/list` | `GetListBusquedaProveedorDTOAsync` | GET_LIST |
| POST | `api/providers/migrate-providers-to-customers` | `MigrateProvidersToCustomersAsync` | CREATE |
| GET | `api/providers/validar-rfc/{value}/{customerId:guid}` | `ValidarRfcAsync` | GET_SINGLE |
| POST | `api/qualification-provider` | `AddAsync` | CREATE |
| GET | `api/qualification-provider` | `GetAllAsync` | GET_LIST |
| GET | `api/qualification-provider/{applicationUserId}/{providerId:guid}` | `GetUserProviderAsync` | GET_SINGLE |
| PUT | `api/qualification-provider/{id:guid}` | `UpdateAsync` | UPDATE |
| DELETE | `api/qualification-provider/{id:guid}` | `DeleteByIdAsync` | DELETE |

## Modulo: SystemLuxuryApp

Metodos: 172 | Endpoints HTTP: 135

### Servicios e interfaces

| Servicio/Interfaz | Metodos | Ubicacion |
|---|---|---|
| `IAiAssistantService` | 16 | `SystemLuxuryApp/SystemTenant/AiAssistant/Interfaces/IAiAssistantService.cs` |
| `IAiChatAppService` | 4 | `SystemLuxuryApp/SystemAI/AiChat/Interfaces/IAiChatAppService.cs` |
| `IAiKnowledgeBaseAppService` | 6 | `SystemLuxuryApp/SystemAI/AiKnowledgeBase/Interfaces/IAiKnowledgeBaseAppService.cs` |
| `IAppImplementationEmailService` | 1 | `SystemLuxuryApp/SendEmailGlobal/AppImplementationTracking/SendEmail/Interfaces/IAppImplementationEmailService.cs` |
| `IAuditEntryAppService` | 1 | `SystemLuxuryApp/ConfiguracionSistema/AuditEntries/Interfaces/IAuditEntryAppService.cs` |
| `IBrevoEmailLogService` | 1 | `SystemLuxuryApp/SystemAuditLogs/LogApp/Interfaces/IBrevoEmailLogService.cs` |
| `IBudgetProposalRealTimeService` | 1 | `SystemLuxuryApp/SendEmailGlobal/PresupuestoPropuesta/Interfaces/IBudgetProposalRealTimeService.cs` |
| `IDatabaseBackupService` | 9 | `SystemLuxuryApp/ConfiguracionSistema/DatabaseBackup/Interfaces/IDatabaseBackupService.cs` |
| `IElevenLabsAppService` | 5 | `SystemLuxuryApp/SystemAI/ElevenLabs/Interfaces/IElevenLabsAppService.cs` |
| `IEmailMessageAppService` | 2 | `SystemLuxuryApp/SendEmailGlobal/Core/Interfaces/IEmailMessageAppService.cs` |
| `ILogService` | 3 | `SystemLuxuryApp/SystemAuditLogs/LogApp/Interfaces/ILogService.cs` |
| `IMeetingEmailService` | 1 | `SystemLuxuryApp/SendEmailGlobal/CommitteeMeeting/SendEmail/Interfaces/IMeetingEmailService.cs` |
| `INotificationUserAppService` | 8 | `SystemLuxuryApp/SystemTenant/Notification/Interfaces/INotificationUserAppService.cs` |
| `IOneDriveGraphService` | 3 | `SystemLuxuryApp/ConfiguracionSistema/DatabaseBackup/Interfaces/IOneDriveGraphService.cs` |
| `IProjectedExpenseRealTimeService` | 1 | `SystemLuxuryApp/SendEmailGlobal/ProjectedExpenses/Interfaces/IProjectedExpenseRealTimeService.cs` |
| `IRecruitmentEmailService` | 11 | `SystemLuxuryApp/SendEmailGlobal/Recruitment/SendEmail/Interfaces/IRecruitmentEmailService.cs` |
| `IScheduledTaskEmailService` | 5 | `SystemLuxuryApp/SendEmailGlobal/ScheduledTasks/SendEmail/Interfaces/IScheduledTaskEmailService.cs` |
| `ISelectItemAppService` | 72 | `SystemLuxuryApp/SelectItem/Interfaces/ISelectItemAppService.cs` |
| `ISendEmailAppService` | 8 | `SystemLuxuryApp/SendEmailGlobal/Core/Interfaces/ISendEmailAppService.cs` |
| `ISendSignalRService` | 8 | `SystemLuxuryApp/SystemTenant/Notification/Interfaces/ISendSignalRService.cs` |
| `ITaskLegalWhatsAppService` | 2 | `SystemLuxuryApp/SendEmailGlobal/Tasks/SendWhatsApp/Interfaces/ITaskLegalWhatsAppService.cs` |
| `ITaskWorkPlanEmailService` | 1 | `SystemLuxuryApp/SendEmailGlobal/Tasks/SendEmail/Interfaces/ITaskWorkPlanEmailService.cs` |
| `IUserActivityHistoryAppService` | 1 | `SystemLuxuryApp/SystemAuditLogs/UserActivityHistory/Interfaces/IUserActivityHistoryAppService.cs` |
| `IUserActivityService` | 1 | `SystemLuxuryApp/SystemAuditLogs/UserActivityHistory/Interfaces/IUserActivityService.cs` |
| `SelectItemAppService` | 1 | `SystemLuxuryApp/SelectItem/Services/SelectItemAppService.cs` |

### Metodos por categoria

| Servicio | Metodo | Categoria | Retorno | Observaciones |
|---|---|---|---|---|
| IAiAssistantService | `AnalyzeAccountingReportAsync` | OTHER | `Task<string>` | ⚠ naming no CRUD estandar |
| IAiAssistantService | `AnalyzeComparativeChartAsync` | OTHER | `Task<string>` | ⚠ naming no CRUD estandar |
| IAiAssistantService | `AnalyzeContabilidadOnlineReportAsync` | OTHER | `Task<string>` | ⚠ naming no CRUD estandar |
| IAiAssistantService | `AnalyzeImageAsync` | OTHER | `Task<string>` | ⚠ naming no CRUD estandar |
| IAiAssistantService | `AnalyzeJobDescriptionAsync` | OTHER | `Task<string>` | ⚠ naming no CRUD estandar |
| IAiAssistantService | `ConsultDocumentAsync` | OTHER | `Task<string>` | ⚠ naming no CRUD estandar |
| IAiAssistantService | `ExplainContabilidadOnlineReportAsync` | OTHER | `Task<string>` | ⚠ naming no CRUD estandar |
| IAiAssistantService | `GenerateAnnouncementDraftAsync` | SPECIAL | `Task<string>` | ✓ |
| IAiAssistantService | `GenerateBudgetAuditAsync` | SPECIAL | `Task<string>` | ✓ |
| IAiAssistantService | `GenerateBudgetForecastAsync` | SPECIAL | `Task<string>` | ✓ |
| IAiAssistantService | `GenerateDashboardSummaryAsync` | SPECIAL | `Task<string>` | ✓ |
| IAiAssistantService | `GenerateFinancialSummaryAsync` | SPECIAL | `Task<string>` | ✓ |
| IAiAssistantService | `GenerateImageAsync` | SPECIAL | `Task<Stream>` | ✓ |
| IAiAssistantService | `GenerateJobDescriptionAsync` | SPECIAL | `Task<string>` | ✓ |
| IAiAssistantService | `GenerateOfficialAnnouncementAsync` | SPECIAL | `Task<OperationsLuxuryApp.Announcements.DTOs.OfficialAnnouncementDraftDTO>` | ✓ |
| IAiAssistantService | `TestProfileAsync` | OTHER | `Task<string>` | ⚠ naming no CRUD estandar |
| IAiChatAppService | `GetSessionHistoryAsync` | GET_LIST | `Task<ApiResponseDTO<List<ChatMessageDTO>>>` | ⚠ Get sin ByXxx/All |
| IAiChatAppService | `GetUserSessionsAsync` | GET_LIST | `Task<ApiResponseDTO<List<ChatSessionDTO>>>` | ⚠ Get sin ByXxx/All |
| IAiChatAppService | `SendMessageAsync` | SPECIAL | `Task<ApiResponseDTO<string>>` | ✓ |
| IAiChatAppService | `StartNewSessionAsync` | OTHER | `Task<ApiResponseDTO<ChatSessionDTO>>` | ⚠ naming no CRUD estandar |
| IAiKnowledgeBaseAppService | `CreateAsync` | CREATE | `Task<ApiResponseDTO<Guid>>` | ✓ |
| IAiKnowledgeBaseAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IAiKnowledgeBaseAppService | `GetAllAsync` | GET_LIST | `Task<ApiResponseDTO<List<AiKnowledgeBaseDTO>>>` | ✓ |
| IAiKnowledgeBaseAppService | `GetByIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<AiKnowledgeBaseDTO>>` | ✓ |
| IAiKnowledgeBaseAppService | `GetModulesAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>>` | ⚠ Get sin ByXxx/All |
| IAiKnowledgeBaseAppService | `UpdateAsync` | UPDATE | `Task<ApiResponseDTO<bool>>` | ✓ |
| IAppImplementationEmailService | `SendMissingEmployeeDataReportAsync` | SPECIAL | `Task` | ✓ |
| IAuditEntryAppService | `GetHistoryAsync` | GET_LIST | `Task<ApiResponseDTO<PagedResultDTO<AuditEntryDTO>>>` | ⚠ Get sin ByXxx/All |
| IBrevoEmailLogService | `GetEmailLogsAsync` | GET_LIST | `Task<ApiResponseDTO<BrevoPagedResultDTO>>` | ⚠ Get sin ByXxx/All |
| IBudgetProposalRealTimeService | `SendUpdateAsync` | SPECIAL | `Task` | ✓ |
| IDatabaseBackupService | `CreateConfigAsync` | CREATE | `Task<ApiResponseDTO<DatabaseBackupConfigDTO>>` | ✓ |
| IDatabaseBackupService | `DeleteConfigAsync` | DELETE | `Task<ApiResponseDTO<object>>` | ✓ |
| IDatabaseBackupService | `ExecuteBackupNowAsync` | SPECIAL | `Task<ApiResponseDTO<object>>` | ✓ |
| IDatabaseBackupService | `GetAvailableDatabasesAsync` | GET_LIST | `Task<ApiResponseDTO<List<string>>>` | ⚠ Get sin ByXxx/All |
| IDatabaseBackupService | `GetBackupHistoryAsync` | GET_LIST | `Task<ApiResponseDTO<List<DatabaseBackupSummaryDTO>>>` | ⚠ Get sin ByXxx/All |
| IDatabaseBackupService | `GetConfigAsync` | GET_SINGLE | `Task<ApiResponseDTO<DatabaseBackupConfigDTO>>` | ⚠ Get sin ByXxx/All |
| IDatabaseBackupService | `GetConfigsAsync` | GET_LIST | `Task<ApiResponseDTO<List<DatabaseBackupConfigDTO>>>` | ⚠ Get sin ByXxx/All |
| IDatabaseBackupService | `TestOneDriveConnectionAsync` | OTHER | `Task<ApiResponseDTO<object>>` | ⚠ naming no CRUD estandar |
| IDatabaseBackupService | `UpdateConfigAsync` | UPDATE | `Task<ApiResponseDTO<DatabaseBackupConfigDTO>>` | ✓ |
| IElevenLabsAppService | `GetSettingsAsync` | GET_LIST | `Task<ApiResponseDTO<ElevenLabsSettingsDTO>>` | ⚠ Get sin ByXxx/All |
| IElevenLabsAppService | `GetSubscriptionStatusAsync` | GET_LIST | `Task<ApiResponseDTO<SubscriptionStatusDTO>>` | ⚠ Get sin ByXxx/All |
| IElevenLabsAppService | `GetVoicesAsync` | GET_LIST | `Task<ApiResponseDTO<List<VoiceInfoDTO>>>` | ⚠ Get sin ByXxx/All |
| IElevenLabsAppService | `SaveSettingsAsync` | UPDATE | `Task<ApiResponseDTO<ElevenLabsSettingsDTO>>` | ✓ |
| IElevenLabsAppService | `TextToSpeechAsync` | OTHER | `Task<ApiResponseDTO<TextToSpeechResponseDTO>>` | ⚠ naming no CRUD estandar |
| IEmailMessageAppService | `SendEmailMesageRequestAsync` | SPECIAL | `Task` | ✓ |
| IEmailMessageAppService | `SendReportPendingTicketGroupAsync` | SPECIAL | `Task` | ✓ |
| ILogService | `DeleteAllLogsAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| ILogService | `DeleteOldLogsAsync` | DELETE | `Task<ApiResponseDTO<int>>` | ✓ |
| ILogService | `GetLogsAsync` | GET_LIST | `Task<ApiResponseDTO<PagedResultDTO<LogEntryDTO>>>` | ⚠ Get sin ByXxx/All |
| IMeetingEmailService | `SendPendingItemsAsync` | SPECIAL | `Task` | ✓ |
| INotificationUserAppService | `CreateNotificationAsync` | CREATE | `Task<ApiResponseDTO<NotificationUser>>` | ✓ |
| INotificationUserAppService | `DeleteAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| INotificationUserAppService | `DeleteOldNotificationsAsync` | DELETE | `Task<ApiResponseDTO<int>>` | ✓ |
| INotificationUserAppService | `DeleteRangeAsync` | DELETE | `Task<ApiResponseDTO<bool>>` | ✓ |
| INotificationUserAppService | `GetUnreadCountAsync` | GET_SINGLE | `Task<ApiResponseDTO<int>>` | ⚠ Get sin ByXxx/All |
| INotificationUserAppService | `GetUserNotificationsAsync` | GET_LIST | `Task<ApiResponseDTO<List<NotificationUserDTO>>>` | ⚠ Get sin ByXxx/All |
| INotificationUserAppService | `GetUsersAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<string>>>>` | ⚠ Get sin ByXxx/All |
| INotificationUserAppService | `MarkAsReadAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| IOneDriveGraphService | `DeleteOldFilesAsync` | DELETE | `Task` | ✓ |
| IOneDriveGraphService | `TestConnectionAsync` | OTHER | `Task<bool>` | ⚠ naming no CRUD estandar |
| IOneDriveGraphService | `UploadFileAsync` | SPECIAL | `Task<string>` | ✓ |
| IProjectedExpenseRealTimeService | `SendUpdateAsync` | SPECIAL | `Task` | ✓ |
| IRecruitmentEmailService | `SendAltaSistemasEmailAsync` | SPECIAL | `Task` | ✓ |
| IRecruitmentEmailService | `SendCandidateApplicationCreatedEmailAsync` | SPECIAL | `Task` | ✓ |
| IRecruitmentEmailService | `SendCandidateInterviewDecisionEmailAsync` | SPECIAL | `Task` | ✓ |
| IRecruitmentEmailService | `SendCandidateInterviewTrackingEmailAsync` | SPECIAL | `Task` | ✓ |
| IRecruitmentEmailService | `SendCandidateReceptionConfirmedEmailAsync` | SPECIAL | `Task` | ✓ |
| IRecruitmentEmailService | `SendCandidateSentToInterviewEmailAsync` | SPECIAL | `Task` | ✓ |
| IRecruitmentEmailService | `SendCredencialesAccesoEmailAsync` | SPECIAL | `Task` | ✓ |
| IRecruitmentEmailService | `SendModificacionSalarioEmailAsync` | SPECIAL | `Task` | ✓ |
| IRecruitmentEmailService | `SendSolicitudAltaEmailAsync` | SPECIAL | `Task` | ✓ |
| IRecruitmentEmailService | `SendSolicitudBajaEmailAsync` | SPECIAL | `Task` | ✓ |
| IRecruitmentEmailService | `SendSolicitudVacanteEmailAsync` | SPECIAL | `Task` | ✓ |
| IScheduledTaskEmailService | `SendContractsPoliciesExpirationAsync` | SPECIAL | `Task` | ✓ |
| IScheduledTaskEmailService | `SendLegalReportAsync` | SPECIAL | `Task` | ✓ |
| IScheduledTaskEmailService | `SendLegalTicketReportToCustomerAsync` | SPECIAL | `Task` | ✓ |
| IScheduledTaskEmailService | `SendPendingTicketGroupReportAsync` | SPECIAL | `Task` | ✓ |
| IScheduledTaskEmailService | `SendVacanciesReportAsync` | SPECIAL | `Task` | ✓ |
| ISelectItemAppService | `ApplicationUserForCustomerIdAsync` | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<string>>>>` | ⚠ naming no CRUD estandar |
| ISelectItemAppService | `FundingPeriodAsync` | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<string>>>>` | ⚠ naming no CRUD estandar |
| ISelectItemAppService | `GetRolesForAnnouncementsAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<string>>>>` | ⚠ Get sin ByXxx/All |
| ISelectItemAppService | `SelectItemAccountForCustomerAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>>` | ✓ |
| ISelectItemAppService | `SelectItemAddCuentaCedulaPresupuestalAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>>` | ✓ |
| ISelectItemAppService | `SelectItemAdministracionMinutaAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<string>>>>` | ✓ |
| ISelectItemAppService | `SelectItemAlmacenesAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>>` | ✓ |
| ISelectItemAppService | `SelectItemAnioOrdenServiceAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<int>>>>` | ✓ |
| ISelectItemAppService | `SelectItemApplicationRolesAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<string>>>>` | ✓ |
| ISelectItemAppService | `SelectItemApplicationRolesToAdministratorAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<string>>>>` | ✓ |
| ISelectItemAppService | `SelectItemApplicationRolesToProviderAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<string>>>>` | ✓ |
| ISelectItemAppService | `SelectItemApplicationUserAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<string>>>>` | ✓ |
| ISelectItemAppService | `SelectItemApplicationUserProviderAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<string>>>>` | ✓ |
| ISelectItemAppService | `SelectItemAspelCustomerEmpresaAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>>` | ✓ |
| ISelectItemAppService | `SelectItemBankAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>>` | ✓ |
| ISelectItemAppService | `SelectItemCandidatesAsync` | GET_LIST | `Task<ApiResponseDTO<List<CandidateSelectItemDTO>>>` | ✓ |
| ISelectItemAppService | `SelectItemCategoriesAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>>` | ✓ |
| ISelectItemAppService | `SelectItemComiteMinutaAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<string>>>>` | ✓ |
| ISelectItemAppService | `SelectItemCustomerInspectionsAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>>` | ✓ |
| ISelectItemAppService | `SelectItemCustomersAccesoAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>>` | ✓ |
| ISelectItemAppService | `SelectItemCustomersActiveAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>>` | ✓ |
| ISelectItemAppService | `SelectItemCustomersActiveNameShortAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>>` | ✓ |
| ISelectItemAppService | `SelectItemCustomersAllAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>>` | ✓ |
| ISelectItemAppService | `SelectItemCustomersInactiveAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>>` | ✓ |
| ISelectItemAppService | `SelectItemDocumentCatalogAsync` | GET_LIST | `Task<ApiResponseDTO<List<DocumentCatalogSelectItemDTO>>>` | ✓ |
| ISelectItemAppService | `SelectItemEmployeeActiveAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>>` | ✓ |
| ISelectItemAppService | `SelectItemEmployeeAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>>` | ✓ |
| ISelectItemAppService | `SelectItemEmployeeByUserIdAsync` | GET_SINGLE | `Task<ApiResponseDTO<List<SelectItemDTO<string>>>>` | ✓ |
| ISelectItemAppService | `SelectItemEmployeesActiveAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<string>>>>` | ✓ |
| ISelectItemAppService | `SelectItemEquipoCalendarioMaestroAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>>` | ✓ |
| ISelectItemAppService | `SelectItemEquipoClasificacionAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>>` | ✓ |
| ISelectItemAppService | `SelectItemEvaluationTemplateAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>>` | ✓ |
| ISelectItemAppService | `SelectItemInspectionReviewsCatalogAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>>` | ✓ |
| ISelectItemAppService | `SelectItemInstalacionesAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>>` | ✓ |
| ISelectItemAppService | `SelectItemLegalMatterAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>>` | ✓ |
| ISelectItemAppService | `SelectItemLegalMatterCategoryAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>>` | ✓ |
| ISelectItemAppService | `SelectItemMachineriesActiveAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>>` | ✓ |
| ISelectItemAppService | `SelectItemMachineriesGetAllAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>>` | ✓ |
| ISelectItemAppService | `SelectItemMeasurementUnitsAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>>` | ✓ |
| ISelectItemAppService | `SelectItemMedidorCategoriaAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>>` | ✓ |
| ISelectItemAppService | `SelectItemModuleAppAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>>` | ✓ |
| ISelectItemAppService | `SelectItemNombreCortoAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>>` | ✓ |
| ISelectItemAppService | `SelectItemOnboardingChecklistOptionsAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>>` | ✓ |
| ISelectItemAppService | `SelectItemOperationsInterviewersByCustomerAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<string>>>>` | ✓ |
| ISelectItemAppService | `SelectItemOperationsInterviewersByRequestPositionAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<string>>>>` | ✓ |
| ISelectItemAppService | `SelectItemOwnerAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>>` | ✓ |
| ISelectItemAppService | `SelectItemParticipantAdministrationAsync` | GET_LIST | `Task<ApiResponseDTO<List<MeetingParticipantAdministracionDTO>>>` | ✓ |
| ISelectItemAppService | `SelectItemPaymentMethodAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>>` | ✓ |
| ISelectItemAppService | `SelectItemPersonAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<string>>>>` | ✓ |
| ISelectItemAppService | `SelectItemPersonEmployeeAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<string>>>>` | ✓ |
| ISelectItemAppService | `SelectItemProductsAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>>` | ✓ |
| ISelectItemAppService | `SelectItemProfessionsAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<string>>>>` | ✓ |
| ISelectItemAppService | `SelectItemPropertyAccountsAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<string>>>>` | ✓ |
| ISelectItemAppService | `SelectItemPropertyAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>>` | ✓ |
| ISelectItemAppService | `SelectItemProvidersAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>>` | ✓ |
| ISelectItemAppService | `SelectItemRecruitmentSourcesAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>>` | ✓ |
| ISelectItemAppService | `SelectItemRequestPositionsPendingAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>>` | ✓ |
| ISelectItemAppService | `SelectItemResidentesEdificioAsync` | GET_LIST | `Task<ApiResponseDTO<List<ResidentesEdificioDTO>>>` | ✓ |
| ISelectItemAppService | `SelectItemResponsableSistemasAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<string>>>>` | ✓ |
| ISelectItemAppService | `SelectItemRolesAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<string>>>>` | ✓ |
| ISelectItemAppService | `SelectItemRolesByRoleTypeAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<string>>>>` | ✓ |
| ISelectItemAppService | `SelectItemRolForDocumentAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<string>>>>` | ✓ |
| ISelectItemAppService | `SelectItemSelectForAddTicketAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<string>>>>` | ✓ |
| ISelectItemAppService | `SelectItemSupervisionAsync` | GET_LIST | `Task<ApiResponseDTO<List<LabelDTO>>>` | ✓ |
| ISelectItemAppService | `SelectItemTaskGroupCategoryAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>>` | ✓ |
| ISelectItemAppService | `SelectItemTicketGroupListAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>>` | ✓ |
| ISelectItemAppService | `SelectItemToolAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>>` | ✓ |
| ISelectItemAppService | `SelectItemUseCFDIAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>>` | ✓ |
| ISelectItemAppService | `SelectItemVacantesAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>>` | ✓ |
| ISelectItemAppService | `SelectItemWayToPayAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>>` | ✓ |
| ISelectItemAppService | `SelectRichItemProductsAsync` | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>>` | ✓ |
| ISelectItemAppService | `UserFromCustomerAsync` | OTHER | `Task<ApiResponseDTO<List<UserCustomerDTO>>>` | ⚠ naming no CRUD estandar |
| ISendEmailAppService | `EstadosFinancierosCondominosAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| ISendEmailAppService | `OperationReportAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| ISendEmailAppService | `PresentacionFinalComiteAsync` | OTHER | `Task<ApiResponseDTO<bool>>` | ⚠ naming no CRUD estandar |
| ISendEmailAppService | `SendExecutivePendingReportAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| ISendEmailAppService | `SendMeetingAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| ISendEmailAppService | `SendTestMailAsync` | SPECIAL | `Task<ApiResponseDTO<SendTestMailResultDTO>>` | ✓ |
| ISendEmailAppService | `TestEmailAsync` | OTHER | `Task<ApiResponseDTO<string>>` | ⚠ naming no CRUD estandar |
| ISendEmailAppService | `TestSendEmail` | OTHER | `Task<ApiResponseDTO<string>>` | ⚠ naming no CRUD estandar |
| ISendSignalRService | `GetConnectedUserIds` | GET_LIST | `ApiResponseDTO<List<string>>` | ⚠ Get sin ByXxx/All |
| ISendSignalRService | `SendBudgetProposalItemUpdateAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| ISendSignalRService | `SendDTOUserAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| ISendSignalRService | `SendGoogleCalendarEventUpdateAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| ISendSignalRService | `SendNativeCollectionUpdateAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| ISendSignalRService | `SendPanicAlertAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| ISendSignalRService | `SendProjectedExpenseUpdateAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| ISendSignalRService | `SenDTOMultipleUsersAsync` | SPECIAL | `Task<ApiResponseDTO<bool>>` | ✓ |
| ITaskLegalWhatsAppService | `NotifyNewTicketAsync` | SPECIAL | `Task` | ✓ |
| ITaskLegalWhatsAppService | `NotifyStatusUpdateAsync` | SPECIAL | `Task` | ✓ |
| ITaskWorkPlanEmailService | `SendWeeklyWorkPlanAsync` | SPECIAL | `Task` | ✓ |
| IUserActivityHistoryAppService | `GetHistoryAsync` | GET_LIST | `Task<ApiResponseDTO<PagedResultDTO<UserActivityHistoryDTO>>>` | ⚠ Get sin ByXxx/All |
| IUserActivityService | `LogActivityAsync` | OTHER | `Task` | ⚠ naming no CRUD estandar |
| SelectItemAppService | `ListRoleAdmin` | OTHER | `List<ApplicationRolesDTO>` | ⚠ naming no CRUD estandar |

### Endpoints

| Verbo | Ruta | Handler | Categoria |
|---|---|---|---|
| POST | `api/admin/database-backup/configs` | `CreateConfigAsync` | CREATE |
| GET | `api/admin/database-backup/configs` | `GetConfigsAsync` | GET_LIST |
| DELETE | `api/admin/database-backup/configs/{id:guid}` | `DeleteConfigAsync` | DELETE |
| PUT | `api/admin/database-backup/configs/{id:guid}` | `UpdateConfigAsync` | UPDATE |
| GET | `api/admin/database-backup/configs/{id:guid}` | `GetConfigAsync` | GET_SINGLE |
| POST | `api/admin/database-backup/configs/{id:guid}/execute` | `ExecuteBackupNowAsync` | SPECIAL |
| POST | `api/admin/database-backup/configs/{id:guid}/test-connection` | `TestOneDriveConnectionAsync` | CREATE |
| GET | `api/admin/database-backup/databases` | `GetAvailableDatabasesAsync` | GET_LIST |
| GET | `api/admin/database-backup/history/{configId:guid}` | `GetBackupHistoryAsync` | GET_SINGLE |
| POST | `api/ai-assistant/generate-image` | `GenerateImageAsync` | SPECIAL |
| GET | `api/ai-assistant/test-profile` | `TestProfileAsync` | GET_LIST |
| GET | `api/ai-chat/history/{sessionId:guid}` | `GetSessionHistoryAsync` | GET_SINGLE |
| POST | `api/ai-chat/send-message` | `SendMessageAsync` | SPECIAL |
| GET | `api/ai-chat/sessions` | `GetUserSessionsAsync` | GET_LIST |
| POST | `api/ai-chat/start-session` | `StartNewSessionAsync` | CREATE |
| POST | `api/ai-knowledge-base` | `CreateAsync` | CREATE |
| PUT | `api/ai-knowledge-base` | `UpdateAsync` | UPDATE |
| GET | `api/ai-knowledge-base` | `GetAllAsync` | GET_LIST |
| GET | `api/ai-knowledge-base/{id:guid}` | `GetByIdAsync` | GET_SINGLE |
| DELETE | `api/ai-knowledge-base/{id:guid}` | `DeleteAsync` | DELETE |
| GET | `api/ai-knowledge-base/modules` | `GetModulesAsync` | GET_LIST |
| GET | `api/audit-entries` | `GetHistoryAsync` | GET_LIST |
| GET | `api/brevo-email-log` | `GetEmailLogsAsync` | GET_LIST |
| POST | `api/eleven-labs/settings` | `SaveSettingsAsync` | CREATE |
| GET | `api/eleven-labs/settings` | `GetSettingsAsync` | GET_LIST |
| GET | `api/eleven-labs/subscription-status` | `GetSubscriptionStatusAsync` | GET_LIST |
| POST | `api/eleven-labs/text-to-speech` | `TextToSpeechAsync` | CREATE |
| GET | `api/eleven-labs/voices` | `GetVoicesAsync` | GET_LIST |
| GET | `api/logs` | `GetLogsAsync` | GET_LIST |
| DELETE | `api/logs/all` | `DeleteAllLogsAsync` | DELETE |
| POST | `api/logs/client-error` | `DeleteAllLogsAsync` | CREATE |
| GET | `api/notifications` | `GetUserNotificationsAsync` | GET_LIST |
| DELETE | `api/notifications` | `DeleteRangeAsync` | DELETE |
| DELETE | `api/notifications/{id:guid}` | `DeleteAsync` | DELETE |
| GET | `api/notifications/connected-users` | `GetConnectedUserIds` | GET_LIST |
| GET | `api/notifications/connected-users-web` | `GetConnectedUserIds` | GET_LIST |
| GET | `api/notifications/mark-as-read/{id:guid}` | `MarkAsReadAsync` | GET_SINGLE |
| POST | `api/notifications/test-email` | `OnSendEmailAsync` | CREATE |
| POST | `api/notifications/test-notification-user` | `OnSendEmailAsync` | CREATE |
| POST | `api/notifications/test-one-signal` | `SendNotificationOneSignalAsync` | CREATE |
| POST | `api/notifications/test-one-signal-web` | `SendNotificationOneSignalAsync` | CREATE |
| POST | `api/notifications/test-signal-r/{userId}` | `SendDTOUserAsync` | CREATE |
| POST | `api/notifications/test-signal-users` | `GetConnectedUserIds` | CREATE |
| POST | `api/notifications/test-whatsapp` | `SendMessageTicketLegal` | CREATE |
| POST | `api/notifications/test-whatsapp-alerta-tarea-urgente` | `SendMessageAlertaTareaUrgente` | CREATE |
| POST | `api/notifications/test-whatsapp-legal-ticket` | `SendMessageTicketLegal` | CREATE |
| POST | `api/notifications/test-whatsapp-solicitud-recibida` | `SendMessageSolicitudRecibida` | CREATE |
| POST | `api/notifications/test-whatsapp-solicitud-terminada` | `SendMessageSolicitudTerminada` | CREATE |
| GET | `api/notifications/unread-count` | `GetUnreadCountAsync` | GET_LIST |
| GET | `api/notifications/users` | `GetUsersAsync` | GET_LIST |
| GET | `api/select-items/accounting-catalogs/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/select-items/accounts-for-customer/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/select-items/administration-minutes/{customerId:guid}/{meetingId:guid}` | (inline) | GET_SINGLE |
| GET | `api/select-items/almacenes/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/select-items/application-roles` | (inline) | GET_LIST |
| GET | `api/select-items/application-roles-to-administrator` | (inline) | GET_LIST |
| GET | `api/select-items/application-roles-to-provider` | (inline) | GET_LIST |
| GET | `api/select-items/application-user-providers` | (inline) | GET_LIST |
| GET | `api/select-items/application-users` | (inline) | GET_LIST |
| GET | `api/select-items/application-users/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/select-items/aspel-customer-empresa` | (inline) | GET_LIST |
| GET | `api/select-items/banks` | (inline) | GET_LIST |
| GET | `api/select-items/boolean-options` | (inline) | GET_LIST |
| GET | `api/select-items/building-residents/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/select-items/candidates` | (inline) | GET_LIST |
| GET | `api/select-items/categories` | (inline) | GET_LIST |
| GET | `api/select-items/cfdi-uses` | (inline) | GET_LIST |
| GET | `api/select-items/committee-minutes/{customerId:guid}/{meetingId:guid}` | (inline) | GET_SINGLE |
| GET | `api/select-items/customer-inspections/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/select-items/customers-access/{applicationUserId}` | (inline) | GET_SINGLE |
| GET | `api/select-items/customers-active` | (inline) | GET_LIST |
| GET | `api/select-items/customers-active-short-name` | (inline) | GET_LIST |
| GET | `api/select-items/customers-all` | (inline) | GET_LIST |
| GET | `api/select-items/customers-inactive` | (inline) | GET_LIST |
| GET | `api/select-items/document-catalog` | (inline) | GET_LIST |
| GET | `api/select-items/employees/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/select-items/employees-active` | (inline) | GET_LIST |
| GET | `api/select-items/employees-active/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/select-items/employees-by-user-id/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/select-items/equipment-classifications` | (inline) | GET_LIST |
| GET | `api/select-items/equipo-calendario-maestro` | (inline) | GET_LIST |
| GET | `api/select-items/evaluation-templates/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/select-items/funding-period/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/select-items/inspection-review-catalogs` | (inline) | GET_LIST |
| GET | `api/select-items/legal-matter-categories` | (inline) | GET_LIST |
| GET | `api/select-items/legal-matters` | (inline) | GET_LIST |
| GET | `api/select-items/listado-instalaciones/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/select-items/machineries-active/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/select-items/machineries-all/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/select-items/measurement-units` | (inline) | GET_LIST |
| GET | `api/select-items/medidor-categoria` | (inline) | GET_LIST |
| GET | `api/select-items/module-apps` | (inline) | GET_LIST |
| GET | `api/select-items/nombre-corto` | (inline) | GET_LIST |
| GET | `api/select-items/onboarding-checklist-options` | (inline) | GET_LIST |
| GET | `api/select-items/operations-interviewers/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/select-items/operations-interviewers/by-request-position/{requestPositionId:guid}` | (inline) | GET_SINGLE |
| GET | `api/select-items/owners/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/select-items/participant-administration/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/select-items/payment-methods` | (inline) | GET_LIST |
| GET | `api/select-items/payment-ways` | (inline) | GET_LIST |
| GET | `api/select-items/people/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/select-items/people-employees/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/select-items/products` | (inline) | GET_LIST |
| GET | `api/select-items/professions` | (inline) | GET_LIST |
| GET | `api/select-items/properties/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/select-items/property-accounts/{customerId:guid}/{year:int}` | (inline) | GET_SINGLE |
| GET | `api/select-items/property-members/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/select-items/providers/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/select-items/recruitment-sources` | (inline) | GET_LIST |
| GET | `api/select-items/request-positions-pending` | (inline) | GET_LIST |
| GET | `api/select-items/residentes-edificio/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/select-items/responsable-sistemas` | (inline) | GET_LIST |
| GET | `api/select-items/rich-products` | (inline) | GET_LIST |
| GET | `api/select-items/roles` | (inline) | GET_LIST |
| GET | `api/select-items/roles-by-role-type/{roleType}` | (inline) | GET_LIST |
| GET | `api/select-items/roles-for-announcements` | (inline) | GET_LIST |
| GET | `api/select-items/roles-for-document` | (inline) | GET_LIST |
| GET | `api/select-items/select-for-add-ticket` | (inline) | GET_LIST |
| GET | `api/select-items/service-year/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/select-items/supervision-list` | (inline) | GET_LIST |
| GET | `api/select-items/task-group-category/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/select-items/task-group-list/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/select-items/tools/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/select-items/users-from-customer/{customerId:guid}` | (inline) | GET_SINGLE |
| GET | `api/select-items/vacantes/{customerId:guid}` | (inline) | GET_SINGLE |
| POST | `api/send-email/estados-financieros-condominos/{id:guid}` | `EstadosFinancierosCondominosAsync` | SPECIAL |
| POST | `api/send-email/meeting/{meetingId:guid}` | `SendMeetingAsync` | SPECIAL |
| POST | `api/send-email/operation-report/{applicationUserId}/{customerId:guid}/{year:int}/{numeroSemana:int}` | `OperationReportAsync` | SPECIAL |
| POST | `api/send-email/presentacion-final-comite/{id:guid}` | `PresentacionFinalComiteAsync` | SPECIAL |
| POST | `api/send-email/send-test-mail/{id:guid}` | `SendTestMailAsync` | SPECIAL |
| POST | `api/send-email/test-email/{email}` | `TestSendEmail` | SPECIAL |
| POST | `api/send-email/test-email/{id:guid}` | `TestEmailAsync` | SPECIAL |
| GET | `api/system/environment-info` | (inline) | GET_LIST |
| POST | `api/ticket-analysis/analyze-image` | `AnalyzeImageAsync` | CREATE |
| GET | `api/user-activity-history` | `GetHistoryAsync` | GET_LIST |

