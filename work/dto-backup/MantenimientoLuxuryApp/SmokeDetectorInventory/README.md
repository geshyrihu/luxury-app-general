# Modulo: SmokeDetectorInventory (Inventario de Detectores de Humo)

> **Area funcional:** Mantenimiento / Seguridad Contra Incendios
> **Owner tecnico:** `@equipo-mantenimiento`
> **Ultima actualizacion:** `2026-06-25`

---

Gestiona inventario de detectores de humo: ubicacion, tipo (fotoelectrico, ionizacion, etc.), fotos. Soporta importacion masiva desde Excel.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/InventarioDetectorHumo/{id}` | Detector por ID |
| `GET` | `api/InventarioDetectorHumo/list/{customerId}` | Lista por cliente |
| `POST` | `api/InventarioDetectorHumo` | Crear (multipart con foto) |
| `PUT` | `api/InventarioDetectorHumo/{id}` | Actualizar |
| `DELETE` | `api/InventarioDetectorHumo/{id}` | Eliminar |
| `POST` | `api/InventarioDetectorHumo/import/{customerId}` | Importacion masiva Excel |

**Regla:** Excel requiere columnas: Location, LocalCode, DetectorType.
