# PASO 1 — Cuestionario de Descubrimiento: Asistente IA (AiChat)

Basado en `conventions/operations/discovery-questionnaire-template.md`.
Respuestas documentadas tal como se reciben del Tech Lead (usuario).

---

## SECCIÓN 1: CONTEXTO DEL NEGOCIO

### P1.1: ¿Cuál es el problema que resuelve este módulo?

**Respuesta del usuario (textual):**
> "esque hoy dia no funciona nada, solo quedo el prototipo, la idea es que el agente ayude a ejecutar tareas, haga consultas, mande recordatorios, (pero yo como usuario no se como funcionaria esto internamente)"

**Hallazgo técnico que respalda la respuesta (verificado en código, no asumido):**
`AiChatAppService.SendMessageAsync` → `ConfigureKernel()` lee `AiSettings:SelectedProfile` de `appsettings.Development.json`, actualmente `"Local"`, que apunta a `Endpoint: http://localhost:11434/v1` (Ollama, `llama3`) — un servidor de IA que solo existe si el dev lo corre localmente. En cualquier entorno donde Ollama no esté corriendo, cada envío de mensaje falla con `AI_AGENT_ERROR`. Esto confirma objetivamente el "solo quedó el prototipo": el único camino de IA es texto conversacional (sin ejecutar acciones) y además depende de una configuración de desarrollo local no apta para uso real.

**Síntesis (formato de plantilla, pendiente de confirmación del usuario):**
```
Actualmente, el residente/administrador que usa el widget de chat sufre de un asistente
que solo puede conversar en texto (RAG-lite por palabras clave sobre AiKnowledgeBase) y,
además, ni siquiera esa conversación es confiable hoy porque depende de un modelo de IA
local (Ollama) no disponible fuera de la máquina del desarrollador — cuando intenta pedirle
que haga algo (consultar su saldo, agendar una visita, poner un recordatorio), el agente no
puede ejecutar nada, solo puede (cuando el modelo responde) sugerirle en texto que vaya a
otro módulo, lo que resulta en que el usuario deba salir del chat y repetir la tarea
manualmente en otra pantalla.

Este módulo resuelve: dar al agente la capacidad real de EJECUTAR acciones del sistema
(consultas de datos, registro de acciones, recordatorios) en nombre del usuario autenticado,
en vez de solo describir en texto qué módulo visitar.
```

**Confirmado por el usuario:** pendiente.

### P1.2: ¿Cuáles son los actores principales y sus objetivos?

**Respuesta del usuario (textual):**
> "el agente debe comportarse diferente dependiendo el rol, dependiendo el rol hay alcances de consulta y acciones a ejecutar, el sistema mismo si deberia de mandar recordatorios, como referencia tenemos en otro modulo en proceso un modulo encargado de cargar tareas recurrentes, entonces primera fase lo anterior fase 2 que el asistente mande o interactue de manera automatizada"

**Decisiones capturadas:**
```
- Usuario (cualquier rol autenticado): conversar + ejecutar acciones — pero el ALCANCE
  (qué puede consultar, qué acciones puede pedir que se ejecuten) varía según su rol.
  El agente no es "un solo cerebro para todos": el rol acota consultas Y acciones.
- Sistema: SÍ debe poder iniciar interacción de forma proactiva (recordatorios), no solo
  responder cuando el usuario escribe — pero esto se declara explícitamente FASE 2, no
  parte del alcance inicial de esta ampliación.
```

**Fasificación explícita del usuario (relevante para PASO 4, se registra ahora para no perderla):**
```
FASE 1 (alcance de esta ampliación): agente conversacional que EJECUTA acciones y
  responde consultas, acotado por rol, cuando el usuario le escribe.
FASE 2 (fuera de alcance por ahora): el agente interactúa/manda mensajes de forma
  automatizada (recordatorios) sin que el usuario pregunte.
```

**Hallazgo de integración (verificado en código, no asumido):** ya existe un módulo en
curso — `docs/modulos-existente/alertas-tareas-recurrentes/` (Tipo B sobre `TaskEngine`,
actualmente en PASO 3 de su propia planeación) — que resuelve exactamente el problema de
"recordatorios automatizados" vía un `NotificationDispatcher` unificado (canales: InApp,
Push App, Push Web, Email, WhatsApp — WhatsApp bloqueado por falta de plantillas Meta
aprobadas). **Implicación para FASE 2 del AiChat:** cuando se aborde, el agente
probablemente debe consumir/disparar `NotificationDispatcher` (o el motor `TaskEngine`),
no construir un sistema de recordatorios propio desde cero. Se documenta aquí como
dependencia futura, no se profundiza más porque FASE 2 está fuera del alcance actual.

**Confirmado por el usuario:** pendiente.

### P1.3: ¿Cuáles son los KPIs de éxito medibles?

**Respuesta del usuario (textual):**
> "lo ultimo por el momento no tenemos manera de medirlo, pero seria ideal"

**Decisión capturada:**
```
No hay KPI medible definido para esta ampliación. Criterio de éxito por ahora: "que
funcione y la gente lo use" (cualitativo). Se deja constancia de que medir sería deseable
a futuro — posible ítem de PASO 3 (riesgo: no poder demostrar impacto) o de una fase
posterior, no bloqueante para esta planeación.
```

**Confirmado por el usuario:** sí (respuesta directa).

### P1.4: ¿Hay restricciones de tiempo, presupuesto o política?

**Respuesta capturada (tras estudio de mercado y verificación en código, confirmada por el usuario):**
```
Sin presupuesto asignado para esta ampliación. MVP debe operar 100% sobre tiers gratuitos ya
configurados (AiSettings:Profiles: GeminiFlash/GeminiPro/Gemini3Flash vía Google AI Studio —
no consumen la suscripción personal Gemini Advanced del usuario —, y Nvidia NIM como
respaldo/dev). Restricción de política explícita del usuario: no se sirve de suscripciones
personales (Gemini, Codex, Claude) para este fin.
```

**Decisión técnica capturada (arquitectura de proveedores — se documentará formalmente en
SECCIÓN 5, se registra aquí para no perderla):**
```
Se descarta introducir un gateway externo tipo OmniRoute (Node.js, proceso/Docker separado;
verificado en GitHub: 51.8k⭐, MIT, endpoint OpenAI-compatible en /v1/chat/completions — real
pero ajeno al stack .NET de este repo). El fallback entre proveedores y el circuit-breaking se
implementan nativamente en .NET: Polly (ya referenciado: Microsoft.Extensions.Http.Polly
v10.0.10 en LuxuryApp.Api.csproj) envolviendo las llamadas que Semantic Kernel (ya en uso en
AiChatAppService, Microsoft.SemanticKernel.Core/.Connectors.OpenAI v1.78.0 en
LuxuryApp.Application.csproj) hace a los servicios de chat registrados por perfil. Cero
paquetes nuevos requeridos para el MVP. Microsoft.Extensions.AI (mencionado por una IA externa
consultada por el usuario) NO está referenciado en ningún .csproj — se descarta por ahora,
ya que Semantic Kernel ya cumple ese rol de orquestación.

Nvidia (meta/llama-3.1-8b-instruct) se usa como fallback/dev, no como proveedor primario para
function-calling — modelo <10B parámetros, riesgo de alucinación de parámetros en tool-calls.
```

**Confirmado por el usuario:** sí ("de acuerdo").

---

## SECCIÓN 2: REGLAS DE NEGOCIO (4 NIVELES)

### NIVEL 1: Invariantes de Dominio

**Pregunta:** ¿Qué NO puede cambiar nunca? ¿Qué es inmutable?

**Respuesta del usuario:** pendiente.
