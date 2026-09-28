# PASO 0.5 — Reconocimiento de Estructura de Entidades: Asistente IA (AiChat)

Reporte de lo que **ya existe en código**, en español. No propone cambios todavía.

---

## 1. `AiChatSession` — una conversación

**Representa:** una sesión de chat abierta por un usuario con el asistente (equivalente a "un hilo de conversación").

- **Clase:** `AiChatSession`
- **Tabla:** `AiChatSessions`
- **Archivo:** `api/LuxuryApp.Infrastructure.Data/Data/Entities/System/System-AI/AiChatSession.cs`

| Propiedad | Función de negocio |
|---|---|
| `Id` (heredado de `GuidIdEntity`) | Identificador único de la sesión. |
| `UserId` | Quién abrió la conversación. Es un `Guid` **suelto**, sin `[ForeignKey]` ni navegación a `ApplicationUser` — el vínculo con el usuario real es solo por convención, no está forzado por EF/SQL. |
| `Title` | Título visible de la conversación (ej. para listar sesiones anteriores en el front). |
| `CreatedAt` | Fecha de creación de la sesión. |

**GAP:** no hay `CustomerId`/tenant en la sesión. En un sistema multitenant (cada usuario pertenece a un `Customer`), esto significa que hoy no hay forma de filtrar/aislar sesiones por condominio a nivel de base de datos — se dependería de que `UserId` ya esté correctamente acotado aguas arriba.

---

## 2. `AiChatMessage` — un mensaje dentro de una sesión

**Representa:** cada turno de la conversación (lo que escribe el usuario y lo que responde el asistente).

- **Clase:** `AiChatMessage`
- **Tabla:** `AiChatMessages`
- **Archivo:** `api/LuxuryApp.Infrastructure.Data/Data/Entities/System/System-AI/AiChatMessage.cs`

| Propiedad | Función de negocio |
|---|---|
| `Id` | Identificador único del mensaje. |
| `SessionId` + navegación `Session` | A qué conversación pertenece. Este sí tiene `[ForeignKey]` real hacia `AiChatSession`. |
| `Role` | Quién "habló": literal `"User"` o `"Assistant"` (string libre, no enum — ver GAP). |
| `Content` | El texto del mensaje (pregunta del usuario o respuesta generada). |
| `Timestamp` | Cuándo se envió el mensaje. |

**GAP:** `Role` es un `string` sin restricción (`[MaxLength(20)]` solamente) en vez de un enum — nada impide guardar un valor inconsistente (`"user"` vs `"User"`, typos), y no hay forma de agregar un tercer rol (p. ej. `"System"` o `"Action"` para cuando el asistente ejecute una acción) sin arriesgar strings mal escritos.

**Relación:** `AiChatSession` 1 —— N `AiChatMessage` (una sesión tiene muchos mensajes).

---

## 3. `AiKnowledgeBase` — la "base de conocimiento" que alimenta las respuestas

**Representa:** fragmentos de instrucciones/contexto que el asistente inyecta en el prompt según palabras clave detectadas en el mensaje del usuario (RAG-lite manual, no embeddings/vector search).

- **Clase:** `AiKnowledgeBase`
- **Tabla:** `AiKnowledgeBase`
- **Archivo:** `api/LuxuryApp.Infrastructure.Vault/Entities/AiKnowledgeBase.cs` ⚠️

**Ubicación:** esta entidad vive en el proyecto `LuxuryApp.Infrastructure.Vault`, persistida vía `VaultDbContext`, separado del `ApplicationDbContext` principal. **Confirmado con el usuario (PASO 0.5, revisión): esto es intencional**, no un defecto — las entidades relacionadas con IA deben tener su propia base de datos, siguiendo el mismo patrón ya usado por otras piezas transversales del sistema (ej. Data-logs, Vault). Cualquier entidad nueva de IA (para PASO 2 en adelante) debe seguir este mismo patrón de aislamiento, no consolidarse en `ApplicationDbContext`.

| Propiedad | Función de negocio |
|---|---|
| `Id` | Identificador único del fragmento de conocimiento. |
| `Topic` | Tema del fragmento (ej. "Tickets", "Eventos") — usado para mostrarlo agrupado en el admin. |
| `Instructions` | El texto que se inyecta literalmente en el prompt del modelo cuando aplica. |
| `Route` | Ruta de la app relacionada (ej. `/tickets/my-requests`) — para que el asistente pueda sugerir navegación. |
| `Keywords` | CSV de palabras clave; el matching contra el mensaje del usuario es la única "inteligencia" de recuperación (no hay búsqueda semántica). |
| `IsActive` | Si el fragmento está habilitado para usarse. |
| `ModuleAppId` | Se supone que vincula el fragmento a un módulo de negocio (`ModuleApp`, tabla `Modules`). |
| `CreatedAt` | Fecha de alta. |

**GAP confirmado en código (no inferido):** en `AiKnowledgeBaseAppService.GetAllAsync`/`GetByIdAsync`, el campo `ModuleAppName` se asigna al literal `"Módulo Externo"` con el comentario explícito `// La relación se rompió al mover a Vault`. Es decir: `ModuleAppId` apunta a `ModuleApp` (tabla `Modules`, en `ApplicationDbContext`), pero como `AiKnowledgeBase` vive en `VaultDbContext` (separación intencional, ver arriba), **ya no se puede hacer el join** — el nombre real del módulo se perdió y quedó hardcodeado. Este sigue siendo un defecto real a resolver, pero la solución debe respetar la separación de bases de datos (ej. desnormalizar el nombre del módulo al guardar, o resolverlo vía llamada a servicio en vez de join SQL) — no revertir `AiKnowledgeBase` a `ApplicationDbContext`.

**Relación (rota):** `AiKnowledgeBase` N —— 1 `ModuleApp` (`Modules`) — relación lógica presente por `ModuleAppId`, pero no ejecutable por estar en DbContexts distintos.

---

## 4. Entidades transversales relevantes (no tocar, solo referencia)

- **`ApplicationUser`** (`api/LuxuryApp.Infrastructure.Data/Data/Entities/System/Access/ApplicationUser.cs`): fuente real de identidad/rol/tenant (`CustomerId`, roles vía claims). `AiChatSession.UserId` debería, en teoría, apuntar aquí, pero sin FK.
- **`ModuleApp`** (`api/LuxuryApp.Infrastructure.Data/Data/Entities/System/Access/ModuleApp.cs`, tabla `Modules`): catálogo de módulos de negocio del sistema (nombre, ícono, ruta de router, nivel de rol, visibilidad móvil). Es lo que `AiKnowledgeBase.ModuleAppId` intenta referenciar.
- **`ICurrentUserService`** (`api/LuxuryApp.Shared/Services/ICurrentUserService.cs`): no es entidad de datos, pero es la pieza que hoy **ata `AiChatAppService` a una request HTTP** (depende de `IHttpContextAccessor`) — condiciona cualquier plan de "ejecutar acciones" fuera del front (ver README, objetivo).

---

## 5. Resumen de GAPs para PASO 1 (Discovery)

1. Sin tenant/`CustomerId` en `AiChatSession` — aislar sesiones por condominio no está garantizado a nivel de dato.
2. `AiChatMessage.Role` es string libre, no enum — riesgo si se agregan roles nuevos (p. ej. para representar una acción ejecutada).
3. Relación `AiKnowledgeBase.ModuleAppId` → `ModuleApp` rota por vivir en DbContexts distintos (confirmado por comentario en código). La separación de base de datos en sí **no** es el gap — es el patrón deseado; el gap es cómo resolver el nombre del módulo sin join cruzado.
4. Ningún mecanismo de ejecución de acciones existe hoy (sin Semantic Kernel function-calling, sin router de intents) — ver hallazgo previo sobre `AiChatAppService`.
5. `AiChatAppService` depende de `ICurrentUserService`/`IHttpContextAccessor` — limita su reutilización a contextos con request HTTP activa (relevante si en el futuro se quisiera un canal sin HTTP, como WhatsApp).
