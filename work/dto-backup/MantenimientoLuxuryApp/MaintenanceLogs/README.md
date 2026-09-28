# Modulo: MaintenanceLog (Bitacora de Mantenimiento)

> **Area funcional:** Mantenimiento / Operaciones
> **Owner tecnico:** `@equipo-mantenimiento`
> **Ultima actualizacion:** `2026-06-25`

---

Bitacora general de actividades de mantenimiento. Registra cualquier evento, falla o reparacion realizada en equipos.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/BitacoraMantenimiento/{id}` | Entrada por ID |
| `GET` | `api/BitacoraMantenimiento/list/{customerId}/{startDate}/{finalDate}` | Lista por rango de fechas |
| `GET` | `api/BitacoraMantenimiento/BitacoraIndividual/{machineryId}/{startDate}/{finalDate}` | Bitacora de un equipo especifico |
| `GET` | `api/BitacoraMantenimiento/BitacoraDashboard/{customerId}/{startDate}/{finalDate}` | Vista dashboard |
| `POST` | `api/BitacoraMantenimiento` | Crear |
| `DELETE` | `api/BitacoraMantenimiento/{id}` | Eliminar |

**Regla:** Sin endpoint de actualizacion (inmutable despues de creada). `FechaRegistro` se auto-asigna en UTC.
