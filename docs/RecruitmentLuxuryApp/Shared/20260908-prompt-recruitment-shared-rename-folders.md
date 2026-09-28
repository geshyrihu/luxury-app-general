# Prompt de Ejecución — Renombrado de Carpetas ReclutamientoLuxuryApp

> **Objetivo:** Renombrar carpetas en `ReclutamientoLuxuryApp` para aplicar la regla plural (carpeta) vs singular (clase) y eliminar colisiones CS0118.
>
> **Herramienta recomendada:** Aider (`aider --yes --model openai/claude-3-5-sonnet-20241022`)
>
> **Antes de ejecutar:** `$env:OPENAI_API_BASE="http://localhost:20128/v1"; $env:OPENAI_API_KEY="sk-omniroute"`

---

## FASE 1 — Carpetas de BAJO RIESGO (6 archivos total)

Ejecutar uno por uno:

### 1.1 SolicitudAlta → SolicitudAltas
```
Renombrar carpeta: api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/SolicitudAlta/ → SolicitudAltas/
Actualizar namespace en TODOS los .cs dentro: "ReclutamientoLuxuryApp.SolicitudAlta" → "ReclutamientoLuxuryApp.SolicitudAltas"
Actualizar usings en archivos externos que referencien "ReclutamientoLuxuryApp.SolicitudAlta"
```

### 1.2 SolicitudBaja → SolicitudBajas
```
Renombrar carpeta: api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/SolicitudBaja/ → SolicitudBajas/
Actualizar namespace en TODOS los .cs dentro: "ReclutamientoLuxuryApp.SolicitudBaja" → "ReclutamientoLuxuryApp.SolicitudBajas"
Actualizar usings en archivos externos que referencien "ReclutamientoLuxuryApp.SolicitudBaja"
```

### 1.3 SolicitudModificacionSueldo → SolicitudModificacionesSueldo
```
Renombrar carpeta: api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/SolicitudModificacionSueldo/ → SolicitudModificacionesSueldo/
Actualizar namespace en TODOS los .cs dentro: "ReclutamientoLuxuryApp.SolicitudModificacionSueldo" → "ReclutamientoLuxuryApp.SolicitudModificacionesSueldo"
Actualizar usings en archivos externos que referencien "ReclutamientoLuxuryApp.SolicitudModificacionSueldo"
```

### 1.4 SolicitudVacante → SolicitudVacantes
```
Renombrar carpeta: api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/SolicitudVacante/ → SolicitudVacantes/
Actualizar namespace en TODOS los .cs dentro: "ReclutamientoLuxuryApp.SolicitudVacante" → "ReclutamientoLuxuryApp.SolicitudVacantes"
Actualizar usings en archivos externos que referencien "ReclutamientoLuxuryApp.SolicitudVacante"
```

### 1.5 RecruitmentSourceCatalog → RecruitmentSourceCatalogs
```
Renombrar carpeta: api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/RecruitmentSourceCatalog/ → RecruitmentSourceCatalogs/
Actualizar namespace en TODOS los .cs dentro: "ReclutamientoLuxuryApp.RecruitmentSourceCatalog" → "ReclutamientoLuxuryApp.RecruitmentSourceCatalogs"
Actualizar usings en archivos externos que referencien "ReclutamientoLuxuryApp.RecruitmentSourceCatalog"
```

### 1.6 CandidateApplication → CandidateApplications
```
Renombrar carpeta: api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/CandidateApplication/ → CandidateApplications/
Actualizar namespace en TODOS los .cs dentro: "ReclutamientoLuxuryApp.CandidateApplication" → "ReclutamientoLuxuryApp.CandidateApplications"
Actualizar usings en archivos externos que referencien "ReclutamientoLuxuryApp.CandidateApplication"
```

**Verificación FASE 1:**
```bash
dotnet build api/LuxuryApp.Api/ --no-restore
```

---

## FASE 2 — Carpetas de RIESGO MEDIO (33 archivos total)

### 2.1 CandidateWorkExperience → CandidatesWorkExperience
```
Renombrar carpeta: api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/CandidateWorkExperience/ → CandidatesWorkExperience/
Actualizar namespace en TODOS los .cs dentro (7 archivos): "ReclutamientoLuxuryApp.CandidateWorkExperience" → "ReclutamientoLuxuryApp.CandidatesWorkExperience"
Actualizar usings en archivos externos (~18 refs).
```

### 2.2 InterviewerMatrix → InterviewerMatrices
```
Renombrar carpeta: api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/InterviewerMatrix/ → InterviewerMatrices/
Actualizar namespace en TODOS los .cs dentro (10 archivos): "ReclutamientoLuxuryApp.InterviewerMatrix" → "ReclutamientoLuxuryApp.InterviewerMatrices"
Actualizar usings en archivos externos (~17 refs).
```

### 2.3 CustomerProvider → CustomerProviders
```
Renombrar carpeta: api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/CustomerProvider/ → CustomerProviders/
Actualizar namespace en TODOS los .cs dentro (9 archivos): "ReclutamientoLuxuryApp.CustomerProvider" → "ReclutamientoLuxuryApp.CustomerProviders"
Actualizar usings en archivos externos (~11 refs).
IMPORTANTE: SupplierLuxuryApp referencia CustomerProvider.DTOs — actualizar también:
  - api/LuxuryApp.Application/Modules/SupplierLuxuryApp/ProviderAppService.cs
  - api/LuxuryApp.Application/Modules/SupplierLuxuryApp/ProviderMapper.cs
  - api/LuxuryApp.Application/Modules/SupplierLuxuryApp/Interfaces/IProviderAppService.cs
```

### 2.4 ProviderSupport → ProviderSupports
```
Renombrar carpeta: api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/ProviderSupport/ → ProviderSupports/
Actualizar namespace en TODOS los .cs dentro (5 archivos): "ReclutamientoLuxuryApp.ProviderSupport" → "ReclutamientoLuxuryApp.ProviderSupports"
Actualizar usings en archivos externos (~7 refs).
```

**Verificación FASE 2:**
```bash
dotnet build api/LuxuryApp.Api/ --no-restore
```

---

## FASE 3 — Carpetas de ALTO RIESGO (69 archivos total)

### 3.1 JobDescription → JobDescriptions
```
Renombrar carpeta: api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/JobDescription/ → JobDescriptions/
Actualizar namespace en TODOS los .cs dentro (9 archivos): "ReclutamientoLuxuryApp.JobDescription" → "ReclutamientoLuxuryApp.JobDescriptions"
Actualizar usings en archivos externos (~12 refs).
CRÍTICO: ApplicationDbContext.cs referencia JobDescription.Entities — actualizar:
  - api/LuxuryApp.Application/Infrastructure/Data/ApplicationDbContext.cs
  - api/LuxuryApp.Api/ServiceExtensions/DependencyInjection.Controllers.cs
  - api/LuxuryApp.Tests/.../OrgStructureValidationServiceTests.cs
```

### 3.2 CandidateProcess → CandidateProcesses
```
Renombrar carpeta: api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/CandidateProcess/ → CandidateProcesses/
Actualizar namespace en TODOS los .cs dentro (30 archivos): "ReclutamientoLuxuryApp.CandidateProcess" → "ReclutamientoLuxuryApp.CandidateProcesses"
Actualizar usings en archivos externos (~20 refs).
CRÍTICO: CandidateNotificationCoordinatorService.cs referencia CandidateProcess.Entities.CandidateProcess
```

### 3.3 Candidate → Candidates
```
Renombrar carpeta: api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/Candidate/ → Candidates/
Actualizar namespace en TODOS los .cs dentro (19 archivos): "ReclutamientoLuxuryApp.Candidate" → "ReclutamientoLuxuryApp.Candidates"
Actualizar usings en archivos externos (~22 refs).
CRÍTICO: Múltiples archivos en ReclutamientoLuxuryApp/ referencian Candidate.Entities.Candidate:
  - RequestEmployeeRegisterAppService.cs
  - RequestEmployeeRegister.cs
  - RequestPositionAppService.cs
  - RequestPosition.cs
  - RequestSalaryModification.cs
  - SolicitudBajaAppService.cs
  - RequestDismissal.cs
```

### 3.4 WorkPosition → WorkPositions
```
Renombrar carpeta: api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/WorkPosition/ → WorkPositions/
Actualizar namespace en TODOS los .cs dentro (11 archivos): "ReclutamientoLuxuryApp.WorkPosition" → "ReclutamientoLuxuryApp.WorkPositions"
Actualizar usings en archivos externos (~26 refs — MAYOR IMPACTO).
CRÍTICO: AdminLuxuryApp referencia WorkPosition.Entities.WorkPositionSchedule:
  - api/LuxuryApp.Application/Modules/AdminLuxuryApp/.../WorkPositionScheduleAppService.cs
CRÍTICO: Múltiples archivos en ReclutamientoLuxuryApp/ referencian WorkPosition.Entities.WorkPosition
```

**Verificación FASE 3:**
```bash
dotnet build api/LuxuryApp.Api/ --no-restore
```

---

## FASE 4 — Actualizar GlobalUsings (3 archivos)

### 4.1 LuxuryApp.Api/GlobalUsings.cs
Buscar y reemplazar TODAS las referencias a namespaces viejos:
- `ReclutamientoLuxuryApp.Candidate.` → `ReclutamientoLuxuryApp.Candidates.`
- `ReclutamientoLuxuryApp.CandidateProcess.` → `ReclutamientoLuxuryApp.CandidateProcesses.`
- `ReclutamientoLuxuryApp.CandidateWorkExperience.` → `ReclutamientoLuxuryApp.CandidatesWorkExperience.`
- `ReclutamientoLuxuryApp.InterviewerMatrix.` → `ReclutamientoLuxuryApp.InterviewerMatrices.`
- `ReclutamientoLuxuryApp.JobDescription.` → `ReclutamientoLuxuryApp.JobDescriptions.`
- `ReclutamientoLuxuryApp.WorkPosition.` → `ReclutamientoLuxuryApp.WorkPositions.`
- `ReclutamientoLuxuryApp.CustomerProvider.` → `ReclutamientoLuxuryApp.CustomerProviders.`
- `ReclutamientoLuxuryApp.ProviderSupport.` → `ReclutamientoLuxuryApp.ProviderSupports.`
- `ReclutamientoLuxuryApp.RecruitmentSourceCatalog.` → `ReclutamientoLuxuryApp.RecruitmentSourceCatalogs.`
- `ReclutamientoLuxuryApp.SolicitudAlta.` → `ReclutamientoLuxuryApp.SolicitudAltas.`
- `ReclutamientoLuxuryApp.SolicitudBaja.` → `ReclutamientoLuxuryApp.SolicitudBajas.`
- `ReclutamientoLuxuryApp.SolicitudModificacionSueldo.` → `ReclutamientoLuxuryApp.SolicitudModificacionesSueldo.`
- `ReclutamientoLuxuryApp.SolicitudVacante.` → `ReclutamientoLuxuryApp.SolicitudVacantes.`
- `ReclutamientoLuxuryApp.CandidateApplication.` → `ReclutamientoLuxuryApp.CandidateApplications.`

### 4.2 LuxuryApp.Application/GlobalUsings.cs
Mismos reemplazos que 4.1.

### 4.3 LuxuryApp.Tests/GlobalUsings.cs
Mismos reemplazos que 4.1.

**Verificación FASE 4:**
```bash
dotnet build api/LuxuryApp.Api/ --no-restore
```

---

## FASE 5 — Frontend (7 carpetas)

Renombrar carpetas en `appsweb/angular/src/app/apps/reclutamiento.luxuryapp/`:

| Actual | Nuevo |
|--------|-------|
| `candidate/` | `candidates/` |
| `candidate-application/` | `candidate-applications/` |
| `work-position/` | `work-positions/` |
| `solicitud-alta/` | `solicitud-altas/` |
| `solicitud-baja/` | `solicitud-bajas/` |
| `solicitud-modificacion-sueldo/` | `solicitud-modificaciones-sueldo/` |
| `solicitud-vacante/` | `solicitud-vacantes/` |

**NOTA:** Solo renombrar carpetas. NO cambiar imports en archivos TypeScript Angular a menos que el build falle.

**Verificación FASE 5:**
```bash
cd appsweb/angular && npm run build
```

---

## FASE 6 — Verificación Final

### 6.1 Compilación completa
```bash
dotnet build api/LuxuryApp.Api/ --no-restore
```

### 6.2 No debe quedar ningún namespace viejo
```bash
# Buscar referencias residuales a namespaces viejos
grep -rn "ReclutamientoLuxuryApp\.Candidate\." api/ --include="*.cs" | grep -v "Candidates\."
grep -rn "ReclutamientoLuxuryApp\.JobDescription\." api/ --include="*.cs" | grep -v "JobDescriptions\."
grep -rn "ReclutamientoLuxuryApp\.WorkPosition\." api/ --include="*.cs" | grep -v "WorkPositions\."
grep -rn "ReclutamientoLuxuryApp\.CandidateProcess\." api/ --include="*.cs" | grep -v "CandidateProcesses\."
grep -rn "ReclutamientoLuxuryApp\.CustomerProvider\." api/ --include="*.cs" | grep -v "CustomerProviders\."
grep -rn "ReclutamientoLuxuryApp\.ProviderSupport\." api/ --include="*.cs" | grep -v "ProviderSupports\."
grep -rn "ReclutamientoLuxuryApp\.InterviewerMatrix\." api/ --include="*.cs" | grep -v "InterviewerMatrices\."
grep -rn "ReclutamientoLuxuryApp\.CandidateWorkExperience\." api/ --include="*.cs" | grep -v "CandidatesWorkExperience\."
grep -rn "ReclutamientoLuxuryApp\.RecruitmentSourceCatalog\." api/ --include="*.cs" | grep -v "RecruitmentSourceCatalogs\."
grep -rn "ReclutamientoLuxuryApp\.SolicitudAlta\." api/ --include="*.cs" | grep -v "SolicitudAltas\."
grep -rn "ReclutamientoLuxuryApp\.SolicitudBaja\." api/ --include="*.cs" | grep -v "SolicitudBajas\."
grep -rn "ReclutamientoLuxuryApp\.SolicitudModificacionSueldo\." api/ --include="*.cs" | grep -v "SolicitudModificacionesSueldo\."
grep -rn "ReclutamientoLuxuryApp\.SolicitudVacante\." api/ --include="*.cs" | grep -v "SolicitudVacantes\."
grep -rn "ReclutamientoLuxuryApp\.CandidateApplication\." api/ --include="*.cs" | grep -v "CandidateApplications\."
```
**Esperado:** 0 resultados (todos los viejos deben estar migrados).

### 6.3 Tests
```bash
dotnet test api/LuxuryApp.Tests/ --no-build
```

### 6.4 Frontend build
```bash
cd appsweb/angular && npm run build
```

---

## Resumen de Impacto

| Fase | Carpetas | Archivos .cs | Usings externos | GlobalUsings |
|------|----------|--------------|-----------------|--------------|
| 1 (Bajo) | 6 | 15 | ~30 | 0 |
| 2 (Medio) | 4 | 31 | ~53 | 0 |
| 3 (Alto) | 4 | 69 | ~80 | 0 |
| 4 (Global) | 0 | 0 | 0 | 3 |
| 5 (Frontend) | 7 | 0 | 0 | 0 |
| **TOTAL** | **21** | **115** | **~163** | **3** |

---

## Orden de Ejecución (recomendado)

1. Ejecutar FASE 1 completo → verificar build
2. Ejecutar FASE 2 completo → verificar build
3. Ejecutar FASE 3 completo → verificar build
4. Ejecutar FASE 4 completo → verificar build
5. Ejecutar FASE 5 completo → verificar build frontend
6. Ejecutar FASE 6 verificación completa

**Si en algún paso falla el build:** detenerse, diagnosticar el namespace faltante, corregir, y reintentar.
