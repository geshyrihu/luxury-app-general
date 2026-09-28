<#
.SYNOPSIS
Lee el contenido del Excel de matriz de submodulos y muestra un resumen en consola.
#>

param(
    [string]$ExcelPath = "D:\repos\luxuryapp-api\auditorias\matriz-validacion-submodulos-v2.xlsx"
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path $ExcelPath)) {
    Write-Host "Archivo no encontrado: $ExcelPath" -ForegroundColor Red
    exit 1
}

Write-Host "Leyendo Excel: $ExcelPath" -ForegroundColor Cyan
Write-Host ""

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

$workbook = $excel.Workbooks.Open($ExcelPath)
$worksheet = $workbook.Worksheets.Item(1)

$usedRange = $worksheet.UsedRange
$maxRow = $usedRange.Rows.Count
$maxCol = $usedRange.Columns.Count

Write-Host "Dimensiones: $maxRow filas x $maxCol columnas" -ForegroundColor Gray
Write-Host ""

# Read headers
$headers = @()
for ($col = 1; $col -le $maxCol; $col++) {
    $headers += $worksheet.Cells.Item(1, $col).Text
}

Write-Host "Columnas:"
$headers | ForEach-Object { Write-Host "  $_" -ForegroundColor Yellow }
Write-Host ""

# Read all data
$data = @()
for ($row = 2; $row -le $maxRow; $row++) {
    $rowData = @{}
    for ($col = 1; $col -le $maxCol; $col++) {
        $header = $headers[$col - 1]
        $value = $worksheet.Cells.Item($row, $col).Text
        $rowData[$header] = $value
    }
    $data += $rowData
}

$workbook.Close($false)
$excel.Quit()
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($worksheet) | Out-Null
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($workbook) | Out-Null
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($excel) | Out-Null

Write-Host "Datos leidos: $($data.Count) filas" -ForegroundColor Green
Write-Host ""

# Analyze
$principalCount = ($data | Where-Object { $_."Tipo" -eq "Principal" }).Count
$internoCount = ($data | Where-Object { $_."Tipo" -eq "Interno" }).Count
$tecnicoCount = ($data | Where-Object { $_."Tipo" -eq "Tecnico" }).Count

Write-Host "=== RESUMEN ===" -ForegroundColor Cyan
Write-Host "Principal: $principalCount"
Write-Host "Interno: $internoCount"
Write-Host "Tecnico: $tecnicoCount"
Write-Host ""

# Show first 20 Principal submodules
Write-Host "=== PRIMEROS 20 SUBMODULOS PRINCIPALES ===" -ForegroundColor Yellow
$data | Where-Object { $_."Tipo" -eq "Principal" } | Select-Object -First 20 | ForEach-Object {
    $locations = @()
    foreach ($header in $headers) {
        if ($header -ne "Submodulo" -and $header -ne "Tipo" -and $header -ne "Nivel" -and $_.$header -eq "SI") {
            $locations += $header
        }
    }
    $locStr = if ($locations.Count -gt 0) { $locations -join ", " } else { "SIN UBICACION" }
    $line = $_.Submodulo + " [" + $_.Nivel + "] -> " + $locStr
    Write-Host $line -ForegroundColor White
}
Write-Host ""

# Show first 20 Interno submodules
Write-Host "=== PRIMEROS 20 SUBMODULOS INTERNOS ===" -ForegroundColor Yellow
$data | Where-Object { $_."Tipo" -eq "Interno" } | Select-Object -First 20 | ForEach-Object {
    $locations = @()
    foreach ($header in $headers) {
        if ($header -ne "Submodulo" -and $header -ne "Tipo" -and $header -ne "Nivel" -and $_.$header -eq "SI") {
            $locations += $header
        }
    }
    $locStr = if ($locations.Count -gt 0) { $locations -join ", " } else { "SIN UBICACION" }
    $line = $_.Submodulo + " [" + $_.Nivel + "] -> " + $locStr
    Write-Host $line -ForegroundColor White
}
Write-Host ""

# Show modules with most submodules
Write-Host "=== MODULOS CON MAS SUBMODULOS ===" -ForegroundColor Cyan
$modulesWithCounts = @{}
foreach ($header in $headers) {
    if ($header -ne "Submodulo" -and $header -ne "Tipo" -and $header -ne "Nivel") {
        $count = ($data | Where-Object { $_.$header -eq "SI" }).Count
        $modulesWithCounts[$header] = $count
    }
}

$modulesWithCounts.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First 10 | ForEach-Object {
    Write-Host "$($_.Key): $($_.Value) submodulos"
}

Write-Host ""
Write-Host "=== LISTADO COMPLETO DE SUBMODULOS PRINCIPALES ===" -ForegroundColor Cyan
$data | Where-Object { $_."Tipo" -eq "Principal" } | ForEach-Object {
    $locations = @()
    foreach ($header in $headers) {
        if ($header -ne "Submodulo" -and $header -ne "Tipo" -and $header -ne "Nivel" -and $_.$header -eq "SI") {
            $locations += $header
        }
    }
    $locStr = if ($locations.Count -gt 0) { $locations -join ", " } else { "SIN UBICACION" }
    $line = $_.Submodulo + " [" + $_.Nivel + "] -> " + $locStr
    Write-Host $line -ForegroundColor White
}
