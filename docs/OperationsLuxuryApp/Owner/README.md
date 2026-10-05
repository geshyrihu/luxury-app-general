# Modulo: Owner (Condominos / Propietarios)

> **Area funcional:** Operaciones / Propiedades
> **Owner tecnico:** `@equipo-operaciones`
> **Ultima actualizacion:** `2026-06-25`

---

Gestiona el registro de condominos/propietarios: quien vive en cada propiedad y su rol (propietario vs inquilino).

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/Owner/{id}` | Propietario por ID |
| `GET` | `api/Owner/list/{customerId}` | Lista por cliente |
| `POST` | `api/Owner` | Crear (crea ApplicationUser + PropertyMember) |
| `PUT` | `api/Owner/{id}` | Actualizar |
| `DELETE` | `api/Owner/{id}` | Eliminar |

**Reglas:** Owner = `EMemberRole.Owner` (responsable financiero), Tenant = `EMemberRole.Tenant`. Solo un responsable financiero por propiedad.
