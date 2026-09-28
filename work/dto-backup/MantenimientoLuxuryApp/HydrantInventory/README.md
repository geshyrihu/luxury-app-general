# Modulo: HydrantInventory (Inventario de Hidrantes)

> **Area funcional:** Mantenimiento / Seguridad Contra Incendios
> **Owner tecnico:** `@equipo-mantenimiento`
> **Ultima actualizacion:** `2026-06-25`

---

Gestiona inventario de hidrantes: ubicacion del gabinete, tipo (interior/exterior), numero de gabinete, fotos. Soporta importacion masiva desde Excel.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/InventarioHidrante/{id}` | Hidrante por ID |
| `GET` | `api/InventarioHidrante/list/{customerId}` | Lista por cliente |
| `POST` | `api/InventarioHidrante` | Crear (multipart con foto) |
| `PUT` | `api/InventarioHidrante/{id}` | Actualizar |
| `DELETE` | `api/InventarioHidrante/{id}` | Eliminar |
| `POST` | `api/InventarioHidrante/import/{customerId}` | Importacion masiva Excel |

**Regla:** Excel requiere columnas: Location, LocalCode, HydrantType, CabinetNumber.
