# AiKnowledgeBase (Base de Conocimiento IA)

> **Area:** Sistema / IA
> **Ultima actualizacion:** `2026-06-25`

Repositorio de conocimiento para RAG del chat de IA. Vinculado a modulos por `ModuleAppId`.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/AiKnowledgeBase` | Listar |
| `GET` | `api/AiKnowledgeBase/{id}` | Por ID |
| `POST` | `api/AiKnowledgeBase` | Crear |
| `PUT` | `api/AiKnowledgeBase` | Actualizar |
| `DELETE` | `api/AiKnowledgeBase/{id}` | Eliminar |
| `GET` | `api/AiKnowledgeBase/modules` | Modulos para dropdown |

**Reglas:** Almacenado en `VaultDbContext`. Keywords en lowercase. `ModuleAppId` permite filtrado por rol en el chat.
