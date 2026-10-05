# ApplicationRole (Roles de Aplicacion)

> **Area:** Sistema / Acceso
> **Ultima actualizacion:** `2026-06-25`

Gestion de roles del sistema. Catalogo de ~35 roles en 6 categorias.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/application-roles/{roleId}` | Rol por ID |
| `GET` | `api/application-roles` | Listar todos |
| `POST` | `api/application-roles` | Crear |
| `PUT` | `api/application-roles/{id}` | Actualizar |
| `DELETE` | `api/application-roles/{id}` | Eliminar |

**Reglas:** Solo `SuperUsuario`. Roles seed: System (1), Executive (1), Corporate (7), Staff (20), Client (2), Contractor (4). `SortOrder`, `DisplayName`, `RoleType`, `Departament`. Validacion de nombre unico.
