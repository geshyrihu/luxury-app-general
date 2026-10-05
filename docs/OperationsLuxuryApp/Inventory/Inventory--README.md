# Modulo: Inventory (Inventario y Almacenes)

> **Area funcional:** Operaciones / Almacen
> **Owner tecnico:** `@equipo-operaciones`
> **Ultima actualizacion:** `2026-06-25`

---

Gestion completa de inventarios: catalogo de productos, almacenes, control de stock via Kardex (entradas/salidas), inventarios especializados (llaves, iluminacion, pintura, radios) y utilerias.

## Submodulos

| Modulo | Endpoint | Funcion |
|--------|----------|---------|
| Productos | `api/Productos` | CRUD + busqueda paginada |
| Almacenes | `api/Almacen` | CRUD + asignacion responsables |
| Stock | `api/InventarioProducto` | Stock por almacen |
| Entradas | `api/EntradaProducto` | Kardex In (incrementa stock) |
| Salidas | `api/SalidaProductos` | Kardex Out (decrementa stock) + reporte Excel + devoluciones |
| Llaves | `api/InventarioLlave` | Inventario de llaves |
| Iluminacion | `api/InventarioIluminacion` | Inventario de iluminacion |
| Pintura | `api/InventarioPintura` | Inventario de pintura |
| Radios | `api/RadioComunicacion` | Inventario de radios |
| Tools | — | Utilerias generales |

**Reglas:** Stock por producto+almacen. Entradas suman, salidas restan (con validacion de existencia). Autorizacion de almacen requerida para entradas.
