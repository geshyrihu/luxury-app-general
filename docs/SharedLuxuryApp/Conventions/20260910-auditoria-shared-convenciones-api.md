# 📊 Reporte de Auditoría - luxuryapp-api
**Fecha:** 10 de septiembre de 2026
**Ruta analizada:** `D:\repos\luxuryapp-api\` (solución .NET en `api\`: `LuxuryApp.Api`, `LuxuryApp.Application`, `LuxuryApp.Tests`)

**Alcance del escaneo:** 3,082 archivos `.cs` (3,045 excluyendo `Migrations/`), ignorando `bin/`, `obj/`, `.git/`, `.vs/`, `node_modules/`. Análisis ejecutado con scripts estáticos (Python + ripgrep) sobre carpetas, namespaces, declaraciones de tipos, `DbContext`, atributos `[Table]` y carpetas `DTOs/`.

---

## ✅ Resumen Ejecutivo

El proyecto muestra un **cumplimiento estimado del 74%** sobre las 7 reglas auditadas. La estructura general es sólida: la organización por módulos con subcarpetas `Entities/`, `DTOs/`, `Services/`, `Interfaces/` y `EndPoints/` está muy extendida y en plural (R1 casi íntegra), y **no existe ni una sola colisión carpeta/clase** (R7 cumple al 100%). Las brechas se concentran en **R4** (47 tablas mapeadas con nombre singular, ~14% de las 334 entidades mapeadas), **R6** (79 archivos de DTOs que agrupan 2+ DTOs raíz distintos de diferentes entidades) y **R3** (22 DbSets cuyo nombre no está en plural, ~7% de 333). El caso más importante de R2 es sistémico pero mecánico: **121 endpoints declaran la clase `XxxEndPoints` en el archivo `XxxEndpoints.cs`** (inconsistencia de capitalización "EndPoints" vs "Endpoints"), más DTOs definidos con un nombre distinto al de su archivo. **Estado general: 🟡 Aceptable con deuda técnica de naming concentrada y corregible de forma masiva con refactoring automatizado (IDE Rename) y migraciones controladas.**

| Métrica | Valor |
|---|---|
| Archivos `.cs` analizados | 3,082 (3,045 sin `Migrations/`) |
| Entidades mapeadas con `[Table]` | 334 (333 + `Credential`) |
| Propiedades `DbSet<T>` | 333 en 11 `DbContext` |
| Clases con sufijo DTO | 1,245 en 986 archivos de carpetas `DTOs/` |
| Archivos DTO con múltiples DTOs raíz mezclados | 79 |
| Colisiones carpeta/clase (R7) | **0** |

---

## 🟢 Reglas Cumplidas

### ✅ R1 - Carpeta / Namespace en plural (≈99%)
La convención plural para carpetas agrupadoras está firmemente establecida y es mayoritaria en toda la solución:
- `Entities/` (342 archivos), `DTOs/` (1,008), `Services/` (459), `Interfaces/` (357), `EndPoints/` (285), `Enums/` (154), `Migrations/`, `Seeds/`, `Filters/`, `Hubs/`.
- Namespaces coherentes: `LuxuryApp.Application.Modules.OperationsLuxuryApp.Inventory.Entities`, `LuxuryApp.Application.Infrastructure.Data`, etc.
- Excepciones menores (ver incumplimientos): 4 archivos en carpetas singulares `Interface/` o `Service/`.

### ✅ R2 - Clase y archivo en singular (≈92%, parcial)
La gran mayoría de clases —incluidas todas las entidades de negocio— están en singular y coinciden con su archivo:
- `Bank.cs` → `class Bank`, `Customer.cs` → `class Customer`, `Provider.cs` → `class Provider`, `Medidor.cs` → `class Medidor`, `Charge.cs` → `class Charge`.
- Casos correctos donde el plural del nombre es semánticamente singular: `Equipment` (`[Table("Equipment")]`), `Address` (`DbSet<Address> Addresses`).
- Incumplimientos: 250 archivos cuyo tipo principal no coincide con el nombre del archivo (121 de ellos por el patrón mecánico `XxxEndpoints.cs` / `class XxxEndPoints`, que es R2 de capitalización; el resto son DTOs renombrados y archivos multi-tipo). Ver detalle en la sección 🔴.

### ✅ R7 - Sin colisiones folder/clase (100%)
**Cero colisiones** entre nombres de carpetas y clases contenidas (verificación directa y case-insensitive, incluyendo el patrón análogo a `Banks/Bank.cs` con carpeta-feature que contenga su `Entities/`):
- No existe `Banks/Bank.cs` ni ninguna carpeta con el mismo nombre (ignorando mayúsculas) que una clase dentro de ella.
- La organización por feature (`Inventory/Entities/InventarioLlave.cs`, `Nomina/Entities/EvidenciaNomina.cs`) separa correctamente carpeta-contenedor de clase-entidad.
- Único caso límite cosmético (no colisión real): `InspectionReviews.cs` contiene `class InspectionReview` (nombre de archivo en plural, clase en singular y correcta).

---

## 🔴 Incumplimientos Detectados (Crítico)

### ❌ R4 - Tabla en plural con atributo [Table] — **86% (47 de 334 tablas en singular)**
- **Archivo(s) afectado(s):** 47 entidades. Ejemplos representativos (línea del atributo):
  - `LuxuryApp.Application/Modules/MantenimientoLuxuryApp/Medidores/Entities/Medidor.cs` (línea 5) → `[Table("Medidor")]`
  - `LuxuryApp.Application/Modules/MantenimientoLuxuryApp/Piscinas/Entities/Piscina.cs` (línea 5) → `[Table("Piscina")]`
  - `LuxuryApp.Application/Modules/MantenimientoLuxuryApp/MaintenanceLog/Entities/BitacoraMantenimiento.cs` (línea 5) → `[Table("BitacoraMantenimiento")]`
  - `LuxuryApp.Application/Modules/OperationsLuxuryApp/Comite/ComitesVigilancia/Entities/ComiteVigilancia.cs` (línea 5) → `[Table("ComiteVigilancia")]`
  - `LuxuryApp.Application/Modules/SupplierLuxuryApp/Providers/Entities/Provider.cs` (línea 6) → `[Table("Provider")]`
  - `LuxuryApp.Application/Infrastructure/Vault/Entities/AiKnowledgeBase.cs` (línea 3) → `[Table("AiKnowledgeBase")]`
  - `LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/TimeOff/Entities/LeaveRequestHistory.cs` (línea 7) → `[Table("LeaveRequestHistory")]`
  - `LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/EmployeeFile/Entities/EmployeeBankData.cs` → `[Table("EmployeeBankData")]` (ídem `EmployeeClinicalData`, `EmployeeBeneficiary`, `PersonProviderSupport`, `InterviewerMatrix`, `MaintenanceBudgetForecast`, `Equipment`*, `Inventory/*` con tablas descriptivas como `KeyInventory`, `PaintStock`, `WarehouseStock`, `LightingStock`, etc.)
  - **Lista completa de las 47:** `AiKnowledgeBase`, `ProviderBankingInfo`, `PurchaseOrderHistory`, `FinancialLedger`, `BudgetProposalHistory`, `LegalResponsibleHistory`, `MaintenanceBudgetForecast`, `CalendarioMaestro`, `CalendarioMaestroProvider`, `CalendarioMaestroEquipo`, `ElevatorsEmergencyCall`, `ElevatorSparePartsChange`, `EquipmentInspectionCriteria`*, `Equipment`, `MaintenanceCalendar`, `BitacoraMantenimiento`, `Medidor`, `MedidorLectura`, `Piscina`, `PiscinaBitacora`, `RecepcionPipaAgua`, `ControlPrestamoHerramienta`, `ComiteVigilancia`, `DeliveryCriteria`*, `InspectionCriteria`*, `LightingStock`*, `KeyInventory`*, `PaintStock`*, `WarehouseStock`*, `UnitsOfMeasure`, `AssemblySupport`, `RecruitmentCandidateStageHistory`, `EmployeeBankData`, `EmployeeBeneficiary`, `EmployeeClinicalData`, `EmployeePersonData`, `OrganizationHierarchy`, `ExternalStaff`*, `RecruitmentInterviewerMatrix`, `RegistrosChecador`, `SedesChecador`, `PayrollEvidence`, `LeaveRequestHistory`, `VacationRequestHistory`, `PersonProviderSupport`, `Provider` (`*` = inglés masivo/colectivo discutible, marcar como excepción si así se decide).
- **Adicional:** `LuxuryApp.Application/Infrastructure/Vault/Entities/Credential.cs` — entidad mapeada real (`DbSet<Credential> Credentials` en `VaultDbContext.cs:8`) que **carece por completo del atributo `[Table]`** (su tabla sería `Credentials` por convención, pero incumple R4 por omisión).
- **Problema:** R4 exige que toda entidad declare `[Table("NombreEnPlural")]`. 47 tablas físicas quedan con nombre singular, generando inconsistencia con las ~287 tablas sí plurales (`Banks`, `Customers`, `Productos`, `CobranzaSaldos`…). ⚠️ *Cambiar el string de `[Table]` altera el nombre de la tabla física: requiere migración EF Core y coordinación con datos existentes.*
- **Corrección sugerida:**
  ```csharp
  // ❌ Actual (Medidor.cs)
  [Table("Medidor")]
  public class Medidor { ... }

  // ✅ Corregido — pluralizar el nombre físico de la tabla + migración EF Core
  [Table("Medidores")]
  public class Medidor { ... }

  // ✅ Para Credential.cs (atributo ausente)
  [Table("Credentials")]
  public class Credential { ... }
  ```
  ```sql
  -- Migración tipo (PostgreSQL/SQL Server según proveedor):
  ALTER TABLE "Medidor" RENAME TO "Medidores";
  ```

### ❌ R6 - Un DTO por clase (un solo DTO raíz por archivo) — **~4% de 986 archivos DTO (79 archivos mezclados)**
- **Archivo(s) afectado(s):** 79 archivos con 2+ DTOs raíz distintos (de entidades distintas). Los más graves por mezclar entidades claramente ajenas:
  - `LuxuryApp.Application/Modules/OperationsLuxuryApp/Task/TaskRecords/DTOs/LegalTaskListItemDTO.cs` → mezcla `LegalTaskListItemDTO`, `TaskStatusUpdateDTO`, `TaskCustomerUpdateDTO`, `LegalPendingReportItemDTO`
  - `LuxuryApp.Application/Modules/ContabilidadLuxuryApp/ContabilidadOnline/DTOs/BancosInversionesDTO.cs` → mezcla `BancosInversionesDTO`, `BancoRowDTO`, `InversionRowDTO`
  - `LuxuryApp.Application/Modules/SupplierLuxuryApp/Purchases/OrdenesCompra/DTOs/PurchaseDetailDTO.cs` → mezcla `PurchaseDetailAsyncDTO`, `PurchaseLineItemDTO`, `PurchaseBudgetDTO`
  - `LuxuryApp.Application/Modules/OperationsLuxuryApp/JuntasMensuales/Minuta/DTOs/ReporteMinutaIndividualDTO.cs` → 9 tipos: `MinutaIndividualDTO` + members + `CreateMinutaPdfDTO` + `MinutaCliente`
  - `LuxuryApp.Application/Modules/RecursosHumanosLuxuryApp/ManualsAndProcesses/DTOs/ManualPasoDTO.cs` → 14 tipos (Templates, Pasos, Versiones, Diagramas)
  - Agregados de módulo (peor offendres por número de raíces): `AspelCobranzaHausDTOs.cs` (17 raíces), `AspelCobranzaHausLocalDTOs.cs` (13), `ManualPasoDTO.cs` (13), `ChekadorEmpleadosDTOs.cs` (6), `ReporteMinutaIndividualDTO.cs` (9), `EquipmentInspectionExecutionDTO.cs` (7), `EquipmentQrLabelDTO.cs` (5).
- **Problema:** R6 establece un DTO (raíz de entidad) por archivo. 79 archivos agrupan DTOs de distintas entidades, lo que dificulta el mantenimiento, genera conflictos de fusión y acopla contextos. (Los archivos `same-root` como `BillingConfigDTO.cs` con `BillingConfigResponseDTO` + `UpsertBillingConfigDTO` se consideran **aceptables**: misma entidad raíz con variantes Create/Update/Response; el estándar del propio proyecto —ver plantillas `_template-dtos.cs`— agrupa variantes de una entidad por archivo.)
- **Corrección sugerida:**
  ```csharp
  // ❌ Actual: LegalTaskListItemDTO.cs contiene DTOs de 3 raíces distintas
  public class LegalTaskListItemDTO { ... }
  public class TaskStatusUpdateDTO { ... }      // otra entidad (Task)
  public class LegalPendingReportItemDTO { ... } // otra raíz (reporte)

  // ✅ Corregido: un archivo por raíz de entidad
  // Task/TaskRecords/DTOs/LegalTaskListItemDTO.cs
  public class LegalTaskListItemDTO { ... }

  // Task/TaskRecords/DTOs/TaskStatusUpdateDTO.cs
  public class TaskStatusUpdateDTO { ... }

  // Task/TaskRecords/DTOs/LegalPendingReportItemDTO.cs
  public class LegalPendingReportItemDTO { ... }
  ```

### ❌ R5 - DTOs con sufijo "DTO" — **97% (31 clases en carpetas DTOs/ sin sufijo)**
- **Archivo(s) afectado(s):** 31 clases dentro de carpetas `DTOs/` que no terminan en `DTO`:
  - `LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/Candidates/CandidateProcesses/DTOs/CandidateDecisionRequest.cs` → `CandidateDecisionRequest` (ídem `ChangeStageApplicationRequest`, `ScheduleRecruitmentInterviewRequest`, `InterviewerActionRequest`, `CandidateInterviewTimelineItem`, `FuenteKpiItem`)
  - `LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/EmployeeOrganigrama/DTOs/RoleOrgChartReassignRequest.cs` → `RoleOrgChartReassignRequest` (ídem `WorkPositionReassignResponse`)
  - `LuxuryApp.Application/Modules/SupplierLuxuryApp/Purchases/OrdenesCompra/DTOs/UpdatePaidStatusRequestDTO.cs` → clase `UpdatePaidStatusRequest` (¡el **archivo** sí tiene sufijo, la clase no!)
  - `LuxuryApp.Application/Infrastructure/MockAspel/DTOs/MockAspelJsonResponse.cs` → `MockAspelJsonResponse`
  - `LuxuryApp.Application/Modules/ContabilidadLuxuryApp/ContabilidadMigration/DTOs/AspelCuentaRaw.cs` → `AspelCuentaRaw` (ídem `AspelAuxiliarRaw`, `AspelPolizaRaw`, `AspelPresupuestoRaw`, `AspelSaldoRaw`, `AspelFastRawCuenta`, `AspelFastRawSaldo`)
  - `LuxuryApp.Application/Shared/DTOs/` → `DatasetCharLinePrime`, `DataSetChart`, `MultiAxisDataset`, `MultiAxisPrimeChart`, `OneSignalSendAttemptResult`, `GuidIdEntity`, `ITenantEntity`
  - `LuxuryApp.Application/Modules/OperationsLuxuryApp/JuntasMensuales/Minuta/DTOs/ReporteMinutaIndividualDTO.cs` → `MinutaCliente`
  - `LuxuryApp.Application/Modules/OperationsLuxuryApp/JuntasMensuales/Presentacion/DTOs/PresentacionJuntaComiteAdd.cs` → `PresentacionJuntaComiteAdd` (ídem `PresentacionJuntaComiteAddPdf`)
  - `LuxuryApp.Application/Modules/MantenimientoLuxuryApp/PiscinasBitacora/DTOs/PiscinaBitacoraImportRequest.cs` → `PiscinaBitacoraImportRequest`
  - `LuxuryApp.Application/Modules/ContabilidadLuxuryApp/DynamicReports/Integrations/AspelFast/DTOs/AspelFastDTOs.cs` → `AspelFastCuentasResponse`, `AspelFastSaldosResponse`
- **Problema:** R5 exige sufijo `DTO` en toda clase DTO. 31 clases en carpetas `DTOs/` no lo llevan (requests/responses crudos, modelos de gráficas y tipos "Raw" de importación). Nota: no se detectó ningún tipo con casing incorrecto `*Dto` (el estándar `DTO` mayúsculo sí se respeta donde existe).
- **Corrección sugerida:**
  ```csharp
  // ❌ Actual (CandidateDecisionRequest.cs)
  public class CandidateDecisionRequest { ... }

  // ✅ Corregido — renombrar clase y archivo (IDE Rename, actualizar usos en EndPoints/Services)
  public class CandidateDecisionRequestDTO { ... }  // archivo: CandidateDecisionRequestDTO.cs
  ```

### ❌ R3 - DbSet en plural — **93% (22 de 333 DbSets no pluralizados)**
- **Archivo(s) afectado(s):** `LuxuryApp.Application/Infrastructure/Data/ApplicationDbContext.cs` (21 casos) y `LuxuryApp.Application/Infrastructure/Vault/Data/VaultDbContext.cs` (1 caso). El DbSet adopta el nombre de la clase sin pluralizar:
  - Línea 33: `DbSet<AccesoCustomers> AccesoCustomers`
  - Línea 89: `DbSet<TelefonosEmergencia> TelefonosEmergencia`
  - Línea 95: `DbSet<WorkGroupCategories> WorkGroupCategories`
  - Líneas 197/199: `DbSet<CatalogoGastosFijos> CatalogoGastosFijos`, `DbSet<CatalogoGastosFijosDetalles> CatalogoGastosFijosDetalles`
  - Líneas 226/260/264/278: `BudgetProposalItemHistory`, `EmployeeBankData`, `EmployeeClinicalData`, `PersonData`
  - Línea 306: `DbSet<DiasNoHabiles> DiasNoHabiles`
  - Líneas 329/337: `LeaveRequestHistory`, `VacationRequestHistory`
  - Líneas 503/577/653: `TaskTemplateRole`, `MeetingDetails`, `InspectionReviewsCatalog`
  - Líneas 709/711: `CategoryProvider`, `QualificationProvider`
  - Líneas 739/741: `PurchaseOrderBudget`, `CatalogPurchaseOrderBudget`
  - Líneas 758/782: `JobDescription`, `RecruitmentSourceCatalog`
  - `VaultDbContext.cs:9`: `DbSet<ElevenLabsSettings> ElevenLabsSettings`
- **Problema:** R3 exige propiedades `DbSet<T>` en plural. 22 propiedades (~7%) repiten el nombre singular/colectivo de la clase. *Nota:* en varios casos la raíz es un "masivo" inglés (`Data`, `History`, `Settings`, `Stock`) donde el plural natural coincide con el singular; se listan igualmente por rigor, con posibilidad de declararlos excepción documentada.
- **Corrección sugerida:**
  ```csharp
  // ❌ Actual
  public DbSet<CategoryProvider> CategoryProvider { get; set; }
  public DbSet<JobDescription> JobDescription { get; set; }
  public DbSet<RecruitmentSourceCatalog> RecruitmentSourceCatalog { get; set; }

  // ✅ Corregido
  public DbSet<CategoryProvider> CategoryProviders { get; set; }
  public DbSet<JobDescription> JobDescriptions { get; set; }
  public DbSet<RecruitmentSourceCatalog> RecruitmentSourceCatalogs { get; set; }
  ```
  *(Rename de propiedad: afecta queries LINQ y seeds; se resuelve con Rename simbólico (F2) + `dotnet build` para localizar los ~200 usos.)*

### ❌ R2 - Clase y archivo en singular (consistencia) — **~92% (250 archivos con discrepancia clase/archivo)**
- **Archivo(s) afectado(s):**
  - **Patrón sistémico #1 (121 archivos):** archivo `XxxEndpoints.cs` que declara `class XxxEndPoints` (capitalización inconsistente). Ejemplos: `LuxuryApp.Application/Modules/OperationsLuxuryApp/Inventory/EndPoints/ProductosEndpoints.cs` → `ProductosEndPoints`; `AuthEndpoints.cs` → `AuthEndPoints`; `MeetingsEndpoints.cs` → `MeetingsEndPoints`; `AdminLuxuryApp/Customers/Customers/EndPoints/CustomersEndpoints.cs` → `CustomersEndPoints`; ídem en casi todos los módulos (Operations, Mantenimiento, Cobranza, Contabilidad, Legal, Admin, Auth, Api/Features/Vault).
  - **Patrón #2 (DTOs renombrados):** archivo ≠ clase, p. ej. `LuxuryApp.Application/Modules/AdminLuxuryApp/Infraestructura/UpdateDataBase/DTOs/SeedNativeCollectionTestDataDTO.cs` → clase `SeedNativeCollectionTestDataRequestDTO`; `.../CobranzaNativa/Core/Charges/DTOs/BulkChargeImportDTO.cs` → clase `BulkChargeImportResultDTO`; `.../AuthLuxuryApp/PasswordManager/DTOs/CredentialDTOs.cs` → única clase `CredentialDetailDTO`.
  - **Patrón #3 (archivos multi-tipo, ligado a R6):** `Infrastructure/Compatibility/Hangfire/LegacyHangfireJobTypes.cs` (4 clases), `Infrastructure/Vault/Security/VaultEncryptionService.cs` (`AesGcmVaultEncryptionService` + `EncryptedData` + interfaz), `Modules/OperationsLuxuryApp/Inspections/Entities/InspectionReviews.cs` → clase `InspectionReview` (archivo en plural, clase en singular — invertido).
  - **Patrón #4 (typos):** `ServiceExtensions/HangfireServiceExtencions.cs` → clase `HangfireServiceExtensions` ("Extencions" vs "Extensions"); `FinancialAccounting/Interfaces/IFinancialReportAppService.cs` → clase `IFinancialReportAppServiceV1`.
- **Problema:** R2 exige correspondencia clase↔archivo (y singularidad). El patrón EndPoints/Endpoints (121 casos) es de capitalización, pero rompe la correspondencia exacta y delata la falta de un estándar escrito. Los otros patrones son renombrados históricos sin renombrar el archivo.
- **Corrección sugerida:**
  ```csharp
  // ❌ Actual: ProductosEndpoints.cs
  public class ProductosEndPoints { ... }

  // ✅ Corregido (elegir UN estándar; se recomienda "Endpoints")
  public class ProductosEndpoints { ... }  // + renombrar las 121 clases con F2
  ```
- ⚠️ **Nota R2 sobre entidades en plural:** existen 7 clases de entidad con nombre plural: `WorkGroupCategories` (`Task/WorkGroupCategoriesData/Entities/`), `AccesoCustomers`, `CatalogoGastosFijos(Detalles)`, `MeetingDetails`, `DiasNoHabiles`, `ElevenLabsSettings`. Se recomienda corregirlas también (p. ej. `WorkGroupCategory`, `MeetingDetail`) junto con la migración de R4, o documentarlas como excepciones.

### ❌ R1 - Carpeta / Namespace en plural — **≈99% (5 archivos en carpetas singulares)**
- **Archivo(s) afectado(s):**
  - `LuxuryApp.Application/Modules/AdminLuxuryApp/SeguridadPermisos/Access/ApplicationRole/Interface/IApplicationRoleAppService.cs` → carpeta `Interface/` (singular)
  - `LuxuryApp.Application/Modules/AdminLuxuryApp/SeguridadPermisos/Access/ApplicationRole/Service/ApplicationRoleAppService.cs` → carpeta `Service/` (singular)
  - `LuxuryApp.Application/Modules/OperationsLuxuryApp/ScheduledTasks/Interface/IScheduledTaskEmailGenerator.cs` e `IScheduledTaskService.cs` → carpeta `Interface/` (singular)
  - `LuxuryApp.Application/Modules/RecursosHumanosLuxuryApp/TimeOff/Vacations/PastVacations/Service/PastVacationsAppService.cs` → carpeta `Service/` (singular)
  - **Namespaces no alineados a carpeta (caso límite):** `LuxuryApp.Tests/Application/Modules/Operations/PanicAlert/` declara namespace `...Operations.PanicAlerts` (carpeta singular, namespace plural — preferible al revés); 4 tests más con sufijo `Records` inexistente en carpeta; plantillas `api/LuxuryApp.Api/Templates/_template-*.cs` con namespaces placeholder `MODULO` (aceptable por ser plantillas).
- **Problema:** 5 archivos viven en carpetas agrupadoras singulares (`Interface/`, `Service/`) en lugar de `Interfaces/` y `Services/`, rompiendo la convención del resto de la solución.
- **Corrección sugerida:**
  ```text
  ❌ .../ApplicationRole/Interface/  →  ✅ .../ApplicationRole/Interfaces/
  ❌ .../ApplicationRole/Service/    →  ✅ .../ApplicationRole/Services/
  ❌ .../ScheduledTasks/Interface/   →  ✅ .../ScheduledTasks/Interfaces/
  ❌ .../PastVacations/Service/      →  ✅ .../PastVacations/Services/
  ```
  *(Mover carpeta + actualizar el `namespace` de los 5 archivos; bajo impacto.)*

### ✅ R7 - Sin colisiones folder/clase (100% — sin incumplimientos)
Verificado en dos pasadas (coincidencia exacta y case-insensitive contra carpeta padre y carpeta-feature contenedora): **0 colisiones**. No existe ningún patrón `Banks/Bank.cs`, ni carpeta singular homónima de las clases que contiene. Esta es la regla mejor cumplida del proyecto.

---

## 📋 Checklist Final

| # | Regla | Estado |
|---|---|---|
| 1 | Carpeta / Namespace en plural | ⚠️ ✅ (2 carpetas singulares `Interface/`/`Service/`, 5 archivos) |
| 2 | Clase y archivo en singular | ⚠️ ❌ (121 EndPoints/Endpoints + 129 discrepancias clase/archivo; 7 entidades plurales) |
| 3 | DbSet en plural | ⚠️ ❌ (22 de 333 DbSets, 93%) |
| 4 | Tabla en plural ([Table]) | ❌ (47 de 334 tablas en singular, 86% — requiere migraciones) |
| 5 | DTOs terminan en DTO | ⚠️ ❌ (31 clases en DTOs/ sin sufijo, 97%) |
| 6 | Un DTO por clase | ❌ (79 archivos con DTOs raíz mezclados; 96% de archivos limpios) |
| 7 | Sin colisiones folder/clase | ✅ (0 colisiones) |

**Cumplimiento global estimado: ~74%** — 🟡 Estado: deuda de naming moderada, concentrada y automatizable.

---

## 🎯 Próximos Pasos Recomendados (priorizados)

1. **🔴 P0 — R4 con migraciones (mayor impacto en BD):** Las 47 tablas singulares son el único incumplimiento que toca la base de datos física. Generar migración EF Core de `RenameTable` por tabla (o `ALTER TABLE ... RENAME`), en lotes por módulo (Mantenimiento primero: 16 tablas). Decidir política para masivos ingleses (`Equipment`, `KeyInventory`, `WarehouseStock`, `ExternalStaff`) y documentar excepciones.
2. **🔴 P0 — R2 mecánico (rápido y sin riesgo):** Estandarizar el sufijo de endpoints (recomendado `Endpoints`) y renombrar las 121 clases `XxxEndPoints` → `XxxEndpoints` con Rename simbólico (F2). Un solo PR de refactor mecánico, cero cambios de comportamiento.
3. **🟠 P1 — R3 (DbSets):** Renombrar los 22 DbSets no plurales (F2 + build). Agrupar con la migración del punto 1 cuando el DbSet afecte la tabla física (p. ej. `CategoryProvider`).
4. **🟠 P1 — R6 (desacoplar DTOs):** Dividir los 79 archivos mixtos en un archivo por DTO raíz, empezando por los agregados gigantes (`AspelCobranzaHausDTOs.cs`, `ManualPasoDTO.cs`, `EquipmentInspectionExecutionDTO.cs`). Definir en `conventions/` la política: variantes de una misma entidad (Create/Update/Response) pueden convivir; raíces distintas, no.
5. **🟡 P2 — R5 (sufijo DTO):** Renombrar las 31 clases sin sufijo (`CandidateDecisionRequest` → `CandidateDecisionRequestDTO`, etc.) incluyendo las de `Shared/DTOs/`; actualizar endpoints y mapeos.
6. **🟡 P2 — R1:** Renombrar las 2 carpetas singulares (`Interface/` → `Interfaces/`, `Service/` → `Services/`) y alinear los 5 namespaces; alinear namespaces de tests con su carpeta.
7. **🟢 P3 — Blindaje permanente:** Convertir estas 7 reglas en tests automatizados (ArchUnitNET o tests de convención con reflexión sobre los ensamblados) y/o un script de CI que falle el build ante nuevas violaciones; documentar el estándar (plural carpetas/DbSets/tablas, singular clases, sufijo DTO, un DTO raíz por archivo) en `conventions/`.
8. **🟢 P3 — Limpieza menor:** `HangfireServiceExtencions.cs` (typo) → `HangfireServiceExtensions.cs`; `InspectionReviews.cs` → `InspectionReview.cs`; corregir o documentar las 7 entidades plurales; eliminar `LuxuryApp.Application.csproj.Backup.tmp`.

---

*Reporte generado mediante análisis estático automatizado (scripts Python/ripgrep sobre `D:\repos\luxuryapp-api\api`). Las cifras de línea corresponden a la versión del código al 10/09/2026. Los porcentajes de cumplimiento ponderan la cantidad de casos conformes vs. no conformes por regla.*
