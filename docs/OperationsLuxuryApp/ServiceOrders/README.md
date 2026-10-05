# Modulo: ServiceOrder (Ordenes de Servicio)

> **Area funcional:** Operaciones / Mantenimiento
> **Owner tecnico:** `@equipo-operaciones`
> **Ultima actualizacion:** `2026-06-25`

---

Gestiona ordenes de servicio de mantenimiento (correctivo/preventivo/pintura): creacion, evidencia fotografica, reportes de proveedor, integracion con calendario y reportes mensuales.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/ServiceOrders/{id}` | OS por ID |
| `GET` | `.../list/{customerId}/{fecha}` | OS por cliente + mes |
| `GET` | `.../pending-preventive/{customerId}` | Preventivas pendientes |
| `POST` | `api/ServiceOrders` | Crear (auto-genera desde calendario) |
| `POST` | `.../SubirImg/{serviceOrderId}` | Subir fotos |
| `POST` | `.../SubirDocumento/{serviceOrderId}` | Subir documentos proveedor |
| `GET` | `.../OrdenesServicioFotos/{id}/{customerId}` | Fotos de una OS |
| `GET` | `.../OrdenesServicioReporteProveedor/{id}/{customerId}` | Docs de proveedor |
| `GET` | `.../Informe/{customerId}/{idMonth}/{idYear}` | Reporte mensual |
| `PUT` | `api/ServiceOrders/{id}` | Actualizar |
| `DELETE` | `api/ServiceOrders/{id}` | Eliminar |
| `POST` | `api/ServiceOrders/{id}/suspend` | Suspender (motivo + notas) sin cambiar estatus |
| `POST` | `api/ServiceOrders/{id}/resume` | Reanudar OS suspendida |
| `GET` | `api/service-order-suspension-reasons/list/{customerId}` | Motivos de suspensión del cliente |
| `POST` | `api/service-order-suspension-reasons/{customerId}` | Crear motivo |
| `PUT/DELETE` | `api/service-order-suspension-reasons/{id}` | Actualizar / eliminar motivo |
| `GET` | `api/service-order-follow-ups/list/{serviceOrderId}` | Seguimientos de una OS |
| `POST` | `api/service-order-follow-ups` | Crear seguimiento |
| `DELETE` | `api/service-order-follow-ups/{id}` | Eliminar seguimiento |

**Reglas:** Auto-genera OS desde calendario de mantenimiento para mes actual/siguiente. Asigna responsable automaticamente (JefeMantenimiento/JefeSistemas). Fotos almacenadas por customerId + ano-mes. Una OS puede **suspenderse sin cambiar su estatus** (por ejemplo, falta de presupuesto) registrando motivo catalogado por cliente, notas, fecha y usuario. El **seguimiento** es una bitácora de notas por OS (sin imágenes), con autor y fecha.

`IsInternalExecution` identifica órdenes realizadas por personal interno y se captura también en órdenes manuales. Las órdenes creadas desde calendario heredan la modalidad del calendario. En modo interno se limpia `ProviderId`; en modo externo el proveedor sigue opcional en la orden.
