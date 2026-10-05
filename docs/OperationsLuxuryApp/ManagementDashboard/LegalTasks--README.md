# TareasLegal (Tareas Legales - Dashboard)

> **Modulo padre:** DireccionDashboard
> **Ultima actualizacion:** `2026-06-25`

Resumen de tareas legales pendientes para la direccion.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/direccion-dashboard/tareas-legal` | Tareas legales pendientes |

**Reglas:** Solo `Direccion, SuperUsuario`. Filtra `WorkGroup.IsLegalGroup == true` y status no Completed/Cancelled. Ordena por prioridad (High primero). Agrupa por cliente.
