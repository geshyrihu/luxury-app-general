# AiChat (Chat de IA)

> **Area:** Sistema / IA
> **Ultima actualizacion:** `2026-06-25`

Chatbot "Luxury Assistant" con RAG, multi-provider (Gemini / OpenAI) y sesiones por usuario.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `POST` | `api/AiChat/StartSession` | Iniciar sesion |
| `POST` | `api/AiChat/SendMessage` | Enviar mensaje |
| `GET` | `api/AiChat/Sessions` | Sesiones del usuario |
| `GET` | `api/AiChat/History/{sessionId}` | Historial de sesion |

**Reglas:** Usa `Microsoft.SemanticKernel`. Configurable via `AiSettings.SelectedProfile`. RAG: busca `AiKnowledgeBase` activos y filtra por rol del usuario + keywords. Sanitiza input (anti-prompt-injection). Sesiones auto-tituladas. Historial completo cargado en contexto.
