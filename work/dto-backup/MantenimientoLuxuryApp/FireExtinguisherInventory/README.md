# Modulo: FireExtinguisherInventory (Inventario de Extintores)

> **Area funcional:** Mantenimiento / Seguridad Contra Incendios
> **Owner tecnico:** `@equipo-mantenimiento`
> **Ultima actualizacion:** `2026-06-25`

---

Gestiona el inventario de extintores: ubicacion, tipo, fecha de vencimiento, fotos. Soporte para actualizacion masiva de vencimientos y vista agrupada.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/InventarioExtintor/{id}` | Extintor por ID (con foto) |
| `GET` | `api/InventarioExtintor/list/{customerId}` | Lista por cliente |
| `GET` | `api/InventarioExtintor/GetAllGroup/{customerId}` | Vista agrupada por tipo y ubicacion |
| `POST` | `api/InventarioExtintor` | Crear (multipart con foto) |
| `PUT` | `api/InventarioExtintor/{id}` | Actualizar |
| `DELETE` | `api/InventarioExtintor/{id}` | Eliminar |
| `PUT` | `api/InventarioExtintor/bulk-expiration/{customerId}` | Actualizacion masiva de vencimiento |
