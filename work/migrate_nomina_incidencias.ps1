$ErrorActionPreference='Stop'
$module='api/LuxuryApp.Application/Modules/RecursosHumanosLuxuryApp/Nomina/IncidenciasNomina';$dto="$module/DTOs"
$map=[ordered]@{
 'GuardarHojaIncidenciasDTO'='CreateIncidentSheetDTO'
 'SincronizarIncidenciasDTO'='SyncPayrollIncidentsDTO'
 'IncidenciaNominaCreateDTO'='CreatePayrollIncidentDTO'
 'IncidenciaNominaDTO'='PayrollIncidentDTO'
 'HojaIncidenciasDTO'='IncidentSheetDTO'
 'EmpleadoHojaDTO'='EmployeeSheetDTO'
 'DiaColumnaDTO'='DayColumnDTO'
 'CeldaGuardarDTO'='SavedCellDTO'
 'CeldaHojaDTO'='SheetCellDTO'
}
$sources=@('GuardarHojaIncidenciasDTO.cs','IncidenciaNominaDTO.cs','HojaIncidenciasDTO.cs')
$records=@{}
foreach($name in $sources){$content=[IO.File]::ReadAllText((Join-Path $dto $name));$matches=[regex]::Matches($content,'(?ms)^public record .*?(?=^public record |\z)');foreach($m in $matches){$record=$m.Value.Trim();$decl=[regex]::Match($record,'^public record (?<name>\w+DTO)');if(!$decl.Success){throw "No se pudo identificar $name"};$old=$decl.Groups['name'].Value;$newName=$map[$old];if(!$newName){throw "Sin mapeo para $old"};foreach($p in ($map.GetEnumerator()|Sort-Object {$_.Key.Length} -Descending)){$record=$record.Replace($p.Key,$p.Value)};$records[$newName]="namespace RecursosHumanosLuxuryApp.Nomina.IncidenciasNomina.DTOs;`r`n`r`n$record"}}
foreach($file in (Get-ChildItem $module -Recurse -Filter '*.cs')){$old=[IO.File]::ReadAllText($file.FullName);$new=$old;foreach($p in ($map.GetEnumerator()|Sort-Object {$_.Key.Length} -Descending)){$new=$new.Replace($p.Key,$p.Value)};if($new-ne$old){[IO.File]::WriteAllText($file.FullName,$new,[Text.UTF8Encoding]::new($false))}}
foreach($p in $records.GetEnumerator()){[IO.File]::WriteAllText((Join-Path $dto ($p.Key+'.cs')),$p.Value,[Text.UTF8Encoding]::new($false))}
foreach($name in $sources){Remove-Item (Join-Path $dto $name) -Force}
