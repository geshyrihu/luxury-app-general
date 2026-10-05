# CustomerAddress (Direccion del Cliente)

> **Area:** Sistema / Clientes
> **Ultima actualizacion:** `2026-06-25`

Direccion geografica del cliente/condominio con coordenadas PostGIS.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/customer-addresses/{customerId}` | Direccion por cliente |
| `PUT` | `api/customer-addresses` | Actualizar |

**Reglas:** Auto-crea direccion vacia si no existe. Coordenadas via `NetTopologySuite` (SRID 4326). Lat/Lng solo si ambos distintos de cero.
