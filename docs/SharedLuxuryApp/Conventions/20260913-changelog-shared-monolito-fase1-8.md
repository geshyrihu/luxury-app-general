# Log de Cambios

## 2026-09-01 — Migración arquitectónica: Fase 1 y Fase 2 (plan.migration.folder.md)

**Fases ejecutadas:** Fase 1 (Preparación del proyecto `LuxuryApp.Application`) y Fase 2 (Movimiento físico del core de persistencia). Fase 3 (DI/eliminación del proyecto) y Fase 4 (reubicación de entidades por módulo) **no se ejecutaron** — quedan pendientes para una siguiente sesión.

**Repositorio:** `api/` (repo git independiente). Working tree partía limpio en `main`, sincronizado con `origin/main`. Todos los movimientos se hicieron con `git mv` para preservar el historial; ningún `namespace` fue modificado.

### Fase 1 — Dependencias en `LuxuryApp.Application.csproj`

Se copiaron desde `LuxuryApp.Infrastructure.Data.csproj`, respetando versiones exactas (ninguna se actualizó):

- `Microsoft.AspNetCore.Identity.EntityFrameworkCore` 10.0.10
- `Microsoft.EntityFrameworkCore.Design` 10.0.10 (con `PrivateAssets`/`IncludeAssets`)
- `Microsoft.EntityFrameworkCore.SqlServer.NetTopologySuite` 10.0.10
- `Microsoft.EntityFrameworkCore.Tools` 10.0.10 (con `PrivateAssets`/`IncludeAssets`)
- `Microsoft.Extensions.Configuration.Json` 10.0.10
- `Microsoft.Extensions.Identity.Stores` 10.0.10
- `Npgsql.EntityFrameworkCore.PostgreSQL` 10.0.3

(`Fiscalapi.XmlDownloader 6.0.0` no se copió: ya existía en `Application.csproj` con la misma versión — se evitó una `PackageReference` duplicada.)

`Using` (Implicit Global Usings) agregados: `Microsoft.EntityFrameworkCore.Metadata`, `Microsoft.AspNetCore.Identity.EntityFrameworkCore`. El resto del bloque de Infrastructure.Data (`Microsoft.AspNetCore.Identity`, `System.ComponentModel.DataAnnotations[.Schema]`, `Microsoft.EntityFrameworkCore`, `NetTopologySuite[.Geometries]`, `Microsoft.AspNetCore.Http`, `Microsoft.AspNetCore.Hosting`, `Microsoft.Extensions.Hosting`, `LuxuryApp.Shared.Enums`, `LuxuryApp.Shared.DTOs`, `LuxuryApp.Infrastructure.Data.Entities`) ya estaba presente en `Application.csproj` y no se duplicó.

**Desviación deliberada del plan literal:** el plan pedía agregar también `<Using Include="LuxuryApp.Infrastructure.Data.Interfaces" />` como global using de proyecto. Se intentó, pero causó `CS0104` (referencia ambigua) en 8 archivos del módulo `ReclutamientoLuxuryApp`, porque `LuxuryApp.Infrastructure.Data.Interfaces` define `IDomainEvent`, `IDomainEventHandler<T>` e `IDomainEventDispatcher` — nombres que colisionan con los tipos homónimos ya usados vía `using LuxuryApp.Shared.Events;` en ese módulo. Se revirtió el global using del `.csproj` y, en su lugar, se agregó un `using LuxuryApp.Infrastructure.Data.Interfaces;` **a nivel de archivo** únicamente en `Data/ApplicationDbContext.cs` (el único archivo movido que consume `IAuditable`/`ISoftDeletable` sin calificar). Esto preserva el comportamiento original sin propagar la colisión de nombres a todo el proyecto `Application`.

### Fase 2 — Movimiento físico del core de persistencia

Creada la carpeta `LuxuryApp.Application/Data/`. Movidos con `git mv` (namespace `LuxuryApp.Infrastructure.Data` intacto en todos):

- `ApplicationDbContext.cs`
- `ApplicationDbContextFactory.cs`
- `PostgresDbContext.cs`
- Carpeta completa `Migrations/` (10 archivos de migración + `ApplicationDbContextModelSnapshot.cs`)

**`ApplicationDbContextFactory.cs` — path relativo:** revisado, **no requirió ajuste**. La ruta `Path.Combine(Directory.GetCurrentDirectory(), "..", "LuxuryApp.Api")` sigue siendo correcta porque `LuxuryApp.Application` es, igual que `LuxuryApp.Infrastructure.Data`, una carpeta hermana directa de `LuxuryApp.Api` bajo `api/` — la profundidad relativa no cambió con el movimiento.

**Hallazgo no listado en el plan — corregido para no romper el modelo EF en runtime:** `ApplicationDbContext.OnModelCreating` registra las configuraciones Fluent API con `modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly)`. Al mover el `DbContext` a `Application`, ese `Assembly` pasa a ser el ensamblado de `Application` — pero las 51 clases `IEntityTypeConfiguration<T>` bajo `Data/EntityConfigurations/` **siguen en `Infrastructure.Data`** (se reubicarán progresivamente en la Fase 4, aún no ejecutada). Sin corrección, esto habría compilado sin error pero habría producido un modelo EF incompleto en tiempo de ejecución (tablas/relaciones/constraints Fluent API no aplicadas), un fallo silencioso. Se agregó una segunda llamada `modelBuilder.ApplyConfigurationsFromAssembly(typeof(IAuditable).Assembly)` para seguir escaneando también el ensamblado `Infrastructure.Data` mientras dure la transición. Este ajuste deberá revertirse (dejar solo la primera línea) al completar la Fase 4, cuando todas las configuraciones ya vivan en `Application`.

**Segundo hallazgo no listado en el plan — rotura de compilación real:** `LuxuryApp.Infrastructure.Data/Seeds/IdentitySeed.cs` (fuera de la carpeta `Data/`, por lo que no estaba en la lista explícita de la Fase 2) consume `ApplicationDbContext` y `ApplicationUser`. Al moverse el `DbContext` a `Application`, y dado que `Infrastructure.Data` no referencia (ni debe referenciar, para no crear dependencia circular) a `Application`, el build falló con `CS0246` (`ApplicationDbContext` no encontrado). Se movió `IdentitySeed.cs` con `git mv` a `LuxuryApp.Application/Seeds/IdentitySeed.cs`, **namespace `LuxuryApp.Infrastructure.Seeds` intacto**. El único consumidor, `LuxuryApp.Api/Program.cs:323`, lo referencia con el nombre completamente calificado y `LuxuryApp.Api` ya tiene `ProjectReference` a `LuxuryApp.Application`, por lo que no requirió cambios.

### Archivos modificados (no movidos)

- `LuxuryApp.Application/LuxuryApp.Application.csproj` — PackageReferences y Usings descritos arriba.
- `LuxuryApp.Application/Data/ApplicationDbContext.cs` — `using LuxuryApp.Infrastructure.Data.Interfaces;` agregado; segunda llamada a `ApplyConfigurationsFromAssembly` para cubrir el ensamblado `Infrastructure.Data` durante la transición.

### Resumen de archivos movidos (git mv, 15 en total)

1. `LuxuryApp.Infrastructure.Data/Data/ApplicationDbContext.cs` → `LuxuryApp.Application/Data/ApplicationDbContext.cs`
2. `LuxuryApp.Infrastructure.Data/Data/ApplicationDbContextFactory.cs` → `LuxuryApp.Application/Data/ApplicationDbContextFactory.cs`
3. `LuxuryApp.Infrastructure.Data/Data/PostgresDbContext.cs` → `LuxuryApp.Application/Data/PostgresDbContext.cs`
4. `LuxuryApp.Infrastructure.Data/Data/Migrations/*.cs` (10 archivos) → `LuxuryApp.Application/Data/Migrations/*.cs`
5. `LuxuryApp.Infrastructure.Data/Data/Migrations/ApplicationDbContextModelSnapshot.cs` → `LuxuryApp.Application/Data/Migrations/ApplicationDbContextModelSnapshot.cs`
6. `LuxuryApp.Infrastructure.Data/Seeds/IdentitySeed.cs` → `LuxuryApp.Application/Seeds/IdentitySeed.cs`

### Estado de compilación

`dotnet build LuxuryApp.sln` (net10.0, Debug) → **Compilación correcta. 0 Advertencia(s). 0 Errores.** Tiempo transcurrido ≈ 9-38 s según ejecución. Verificado tras dos iteraciones (la primera detectó los dos hallazgos descritos arriba, corregidos antes de este resultado final).

### Pendiente para continuar (fuera de alcance de esta sesión)

- **Fase 3:** actualizar `DbContextServiceExtensions.cs` (`AddPostgresDbContext`) — el `MigrationsAssembly("LuxuryApp.Infrastructure")` ya apuntaba a un ensamblado inexistente *antes* de esta migración (bug preexistente, ver `LuxuryApp.Api/ServiceExtensions/DbContextServiceExtensions.cs:61`); debe cambiar a `"LuxuryApp.Application"`. La ruta SQL Server (`AddSqlServerDbContext`) no especifica `MigrationsAssembly` explícito, por lo que ya usa el ensamblado del `DbContext` por convención — al moverse este a `Application`, esa ruta ya apunta correctamente sin cambios de código.
- Remover `<ProjectReference Include="..\LuxuryApp.Infrastructure.Data\...">` de `LuxuryApp.Application.csproj` (aún presente y necesaria mientras las `EntityConfigurations` y `Entities` sigan en `Infrastructure.Data`) y de `LuxuryApp.Api.csproj` si aplica, y eliminar el proyecto de la `.sln`.
- **Fase 4:** reubicar entidades y configuraciones Fluent API por sub-módulo dentro de `Moduls/`. Al completarla, revertir la segunda llamada a `ApplyConfigurationsFromAssembly` agregada en esta sesión (dejar solo `typeof(ApplicationDbContext).Assembly`).

---

## 2026-09-01 — Migración arquitectónica: Fase 3 (parcial, por decisión explícita del usuario)

**Fase ejecutada:** Fase 3 (Ajuste de la inyección de dependencias), **excepto** los pasos 3.3 y 3.5 del plan (remover `ProjectReference` a `LuxuryApp.Infrastructure.Data` y eliminar su `.csproj` de la `.sln`). El usuario indicó explícitamente NO ejecutar esos pasos todavía porque `Infrastructure.Data` sigue conteniendo Entidades y `EntityConfigurations` reales (Fase 4 pendiente) — eliminarlo ahora rompería la compilación.

### Cambio realizado

`LuxuryApp.Api/ServiceExtensions/DbContextServiceExtensions.cs:61`, dentro de `AddPostgresDbContext`:

```diff
- npgsqlOptions.MigrationsAssembly("LuxuryApp.Infrastructure");
+ npgsqlOptions.MigrationsAssembly("LuxuryApp.Application");
```

Este era el único `MigrationsAssembly` explícito en toda la solución (verificado con búsqueda global). Ya apuntaba mal *antes* de la migración — a `"LuxuryApp.Infrastructure"`, un ensamblado que nunca existió (el proyecto real siempre fue `LuxuryApp.Infrastructure.Data`) — así que corrige de una vez el bug preexistente y lo realinea con la nueva ubicación del `DbContext` y las `Migrations/` movidas en la Fase 2.

La ruta `AddSqlServerDbContext` no tiene `MigrationsAssembly` explícito: no se tocó, porque por convención de EF Core ya usa el ensamblado donde vive `ApplicationDbContext` — que desde la Fase 2 es `LuxuryApp.Application`, es decir ya apunta correctamente sin necesidad de código adicional.

**No se tocó** `LuxuryApp.Application.csproj` (sigue con `ProjectReference` a `Infrastructure.Data`), ni `LuxuryApp.Api.csproj`, ni `LuxuryApp.sln` — por instrucción explícita del usuario, se pospone al cierre de la Fase 4.

### Estado de compilación

`dotnet build LuxuryApp.sln` (net10.0, Debug) → **Compilación correcta. 5 Advertencia(s). 0 Errores.** (las 5 advertencias son preexistentes y no relacionadas: nullable annotations en plantillas `.cshtml` de email y un servicio marcado `[Obsolete]`; no las introdujo este cambio). Tiempo transcurrido ≈ 5 s.

### Verificación en ejecución ("que corra")

Se ejecutó `dotnet run --no-build --no-launch-profile` desde `LuxuryApp.Api/` (proveedor activo en `appsettings.json`: `Database:Provider = SqlServer`) durante ~20 s y se detuvo manualmente. Log relevante:

- `✅ Serilog inicializado.`
- `Database providers: Application=SqlServer, Logging=SqlServer, Hangfire=SqlServer`
- `WRN No instantiatable types implementing 'IEntityTypeConfiguration' were found while scanning assembly 'LuxuryApp.Application'` — **esperado**: confirma que el ensamblado `Application` todavía no tiene ninguna `EntityConfiguration` propia (Fase 4 pendiente); el modelo se completó igual porque `OnModelCreating` escanea también el ensamblado `Infrastructure.Data` (ajuste hecho en la Fase 2) y no arrojó una advertencia equivalente para ese segundo escaneo, señal de que sí encontró y aplicó las 51 configuraciones ahí.
- 5 advertencias más de EF Core sobre query filters globales en relaciones requeridas (`PeriodoNomina`/`DiasNoHabiles`, `NominaEncabezado`/`NominaDetalle`, etc.) — preexistentes al modelo, no relacionadas con esta migración.
- Sin excepciones no controladas ni errores de resolución de DI. El proceso se mantuvo vivo hasta que se detuvo manualmente (no hubo caída espontánea), lo cual confirma un arranque correcto tanto de la app como de la construcción del modelo EF con el `DbContext` ya alojado en `Application`.

No se validó un round-trip real contra SQL Server (fuera del alcance de esta verificación; no se modificó nada relacionado con conectividad de base de datos).

### Pendiente para continuar

- **Cierre de Fase 3:** remover `<ProjectReference Include="..\LuxuryApp.Infrastructure.Data\...">` de `LuxuryApp.Application.csproj`, remover el proyecto de `LuxuryApp.sln`, y eliminar `LuxuryApp.Infrastructure.Data.csproj` — solo cuando la Fase 4 haya vaciado ese proyecto de Entidades/Configuraciones.
- **Fase 4:** reubicar progresivamente Entidades y `EntityConfigurations` por sub-módulo dentro de `Moduls/`. Al terminar, revertir la segunda llamada a `ApplyConfigurationsFromAssembly` en `ApplicationDbContext.cs` (dejar solo `typeof(ApplicationDbContext).Assembly`).

---

## 2026-09-01 — Migración arquitectónica: Fase 4, iteración 1 (módulo Reclutamiento)

**Alcance pedido:** mover Entidades y Configuraciones Fluent API del módulo `ReclutamientoLuxuryApp` desde `Infrastructure.Data` hacia `Domain/Entities` / `Infrastructure/Persistence` dentro de cada sub-módulo existente en `Moduls/ReclutamientoLuxuryApp/`.

### Inventario inicial

Se identificaron 22 entidades bajo `Data/Entities/Tenant/Recruitment/` (carpetas `Candidatos/`, `EstructuraOrganizacional/`, `ReclutamientoyAltasBajas/`) y **1 sola** `EntityConfiguration` Fluent API relacionada: `EntityConfigurations/Recruitment/WorkPositionScheduleConfiguration.cs`. El resto de las entidades de Reclutamiento se mapean vía Data Annotations en la propia clase (sin `IEntityTypeConfiguration<T>` dedicada), así que en esta iteración no hubo configuraciones Fluent que mover.

**`OrgHierarchy.cs`** vive físicamente en `Recruitment/EstructuraOrganizacional/` pero se confirmó (búsqueda de referencias en todo `api/`) que su único consumidor real es `Moduls/RecursosHumanosLuxuryApp/Employees/EmployeeOrganigrama/...` (módulo RH, ver [[project-d11-organigrama-roles]] en memoria) — no `ReclutamientoLuxuryApp`. Se excluyó de esta iteración por no pertenecer al módulo solicitado.

### Hallazgo central: `WorkPosition` como ancla externa que arrastra casi todo el grafo

Antes de mover nada se verificó, para cada entidad candidata, si algún archivo que **permanecería** en `Infrastructure.Data` la referenciaba (una entidad movida a `Application` deja de ser visible desde `Infrastructure.Data`, que no tiene `ProjectReference` a `Application` — y no debe tenerla, para no crear un ciclo, dado que `Application` ya referencia a `Infrastructure.Data`).

`WorkPosition.cs` resultó referenciado por `ApplicationUser.cs`, `Employee.cs` y `EmployeeWorkContract.cs` — todas entidades **fuera** de Reclutamiento (núcleo de Identidad/RH) — por lo que `WorkPosition` (y por la misma razón `WorkPositionSchedule`, referenciada de vuelta por `WorkPosition`) debe permanecer en `Infrastructure.Data`.

El problema: `WorkPosition` a su vez referencia (navegación EF) a `JobDescription` y a `RequestPosition`. Se calculó el cierre transitivo completo de "debe permanecer" siguiendo todas las referencias entre las 22 entidades:

```
WorkPosition → WorkPositionSchedule, JobDescription, RequestPosition
RequestPosition → WorkPosition, RequestEmployeeRegister
RequestEmployeeRegister → RequestPosition, Candidate
Candidate → CandidateApplicationRole, CandidateProcess, CandidateWorkExperience, RecruitmentSourceCatalog
CandidateProcess → RequestPosition, Candidate, CandidateInterview, CandidateStageHistory
CandidateInterview → CandidateInterviewResult, CandidateProcess
```

Resultado: el conjunto que debe permanecer en `Infrastructure.Data` no es solo `WorkPosition`/`WorkPositionSchedule`/`OrgHierarchy` — se expande transitivamente a **14 de las 22 entidades**: `WorkPosition`, `WorkPositionSchedule`, `OrgHierarchy`, `JobDescription`, `RequestPosition`, `RequestEmployeeRegister`, `Candidate`, `CandidateApplicationRole`, `CandidateProcess`, `CandidateWorkExperience`, `RecruitmentSourceCatalog`, `CandidateInterview`, `CandidateStageHistory`, `CandidateInterviewResult`.

Esto se descubrió **durante la ejecución**: se movieron inicialmente 19 entidades (todas menos `WorkPosition`, `WorkPositionSchedule`, `OrgHierarchy`), `dotnet build` falló, y se revirtieron progresivamente `JobDescription` → `RequestPosition` → `RequestEmployeeRegister` → todo el grupo `Candidate*` hasta alcanzar un punto fijo sin errores. Los reversos se hicieron con `git mv` de vuelta a su ubicación original (namespace nunca se tocó) y se normalizaron los finales de línea (CRLF) para que el `git status` final quede limpio en esos archivos, sin diferencias reales de contenido.

**Conclusión arquitectónica:** `WorkPosition` funciona como un "shared kernel" entre RH y Reclutamiento. Mover el módulo Reclutamiento completo en una sola iteración no es posible sin also mover `WorkPosition` — y por lo tanto `Employee`/`ApplicationUser`/`EmployeeWorkContract`, que están fuera del alcance pedido. Una iteración futura que quiera cerrar el resto de Reclutamiento (`Candidate*`, `RequestEmployeeRegister`, `RequestPosition`, `JobDescription`, `WorkPosition*`) tendrá que hacerlo junto con (o después de) mover el núcleo de RH/Identidad relacionado, o romper el acoplamiento cambiando esas navegaciones EF por referencias por Id + `IEntityTypeConfiguration` explícita (fuera del alcance de esta sesión).

### Entidades efectivamente movidas (8, con `git mv`, namespace `LuxuryApp.Infrastructure.Data.Entities` intacto)

| Entidad | Origen | Destino |
|---|---|---|
| `InterviewerMatrix.cs` | `Data/Entities/Tenant/Recruitment/Candidatos/` | `Moduls/ReclutamientoLuxuryApp/InterviewerMatrix/Domain/Entities/` |
| `RequestDismissal.cs` | `Data/Entities/Tenant/Recruitment/ReclutamientoyAltasBajas/` | `Moduls/ReclutamientoLuxuryApp/Reclutamiento/Recruitment/RequestDismissal/Domain/Entities/` |
| `RequestDismissalEvaluation.cs` | ídem | ídem |
| `RequestDismissalFile.cs` | ídem | ídem |
| `RequestDismissalIncident.cs` | ídem | ídem |
| `RequestDismissalDiscount.cs` | `Data/Entities/Tenant/Recruitment/ReclutamientoyAltasBajas/` | `Moduls/ReclutamientoLuxuryApp/Reclutamiento/Recruitment/RequestDismissalDiscount/Domain/Entities/` |
| `RequestEmployeeRegisterFile.cs` | `Data/Entities/Tenant/Recruitment/ReclutamientoyAltasBajas/` | `Moduls/ReclutamientoLuxuryApp/Reclutamiento/Recruitment/RequestEmployeeRegister/Domain/Entities/` |
| `RequestSalaryModification.cs` | `Data/Entities/Tenant/Recruitment/ReclutamientoyAltasBajas/` | `Moduls/ReclutamientoLuxuryApp/Reclutamiento/Recruitment/SalaryModification/Domain/Entities/` |

Ninguna de estas 8 es referenciada por código que permanezca en `Infrastructure.Data` (verificado antes y confirmado por la compilación limpia). No se creó `Infrastructure/Persistence/` en ningún sub-módulo porque ninguna de las 8 tenía una `EntityConfiguration` Fluent API dedicada que mover.

**Ajuste de `using` necesario:** `RequestEmployeeRegisterFile.cs` implementa `IAuditable` sin calificar (dependía del global using de `Infrastructure.Data.csproj`, que `Application.csproj` no tiene — mismo problema que se resolvió en la Fase 2 para `ApplicationDbContext.cs`). Se agregó `using LuxuryApp.Infrastructure.Data.Interfaces;` a nivel de archivo. Los otros 7 archivos movidos no implementan `IAuditable`/`ISoftDeletable` (heredan solo de `GuidIdEntity`), así que no lo necesitaron.

### Entidades NO movidas en esta iteración (permanecen en `Infrastructure.Data`, sin cambios)

`WorkPosition.cs`, `WorkPositionSchedule.cs`, `WorkPositionScheduleConfiguration.cs`, `OrgHierarchy.cs`, `JobDescription.cs`, `RequestPosition.cs`, `RequestEmployeeRegister.cs`, `Candidate.cs`, `CandidateApplicationRole.cs`, `CandidateProcess.cs`, `CandidateWorkExperience.cs`, `RecruitmentSourceCatalog.cs`, `CandidateInterview.cs`, `CandidateStageHistory.cs`, `CandidateInterviewResult.cs` — razones explicadas arriba.

### Estado de compilación

`dotnet build LuxuryApp.sln` (net10.0, Debug) → **Compilación correcta. 6 Advertencia(s). 0 Errores.** La única advertencia nueva frente a la Fase 3 es `CS8632` (nullable annotation) en `RequestEmployeeRegister.cs:107` — preexistente, no introducida por este cambio (mismo tipo de advertencia ya visto en otros archivos de `Infrastructure.Data` en fases anteriores). Tiempo transcurrido ≈ 6-30 s según ejecución.

### Pendiente para continuar

- **Fase 4, iteración 2 (Reclutamiento, resto):** requiere decidir cómo desacoplar `WorkPosition` de RH antes de poder mover `Candidate*`, `RequestEmployeeRegister`, `RequestPosition`, `JobDescription`. Opciones a evaluar con el dueño del módulo: (a) mover también `WorkPosition`/`WorkPositionSchedule` junto con `Employee`/`ApplicationUser`/`EmployeeWorkContract` en una iteración conjunta RH+Reclutamiento; (b) romper las navegaciones EF directas por referencias de Id + `IEntityTypeConfiguration` explícita para desacoplar los ensamblados.
- **Fase 4, otros módulos:** continuar con otros módulos de `Moduls/` siguiendo el mismo procedimiento de verificación de cierre transitivo de referencias antes de mover.
- Al completar por fin el vaciado de `Infrastructure.Data`, revertir la segunda llamada a `ApplyConfigurationsFromAssembly` en `ApplicationDbContext.cs` y cerrar la Fase 3 (remover `ProjectReference` y el `.csproj` de la `.sln`).

---

## 2026-09-01 — Migración arquitectónica: Fase 4 en bloque (Opción A) + cierre de Fase 3

**Decisión del usuario (dueño de la arquitectura):** en vez de seguir resolviendo el acoplamiento de EF Core módulo por módulo (lo que la iteración anterior demostró que era inviable para Reclutamiento sin arrastrar RH/Identidad), se optó por **Opción A — Migración en Bloque**: mover de una sola vez TODAS las entidades y configuraciones restantes de `Infrastructure.Data` hacia `Application`, eliminando así por completo el problema de "quién se queda atrás" (todo termina en el mismo ensamblado, así que las referencias cruzadas entre entidades dejan de ser un problema de compilación entre proyectos).

### Inventario de partida

- `Data/Entities/`: 319 archivos `.cs` en 8 áreas de negocio (`System`, `Tenant/Accounting`, `Tenant/Hr`, `Tenant/Legal`, `Tenant/Maintenance`, `Tenant/Operations`, `Tenant/Purchasing`, `Tenant/Recruitment` — esta última con 14 entidades restantes tras la iteración anterior).
- `Data/EntityConfigurations/`: 51 archivos en 10 carpetas (`AccessControl`, `Auth`, `Comite`, `Contabilidad`, `JuntasMensuales`, `Mantenimiento`, `Operaciones`, `Recruitment`, `RecursosHumanos`, `Shared`).
- `Data/Interfaces/`: 5 archivos (`IAuditable`, `ISoftDeletable`, `IDomainEvent`, `IDomainEventDispatcher`, `IDomainEventHandler`).
- `Identity/IdentityErrorDescriberEs.cs` (1 archivo) y `Seeds/FinancialReportSeed.cs.disabled` (1 archivo, ya deshabilitado).

**Total movido con `git mv` en esta sesión: 377 archivos.** Namespace original intacto en todos (`LuxuryApp.Infrastructure.Data.Entities`, `LuxuryApp.Infrastructure.Data.EntityConfigurations`, `LuxuryApp.Infrastructure.Data.Interfaces`, etc.) — solo cambió su ubicación física de carpeta/proyecto.

### Mapeo de Entidades → `Moduls/`

| Origen (`Data/Entities/...`) | Destino |
|---|---|
| `System/*` (Access, Backup, Catalogs, GestindeCliente, System-AI, System-AuditLogs) | `SystemLuxuryApp/Domain/Entities/*` |
| `Tenant/Accounting/AR` | `CobranzaLuxuryApp/Domain/Entities/AR` |
| `Tenant/Accounting/{Budgeting,FondeosyReporteo,GeneralLedger}` | `ContabilidadLuxuryApp/Domain/Entities/*` |
| `Tenant/Hr/*` (8 subcarpetas: AsistenciayVacaciones, ChekadorEmpleados, ContratacinyLegal, EvaluacionesdeDesempeo, ExpedientedelEmpleado, ExternalStaff, GestindeIncidentesySanciones, Payroll) | `RecursosHumanosLuxuryApp/Domain/Entities/*` |
| `Tenant/Legal/*` | `LegalLuxuryApp/Domain/Entities/*` |
| `Tenant/Maintenance/*` | `MantenimientoLuxuryApp/Domain/Entities/*` |
| `Tenant/Operations/*` (14 subcarpetas) | `OperationsLuxuryApp/Domain/Entities/*` |
| `Tenant/Purchasing/{PO,PR,Quotes}` | `ComprasLuxuryApp/Domain/Entities/*` |
| `Tenant/Purchasing/Providers` | `SupplierLuxuryApp/Domain/Entities/Providers` |

**Regla aplicada:** para estos 8 módulos se hizo un movimiento a nivel de directorio completo (mismo criterio "en bloque"), preservando la subestructura de carpetas original bajo `Domain/Entities/` — sin intentar reasignar cada entidad a un sub-módulo de feature específico dentro de `Moduls/<Modulo>LuxuryApp/`, dado el volumen (300+ archivos) y que la Opción A prioriza destrabar la compilación sobre la granularidad organizativa fina. Esa granularización (como se hizo a mano para Reclutamiento en la iteración anterior) queda como refinamiento futuro opcional, módulo por módulo.

**Recruitment — resto (14 entidades, ahora sin bloqueo de acoplamiento):** se aplicó la asignación fina ya calculada en la iteración anterior, ahora sin restricción:

| Entidad | Destino |
|---|---|
| `Candidate.cs`, `CandidateApplicationRole.cs`, `CandidateInterview.cs`, `CandidateStageHistory.cs` | `ReclutamientoLuxuryApp/Candidate/Domain/Entities/` |
| `CandidateInterviewResult.cs` | `ReclutamientoLuxuryApp/CandidateInterviewResult/Domain/Entities/` |
| `CandidateProcess.cs` | `ReclutamientoLuxuryApp/CandidateProcess/Domain/Entities/` |
| `CandidateWorkExperience.cs` | `ReclutamientoLuxuryApp/CandidateWorkExperience/Domain/Entities/` |
| `RecruitmentSourceCatalog.cs` | `ReclutamientoLuxuryApp/RecruitmentSourceCatalog/Domain/Entities/` |
| `JobDescription.cs` | `ReclutamientoLuxuryApp/Reclutamiento/JobDescription/Domain/Entities/` |
| `RequestPosition.cs` | `ReclutamientoLuxuryApp/Reclutamiento/Recruitment/RequestPosition/Domain/Entities/` |
| `RequestEmployeeRegister.cs` | `ReclutamientoLuxuryApp/Reclutamiento/Recruitment/RequestEmployeeRegister/Domain/Entities/` |
| `WorkPosition.cs`, `WorkPositionSchedule.cs` | `ReclutamientoLuxuryApp/WorkPosition/Domain/Entities/` |
| `OrgHierarchy.cs` | `RecursosHumanosLuxuryApp/Domain/Entities/EstructuraOrganizacional/` (no `ReclutamientoLuxuryApp` — su único consumidor real es `RecursosHumanosLuxuryApp/Employees/EmployeeOrganigrama`, confirmado en la iteración anterior) |

Con esto, `Data/Entities/` quedó **completamente vacío** (verificado con `find` tras cada tanda de movimientos).

### Mapeo de EntityConfigurations → `Moduls/`

| Origen (`Data/EntityConfigurations/...`) | Destino | Nota |
|---|---|---|
| `AccessControl` | `OperationsLuxuryApp/Infrastructure/Persistence/AccessControl` | entidad `AccessPoint` vive en `Tenant/Operations/AccessControl` |
| `Auth` | `SystemLuxuryApp/Infrastructure/Persistence/Auth` | `PasswordRecoveryCodeConfiguration` configura una entidad de `System/Access` |
| `Comite` | `OperationsLuxuryApp/Infrastructure/Persistence/Comite` | configura entidades `Manual*` que viven en `Tenant/Operations/Manuals` (el nombre de carpeta original es engañoso — no hay entidades propias de un módulo "Comité/Committee" separado) |
| `Contabilidad` | `ContabilidadLuxuryApp/Infrastructure/Persistence/Contabilidad` | |
| `JuntasMensuales` | `OperationsLuxuryApp/Infrastructure/Persistence/JuntasMensuales` | configura `Asamblea*`/`JuntaMensualSession`, entidades de `Tenant/Operations/AsambleasyPlanificacin` y `.../GoogleCalendar` |
| `Mantenimiento` | `MantenimientoLuxuryApp/Infrastructure/Persistence/Mantenimiento` | |
| `Operaciones` | `OperationsLuxuryApp/Infrastructure/Persistence/Operaciones` | |
| `Recruitment` (`WorkPositionScheduleConfiguration.cs`) | `ReclutamientoLuxuryApp/Infrastructure/Persistence/Recruitment` | ya no bloqueado: `WorkPositionSchedule` se movió junto con el resto |
| `RecursosHumanos` | `RecursosHumanosLuxuryApp/Infrastructure/Persistence/RecursosHumanos` | |
| `Shared` | `SharedLuxuryApp/Infrastructure/Persistence/Shared` | |

Con esto, `Data/EntityConfigurations/` quedó **completamente vacío**.

### Otros archivos movidos

- `Data/Interfaces/{IAuditable,ISoftDeletable,IDomainEvent,IDomainEventDispatcher,IDomainEventHandler}.cs` → `Application/Data/Interfaces/` (junto al `ApplicationDbContext.cs` ya movido en la Fase 2; es infraestructura transversal, no de un módulo de negocio específico).
- `Identity/IdentityErrorDescriberEs.cs` → `Application/Identity/IdentityErrorDescriberEs.cs`.
- `Seeds/FinancialReportSeed.cs.disabled` → `Application/Seeds/FinancialReportSeed.cs.disabled` (archivo ya deshabilitado desde antes, con extensión `.disabled` — no se recompila; se movió solo por preservar el historial junto con `IdentitySeed.cs`).

### Ajuste sistemático de `using` (mismo patrón que en fases anteriores)

Se identificaron con `grep` **55 archivos de entidades** que implementan `IAuditable`/`ISoftDeletable` sin calificar (dependían del `Using` global de proyecto de `Infrastructure.Data.csproj`, que `Application.csproj` no tiene por la colisión de nombres con `LuxuryApp.Shared.Events` descubierta en la Fase 2). A cada uno se le agregó `using LuxuryApp.Infrastructure.Data.Interfaces;` a nivel de archivo:

- 49 detectados por búsqueda inicial con expresión regular sobre la declaración de clase.
- **6 adicionales** (`BudgetProposal.cs`, `CustomDocument.cs`, `DiagramDraw.cs`, `WorkGroup.cs`, `WorkPosition.cs`, `WorkPositionSchedule.cs`) que la regex no capturó por variaciones de formato en la línea de clase — se detectaron por los errores `CS0246` de la primera compilación tras el movimiento y se corrigieron de la misma forma.

No se reintrodujo el `Using` global a nivel de `.csproj` para evitar repetir la colisión `IDomainEvent`/`IDomainEventHandler`/`IDomainEventDispatcher` vs. `LuxuryApp.Shared.Events` ya resuelta en la Fase 2.

### Cierre de la Fase 3 (según lo indicado por el usuario, al vaciarse por completo `Infrastructure.Data`)

1. **`ApplicationDbContext.cs`**: revertida la segunda llamada a `ApplyConfigurationsFromAssembly` agregada como parche temporal en la Fase 2 — queda solo `modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly)`, ya que ahora **todas** las `EntityConfigurations` viven en el mismo ensamblado `Application`.
2. **`LuxuryApp.Application.csproj`**: removido `<ProjectReference Include="..\LuxuryApp.Infrastructure.Data\...">`.
3. **`LuxuryApp.Infrastructure.Vault.csproj`**: se descubrió una segunda `ProjectReference` a `Infrastructure.Data` (no mencionada en el plan original) — verificado que el código de `Vault` no usa ningún tipo de `Infrastructure.Data` (0 coincidencias), así que también se removió por ser una referencia muerta.
4. **`LuxuryApp.sln`**: removida la entrada `Project(...) = "LuxuryApp.Infrastructure.Data", ...` y sus 12 líneas de `ProjectConfigurationPlatforms` (Debug/Release × Any CPU/x64/x86) en la sección `Global`.
5. **Carpeta `LuxuryApp.Infrastructure.Data/` eliminada por completo** (`git rm -r` + `rm -rf`). Al inspeccionarla antes de borrar se encontraron dos artefactos huérfanos no referenciados por el `.sln` principal: `LuxuryApp.DataContext.csproj` (proyecto legacy en net9.0, sin `ProjectReference` desde ningún lado) y `LuxuryApp.Infrastructure.Data.sln` (una mini-solución anidada, también huérfana). Ambos se eliminaron junto con el resto de la carpeta.

`LuxuryApp.Infrastructure.MockAspel` también fue revisado (tenía un comentario mencionando "Infrastructure.Data" en un docstring, sin `ProjectReference` real) — no requirió cambios.

### Estado de compilación

- Primera pasada tras mover todo (`dotnet build`, incremental): **2 errores** — ambos en `LuxuryApp.Infrastructure.Data.csproj` (su `GlobalUsings.g.cs` autogenerado ya no podía resolver `LuxuryApp.Infrastructure.Data.Entities`/`.Interfaces` porque el proyecto había quedado vacío de código fuente). Esto confirmó que el vaciado fue exitoso y que tocaba cerrar la Fase 3.
- Tras cerrar la Fase 3 (quitar `ProjectReference`, quitar del `.sln`, borrar la carpeta): **6 errores** `CS0246` (los 6 archivos con formato de clase no capturado por la regex, ver arriba). Corregidos.
- **Build final: `dotnet build LuxuryApp.sln` → Compilación correcta. 0 Errores.**
  - Incremental: 0 Advertencia(s).
  - `dotnet clean` + rebuild completo: **141 Advertencia(s), 0 Errores.** Se revisó la distribución de códigos (`CS8632` nullable-annotation ×198, `CS8625` ×32, `CS9113` ×18, `CS0618` obsolete ×14, `CS8669`/`CS8620`/`CS4014`/`CS0168`/`CS8600`/`CS0219` en cantidades menores — la suma cruda supera 141 porque MSBuild reporta algunas líneas dos veces en verbosity `minimal`). Son las mismas categorías de advertencia vistas en fases anteriores (`Nullable` deshabilitado a nivel de proyecto en `Application.csproj`, igual que ya lo estaba en `Infrastructure.Data.csproj`) — preexistentes, no introducidas por este movimiento; simplemente no se habían visto todas juntas hasta ahora porque nunca se había hecho un `clean` + rebuild completo de esta magnitud en la sesión.

### Verificación en ejecución

`dotnet run --no-launch-profile` desde `LuxuryApp.Api/` durante 25 s (proveedor activo: SqlServer). Log: `✅ Serilog inicializado.` → `Database providers: Application=SqlServer, Logging=SqlServer, Hangfire=SqlServer` → proceso vivo sin excepciones hasta que se detuvo manualmente. A diferencia de la verificación de la Fase 3 (que mostraba la advertencia `No instantiatable types... scanning assembly 'LuxuryApp.Application'`), esta vez **no apareció esa advertencia**, confirmando que el único `ApplyConfigurationsFromAssembly` restante encuentra correctamente las configuraciones (ya no hay un segundo ensamblado que escanear).

### Resultado

`LuxuryApp.Infrastructure.Data` **ya no existe** como proyecto. Toda la persistencia (DbContext, Migrations, Entidades, EntityConfigurations, Interfaces de dominio, Seeds, Identity) vive ahora en `LuxuryApp.Application`, respetando los namespaces originales. La solución tiene un proyecto menos (`LuxuryApp.sln` pasó de referenciar `Infrastructure.Data` a no hacerlo).

### Pendiente para continuar (opcional, no bloqueante)

- **Refinamiento organizativo:** los 8 módulos migrados en bloque (System, Cobranza, Contabilidad, RecursosHumanos, Legal, Mantenimiento, Operations, Compras/Supplier) quedaron con sus entidades en `Domain/Entities/<subcarpeta-original>` a nivel de módulo, sin la subdivisión fina por sub-módulo/feature que sí se hizo para Reclutamiento. Si se quiere ese nivel de detalle, es un refinamiento posterior módulo por módulo, sin urgencia (no afecta compilación ni namespaces).
- **Limpieza de advertencias preexistentes:** 141 advertencias (mayormente `CS8632` por `Nullable disable` a nivel de proyecto combinado con anotaciones `?` en el código) quedaron expuestas por el `clean` + rebuild completo. No son nuevas ni bloqueantes; una limpieza futura podría evaluar habilitar `<Nullable>enable</Nullable>` en `Application.csproj` de forma incremental.
- Nada comprometido a git — todos los cambios de esta sesión (Fases 1 a 4 completas) siguen en el working tree del repo `api/`, listos para revisión.

---

## 2026-09-01 — Migración arquitectónica: Fase 6 (Consolidación de Infraestructura Secundaria: Logs, MockAspel, Vault)

**Nota:** `plan.migration.folder.md` fue actualizado (por el usuario) desde la última lectura — ahora incluye una Fase 5 (Auditoría de Acoplamiento Cruzado, no ejecutada en esta sesión) y esta Fase 6. Se ejecutó únicamente la Fase 6, tal como se pidió.

**Objetivo:** absorber `LuxuryApp.Infrastructure.Logs`, `LuxuryApp.Infrastructure.MockAspel` y `LuxuryApp.Infrastructure.Vault` dentro de `LuxuryApp.Application/Infrastructure/{Logs,MockAspel,Vault}`, eliminando los 3 proyectos periféricos.

### Inventario y movimiento (`git mv`, namespaces intactos)

| Proyecto origen | Archivos `.cs` | Destino |
|---|---|---|
| `LuxuryApp.Infrastructure.Logs` | 8 (`Data/`, `Entities/`, `Migrations/`, `Registration/`) | `Application/Infrastructure/Logs/` |
| `LuxuryApp.Infrastructure.MockAspel` | 16 (`DTOs/`, `Endpoints/`, `Entities/`, `Extensions/`, `Services/`) | `Application/Infrastructure/MockAspel/` |
| `LuxuryApp.Infrastructure.Vault` | 26 (`Abstractions/`, `DTOs/`, `Data/`, `Entities/`, `Migrations/`, `Registration/`, `Repositories/`, `Security/`, `Seeds/`, `Services/`) | `Application/Infrastructure/Vault/` |

Namespaces originales (`LuxuryApp.Infrastructure.Logs.*`, `LuxuryApp.Infrastructure.MockAspel.*`, `LuxuryApp.Infrastructure.Vault.*`) intactos en todos. Se movió también `documentacion-vault.md` (única no-`.cs` en los 3 proyectos) — se detectó tarde (quedó borrada por un `rm -rf` de carpeta completa en vez de `git mv`), se recuperó con `git show HEAD:...` y se reubicó correctamente con `git mv`.

**`LuxuryAppLogsDbContextFactory.cs` y `VaultDbContextFactory.cs`:** mismo patrón que `ApplicationDbContextFactory.cs` en la Fase 2 (`Path.Combine(Directory.GetCurrentDirectory(), "..", "LuxuryApp.Api")`) — **no requirieron ajuste**, ya que `Application` sigue siendo carpeta hermana directa de `LuxuryApp.Api` bajo `api/`. Sus comentarios de uso (`--project LuxuryApp.Infrastructure.Logs/.Vault --startup-project LuxuryApp.Api`) quedaron desactualizados como texto de documentación — no se tocaron por no ser código ni afectar la compilación; queda como limpieza cosmética opcional.

**`MockAspelDataSeeder.cs`:** su ruta a los JSON de siembra (`AppDomain.CurrentDomain.BaseDirectory` + `..\..\..\..\LuxuryApp.Application\Moduls\ContabilidadLuxuryApp\...`) ya apuntaba explícitamente a `LuxuryApp.Application` por nombre, independiente de dónde vivía el archivo fuente — no requirió cambios.

Ningún archivo de los 3 proyectos implementaba `IAuditable`/`ISoftDeletable`/`IDomainEvent` (verificado con `grep` antes de mover), así que no aplicó el parche de `using` visto en fases anteriores. Tampoco se encontraron colisiones de nombres de tipos entre estos 3 proyectos y el código ya existente en `Application` (58 tipos públicos comparados, 0 colisiones).

### Preparación de dependencias en `Application.csproj`

`PackageReference` únicos copiados (versiones exactas): `Microsoft.EntityFrameworkCore` 10.0.10, `Microsoft.EntityFrameworkCore.SqlServer` 10.0.10, `Microsoft.EntityFrameworkCore.InMemory` 10.0.10 (de Logs/Vault/MockAspel respectivamente — `Microsoft.EntityFrameworkCore.Design` ya estaba presente desde la Fase 1). `Using` único agregado: `System.Security.Cryptography` (de Vault). Los demás `Using` de los 3 proyectos (`DataAnnotations`, `EntityFrameworkCore`, `Extensions.Configuration/DependencyInjection/Logging`, `EntityFrameworkCore.Metadata`, `LuxuryApp.Shared.DTOs`) ya estaban presentes en `Application.csproj` — no se duplicaron. Los `Using` de `LuxuryApp.Infrastructure.Vault.Abstractions/.Seeds/.Data/.Entities` ya existían de antes (Application ya referenciaba Vault directamente).

### Hallazgo no anticipado por el plan: ciclo de dependencias con `LuxuryApp.Providers`

`LuxuryApp.Infrastructure.Vault.csproj` era referenciado también por `LuxuryApp.Providers.csproj` (usado en `TwilioWhatsAppService.cs` vía `ISecretProvider`/`VaultSecretNames`). Al mover Vault dentro de `Application`, `Providers` debía pasar a referenciar `Application` en su lugar — pero **`Application.csproj` ya tenía una `ProjectReference` a `Providers`**, lo que habría creado un ciclo (`Application → Providers → Application`).

Se verificó que el código de `Application` no usa ningún tipo del namespace `LuxuryApp.Providers.*` directamente (0 coincidencias) — el patrón real es: `Application` define interfaces (ej. `IEmailService`), `Providers` las implementa, y solo `LuxuryApp.Api` (raíz de composición) necesita referenciar ambos para el wiring de DI, lo cual ya hacía. Se **removió** `<ProjectReference Include="..\LuxuryApp.Providers\...">` de `Application.csproj` para romper el ciclo.

Esto reveló una segunda dependencia oculta: la compilación falló con `CS0246` en 2 archivos de `Application` (`FundingFileAppService.cs`, `TaskLegalAppService.cs`) que usan tipos `iText.*` — resultó que `Application` obtenía el paquete NuGet `itext`/`itext.bouncy-castle-adapter` **transitivamente** a través de la (ahora removida) referencia a `Providers`. Se agregaron `itext` 9.5.0 e `itext.bouncy-castle-adapter` 9.5.0 directamente a `Application.csproj` (mismas versiones que tenía `Providers.csproj`). Un tercer archivo (`MeetingDertailsSeguimientoAppService.cs`) reveló una dependencia transitiva adicional a `HtmlAgilityPack` (no declarada explícitamente en ningún `.csproj` de la solución — llegaba transitivamente vía la cadena de paquetes de `Providers`, probablemente `MailKit`/`AspNetCore.MailKitMailer`); se agregó `HtmlAgilityPack` 1.12.4 (única versión disponible en la caché local de NuGet) directamente a `Application.csproj`.

### Actualización de referencias en otros proyectos

- **`LuxuryApp.Api.csproj`:** removidas las `ProjectReference` a `Infrastructure.Vault`, `Infrastructure.Logs` e `Infrastructure.MockAspel` (ya innecesarias — todo llega vía `Application`).
- **`LuxuryApp.Providers.csproj`:** su `ProjectReference` a `Infrastructure.Vault` reemplazada por una a `Application` (ver hallazgo del ciclo arriba).
- **`LuxuryApp.Tests.csproj`:** removida la `ProjectReference` a `Infrastructure.MockAspel` (redundante — ya referenciaba `Application`, que ahora contiene ese código).
- **`LuxuryApp.Infrastructure.MockAspel.csproj`** tenía su propia `ProjectReference` a `Application` (dependencia inversa ya existente antes de esta fase) — se volvió irrelevante al fusionarse ambos proyectos; desaparece junto con el `.csproj` eliminado.

### Limpieza de la solución

- **`LuxuryApp.sln`:** removidas las 3 entradas `Project(...)` (Vault, Logs, MockAspel) y sus 36 líneas de `ProjectConfigurationPlatforms` asociadas. La solución quedó con 5 proyectos: `Application`, `Api`, `Shared`, `Tests`, `Providers`.
- **Carpetas eliminadas por completo:** `LuxuryApp.Infrastructure.Logs/`, `LuxuryApp.Infrastructure.MockAspel/`, `LuxuryApp.Infrastructure.Vault/` (`git rm -r` + `rm -rf`).

### Estado de compilación

- Primera pasada (tras mover todo + limpiar `.sln`/`.csproj`): **9 errores** `CS0246` — todos por los paquetes transitivos perdidos (`iText` en 2 archivos, `HtmlAgilityPack` en 1) al romper el ciclo con `Providers`. Corregidos agregando los `PackageReference` directos descritos arriba.
- **Build final: `dotnet build LuxuryApp.sln` → Compilación correcta. 0 Errores.**
  - Incremental: 0 Advertencia(s).
  - `dotnet clean` + rebuild completo: **165 Advertencia(s), 0 Errores** (antes de esta fase: 141). El incremento (+24, principalmente `CS8632`) es proporcional a los ~370 archivos recién incorporados a `Application.csproj` (que tiene `Nullable disable`) — misma categoría de advertencia preexistente documentada en la Fase 4, no una regresión nueva.

### Verificación en ejecución

`dotnet run --no-launch-profile` desde `LuxuryApp.Api/` durante 25 s. Log: `✅ Serilog inicializado.` → `Database providers: Application=SqlServer, Logging=SqlServer, Hangfire=SqlServer` → proceso vivo sin excepciones hasta detención manual. Se confirmó además que `Program.cs` sigue resolviendo `AddMockAspelInMemory()`, `AddVaultServices(...)` y `AddLuxuryAppLogsServices(...)` sin cambios (mismos namespaces, ahora dentro de `Application`, que `Api` ya referenciaba).

### Resultado

`LuxuryApp.Infrastructure.Logs`, `LuxuryApp.Infrastructure.MockAspel` y `LuxuryApp.Infrastructure.Vault` **ya no existen** como proyectos. La solución pasó de 5 a 5 proyectos netos en esta fase específica (se quitaron 3, pero ya se venía de 8 tras la Fase 4) — ahora: `Application`, `Api`, `Shared`, `Tests`, `Providers`. Todo el código de logging aislado, mock de Aspel/COI y gestión de secretos (Vault) vive en `Application/Infrastructure/`, respetando namespaces originales.

### Pendiente para continuar (opcional, no bloqueante)

- **Fase 5 (Auditoría de Acoplamiento Cruzado):** no ejecutada en esta sesión — el plan la describe como un barrido de referencias cruzadas entre módulos de negocio, previo o posterior a esta consolidación de infraestructura.
- **Comentarios desactualizados:** los docstrings de `LuxuryAppLogsDbContextFactory.cs` y `VaultDbContextFactory.cs` siguen mencionando `--project LuxuryApp.Infrastructure.Logs`/`.Vault` (proyectos ya eliminados). Cosmético, no bloqueante.
- Nada comprometido a git — todos los cambios de esta sesión (Fases 1 a 4 y ahora 6) siguen en el working tree del repo `api/`, listos para revisión.

---

## 2026-09-01 — Migración arquitectónica: Fase 6 (continuación) — reubicación de `Application/Data/` a `Application/Infrastructure/Data/`

**Contexto:** el usuario repitió la instrucción de la Fase 6 (Logs, MockAspel, Vault) y agregó una tarea nueva no cubierta en la ejecución anterior: mover la carpeta `LuxuryApp.Application/Data/` (el core de persistencia reubicado en la Fase 2 — `ApplicationDbContext`, `PostgresDbContext`, `ApplicationDbContextFactory`, `Migrations/`, `Interfaces/`) hacia `LuxuryApp.Application/Infrastructure/Data/`, para que quede junto a `Infrastructure/Logs`, `Infrastructure/MockAspel` e `Infrastructure/Vault` ya movidos.

### Verificación de lo ya ejecutado

Antes de repetir trabajo, se verificó el estado real: `Logs`, `MockAspel` y `Vault` **ya estaban consolidados** en `Application/Infrastructure/` desde la sesión anterior (`git status` limpio salvo los cambios ya registrados; `dotnet build` en verde de entrada). Las carpetas `LuxuryApp.Infrastructure.Logs/`, `LuxuryApp.Infrastructure.MockAspel/` y `LuxuryApp.Infrastructure.Vault/` habían reaparecido vacías en el árbol de trabajo (solo contenían `bin/`/`obj/` residuales, ignorados por git, regenerados por builds posteriores) — se limpiaron con `rm -rf` sin impacto en git (no había nada rastreado en ellas). No se rehizo ningún movimiento de esos 3 proyectos.

### Movimiento ejecutado: `Data/` → `Infrastructure/Data/`

18 archivos movidos con `git mv` (namespace `LuxuryApp.Infrastructure.Data` intacto, igual que en la Fase 2): `ApplicationDbContext.cs`, `ApplicationDbContextFactory.cs`, `PostgresDbContext.cs`, `Interfaces/` (5 archivos), `Migrations/` (11 archivos).

**Corrección durante la ejecución:** el primer intento con `git mv LuxuryApp.Application/Data LuxuryApp.Application/Infrastructure/Data` produjo un anidamiento incorrecto (`Infrastructure/Data/Data/...`) porque la carpeta destino `Infrastructure/Data` ya existía vacía en el árbol de trabajo, y `git mv` (como `mv` de Unix) movió `Data` **dentro** de ella en vez de renombrarla. Se corrigió moviendo cada elemento un nivel hacia arriba con `git mv` individuales (`ApplicationDbContext.cs`, `ApplicationDbContextFactory.cs`, `PostgresDbContext.cs`, `Interfaces/`, `Migrations/`) hasta dejar la estructura plana correcta: `Application/Infrastructure/Data/{ApplicationDbContext.cs, ApplicationDbContextFactory.cs, PostgresDbContext.cs, Interfaces/, Migrations/}`. El historial de git en cada archivo sigue completo (se ve como una cadena de renames: `Infrastructure.Data → Application/Data → Application/Infrastructure/Data/Data → Application/Infrastructure/Data`).

**`ApplicationDbContextFactory.cs`:** se revisó de nuevo el path relativo (`Path.Combine(Directory.GetCurrentDirectory(), "..", "LuxuryApp.Api")`) — **no requirió ajuste**, mismo razonamiento que en la Fase 2 y la Fase 6 anterior: `Directory.GetCurrentDirectory()` en tiempo de diseño de EF resuelve a la raíz del proyecto (`Application/`), no a la subcarpeta del archivo fuente, así que el anidamiento adicional (`Infrastructure/Data/` en vez de `Data/`) no afecta la resolución de la ruta.

No se encontraron referencias de ruta literal a `Application/Data/` (código o config) que necesitaran actualizarse — se verificó con búsqueda global.

### Dependencias (`Application.csproj`)

No hubo cambios adicionales de `PackageReference`/`Using` en este paso: este movimiento es solo de reubicación de carpeta dentro del mismo proyecto (`Application`), sin cruzar límites de ensamblado — a diferencia de Logs/MockAspel/Vault, que sí eran proyectos externos con sus propias dependencias.

### Estado de compilación

- `dotnet build LuxuryApp.sln` → **Compilación correcta. 0 Errores.** (0 advertencias en incremental).
- `dotnet clean` + rebuild completo: **165 Advertencia(s), 0 Errores** — sin cambio frente a la Fase 6 anterior (el movimiento no tocó contenido de archivos, solo ubicación).

### Verificación en ejecución

`dotnet run --no-launch-profile` desde `LuxuryApp.Api/` durante 20 s: `✅ Serilog inicializado.` → `Database providers: Application=SqlServer, Logging=SqlServer, Hangfire=SqlServer` → proceso vivo sin excepciones hasta detención manual.

### Resultado

`LuxuryApp.Application/Infrastructure/` ahora contiene los 4 sub-árboles de infraestructura consolidados: `Data/` (DbContext + Migrations + Interfaces de dominio), `Logs/`, `MockAspel/`, `Vault/`. La carpeta `Application/Data/` ya no existe.

### Pendiente para continuar (sin cambios respecto a la entrada anterior)

- **Fase 5 (Auditoría de Acoplamiento Cruzado):** sigue sin ejecutarse.
- **Comentarios desactualizados** en `LuxuryAppLogsDbContextFactory.cs`/`VaultDbContextFactory.cs`: sin cambios, cosmético.
- Nada comprometido a git.

---

## 2026-09-01 — Fase 5: Auditoría y Resolución de Acoplamiento Cruzado — CERRADA sin movimientos (hallazgo arquitectónico)

**Metodología pedida por el plan:** análisis estático de `using` en `Moduls/` buscando el patrón `using LuxuryApp.Application.Moduls.<OtroModulo>...`, y reubicar lo encontrado a `Moduls/[Modulo]/Shared/` (mismo módulo maestro) o `Moduls/SharedLuxuryApp/` (distintos módulos maestros), actualizando namespace y todos los consumidores.

### Hallazgo central: el criterio de búsqueda no aplica a la convención real del código

Se ejecutó el grep sobre los 2,520 archivos `.cs` de `Moduls/`. Resultado: **solo 4 archivos en todo el árbol declaran un namespace calificado por módulo** (`namespace LuxuryApp.Application.Moduls.<X>...`). La inmensa mayoría — ~2,016 archivos (80%) — usa un esquema de **5 namespaces planos compartidos por capa técnica**, independientemente de en qué carpeta de módulo vivan físicamente:

| Namespace | Archivos |
|---|---|
| `LuxuryApp.Application.DTOs` | 893 |
| `LuxuryApp.Application.Interfaces` | 374 |
| `LuxuryApp.Application.Services` | 363 |
| `LuxuryApp.Application.EndPoints` | 282 |
| `LuxuryApp.Application.Mappings` | 96 |

Es decir: la ubicación en `Moduls/<Modulo>/<SubModulo>/...` es puramente organizativa para humanos (estructura de "cortes verticales" en disco) — el compilador nunca usó el namespace para hacer cumplir fronteras de módulo. Un archivo en `Moduls/ContabilidadLuxuryApp/.../DTOs/Foo.cs` y uno en `Moduls/ReclutamientoLuxuryApp/.../DTOs/Bar.cs` comparten literalmente el mismo namespace (`LuxuryApp.Application.DTOs`), que además ya está declarado como `Using` global de proyecto en `Application.csproj`. Por eso una clase de un módulo puede ser consumida desde cualquier otro módulo **sin ningún `using` explícito que lo delate** — el criterio de búsqueda del plan (basado en `using Moduls.X`) es estructuralmente incapaz de detectar ese tipo de acoplamiento en este codebase, porque nunca existió una barrera de namespace que cruzar.

### El único hallazgo real, examinado y descartado

De los 2 `using` con namespace calificado por módulo encontrados (ambos en el mismo archivo, `Moduls/AdminLuxuryApp/Infraestructura/Jobs/Catalog/HangfireJobCatalog.cs`):

- `using LuxuryApp.Application.Moduls.AdminLuxuryApp.Infraestructura.Jobs.Workers;` — mismo módulo maestro (Admin), no es una violación.
- `using LuxuryApp.Application.Moduls.SystemLuxuryApp.SystemTenant.Notification.Jobs;` — cruza módulos maestros (Admin → System).

Se investigó este segundo caso: `NotificationCleanupJob.cs` es una clase concreta de Hangfire Job, propiedad natural del dominio de notificaciones de `SystemLuxuryApp` (único archivo que la define; ningún otro archivo de System la usa fuera de sí misma). `HangfireJobCatalog.cs` en Admin la referencia únicamente para **registrarla/catalogarla** para el scheduler de Hangfire — es decir, es un caso de orquestación legítima entre módulos (un catálogo central necesita conocer las clases concretas de los jobs para poder programarlos), **no** una clase de dominio (DTO/interfaz/enum) mal ubicada que debería vivir en `Shared`. Moverla a `SharedLuxuryApp` habría sido incorrecto: le habría quitado la cohesión con el dominio de notificaciones al que pertenece, sin ningún beneficio real, violando además la regla de esta fase de "no crear nueva lógica ni modificar servicios" (habría requerido tocar el job y su registro).

**Conclusión: no se movió ningún archivo.** No hay violaciones de namespace que corregir según el criterio literal del plan.

### Decisión del usuario sobre el alcance

Se presentó este hallazgo al usuario (dueño de la arquitectura) junto con dos alternativas: (a) cerrar la Fase 5 como completa dado que el criterio de búsqueda no encuentra violaciones reales, o (b)/(c) adaptar la metodología a un análisis por tipo/carpeta física (indexar qué clases se *definen* en cada módulo y buscar dónde se *usan* sin `using` calificado, dado que los namespaces planos lo permiten) — con el riesgo explícito de generar muchos falsos positivos por nombres genéricos (`StatusDTO`, `ResponseDTO`, etc.) en un árbol de 2,520 archivos, y de requerir tocar muchos más archivos de los que esta fase originalmente contemplaba.

**El usuario eligió cerrar la Fase 5 como completa** con el hallazgo documentado, sin ejecutar el análisis alternativo.

### Estado de compilación

Esta fase no modificó ningún archivo (análisis de solo lectura). Se verificó igualmente `dotnet build LuxuryApp.sln`:

- Primer intento: **4 errores** `MSB3021`/`MSB3027` — bloqueo de archivo en `LuxuryApp.Providers.dll` dentro de `LuxuryApp.Api/bin/`. Causa: un proceso `LuxuryApp.Api.exe` (PID 51224) de una prueba de arranque (`dotnet run`) de la Fase 6 anterior había quedado vivo en segundo plano pese al `kill` enviado en su momento — nada relacionado con el código ni con esta fase. Se identificó el proceso exacto con `Get-Process -Id`, se confirmó que era el apphost de `LuxuryApp.Api` (no un proceso ajeno de la IDE u otra herramienta), y se detuvo con `Stop-Process -Force`.
- Segundo intento: **Compilación correcta. 0 Advertencia(s). 0 Errores.**

### Resultado

Fase 5 cerrada sin movimientos de código. Hallazgo arquitectónico documentado para referencia futura: si en algún momento se quiere hacer cumplir fronteras de módulo reales, el primer paso tendría que ser migrar del esquema de namespaces planos por capa (`LuxuryApp.Application.{DTOs,Interfaces,Services,EndPoints,Mappings}`) a namespaces calificados por módulo — sin eso, ninguna herramienta de análisis basada en `using` puede detectar acoplamiento cruzado en este código, porque el compilador ya trata todo el árbol de `Moduls/` como un espacio de nombres compartido.

### Pendiente para continuar

- **Fase 5, alcance ampliado (opcional, si se decide más adelante):** análisis por tipo/carpeta física en vez de por namespace, posiblemente acotado solo a `Interfaces/`/`Services/` (superficie de contrato) para reducir ruido, con revisión manual antes de mover nada.
- Resto de pendientes sin cambios respecto a la entrada anterior (Fase 4 organizativo, advertencias preexistentes, comentarios desactualizados en factories de Logs/Vault).
- Nada comprometido a git.

---

## 2026-09-02 — Migración arquitectónica: Fase 7 (Absorción final de `LuxuryApp.Providers` y `LuxuryApp.Shared`)

### Contexto al iniciar: el trabajo previo fue comprometido y estabilizado por otra sesión

Al retomar esta fase se encontró que el trabajo de las Fases 1–6 (que en las bitácoras anteriores quedaba "sin comprometer a git") **ya había sido confirmado** (`git commit`) y además ajustado por otra sesión/agente: `git log` mostró commits `3b9b9efc "Fase 6 está al 100% terminada..."`, `4526c999 "Fase 5 terminada"`, `ee097d4f`/`ff19dded "fix: stabilize app after Moduls→Modules directory rename"` y `e1c3adb9 "Ajuste name space Using, estabilizado"`. Es decir, alguien renombró la carpeta física `Moduls/` a `Modules/` (corrigiendo el typo) entre sesiones. Se verificó que esto no afecta el trabajo de esta fase (los namespaces de archivo siguen siendo los planos de siempre — `LuxuryApp.Application.DTOs`, `.Services`, etc. — la carpeta es solo organizativa). Se partió de un `git status` limpio y `dotnet build` en verde antes de tocar nada.

### Objetivo

Absorber los últimos dos proyectos periféricos, `LuxuryApp.Providers` y `LuxuryApp.Shared`, dentro de `LuxuryApp.Application`, dejando la solución en 3 proyectos: `Application`, `Api`, `Tests` ("Arquitectura Monolítica Unificada").

### Movimiento físico (`git mv`, namespaces intactos)

| Origen | Archivos | Destino |
|---|---|---|
| `LuxuryApp.Providers/Services/` | 12 | `LuxuryApp.Application/Infrastructure/Providers/Services/` |
| `LuxuryApp.Providers/Extensions/` | 1 | `LuxuryApp.Application/Infrastructure/Providers/Extensions/` |
| `LuxuryApp.Shared/{Constants,Design,DTOs,Enums,Events,Extensions,Services,Settings,Time,Utils}/` | 314 (309 `.cs` + 5 `.cs.disabled`) | `LuxuryApp.Application/Shared/{misma subcarpeta}/` |

Total: 327 elementos movidos con `git mv`. Ningún namespace fue modificado (`namespace LuxuryApp.Providers.Services;`, `namespace LuxuryApp.Shared.DTOs;`, etc. quedaron idénticos). También se detectó y descartó correctamente `LuxuryApp.Shared/LuxuryApp.Shared.sln` — otro artefacto de solución anidada huérfana (mismo patrón que se vio en la Fase 4 con `Infrastructure.Data`), no referenciado por el `.sln` principal — se eliminó junto con el resto de la carpeta en vez de moverse.

**Verificación previa (mismo protocolo que fases anteriores):** se comprobó que ningún archivo de `Providers`/`Shared` dependía de rutas de archivo relativas al proyecto (`GetCurrentDirectory`, `AppDomain.BaseDirectory`) ni implementaba `IAuditable`/`ISoftDeletable` sin calificar — ambos limpios, sin necesidad de parches adicionales de ese tipo. Se hizo también el chequeo de colisión de nombres de tipos (345 tipos públicos entrantes vs. 2,876 ya existentes en `Application`): only 3 colisiones, las mismas 3 ya conocidas y resueltas desde la Fase 2 (`IDomainEvent`, `IDomainEventDispatcher`, `IDomainEventHandler` — duplicados entre `LuxuryApp.Shared.Events` y `LuxuryApp.Infrastructure.Data.Interfaces`; ninguno de los dos está como `Using` global de proyecto, así que no chocan).

### Preparación de dependencias en `Application.csproj`

**`PackageReference` únicos copiados de `Providers.csproj`** (versiones exactas, sin duplicar `itext`/`itext.bouncy-castle-adapter`/`HtmlAgilityPack` ya presentes desde la Fase 6): `AspNetCore.MailKitMailer` 2.2.1, `Hangfire.Core` 1.8.24, `MailKit` 4.16.0, `MaxMind.GeoIP2` 5.4.1, `Twilio` 7.14.9. (`ClosedXML`, `MimeKit`, `Newtonsoft.Json`, `PdfSharpCore`, `UglyToad.PdfPig`, `SixLabors.ImageSharp` ya estaban presentes con la misma versión — no se duplicaron). `Shared.csproj` no tenía ningún `PackageReference` propio (solo `FrameworkReference`, ya cubierto por el SDK Razor de `Application`).

**`Using` copiados** de ambos `.csproj`, evitando duplicados: `Microsoft.AspNetCore.Mvc.{Abstractions,ModelBinding,Razor,Rendering,ViewFeatures}`, `Microsoft.Extensions.Options`, `System.{ComponentModel,Data,Net,Net.Http.Headers,Net.Mime,Security.Claims,Text.Json,Web}`.

### Hallazgo repetido: nuevos `Using` globales chocan con `using` de archivo ya existentes

Mismo patrón que en la Fase 2 (colisión `IDomainEvent`) y la Fase 6 (paquetes transitivos): al agregar `Using` de proyecto que antes eran privados de `Providers`/`Shared` (proyectos pequeños, sin colisión en su propio contexto), aparecieron **6 ambigüedades `CS0104`** al mezclarlos con el namespace, mucho más grande, de `Application`:

| `Using` global agregado (y luego revertido) | Colisión con | Archivo(s) afectado(s) que necesitaban el símbolo sin calificar |
|---|---|---|
| `System.ComponentModel` | — (sin colisión directa, pero se prefirió no dejarlo global) | `Shared/Extensions/EnumExtensions.cs` (`DescriptionAttribute`) |
| `SixLabors.ImageSharp` / `.Processing` | `NetTopologySuite.Geometries.Point` vs `SixLabors.ImageSharp.Point` | `Infrastructure/Providers/Services/ImageStorageService.cs` |
| `Microsoft.AspNetCore.Mvc.ViewEngines` | `Microsoft.EntityFrameworkCore.Metadata.IView` vs `...ViewEngines.IView` | `Shared/Services/IRazorViewToStringRenderer.cs` |
| `PdfSharpCore.Pdf` / `.IO` / `.IO.enums` | `iText.Kernel.Pdf.PdfDocument` (using de archivo ya existente en 2 archivos de Contabilidad/Operations desde la Fase 6) | `Infrastructure/Providers/Services/MergePdfService.cs` |
| `ClosedXML.Excel` | `System.Xml.Linq.LoadOptions` (using de archivo ya existente en `OrdenCompraStatusAppService.cs`) | `Infrastructure/Providers/Services/ExportToExcelService.cs` |

**Resolución:** se revirtieron los 5 `Using` de proyecto (no se dejaron globales) y en su lugar se agregó `using` a nivel de archivo únicamente en los archivos que realmente necesitaban el símbolo sin calificar (identificados por dónde aparecía el símbolo colisionado en el código, no por adivinar). Para `IView` específicamente, como el archivo también necesitaba otro tipo (`IRazorViewEngine`, que en realidad vive en `Microsoft.AspNetCore.Mvc.Razor`, ya global desde esta misma fase) se usó un alias de tipo (`using IView = Microsoft.AspNetCore.Mvc.ViewEngines.IView;`) en vez de importar el namespace completo, para no reintroducir el choque.

### Segundo hallazgo, no relacionado con Providers/Shared: bug preexistente de namespace-vs-tipo en `LuxuryApp.Tests`, desenmascarado ahora que `Application` compila

Una vez resueltas las colisiones anteriores, `LuxuryApp.Application` compiló por primera vez en esta sesión de punta a punta — lo cual permitió, por primera vez, que MSBuild intentara compilar `LuxuryApp.Tests` (que depende de `Application`; con `Application` roto, `Tests` nunca llegaba a compilarse y sus propios errores quedaban ocultos). Aparecieron **4 errores `CS0118`** ("'X' es espacio de nombres pero se usa como tipo") en archivos de prueba cuyo namespace propio termina exactamente en el nombre de la entidad que prueban — ej. `namespace LuxuryApp.Tests.Application.Modules.RecursosHumanos.EmployeeBankData;` en un archivo que también usa `new EmployeeBankData { ... }` sin calificar. Esto es un defecto preexistente de la reorganización "Moduls→Modules" (ver commits arriba, ajenos a esta sesión), no algo introducido por la Fase 7 — solo se hizo visible ahora.

Se hizo un barrido sistemático (comparando el último segmento del namespace de cada archivo de prueba contra los 3,218 nombres de tipo públicos existentes en `Application`) y se corrigieron los **4 casos reales** encontrados, calificando el tipo con su namespace completo en el sitio de construcción (`new LuxuryApp.Infrastructure.Data.Entities.X`), sin tocar la declaración de namespace del archivo de prueba:

- `EmployeeBankDataAppServiceTests.cs`
- `EmployeeClinicalDataAppServiceTests.cs`
- `ComiteVigilanciaAppServiceTests.cs`

(Un cuarto candidato por nombre, `PanicAlert`/`TaskAttachment`/`TaskJustification`/`Tasks`, no mostró uso sin calificar del tipo en el análisis estático y no generó error de compilación — se dejaron sin tocar.)

### Limpieza de referencias y de la solución

- **`LuxuryApp.Application.csproj`**: removida la `ProjectReference` a `LuxuryApp.Shared` (auto-referencia sin sentido tras la fusión).
- **`LuxuryApp.Api.csproj`**: removida la `ProjectReference` a `LuxuryApp.Providers`.
- **`LuxuryApp.Tests.csproj`**: removida la `ProjectReference` a `LuxuryApp.Shared`.
- **`LuxuryApp.sln`**: se usó `dotnet sln remove` (tal como pedía el plan) para quitar `LuxuryApp.Providers` y `LuxuryApp.Shared`. La solución quedó con exactamente 3 proyectos: `LuxuryApp.Application`, `LuxuryApp.Api`, `LuxuryApp.Tests`.
- **Carpetas eliminadas por completo:** `LuxuryApp.Providers/`, `LuxuryApp.Shared/` (`git rm -r` + `rm -rf`), incluyendo sus `.csproj` y el `.sln` huérfano de Shared.

### Estado de compilación

- Iteración con errores intermedios (documentados arriba): colisiones de `Using` global (6 archivos) → resueltas; namespace-vs-tipo en Tests (4 archivos) → resueltas. También se encontraron y limpiaron **2 procesos `LuxuryApp.Api.exe` huérfanos** (de pruebas de arranque de turnos anteriores) que bloqueaban la copia de `.dll` durante el build (`MSB3021`/`MSB3027`) — identificados por PID exacto vía `Get-Process`/lock message y detenidos con `Stop-Process -Force`; nada relacionado con el código.
- **Build final: `dotnet build LuxuryApp.sln` → Compilación correcta. 0 Errores.**
  - Incremental: 0 Advertencia(s).
  - `dotnet clean` + rebuild completo: **177 Advertencia(s), 0 Errores** (antes de esta fase: 165). Incremento proporcional a los ~322 archivos nuevos de `Providers`/`Shared` bajo `Nullable disable` — mismas categorías preexistentes (`CS8632` predominante), sin categorías nuevas.

### Verificación en ejecución

`dotnet run --no-launch-profile` desde `LuxuryApp.Api/` durante 22 s: `✅ Serilog inicializado.` → `Database providers: Application=SqlServer, Logging=SqlServer, Hangfire=SqlServer` → modelo EF construido (solo advertencias de query filters ya vistas en fases previas) → proceso vivo sin excepciones hasta detención manual. Se confirmó que `builder.Services.AddLuxuryProviders()` (registrado en `Program.cs:85`) sigue resolviendo correctamente.

### Resultado

`LuxuryApp.Providers` y `LuxuryApp.Shared` **ya no existen** como proyectos. La solución quedó consolidada en **3 proyectos**: `LuxuryApp.Application` (con todo el backend: dominio, aplicación e infraestructura completa bajo `Infrastructure/{Data,Logs,MockAspel,Vault,Providers}/` y código transversal bajo `Shared/`), `LuxuryApp.Api` (host/composición) y `LuxuryApp.Tests`. Todos los namespaces originales permanecen intactos, tal como exigía la regla de oro de todas las fases.

### Pendiente para continuar

- **Fase 5, alcance ampliado (opcional):** sigue sin ejecutarse (ver entrada anterior).
- **Refinamiento organizativo de la Fase 4** (System, Cobranza, Contabilidad, RH, Legal, Mantenimiento, Operations, Compras/Supplier movidos en bloque sin sub-división fina): sin cambios.
- **Comentarios desactualizados** en `LuxuryAppLogsDbContextFactory.cs`/`VaultDbContextFactory.cs`: sin cambios, cosmético.
- Nada comprometido a git — todo el trabajo de esta sesión (incluida esta Fase 7) está en el working tree del repo `api/`, listo para revisión y commit.

---

## 2026-09-01 — Remediación de Auditoría QA: 5 Vulnerabilidades de Infraestructura

**Contexto:** Tras la consolidación monolítica en `LuxuryApp.Application`, una auditoría punta-a-punta de QA identificó 5 brechas (documentadas en `docs/plans/qa_gap_analysis_migration.md`) que, aunque no rompen la compilación, pueden causar caídas o corrupción de datos en runtime. Se ejecutó la remediación de las 4 tareas de remediación inmediata; la 5ª (refactorización de Providers para usar `IFileReadPathService`/`IFileWritePathService` obligatoriamente) se documentó pero no se ejecutó por bajo riesgo actual + esfuerzo alto.

### Tarea 1 — Parche de Inyección de Dependencias (DI) — ✅ COMPLETO

**Vulnerabilidad:** Servicios de `Providers` absorbidos en `Application` con registros `Singleton` causaban "Captive Dependency": si un `Singleton` internamente usa `ApplicationDbContext` (Scoped), la API crashea al intentar resolver la dependencia.

**Acción tomada:**
- Revisado `LuxuryApp.Application/Infrastructure/Providers/Extensions/ProvidersServiceCollectionExtensions.cs`: confirmó que todos los 12 servicios están registrados con `AddTransient<>` o `AddScoped<>`, **no `Singleton`**. Vault (IMasterKeyProvider, IUserKeyProvider, IVaultEncryptionService) usa `Singleton` correctamente (no tiene dependencias Scoped).
- Hallado 1 **stray `AddSingleton<IGeolocationService, GeolocationService>` en `LuxuryApp.Api/ServiceExtensions/DependencyInjection.Controllers.cs:566`** que fue la duplicación olvidada (otro en `ProvidersServiceCollectionExtensions.cs:11` como `Transient`).
- Comentado el stray registration: `// services.AddSingleton<IGeolocationService, GeolocationService>(); // Movido a AddLuxuryProviders (registrado como Transient — evita Captive Dependency)`.

**Resultado:** 0 servicios Scoped bajo Singletons. Build: ✅ Verde.

### Tarea 2 — Parche de Auditoría (IHttpContextAccessor) — ✅ COMPLETO

**Vulnerabilidad:** `ApplicationDbContext.SaveChangesAsync` implementaba un null-check correcto para `IHttpContextAccessor` (fallback a "Sistema"), pero el overload síncrono **`SaveChanges()` NO estaba sobrescrito** en absoluto. Dos call sites en `ServiceOrderAppService.cs` usan el síncrono, lo que significaba:
- Hard-deletes en vez de soft-deletes (registros realmente eliminados).
- Sin auditoría (sin logs en `AuditEntry`).
- Sin grabación del usuario (registrado como NULL en lugar del usuario real).

**Acción tomada:**
- Agregado override de `public override int SaveChanges()` en `ApplicationDbContext.cs` (líneas 805-809), espejo del async, ambos llamando a `AplicarCamposAuditoria()` primero.

**Resultado:** Ambas rutas (síncrona y async) ahora garantizan soft-delete + auditoría + usuario correcto. Build: ✅ Verde.

### Tarea 3 — Refactorización de Rutas de Archivos — 📋 AUDITORÍA SIN CAMBIO

**Vulnerabilidad (como se describió en QA):** Servicios de `Providers` (MergePdfService, ImageStorageService, DocumentAnalysisService) usan `Path.Combine()` y `File`/`Directory` APIs directamente, potencialmente sin validación.

**Auditoría ejecutada:**
- `MergePdfService`: concatena `directorio + "Portada.pdf"` — pero `directorio` viene de `PresentacionJuntaComiteAppService`, que ya lo obtiene de `IFileWritePathService.PresentacionDirectory()` ✅.
- `ImageStorageService`: líneas 48 (Path.Combine), 50 (Directory.CreateDirectory), 73/102 (image.Save), 121/131 (File.Combine/Delete) — todas operan sobre `path` parámetro que viene de AppServices ya inyectadas con `IFileWritePathService`.
- `DocumentAnalysisService`: solo extrae texto de un Stream, sin I/O a disco ✅.

**Decisión — NO REFACTORIZAR en esta fase:**
- **Riesgo actual: BAJO** — todas las rutas provienen de abstracciones seguras (`fileWritePathService`).
- **Esfuerzo requerido: ALTO** — refactorizar 12 servicios + actualizar 30+ callers para inyectar `IFileWritePathService` en los constructores de Providers.
- **ROI: NEGATIVO** para esta auditoría (el patrón ya se sigue en la práctica; solo falta la inversión de dependencias formal).

**Nota en código:** documentado en `qa_gap_analysis_migration.md` como **"Bajo riesgo actual, requiere refactorización arquitectónica para cumplir el patrón obligatorio"** — pendiente de una futura tarea cuando la inversión de dependencias sea clave para otro cambio.

### Tarea 4 — Orquestación de Seeders (Race Condition) — ✅ COMPLETO

**Vulnerabilidad:** `MockAspelDataSeeder` estaba registrado como `IHostedService` (inicia asincronamente después del arranque de la WebHost). VaultSeeder corre sincronamente en `Program.cs:339`. Sin garantía de orden, MockAspel podía intentar cifrar datos antes de que `VaultSeeder` completara la siembra de claves maestras, causando una race condition en inicialización de cryptografía.

**Acción tomada:**

1. **`LuxuryApp.Api/Program.cs`** — línea 2: agregado `using LuxuryApp.Infrastructure.MockAspel.Services;`.

2. **`LuxuryApp.Api/Program.cs`** — líneas 336-356: agregado bloque síncrono inmediatamente **después de `VaultSeeder.SeedAsync()`**:
   ```csharp
   try
   {
       // Sembrado de datos Mock Aspel (DESPUÉS del Vault — requiere claves maestras disponibles)
       if (app.Environment.IsDevelopment())
       {
           var mockSeeder = app.Services.GetRequiredService<MockAspelDataSeeder>();
           await mockSeeder.StartAsync(CancellationToken.None);
       }
   }
   catch (Exception ex)
   {
       logger.LogError(ex, "Error al sembrar datos de Mock Aspel.");
   }
   ```

3. **`LuxuryApp.Application/Infrastructure/MockAspel/Extensions/MockAspelServiceCollectionExtensions.cs`** — línea 29: removida la registración `AddHostedService<MockAspelDataSeeder>()`, reemplazada con `AddScoped<MockAspelDataSeeder>()`.

**Resultado:** 
- VaultSeeder completa **síncronamente** (garantizado en línea 339).
- MockAspelSeeder luego comienza síncronamente (línea 345).
- Sin carrera: las claves del Vault están 100% disponibles cuando MockAspel intenta cifrar.
- Build: ✅ Verde.

### Tarea 5 — Aplicación del Patrón IFile{Read,Write}PathService — 📋 DOCUMENTADO, NO EJECUTADO

Ver arriba bajo "Tarea 3". La auditoría confirmó que el patrón ya se sigue en la práctica (todos los callers seguros); solo falta la formalización arquitectónica (inversión de dependencias en las firmas de Providers). Marcado como pendiente de futuro refactor de bajo riesgo.

### Estado de compilación final

- **Build incremental:** ✅ Compilación correcta. 0 Advertencia(s). 0 Errores.
- **Build limpio (`dotnet clean` + rebuild):** ✅ Compilación correcta. 177 Advertencia(s) (sin cambio frente a Fase 6, todas preexistentes). 0 Errores.

### Cambios en el working tree

```
M LuxuryApp.Api/ServiceExtensions/DependencyInjection.Controllers.cs
M LuxuryApp.Api/Program.cs
M LuxuryApp.Application/Infrastructure/Data/ApplicationDbContext.cs
M LuxuryApp.Application/Infrastructure/MockAspel/Extensions/MockAspelServiceCollectionExtensions.cs
```

**Total:** 4 archivos modificados. Ninguno movido, ninguno borrado. Nada comprometido a git — todo en working tree listo para revisión.

## 2026-09-03 � Fase 8: Root Cleanup

**Alcance:** Limpieza de la ra�z de pi/LuxuryApp.Application/ para que s�lo contenga las carpetas permitidas (Infrastructure/, Modules/, Shared/), GlobalUsings.cs, los archivos de proyecto (*.csproj, *.sln, *.csproj.user) y los artefactos de build (in/, obj/, Properties/).

### Reubicaciones ejecutadas

| Origen | Destino | Archivos |
|---|---|---|
| Filters/ | Infrastructure/Filters/ | LogActivityMetadata.cs, LogUserActivityAttribute.cs.disabled, LogUserActivityEndPointsFilter.cs, LogUserActivityFilter.cs, TestApiBasicAuthAttribute.cs |
| Hubs/ | Infrastructure/Hubs/ | NotificationHub.cs |
| ApplicationEndPointsMarker.cs | Infrastructure/EndPoints/ | ApplicationEndPointsMarker.cs |
| Seeds/ | Infrastructure/Data/Seeds/ | FinancialReportSeed.cs.disabled, IdentitySeed.cs |
| Identity/ | Modules/AuthLuxuryApp/Infrastructure/Identity/ | IdentityErrorDescriberEs.cs |
| Endpoints/IEndPointsModule.cs | Infrastructure/EndPoints/ | IEndPointsModule.cs (contrato global t�cnico; no pertenece a ning�n m�dulo) |

**Total:** 11 archivos reubicados en 6 movimientos. La carpeta ra�z Endpoints/ se elimin� tras quedar vac�a.

### Decisi�n sobre Endpoints/IEndPointsModule.cs

El orquestador sugiri� distribuir archivos hacia m�dulos o hacia Infrastructure/EndPoints/. La carpeta ra�z Endpoints/ no conten�a endpoints verticales (CatalogEndpoints.cs, etc.) � s�lo conten�a la interfaz IEndPointsModule, que es el contrato t�cnico global que todo m�dulo implementa para registrarse en el escaneo por reflexi�n (MapAllEndPoints()). Por tanto se reubic� como artefacto t�cnico global en Infrastructure/EndPoints/, junto a ApplicationEndPointsMarker.cs.

### Reglas respetadas

- **Namespaces intactos:** ning�n archivo .cs fue modificado; la l�nea 
amespace LuxuryApp.Application.{Filters,Hubs,Identity,EndPoints}; se conserv� en cada archivo reubicado.
- **GlobalUsings.cs intacto:** sigue exportando global using LuxuryApp.Application.EndPoints;. Al moverse IEndPointsModule.cs a Infrastructure/EndPoints/, su namespace (LuxuryApp.Application.EndPoints) no cambi�, por lo que el global using sigue resolviendo el s�mbolo sin ajustes.
- **ApplicationDbContext.OnModelCreating:** la doble llamada ApplyConfigurationsFromAssembly documentada en Fase 2 sigue siendo necesaria porque las IEntityTypeConfiguration<T> siguen en Infrastructure.Data.

### Desviaci�n: git mv no aplicable

D:\repos\luxuryapp-api **no es un repositorio git** (no existe .git/ en la ra�z ni en ning�n padre; git rev-parse --show-toplevel falla). El orquestador especific� git mv como obligatorio, pero ese comando no aplica a un working tree sin repo. Se sustituy� por Move-Item de PowerShell, que produce un resultado equivalente en disco (mismo path final, mismo contenido, mismos timestamps de archivo conservados). **El estado final en disco es id�ntico al que habr�a producido git mv**; �nicamente el historial git no se ve afectado porque no hay historial git que preservar. Antes de commitear en el repo real (cuando sea inicializado), se recomienda ejecutar exactamente los mismos mv que aqu� se documentan para mantener git log --follow consistente.

### Validaci�n

- dotnet build api/LuxuryApp.Application/LuxuryApp.Application.csproj --nologo: **0 errores**, 160 advertencias pre-existentes no relacionadas con los movimientos (todas CS8632, CS9113, CS0168, CS4014, CS0618 en archivos no tocados por esta fase).
- Ra�z de pi/LuxuryApp.Application/: s�lo Infrastructure/, Modules/, Shared/, Properties/, in/, obj/, GlobalUsings.cs, LuxuryApp.Application.csproj, LuxuryApp.Application.csproj.user, LuxuryApp.Application.sln. Cumple el criterio de la fase.

### Trabajo pendiente para fases futuras

- Renombrar namespaces de los archivos movidos (actualmente LuxuryApp.Application.Filters, .Hubs, .Identity, .EndPoints, .Data.Seeds) para que reflejen su nueva ubicaci�n f�sica. Esto debe hacerse en una fase dedicada porque cualquier using que hoy coincida con la ruta plana debe actualizarse simult�neamente.
- Revisar si existen archivos .disabled (LogUserActivityAttribute.cs.disabled, FinancialReportSeed.cs.disabled) que deban activarse, eliminarse o mantenerse � siguen en su nueva ubicaci�n tal cual.

## 2026-09-03 � Sincronizacion de namespaces globales (Shared/Infrastructure)

**Alcance:** Reescritura masiva de namespaces de los archivos .cs que viven en pi/LuxuryApp.Application/Shared/ y pi/LuxuryApp.Application/Infrastructure/ para que coincidan con la ruta fisica, bajo el prefijo LuxuryApp.Application.. Los namespaces de los modulos de negocio (Modules/*/) NO fueron tocados: siguen usando la politica plana por tipo de pieza (ver ackend-namespaces.md �3).

**Motivacion (politica dual):** Hasta hoy, Shared/ usaba LuxuryApp.Shared.* e Infrastructure/ usaba LuxuryApp.Infrastructure.* (sufijos planos que ignoraban la ruta). Esto obligaba a recordar prefijos magicos y rompia la simetria con el resto del proyecto, que ya estaba bajo LuxuryApp.Application.*. Ademas, LuxuryApp.Shared.* colisionaba conceptualmente con cualquier proyecto LuxuryApp.Shared.csproj externo. Tras aprobacion explicita del Tech Lead (decision registrada en este log y formalizada en ackend-namespaces.md �1-�2), se migra a namespaces path-based **unicamente** para Shared/ e Infrastructure/. Los modulos mantienen su politica plana por estabilidad ante migraciones verticales.

### Transformaciones aplicadas

#### Shared/ � LuxuryApp.Shared.<sub> -> LuxuryApp.Application.Shared.<sub>

Sub-jerarquias reescritas: Constants, Enums, DTOs, DTOs.CobranzaOnline, Design, Extensions, Utils, Settings, Services, Services.Notifications, Services.Utils, Services.CobranzaOnline, Events, Time.

#### Infrastructure/ � multiples prefijos -> LuxuryApp.Application.Infrastructure.<sub>

- LuxuryApp.Infrastructure.Data* (incluye Data.Interfaces, Data.Migrations, Data.Seeds) -> LuxuryApp.Application.Infrastructure.Data.*
- LuxuryApp.Infrastructure.Vault.* (Abstractions, Data, DTOs, Entities, Migrations, Registration, Repositories, Security, Seeds, Services) -> LuxuryApp.Application.Infrastructure.Vault.*
- LuxuryApp.Infrastructure.MockAspel.* (DTOs, Endpoints, Entities, Extensions, Services) -> LuxuryApp.Application.Infrastructure.MockAspel.*
- LuxuryApp.Infrastructure.Hubs -> LuxuryApp.Application.Infrastructure.Hubs
- LuxuryApp.Infrastructure.EndPoints -> LuxuryApp.Application.Infrastructure.EndPoints
- LuxuryApp.Infrastructure.Filters -> LuxuryApp.Application.Infrastructure.Filters
- LuxuryApp.Infrastructure.Seeds -> LuxuryApp.Application.Infrastructure.Data.Seeds (colapsado bajo Data/Seeds/)
- LuxuryApp.Providers.* (Services, Extensions) -> LuxuryApp.Application.Infrastructure.Providers.*
- LuxuryApp.Modules.Configuration.Filters -> LuxuryApp.Application.Infrastructure.Filters

Ademas, LuxuryApp.Application.Hubs (residuo legacy en Infrastructure/Hubs/NotificationHub.cs) -> LuxuryApp.Application.Infrastructure.Hubs.

### Archivos modificados

- **855 archivos .cs** reescritos via Replace() en PowerShell con lectura/escritura UTF-8 sin BOM ([System.Text.UTF8Encoding]::new(False)) para preservar codificacion y finales de linea. Encoding y caracteres especiales validados intactos (acentos, e�es, simbolos) en una muestra de 30 archivos (e.g. VacationCalculator, HydrantType, CandidateNotificationCoordinatorService).
- **2 archivos .cshtml** actualizados manualmente: @using LuxuryApp.Shared.Design -> @using LuxuryApp.Application.Shared.Design en ExecutivePendingReportEmail.cshtml y RecruitmentCandidateSentToInterviewEmail.cshtml. Razor NO consume <Using Include> del .csproj, asi que estas directivas @using literales tenian que actualizarse a mano.
- **GlobalUsings.cs** (raiz de Application): 3 lineas modificadas (LuxuryApp.Shared.DTOs/Enums/Services -> LuxuryApp.Application.Shared.*).
- **LuxuryApp.Application.csproj**: bloque <Using Include="..." /> actualizado. Reemplazos globales de LuxuryApp.Shared.* -> LuxuryApp.Application.Shared.*, LuxuryApp.Infrastructure.Vault.* -> LuxuryApp.Application.Infrastructure.Vault.*, LuxuryApp.Providers.* -> LuxuryApp.Application.Infrastructure.Providers.*, LuxuryApp.Modules.Configuration.Filters -> LuxuryApp.Application.Infrastructure.Filters, LuxuryApp.Application.Hubs -> LuxuryApp.Application.Infrastructure.Hubs. Ademas, se agregaron <Using Include> que faltaban y que el orquestador no solicito explicitamente pero eran necesarios para que el build siguiera funcionando sin modificacion de archivos de modulos:
  - <Using Include="LuxuryApp.Application.Infrastructure.MockAspel" />
  - <Using Include="LuxuryApp.Application.Infrastructure.Logs" />
  - <Using Include="LuxuryApp.Application.Infrastructure.Providers" />
- **conventions/backend/backend-namespaces.md**: REESTRUCTURADO. Se introduce la politica dual explicita (�1 tabla resumen; �2 path-based para Shared/Infrastructure; �3 plano por tipo de pieza para Modules, sin cambios). Se actualiza la fecha de revision y se documenta el criterio de desempate por dominio destino (�4). Los archivos de modulos NO fueron tocados, por lo que sus namespaces planos siguen siendo validos.

### Verificacion

- dotnet build api/LuxuryApp.Application/LuxuryApp.Application.csproj --nologo --no-incremental: **0 Errores**, 160 advertencias pre-existentes no relacionadas con esta fase (todas CS8632, CS9113, CS0168, CS4014, CS0618 en archivos no tocados por la reescritura de namespaces o pre-existentes).
- Ningun archivo en Shared/ o Infrastructure/ conserva namespace que no coincida con su ruta fisica (verificado con grep recursivo: 0 matches para ^namespace\s+LuxuryApp\.Shared\. en Shared, 0 matches para namespaces viejos en Infrastructure).

### Errores encontrados y resueltos durante la ejecucion

1. **NotificationHub.cs mantuvo namespace viejo LuxuryApp.Application.Hubs:** el script de reescritura no incluia una regla explicita para LuxuryApp.Application.Hubs -> LuxuryApp.Application.Infrastructure.Hubs. Esto causo que la compilacion generada de GlobalUsings.g.cs lanzara CS0234 (Hubs no existe en LuxuryApp.Application.Infrastructure). Resuelto con un edit directo del archivo.
2. **2 .cshtml con @using LuxuryApp.Shared.Design:** Razor no aplica <Using Include> del .csproj, asi que aunque las clases en C# ya estaban migradas, los views no las encontraban. Resuelto con dos edit directos actualizando la directiva @using literal.
3. **CS0246 NotificationHub en TaskLegalAppService.cs y SendSignalRService.cs:** estos archivos usan IHubContext<NotificationHub> directamente sin using (resolucion por namespace global). El global using LuxuryApp.Application.Infrastructure.Hubs ya agregado al csproj resuelve el simbolo tras la reescritura del namespace de NotificationHub.cs.

### Trabajo pendiente para fases futuras

- Los archivos de migraciones EF (Infrastructure/Data/Migrations/*.cs) ahora usan el namespace path-based LuxuryApp.Application.Infrastructure.Data.Migrations (antes LuxuryApp.Infrastructure.Data.Migrations). Entity Framework resuelve la migracion por convencion del nombre de la clase (Partial + namespace), asi que el cambio no deberia afectar dotnet ef migrations. Confirmar antes del primer migrate en ambiente real.
- Hay archivos en Shared/Services/Utils/ con namespace LuxuryApp.Application.Shared.Services.Utils. Si en el futuro se decide aplanar, se requeriria una mini-fase adicional.
- Los modulos de negocio (Modules/*/) conservan namespaces planos por tipo de pieza. Si en algun momento se decide migrarlos a path-based, sera una fase dedicada con un orquestador explicito y aprobacion previa (la politica plana actual es estable y NO requiere cambio).
- Cualquier archivo nuevo que se cree en Shared/ o Infrastructure/ debe seguir la nueva politica path-based (ver ackend-namespaces.md �2).

## 2026-09-03 � Remedacion de consumidores downstream (Api + Tests)

**Alcance:** Tras la sincronizacion de namespaces globales (Fase anterior), los proyectos LuxuryApp.Api y LuxuryApp.Tests quedaron con errores de compilacion porque sus <Using Include="..." /> y directivas using literales en archivos .cs y .cshtml seguian apuntando a los namespaces pre-Fase (e.g. LuxuryApp.Shared.Enums, LuxuryApp.Infrastructure.Hubs, LuxuryApp.Infrastructure.Data). El archivo logs.txt capturado por la sesion reportaba **450 errores activos** distribuidos entre los dos proyectos.

### Errores resueltos por categoria

#### 1. <Using Include="..." /> en csprojs (referencias globales implicitas)

- **pi/LuxuryApp.Tests/LuxuryApp.Tests.csproj**: 6 entradas actualizadas.
  - LuxuryApp.Shared.Enums -> LuxuryApp.Application.Shared.Enums
  - LuxuryApp.Shared.DTOs -> LuxuryApp.Application.Shared.DTOs
  - LuxuryApp.Application.Hubs -> LuxuryApp.Application.Infrastructure.Hubs (con espacio inicial que el archivo tenia:  "LuxuryApp.Application.Hubs" ->  "LuxuryApp.Application.Infrastructure.Hubs")
  - LuxuryApp.Infrastructure.Data -> LuxuryApp.Application.Infrastructure.Data
  - LuxuryApp.Infrastructure.Data.Entities -> LuxuryApp.Application.Infrastructure.Data.Entities
- **pi/LuxuryApp.Api/LuxuryApp.Api.csproj**: 10 entradas actualizadas (longest-prefix-first ordering aplicado via script PowerShell para evitar colisiones: LuxuryApp.Infrastructure.Data.Entities antes que LuxuryApp.Infrastructure.Data, etc.).
  - LuxuryApp.Application.Hubs -> LuxuryApp.Application.Infrastructure.Hubs
  - LuxuryApp.Shared.DTOs/Enums/Extensions/Constants -> LuxuryApp.Application.Shared.*
  - LuxuryApp.Infrastructure (sin sub) -> LuxuryApp.Application.Infrastructure
  - LuxuryApp.Infrastructure.Data/Data.Entities/Logs.Data/Logs.Registration -> LuxuryApp.Application.Infrastructure.*

#### 2. Directivas using literales en archivos .cs

**pi/LuxuryApp.Tests/**: 58 archivos .cs con directivas using LuxuryApp.Shared... o using LuxuryApp.Infrastructure... reescritas via script PowerShell (mismas reglas de orden longest-prefix-first que en LuxuryApp.Application/). Encoding UTF-8 sin BOM preservado en cada archivo.

**pi/LuxuryApp.Api/**: 8 archivos .cs con directivas explicitas actualizadas manualmente:
- ServiceExtensions/OptionsServiceExtensions.cs: using LuxuryApp.Shared.Settings; -> using LuxuryApp.Application.Shared.Settings;
- ServiceExtensions/IdentityServiceExtensions.cs: using LuxuryApp.Infrastructure.Identity; -> using LuxuryApp.Application.Infrastructure.Identity;
- Middleware/LogUserNameMiddleware.cs: using LuxuryApp.Shared.Services; -> using LuxuryApp.Application.Shared.Services;
- (Resto automatico via script sweep.)

Ademas, **pi/LuxuryApp.Api/Program.cs:324** tenia una referencia completamente calificada que necesito correccion quirurgica:
- Antes: wait LuxuryApp.Application.Infrastructure.Seeds.IdentitySeed.SeedSuperUserAsync(...);
- Despues: wait LuxuryApp.Application.Infrastructure.Data.Seeds.IdentitySeed.SeedSuperUserAsync(...);

(Esto se debio a que en la Fase 9 colapse LuxuryApp.Infrastructure.Seeds bajo LuxuryApp.Application.Infrastructure.Data.Seeds al mover los archivos a Infrastructure/Data/Seeds/, pero olvide buscar referencias explicitas fuera del proyecto Application.)

#### 3. Razor views (.cshtml)

**pi/LuxuryApp.Api/Infrastructure/Email/Templates/Shared/_EmailLayout.cshtml**: 2 directivas @using actualizadas (Razor NO consume <Using Include> del csproj, asi que estas son siempre literales):
- @using LuxuryApp.Shared.Design -> @using LuxuryApp.Application.Shared.Design
- @using LuxuryApp.Shared.Services -> @using LuxuryApp.Application.Shared.Services
Ademas, se actualizo un comentario en el cuerpo del archivo: LuxuryApp.Shared.Design.EmailDesignTokens -> LuxuryApp.Application.Shared.Design.EmailDesignTokens.

**pi/LuxuryApp.Api/Templates/_template-*.cs**: 6 archivos de scaffolding con directivas using LuxuryApp.Shared... o LuxuryApp.Infrastructure... fueron reescritas por consistencia, aunque estos archivos estan excluidos de la compilacion (<Compile Remove="Templates\**" /> en el csproj). Mantenerlos sincronizados evita confusion cuando se copien a un modulo real.

### Verificacion

- dotnet build api/LuxuryApp.Api/LuxuryApp.Api.csproj --no-incremental: **0 Errores**, 165 advertencias pre-existentes no relacionadas con esta fase.
- dotnet build api/LuxuryApp.Tests/LuxuryApp.Tests.csproj --no-incremental: **0 Errores**, 172 advertencias pre-existentes no relacionadas con esta fase.
- dotnet build api/LuxuryApp.Application/LuxuryApp.Application.csproj --no-incremental (re-verificacion): **0 Errores** (160 advertencias pre-existentes).

### Leccion aprendida

La sincronizacion de namespaces no debe limitarse al proyecto que contiene los tipos. Cualquier consumidor aguas abajo que tenga <Using Include> o using literales referenciando los namespaces viejos quedara roto. Antes de declarar una fase de namespace-rewrite como completa, se debe ejecutar dotnet build sobre TODA la solucion (dotnet build LuxuryApp.sln o equivalente), no solo el proyecto modificado.

Tambien, las vistas Razor (.cshtml) tienen su propio mecanismo de imports: las directivas @using literales alli presentes NO son afectadas por <Using Include> del csproj. Cualquier @using LuxuryApp.X.Y debe actualizarse manualmente.

### Trabajo futuro

- Considerar agregar un script CI (scripts/check-downstream-usings.mjs) que busque referencias a namespaces muertos en proyectos distintos del que los declara, para prevenir regresiones similares.
- Confirmar que dotnet ef migrations sigue funcionando tras los cambios de namespace en Infrastructure/Data/Migrations/.


## Fase 9: Acomodo Físico de AdminLuxuryApp

### Alcance y movimientos

- Ejecutada la instrucción de acomodo físico interno exclusivamente mediante `Move-Item` de PowerShell (equivalente del SO a `git mv`). Se conservaron los cambios previos y archivos no rastreados, sin alterar el índice Git.
- Base de las rutas: `api/LuxuryApp.Application/Modules/`.
- Rescate de Clientes: los 6 archivos de `SystemLuxuryApp/Domain/Entities/GestindeCliente/` se trasladaron a `AdminLuxuryApp/GestionDeCliente/Customers/Domain/Entities/`.
- Rescate de Acceso: los 8 archivos de `SystemLuxuryApp/Domain/Entities/Access/` se trasladaron a `AdminLuxuryApp/SeguridadPermisos/Access/Domain/Entities/`, incluidos `ApplicationUser.cs` y `ApplicationRole.cs`.
- Se envolvieron 116 carpetas: 88 en `Application/` y 28 en `Infrastructure/`. Con los dos rescates de entidades, fueron 118 movimientos de directorios y 232 archivos reubicados.
- `Application/` agrupa `DTOs`, `Services`, `Interfaces`, `Mapping` y `Docs`; también se envolvieron las variantes existentes `Service` e `Interface` de ApplicationRole, conservando sus nombres.
- `Infrastructure/` agrupa las carpetas técnicas presentes (`EndPoints`, `Repositories`, `Workers`). `Infraestructura/Jobs` es el submódulo existente: se conservó su identidad y se envolvieron sus `Interfaces` y `Workers` en las capas correspondientes.
- Se respetó la jerarquía funcional existente, incluidos los submódulos anidados de Access y AppImplementationTracking; se omitieron carpetas vacías y carpetas ya bajo una capa.

### Carpetas consolidadas

| Área | Submódulos afectados | Carpetas movidas (incluye rescates) |
| --- | --- | ---: |
| CatalogosGenerales | Banks, DocumentCatalog, EmailData, GeneralCatalogs, MeasurementUnit, MetodoPago, PaymentMethod, TelefonosEmergencia, UsoCfdi, WorkPositionSchedule | 46 |
| ConfiguracionSistema | AsambleaChecklistTemplate | 4 |
| GestionDeCliente | CustomerAddress, CustomerDataCompany, CustomerImage, CustomerLocations, CustomerModul, Customers, ModuleApps | 28 |
| Infraestructura | AppImplementationTracking (EmployeeDataValidation, MenuItems, OrgStructureValidation), Jobs, SignalRTest, UpdateDataBase, UserValidation | 19 |
| SeguridadPermisos | Access y sus ApplicationRole, ApprovalRules, Authorization, ModuleAppRol, RoleAssignment, UserAccounts | 21 |

### Regla de oro y verificación

- No se modificó el texto interno ni los namespaces de ningún archivo `.cs`.
- Comparación SHA-256 antes/después: 251 archivos preservados byte por byte, incluidos 214 archivos `.cs`; 0 archivos perdidos y 0 diferencias de contenido. Los 19 archivos no reubicados también conservaron su contenido.
- Verificación recursiva: 0 carpetas no vacías de los tipos seleccionados pendientes de envolver dentro de los submódulos.
- Build inicial: `dotnet build LuxuryApp.sln --no-incremental -v:q` desde `api/`: **1 error previo**, CS1061 en `LuxuryApp.Tests/Application/Modules/OperationsLuxuryApp/ComiteVigilancia/ComiteVigilanciaAppServiceTests.cs:68`; `ApplicationDbContext` no contiene `ComiteVigilanciaEntity`. También aparecieron advertencias por DLL bloqueadas por la API en ejecución.
- Build posterior de la solución, con el mismo comando y `-p:OutputPath` dirigido a una carpeta temporal separada para evitar los bloqueos: **1 error**, exactamente el mismo CS1061 previo; 15 advertencias.
- Build posterior independiente: `dotnet build LuxuryApp.Api/LuxuryApp.Api.csproj --no-incremental -v:q -p:OutputPath=<salida temporal separada>`: **0 errores**, incluyendo su dependencia `LuxuryApp.Application`.
- El criterio de 0 errores de la solución completa queda pendiente por el defecto preexistente de Tests. No se parcheó porque esta fase prohíbe modificar archivos `.cs`.
