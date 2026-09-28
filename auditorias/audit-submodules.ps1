<#
.SYNOPSIS
Auditoria de submodulos: detecta submodulos repetidos en modulos distintos
y genera un reporte Markdown detallado.
#>

param(
    [string]$BackendRoot = "D:\repos\luxuryapp-api\api\LuxuryApp.Application\Modules",
    [string]$FrontendRoot = "D:\repos\luxuryapp-api\appsweb\angular\src\app\apps",
    [string]$OutputPath = "D:\repos\luxuryapp-api\auditorias\auditoria-submodulos.md"
)

function Get-BackendStructure {
    param([string]$Root)
    $result = @{}
    if (-not (Test-Path $Root)) { return $result }
    $moduleDirs = Get-ChildItem -Path $Root -Directory | Where-Object { $_.Name -notlike "SharedLuxuryApp" }
    foreach ($module in $moduleDirs) {
        $moduleName = $module.Name
        $submodules = @{}
        $subDirs = Get-ChildItem -Path $module.FullName -Directory | Where-Object { $_.Name -ne "Docs" }
        foreach ($sub in $subDirs) {
            $submoduleName = $sub.Name
            $structure = @{
                Path = $sub.FullName
                Entities = @(); DTOs = @(); Services = @(); EndPoints = @()
                SubServices = @(); Helpers = @(); Mappings = @(); Persistence = @(); Other = @()
            }
            Get-ChildItem -Path $sub.FullName -Filter "*.cs" -Recurse -File | Where-Object { $_.Directory.Name -eq "Entities" } | ForEach-Object { $structure.Entities += $_.Name }
            Get-ChildItem -Path $sub.FullName -Filter "*.cs" -Recurse -File | Where-Object { $_.Directory.Name -eq "DTOs" } | ForEach-Object { $structure.DTOs += $_.Name }
            Get-ChildItem -Path $sub.FullName -Filter "*.cs" -Recurse -File | Where-Object { $_.Directory.Name -eq "Services" } | ForEach-Object { $structure.Services += $_.Name }
            Get-ChildItem -Path $sub.FullName -Filter "*.cs" -Recurse -File | Where-Object { $_.Directory.Name -eq "EndPoints" } | ForEach-Object { $structure.EndPoints += $_.Name }
            Get-ChildItem -Path $sub.FullName -Filter "*.cs" -Recurse -File | Where-Object { $_.Directory.Name -eq "SubServices" } | ForEach-Object { $structure.SubServices += $_.Name }
            Get-ChildItem -Path $sub.FullName -Filter "*.cs" -Recurse -File | Where-Object { $_.Directory.Name -eq "Helpers" } | ForEach-Object { $structure.Helpers += $_.Name }
            Get-ChildItem -Path $sub.FullName -Filter "*.cs" -Recurse -File | Where-Object { $_.Directory.Name -eq "Mappings" } | ForEach-Object { $structure.Mappings += $_.Name }
            Get-ChildItem -Path $sub.FullName -Filter "*.cs" -Recurse -File | Where-Object { $_.Directory.Name -eq "Persistence" } | ForEach-Object { $structure.Persistence += $_.Name }
            Get-ChildItem -Path $sub.FullName -Filter "*.cs" -Recurse -File | Where-Object { $_.Directory.Name -notin @("Entities","DTOs","Services","EndPoints","SubServices","Helpers","Mappings","Persistence") } | ForEach-Object { $structure.Other += $_.Name }
            $submodules[$submoduleName] = $structure
        }
        $result[$moduleName] = $submodules
    }
    return $result
}

function Get-FrontendStructure {
    param([string]$Root)
    $result = @{}
    if (-not (Test-Path $Root)) { return $result }
    $moduleDirs = Get-ChildItem -Path $Root -Directory | Where-Object { $_.Name -notlike "shared" }
    foreach ($module in $moduleDirs) {
        $moduleName = $module.Name
        $submodules = @{}
        $subDirs = Get-ChildItem -Path $module.FullName -Directory | Where-Object { $_.Name -notlike "*shared" -and $_.Name -notlike "*shell" -and $_.Name -ne "docs" }
        foreach ($sub in $subDirs) {
            $submoduleName = $sub.Name
            $structure = @{
                Path = $sub.FullName
                Components = @(); Desktop = @(); Mobile = @(); Interfaces = @()
                Services = @(); SubServices = @(); Helpers = @(); Pipes = @(); Other = @()
            }
            Get-ChildItem -Path $sub.FullName -Filter "*.ts" -File | Where-Object { $_.Name -notlike "*desktop*" -and $_.Name -notlike "*mobile*" -and $_.Name -notlike "*.interface.ts" -and $_.Name -notlike "*.service.ts" -and $_.Name -notlike "*.pipe.ts" -and $_.Name -notlike "*.spec.ts" } | ForEach-Object { $structure.Components += $_.Name }
            Get-ChildItem -Path $sub.FullName -Filter "*desktop.ts" -Recurse -File | ForEach-Object { $structure.Desktop += $_.Name }
            Get-ChildItem -Path $sub.FullName -Filter "*mobile.ts" -Recurse -File | ForEach-Object { $structure.Mobile += $_.Name }
            Get-ChildItem -Path $sub.FullName -Filter "*.interface.ts" -Recurse -File | ForEach-Object { $structure.Interfaces += $_.Name }
            Get-ChildItem -Path $sub.FullName -Filter "*.service.ts" -Recurse -File | ForEach-Object { $structure.Services += $_.Name }
            Get-ChildItem -Path $sub.FullName -Filter "*service.ts" -Recurse -File | Where-Object { $_.Directory.Name -eq "sub-services" } | ForEach-Object { $structure.SubServices += $_.Name }
            Get-ChildItem -Path $sub.FullName -Filter "*.ts" -Recurse -File | Where-Object { $_.Directory.Name -eq "helpers" } | ForEach-Object { $structure.Helpers += $_.Name }
            Get-ChildItem -Path $sub.FullName -Filter "*.pipe.ts" -Recurse -File | ForEach-Object { $structure.Pipes += $_.Name }
            Get-ChildItem -Path $sub.FullName -Filter "*.ts" -Recurse -File | Where-Object { $_.Name -notlike "*desktop*" -and $_.Name -notlike "*mobile*" -and $_.Name -notlike "*.interface.ts" -and $_.Name -notlike "*.service.ts" -and $_.Name -notlike "*.pipe.ts" -and $_.Name -notlike "*.spec.ts" -and $_.Directory.Name -ne "helpers" -and $_.Directory.Name -ne "sub-services" } | ForEach-Object { $structure.Other += $_.Name }
            $submodules[$submoduleName] = $structure
        }
        $result[$moduleName] = $submodules
    }
    return $result
}

function Find-Violations {
    param([hashtable]$Data)
    $violations = @{}
    $allSubmodules = @{}
    foreach ($module in $Data.Keys) {
        foreach ($submodule in $Data[$module].Keys) {
            if ($allSubmodules.ContainsKey($submodule)) {
                if (-not $violations.ContainsKey($submodule)) { $violations[$submodule] = @() }
                $violations[$submodule] += $allSubmodules[$submodule]
                $violations[$submodule] += $module
            } else { $allSubmodules[$submodule] = $module }
        }
    }
    return $violations
}

function New-MarkdownReport {
    param(
        [hashtable]$BackendData, [hashtable]$FrontendData,
        [hashtable]$BackendViolations, [hashtable]$FrontendViolations,
        [string]$OutputPath
    )
    $date = Get-Date -Format "yyyy-MM-dd HH:mm"
    $lines = New-Object System.Collections.Generic.List[string]
    $lines.Add("# Auditoria de Submodulos - LuxuryApp")
    $lines.Add("")
    $lines.Add("**Fecha:** $date")
    $lines.Add("**Regla:** Un submódulo vive en un único módulo padre (2.2 CONVENTIONSFOLDER.MD)")
    $lines.Add("")
    $lines.Add("---")
    $lines.Add("")
    
    # Backend Summary
    $lines.Add("## Backend - Resumen")
    $lines.Add("")
    $lines.Add("**Ruta:** $BackendRoot")
    $lines.Add("")
    $lines.Add("| Modulo | Submodulos | Total |")
    $lines.Add("|--------|-----------|-------|")
    foreach ($module in ($BackendData.Keys | Sort-Object)) {
        $count = $BackendData[$module].Keys.Count
        $subs = $BackendData[$module].Keys -join ", "
        $lines.Add("| $module | $subs | $count |")
    }
    $lines.Add("")
    
    # Frontend Summary
    $lines.Add("## Frontend - Resumen")
    $lines.Add("")
    $lines.Add("**Ruta:** $FrontendRoot")
    $lines.Add("")
    $lines.Add("| Modulo | Submodulos | Total |")
    $lines.Add("|--------|-----------|-------|")
    foreach ($module in ($FrontendData.Keys | Sort-Object)) {
        $count = $FrontendData[$module].Keys.Count
        $subs = $FrontendData[$module].Keys -join ", "
        $lines.Add("| $module | $subs | $count |")
    }
    $lines.Add("")
    
    # Backend Violations
    $lines.Add("## Backend - Violaciones Detectadas")
    $lines.Add("")
    if ($BackendViolations.Count -eq 0) {
        $lines.Add("✅ No se detectaron violaciones. Cada submódulo aparece en un único módulo.")
    } else {
        $lines.Add("⚠️ **Se detectaron $($BackendViolations.Count) submódulos repetidos:**")
        $lines.Add("")
        foreach ($submodule in ($BackendViolations.Keys | Sort-Object)) {
            $modules = $BackendViolations[$submodule] -join ", "
            $lines.Add("- **$submodule** aparece en: $modules")
        }
        $lines.Add("")
    }
    $lines.Add("")
    
    # Frontend Violations
    $lines.Add("## Frontend - Violaciones Detectadas")
    $lines.Add("")
    if ($FrontendViolations.Count -eq 0) {
        $lines.Add("✅ No se detectaron violaciones. Cada submódulo aparece en un único módulo.")
    } else {
        $lines.Add("⚠️ **Se detectaron $($FrontendViolations.Count) submódulos repetidos:**")
        $lines.Add("")
        foreach ($submodule in ($FrontendViolations.Keys | Sort-Object)) {
            $modules = $FrontendViolations[$submodule] -join ", "
            $lines.Add("- **$submodule** aparece en: $modules")
        }
        $lines.Add("")
    }
    $lines.Add("")
    
    # Detailed Backend Structure
    $lines.Add("## Backend - Estructura Detallada por Modulo")
    $lines.Add("")
    foreach ($module in ($BackendData.Keys | Sort-Object)) {
        $lines.Add("### $module")
        $lines.Add("")
        $lines.Add("```")
        $lines.Add("$BackendRoot\$module/")
        foreach ($submodule in ($BackendData[$module].Keys | Sort-Object)) {
            $lines.Add("|-- $submodule/")
            $struct = $BackendData[$module][$submodule]
            if ($struct.Entities.Count -gt 0) { $lines.Add("|   |-- Entities/ ($($struct.Entities.Count) archivos)") }
            if ($struct.DTOs.Count -gt 0) { $lines.Add("|   |-- DTOs/ ($($struct.DTOs.Count) archivos)") }
            if ($struct.Services.Count -gt 0) { $lines.Add("|   |-- Services/ ($($struct.Services.Count) archivos)") }
            if ($struct.EndPoints.Count -gt 0) { $lines.Add("|   |-- EndPoints/ ($($struct.EndPoints.Count) archivos)") }
            if ($struct.SubServices.Count -gt 0) { $lines.Add("|   |-- SubServices/ ($($struct.SubServices.Count) archivos)") }
            if ($struct.Helpers.Count -gt 0) { $lines.Add("|   |-- Helpers/ ($($struct.Helpers.Count) archivos)") }
            if ($struct.Mappings.Count -gt 0) { $lines.Add("|   |-- Mappings/ ($($struct.Mappings.Count) archivos)") }
            if ($struct.Persistence.Count -gt 0) { $lines.Add("|   |-- Persistence/ ($($struct.Persistence.Count) archivos)") }
            if ($struct.Other.Count -gt 0) { $lines.Add("|   |-- Other/ ($($struct.Other.Count) archivos)") }
        }
        $lines.Add("```")
        $lines.Add("")
    }
    
    # Detailed Frontend Structure
    $lines.Add("## Frontend - Estructura Detallada por Modulo")
    $lines.Add("")
    foreach ($module in ($FrontendData.Keys | Sort-Object)) {
        $lines.Add("### $module")
        $lines.Add("")
        $lines.Add("```")
        $lines.Add("$FrontendRoot\$module/")
        foreach ($submodule in ($FrontendData[$module].Keys | Sort-Object)) {
            $lines.Add("|-- $submodule/")
            $struct = $FrontendData[$module][$submodule]
            if ($struct.Components.Count -gt 0) { $lines.Add("|   |-- Components/ ($($struct.Components.Count) archivos)") }
            if ($struct.Desktop.Count -gt 0) { $lines.Add("|   |-- Desktop/ ($($struct.Desktop.Count) archivos)") }
            if ($struct.Mobile.Count -gt 0) { $lines.Add("|   |-- Mobile/ ($($struct.Mobile.Count) archivos)") }
            if ($struct.Interfaces.Count -gt 0) { $lines.Add("|   |-- Interfaces/ ($($struct.Interfaces.Count) archivos)") }
            if ($struct.Services.Count -gt 0) { $lines.Add("|   |-- Services/ ($($struct.Services.Count) archivos)") }
            if ($struct.SubServices.Count -gt 0) { $lines.Add("|   |-- SubServices/ ($($struct.SubServices.Count) archivos)") }
            if ($struct.Helpers.Count -gt 0) { $lines.Add("|   |-- Helpers/ ($($struct.Helpers.Count) archivos)") }
            if ($struct.Pipes.Count -gt 0) { $lines.Add("|   |-- Pipes/ ($($struct.Pipes.Count) archivos)") }
            if ($struct.Other.Count -gt 0) { $lines.Add("|   |-- Other/ ($($struct.Other.Count) archivos)") }
        }
        $lines.Add("```")
        $lines.Add("")
    }
    
    # File listings per submodule
    $lines.Add("## Backend - Archivos por Submodulo")
    $lines.Add("")
    foreach ($module in ($BackendData.Keys | Sort-Object)) {
        foreach ($submodule in ($BackendData[$module].Keys | Sort-Object)) {
            $lines.Add("### $module/$submodule")
            $lines.Add("")
            $struct = $BackendData[$module][$submodule]
            if ($struct.Entities.Count -gt 0) { $lines.Add("**Entities:** $($struct.Entities -join ', ')"); $lines.Add("") }
            if ($struct.DTOs.Count -gt 0) { $lines.Add("**DTOs:** $($struct.DTOs -join ', ')"); $lines.Add("") }
            if ($struct.Services.Count -gt 0) { $lines.Add("**Services:** $($struct.Services -join ', ')"); $lines.Add("") }
            if ($struct.EndPoints.Count -gt 0) { $lines.Add("**EndPoints:** $($struct.EndPoints -join ', ')"); $lines.Add("") }
            if ($struct.SubServices.Count -gt 0) { $lines.Add("**SubServices:** $($struct.SubServices -join ', ')"); $lines.Add("") }
            if ($struct.Helpers.Count -gt 0) { $lines.Add("**Helpers:** $($struct.Helpers -join ', ')"); $lines.Add("") }
            if ($struct.Mappings.Count -gt 0) { $lines.Add("**Mappings:** $($struct.Mappings -join ', ')"); $lines.Add("") }
            if ($struct.Persistence.Count -gt 0) { $lines.Add("**Persistence:** $($struct.Persistence -join ', ')"); $lines.Add("") }
            if ($struct.Other.Count -gt 0) { $lines.Add("**Other:** $($struct.Other -join ', ')"); $lines.Add("") }
        }
    }
    
    $lines.Add("## Frontend - Archivos por Submodulo")
    $lines.Add("")
    foreach ($module in ($FrontendData.Keys | Sort-Object)) {
        foreach ($submodule in ($FrontendData[$module].Keys | Sort-Object)) {
            $lines.Add("### $module/$submodule")
            $lines.Add("")
            $struct = $FrontendData[$module][$submodule]
            if ($struct.Components.Count -gt 0) { $lines.Add("**Components:** $($struct.Components -join ', ')"); $lines.Add("") }
            if ($struct.Desktop.Count -gt 0) { $lines.Add("**Desktop:** $($struct.Desktop -join ', ')"); $lines.Add("") }
            if ($struct.Mobile.Count -gt 0) { $lines.Add("**Mobile:** $($struct.Mobile -join ', ')"); $lines.Add("") }
            if ($struct.Interfaces.Count -gt 0) { $lines.Add("**Interfaces:** $($struct.Interfaces -join ', ')"); $lines.Add("") }
            if ($struct.Services.Count -gt 0) { $lines.Add("**Services:** $($struct.Services -join ', ')"); $lines.Add("") }
            if ($struct.SubServices.Count -gt 0) { $lines.Add("**SubServices:** $($struct.SubServices -join ', ')"); $lines.Add("") }
            if ($struct.Helpers.Count -gt 0) { $lines.Add("**Helpers:** $($struct.Helpers -join ', ')"); $lines.Add("") }
            if ($struct.Pipes.Count -gt 0) { $lines.Add("**Pipes:** $($struct.Pipes -join ', ')"); $lines.Add("") }
            if ($struct.Other.Count -gt 0) { $lines.Add("**Other:** $($struct.Other -join ', ')"); $lines.Add("") }
        }
    }
    
    # Recommendations
    $lines.Add("## Recomendaciones")
    $lines.Add("")
    $totalViolations = $BackendViolations.Count + $FrontendViolations.Count
    if ($totalViolations -eq 0) {
        $lines.Add("✅ La estructura cumple con la regla de submódulos únicos por módulo.")
    } else {
        $lines.Add("Se detectaron $totalViolations violaciones de la regla 2.2.")
        $lines.Add("")
        $lines.Add("### Acciones correctivas sugeridas")
        $lines.Add("")
        $lines.Add("1. **Renombrar submódulos duplicados:** Cada submódulo debe tener un nombre único dentro de su módulo padre.")
        $lines.Add("2. **Actualizar namespaces:** Los namespaces deben reflejar la nueva ruta física.")
        $lines.Add("3. **Actualizar imports:** Revisar todos los imports en el código afectado.")
        $lines.Add("4. **Actualizar rutas frontend:** Verificar rutas de módulos y componentes.")
        $lines.Add("5. **Actualizar documentación:** Reflejar los cambios en README.md y documentación del módulo.")
    }
    $lines.Add("")
    
    $lines.Add("---")
    $lines.Add("*Generado automaticamente por auditoria de submódulos*")
    
    $report = $lines -join "`n"
    $folder = Split-Path -Path $OutputPath -Parent
    if (-not (Test-Path $folder)) { New-Item -Path $folder -ItemType Directory -Force | Out-Null }
    [System.IO.File]::WriteAllText($OutputPath, $report, [System.Text.Encoding]::UTF8)
    return $OutputPath
}

Write-Host "🔍 Escaneando estructura Backend..." -ForegroundColor Cyan
$backendData = Get-BackendStructure -Root $BackendRoot
Write-Host "   Encontrados $($backendData.Count) modulos" -ForegroundColor Green

Write-Host "🔍 Escaneando estructura Frontend..." -ForegroundColor Cyan
$frontendData = Get-FrontendStructure -Root $FrontendRoot
Write-Host "   Encontrados $($frontendData.Count) modulos" -ForegroundColor Green

Write-Host "🔎 Buscando violaciones en Backend..." -ForegroundColor Yellow
$backendViolations = Find-Violations -Data $backendData
Write-Host "   Encontradas $($backendViolations.Count) violaciones" -ForegroundColor Green

Write-Host "🔎 Buscando violaciones en Frontend..." -ForegroundColor Yellow
$frontendViolations = Find-Violations -Data $frontendData
Write-Host "   Encontradas $($frontendViolations.Count) violaciones" -ForegroundColor Green

Write-Host "📝 Generando reporte Markdown..." -ForegroundColor Cyan
$reportPath = New-MarkdownReport -BackendData $backendData -FrontendData $frontendData `
    -BackendViolations $backendViolations -FrontendViolations $frontendViolations `
    -OutputPath $OutputPath

Write-Host "✅ Reporte generado en: $reportPath" -ForegroundColor Green
Write-Host ""

if ($backendViolations.Count -gt 0 -or $frontendViolations.Count -gt 0) {
    Write-Host "⚠️  VIOLACIONES DETECTADAS:" -ForegroundColor Red
    if ($backendViolations.Count -gt 0) {
        Write-Host "   Backend:" -ForegroundColor Yellow
        foreach ($v in $backendViolations.Keys) { Write-Host "   - $v : $($backendViolations[$v] -join ', ')" -ForegroundColor Yellow }
    }
    if ($frontendViolations.Count -gt 0) {
        Write-Host "   Frontend:" -ForegroundColor Yellow
        foreach ($v in $frontendViolations.Keys) { Write-Host "   - $v : $($frontendViolations[$v] -join ', ')" -ForegroundColor Yellow }
    }
} else {
    Write-Host "✅ No se detectaron violaciones. La estructura cumple con la regla." -ForegroundColor Green
}
