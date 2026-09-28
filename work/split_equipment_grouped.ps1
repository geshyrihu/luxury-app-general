$root='D:\repos\luxuryapp-api\api\LuxuryApp.Application\Modules\MantenimientoLuxuryApp\EquipmentInspections\DTOs'
function Split-File($path){
  $text=[IO.File]::ReadAllText($path); $ms=[regex]::Matches($text,'(?m)^\s*public\s+record\s+\w+DTO\b'); if($ms.Count -le 1){return}; $header=$text.Substring(0,$ms[0].Index)
  foreach($m in $ms){$start=$m.Index;$open=$text.IndexOf('{',$start);$depth=0;$end=$open;for($i=$open;$i-lt$text.Length;$i++){if($text[$i]-eq '{'){$depth++}elseif($text[$i]-eq '}'){$depth--;if($depth-eq 0){$end=$i+1;break}}};$block=$text.Substring($start,$end-$start);$n=[regex]::Match($block,'\brecord\s+(\w+DTO)\b').Groups[1].Value;[IO.File]::WriteAllText((Join-Path $root ($n+'.cs')),($header.TrimEnd()+"`r`n"+$block.Trim()+"`r`n"))};[IO.File]::Delete($path)
}
Split-File (Join-Path $root 'CreateEquipmentInspectionDefinitionDTO.cs')
Split-File (Join-Path $root 'UpdateEquipmentInspectionDefinitionDTO.cs')
Split-File (Join-Path $root 'EquipmentInspectionExecutionDTO.cs')
