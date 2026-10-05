# Modulo: CatalogoGastosFijos (Catalogo de Gastos Fijos)

> **Area funcional:** Contabilidad / Gastos Recurrentes
> **Tag de version:** `v1.0`
> **Owner tecnico:** `@equipo-contabilidad`
> **Ultima actualizacion:** `2026-06-25`

---

## Vision General

Permite configurar plantillas de gastos recurrentes que pueden generar ordenes de compra automaticas. Cada gasto fijo se programa por quincena (1ra, 2da, o ambas) y puede asociarse a un proveedor, datos fiscales (UsoCFDI, MetodoPago, FormaPago), presupuesto contable y lineas de detalle (productos).

---

## Endpoints

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/CatalogoGastosFijos/{id}` | Obtiene un gasto fijo por ID |
| `GET` | `api/CatalogoGastosFijos/List/{customerId}` | Lista todos los gastos fijos de un cliente |
| `POST` | `api/CatalogoGastosFijos` | Crea un nuevo gasto fijo |
| `PUT` | `api/CatalogoGastosFijos/{id}` | Actualiza un gasto fijo |
| `GET` | `api/CatalogoGastosFijos/UpdateValidation/{id}/{value}` | Activa/desactiva generacion automatica de OC |
| `DELETE` | `api/CatalogoGastosFijos/{id}` | Elimina un gasto fijo (con cascada a detalles y presupuesto) |

---

## Reglas de Negocio

1. **Indice unico por cliente:** Cada gasto fijo tiene un indice en formato `major.minor` (ej. `1.0`, `2.3`). Si el indice solicitado ya existe, se auto-incrementa el minor.
2. **Generacion automatica de OC:** El flag `CrearOrdenCompra` controla si el sistema debe generar automaticamente una orden de compra cuando el gasto esta programado.
3. **Programacion quincenal:** Los gastos pueden ejecutarse en la 1ra quincena, 2da quincena, o ambas del mes.
4. **Borrado en cascada:** Al eliminar un gasto fijo se eliminan sus lineas de detalle y registros presupuestales asociados.
