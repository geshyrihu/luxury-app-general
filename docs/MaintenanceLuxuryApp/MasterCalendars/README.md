# Modulo: CalendarioMaestro (Calendario Maestro de Mantenimiento)

> **Area funcional:** Mantenimiento / Planificacion Anual
> **Owner tecnico:** `@equipo-mantenimiento`
> **Ultima actualizacion:** `2026-06-25`

---

Gestiona el calendario maestro global de eventos de mantenimiento programados para todo el ano. Solo accesible por SuperUsuario. Cada entrada se vincula a un equipo, mes y proveedores.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/CalendarioMaestro/{id}` | Entrada por ID con proveedores |
| `GET` | `api/CalendarioMaestro/list` | Lista agrupada por mes |
| `POST` | `api/CalendarioMaestro` | Crear entrada con proveedores |
| `PUT` | `api/CalendarioMaestro/{id}` | Actualizar entrada y sincronizar proveedores |
| `DELETE` | `api/CalendarioMaestro/{id}` | Eliminar entrada |
