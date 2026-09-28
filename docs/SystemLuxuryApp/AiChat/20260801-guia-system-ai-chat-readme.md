# Ampliación: Asistente IA (AiChat) → agente con ejecución de acciones

## Estado

| Paso | Documento | Estado |
|------|-----------|--------|
| PASO 0 | Este README | ✅ Hecho |
| PASO 0.5 | `01b-entidad-estructura.md` | ✅ Hecho — pendiente revisión del usuario |
| PASO 1 | `01-discovery-cuestionario.md` | ⏳ Pendiente |
| PASO 2 | `02-business-rules-analysis.md` | ⏳ Pendiente |
| PASO 3 | `03-riesgos-dependencias.md` | ⏳ Pendiente |
| PASO 4 | `04-implementation-plan.md` | ⏳ Pendiente |
| PASO 5 | Aprobación final | ⏳ Pendiente |

## PASO 0 — Identificación

- **Tipo:** B — Ampliar módulo existente.
- **Ruta backend:** `api/LuxuryApp.Application/Moduls/SystemLuxuryApp/System-AI/AiChat/`
  (entidades en `api/LuxuryApp.Infrastructure.Data/Data/Entities/System/System-AI/`)
- **Ruta frontend:** `client/angular/src/app/shared/ui/ai-chat-widget/` +
  `client/angular/src/app/core/services/ai-chat.service.ts` (widget global, montado en `app.ts`,
  no vive bajo `apps/[modulo].luxuryapp/` como los módulos de negocio).
- **Nombre del módulo:** Asistente IA / AiChat.
- **Objetivo (una frase):** Convertir el widget de IA (`AiChatAppService` + `ai-chat-widget`) de
  asistente conversacional puro en un asistente capaz de ejecutar acciones reales del sistema
  (consultar saldo, registrar visita, etc.), manteniéndolo usable desde el front de la app.

## Origen

La idea surgió por tendencia externa (agentes de WhatsApp vistos en publicaciones). Tras análisis
de arquitectura real (Twilio-only, sin function-calling, `AiChatAppService` atado a
`IHttpContextAccessor`), se determinó que el punto de partida con mayor retorno no es un canal
nuevo (WhatsApp) sino terminar de dar forma al asistente que ya existe y ya se usa desde el front.
El canal WhatsApp queda como posible fase futura, no como alcance de esta ampliación.
