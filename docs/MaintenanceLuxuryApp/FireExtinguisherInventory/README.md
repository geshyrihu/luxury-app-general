# Modulo: FireExtinguisherInventory (Inventario de Extintores)

> **Area funcional:** Mantenimiento / Seguridad Contra Incendios
> **Owner tecnico:** `@equipo-mantenimiento`
> **Ultima actualizacion:** `2026-06-25`

---

Gestiona el inventario de extintores: ubicacion, tipo, fecha de vencimiento, fotos. Soporte para actualizacion masiva de vencimientos y vista agrupada.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/Equipment/{id}` | Extintor por ID (con foto) |
| `GET` | `api/Equipment/list/{customerId}` | Lista por cliente |
| `GET` | `api/Equipment/GetAllGroup/{customerId}` | Vista agrupada por tipo y ubicacion |
| `POST` | `api/Equipment` | Crear (multipart con foto) |
| `PUT` | `api/Equipment/{id}` | Actualizar |
| `DELETE` | `api/Equipment/{id}` | Eliminar |
| `PUT` | `api/Equipment/bulk-expiration/{customerId}` | Actualizacion masiva de vencimiento |
