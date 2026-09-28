# subservices-vs-helpers-guide.md — Guía: Cuándo SubService vs Helper (Ejemplos Reales CandidateCore)

> **Estado:** Vigente  
> **Autorizado:** 2026-09-20  
> **Referencia:** CONVENTIONS.md §6bis, CONVENTIONS_FOLDER_API.MD §5-6  
> **Caso real:** `RecruitmentLuxuryApp/Candidates/CandidateCore/`

---

## 1. Regla de Decisión Rápida

| Pregunta | Respuesta → Acción |
|----------|-------------------|
| **¿Tiene dependencias inyectadas (DbContext, Services, etc.)?** | → **SubService** |
| **¿Es lógica pura sin estado (solo entrada → salida)?** | → **Helper** |
| **¿Necesita transacción / acceso a BD?** | → **SubService** |
| **¿Es formateo, cálculo, parsing, string manipulation?** | → **Helper** |
| **¿Se testea con mocks?** | → **SubService** |
| **¿Se testea solo con inputs/outputs?** | → **Helper** |

---

## 2. Estructura Real en CandidateCore

```
CandidateCore/
├── SubServices/           (7 archivos - tienen dependencias)
│   ├── CandidateDeleteService.cs      (4 deps: DbContext, FileWrite, FileStorage, Logger)
│   ├── CandidateDetailBuilder.cs      (1 dep: FileRead)
│   ├── CandidateDuplicateCheckService.cs (3 deps: DbContext, UserManager, RoleManager)
│   ├── CandidateFormerEmployeeImportService.cs (5 deps)
│   ├── CandidateFormerEmployeeQueryService.cs (2 deps)
│   ├── CandidateReadService.cs        (2 deps: DbContext, DetailBuilder)
│   └── CandidateWriteService.cs       (4 deps: DbContext, FileWrite, FileStorage, Logger)
│
├── Helpers/               (1 archivo - lógica pura)
│   └── CandidateCoreHelpers.cs        (static, 0 deps)
│
├── Services/              (1 archivo - coordinador)
│   └── CandidateAppService.cs         (inyecta SubServices)
│
├── EndPoints/
├── DTOs/
├── Interfaces/
└── Mappings/
```

---

## 3. Ejemplos Reales: SubServices (Tienen Dependencias)

### A. CandidateDeleteService — Operación Compleja + Transacción + Archivos
```csharp
// 4 dependencias inyectadas
public class CandidateDeleteService(
    ApplicationDbContext dbContext,              // 1. BD
    IFileWritePathService fileWritePathService,  // 2. Rutas archivos
    ISecureFileStorageService fileStorageService, // 3. Borrado físico
    ILogger<CandidateAppService> logger)         // 4. Logging
{
    public async Task<ApiResponseDTO<bool>> DeleteAsync(Guid id)
    {
        // 1. Cargar entidad con Includes
        var model = await dbContext.Candidates
            .Include(x => x.WorkExperiences)
            .FirstOrDefaultAsync(x => x.Id == id);

        // 2. Calcular impacto (queries múltiples)
        var impact = await GetDeleteImpactAsync(id);

        // 3. Borrar dependencias en orden correcto (FK)
        dbContext.RecruitmentCandidateInterviews.RemoveRange(...);
        dbContext.Set<CandidateStageHistory>().RemoveRange(...);
        dbContext.RecruitmentCandidateProcesses.RemoveRange(...);
        dbContext.RecruitmentCandidateApplicationRoles.RemoveRange(...);
        dbContext.RemoveRange(model.WorkExperiences);

        // 4. Borrar entidad principal
        dbContext.Candidates.Remove(model);
        await dbContext.SaveChangesAsync();  // TRANSACCIÓN

        // 5. SOLO DESPUÉS: borrar archivos físicos
        var candidateDirectory = fileWritePathService.RecruitmentMasterCandidateDirectory(model.Id);
        fileStorageService.DeleteDirectory(candidateDirectory);

        logger.LogInformation("Candidato eliminado ID={Id}", model.Id);
        return ApiResponseDTO<bool>.SuccessResult(true, "Eliminado");
    }
}
```

**Por qué SubService:**
- ✅ Inyecta `DbContext` (acceso a BD)
- ✅ Inyecta servicios de archivos (`IFileWritePathService`, `ISecureFileStorageService`)
- ✅ Maneja transacción (`SaveChangesAsync`)
- ✅ Logging estructurado
- ✅ Lógica de negocio compleja (orden de borrado, impacto, rollback implícito)

---

### B. CandidateReadService — Consultas de Lectura Complejas
```csharp
// 2 dependencias
public class CandidateReadService(
    ApplicationDbContext dbContext,          // 1. BD
    CandidateDetailBuilder detailBuilder)    // 2. Builder (otro SubService)
{
    public async Task<ApiResponseDTO<List<CandidateListItemDTO>>> GetListAsync(PaginationCommonDTO pagination)
    {
        // Query compleja con filtros dinámicos, paginación, sorting
        var query = dbContext.Candidates.AsQueryable();
        // ... filtros por status, texto, etc.
        // ... paginación + ordering dinámico
        // ... carga relacionada (procesos activos, entrevistas)
        // ... proyección a DTO con builder
    }
}
```

**Por qué SubService:**
- ✅ Inyecta `DbContext` (queries complejas)
- ✅ Inyecta otro SubService (`CandidateDetailBuilder`)
- ✅ Lógica de paginación/filtrado reutilizable

---

### C. CandidateDuplicateCheckService — Validación de Negocio
```csharp
// 3 dependencias
public class CandidateDuplicateCheckService(
    ApplicationDbContext dbContext,           // 1. BD
    UserManager<ApplicationUser> UserManager, // 2. Identity
    RoleManager<ApplicationRole> roleManager) // 3. Identity
{
    public async Task<CandidateDuplicateCheckResultDTO> CheckAsync(CandidateDuplicateCheckInputDTO input)
    {
        // Lógica: buscar por email, telefono, documento, normalizado
        // Retorna DTO con matches y tipo de coincidencia
    }
}
```

**Por qué SubService:**
- ✅ Inyecta `DbContext` + Identity managers
- ✅ Lógica de validación reutilizable desde AppService y EndPoints

---

### D. CandidateDetailBuilder — Construcción de DTOs Complejos
```csharp
// 1 dependencia
public class CandidateDetailBuilder(
    IFileReadPathService fileReadPathService)   // 1. Archivos
{
    public CandidateDetailDTO BuildDetailDTO(Candidate model, List<CandidateProcess> processes)
    {
        // Mapeo complejo entidad → DTO con URLs de archivos, foto, CV
    }

    public string BuildCvFileUrl(Candidate model) { ... }
    public async Task<List<CandidateProcess>> LoadCandidateProcessesAsync(Guid id) { ... }
}
```

**Por qué SubService:**
- ✅ Inyecta `IFileReadPathService` (infraestructura)
- ✅ Encapsula lógica de mapeo complejo (entidad → DTO detalle)
- ✅ Reutilizable desde ReadService y AppService

---

## 4. Ejemplo Real: Helper (Lógica Pura, 0 Dependencias)

### CandidateCoreHelpers — Utilidades Estáticas
```csharp
// STATIC CLASS - 0 dependencias inyectadas
public static class CandidateCoreHelpers
{
    // 1. Formateo de dirección
    public static string BuildFormerEmployeeAddress(Address address)
    {
        var parts = new[] { address.Street, address.Number, address.UnitNumber, 
                           address.District, address.TownHall, address.City, 
                           address.ZIPCode, address.Country };
        return string.Join(", ", parts.Where(x => !string.IsNullOrWhiteSpace(x)));
    }

    // 2. Formateo de experiencia laboral
    public static string BuildFormerEmployeeExperience(Employee employee)
    {
        var position = employee.WorkPosition?.ApplicationRole?.DisplayName;
        var customer = employee.WorkPosition?.Customer?.NombreCorto;
        var admission = employee.DateAdmission == default
            ? "sin fecha de ingreso capturada"
            : $"ingreso {employee.DateAdmission:dd/MM/yyyy}";
        return string.Join(" - ", new[] { "Ex-empleado LuxuryApp", position, customer, admission }
            .Where(x => !string.IsNullOrWhiteSpace(x)));
    }

    // 3. Lógica de negocio pura: progreso de entrevista
    public static CandidateInterviewProgressStatus ResolveInterviewProgress(CandidateProcess process)
    {
        if (process == null || process.CurrentStage is CandidateProcessStage.Nuevo or CandidateProcessStage.EnEspera)
            return CandidateInterviewProgressStatus.SinEntrevistar;

        if (process.CurrentStage != CandidateProcessStage.EntrevistaOperaciones)
            return CandidateInterviewProgressStatus.Agendado;

        var scheduledInterview = process.Interviews
            .Where(x => x.Status == CandidateInterviewStatus.Programada)
            .OrderByDescending(x => x.ScheduledAt)
            .FirstOrDefault();

        if (scheduledInterview == null)
            return CandidateInterviewProgressStatus.PendienteAgenda;

        return scheduledInterview.ScheduledAt <= DateTime.UtcNow
            ? CandidateInterviewProgressStatus.Vencida
            : CandidateInterviewProgressStatus.Agendado;
    }

    // 4. Extracción de nombre de archivo desde URL
    public static string ExtractFileNameFromUrl(string url)
    {
        if (string.IsNullOrWhiteSpace(url)) return null;
        var queryIndex = url.IndexOf("filePath=", StringComparison.OrdinalIgnoreCase);
        if (queryIndex < 0) return null;
        var encoded = url[(queryIndex + "filePath=".Length)..];
        var decoded = Uri.UnescapeDataString(encoded);
        var normalized = decoded.Replace("/", "\\");
        return Path.GetFileName(normalized);
    }
}
```

**Por qué Helper:**
- ✅ **Static class** — no instancia, no estado
- ✅ **0 dependencias inyectadas** — solo tipos del dominio
- ✅ **Lógica pura** — entrada → salida, sin efectos secundarios
- ✅ **Testeable sin mocks** — `Assert.Equal(expected, Helper.Method(input))`
- ✅ **Reutilizable** — usado desde `CandidateReadService`, `CandidateDetailBuilder`, etc.

---

## 5. Tabla de Decisión: CandidateCore

| Clase | Tipo | Dependencias | Por Qué |
|-------|------|--------------|---------|
| `CandidateDeleteService` | **SubService** | 4 (DbContext, FileWrite, FileStorage, Logger) | BD + Transacción + Archivos + Logging |
| `CandidateReadService` | **SubService** | 2 (DbContext, DetailBuilder) | Queries complejas + Builder |
| `CandidateWriteService` | **SubService** | 4 (DbContext, FileWrite, FileStorage, Logger) | Create/Update + Archivos |
| `CandidateDetailBuilder` | **SubService** | 1 (FileRead) | Mapeo complejo + URLs archivos |
| `CandidateDuplicateCheckService` | **SubService** | 3 (DbContext, UserManager, RoleManager) | Validación + Identity |
| `CandidateFormerEmployeeImportService` | **SubService** | 5 | Importación masiva + Archivos |
| `CandidateFormerEmployeeQueryService` | **SubService** | 2 | Queries especializadas |
| `CandidateCoreHelpers` | **Helper** | **0** (static) | Formateo, cálculos, parsing puro |

---

## 6. Niveles de Alcance (Regla §6bis / CONVENTIONS_FOLDER_API.MD)

| Nivel | Ubicación | Ejemplo CandidateCore | Alcance |
|-------|-----------|----------------------|---------|
| **1 — Submódulo** | `[Submodulo]/SubServices/` | `CandidateCore/SubServices/` | Solo `CandidateCore` |
| **2 — Módulo** | `[Modulo]/SubServices/` | `RecruitmentLuxuryApp/SubServices/` | Varios submódulos de Reclutamiento |
| **3 — SharedLuxuryApp** | `SharedLuxuryApp/SubServices/` | `SharedLuxuryApp/SubServices/` | Múltiples módulos (SelectItems, Files, etc.) |

> **Regla:** CandidateCore usa **Nivel 1** (exclusivo a su submódulo). Si otro submódulo de Reclutamiento necesitara lógica similar → Nivel 2.

---

## 7. Checklist al Crear Nuevo Código en Submódulo

- [ ] **¿Lógica pura (string → string, enum → string, cálculo)?** → `Helpers/[Nombre]Helpers.cs` (static)
- [ ] **¿Necesita DbContext, Services, Logger, FileService?** → `SubServices/[Nombre]Service.cs`
- [ ] **¿Encapsula operación CRUD completa?** → SubService
- [ ] **¿Coordina múltiples SubServices?** → AppService (inyecta SubServices)
- [ ] **¿Máx 2 archivos por carpeta SubServices/Helpers?** (regla §6bis)
- [ ] **Tests:** SubService → mocks; Helper → solo inputs/outputs

---

## 8. Referencias

| Documento | Qué cubre |
|-----------|-----------|
| CONVENTIONS.md §6bis | SubServices/Helpers, 300 líneas, 3 niveles |
| CONVENTIONS_FOLDER_API.MD §5 | Reglas de Submódulos |
| CONVENTIONS_FOLDER_API.MD §6 | Árbol de decisión Shared/SharedLuxuryApp |
| `service-dependency-limit.md` | Límite 7 dependencias |
| `CandidateCore/` | Implementación real completa |