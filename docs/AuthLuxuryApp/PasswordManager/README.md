# PasswordManager (Administrador de Contrasenas)

> **Area:** Sistema / Acceso
> **Ultima actualizacion:** `2026-06-25`

Boveda personal de contrasenas por usuario. Almacenadas en `VaultDbContext`.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `POST` | `api/password-manager/credentials/filter` | Listar (paginado) |
| `GET` | `api/password-manager/credentials/{id}` | Por ID |
| `POST` | `api/password-manager/credentials` | Crear |
| `PUT` | `api/password-manager/credentials/{id}` | Actualizar |
| `DELETE` | `api/password-manager/credentials/{id}` | Eliminar |

**Reglas:** Aislamiento por usuario (`UserId`). Password almacenado en texto plano (boveda). DB separada (`VaultDbContext`).
