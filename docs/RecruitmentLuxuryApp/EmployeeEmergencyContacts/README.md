# EmployeeEmergencyContact (Contactos de Emergencia)

> **Area:** RH / Empleados
> **Ultima actualizacion:** `2026-06-25`

Gestion de contactos de emergencia y beneficiarios de empleados.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/EmployeeEmergencyContact/ListEmployeeContact/{employeeId}/{contacOfBeneficiary}` | Listar por empleado y tipo |
| `GET` | `api/EmployeeEmergencyContact/{id}` | Por ID |
| `POST` | `api/EmployeeEmergencyContact` | Crear |
| `PUT` | `api/EmployeeEmergencyContact/{employeeEmergencyContactId}` | Actualizar |
| `DELETE` | `api/EmployeeEmergencyContact/{id}` | Eliminar |

**Reglas:** `ContacOfBeneficiary` filtra entre contacto de emergencia y beneficiario. Telefonos sanitizados (solo digitos) al crear.
