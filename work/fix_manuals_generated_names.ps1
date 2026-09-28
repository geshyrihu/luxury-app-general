$ErrorActionPreference = 'Stop'
$path = 'api/LuxuryApp.Application/Modules/RecursosHumanosLuxuryApp/ManualsAndProcesses/DTOs'
$map = [ordered]@{
  'ManualTemplateDetalleDTO' = 'ManualTemplateDetailDTO'
  'ManualTemplateSimpleDTO' = 'ManualTemplateSummaryDTO'
  'ManualTemplateEditDTO' = 'UpdateManualTemplateDTO'
  'ManualTemplateAddDTO' = 'CreateManualTemplateDTO'
  'ManualPasoEnlaceAddDTO' = 'CreateManualStepLinkDTO'
  'ManualPasoEnlaceDTO' = 'ManualStepLinkDTO'
  'ManualPasoImagenDTO' = 'ManualStepImageDTO'
  'ManualPasoEditDTO' = 'UpdateManualStepDTO'
  'ManualPasoAddDTO' = 'CreateManualStepDTO'
  'ManualPasoDTO' = 'ManualStepDTO'
  'ManualAdjuntoSimpleDTO' = 'ManualAttachmentSummaryDTO'
  'ManualVersionSimpleDTO' = 'ManualVersionSummaryDTO'
  'ManualVersionAddDTO' = 'CreateManualVersionDTO'
  'ManualDiagramSimpleDTO' = 'ManualDiagramSummaryDTO'
  'ManualDiagramCreateDTO' = 'CreateManualDiagramDTO'
  'ManualDiagramUpdateDTO' = 'UpdateManualDiagramDTO'
}
foreach ($file in (Get-ChildItem $path -Filter '*.cs')) {
  $old = [IO.File]::ReadAllText($file.FullName); $new = $old
  foreach ($pair in ($map.GetEnumerator() | Sort-Object { $_.Key.Length } -Descending)) { $new = $new.Replace($pair.Key, $pair.Value) }
  if ($new -ne $old) { [IO.File]::WriteAllText($file.FullName, $new, [Text.UTF8Encoding]::new($false)) }
}
