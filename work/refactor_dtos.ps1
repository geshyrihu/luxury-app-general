$modules = @('MantenimientoLuxuryApp')
$moduleRoots = $modules | ForEach-Object { Join-Path 'api/LuxuryApp.Application/Modules' $_ }
function Get-TypeBlocks([string]$text) {
  $matches = [regex]::Matches($text, '(?m)^\s*public\s+(?:sealed\s+|abstract\s+)?(?:record|class|struct)\s+\w+DTO\b')
  $blocks = @()
  foreach ($m in $matches) {
    $start = $m.Index; $open = $text.IndexOf('{', $m.Index); $semi = $text.IndexOf(';', $m.Index)
    if ($open -lt 0 -or ($semi -ge 0 -and $semi -lt $open)) { $end = $semi + 1 }
    else { $depth = 0; $end = $open; for ($i=$open; $i -lt $text.Length; $i++) { if ($text[$i] -eq '{') {$depth++} elseif ($text[$i] -eq '}') {$depth--; if ($depth -eq 0) {$end=$i+1; break}} } }
    $blocks += [pscustomobject]@{Start=$start;End=$end;Text=$text.Substring($start,$end-$start)}
  }
  return $blocks
}
function Get-TypeName([string]$block) { $m=[regex]::Match($block,'\b(?:record|class|struct)\s+(\w+DTO)\b'); if($m.Success){$m.Groups[1].Value} }
function New-DtoFile([string]$path,[string]$header,[string]$block,[string]$name) {
  $body=[regex]::Replace($block,'(\b(?:record|class|struct)\s+)\w+DTO\b',"`$1$name",1)
  [IO.File]::WriteAllText((Join-Path (Split-Path $path) ($name+'.cs')),($header.TrimEnd()+"`r`n`r`n"+$body.Trim()+"`r`n"))
}
foreach($root in $moduleRoots){ Get-ChildItem $root -Recurse -Filter *.cs -File -ErrorAction SilentlyContinue | ForEach-Object {
  $text=[IO.File]::ReadAllText($_.FullName); $blocks=@(Get-TypeBlocks $text); if($blocks.Count -le 1){return}; $header=$text.Substring(0,$blocks[0].Start)
  foreach($b in $blocks){$name=Get-TypeName $b.Text; if($name){New-DtoFile $_.FullName $header $b.Text $name}}; [IO.File]::Delete($_.FullName)
}}
$rename=@{}
foreach($root in $moduleRoots){ Get-ChildItem $root -Recurse -Filter *.cs -File -ErrorAction SilentlyContinue | ForEach-Object {
  $old=Get-TypeName ([IO.File]::ReadAllText($_.FullName)); if(-not $old){return}
  if($old -match '^(.*)AddOrEditDTO$'){$rename[$old]=@('Create'+$Matches[1]+'DTO','Update'+$Matches[1]+'DTO')}
  elseif($old -match '^(.*)CreateOrUpdateDTO$'){$rename[$old]=@('Create'+$Matches[1]+'DTO','Update'+$Matches[1]+'DTO')}
  elseif($old -match '^(.*)AddDTO$'){$rename[$old]=@('Create'+$Matches[1]+'DTO')}
  elseif($old -match '^(.*)EditDTO$'){$rename[$old]=@('Update'+$Matches[1]+'DTO')}
}}
foreach($old in @($rename.Keys)){ $newNames=$rename[$old]; $files=Get-ChildItem $moduleRoots -Recurse -Filter *.cs -File -ErrorAction SilentlyContinue | Where-Object {(Get-Content -Raw $_.FullName) -match "\b$old\b"}; foreach($file in $files){
  $text=[IO.File]::ReadAllText($file.FullName); $match=[regex]::Match($text,'(?m)^\s*public\s+(?:sealed\s+|abstract\s+)?(?:record|class|struct)\s+\w+DTO\b'); if(-not $match.Success){continue}; $header=$text.Substring(0,$match.Index); $blocks=@(Get-TypeBlocks $text); $block=$blocks|Where-Object{(Get-TypeName $_.Text)-eq $old}|Select-Object -First 1; if(-not $block){continue}; $baseName=$old -replace '(AddOrEdit|CreateOrUpdate|Add|Edit)DTO$',''; $createName='Create'+$baseName+'DTO'; New-DtoFile $file.FullName $header $block.Text $createName; if($old -match '(AddOrEdit|CreateOrUpdate)DTO$'){ $updateName='Update'+$baseName+'DTO'; New-DtoFile $file.FullName $header $block.Text $updateName }; if($blocks.Count -eq 1){[IO.File]::Delete($file.FullName)} else {$remaining=$blocks|Where-Object{(Get-TypeName $_.Text)-ne $old}; [IO.File]::WriteAllText($file.FullName,($header.TrimEnd()+"`r`n`r`n"+(($remaining|%{$_.Text.Trim()})-join "`r`n`r`n")+"`r`n"))}
}}
foreach($old in @($rename.Keys)){ $create=$rename[$old][0]; $update=if($rename[$old].Count -gt 1){$rename[$old][1]}else{$null}; Get-ChildItem 'api' -Recurse -Include *.cs -File | ForEach-Object { $p=$_.FullName; $t=[IO.File]::ReadAllText($p); if($t -notmatch "\b$old\b"){return}; $t=[regex]::Replace($t,"\b$old\b",$create); if($update){$lines=$t -split "`r?`n"; for($i=0;$i-lt$lines.Count;$i++){if($lines[$i]-match 'UpdateAsync|UpdateStatusAsync|AdministrativeUpdateAsync|MapPut|PutAsync|UpdateOnboardingChecklistAsync'){$lines[$i]=$lines[$i]-replace "\b$create\b",$update}}; $t=$lines-join "`r`n"}; [IO.File]::WriteAllText($p,$t) }}
