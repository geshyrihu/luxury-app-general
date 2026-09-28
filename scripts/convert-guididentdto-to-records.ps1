$ErrorActionPreference = 'Stop'
$inventoryPath = 'D:\repos\luxuryapp-api\docs\reporte_maestro\inventario_guididentdto.md'

$raw = Get-Content -LiteralPath $inventoryPath
$lines = $raw | Where-Object { $_ -match '\.cs:\d+:' }

$grouped = @{}
foreach ($line in $lines) {
    if ($line -match '^(.+\.cs):(\d+):(.+)$') {
        $path = $matches[1]
        $content = $matches[3]
        if (-not $grouped.ContainsKey($path)) {
            $grouped[$path] = @()
        }
        $grouped[$path] += $content
    }
}

$changed = 0
$skipped = 0
$errors = 0

foreach ($kvp in $grouped.GetEnumerator()) {
    $fullPath = $kvp.Key
    if (-not (Test-Path -LiteralPath $fullPath)) {
        Write-Host "MISSING: $fullPath"
        $errors++
        continue
    }

    $fileLines = Get-Content -LiteralPath $fullPath
    $modified = $false
    $newLines = @()

    foreach ($fl in $fileLines) {
        $trimmed = $fl.Trim()
        if ($trimmed -match '^public\s+class\s+[A-Za-z_][A-Za-z0-9_]*\s*:\s*GuidIdEntityDTO\s*$') {
            $newLine = $fl -replace '\bpublic\s+class\s+', 'public record '
            if ($newLine -ne $fl) {
                $newLines += $newLine
                $modified = $true
                continue
            }
        }
        $newLines += $fl
    }

    if ($modified) {
        Set-Content -LiteralPath $fullPath -Value $newLines -Encoding UTF8
        $changes = ($newLines | Where-Object { $_ -match 'public record .+ : GuidIdEntityDTO' }).Count
        $changed += $changes
        Write-Host "CHANGED ($changes): $fullPath"
    } else {
        $skipped++
    }
}

Write-Host "`n=== SUMMARY ==="
Write-Host "Files processed: $($grouped.Count)"
Write-Host "Total declarations changed: $changed"
Write-Host "Files skipped (no change): $skipped"
Write-Host "Errors: $errors"
