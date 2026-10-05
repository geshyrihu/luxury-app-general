# PurchaseOrderDetail (Detalle de Ordenes)

> **Modulo padre:** Purchases
> **Ultima actualizacion:** `2026-06-25`

Productos/partidas dentro de ordenes de compra.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/OrdenCompraDetalle/{id}` | Producto por ID |
| `GET` | `api/OrdenCompraDetalle/GetAllTotal/{ordenCompraId}` | Total detalles |
| `POST` | `api/OrdenCompraDetalle` | Crear producto |
| `PUT` | `api/OrdenCompraDetalle/{id}` | Actualizar |
| `DELETE` | `api/OrdenCompraDetalle/{id}` | Eliminar |
| `GET` | `api/OrdenCompraDetalle/AddProductoToOrder/{ordenCompraId}` | Productos disponibles |
