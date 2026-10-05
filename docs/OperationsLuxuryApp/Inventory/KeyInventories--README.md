# KeyInventory (Inventario de Llaves)

> **Modulo padre:** Inventory
> **Ultima actualizacion:** `2026-06-25`

Control de inventario de llaves de cuartos de maquinas, amenidades y areas restringidas.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/InventarioLlave/{id}` | Por ID |
| `GET` | `api/InventarioLlave/list/{customerId}` | Listar por cliente |
| `POST` | `api/InventarioLlave` | Crear |
| `PUT` | `api/InventarioLlave/{id}` | Actualizar |
| `DELETE` | `api/InventarioLlave/{id}` | Eliminar |

**Reglas:** CRUD completo. Incluye `NumeroLlave`, `Cantidad`, `EquipoClasificacion`. Ordenado por clasificacion.
