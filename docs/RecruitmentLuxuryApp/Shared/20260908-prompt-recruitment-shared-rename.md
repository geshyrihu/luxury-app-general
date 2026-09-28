# Prompt de Ejecución — Mover Carpetas de Reclutamiento/Recruitment/ a Raíz del Módulo

> **Objetivo:** Mover 7 carpetas desde `ReclutamientoLuxuryApp/Reclutamiento/Recruitment/` para que sean hijos directos de `ReclutamientoLuxuryApp/`. Eliminar nivel innecesario de anidación.
>
> **Herramienta recomendada:** Aider (`aider --yes --model openai/claude-3-5-sonnet-20241022`)
>
> **Antes de ejecutar:** `$env:OPENAI_API_BASE="http://localhost:20128/v1"; $env:OPENAI_API_KEY="sk-omniroute"`

---

## Contexto

Estructura actual (anidación innecesaria):
```
ReclutamientoLuxuryApp/
└── Reclutamiento/              ← Nivel extra sin valor
    └── Recruitment/            ← Nivel extra sin valor
        ├── RecurringTasks/
        ├── RequestDismissal/
        ├── RequestDismissalDiscount/
        ├── RequestEmployeeRegister/
        ├── RequestPosition/
        ├── SalaryModification/
        └── RecruitmentRequests/
```

Estructura objetivo (directos al módulo):
```
ReclutamientoLuxuryApp/
├── RecurringTasks/
├── RequestDismissal/
├── RequestDismissalDiscount/
├── RequestEmployeeRegister/
├── RequestPosition/
├── SalaryModification/
├── RecruitmentRequests/
├── Candidates/                 ← Ya existente
├── WorkPositions/              ← Ya existente
└── ...
```

---

## FASE 1 — Mover carpetas (90 archivos)

Mover las 7 carpetas desde `api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/Reclutamiento/Recruitment/` hasta `api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/`:

```powershell
# Mover cada carpeta
$base = "D:\repos\luxuryapp-api\api\LuxuryApp.Application\Modules\ReclutamientoLuxuryApp"
$source = "$base\Reclutamiento\Recruitment"

Move-Item "$source\RecurringTasks" "$base\RecurringTasks"
Move-Item "$source\RequestDismissal" "$base\RequestDismissal"
Move-Item "$source\RequestDismissalDiscount" "$base\RequestDismissalDiscount"
Move-Item "$source\RequestEmployeeRegister" "$base\RequestEmployeeRegister"
Move-Item "$source\RequestPosition" "$base\RequestPosition"
Move-Item "$source\SalaryModification" "$base\SalaryModification"
Move-Item "$source\RecruitmentRequests" "$base\RecruitmentRequests"
```

---

## FASE 2 — Actualizar namespaces (90 archivos + 14 cross-refs)

En **TODOS los .cs** dentro de las 7 carpetas movidas, reemplazar:

```
ReclutamientoLuxuryApp.Reclutamiento.Recruitment.  →  ReclutamientoLuxuryApp.
```

Esto cubre:
- 90 declaraciones `namespace`
- 14 usings internos (cross-references entre las 7 carpetas)

**Comando de verúsqueda para confirmar que no quedan residuos:**
```powershell
grep -rn "ReclutamientoLuxuryApp\.Reclutamiento\.Recruitment\." "$base" --include="*.cs"
# Esperado: 0 resultados
```

---

## FASE 3 — Actualizar GlobalUsings (3 archivos)

### 3.1 LuxuryApp.Application/GlobalUsings.cs
Buscar y reemplazar TODAS las líneas que contengan:
```
ReclutamientoLuxuryApp.Reclutamiento.Recruitment.  →  ReclutamientoLuxuryApp.
```
Líneas esperadas: ~19 (líneas 431-449 aprox.)

### 3.2 LuxuryApp.Api/GlobalUsings.cs
Mismo reemplazo. Líneas esperadas: ~39 (líneas 375-413 aprox.)

### 3.3 LuxuryApp.Tests/GlobalUsings.cs
Mismo reemplazo. Líneas esperadas: ~39 (líneas 375-413 aprox.)

---

## FASE 4 — Limpiar carpetas vacías

Después de mover, eliminar las carpetas vacías:
```powershell
Remove-Item "$base\Reclutamiento\Recruitment" -Recurse -Force
Remove-Item "$base\Reclutamiento\Recruitment\README.md" -Force
# Si Reclutamiento/ solo queda con README.md, eliminar también:
Remove-Item "$base\Reclutamiento" -Recurse -Force
```

---

## FASE 5 — Verificación

### 5.1 Compilación
```bash
dotnet build api/LuxuryApp.Api/ --no-restore
```

### 5.2 No debe quedar referencia al namespace viejo
```bash
grep -rn "ReclutamientoLuxuryApp\.Reclutamiento\.Recruitment\." api/ --include="*.cs"
# Esperado: 0 resultados
```

### 5.3 Verificar estructura final
```powershell
# Las 7 carpetas deben estar directamente en ReclutamientoLuxuryApp/
Get-ChildItem "D:\repos\luxuryapp-api\api\LuxuryApp.Application\Modules\ReclutamientoLuxuryApp" -Directory | Select-Object Name
# Debe mostrar: RecurringTasks, RequestDismissal, RequestDismissalDiscount, RequestEmployeeRegister, RequestPosition, SalaryModification, RecruitmentRequests (junto a los ya existentes)
```

### 5.4 Tests
```bash
dotnet test api/LuxuryApp.Tests/ --no-build
```

---

## Resumen de Impacto

| FASE | Acción | Archivos |
|------|--------|----------|
| 1 | Mover 7 carpetas | 90 archivos |
| 2 | Actualizar namespaces | 90 + 14 = 104 líneas |
| 3 | Actualizar GlobalUsings | 3 archivos (~97 líneas) |
| 4 | Eliminar carpetas vacías | 2-3 carpetas |
| 5 | Verificación | build + grep + tests |
| **TOTAL** | | **90 archivos + 3 GlobalUsings** |

---

## Orden de Ejecución

1. Ejecutar FASE 1 (mover carpetas)
2. Ejecutar FASE 2 (actualizar namespaces con find-replace)
3. Ejecutar FASE 3 (actualizar GlobalUsings)
4. Ejecutar FASE 4 (limpiar vacías)
5. Ejecutar FASE 5 (verificar)
