# RadioComunicacion (Equipos de Radiocomunicacion)

> **Modulo padre:** Inventory
> **Ultima actualizacion:** `2026-06-25`

Control de equipos de radiocomunicacion con foto.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/RadioComunicacion/{id}` | Por ID |
| `GET` | `api/RadioComunicacion/List/{customerId}` | Listar por cliente |
| `POST` | `api/RadioComunicacion` | Crear (form con foto) |
| `PUT` | `api/RadioComunicacion/{id}` | Actualizar (form) |
| `DELETE` | `api/RadioComunicacion/{id}` | Eliminar (+ foto) |

**Reglas:** CRUD con manejo de imagenes via `IImageStorageService`. Foto reemplazada en update, eliminada en delete. Incluye `ApplicationUser`.
