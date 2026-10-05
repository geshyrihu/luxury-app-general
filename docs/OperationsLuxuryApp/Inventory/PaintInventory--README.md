# PaintInventory (Inventario de Pintura)

> **Modulo padre:** Inventory
> **Ultima actualizacion:** `2026-06-25`

Control de inventario de pintura por maquinaria y area.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/InventarioPintura/{id}` | Por ID |
| `GET` | `api/InventarioPintura/list/{customerId}` | Listar por cliente |
| `POST` | `api/InventarioPintura` | Crear |
| `PUT` | `api/InventarioPintura/{id}` | Actualizar |
| `DELETE` | `api/InventarioPintura/{id}` | Eliminar |

**Reglas:** CRUD completo. Similar a Lighting pero sin path de imagen calculado. Filtra por `Machinery.CustomerId`.
