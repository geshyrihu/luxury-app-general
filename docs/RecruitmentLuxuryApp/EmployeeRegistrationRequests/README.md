# RequestEmployeeRegister (Solicitud de Alta)

> **Modulo padre:** Reclutamiento
> **Ultima actualizacion:** `2026-06-25`

Solicitudes de alta de empleado (onboarding) con vacantes disponibles y exportacion Excel.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/RequestEmployeeRegister/{id}` | Por ID |
| `GET` | `api/RequestEmployeeRegister/{id}/basic-info` | Info basica |
| `GET` | `api/RequestEmployeeRegister/GetEmployeeRegister/{employeeId}/{customerId}` | Por empleado/cliente |
| `GET` | `api/RequestEmployeeRegister/Vacantes/{customerId}` | Vacantes disponibles |
| `GET` | `api/RequestEmployeeRegister/GetList` | Listar (filtros) |
| `POST` | `api/RequestEmployeeRegister` | Crear |
| `PUT` | `api/RequestEmployeeRegister/{id}` | Actualizar |
| `PUT` | `api/RequestEmployeeRegister/{id}/status` | Actualizar estado |
| `GET` | `api/RequestEmployeeRegister/ExportRequestToExcel` | Exportar Excel |
| `DELETE` | `api/RequestEmployeeRegister/{id}` | Eliminar |

**Reglas:** Evento `RequestEmployeeRegisterCreated` -> handler notifica onboarding. `RequestEmployeeRegisterConfirmed` -> notifica a sistemas.
