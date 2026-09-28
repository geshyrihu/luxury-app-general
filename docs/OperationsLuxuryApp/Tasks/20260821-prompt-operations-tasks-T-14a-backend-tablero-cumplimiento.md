# TICKET T-14a — Backend: consultas del tablero de cumplimiento

Trabajas en el repositorio LuxuryApp (.NET 10, `api/`). Antes de escribir código, lee
`CONVENTIONS.md` y `AGENTS.md`. Este ticket construye **sólo el backend** (servicio + endpoint de
consulta) del tablero de cumplimiento (F6 del plan). El frontend es T-14b, después.

## Alcance explícito — qué NO incluye este ticket

**No implementes el digest semanal "por jefe".** `docs/modulos-existente/alertas-tareas-recurrentes/../../../docs/HumanResourcesLuxuryApp/HrPolicyEngine/20260902-plan-hr-policy-engine.md:405`
menciona un `digest-semanal-tareas-arrastradas` resumido "por jefe", pero la resolución de "el
jefe" depende de `OrgHierarchy`, que sigue anclada a `WorkPosition` (el refactor a roles, D-11, no
ha aterrizado) — es la misma razón exacta por la que T-11 omitió el nivel "día 1: jefe" en la
escalera de incumplimiento. Este ticket se limita a las **consultas y conteos** del tablero,
agrupados por grupo de trabajo, categoría (área) y persona — nada que dependa de jerarquía.

## Contexto — qué debe responder el tablero

Del plan (`../../../docs/HumanResourcesLuxuryApp/HrPolicyEngine/20260902-plan-hr-policy-engine.md:579`, `611`, K5 en la sección de métricas):
1. Qué grupos de trabajo **no tienen ninguna plantilla recurrente activa** capturada (PM-01).
2. Conteo de tareas por estado de cumplimiento, por grupo: al corriente, vencida, en
   incumplimiento formal, en arrastre.
3. **K5 — Críticas cerradas con comprobante**: de las tareas cerradas cuya plantilla tiene
   `RequiresAttachment = true`, qué porcentaje tiene al menos un `TaskAttachment` real (ahora
   alcanzable gracias a T-13).
4. Permiso: "un administrador ve su grupo y no otros; un responsable ve lo suyo y no lo de sus
   pares" — reutiliza el patrón exacto ya usado en
   `TaskAppService.cs:483-499` (`GetListMyAssignedTasksAsync`): `WorkGroupMembers.Where(x =>
   x.UserId == applicationUserId && x.WorkGroup.CustomerId == customerId &&
   x.IsAdmin).Select(x => x.WorkGroupId)` para resolver los grupos administrados, más
   `CanManageAnyCustomer()` (rol `SuperUsuario`/`Direccion`, mismo helper que ya está duplicado en
   `TaskChecklistAppService.cs:135` y `TaskAttachmentAppService.cs:179` — cópialo igual aquí, no
   inventes una variante).

## Cómo derivar cada estado — no inventes tu propia lógica de "vencida"

- **En incumplimiento**: `Tasks.BreachedAt != null` (T-07/T-11 ya lo mantienen).
- **En arrastre**: `Tasks.BreachedAt != null && Status` no está en `Completed`/`Cancelled` — así
  es como T-11 lo modela realmente (no hay campo `CarriedOverFrom`; el "arrastre" es un
  recordatorio repetido vía `TaskAlertLog` con `AlertType = TaskAlertType.Arrastre`, ver
  `TaskEscalationService.cs:88-121`). No agregues ningún campo nuevo a `Tasks`.
- **Vencida (pero aún no en incumplimiento)**: **revisa primero** cómo
  `TaskEscalationService.cs` y `TaskAlertEngineService.cs`
  (`api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Tasks/RecurringTaskAlerting/Services/TaskAlertEngineService.cs`)
  determinan que una tarea venció, y **reutiliza exactamente esa misma condición de fecha** (qué
  campo comparan y contra qué). No definas tu propio criterio de "vencida" en este ticket; si
  ambos servicios usan criterios distintos entre sí, repórtalo como hallazgo antes de elegir uno.
- **Al corriente**: todo lo que no cae en las categorías anteriores.
- **K5 (comprobante en críticas cerradas)**: de las `Tasks` con `Status == GanttStatus.Completed`
  y `RecurringTemplateId != null`, filtra las cuya `RecurringTaskTemplate.RequiresAttachment ==
  true`, y calcula qué proporción tiene `EXISTS` en `TaskAttachment` con ese `TasksId` (usa
  `AnyAsync`, no traigas todos los adjuntos a memoria).

## Estructura nueva

Carpeta: `api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Tasks/RecurringTaskCompliance/`
(hermana de `RecurringTaskCatalog/`, `TaskChecklist/`, `TaskAttachment/`), con `DTOs/`,
`Interfaces/`, `Services/`, `EndPoints/`.

**Usa DTOs tipados, no objetos anónimos.** El patrón más nuevo y correcto del proyecto es
`TareasLegalAppService`
(`api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/DireccionDashboard/TareasLegal/`) — DTOs de
clase concreta (`TareasLegalResumenDTO`, etc.), no los `ApiResponseDTO<List<object>>` con
anónimos que usan `TasksReportAppService`/`SupervisionReportsAppService` (esos son el patrón
viejo, no lo repliques).

### DTOs

`ComplianceDashboardDTO`: `Groups: List<ComplianceGroupDTO>`, `TotalGroupsWithoutTemplates: int`.

`ComplianceGroupDTO`: `WorkGroupId`, `WorkGroupName`, `CategoryName` (de
`WorkGroup.WorkGroupCategories.Name`, mismo `.Include`/`.ThenInclude` que ya usa
`RecurringTaskCatalogAppService`), `HasActiveTemplates` (bool), `OnTimeCount`, `OverdueCount`,
`BreachedCount`, `CarriedOverCount`, `CriticalClosedTotal`, `CriticalClosedWithAttachmentCount`
(de estos dos el frontend calcula el porcentaje, no lo calcules tú como `double` redondeado —
deja los enteros crudos).

### Interfaz `IRecurringTaskComplianceAppService`

```csharp
Task<ApiResponseDTO<ComplianceDashboardDTO>> GetDashboardAsync(Guid customerId);
```

Un solo método. No agregues filtros de rango de fechas ni de grupo individual — el tablero
completo por cliente es el alcance de este ticket; filtros adicionales, si hacen falta, son de un
ticket futuro.

### Servicio `RecurringTaskComplianceAppService`

- Resuelve `groupsWhereUserIsAdmin` como se describió arriba. Si `CanManageAnyCustomer()` es
  `false`, limita la consulta a esos grupos; si es `true`, incluye todos los grupos del cliente.
- Trae los `WorkGroup` activos del cliente (con su categoría), y por cada uno cuenta plantillas
  activas y tareas por estado, usando `GroupBy` en la base de datos (no materialices todas las
  `Tasks` del cliente en memoria antes de agrupar — a diferencia de `TasksReportAppService`, que
  sí lo hace y que **no** debes copiar en este aspecto).

### Endpoint — `RecurringTaskComplianceEndPoints`

Grupo `api/recurring-task-compliance`, mismo estilo (`.WithTags(...)`, `.RequireAuthorization()`,
`.AddEndpointFilter<LogUserActivityEndPointsFilter>()`, `.WithMetadata(new
LogActivityMetadata(...))`):

| Verbo | Ruta | Servicio |
| --- | --- | --- |
| GET | `dashboard/{customerId:guid}` | `GetDashboardAsync` |

Sin restricción de rol adicional — el filtrado real ocurre dentro del servicio según
administración de grupo, igual que T-13b/T-13d.

### Registro en DI

Junto a `services.AddScoped<ITaskAttachmentAppService, TaskAttachmentAppService>();` en
`api/LuxuryApp.Api/ServiceExtensions/DependencyInjection.Controllers.cs`, agrega:

```csharp
services.AddScoped<IRecurringTaskComplianceAppService, RecurringTaskComplianceAppService>();
```

## Lo que NO debes hacer

- No implementes el digest semanal "por jefe" — ver sección de alcance arriba.
- No agregues filtros de fecha, de grupo individual, ni paginación — un solo endpoint, todo el
  tablero del cliente en una llamada.
- No agregues ningún campo nuevo a `Tasks`, `RecurringTaskTemplate`, ni ninguna entidad existente.
- No toques `TaskEscalationService`, `TaskAlertEngineService`, ni ningún otro servicio ya
  aprobado — sólo lee de sus tablas, no cambies su lógica.
- No crees frontend.

## Verificación obligatoria

```bash
dotnet build api/LuxuryApp.sln
```

Agrega tests del `AppService` (estilo `TaskChecklistAppServiceTests.cs`/
`TaskAttachmentAppServiceTests.cs`: `ApplicationDbContext` en memoria real, no todo mockeado)
cubriendo al menos: un grupo sin plantillas activas se refleja en
`TotalGroupsWithoutTemplates`/`HasActiveTemplates=false`; una tarea con `BreachedAt` cuenta como
incumplimiento y, si sigue abierta, también como arrastre; K5 calcula bien el numerador/denominador
con al menos un caso con adjunto y uno sin adjunto; un administrador de un solo grupo no ve los
grupos de otro administrador (permiso). Corre `dotnet test` filtrando esos tests y pega la salida
literal.

## Criterio de PASO

- El tablero responde conteos correctos por grupo, sin cargar todas las tareas del cliente en
  memoria antes de agrupar.
- Un administrador de grupo sólo ve sus grupos; `SuperUsuario`/`Direccion` ven todos.
- El criterio de "vencida" es el mismo que ya usan `TaskEscalationService`/`TaskAlertEngineService`,
  no uno inventado para este ticket.
- `dotnet build` pasa sin errores nuevos.

## Reporte de finalización

1. Archivos creados/modificados, con una línea de qué hace cada uno
2. Salida literal de `dotnet build` y de los tests
3. Qué criterio de "vencida" usaste y de dónde lo copiaste (cita archivo:línea)
4. Decisiones que tomaste por tu cuenta y por qué
5. Lo que NO hiciste del ticket y el motivo
6. Riesgos detectados que no estaban en este prompt

No avances al siguiente ticket. Espera la auditoría.
