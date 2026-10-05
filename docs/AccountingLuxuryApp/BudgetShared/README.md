# Modulo: PresupuestoShared (Servicios Compartidos de Presupuesto)

> **Area funcional:** Contabilidad / Presupuesto
> **Tag de version:** `v1.0`
> **Owner tecnico:** `@equipo-contabilidad`
> **Ultima actualizacion:** `2026-06-25`

---

## Vision General

Modulo compartido de integracion con Aspel para presupuestos. Centraliza la logica de consulta a la API externa de Aspel COI, el mapeo de cuentas contables, el calculo de saldos/presupuestos y la preparacion de datos para ordenes de compra y catalogos de gastos fijos.

---

## Servicios

### AspelQuotationService
Servicio masivo que se conecta a la API externa de Aspel para obtener presupuestos contables.

| Metodo | Descripcion |
|--------|-------------|
| `GetAspelQuotation` | Presupuesto jerarquizado N1->N2->N3->N4, filtrado por rango 600-699 y reglas de exclusion |
| `GetAspelQuotationSummaryAsync` | Version resumida por cuentas padre nivel 1 |
| `GetAspelMirrorAsync` | Todas las cuentas sin filtrar |
| `ToPurchaseOrderSelectAsync` | Cuentas seleccionables para OC con presupuesto disponible y pagos pendientes |
| `GetAccountBudgetStatusAsync` | Estado de presupuesto de una cuenta individual |
| `FixedExpensesCatalogSelectAsync` | Cuentas para seleccion en catalogo de gastos fijos |

### HelperAspel
| Metodo | Descripcion |
|--------|-------------|
| `GetExtraAccounts` | Obtiene cuentas extra desde reglas de negocio |
| `IsBudgetValid` | Valida si una cuenta tiene presupuesto valido (presupuesto anual > 0 o gasto en algun mes) |

---

## Reglas de Negocio

1. **Filtro de rango presupuestal:** Por defecto se filtran cuentas en el rango 600-699 (gastos).
2. **Notificaciones SignalR:** Las operaciones de presupuesto notifican cambios en tiempo real a los clientes conectados.
3. **Cache de datos Aspel:** Los presupuestos se obtienen directamente de la API de Aspel COI con soporte de retry y backoff exponencial.
