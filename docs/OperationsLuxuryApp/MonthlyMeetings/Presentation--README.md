# Presentacion (Presentaciones de Junta de Comite)

> **Modulo padre:** JuntasMensuales
> **Ultima actualizacion:** `2026-06-25`

Gestion de presentaciones PDF para juntas de comite con autorizacion.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/PresentacionJuntaComite/Get/{id}` | Por ID |
| `GET` | `api/PresentacionJuntaComite/list/{customerId}` | Listar por cliente |
| `POST` | `api/PresentacionJuntaComite/AutorizarPresentacion/{id}/{applicationUserId}` | Autorizar |
| `POST` | `api/PresentacionJuntaComite/AddFile` | Subir PDF |
| `POST` | `api/PresentacionJuntaComite/AddFecha` | Crear con fecha |
| `PUT` | `api/PresentacionJuntaComite/AddFecha/{id}` | Actualizar fecha |
| `DELETE` | `api/PresentacionJuntaComite/{id}` | Eliminar |
| `DELETE` | `api/PresentacionJuntaComite/{id}/{area}` | Eliminar PDF de area |
| `GET` | `api/PresentacionJuntaComite/Generales/{periodo}` | Vista supervision |

**Reglas:** Autorizacion de presentaciones. Subida de PDFs por area.
