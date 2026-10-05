# Modulo: PropertyOccupant (Ocupantes de Propiedad)

> **Area funcional:** Operaciones / Propiedades
> **Owner tecnico:** `@equipo-operaciones`
> **Ultima actualizacion:** `2026-06-25`

---

Gestiona ocupantes temporales (inquilinos/residentes) asociados a una propiedad con fechas de inicio/fin.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/PropertyOccupant/{id}` | Ocupante por ID |
| `GET` | `api/PropertyOccupant/list/{propertyId}` | Lista por propiedad |
| `POST` | `api/PropertyOccupant` | Crear (StartDate = now) |
| `PUT` | `api/PropertyOccupant/{id}` | Actualizar |
| `DELETE` | `api/PropertyOccupant/{id}` | Eliminar |
