# Modulo: ManualCallPointInventory (Inventario de Estaciones Manuales)

> **Area funcional:** Mantenimiento / Seguridad Contra Incendios
> **Owner tecnico:** `@equipo-mantenimiento`
> **Ultima actualizacion:** `2026-06-25`

---

Gestiona inventario de estaciones manuales de alarma (pull stations): ubicacion, tipo, fotos. Soporta importacion masiva desde Excel.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/inventario-estacion-manual/{id}` | Estacion por ID |
| `GET` | `api/inventario-estacion-manual/list/{customerId}` | Lista por cliente |
| `POST` | `api/inventario-estacion-manual` | Crear (multipart con foto) |
| `PUT` | `api/inventario-estacion-manual/{id}` | Actualizar |
| `DELETE` | `api/inventario-estacion-manual/{id}` | Eliminar |
| `POST` | `api/inventario-estacion-manual/import` | Importacion masiva Excel (CustomerId desde JWT) |

**Regla:** Excel columnas A=Ubicacion, B=Codigo, C=Tipo (Conventional \| AnalogAddressable \| GlassBreak).
