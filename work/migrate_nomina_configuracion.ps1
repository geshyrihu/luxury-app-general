$ErrorActionPreference = 'Stop'
$path = 'api/LuxuryApp.Application/Modules/RecursosHumanosLuxuryApp/Nomina/Configuracion'
$map = [ordered]@{
  'ConfiguracionNominaUpdateDTO' = 'UpdatePayrollConfigurationDTO'
  'ConfiguracionNominaDTO' = 'PayrollConfigurationDTO'
}
Get-ChildItem $path -Recurse -Filter '*.cs' | ForEach-Object {
  $old=[IO.File]::ReadAllText($_.FullName); $new=$old
  foreach($pair in ($map.GetEnumerator() | Sort-Object { $_.Key.Length } -Descending)){$new=$new.Replace($pair.Key,$pair.Value)}
  if($new -ne $old){[IO.File]::WriteAllText($_.FullName,$new,[Text.UTF8Encoding]::new($false))}
}
Move-Item "$path/DTOs/ConfiguracionNominaDTO.cs" "$path/DTOs/PayrollConfigurationDTO.cs"
Move-Item "$path/DTOs/ConfiguracionNominaUpdateDTO.cs" "$path/DTOs/UpdatePayrollConfigurationDTO.cs"
