$ErrorActionPreference = 'Stop'
$module = 'api/LuxuryApp.Application/Modules/RecursosHumanosLuxuryApp/ManualsAndProcesses'
$dto = Join-Path $module 'DTOs'
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
$sources = @('ManualPasoDTO.cs','ManualPasoEnlaceDTO.cs')
$records = @{}
foreach ($name in $sources) {
  $file = Join-Path $dto $name
  $content = [IO.File]::ReadAllText($file)
  $matches = [regex]::Matches($content, '(?ms)^public record .*?(?=^public record |\z)')
  foreach ($match in $matches) {
    $record = $match.Value.Trim()
    $decl = [regex]::Match($record, '^public record (?<name>\w+DTO)')
    if (!$decl.Success) { throw "No se pudo identificar $name" }
    $oldName = $decl.Groups['name'].Value
    $newName = $map[$oldName]
    if (!$newName) { throw "Sin mapeo para $oldName" }
    $records[$newName] = "namespace RecursosHumanosLuxuryApp.ManualsAndProcesses.DTOs;`r`n`r`n$record"
  }
}
foreach ($file in (Get-ChildItem $module -Recurse -Filter '*.cs')) {
  $old = [IO.File]::ReadAllText($file.FullName); $new = $old
  foreach ($pair in ($map.GetEnumerator() | Sort-Object { $_.Key.Length } -Descending)) { $new = $new.Replace($pair.Key, $pair.Value) }
  if ($new -ne $old) { [IO.File]::WriteAllText($file.FullName, $new, [Text.UTF8Encoding]::new($false)) }
}
foreach ($pair in $records.GetEnumerator()) {
  [IO.File]::WriteAllText((Join-Path $dto ($pair.Key + '.cs')), $pair.Value, [Text.UTF8Encoding]::new($false))
}
Remove-Item (Join-Path $dto 'ManualPasoDTO.cs'), (Join-Path $dto 'ManualPasoEnlaceDTO.cs') -Force
