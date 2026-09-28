$a = @(Get-ChildItem -LiteralPath 'D:\repos\luxuryapp-api\client\angular\src' -Recurse -File) + @(Get-ChildItem -LiteralPath 'D:\repos\luxuryapp-api\client\angular\public' -Recurse -File)
$a = $a | ForEach-Object { $_.FullName.Replace('D:\repos\luxuryapp-api\client\angular\', '') } | Sort-Object

$b = @(Get-ChildItem -LiteralPath 'D:\repos\luxuryapp-api\client\luxuryapp\src' -Recurse -File) + @(Get-ChildItem -LiteralPath 'D:\repos\luxuryapp-api\client\luxuryapp\public' -Recurse -File)
$b = $b | ForEach-Object { $_.FullName.Replace('D:\repos\luxuryapp-api\client\luxuryapp\', '') } | Sort-Object

$diff = Compare-Object $a $b
if ($null -eq $diff) {
    Write-Output 'ARBOLES IDENTICOS'
    Write-Output ('TOTAL origen=' + $a.Count + ' copia=' + $b.Count)
} else {
    Write-Output ('DIFERENCIAS: ' + $diff.Count)
    $diff | ForEach-Object { Write-Output ($_.SideIndicator + ' ' + $_.InputObject) }
}
