# Modulo: ExpenseCatalogDetail (Detalle de Gastos Fijos)

> **Area funcional:** Contabilidad / Gastos Recurrentes
> **Tag de version:** `v1.0`
> **Owner tecnico:** `@equipo-contabilidad`
> **Ultima actualizacion:** `2026-06-25`

---

## Vision General

Gestiona las lineas de detalle (productos, cantidades, precios) que componen un catalogo de gasto fijo. Funciona como la "orden de compra estandar" para gastos recurrentes, permitiendo definir los insumos y servicios asociados a cada plantilla.

---

## Endpoints

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/CatalogoGastosFijosDetalles` | Listar todos los detalles |
| `GET` | `.../DetallesOrdenCompraFijos/{id}` | Detalles con datos de producto |
| `GET` | `.../{id}` | Obtener detalle por ID |
| `GET` | `.../products/{catalogoGastosFijosId}` | Productos disponibles para seleccionar |
| `POST` | `api/CatalogoGastosFijosDetalles` | Crear detalle |
| `PUT` | `.../{id}` | Actualizar detalle |
| `DELETE` | `.../{id}` | Eliminar detalle |

---

## Reglas de Negocio

1. Cada linea de detalle incluye: producto, cantidad, precio unitario y unidad de medida.
2. Los productos disponibles se obtienen del catalogo de productos del sistema.
3. Al consultar detalles, se resuelve automaticamente el nombre del producto y la ruta de imagen.
