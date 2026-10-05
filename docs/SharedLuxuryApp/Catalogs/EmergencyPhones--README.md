# TelefonosEmergencia (Telefonos de Emergencia)

> **Area:** Sistema / Catalogos
> **Ultima actualizacion:** `2026-06-25`

Directorio de numeros de emergencia con logo. Cualquier usuario autenticado.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/TelefonosEmergencia/{id}` | Por ID |
| `GET` | `api/TelefonosEmergencia` | Listar |
| `POST` | `api/TelefonosEmergencia` | Crear (form con logo) |
| `PUT` | `api/TelefonosEmergencia/{id}` | Actualizar (form) |
| `DELETE` | `api/TelefonosEmergencia/{id}` | Eliminar + logo |

**Reglas:** `[FromForm]` con subida de logo via `IImageStorageService`. Logo reemplazado en update, eliminado en delete.
