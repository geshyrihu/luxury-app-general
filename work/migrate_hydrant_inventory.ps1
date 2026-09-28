$root='api/LuxuryApp.Application/Modules/MantenimientoLuxuryApp/HydrantInventory'; $dto="$root/DTOs"
$src=Get-Content "$dto/InventarioHidranteAddOrEditDTO.cs" -Raw
Set-Content "$dto/CreateFireHydrantDTO.cs" ($src.Replace('InventarioHidranteAddOrEditDTO','CreateFireHydrantDTO')) -NoNewline
Set-Content "$dto/UpdateFireHydrantDTO.cs" ($src.Replace('InventarioHidranteAddOrEditDTO','UpdateFireHydrantDTO')) -NoNewline
$read=Get-Content "$dto/InventarioHidranteDTO.cs" -Raw
Set-Content "$dto/FireHydrantDTO.cs" ($read.Replace('InventarioHidranteDTO','FireHydrantDTO')) -NoNewline
Remove-Item "$dto/InventarioHidranteAddOrEditDTO.cs","$dto/InventarioHidranteDTO.cs"
$repl=@{'InventarioHidranteAddOrEditDTO'='CreateFireHydrantDTO';'InventarioHidranteDTO'='FireHydrantDTO'}
Get-ChildItem $root -Recurse -File -Filter *.cs | ForEach-Object { $c=Get-Content $_.FullName -Raw; foreach($k in $repl.Keys){$c=$c.Replace($k,$repl[$k])}; Set-Content $_.FullName $c -NoNewline }
$s="$root/Services/InventarioHidranteAppService.cs"; $c=Get-Content $s -Raw
$c=$c.Replace('ApiResponseDTO<CreateFireHydrantDTO>> GetByIdAsync','ApiResponseDTO<UpdateFireHydrantDTO>> GetByIdAsync').Replace('ApiResponseDTO<CreateFireHydrantDTO>>.ErrorResult','ApiResponseDTO<UpdateFireHydrantDTO>>.ErrorResult').Replace('new CreateFireHydrantDTO','new UpdateFireHydrantDTO').Replace('UpdateAsync(Guid id, CreateFireHydrantDTO','UpdateAsync(Guid id, UpdateFireHydrantDTO'); Set-Content $s $c -NoNewline
$s="$root/Interfaces/IInventarioHidranteAppService.cs"; $c=Get-Content $s -Raw; $c=$c.Replace('ApiResponseDTO<CreateFireHydrantDTO>> GetByIdAsync','ApiResponseDTO<UpdateFireHydrantDTO>> GetByIdAsync').Replace('UpdateAsync(Guid id, CreateFireHydrantDTO','UpdateAsync(Guid id, UpdateFireHydrantDTO'); Set-Content $s $c -NoNewline
$s="$root/EndPoints/InventarioHidranteEndpoints.cs"; if(Test-Path $s){$c=Get-Content $s -Raw; $c=$c.Replace('MapPut("{id:guid}", async (Guid id, CreateFireHydrantDTO','MapPut("{id:guid}", async (Guid id, UpdateFireHydrantDTO'); Set-Content $s $c -NoNewline}
