# Modulo: Presupuesto (Reglas de Cuentas Presupuestales)

> **Area funcional:** Contabilidad / Presupuesto
> **Tag de version:** `v1.0`
> **Owner tecnico:** `@equipo-contabilidad`
> **Ultima actualizacion:** `2026-06-25`

---

## Vision General

Define reglas de negocio para cuentas presupuestales. Los tipos de regla (`EAccountRuleType`) controlan comportamientos como exclusion de cuentas, cuentas extra u otras reglas en el presupuesto automatico. Sirve como configuracion para el modulo PresupuestoShared.

---

## Endpoints

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/BudgetAccountRules/{customerId}` | Listar reglas por cliente (incluye reglas globales) |
| `POST` | `api/BudgetAccountRules` | Crear nueva regla |
| `PUT` | `api/BudgetAccountRules/{id}` | Actualizar regla |
| `DELETE` | `api/BudgetAccountRules/{id}` | Eliminar regla |

---

## Reglas de Negocio

1. **Reglas globales y especificas:** Las reglas pueden ser globales (`CustomerId = Guid.Empty`) o especificas por cliente.
2. **Unicidad:** No puede existir mas de una regla del mismo tipo para la misma cuenta en el mismo cliente.
3. **Tipos de regla:** Los tipos disponibles incluyen exclusion de cuentas presupuestales y definicion de cuentas extra para calculos presupuestarios.
