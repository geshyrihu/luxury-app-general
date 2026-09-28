# 🧪 PLAN: Refactorización Tests → Path-Based (Opción A)

**Fecha:** 2026-09-11  
**Ejecutor:** Agente Externo (Chalán)  
**Status:** 📋 PENDIENTE EJECUCIÓN  
**Decisión:** Opción A (Path-Based como Application)

---

## 📋 Resumen

Migrar `LuxuryApp.Tests` a patrón path-based sin prefijo (igual que Application post-2026-09-11):

| Métrica | Antes | Después |
|---------|-------|---------|
| Namespace | `LuxuryApp.Tests.Application.ModuleApps.AdminLuxuryApp.Banks` | `AdminLuxuryApp.Banks.Tests` |
| Archivos afectados | 73 `.cs` | 73 `.cs` (100%) |
| Usings a actualizar | 63 `using LuxuryApp.Tests.Application.Infrastructure` | 63 `using Infrastructure` |
| Casos especiales | 2 archivos fuera de Application | Manejados explícitamente |

---

## 🎯 Objetivo

**Alineamiento:** Application y Tests comparten única regla path-based (sin prefijo de proyecto, namespace = ruta relativa).

**Razón:** Consistencia arquitectónica + simplificación de nombres.

---

## 📐 Reglas de Transformación

### Regla 1: Namespaces Principales (60 archivos)

```
Patrón:     LuxuryApp.Tests.Application.ModuleApps.{Módulo}.*
Antes:      namespace LuxuryApp.Tests.Application.ModuleApps.AdminLuxuryApp.Banks;
Después:    namespace AdminLuxuryApp.Banks.Tests;
```

### Regla 2: Infrastructure (1 archivo)

```
Patrón:     LuxuryApp.Tests.Application.Infrastructure.*
Antes:      namespace LuxuryApp.Tests.Application.Infrastructure;
Después:    namespace Infrastructure;
```

### Regla 3: Usings (63 referencias)

```
Patrón:     using LuxuryApp.Tests.Application.Infrastructure;
Antes:      using LuxuryApp.Tests.Application.Infrastructure;
Después:    using Infrastructure;
```

### Regla 4: Casos Especiales (2 archivos)

| Archivo | Ubicación | Acción | Nuevo Namespace |
|---------|-----------|--------|-----------------|
| AspelCoiApiClientTests.cs | `api/LuxuryApp.Tests/` (raíz, no en Application/) | Dejar sin cambio | (sin namespace actual) |
| DbContextValidationTests.cs | `api/LuxuryApp.Tests/Infrastructure/Data/` (fuera de Application/) | Cambiar a path-based | `Infrastructure.Data.Tests` |

---

## 🔧 Fases de Ejecución

### Fase 0: Preparación (3 min)

**Crear git repo de seguridad:**

```powershell
cd d:\repos\luxuryapp-api\api\LuxuryApp.Tests

# Inicializar repo temporal (sin push)
git init
git config user.email "refactor@luxuryapp.local"
git config user.name "Refactor Agent"

# Commit actual (snapshot pre-cambio)
git add -A
git commit -m "Pre-refactor snapshot: LuxuryApp.Tests namespaces (path-based incoming)"

# Verificar
git log --oneline | head -1  # Debe mostrar commit
```

**Audiencia:** Entregar hash del commit (ej. `abc123e`)

---

### Fase 1: Auditoría Previa (5 min)

**Comandos (read-only):**

```powershell
cd d:\repos\luxuryapp-api

# Contar archivos
Write-Host "Archivos .cs en Tests:"
(Get-ChildItem -Path api/LuxuryApp.Tests -Filter "*.cs" -Recurse | Measure-Object).Count
# Esperado: 73

# Patrones actuales
Write-Host "Patrón ModuleApps:"
(Select-String -Path "api/LuxuryApp.Tests/**/*.cs" -Pattern "^namespace LuxuryApp.Tests.Application.ModuleApps\." -Recurse | Measure-Object).Count
# Esperado: 60

Write-Host "Patrón Infrastructure:"
(Select-String -Path "api/LuxuryApp.Tests/**/*.cs" -Pattern "^namespace LuxuryApp.Tests.Application.Infrastructure" -Recurse | Measure-Object).Count
# Esperado: 1

Write-Host "Usings a Infrastructure:"
(Select-String -Path "api/LuxuryApp.Tests/**/*.cs" -Pattern "using LuxuryApp.Tests.Application.Infrastructure" -Recurse | Measure-Object).Count
# Esperado: 63
```

**Entregar:** 4 números (73, 60, 1, 63)

---

### Fase 2: Transformación (20 min)

**Script PowerShell:**

```powershell
#!/usr/bin/env pwsh
<#
  Transformación: LuxuryApp.Tests → Path-Based (Opción A)
  Actualiza 60 namespaces ModuleApps + 1 Infrastructure + 63 usings
#>

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = "d:\repos\luxuryapp-api"
$testDir = "$repoRoot\api\LuxuryApp.Tests"

Write-Host "📝 Fase 2: Transformación de Namespaces y Usings" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Cambios completados
$changedCount = 0
$filesProcessed = @()

# 1. Transformar namespaces ModuleApps (60 archivos)
Write-Host "1️⃣ Namespace ModuleApps (60 archivos)..." -ForegroundColor Yellow
Get-ChildItem -Path $testDir -Filter "*.cs" -Recurse | Where-Object {
    $content = Get-Content -Path $_.FullName -Raw
    $content -match "namespace LuxuryApp.Tests.Application.ModuleApps\."
} | ForEach-Object {
    $file = $_.FullName
    $content = Get-Content -Path $file -Raw
    
    # Patrón: LuxuryApp.Tests.Application.ModuleApps.{Módulo}.* → {Módulo}.*.Tests
    $oldNs = $content -match 'namespace (LuxuryApp\.Tests\.Application\.ModuleApps\.[^;]+);' | ForEach-Object { $matches[1] }
    
    if ($oldNs) {
        # Extraer módulo y resto
        $parts = $oldNs -replace "LuxuryApp.Tests.Application.ModuleApps.", "" -split "\."
        $newNs = ($parts[0..($parts.Count-1)] -join ".") + ".Tests"
        
        # Reemplazar (preservar CRLF/LF exacto)
        $content = $content -replace "namespace $([regex]::Escape($oldNs));", "namespace $newNs;"
        
        Set-Content -Path $file -Value $content -NoNewline
        $changedCount++
        $filesProcessed += @{File=$file; Old=$oldNs; New=$newNs}
        
        Write-Host "  ✅ $($_.Name): $oldNs → $newNs" -ForegroundColor Green
    }
}

Write-Host "  Completado: $changedCount archivos" -ForegroundColor Green
Write-Host ""

# 2. Transformar namespace Infrastructure (1 archivo)
Write-Host "2️⃣ Namespace Infrastructure (1 archivo)..." -ForegroundColor Yellow
Get-ChildItem -Path $testDir -Filter "*.cs" -Recurse | Where-Object {
    $content = Get-Content -Path $_.FullName -Raw
    $content -match "namespace LuxuryApp.Tests.Application.Infrastructure"
} | ForEach-Object {
    $file = $_.FullName
    $content = Get-Content -Path $file -Raw
    
    $oldNs = "LuxuryApp.Tests.Application.Infrastructure"
    $newNs = "Infrastructure"
    
    $content = $content -replace "namespace $([regex]::Escape($oldNs));", "namespace $newNs;"
    
    Set-Content -Path $file -Value $content -NoNewline
    $changedCount++
    $filesProcessed += @{File=$file; Old=$oldNs; New=$newNs}
    
    Write-Host "  ✅ $($_.Name): $oldNs → $newNs" -ForegroundColor Green
}

Write-Host ""

# 3. Actualizar usings (63 referencias)
Write-Host "3️⃣ Usings de Infrastructure (63 referencias)..." -ForegroundColor Yellow
$usingsUpdated = 0

Get-ChildItem -Path $testDir -Filter "*.cs" -Recurse | ForEach-Object {
    $file = $_.FullName
    $content = Get-Content -Path $file -Raw
    
    if ($content -match "using LuxuryApp.Tests.Application.Infrastructure;") {
        $newContent = $content -replace "using LuxuryApp.Tests.Application.Infrastructure;", "using Infrastructure;"
        
        if ($newContent -ne $content) {
            Set-Content -Path $file -Value $newContent -NoNewline
            $usingsUpdated++
            Write-Host "  ✅ $($_.Name): using actualizado" -ForegroundColor Green
        }
    }
}

Write-Host "  Completado: $usingsUpdated usings actualizados" -ForegroundColor Green
Write-Host ""

# 4. Verificar archivos especiales
Write-Host "4️⃣ Casos especiales..." -ForegroundColor Yellow
$specialFiles = @(
    "$testDir\AspelCoiApiClientTests.cs",
    "$testDir\Infrastructure\Data\DbContextValidationTests.cs"
)

foreach ($file in $specialFiles) {
    if (Test-Path $file) {
        $content = Get-Content -Path $file -Raw
        $hasNamespace = $content -match "^namespace "
        
        if ($hasNamespace) {
            $ns = $content -match 'namespace ([^;]+);' | ForEach-Object { $matches[1] }
            Write-Host "  ⚠️ $([System.IO.Path]::GetFileName($file)): namespace=$ns (revisar)" -ForegroundColor Yellow
        } else {
            Write-Host "  ⚠️ $([System.IO.Path]::GetFileName($file)): sin namespace (DEJAR COMO ESTÁ)" -ForegroundColor Yellow
        }
    }
}

Write-Host ""
Write-Host "✅ FASE 2 COMPLETADA" -ForegroundColor Green
Write-Host "   Namespaces actualizados: $changedCount"
Write-Host "   Usings actualizados: $usingsUpdated"
Write-Host ""
```

**Instrucciones de ejecución:**
1. Copiar script a `transform_tests.ps1`
2. Ejecutar: `pwsh .\transform_tests.ps1 2>&1 | Tee-Object -FilePath C:\Temp\transform_tests.log`
3. Capturar output completo

---

### Fase 3: Verificación Post-Cambio (10 min)

**Comandos (read-only):**

```powershell
cd d:\repos\luxuryapp-api

Write-Host "✅ Verificación Post-Cambio" -ForegroundColor Cyan

# ❌ NO debe haber prefijos viejos
Write-Host "❌ Prefijos LuxuryApp.Tests (debe ser 0):"
(Select-String -Path "api/LuxuryApp.Tests/**/*.cs" -Pattern "^namespace LuxuryApp.Tests\." -Recurse | Measure-Object).Count

# ❌ NO debe haber ModuleApps
Write-Host "❌ ModuleApps (debe ser 0):"
(Select-String -Path "api/LuxuryApp.Tests/**/*.cs" -Pattern "ModuleApps" -Recurse | Measure-Object).Count

# ✅ Verificar patrón .Tests
Write-Host "✅ Namespaces con .Tests (debe ser ~60):"
(Select-String -Path "api/LuxuryApp.Tests/**/*.cs" -Pattern "^namespace .*\.Tests$" -Recurse | Measure-Object).Count

# ✅ Verificar Infrastructure
Write-Host "✅ Namespace Infrastructure (debe ser 1):"
(Select-String -Path "api/LuxuryApp.Tests/**/*.cs" -Pattern "^namespace Infrastructure$" -Recurse | Measure-Object).Count

# ✅ Verificar usings nuevos
Write-Host "✅ Using Infrastructure (debe ser ~63):"
(Select-String -Path "api/LuxuryApp.Tests/**/*.cs" -Pattern "^using Infrastructure;" -Recurse | Measure-Object).Count

# ❌ NO debe quedar using viejo
Write-Host "❌ Using viejo (debe ser 0):"
(Select-String -Path "api/LuxuryApp.Tests/**/*.cs" -Pattern "using LuxuryApp.Tests.Application.Infrastructure" -Recurse | Measure-Object).Count
```

**Entregar:** 6 números

---

### Fase 4: Compilación (5 min)

**Test de build (opcional pero recomendado):**

```powershell
cd d:\repos\luxuryapp-api

dotnet build api/LuxuryApp.Tests.csproj 2>&1 | Tee-Object -FilePath C:\Temp\build_tests.log

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ BUILD EXITOSA" -ForegroundColor Green
} else {
    Write-Host "❌ BUILD FALLÓ - Ver log: C:\Temp\build_tests.log" -ForegroundColor Red
}
```

---

## 📊 Checklist

| # | Tarea | Status |
|---|-------|--------|
| 1 | Crear git repo (Fase 0) | `[ ]` |
| 2 | Auditoría previa (Fase 1) | `[ ]` |
| 3 | Ejecutar script (Fase 2) | `[ ]` |
| 4 | Verificación post (Fase 3) | `[ ]` |
| 5 | Build test (Fase 4) | `[ ]` |
| 6 | Reportar resumen | `[ ]` |

---

## 📤 Deliverables Esperados

1. **Fase 0:** Hash del commit pre-cambio
2. **Fase 1:** 4 números (73, 60, 1, 63)
3. **Fase 2:** Output del script (73+ líneas ✅)
4. **Fase 3:** 6 números de verificación
5. **Fase 4:** Status de build (PASS/FAIL)
6. **Resumen:**
   ```
   ✅ COMPLETADA
   - Namespaces transformados: 61/61 ✅
   - Usings actualizados: 63/63 ✅
   - Prefijos viejos encontrados: 0 ✅
   - Build: PASS ✅
   ```

---

## 🔗 Convención Formalizada

- **Actualizada:** `conventions/backend/namespace-conventions.md` (línea 150+)
- **Especializada:** `conventions/backend/testing-namespace-conventions.md`
- **Formal:** `conventions/CONVENTIONS_TESTING.md`

---

**Creado:** 2026-09-11  
**Decisión:** Opción A (Path-Based, sin prefijo LuxuryApp.Tests.*)
