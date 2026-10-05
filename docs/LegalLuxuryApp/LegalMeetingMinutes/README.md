# LegalMinuta (Minutas Legales)

> **Area:** Legal / Minutas
> **Ultima actualizacion:** `2026-06-25`

Consulta de minutas desde la perspectiva legal. Controller delgado que delega a `IMeetingDetailsAppService`.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/LegalMinuta/ListaMinuta` | Listar minutas legales |

**Reglas:** Retorna `MeetingLegalDTO`. Sin logica de negocio propia.
