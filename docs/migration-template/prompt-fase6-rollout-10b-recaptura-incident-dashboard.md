# Prompt 10b — Fase 6: recapturar `incident-dashboard`, la tabla no salió en la foto

Al auditar las 6 capturas del Prompt 10 (`operations.luxuryapp`), 5
están bien. La de `incident-dashboard.png` **no verifica nada de la
migración**: solo muestra las tarjetas KPI (Total Incidencias,
Resueltas, Pendientes...) y las dos gráficas ("Incidencias por Mes" /
"Distribución por Tipo", ambas con "Sin datos disponibles" —
componente `app-chart-wrapper`, no forma parte de esta migración, no
lo toques). El `<app-table>` real de este archivo está más abajo, en
`incident-dashboard.html:124-155`, fuera del encuadre de la captura.

Vuelve a `incident-dashboard`, **haz scroll hasta la tabla** (debajo
de la sección de gráficas, hay una tarjeta con encabezado antes de la
tabla) y toma la captura ahí. Confirma que carga con datos reales (o
el estado vacío si no hay), que las columnas ordenables muestran el
ícono de orden, y que el paginador se ve si aplica.

## Aparte — una discrepancia menor en tu reporte anterior, sin acción

Tu reporte decía "se corrigieron 8 entradas TableModule que el
codemod dejó pendientes", pero al revisar el diff final no encontré
ningún residual de `TableModule`/`p-table`/`pSortableColumn`/
`p-sorticon` en ninguno de los 51 archivos — el estado final está
limpio (confirmado con `tsc --noEmit` y grep dirigido). Si fue un paso
intermedio de tu propio proceso que ya quedó resuelto, no hace falta
que hagas nada; solo qué te pido que la próxima vez que reportes una
corrección así, sea sobre el estado **final** del archivo, no sobre
pasos intermedios — así el reporte refleja exactamente lo que hay que
auditar.

## Listo cuando

- Nueva captura de `incident-dashboard` mostrando la tabla real
  (`app-table`), no solo KPIs/gráficas.
