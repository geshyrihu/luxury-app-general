$root='api/LuxuryApp.Application/Modules/MantenimientoLuxuryApp/MaintenanceCalendars'; $dto="$root/DTOs"
$src=Get-Content "$dto/MaintenanceCalendarAddOrEditDTO.cs" -Raw
Set-Content "$dto/CreateMaintenanceCalendarDTO.cs" ($src.Replace('MaintenanceCalendarAddOrEditDTO','CreateMaintenanceCalendarDTO')) -NoNewline
Set-Content "$dto/UpdateMaintenanceCalendarDTO.cs" ($src.Replace('MaintenanceCalendarAddOrEditDTO','UpdateMaintenanceCalendarDTO')) -NoNewline
Remove-Item "$dto/MaintenanceCalendarAddOrEditDTO.cs"
$files=Get-ChildItem $root -Recurse -File -Filter *.cs
foreach($f in $files){$c=Get-Content $f.FullName -Raw; $c=$c.Replace('MaintenanceCalendarAddOrEditDTO','CreateMaintenanceCalendarDTO').Replace('MapPut("{id:guid}", async (Guid id, CreateMaintenanceCalendarDTO','MapPut("{id:guid}", async (Guid id, UpdateMaintenanceCalendarDTO').Replace('UpdateAsync(Guid id, CreateMaintenanceCalendarDTO','UpdateAsync(Guid id, UpdateMaintenanceCalendarDTO'); Set-Content $f.FullName $c -NoNewline}
