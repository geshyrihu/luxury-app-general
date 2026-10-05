**Ruta:** shared/ui/mobile/data-view-mobile/
**Fecha:** 10-jul-26
**Estado:** Auditoría

---

# Auditoría: Candidatos a `<app-data-view-mobile>`

Análisis de componentes con `<p-table>` que **NO** usan `<app-data-view-mobile>` y podrían necesitarla.

---

## Resumen Ejecutivo

| Categoría                                                 | Cantidad |
| --------------------------------------------------------- | -------- |
| **Candidato fuerte (P1)** — Lista CRUD limpia             | **15**   |
| **Ya tiene mobile (P0)** — Verificar plantilla            | **4**    |
| **Candidato posible (P2)** — Requiere evaluación          | **14**   |
| **No candidato** — Form, modal, detail, report, dashboard | **87**   |

---

## P0 — Ya tienen wrapper mobile (verificar plantilla)

Estos archivos ya tienen `hidden md:block` + sección mobile debajo. Verificar que la plantilla mobile cumple el estándar.

| #   | Archivo                                                                                          | Notas                   |
| --- | ------------------------------------------------------------------------------------------------ | ----------------------- |
| 1   | `features/maintenance/equipos-y-maquinaria/machinery/service-history-machinery.html`             | Ya tiene sección mobile |
| 2   | `features/operations/task/recurring-tasks/instances/daily-task-list/daily-task-list.html` | Ya tiene sección mobile |
| 3   | `features/operations/task/tasks/my-tasks/pages/my-tasks-list.html`                        | Ya tiene sección mobile |
| 4   | `apps/admin.luxuryapp/reportes/access-history/bitacora-acceso-list.html`                         | Ya tiene sección mobile |

---

## P1 — Candidatos fuertes (15 archivos)

Listas CRUD limpias con paginator, filtros, y acciones de fila. Ideales para `<app-data-view-mobile>`.

| #   | Archivo                                                                                                                          | Módulo        | DESCRIPCIÓN                            |
| --- | -------------------------------------------------------------------------------------------------------------------------------- | ------------- | -------------------------------------- |
| 1   | `features/maintenance/equipos-y-maquinaria/equipment-inspections/equipment-inspection-definitions-list.html`                     | Mantenimiento | Definiciones de inspección de equipos  |
| 2   | `features/maintenance/equipos-y-maquinaria/equipment-inspections/equipment-inspection-execution-history-list.html`               | Mantenimiento | Historial de ejecución de inspecciones |
| 3   | `features/maintenance/equipos-y-maquinaria/equipment-inspections/equipment-inspection-qr-list.html`                              | Mantenimiento | Lista QR de inspecciones               |
| 4   | `features/operations/reports/contracts-policies/contracts-policies`                                                              | Operaciones   | Contratos y pólizas                    |
| 5   | `features/operations/task/tasks/reports/pages/task-operation-report.html`                                                 | Tareas        | Reporte semanal de operaciones         |
| 6   | `features/operations/task/tasks/reports/pages/task-report-work-plan.html`                                                 | Tareas        | Plan de trabajo                        |
| 7   | `features/operations/supervision/supervision/agenda-supervision/agenda-supervision.html`                                         | Supervisión   | Agenda de supervisión                  |
| 8   | `features/operations/supervision/supervision/filtro-minutas-area/filtro-minutas-area.html`                                       | Supervisión   | Filtro de minutas por área             |
| 9   | `features/operations/supervision/supervision/resultado-general-evaluacion-areas/resultado-general-evaluacion-areas-detalle.html` | Supervisión   | Detalle de evaluación por áreas        |
| 10  | `features/operations/dashboard/unified-pending-dashboard.html`                                                                   | Dashboard     | Panel de pendientes unificado          |
| 11  | `features/operations/properties/entrega-recepcion-cliente/entrega-recepcion-cliente.html`                                        | Propiedades   | Entrega-recepción cliente              |
| 12  | `features/maintenance/logs/maintenance-log/bitacora-individual.html`                                                             | Mantenimiento | Bitácora individual                    |
| 13  | `features/maintenance/logs/maintenance-log/bitacora-mantenimiento.html`                                                          | Mantenimiento | Bitácora de mantenimiento              |
| 14  | `features/maintenance/planificacin-de-mantenimiento/calendario-maestro-equipo/calendario-maestro-equipo.html`                    | Mantenimiento | Calendario maestro de equipo           |
| 15  | `features/operations/meetings/juntas-comite/junta-comite-minutas/resumen-minuta.html`                                            | Reuniones     | Resumen de minuta                      |

---

## P2 — Candidatos posibles (14 archivos)

Requieren evaluación. Pueden tener layout agrupado, tablas comparativas, o contexto especial.

| #   | Archivo                                                                                                           | Módulo        | Razón para evaluar                        |
| --- | ----------------------------------------------------------------------------------------------------------------- | ------------- | ----------------------------------------- |
| 1   | `apps/admin.luxuryapp/security-permissions/approval-rules/approval-rules`                                           | Admin         | Matriz de aprobación con badges de estado |
| 2   | `features/accounting/general-ledger/cobranza-nativa/pages/charge-template-coverage/charge-template-coverage.html` | Contabilidad  | Filas agrupadas con subheaders            |
| 3   | `features/operations/supervision/supervision/reporte-tickets/reporte-tickets.html`                                | Supervisión   | Reporte de tickets con `hidden md:block`  |
| 4   | `features/accounting/general-ledger/contabilidad-online/pages/validacion-catalogo/catalog-replica.html`           | Contabilidad  | Árbol con filas expandibles               |
| 5   | `features/operations/properties/entrega-recepcion/entrega-recepcion-equipos.html`                                 | Propiedades   | Inventario con filas agrupadas            |
| 6   | `features/operations/properties/entrega-recepcion/entrega-recepcion-herramientas.html`                            | Propiedades   | Inventario de herramientas                |
| 7   | `features/operations/properties/entrega-recepcion/entrega-recepcion-hidrantes.html`                               | Propiedades   | Inventario de hidrantes                   |
| 8   | `features/operations/properties/entrega-recepcion/entrega-recepcion-instalaciones.html`                           | Propiedades   | Inventario de instalaciones               |
| 9   | `features/operations/properties/entrega-recepcion/entrega-recepcion-insumos.html`                                 | Propiedades   | Inventario de insumos                     |
| 10  | `features/operations/properties/entrega-recepcion/entrega-recepcion-llaves.html`                                  | Propiedades   | Inventario de llaves                      |
| 11  | `features/operations/service-orders/service-order/ordenes-servicio-reporte-proveedor.html`                         | Field Service | Reporte proveedor (3 columnas simples)    |
| 12  | `features/operations/service-orders/service-order/resumen-ordenes-servicio.html`                                   | Field Service | Resumen de órdenes de servicio            |
| 13  | `features/accounting/general-ledger/cobranza-online/pages/dashboard/cobranza-online-dashboard.html`               | Contabilidad  | Dashboard con `hidden md:block`           |
| 14  | `features/operations/inspecciones-y-auditora/inspection/lista-inspecciones/lista-inspecciones.html`               | Inspecciones  | Lista de inspecciones                     |

---

## No candidatos (87 archivos)

### Forms (10)

- `catalogo-gasto-fijo-form.html` (×2 paths)
- `gasto-fijo-presupuesto.html` (×2 paths)
- `gasto-fijo-servicios.html` (×2 paths)
- `vacaciones-pasadas-registro.html`
- `orden-compra-detalle-add-producto.html`
- `purchase-request-add-product-form.html`
- `product-modal-add.html`

### Modals / Dialogs (12)

- `budget-execution-details-modal.html`
- `budget-forecast-dialog.html`
- `budget-history-dialog.html`
- `modal-dias-no-habiles.html`
- `modal-prestamo-detalle.html`
- `payment-detail-modal.html`
- `cobranza-online-inspection-history-modal.html`
- `aspel-cobranza-haus-debt-detail-modal.html`
- `sat-reconciliation-dialog.html` (×2 paths)
- `payment-voucher-modal.html`
- `junta-mensual-session-checklist-dialog.html`
- `funding-upload-invoices-modal.html`

### Details / Wizards (12)

- `funding-detail.html`
- `funding-purchase-detail.html`
- `sat-funding-detail.html` (×2 paths)
- `funding-accounting-detail.html` (×2 paths)
- `equipment-inspection-execution-detail.html`
- `orden-compra.html`
- `solicitud-compra-detalle.html`
- `solicitud-compra-presentacion.html`
- `create-orden-compra-wizard.html`
- `employee-file-detail.html`
- `mi-edificio.html`
- `property-occupant-manager.html`

### Reports / Dashboards (35)

- `report-consumos.html`
- `report-entrada-almacen.html`
- `report-prestamo-herramienta.html`
- `report-recorrido-diario.html`
- `report-salida-almacen.html`
- `report-solicitud-compra.html`
- `report-ticket.html`
- `resumen-mantenimientos.html`
- `estados-financieros.html`
- `gastos-mantenimiento.html`
- `pending-minutes.html`
- `report-meeting.html`
- `task-report-resumen.html`
- `task-report-work-plan-preview.html`
- `send-operation-report.html`
- `resultado-general-dashboard.html`
- `resultado-general-evaluacion-areas.html`
- `resultado-general-posicion.html`
- `minutas-resumen.html`
- `cedula-presupuestal.html`
- `balance-mensual.html`
- `proyectos-aprobados.html`
- `analisis-cobranza.html`
- `bancos-inversiones.html`
- `analisis-cobranza-cliente.html`
- `bancos-inversiones-cliente.html`
- `estado-resultados-cliente.html`
- `estado-resultados-v2-cliente.html`
- `flujo-efectivo-cliente.html`
- `proyectos-aprobados-cliente.html`
- `espejo-aspel-full.html`
- `financial-summary.html`
- `reporte-envio-financieros.html`
- `recepcion-pipas-agua-reporte.html`
- `cronograma-anual-mantenimiento.html`

### Embedded Lists / Other (18)

- `cuadro-comparativo-list.html` (×2 paths) — Tabla comparativa compleja
- `cuadro-comparativo-cotizacion.html` (×2 paths)
- `meeting-detail-form.html`
- `meeting-area-table.html`
- `juntas-mensuales-session.html`
- `orden-compra-presupuesto.html`
- `purchase-request-products.html`
- `solicitud-compra-detalle.html`
- `orden-compra-facturas-parcial.html`
- `orden-compra-factura-form.html`
- `entrega-recepcion-check.html`
- `incident-attachments.html`
- `incident-witnesses.html`
- `suspension-days-manager.html`
- `incident-dashboard.html`
- `payments.html` (cobranza)
- `native-statement.html`
- `vacaciones-admin-auditoria.html`
- `vacaciones-saldo.html`
- `staff-board.html` (×2 paths)
- `brevo-email-logs.html`
- `juntas-mensuales-backfill.html`
- `catalog-guia.html`
- `charge-template-coverage.html`
- `aspel-cobranza-haus.html`
- `autitoria-cuentas-aspel.html`
- `cont-minuta-seguimientos.html`

---

## Recomendación

1. **Priorizar P1 (15 archivos)** — Son listas CRUD estándar que encajan directamente con el patrón de `bank-list.html`.
2. **Verificar P0 (4 archivos)** — Ya tienen mobile, asegurar que cumple estándar (no h3, no ion-no-padding, action-menu end directo).
3. **Evaluar P2 (14 archivos)** — Revisar caso por caso; algunos pueden necesitar layout mobile diferente (cards agrupados, etc.).
