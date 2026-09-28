$root = 'D:\repos\luxuryapp-api\api\LuxuryApp.Application\Modules\MantenimientoLuxuryApp\EquipmentInspections'
function Split-DtoFile($path) {
  $text = [IO.File]::ReadAllText($path)
  $ms = [regex]::Matches($text, '(?m)^\s*public\s+record\s+\w+DTO\b')
  if ($ms.Count -le 1) { return }
  $header = $text.Substring(0, $ms[0].Index)
  for ($j=0; $j -lt $ms.Count; $j++) {
    $start=$ms[$j].Index; $open=$text.IndexOf('{',$start); $depth=0; $end=$open
    for($i=$open;$i -lt $text.Length;$i++){if($text[$i]-eq '{'){$depth++}elseif($text[$i]-eq '}'){$depth--;if($depth-eq 0){$end=$i+1;break}}}
    $block=$text.Substring($start,$end-$start); $n=[regex]::Match($block,'\brecord\s+(\w+DTO)\b').Groups[1].Value
    [IO.File]::WriteAllText((Join-Path (Split-Path $path) ($n+'.cs')),($header.TrimEnd()+"`r`n"+$block.Trim()+"`r`n"))
  }
  [IO.File]::Delete($path)
}
Split-DtoFile (Join-Path $root 'DTOs\EquipmentQrLabelDTO.cs')
Split-DtoFile (Join-Path $root 'DTOs\EquipmentInspectionDefinitionDTO.cs')
foreach($old in @('EquipmentQrLabelAddOrEditDTO','EquipmentInspectionDefinitionAddOrEditDTO')){
  $file=Join-Path $root ('DTOs\'+$old+'.cs'); $text=[IO.File]::ReadAllText($file); $base=$old -replace 'AddOrEditDTO$','';
  foreach($kind in @('Create','Update')){[IO.File]::WriteAllText((Join-Path (Split-Path $file) ($kind+$base+'DTO.cs')),($text -replace "\b$old\b",($kind+$base+'DTO')))}
  [IO.File]::Delete($file)
}
Get-ChildItem $root -Recurse -Filter *.cs -File | ForEach-Object {
  $p=$_.FullName; $t=[IO.File]::ReadAllText($p); $u=$t
  $u=$u -replace '\bEquipmentQrLabelAddOrEditDTO\b','CreateEquipmentQrLabelDTO'
  $u=$u -replace '\bEquipmentInspectionDefinitionAddOrEditDTO\b','CreateEquipmentInspectionDefinitionDTO'
  if($u -match 'UpdateAsync|MapPut'){ $u=$u -replace '\bCreateEquipmentQrLabelDTO\b','UpdateEquipmentQrLabelDTO'; $u=$u -replace '\bCreateEquipmentInspectionDefinitionDTO\b','UpdateEquipmentInspectionDefinitionDTO' }
  if($u -cne $t){[IO.File]::WriteAllText($p,$u)}
}
