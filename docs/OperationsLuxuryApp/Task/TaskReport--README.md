# TaskReport (Reportes de Tickets)

> **Modulo padre:** Tasks
> **Ultima actualizacion:** `2026-06-25`

Reportes de tickets por rango de fechas, cliente y semana.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/task-report/GetTaskReport/{customerId}/{startDate}/{endDate}` | Reporte por rango |
| `GET` | `api/task-report/WeeklyReport/{customerId}/{startDate}/{endDate}/{status}` | Reporte semanal |
| `GET` | `api/task-report/WeeklyReportPreview/{customerId}/{year}/{weekNumber}` | Vista previa semanal |
| `GET` | `api/task-report/GetReportClient/{customerId}/{fechaInicial}/{fechaFinal}` | Reporte cliente (AllowAnonymous) |
