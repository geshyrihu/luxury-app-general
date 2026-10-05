# UserAccounts (Cuentas de Usuario)

> **Area:** Sistema / Acceso
> **Ultima actualizacion:** `2026-06-25`

Gestion administrativa de cuentas de usuario del sistema.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `POST` | `api/admin/user-accounts/create-account` | Crear cuenta |
| `GET` | `api/admin/user-accounts/{applicationUserId}` | Por ID |
| `PUT` | `api/admin/user-accounts/update-account/{applicationUserId}` | Actualizar |
| `DELETE` | `api/admin/user-accounts/delete/{applicationUserId}` | Eliminar (cascada administrativa) |
| `POST` | `api/admin/user-accounts/add-role-to-user/{applicationUserId}` | Asignar rol |
| `GET` | `api/admin/user-accounts/to-block-account/{id}` | Bloquear |
| `GET` | `api/admin/user-accounts/to-unlock-account/{id}` | Desbloquear |
| `GET` | `api/admin/user-accounts/get-role/{applicationUserId}/{roleType?}` | Obtener rol |
| `GET` | `api/admin/user-accounts/list/{customerId}/{state}/{typePerson?}` | Listar por cliente |
| `GET` | `api/admin/user-accounts/list/{state}/{typePerson?}` | Listar global |

**Reglas:** Delete: cascada transaccional administrativa (PropertyMembers, AccesoCustomers, UserRoles, Employee, Address, PersonData, UserTokens/Claims/Logins). `AddRoleToUser`: limpia roles existentes y asigna el nuevo.
