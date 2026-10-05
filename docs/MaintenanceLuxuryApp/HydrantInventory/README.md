# Modulo: HydrantInventory (Inventario de Hidrantes)

> **Area funcional:** Mantenimiento / Seguridad Contra Incendios
> **Owner tecnico:** `@equipo-mantenimiento`
> **Ultima actualizacion:** `2026-06-25`

---

Gestiona inventario de hidrantes: ubicacion del gabinete, tipo (interior/exterior), numero de gabinete, fotos. Soporta importacion masiva desde Excel.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/Equipment/{id}` | Hidrante por ID |
| `GET` | `api/Equipment/list/{customerId}` | Lista por cliente |
| `POST` | `api/Equipment` | Crear (multipart con foto) |
| `PUT` | `api/Equipment/{id}` | Actualizar |
| `DELETE` | `api/Equipment/{id}` | Eliminar |
| `POST` | `api/Equipment/import/{customerId}` | Importacion masiva Excel |

**Regla:** Excel requiere columnas: Location, LocalCode, HydrantType, CabinetNumber.
