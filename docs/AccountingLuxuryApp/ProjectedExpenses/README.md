# Modulo: ProjectedExpenses (Gastos Proyectados / Flujo de Caja)

> **Area funcional:** Contabilidad / Flujo de Caja
> **Tag de version:** `v1.0`
> **Owner tecnico:** `@equipo-contabilidad`
> **Ultima actualizacion:** `2026-06-25`

---

## Vision General

Modulo de planificacion de flujo de caja. Gestiona gastos proyectados (ejecucion presupuestaria - `BudgetExecution`) con origen en: entrada manual, sincronizacion con calendario de mantenimiento, y recurrencia automatica (mensual/bimestral/trimestral/semestral/anual). Incluye notificaciones SignalR en tiempo real.

---

## Endpoints

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/ProjectedExpenses/{customerId}` | Listar todos los gastos proyectados |
| `GET` | `api/ProjectedExpenses/{customerId}/{id}` | Obtener gasto por ID |
| `GET` | `.../by-account-id/{customerId}/{month}/{accountNumber}` | Gasto proy. por cuenta y mes |
| `POST` | `api/ProjectedExpenses` | Crear gasto proyectado |
| `POST` | `.../recurrence` | Crear/actualizar recurrencia de gasto |
| `PUT` | `api/ProjectedExpenses/{customerId}/{id}` | Actualizar gasto proyectado |
| `DELETE` | `api/ProjectedExpenses/{customerId}/{id}` | Eliminar gasto proyectado |

---

## Reglas de Negocio

1. **Sincronizacion con calendario:** Al listar gastos, primero se sincronizan los datos desde `MaintenanceCalendar` hacia `BudgetExecution`, creando/actualizando/eliminando registros para mantener coherencia.
2. **Recurrencia:** Los gastos pueden configurarse como eventuales o recurrentes (mensual, bimestral, trimestral, cuatrimestral, semestral, anual). La recurrencia calcula los meses afectados y crea/actualiza/elimina registros en masa.
3. **Notificaciones en tiempo real:** Todas las operaciones (crear, actualizar, eliminar, sincronizar) notifican via SignalR para actualizar dashboards de flujo de caja en vivo.
