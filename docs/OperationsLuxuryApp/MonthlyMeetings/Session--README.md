# Session (Sesiones de Junta Mensual)

> **Modulo padre:** JuntasMensuales
> **Ultima actualizacion:** `2026-06-25`

Orquestacion de sesiones de junta mensual: agenda, presentacion, minuta, asamblea.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/JuntaMensualSession/{id}` | Sesion por ID |
| `GET` | `api/JuntaMensualSession/{id}/detail` | Detalle consolidado |
| `GET` | `api/JuntaMensualSession` | Listar (query: customerId, status, sessionType) |
| `GET` | `api/JuntaMensualSession/customer/{customerId}` | Por cliente |
| `POST` | `api/JuntaMensualSession/from-agenda` | Crear desde agenda |
| `POST` | `api/JuntaMensualSession/{id}/presentation` | Vincular presentacion |
| `POST` | `api/JuntaMensualSession/{id}/meeting` | Vincular minuta |
| `POST` | `api/JuntaMensualSession/{id}/meeting/create` | Crear minuta desde sesion |
| `POST` | `api/JuntaMensualSession/{id}/cancel` | Cancelar |
| `PUT` | `api/JuntaMensualSession/{id}/reschedule` | Reprogramar |

**Reglas:** Vista centralizada. Soporta cancelacion y reprogramacion. Orquesta agenda -> presentacion -> minuta -> asamblea.
