# RequestPosition (Solicitud de Vacante)

> **Modulo padre:** Reclutamiento
> **Ultima actualizacion:** `2026-06-25`

Solicitudes de vacante de personal. Folio `VAC{D5}` y notificacion a reclutamiento.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/RequestPosition` | Listar (filtros) |
| `GET` | `api/RequestPosition/pending` | Pendientes |
| `GET` | `api/RequestPosition/{id}` | Por ID |
| `POST` | `api/RequestPosition` | Crear |
| `PUT` | `api/RequestPosition/{id}` | Actualizar |
| `GET` | `api/RequestPosition/ExportRequestToExcel` | Exportar Excel |
| `DELETE` | `api/RequestPosition/{id}` | Eliminar |

**Reglas:** Evento `RequestPositionCreated` -> `RequestPositionHandler` envia email a reclutamiento.
