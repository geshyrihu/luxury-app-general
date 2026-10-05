# Modulo: Dashboard (Dashboard Principal)

> **Area funcional:** Operaciones / Direccion
> **Owner tecnico:** `@equipo-operaciones`
> **Ultima actualizacion:** `2026-06-25`

---

Orquesta la vista principal del dashboard. Agrega elementos pendientes de todos los modulos (tickets, ordenes de servicio, minutas, contratos, solicitudes RH).

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `POST` | `api/Dashboard/SendExecutiveReport/{customerId}` | Envia reporte ejecutivo por correo |
| `GET` | `api/Dashboard/FiltroMinutasArea/{meetingId}/{area}/{status?}` | Minutas filtradas por area |
| `GET` | `api/Dashboard/GlobalPendingItems/{customerId}` | Todos los pendientes del sistema |
| `POST` | `api/Dashboard/Analyze` | Resumen dashboard via IA (cache 20 min) |

**Reglas:** Filtro por rol, resumen IA cacheados por usuario+cliente+hour (20 min TTL).
