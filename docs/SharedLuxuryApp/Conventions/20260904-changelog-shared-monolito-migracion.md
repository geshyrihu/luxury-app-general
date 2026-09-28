# AdminLuxuryApp: Cortes Verticales Puros

## Gestión de bitácoras

Se creó `docs/changelogs/` y se movió físicamente la bitácora anterior a `docs/changelogs/01_migracion_monolito_fase1_8.md`, conservando íntegro su contenido (incluida la entrada anterior de Fase 9). Se creó este nuevo `log.changes.md` vacío antes de registrar el trabajo actual.

## Aplanamiento físico

- Se deshicieron las 59 carpetas intermedias `Domain`, `Application` e `Infrastructure` de AdminLuxuryApp mediante `Move-Item` y eliminación únicamente de directorios vacíos con `Remove-Item`.
- Sus carpetas `Entities`, `DTOs`, `EndPoints`, `Services`, `Interfaces`, `Mapping`, `Docs`, `Repositories` y `Workers`, incluidas variantes singulares existentes, quedaron directamente bajo su submódulo.
- Se conservaron las agrupaciones funcionales existentes y los cambios locales anteriores. La comparación de huellas tras el movimiento confirmó el contenido idéntico antes de reescribir namespaces.
- Los 213 archivos `.cs` que permanecen en `api/LuxuryApp.Application/Modules/AdminLuxuryApp/` usan exactamente `LuxuryApp.Application.` más la ruta de su directorio desde el proyecto. La comprobación final encontró 0 discrepancias y 0 capas intermedias restantes.

## Referencias e integración

- Se ampliaron los `GlobalUsings.cs` de Application, Api y Tests con los namespaces de AdminLuxuryApp, para resolver los consumidores existentes.
- Se actualizaron referencias calificadas e inyecciones de dependencias (incluidos `IoC.cs` y `DependencyInjection.Controllers.cs`) y se retiraron imports de los namespaces de Jobs que dejaron de existir.
- Se calificaron explícitamente 39 referencias de tipo que colisionaban con nombres de submódulos, sin renombrar propiedades del modelo: ApplicationRole, CustomerAddress, CustomerImage, CustomerModul, ModuleAppRol, DocumentCatalog, TelefonosEmergencia, WorkPositionSchedule y AsambleaChecklistTemplate.
- Se sincronizaron los nombres CLR de entidades en `ApplicationDbContextModelSnapshot.cs`. Los diseñadores de migraciones históricas conservan sus nombres originales; no se creó ni ejecutó una migración de base de datos.
- Excepción de compatibilidad: `LegacyHangfireJobTypes.cs` contenía cuatro namespaces históricos y clases homónimas. Se movió a `api/LuxuryApp.Application/Infrastructure/Compatibility/Hangfire/LegacyHangfireJobTypes.cs`, conservando esos namespaces y actualizando únicamente las referencias a los Workers nuevos. Así AdminLuxuryApp mantiene namespaces estrictos sin eliminar los adaptadores históricos existentes.
- No se ha verificado la deserialización de trabajos de Hangfire ya persistidos con el antiguo namespace `LuxuryApp.Application.Features.Jobs.Workers`; la verificación realizada es de compilación y pruebas de servicios.
- Se corrigió el error previo de compilación en `ComiteVigilanciaAppServiceTests.cs:68`: la aserción usa `db.ComiteVigilancia`, que es el DbSet existente, en lugar de `db.ComiteVigilanciaEntity`. Se conservó el alias del tipo de entidad.

## Verificación

- `dotnet build LuxuryApp.sln -v:q -p:OutputPath=<salida temporal separada>` desde `api/`: **0 errores, 15 advertencias**. La salida separada evita interferir con las DLL de la API que está en ejecución.
- Pruebas existentes de BankAppServiceTests, CustomerDataCompanyAppServiceTests y ComiteVigilanciaAppServiceTests: **27 ejecutadas, 26 aprobadas y 1 fallida**.
- Falla: `CustomerDataCompanyAppServiceTests.GetAllAsync_WithData_ReturnsMappedDTOs`, línea 75, espera `5551234567` y recibe `(55) 5123- 4567`. El servicio usa `StringExtension.GetCelFormtat` en el listado. Se verificó mediante SHA-256 contra la evidencia anterior que el contenido de ese servicio es idéntico salvo la declaración de namespace; el archivo de prueba no fue modificado. No se cambió esa regla de formato en esta migración.

## Namespaces por carpeta final

Las rutas de la tabla son relativas a `api/LuxuryApp.Application/Modules/AdminLuxuryApp/`. Se registran los namespaces de origen del código previo y el namespace estricto final.

| Carpeta final | Namespace de origen | Namespace final | Archivos .cs |
| --- | --- | --- | ---: |
| `CatalogosGenerales/Banks/DTOs` | `LuxuryApp.Application.DTOs` | `LuxuryApp.Application.Modules.AdminLuxuryApp.CatalogosGenerales.Banks.DTOs` | 2 |
| `CatalogosGenerales/Banks/EndPoints` | `LuxuryApp.Application.EndPoints` | `LuxuryApp.Application.Modules.AdminLuxuryApp.CatalogosGenerales.Banks.EndPoints` | 1 |
| `CatalogosGenerales/Banks/Interfaces` | `LuxuryApp.Application.Interfaces` | `LuxuryApp.Application.Modules.AdminLuxuryApp.CatalogosGenerales.Banks.Interfaces` | 1 |
| `CatalogosGenerales/Banks/Mapping` | `LuxuryApp.Application.Mappings` | `LuxuryApp.Application.Modules.AdminLuxuryApp.CatalogosGenerales.Banks.Mapping` | 1 |
| `CatalogosGenerales/Banks/Services` | `LuxuryApp.Application.Interfaces` | `LuxuryApp.Application.Modules.AdminLuxuryApp.CatalogosGenerales.Banks.Services` | 1 |
| `CatalogosGenerales/DocumentCatalog/DTOs` | `LuxuryApp.Application.DTOs, LuxuryApp.Application.Modules.AdminLuxuryApp.CatalogosGenerales.DocumentCatalog.DTOs` | `LuxuryApp.Application.Modules.AdminLuxuryApp.CatalogosGenerales.DocumentCatalog.DTOs` | 5 |
| `CatalogosGenerales/DocumentCatalog/EndPoints` | `LuxuryApp.Application.EndPoints` | `LuxuryApp.Application.Modules.AdminLuxuryApp.CatalogosGenerales.DocumentCatalog.EndPoints` | 1 |
| `CatalogosGenerales/DocumentCatalog/Interfaces` | `LuxuryApp.Application.Interfaces` | `LuxuryApp.Application.Modules.AdminLuxuryApp.CatalogosGenerales.DocumentCatalog.Interfaces` | 1 |
| `CatalogosGenerales/DocumentCatalog/Services` | `LuxuryApp.Application.Services` | `LuxuryApp.Application.Modules.AdminLuxuryApp.CatalogosGenerales.DocumentCatalog.Services` | 1 |
| `CatalogosGenerales/EmailData/DTOs` | `LuxuryApp.Application.DTOs` | `LuxuryApp.Application.Modules.AdminLuxuryApp.CatalogosGenerales.EmailData.DTOs` | 2 |
| `CatalogosGenerales/EmailData/EndPoints` | `LuxuryApp.Application.EndPoints` | `LuxuryApp.Application.Modules.AdminLuxuryApp.CatalogosGenerales.EmailData.EndPoints` | 1 |
| `CatalogosGenerales/EmailData/Interfaces` | `LuxuryApp.Application.Interfaces` | `LuxuryApp.Application.Modules.AdminLuxuryApp.CatalogosGenerales.EmailData.Interfaces` | 1 |
| `CatalogosGenerales/EmailData/Mapping` | `LuxuryApp.Application.Mappings` | `LuxuryApp.Application.Modules.AdminLuxuryApp.CatalogosGenerales.EmailData.Mapping` | 1 |
| `CatalogosGenerales/EmailData/Services` | `LuxuryApp.Application.Interfaces` | `LuxuryApp.Application.Modules.AdminLuxuryApp.CatalogosGenerales.EmailData.Services` | 1 |
| `CatalogosGenerales/GeneralCatalogs/DTOs` | `LuxuryApp.Application.DTOs` | `LuxuryApp.Application.Modules.AdminLuxuryApp.CatalogosGenerales.GeneralCatalogs.DTOs` | 7 |
| `CatalogosGenerales/GeneralCatalogs/EndPoints` | `LuxuryApp.Application.EndPoints` | `LuxuryApp.Application.Modules.AdminLuxuryApp.CatalogosGenerales.GeneralCatalogs.EndPoints` | 4 |
| `CatalogosGenerales/GeneralCatalogs/Interfaces` | `LuxuryApp.Application.Interfaces` | `LuxuryApp.Application.Modules.AdminLuxuryApp.CatalogosGenerales.GeneralCatalogs.Interfaces` | 4 |
| `CatalogosGenerales/GeneralCatalogs/Mapping` | `LuxuryApp.Application.Mappings` | `LuxuryApp.Application.Modules.AdminLuxuryApp.CatalogosGenerales.GeneralCatalogs.Mapping` | 3 |
| `CatalogosGenerales/GeneralCatalogs/Services` | `LuxuryApp.Application.Interfaces, LuxuryApp.Application.Services` | `LuxuryApp.Application.Modules.AdminLuxuryApp.CatalogosGenerales.GeneralCatalogs.Services` | 4 |
| `CatalogosGenerales/MeasurementUnit/EndPoints` | `LuxuryApp.Application.EndPoints` | `LuxuryApp.Application.Modules.AdminLuxuryApp.CatalogosGenerales.MeasurementUnit.EndPoints` | 1 |
| `CatalogosGenerales/MeasurementUnit/Interfaces` | `LuxuryApp.Application.Interfaces` | `LuxuryApp.Application.Modules.AdminLuxuryApp.CatalogosGenerales.MeasurementUnit.Interfaces` | 1 |
| `CatalogosGenerales/MeasurementUnit/Mapping` | `LuxuryApp.Application.Mappings` | `LuxuryApp.Application.Modules.AdminLuxuryApp.CatalogosGenerales.MeasurementUnit.Mapping` | 1 |
| `CatalogosGenerales/MeasurementUnit/Services` | `LuxuryApp.Application.Services` | `LuxuryApp.Application.Modules.AdminLuxuryApp.CatalogosGenerales.MeasurementUnit.Services` | 1 |
| `CatalogosGenerales/MetodoPago/DTOs` | `LuxuryApp.Application.DTOs` | `LuxuryApp.Application.Modules.AdminLuxuryApp.CatalogosGenerales.MetodoPago.DTOs` | 2 |
| `CatalogosGenerales/MetodoPago/EndPoints` | `LuxuryApp.Application.EndPoints` | `LuxuryApp.Application.Modules.AdminLuxuryApp.CatalogosGenerales.MetodoPago.EndPoints` | 1 |
| `CatalogosGenerales/MetodoPago/Interfaces` | `LuxuryApp.Application.Interfaces` | `LuxuryApp.Application.Modules.AdminLuxuryApp.CatalogosGenerales.MetodoPago.Interfaces` | 1 |
| `CatalogosGenerales/MetodoPago/Mapping` | `LuxuryApp.Application.Mappings` | `LuxuryApp.Application.Modules.AdminLuxuryApp.CatalogosGenerales.MetodoPago.Mapping` | 1 |
| `CatalogosGenerales/MetodoPago/Services` | `LuxuryApp.Application.Interfaces` | `LuxuryApp.Application.Modules.AdminLuxuryApp.CatalogosGenerales.MetodoPago.Services` | 1 |
| `CatalogosGenerales/PaymentMethod/DTOs` | `LuxuryApp.Application.DTOs` | `LuxuryApp.Application.Modules.AdminLuxuryApp.CatalogosGenerales.PaymentMethod.DTOs` | 2 |
| `CatalogosGenerales/PaymentMethod/EndPoints` | `LuxuryApp.Application.EndPoints` | `LuxuryApp.Application.Modules.AdminLuxuryApp.CatalogosGenerales.PaymentMethod.EndPoints` | 1 |
| `CatalogosGenerales/PaymentMethod/Interfaces` | `LuxuryApp.Application.Interfaces` | `LuxuryApp.Application.Modules.AdminLuxuryApp.CatalogosGenerales.PaymentMethod.Interfaces` | 1 |
| `CatalogosGenerales/PaymentMethod/Mapping` | `LuxuryApp.Application.Mappings` | `LuxuryApp.Application.Modules.AdminLuxuryApp.CatalogosGenerales.PaymentMethod.Mapping` | 1 |
| `CatalogosGenerales/PaymentMethod/Services` | `LuxuryApp.Application.Interfaces` | `LuxuryApp.Application.Modules.AdminLuxuryApp.CatalogosGenerales.PaymentMethod.Services` | 1 |
| `CatalogosGenerales/TelefonosEmergencia/DTOs` | `LuxuryApp.Application.DTOs` | `LuxuryApp.Application.Modules.AdminLuxuryApp.CatalogosGenerales.TelefonosEmergencia.DTOs` | 2 |
| `CatalogosGenerales/TelefonosEmergencia/EndPoints` | `LuxuryApp.Application.EndPoints` | `LuxuryApp.Application.Modules.AdminLuxuryApp.CatalogosGenerales.TelefonosEmergencia.EndPoints` | 1 |
| `CatalogosGenerales/TelefonosEmergencia/Interfaces` | `LuxuryApp.Application.Interfaces` | `LuxuryApp.Application.Modules.AdminLuxuryApp.CatalogosGenerales.TelefonosEmergencia.Interfaces` | 1 |
| `CatalogosGenerales/TelefonosEmergencia/Services` | `LuxuryApp.Application.Services` | `LuxuryApp.Application.Modules.AdminLuxuryApp.CatalogosGenerales.TelefonosEmergencia.Services` | 1 |
| `CatalogosGenerales/UsoCfdi/DTOs` | `LuxuryApp.Application.DTOs` | `LuxuryApp.Application.Modules.AdminLuxuryApp.CatalogosGenerales.UsoCfdi.DTOs` | 2 |
| `CatalogosGenerales/UsoCfdi/EndPoints` | `LuxuryApp.Application.EndPoints` | `LuxuryApp.Application.Modules.AdminLuxuryApp.CatalogosGenerales.UsoCfdi.EndPoints` | 1 |
| `CatalogosGenerales/UsoCfdi/Interfaces` | `LuxuryApp.Application.Interfaces` | `LuxuryApp.Application.Modules.AdminLuxuryApp.CatalogosGenerales.UsoCfdi.Interfaces` | 1 |
| `CatalogosGenerales/UsoCfdi/Services` | `LuxuryApp.Application.Interfaces` | `LuxuryApp.Application.Modules.AdminLuxuryApp.CatalogosGenerales.UsoCfdi.Services` | 1 |
| `CatalogosGenerales/WorkPositionSchedule/DTOs` | `LuxuryApp.Application.DTOs` | `LuxuryApp.Application.Modules.AdminLuxuryApp.CatalogosGenerales.WorkPositionSchedule.DTOs` | 8 |
| `CatalogosGenerales/WorkPositionSchedule/EndPoints` | `LuxuryApp.Application.EndPoints` | `LuxuryApp.Application.Modules.AdminLuxuryApp.CatalogosGenerales.WorkPositionSchedule.EndPoints` | 1 |
| `CatalogosGenerales/WorkPositionSchedule/Interfaces` | `LuxuryApp.Application.Interfaces` | `LuxuryApp.Application.Modules.AdminLuxuryApp.CatalogosGenerales.WorkPositionSchedule.Interfaces` | 1 |
| `CatalogosGenerales/WorkPositionSchedule/Services` | `LuxuryApp.Application.Services` | `LuxuryApp.Application.Modules.AdminLuxuryApp.CatalogosGenerales.WorkPositionSchedule.Services` | 1 |
| `ConfiguracionSistema/AsambleaChecklistTemplate/DTOs` | `LuxuryApp.Application.DTOs` | `LuxuryApp.Application.Modules.AdminLuxuryApp.ConfiguracionSistema.AsambleaChecklistTemplate.DTOs` | 2 |
| `ConfiguracionSistema/AsambleaChecklistTemplate/EndPoints` | `LuxuryApp.Application.EndPoints` | `LuxuryApp.Application.Modules.AdminLuxuryApp.ConfiguracionSistema.AsambleaChecklistTemplate.EndPoints` | 1 |
| `ConfiguracionSistema/AsambleaChecklistTemplate/Interfaces` | `LuxuryApp.Application.Services` | `LuxuryApp.Application.Modules.AdminLuxuryApp.ConfiguracionSistema.AsambleaChecklistTemplate.Interfaces` | 1 |
| `ConfiguracionSistema/AsambleaChecklistTemplate/Services` | `LuxuryApp.Application.Services` | `LuxuryApp.Application.Modules.AdminLuxuryApp.ConfiguracionSistema.AsambleaChecklistTemplate.Services` | 1 |
| `GestionDeCliente/CustomerAddress/EndPoints` | `LuxuryApp.Application.EndPoints` | `LuxuryApp.Application.Modules.AdminLuxuryApp.GestionDeCliente.CustomerAddress.EndPoints` | 1 |
| `GestionDeCliente/CustomerAddress/Interfaces` | `LuxuryApp.Application.Interfaces` | `LuxuryApp.Application.Modules.AdminLuxuryApp.GestionDeCliente.CustomerAddress.Interfaces` | 1 |
| `GestionDeCliente/CustomerAddress/Services` | `LuxuryApp.Application.Services` | `LuxuryApp.Application.Modules.AdminLuxuryApp.GestionDeCliente.CustomerAddress.Services` | 1 |
| `GestionDeCliente/CustomerDataCompany/EndPoints` | `LuxuryApp.Application.EndPoints` | `LuxuryApp.Application.Modules.AdminLuxuryApp.GestionDeCliente.CustomerDataCompany.EndPoints` | 1 |
| `GestionDeCliente/CustomerDataCompany/Interfaces` | `LuxuryApp.Application.Interfaces` | `LuxuryApp.Application.Modules.AdminLuxuryApp.GestionDeCliente.CustomerDataCompany.Interfaces` | 1 |
| `GestionDeCliente/CustomerDataCompany/Services` | `LuxuryApp.Application.Services` | `LuxuryApp.Application.Modules.AdminLuxuryApp.GestionDeCliente.CustomerDataCompany.Services` | 1 |
| `GestionDeCliente/CustomerImage/Interfaces` | `LuxuryApp.Application.Interfaces` | `LuxuryApp.Application.Modules.AdminLuxuryApp.GestionDeCliente.CustomerImage.Interfaces` | 1 |
| `GestionDeCliente/CustomerImage/Services` | `LuxuryApp.Application.Services` | `LuxuryApp.Application.Modules.AdminLuxuryApp.GestionDeCliente.CustomerImage.Services` | 1 |
| `GestionDeCliente/CustomerLocations/EndPoints` | `LuxuryApp.Application.EndPoints` | `LuxuryApp.Application.Modules.AdminLuxuryApp.GestionDeCliente.CustomerLocations.EndPoints` | 1 |
| `GestionDeCliente/CustomerLocations/Interfaces` | `LuxuryApp.Application.Interfaces` | `LuxuryApp.Application.Modules.AdminLuxuryApp.GestionDeCliente.CustomerLocations.Interfaces` | 1 |
| `GestionDeCliente/CustomerLocations/Mapping` | `LuxuryApp.Application.Mapping` | `LuxuryApp.Application.Modules.AdminLuxuryApp.GestionDeCliente.CustomerLocations.Mapping` | 1 |
| `GestionDeCliente/CustomerLocations/Services` | `LuxuryApp.Application.Services` | `LuxuryApp.Application.Modules.AdminLuxuryApp.GestionDeCliente.CustomerLocations.Services` | 1 |
| `GestionDeCliente/CustomerModul/DTOs` | `LuxuryApp.Application.DTOs` | `LuxuryApp.Application.Modules.AdminLuxuryApp.GestionDeCliente.CustomerModul.DTOs` | 6 |
| `GestionDeCliente/CustomerModul/EndPoints` | `LuxuryApp.Application.EndPoints` | `LuxuryApp.Application.Modules.AdminLuxuryApp.GestionDeCliente.CustomerModul.EndPoints` | 1 |
| `GestionDeCliente/CustomerModul/Interfaces` | `LuxuryApp.Application.Interfaces` | `LuxuryApp.Application.Modules.AdminLuxuryApp.GestionDeCliente.CustomerModul.Interfaces` | 1 |
| `GestionDeCliente/CustomerModul/Services` | `LuxuryApp.Application.Services` | `LuxuryApp.Application.Modules.AdminLuxuryApp.GestionDeCliente.CustomerModul.Services` | 1 |
| `GestionDeCliente/Customers/DTOs` | `LuxuryApp.Application.DTOs` | `LuxuryApp.Application.Modules.AdminLuxuryApp.GestionDeCliente.Customers.DTOs` | 9 |
| `GestionDeCliente/Customers/EndPoints` | `LuxuryApp.Application.EndPoints` | `LuxuryApp.Application.Modules.AdminLuxuryApp.GestionDeCliente.Customers.EndPoints` | 2 |
| `GestionDeCliente/Customers/Entities` | `LuxuryApp.Application.Infrastructure.Data.Entities` | `LuxuryApp.Application.Modules.AdminLuxuryApp.GestionDeCliente.Customers.Entities` | 6 |
| `GestionDeCliente/Customers/Interfaces` | `LuxuryApp.Application.Interfaces` | `LuxuryApp.Application.Modules.AdminLuxuryApp.GestionDeCliente.Customers.Interfaces` | 2 |
| `GestionDeCliente/Customers/Mapping` | `LuxuryApp.Application.Mapping` | `LuxuryApp.Application.Modules.AdminLuxuryApp.GestionDeCliente.Customers.Mapping` | 1 |
| `GestionDeCliente/Customers/Repositories` | `LuxuryApp.Application.Services` | `LuxuryApp.Application.Modules.AdminLuxuryApp.GestionDeCliente.Customers.Repositories` | 1 |
| `GestionDeCliente/Customers/Services` | `LuxuryApp.Application.Interfaces` | `LuxuryApp.Application.Modules.AdminLuxuryApp.GestionDeCliente.Customers.Services` | 1 |
| `GestionDeCliente/ModuleApps/DTOs` | `LuxuryApp.Application.DTOs` | `LuxuryApp.Application.Modules.AdminLuxuryApp.GestionDeCliente.ModuleApps.DTOs` | 3 |
| `GestionDeCliente/ModuleApps/EndPoints` | `LuxuryApp.Application.EndPoints` | `LuxuryApp.Application.Modules.AdminLuxuryApp.GestionDeCliente.ModuleApps.EndPoints` | 1 |
| `GestionDeCliente/ModuleApps/Interfaces` | `LuxuryApp.Application.Interfaces` | `LuxuryApp.Application.Modules.AdminLuxuryApp.GestionDeCliente.ModuleApps.Interfaces` | 1 |
| `GestionDeCliente/ModuleApps/Services` | `LuxuryApp.Application.Services` | `LuxuryApp.Application.Modules.AdminLuxuryApp.GestionDeCliente.ModuleApps.Services` | 1 |
| `Infraestructura/AppImplementationTracking/EmployeeDataValidation/DTOs` | `LuxuryApp.Application.DTOs` | `LuxuryApp.Application.Modules.AdminLuxuryApp.Infraestructura.AppImplementationTracking.EmployeeDataValidation.DTOs` | 1 |
| `Infraestructura/AppImplementationTracking/EmployeeDataValidation/Interfaces` | `LuxuryApp.Application.Interfaces` | `LuxuryApp.Application.Modules.AdminLuxuryApp.Infraestructura.AppImplementationTracking.EmployeeDataValidation.Interfaces` | 1 |
| `Infraestructura/AppImplementationTracking/EmployeeDataValidation/Services` | `LuxuryApp.Application.Services` | `LuxuryApp.Application.Modules.AdminLuxuryApp.Infraestructura.AppImplementationTracking.EmployeeDataValidation.Services` | 1 |
| `Infraestructura/AppImplementationTracking/EndPoints` | `LuxuryApp.Application.EndPoints` | `LuxuryApp.Application.Modules.AdminLuxuryApp.Infraestructura.AppImplementationTracking.EndPoints` | 1 |
| `Infraestructura/AppImplementationTracking/MenuItems/DTOs` | `LuxuryApp.Application.DTOs` | `LuxuryApp.Application.Modules.AdminLuxuryApp.Infraestructura.AppImplementationTracking.MenuItems.DTOs` | 2 |
| `Infraestructura/AppImplementationTracking/MenuItems/EndPoints` | `LuxuryApp.Application.EndPoints` | `LuxuryApp.Application.Modules.AdminLuxuryApp.Infraestructura.AppImplementationTracking.MenuItems.EndPoints` | 1 |
| `Infraestructura/AppImplementationTracking/MenuItems/Interfaces` | `LuxuryApp.Application.Interfaces` | `LuxuryApp.Application.Modules.AdminLuxuryApp.Infraestructura.AppImplementationTracking.MenuItems.Interfaces` | 1 |
| `Infraestructura/AppImplementationTracking/MenuItems/Services` | `LuxuryApp.Application.Services` | `LuxuryApp.Application.Modules.AdminLuxuryApp.Infraestructura.AppImplementationTracking.MenuItems.Services` | 1 |
| `Infraestructura/AppImplementationTracking/OrgStructureValidation/DTOs` | `LuxuryApp.Application.DTOs` | `LuxuryApp.Application.Modules.AdminLuxuryApp.Infraestructura.AppImplementationTracking.OrgStructureValidation.DTOs` | 1 |
| `Infraestructura/AppImplementationTracking/OrgStructureValidation/Interfaces` | `LuxuryApp.Application.Interfaces` | `LuxuryApp.Application.Modules.AdminLuxuryApp.Infraestructura.AppImplementationTracking.OrgStructureValidation.Interfaces` | 1 |
| `Infraestructura/AppImplementationTracking/OrgStructureValidation/Services` | `LuxuryApp.Application.Services` | `LuxuryApp.Application.Modules.AdminLuxuryApp.Infraestructura.AppImplementationTracking.OrgStructureValidation.Services` | 1 |
| `Infraestructura/Jobs/Catalog` | `LuxuryApp.Application.Features.Jobs.Catalog` | `LuxuryApp.Application.Modules.AdminLuxuryApp.Infraestructura.Jobs.Catalog` | 1 |
| `Infraestructura/Jobs/Interfaces` | `LuxuryApp.Application.Features.Jobs.Workers` | `LuxuryApp.Application.Modules.AdminLuxuryApp.Infraestructura.Jobs.Interfaces` | 1 |
| `Infraestructura/Jobs/Workers` | `LuxuryApp.Application.Features.Jobs.Workers, LuxuryApp.Application.Modules.AdminLuxuryApp.Infraestructura.Jobs.Workers` | `LuxuryApp.Application.Modules.AdminLuxuryApp.Infraestructura.Jobs.Workers` | 23 |
| `Infraestructura/SignalRTest/EndPoints` | `LuxuryApp.Application.EndPoints` | `LuxuryApp.Application.Modules.AdminLuxuryApp.Infraestructura.SignalRTest.EndPoints` | 1 |
| `Infraestructura/UpdateDataBase/DTOs` | `LuxuryApp.Application.DTOs` | `LuxuryApp.Application.Modules.AdminLuxuryApp.Infraestructura.UpdateDataBase.DTOs` | 1 |
| `Infraestructura/UpdateDataBase/EndPoints` | `LuxuryApp.Application.EndPoints` | `LuxuryApp.Application.Modules.AdminLuxuryApp.Infraestructura.UpdateDataBase.EndPoints` | 1 |
| `Infraestructura/UpdateDataBase/Interfaces` | `LuxuryApp.Application.Interfaces` | `LuxuryApp.Application.Modules.AdminLuxuryApp.Infraestructura.UpdateDataBase.Interfaces` | 1 |
| `Infraestructura/UpdateDataBase/Services` | `LuxuryApp.Application.Services` | `LuxuryApp.Application.Modules.AdminLuxuryApp.Infraestructura.UpdateDataBase.Services` | 1 |
| `Infraestructura/UserValidation/EndPoints` | `LuxuryApp.Application.EndPoints` | `LuxuryApp.Application.Modules.AdminLuxuryApp.Infraestructura.UserValidation.EndPoints` | 1 |
| `SeguridadPermisos/Access/ApplicationRole/DTOs` | `LuxuryApp.Application.DTOs` | `LuxuryApp.Application.Modules.AdminLuxuryApp.SeguridadPermisos.Access.ApplicationRole.DTOs` | 3 |
| `SeguridadPermisos/Access/ApplicationRole/EndPoints` | `LuxuryApp.Application.EndPoints` | `LuxuryApp.Application.Modules.AdminLuxuryApp.SeguridadPermisos.Access.ApplicationRole.EndPoints` | 1 |
| `SeguridadPermisos/Access/ApplicationRole/Interface` | `LuxuryApp.Application.Interfaces` | `LuxuryApp.Application.Modules.AdminLuxuryApp.SeguridadPermisos.Access.ApplicationRole.Interface` | 1 |
| `SeguridadPermisos/Access/ApplicationRole/Mapping` | `LuxuryApp.Application.Mapping` | `LuxuryApp.Application.Modules.AdminLuxuryApp.SeguridadPermisos.Access.ApplicationRole.Mapping` | 1 |
| `SeguridadPermisos/Access/ApplicationRole/Service` | `LuxuryApp.Application.Services` | `LuxuryApp.Application.Modules.AdminLuxuryApp.SeguridadPermisos.Access.ApplicationRole.Service` | 1 |
| `SeguridadPermisos/Access/ApprovalRules/DTOs` | `LuxuryApp.Application.DTOs` | `LuxuryApp.Application.Modules.AdminLuxuryApp.SeguridadPermisos.Access.ApprovalRules.DTOs` | 3 |
| `SeguridadPermisos/Access/ApprovalRules/EndPoints` | `LuxuryApp.Application.EndPoints` | `LuxuryApp.Application.Modules.AdminLuxuryApp.SeguridadPermisos.Access.ApprovalRules.EndPoints` | 1 |
| `SeguridadPermisos/Access/ApprovalRules/Interfaces` | `LuxuryApp.Application.Interfaces` | `LuxuryApp.Application.Modules.AdminLuxuryApp.SeguridadPermisos.Access.ApprovalRules.Interfaces` | 1 |
| `SeguridadPermisos/Access/ApprovalRules/Services` | `LuxuryApp.Application.Services` | `LuxuryApp.Application.Modules.AdminLuxuryApp.SeguridadPermisos.Access.ApprovalRules.Services` | 1 |
| `SeguridadPermisos/Access/Authorization/DTOs` | `LuxuryApp.Application.DTOs` | `LuxuryApp.Application.Modules.AdminLuxuryApp.SeguridadPermisos.Access.Authorization.DTOs` | 4 |
| `SeguridadPermisos/Access/Authorization/Services` | `LuxuryApp.Application.Interfaces` | `LuxuryApp.Application.Modules.AdminLuxuryApp.SeguridadPermisos.Access.Authorization.Services` | 1 |
| `SeguridadPermisos/Access/Entities` | `LuxuryApp.Application.Infrastructure.Data.Entities` | `LuxuryApp.Application.Modules.AdminLuxuryApp.SeguridadPermisos.Access.Entities` | 8 |
| `SeguridadPermisos/Access/ModuleAppRol/DTOs` | `LuxuryApp.Application.DTOs` | `LuxuryApp.Application.Modules.AdminLuxuryApp.SeguridadPermisos.Access.ModuleAppRol.DTOs` | 4 |
| `SeguridadPermisos/Access/ModuleAppRol/EndPoints` | `LuxuryApp.Application.EndPoints` | `LuxuryApp.Application.Modules.AdminLuxuryApp.SeguridadPermisos.Access.ModuleAppRol.EndPoints` | 1 |
| `SeguridadPermisos/Access/ModuleAppRol/Interfaces` | `LuxuryApp.Application.Interfaces` | `LuxuryApp.Application.Modules.AdminLuxuryApp.SeguridadPermisos.Access.ModuleAppRol.Interfaces` | 1 |
| `SeguridadPermisos/Access/ModuleAppRol/Services` | `LuxuryApp.Application.Services` | `LuxuryApp.Application.Modules.AdminLuxuryApp.SeguridadPermisos.Access.ModuleAppRol.Services` | 1 |
| `SeguridadPermisos/Access/RoleAssignment/Services` | `LuxuryApp.Application.Services` | `LuxuryApp.Application.Modules.AdminLuxuryApp.SeguridadPermisos.Access.RoleAssignment.Services` | 1 |
| `SeguridadPermisos/Access/UserAccounts/EndPoints` | `LuxuryApp.Application.EndPoints` | `LuxuryApp.Application.Modules.AdminLuxuryApp.SeguridadPermisos.Access.UserAccounts.EndPoints` | 1 |
| `SeguridadPermisos/Access/UserAccounts/Interfaces` | `LuxuryApp.Application.Interfaces` | `LuxuryApp.Application.Modules.AdminLuxuryApp.SeguridadPermisos.Access.UserAccounts.Interfaces` | 1 |
| `SeguridadPermisos/Access/UserAccounts/Services` | `LuxuryApp.Application.Services` | `LuxuryApp.Application.Modules.AdminLuxuryApp.SeguridadPermisos.Access.UserAccounts.Services` | 1 |

## Fase 9: AuthLuxuryApp (Vertical Slices)

- Modulo objetivo real: `LuxuryApp.Application/Modules/AuthLuxuryApp`.
- Rescate de entidades: omitido. En `SystemLuxuryApp/Domain/Entities` no quedaron tokens, refresh tokens, sesiones, login logs ni entidades de autenticacion; `System-AI/AiChatSession.cs` se conservo en SystemLuxuryApp por pertenecer al modulo de IA.
- Aplanamiento fisico: 1 carpeta movida. Se movio LuxuryApp.Application/Modules/AuthLuxuryApp/Infrastructure/Identity/ a LuxuryApp.Application/Modules/AuthLuxuryApp/Identity/ y se elimino la capa Infrastructure vacia.
- Sincronizacion de namespaces: 44 archivos .cs actualizados a 23 namespaces path-based bajo LuxuryApp.Application.Modules.AuthLuxuryApp.
- Consumidores ajustados: `LuxuryApp.Application/GlobalUsings.cs`, `LuxuryApp.Api/GlobalUsings.cs`, `LuxuryApp.Tests/GlobalUsings.cs`, plantillas Razor de autenticacion y `RecoveryByCodeTests.cs`.
- Conflicto de nombre resuelto: `AccesoCustomers` se califico con `global::LuxuryApp.Application.Modules.AdminLuxuryApp.SeguridadPermisos.Access.Entities.AccesoCustomers` en servicios de Auth donde chocaba con el submodulo `Auth/AccesoCustomers`.
- Verificacion estructural: 0 carpetas `Domain`, `Application` o `Infrastructure` restantes dentro de `AuthLuxuryApp`; 0 namespaces fuera de ruta en los 44 archivos migrados.
- Verificacion de build: `dotnet build LuxuryApp.sln -v:q -p:OutputPath=.../work/auth-vertical-bin/` termino con 0 errores y 15 advertencias.

### Namespaces finales de AuthLuxuryApp

| Archivos | Namespace final | Namespace anterior |
|---:|---|---|
| 2 | $(@{Namespace=LuxuryApp.Application.Modules.AuthLuxuryApp.AccountRecovery.DTOs; Files=2; Previous=LuxuryApp.Application.DTOs}.Namespace) | $(@{Namespace=LuxuryApp.Application.Modules.AuthLuxuryApp.AccountRecovery.DTOs; Files=2; Previous=LuxuryApp.Application.DTOs}.Previous) |
| 1 | $(@{Namespace=LuxuryApp.Application.Modules.AuthLuxuryApp.AccountRecovery.EndPoints; Files=1; Previous=LuxuryApp.Application.EndPoints}.Namespace) | $(@{Namespace=LuxuryApp.Application.Modules.AuthLuxuryApp.AccountRecovery.EndPoints; Files=1; Previous=LuxuryApp.Application.EndPoints}.Previous) |
| 2 | $(@{Namespace=LuxuryApp.Application.Modules.AuthLuxuryApp.AccountRecovery.Interfaces; Files=2; Previous=LuxuryApp.Application.Interfaces}.Namespace) | $(@{Namespace=LuxuryApp.Application.Modules.AuthLuxuryApp.AccountRecovery.Interfaces; Files=2; Previous=LuxuryApp.Application.Interfaces}.Previous) |
| 1 | $(@{Namespace=LuxuryApp.Application.Modules.AuthLuxuryApp.AccountRecovery.SendEmailGlobal.SendEmail.Services; Files=1; Previous=LuxuryApp.Modules.Configuration.Modules.Autenticacion.AccountRecovery.SendEmailGlobal.Interfaces}.Namespace) | $(@{Namespace=LuxuryApp.Application.Modules.AuthLuxuryApp.AccountRecovery.SendEmailGlobal.SendEmail.Services; Files=1; Previous=LuxuryApp.Modules.Configuration.Modules.Autenticacion.AccountRecovery.SendEmailGlobal.Interfaces}.Previous) |
| 3 | $(@{Namespace=LuxuryApp.Application.Modules.AuthLuxuryApp.AccountRecovery.SendEmailGlobal.SendEmail.ViewModels; Files=3; Previous=LuxuryApp.Modules.Configuration.Modules.Autenticacion.AccountRecovery.SendEmailGlobal.SendEmail.ViewModels}.Namespace) | $(@{Namespace=LuxuryApp.Application.Modules.AuthLuxuryApp.AccountRecovery.SendEmailGlobal.SendEmail.ViewModels; Files=3; Previous=LuxuryApp.Modules.Configuration.Modules.Autenticacion.AccountRecovery.SendEmailGlobal.SendEmail.ViewModels}.Previous) |
| 2 | $(@{Namespace=LuxuryApp.Application.Modules.AuthLuxuryApp.AccountRecovery.Services; Files=2; Previous=LuxuryApp.Application.Services}.Namespace) | $(@{Namespace=LuxuryApp.Application.Modules.AuthLuxuryApp.AccountRecovery.Services; Files=2; Previous=LuxuryApp.Application.Services}.Previous) |
| 1 | $(@{Namespace=LuxuryApp.Application.Modules.AuthLuxuryApp.Auth.AccesoCustomers.DTOs; Files=1; Previous=LuxuryApp.Application.DTOs}.Namespace) | $(@{Namespace=LuxuryApp.Application.Modules.AuthLuxuryApp.Auth.AccesoCustomers.DTOs; Files=1; Previous=LuxuryApp.Application.DTOs}.Previous) |
| 1 | $(@{Namespace=LuxuryApp.Application.Modules.AuthLuxuryApp.Auth.AccesoCustomers.Interfaces; Files=1; Previous=LuxuryApp.Application.Interfaces}.Namespace) | $(@{Namespace=LuxuryApp.Application.Modules.AuthLuxuryApp.Auth.AccesoCustomers.Interfaces; Files=1; Previous=LuxuryApp.Application.Interfaces}.Previous) |
| 1 | $(@{Namespace=LuxuryApp.Application.Modules.AuthLuxuryApp.Auth.AccesoCustomers.Services; Files=1; Previous=LuxuryApp.Application.Services}.Namespace) | $(@{Namespace=LuxuryApp.Application.Modules.AuthLuxuryApp.Auth.AccesoCustomers.Services; Files=1; Previous=LuxuryApp.Application.Services}.Previous) |
| 9 | $(@{Namespace=LuxuryApp.Application.Modules.AuthLuxuryApp.Auth.DTOs; Files=9; Previous=LuxuryApp.Application.DTOs}.Namespace) | $(@{Namespace=LuxuryApp.Application.Modules.AuthLuxuryApp.Auth.DTOs; Files=9; Previous=LuxuryApp.Application.DTOs}.Previous) |
| 2 | $(@{Namespace=LuxuryApp.Application.Modules.AuthLuxuryApp.Auth.EndPoints; Files=2; Previous=LuxuryApp.Application.EndPoints}.Namespace) | $(@{Namespace=LuxuryApp.Application.Modules.AuthLuxuryApp.Auth.EndPoints; Files=2; Previous=LuxuryApp.Application.EndPoints}.Previous) |
| 4 | $(@{Namespace=LuxuryApp.Application.Modules.AuthLuxuryApp.Auth.Interfaces; Files=4; Previous=LuxuryApp.Application.Interfaces}.Namespace) | $(@{Namespace=LuxuryApp.Application.Modules.AuthLuxuryApp.Auth.Interfaces; Files=4; Previous=LuxuryApp.Application.Interfaces}.Previous) |
| 1 | $(@{Namespace=LuxuryApp.Application.Modules.AuthLuxuryApp.Auth.Mapping; Files=1; Previous=LuxuryApp.Application.Mappings}.Namespace) | $(@{Namespace=LuxuryApp.Application.Modules.AuthLuxuryApp.Auth.Mapping; Files=1; Previous=LuxuryApp.Application.Mappings}.Previous) |
| 4 | $(@{Namespace=LuxuryApp.Application.Modules.AuthLuxuryApp.Auth.Services; Files=4; Previous=LuxuryApp.Application.Interfaces, LuxuryApp.Application.Services}.Namespace) | $(@{Namespace=LuxuryApp.Application.Modules.AuthLuxuryApp.Auth.Services; Files=4; Previous=LuxuryApp.Application.Interfaces, LuxuryApp.Application.Services}.Previous) |
| 1 | $(@{Namespace=LuxuryApp.Application.Modules.AuthLuxuryApp.Identity; Files=1; Previous=LuxuryApp.Infrastructure.Identity}.Namespace) | $(@{Namespace=LuxuryApp.Application.Modules.AuthLuxuryApp.Identity; Files=1; Previous=LuxuryApp.Infrastructure.Identity}.Previous) |
| 2 | $(@{Namespace=LuxuryApp.Application.Modules.AuthLuxuryApp.PasswordManager.DTOs; Files=2; Previous=LuxuryApp.Application.DTOs}.Namespace) | $(@{Namespace=LuxuryApp.Application.Modules.AuthLuxuryApp.PasswordManager.DTOs; Files=2; Previous=LuxuryApp.Application.DTOs}.Previous) |
| 1 | $(@{Namespace=LuxuryApp.Application.Modules.AuthLuxuryApp.PasswordManager.EndPoints; Files=1; Previous=LuxuryApp.Application.EndPoints}.Namespace) | $(@{Namespace=LuxuryApp.Application.Modules.AuthLuxuryApp.PasswordManager.EndPoints; Files=1; Previous=LuxuryApp.Application.EndPoints}.Previous) |
| 1 | $(@{Namespace=LuxuryApp.Application.Modules.AuthLuxuryApp.PasswordManager.Interfaces; Files=1; Previous=LuxuryApp.Application.Interfaces}.Namespace) | $(@{Namespace=LuxuryApp.Application.Modules.AuthLuxuryApp.PasswordManager.Interfaces; Files=1; Previous=LuxuryApp.Application.Interfaces}.Previous) |
| 1 | $(@{Namespace=LuxuryApp.Application.Modules.AuthLuxuryApp.PasswordManager.Mappers; Files=1; Previous=LuxuryApp.Application.Features.PasswordManager.Mappers}.Namespace) | $(@{Namespace=LuxuryApp.Application.Modules.AuthLuxuryApp.PasswordManager.Mappers; Files=1; Previous=LuxuryApp.Application.Features.PasswordManager.Mappers}.Previous) |
| 1 | $(@{Namespace=LuxuryApp.Application.Modules.AuthLuxuryApp.PasswordManager.Services; Files=1; Previous=LuxuryApp.Application.Services}.Namespace) | $(@{Namespace=LuxuryApp.Application.Modules.AuthLuxuryApp.PasswordManager.Services; Files=1; Previous=LuxuryApp.Application.Services}.Previous) |
| 1 | $(@{Namespace=LuxuryApp.Application.Modules.AuthLuxuryApp.ProfileUsers.EndPoints; Files=1; Previous=LuxuryApp.Application.EndPoints}.Namespace) | $(@{Namespace=LuxuryApp.Application.Modules.AuthLuxuryApp.ProfileUsers.EndPoints; Files=1; Previous=LuxuryApp.Application.EndPoints}.Previous) |
| 1 | $(@{Namespace=LuxuryApp.Application.Modules.AuthLuxuryApp.ProfileUsers.Interfaces; Files=1; Previous=LuxuryApp.Application.Interfaces}.Namespace) | $(@{Namespace=LuxuryApp.Application.Modules.AuthLuxuryApp.ProfileUsers.Interfaces; Files=1; Previous=LuxuryApp.Application.Interfaces}.Previous) |
| 1 | $(@{Namespace=LuxuryApp.Application.Modules.AuthLuxuryApp.ProfileUsers.Services; Files=1; Previous=LuxuryApp.Application.Services}.Namespace) | $(@{Namespace=LuxuryApp.Application.Modules.AuthLuxuryApp.ProfileUsers.Services; Files=1; Previous=LuxuryApp.Application.Services}.Previous) |

