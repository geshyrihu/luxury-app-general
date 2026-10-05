# PurchaseOrderAuth (Autorizacion de Ordenes)

> **Modulo padre:** Purchases
> **Ultima actualizacion:** `2026-06-25`

Flujo de autorizacion de ordenes de compra.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/OrdenCompraAuth/Autorizar/{ordenCompraId}/{applicationUserId}` | Autorizar |
| `GET` | `api/OrdenCompraAuth/Desautorizar/{ordenCompraId}` | Desautorizar |
| `PUT` | `api/OrdenCompraAuth/NoAutorizada/{ordenCompraAuthId}/{applicationUserId}` | Marcar no autorizada |
