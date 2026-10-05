# CustomerImage (Galeria de Imagenes del Cliente)

> **Area:** Sistema / Clientes
> **Ultima actualizacion:** `2026-06-25`

Gestion de imagenes de galeria por cliente con soporte bulk.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/customer-images/{customerId}` | Imagenes por cliente |
| `POST` | `api/customer-images` | Agregar imagen |
| `POST` | `api/customer-images/bulk` | Agregar multiples |
| `DELETE` | `api/customer-images/{id}` | Eliminar |

**Reglas:** Imagenes redimensionadas a 2000x2000. Almacenadas por cliente. Archivo fisico eliminado al borrar registro.
