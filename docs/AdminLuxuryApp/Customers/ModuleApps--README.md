# ModuleApps (Modulos de Aplicacion)

> **Area:** Sistema / Clientes
> **Ultima actualizacion:** `2026-06-25`

Definicion de la estructura de navegacion de la aplicacion (menu). Jerarquico por `PathParent`.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/module-apps` | Listar |
| `GET` | `api/module-apps/{id}` | Por ID |
| `POST` | `api/module-apps` | Crear |
| `PUT` | `api/module-apps/{id}` | Actualizar |
| `DELETE` | `api/module-apps/{id}` | Eliminar (cascada a ModuleAppRol + CustomerModul) |

**Reglas:** Solo `SuperUsuario`. `RouterLink`, `Icon`, `Label` para renderizado frontend. `ViewMobil` controla visibilidad mobile.
