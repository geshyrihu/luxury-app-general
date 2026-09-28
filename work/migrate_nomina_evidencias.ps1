$ErrorActionPreference='Stop'
$map=[ordered]@{'EvidenciaNominaCreateDTO'='CreatePayrollEvidenceDTO';'EvidenciaNominaDTO'='PayrollEvidenceDTO'}
Get-ChildItem 'api' -Recurse -Filter '*.cs' | ForEach-Object { $o=[IO.File]::ReadAllText($_.FullName);$n=$o;foreach($p in ($map.GetEnumerator()|Sort-Object {$_.Key.Length} -Descending)){$n=$n.Replace($p.Key,$p.Value)};if($n-ne$o){[IO.File]::WriteAllText($_.FullName,$n,[Text.UTF8Encoding]::new($false))} }
Move-Item 'api/LuxuryApp.Application/Modules/RecursosHumanosLuxuryApp/Nomina/Evidencias/DTOs/EvidenciaNominaDTO.cs' 'api/LuxuryApp.Application/Modules/RecursosHumanosLuxuryApp/Nomina/Evidencias/DTOs/PayrollEvidenceDTO.cs'
Move-Item 'api/LuxuryApp.Application/Modules/RecursosHumanosLuxuryApp/Nomina/Evidencias/DTOs/EvidenciaNominaCreateDTO.cs' 'api/LuxuryApp.Application/Modules/RecursosHumanosLuxuryApp/Nomina/Evidencias/DTOs/CreatePayrollEvidenceDTO.cs'
