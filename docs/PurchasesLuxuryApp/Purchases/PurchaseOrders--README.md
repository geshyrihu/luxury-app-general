# OrdenCompra (Ordenes de Compra)

> **Modulo padre:** Purchases
> **Ultima actualizacion:** `2026-06-25`

Gestion completa de ordenes de compra: creacion desde cotizacion, fondeo, gastos fijos, vinculacion con solicitudes.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/OrdenCompra/{id}` | Por ID |
| `GET` | `api/OrdenCompra/GetForEdit/{id}` | Para edicion |
| `GET` | `api/OrdenCompra/list/{customerId}/{estatus}/{tipoGasto}` | Listar |
| `GET` | `api/OrdenCompra/Pdf/{id}` | Datos para PDF |
| `GET` | `api/OrdenCompra/SolicitudPago/{id}` | Datos para PDF solicitud pago |
| `POST` | `api/OrdenCompra/Fondeo` | Fondeo |
| `GET` | `api/OrdenCompra/Pagadas/{customerId}/{tipoGasto}` | Pagadas |
| `GET` | `api/OrdenCompra/OrdenesCompraGastosFijos/{customerId}/{estatus}` | Gastos fijos |
| `GET` | `api/OrdenCompra/CotizacionesRelacionadas/{solicitudCompraId}` | Cotizaciones vinculadas |
| `POST` | `api/OrdenCompra/{providerId}/{posicionCotizacion}/{solicitudCompraId?}` | Crear desde cotizacion |
| `POST` | `api/OrdenCompra/progressive-create` | Creacion progresiva |
| `POST` | `api/OrdenCompra/fuera-fondeo` | Fuera de fondeo |
| `PUT` | `api/OrdenCompra/{id}` | Actualizar |
| `PUT` | `api/OrdenCompra/UnlinkSolicitud/{id}` | Desvincular solicitud |
| `DELETE` | `api/OrdenCompra/{ordenCompraId}` | Eliminar |
| `GET` | `api/OrdenCompra/PendientesPorPagar/{customerId}` | Pendientes de pago |
| `POST` | `api/OrdenCompra/GenerarOrdenCompraFijos/{customerId}/{quincena}` | Generar gastos fijos |
| `GET` | `api/OrdenCompra/unlinked-orders/{customerId}` | Ordenes sin vinculo |
| `PUT` | `api/OrdenCompra/link-to-request/{ordenCompraId}/{solicitudCompraId}` | Vincular manual |
| `GET` | `api/OrdenCompra/link-manager-list/{customerId}` | Gestor de vinculos |

**Reglas:** Modulo extenso con flujo completo: cotizacion -> orden -> autorizacion -> pago. Soporta gastos fijos recurrentes por quincena.
