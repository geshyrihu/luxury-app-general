# INVENTARIO API - LuxuryApp

> Generado automaticamente el 2026-09-11 por `scripts/api_inventory/scan.js`

## Resumen Ejecutivo

- Grupos de modulos (top-level): **15**
- Modulos funcionales: **182**
- Interfaces: **356**
- Servicios: **372**
- Metodos publicos analizados: **3904**
- Endpoints HTTP declarados: **1756**
- Archivos DTO: **938**

### Distribucion por categoria

| Categoria | Cantidad | % |
|---|---:|---:|
| GET_SINGLE | 313 | 8.0% |
| GET_LIST | 1200 | 30.7% |
| CREATE | 394 | 10.1% |
| UPDATE | 401 | 10.3% |
| DELETE | 393 | 10.1% |
| SPECIAL | 662 | 17.0% |
| OTHER | 541 | 13.9% |

### Distribucion de endpoints por verbo HTTP

| Verbo | Cantidad |
|---|---:|
| GET | 961 |
| POST | 378 |
| PUT | 205 |
| DELETE | 183 |
| PATCH | 29 |

## Analisis por Grupo de Modulos

### Grupo: AdminLuxuryApp

#### Modulo: ConfiguracionSistema

- Interfaces: 1 | Servicios: 1 | Endpoints: 5 | DTOs: 2

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IAsambleaChecklistTemplateAppService | 5 | `AdminLuxuryApp/ConfiguracionSistema/AsambleaChecklistTemplates/Interfaces/IAsambleaChecklistTemplateAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| AsambleaChecklistTemplateAppService | 5 | `AdminLuxuryApp/ConfiguracionSistema/AsambleaChecklistTemplates/Services/AsambleaChecklistTemplateAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetAllAsync | IAsambleaChecklistTemplateAppService | GET_LIST | `Task<ApiResponseDTO<List<AsambleaChecklistT…` | `-` |
| GetByIdAsync | IAsambleaChecklistTemplateAppService | GET_SINGLE | `Task<ApiResponseDTO<AsambleaChecklistTempla…` | `Guid id` |
| AddAsync | IAsambleaChecklistTemplateAppService | CREATE | `Task<ApiResponseDTO<AsambleaChecklistTempla…` | `AsambleaChecklistTemplateAddOrEditDTO dto` |
| UpdateAsync | IAsambleaChecklistTemplateAppService | UPDATE | `Task<ApiResponseDTO<AsambleaChecklistTempla…` | `Guid id, AsambleaChecklistTemplateAddOrEditDTO dto` |
| DeleteByIdAsync | IAsambleaChecklistTemplateAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/asamblea-checklist-template` | `appService.GetAllAsync` | `AdminLuxuryApp/ConfiguracionSistema/AsambleaChecklistTemplates/EndPoints/AsambleaChecklistTemplateEndpoints.cs` |
| GET | `/api/asamblea-checklist-template/{id:guid}` | `appService.GetByIdAsync` | `AdminLuxuryApp/ConfiguracionSistema/AsambleaChecklistTemplates/EndPoints/AsambleaChecklistTemplateEndpoints.cs` |
| POST | `/api/asamblea-checklist-template` | `appService.AddAsync` | `AdminLuxuryApp/ConfiguracionSistema/AsambleaChecklistTemplates/EndPoints/AsambleaChecklistTemplateEndpoints.cs` |
| PUT | `/api/asamblea-checklist-template/{id:guid}` | `appService.UpdateAsync` | `AdminLuxuryApp/ConfiguracionSistema/AsambleaChecklistTemplates/EndPoints/AsambleaChecklistTemplateEndpoints.cs` |
| DELETE | `/api/asamblea-checklist-template/{id:guid}` | `appService.DeleteByIdAsync` | `AdminLuxuryApp/ConfiguracionSistema/AsambleaChecklistTemplates/EndPoints/AsambleaChecklistTemplateEndpoints.cs` |

#### Modulo: Customers

- Interfaces: 8 | Servicios: 10 | Endpoints: 32 | DTOs: 18

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| ICustomerAddressAppService | 2 | `AdminLuxuryApp/Customers/CustomerAddress/Interfaces/ICustomerAddressAppService.cs` |
| ICustomerDataCompanyAppService | 5 | `AdminLuxuryApp/Customers/CustomerDataCompany/Interfaces/ICustomerDataCompanyAppService.cs` |
| ICustomerImageAppService | 4 | `AdminLuxuryApp/Customers/CustomerImage/Interfaces/ICustomerImageAppService.cs` |
| ICustomerLocationAppService | 5 | `AdminLuxuryApp/Customers/CustomerLocations/Interfaces/ICustomerLocationAppService.cs` |
| ICustomerModulAppService | 5 | `AdminLuxuryApp/Customers/CustomerModul/Interfaces/ICustomerModulAppService.cs` |
| ICustomerAppService | 6 | `AdminLuxuryApp/Customers/Customers/Interfaces/ICustomerAppService.cs` |
| IDataCustomerAppService | 2 | `AdminLuxuryApp/Customers/Customers/Interfaces/IDataCustomerAppService.cs` |
| IModuleAppAppService | 5 | `AdminLuxuryApp/Customers/ModuleApps/Interfaces/IModuleAppAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| CustomerAddressAppService | 2 | `AdminLuxuryApp/Customers/CustomerAddress/Services/CustomerAddressAppService.cs` |
| CustomerDataCompanyAppService | 5 | `AdminLuxuryApp/Customers/CustomerDataCompany/Services/CustomerDataCompanyAppService.cs` |
| CustomerImageAppService | 4 | `AdminLuxuryApp/Customers/CustomerImage/Services/CustomerImageAppService.cs` |
| CustomerLocationMapper | 4 | `AdminLuxuryApp/Customers/CustomerLocations/Mapping/CustomerLocationMapper.cs` |
| CustomerLocationAppService | 5 | `AdminLuxuryApp/Customers/CustomerLocations/Services/CustomerLocationAppService.cs` |
| CustomerModulAppService | 5 | `AdminLuxuryApp/Customers/CustomerModul/Services/CustomerModulAppService.cs` |
| CustomerProvider | 0 | `AdminLuxuryApp/Customers/Customers/Entities/CustomerProvider.cs` |
| CustomerMapper | 0 | `AdminLuxuryApp/Customers/Customers/Mapping/CustomerMapper.cs` |
| CustomerAppService | 7 | `AdminLuxuryApp/Customers/Customers/Services/CustomerAppService.cs` |
| ModuleAppAppService | 5 | `AdminLuxuryApp/Customers/ModuleApps/Services/ModuleAppAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetByCustomerIdAsync | ICustomerAddressAppService | GET_LIST | `Task<ApiResponseDTO<CustomerAddressAddOrEdi…` | `Guid customerId` |
| UpdateAsync | ICustomerAddressAppService | UPDATE | `Task<ApiResponseDTO<CustomerAddressAddOrEdi…` | `CustomerAddressAddOrEditDTO DTO` |
| GetAllAsync | ICustomerDataCompanyAppService | GET_LIST | `Task<ApiResponseDTO<List<CustomerDataCompan…` | `-` |
| GetByIdAsync | ICustomerDataCompanyAppService | GET_SINGLE | `Task<ApiResponseDTO<CustomerDataCompanyAddO…` | `Guid id` |
| AddAsync | ICustomerDataCompanyAppService | CREATE | `Task<ApiResponseDTO<CustomerDataCompanyDTO>>` | `CustomerDataCompanyAddOrEditDTO dto` |
| UpdateAsync | ICustomerDataCompanyAppService | UPDATE | `Task<ApiResponseDTO<CustomerDataCompanyDTO>>` | `Guid id, CustomerDataCompanyAddOrEditDTO dto` |
| DeleteAsync | ICustomerDataCompanyAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetByCustomerIdAsync | ICustomerImageAppService | GET_LIST | `Task<ApiResponseDTO<CustomerImageDTO[]>>` | `Guid customerId` |
| AddAsync | ICustomerImageAppService | CREATE | `Task<ApiResponseDTO<CustomerImageDTO>>` | `CustomerImageAddDTO DTO` |
| AddBulkAsync | ICustomerImageAppService | CREATE | `Task<ApiResponseDTO<CustomerImageDTO[]>>` | `CustomerImagesBulkAddDTO DTO` |
| DeleteAsync | ICustomerImageAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetByCustomerIdAsync | ICustomerLocationAppService | GET_LIST | `Task<ApiResponseDTO<CustomerLocationDTO[]>>` | `Guid customerId` |
| GetByIdAsync | ICustomerLocationAppService | GET_SINGLE | `Task<ApiResponseDTO<CustomerLocationDTO>>` | `Guid id` |
| AddAsync | ICustomerLocationAppService | CREATE | `Task<ApiResponseDTO<CustomerLocationDTO>>` | `CustomerLocationAddOrEditDTO dto` |
| UpdateAsync | ICustomerLocationAppService | UPDATE | `Task<ApiResponseDTO<CustomerLocationDTO>>` | `Guid id, CustomerLocationAddOrEditDTO dto` |
| DeleteAsync | ICustomerLocationAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| ListAsync | ICustomerModulAppService | GET_LIST | `Task<ApiResponseDTO<List<ModulePermissionDT…` | `Guid customerId` |
| GetCustomerModulAsync | ICustomerModulAppService | GET_LIST | `Task<ApiResponseDTO<List<CustomerModulListD…` | `bool state` |
| GetCustomerModulesAsync | ICustomerModulAppService | GET_LIST | `Task<ApiResponseDTO<List<ModuleGroupDTO>>>` | `Guid customerId` |
| UpdateModuleStatusAsync | ICustomerModulAppService | UPDATE | `Task<ApiResponseDTO<bool>>` | `UpdateModuleStatusDTO DTO` |
| GetActiveModulesForCustomerAsync | ICustomerModulAppService | GET_LIST | `Task<ApiResponseDTO<List<ActiveModulesForCu…` | `Guid customerId` |
| GetByIdAsync | ICustomerAppService | GET_SINGLE | `Task<ApiResponseDTO<CustomerDTO>>` | `Guid id` |
| GetAllAsync | ICustomerAppService | GET_LIST | `Task<ApiResponseDTO<CustomerDTO[]>>` | `bool stateId` |
| AddAsync | ICustomerAppService | CREATE | `Task<ApiResponseDTO<CustomerDTO>>` | `CustomerAddOrEditDTO DTO, IFormFile photo` |
| UpdateAsync | ICustomerAppService | UPDATE | `Task<ApiResponseDTO<CustomerDTO>>` | `Guid id, CustomerAddOrEditDTO DTO, IFormFile photo` |
| DeleteAsync | ICustomerAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid customerId` |
| GetPointMapsAsync | ICustomerAppService | GET_LIST | `Task<ApiResponseDTO<List<object>>>` | `-` |
| GetDataEmailCondominos | IDataCustomerAppService | GET_LIST | `Task<List<string>>` | `Guid customerId` |
| GetDataEmailComite | IDataCustomerAppService | GET_LIST | `Task<List<string>>` | `Guid customerId` |
| GetAllAsync | IModuleAppAppService | GET_LIST | `Task<ApiResponseDTO<List<ModuleAppDTO>>>` | `-` |
| GetByIdAsync | IModuleAppAppService | GET_SINGLE | `Task<ApiResponseDTO<ModuleAppGetDTO>>` | `Guid id` |
| CreateAsync | IModuleAppAppService | CREATE | `Task<ApiResponseDTO<ModuleAppDTO>>` | `ModuleAppCreateOrUpdateDTO DTO` |
| UpdateAsync | IModuleAppAppService | UPDATE | `Task<ApiResponseDTO<ModuleAppDTO>>` | `Guid id, ModuleAppCreateOrUpdateDTO DTO` |
| DeleteAsync | IModuleAppAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/customer-addresses/{customerId:guid}` | `appService.GetByCustomerIdAsync` | `AdminLuxuryApp/Customers/CustomerAddress/EndPoints/CustomerAddressesEndPoints.cs` |
| PUT | `/api/customer-addresses` | `appService.UpdateAsync` | `AdminLuxuryApp/Customers/CustomerAddress/EndPoints/CustomerAddressesEndPoints.cs` |
| GET | `/api/customer-data-company` | `appService.GetAllAsync` | `AdminLuxuryApp/Customers/CustomerDataCompany/EndPoints/CustomerDataCompanyEndPoints.cs` |
| GET | `/api/customer-data-company/{id:guid}` | `appService.GetByIdAsync` | `AdminLuxuryApp/Customers/CustomerDataCompany/EndPoints/CustomerDataCompanyEndPoints.cs` |
| POST | `/api/customer-data-company` | `appService.AddAsync` | `AdminLuxuryApp/Customers/CustomerDataCompany/EndPoints/CustomerDataCompanyEndPoints.cs` |
| PUT | `/api/customer-data-company/{id:guid}` | `appService.UpdateAsync` | `AdminLuxuryApp/Customers/CustomerDataCompany/EndPoints/CustomerDataCompanyEndPoints.cs` |
| DELETE | `/api/customer-data-company/{id:guid}` | `appService.DeleteAsync` | `AdminLuxuryApp/Customers/CustomerDataCompany/EndPoints/CustomerDataCompanyEndPoints.cs` |
| GET | `/api/customer-locations/customer/{customerId:guid}` | `appService.GetByCustomerIdAsync` | `AdminLuxuryApp/Customers/CustomerLocations/EndPoints/CustomerLocationsEndpoints.cs` |
| GET | `/api/customer-locations/{id:guid}` | `appService.GetByIdAsync` | `AdminLuxuryApp/Customers/CustomerLocations/EndPoints/CustomerLocationsEndpoints.cs` |
| POST | `/api/customer-locations` | `appService.AddAsync` | `AdminLuxuryApp/Customers/CustomerLocations/EndPoints/CustomerLocationsEndpoints.cs` |
| PUT | `/api/customer-locations/{id:guid}` | `appService.UpdateAsync` | `AdminLuxuryApp/Customers/CustomerLocations/EndPoints/CustomerLocationsEndpoints.cs` |
| DELETE | `/api/customer-locations/{id:guid}` | `appService.DeleteAsync` | `AdminLuxuryApp/Customers/CustomerLocations/EndPoints/CustomerLocationsEndpoints.cs` |
| GET | `/api/module-app-customers/{customerId:guid}/permissions` | `appService.ListAsync` | `AdminLuxuryApp/Customers/CustomerModul/EndPoints/CustomerModulEndPoints.cs` |
| GET | `/api/module-app-customers/customers/{state:bool}` | `appService.GetCustomerModulAsync` | `AdminLuxuryApp/Customers/CustomerModul/EndPoints/CustomerModulEndPoints.cs` |
| GET | `/api/module-app-customers/customer/{customerId:guid}` | `appService.GetCustomerModulesAsync` | `AdminLuxuryApp/Customers/CustomerModul/EndPoints/CustomerModulEndPoints.cs` |
| POST | `/api/module-app-customers/update-module-status` | `appService.UpdateModuleStatusAsync` | `AdminLuxuryApp/Customers/CustomerModul/EndPoints/CustomerModulEndPoints.cs` |
| GET | `/api/module-app-customers/customer/{customerId:guid}/active-modules` | `appService.GetActiveModulesForCustomerAsync` | `AdminLuxuryApp/Customers/CustomerModul/EndPoints/CustomerModulEndPoints.cs` |
| GET | `/api/customer-images/{customerId:guid}` | `appService.GetByCustomerIdAsync` | `AdminLuxuryApp/Customers/Customers/EndPoints/CustomerImagesEndpoints.cs` |
| POST | `/api/customer-images` | `appService.AddAsync` | `AdminLuxuryApp/Customers/Customers/EndPoints/CustomerImagesEndpoints.cs` |
| POST | `/api/customer-images/bulk` | `appService.AddBulkAsync` | `AdminLuxuryApp/Customers/Customers/EndPoints/CustomerImagesEndpoints.cs` |
| DELETE | `/api/customer-images/{id:guid}` | `appService.DeleteAsync` | `AdminLuxuryApp/Customers/Customers/EndPoints/CustomerImagesEndpoints.cs` |
| GET | `/api/customers/{id:guid}` | `appService.GetByIdAsync` | `AdminLuxuryApp/Customers/Customers/EndPoints/CustomersEndpoints.cs` |
| GET | `/api/customers/list/{stateId:bool}` | `appService.GetAllAsync` | `AdminLuxuryApp/Customers/Customers/EndPoints/CustomersEndpoints.cs` |
| POST | `/api/customers` | `appService.AddAsync` | `AdminLuxuryApp/Customers/Customers/EndPoints/CustomersEndpoints.cs` |
| PUT | `/api/customers/{id:guid}` | `appService.UpdateAsync` | `AdminLuxuryApp/Customers/Customers/EndPoints/CustomersEndpoints.cs` |
| DELETE | `/api/customers/{id:guid}` | `appService.DeleteAsync` | `AdminLuxuryApp/Customers/Customers/EndPoints/CustomersEndpoints.cs` |
| GET | `/api/customers/point-maps` | `appService.GetPointMapsAsync` | `AdminLuxuryApp/Customers/Customers/EndPoints/CustomersEndpoints.cs` |
| GET | `/api/module-apps` | `appService.GetAllAsync` | `AdminLuxuryApp/Customers/ModuleApps/EndPoints/ModuleAppEndPoints.cs` |
| GET | `/api/module-apps/{id:guid}` | `appService.GetByIdAsync` | `AdminLuxuryApp/Customers/ModuleApps/EndPoints/ModuleAppEndPoints.cs` |
| POST | `/api/module-apps` | `appService.CreateAsync` | `AdminLuxuryApp/Customers/ModuleApps/EndPoints/ModuleAppEndPoints.cs` |
| PUT | `/api/module-apps/{id:guid}` | `appService.UpdateAsync` | `AdminLuxuryApp/Customers/ModuleApps/EndPoints/ModuleAppEndPoints.cs` |
| DELETE | `/api/module-apps/{id:guid}` | `appService.DeleteAsync` | `AdminLuxuryApp/Customers/ModuleApps/EndPoints/ModuleAppEndPoints.cs` |

#### Modulo: Infraestructura

- Interfaces: 5 | Servicios: 4 | Endpoints: 22 | DTOs: 5

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IEmployeeDataValidationService | 1 | `AdminLuxuryApp/Infraestructura/AppImplementationTracking/EmployeeDataValidation/Interfaces/IEmployeeDataValidationService.cs` |
| IMenuItemsAppService | 1 | `AdminLuxuryApp/Infraestructura/AppImplementationTracking/MenuItems/Interfaces/IMenuItemsAppService.cs` |
| IOrgStructureValidationService | 1 | `AdminLuxuryApp/Infraestructura/AppImplementationTracking/OrgStructureValidation/Interfaces/IOrgStructureValidationService.cs` |
| IJobService | 1 | `AdminLuxuryApp/Infraestructura/Jobs/Interfaces/IJobService.cs` |
| IUpdateDataBaseService | 11 | `AdminLuxuryApp/Infraestructura/UpdateDataBase/Interfaces/IUpdateDataBaseService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| EmployeeDataValidationService | 1 | `AdminLuxuryApp/Infraestructura/AppImplementationTracking/EmployeeDataValidation/Services/EmployeeDataValidationService.cs` |
| MenuItemsAppService | 1 | `AdminLuxuryApp/Infraestructura/AppImplementationTracking/MenuItems/Services/MenuItemsAppService.cs` |
| OrgStructureValidationService | 1 | `AdminLuxuryApp/Infraestructura/AppImplementationTracking/OrgStructureValidation/Services/OrgStructureValidationService.cs` |
| UpdateDataBaseAppService | 11 | `AdminLuxuryApp/Infraestructura/UpdateDataBase/Services/UpdateDataBaseService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetMissingDataReportAsync | IEmployeeDataValidationService | GET_LIST | `Task<ApiResponseDTO<List<EmployeeMissingDat…` | `Guid customerId` |
| GetModuleCustomAsync | IMenuItemsAppService | GET_LIST | `Task<ApiResponseDTO<List<MenuItemDTO>>>` | `Guid customerId` |
| GetMissingOrgStructureReportAsync | IOrgStructureValidationService | GET_LIST | `Task<ApiResponseDTO<List<WorkPositionMissin…` | `Guid customerId` |
| ExecuteAsync | IJobService | SPECIAL | `Task` | `-` |
| CapitalizeUserNamesAsync | IUpdateDataBaseService | OTHER | `Task<ApiResponseDTO<object>>` | `-` |
| ImportAsambleaChecklistCatalogAsync | IUpdateDataBaseService | SPECIAL | `Task<ApiResponseDTO<object>>` | `-` |
| BackfillAgendaEventsFromMeetingsAsync | IUpdateDataBaseService | SPECIAL | `Task<ApiResponseDTO<object>>` | `-` |
| BackfillHistoricalMeetingTimesAsync | IUpdateDataBaseService | SPECIAL | `Task<ApiResponseDTO<object>>` | `-` |
| ResyncGoogleCalendarEventTimesAsync | IUpdateDataBaseService | SPECIAL | `Task<ApiResponseDTO<object>>` | `-` |
| SeedNativeCollectionTestDataAsync | IUpdateDataBaseService | SPECIAL | `Task<ApiResponseDTO<object>>` | `SeedNativeCollectionTestDataRequestDTO dto` |
| ReseedNativeChargeTypeCatalogsAsync | IUpdateDataBaseService | SPECIAL | `Task<ApiResponseDTO<object>>` | `-` |
| SeedRecruitmentSourcesAsync | IUpdateDataBaseService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `-` |
| SeedDocumentCatalogsAsync | IUpdateDataBaseService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `-` |
| RetroactiveAssignEmployeeRolesAsync | IUpdateDataBaseService | OTHER | `Task<ApiResponseDTO<object>>` | `-` |
| RecalculateWorkPositionFoliosAsync | IUpdateDataBaseService | SPECIAL | `Task<ApiResponseDTO<object>>` | `-` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| POST | `/api/app-implementation-tracking/trigger-employee-validation` | `job.ExecuteAsync` | `AdminLuxuryApp/Infraestructura/AppImplementationTracking/EndPoints/AppImplementationTrackingEndpoints.cs` |
| GET | `/api/menu-items/{customerId:guid}` | `appService.GetModuleCustomAsync` | `AdminLuxuryApp/Infraestructura/AppImplementationTracking/MenuItems/EndPoints/MenuItemsEndPoints.cs` |
| GET | `/api/admin/realtime-diagnostics/test-connection` | - | `AdminLuxuryApp/Infraestructura/SignalRTest/EndPoints/TestSignalREndpoints.cs` |
| POST | `/api/admin/realtime-diagnostics/sendtestmessage` | - | `AdminLuxuryApp/Infraestructura/SignalRTest/EndPoints/TestSignalREndpoints.cs` |
| POST | `/api/admin/realtime-diagnostics/send-to-group/{groupName}` | - | `AdminLuxuryApp/Infraestructura/SignalRTest/EndPoints/TestSignalREndpoints.cs` |
| POST | `/api/admin/realtime-diagnostics/broadcast` | `All.SendAsync` | `AdminLuxuryApp/Infraestructura/SignalRTest/EndPoints/TestSignalREndpoints.cs` |
| POST | `/api/admin/realtime-diagnostics/sendmessage` | `All.SendAsync` | `AdminLuxuryApp/Infraestructura/SignalRTest/EndPoints/TestSignalREndpoints.cs` |
| POST | `/api/admin/realtime-diagnostics/sendmessagetouser` | `All.SendAsync` | `AdminLuxuryApp/Infraestructura/SignalRTest/EndPoints/TestSignalREndpoints.cs` |
| POST | `/api/admin/realtime-diagnostics/sendannouncement` | `All.SendAsync` | `AdminLuxuryApp/Infraestructura/SignalRTest/EndPoints/TestSignalREndpoints.cs` |
| POST | `/api/admin/system-maintenance/capitalize-user-names` | `updateDataBaseService.CapitalizeUserNamesAsync` | `AdminLuxuryApp/Infraestructura/UpdateDataBase/EndPoints/UpdateDataBaseEndpoints.cs` |
| POST | `/api/admin/system-maintenance/import-asamblea-checklist-catalog` | `updateDataBaseService.ImportAsambleaChecklistCatalogAsync` | `AdminLuxuryApp/Infraestructura/UpdateDataBase/EndPoints/UpdateDataBaseEndpoints.cs` |
| POST | `/api/admin/system-maintenance/backfill-agenda-events-from-meetings` | `updateDataBaseService.BackfillAgendaEventsFromMeetingsAsync` | `AdminLuxuryApp/Infraestructura/UpdateDataBase/EndPoints/UpdateDataBaseEndpoints.cs` |
| POST | `/api/admin/system-maintenance/backfill-historical-meeting-times` | `updateDataBaseService.BackfillHistoricalMeetingTimesAsync` | `AdminLuxuryApp/Infraestructura/UpdateDataBase/EndPoints/UpdateDataBaseEndpoints.cs` |
| POST | `/api/admin/system-maintenance/resync-google-calendar-event-times` | `updateDataBaseService.ResyncGoogleCalendarEventTimesAsync` | `AdminLuxuryApp/Infraestructura/UpdateDataBase/EndPoints/UpdateDataBaseEndpoints.cs` |
| POST | `/api/admin/system-maintenance/seed-native-collection-test-data` | `updateDataBaseService.SeedNativeCollectionTestDataAsync` | `AdminLuxuryApp/Infraestructura/UpdateDataBase/EndPoints/UpdateDataBaseEndpoints.cs` |
| POST | `/api/admin/system-maintenance/reseed-native-charge-type-catalogs` | `updateDataBaseService.ReseedNativeChargeTypeCatalogsAsync` | `AdminLuxuryApp/Infraestructura/UpdateDataBase/EndPoints/UpdateDataBaseEndpoints.cs` |
| POST | `/api/admin/system-maintenance/seed-recruitment-sources` | `updateDataBaseService.SeedRecruitmentSourcesAsync` | `AdminLuxuryApp/Infraestructura/UpdateDataBase/EndPoints/UpdateDataBaseEndpoints.cs` |
| POST | `/api/admin/system-maintenance/seed-documents` | `updateDataBaseService.SeedDocumentCatalogsAsync` | `AdminLuxuryApp/Infraestructura/UpdateDataBase/EndPoints/UpdateDataBaseEndpoints.cs` |
| POST | `/api/admin/system-maintenance/retroactive-assign-employee-roles` | `updateDataBaseService.RetroactiveAssignEmployeeRolesAsync` | `AdminLuxuryApp/Infraestructura/UpdateDataBase/EndPoints/UpdateDataBaseEndpoints.cs` |
| POST | `/api/admin/system-maintenance/recalculate-work-position-folios` | `updateDataBaseService.RecalculateWorkPositionFoliosAsync` | `AdminLuxuryApp/Infraestructura/UpdateDataBase/EndPoints/UpdateDataBaseEndpoints.cs` |
| GET | `/api/user-validation/search-existing-person/{namePerson}` | `appService.SearchExistingPersonAsync` | `AdminLuxuryApp/Infraestructura/UserValidation/EndPoints/UserValidationEndpoints.cs` |
| GET | `/api/user-validation/search-existing-phone/{phoneNumber}` | `appService.SearchExistingPhoneAsync` | `AdminLuxuryApp/Infraestructura/UserValidation/EndPoints/UserValidationEndpoints.cs` |

#### Modulo: SeguridadPermisos

- Interfaces: 4 | Servicios: 7 | Endpoints: 21 | DTOs: 14

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IApplicationRoleAppService | 6 | `AdminLuxuryApp/SeguridadPermisos/Access/ApplicationRole/Interfaces/IApplicationRoleAppService.cs` |
| IApprovalRulesAdminService | 2 | `AdminLuxuryApp/SeguridadPermisos/Access/ApprovalRules/Interfaces/IApprovalRulesAdminService.cs` |
| IModuleAppRolAppService | 4 | `AdminLuxuryApp/SeguridadPermisos/Access/ModuleAppRol/Interfaces/IModuleAppRolAppService.cs` |
| IUserAccountAppService | 13 | `AdminLuxuryApp/SeguridadPermisos/Access/UserAccounts/Interfaces/IUserAccountAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| ApplicationRoleMapper | 0 | `AdminLuxuryApp/SeguridadPermisos/Access/ApplicationRole/Mapping/ApplicationRoleMapper.cs` |
| ApplicationRoleAppService | 6 | `AdminLuxuryApp/SeguridadPermisos/Access/ApplicationRole/Services/ApplicationRoleAppService.cs` |
| ApprovalRulesAdminService | 2 | `AdminLuxuryApp/SeguridadPermisos/Access/ApprovalRules/Services/ApprovalRulesAdminService.cs` |
| UserRoleService | 1 | `AdminLuxuryApp/SeguridadPermisos/Access/Authorization/Services/UserRoleService.cs` |
| ModuleAppRolAppService | 4 | `AdminLuxuryApp/SeguridadPermisos/Access/ModuleAppRol/Services/ModuleAppRolAppService.cs` |
| RoleAssignmentMatrixService | 2 | `AdminLuxuryApp/SeguridadPermisos/Access/RoleAssignment/Services/RoleAssignmentMatrixService.cs` |
| UserAccountAppService | 15 | `AdminLuxuryApp/SeguridadPermisos/Access/UserAccounts/Services/UserAccountAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetRole | IApplicationRoleAppService | GET_LIST | `Task<ApiResponseDTO<ApplicationRoleDTO>>` | `string roleId` |
| GetRoles | IApplicationRoleAppService | GET_LIST | `Task<ApiResponseDTO<List<ApplicationRolesDT…` | `-` |
| CreateRole | IApplicationRoleAppService | CREATE | `Task<ApiResponseDTO<bool>>` | `CreateUpdateApplicationRoleDTO DTO` |
| UpdateRole | IApplicationRoleAppService | UPDATE | `Task<ApiResponseDTO<bool>>` | `string id, CreateUpdateApplicationRoleDTO DTO` |
| DeleteRole | IApplicationRoleAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `string id` |
| CreateRoles | IApplicationRoleAppService | CREATE | `Task` | `-` |
| GetMatrixAsync | IApprovalRulesAdminService | GET_LIST | `Task<ApiResponseDTO<ApprovalMatrixDTO>>` | `-` |
| UpdateMatrixAsync | IApprovalRulesAdminService | UPDATE | `Task<ApiResponseDTO<bool>>` | `UpdateApprovalRulesDTO dto` |
| ListRoleAsync | IModuleAppRolAppService | GET_LIST | `Task<ApiResponseDTO<List<ModuleAppRolDTO>>>` | `-` |
| ListModuleAsync | IModuleAppRolAppService | GET_LIST | `Task<ApiResponseDTO<List<ModuleAppDTO>>>` | `-` |
| AssignmentsAsync | IModuleAppRolAppService | OTHER | `Task<ApiResponseDTO<List<ModuleGroupRolDTO>…` | `string roleId` |
| UpdateModuleAppRolAssignedAsync | IModuleAppRolAppService | UPDATE | `Task<ApiResponseDTO<bool>>` | `UpdateModuleAppRolAssignedDTO DTO` |
| CreateAccountAsync | IUserAccountAppService | CREATE | `Task<ApiResponseDTO<ApplicationUserDTO>>` | `ApplicationUserCreateDTO DTO` |
| GetByIdAsync | IUserAccountAppService | GET_SINGLE | `Task<ApiResponseDTO<ApplicationUserCreateDT…` | `string applicationUserId` |
| UpdateAccountAsync | IUserAccountAppService | UPDATE | `Task<ApiResponseDTO<ApplicationUserDTO>>` | `string applicationUserId, ApplicationUserCreateDTO DTO` |
| DeleteAccountAndRelationsAsync | IUserAccountAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `string applicationUserId` |
| AddRoleToUser | IUserAccountAppService | CREATE | `Task<ApiResponseDTO<bool>>` | `AddApplicationRoleToUserDTO roleDTO, string applicationUser…` |
| ToBlockAccountAsync | IUserAccountAppService | OTHER | `Task<ApiResponseDTO<bool>>` | `string id` |
| ToUnlockAccountAsync | IUserAccountAppService | OTHER | `Task<ApiResponseDTO<bool>>` | `string id` |
| GetAllRoleAccount | IUserAccountAppService | GET_LIST | `Task<ApiResponseDTO<List<AddApplicationRole…` | `string applicationUserId, RoleType? allowedRoleType` |
| GetAllAsync | IUserAccountAppService | GET_LIST | `Task<ApiResponseDTO<List<ApplicationUserDTO…` | `Guid customerId, bool state, TypePerson? typePerson` |
| GetAllAsync | IUserAccountAppService | GET_LIST | `Task<ApiResponseDTO<List<ApplicationUserDTO…` | `bool state, TypePerson? typePerson` |
| SearchExistingPhoneAsync | IUserAccountAppService | GET_LIST | `Task<ApiResponseDTO<List<string>>>` | `string phoneNumber` |
| SearchExistingPersonAsync | IUserAccountAppService | GET_LIST | `Task<ApiResponseDTO<List<string>>>` | `string namePerson` |
| ExistsApplicationUserUserNameAsync | IUserAccountAppService | GET_SINGLE | `Task<ApiResponseDTO<bool>>` | `string userName` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/application-roles/{roleId}` | - | `AdminLuxuryApp/SeguridadPermisos/Access/ApplicationRole/EndPoints/ApplicationRolesEndPoints.cs` |
| GET | `/api/application-roles` | - | `AdminLuxuryApp/SeguridadPermisos/Access/ApplicationRole/EndPoints/ApplicationRolesEndPoints.cs` |
| POST | `/api/application-roles` | - | `AdminLuxuryApp/SeguridadPermisos/Access/ApplicationRole/EndPoints/ApplicationRolesEndPoints.cs` |
| PUT | `/api/application-roles/{id}` | - | `AdminLuxuryApp/SeguridadPermisos/Access/ApplicationRole/EndPoints/ApplicationRolesEndPoints.cs` |
| DELETE | `/api/application-roles/{id}` | - | `AdminLuxuryApp/SeguridadPermisos/Access/ApplicationRole/EndPoints/ApplicationRolesEndPoints.cs` |
| GET | `/api/approval-rules/matrix` | `service.GetMatrixAsync` | `AdminLuxuryApp/SeguridadPermisos/Access/ApprovalRules/EndPoints/ApprovalRulesEndPoints.cs` |
| PUT | `/api/approval-rules/matrix` | `service.UpdateMatrixAsync` | `AdminLuxuryApp/SeguridadPermisos/Access/ApprovalRules/EndPoints/ApprovalRulesEndPoints.cs` |
| GET | `/api/module-app-roles/list-role` | `appService.ListRoleAsync` | `AdminLuxuryApp/SeguridadPermisos/Access/ModuleAppRol/EndPoints/ModuleAppRolEndPoints.cs` |
| GET | `/api/module-app-roles/list-module` | `appService.ListModuleAsync` | `AdminLuxuryApp/SeguridadPermisos/Access/ModuleAppRol/EndPoints/ModuleAppRolEndPoints.cs` |
| GET | `/api/module-app-roles/assignments/{roleId}` | `appService.AssignmentsAsync` | `AdminLuxuryApp/SeguridadPermisos/Access/ModuleAppRol/EndPoints/ModuleAppRolEndPoints.cs` |
| POST | `/api/module-app-roles/update-module-app-rol-assigned` | `appService.UpdateModuleAppRolAssignedAsync` | `AdminLuxuryApp/SeguridadPermisos/Access/ModuleAppRol/EndPoints/ModuleAppRolEndPoints.cs` |
| POST | `/api/admin/user-accounts/create-account` | `appService.CreateAccountAsync` | `AdminLuxuryApp/SeguridadPermisos/Access/UserAccounts/EndPoints/UserAccountEndpoints.cs` |
| GET | `/api/admin/user-accounts/{applicationUserId}` | `appService.GetByIdAsync` | `AdminLuxuryApp/SeguridadPermisos/Access/UserAccounts/EndPoints/UserAccountEndpoints.cs` |
| PUT | `/api/admin/user-accounts/update-account/{applicationUserId}` | `appService.UpdateAccountAsync` | `AdminLuxuryApp/SeguridadPermisos/Access/UserAccounts/EndPoints/UserAccountEndpoints.cs` |
| DELETE | `/api/admin/user-accounts/delete/{applicationUserId}` | `appService.DeleteAccountAndRelationsAsync` | `AdminLuxuryApp/SeguridadPermisos/Access/UserAccounts/EndPoints/UserAccountEndpoints.cs` |
| POST | `/api/admin/user-accounts/add-role-to-user/{applicationUserId}` | `appService.ToBlockAccountAsync` | `AdminLuxuryApp/SeguridadPermisos/Access/UserAccounts/EndPoints/UserAccountEndpoints.cs` |
| GET | `/api/admin/user-accounts/to-block-account/{id}` | `appService.ToBlockAccountAsync` | `AdminLuxuryApp/SeguridadPermisos/Access/UserAccounts/EndPoints/UserAccountEndpoints.cs` |
| GET | `/api/admin/user-accounts/to-unlock-account/{id}` | `appService.ToUnlockAccountAsync` | `AdminLuxuryApp/SeguridadPermisos/Access/UserAccounts/EndPoints/UserAccountEndpoints.cs` |
| GET | `/api/admin/user-accounts/get-role/{applicationUserId}/{roleType?}` | `appService.GetAllAsync` | `AdminLuxuryApp/SeguridadPermisos/Access/UserAccounts/EndPoints/UserAccountEndpoints.cs` |
| GET | `/api/admin/user-accounts/list/{customerId:guid}/{state:bool}/{typePerson?}` | `appService.GetAllAsync` | `AdminLuxuryApp/SeguridadPermisos/Access/UserAccounts/EndPoints/UserAccountEndpoints.cs` |
| GET | `/api/admin/user-accounts/list/{state:bool}/{typePerson?}` | `appService.GetAllAsync` | `AdminLuxuryApp/SeguridadPermisos/Access/UserAccounts/EndPoints/UserAccountEndpoints.cs` |


### Grupo: AuthLuxuryApp

#### Modulo: AccountRecovery

- Interfaces: 2 | Servicios: 2 | Endpoints: 5 | DTOs: 4

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| ICredentialNotificationService | 1 | `AuthLuxuryApp/AccountRecovery/Interfaces/ICredentialNotificationService.cs` |
| IRecoveryAccountUserAppService | 5 | `AuthLuxuryApp/AccountRecovery/Interfaces/IRecoveryAccountUserAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| CredentialNotificationService | 1 | `AuthLuxuryApp/AccountRecovery/Services/CredentialNotificationService.cs` |
| RecoveryAccountUserAppService | 5 | `AuthLuxuryApp/AccountRecovery/Services/RecoveryAccountUserAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| SendInitialCredentialsAsync | ICredentialNotificationService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `CredentialNotificationRequestDTO request` |
| SendMailRecoverPasswordAsync | IRecoveryAccountUserAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `ApplicationUser user, string email` |
| SendNewPasswordForEmailAsync | IRecoveryAccountUserAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `string applicationUserId` |
| SendNewUserNameForEmailAsync | IRecoveryAccountUserAppService | SPECIAL | `Task<ApiResponseDTO<UserNameDTO>>` | `string applicationUserId` |
| InitiateRecoveryByCodeAsync | IRecoveryAccountUserAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `string identifier` |
| ValidateRecoveryCodeAsync | IRecoveryAccountUserAppService | SPECIAL | `Task<ApiResponseDTO<ValidateRecoveryCodeRes…` | `string identifier, string code` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| POST | `/api/auth/account-recovery/send-mail-recover-password` | `userManager.FindByEmailAsync` | `AuthLuxuryApp/AccountRecovery/EndPoints/ApplicationUserAccountRecoveryEndpoints.cs` |
| GET | `/api/auth/account-recovery/send-new-user-name-for-email/{applicationUserId}` | `recoveryAccountUserAppService.SendNewUserNameForEmailAsync` | `AuthLuxuryApp/AccountRecovery/EndPoints/ApplicationUserAccountRecoveryEndpoints.cs` |
| GET | `/api/auth/account-recovery/send-new-password-for-email/{applicationUserId}` | `recoveryAccountUserAppService.SendNewPasswordForEmailAsync` | `AuthLuxuryApp/AccountRecovery/EndPoints/ApplicationUserAccountRecoveryEndpoints.cs` |
| POST | `/api/auth/account-recovery/initiate-by-code` | `recoveryAccountUserAppService.InitiateRecoveryByCodeAsync` | `AuthLuxuryApp/AccountRecovery/EndPoints/ApplicationUserAccountRecoveryEndpoints.cs` |
| POST | `/api/auth/account-recovery/validate-code` | `recoveryAccountUserAppService.ValidateRecoveryCodeAsync` | `AuthLuxuryApp/AccountRecovery/EndPoints/ApplicationUserAccountRecoveryEndpoints.cs` |

#### Modulo: Auth

- Interfaces: 5 | Servicios: 6 | Endpoints: 7 | DTOs: 10

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IAccesoCustomersAppService | 2 | `AuthLuxuryApp/Auth/AccesoCustomers/Interfaces/IAccesoCustomersAppService.cs` |
| IAuthAppService | 5 | `AuthLuxuryApp/Auth/Interfaces/IAuthAppService.cs` |
| IJwtService | 0 | `AuthLuxuryApp/Auth/Interfaces/IJwtService.cs` |
| IPersonDataAppService | 2 | `AuthLuxuryApp/Auth/Interfaces/IPersonDataAppService.cs` |
| IUserConnectionStatusService | 1 | `AuthLuxuryApp/Auth/Interfaces/IUserConnectionStatusService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| AccesoCustomersAppService | 2 | `AuthLuxuryApp/Auth/AccesoCustomers/Services/AccesoCustomersAppService.cs` |
| ApplicationUserMapper | 0 | `AuthLuxuryApp/Auth/Mapping/ApplicationUserMapper.cs` |
| AuthAppService | 5 | `AuthLuxuryApp/Auth/Services/AuthAppService.cs` |
| JwtService | 1 | `AuthLuxuryApp/Auth/Services/JwtService.cs` |
| PersonDataAppService | 2 | `AuthLuxuryApp/Auth/Services/PersonDataAppService.cs` |
| UserConnectionStatusService | 1 | `AuthLuxuryApp/Auth/Services/UserConnectionStatusService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetCustomersWithAccessStatus | IAccesoCustomersAppService | GET_LIST | `Task<ApiResponseDTO<List<AccesoCustomerDTO>…` | `string userId` |
| AddCustomerToUserAccount | IAccesoCustomersAppService | CREATE | `Task<ApiResponseDTO<bool>>` | `List<AccesoCustomerDTO> DTO, string userId` |
| LoginAsync | IAuthAppService | SPECIAL | `Task<ApiResponseDTO<UserTokenDTO>>` | `LoginDTO DTO, string ipAddress, string userAgent, string en…` |
| LogoutAsync | IAuthAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `string userId, string ipAddress, string userAgent, string e…` |
| RecoverPasswordAsync | IAuthAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `RecoverPasswordDTO DTO` |
| ConfirmRecoverPasswordAsync | IAuthAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `ConfirmRecoverPasswordDTO DTO` |
| SetRefreshTokenCookie | IAuthAppService | UPDATE | `void` | `string refreshToken` |
| EmployeeBirthdayAsync | IPersonDataAppService | OTHER | `Task<ApiResponseDTO<List<EmployeeBirthdayDT…` | `Guid customerId, int month` |
| UpsertAsync | IPersonDataAppService | UPDATE | `Task<ApiResponseDTO<PersonData>>` | `Guid employeeId, PersonDataEditDTO DTO` |
| UpdateStateUser | IUserConnectionStatusService | UPDATE | `Task` | `string applicationUserId, UserStatus UserStatus` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/auth/acceso-customers/get-customers/{id}` | - | `AuthLuxuryApp/Auth/EndPoints/AccesoCustomersEndPoints.cs` |
| POST | `/api/auth/acceso-customers/add-customer-acceso-to-user/{id}` | - | `AuthLuxuryApp/Auth/EndPoints/AccesoCustomersEndPoints.cs` |
| POST | `/api/auth/login` | `authAppService.LoginAsync` | `AuthLuxuryApp/Auth/EndPoints/AuthEndpoints.cs` |
| POST | `/api/auth/refresh` | `authAppService.RefreshTokenAsync` | `AuthLuxuryApp/Auth/EndPoints/AuthEndpoints.cs` |
| POST | `/api/auth/logout` | `authAppService.LogoutAsync` | `AuthLuxuryApp/Auth/EndPoints/AuthEndpoints.cs` |
| POST | `/api/auth/recover-password` | `authAppService.RecoverPasswordAsync` | `AuthLuxuryApp/Auth/EndPoints/AuthEndpoints.cs` |
| POST | `/api/auth/confirm-recover-password` | `authAppService.ConfirmRecoverPasswordAsync` | `AuthLuxuryApp/Auth/EndPoints/AuthEndpoints.cs` |

#### Modulo: Identity

- Interfaces: 0 | Servicios: 0 | Endpoints: 0 | DTOs: 0

#### Modulo: PasswordManager

- Interfaces: 1 | Servicios: 2 | Endpoints: 5 | DTOs: 2

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IPasswordAppService | 5 | `AuthLuxuryApp/PasswordManager/Interfaces/IPasswordAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| PasswordMappingProfile | 0 | `AuthLuxuryApp/PasswordManager/Mappers/PasswordMappingProfile.cs` |
| PasswordAppService | 5 | `AuthLuxuryApp/PasswordManager/Services/PasswordAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetCredentialsPagedAsync | IPasswordAppService | GET_LIST | `Task<ApiResponseDTO<PagedResultDTO<Credenti…` | `PaginationCommonDTO filter` |
| GetCredentialByIdAsync | IPasswordAppService | GET_SINGLE | `Task<ApiResponseDTO<CredentialDetailDTO>>` | `Guid id` |
| AddCredentialAsync | IPasswordAppService | CREATE | `Task<ApiResponseDTO<CredentialDetailDTO>>` | `CredentialAddOrEditDTO dto` |
| UpdateCredentialAsync | IPasswordAppService | UPDATE | `Task<ApiResponseDTO<CredentialDetailDTO>>` | `Guid id, CredentialAddOrEditDTO dto` |
| DeleteCredentialAsync | IPasswordAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/password-manager/credentials/filter` | `dataService.GetCredentialsPagedAsync` | `AuthLuxuryApp/PasswordManager/EndPoints/PasswordsEndpoints.cs` |
| GET | `/api/password-manager/credentials/{id:guid}` | `dataService.GetCredentialByIdAsync` | `AuthLuxuryApp/PasswordManager/EndPoints/PasswordsEndpoints.cs` |
| POST | `/api/password-manager/credentials` | `dataService.AddCredentialAsync` | `AuthLuxuryApp/PasswordManager/EndPoints/PasswordsEndpoints.cs` |
| PUT | `/api/password-manager/credentials/{id:guid}` | `dataService.UpdateCredentialAsync` | `AuthLuxuryApp/PasswordManager/EndPoints/PasswordsEndpoints.cs` |
| DELETE | `/api/password-manager/credentials/{id:guid}` | `dataService.DeleteCredentialAsync` | `AuthLuxuryApp/PasswordManager/EndPoints/PasswordsEndpoints.cs` |

#### Modulo: ProfileUsers

- Interfaces: 1 | Servicios: 1 | Endpoints: 2 | DTOs: 0

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IUserProfileAppService | 2 | `AuthLuxuryApp/ProfileUsers/Interfaces/IUserProfileAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| UserProfileAppService | 2 | `AuthLuxuryApp/ProfileUsers/Services/UserProfileAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| ChangePasswordAsync | IUserProfileAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `string applicationUserId, ChangePasswordDTO dto` |
| UpdateImageAsync | IUserProfileAppService | UPDATE | `Task<ApiResponseDTO<ImgPathFileCommonDTO>>` | `string applicationUserId, FileUploadCommonDTO fileUploadDTO` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| PUT | `/api/users/change-password/{applicationUserId}` | `dataService.ChangePasswordAsync` | `AuthLuxuryApp/ProfileUsers/EndPoints/UsersEndpoints.cs` |
| PUT | `/api/users/update-image/{applicationUserId}` | `dataService.UpdateImageAsync` | `AuthLuxuryApp/ProfileUsers/EndPoints/UsersEndpoints.cs` |


### Grupo: CobranzaLuxuryApp

#### Modulo: AspelCobranzaHausLive

- Interfaces: 2 | Servicios: 2 | Endpoints: 7 | DTOs: 2

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IAspelCobranzaHausAppService | 4 | `CobranzaLuxuryApp/AspelCobranzaHausLive/Interfaces/IAspelCobranzaHausAppService.cs` |
| IAspelCobranzaHausDetalleAppService | 2 | `CobranzaLuxuryApp/AspelCobranzaHausLive/Interfaces/IAspelCobranzaHausDetalleAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| AspelCobranzaHausAppService | 4 | `CobranzaLuxuryApp/AspelCobranzaHausLive/Services/AspelCobranzaHausAppService.cs` |
| AspelCobranzaHausDetalleAppService | 5 | `CobranzaLuxuryApp/AspelCobranzaHausLive/Services/AspelCobranzaHausDetalleAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetCustomersAsync | IAspelCobranzaHausAppService | GET_LIST | `Task<ApiResponseDTO<List<AspelCustomerRespo…` | `-` |
| GetAccountsByCustomerAsync | IAspelCobranzaHausAppService | GET_LIST | `Task<ApiResponseDTO<AspelAccountsByCustomer…` | `Guid customerId, int year` |
| GetEstadoCuentaRangoAsync | IAspelCobranzaHausAppService | GET_LIST | `Task<ApiResponseDTO<AspelEstadoCuentaRespon…` | `AspelEstadoCuentaRangoRequestDTO request` |
| GetDeudasActualesAsync | IAspelCobranzaHausAppService | GET_LIST | `Task<ApiResponseDTO<AspelDeudasActualesResp…` | `AspelDeudasActualesRequestDTO request` |
| GetDetalleCobranzaRangoAsync | IAspelCobranzaHausDetalleAppService | GET_LIST | `Task<ApiResponseDTO<AspelCobranzaDetalleRes…` | `AspelCobranzaDetalleRangoRequestDTO request` |
| GetDetalleCobranzaRangoAuditAsync | IAspelCobranzaHausDetalleAppService | GET_LIST | `Task<ApiResponseDTO<AspelCobranzaDetalleAud…` | `AspelCobranzaDetalleRangoRequestDTO request` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/aspel-cobranza/customers` | `aspelCobranzaHausAppService.GetCustomersAsync` | `CobranzaLuxuryApp/AspelCobranzaHausLive/EndPoints/AspelCobranzaEndPoints.cs` |
| GET | `/api/aspel-cobranza/accounts` | `aspelCobranzaHausAppService.GetAccountsByCustomerAsync` | `CobranzaLuxuryApp/AspelCobranzaHausLive/EndPoints/AspelCobranzaEndPoints.cs` |
| GET | `/api/aspel-cobranza/deudas-actuales` | `aspelCobranzaHausAppService.GetDeudasActualesAsync` | `CobranzaLuxuryApp/AspelCobranzaHausLive/EndPoints/AspelCobranzaEndPoints.cs` |
| GET | `/api/aspel-cobranza/detalle-cobranza-rango` | `aspelCobranzaHausDetalleAppService.GetDetalleCobranzaRangoAsync` | `CobranzaLuxuryApp/AspelCobranzaHausLive/EndPoints/AspelCobranzaEndPoints.cs` |
| GET | `/api/aspel-cobranza/detalle-cobranza-rango` | `aspelCobranzaHausDetalleAppService.GetDetalleCobranzaRangoAuditAsync` | `CobranzaLuxuryApp/AspelCobranzaHausLive/EndPoints/AspelCobranzaEndPoints.cs` |
| GET | `/api/aspel-cobranza/estado-cuenta-rango` | `aspelCobranzaHausAppService.GetEstadoCuentaRangoAsync` | `CobranzaLuxuryApp/AspelCobranzaHausLive/EndPoints/AspelCobranzaEndPoints.cs` |
| GET | `/api/aspel-cobranza/debug-cuotas-extra` | `contabilidadService.GetRawDataViaAspelApiAsync` | `CobranzaLuxuryApp/AspelCobranzaHausLive/EndPoints/AspelCobranzaEndPoints.cs` |

#### Modulo: AspelCobranzaHausLocal

- Interfaces: 2 | Servicios: 2 | Endpoints: 6 | DTOs: 1

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IAspelCobranzaHausLocalAppService | 5 | `CobranzaLuxuryApp/AspelCobranzaHausLocal/Interfaces/IAspelCobranzaHausLocalAppService.cs` |
| IAspelCobranzaHausLocalDetalleAppService | 1 | `CobranzaLuxuryApp/AspelCobranzaHausLocal/Interfaces/IAspelCobranzaHausLocalDetalleAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| AspelCobranzaHausLocalAppService | 5 | `CobranzaLuxuryApp/AspelCobranzaHausLocal/Services/AspelCobranzaHausLocalAppService.cs` |
| AspelCobranzaHausLocalDetalleAppService | 1 | `CobranzaLuxuryApp/AspelCobranzaHausLocal/Services/AspelCobranzaHausLocalDetalleAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetCustomersAsync | IAspelCobranzaHausLocalAppService | GET_LIST | `Task<ApiResponseDTO<List<AspelCobranzaHausL…` | `-` |
| GetAccountsByCustomerAsync | IAspelCobranzaHausLocalAppService | GET_LIST | `Task<ApiResponseDTO<AspelCobranzaHausLocalA…` | `Guid customerId, int year` |
| GetEstadoCuentaRangoAsync | IAspelCobranzaHausLocalAppService | GET_LIST | `Task<ApiResponseDTO<AspelCobranzaHausLocalE…` | `AspelCobranzaHausLocalEstadoCuentaRangoRequestDTO request` |
| GetDeudasActualesAsync | IAspelCobranzaHausLocalAppService | GET_LIST | `Task<ApiResponseDTO<AspelCobranzaHausLocalD…` | `AspelCobranzaHausLocalDeudasActualesRequestDTO request` |
| GetStatusAsync | IAspelCobranzaHausLocalAppService | GET_LIST | `Task<ApiResponseDTO<AspelCobranzaHausLocalS…` | `Guid customerId, int year` |
| GetDetalleCobranzaRangoAsync | IAspelCobranzaHausLocalDetalleAppService | GET_LIST | `Task<ApiResponseDTO<AspelCobranzaHausLocalC…` | `AspelCobranzaHausLocalCobranzaDetalleRangoRequestDTO request` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/cobranza/local/customers` | `aspelCobranzaHausLocalAppService.GetCustomersAsync` | `CobranzaLuxuryApp/AspelCobranzaHausLocal/EndPoints/AspelCobranzaHausLocalEndPoints.cs` |
| GET | `/api/cobranza/local/accounts` | `aspelCobranzaHausLocalAppService.GetAccountsByCustomerAsync` | `CobranzaLuxuryApp/AspelCobranzaHausLocal/EndPoints/AspelCobranzaHausLocalEndPoints.cs` |
| GET | `/api/cobranza/local/deudas-actuales` | `aspelCobranzaHausLocalAppService.GetDeudasActualesAsync` | `CobranzaLuxuryApp/AspelCobranzaHausLocal/EndPoints/AspelCobranzaHausLocalEndPoints.cs` |
| GET | `/api/cobranza/local/detalle-cobranza-rango` | `aspelCobranzaHausLocalDetalleAppService.GetDetalleCobranzaRangoAsync` | `CobranzaLuxuryApp/AspelCobranzaHausLocal/EndPoints/AspelCobranzaHausLocalEndPoints.cs` |
| GET | `/api/cobranza/local/estado-cuenta-rango` | `aspelCobranzaHausLocalAppService.GetEstadoCuentaRangoAsync` | `CobranzaLuxuryApp/AspelCobranzaHausLocal/EndPoints/AspelCobranzaHausLocalEndPoints.cs` |
| GET | `/api/cobranza/local/status` | `aspelCobranzaHausLocalAppService.GetStatusAsync` | `CobranzaLuxuryApp/AspelCobranzaHausLocal/EndPoints/AspelCobranzaHausLocalEndPoints.cs` |

#### Modulo: CobranzaNativa

- Interfaces: 29 | Servicios: 32 | Endpoints: 104 | DTOs: 69

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IAdjustmentService | 4 | `CobranzaLuxuryApp/CobranzaNativa/Core/Approvals/Interfaces/IAdjustmentService.cs` |
| IFinancialApprovalService | 6 | `CobranzaLuxuryApp/CobranzaNativa/Core/Approvals/Interfaces/IFinancialApprovalService.cs` |
| IFinancialAuditService | 3 | `CobranzaLuxuryApp/CobranzaNativa/Core/Audit/Interfaces/IFinancialAuditService.cs` |
| IChargeAppService | 9 | `CobranzaLuxuryApp/CobranzaNativa/Core/Charges/Interfaces/IChargeAppService.cs` |
| IChargesGeneratorService | 2 | `CobranzaLuxuryApp/CobranzaNativa/Core/Charges/Interfaces/IChargesGeneratorService.cs` |
| IChargeTypeCatalogAppService | 5 | `CobranzaLuxuryApp/CobranzaNativa/Core/ChargeTypes/Interfaces/IChargeTypeCatalogAppService.cs` |
| ICollectionCaseAppService | 4 | `CobranzaLuxuryApp/CobranzaNativa/Core/CollectionCases/Interfaces/ICollectionCaseAppService.cs` |
| ICollectionManagerService | 2 | `CobranzaLuxuryApp/CobranzaNativa/Core/CollectionCases/Interfaces/ICollectionManagerService.cs` |
| IPropertyFineAppService | 9 | `CobranzaLuxuryApp/CobranzaNativa/Core/Fines/Interfaces/IPropertyFineAppService.cs` |
| IRegulationArticleAppService | 5 | `CobranzaLuxuryApp/CobranzaNativa/Core/Fines/Interfaces/IRegulationArticleAppService.cs` |
| IInvoiceQueryAppService | 2 | `CobranzaLuxuryApp/CobranzaNativa/Core/Invoices/Interfaces/IInvoiceQueryAppService.cs` |
| IInvoiceService | 2 | `CobranzaLuxuryApp/CobranzaNativa/Core/Invoices/Interfaces/IInvoiceService.cs` |
| ILateFeeCalculatorService | 1 | `CobranzaLuxuryApp/CobranzaNativa/Core/LateFees/Interfaces/ILateFeeCalculatorService.cs` |
| ILateFeePolicyAppService | 5 | `CobranzaLuxuryApp/CobranzaNativa/Core/LateFees/Interfaces/ILateFeePolicyAppService.cs` |
| ILedgerIntegrityService | 2 | `CobranzaLuxuryApp/CobranzaNativa/Core/Ledger/Interfaces/ILedgerIntegrityService.cs` |
| ILedgerService | 6 | `CobranzaLuxuryApp/CobranzaNativa/Core/Ledger/Interfaces/ILedgerService.cs` |
| IPropertyMemberService | 11 | `CobranzaLuxuryApp/CobranzaNativa/Core/Members/Interfaces/IPropertyMemberService.cs` |
| ICobranzaMetricasService | 1 | `CobranzaLuxuryApp/CobranzaNativa/Core/Metrics/Interfaces/ICobranzaMetricasService.cs` |
| ICobranzaNativaNotificationService | 3 | `CobranzaLuxuryApp/CobranzaNativa/Core/Notifications/Interfaces/ICobranzaNativaNotificationService.cs` |
| INativeCollectionNotificationSettingsService | 3 | `CobranzaLuxuryApp/CobranzaNativa/Core/Notifications/Interfaces/INativeCollectionNotificationSettingsService.cs` |
| INativeCollectionRealTimeService | 2 | `CobranzaLuxuryApp/CobranzaNativa/Core/Notifications/Interfaces/INativeCollectionRealTimeService.cs` |
| INotificationEngineService | 1 | `CobranzaLuxuryApp/CobranzaNativa/Core/Notifications/Interfaces/INotificationEngineService.cs` |
| ICobranzaPaymentAppService | 4 | `CobranzaLuxuryApp/CobranzaNativa/Core/Payments/Interfaces/ICobranzaPaymentAppService.cs` |
| IPaymentAllocationService | 4 | `CobranzaLuxuryApp/CobranzaNativa/Core/Payments/Interfaces/IPaymentAllocationService.cs` |
| IWebhookHandlerService | 1 | `CobranzaLuxuryApp/CobranzaNativa/Core/Payments/Interfaces/IWebhookHandlerService.cs` |
| IPeriodClosureService | 5 | `CobranzaLuxuryApp/CobranzaNativa/Core/PeriodClosures/Interfaces/IPeriodClosureService.cs` |
| IReconciliationService | 2 | `CobranzaLuxuryApp/CobranzaNativa/Core/Reconciliation/Interfaces/IReconciliationService.cs` |
| INativeStatementService | 1 | `CobranzaLuxuryApp/CobranzaNativa/Core/Statements/Interfaces/INativeStatementService.cs` |
| IChargeTemplateAppService | 7 | `CobranzaLuxuryApp/CobranzaNativa/Core/Templates/Interfaces/IChargeTemplateAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| AdjustmentService | 4 | `CobranzaLuxuryApp/CobranzaNativa/Core/Approvals/Services/AdjustmentService.cs` |
| FinancialApprovalService | 6 | `CobranzaLuxuryApp/CobranzaNativa/Core/Approvals/Services/FinancialApprovalService.cs` |
| FinancialAuditService | 3 | `CobranzaLuxuryApp/CobranzaNativa/Core/Audit/Services/FinancialAuditService.cs` |
| ChargeAppService | 9 | `CobranzaLuxuryApp/CobranzaNativa/Core/Charges/Services/ChargeAppService.cs` |
| ChargesGeneratorService | 2 | `CobranzaLuxuryApp/CobranzaNativa/Core/Charges/Services/ChargesGeneratorService.cs` |
| ChargeTypeCatalogAppService | 5 | `CobranzaLuxuryApp/CobranzaNativa/Core/ChargeTypes/Services/ChargeTypeCatalogAppService.cs` |
| CollectionCaseAppService | 4 | `CobranzaLuxuryApp/CobranzaNativa/Core/CollectionCases/Services/CollectionCaseAppService.cs` |
| CollectionManagerService | 2 | `CobranzaLuxuryApp/CobranzaNativa/Core/CollectionCases/Services/CollectionManagerService.cs` |
| PropertyFineAppService | 9 | `CobranzaLuxuryApp/CobranzaNativa/Core/Fines/Services/PropertyFineAppService.cs` |
| RegulationArticleAppService | 5 | `CobranzaLuxuryApp/CobranzaNativa/Core/Fines/Services/RegulationArticleAppService.cs` |
| InvoiceQueryAppService | 2 | `CobranzaLuxuryApp/CobranzaNativa/Core/Invoices/Services/InvoiceQueryAppService.cs` |
| InvoiceService | 2 | `CobranzaLuxuryApp/CobranzaNativa/Core/Invoices/Services/InvoiceService.cs` |
| LateFeePolicy | 0 | `CobranzaLuxuryApp/CobranzaNativa/Core/LateFees/Entities/LateFeePolicy.cs` |
| MorosidadPolicy | 0 | `CobranzaLuxuryApp/CobranzaNativa/Core/LateFees/Entities/MorosidadPolicy.cs` |
| LateFeeCalculatorService | 1 | `CobranzaLuxuryApp/CobranzaNativa/Core/LateFees/Services/LateFeeCalculatorService.cs` |
| LateFeePolicyAppService | 5 | `CobranzaLuxuryApp/CobranzaNativa/Core/LateFees/Services/LateFeePolicyAppService.cs` |
| LedgerIntegrityService | 2 | `CobranzaLuxuryApp/CobranzaNativa/Core/Ledger/Services/LedgerIntegrityService.cs` |
| LedgerService | 6 | `CobranzaLuxuryApp/CobranzaNativa/Core/Ledger/Services/LedgerService.cs` |
| PropertyMemberService | 11 | `CobranzaLuxuryApp/CobranzaNativa/Core/Members/Services/PropertyMemberService.cs` |
| CobranzaMetricasService | 1 | `CobranzaLuxuryApp/CobranzaNativa/Core/Metrics/Services/CobranzaMetricasService.cs` |
| CobranzaNativaNotificationService | 3 | `CobranzaLuxuryApp/CobranzaNativa/Core/Notifications/Services/CobranzaNativaNotificationService.cs` |
| NativeCollectionNotificationSettingsService | 3 | `CobranzaLuxuryApp/CobranzaNativa/Core/Notifications/Services/NativeCollectionNotificationSettingsService.cs` |
| NativeCollectionRealTimeService | 2 | `CobranzaLuxuryApp/CobranzaNativa/Core/Notifications/Services/NativeCollectionRealTimeService.cs` |
| NotificationEngineService | 1 | `CobranzaLuxuryApp/CobranzaNativa/Core/Notifications/Services/NotificationEngineService.cs` |
| CobranzaPaymentAppService | 4 | `CobranzaLuxuryApp/CobranzaNativa/Core/Payments/Services/CobranzaPaymentAppService.cs` |
| PaymentAllocationService | 4 | `CobranzaLuxuryApp/CobranzaNativa/Core/Payments/Services/PaymentAllocationService.cs` |
| WebhookHandlerService | 1 | `CobranzaLuxuryApp/CobranzaNativa/Core/Payments/Services/WebhookHandlerService.cs` |
| PeriodClosureService | 5 | `CobranzaLuxuryApp/CobranzaNativa/Core/PeriodClosures/Services/PeriodClosureService.cs` |
| ReconciliationService | 2 | `CobranzaLuxuryApp/CobranzaNativa/Core/Reconciliation/Services/ReconciliationService.cs` |
| NativeStatementPdfExportService | 1 | `CobranzaLuxuryApp/CobranzaNativa/Core/Statements/Services/NativeStatementPdfExportService.cs` |
| NativeStatementService | 1 | `CobranzaLuxuryApp/CobranzaNativa/Core/Statements/Services/NativeStatementService.cs` |
| ChargeTemplateAppService | 7 | `CobranzaLuxuryApp/CobranzaNativa/Core/Templates/Services/ChargeTemplateAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| CreateAdjustmentAsync | IAdjustmentService | CREATE | `Task<ApiResponseDTO<AdjustmentResponseDTO>>` | `CreateAdjustmentDTO dto` |
| CreateCreditNoteAsync | IAdjustmentService | CREATE | `Task<ApiResponseDTO<CreditNoteResponseDTO>>` | `CreateCreditNoteDTO dto` |
| CancelCreditNoteAsync | IAdjustmentService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid creditNoteId, string cancelledBy, string reason` |
| GetPendingCreditNotesAsync | IAdjustmentService | GET_LIST | `Task<ApiResponseDTO<List<CreditNoteResponse…` | `Guid propertyId, Guid customerId` |
| CreateRequestAsync | IFinancialApprovalService | CREATE | `Task<ApiResponseDTO<FinancialApprovalRespon…` | `CreateFinancialApprovalRequestDTO dto` |
| ApproveAsync | IFinancialApprovalService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid requestId, string reviewedBy, string reviewNotes = null` |
| RejectAsync | IFinancialApprovalService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid requestId, string reviewedBy, string reviewNotes` |
| CancelRequestAsync | IFinancialApprovalService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid requestId, string cancelledBy` |
| GetPendingAsync | IFinancialApprovalService | GET_LIST | `Task<ApiResponseDTO<List<FinancialApprovalR…` | `Guid customerId` |
| GetByPropertyAsync | IFinancialApprovalService | GET_LIST | `Task<ApiResponseDTO<List<FinancialApprovalR…` | `Guid propertyId, Guid customerId` |
| LogAsync | IFinancialAuditService | OTHER | `Task` | `Guid customerId, string operationType, string summary, stri…` |
| GetByPropertyAsync | IFinancialAuditService | GET_LIST | `Task<List<FinancialAuditLogDTO>>` | `Guid customerId, Guid propertyId, DateTime? from = null, Da…` |
| GetByTenantAsync | IFinancialAuditService | GET_LIST | `Task<List<FinancialAuditLogDTO>>` | `Guid customerId, DateTime? from = null, DateTime? to = null` |
| GetAllAsync | IChargeAppService | GET_LIST | `Task<ApiResponseDTO<List<ChargeResponseDTO>…` | `Guid customerId` |
| GetByIdAsync | IChargeAppService | GET_SINGLE | `Task<ApiResponseDTO<ChargeResponseDTO>>` | `Guid id` |
| CreateAsync | IChargeAppService | CREATE | `Task<ApiResponseDTO<ChargeResponseDTO>>` | `CreateChargeDTO dto` |
| UpdateAsync | IChargeAppService | UPDATE | `Task<ApiResponseDTO<ChargeResponseDTO>>` | `UpdateChargeDTO dto` |
| CancelAsync | IChargeAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| CancelPaidChargeAsync | IChargeAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid chargeId, string authorizedBy, string reason` |
| BulkImportSaldoInicialAsync | IChargeAppService | OTHER | `Task<ApiResponseDTO<BulkChargeImportResultD…` | `Guid customerId, IFormFile file` |
| GetInitialBalanceStatusAsync | IChargeAppService | GET_LIST | `Task<ApiResponseDTO<List<PropertyInitialBal…` | `Guid customerId` |
| BulkSetInitialBalanceAsync | IChargeAppService | OTHER | `Task<ApiResponseDTO<BulkSetInitialBalanceRe…` | `BulkSetInitialBalanceDTO dto` |
| GenerateMonthlyChargesAsync | IChargesGeneratorService | SPECIAL | `Task<ApiResponseDTO<int>>` | `Guid customerId, int month, int year` |
| GenerateRetroactiveAdjustmentsAsync | IChargesGeneratorService | SPECIAL | `Task<ApiResponseDTO<int>>` | `Guid templateId` |
| GetByCustomerAsync | IChargeTypeCatalogAppService | GET_LIST | `Task<ApiResponseDTO<List<ChargeTypeCatalogR…` | `Guid customerId` |
| GetByIdAsync | IChargeTypeCatalogAppService | GET_SINGLE | `Task<ApiResponseDTO<ChargeTypeCatalogRespon…` | `Guid id` |
| CreateAsync | IChargeTypeCatalogAppService | CREATE | `Task<ApiResponseDTO<ChargeTypeCatalogRespon…` | `CreateChargeTypeCatalogDTO dto` |
| UpdateAsync | IChargeTypeCatalogAppService | UPDATE | `Task<ApiResponseDTO<ChargeTypeCatalogRespon…` | `UpdateChargeTypeCatalogDTO dto` |
| DeleteAsync | IChargeTypeCatalogAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetAllAsync | ICollectionCaseAppService | GET_LIST | `Task<ApiResponseDTO<List<CollectionCaseResp…` | `Guid customerId` |
| GetByIdAsync | ICollectionCaseAppService | GET_SINGLE | `Task<ApiResponseDTO<CollectionCaseResponseD…` | `Guid id` |
| CreateAsync | ICollectionCaseAppService | CREATE | `Task<ApiResponseDTO<CollectionCaseResponseD…` | `CreateCollectionCaseDTO dto` |
| UpdateAsync | ICollectionCaseAppService | UPDATE | `Task<ApiResponseDTO<CollectionCaseResponseD…` | `UpdateCollectionCaseDTO dto` |
| EvaluateAndEscalateAccountsAsync | ICollectionManagerService | SPECIAL | `Task<ApiResponseDTO<int>>` | `Guid customerId` |
| LogCollectionActivityAsync | ICollectionManagerService | OTHER | `Task<ApiResponseDTO<bool>>` | `Guid caseId, string notes, DateOnly? promisedDate, string a…` |
| GetByCustomerAsync | IPropertyFineAppService | GET_LIST | `Task<ApiResponseDTO<List<PropertyFineRespon…` | `Guid customerId` |
| GetByPropertyAsync | IPropertyFineAppService | GET_LIST | `Task<ApiResponseDTO<List<PropertyFineRespon…` | `Guid propertyId` |
| GetByIdAsync | IPropertyFineAppService | GET_SINGLE | `Task<ApiResponseDTO<PropertyFineResponseDTO…` | `Guid id` |
| CreateAsync | IPropertyFineAppService | CREATE | `Task<ApiResponseDTO<PropertyFineResponseDTO…` | `CreatePropertyFineDTO dto` |
| UpdateAsync | IPropertyFineAppService | UPDATE | `Task<ApiResponseDTO<PropertyFineResponseDTO…` | `UpdatePropertyFineDTO dto` |
| IssueChargeAsync | IPropertyFineAppService | SPECIAL | `Task<ApiResponseDTO<PropertyFineResponseDTO…` | `IssueFineChargeDTO dto` |
| VoidAsync | IPropertyFineAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid id, string reason` |
| AddEvidenceAsync | IPropertyFineAppService | CREATE | `Task<ApiResponseDTO<PropertyFineResponseDTO…` | `Guid fineId, IFormFile file` |
| RemoveEvidenceAsync | IPropertyFineAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid evidenceId` |
| GetAllAsync | IRegulationArticleAppService | GET_LIST | `Task<ApiResponseDTO<List<RegulationArticleR…` | `Guid customerId` |
| GetByIdAsync | IRegulationArticleAppService | GET_SINGLE | `Task<ApiResponseDTO<RegulationArticleRespon…` | `Guid id` |
| CreateAsync | IRegulationArticleAppService | CREATE | `Task<ApiResponseDTO<RegulationArticleRespon…` | `CreateRegulationArticleDTO dto` |
| UpdateAsync | IRegulationArticleAppService | UPDATE | `Task<ApiResponseDTO<RegulationArticleRespon…` | `UpdateRegulationArticleDTO dto` |
| DeleteAsync | IRegulationArticleAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetByChargeAsync | IInvoiceQueryAppService | GET_LIST | `Task<ApiResponseDTO<List<InvoiceResponseDTO…` | `Guid chargeId` |
| GetByIdAsync | IInvoiceQueryAppService | GET_SINGLE | `Task<ApiResponseDTO<InvoiceResponseDTO>>` | `Guid id` |
| GenerateInvoiceAsync | IInvoiceService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid chargeId, Guid customerId` |
| CancelInvoiceAsync | IInvoiceService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid invoiceId, string motive, string replacementUuid = null` |
| ProcessLateFeesAsync | ILateFeeCalculatorService | SPECIAL | `Task<ApiResponseDTO<int>>` | `Guid customerId` |
| GetAllAsync | ILateFeePolicyAppService | GET_LIST | `Task<ApiResponseDTO<List<LateFeePolicyRespo…` | `Guid customerId` |
| GetByIdAsync | ILateFeePolicyAppService | GET_SINGLE | `Task<ApiResponseDTO<LateFeePolicyResponseDT…` | `Guid id` |
| CreateAsync | ILateFeePolicyAppService | CREATE | `Task<ApiResponseDTO<LateFeePolicyResponseDT…` | `CreateLateFeePolicyDTO dto` |
| UpdateAsync | ILateFeePolicyAppService | UPDATE | `Task<ApiResponseDTO<LateFeePolicyResponseDT…` | `UpdateLateFeePolicyDTO dto` |
| DeleteAsync | ILateFeePolicyAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| CheckTenantIntegrityAsync | ILedgerIntegrityService | OTHER | `Task<LedgerIntegrityReportDTO>` | `Guid customerId` |
| CheckPropertyIntegrityAsync | ILedgerIntegrityService | OTHER | `Task<PropertyIntegrityResultDTO>` | `Guid customerId, Guid propertyId` |
| BeginBatchAsync | ILedgerService | OTHER | `Task<FinancialBatch>` | `Guid customerId, FinancialEventType primaryEventType, strin…` |
| WriteAsync | ILedgerService | OTHER | `Task` | `FinancialBatch batch, LedgerEntryCommand command` |
| GetPropertyBalanceAsync | ILedgerService | GET_LIST | `Task<decimal>` | `Guid customerId, Guid propertyId, DateOnly? asOf = null` |
| GetChargeBalanceAsync | ILedgerService | GET_LIST | `Task<decimal>` | `Guid chargeId, DateOnly? asOf = null` |
| GetBatchEntriesAsync | ILedgerService | GET_LIST | `Task<List<FinancialLedgerEntry>>` | `Guid batchId` |
| GetPropertyLedgerAsync | ILedgerService | GET_LIST | `Task<List<FinancialLedgerEntry>>` | `Guid customerId, Guid propertyId, DateOnly? from = null, Da…` |
| GetByPropertyAsync | IPropertyMemberService | GET_LIST | `Task<ApiResponseDTO<List<PropertyMemberResp…` | `Guid propertyId, Guid customerId` |
| GetByCustomerAsync | IPropertyMemberService | GET_LIST | `Task<ApiResponseDTO<List<PropertyMemberResp…` | `Guid customerId` |
| GetByIdAsync | IPropertyMemberService | GET_SINGLE | `Task<ApiResponseDTO<PropertyMemberResponseD…` | `Guid id` |
| GetFinancialResponsibleAsync | IPropertyMemberService | GET_LIST | `Task<PropertyMember>` | `Guid propertyId, DateTime? asOf = null` |
| GetNotificationRecipientsAsync | IPropertyMemberService | GET_LIST | `Task<List<PropertyMemberNotificationRecipie…` | `Guid propertyId, DateTime? asOf = null` |
| AddMemberAsync | IPropertyMemberService | CREATE | `Task<ApiResponseDTO<PropertyMemberResponseD…` | `CreatePropertyMemberDTO dto` |
| CreateMemberWithAccountAsync | IPropertyMemberService | CREATE | `Task<ApiResponseDTO<PropertyMemberResponseD…` | `CreatePropertyMemberWithAccountDTO dto` |
| UpdateMemberAsync | IPropertyMemberService | UPDATE | `Task<ApiResponseDTO<PropertyMemberResponseD…` | `UpdatePropertyMemberDTO dto` |
| EndMembershipAsync | IPropertyMemberService | OTHER | `Task<ApiResponseDTO<bool>>` | `Guid memberId, DateOnly endDate, string updatedBy` |
| DeleteMemberAsync | IPropertyMemberService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid memberId` |
| MigrateFromLegacyAsync | IPropertyMemberService | SPECIAL | `Task<ApiResponseDTO<MigrationResultDTO>>` | `Guid customerId` |
| GetMetricasAsync | ICobranzaMetricasService | GET_LIST | `Task<ApiResponseDTO<CobranzaMetricasRespons…` | `Guid customerId, int meses = 6` |
| SendMonthlyStatementEmailAsync | ICobranzaNativaNotificationService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid customerId, Guid propertyId, DateTime? asOf = null` |
| SendMonthlyStatementsBatchAsync | ICobranzaNativaNotificationService | SPECIAL | `Task<ApiResponseDTO<SendNativeStatementBatc…` | `Guid customerId, DateTime? asOf = null` |
| SendPaymentReceiptEmailAsync | ICobranzaNativaNotificationService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid paymentId` |
| GetByCustomerAsync | INativeCollectionNotificationSettingsService | GET_LIST | `Task<ApiResponseDTO<NativeCollectionNotific…` | `Guid customerId` |
| SaveAsync | INativeCollectionNotificationSettingsService | SPECIAL | `Task<ApiResponseDTO<NativeCollectionNotific…` | `SaveNativeCollectionNotificationSettingsDTO dto` |
| GetEffectiveSettingsAsync | INativeCollectionNotificationSettingsService | GET_LIST | `Task<NativeCollectionNotificationSettingsRe…` | `Guid customerId` |
| SendUpdateAsync | INativeCollectionRealTimeService | SPECIAL | `Task` | `NativeCollectionRealTimeUpdateDTO dto, string excludedConne…` |
| GetExcludedConnectionIdAsync | INativeCollectionRealTimeService | GET_LIST | `Task<string>` | `-` |
| ProcessNotificationsAsync | INotificationEngineService | SPECIAL | `Task<ApiResponseDTO<int>>` | `Guid customerId` |
| GetAllAsync | ICobranzaPaymentAppService | GET_LIST | `Task<ApiResponseDTO<List<CobranzaPaymentRes…` | `Guid customerId` |
| GetByIdAsync | ICobranzaPaymentAppService | GET_SINGLE | `Task<ApiResponseDTO<CobranzaPaymentResponse…` | `Guid id` |
| CreateAsync | ICobranzaPaymentAppService | CREATE | `Task<ApiResponseDTO<CobranzaPaymentResponse…` | `CreateCobranzaPaymentDTO dto` |
| UpdateAsync | ICobranzaPaymentAppService | UPDATE | `Task<ApiResponseDTO<CobranzaPaymentResponse…` | `UpdateCobranzaPaymentDTO dto` |
| GetPendingChargesByPropertyAsync | IPaymentAllocationService | GET_LIST | `Task<ApiResponseDTO<List<PendingChargeDTO>>>` | `Guid propertyId, Guid customerId` |
| ApplyPaymentToChargesAsync | IPaymentAllocationService | SPECIAL | `Task<ApiResponseDTO<ApplyPaymentResultDTO>>` | `ApplyPaymentToChargesDTO dto` |
| CancelPaymentAsync | IPaymentAllocationService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid paymentId, string cancellationReason` |
| AutoApplyOverpaymentsAsync | IPaymentAllocationService | OTHER | `Task<ApiResponseDTO<ApplyPaymentResultDTO>>` | `Guid propertyId, Guid customerId` |
| HandlePaymentWebhookAsync | IWebhookHandlerService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `CobranzaWebhookPayloadDTO payload, string signatureHeader` |
| ClosePeriodAsync | IPeriodClosureService | SPECIAL | `Task<ApiResponseDTO<PeriodClosureResponseDT…` | `Guid customerId, int year, int month, string closedBy, stri…` |
| ReopenPeriodAsync | IPeriodClosureService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid customerId, int year, int month, string reopenedBy, st…` |
| IsPeriodClosedAsync | IPeriodClosureService | GET_SINGLE | `Task<bool>` | `Guid customerId, int year, int month` |
| FindBlockingClosureAsync | IPeriodClosureService | GET_LIST | `Task<CollectionPeriodClosure>` | `Guid customerId, DateOnly effectiveDate` |
| GetPeriodsAsync | IPeriodClosureService | GET_LIST | `Task<ApiResponseDTO<List<PeriodClosureRespo…` | `Guid customerId` |
| ReconcileUnallocatedPaymentsAsync | IReconciliationService | SPECIAL | `Task<ApiResponseDTO<int>>` | `Guid customerId` |
| GetUnallocatedPaymentsAsync | IReconciliationService | GET_LIST | `Task<ApiResponseDTO<List<CobranzaPaymentRes…` | `Guid customerId` |
| GetStatementByPropertyAsync | INativeStatementService | GET_LIST | `Task<ApiResponseDTO<NativeStatementResponse…` | `Guid propertyId, DateTime? asOf = null` |
| GetAllAsync | IChargeTemplateAppService | GET_LIST | `Task<ApiResponseDTO<List<ChargeTemplateResp…` | `Guid customerId` |
| GetByIdAsync | IChargeTemplateAppService | GET_SINGLE | `Task<ApiResponseDTO<ChargeTemplateResponseD…` | `Guid id` |
| CreateAsync | IChargeTemplateAppService | CREATE | `Task<ApiResponseDTO<ChargeTemplateResponseD…` | `CreateChargeTemplateDTO dto` |
| UpdateAsync | IChargeTemplateAppService | UPDATE | `Task<ApiResponseDTO<ChargeTemplateResponseD…` | `UpdateChargeTemplateDTO dto` |
| DeleteAsync | IChargeTemplateAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| PreviewAsync | IChargeTemplateAppService | GET_LIST | `Task<ApiResponseDTO<IndivisoFeeComparisonDT…` | `FeePreviewRequestDTO request` |
| GetCoverageAsync | IChargeTemplateAppService | GET_LIST | `Task<ApiResponseDTO<List<TemplateCoverageDT…` | `Guid customerId` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/cobranza/billing-config/customer/{customerId:guid}` | `billingConfigAppService.GetByCustomerIdAsync` | `CobranzaLuxuryApp/CobranzaNativa/Contracts/ExternalCompatibility/EndPoints/BillingConfigEndPoints.cs` |
| POST | `/api/cobranza/billing-config` | `billingConfigAppService.UpsertAsync` | `CobranzaLuxuryApp/CobranzaNativa/Contracts/ExternalCompatibility/EndPoints/BillingConfigEndPoints.cs` |
| POST | `/api/cobranza/adjustments` | `adjustmentService.CreateAdjustmentAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Approvals/EndPoints/AdjustmentsEndPoints.cs` |
| POST | `/api/cobranza/adjustments/credit-notes` | `adjustmentService.CreateCreditNoteAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Approvals/EndPoints/AdjustmentsEndPoints.cs` |
| GET | `/api/cobranza/adjustments/credit-notes/property/{propertyId:guid}/customer/{customerId:guid}` | `adjustmentService.GetPendingCreditNotesAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Approvals/EndPoints/AdjustmentsEndPoints.cs` |
| POST | `/api/cobranza/adjustments/credit-notes/{id:guid}/cancel` | `adjustmentService.CancelCreditNoteAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Approvals/EndPoints/AdjustmentsEndPoints.cs` |
| POST | `/api/cobranza/approvals` | `approvalService.CreateRequestAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Approvals/EndPoints/FinancialApprovalsEndPoints.cs` |
| POST | `/api/cobranza/approvals/{id:guid}/approve` | `approvalService.ApproveAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Approvals/EndPoints/FinancialApprovalsEndPoints.cs` |
| POST | `/api/cobranza/approvals/{id:guid}/reject` | `approvalService.RejectAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Approvals/EndPoints/FinancialApprovalsEndPoints.cs` |
| POST | `/api/cobranza/approvals/{id:guid}/cancel` | `approvalService.CancelRequestAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Approvals/EndPoints/FinancialApprovalsEndPoints.cs` |
| GET | `/api/cobranza/approvals/pending/customer/{customerId:guid}` | `approvalService.GetPendingAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Approvals/EndPoints/FinancialApprovalsEndPoints.cs` |
| GET | `/api/cobranza/approvals/property/{propertyId:guid}/customer/{customerId:guid}` | `approvalService.GetByPropertyAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Approvals/EndPoints/FinancialApprovalsEndPoints.cs` |
| GET | `/api/cobranza/audit-logs/customer/{customerId:guid}` | `auditService.GetByTenantAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Audit/EndPoints/FinancialAuditEndPoints.cs` |
| GET | `/api/cobranza/audit-logs/property/{propertyId:guid}/customer/{customerId:guid}` | `auditService.GetByPropertyAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Audit/EndPoints/FinancialAuditEndPoints.cs` |
| GET | `/api/cobranza/charges/customer/{customerId:guid}` | `appService.GetAllAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Charges/EndPoints/ChargesEndPoints.cs` |
| GET | `/api/cobranza/charges/{id:guid}` | `appService.GetByIdAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Charges/EndPoints/ChargesEndPoints.cs` |
| POST | `/api/cobranza/charges` | `appService.CreateAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Charges/EndPoints/ChargesEndPoints.cs` |
| PUT | `/api/cobranza/charges/{id:guid}` | `appService.UpdateAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Charges/EndPoints/ChargesEndPoints.cs` |
| POST | `/api/cobranza/charges/{id:guid}/cancel` | `appService.CancelAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Charges/EndPoints/ChargesEndPoints.cs` |
| POST | `/api/cobranza/charges/generate-monthly` | `generatorService.GenerateMonthlyChargesAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Charges/EndPoints/ChargesEndPoints.cs` |
| POST | `/api/cobranza/charges/calculate-late-fees` | `lateFeeService.ProcessLateFeesAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Charges/EndPoints/ChargesEndPoints.cs` |
| POST | `/api/cobranza/charges/bulk-import/saldo-inicial` | `appService.BulkImportSaldoInicialAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Charges/EndPoints/ChargesEndPoints.cs` |
| GET | `/api/cobranza/charges/initial-balance-status/customer/{customerId:guid}` | `appService.GetInitialBalanceStatusAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Charges/EndPoints/ChargesEndPoints.cs` |
| POST | `/api/cobranza/charges/initial-balance/bulk` | `appService.BulkSetInitialBalanceAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Charges/EndPoints/ChargesEndPoints.cs` |
| GET | `/api/cobranza/charge-types/customer/{customerId:guid}` | `appService.GetByCustomerAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/ChargeTypes/EndPoints/ChargeTypesEndPoints.cs` |
| GET | `/api/cobranza/charge-types/{id:guid}` | `appService.GetByIdAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/ChargeTypes/EndPoints/ChargeTypesEndPoints.cs` |
| POST | `/api/cobranza/charge-types` | `appService.CreateAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/ChargeTypes/EndPoints/ChargeTypesEndPoints.cs` |
| PUT | `/api/cobranza/charge-types/{id:guid}` | `appService.UpdateAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/ChargeTypes/EndPoints/ChargeTypesEndPoints.cs` |
| DELETE | `/api/cobranza/charge-types/{id:guid}` | `appService.DeleteAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/ChargeTypes/EndPoints/ChargeTypesEndPoints.cs` |
| GET | `/api/cobranza/collection-cases/customer/{customerId:guid}` | `collectionCaseAppService.GetAllAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/CollectionCases/EndPoints/CollectionCasesEndpoints.cs` |
| GET | `/api/cobranza/collection-cases/{id:guid}` | `collectionCaseAppService.GetByIdAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/CollectionCases/EndPoints/CollectionCasesEndpoints.cs` |
| POST | `/api/cobranza/collection-cases` | `collectionCaseAppService.CreateAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/CollectionCases/EndPoints/CollectionCasesEndpoints.cs` |
| PUT | `/api/cobranza/collection-cases/{id:guid}` | `collectionCaseAppService.UpdateAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/CollectionCases/EndPoints/CollectionCasesEndpoints.cs` |
| POST | `/api/cobranza/collection-cases/{id:guid}/activity` | `collectionManagerService.LogCollectionActivityAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/CollectionCases/EndPoints/CollectionCasesEndpoints.cs` |
| POST | `/api/cobranza/collection-cases/evaluate-and-escalate/{customerId:guid}` | `collectionManagerService.EvaluateAndEscalateAccountsAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/CollectionCases/EndPoints/CollectionCasesEndpoints.cs` |
| GET | `/api/cobranza/property-fines/customer/{customerId:guid}` | `appService.GetByCustomerAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Fines/EndPoints/PropertyFinesEndpoints.cs` |
| GET | `/api/cobranza/property-fines/property/{propertyId:guid}` | `appService.GetByPropertyAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Fines/EndPoints/PropertyFinesEndpoints.cs` |
| GET | `/api/cobranza/property-fines/{id:guid}` | `appService.GetByIdAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Fines/EndPoints/PropertyFinesEndpoints.cs` |
| POST | `/api/cobranza/property-fines` | `appService.CreateAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Fines/EndPoints/PropertyFinesEndpoints.cs` |
| PUT | `/api/cobranza/property-fines/{id:guid}` | `appService.UpdateAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Fines/EndPoints/PropertyFinesEndpoints.cs` |
| POST | `/api/cobranza/property-fines/issue-charge` | `appService.IssueChargeAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Fines/EndPoints/PropertyFinesEndpoints.cs` |
| POST | `/api/cobranza/property-fines/{id:guid}/void` | `appService.VoidAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Fines/EndPoints/PropertyFinesEndpoints.cs` |
| POST | `/api/cobranza/property-fines/{fineId:guid}/evidences` | `appService.AddEvidenceAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Fines/EndPoints/PropertyFinesEndpoints.cs` |
| DELETE | `/api/cobranza/property-fines/evidences/{evidenceId:guid}` | `appService.RemoveEvidenceAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Fines/EndPoints/PropertyFinesEndpoints.cs` |
| GET | `/api/cobranza/regulation-articles/customer/{customerId:guid}` | `appService.GetAllAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Fines/EndPoints/RegulationArticlesEndPoints.cs` |
| GET | `/api/cobranza/regulation-articles/{id:guid}` | `appService.GetByIdAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Fines/EndPoints/RegulationArticlesEndPoints.cs` |
| POST | `/api/cobranza/regulation-articles` | `appService.CreateAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Fines/EndPoints/RegulationArticlesEndPoints.cs` |
| PUT | `/api/cobranza/regulation-articles/{id:guid}` | `appService.UpdateAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Fines/EndPoints/RegulationArticlesEndPoints.cs` |
| DELETE | `/api/cobranza/regulation-articles/{id:guid}` | `appService.DeleteAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Fines/EndPoints/RegulationArticlesEndPoints.cs` |
| GET | `/api/cobranza/invoices/charge/{chargeId:guid}` | `invoiceQueryAppService.GetByChargeAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Invoices/EndPoints/InvoicesEndpoints.cs` |
| GET | `/api/cobranza/invoices/{id:guid}` | `invoiceQueryAppService.GetByIdAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Invoices/EndPoints/InvoicesEndpoints.cs` |
| POST | `/api/cobranza/invoices` | `invoiceService.GenerateInvoiceAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Invoices/EndPoints/InvoicesEndpoints.cs` |
| POST | `/api/cobranza/invoices/{id:guid}/cancel` | `invoiceService.CancelInvoiceAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Invoices/EndPoints/InvoicesEndpoints.cs` |
| GET | `/api/cobranza/late-fee-policies/customer/{customerId:guid}` | `appService.GetAllAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/LateFees/EndPoints/LateFeePoliciesEndPoints.cs` |
| GET | `/api/cobranza/late-fee-policies/{id:guid}` | `appService.GetByIdAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/LateFees/EndPoints/LateFeePoliciesEndPoints.cs` |
| POST | `/api/cobranza/late-fee-policies` | `appService.CreateAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/LateFees/EndPoints/LateFeePoliciesEndPoints.cs` |
| PUT | `/api/cobranza/late-fee-policies/{id:guid}` | `appService.UpdateAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/LateFees/EndPoints/LateFeePoliciesEndPoints.cs` |
| DELETE | `/api/cobranza/late-fee-policies/{id:guid}` | `appService.DeleteAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/LateFees/EndPoints/LateFeePoliciesEndPoints.cs` |
| GET | `/api/cobranza/ledger/property/{propertyId:guid}/customer/{customerId:guid}/balance` | `ledgerService.GetPropertyBalanceAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Ledger/EndPoints/LedgerEndPoints.cs` |
| GET | `/api/cobranza/ledger/charge/{chargeId:guid}/balance` | `ledgerService.GetChargeBalanceAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Ledger/EndPoints/LedgerEndPoints.cs` |
| GET | `/api/cobranza/ledger/property/{propertyId:guid}/customer/{customerId:guid}/entries` | `ledgerService.GetPropertyLedgerAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Ledger/EndPoints/LedgerEndPoints.cs` |
| GET | `/api/cobranza/ledger/batch/{batchId:guid}` | `ledgerService.GetBatchEntriesAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Ledger/EndPoints/LedgerEndPoints.cs` |
| POST | `/api/cobranza/ledger/integrity/customer/{customerId:guid}` | `integrityService.CheckTenantIntegrityAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Ledger/EndPoints/LedgerEndPoints.cs` |
| GET | `/api/cobranza/ledger/integrity/customer/{customerId:guid}/property/{propertyId:guid}` | `integrityService.CheckPropertyIntegrityAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Ledger/EndPoints/LedgerEndPoints.cs` |
| GET | `/api/cobranza/property-members/{id:guid}` | `memberService.GetByIdAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Members/EndPoints/PropertyMembersEndPoints.cs` |
| GET | `/api/cobranza/property-members/customer/{customerId:guid}` | `memberService.GetByCustomerAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Members/EndPoints/PropertyMembersEndPoints.cs` |
| GET | `/api/cobranza/property-members/property/{propertyId:guid}/customer/{customerId:guid}` | `memberService.GetByPropertyAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Members/EndPoints/PropertyMembersEndPoints.cs` |
| POST | `/api/cobranza/property-members` | `memberService.AddMemberAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Members/EndPoints/PropertyMembersEndPoints.cs` |
| POST | `/api/cobranza/property-members/create-with-account` | `memberService.CreateMemberWithAccountAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Members/EndPoints/PropertyMembersEndPoints.cs` |
| PUT | `/api/cobranza/property-members/{id:guid}` | `memberService.UpdateMemberAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Members/EndPoints/PropertyMembersEndPoints.cs` |
| POST | `/api/cobranza/property-members/{id:guid}/end-membership` | `memberService.EndMembershipAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Members/EndPoints/PropertyMembersEndPoints.cs` |
| DELETE | `/api/cobranza/property-members/{id:guid}` | `memberService.DeleteMemberAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Members/EndPoints/PropertyMembersEndPoints.cs` |
| POST | `/api/cobranza/property-members/migrate-from-legacy/customer/{customerId:guid}` | `memberService.MigrateFromLegacyAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Members/EndPoints/PropertyMembersEndPoints.cs` |
| GET | `/api/cobranza/metrics/customer/{customerId:guid}` | `metricasService.GetMetricasAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Metrics/EndPoints/CobranzaMetricasEndPoints.cs` |
| POST | `/api/cobranza/notifications/process` | `notificationEngineService.ProcessNotificationsAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Notifications/EndPoints/NativeCollectionNotificationsEndpoints.cs` |
| POST | `/api/cobranza/notifications/statements/send` | `cobranzaNativaNotificationService.SendMonthlyStatementEmailAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Notifications/EndPoints/NativeCollectionNotificationsEndpoints.cs` |
| POST | `/api/cobranza/notifications/statements/send-batch` | `cobranzaNativaNotificationService.SendMonthlyStatementsBatchAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Notifications/EndPoints/NativeCollectionNotificationsEndpoints.cs` |
| POST | `/api/cobranza/notifications/receipts/{paymentId:guid}/send` | `cobranzaNativaNotificationService.SendPaymentReceiptEmailAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Notifications/EndPoints/NativeCollectionNotificationsEndpoints.cs` |
| GET | `/api/cobranza/notification-settings/customer/{customerId:guid}` | `appService.GetByCustomerAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Notifications/EndPoints/NotificationSettingsEndPoints.cs` |
| POST | `/api/cobranza/notification-settings` | `appService.SaveAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Notifications/EndPoints/NotificationSettingsEndPoints.cs` |
| GET | `/api/cobranza/payments/customer/{customerId:guid}` | `appService.GetAllAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Payments/EndPoints/CobranzaPaymentsEndPoints.cs` |
| GET | `/api/cobranza/payments/{id:guid}` | `appService.GetByIdAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Payments/EndPoints/CobranzaPaymentsEndPoints.cs` |
| POST | `/api/cobranza/payments` | `appService.CreateAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Payments/EndPoints/CobranzaPaymentsEndPoints.cs` |
| PUT | `/api/cobranza/payments/{id:guid}` | `appService.UpdateAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Payments/EndPoints/CobranzaPaymentsEndPoints.cs` |
| GET | `/api/cobranza/payments/pending-charges/property/{propertyId:guid}/customer/{customerId:guid}` | `allocationService.GetPendingChargesByPropertyAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Payments/EndPoints/CobranzaPaymentsEndPoints.cs` |
| POST | `/api/cobranza/payments/apply-to-charges` | `allocationService.ApplyPaymentToChargesAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Payments/EndPoints/CobranzaPaymentsEndPoints.cs` |
| POST | `/api/cobranza/payments/{id:guid}/cancel` | `allocationService.CancelPaymentAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Payments/EndPoints/CobranzaPaymentsEndPoints.cs` |
| POST | `/api/cobranza/payments/auto-apply-overpayments` | `allocationService.AutoApplyOverpaymentsAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Payments/EndPoints/CobranzaPaymentsEndPoints.cs` |
| POST | `/api/cobranza/payment-webhooks/pasarela` | `webhookHandlerService.HandlePaymentWebhookAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Payments/EndPoints/WebhooksEndPoints.cs` |
| GET | `/api/cobranza/period-closures/customer/{customerId:guid}` | `periodClosureService.GetPeriodsAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/PeriodClosures/EndPoints/PeriodClosuresEndPoints.cs` |
| GET | `/api/cobranza/period-closures/customer/{customerId:guid}/{year:int}/{month:int}/is-closed` | `periodClosureService.IsPeriodClosedAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/PeriodClosures/EndPoints/PeriodClosuresEndPoints.cs` |
| POST | `/api/cobranza/period-closures/customer/{customerId:guid}/close` | `periodClosureService.ClosePeriodAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/PeriodClosures/EndPoints/PeriodClosuresEndPoints.cs` |
| POST | `/api/cobranza/period-closures/customer/{customerId:guid}/reopen` | `periodClosureService.ReopenPeriodAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/PeriodClosures/EndPoints/PeriodClosuresEndPoints.cs` |
| GET | `/api/cobranza/reconciliations/unallocated` | `reconciliationService.GetUnallocatedPaymentsAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Reconciliation/EndPoints/ReconciliationsEndpoints.cs` |
| POST | `/api/cobranza/reconciliations/auto-apply-all` | `reconciliationService.ReconcileUnallocatedPaymentsAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Reconciliation/EndPoints/ReconciliationsEndpoints.cs` |
| GET | `/api/cobranza/statements/{propertyId:guid}` | `service.GetStatementByPropertyAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Statements/EndPoints/NativeStatementsEndpoints.cs` |
| GET | `/api/cobranza/statements/{propertyId:guid}/pdf` | `service.GetStatementByPropertyAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Statements/EndPoints/NativeStatementsEndpoints.cs` |
| GET | `/api/cobranza/charge-templates/customer/{customerId:guid}` | `appService.GetAllAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Templates/EndPoints/ChargeTemplatesEndPoints.cs` |
| GET | `/api/cobranza/charge-templates/{id:guid}` | `appService.GetByIdAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Templates/EndPoints/ChargeTemplatesEndPoints.cs` |
| POST | `/api/cobranza/charge-templates` | `appService.CreateAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Templates/EndPoints/ChargeTemplatesEndPoints.cs` |
| PUT | `/api/cobranza/charge-templates/{id:guid}` | `appService.UpdateAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Templates/EndPoints/ChargeTemplatesEndPoints.cs` |
| DELETE | `/api/cobranza/charge-templates/{id:guid}` | `appService.DeleteAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Templates/EndPoints/ChargeTemplatesEndPoints.cs` |
| POST | `/api/cobranza/charge-templates/preview` | `appService.PreviewAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Templates/EndPoints/ChargeTemplatesEndPoints.cs` |
| GET | `/api/cobranza/charge-templates/coverage/customer/{customerId:guid}` | `appService.GetCoverageAsync` | `CobranzaLuxuryApp/CobranzaNativa/Core/Templates/EndPoints/ChargeTemplatesEndPoints.cs` |

#### Modulo: CobranzaOnline

- Interfaces: 1 | Servicios: 8 | Endpoints: 18 | DTOs: 0

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IExclusionesBuilder | 6 | `CobranzaLuxuryApp/CobranzaOnline/Services/IExclusionesBuilder.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| CobranzaOnlineAccountAppService | 1 | `CobranzaLuxuryApp/CobranzaOnline/Services/CobranzaOnlineAccountAppService.cs` |
| CobranzaOnlineBalanceAppService | 1 | `CobranzaLuxuryApp/CobranzaOnline/Services/CobranzaOnlineBalanceAppService.cs` |
| CobranzaOnlineDashboardAppService | 8 | `CobranzaLuxuryApp/CobranzaOnline/Services/CobranzaOnlineDashboardAppService.cs` |
| CobranzaOnlineMovementAppService | 1 | `CobranzaLuxuryApp/CobranzaOnline/Services/CobranzaOnlineMovementAppService.cs` |
| CobranzaOnlinePolicyAppService | 1 | `CobranzaLuxuryApp/CobranzaOnline/Services/CobranzaOnlinePolicyAppService.cs` |
| CobranzaOnlinePortfolioAppService | 1 | `CobranzaLuxuryApp/CobranzaOnline/Services/CobranzaOnlinePortfolioAppService.cs` |
| CobranzaOnlineReporteFinancieroAppService | 1 | `CobranzaLuxuryApp/CobranzaOnline/Services/CobranzaOnlineReporteFinancieroAppService.cs` |
| CobranzaOnlineStatementAppService | 2 | `CobranzaLuxuryApp/CobranzaOnline/Services/CobranzaOnlineStatementAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| BuildExcludedAccountsLiveAsync | IExclusionesBuilder | OTHER | `Task<CobranzaOnlineExcludedAccountListRespo…` | `Guid customerId, int year` |
| BuildExcludedAccountsFallbackAsync | IExclusionesBuilder | OTHER | `Task<CobranzaOnlineExcludedAccountListRespo…` | `Guid customerId, int year` |
| AppendMissingExcludedRows | IExclusionesBuilder | OTHER | `Task` | `List<CobranzaOnlineExcludedAccountRowDTO> rows, Dictionary<…` |
| GetExcludedAccountsMapAsync | IExclusionesBuilder | GET_LIST | `Task<Dictionary<string, CobranzaExcludedAcc…` | `Guid customerId` |
| GetExcludedAccountNumbersAsync | IExclusionesBuilder | GET_LIST | `Task<HashSet<string>>` | `Guid customerId` |
| BuildPropertyMatchMapAsync | IExclusionesBuilder | OTHER | `Task<Dictionary<string, Property>>` | `Guid customerId` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| POST | `/api/cobranza/online/aspel-sync/{customerId:guid}/ejercicio/{year:int}/completo` | - | `CobranzaLuxuryApp/CobranzaOnline/EndPoints/AspelSyncEndPoints.cs` |
| POST | `/api/cobranza/online/aspel-sync/{customerId:guid}/ejercicio/{year:int}/contabilidad` | `contabilidadMigratorService.RunMigrationAsync` | `CobranzaLuxuryApp/CobranzaOnline/EndPoints/AspelSyncEndPoints.cs` |
| POST | `/api/cobranza/online/aspel-sync/{customerId:guid}/ejercicio/{year:int}/cobranza` | - | `CobranzaLuxuryApp/CobranzaOnline/EndPoints/AspelSyncEndPoints.cs` |
| GET | `/api/cobranza/online/accounts/tree/customer/{customerId:guid}` | `service.GetAccountsTreeAsync` | `CobranzaLuxuryApp/CobranzaOnline/EndPoints/CobranzaOnlineAccountEndPoints.cs` |
| GET | `/api/cobranza/online/balances/customer/{customerId:guid}/year/{year:int}` | `service.GetBalancesByCustomerAsync` | `CobranzaLuxuryApp/CobranzaOnline/EndPoints/CobranzaOnlineBalanceEndPoints.cs` |
| GET | `/api/cobranza/online/sync-status/customer/{customerId:guid}/year/{year:int}` | `service.GetSyncStatusAsync` | `CobranzaLuxuryApp/CobranzaOnline/EndPoints/CobranzaOnlineDashboardEndPoints.cs` |
| GET | `/api/cobranza/online/dashboard/customer/{customerId:guid}/year/{year:int}/month/{month:int}` | `service.GetDashboardAsync` | `CobranzaLuxuryApp/CobranzaOnline/EndPoints/CobranzaOnlineDashboardEndPoints.cs` |
| GET | `/api/cobranza/online/analysis/customer/{customerId:guid}/year/{year:int}/month/{month:int}/day/{day:int}` | `service.GetCollectionAnalysisAsync` | `CobranzaLuxuryApp/CobranzaOnline/EndPoints/CobranzaOnlineDashboardEndPoints.cs` |
| GET | `/api/cobranza/online/inspection/customer/{customerId:guid}/year/{year:int}/month/{month:int}` | `service.GetInspectionAsync` | `CobranzaLuxuryApp/CobranzaOnline/EndPoints/CobranzaOnlineDashboardEndPoints.cs` |
| GET | `/api/cobranza/online/inspection-history/customer/{customerId:guid}/year/{year:int}/account/{accountNumber}` | `service.GetInspectionHistoryAsync` | `CobranzaLuxuryApp/CobranzaOnline/EndPoints/CobranzaOnlineDashboardEndPoints.cs` |
| GET | `/api/cobranza/online/excluded-accounts/customer/{customerId:guid}/year/{year:int}` | `service.GetExcludedAccountsAsync` | `CobranzaLuxuryApp/CobranzaOnline/EndPoints/CobranzaOnlineDashboardEndPoints.cs` |
| PUT | `/api/cobranza/online/excluded-accounts/customer/{customerId:guid}` | `service.UpsertExcludedAccountAsync` | `CobranzaLuxuryApp/CobranzaOnline/EndPoints/CobranzaOnlineDashboardEndPoints.cs` |
| GET | `/api/cobranza/online/movements/customer/{customerId:guid}/year/{year:int}` | `service.GetMovimientosAsync` | `CobranzaLuxuryApp/CobranzaOnline/EndPoints/CobranzaOnlineMovementEndPoints.cs` |
| GET | `/api/cobranza/online/policies/customer/{customerId:guid}/year/{year:int}` | `service.GetPoliciesAsync` | `CobranzaLuxuryApp/CobranzaOnline/EndPoints/CobranzaOnlinePolicyEndPoints.cs` |
| GET | `/api/cobranza/online/cartera/customer/{customerId:guid}/year/{year:int}` | `service.GetCarteraAsync` | `CobranzaLuxuryApp/CobranzaOnline/EndPoints/CobranzaOnlinePortfolioEndPoints.cs` |
| GET | `/api/cobranza/online/reporte-financiero/customer/{customerId:guid}/year/{year:int}/from/{mesInicio:int}/to/{mesFin:int}` | `service.GetReporteFinancieroAsync` | `CobranzaLuxuryApp/CobranzaOnline/EndPoints/CobranzaOnlineReporteFinancieroEndPoints.cs` |
| GET | `/api/cobranza/online/statements/cuentas-nivel3/customer/{customerId:guid}` | `service.GetCuentasNivel3Async` | `CobranzaLuxuryApp/CobranzaOnline/EndPoints/CobranzaOnlineStatementEndPoints.cs` |
| GET | `/api/cobranza/online/statements/customer/{customerId:guid}/account/{accountId:guid}/year/{year:int}` | `service.GetEstadoCuentaAsync` | `CobranzaLuxuryApp/CobranzaOnline/EndPoints/CobranzaOnlineStatementEndPoints.cs` |


### Grupo: CommitteeLuxuryApp

#### Modulo: DTOs

- Interfaces: 0 | Servicios: 0 | Endpoints: 0 | DTOs: 13

#### Modulo: EndPoints

- Interfaces: 0 | Servicios: 0 | Endpoints: 11 | DTOs: 0

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/committee/home-images` | `appService.GetHomeImagesAsync` | `CommitteeLuxuryApp/EndPoints/CommitteeEndpoints.cs` |
| GET | `/api/committee/board-directors/financial-reports/{customerId:guid}` | `appService.GetFinancialReportsAsync` | `CommitteeLuxuryApp/EndPoints/CommitteeEndpoints.cs` |
| GET | `/api/committee/board-directors/monthly-meetings/{customerId:guid}` | `appService.GetMonthlyMeetingsAsync` | `CommitteeLuxuryApp/EndPoints/CommitteeEndpoints.cs` |
| GET | `/api/committee/board-directors/meeting-minutes/{customerId:guid}` | `appService.GetMeetingMinutesAsync` | `CommitteeLuxuryApp/EndPoints/CommitteeEndpoints.cs` |
| GET | `/api/committee/board-directors/meeting-minutes-detail/{meetingId:guid}` | `appService.GetMeetingMinuteDetailAsync` | `CommitteeLuxuryApp/EndPoints/CommitteeEndpoints.cs` |
| GET | `/api/committee/library/policy-contracts/{customerId:guid}/{isCurrent:bool}` | `appService.GetPolicyContractsAsync` | `CommitteeLuxuryApp/EndPoints/CommitteeEndpoints.cs` |
| GET | `/api/committee/library/building-insurance/{customerId:guid}` | `appService.GetBuildingInsuranceAsync` | `CommitteeLuxuryApp/EndPoints/CommitteeEndpoints.cs` |
| GET | `/api/committee/library/custom-documents/{customerId:guid}/{documentType}` | `appService.GetCustomDocumentsAsync` | `CommitteeLuxuryApp/EndPoints/CommitteeEndpoints.cs` |
| GET | `/api/committee/cobranza/morosos` | `appService.GetMorososReportAsync` | `CommitteeLuxuryApp/EndPoints/CommitteeEndpoints.cs` |
| GET | `/api/committee/cobranza/morosos/{numCta}/detalle` | `appService.GetMorosoDetailAsync` | `CommitteeLuxuryApp/EndPoints/CommitteeEndpoints.cs` |
| GET | `/api/committee/directorio/{customerId:guid}` | `appService.GetDirectorioAsync` | `CommitteeLuxuryApp/EndPoints/CommitteeEndpoints.cs` |

#### Modulo: Interfaces

- Interfaces: 2 | Servicios: 0 | Endpoints: 0 | DTOs: 0

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| ICommitteeAppService | 9 | `CommitteeLuxuryApp/Interfaces/ICommitteeAppService.cs` |
| ICommitteeCobranzaAppService | 2 | `CommitteeLuxuryApp/Interfaces/ICommitteeCobranzaAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetHomeImagesAsync | ICommitteeAppService | GET_LIST | `Task<ApiResponseDTO<CommitteeHomeImagesDTO>>` | `-` |
| GetFinancialReportsAsync | ICommitteeAppService | GET_LIST | `Task<ApiResponseDTO<List<CommitteeBoardDire…` | `Guid customerId` |
| GetMonthlyMeetingsAsync | ICommitteeAppService | GET_LIST | `Task<ApiResponseDTO<List<CommitteeBoardDire…` | `Guid customerId` |
| GetMeetingMinutesAsync | ICommitteeAppService | GET_LIST | `Task<ApiResponseDTO<List<CommitteeBoardDire…` | `Guid customerId` |
| GetMeetingMinuteDetailAsync | ICommitteeAppService | GET_LIST | `Task<ApiResponseDTO<CommitteeMeetingBoardDi…` | `Guid meetingId` |
| GetPolicyContractsAsync | ICommitteeAppService | GET_LIST | `Task<ApiResponseDTO<List<CommitteePolicyCon…` | `Guid customerId, bool isCurrent` |
| GetBuildingInsuranceAsync | ICommitteeAppService | GET_LIST | `Task<ApiResponseDTO<CommitteeBuildingInsura…` | `Guid customerId` |
| GetCustomDocumentsAsync | ICommitteeAppService | GET_LIST | `Task<ApiResponseDTO<List<CommitteeCustomDoc…` | `Guid customerId, DocumentType documentType` |
| GetDirectorioAsync | ICommitteeAppService | GET_LIST | `Task<ApiResponseDTO<List<CommitteeDirectori…` | `Guid customerId` |
| GetMorososReportAsync | ICommitteeCobranzaAppService | GET_LIST | `Task<ApiResponseDTO<CommitteeMorososRespons…` | `CommitteeMorososRequestDTO request` |
| GetMorosoDetailAsync | ICommitteeCobranzaAppService | GET_LIST | `Task<ApiResponseDTO<AspelCobranzaDetalleRes…` | `Guid customerId, string numCta, int? year, int? month` |

#### Modulo: Services

- Interfaces: 0 | Servicios: 2 | Endpoints: 0 | DTOs: 0

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| CommitteeAppService | 9 | `CommitteeLuxuryApp/Services/CommitteeAppService.cs` |
| CommitteeCobranzaAppService | 2 | `CommitteeLuxuryApp/Services/CommitteeCobranzaAppService.cs` |


### Grupo: ComprasLuxuryApp

#### Modulo: HistorialCompras

- Interfaces: 1 | Servicios: 1 | Endpoints: 1 | DTOs: 2

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IHistorialComprasAppService | 1 | `ComprasLuxuryApp/HistorialCompras/Interfaces/IHistorialComprasAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| HistorialComprasAppService | 1 | `ComprasLuxuryApp/HistorialCompras/Services/HistorialComprasAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetPagadasAsync | IHistorialComprasAppService | GET_LIST | `Task<ApiResponseDTO<List<OrdenesCompraPagad…` | `Guid customerId, HistorialComprasFilterDTO filter` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/compras/historial-compras/pagadas/{customerId:guid}` | - | `ComprasLuxuryApp/HistorialCompras/EndPoints/HistorialComprasEndPoints.cs` |

#### Modulo: PurchaseOrders

- Interfaces: 0 | Servicios: 0 | Endpoints: 0 | DTOs: 0

#### Modulo: SolicitudesCompra

- Interfaces: 6 | Servicios: 11 | Endpoints: 41 | DTOs: 32

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IComparativoAppService | 6 | `ComprasLuxuryApp/SolicitudesCompra/Comparativo/Interfaces/IComparativoAppService.cs` |
| ICotizacionProveedorAppService | 8 | `ComprasLuxuryApp/SolicitudesCompra/Cotizaciones/Interfaces/ICotizacionProveedorAppService.cs` |
| ISolicitudCompraDetalleAppService | 8 | `ComprasLuxuryApp/SolicitudesCompra/Detalle/Interfaces/ISolicitudCompraDetalleAppService.cs` |
| IEvidenciaAppService | 4 | `ComprasLuxuryApp/SolicitudesCompra/Evidencia/Interfaces/IEvidenciaAppService.cs` |
| IPresupuestoAppService | 3 | `ComprasLuxuryApp/SolicitudesCompra/Presupuesto/Interfaces/IPresupuestoAppService.cs` |
| ISolicitudCompraAppService | 13 | `ComprasLuxuryApp/SolicitudesCompra/Solicitudes/Interfaces/ISolicitudCompraAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| ComparativoAppService | 6 | `ComprasLuxuryApp/SolicitudesCompra/Comparativo/Services/ComparativoAppService.cs` |
| CotizacionMapper | 0 | `ComprasLuxuryApp/SolicitudesCompra/Cotizaciones/Mapping/CotizacionMapper.cs` |
| CotizacionProveedorAppService | 8 | `ComprasLuxuryApp/SolicitudesCompra/Cotizaciones/Services/CotizacionProveedorAppService.cs` |
| DetalleMapper | 0 | `ComprasLuxuryApp/SolicitudesCompra/Detalle/Mapping/DetalleMapper.cs` |
| SolicitudCompraDetalleAppService | 8 | `ComprasLuxuryApp/SolicitudesCompra/Detalle/Services/SolicitudCompraDetalleAppService.cs` |
| EvidenciaMapper | 0 | `ComprasLuxuryApp/SolicitudesCompra/Evidencia/Mapping/EvidenciaMapper.cs` |
| EvidenciaAppService | 4 | `ComprasLuxuryApp/SolicitudesCompra/Evidencia/Services/EvidenciaAppService.cs` |
| PresupuestoMapper | 0 | `ComprasLuxuryApp/SolicitudesCompra/Presupuesto/Mapping/PresupuestoMapper.cs` |
| PresupuestoAppService | 3 | `ComprasLuxuryApp/SolicitudesCompra/Presupuesto/Services/PresupuestoAppService.cs` |
| SolicitudCompraMapper | 0 | `ComprasLuxuryApp/SolicitudesCompra/Solicitudes/Mapping/SolicitudCompraMapper.cs` |
| SolicitudCompraAppService | 13 | `ComprasLuxuryApp/SolicitudesCompra/Solicitudes/Services/SolicitudCompraAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetSolicitudCompraCuadroComparativoDTOAsync | IComparativoAppService | GET_LIST | `Task<ApiResponseDTO<SolicitudCompraCuadroCo…` | `Guid id` |
| UpdateCuadroComparativoAsync | IComparativoAppService | UPDATE | `Task<ApiResponseDTO<SolicitudCompra>>` | `Guid id, SolicitudCompraCuadroComparativoUpdateDTO dto` |
| AnalyzeComparativeChartAsync | IComparativoAppService | GET_LIST | `Task<ApiResponseDTO<string>>` | `Guid solicitudCompraId` |
| DeleteProvider | IComparativoAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid solicitudCompraId, Guid cotizacionProveedorId` |
| GetPosicionCotizacion | IComparativoAppService | GET_LIST | `ApiResponseDTO<GetPosicionCotizacionDTO>` | `Guid solicitudCompraId, int posicion` |
| GetSCDTO | IComparativoAppService | GET_LIST | `Task<ApiResponseDTO<SCDTO>>` | `Guid id` |
| ListAsync | ICotizacionProveedorAppService | GET_LIST | `Task<ApiResponseDTO<List<CotizacionProveedo…` | `-` |
| GetByIdAsync | ICotizacionProveedorAppService | GET_SINGLE | `Task<ApiResponseDTO<CotizacionProveedorDTO>>` | `Guid id` |
| GetProviders | ICotizacionProveedorAppService | GET_LIST | `ApiResponseDTO<IEnumerable<SelectItemDTO<Gu…` | `Guid solicitudCompraId` |
| AddAsync | ICotizacionProveedorAppService | CREATE | `Task<ApiResponseDTO<CotizacionProveedor>>` | `CotizacionProveedorAddOrEditDTO DTO` |
| UpdateAsync | ICotizacionProveedorAppService | UPDATE | `Task<ApiResponseDTO<CotizacionProveedor>>` | `Guid id, CotizacionProveedorAddOrEditDTO DTO` |
| UpdateProviderAsync | ICotizacionProveedorAppService | UPDATE | `Task<ApiResponseDTO<CotizacionProveedor>>` | `Guid id, CotizacionProveedorAddOrEditDTO DTO` |
| DeleteByIdAsync | ICotizacionProveedorAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| RemoveFileAsync | ICotizacionProveedorAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetByIdAsync | ISolicitudCompraDetalleAppService | GET_SINGLE | `Task<ApiResponseDTO<SolicitudCompraDetalleD…` | `Guid id` |
| GetSolicitudCompraDetalleEditProductDTO | ISolicitudCompraDetalleAppService | GET_LIST | `Task<ApiResponseDTO<SolicitudCompraDetalleE…` | `Guid id` |
| UpdateCantidadUnidadAsync | ISolicitudCompraDetalleAppService | UPDATE | `Task<ApiResponseDTO<SolicitudCompraDetalle>>` | `Guid id, SolicitudCompraDetalleEditProductDTO DTO` |
| UpdatePriceAsync | ISolicitudCompraDetalleAppService | UPDATE | `Task<ApiResponseDTO<SolicitudCompraDetalle>>` | `Guid id, SolicitudCompraDetalleEditPriceDTO DTO` |
| AddAsync | ISolicitudCompraDetalleAppService | CREATE | `Task<ApiResponseDTO<SolicitudCompraDetalle>>` | `SolicitudCompraDetalleAddProductDTO DTO` |
| GetProductListAddDTO | ISolicitudCompraDetalleAppService | GET_LIST | `Task<ApiResponseDTO<SearchProductToAddDTO>>` | `PaginationCommonDTO paginator, Guid solicitudCompraId` |
| SearchToAddRequest | ISolicitudCompraDetalleAppService | GET_LIST | `Task<ApiResponseDTO<IEnumerable<SolicitudCo…` | `Guid solicitudCompraId, string param` |
| DeleteByIdAsync | ISolicitudCompraDetalleAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| AddSolicitudEvidenceAsync | IEvidenciaAppService | CREATE | `Task<ApiResponseDTO<SolicitudCompraEvidence…` | `Guid solicitudCompraId, SolicitudCompraEvidenceCreateDTO dto` |
| DeleteSolicitudEvidenceAsync | IEvidenciaAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid evidenceId` |
| AddCotizacionEvidenceAsync | IEvidenciaAppService | CREATE | `Task<ApiResponseDTO<CotizacionProveedorEvid…` | `Guid cotizacionProveedorId, CotizacionProveedorEvidenceCrea…` |
| DeleteCotizacionEvidenceAsync | IEvidenciaAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid evidenceId` |
| GetAvailableBudgetsAsync | IPresupuestoAppService | GET_LIST | `Task<ApiResponseDTO<BudgetToPurchaseOrderDT…` | `Guid solicitudCompraId` |
| AddBudgetAsync | IPresupuestoAppService | CREATE | `Task<ApiResponseDTO<SolicitudCompraBudgetDT…` | `Guid solicitudCompraId, SolicitudCompraBudgetCreateDTO dto` |
| DeleteBudgetAsync | IPresupuestoAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid budgetId` |
| GetSolicitudCompraIndexDTO | ISolicitudCompraAppService | GET_LIST | `Task<ApiResponseDTO<IEnumerable<Solicitudes…` | `Guid customerId, StatusOrdenCompra estatus` |
| GetIdSolicitudCompraAsync | ISolicitudCompraAppService | GET_LIST | `Task<ApiResponseDTO<Guid>>` | `string folioSolicitudCompra, Guid customerId` |
| GetSolicitudCompraIndividual | ISolicitudCompraAppService | GET_LIST | `Task<ApiResponseDTO<SolicitudCompraIndividu…` | `Guid id` |
| AddAsync | ISolicitudCompraAppService | CREATE | `Task<ApiResponseDTO<SolicitudCompra>>` | `SolicitudCompraAddOrEditDTO DTO` |
| UpdateAsync | ISolicitudCompraAppService | UPDATE | `Task<ApiResponseDTO<SolicitudCompra>>` | `Guid id, SolicitudCompraAddOrEditDTO DTO` |
| DeleteSolicitudComplete | ISolicitudCompraAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| UploadRequestPdfAsync | ISolicitudCompraAppService | SPECIAL | `Task<ApiResponseDTO<string>>` | `Guid id, IFormFile file` |
| GetSelectedForPresentationAsync | ISolicitudCompraAppService | GET_LIST | `Task<ApiResponseDTO<IEnumerable<Solicitudes…` | `Guid customerId` |
| UpdatePresentationSelectionAsync | ISolicitudCompraAppService | UPDATE | `Task<ApiResponseDTO<SolicitudCompra>>` | `Guid id, SolicitudCompraPresentationSelectionDTO dto` |
| UpdatePresentationOrderAsync | ISolicitudCompraAppService | UPDATE | `Task<ApiResponseDTO<bool>>` | `SolicitudCompraPresentationOrderDTO dto` |
| UploadSupportPdfAsync | ISolicitudCompraAppService | SPECIAL | `Task<ApiResponseDTO<string>>` | `Guid id, IFormFile file` |
| DeleteSupportPdfAsync | ISolicitudCompraAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetComiteEventsAsync | ISolicitudCompraAppService | GET_LIST | `ApiResponseDTO<IEnumerable<ComiteEventoDTO>>` | `Guid customerId` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/solicitud-compra/cuadro-comparativo/{id:guid}` | `appService.GetSolicitudCompraCuadroComparativoDTOAsync` | `ComprasLuxuryApp/SolicitudesCompra/Comparativo/EndPoints/ComparativoEndPoints.cs` |
| PUT | `/api/solicitud-compra/cuadro-comparativo/{id:guid}` | `appService.UpdateCuadroComparativoAsync` | `ComprasLuxuryApp/SolicitudesCompra/Comparativo/EndPoints/ComparativoEndPoints.cs` |
| DELETE | `/api/solicitud-compra/delete-provider/{solicitudCompraId:guid}/{cotizacionProveedorId:guid}` | `appService.AnalyzeComparativeChartAsync` | `ComprasLuxuryApp/SolicitudesCompra/Comparativo/EndPoints/ComparativoEndPoints.cs` |
| POST | `/api/solicitud-compra/analyze-comparative-chart/{id:guid}` | `appService.AnalyzeComparativeChartAsync` | `ComprasLuxuryApp/SolicitudesCompra/Comparativo/EndPoints/ComparativoEndPoints.cs` |
| GET | `/api/solicitud-compra/posicion-cotizacion/{solicitudCompraId:guid}/{posicion:int}` | - | `ComprasLuxuryApp/SolicitudesCompra/Comparativo/EndPoints/ComparativoEndPoints.cs` |
| GET | `/api/solicitud-compra/{id:guid}` | - | `ComprasLuxuryApp/SolicitudesCompra/Comparativo/EndPoints/ComparativoEndPoints.cs` |
| GET | `/api/cotizacion-proveedor` | `dataService.ListAsync` | `ComprasLuxuryApp/SolicitudesCompra/Cotizaciones/EndPoints/CotizacionProveedorEndPoints.cs` |
| GET | `/api/cotizacion-proveedor/{id:guid}` | `dataService.GetByIdAsync` | `ComprasLuxuryApp/SolicitudesCompra/Cotizaciones/EndPoints/CotizacionProveedorEndPoints.cs` |
| GET | `/api/cotizacion-proveedor/provider/{solicitudCompraId:guid}` | `dataService.AddAsync` | `ComprasLuxuryApp/SolicitudesCompra/Cotizaciones/EndPoints/CotizacionProveedorEndPoints.cs` |
| POST | `/api/cotizacion-proveedor` | `dataService.AddAsync` | `ComprasLuxuryApp/SolicitudesCompra/Cotizaciones/EndPoints/CotizacionProveedorEndPoints.cs` |
| PUT | `/api/cotizacion-proveedor/{id:guid}` | `dataService.UpdateAsync` | `ComprasLuxuryApp/SolicitudesCompra/Cotizaciones/EndPoints/CotizacionProveedorEndPoints.cs` |
| PUT | `/api/cotizacion-proveedor/update-provider/{id:guid}` | `dataService.UpdateProviderAsync` | `ComprasLuxuryApp/SolicitudesCompra/Cotizaciones/EndPoints/CotizacionProveedorEndPoints.cs` |
| DELETE | `/api/cotizacion-proveedor/{id:guid}` | `dataService.DeleteByIdAsync` | `ComprasLuxuryApp/SolicitudesCompra/Cotizaciones/EndPoints/CotizacionProveedorEndPoints.cs` |
| DELETE | `/api/cotizacion-proveedor/remove-file/{id:guid}` | `dataService.RemoveFileAsync` | `ComprasLuxuryApp/SolicitudesCompra/Cotizaciones/EndPoints/CotizacionProveedorEndPoints.cs` |
| GET | `/api/solicitud-compra-detalle/{id:guid}` | `appService.GetByIdAsync` | `ComprasLuxuryApp/SolicitudesCompra/Detalle/EndPoints/SolicitudCompraDetalleEndPoints.cs` |
| GET | `/api/solicitud-compra-detalle/edit-product/{id:guid}` | `appService.UpdateCantidadUnidadAsync` | `ComprasLuxuryApp/SolicitudesCompra/Detalle/EndPoints/SolicitudCompraDetalleEndPoints.cs` |
| PUT | `/api/solicitud-compra-detalle/{id:guid}` | `appService.UpdateCantidadUnidadAsync` | `ComprasLuxuryApp/SolicitudesCompra/Detalle/EndPoints/SolicitudCompraDetalleEndPoints.cs` |
| PUT | `/api/solicitud-compra-detalle/update-price/{id:guid}` | `appService.UpdatePriceAsync` | `ComprasLuxuryApp/SolicitudesCompra/Detalle/EndPoints/SolicitudCompraDetalleEndPoints.cs` |
| POST | `/api/solicitud-compra-detalle` | `appService.AddAsync` | `ComprasLuxuryApp/SolicitudesCompra/Detalle/EndPoints/SolicitudCompraDetalleEndPoints.cs` |
| GET | `/api/solicitud-compra-detalle/add-product/{solicitudCompraId:guid}` | - | `ComprasLuxuryApp/SolicitudesCompra/Detalle/EndPoints/SolicitudCompraDetalleEndPoints.cs` |
| GET | `/api/solicitud-compra-detalle/search-to-add-request/{solicitudCompraId:guid}` | `appService.DeleteByIdAsync` | `ComprasLuxuryApp/SolicitudesCompra/Detalle/EndPoints/SolicitudCompraDetalleEndPoints.cs` |
| DELETE | `/api/solicitud-compra-detalle/{id:guid}` | `appService.DeleteByIdAsync` | `ComprasLuxuryApp/SolicitudesCompra/Detalle/EndPoints/SolicitudCompraDetalleEndPoints.cs` |
| POST | `/api/solicitud-compra/cuadro-comparativo/{id:guid}/evidences` | `appService.AddSolicitudEvidenceAsync` | `ComprasLuxuryApp/SolicitudesCompra/Evidencia/EndPoints/EvidenciaEndPoints.cs` |
| DELETE | `/api/solicitud-compra/cuadro-comparativo/evidences/{evidenceId:guid}` | `appService.DeleteSolicitudEvidenceAsync` | `ComprasLuxuryApp/SolicitudesCompra/Evidencia/EndPoints/EvidenciaEndPoints.cs` |
| POST | `/api/solicitud-compra/{id:guid}/evidences` | `appService.AddCotizacionEvidenceAsync` | `ComprasLuxuryApp/SolicitudesCompra/Evidencia/EndPoints/EvidenciaEndPoints.cs` |
| DELETE | `/api/solicitud-compra/evidences/{evidenceId:guid}` | `appService.DeleteCotizacionEvidenceAsync` | `ComprasLuxuryApp/SolicitudesCompra/Evidencia/EndPoints/EvidenciaEndPoints.cs` |
| GET | `/api/solicitud-compra/cuadro-comparativo/{id:guid}/budgets` | `appService.GetAvailableBudgetsAsync` | `ComprasLuxuryApp/SolicitudesCompra/Presupuesto/EndPoints/PresupuestoEndPoints.cs` |
| POST | `/api/solicitud-compra/cuadro-comparativo/{id:guid}/budgets` | `appService.AddBudgetAsync` | `ComprasLuxuryApp/SolicitudesCompra/Presupuesto/EndPoints/PresupuestoEndPoints.cs` |
| DELETE | `/api/solicitud-compra/cuadro-comparativo/budgets/{budgetId:guid}` | `appService.DeleteBudgetAsync` | `ComprasLuxuryApp/SolicitudesCompra/Presupuesto/EndPoints/PresupuestoEndPoints.cs` |
| GET | `/api/solicitud-compra/list/{customerId:guid}/{estatus}` | `appService.GetIdSolicitudCompraAsync` | `ComprasLuxuryApp/SolicitudesCompra/Solicitudes/EndPoints/SolicitudCompraEndPoints.cs` |
| GET | `/api/solicitud-compra/get-id-solicitud-compra/{folioSolicitudCompra}/{customerId:guid}` | `appService.GetIdSolicitudCompraAsync` | `ComprasLuxuryApp/SolicitudesCompra/Solicitudes/EndPoints/SolicitudCompraEndPoints.cs` |
| GET | `/api/solicitud-compra/get-solicitud-compra-individual/{id:guid}` | `appService.GetSelectedForPresentationAsync` | `ComprasLuxuryApp/SolicitudesCompra/Solicitudes/EndPoints/SolicitudCompraEndPoints.cs` |
| GET | `/api/solicitud-compra/presentation/{customerId:guid}` | `appService.GetSelectedForPresentationAsync` | `ComprasLuxuryApp/SolicitudesCompra/Solicitudes/EndPoints/SolicitudCompraEndPoints.cs` |
| PUT | `/api/solicitud-compra/presentation/{id:guid}/selection` | `appService.UpdatePresentationSelectionAsync` | `ComprasLuxuryApp/SolicitudesCompra/Solicitudes/EndPoints/SolicitudCompraEndPoints.cs` |
| PUT | `/api/solicitud-compra/presentation/order` | `appService.UpdatePresentationOrderAsync` | `ComprasLuxuryApp/SolicitudesCompra/Solicitudes/EndPoints/SolicitudCompraEndPoints.cs` |
| PUT | `/api/solicitud-compra/{id:guid}` | `appService.UpdateAsync` | `ComprasLuxuryApp/SolicitudesCompra/Solicitudes/EndPoints/SolicitudCompraEndPoints.cs` |
| POST | `/api/solicitud-compra` | `appService.AddAsync` | `ComprasLuxuryApp/SolicitudesCompra/Solicitudes/EndPoints/SolicitudCompraEndPoints.cs` |
| DELETE | `/api/solicitud-compra/{id:guid}` | `appService.UploadSupportPdfAsync` | `ComprasLuxuryApp/SolicitudesCompra/Solicitudes/EndPoints/SolicitudCompraEndPoints.cs` |
| POST | `/api/solicitud-compra/{id:guid}/support-file` | `appService.UploadSupportPdfAsync` | `ComprasLuxuryApp/SolicitudesCompra/Solicitudes/EndPoints/SolicitudCompraEndPoints.cs` |
| DELETE | `/api/solicitud-compra/{id:guid}/support-file` | `appService.DeleteSupportPdfAsync` | `ComprasLuxuryApp/SolicitudesCompra/Solicitudes/EndPoints/SolicitudCompraEndPoints.cs` |
| GET | `/api/solicitud-compra/comite-events/{customerId:guid}` | `appService.GetComiteEventsAsync` | `ComprasLuxuryApp/SolicitudesCompra/Solicitudes/EndPoints/SolicitudCompraEndPoints.cs` |


### Grupo: ContabilidadLuxuryApp

#### Modulo: AccountingCatalogs

- Interfaces: 1 | Servicios: 2 | Endpoints: 1 | DTOs: 4

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IAccountingCatalogAppService | 1 | `ContabilidadLuxuryApp/AccountingCatalogs/Interfaces/IAccountingCatalogAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| AccountingCatalogMapper | 0 | `ContabilidadLuxuryApp/AccountingCatalogs/Mapping/AccountingCatalogMapper.cs` |
| AccountingCatalogAppService | 1 | `ContabilidadLuxuryApp/AccountingCatalogs/Services/AccountingCatalogAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetAllByCustomerIdAsync | IAccountingCatalogAppService | GET_LIST | `Task<ApiResponseDTO<IEnumerable<GroupedAcco…` | `Guid customerId, int year` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/accounting-catalog/customer/{customerId:guid}` | `accountingCatalogService.GetAllByCustomerIdAsync` | `ContabilidadLuxuryApp/AccountingCatalogs/EndPoints/AccountingCatalogEndPoints.cs` |

#### Modulo: AutitoriaCuentasAspel

- Interfaces: 1 | Servicios: 1 | Endpoints: 1 | DTOs: 1

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IAutitoriaCuentasAspelService | 1 | `ContabilidadLuxuryApp/AutitoriaCuentasAspel/Interfaces/IAutitoriaCuentasAspelService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| AutitoriaCuentasAspelService | 1 | `ContabilidadLuxuryApp/AutitoriaCuentasAspel/Services/AutitoriaCuentasAspelService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetComparativaAsync | IAutitoriaCuentasAspelService | GET_LIST | `Task<ApiResponseDTO<AutitoriaCuentasAspelRe…` | `int intYear, AspelEmpresa empresa` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/autitoria-cuentas-aspel` | `autitoriaService.GetComparativaAsync` | `ContabilidadLuxuryApp/AutitoriaCuentasAspel/EndPoints/AutitoriaCuentasAspelEndPoints.cs` |

#### Modulo: CatalogoGastosFijos

- Interfaces: 1 | Servicios: 2 | Endpoints: 6 | DTOs: 2

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| ICatalogoGastosFijosAppService | 6 | `ContabilidadLuxuryApp/CatalogoGastosFijos/Interfaces/ICatalogoGastosFijosAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| CatalogoGastosFijosMapper | 0 | `ContabilidadLuxuryApp/CatalogoGastosFijos/Mapping/CatalogoGastosFijosMapper.cs` |
| CatalogoGastosFijosAppService | 6 | `ContabilidadLuxuryApp/CatalogoGastosFijos/Services/CatalogoGastosFijosAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetByIdAsync | ICatalogoGastosFijosAppService | GET_SINGLE | `Task<ApiResponseDTO<CatalogoGastosFijosDTO>>` | `Guid id` |
| GetAllAsync | ICatalogoGastosFijosAppService | GET_LIST | `Task<ApiResponseDTO<IEnumerable<CatalogoGas…` | `Guid customerId` |
| ValidarCreateOrderAsync | ICatalogoGastosFijosAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid id, bool value` |
| DeleteByIdAsync | ICatalogoGastosFijosAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| AddAsync | ICatalogoGastosFijosAppService | CREATE | `Task<ApiResponseDTO<CatalogoGastosFijosDTO>>` | `CatalogoGastosFijosAddOrEditDTO DTO` |
| UpdateAsync | ICatalogoGastosFijosAppService | UPDATE | `Task<ApiResponseDTO<CatalogoGastosFijosDTO>>` | `Guid id, CatalogoGastosFijosAddOrEditDTO DTO` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/catalogo-gastos-fijos/{id:guid}` | `dataService.GetByIdAsync` | `ContabilidadLuxuryApp/CatalogoGastosFijos/EndPoints/CatalogoGastosFijosEndPoints.cs` |
| GET | `/api/catalogo-gastos-fijos/list/{customerId:guid}` | `dataService.GetAllAsync` | `ContabilidadLuxuryApp/CatalogoGastosFijos/EndPoints/CatalogoGastosFijosEndPoints.cs` |
| POST | `/api/catalogo-gastos-fijos` | `dataService.AddAsync` | `ContabilidadLuxuryApp/CatalogoGastosFijos/EndPoints/CatalogoGastosFijosEndPoints.cs` |
| PUT | `/api/catalogo-gastos-fijos/{id:guid}` | `dataService.UpdateAsync` | `ContabilidadLuxuryApp/CatalogoGastosFijos/EndPoints/CatalogoGastosFijosEndPoints.cs` |
| GET | `/api/catalogo-gastos-fijos/update-validation/{id:guid}/{value:bool}` | `dataService.ValidarCreateOrderAsync` | `ContabilidadLuxuryApp/CatalogoGastosFijos/EndPoints/CatalogoGastosFijosEndPoints.cs` |
| DELETE | `/api/catalogo-gastos-fijos/{id:guid}` | `dataService.DeleteByIdAsync` | `ContabilidadLuxuryApp/CatalogoGastosFijos/EndPoints/CatalogoGastosFijosEndPoints.cs` |

#### Modulo: ContabilidadConfig

- Interfaces: 3 | Servicios: 4 | Endpoints: 4 | DTOs: 5

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IAspelCustomerEmpresaAppService | 4 | `ContabilidadLuxuryApp/ContabilidadConfig/Interfaces/IAspelCustomerEmpresaAppService.cs` |
| IBillingConfigAppService | 2 | `ContabilidadLuxuryApp/ContabilidadConfig/Interfaces/IBillingConfigAppService.cs` |
| ICoiMapeoAppService | 4 | `ContabilidadLuxuryApp/ContabilidadConfig/Interfaces/ICoiMapeoAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| AspelCustomerEmpresaMappingProfile | 0 | `ContabilidadLuxuryApp/ContabilidadConfig/Mapping/AspelCustomerEmpresaMappingProfile.cs` |
| AspelCustomerEmpresaAppService | 4 | `ContabilidadLuxuryApp/ContabilidadConfig/Services/AspelCustomerEmpresaAppService.cs` |
| BillingConfigAppService | 2 | `ContabilidadLuxuryApp/ContabilidadConfig/Services/BillingConfigAppService.cs` |
| CoiMapeoAppService | 4 | `ContabilidadLuxuryApp/ContabilidadConfig/Services/CoiMapeoAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetAllAsync | IAspelCustomerEmpresaAppService | GET_LIST | `Task<ApiResponseDTO<IEnumerable<AspelCustom…` | `-` |
| CreateAsync | IAspelCustomerEmpresaAppService | CREATE | `Task<ApiResponseDTO<AspelCustomerEmpresaDTO…` | `AspelCustomerEmpresaCreateDTO createDTO` |
| UpdateAsync | IAspelCustomerEmpresaAppService | UPDATE | `Task<ApiResponseDTO<AspelCustomerEmpresaDTO…` | `Guid id, AspelCustomerEmpresaUpdateDTO updateDTO` |
| DeleteAsync | IAspelCustomerEmpresaAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetByCustomerIdAsync | IBillingConfigAppService | GET_LIST | `Task<ApiResponseDTO<BillingConfigResponseDT…` | `Guid customerId` |
| UpsertAsync | IBillingConfigAppService | UPDATE | `Task<ApiResponseDTO<BillingConfigResponseDT…` | `UpsertBillingConfigDTO dto` |
| GetEstadoMapeoAsync | ICoiMapeoAppService | GET_LIST | `Task<ActionResult<ApiResponseDTO<List<CoiMa…` | `Guid customerId` |
| GetPropertiesDisponiblesAsync | ICoiMapeoAppService | GET_LIST | `Task<ActionResult<ApiResponseDTO<List<CoiMa…` | `Guid customerId` |
| ActualizarMapeoAsync | ICoiMapeoAppService | OTHER | `Task<ActionResult<ApiResponseDTO<CoiMapeoAc…` | `Guid customerId, CoiMapeoUpdateDTO dto` |
| AutoMapeoAsync | ICoiMapeoAppService | OTHER | `Task<ActionResult<ApiResponseDTO<int>>>` | `Guid customerId` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/aspel-customer-empresa` | `appService.GetAllAsync` | `ContabilidadLuxuryApp/ContabilidadConfig/EndPoints/AspelCustomerEmpresaEndPoints.cs` |
| POST | `/api/aspel-customer-empresa` | `appService.CreateAsync` | `ContabilidadLuxuryApp/ContabilidadConfig/EndPoints/AspelCustomerEmpresaEndPoints.cs` |
| PUT | `/api/aspel-customer-empresa/{id:guid}` | `appService.UpdateAsync` | `ContabilidadLuxuryApp/ContabilidadConfig/EndPoints/AspelCustomerEmpresaEndPoints.cs` |
| DELETE | `/api/aspel-customer-empresa/{id:guid}` | `appService.DeleteAsync` | `ContabilidadLuxuryApp/ContabilidadConfig/EndPoints/AspelCustomerEmpresaEndPoints.cs` |

#### Modulo: ContabilidadMigration

- Interfaces: 0 | Servicios: 2 | Endpoints: 0 | DTOs: 2

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| CobranzaMigratorService | 1 | `ContabilidadLuxuryApp/ContabilidadMigration/Services/CobranzaMigratorService.cs` |
| ContabilidadMigratorService | 1 | `ContabilidadLuxuryApp/ContabilidadMigration/Services/ContabilidadMigratorService.cs` |

#### Modulo: ContabilidadOnline

- Interfaces: 14 | Servicios: 16 | Endpoints: 18 | DTOs: 30

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IAnalisisCobranzaOnlineService | 1 | `ContabilidadLuxuryApp/ContabilidadOnline/Interfaces/IAnalisisCobranzaOnlineService.cs` |
| IAnalisisCobranzaService | 1 | `ContabilidadLuxuryApp/ContabilidadOnline/Interfaces/IAnalisisCobranzaService.cs` |
| IBancosInversionesService | 1 | `ContabilidadLuxuryApp/ContabilidadOnline/Interfaces/IBancosInversionesService.cs` |
| ICedulaExtraordinariaService | 1 | `ContabilidadLuxuryApp/ContabilidadOnline/Interfaces/ICedulaExtraordinariaService.cs` |
| ICedulaPresupuestalService | 1 | `ContabilidadLuxuryApp/ContabilidadOnline/Interfaces/ICedulaPresupuestalService.cs` |
| IEpfService | 2 | `ContabilidadLuxuryApp/ContabilidadOnline/Interfaces/IEpfService.cs` |
| IEstadoResultadosService | 1 | `ContabilidadLuxuryApp/ContabilidadOnline/Interfaces/IEstadoResultadosService.cs` |
| IEstadoResultadosServiceV2 | 1 | `ContabilidadLuxuryApp/ContabilidadOnline/Interfaces/IEstadoResultadosServiceV2.cs` |
| IFlujoCajaService | 1 | `ContabilidadLuxuryApp/ContabilidadOnline/Interfaces/IFlujoCajaService.cs` |
| IFondoReservaService | 1 | `ContabilidadLuxuryApp/ContabilidadOnline/Interfaces/IFondoReservaService.cs` |
| IPresupuestoContabilidadService | 1 | `ContabilidadLuxuryApp/ContabilidadOnline/Interfaces/IPresupuestoContabilidadService.cs` |
| IProyectosAprobadosService | 1 | `ContabilidadLuxuryApp/ContabilidadOnline/Interfaces/IProyectosAprobadosService.cs` |
| IReporteFinancieroService | 1 | `ContabilidadLuxuryApp/ContabilidadOnline/Interfaces/IReporteFinancieroService.cs` |
| IValidacionCatalogoService | 1 | `ContabilidadLuxuryApp/ContabilidadOnline/Interfaces/IValidacionCatalogoService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| CoiCobranzaPolicy | 0 | `ContabilidadLuxuryApp/ContabilidadOnline/Entities/CoiCobranzaPolicy.cs` |
| AnalisisCobranzaOnlineService | 1 | `ContabilidadLuxuryApp/ContabilidadOnline/Services/AnalisisCobranzaOnlineService.cs` |
| AnalisisCobranzaService | 1 | `ContabilidadLuxuryApp/ContabilidadOnline/Services/AnalisisCobranzaService.cs` |
| BancosInversionesService | 1 | `ContabilidadLuxuryApp/ContabilidadOnline/Services/BancosInversionesService.cs` |
| CedulaExtraordinariaService | 1 | `ContabilidadLuxuryApp/ContabilidadOnline/Services/CedulaExtraordinariaService.cs` |
| CedulaPresupuestalService | 1 | `ContabilidadLuxuryApp/ContabilidadOnline/Services/CedulaPresupuestalService.cs` |
| ContabilidadOnlineLocalService | 4 | `ContabilidadLuxuryApp/ContabilidadOnline/Services/ContabilidadOnlineLocalService.cs` |
| ContabilidadReportBaseService | 7 | `ContabilidadLuxuryApp/ContabilidadOnline/Services/ContabilidadReportBaseService.cs` |
| EpfService | 2 | `ContabilidadLuxuryApp/ContabilidadOnline/Services/EpfService.cs` |
| EstadoResultadosService | 1 | `ContabilidadLuxuryApp/ContabilidadOnline/Services/EstadoResultadosService.cs` |
| FlujoCajaService | 1 | `ContabilidadLuxuryApp/ContabilidadOnline/Services/FlujoCajaService.cs` |
| FondoReservaService | 1 | `ContabilidadLuxuryApp/ContabilidadOnline/Services/FondoReservaService.cs` |
| PresupuestoContabilidadService | 1 | `ContabilidadLuxuryApp/ContabilidadOnline/Services/PresupuestoContabilidadService.cs` |
| ProyectosAprobadosService | 1 | `ContabilidadLuxuryApp/ContabilidadOnline/Services/ProyectosAprobadosService.cs` |
| ReporteFinancieroService | 1 | `ContabilidadLuxuryApp/ContabilidadOnline/Services/ReporteFinancieroService.cs` |
| ValidacionCatalogoService | 1 | `ContabilidadLuxuryApp/ContabilidadOnline/Services/ValidacionCatalogoService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetAnalisisCobranzaOnlineAsync | IAnalisisCobranzaOnlineService | GET_LIST | `Task<ApiResponseDTO<CobranzaOnlineAnalysisR…` | `Guid customerId, int year, int month, int day` |
| GetAnalisisCobranzaAsync | IAnalisisCobranzaService | GET_LIST | `Task<ApiResponseDTO<AnalisisCobranzaDTO>>` | `Guid customerId, int fiscalYear, int mes` |
| GetBancosInversionesAsync | IBancosInversionesService | GET_LIST | `Task<ApiResponseDTO<BancosInversionesDTO>>` | `Guid customerId, int fiscalYear, int mes` |
| GetCedulaExtraordinariaAsync | ICedulaExtraordinariaService | GET_LIST | `Task<ApiResponseDTO<CedulaExtraordinariaDTO…` | `Guid customerId, int fiscalYear, int mes` |
| GetCedulaPresupuestalAsync | ICedulaPresupuestalService | GET_LIST | `Task<ApiResponseDTO<FinancialStatementDTO>>` | `Guid customerId, int fiscalYear, int mes` |
| GetEpfAsync | IEpfService | GET_LIST | `Task<ApiResponseDTO<EpfDTO>>` | `Guid customerId, int fiscalYear, int mes` |
| GetBalanceSheetAsync | IEpfService | GET_LIST | `Task<ApiResponseDTO<FinancialStatementDTO>>` | `Guid customerId, int fiscalYear` |
| GetEstadoResultadosAsync | IEstadoResultadosService | GET_LIST | `Task<ApiResponseDTO<FinancialStatementDTO>>` | `Guid customerId, int fiscalYear, int mes` |
| GetEstadoResultadosAsync | IEstadoResultadosServiceV2 | GET_LIST | `Task<ApiResponseDTO<FinancialStatementDTO>>` | `Guid customerId, int fiscalYear, int mes` |
| GetFlujoCajaAsync | IFlujoCajaService | GET_LIST | `Task<ApiResponseDTO<FlujoCajaDTO>>` | `Guid customerId, int fiscalYear` |
| GetFondoReservaAsync | IFondoReservaService | GET_LIST | `Task<ApiResponseDTO<FondoReservaDTO>>` | `Guid customerId, int fiscalYear, int mes` |
| GetPresupuestoContabilidadAsync | IPresupuestoContabilidadService | GET_LIST | `Task<ApiResponseDTO<PresupuestoContabilidad…` | `Guid customerId, int fiscalYear, int mes` |
| GetProyectosAprobadosAsync | IProyectosAprobadosService | GET_LIST | `Task<ApiResponseDTO<ProyectosAprobadosDTO>>` | `Guid customerId, int fiscalYear` |
| GetReporteFinancieroAsync | IReporteFinancieroService | GET_LIST | `Task<ApiResponseDTO<ReporteFinancieroDTO>>` | `Guid customerId, int fiscalYear, int mes` |
| GetCatalogValidationAsync | IValidacionCatalogoService | GET_LIST | `Task<ApiResponseDTO<FinancialStatementDTO>>` | `Guid customerId, int fiscalYear` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/contabilidad-online/estado-posicion-financiera/{customerId:guid}/{year:int}/{mes:int}` | `epfService.GetEpfAsync` | `ContabilidadLuxuryApp/ContabilidadOnline/EndPoints/ContabilidadOnlineEndPoints.cs` |
| GET | `/api/contabilidad-online/estado-posicion-financiera/{customerId:guid}/{year:int}` | `epfService.GetBalanceSheetAsync` | `ContabilidadLuxuryApp/ContabilidadOnline/EndPoints/ContabilidadOnlineEndPoints.cs` |
| GET | `/api/contabilidad-online/validacion-catalogo/{customerId:guid}/{year:int}` | `validacionService.GetCatalogValidationAsync` | `ContabilidadLuxuryApp/ContabilidadOnline/EndPoints/ContabilidadOnlineEndPoints.cs` |
| GET | `/api/contabilidad-online/estado-resultados/{customerId:guid}/{year:int}/{mes:int}` | `estadoResultadosService.GetEstadoResultadosAsync` | `ContabilidadLuxuryApp/ContabilidadOnline/EndPoints/ContabilidadOnlineEndPoints.cs` |
| GET | `/api/contabilidad-online/estado-resultados-v2/{customerId:guid}/{year:int}/{mes:int}` | `estadoResultadosServiceV2.GetEstadoResultadosAsync` | `ContabilidadLuxuryApp/ContabilidadOnline/EndPoints/ContabilidadOnlineEndPoints.cs` |
| GET | `/api/contabilidad-online/cedula-extraordinaria/{customerId:guid}/{year:int}/{mes:int}` | `extraordinariaService.GetCedulaExtraordinariaAsync` | `ContabilidadLuxuryApp/ContabilidadOnline/EndPoints/ContabilidadOnlineEndPoints.cs` |
| GET | `/api/contabilidad-online/cedula-presupuestal/{customerId:guid}/{year:int}/{mes:int}` | `presupuestalService.GetCedulaPresupuestalAsync` | `ContabilidadLuxuryApp/ContabilidadOnline/EndPoints/ContabilidadOnlineEndPoints.cs` |
| GET | `/api/contabilidad-online/presupuesto-contabilidad/{customerId:guid}/{year:int}/{mes:int}` | `presupuestoContabilidadService.GetPresupuestoContabilidadAsync` | `ContabilidadLuxuryApp/ContabilidadOnline/EndPoints/ContabilidadOnlineEndPoints.cs` |
| GET | `/api/contabilidad-online/reporte-financiero/{customerId:guid}/{year:int}/{mes:int}` | `reporteFinancieroService.GetReporteFinancieroAsync` | `ContabilidadLuxuryApp/ContabilidadOnline/EndPoints/ContabilidadOnlineEndPoints.cs` |
| GET | `/api/contabilidad-online/flujo-caja/{customerId:guid}/{year:int}` | `flujoCajaService.GetFlujoCajaAsync` | `ContabilidadLuxuryApp/ContabilidadOnline/EndPoints/ContabilidadOnlineEndPoints.cs` |
| GET | `/api/contabilidad-online/bancos-inversiones/{customerId:guid}/{year:int}/{mes:int}` | `bancosInversionesService.GetBancosInversionesAsync` | `ContabilidadLuxuryApp/ContabilidadOnline/EndPoints/ContabilidadOnlineEndPoints.cs` |
| GET | `/api/contabilidad-online/fondo-reserva/{customerId:guid}/{year:int}/{mes:int}` | `fondoReservaService.GetFondoReservaAsync` | `ContabilidadLuxuryApp/ContabilidadOnline/EndPoints/ContabilidadOnlineEndPoints.cs` |
| GET | `/api/contabilidad-online/proyectos-aprobados/{customerId:guid}/{year:int}` | `proyectosAprobadosService.GetProyectosAprobadosAsync` | `ContabilidadLuxuryApp/ContabilidadOnline/EndPoints/ContabilidadOnlineEndPoints.cs` |
| GET | `/api/contabilidad-online/analisis-cobranza/{customerId:guid}/{year:int}/{month:int}` | `cobranzaService.GetAnalisisCobranzaAsync` | `ContabilidadLuxuryApp/ContabilidadOnline/EndPoints/ContabilidadOnlineEndPoints.cs` |
| GET | `/api/contabilidad-online/analisis-cobranza-online/{customerId:guid}/{year:int}/{month:int}/{day:int}` | `analisisCobranzaOnlineService.GetAnalisisCobranzaOnlineAsync` | `ContabilidadLuxuryApp/ContabilidadOnline/EndPoints/ContabilidadOnlineEndPoints.cs` |
| POST | `/api/contabilidad-online/ask-ai` | `aiAssistant.AnalyzeAccountingReportAsync` | `ContabilidadLuxuryApp/ContabilidadOnline/EndPoints/ContabilidadOnlineEndPoints.cs` |
| POST | `/api/contabilidad-online/ask-ai-contabilidad-online` | `aiAssistant.AnalyzeContabilidadOnlineReportAsync` | `ContabilidadLuxuryApp/ContabilidadOnline/EndPoints/ContabilidadOnlineEndPoints.cs` |
| POST | `/api/contabilidad-online/explain-ai-contabilidad-online` | `aiAssistant.ExplainContabilidadOnlineReportAsync` | `ContabilidadLuxuryApp/ContabilidadOnline/EndPoints/ContabilidadOnlineEndPoints.cs` |

#### Modulo: DynamicReports

- Interfaces: 4 | Servicios: 7 | Endpoints: 11 | DTOs: 13

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IAspelFastReportQueryService | 1 | `ContabilidadLuxuryApp/DynamicReports/Integrations/AspelFast/Interfaces/IAspelFastReportQueryService.cs` |
| IDynamicReportEngineService | 3 | `ContabilidadLuxuryApp/DynamicReports/Interfaces/IDynamicReportEngineService.cs` |
| ILivePreviewEngineService | 1 | `ContabilidadLuxuryApp/DynamicReports/Interfaces/ILivePreviewEngineService.cs` |
| IReportDefinitionService | 6 | `ContabilidadLuxuryApp/DynamicReports/Interfaces/IReportDefinitionService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| AspelFastReportQueryService | 1 | `ContabilidadLuxuryApp/DynamicReports/Integrations/AspelFast/Services/AspelFastReportQueryService.cs` |
| DynamicReportEngineService | 3 | `ContabilidadLuxuryApp/DynamicReports/Services/DynamicReportEngineService.cs` |
| FormulaEvaluatorService | 1 | `ContabilidadLuxuryApp/DynamicReports/Services/FormulaEvaluatorService.cs` |
| LivePreviewEngineService | 1 | `ContabilidadLuxuryApp/DynamicReports/Services/LivePreviewEngineService.cs` |
| ReportDefinitionService | 6 | `ContabilidadLuxuryApp/DynamicReports/Services/ReportDefinitionService.cs` |
| ReportExcelExportService | 1 | `ContabilidadLuxuryApp/DynamicReports/Services/ReportExcelExportService.cs` |
| ReportPdfExportService | 1 | `ContabilidadLuxuryApp/DynamicReports/Services/ReportPdfExportService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetLiveBalancesAsync | IAspelFastReportQueryService | GET_LIST | `Task<IEnumerable<AspelFastAccountBalanceDTO…` | `int empresa, int year, IEnumerable<string> accountNumbers, …` |
| ExecuteAsync | IDynamicReportEngineService | SPECIAL | `Task<ApiResponseDTO<ReportResultDTO>>` | `ExecuteReportRequestDTO request` |
| GetAccountCatalogAsync | IDynamicReportEngineService | GET_LIST | `Task<ApiResponseDTO<List<AccountFlatItemDTO…` | `Guid customerId, int year, string empresa = ""` |
| GetAccountTreeAsync | IDynamicReportEngineService | GET_LIST | `Task<ApiResponseDTO<List<AccountTreeNodeDTO…` | `Guid customerId, int year, string empresa = ""` |
| ComputeAsync | ILivePreviewEngineService | SPECIAL | `Task<ApiResponseDTO<LivePreviewResultDTO>>` | `LivePreviewRequestDTO request` |
| GetAllAsync | IReportDefinitionService | GET_LIST | `Task<ApiResponseDTO<List<ReportDefinitionLi…` | `Guid customerId` |
| GetTemplatesAsync | IReportDefinitionService | GET_LIST | `Task<ApiResponseDTO<List<ReportDefinitionLi…` | `-` |
| GetByIdAsync | IReportDefinitionService | GET_SINGLE | `Task<ApiResponseDTO<ReportDefinitionDTO>>` | `Guid id` |
| CreateAsync | IReportDefinitionService | CREATE | `Task<ApiResponseDTO<ReportDefinitionDTO>>` | `ReportDefinitionDTO dto` |
| UpdateAsync | IReportDefinitionService | UPDATE | `Task<ApiResponseDTO<ReportDefinitionDTO>>` | `Guid id, ReportDefinitionDTO dto` |
| DeleteAsync | IReportDefinitionService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/dynamic-reports/customer/{customerId:guid}` | `svc.GetAllAsync` | `ContabilidadLuxuryApp/DynamicReports/EndPoints/DynamicReportEndpoints.cs` |
| GET | `/api/dynamic-reports/templates` | `svc.GetTemplatesAsync` | `ContabilidadLuxuryApp/DynamicReports/EndPoints/DynamicReportEndpoints.cs` |
| GET | `/api/dynamic-reports/{id:guid}` | `svc.GetByIdAsync` | `ContabilidadLuxuryApp/DynamicReports/EndPoints/DynamicReportEndpoints.cs` |
| PUT | `/api/dynamic-reports/{id:guid}` | `svc.UpdateAsync` | `ContabilidadLuxuryApp/DynamicReports/EndPoints/DynamicReportEndpoints.cs` |
| DELETE | `/api/dynamic-reports/{id:guid}` | `svc.DeleteAsync` | `ContabilidadLuxuryApp/DynamicReports/EndPoints/DynamicReportEndpoints.cs` |
| POST | `/api/dynamic-reports/execute` | `svc.ExecuteAsync` | `ContabilidadLuxuryApp/DynamicReports/EndPoints/DynamicReportEndpoints.cs` |
| POST | `/api/dynamic-reports/live-preview` | `svc.ComputeAsync` | `ContabilidadLuxuryApp/DynamicReports/EndPoints/DynamicReportEndpoints.cs` |
| GET | `/api/dynamic-reports/accounts/{customerId:guid}/{year:int}` | `svc.GetAccountCatalogAsync` | `ContabilidadLuxuryApp/DynamicReports/EndPoints/DynamicReportEndpoints.cs` |
| GET | `/api/dynamic-reports/accounts/{customerId:guid}/{year:int}/tree` | `svc.GetAccountTreeAsync` | `ContabilidadLuxuryApp/DynamicReports/EndPoints/DynamicReportEndpoints.cs` |
| POST | `/api/dynamic-reports/execute/pdf` | `svc.ExecuteAsync` | `ContabilidadLuxuryApp/DynamicReports/EndPoints/DynamicReportEndpoints.cs` |
| POST | `/api/dynamic-reports/execute/excel` | `svc.ExecuteAsync` | `ContabilidadLuxuryApp/DynamicReports/EndPoints/DynamicReportEndpoints.cs` |

#### Modulo: EspejoAspelFull

- Interfaces: 1 | Servicios: 1 | Endpoints: 1 | DTOs: 6

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IEspejoAspelFullService | 1 | `ContabilidadLuxuryApp/EspejoAspelFull/Interfaces/IEspejoAspelFullService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| EspejoAspelFullService | 1 | `ContabilidadLuxuryApp/EspejoAspelFull/Services/EspejoAspelFullService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetEspejoAsync | IEspejoAspelFullService | GET_LIST | `Task<ApiResponseDTO<EspejoAspelFullResponse…` | `Guid customerId, int intYear, AspelEmpresa empresa` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/espejo-aspel-full` | `espejoService.GetEspejoAsync` | `ContabilidadLuxuryApp/EspejoAspelFull/EndPoints/EspejoAspelFullEndPoints.cs` |

#### Modulo: ExpenseCatalogBudget

- Interfaces: 1 | Servicios: 1 | Endpoints: 4 | DTOs: 2

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| ICatalogoGastosFijosPresupuestoAppService | 6 | `ContabilidadLuxuryApp/ExpenseCatalogBudget/Interfaces/ICatalogoGastosFijosPresupuestoAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| CatalogoGastosFijosPresupuestoAppService | 6 | `ContabilidadLuxuryApp/ExpenseCatalogBudget/Services/CatalogoGastosFijosPresupuestoAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetAllAsync | ICatalogoGastosFijosPresupuestoAppService | GET_LIST | `Task<ApiResponseDTO<IEnumerable<CatalogPurc…` | `-` |
| GetByCatalogoGastosFijosIdAsync | ICatalogoGastosFijosPresupuestoAppService | GET_LIST | `Task<ApiResponseDTO<IEnumerable<CatalogPurc…` | `Guid catalogoGastosFijosId` |
| GetByIdAsync | ICatalogoGastosFijosPresupuestoAppService | GET_SINGLE | `Task<ApiResponseDTO<CatalogPurchaseOrderBud…` | `Guid id` |
| AddAsync | ICatalogoGastosFijosPresupuestoAppService | CREATE | `Task<ApiResponseDTO<CatalogPurchaseOrderBud…` | `CatalogPurchaseOrderBudgetDTO DTO` |
| UpdateAsync | ICatalogoGastosFijosPresupuestoAppService | UPDATE | `Task<ApiResponseDTO<CatalogPurchaseOrderBud…` | `Guid id, CatalogPurchaseOrderBudgetDTO DTO` |
| DeleteByIdAsync | ICatalogoGastosFijosPresupuestoAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/catalogo-gastos-fijos-presupuesto/presupuesto-orden-compra-fijos/{catalogoGastosFijosId:guid}` | `dataService.GetByCatalogoGastosFijosIdAsync` | `ContabilidadLuxuryApp/ExpenseCatalogBudget/EndPoints/CatalogoGastosFijosPresupuestoEndPoints.cs` |
| PUT | `/api/catalogo-gastos-fijos-presupuesto/{id:guid}` | `dataService.UpdateAsync` | `ContabilidadLuxuryApp/ExpenseCatalogBudget/EndPoints/CatalogoGastosFijosPresupuestoEndPoints.cs` |
| POST | `/api/catalogo-gastos-fijos-presupuesto` | `dataService.AddAsync` | `ContabilidadLuxuryApp/ExpenseCatalogBudget/EndPoints/CatalogoGastosFijosPresupuestoEndPoints.cs` |
| DELETE | `/api/catalogo-gastos-fijos-presupuesto/{id:guid}` | `dataService.DeleteByIdAsync` | `ContabilidadLuxuryApp/ExpenseCatalogBudget/EndPoints/CatalogoGastosFijosPresupuestoEndPoints.cs` |

#### Modulo: ExpenseCatalogDetail

- Interfaces: 1 | Servicios: 2 | Endpoints: 7 | DTOs: 3

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| ICatalogoGastosFijosDetallesAppService | 7 | `ContabilidadLuxuryApp/ExpenseCatalogDetail/Interfaces/ICatalogoGastosFijosDetallesAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| CatalogoGastosFijosDetallesMapper | 0 | `ContabilidadLuxuryApp/ExpenseCatalogDetail/Mapping/CatalogoGastosFijosDetallesMapper.cs` |
| CatalogoGastosFijosDetallesAppService | 7 | `ContabilidadLuxuryApp/ExpenseCatalogDetail/Services/CatalogoGastosFijosDetallesAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetAllAsync | ICatalogoGastosFijosDetallesAppService | GET_LIST | `Task<ApiResponseDTO<IEnumerable<FixedExpens…` | `-` |
| GetDetallesOrdenCompraFijosAsync | ICatalogoGastosFijosDetallesAppService | GET_LIST | `Task<ApiResponseDTO<List<CatalogoGastosFijo…` | `Guid catalogoGastosFijosId` |
| GetByIdAsync | ICatalogoGastosFijosDetallesAppService | GET_SINGLE | `Task<ApiResponseDTO<FixedExpenseCatalogDeta…` | `Guid id` |
| GetAllCatalogoGastosFijosProductoDTOAsync | ICatalogoGastosFijosDetallesAppService | GET_LIST | `Task<ApiResponseDTO<IEnumerable<CatalogoGas…` | `Guid catalogoGastosFijosId` |
| AddAsync | ICatalogoGastosFijosDetallesAppService | CREATE | `Task<ApiResponseDTO<FixedExpenseCatalogDeta…` | `FixedExpenseCatalogDetail entity` |
| UpdateAsync | ICatalogoGastosFijosDetallesAppService | UPDATE | `Task<ApiResponseDTO<FixedExpenseCatalogDeta…` | `Guid id, CatalogoGastosFijosDetalleAddOrEditDTO DTO` |
| DeleteByIdAsync | ICatalogoGastosFijosDetallesAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/catalogo-gastos-fijos-detalles` | `dataService.GetAllAsync` | `ContabilidadLuxuryApp/ExpenseCatalogDetail/EndPoints/CatalogoGastosFijosDetallesEndPoints.cs` |
| GET | `/api/catalogo-gastos-fijos-detalles/detalles-orden-compra-fijos/{catalogoGastosFijosId:guid}` | `dataService.GetDetallesOrdenCompraFijosAsync` | `ContabilidadLuxuryApp/ExpenseCatalogDetail/EndPoints/CatalogoGastosFijosDetallesEndPoints.cs` |
| GET | `/api/catalogo-gastos-fijos-detalles/{id:guid}` | `dataService.GetByIdAsync` | `ContabilidadLuxuryApp/ExpenseCatalogDetail/EndPoints/CatalogoGastosFijosDetallesEndPoints.cs` |
| GET | `/api/catalogo-gastos-fijos-detalles/products/{catalogoGastosFijosId:guid}` | `dataService.GetAllCatalogoGastosFijosProductoDTOAsync` | `ContabilidadLuxuryApp/ExpenseCatalogDetail/EndPoints/CatalogoGastosFijosDetallesEndPoints.cs` |
| POST | `/api/catalogo-gastos-fijos-detalles` | `dataService.AddAsync` | `ContabilidadLuxuryApp/ExpenseCatalogDetail/EndPoints/CatalogoGastosFijosDetallesEndPoints.cs` |
| PUT | `/api/catalogo-gastos-fijos-detalles/{id:guid}` | `dataService.UpdateAsync` | `ContabilidadLuxuryApp/ExpenseCatalogDetail/EndPoints/CatalogoGastosFijosDetallesEndPoints.cs` |
| DELETE | `/api/catalogo-gastos-fijos-detalles/{id:guid}` | `dataService.DeleteByIdAsync` | `ContabilidadLuxuryApp/ExpenseCatalogDetail/EndPoints/CatalogoGastosFijosDetallesEndPoints.cs` |

#### Modulo: FinancialAccounting

- Interfaces: 2 | Servicios: 1 | Endpoints: 16 | DTOs: 6

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IContabilidadMinutaAppService | 4 | `ContabilidadLuxuryApp/FinancialAccounting/Interfaces/IContabilidadMinutaAppService.cs` |
| IFinancialReportAppServiceV1 | 11 | `ContabilidadLuxuryApp/FinancialAccounting/Interfaces/IFinancialReportAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| ContabilidadMinutaAppService | 4 | `ContabilidadLuxuryApp/FinancialAccounting/Services/ContabilidadMinutaAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| ListaSeguimientosAsync | IContabilidadMinutaAppService | GET_LIST | `Task<ApiResponseDTO<List<object>>>` | `Guid id` |
| ListaMinutaAsync | IContabilidadMinutaAppService | GET_LIST | `Task<ApiResponseDTO<List<MeetingContabilida…` | `string idAccount, int status` |
| ListaMinutaLegalAsync | IContabilidadMinutaAppService | GET_LIST | `Task<ApiResponseDTO<List<MeetingContabilida…` | `string idAccount, int status` |
| PendientesAsync | IContabilidadMinutaAppService | OTHER | `Task<ApiResponseDTO<List<MeetingPendientesD…` | `AreaMinutasDetalles areaResponsable` |
| FirstOrDefaultAsync | IFinancialReportAppServiceV1 | OTHER | `Task<ApiResponseDTO<EstadoFinanciero>>` | `Guid id` |
| ToCustomerAsync | IFinancialReportAppServiceV1 | OTHER | `Task<ApiResponseDTO<List<object>>>` | `Guid customerId` |
| UploadFileAsync | IFinancialReportAppServiceV1 | SPECIAL | `Task<ApiResponseDTO<EstadoFinanciero>>` | `Guid id, string applicationUserId, FinancialReportFileDTO D…` |
| CreatePeriodAsync | IFinancialReportAppServiceV1 | CREATE | `Task<ApiResponseDTO<EstadoFinanciero>>` | `FinancialReportCreateDTO DTO` |
| AuthorizeAsync | IFinancialReportAppServiceV1 | SPECIAL | `Task<ApiResponseDTO<EstadoFinanciero>>` | `Guid id, string applicationUserId` |
| DesauthorizeAsync | IFinancialReportAppServiceV1 | OTHER | `Task<ApiResponseDTO<EstadoFinanciero>>` | `Guid id` |
| SendAsync | IFinancialReportAppServiceV1 | SPECIAL | `Task<ApiResponseDTO<EstadoFinanciero>>` | `Guid id, string applicationUserId` |
| ReporteEnvioMensualAsync | IFinancialReportAppServiceV1 | OTHER | `Task<ApiResponseDTO<List<object>>>` | `DateTime periodo` |
| ReporteEnvioAnualAsync | IFinancialReportAppServiceV1 | OTHER | `Task<ApiResponseDTO<List<object>>>` | `int year` |
| PropietariosAsync | IFinancialReportAppServiceV1 | OTHER | `Task<ApiResponseDTO<List<object>>>` | `Guid customerId` |
| ListAsync | IFinancialReportAppServiceV1 | GET_LIST | `Task<ApiResponseDTO<List<FinancialReportLis…` | `Guid customerId` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/contabilidad-minuta/lista-seguimientos/{id:guid}` | `dataService.ListaSeguimientosAsync` | `ContabilidadLuxuryApp/FinancialAccounting/EndPoints/ContabilidadMinutaEndPoints.cs` |
| GET | `/api/contabilidad-minuta/lista-minuta/{idAccount}/{status:int}` | `dataService.ListaMinutaAsync` | `ContabilidadLuxuryApp/FinancialAccounting/EndPoints/ContabilidadMinutaEndPoints.cs` |
| GET | `/api/contabilidad-minuta/lista-minuta-legal/{idAccount}/{status:int}` | `dataService.ListaMinutaLegalAsync` | `ContabilidadLuxuryApp/FinancialAccounting/EndPoints/ContabilidadMinutaEndPoints.cs` |
| GET | `/api/contabilidad-minuta/pendientes/{areaResponsable}` | `dataService.PendientesAsync` | `ContabilidadLuxuryApp/FinancialAccounting/EndPoints/ContabilidadMinutaEndPoints.cs` |
| GET | `/api/financial-report/{id:guid}` | `appService.FirstOrDefaultAsync` | `ContabilidadLuxuryApp/FinancialAccounting/EndPoints/FinancialReportEndpoints.cs` |
| GET | `/api/financial-report/to-customer/{customerId:guid}` | `appService.ToCustomerAsync` | `ContabilidadLuxuryApp/FinancialAccounting/EndPoints/FinancialReportEndpoints.cs` |
| POST | `/api/financial-report/upload-file/{id:guid}/{applicationUserId}` | `appService.UploadFileAsync` | `ContabilidadLuxuryApp/FinancialAccounting/EndPoints/FinancialReportEndpoints.cs` |
| POST | `/api/financial-report/create-period` | `appService.CreatePeriodAsync` | `ContabilidadLuxuryApp/FinancialAccounting/EndPoints/FinancialReportEndpoints.cs` |
| GET | `/api/financial-report/authorize/{id:guid}/{applicationUserId}` | `appService.AuthorizeAsync` | `ContabilidadLuxuryApp/FinancialAccounting/EndPoints/FinancialReportEndpoints.cs` |
| GET | `/api/financial-report/desauthorize/{id:guid}` | `appService.DesauthorizeAsync` | `ContabilidadLuxuryApp/FinancialAccounting/EndPoints/FinancialReportEndpoints.cs` |
| POST | `/api/financial-report/send/{id:guid}/{applicationUserId}` | `appService.SendAsync` | `ContabilidadLuxuryApp/FinancialAccounting/EndPoints/FinancialReportEndpoints.cs` |
| GET | `/api/financial-report/reporteenviomensual/{periodo:datetime}` | `appService.ReporteEnvioMensualAsync` | `ContabilidadLuxuryApp/FinancialAccounting/EndPoints/FinancialReportEndpoints.cs` |
| GET | `/api/financial-report/reporte-envio-anual/{year:int}` | `appService.ReporteEnvioAnualAsync` | `ContabilidadLuxuryApp/FinancialAccounting/EndPoints/FinancialReportEndpoints.cs` |
| GET | `/api/financial-report/propietarios/{customerId:guid}` | `appService.PropietariosAsync` | `ContabilidadLuxuryApp/FinancialAccounting/EndPoints/FinancialReportEndpoints.cs` |
| GET | `/api/financial-report/list/{customerId:guid}` | `appService.ListAsync` | `ContabilidadLuxuryApp/FinancialAccounting/EndPoints/FinancialReportEndpoints.cs` |
| GET | `/api/funding-accounting/list/{customerId:guid}` | `appService.GetAllAsync` | `ContabilidadLuxuryApp/FinancialAccounting/EndPoints/FundingAccountingEndPoints.cs` |

#### Modulo: Fondeos

- Interfaces: 1 | Servicios: 3 | Endpoints: 23 | DTOs: 12

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IFundingAppService | 21 | `ContabilidadLuxuryApp/Fondeos/Interfaces/IFundingAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| FundingHelper | 9 | `ContabilidadLuxuryApp/Fondeos/Helpers/FundingHelper.cs` |
| FundingMapper | 0 | `ContabilidadLuxuryApp/Fondeos/Mapping/FundingMapper.cs` |
| FundingAppService | 21 | `ContabilidadLuxuryApp/Fondeos/Services/FundingAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| DetailsAsync | IFundingAppService | GET_SINGLE | `Task<ApiResponseDTO<FundingDetailDTO>>` | `Guid id, Guid customerId` |
| GetAllAsync | IFundingAppService | GET_LIST | `Task<ApiResponseDTO<FundingListDTO[]>>` | `Guid customerId` |
| GetByIdAsync | IFundingAppService | GET_SINGLE | `Task<ApiResponseDTO<FundingAddOrEditDTO>>` | `Guid id` |
| AddAsync | IFundingAppService | CREATE | `Task<ApiResponseDTO<FundingListDTO>>` | `FundingCreateDTO DTO` |
| UpdateAsync | IFundingAppService | UPDATE | `Task<ApiResponseDTO<FundingListDTO>>` | `Guid id, FundingAddOrEditDTO DTO` |
| GetPurchaseDetailAsync | IFundingAppService | GET_LIST | `Task<ApiResponseDTO<PurchaseDetailAsyncDTO>>` | `Guid ordenCompraId` |
| GetPurchaseHistoryAsync | IFundingAppService | GET_LIST | `Task<ApiResponseDTO<PurchaseHistoryDTO[]>>` | `Guid customerId, string fiscalYear, string accountNumber` |
| UpdatePurchasePaidStatusAsync | IFundingAppService | UPDATE | `Task<ApiResponseDTO<bool>>` | `Guid ordenCompraId, bool isPaid` |
| ValidateInvoiceAsync | IFundingAppService | SPECIAL | `Task<ApiResponseDTO<ValidationResultDTO>>` | `Guid ordenCompraId` |
| DeleteByIdAsync | IFundingAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| DeleteDetailAsync | IFundingAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid ordenCompraId` |
| ValidateFundingAsync | IFundingAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| InvalidateAsync | IFundingAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| AuthorizeFundingAsync | IFundingAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| RevokeAuthorizationAsync | IFundingAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| ConfirmFundingAsync | IFundingAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| RevokeConfirmationAsync | IFundingAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| CompleteFundingAsync | IFundingAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| RevertCompleteFundingAsync | IFundingAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| UpdateOrderAsync | IFundingAppService | UPDATE | `Task<ApiResponseDTO<bool>>` | `List<Guid> purchaseOrderIds` |
| AnalyzeUploadedFilesAsync | IFundingAppService | GET_LIST | `Task<List<AnalyzedInvoiceDTO>>` | `IFormFileCollection files, Guid customerId, Guid? fundingId…` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/funding/{id:guid}` | `appService.GetByIdAsync` | `ContabilidadLuxuryApp/Fondeos/EndPoints/FundingEndpoints.cs` |
| GET | `/api/funding/list/{customerId:guid}` | `appService.GetAllAsync` | `ContabilidadLuxuryApp/Fondeos/EndPoints/FundingEndpoints.cs` |
| GET | `/api/funding/details/{id:guid}/{customerId:guid}` | `appService.DetailsAsync` | `ContabilidadLuxuryApp/Fondeos/EndPoints/FundingEndpoints.cs` |
| POST | `/api/funding` | `appService.AddAsync` | `ContabilidadLuxuryApp/Fondeos/EndPoints/FundingEndpoints.cs` |
| PUT | `/api/funding/{id:guid}` | `appService.UpdateAsync` | `ContabilidadLuxuryApp/Fondeos/EndPoints/FundingEndpoints.cs` |
| PUT | `/api/funding/update-order` | `appService.UpdateOrderAsync` | `ContabilidadLuxuryApp/Fondeos/EndPoints/FundingEndpoints.cs` |
| DELETE | `/api/funding/{id:guid}` | `appService.DeleteByIdAsync` | `ContabilidadLuxuryApp/Fondeos/EndPoints/FundingEndpoints.cs` |
| DELETE | `/api/funding/detail/{ordenCompraId:guid}` | `appService.DeleteDetailAsync` | `ContabilidadLuxuryApp/Fondeos/EndPoints/FundingEndpoints.cs` |
| GET | `/api/funding/validate/{id:guid}` | `appService.ValidateFundingAsync` | `ContabilidadLuxuryApp/Fondeos/EndPoints/FundingEndpoints.cs` |
| GET | `/api/funding/authorize/{id:guid}` | `appService.AuthorizeFundingAsync` | `ContabilidadLuxuryApp/Fondeos/EndPoints/FundingEndpoints.cs` |
| GET | `/api/funding/confirm/{id:guid}` | `appService.ConfirmFundingAsync` | `ContabilidadLuxuryApp/Fondeos/EndPoints/FundingEndpoints.cs` |
| GET | `/api/funding/unvalidate/{id:guid}` | `appService.InvalidateAsync` | `ContabilidadLuxuryApp/Fondeos/EndPoints/FundingEndpoints.cs` |
| GET | `/api/funding/unauthorize/{id:guid}` | `appService.RevokeAuthorizationAsync` | `ContabilidadLuxuryApp/Fondeos/EndPoints/FundingEndpoints.cs` |
| GET | `/api/funding/revoke-confirmation/{id:guid}` | `appService.RevokeConfirmationAsync` | `ContabilidadLuxuryApp/Fondeos/EndPoints/FundingEndpoints.cs` |
| GET | `/api/funding/revert-complete/{id:guid}` | `appService.RevertCompleteFundingAsync` | `ContabilidadLuxuryApp/Fondeos/EndPoints/FundingEndpoints.cs` |
| GET | `/api/funding/completed/{id:guid}` | `appService.CompleteFundingAsync` | `ContabilidadLuxuryApp/Fondeos/EndPoints/FundingEndpoints.cs` |
| GET | `/api/funding/purchase-details/{ordenCompraId:guid}` | `appService.GetPurchaseDetailAsync` | `ContabilidadLuxuryApp/Fondeos/EndPoints/FundingEndpoints.cs` |
| GET | `/api/funding/purchase-history/{customerId:guid}/{fiscalYear}/{accountNumber}` | `appService.GetPurchaseHistoryAsync` | `ContabilidadLuxuryApp/Fondeos/EndPoints/FundingEndpoints.cs` |
| PATCH | `/api/funding/update-purchase-paid-status/{ordenCompraId:guid}` | `appService.UpdatePurchasePaidStatusAsync` | `ContabilidadLuxuryApp/Fondeos/EndPoints/FundingEndpoints.cs` |
| POST | `/api/funding/validate-invoice/{ordenCompraId:guid}` | `appService.ValidateInvoiceAsync` | `ContabilidadLuxuryApp/Fondeos/EndPoints/FundingEndpoints.cs` |
| POST | `/api/funding/download-bulk-invoices-zip` | `fileService.GenerateBulkInvoicesZipAsync` | `ContabilidadLuxuryApp/Fondeos/EndPoints/FundingEndpoints.cs` |
| POST | `/api/funding/analyze-invoices/{customerId:guid}` | `appService.AnalyzeUploadedFilesAsync` | `ContabilidadLuxuryApp/Fondeos/EndPoints/FundingEndpoints.cs` |
| POST | `/api/funding/create-orders-from-invoices` | `ordenCompraAppService.CreateFromInvoicesAsync` | `ContabilidadLuxuryApp/Fondeos/EndPoints/FundingEndpoints.cs` |

#### Modulo: FundingFile

- Interfaces: 1 | Servicios: 1 | Endpoints: 1 | DTOs: 0

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IFundingFileAppService | 0 | `ContabilidadLuxuryApp/FundingFile/Interfaces/IFundingFileAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| FundingFileAppService | 0 | `ContabilidadLuxuryApp/FundingFile/Services/FundingFileAppService.cs` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| POST | `/api/funding-file/download-zip` | `appService.GenerateBulkSolicitudesPagoZipAsync` | `ContabilidadLuxuryApp/FundingFile/EndPoints/FundingFileEndpoints.cs` |

#### Modulo: MaintenanceReport

- Interfaces: 1 | Servicios: 1 | Endpoints: 13 | DTOs: 0

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IMaintenanceReportAppService | 13 | `ContabilidadLuxuryApp/MaintenanceReport/Interfaces/IMaintenanceReportAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| MaintenanceReportAppService | 13 | `ContabilidadLuxuryApp/MaintenanceReport/Services/MaintenanceReportAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| ResumenAsync | IMaintenanceReportAppService | OTHER | `Task<ApiResponseDTO<object>>` | `Guid customerId, DateTime periodo` |
| ProveedorAsync | IMaintenanceReportAppService | OTHER | `Task<ApiResponseDTO<object>>` | `Guid customerId, DateTime periodo` |
| DataGraficoMensualAsync | IMaintenanceReportAppService | OTHER | `Task<ApiResponseDTO<List<MultiAxisPrimeChar…` | `Guid customerId, DateTime periodo` |
| WeeklyExecutiveReportAsync | IMaintenanceReportAppService | OTHER | `Task<ApiResponseDTO<MaintenanceWeeklyExecut…` | `MaintenanceWeeklyExecutiveReportRequestDTO request` |
| BitacoradiariaAsync | IMaintenanceReportAppService | OTHER | `Task<ApiResponseDTO<object>>` | `Guid customerId, DateTime periodo` |
| EntradaProductoAsync | IMaintenanceReportAppService | OTHER | `Task<ApiResponseDTO<object>>` | `Guid customerId, DateTime periodo` |
| SalidaProductoAsync | IMaintenanceReportAppService | OTHER | `Task<ApiResponseDTO<object>>` | `Guid customerId, DateTime periodo` |
| PrestamoHerramientaAsync | IMaintenanceReportAppService | OTHER | `Task<ApiResponseDTO<object>>` | `Guid customerId, DateTime periodo` |
| BitacoraAlbercaParametrosAsync | IMaintenanceReportAppService | OTHER | `Task<ApiResponseDTO<List<ChartPiscinaDTO>>>` | `Guid customerId, DateTime periodo` |
| ReportPurchaseAsync | IMaintenanceReportAppService | OTHER | `Task<ApiResponseDTO<object>>` | `Guid customerId, DateTime periodo` |
| TicketAsync | IMaintenanceReportAppService | OTHER | `Task<ApiResponseDTO<object>>` | `Guid customerId, DateTime periodo` |
| TicketResponsable | IMaintenanceReportAppService | OTHER | `Task<ApiResponseDTO<object>>` | `Guid customerId, DateTime periodo` |
| CargaTicket | IMaintenanceReportAppService | SPECIAL | `Task<ApiResponseDTO<object>>` | `Guid customerId, DateTime periodo` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/maintenance-report/resumen/{customerId:guid}/{periodo}` | `appService.ResumenAsync` | `ContabilidadLuxuryApp/MaintenanceReport/EndPoints/MaintenanceReportEndPoints.cs` |
| GET | `/api/maintenance-report/proveedor/{customerId:guid}/{periodo}` | `appService.ProveedorAsync` | `ContabilidadLuxuryApp/MaintenanceReport/EndPoints/MaintenanceReportEndPoints.cs` |
| GET | `/api/maintenance-report/data-grafico-mensual/{customerId:guid}/{periodo}` | `appService.DataGraficoMensualAsync` | `ContabilidadLuxuryApp/MaintenanceReport/EndPoints/MaintenanceReportEndPoints.cs` |
| POST | `/api/maintenance-report/weekly-executive-report` | `appService.WeeklyExecutiveReportAsync` | `ContabilidadLuxuryApp/MaintenanceReport/EndPoints/MaintenanceReportEndPoints.cs` |
| GET | `/api/maintenance-report/bitacoradiaria/{customerId:guid}/{periodo}` | `appService.BitacoradiariaAsync` | `ContabilidadLuxuryApp/MaintenanceReport/EndPoints/MaintenanceReportEndPoints.cs` |
| GET | `/api/maintenance-report/entradaproducto/{customerId:guid}/{periodo}` | `appService.EntradaProductoAsync` | `ContabilidadLuxuryApp/MaintenanceReport/EndPoints/MaintenanceReportEndPoints.cs` |
| GET | `/api/maintenance-report/salidaproducto/{customerId:guid}/{periodo}` | `appService.SalidaProductoAsync` | `ContabilidadLuxuryApp/MaintenanceReport/EndPoints/MaintenanceReportEndPoints.cs` |
| GET | `/api/maintenance-report/presatamoherramienta/{customerId:guid}/{periodo}` | `appService.PrestamoHerramientaAsync` | `ContabilidadLuxuryApp/MaintenanceReport/EndPoints/MaintenanceReportEndPoints.cs` |
| GET | `/api/maintenance-report/bitacoraalbercaparametros/{customerId:guid}/{periodo}` | `appService.BitacoraAlbercaParametrosAsync` | `ContabilidadLuxuryApp/MaintenanceReport/EndPoints/MaintenanceReportEndPoints.cs` |
| GET | `/api/maintenance-report/solicitudinsumos/{customerId:guid}/{periodo}` | `appService.ReportPurchaseAsync` | `ContabilidadLuxuryApp/MaintenanceReport/EndPoints/MaintenanceReportEndPoints.cs` |
| GET | `/api/maintenance-report/ticket/{customerId:guid}/{periodo}` | `appService.TicketAsync` | `ContabilidadLuxuryApp/MaintenanceReport/EndPoints/MaintenanceReportEndPoints.cs` |
| GET | `/api/maintenance-report/ticket-responsable/{customerId:guid}/{periodo}` | - | `ContabilidadLuxuryApp/MaintenanceReport/EndPoints/MaintenanceReportEndPoints.cs` |
| GET | `/api/maintenance-report/carga-ticket/{customerId:guid}/{periodo}` | - | `ContabilidadLuxuryApp/MaintenanceReport/EndPoints/MaintenanceReportEndPoints.cs` |

#### Modulo: Persistence

- Interfaces: 0 | Servicios: 0 | Endpoints: 0 | DTOs: 0

#### Modulo: Presupuesto

- Interfaces: 0 | Servicios: 1 | Endpoints: 4 | DTOs: 2

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| BudgetAccountRuleAppService | 4 | `ContabilidadLuxuryApp/Presupuesto/Services/BudgetAccountRuleAppService.cs` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/budget-account-rules/{customerId:guid}` | `appService.GetAllAsync` | `ContabilidadLuxuryApp/Presupuesto/EndPoints/BudgetAccountRulesEndPoints.cs` |
| POST | `/api/budget-account-rules` | `appService.CreateAsync` | `ContabilidadLuxuryApp/Presupuesto/EndPoints/BudgetAccountRulesEndPoints.cs` |
| PUT | `/api/budget-account-rules/{id:guid}` | `appService.UpdateAsync` | `ContabilidadLuxuryApp/Presupuesto/EndPoints/BudgetAccountRulesEndPoints.cs` |
| DELETE | `/api/budget-account-rules/{id:guid}` | `appService.DeleteAsync` | `ContabilidadLuxuryApp/Presupuesto/EndPoints/BudgetAccountRulesEndPoints.cs` |

#### Modulo: PresupuestoPropuesta

- Interfaces: 2 | Servicios: 3 | Endpoints: 14 | DTOs: 16

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IBudgetProposalItemSupportService | 4 | `ContabilidadLuxuryApp/PresupuestoPropuesta/Interfaces/IBudgetProposalItemSupportService.cs` |
| IBudgetProposalService | 9 | `ContabilidadLuxuryApp/PresupuestoPropuesta/Interfaces/IBudgetProposalService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| BudgetProposalProfile | 0 | `ContabilidadLuxuryApp/PresupuestoPropuesta/Mapping/BudgetProposalProfile.cs` |
| BudgetProposalItemSupportService | 4 | `ContabilidadLuxuryApp/PresupuestoPropuesta/Services/BudgetProposalItemSupportService.cs` |
| BudgetProposalService | 10 | `ContabilidadLuxuryApp/PresupuestoPropuesta/Services/BudgetProposalService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetBudgetProposalItemWithSupportAsync | IBudgetProposalItemSupportService | GET_LIST | `Task<ApiResponseDTO<BudgetProposalItemSuppo…` | `Guid itemId` |
| UpdateBudgetProposalItemSupportInfoAsync | IBudgetProposalItemSupportService | UPDATE | `Task<ApiResponseDTO<BudgetProposalItemDTO>>` | `Guid itemId, UpdateBudgetProposalItemSupportInfoDTO DTO` |
| AddBudgetProposalItemSupportFilesAsync | IBudgetProposalItemSupportService | CREATE | `Task<ApiResponseDTO<BudgetProposalItemDTO>>` | `AddBudgetProposalItemSupportFilesDTO DTO` |
| DeleteBudgetProposalItemSupportFileAsync | IBudgetProposalItemSupportService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid fileId` |
| GetProposalsAsync | IBudgetProposalService | GET_LIST | `Task<ApiResponseDTO<BudgetProposalDTO>>` | `Guid customerId, int fiscalYear` |
| CreateProposalAsync | IBudgetProposalService | CREATE | `Task<ApiResponseDTO<BudgetProposalDTO>>` | `CreateBudgetProposalDTO DTO` |
| UpdateProposalItemAsync | IBudgetProposalService | UPDATE | `Task<ApiResponseDTO<BudgetProposalItemDTO>>` | `Guid itemId, UpdateProposalItemDTO DTO` |
| GetItemHistoryAsync | IBudgetProposalService | GET_LIST | `Task<ApiResponseDTO<IEnumerable<BudgetPropo…` | `Guid itemId` |
| GetAvailableAspelAccountsAsync | IBudgetProposalService | GET_LIST | `Task<ApiResponseDTO<IEnumerable<AvailableAc…` | `Guid customerId, int fiscalYear, Guid proposalId` |
| AddAccountsToProposalAsync | IBudgetProposalService | CREATE | `Task<ApiResponseDTO<IEnumerable<BudgetPropo…` | `Guid proposalId, List<string> accountNumbers` |
| DeleteProposalItemAsync | IBudgetProposalService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid itemId` |
| GetFeeComparisonAsync | IBudgetProposalService | GET_LIST | `Task<ApiResponseDTO<UniformFeeComparisonDTO…` | `Guid proposalId` |
| GetFeeComparisonByIndivisoAsync | IBudgetProposalService | GET_LIST | `Task<ApiResponseDTO<IndivisoFeeComparisonDT…` | `Guid proposalId` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/budget-proposal` | `service.GetProposalsAsync` | `ContabilidadLuxuryApp/PresupuestoPropuesta/Endpoints/BudgetProposalEndPoints.cs` |
| PUT | `/api/budget-proposal/{itemId:guid}` | `service.UpdateProposalItemAsync` | `ContabilidadLuxuryApp/PresupuestoPropuesta/Endpoints/BudgetProposalEndPoints.cs` |
| GET | `/api/budget-proposal/history/{itemId:guid}` | `service.GetItemHistoryAsync` | `ContabilidadLuxuryApp/PresupuestoPropuesta/Endpoints/BudgetProposalEndPoints.cs` |
| GET | `/api/budget-proposal/available-accounts/{customerId:guid}/{fiscalYear:int}/{proposalId:guid}` | `service.GetAvailableAspelAccountsAsync` | `ContabilidadLuxuryApp/PresupuestoPropuesta/Endpoints/BudgetProposalEndPoints.cs` |
| POST | `/api/budget-proposal/{proposalId:guid}/add-accounts` | `service.AddAccountsToProposalAsync` | `ContabilidadLuxuryApp/PresupuestoPropuesta/Endpoints/BudgetProposalEndPoints.cs` |
| DELETE | `/api/budget-proposal/item/{itemId:guid}` | `service.DeleteProposalItemAsync` | `ContabilidadLuxuryApp/PresupuestoPropuesta/Endpoints/BudgetProposalEndPoints.cs` |
| GET | `/api/budget-proposal/{proposalId:guid}/fee-comparison` | `service.GetFeeComparisonAsync` | `ContabilidadLuxuryApp/PresupuestoPropuesta/Endpoints/BudgetProposalEndPoints.cs` |
| GET | `/api/budget-proposal/{proposalId:guid}/fee-comparison-by-indiviso` | `service.GetFeeComparisonByIndivisoAsync` | `ContabilidadLuxuryApp/PresupuestoPropuesta/Endpoints/BudgetProposalEndPoints.cs` |
| POST | `/api/budget-proposal/audit` | `aiAssistantService.GenerateBudgetAuditAsync` | `ContabilidadLuxuryApp/PresupuestoPropuesta/Endpoints/BudgetProposalEndPoints.cs` |
| POST | `/api/budget-proposal/forecast` | `aiAssistantService.GenerateBudgetForecastAsync` | `ContabilidadLuxuryApp/PresupuestoPropuesta/Endpoints/BudgetProposalEndPoints.cs` |
| GET | `/api/budget-proposal-item-support/{itemId:guid}` | `service.GetBudgetProposalItemWithSupportAsync` | `ContabilidadLuxuryApp/PresupuestoPropuesta/Endpoints/BudgetProposalItemSupportEndpoints.cs` |
| PUT | `/api/budget-proposal-item-support/{itemId:guid}/support-info` | `service.UpdateBudgetProposalItemSupportInfoAsync` | `ContabilidadLuxuryApp/PresupuestoPropuesta/Endpoints/BudgetProposalItemSupportEndpoints.cs` |
| POST | `/api/budget-proposal-item-support/support-files` | `service.AddBudgetProposalItemSupportFilesAsync` | `ContabilidadLuxuryApp/PresupuestoPropuesta/Endpoints/BudgetProposalItemSupportEndpoints.cs` |
| DELETE | `/api/budget-proposal-item-support/support-file/{fileId:guid}` | `service.DeleteBudgetProposalItemSupportFileAsync` | `ContabilidadLuxuryApp/PresupuestoPropuesta/Endpoints/BudgetProposalItemSupportEndpoints.cs` |

#### Modulo: PresupuestoShared

- Interfaces: 2 | Servicios: 1 | Endpoints: 0 | DTOs: 2

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IAspelQuotationService | 8 | `ContabilidadLuxuryApp/PresupuestoShared/Interfaces/IAspelQuotationService.cs` |
| IHelperAspel | 2 | `ContabilidadLuxuryApp/PresupuestoShared/Interfaces/IHelperAspel.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| AspelQuotationService | 8 | `ContabilidadLuxuryApp/PresupuestoShared/Services/AspelQuotationService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetAspelQuotation | IAspelQuotationService | GET_LIST | `Task<ApiResponseDTO<AspelBudgetDTO>>` | `Guid customerId, int intYear, AspelEmpresa companyType = As…` |
| GetAspelQuotationSummaryAsync | IAspelQuotationService | GET_LIST | `Task<ApiResponseDTO<AspelBudgetDTO>>` | `Guid customerId, int intYear, AspelEmpresa companyType = As…` |
| GetAspelMirrorAsync | IAspelQuotationService | GET_LIST | `Task<ApiResponseDTO<AspelBudgetDTO>>` | `Guid customerId, int intYear, AspelEmpresa companyType` |
| ToPurchaseOrderSelectAsync | IAspelQuotationService | OTHER | `Task<ApiResponseDTO<BudgetToPurchaseOrderDT…` | `Guid customerId, Guid ordenCompraId, int year, AspelEmpresa…` |
| FixedExpensesCatalogSelectAsync | IAspelQuotationService | OTHER | `Task<ApiResponseDTO<object>>` | `Guid customerId, int year, Guid catalogoGastosFijosId = def…` |
| GetAccountBudgetStatusAsync | IAspelQuotationService | GET_LIST | `Task<PurchaseOrderBudgetForOrdenCompraDTO>` | `string accountNumber, int fiscalYear, Guid customerId, Guid…` |
| GetMultipleAccountsBudgetStatusAsync | IAspelQuotationService | GET_LIST | `Task<List<PurchaseOrderBudgetForOrdenCompra…` | `List<string> accountNumbers, int fiscalYear, Guid customerI…` |
| GetAspelFullQuotation | IAspelQuotationService | GET_LIST | `Task<ApiResponseDTO<AspelBudgetDTO>>` | `Guid customerId, int intYear, AspelEmpresa companyType = As…` |
| AccountsExtras | IHelperAspel | OTHER | `List<BudgetToPurchaseOrderDetailDTO>` | `Guid customerId` |
| HojaTienePresupuestoValido | IHelperAspel | OTHER | `bool` | `Guid customerId, CuentaAspelTercerNivelDTO DTO` |

#### Modulo: PresupuestoWebAspel

- Interfaces: 1 | Servicios: 1 | Endpoints: 8 | DTOs: 5

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IAspelMappingService | 1 | `ContabilidadLuxuryApp/PresupuestoWebAspel/Interfaces/IAspelMappingService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| AspelMappingService | 1 | `ContabilidadLuxuryApp/PresupuestoWebAspel/Services/AspelMappingService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetEmpresaIdAsync | IAspelMappingService | GET_LIST | `Task<int?>` | `Guid customerId, AspelEmpresa empresaType` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| POST | `/api/presupuesto/analyze` | `aiAssistantService.GenerateFinancialSummaryAsync` | `ContabilidadLuxuryApp/PresupuestoWebAspel/EndPoints/PresupuestoEndPoints.cs` |
| GET | `/api/presupuesto/aspel` | - | `ContabilidadLuxuryApp/PresupuestoWebAspel/EndPoints/PresupuestoEndPoints.cs` |
| GET | `/api/presupuesto/aspel-full` | `aspelQuotationService.GetAspelQuotationSummaryAsync` | `ContabilidadLuxuryApp/PresupuestoWebAspel/EndPoints/PresupuestoEndPoints.cs` |
| GET | `/api/presupuesto/aspel-summary` | `aspelQuotationService.GetAspelQuotationSummaryAsync` | `ContabilidadLuxuryApp/PresupuestoWebAspel/EndPoints/PresupuestoEndPoints.cs` |
| GET | `/api/presupuesto/to-purchase-order/{customerId:guid}/{ordenCompraId:guid}/{year:int}` | `aspelQuotationService.ToPurchaseOrderSelectAsync` | `ContabilidadLuxuryApp/PresupuestoWebAspel/EndPoints/PresupuestoEndPoints.cs` |
| GET | `/api/presupuesto/fixed-expenses-catalog/{customerId:guid}/{year:int}` | `aspelQuotationService.FixedExpensesCatalogSelectAsync` | `ContabilidadLuxuryApp/PresupuestoWebAspel/EndPoints/PresupuestoEndPoints.cs` |
| GET | `/api/presupuesto/presupuesto-limpio-ejercicio-fiscal` | `aspelQuotationService.GetAspelMirrorAsync` | `ContabilidadLuxuryApp/PresupuestoWebAspel/EndPoints/PresupuestoEndPoints.cs` |
| GET | `/api/presupuesto/presupuesto-limpio-cobranza` | `aspelQuotationService.GetAspelMirrorAsync` | `ContabilidadLuxuryApp/PresupuestoWebAspel/EndPoints/PresupuestoEndPoints.cs` |

#### Modulo: ProjectedExpenses

- Interfaces: 1 | Servicios: 3 | Endpoints: 7 | DTOs: 3

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IProjectedExpenseAppService | 7 | `ContabilidadLuxuryApp/ProjectedExpenses/Interfaces/IProjectedExpenseAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| BudgetExecutionProfile | 0 | `ContabilidadLuxuryApp/ProjectedExpenses/Mapping/BudgetExecutionProfile.cs` |
| ProjectedExpenseMapper | 0 | `ContabilidadLuxuryApp/ProjectedExpenses/Mapping/ProjectedExpenseMapper.cs` |
| ProjectedExpenseAppService | 7 | `ContabilidadLuxuryApp/ProjectedExpenses/Services/ProjectedExpenseAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetAllAsync | IProjectedExpenseAppService | GET_LIST | `Task<ApiResponseDTO<IEnumerable<ProjectedEx…` | `Guid customerId` |
| GetByIdAsync | IProjectedExpenseAppService | GET_SINGLE | `Task<ApiResponseDTO<ProjectedExpenseDTO>>` | `Guid id, Guid customerId` |
| GetByAccountIdAsync | IProjectedExpenseAppService | GET_LIST | `Task<ApiResponseDTO<IEnumerable<ProjectedEx…` | `Guid customerId, string month, string accountNumber` |
| AddAsync | IProjectedExpenseAppService | CREATE | `Task<ApiResponseDTO<ProjectedExpenseDTO>>` | `ProjectedExpenseAddOrEditDTO DTO` |
| UpdateAsync | IProjectedExpenseAppService | UPDATE | `Task<ApiResponseDTO<ProjectedExpenseDTO>>` | `Guid id, Guid customerId, ProjectedExpenseAddOrEditDTO DTO` |
| DeleteAsync | IProjectedExpenseAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id, Guid customerId` |
| AddOrUpdateRecurrenceAsync | IProjectedExpenseAppService | CREATE | `Task<ApiResponseDTO<bool>>` | `ProjectedExpenseRecurrenceDTO DTO` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/projected-expenses/{customerId:guid}` | `budgetExecutionAppService.GetAllAsync` | `ContabilidadLuxuryApp/ProjectedExpenses/EndPoints/ProjectedExpensesEndPoints.cs` |
| GET | `/api/projected-expenses/{customerId:guid}/{id:guid}` | `budgetExecutionAppService.GetByIdAsync` | `ContabilidadLuxuryApp/ProjectedExpenses/EndPoints/ProjectedExpensesEndPoints.cs` |
| GET | `/api/projected-expenses/by-account-id/{customerId:guid}/{month}/{accountNumber}` | `budgetExecutionAppService.GetByAccountIdAsync` | `ContabilidadLuxuryApp/ProjectedExpenses/EndPoints/ProjectedExpensesEndPoints.cs` |
| POST | `/api/projected-expenses` | `budgetExecutionAppService.AddAsync` | `ContabilidadLuxuryApp/ProjectedExpenses/EndPoints/ProjectedExpensesEndPoints.cs` |
| POST | `/api/projected-expenses/recurrence` | `budgetExecutionAppService.AddOrUpdateRecurrenceAsync` | `ContabilidadLuxuryApp/ProjectedExpenses/EndPoints/ProjectedExpensesEndPoints.cs` |
| PUT | `/api/projected-expenses/{customerId:guid}/{id:guid}` | `budgetExecutionAppService.UpdateAsync` | `ContabilidadLuxuryApp/ProjectedExpenses/EndPoints/ProjectedExpensesEndPoints.cs` |
| DELETE | `/api/projected-expenses/{customerId:guid}/{id:guid}` | `budgetExecutionAppService.DeleteAsync` | `ContabilidadLuxuryApp/ProjectedExpenses/EndPoints/ProjectedExpensesEndPoints.cs` |

#### Modulo: Reports

- Interfaces: 1 | Servicios: 2 | Endpoints: 0 | DTOs: 1

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IReportSubmissionRecordAppService | 0 | `ContabilidadLuxuryApp/Reports/Interfaces/IReportSubmissionRecordAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| EmergencyMapper | 0 | `ContabilidadLuxuryApp/Reports/Mapping/EmergencyMapper.cs` |
| ReportSubmissionRecordAppService | 0 | `ContabilidadLuxuryApp/Reports/Services/ReportSubmissionRecordAppService.cs` |

#### Modulo: Shared

- Interfaces: 3 | Servicios: 1 | Endpoints: 0 | DTOs: 2

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IAccountCatalogService | 2 | `ContabilidadLuxuryApp/Shared/Interfaces/IAccountCatalogService.cs` |
| IAspelCoiApiClient | 8 | `ContabilidadLuxuryApp/Shared/Interfaces/IAspelCoiApiClient.cs` |
| IContabilidadOnlineLocalService | 3 | `ContabilidadLuxuryApp/Shared/Interfaces/IContabilidadOnlineLocalService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| AccountCatalogService | 2 | `ContabilidadLuxuryApp/Shared/Services/AccountCatalogService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetTreeAsync | IAccountCatalogService | GET_LIST | `Task<ApiResponseDTO<List<AccountTreeNodeDTO…` | `Guid customerId, int year, AspelEmpresa empresa` |
| GetFlatAsync | IAccountCatalogService | GET_LIST | `Task<ApiResponseDTO<List<AccountFlatItemDTO…` | `Guid customerId, int year, AspelEmpresa empresa` |
| GetCuentasAsync | IAspelCoiApiClient | GET_LIST | `Task<AspelCuentasResponseDTO>` | `int intEmpresa, int intYear` |
| GetSaldosAsync | IAspelCoiApiClient | GET_LIST | `Task<AspelSaldosResponseDTO>` | `int intEmpresa, int intYear` |
| GetPresupuestosAsync | IAspelCoiApiClient | GET_LIST | `Task<AspelPresupuestosResponseDTO>` | `int intEmpresa, int intYear` |
| GetPolizasAsync | IAspelCoiApiClient | GET_LIST | `Task<AspelPolizasResponseDTO>` | `int intEmpresa, int intYear` |
| GetAuxiliaresAsync | IAspelCoiApiClient | GET_LIST | `Task<AspelAuxiliaresResponseDTO>` | `int intEmpresa, int intYear` |
| GetDatosConsolidadosAsync | IAspelCoiApiClient | GET_LIST | `Task<AspelDatosCombinadosDTO>` | `int intEmpresa, int intYear` |
| GetDatosBasicosAsync | IAspelCoiApiClient | GET_LIST | `Task<AspelDatosCombinadosDTO>` | `int intEmpresa, int intYear` |
| InvalidarCache | IAspelCoiApiClient | SPECIAL | `void` | `int intEmpresa, int intYear` |
| GetRawDataViaAspelApiAsync | IContabilidadOnlineLocalService | GET_LIST | `Task<AspelRawResponseDTO>` | `Guid customerId, int fiscalYear, string empresa = ""` |
| GetDatosConsolidadosViaAspelApiAsync | IContabilidadOnlineLocalService | GET_LIST | `Task<AspelDatosCombinadosDTO>` | `Guid customerId, int fiscalYear, string empresa = ""` |
| GetDatosBasicosViaAspelApiAsync | IContabilidadOnlineLocalService | GET_LIST | `Task<AspelDatosCombinadosDTO>` | `Guid customerId, int fiscalYear, string empresa = ""` |


### Grupo: DireccionLuxuryApp

#### Modulo: JuntasMensuales

- Interfaces: 2 | Servicios: 2 | Endpoints: 2 | DTOs: 2

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IAsambleaChecklistAppService | 2 | `DireccionLuxuryApp/JuntasMensuales/Asamblea/Checklist/Interfaces/IAsambleaChecklistAppService.cs` |
| IAsambleaChecklistService | 1 | `DireccionLuxuryApp/JuntasMensuales/Asamblea/Checklist/Interfaces/IAsambleaChecklistService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| AsambleaChecklistAppService | 2 | `DireccionLuxuryApp/JuntasMensuales/Asamblea/Checklist/Services/AsambleaChecklistAppService.cs` |
| AsambleaChecklistService | 1 | `DireccionLuxuryApp/JuntasMensuales/Asamblea/Checklist/Services/AsambleaChecklistService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetBySessionIdAsync | IAsambleaChecklistAppService | GET_LIST | `Task<ApiResponseDTO<List<AsambleaChecklistE…` | `Guid sessionId` |
| UpdateStatusAsync | IAsambleaChecklistAppService | UPDATE | `Task<ApiResponseDTO<AsambleaChecklistExecut…` | `Guid executionId, AsambleaChecklistUpdateStatusDTO dto` |
| EnsureChecklistForPlanAsync | IAsambleaChecklistService | SPECIAL | `Task` | `AsambleaPlan assemblyPlan, DateTime scheduledAt, Cancellati…` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/asamblea-checklist/session/{sessionId:guid}` | `appService.GetBySessionIdAsync` | `DireccionLuxuryApp/JuntasMensuales/Asamblea/Checklist/EndPoints/AsambleaChecklistEndpoints.cs` |
| PUT | `/api/asamblea-checklist/{executionId:guid}/status` | `appService.UpdateStatusAsync` | `DireccionLuxuryApp/JuntasMensuales/Asamblea/Checklist/EndPoints/AsambleaChecklistEndpoints.cs` |


### Grupo: LegalLuxuryApp

#### Modulo: EmployeeContracts

- Interfaces: 4 | Servicios: 4 | Endpoints: 10 | DTOs: 6

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IContractAddendumAppService | 2 | `LegalLuxuryApp/EmployeeContracts/Interfaces/IContractAddendumAppService.cs` |
| IContractRenewalAppService | 5 | `LegalLuxuryApp/EmployeeContracts/Interfaces/IContractRenewalAppService.cs` |
| IEmployeeContractGeneratorService | 1 | `LegalLuxuryApp/EmployeeContracts/Interfaces/IEmployeeContractGeneratorService.cs` |
| IEmployeeWorkContractAppService | 8 | `LegalLuxuryApp/EmployeeContracts/Interfaces/IEmployeeWorkContractAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| ContractAddendumAppService | 0 | `LegalLuxuryApp/EmployeeContracts/Services/ContractAddendumAppService.cs` |
| ContractRenewalAppService | 5 | `LegalLuxuryApp/EmployeeContracts/Services/ContractRenewalAppService.cs` |
| EmployeeContractGeneratorService | 1 | `LegalLuxuryApp/EmployeeContracts/Services/EmployeeContractGeneratorService.cs` |
| EmployeeWorkContractAppService | 8 | `LegalLuxuryApp/EmployeeContracts/Services/EmployeeWorkContractAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetAllAsync | IContractAddendumAppService | GET_LIST | `Task<ApiResponseDTO<ContractAddendumListDTO…` | `-` |
| GetByContractAsync | IContractAddendumAppService | GET_LIST | `Task<ApiResponseDTO<ContractAddendumListDTO…` | `Guid employeeWorkContractId` |
| GetByIdAsync | IContractRenewalAppService | GET_SINGLE | `Task<ApiResponseDTO<ContractRenewalEvaluati…` | `Guid id` |
| GetAllAsync | IContractRenewalAppService | GET_LIST | `Task<ApiResponseDTO<ContractRenewalEvaluati…` | `-` |
| GetByContractAsync | IContractRenewalAppService | GET_LIST | `Task<ApiResponseDTO<ContractRenewalEvaluati…` | `Guid employeeWorkContractId` |
| RegisterDecisionAsync | IContractRenewalAppService | SPECIAL | `Task<ApiResponseDTO<ContractRenewalEvaluati…` | `Guid id, ContractRenewalDecisionDTO dto` |
| LinkPerformanceEvaluationAsync | IContractRenewalAppService | SPECIAL | `Task<ApiResponseDTO<ContractRenewalEvaluati…` | `Guid evaluationId, Guid performanceEvaluationId` |
| GenerateContractOnConfirmedAsync | IEmployeeContractGeneratorService | SPECIAL | `Task<ApiResponseDTO<EmployeeWorkContractDTO…` | `Guid requestEmployeeRegisterId` |
| GetByCustomerAsync | IEmployeeWorkContractAppService | GET_LIST | `Task<ApiResponseDTO<EmployeeWorkContractDTO…` | `Guid customerId` |
| GetByEmployeeAsync | IEmployeeWorkContractAppService | GET_LIST | `Task<ApiResponseDTO<EmployeeWorkContractDTO…` | `Guid employeeId` |
| GetByIdAsync | IEmployeeWorkContractAppService | GET_SINGLE | `Task<ApiResponseDTO<EmployeeWorkContractDTO…` | `Guid id` |
| CreateAsync | IEmployeeWorkContractAppService | CREATE | `Task<ApiResponseDTO<EmployeeWorkContractDTO…` | `EmployeeWorkContractCreateDTO dto` |
| UpdateAsync | IEmployeeWorkContractAppService | UPDATE | `Task<ApiResponseDTO<EmployeeWorkContractDTO…` | `Guid id, EmployeeWorkContractUpdateDTO dto` |
| DeleteAsync | IEmployeeWorkContractAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| TerminateAsync | IEmployeeWorkContractAppService | SPECIAL | `Task<ApiResponseDTO<EmployeeWorkContractDTO…` | `Guid id, EmployeeWorkContractTerminateDTO dto` |
| UploadSignedAsync | IEmployeeWorkContractAppService | SPECIAL | `Task<ApiResponseDTO<EmployeeWorkContractDTO…` | `Guid id, Microsoft.AspNetCore.Http.IFormFile file` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/hr/contract-addendums` | `service.GetAllAsync` | `LegalLuxuryApp/EmployeeContracts/EndPoints/ContractAddendumsEndPoints.cs` |
| GET | `/api/hr/contract-addendums/by-contract/{employeeWorkContractId:guid}` | `service.GetByContractAsync` | `LegalLuxuryApp/EmployeeContracts/EndPoints/ContractAddendumsEndPoints.cs` |
| GET | `/api/hr/employee-work-contracts/customer/{customerId:guid}` | `dataService.GetByCustomerAsync` | `LegalLuxuryApp/EmployeeContracts/EndPoints/EmployeeWorkContractsEndPoints.cs` |
| GET | `/api/hr/employee-work-contracts/by-employee/{employeeId:guid}` | `dataService.GetByEmployeeAsync` | `LegalLuxuryApp/EmployeeContracts/EndPoints/EmployeeWorkContractsEndPoints.cs` |
| GET | `/api/hr/employee-work-contracts/{id:guid}` | `dataService.GetByIdAsync` | `LegalLuxuryApp/EmployeeContracts/EndPoints/EmployeeWorkContractsEndPoints.cs` |
| POST | `/api/hr/employee-work-contracts` | `dataService.CreateAsync` | `LegalLuxuryApp/EmployeeContracts/EndPoints/EmployeeWorkContractsEndPoints.cs` |
| PUT | `/api/hr/employee-work-contracts/{id:guid}` | `dataService.UpdateAsync` | `LegalLuxuryApp/EmployeeContracts/EndPoints/EmployeeWorkContractsEndPoints.cs` |
| DELETE | `/api/hr/employee-work-contracts/{id:guid}` | `dataService.DeleteAsync` | `LegalLuxuryApp/EmployeeContracts/EndPoints/EmployeeWorkContractsEndPoints.cs` |
| POST | `/api/hr/employee-work-contracts/{id:guid}/terminate` | `dataService.TerminateAsync` | `LegalLuxuryApp/EmployeeContracts/EndPoints/EmployeeWorkContractsEndPoints.cs` |
| POST | `/api/hr/employee-work-contracts/{id:guid}/upload-signed` | `dataService.UploadSignedAsync` | `LegalLuxuryApp/EmployeeContracts/EndPoints/EmployeeWorkContractsEndPoints.cs` |

#### Modulo: Employees

- Interfaces: 1 | Servicios: 1 | Endpoints: 1 | DTOs: 1

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| ILegalEmployeeAppService | 1 | `LegalLuxuryApp/Employees/ILegalEmployeeAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| LegalEmployeeAppService | 1 | `LegalLuxuryApp/Employees/LegalEmployeeAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetActiveEmployeesByCustomerAsync | ILegalEmployeeAppService | GET_LIST | `Task<ApiResponseDTO<LegalEmployeeDTO[]>>` | `Guid customerId` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/legal/employees/customer/{customerId:guid}` | `dataService.GetActiveEmployeesByCustomerAsync` | `LegalLuxuryApp/Employees/EndPoints/LegalEmployeesEndPoints.cs` |

#### Modulo: Legal

- Interfaces: 5 | Servicios: 6 | Endpoints: 35 | DTOs: 7

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IBoardDirectorsAppService | 6 | `LegalLuxuryApp/Legal/BoardDirectors/Services/IBoardDirectorsAppService.cs` |
| IContratoPolizaAppService | 8 | `LegalLuxuryApp/Legal/ContractPolicy/Interfaces/IContratoPolizaAppService.cs` |
| ILegalMatterAppService | 12 | `LegalLuxuryApp/Legal/LegalMatters/Interfaces/ILegalMatterAppService.cs` |
| ILegalMatterCategoryAppService | 0 | `LegalLuxuryApp/Legal/LegalMatters/Interfaces/ILegalMatterCategoryAppService.cs` |
| ILegalReportAppService | 12 | `LegalLuxuryApp/Legal/LegalReport/Interfaces/ILegalReportAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| BoardDirectorsAppService | 6 | `LegalLuxuryApp/Legal/BoardDirectors/Repositories/BoardDirectorsAppService.cs` |
| PolicyContractMapper | 0 | `LegalLuxuryApp/Legal/ContractPolicy/Mapping/PolicyContractMapper.cs` |
| ContratoPolizaAppService | 8 | `LegalLuxuryApp/Legal/ContractPolicy/Services/ContratoPolizaAppService.cs` |
| LegalMatterAppService | 12 | `LegalLuxuryApp/Legal/LegalMatters/Services/LegalMatterAppService.cs` |
| LegalMatterCategoryAppService | 0 | `LegalLuxuryApp/Legal/LegalMatters/Services/LegalMatterCategoryAppService.cs` |
| LegalReportAppService | 12 | `LegalLuxuryApp/Legal/LegalReport/Services/LegalReportAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetBoardDirectorsDocumentsAsync | IBoardDirectorsAppService | GET_LIST | `Task<ApiResponseDTO<List<BoardDirectorsDocu…` | `Guid customerId, DocumentType documentType` |
| GetBoardDirectorsMonthlyMeetingsAsync | IBoardDirectorsAppService | GET_LIST | `Task<ApiResponseDTO<List<BoardDirectorsDocu…` | `Guid customerId` |
| GetBoardDirectorsMeetingMinutesAsync | IBoardDirectorsAppService | GET_LIST | `Task<ApiResponseDTO<List<BoardDirectorsDocu…` | `Guid customerId` |
| GetBoardDirectorsFinancialReportsAsync | IBoardDirectorsAppService | GET_LIST | `Task<ApiResponseDTO<List<BoardDirectorsDocu…` | `Guid customerId` |
| GetBoardDirectorsMeetingAsync | IBoardDirectorsAppService | GET_LIST | `Task<ApiResponseDTO<MeetingBoardDirectorsDT…` | `Guid meetingId` |
| GetCustomDocumentsByTypeAsync | IBoardDirectorsAppService | GET_LIST | `Task<ApiResponseDTO<List<BoardDirectorsDocu…` | `Guid customerId, DocumentType documentType` |
| GetByIdAsync | IContratoPolizaAppService | GET_SINGLE | `Task<ApiResponseDTO<object>>` | `Guid id` |
| GetAllAsync | IContratoPolizaAppService | GET_LIST | `Task<ApiResponseDTO<IEnumerable<object>>>` | `Guid customerId, bool isCurrent` |
| AddAsync | IContratoPolizaAppService | CREATE | `Task<ApiResponseDTO<ContratoPoliza>>` | `ContratoPolizaAddOrEditDTO DTO` |
| UpdateAsync | IContratoPolizaAppService | UPDATE | `Task<ApiResponseDTO<ContratoPoliza>>` | `Guid id, ContratoPolizaAddOrEditDTO DTO` |
| DeleteAsync | IContratoPolizaAppService | DELETE | `Task<ApiResponseDTO<ContratoPoliza>>` | `Guid id` |
| GetDocumentAsync | IContratoPolizaAppService | GET_LIST | `Task<ApiResponseDTO<ContratoPoliza>>` | `int id` |
| DeleteDocumentAsync | IContratoPolizaAppService | DELETE | `Task<ApiResponseDTO<ContratoPoliza>>` | `Guid id` |
| GetBuildingInsurancePolicyAsync | IContratoPolizaAppService | GET_LIST | `Task<ApiResponseDTO<object>>` | `Guid customerId` |
| GetListAsync | ILegalMatterAppService | GET_LIST | `Task<ApiResponseDTO<List<LegalMatterCategor…` | `-` |
| GetCategoriesAsync | ILegalMatterAppService | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<Guid…` | `-` |
| GetSelectForAddTicketAsync | ILegalMatterAppService | GET_LIST | `Task<ApiResponseDTO<List<object>>>` | `-` |
| GetAsync | ILegalMatterAppService | GET_SINGLE | `Task<ApiResponseDTO<LegalMatterAddDTO>>` | `Guid id` |
| PostAsync | ILegalMatterAppService | CREATE | `Task<ApiResponseDTO<LegalMatter>>` | `LegalMatterAddDTO DTO` |
| PutAsync | ILegalMatterAppService | UPDATE | `Task<ApiResponseDTO<object>>` | `Guid id, LegalMatterAddDTO DTO` |
| DeleteByIdAsync | ILegalMatterAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetCategoryAsync | ILegalMatterAppService | GET_LIST | `Task<ApiResponseDTO<LegalMatterCategoryAddO…` | `string id` |
| CategoryPostAsync | ILegalMatterAppService | OTHER | `Task<ApiResponseDTO<LegalMatterCategory>>` | `LegalMatterCategoryAddOrEditDTO DTO` |
| CategoryPutAsync | ILegalMatterAppService | OTHER | `Task<ApiResponseDTO<LegalMatterCategory>>` | `string id, LegalMatterCategoryAddOrEditDTO DTO` |
| DeleteCategoryByIdAsync | ILegalMatterAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| CategorySelectAsync | ILegalMatterAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<Guid…` | `-` |
| PendingAsync | ILegalReportAppService | OTHER | `Task<ApiResponseDTO<IEnumerable<object>>>` | `TypePerson typePerson` |
| PendingUnassignedDataAsync | ILegalReportAppService | OTHER | `Task<ApiResponseDTO<IEnumerable<object>>>` | `-` |
| PendingSummaryAsync | ILegalReportAppService | OTHER | `Task<ApiResponseDTO<IEnumerable<object>>>` | `DateTime startDate, DateTime endDate` |
| SummaryIndividualAsync | ILegalReportAppService | OTHER | `Task<ApiResponseDTO<IEnumerable<object>>>` | `DateTime startDate, DateTime endDate` |
| SummaryCustomerAsync | ILegalReportAppService | OTHER | `Task<ApiResponseDTO<IEnumerable<object>>>` | `DateTime startDate, DateTime endDate` |
| TotalRequestsAsync | ILegalReportAppService | OTHER | `Task<ApiResponseDTO<object>>` | `DateTime startDate, DateTime endDate` |
| ObtenerResumenTickets | ILegalReportAppService | GET_LIST | `Task<ApiResponseDTO<object>>` | `DateTime startDate, DateTime endDate, bool isInternal` |
| RequestsAttendedAsync | ILegalReportAppService | OTHER | `Task<ApiResponseDTO<IEnumerable<object>>>` | `DateTime startDate, DateTime endDate, bool isInternal` |
| RequestsPendingAsync | ILegalReportAppService | OTHER | `Task<ApiResponseDTO<IEnumerable<object>>>` | `bool isInternal` |
| GenerateWeeklyReportAsync | ILegalReportAppService | SPECIAL | `Task<ApiResponseDTO<byte[]>>` | `Guid customerId, DateTime startDate, DateTime endDate, bool…` |
| GetPendingMinutesAsync | ILegalReportAppService | GET_LIST | `Task<ApiResponseDTO<object>>` | `Guid customerId` |
| EstadosFinancierosAsync | ILegalReportAppService | OTHER | `Task<ApiResponseDTO<object>>` | `Guid customerId` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/board-directors/documents/{customerId:guid}/{documentType}` | `appService.GetBoardDirectorsDocumentsAsync` | `LegalLuxuryApp/Legal/BoardDirectors/EndPoints/BoardDirectorsEndPoints.cs` |
| GET | `/api/board-directors/financial-reports/{customerId:guid}` | `appService.GetBoardDirectorsFinancialReportsAsync` | `LegalLuxuryApp/Legal/BoardDirectors/EndPoints/BoardDirectorsEndPoints.cs` |
| GET | `/api/board-directors/monthly-meetings/{customerId:guid}` | `appService.GetBoardDirectorsMonthlyMeetingsAsync` | `LegalLuxuryApp/Legal/BoardDirectors/EndPoints/BoardDirectorsEndPoints.cs` |
| GET | `/api/board-directors/meeting-minutes/{customerId:guid}` | `appService.GetBoardDirectorsMeetingMinutesAsync` | `LegalLuxuryApp/Legal/BoardDirectors/EndPoints/BoardDirectorsEndPoints.cs` |
| GET | `/api/board-directors/meeting-minutes-detail/{meetingId:guid}` | `appService.GetBoardDirectorsMeetingAsync` | `LegalLuxuryApp/Legal/BoardDirectors/EndPoints/BoardDirectorsEndPoints.cs` |
| GET | `/api/board-directors/document-by-type/{customerId:guid}/{documentType}` | `appService.GetCustomDocumentsByTypeAsync` | `LegalLuxuryApp/Legal/BoardDirectors/EndPoints/BoardDirectorsEndPoints.cs` |
| GET | `/api/policy-contract/{id:guid}` | `appService.GetByIdAsync` | `LegalLuxuryApp/Legal/ContractPolicy/EndPoints/PolicyContractEndPoints.cs` |
| GET | `/api/policy-contract/list/{customerId:guid}/{isCurrent:bool}` | `appService.GetAllAsync` | `LegalLuxuryApp/Legal/ContractPolicy/EndPoints/PolicyContractEndPoints.cs` |
| POST | `/api/policy-contract` | `appService.AddAsync` | `LegalLuxuryApp/Legal/ContractPolicy/EndPoints/PolicyContractEndPoints.cs` |
| PUT | `/api/policy-contract/{id:guid}` | `appService.UpdateAsync` | `LegalLuxuryApp/Legal/ContractPolicy/EndPoints/PolicyContractEndPoints.cs` |
| DELETE | `/api/policy-contract/{id:guid}` | `appService.DeleteAsync` | `LegalLuxuryApp/Legal/ContractPolicy/EndPoints/PolicyContractEndPoints.cs` |
| GET | `/api/policy-contract/get-document/{id:int}` | `appService.GetDocumentAsync` | `LegalLuxuryApp/Legal/ContractPolicy/EndPoints/PolicyContractEndPoints.cs` |
| DELETE | `/api/policy-contract/delete-document/{id:guid}` | `appService.DeleteDocumentAsync` | `LegalLuxuryApp/Legal/ContractPolicy/EndPoints/PolicyContractEndPoints.cs` |
| GET | `/api/policy-contract/building-insurance/{customerId:guid}` | `appService.GetBuildingInsurancePolicyAsync` | `LegalLuxuryApp/Legal/ContractPolicy/EndPoints/PolicyContractEndPoints.cs` |
| GET | `/api/legal-directories/committees` | `appService.GetAllCommitteesAsync` | `LegalLuxuryApp/Legal/LegalDirectories/EndPoints/LegalDirectoriesEndPoints.cs` |
| GET | `/api/legal-matter` | `appService.GetlegalMatterAddDTOAsync` | `LegalLuxuryApp/Legal/LegalMatters/EndPoints/LegalMatterEndPoints.cs` |
| GET | `/api/legal-matter/{id:guid}` | `appService.GetlegalMatterAddDTOAsync` | `LegalLuxuryApp/Legal/LegalMatters/EndPoints/LegalMatterEndPoints.cs` |
| POST | `/api/legal-matter` | `appService.AddAsync` | `LegalLuxuryApp/Legal/LegalMatters/EndPoints/LegalMatterEndPoints.cs` |
| PUT | `/api/legal-matter/{id:guid}` | `appService.UpdateAsync` | `LegalLuxuryApp/Legal/LegalMatters/EndPoints/LegalMatterEndPoints.cs` |
| DELETE | `/api/legal-matter/{id:guid}` | `appService.DeleteByIdAsync` | `LegalLuxuryApp/Legal/LegalMatters/EndPoints/LegalMatterEndPoints.cs` |
| GET | `/api/legal-matter/category/{id:guid}` | `appService.CategoryAsync` | `LegalLuxuryApp/Legal/LegalMatters/EndPoints/LegalMatterEndPoints.cs` |
| POST | `/api/legal-matter/category` | `appService.CreateCategoryAsync` | `LegalLuxuryApp/Legal/LegalMatters/EndPoints/LegalMatterEndPoints.cs` |
| PUT | `/api/legal-matter/category/{id:guid}` | `appService.UpdateCategoryAsync` | `LegalLuxuryApp/Legal/LegalMatters/EndPoints/LegalMatterEndPoints.cs` |
| DELETE | `/api/legal-matter/category/{id:guid}` | `appService.DeleteCategoryByIdAsync` | `LegalLuxuryApp/Legal/LegalMatters/EndPoints/LegalMatterEndPoints.cs` |
| GET | `/api/legal-minuta/lista-minuta` | `appService.GetMeetingLegalDTOAsync` | `LegalLuxuryApp/Legal/LegalMinuta/EndPoints/LegalMinutaEndPoints.cs` |
| GET | `/api/legal-report/pending/{typePerson}` | `appService.PendingAsync` | `LegalLuxuryApp/Legal/LegalReport/EndPoints/LegalReportEndPoints.cs` |
| GET | `/api/legal-report/pending-unassigned-data` | `appService.PendingUnassignedDataAsync` | `LegalLuxuryApp/Legal/LegalReport/EndPoints/LegalReportEndPoints.cs` |
| GET | `/api/legal-report/summary/{startDate}/{endDate}` | `appService.PendingSummaryAsync` | `LegalLuxuryApp/Legal/LegalReport/EndPoints/LegalReportEndPoints.cs` |
| GET | `/api/legal-report/summary-individual/{startDate}/{endDate}` | `appService.SummaryIndividualAsync` | `LegalLuxuryApp/Legal/LegalReport/EndPoints/LegalReportEndPoints.cs` |
| GET | `/api/legal-report/summary-customer/{startDate}/{endDate}` | `appService.SummaryCustomerAsync` | `LegalLuxuryApp/Legal/LegalReport/EndPoints/LegalReportEndPoints.cs` |
| GET | `/api/legal-report/total-requests/{startDate}/{endDate}` | `appService.TotalRequestsAsync` | `LegalLuxuryApp/Legal/LegalReport/EndPoints/LegalReportEndPoints.cs` |
| GET | `/api/legal-report/results/{startDate}/{endDate}/{isInternal}` | `appService.RequestsAttendedAsync` | `LegalLuxuryApp/Legal/LegalReport/EndPoints/LegalReportEndPoints.cs` |
| GET | `/api/legal-report/requests-attended/{startDate}/{endDate}/{isInternal}` | `appService.RequestsAttendedAsync` | `LegalLuxuryApp/Legal/LegalReport/EndPoints/LegalReportEndPoints.cs` |
| GET | `/api/legal-report/requests-pending/{isInternal}` | `appService.RequestsPendingAsync` | `LegalLuxuryApp/Legal/LegalReport/EndPoints/LegalReportEndPoints.cs` |
| GET | `/api/legal-report/generate-weekly-report/{customerId}/{startDate}/{endDate}/{isInternal}` | `appService.GenerateWeeklyReportAsync` | `LegalLuxuryApp/Legal/LegalReport/EndPoints/LegalReportEndPoints.cs` |


### Grupo: MantenimientoLuxuryApp

#### Modulo: BudgetMaintenance

- Interfaces: 0 | Servicios: 0 | Endpoints: 2 | DTOs: 0

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/budget-maintenance/summary-of-expenses/{customerId:guid}` | `appService.GetResumenGastosAsync` | `MantenimientoLuxuryApp/BudgetMaintenance/EndPoints/BudgetMaintenanceEndPoints.cs` |
| GET | `/api/budget-maintenance/resumen-gastos/{customerId:guid}` | `appService.GetResumenAsync` | `MantenimientoLuxuryApp/BudgetMaintenance/EndPoints/BudgetMaintenanceEndPoints.cs` |

#### Modulo: CalendariosMaestro

- Interfaces: 2 | Servicios: 3 | Endpoints: 5 | DTOs: 1

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| ICalendarioMaestroAppService | 5 | `MantenimientoLuxuryApp/CalendariosMaestro/Interfaces/ICalendarioMaestroAppService.cs` |
| ICalendarioMaestroProviderAppService | 0 | `MantenimientoLuxuryApp/CalendariosMaestro/Interfaces/ICalendarioMaestroProviderAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| MasterCalendarProvider | 0 | `MantenimientoLuxuryApp/CalendariosMaestro/Entities/MasterCalendarProvider.cs` |
| CalendarioMaestroAppService | 5 | `MantenimientoLuxuryApp/CalendariosMaestro/Services/CalendarioMaestroAppService.cs` |
| CalendarioMaestroProviderAppService | 0 | `MantenimientoLuxuryApp/CalendariosMaestro/Services/CalendarioMaestroProviderAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetAsyncByIdAsync | ICalendarioMaestroAppService | GET_SINGLE | `Task<ApiResponseDTO<CalendarioMaestroAddOrE…` | `Guid id` |
| GetAllAsync | ICalendarioMaestroAppService | GET_LIST | `Task<ApiResponseDTO<object>>` | `-` |
| AddAsync | ICalendarioMaestroAppService | CREATE | `Task<ApiResponseDTO<MasterCalendar>>` | `CalendarioMaestroAddOrEditDTO DTO` |
| UpdateAsync | ICalendarioMaestroAppService | UPDATE | `Task<ApiResponseDTO<MasterCalendar>>` | `Guid id, CalendarioMaestroAddOrEditDTO DTO` |
| DeleteAsync | ICalendarioMaestroAppService | DELETE | `Task<ApiResponseDTO<int>>` | `Guid id` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/calendario-maestro/{id:guid}` | `dataService.GetAsyncByIdAsync` | `MantenimientoLuxuryApp/CalendariosMaestro/EndPoints/CalendarioMaestroEndpoints.cs` |
| GET | `/api/calendario-maestro/list` | `dataService.GetAllAsync` | `MantenimientoLuxuryApp/CalendariosMaestro/EndPoints/CalendarioMaestroEndpoints.cs` |
| POST | `/api/calendario-maestro` | `dataService.AddAsync` | `MantenimientoLuxuryApp/CalendariosMaestro/EndPoints/CalendarioMaestroEndpoints.cs` |
| PUT | `/api/calendario-maestro/{id:guid}` | `dataService.UpdateAsync` | `MantenimientoLuxuryApp/CalendariosMaestro/EndPoints/CalendarioMaestroEndpoints.cs` |
| DELETE | `/api/calendario-maestro/{id:guid}` | `dataService.DeleteAsync` | `MantenimientoLuxuryApp/CalendariosMaestro/EndPoints/CalendarioMaestroEndpoints.cs` |

#### Modulo: CalendariosMaestroEquipo

- Interfaces: 1 | Servicios: 2 | Endpoints: 5 | DTOs: 2

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| ICalendarioMaestroEquipoAppService | 5 | `MantenimientoLuxuryApp/CalendariosMaestroEquipo/Interfaces/ICalendarioMaestroEquipoAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| CalendarioMaestroEquipoMapper | 0 | `MantenimientoLuxuryApp/CalendariosMaestroEquipo/Mapping/CalendarioMaestroEquipoMapper.cs` |
| CalendarioMaestroEquipoAppService | 5 | `MantenimientoLuxuryApp/CalendariosMaestroEquipo/Services/CalendarioMaestroEquipoAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetByIdAsync | ICalendarioMaestroEquipoAppService | GET_SINGLE | `Task<ApiResponseDTO<CalendarioMaestroEquipo…` | `Guid id` |
| GetAllAsync | ICalendarioMaestroEquipoAppService | GET_LIST | `Task<ApiResponseDTO<CalendarioMaestroEquipo…` | `-` |
| AddAsync | ICalendarioMaestroEquipoAppService | CREATE | `Task<ApiResponseDTO<MasterCalendarEquipment…` | `CalendarioMaestroEquipoAddOrEditDTO DTO` |
| UpdateAsync | ICalendarioMaestroEquipoAppService | UPDATE | `Task<ApiResponseDTO<MasterCalendarEquipment…` | `Guid id, CalendarioMaestroEquipoAddOrEditDTO DTO` |
| DeleteByIdAsync | ICalendarioMaestroEquipoAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/calendario-maestro-equipo/{id:guid}` | `dataService.GetByIdAsync` | `MantenimientoLuxuryApp/CalendariosMaestroEquipo/EndPoints/CalendarioMaestroEquipoEndpoints.cs` |
| GET | `/api/calendario-maestro-equipo` | `dataService.GetAllAsync` | `MantenimientoLuxuryApp/CalendariosMaestroEquipo/EndPoints/CalendarioMaestroEquipoEndpoints.cs` |
| POST | `/api/calendario-maestro-equipo` | `dataService.AddAsync` | `MantenimientoLuxuryApp/CalendariosMaestroEquipo/EndPoints/CalendarioMaestroEquipoEndpoints.cs` |
| PUT | `/api/calendario-maestro-equipo/{id:guid}` | `dataService.UpdateAsync` | `MantenimientoLuxuryApp/CalendariosMaestroEquipo/EndPoints/CalendarioMaestroEquipoEndpoints.cs` |
| DELETE | `/api/calendario-maestro-equipo/{id:guid}` | `dataService.DeleteByIdAsync` | `MantenimientoLuxuryApp/CalendariosMaestroEquipo/EndPoints/CalendarioMaestroEquipoEndpoints.cs` |

#### Modulo: ElevatorEmergencyCall

- Interfaces: 1 | Servicios: 1 | Endpoints: 6 | DTOs: 2

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IElevatorsEmergencyCallAppService | 6 | `MantenimientoLuxuryApp/ElevatorEmergencyCall/Interfaces/IElevatorsEmergencyCallAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| ElevatorsEmergencyCallAppService | 6 | `MantenimientoLuxuryApp/ElevatorEmergencyCall/Services/ElevatorsEmergencyCallAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetByIdAsync | IElevatorsEmergencyCallAppService | GET_SINGLE | `Task<ApiResponseDTO<ElevatorsEmergencyCallA…` | `Guid id` |
| GetAllAsync | IElevatorsEmergencyCallAppService | GET_LIST | `Task<ApiResponseDTO<List<ElevatorsEmergency…` | `Guid customerId` |
| GetElevatorsAsync | IElevatorsEmergencyCallAppService | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<Guid…` | `Guid customerId` |
| AddAsync | IElevatorsEmergencyCallAppService | CREATE | `Task<ApiResponseDTO<ElevatorsEmergencyCallD…` | `ElevatorsEmergencyCallAddOrEditDTO DTO` |
| UpdateAsync | IElevatorsEmergencyCallAppService | UPDATE | `Task<ApiResponseDTO<ElevatorsEmergencyCallD…` | `Guid id, ElevatorsEmergencyCallAddOrEditDTO DTO` |
| DeleteByIdAsync | IElevatorsEmergencyCallAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/elevators-emergency-call/{id:guid}` | `dataService.GetByIdAsync` | `MantenimientoLuxuryApp/ElevatorEmergencyCall/EndPoints/ElevatorsEmergencyCallEndPoints.cs` |
| GET | `/api/elevators-emergency-call/list/{customerId:guid}` | `dataService.GetAllAsync` | `MantenimientoLuxuryApp/ElevatorEmergencyCall/EndPoints/ElevatorsEmergencyCallEndPoints.cs` |
| GET | `/api/elevators-emergency-call/elevators/{customerId:guid}` | `dataService.GetElevatorsAsync` | `MantenimientoLuxuryApp/ElevatorEmergencyCall/EndPoints/ElevatorsEmergencyCallEndPoints.cs` |
| POST | `/api/elevators-emergency-call` | `dataService.AddAsync` | `MantenimientoLuxuryApp/ElevatorEmergencyCall/EndPoints/ElevatorsEmergencyCallEndPoints.cs` |
| PUT | `/api/elevators-emergency-call/{id:guid}` | `dataService.UpdateAsync` | `MantenimientoLuxuryApp/ElevatorEmergencyCall/EndPoints/ElevatorsEmergencyCallEndPoints.cs` |
| DELETE | `/api/elevators-emergency-call/{id:guid}` | `dataService.DeleteByIdAsync` | `MantenimientoLuxuryApp/ElevatorEmergencyCall/EndPoints/ElevatorsEmergencyCallEndPoints.cs` |

#### Modulo: ElevatorSpareParts

- Interfaces: 1 | Servicios: 2 | Endpoints: 6 | DTOs: 2

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IElevatorSparePartsChangeAppService | 6 | `MantenimientoLuxuryApp/ElevatorSpareParts/Interfaces/IElevatorSparePartsChangeAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| ElevatorMapper | 0 | `MantenimientoLuxuryApp/ElevatorSpareParts/Mapping/ElevatorMapper.cs` |
| ElevatorSparePartsChangeAppService | 6 | `MantenimientoLuxuryApp/ElevatorSpareParts/Services/ElevatorSparePartsChangeAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetByIdAsync | IElevatorSparePartsChangeAppService | GET_SINGLE | `Task<ApiResponseDTO<ElevatorSparePartsChang…` | `Guid id` |
| GetAllAsync | IElevatorSparePartsChangeAppService | GET_LIST | `Task<ApiResponseDTO<List<ElevatorSpareParts…` | `Guid customerId` |
| GetElevatorsAsync | IElevatorSparePartsChangeAppService | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<Guid…` | `Guid customerId` |
| AddAsync | IElevatorSparePartsChangeAppService | CREATE | `Task<ApiResponseDTO<ElevatorSparePartsChang…` | `ElevatorSparePartsChangeAddOrEditDTO DTO` |
| UpdateAsync | IElevatorSparePartsChangeAppService | UPDATE | `Task<ApiResponseDTO<ElevatorSparePartsChang…` | `Guid id, ElevatorSparePartsChangeAddOrEditDTO DTO` |
| DeleteByIdAsync | IElevatorSparePartsChangeAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/elevator-spare-parts-change/{id:guid}` | `dataService.GetByIdAsync` | `MantenimientoLuxuryApp/ElevatorSpareParts/EndPoints/ElevatorSparePartsChangeEndPoints.cs` |
| GET | `/api/elevator-spare-parts-change/list/{customerId:guid}` | `dataService.GetAllAsync` | `MantenimientoLuxuryApp/ElevatorSpareParts/EndPoints/ElevatorSparePartsChangeEndPoints.cs` |
| GET | `/api/elevator-spare-parts-change/elevators/{customerId:guid}` | `dataService.GetElevatorsAsync` | `MantenimientoLuxuryApp/ElevatorSpareParts/EndPoints/ElevatorSparePartsChangeEndPoints.cs` |
| POST | `/api/elevator-spare-parts-change` | `dataService.AddAsync` | `MantenimientoLuxuryApp/ElevatorSpareParts/EndPoints/ElevatorSparePartsChangeEndPoints.cs` |
| PUT | `/api/elevator-spare-parts-change/{id:guid}` | `dataService.UpdateAsync` | `MantenimientoLuxuryApp/ElevatorSpareParts/EndPoints/ElevatorSparePartsChangeEndPoints.cs` |
| DELETE | `/api/elevator-spare-parts-change/{id:guid}` | `dataService.DeleteByIdAsync` | `MantenimientoLuxuryApp/ElevatorSpareParts/EndPoints/ElevatorSparePartsChangeEndPoints.cs` |

#### Modulo: EquipmentInspections

- Interfaces: 3 | Servicios: 3 | Endpoints: 20 | DTOs: 4

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IEquipmentInspectionDefinitionAppService | 6 | `MantenimientoLuxuryApp/EquipmentInspections/Interfaces/IEquipmentInspectionDefinitionAppService.cs` |
| IEquipmentInspectionExecutionAppService | 7 | `MantenimientoLuxuryApp/EquipmentInspections/Interfaces/IEquipmentInspectionExecutionAppService.cs` |
| IEquipmentQrLabelAppService | 7 | `MantenimientoLuxuryApp/EquipmentInspections/Interfaces/IEquipmentQrLabelAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| EquipmentInspectionDefinitionAppService | 6 | `MantenimientoLuxuryApp/EquipmentInspections/Services/EquipmentInspectionDefinitionAppService.cs` |
| EquipmentInspectionExecutionAppService | 7 | `MantenimientoLuxuryApp/EquipmentInspections/Services/EquipmentInspectionExecutionAppService.cs` |
| EquipmentQrLabelAppService | 7 | `MantenimientoLuxuryApp/EquipmentInspections/Services/EquipmentQrLabelAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetByMachineryAsync | IEquipmentInspectionDefinitionAppService | GET_LIST | `Task<ApiResponseDTO<List<EquipmentInspectio…` | `Guid machineryId` |
| GetByIdAsync | IEquipmentInspectionDefinitionAppService | GET_SINGLE | `Task<ApiResponseDTO<EquipmentInspectionDefi…` | `Guid id` |
| AddAsync | IEquipmentInspectionDefinitionAppService | CREATE | `Task<ApiResponseDTO<EquipmentInspectionDefi…` | `EquipmentInspectionDefinitionAddOrEditDTO dto` |
| UpdateAsync | IEquipmentInspectionDefinitionAppService | UPDATE | `Task<ApiResponseDTO<EquipmentInspectionDefi…` | `Guid id, EquipmentInspectionDefinitionAddOrEditDTO dto` |
| ToggleActiveAsync | IEquipmentInspectionDefinitionAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid id, bool isActive` |
| DeleteByIdAsync | IEquipmentInspectionDefinitionAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetPendingAsync | IEquipmentInspectionExecutionAppService | GET_LIST | `Task<ApiResponseDTO<List<EquipmentInspectio…` | `Guid customerId` |
| GetByMachineryAsync | IEquipmentInspectionExecutionAppService | GET_LIST | `Task<ApiResponseDTO<List<EquipmentInspectio…` | `Guid machineryId` |
| GetByIdAsync | IEquipmentInspectionExecutionAppService | GET_SINGLE | `Task<ApiResponseDTO<EquipmentInspectionExec…` | `Guid id` |
| StartFromQrAsync | IEquipmentInspectionExecutionAppService | SPECIAL | `Task<ApiResponseDTO<EquipmentInspectionExec…` | `EquipmentInspectionExecutionStartFromQrDTO dto` |
| StartManualAsync | IEquipmentInspectionExecutionAppService | SPECIAL | `Task<ApiResponseDTO<EquipmentInspectionExec…` | `Guid definitionId` |
| CompleteAsync | IEquipmentInspectionExecutionAppService | SPECIAL | `Task<ApiResponseDTO<EquipmentInspectionExec…` | `Guid id, EquipmentInspectionExecutionCompleteDTO dto` |
| AdministrativeUpdateAsync | IEquipmentInspectionExecutionAppService | OTHER | `Task<ApiResponseDTO<EquipmentInspectionExec…` | `Guid id, EquipmentInspectionExecutionAdministrativeUpdateDT…` |
| GetByMachineryAsync | IEquipmentQrLabelAppService | GET_LIST | `Task<ApiResponseDTO<List<EquipmentQrLabelLi…` | `Guid machineryId` |
| GetByIdAsync | IEquipmentQrLabelAppService | GET_SINGLE | `Task<ApiResponseDTO<EquipmentQrLabelDTO>>` | `Guid id` |
| AddAsync | IEquipmentQrLabelAppService | CREATE | `Task<ApiResponseDTO<EquipmentQrLabelDTO>>` | `EquipmentQrLabelAddOrEditDTO dto` |
| RegenerateAsync | IEquipmentQrLabelAppService | OTHER | `Task<ApiResponseDTO<EquipmentQrLabelDTO>>` | `Guid id` |
| DownloadAsync | IEquipmentQrLabelAppService | SPECIAL | `Task<ApiResponseDTO<EquipmentQrDownloadItem…` | `Guid id` |
| DownloadBatchAsync | IEquipmentQrLabelAppService | SPECIAL | `Task<ApiResponseDTO<List<EquipmentQrDownloa…` | `EquipmentQrBatchDownloadDTO dto` |
| ResolveAsync | IEquipmentQrLabelAppService | SPECIAL | `Task<ApiResponseDTO<EquipmentQrResolveDTO>>` | `string code` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/equipment-inspection-definitions/by-machinery/{machineryId:guid}` | `appService.GetByMachineryAsync` | `MantenimientoLuxuryApp/EquipmentInspections/EndPoints/EquipmentInspectionDefinitionsEndPoints.cs` |
| GET | `/api/equipment-inspection-definitions/{id:guid}` | `appService.GetByIdAsync` | `MantenimientoLuxuryApp/EquipmentInspections/EndPoints/EquipmentInspectionDefinitionsEndPoints.cs` |
| POST | `/api/equipment-inspection-definitions` | `appService.AddAsync` | `MantenimientoLuxuryApp/EquipmentInspections/EndPoints/EquipmentInspectionDefinitionsEndPoints.cs` |
| PUT | `/api/equipment-inspection-definitions/{id:guid}` | `appService.UpdateAsync` | `MantenimientoLuxuryApp/EquipmentInspections/EndPoints/EquipmentInspectionDefinitionsEndPoints.cs` |
| PUT | `/api/equipment-inspection-definitions/{id:guid}/active/{isActive:bool}` | `appService.ToggleActiveAsync` | `MantenimientoLuxuryApp/EquipmentInspections/EndPoints/EquipmentInspectionDefinitionsEndPoints.cs` |
| DELETE | `/api/equipment-inspection-definitions/{id:guid}` | `appService.DeleteByIdAsync` | `MantenimientoLuxuryApp/EquipmentInspections/EndPoints/EquipmentInspectionDefinitionsEndPoints.cs` |
| GET | `/api/equipment-inspection-executions/pending/{customerId:guid}` | `appService.GetPendingAsync` | `MantenimientoLuxuryApp/EquipmentInspections/EndPoints/EquipmentInspectionExecutionsEndPoints.cs` |
| GET | `/api/equipment-inspection-executions/by-machinery/{machineryId:guid}` | `appService.GetByMachineryAsync` | `MantenimientoLuxuryApp/EquipmentInspections/EndPoints/EquipmentInspectionExecutionsEndPoints.cs` |
| GET | `/api/equipment-inspection-executions/{id:guid}` | `appService.GetByIdAsync` | `MantenimientoLuxuryApp/EquipmentInspections/EndPoints/EquipmentInspectionExecutionsEndPoints.cs` |
| POST | `/api/equipment-inspection-executions/start-from-qr` | `appService.StartFromQrAsync` | `MantenimientoLuxuryApp/EquipmentInspections/EndPoints/EquipmentInspectionExecutionsEndPoints.cs` |
| POST | `/api/equipment-inspection-executions/start-manual/{definitionId:guid}` | `appService.StartManualAsync` | `MantenimientoLuxuryApp/EquipmentInspections/EndPoints/EquipmentInspectionExecutionsEndPoints.cs` |
| PUT | `/api/equipment-inspection-executions/{id:guid}/complete` | `appService.CompleteAsync` | `MantenimientoLuxuryApp/EquipmentInspections/EndPoints/EquipmentInspectionExecutionsEndPoints.cs` |
| PUT | `/api/equipment-inspection-executions/{id:guid}/administrative-update` | `appService.AdministrativeUpdateAsync` | `MantenimientoLuxuryApp/EquipmentInspections/EndPoints/EquipmentInspectionExecutionsEndPoints.cs` |
| GET | `/api/equipment-qr-labels/by-machinery/{machineryId:guid}` | `appService.GetByMachineryAsync` | `MantenimientoLuxuryApp/EquipmentInspections/EndPoints/EquipmentQrLabelsEndPoints.cs` |
| GET | `/api/equipment-qr-labels/{id:guid}` | `appService.GetByIdAsync` | `MantenimientoLuxuryApp/EquipmentInspections/EndPoints/EquipmentQrLabelsEndPoints.cs` |
| POST | `/api/equipment-qr-labels` | `appService.AddAsync` | `MantenimientoLuxuryApp/EquipmentInspections/EndPoints/EquipmentQrLabelsEndPoints.cs` |
| POST | `/api/equipment-qr-labels/{id:guid}/regenerate` | `appService.RegenerateAsync` | `MantenimientoLuxuryApp/EquipmentInspections/EndPoints/EquipmentQrLabelsEndPoints.cs` |
| GET | `/api/equipment-qr-labels/{id:guid}/download` | `appService.DownloadAsync` | `MantenimientoLuxuryApp/EquipmentInspections/EndPoints/EquipmentQrLabelsEndPoints.cs` |
| POST | `/api/equipment-qr-labels/download-batch` | `appService.DownloadBatchAsync` | `MantenimientoLuxuryApp/EquipmentInspections/EndPoints/EquipmentQrLabelsEndPoints.cs` |
| GET | `/api/equipment-qr-labels/resolve/{code}` | `appService.ResolveAsync` | `MantenimientoLuxuryApp/EquipmentInspections/EndPoints/EquipmentQrLabelsEndPoints.cs` |

#### Modulo: FireEquipment

- Interfaces: 0 | Servicios: 0 | Endpoints: 0 | DTOs: 0

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|

#### Modulo: FireExtinguisherInventory

- Interfaces: 1 | Servicios: 2 | Endpoints: 6 | DTOs: 2

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IInventarioExtintorAppService | 6 | `MantenimientoLuxuryApp/FireExtinguisherInventory/Interfaces/IInventarioExtintorAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| InventarioExtintorMapper | 0 | `MantenimientoLuxuryApp/FireExtinguisherInventory/Mapping/InventarioExtintorMapper.cs` |
| InventarioExtintorAppService | 6 | `MantenimientoLuxuryApp/FireExtinguisherInventory/Services/InventarioExtintorAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetByIdAsync | IInventarioExtintorAppService | GET_SINGLE | `Task<ApiResponseDTO<InventarioExtintorAddOr…` | `Guid id` |
| GetAllAsync | IInventarioExtintorAppService | GET_LIST | `Task<ApiResponseDTO<InventarioExtintorDTO[]…` | `Guid customerId` |
| GetAllGroupAsync | IInventarioExtintorAppService | GET_LIST | `Task<ApiResponseDTO<object>>` | `Guid customerId` |
| AddAsync | IInventarioExtintorAppService | CREATE | `Task<ApiResponseDTO<InventarioExtintor>>` | `InventarioExtintorAddOrEditDTO DTO` |
| UpdateAsync | IInventarioExtintorAppService | UPDATE | `Task<ApiResponseDTO<InventarioExtintor>>` | `Guid id, InventarioExtintorAddOrEditDTO DTO` |
| DeleteByIdAsync | IInventarioExtintorAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/inventario-extintor/list/{customerId:guid}` | `appService.GetAllAsync` | `MantenimientoLuxuryApp/FireExtinguisherInventory/EndPoints/InventarioExtintorEndpoints.cs` |
| GET | `/api/inventario-extintor/get-all-group/{customerId:guid}` | `appService.GetAllGroupAsync` | `MantenimientoLuxuryApp/FireExtinguisherInventory/EndPoints/InventarioExtintorEndpoints.cs` |
| GET | `/api/inventario-extintor/{id:guid}` | `appService.GetByIdAsync` | `MantenimientoLuxuryApp/FireExtinguisherInventory/EndPoints/InventarioExtintorEndpoints.cs` |
| POST | `/api/inventario-extintor` | `appService.AddAsync` | `MantenimientoLuxuryApp/FireExtinguisherInventory/EndPoints/InventarioExtintorEndpoints.cs` |
| PUT | `/api/inventario-extintor/{id:guid}` | `appService.UpdateAsync` | `MantenimientoLuxuryApp/FireExtinguisherInventory/EndPoints/InventarioExtintorEndpoints.cs` |
| DELETE | `/api/inventario-extintor/{id:guid}` | `appService.DeleteByIdAsync` | `MantenimientoLuxuryApp/FireExtinguisherInventory/EndPoints/InventarioExtintorEndpoints.cs` |

#### Modulo: FireExtinguisherLog

- Interfaces: 1 | Servicios: 1 | Endpoints: 4 | DTOs: 2

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IBitacoraExtintorAppService | 4 | `MantenimientoLuxuryApp/FireExtinguisherLog/Interfaces/IBitacoraExtintorAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| BitacoraExtintorAppService | 4 | `MantenimientoLuxuryApp/FireExtinguisherLog/Services/BitacoraExtintorAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetAllAsync | IBitacoraExtintorAppService | GET_LIST | `Task<ApiResponseDTO<BitacoraExtintorDTO[]>>` | `Guid extinguisherId` |
| GetByIdAsync | IBitacoraExtintorAppService | GET_SINGLE | `Task<ApiResponseDTO<BitacoraExtintorAddOrEd…` | `Guid id` |
| AddAsync | IBitacoraExtintorAppService | CREATE | `Task<ApiResponseDTO<BitacoraExtintor>>` | `BitacoraExtintorAddOrEditDTO dto` |
| DeleteByIdAsync | IBitacoraExtintorAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/bitacora-extintor/list/{extinguisherId:guid}` | `appService.GetAllAsync` | `MantenimientoLuxuryApp/FireExtinguisherLog/EndPoints/BitacoraExtintorEndPoints.cs` |
| GET | `/api/bitacora-extintor/{id:guid}` | `appService.GetByIdAsync` | `MantenimientoLuxuryApp/FireExtinguisherLog/EndPoints/BitacoraExtintorEndPoints.cs` |
| POST | `/api/bitacora-extintor` | `appService.AddAsync` | `MantenimientoLuxuryApp/FireExtinguisherLog/EndPoints/BitacoraExtintorEndPoints.cs` |
| DELETE | `/api/bitacora-extintor/{id:guid}` | `appService.DeleteByIdAsync` | `MantenimientoLuxuryApp/FireExtinguisherLog/EndPoints/BitacoraExtintorEndPoints.cs` |

#### Modulo: FireInspectionPeriods

- Interfaces: 4 | Servicios: 4 | Endpoints: 29 | DTOs: 9

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IFireCycleInspectionAppService | 8 | `MantenimientoLuxuryApp/FireInspectionPeriods/Interfaces/IFireCycleInspectionAppService.cs` |
| IFireInspectionCycleAppService | 4 | `MantenimientoLuxuryApp/FireInspectionPeriods/Interfaces/IFireInspectionCycleAppService.cs` |
| IFireInspectionPeriodAppService | 5 | `MantenimientoLuxuryApp/FireInspectionPeriods/Interfaces/IFireInspectionPeriodAppService.cs` |
| IFireInspectionPeriodItemsAppService | 12 | `MantenimientoLuxuryApp/FireInspectionPeriods/Interfaces/IFireInspectionPeriodItemsAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| FireCycleInspectionAppService | 8 | `MantenimientoLuxuryApp/FireInspectionPeriods/Services/FireCycleInspectionAppService.cs` |
| FireInspectionCycleAppService | 4 | `MantenimientoLuxuryApp/FireInspectionPeriods/Services/FireInspectionCycleAppService.cs` |
| FireInspectionPeriodAppService | 5 | `MantenimientoLuxuryApp/FireInspectionPeriods/Services/FireInspectionPeriodAppService.cs` |
| FireInspectionPeriodItemsAppService | 12 | `MantenimientoLuxuryApp/FireInspectionPeriods/Services/FireInspectionPeriodItemsAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| UpsertExtintorAsync | IFireCycleInspectionAppService | UPDATE | `Task<ApiResponseDTO<bool>>` | `FireCycleInspectionExtintorAddOrEditDTO dto` |
| UpsertHidranteAsync | IFireCycleInspectionAppService | UPDATE | `Task<ApiResponseDTO<bool>>` | `FireCycleInspectionHidranteAddOrEditDTO dto` |
| UpsertEstacionAsync | IFireCycleInspectionAppService | UPDATE | `Task<ApiResponseDTO<bool>>` | `FireCycleInspectionEstacionAddOrEditDTO dto` |
| UpsertDetectorAsync | IFireCycleInspectionAppService | UPDATE | `Task<ApiResponseDTO<bool>>` | `FireCycleInspectionDetectorAddOrEditDTO dto` |
| GetExtintorAsync | IFireCycleInspectionAppService | GET_LIST | `Task<ApiResponseDTO<FireCycleInspectionExti…` | `Guid cycleId, Guid extinguisherId` |
| GetHidranteAsync | IFireCycleInspectionAppService | GET_LIST | `Task<ApiResponseDTO<FireCycleInspectionHidr…` | `Guid cycleId, Guid hydrantId` |
| GetEstacionAsync | IFireCycleInspectionAppService | GET_LIST | `Task<ApiResponseDTO<FireCycleInspectionEsta…` | `Guid cycleId, Guid stationId` |
| GetDetectorAsync | IFireCycleInspectionAppService | GET_LIST | `Task<ApiResponseDTO<FireCycleInspectionDete…` | `Guid cycleId, Guid detectorId` |
| GetAllAsync | IFireInspectionCycleAppService | GET_LIST | `Task<ApiResponseDTO<FireInspectionCycleDTO[…` | `Guid customerId` |
| GetDetailAsync | IFireInspectionCycleAppService | GET_LIST | `Task<ApiResponseDTO<FireInspectionCycleDeta…` | `Guid id` |
| GetActiveByPeriodAsync | IFireInspectionCycleAppService | GET_LIST | `Task<ApiResponseDTO<FireInspectionCycleDeta…` | `Guid periodId` |
| GenerateCycleForPeriodAsync | IFireInspectionCycleAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid periodId` |
| GetAllAsync | IFireInspectionPeriodAppService | GET_LIST | `Task<ApiResponseDTO<FireInspectionPeriodDTO…` | `Guid customerId` |
| GetByIdAsync | IFireInspectionPeriodAppService | GET_SINGLE | `Task<ApiResponseDTO<FireInspectionPeriodAdd…` | `Guid id` |
| AddAsync | IFireInspectionPeriodAppService | CREATE | `Task<ApiResponseDTO<FireInspectionPeriod>>` | `FireInspectionPeriodAddOrEditDTO dto` |
| UpdateAsync | IFireInspectionPeriodAppService | UPDATE | `Task<ApiResponseDTO<bool>>` | `Guid id, FireInspectionPeriodAddOrEditDTO dto` |
| DeleteByIdAsync | IFireInspectionPeriodAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetExtintoresAsync | IFireInspectionPeriodItemsAppService | GET_LIST | `Task<ApiResponseDTO<object[]>>` | `Guid periodId` |
| AddExtintorAsync | IFireInspectionPeriodItemsAppService | CREATE | `Task<ApiResponseDTO<bool>>` | `Guid periodId, Guid extinguisherId` |
| RemoveExtintorAsync | IFireInspectionPeriodItemsAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetHidrantesAsync | IFireInspectionPeriodItemsAppService | GET_LIST | `Task<ApiResponseDTO<object[]>>` | `Guid periodId` |
| AddHidranteAsync | IFireInspectionPeriodItemsAppService | CREATE | `Task<ApiResponseDTO<bool>>` | `Guid periodId, Guid hydrantId` |
| RemoveHidranteAsync | IFireInspectionPeriodItemsAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetEstacionesAsync | IFireInspectionPeriodItemsAppService | GET_LIST | `Task<ApiResponseDTO<object[]>>` | `Guid periodId` |
| AddEstacionAsync | IFireInspectionPeriodItemsAppService | CREATE | `Task<ApiResponseDTO<bool>>` | `Guid periodId, Guid stationId` |
| RemoveEstacionAsync | IFireInspectionPeriodItemsAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetDetectoresAsync | IFireInspectionPeriodItemsAppService | GET_LIST | `Task<ApiResponseDTO<object[]>>` | `Guid periodId` |
| AddDetectorAsync | IFireInspectionPeriodItemsAppService | CREATE | `Task<ApiResponseDTO<bool>>` | `Guid periodId, Guid detectorId` |
| RemoveDetectorAsync | IFireInspectionPeriodItemsAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/fire-cycle-inspection/extintor/{cycleId:guid}/{extinguisherId:guid}` | `appService.GetExtintorAsync` | `MantenimientoLuxuryApp/FireInspectionPeriods/EndPoints/FireCycleInspectionEndPoints.cs` |
| POST | `/api/fire-cycle-inspection/extintor` | `appService.UpsertExtintorAsync` | `MantenimientoLuxuryApp/FireInspectionPeriods/EndPoints/FireCycleInspectionEndPoints.cs` |
| GET | `/api/fire-cycle-inspection/hidrante/{cycleId:guid}/{hydrantId:guid}` | `appService.GetHidranteAsync` | `MantenimientoLuxuryApp/FireInspectionPeriods/EndPoints/FireCycleInspectionEndPoints.cs` |
| POST | `/api/fire-cycle-inspection/hidrante` | `appService.UpsertHidranteAsync` | `MantenimientoLuxuryApp/FireInspectionPeriods/EndPoints/FireCycleInspectionEndPoints.cs` |
| GET | `/api/fire-cycle-inspection/estacion/{cycleId:guid}/{stationId:guid}` | `appService.GetEstacionAsync` | `MantenimientoLuxuryApp/FireInspectionPeriods/EndPoints/FireCycleInspectionEndPoints.cs` |
| POST | `/api/fire-cycle-inspection/estacion` | `appService.UpsertEstacionAsync` | `MantenimientoLuxuryApp/FireInspectionPeriods/EndPoints/FireCycleInspectionEndPoints.cs` |
| GET | `/api/fire-cycle-inspection/detector/{cycleId:guid}/{detectorId:guid}` | `appService.GetDetectorAsync` | `MantenimientoLuxuryApp/FireInspectionPeriods/EndPoints/FireCycleInspectionEndPoints.cs` |
| POST | `/api/fire-cycle-inspection/detector` | `appService.UpsertDetectorAsync` | `MantenimientoLuxuryApp/FireInspectionPeriods/EndPoints/FireCycleInspectionEndPoints.cs` |
| GET | `/api/fire-inspection-cycle/list/{customerId:guid}` | `appService.GetAllAsync` | `MantenimientoLuxuryApp/FireInspectionPeriods/EndPoints/FireInspectionCycleEndPoints.cs` |
| GET | `/api/fire-inspection-cycle/{id:guid}` | `appService.GetDetailAsync` | `MantenimientoLuxuryApp/FireInspectionPeriods/EndPoints/FireInspectionCycleEndPoints.cs` |
| GET | `/api/fire-inspection-cycle/active/{periodId:guid}` | `appService.GetActiveByPeriodAsync` | `MantenimientoLuxuryApp/FireInspectionPeriods/EndPoints/FireInspectionCycleEndPoints.cs` |
| POST | `/api/fire-inspection-cycle/generate/{periodId:guid}` | `appService.GenerateCycleForPeriodAsync` | `MantenimientoLuxuryApp/FireInspectionPeriods/EndPoints/FireInspectionCycleEndPoints.cs` |
| GET | `/api/fire-inspection-period/list/{customerId:guid}` | `appService.GetAllAsync` | `MantenimientoLuxuryApp/FireInspectionPeriods/EndPoints/FireInspectionPeriodEndPoints.cs` |
| GET | `/api/fire-inspection-period/{id:guid}` | `appService.GetByIdAsync` | `MantenimientoLuxuryApp/FireInspectionPeriods/EndPoints/FireInspectionPeriodEndPoints.cs` |
| POST | `/api/fire-inspection-period` | `appService.AddAsync` | `MantenimientoLuxuryApp/FireInspectionPeriods/EndPoints/FireInspectionPeriodEndPoints.cs` |
| PUT | `/api/fire-inspection-period/{id:guid}` | `appService.UpdateAsync` | `MantenimientoLuxuryApp/FireInspectionPeriods/EndPoints/FireInspectionPeriodEndPoints.cs` |
| DELETE | `/api/fire-inspection-period/{id:guid}` | `appService.DeleteByIdAsync` | `MantenimientoLuxuryApp/FireInspectionPeriods/EndPoints/FireInspectionPeriodEndPoints.cs` |
| GET | `/api/fire-inspection-period-items/extintor/list/{periodId:guid}` | `appService.GetExtintoresAsync` | `MantenimientoLuxuryApp/FireInspectionPeriods/EndPoints/FireInspectionPeriodItemsEndPoints.cs` |
| POST | `/api/fire-inspection-period-items/extintor/{periodId:guid}/{extinguisherId:guid}` | `appService.AddExtintorAsync` | `MantenimientoLuxuryApp/FireInspectionPeriods/EndPoints/FireInspectionPeriodItemsEndPoints.cs` |
| DELETE | `/api/fire-inspection-period-items/extintor/{id:guid}` | `appService.RemoveExtintorAsync` | `MantenimientoLuxuryApp/FireInspectionPeriods/EndPoints/FireInspectionPeriodItemsEndPoints.cs` |
| GET | `/api/fire-inspection-period-items/hidrante/list/{periodId:guid}` | `appService.GetHidrantesAsync` | `MantenimientoLuxuryApp/FireInspectionPeriods/EndPoints/FireInspectionPeriodItemsEndPoints.cs` |
| POST | `/api/fire-inspection-period-items/hidrante/{periodId:guid}/{hydrantId:guid}` | `appService.AddHidranteAsync` | `MantenimientoLuxuryApp/FireInspectionPeriods/EndPoints/FireInspectionPeriodItemsEndPoints.cs` |
| DELETE | `/api/fire-inspection-period-items/hidrante/{id:guid}` | `appService.RemoveHidranteAsync` | `MantenimientoLuxuryApp/FireInspectionPeriods/EndPoints/FireInspectionPeriodItemsEndPoints.cs` |
| GET | `/api/fire-inspection-period-items/estacion/list/{periodId:guid}` | `appService.GetEstacionesAsync` | `MantenimientoLuxuryApp/FireInspectionPeriods/EndPoints/FireInspectionPeriodItemsEndPoints.cs` |
| POST | `/api/fire-inspection-period-items/estacion/{periodId:guid}/{stationId:guid}` | `appService.AddEstacionAsync` | `MantenimientoLuxuryApp/FireInspectionPeriods/EndPoints/FireInspectionPeriodItemsEndPoints.cs` |
| DELETE | `/api/fire-inspection-period-items/estacion/{id:guid}` | `appService.RemoveEstacionAsync` | `MantenimientoLuxuryApp/FireInspectionPeriods/EndPoints/FireInspectionPeriodItemsEndPoints.cs` |
| GET | `/api/fire-inspection-period-items/detector/list/{periodId:guid}` | `appService.GetDetectoresAsync` | `MantenimientoLuxuryApp/FireInspectionPeriods/EndPoints/FireInspectionPeriodItemsEndPoints.cs` |
| POST | `/api/fire-inspection-period-items/detector/{periodId:guid}/{detectorId:guid}` | `appService.AddDetectorAsync` | `MantenimientoLuxuryApp/FireInspectionPeriods/EndPoints/FireInspectionPeriodItemsEndPoints.cs` |
| DELETE | `/api/fire-inspection-period-items/detector/{id:guid}` | `appService.RemoveDetectorAsync` | `MantenimientoLuxuryApp/FireInspectionPeriods/EndPoints/FireInspectionPeriodItemsEndPoints.cs` |

#### Modulo: HydrantInventory

- Interfaces: 1 | Servicios: 2 | Endpoints: 5 | DTOs: 2

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IInventarioHidranteAppService | 5 | `MantenimientoLuxuryApp/HydrantInventory/Interfaces/IInventarioHidranteAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| InventarioHidranteMapper | 0 | `MantenimientoLuxuryApp/HydrantInventory/Mapping/InventarioHidranteMapper.cs` |
| InventarioHidranteAppService | 5 | `MantenimientoLuxuryApp/HydrantInventory/Services/InventarioHidranteAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetAllAsync | IInventarioHidranteAppService | GET_LIST | `Task<ApiResponseDTO<InventarioHidranteDTO[]…` | `Guid customerId` |
| GetByIdAsync | IInventarioHidranteAppService | GET_SINGLE | `Task<ApiResponseDTO<InventarioHidranteAddOr…` | `Guid id` |
| AddAsync | IInventarioHidranteAppService | CREATE | `Task<ApiResponseDTO<InventarioHidrante>>` | `InventarioHidranteAddOrEditDTO dto` |
| UpdateAsync | IInventarioHidranteAppService | UPDATE | `Task<ApiResponseDTO<InventarioHidrante>>` | `Guid id, InventarioHidranteAddOrEditDTO dto` |
| DeleteByIdAsync | IInventarioHidranteAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/inventario-hidrante/list/{customerId:guid}` | `appService.GetAllAsync` | `MantenimientoLuxuryApp/HydrantInventory/EndPoints/InventarioHidranteEndpoints.cs` |
| GET | `/api/inventario-hidrante/{id:guid}` | `appService.GetByIdAsync` | `MantenimientoLuxuryApp/HydrantInventory/EndPoints/InventarioHidranteEndpoints.cs` |
| POST | `/api/inventario-hidrante` | `appService.AddAsync` | `MantenimientoLuxuryApp/HydrantInventory/EndPoints/InventarioHidranteEndpoints.cs` |
| PUT | `/api/inventario-hidrante/{id:guid}` | `appService.UpdateAsync` | `MantenimientoLuxuryApp/HydrantInventory/EndPoints/InventarioHidranteEndpoints.cs` |
| DELETE | `/api/inventario-hidrante/{id:guid}` | `appService.DeleteByIdAsync` | `MantenimientoLuxuryApp/HydrantInventory/EndPoints/InventarioHidranteEndpoints.cs` |

#### Modulo: HydrantLog

- Interfaces: 1 | Servicios: 1 | Endpoints: 4 | DTOs: 2

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IBitacoraHidranteAppService | 4 | `MantenimientoLuxuryApp/HydrantLog/Interfaces/IBitacoraHidranteAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| BitacoraHidranteAppService | 4 | `MantenimientoLuxuryApp/HydrantLog/Services/BitacoraHidranteAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetAllAsync | IBitacoraHidranteAppService | GET_LIST | `Task<ApiResponseDTO<BitacoraHidranteDTO[]>>` | `Guid hydrantId` |
| GetByIdAsync | IBitacoraHidranteAppService | GET_SINGLE | `Task<ApiResponseDTO<BitacoraHidranteAddOrEd…` | `Guid id` |
| AddAsync | IBitacoraHidranteAppService | CREATE | `Task<ApiResponseDTO<BitacoraHidrante>>` | `BitacoraHidranteAddOrEditDTO dto` |
| DeleteByIdAsync | IBitacoraHidranteAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/bitacora-hidrante/list/{hydrantId:guid}` | `appService.GetAllAsync` | `MantenimientoLuxuryApp/HydrantLog/EndPoints/BitacoraHidranteEndPoints.cs` |
| GET | `/api/bitacora-hidrante/{id:guid}` | `appService.GetByIdAsync` | `MantenimientoLuxuryApp/HydrantLog/EndPoints/BitacoraHidranteEndPoints.cs` |
| POST | `/api/bitacora-hidrante` | `appService.AddAsync` | `MantenimientoLuxuryApp/HydrantLog/EndPoints/BitacoraHidranteEndPoints.cs` |
| DELETE | `/api/bitacora-hidrante/{id:guid}` | `appService.DeleteByIdAsync` | `MantenimientoLuxuryApp/HydrantLog/EndPoints/BitacoraHidranteEndPoints.cs` |

#### Modulo: Machinery

- Interfaces: 3 | Servicios: 6 | Endpoints: 23 | DTOs: 8

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IControlPrestamoHerramientaAppService | 5 | `MantenimientoLuxuryApp/Machinery/Interfaces/IControlPrestamoHerramientaAppService.cs` |
| IEquipoClasificacionAppService | 5 | `MantenimientoLuxuryApp/Machinery/Interfaces/IEquipoClasificacionAppService.cs` |
| IMachineryAppService | 18 | `MantenimientoLuxuryApp/Machinery/Interfaces/IMachineryAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| ControlPrestamoHerramientaMapper | 0 | `MantenimientoLuxuryApp/Machinery/Mapping/ControlPrestamoHerramientaMapper.cs` |
| EquipoClasificacionMapper | 0 | `MantenimientoLuxuryApp/Machinery/Mapping/EquipoClasificacionMapper.cs` |
| MachineryMapper | 0 | `MantenimientoLuxuryApp/Machinery/Mapping/MachineryMapper.cs` |
| ControlPrestamoHerramientaAppService | 5 | `MantenimientoLuxuryApp/Machinery/Services/ControlPrestamoHerramientaAppService.cs` |
| EquipoClasificacionAppService | 5 | `MantenimientoLuxuryApp/Machinery/Services/EquipoClasificacionAppService.cs` |
| MachineryAppService | 18 | `MantenimientoLuxuryApp/Machinery/Services/MachineryAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetAllIndexDTO | IControlPrestamoHerramientaAppService | GET_LIST | `Task<ApiResponseDTO<ControlPrestamoHerramie…` | `Guid customerId, PaginationCommonDTO pagination` |
| GetById | IControlPrestamoHerramientaAppService | GET_SINGLE | `Task<ApiResponseDTO<ControlPrestamoHerramie…` | `Guid id` |
| AddAsync | IControlPrestamoHerramientaAppService | CREATE | `Task<ApiResponseDTO<ToolLoan>>` | `ControlPrestamoHerramientaAddOrEditDTO DTO` |
| UpdateAsync | IControlPrestamoHerramientaAppService | UPDATE | `Task<ApiResponseDTO<ToolLoan>>` | `Guid id, ControlPrestamoHerramientaAddOrEditDTO DTO` |
| DeleteByIdAsync | IControlPrestamoHerramientaAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetByIdAsync | IEquipoClasificacionAppService | GET_SINGLE | `Task<ApiResponseDTO<EquipoClasificacionDTO>>` | `Guid id` |
| GetAllAsync | IEquipoClasificacionAppService | GET_LIST | `Task<ApiResponseDTO<EquipoClasificacionDTO[…` | `-` |
| AddAsync | IEquipoClasificacionAppService | CREATE | `Task<ApiResponseDTO<EquipoClasificacionDTO>>` | `EquipoClasificacionAddOrEditDTO DTO` |
| UpdateAsync | IEquipoClasificacionAppService | UPDATE | `Task<ApiResponseDTO<EquipoClasificacionDTO>>` | `Guid id, EquipoClasificacionAddOrEditDTO DTO` |
| DeleteByIdAsync | IEquipoClasificacionAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| ListEngineSystemsAsync | IMachineryAppService | GET_LIST | `Task<ApiResponseDTO<object>>` | `Guid customerId` |
| InventarioCompletoAsync | IMachineryAppService | OTHER | `Task<ApiResponseDTO<object>>` | `Guid customerId` |
| GetById | IMachineryAppService | GET_SINGLE | `Task<ApiResponseDTO<MachineryDTO>>` | `Guid id` |
| GetFichaTecnica | IMachineryAppService | GET_LIST | `Task<ApiResponseDTO<MachineryFichaTecnicaDT…` | `Guid id` |
| GetAllCardAsync | IMachineryAppService | GET_LIST | `Task<ApiResponseDTO<object>>` | `Guid customerId, State status, InventoryCategory inventoryC…` |
| GetAllAsync | IMachineryAppService | GET_LIST | `Task<ApiResponseDTO<object>>` | `Guid customerId, State status, InventoryCategory inventoryC…` |
| AddAsync | IMachineryAppService | CREATE | `Task<ApiResponseDTO<Equipment>>` | `MachineryAddOrEditDTO DTO` |
| GetMachinerySelectItemAsync | IMachineryAppService | GET_LIST | `Task<ApiResponseDTO<SelectItemDTO<Guid>>>` | `Guid id` |
| UpdateAsync | IMachineryAppService | UPDATE | `Task<ApiResponseDTO<Equipment>>` | `Guid id, MachineryAddOrEditDTO DTO` |
| DeleteAsync | IMachineryAppService | DELETE | `Task<ApiResponseDTO<Equipment>>` | `Guid id` |
| UpdateCategoryAsync | IMachineryAppService | UPDATE | `Task<ApiResponseDTO<object>>` | `-` |
| SubirDocumentoAsync | IMachineryAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid machineryId, IFormFile[] files` |
| DeleteDocumentAsync | IMachineryAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetAutocompeteInvAsync | IMachineryAppService | GET_LIST | `Task<ApiResponseDTO<object>>` | `Guid customerId` |
| GetAllMachineryDetailAsync | IMachineryAppService | GET_LIST | `Task<ApiResponseDTO<MachineryDetailDTO[]>>` | `Guid customerId, State status, InventoryCategory inventoryC…` |
| ActasEntregaAsync | IMachineryAppService | OTHER | `Task<ApiResponseDTO<object>>` | `Guid customerId` |
| InformePdfAsync | IMachineryAppService | OTHER | `Task<ApiResponseDTO<object>>` | `Guid customerId, State status, InventoryCategory inventoryC…` |
| GetListServiceHistory | IMachineryAppService | GET_LIST | `Task<ApiResponseDTO<List<ListServiceHistory…` | `Guid machineryId` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/equipo-clasificacion/{id:guid}` | `appService.GetByIdAsync` | `MantenimientoLuxuryApp/Machinery/EndPoints/EquipoClasificacionEndPoints.cs` |
| GET | `/api/equipo-clasificacion` | `appService.GetAllAsync` | `MantenimientoLuxuryApp/Machinery/EndPoints/EquipoClasificacionEndPoints.cs` |
| POST | `/api/equipo-clasificacion` | `appService.AddAsync` | `MantenimientoLuxuryApp/Machinery/EndPoints/EquipoClasificacionEndPoints.cs` |
| PUT | `/api/equipo-clasificacion/{id:guid}` | `appService.UpdateAsync` | `MantenimientoLuxuryApp/Machinery/EndPoints/EquipoClasificacionEndPoints.cs` |
| DELETE | `/api/equipo-clasificacion/{id:guid}` | `appService.DeleteByIdAsync` | `MantenimientoLuxuryApp/Machinery/EndPoints/EquipoClasificacionEndPoints.cs` |
| GET | `/api/machineries/list-engine-systems/{customerId:guid}` | `appService.ListEngineSystemsAsync` | `MantenimientoLuxuryApp/Machinery/EndPoints/MachineriesEndpoints.cs` |
| GET | `/api/machineries/inventario-completo/{customerId:guid}` | `appService.InventarioCompletoAsync` | `MantenimientoLuxuryApp/Machinery/EndPoints/MachineriesEndpoints.cs` |
| GET | `/api/machineries/{id:guid}` | - | `MantenimientoLuxuryApp/Machinery/EndPoints/MachineriesEndpoints.cs` |
| GET | `/api/machineries/fichatecnica/{id:guid}` | `appService.GetAllCardAsync` | `MantenimientoLuxuryApp/Machinery/EndPoints/MachineriesEndpoints.cs` |
| GET | `/api/machineries/get-all-card/{customerId:guid}` | `appService.GetAllCardAsync` | `MantenimientoLuxuryApp/Machinery/EndPoints/MachineriesEndpoints.cs` |
| GET | `/api/machineries/get-all/{customerId:guid}` | `appService.GetAllAsync` | `MantenimientoLuxuryApp/Machinery/EndPoints/MachineriesEndpoints.cs` |
| GET | `/api/machineries/get-all-detail/{customerId:guid}` | `appService.GetAllMachineryDetailAsync` | `MantenimientoLuxuryApp/Machinery/EndPoints/MachineriesEndpoints.cs` |
| POST | `/api/machineries` | `appService.AddAsync` | `MantenimientoLuxuryApp/Machinery/EndPoints/MachineriesEndpoints.cs` |
| GET | `/api/machineries/get-machinery-select-item/{id:guid}` | `appService.GetMachinerySelectItemAsync` | `MantenimientoLuxuryApp/Machinery/EndPoints/MachineriesEndpoints.cs` |
| PUT | `/api/machineries/{id:guid}` | `appService.UpdateAsync` | `MantenimientoLuxuryApp/Machinery/EndPoints/MachineriesEndpoints.cs` |
| DELETE | `/api/machineries/{id:guid}` | `appService.DeleteAsync` | `MantenimientoLuxuryApp/Machinery/EndPoints/MachineriesEndpoints.cs` |
| PUT | `/api/machineries/update-category` | `appService.UpdateCategoryAsync` | `MantenimientoLuxuryApp/Machinery/EndPoints/MachineriesEndpoints.cs` |
| POST | `/api/machineries/subir-documento/{machineryId:guid}` | `appService.SubirDocumentoAsync` | `MantenimientoLuxuryApp/Machinery/EndPoints/MachineriesEndpoints.cs` |
| DELETE | `/api/machineries/delete-document/{id:guid}` | `appService.DeleteDocumentAsync` | `MantenimientoLuxuryApp/Machinery/EndPoints/MachineriesEndpoints.cs` |
| GET | `/api/machineries/get-autocompete-inv/{customerId:guid}` | `appService.GetAutocompeteInvAsync` | `MantenimientoLuxuryApp/Machinery/EndPoints/MachineriesEndpoints.cs` |
| GET | `/api/machineries/actas-entrega/{customerId:guid}` | `appService.ActasEntregaAsync` | `MantenimientoLuxuryApp/Machinery/EndPoints/MachineriesEndpoints.cs` |
| GET | `/api/machineries/informe-pdf/{customerId:guid}` | `appService.InformePdfAsync` | `MantenimientoLuxuryApp/Machinery/EndPoints/MachineriesEndpoints.cs` |
| GET | `/api/machineries/service-history/{machineryId:guid}` | - | `MantenimientoLuxuryApp/Machinery/EndPoints/MachineriesEndpoints.cs` |

#### Modulo: MachineryAsset

- Interfaces: 1 | Servicios: 1 | Endpoints: 1 | DTOs: 2

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IMachineryAssetAppService | 1 | `MantenimientoLuxuryApp/MachineryAsset/Interfaces/IMachineryAssetAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| MachineryAssetAppService | 1 | `MantenimientoLuxuryApp/MachineryAsset/Services/MachineryAssetAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| ListAsync | IMachineryAssetAppService | GET_LIST | `Task<ApiResponseDTO<List<object>>>` | `Guid customerId` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/machinery-asset/list/{customerId:guid}` | `appService.ListAsync` | `MantenimientoLuxuryApp/MachineryAsset/EndPoints/MachineryAssetEndPoints.cs` |

#### Modulo: MachineryDocument

- Interfaces: 1 | Servicios: 1 | Endpoints: 1 | DTOs: 1

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IMachineryDocumentAppService | 1 | `MantenimientoLuxuryApp/MachineryDocument/Interfaces/IMachineryDocumentAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| MachineryDocumentAppService | 1 | `MantenimientoLuxuryApp/MachineryDocument/Services/MachineryDocumentAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetAllAsync | IMachineryDocumentAppService | GET_LIST | `Task<ApiResponseDTO<MachineryDocumentDTO[]>>` | `Guid machineryId` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/machinery-document/list/{machineryId:guid}` | `appService.GetAllAsync` | `MantenimientoLuxuryApp/MachineryDocument/EndPoints/MachineryDocumentEndPoints.cs` |

#### Modulo: MaintenanceCalendars

- Interfaces: 1 | Servicios: 2 | Endpoints: 15 | DTOs: 9

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IMaintenanceCalendarAppService | 14 | `MantenimientoLuxuryApp/MaintenanceCalendars/Interfaces/IMaintenanceCalendarAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| MaintenanceCalendarMapper | 0 | `MantenimientoLuxuryApp/MaintenanceCalendars/Mapping/MaintenanceCalendarMapper.cs` |
| MaintenanceCalendarAppService | 14 | `MantenimientoLuxuryApp/MaintenanceCalendars/Services/MaintenanceCalendarAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetByIdAsync | IMaintenanceCalendarAppService | GET_SINGLE | `Task<ApiResponseDTO<MaintenanceCalendarDTO>>` | `Guid id` |
| GetOfMachineryAsync | IMaintenanceCalendarAppService | GET_LIST | `Task<ApiResponseDTO<MaintenanceCalendarDTO[…` | `Guid machineryId` |
| GetAllAsync | IMaintenanceCalendarAppService | GET_LIST | `Task<ApiResponseDTO<List<object>>>` | `Guid customerId, Month month` |
| ListServiceAsync | IMaintenanceCalendarAppService | GET_LIST | `Task<ApiResponseDTO<List<MaintenanceCalenda…` | `Guid machineryId` |
| AddAsync | IMaintenanceCalendarAppService | CREATE | `Task<ApiResponseDTO<MaintenanceCalendar>>` | `MaintenanceCalendarAddOrEditDTO DTO` |
| UpdateAsync | IMaintenanceCalendarAppService | UPDATE | `Task<ApiResponseDTO<MaintenanceCalendar>>` | `Guid id, MaintenanceCalendarAddOrEditDTO DTO` |
| DeleteByIdAsync | IMaintenanceCalendarAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GeneralMantenimientoAsync | IMaintenanceCalendarAppService | OTHER | `Task<ApiResponseDTO<List<object>>>` | `Guid customerId, Guid? providerId` |
| ProveedoresCalendarioAsync | IMaintenanceCalendarAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<Guid…` | `Guid customerId` |
| CronogramaAnualAsync | IMaintenanceCalendarAppService | OTHER | `Task<ApiResponseDTO<List<CalendarioMantenim…` | `Guid customerId, int? filtro` |
| GetCronogramaAnualPdfStatusAsync | IMaintenanceCalendarAppService | GET_LIST | `Task<ApiResponseDTO<List<CronogramaAnualPdf…` | `Guid customerId, int? filtro, int? year` |
| ExportCalendarAsync | IMaintenanceCalendarAppService | SPECIAL | `Task<ApiResponseDTO<List<object>>>` | `Guid customerId` |
| GetResumenGastosAsync | IMaintenanceCalendarAppService | GET_LIST | `Task<ApiResponseDTO<ResumenGastosDTO>>` | `Guid customerId` |
| GetResumenAsync | IMaintenanceCalendarAppService | GET_LIST | `Task<ApiResponseDTO<object>>` | `Guid customerId` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/maintenance-calendars/get/{id:guid}` | `appService.GetByIdAsync` | `MantenimientoLuxuryApp/MaintenanceCalendars/EndPoints/MaintenanceCalendarsEndpoints.cs` |
| GET | `/api/maintenance-calendars/list-service/{machineryId:guid}` | `appService.ListServiceAsync` | `MantenimientoLuxuryApp/MaintenanceCalendars/EndPoints/MaintenanceCalendarsEndpoints.cs` |
| GET | `/api/maintenance-calendars/of-machinery/{machineryId:guid}` | `appService.GetOfMachineryAsync` | `MantenimientoLuxuryApp/MaintenanceCalendars/EndPoints/MaintenanceCalendarsEndpoints.cs` |
| GET | `/api/maintenance-calendars/list/{customerId:guid}/{month:int}` | `appService.GetAllAsync` | `MantenimientoLuxuryApp/MaintenanceCalendars/EndPoints/MaintenanceCalendarsEndpoints.cs` |
| POST | `/api/maintenance-calendars` | `appService.AddAsync` | `MantenimientoLuxuryApp/MaintenanceCalendars/EndPoints/MaintenanceCalendarsEndpoints.cs` |
| PUT | `/api/maintenance-calendars/{id:guid}` | `appService.UpdateAsync` | `MantenimientoLuxuryApp/MaintenanceCalendars/EndPoints/MaintenanceCalendarsEndpoints.cs` |
| DELETE | `/api/maintenance-calendars/{id:guid}` | `appService.DeleteByIdAsync` | `MantenimientoLuxuryApp/MaintenanceCalendars/EndPoints/MaintenanceCalendarsEndpoints.cs` |
| GET | `/api/maintenance-calendars/general-mantenimiento/{customerId:guid}/{providerId:guid}` | `appService.GeneralMantenimientoAsync` | `MantenimientoLuxuryApp/MaintenanceCalendars/EndPoints/MaintenanceCalendarsEndpoints.cs` |
| GET | `/api/maintenance-calendars/proveedores-calendario/{customerId:guid}` | `appService.ProveedoresCalendarioAsync` | `MantenimientoLuxuryApp/MaintenanceCalendars/EndPoints/MaintenanceCalendarsEndpoints.cs` |
| GET | `/api/maintenance-calendars/cronograma-anual/{customerId:guid}` | `appService.CronogramaAnualAsync` | `MantenimientoLuxuryApp/MaintenanceCalendars/EndPoints/MaintenanceCalendarsEndpoints.cs` |
| GET | `/api/maintenance-calendars/cronograma-anual/{customerId:guid}/{filterId:int}` | `appService.CronogramaAnualAsync` | `MantenimientoLuxuryApp/MaintenanceCalendars/EndPoints/MaintenanceCalendarsEndpoints.cs` |
| GET | `/api/maintenance-calendars/cronograma-anual-pdf-status/{customerId:guid}` | `appService.GetCronogramaAnualPdfStatusAsync` | `MantenimientoLuxuryApp/MaintenanceCalendars/EndPoints/MaintenanceCalendarsEndpoints.cs` |
| GET | `/api/maintenance-calendars/export-calendar/{customerId:guid}` | `appService.ExportCalendarAsync` | `MantenimientoLuxuryApp/MaintenanceCalendars/EndPoints/MaintenanceCalendarsEndpoints.cs` |
| GET | `/api/maintenance-calendars/resumen-gastos/{customerId:guid}` | `appService.GetResumenGastosAsync` | `MantenimientoLuxuryApp/MaintenanceCalendars/EndPoints/MaintenanceCalendarsEndpoints.cs` |
| GET | `/api/maintenance-calendars/resumen/{customerId:guid}` | `appService.GetResumenAsync` | `MantenimientoLuxuryApp/MaintenanceCalendars/EndPoints/MaintenanceCalendarsEndpoints.cs` |

#### Modulo: MaintenanceLogs

- Interfaces: 1 | Servicios: 2 | Endpoints: 3 | DTOs: 3

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IBitacoraMantenimientoAppService | 6 | `MantenimientoLuxuryApp/MaintenanceLogs/Interfaces/IBitacoraMantenimientoAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| BitacoraMantenimientoMapper | 0 | `MantenimientoLuxuryApp/MaintenanceLogs/Mapping/BitacoraMantenimientoMapper.cs` |
| BitacoraMantenimientoAppService | 6 | `MantenimientoLuxuryApp/MaintenanceLogs/Services/BitacoraMantenimientoAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| FindByIdAsync | IBitacoraMantenimientoAppService | GET_SINGLE | `Task<ApiResponseDTO<BitacoraMantenimientoDT…` | `int id` |
| GetAllBitacoraMantenimientoDTO | IBitacoraMantenimientoAppService | GET_LIST | `Task<ApiResponseDTO<List<BitacoraMantenimie…` | `Guid customerId, DateTime fechaInicial, DateTime fechaFinal` |
| BitacoraIndividualAsync | IBitacoraMantenimientoAppService | OTHER | `Task<ApiResponseDTO<List<BitacoraMantenimie…` | `Guid machineryId, DateTime fechaInicial, DateTime fechaFinal` |
| BitacoraDashboardAsync | IBitacoraMantenimientoAppService | OTHER | `Task<ApiResponseDTO<List<BitacoraMantenimie…` | `Guid customerId, DateTime fechaInicial, DateTime fechaFinal` |
| AddAsync | IBitacoraMantenimientoAppService | CREATE | `Task<ApiResponseDTO<MaintenanceLog>>` | `BitacoraMantenimientoAddOrEditDTO DTO` |
| DeleteByIdAsync | IBitacoraMantenimientoAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/bitacora-mantenimiento/{id:guid}` | `dataService.FindByIdAsync` | `MantenimientoLuxuryApp/MaintenanceLogs/EndPoints/BitacoraMantenimientoEndpoints.cs` |
| POST | `/api/bitacora-mantenimiento` | `dataService.AddAsync` | `MantenimientoLuxuryApp/MaintenanceLogs/EndPoints/BitacoraMantenimientoEndpoints.cs` |
| DELETE | `/api/bitacora-mantenimiento/{id:guid}` | `dataService.DeleteByIdAsync` | `MantenimientoLuxuryApp/MaintenanceLogs/EndPoints/BitacoraMantenimientoEndpoints.cs` |

#### Modulo: ManualCallPointInventory

- Interfaces: 1 | Servicios: 2 | Endpoints: 7 | DTOs: 2

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IInventarioEstacionManualAppService | 7 | `MantenimientoLuxuryApp/ManualCallPointInventory/Interfaces/IInventarioEstacionManualAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| InventarioEstacionManualMapper | 0 | `MantenimientoLuxuryApp/ManualCallPointInventory/Mapping/InventarioEstacionManualMapper.cs` |
| InventarioEstacionManualAppService | 7 | `MantenimientoLuxuryApp/ManualCallPointInventory/Services/InventarioEstacionManualAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetAllAsync | IInventarioEstacionManualAppService | GET_LIST | `Task<ApiResponseDTO<InventarioEstacionManua…` | `Guid customerId` |
| GetByIdAsync | IInventarioEstacionManualAppService | GET_SINGLE | `Task<ApiResponseDTO<InventarioEstacionManua…` | `Guid id` |
| AddAsync | IInventarioEstacionManualAppService | CREATE | `Task<ApiResponseDTO<InventarioEstacionManua…` | `InventarioEstacionManualAddOrEditDTO dto` |
| UpdateAsync | IInventarioEstacionManualAppService | UPDATE | `Task<ApiResponseDTO<InventarioEstacionManua…` | `Guid id, InventarioEstacionManualAddOrEditDTO dto` |
| DeleteByIdAsync | IInventarioEstacionManualAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| DeleteAllByCustomerAsync | IInventarioEstacionManualAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid customerId` |
| ImportFromExcelAsync | IInventarioEstacionManualAppService | SPECIAL | `Task<ImportPropertiesResultDTO>` | `Guid customerId, IFormFile file` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/inventario-estacion-manual/list/{customerId:guid}` | `appService.GetAllAsync` | `MantenimientoLuxuryApp/ManualCallPointInventory/EndPoints/InventarioEstacionManualEndpoints.cs` |
| GET | `/api/inventario-estacion-manual/{id:guid}` | `appService.GetByIdAsync` | `MantenimientoLuxuryApp/ManualCallPointInventory/EndPoints/InventarioEstacionManualEndpoints.cs` |
| POST | `/api/inventario-estacion-manual` | `appService.AddAsync` | `MantenimientoLuxuryApp/ManualCallPointInventory/EndPoints/InventarioEstacionManualEndpoints.cs` |
| PUT | `/api/inventario-estacion-manual/{id:guid}` | `appService.UpdateAsync` | `MantenimientoLuxuryApp/ManualCallPointInventory/EndPoints/InventarioEstacionManualEndpoints.cs` |
| DELETE | `/api/inventario-estacion-manual/{id:guid}` | `appService.DeleteByIdAsync` | `MantenimientoLuxuryApp/ManualCallPointInventory/EndPoints/InventarioEstacionManualEndpoints.cs` |
| DELETE | `/api/inventario-estacion-manual/all/{customerId:guid}` | `appService.DeleteAllByCustomerAsync` | `MantenimientoLuxuryApp/ManualCallPointInventory/EndPoints/InventarioEstacionManualEndpoints.cs` |
| POST | `/api/inventario-estacion-manual/import/{customerId:guid}` | `appService.ImportFromExcelAsync` | `MantenimientoLuxuryApp/ManualCallPointInventory/EndPoints/InventarioEstacionManualEndpoints.cs` |

#### Modulo: ManualCallPointLog

- Interfaces: 1 | Servicios: 1 | Endpoints: 4 | DTOs: 2

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IBitacoraEstacionManualAppService | 4 | `MantenimientoLuxuryApp/ManualCallPointLog/Interfaces/IBitacoraEstacionManualAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| BitacoraEstacionManualAppService | 4 | `MantenimientoLuxuryApp/ManualCallPointLog/Services/BitacoraEstacionManualAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetAllAsync | IBitacoraEstacionManualAppService | GET_LIST | `Task<ApiResponseDTO<BitacoraEstacionManualD…` | `Guid stationId` |
| GetByIdAsync | IBitacoraEstacionManualAppService | GET_SINGLE | `Task<ApiResponseDTO<BitacoraEstacionManualA…` | `Guid id` |
| AddAsync | IBitacoraEstacionManualAppService | CREATE | `Task<ApiResponseDTO<BitacoraEstacionManual>>` | `BitacoraEstacionManualAddOrEditDTO dto` |
| DeleteByIdAsync | IBitacoraEstacionManualAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/bitacora-estacion-manual/list/{stationId:guid}` | `appService.GetAllAsync` | `MantenimientoLuxuryApp/ManualCallPointLog/EndPoints/BitacoraEstacionManualEndPoints.cs` |
| GET | `/api/bitacora-estacion-manual/{id:guid}` | `appService.GetByIdAsync` | `MantenimientoLuxuryApp/ManualCallPointLog/EndPoints/BitacoraEstacionManualEndPoints.cs` |
| POST | `/api/bitacora-estacion-manual` | `appService.AddAsync` | `MantenimientoLuxuryApp/ManualCallPointLog/EndPoints/BitacoraEstacionManualEndPoints.cs` |
| DELETE | `/api/bitacora-estacion-manual/{id:guid}` | `appService.DeleteByIdAsync` | `MantenimientoLuxuryApp/ManualCallPointLog/EndPoints/BitacoraEstacionManualEndPoints.cs` |

#### Modulo: Medidores

- Interfaces: 3 | Servicios: 5 | Endpoints: 22 | DTOs: 9

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IMedidorAppService | 6 | `MantenimientoLuxuryApp/Medidores/Interfaces/IMedidorAppService.cs` |
| IMedidorCategoriaAppService | 5 | `MantenimientoLuxuryApp/Medidores/Interfaces/IMedidorCategoriaAppService.cs` |
| IMedidorLecturaAppService | 10 | `MantenimientoLuxuryApp/Medidores/Interfaces/IMedidorLecturaAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| MedidorLecturaMapper | 0 | `MantenimientoLuxuryApp/Medidores/Mapping/MedidorLecturaMapper.cs` |
| MedidorMapper | 0 | `MantenimientoLuxuryApp/Medidores/Mapping/MedidorMapper.cs` |
| MedidorAppService | 6 | `MantenimientoLuxuryApp/Medidores/Services/MedidorAppService.cs` |
| MedidorCategoriaAppService | 5 | `MantenimientoLuxuryApp/Medidores/Services/MedidorCategoriaAppService.cs` |
| MedidorLecturaAppService | 10 | `MantenimientoLuxuryApp/Medidores/Services/MedidorLecturaAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetByIdAsync | IMedidorAppService | GET_SINGLE | `Task<ApiResponseDTO<MedidorDTO>>` | `Guid id` |
| GetAllAsync | IMedidorAppService | GET_LIST | `Task<ApiResponseDTO<MedidorDTO[]>>` | `Guid customerId` |
| GetAllInactiveAsync | IMedidorAppService | GET_LIST | `Task<ApiResponseDTO<MedidorDTO[]>>` | `Guid customerId` |
| AddAsync | IMedidorAppService | CREATE | `Task<ApiResponseDTO<Meter>>` | `MedidorAddOrEditDTO DTO` |
| UpdateAsync | IMedidorAppService | UPDATE | `Task<ApiResponseDTO<Meter>>` | `Guid id, MedidorAddOrEditDTO DTO` |
| DeleteByIdAsync | IMedidorAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetByIdAsync | IMedidorCategoriaAppService | GET_SINGLE | `Task<ApiResponseDTO<MedidorCategoriaDTO>>` | `Guid id` |
| GetAllAsync | IMedidorCategoriaAppService | GET_LIST | `Task<ApiResponseDTO<MedidorCategoriaDTO[]>>` | `-` |
| AddAsync | IMedidorCategoriaAppService | CREATE | `Task<ApiResponseDTO<MedidorCategoria>>` | `MedidorCategoriaAddOrEditDTO DTO` |
| UpdateAsync | IMedidorCategoriaAppService | UPDATE | `Task<ApiResponseDTO<MedidorCategoria>>` | `Guid id, MedidorCategoriaAddOrEditDTO DTO` |
| DeleteByIdAsync | IMedidorCategoriaAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetByIdAsync | IMedidorLecturaAppService | GET_SINGLE | `Task<ApiResponseDTO<MedidorLecturaDTO>>` | `Guid id` |
| GetUltimaLecturaAsync | IMedidorLecturaAppService | GET_LIST | `Task<ApiResponseDTO<MedidorLecturaDTO>>` | `Guid medidorId` |
| GetAll | IMedidorLecturaAppService | GET_LIST | `ApiResponseDTO<MedidorLecturaDTO[]>` | `Guid medidorId` |
| ExportExcel | IMedidorLecturaAppService | SPECIAL | `ApiResponseDTO<IEnumerable<MedidorLecturaEx…` | `Guid medidorId` |
| DataGraficoDiariaAsync | IMedidorLecturaAppService | OTHER | `Task<ApiResponseDTO<DataSetChart>>` | `Guid medidorId, DateTime fechaInicial, DateTime fechaFinal` |
| DataGraficoMensualAsync | IMedidorLecturaAppService | OTHER | `Task<ApiResponseDTO<DataSetChart>>` | `Guid medidorId, DateTime fechaInicial, DateTime fechaFinal` |
| AddAsync | IMedidorLecturaAppService | CREATE | `Task<ApiResponseDTO<MeterReading>>` | `MedidorLecturaAddOrEditDTO DTO, bool setFechaRegistro = true` |
| VerificarRegistroDelDia | IMedidorLecturaAppService | OTHER | `ApiResponseDTO<bool>` | `Guid medidorId` |
| UpdateAsync | IMedidorLecturaAppService | UPDATE | `Task<ApiResponseDTO<MeterReading>>` | `Guid id, MedidorLecturaAddOrEditDTO DTO` |
| DeleteByIdAsync | IMedidorLecturaAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/medidor-categoria/{id:guid}` | `appService.GetByIdAsync` | `MantenimientoLuxuryApp/Medidores/EndPoints/MedidorCategoriaEndPoints.cs` |
| GET | `/api/medidor-categoria` | `appService.GetAllAsync` | `MantenimientoLuxuryApp/Medidores/EndPoints/MedidorCategoriaEndPoints.cs` |
| POST | `/api/medidor-categoria` | `appService.AddAsync` | `MantenimientoLuxuryApp/Medidores/EndPoints/MedidorCategoriaEndPoints.cs` |
| PUT | `/api/medidor-categoria/{id:guid}` | `appService.UpdateAsync` | `MantenimientoLuxuryApp/Medidores/EndPoints/MedidorCategoriaEndPoints.cs` |
| DELETE | `/api/medidor-categoria/{id:guid}` | `appService.DeleteByIdAsync` | `MantenimientoLuxuryApp/Medidores/EndPoints/MedidorCategoriaEndPoints.cs` |
| GET | `/api/medidor/{id:guid}` | `appService.GetByIdAsync` | `MantenimientoLuxuryApp/Medidores/EndPoints/MedidorEndpoints.cs` |
| GET | `/api/medidor/list/{customerId:guid}` | `appService.GetAllAsync` | `MantenimientoLuxuryApp/Medidores/EndPoints/MedidorEndpoints.cs` |
| GET | `/api/medidor/get-all-inactive/{customerId:guid}` | `appService.GetAllInactiveAsync` | `MantenimientoLuxuryApp/Medidores/EndPoints/MedidorEndpoints.cs` |
| POST | `/api/medidor` | `appService.AddAsync` | `MantenimientoLuxuryApp/Medidores/EndPoints/MedidorEndpoints.cs` |
| PUT | `/api/medidor/{id:guid}` | `appService.UpdateAsync` | `MantenimientoLuxuryApp/Medidores/EndPoints/MedidorEndpoints.cs` |
| DELETE | `/api/medidor/{id:guid}` | `appService.DeleteByIdAsync` | `MantenimientoLuxuryApp/Medidores/EndPoints/MedidorEndpoints.cs` |
| GET | `/api/medidorlectura/{id:guid}` | `appService.GetByIdAsync` | `MantenimientoLuxuryApp/Medidores/EndPoints/MedidorLecturaEndpoints.cs` |
| GET | `/api/medidorlectura/ultima-lectura/{medidorId:guid}` | `appService.GetUltimaLecturaAsync` | `MantenimientoLuxuryApp/Medidores/EndPoints/MedidorLecturaEndpoints.cs` |
| GET | `/api/medidorlectura/list/{medidorId:guid}` | - | `MantenimientoLuxuryApp/Medidores/EndPoints/MedidorLecturaEndpoints.cs` |
| GET | `/api/medidorlectura/export-excel/{medidorId:guid}` | `appService.DataGraficoDiariaAsync` | `MantenimientoLuxuryApp/Medidores/EndPoints/MedidorLecturaEndpoints.cs` |
| GET | `/api/medidorlectura/data-grafico-diaria/{medidorId:guid}/{fechaInical:datetime}/{fechaFinal:datetime}` | `appService.DataGraficoDiariaAsync` | `MantenimientoLuxuryApp/Medidores/EndPoints/MedidorLecturaEndpoints.cs` |
| GET | `/api/medidorlectura/data-grafico-mensual/{medidorId:guid}/{fechaInical:datetime}/{fechaFinal:datetime}` | `appService.DataGraficoMensualAsync` | `MantenimientoLuxuryApp/Medidores/EndPoints/MedidorLecturaEndpoints.cs` |
| POST | `/api/medidorlectura` | `appService.AddAsync` | `MantenimientoLuxuryApp/Medidores/EndPoints/MedidorLecturaEndpoints.cs` |
| POST | `/api/medidorlectura/admin-create-lectura` | `appService.AddAsync` | `MantenimientoLuxuryApp/Medidores/EndPoints/MedidorLecturaEndpoints.cs` |
| GET | `/api/medidorlectura/verificar-registro-del-dia/{medidorId:guid}` | `appService.UpdateAsync` | `MantenimientoLuxuryApp/Medidores/EndPoints/MedidorLecturaEndpoints.cs` |
| PUT | `/api/medidorlectura/{id:guid}` | `appService.UpdateAsync` | `MantenimientoLuxuryApp/Medidores/EndPoints/MedidorLecturaEndpoints.cs` |
| DELETE | `/api/medidorlectura/{id:guid}` | `appService.DeleteByIdAsync` | `MantenimientoLuxuryApp/Medidores/EndPoints/MedidorLecturaEndpoints.cs` |

#### Modulo: Persistence

- Interfaces: 0 | Servicios: 0 | Endpoints: 0 | DTOs: 0

#### Modulo: Piscinas

- Interfaces: 1 | Servicios: 2 | Endpoints: 5 | DTOs: 2

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IPiscinaAppService | 5 | `MantenimientoLuxuryApp/Piscinas/Interfaces/IPiscinaAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| PiscinaMapper | 0 | `MantenimientoLuxuryApp/Piscinas/Mapping/PiscinaMapper.cs` |
| PiscinaAppService | 5 | `MantenimientoLuxuryApp/Piscinas/Services/PiscinaAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetByIdAsync | IPiscinaAppService | GET_SINGLE | `Task<ApiResponseDTO<PiscinaDTO>>` | `Guid id` |
| GetAllAsync | IPiscinaAppService | GET_LIST | `Task<ApiResponseDTO<PiscinaDTO[]>>` | `Guid customerId` |
| AddAsync | IPiscinaAppService | CREATE | `Task<ApiResponseDTO<PiscinaDTO>>` | `PiscinaAddOrEditDTO DTO` |
| UpdateAsync | IPiscinaAppService | UPDATE | `Task<ApiResponseDTO<PiscinaDTO>>` | `Guid id, PiscinaAddOrEditDTO DTO` |
| DeleteAsync | IPiscinaAppService | DELETE | `Task<ApiResponseDTO<PiscinaDTO>>` | `Guid id` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/piscina/list/{customerId:guid}` | `appService.GetAllAsync` | `MantenimientoLuxuryApp/Piscinas/EndPoints/PiscinaEndpoints.cs` |
| GET | `/api/piscina/{id:guid}` | `appService.GetByIdAsync` | `MantenimientoLuxuryApp/Piscinas/EndPoints/PiscinaEndpoints.cs` |
| POST | `/api/piscina` | `appService.AddAsync` | `MantenimientoLuxuryApp/Piscinas/EndPoints/PiscinaEndpoints.cs` |
| PUT | `/api/piscina/{id:guid}` | `appService.UpdateAsync` | `MantenimientoLuxuryApp/Piscinas/EndPoints/PiscinaEndpoints.cs` |
| DELETE | `/api/piscina/{id:guid}` | `appService.DeleteAsync` | `MantenimientoLuxuryApp/Piscinas/EndPoints/PiscinaEndpoints.cs` |

#### Modulo: PiscinasBitacora

- Interfaces: 1 | Servicios: 2 | Endpoints: 7 | DTOs: 5

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IPiscinaBitacoraAppService | 7 | `MantenimientoLuxuryApp/PiscinasBitacora/Interfaces/IPiscinaBitacoraAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| PiscinaBitacoraMapper | 0 | `MantenimientoLuxuryApp/PiscinasBitacora/Mapping/PiscinaBitacoraMapper.cs` |
| PiscinaBitacoraAppService | 7 | `MantenimientoLuxuryApp/PiscinasBitacora/Services/PiscinaBitacoraAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetByIdAsync | IPiscinaBitacoraAppService | GET_SINGLE | `Task<ApiResponseDTO<PiscinaBitacoraDTO>>` | `Guid id` |
| GetAllAsync | IPiscinaBitacoraAppService | GET_LIST | `Task<ApiResponseDTO<PiscinaBitacoraDTO[]>>` | `Guid piscinaId` |
| AddAsync | IPiscinaBitacoraAppService | CREATE | `Task<ApiResponseDTO<PiscinaBitacoraDTO>>` | `PiscinaBitacoraAddOrEditDTO DTO` |
| UpdateAsync | IPiscinaBitacoraAppService | UPDATE | `Task<ApiResponseDTO<PiscinaBitacoraDTO>>` | `Guid id, PiscinaBitacoraAddOrEditDTO DTO` |
| ExportExcelAsync | IPiscinaBitacoraAppService | SPECIAL | `Task<ApiResponseDTO<IEnumerable<PiscinaBita…` | `Guid piscinaId` |
| ImportExcelAsync | IPiscinaBitacoraAppService | SPECIAL | `Task<ApiResponseDTO<PiscinaBitacoraImportRe…` | `Guid piscinaId, string applicationUserId, List<PiscinaBitac…` |
| DeleteByIdAsync | IPiscinaBitacoraAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/piscina-bitacora/list/{piscinaId:guid}` | `appService.GetAllAsync` | `MantenimientoLuxuryApp/PiscinasBitacora/EndPoints/PiscinaBitacoraEndpoints.cs` |
| GET | `/api/piscina-bitacora/{id:guid}` | `appService.GetByIdAsync` | `MantenimientoLuxuryApp/PiscinasBitacora/EndPoints/PiscinaBitacoraEndpoints.cs` |
| POST | `/api/piscina-bitacora` | `appService.AddAsync` | `MantenimientoLuxuryApp/PiscinasBitacora/EndPoints/PiscinaBitacoraEndpoints.cs` |
| PUT | `/api/piscina-bitacora/{id:guid}` | `appService.UpdateAsync` | `MantenimientoLuxuryApp/PiscinasBitacora/EndPoints/PiscinaBitacoraEndpoints.cs` |
| DELETE | `/api/piscina-bitacora/{id:guid}` | `appService.DeleteByIdAsync` | `MantenimientoLuxuryApp/PiscinasBitacora/EndPoints/PiscinaBitacoraEndpoints.cs` |
| GET | `/api/piscina-bitacora/export-excel/{piscinaId:guid}` | `appService.ExportExcelAsync` | `MantenimientoLuxuryApp/PiscinasBitacora/EndPoints/PiscinaBitacoraEndpoints.cs` |
| POST | `/api/piscina-bitacora/import-excel/{piscinaId:guid}` | `appService.ImportExcelAsync` | `MantenimientoLuxuryApp/PiscinasBitacora/EndPoints/PiscinaBitacoraEndpoints.cs` |

#### Modulo: RecepcionPipasAgua

- Interfaces: 1 | Servicios: 1 | Endpoints: 5 | DTOs: 3

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IRecepcionPipasAguaAppService | 5 | `MantenimientoLuxuryApp/RecepcionPipasAgua/Interfaces/IRecepcionPipasAguaAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| RecepcionPipasAguaAppService | 5 | `MantenimientoLuxuryApp/RecepcionPipasAgua/Services/RecepcionPipasAguaAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetByIdAsync | IRecepcionPipasAguaAppService | GET_SINGLE | `Task<ApiResponseDTO<RecepcionPipaAguaDTO>>` | `Guid id` |
| GetAllAsync | IRecepcionPipasAguaAppService | GET_LIST | `Task<ApiResponseDTO<List<RecepcionPipaAguaD…` | `Guid customerId` |
| AddAsync | IRecepcionPipasAguaAppService | CREATE | `Task<ApiResponseDTO<WaterTruckDelivery>>` | `RecepcionPipaAguaAddDTO dto` |
| UpdateAsync | IRecepcionPipasAguaAppService | UPDATE | `Task<ApiResponseDTO<WaterTruckDelivery>>` | `Guid id, RecepcionPipaAguaUpdateDTO dto` |
| DeleteByIdAsync | IRecepcionPipasAguaAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/recepcion-pipas-agua/list/{customerId:guid}` | `appService.GetAllAsync` | `MantenimientoLuxuryApp/RecepcionPipasAgua/EndPoints/RecepcionPipasAguaEndpoints.cs` |
| GET | `/api/recepcion-pipas-agua/{id:guid}` | `appService.GetByIdAsync` | `MantenimientoLuxuryApp/RecepcionPipasAgua/EndPoints/RecepcionPipasAguaEndpoints.cs` |
| POST | `/api/recepcion-pipas-agua` | `appService.AddAsync` | `MantenimientoLuxuryApp/RecepcionPipasAgua/EndPoints/RecepcionPipasAguaEndpoints.cs` |
| PUT | `/api/recepcion-pipas-agua/{id:guid}` | `appService.UpdateAsync` | `MantenimientoLuxuryApp/RecepcionPipasAgua/EndPoints/RecepcionPipasAguaEndpoints.cs` |
| DELETE | `/api/recepcion-pipas-agua/{id:guid}` | `appService.DeleteByIdAsync` | `MantenimientoLuxuryApp/RecepcionPipasAgua/EndPoints/RecepcionPipasAguaEndpoints.cs` |

#### Modulo: SmokeDetectorInventory

- Interfaces: 1 | Servicios: 2 | Endpoints: 7 | DTOs: 2

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IInventarioDetectorHumoAppService | 7 | `MantenimientoLuxuryApp/SmokeDetectorInventory/Interfaces/IInventarioDetectorHumoAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| InventarioDetectorHumoMapper | 0 | `MantenimientoLuxuryApp/SmokeDetectorInventory/Mapping/InventarioDetectorHumoMapper.cs` |
| InventarioDetectorHumoAppService | 7 | `MantenimientoLuxuryApp/SmokeDetectorInventory/Services/InventarioDetectorHumoAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetAllAsync | IInventarioDetectorHumoAppService | GET_LIST | `Task<ApiResponseDTO<InventarioDetectorHumoD…` | `Guid customerId` |
| GetByIdAsync | IInventarioDetectorHumoAppService | GET_SINGLE | `Task<ApiResponseDTO<InventarioDetectorHumoA…` | `Guid id` |
| AddAsync | IInventarioDetectorHumoAppService | CREATE | `Task<ApiResponseDTO<InventarioDetectorHumo>>` | `InventarioDetectorHumoAddOrEditDTO dto` |
| UpdateAsync | IInventarioDetectorHumoAppService | UPDATE | `Task<ApiResponseDTO<InventarioDetectorHumo>>` | `Guid id, InventarioDetectorHumoAddOrEditDTO dto` |
| DeleteByIdAsync | IInventarioDetectorHumoAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| DeleteAllByCustomerAsync | IInventarioDetectorHumoAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid customerId` |
| ImportFromExcelAsync | IInventarioDetectorHumoAppService | SPECIAL | `Task<ImportPropertiesResultDTO>` | `Guid customerId, IFormFile file` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/inventario-detector-humo/list/{customerId:guid}` | `appService.GetAllAsync` | `MantenimientoLuxuryApp/SmokeDetectorInventory/EndPoints/InventarioDetectorHumoEndpoints.cs` |
| GET | `/api/inventario-detector-humo/{id:guid}` | `appService.GetByIdAsync` | `MantenimientoLuxuryApp/SmokeDetectorInventory/EndPoints/InventarioDetectorHumoEndpoints.cs` |
| POST | `/api/inventario-detector-humo` | `appService.AddAsync` | `MantenimientoLuxuryApp/SmokeDetectorInventory/EndPoints/InventarioDetectorHumoEndpoints.cs` |
| PUT | `/api/inventario-detector-humo/{id:guid}` | `appService.UpdateAsync` | `MantenimientoLuxuryApp/SmokeDetectorInventory/EndPoints/InventarioDetectorHumoEndpoints.cs` |
| DELETE | `/api/inventario-detector-humo/{id:guid}` | `appService.DeleteByIdAsync` | `MantenimientoLuxuryApp/SmokeDetectorInventory/EndPoints/InventarioDetectorHumoEndpoints.cs` |
| DELETE | `/api/inventario-detector-humo/all/{customerId:guid}` | `appService.DeleteAllByCustomerAsync` | `MantenimientoLuxuryApp/SmokeDetectorInventory/EndPoints/InventarioDetectorHumoEndpoints.cs` |
| POST | `/api/inventario-detector-humo/import/{customerId:guid}` | `appService.ImportFromExcelAsync` | `MantenimientoLuxuryApp/SmokeDetectorInventory/EndPoints/InventarioDetectorHumoEndpoints.cs` |

#### Modulo: SmokeDetectorLog

- Interfaces: 1 | Servicios: 1 | Endpoints: 4 | DTOs: 2

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IBitacoraDetectorHumoAppService | 4 | `MantenimientoLuxuryApp/SmokeDetectorLog/Interfaces/IBitacoraDetectorHumoAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| BitacoraDetectorHumoAppService | 4 | `MantenimientoLuxuryApp/SmokeDetectorLog/Services/BitacoraDetectorHumoAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetAllAsync | IBitacoraDetectorHumoAppService | GET_LIST | `Task<ApiResponseDTO<BitacoraDetectorHumoDTO…` | `Guid detectorId` |
| GetByIdAsync | IBitacoraDetectorHumoAppService | GET_SINGLE | `Task<ApiResponseDTO<BitacoraDetectorHumoAdd…` | `Guid id` |
| AddAsync | IBitacoraDetectorHumoAppService | CREATE | `Task<ApiResponseDTO<BitacoraDetectorHumo>>` | `BitacoraDetectorHumoAddOrEditDTO dto` |
| DeleteByIdAsync | IBitacoraDetectorHumoAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/bitacora-detector-humo/list/{detectorId:guid}` | `appService.GetAllAsync` | `MantenimientoLuxuryApp/SmokeDetectorLog/EndPoints/BitacoraDetectorHumoEndPoints.cs` |
| GET | `/api/bitacora-detector-humo/{id:guid}` | `appService.GetByIdAsync` | `MantenimientoLuxuryApp/SmokeDetectorLog/EndPoints/BitacoraDetectorHumoEndPoints.cs` |
| POST | `/api/bitacora-detector-humo` | `appService.AddAsync` | `MantenimientoLuxuryApp/SmokeDetectorLog/EndPoints/BitacoraDetectorHumoEndPoints.cs` |
| DELETE | `/api/bitacora-detector-humo/{id:guid}` | `appService.DeleteByIdAsync` | `MantenimientoLuxuryApp/SmokeDetectorLog/EndPoints/BitacoraDetectorHumoEndPoints.cs` |

#### Modulo: ToolLoans

- Interfaces: 0 | Servicios: 0 | Endpoints: 5 | DTOs: 0

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/control-prestamo-herramientas/list/{customerId:guid}` | - | `MantenimientoLuxuryApp/ToolLoans/EndPoints/ControlPrestamoHerramientasEndPoints.cs` |
| GET | `/api/control-prestamo-herramientas/{id:guid}` | `dataService.UpdateAsync` | `MantenimientoLuxuryApp/ToolLoans/EndPoints/ControlPrestamoHerramientasEndPoints.cs` |
| PUT | `/api/control-prestamo-herramientas/{id:guid}` | `dataService.UpdateAsync` | `MantenimientoLuxuryApp/ToolLoans/EndPoints/ControlPrestamoHerramientasEndPoints.cs` |
| POST | `/api/control-prestamo-herramientas` | `dataService.AddAsync` | `MantenimientoLuxuryApp/ToolLoans/EndPoints/ControlPrestamoHerramientasEndPoints.cs` |
| DELETE | `/api/control-prestamo-herramientas/{id:guid}` | `dataService.DeleteByIdAsync` | `MantenimientoLuxuryApp/ToolLoans/EndPoints/ControlPrestamoHerramientasEndPoints.cs` |


### Grupo: OperationsLuxuryApp

#### Modulo: AccessControl

- Interfaces: 9 | Servicios: 9 | Endpoints: 23 | DTOs: 19

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IAccessCredentialSecurity | 4 | `OperationsLuxuryApp/AccessControl/Interfaces/IAccessCredentialSecurity.cs` |
| IAccessCredentialService | 3 | `OperationsLuxuryApp/AccessControl/Interfaces/IAccessCredentialService.cs` |
| IAccessDashboardService | 2 | `OperationsLuxuryApp/AccessControl/Interfaces/IAccessDashboardService.cs` |
| IAccessEventService | 2 | `OperationsLuxuryApp/AccessControl/Interfaces/IAccessEventService.cs` |
| IAccessPointService | 3 | `OperationsLuxuryApp/AccessControl/Interfaces/IAccessPointService.cs` |
| IAccessScanService | 1 | `OperationsLuxuryApp/AccessControl/Interfaces/IAccessScanService.cs` |
| IInvitationAppService | 3 | `OperationsLuxuryApp/AccessControl/Interfaces/IInvitationAppService.cs` |
| IVisitAppService | 5 | `OperationsLuxuryApp/AccessControl/Interfaces/IVisitAppService.cs` |
| IVisitorService | 4 | `OperationsLuxuryApp/AccessControl/Interfaces/IVisitorService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| AccessControlMapper | 0 | `OperationsLuxuryApp/AccessControl/Mapping/AccessControlMapper.cs` |
| AccessCredentialService | 3 | `OperationsLuxuryApp/AccessControl/Services/AccessCredentialService.cs` |
| AccessDashboardService | 2 | `OperationsLuxuryApp/AccessControl/Services/AccessDashboardService.cs` |
| AccessEventService | 2 | `OperationsLuxuryApp/AccessControl/Services/AccessEventService.cs` |
| AccessPointService | 3 | `OperationsLuxuryApp/AccessControl/Services/AccessPointService.cs` |
| AccessScanService | 1 | `OperationsLuxuryApp/AccessControl/Services/AccessScanService.cs` |
| InvitationAppService | 3 | `OperationsLuxuryApp/AccessControl/Services/InvitationAppService.cs` |
| VisitAppService | 5 | `OperationsLuxuryApp/AccessControl/Services/VisitAppService.cs` |
| VisitorService | 4 | `OperationsLuxuryApp/AccessControl/Services/VisitorService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| BuildSecurePayload | IAccessCredentialSecurity | OTHER | `string` | `Guid credentialId, Guid customerId, AccessCredentialValidit…` |
| TryValidate | IAccessCredentialSecurity | OTHER | `bool` | `string scannedPayload, out AccessCredentialPayload payload` |
| GeneratePublicCode | IAccessCredentialSecurity | SPECIAL | `string` | `-` |
| BuildQrImageBase64 | IAccessCredentialSecurity | OTHER | `string` | `string content` |
| GenerateQrCredentialAsync | IAccessCredentialService | SPECIAL | `Task<ApiResponseDTO<AccessCredentialDTO>>` | `Guid visitId, string validityType, int? maxUsages, DateTime…` |
| GetCredentialByIdAsync | IAccessCredentialService | GET_SINGLE | `Task<ApiResponseDTO<AccessCredentialDTO>>` | `Guid id, CancellationToken ct` |
| RevokeCredentialAsync | IAccessCredentialService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid id, string reason, CancellationToken ct` |
| GetCurrentOccupancyAsync | IAccessDashboardService | GET_LIST | `Task<ApiResponseDTO<OccupancyDTO>>` | `CancellationToken ct` |
| GetDashboardStatsAsync | IAccessDashboardService | GET_LIST | `Task<ApiResponseDTO<DashboardStatsDTO>>` | `CancellationToken ct` |
| GetEventsPagedAsync | IAccessEventService | GET_LIST | `Task<ApiResponseDTO<PagedResultDTO<AccessEv…` | `PaginationCommonDTO pagination, CancellationToken ct` |
| ExportEventsAsync | IAccessEventService | SPECIAL | `Task<byte[]>` | `CancellationToken ct` |
| CreateAsync | IAccessPointService | CREATE | `Task<ApiResponseDTO<AccessPointDTO>>` | `CreateAccessPointRequestDTO request, CancellationToken ct` |
| GetAllAsync | IAccessPointService | GET_LIST | `Task<ApiResponseDTO<List<AccessPointDTO>>>` | `CancellationToken ct` |
| UpdateAsync | IAccessPointService | UPDATE | `Task<ApiResponseDTO<AccessPointDTO>>` | `Guid id, UpdateAccessPointRequestDTO request, CancellationT…` |
| ScanAsync | IAccessScanService | OTHER | `Task<ApiResponseDTO<AccessScanResultDTO>>` | `ScanAccessCredentialRequestDTO request, CancellationToken ct` |
| SendInvitationAsync | IInvitationAppService | SPECIAL | `Task<ApiResponseDTO<InvitationDTO>>` | `Guid visitId, string channel, string message, CancellationT…` |
| ResendInvitationAsync | IInvitationAppService | OTHER | `Task<ApiResponseDTO<InvitationDTO>>` | `Guid invitationId, CancellationToken ct` |
| GetByVisitAsync | IInvitationAppService | GET_LIST | `Task<ApiResponseDTO<List<InvitationDTO>>>` | `Guid visitId, CancellationToken ct` |
| CreateVisitAsync | IVisitAppService | CREATE | `Task<ApiResponseDTO<VisitDTO>>` | `CreateVisitRequestDTO request, CancellationToken ct` |
| GetVisitByIdAsync | IVisitAppService | GET_SINGLE | `Task<ApiResponseDTO<VisitDTO>>` | `Guid id, CancellationToken ct` |
| GetVisitsPagedAsync | IVisitAppService | GET_LIST | `Task<ApiResponseDTO<PagedResultDTO<VisitDTO…` | `PaginationCommonDTO pagination, CancellationToken ct` |
| CancelVisitAsync | IVisitAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid id, string reason, CancellationToken ct` |
| GetActiveVisitsAsync | IVisitAppService | GET_LIST | `Task<ApiResponseDTO<List<VisitDTO>>>` | `CancellationToken ct` |
| CreateAsync | IVisitorService | CREATE | `Task<ApiResponseDTO<VisitorDTO>>` | `CreateVisitorRequestDTO request, CancellationToken ct` |
| GetByIdAsync | IVisitorService | GET_SINGLE | `Task<ApiResponseDTO<VisitorDTO>>` | `Guid id, CancellationToken ct` |
| GetAllAsync | IVisitorService | GET_LIST | `Task<ApiResponseDTO<List<VisitorDTO>>>` | `CancellationToken ct` |
| UpdateAsync | IVisitorService | UPDATE | `Task<ApiResponseDTO<VisitorDTO>>` | `Guid id, UpdateVisitorRequestDTO request, CancellationToken…` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| POST | `/api/access-controls/credentials/qr` | `appService.GenerateQrCredentialAsync` | `OperationsLuxuryApp/AccessControl/EndPoints/AccessCredentialsEndpoints.cs` |
| POST | `/api/access-controls/credentials/scan` | `scanService.ScanAsync` | `OperationsLuxuryApp/AccessControl/EndPoints/AccessCredentialsEndpoints.cs` |
| GET | `/api/access-controls/credentials/{id:guid}` | `appService.GetCredentialByIdAsync` | `OperationsLuxuryApp/AccessControl/EndPoints/AccessCredentialsEndpoints.cs` |
| PATCH | `/api/access-controls/credentials/{id:guid}/revoke` | `appService.RevokeCredentialAsync` | `OperationsLuxuryApp/AccessControl/EndPoints/AccessCredentialsEndpoints.cs` |
| GET | `/api/access-controls/events` | `appService.GetEventsPagedAsync` | `OperationsLuxuryApp/AccessControl/EndPoints/AccessOperationsEndpoints.cs` |
| GET | `/api/access-controls/events/export` | `appService.ExportEventsAsync` | `OperationsLuxuryApp/AccessControl/EndPoints/AccessOperationsEndpoints.cs` |
| GET | `/api/access-controls/dashboard/occupancy` | `appService.GetCurrentOccupancyAsync` | `OperationsLuxuryApp/AccessControl/EndPoints/AccessOperationsEndpoints.cs` |
| GET | `/api/access-controls/dashboard/stats` | `appService.GetDashboardStatsAsync` | `OperationsLuxuryApp/AccessControl/EndPoints/AccessOperationsEndpoints.cs` |
| GET | `/api/access-controls/access-points` | `appService.GetAllAsync` | `OperationsLuxuryApp/AccessControl/EndPoints/AccessPointsEndpoints.cs` |
| POST | `/api/access-controls/access-points` | `appService.CreateAsync` | `OperationsLuxuryApp/AccessControl/EndPoints/AccessPointsEndpoints.cs` |
| PUT | `/api/access-controls/access-points/{id:guid}` | `appService.UpdateAsync` | `OperationsLuxuryApp/AccessControl/EndPoints/AccessPointsEndpoints.cs` |
| POST | `/api/access-controls/invitations` | `appService.SendInvitationAsync` | `OperationsLuxuryApp/AccessControl/EndPoints/InvitationsEndpoints.cs` |
| POST | `/api/access-controls/invitations/{id:guid}/resend` | `appService.ResendInvitationAsync` | `OperationsLuxuryApp/AccessControl/EndPoints/InvitationsEndpoints.cs` |
| GET | `/api/access-controls/invitations/by-visit/{visitId:guid}` | `appService.GetByVisitAsync` | `OperationsLuxuryApp/AccessControl/EndPoints/InvitationsEndpoints.cs` |
| GET | `/api/access-controls/visitors` | `appService.GetAllAsync` | `OperationsLuxuryApp/AccessControl/EndPoints/VisitorsEndpoints.cs` |
| GET | `/api/access-controls/visitors/{id:guid}` | `appService.GetByIdAsync` | `OperationsLuxuryApp/AccessControl/EndPoints/VisitorsEndpoints.cs` |
| POST | `/api/access-controls/visitors` | `appService.CreateAsync` | `OperationsLuxuryApp/AccessControl/EndPoints/VisitorsEndpoints.cs` |
| PUT | `/api/access-controls/visitors/{id:guid}` | `appService.UpdateAsync` | `OperationsLuxuryApp/AccessControl/EndPoints/VisitorsEndpoints.cs` |
| POST | `/api/access-controls/visits` | `appService.CreateVisitAsync` | `OperationsLuxuryApp/AccessControl/EndPoints/VisitsEndpoints.cs` |
| GET | `/api/access-controls/visits/active` | `appService.GetActiveVisitsAsync` | `OperationsLuxuryApp/AccessControl/EndPoints/VisitsEndpoints.cs` |
| GET | `/api/access-controls/visits` | `appService.GetVisitsPagedAsync` | `OperationsLuxuryApp/AccessControl/EndPoints/VisitsEndpoints.cs` |
| GET | `/api/access-controls/visits/{id:guid}` | `appService.GetVisitByIdAsync` | `OperationsLuxuryApp/AccessControl/EndPoints/VisitsEndpoints.cs` |
| PATCH | `/api/access-controls/visits/{id:guid}/cancel` | `appService.CancelVisitAsync` | `OperationsLuxuryApp/AccessControl/EndPoints/VisitsEndpoints.cs` |

#### Modulo: Announcements

- Interfaces: 2 | Servicios: 3 | Endpoints: 10 | DTOs: 9

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IAnnouncementAppService | 8 | `OperationsLuxuryApp/Announcements/Interfaces/IAnnouncementAppService.cs` |
| IAnnouncementNotificationService | 1 | `OperationsLuxuryApp/Announcements/Interfaces/IAnnouncementNotificationService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| AnnouncementMapper | 0 | `OperationsLuxuryApp/Announcements/Mapping/AnnouncementMapper.cs` |
| AnnouncementAppService | 8 | `OperationsLuxuryApp/Announcements/Services/AnnouncementAppService.cs` |
| AnnouncementNotificationService | 1 | `OperationsLuxuryApp/Announcements/Services/AnnouncementNotificationService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetAllForAdminAsync | IAnnouncementAppService | GET_LIST | `Task<ApiResponseDTO<List<AnnouncementAdminL…` | `-` |
| GetAllAsync | IAnnouncementAppService | GET_LIST | `Task<ApiResponseDTO<List<AnnouncementListDT…` | `-` |
| GetByIdAsync | IAnnouncementAppService | GET_SINGLE | `Task<ApiResponseDTO<AnnouncementDTO>>` | `Guid id` |
| AddAsync | IAnnouncementAppService | CREATE | `Task<ApiResponseDTO<AnnouncementDTO>>` | `AnnouncementAddOrEditDTO DTO` |
| UpdateAsync | IAnnouncementAppService | UPDATE | `Task<ApiResponseDTO<AnnouncementDTO>>` | `Guid id, AnnouncementAddOrEditDTO DTO` |
| DeleteAsync | IAnnouncementAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetAnalyticsByIdAsync | IAnnouncementAppService | GET_LIST | `Task<ApiResponseDTO<List<AnnouncementAnalyt…` | `Guid announcementId` |
| GeneratePdfAsync | IAnnouncementAppService | SPECIAL | `Task<ApiResponseDTO<byte[]>>` | `Guid id` |
| SendNewAnnouncementNotificationAsync | IAnnouncementNotificationService | SPECIAL | `Task` | `Guid announcementId` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| POST | `/api/announcements/generate-draft` | `aiAssistantService.GenerateAnnouncementDraftAsync` | `OperationsLuxuryApp/Announcements/EndPoints/AnnouncementsEndpoints.cs` |
| POST | `/api/announcements/generate-official-draft` | `aiAssistantService.GenerateOfficialAnnouncementAsync` | `OperationsLuxuryApp/Announcements/EndPoints/AnnouncementsEndpoints.cs` |
| GET | `/api/announcements` | `announcementAppService.GetAllAsync` | `OperationsLuxuryApp/Announcements/EndPoints/AnnouncementsEndpoints.cs` |
| GET | `/api/announcements/admin-list` | `announcementAppService.GetAllForAdminAsync` | `OperationsLuxuryApp/Announcements/EndPoints/AnnouncementsEndpoints.cs` |
| GET | `/api/announcements/{id:guid}` | `announcementAppService.GetByIdAsync` | `OperationsLuxuryApp/Announcements/EndPoints/AnnouncementsEndpoints.cs` |
| GET | `/api/announcements/{id:guid}/analytics` | `announcementAppService.GetAnalyticsByIdAsync` | `OperationsLuxuryApp/Announcements/EndPoints/AnnouncementsEndpoints.cs` |
| GET | `/api/announcements/{id:guid}/pdf` | `announcementAppService.GeneratePdfAsync` | `OperationsLuxuryApp/Announcements/EndPoints/AnnouncementsEndpoints.cs` |
| POST | `/api/announcements` | `announcementAppService.AddAsync` | `OperationsLuxuryApp/Announcements/EndPoints/AnnouncementsEndpoints.cs` |
| PUT | `/api/announcements/{id:guid}` | `announcementAppService.UpdateAsync` | `OperationsLuxuryApp/Announcements/EndPoints/AnnouncementsEndpoints.cs` |
| DELETE | `/api/announcements/{id:guid}` | `announcementAppService.DeleteAsync` | `OperationsLuxuryApp/Announcements/EndPoints/AnnouncementsEndpoints.cs` |

#### Modulo: BuildingCustomer

- Interfaces: 0 | Servicios: 1 | Endpoints: 0 | DTOs: 0

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| BuildingCustomerAppService | 1 | `OperationsLuxuryApp/BuildingCustomer/Services/BuildingCustomerAppService.cs` |

#### Modulo: Comite

- Interfaces: 1 | Servicios: 2 | Endpoints: 6 | DTOs: 7

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IComiteVigilanciaAppService | 7 | `OperationsLuxuryApp/Comite/ComitesVigilancia/Interfaces/IComiteVigilanciaAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| ComiteVigilanciaMapper | 0 | `OperationsLuxuryApp/Comite/ComitesVigilancia/Mapping/ComiteVigilanciaMapper.cs` |
| ComiteVigilanciaAppService | 7 | `OperationsLuxuryApp/Comite/ComitesVigilancia/Services/ComiteVigilanciaAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetByIdAsync | IComiteVigilanciaAppService | GET_SINGLE | `Task<ApiResponseDTO<ComiteVigilanciaEditDTO…` | `Guid id` |
| GetAllAsync | IComiteVigilanciaAppService | GET_LIST | `Task<ApiResponseDTO<ComiteVigilanciaDTO[]>>` | `Guid customerId` |
| AddAsync | IComiteVigilanciaAppService | CREATE | `Task<ApiResponseDTO<ComiteVigilanciaSavedDT…` | `ComiteVigilanciaAddOrEditDTO DTO` |
| UpdateAsync | IComiteVigilanciaAppService | UPDATE | `Task<ApiResponseDTO<ComiteVigilanciaSavedDT…` | `Guid id, ComiteVigilanciaAddOrEditDTO DTO` |
| DeleteByIdAsync | IComiteVigilanciaAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetAllCommitteesAsync | IComiteVigilanciaAppService | GET_LIST | `Task<ApiResponseDTO<IEnumerable<CommitteeDi…` | `-` |
| SendCredentialsAsync | IComiteVigilanciaAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid comiteVigilanciaId` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/comites-vigilancia/{id:guid}` | `dataService.GetByIdAsync` | `OperationsLuxuryApp/Comite/ComitesVigilancia/EndPoints/ComitesVigilanciaEndpoints.cs` |
| GET | `/api/comites-vigilancia/list/{customerId:guid}` | `dataService.GetAllAsync` | `OperationsLuxuryApp/Comite/ComitesVigilancia/EndPoints/ComitesVigilanciaEndpoints.cs` |
| POST | `/api/comites-vigilancia` | `dataService.AddAsync` | `OperationsLuxuryApp/Comite/ComitesVigilancia/EndPoints/ComitesVigilanciaEndpoints.cs` |
| PUT | `/api/comites-vigilancia/{id:guid}` | `dataService.UpdateAsync` | `OperationsLuxuryApp/Comite/ComitesVigilancia/EndPoints/ComitesVigilanciaEndpoints.cs` |
| DELETE | `/api/comites-vigilancia/{id:guid}` | `dataService.DeleteByIdAsync` | `OperationsLuxuryApp/Comite/ComitesVigilancia/EndPoints/ComitesVigilanciaEndpoints.cs` |
| POST | `/api/comites-vigilancia/{id:guid}/send-credentials` | `dataService.SendCredentialsAsync` | `OperationsLuxuryApp/Comite/ComitesVigilancia/EndPoints/ComitesVigilanciaEndpoints.cs` |

#### Modulo: CustomDocuments

- Interfaces: 1 | Servicios: 1 | Endpoints: 7 | DTOs: 4

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| ICustomDocumentAppService | 7 | `OperationsLuxuryApp/CustomDocuments/Interfaces/ICustomDocumentAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| CustomDocumentAppService | 7 | `OperationsLuxuryApp/CustomDocuments/Services/CustomDocumentAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetByIdAsync | ICustomDocumentAppService | GET_SINGLE | `Task<ApiResponseDTO<DocumentLegalRecordAddO…` | `Guid id` |
| GetDocumentPathAsync | ICustomDocumentAppService | GET_SINGLE | `Task<string>` | `Guid id` |
| GetAllByCustomerAsync | ICustomDocumentAppService | GET_LIST | `Task<ApiResponseDTO<List<object>>>` | `Guid customerId, DocumentType documentType` |
| AddAsync | ICustomDocumentAppService | CREATE | `Task<ApiResponseDTO<DocumentLegalRecordCrea…` | `DocumentLegalRecordAddOrEditDTO DTO` |
| UpdateAsync | ICustomDocumentAppService | UPDATE | `Task<ApiResponseDTO<bool>>` | `Guid id, DocumentLegalRecordAddOrEditDTO DTO` |
| DeleteAsync | ICustomDocumentAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| UpdateSortOrderAsync | ICustomDocumentAppService | UPDATE | `Task<ApiResponseDTO<object>>` | `List<Guid> documentIds` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/custom-documents/{id:guid}` | `appService.GetByIdAsync` | `OperationsLuxuryApp/CustomDocuments/EndPoints/CustomDocumentsEndpoints.cs` |
| GET | `/api/custom-documents/list/{customerId:guid}/{documentType}` | `appService.GetAllByCustomerAsync` | `OperationsLuxuryApp/CustomDocuments/EndPoints/CustomDocumentsEndpoints.cs` |
| POST | `/api/custom-documents` | `appService.AddAsync` | `OperationsLuxuryApp/CustomDocuments/EndPoints/CustomDocumentsEndpoints.cs` |
| PUT | `/api/custom-documents/{id:guid}` | `appService.UpdateAsync` | `OperationsLuxuryApp/CustomDocuments/EndPoints/CustomDocumentsEndpoints.cs` |
| DELETE | `/api/custom-documents/{id:guid}` | `appService.DeleteAsync` | `OperationsLuxuryApp/CustomDocuments/EndPoints/CustomDocumentsEndpoints.cs` |
| PUT | `/api/custom-documents/update-order` | `appService.UpdateSortOrderAsync` | `OperationsLuxuryApp/CustomDocuments/EndPoints/CustomDocumentsEndpoints.cs` |
| POST | `/api/custom-documents/consult-with-ai` | `appService.GetByIdAsync` | `OperationsLuxuryApp/CustomDocuments/EndPoints/CustomDocumentsEndpoints.cs` |

#### Modulo: CustomerProviders

- Interfaces: 1 | Servicios: 2 | Endpoints: 5 | DTOs: 5

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| ICustomerProviderAppService | 5 | `OperationsLuxuryApp/CustomerProviders/Interfaces/ICustomerProviderAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| CustomerProviderMapper | 0 | `OperationsLuxuryApp/CustomerProviders/Mapping/CustomerProviderMapper.cs` |
| CustomerProviderAppService | 5 | `OperationsLuxuryApp/CustomerProviders/Services/CustomerProviderAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetCustomerProviderDTOAsync | ICustomerProviderAppService | GET_LIST | `Task<ApiResponseDTO<List<CustomerProviderLi…` | `Guid customerId` |
| GetByIdAsync | ICustomerProviderAppService | GET_SINGLE | `Task<ApiResponseDTO<CustomerProviderAddOrEd…` | `Guid id` |
| PostAsync | ICustomerProviderAppService | CREATE | `Task<ApiResponseDTO<CustomerProvider>>` | `CustomerProviderAddOrEditDTO customerProviderAddOrEditDTO` |
| UpdateAsync | ICustomerProviderAppService | UPDATE | `Task<ApiResponseDTO<object>>` | `Guid id, CustomerProviderAddOrEditDTO DTO` |
| DeleteByIdAsync | ICustomerProviderAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/customer-provider/{customerId:guid}` | `appService.GetCustomerProviderDTOAsync` | `OperationsLuxuryApp/CustomerProviders/EndPoints/CustomerProviderEndPoints.cs` |
| GET | `/api/customer-provider/get-by-id/{id:guid}` | `appService.GetByIdAsync` | `OperationsLuxuryApp/CustomerProviders/EndPoints/CustomerProviderEndPoints.cs` |
| POST | `/api/customer-provider` | `appService.PostAsync` | `OperationsLuxuryApp/CustomerProviders/EndPoints/CustomerProviderEndPoints.cs` |
| PUT | `/api/customer-provider/{id:guid}` | `appService.UpdateAsync` | `OperationsLuxuryApp/CustomerProviders/EndPoints/CustomerProviderEndPoints.cs` |
| DELETE | `/api/customer-provider/{id:guid}` | `appService.DeleteByIdAsync` | `OperationsLuxuryApp/CustomerProviders/EndPoints/CustomerProviderEndPoints.cs` |

#### Modulo: Dashboard

- Interfaces: 1 | Servicios: 1 | Endpoints: 4 | DTOs: 1

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IDashboardAppService | 2 | `OperationsLuxuryApp/Dashboard/Interfaces/IDashboardAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| DashboardAppService | 2 | `OperationsLuxuryApp/Dashboard/Services/DashboardAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetFiltroMinutasAreaAsync | IDashboardAppService | GET_LIST | `Task<ApiResponseDTO<List<object>>>` | `Guid meetingId, AreaMinutasDetalles areaMinutasDetalles, St…` |
| GetGlobalPendingItemsAsync | IDashboardAppService | GET_LIST | `Task<ApiResponseDTO<List<PendingItemDTO>>>` | `Guid customerId` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| POST | `/api/dashboard/send-executive-report/{customerId:guid}` | `sendEmailAppService.SendExecutivePendingReportAsync` | `OperationsLuxuryApp/Dashboard/EndPoints/DashboardEndpoints.cs` |
| GET | `/api/dashboard/filtro-minutas-area/{meetingId:guid}/{areaMinutasDetalles}/{estatus?}` | `dashboardAppService.GetFiltroMinutasAreaAsync` | `OperationsLuxuryApp/Dashboard/EndPoints/DashboardEndpoints.cs` |
| GET | `/api/dashboard/global-pending-items/{customerId:guid}` | `dashboardAppService.GetGlobalPendingItemsAsync` | `OperationsLuxuryApp/Dashboard/EndPoints/DashboardEndpoints.cs` |
| POST | `/api/dashboard/analyze` | `aiAssistantService.GenerateDashboardSummaryAsync` | `OperationsLuxuryApp/Dashboard/EndPoints/DashboardEndpoints.cs` |

#### Modulo: DeliveryReception

- Interfaces: 4 | Servicios: 5 | Endpoints: 21 | DTOs: 3

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| ICatalogoEntregaRecepcionDescripcionAppService | 6 | `OperationsLuxuryApp/DeliveryReception/Interfaces/ICatalogoEntregaRecepcionDescripcionAppService.cs` |
| IEntregaRecepcionAppService | 9 | `OperationsLuxuryApp/DeliveryReception/Interfaces/IEntregaRecepcionAppService.cs` |
| IEntregaRecepcionClienteAppService | 0 | `OperationsLuxuryApp/DeliveryReception/Interfaces/IEntregaRecepcionClienteAppService.cs` |
| IEntregaRecepcionDescripcionAppService | 6 | `OperationsLuxuryApp/DeliveryReception/Interfaces/IEntregaRecepcionDescripcionAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| CatalogoEntregaRecepcionDescripcionMapper | 0 | `OperationsLuxuryApp/DeliveryReception/Mapping/CatalogoEntregaRecepcionDescripcionMapper.cs` |
| CatalogoEntregaRecepcionDescripcionAppService | 6 | `OperationsLuxuryApp/DeliveryReception/Services/CatalogoEntregaRecepcionDescripcionAppService.cs` |
| EntregaRecepcionAppService | 9 | `OperationsLuxuryApp/DeliveryReception/Services/EntregaRecepcionAppService.cs` |
| EntregaRecepcionClienteAppService | 0 | `OperationsLuxuryApp/DeliveryReception/Services/EntregaRecepcionClienteAppService.cs` |
| EntregaRecepcionDescripcionAppService | 6 | `OperationsLuxuryApp/DeliveryReception/Services/EntregaRecepcionDescripcionAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetByIdAsync | ICatalogoEntregaRecepcionDescripcionAppService | GET_SINGLE | `Task<ApiResponseDTO<CatalogoEntregaRecepcio…` | `Guid id` |
| GetAllAsync | ICatalogoEntregaRecepcionDescripcionAppService | GET_LIST | `Task<ApiResponseDTO<CatalogoEntregaRecepcio…` | `-` |
| GetGruposAsync | ICatalogoEntregaRecepcionDescripcionAppService | GET_LIST | `Task<ApiResponseDTO<IEnumerable<object>>>` | `-` |
| AddAsync | ICatalogoEntregaRecepcionDescripcionAppService | CREATE | `Task<ApiResponseDTO<CatalogoEntregaRecepcio…` | `CatalogoEntregaRecepcionDescripcionAddOrEditDTO DTO` |
| UpdateAsync | ICatalogoEntregaRecepcionDescripcionAppService | UPDATE | `Task<ApiResponseDTO<CatalogoEntregaRecepcio…` | `Guid id, CatalogoEntregaRecepcionDescripcionAddOrEditDTO DTO` |
| DeleteByIdAsync | ICatalogoEntregaRecepcionDescripcionAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetInventarioEquiposAsync | IEntregaRecepcionAppService | GET_LIST | `Task<ApiResponseDTO<IEnumerable<object>>>` | `Guid customerId` |
| GetInventarioInstalacionesAsync | IEntregaRecepcionAppService | GET_LIST | `Task<ApiResponseDTO<IEnumerable<object>>>` | `Guid customerId` |
| GetInventarioInsumosAsync | IEntregaRecepcionAppService | GET_LIST | `Task<ApiResponseDTO<IEnumerable<object>>>` | `Guid customerId` |
| GetInventarioHerramientasAsync | IEntregaRecepcionAppService | GET_LIST | `Task<ApiResponseDTO<IEnumerable<object>>>` | `Guid customerId` |
| GetInventarioLlavesAsync | IEntregaRecepcionAppService | GET_LIST | `Task<ApiResponseDTO<IEnumerable<object>>>` | `Guid customerId` |
| GetInventarioMantenimientosAsync | IEntregaRecepcionAppService | GET_LIST | `Task<ApiResponseDTO<IEnumerable<object>>>` | `Guid customerId` |
| GetOrganigramaAsync | IEntregaRecepcionAppService | GET_LIST | `Task<ApiResponseDTO<IEnumerable<object>>>` | `Guid customerId` |
| GetExtintoresAsync | IEntregaRecepcionAppService | GET_LIST | `Task<ApiResponseDTO<IEnumerable<object>>>` | `Guid customerId` |
| GetPendientesAsync | IEntregaRecepcionAppService | GET_LIST | `Task<ApiResponseDTO<IEnumerable<object>>>` | `Guid customerId` |
| FindByIdAsync | IEntregaRecepcionDescripcionAppService | GET_SINGLE | `Task<ApiResponseDTO<EntregaRecepcionDescrip…` | `Guid id` |
| UpdateAsync | IEntregaRecepcionDescripcionAppService | UPDATE | `Task<ApiResponseDTO<object>>` | `Guid id, string userId, string customerId, EntregaRecepcion…` |
| ValidarArchivoAsync | IEntregaRecepcionDescripcionAppService | SPECIAL | `Task<ApiResponseDTO<object>>` | `string userId, Guid id` |
| InvalidarArchivoAsync | IEntregaRecepcionDescripcionAppService | SPECIAL | `Task<ApiResponseDTO<object>>` | `Guid id` |
| DeleteFile | IEntregaRecepcionDescripcionAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetAllAsync | IEntregaRecepcionDescripcionAppService | GET_LIST | `Task<ApiResponseDTO<object>>` | `Guid customerId, string departamento` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/catalogo-entrega-recepcion-descripcion/{id:guid}` | `dataService.GetByIdAsync` | `OperationsLuxuryApp/DeliveryReception/EndPoints/CatalogoEntregaRecepcionDescripcionEndpoints.cs` |
| GET | `/api/catalogo-entrega-recepcion-descripcion` | `dataService.GetAllAsync` | `OperationsLuxuryApp/DeliveryReception/EndPoints/CatalogoEntregaRecepcionDescripcionEndpoints.cs` |
| GET | `/api/catalogo-entrega-recepcion-descripcion/grupos` | `dataService.GetGruposAsync` | `OperationsLuxuryApp/DeliveryReception/EndPoints/CatalogoEntregaRecepcionDescripcionEndpoints.cs` |
| POST | `/api/catalogo-entrega-recepcion-descripcion` | `dataService.AddAsync` | `OperationsLuxuryApp/DeliveryReception/EndPoints/CatalogoEntregaRecepcionDescripcionEndpoints.cs` |
| PUT | `/api/catalogo-entrega-recepcion-descripcion/{id:guid}` | `dataService.UpdateAsync` | `OperationsLuxuryApp/DeliveryReception/EndPoints/CatalogoEntregaRecepcionDescripcionEndpoints.cs` |
| DELETE | `/api/catalogo-entrega-recepcion-descripcion/{id:guid}` | `dataService.DeleteByIdAsync` | `OperationsLuxuryApp/DeliveryReception/EndPoints/CatalogoEntregaRecepcionDescripcionEndpoints.cs` |
| PUT | `/api/entrega-recepcion-cliente/{id:guid}/{userId}/{customerId:guid}` | `appService.UpdateAsync` | `OperationsLuxuryApp/DeliveryReception/EndPoints/EntregaRecepcionClienteEndpoints.cs` |
| PUT | `/api/entrega-recepcion-cliente/validar-archivo/{userId}/{id:guid}` | `appService.ValidarArchivoAsync` | `OperationsLuxuryApp/DeliveryReception/EndPoints/EntregaRecepcionClienteEndpoints.cs` |
| PUT | `/api/entrega-recepcion-cliente/invalidar-archivo/{id:guid}` | `appService.InvalidarArchivoAsync` | `OperationsLuxuryApp/DeliveryReception/EndPoints/EntregaRecepcionClienteEndpoints.cs` |
| DELETE | `/api/entrega-recepcion-cliente/delete-file/{id:guid}` | `appService.GetAllAsync` | `OperationsLuxuryApp/DeliveryReception/EndPoints/EntregaRecepcionClienteEndpoints.cs` |
| GET | `/api/entrega-recepcion-cliente/{customerId:guid}/{departamento}` | `appService.GetAllAsync` | `OperationsLuxuryApp/DeliveryReception/EndPoints/EntregaRecepcionClienteEndpoints.cs` |
| GET | `/api/entrega-recepcion-descripcion/{id:guid}` | `appService.FindByIdAsync` | `OperationsLuxuryApp/DeliveryReception/EndPoints/EntregaRecepcionDescripcionEndpoints.cs` |
| GET | `/api/entrega-recepcion/inventario-equipos/{customerId:guid}` | `appService.GetInventarioEquiposAsync` | `OperationsLuxuryApp/DeliveryReception/EndPoints/EntregaRecepcionEndpoints.cs` |
| GET | `/api/entrega-recepcion/inventario-instalaciones/{customerId:guid}` | `appService.GetInventarioInstalacionesAsync` | `OperationsLuxuryApp/DeliveryReception/EndPoints/EntregaRecepcionEndpoints.cs` |
| GET | `/api/entrega-recepcion/inventario-insumos/{customerId:guid}` | `appService.GetInventarioInsumosAsync` | `OperationsLuxuryApp/DeliveryReception/EndPoints/EntregaRecepcionEndpoints.cs` |
| GET | `/api/entrega-recepcion/inventario-herramientas/{customerId:guid}` | `appService.GetInventarioHerramientasAsync` | `OperationsLuxuryApp/DeliveryReception/EndPoints/EntregaRecepcionEndpoints.cs` |
| GET | `/api/entrega-recepcion/inventario-llaves/{customerId:guid}` | `appService.GetInventarioLlavesAsync` | `OperationsLuxuryApp/DeliveryReception/EndPoints/EntregaRecepcionEndpoints.cs` |
| GET | `/api/entrega-recepcion/inventario-mantenimientos/{customerId:guid}` | `appService.GetInventarioMantenimientosAsync` | `OperationsLuxuryApp/DeliveryReception/EndPoints/EntregaRecepcionEndpoints.cs` |
| GET | `/api/entrega-recepcion/organigrama/{customerId:guid}` | `appService.GetOrganigramaAsync` | `OperationsLuxuryApp/DeliveryReception/EndPoints/EntregaRecepcionEndpoints.cs` |
| GET | `/api/entrega-recepcion/extintores/{customerId:guid}` | `appService.GetExtintoresAsync` | `OperationsLuxuryApp/DeliveryReception/EndPoints/EntregaRecepcionEndpoints.cs` |
| GET | `/api/entrega-recepcion/pendientes/{customerId:guid}` | `appService.GetPendientesAsync` | `OperationsLuxuryApp/DeliveryReception/EndPoints/EntregaRecepcionEndpoints.cs` |

#### Modulo: Diagram

- Interfaces: 1 | Servicios: 2 | Endpoints: 5 | DTOs: 3

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IDiagramDrawService | 5 | `OperationsLuxuryApp/Diagram/Interfaces/IDiagramDrawService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| DiagramDrawMapping | 0 | `OperationsLuxuryApp/Diagram/Mapping/DiagramDrawMapping.cs` |
| DiagramDrawService | 5 | `OperationsLuxuryApp/Diagram/Services/DiagramDrawService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetDiagramsAsync | IDiagramDrawService | GET_LIST | `Task<ApiResponseDTO<IEnumerable<DiagramDraw…` | `Guid contextCustomerId, string userRole` |
| GetDiagramByIdAsync | IDiagramDrawService | GET_SINGLE | `Task<ApiResponseDTO<DiagramDrawDTO>>` | `Guid id` |
| CreateDiagramAsync | IDiagramDrawService | CREATE | `Task<ApiResponseDTO<DiagramDrawDTO>>` | `CreateDiagramDrawDTO dto` |
| UpdateDiagramAsync | IDiagramDrawService | UPDATE | `Task<ApiResponseDTO<DiagramDrawDTO>>` | `Guid id, UpdateDiagramDrawDTO dto` |
| DeleteDiagramAsync | IDiagramDrawService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/diagram-draw` | `service.GetDiagramsAsync` | `OperationsLuxuryApp/Diagram/Endpoints/DiagramDrawEndpoints.cs` |
| GET | `/api/diagram-draw/{id:guid}` | `service.GetDiagramByIdAsync` | `OperationsLuxuryApp/Diagram/Endpoints/DiagramDrawEndpoints.cs` |
| POST | `/api/diagram-draw` | `service.CreateDiagramAsync` | `OperationsLuxuryApp/Diagram/Endpoints/DiagramDrawEndpoints.cs` |
| PUT | `/api/diagram-draw/{id:guid}` | `service.UpdateDiagramAsync` | `OperationsLuxuryApp/Diagram/Endpoints/DiagramDrawEndpoints.cs` |
| DELETE | `/api/diagram-draw/{id:guid}` | `service.DeleteDiagramAsync` | `OperationsLuxuryApp/Diagram/Endpoints/DiagramDrawEndpoints.cs` |

#### Modulo: DireccionDashboard

- Interfaces: 5 | Servicios: 5 | Endpoints: 7 | DTOs: 5

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IAgendaSemanalAppService | 2 | `OperationsLuxuryApp/DireccionDashboard/AgendaSemanal/Interfaces/IAgendaSemanalAppService.cs` |
| IContratosLegalAppService | 2 | `OperationsLuxuryApp/DireccionDashboard/ContratosLegal/Interfaces/IContratosLegalAppService.cs` |
| IPersonalAusenteAppService | 1 | `OperationsLuxuryApp/DireccionDashboard/PersonalAusente/Interfaces/IPersonalAusenteAppService.cs` |
| IReclutamientoResumenAppService | 1 | `OperationsLuxuryApp/DireccionDashboard/ReclutamientoResumen/Interfaces/IReclutamientoResumenAppService.cs` |
| ITareasLegalAppService | 1 | `OperationsLuxuryApp/DireccionDashboard/TareasLegal/Interfaces/ITareasLegalAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| AgendaSemanalAppService | 2 | `OperationsLuxuryApp/DireccionDashboard/AgendaSemanal/Services/AgendaSemanalAppService.cs` |
| ContratosLegalAppService | 2 | `OperationsLuxuryApp/DireccionDashboard/ContratosLegal/Services/ContratosLegalAppService.cs` |
| PersonalAusenteAppService | 1 | `OperationsLuxuryApp/DireccionDashboard/PersonalAusente/Services/PersonalAusenteAppService.cs` |
| ReclutamientoResumenAppService | 1 | `OperationsLuxuryApp/DireccionDashboard/ReclutamientoResumen/Services/ReclutamientoResumenAppService.cs` |
| TareasLegalAppService | 1 | `OperationsLuxuryApp/DireccionDashboard/TareasLegal/Services/TareasLegalAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetAgendaSemanalAsync | IAgendaSemanalAppService | GET_LIST | `Task<ApiResponseDTO<List<AgendaSemanalEvent…` | `DateTime? fechaReferencia, CancellationToken cancellationTo…` |
| GetAgendaMesesAsync | IAgendaSemanalAppService | GET_LIST | `Task<ApiResponseDTO<List<AgendaSemanalEvent…` | `int meses, CancellationToken cancellationToken = default` |
| GetContratosPorVencerAsync | IContratosLegalAppService | GET_LIST | `Task<ApiResponseDTO<ContratosPorVencerResum…` | `CancellationToken cancellationToken = default` |
| GetContratosVigentesAsync | IContratosLegalAppService | GET_LIST | `Task<ApiResponseDTO<ContratosVigentesResume…` | `CancellationToken cancellationToken = default` |
| GetPersonalAusenteAsync | IPersonalAusenteAppService | GET_LIST | `Task<ApiResponseDTO<PersonalAusenteResumenD…` | `CancellationToken cancellationToken = default` |
| GetVacantesPendientesAsync | IReclutamientoResumenAppService | GET_LIST | `Task<ApiResponseDTO<VacantesResumenDTO>>` | `CancellationToken cancellationToken = default` |
| GetTareasActivasAsync | ITareasLegalAppService | GET_LIST | `Task<ApiResponseDTO<TareasLegalResumenDTO>>` | `CancellationToken cancellationToken = default` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/direccion-dashboard/agenda-semanal` | `appService.GetAgendaSemanalAsync` | `OperationsLuxuryApp/DireccionDashboard/AgendaSemanal/EndPoints/AgendaSemanalEndpoints.cs` |
| GET | `/api/direccion-dashboard/agenda-meses` | `appService.GetAgendaMesesAsync` | `OperationsLuxuryApp/DireccionDashboard/AgendaSemanal/EndPoints/AgendaSemanalEndpoints.cs` |
| GET | `/api/direccion-dashboard/contratos-por-vencer` | `appService.GetContratosPorVencerAsync` | `OperationsLuxuryApp/DireccionDashboard/ContratosLegal/EndPoints/ContratosLegalEndpoints.cs` |
| GET | `/api/direccion-dashboard/contratos-vigentes` | `appService.GetContratosVigentesAsync` | `OperationsLuxuryApp/DireccionDashboard/ContratosLegal/EndPoints/ContratosLegalEndpoints.cs` |
| GET | `/api/direccion-dashboard/personal-ausente` | `appService.GetPersonalAusenteAsync` | `OperationsLuxuryApp/DireccionDashboard/PersonalAusente/EndPoints/PersonalAusenteEndpoints.cs` |
| GET | `/api/direccion-dashboard/reclutamiento-resumen` | `appService.GetVacantesPendientesAsync` | `OperationsLuxuryApp/DireccionDashboard/ReclutamientoResumen/EndPoints/ReclutamientoResumenEndpoints.cs` |
| GET | `/api/direccion-dashboard/tareas-legal` | `appService.GetTareasActivasAsync` | `OperationsLuxuryApp/DireccionDashboard/TareasLegal/EndPoints/TareasLegalEndpoints.cs` |

#### Modulo: GoogleCalendar

- Interfaces: 2 | Servicios: 2 | Endpoints: 7 | DTOs: 13

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IGoogleCalendarEventAppService | 7 | `OperationsLuxuryApp/GoogleCalendar/Interfaces/IGoogleCalendarEventAppService.cs` |
| IGoogleCalendarService | 4 | `OperationsLuxuryApp/GoogleCalendar/Interfaces/IGoogleCalendarService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| GoogleCalendarEventAppService | 7 | `OperationsLuxuryApp/GoogleCalendar/Services/GoogleCalendarEventAppService.cs` |
| GoogleCalendarService | 4 | `OperationsLuxuryApp/GoogleCalendar/Services/GoogleCalendarService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetByCustomerAsync | IGoogleCalendarEventAppService | GET_LIST | `Task<ApiResponseDTO<List<GoogleCalendarEven…` | `Guid customerId, CancellationToken cancellationToken = defa…` |
| GetByIdAsync | IGoogleCalendarEventAppService | GET_SINGLE | `Task<ApiResponseDTO<GoogleCalendarEventDeta…` | `Guid id, CancellationToken cancellationToken = default` |
| AddAsync | IGoogleCalendarEventAppService | CREATE | `Task<ApiResponseDTO<GoogleCalendarEventDeta…` | `GoogleCalendarEventAddOrEditDTO dto, CancellationToken canc…` |
| UpdateAsync | IGoogleCalendarEventAppService | UPDATE | `Task<ApiResponseDTO<GoogleCalendarEventDeta…` | `Guid id, GoogleCalendarEventAddOrEditDTO dto, CancellationT…` |
| UpdateSeriesAsync | IGoogleCalendarEventAppService | UPDATE | `Task<ApiResponseDTO<GoogleCalendarEventDeta…` | `Guid id, GoogleCalendarEventAddOrEditDTO dto, CancellationT…` |
| DeleteAsync | IGoogleCalendarEventAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id, CancellationToken cancellationToken = default` |
| DeleteSeriesAsync | IGoogleCalendarEventAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id, CancellationToken cancellationToken = default` |
| GetConnectionStatusAsync | IGoogleCalendarService | GET_LIST | `Task<GoogleCalendarConnectionStatusDTO>` | `CancellationToken cancellationToken = default` |
| CreateEventAsync | IGoogleCalendarService | CREATE | `Task<GoogleCalendarSyncResultDTO>` | `GoogleCalendarEventSyncRequestDTO request, CancellationToke…` |
| UpdateEventAsync | IGoogleCalendarService | UPDATE | `Task<GoogleCalendarSyncResultDTO>` | `string googleEventId, GoogleCalendarEventSyncRequestDTO req…` |
| DeleteEventAsync | IGoogleCalendarService | DELETE | `Task` | `string googleEventId, CancellationToken cancellationToken =…` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/google-calendar-events/customer/{customerId:guid}` | `appService.GetByCustomerAsync` | `OperationsLuxuryApp/GoogleCalendar/EndPoints/GoogleCalendarEventsEndpoints.cs` |
| GET | `/api/google-calendar-events/{id:guid}` | `appService.GetByIdAsync` | `OperationsLuxuryApp/GoogleCalendar/EndPoints/GoogleCalendarEventsEndpoints.cs` |
| POST | `/api/google-calendar-events` | `appService.AddAsync` | `OperationsLuxuryApp/GoogleCalendar/EndPoints/GoogleCalendarEventsEndpoints.cs` |
| PUT | `/api/google-calendar-events/{id:guid}` | `appService.UpdateAsync` | `OperationsLuxuryApp/GoogleCalendar/EndPoints/GoogleCalendarEventsEndpoints.cs` |
| PUT | `/api/google-calendar-events/{id:guid}/series` | `appService.UpdateSeriesAsync` | `OperationsLuxuryApp/GoogleCalendar/EndPoints/GoogleCalendarEventsEndpoints.cs` |
| DELETE | `/api/google-calendar-events/{id:guid}` | `appService.DeleteAsync` | `OperationsLuxuryApp/GoogleCalendar/EndPoints/GoogleCalendarEventsEndpoints.cs` |
| DELETE | `/api/google-calendar-events/{id:guid}/series` | `appService.DeleteSeriesAsync` | `OperationsLuxuryApp/GoogleCalendar/EndPoints/GoogleCalendarEventsEndpoints.cs` |

#### Modulo: IncidenciasAdministrativas

- Interfaces: 10 | Servicios: 14 | Endpoints: 40 | DTOs: 21

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IIncidentAppService | 12 | `OperationsLuxuryApp/IncidenciasAdministrativas/HRIncident/Interfaces/IIncidentAppService.cs` |
| IIncidentAttachmentAppService | 3 | `OperationsLuxuryApp/IncidenciasAdministrativas/HRIncident/Interfaces/IIncidentAttachmentAppService.cs` |
| IIncidentPdfService | 3 | `OperationsLuxuryApp/IncidenciasAdministrativas/HRIncident/Interfaces/IIncidentPdfService.cs` |
| IIncidentWitnessAppService | 5 | `OperationsLuxuryApp/IncidenciasAdministrativas/HRIncident/Interfaces/IIncidentWitnessAppService.cs` |
| ISuspensionDayAppService | 3 | `OperationsLuxuryApp/IncidenciasAdministrativas/HRIncident/Interfaces/ISuspensionDayAppService.cs` |
| IIncidentNotificationService | 1 | `OperationsLuxuryApp/IncidenciasAdministrativas/HRIncident/Notifications/IIncidentNotificationService.cs` |
| IIncidentReportAppService | 3 | `OperationsLuxuryApp/IncidenciasAdministrativas/HRIncidentReport/Interfaces/IIncidentReportAppService.cs` |
| ISanctionAppService | 7 | `OperationsLuxuryApp/IncidenciasAdministrativas/HrSanction/Interfaces/ISanctionAppService.cs` |
| ISanctionNotificationService | 1 | `OperationsLuxuryApp/IncidenciasAdministrativas/HrSanction/Notifications/ISanctionNotificationService.cs` |
| IIncidentTypeAppService | 6 | `OperationsLuxuryApp/IncidenciasAdministrativas/IncidentTypes/Interfaces/IIncidentTypeAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| IncidentMappingProfile | 0 | `OperationsLuxuryApp/IncidenciasAdministrativas/HRIncident/Mapping/IncidentMappingProfile.cs` |
| IncidentNotificationService | 1 | `OperationsLuxuryApp/IncidenciasAdministrativas/HRIncident/Notifications/IncidentNotificationService.cs` |
| IncidentAppService | 12 | `OperationsLuxuryApp/IncidenciasAdministrativas/HRIncident/Services/IncidentAppService.cs` |
| IncidentAttachmentAppService | 3 | `OperationsLuxuryApp/IncidenciasAdministrativas/HRIncident/Services/IncidentAttachmentAppService.cs` |
| IncidentPdfService | 3 | `OperationsLuxuryApp/IncidenciasAdministrativas/HRIncident/Services/IncidentPdfService.cs` |
| IncidentWitnessAppService | 5 | `OperationsLuxuryApp/IncidenciasAdministrativas/HRIncident/Services/IncidentWitnessAppService.cs` |
| SuspensionDayAppService | 3 | `OperationsLuxuryApp/IncidenciasAdministrativas/HRIncident/Services/SuspensionDayAppService.cs` |
| HRIncidentReportMappingProfile | 0 | `OperationsLuxuryApp/IncidenciasAdministrativas/HRIncidentReport/Mapping/HRIncidentReportMappingProfile.cs` |
| IncidentReportAppService | 3 | `OperationsLuxuryApp/IncidenciasAdministrativas/HRIncidentReport/Services/IncidentReportAppService.cs` |
| SanctionMappingProfile | 0 | `OperationsLuxuryApp/IncidenciasAdministrativas/HrSanction/Mapping/SanctionMappingProfile.cs` |
| SanctionNotificationService | 1 | `OperationsLuxuryApp/IncidenciasAdministrativas/HrSanction/Notifications/SanctionNotificationService.cs` |
| SanctionAppService | 7 | `OperationsLuxuryApp/IncidenciasAdministrativas/HrSanction/Services/SanctionAppService.cs` |
| IncidentTypeMappingProfile | 0 | `OperationsLuxuryApp/IncidenciasAdministrativas/IncidentTypes/Mapping/IncidentTypeMappingProfile.cs` |
| IncidentTypeAppService | 6 | `OperationsLuxuryApp/IncidenciasAdministrativas/IncidentTypes/Services/IncidentTypeAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetAllAsync | IIncidentAppService | GET_LIST | `Task<ApiResponseDTO<IncidentListDTO[]>>` | `Guid customerId` |
| GetByEmployeeAsync | IIncidentAppService | GET_LIST | `Task<ApiResponseDTO<IncidentListDTO[]>>` | `Guid employeeId, Guid customerId` |
| GetByIdAsync | IIncidentAppService | GET_SINGLE | `Task<ApiResponseDTO<IncidentDetailDTO>>` | `Guid id` |
| AddAsync | IIncidentAppService | CREATE | `Task<ApiResponseDTO<IncidentDetailDTO>>` | `IncidentAddOrEditDTO dto` |
| UpdateAsync | IIncidentAppService | UPDATE | `Task<ApiResponseDTO<IncidentDetailDTO>>` | `Guid id, IncidentAddOrEditDTO dto` |
| ResolveAsync | IIncidentAppService | SPECIAL | `Task<ApiResponseDTO<IncidentDetailDTO>>` | `Guid id, IncidentResolveDTO dto` |
| CancelAsync | IIncidentAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid id, CancelIncidentDTO dto` |
| DeleteAsync | IIncidentAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GeneratePdfAsync | IIncidentAppService | SPECIAL | `Task<byte[]>` | `Guid id` |
| GenerateActAsync | IIncidentAppService | SPECIAL | `Task<byte[]>` | `Guid id` |
| UploadSignedActAsync | IIncidentAppService | SPECIAL | `Task<ApiResponseDTO<IncidentDetailDTO>>` | `Guid id, IFormFile file` |
| GetDashboardAsync | IIncidentAppService | GET_LIST | `Task<ApiResponseDTO<IncidentDashboardDTO>>` | `IncidentDashboardFilterDTO filter` |
| GetByIncidentAsync | IIncidentAttachmentAppService | GET_LIST | `Task<ApiResponseDTO<IncidentAttachmentListD…` | `Guid incidentId` |
| AddAsync | IIncidentAttachmentAppService | CREATE | `Task<ApiResponseDTO<IncidentAttachmentListD…` | `IncidentAttachmentAddDTO dto` |
| DeleteAsync | IIncidentAttachmentAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GeneratePdfAsync | IIncidentPdfService | SPECIAL | `Task<byte[]>` | `Guid incidentId` |
| SavePdfAsync | IIncidentPdfService | SPECIAL | `Task<string>` | `Guid incidentId, string userId, byte[] pdfBytes` |
| SaveSignedActAsync | IIncidentPdfService | SPECIAL | `Task<string>` | `Guid incidentId, string userId, IFormFile file` |
| GetByIncidentAsync | IIncidentWitnessAppService | GET_LIST | `Task<ApiResponseDTO<IncidentWitnessListDTO[…` | `Guid incidentId` |
| GetByIdAsync | IIncidentWitnessAppService | GET_SINGLE | `Task<ApiResponseDTO<IncidentWitnessDetailDT…` | `Guid id` |
| AddAsync | IIncidentWitnessAppService | CREATE | `Task<ApiResponseDTO<IncidentWitnessListDTO>>` | `IncidentWitnessAddOrEditDTO dto` |
| UpdateAsync | IIncidentWitnessAppService | UPDATE | `Task<ApiResponseDTO<IncidentWitnessListDTO>>` | `Guid id, IncidentWitnessAddOrEditDTO dto` |
| DeleteAsync | IIncidentWitnessAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetByIncidentAsync | ISuspensionDayAppService | GET_LIST | `Task<ApiResponseDTO<SuspensionDayDetailDTO[…` | `Guid incidentId` |
| AddBulkAsync | ISuspensionDayAppService | CREATE | `Task<ApiResponseDTO<SuspensionDayDetailDTO[…` | `SuspensionDayAddDTO dto` |
| DeleteAsync | ISuspensionDayAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| NotifyIncidentCreatedAsync | IIncidentNotificationService | SPECIAL | `Task` | `Guid incidentId` |
| GetStatsAsync | IIncidentReportAppService | GET_LIST | `Task<ApiResponseDTO<IncidentStatsDTO>>` | `Guid customerId, IncidentReportFilterDTO filter` |
| GetPendingInvestigationAsync | IIncidentReportAppService | GET_LIST | `Task<ApiResponseDTO<IncidentPendingDTO[]>>` | `Guid customerId` |
| ExportAsync | IIncidentReportAppService | SPECIAL | `Task<FileContentResult>` | `Guid customerId, IncidentReportFilterDTO filter` |
| GetAllAsync | ISanctionAppService | GET_LIST | `Task<ApiResponseDTO<SanctionListDTO[]>>` | `-` |
| GetByEmployeeAsync | ISanctionAppService | GET_LIST | `Task<ApiResponseDTO<SanctionListDTO[]>>` | `Guid employeeId` |
| GetExpiringAsync | ISanctionAppService | GET_LIST | `Task<ApiResponseDTO<SanctionListDTO[]>>` | `int days` |
| GetByIdAsync | ISanctionAppService | GET_SINGLE | `Task<ApiResponseDTO<SanctionDetailDTO>>` | `Guid id` |
| AddAsync | ISanctionAppService | CREATE | `Task<ApiResponseDTO<SanctionDetailDTO>>` | `SanctionAddOrEditDTO dto` |
| ChangeStatusAsync | ISanctionAppService | SPECIAL | `Task<ApiResponseDTO<SanctionDetailDTO>>` | `Guid id, SanctionChangeStatusDTO dto` |
| DeleteAsync | ISanctionAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| NotifySanctionAppliedAsync | ISanctionNotificationService | SPECIAL | `Task` | `Guid sanctionId` |
| GetAllAsync | IIncidentTypeAppService | GET_LIST | `Task<ApiResponseDTO<IncidentTypeListDTO[]>>` | `-` |
| GetByIdAsync | IIncidentTypeAppService | GET_SINGLE | `Task<ApiResponseDTO<IncidentTypeDetailDTO>>` | `Guid id` |
| AddAsync | IIncidentTypeAppService | CREATE | `Task<ApiResponseDTO<IncidentTypeDetailDTO>>` | `IncidentTypeFormDTO dto` |
| UpdateAsync | IIncidentTypeAppService | UPDATE | `Task<ApiResponseDTO<IncidentTypeDetailDTO>>` | `Guid id, IncidentTypeFormDTO dto` |
| DeleteAsync | IIncidentTypeAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| ToggleActiveAsync | IIncidentTypeAppService | SPECIAL | `Task<ApiResponseDTO<IncidentTypeDetailDTO>>` | `Guid id` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/hr/incidents` | `dataService.GetAllAsync` | `OperationsLuxuryApp/IncidenciasAdministrativas/HRIncident/EndPoints/IncidentEndpoints.cs` |
| GET | `/api/hr/incidents/by-employee/{employeeId:guid}/{customerId:guid}` | `dataService.GetByEmployeeAsync` | `OperationsLuxuryApp/IncidenciasAdministrativas/HRIncident/EndPoints/IncidentEndpoints.cs` |
| GET | `/api/hr/incidents/{id:guid}` | `dataService.GetByIdAsync` | `OperationsLuxuryApp/IncidenciasAdministrativas/HRIncident/EndPoints/IncidentEndpoints.cs` |
| POST | `/api/hr/incidents` | `dataService.AddAsync` | `OperationsLuxuryApp/IncidenciasAdministrativas/HRIncident/EndPoints/IncidentEndpoints.cs` |
| PUT | `/api/hr/incidents/{id:guid}` | `dataService.UpdateAsync` | `OperationsLuxuryApp/IncidenciasAdministrativas/HRIncident/EndPoints/IncidentEndpoints.cs` |
| PATCH | `/api/hr/incidents/{id:guid}/resolve` | `dataService.ResolveAsync` | `OperationsLuxuryApp/IncidenciasAdministrativas/HRIncident/EndPoints/IncidentEndpoints.cs` |
| PATCH | `/api/hr/incidents/{id:guid}/cancel` | `dataService.CancelAsync` | `OperationsLuxuryApp/IncidenciasAdministrativas/HRIncident/EndPoints/IncidentEndpoints.cs` |
| DELETE | `/api/hr/incidents/{id:guid}` | `dataService.DeleteAsync` | `OperationsLuxuryApp/IncidenciasAdministrativas/HRIncident/EndPoints/IncidentEndpoints.cs` |
| GET | `/api/hr/incidents/{id:guid}/export-pdf` | `dataService.GeneratePdfAsync` | `OperationsLuxuryApp/IncidenciasAdministrativas/HRIncident/EndPoints/IncidentEndpoints.cs` |
| GET | `/api/hr/incidents/{id:guid}/generate-act` | `dataService.GenerateActAsync` | `OperationsLuxuryApp/IncidenciasAdministrativas/HRIncident/EndPoints/IncidentEndpoints.cs` |
| POST | `/api/hr/incidents/{id:guid}/upload-signed-act` | `dataService.UploadSignedActAsync` | `OperationsLuxuryApp/IncidenciasAdministrativas/HRIncident/EndPoints/IncidentEndpoints.cs` |
| GET | `/api/hr/incidents/{id:guid}/signed-act` | `dataService.GetSignedActStreamAsync` | `OperationsLuxuryApp/IncidenciasAdministrativas/HRIncident/EndPoints/IncidentEndpoints.cs` |
| GET | `/api/hr/incidents/{incidentId:guid}/attachments` | `attachmentService.GetByIncidentAsync` | `OperationsLuxuryApp/IncidenciasAdministrativas/HRIncident/EndPoints/IncidentEndpoints.cs` |
| POST | `/api/hr/incidents/{incidentId:guid}/attachments` | `attachmentService.AddAsync` | `OperationsLuxuryApp/IncidenciasAdministrativas/HRIncident/EndPoints/IncidentEndpoints.cs` |
| DELETE | `/api/hr/incidents/attachments/{attachmentId:guid}` | `attachmentService.DeleteAsync` | `OperationsLuxuryApp/IncidenciasAdministrativas/HRIncident/EndPoints/IncidentEndpoints.cs` |
| GET | `/api/hr/incidents/{incidentId:guid}/witnesses` | `witnessService.GetByIncidentAsync` | `OperationsLuxuryApp/IncidenciasAdministrativas/HRIncident/EndPoints/IncidentEndpoints.cs` |
| GET | `/api/hr/incidents/witnesses/{witnessId:guid}` | `witnessService.GetByIdAsync` | `OperationsLuxuryApp/IncidenciasAdministrativas/HRIncident/EndPoints/IncidentEndpoints.cs` |
| POST | `/api/hr/incidents/{incidentId:guid}/witnesses` | `witnessService.AddAsync` | `OperationsLuxuryApp/IncidenciasAdministrativas/HRIncident/EndPoints/IncidentEndpoints.cs` |
| PUT | `/api/hr/incidents/witnesses/{witnessId:guid}` | `witnessService.UpdateAsync` | `OperationsLuxuryApp/IncidenciasAdministrativas/HRIncident/EndPoints/IncidentEndpoints.cs` |
| DELETE | `/api/hr/incidents/witnesses/{witnessId:guid}` | `witnessService.DeleteAsync` | `OperationsLuxuryApp/IncidenciasAdministrativas/HRIncident/EndPoints/IncidentEndpoints.cs` |
| GET | `/api/hr/incidents/{incidentId:guid}/suspension-days` | `suspensionDayService.GetByIncidentAsync` | `OperationsLuxuryApp/IncidenciasAdministrativas/HRIncident/EndPoints/IncidentEndpoints.cs` |
| POST | `/api/hr/incidents/{incidentId:guid}/suspension-days` | `suspensionDayService.AddBulkAsync` | `OperationsLuxuryApp/IncidenciasAdministrativas/HRIncident/EndPoints/IncidentEndpoints.cs` |
| DELETE | `/api/hr/incidents/suspension-days/{id:guid}` | `suspensionDayService.DeleteAsync` | `OperationsLuxuryApp/IncidenciasAdministrativas/HRIncident/EndPoints/IncidentEndpoints.cs` |
| GET | `/api/hr/incidents/dashboard` | `dataService.GetDashboardAsync` | `OperationsLuxuryApp/IncidenciasAdministrativas/HRIncident/EndPoints/IncidentEndpoints.cs` |
| GET | `/api/hr/incident-report/stats` | `dataService.GetStatsAsync` | `OperationsLuxuryApp/IncidenciasAdministrativas/HRIncidentReport/EndPoints/IncidentReportEndPoints.cs` |
| GET | `/api/hr/incident-report/pending-investigation` | `dataService.GetPendingInvestigationAsync` | `OperationsLuxuryApp/IncidenciasAdministrativas/HRIncidentReport/EndPoints/IncidentReportEndPoints.cs` |
| GET | `/api/hr/incident-report/export` | `dataService.ExportAsync` | `OperationsLuxuryApp/IncidenciasAdministrativas/HRIncidentReport/EndPoints/IncidentReportEndPoints.cs` |
| GET | `/api/hr/sanctions` | `dataService.GetAllAsync` | `OperationsLuxuryApp/IncidenciasAdministrativas/HrSanction/EndPoints/SanctionEndPoints.cs` |
| GET | `/api/hr/sanctions/expiring/{days:int}` | `dataService.GetExpiringAsync` | `OperationsLuxuryApp/IncidenciasAdministrativas/HrSanction/EndPoints/SanctionEndPoints.cs` |
| GET | `/api/hr/sanctions/by-employee/{employeeId:guid}` | `dataService.GetByEmployeeAsync` | `OperationsLuxuryApp/IncidenciasAdministrativas/HrSanction/EndPoints/SanctionEndPoints.cs` |
| GET | `/api/hr/sanctions/{id:guid}` | `dataService.GetByIdAsync` | `OperationsLuxuryApp/IncidenciasAdministrativas/HrSanction/EndPoints/SanctionEndPoints.cs` |
| POST | `/api/hr/sanctions` | `dataService.AddAsync` | `OperationsLuxuryApp/IncidenciasAdministrativas/HrSanction/EndPoints/SanctionEndPoints.cs` |
| PATCH | `/api/hr/sanctions/{id:guid}/change-status` | `dataService.ChangeStatusAsync` | `OperationsLuxuryApp/IncidenciasAdministrativas/HrSanction/EndPoints/SanctionEndPoints.cs` |
| DELETE | `/api/hr/sanctions/{id:guid}` | `dataService.DeleteAsync` | `OperationsLuxuryApp/IncidenciasAdministrativas/HrSanction/EndPoints/SanctionEndPoints.cs` |
| GET | `/api/hr/incident-types` | `dataService.GetAllAsync` | `OperationsLuxuryApp/IncidenciasAdministrativas/IncidentTypes/EndPoints/IncidentTypeEndPoints.cs` |
| GET | `/api/hr/incident-types/{id:guid}` | `dataService.GetByIdAsync` | `OperationsLuxuryApp/IncidenciasAdministrativas/IncidentTypes/EndPoints/IncidentTypeEndPoints.cs` |
| POST | `/api/hr/incident-types` | `dataService.AddAsync` | `OperationsLuxuryApp/IncidenciasAdministrativas/IncidentTypes/EndPoints/IncidentTypeEndPoints.cs` |
| PUT | `/api/hr/incident-types/{id:guid}` | `dataService.UpdateAsync` | `OperationsLuxuryApp/IncidenciasAdministrativas/IncidentTypes/EndPoints/IncidentTypeEndPoints.cs` |
| DELETE | `/api/hr/incident-types/{id:guid}` | `dataService.DeleteAsync` | `OperationsLuxuryApp/IncidenciasAdministrativas/IncidentTypes/EndPoints/IncidentTypeEndPoints.cs` |
| PATCH | `/api/hr/incident-types/{id:guid}/toggle` | `dataService.ToggleActiveAsync` | `OperationsLuxuryApp/IncidenciasAdministrativas/IncidentTypes/EndPoints/IncidentTypeEndPoints.cs` |

#### Modulo: Inspections

- Interfaces: 6 | Servicios: 6 | Endpoints: 24 | DTOs: 18

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| ICatalogInspectionAppService | 5 | `OperationsLuxuryApp/Inspections/Interfaces/ICatalogInspectionAppService.cs` |
| ICustomerInspectionAppService | 5 | `OperationsLuxuryApp/Inspections/Interfaces/ICustomerInspectionAppService.cs` |
| IInspectionAppService | 6 | `OperationsLuxuryApp/Inspections/Interfaces/IInspectionAppService.cs` |
| IInspectionCondominiumAssetAppService | 6 | `OperationsLuxuryApp/Inspections/Interfaces/IInspectionCondominiumAssetAppService.cs` |
| IInspectionResultImageAppService | 3 | `OperationsLuxuryApp/Inspections/Interfaces/IInspectionResultImageAppService.cs` |
| IInspectionReviewsCatalogAppService | 5 | `OperationsLuxuryApp/Inspections/Interfaces/IInspectionReviewsCatalogAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| CatalogInspectionAppService | 5 | `OperationsLuxuryApp/Inspections/Services/CatalogInspectionAppService.cs` |
| CustomerInspectionAppService | 5 | `OperationsLuxuryApp/Inspections/Services/CustomerInspectionAppService.cs` |
| InspectionAppService | 6 | `OperationsLuxuryApp/Inspections/Services/InspectionAppService.cs` |
| InspectionCondominiumAssetAppService | 6 | `OperationsLuxuryApp/Inspections/Services/InspectionCondominiumAssetAppService.cs` |
| InspectionResultImageAppService | 3 | `OperationsLuxuryApp/Inspections/Services/InspectionResultImageAppService.cs` |
| InspectionReviewsCatalogAppService | 5 | `OperationsLuxuryApp/Inspections/Services/InspectionReviewsCatalogAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetByIdAsync | ICatalogInspectionAppService | GET_SINGLE | `Task<ApiResponseDTO<CatalogInspectionDTO>>` | `Guid id` |
| GetAllAsync | ICatalogInspectionAppService | GET_LIST | `Task<ApiResponseDTO<List<CatalogInspectionD…` | `-` |
| AddAsync | ICatalogInspectionAppService | CREATE | `Task<ApiResponseDTO<CatalogInspectionDTO>>` | `CatalogInspectionAddOrEditDTO DTO` |
| UpdateAsync | ICatalogInspectionAppService | UPDATE | `Task<ApiResponseDTO<CatalogInspectionDTO>>` | `Guid id, CatalogInspectionAddOrEditDTO DTO` |
| DeleteByIdAsync | ICatalogInspectionAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetInspectionsByCustomerAsync | ICustomerInspectionAppService | GET_LIST | `Task<ApiResponseDTO<List<CustomerInspection…` | `string applicationUserId, Guid customerId, DateTime date` |
| GetGroupedInspectionDataAsync | ICustomerInspectionAppService | GET_LIST | `Task<ApiResponseDTO<List<GroupedInspectionD…` | `Guid customerInspectionId` |
| UpdateInspectionDataAsync | ICustomerInspectionAppService | UPDATE | `Task<ApiResponseDTO<bool>>` | `Guid customerInspectionId, string applicationUserId, List<I…` |
| GetCustomerInspectionReportDTOAsync | ICustomerInspectionAppService | GET_LIST | `Task<ApiResponseDTO<CustomerInspectionRepor…` | `Guid inspectionId` |
| GetCustomerInspectionReportDateDTOAsync | ICustomerInspectionAppService | GET_LIST | `Task<ApiResponseDTO<CustomerInspectionRepor…` | `Guid inspectionId, DateTime date` |
| GetListInspection | IInspectionAppService | GET_LIST | `Task<ApiResponseDTO<List<Inspection>>>` | `Guid inspectionId` |
| GetAllAsync | IInspectionAppService | GET_LIST | `Task<ApiResponseDTO<List<InspectionListItem…` | `Guid customerId` |
| GetByIdAsync | IInspectionAppService | GET_SINGLE | `Task<ApiResponseDTO<InspectionEditDTO>>` | `Guid id` |
| AddInspectionAsync | IInspectionAppService | CREATE | `Task<ApiResponseDTO<object>>` | `InspectionAddOrEditDTO DTO` |
| UpdateInspectionAsync | IInspectionAppService | UPDATE | `Task<ApiResponseDTO<object>>` | `Guid id, InspectionAddOrEditDTO DTO` |
| AddOrUpdateCondominiumAssetAsync | IInspectionAppService | CREATE | `Task<ApiResponseDTO<object>>` | `InspectionCondominiumAssetAddOrEditDTO DTO` |
| GetInspectionCondominiumAsset | IInspectionCondominiumAssetAppService | GET_LIST | `Task<ApiResponseDTO<object>>` | `Guid id` |
| DeleteInspectionCondominiumAssetAndRelatedDataAsync | IInspectionCondominiumAssetAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| InspectionDetailAsync | IInspectionCondominiumAssetAppService | OTHER | `Task<ApiResponseDTO<object>>` | `Guid inspectionId` |
| GetInspectionCondominiumAssetDTOAsync | IInspectionCondominiumAssetAppService | GET_LIST | `Task<ApiResponseDTO<InspectionCondominiumAs…` | `Guid id` |
| UpdateCondominiumAsset | IInspectionCondominiumAssetAppService | UPDATE | `Task<ApiResponseDTO<object>>` | `Guid id, InspectionCondominiumAssetDTO DTO` |
| DeleteReviewByIdAsync | IInspectionCondominiumAssetAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetListImagesAsync | IInspectionResultImageAppService | GET_LIST | `Task<ApiResponseDTO<List<InspectionImageLis…` | `Guid inspectionResultId, Guid customerId` |
| UpdateInspectionImagesAsync | IInspectionResultImageAppService | UPDATE | `Task<ApiResponseDTO<bool>>` | `Guid inspectionResultId, Guid customerId, List<IFormFile> i…` |
| DeleteInspectionImageAsync | IInspectionResultImageAppService | DELETE | `Task<ApiResponseDTO<InspectionResultImage>>` | `Guid inspectionImageId, Guid customerId` |
| GetAllAsync | IInspectionReviewsCatalogAppService | GET_LIST | `Task<ApiResponseDTO<List<InspectionReviewsC…` | `-` |
| GetByIdAsync | IInspectionReviewsCatalogAppService | GET_SINGLE | `Task<ApiResponseDTO<InspectionReviewsCatalo…` | `Guid id` |
| AddAsync | IInspectionReviewsCatalogAppService | CREATE | `Task<ApiResponseDTO<InspectionReviewsCatalo…` | `InspectionReviewsCatalog DTO` |
| UpdateAsync | IInspectionReviewsCatalogAppService | UPDATE | `Task<ApiResponseDTO<InspectionReviewsCatalo…` | `Guid id, InspectionReviewsCatalog DTO` |
| DeleteByIdAsync | IInspectionReviewsCatalogAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/inspection-condominium-asset/list/{inspectionId:guid}` | `appService.InspectionDetailAsync` | `OperationsLuxuryApp/Inspections/EndPoints/InspectionCondominiumAssetEndpoints.cs` |
| GET | `/api/inspection-condominium-asset/condominium-asset/{id:guid}` | `appService.GetInspectionCondominiumAssetDTOAsync` | `OperationsLuxuryApp/Inspections/EndPoints/InspectionCondominiumAssetEndpoints.cs` |
| GET | `/api/inspection-condominium-asset/{id:guid}` | `appService.GetInspectionCondominiumAssetDTOAsync` | `OperationsLuxuryApp/Inspections/EndPoints/InspectionCondominiumAssetEndpoints.cs` |
| PUT | `/api/inspection-condominium-asset/{id:guid}` | `appService.DeleteReviewByIdAsync` | `OperationsLuxuryApp/Inspections/EndPoints/InspectionCondominiumAssetEndpoints.cs` |
| DELETE | `/api/inspection-condominium-asset/delete-review/{id:guid}` | `appService.DeleteReviewByIdAsync` | `OperationsLuxuryApp/Inspections/EndPoints/InspectionCondominiumAssetEndpoints.cs` |
| DELETE | `/api/inspection-condominium-asset/delete-area/{id:guid}` | `appService.DeleteInspectionCondominiumAssetAndRelatedDataAsync` | `OperationsLuxuryApp/Inspections/EndPoints/InspectionCondominiumAssetEndpoints.cs` |
| GET | `/api/inspection/list/{customerId:guid}` | `appService.GetAllAsync` | `OperationsLuxuryApp/Inspections/EndPoints/InspectionEndpoints.cs` |
| GET | `/api/inspection/{id:guid}` | `appService.AddInspectionAsync` | `OperationsLuxuryApp/Inspections/EndPoints/InspectionEndpoints.cs` |
| POST | `/api/inspection` | `appService.AddInspectionAsync` | `OperationsLuxuryApp/Inspections/EndPoints/InspectionEndpoints.cs` |
| PUT | `/api/inspection/{id:guid}` | `appService.UpdateInspectionAsync` | `OperationsLuxuryApp/Inspections/EndPoints/InspectionEndpoints.cs` |
| POST | `/api/inspection/add-or-update-condominium-asset` | `appService.AddOrUpdateCondominiumAssetAsync` | `OperationsLuxuryApp/Inspections/EndPoints/InspectionEndpoints.cs` |
| GET | `/api/inspection-result/get-inspections-by-customer/{applicationUserId}/{customerId:guid}/{date}` | `appService.GetInspectionsByCustomerAsync` | `OperationsLuxuryApp/Inspections/EndPoints/InspectionResultEndpoints.cs` |
| GET | `/api/inspection-result/inspection-result-get-by-id/{customerInspectionId:guid}` | `appService.GetGroupedInspectionDataAsync` | `OperationsLuxuryApp/Inspections/EndPoints/InspectionResultEndpoints.cs` |
| POST | `/api/inspection-result/update-inspection-data/{customerInspectionId:guid}/{applicationUserId}` | `appService.UpdateInspectionDataAsync` | `OperationsLuxuryApp/Inspections/EndPoints/InspectionResultEndpoints.cs` |
| GET | `/api/inspection-result/report/{inspectionId:guid}` | `appService.GetCustomerInspectionReportDTOAsync` | `OperationsLuxuryApp/Inspections/EndPoints/InspectionResultEndpoints.cs` |
| GET | `/api/inspection-result/report/{inspectionId:guid}/{date}` | `appService.GetCustomerInspectionReportDateDTOAsync` | `OperationsLuxuryApp/Inspections/EndPoints/InspectionResultEndpoints.cs` |
| GET | `/api/inspection-result-images/{inspectionResultId:guid}/{customerId:guid}` | `appService.GetListImagesAsync` | `OperationsLuxuryApp/Inspections/EndPoints/InspectionResultImagesEndpoints.cs` |
| POST | `/api/inspection-result-images/{inspectionResultId:guid}/{customerId:guid}` | `appService.UpdateInspectionImagesAsync` | `OperationsLuxuryApp/Inspections/EndPoints/InspectionResultImagesEndpoints.cs` |
| DELETE | `/api/inspection-result-images/{inspectionImageId:guid}/{customerId:guid}` | `appService.DeleteInspectionImageAsync` | `OperationsLuxuryApp/Inspections/EndPoints/InspectionResultImagesEndpoints.cs` |
| GET | `/api/inspection-reviews-catalog` | `appService.GetAllAsync` | `OperationsLuxuryApp/Inspections/EndPoints/InspectionReviewsCatalogEndpoints.cs` |
| GET | `/api/inspection-reviews-catalog/{id:guid}` | `appService.GetByIdAsync` | `OperationsLuxuryApp/Inspections/EndPoints/InspectionReviewsCatalogEndpoints.cs` |
| POST | `/api/inspection-reviews-catalog` | `appService.AddAsync` | `OperationsLuxuryApp/Inspections/EndPoints/InspectionReviewsCatalogEndpoints.cs` |
| PUT | `/api/inspection-reviews-catalog/{id:guid}` | `appService.UpdateAsync` | `OperationsLuxuryApp/Inspections/EndPoints/InspectionReviewsCatalogEndpoints.cs` |
| DELETE | `/api/inspection-reviews-catalog/{id:guid}` | `appService.DeleteByIdAsync` | `OperationsLuxuryApp/Inspections/EndPoints/InspectionReviewsCatalogEndpoints.cs` |

#### Modulo: Inventory

- Interfaces: 10 | Servicios: 19 | Endpoints: 62 | DTOs: 25

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IAlmacenAppService | 7 | `OperationsLuxuryApp/Inventory/Interfaces/IAlmacenAppService.cs` |
| IEntradaProductoAppService | 6 | `OperationsLuxuryApp/Inventory/Interfaces/IEntradaProductoAppService.cs` |
| IProductAppService | 8 | `OperationsLuxuryApp/Inventory/Interfaces/IProductAppService.cs` |
| ISalidaProductoAppService | 7 | `OperationsLuxuryApp/Inventory/Interfaces/ISalidaProductoAppService.cs` |
| IStockPorAlmacenAppService | 9 | `OperationsLuxuryApp/Inventory/Interfaces/IStockPorAlmacenAppService.cs` |
| IWarehouseAuthorizationService | 1 | `OperationsLuxuryApp/Inventory/Interfaces/IWarehouseAuthorizationService.cs` |
| IInventarioLlaveAppService | 5 | `OperationsLuxuryApp/Inventory/KeyInventories/Interfaces/IInventarioLlaveAppService.cs` |
| IInventarioIluminacionAppService | 5 | `OperationsLuxuryApp/Inventory/LightingInventory/Interfaces/IInventarioIluminacionAppService.cs` |
| IInventarioPinturaAppService | 5 | `OperationsLuxuryApp/Inventory/PaintInventory/Interfaces/IInventarioPinturaAppService.cs` |
| IRadioComunicacionAppService | 5 | `OperationsLuxuryApp/Inventory/RadiosComunicacion/Interfaces/IRadioComunicacionAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| InventarioLlaveMapper | 0 | `OperationsLuxuryApp/Inventory/KeyInventories/Mapping/InventarioLlaveMapper.cs` |
| InventarioLlaveAppService | 5 | `OperationsLuxuryApp/Inventory/KeyInventories/Services/InventarioLlaveAppService.cs` |
| InventarioIluminacionMapper | 0 | `OperationsLuxuryApp/Inventory/LightingInventory/Mapping/InventarioIluminacionMapper.cs` |
| InventarioIluminacionAppService | 5 | `OperationsLuxuryApp/Inventory/LightingInventory/Services/InventarioIluminacionAppService.cs` |
| AlmacenMapper | 0 | `OperationsLuxuryApp/Inventory/Mapping/AlmacenMapper.cs` |
| EntradaProductoMapper | 0 | `OperationsLuxuryApp/Inventory/Mapping/EntradaProductoMapper.cs` |
| ProductoMapper | 0 | `OperationsLuxuryApp/Inventory/Mapping/ProductoMapper.cs` |
| SalidaProductoMapper | 0 | `OperationsLuxuryApp/Inventory/Mapping/SalidaProductoMapper.cs` |
| StockPorAlmacenMapper | 0 | `OperationsLuxuryApp/Inventory/Mapping/StockPorAlmacenMapper.cs` |
| InventarioPinturaMapper | 0 | `OperationsLuxuryApp/Inventory/PaintInventory/Mapping/InventarioPinturaMapper.cs` |
| InventarioPinturaAppService | 5 | `OperationsLuxuryApp/Inventory/PaintInventory/Services/InventarioPinturaAppService.cs` |
| RadioComunicacionMapper | 0 | `OperationsLuxuryApp/Inventory/RadiosComunicacion/Mapping/RadioComunicacionMapper.cs` |
| RadioComunicacionAppService | 5 | `OperationsLuxuryApp/Inventory/RadiosComunicacion/Services/RadioComunicacionAppService.cs` |
| AlmacenAppService | 7 | `OperationsLuxuryApp/Inventory/Services/AlmacenAppService.cs` |
| EntradaProductoAppService | 6 | `OperationsLuxuryApp/Inventory/Services/EntradaProductoAppService.cs` |
| ProductAppService | 8 | `OperationsLuxuryApp/Inventory/Services/ProductAppService.cs` |
| SalidaProductoAppService | 7 | `OperationsLuxuryApp/Inventory/Services/SalidaProductoAppService.cs` |
| StockPorAlmacenAppService | 9 | `OperationsLuxuryApp/Inventory/Services/StockPorAlmacenAppService.cs` |
| WarehouseAuthorizationService | 1 | `OperationsLuxuryApp/Inventory/Services/WarehouseAuthorizationService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetAllByCustomerAsync | IAlmacenAppService | GET_LIST | `Task<ApiResponseDTO<List<AlmacenDTO>>>` | `Guid customerId` |
| GetAllForCurrentUserAsync | IAlmacenAppService | GET_LIST | `Task<ApiResponseDTO<List<AlmacenDTO>>>` | `Guid customerId` |
| GetByIdAsync | IAlmacenAppService | GET_SINGLE | `Task<ApiResponseDTO<AlmacenDTO>>` | `Guid id` |
| AddAsync | IAlmacenAppService | CREATE | `Task<ApiResponseDTO<AlmacenDTO>>` | `AlmacenAddOrEditDTO DTO` |
| UpdateAsync | IAlmacenAppService | UPDATE | `Task<ApiResponseDTO<AlmacenDTO>>` | `Guid id, AlmacenAddOrEditDTO DTO` |
| DeleteAsync | IAlmacenAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| AsignarResponsablesAsync | IAlmacenAppService | SPECIAL | `Task<ApiResponseDTO<object>>` | `AsignarResponsablesDTO DTO` |
| GetByIdAsync | IEntradaProductoAppService | GET_SINGLE | `Task<ApiResponseDTO<EntradaProductoDTO>>` | `Guid id` |
| GetAllByCustomerAsync | IEntradaProductoAppService | GET_LIST | `Task<ApiResponseDTO<EntradaProductoDTO[]>>` | `Guid customerId` |
| GetResumenByCustomerAndPeriodoAsync | IEntradaProductoAppService | GET_LIST | `Task<ApiResponseDTO<object>>` | `Guid customerId, DateTime periodo` |
| AddAsync | IEntradaProductoAppService | CREATE | `Task<ApiResponseDTO<EntradaProductoDTO>>` | `EntradaProductoAddOrEditDTO DTO` |
| UpdateAsync | IEntradaProductoAppService | UPDATE | `Task<ApiResponseDTO<EntradaProductoDTO>>` | `Guid id, int cantidadActual, EntradaProductoAddOrEditDTO DTO` |
| DeleteAsync | IEntradaProductoAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetProductsAsync | IProductAppService | GET_LIST | `Task<ApiResponseDTO<ProductoIndexDTO[]>>` | `-` |
| GetProductsPagedAsync | IProductAppService | GET_LIST | `Task<ApiResponseDTO<PagedResultDTO<Producto…` | `PaginationCommonDTO pagination` |
| GetProductAsync | IProductAppService | GET_LIST | `Task<ApiResponseDTO<ProductoDTO>>` | `Guid id` |
| AddAsync | IProductAppService | CREATE | `Task<ApiResponseDTO<Producto>>` | `ProductoAddOrEditDTO DTO` |
| UpdateAsync | IProductAppService | UPDATE | `Task<ApiResponseDTO<Producto>>` | `Guid id, ProductoAddOrEditDTO DTO` |
| DeleteAsync | IProductAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetMachinerySelectItemAsync | IProductAppService | GET_LIST | `Task<ApiResponseDTO<SelectItemDTO<Guid>>>` | `int id` |
| GetAutoCompleteSelectItemAsync | IProductAppService | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<Guid…` | `-` |
| GetByIdAsync | ISalidaProductoAppService | GET_SINGLE | `Task<ApiResponseDTO<SalidaProductoDTO>>` | `Guid id` |
| GetPagedByCustomerIdAsync | ISalidaProductoAppService | GET_LIST | `Task<ApiResponseDTO<PagedResultDTO<SalidaPr…` | `Guid customerId, PaginationCommonDTO pagination, int? month…` |
| GenerateReportAsync | ISalidaProductoAppService | SPECIAL | `Task<ApiResponseDTO<byte[]>>` | `Guid customerId, int? month, int? year` |
| AddAsync | ISalidaProductoAppService | CREATE | `Task<ApiResponseDTO<SalidaProducto>>` | `SalidaProductoAddOrEditDTO DTO` |
| UpdateAsync | ISalidaProductoAppService | UPDATE | `Task<ApiResponseDTO<SalidaProducto>>` | `Guid id, int cantidadActual, SalidaProductoAddOrEditDTO DTO` |
| DeleteAsync | ISalidaProductoAppService | DELETE | `Task<ApiResponseDTO<SalidaProducto>>` | `Guid id` |
| RealizarDevolucionAsync | ISalidaProductoAppService | OTHER | `Task<ApiResponseDTO<bool>>` | `DevolucionProductoDTO DTO` |
| GetByIdAsync | IStockPorAlmacenAppService | GET_SINGLE | `Task<ApiResponseDTO<StockPorAlmacenDTO>>` | `Guid id` |
| GetProductoDropdownDTOAsync | IStockPorAlmacenAppService | GET_LIST | `Task<ApiResponseDTO<List<ProductoListAddDTO…` | `Guid customerId, Guid almacenId` |
| GetProductoDropdownPagedAsync | IStockPorAlmacenAppService | GET_LIST | `Task<ApiResponseDTO<ProductoDropdownListDTO…` | `PaginationCommonDTO paginator, Guid customerId, Guid almace…` |
| GetAllInventarioProductoAsync | IStockPorAlmacenAppService | GET_LIST | `Task<ApiResponseDTO<List<StockPorAlmacenInd…` | `Guid customerId, Guid almacenId` |
| GetAllInventarioProductoPagedAsync | IStockPorAlmacenAppService | GET_LIST | `Task<ApiResponseDTO<PagedResultDTO<StockPor…` | `PaginationCommonDTO pagination, Guid customerId, Guid almac…` |
| AddAsync | IStockPorAlmacenAppService | CREATE | `Task<ApiResponseDTO<WarehouseStock>>` | `StockPorAlmacenAddOrEditDTO DTO` |
| UpdateAsync | IStockPorAlmacenAppService | UPDATE | `Task<ApiResponseDTO<WarehouseStock>>` | `Guid id, StockPorAlmacenAddOrEditDTO DTO` |
| DeleteByIdAsync | IStockPorAlmacenAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetExistenciaProductoAsync | IStockPorAlmacenAppService | GET_LIST | `Task<ApiResponseDTO<StockPorAlmacenDTO>>` | `Guid customerId, Guid ProductoId, Guid almacenId` |
| IsUserAuthorizedForWarehouseAsync | IWarehouseAuthorizationService | GET_SINGLE | `Task<bool>` | `string userId, Guid almacenId` |
| GetByIdAsync | IInventarioLlaveAppService | GET_SINGLE | `Task<ApiResponseDTO<InventarioLlaveDTO>>` | `Guid id` |
| GetAllAsync | IInventarioLlaveAppService | GET_LIST | `Task<ApiResponseDTO<InventarioLlaveDTO[]>>` | `Guid customerId` |
| AddAsync | IInventarioLlaveAppService | CREATE | `Task<ApiResponseDTO<KeyInventory>>` | `InventarioLlaveAddOrEditDTO DTO` |
| UpdateAsync | IInventarioLlaveAppService | UPDATE | `Task<ApiResponseDTO<KeyInventory>>` | `Guid id, InventarioLlaveAddOrEditDTO DTO` |
| DeleteByIdAsync | IInventarioLlaveAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetByIdAsync | IInventarioIluminacionAppService | GET_SINGLE | `Task<ApiResponseDTO<InventarioIluminacionDT…` | `Guid id` |
| GetAllAsync | IInventarioIluminacionAppService | GET_LIST | `Task<ApiResponseDTO<object>>` | `Guid customerId` |
| AddAsync | IInventarioIluminacionAppService | CREATE | `Task<ApiResponseDTO<LightingStock>>` | `InventarioIluminacionAddOrEditDTO DTO` |
| UpdateAsync | IInventarioIluminacionAppService | UPDATE | `Task<ApiResponseDTO<LightingStock>>` | `Guid id, InventarioIluminacionAddOrEditDTO DTO` |
| DeleteByIdAsync | IInventarioIluminacionAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetByIdAsync | IInventarioPinturaAppService | GET_SINGLE | `Task<ApiResponseDTO<InventarioPinturaDTO>>` | `Guid id` |
| GetAllAsync | IInventarioPinturaAppService | GET_LIST | `Task<ApiResponseDTO<object>>` | `Guid customerId` |
| AddAsync | IInventarioPinturaAppService | CREATE | `Task<ApiResponseDTO<PaintStock>>` | `InventarioPinturaAddOrEditDTO DTO` |
| UpdateAsync | IInventarioPinturaAppService | UPDATE | `Task<ApiResponseDTO<PaintStock>>` | `Guid id, InventarioPinturaAddOrEditDTO DTO` |
| DeleteByIdAsync | IInventarioPinturaAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetByIdAsync | IRadioComunicacionAppService | GET_SINGLE | `Task<ApiResponseDTO<RadioComunicacionItemDT…` | `Guid id` |
| GetAllAsync | IRadioComunicacionAppService | GET_LIST | `Task<ApiResponseDTO<RadioComunicacionDTO[]>>` | `Guid customerId` |
| AddAsync | IRadioComunicacionAppService | CREATE | `Task<ApiResponseDTO<RadioComunicacion>>` | `RadioComunicacionAddOrEditDTO DTO` |
| UpdateAsync | IRadioComunicacionAppService | UPDATE | `Task<ApiResponseDTO<RadioComunicacion>>` | `Guid id, RadioComunicacionAddOrEditDTO DTO` |
| DeleteAsync | IRadioComunicacionAppService | DELETE | `Task<ApiResponseDTO<RadioComunicacion>>` | `Guid id` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/almacen/customer/{customerId:guid}` | `appService.GetAllByCustomerAsync` | `OperationsLuxuryApp/Inventory/EndPoints/AlmacenEndpoints.cs` |
| GET | `/api/almacen/my-warehouses/{customerId:guid}` | `appService.GetAllForCurrentUserAsync` | `OperationsLuxuryApp/Inventory/EndPoints/AlmacenEndpoints.cs` |
| GET | `/api/almacen/{id:guid}` | `appService.GetByIdAsync` | `OperationsLuxuryApp/Inventory/EndPoints/AlmacenEndpoints.cs` |
| POST | `/api/almacen` | `appService.AddAsync` | `OperationsLuxuryApp/Inventory/EndPoints/AlmacenEndpoints.cs` |
| PUT | `/api/almacen/{id:guid}` | `appService.UpdateAsync` | `OperationsLuxuryApp/Inventory/EndPoints/AlmacenEndpoints.cs` |
| DELETE | `/api/almacen/{id:guid}` | `appService.DeleteAsync` | `OperationsLuxuryApp/Inventory/EndPoints/AlmacenEndpoints.cs` |
| PUT | `/api/almacen/assign-responsibles` | `appService.AsignarResponsablesAsync` | `OperationsLuxuryApp/Inventory/EndPoints/AlmacenEndpoints.cs` |
| GET | `/api/entrada-producto/{id:guid}` | `appService.GetByIdAsync` | `OperationsLuxuryApp/Inventory/EndPoints/EntradaProductoEndpoints.cs` |
| GET | `/api/entrada-producto/get-entrada-productos/{customerId:guid}` | `appService.GetAllByCustomerAsync` | `OperationsLuxuryApp/Inventory/EndPoints/EntradaProductoEndpoints.cs` |
| POST | `/api/entrada-producto` | `appService.AddAsync` | `OperationsLuxuryApp/Inventory/EndPoints/EntradaProductoEndpoints.cs` |
| PUT | `/api/entrada-producto/{id:guid}/{cantidadActual:int}` | `appService.UpdateAsync` | `OperationsLuxuryApp/Inventory/EndPoints/EntradaProductoEndpoints.cs` |
| DELETE | `/api/entrada-producto/{id:guid}` | `appService.DeleteAsync` | `OperationsLuxuryApp/Inventory/EndPoints/EntradaProductoEndpoints.cs` |
| GET | `/api/inventario-producto/{id:guid}` | `appService.GetByIdAsync` | `OperationsLuxuryApp/Inventory/EndPoints/InventarioProductoEndpoints.cs` |
| GET | `/api/inventario-producto/get-existencia-producto/{customerId:guid}/{productoId:guid}/{almacenId:guid}` | `appService.GetExistenciaProductoAsync` | `OperationsLuxuryApp/Inventory/EndPoints/InventarioProductoEndpoints.cs` |
| GET | `/api/inventario-producto/get-producto-dropdown-dto/{customerId:guid}/{almacenId:guid}` | `appService.GetProductoDropdownDTOAsync` | `OperationsLuxuryApp/Inventory/EndPoints/InventarioProductoEndpoints.cs` |
| GET | `/api/inventario-producto/get-producto-dropdown-paged` | `appService.GetProductoDropdownPagedAsync` | `OperationsLuxuryApp/Inventory/EndPoints/InventarioProductoEndpoints.cs` |
| GET | `/api/inventario-producto/get-async-all/{customerId:guid}/{almacenId:guid}` | `appService.GetAllInventarioProductoAsync` | `OperationsLuxuryApp/Inventory/EndPoints/InventarioProductoEndpoints.cs` |
| GET | `/api/inventario-producto/get-async-all-paged/{customerId:guid}/{almacenId:guid}` | `appService.GetAllInventarioProductoPagedAsync` | `OperationsLuxuryApp/Inventory/EndPoints/InventarioProductoEndpoints.cs` |
| POST | `/api/inventario-producto` | `appService.AddAsync` | `OperationsLuxuryApp/Inventory/EndPoints/InventarioProductoEndpoints.cs` |
| PUT | `/api/inventario-producto/{id:guid}` | `appService.UpdateAsync` | `OperationsLuxuryApp/Inventory/EndPoints/InventarioProductoEndpoints.cs` |
| DELETE | `/api/inventario-producto/{id:guid}` | `appService.DeleteByIdAsync` | `OperationsLuxuryApp/Inventory/EndPoints/InventarioProductoEndpoints.cs` |
| GET | `/api/productos` | `appService.GetProductsAsync` | `OperationsLuxuryApp/Inventory/EndPoints/ProductosEndpoints.cs` |
| GET | `/api/productos/paged` | `appService.GetProductsPagedAsync` | `OperationsLuxuryApp/Inventory/EndPoints/ProductosEndpoints.cs` |
| GET | `/api/productos/{id:guid}` | `appService.GetProductAsync` | `OperationsLuxuryApp/Inventory/EndPoints/ProductosEndpoints.cs` |
| POST | `/api/productos` | `appService.AddAsync` | `OperationsLuxuryApp/Inventory/EndPoints/ProductosEndpoints.cs` |
| PUT | `/api/productos/{id:guid}` | `appService.UpdateAsync` | `OperationsLuxuryApp/Inventory/EndPoints/ProductosEndpoints.cs` |
| DELETE | `/api/productos/{id:guid}` | `appService.DeleteAsync` | `OperationsLuxuryApp/Inventory/EndPoints/ProductosEndpoints.cs` |
| GET | `/api/productos/get-select-item/{id:int}` | `appService.GetMachinerySelectItemAsync` | `OperationsLuxuryApp/Inventory/EndPoints/ProductosEndpoints.cs` |
| GET | `/api/productos/get-auto-complete-select-item` | `appService.GetAutoCompleteSelectItemAsync` | `OperationsLuxuryApp/Inventory/EndPoints/ProductosEndpoints.cs` |
| GET | `/api/salidas-productos/{id:guid}` | `appService.GetByIdAsync` | `OperationsLuxuryApp/Inventory/EndPoints/SalidasProductosEndpoints.cs` |
| GET | `/api/salidas-productos/get-paged-list` | `appService.GetPagedByCustomerIdAsync` | `OperationsLuxuryApp/Inventory/EndPoints/SalidasProductosEndpoints.cs` |
| POST | `/api/salidas-productos` | `appService.AddAsync` | `OperationsLuxuryApp/Inventory/EndPoints/SalidasProductosEndpoints.cs` |
| PUT | `/api/salidas-productos/{id:guid}/{cantidadActual:int}` | `appService.UpdateAsync` | `OperationsLuxuryApp/Inventory/EndPoints/SalidasProductosEndpoints.cs` |
| DELETE | `/api/salidas-productos/{id:guid}` | `appService.DeleteAsync` | `OperationsLuxuryApp/Inventory/EndPoints/SalidasProductosEndpoints.cs` |
| POST | `/api/salidas-productos/devolver` | `appService.RealizarDevolucionAsync` | `OperationsLuxuryApp/Inventory/EndPoints/SalidasProductosEndpoints.cs` |
| GET | `/api/salidas-productos/reporte` | `appService.GenerateReportAsync` | `OperationsLuxuryApp/Inventory/EndPoints/SalidasProductosEndpoints.cs` |
| GET | `/api/inventory-engine-system/list/{customerId:guid}` | `appService.ListEngineSystemsAsync` | `OperationsLuxuryApp/Inventory/InventoryEngine/EndPoints/InventoryEngineSystemEndpoints.cs` |
| GET | `/api/inventario-llave/{id:guid}` | `appService.GetByIdAsync` | `OperationsLuxuryApp/Inventory/KeyInventories/EndPoints/InventarioLlaveEndpoints.cs` |
| GET | `/api/inventario-llave/list/{customerId:guid}` | `appService.GetAllAsync` | `OperationsLuxuryApp/Inventory/KeyInventories/EndPoints/InventarioLlaveEndpoints.cs` |
| POST | `/api/inventario-llave` | `appService.AddAsync` | `OperationsLuxuryApp/Inventory/KeyInventories/EndPoints/InventarioLlaveEndpoints.cs` |
| PUT | `/api/inventario-llave/{id:guid}` | `appService.UpdateAsync` | `OperationsLuxuryApp/Inventory/KeyInventories/EndPoints/InventarioLlaveEndpoints.cs` |
| DELETE | `/api/inventario-llave/{id:guid}` | `appService.DeleteByIdAsync` | `OperationsLuxuryApp/Inventory/KeyInventories/EndPoints/InventarioLlaveEndpoints.cs` |
| GET | `/api/inventario-iluminacion/{id:guid}` | `appService.GetByIdAsync` | `OperationsLuxuryApp/Inventory/LightingInventory/EndPoints/InventarioIluminacionEndpoints.cs` |
| GET | `/api/inventario-iluminacion/list/{customerId:guid}` | `appService.GetAllAsync` | `OperationsLuxuryApp/Inventory/LightingInventory/EndPoints/InventarioIluminacionEndpoints.cs` |
| POST | `/api/inventario-iluminacion` | `appService.AddAsync` | `OperationsLuxuryApp/Inventory/LightingInventory/EndPoints/InventarioIluminacionEndpoints.cs` |
| PUT | `/api/inventario-iluminacion/{id:guid}` | `appService.UpdateAsync` | `OperationsLuxuryApp/Inventory/LightingInventory/EndPoints/InventarioIluminacionEndpoints.cs` |
| DELETE | `/api/inventario-iluminacion/{id:guid}` | `appService.DeleteByIdAsync` | `OperationsLuxuryApp/Inventory/LightingInventory/EndPoints/InventarioIluminacionEndpoints.cs` |
| GET | `/api/inventario-pintura/{id:guid}` | `appService.GetByIdAsync` | `OperationsLuxuryApp/Inventory/PaintInventory/EndPoints/InventarioPinturaEndpoints.cs` |
| GET | `/api/inventario-pintura/list/{customerId:guid}` | `appService.GetAllAsync` | `OperationsLuxuryApp/Inventory/PaintInventory/EndPoints/InventarioPinturaEndpoints.cs` |
| POST | `/api/inventario-pintura` | `appService.AddAsync` | `OperationsLuxuryApp/Inventory/PaintInventory/EndPoints/InventarioPinturaEndpoints.cs` |
| PUT | `/api/inventario-pintura/{id:guid}` | `appService.UpdateAsync` | `OperationsLuxuryApp/Inventory/PaintInventory/EndPoints/InventarioPinturaEndpoints.cs` |
| DELETE | `/api/inventario-pintura/{id:guid}` | `appService.DeleteByIdAsync` | `OperationsLuxuryApp/Inventory/PaintInventory/EndPoints/InventarioPinturaEndpoints.cs` |
| GET | `/api/radios-comunicacion/{id:guid}` | `appService.GetByIdAsync` | `OperationsLuxuryApp/Inventory/RadiosComunicacion/EndPoints/RadiosComunicacionEndpoints.cs` |
| GET | `/api/radios-comunicacion/list/{customerId:guid}` | `appService.GetAllAsync` | `OperationsLuxuryApp/Inventory/RadiosComunicacion/EndPoints/RadiosComunicacionEndpoints.cs` |
| POST | `/api/radios-comunicacion` | `appService.AddAsync` | `OperationsLuxuryApp/Inventory/RadiosComunicacion/EndPoints/RadiosComunicacionEndpoints.cs` |
| PUT | `/api/radios-comunicacion/{id:guid}` | `appService.UpdateAsync` | `OperationsLuxuryApp/Inventory/RadiosComunicacion/EndPoints/RadiosComunicacionEndpoints.cs` |
| DELETE | `/api/radios-comunicacion/{id:guid}` | `appService.DeleteAsync` | `OperationsLuxuryApp/Inventory/RadiosComunicacion/EndPoints/RadiosComunicacionEndpoints.cs` |
| GET | `/api/tools/get/{id:guid}` | `dataService.GetByIdAsync` | `OperationsLuxuryApp/Inventory/Tools/EndPoints/ToolsEndpoints.cs` |
| GET | `/api/tools/{customerId:guid}` | `dataService.GetAllAsync` | `OperationsLuxuryApp/Inventory/Tools/EndPoints/ToolsEndpoints.cs` |
| POST | `/api/tools` | `dataService.AddAsync` | `OperationsLuxuryApp/Inventory/Tools/EndPoints/ToolsEndpoints.cs` |
| PUT | `/api/tools/{id:guid}` | `dataService.UpdateAsync` | `OperationsLuxuryApp/Inventory/Tools/EndPoints/ToolsEndpoints.cs` |
| DELETE | `/api/tools/{id:guid}` | `dataService.DeleteAsync` | `OperationsLuxuryApp/Inventory/Tools/EndPoints/ToolsEndpoints.cs` |

#### Modulo: JuntasMensuales

- Interfaces: 11 | Servicios: 12 | Endpoints: 60 | DTOs: 46

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IJuntaMensualSessionBackfillAppService | 2 | `OperationsLuxuryApp/JuntasMensuales/Backfill/Interfaces/IJuntaMensualSessionBackfillAppService.cs` |
| IMeetingAdministracionAppService | 3 | `OperationsLuxuryApp/JuntasMensuales/Minuta/Interfaces/IMeetingAdministracionAppService.cs` |
| IMeetingAppService | 13 | `OperationsLuxuryApp/JuntasMensuales/Minuta/Interfaces/IMeetingAppService.cs` |
| IMeetingComiteAppService | 3 | `OperationsLuxuryApp/JuntasMensuales/Minuta/Interfaces/IMeetingComiteAppService.cs` |
| IMeetingDetailsAppService | 7 | `OperationsLuxuryApp/JuntasMensuales/Minuta/Interfaces/IMeetingDetailsAppService.cs` |
| IMeetingDetailsSeguimientoAppService | 11 | `OperationsLuxuryApp/JuntasMensuales/Minuta/Interfaces/IMeetingDetailsSeguimientoAppService.cs` |
| IMeetingInvitadoAppService | 3 | `OperationsLuxuryApp/JuntasMensuales/Minuta/Interfaces/IMeetingInvitadoAppService.cs` |
| IJuntaMensualNotificationOrchestrator | 3 | `OperationsLuxuryApp/JuntasMensuales/Notifications/Interfaces/IJuntaMensualNotificationOrchestrator.cs` |
| IPresentacionJuntaComiteAppService | 12 | `OperationsLuxuryApp/JuntasMensuales/Presentacion/Interfaces/IPresentacionJuntaComiteAppService.cs` |
| IJuntaMensualSessionAppService | 10 | `OperationsLuxuryApp/JuntasMensuales/Session/Interfaces/IJuntaMensualSessionAppService.cs` |
| IJuntaMensualSessionMaintenanceAppService | 1 | `OperationsLuxuryApp/JuntasMensuales/Session/Interfaces/IJuntaMensualSessionMaintenanceAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| JuntaMensualSessionBackfillAppService | 2 | `OperationsLuxuryApp/JuntasMensuales/Backfill/Services/JuntaMensualSessionBackfillAppService.cs` |
| MeetingMapper | 0 | `OperationsLuxuryApp/JuntasMensuales/Minuta/Mapping/MeetingMapper.cs` |
| MeetingAdministracionAppService | 3 | `OperationsLuxuryApp/JuntasMensuales/Minuta/Services/MeetingAdministracionAppService.cs` |
| MeetingAppService | 13 | `OperationsLuxuryApp/JuntasMensuales/Minuta/Services/MeetingAppService.cs` |
| MeetingComiteAppService | 3 | `OperationsLuxuryApp/JuntasMensuales/Minuta/Services/MeetingComiteAppService.cs` |
| MeetingDertailsSeguimientoAppService | 11 | `OperationsLuxuryApp/JuntasMensuales/Minuta/Services/MeetingDertailsSeguimientoAppService.cs` |
| MeetingDetailsAppService | 7 | `OperationsLuxuryApp/JuntasMensuales/Minuta/Services/MeetingDetailsAppService.cs` |
| MeetingInvitadoAppService | 3 | `OperationsLuxuryApp/JuntasMensuales/Minuta/Services/MeetingInvitadoAppService.cs` |
| PresentacionJuntaComiteMapper | 0 | `OperationsLuxuryApp/JuntasMensuales/Presentacion/Mapping/PresentacionJuntaComiteMapper.cs` |
| PresentacionJuntaComiteAppService | 12 | `OperationsLuxuryApp/JuntasMensuales/Presentacion/Services/PresentacionJuntaComiteAppService.cs` |
| JuntaMensualSessionAppService | 10 | `OperationsLuxuryApp/JuntasMensuales/Session/Services/JuntaMensualSessionAppService.cs` |
| JuntaMensualSessionMaintenanceAppService | 1 | `OperationsLuxuryApp/JuntasMensuales/Session/Services/JuntaMensualSessionMaintenanceAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| PreviewAsync | IJuntaMensualSessionBackfillAppService | GET_LIST | `Task<ApiResponseDTO<List<JuntaMensualSessio…` | `Guid? customerId, int windowDays = 7` |
| ApplyAsync | IJuntaMensualSessionBackfillAppService | SPECIAL | `Task<ApiResponseDTO<JuntaMensualSessionDTO>>` | `JuntaMensualSessionBackfillApplyDTO dto` |
| GetParticipantesAdministracionAsync | IMeetingAdministracionAppService | GET_LIST | `Task<ApiResponseDTO<List<object>>>` | `Guid meetingId` |
| AddParticipanteAdministracionAsync | IMeetingAdministracionAppService | CREATE | `Task<ApiResponseDTO<MeetingAdministracion>>` | `Guid meetingId, string applicationUserId, int personId` |
| DeleteAsync | IMeetingAdministracionAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| FindByIdAsync | IMeetingAppService | GET_SINGLE | `Task<ApiResponseDTO<MeetingHeaderDTO>>` | `Guid id` |
| GetMeetingReportPdf | IMeetingAppService | GET_LIST | `ApiResponseDTO<CreateMinutaPdfDTO>` | `Guid id` |
| list | IMeetingAppService | GET_LIST | `ApiResponseDTO<List<MeetingDTO>>` | `Guid customerId, TypeMeeting tipoJunta` |
| GetMeetingDetailsById | IMeetingAppService | GET_SINGLE | `ApiResponseDTO<MeetingDTO>` | `Guid id` |
| AddAsync | IMeetingAppService | CREATE | `Task<ApiResponseDTO<MeetingHeaderDTO>>` | `MeetingHeaderDTO DTO` |
| OnSendEmailResponsible | IMeetingAppService | OTHER | `Task<ApiResponseDTO<bool>>` | `Guid id, Guid customerId, AreaMinutasDetalles eAreaMinutasD…` |
| EnviarEmailPendientesResponsable | IMeetingAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid customerId, AreaMinutasDetalles eAreaMinutasDetalles` |
| SendEmailAllPendingMeeting | IMeetingAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `-` |
| MinutaPendientes | IMeetingAppService | OTHER | `ApiResponseDTO<object>` | `Guid id` |
| MinutaAllPendientes | IMeetingAppService | OTHER | `ApiResponseDTO<object>` | `Guid customerId` |
| GetSeguimientoMinutasAsync | IMeetingAppService | GET_LIST | `Task<ApiResponseDTO<List<SeguimientoMinutas…` | `Guid customerId, int status` |
| UpdateAsync | IMeetingAppService | UPDATE | `Task<ApiResponseDTO<MeetingHeaderDTO>>` | `Guid id, MeetingHeaderDTO DTO` |
| DeleteByIdAsync | IMeetingAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetParticipantesComiteAsync | IMeetingComiteAppService | GET_LIST | `Task<ApiResponseDTO<List<object>>>` | `Guid meetingId` |
| AddParticipanteComiteAsync | IMeetingComiteAppService | CREATE | `Task<ApiResponseDTO<MeetingComite>>` | `Guid meetingId, string applicationUserId` |
| DeleteAsync | IMeetingComiteAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetMeetingLegalDTOAsync | IMeetingDetailsAppService | GET_LIST | `Task<ApiResponseDTO<List<MeetingLegalDTO>>>` | `-` |
| GetByIdAsync | IMeetingDetailsAppService | GET_SINGLE | `Task<ApiResponseDTO<MeetingDetailsAddOrEdit…` | `Guid id` |
| MinutasFiltroAsync | IMeetingDetailsAppService | OTHER | `Task<ApiResponseDTO<List<object>>>` | `Guid meetingId, int estatus` |
| GetAllAsync | IMeetingDetailsAppService | GET_LIST | `Task<ApiResponseDTO<List<MettingetailsDTO>>>` | `Guid meetingId, int status` |
| AddAsync | IMeetingDetailsAppService | CREATE | `Task<ApiResponseDTO<MeetingDetails>>` | `MeetingDetailsAddOrEditDTO DTO` |
| UpdateAsync | IMeetingDetailsAppService | UPDATE | `Task<ApiResponseDTO<MeetingDetails>>` | `Guid id, MeetingDetailsAddOrEditDTO DTO` |
| DeleteAsync | IMeetingDetailsAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetByIdAsync | IMeetingDetailsSeguimientoAppService | GET_SINGLE | `Task<ApiResponseDTO<MeetingDetailFollowUpsD…` | `Guid id` |
| GetAllAsync | IMeetingDetailsSeguimientoAppService | GET_LIST | `Task<ApiResponseDTO<MeetingDetailFollowUpsD…` | `-` |
| AddAsync | IMeetingDetailsSeguimientoAppService | CREATE | `Task<ApiResponseDTO<MeetingDetailsSeguimien…` | `MeetingDetailFollowUpsAddOrEditDTO DTO` |
| UpdateAsync | IMeetingDetailsSeguimientoAppService | UPDATE | `Task<ApiResponseDTO<MeetingDetailsSeguimien…` | `Guid id, MeetingDetailFollowUpsAddOrEditDTO DTO` |
| DeleteByIdAsync | IMeetingDetailsSeguimientoAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| ResumenMinutaPresentacionAsync | IMeetingDetailsSeguimientoAppService | OTHER | `Task<ApiResponseDTO<List<object>>>` | `Guid customerId, Guid minutaId` |
| ResumenPreventivosPresentacionAsync | IMeetingDetailsSeguimientoAppService | OTHER | `Task<ApiResponseDTO<List<object>>>` | `Guid customerId, string fecha` |
| ResumenPreventivosGraficoPresentacionAsync | IMeetingDetailsSeguimientoAppService | OTHER | `Task<ApiResponseDTO<List<object>>>` | `Guid customerId, string fecha` |
| ResumenMinutasPresentacionAsync | IMeetingDetailsSeguimientoAppService | OTHER | `Task<ApiResponseDTO<List<object>>>` | `Guid minutaId` |
| ResumenMinutasGraficoPresentacionAsync | IMeetingDetailsSeguimientoAppService | OTHER | `Task<ApiResponseDTO<List<object>>>` | `Guid minutaId` |
| ExportSummaryToExcelAsync | IMeetingDetailsSeguimientoAppService | SPECIAL | `Task<byte[]>` | `Guid minutaId` |
| GetParticipantesInvitadoAsync | IMeetingInvitadoAppService | GET_LIST | `Task<ApiResponseDTO<List<object>>>` | `Guid meetingId` |
| AddParticipanteInvitadoAsync | IMeetingInvitadoAppService | CREATE | `Task<ApiResponseDTO<MeetingInvitado>>` | `Guid meetingId, string invitado` |
| DeleteByIdAsync | IMeetingInvitadoAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| NotifyScheduledAsync | IJuntaMensualNotificationOrchestrator | SPECIAL | `Task` | `GoogleCalendarEvent agendaEvent, AsambleaPlan assemblyPlan,…` |
| NotifyRescheduledAsync | IJuntaMensualNotificationOrchestrator | SPECIAL | `Task` | `GoogleCalendarEvent agendaEvent, AsambleaPlan assemblyPlan,…` |
| NotifyCancelledAsync | IJuntaMensualNotificationOrchestrator | SPECIAL | `Task` | `GoogleCalendarEvent agendaEvent, CancellationToken cancella…` |
| GetByIdAsync | IPresentacionJuntaComiteAppService | GET_SINGLE | `Task<ApiResponseDTO<PresentacionJuntaComite…` | `Guid id` |
| GetAllAsync | IPresentacionJuntaComiteAppService | GET_LIST | `Task<ApiResponseDTO<List<PresentacionJuntaC…` | `Guid customerId` |
| AutorizarPresentacionAsync | IPresentacionJuntaComiteAppService | SPECIAL | `Task<ApiResponseDTO<PresentacionJuntaComite…` | `Guid id, string applicationUserId` |
| AddFileAsync | IPresentacionJuntaComiteAppService | CREATE | `Task<ApiResponseDTO<PresentacionJuntaComite…` | `PresentacionJuntaComiteAddPdf DTO` |
| AddFechaAsync | IPresentacionJuntaComiteAppService | CREATE | `Task<ApiResponseDTO<PresentacionJuntaComite…` | `PresentacionJuntaComiteAdd DTO` |
| UpdateFechaAsync | IPresentacionJuntaComiteAppService | UPDATE | `Task<ApiResponseDTO<PresentacionJuntaComite…` | `Guid id, PresentacionJuntaComiteAdd DTO` |
| DeleteAsync | IPresentacionJuntaComiteAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| DeletePdfAsync | IPresentacionJuntaComiteAppService | DELETE | `Task<ApiResponseDTO<PresentacionJuntaComite…` | `Guid id, string area` |
| GeneralesAsync | IPresentacionJuntaComiteAppService | OTHER | `Task<ApiResponseDTO<List<object>>>` | `DateTime periodo` |
| GetBodyEmailPresentacionComite | IPresentacionJuntaComiteAppService | GET_LIST | `string` | `string fechaJunta, string logo, string nombreCliente` |
| GetBodyEmailEstadosFinancierosTesorero | IPresentacionJuntaComiteAppService | GET_LIST | `string` | `string periodo, string logo, string nombreCliente` |
| GetBodyEmailEstadosFinancierosCondominos | IPresentacionJuntaComiteAppService | GET_LIST | `string` | `string periodo, string logo, string nombreCliente` |
| GetByIdAsync | IJuntaMensualSessionAppService | GET_SINGLE | `Task<ApiResponseDTO<JuntaMensualSessionDTO>>` | `Guid id` |
| GetDetailByIdAsync | IJuntaMensualSessionAppService | GET_SINGLE | `Task<ApiResponseDTO<JuntaMensualSessionDeta…` | `Guid id` |
| GetAccessibleAsync | IJuntaMensualSessionAppService | GET_LIST | `Task<ApiResponseDTO<List<JuntaMensualSessio…` | `Guid? customerId, JuntaMensualSessionStatus? status, Google…` |
| GetByCustomerAsync | IJuntaMensualSessionAppService | GET_LIST | `Task<ApiResponseDTO<List<JuntaMensualSessio…` | `Guid customerId` |
| CreateFromAgendaAsync | IJuntaMensualSessionAppService | CREATE | `Task<ApiResponseDTO<JuntaMensualSessionDTO>>` | `JuntaMensualSessionCreateFromAgendaDTO dto` |
| LinkPresentationAsync | IJuntaMensualSessionAppService | SPECIAL | `Task<ApiResponseDTO<JuntaMensualSessionDTO>>` | `Guid id, JuntaMensualSessionLinkPresentationDTO dto` |
| LinkMeetingAsync | IJuntaMensualSessionAppService | SPECIAL | `Task<ApiResponseDTO<JuntaMensualSessionDTO>>` | `Guid id, JuntaMensualSessionLinkMeetingDTO dto` |
| CreateMeetingAsync | IJuntaMensualSessionAppService | CREATE | `Task<ApiResponseDTO<JuntaMensualSessionDTO>>` | `Guid id, JuntaMensualSessionCreateMeetingDTO dto` |
| CancelAsync | IJuntaMensualSessionAppService | SPECIAL | `Task<ApiResponseDTO<JuntaMensualSessionDTO>>` | `Guid id, JuntaMensualSessionCancelDTO dto` |
| RescheduleAsync | IJuntaMensualSessionAppService | OTHER | `Task<ApiResponseDTO<JuntaMensualSessionDTO>>` | `Guid id, JuntaMensualSessionRescheduleDTO dto` |
| CleanupFutureEmptySessionsAsync | IJuntaMensualSessionMaintenanceAppService | OTHER | `Task` | `CancellationToken cancellationToken = default` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/junta-mensual-session-backfill/preview` | `appService.PreviewAsync` | `OperationsLuxuryApp/JuntasMensuales/Backfill/EndPoints/JuntaMensualSessionBackfillEndpoints.cs` |
| POST | `/api/junta-mensual-session-backfill/apply` | `appService.ApplyAsync` | `OperationsLuxuryApp/JuntasMensuales/Backfill/EndPoints/JuntaMensualSessionBackfillEndpoints.cs` |
| GET | `/api/meeting-administracion/participantes-administracion/{meetingId:guid}` | `appService.GetParticipantesAdministracionAsync` | `OperationsLuxuryApp/JuntasMensuales/Minuta/EndPoints/MeetingAdministracionEndpoints.cs` |
| POST | `/api/meeting-administracion/agregar-participantes-administracion/{meetingId:guid}/{applicationUserId}/{personId:int}` | `appService.AddParticipanteAdministracionAsync` | `OperationsLuxuryApp/JuntasMensuales/Minuta/EndPoints/MeetingAdministracionEndpoints.cs` |
| DELETE | `/api/meeting-administracion/{id:guid}` | `appService.DeleteAsync` | `OperationsLuxuryApp/JuntasMensuales/Minuta/EndPoints/MeetingAdministracionEndpoints.cs` |
| GET | `/api/meeting-comite/participantes-comite/{meetingId:guid}` | `appService.GetParticipantesComiteAsync` | `OperationsLuxuryApp/JuntasMensuales/Minuta/EndPoints/MeetingComiteEndpoints.cs` |
| POST | `/api/meeting-comite/agregar-participantes-comite/{meetingId:guid}/{applicationUserId}` | `appService.AddParticipanteComiteAsync` | `OperationsLuxuryApp/JuntasMensuales/Minuta/EndPoints/MeetingComiteEndpoints.cs` |
| DELETE | `/api/meeting-comite/{id:guid}` | `appService.DeleteAsync` | `OperationsLuxuryApp/JuntasMensuales/Minuta/EndPoints/MeetingComiteEndpoints.cs` |
| GET | `/api/meeting-details-seguimientos/{id:guid}` | `appService.GetByIdAsync` | `OperationsLuxuryApp/JuntasMensuales/Minuta/EndPoints/MeetingDetailsSeguimientosEndpoints.cs` |
| GET | `/api/meeting-details-seguimientos` | `appService.GetAllAsync` | `OperationsLuxuryApp/JuntasMensuales/Minuta/EndPoints/MeetingDetailsSeguimientosEndpoints.cs` |
| POST | `/api/meeting-details-seguimientos` | `appService.AddAsync` | `OperationsLuxuryApp/JuntasMensuales/Minuta/EndPoints/MeetingDetailsSeguimientosEndpoints.cs` |
| PUT | `/api/meeting-details-seguimientos/{id:guid}` | `appService.UpdateAsync` | `OperationsLuxuryApp/JuntasMensuales/Minuta/EndPoints/MeetingDetailsSeguimientosEndpoints.cs` |
| DELETE | `/api/meeting-details-seguimientos/{id:guid}` | `appService.DeleteByIdAsync` | `OperationsLuxuryApp/JuntasMensuales/Minuta/EndPoints/MeetingDetailsSeguimientosEndpoints.cs` |
| GET | `/api/meeting-details-seguimientos/resumen-minuta-presentacion/{customerId:guid}/{minutaId:guid}` | `appService.ResumenMinutaPresentacionAsync` | `OperationsLuxuryApp/JuntasMensuales/Minuta/EndPoints/MeetingDetailsSeguimientosEndpoints.cs` |
| GET | `/api/meeting-details-seguimientos/resumen-preventivos-presentacion/{customerId:guid}/{fecha}` | `appService.ResumenPreventivosPresentacionAsync` | `OperationsLuxuryApp/JuntasMensuales/Minuta/EndPoints/MeetingDetailsSeguimientosEndpoints.cs` |
| GET | `/api/meeting-details-seguimientos/resumen-preventivos-grafico-presentacion/{customerId:guid}/{fecha}` | `appService.ResumenPreventivosGraficoPresentacionAsync` | `OperationsLuxuryApp/JuntasMensuales/Minuta/EndPoints/MeetingDetailsSeguimientosEndpoints.cs` |
| GET | `/api/meeting-details-seguimientos/resumen-minutas-presentacion/{minutaId:guid}` | `appService.ResumenMinutasPresentacionAsync` | `OperationsLuxuryApp/JuntasMensuales/Minuta/EndPoints/MeetingDetailsSeguimientosEndpoints.cs` |
| GET | `/api/meeting-details-seguimientos/resumen-minutas-grafico-presentacion/{minutaId:guid}` | `appService.ResumenMinutasGraficoPresentacionAsync` | `OperationsLuxuryApp/JuntasMensuales/Minuta/EndPoints/MeetingDetailsSeguimientosEndpoints.cs` |
| GET | `/api/meeting-details-seguimientos/export-summary-to-excel/{minutaId:guid}` | `appService.ExportSummaryToExcelAsync` | `OperationsLuxuryApp/JuntasMensuales/Minuta/EndPoints/MeetingDetailsSeguimientosEndpoints.cs` |
| GET | `/api/meeting-invitado/participantes-invitado/{meetingId:guid}` | `appService.GetParticipantesInvitadoAsync` | `OperationsLuxuryApp/JuntasMensuales/Minuta/EndPoints/MeetingInvitadoEndpoints.cs` |
| POST | `/api/meeting-invitado/agregar-participantes-invitado/{meetingId:guid}/{invitado}` | `appService.AddParticipanteInvitadoAsync` | `OperationsLuxuryApp/JuntasMensuales/Minuta/EndPoints/MeetingInvitadoEndpoints.cs` |
| DELETE | `/api/meeting-invitado/{id:guid}` | `appService.DeleteByIdAsync` | `OperationsLuxuryApp/JuntasMensuales/Minuta/EndPoints/MeetingInvitadoEndpoints.cs` |
| GET | `/api/meetings-details/{id:guid}` | `appService.GetByIdAsync` | `OperationsLuxuryApp/JuntasMensuales/Minuta/EndPoints/MeetingsDetailsEndpoints.cs` |
| GET | `/api/meetings-details/detalles-filtro/{meetingId:guid}/{estatus:int}` | `appService.MinutasFiltroAsync` | `OperationsLuxuryApp/JuntasMensuales/Minuta/EndPoints/MeetingsDetailsEndpoints.cs` |
| GET | `/api/meetings-details/get-all/{meetingId:guid}/{status:int}` | `appService.GetAllAsync` | `OperationsLuxuryApp/JuntasMensuales/Minuta/EndPoints/MeetingsDetailsEndpoints.cs` |
| POST | `/api/meetings-details` | `appService.AddAsync` | `OperationsLuxuryApp/JuntasMensuales/Minuta/EndPoints/MeetingsDetailsEndpoints.cs` |
| PUT | `/api/meetings-details/{id:guid}` | `appService.UpdateAsync` | `OperationsLuxuryApp/JuntasMensuales/Minuta/EndPoints/MeetingsDetailsEndpoints.cs` |
| DELETE | `/api/meetings-details/{id:guid}` | `appService.DeleteAsync` | `OperationsLuxuryApp/JuntasMensuales/Minuta/EndPoints/MeetingsDetailsEndpoints.cs` |
| GET | `/api/meetings/{id:guid}` | `appService.FindByIdAsync` | `OperationsLuxuryApp/JuntasMensuales/Minuta/EndPoints/MeetingsEndpoints.cs` |
| GET | `/api/meetings/meeting-report-pdf/{id:guid}` | - | `OperationsLuxuryApp/JuntasMensuales/Minuta/EndPoints/MeetingsEndpoints.cs` |
| GET | `/api/meetings/list/{customerId:guid}/{tipoJunta}` | `appService.AddAsync` | `OperationsLuxuryApp/JuntasMensuales/Minuta/EndPoints/MeetingsEndpoints.cs` |
| GET | `/api/meetings/get-details/{id:guid}` | `appService.AddAsync` | `OperationsLuxuryApp/JuntasMensuales/Minuta/EndPoints/MeetingsEndpoints.cs` |
| POST | `/api/meetings` | `appService.AddAsync` | `OperationsLuxuryApp/JuntasMensuales/Minuta/EndPoints/MeetingsEndpoints.cs` |
| POST | `/api/meetings/send-email-responsible/{id:guid}/{customerId:guid}/{eAreaMinutasDetalles}/{applicationUserId}` | - | `OperationsLuxuryApp/JuntasMensuales/Minuta/EndPoints/MeetingsEndpoints.cs` |
| POST | `/api/meetings/enviar-email-pendientes-responsable/{customerId:guid}/{eAreaMinutasDetalles}` | - | `OperationsLuxuryApp/JuntasMensuales/Minuta/EndPoints/MeetingsEndpoints.cs` |
| POST | `/api/meetings/send-email-all-pending-meeting` | - | `OperationsLuxuryApp/JuntasMensuales/Minuta/EndPoints/MeetingsEndpoints.cs` |
| GET | `/api/meetings/minuta-pendientes/{id:guid}` | - | `OperationsLuxuryApp/JuntasMensuales/Minuta/EndPoints/MeetingsEndpoints.cs` |
| GET | `/api/meetings/minuta-all-pendientes/{customerId:guid}` | `appService.GetSeguimientoMinutasAsync` | `OperationsLuxuryApp/JuntasMensuales/Minuta/EndPoints/MeetingsEndpoints.cs` |
| GET | `/api/meetings/seguimiento-minutas/{customerId:guid}/{status:int}` | `appService.GetSeguimientoMinutasAsync` | `OperationsLuxuryApp/JuntasMensuales/Minuta/EndPoints/MeetingsEndpoints.cs` |
| PUT | `/api/meetings/{id:guid}` | `appService.UpdateAsync` | `OperationsLuxuryApp/JuntasMensuales/Minuta/EndPoints/MeetingsEndpoints.cs` |
| DELETE | `/api/meetings/{id:guid}` | `appService.DeleteByIdAsync` | `OperationsLuxuryApp/JuntasMensuales/Minuta/EndPoints/MeetingsEndpoints.cs` |
| GET | `/api/presentaciones-junta-comite/get/{id:guid}` | `appService.GetByIdAsync` | `OperationsLuxuryApp/JuntasMensuales/Presentacion/EndPoints/PresentacionesJuntaComiteEndpoints.cs` |
| GET | `/api/presentaciones-junta-comite/list/{customerId:guid}` | `appService.GetAllAsync` | `OperationsLuxuryApp/JuntasMensuales/Presentacion/EndPoints/PresentacionesJuntaComiteEndpoints.cs` |
| POST | `/api/presentaciones-junta-comite/autorizar-presentacion/{id:guid}/{applicationUserId}` | `appService.AutorizarPresentacionAsync` | `OperationsLuxuryApp/JuntasMensuales/Presentacion/EndPoints/PresentacionesJuntaComiteEndpoints.cs` |
| POST | `/api/presentaciones-junta-comite/add-file` | `appService.AddFileAsync` | `OperationsLuxuryApp/JuntasMensuales/Presentacion/EndPoints/PresentacionesJuntaComiteEndpoints.cs` |
| POST | `/api/presentaciones-junta-comite/add-fecha` | `appService.AddFechaAsync` | `OperationsLuxuryApp/JuntasMensuales/Presentacion/EndPoints/PresentacionesJuntaComiteEndpoints.cs` |
| PUT | `/api/presentaciones-junta-comite/add-fecha/{id:guid}` | `appService.UpdateFechaAsync` | `OperationsLuxuryApp/JuntasMensuales/Presentacion/EndPoints/PresentacionesJuntaComiteEndpoints.cs` |
| DELETE | `/api/presentaciones-junta-comite/{id:guid}` | `appService.DeleteAsync` | `OperationsLuxuryApp/JuntasMensuales/Presentacion/EndPoints/PresentacionesJuntaComiteEndpoints.cs` |
| DELETE | `/api/presentaciones-junta-comite/{id:guid}/{area}` | `appService.DeletePdfAsync` | `OperationsLuxuryApp/JuntasMensuales/Presentacion/EndPoints/PresentacionesJuntaComiteEndpoints.cs` |
| GET | `/api/presentaciones-junta-comite/generales/{periodo:datetime}` | `appService.GeneralesAsync` | `OperationsLuxuryApp/JuntasMensuales/Presentacion/EndPoints/PresentacionesJuntaComiteEndpoints.cs` |
| GET | `/api/junta-mensual-sessions/{id:guid}` | `appService.GetByIdAsync` | `OperationsLuxuryApp/JuntasMensuales/Session/EndPoints/JuntaMensualSessionsEndpoints.cs` |
| GET | `/api/junta-mensual-sessions/{id:guid}/detail` | `appService.GetDetailByIdAsync` | `OperationsLuxuryApp/JuntasMensuales/Session/EndPoints/JuntaMensualSessionsEndpoints.cs` |
| GET | `/api/junta-mensual-sessions` | `appService.GetAccessibleAsync` | `OperationsLuxuryApp/JuntasMensuales/Session/EndPoints/JuntaMensualSessionsEndpoints.cs` |
| GET | `/api/junta-mensual-sessions/customer/{customerId:guid}` | `appService.GetByCustomerAsync` | `OperationsLuxuryApp/JuntasMensuales/Session/EndPoints/JuntaMensualSessionsEndpoints.cs` |
| POST | `/api/junta-mensual-sessions/from-agenda` | `appService.CreateFromAgendaAsync` | `OperationsLuxuryApp/JuntasMensuales/Session/EndPoints/JuntaMensualSessionsEndpoints.cs` |
| POST | `/api/junta-mensual-sessions/{id:guid}/presentation` | `appService.LinkPresentationAsync` | `OperationsLuxuryApp/JuntasMensuales/Session/EndPoints/JuntaMensualSessionsEndpoints.cs` |
| POST | `/api/junta-mensual-sessions/{id:guid}/meeting` | `appService.LinkMeetingAsync` | `OperationsLuxuryApp/JuntasMensuales/Session/EndPoints/JuntaMensualSessionsEndpoints.cs` |
| POST | `/api/junta-mensual-sessions/{id:guid}/meeting/create` | `appService.CreateMeetingAsync` | `OperationsLuxuryApp/JuntasMensuales/Session/EndPoints/JuntaMensualSessionsEndpoints.cs` |
| POST | `/api/junta-mensual-sessions/{id:guid}/cancel` | `appService.CancelAsync` | `OperationsLuxuryApp/JuntasMensuales/Session/EndPoints/JuntaMensualSessionsEndpoints.cs` |
| PUT | `/api/junta-mensual-sessions/{id:guid}/reschedule` | `appService.RescheduleAsync` | `OperationsLuxuryApp/JuntasMensuales/Session/EndPoints/JuntaMensualSessionsEndpoints.cs` |

#### Modulo: MiEdificio

- Interfaces: 0 | Servicios: 0 | Endpoints: 1 | DTOs: 3

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/mi-edificio/caratula/{customerId:guid}` | `appService.GetCaratulaAsync` | `OperationsLuxuryApp/MiEdificio/EndPoints/MiEdificioEndpoints.cs` |

#### Modulo: Owner

- Interfaces: 1 | Servicios: 2 | Endpoints: 5 | DTOs: 2

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IOwnerAppService | 5 | `OperationsLuxuryApp/Owner/Interfaces/IOwnerAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| OwnerMapper | 0 | `OperationsLuxuryApp/Owner/Mapping/OwnerMapper.cs` |
| OwnerAppService | 5 | `OperationsLuxuryApp/Owner/Services/OwnerAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetByIdAsync | IOwnerAppService | GET_SINGLE | `Task<ApiResponseDTO<OwnerAddOrEditDTO>>` | `Guid id` |
| GetAllAsync | IOwnerAppService | GET_LIST | `Task<ApiResponseDTO<List<OwnerDTO>>>` | `Guid customerId` |
| AddAsync | IOwnerAppService | CREATE | `Task<ApiResponseDTO<OwnerDTO>>` | `OwnerAddOrEditDTO DTO` |
| UpdateAsync | IOwnerAppService | UPDATE | `Task<ApiResponseDTO<OwnerDTO>>` | `Guid id, OwnerAddOrEditDTO DTO` |
| DeleteByIdAsync | IOwnerAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/owners/{id:guid}` | `appService.GetByIdAsync` | `OperationsLuxuryApp/Owner/EndPoints/OwnersEndpoints.cs` |
| GET | `/api/owners/list/{customerId:guid}` | `appService.GetAllAsync` | `OperationsLuxuryApp/Owner/EndPoints/OwnersEndpoints.cs` |
| POST | `/api/owners` | `appService.AddAsync` | `OperationsLuxuryApp/Owner/EndPoints/OwnersEndpoints.cs` |
| PUT | `/api/owners/{id:guid}` | `appService.UpdateAsync` | `OperationsLuxuryApp/Owner/EndPoints/OwnersEndpoints.cs` |
| DELETE | `/api/owners/{id:guid}` | `appService.DeleteByIdAsync` | `OperationsLuxuryApp/Owner/EndPoints/OwnersEndpoints.cs` |

#### Modulo: PanicAlerts

- Interfaces: 2 | Servicios: 2 | Endpoints: 6 | DTOs: 4

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IPanicAlertAppService | 6 | `OperationsLuxuryApp/PanicAlerts/Interfaces/IPanicAlertAppService.cs` |
| IPanicAlertNotificationService | 2 | `OperationsLuxuryApp/PanicAlerts/Interfaces/IPanicAlertNotificationService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| PanicAlertAppService | 6 | `OperationsLuxuryApp/PanicAlerts/Services/PanicAlertAppService.cs` |
| PanicAlertNotificationService | 2 | `OperationsLuxuryApp/PanicAlerts/Services/PanicAlertNotificationService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| CreateAsync | IPanicAlertAppService | CREATE | `Task<ApiResponseDTO<PanicAlertDTO>>` | `PanicAlertCreateDTO dto` |
| GetActiveAsync | IPanicAlertAppService | GET_LIST | `Task<ApiResponseDTO<List<PanicAlertDTO>>>` | `-` |
| GetHistoryAsync | IPanicAlertAppService | GET_LIST | `Task<ApiResponseDTO<List<PanicAlertDTO>>>` | `-` |
| GetByIdAsync | IPanicAlertAppService | GET_SINGLE | `Task<ApiResponseDTO<PanicAlertDTO>>` | `Guid id` |
| AttendAsync | IPanicAlertAppService | OTHER | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| ResolveAsync | IPanicAlertAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid id, PanicAlertResolveDTO dto` |
| NotifyRecipientsAsync | IPanicAlertNotificationService | SPECIAL | `Task` | `PanicAlert alert, string triggeredByName, List<string> reci…` |
| NotifyEmitterAsync | IPanicAlertNotificationService | SPECIAL | `Task` | `PanicAlert alert, string emitterUserId, string attendedByNa…` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| POST | `/api/panic-alerts` | `appService.CreateAsync` | `OperationsLuxuryApp/PanicAlerts/EndPoints/PanicAlertsEndpoints.cs` |
| GET | `/api/panic-alerts/active` | `appService.GetActiveAsync` | `OperationsLuxuryApp/PanicAlerts/EndPoints/PanicAlertsEndpoints.cs` |
| GET | `/api/panic-alerts/history` | `appService.GetHistoryAsync` | `OperationsLuxuryApp/PanicAlerts/EndPoints/PanicAlertsEndpoints.cs` |
| GET | `/api/panic-alerts/{id:guid}` | `appService.GetByIdAsync` | `OperationsLuxuryApp/PanicAlerts/EndPoints/PanicAlertsEndpoints.cs` |
| PUT | `/api/panic-alerts/{id:guid}/attend` | `appService.AttendAsync` | `OperationsLuxuryApp/PanicAlerts/EndPoints/PanicAlertsEndpoints.cs` |
| PUT | `/api/panic-alerts/{id:guid}/resolve` | `appService.ResolveAsync` | `OperationsLuxuryApp/PanicAlerts/EndPoints/PanicAlertsEndpoints.cs` |

#### Modulo: Persistence

- Interfaces: 0 | Servicios: 0 | Endpoints: 0 | DTOs: 0

#### Modulo: Properties

- Interfaces: 1 | Servicios: 2 | Endpoints: 8 | DTOs: 4

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IPropertyAppService | 8 | `OperationsLuxuryApp/Properties/Interfaces/IPropertyAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| PropertyMapper | 0 | `OperationsLuxuryApp/Properties/Mapping/PropertyMapper.cs` |
| PropertyAppService | 8 | `OperationsLuxuryApp/Properties/Services/PropertyAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetByIdAsync | IPropertyAppService | GET_SINGLE | `Task<ApiResponseDTO<PropertyDTO>>` | `Guid id` |
| GetAllAsync | IPropertyAppService | GET_LIST | `Task<ApiResponseDTO<PropertyDTO[]>>` | `Guid customerId` |
| AddAsync | IPropertyAppService | CREATE | `Task<ApiResponseDTO<PropertyDTO>>` | `PropertyAddOrEditDTO DTO` |
| UpdateAsync | IPropertyAppService | UPDATE | `Task<ApiResponseDTO<PropertyDTO>>` | `Guid id, PropertyAddOrEditDTO DTO` |
| DeleteByIdAsync | IPropertyAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| ImportPropertiesFromExcelAsync | IPropertyAppService | SPECIAL | `Task<ImportPropertiesResultDTO>` | `Guid customerId, IFormFile file` |
| DownloadTemplateAsync | IPropertyAppService | SPECIAL | `Task<FileDownloadDTO>` | `Guid customerId` |
| AssignAccountNumberAsync | IPropertyAppService | SPECIAL | `Task<ApiResponseDTO<PropertyDTO>>` | `Guid id, PropertyAssignAccountDTO dto` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/properties/{id:guid}` | `dataService.GetByIdAsync` | `OperationsLuxuryApp/Properties/EndPoints/PropertiesEndpoints.cs` |
| GET | `/api/properties/list/{customerId:guid}` | `dataService.GetAllAsync` | `OperationsLuxuryApp/Properties/EndPoints/PropertiesEndpoints.cs` |
| POST | `/api/properties` | `dataService.AddAsync` | `OperationsLuxuryApp/Properties/EndPoints/PropertiesEndpoints.cs` |
| PUT | `/api/properties/{id:guid}` | `dataService.UpdateAsync` | `OperationsLuxuryApp/Properties/EndPoints/PropertiesEndpoints.cs` |
| DELETE | `/api/properties/{id:guid}` | `dataService.DeleteByIdAsync` | `OperationsLuxuryApp/Properties/EndPoints/PropertiesEndpoints.cs` |
| POST | `/api/properties/import/{customerId:guid}` | `dataService.ImportPropertiesFromExcelAsync` | `OperationsLuxuryApp/Properties/EndPoints/PropertiesEndpoints.cs` |
| PATCH | `/api/properties/{id:guid}/account-number` | `dataService.AssignAccountNumberAsync` | `OperationsLuxuryApp/Properties/EndPoints/PropertiesEndpoints.cs` |
| GET | `/api/properties/download-template/{customerId:guid}` | `dataService.DownloadTemplateAsync` | `OperationsLuxuryApp/Properties/EndPoints/PropertiesEndpoints.cs` |

#### Modulo: PropertyOccupants

- Interfaces: 1 | Servicios: 1 | Endpoints: 5 | DTOs: 2

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IPropertyOccupantAppService | 5 | `OperationsLuxuryApp/PropertyOccupants/Interfaces/IPropertyOccupantAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| PropertyOccupantAppService | 5 | `OperationsLuxuryApp/PropertyOccupants/Services/PropertyOccupantAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetByIdAsync | IPropertyOccupantAppService | GET_SINGLE | `Task<ApiResponseDTO<PropertyOccupantDTO>>` | `Guid id` |
| GetAllByPropertyIdAsync | IPropertyOccupantAppService | GET_LIST | `Task<ApiResponseDTO<List<PropertyOccupantDT…` | `Guid propertyId` |
| AddAsync | IPropertyOccupantAppService | CREATE | `Task<ApiResponseDTO<PropertyOccupantDTO>>` | `CreatePropertyOccupantDTO DTO` |
| UpdateAsync | IPropertyOccupantAppService | UPDATE | `Task<ApiResponseDTO<PropertyOccupantDTO>>` | `Guid id, UpdatePropertyOccupantDTO DTO` |
| DeleteByIdAsync | IPropertyOccupantAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/property-occupant/{id:guid}` | `service.GetByIdAsync` | `OperationsLuxuryApp/PropertyOccupants/EndPoints/PropertyOccupantEndpoints.cs` |
| GET | `/api/property-occupant/list/{propertyId:guid}` | `service.GetAllByPropertyIdAsync` | `OperationsLuxuryApp/PropertyOccupants/EndPoints/PropertyOccupantEndpoints.cs` |
| POST | `/api/property-occupant` | `service.AddAsync` | `OperationsLuxuryApp/PropertyOccupants/EndPoints/PropertyOccupantEndpoints.cs` |
| PUT | `/api/property-occupant/{id:guid}` | `service.UpdateAsync` | `OperationsLuxuryApp/PropertyOccupants/EndPoints/PropertyOccupantEndpoints.cs` |
| DELETE | `/api/property-occupant/{id:guid}` | `service.DeleteByIdAsync` | `OperationsLuxuryApp/PropertyOccupants/EndPoints/PropertyOccupantEndpoints.cs` |

#### Modulo: ResumenGeneral

- Interfaces: 1 | Servicios: 1 | Endpoints: 12 | DTOs: 0

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IGeneralSummaryService | 12 | `OperationsLuxuryApp/ResumenGeneral/Interfaces/IGeneralSummaryService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| GeneralSummaryService | 12 | `OperationsLuxuryApp/ResumenGeneral/Services/GeneralSummaryService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| EvaluateAreasAsync | IGeneralSummaryService | SPECIAL | `Task<object>` | `DateTime fechaInicial, DateTime fechaFinal` |
| GetGeneralResultAsync | IGeneralSummaryService | GET_LIST | `Task<object>` | `DateTime fechaInicial, DateTime fechaFinal` |
| GetMinutesGeneralSummaryGroupAsync | IGeneralSummaryService | GET_LIST | `Task<object>` | `DateTime fechaInicial, DateTime fechaFinal` |
| GetMinutesGeneralSummaryAsync | IGeneralSummaryService | GET_LIST | `Task<object>` | `DateTime fechaInicial, DateTime fechaFinal` |
| GetAreaEvaluationDetailAsync | IGeneralSummaryService | GET_LIST | `Task<object>` | `DateTime fecha, AreaMinutasDetalles area, Status? status` |
| GetPositionAsync | IGeneralSummaryService | GET_LIST | `Task<object>` | `DateTime fechaInicial, DateTime fechaFinal` |
| GetMinutesSummaryReportAsync | IGeneralSummaryService | GET_LIST | `Task<object>` | `DateTime fechaInicial, DateTime fechaFinal, int nivelReporte` |
| GetMinutesSummaryReportFilterAsync | IGeneralSummaryService | GET_LIST | `Task<object>` | `DateTime fechaInicial, DateTime fechaFinal, AreaMinutasDeta…` |
| GetPreventiveSummaryReportAsync | IGeneralSummaryService | GET_LIST | `Task<object>` | `DateTime fechaInicial, DateTime fechaFinal` |
| GetTicketSummaryReportAsync | IGeneralSummaryService | GET_LIST | `Task<object>` | `DateTime fechaInicial, DateTime fechaFinal` |
| GetTicketSummaryReportByCustomerAsync | IGeneralSummaryService | GET_LIST | `Task<object>` | `Guid customerId, DateTime fechaInicial, DateTime fechaFinal` |
| GeneralResultFilterAsync | IGeneralSummaryService | OTHER | `GeneralResultFilterDTO` | `-` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/resumen-general/evaluacion-areas/{fechaInicial}/{fechaFinal}` | `generalSummary.EvaluateAreasAsync` | `OperationsLuxuryApp/ResumenGeneral/EndPoints/ResumenGeneralEndpoints.cs` |
| GET | `/api/resumen-general/resultado-general/{fechaInicial}/{fechaFinal}` | `generalSummary.GetGeneralResultAsync` | `OperationsLuxuryApp/ResumenGeneral/EndPoints/ResumenGeneralEndpoints.cs` |
| GET | `/api/resumen-general/resumen-minutas-general-grupo/{fechaInicial}/{fechaFinal}` | `generalSummary.GetMinutesGeneralSummaryGroupAsync` | `OperationsLuxuryApp/ResumenGeneral/EndPoints/ResumenGeneralEndpoints.cs` |
| GET | `/api/resumen-general/resumen-minutas-general-lista/{fechaInicial}/{fechaFinal}` | `generalSummary.GetMinutesGeneralSummaryAsync` | `OperationsLuxuryApp/ResumenGeneral/EndPoints/ResumenGeneralEndpoints.cs` |
| GET | `/api/resumen-general/evaluacion-areas-detalle/{fecha}/{area}/{status?}` | `generalSummary.GetAreaEvaluationDetailAsync` | `OperationsLuxuryApp/ResumenGeneral/EndPoints/ResumenGeneralEndpoints.cs` |
| GET | `/api/resumen-general/posicion/{fechaInicial}/{fechaFinal}` | `generalSummary.GetPositionAsync` | `OperationsLuxuryApp/ResumenGeneral/EndPoints/ResumenGeneralEndpoints.cs` |
| GET | `/api/resumen-general/reporte-resumen-minutas/{fechaInicial}/{fechaFinal}/{nivelReporte:int}` | `generalSummary.GetMinutesSummaryReportAsync` | `OperationsLuxuryApp/ResumenGeneral/EndPoints/ResumenGeneralEndpoints.cs` |
| GET | `/api/resumen-general/reporte-resumen-minutas-filtro/{fechaInicial}/{fechaFinal}/{filtro}/{nivelReporte:int}` | `generalSummary.GetMinutesSummaryReportFilterAsync` | `OperationsLuxuryApp/ResumenGeneral/EndPoints/ResumenGeneralEndpoints.cs` |
| GET | `/api/resumen-general/reporte-resumen-preventivos/{fechaInicial}/{fechaFinal}` | `generalSummary.GetPreventiveSummaryReportAsync` | `OperationsLuxuryApp/ResumenGeneral/EndPoints/ResumenGeneralEndpoints.cs` |
| GET | `/api/resumen-general/reporte-resumen-ticket/{fechaInicial}/{fechaFinal}` | `generalSummary.GetTicketSummaryReportAsync` | `OperationsLuxuryApp/ResumenGeneral/EndPoints/ResumenGeneralEndpoints.cs` |
| GET | `/api/resumen-general/reporte-resumen-ticket/{customerId:guid}/{fechaInicial}/{fechaFinal}` | `generalSummary.GetTicketSummaryReportByCustomerAsync` | `OperationsLuxuryApp/ResumenGeneral/EndPoints/ResumenGeneralEndpoints.cs` |
| GET | `/api/resumen-general/filtro-dto` | `generalSummary.GeneralResultFilterAsync` | `OperationsLuxuryApp/ResumenGeneral/EndPoints/ResumenGeneralEndpoints.cs` |

#### Modulo: ScheduledTasks

- Interfaces: 2 | Servicios: 3 | Endpoints: 0 | DTOs: 7

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IScheduledTaskEmailGenerator | 2 | `OperationsLuxuryApp/ScheduledTasks/Interfaces/IScheduledTaskEmailGenerator.cs` |
| IScheduledTaskService | 9 | `OperationsLuxuryApp/ScheduledTasks/Interfaces/IScheduledTaskService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| ScheduledTaskMapping | 0 | `OperationsLuxuryApp/ScheduledTasks/Mapping/ScheduledTaskMapping.cs` |
| ScheduledTaskEmailGenerator | 2 | `OperationsLuxuryApp/ScheduledTasks/Services/ScheduledTaskEmailGenerator.cs` |
| ScheduledTaskService | 9 | `OperationsLuxuryApp/ScheduledTasks/Services/ScheduledTaskService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GenerateTaskNotificationEmail | IScheduledTaskEmailGenerator | SPECIAL | `string` | `WorkGroup ticketGroup` |
| GenerateContractsPoliciesEmail | IScheduledTaskEmailGenerator | SPECIAL | `string` | `IEnumerable<ContratoPoliza> contracts, Customer customer` |
| SendPendingTicketGroupReportAsync | IScheduledTaskService | SPECIAL | `Task` | `-` |
| SendRecruitmentReportAsync | IScheduledTaskService | SPECIAL | `Task` | `-` |
| SendContractsAndPoliciesExpirationNotificationsAsync | IScheduledTaskService | SPECIAL | `Task` | `-` |
| MarkInactiveUsersOfflineAsync | IScheduledTaskService | OTHER | `Task` | `-` |
| SendVacanciesReportAsync | IScheduledTaskService | SPECIAL | `Task` | `-` |
| SendTestEmailAsync | IScheduledTaskService | SPECIAL | `Task` | `-` |
| SendLegalReportAsync | IScheduledTaskService | SPECIAL | `Task` | `-` |
| SendLegalTicketReportToCustomerAsync | IScheduledTaskService | SPECIAL | `Task` | `-` |
| OnValidateForCustomer | IScheduledTaskService | OTHER | `Task` | `-` |

#### Modulo: ServiceOrders

- Interfaces: 1 | Servicios: 2 | Endpoints: 18 | DTOs: 5

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IServiceOrderAppService | 18 | `OperationsLuxuryApp/ServiceOrders/Interfaces/IServiceOrderAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| ServiceOrderMapper | 0 | `OperationsLuxuryApp/ServiceOrders/Mapping/ServiceOrderMapper.cs` |
| ServiceOrderAppService | 18 | `OperationsLuxuryApp/ServiceOrders/Services/ServiceOrderAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetByIdAsync | IServiceOrderAppService | GET_SINGLE | `Task<ApiResponseDTO<ServiceOrderDTO>>` | `Guid id` |
| GetServiceOrderSupportAsync | IServiceOrderAppService | GET_LIST | `Task<ApiResponseDTO<object>>` | `Guid id` |
| GetServiceOrderInforme | IServiceOrderAppService | GET_LIST | `ApiResponseDTO<IEnumerable<ServiceOrderInfo…` | `Guid customerId, int idMonth, int idYear` |
| OnGetUserSelectItemAsync | IServiceOrderAppService | OTHER | `Task<ApiResponseDTO<SelectItemDTO<string>>>` | `string id` |
| GetAllAsync | IServiceOrderAppService | GET_LIST | `Task<ApiResponseDTO<List<ServiceOrderDTO>>>` | `Guid customerId, DateTime fecha, InventoryCategory? invento…` |
| GetAllPinturaAsync | IServiceOrderAppService | GET_LIST | `Task<ApiResponseDTO<List<ServiceOrderDTO>>>` | `Guid customerId, DateTime fecha` |
| GetPendingPreventiveAsync | IServiceOrderAppService | GET_LIST | `Task<ApiResponseDTO<List<ServiceOrderDTO>>>` | `Guid customerId` |
| AddAsync | IServiceOrderAppService | CREATE | `Task<ApiResponseDTO<ServiceOrder>>` | `ServiceOrderAddOrEditDTO DTO` |
| UpdateCalendarIdAsync | IServiceOrderAppService | UPDATE | `Task<ApiResponseDTO<List<object>>>` | `Guid customerId, DateTime fecha` |
| UpdateCalendarioId | IServiceOrderAppService | UPDATE | `ApiResponseDTO<bool>` | `-` |
| OrdenesServicioFotosAsync | IServiceOrderAppService | OTHER | `Task<ApiResponseDTO<List<object>>>` | `Guid id, Guid customerId` |
| OrdenesServicioReporteProveedorAsync | IServiceOrderAppService | OTHER | `Task<ApiResponseDTO<List<object>>>` | `Guid id, Guid customerId` |
| UpdateAsync | IServiceOrderAppService | UPDATE | `Task<ApiResponseDTO<ServiceOrder>>` | `Guid id, ServiceOrderAddOrEditDTO DTO` |
| SubirImgAsync | IServiceOrderAppService | SPECIAL | `Task<ApiResponseDTO<ServiceOrder>>` | `Guid serviceOrderId, IFormFile[] files` |
| SubirDocumentoAsync | IServiceOrderAppService | SPECIAL | `Task<ApiResponseDTO<ServiceOrder>>` | `Guid serviceOrderId, IFormFile[] files` |
| DeleteDocumentAsync | IServiceOrderAppService | DELETE | `Task<ApiResponseDTO<object>>` | `Guid id` |
| DeleteImgAsync | IServiceOrderAppService | DELETE | `Task<ApiResponseDTO<object>>` | `Guid id` |
| DeleteAsync | IServiceOrderAppService | DELETE | `Task<ApiResponseDTO<object>>` | `Guid id` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/service-orders/{id:guid}` | `appService.GetByIdAsync` | `OperationsLuxuryApp/ServiceOrders/EndPoints/ServiceOrdersEndpoints.cs` |
| GET | `/api/service-orders/soporte-orden-servicio/{id:guid}` | `appService.GetServiceOrderSupportAsync` | `OperationsLuxuryApp/ServiceOrders/EndPoints/ServiceOrdersEndpoints.cs` |
| GET | `/api/service-orders/informe/{customerId:guid}/{idMonth:int}/{idYear:int}` | `appService.OnGetUserSelectItemAsync` | `OperationsLuxuryApp/ServiceOrders/EndPoints/ServiceOrdersEndpoints.cs` |
| GET | `/api/service-orders/on-get-user-select-item/{id}` | `appService.OnGetUserSelectItemAsync` | `OperationsLuxuryApp/ServiceOrders/EndPoints/ServiceOrdersEndpoints.cs` |
| GET | `/api/service-orders/list/{customerId:guid}/{fecha:datetime}` | `appService.GetAllAsync` | `OperationsLuxuryApp/ServiceOrders/EndPoints/ServiceOrdersEndpoints.cs` |
| GET | `/api/service-orders/list-pintura/{customerId:guid}/{fecha:datetime}` | `appService.GetAllPinturaAsync` | `OperationsLuxuryApp/ServiceOrders/EndPoints/ServiceOrdersEndpoints.cs` |
| GET | `/api/service-orders/pending-preventive/{customerId:guid}` | `appService.GetPendingPreventiveAsync` | `OperationsLuxuryApp/ServiceOrders/EndPoints/ServiceOrdersEndpoints.cs` |
| POST | `/api/service-orders` | `appService.AddAsync` | `OperationsLuxuryApp/ServiceOrders/EndPoints/ServiceOrdersEndpoints.cs` |
| POST | `/api/service-orders/reporte-ordenes-servicio/{customerId:guid}/{fecha:datetime}` | `appService.UpdateCalendarIdAsync` | `OperationsLuxuryApp/ServiceOrders/EndPoints/ServiceOrdersEndpoints.cs` |
| POST | `/api/service-orders/update-calendar-id` | `appService.OrdenesServicioFotosAsync` | `OperationsLuxuryApp/ServiceOrders/EndPoints/ServiceOrdersEndpoints.cs` |
| GET | `/api/service-orders/ordenes-servicio-fotos/{id:guid}/{customerId:guid}` | `appService.OrdenesServicioFotosAsync` | `OperationsLuxuryApp/ServiceOrders/EndPoints/ServiceOrdersEndpoints.cs` |
| GET | `/api/service-orders/ordenes-servicio-reporte-proveedor/{id:guid}/{customerId:guid}` | `appService.OrdenesServicioReporteProveedorAsync` | `OperationsLuxuryApp/ServiceOrders/EndPoints/ServiceOrdersEndpoints.cs` |
| PUT | `/api/service-orders/{id:guid}` | `appService.UpdateAsync` | `OperationsLuxuryApp/ServiceOrders/EndPoints/ServiceOrdersEndpoints.cs` |
| POST | `/api/service-orders/subir-img/{serviceOrderId:guid}` | `appService.SubirImgAsync` | `OperationsLuxuryApp/ServiceOrders/EndPoints/ServiceOrdersEndpoints.cs` |
| POST | `/api/service-orders/subir-documento/{serviceOrderId:guid}` | `appService.SubirDocumentoAsync` | `OperationsLuxuryApp/ServiceOrders/EndPoints/ServiceOrdersEndpoints.cs` |
| DELETE | `/api/service-orders/delete-document/{id:guid}` | `appService.DeleteDocumentAsync` | `OperationsLuxuryApp/ServiceOrders/EndPoints/ServiceOrdersEndpoints.cs` |
| DELETE | `/api/service-orders/delete-img/{id:guid}` | `appService.DeleteImgAsync` | `OperationsLuxuryApp/ServiceOrders/EndPoints/ServiceOrdersEndpoints.cs` |
| DELETE | `/api/service-orders/{id:guid}` | `appService.DeleteAsync` | `OperationsLuxuryApp/ServiceOrders/EndPoints/ServiceOrdersEndpoints.cs` |

#### Modulo: Supervision

- Interfaces: 2 | Servicios: 3 | Endpoints: 9 | DTOs: 2

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IAgendaSupervisionAppService | 5 | `OperationsLuxuryApp/Supervision/Supervision/Interfaces/IAgendaSupervisionAppService.cs` |
| ISupervisionReportsAppService | 4 | `OperationsLuxuryApp/Supervision/SupervisionReport/Interfaces/ISupervisionReportsAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| AgendaSupervisionMapper | 0 | `OperationsLuxuryApp/Supervision/Supervision/Mapping/AgendaSupervisionMapper.cs` |
| AgendaSupervisionAppService | 5 | `OperationsLuxuryApp/Supervision/Supervision/Services/AgendaSupervisionAppService.cs` |
| SupervisionReportsAppService | 4 | `OperationsLuxuryApp/Supervision/SupervisionReport/Services/SupervisionReportsAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetByIdAsync | IAgendaSupervisionAppService | GET_SINGLE | `Task<ApiResponseDTO<AgendaSupervisionAddOrE…` | `Guid id` |
| GetAllAsync | IAgendaSupervisionAppService | GET_LIST | `Task<ApiResponseDTO<object>>` | `DateOnly start, DateOnly end` |
| AddAsync | IAgendaSupervisionAppService | CREATE | `Task<ApiResponseDTO<AgendaSupervision>>` | `AgendaSupervisionAddOrEditDTO DTO` |
| UpdateAsync | IAgendaSupervisionAppService | UPDATE | `Task<ApiResponseDTO<AgendaSupervisionDTO>>` | `Guid id, AgendaSupervisionAddOrEditDTO DTO` |
| DeleteByIdAsync | IAgendaSupervisionAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetPendingMinutesAsync | ISupervisionReportsAppService | GET_LIST | `Task<ApiResponseDTO<List<object>>>` | `Guid customerId` |
| GetPendingTicketsAsync | ISupervisionReportsAppService | GET_LIST | `Task<ApiResponseDTO<List<object>>>` | `Guid customerId` |
| GetPendingLegalAsync | ISupervisionReportsAppService | GET_LIST | `Task<ApiResponseDTO<List<object>>>` | `Guid customerId` |
| GetEstadosFinancierosAsync | ISupervisionReportsAppService | GET_LIST | `Task<ApiResponseDTO<List<object>>>` | `Guid customerId` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/agenda-supervision/{id:guid}` | `dataService.GetByIdAsync` | `OperationsLuxuryApp/Supervision/Supervision/EndPoints/AgendaSupervisionEndpoints.cs` |
| GET | `/api/agenda-supervision/list/{start}/{end}` | `dataService.GetAllAsync` | `OperationsLuxuryApp/Supervision/Supervision/EndPoints/AgendaSupervisionEndpoints.cs` |
| POST | `/api/agenda-supervision` | `dataService.AddAsync` | `OperationsLuxuryApp/Supervision/Supervision/EndPoints/AgendaSupervisionEndpoints.cs` |
| PUT | `/api/agenda-supervision/{id:guid}` | `dataService.UpdateAsync` | `OperationsLuxuryApp/Supervision/Supervision/EndPoints/AgendaSupervisionEndpoints.cs` |
| DELETE | `/api/agenda-supervision/{id:guid}` | `dataService.DeleteByIdAsync` | `OperationsLuxuryApp/Supervision/Supervision/EndPoints/AgendaSupervisionEndpoints.cs` |
| GET | `/api/supervision-reports/pending-minutes/{customerId:guid}` | `appService.GetPendingMinutesAsync` | `OperationsLuxuryApp/Supervision/SupervisionReport/EndPoints/SupervisionReportsEndpoints.cs` |
| GET | `/api/supervision-reports/pending-tickets/{customerId:guid}` | `appService.GetPendingTicketsAsync` | `OperationsLuxuryApp/Supervision/SupervisionReport/EndPoints/SupervisionReportsEndpoints.cs` |
| GET | `/api/supervision-reports/pending-legal/{customerId:guid}` | `appService.GetPendingLegalAsync` | `OperationsLuxuryApp/Supervision/SupervisionReport/EndPoints/SupervisionReportsEndpoints.cs` |
| GET | `/api/supervision-reports/estados-financieros/{customerId:guid}` | `appService.GetEstadosFinancierosAsync` | `OperationsLuxuryApp/Supervision/SupervisionReport/EndPoints/SupervisionReportsEndpoints.cs` |

#### Modulo: Task

- Interfaces: 19 | Servicios: 27 | Endpoints: 76 | DTOs: 31

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| ITaskAlertEngineService | 1 | `OperationsLuxuryApp/Task/RecurringTaskAlerting/Interfaces/ITaskAlertEngineService.cs` |
| IRecurringTaskCatalogAppService | 5 | `OperationsLuxuryApp/Task/RecurringTaskCatalog/Interfaces/IRecurringTaskCatalogAppService.cs` |
| IRecurringTaskComplianceAppService | 1 | `OperationsLuxuryApp/Task/RecurringTaskCompliance/Interfaces/IRecurringTaskComplianceAppService.cs` |
| ITaskEscalationService | 1 | `OperationsLuxuryApp/Task/RecurringTaskEscalation/Interfaces/ITaskEscalationService.cs` |
| IRecurringTaskGenerationService | 1 | `OperationsLuxuryApp/Task/RecurringTaskGeneration/Interfaces/IRecurringTaskGenerationService.cs` |
| ITaskAttachmentAppService | 3 | `OperationsLuxuryApp/Task/TaskAttachments/Interfaces/ITaskAttachmentAppService.cs` |
| ITaskChecklistAppService | 4 | `OperationsLuxuryApp/Task/TaskChecklist/Interfaces/ITaskChecklistAppService.cs` |
| ITaskFollowUpAppService | 3 | `OperationsLuxuryApp/Task/TaskFollowUps/Interfaces/ITaskFollowUpAppService.cs` |
| ITaskJustificationService | 4 | `OperationsLuxuryApp/Task/TaskJustifications/Interfaces/ITaskJustificationService.cs` |
| ITaskLegalAppService | 13 | `OperationsLuxuryApp/Task/TaskLegal/Interfaces/ITaskLegalAppService.cs` |
| ITaskMessageReadAppService | 1 | `OperationsLuxuryApp/Task/TaskMessageReads/Interfaces/ITaskMessageReadAppService.cs` |
| IGanttAppService | 1 | `OperationsLuxuryApp/Task/TaskRecords/Interfaces/IGanttAppService.cs` |
| ITaskAppService | 30 | `OperationsLuxuryApp/Task/TaskRecords/Interfaces/ITaskAppService.cs` |
| ITasksReportAppService | 4 | `OperationsLuxuryApp/Task/TaskRecords/Interfaces/ITasksReportAppService.cs` |
| IPendingTaskReportAppService | 1 | `OperationsLuxuryApp/Task/TaskReport/Interfaces/IPendingTaskReportAppService.cs` |
| ITaskWorkPlanAppService | 3 | `OperationsLuxuryApp/Task/TaskWorkPlans/Interfaces/ITaskWorkPlanAppService.cs` |
| ITaskGroupCategoryAppService | 5 | `OperationsLuxuryApp/Task/WorkGroupCategoriesData/Interfaces/ITaskGroupCategoryAppService.cs` |
| ITaskGroupMemberAppService | 5 | `OperationsLuxuryApp/Task/WorkGroupMembers/Interfaces/ITaskGroupMemberAppService.cs` |
| ITaskGroupAppService | 7 | `OperationsLuxuryApp/Task/WorkGroups/Interfaces/ITaskGroupAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| TaskAlertEngineService | 2 | `OperationsLuxuryApp/Task/RecurringTaskAlerting/Services/TaskAlertEngineService.cs` |
| RecurringTaskCatalogMapper | 0 | `OperationsLuxuryApp/Task/RecurringTaskCatalog/Mapping/RecurringTaskCatalogMapper.cs` |
| RecurringTaskCatalogAppService | 5 | `OperationsLuxuryApp/Task/RecurringTaskCatalog/Services/RecurringTaskCatalogAppService.cs` |
| RecurringTaskComplianceAppService | 1 | `OperationsLuxuryApp/Task/RecurringTaskCompliance/Services/RecurringTaskComplianceAppService.cs` |
| TaskEscalationService | 1 | `OperationsLuxuryApp/Task/RecurringTaskEscalation/Services/TaskEscalationService.cs` |
| RecurringTaskGenerationService | 5 | `OperationsLuxuryApp/Task/RecurringTaskGeneration/Services/RecurringTaskGenerationService.cs` |
| TaskAttachmentMapper | 0 | `OperationsLuxuryApp/Task/TaskAttachments/Mapping/TaskAttachmentMapper.cs` |
| TaskAttachmentAppService | 3 | `OperationsLuxuryApp/Task/TaskAttachments/Services/TaskAttachmentAppService.cs` |
| TaskChecklistMapper | 0 | `OperationsLuxuryApp/Task/TaskChecklist/Mapping/TaskChecklistMapper.cs` |
| TaskChecklistAppService | 4 | `OperationsLuxuryApp/Task/TaskChecklist/Services/TaskChecklistAppService.cs` |
| TaskFollowUpAppService | 3 | `OperationsLuxuryApp/Task/TaskFollowUps/Services/TaskFollowUpAppService.cs` |
| TaskJustificationMapper | 0 | `OperationsLuxuryApp/Task/TaskJustifications/Mapping/TaskJustificationMapper.cs` |
| TaskJustificationAppService | 2 | `OperationsLuxuryApp/Task/TaskJustifications/Services/TaskJustificationAppService.cs` |
| TaskLegalMapper | 0 | `OperationsLuxuryApp/Task/TaskLegal/Mapping/TaskLegalMapper.cs` |
| TaskLegalAppService | 13 | `OperationsLuxuryApp/Task/TaskLegal/Services/TaskLegalAppService.cs` |
| TaskMessageReadAppService | 1 | `OperationsLuxuryApp/Task/TaskMessageReads/Services/TaskMessageReadAppService.cs` |
| TasksMapper | 0 | `OperationsLuxuryApp/Task/TaskRecords/Mapping/TasksMapper.cs` |
| GanttAppService | 1 | `OperationsLuxuryApp/Task/TaskRecords/Services/GanttAppService.cs` |
| TaskAppService | 31 | `OperationsLuxuryApp/Task/TaskRecords/Services/TaskAppService.cs` |
| TasksReportAppService | 4 | `OperationsLuxuryApp/Task/TaskRecords/Services/TasksReportAppService.cs` |
| PendingTaskReportAppService | 1 | `OperationsLuxuryApp/Task/TaskReport/Services/PendingTaskReportAppService.cs` |
| TaskWorkPlanAppService | 3 | `OperationsLuxuryApp/Task/TaskWorkPlans/Services/TaskWorkPlanAppService.cs` |
| TaskGroupCategoryMapper | 0 | `OperationsLuxuryApp/Task/WorkGroupCategoriesData/Mapping/WorkGroupCategoriesMapper.cs` |
| TaskGroupCategoryAppService | 5 | `OperationsLuxuryApp/Task/WorkGroupCategoriesData/Services/TaskGroupCategoryAppService.cs` |
| TaskGroupMemberAppService | 5 | `OperationsLuxuryApp/Task/WorkGroupMembers/Services/TaskGroupMemberAppService.cs` |
| WorkGroupMapper | 0 | `OperationsLuxuryApp/Task/WorkGroups/Mapping/WorkGroupMapper.cs` |
| TaskGroupAppService | 7 | `OperationsLuxuryApp/Task/WorkGroups/Services/TaskGroupAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| RunAsync | ITaskAlertEngineService | SPECIAL | `Task<TaskAlertEngineRunResult>` | `-` |
| GetByIdAsync | IRecurringTaskCatalogAppService | GET_SINGLE | `Task<ApiResponseDTO<RecurringTaskTemplateDT…` | `Guid id` |
| GetAllByCustomerAsync | IRecurringTaskCatalogAppService | GET_LIST | `Task<ApiResponseDTO<List<RecurringTaskTempl…` | `Guid customerId, Guid? workGroupId, bool activeOnly` |
| CreateAsync | IRecurringTaskCatalogAppService | CREATE | `Task<ApiResponseDTO<RecurringTaskTemplateDT…` | `RecurringTaskTemplateAddOrEditDTO dto` |
| UpdateAsync | IRecurringTaskCatalogAppService | UPDATE | `Task<ApiResponseDTO<RecurringTaskTemplateDT…` | `Guid id, RecurringTaskTemplateAddOrEditDTO dto` |
| ToggleStatusAsync | IRecurringTaskCatalogAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetDashboardAsync | IRecurringTaskComplianceAppService | GET_LIST | `Task<ApiResponseDTO<ComplianceDashboardDTO>>` | `Guid customerId` |
| RunAsync | ITaskEscalationService | SPECIAL | `Task<TaskEscalationRunResult>` | `-` |
| GenerateAsync | IRecurringTaskGenerationService | SPECIAL | `Task<RecurringTaskGenerationRunResult>` | `-` |
| GetByTaskIdAsync | ITaskAttachmentAppService | GET_LIST | `Task<ApiResponseDTO<List<TaskAttachmentFile…` | `Guid tasksId` |
| UploadAsync | ITaskAttachmentAppService | SPECIAL | `Task<ApiResponseDTO<TaskAttachmentFileDTO>>` | `TaskAttachmentUploadDTO dto` |
| DeleteAsync | ITaskAttachmentAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetByTaskIdAsync | ITaskChecklistAppService | GET_LIST | `Task<ApiResponseDTO<List<TaskChecklistItemD…` | `Guid tasksId` |
| AddAsync | ITaskChecklistAppService | CREATE | `Task<ApiResponseDTO<TaskChecklistItemDTO>>` | `TaskChecklistItemAddDTO dto` |
| ToggleDoneAsync | ITaskChecklistAppService | SPECIAL | `Task<ApiResponseDTO<TaskChecklistItemDTO>>` | `Guid id` |
| DeleteAsync | ITaskChecklistAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| ListAsync | ITaskFollowUpAppService | GET_LIST | `Task<ApiResponseDTO<List<TaskFollowUpDTO>>>` | `Guid TaskGroupId` |
| AddAsync | ITaskFollowUpAppService | CREATE | `Task<ApiResponseDTO<bool>>` | `TaskFollowUpAddOrEditDTO DTO` |
| DeleteAsync | ITaskFollowUpAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetByTaskIdAsync | ITaskJustificationService | GET_LIST | `Task<ApiResponseDTO<List<TaskJustificationD…` | `Guid tasksId` |
| RequestAsync | ITaskJustificationService | OTHER | `Task<ApiResponseDTO<TaskJustificationDTO>>` | `TaskJustificationRequestDTO dto` |
| ApproveAsync | ITaskJustificationService | SPECIAL | `Task<ApiResponseDTO<TaskJustificationDTO>>` | `Guid id` |
| RejectAsync | ITaskJustificationService | SPECIAL | `Task<ApiResponseDTO<TaskJustificationDTO>>` | `Guid id` |
| CreateLegalTaskAsync | ITaskLegalAppService | CREATE | `Task<ApiResponseDTO<bool>>` | `TaskLegalAddDTO data` |
| GetListEmployeeLegal | ITaskLegalAppService | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<stri…` | `-` |
| GetListLegalMatter | ITaskLegalAppService | GET_LIST | `Task<ApiResponseDTO<List<LegalMatterCategor…` | `-` |
| CreatePdf | ITaskLegalAppService | CREATE | `void` | `string filePath, dynamic reportData, string logoPath, DateT…` |
| ObtenerResumenTickets | ITaskLegalAppService | GET_LIST | `Task<ApiResponseDTO<object>>` | `DateTime startDate, DateTime endDate, bool isInternal` |
| GetlegalMatterAddDTOAsync | ITaskLegalAppService | OTHER | `Task<ApiResponseDTO<LegalMatterAddDTO>>` | `Guid id` |
| AddAsync | ITaskLegalAppService | CREATE | `Task<ApiResponseDTO<object>>` | `LegalMatterAddDTO DTO` |
| UpdateAsync | ITaskLegalAppService | UPDATE | `Task<ApiResponseDTO<object>>` | `Guid id, LegalMatterAddDTO DTO` |
| DeleteByIdAsync | ITaskLegalAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| CategoryAsync | ITaskLegalAppService | OTHER | `Task<ApiResponseDTO<LegalMatterCategoryAddO…` | `Guid id` |
| CreateCategoryAsync | ITaskLegalAppService | CREATE | `Task<ApiResponseDTO<LegalMatterCategory>>` | `LegalMatterCategoryAddOrEditDTO DTO` |
| UpdateCategoryAsync | ITaskLegalAppService | UPDATE | `Task<ApiResponseDTO<LegalMatterCategory>>` | `Guid id, LegalMatterCategoryAddOrEditDTO DTO` |
| DeleteCategoryByIdAsync | ITaskLegalAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetByTaskMessageIdAsync | ITaskMessageReadAppService | GET_LIST | `Task<ApiResponseDTO<List<object>>>` | `Guid taskMessageId` |
| GetGanttDataByCustomerIdAsync | IGanttAppService | GET_LIST | `Task<ApiResponseDTO<List<GanttTaskDTO>>>` | `Guid customerId` |
| GetByIdWithGroupAsync | ITaskAppService | GET_LIST | `Task<ApiResponseDTO<TasksAddOrEditDTO>>` | `Guid id` |
| GetByIdTaskViewDTO | ITaskAppService | GET_LIST | `Task<ApiResponseDTO<TasksViewDTO>>` | `Guid id` |
| ListTaskAsync | ITaskAppService | GET_LIST | `Task<ApiResponseDTO<TasksListDTO>>` | `Guid TaskGroupId, GanttStatus status, PaginationCommonDTO p…` |
| CreateTaskAsync | ITaskAppService | CREATE | `Task<ApiResponseDTO<TasksAddOrEditDTO>>` | `TasksAddOrEditDTO DTO` |
| UpdateTaskAsync | ITaskAppService | UPDATE | `Task<ApiResponseDTO<TasksAddOrEditDTO>>` | `Guid id, TasksAddOrEditDTO DTO` |
| CloseTaskAsync | ITaskAppService | SPECIAL | `Task<ApiResponseDTO<TasksCloseDTO>>` | `Guid id, TasksCloseDTO DTO` |
| GetListMyAssignedTasksAsync | ITaskAppService | GET_LIST | `Task<ApiResponseDTO<IEnumerable<MyAssignedT…` | `string applicationUserId, GanttStatus status, Guid customer…` |
| GetTasksByCustomerAsync | ITaskAppService | GET_LIST | `Task<ApiResponseDTO<IEnumerable<TaskMonitor…` | `Guid customerId` |
| GetListMyRequestAsync | ITaskAppService | GET_LIST | `Task<ApiResponseDTO<IEnumerable<MyRequestTa…` | `string applicationUserId, GanttStatus Status, Guid customer…` |
| OnUpdatePriority | ITaskAppService | OTHER | `Task<ApiResponseDTO<bool>>` | `Guid taskId, string applicationUserId` |
| DeleteTaskAsync | ITaskAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id, Guid customerId` |
| UpdateRelevanceAsync | ITaskAppService | UPDATE | `Task<ApiResponseDTO<TasksAddOrEditDTO>>` | `Guid id` |
| ProgramationGetByIdAsync | ITaskAppService | OTHER | `Task<ApiResponseDTO<object>>` | `Guid id` |
| ProgramationAsync | ITaskAppService | OTHER | `Task<ApiResponseDTO<bool>>` | `Guid id, TasksProgramationDTO DTO` |
| MyTaskProgramationAsync | ITaskAppService | OTHER | `Task<ApiResponseDTO<bool>>` | `Guid id, MyTasksProgramationDTO DTO` |
| GetByClosedAsync | ITaskAppService | GET_LIST | `Task<ApiResponseDTO<TasksCloseDTO>>` | `Guid id` |
| InProgressAsync | ITaskAppService | OTHER | `Task<ApiResponseDTO<bool>>` | `Guid taskId, string applicationUserId` |
| ReopenAsync | ITaskAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `TasksReopenDTO DTO` |
| ParticipanAsync | ITaskAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<stri…` | `Guid TaskGroupId` |
| GetPathReportAsync | ITaskAppService | GET_LIST | `Task<ApiResponseDTO<string>>` | `Guid customerId, int year, int numeroSemana` |
| UpdateOrderAsync | ITaskAppService | UPDATE | `Task<ApiResponseDTO<bool>>` | `List<Guid> ids` |
| GetLegalTasksAllAsync | ITaskAppService | GET_LIST | `Task<ApiResponseDTO<List<LegalTaskListItemD…` | `Guid? customerId = null` |
| GetLegalTasksByCustomerAsync | ITaskAppService | GET_LIST | `Task<ApiResponseDTO<List<LegalTaskListItemD…` | `-` |
| GetTaskStatusAsync | ITaskAppService | GET_LIST | `Task<ApiResponseDTO<int>>` | `Guid id` |
| UpdateTaskStatusAsync | ITaskAppService | UPDATE | `Task<ApiResponseDTO<bool>>` | `Guid id, GanttStatus status` |
| GetLegalPendingReportAsync | ITaskAppService | GET_LIST | `Task<ApiResponseDTO<List<LegalPendingReport…` | `bool? isInternal, bool unassigned` |
| GetAvailablePredecessorsAsync | ITaskAppService | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<stri…` | `Guid groupId, Guid? excludeId` |
| SetDependencyAsync | ITaskAppService | UPDATE | `Task<ApiResponseDTO<bool>>` | `Guid taskId, Guid predecessorId` |
| ClearDependencyAsync | ITaskAppService | OTHER | `Task<ApiResponseDTO<bool>>` | `Guid taskId` |
| UpdateTaskCustomerAsync | ITaskAppService | UPDATE | `Task<ApiResponseDTO<bool>>` | `Guid id, Guid customerId` |
| GetTaskReportAsync | ITasksReportAppService | GET_LIST | `Task<ApiResponseDTO<object>>` | `Guid customerId, DateTime startDate, DateTime endDate` |
| WeeklyReportAsync | ITasksReportAppService | OTHER | `Task<ApiResponseDTO<object>>` | `Guid customerId, DateTime startDate, DateTime endDate, Gant…` |
| WeeklyReportPreviewAsync | ITasksReportAppService | OTHER | `Task<ApiResponseDTO<object>>` | `Guid customerId, int year, int weekNumber, Guid? workGroupI…` |
| GetReportClientAsync | ITasksReportAppService | GET_LIST | `Task<ApiResponseDTO<object>>` | `Guid customerId, DateTime fechaInicial, DateTime fechaFinal` |
| SendPendingTaskReportAsync | IPendingTaskReportAppService | SPECIAL | `Task` | `Guid customerId, Guid TaskGroupId` |
| GetPendingAsync | ITaskWorkPlanAppService | GET_LIST | `Task<ApiResponseDTO<List<object>>>` | `Guid customerId` |
| WeeklyReportPreviewAsync | ITaskWorkPlanAppService | OTHER | `Task<ApiResponseDTO<object>>` | `Guid customerId, int year, int numeroSemana` |
| CreateWeeklyWorkPlanAsync | ITaskWorkPlanAppService | CREATE | `Task<ApiResponseDTO<TaskWorkPlan>>` | `string applicationUserId, Guid customerId, int year, int we…` |
| GetByIdAsync | ITaskGroupCategoryAppService | GET_SINGLE | `Task<ApiResponseDTO<TaskGroupCategoryAddOrE…` | `Guid id` |
| GetAllAsync | ITaskGroupCategoryAppService | GET_LIST | `Task<ApiResponseDTO<TaskGroupCategoryDTO[]>>` | `-` |
| AddAsync | ITaskGroupCategoryAppService | CREATE | `Task<ApiResponseDTO<TaskGroupCategoryDTO>>` | `TaskGroupCategoryAddOrEditDTO DTO` |
| UpdateAsync | ITaskGroupCategoryAppService | UPDATE | `Task<ApiResponseDTO<TaskGroupCategoryDTO>>` | `Guid id, TaskGroupCategoryAddOrEditDTO DTO` |
| DeleteByIdAsync | ITaskGroupCategoryAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetExistingParticipantsAsync | ITaskGroupMemberAppService | GET_LIST | `Task<ApiResponseDTO<List<WorkGroupMembersDT…` | `Guid TaskGroupId` |
| GetAvailableParticipantsAsync | ITaskGroupMemberAppService | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<stri…` | `Guid customerId, Guid TaskGroupId` |
| AddAsync | ITaskGroupMemberAppService | CREATE | `Task<ApiResponseDTO<bool>>` | `WorkGroupMembersAddOrEditDTO DTO` |
| UpdateAsync | ITaskGroupMemberAppService | UPDATE | `Task<ApiResponseDTO<bool>>` | `Guid id, WorkGroupMembersAddOrEditDTO DTO` |
| DeleteAsync | ITaskGroupMemberAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetCustomerIdByTaskGroupIdAsync | ITaskGroupAppService | GET_LIST | `Task<ApiResponseDTO<Guid>>` | `Guid TaskGroupId` |
| GetByIdAsync | ITaskGroupAppService | GET_SINGLE | `Task<ApiResponseDTO<TaskGroupAddOrEditDTO>>` | `Guid id` |
| GetAllByClientAsync | ITaskGroupAppService | GET_LIST | `Task<ApiResponseDTO<List<TaskGroupDTO>>>` | `Guid customerId, bool state, string applicationUserId` |
| CreateAsync | ITaskGroupAppService | CREATE | `Task<ApiResponseDTO<WorkGroup>>` | `TaskGroupAddOrEditDTO DTO` |
| UpdateAsync | ITaskGroupAppService | UPDATE | `Task<ApiResponseDTO<TaskGroupAddOrEditDTO>>` | `Guid id, TaskGroupAddOrEditDTO DTO` |
| ToggleStatusAsync | ITaskGroupAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| DeleteByIdAsync | ITaskGroupAppService | DELETE | `Task<ApiResponseDTO<WorkGroup>>` | `Guid id` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/recurring-task-templates/{id:guid}` | `appService.GetByIdAsync` | `OperationsLuxuryApp/Task/RecurringTaskCatalog/EndPoints/RecurringTaskTemplatesEndPoints.cs` |
| GET | `/api/recurring-task-templates/list/{customerId:guid}` | `appService.GetAllByCustomerAsync` | `OperationsLuxuryApp/Task/RecurringTaskCatalog/EndPoints/RecurringTaskTemplatesEndPoints.cs` |
| POST | `/api/recurring-task-templates` | `appService.CreateAsync` | `OperationsLuxuryApp/Task/RecurringTaskCatalog/EndPoints/RecurringTaskTemplatesEndPoints.cs` |
| PUT | `/api/recurring-task-templates/{id:guid}` | `appService.UpdateAsync` | `OperationsLuxuryApp/Task/RecurringTaskCatalog/EndPoints/RecurringTaskTemplatesEndPoints.cs` |
| PATCH | `/api/recurring-task-templates/toggle-status/{id:guid}` | `appService.ToggleStatusAsync` | `OperationsLuxuryApp/Task/RecurringTaskCatalog/EndPoints/RecurringTaskTemplatesEndPoints.cs` |
| GET | `/api/recurring-task-compliance/dashboard/{customerId:guid}` | `appService.GetDashboardAsync` | `OperationsLuxuryApp/Task/RecurringTaskCompliance/EndPoints/RecurringTaskComplianceEndPoints.cs` |
| GET | `/api/task-attachments/by-task/{tasksId:guid}` | `appService.GetByTaskIdAsync` | `OperationsLuxuryApp/Task/TaskAttachments/EndPoints/TaskAttachmentsEndPoints.cs` |
| POST | `/api/task-attachments` | `appService.UploadAsync` | `OperationsLuxuryApp/Task/TaskAttachments/EndPoints/TaskAttachmentsEndPoints.cs` |
| DELETE | `/api/task-attachments/{id:guid}` | `appService.DeleteAsync` | `OperationsLuxuryApp/Task/TaskAttachments/EndPoints/TaskAttachmentsEndPoints.cs` |
| GET | `/api/task-checklist-items/by-task/{tasksId:guid}` | `appService.GetByTaskIdAsync` | `OperationsLuxuryApp/Task/TaskChecklist/EndPoints/TaskChecklistItemsEndPoints.cs` |
| POST | `/api/task-checklist-items` | `appService.AddAsync` | `OperationsLuxuryApp/Task/TaskChecklist/EndPoints/TaskChecklistItemsEndPoints.cs` |
| PATCH | `/api/task-checklist-items/toggle-done/{id:guid}` | `appService.ToggleDoneAsync` | `OperationsLuxuryApp/Task/TaskChecklist/EndPoints/TaskChecklistItemsEndPoints.cs` |
| DELETE | `/api/task-checklist-items/{id:guid}` | `appService.DeleteAsync` | `OperationsLuxuryApp/Task/TaskChecklist/EndPoints/TaskChecklistItemsEndPoints.cs` |
| GET | `/api/task-follow-up/list/{TaskGroupId:guid}` | `appService.ListAsync` | `OperationsLuxuryApp/Task/TaskFollowUps/EndPoints/TaskMessageFollowUpEndpoints.cs` |
| POST | `/api/task-follow-up` | `appService.AddAsync` | `OperationsLuxuryApp/Task/TaskFollowUps/EndPoints/TaskMessageFollowUpEndpoints.cs` |
| DELETE | `/api/task-follow-up/{id:guid}` | `appService.DeleteAsync` | `OperationsLuxuryApp/Task/TaskFollowUps/EndPoints/TaskMessageFollowUpEndpoints.cs` |
| GET | `/api/task-justifications/by-task/{tasksId:guid}` | `appService.GetByTaskIdAsync` | `OperationsLuxuryApp/Task/TaskJustifications/EndPoints/TaskJustificationsEndPoints.cs` |
| POST | `/api/task-justifications` | `appService.RequestAsync` | `OperationsLuxuryApp/Task/TaskJustifications/EndPoints/TaskJustificationsEndPoints.cs` |
| PATCH | `/api/task-justifications/{id:guid}/approve` | `appService.ApproveAsync` | `OperationsLuxuryApp/Task/TaskJustifications/EndPoints/TaskJustificationsEndPoints.cs` |
| PATCH | `/api/task-justifications/{id:guid}/reject` | `appService.RejectAsync` | `OperationsLuxuryApp/Task/TaskJustifications/EndPoints/TaskJustificationsEndPoints.cs` |
| GET | `/api/task-message-read/list/{TaskId:guid}` | `appService.GetByTaskMessageIdAsync` | `OperationsLuxuryApp/Task/TaskMessageReads/EndPoints/TaskMessageReadEndpoints.cs` |
| GET | `/api/gantt/{customerId:guid}` | `appService.GetGanttDataByCustomerIdAsync` | `OperationsLuxuryApp/Task/TaskRecords/EndPoints/GanttEndpoints.cs` |
| GET | `/api/tasks/{id:guid}` | `appService.GetByIdWithGroupAsync` | `OperationsLuxuryApp/Task/TaskRecords/EndPoints/TasksEndpoints.cs` |
| POST | `/api/tasks/send-report-pending/{taskGroupId:guid}` | `taskSendReportAppService.SendReportPendingTicketGroupAsync` | `OperationsLuxuryApp/Task/TaskRecords/EndPoints/TasksEndpoints.cs` |
| GET | `/api/tasks/view/{id:guid}` | `appService.ListTaskAsync` | `OperationsLuxuryApp/Task/TaskRecords/EndPoints/TasksEndpoints.cs` |
| GET | `/api/tasks/list/{taskGroupId:guid}/{status}` | `appService.ListTaskAsync` | `OperationsLuxuryApp/Task/TaskRecords/EndPoints/TasksEndpoints.cs` |
| POST | `/api/tasks/create` | `appService.CreateTaskAsync` | `OperationsLuxuryApp/Task/TaskRecords/EndPoints/TasksEndpoints.cs` |
| PUT | `/api/tasks/update/{id:guid}` | `appService.UpdateTaskAsync` | `OperationsLuxuryApp/Task/TaskRecords/EndPoints/TasksEndpoints.cs` |
| GET | `/api/tasks/update-relevance/{id:guid}` | `appService.UpdateRelevanceAsync` | `OperationsLuxuryApp/Task/TaskRecords/EndPoints/TasksEndpoints.cs` |
| GET | `/api/tasks/programation/{id:guid}` | `appService.ProgramationGetByIdAsync` | `OperationsLuxuryApp/Task/TaskRecords/EndPoints/TasksEndpoints.cs` |
| POST | `/api/tasks/programation/{id:guid}` | `appService.ProgramationAsync` | `OperationsLuxuryApp/Task/TaskRecords/EndPoints/TasksEndpoints.cs` |
| POST | `/api/tasks/my-task/programation/{id:guid}` | `appService.MyTaskProgramationAsync` | `OperationsLuxuryApp/Task/TaskRecords/EndPoints/TasksEndpoints.cs` |
| GET | `/api/tasks/get-by-closed/{id:guid}` | `appService.GetByClosedAsync` | `OperationsLuxuryApp/Task/TaskRecords/EndPoints/TasksEndpoints.cs` |
| PUT | `/api/tasks/closed/{id:guid}` | `appService.CloseTaskAsync` | `OperationsLuxuryApp/Task/TaskRecords/EndPoints/TasksEndpoints.cs` |
| GET | `/api/tasks/in-progress/{taskId:guid}/{applicationUserId}` | `appService.InProgressAsync` | `OperationsLuxuryApp/Task/TaskRecords/EndPoints/TasksEndpoints.cs` |
| POST | `/api/tasks/reopen` | `appService.ReopenAsync` | `OperationsLuxuryApp/Task/TaskRecords/EndPoints/TasksEndpoints.cs` |
| GET | `/api/tasks/participant/{taskGroupId:guid}` | `appService.ParticipanAsync` | `OperationsLuxuryApp/Task/TaskRecords/EndPoints/TasksEndpoints.cs` |
| GET | `/api/tasks/update-priority/{taskId:guid}/{applicationUserId}` | `appService.GetListMyAssignedTasksAsync` | `OperationsLuxuryApp/Task/TaskRecords/EndPoints/TasksEndpoints.cs` |
| GET | `/api/tasks/my-assigned-tasks/{applicationUserId}/{status}/{customerId:guid}` | `appService.GetListMyAssignedTasksAsync` | `OperationsLuxuryApp/Task/TaskRecords/EndPoints/TasksEndpoints.cs` |
| GET | `/api/tasks/my-request/{applicationUserId}/{status}/{customerId:guid}` | `appService.GetListMyRequestAsync` | `OperationsLuxuryApp/Task/TaskRecords/EndPoints/TasksEndpoints.cs` |
| GET | `/api/tasks/legal/all` | `appService.GetLegalTasksAllAsync` | `OperationsLuxuryApp/Task/TaskRecords/EndPoints/TasksEndpoints.cs` |
| GET | `/api/tasks/legal/pending` | `appService.GetLegalPendingReportAsync` | `OperationsLuxuryApp/Task/TaskRecords/EndPoints/TasksEndpoints.cs` |
| GET | `/api/tasks/legal/customer` | `appService.GetLegalTasksByCustomerAsync` | `OperationsLuxuryApp/Task/TaskRecords/EndPoints/TasksEndpoints.cs` |
| GET | `/api/tasks/{id:guid}/status` | `appService.GetTaskStatusAsync` | `OperationsLuxuryApp/Task/TaskRecords/EndPoints/TasksEndpoints.cs` |
| PATCH | `/api/tasks/{id:guid}/status` | `appService.UpdateTaskStatusAsync` | `OperationsLuxuryApp/Task/TaskRecords/EndPoints/TasksEndpoints.cs` |
| PATCH | `/api/tasks/{id:guid}/customer` | `appService.UpdateTaskCustomerAsync` | `OperationsLuxuryApp/Task/TaskRecords/EndPoints/TasksEndpoints.cs` |
| GET | `/api/tasks/set-predecessor/{taskId:guid}/{predecessorId:guid}` | `appService.SetDependencyAsync` | `OperationsLuxuryApp/Task/TaskRecords/EndPoints/TasksEndpoints.cs` |
| GET | `/api/tasks/clear-predecessor/{taskId:guid}` | `appService.ClearDependencyAsync` | `OperationsLuxuryApp/Task/TaskRecords/EndPoints/TasksEndpoints.cs` |
| GET | `/api/tasks/available-predecessors/{groupId:guid}` | `appService.GetAvailablePredecessorsAsync` | `OperationsLuxuryApp/Task/TaskRecords/EndPoints/TasksEndpoints.cs` |
| DELETE | `/api/tasks/{id:guid}/{customerId:guid}` | `appService.DeleteTaskAsync` | `OperationsLuxuryApp/Task/TaskRecords/EndPoints/TasksEndpoints.cs` |
| GET | `/api/tasks/path-report/{customerId:guid}/{year:int}/{numeroSemana:int}` | `appService.GetPathReportAsync` | `OperationsLuxuryApp/Task/TaskRecords/EndPoints/TasksEndpoints.cs` |
| PUT | `/api/tasks/update-order` | `appService.UpdateOrderAsync` | `OperationsLuxuryApp/Task/TaskRecords/EndPoints/TasksEndpoints.cs` |
| GET | `/api/tasks/all-by-customer/{customerId:guid}` | `appService.GetTasksByCustomerAsync` | `OperationsLuxuryApp/Task/TaskRecords/EndPoints/TasksEndpoints.cs` |
| GET | `/api/task-report/get-task-report/{customerId:guid}/{startDate}/{endDate}` | `appService.GetTaskReportAsync` | `OperationsLuxuryApp/Task/TaskReport/EndPoints/TaskReportEndpoints.cs` |
| GET | `/api/task-report/weekly-report/{customerId:guid}/{startDate}/{endDate}/{status}` | `appService.WeeklyReportAsync` | `OperationsLuxuryApp/Task/TaskReport/EndPoints/TaskReportEndpoints.cs` |
| GET | `/api/task-report/weekly-report-preview/{customerId:guid}/{year:int}/{weekNumber:int}` | `appService.WeeklyReportPreviewAsync` | `OperationsLuxuryApp/Task/TaskReport/EndPoints/TaskReportEndpoints.cs` |
| GET | `/api/task-report/get-report-client/{customerId:guid}/{fechaInicial}/{fechaFinal}` | `appService.GetReportClientAsync` | `OperationsLuxuryApp/Task/TaskReport/EndPoints/TaskReportEndpoints.cs` |
| GET | `/api/task-work-plan/pending/{customerId:guid}` | `dataService.GetPendingAsync` | `OperationsLuxuryApp/Task/TaskWorkPlans/EndPoints/TaskWorkPlanEndpoints.cs` |
| GET | `/api/task-work-plan/preview/{customerId:guid}/{year:int}/{weekNumber:int}` | `dataService.WeeklyReportPreviewAsync` | `OperationsLuxuryApp/Task/TaskWorkPlans/EndPoints/TaskWorkPlanEndpoints.cs` |
| GET | `/api/task-work-plan/create/{applicationUserId}/{customerId:guid}/{year:int}/{weekNumber:int}` | `dataService.CreateWeeklyWorkPlanAsync` | `OperationsLuxuryApp/Task/TaskWorkPlans/EndPoints/TaskWorkPlanEndpoints.cs` |
| GET | `/api/task-group-categories/{id:guid}` | `appService.GetByIdAsync` | `OperationsLuxuryApp/Task/WorkGroupCategoriesData/EndPoints/TaskGroupCategoriesEndpoints.cs` |
| GET | `/api/task-group-categories` | `appService.GetAllAsync` | `OperationsLuxuryApp/Task/WorkGroupCategoriesData/EndPoints/TaskGroupCategoriesEndpoints.cs` |
| POST | `/api/task-group-categories` | `appService.AddAsync` | `OperationsLuxuryApp/Task/WorkGroupCategoriesData/EndPoints/TaskGroupCategoriesEndpoints.cs` |
| PUT | `/api/task-group-categories/{id:guid}` | `appService.UpdateAsync` | `OperationsLuxuryApp/Task/WorkGroupCategoriesData/EndPoints/TaskGroupCategoriesEndpoints.cs` |
| DELETE | `/api/task-group-categories/{id:guid}` | `appService.DeleteByIdAsync` | `OperationsLuxuryApp/Task/WorkGroupCategoriesData/EndPoints/TaskGroupCategoriesEndpoints.cs` |
| GET | `/api/task-group-participant/{TaskGroupId:guid}` | `appService.GetExistingParticipantsAsync` | `OperationsLuxuryApp/Task/WorkGroupMembers/EndPoints/TaskGroupParticipantEndpoints.cs` |
| GET | `/api/task-group-participant/participants/{customerId:guid}/{TaskGroupId:guid}` | `appService.GetAvailableParticipantsAsync` | `OperationsLuxuryApp/Task/WorkGroupMembers/EndPoints/TaskGroupParticipantEndpoints.cs` |
| POST | `/api/task-group-participant` | `appService.AddAsync` | `OperationsLuxuryApp/Task/WorkGroupMembers/EndPoints/TaskGroupParticipantEndpoints.cs` |
| PUT | `/api/task-group-participant/{id:guid}` | `appService.UpdateAsync` | `OperationsLuxuryApp/Task/WorkGroupMembers/EndPoints/TaskGroupParticipantEndpoints.cs` |
| DELETE | `/api/task-group-participant/{id:guid}` | `appService.DeleteAsync` | `OperationsLuxuryApp/Task/WorkGroupMembers/EndPoints/TaskGroupParticipantEndpoints.cs` |
| GET | `/api/task-groups/{id:guid}` | `appService.GetByIdAsync` | `OperationsLuxuryApp/Task/WorkGroups/EndPoints/TaskGroupsEndpoints.cs` |
| GET | `/api/task-groups/list/{customerId:guid}/{state:bool}/{applicationUserId}` | `appService.GetAllByClientAsync` | `OperationsLuxuryApp/Task/WorkGroups/EndPoints/TaskGroupsEndpoints.cs` |
| POST | `/api/task-groups` | `appService.CreateAsync` | `OperationsLuxuryApp/Task/WorkGroups/EndPoints/TaskGroupsEndpoints.cs` |
| PUT | `/api/task-groups/{id:guid}` | `appService.UpdateAsync` | `OperationsLuxuryApp/Task/WorkGroups/EndPoints/TaskGroupsEndpoints.cs` |
| PATCH | `/api/task-groups/toggle-status/{id:guid}` | `appService.ToggleStatusAsync` | `OperationsLuxuryApp/Task/WorkGroups/EndPoints/TaskGroupsEndpoints.cs` |
| DELETE | `/api/task-groups/{id:guid}` | `appService.DeleteByIdAsync` | `OperationsLuxuryApp/Task/WorkGroups/EndPoints/TaskGroupsEndpoints.cs` |


### Grupo: ReclutamientoLuxuryApp

#### Modulo: Candidates

- Interfaces: 4 | Servicios: 6 | Endpoints: 0 | DTOs: 32

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| ICandidateAutomationService | 1 | `ReclutamientoLuxuryApp/Candidates/CandidateApplications/Interfaces/ICandidateAutomationService.cs` |
| ICandidateAppService | 12 | `ReclutamientoLuxuryApp/Candidates/CandidateCore/Interfaces/ICandidateAppService.cs` |
| ICandidateProcessAppService | 32 | `ReclutamientoLuxuryApp/Candidates/CandidateProcesses/Interfaces/ICandidateProcessAppService.cs` |
| ICandidateWorkExperienceAppService | 4 | `ReclutamientoLuxuryApp/Candidates/CandidatesWorkExperience/Interfaces/ICandidateWorkExperienceAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| CandidateAutomationService | 1 | `ReclutamientoLuxuryApp/Candidates/CandidateApplications/Services/CandidateAutomationService.cs` |
| CandidateMapping | 0 | `ReclutamientoLuxuryApp/Candidates/CandidateCore/Mappings/CandidateMapping.cs` |
| CandidateAppService | 12 | `ReclutamientoLuxuryApp/Candidates/CandidateCore/Services/CandidateAppService.cs` |
| CandidateProcessAppService | 32 | `ReclutamientoLuxuryApp/Candidates/CandidateProcesses/Services/CandidateProcessAppService.cs` |
| CandidateWorkExperienceMapping | 0 | `ReclutamientoLuxuryApp/Candidates/CandidatesWorkExperience/Mappings/CandidateWorkExperienceMapping.cs` |
| CandidateWorkExperienceAppService | 4 | `ReclutamientoLuxuryApp/Candidates/CandidatesWorkExperience/Services/CandidateWorkExperienceAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| ExecuteDailyMonitoringAsync | ICandidateAutomationService | SPECIAL | `Task` | `-` |
| GetListAsync | ICandidateAppService | GET_LIST | `Task<ApiResponseDTO<List<CandidateListItemD…` | `PaginationCommonDTO pagination` |
| GetFormerEmployeesAsync | ICandidateAppService | GET_LIST | `Task<ApiResponseDTO<List<FormerEmployeeTale…` | `PaginationCommonDTO pagination, Guid? customerId, bool? isA…` |
| EnsureCandidateFromFormerEmployeeAsync | ICandidateAppService | SPECIAL | `Task<ApiResponseDTO<FormerEmployeeCandidate…` | `Guid employeeId` |
| GetByIdAsync | ICandidateAppService | GET_SINGLE | `Task<ApiResponseDTO<CandidateDetailDTO>>` | `Guid id` |
| GetDeleteImpactAsync | ICandidateAppService | GET_LIST | `Task<ApiResponseDTO<CandidateDeleteImpactDT…` | `Guid id` |
| CreateAsync | ICandidateAppService | CREATE | `Task<ApiResponseDTO<CandidateDetailDTO>>` | `CandidateCreateOrUpdateDTO dto` |
| UpdateAsync | ICandidateAppService | UPDATE | `Task<ApiResponseDTO<CandidateDetailDTO>>` | `Guid id, CandidateCreateOrUpdateDTO dto` |
| DeleteAsync | ICandidateAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| ArchiveAsync | ICandidateAppService | OTHER | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| UnarchiveAsync | ICandidateAppService | OTHER | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| SearchByPhoneAsync | ICandidateAppService | GET_LIST | `Task<ApiResponseDTO<CandidateListItemDTO>>` | `string phone` |
| CheckDuplicateCandidateAsync | ICandidateAppService | OTHER | `Task<ApiResponseDTO<CandidateDuplicateCheck…` | `CandidateDuplicateCheckInputDTO input` |
| GetKpisAsync | ICandidateProcessAppService | GET_LIST | `Task<ApiResponseDTO<CandidateProcessKpisDTO…` | `-` |
| GetTrayAsync | ICandidateProcessAppService | GET_LIST | `Task<ApiResponseDTO<List<CandidateProcessLi…` | `PaginationCommonDTO pagination` |
| GetByStageAsync | ICandidateProcessAppService | GET_LIST | `Task<ApiResponseDTO<List<CandidateProcessLi…` | `CandidateProcessStage stage, PaginationCommonDTO pagination` |
| GetInterviewerViewAsync | ICandidateProcessAppService | GET_LIST | `Task<ApiResponseDTO<List<InterviewerApplica…` | `-` |
| GetByIdAsync | ICandidateProcessAppService | GET_SINGLE | `Task<ApiResponseDTO<CandidateProcessDetailD…` | `Guid id` |
| GetByCandidateAsync | ICandidateProcessAppService | GET_LIST | `Task<ApiResponseDTO<List<CandidateProcessLi…` | `Guid candidateId` |
| GetRecruitmentAgendaAsync | ICandidateProcessAppService | GET_LIST | `Task<ApiResponseDTO<List<CandidateRecruitme…` | `-` |
| GetRecruitmentInterviewBoardAsync | ICandidateProcessAppService | GET_LIST | `Task<ApiResponseDTO<List<CandidateRecruitme…` | `-` |
| GetInterviewerQueueAsync | ICandidateProcessAppService | GET_LIST | `Task<ApiResponseDTO<List<CandidateInterview…` | `-` |
| GetEmployeeInterviewerQueueAsync | ICandidateProcessAppService | GET_LIST | `Task<ApiResponseDTO<List<CandidateInterview…` | `Guid customerId` |
| GetByRequestPositionAsync | ICandidateProcessAppService | GET_LIST | `Task<ApiResponseDTO<CandidateProcessVacancy…` | `Guid requestPositionId` |
| GetTimelineByVacancyAsync | ICandidateProcessAppService | GET_LIST | `Task<ApiResponseDTO<List<VacancyCandidateTi…` | `Guid positionRequestId` |
| GetByWorkPositionAsync | ICandidateProcessAppService | GET_LIST | `Task<ApiResponseDTO<CandidateProcessWorkPos…` | `Guid workPositionId` |
| CreateAsync | ICandidateProcessAppService | CREATE | `Task<ApiResponseDTO<CandidateProcessDetailD…` | `CandidateProcessCreateOrUpdateDTO dto` |
| CreateFromFormAsync | ICandidateProcessAppService | CREATE | `Task<ApiResponseDTO<CandidateProcessDetailD…` | `CandidateApplicationCreateOrUpdateDTO dto` |
| UpdateAsync | ICandidateProcessAppService | UPDATE | `Task<ApiResponseDTO<CandidateProcessDetailD…` | `Guid id, CandidateProcessCreateOrUpdateDTO dto` |
| UpdateFromFormAsync | ICandidateProcessAppService | UPDATE | `Task<ApiResponseDTO<CandidateProcessDetailD…` | `Guid id, CandidateApplicationCreateOrUpdateDTO dto` |
| ProcessHiringAsync | ICandidateProcessAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid id, CandidateApplicationProcessHiringDTO dto` |
| CompleteHiringAsync | ICandidateProcessAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| ProcessDirectHiringAsync | ICandidateProcessAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid requestPositionId, CandidateApplicationProcessHiringDT…` |
| UploadHiringDocumentAsync | ICandidateProcessAppService | SPECIAL | `Task<ApiResponseDTO<CandidateHiringDocument…` | `Guid id, CandidateHiringDocumentUploadDTO dto` |
| RemoveHiringDocumentFileAsync | ICandidateProcessAppService | DELETE | `Task<ApiResponseDTO<CandidateHiringDocument…` | `Guid id, Guid documentId` |
| ConfirmPresentationAsync | ICandidateProcessAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid processId, ConfirmPresentationRequestDTO dto` |
| ReconfirmPresentationAsync | ICandidateProcessAppService | OTHER | `Task<ApiResponseDTO<bool>>` | `Guid processId` |
| GetHiringDocumentsAsync | ICandidateProcessAppService | GET_LIST | `Task<ApiResponseDTO<List<CandidateHiringDoc…` | `Guid id` |
| ValidateHiringDocumentAsync | ICandidateProcessAppService | SPECIAL | `Task<ApiResponseDTO<CandidateHiringDocument…` | `Guid documentId, CandidateHiringDocumentValidateDTO dto` |
| ScheduleAsync | ICandidateProcessAppService | OTHER | `Task<ApiResponseDTO<bool>>` | `Guid id, ScheduleRecruitmentInterviewRequest request` |
| CancelScheduleAsync | ICandidateProcessAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid id, ScheduleRecruitmentInterviewRequest request` |
| ChangeStageAsync | ICandidateProcessAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid id, ChangeStageApplicationRequest request` |
| RegisterDecisionAsync | ICandidateProcessAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid id, CandidateDecisionRequest request` |
| ExecuteInterviewerActionAsync | ICandidateProcessAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `InterviewerActionRequest request` |
| GetInterviewResponseAsync | ICandidateProcessAppService | GET_LIST | `Task<ApiResponseDTO<CandidateInterviewRespo…` | `Guid id` |
| CreateAsync | ICandidateWorkExperienceAppService | CREATE | `Task<ApiResponseDTO<CandidateWorkExperience…` | `CandidateWorkExperienceCreateOrUpdateDTO dto` |
| UpdateAsync | ICandidateWorkExperienceAppService | UPDATE | `Task<ApiResponseDTO<CandidateWorkExperience…` | `Guid id, CandidateWorkExperienceCreateOrUpdateDTO dto` |
| DeleteAsync | ICandidateWorkExperienceAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetByCandidateAsync | ICandidateWorkExperienceAppService | GET_LIST | `Task<ApiResponseDTO<List<CandidateWorkExper…` | `Guid candidateId` |

#### Modulo: EmployeeBankDataRecords

- Interfaces: 1 | Servicios: 2 | Endpoints: 6 | DTOs: 2

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IEmployeeBankDataAppService | 6 | `ReclutamientoLuxuryApp/EmployeeBankDataRecords/Interfaces/IEmployeeBankDataAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| EmployeeBankDataMappingProfile | 0 | `ReclutamientoLuxuryApp/EmployeeBankDataRecords/Mapping/EmployeeBankDataMappingProfile.cs` |
| EmployeeBankDataAppService | 6 | `ReclutamientoLuxuryApp/EmployeeBankDataRecords/Services/EmployeeBankDataAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetAllAsync | IEmployeeBankDataAppService | GET_LIST | `Task<ApiResponseDTO<EmployeeBankDataDTO[]>>` | `Guid? customerId` |
| GetByEmployeeAsync | IEmployeeBankDataAppService | GET_LIST | `Task<ApiResponseDTO<EmployeeBankDataDTO[]>>` | `Guid employeeId` |
| GetByIdAsync | IEmployeeBankDataAppService | GET_SINGLE | `Task<ApiResponseDTO<EmployeeBankDataDTO>>` | `Guid id` |
| UpsertAsync | IEmployeeBankDataAppService | UPDATE | `Task<ApiResponseDTO<EmployeeBankDataDTO>>` | `EmployeeBankDataAddOrEditDTO dto` |
| UpdateAsync | IEmployeeBankDataAppService | UPDATE | `Task<ApiResponseDTO<EmployeeBankDataDTO>>` | `Guid id, EmployeeBankDataAddOrEditDTO dto` |
| DeleteAsync | IEmployeeBankDataAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/employee-bank-data/list/{customerId:guid}` | `service.GetAllAsync` | `ReclutamientoLuxuryApp/EmployeeBankDataRecords/EndPoints/EmployeeBankDataEndPoints.cs` |
| GET | `/api/employee-bank-data/employee/{employeeId:guid}` | `service.GetByEmployeeAsync` | `ReclutamientoLuxuryApp/EmployeeBankDataRecords/EndPoints/EmployeeBankDataEndPoints.cs` |
| GET | `/api/employee-bank-data/{id:guid}` | `service.GetByIdAsync` | `ReclutamientoLuxuryApp/EmployeeBankDataRecords/EndPoints/EmployeeBankDataEndPoints.cs` |
| POST | `/api/employee-bank-data` | `service.UpsertAsync` | `ReclutamientoLuxuryApp/EmployeeBankDataRecords/EndPoints/EmployeeBankDataEndPoints.cs` |
| PUT | `/api/employee-bank-data/{id:guid}` | `service.UpdateAsync` | `ReclutamientoLuxuryApp/EmployeeBankDataRecords/EndPoints/EmployeeBankDataEndPoints.cs` |
| DELETE | `/api/employee-bank-data/{id:guid}` | `service.DeleteAsync` | `ReclutamientoLuxuryApp/EmployeeBankDataRecords/EndPoints/EmployeeBankDataEndPoints.cs` |

#### Modulo: EmployeeBeneficiaries

- Interfaces: 1 | Servicios: 2 | Endpoints: 6 | DTOs: 2

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IEmployeeBeneficiaryAppService | 6 | `ReclutamientoLuxuryApp/EmployeeBeneficiaries/Interfaces/IEmployeeBeneficiaryAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| EmployeeBeneficiaryMappingProfile | 0 | `ReclutamientoLuxuryApp/EmployeeBeneficiaries/Mapping/EmployeeBeneficiaryMappingProfile.cs` |
| EmployeeBeneficiaryAppService | 6 | `ReclutamientoLuxuryApp/EmployeeBeneficiaries/Services/EmployeeBeneficiaryAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetAllAsync | IEmployeeBeneficiaryAppService | GET_LIST | `Task<ApiResponseDTO<EmployeeBeneficiaryDTO[…` | `Guid? customerId` |
| GetByEmployeeAsync | IEmployeeBeneficiaryAppService | GET_LIST | `Task<ApiResponseDTO<EmployeeBeneficiaryDTO[…` | `Guid employeeId` |
| GetByIdAsync | IEmployeeBeneficiaryAppService | GET_SINGLE | `Task<ApiResponseDTO<EmployeeBeneficiaryDTO>>` | `Guid id` |
| UpsertAsync | IEmployeeBeneficiaryAppService | UPDATE | `Task<ApiResponseDTO<EmployeeBeneficiaryDTO>>` | `EmployeeBeneficiaryAddOrEditDTO dto` |
| UpdateAsync | IEmployeeBeneficiaryAppService | UPDATE | `Task<ApiResponseDTO<EmployeeBeneficiaryDTO>>` | `Guid id, EmployeeBeneficiaryAddOrEditDTO dto` |
| DeleteAsync | IEmployeeBeneficiaryAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/employee-beneficiary/list/{customerId:guid}` | `service.GetAllAsync` | `ReclutamientoLuxuryApp/EmployeeBeneficiaries/EndPoints/EmployeeBeneficiaryEndPoints.cs` |
| GET | `/api/employee-beneficiary/employee/{employeeId:guid}` | `service.GetByEmployeeAsync` | `ReclutamientoLuxuryApp/EmployeeBeneficiaries/EndPoints/EmployeeBeneficiaryEndPoints.cs` |
| GET | `/api/employee-beneficiary/{id:guid}` | `service.GetByIdAsync` | `ReclutamientoLuxuryApp/EmployeeBeneficiaries/EndPoints/EmployeeBeneficiaryEndPoints.cs` |
| POST | `/api/employee-beneficiary` | `service.UpsertAsync` | `ReclutamientoLuxuryApp/EmployeeBeneficiaries/EndPoints/EmployeeBeneficiaryEndPoints.cs` |
| PUT | `/api/employee-beneficiary/{id:guid}` | `service.UpdateAsync` | `ReclutamientoLuxuryApp/EmployeeBeneficiaries/EndPoints/EmployeeBeneficiaryEndPoints.cs` |
| DELETE | `/api/employee-beneficiary/{id:guid}` | `service.DeleteAsync` | `ReclutamientoLuxuryApp/EmployeeBeneficiaries/EndPoints/EmployeeBeneficiaryEndPoints.cs` |

#### Modulo: EmployeeBirthday

- Interfaces: 1 | Servicios: 2 | Endpoints: 1 | DTOs: 0

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IEmployeeBirthdayAppService | 1 | `ReclutamientoLuxuryApp/EmployeeBirthday/Interfaces/IEmployeeBirthdayAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| EmployeeBirthdayMappingProfile | 0 | `ReclutamientoLuxuryApp/EmployeeBirthday/Mapping/EmployeeBirthdayMappingProfile.cs` |
| EmployeeBirthdayAppService | 0 | `ReclutamientoLuxuryApp/EmployeeBirthday/Services/EmployeeBirthdayAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| EmployeeBirthdayAsync | IEmployeeBirthdayAppService | OTHER | `Task<ApiResponseDTO<List<EmployeeBirthdayDT…` | `Guid customerId, int month` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/birthday/{customerId:guid}/{month:int}` | `appService.EmployeeBirthdayAsync` | `ReclutamientoLuxuryApp/EmployeeBirthday/EndPoints/BirthdayEndPoints.cs` |

#### Modulo: EmployeeClinicalDataRecords

- Interfaces: 1 | Servicios: 1 | Endpoints: 5 | DTOs: 1

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IEmployeeClinicalDataAppService | 5 | `ReclutamientoLuxuryApp/EmployeeClinicalDataRecords/Interfaces/IEmployeeClinicalDataAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| EmployeeClinicalDataAppService | 5 | `ReclutamientoLuxuryApp/EmployeeClinicalDataRecords/Services/EmployeeClinicalDataAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetByEmployeeAsync | IEmployeeClinicalDataAppService | GET_LIST | `Task<ApiResponseDTO<EmployeeClinicalDataDTO…` | `Guid employeeId` |
| GetByIdAsync | IEmployeeClinicalDataAppService | GET_SINGLE | `Task<ApiResponseDTO<EmployeeClinicalDataDTO…` | `Guid id` |
| AddAsync | IEmployeeClinicalDataAppService | CREATE | `Task<ApiResponseDTO<EmployeeClinicalDataDTO…` | `EmployeeClinicalDataAddOrEditDTO dto` |
| UpdateAsync | IEmployeeClinicalDataAppService | UPDATE | `Task<ApiResponseDTO<EmployeeClinicalDataDTO…` | `Guid id, EmployeeClinicalDataAddOrEditDTO dto` |
| DeleteAsync | IEmployeeClinicalDataAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/employee-clinical-data/employee/{employeeId:guid}` | `service.GetByEmployeeAsync` | `ReclutamientoLuxuryApp/EmployeeClinicalDataRecords/EndPoints/EmployeeClinicalDataEndPoints.cs` |
| GET | `/api/employee-clinical-data/{id:guid}` | `service.GetByIdAsync` | `ReclutamientoLuxuryApp/EmployeeClinicalDataRecords/EndPoints/EmployeeClinicalDataEndPoints.cs` |
| POST | `/api/employee-clinical-data` | `service.AddAsync` | `ReclutamientoLuxuryApp/EmployeeClinicalDataRecords/EndPoints/EmployeeClinicalDataEndPoints.cs` |
| PUT | `/api/employee-clinical-data/{id:guid}` | `service.UpdateAsync` | `ReclutamientoLuxuryApp/EmployeeClinicalDataRecords/EndPoints/EmployeeClinicalDataEndPoints.cs` |
| DELETE | `/api/employee-clinical-data/{id:guid}` | `service.DeleteAsync` | `ReclutamientoLuxuryApp/EmployeeClinicalDataRecords/EndPoints/EmployeeClinicalDataEndPoints.cs` |

#### Modulo: EmployeeDocuments

- Interfaces: 1 | Servicios: 1 | Endpoints: 7 | DTOs: 2

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IEmployeeDocumentAppService | 7 | `ReclutamientoLuxuryApp/EmployeeDocuments/Interfaces/IEmployeeDocumentAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| EmployeeDocumentAppService | 7 | `ReclutamientoLuxuryApp/EmployeeDocuments/Services/EmployeeDocumentAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetDocumentsAsync | IEmployeeDocumentAppService | GET_LIST | `Task<ApiResponseDTO<List<CandidateHiringDoc…` | `Guid employeeId` |
| UploadDocumentAsync | IEmployeeDocumentAppService | SPECIAL | `Task<ApiResponseDTO<CandidateHiringDocument…` | `Guid employeeId, CandidateHiringDocumentUploadDTO dto` |
| ValidateDocumentAsync | IEmployeeDocumentAppService | SPECIAL | `Task<ApiResponseDTO<CandidateHiringDocument…` | `Guid documentId, CandidateHiringDocumentValidateDTO dto` |
| RejectDocumentAsync | IEmployeeDocumentAppService | SPECIAL | `Task<ApiResponseDTO<CandidateHiringDocument…` | `Guid documentId, CandidateHiringDocumentValidateDTO dto` |
| RemoveDocumentFileAsync | IEmployeeDocumentAppService | DELETE | `Task<ApiResponseDTO<CandidateHiringDocument…` | `Guid employeeId, Guid documentId` |
| NotifyDocumentsUploadedAsync | IEmployeeDocumentAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid employeeId` |
| ReorderDocumentsAsync | IEmployeeDocumentAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid employeeId, EmployeeDocumentReorderDTO dto` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `//api/employee-documents/{employeeId:guid}` | `appService.GetDocumentsAsync` | `ReclutamientoLuxuryApp/EmployeeDocuments/EndPoints/EmployeeDocumentEndpoints.cs` |
| POST | `//api/employee-documents/{employeeId:guid}/upload` | `appService.UploadDocumentAsync` | `ReclutamientoLuxuryApp/EmployeeDocuments/EndPoints/EmployeeDocumentEndpoints.cs` |
| POST | `//api/employee-documents/{documentId:guid}/validate` | `appService.ValidateDocumentAsync` | `ReclutamientoLuxuryApp/EmployeeDocuments/EndPoints/EmployeeDocumentEndpoints.cs` |
| POST | `//api/employee-documents/{documentId:guid}/reject` | `appService.RejectDocumentAsync` | `ReclutamientoLuxuryApp/EmployeeDocuments/EndPoints/EmployeeDocumentEndpoints.cs` |
| DELETE | `//api/employee-documents/{employeeId:guid}/documents/{documentId:guid}/file` | `appService.RemoveDocumentFileAsync` | `ReclutamientoLuxuryApp/EmployeeDocuments/EndPoints/EmployeeDocumentEndpoints.cs` |
| POST | `//api/employee-documents/notify-recruitment/{employeeId:guid}` | `appService.NotifyDocumentsUploadedAsync` | `ReclutamientoLuxuryApp/EmployeeDocuments/EndPoints/EmployeeDocumentEndpoints.cs` |
| PUT | `//api/employee-documents/{employeeId:guid}/reorder` | `appService.ReorderDocumentsAsync` | `ReclutamientoLuxuryApp/EmployeeDocuments/EndPoints/EmployeeDocumentEndpoints.cs` |

#### Modulo: EmployeeEmergenContact

- Interfaces: 1 | Servicios: 2 | Endpoints: 5 | DTOs: 2

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IEmployeeEmergencyContactAppService | 5 | `ReclutamientoLuxuryApp/EmployeeEmergenContact/Interfaces/IEmployeeEmergencyContactAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| EmployeeEmergencyContactMapper | 0 | `ReclutamientoLuxuryApp/EmployeeEmergenContact/Mapping/EmployeeEmergencyContactMapper.cs` |
| EmployeeEmergencyContactAppService | 5 | `ReclutamientoLuxuryApp/EmployeeEmergenContact/Services/EmployeeEmergencyContactAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetEmployeeContactsAsync | IEmployeeEmergencyContactAppService | GET_LIST | `Task<ApiResponseDTO<List<EmployeeEmergencyC…` | `Guid employeeId, ContacOfBeneficiary contacOfBeneficiary` |
| UpdateEmployeeContactAsync | IEmployeeEmergencyContactAppService | UPDATE | `Task<ApiResponseDTO<EmployeeEmergencyContac…` | `Guid employeeEmergencyContactId, EmployeeEmergencyContactAd…` |
| GetByIdAsync | IEmployeeEmergencyContactAppService | GET_SINGLE | `Task<ApiResponseDTO<EmployeeEmergencyContac…` | `Guid id` |
| AddAsync | IEmployeeEmergencyContactAppService | CREATE | `Task<ApiResponseDTO<EmployeeEmergencyContac…` | `EmployeeEmergencyContactAddOrEditDTO DTO` |
| DeleteByIdAsync | IEmployeeEmergencyContactAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/employee-emergency-contact/list-employee-contact/{employeeId:guid}/{contacOfBeneficiary}` | `appService.GetEmployeeContactsAsync` | `ReclutamientoLuxuryApp/EmployeeEmergenContact/EndPoints/EmployeeEmergencyContactEndPoints.cs` |
| PUT | `/api/employee-emergency-contact/{employeeEmergencyContactId:guid}` | `appService.UpdateEmployeeContactAsync` | `ReclutamientoLuxuryApp/EmployeeEmergenContact/EndPoints/EmployeeEmergencyContactEndPoints.cs` |
| GET | `/api/employee-emergency-contact/{id:guid}` | `appService.GetByIdAsync` | `ReclutamientoLuxuryApp/EmployeeEmergenContact/EndPoints/EmployeeEmergencyContactEndPoints.cs` |
| POST | `/api/employee-emergency-contact` | `appService.AddAsync` | `ReclutamientoLuxuryApp/EmployeeEmergenContact/EndPoints/EmployeeEmergencyContactEndPoints.cs` |
| DELETE | `/api/employee-emergency-contact/{id:guid}` | `appService.DeleteByIdAsync` | `ReclutamientoLuxuryApp/EmployeeEmergenContact/EndPoints/EmployeeEmergencyContactEndPoints.cs` |

#### Modulo: EmployeeFile

- Interfaces: 1 | Servicios: 2 | Endpoints: 13 | DTOs: 13

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IEmployeeFileAppService | 13 | `ReclutamientoLuxuryApp/EmployeeFile/Interfaces/IEmployeeFileAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| EmployeeFileMappingProfile | 0 | `ReclutamientoLuxuryApp/EmployeeFile/Mapping/EmployeeFileMappingProfile.cs` |
| EmployeeFileAppService | 13 | `ReclutamientoLuxuryApp/EmployeeFile/Services/EmployeeFileAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetAllAsync | IEmployeeFileAppService | GET_LIST | `Task<ApiResponseDTO<EmployeeFileSummaryDTO[…` | `Guid customerId, bool? isActive` |
| GetHeaderAsync | IEmployeeFileAppService | GET_LIST | `Task<ApiResponseDTO<EmployeeFileHeaderDTO>>` | `Guid employeeId` |
| GetPersonalDataAsync | IEmployeeFileAppService | GET_LIST | `Task<ApiResponseDTO<EmployeeFilePersonalDat…` | `Guid employeeId` |
| GetEmergencyContactsAsync | IEmployeeFileAppService | GET_LIST | `Task<ApiResponseDTO<EmployeeFileEmergencyCo…` | `Guid employeeId` |
| GetClinicalDataAsync | IEmployeeFileAppService | GET_LIST | `Task<ApiResponseDTO<EmployeeFileClinicalDat…` | `Guid employeeId` |
| GetBankDataAsync | IEmployeeFileAppService | GET_LIST | `Task<ApiResponseDTO<EmployeeFileBankDataDTO…` | `Guid employeeId` |
| GetBeneficiariesAsync | IEmployeeFileAppService | GET_LIST | `Task<ApiResponseDTO<EmployeeFileBeneficiary…` | `Guid employeeId` |
| GetContractsAsync | IEmployeeFileAppService | GET_LIST | `Task<ApiResponseDTO<EmployeeFileContractDTO…` | `Guid employeeId` |
| GetWorkPositionAsync | IEmployeeFileAppService | GET_LIST | `Task<ApiResponseDTO<EmployeeFileWorkPositio…` | `Guid employeeId` |
| GetVacationsAndLeavesAsync | IEmployeeFileAppService | GET_LIST | `Task<ApiResponseDTO<EmployeeFileVacationsLe…` | `Guid employeeId` |
| GetIncidentsAsync | IEmployeeFileAppService | GET_LIST | `Task<ApiResponseDTO<EmployeeFileIncidentDTO…` | `Guid employeeId` |
| GetEvaluationsAsync | IEmployeeFileAppService | GET_LIST | `Task<ApiResponseDTO<EmployeeFileEvaluationD…` | `Guid employeeId` |
| GetRequestsAsync | IEmployeeFileAppService | GET_LIST | `Task<ApiResponseDTO<EmployeeFileRequestsDTO…` | `Guid employeeId` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/hr/employee-files` | `dataService.GetAllAsync` | `ReclutamientoLuxuryApp/EmployeeFile/EndPoints/EmployeeFileEndPoints.cs` |
| GET | `/api/hr/employee-files/{employeeId:guid}/summary` | `dataService.GetHeaderAsync` | `ReclutamientoLuxuryApp/EmployeeFile/EndPoints/EmployeeFileEndPoints.cs` |
| GET | `/api/hr/employee-files/{employeeId:guid}/personal-data` | `dataService.GetPersonalDataAsync` | `ReclutamientoLuxuryApp/EmployeeFile/EndPoints/EmployeeFileEndPoints.cs` |
| GET | `/api/hr/employee-files/{employeeId:guid}/emergency-contacts` | `dataService.GetEmergencyContactsAsync` | `ReclutamientoLuxuryApp/EmployeeFile/EndPoints/EmployeeFileEndPoints.cs` |
| GET | `/api/hr/employee-files/{employeeId:guid}/clinical-data` | `dataService.GetClinicalDataAsync` | `ReclutamientoLuxuryApp/EmployeeFile/EndPoints/EmployeeFileEndPoints.cs` |
| GET | `/api/hr/employee-files/{employeeId:guid}/bank-data` | `dataService.GetBankDataAsync` | `ReclutamientoLuxuryApp/EmployeeFile/EndPoints/EmployeeFileEndPoints.cs` |
| GET | `/api/hr/employee-files/{employeeId:guid}/beneficiaries` | `dataService.GetBeneficiariesAsync` | `ReclutamientoLuxuryApp/EmployeeFile/EndPoints/EmployeeFileEndPoints.cs` |
| GET | `/api/hr/employee-files/{employeeId:guid}/contracts` | `dataService.GetContractsAsync` | `ReclutamientoLuxuryApp/EmployeeFile/EndPoints/EmployeeFileEndPoints.cs` |
| GET | `/api/hr/employee-files/{employeeId:guid}/work-position` | `dataService.GetWorkPositionAsync` | `ReclutamientoLuxuryApp/EmployeeFile/EndPoints/EmployeeFileEndPoints.cs` |
| GET | `/api/hr/employee-files/{employeeId:guid}/vacations-leaves` | `dataService.GetVacationsAndLeavesAsync` | `ReclutamientoLuxuryApp/EmployeeFile/EndPoints/EmployeeFileEndPoints.cs` |
| GET | `/api/hr/employee-files/{employeeId:guid}/incidents` | `dataService.GetIncidentsAsync` | `ReclutamientoLuxuryApp/EmployeeFile/EndPoints/EmployeeFileEndPoints.cs` |
| GET | `/api/hr/employee-files/{employeeId:guid}/evaluations` | `dataService.GetEvaluationsAsync` | `ReclutamientoLuxuryApp/EmployeeFile/EndPoints/EmployeeFileEndPoints.cs` |
| GET | `/api/hr/employee-files/{employeeId:guid}/requests` | `dataService.GetRequestsAsync` | `ReclutamientoLuxuryApp/EmployeeFile/EndPoints/EmployeeFileEndPoints.cs` |

#### Modulo: EmployeeOnboardingChecklists

- Interfaces: 2 | Servicios: 3 | Endpoints: 8 | DTOs: 5

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IChecklistOptionCatalogAppService | 4 | `ReclutamientoLuxuryApp/EmployeeOnboardingChecklists/Interfaces/IChecklistOptionCatalogAppService.cs` |
| IEmployeeOnboardingChecklistAppService | 4 | `ReclutamientoLuxuryApp/EmployeeOnboardingChecklists/Interfaces/IEmployeeOnboardingChecklistAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| ChecklistOptionCatalogAppService | 4 | `ReclutamientoLuxuryApp/EmployeeOnboardingChecklists/Services/ChecklistOptionCatalogAppService.cs` |
| EmployeeOnboardingChecklistAppService | 4 | `ReclutamientoLuxuryApp/EmployeeOnboardingChecklists/Services/EmployeeOnboardingChecklistAppService.cs` |
| OnboardingChecklistDeadlineCalculator | 2 | `ReclutamientoLuxuryApp/EmployeeOnboardingChecklists/Services/OnboardingChecklistDeadlineCalculator.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetAllAsync | IChecklistOptionCatalogAppService | GET_LIST | `Task<ApiResponseDTO<List<ChecklistOptionCat…` | `-` |
| CreateAsync | IChecklistOptionCatalogAppService | CREATE | `Task<ApiResponseDTO<ChecklistOptionCatalogL…` | `ChecklistOptionCatalogCreateDTO dto` |
| UpdateAsync | IChecklistOptionCatalogAppService | UPDATE | `Task<ApiResponseDTO<ChecklistOptionCatalogL…` | `Guid id, ChecklistOptionCatalogUpdateDTO dto` |
| DeleteAsync | IChecklistOptionCatalogAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetByEmployeeAsync | IEmployeeOnboardingChecklistAppService | GET_LIST | `Task<ApiResponseDTO<List<EmployeeOnboarding…` | `Guid employeeId` |
| InitializeChecklistAsync | IEmployeeOnboardingChecklistAppService | OTHER | `Task<ApiResponseDTO<List<EmployeeOnboarding…` | `Guid employeeId` |
| InitializeChecklistForRoleAsync | IEmployeeOnboardingChecklistAppService | OTHER | `Task<ApiResponseDTO<List<EmployeeOnboarding…` | `Guid employeeId, ApplicationRoleEnum role` |
| UpdateOnboardingChecklistAsync | IEmployeeOnboardingChecklistAppService | UPDATE | `Task<ApiResponseDTO<EmployeeOnboardingCheck…` | `Guid taskId, EmployeeOnboardingChecklistUpdateDTO dto` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/checklist-options` | `appService.GetAllAsync` | `ReclutamientoLuxuryApp/EmployeeOnboardingChecklists/EndPoints/ChecklistOptionCatalogEndpoints.cs` |
| POST | `/api/checklist-options` | `appService.CreateAsync` | `ReclutamientoLuxuryApp/EmployeeOnboardingChecklists/EndPoints/ChecklistOptionCatalogEndpoints.cs` |
| PUT | `/api/checklist-options/{id:guid}` | `appService.UpdateAsync` | `ReclutamientoLuxuryApp/EmployeeOnboardingChecklists/EndPoints/ChecklistOptionCatalogEndpoints.cs` |
| DELETE | `/api/checklist-options/{id:guid}` | `appService.DeleteAsync` | `ReclutamientoLuxuryApp/EmployeeOnboardingChecklists/EndPoints/ChecklistOptionCatalogEndpoints.cs` |
| GET | `/api/hr/employee-files/{employeeId:guid}/onboarding-checklist` | `appService.GetByEmployeeAsync` | `ReclutamientoLuxuryApp/EmployeeOnboardingChecklists/EndPoints/EmployeeOnboardingChecklistEndpoints.cs` |
| POST | `/api/hr/employee-files/{employeeId:guid}/onboarding-checklist/initialize` | `appService.InitializeChecklistAsync` | `ReclutamientoLuxuryApp/EmployeeOnboardingChecklists/EndPoints/EmployeeOnboardingChecklistEndpoints.cs` |
| PUT | `/api/hr/employee-files/onboarding-checklist/{taskId:guid}` | `appService.UpdateOnboardingChecklistAsync` | `ReclutamientoLuxuryApp/EmployeeOnboardingChecklists/EndPoints/EmployeeOnboardingChecklistEndpoints.cs` |
| POST | `/api/hr/employee-files/onboarding-checklist/{taskId:guid}/toggle` | `appService.UpdateOnboardingChecklistAsync` | `ReclutamientoLuxuryApp/EmployeeOnboardingChecklists/EndPoints/EmployeeOnboardingChecklistEndpoints.cs` |

#### Modulo: EmployeeOrganigrama

- Interfaces: 1 | Servicios: 2 | Endpoints: 2 | DTOs: 2

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IWorkPositionOrgChartAppService | 2 | `ReclutamientoLuxuryApp/EmployeeOrganigrama/Interfaces/IWorkPositionOrgChartAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| WorkPositionOrgChartMappingProfile | 0 | `ReclutamientoLuxuryApp/EmployeeOrganigrama/Mapping/WorkPositionOrgChartMappingProfile.cs` |
| WorkPositionOrgChartAppService | 2 | `ReclutamientoLuxuryApp/EmployeeOrganigrama/Services/WorkPositionOrgChartAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetTreeAsync | IWorkPositionOrgChartAppService | GET_LIST | `Task<ApiResponseDTO<List<RoleOrgChartNodeDT…` | `Guid customerId` |
| ReassignAsync | IWorkPositionOrgChartAppService | SPECIAL | `Task<ApiResponseDTO<WorkPositionReassignRes…` | `RoleOrgChartReassignRequest request, Guid customerId` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/work-position-org-chart/tree/{customerId:guid}` | `appService.GetTreeAsync` | `ReclutamientoLuxuryApp/EmployeeOrganigrama/EndPoints/WorkPositionOrgChartEndPoints.cs` |
| PATCH | `/api/work-position-org-chart/reassign/{customerId:guid}` | `appService.ReassignAsync` | `ReclutamientoLuxuryApp/EmployeeOrganigrama/EndPoints/WorkPositionOrgChartEndPoints.cs` |

#### Modulo: Employees

- Interfaces: 1 | Servicios: 2 | Endpoints: 18 | DTOs: 7

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IEmployeeInternalAppService | 27 | `ReclutamientoLuxuryApp/Employees/Interfaces/IEmployeeInternalAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| EmployeeInternalMappingProfile | 0 | `ReclutamientoLuxuryApp/Employees/Mapping/EmployeeInternalMappingProfile.cs` |
| EmployeeInternalAppService | 26 | `ReclutamientoLuxuryApp/Employees/Services/EmployeeInternalAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetDossierAsync | IEmployeeInternalAppService | GET_LIST | `Task<ApiResponseDTO<EmployeeDossierDTO>>` | `Guid employeeId` |
| GetListAsync | IEmployeeInternalAppService | GET_LIST | `Task<ApiResponseDTO<List<EmployeeDTO>>>` | `Guid customerId, bool active` |
| GetPrincipalDataAsync | IEmployeeInternalAppService | GET_LIST | `Task<ApiResponseDTO<EmployeePrincipalDataEd…` | `string applicationUserId` |
| GetUnifiedProfileAsync | IEmployeeInternalAppService | GET_LIST | `Task<ApiResponseDTO<EmployeeUnifiedProfileE…` | `Guid employeeId, string applicationUserId` |
| UpdateUnifiedProfileAsync | IEmployeeInternalAppService | UPDATE | `Task<ApiResponseDTO<EmployeeUnifiedProfileE…` | `Guid employeeId, string applicationUserId, EmployeeUnifiedP…` |
| UpdatePrincipalDataAsync | IEmployeeInternalAppService | UPDATE | `Task<ApiResponseDTO<EmployeePrincipalDataEd…` | `string applicationUserId, EmployeePrincipalDataEditDTO model` |
| PhotoPath | IEmployeeInternalAppService | OTHER | `Task<ApiResponseDTO<ImgPathFileCommonDTO>>` | `string applicationUserId` |
| UpdateImgageAsync | IEmployeeInternalAppService | UPDATE | `Task<ApiResponseDTO<ImgPathFileCommonDTO>>` | `string applicationUserId, FileUploadCommonDTO fileUploadDTO` |
| PersonalDataAsync | IEmployeeInternalAppService | OTHER | `Task<ApiResponseDTO<EmployeePersonalDataEdi…` | `Guid employeeId` |
| UpdatePersonalDataAsync | IEmployeeInternalAppService | UPDATE | `Task<ApiResponseDTO<EmployeePersonalDataEdi…` | `Guid employeeId, EmployeePersonalDataEditDTO DTO` |
| GetLaboralDataAsync | IEmployeeInternalAppService | GET_LIST | `Task<ApiResponseDTO<EmployeeLaboralDataEdit…` | `string applicationUserId` |
| UpdateLaboralDataAsync | IEmployeeInternalAppService | UPDATE | `Task<ApiResponseDTO<EmployeeLaboralDataEdit…` | `string applicationUserId, EmployeeLaboralDataEditDTO DTO` |
| AddressDataAsync | IEmployeeInternalAppService | OTHER | `Task<ApiResponseDTO<EmployeeAddressDataEdit…` | `Guid employeeId` |
| UpdateAddressDataAync | IEmployeeInternalAppService | UPDATE | `Task<ApiResponseDTO<EmployeeAddressDataEdit…` | `Guid addressId, EmployeeAddressDataEditDTO DTO` |
| DataForRecoveryPasswordAsync | IEmployeeInternalAppService | OTHER | `Task<ApiResponseDTO<EmployeeRecoveryPasswor…` | `string applicationUserId` |
| GetCardUserAsync | IEmployeeInternalAppService | GET_LIST | `Task<ApiResponseDTO<UserCardDTO>>` | `string applicationUserId` |
| OnValidateStateAsync | IEmployeeInternalAppService | OTHER | `Task<ApiResponseDTO<bool>>` | `string applicationUserId` |
| GetAsyncById | IEmployeeInternalAppService | GET_SINGLE | `Task<ApiResponseDTO<EmployeeAddOrEditDTO>>` | `Guid employeeId` |
| CreateEmployeeAsync | IEmployeeInternalAppService | CREATE | `Task<ApiResponseDTO<Employee>>` | `EmployeeCreateDTO DTO` |
| CreateEmployeeExternal | IEmployeeInternalAppService | CREATE | `Task<ApiResponseDTO<Employee>>` | `EmployeeCreateDTO DTO` |
| BirthdayAsync | IEmployeeInternalAppService | OTHER | `Task<ApiResponseDTO<List<EmployeeBirthdayDT…` | `Guid customerId, int month` |
| ValidarRoleAsync | IEmployeeInternalAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid employeeId` |
| EmployeeTempAsync | IEmployeeInternalAppService | OTHER | `Task<ApiResponseDTO<List<Employee>>>` | `-` |
| ValidarAdminAsisAsync | IEmployeeInternalAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `string applicationUserId` |
| ValidarSolicitudesAbiertas | IEmployeeInternalAppService | SPECIAL | `Task<ApiResponseDTO<EmployeeOpenRequestsDTO…` | `Guid employeeId` |
| ActivateEmployeeAsync | IEmployeeInternalAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `string applicationUserId` |
| CheckDuplicateEmployeeAsync | IEmployeeInternalAppService | OTHER | `Task<ApiResponseDTO<EmployeeDuplicateDTO>>` | `string email, string phoneNumber` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/employee-internal/check-duplicate` | `appService.CheckDuplicateEmployeeAsync` | `ReclutamientoLuxuryApp/Employees/EndPoints/EmployeeInternalEndpoints.cs` |
| GET | `/api/employee-internal/list/{customerId:guid}/{active:bool}` | `appService.GetListAsync` | `ReclutamientoLuxuryApp/Employees/EndPoints/EmployeeInternalEndpoints.cs` |
| GET | `/api/employee-internal/principal-data/{applicationUserId}` | `appService.GetPrincipalDataAsync` | `ReclutamientoLuxuryApp/Employees/EndPoints/EmployeeInternalEndpoints.cs` |
| GET | `/api/employee-internal/unified-profile/{employeeId:guid}/{applicationUserId}` | `appService.GetUnifiedProfileAsync` | `ReclutamientoLuxuryApp/Employees/EndPoints/EmployeeInternalEndpoints.cs` |
| PUT | `/api/employee-internal/unified-profile/{employeeId:guid}/{applicationUserId}` | `appService.UpdateUnifiedProfileAsync` | `ReclutamientoLuxuryApp/Employees/EndPoints/EmployeeInternalEndpoints.cs` |
| PUT | `/api/employee-internal/update-principal-data/{applicationUserId}` | `appService.UpdatePrincipalDataAsync` | `ReclutamientoLuxuryApp/Employees/EndPoints/EmployeeInternalEndpoints.cs` |
| GET | `/api/employee-internal/photo-path/{applicationUserId}` | `appService.UpdateImgageAsync` | `ReclutamientoLuxuryApp/Employees/EndPoints/EmployeeInternalEndpoints.cs` |
| PUT | `/api/employee-internal/update-image/{applicationUserId}` | `appService.UpdateImgageAsync` | `ReclutamientoLuxuryApp/Employees/EndPoints/EmployeeInternalEndpoints.cs` |
| GET | `/api/employee-internal/personal-data/{employeeId:guid}` | `appService.PersonalDataAsync` | `ReclutamientoLuxuryApp/Employees/EndPoints/EmployeeInternalEndpoints.cs` |
| PUT | `/api/employee-internal/update-personal-data/{employeeId:guid}` | `appService.UpdatePersonalDataAsync` | `ReclutamientoLuxuryApp/Employees/EndPoints/EmployeeInternalEndpoints.cs` |
| GET | `/api/employee-internal/laboral-data/{applicationUserId}` | `appService.GetLaboralDataAsync` | `ReclutamientoLuxuryApp/Employees/EndPoints/EmployeeInternalEndpoints.cs` |
| PUT | `/api/employee-internal/update-laboral-data/{applicationUserId}` | `appService.UpdateLaboralDataAsync` | `ReclutamientoLuxuryApp/Employees/EndPoints/EmployeeInternalEndpoints.cs` |
| GET | `/api/employee-internal/address-data/{employeeId:guid}` | `appService.AddressDataAsync` | `ReclutamientoLuxuryApp/Employees/EndPoints/EmployeeInternalEndpoints.cs` |
| PUT | `/api/employee-internal/update-address-data/{addressId:guid}` | `appService.DataForRecoveryPasswordAsync` | `ReclutamientoLuxuryApp/Employees/EndPoints/EmployeeInternalEndpoints.cs` |
| GET | `/api/employee-internal/data-for-recovery-password/{applicationUserId}` | `appService.DataForRecoveryPasswordAsync` | `ReclutamientoLuxuryApp/Employees/EndPoints/EmployeeInternalEndpoints.cs` |
| GET | `/api/employee-internal/card-user/{applicationUserId}` | `appService.GetCardUserAsync` | `ReclutamientoLuxuryApp/Employees/EndPoints/EmployeeInternalEndpoints.cs` |
| GET | `/api/employee-internal/on-validate-state/{applicationUserId}` | `appService.OnValidateStateAsync` | `ReclutamientoLuxuryApp/Employees/EndPoints/EmployeeInternalEndpoints.cs` |
| PATCH | `/api/employee-internal/{applicationUserId}/activate` | `appService.ActivateEmployeeAsync` | `ReclutamientoLuxuryApp/Employees/EndPoints/EmployeeInternalEndpoints.cs` |

#### Modulo: EndPoints

- Interfaces: 0 | Servicios: 0 | Endpoints: 81 | DTOs: 0

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| POST | `/api/operation/recruitment/performance-evaluations/create` | `evaluationService.CreateAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentPerformanceEvaluationsEndPoints.cs` |
| PUT | `/api/operation/recruitment/performance-evaluations/update/{id:guid}` | `evaluationService.UpdateAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentPerformanceEvaluationsEndPoints.cs` |
| GET | `/api/operation/recruitment/performance-evaluations/{id:guid}/result` | `evaluationService.GetResultByIdAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentPerformanceEvaluationsEndPoints.cs` |
| GET | `/api/operation/recruitment/performance-evaluations/employee/{employeeId:guid}/history` | `evaluationService.GetHistoryForEmployeeAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentPerformanceEvaluationsEndPoints.cs` |
| DELETE | `/api/operation/recruitment/performance-evaluations/{id:guid}` | `evaluationService.DeleteByIdAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentPerformanceEvaluationsEndPoints.cs` |
| GET | `/api/operation/recruitment/performance-evaluations/customer/{customerId:guid}/history` | `evaluationService.GetHistoryForClientAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentPerformanceEvaluationsEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/accounts-for-customer/{customerId:guid}` | `s.SelectItemAccountForCustomerAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/accounting-catalogs/{customerId:guid}` | `s.SelectItemAddCuentaCedulaPresupuestalAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/administration-minutes/{customerId:guid}/{meetingId:guid}` | `s.SelectItemAdministracionMinutaAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/almacenes/{customerId:guid}` | `s.SelectItemAlmacenesAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/application-roles` | `s.SelectItemApplicationRolesAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/application-roles-to-administrator` | `s.SelectItemApplicationRolesToAdministratorAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/application-roles-to-provider` | `s.SelectItemApplicationRolesToProviderAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/application-user-providers` | `s.SelectItemApplicationUserProviderAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/application-users` | `s.SelectItemApplicationUserAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/application-users/{customerId:guid}` | `s.ApplicationUserForCustomerIdAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/banks` | `s.SelectItemBankAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/boolean-options` | `s.SelectItemResidentesEdificioAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/building-residents/{customerId:guid}` | `s.SelectItemResidentesEdificioAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/residentes-edificio/{customerId:guid}` | `s.SelectItemResidentesEdificioAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/categories` | `s.SelectItemCategoriesAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/candidates` | `s.SelectItemCandidatesAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/recruitment-sources` | `s.SelectItemRecruitmentSourcesAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/document-catalog` | `s.SelectItemDocumentCatalogAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/cfdi-uses` | `s.SelectItemUseCFDIAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/committee-minutes/{customerId:guid}/{meetingId:guid}` | `s.SelectItemComiteMinutaAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/customer-inspections/{customerId:guid}` | `s.SelectItemCustomerInspectionsAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/customers-access/{applicationUserId}` | `s.SelectItemCustomersAccesoAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/customers-active` | `s.SelectItemCustomersActiveAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/customers-active-short-name` | `s.SelectItemCustomersActiveNameShortAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/customers-all` | `s.SelectItemCustomersAllAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/customers-inactive` | `s.SelectItemCustomersInactiveAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/employees-active` | `s.SelectItemEmployeesActiveAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/employees-active/{customerId:guid}` | `s.SelectItemEmployeesActiveAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/employees-by-user-id/{customerId:guid}` | `s.SelectItemEmployeeByUserIdAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/employees/{customerId:guid}` | `s.SelectItemEmployeeAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/equipment-classifications` | `s.SelectItemEquipoClasificacionAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/equipo-calendario-maestro` | `s.SelectItemEquipoCalendarioMaestroAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/evaluation-templates/{customerId:guid}` | `s.SelectItemEvaluationTemplateAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/funding-period/{customerId:guid}` | `s.FundingPeriodAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/inspection-review-catalogs` | `s.SelectItemInspectionReviewsCatalogAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/legal-matter-categories` | `s.SelectItemLegalMatterCategoryAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/legal-matters` | `s.SelectItemLegalMatterAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/listado-instalaciones/{customerId:guid}` | `s.SelectItemInstalacionesAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/machineries-active/{customerId:guid}` | `s.SelectItemMachineriesActiveAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/machineries-all/{customerId:guid}` | `s.SelectItemMachineriesGetAllAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/measurement-units` | `s.SelectItemMeasurementUnitsAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/operations-interviewers/{customerId:guid}` | `s.SelectItemOperationsInterviewersByCustomerAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/operations-interviewers/by-request-position/{requestPositionId:guid}` | `s.SelectItemOperationsInterviewersByRequestPositionAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/medidor-categoria` | `s.SelectItemMedidorCategoriaAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/module-apps` | `s.SelectItemModuleAppAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/nombre-corto` | `s.SelectItemNombreCortoAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/onboarding-checklist-options` | `s.SelectItemOnboardingChecklistOptionsAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/owners/{customerId:guid}` | `s.SelectItemOwnerAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/participant-administration/{customerId:guid}` | `s.SelectItemParticipantAdministrationAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/payment-methods` | `s.SelectItemPaymentMethodAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/payment-ways` | `s.SelectItemWayToPayAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/people/{customerId:guid}` | `s.SelectItemPersonAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/people-employees/{customerId:guid}` | `s.SelectItemPersonEmployeeAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/products` | `s.SelectItemProductsAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/professions` | `s.SelectItemProfessionsAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/properties/{customerId:guid}` | `s.SelectItemPropertyAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/property-accounts/{customerId:guid}/{year:int}` | `s.SelectItemPropertyAccountsAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/property-members/{customerId:guid}` | `s.SelectItemOwnerAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/request-positions-pending` | `s.SelectItemRequestPositionsPendingAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/vacantes/{customerId:guid}` | `s.SelectItemVacantesAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/providers/{customerId:guid}` | `s.SelectItemProvidersAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/responsable-sistemas` | `s.SelectItemResponsableSistemasAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/rich-products` | `s.SelectRichItemProductsAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/roles` | `s.SelectItemRolesAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/roles-by-role-type/{roleType}` | `s.SelectItemRolesByRoleTypeAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/roles-for-announcements` | `s.GetRolesForAnnouncementsAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/roles-for-document` | `s.SelectItemRolForDocumentAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/select-for-add-ticket` | `s.SelectItemSelectForAddTicketAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/service-year/{customerId:guid}` | `s.SelectItemAnioOrdenServiceAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/supervision-list` | `s.SelectItemSupervisionAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/task-group-category/{customerId:guid}` | `s.SelectItemTaskGroupCategoryAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/task-group-list/{customerId:guid}` | `s.SelectItemTicketGroupListAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/tools/{customerId:guid}` | `s.SelectItemToolAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/users-from-customer/{customerId:guid}` | `s.UserFromCustomerAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |
| GET | `/api/operation/recruitment/select-items/aspel-customer-empresa` | `s.SelectItemAspelCustomerEmpresaAsync` | `ReclutamientoLuxuryApp/EndPoints/OperationRecruitmentSelectItemEndPoints.cs` |

#### Modulo: ExternalStaffs

- Interfaces: 1 | Servicios: 2 | Endpoints: 17 | DTOs: 9

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IEmployeeExternalAppService | 9 | `ReclutamientoLuxuryApp/ExternalStaffs/Interfaces/IEmployeeExternalAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| EmployeeMapper | 0 | `ReclutamientoLuxuryApp/ExternalStaffs/Mapping/EmployeeMapper.cs` |
| EmployeeExternalAppService | 9 | `ReclutamientoLuxuryApp/ExternalStaffs/Services/EmployeeExternalAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| ExternoGetByIdAsync | IEmployeeExternalAppService | OTHER | `Task<ApiResponseDTO<EmployeeExternalDTO>>` | `string applicationUserId` |
| GetExternalListAsync | IEmployeeExternalAppService | GET_LIST | `Task<ApiResponseDTO<List<EmployeeExternalLi…` | `Guid customerId, bool active` |
| SearchUserByEmailAsync | IEmployeeExternalAppService | GET_LIST | `Task<ApiResponseDTO<List<EmployeeExternalMa…` | `Guid customerId, string email, string excludeUserId = null` |
| SearchUserByPhoneNumberAsync | IEmployeeExternalAppService | GET_LIST | `Task<ApiResponseDTO<List<EmployeeExternalMa…` | `Guid customerId, string phoneNumber, string excludeUserId =…` |
| CreateAsync | IEmployeeExternalAppService | CREATE | `Task<ApiResponseDTO<EmployeeExternalListDTO…` | `EmployeeExternalCreateOrUpdateDTO DTO` |
| UpdateAsync | IEmployeeExternalAppService | UPDATE | `Task<ApiResponseDTO<EmployeeExternalListDTO…` | `string applicationUserId, EmployeeExternalCreateOrUpdateDTO…` |
| DeleteAsync | IEmployeeExternalAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `string applicationUserId` |
| AddAccessCustomerAsync | IEmployeeExternalAppService | CREATE | `Task<ApiResponseDTO<bool>>` | `string applicationUserId, Guid customerId` |
| DeleteAccessCutomerAsync | IEmployeeExternalAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `string applicationUserId, Guid customerId` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/employee-external/{applicationUserId}` | `appService.ExternoGetByIdAsync` | `ReclutamientoLuxuryApp/ExternalStaffs/EndPoints/EmployeeExternalEndpoints.cs` |
| GET | `/api/employee-external/list/{customerId:guid}/{active:bool}` | `appService.GetExternalListAsync` | `ReclutamientoLuxuryApp/ExternalStaffs/EndPoints/EmployeeExternalEndpoints.cs` |
| GET | `/api/employee-external/search-by-email/{customerId:guid}` | `appService.SearchUserByEmailAsync` | `ReclutamientoLuxuryApp/ExternalStaffs/EndPoints/EmployeeExternalEndpoints.cs` |
| GET | `/api/employee-external/search-by-phone/{customerId:guid}` | `appService.SearchUserByPhoneNumberAsync` | `ReclutamientoLuxuryApp/ExternalStaffs/EndPoints/EmployeeExternalEndpoints.cs` |
| POST | `/api/employee-external` | `appService.CreateAsync` | `ReclutamientoLuxuryApp/ExternalStaffs/EndPoints/EmployeeExternalEndpoints.cs` |
| PUT | `/api/employee-external/{applicationUserId}` | `appService.UpdateAsync` | `ReclutamientoLuxuryApp/ExternalStaffs/EndPoints/EmployeeExternalEndpoints.cs` |
| DELETE | `/api/employee-external/{applicationUserId}` | `appService.DeleteAsync` | `ReclutamientoLuxuryApp/ExternalStaffs/EndPoints/EmployeeExternalEndpoints.cs` |
| POST | `/api/employee-external/add-access-cutomer/{applicationUserId}/{customerId:guid}` | `appService.AddAccessCustomerAsync` | `ReclutamientoLuxuryApp/ExternalStaffs/EndPoints/EmployeeExternalEndpoints.cs` |
| DELETE | `/api/employee-external/delete-access-cutomer/{applicationUserId}/{customerId:guid}` | `appService.DeleteAccessCutomerAsync` | `ReclutamientoLuxuryApp/ExternalStaffs/EndPoints/EmployeeExternalEndpoints.cs` |
| GET | `/api/employees/{employeeId:guid}/dossier` | `appService.GetDossierAsync` | `ReclutamientoLuxuryApp/ExternalStaffs/EndPoints/EmployeesEndpoints.cs` |
| GET | `/api/employees/{employeeId:guid}` | `appService.CreateEmployeeAsync` | `ReclutamientoLuxuryApp/ExternalStaffs/EndPoints/EmployeesEndpoints.cs` |
| POST | `/api/employees/create-employee` | `appService.CreateEmployeeAsync` | `ReclutamientoLuxuryApp/ExternalStaffs/EndPoints/EmployeesEndpoints.cs` |
| POST | `/api/employees/create-employee-external` | `appService.BirthdayAsync` | `ReclutamientoLuxuryApp/ExternalStaffs/EndPoints/EmployeesEndpoints.cs` |
| GET | `/api/employees/birthday/{customerId:guid}/{month:int}` | `appService.BirthdayAsync` | `ReclutamientoLuxuryApp/ExternalStaffs/EndPoints/EmployeesEndpoints.cs` |
| GET | `/api/employees/validar-solicitudes-abiertas/{employeeId:guid}` | `appService.EmployeeTempAsync` | `ReclutamientoLuxuryApp/ExternalStaffs/EndPoints/EmployeesEndpoints.cs` |
| GET | `/api/employees/employee-temp` | `appService.EmployeeTempAsync` | `ReclutamientoLuxuryApp/ExternalStaffs/EndPoints/EmployeesEndpoints.cs` |
| GET | `/api/employees/validar-admin-asis/{applicationUserId}` | `appService.ValidarAdminAsisAsync` | `ReclutamientoLuxuryApp/ExternalStaffs/EndPoints/EmployeesEndpoints.cs` |

#### Modulo: InterviewerMatrices

- Interfaces: 1 | Servicios: 2 | Endpoints: 0 | DTOs: 5

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IInterviewerMatrixAppService | 7 | `ReclutamientoLuxuryApp/InterviewerMatrices/Interfaces/IInterviewerMatrixAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| InterviewerMatrixMapping | 0 | `ReclutamientoLuxuryApp/InterviewerMatrices/Mappings/InterviewerMatrixMapping.cs` |
| InterviewerMatrixAppService | 7 | `ReclutamientoLuxuryApp/InterviewerMatrices/Services/InterviewerMatrixAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| CreateAsync | IInterviewerMatrixAppService | CREATE | `Task<ApiResponseDTO<InterviewerMatrixItemDT…` | `InterviewerMatrixCreateOrUpdateDTO dto` |
| UpdateAsync | IInterviewerMatrixAppService | UPDATE | `Task<ApiResponseDTO<InterviewerMatrixItemDT…` | `Guid id, InterviewerMatrixCreateOrUpdateDTO dto` |
| DeleteAsync | IInterviewerMatrixAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetByCustomerAsync | IInterviewerMatrixAppService | GET_LIST | `Task<ApiResponseDTO<List<InterviewerMatrixI…` | `Guid customerId` |
| GetBoardByCustomerAsync | IInterviewerMatrixAppService | GET_LIST | `Task<ApiResponseDTO<InterviewerMatrixBoardD…` | `Guid customerId` |
| GetEligibleInterviewersByRequestPositionAsync | IInterviewerMatrixAppService | GET_LIST | `Task<ApiResponseDTO<List<EligibleInterviewe…` | `Guid requestPositionId` |
| ResolveInterviewerRoleAsync | IInterviewerMatrixAppService | SPECIAL | `Task<ApiResponseDTO<ApplicationRoleEnum?>>` | `Guid customerId, ApplicationRoleEnum workPositionRole` |

#### Modulo: JobDescriptions

- Interfaces: 1 | Servicios: 2 | Endpoints: 8 | DTOs: 4

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IJobDescriptionAppService | 6 | `ReclutamientoLuxuryApp/JobDescriptions/Interfaces/IJobDescriptionAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| JobDescriptionMapper | 0 | `ReclutamientoLuxuryApp/JobDescriptions/Mapping/JobDescriptionMapper.cs` |
| JobDescriptionAppService | 6 | `ReclutamientoLuxuryApp/JobDescriptions/Services/JobDescriptionAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| AddAsync | IJobDescriptionAppService | CREATE | `Task<ApiResponseDTO<JobDescriptionDTO>>` | `JobDescriptionAddOrEditDTO DTO` |
| DeleteByIdAsync | IJobDescriptionAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetAllAsync | IJobDescriptionAppService | GET_LIST | `Task<ApiResponseDTO<JobDescriptionDTO[]>>` | `-` |
| GetByIdAsync | IJobDescriptionAppService | GET_SINGLE | `Task<ApiResponseDTO<JobDescriptionAddOrEdit…` | `Guid id` |
| GetByWorkPositionIdAsync | IJobDescriptionAppService | GET_LIST | `Task<ApiResponseDTO<JobDescriptionDTO>>` | `Guid workPositionId` |
| UpdateAsync | IJobDescriptionAppService | UPDATE | `Task<ApiResponseDTO<JobDescriptionDTO>>` | `Guid id, JobDescriptionAddOrEditDTO DTO` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/job-descriptions/{id:guid}` | `dataService.GetByIdAsync` | `ReclutamientoLuxuryApp/JobDescriptions/EndPoints/JobDescriptionEndPoints.cs` |
| GET | `/api/job-descriptions/by-workposition/{workPositionId:guid}` | `dataService.GetByWorkPositionIdAsync` | `ReclutamientoLuxuryApp/JobDescriptions/EndPoints/JobDescriptionEndPoints.cs` |
| GET | `/api/job-descriptions` | `dataService.GetAllAsync` | `ReclutamientoLuxuryApp/JobDescriptions/EndPoints/JobDescriptionEndPoints.cs` |
| POST | `/api/job-descriptions` | `dataService.AddAsync` | `ReclutamientoLuxuryApp/JobDescriptions/EndPoints/JobDescriptionEndPoints.cs` |
| PUT | `/api/job-descriptions/{id:guid}` | `dataService.UpdateAsync` | `ReclutamientoLuxuryApp/JobDescriptions/EndPoints/JobDescriptionEndPoints.cs` |
| DELETE | `/api/job-descriptions/{id:guid}` | `dataService.DeleteByIdAsync` | `ReclutamientoLuxuryApp/JobDescriptions/EndPoints/JobDescriptionEndPoints.cs` |
| POST | `/api/job-descriptions/generate-proposal` | `aiService.GenerateJobDescriptionAsync` | `ReclutamientoLuxuryApp/JobDescriptions/EndPoints/JobDescriptionEndPoints.cs` |
| POST | `/api/job-descriptions/analyze` | `aiService.AnalyzeJobDescriptionAsync` | `ReclutamientoLuxuryApp/JobDescriptions/EndPoints/JobDescriptionEndPoints.cs` |

#### Modulo: Notifications

- Interfaces: 2 | Servicios: 2 | Endpoints: 0 | DTOs: 0

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| ICandidateNotificationCoordinatorService | 26 | `ReclutamientoLuxuryApp/Notifications/Interfaces/ICandidateNotificationCoordinatorService.cs` |
| IMultiChannelAlertService | 1 | `ReclutamientoLuxuryApp/Notifications/Interfaces/IMultiChannelAlertService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| CandidateNotificationCoordinatorService | 14 | `ReclutamientoLuxuryApp/Notifications/Services/CandidateNotificationCoordinatorService.cs` |
| MultiChannelAlertService | 1 | `ReclutamientoLuxuryApp/Notifications/Services/MultiChannelAlertService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| NotifyProcessCreatedAsync | ICandidateNotificationCoordinatorService | SPECIAL | `Task` | `Guid candidateProcessId` |
| NotifyProcessStageStalledAsync | ICandidateNotificationCoordinatorService | SPECIAL | `Task` | `Guid candidateProcessId` |
| NotifyProcessOperationsInterviewAgendaPendingAsync | ICandidateNotificationCoordinatorService | SPECIAL | `Task` | `Guid candidateProcessId` |
| NotifyProcessOperationsInterviewReminderAsync | ICandidateNotificationCoordinatorService | SPECIAL | `Task` | `Guid candidateProcessId` |
| NotifyProcessOperationsInterviewOverdueAsync | ICandidateNotificationCoordinatorService | SPECIAL | `Task` | `Guid candidateProcessId` |
| NotifyProcessSentToOperationsInterviewAsync | ICandidateNotificationCoordinatorService | SPECIAL | `Task` | `Guid candidateProcessId` |
| NotifyProcessInterviewScheduledAsync | ICandidateNotificationCoordinatorService | SPECIAL | `Task` | `Guid candidateProcessId` |
| NotifyProcessInterviewCancelledAsync | ICandidateNotificationCoordinatorService | SPECIAL | `Task` | `Guid candidateProcessId, DateTime? cancelledInterviewAt = n…` |
| NotifyProcessReceptionConfirmedAsync | ICandidateNotificationCoordinatorService | SPECIAL | `Task` | `Guid candidateProcessId, string interviewerUserId, Applicat…` |
| NotifyProcessPresentationHiringRequestGeneratedAsync | ICandidateNotificationCoordinatorService | SPECIAL | `Task` | `Guid candidateProcessId` |
| NotifyProcessInterviewFeedbackSubmittedAsync | ICandidateNotificationCoordinatorService | SPECIAL | `Task` | `Guid candidateProcessId, string interviewerUserId, Applicat…` |
| NotifySiblingCandidatesFrozenAsync | ICandidateNotificationCoordinatorService | SPECIAL | `Task` | `Guid requestPositionId, List<Guid> frozenCandidateProcessId…` |
| NotifyProcessInterviewDecisionRevertedAsync | ICandidateNotificationCoordinatorService | SPECIAL | `Task` | `Guid candidateProcessId, string interviewerUserId, Applicat…` |
| NotifyProcessOperationsInterviewEscalatedAsync | ICandidateNotificationCoordinatorService | SPECIAL | `Task` | `Guid candidateProcessId, int hoursOverdue` |
| NotifyApplicationCreatedAsync | ICandidateNotificationCoordinatorService | SPECIAL | `Task` | `Guid candidateApplicationId` |
| NotifyApplicationStageStalledAsync | ICandidateNotificationCoordinatorService | SPECIAL | `Task` | `Guid candidateApplicationId` |
| NotifyOperationsInterviewAgendaPendingAsync | ICandidateNotificationCoordinatorService | SPECIAL | `Task` | `Guid candidateApplicationId` |
| NotifyOperationsInterviewReminderAsync | ICandidateNotificationCoordinatorService | SPECIAL | `Task` | `Guid candidateApplicationId` |
| NotifyOperationsInterviewOverdueAsync | ICandidateNotificationCoordinatorService | SPECIAL | `Task` | `Guid candidateApplicationId` |
| NotifyApplicationSentToOperationsInterviewAsync | ICandidateNotificationCoordinatorService | SPECIAL | `Task` | `Guid candidateApplicationId` |
| NotifyInterviewScheduledAsync | ICandidateNotificationCoordinatorService | SPECIAL | `Task` | `Guid candidateApplicationId` |
| NotifyInterviewCancelledAsync | ICandidateNotificationCoordinatorService | SPECIAL | `Task` | `Guid candidateApplicationId, DateTime? cancelledInterviewAt…` |
| NotifyReceptionConfirmedAsync | ICandidateNotificationCoordinatorService | SPECIAL | `Task` | `Guid candidateApplicationId, string interviewerUserId, Appl…` |
| NotifyInterviewFeedbackSubmittedAsync | ICandidateNotificationCoordinatorService | SPECIAL | `Task` | `Guid candidateApplicationId, string interviewerUserId, Appl…` |
| NotifyInterviewDecisionRevertedAsync | ICandidateNotificationCoordinatorService | SPECIAL | `Task` | `Guid candidateApplicationId, string interviewerUserId, Appl…` |
| NotifyOperationsInterviewEscalatedAsync | ICandidateNotificationCoordinatorService | SPECIAL | `Task` | `Guid candidateApplicationId, int hoursOverdue` |
| SendAlertAsync | IMultiChannelAlertService | SPECIAL | `Task` | `string title, string message, AlertSeverity severity = Aler…` |

#### Modulo: Persistence

- Interfaces: 0 | Servicios: 0 | Endpoints: 0 | DTOs: 0

#### Modulo: ProviderSupports

- Interfaces: 1 | Servicios: 1 | Endpoints: 4 | DTOs: 2

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IPersonProviderSupportAppService | 4 | `ReclutamientoLuxuryApp/ProviderSupports/Interfaces/IPersonProviderSupportAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| PersonProviderSupportAppService | 4 | `ReclutamientoLuxuryApp/ProviderSupports/Services/PersonProviderSupportAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetAllAsync | IPersonProviderSupportAppService | GET_LIST | `Task<ApiResponseDTO<List<ProviderSupportLis…` | `-` |
| GetByIdAsync | IPersonProviderSupportAppService | GET_SINGLE | `Task<ApiResponseDTO<ProviderSupportAddOrEdi…` | `Guid id` |
| AddAsync | IPersonProviderSupportAppService | CREATE | `Task<ApiResponseDTO<PersonProviderSupport>>` | `ProviderSupportAddOrEditDTO DTO` |
| UpdateAsync | IPersonProviderSupportAppService | UPDATE | `Task<ApiResponseDTO<PersonProviderSupport>>` | `Guid id, ProviderSupportAddOrEditDTO DTO` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/provider-support` | `appService.GetAllAsync` | `ReclutamientoLuxuryApp/ProviderSupports/EndPoints/ProviderSupportEndPoints.cs` |
| GET | `/api/provider-support/{id:guid}` | `appService.GetByIdAsync` | `ReclutamientoLuxuryApp/ProviderSupports/EndPoints/ProviderSupportEndPoints.cs` |
| POST | `/api/provider-support` | `appService.AddAsync` | `ReclutamientoLuxuryApp/ProviderSupports/EndPoints/ProviderSupportEndPoints.cs` |
| PUT | `/api/provider-support/{id:guid}` | `appService.UpdateAsync` | `ReclutamientoLuxuryApp/ProviderSupports/EndPoints/ProviderSupportEndPoints.cs` |

#### Modulo: RecruitmentRequests

- Interfaces: 2 | Servicios: 2 | Endpoints: 6 | DTOs: 1

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IReclutamientoIntegrationService | 1 | `ReclutamientoLuxuryApp/RecruitmentRequests/Interfaces/IReclutamientoIntegrationService.cs` |
| IReclutamientoQueryService | 2 | `ReclutamientoLuxuryApp/RecruitmentRequests/Interfaces/IReclutamientoQueryService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| ReclutamientoIntegrationService | 1 | `ReclutamientoLuxuryApp/RecruitmentRequests/Services/ReclutamientoIntegrationService.cs` |
| ReclutamientoQueryService | 2 | `ReclutamientoLuxuryApp/RecruitmentRequests/Services/ReclutamientoQueryService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetEmployeeOpenRequestsAsync | IReclutamientoIntegrationService | GET_LIST | `Task<ApiResponseDTO<EmployeeOpenRequestsDTO…` | `Guid employeeId` |
| RequestsByCustomerAsync | IReclutamientoQueryService | OTHER | `Task<ApiResponseDTO<IEnumerable<ListSolicit…` | `Guid customerId, string applicationUserId` |
| GetRequestsGlobalPendingAsync | IReclutamientoQueryService | GET_LIST | `Task<ApiResponseDTO<IEnumerable<ListSolicit…` | `string applicationUserId` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| POST | `/api/recruitment-requests/solicitud-vacante` | `requestPositionService.OnSolicitudVacanteAsync` | `ReclutamientoLuxuryApp/RecruitmentRequests/EndPoints/SolicitudesReclutamientoEndPoints.cs` |
| POST | `/api/recruitment-requests/solicitud-modificacion-salario/{customerId}` | `salaryModificationService.OnSolicitudModificacionSalarialAsync` | `ReclutamientoLuxuryApp/RecruitmentRequests/EndPoints/SolicitudesReclutamientoEndPoints.cs` |
| POST | `/api/recruitment-requests/solicitud-baja/{customerId}/{employeeId}` | `dismissalService.OnSolicitudBajaAsync` | `ReclutamientoLuxuryApp/RecruitmentRequests/EndPoints/SolicitudesReclutamientoEndPoints.cs` |
| POST | `/api/recruitment-requests/solicitud-alta/{applicationUserId}` | `registerService.OnSolicitudAltaAsync` | `ReclutamientoLuxuryApp/RecruitmentRequests/EndPoints/SolicitudesReclutamientoEndPoints.cs` |
| GET | `/api/recruitment-requests/solicitudes-por-cliente/{customerId}/{applicationUserId}` | `queryService.RequestsByCustomerAsync` | `ReclutamientoLuxuryApp/RecruitmentRequests/EndPoints/SolicitudesReclutamientoEndPoints.cs` |
| GET | `/api/recruitment-requests/pending-global` | `queryService.GetRequestsGlobalPendingAsync` | `ReclutamientoLuxuryApp/RecruitmentRequests/EndPoints/SolicitudesReclutamientoEndPoints.cs` |

#### Modulo: RecruitmentSourceCatalogs

- Interfaces: 1 | Servicios: 1 | Endpoints: 5 | DTOs: 1

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IRecruitmentSourceCatalogAppService | 5 | `ReclutamientoLuxuryApp/RecruitmentSourceCatalogs/Interfaces/IRecruitmentSourceCatalogAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| RecruitmentSourceCatalogAppService | 5 | `ReclutamientoLuxuryApp/RecruitmentSourceCatalogs/Services/RecruitmentSourceCatalogAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetAllAsync | IRecruitmentSourceCatalogAppService | GET_LIST | `Task<ApiResponseDTO<List<RecruitmentSourceC…` | `-` |
| GetByIdAsync | IRecruitmentSourceCatalogAppService | GET_SINGLE | `Task<ApiResponseDTO<RecruitmentSourceCatalo…` | `Guid id` |
| CreateAsync | IRecruitmentSourceCatalogAppService | CREATE | `Task<ApiResponseDTO<RecruitmentSourceCatalo…` | `RecruitmentSourceCatalogCreateDTO dto` |
| UpdateAsync | IRecruitmentSourceCatalogAppService | UPDATE | `Task<ApiResponseDTO<RecruitmentSourceCatalo…` | `Guid id, RecruitmentSourceCatalogUpdateDTO dto` |
| DeleteAsync | IRecruitmentSourceCatalogAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/recruitment-source-catalogs` | `appService.GetAllAsync` | `ReclutamientoLuxuryApp/RecruitmentSourceCatalogs/EndPoints/RecruitmentSourceCatalogEndpoints.cs` |
| GET | `/api/recruitment-source-catalogs/{id:guid}` | `appService.GetByIdAsync` | `ReclutamientoLuxuryApp/RecruitmentSourceCatalogs/EndPoints/RecruitmentSourceCatalogEndpoints.cs` |
| POST | `/api/recruitment-source-catalogs` | `appService.CreateAsync` | `ReclutamientoLuxuryApp/RecruitmentSourceCatalogs/EndPoints/RecruitmentSourceCatalogEndpoints.cs` |
| PUT | `/api/recruitment-source-catalogs/{id:guid}` | `appService.UpdateAsync` | `ReclutamientoLuxuryApp/RecruitmentSourceCatalogs/EndPoints/RecruitmentSourceCatalogEndpoints.cs` |
| DELETE | `/api/recruitment-source-catalogs/{id:guid}` | `appService.DeleteAsync` | `ReclutamientoLuxuryApp/RecruitmentSourceCatalogs/EndPoints/RecruitmentSourceCatalogEndpoints.cs` |

#### Modulo: RecurringTasks

- Interfaces: 3 | Servicios: 4 | Endpoints: 17 | DTOs: 13

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IRecurringTaskGeneratorService | 1 | `ReclutamientoLuxuryApp/RecurringTasks/Interfaces/IRecurringTaskGeneratorService.cs` |
| ITaskInstanceAppService | 5 | `ReclutamientoLuxuryApp/RecurringTasks/Interfaces/ITaskInstanceAppService.cs` |
| ITaskTemplateAppService | 12 | `ReclutamientoLuxuryApp/RecurringTasks/Interfaces/ITaskTemplateAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| RecurringTasksProfile | 0 | `ReclutamientoLuxuryApp/RecurringTasks/Mapping/RecurringTasksProfile.cs` |
| RecurringTaskGeneratorService | 1 | `ReclutamientoLuxuryApp/RecurringTasks/Services/RecurringTaskGeneratorService.cs` |
| TaskInstanceAppService | 5 | `ReclutamientoLuxuryApp/RecurringTasks/Services/TaskInstanceAppService.cs` |
| TaskTemplateAppService | 12 | `ReclutamientoLuxuryApp/RecurringTasks/Services/TaskTemplateAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GenerateInstancesForAllCustomersAsync | IRecurringTaskGeneratorService | SPECIAL | `Task` | `-` |
| GetForUserByDateAsync | ITaskInstanceAppService | GET_LIST | `Task<ApiResponseDTO<IEnumerable<TaskInstanc…` | `string userId, DateTime date` |
| GetByIdAsync | ITaskInstanceAppService | GET_SINGLE | `Task<ApiResponseDTO<TaskInstanceDTO>>` | `Guid id` |
| CompleteAsync | ITaskInstanceAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid id, CompleteTaskInstanceDTO completeDTO, string userId` |
| ReopenAsync | ITaskInstanceAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid id, string userId` |
| AddCommentAsync | ITaskInstanceAppService | CREATE | `Task<ApiResponseDTO<TaskCommentDTO>>` | `Guid id, CreateTaskCommentDTO commentDTO, string userId` |
| GetAllTemplatesAsync | ITaskTemplateAppService | GET_LIST | `Task<ApiResponseDTO<IEnumerable<TaskTemplat…` | `bool state` |
| GetTemplateByIdAsync | ITaskTemplateAppService | GET_SINGLE | `Task<ApiResponseDTO<TaskTemplateDTO>>` | `Guid id` |
| CreateTemplateAsync | ITaskTemplateAppService | CREATE | `Task<ApiResponseDTO<TaskTemplateDTO>>` | `CreateTaskTemplateDTO dto, string userId` |
| UpdateTemplateAsync | ITaskTemplateAppService | UPDATE | `Task<ApiResponseDTO<bool>>` | `Guid id, UpdateTaskTemplateDTO dto, string userId` |
| DeleteTemplateAsync | ITaskTemplateAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `string id` |
| GetItemsByTemplateIdAsync | ITaskTemplateAppService | GET_LIST | `Task<ApiResponseDTO<IEnumerable<TaskTemplat…` | `Guid templateId` |
| ReorderTemplateItemsAsync | ITaskTemplateAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid templateId, TaskTemplateItemsReorderDTO dto` |
| AddItemToTemplateAsync | ITaskTemplateAppService | CREATE | `Task<ApiResponseDTO<TaskTemplateItemDTO>>` | `Guid templateId, CreateTaskTemplateItemDTO dto` |
| UpdateItemInTemplateAsync | ITaskTemplateAppService | UPDATE | `Task<ApiResponseDTO<bool>>` | `string itemId, UpdateTaskTemplateItemDTO dto` |
| DeleteItemAsync | ITaskTemplateAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `string itemId` |
| GetCustomerConfigAsync | ITaskTemplateAppService | GET_LIST | `Task<ApiResponseDTO<CustomerTaskItemConfigD…` | `Guid customerId` |
| UpdateCustomerConfigAsync | ITaskTemplateAppService | UPDATE | `Task<ApiResponseDTO<bool>>` | `CustomerTaskItemConfigDTO dto` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/recurring-tasks/instances/my-daily-tasks` | `taskInstanceAppService.GetForUserByDateAsync` | `ReclutamientoLuxuryApp/RecurringTasks/Endpoints/TaskInstancesEndPoints.cs` |
| GET | `/api/recurring-tasks/instances/{id:guid}` | `taskInstanceAppService.GetByIdAsync` | `ReclutamientoLuxuryApp/RecurringTasks/Endpoints/TaskInstancesEndPoints.cs` |
| POST | `/api/recurring-tasks/instances/{id:guid}/complete` | `taskInstanceAppService.CompleteAsync` | `ReclutamientoLuxuryApp/RecurringTasks/Endpoints/TaskInstancesEndPoints.cs` |
| POST | `/api/recurring-tasks/instances/{id:guid}/reopen` | `taskInstanceAppService.ReopenAsync` | `ReclutamientoLuxuryApp/RecurringTasks/Endpoints/TaskInstancesEndPoints.cs` |
| POST | `/api/recurring-tasks/instances/{id:guid}/comments` | `taskInstanceAppService.AddCommentAsync` | `ReclutamientoLuxuryApp/RecurringTasks/Endpoints/TaskInstancesEndPoints.cs` |
| GET | `/api/recurring-tasks/templates/list/{state:bool}` | `appService.GetAllTemplatesAsync` | `ReclutamientoLuxuryApp/RecurringTasks/Endpoints/TaskTemplatesEndPoints.cs` |
| GET | `/api/recurring-tasks/templates/{id:guid}` | `appService.GetTemplateByIdAsync` | `ReclutamientoLuxuryApp/RecurringTasks/Endpoints/TaskTemplatesEndPoints.cs` |
| POST | `/api/recurring-tasks/templates` | `appService.CreateTemplateAsync` | `ReclutamientoLuxuryApp/RecurringTasks/Endpoints/TaskTemplatesEndPoints.cs` |
| PUT | `/api/recurring-tasks/templates/{id:guid}` | `appService.UpdateTemplateAsync` | `ReclutamientoLuxuryApp/RecurringTasks/Endpoints/TaskTemplatesEndPoints.cs` |
| DELETE | `/api/recurring-tasks/templates/{id}` | `appService.DeleteTemplateAsync` | `ReclutamientoLuxuryApp/RecurringTasks/Endpoints/TaskTemplatesEndPoints.cs` |
| GET | `/api/recurring-tasks/templates/{templateId:guid}/items` | `appService.GetItemsByTemplateIdAsync` | `ReclutamientoLuxuryApp/RecurringTasks/Endpoints/TaskTemplatesEndPoints.cs` |
| POST | `/api/recurring-tasks/templates/{templateId:guid}/items` | `appService.AddItemToTemplateAsync` | `ReclutamientoLuxuryApp/RecurringTasks/Endpoints/TaskTemplatesEndPoints.cs` |
| PUT | `/api/recurring-tasks/templates/items/{itemId}` | `appService.UpdateItemInTemplateAsync` | `ReclutamientoLuxuryApp/RecurringTasks/Endpoints/TaskTemplatesEndPoints.cs` |
| PUT | `/api/recurring-tasks/templates/{templateId:guid}/items/reorder` | `appService.ReorderTemplateItemsAsync` | `ReclutamientoLuxuryApp/RecurringTasks/Endpoints/TaskTemplatesEndPoints.cs` |
| DELETE | `/api/recurring-tasks/templates/items/{itemId}` | `appService.DeleteItemAsync` | `ReclutamientoLuxuryApp/RecurringTasks/Endpoints/TaskTemplatesEndPoints.cs` |
| GET | `/api/recurring-tasks/templates/config/{customerId:guid}` | `appService.GetCustomerConfigAsync` | `ReclutamientoLuxuryApp/RecurringTasks/Endpoints/TaskTemplatesEndPoints.cs` |
| POST | `/api/recurring-tasks/templates/config` | `appService.UpdateCustomerConfigAsync` | `ReclutamientoLuxuryApp/RecurringTasks/Endpoints/TaskTemplatesEndPoints.cs` |

#### Modulo: RequestDismissalDiscounts

- Interfaces: 1 | Servicios: 2 | Endpoints: 3 | DTOs: 3

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IRequestDismissalDiscountAppService | 4 | `ReclutamientoLuxuryApp/RequestDismissalDiscounts/Interfaces/IRequestDismissalDiscountAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| RequestDismissalDiscountMappingProfile | 0 | `ReclutamientoLuxuryApp/RequestDismissalDiscounts/Mapping/RequestDismissalDiscountMappingProfile.cs` |
| RequestDismissalDiscountAppService | 4 | `ReclutamientoLuxuryApp/RequestDismissalDiscounts/Services/RequestDismissalDiscountAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetByIdAsync | IRequestDismissalDiscountAppService | GET_SINGLE | `Task<ApiResponseDTO<RequestDismissalDiscoun…` | `Guid id` |
| AddAsync | IRequestDismissalDiscountAppService | CREATE | `Task<ApiResponseDTO<RequestDismissalDiscoun…` | `RequestDismissalDiscountAddOrEditDTO DTO` |
| UpdateAsync | IRequestDismissalDiscountAppService | UPDATE | `Task<ApiResponseDTO<RequestDismissalDiscoun…` | `Guid id, RequestDismissalDiscountAddOrEditDTO DTO` |
| DeleteAsync | IRequestDismissalDiscountAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/request-dismissal-discount/{id:guid}` | `appService.GetByIdAsync` | `ReclutamientoLuxuryApp/RequestDismissalDiscounts/EndPoints/RequestDismissalDiscountEndPoints.cs` |
| PUT | `/api/request-dismissal-discount/{id:guid}` | `appService.UpdateAsync` | `ReclutamientoLuxuryApp/RequestDismissalDiscounts/EndPoints/RequestDismissalDiscountEndPoints.cs` |
| DELETE | `/api/request-dismissal-discount/{id:guid}` | `appService.DeleteAsync` | `ReclutamientoLuxuryApp/RequestDismissalDiscounts/EndPoints/RequestDismissalDiscountEndPoints.cs` |

#### Modulo: RequestDismissals

- Interfaces: 1 | Servicios: 2 | Endpoints: 11 | DTOs: 9

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| ISolicitudBajaAppService | 14 | `ReclutamientoLuxuryApp/RequestDismissals/Interfaces/ISolicitudBajaAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| RequestDismissalMapper | 0 | `ReclutamientoLuxuryApp/RequestDismissals/Mapping/RequestDismissalMapper.cs` |
| SolicitudBajaAppService | 14 | `ReclutamientoLuxuryApp/RequestDismissals/Services/SolicitudBajaAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetListAsync | ISolicitudBajaAppService | GET_LIST | `Task<ApiResponseDTO<List<RequestDismissalLi…` | `string status, DateTime? dateRequest` |
| GetByIdAsync | ISolicitudBajaAppService | GET_SINGLE | `Task<ApiResponseDTO<RequestDismissalDTO>>` | `Guid id` |
| OnSendEmailRequestDismissalAsync | ISolicitudBajaAppService | OTHER | `Task<ApiResponseDTO<RequestDismissalSendReq…` | `Guid workPositionId` |
| GetRequestDismissal | ISolicitudBajaAppService | GET_LIST | `ApiResponseDTO<SolicitudBajaEmailDTO>` | `Guid employeeId` |
| GetRequestDismissalSendRequestDTOAsync | ISolicitudBajaAppService | GET_LIST | `Task<ApiResponseDTO<List<RequestDismissalSe…` | `-` |
| AddAsync | ISolicitudBajaAppService | CREATE | `Task<ApiResponseDTO<RequestDismissal>>` | `RequestDismissalAddOrEditDTO DTO` |
| PutRequestDismissalAsync | ISolicitudBajaAppService | UPDATE | `Task<ApiResponseDTO<object>>` | `Guid id, RequestDismissalAddOrEditDTO DTO` |
| UpdateStatusAsync | ISolicitudBajaAppService | UPDATE | `Task<ApiResponseDTO<bool>>` | `Guid id, RequestDismissalStatusUpdateDTO dto` |
| DeleteAsync | ISolicitudBajaAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| OnSolicitudBajaAsync | ISolicitudBajaAppService | OTHER | `Task<ApiResponseDTO<RequestDismissal>>` | `Guid customerId, Guid employeeId, string applicationUserId,…` |
| ExportRequestToExcelAsync | ISolicitudBajaAppService | SPECIAL | `Task<FileResult>` | `DateTime? dateRequest, string status` |
| AuthorizeDismissalAsync | ISolicitudBajaAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid requestDismissalId, string department` |
| AttachIncidentAsync | ISolicitudBajaAppService | OTHER | `Task<ApiResponseDTO<bool>>` | `Guid requestDismissalId, Guid incidentId` |
| AttachEvaluationAsync | ISolicitudBajaAppService | OTHER | `Task<ApiResponseDTO<bool>>` | `Guid requestDismissalId, Guid evaluationId` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/request-dismissal/list` | `appService.GetListAsync` | `ReclutamientoLuxuryApp/RequestDismissals/EndPoints/RequestDismissalEndPoints.cs` |
| GET | `/api/request-dismissal/send-email/{workPositionId:guid}` | `appService.OnSendEmailRequestDismissalAsync` | `ReclutamientoLuxuryApp/RequestDismissals/EndPoints/RequestDismissalEndPoints.cs` |
| GET | `/api/request-dismissal/get-by-id/{id:guid}` | `appService.GetByIdAsync` | `ReclutamientoLuxuryApp/RequestDismissals/EndPoints/RequestDismissalEndPoints.cs` |
| GET | `/api/request-dismissal/get-request-dismissal/{employeeId:guid}` | `appService.GetRequestDismissalSendRequestDTOAsync` | `ReclutamientoLuxuryApp/RequestDismissals/EndPoints/RequestDismissalEndPoints.cs` |
| PUT | `/api/request-dismissal/{id:guid}` | `appService.PutRequestDismissalAsync` | `ReclutamientoLuxuryApp/RequestDismissals/EndPoints/RequestDismissalEndPoints.cs` |
| PATCH | `/api/request-dismissal/{id:guid}/status` | `appService.UpdateStatusAsync` | `ReclutamientoLuxuryApp/RequestDismissals/EndPoints/RequestDismissalEndPoints.cs` |
| DELETE | `/api/request-dismissal/{id:guid}` | `appService.DeleteAsync` | `ReclutamientoLuxuryApp/RequestDismissals/EndPoints/RequestDismissalEndPoints.cs` |
| PATCH | `/api/request-dismissal/{id:guid}/authorize/{department}` | `appService.AuthorizeDismissalAsync` | `ReclutamientoLuxuryApp/RequestDismissals/EndPoints/RequestDismissalEndPoints.cs` |
| POST | `/api/request-dismissal/{id:guid}/attach-incident/{incidentId:guid}` | `appService.AttachIncidentAsync` | `ReclutamientoLuxuryApp/RequestDismissals/EndPoints/RequestDismissalEndPoints.cs` |
| POST | `/api/request-dismissal/{id:guid}/attach-evaluation/{evaluationId:guid}` | `appService.AttachEvaluationAsync` | `ReclutamientoLuxuryApp/RequestDismissals/EndPoints/RequestDismissalEndPoints.cs` |
| GET | `/api/request-dismissal/export-excel` | `appService.ExportRequestToExcelAsync` | `ReclutamientoLuxuryApp/RequestDismissals/EndPoints/RequestDismissalEndPoints.cs` |

#### Modulo: RequestEmployeeRegisters

- Interfaces: 1 | Servicios: 2 | Endpoints: 15 | DTOs: 11

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IRequestEmployeeRegisterAppService | 19 | `ReclutamientoLuxuryApp/RequestEmployeeRegisters/Interfaces/IRequestEmployeeRegisterAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| RequestEmployeeRegisterMappingProfile | 0 | `ReclutamientoLuxuryApp/RequestEmployeeRegisters/Mapping/RequestEmployeeRegisterMappingProfile.cs` |
| RequestEmployeeRegisterAppService | 19 | `ReclutamientoLuxuryApp/RequestEmployeeRegisters/Services/RequestEmployeeRegisterAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetByIdAsync | IRequestEmployeeRegisterAppService | GET_SINGLE | `Task<ApiResponseDTO<RequestEmployeeRegister…` | `Guid id` |
| GetEmployeeRegisterAsync | IRequestEmployeeRegisterAppService | GET_LIST | `Task<ApiResponseDTO<GetRequestEmployeeRegis…` | `Guid employeeId, Guid customerId` |
| GetListRequestEmployeeRegisterAsync | IRequestEmployeeRegisterAppService | GET_LIST | `Task<ApiResponseDTO<List<object>>>` | `string status, DateTime? dateRequest` |
| AddAsync | IRequestEmployeeRegisterAppService | CREATE | `Task<ApiResponseDTO<RequestEmployeeRegister…` | `RequestEmployeeRegisterAddOrEditDTO DTO` |
| UpdateAsync | IRequestEmployeeRegisterAppService | UPDATE | `Task<ApiResponseDTO<RequestEmployeeRegister…` | `Guid id, RequestEmployeeRegisterAddOrEditDTO DTO` |
| UpdateStatusAsync | IRequestEmployeeRegisterAppService | UPDATE | `Task<ApiResponseDTO<bool>>` | `Guid id, RequestEmployeeRegisterUpdateStatusDTO dto` |
| ConcludeAdministrativelyAsync | IRequestEmployeeRegisterAppService | OTHER | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| CompleteDraftAltaAsync | IRequestEmployeeRegisterAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid requestEmployeeRegisterId, CandidateApplicationProcess…` |
| SearchEmployeeDuplicatesAsync | IRequestEmployeeRegisterAppService | GET_LIST | `Task<ApiResponseDTO<List<DuplicateEmployeeM…` | `RequestEmployeeRegisterDuplicateSearchDTO dto` |
| ReactivateAndMigrateEmployeeAsync | IRequestEmployeeRegisterAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid existingEmployeeId, Guid requestPositionId, Guid candi…` |
| GetBasicInfoAsync | IRequestEmployeeRegisterAppService | GET_LIST | `Task<ApiResponseDTO<RequestEmployeeRegister…` | `Guid id` |
| DeleteByIdAsync | IRequestEmployeeRegisterAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| OnSolicitudAltaAsync | IRequestEmployeeRegisterAppService | OTHER | `Task<ApiResponseDTO<RequestEmployeeRegister…` | `string applicationUserId, GetRequestEmployeeRegisterDTO DTO` |
| ResendSolicitudAltaEmailAsync | IRequestEmployeeRegisterAppService | OTHER | `Task<ApiResponseDTO<bool>>` | `Guid requestEmployeeRegisterId` |
| OnSendEmailAltaSistemasAsync | IRequestEmployeeRegisterAppService | OTHER | `Task<ApiResponseDTO<bool>>` | `Guid requestEmployeeRegisterId` |
| ExportRequestToExcelAsync | IRequestEmployeeRegisterAppService | SPECIAL | `Task<FileResult>` | `DateTime? dateRequest, string status` |
| ExportHiringFormatPdfAsync | IRequestEmployeeRegisterAppService | SPECIAL | `Task<FileResult>` | `Guid id` |
| ExportMergedHiringPdfAsync | IRequestEmployeeRegisterAppService | SPECIAL | `Task<FileResult>` | `Guid id` |
| SendMergedHiringPdfAsync | IRequestEmployeeRegisterAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid id` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/request-employee-register/{id:guid}` | `appService.GetByIdAsync` | `ReclutamientoLuxuryApp/RequestEmployeeRegisters/EndPoints/RequestEmployeeRegisterEndPoints.cs` |
| GET | `/api/request-employee-register/{id:guid}/basic-info` | `appService.GetBasicInfoAsync` | `ReclutamientoLuxuryApp/RequestEmployeeRegisters/EndPoints/RequestEmployeeRegisterEndPoints.cs` |
| GET | `/api/request-employee-register/get-employee-register/{employeeId:guid}/{customerId:guid}` | `appService.GetEmployeeRegisterAsync` | `ReclutamientoLuxuryApp/RequestEmployeeRegisters/EndPoints/RequestEmployeeRegisterEndPoints.cs` |
| GET | `/api/request-employee-register/list` | `appService.GetListRequestEmployeeRegisterAsync` | `ReclutamientoLuxuryApp/RequestEmployeeRegisters/EndPoints/RequestEmployeeRegisterEndPoints.cs` |
| PUT | `/api/request-employee-register/{id:guid}` | `appService.UpdateAsync` | `ReclutamientoLuxuryApp/RequestEmployeeRegisters/EndPoints/RequestEmployeeRegisterEndPoints.cs` |
| PUT | `/api/request-employee-register/{id:guid}/status` | `appService.UpdateStatusAsync` | `ReclutamientoLuxuryApp/RequestEmployeeRegisters/EndPoints/RequestEmployeeRegisterEndPoints.cs` |
| PATCH | `/api/request-employee-register/{id:guid}/conclude` | `appService.ConcludeAdministrativelyAsync` | `ReclutamientoLuxuryApp/RequestEmployeeRegisters/EndPoints/RequestEmployeeRegisterEndPoints.cs` |
| PUT | `/api/request-employee-register/{id:guid}/complete-draft` | `appService.CompleteDraftAltaAsync` | `ReclutamientoLuxuryApp/RequestEmployeeRegisters/EndPoints/RequestEmployeeRegisterEndPoints.cs` |
| POST | `/api/request-employee-register/search-duplicates` | `appService.SearchEmployeeDuplicatesAsync` | `ReclutamientoLuxuryApp/RequestEmployeeRegisters/EndPoints/RequestEmployeeRegisterEndPoints.cs` |
| POST | `/api/request-employee-register/reactivate-and-migrate` | `appService.ReactivateAndMigrateEmployeeAsync` | `ReclutamientoLuxuryApp/RequestEmployeeRegisters/EndPoints/RequestEmployeeRegisterEndPoints.cs` |
| DELETE | `/api/request-employee-register/{id:guid}` | `appService.DeleteByIdAsync` | `ReclutamientoLuxuryApp/RequestEmployeeRegisters/EndPoints/RequestEmployeeRegisterEndPoints.cs` |
| GET | `/api/request-employee-register/export-excel` | `appService.ExportRequestToExcelAsync` | `ReclutamientoLuxuryApp/RequestEmployeeRegisters/EndPoints/RequestEmployeeRegisterEndPoints.cs` |
| GET | `/api/request-employee-register/{id:guid}/export-pdf` | `appService.ExportHiringFormatPdfAsync` | `ReclutamientoLuxuryApp/RequestEmployeeRegisters/EndPoints/RequestEmployeeRegisterEndPoints.cs` |
| GET | `/api/request-employee-register/{id:guid}/export-merged-pdf` | `appService.ExportMergedHiringPdfAsync` | `ReclutamientoLuxuryApp/RequestEmployeeRegisters/EndPoints/RequestEmployeeRegisterEndPoints.cs` |
| POST | `/api/request-employee-register/{id:guid}/send-merged-pdf` | `appService.SendMergedHiringPdfAsync` | `ReclutamientoLuxuryApp/RequestEmployeeRegisters/EndPoints/RequestEmployeeRegisterEndPoints.cs` |

#### Modulo: RequestPositions

- Interfaces: 1 | Servicios: 2 | Endpoints: 7 | DTOs: 4

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IRequestPositionAppService | 12 | `ReclutamientoLuxuryApp/RequestPositions/Interfaces/IRequestPositionAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| RequestPositionMapper | 0 | `ReclutamientoLuxuryApp/RequestPositions/Mapping/RequestPositionMapper.cs` |
| RequestPositionAppService | 10 | `ReclutamientoLuxuryApp/RequestPositions/Services/RequestPositionAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| OnGetRequestPositionCandidate | IRequestPositionAppService | OTHER | `RequestPosition` | `Guid id` |
| OnGetWorkPosition | IRequestPositionAppService | OTHER | `WorkPosition` | `Guid id` |
| OnSolicitudVacanteAsync | IRequestPositionAppService | OTHER | `Task<ApiResponseDTO<RequestPosition>>` | `string applicationUser, RequestPositionDTO DTO` |
| GetListAsync | IRequestPositionAppService | GET_LIST | `Task<ApiResponseDTO<List<SolicitudesVacante…` | `string status, DateTime? dateRequest` |
| GetPendingAsync | IRequestPositionAppService | GET_LIST | `Task<ApiResponseDTO<List<SolicitudesVacante…` | `-` |
| GetByIdAsync | IRequestPositionAppService | GET_SINGLE | `Task<ApiResponseDTO<RequestPositionAddOrEdi…` | `Guid id` |
| AddAsync | IRequestPositionAppService | CREATE | `Task<ApiResponseDTO<RequestPositionDTO>>` | `RequestPositionAddOrEditDTO DTO` |
| UpdateAsync | IRequestPositionAppService | UPDATE | `Task<ApiResponseDTO<RequestPositionDTO>>` | `Guid id, RequestPositionAddOrEditDTO DTO` |
| DeleteByIdAsync | IRequestPositionAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetDeleteImpactAsync | IRequestPositionAppService | GET_LIST | `Task<ApiResponseDTO<RequestPositionDeleteIm…` | `Guid id` |
| DeleteCascadeAsync | IRequestPositionAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| ExportToExcelAsync | IRequestPositionAppService | SPECIAL | `Task<FileResult>` | `DateTime? dateRequest, string status` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/request-position/pending` | `appService.GetPendingAsync` | `ReclutamientoLuxuryApp/RequestPositions/EndPoints/RequestPositionEndPoints.cs` |
| GET | `/api/request-position/{id:guid}` | `appService.GetByIdAsync` | `ReclutamientoLuxuryApp/RequestPositions/EndPoints/RequestPositionEndPoints.cs` |
| PUT | `/api/request-position/{id:guid}` | `appService.UpdateAsync` | `ReclutamientoLuxuryApp/RequestPositions/EndPoints/RequestPositionEndPoints.cs` |
| DELETE | `/api/request-position/{id:guid}` | `appService.DeleteByIdAsync` | `ReclutamientoLuxuryApp/RequestPositions/EndPoints/RequestPositionEndPoints.cs` |
| GET | `/api/request-position/{id:guid}/delete-impact` | `appService.GetDeleteImpactAsync` | `ReclutamientoLuxuryApp/RequestPositions/EndPoints/RequestPositionEndPoints.cs` |
| DELETE | `/api/request-position/{id:guid}/cascade` | `appService.DeleteCascadeAsync` | `ReclutamientoLuxuryApp/RequestPositions/EndPoints/RequestPositionEndPoints.cs` |
| GET | `/api/request-position/export-excel` | `appService.ExportToExcelAsync` | `ReclutamientoLuxuryApp/RequestPositions/EndPoints/RequestPositionEndPoints.cs` |

#### Modulo: SalaryModifications

- Interfaces: 1 | Servicios: 2 | Endpoints: 5 | DTOs: 5

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IRequestSalaryModificationAppService | 7 | `ReclutamientoLuxuryApp/SalaryModifications/Interfaces/IRequestSalaryModificationAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| SalaryModificationMapper | 0 | `ReclutamientoLuxuryApp/SalaryModifications/Mapping/SalaryModificationMapper.cs` |
| RequestSalaryModificationAppService | 7 | `ReclutamientoLuxuryApp/SalaryModifications/Services/RequestSalaryModificationAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| OnSolicitudModificacionSalarialAsync | IRequestSalaryModificationAppService | OTHER | `Task<ApiResponseDTO<RequestSalaryModificati…` | `Guid customerId, string applicationUserId, GetDataForModifi…` |
| GetDataForModificacionSalarioAsync | IRequestSalaryModificationAppService | GET_LIST | `Task<ApiResponseDTO<GetDataForModificacionS…` | `Guid employeeId` |
| GetStatusAsync | IRequestSalaryModificationAppService | GET_LIST | `Task<ApiResponseDTO<StatusRequestSalaryModi…` | `Guid workPositionId, Guid employeeId` |
| GetByIdAsync | IRequestSalaryModificationAppService | GET_SINGLE | `Task<ApiResponseDTO<RequestSalaryModificati…` | `Guid id` |
| UpdateAsync | IRequestSalaryModificationAppService | UPDATE | `Task<ApiResponseDTO<RequestSalaryModificati…` | `Guid id, RequestSalaryModificationAddOrEditDTO DTO` |
| GetListAsync | IRequestSalaryModificationAppService | GET_LIST | `Task<ApiResponseDTO<List<RequestSalaryModif…` | `string status, DateTime? dateRequest` |
| ExportToExcelAsync | IRequestSalaryModificationAppService | SPECIAL | `Task<FileResult>` | `DateTime? dateRequest, string status` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/request-salary-modification/get-data/{employeeId:guid}` | `appService.GetDataForModificacionSalarioAsync` | `ReclutamientoLuxuryApp/SalaryModifications/EndPoints/RequestSalaryModificationEndPoints.cs` |
| GET | `/api/request-salary-modification/{workPositionId:guid}/{employeeId:guid}` | `appService.GetStatusAsync` | `ReclutamientoLuxuryApp/SalaryModifications/EndPoints/RequestSalaryModificationEndPoints.cs` |
| GET | `/api/request-salary-modification/get-by-id/{id:guid}` | `appService.GetByIdAsync` | `ReclutamientoLuxuryApp/SalaryModifications/EndPoints/RequestSalaryModificationEndPoints.cs` |
| PUT | `/api/request-salary-modification/{id:guid}` | `appService.UpdateAsync` | `ReclutamientoLuxuryApp/SalaryModifications/EndPoints/RequestSalaryModificationEndPoints.cs` |
| GET | `/api/request-salary-modification/export-excel` | `appService.ExportToExcelAsync` | `ReclutamientoLuxuryApp/SalaryModifications/EndPoints/RequestSalaryModificationEndPoints.cs` |

#### Modulo: SanctionTypes

- Interfaces: 1 | Servicios: 2 | Endpoints: 6 | DTOs: 1

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| ISanctionTypeAppService | 6 | `ReclutamientoLuxuryApp/SanctionTypes/Interfaces/ISanctionTypeAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| SanctionTypeMappingProfile | 0 | `ReclutamientoLuxuryApp/SanctionTypes/Mapping/SanctionTypeMappingProfile.cs` |
| SanctionTypeAppService | 6 | `ReclutamientoLuxuryApp/SanctionTypes/Services/SanctionTypeAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetAllAsync | ISanctionTypeAppService | GET_LIST | `Task<ApiResponseDTO<SanctionTypeListDTO[]>>` | `-` |
| GetByIdAsync | ISanctionTypeAppService | GET_SINGLE | `Task<ApiResponseDTO<SanctionTypeDetailDTO>>` | `Guid id` |
| AddAsync | ISanctionTypeAppService | CREATE | `Task<ApiResponseDTO<SanctionTypeDetailDTO>>` | `SanctionTypeFormDTO dto` |
| UpdateAsync | ISanctionTypeAppService | UPDATE | `Task<ApiResponseDTO<SanctionTypeDetailDTO>>` | `Guid id, SanctionTypeFormDTO dto` |
| DeleteAsync | ISanctionTypeAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| ToggleActiveAsync | ISanctionTypeAppService | SPECIAL | `Task<ApiResponseDTO<SanctionTypeDetailDTO>>` | `Guid id` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/hr/sanction-types` | `dataService.GetAllAsync` | `ReclutamientoLuxuryApp/SanctionTypes/EndPoints/SanctionTypeEndPoints.cs` |
| GET | `/api/hr/sanction-types/{id:guid}` | `dataService.GetByIdAsync` | `ReclutamientoLuxuryApp/SanctionTypes/EndPoints/SanctionTypeEndPoints.cs` |
| POST | `/api/hr/sanction-types` | `dataService.AddAsync` | `ReclutamientoLuxuryApp/SanctionTypes/EndPoints/SanctionTypeEndPoints.cs` |
| PUT | `/api/hr/sanction-types/{id:guid}` | `dataService.UpdateAsync` | `ReclutamientoLuxuryApp/SanctionTypes/EndPoints/SanctionTypeEndPoints.cs` |
| DELETE | `/api/hr/sanction-types/{id:guid}` | `dataService.DeleteAsync` | `ReclutamientoLuxuryApp/SanctionTypes/EndPoints/SanctionTypeEndPoints.cs` |
| PATCH | `/api/hr/sanction-types/{id:guid}/toggle` | `dataService.ToggleActiveAsync` | `ReclutamientoLuxuryApp/SanctionTypes/EndPoints/SanctionTypeEndPoints.cs` |

#### Modulo: Shared

- Interfaces: 1 | Servicios: 1 | Endpoints: 0 | DTOs: 0

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IHrActionPolicyService | 8 | `ReclutamientoLuxuryApp/Shared/Policies/Interfaces/IHrActionPolicyService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| HrActionPolicyService | 3 | `ReclutamientoLuxuryApp/Shared/Policies/Services/HrActionPolicyService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| CanManageStructuralHr | IHrActionPolicyService | GET_SINGLE | `bool` | `-` |
| CanManageStructuralHr | IHrActionPolicyService | GET_SINGLE | `bool` | `ApplicationRoleEnum role` |
| CanManageStructuralHr | IHrActionPolicyService | GET_SINGLE | `bool` | `ApplicationRoleEnum requesterRole, ApplicationRoleEnum? tar…` |
| CanViewConfidentialHrData | IHrActionPolicyService | GET_SINGLE | `bool` | `ApplicationRoleEnum requesterRole, ApplicationRoleEnum? tar…` |
| EnsureCanManageStructuralHr | IHrActionPolicyService | SPECIAL | `void` | `ApplicationRoleEnum? targetRole` |
| ResolveCurrentUserRole | IHrActionPolicyService | SPECIAL | `ApplicationRoleEnum?` | `-` |
| ResolveWorkPositionRoleAsync | IHrActionPolicyService | SPECIAL | `Task<ApplicationRoleEnum?>` | `Guid workPositionId` |
| FilterAllowedRecipientRoles | IHrActionPolicyService | GET_LIST | `IEnumerable<ApplicationRoleEnum>` | `IEnumerable<ApplicationRoleEnum> candidateRoles` |

#### Modulo: SolicitudAltas

- Interfaces: 0 | Servicios: 1 | Endpoints: 0 | DTOs: 0

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| RequestEmployeeRegisterHandler | 2 | `ReclutamientoLuxuryApp/SolicitudAltas/Handlers/RequestEmployeeRegisterHandler.cs` |

#### Modulo: SolicitudBajas

- Interfaces: 0 | Servicios: 1 | Endpoints: 0 | DTOs: 0

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| RequestDismissalRequestedHandler | 1 | `ReclutamientoLuxuryApp/SolicitudBajas/Handlers/RequestDismissalRequestedHandler.cs` |

#### Modulo: SolicitudModificacionesSueldo

- Interfaces: 0 | Servicios: 1 | Endpoints: 0 | DTOs: 0

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| RequestSalaryModificationHandler | 1 | `ReclutamientoLuxuryApp/SolicitudModificacionesSueldo/Handlers/RequestSalaryModificationHandler.cs` |

#### Modulo: SolicitudVacantes

- Interfaces: 0 | Servicios: 1 | Endpoints: 0 | DTOs: 0

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| RequestPositionHandler | 1 | `ReclutamientoLuxuryApp/SolicitudVacantes/Handlers/RequestPositionHandler.cs` |

#### Modulo: WorkPositions

- Interfaces: 1 | Servicios: 2 | Endpoints: 11 | DTOs: 4

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IWorkPositionAppService | 11 | `ReclutamientoLuxuryApp/WorkPositions/Interfaces/IWorkPositionAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| WorkPositionMapper | 0 | `ReclutamientoLuxuryApp/WorkPositions/Mapping/WorkPositionMapper.cs` |
| WorkPositionAppService | 11 | `ReclutamientoLuxuryApp/WorkPositions/Services/WorkPositionAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetByIdAsync | IWorkPositionAppService | GET_SINGLE | `Task<ApiResponseDTO<WorkPositionRequestAddO…` | `Guid id` |
| GetForEditAsync | IWorkPositionAppService | GET_LIST | `Task<ApiResponseDTO<WorkPositionAddOrEditDT…` | `Guid id` |
| GetAllGeneralAsync | IWorkPositionAppService | GET_LIST | `Task<ApiResponseDTO<object>>` | `-` |
| GetAsyncAll | IWorkPositionAppService | GET_LIST | `Task<ApiResponseDTO<List<WorkPositionListDT…` | `Guid customerId, State state` |
| AddAsync | IWorkPositionAppService | CREATE | `Task<ApiResponseDTO<WorkPositionDTO>>` | `WorkPositionAddOrEditDTO DTO` |
| UpdateAsync | IWorkPositionAppService | UPDATE | `Task<ApiResponseDTO<WorkPositionDTO>>` | `Guid id, WorkPositionAddOrEditDTO DTO` |
| DeleteByIdAsync | IWorkPositionAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetHoursAsync | IWorkPositionAppService | GET_LIST | `Task<ApiResponseDTO<WorkPositionHoursDTO>>` | `Guid id` |
| AssignEmployeeAsync | IWorkPositionAppService | SPECIAL | `Task<ApiResponseDTO<WorkPositionDTO>>` | `string applicationUserId, Guid workPositionId` |
| UnassignEmployeeAsync | IWorkPositionAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| ActivateAsync | IWorkPositionAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid id` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/work-positions/{id:guid}` | `appService.GetByIdAsync` | `ReclutamientoLuxuryApp/WorkPositions/EndPoints/WorkPositionEndPoints.cs` |
| GET | `/api/work-positions/list-by-customer/{customerId:guid}/{state}` | `appService.GetForEditAsync` | `ReclutamientoLuxuryApp/WorkPositions/EndPoints/WorkPositionEndPoints.cs` |
| GET | `/api/work-positions/for-edit/{id:guid}` | `appService.GetForEditAsync` | `ReclutamientoLuxuryApp/WorkPositions/EndPoints/WorkPositionEndPoints.cs` |
| GET | `/api/work-positions/all-general` | `appService.GetAllGeneralAsync` | `ReclutamientoLuxuryApp/WorkPositions/EndPoints/WorkPositionEndPoints.cs` |
| POST | `/api/work-positions` | `appService.AddAsync` | `ReclutamientoLuxuryApp/WorkPositions/EndPoints/WorkPositionEndPoints.cs` |
| PUT | `/api/work-positions/{id:guid}` | `appService.UpdateAsync` | `ReclutamientoLuxuryApp/WorkPositions/EndPoints/WorkPositionEndPoints.cs` |
| DELETE | `/api/work-positions/{id:guid}` | `appService.DeleteByIdAsync` | `ReclutamientoLuxuryApp/WorkPositions/EndPoints/WorkPositionEndPoints.cs` |
| GET | `/api/work-positions/hours/{id:guid}` | `appService.GetHoursAsync` | `ReclutamientoLuxuryApp/WorkPositions/EndPoints/WorkPositionEndPoints.cs` |
| GET | `/api/work-positions/assign-employee/{applicationUserId}/{workPositionId:guid}` | `appService.AssignEmployeeAsync` | `ReclutamientoLuxuryApp/WorkPositions/EndPoints/WorkPositionEndPoints.cs` |
| PATCH | `/api/work-positions/{id:guid}/unassign-employee` | `appService.UnassignEmployeeAsync` | `ReclutamientoLuxuryApp/WorkPositions/EndPoints/WorkPositionEndPoints.cs` |
| PATCH | `/api/work-positions/{id:guid}/activate` | `appService.ActivateAsync` | `ReclutamientoLuxuryApp/WorkPositions/EndPoints/WorkPositionEndPoints.cs` |


### Grupo: RecursosHumanosLuxuryApp

#### Modulo: RecursosHumanosLuxuryApp/ChekadorEmpleados/DTOs

- Interfaces: 0 | Servicios: 0 | Endpoints: 0 | DTOs: 1

#### Modulo: RecursosHumanosLuxuryApp/ChekadorEmpleados/EndPoints

- Interfaces: 0 | Servicios: 0 | Endpoints: 8 | DTOs: 0

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| POST | `/api/chekador-empleados/registrar` | `appService.RegistrarAsync` | `RecursosHumanosLuxuryApp/ChekadorEmpleados/EndPoints/ChekadorEmpleadosEndpoints.cs` |
| GET | `/api/chekador-empleados/mis-registros` | `appService.MisRegistrosAsync` | `RecursosHumanosLuxuryApp/ChekadorEmpleados/EndPoints/ChekadorEmpleadosEndpoints.cs` |
| GET | `/api/chekador-empleados/resumen-hoy` | `appService.ResumenHoyAsync` | `RecursosHumanosLuxuryApp/ChekadorEmpleados/EndPoints/ChekadorEmpleadosEndpoints.cs` |
| GET | `/api/chekador-empleados/por-tenant` | `appService.PorTenantAsync` | `RecursosHumanosLuxuryApp/ChekadorEmpleados/EndPoints/ChekadorEmpleadosEndpoints.cs` |
| PATCH | `/api/chekador-empleados/{id:guid}/aprobar-anomalia` | `appService.AprobarAnomaliaAsync` | `RecursosHumanosLuxuryApp/ChekadorEmpleados/EndPoints/ChekadorEmpleadosEndpoints.cs` |
| PATCH | `/api/chekador-empleados/{id:guid}/rechazar-anomalia` | `appService.RechazarAnomaliaAsync` | `RecursosHumanosLuxuryApp/ChekadorEmpleados/EndPoints/ChekadorEmpleadosEndpoints.cs` |
| GET | `/api/chekador-empleados/sedes` | `appService.GetSedesAsync` | `RecursosHumanosLuxuryApp/ChekadorEmpleados/EndPoints/ChekadorEmpleadosEndpoints.cs` |
| POST | `/api/chekador-empleados/sedes` | `appService.CrearSedeAsync` | `RecursosHumanosLuxuryApp/ChekadorEmpleados/EndPoints/ChekadorEmpleadosEndpoints.cs` |

#### Modulo: RecursosHumanosLuxuryApp/ChekadorEmpleados/Entities

- Interfaces: 0 | Servicios: 0 | Endpoints: 0 | DTOs: 0

#### Modulo: RecursosHumanosLuxuryApp/ChekadorEmpleados/Interfaces

- Interfaces: 1 | Servicios: 0 | Endpoints: 0 | DTOs: 0

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IChekadorEmpleadosAppService | 8 | `RecursosHumanosLuxuryApp/ChekadorEmpleados/Interfaces/IChekadorEmpleadosAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| RegistrarAsync | IChekadorEmpleadosAppService | SPECIAL | `Task<ApiResponseDTO<RegistroChecadorDTO>>` | `CrearRegistroChecadorDTO dto, string ipAddress` |
| MisRegistrosAsync | IChekadorEmpleadosAppService | OTHER | `Task<ApiResponseDTO<List<RegistroChecadorDT…` | `int pagina, int tamano` |
| ResumenHoyAsync | IChekadorEmpleadosAppService | OTHER | `Task<ApiResponseDTO<ResumenAsistenciaDTO>>` | `-` |
| PorTenantAsync | IChekadorEmpleadosAppService | OTHER | `Task<ApiResponseDTO<List<RegistroChecadorDT…` | `Guid? empleadoId, DateOnly? desde, DateOnly? hasta, TipoReg…` |
| AprobarAnomaliaAsync | IChekadorEmpleadosAppService | SPECIAL | `Task<ApiResponseDTO<RegistroChecadorDTO>>` | `Guid id, AprobarRechazarAnomaliaDTO dto` |
| RechazarAnomaliaAsync | IChekadorEmpleadosAppService | SPECIAL | `Task<ApiResponseDTO<RegistroChecadorDTO>>` | `Guid id, AprobarRechazarAnomaliaDTO dto` |
| GetSedesAsync | IChekadorEmpleadosAppService | GET_LIST | `Task<ApiResponseDTO<List<SedeChecadorDTO>>>` | `-` |
| CrearSedeAsync | IChekadorEmpleadosAppService | OTHER | `Task<ApiResponseDTO<SedeChecadorDTO>>` | `CrearSedeChecadorDTO dto` |

#### Modulo: RecursosHumanosLuxuryApp/ChekadorEmpleados/Services

- Interfaces: 0 | Servicios: 1 | Endpoints: 0 | DTOs: 0

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| ChekadorEmpleadosAppService | 6 | `RecursosHumanosLuxuryApp/ChekadorEmpleados/Services/ChekadorEmpleadosAppService.cs` |

#### Modulo: RecursosHumanosLuxuryApp/Evaluacion/Entities

- Interfaces: 0 | Servicios: 0 | Endpoints: 0 | DTOs: 0

#### Modulo: RecursosHumanosLuxuryApp/Evaluacion/EvaluationTemplate

- Interfaces: 1 | Servicios: 2 | Endpoints: 5 | DTOs: 5

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| ITemplateEvaluationAppService | 5 | `RecursosHumanosLuxuryApp/Evaluacion/EvaluationTemplate/Interfaces/ITemplateEvaluationAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| EmployeeEvaluationMapper | 0 | `RecursosHumanosLuxuryApp/Evaluacion/EvaluationTemplate/Mapping/EmployeeEvaluationMapper.cs` |
| TemplateEvaluationAppService | 5 | `RecursosHumanosLuxuryApp/Evaluacion/EvaluationTemplate/Services/TemplateEvaluationAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetAllByCustomerIdAsync | ITemplateEvaluationAppService | GET_LIST | `Task<ApiResponseDTO<EvaluationTemplateSumma…` | `Guid customerId` |
| GetForEditByIdAsync | ITemplateEvaluationAppService | GET_SINGLE | `Task<ApiResponseDTO<SaveEvaluationTemplateR…` | `Guid id` |
| CreateAsync | ITemplateEvaluationAppService | CREATE | `Task<ApiResponseDTO<EvaluationTemplateSumma…` | `SaveEvaluationTemplateRequestDTO DTO` |
| UpdateAsync | ITemplateEvaluationAppService | UPDATE | `Task<ApiResponseDTO<EvaluationTemplateSumma…` | `Guid id, SaveEvaluationTemplateRequestDTO DTO` |
| DeleteByIdAsync | ITemplateEvaluationAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/template-evaluation/list/{customerId:guid}` | `templateService.GetAllByCustomerIdAsync` | `RecursosHumanosLuxuryApp/Evaluacion/EvaluationTemplate/EndPoints/TemplateEvaluationEndPoints.cs` |
| GET | `/api/template-evaluation/{id:guid}` | `templateService.GetForEditByIdAsync` | `RecursosHumanosLuxuryApp/Evaluacion/EvaluationTemplate/EndPoints/TemplateEvaluationEndPoints.cs` |
| POST | `/api/template-evaluation` | `templateService.CreateAsync` | `RecursosHumanosLuxuryApp/Evaluacion/EvaluationTemplate/EndPoints/TemplateEvaluationEndPoints.cs` |
| PUT | `/api/template-evaluation/{id:guid}` | `templateService.UpdateAsync` | `RecursosHumanosLuxuryApp/Evaluacion/EvaluationTemplate/EndPoints/TemplateEvaluationEndPoints.cs` |
| DELETE | `/api/template-evaluation/{id:guid}` | `templateService.DeleteByIdAsync` | `RecursosHumanosLuxuryApp/Evaluacion/EvaluationTemplate/EndPoints/TemplateEvaluationEndPoints.cs` |

#### Modulo: RecursosHumanosLuxuryApp/Evaluacion/PerformanceEvaluation

- Interfaces: 1 | Servicios: 2 | Endpoints: 6 | DTOs: 11

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IPerformanceEvaluationAppService | 6 | `RecursosHumanosLuxuryApp/Evaluacion/PerformanceEvaluation/Interfaces/IPerformanceEvaluationAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| PerformanceEvaluationMappingProfile | 0 | `RecursosHumanosLuxuryApp/Evaluacion/PerformanceEvaluation/Mapping/PerformanceEvaluationMappingProfile.cs` |
| PerformanceEvaluationAppService | 6 | `RecursosHumanosLuxuryApp/Evaluacion/PerformanceEvaluation/Services/PerformanceEvaluationAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| CreateAsync | IPerformanceEvaluationAppService | CREATE | `Task<ApiResponseDTO<EvaluationResultDTO>>` | `CreatePerformanceEvaluationDTO DTO` |
| UpdateAsync | IPerformanceEvaluationAppService | UPDATE | `Task<ApiResponseDTO<EvaluationResultDTO>>` | `Guid id, UpdatePerformanceEvaluationDTO DTO` |
| GetResultByIdAsync | IPerformanceEvaluationAppService | GET_SINGLE | `Task<ApiResponseDTO<EvaluationResultDTO>>` | `Guid id` |
| GetHistoryForEmployeeAsync | IPerformanceEvaluationAppService | GET_LIST | `Task<ApiResponseDTO<EvaluationHistoryItemDT…` | `Guid employeeId` |
| DeleteByIdAsync | IPerformanceEvaluationAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetHistoryForClientAsync | IPerformanceEvaluationAppService | GET_LIST | `Task<ApiResponseDTO<EvaluationHistoryForCus…` | `Guid customerId` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| POST | `/api/performance-evaluations/create` | `evaluationService.CreateAsync` | `RecursosHumanosLuxuryApp/Evaluacion/PerformanceEvaluation/EndPoints/PerformanceEvaluationsEndPoints.cs` |
| PUT | `/api/performance-evaluations/update/{id:guid}` | `evaluationService.UpdateAsync` | `RecursosHumanosLuxuryApp/Evaluacion/PerformanceEvaluation/EndPoints/PerformanceEvaluationsEndPoints.cs` |
| GET | `/api/performance-evaluations/{id:guid}/result` | `evaluationService.GetResultByIdAsync` | `RecursosHumanosLuxuryApp/Evaluacion/PerformanceEvaluation/EndPoints/PerformanceEvaluationsEndPoints.cs` |
| GET | `/api/performance-evaluations/employee/{employeeId:guid}/history` | `evaluationService.GetHistoryForEmployeeAsync` | `RecursosHumanosLuxuryApp/Evaluacion/PerformanceEvaluation/EndPoints/PerformanceEvaluationsEndPoints.cs` |
| DELETE | `/api/performance-evaluations/{id:guid}` | `evaluationService.DeleteByIdAsync` | `RecursosHumanosLuxuryApp/Evaluacion/PerformanceEvaluation/EndPoints/PerformanceEvaluationsEndPoints.cs` |
| GET | `/api/performance-evaluations/customer/{customerId:guid}/history` | `evaluationService.GetHistoryForClientAsync` | `RecursosHumanosLuxuryApp/Evaluacion/PerformanceEvaluation/EndPoints/PerformanceEvaluationsEndPoints.cs` |

#### Modulo: RecursosHumanosLuxuryApp/ManualsAndProcesses/DTOs

- Interfaces: 0 | Servicios: 0 | Endpoints: 0 | DTOs: 2

#### Modulo: RecursosHumanosLuxuryApp/ManualsAndProcesses/EndPoints

- Interfaces: 0 | Servicios: 0 | Endpoints: 21 | DTOs: 0

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/manuals` | `service.ObtenerAccesiblesAsync` | `RecursosHumanosLuxuryApp/ManualsAndProcesses/EndPoints/ManualPasosEndPoints.cs` |
| GET | `/api/manuals/{id:guid}` | `service.ObtenerPorIdAsync` | `RecursosHumanosLuxuryApp/ManualsAndProcesses/EndPoints/ManualPasosEndPoints.cs` |
| POST | `/api/manuals` | `service.CrearAsync` | `RecursosHumanosLuxuryApp/ManualsAndProcesses/EndPoints/ManualPasosEndPoints.cs` |
| PUT | `/api/manuals/{id:guid}` | `service.ActualizarAsync` | `RecursosHumanosLuxuryApp/ManualsAndProcesses/EndPoints/ManualPasosEndPoints.cs` |
| DELETE | `/api/manuals/{id:guid}` | `service.EliminarAsync` | `RecursosHumanosLuxuryApp/ManualsAndProcesses/EndPoints/ManualPasosEndPoints.cs` |
| POST | `/api/manuals/{manualId:guid}/pasos` | `service.AgregarPasoAsync` | `RecursosHumanosLuxuryApp/ManualsAndProcesses/EndPoints/ManualPasosEndPoints.cs` |
| PUT | `/api/manuals/{manualId:guid}/pasos/{pasoId:guid}` | `service.ActualizarPasoAsync` | `RecursosHumanosLuxuryApp/ManualsAndProcesses/EndPoints/ManualPasosEndPoints.cs` |
| DELETE | `/api/manuals/{manualId:guid}/pasos/{pasoId:guid}` | `service.EliminarPasoAsync` | `RecursosHumanosLuxuryApp/ManualsAndProcesses/EndPoints/ManualPasosEndPoints.cs` |
| PATCH | `/api/manuals/{manualId:guid}/pasos/reordenar` | `service.ReordenarPasosAsync` | `RecursosHumanosLuxuryApp/ManualsAndProcesses/EndPoints/ManualPasosEndPoints.cs` |
| POST | `/api/manuals/{manualId:guid}/pasos/{pasoId:guid}/imagenes` | `service.SubirImagenPasoAsync` | `RecursosHumanosLuxuryApp/ManualsAndProcesses/EndPoints/ManualPasosEndPoints.cs` |
| DELETE | `/api/manuals/{manualId:guid}/pasos/{pasoId:guid}/imagenes/{imagenId:guid}` | `service.EliminarImagenPasoAsync` | `RecursosHumanosLuxuryApp/ManualsAndProcesses/EndPoints/ManualPasosEndPoints.cs` |
| POST | `/api/manuals/{manualId:guid}/pasos/{pasoId:guid}/enlaces` | `service.AgregarEnlacePasoAsync` | `RecursosHumanosLuxuryApp/ManualsAndProcesses/EndPoints/ManualPasosEndPoints.cs` |
| DELETE | `/api/manuals/{manualId:guid}/pasos/{pasoId:guid}/enlaces/{enlaceId:guid}` | `service.EliminarEnlacePasoAsync` | `RecursosHumanosLuxuryApp/ManualsAndProcesses/EndPoints/ManualPasosEndPoints.cs` |
| POST | `/api/manuals/{manualId:guid}/versiones` | `service.AgregarVersionAsync` | `RecursosHumanosLuxuryApp/ManualsAndProcesses/EndPoints/ManualPasosEndPoints.cs` |
| DELETE | `/api/manuals/{manualId:guid}/versiones/{versionId:guid}` | `service.EliminarVersionAsync` | `RecursosHumanosLuxuryApp/ManualsAndProcesses/EndPoints/ManualPasosEndPoints.cs` |
| POST | `/api/manuals/{manualId:guid}/adjuntos` | `service.AgregarAdjuntoAsync` | `RecursosHumanosLuxuryApp/ManualsAndProcesses/EndPoints/ManualPasosEndPoints.cs` |
| DELETE | `/api/manuals/{manualId:guid}/adjuntos/{adjuntoId:guid}` | `service.EliminarAdjuntoAsync` | `RecursosHumanosLuxuryApp/ManualsAndProcesses/EndPoints/ManualPasosEndPoints.cs` |
| POST | `/api/manuals/{manualId:guid}/pasos/{pasoId:guid}/diagrama` | `service.CrearDiagramaAsync` | `RecursosHumanosLuxuryApp/ManualsAndProcesses/EndPoints/ManualPasosEndPoints.cs` |
| GET | `/api/manuals/diagrama/{diagramaId:guid}` | `service.ObtenerDiagramaAsync` | `RecursosHumanosLuxuryApp/ManualsAndProcesses/EndPoints/ManualPasosEndPoints.cs` |
| PUT | `/api/manuals/diagrama/{diagramaId:guid}` | `service.ActualizarDiagramaAsync` | `RecursosHumanosLuxuryApp/ManualsAndProcesses/EndPoints/ManualPasosEndPoints.cs` |
| DELETE | `/api/manuals/{manualId:guid}/pasos/{pasoId:guid}/diagrama` | `service.EliminarDiagramaAsync` | `RecursosHumanosLuxuryApp/ManualsAndProcesses/EndPoints/ManualPasosEndPoints.cs` |

#### Modulo: RecursosHumanosLuxuryApp/ManualsAndProcesses/Interfaces

- Interfaces: 1 | Servicios: 0 | Endpoints: 0 | DTOs: 0

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IManualTemplateService | 21 | `RecursosHumanosLuxuryApp/ManualsAndProcesses/Interfaces/IManualTemplateService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| ObtenerAccesiblesAsync | IManualTemplateService | GET_LIST | `Task<ApiResponseDTO<ManualTemplateSimpleDTO…` | `-` |
| ObtenerPorIdAsync | IManualTemplateService | GET_SINGLE | `Task<ApiResponseDTO<ManualTemplateDetalleDT…` | `Guid id` |
| CrearAsync | IManualTemplateService | OTHER | `Task<ApiResponseDTO<ManualTemplateSimpleDTO…` | `ManualTemplateAddDTO dto` |
| ActualizarAsync | IManualTemplateService | OTHER | `Task<ApiResponseDTO<ManualTemplateSimpleDTO…` | `Guid id, ManualTemplateEditDTO dto` |
| EliminarAsync | IManualTemplateService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| AgregarPasoAsync | IManualTemplateService | OTHER | `Task<ApiResponseDTO<ManualPasoDTO>>` | `Guid manualId, ManualPasoAddDTO dto` |
| ActualizarPasoAsync | IManualTemplateService | OTHER | `Task<ApiResponseDTO<ManualPasoDTO>>` | `Guid manualId, Guid pasoId, ManualPasoEditDTO dto` |
| EliminarPasoAsync | IManualTemplateService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid manualId, Guid pasoId` |
| ReordenarPasosAsync | IManualTemplateService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid manualId, List<Guid> ordenIds` |
| SubirImagenPasoAsync | IManualTemplateService | SPECIAL | `Task<ApiResponseDTO<ManualPasoImagenDTO>>` | `Guid pasoId, IFormFile imagen` |
| EliminarImagenPasoAsync | IManualTemplateService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid imagenId` |
| AgregarEnlacePasoAsync | IManualTemplateService | OTHER | `Task<ApiResponseDTO<ManualPasoEnlaceDTO>>` | `Guid pasoId, ManualPasoEnlaceAddDTO dto` |
| EliminarEnlacePasoAsync | IManualTemplateService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid enlaceId` |
| AgregarVersionAsync | IManualTemplateService | OTHER | `Task<ApiResponseDTO<ManualVersionSimpleDTO>>` | `Guid manualId, ManualVersionAddDTO dto` |
| EliminarVersionAsync | IManualTemplateService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid versionId` |
| AgregarAdjuntoAsync | IManualTemplateService | OTHER | `Task<ApiResponseDTO<ManualAdjuntoSimpleDTO>>` | `Guid manualId, string nombre, IFormFile archivo` |
| EliminarAdjuntoAsync | IManualTemplateService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid adjuntoId` |
| CrearDiagramaAsync | IManualTemplateService | OTHER | `Task<ApiResponseDTO<ManualDiagramSimpleDTO>>` | `Guid pasoId, string nombre` |
| ObtenerDiagramaAsync | IManualTemplateService | GET_LIST | `Task<ApiResponseDTO<ManualDiagramSimpleDTO>>` | `Guid diagramaId` |
| ActualizarDiagramaAsync | IManualTemplateService | OTHER | `Task<ApiResponseDTO<ManualDiagramSimpleDTO>>` | `Guid diagramaId, ManualDiagramUpdateDTO dto` |
| EliminarDiagramaAsync | IManualTemplateService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid pasoId` |

#### Modulo: RecursosHumanosLuxuryApp/ManualsAndProcesses/Services

- Interfaces: 0 | Servicios: 1 | Endpoints: 0 | DTOs: 0

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| ManualTemplateService | 21 | `RecursosHumanosLuxuryApp/ManualsAndProcesses/Services/ManualTemplateService.cs` |

#### Modulo: RecursosHumanosLuxuryApp/Nomina/Configuracion

- Interfaces: 1 | Servicios: 2 | Endpoints: 2 | DTOs: 2

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IConfiguracionNominaAppService | 2 | `RecursosHumanosLuxuryApp/Nomina/Configuracion/Interfaces/IConfiguracionNominaAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| ConfiguracionNominaMappingProfile | 0 | `RecursosHumanosLuxuryApp/Nomina/Configuracion/Mapping/ConfiguracionNominaMappingProfile.cs` |
| ConfiguracionNominaAppService | 2 | `RecursosHumanosLuxuryApp/Nomina/Configuracion/Services/ConfiguracionNominaAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetByCustomerIdAsync | IConfiguracionNominaAppService | GET_LIST | `Task<ApiResponseDTO<ConfiguracionNominaDTO>>` | `Guid customerId` |
| UpsertAsync | IConfiguracionNominaAppService | UPDATE | `Task<ApiResponseDTO<ConfiguracionNominaDTO>>` | `Guid customerId, ConfiguracionNominaUpdateDTO dto` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/hr/nomina/configuracion/{customerId:guid}` | `configuracionNominaAppService.GetByCustomerIdAsync` | `RecursosHumanosLuxuryApp/Nomina/Configuracion/EndPoints/ConfiguracionNominaEndPoints.cs` |
| PUT | `/api/hr/nomina/configuracion/{customerId:guid}` | `configuracionNominaAppService.UpsertAsync` | `RecursosHumanosLuxuryApp/Nomina/Configuracion/EndPoints/ConfiguracionNominaEndPoints.cs` |

#### Modulo: RecursosHumanosLuxuryApp/Nomina/Entities

- Interfaces: 0 | Servicios: 0 | Endpoints: 0 | DTOs: 0

#### Modulo: RecursosHumanosLuxuryApp/Nomina/Evidencias

- Interfaces: 1 | Servicios: 2 | Endpoints: 3 | DTOs: 2

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IEvidenciaNominaAppService | 3 | `RecursosHumanosLuxuryApp/Nomina/Evidencias/Interfaces/IEvidenciaNominaAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| EvidenciasNominaMappingProfile | 0 | `RecursosHumanosLuxuryApp/Nomina/Evidencias/Mapping/EvidenciasNominaMappingProfile.cs` |
| EvidenciaNominaAppService | 3 | `RecursosHumanosLuxuryApp/Nomina/Evidencias/Services/EvidenciaNominaAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetByNominaAsync | IEvidenciaNominaAppService | GET_LIST | `Task<ApiResponseDTO<EvidenciaNominaDTO[]>>` | `Guid nominaId` |
| AddAsync | IEvidenciaNominaAppService | CREATE | `Task<ApiResponseDTO<EvidenciaNominaDTO>>` | `Guid nominaId, EvidenciaNominaCreateDTO dto` |
| DeleteAsync | IEvidenciaNominaAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/hr/nomina/{nominaId:guid}/evidencias` | `evidenciaNominaAppService.GetByNominaAsync` | `RecursosHumanosLuxuryApp/Nomina/Evidencias/EndPoints/EvidenciasNominaEndPoints.cs` |
| POST | `/api/hr/nomina/{nominaId:guid}/evidencias` | `evidenciaNominaAppService.AddAsync` | `RecursosHumanosLuxuryApp/Nomina/Evidencias/EndPoints/EvidenciasNominaEndPoints.cs` |
| DELETE | `/api/hr/nomina/evidencias/{id:guid}` | `evidenciaNominaAppService.DeleteAsync` | `RecursosHumanosLuxuryApp/Nomina/Evidencias/EndPoints/EvidenciasNominaEndPoints.cs` |

#### Modulo: RecursosHumanosLuxuryApp/Nomina/IncidenciasNomina

- Interfaces: 1 | Servicios: 2 | Endpoints: 9 | DTOs: 3

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IIncidenciaNominaAppService | 9 | `RecursosHumanosLuxuryApp/Nomina/IncidenciasNomina/Interfaces/IIncidenciaNominaAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| IncidenciaNominaMappingProfile | 0 | `RecursosHumanosLuxuryApp/Nomina/IncidenciasNomina/Mapping/IncidenciaNominaMappingProfile.cs` |
| IncidenciaNominaAppService | 9 | `RecursosHumanosLuxuryApp/Nomina/IncidenciasNomina/Services/IncidenciaNominaAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetAllAsync | IIncidenciaNominaAppService | GET_LIST | `Task<ApiResponseDTO<IncidenciaNominaDTO[]>>` | `Guid? periodoNominaId, Guid? employeeId, int? tipoIncidencia` |
| GetByIdAsync | IIncidenciaNominaAppService | GET_SINGLE | `Task<ApiResponseDTO<IncidenciaNominaDTO>>` | `Guid id` |
| CreateAsync | IIncidenciaNominaAppService | CREATE | `Task<ApiResponseDTO<IncidenciaNominaDTO>>` | `IncidenciaNominaCreateDTO dto` |
| UpdateAsync | IIncidenciaNominaAppService | UPDATE | `Task<ApiResponseDTO<IncidenciaNominaDTO>>` | `Guid id, IncidenciaNominaCreateDTO dto` |
| DeleteAsync | IIncidenciaNominaAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| SincronizarVacacionesAsync | IIncidenciaNominaAppService | SPECIAL | `Task<ApiResponseDTO<IncidenciaNominaDTO[]>>` | `SincronizarIncidenciasDTO dto` |
| SincronizarPermisosAsync | IIncidenciaNominaAppService | SPECIAL | `Task<ApiResponseDTO<IncidenciaNominaDTO[]>>` | `SincronizarIncidenciasDTO dto` |
| GetHojaIncidenciasAsync | IIncidenciaNominaAppService | GET_LIST | `Task<ApiResponseDTO<HojaIncidenciasDTO>>` | `Guid periodoNominaId` |
| GuardarHojaIncidenciasAsync | IIncidenciaNominaAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `GuardarHojaIncidenciasDTO dto` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/hr/nomina/incidencias` | `incidenciaNominaAppService.GetAllAsync` | `RecursosHumanosLuxuryApp/Nomina/IncidenciasNomina/EndPoints/IncidenciaNominaEndPoints.cs` |
| GET | `/api/hr/nomina/incidencias/{id:guid}` | `incidenciaNominaAppService.GetByIdAsync` | `RecursosHumanosLuxuryApp/Nomina/IncidenciasNomina/EndPoints/IncidenciaNominaEndPoints.cs` |
| POST | `/api/hr/nomina/incidencias` | `incidenciaNominaAppService.CreateAsync` | `RecursosHumanosLuxuryApp/Nomina/IncidenciasNomina/EndPoints/IncidenciaNominaEndPoints.cs` |
| PUT | `/api/hr/nomina/incidencias/{id:guid}` | `incidenciaNominaAppService.UpdateAsync` | `RecursosHumanosLuxuryApp/Nomina/IncidenciasNomina/EndPoints/IncidenciaNominaEndPoints.cs` |
| DELETE | `/api/hr/nomina/incidencias/{id:guid}` | `incidenciaNominaAppService.DeleteAsync` | `RecursosHumanosLuxuryApp/Nomina/IncidenciasNomina/EndPoints/IncidenciaNominaEndPoints.cs` |
| POST | `/api/hr/nomina/incidencias/sincronizar-vacaciones` | `incidenciaNominaAppService.SincronizarVacacionesAsync` | `RecursosHumanosLuxuryApp/Nomina/IncidenciasNomina/EndPoints/IncidenciaNominaEndPoints.cs` |
| POST | `/api/hr/nomina/incidencias/sincronizar-permisos` | `incidenciaNominaAppService.SincronizarPermisosAsync` | `RecursosHumanosLuxuryApp/Nomina/IncidenciasNomina/EndPoints/IncidenciaNominaEndPoints.cs` |
| GET | `/api/hr/nomina/incidencias/hoja/{periodoNominaId:guid}` | `incidenciaNominaAppService.GetHojaIncidenciasAsync` | `RecursosHumanosLuxuryApp/Nomina/IncidenciasNomina/EndPoints/IncidenciaNominaEndPoints.cs` |
| PUT | `/api/hr/nomina/incidencias/hoja` | `incidenciaNominaAppService.GuardarHojaIncidenciasAsync` | `RecursosHumanosLuxuryApp/Nomina/IncidenciasNomina/EndPoints/IncidenciaNominaEndPoints.cs` |

#### Modulo: RecursosHumanosLuxuryApp/Nomina/NominaDetalles

- Interfaces: 1 | Servicios: 2 | Endpoints: 4 | DTOs: 1

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| INominaDetalleAppService | 4 | `RecursosHumanosLuxuryApp/Nomina/NominaDetalles/Interfaces/INominaDetalleAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| NominaDetalleMappingProfile | 0 | `RecursosHumanosLuxuryApp/Nomina/NominaDetalles/Mapping/NominaDetalleMappingProfile.cs` |
| NominaDetalleAppService | 4 | `RecursosHumanosLuxuryApp/Nomina/NominaDetalles/Services/NominaDetalleAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetByNominaAsync | INominaDetalleAppService | GET_LIST | `Task<ApiResponseDTO<NominaDetalleDTO[]>>` | `Guid nominaId` |
| GetByIdAsync | INominaDetalleAppService | GET_SINGLE | `Task<ApiResponseDTO<NominaDetalleDTO>>` | `Guid nominaId, Guid id` |
| UpdateAsync | INominaDetalleAppService | UPDATE | `Task<ApiResponseDTO<NominaDetalleDTO>>` | `Guid nominaId, Guid id, NominaDetalleEditDTO dto` |
| GenerarReciboPdfAsync | INominaDetalleAppService | SPECIAL | `Task<ApiResponseDTO<byte[]>>` | `Guid nominaId, Guid id` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/hr/nomina/{nominaId:guid}/detalles` | `nominaDetalleAppService.GetByNominaAsync` | `RecursosHumanosLuxuryApp/Nomina/NominaDetalles/EndPoints/NominaDetalleEndPoints.cs` |
| GET | `/api/hr/nomina/{nominaId:guid}/detalles/{id:guid}` | `nominaDetalleAppService.GetByIdAsync` | `RecursosHumanosLuxuryApp/Nomina/NominaDetalles/EndPoints/NominaDetalleEndPoints.cs` |
| PUT | `/api/hr/nomina/{nominaId:guid}/detalles/{id:guid}` | `nominaDetalleAppService.UpdateAsync` | `RecursosHumanosLuxuryApp/Nomina/NominaDetalles/EndPoints/NominaDetalleEndPoints.cs` |
| GET | `/api/hr/nomina/{nominaId:guid}/detalles/{id:guid}/recibo` | `nominaDetalleAppService.GenerarReciboPdfAsync` | `RecursosHumanosLuxuryApp/Nomina/NominaDetalles/EndPoints/NominaDetalleEndPoints.cs` |

#### Modulo: RecursosHumanosLuxuryApp/Nomina/NominaEncabezados

- Interfaces: 1 | Servicios: 2 | Endpoints: 9 | DTOs: 1

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| INominaEncabezadoAppService | 9 | `RecursosHumanosLuxuryApp/Nomina/NominaEncabezados/Interfaces/INominaEncabezadoAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| NominaEncabezadoMappingProfile | 0 | `RecursosHumanosLuxuryApp/Nomina/NominaEncabezados/Mapping/NominaEncabezadoMappingProfile.cs` |
| NominaEncabezadoAppService | 7 | `RecursosHumanosLuxuryApp/Nomina/NominaEncabezados/Services/NominaEncabezadoAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetAllAsync | INominaEncabezadoAppService | GET_LIST | `Task<ApiResponseDTO<NominaEncabezadoDTO[]>>` | `Guid? customerId, Guid? periodoNominaId` |
| GetByIdAsync | INominaEncabezadoAppService | GET_SINGLE | `Task<ApiResponseDTO<NominaEncabezadoDTO>>` | `Guid id` |
| GenerarAsync | INominaEncabezadoAppService | SPECIAL | `Task<ApiResponseDTO<NominaEncabezadoDTO>>` | `GenerarNominaDTO dto` |
| EnviarRevisionAsync | INominaEncabezadoAppService | SPECIAL | `Task<ApiResponseDTO<NominaEncabezadoDTO>>` | `Guid id` |
| AprobarAsync | INominaEncabezadoAppService | SPECIAL | `Task<ApiResponseDTO<NominaEncabezadoDTO>>` | `Guid id` |
| MarcarPagadaAsync | INominaEncabezadoAppService | OTHER | `Task<ApiResponseDTO<NominaEncabezadoDTO>>` | `Guid id` |
| CerrarAsync | INominaEncabezadoAppService | SPECIAL | `Task<ApiResponseDTO<NominaEncabezadoDTO>>` | `Guid id` |
| ExportarExcelAsync | INominaEncabezadoAppService | SPECIAL | `Task<ApiResponseDTO<byte[]>>` | `Guid id` |
| GetResumenAsync | INominaEncabezadoAppService | GET_LIST | `Task<ApiResponseDTO<NominaResumenDTO>>` | `Guid id` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/hr/nomina` | `nominaEncabezadoAppService.GetAllAsync` | `RecursosHumanosLuxuryApp/Nomina/NominaEncabezados/EndPoints/NominaEncabezadoEndPoints.cs` |
| GET | `/api/hr/nomina/{id:guid}` | `nominaEncabezadoAppService.GetByIdAsync` | `RecursosHumanosLuxuryApp/Nomina/NominaEncabezados/EndPoints/NominaEncabezadoEndPoints.cs` |
| POST | `/api/hr/nomina/generar` | `nominaEncabezadoAppService.GenerarAsync` | `RecursosHumanosLuxuryApp/Nomina/NominaEncabezados/EndPoints/NominaEncabezadoEndPoints.cs` |
| PUT | `/api/hr/nomina/{id:guid}/enviar-revision` | `nominaEncabezadoAppService.EnviarRevisionAsync` | `RecursosHumanosLuxuryApp/Nomina/NominaEncabezados/EndPoints/NominaEncabezadoEndPoints.cs` |
| PUT | `/api/hr/nomina/{id:guid}/aprobar` | `nominaEncabezadoAppService.AprobarAsync` | `RecursosHumanosLuxuryApp/Nomina/NominaEncabezados/EndPoints/NominaEncabezadoEndPoints.cs` |
| PUT | `/api/hr/nomina/{id:guid}/marcar-pagada` | `nominaEncabezadoAppService.MarcarPagadaAsync` | `RecursosHumanosLuxuryApp/Nomina/NominaEncabezados/EndPoints/NominaEncabezadoEndPoints.cs` |
| PUT | `/api/hr/nomina/{id:guid}/cerrar` | `nominaEncabezadoAppService.CerrarAsync` | `RecursosHumanosLuxuryApp/Nomina/NominaEncabezados/EndPoints/NominaEncabezadoEndPoints.cs` |
| GET | `/api/hr/nomina/{id:guid}/exportar-excel` | `nominaEncabezadoAppService.ExportarExcelAsync` | `RecursosHumanosLuxuryApp/Nomina/NominaEncabezados/EndPoints/NominaEncabezadoEndPoints.cs` |
| GET | `/api/hr/nomina/{id:guid}/resumen-ejecutivo` | `nominaEncabezadoAppService.GetResumenAsync` | `RecursosHumanosLuxuryApp/Nomina/NominaEncabezados/EndPoints/NominaEncabezadoEndPoints.cs` |

#### Modulo: RecursosHumanosLuxuryApp/Nomina/PeriodosNomina

- Interfaces: 1 | Servicios: 2 | Endpoints: 9 | DTOs: 2

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IPeriodoNominaAppService | 9 | `RecursosHumanosLuxuryApp/Nomina/PeriodosNomina/Interfaces/IPeriodoNominaAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| PeriodoNominaMappingProfile | 0 | `RecursosHumanosLuxuryApp/Nomina/PeriodosNomina/Mapping/PeriodoNominaMappingProfile.cs` |
| PeriodoNominaAppService | 9 | `RecursosHumanosLuxuryApp/Nomina/PeriodosNomina/Services/PeriodoNominaAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetByCustomerAsync | IPeriodoNominaAppService | GET_LIST | `Task<ApiResponseDTO<PeriodoNominaDTO[]>>` | `Guid customerId, int? anio` |
| GetByIdAsync | IPeriodoNominaAppService | GET_SINGLE | `Task<ApiResponseDTO<PeriodoNominaDTO>>` | `Guid id` |
| CreateAsync | IPeriodoNominaAppService | CREATE | `Task<ApiResponseDTO<PeriodoNominaDTO>>` | `PeriodoNominaCreateDTO dto` |
| UpdateAsync | IPeriodoNominaAppService | UPDATE | `Task<ApiResponseDTO<PeriodoNominaDTO>>` | `Guid id, PeriodoNominaUpdateDTO dto` |
| DeleteAsync | IPeriodoNominaAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetDiasNoHabilesAsync | IPeriodoNominaAppService | GET_LIST | `Task<ApiResponseDTO<DiasNoHabilesDTO[]>>` | `Guid periodoNominaId` |
| AddDiaNoHabilAsync | IPeriodoNominaAppService | CREATE | `Task<ApiResponseDTO<DiasNoHabilesDTO>>` | `Guid periodoNominaId, DiasNoHabilesCreateDTO dto` |
| DeleteDiaNoHabilAsync | IPeriodoNominaAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid periodoNominaId, Guid diaNoHabilId` |
| AutoCrearPeriodosAsync | IPeriodoNominaAppService | OTHER | `Task<ApiResponseDTO<int>>` | `Guid customerId` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/hr/nomina/periodos` | `periodoNominaAppService.GetByCustomerAsync` | `RecursosHumanosLuxuryApp/Nomina/PeriodosNomina/EndPoints/PeriodoNominaEndPoints.cs` |
| GET | `/api/hr/nomina/periodos/{id:guid}` | `periodoNominaAppService.GetByIdAsync` | `RecursosHumanosLuxuryApp/Nomina/PeriodosNomina/EndPoints/PeriodoNominaEndPoints.cs` |
| POST | `/api/hr/nomina/periodos` | `periodoNominaAppService.CreateAsync` | `RecursosHumanosLuxuryApp/Nomina/PeriodosNomina/EndPoints/PeriodoNominaEndPoints.cs` |
| PUT | `/api/hr/nomina/periodos/{id:guid}` | `periodoNominaAppService.UpdateAsync` | `RecursosHumanosLuxuryApp/Nomina/PeriodosNomina/EndPoints/PeriodoNominaEndPoints.cs` |
| DELETE | `/api/hr/nomina/periodos/{id:guid}` | `periodoNominaAppService.DeleteAsync` | `RecursosHumanosLuxuryApp/Nomina/PeriodosNomina/EndPoints/PeriodoNominaEndPoints.cs` |
| POST | `/api/hr/nomina/periodos/auto-crear` | `periodoNominaAppService.AutoCrearPeriodosAsync` | `RecursosHumanosLuxuryApp/Nomina/PeriodosNomina/EndPoints/PeriodoNominaEndPoints.cs` |
| GET | `/api/hr/nomina/periodos/{periodoNominaId:guid}/dias-no-habiles` | `periodoNominaAppService.GetDiasNoHabilesAsync` | `RecursosHumanosLuxuryApp/Nomina/PeriodosNomina/EndPoints/PeriodoNominaEndPoints.cs` |
| POST | `/api/hr/nomina/periodos/{periodoNominaId:guid}/dias-no-habiles` | `periodoNominaAppService.AddDiaNoHabilAsync` | `RecursosHumanosLuxuryApp/Nomina/PeriodosNomina/EndPoints/PeriodoNominaEndPoints.cs` |
| DELETE | `/api/hr/nomina/periodos/{periodoNominaId:guid}/dias-no-habiles/{diaNoHabilId:guid}` | `periodoNominaAppService.DeleteDiaNoHabilAsync` | `RecursosHumanosLuxuryApp/Nomina/PeriodosNomina/EndPoints/PeriodoNominaEndPoints.cs` |

#### Modulo: RecursosHumanosLuxuryApp/Nomina/Prestamos

- Interfaces: 1 | Servicios: 2 | Endpoints: 8 | DTOs: 1

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IPrestamoEmpleadoAppService | 8 | `RecursosHumanosLuxuryApp/Nomina/Prestamos/Interfaces/IPrestamoEmpleadoAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| PrestamosMappingProfile | 0 | `RecursosHumanosLuxuryApp/Nomina/Prestamos/Mapping/PrestamosMappingProfile.cs` |
| PrestamoEmpleadoAppService | 8 | `RecursosHumanosLuxuryApp/Nomina/Prestamos/Services/PrestamoEmpleadoAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetAllAsync | IPrestamoEmpleadoAppService | GET_LIST | `Task<ApiResponseDTO<PrestamoEmpleadoDTO[]>>` | `Guid? customerId, Guid? employeeId, int? estado` |
| GetByIdAsync | IPrestamoEmpleadoAppService | GET_SINGLE | `Task<ApiResponseDTO<PrestamoEmpleadoDTO>>` | `Guid id` |
| GetByEmployeeAsync | IPrestamoEmpleadoAppService | GET_LIST | `Task<ApiResponseDTO<PrestamoEmpleadoDTO[]>>` | `Guid employeeId` |
| CreateAsync | IPrestamoEmpleadoAppService | CREATE | `Task<ApiResponseDTO<PrestamoEmpleadoDTO>>` | `PrestamoEmpleadoCreateDTO dto` |
| AutorizarAsync | IPrestamoEmpleadoAppService | SPECIAL | `Task<ApiResponseDTO<PrestamoEmpleadoDTO>>` | `Guid id, PrestamoEmpleadoDecisionDTO dto` |
| CancelarAsync | IPrestamoEmpleadoAppService | SPECIAL | `Task<ApiResponseDTO<PrestamoEmpleadoDTO>>` | `Guid id, PrestamoEmpleadoDecisionDTO dto` |
| DeleteAsync | IPrestamoEmpleadoAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetHistorialPagosAsync | IPrestamoEmpleadoAppService | GET_LIST | `Task<ApiResponseDTO<PagoPrestamoDTO[]>>` | `Guid id` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/hr/nomina/prestamos` | `prestamoEmpleadoAppService.GetAllAsync` | `RecursosHumanosLuxuryApp/Nomina/Prestamos/EndPoints/PrestamosEndPoints.cs` |
| GET | `/api/hr/nomina/prestamos/{id:guid}` | `prestamoEmpleadoAppService.GetByIdAsync` | `RecursosHumanosLuxuryApp/Nomina/Prestamos/EndPoints/PrestamosEndPoints.cs` |
| GET | `/api/hr/nomina/prestamos/por-empleado/{employeeId:guid}` | `prestamoEmpleadoAppService.GetByEmployeeAsync` | `RecursosHumanosLuxuryApp/Nomina/Prestamos/EndPoints/PrestamosEndPoints.cs` |
| POST | `/api/hr/nomina/prestamos` | `prestamoEmpleadoAppService.CreateAsync` | `RecursosHumanosLuxuryApp/Nomina/Prestamos/EndPoints/PrestamosEndPoints.cs` |
| PUT | `/api/hr/nomina/prestamos/{id:guid}/autorizar` | `prestamoEmpleadoAppService.AutorizarAsync` | `RecursosHumanosLuxuryApp/Nomina/Prestamos/EndPoints/PrestamosEndPoints.cs` |
| PUT | `/api/hr/nomina/prestamos/{id:guid}/cancelar` | `prestamoEmpleadoAppService.CancelarAsync` | `RecursosHumanosLuxuryApp/Nomina/Prestamos/EndPoints/PrestamosEndPoints.cs` |
| DELETE | `/api/hr/nomina/prestamos/{id:guid}` | `prestamoEmpleadoAppService.DeleteAsync` | `RecursosHumanosLuxuryApp/Nomina/Prestamos/EndPoints/PrestamosEndPoints.cs` |
| GET | `/api/hr/nomina/prestamos/{id:guid}/historial-pagos` | `prestamoEmpleadoAppService.GetHistorialPagosAsync` | `RecursosHumanosLuxuryApp/Nomina/Prestamos/EndPoints/PrestamosEndPoints.cs` |

#### Modulo: RecursosHumanosLuxuryApp/Nomina/Shared

- Interfaces: 0 | Servicios: 5 | Endpoints: 0 | DTOs: 0

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| ImssCalculatorService | 1 | `RecursosHumanosLuxuryApp/Nomina/Shared/ImssCalculatorService.cs` |
| IsrCalculatorService | 1 | `RecursosHumanosLuxuryApp/Nomina/Shared/IsrCalculatorService.cs` |
| NominaCalculatorService | 1 | `RecursosHumanosLuxuryApp/Nomina/Shared/NominaCalculatorService.cs` |
| NominaDraftRecalculationService | 2 | `RecursosHumanosLuxuryApp/Nomina/Shared/NominaDraftRecalculationService.cs` |
| PeriodoNominaHelperService | 1 | `RecursosHumanosLuxuryApp/Nomina/Shared/PeriodoNominaHelperService.cs` |

#### Modulo: RecursosHumanosLuxuryApp/Nomina/TiemposExtra

- Interfaces: 1 | Servicios: 2 | Endpoints: 8 | DTOs: 1

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| ITiempoExtraAppService | 8 | `RecursosHumanosLuxuryApp/Nomina/TiemposExtra/Interfaces/ITiempoExtraAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| TiempoExtraMappingProfile | 0 | `RecursosHumanosLuxuryApp/Nomina/TiemposExtra/Mapping/TiempoExtraMappingProfile.cs` |
| TiempoExtraAppService | 8 | `RecursosHumanosLuxuryApp/Nomina/TiemposExtra/Services/TiempoExtraAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetAllAsync | ITiempoExtraAppService | GET_LIST | `Task<ApiResponseDTO<TiempoExtraDTO[]>>` | `Guid? periodoNominaId, Guid? employeeId, bool? aprobado` |
| GetByIdAsync | ITiempoExtraAppService | GET_SINGLE | `Task<ApiResponseDTO<TiempoExtraDTO>>` | `Guid id` |
| CreateAsync | ITiempoExtraAppService | CREATE | `Task<ApiResponseDTO<TiempoExtraDTO>>` | `TiempoExtraCreateDTO dto` |
| UpdateAsync | ITiempoExtraAppService | UPDATE | `Task<ApiResponseDTO<TiempoExtraDTO>>` | `Guid id, TiempoExtraUpdateDTO dto` |
| AprobarAsync | ITiempoExtraAppService | SPECIAL | `Task<ApiResponseDTO<TiempoExtraDTO>>` | `Guid id` |
| RechazarAsync | ITiempoExtraAppService | SPECIAL | `Task<ApiResponseDTO<TiempoExtraDTO>>` | `Guid id, TiempoExtraDecisionDTO dto` |
| DeleteAsync | ITiempoExtraAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| AddEvidenceAsync | ITiempoExtraAppService | CREATE | `Task<ApiResponseDTO<EvidenciaNominaDTO>>` | `Guid id, EvidenciaNominaCreateDTO dto` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/hr/nomina/tiempo-extra` | `tiempoExtraAppService.GetAllAsync` | `RecursosHumanosLuxuryApp/Nomina/TiemposExtra/EndPoints/TiempoExtraEndpoints.cs` |
| GET | `/api/hr/nomina/tiempo-extra/{id:guid}` | `tiempoExtraAppService.GetByIdAsync` | `RecursosHumanosLuxuryApp/Nomina/TiemposExtra/EndPoints/TiempoExtraEndpoints.cs` |
| POST | `/api/hr/nomina/tiempo-extra` | `tiempoExtraAppService.CreateAsync` | `RecursosHumanosLuxuryApp/Nomina/TiemposExtra/EndPoints/TiempoExtraEndpoints.cs` |
| PUT | `/api/hr/nomina/tiempo-extra/{id:guid}` | `tiempoExtraAppService.UpdateAsync` | `RecursosHumanosLuxuryApp/Nomina/TiemposExtra/EndPoints/TiempoExtraEndpoints.cs` |
| PUT | `/api/hr/nomina/tiempo-extra/{id:guid}/aprobar` | `tiempoExtraAppService.AprobarAsync` | `RecursosHumanosLuxuryApp/Nomina/TiemposExtra/EndPoints/TiempoExtraEndpoints.cs` |
| PUT | `/api/hr/nomina/tiempo-extra/{id:guid}/rechazar` | `tiempoExtraAppService.RechazarAsync` | `RecursosHumanosLuxuryApp/Nomina/TiemposExtra/EndPoints/TiempoExtraEndpoints.cs` |
| DELETE | `/api/hr/nomina/tiempo-extra/{id:guid}` | `tiempoExtraAppService.DeleteAsync` | `RecursosHumanosLuxuryApp/Nomina/TiemposExtra/EndPoints/TiempoExtraEndpoints.cs` |
| POST | `/api/hr/nomina/tiempo-extra/{id:guid}/evidencias` | `tiempoExtraAppService.AddEvidenceAsync` | `RecursosHumanosLuxuryApp/Nomina/TiemposExtra/EndPoints/TiempoExtraEndpoints.cs` |

#### Modulo: RecursosHumanosLuxuryApp/Notifications/DTOs

- Interfaces: 0 | Servicios: 0 | Endpoints: 0 | DTOs: 1

#### Modulo: RecursosHumanosLuxuryApp/Notifications/Interfaces

- Interfaces: 1 | Servicios: 0 | Endpoints: 0 | DTOs: 0

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IHrNotificationCoordinatorService | 6 | `RecursosHumanosLuxuryApp/Notifications/Interfaces/IHrNotificationCoordinatorService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| SendNewRequestNotificationToApproversAsync | IHrNotificationCoordinatorService | SPECIAL | `Task` | `NotificationRequestDataDTO data` |
| SendRequestApprovedNotificationToEmployeeAsync | IHrNotificationCoordinatorService | SPECIAL | `Task` | `NotificationRequestDataDTO data` |
| SendRequestRejectedNotificationToEmployeeAsync | IHrNotificationCoordinatorService | SPECIAL | `Task` | `NotificationRequestDataDTO data` |
| SendRequestCreatedNotificationToEmployeeAsync | IHrNotificationCoordinatorService | SPECIAL | `Task` | `NotificationRequestDataDTO data` |
| SendRequestUpdatedNotificationToEmployeeAsync | IHrNotificationCoordinatorService | SPECIAL | `Task` | `NotificationRequestDataDTO data` |
| SendRequestDeletedNotificationToEmployeeAsync | IHrNotificationCoordinatorService | SPECIAL | `Task` | `NotificationRequestDataDTO data, string deletedBy` |

#### Modulo: RecursosHumanosLuxuryApp/Notifications/Services

- Interfaces: 0 | Servicios: 1 | Endpoints: 0 | DTOs: 0

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| HrNotificationCoordinatorService | 6 | `RecursosHumanosLuxuryApp/Notifications/Services/HrNotificationCoordinatorService.cs` |

#### Modulo: Persistence

- Interfaces: 0 | Servicios: 0 | Endpoints: 0 | DTOs: 0

#### Modulo: RecursosHumanosLuxuryApp/TimeOff/ApprovalRules

- Interfaces: 1 | Servicios: 1 | Endpoints: 0 | DTOs: 0

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IApprovalRuleService | 2 | `RecursosHumanosLuxuryApp/TimeOff/ApprovalRules/Interfaces/IApprovalRuleService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| ApprovalRuleService | 2 | `RecursosHumanosLuxuryApp/TimeOff/ApprovalRules/Services/ApprovalRuleService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetApprovableUserIdsAsync | IApprovalRuleService | GET_LIST | `Task<List<string>>` | `-` |
| GetApproverRolesForRequesterAsync | IApprovalRuleService | GET_LIST | `Task<List<string>>` | `string requesterRole` |

#### Modulo: RecursosHumanosLuxuryApp/TimeOff/Entities

- Interfaces: 0 | Servicios: 0 | Endpoints: 0 | DTOs: 0

#### Modulo: RecursosHumanosLuxuryApp/TimeOff/LeaveRequestApproval

- Interfaces: 1 | Servicios: 2 | Endpoints: 8 | DTOs: 0

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IAprobacionPermisoService | 9 | `RecursosHumanosLuxuryApp/TimeOff/LeaveRequestApproval/Interfaces/IAprobacionPermisoService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| LeaveRequestApprovalMappingProfile | 0 | `RecursosHumanosLuxuryApp/TimeOff/LeaveRequestApproval/Mapping/LeaveRequestApprovalMappingProfile.cs` |
| AprobacionPermisoService | 9 | `RecursosHumanosLuxuryApp/TimeOff/LeaveRequestApproval/Services/AprobacionPermisoService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetAllAsync | IAprobacionPermisoService | GET_LIST | `Task<ApiResponseDTO<LeaveRequestDTO[]>>` | `LeaveRequestFilterDTO filter = null` |
| GetHistoryAsync | IAprobacionPermisoService | GET_LIST | `Task<ApiResponseDTO<LeaveRequestDTO[]>>` | `LeaveRequestFilterDTO filter = null` |
| ApproveAsync | IAprobacionPermisoService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid id, LeaveRequestApproveDTO DTO` |
| RejectAsync | IAprobacionPermisoService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid id, LeaveRequestApproveDTO DTO` |
| GetDetailByIdAsync | IAprobacionPermisoService | GET_SINGLE | `Task<ApiResponseDTO<LeaveRequestDetailDTO>>` | `Guid id` |
| DeleteAsync | IAprobacionPermisoService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetHistorySummaryAsync | IAprobacionPermisoService | GET_LIST | `Task<ApiResponseDTO<object>>` | `Guid employeeId` |
| GetOverlappingRequestsAsync | IAprobacionPermisoService | GET_LIST | `Task<ApiResponseDTO<object>>` | `Guid customerId, DateOnly startDate, DateOnly endDate, Guid…` |
| CancelAsync | IAprobacionPermisoService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid id, LeaveRequestApproveDTO DTO` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/leave-request-approvals` | `aprobacionPermisoService.GetAllAsync` | `RecursosHumanosLuxuryApp/TimeOff/LeaveRequestApproval/EndPoints/LeaveRequestApprovalEndPoints.cs` |
| GET | `/api/leave-request-approvals/history` | `aprobacionPermisoService.GetHistoryAsync` | `RecursosHumanosLuxuryApp/TimeOff/LeaveRequestApproval/EndPoints/LeaveRequestApprovalEndPoints.cs` |
| GET | `/api/leave-request-approvals/{id:guid}/detail` | `aprobacionPermisoService.GetDetailByIdAsync` | `RecursosHumanosLuxuryApp/TimeOff/LeaveRequestApproval/EndPoints/LeaveRequestApprovalEndPoints.cs` |
| PUT | `/api/leave-request-approvals/{id:guid}/approve` | `aprobacionPermisoService.ApproveAsync` | `RecursosHumanosLuxuryApp/TimeOff/LeaveRequestApproval/EndPoints/LeaveRequestApprovalEndPoints.cs` |
| PUT | `/api/leave-request-approvals/{id:guid}/reject` | `aprobacionPermisoService.RejectAsync` | `RecursosHumanosLuxuryApp/TimeOff/LeaveRequestApproval/EndPoints/LeaveRequestApprovalEndPoints.cs` |
| PUT | `/api/leave-request-approvals/{id:guid}/cancel` | `aprobacionPermisoService.CancelAsync` | `RecursosHumanosLuxuryApp/TimeOff/LeaveRequestApproval/EndPoints/LeaveRequestApprovalEndPoints.cs` |
| GET | `/api/leave-request-approvals/{employeeId:guid}/history-summary` | `aprobacionPermisoService.GetHistorySummaryAsync` | `RecursosHumanosLuxuryApp/TimeOff/LeaveRequestApproval/EndPoints/LeaveRequestApprovalEndPoints.cs` |
| GET | `/api/leave-request-approvals/overlapping-requests` | `aprobacionPermisoService.GetOverlappingRequestsAsync` | `RecursosHumanosLuxuryApp/TimeOff/LeaveRequestApproval/EndPoints/LeaveRequestApprovalEndPoints.cs` |

#### Modulo: RecursosHumanosLuxuryApp/TimeOff/LeaveRequests

- Interfaces: 2 | Servicios: 3 | Endpoints: 6 | DTOs: 6

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| ILeaveRequestEmailGenerator | 6 | `RecursosHumanosLuxuryApp/TimeOff/LeaveRequests/Interfaces/ILeaveRequestEmailGenerator.cs` |
| ILeaveRequestService | 6 | `RecursosHumanosLuxuryApp/TimeOff/LeaveRequests/Interfaces/ILeaveRequestService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| LeaveRequestMapping | 0 | `RecursosHumanosLuxuryApp/TimeOff/LeaveRequests/Mapping/LeaveRequestMapping.cs` |
| LeaveRequestEmailGenerator | 6 | `RecursosHumanosLuxuryApp/TimeOff/LeaveRequests/Services/LeaveRequestEmailGenerator.cs` |
| LeaveRequestService | 6 | `RecursosHumanosLuxuryApp/TimeOff/LeaveRequests/Services/LeaveRequestService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GenerateLeaveRequestApprovedEmail | ILeaveRequestEmailGenerator | SPECIAL | `string` | `LeaveRequest request` |
| GenerateLeaveRequestRejectedEmail | ILeaveRequestEmailGenerator | SPECIAL | `string` | `LeaveRequest request, string rejectionReason` |
| GenerateLeaveRequestDeletedEmail | ILeaveRequestEmailGenerator | SPECIAL | `string` | `LeaveRequest request` |
| GenerateLeaveRequestUpdatedEmail | ILeaveRequestEmailGenerator | SPECIAL | `string` | `LeaveRequest request` |
| GenerateLeaveRequestApproverNotificationEmail | ILeaveRequestEmailGenerator | SPECIAL | `string` | `LeaveRequest request, string approverName` |
| GenerateLeaveRequestCreatedEmail | ILeaveRequestEmailGenerator | SPECIAL | `string` | `LeaveRequest request` |
| CreateAsync | ILeaveRequestService | CREATE | `Task<ApiResponseDTO<LeaveRequestAddOrEditDT…` | `LeaveRequestAddOrEditDTO DTO` |
| GetMyRequestsAsync | ILeaveRequestService | GET_LIST | `Task<ApiResponseDTO<LeaveRequestMyDTO[]>>` | `-` |
| UpdateAsync | ILeaveRequestService | UPDATE | `Task<ApiResponseDTO<LeaveRequestDTO>>` | `Guid id, LeaveRequestAddOrEditDTO DTO` |
| DeleteAsync | ILeaveRequestService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetByIdAsync | ILeaveRequestService | GET_SINGLE | `Task<ApiResponseDTO<LeaveRequestAddOrEditDT…` | `Guid id` |
| GetDetailByIdAsync | ILeaveRequestService | GET_SINGLE | `Task<ApiResponseDTO<LeaveRequestDetailDTO>>` | `Guid id` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/my-leave-requests` | `leaveRequestService.GetMyRequestsAsync` | `RecursosHumanosLuxuryApp/TimeOff/LeaveRequests/EndPoints/MyLeaveRequestsEndpoints.cs` |
| POST | `/api/my-leave-requests` | `leaveRequestService.CreateAsync` | `RecursosHumanosLuxuryApp/TimeOff/LeaveRequests/EndPoints/MyLeaveRequestsEndpoints.cs` |
| GET | `/api/my-leave-requests/{id:guid}/detail` | `leaveRequestService.GetDetailByIdAsync` | `RecursosHumanosLuxuryApp/TimeOff/LeaveRequests/EndPoints/MyLeaveRequestsEndpoints.cs` |
| GET | `/api/my-leave-requests/{id:guid}` | `leaveRequestService.GetByIdAsync` | `RecursosHumanosLuxuryApp/TimeOff/LeaveRequests/EndPoints/MyLeaveRequestsEndpoints.cs` |
| PUT | `/api/my-leave-requests/{id:guid}` | `leaveRequestService.UpdateAsync` | `RecursosHumanosLuxuryApp/TimeOff/LeaveRequests/EndPoints/MyLeaveRequestsEndpoints.cs` |
| DELETE | `/api/my-leave-requests/{id:guid}` | `leaveRequestService.DeleteAsync` | `RecursosHumanosLuxuryApp/TimeOff/LeaveRequests/EndPoints/MyLeaveRequestsEndpoints.cs` |

#### Modulo: RecursosHumanosLuxuryApp/TimeOff/Vacations

- Interfaces: 5 | Servicios: 12 | Endpoints: 20 | DTOs: 11

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| ISolicitudVacacionesService | 9 | `RecursosHumanosLuxuryApp/TimeOff/Vacations/MyVacationRequests/Interfaces/ISolicitudVacacionesService.cs` |
| IPastVacationsAppService | 1 | `RecursosHumanosLuxuryApp/TimeOff/Vacations/PastVacations/Interfaces/IPastVacationsAppService.cs` |
| IVacationBalanceAdminService | 1 | `RecursosHumanosLuxuryApp/TimeOff/Vacations/VacationBalanceAdmin/Interfaces/IVacationBalanceAdminService.cs` |
| IAprobacionVacacionesService | 12 | `RecursosHumanosLuxuryApp/TimeOff/Vacations/VacationRequestApproval/Interfaces/IAprobacionVacacionesService.cs` |
| IVacationEmailGenerator | 6 | `RecursosHumanosLuxuryApp/TimeOff/Vacations/VacationShared/Interfaces/IVacationEmailGenerator.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| MyVacationRequestsMappingProfile | 0 | `RecursosHumanosLuxuryApp/TimeOff/Vacations/MyVacationRequests/Mappings/MyVacationRequestsMappingProfile.cs` |
| SolicitudVacacionesService | 9 | `RecursosHumanosLuxuryApp/TimeOff/Vacations/MyVacationRequests/Services/SolicitudVacacionesService.cs` |
| PastVacationsMappingProfile | 0 | `RecursosHumanosLuxuryApp/TimeOff/Vacations/PastVacations/Mappings/PastVacationsMappingProfile.cs` |
| PastVacationsAppService | 0 | `RecursosHumanosLuxuryApp/TimeOff/Vacations/PastVacations/Services/PastVacationsAppService.cs` |
| VacationBalanceAdminMappingProfile | 0 | `RecursosHumanosLuxuryApp/TimeOff/Vacations/VacationBalanceAdmin/Mappings/VacationBalanceAdminMappingProfile.cs` |
| VacationBalanceAdminService | 1 | `RecursosHumanosLuxuryApp/TimeOff/Vacations/VacationBalanceAdmin/Services/VacationBalanceAdminService.cs` |
| VacationRequestApprovalMappingProfile | 0 | `RecursosHumanosLuxuryApp/TimeOff/Vacations/VacationRequestApproval/Mappings/VacationRequestApprovalMappingProfile.cs` |
| AprobacionVacacionesService | 12 | `RecursosHumanosLuxuryApp/TimeOff/Vacations/VacationRequestApproval/Services/AprobacionVacacionesService.cs` |
| VacacionesProfile | 0 | `RecursosHumanosLuxuryApp/TimeOff/Vacations/VacationShared/Mappings/VacacionesProfile.cs` |
| VacationBalanceMapping | 0 | `RecursosHumanosLuxuryApp/TimeOff/Vacations/VacationShared/Mappings/VacationBalanceMapping.cs` |
| VacationEmailGenerator | 6 | `RecursosHumanosLuxuryApp/TimeOff/Vacations/VacationShared/Services/VacationEmailGenerator.cs` |
| VacationHelperService | 6 | `RecursosHumanosLuxuryApp/TimeOff/Vacations/VacationShared/Services/VacationHelperService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| CreateAsync | ISolicitudVacacionesService | CREATE | `Task<ApiResponseDTO<VacationRequestDTO>>` | `VacationRequestAddOrEditDTO DTO` |
| UpdateAsync | ISolicitudVacacionesService | UPDATE | `Task<ApiResponseDTO<VacationRequestDTO>>` | `Guid id, VacationRequestAddOrEditDTO DTO` |
| DeleteAsync | ISolicitudVacacionesService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetCalendarEventsAsync | ISolicitudVacacionesService | GET_LIST | `Task<ApiResponseDTO<IEnumerable<CalendarEve…` | `int year, Guid customerId, int? month` |
| GetMyRequestsAsync | ISolicitudVacacionesService | GET_LIST | `Task<ApiResponseDTO<VacationRequestMyDTO[]>>` | `-` |
| GetByIdAsync | ISolicitudVacacionesService | GET_SINGLE | `Task<ApiResponseDTO<VacationRequestDTO>>` | `Guid id` |
| GetDetailByIdAsync | ISolicitudVacacionesService | GET_SINGLE | `Task<ApiResponseDTO<VacationRequestDetailDT…` | `Guid id` |
| GetMyVacationBalanceAsync | ISolicitudVacacionesService | GET_LIST | `Task<ApiResponseDTO<VacationBalanceDTO>>` | `Guid? excludeRequestId = null, int? year = null` |
| GetAvailableVacationYearsAsync | ISolicitudVacacionesService | GET_LIST | `Task<ApiResponseDTO<List<YearOptionDTO>>>` | `-` |
| RegisterPastVacationAsync | IPastVacationsAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `RegisterPastVacationDTO dto, string approverId` |
| GetVacationBalancesForCustomerAsync | IVacationBalanceAdminService | GET_LIST | `Task<ApiResponseDTO<IEnumerable<VacationBal…` | `Guid customerId` |
| ApproveAsync | IAprobacionVacacionesService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid id, VacationApproveDTO DTO` |
| RejectAsync | IAprobacionVacacionesService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid id, VacationApproveDTO DTO` |
| DeleteAsync | IAprobacionVacacionesService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetAllAsync | IAprobacionVacacionesService | GET_LIST | `Task<ApiResponseDTO<VacationRequestDTO[]>>` | `VacationRequestFilterDTO filter` |
| GetHistoryAsync | IAprobacionVacacionesService | GET_LIST | `Task<ApiResponseDTO<VacationHistoryItemDTO[…` | `VacationRequestFilterDTO filter` |
| GetBalanceAsync | IAprobacionVacacionesService | GET_LIST | `Task<ApiResponseDTO<VacationBalanceDTO>>` | `Guid employeeId` |
| GetBalanceByYearAsync | IAprobacionVacacionesService | GET_LIST | `Task<ApiResponseDTO<VacationBalanceDTO>>` | `Guid employeeId, int? year` |
| GetAvailableYearsForEmployeeAsync | IAprobacionVacacionesService | GET_LIST | `Task<ApiResponseDTO<List<YearOptionDTO>>>` | `Guid employeeId` |
| GetAllBalancesForEmployeeAsync | IAprobacionVacacionesService | GET_LIST | `Task<ApiResponseDTO<IEnumerable<VacationBal…` | `Guid employeeId` |
| DeleteBalanceAsync | IAprobacionVacacionesService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid balanceId` |
| GetOverlappingRequestsAsync | IAprobacionVacacionesService | GET_LIST | `Task<ApiResponseDTO<object>>` | `Guid customerId, DateOnly startDate, DateOnly endDate, Guid…` |
| CancelAsync | IAprobacionVacacionesService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid id, VacationApproveDTO DTO` |
| GenerateVacationApprovedEmail | IVacationEmailGenerator | SPECIAL | `string` | `VacationRequest request` |
| GenerateVacationRejectedEmail | IVacationEmailGenerator | SPECIAL | `string` | `VacationRequest request, string rejectionReason` |
| GenerateVacationDeletedEmail | IVacationEmailGenerator | SPECIAL | `string` | `VacationRequest request` |
| GenerateVacationCreatedEmail | IVacationEmailGenerator | SPECIAL | `string` | `VacationRequest request` |
| GenerateVacationUpdatedEmail | IVacationEmailGenerator | SPECIAL | `string` | `VacationRequest request` |
| GenerateVacationApproverNotificationEmail | IVacationEmailGenerator | SPECIAL | `string` | `VacationRequest request, string approverName` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/hr/vacations/my-requests/my-balance` | `solicitudVacacionesService.GetMyVacationBalanceAsync` | `RecursosHumanosLuxuryApp/TimeOff/Vacations/MyVacationRequests/Endpoints/MyVacationRequestsEndpoints.cs` |
| GET | `/api/hr/vacations/my-requests/available-years` | `solicitudVacacionesService.GetAvailableVacationYearsAsync` | `RecursosHumanosLuxuryApp/TimeOff/Vacations/MyVacationRequests/Endpoints/MyVacationRequestsEndpoints.cs` |
| POST | `/api/hr/vacations/my-requests` | `solicitudVacacionesService.CreateAsync` | `RecursosHumanosLuxuryApp/TimeOff/Vacations/MyVacationRequests/Endpoints/MyVacationRequestsEndpoints.cs` |
| GET | `/api/hr/vacations/my-requests` | `solicitudVacacionesService.GetMyRequestsAsync` | `RecursosHumanosLuxuryApp/TimeOff/Vacations/MyVacationRequests/Endpoints/MyVacationRequestsEndpoints.cs` |
| GET | `/api/hr/vacations/my-requests/{id:guid}/detail` | `solicitudVacacionesService.GetDetailByIdAsync` | `RecursosHumanosLuxuryApp/TimeOff/Vacations/MyVacationRequests/Endpoints/MyVacationRequestsEndpoints.cs` |
| GET | `/api/hr/vacations/my-requests/{id:guid}` | `solicitudVacacionesService.GetByIdAsync` | `RecursosHumanosLuxuryApp/TimeOff/Vacations/MyVacationRequests/Endpoints/MyVacationRequestsEndpoints.cs` |
| PUT | `/api/hr/vacations/my-requests/{id:guid}` | `solicitudVacacionesService.UpdateAsync` | `RecursosHumanosLuxuryApp/TimeOff/Vacations/MyVacationRequests/Endpoints/MyVacationRequestsEndpoints.cs` |
| DELETE | `/api/hr/vacations/my-requests/{id:guid}` | `solicitudVacacionesService.DeleteAsync` | `RecursosHumanosLuxuryApp/TimeOff/Vacations/MyVacationRequests/Endpoints/MyVacationRequestsEndpoints.cs` |
| POST | `/api/hr/vacations/past-requests` | `appService.RegisterPastVacationAsync` | `RecursosHumanosLuxuryApp/TimeOff/Vacations/PastVacations/EndPoints/PastVacationsEndPoints.cs` |
| GET | `/api/hr/vacations/balances/customer/{customerId:guid}` | `vacationBalanceAdminService.GetVacationBalancesForCustomerAsync` | `RecursosHumanosLuxuryApp/TimeOff/Vacations/VacationBalanceAdmin/Endpoints/VacationBalanceAdminEndpoints.cs` |
| GET | `/api/hr/vacations/approvals` | `aprobacionVacacionesService.GetAllAsync` | `RecursosHumanosLuxuryApp/TimeOff/Vacations/VacationRequestApproval/EndPoints/VacationRequestApprovalEndPoints.cs` |
| GET | `/api/hr/vacations/approvals/history` | `aprobacionVacacionesService.GetHistoryAsync` | `RecursosHumanosLuxuryApp/TimeOff/Vacations/VacationRequestApproval/EndPoints/VacationRequestApprovalEndPoints.cs` |
| PUT | `/api/hr/vacations/approvals/{id:guid}/approve` | `aprobacionVacacionesService.ApproveAsync` | `RecursosHumanosLuxuryApp/TimeOff/Vacations/VacationRequestApproval/EndPoints/VacationRequestApprovalEndPoints.cs` |
| PUT | `/api/hr/vacations/approvals/{id:guid}/reject` | `aprobacionVacacionesService.RejectAsync` | `RecursosHumanosLuxuryApp/TimeOff/Vacations/VacationRequestApproval/EndPoints/VacationRequestApprovalEndPoints.cs` |
| PUT | `/api/hr/vacations/approvals/{id:guid}/cancel` | `aprobacionVacacionesService.CancelAsync` | `RecursosHumanosLuxuryApp/TimeOff/Vacations/VacationRequestApproval/EndPoints/VacationRequestApprovalEndPoints.cs` |
| GET | `/api/hr/vacations/approvals/calendar-events/{year:int}/{customerId:guid}` | `solicitudVacacionesService.GetCalendarEventsAsync` | `RecursosHumanosLuxuryApp/TimeOff/Vacations/VacationRequestApproval/EndPoints/VacationRequestApprovalEndPoints.cs` |
| GET | `/api/hr/vacations/approvals/{employeeId:guid}/balance` | `aprobacionVacacionesService.GetBalanceAsync` | `RecursosHumanosLuxuryApp/TimeOff/Vacations/VacationRequestApproval/EndPoints/VacationRequestApprovalEndPoints.cs` |
| GET | `/api/hr/vacations/approvals/{employeeId:guid}/balance-by-year` | `aprobacionVacacionesService.GetBalanceByYearAsync` | `RecursosHumanosLuxuryApp/TimeOff/Vacations/VacationRequestApproval/EndPoints/VacationRequestApprovalEndPoints.cs` |
| GET | `/api/hr/vacations/approvals/{employeeId:guid}/available-years` | `aprobacionVacacionesService.GetAvailableYearsForEmployeeAsync` | `RecursosHumanosLuxuryApp/TimeOff/Vacations/VacationRequestApproval/EndPoints/VacationRequestApprovalEndPoints.cs` |
| GET | `/api/hr/vacations/approvals/overlapping-requests` | `aprobacionVacacionesService.GetOverlappingRequestsAsync` | `RecursosHumanosLuxuryApp/TimeOff/Vacations/VacationRequestApproval/EndPoints/VacationRequestApprovalEndPoints.cs` |


### Grupo: SharedLuxuryApp

#### Modulo: CatalogosGenerales

- Interfaces: 13 | Servicios: 21 | Endpoints: 62 | DTOs: 32

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IBankAppService | 6 | `SharedLuxuryApp/CatalogosGenerales/Banks/Interfaces/IBankAppService.cs` |
| IDocumentCatalogAppService | 7 | `SharedLuxuryApp/CatalogosGenerales/DocumentCatalog/Interfaces/IDocumentCatalogAppService.cs` |
| IEmailDataAppService | 4 | `SharedLuxuryApp/CatalogosGenerales/EmailData/Interfaces/IEmailDataAppService.cs` |
| IAddressAppService | 1 | `SharedLuxuryApp/CatalogosGenerales/GeneralCatalogs/Interfaces/IAddressAppService.cs` |
| ICatalogAssetAppService | 5 | `SharedLuxuryApp/CatalogosGenerales/GeneralCatalogs/Interfaces/ICatalogAssetAppService.cs` |
| ICategoryAppService | 5 | `SharedLuxuryApp/CatalogosGenerales/GeneralCatalogs/Interfaces/ICategoryAppService.cs` |
| IToolAppService | 5 | `SharedLuxuryApp/CatalogosGenerales/GeneralCatalogs/Interfaces/IToolAppService.cs` |
| IMeasurementUnitAppService | 5 | `SharedLuxuryApp/CatalogosGenerales/MeasurementUnit/Interfaces/IMeasurementUnitAppService.cs` |
| IMetodoDePagoAppService | 5 | `SharedLuxuryApp/CatalogosGenerales/MetodoPago/Interfaces/IMetodoDePagoAppService.cs` |
| IPaymentMethodAppService | 5 | `SharedLuxuryApp/CatalogosGenerales/PaymentMethod/Interfaces/IPaymentMethodAppService.cs` |
| ITelefonosEmergenciaAppService | 5 | `SharedLuxuryApp/CatalogosGenerales/TelefonosEmergencia/Interfaces/ITelefonosEmergenciaAppService.cs` |
| IUsoCFDIAppService | 5 | `SharedLuxuryApp/CatalogosGenerales/UsoCfdi/Interfaces/IUsoCFDIAppService.cs` |
| IWorkPositionScheduleAppService | 8 | `SharedLuxuryApp/CatalogosGenerales/WorkPositionSchedules/Interfaces/IWorkPositionScheduleAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| BankMapper | 0 | `SharedLuxuryApp/CatalogosGenerales/Banks/Mapping/BankMapper.cs` |
| BankAppService | 6 | `SharedLuxuryApp/CatalogosGenerales/Banks/Services/BankAppService.cs` |
| DocumentCatalogAppService | 7 | `SharedLuxuryApp/CatalogosGenerales/DocumentCatalog/Services/DocumentCatalogAppService.cs` |
| EmailDataMapper | 0 | `SharedLuxuryApp/CatalogosGenerales/EmailData/Mapping/EmailDataMapper.cs` |
| EmailDataAppService | 4 | `SharedLuxuryApp/CatalogosGenerales/EmailData/Services/EmailDataAppService.cs` |
| AddressMapper | 0 | `SharedLuxuryApp/CatalogosGenerales/GeneralCatalogs/Mapping/AddressMapper.cs` |
| CategoryMapper | 0 | `SharedLuxuryApp/CatalogosGenerales/GeneralCatalogs/Mapping/CategoryMapper.cs` |
| ToolMapper | 0 | `SharedLuxuryApp/CatalogosGenerales/GeneralCatalogs/Mapping/ToolMapper.cs` |
| AddressAppService | 1 | `SharedLuxuryApp/CatalogosGenerales/GeneralCatalogs/Services/AddressAppService.cs` |
| CatalogAssetAppService | 5 | `SharedLuxuryApp/CatalogosGenerales/GeneralCatalogs/Services/CatalogAssetAppService.cs` |
| CategoryAppService | 5 | `SharedLuxuryApp/CatalogosGenerales/GeneralCatalogs/Services/CategoryAppService.cs` |
| ToolAppService | 5 | `SharedLuxuryApp/CatalogosGenerales/GeneralCatalogs/Services/ToolAppService.cs` |
| UnidadMedidaMapper | 0 | `SharedLuxuryApp/CatalogosGenerales/MeasurementUnit/Mapping/UnidadMedidaMapper.cs` |
| MeasurementUnitAppService | 5 | `SharedLuxuryApp/CatalogosGenerales/MeasurementUnit/Services/MeasurementUnitAppService.cs` |
| MetodoDePagoMapper | 0 | `SharedLuxuryApp/CatalogosGenerales/MetodoPago/Mapping/MetodoDePagoMapper.cs` |
| MetodoDePagoAppService | 5 | `SharedLuxuryApp/CatalogosGenerales/MetodoPago/Services/MetodoDePagoAppService.cs` |
| PaymentMethodMapper | 0 | `SharedLuxuryApp/CatalogosGenerales/PaymentMethod/Mapping/PaymentMethodMapper.cs` |
| PaymentMethodAppService | 5 | `SharedLuxuryApp/CatalogosGenerales/PaymentMethod/Services/PaymentMethodAppService.cs` |
| TelefonosEmergenciaAppService | 5 | `SharedLuxuryApp/CatalogosGenerales/TelefonosEmergencia/Services/TelefonosEmergenciaAppService.cs` |
| UsoCFDIAppService | 5 | `SharedLuxuryApp/CatalogosGenerales/UsoCfdi/Services/UsoCFDIAppService.cs` |
| WorkPositionScheduleAppService | 8 | `SharedLuxuryApp/CatalogosGenerales/WorkPositionSchedules/Services/WorkPositionScheduleAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetByIdAsync | IBankAppService | GET_SINGLE | `Task<ApiResponseDTO<BankAddOrEditDTO>>` | `Guid id` |
| GetAllAsync | IBankAppService | GET_LIST | `Task<ApiResponseDTO<BankDTO[]>>` | `-` |
| GetAllPagedAsync | IBankAppService | GET_LIST | `Task<ApiResponseDTO<BankDTO[]>>` | `PaginationCommonDTO pagination` |
| AddAsync | IBankAppService | CREATE | `Task<ApiResponseDTO<BankDTO>>` | `BankAddOrEditDTO dto` |
| UpdateAsync | IBankAppService | UPDATE | `Task<ApiResponseDTO<BankDTO>>` | `Guid id, BankAddOrEditDTO dto` |
| DeleteByIdAsync | IBankAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetListAsync | IDocumentCatalogAppService | GET_LIST | `Task<ApiResponseDTO<List<DocumentCatalogLis…` | `-` |
| GetByIdAsync | IDocumentCatalogAppService | GET_SINGLE | `Task<ApiResponseDTO<DocumentCatalogDetailDT…` | `Guid id` |
| CreateAsync | IDocumentCatalogAppService | CREATE | `Task<ApiResponseDTO<DocumentCatalogDetailDT…` | `DocumentCatalogCreateOrUpdateDTO dto` |
| UpdateAsync | IDocumentCatalogAppService | UPDATE | `Task<ApiResponseDTO<DocumentCatalogDetailDT…` | `Guid id, DocumentCatalogCreateOrUpdateDTO dto` |
| UpdateStatusAsync | IDocumentCatalogAppService | UPDATE | `Task<ApiResponseDTO<DocumentCatalogDetailDT…` | `Guid id, DocumentCatalogUpdateStatusDTO dto` |
| DeleteAsync | IDocumentCatalogAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| UpdateOrderAsync | IDocumentCatalogAppService | UPDATE | `Task<ApiResponseDTO<bool>>` | `DocumentCatalogUpdateOrderDTO dto` |
| GetByIdAsync | IEmailDataAppService | GET_SINGLE | `Task<ApiResponseDTO<EmailDataDTO>>` | `Guid id` |
| ListAsync | IEmailDataAppService | GET_LIST | `Task<ApiResponseDTO<List<EmailDataDTO>>>` | `-` |
| AddAsync | IEmailDataAppService | CREATE | `Task<ApiResponseDTO<EmailDataDTO>>` | `EmailDataAddOrEditDTO DTO` |
| UpdateAsync | IEmailDataAppService | UPDATE | `Task<ApiResponseDTO<EmailDataDTO>>` | `Guid id, EmailDataAddOrEditDTO DTO` |
| UpdateAsync | IAddressAppService | UPDATE | `Task<ApiResponseDTO<AddressAddOrEditDTO>>` | `Guid addressId, AddressAddOrEditDTO DTO` |
| GetAllAsync | ICatalogAssetAppService | GET_LIST | `Task<ApiResponseDTO<object>>` | `-` |
| FirstOrDefaultAsync | ICatalogAssetAppService | OTHER | `Task<ApiResponseDTO<object>>` | `Guid id` |
| AddAsync | ICatalogAssetAppService | CREATE | `Task<ApiResponseDTO<object>>` | `CatalogAsset catalogAsset` |
| UpdateAsync | ICatalogAssetAppService | UPDATE | `Task<ApiResponseDTO<object>>` | `Guid id, CatalogAsset catalogAsset` |
| DeleteByIdAsync | ICatalogAssetAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetByIdAsync | ICategoryAppService | GET_SINGLE | `Task<ApiResponseDTO<CategoryDTO>>` | `Guid id` |
| GetAllAsync | ICategoryAppService | GET_LIST | `Task<ApiResponseDTO<CategoryDTO[]>>` | `-` |
| AddAsync | ICategoryAppService | CREATE | `Task<ApiResponseDTO<CategoryDTO>>` | `CategoryDTO DTO` |
| UpdateAsync | ICategoryAppService | UPDATE | `Task<ApiResponseDTO<CategoryDTO>>` | `Guid id, CategoryDTO DTO` |
| DeleteByIdAsync | ICategoryAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetByIdAsync | IToolAppService | GET_SINGLE | `Task<ApiResponseDTO<ToolDTO>>` | `Guid id` |
| GetAllAsync | IToolAppService | GET_LIST | `Task<ApiResponseDTO<List<object>>>` | `Guid customerId` |
| AddAsync | IToolAppService | CREATE | `Task<ApiResponseDTO<Tool>>` | `ToolAddOrEditDTO DTO` |
| UpdateAsync | IToolAppService | UPDATE | `Task<ApiResponseDTO<Tool>>` | `Guid id, ToolAddOrEditDTO DTO` |
| DeleteAsync | IToolAppService | DELETE | `Task<ApiResponseDTO<Tool>>` | `Guid id` |
| GetByIdAsync | IMeasurementUnitAppService | GET_SINGLE | `Task<ApiResponseDTO<MeasurementUnitsDTO>>` | `Guid id` |
| GetAsyncAll | IMeasurementUnitAppService | GET_LIST | `Task<ApiResponseDTO<MeasurementUnitsDTO[]>>` | `-` |
| AddAsync | IMeasurementUnitAppService | CREATE | `Task<ApiResponseDTO<MeasurementUnitsAddOrEd…` | `MeasurementUnitsAddOrEditDTO DTO` |
| UpdateAsync | IMeasurementUnitAppService | UPDATE | `Task<ApiResponseDTO<MeasurementUnitsAddOrEd…` | `Guid id, MeasurementUnitsAddOrEditDTO DTO` |
| DeleteByIdAsync | IMeasurementUnitAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetAllAsync | IMetodoDePagoAppService | GET_LIST | `Task<ApiResponseDTO<List<MetodoPagoDTO>>>` | `-` |
| GetByIdAsync | IMetodoDePagoAppService | GET_SINGLE | `Task<ApiResponseDTO<MetodoPagoDTO>>` | `Guid id` |
| AddAsync | IMetodoDePagoAppService | CREATE | `Task<ApiResponseDTO<MetodoDePago>>` | `MetodoPagoAddOrEditDTO DTO` |
| UpdateAsync | IMetodoDePagoAppService | UPDATE | `Task<ApiResponseDTO<MetodoDePago>>` | `Guid id, MetodoPagoAddOrEditDTO DTO` |
| DeleteByIdAsync | IMetodoDePagoAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetAllAsync | IPaymentMethodAppService | GET_LIST | `Task<ApiResponseDTO<PaymentMethodDTO[]>>` | `-` |
| GetByIdAsync | IPaymentMethodAppService | GET_SINGLE | `Task<ApiResponseDTO<PaymentMethodDTO>>` | `Guid id` |
| AddAsync | IPaymentMethodAppService | CREATE | `Task<ApiResponseDTO<PaymentMethodDTO>>` | `PaymentMethodAddOrEditDTO DTO` |
| UpdateAsync | IPaymentMethodAppService | UPDATE | `Task<ApiResponseDTO<PaymentMethodDTO>>` | `Guid id, PaymentMethodAddOrEditDTO DTO` |
| DeleteByIdAsync | IPaymentMethodAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetByIdAsync | ITelefonosEmergenciaAppService | GET_SINGLE | `Task<ApiResponseDTO<TelefonosEmergenciaDTO>>` | `Guid id` |
| GetAllAsync | ITelefonosEmergenciaAppService | GET_LIST | `Task<ApiResponseDTO<List<TelefonosEmergenci…` | `-` |
| AddAsync | ITelefonosEmergenciaAppService | CREATE | `Task<ApiResponseDTO<SystemLuxuryApp.Configu…` | `TelefonosEmergenciaAddOrEditDTO DTO` |
| UpdateAsync | ITelefonosEmergenciaAppService | UPDATE | `Task<ApiResponseDTO<SystemLuxuryApp.Configu…` | `Guid id, TelefonosEmergenciaAddOrEditDTO DTO` |
| DeleteAsync | ITelefonosEmergenciaAppService | DELETE | `Task<ApiResponseDTO<SystemLuxuryApp.Configu…` | `Guid id` |
| GetAllAsync | IUsoCFDIAppService | GET_LIST | `Task<ApiResponseDTO<UseCfdiDTO[]>>` | `-` |
| GetByIdAsync | IUsoCFDIAppService | GET_SINGLE | `Task<ApiResponseDTO<UseCfdiDTO>>` | `Guid id` |
| AddAsync | IUsoCFDIAppService | CREATE | `Task<ApiResponseDTO<UsoCFDI>>` | `UseCfdiAddOrEditDTO DTO` |
| UpdateAsync | IUsoCFDIAppService | UPDATE | `Task<ApiResponseDTO<UsoCFDI>>` | `Guid id, UseCfdiAddOrEditDTO DTO` |
| DeleteByIdAsync | IUsoCFDIAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetListAsync | IWorkPositionScheduleAppService | GET_LIST | `Task<ApiResponseDTO<List<WorkPositionSchedu…` | `-` |
| GetByIdAsync | IWorkPositionScheduleAppService | GET_SINGLE | `Task<ApiResponseDTO<WorkPositionScheduleDet…` | `Guid id` |
| CreateAsync | IWorkPositionScheduleAppService | CREATE | `Task<ApiResponseDTO<WorkPositionScheduleDet…` | `WorkPositionScheduleCreateOrUpdateDTO dto` |
| UpdateAsync | IWorkPositionScheduleAppService | UPDATE | `Task<ApiResponseDTO<WorkPositionScheduleDet…` | `Guid id, WorkPositionScheduleCreateOrUpdateDTO dto` |
| UpdateStatusAsync | IWorkPositionScheduleAppService | UPDATE | `Task<ApiResponseDTO<WorkPositionScheduleDet…` | `Guid id, WorkPositionScheduleUpdateStatusDTO dto` |
| DeleteAsync | IWorkPositionScheduleAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetUsageCountAsync | IWorkPositionScheduleAppService | GET_LIST | `Task<ApiResponseDTO<WorkPositionScheduleUsa…` | `Guid id` |
| DeleteWithReplacementAsync | IWorkPositionScheduleAppService | DELETE | `Task<ApiResponseDTO<WorkPositionScheduleDel…` | `Guid id, WorkPositionScheduleReplaceUsageDTO dto` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/admin/catalogs/banks/{id:guid}` | `dataService.GetByIdAsync` | `SharedLuxuryApp/CatalogosGenerales/Banks/EndPoints/BanksEndpoints.cs` |
| GET | `/api/admin/catalogs/banks` | `dataService.GetAllAsync` | `SharedLuxuryApp/CatalogosGenerales/Banks/EndPoints/BanksEndpoints.cs` |
| POST | `/api/admin/catalogs/banks/paged` | `dataService.GetAllPagedAsync` | `SharedLuxuryApp/CatalogosGenerales/Banks/EndPoints/BanksEndpoints.cs` |
| POST | `/api/admin/catalogs/banks` | `dataService.AddAsync` | `SharedLuxuryApp/CatalogosGenerales/Banks/EndPoints/BanksEndpoints.cs` |
| PUT | `/api/admin/catalogs/banks/{id:guid}` | `dataService.UpdateAsync` | `SharedLuxuryApp/CatalogosGenerales/Banks/EndPoints/BanksEndpoints.cs` |
| DELETE | `/api/admin/catalogs/banks/{id:guid}` | `dataService.DeleteByIdAsync` | `SharedLuxuryApp/CatalogosGenerales/Banks/EndPoints/BanksEndpoints.cs` |
| GET | `/api/admin/general-catalogs/document-catalog` | `appService.GetListAsync` | `SharedLuxuryApp/CatalogosGenerales/DocumentCatalog/EndPoints/DocumentCatalogEndpoints.cs` |
| GET | `/api/admin/general-catalogs/document-catalog/{id:guid}` | `appService.GetByIdAsync` | `SharedLuxuryApp/CatalogosGenerales/DocumentCatalog/EndPoints/DocumentCatalogEndpoints.cs` |
| POST | `/api/admin/general-catalogs/document-catalog` | `appService.CreateAsync` | `SharedLuxuryApp/CatalogosGenerales/DocumentCatalog/EndPoints/DocumentCatalogEndpoints.cs` |
| PUT | `/api/admin/general-catalogs/document-catalog/{id:guid}` | `appService.UpdateAsync` | `SharedLuxuryApp/CatalogosGenerales/DocumentCatalog/EndPoints/DocumentCatalogEndpoints.cs` |
| PATCH | `/api/admin/general-catalogs/document-catalog/{id:guid}/status` | `appService.UpdateStatusAsync` | `SharedLuxuryApp/CatalogosGenerales/DocumentCatalog/EndPoints/DocumentCatalogEndpoints.cs` |
| DELETE | `/api/admin/general-catalogs/document-catalog/{id:guid}` | `appService.DeleteAsync` | `SharedLuxuryApp/CatalogosGenerales/DocumentCatalog/EndPoints/DocumentCatalogEndpoints.cs` |
| PUT | `/api/admin/general-catalogs/document-catalog/order` | `appService.UpdateOrderAsync` | `SharedLuxuryApp/CatalogosGenerales/DocumentCatalog/EndPoints/DocumentCatalogEndpoints.cs` |
| GET | `/api/admin/catalogs/email-data/{id:guid}` | `dataService.GetByIdAsync` | `SharedLuxuryApp/CatalogosGenerales/EmailData/EndPoints/EmailDataEndpoints.cs` |
| GET | `/api/admin/catalogs/email-data/list` | `dataService.ListAsync` | `SharedLuxuryApp/CatalogosGenerales/EmailData/EndPoints/EmailDataEndpoints.cs` |
| PUT | `/api/admin/catalogs/email-data/{id:guid}` | `dataService.UpdateAsync` | `SharedLuxuryApp/CatalogosGenerales/EmailData/EndPoints/EmailDataEndpoints.cs` |
| POST | `/api/admin/catalogs/email-data` | `dataService.AddAsync` | `SharedLuxuryApp/CatalogosGenerales/EmailData/EndPoints/EmailDataEndpoints.cs` |
| PUT | `/api/address/{addressId:guid}` | `dataService.UpdateAsync` | `SharedLuxuryApp/CatalogosGenerales/GeneralCatalogs/EndPoints/AddressEndPoints.cs` |
| GET | `/api/catalog-asset` | `dataService.GetAllAsync` | `SharedLuxuryApp/CatalogosGenerales/GeneralCatalogs/EndPoints/CatalogAssetEndPoints.cs` |
| GET | `/api/catalog-asset/{id:guid}` | `dataService.FirstOrDefaultAsync` | `SharedLuxuryApp/CatalogosGenerales/GeneralCatalogs/EndPoints/CatalogAssetEndPoints.cs` |
| POST | `/api/catalog-asset` | `dataService.AddAsync` | `SharedLuxuryApp/CatalogosGenerales/GeneralCatalogs/EndPoints/CatalogAssetEndPoints.cs` |
| PUT | `/api/catalog-asset/{id:guid}` | `dataService.UpdateAsync` | `SharedLuxuryApp/CatalogosGenerales/GeneralCatalogs/EndPoints/CatalogAssetEndPoints.cs` |
| DELETE | `/api/catalog-asset/{id:guid}` | `dataService.DeleteByIdAsync` | `SharedLuxuryApp/CatalogosGenerales/GeneralCatalogs/EndPoints/CatalogAssetEndPoints.cs` |
| GET | `/api/categories/{id:guid}` | `dataService.GetByIdAsync` | `SharedLuxuryApp/CatalogosGenerales/GeneralCatalogs/EndPoints/CategoriesEndPoints.cs` |
| GET | `/api/categories` | `dataService.GetAllAsync` | `SharedLuxuryApp/CatalogosGenerales/GeneralCatalogs/EndPoints/CategoriesEndPoints.cs` |
| POST | `/api/categories` | `dataService.AddAsync` | `SharedLuxuryApp/CatalogosGenerales/GeneralCatalogs/EndPoints/CategoriesEndPoints.cs` |
| PUT | `/api/categories/{id:guid}` | `dataService.UpdateAsync` | `SharedLuxuryApp/CatalogosGenerales/GeneralCatalogs/EndPoints/CategoriesEndPoints.cs` |
| DELETE | `/api/categories/{id:guid}` | `dataService.DeleteByIdAsync` | `SharedLuxuryApp/CatalogosGenerales/GeneralCatalogs/EndPoints/CategoriesEndPoints.cs` |
| GET | `/api/configuracion/dias-festivos/{year:int}` | `holidayService.GetMexicanHolidaysAsync` | `SharedLuxuryApp/CatalogosGenerales/GeneralCatalogs/EndPoints/ConfiguracionEndPoints.cs` |
| GET | `/api/unidad-medida/{id:guid}` | `dataService.GetByIdAsync` | `SharedLuxuryApp/CatalogosGenerales/MeasurementUnit/EndPoints/UnidadMedidaEndPoints.cs` |
| GET | `/api/unidad-medida` | `dataService.AddAsync` | `SharedLuxuryApp/CatalogosGenerales/MeasurementUnit/EndPoints/UnidadMedidaEndPoints.cs` |
| POST | `/api/unidad-medida` | `dataService.AddAsync` | `SharedLuxuryApp/CatalogosGenerales/MeasurementUnit/EndPoints/UnidadMedidaEndPoints.cs` |
| PUT | `/api/unidad-medida/{id:guid}` | `dataService.UpdateAsync` | `SharedLuxuryApp/CatalogosGenerales/MeasurementUnit/EndPoints/UnidadMedidaEndPoints.cs` |
| DELETE | `/api/unidad-medida/{id:guid}` | `dataService.DeleteByIdAsync` | `SharedLuxuryApp/CatalogosGenerales/MeasurementUnit/EndPoints/UnidadMedidaEndPoints.cs` |
| GET | `/api/metodo-pago` | `appService.GetAllAsync` | `SharedLuxuryApp/CatalogosGenerales/MetodoPago/EndPoints/MetodoPagoEndPoints.cs` |
| GET | `/api/metodo-pago/{id:guid}` | `appService.GetByIdAsync` | `SharedLuxuryApp/CatalogosGenerales/MetodoPago/EndPoints/MetodoPagoEndPoints.cs` |
| POST | `/api/metodo-pago` | `appService.AddAsync` | `SharedLuxuryApp/CatalogosGenerales/MetodoPago/EndPoints/MetodoPagoEndPoints.cs` |
| PUT | `/api/metodo-pago/{id:guid}` | `appService.UpdateAsync` | `SharedLuxuryApp/CatalogosGenerales/MetodoPago/EndPoints/MetodoPagoEndPoints.cs` |
| DELETE | `/api/metodo-pago/{id:guid}` | `appService.DeleteByIdAsync` | `SharedLuxuryApp/CatalogosGenerales/MetodoPago/EndPoints/MetodoPagoEndPoints.cs` |
| GET | `/api/payment-methods` | `appService.GetAllAsync` | `SharedLuxuryApp/CatalogosGenerales/PaymentMethod/EndPoints/PaymentMethodsEndPoints.cs` |
| GET | `/api/payment-methods/{id:guid}` | `appService.GetByIdAsync` | `SharedLuxuryApp/CatalogosGenerales/PaymentMethod/EndPoints/PaymentMethodsEndPoints.cs` |
| POST | `/api/payment-methods` | `appService.AddAsync` | `SharedLuxuryApp/CatalogosGenerales/PaymentMethod/EndPoints/PaymentMethodsEndPoints.cs` |
| PUT | `/api/payment-methods/{id:guid}` | `appService.UpdateAsync` | `SharedLuxuryApp/CatalogosGenerales/PaymentMethod/EndPoints/PaymentMethodsEndPoints.cs` |
| DELETE | `/api/payment-methods/{id:guid}` | `appService.DeleteByIdAsync` | `SharedLuxuryApp/CatalogosGenerales/PaymentMethod/EndPoints/PaymentMethodsEndPoints.cs` |
| GET | `/api/telefonosemergencia/{id:guid}` | `appService.GetByIdAsync` | `SharedLuxuryApp/CatalogosGenerales/TelefonosEmergencia/EndPoints/TelefonosEmergenciaEndpoints.cs` |
| GET | `/api/telefonosemergencia` | `appService.GetAllAsync` | `SharedLuxuryApp/CatalogosGenerales/TelefonosEmergencia/EndPoints/TelefonosEmergenciaEndpoints.cs` |
| POST | `/api/telefonosemergencia` | `appService.AddAsync` | `SharedLuxuryApp/CatalogosGenerales/TelefonosEmergencia/EndPoints/TelefonosEmergenciaEndpoints.cs` |
| PUT | `/api/telefonosemergencia/{id:guid}` | `appService.UpdateAsync` | `SharedLuxuryApp/CatalogosGenerales/TelefonosEmergencia/EndPoints/TelefonosEmergenciaEndpoints.cs` |
| DELETE | `/api/telefonosemergencia/{id:guid}` | `appService.DeleteAsync` | `SharedLuxuryApp/CatalogosGenerales/TelefonosEmergencia/EndPoints/TelefonosEmergenciaEndpoints.cs` |
| GET | `/api/cfdi-use` | `dataService.GetAllAsync` | `SharedLuxuryApp/CatalogosGenerales/UsoCfdi/EndPoints/UsoCfdiEndPoints.cs` |
| GET | `/api/cfdi-use/{id:guid}` | `dataService.GetByIdAsync` | `SharedLuxuryApp/CatalogosGenerales/UsoCfdi/EndPoints/UsoCfdiEndPoints.cs` |
| POST | `/api/cfdi-use` | `dataService.AddAsync` | `SharedLuxuryApp/CatalogosGenerales/UsoCfdi/EndPoints/UsoCfdiEndPoints.cs` |
| PUT | `/api/cfdi-use/{id:guid}` | `dataService.UpdateAsync` | `SharedLuxuryApp/CatalogosGenerales/UsoCfdi/EndPoints/UsoCfdiEndPoints.cs` |
| DELETE | `/api/cfdi-use/{id:guid}` | `dataService.DeleteByIdAsync` | `SharedLuxuryApp/CatalogosGenerales/UsoCfdi/EndPoints/UsoCfdiEndPoints.cs` |
| GET | `/api/admin/general-catalogs/work-position-schedule` | `appService.GetListAsync` | `SharedLuxuryApp/CatalogosGenerales/WorkPositionSchedules/EndPoints/WorkPositionScheduleEndpoints.cs` |
| GET | `/api/admin/general-catalogs/work-position-schedule/{id:guid}` | `appService.GetByIdAsync` | `SharedLuxuryApp/CatalogosGenerales/WorkPositionSchedules/EndPoints/WorkPositionScheduleEndpoints.cs` |
| POST | `/api/admin/general-catalogs/work-position-schedule` | `appService.CreateAsync` | `SharedLuxuryApp/CatalogosGenerales/WorkPositionSchedules/EndPoints/WorkPositionScheduleEndpoints.cs` |
| PUT | `/api/admin/general-catalogs/work-position-schedule/{id:guid}` | `appService.UpdateAsync` | `SharedLuxuryApp/CatalogosGenerales/WorkPositionSchedules/EndPoints/WorkPositionScheduleEndpoints.cs` |
| PATCH | `/api/admin/general-catalogs/work-position-schedule/{id:guid}/status` | `appService.UpdateStatusAsync` | `SharedLuxuryApp/CatalogosGenerales/WorkPositionSchedules/EndPoints/WorkPositionScheduleEndpoints.cs` |
| DELETE | `/api/admin/general-catalogs/work-position-schedule/{id:guid}` | `appService.DeleteAsync` | `SharedLuxuryApp/CatalogosGenerales/WorkPositionSchedules/EndPoints/WorkPositionScheduleEndpoints.cs` |
| GET | `/api/admin/general-catalogs/work-position-schedule/{id:guid}/usage` | `appService.GetUsageCountAsync` | `SharedLuxuryApp/CatalogosGenerales/WorkPositionSchedules/EndPoints/WorkPositionScheduleEndpoints.cs` |
| POST | `/api/admin/general-catalogs/work-position-schedule/{id:guid}/replace-usage` | `appService.DeleteWithReplacementAsync` | `SharedLuxuryApp/CatalogosGenerales/WorkPositionSchedules/EndPoints/WorkPositionScheduleEndpoints.cs` |

#### Modulo: Files

- Interfaces: 0 | Servicios: 0 | Endpoints: 3 | DTOs: 0

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/files/download` | `FileEndpointSupport.DownloadFileAsync` | `SharedLuxuryApp/Files/EndPoints/FilesEndpoints.cs` |
| GET | `/api/files/sidebar-images` | - | `SharedLuxuryApp/Files/EndPoints/FilesEndpoints.cs` |
| GET | `/api/files/comite-home-images` | - | `SharedLuxuryApp/Files/EndPoints/FilesEndpoints.cs` |

#### Modulo: Folios

- Interfaces: 1 | Servicios: 1 | Endpoints: 0 | DTOs: 0

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IGenerateFolioService | 11 | `SharedLuxuryApp/Folios/Interfaces/IGenerateFolioService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| GenerateFolioService | 11 | `SharedLuxuryApp/Folios/Services/GenerateFolioService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| OnGenerateFolioSC | IGenerateFolioService | OTHER | `string` | `Guid customerId` |
| OnGenerateFolioOC | IGenerateFolioService | OTHER | `string` | `Guid customerId, TipoGasto? tipoGasto = null` |
| OnGenerateFolioPurchaseRequest | IGenerateFolioService | OTHER | `string` | `Guid customerId` |
| OnGenerateFolioPurchaseOrder | IGenerateFolioService | OTHER | `string` | `Guid customerId` |
| OnGenerateFolioLegal | IGenerateFolioService | OTHER | `string` | `-` |
| OnGenerateFolioProfession | IGenerateFolioService | OTHER | `string` | `Departament departament` |
| OnGenerateFolioTicketMessage | IGenerateFolioService | OTHER | `Task<string>` | `Guid ticketGroupId` |
| OnGenerateDocumentBuilding | IGenerateFolioService | OTHER | `Task<string>` | `Guid customerId` |
| OnGenerateDocumentLegalRecord | IGenerateFolioService | OTHER | `Task<string>` | `Guid customerId` |
| OnGenerateFormat | IGenerateFolioService | OTHER | `Task<string>` | `Guid customerId` |
| OnGenerateManualsAndProcesses | IGenerateFolioService | OTHER | `Task<string>` | `Guid customerId` |

#### Modulo: ResponsablesCliente

- Interfaces: 1 | Servicios: 1 | Endpoints: 2 | DTOs: 0

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IResponsablesClienteAppService | 46 | `SharedLuxuryApp/ResponsablesCliente/Interfaces/IResponsablesClienteAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| ResponsablesClienteAppService | 6 | `SharedLuxuryApp/ResponsablesCliente/Services/ResponsablesClienteAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetByRoleAsync | IResponsablesClienteAppService | GET_LIST | `Task<ApiResponseDTO<List<ApplicationUserGet…` | `Guid customerId, ApplicationRoleEnum role` |
| GetSuggestedCalendarInviteesAsync | IResponsablesClienteAppService | GET_LIST | `Task<ApiResponseDTO<List<ApplicationUserGet…` | `Guid customerId, GoogleCalendarEventType subjectType, bool …` |
| OnGetSuperUsuarioAsync | IResponsablesClienteAppService | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | `-` |
| OnGetDireccionGeneralAsync | IResponsablesClienteAppService | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | `-` |
| OnGetLegalAsync | IResponsablesClienteAppService | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | `-` |
| OnGetCoordinacionJuridicoAsync | IResponsablesClienteAppService | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | `-` |
| OnGetRecursosHumanosAsync | IResponsablesClienteAppService | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | `-` |
| OnGetReclutamientoAsync | IResponsablesClienteAppService | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | `-` |
| OnGetGerenteMantenimientoAsync | IResponsablesClienteAppService | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | `-` |
| OnGetSistemasGeneralAsync | IResponsablesClienteAppService | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | `-` |
| OnGetMensajeriaAsync | IResponsablesClienteAppService | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | `-` |
| OnGetSupervisionOperativaAsync | IResponsablesClienteAppService | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | `Guid customerId` |
| OnGetAdministradorAsync | IResponsablesClienteAppService | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | `Guid customerId` |
| OnGetGerenteOperacionesAsync | IResponsablesClienteAppService | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | `Guid customerId` |
| OnGetGerenteAtencionAsync | IResponsablesClienteAppService | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | `Guid customerId` |
| OnGetAsistenteAsync | IResponsablesClienteAppService | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | `Guid customerId` |
| OnGetAlmacenistaAsync | IResponsablesClienteAppService | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | `Guid customerId` |
| OnGetContadorAsync | IResponsablesClienteAppService | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | `Guid customerId` |
| OnGetCobranzaAsync | IResponsablesClienteAppService | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | `Guid customerId` |
| OnGetJefeMantenimientoAsync | IResponsablesClienteAppService | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | `Guid customerId` |
| OnGetTecnicoMantenimientoAsync | IResponsablesClienteAppService | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | `Guid customerId` |
| OnGetRecepcionistaAsync | IResponsablesClienteAppService | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | `Guid customerId` |
| OnGetMasterConciergeAsync | IResponsablesClienteAppService | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | `Guid customerId` |
| OnGetConciergeAsync | IResponsablesClienteAppService | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | `Guid customerId` |
| OnGetJardineriaInternaAsync | IResponsablesClienteAppService | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | `Guid customerId` |
| OnGetJefeSeguridadInternaAsync | IResponsablesClienteAppService | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | `Guid customerId` |
| OnGetSeguridadInternaAsync | IResponsablesClienteAppService | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | `Guid customerId` |
| OnGetMonitoristaAsync | IResponsablesClienteAppService | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | `Guid customerId` |
| OnGetEntrenadorGimnasioAsync | IResponsablesClienteAppService | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | `Guid customerId` |
| OnGetSupervisorObraAsync | IResponsablesClienteAppService | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | `Guid customerId` |
| OnGetSistemasAsync | IResponsablesClienteAppService | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | `Guid customerId` |
| OnGetLudotecariaAsync | IResponsablesClienteAppService | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | `Guid customerId` |
| OnGetPaqueteriaAsync | IResponsablesClienteAppService | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | `Guid customerId` |
| OnGetChoferAsync | IResponsablesClienteAppService | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | `Guid customerId` |
| OnGetBellBoyAsync | IResponsablesClienteAppService | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | `Guid customerId` |
| OnGetSnackBarAsync | IResponsablesClienteAppService | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | `Guid customerId` |
| OnGetComiteAsync | IResponsablesClienteAppService | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | `-` |
| OnGetCondominoAsync | IResponsablesClienteAppService | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | `-` |
| OnGetJardineriaAsync | IResponsablesClienteAppService | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | `-` |
| OnGetLimpiezaAsync | IResponsablesClienteAppService | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | `-` |
| OnGetSeguridadAsync | IResponsablesClienteAppService | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | `-` |
| OnGetProveedorAsync | IResponsablesClienteAppService | OTHER | `Task<List<ApplicationUserGetInfoDTO>>` | `-` |
| OnGetPhonmeNumberCustomer | IResponsablesClienteAppService | OTHER | `Task<string>` | `Guid customerId` |
| OnGetComiteVigilanciaAsync | IResponsablesClienteAppService | OTHER | `Task<List<string>>` | `Guid customerId` |
| DataSmtpEmailAdminDTOAsync | IResponsablesClienteAppService | OTHER | `Task<DataSmtpEmailDTO>` | `Guid customerId` |
| DataSmtpEmailSupervisorOpDTOAsync | IResponsablesClienteAppService | OTHER | `Task<DataSmtpEmailDTO>` | `Guid customerId` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/responsables-cliente/por-rol` | `appService.GetByRoleAsync` | `SharedLuxuryApp/ResponsablesCliente/EndPoints/ResponsablesClienteEndpoints.cs` |
| GET | `/api/responsables-cliente/sugeridos-agenda` | `appService.GetSuggestedCalendarInviteesAsync` | `SharedLuxuryApp/ResponsablesCliente/EndPoints/ResponsablesClienteEndpoints.cs` |


### Grupo: SupplierLuxuryApp

#### Modulo: ProviderQualification

- Interfaces: 1 | Servicios: 3 | Endpoints: 5 | DTOs: 2

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IQualificationProviderAppService | 5 | `SupplierLuxuryApp/ProviderQualification/Interfaces/IQualificationProviderAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| QualificationProvider | 0 | `SupplierLuxuryApp/ProviderQualification/Entities/QualificationProvider.cs` |
| QualificationProviderMapper | 0 | `SupplierLuxuryApp/ProviderQualification/Mapping/QualificationProviderMapper.cs` |
| QualificationProviderAppService | 5 | `SupplierLuxuryApp/ProviderQualification/Services/QualificationProviderAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetUserProviderAsync | IQualificationProviderAppService | GET_LIST | `Task<ApiResponseDTO<QualificationProviderDT…` | `string applicationUserId, Guid providerId` |
| GetAllAsync | IQualificationProviderAppService | GET_LIST | `Task<ApiResponseDTO<List<QualificationProvi…` | `-` |
| AddAsync | IQualificationProviderAppService | CREATE | `Task<ApiResponseDTO<QualificationProvider>>` | `QualificationProviderAddOrEditDTO DTO` |
| UpdateAsync | IQualificationProviderAppService | UPDATE | `Task<ApiResponseDTO<QualificationProvider>>` | `Guid id, QualificationProviderAddOrEditDTO DTO` |
| DeleteByIdAsync | IQualificationProviderAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/qualification-provider/{applicationUserId}/{providerId:guid}` | `appService.GetUserProviderAsync` | `SupplierLuxuryApp/ProviderQualification/EndPoints/QualificationProviderEndpoints.cs` |
| GET | `/api/qualification-provider` | `appService.GetAllAsync` | `SupplierLuxuryApp/ProviderQualification/EndPoints/QualificationProviderEndpoints.cs` |
| POST | `/api/qualification-provider` | `appService.AddAsync` | `SupplierLuxuryApp/ProviderQualification/EndPoints/QualificationProviderEndpoints.cs` |
| PUT | `/api/qualification-provider/{id:guid}` | `appService.UpdateAsync` | `SupplierLuxuryApp/ProviderQualification/EndPoints/QualificationProviderEndpoints.cs` |
| DELETE | `/api/qualification-provider/{id:guid}` | `appService.DeleteByIdAsync` | `SupplierLuxuryApp/ProviderQualification/EndPoints/QualificationProviderEndpoints.cs` |

#### Modulo: Providers

- Interfaces: 1 | Servicios: 4 | Endpoints: 12 | DTOs: 4

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IProviderAppService | 15 | `SupplierLuxuryApp/Providers/Interfaces/IProviderAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| CategoryProvider | 0 | `SupplierLuxuryApp/Providers/Entities/CategoryProvider.cs` |
| Provider | 0 | `SupplierLuxuryApp/Providers/Entities/Provider.cs` |
| ProviderMapper | 0 | `SupplierLuxuryApp/Providers/Mapping/ProviderMapper.cs` |
| ProviderAppService | 15 | `SupplierLuxuryApp/Providers/Services/ProviderAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetByIdAsync | IProviderAppService | GET_SINGLE | `Task<ApiResponseDTO<ProviderDTO>>` | `Guid id, Guid customerId` |
| BuscarCoincidenciaAsync | IProviderAppService | GET_LIST | `Task<ApiResponseDTO<ProviderCoincidenciaDTO…` | `string value` |
| ValidarRfcAsync | IProviderAppService | SPECIAL | `Task<ApiResponseDTO<List<ValidarRfcDTO>>>` | `string value, Guid customerId` |
| ListProviderIndexDTOAsync | IProviderAppService | GET_LIST | `Task<ApiResponseDTO<List<ProviderIndexDTO>>>` | `bool state, Guid customerId` |
| BuscarPorCategoriaAsync | IProviderAppService | GET_LIST | `Task<ApiResponseDTO<List<ProviderIndexDTO>>>` | `Guid categoriaId, Guid customerId` |
| AddAsync | IProviderAppService | CREATE | `Task<ApiResponseDTO<Provider>>` | `ProviderAddOrEditDTO DTO` |
| UpdateAsync | IProviderAppService | UPDATE | `Task<ApiResponseDTO<Provider>>` | `Guid id, ProviderAddOrEditDTO DTO` |
| ChangeStateAsync | IProviderAppService | SPECIAL | `Task<ApiResponseDTO<Provider>>` | `Guid providerId, bool state` |
| DeleteAsync | IProviderAppService | DELETE | `Task<ApiResponseDTO<Provider>>` | `Guid id, Guid customerId` |
| CoincidenciasAsync | IProviderAppService | OTHER | `Task<ApiResponseDTO<IEnumerable<object>>>` | `Guid providerId` |
| GetProviderSelectItemAsync | IProviderAppService | GET_LIST | `Task<ApiResponseDTO<SelectItemDTO<Guid>>>` | `Guid id, Guid customerId` |
| GetListBusquedaProveedorDTOAsync | IProviderAppService | GET_LIST | `Task<ApiResponseDTO<PagedResultDTO<Busqueda…` | `PaginationCommonDTO pagination, Guid customerId, ServiceTyp…` |
| BuscarProveedorAsync | IProviderAppService | GET_LIST | `Task<ApiResponseDTO<List<BusquedaProveedorD…` | `bool state, Guid customerId, PaginationCommonDTO paginator` |
| AutorizarAsync | IProviderAppService | SPECIAL | `Task<ApiResponseDTO<Provider>>` | `Guid providerId, Guid customerId` |
| MigrateProvidersToCustomersAsync | IProviderAppService | SPECIAL | `Task<ApiResponseDTO<string>>` | `-` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/providers/{id:guid}/{customerId:guid}` | `providerAppService.GetByIdAsync` | `SupplierLuxuryApp/Providers/EndPoints/ProvidersEndPoints.cs` |
| PUT | `/api/providers/change-state/{providerId:guid}/{state:bool}` | `providerAppService.ChangeStateAsync` | `SupplierLuxuryApp/Providers/EndPoints/ProvidersEndPoints.cs` |
| GET | `/api/providers/validar-rfc/{value}/{customerId:guid}` | `providerAppService.ValidarRfcAsync` | `SupplierLuxuryApp/Providers/EndPoints/ProvidersEndPoints.cs` |
| GET | `/api/providers/get-all/{state:bool}/{customerId:guid}` | `providerAppService.ListProviderIndexDTOAsync` | `SupplierLuxuryApp/Providers/EndPoints/ProvidersEndPoints.cs` |
| POST | `/api/providers` | `providerAppService.AddAsync` | `SupplierLuxuryApp/Providers/EndPoints/ProvidersEndPoints.cs` |
| PUT | `/api/providers/{id:guid}` | `providerAppService.UpdateAsync` | `SupplierLuxuryApp/Providers/EndPoints/ProvidersEndPoints.cs` |
| DELETE | `/api/providers/{id:guid}` | `providerAppService.DeleteAsync` | `SupplierLuxuryApp/Providers/EndPoints/ProvidersEndPoints.cs` |
| GET | `/api/providers/coincidencias/{providerId:guid}` | `providerAppService.CoincidenciasAsync` | `SupplierLuxuryApp/Providers/EndPoints/ProvidersEndPoints.cs` |
| GET | `/api/providers/list` | `providerAppService.GetListBusquedaProveedorDTOAsync` | `SupplierLuxuryApp/Providers/EndPoints/ProvidersEndPoints.cs` |
| GET | `/api/providers/buscar-proveedor/{state:bool}` | `providerAppService.BuscarProveedorAsync` | `SupplierLuxuryApp/Providers/EndPoints/ProvidersEndPoints.cs` |
| PUT | `/api/providers/autorizar/{providerId:guid}` | `providerAppService.AutorizarAsync` | `SupplierLuxuryApp/Providers/EndPoints/ProvidersEndPoints.cs` |
| POST | `/api/providers/migrate-providers-to-customers` | `providerAppService.MigrateProvidersToCustomersAsync` | `SupplierLuxuryApp/Providers/EndPoints/ProvidersEndPoints.cs` |

#### Modulo: Purchases

- Interfaces: 8 | Servicios: 10 | Endpoints: 48 | DTOs: 45

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IOrdenCompraAppService | 22 | `SupplierLuxuryApp/Purchases/OrdenesCompra/Interfaces/IOrdenCompraAppService.cs` |
| IOrdenCompraAuthAppService | 3 | `SupplierLuxuryApp/Purchases/PurchaseOrderAuth/Interfaces/IOrdenCompraAuthAppService.cs` |
| IOrdenCompraPresupuestoAppService | 8 | `SupplierLuxuryApp/Purchases/PurchaseOrderBudgets/Interfaces/IOrdenCompraPresupuestoAppService.cs` |
| IOrdenCompraDetalleAppService | 6 | `SupplierLuxuryApp/Purchases/PurchaseOrderDetail/Interfaces/IOrdenCompraDetalleAppService.cs` |
| ITotalesOrdenCompraDetallleService | 4 | `SupplierLuxuryApp/Purchases/PurchaseOrderDetail/Interfaces/ITotalesOrdenCompraDetallleService.cs` |
| IOrdenCompraComprobantePagoAppService | 2 | `SupplierLuxuryApp/Purchases/PurchaseOrderPayment/Interfaces/IOrdenCompraComprobantePagoAppService.cs` |
| IOrdenCompraDatosPagoAppService | 2 | `SupplierLuxuryApp/Purchases/PurchaseOrderPayment/Interfaces/IOrdenCompraDatosPagoAppService.cs` |
| IOrdenCompraStatusAppService | 6 | `SupplierLuxuryApp/Purchases/PurchaseOrderStatus/Interfaces/IOrdenCompraStatusAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| SolicitudPagoMapper | 0 | `SupplierLuxuryApp/Purchases/Mapping/SolicitudPagoMapper.cs` |
| PurchaseOrderBudgetMapping | 0 | `SupplierLuxuryApp/Purchases/OrdenesCompra/Mapping/PurchaseOrderBudgetMapping.cs` |
| OrdenCompraAppService | 22 | `SupplierLuxuryApp/Purchases/OrdenesCompra/Services/OrdenCompraAppService.cs` |
| OrdenCompraAuthAppService | 3 | `SupplierLuxuryApp/Purchases/PurchaseOrderAuth/Services/OrdenCompraAuthAppService.cs` |
| OrdenCompraPresupuestoAppService | 8 | `SupplierLuxuryApp/Purchases/PurchaseOrderBudgets/Services/OrdenCompraPresupuestoAppService.cs` |
| OrdenCompraDetalleAppService | 6 | `SupplierLuxuryApp/Purchases/PurchaseOrderDetail/Services/OrdenCompraDetalleAppService.cs` |
| TotalesOrdenCompraDetallleService | 4 | `SupplierLuxuryApp/Purchases/PurchaseOrderDetail/Services/TotalesOrdenCompraDetallleService.cs` |
| OrdenCompraComprobantePagoAppService | 2 | `SupplierLuxuryApp/Purchases/PurchaseOrderPayment/Services/OrdenCompraComprobantePagoAppService.cs` |
| OrdenCompraDatosPagoAppService | 2 | `SupplierLuxuryApp/Purchases/PurchaseOrderPayment/Services/OrdenCompraDatosPagoAppService.cs` |
| OrdenCompraStatusAppService | 6 | `SupplierLuxuryApp/Purchases/PurchaseOrderStatus/Services/OrdenCompraStatusAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetAllAsync | IOrdenCompraAppService | GET_LIST | `Task<ApiResponseDTO<OrdenesCompraDTO[]>>` | `Guid customerId, StatusOrdenCompra estatus, TipoGasto tipoG…` |
| GetByIdAsync | IOrdenCompraAppService | GET_SINGLE | `Task<ApiResponseDTO<OrdenCompraIndividualDT…` | `Guid id` |
| GetForEdit | IOrdenCompraAppService | GET_LIST | `Task<ApiResponseDTO<object>>` | `Guid id` |
| GetOrdenCompraPdf | IOrdenCompraAppService | GET_LIST | `Task<ApiResponseDTO<OrdenCompraPdfDTO>>` | `Guid id` |
| GetSolicitudPagoPdf | IOrdenCompraAppService | GET_LIST | `Task<ApiResponseDTO<SolicitudPagoPdfRespons…` | `Guid id` |
| FondeoAsync | IOrdenCompraAppService | OTHER | `Task<ApiResponseDTO<FondeoCaratulaDTO>>` | `RequestFondeoCaratulaDTO request` |
| OrdenesCompraGastosFijosAsync | IOrdenCompraAppService | OTHER | `Task<ApiResponseDTO<List<OrdenesCompraDTO>>>` | `Guid customerId, StatusOrdenCompra estatus` |
| CotizacionesRelacionadasAsync | IOrdenCompraAppService | OTHER | `Task<ApiResponseDTO<List<object>>>` | `Guid solicitudCompraId` |
| AddAsync | IOrdenCompraAppService | CREATE | `Task<ApiResponseDTO<OrdenCompra>>` | `Guid providerId, int posicionCotizacion, Guid? solicitudCom…` |
| UpdateAsync | IOrdenCompraAppService | UPDATE | `Task<ApiResponseDTO<OrdenCompra>>` | `Guid id, OrdenCompraAddOrEditDTO DTO` |
| DeleteAsync | IOrdenCompraAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid ordenCompraId` |
| OrdenCompraPendientesAsync | IOrdenCompraAppService | OTHER | `Task<ApiResponseDTO<List<PresupuestoCuentaD…` | `Guid customerId, Guid ordenCompraId` |
| ValidarOrdenesCompraMismoFolioSolicituCompraAsync | IOrdenCompraAppService | SPECIAL | `Task<ApiResponseDTO<decimal>>` | `Guid ordenCompraId` |
| GenerarOrdenCompraFijosAsync | IOrdenCompraAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid customerId, GastoFijoQuincena quincena, int fundingYea…` |
| AddProgressiveAsync | IOrdenCompraAppService | CREATE | `Task<ApiResponseDTO<OrdenCompra>>` | `ProgressiveOrdenCompraCreateDTO dto` |
| AddFueraFondeoAsync | IOrdenCompraAppService | CREATE | `Task<ApiResponseDTO<OrdenCompra>>` | `FueraFondeoOrdenCompraCreateDTO dto` |
| RemoveFueraFondeoAsync | IOrdenCompraAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid ordenCompraId` |
| CreateFromInvoicesAsync | IOrdenCompraAppService | CREATE | `Task<ApiResponseDTO<bool>>` | `CreateOrdersFromInvoicesRequestDTO request` |
| UnlinkSolicitud | IOrdenCompraAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid ordenCompraId` |
| GetUnlinkedOrdersAsync | IOrdenCompraAppService | GET_LIST | `Task<ApiResponseDTO<IEnumerable<UnlinkedOrd…` | `Guid customerId` |
| LinkOrderToRequestAsync | IOrdenCompraAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid ordenCompraId, Guid solicitudCompraId` |
| GetForLinkManagerAsync | IOrdenCompraAppService | GET_LIST | `Task<ApiResponseDTO<IEnumerable<OrdenCompra…` | `Guid customerId` |
| AutorizarAsync | IOrdenCompraAuthAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid ordenCompraId, string applicationUserId` |
| DesautorizarAsync | IOrdenCompraAuthAppService | OTHER | `Task<ApiResponseDTO<bool>>` | `Guid ordenCompraId` |
| NoAutorizadaAsync | IOrdenCompraAuthAppService | OTHER | `Task<ApiResponseDTO<bool>>` | `Guid ordenCompraAuthId, string userId, OrdenCompraAuth DTO` |
| GetByIdAsync | IOrdenCompraPresupuestoAppService | GET_SINGLE | `Task<ApiResponseDTO<PurchaseOrderBudgetDTO>>` | `Guid id` |
| GetAllForOrdenCompraAsync | IOrdenCompraPresupuestoAppService | GET_LIST | `Task<ApiResponseDTO<List<PurchaseOrderBudge…` | `Guid ordenCompraId` |
| AddAsync | IOrdenCompraPresupuestoAppService | CREATE | `Task<ApiResponseDTO<PurchaseOrderBudgetDTO>>` | `PurchaseOrderBudgetAddOrEditDTO DTO` |
| UpdateAsync | IOrdenCompraPresupuestoAppService | UPDATE | `Task<ApiResponseDTO<PurchaseOrderBudgetDTO>>` | `Guid id, PurchaseOrderBudgetAddOrEditDTO DTO` |
| DeleteAsync | IOrdenCompraPresupuestoAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetByIdForEditAsync | IOrdenCompraPresupuestoAppService | GET_LIST | `Task<ApiResponseDTO<PurchaseOrderBudgetAddO…` | `string id` |
| GetAllForPurchaseOrderBudgetTotalAsync | IOrdenCompraPresupuestoAppService | GET_LIST | `Task<ApiResponseDTO<List<object>>>` | `Guid ordenCompraId` |
| GetByIdSimpleAsync | IOrdenCompraPresupuestoAppService | GET_LIST | `Task<ApiResponseDTO<PurchaseOrderBudget>>` | `int id` |
| GetAllTotalAsync | IOrdenCompraDetalleAppService | GET_LIST | `Task<ApiResponseDTO<List<object>>>` | `Guid ordenCompraId` |
| GetByIdAsync | IOrdenCompraDetalleAppService | GET_SINGLE | `Task<ApiResponseDTO<OrdenCompraDetalle>>` | `Guid id` |
| UpdateAsync | IOrdenCompraDetalleAppService | UPDATE | `Task<ApiResponseDTO<OrdenCompraDetalle>>` | `Guid id, OrdenCompraDetalle DTO` |
| AddAsync | IOrdenCompraDetalleAppService | CREATE | `Task<ApiResponseDTO<OrdenCompraDetalle>>` | `OrdenCompraDetalleDTO DTO` |
| GetListProductoToOrder | IOrdenCompraDetalleAppService | GET_LIST | `Task<ApiResponseDTO<ListProductoToOrderPage…` | `Guid ordenCompraId, PaginationCommonDTO pagination` |
| DeleteAsync | IOrdenCompraDetalleAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| ImporteTotal | ITotalesOrdenCompraDetallleService | OTHER | `decimal` | `List<OrdenCompraDetalle> data` |
| IvaTotal | ITotalesOrdenCompraDetallleService | OTHER | `decimal` | `List<OrdenCompraDetalle> data` |
| RetencionIvaTotal | ITotalesOrdenCompraDetallleService | OTHER | `decimal` | `List<OrdenCompraDetalle> data` |
| RetencionIsrTotal | ITotalesOrdenCompraDetallleService | OTHER | `decimal` | `List<OrdenCompraDetalle> data` |
| AddAsync | IOrdenCompraComprobantePagoAppService | CREATE | `Task<ApiResponseDTO<OrdenCompraComprobanteP…` | `Guid ordenCompraId, IFormFile file` |
| DeleteAsync | IOrdenCompraComprobantePagoAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetByIdAsync | IOrdenCompraDatosPagoAppService | GET_SINGLE | `Task<ApiResponseDTO<OrdenCompraDatosPagoDTO…` | `Guid id` |
| UpdateAsync | IOrdenCompraDatosPagoAppService | UPDATE | `Task<ApiResponseDTO<OrdenCompraDatosPago>>` | `Guid id, OrdenCompraDatosPagoAddOrEditDTO DTO` |
| GetByOrdenCompraIdAsync | IOrdenCompraStatusAppService | GET_LIST | `Task<ApiResponseDTO<OrdenCompraStatus>>` | `Guid ordenCompraId` |
| UpdateAsync | IOrdenCompraStatusAppService | UPDATE | `Task<ApiResponseDTO<OrdenCompraStatus>>` | `Guid id, OrdenCompraStatusUpdateDTO DTO` |
| AddInvoiceAsync | IOrdenCompraStatusAppService | CREATE | `Task<ApiResponseDTO<OrdenCompraFactura>>` | `Guid ordenCompraId, AddInvoiceDTO dto` |
| UpdateInvoiceFileAsync | IOrdenCompraStatusAppService | UPDATE | `Task<ApiResponseDTO<OrdenCompraFactura>>` | `Guid invoiceId, UpdateInvoiceFileDTO dto` |
| UpdateInvoiceTypeAsync | IOrdenCompraStatusAppService | UPDATE | `Task<ApiResponseDTO<bool>>` | `Guid invoiceId, string tipoComprobante` |
| DeleteInvoiceAsync | IOrdenCompraStatusAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid invoiceId` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/orden-compra/get-for-edit/{id:guid}` | `appService.GetAllAsync` | `SupplierLuxuryApp/Purchases/OrdenesCompra/EndPoints/OrdenCompraEndPoints.cs` |
| GET | `/api/orden-compra/list/{customerId:guid}/{estatus}/{tipoGasto}` | `appService.GetAllAsync` | `SupplierLuxuryApp/Purchases/OrdenesCompra/EndPoints/OrdenCompraEndPoints.cs` |
| GET | `/api/orden-compra/{id:guid}` | `appService.GetByIdAsync` | `SupplierLuxuryApp/Purchases/OrdenesCompra/EndPoints/OrdenCompraEndPoints.cs` |
| GET | `/api/orden-compra/pdf/{id:guid}` | - | `SupplierLuxuryApp/Purchases/OrdenesCompra/EndPoints/OrdenCompraEndPoints.cs` |
| GET | `/api/orden-compra/solicitud-pago/{id:guid}` | `appService.FondeoAsync` | `SupplierLuxuryApp/Purchases/OrdenesCompra/EndPoints/OrdenCompraEndPoints.cs` |
| POST | `/api/orden-compra/fondeo` | `appService.FondeoAsync` | `SupplierLuxuryApp/Purchases/OrdenesCompra/EndPoints/OrdenCompraEndPoints.cs` |
| GET | `/api/orden-compra/ordenes-compra-gastos-fijos/{customerId:guid}/{estatus}` | `appService.OrdenesCompraGastosFijosAsync` | `SupplierLuxuryApp/Purchases/OrdenesCompra/EndPoints/OrdenCompraEndPoints.cs` |
| GET | `/api/orden-compra/cotizaciones-relacionadas/{solicitudCompraId:guid}` | `appService.CotizacionesRelacionadasAsync` | `SupplierLuxuryApp/Purchases/OrdenesCompra/EndPoints/OrdenCompraEndPoints.cs` |
| POST | `/api/orden-compra/{providerId:guid}/{posicionCotizacion:int}/{solicitudCompraId?}` | `appService.AddAsync` | `SupplierLuxuryApp/Purchases/OrdenesCompra/EndPoints/OrdenCompraEndPoints.cs` |
| POST | `/api/orden-compra/progressive-create` | `appService.AddProgressiveAsync` | `SupplierLuxuryApp/Purchases/OrdenesCompra/EndPoints/OrdenCompraEndPoints.cs` |
| POST | `/api/orden-compra/fuera-fondeo` | `appService.AddFueraFondeoAsync` | `SupplierLuxuryApp/Purchases/OrdenesCompra/EndPoints/OrdenCompraEndPoints.cs` |
| DELETE | `/api/orden-compra/{ordenCompraId:guid}/fuera-fondeo` | `appService.RemoveFueraFondeoAsync` | `SupplierLuxuryApp/Purchases/OrdenesCompra/EndPoints/OrdenCompraEndPoints.cs` |
| PUT | `/api/orden-compra/{id:guid}` | `appService.UpdateAsync` | `SupplierLuxuryApp/Purchases/OrdenesCompra/EndPoints/OrdenCompraEndPoints.cs` |
| PUT | `/api/orden-compra/unlink-solicitud/{id:guid}` | `appService.DeleteAsync` | `SupplierLuxuryApp/Purchases/OrdenesCompra/EndPoints/OrdenCompraEndPoints.cs` |
| DELETE | `/api/orden-compra/{ordenCompraId:guid}` | `appService.DeleteAsync` | `SupplierLuxuryApp/Purchases/OrdenesCompra/EndPoints/OrdenCompraEndPoints.cs` |
| GET | `/api/orden-compra/orden-compra-pendientes-por-pagar/{customerId:guid}/{ordenCompraId:guid}` | `appService.OrdenCompraPendientesAsync` | `SupplierLuxuryApp/Purchases/OrdenesCompra/EndPoints/OrdenCompraEndPoints.cs` |
| GET | `/api/orden-compra/validar-ordenes-compra-mismo-folio-solicitu-compra/{ordenCompraId:guid}` | `appService.ValidarOrdenesCompraMismoFolioSolicituCompraAsync` | `SupplierLuxuryApp/Purchases/OrdenesCompra/EndPoints/OrdenCompraEndPoints.cs` |
| POST | `/api/orden-compra/generar-orden-compra-fijos/{customerId:guid}/{quincena}/{fundingYear:int}/{fundingPeriod:int}` | `appService.GenerarOrdenCompraFijosAsync` | `SupplierLuxuryApp/Purchases/OrdenesCompra/EndPoints/OrdenCompraEndPoints.cs` |
| GET | `/api/orden-compra/unlinked-orders/{customerId:guid}` | `appService.GetUnlinkedOrdersAsync` | `SupplierLuxuryApp/Purchases/OrdenesCompra/EndPoints/OrdenCompraEndPoints.cs` |
| PUT | `/api/orden-compra/link-to-request/{ordenCompraId:guid}/{solicitudCompraId:guid}` | `appService.LinkOrderToRequestAsync` | `SupplierLuxuryApp/Purchases/OrdenesCompra/EndPoints/OrdenCompraEndPoints.cs` |
| GET | `/api/orden-compra/link-manager-list/{customerId:guid}` | `appService.GetForLinkManagerAsync` | `SupplierLuxuryApp/Purchases/OrdenesCompra/EndPoints/OrdenCompraEndPoints.cs` |
| GET | `/api/orden-compra-auth/desautorizar/{ordenCompraId:guid}` | `appService.DesautorizarAsync` | `SupplierLuxuryApp/Purchases/PurchaseOrderAuth/EndPoints/OrdenCompraAuthEndPoints.cs` |
| GET | `/api/orden-compra-auth/autorizar/{ordenCompraId:guid}/{applicationUserId}` | `appService.AutorizarAsync` | `SupplierLuxuryApp/Purchases/PurchaseOrderAuth/EndPoints/OrdenCompraAuthEndPoints.cs` |
| PUT | `/api/orden-compra-auth/no-autorizada/{ordenCompraAuthId:guid}/{applicationUserId}` | `appService.NoAutorizadaAsync` | `SupplierLuxuryApp/Purchases/PurchaseOrderAuth/EndPoints/OrdenCompraAuthEndPoints.cs` |
| GET | `/api/orden-compra-presupuesto/{id:guid}` | `appService.GetByIdAsync` | `SupplierLuxuryApp/Purchases/PurchaseOrderBudgets/EndPoints/OrdenCompraPresupuestoEndPoints.cs` |
| GET | `/api/orden-compra-presupuesto/get-all-for-orden-compra-total/{ordenCompraId:guid}` | `appService.GetAllForPurchaseOrderBudgetTotalAsync` | `SupplierLuxuryApp/Purchases/PurchaseOrderBudgets/EndPoints/OrdenCompraPresupuestoEndPoints.cs` |
| GET | `/api/orden-compra-presupuesto/by-orden-compra/{ordenCompraId:guid}` | `appService.GetAllForOrdenCompraAsync` | `SupplierLuxuryApp/Purchases/PurchaseOrderBudgets/EndPoints/OrdenCompraPresupuestoEndPoints.cs` |
| POST | `/api/orden-compra-presupuesto` | `appService.AddAsync` | `SupplierLuxuryApp/Purchases/PurchaseOrderBudgets/EndPoints/OrdenCompraPresupuestoEndPoints.cs` |
| PUT | `/api/orden-compra-presupuesto/{id:guid}` | `appService.UpdateAsync` | `SupplierLuxuryApp/Purchases/PurchaseOrderBudgets/EndPoints/OrdenCompraPresupuestoEndPoints.cs` |
| DELETE | `/api/orden-compra-presupuesto/{id:guid}` | `appService.DeleteAsync` | `SupplierLuxuryApp/Purchases/PurchaseOrderBudgets/EndPoints/OrdenCompraPresupuestoEndPoints.cs` |
| GET | `/api/orden-compra-presupuesto/edit/{id}` | `appService.GetByIdForEditAsync` | `SupplierLuxuryApp/Purchases/PurchaseOrderBudgets/EndPoints/OrdenCompraPresupuestoEndPoints.cs` |
| GET | `/api/orden-compra-presupuesto/total/{ordenCompraId:guid}` | `appService.GetAllForPurchaseOrderBudgetTotalAsync` | `SupplierLuxuryApp/Purchases/PurchaseOrderBudgets/EndPoints/OrdenCompraPresupuestoEndPoints.cs` |
| GET | `/api/orden-compra-detalle/get-all-total/{ordenCompraId:guid}` | `appService.GetAllTotalAsync` | `SupplierLuxuryApp/Purchases/PurchaseOrderDetail/EndPoints/OrdenCompraDetalleEndPoints.cs` |
| GET | `/api/orden-compra-detalle/{id:guid}` | `appService.GetByIdAsync` | `SupplierLuxuryApp/Purchases/PurchaseOrderDetail/EndPoints/OrdenCompraDetalleEndPoints.cs` |
| PUT | `/api/orden-compra-detalle/{id:guid}` | `appService.UpdateAsync` | `SupplierLuxuryApp/Purchases/PurchaseOrderDetail/EndPoints/OrdenCompraDetalleEndPoints.cs` |
| POST | `/api/orden-compra-detalle` | `appService.AddAsync` | `SupplierLuxuryApp/Purchases/PurchaseOrderDetail/EndPoints/OrdenCompraDetalleEndPoints.cs` |
| GET | `/api/orden-compra-detalle/add-producto-to-order/{ordenCompraId:guid}` | `appService.DeleteAsync` | `SupplierLuxuryApp/Purchases/PurchaseOrderDetail/EndPoints/OrdenCompraDetalleEndPoints.cs` |
| DELETE | `/api/orden-compra-detalle/{id:guid}` | `appService.DeleteAsync` | `SupplierLuxuryApp/Purchases/PurchaseOrderDetail/EndPoints/OrdenCompraDetalleEndPoints.cs` |
| POST | `/api/orden-compra-comprobante-pago/{ordenCompraId:guid}` | `appService.AddAsync` | `SupplierLuxuryApp/Purchases/PurchaseOrderPayment/EndPoints/OrdenCompraComprobantePagoEndPoints.cs` |
| DELETE | `/api/orden-compra-comprobante-pago/{id:guid}` | `appService.DeleteAsync` | `SupplierLuxuryApp/Purchases/PurchaseOrderPayment/EndPoints/OrdenCompraComprobantePagoEndPoints.cs` |
| GET | `/api/orden-compra-datos-pago/{id:guid}` | `appService.GetByIdAsync` | `SupplierLuxuryApp/Purchases/PurchaseOrderPayment/EndPoints/OrdenCompraDatosPagoEndPoints.cs` |
| PUT | `/api/orden-compra-datos-pago/{id:guid}` | `appService.UpdateAsync` | `SupplierLuxuryApp/Purchases/PurchaseOrderPayment/EndPoints/OrdenCompraDatosPagoEndPoints.cs` |
| GET | `/api/orden-compra-status/by-orden-compra/{ordenCompraId:guid}` | `appService.GetByOrdenCompraIdAsync` | `SupplierLuxuryApp/Purchases/PurchaseOrderStatus/EndPoints/OrdenCompraStatusEndPoints.cs` |
| PUT | `/api/orden-compra-status/{id:guid}` | `appService.UpdateAsync` | `SupplierLuxuryApp/Purchases/PurchaseOrderStatus/EndPoints/OrdenCompraStatusEndPoints.cs` |
| POST | `/api/orden-compra-status/{ordenCompraId:guid}/invoices` | `appService.AddInvoiceAsync` | `SupplierLuxuryApp/Purchases/PurchaseOrderStatus/EndPoints/OrdenCompraStatusEndPoints.cs` |
| PUT | `/api/orden-compra-status/invoices/{invoiceId:guid}` | `appService.UpdateInvoiceFileAsync` | `SupplierLuxuryApp/Purchases/PurchaseOrderStatus/EndPoints/OrdenCompraStatusEndPoints.cs` |
| PATCH | `/api/orden-compra-status/invoices/{invoiceId:guid}/type` | `appService.UpdateInvoiceTypeAsync` | `SupplierLuxuryApp/Purchases/PurchaseOrderStatus/EndPoints/OrdenCompraStatusEndPoints.cs` |
| DELETE | `/api/orden-compra-status/invoices/{invoiceId:guid}` | `appService.DeleteInvoiceAsync` | `SupplierLuxuryApp/Purchases/PurchaseOrderStatus/EndPoints/OrdenCompraStatusEndPoints.cs` |


### Grupo: SystemLuxuryApp

#### Modulo: Approvals

- Interfaces: 0 | Servicios: 0 | Endpoints: 0 | DTOs: 0

#### Modulo: Common

- Interfaces: 0 | Servicios: 0 | Endpoints: 0 | DTOs: 0

#### Modulo: ConfiguracionSistema

- Interfaces: 3 | Servicios: 3 | Endpoints: 10 | DTOs: 3

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IAuditEntryAppService | 1 | `SystemLuxuryApp/ConfiguracionSistema/AuditEntries/Interfaces/IAuditEntryAppService.cs` |
| IDatabaseBackupService | 9 | `SystemLuxuryApp/ConfiguracionSistema/DatabaseBackup/Interfaces/IDatabaseBackupService.cs` |
| IOneDriveGraphService | 3 | `SystemLuxuryApp/ConfiguracionSistema/DatabaseBackup/Interfaces/IOneDriveGraphService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| AuditEntryAppService | 1 | `SystemLuxuryApp/ConfiguracionSistema/AuditEntries/Services/AuditEntryAppService.cs` |
| DatabaseBackupService | 9 | `SystemLuxuryApp/ConfiguracionSistema/DatabaseBackup/Services/DatabaseBackupService.cs` |
| OneDriveGraphService | 3 | `SystemLuxuryApp/ConfiguracionSistema/DatabaseBackup/Services/OneDriveGraphService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetHistoryAsync | IAuditEntryAppService | GET_LIST | `Task<ApiResponseDTO<PagedResultDTO<AuditEnt…` | `PaginationCommonDTO pagination, string entityName, string o…` |
| GetConfigsAsync | IDatabaseBackupService | GET_LIST | `Task<ApiResponseDTO<List<DatabaseBackupConf…` | `-` |
| GetConfigAsync | IDatabaseBackupService | GET_LIST | `Task<ApiResponseDTO<DatabaseBackupConfigDTO…` | `Guid id` |
| CreateConfigAsync | IDatabaseBackupService | CREATE | `Task<ApiResponseDTO<DatabaseBackupConfigDTO…` | `CreateDatabaseBackupConfigDTO dto` |
| UpdateConfigAsync | IDatabaseBackupService | UPDATE | `Task<ApiResponseDTO<DatabaseBackupConfigDTO…` | `Guid id, UpdateDatabaseBackupConfigDTO dto` |
| DeleteConfigAsync | IDatabaseBackupService | DELETE | `Task<ApiResponseDTO<object>>` | `Guid id` |
| ExecuteBackupNowAsync | IDatabaseBackupService | SPECIAL | `Task<ApiResponseDTO<object>>` | `Guid configId` |
| GetAvailableDatabasesAsync | IDatabaseBackupService | GET_LIST | `Task<ApiResponseDTO<List<string>>>` | `-` |
| GetBackupHistoryAsync | IDatabaseBackupService | GET_LIST | `Task<ApiResponseDTO<List<DatabaseBackupSumm…` | `Guid configId` |
| TestOneDriveConnectionAsync | IDatabaseBackupService | OTHER | `Task<ApiResponseDTO<object>>` | `Guid configId` |
| UploadFileAsync | IOneDriveGraphService | SPECIAL | `Task<string>` | `string fileName, Stream content, string folderPath, string …` |
| DeleteOldFilesAsync | IOneDriveGraphService | DELETE | `Task` | `string folderPath, int retentionDays, string userEmail, str…` |
| TestConnectionAsync | IOneDriveGraphService | OTHER | `Task<bool>` | `string userEmail, string tenantId, string clientId, string …` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/audit-entries` | `appService.GetHistoryAsync` | `SystemLuxuryApp/ConfiguracionSistema/AuditEntries/EndPoints/AuditEntriesEndPoints.cs` |
| GET | `/api/admin/database-backup/configs` | `service.GetConfigsAsync` | `SystemLuxuryApp/ConfiguracionSistema/DatabaseBackup/EndPoints/DatabaseBackupEndpoints.cs` |
| GET | `/api/admin/database-backup/configs/{id:guid}` | `service.GetConfigAsync` | `SystemLuxuryApp/ConfiguracionSistema/DatabaseBackup/EndPoints/DatabaseBackupEndpoints.cs` |
| POST | `/api/admin/database-backup/configs` | `service.CreateConfigAsync` | `SystemLuxuryApp/ConfiguracionSistema/DatabaseBackup/EndPoints/DatabaseBackupEndpoints.cs` |
| PUT | `/api/admin/database-backup/configs/{id:guid}` | `service.UpdateConfigAsync` | `SystemLuxuryApp/ConfiguracionSistema/DatabaseBackup/EndPoints/DatabaseBackupEndpoints.cs` |
| DELETE | `/api/admin/database-backup/configs/{id:guid}` | `service.DeleteConfigAsync` | `SystemLuxuryApp/ConfiguracionSistema/DatabaseBackup/EndPoints/DatabaseBackupEndpoints.cs` |
| POST | `/api/admin/database-backup/configs/{id:guid}/execute` | `service.ExecuteBackupNowAsync` | `SystemLuxuryApp/ConfiguracionSistema/DatabaseBackup/EndPoints/DatabaseBackupEndpoints.cs` |
| GET | `/api/admin/database-backup/databases` | `service.GetAvailableDatabasesAsync` | `SystemLuxuryApp/ConfiguracionSistema/DatabaseBackup/EndPoints/DatabaseBackupEndpoints.cs` |
| GET | `/api/admin/database-backup/history/{configId:guid}` | `service.GetBackupHistoryAsync` | `SystemLuxuryApp/ConfiguracionSistema/DatabaseBackup/EndPoints/DatabaseBackupEndpoints.cs` |
| POST | `/api/admin/database-backup/configs/{id:guid}/test-connection` | `service.TestOneDriveConnectionAsync` | `SystemLuxuryApp/ConfiguracionSistema/DatabaseBackup/EndPoints/DatabaseBackupEndpoints.cs` |

#### Modulo: Diagnostics

- Interfaces: 0 | Servicios: 0 | Endpoints: 1 | DTOs: 0

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/system/environment-info` | - | `SystemLuxuryApp/Diagnostics/EndPoints/DiagnosticsEndPoints.cs` |

#### Modulo: Persistence

- Interfaces: 0 | Servicios: 0 | Endpoints: 0 | DTOs: 0

#### Modulo: SelectItem

- Interfaces: 1 | Servicios: 1 | Endpoints: 75 | DTOs: 0

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| ISelectItemAppService | 73 | `SystemLuxuryApp/SelectItem/Interfaces/ISelectItemAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| SelectItemAppService | 45 | `SystemLuxuryApp/SelectItem/Services/SelectItemAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetRolesForAnnouncementsAsync | ISelectItemAppService | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<stri…` | `-` |
| SelectItemLegalMatterCategoryAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<Guid…` | `-` |
| SelectItemSelectForAddTicketAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<stri…` | `-` |
| FundingPeriodAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<stri…` | `Guid customerId` |
| SelectItemLegalMatterAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<Guid…` | `-` |
| SelectItemAddCuentaCedulaPresupuestalAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<Guid…` | `Guid customerId` |
| SelectItemParticipantAdministrationAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<MeetingParticipant…` | `Guid customerId` |
| SelectItemInstalacionesAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<Guid…` | `Guid customerId` |
| SelectItemSupervisionAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<LabelDTO>>>` | `-` |
| SelectItemResidentesEdificioAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<ResidentesEdificio…` | `Guid customerId` |
| SelectItemRolesAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<stri…` | `-` |
| SelectItemRolForDocumentAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<stri…` | `-` |
| SelectItemAccountForCustomerAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<Guid…` | `Guid customerId` |
| SelectItemPropertyAccountsAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<stri…` | `Guid customerId, int year` |
| SelectItemAdministracionMinutaAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<stri…` | `Guid customerId, Guid meetingId` |
| SelectItemAnioOrdenServiceAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<int>…` | `Guid customerId` |
| SelectItemBankAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<Guid…` | `-` |
| SelectItemCategoriesAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<Guid…` | `-` |
| SelectItemComiteMinutaAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<stri…` | `Guid customerId, Guid meetingId` |
| SelectItemCustomersActiveAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<Guid…` | `-` |
| SelectItemCustomersActiveNameShortAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<Guid…` | `-` |
| SelectItemCustomersInactiveAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<Guid…` | `-` |
| SelectItemCustomersAllAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<Guid…` | `-` |
| SelectItemCustomersAccesoAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<Guid…` | `string applicationUserId` |
| SelectItemPropertyAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<Guid…` | `Guid customerId` |
| SelectItemPersonAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<stri…` | `Guid customerId` |
| SelectItemEmployeeAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<Guid…` | `Guid customerId` |
| SelectItemPersonEmployeeAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<stri…` | `Guid customerId` |
| SelectItemEmployeeActiveAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<Guid…` | `Guid customerId` |
| SelectItemEmployeeByUserIdAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<stri…` | `Guid customerId` |
| SelectItemEmployeesActiveAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<stri…` | `-` |
| SelectItemEmployeesActiveAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<stri…` | `Guid customerId` |
| SelectItemEquipoCalendarioMaestroAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<Guid…` | `-` |
| SelectItemOwnerAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<Guid…` | `Guid customerId` |
| SelectItemMachineriesGetAllAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<Guid…` | `Guid customerId` |
| SelectItemMachineriesActiveAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<Guid…` | `Guid customerId` |
| SelectItemMeasurementUnitsAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<Guid…` | `-` |
| SelectItemMedidorCategoriaAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<Guid…` | `-` |
| SelectItemNombreCortoAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<Guid…` | `-` |
| SelectItemPaymentMethodAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<Guid…` | `-` |
| SelectItemProductsAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<Guid…` | `-` |
| SelectRichItemProductsAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<Guid…` | `string term` |
| SelectItemProfessionsAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<stri…` | `-` |
| SelectItemProvidersAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<Guid…` | `Guid customerId` |
| SelectItemResponsableSistemasAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<stri…` | `-` |
| SelectItemToolAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<Guid…` | `Guid customerId` |
| SelectItemUseCFDIAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<Guid…` | `-` |
| SelectItemWayToPayAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<Guid…` | `-` |
| SelectItemAspelCustomerEmpresaAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<Guid…` | `-` |
| UserFromCustomerAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<UserCustomerDTO>>>` | `Guid customerId` |
| SelectItemApplicationUserProviderAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<stri…` | `-` |
| SelectItemApplicationUserAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<stri…` | `-` |
| ApplicationUserForCustomerIdAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<stri…` | `Guid customerId` |
| SelectItemInspectionReviewsCatalogAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<Guid…` | `-` |
| SelectItemModuleAppAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<Guid…` | `-` |
| SelectItemTaskGroupCategoryAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<Guid…` | `Guid customerId, Guid? workGroupId = null` |
| SelectItemTicketGroupListAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<Guid…` | `Guid customerId` |
| SelectItemCustomerInspectionsAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<Guid…` | `Guid customerId` |
| SelectItemEvaluationTemplateAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<Guid…` | `Guid customerId` |
| SelectItemAlmacenesAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<Guid…` | `Guid customerId` |
| SelectItemEquipoClasificacionAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<Guid…` | `-` |
| SelectItemApplicationRolesAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<stri…` | `-` |
| SelectItemRolesByRoleTypeAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<stri…` | `RoleType roleType` |
| SelectItemApplicationRolesToAdministratorAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<stri…` | `-` |
| SelectItemApplicationRolesToProviderAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<stri…` | `-` |
| SelectItemRequestPositionsPendingAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<Guid…` | `-` |
| SelectItemVacantesAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<Guid…` | `Guid customerId` |
| SelectItemCandidatesAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<CandidateSelectIte…` | `-` |
| SelectItemRecruitmentSourcesAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<Guid…` | `-` |
| SelectItemDocumentCatalogAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<DocumentCatalogSel…` | `-` |
| SelectItemOnboardingChecklistOptionsAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<Guid…` | `-` |
| SelectItemOperationsInterviewersByCustomerAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<stri…` | `Guid customerId` |
| SelectItemOperationsInterviewersByRequestPositionAsync | ISelectItemAppService | OTHER | `Task<ApiResponseDTO<List<SelectItemDTO<stri…` | `Guid requestPositionId` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/select-items/accounts-for-customer/{customerId:guid}` | `s.SelectItemAccountForCustomerAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/accounting-catalogs/{customerId:guid}` | `s.SelectItemAddCuentaCedulaPresupuestalAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/administration-minutes/{customerId:guid}/{meetingId:guid}` | `s.SelectItemAdministracionMinutaAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/almacenes/{customerId:guid}` | `s.SelectItemAlmacenesAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/application-roles` | `s.SelectItemApplicationRolesAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/application-roles-to-administrator` | `s.SelectItemApplicationRolesToAdministratorAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/application-roles-to-provider` | `s.SelectItemApplicationRolesToProviderAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/application-user-providers` | `s.SelectItemApplicationUserProviderAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/application-users` | `s.SelectItemApplicationUserAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/application-users/{customerId:guid}` | `s.ApplicationUserForCustomerIdAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/banks` | `s.SelectItemBankAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/boolean-options` | `s.SelectItemResidentesEdificioAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/building-residents/{customerId:guid}` | `s.SelectItemResidentesEdificioAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/residentes-edificio/{customerId:guid}` | `s.SelectItemResidentesEdificioAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/categories` | `s.SelectItemCategoriesAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/candidates` | `s.SelectItemCandidatesAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/recruitment-sources` | `s.SelectItemRecruitmentSourcesAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/document-catalog` | `s.SelectItemDocumentCatalogAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/cfdi-uses` | `s.SelectItemUseCFDIAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/committee-minutes/{customerId:guid}/{meetingId:guid}` | `s.SelectItemComiteMinutaAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/customer-inspections/{customerId:guid}` | `s.SelectItemCustomerInspectionsAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/customers-access/{applicationUserId}` | `s.SelectItemCustomersAccesoAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/customers-active` | `s.SelectItemCustomersActiveAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/customers-active-short-name` | `s.SelectItemCustomersActiveNameShortAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/customers-all` | `s.SelectItemCustomersAllAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/customers-inactive` | `s.SelectItemCustomersInactiveAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/employees-active` | `s.SelectItemEmployeesActiveAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/employees-active/{customerId:guid}` | `s.SelectItemEmployeesActiveAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/employees-by-user-id/{customerId:guid}` | `s.SelectItemEmployeeByUserIdAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/employees/{customerId:guid}` | `s.SelectItemEmployeeAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/equipment-classifications` | `s.SelectItemEquipoClasificacionAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/equipo-calendario-maestro` | `s.SelectItemEquipoCalendarioMaestroAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/evaluation-templates/{customerId:guid}` | `s.SelectItemEvaluationTemplateAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/funding-period/{customerId:guid}` | `s.FundingPeriodAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/inspection-review-catalogs` | `s.SelectItemInspectionReviewsCatalogAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/legal-matter-categories` | `s.SelectItemLegalMatterCategoryAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/legal-matters` | `s.SelectItemLegalMatterAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/listado-instalaciones/{customerId:guid}` | `s.SelectItemInstalacionesAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/machineries-active/{customerId:guid}` | `s.SelectItemMachineriesActiveAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/machineries-all/{customerId:guid}` | `s.SelectItemMachineriesGetAllAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/measurement-units` | `s.SelectItemMeasurementUnitsAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/operations-interviewers/{customerId:guid}` | `s.SelectItemOperationsInterviewersByCustomerAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/operations-interviewers/by-request-position/{requestPositionId:guid}` | `s.SelectItemOperationsInterviewersByRequestPositionAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/medidor-categoria` | `s.SelectItemMedidorCategoriaAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/module-apps` | `s.SelectItemModuleAppAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/nombre-corto` | `s.SelectItemNombreCortoAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/onboarding-checklist-options` | `s.SelectItemOnboardingChecklistOptionsAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/owners/{customerId:guid}` | `s.SelectItemOwnerAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/participant-administration/{customerId:guid}` | `s.SelectItemParticipantAdministrationAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/payment-methods` | `s.SelectItemPaymentMethodAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/payment-ways` | `s.SelectItemWayToPayAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/people/{customerId:guid}` | `s.SelectItemPersonAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/people-employees/{customerId:guid}` | `s.SelectItemPersonEmployeeAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/products` | `s.SelectItemProductsAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/professions` | `s.SelectItemProfessionsAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/properties/{customerId:guid}` | `s.SelectItemPropertyAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/property-accounts/{customerId:guid}/{year:int}` | `s.SelectItemPropertyAccountsAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/property-members/{customerId:guid}` | `s.SelectItemOwnerAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/request-positions-pending` | `s.SelectItemRequestPositionsPendingAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/vacantes/{customerId:guid}` | `s.SelectItemVacantesAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/providers/{customerId:guid}` | `s.SelectItemProvidersAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/responsable-sistemas` | `s.SelectItemResponsableSistemasAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/rich-products` | `s.SelectRichItemProductsAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/roles` | `s.SelectItemRolesAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/roles-by-role-type/{roleType}` | `s.SelectItemRolesByRoleTypeAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/roles-for-announcements` | `s.GetRolesForAnnouncementsAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/roles-for-document` | `s.SelectItemRolForDocumentAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/select-for-add-ticket` | `s.SelectItemSelectForAddTicketAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/service-year/{customerId:guid}` | `s.SelectItemAnioOrdenServiceAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/supervision-list` | `s.SelectItemSupervisionAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/task-group-category/{customerId:guid}` | `s.SelectItemTaskGroupCategoryAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/task-group-list/{customerId:guid}` | `s.SelectItemTicketGroupListAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/tools/{customerId:guid}` | `s.SelectItemToolAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/users-from-customer/{customerId:guid}` | `s.UserFromCustomerAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |
| GET | `/api/select-items/aspel-customer-empresa` | `s.SelectItemAspelCustomerEmpresaAsync` | `SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |

#### Modulo: SendEmailGlobal

- Interfaces: 14 | Servicios: 10 | Endpoints: 7 | DTOs: 27

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IAppImplementationEmailService | 1 | `SystemLuxuryApp/SendEmailGlobal/AppImplementationTracking/SendEmail/Interfaces/IAppImplementationEmailService.cs` |
| IMeetingEmailService | 1 | `SystemLuxuryApp/SendEmailGlobal/CommitteeMeeting/SendEmail/Interfaces/IMeetingEmailService.cs` |
| IEmailMessageAppService | 2 | `SystemLuxuryApp/SendEmailGlobal/Core/Interfaces/IEmailMessageAppService.cs` |
| ISendEmailAppService | 8 | `SystemLuxuryApp/SendEmailGlobal/Core/Interfaces/ISendEmailAppService.cs` |
| IFundingNotificationOrchestrator | 7 | `SystemLuxuryApp/SendEmailGlobal/Funding/Interfaces/IFundingNotificationInterfaces.cs` |
| IBudgetProposalRealTimeService | 1 | `SystemLuxuryApp/SendEmailGlobal/PresupuestoPropuesta/Interfaces/IBudgetProposalRealTimeService.cs` |
| IProjectedExpenseRealTimeService | 1 | `SystemLuxuryApp/SendEmailGlobal/ProjectedExpenses/Interfaces/IProjectedExpenseRealTimeService.cs` |
| IRecruitmentEmailService | 11 | `SystemLuxuryApp/SendEmailGlobal/Recruitment/SendEmail/Interfaces/IRecruitmentEmailService.cs` |
| IHrEmailService | 2 | `SystemLuxuryApp/SendEmailGlobal/RecursosHumanos/SendEmail/Interfaces/IHrNotificationInterfaces.cs` |
| IHrPushService | 1 | `SystemLuxuryApp/SendEmailGlobal/RecursosHumanos/SendEmail/Interfaces/IHrNotificationInterfaces.cs` |
| IHrRealTimeService | 1 | `SystemLuxuryApp/SendEmailGlobal/RecursosHumanos/SendEmail/Interfaces/IHrNotificationInterfaces.cs` |
| IScheduledTaskEmailService | 5 | `SystemLuxuryApp/SendEmailGlobal/ScheduledTasks/SendEmail/Interfaces/IScheduledTaskEmailService.cs` |
| ITaskWorkPlanEmailService | 1 | `SystemLuxuryApp/SendEmailGlobal/Tasks/SendEmail/Interfaces/ITaskWorkPlanEmailService.cs` |
| ITaskLegalWhatsAppService | 2 | `SystemLuxuryApp/SendEmailGlobal/Tasks/SendWhatsApp/Interfaces/ITaskLegalWhatsAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| AppImplementationEmailService | 1 | `SystemLuxuryApp/SendEmailGlobal/AppImplementationTracking/SendEmail/Services/AppImplementationEmailService.cs` |
| EmailMessageAppService | 2 | `SystemLuxuryApp/SendEmailGlobal/Core/Services/EmailMessageAppService.cs` |
| SendEmailAppService | 8 | `SystemLuxuryApp/SendEmailGlobal/Core/Services/SendEmailAppService.cs` |
| EmailTemplateValidator | 1 | `SystemLuxuryApp/SendEmailGlobal/EmailTemplateValidator.cs` |
| BudgetProposalRealTimeService | 1 | `SystemLuxuryApp/SendEmailGlobal/PresupuestoPropuesta/Services/BudgetProposalRealTimeService.cs` |
| ProjectedExpenseRealTimeService | 1 | `SystemLuxuryApp/SendEmailGlobal/ProjectedExpenses/Services/ProjectedExpenseRealTimeService.cs` |
| RecruitmentEmailService | 11 | `SystemLuxuryApp/SendEmailGlobal/Recruitment/SendEmail/Services/RecruitmentEmailService.cs` |
| ScheduledTaskEmailService | 5 | `SystemLuxuryApp/SendEmailGlobal/ScheduledTasks/SendEmail/Services/ScheduledTaskEmailService.cs` |
| TaskWorkPlanEmailService | 1 | `SystemLuxuryApp/SendEmailGlobal/Tasks/SendEmail/Services/TaskWorkPlanEmailService.cs` |
| TaskLegalWhatsAppService | 2 | `SystemLuxuryApp/SendEmailGlobal/Tasks/SendWhatsApp/Services/TaskLegalWhatsAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| SendMissingEmployeeDataReportAsync | IAppImplementationEmailService | SPECIAL | `Task` | `EmployeeMissingDataEmailDTO dto` |
| SendPendingItemsAsync | IMeetingEmailService | SPECIAL | `Task` | `MeetingPendingItemsEmailDTO dto, string subject` |
| SendReportPendingTicketGroupAsync | IEmailMessageAppService | SPECIAL | `Task` | `Guid ticketGroupId` |
| SendEmailMesageRequestAsync | IEmailMessageAppService | SPECIAL | `Task` | `Guid ticketMessageId, string url` |
| SendTestMailAsync | ISendEmailAppService | SPECIAL | `Task<ApiResponseDTO<SendTestMailResultDTO>>` | `Guid id` |
| TestEmailAsync | ISendEmailAppService | OTHER | `Task<ApiResponseDTO<string>>` | `Guid id` |
| OperationReportAsync | ISendEmailAppService | OTHER | `Task<ApiResponseDTO<bool>>` | `string applicationUserId, Guid customerId, int year, int nu…` |
| SendMeetingAsync | ISendEmailAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid meetingId` |
| EstadosFinancierosCondominosAsync | ISendEmailAppService | OTHER | `Task<ApiResponseDTO<bool>>` | `Guid id, List<DestinatariosEmailReporteDTO> destinatarios` |
| PresentacionFinalComiteAsync | ISendEmailAppService | OTHER | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| TestSendEmail | ISendEmailAppService | OTHER | `Task<ApiResponseDTO<string>>` | `string email` |
| SendExecutivePendingReportAsync | ISendEmailAppService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `Guid customerId` |
| NotifyFundingValidatedAsync | IFundingNotificationOrchestrator | SPECIAL | `Task` | `Guid fundingId, string period, string userName, List<string…` |
| NotifyFundingAuthorizedAsync | IFundingNotificationOrchestrator | SPECIAL | `Task` | `Guid fundingId, string period, string userName, List<string…` |
| NotifyFundingRevokedAsync | IFundingNotificationOrchestrator | SPECIAL | `Task` | `Guid fundingId, string period, string userName, List<string…` |
| NotifyFundingConfirmedAsync | IFundingNotificationOrchestrator | SPECIAL | `Task` | `Guid fundingId, string period, string userName, List<string…` |
| NotifyFundingRevokeConfirmationAsync | IFundingNotificationOrchestrator | SPECIAL | `Task` | `Guid fundingId, string period, string userName, List<string…` |
| NotifyFundingCompletedAsync | IFundingNotificationOrchestrator | SPECIAL | `Task` | `Guid fundingId, string period, string userName, List<string…` |
| NotifyFundingRevertedAsync | IFundingNotificationOrchestrator | SPECIAL | `Task` | `Guid fundingId, string period, string userName, List<string…` |
| SendUpdateAsync | IBudgetProposalRealTimeService | SPECIAL | `Task` | `BudgetProposalItemDTO dto, Guid customerId, int fiscalYear,…` |
| SendUpdateAsync | IProjectedExpenseRealTimeService | SPECIAL | `Task` | `ProjectedExpenseUpdateDTO dto, string excludedConnectionId` |
| SendSolicitudAltaEmailAsync | IRecruitmentEmailService | SPECIAL | `Task` | `RecruitmentSolicitudAltaEmailDTO dto, Guid customerId, Appl…` |
| SendAltaSistemasEmailAsync | IRecruitmentEmailService | SPECIAL | `Task` | `RecruitmentAltaSistemasEmailDTO dto, string subject` |
| SendSolicitudBajaEmailAsync | IRecruitmentEmailService | SPECIAL | `Task` | `RecruitmentSolicitudBajaEmailDTO dto, Guid customerId, stri…` |
| SendSolicitudVacanteEmailAsync | IRecruitmentEmailService | SPECIAL | `Task` | `RecruitmentSolicitudVacanteEmailDTO dto, string subject` |
| SendCandidateApplicationCreatedEmailAsync | IRecruitmentEmailService | SPECIAL | `Task` | `RecruitmentCandidateApplicationCreatedEmailDTO dto, List<st…` |
| SendCandidateSentToInterviewEmailAsync | IRecruitmentEmailService | SPECIAL | `Task` | `RecruitmentCandidateSentToInterviewEmailDTO dto, List<strin…` |
| SendCandidateReceptionConfirmedEmailAsync | IRecruitmentEmailService | SPECIAL | `Task` | `RecruitmentCandidateReceptionConfirmedEmailDTO dto, List<st…` |
| SendCandidateInterviewDecisionEmailAsync | IRecruitmentEmailService | SPECIAL | `Task` | `RecruitmentCandidateInterviewDecisionEmailDTO dto, List<str…` |
| SendCandidateInterviewTrackingEmailAsync | IRecruitmentEmailService | SPECIAL | `Task` | `RecruitmentCandidateSentToInterviewEmailDTO dto, List<strin…` |
| SendCredencialesAccesoEmailAsync | IRecruitmentEmailService | SPECIAL | `Task` | `string nombre, string usuario, string passwordTemporal, str…` |
| SendModificacionSalarioEmailAsync | IRecruitmentEmailService | SPECIAL | `Task` | `RecruitmentModificacionSalarioEmailDTO dto, string subject` |
| SendGenericEmailAsync | IHrEmailService | SPECIAL | `Task` | `string to, HrGenericNotificationDTO dto` |
| SendVacationExpiringReminderAsync | IHrEmailService | SPECIAL | `Task` | `VacationExpiringReminderEmailDTO dto` |
| SendPushNotificationAsync | IHrPushService | SPECIAL | `Task` | `string userId, string title, string message, string url = n…` |
| SendNotifyUserAsync | IHrRealTimeService | SPECIAL | `Task` | `string userId, string message` |
| SendPendingTicketGroupReportAsync | IScheduledTaskEmailService | SPECIAL | `Task` | `TaskNotificationEmailDTO dto` |
| SendVacanciesReportAsync | IScheduledTaskEmailService | SPECIAL | `Task` | `List<SolicitudesVacanteListDTO> vacancies, string reportDate` |
| SendContractsPoliciesExpirationAsync | IScheduledTaskEmailService | SPECIAL | `Task` | `string customerName, List<ContractPolicyInfo> contracts, Li…` |
| SendLegalReportAsync | IScheduledTaskEmailService | SPECIAL | `Task` | `bool isInternal, List<LegalPendingTaskEmailItemDTO> tasks, …` |
| SendLegalTicketReportToCustomerAsync | IScheduledTaskEmailService | SPECIAL | `Task` | `string customerName, List<LegalPendingTaskEmailItemDTO> tas…` |
| SendWeeklyWorkPlanAsync | ITaskWorkPlanEmailService | SPECIAL | `Task` | `TaskWorkPlanEmailDTO dto, string subject` |
| NotifyNewTicketAsync | ITaskLegalWhatsAppService | SPECIAL | `Task` | `string title, string folio, string customerName, string req…` |
| NotifyStatusUpdateAsync | ITaskLegalWhatsAppService | SPECIAL | `Task` | `string folio, string title, string customerName, string sta…` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| POST | `/api/send-email/send-test-mail/{id:guid}` | `sendEmailAppService.SendTestMailAsync` | `SystemLuxuryApp/SendEmailGlobal/Core/EndPoints/SendEmailEndPoints.cs` |
| POST | `/api/send-email/test-email/{id:guid}` | `sendEmailAppService.TestEmailAsync` | `SystemLuxuryApp/SendEmailGlobal/Core/EndPoints/SendEmailEndPoints.cs` |
| POST | `/api/send-email/operation-report/{applicationUserId}/{customerId:guid}/{year:int}/{numeroSemana:int}` | `sendEmailAppService.OperationReportAsync` | `SystemLuxuryApp/SendEmailGlobal/Core/EndPoints/SendEmailEndPoints.cs` |
| POST | `/api/send-email/meeting/{meetingId:guid}` | `sendEmailAppService.SendMeetingAsync` | `SystemLuxuryApp/SendEmailGlobal/Core/EndPoints/SendEmailEndPoints.cs` |
| POST | `/api/send-email/estados-financieros-condominos/{id:guid}` | `sendEmailAppService.EstadosFinancierosCondominosAsync` | `SystemLuxuryApp/SendEmailGlobal/Core/EndPoints/SendEmailEndPoints.cs` |
| POST | `/api/send-email/presentacion-final-comite/{id:guid}` | `sendEmailAppService.PresentacionFinalComiteAsync` | `SystemLuxuryApp/SendEmailGlobal/Core/EndPoints/SendEmailEndPoints.cs` |
| POST | `/api/send-email/test-email/{email}` | - | `SystemLuxuryApp/SendEmailGlobal/Core/EndPoints/SendEmailEndPoints.cs` |

#### Modulo: SystemAI

- Interfaces: 3 | Servicios: 3 | Endpoints: 15 | DTOs: 5

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IAiChatAppService | 4 | `SystemLuxuryApp/SystemAI/AiChat/Interfaces/IAiChatAppService.cs` |
| IAiKnowledgeBaseAppService | 6 | `SystemLuxuryApp/SystemAI/AiKnowledgeBase/Interfaces/IAiKnowledgeBaseAppService.cs` |
| IElevenLabsAppService | 5 | `SystemLuxuryApp/SystemAI/ElevenLabs/Interfaces/IElevenLabsAppService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| AiChatAppService | 4 | `SystemLuxuryApp/SystemAI/AiChat/Services/AiChatAppService.cs` |
| AiKnowledgeBaseAppService | 6 | `SystemLuxuryApp/SystemAI/AiKnowledgeBase/Services/AiKnowledgeBaseAppService.cs` |
| ElevenLabsAppService | 5 | `SystemLuxuryApp/SystemAI/ElevenLabs/Services/ElevenLabsAppService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| StartNewSessionAsync | IAiChatAppService | SPECIAL | `Task<ApiResponseDTO<ChatSessionDTO>>` | `-` |
| SendMessageAsync | IAiChatAppService | SPECIAL | `Task<ApiResponseDTO<string>>` | `SendMessageDTO input` |
| GetUserSessionsAsync | IAiChatAppService | GET_LIST | `Task<ApiResponseDTO<List<ChatSessionDTO>>>` | `-` |
| GetSessionHistoryAsync | IAiChatAppService | GET_LIST | `Task<ApiResponseDTO<List<ChatMessageDTO>>>` | `Guid sessionId` |
| GetAllAsync | IAiKnowledgeBaseAppService | GET_LIST | `Task<ApiResponseDTO<List<AiKnowledgeBaseDTO…` | `-` |
| GetByIdAsync | IAiKnowledgeBaseAppService | GET_SINGLE | `Task<ApiResponseDTO<AiKnowledgeBaseDTO>>` | `Guid id` |
| CreateAsync | IAiKnowledgeBaseAppService | CREATE | `Task<ApiResponseDTO<Guid>>` | `AiKnowledgeBaseDTO input` |
| UpdateAsync | IAiKnowledgeBaseAppService | UPDATE | `Task<ApiResponseDTO<bool>>` | `AiKnowledgeBaseDTO input` |
| DeleteAsync | IAiKnowledgeBaseAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| GetModulesAsync | IAiKnowledgeBaseAppService | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<Guid…` | `-` |
| GetVoicesAsync | IElevenLabsAppService | GET_LIST | `Task<ApiResponseDTO<List<VoiceInfoDTO>>>` | `-` |
| TextToSpeechAsync | IElevenLabsAppService | OTHER | `Task<ApiResponseDTO<TextToSpeechResponseDTO…` | `TextToSpeechRequestDTO request` |
| GetSubscriptionStatusAsync | IElevenLabsAppService | GET_LIST | `Task<ApiResponseDTO<SubscriptionStatusDTO>>` | `-` |
| GetSettingsAsync | IElevenLabsAppService | GET_LIST | `Task<ApiResponseDTO<ElevenLabsSettingsDTO>>` | `-` |
| SaveSettingsAsync | IElevenLabsAppService | SPECIAL | `Task<ApiResponseDTO<ElevenLabsSettingsDTO>>` | `ElevenLabsSettingsDTO settingsDTO` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| POST | `/api/ai-chat/start-session` | `aiChatAppService.StartNewSessionAsync` | `SystemLuxuryApp/SystemAI/AiChat/EndPoints/AiChatEndPoints.cs` |
| POST | `/api/ai-chat/send-message` | `aiChatAppService.SendMessageAsync` | `SystemLuxuryApp/SystemAI/AiChat/EndPoints/AiChatEndPoints.cs` |
| GET | `/api/ai-chat/sessions` | `aiChatAppService.GetUserSessionsAsync` | `SystemLuxuryApp/SystemAI/AiChat/EndPoints/AiChatEndPoints.cs` |
| GET | `/api/ai-chat/history/{sessionId:guid}` | `aiChatAppService.GetSessionHistoryAsync` | `SystemLuxuryApp/SystemAI/AiChat/EndPoints/AiChatEndPoints.cs` |
| GET | `/api/ai-knowledge-base` | `appService.GetAllAsync` | `SystemLuxuryApp/SystemAI/AiKnowledgeBase/EndPoints/AiKnowledgeBaseEndPoints.cs` |
| GET | `/api/ai-knowledge-base/{id:guid}` | `appService.GetByIdAsync` | `SystemLuxuryApp/SystemAI/AiKnowledgeBase/EndPoints/AiKnowledgeBaseEndPoints.cs` |
| POST | `/api/ai-knowledge-base` | `appService.CreateAsync` | `SystemLuxuryApp/SystemAI/AiKnowledgeBase/EndPoints/AiKnowledgeBaseEndPoints.cs` |
| PUT | `/api/ai-knowledge-base` | `appService.UpdateAsync` | `SystemLuxuryApp/SystemAI/AiKnowledgeBase/EndPoints/AiKnowledgeBaseEndPoints.cs` |
| DELETE | `/api/ai-knowledge-base/{id:guid}` | `appService.DeleteAsync` | `SystemLuxuryApp/SystemAI/AiKnowledgeBase/EndPoints/AiKnowledgeBaseEndPoints.cs` |
| GET | `/api/ai-knowledge-base/modules` | `appService.GetModulesAsync` | `SystemLuxuryApp/SystemAI/AiKnowledgeBase/EndPoints/AiKnowledgeBaseEndPoints.cs` |
| GET | `/api/eleven-labs/voices` | `appService.GetVoicesAsync` | `SystemLuxuryApp/SystemAI/ElevenLabs/EndPoints/ElevenLabsEndPoints.cs` |
| POST | `/api/eleven-labs/text-to-speech` | `appService.TextToSpeechAsync` | `SystemLuxuryApp/SystemAI/ElevenLabs/EndPoints/ElevenLabsEndPoints.cs` |
| GET | `/api/eleven-labs/subscription-status` | `appService.GetSubscriptionStatusAsync` | `SystemLuxuryApp/SystemAI/ElevenLabs/EndPoints/ElevenLabsEndPoints.cs` |
| GET | `/api/eleven-labs/settings` | `appService.GetSettingsAsync` | `SystemLuxuryApp/SystemAI/ElevenLabs/EndPoints/ElevenLabsEndPoints.cs` |
| POST | `/api/eleven-labs/settings` | `appService.SaveSettingsAsync` | `SystemLuxuryApp/SystemAI/ElevenLabs/EndPoints/ElevenLabsEndPoints.cs` |

#### Modulo: SystemAuditLogs

- Interfaces: 4 | Servicios: 4 | Endpoints: 5 | DTOs: 4

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IBrevoEmailLogService | 1 | `SystemLuxuryApp/SystemAuditLogs/LogApp/Interfaces/IBrevoEmailLogService.cs` |
| ILogService | 3 | `SystemLuxuryApp/SystemAuditLogs/LogApp/Interfaces/ILogService.cs` |
| IUserActivityHistoryAppService | 1 | `SystemLuxuryApp/SystemAuditLogs/UserActivityHistory/Interfaces/IUserActivityHistoryAppService.cs` |
| IUserActivityService | 1 | `SystemLuxuryApp/SystemAuditLogs/UserActivityHistory/Interfaces/IUserActivityService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| BrevoEmailLogService | 1 | `SystemLuxuryApp/SystemAuditLogs/LogApp/Services/BrevoEmailLogService.cs` |
| LogService | 3 | `SystemLuxuryApp/SystemAuditLogs/LogApp/Services/LogService.cs` |
| UserActivityHistoryAppService | 1 | `SystemLuxuryApp/SystemAuditLogs/UserActivityHistory/Services/UserActivityHistoryAppService.cs` |
| UserActivityService | 1 | `SystemLuxuryApp/SystemAuditLogs/UserActivityHistory/Services/UserActivityService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GetEmailLogsAsync | IBrevoEmailLogService | GET_LIST | `Task<ApiResponseDTO<BrevoPagedResultDTO>>` | `BrevoEmailLogFilterDTO filter` |
| GetLogsAsync | ILogService | GET_LIST | `Task<ApiResponseDTO<PagedResultDTO<LogEntry…` | `PaginationCommonDTO pagination, string level, string messag…` |
| DeleteOldLogsAsync | ILogService | DELETE | `Task<ApiResponseDTO<int>>` | `int days` |
| DeleteAllLogsAsync | ILogService | DELETE | `Task<ApiResponseDTO<bool>>` | `-` |
| GetHistoryAsync | IUserActivityHistoryAppService | GET_LIST | `Task<ApiResponseDTO<PagedResultDTO<UserActi…` | `PaginationCommonDTO pagination, Guid? customerId, TypePerso…` |
| LogActivityAsync | IUserActivityService | OTHER | `Task` | `Infrastructure.Logs.Entities.UserActivity activity` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| GET | `/api/brevo-email-log` | `brevoEmailLogService.GetEmailLogsAsync` | `SystemLuxuryApp/SystemAuditLogs/LogApp/EndPoints/BrevoEmailLogEndPoints.cs` |
| GET | `/api/logs` | `logService.GetLogsAsync` | `SystemLuxuryApp/SystemAuditLogs/LogApp/EndPoints/LogsEndPoints.cs` |
| POST | `/api/logs/client-error` | - | `SystemLuxuryApp/SystemAuditLogs/LogApp/EndPoints/LogsEndPoints.cs` |
| DELETE | `/api/logs/all` | `logService.DeleteAllLogsAsync` | `SystemLuxuryApp/SystemAuditLogs/LogApp/EndPoints/LogsEndPoints.cs` |
| GET | `/api/user-activity-history` | `appService.GetHistoryAsync` | `SystemLuxuryApp/SystemAuditLogs/UserActivityHistory/EndPoints/UserActivityHistoryEndPoints.cs` |

#### Modulo: SystemTenant

- Interfaces: 4 | Servicios: 4 | Endpoints: 22 | DTOs: 2

#### Interfaces

| Interfaz | # Metodos | Archivo |
|---|---:|---|
| IAiAssistantService | 16 | `SystemLuxuryApp/SystemTenant/AiAssistant/Interfaces/IAiAssistantService.cs` |
| INotificationDispatcher | 1 | `SystemLuxuryApp/SystemTenant/Notification/Interfaces/INotificationDispatcher.cs` |
| INotificationUserAppService | 8 | `SystemLuxuryApp/SystemTenant/Notification/Interfaces/INotificationUserAppService.cs` |
| ISendSignalRService | 8 | `SystemLuxuryApp/SystemTenant/Notification/Interfaces/ISendSignalRService.cs` |

#### Servicios

| Servicio | # Metodos | Archivo |
|---|---:|---|
| AiAssistantService | 16 | `SystemLuxuryApp/SystemTenant/AiAssistant/Services/AiAssistantService.cs` |
| NotificationUserMapper | 0 | `SystemLuxuryApp/SystemTenant/Notification/Mapping/NotificationUserMapper.cs` |
| NotificationUserAppService | 8 | `SystemLuxuryApp/SystemTenant/Notification/Services/NotificationUserAppService.cs` |
| SendSignalRService | 8 | `SystemLuxuryApp/SystemTenant/Notification/Services/SendSignalRService.cs` |

#### Metodos del contrato (interfaces)

| Metodo | Owner | Categoria | Retorno | Parametros |
|---|---|---|---|---|
| GenerateAnnouncementDraftAsync | IAiAssistantService | SPECIAL | `Task<string>` | `string prompt, string tone = ""` |
| GenerateOfficialAnnouncementAsync | IAiAssistantService | SPECIAL | `Task<OperationsLuxuryApp.Announcements.DTOs…` | `string idea, string buildingName` |
| GenerateFinancialSummaryAsync | IAiAssistantService | SPECIAL | `Task<string>` | `string financialContext, string tone = ""` |
| GenerateDashboardSummaryAsync | IAiAssistantService | SPECIAL | `Task<string>` | `string dashboardContext, string tone = "", Guid? customerId…` |
| GenerateBudgetAuditAsync | IAiAssistantService | SPECIAL | `Task<string>` | `string budgetContext, string tone = ""` |
| GenerateBudgetForecastAsync | IAiAssistantService | SPECIAL | `Task<string>` | `string budgetContext, decimal inflationRate` |
| GenerateJobDescriptionAsync | IAiAssistantService | SPECIAL | `Task<string>` | `string jobTitle, string tone = "", string customInstruction…` |
| AnalyzeJobDescriptionAsync | IAiAssistantService | GET_LIST | `Task<string>` | `string description, string jobTitle` |
| ConsultDocumentAsync | IAiAssistantService | OTHER | `Task<string>` | `string documentText, string userQuery` |
| AnalyzeComparativeChartAsync | IAiAssistantService | GET_LIST | `Task<string>` | `ComparativeChartAnalysisInputDTO input, string tone = ""` |
| GenerateImageAsync | IAiAssistantService | SPECIAL | `Task<Stream>` | `string prompt` |
| AnalyzeImageAsync | IAiAssistantService | GET_LIST | `Task<string>` | `Stream imageStream, string prompt` |
| AnalyzeAccountingReportAsync | IAiAssistantService | GET_LIST | `Task<string>` | `string reportData, string userQuery, string tone = ""` |
| AnalyzeContabilidadOnlineReportAsync | IAiAssistantService | GET_LIST | `Task<string>` | `string reportName, string reportData, string userQuery, str…` |
| ExplainContabilidadOnlineReportAsync | IAiAssistantService | OTHER | `Task<string>` | `string reportName, string reportData, string userQuery, str…` |
| TestProfileAsync | IAiAssistantService | OTHER | `Task<string>` | `string profileName, string prompt` |
| DispatchAsync | INotificationDispatcher | OTHER | `Task` | `NotificationRequestDTO request, CancellationToken cancellat…` |
| GetUserNotificationsAsync | INotificationUserAppService | GET_LIST | `Task<ApiResponseDTO<List<NotificationUserDT…` | `bool? isRead = null` |
| GetUnreadCountAsync | INotificationUserAppService | GET_LIST | `Task<ApiResponseDTO<int>>` | `-` |
| MarkAsReadAsync | INotificationUserAppService | OTHER | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| DeleteAsync | INotificationUserAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `Guid id` |
| DeleteRangeAsync | INotificationUserAppService | DELETE | `Task<ApiResponseDTO<bool>>` | `List<Guid> ids` |
| DeleteOldNotificationsAsync | INotificationUserAppService | DELETE | `Task<ApiResponseDTO<int>>` | `int readDays, int unreadDays` |
| CreateNotificationAsync | INotificationUserAppService | CREATE | `Task<ApiResponseDTO<NotificationUser>>` | `NotificationUserAddOrEditDTO notification` |
| GetUsersAsync | INotificationUserAppService | GET_LIST | `Task<ApiResponseDTO<List<SelectItemDTO<stri…` | `-` |
| SendDTOUserAsync | ISendSignalRService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `string userId` |
| SenDTOMultipleUsersAsync | ISendSignalRService | OTHER | `Task<ApiResponseDTO<bool>>` | `List<string> userIds` |
| SendBudgetProposalItemUpdateAsync | ISendSignalRService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `BudgetProposalItemDTO itemDTO, Guid customerId, int fiscalY…` |
| SendProjectedExpenseUpdateAsync | ISendSignalRService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `ProjectedExpenseUpdateDTO DTO, string excludedConnectionId` |
| SendGoogleCalendarEventUpdateAsync | ISendSignalRService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `GoogleCalendarEventRealTimeUpdateDTO dto, string excludedCo…` |
| SendNativeCollectionUpdateAsync | ISendSignalRService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `NativeCollectionRealTimeUpdateDTO dto, string excludedConne…` |
| SendPanicAlertAsync | ISendSignalRService | SPECIAL | `Task<ApiResponseDTO<bool>>` | `PanicAlertRealTimeDTO dto, List<string> userIds, bool isAtt…` |
| GetConnectedUserIds | ISendSignalRService | GET_LIST | `ApiResponseDTO<List<string>>` | `-` |

#### Endpoints

| Verbo | Ruta completa | Handler | Archivo |
|---|---|---|---|
| POST | `/api/ai-assistant/generate-image` | `aiAssistantService.GenerateImageAsync` | `SystemLuxuryApp/SystemTenant/AiAssistant/EndPoints/AiAssistantEndpoints.cs` |
| GET | `/api/ai-assistant/test-profile` | `aiAssistantService.TestProfileAsync` | `SystemLuxuryApp/SystemTenant/AiAssistant/EndPoints/AiAssistantEndpoints.cs` |
| POST | `/api/ticket-analysis/analyze-image` | - | `SystemLuxuryApp/SystemTenant/AiAssistant/EndPoints/TicketAnalysisEndpoints.cs` |
| GET | `/api/notifications` | `appService.GetUserNotificationsAsync` | `SystemLuxuryApp/SystemTenant/Notification/EndPoints/NotificationsEndpoints.cs` |
| GET | `/api/notifications/unread-count` | `appService.GetUnreadCountAsync` | `SystemLuxuryApp/SystemTenant/Notification/EndPoints/NotificationsEndpoints.cs` |
| GET | `/api/notifications/mark-as-read/{id:guid}` | `appService.MarkAsReadAsync` | `SystemLuxuryApp/SystemTenant/Notification/EndPoints/NotificationsEndpoints.cs` |
| DELETE | `/api/notifications/{id:guid}` | `appService.DeleteAsync` | `SystemLuxuryApp/SystemTenant/Notification/EndPoints/NotificationsEndpoints.cs` |
| DELETE | `/api/notifications` | `appService.DeleteRangeAsync` | `SystemLuxuryApp/SystemTenant/Notification/EndPoints/NotificationsEndpoints.cs` |
| POST | `/api/notifications/test-one-signal` | `oneSignalService.SendNotificationOneSignalAsync` | `SystemLuxuryApp/SystemTenant/Notification/EndPoints/NotificationsEndpoints.cs` |
| POST | `/api/notifications/test-one-signal-web` | `oneSignalWebService.SendNotificationOneSignalAsync` | `SystemLuxuryApp/SystemTenant/Notification/EndPoints/NotificationsEndpoints.cs` |
| POST | `/api/notifications/test-whatsapp` | - | `SystemLuxuryApp/SystemTenant/Notification/EndPoints/NotificationsEndpoints.cs` |
| POST | `/api/notifications/test-whatsapp-legal-ticket` | - | `SystemLuxuryApp/SystemTenant/Notification/EndPoints/NotificationsEndpoints.cs` |
| POST | `/api/notifications/test-whatsapp-solicitud-recibida` | - | `SystemLuxuryApp/SystemTenant/Notification/EndPoints/NotificationsEndpoints.cs` |
| POST | `/api/notifications/test-whatsapp-solicitud-terminada` | - | `SystemLuxuryApp/SystemTenant/Notification/EndPoints/NotificationsEndpoints.cs` |
| POST | `/api/notifications/test-whatsapp-alerta-tarea-urgente` | - | `SystemLuxuryApp/SystemTenant/Notification/EndPoints/NotificationsEndpoints.cs` |
| POST | `/api/notifications/test-notification-user` | `dispatcher.DispatchAsync` | `SystemLuxuryApp/SystemTenant/Notification/EndPoints/NotificationsEndpoints.cs` |
| POST | `/api/notifications/test-email` | `razorViewToStringRenderer.RenderViewToStringAsync` | `SystemLuxuryApp/SystemTenant/Notification/EndPoints/NotificationsEndpoints.cs` |
| POST | `/api/notifications/test-signal-r/{userId}` | `signalRService.SendDTOUserAsync` | `SystemLuxuryApp/SystemTenant/Notification/EndPoints/NotificationsEndpoints.cs` |
| POST | `/api/notifications/test-signal-users` | `signalRService.SenDTOMultipleUsersAsync` | `SystemLuxuryApp/SystemTenant/Notification/EndPoints/NotificationsEndpoints.cs` |
| GET | `/api/notifications/connected-users` | `appService.GetUsersAsync` | `SystemLuxuryApp/SystemTenant/Notification/EndPoints/NotificationsEndpoints.cs` |
| GET | `/api/notifications/connected-users-web` | `appService.GetUsersAsync` | `SystemLuxuryApp/SystemTenant/Notification/EndPoints/NotificationsEndpoints.cs` |
| GET | `/api/notifications/users` | `appService.GetUsersAsync` | `SystemLuxuryApp/SystemTenant/Notification/EndPoints/NotificationsEndpoints.cs` |

#### Modulo: TenantApplicationMarker.cs

- Interfaces: 0 | Servicios: 0 | Endpoints: 0 | DTOs: 0

#### Modulo: TenantAssemblyMarker.cs

- Interfaces: 0 | Servicios: 0 | Endpoints: 0 | DTOs: 0

## Analisis de Nomenclatura

### Patrones identificados

- Estructura vertical consistente: `{Grupo}/{Modulo}/{DTOs|EndPoints|Interfaces|Services|Entities|Mapping}`.
- Sufijo Async: 3628 metodos lo usan (92.9%), 276 no.
- Servicios con sufijo `AppService` como convencion dominante; contratos `IAppService` espejo.
- Endpoints minimal-API (`.MapGet/MapPost/...`) con handler lambda o metodo de servicio referenciado.
- DTOs con sufijos semanticos: `ListDTO`, `GetByIdDTO`, `AddOrEditDTO`, `UpdateStatusDTO`.
- Rutas de recursos: kebab-case 1059, camelCase 697, PascalCase 0, snake_case 0.
- Metodos de infraestructura/eventos: 90 empiezan con `On*` (handlers de eventos), 109 con `Select*` (select-items/dropdowns).

### Inconsistencias detectadas

1. **Metodos con verbo en espanol** (110 metodos). Ejemplos: `ValidarCreateOrder`, `ActualizarMapeo`, `ListaSeguimientos`, `ListaMinuta`, `ListaMinutaLegal`, `Pendientes`, `Bitacoradiaria`, `ObtenerResumenTickets`, `SubirDocumento`, `ValidarArchivo`, `EnviarEmailPendientesResponsable`, `AutorizarPresentacion`.
2. **Metodos con nombre-sustantivo sin verbo** (541 metodos OTHER). Ejemplos: `ToDTO`, `ToDTOArray`, `ToEntity`, `IncrementCount`, `CapitalizeUserNames`, `RetroactiveAssignEmployeeRoles`, `Assignments`, `ToBlockAccount`, `ToUnlockAccount`, `EmployeeBirthday`, `BuildAndPersistClientTokens`, `NormalizeSegmentedAccountCode`.
3. **Estilos mixtos para listados**: GetAll* = 249, List*/Listar* = 30, Get*Paged = 16, Obtener* = 10, Consultar* = 0, Buscar* = 6, Get*Plural = 0.
4. **Cobertura parcial del sufijo Async** (92.9%): mezcla de estilos en firmas publicas.
5. **Contratos vs implementaciones**: 356 interfaces vs 372 clases de servicio detectadas; revisar servicios sin contrato y viceversa.
6. **PATCH subutilizado** (29 endpoints) frente a PUT (205): semantica de actualizacion parcial inconsistente.
7. **Desalineacion verbo HTTP vs semantica del metodo**: 50 endpoints cuyo handler no resuelve a un contrato mapeado; pares destacados:
   - `GET -> CREATE`: 7 endpoint(s).
   - `GET -> UPDATE`: 6 endpoint(s).
   - `GET -> DELETE`: 2 endpoint(s).
   - `POST -> GET_LIST`: 8 endpoint(s).
   - `POST -> GET_SINGLE`: 1 endpoint(s).
   - `DELETE -> GET_LIST`: 2 endpoint(s).

### Verbo inicial mas frecuente (top 30)

| Verbo inicial | Usos |
|---|---:|
| get | 1410 |
| update | 374 |
| delete | 361 |
| add | 268 |
| send | 126 |
| create | 122 |
| select | 109 |
| on | 90 |
| generate | 73 |
| notify | 64 |
| export | 27 |
| list | 26 |
| cancel | 24 |
| upsert | 19 |
| remove | 18 |
| upload | 17 |
| search | 14 |
| analyze | 14 |
| resumen | 14 |
| eliminar | 14 |
| validar | 13 |
| data | 12 |
| toggle | 12 |
| resolve | 12 |
| validate | 11 |
| process | 11 |
| to | 10 |
| import | 10 |
| complete | 10 |
| obtener | 10 |

## Propuesta de Estandar de Nomenclatura

### Convenciones recomendadas

| Categoria | Patron recomendado | Ejemplo |
|---|---|---|
| GET_SINGLE | `Get{Entity}ByIdAsync`, `Get{Entity}By{Field}Async` | `GetCustomerByIdAsync` |
| GET_LIST | `GetAll{Entity}sAsync`, `Get{Entity}sBy{Criteria}Async`, `Search{Entity}sAsync` | `GetPendingRequestsAsync` |
| CREATE | `Create{Entity}Async` | `CreateWorkPositionAsync` |
| UPDATE | `Update{Entity}Async` | `UpdateModuleStatusAsync` |
| DELETE | `Delete{Entity}Async` | `DeleteEmployeeDocumentAsync` |
| SPECIAL | `{Action}{Entity}Async` | `ApproveVacationRequestAsync` |
| OTHER | Renombrar con verbo de negocio explicito | `ProcessPayrollAsync` |

Reglas complementarias:

1. Todos los metodos publicos de contratos llevan sufijo `Async`.
2. Un solo estilo para listados: `GetAll*` para catalogos completos, `Get*By*` para filtrados, `Search*` para busqueda de texto libre.
3. Nombres 100% en ingles (verbos y sustantivos).
4. Rutas HTTP en minuscula y plural para colecciones: `/api/{resource}`, `/api/{resource}/{id}`, `/api/{resource}/{id}/{action}` para SPECIAL.
5. SPECIAL usa POST con ruta de accion explicita; PATCH solo para actualizaciones parciales.

### Ejemplos de refactorizacion (generados del codigo real)

| Nombre actual | Propuesto | Justificacion |
|---|---|---|
| ValidarCreateOrderAsync | ValidateCreateOrderAsync | Verbo en espanol (validar) -> estandar ingles |
| ActualizarMapeoAsync | UpdateMapeoAsync | Verbo en espanol (actualizar) -> estandar ingles |
| ListaSeguimientosAsync | GetAllSeguimientosAsync | Verbo en espanol (lista) -> estandar ingles |
| ListaMinutaAsync | GetAllMinutaAsync | Verbo en espanol (lista) -> estandar ingles |
| ListaMinutaLegalAsync | GetAllMinutaLegalAsync | Verbo en espanol (lista) -> estandar ingles |
| PendientesAsync | GetContabilidadMinutaAsync | Verbo en espanol (pendientes) -> estandar ingles |
| BitacoradiariaAsync | GetMaintenanceReportAsync | Verbo en espanol (bitacoradiaria) -> estandar ingles |
| ObtenerResumenTickets | GetResumenTickets | Verbo en espanol (obtener) -> estandar ingles |
| SubirDocumentoAsync | UploadDocumentoAsync | Verbo en espanol (subir) -> estandar ingles |
| ValidarArchivoAsync | ValidateArchivoAsync | Verbo en espanol (validar) -> estandar ingles |
| EnviarEmailPendientesResponsable | SendEmailPendientesResponsable | Verbo en espanol (enviar) -> estandar ingles |
| AutorizarPresentacionAsync | AuthorizePresentacionAsync | Verbo en espanol (autorizar) -> estandar ingles |
| SubirImgAsync | UploadImgAsync | Verbo en espanol (subir) -> estandar ingles |
| ValidarRoleAsync | ValidateRoleAsync | Verbo en espanol (validar) -> estandar ingles |
| ValidarAdminAsisAsync | ValidateAdminAsisAsync | Verbo en espanol (validar) -> estandar ingles |
| ValidarSolicitudesAbiertas | ValidateSolicitudesAbiertas | Verbo en espanol (validar) -> estandar ingles |
| RegistrarAsync | RegisterChekadorEmpleadosAsync | Verbo en espanol (registrar) -> estandar ingles |
| AprobarAnomaliaAsync | ApproveAnomaliaAsync | Verbo en espanol (aprobar) -> estandar ingles |
| RechazarAnomaliaAsync | RejectAnomaliaAsync | Verbo en espanol (rechazar) -> estandar ingles |
| CrearSedeAsync | CreateSedeAsync | Verbo en espanol (crear) -> estandar ingles |
| ObtenerAccesiblesAsync | GetAccesiblesAsync | Verbo en espanol (obtener) -> estandar ingles |
| ObtenerPorIdAsync | GetPorIdAsync | Verbo en espanol (obtener) -> estandar ingles |
| CrearAsync | CreateManualTemplateAsync | Verbo en espanol (crear) -> estandar ingles |
| ActualizarAsync | UpdateManualTemplateAsync | Verbo en espanol (actualizar) -> estandar ingles |
| EliminarAsync | DeleteManualTemplateAsync | Verbo en espanol (eliminar) -> estandar ingles |
| ActualizarPasoAsync | UpdatePasoAsync | Verbo en espanol (actualizar) -> estandar ingles |
| EliminarPasoAsync | DeletePasoAsync | Verbo en espanol (eliminar) -> estandar ingles |
| SubirImagenPasoAsync | UploadImagenPasoAsync | Verbo en espanol (subir) -> estandar ingles |
| EliminarImagenPasoAsync | DeleteImagenPasoAsync | Verbo en espanol (eliminar) -> estandar ingles |
| EliminarEnlacePasoAsync | DeleteEnlacePasoAsync | Verbo en espanol (eliminar) -> estandar ingles |
| ToDTO | ProcessToDTO | Nombre sin verbo; requiere verbo de negocio |
| ToDTOArray | GetToDTOArrayList | Nombre sin verbo; retorna coleccion |
| ToEntity | CreateToEntity | Nombre sin verbo; recibe DTO de escritura |
| IncrementCount | ProcessIncrementCount | Nombre sin verbo; requiere verbo de negocio |
| CapitalizeUserNamesAsync | ProcessCapitalizeUserNames | Nombre sin verbo; requiere verbo de negocio |
| RetroactiveAssignEmployeeRolesAsync | ProcessRetroactiveAssignEmployeeRoles | Nombre sin verbo; requiere verbo de negocio |
| AssignmentsAsync | GetAssignmentsList | Nombre sin verbo; retorna coleccion |
| ToBlockAccountAsync | ProcessToBlockAccount | Nombre sin verbo; requiere verbo de negocio |
| ToUnlockAccountAsync | ProcessToUnlockAccount | Nombre sin verbo; requiere verbo de negocio |
| EmployeeBirthdayAsync | GetEmployeeBirthdayList | Nombre sin verbo; retorna coleccion |
| BuildAndPersistClientTokensAsync | CreateBuildAndPersistClientTokens | Nombre sin verbo; recibe DTO de escritura |
| NormalizeSegmentedAccountCode | ProcessNormalizeSegmentedAccountCode | Nombre sin verbo; requiere verbo de negocio |
| BuildConceptNameFromAccount | ProcessBuildConceptNameFromAccount | Nombre sin verbo; requiere verbo de negocio |
| LogAudit | ProcessLogAudit | Nombre sin verbo; requiere verbo de negocio |
| LogAsync | ProcessLog | Nombre sin verbo; requiere verbo de negocio |

## Recomendaciones

1. **Migrar verbo en espanol a ingles** en 110 metodos (lista completa en `scripts/api_inventory/api_inventory.json`).
2. **Nombrar con verbo** los 541 metodos clasificados OTHER; revisar caso por caso (semi-automatico).
3. **Unificar estilo de listados** en `GetAll/GetBy/Search` y deprecar `List*/Obtener*/Consultar*`.
4. **Completar sufijo Async** en firmas publicas y aplicar analizador Roslyn o test de convenciones para prevenir regresiones.
5. **Auditar servicios sin interfaz** y contratos sin implementacion para cerrar la brecha 356/372.
6. **Estandarizar rutas SPECIAL** como `POST /api/{resource}/{id}/{action}` y documentarlas en OpenAPI con OperationId = nombre del metodo. Endpoints con handler sin clasificar: 50.
7. **Revisar rutas duplicadas** dentro del mismo modulo (1 casos; ver JSON): GET+POST con misma ruta o rutas equivalentes.
8. **Versionar el estandar** en `conventions/` y vincularlo desde AGENTS.md/CLAUDE.md para que generacion futura de modulos lo siga.

---

> Datos completos (metodos, endpoints, categorias) en `scripts/api_inventory/api_inventory.json`. Regenerar con `node scripts/api_inventory/scan.js`.
