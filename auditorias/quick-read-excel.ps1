$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

$wb = $excel.Workbooks.Open("D:\repos\luxuryapp-api\auditorias\matriz-validacion-submodulos-v2.xlsx")
$ws = $wb.Worksheets.Item(1)
$range = $ws.UsedRange

Write-Host "Filas: $($range.Rows.Count)"
Write-Host "Columnas: $($range.Columns.Count)"
Write-Host ""
Write-Host "Primeras 5 filas (headers + primeras 4 filas de datos):"

for ($r=1; $r -le [Math]::Min(5, $range.Rows.Count); $r++) {
    $rowText = "Fila $r : "
    for ($c=1; $c -le [Math]::Min(8, $range.Columns.Count); $c++) {
        $val = $ws.Cells.Item($r, $c).Text
        $rowText += $val + " | "
    }
    Write-Host $rowText
}

Write-Host ""
Write-Host "Verificando celdas SI en modulo AdminLuxuryApp (columna 4):"
$adminSiCount = 0
for ($r=2; $r -le $range.Rows.Count; $r++) {
    $val = $ws.Cells.Item($r, 4).Text
    if ($val -eq "SI") {
        $adminSiCount++
        $subName = $ws.Cells.Item($r, 1).Text
        Write-Host "  SI: $subName"
    }
}
Write-Host "Total SI en AdminLuxuryApp: $adminSiCount"

$wb.Close($false)
$excel.Quit()
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($ws) | Out-Null
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($wb) | Out-Null
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($excel) | Out-Null
