# CustomerDataCompany (Datos de Empresa por Cliente)

> **Area:** Sistema / Clientes
> **Ultima actualizacion:** `2026-06-25`

Configuracion de datos de empresa por cliente (SMTP, responsable). Solo `SuperUsuario`.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/customer-data-company` | Listar |
| `GET` | `api/customer-data-company/{id}` | Por ID |
| `POST` | `api/customer-data-company` | Crear |
| `PUT` | `api/customer-data-company/{id}` | Actualizar |
| `DELETE` | `api/customer-data-company/{id}` | Eliminar |

**Reglas:** Misma tabla que `EmailData` (`CustomerEmailConfiguration`). Mapeo manual (sin AutoMapper).
