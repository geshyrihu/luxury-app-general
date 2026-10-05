# WorkGroupMember (Participantes de Grupo)

> **Modulo padre:** Tasks
> **Ultima actualizacion:** `2026-06-25`

Miembros asignados a grupos de trabajo y candidatos disponibles.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/task-group-participant/{TaskGroupId}` | Participantes existentes |
| `GET` | `api/task-group-participant/participants/{customerId}/{TaskGroupId}` | Candidatos disponibles |
| `POST` | `api/task-group-participant` | Agregar participante |
| `PUT` | `api/task-group-participant/{id}` | Actualizar |
| `DELETE` | `api/task-group-participant/{id}` | Eliminar |
