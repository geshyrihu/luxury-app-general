# WorkGroup (Grupos de Trabajo)

> **Modulo padre:** Tasks
> **Ultima actualizacion:** `2026-06-25`

Grupos/areas de trabajo para organizar tickets (Mantenimiento, Legal, Recepcion, etc.).

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/task-groups/{id}` | Por ID |
| `GET` | `api/task-groups/list/{customerId}/{state}/{applicationUserId}` | Listar por cliente |
| `POST` | `api/task-groups` | Crear (Admin/SuperUsuario) |
| `PUT` | `api/task-groups/{id}` | Actualizar |
| `PATCH` | `api/task-groups/toggle-status/{id}` | Cambiar estatus |
| `DELETE` | `api/task-groups/{id}` | Eliminar |
