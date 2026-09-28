$root='api/LuxuryApp.Application/Modules/MantenimientoLuxuryApp/Machinery'; $dto="$root/DTOs"
$specs=@(
 @{Old='MachineryAddOrEditDTO'; Base='Machinery'; ReadOld='MachineryDTO'; Read='MachineryDTO'},
 @{Old='EquipoClasificacionAddOrEditDTO'; Base='EquipmentClassification'; ReadOld='EquipoClasificacionDTO'; Read='EquipmentClassificationDTO'},
 @{Old='ControlPrestamoHerramientaAddOrEditDTO'; Base='ToolLoan'; ReadOld='ControlPrestamoHerramientaDTO'; Read='ToolLoanDTO'}
)
foreach($s in $specs){
 $src=Get-Content "$dto/$($s.Old).cs" -Raw
 foreach($kind in @('Create','Update')){ $name="$kind$($s.Base)DTO"; Set-Content "$dto/$name.cs" ($src.Replace($s.Old,$name)) -NoNewline }
 if($s.ReadOld -ne $s.Read){ $read=Get-Content "$dto/$($s.ReadOld).cs" -Raw; Set-Content "$dto/$($s.Read).cs" ($read.Replace($s.ReadOld,$s.Read)) -NoNewline; Remove-Item "$dto/$($s.ReadOld).cs" }
 Remove-Item "$dto/$($s.Old).cs"
}
$map=@{
 'MachineryAddOrEditDTO'='CreateMachineryDTO'; 'EquipoClasificacionAddOrEditDTO'='CreateEquipmentClassificationDTO'; 'EquipoClasificacionDTO'='EquipmentClassificationDTO';
 'ControlPrestamoHerramientaAddOrEditDTO'='CreateToolLoanDTO'; 'ControlPrestamoHerramientaDTO'='ToolLoanDTO'; 'ControlPrestamoHerramientaListDTO'='ToolLoanListDTO'; 'ControlPrestamoHerramientaPagedListDTO'='ToolLoanPagedListDTO'
}
Get-ChildItem $root -Recurse -File -Filter *.cs | ForEach-Object { $c=Get-Content $_.FullName -Raw; foreach($k in $map.Keys){$c=$c.Replace($k,$map[$k])}; Set-Content $_.FullName $c -NoNewline }
$files=Get-ChildItem $root -Recurse -File -Filter *.cs
foreach($f in $files){ $c=Get-Content $f.FullName -Raw; $c=$c.Replace('UpdateAsync(Guid id, CreateMachineryDTO','UpdateAsync(Guid id, UpdateMachineryDTO').Replace('UpdateAsync(Guid id, CreateEquipmentClassificationDTO','UpdateAsync(Guid id, UpdateEquipmentClassificationDTO').Replace('UpdateAsync(Guid id, CreateToolLoanDTO','UpdateAsync(Guid id, UpdateToolLoanDTO'); $c=$c.Replace('MapPut("{id:guid}", async (Guid id, CreateMachineryDTO','MapPut("{id:guid}", async (Guid id, UpdateMachineryDTO').Replace('MapPut("{id:guid}", async (Guid id, CreateEquipmentClassificationDTO','MapPut("{id:guid}", async (Guid id, UpdateEquipmentClassificationDTO').Replace('MapPut("{id:guid}", async (Guid id, CreateToolLoanDTO','MapPut("{id:guid}", async (Guid id, UpdateToolLoanDTO'); Set-Content $f.FullName $c -NoNewline }
