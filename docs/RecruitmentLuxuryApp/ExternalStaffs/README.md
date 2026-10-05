# Employees (Empleados)

> **Area:** RH / Empleados
> **Ultima actualizacion:** `2026-06-25`

Gestion de empleados internos y externos (proveedores). Dos controladores.

## EmployeesController (`api/Employees`)

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `{employeeId}` | Por ID |
| `POST` | `CreateEmployee` | Crear interno (usuario + persona + direccion) |
| `POST` | `CreateEmployeeExternal` | Crear externo (solo usuario) |
| `GET` | `Birthday/{customerId}/{month}` | Cumpleanos |
| `GET` | `ValidarSolicitudesAbiertas/{employeeId}` | Solicitudes reclutamiento abiertas |
| `GET` | `EmployeeTemp` | Listado temporal |
| `GET` | `ValidarAdminAsis/{applicationUserId}` | Validacion rol admin/asistente |

## EmployeeExternalController (`api/EmployeeExternal`)

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `{applicationUserId}` | Por ID |
| `GET` | `List/{customerId}/{active}` | Listar |
| `GET` | `search-by-email/{customerId}` | Buscar por email (top 5) |
| `GET` | `search-by-phone/{customerId}` | Buscar por telefono (top 5) |
| `POST` | `` | Crear externo |
| `PUT` | `{applicationUserId}` | Actualizar |
| `DELETE` | `{applicationUserId}` | Bloquear cuenta (global, `Active = false`) |
| `POST` | `add-access-cutomer/{applicationUserId}/{customerId}` | Agregar acceso a cliente (reactiva la cuenta si estaba bloqueada) |
| `DELETE` | `delete-access-cutomer/{applicationUserId}/{customerId}` | Quitar del cliente. Si el usuario queda sin ningun cliente, se bloquea su acceso a la app |

**Reglas:** Externos tienen `TypePerson == Provider`. Un mismo usuario puede tener acceso a varios clientes (`CustomerUsers`), pero `ExternalStaff` (proveedor + rol) es unico por usuario. El correo es la credencial de acceso (`UserName`): no se puede registrar dos veces el mismo correo, hay que reusar la cuenta via `add-access-cutomer`. Busqueda limitada a 5 resultados. Fotos redimensionadas a 600x600.
