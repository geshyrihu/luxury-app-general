# Modulo: MaintenanceReport (Reportes de Mantenimiento)

> **Area funcional:** Contabilidad / Reportes Operativos
> **Tag de version:** `v1.0`
> **Owner tecnico:** `@equipo-contabilidad`
> **Ultima actualizacion:** `2026-06-25`

---

## Vision General

Modulo de reportes operativos de mantenimiento. Proporciona dashboards y reportes sobre ordenes de servicio, consumo de medidores, bitacora diaria, inventario (entradas/salidas/herramientas), calidad de alberca, compras y tickets de trabajo.

---

## Endpoints

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/MaintenanceReport/resumen/{customerId}/{periodo}` | Resumen de ordenes de servicio por tipo de mantenimiento |
| `GET` | `.../proveedor/{customerId}/{periodo}` | Reporte por proveedor |
| `GET` | `.../DataGraficoMensual/{customerId}/{periodo}` | Graficos mensuales de medidores (agua/luz/gas) |
| `POST` | `.../WeeklyExecutiveReport` | Reporte ejecutivo semanal de consumo |
| `GET` | `.../bitacoradiaria/{customerId}/{periodo}` | Bitacora diaria de mantenimiento |
| `GET` | `.../entradaproducto/{customerId}/{periodo}` | Entradas de producto a almacen |
| `GET` | `.../salidaproducto/{customerId}/{periodo}` | Salidas de producto de almacen |
| `GET` | `.../presatamoherramienta/{customerId}/{periodo}` | Prestamo de herramientas |
| `GET` | `.../bitacoraalbercaparametros/{customerId}/{periodo}` | Parametros de bitacora de alberca (Cloro, Ph, Alcalinidad, Dureza, Temperatura) |
| `GET` | `.../solicitudinsumos/{customerId}/{periodo}` | Reporte de compras (solicitudes y ordenes) |
| `GET` | `.../Ticket/{customerId}/{periodo}` | Tickets de mantenimiento |
| `GET` | `.../TicketResponsable/{customerId}/{periodo}` | Tickets por responsable |
| `GET` | `.../CargaTicket/{customerId}/{periodo}` | Tickets por creador |
