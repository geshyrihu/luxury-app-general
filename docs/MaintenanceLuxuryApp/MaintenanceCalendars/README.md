# Modulo: MaintenanceCalendars (Calendario de Mantenimiento)

> **Area funcional:** Mantenimiento / Planificacion
> **Owner tecnico:** `@equipo-mantenimiento`
> **Ultima actualizacion:** `2026-06-25`

---

Modulo central de planificacion de mantenimiento. Define actividades recurrentes/eventuales para cada maquinaria, con precios, proveedores y vinculacion al catalogo contable. Crea registros de `BudgetExecution` para proyecciones financieras y notifica cambios via SignalR.

## Endpoints

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/MaintenanceCalendars/Get/{id}` | Entrada con proveedor, equipo, catalogo |
| `GET` | `api/MaintenanceCalendars/GetOfMachinery/{machineryId}` | Entradas por maquinaria |
| `GET` | `api/MaintenanceCalendars/list/{customerId}/{month}` | Entradas por cliente y mes |
| `POST` | `api/MaintenanceCalendars` | Crear con expansion de recurrencia |
| `PUT` | `api/MaintenanceCalendars/{id}` | Actualizar con sincronizacion completa |
| `DELETE` | `api/MaintenanceCalendars/{id}` | Eliminar con BudgetExecution asociado |
| `GET` | `api/MaintenanceCalendars/CronogramaAnual/{customerId}` | Matriz anual (equipos x meses) |
| `GET` | `api/MaintenanceCalendars/ProveedoresCalendario/{customerId}` | Proveedores distinct del calendario |
| `GET` | `api/MaintenanceCalendars/ExportCalendar/{customerId}` | Exportar calendario |

## Reglas de Negocio

1. **Expansion por recurrencia:** Al crear, expande una entrada en multiples meses segun `ERecurrence` (Eventual, Mensual, Bimestral, Trimestral, Semestral, Anual).
2. **Duplicacion:** Evita crear entradas duplicadas para misma maquinaria+mes.
3. **Integracion financiera:** Cuando `Price > 0 && AccountingCatalogId != Guid.Empty`, crea registros `BudgetExecution` y notifica SignalR.
4. **Actualizacion compleja:** Si cambia el nombre de actividad, actualiza ServiceOrders pendientes. Calcula diferencias entre meses anteriores/nuevos y crea/actualiza/elimina BudgetExecution segun corresponda.
5. **Modalidad de ejecución:** `IsInternalExecution` distingue personal interno de ejecución externa sin inferirlo de `ProviderId`. Calendario externo requiere proveedor; interno limpia proveedor. Cambios se propagan a órdenes vinculadas pendientes, no a órdenes finales.
