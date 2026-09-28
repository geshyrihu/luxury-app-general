#!/usr/bin/env pwsh
<#
 .SYNOPSIS
   Replica la skill "planeacion-modulos" a todos los agentes del repo.
 .USO
   pwsh scripts/sync-planeacion-skill.ps1            # copia
   pwsh scripts/sync-planeacion-skill.ps1 -Check     # solo reporta diferencias
#>
param([switch]$Check)

$ErrorActionPreference = 'Stop'
$root = Resolve-Path (Join-Path $PSScriptRoot '..')
$src  = Join-Path $root 'skills/planeacion-modulos/SKILL.md'
if (-not (Test-Path $src)) { Write-Error "No existe $src"; exit 1 }

$agents = @('.kilo', '.agents', '.claude', '.codex', '.cursor', '.gemini', '.qwen', '.antigravity')
$content = Get-Content $src -Raw
$diff = $false

foreach ($a in $agents) {
    $destDir = Join-Path $root ($a + '/skills/planeacion-modulos')
    $dest = Join-Path $destDir 'SKILL.md'
    if ($Check) {
        if (-not (Test-Path $dest)) { Write-Host "  x $a : MISSING"; $diff = $true; continue }
        if ((Get-Content $dest -Raw) -ne $content) { Write-Host "  x $a : DIFFERS"; $diff = $true }
        else { Write-Host "  v $a : OK" }
    } else {
        New-Item -ItemType Directory -Force -Path $destDir | Out-Null
        Copy-Item $src $dest -Force
        Write-Host "  v $a/skills/planeacion-modulos/SKILL.md"
    }
}
if ($Check -and $diff) { Write-Host "`nHay diferencias. Corre sin -Check para sincronizar."; exit 1 }
if (-not $Check) { Write-Host "`nSkill replicada a todos los agentes." }
