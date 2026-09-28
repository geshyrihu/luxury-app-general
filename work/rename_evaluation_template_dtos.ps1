$ErrorActionPreference = 'Stop'
$path = 'api/LuxuryApp.Application/Modules/RecursosHumanosLuxuryApp/Evaluacion/EvaluationTemplate'
$map = [ordered]@{
  'SaveEvaluationTemplateRequestDTO' = 'CreateEvaluationTemplateDTO'
  'SaveTemplateCategoryDTO' = 'TemplateCategoryDTO'
  'SaveTemplateQuestionDTO' = 'TemplateQuestionDTO'
}
Get-ChildItem $path -Recurse -Filter '*.cs' | ForEach-Object {
  $old = [IO.File]::ReadAllText($_.FullName); $new = $old
  foreach ($pair in $map.GetEnumerator()) { $new = $new.Replace($pair.Key, $pair.Value) }
  if ($new -ne $old) { [IO.File]::WriteAllText($_.FullName, $new, [Text.UTF8Encoding]::new($false)) }
}
