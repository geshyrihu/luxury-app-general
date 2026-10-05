# PaymentMethod (Formas de Pago SAT)

> **Area:** Sistema / Catalogos
> **Ultima actualizacion:** `2026-06-25`

Catalogo SAT de formas de pago (Efectivo, Transferencia, Tarjeta...). Solo `SuperUsuario`.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/payment-methods` | Listar |
| `GET` | `api/payment-methods/{id}` | Por ID |
| `POST` | `api/payment-methods` | Crear |
| `PUT` | `api/payment-methods/{id}` | Actualizar |
| `DELETE` | `api/payment-methods/{id}` | Eliminar |

**Reglas:** Ordenado por `Descripcion`. Entidad: `FormaPago`.
