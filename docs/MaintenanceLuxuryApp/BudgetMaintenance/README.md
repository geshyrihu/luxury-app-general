# Modulo: BudgetMaintenance (Presupuesto de Mantenimiento)

> **Area funcional:** Mantenimiento / Presupuesto
> **Owner tecnico:** `@equipo-mantenimiento`
> **Ultima actualizacion:** `2026-06-25`

---

Delega a `MaintenanceCalendarAppService` para retornar resumenes de gastos agrupados por catalogo contable.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/BudgetMaintenance/SummaryOfExpenses/{customerId}` | Gastos agrupados por catalogo contable |
| `GET` | `api/BudgetMaintenance/ResumenGastos/{customerId}` | Promedio mensual por cuenta contable |
