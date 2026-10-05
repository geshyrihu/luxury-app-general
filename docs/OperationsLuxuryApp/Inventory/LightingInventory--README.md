# LightingInventory (Inventario de Iluminacion)

> **Modulo padre:** Inventory
> **Ultima actualizacion:** `2026-06-25`

Control de inventario de iluminacion por maquinaria y area.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/InventarioIluminacion/{id}` | Por ID |
| `GET` | `api/InventarioIluminacion/list/{customerId}` | Listar por cliente |
| `POST` | `api/InventarioIluminacion` | Crear |
| `PUT` | `api/InventarioIluminacion/{id}` | Actualizar |
| `DELETE` | `api/InventarioIluminacion/{id}` | Eliminar |

**Reglas:** CRUD completo. Agrupa por producto (Marca + Nombre + Modelo) con imagen. Incluye `Machinery` y `Producto`.
