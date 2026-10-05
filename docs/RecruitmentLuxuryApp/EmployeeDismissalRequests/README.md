# RequestDismissal (Solicitud de Baja)

> **Modulo padre:** Reclutamiento
> **Ultima actualizacion:** `2026-06-25`

Solicitudes de baja de empleado con autorizacion dual (Legal + Nominas), descuentos y vinculacion a actas/evaluaciones.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/RequestDismissal/List` | Listar (filtros) |
| `GET` | `api/RequestDismissal/GetById/{id}` | Por ID |
| `GET` | `api/RequestDismissal/GetRequestDismissal/{employeeId}` | Por empleado |
| `GET` | `api/RequestDismissal/SendEmail/{workPositionId}` | Enviar correo |
| `POST` | `api/RequestDismissal` | Crear |
| `PUT` | `api/RequestDismissal/{id}` | Actualizar |
| `PATCH` | `api/RequestDismissal/{id}/status` | Actualizar estatus |
| `PATCH` | `api/RequestDismissal/{id}/authorize/{department}` | Autorizar por dpto |
| `POST` | `api/RequestDismissal/{id}/attach-incident/{incidentId}` | Asociar acta |
| `POST` | `api/RequestDismissal/{id}/attach-evaluation/{evaluationId}` | Asociar evaluacion |
| `GET` | `api/RequestDismissal/ExportRequestToExcel` | Exportar Excel |
| `DELETE` | `api/RequestDismissal/{id}` | Eliminar |

**Reglas:** Eventos: `RequestDismissalRequested` -> handler notifica. Autorizacion por departamento (Legal, Nominas). Vinculacion a `IncidentReport` y `PerformanceEvaluations`.
