# ProfileUsers (Perfil de Usuario)

> **Area:** Sistema / Acceso
> **Ultima actualizacion:** `2026-06-25`

Autogestion del perfil de usuario: cambio de contrasena y foto.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `PUT` | `api/Users/ChangePassword/{applicationUserId}` | Cambiar contrasena |
| `PUT` | `api/Users/UpdateImage/{applicationUserId}` | Actualizar foto |

**Reglas:** `ChangePassword` requiere contrasena actual. `UpdateImage` elimina foto anterior (excepto avatar default).
