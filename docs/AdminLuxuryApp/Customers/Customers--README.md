# Customers (Clientes / Condominios)

> **Area:** Sistema / Clientes
> **Ultima actualizacion:** `2026-06-25`

Gestion del ciclo de vida de clientes (condominios). El modulo mas complejo del sistema por su cascada de eliminacion.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/customers/{id}` | Por ID (AllowAnonymous) |
| `GET` | `api/customers/list/{stateId}` | Listar por estado |
| `POST` | `api/customers` | Crear (multipart) |
| `PUT` | `api/customers/{id}` | Actualizar (multipart) |
| `DELETE` | `api/customers/{id}` | Eliminar (cascada masiva) |
| `GET` | `api/customers/point-maps` | Puntos de mapa (PostGIS) |

**Reglas:** Delete: ~680 lineas, elimina en transaccion ~15 niveles de datos anidados (Tasks, Machinery, Employees, Properties, Access, etc.) + foto fisica. Telefonos sanitizados (solo digitos). Fotos 1000x1000. Limpieza de fotos huerfanas automatica. Puntos de mapa de `CustomerAddress.Ubicacion`.
