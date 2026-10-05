# Modulo: Property (Directorio del Condominio)

> **Area funcional:** Operaciones / Propiedades
> **Owner tecnico:** `@equipo-operaciones`
> **Ultima actualizacion:** `2026-06-25`

---

Gestiona el directorio de propiedades (departamentos/unidades): torre, piso, area, indiviso, estacionamiento, bodega. Soporta importacion/exportacion Excel.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/Property/{id}` | Propiedad por ID con ocupantes |
| `GET` | `api/Property/list/{customerId}` | Lista ordenada por torre |
| `POST` | `api/Property` | Crear |
| `PUT` | `api/Property/{id}` | Actualizar |
| `DELETE` | `api/Property/{id}` | Eliminar |
| `POST` | `api/Property/import/{customerId}` | Importacion Excel (upsert masivo) |
| `GET` | `api/Property/download-template/{customerId}` | Descargar template Excel |
| `PATCH` | `api/Property/{id}/account-number` | Asignar numero de cuenta COI |

**Reglas:** Importacion Excel usa torre+departamento como clave compuesta.
