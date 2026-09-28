$root = 'api/LuxuryApp.Application/Modules/MantenimientoLuxuryApp/FireInspectionPeriods'
$dto = "$root/DTOs"
$specs = @(
    @{ Old='FireInspectionPeriodAddOrEditDTO'; Base='FireInspectionPeriod' },
    @{ Old='FireCycleInspectionDetectorAddOrEditDTO'; Base='FireCycleInspectionDetector' },
    @{ Old='FireCycleInspectionEstacionAddOrEditDTO'; Base='FireCycleInspectionStation' },
    @{ Old='FireCycleInspectionExtintorAddOrEditDTO'; Base='FireCycleInspectionExtinguisher' },
    @{ Old='FireCycleInspectionHidranteAddOrEditDTO'; Base='FireCycleInspectionHydrant' }
)
foreach ($s in $specs) {
    $source = Get-Content "$dto/$($s.Old).cs" -Raw
    foreach ($kind in @('Create','Update')) {
        $name = "$kind$($s.Base)DTO"
        $content = $source -replace [regex]::Escape($s.Old), $name
        Set-Content "$dto/$name.cs" $content -NoNewline
    }
    Remove-Item "$dto/$($s.Old).cs"
}
$replacements = @{
    'FireInspectionPeriodAddOrEditDTO'='CreateFireInspectionPeriodDTO'
    'FireCycleInspectionDetectorAddOrEditDTO'='UpdateFireCycleInspectionDetectorDTO'
    'FireCycleInspectionEstacionAddOrEditDTO'='UpdateFireCycleInspectionStationDTO'
    'FireCycleInspectionExtintorAddOrEditDTO'='UpdateFireCycleInspectionExtinguisherDTO'
    'FireCycleInspectionHidranteAddOrEditDTO'='UpdateFireCycleInspectionHydrantDTO'
}
Get-ChildItem $root -Recurse -File -Filter *.cs | ForEach-Object {
    $path = $_.FullName
    $content = Get-Content $path -Raw
    foreach ($key in $replacements.Keys) { $content = $content.Replace($key, $replacements[$key]) }
    Set-Content $path $content -NoNewline
}
$periodService = "$root/Services/FireInspectionPeriodAppService.cs"
$content = Get-Content $periodService -Raw
$content = $content.Replace('ApiResponseDTO<CreateFireInspectionPeriodDTO>> GetByIdAsync', 'ApiResponseDTO<UpdateFireInspectionPeriodDTO>> GetByIdAsync')
$content = $content.Replace('ApiResponseDTO<CreateFireInspectionPeriodDTO>>.ErrorResult', 'ApiResponseDTO<UpdateFireInspectionPeriodDTO>>.ErrorResult')
$content = $content.Replace('new CreateFireInspectionPeriodDTO', 'new UpdateFireInspectionPeriodDTO')
$content = $content.Replace('UpdateAsync(Guid id, CreateFireInspectionPeriodDTO', 'UpdateAsync(Guid id, UpdateFireInspectionPeriodDTO')
Set-Content $periodService $content -NoNewline
$periodInterface = "$root/Interfaces/IFireInspectionPeriodAppService.cs"
$content = Get-Content $periodInterface -Raw
$content = $content.Replace('ApiResponseDTO<CreateFireInspectionPeriodDTO>> GetByIdAsync', 'ApiResponseDTO<UpdateFireInspectionPeriodDTO>> GetByIdAsync')
$content = $content.Replace('UpdateAsync(Guid id, CreateFireInspectionPeriodDTO', 'UpdateAsync(Guid id, UpdateFireInspectionPeriodDTO')
Set-Content $periodInterface $content -NoNewline
$periodEndpoint = "$root/EndPoints/FireInspectionPeriodEndPoints.cs"
$content = Get-Content $periodEndpoint -Raw
$content = $content.Replace('[FromBody] CreateFireInspectionPeriodDTO dto, IFireInspectionPeriodAppService appService) =>', '[FromBody] UpdateFireInspectionPeriodDTO dto, IFireInspectionPeriodAppService appService) =>')
$content = $content.Replace('MapPut("{id:guid}", async (Guid id, CreateFireInspectionPeriodDTO', 'MapPut("{id:guid}", async (Guid id, UpdateFireInspectionPeriodDTO')
Set-Content $periodEndpoint $content -NoNewline
