# RequestSalaryModification (Modificacion Salarial)

> **Modulo padre:** Reclutamiento
> **Ultima actualizacion:** `2026-06-25`

Solicitudes de modificacion salarial. Folio `MS{D5}`. Al concluir actualiza salario y reasigna puesto.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/RequestSalaryModification/{id}` | Por ID |
| `GET` | `api/RequestSalaryModification/GetDataForModificacionSalario/{employeeId}` | Datos para modificacion |
| `GET` | `api/RequestSalaryModification/{workPositionId}/{employeeId}` | Status por puesto/empleado |
| `PUT` | `api/RequestSalaryModification/{id}` | Actualizar |
| `GET` | `api/RequestSalaryModification` | Listar (filtros) |
| `GET` | `api/RequestSalaryModification/ExportRequestToExcel` | Exportar Excel |

**Reglas:** Evento `RequestSalaryModificationCreated` -> handler notifica email. Concluir = actualiza salario en WorkPosition.
