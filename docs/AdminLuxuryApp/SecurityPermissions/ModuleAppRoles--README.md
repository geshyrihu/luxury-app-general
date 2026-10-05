# ModuleAppRol (Permisos de Modulos por Rol)

> **Area:** Sistema / Acceso
> **Ultima actualizacion:** `2026-06-25`

Asignacion de modulos de navegacion a roles del sistema.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/module-app-roles/ListRole` | Roles disponibles |
| `GET` | `api/module-app-roles/ListModule` | Modulos disponibles |
| `GET` | `api/module-app-roles/Assignments/{roleId}` | Asignaciones por rol (agrupado) |
| `POST` | `api/module-app-roles/UpdateModuleAppRolAssigned` | Actualizar asignacion |

**Reglas:** Solo `SuperUsuario`. Arbol jerarquico por `PathParent`. Asignacion de padre propagada a hijos. Desasignacion de padre elimina hijos recursivamente (BFS).
