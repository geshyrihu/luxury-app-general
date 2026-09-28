$ErrorActionPreference = 'Stop'
$root = (Resolve-Path 'api').Path
$map = [ordered]@{
  'MachineryFichaTecnicaDTO' = 'MachineryTechnicalSheetDTO'
  'RecepcionPipaAguaAddDTO' = 'CreateWaterTruckDeliveryDTO'
  'RecepcionPipaAguaUpdateDTO' = 'UpdateWaterTruckDeliveryDTO'
  'RecepcionPipaAguaDTO' = 'WaterTruckDeliveryDTO'
}
$fileMap = [ordered]@{
  'api/LuxuryApp.Application/Modules/MantenimientoLuxuryApp/Medidores/DTOs/MedidorLecturaCharDTO.cs' = 'api/LuxuryApp.Application/Modules/MantenimientoLuxuryApp/Medidores/DTOs/MeterReadingChartDTO.cs'
  'api/LuxuryApp.Application/Modules/MantenimientoLuxuryApp/Medidores/DTOs/MedidorLecturaCharMonthDTO.cs' = 'api/LuxuryApp.Application/Modules/MantenimientoLuxuryApp/Medidores/DTOs/MonthlyMeterReadingChartDTO.cs'
  'api/LuxuryApp.Application/Modules/MantenimientoLuxuryApp/Medidores/DTOs/MedidorLecturaExcelDTO.cs' = 'api/LuxuryApp.Application/Modules/MantenimientoLuxuryApp/Medidores/DTOs/MeterReadingExcelDTO.cs'
  'api/LuxuryApp.Application/Modules/MantenimientoLuxuryApp/Machinery/DTOs/ControlPrestamoHerramientaListDTO.cs' = 'api/LuxuryApp.Application/Modules/MantenimientoLuxuryApp/Machinery/DTOs/ToolLoanListDTO.cs'
  'api/LuxuryApp.Application/Modules/MantenimientoLuxuryApp/Machinery/DTOs/ControlPrestamoHerramientaPagedListDTO.cs' = 'api/LuxuryApp.Application/Modules/MantenimientoLuxuryApp/Machinery/DTOs/ToolLoanPagedListDTO.cs'
  'api/LuxuryApp.Application/Modules/MantenimientoLuxuryApp/MachineryAsset/DTOs/MachineryFichaTecnicaDTO.cs' = 'api/LuxuryApp.Application/Modules/MantenimientoLuxuryApp/MachineryAsset/DTOs/MachineryTechnicalSheetDTO.cs'
  'api/LuxuryApp.Application/Modules/MantenimientoLuxuryApp/RecepcionPipasAgua/DTOs/RecepcionPipaAguaAddDTO.cs' = 'api/LuxuryApp.Application/Modules/MantenimientoLuxuryApp/RecepcionPipasAgua/DTOs/CreateWaterTruckDeliveryDTO.cs'
  'api/LuxuryApp.Application/Modules/MantenimientoLuxuryApp/RecepcionPipasAgua/DTOs/RecepcionPipaAguaUpdateDTO.cs' = 'api/LuxuryApp.Application/Modules/MantenimientoLuxuryApp/RecepcionPipasAgua/DTOs/UpdateWaterTruckDeliveryDTO.cs'
  'api/LuxuryApp.Application/Modules/MantenimientoLuxuryApp/RecepcionPipasAgua/DTOs/RecepcionPipaAguaDTO.cs' = 'api/LuxuryApp.Application/Modules/MantenimientoLuxuryApp/RecepcionPipasAgua/DTOs/WaterTruckDeliveryDTO.cs'
}
$files = Get-ChildItem $root -Recurse -Filter '*.cs'
foreach ($file in $files) {
  $content = [IO.File]::ReadAllText($file.FullName)
  $updated = $content
  foreach ($pair in $map.GetEnumerator()) { $updated = $updated.Replace($pair.Key, $pair.Value) }
  if ($updated -ne $content) { [IO.File]::WriteAllText($file.FullName, $updated, [Text.UTF8Encoding]::new($false)) }
}
foreach ($pair in $fileMap.GetEnumerator()) {
  $old = Join-Path (Get-Location) $pair.Key
  $new = Join-Path (Get-Location) $pair.Value
  if (Test-Path -LiteralPath $old) { Move-Item -LiteralPath $old -Destination $new }
}
