# Modulo: Piscina (Gestion de Albercas)

> **Area funcional:** Mantenimiento / Amenidades
> **Owner tecnico:** `@equipo-mantenimiento`
> **Ultima actualizacion:** `2026-06-25`

---

Gestiona el inventario de albercas/piscinas del inmueble: nombre, especificaciones tecnicas, volumen, fotos.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/piscina/{id}` | Alberca por ID |
| `GET` | `api/piscina/list/{customerId}` | Lista por cliente |
| `POST` | `api/piscina` | Crear (multipart con foto) |
| `PUT` | `api/piscina/{id}` | Actualizar |
| `DELETE` | `api/piscina/{id}` | Eliminar |
