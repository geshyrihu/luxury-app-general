# PurchaseOrderBudget (Presupuesto de Ordenes)

> **Modulo padre:** Purchases
> **Ultima actualizacion:** `2026-06-25`

Asignacion de presupuesto a ordenes de compra.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/OrdenCompraPresupuesto/{id}` | Por ID |
| `GET` | `api/OrdenCompraPresupuesto/ByOrdenCompra/{ordenCompraId}` | Por orden |
| `GET` | `api/OrdenCompraPresupuesto/GetAllForOrdenCompraTotal/{ordenCompraId}` | Total presupuestos |
| `POST` | `api/OrdenCompraPresupuesto` | Crear |
| `PUT` | `api/OrdenCompraPresupuesto/{id}` | Actualizar |
| `DELETE` | `api/OrdenCompraPresupuesto/{id}` | Eliminar |
| `GET` | `api/OrdenCompraPresupuesto/edit/{id}` | Para edicion |
| `GET` | `api/OrdenCompraPresupuesto/total/{ordenCompraId}` | Total |
