# TICKET T-10 — Agrupación por destinatario y tope de alertas

Trabajas en el repositorio LuxuryApp. Antes de escribir código, lee `CONVENTIONS.md` y
`AGENTS.md`. Lee este prompt completo antes de empezar — reestructura una parte del motor de
alertas que ya está aprobada, con precisión sobre qué cambia y qué no.

## Contexto

El motor de alertas (T-09b/T-09c) despacha **una notificación por tarea**. Si un responsable
tiene 8 obligaciones recurrentes abiertas y las 8 entran en ventana de aviso el mismo día, hoy
recibiría 8 notificaciones sueltas en la misma corrida. Es RT-16 (fatiga de alertas): un aviso
diario con cinco pendientes se lee; cinco avisos diarios se ignoran.

Este ticket agrupa: **una notificación por destinatario y tipo de alerta, por corrida**, sin
importar cuántas tareas la componen. La bitácora (`TaskAlertLog`) **no pierde granularidad** —
sigue una fila por tarea y canal, igual que hoy; lo que cambia es cuántas veces se llama a
`INotificationDispatcher.DispatchAsync`.

## Qué se agrupa y qué no

- Se agrupa por **`(AssigneeId, AlertType)`**. Dos tareas del mismo responsable con el mismo tipo
  de alerta (por ejemplo, ambas `AvisoPrevio`) van en un solo mensaje.
- **No se mezclan tipos de alerta.** Un responsable con una tarea en `AvisoPrevio` y otra en
  `Vencida` en la misma corrida recibe **dos** mensajes, no uno — son urgencias distintas
  (`Vencida` usa `NotificationCategory.Urgente`, las demás `Personal`) y mezclarlas le resta
  claridad a lo urgente.
- El caso de **una sola tarea** en el grupo debe verse igual que hoy: mismo título/cuerpo
  centrados en esa tarea, misma `ActionRoute` específica a esa tarea. No inventes un formato de
  lista para grupos de tamaño 1.

## Tareas de Backend

Archivo:
`api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Tasks/RecurringTaskAlerting/Services/TaskAlertEngineService.cs`

### 1. Separar "resolver" de "despachar"

`RunAsync` reestructura su bucle en dos fases. **No toques `ResolveAlertTypeAsync` ni
`HasAlertAsync`** — se reutilizan tal cual, sin cambios.

**Fase 1 — resolver, sin despachar:** recorre las tareas exactamente como hoy (mismo throttle de
24 horas, misma llamada a `ResolveAlertTypeAsync`), pero en vez de despachar de inmediato,
acumula pares `(tarea, tipoDeAlerta)` en una lista. Los fallos al **resolver** (excepción antes de
llegar a una decisión) se siguen contando en `Failed`, igual que hoy.

**Fase 2 — agrupar y despachar:** agrupa la lista acumulada por `(AssigneeId, AlertType)`. Filtra
cualquier par sin `AssigneeId` (no debería ocurrir dado que T-08 siempre resuelve un responsable,
pero si aparece, cuéntalo en `Failed` y no lo despaches). Por cada grupo, un solo despacho.

### 2. Reemplaza `SendAlertAsync` por una versión agrupada

Recibe el `AssigneeId`, el `AlertType`, y la lista de tareas del grupo. Un solo
`DispatchAsync` con:

- `Title`: menciona la cantidad, en singular si es 1, plural si son más — por ejemplo "Tienes
  {N} tarea(s) con aviso previo" / "Tienes {N} tarea(s) vencidas". Ajusta el fraseo por tipo,
  igual que ya distinguían `AlertTitle`/`AlertBody` antes de este cambio.
- `Body`: si el grupo tiene una sola tarea, el mismo texto de siempre (título de la tarea y fecha
  límite). Si tiene más de una, lista hasta **5** tareas (título + fecha límite de cada una); si
  hay más de 5, agrega una línea final "y {N-5} más". No hace falta una plantilla elaborada, una
  lista simple separada por saltos de línea o punto y coma es suficiente.
- `ActionRoute`: si el grupo tiene una sola tarea, la misma ruta específica de siempre
  (`/tasks/message/{taskId}/{workGroupId}`). Si tiene más de una, usa una ruta general a la
  lista de tareas (`/tasks`) — no hay una sola tarea a la cual apuntar.
- `Category`: igual que hoy, `Urgente` si el tipo es `Vencida`, `Personal` en cualquier otro caso.

**Después del despacho** (exitoso o fallido, mismo criterio de `Delivered` que ya está aprobado:
`true` si no hubo excepción, `false` si la hubo): para **cada tarea del grupo**, agrega una fila
de `TaskAlertLog` por cada canal en `TaskChannels` (igual que T-09c — no cambia esa parte) y
actualiza `LastAlertAt` de esa tarea. Todas las tareas del grupo comparten el mismo `Delivered`,
porque vinieron del mismo despacho.

### 3. Conteo del resultado

`TaskAlertEngineRunResult` sigue contando **por tarea**, no por mensaje enviado — si un grupo de
4 tareas se despacha con éxito, eso suma 4 al contador correspondiente (`AvisosPreviosSent`,
`RecordatoriosSent` o `VencidasDetected`), no 1. Si el despacho del grupo falla, las 4 tareas
suman a `Failed`. No cambies el significado de estos contadores, sólo cómo se llenan.

## Actualiza las pruebas existentes

En
`api/LuxuryApp.Tests/Application/Modules/OperationsLuxuryApp/Tasks/RecurringTaskAlerting/TaskAlertEngineServiceTests.cs`,
los 6 tests actuales operan con una tarea a la vez — cada uno es, sin quererlo, ya una prueba del
caso "grupo de tamaño 1", así que **deberían seguir pasando sin cambios** si el caso de una sola
tarea produce el mismo título/cuerpo/ruta que antes. Verifica esto; si alguno falla por una
diferencia de texto, ajústalo, pero no debería requerir cambios de fondo.

**Agrega pruebas nuevas** que sólo tienen sentido con más de una tarea:

- Dos tareas del mismo responsable, mismo tipo de alerta resuelto (por ejemplo, ambas dentro de
  su ventana de aviso previo) → **una sola** llamada a `DispatchAsync`, y `TaskAlertLog` con 6
  filas (2 tareas × 3 canales), ambas tareas con `LastAlertAt` actualizado.
- Dos tareas del mismo responsable pero con tipos de alerta distintos (una en ventana de aviso
  previo, otra ya vencida) → **dos** llamadas a `DispatchAsync`, una por tipo.
- Dos tareas de responsables **distintos** → dos llamadas a `DispatchAsync`, una por
  destinatario.
- Un grupo de 6 o más tareas → el cuerpo del mensaje incluye la línea "y N más" y no intenta
  listar las seis.

## Lo que NO debes hacer

- No implementes un tope de frecuencia adicional al throttle de 24 horas que ya existe por tarea
  — la agrupación en sí ya resuelve el caso de "muchas notificaciones en una sola corrida"; no es
  necesario un límite numérico de mensajes por día por persona en este ticket.
- No toques `ResolveAlertTypeAsync`, `HasAlertAsync`, el esquema de `TaskAlertLog`, ni ningún
  archivo de T-08/T-08c/T-09/catálogo.
- No implementes la escalera de incumplimiento ni el arrastre — siguen siendo T-11.
- No registres nada en Hangfire.

## Convenciones aplicables

- Archivos en UTF-8 sin mojibake

## Verificación obligatoria

```bash
dotnet build api/LuxuryApp.sln
dotnet test api/LuxuryApp.Tests/LuxuryApp.Tests.csproj --filter TaskAlertEngineServiceTests --no-restore
node scripts/scan-mojibake.mjs api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Tasks/RecurringTaskAlerting api/LuxuryApp.Tests/Application/Modules/OperationsLuxuryApp/Tasks/RecurringTaskAlerting
```

## Criterio de PASO del ticket

Los 6 tests existentes siguen pasando (el caso de una tarea no cambió de comportamiento
observable), más los 4 escenarios nuevos de agrupación.

## Reporte de finalización

1. Qué cambió en `RunAsync` y en el método de despacho, con el fragmento antes/después
2. Qué pruebas se agregaron o ajustaron
3. Salida literal de los tres comandos, con el conteo total de tests
4. Decisiones que tomaste por tu cuenta y por qué (en particular: el fraseo exacto del título y
   cuerpo agrupado)
5. Riesgos detectados que no estaban en este prompt

No avances al siguiente ticket. Espera la auditoría.
