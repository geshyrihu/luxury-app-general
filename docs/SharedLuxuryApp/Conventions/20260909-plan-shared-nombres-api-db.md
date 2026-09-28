# Plan de Migración de Nombres: Entidades, Carpetas y DbContexts (Fase Inicial de Refactorización)

> **Basado en:** [`CONVENTIONS_FOLDER_API.MD`](../../CONVENTIONS_FOLDER_API.MD) y [`CONVENTIONS_ENTITIES.md`](../../CONVENTIONS_ENTITIES.md)  
> **Fundamento rector:** `CONVENTIONS.md` (v2026-08-12 / 2026-09-09)  
> **Objetivo:** Lograr 100% de cumplimiento en backend (`LuxuryApp.Application`) garantizando:
> 1. Clases de entidad e interfaces en **Singular**.
> 2. Carpetas de submódulo/dominio y namespaces en **Plural**.
> 3. Propiedades `DbSet<T>` en DbContexts en **Plural** (coincidiendo con el estándar del catálogo maestro).
> 4. Invariante total sobre `[Table("...")]` en base de datos (cero cambios DDL en esquemas de BD).

---

## 1. Diagnóstico de la Situación Actual

| Componente | Regla Rector (`CONVENTIONS_FOLDER_API` / `CONVENTIONS_ENTITIES`) | Estado Actual en Repositorio | Brecha Identificada |
|:---|:---|:---|:---|
| **Clases de Entidad** | **Singular** (`Bank.cs`, `Customer.cs`) | 302 entidades activas. Fase 1 previa normalizó las 10 entidades plurales residuales (`Tasks` → `TaskRecord`, `InspectionReviews` → `InspectionReview`, etc.). | **0% brecha (100% Cumplido)** |
| **Carpetas de Submódulo** | **Plural** (`Candidates/`, `Properties/`) para evitar antipatrón de colisión clase-carpeta (CS0118). | 12 carpetas de submódulo aún están en singular o colisionan con el nombre de su entidad singular. | **12 carpetas por renombrar a Plural** (Fase 2) |
| **Namespaces** | Derivados 100% del path físico con prefijo `LuxuryApp.Application.Modules.[Modulo].[Grupo].` | Inconsistencias heredadas de las 12 carpetas singulares y la carpeta temporal `NewFolder/`. | **Cascada de actualización al renombrar carpetas** |
| **DbSets en `ApplicationDbContext`** | **Plural** (`public DbSet<Bank> Banks { get; set; }`) según `CONVENTIONS_ENTITIES.md`. | ~90 propiedades `DbSet<T>` están en singular (`DbSet<Customer> Customer`, `DbSet<Bank> Bank`). | **~90 DbSets por renombrar a Plural** (Fase 3) |
| **DbSets en `LuxuryAppLogsDbContext`** | **Plural** (`UserActivities`, `Logs`). | `UserActivity` y `Log` están en singular. | **2 DbSets por renombrar a Plural** |
| **DbSets en `VaultDbContext` & `MockAspelDbContext`** | **Plural** (`Secrets`, `MockCuentas`, etc.). | Cumplen al 100%. | **0% brecha (100% Cumplido)** |

---

## 2. User Review Required

> [!IMPORTANT]
> **Invariante de Base de Datos (Zero DDL):** Ningún renombre de C# (clase, carpeta, namespace o propiedad `DbSet<T>`) modificará los atributos `[Table("...")]` o la configuración del Fluent API. El nombre físico de las tablas en SQL Server y PostgreSQL permanecerá intacto.

> [!WARNING]
> **Submódulo Candidates (Carpeta `NewFolder/`):** El módulo `ReclutamientoLuxuryApp` contiene la ruta temporal `NewFolder/Candidates/`. Como parte de la Fase 2, se removerá el prefijo `NewFolder/` para dejar la estructura limpia en `Modules/ReclutamientoLuxuryApp/Candidates/` conforme a `CONVENTIONS_FOLDER_API.MD` §6.2.

---

## 3. Invariantes y Reglas del Refactor

```text
RN-REF-001: El atributo [Table("...")] NUNCA se edita. La estructura de tablas físicas en BD no cambia.
RN-REF-002: Los DbSets deben declararse en PLURAL en los DbContexts (ej. DbSet<Customer> Customers { get; set; }).
RN-REF-003: Los renombres de carpetas actualizan en cascada los namespaces file-scoped (namespace LuxuryApp.Application...).
RN-REF-004: Todo renombre se valida mediante `dotnet build` en los 3 proyectos (Application, Api, Tests).
```

---

## 4. Proposed Changes (Fases de Migración)

### 📌 FASE 2: Normalización de Carpetas y Namespaces a Plural (12 Submódulos)

#### [MODIFY] [AccountingCatalogs](file:///d:/repos/luxuryapp-api/api/LuxuryApp.Application/Modules/ContabilidadLuxuryApp/AccountingCatalog)
- Renombrar carpeta `AccountingCatalog` → `AccountingCatalogs`
- Namespace: `LuxuryApp.Application.Modules.ContabilidadLuxuryApp.AccountingCatalogs`

#### [MODIFY] [LegalMatters](file:///d:/repos/luxuryapp-api/api/LuxuryApp.Application/Modules/LegalLuxuryApp/Legal/LegalMatter)
- Renombrar carpeta `LegalMatter` → `LegalMatters`
- Namespace: `LuxuryApp.Application.Modules.LegalLuxuryApp.Legal.LegalMatters`

#### [MODIFY] [CalendariosMaestro](file:///d:/repos/luxuryapp-api/api/LuxuryApp.Application/Modules/MantenimientoLuxuryApp/CalendarioMaestro)
- Renombrar carpeta `CalendarioMaestro` → `CalendariosMaestro`
- Namespace: `LuxuryApp.Application.Modules.MantenimientoLuxuryApp.CalendariosMaestro`

#### [MODIFY] [CalendariosMaestroEquipo](file:///d:/repos/luxuryapp-api/api/LuxuryApp.Application/Modules/MantenimientoLuxuryApp/CalendarioMaestroEquipo)
- Renombrar carpeta `CalendarioMaestroEquipo` → `CalendariosMaestroEquipo`
- Namespace: `LuxuryApp.Application.Modules.MantenimientoLuxuryApp.CalendariosMaestroEquipo`

#### [MODIFY] [Piscinas](file:///d:/repos/luxuryapp-api/api/LuxuryApp.Application/Modules/MantenimientoLuxuryApp/Piscina)
- Renombrar carpeta `Piscina` → `Piscinas`
- Namespace: `LuxuryApp.Application.Modules.MantenimientoLuxuryApp.Piscinas`

#### [MODIFY] [PiscinasBitacora](file:///d:/repos/luxuryapp-api/api/LuxuryApp.Application/Modules/MantenimientoLuxuryApp/PiscinaBitacora)
- Renombrar carpeta `PiscinaBitacora` → `PiscinasBitacora`
- Namespace: `LuxuryApp.Application.Modules.MantenimientoLuxuryApp.PiscinasBitacora`

#### [MODIFY] [Announcements](file:///d:/repos/luxuryapp-api/api/LuxuryApp.Application/Modules/OperationsLuxuryApp/Announcement)
- Renombrar carpeta `Announcement` → `Announcements`
- Namespace: `LuxuryApp.Application.Modules.OperationsLuxuryApp.Announcements`

#### [MODIFY] [ComitesVigilancia](file:///d:/repos/luxuryapp-api/api/LuxuryApp.Application/Modules/OperationsLuxuryApp/Comite/ComiteVigilancia)
- Renombrar carpeta `ComiteVigilancia` → `ComitesVigilancia`
- Namespace: `LuxuryApp.Application.Modules.OperationsLuxuryApp.Comite.ComitesVigilancia`

#### [MODIFY] [CustomDocuments](file:///d:/repos/luxuryapp-api/api/LuxuryApp.Application/Modules/OperationsLuxuryApp/CustomDocument)
- Renombrar carpeta `CustomDocument` → `CustomDocuments`
- Namespace: `LuxuryApp.Application.Modules.OperationsLuxuryApp.CustomDocuments`

#### [MODIFY] [PanicAlerts](file:///d:/repos/luxuryapp-api/api/LuxuryApp.Application/Modules/OperationsLuxuryApp/PanicAlert)
- Renombrar carpeta `PanicAlert` → `PanicAlerts`
- Namespace: `LuxuryApp.Application.Modules.OperationsLuxuryApp.PanicAlerts`

#### [MODIFY] [Properties](file:///d:/repos/luxuryapp-api/api/LuxuryApp.Application/Modules/OperationsLuxuryApp/Property)
- Renombrar carpeta `Property` → `Properties`
- Namespace: `LuxuryApp.Application.Modules.OperationsLuxuryApp.Properties`

#### [MODIFY] [TaskRecords](file:///d:/repos/luxuryapp-api/api/LuxuryApp.Application/Modules/OperationsLuxuryApp/Task/Tasks)
- Renombrar carpeta `Task/Tasks` → `Task/TaskRecords`
- Namespace: `LuxuryApp.Application.Modules.OperationsLuxuryApp.Task.TaskRecords`

#### [MODIFY] [Providers](file:///d:/repos/luxuryapp-api/api/LuxuryApp.Application/Modules/SupplierLuxuryApp/Provider)
- Renombrar carpeta `Provider` → `Providers`
- Namespace: `LuxuryApp.Application.Modules.SupplierLuxuryApp.Providers`

---

### 📌 FASE 3: Normalización de `DbSet<T>` en DbContexts (Plural)

#### [MODIFY] [ApplicationDbContext.cs](file:///d:/repos/luxuryapp-api/api/LuxuryApp.Application/Infrastructure/Data/ApplicationDbContext.cs)
Renombrar las ~90 propiedades `DbSet<T>` singulares a su forma Plural según `CONVENTIONS_ENTITIES.md`:

- `DbSet<AccesoCustomers> AccesoCustomers` (ya plural)
- `DbSet<CustomerModul> CustomerModul` → `CustomerModuls` (o `ModuleCustomers`)
- `DbSet<ApplicationRole> ApplicationRole` → `ApplicationRoles`
- `DbSet<ApplicationUser> ApplicationUsers` (ya plural)
- `DbSet<ModuleApp> ModuleApp` → `ModuleApps`
- `DbSet<ModuleAppRol> ModuleAppRol` → `ModuleAppRoles`
- `DbSet<UserRefreshToken> UserRefreshToken` → `UserRefreshTokens`
- `DbSet<Customer> Customer` → `Customers`
- `DbSet<CustomerAddress> CustomerAddress` → `CustomerAddresses`
- `DbSet<CustomerLocation> CustomerLocation` → `CustomerLocations`
- `DbSet<CustomerImage> CustomerImage` → `CustomerImages`
- `DbSet<CustomerProvider> CustomerProvider` → `CustomerProviders`
- `DbSet<Address> Address` → `Addresses`
- `DbSet<ApprovalRoleHierarchy> ApprovalRoleHierarchy` → `ApprovalRoleHierarchies`
- `DbSet<Bank> Bank` → `Banks`
- `DbSet<CatalogAsset> CatalogAsset` → `CatalogAssets`
- `DbSet<Category> Category` → `Categories`
- `DbSet<EquipoClasificacion> EquipoClasificacion` → `EquipoClasificaciones`
- `DbSet<FormaPago> FormaPago` → `FormasPago`
- `DbSet<LegalMatterCategory> LegalMatterCategory` → `LegalMatterCategories`
- `DbSet<MedidorCategoria> MedidorCategoria` → `MedidorCategorias`
- `DbSet<MetodoDePago> MetodoDePago` → `MetodosDePago`
- `DbSet<Producto> Producto` → `Productos`
- `DbSet<UnidadMedida> UnidadMedida` → `UnidadesMedida`
- `DbSet<UsoCFDI> UsoCFDI` → `UsosCFDI`
- ...y el resto de los ~90 DbSets singulares, actualizando sus llamadas `_context.X` en Servicios/Endpoints.

#### [MODIFY] [LuxuryAppLogsDbContext.cs](file:///d:/repos/luxuryapp-api/api/LuxuryApp.Application/Infrastructure/Logs/Data/LuxuryAppLogsDbContext.cs)
- `public DbSet<UserActivity> UserActivity` → `public DbSet<UserActivity> UserActivities`
- `public DbSet<Log> Log` → `public DbSet<Log> Logs`

---

## 5. Verification Plan

### Automated Tests & Compilación
```powershell
# Compilación limpia de la solución backend
dotnet build api/LuxuryApp.Application/LuxuryApp.Application.csproj
dotnet build api/LuxuryApp.Api/LuxuryApp.Api.csproj
dotnet build api/LuxuryApp.Tests/LuxuryApp.Tests.csproj

# Ejecución de tests unitarios
dotnet test api/LuxuryApp.Tests/LuxuryApp.Tests.csproj
```

### Manual & Invariant Verification
1. `git diff` post-refactor confirmando 0 modificaciones en atributos `[Table("...")]`.
2. Verificación de que no existen advertencias de compilación CS0118 (colisión de tipo y namespace) ni CS0104 (referencia ambigua).

---

## 6. Prompts Estructurados de Ejecución para Agente CLI (Aider / Claude Code / KiloCode)

Para la ejecución de cada fase por parte del agente CLI externo, se proveen los siguientes prompts estructurados:

### 🤖 Prompt Ejecución — Fase 2: Renombrar Carpetas a Plural y Actualizar Namespaces
```text
TAREA: Refactorizar las 12 carpetas de submódulo singulares a Plural en api/LuxuryApp.Application/Modules/ conforme a CONVENTIONS_FOLDER_API.MD §3 y §5.3.

PASOS:
1. Renombrar las carpetas:
   - ContabilidadLuxuryApp/AccountingCatalog -> AccountingCatalogs
   - LegalLuxuryApp/Legal/LegalMatter -> LegalMatters
   - MantenimientoLuxuryApp/CalendarioMaestro -> CalendariosMaestro
   - MantenimientoLuxuryApp/CalendarioMaestroEquipo -> CalendariosMaestroEquipo
   - MantenimientoLuxuryApp/Piscina -> Piscinas
   - MantenimientoLuxuryApp/PiscinaBitacora -> PiscinasBitacora
   - OperationsLuxuryApp/Announcement -> Announcements
   - OperationsLuxuryApp/Comite/ComiteVigilancia -> ComitesVigilancia
   - OperationsLuxuryApp/CustomDocument -> CustomDocuments
   - OperationsLuxuryApp/PanicAlert -> PanicAlerts
   - OperationsLuxuryApp/Property -> Properties
   - OperationsLuxuryApp/Task/Tasks -> Task/TaskRecords
   - SupplierLuxuryApp/Provider -> Providers

2. Actualizar los namespaces en todos los archivos .cs dentro de esas carpetas para que coincidan exactamente con la nueva ruta física (ej. namespace LuxuryApp.Application.Modules.OperationsLuxuryApp.Announcements.Entities).

3. Actualizar los usings referentes a estos namespaces en todo api/LuxuryApp.Application/, api/LuxuryApp.Api/ y api/LuxuryApp.Tests/.

4. Ejecutar: dotnet build api/LuxuryApp.Application/LuxuryApp.Application.csproj y asegurar 0 errores.
```

### 🤖 Prompt Ejecución — Fase 3: Renombrar DbSets a Plural en DbContexts
```text
TAREA: Renombrar todas las propiedades DbSet<T> singulares a Plural en ApplicationDbContext.cs y LuxuryAppLogsDbContext.cs conforme a CONVENTIONS_ENTITIES.md.

REGLAS DE ORO:
- NO TOCAR NINGÚN ATRIBUTO [Table("...")] NI CONFIGURACIÓN DE TABLA EN EF CORE.
- Mantener la entidad T en singular (ej. DbSet<Customer> Customers { get; set; }).

PASOS:
1. En LuxuryApp.Application/Infrastructure/Logs/Data/LuxuryAppLogsDbContext.cs:
   - Cambiar DbSet<UserActivity> UserActivity a UserActivities
   - Cambiar DbSet<Log> Log a Logs

2. En LuxuryApp.Application/Infrastructure/Data/ApplicationDbContext.cs:
   - Renombrar las ~90 propiedades DbSet<T> singulares a su forma plural (Customer -> Customers, Bank -> Banks, Address -> Addresses, etc.).

3. Actualizar todas las referencias _context.Customer -> _context.Customers, dbContext.Bank -> dbContext.Banks en los servicios, controladores y tests de la solución backend.

4. Ejecutar: dotnet build y dotnet test para confirmar cero errores de compilación y pruebas en verde.
```
