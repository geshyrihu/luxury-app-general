<#
.SYNOPSIS
Genera Excel de matriz de validacion de submodulos.
#>

param(
    [string]$BackendRoot = "D:\repos\luxuryapp-api\api\LuxuryApp.Application\Modules",
    [string]$OutputPath = "D:\repos\luxuryapp-api\auditorias\matriz-validacion-submodulos.xlsx"
)

$ErrorActionPreference = 'Stop'

$modules = @(
    'AdminLuxuryApp',
    'AuthLuxuryApp',
    'CobranzaLuxuryApp',
    'CommitteeLuxuryApp',
    'ComprasLuxuryApp',
    'ContabilidadLuxuryApp',
    'DireccionLuxuryApp',
    'LegalLuxuryApp',
    'MantenimientoLuxuryApp',
    'OperationsLuxuryApp',
    'ReclutamientoLuxuryApp',
    'RecursosHumanosLuxuryApp',
    'SupplierLuxuryApp',
    'SystemLuxuryApp'
)

# Collect submodules per module
$moduleSubmodules = @{}
foreach ($module in $modules) {
    $modulePath = Join-Path $BackendRoot $module
    if (Test-Path $modulePath) {
        $subdirs = Get-ChildItem -Path $modulePath -Directory | Where-Object { $_.Name -ne 'Docs' } | Select-Object -ExpandProperty Name
        $moduleSubmodules[$module] = @($subdirs)
    } else {
        $moduleSubmodules[$module] = @()
    }
}

# Build unique submodule list with current locations
$submoduleMap = @{}
foreach ($module in $modules) {
    foreach ($sub in $moduleSubmodules[$module]) {
        if (-not $submoduleMap.ContainsKey($sub)) {
            $submoduleMap[$sub] = @()
        }
        $submoduleMap[$sub] += $module
    }
}

$submodules = $submoduleMap.Keys | Sort-Object

Write-Host "Creating Excel with $($submodules.Count) submodules..."

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

$workbook = $excel.Workbooks.Add()
$worksheet = $workbook.Worksheets.Item(1)
$worksheet.Name = "Matriz Submodulos"

# Headers
$worksheet.Cells.Item(1, 1) = "Submodulo"
$worksheet.Cells.Item(1, 2) = "Tipo"
for ($i = 0; $i -lt $modules.Count; $i++) {
    $worksheet.Cells.Item(1, ($i + 3)) = $modules[$i]
}

# Format headers
$lastCol = $modules.Count + 2
$headerRange = $worksheet.Range($worksheet.Cells.Item(1, 1), $worksheet.Cells.Item(1, $lastCol))
$headerRange.Font.Bold = $true
$headerRange.Interior.Color = 4479834
$headerRange.Font.Color = 16777215

# Data rows
$row = 2
$principalPatterns = @('Candidates','Employees','WorkPosition','Banks','PaymentMethod','Properties','Owners','Suppliers','Tenants','Contracts','Invoices','Comite','Directorio','Profile','Dashboard','Notifications','Recruitment','Solicitudes','PurchaseOrders','Historial','Presupuesto','Fondeos','Reports','Catalogs','Configuracion','Seguridad','Auth','Identity','Password','Recovery','Maintenance','Equipment','Fire','Elevator','Hydrant','Smoke','Tool','Piscina','Recepcion','Pipas','Calendario','Maestro','Equipo','Inspection','Log','Inventory','Medidores','Machinery','Asset','Document','Manual','CallPoint','Emergency','ServiceOrder','Tasks','Supervision','Announcement','Panic','AccessControl','Custom','Delivery','Reception','Owner','Property','Occupant','Resumen','Scheduled','GoogleCalendar','Recurring','Diagnostics','AuditLogs','SystemAI','Tenant','SendEmail','Approvals','Common','SelectItem')

foreach ($sub in $submodules) {
    $worksheet.Cells.Item($row, 1) = $sub
    
    $type = "Interno"
    if ($sub -match 'Persistence|Shared|DTOs|Services|EndPoints|Interfaces|Helpers|SubServices|Mappings|Common|Docs') {
        $type = "Tecnico"
    } else {
        foreach ($p in $principalPatterns) {
            if ($sub -like "*$p*") {
                $type = "Principal"
                break
            }
        }
    }
    $worksheet.Cells.Item($row, 2) = $type
    
    $locations = $submoduleMap[$sub]
    for ($i = 0; $i -lt $modules.Count; $i++) {
        $module = $modules[$i]
        if ($locations -contains $module) {
            $worksheet.Cells.Item($row, ($i + 3)) = "SI"
            $worksheet.Cells.Item($row, ($i + 3)).Interior.Color = 13561777
        } else {
            $worksheet.Cells.Item($row, ($i + 3)) = ""
        }
    }
    $row++
}

# Auto-fit columns
$usedRange = $worksheet.UsedRange
$usedRange.Columns.AutoFit() | Out-Null

# Freeze panes
$worksheet.Range("C2").Select() | Out-Null
$excel.ActiveWindow.FreezePanes = $true

# Save
$folder = Split-Path -Path $OutputPath -Parent
if (-not (Test-Path $folder)) {
    New-Item -Path $folder -ItemType Directory -Force | Out-Null
}

$workbook.SaveAs($OutputPath, 51)
$workbook.Close()
$excel.Quit()

[System.Runtime.InteropServices.Marshal]::ReleaseComObject($worksheet) | Out-Null
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($workbook) | Out-Null
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($excel) | Out-Null

Write-Host "✅ Excel generado en: $OutputPath" -ForegroundColor Green
Write-Host "   Filas: $($submodules.Count) submodulos" -ForegroundColor Cyan
Write-Host "   Columnas: 14 modulos" -ForegroundColor Cyan
