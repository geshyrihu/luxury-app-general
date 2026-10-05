# Modulo: CustomDocument (Documentos Personalizados)

> **Area funcional:** Operaciones / Documentacion
> **Owner tecnico:** `@equipo-operaciones`
> **Ultima actualizacion:** `2026-06-25`

---

Gestiona documentos personalizados (legales, del edificio) con carga de archivos, consulta via IA y ordenamiento.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/CustomDocument/{id}` | Documento por ID |
| `GET` | `api/CustomDocument/list/{customerId}/{documentType}` | Lista por cliente y tipo |
| `POST` | `api/CustomDocument` | Crear con archivo |
| `PUT` | `api/CustomDocument/{id}` | Actualizar |
| `DELETE` | `api/CustomDocument/{id}` | Eliminar |
| `PUT` | `api/CustomDocument/update-order` | Reordenar |
| `POST` | `api/CustomDocument/ConsultWithAi` | Consultar PDF via IA |

**Reglas:** Folio dinamico, carpetas por tipo de documento, borrado en cascada.
