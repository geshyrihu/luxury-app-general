$root='api/LuxuryApp.Application/Modules/MantenimientoLuxuryApp/HydrantLog'; $dto="$root/DTOs"
$src=Get-Content "$dto/BitacoraHidranteAddOrEditDTO.cs" -Raw
Set-Content "$dto/CreateFireHydrantLogDTO.cs" ($src.Replace('BitacoraHidranteAddOrEditDTO','CreateFireHydrantLogDTO')) -NoNewline
Set-Content "$dto/UpdateFireHydrantLogDTO.cs" ($src.Replace('BitacoraHidranteAddOrEditDTO','UpdateFireHydrantLogDTO')) -NoNewline
$read=Get-Content "$dto/BitacoraHidranteDTO.cs" -Raw
Set-Content "$dto/FireHydrantLogDTO.cs" ($read.Replace('BitacoraHidranteDTO','FireHydrantLogDTO')) -NoNewline
Remove-Item "$dto/BitacoraHidranteAddOrEditDTO.cs","$dto/BitacoraHidranteDTO.cs"
$repl=@{'BitacoraHidranteAddOrEditDTO'='CreateFireHydrantLogDTO';'BitacoraHidranteDTO'='FireHydrantLogDTO'}
Get-ChildItem $root -Recurse -File -Filter *.cs | ForEach-Object { $c=Get-Content $_.FullName -Raw; foreach($k in $repl.Keys){$c=$c.Replace($k,$repl[$k])}; Set-Content $_.FullName $c -NoNewline }
$s="$root/Services/BitacoraHidranteAppService.cs"; $c=Get-Content $s -Raw; $c=$c.Replace('ApiResponseDTO<CreateFireHydrantLogDTO>> GetByIdAsync','ApiResponseDTO<UpdateFireHydrantLogDTO>> GetByIdAsync').Replace('ApiResponseDTO<CreateFireHydrantLogDTO>>.ErrorResult','ApiResponseDTO<UpdateFireHydrantLogDTO>>.ErrorResult').Replace('new CreateFireHydrantLogDTO','new UpdateFireHydrantLogDTO'); Set-Content $s $c -NoNewline
$s="$root/Interfaces/IBitacoraHidranteAppService.cs"; $c=Get-Content $s -Raw; $c=$c.Replace('ApiResponseDTO<CreateFireHydrantLogDTO>> GetByIdAsync','ApiResponseDTO<UpdateFireHydrantLogDTO>> GetByIdAsync'); Set-Content $s $c -NoNewline
