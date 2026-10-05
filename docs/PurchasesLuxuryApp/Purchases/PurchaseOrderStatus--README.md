# PurchaseOrderStatus (Estatus de Ordenes)

> **Modulo padre:** Purchases
> **Ultima actualizacion:** `2026-06-25`

Estatus y facturacion de ordenes de compra.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/OrdenCompraStatus/by-orden-compra/{ordenCompraId}` | Status por orden |
| `PUT` | `api/OrdenCompraStatus/{id}` | Actualizar status |
| `POST` | `api/OrdenCompraStatus/{ordenCompraId}/invoices` | Agregar factura (form) |
| `PUT` | `api/OrdenCompraStatus/invoices/{invoiceId}` | Actualizar archivo factura |
| `PATCH` | `api/OrdenCompraStatus/invoices/{invoiceId}/type` | Actualizar tipo comprobante |
| `DELETE` | `api/OrdenCompraStatus/invoices/{invoiceId}` | Eliminar factura |
