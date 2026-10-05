# UserActivityHistory (Historial de Actividad de Usuario)

> **Area:** Sistema / Auditoria
> **Ultima actualizacion:** `2026-06-25`

Bitacora de actividad de usuarios con filtros y paginacion. Solo `SuperUsuario`.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/UserActivityHistory` | Actividad paginada (filtros: customerId, userType, fechas) |

**Reglas:** Los logs son escritos por el atributo `[LogUserActivity]` en cada controller. `UserActivityService` implementa fire-and-forget.
