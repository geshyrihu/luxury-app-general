# Modulo: SmokeDetectorInventory (Inventario de Detectores de Humo)

> **Area funcional:** Mantenimiento / Seguridad Contra Incendios
> **Owner tecnico:** `@equipo-mantenimiento`
> **Ultima actualizacion:** `2026-06-25`

---

Gestiona inventario de detectores de humo: ubicacion, tipo (fotoelectrico, ionizacion, etc.), fotos. Soporta importacion masiva desde Excel.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/Equipment/{id}` | Detector por ID |
| `GET` | `api/Equipment/list/{customerId}` | Lista por cliente |
| `POST` | `api/Equipment` | Crear (multipart con foto) |
| `PUT` | `api/Equipment/{id}` | Actualizar |
| `DELETE` | `api/Equipment/{id}` | Eliminar |
| `POST` | `api/Equipment/import/{customerId}` | Importacion masiva Excel |

**Regla:** Excel requiere columnas: Location, LocalCode, DetectorType.
