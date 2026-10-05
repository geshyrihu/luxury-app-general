# LegalReport (Reportes Legales)

> **Area:** Legal / Reportes
> **Ultima actualizacion:** `2026-06-25`

Reportes y metricas del area legal: pendientes, resumenes, PDF semanal.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/LegalReport/Pending/{typePerson}` | Pendientes por tipo persona |
| `GET` | `api/LegalReport/PendingUnassignedData` | Pendientes sin asignar |
| `GET` | `api/LegalReport/Summary/{startDate}/{endDate}` | Resumen por tipo persona |
| `GET` | `api/LegalReport/SummaryIndividual/{startDate}/{endDate}` | Resumen por asignado |
| `GET` | `api/LegalReport/SummaryCustomer/{startDate}/{endDate}` | Resumen por cliente |
| `GET` | `api/LegalReport/TotalRequests/{startDate}/{endDate}` | Totales globales |
| `GET` | `api/LegalReport/Results/{startDate}/{endDate}/{isInternal}` | Resultados de tickets |
| `GET` | `api/LegalReport/RequestsAttended/{startDate}/{endDate}/{isInternal}` | Atendidos agrupados |
| `GET` | `api/LegalReport/RequestsPending/{isInternal}` | Pendientes con ultimo seguimiento |
| `GET` | `api/LegalReport/GenerateWeeklyReport/{customerId}/{startDate}/{endDate}/{isInternal}` | Generar PDF semanal |

**Reglas:** Filtra `WorkGroup.IsLegalGroup == true`. Dias transcurridos via `DaysPassed()`. PDF generado en `wwwroot/reportes/` y servido como descarga. Grupos legales fijos.
