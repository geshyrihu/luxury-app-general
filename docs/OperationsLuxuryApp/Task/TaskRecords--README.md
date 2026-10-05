# Tasks (Tickets / Tareas)

> **Modulo padre:** Tasks
> **Ultima actualizacion:** `2026-06-25`

Gestion completa de tickets/tareas operativas con grupos, prioridades, dependencias y programacion.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/tasks/{id}` | Task por ID |
| `GET` | `api/tasks/view/{id}` | Vista detallada |
| `GET` | `api/tasks/list/{taskGroupId}/{status}` | Listar por grupo/status |
| `POST` | `api/tasks/Create` | Crear (form) |
| `PUT` | `api/tasks/Update/{id}` | Actualizar (form) |
| `GET` | `api/tasks/update-relevance/{id}` | Alternar relevancia |
| `GET` | `api/tasks/Programation/{id}` | Obtener programacion |
| `POST` | `api/tasks/Programation/{id}` | Guardar programacion |
| `POST` | `api/tasks/my-task/programation/{id}` | Programacion "Mi Task" |
| `PUT` | `api/tasks/Closed/{id}` | Cerrar task |
| `GET` | `api/tasks/in-progress/{taskId}/{applicationUserId}` | Marcar En Progreso |
| `POST` | `api/tasks/Reopen` | Reabrir |
| `GET` | `api/tasks/Participant/{taskGroupId}` | Participantes del grupo |
| `GET` | `api/tasks/update-priority/{taskId}/{applicationUserId}` | Actualizar prioridad |
| `GET` | `api/tasks/my-assigned-tasks/{applicationUserId}/{status}/{customerId}` | Mis tasks asignados |
| `GET` | `api/tasks/MyRequest/{applicationUserId}/{status}/{customerId}` | Mis solicitudes |
| `GET` | `api/tasks/set-predecessor/{taskId}/{predecessorId}` | Dependencias |
| `GET` | `api/tasks/clear-predecessor/{taskId}` | Limpiar dependencia |
| `GET` | `api/tasks/available-predecessors/{groupId}` | Predecesoras disponibles |
| `DELETE` | `api/tasks/{id}/{customerId}` | Eliminar (Admin/SuperUsuario) |
| `GET` | `api/tasks/PathReport/{customerId}/{year}/{numeroSemana}` | Ruta reporte semanal |
| `PUT` | `api/tasks/UpdateOrder` | Reordenar |
| `GET` | `api/tasks/AllByCustomer/{customerId}` | Todos por cliente |
| `GET` | `api/Gantt/{customerId}` | Datos Gantt |

**Reglas:** CRUD completo. Soporta dependencias entre tasks, reordenamiento, programacion semanal, grupo de trabajo, prioridades y cierre.
