# Tools (Herramientas)

> **Modulo padre:** Inventory
> **Ultima actualizacion:** `2026-06-25`

Control de inventario de herramientas con soporte de archivos.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/Tools/Get/{id}` | Por ID |
| `GET` | `api/Tools/{customerId}` | Listar por cliente |
| `POST` | `api/Tools` | Crear (form) |
| `PUT` | `api/Tools/{id}` | Actualizar (form) |
| `DELETE` | `api/Tools/{id}` | Eliminar |

**Reglas:** Delega a `IToolAppService`. Soporta subida de archivos via `[FromForm]`.
