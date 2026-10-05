# Modulo: ExpenseCatalogBudget (Presupuesto de Gastos Fijos)

> **Area funcional:** Contabilidad / Presupuesto
> **Tag de version:** `v1.0`
> **Owner tecnico:** `@equipo-contabilidad`
> **Ultima actualizacion:** `2026-06-25`

---

## Vision General

Gestiona la asignacion presupuestal para las plantillas de gastos fijos (CatalogoGastosFijos). Cada registro vincula un catalogo de gasto fijo con una cuenta contable, un monto y un ano fiscal, definiendo el respaldo presupuestal para gastos recurrentes.

---

## Endpoints

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/CatalogoGastosFijosPresupuesto/PresupuestoOrdenCompraFijos/{catalogoGastosFijosId}` | Presupuestos por catalogo de gasto fijo |
| `POST` | `api/CatalogoGastosFijosPresupuesto` | Crear asignacion presupuestal |
| `PUT` | `api/CatalogoGastosFijosPresupuesto/{id}` | Actualizar asignacion presupuestal |
| `DELETE` | `api/CatalogoGastosFijosPresupuesto/{id}` | Eliminar asignacion presupuestal |

---

## Reglas de Negocio

1. Cada gasto fijo puede tener multiples asignaciones presupuestales (una por cuenta contable).
2. El monto asignado representa el presupuesto anual disponible para ese concepto de gasto.
3. Se integra con el modulo de PresupuestoShared para validar disponibilidad presupuestal contra Aspel.
