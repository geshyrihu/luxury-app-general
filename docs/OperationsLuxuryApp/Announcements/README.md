# Modulo: Announcement (Comunicados)

> **Area funcional:** Operaciones / Comunicacion
> **Owner tecnico:** `@equipo-operaciones`
> **Ultima actualizacion:** `2026-06-25`

---

Gestiona comunicados internos: creacion, publicacion, segmentacion por rol/cliente, analytics de vistas, generacion de PDF y notificaciones push via Hangfire.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `POST` | `api/Announcements/generate-draft` | Borrador de anuncio via IA |
| `POST` | `api/Announcements/generate-official-draft` | Borrador oficial estructurado via IA |
| `GET` | `api/Announcements` | Anuncios publicados para el usuario actual |
| `GET` | `api/Announcements/admin-list` | Todos los anuncios (admin) |
| `GET` | `api/Announcements/{id}` | Detalle (registra vista) |
| `GET` | `api/Announcements/{id}/analytics` | Analytics de vistas |
| `GET` | `api/Announcements/{id}/pdf` | Descargar PDF (QuestPDF) |
| `POST` | `api/Announcements` | Crear con imagen + adjuntos |
| `PUT` | `api/Announcements/{id}` | Actualizar |
| `DELETE` | `api/Announcements/{id}` | Eliminar |

**Reglas:** Visibilidad por rol, folio auto-generado (`COM-0001`), vista unica por usuario, notificaciones Hangfire diferidas.
