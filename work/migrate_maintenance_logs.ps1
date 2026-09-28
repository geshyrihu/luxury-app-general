$root='api/LuxuryApp.Application/Modules/MantenimientoLuxuryApp/MaintenanceLogs'; $dto="$root/DTOs"
$src=Get-Content "$dto/BitacoraMantenimientoAddOrEditDTO.cs" -Raw
Set-Content "$dto/CreateMaintenanceLogDTO.cs" ($src.Replace('BitacoraMantenimientoAddOrEditDTO','CreateMaintenanceLogDTO')) -NoNewline
Set-Content "$dto/UpdateMaintenanceLogDTO.cs" ($src.Replace('BitacoraMantenimientoAddOrEditDTO','UpdateMaintenanceLogDTO')) -NoNewline
$read=Get-Content "$dto/BitacoraMantenimientoDTO.cs" -Raw; Set-Content "$dto/MaintenanceLogDTO.cs" ($read.Replace('BitacoraMantenimientoDTO','MaintenanceLogDTO')) -NoNewline
$dash=Get-Content "$dto/BitacoraMantenimientoDashboardDTO.cs" -Raw; Set-Content "$dto/MaintenanceLogDashboardDTO.cs" ($dash.Replace('BitacoraMantenimientoDashboardDTO','MaintenanceLogDashboardDTO')) -NoNewline
Remove-Item "$dto/BitacoraMantenimientoAddOrEditDTO.cs","$dto/BitacoraMantenimientoDTO.cs","$dto/BitacoraMantenimientoDashboardDTO.cs"
$map=@{'BitacoraMantenimientoAddOrEditDTO'='CreateMaintenanceLogDTO';'BitacoraMantenimientoDTO'='MaintenanceLogDTO';'BitacoraMantenimientoDashboardDTO'='MaintenanceLogDashboardDTO'}
Get-ChildItem $root -Recurse -File -Filter *.cs | ForEach-Object {$c=Get-Content $_.FullName -Raw; foreach($k in $map.Keys){$c=$c.Replace($k,$map[$k])}; Set-Content $_.FullName $c -NoNewline}
