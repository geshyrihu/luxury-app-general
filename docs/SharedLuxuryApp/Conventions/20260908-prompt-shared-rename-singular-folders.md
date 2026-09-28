# Prompt de Ejecución — Renombrar 5 Carpetas Singulares en ReclutamientoLuxuryApp

> **Objetivo:** Renombrar 5 carpetas que incumplen la regla plural (carpeta) vs singular (clase). Eliminar colisiones CS0118 y reducir ~30 aliases.
>
> **Herramienta recomendada:** Aider (`aider --yes --model openai/claude-3-5-sonnet-20241022`)
>
> **Antes de ejecutar:** `$env:OPENAI_API_BASE="http://localhost:20128/v1"; $env:OPENAI_API_KEY="sk-omniroute"`

---

## Contexto

Estas 5 carpetas tienen nombre **singular** que colisiona con el nombre de la **clase/entidad** que contienen, causando errores CS0118 y forzando el uso de `using alias =` en 66 archivos.

**Regla:** Carpeta = plural, Clase = singular.

---

## FASE 1 — Renombrar carpetas (62 archivos total)

Ejecutar uno por uno:

### 1.1 RequestDismissal → RequestDismissals
```
Renombrar carpeta: api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/RequestDismissal/ → RequestDismissals/
Actualizar namespace en TODOS los .cs dentro (17 archivos): "ReclutamientoLuxuryApp.RequestDismissal" → "ReclutamientoLuxuryApp.RequestDismissals"
Actualizar usings en archivos externos que referencien "ReclutamientoLuxuryApp.RequestDismissal"
```

### 1.2 RequestDismissalDiscount → RequestDismissalDiscounts
```
Renombrar carpeta: api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/RequestDismissalDiscount/ → RequestDismissalDiscounts/
Actualizar namespace en TODOS los .cs dentro (8 archivos): "ReclutamientoLuxuryApp.RequestDismissalDiscount" → "ReclutamientoLuxuryApp.RequestDismissalDiscounts"
Actualizar usings en archivos externos que referencien "ReclutamientoLuxuryApp.RequestDismissalDiscount"
```

### 1.3 RequestEmployeeRegister → RequestEmployeeRegisters
```
Renombrar carpeta: api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/RequestEmployeeRegister/ → RequestEmployeeRegisters/
Actualizar namespace en TODOS los .cs dentro (18 archivos): "ReclutamientoLuxuryApp.RequestEmployeeRegister" → "ReclutamientoLuxuryApp.RequestEmployeeRegisters"
Actualizar usings en archivos externos que referencien "ReclutamientoLuxuryApp.RequestEmployeeRegister"
```

### 1.4 RequestPosition → RequestPositions
```
Renombrar carpeta: api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/RequestPosition/ → RequestPositions/
Actualizar namespace en TODOS los .cs dentro (9 archivos): "ReclutamientoLuxuryApp.RequestPosition" → "ReclutamientoLuxuryApp.RequestPositions"
Actualizar usings en archivos externos que referencien "ReclutamientoLuxuryApp.RequestPosition"
```

### 1.5 SalaryModification → SalaryModifications
```
Renombrar carpeta: api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/SalaryModification/ → SalaryModifications/
Actualizar namespace en TODOS los .cs dentro (10 archivos): "ReclutamientoLuxuryApp.SalaryModification" → "ReclutamientoLuxuryApp.SalaryModifications"
Actualizar usings en archivos externos que referencien "ReclutamientoLuxuryApp.SalaryModification"
```

---

## FASE 2 — Actualizar GlobalUsings (3 archivos)

### 2.1 LuxuryApp.Api/GlobalUsings.cs
Buscar y reemplazar:
- `ReclutamientoLuxuryApp.RequestDismissal.` → `ReclutamientoLuxuryApp.RequestDismissals.`
- `ReclutamientoLuxuryApp.RequestDismissalDiscount.` → `ReclutamientoLuxuryApp.RequestDismissalDiscounts.`
- `ReclutamientoLuxuryApp.RequestEmployeeRegister.` → `ReclutamientoLuxuryApp.RequestEmployeeRegisters.`
- `ReclutamientoLuxuryApp.RequestPosition.` → `ReclutamientoLuxuryApp.RequestPositions.`
- `ReclutamientoLuxuryApp.SalaryModification.` → `ReclutamientoLuxuryApp.SalaryModifications.`

### 2.2 LuxuryApp.Application/GlobalUsings.cs
Mismos reemplazos que 2.1.

### 2.3 LuxuryApp.Tests/GlobalUsings.cs
Mismos reemplazos que 2.1.

---

## FASE 3 — Verificación

### 3.1 Compilación
```bash
dotnet build api/LuxuryApp.Api/ --no-restore
```

### 3.2 No debe quedar ningún namespace viejo
```bash
grep -rn "ReclutamientoLuxuryApp\.RequestDismissal\." api/ --include="*.cs" | grep -v "RequestDismissals\."
grep -rn "ReclutamientoLuxuryApp\.RequestDismissalDiscount\." api/ --include="*.cs" | grep -v "RequestDismissalDiscounts\."
grep -rn "ReclutamientoLuxuryApp\.RequestEmployeeRegister\." api/ --include="*.cs" | grep -v "RequestEmployeeRegisters\."
grep -rn "ReclutamientoLuxuryApp\.RequestPosition\." api/ --include="*.cs" | grep -v "RequestPositions\."
grep -rn "ReclutamientoLuxuryApp\.SalaryModification\." api/ --include="*.cs" | grep -v "SalaryModifications\."
```
**Esperado:** 0 resultados.

### 3.3 Verificar estructura final
```powershell
Get-ChildItem "D:\repos\luxuryapp-api\api\LuxuryApp.Application\Modules\ReclutamientoLuxuryApp" -Directory | Select-Object Name
# Todas las carpetas deben ser plurales
```

### 3.4 Tests
```bash
dotnet test api/LuxuryApp.Tests/ --no-build
```

---

## Resumen de Impacto

| FASE | Acción | Archivos |
|------|--------|----------|
| 1 | Renombrar 5 carpetas + actualizar namespaces | 62 archivos |
| 2 | Actualizar 3 GlobalUsings | ~25 líneas |
| 3 | Verificación | build + grep + tests |
| **TOTAL** | | **62 archivos + 3 GlobalUsings** |

---

## Resultado Esperado

| Antes | Después |
|-------|---------|
| 5 carpetas singulares | 5 carpetas plurales |
| 4 colisiones nombre-carpeta vs nombre-clase | 0 colisiones |
| ~30 aliases innecesarios | Aliases eliminados |
| 66 alias totales | ~36 alias restantes (cross-refs legítimas) |
