# Remediación 7 — Quitar los gráficos de `/dashboard/metrics`

Decisión del Tech Lead (2026-09-21): las tarjetas de órdenes de mantenimiento están bien; **los gráficos (barras y dona) se ven mal y se eliminan**. Los gráficos se reevaluarán más adelante, cuando los KPIs estén aprobados.

Regla de trabajo: solo lo que dice este documento. Si crees que hay una mejor manera, PARA y repórtalo. No afirmes lo que no hayas verificado.

Archivos bajo `appsweb/angular/src/app/modules/operations.luxuryapp/dashboard/metrics/`.

## Cambios requeridos

1. `dashboard-metrics.html`: elimina los dos gráficos `<app-chart-wrapper>` (barras "Distribución (Barras)" y dona "Distribución (Dona)") y el contenedor/columna que solo los albergaba y la rama "No hay datos de distribución para mostrar". **Conserva todo lo demás**: la sección de órdenes de mantenimiento (tarjetas), la barra de filtros y las tres tarjetas actuales (Completadas / Pendientes / Tiempo promedio).
2. `dashboard-metrics.ts`: elimina lo que quede sin uso por lo anterior: el `computed` `distributionChartData`, el import y el `imports: [...]` de `ChartWrapper`. No dejes código ni imports muertos.
3. No toques `components/maintenance-category-card.ts`, `services/`, `interfaces/`, `catalog/`, `dashboard-metrics-filters.ts`, ni nada del backend. `OperationalMetricsDTO.DistribucionPorTipo` se queda (no es de este cambio).
4. No elimines el catálogo `/dashboard/metrics/catalog` ni sus datos de muestra (ese archivo ya no usa gráficos: verifica con grep que no importa `ChartWrapper`; si lo importa, PARA y repórtalo).

## Verificación obligatoria (pega salidas reales)

1. `npx ng build --configuration development` en `appsweb/angular`.
2. Grep sobre `dashboard/metrics/` que debe dar 0: `app-chart-wrapper|ChartWrapper|distributionChartData`.
3. Lista de archivos que tocaste (solo los dos indicados).

## Reporte

Reemplaza `D:\repos\luxuryapp-api\response.md` con un reporte nuevo y breve. No copies el reporte anterior.
