# EmployeeInternal (Perfil de Empleado Interno)

> **Area:** RH / Empleados
> **Ultima actualizacion:** `2026-06-25`

Gestion completa del perfil de empleados internos: datos principales, personales, laborales, direccion, foto y activacion.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/EmployeeInternal/list/{customerId}/{active}` | Listar por cliente y estado |
| `GET` | `api/EmployeeInternal/PrincipalData/{applicationUserId}` | Datos principales |
| `PUT` | `api/EmployeeInternal/UpdatePrincipalData/{applicationUserId}` | Actualizar nombre/email/telefono |
| `GET` | `api/EmployeeInternal/PhotoPath/{applicationUserId}` | Ruta de foto |
| `PUT` | `api/EmployeeInternal/UpdateImage/{applicationUserId}` | Subir foto (600x600) |
| `GET` | `api/EmployeeInternal/PersonalData/{employeeId}` | Datos personales (CURP, RFC, NSS) |
| `PUT` | `api/EmployeeInternal/UpdatePersonalData/{employeeId}` | Actualizar datos personales |
| `GET` | `api/EmployeeInternal/LaboralData/{applicationUserId}` | Datos laborales (salario, admision) |
| `PUT` | `api/EmployeeInternal/UpdateLaboralData/{applicationUserId}` | Actualizar datos laborales |
| `GET` | `api/EmployeeInternal/AddressData/{employeeId}` | Direccion |
| `PUT` | `api/EmployeeInternal/UpdateAddressData/{addressId}` | Actualizar direccion |
| `GET` | `api/EmployeeInternal/DataForRecoveryPassword/{applicationUserId}` | Datos para recuperacion |
| `GET` | `api/EmployeeInternal/OnValidateState/{applicationUserId}` | Validar si activo |
| `PATCH` | `api/EmployeeInternal/{applicationUserId}/activate` | Reactivar empleado |

**Reglas:** `NumberEmployee` 1-9999. Roles legales no pueden crear solicitudes de reclutamiento. Datos personales/direccion auto-creados si no existen. Foto anterior eliminada al actualizar.
