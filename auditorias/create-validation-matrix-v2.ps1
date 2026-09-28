<#
.SYNOPSIS
Genera Excel NUEVO de matriz de validacion de submodulos (no sobrescribe el anterior).
#>

param(
    [string]$BackendRoot = "D:\repos\luxuryapp-api\api\LuxuryApp.Application\Modules",
    [string]$OutputPath = "D:\repos\luxuryapp-api\auditorias\matriz-validacion-submodulos-v2.xlsx"
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

function Get-SubmoduleType {
    param([string]$Name)
    
    if ($Name -match '^(Persistence|Shared|SharedLuxuryApp|DTOs|Dto|Services|EndPoints|Endpoints|Interfaces|Helpers|SubServices|Mappings|Mapping|Entities|Common|Docs|Responses|Integrations|Events|Handlers|ViewModels|AgendaSemanal|ContratosLegal|PersonalAusente|ReclutamientoResumen|TareasLegal|HRIncident|HRIncidentReport|HrSanction|IncidentType|SanctionType|Asamblea|Backfill|Minuta|Notifications|Presentacion|Session|Supervision|SupervisionReport|TaskAttachment|TaskChecklist|TaskFollowUp|TaskJustification|TaskLegal|TaskMessageRead|TaskReport|Tasks|TaskWorkPlan|WorkGroup|WorkGroupCategories|WorkGroupMember|RecurringTaskAlerting|RecurringTaskCatalog|RecurringTaskCompliance|RecurringTaskEscalation|RecurringTaskGeneration|AuditEntries|Catalogs|DatabaseBackup|AiChat|AiKnowledgeBase|ElevenLabs|LogApp|UserActivityHistory|AiAssistant|Notification|ComiteVigilancia|Manuals|EmployeeBirthday|EmployeeOnboardingChecklist|EmployeeOrganigrama|Employees|AppImplementationTracking|Jobs|SignalRTest|UpdateDataBase|UserValidation|Access|CustomerAddress|CustomerDataCompany|CustomerImage|CustomerLocations|CustomerModul|Customers|ModuleApps|MeasurementUnit|GeneralCatalogs|EmailData|TelefonosEmergencia|UsoCfdi|WorkPositionSchedule|InventoryEngine|KeyInventory|LightingInventory|PaintInventory|RadioComunicacion|Tools|Operaciones|Diagramas|Flujos|Plantillas|Configuraciones|Permisos|Roles|Usuarios|Bitacoras|Reportes|Alertas|Notificaciones|Configuracion|Diagnostico|Auditoria|Sistema|Tenant|Email|Approval|Common|SelectItem|SystemAI|AuditLogs|SendEmail|Recruitment)$') {
        return "Tecnico"
    }
    
    if ($Name -match 'Candidates?$|Employees?$|WorkPositions?$|Properties?$|Owners?$|Suppliers?$|Tenants?$|Contracts?$|Invoices?$|Comite$|Directorio$|Profile$|Dashboard$|Notifications?$|Recruitment$|Solicitudes$|PurchaseOrders?$|Historial$|Presupuesto$|Fondeos$|Reports?$|Catalogs?$|Configuracion$|Seguridad$|Auth$|Identity$|Password$|Recovery$|Maintenance$|Equipment$|Fire$|Elevator$|Hydrant$|Smoke$|Tool$|Piscina$|Recepcion$|Pipas$|Calendario$|Maestro$|Equipo$|Inspection$|Log$|Inventory$|Medidores$|Machinery$|Asset$|Document$|Manual$|CallPoint$|Emergency$|ServiceOrder$|Tasks$|Supervision$|Announcement$|Panic$|AccessControl$|Custom$|Delivery$|Reception$|Property$|Occupant$|Resumen$|Scheduled$|GoogleCalendar$|Recurring$|Diagnostics$|AuditLogs$|SystemAI$|Tenant$|SendEmail$|Approvals?$|Common$|SelectItem$|Bank$|PaymentMethod$|Cfdi$|Checklist$|Template$|Address$|DataCompany$|Locations$|ModuleApp$|Calendars?$|Schedule$|Budget$|Expense$|Funding$|Accounting$|Contabilidad$|Aspel$|Espejo$|Financial$|Projected$|GeneralLedger$|Ar$|Budgeting$|FondeosYReporteo$|Mock$|Provider$|Qualification$|Purchase$|Pr$|Po$|Customer$|Product$|ProviderSupport$|Legal$|Insurance$|Committee$|Board$|Director$|Meeting$|Minutes$|Monthly$|FinancialReport$|Library$|Home$|ProfileUsers$|AccountRecovery$|RecoveryCode$|RecoveryPassword$|ResetPassword$|UserProfile$|Chekador$|Evaluacion$|ManualsAndProcesses$|Nomina$|TimeOff$|Public$|EmergencyPhone$|OwnerProperty$|PropertyOwner$|Resident$|Web$|AccountingWeb$|HrWeb$|Landing$|LegalWeb$|MaintenanceWeb$|OperationsWeb$') {
        return "Principal"
    }
    
    return "Interno"
}

$allSubmodules = @{}

foreach ($module in $modules) {
    $modulePath = Join-Path $BackendRoot $module
    if (-not (Test-Path $modulePath)) { continue }
    
    $level1Dirs = Get-ChildItem -Path $modulePath -Directory | Where-Object { $_.Name -ne 'Docs' }
    
    foreach ($sub1 in $level1Dirs) {
        $sub1Name = $sub1.Name
        $sub1Type = Get-SubmoduleType -Name $sub1Name
        
        if (-not $allSubmodules.ContainsKey($sub1Name)) {
            $allSubmodules[$sub1Name] = @{
                Locations = @{}
                Type = $sub1Type
                Level = 1
            }
        }
        $allSubmodules[$sub1Name].Locations[$module] = $true
        
        $level2Dirs = Get-ChildItem -Path $sub1.FullName -Directory | Where-Object { $_.Name -ne 'Docs' }
        foreach ($sub2 in $level2Dirs) {
            $sub2Name = $sub2.Name
            $sub2Type = Get-SubmoduleType -Name $sub2Name
            
            if (-not $allSubmodules.ContainsKey($sub2Name)) {
                $allSubmodules[$sub2Name] = @{
                    Locations = @{}
                    Type = $sub2Type
                    Level = 2
                }
            }
            $allSubmodules[$sub2Name].Locations[$module] = $true
        }
    }
}

$domainSubmodules = $allSubmodules.GetEnumerator() | Where-Object { $_.Value.Type -ne "Tecnico" } | Sort-Object { $_.Key }

Write-Host "Creating Excel with $($domainSubmodules.Count) domain submodules..." -ForegroundColor Cyan
Write-Host "   Level 1: $($domainSubmodules | Where-Object { $_.Value.Level -eq 1 } | Measure-Object | Select-Object -ExpandProperty Count)" -ForegroundColor Gray
Write-Host "   Level 2: $($domainSubmodules | Where-Object { $_.Value.Level -eq 2 } | Measure-Object | Select-Object -ExpandProperty Count)" -ForegroundColor Gray

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

$workbook = $excel.Workbooks.Add()
$worksheet = $workbook.Worksheets.Item(1)
$worksheet.Name = "Matriz Submodulos"

# Headers
$worksheet.Cells.Item(1, 1) = "Submodulo"
$worksheet.Cells.Item(1, 2) = "Tipo"
$worksheet.Cells.Item(1, 3) = "Nivel"
for ($i = 0; $i -lt $modules.Count; $i++) {
    $worksheet.Cells.Item(1, ($i + 4)) = $modules[$i]
}

$lastCol = $modules.Count + 3
$headerRange = $worksheet.Range($worksheet.Cells.Item(1, 1), $worksheet.Cells.Item(1, $lastCol))
$headerRange.Font.Bold = $true
$headerRange.Interior.Color = 4479834
$headerRange.Font.Color = 16777215

# Data rows
$row = 2
foreach ($entry in $domainSubmodules) {
    $sub = $entry.Key
    $data = $entry.Value
    
    $worksheet.Cells.Item($row, 1) = $sub
    $worksheet.Cells.Item($row, 2) = $data.Type
    $worksheet.Cells.Item($row, 3) = $data.Level
    
    $locations = $data.Locations
    for ($i = 0; $i -lt $modules.Count; $i++) {
        $module = $modules[$i]
        if ($locations.ContainsKey($module)) {
            $worksheet.Cells.Item($row, ($i + 4)) = "SI"
            $worksheet.Cells.Item($row, ($i + 4)).Interior.Color = 13561777
        } else {
            $worksheet.Cells.Item($row, ($i + 4)) = ""
        }
    }
    $row++
}

$usedRange = $worksheet.UsedRange
$usedRange.Columns.AutoFit() | Out-Null

$worksheet.Range("D2").Select() | Out-Null
$excel.ActiveWindow.FreezePanes = $true

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

Write-Host "`n✅ Excel generado en: $OutputPath" -ForegroundColor Green
Write-Host "   Total filas: $($domainSubmodules.Count) submodulos de dominio" -ForegroundColor Cyan
Write-Host "   Columnas: 14 modulos + Tipo + Nivel" -ForegroundColor Cyan
Write-Host "`n   Nivel 1 = submódulo directo del módulo" -ForegroundColor Gray
Write-Host "   Nivel 2 = submódulo interno anidado" -ForegroundColor Gray
Write-Host "   Tipo = Principal/Interno (Tecnico excluido del Excel)" -ForegroundColor Gray
