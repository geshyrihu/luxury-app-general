# EmployeeBirthday (Cumpleanos de Empleados)

> **Area:** RH / Empleados
> **Ultima actualizacion:** `2026-06-25`

Consulta de cumpleanos de empleados por cliente y mes. Solo lectura.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/Birthday/{customerId}/{month}` | Cumpleanos del mes |

**DTO:** `EmployeeBirthdayDTO` (Title, Date, Photo, ApplicationRole). Delega a `IPersonDataAppService.EmployeeBirthdayAsync`.
