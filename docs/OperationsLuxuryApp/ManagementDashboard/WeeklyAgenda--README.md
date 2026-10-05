# AgendaSemanal (Agenda de Direccion)

> **Modulo padre:** DireccionDashboard
> **Ultima actualizacion:** `2026-06-25`

Agenda de la direccion con eventos de Google Calendar.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/direccion-dashboard/agenda-semanal` | Agenda 2 semanas (query: fecha) |
| `GET` | `api/direccion-dashboard/agenda-meses` | Agenda meses futuros (query: meses, max 12) |

**Reglas:** Solo `Direccion, SuperUsuario`. Calcula lunes actual a domingo siguiente. Limite 1-12 meses.
