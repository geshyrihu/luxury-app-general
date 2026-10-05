# InventoryEngine (Sistemas de Motor)

> **Modulo padre:** Inventory
> **Ultima actualizacion:** `2026-06-25`

Consulta de sistemas de motor del inventario de maquinaria. Solo lectura.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/InventoryEngineSystem/List/{customerId}` | Sistemas de motor por cliente |

Delega a `IMachineryAppService.ListEngineSystemsAsync`.
