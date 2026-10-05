# Modulo: ProviderQualification (Calificacion de Proveedores)

> **Area funcional:** Compras / Proveedores
> **Owner tecnico:** `@equipo-compras`
> **Ultima actualizacion:** `2026-06-25`

---

Gestiona la calificacion de proveedores por parte de los usuarios del sistema. Evalua tres categorias (Precio, Servicio, Entrega) con puntuaciones del 1 al 5.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/qualification-provider/{userId}/{providerId}` | Calificacion de un usuario a un proveedor |
| `GET` | `api/qualification-provider` | Todas las calificaciones |
| `POST` | `api/qualification-provider` | Crear |
| `PUT` | `api/qualification-provider/{id}` | Actualizar |
| `DELETE` | `api/qualification-provider/{id}` | Eliminar |

**Reglas:** Puntuacion 1-5 en Precio, Servicio y Entrega. Las calificaciones promedio se exponen en `ProviderIndexDTO`.
