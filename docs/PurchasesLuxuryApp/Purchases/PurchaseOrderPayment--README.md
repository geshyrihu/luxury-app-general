# PurchaseOrderPayment (Pago de Ordenes)

> **Modulo padre:** Purchases
> **Ultima actualizacion:** `2026-06-25`

Datos de pago y comprobantes de ordenes de compra.

## OrdenCompraDatosPago (`api/OrdenCompraDatosPago`)

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `{id}` | Datos de pago |
| `PUT` | `{id}` | Actualizar |

## OrdenCompraComprobantePago (`api/OrdenCompraComprobantePago`)

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `POST` | `{ordenCompraId}` | Subir comprobante |
| `DELETE` | `{id}` | Eliminar comprobante |
