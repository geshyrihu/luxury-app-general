# WorkPosition (Puestos de Trabajo)

> **Modulo padre:** Reclutamiento
> **Ultima actualizacion:** `2026-06-25`

Gestion de puestos de la plantilla laboral (organigrama). Folio `{RFC}-{SortOrder}-{consecutivo}`.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/work-positions/{id}` | Por ID |
| `GET` | `api/work-positions/list-by-customer/{customerId}/{state}` | Listar por cliente |
| `GET` | `api/work-positions/for-edit/{id}` | Para edicion |
| `GET` | `api/work-positions/all-general` | Listado general |
| `POST` | `api/work-positions` | Crear (genera JobDescription) |
| `PUT` | `api/work-positions/{id}` | Actualizar |
| `DELETE` | `api/work-positions/{id}` | Eliminar (cascada solicitudes) |
| `GET` | `api/work-positions/hours/{id}` | Horas del puesto |
| `GET` | `api/work-positions/assign-employee/{applicationUserId}/{workPositionId}` | Asignar empleado |
| `PATCH` | `api/work-positions/{id}/unassign-employee` | Desasignar |
| `PATCH` | `api/work-positions/{id}/activate` | Reactivar |

**Reglas:** Folio automatico. Empleado solo en un puesto a la vez. Crear puesto genera `JobDescription` automaticamente.
