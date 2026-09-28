# TICKET D11-05 — Servicio `ITaskJustificationService` + endpoints

Trabajas en el repositorio LuxuryApp. Antes de escribir código, lee `CONVENTIONS.md` y
`AGENTS.md`.

D11-04 (aprobado) dejó el esquema: enum `TaskJustificationState`, entidad `TaskJustification`,
`DbSet`, migración. Este ticket construye la lógica sobre ese esquema: solicitar, aprobar,
rechazar. **No toques la entidad ni la migración de D11-04.**

## Contexto — reglas de negocio que este ticket implementa

De `docs/modulos-existente/alertas-tareas-recurrentes/02-business-rules-analysis.md`:

- `RN-ALT-012`: `Justificada` no es un estado terminal — queda en espera de aprobación. **Este
  ticket no toca el ciclo de alertas** (eso es `RN-ALT-013`, ticket D11-06); solicitar una
  justificación no debe silenciar ni pausar nada todavía.
- `RN-ALT-023`: aprobar o rechazar es del **jefe del responsable**, resuelto vía `OrgHierarchy`.
  El responsable no puede aprobar la suya (`RN-ALT-004`), y esto se valida **en el servidor**, no
  sólo ocultando el botón en la interfaz — la validación debe rechazar la llamada directa al
  endpoint.
- `RN-ALT-035`: motivo escrito obligatorio, mínimo 20 caracteres.

**Quién puede solicitar:** el responsable de la tarea (`Tasks.AssigneeId`) — es quien vive el
incumplimiento y quien tiene el motivo. `SuperUsuario`/`Direccion` pueden hacerlo también, mismo
criterio de anulación de restricciones que ya usa `TaskChecklistAppService.CanManageAnyCustomer()`
(`api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Tasks/TaskChecklist/Services/TaskChecklistAppService.cs:135-136`).

## Cómo se resuelve "el jefe del responsable" — la pieza nueva de este ticket

`OrgHierarchy` es rol→rol, por cliente (`api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Recruitment/EstructuraOrganizacional/OrgHierarchy.cs`):
`CustomerId`, `ParentRoleId` (jefe), `ChildRoleId` (subordinado), `IsActive`. Para saber si el
usuario que llama al endpoint es el jefe de quien solicitó la justificación:

1. Resolver el rol del **solicitante** (`TaskJustification.RequestedByUserId`) consultando
   `dbContext.UserRoles` — no `ICurrentUserService`, porque no es el usuario autenticado.
2. **Convención de un solo rol por usuario (`RN-ALT-054`):** si el solicitante tiene 0 o más de 1
   rol, **no elijas con `.First()`** — es una anomalía, repórtala con `logger.LogWarning` y trata
   el jefe como no resoluble (la aprobación falla con 403 más abajo, no con una excepción).
3. Buscar en `OrgHierarchy` la fila con `CustomerId == task.CustomerId && ChildRoleId ==
   <rol del solicitante> && IsActive`. Si no existe, no hay jefe definido para ese rol en ese
   organigrama.
4. `ParentRoleId` de esa fila es el rol jefe. El usuario que llama es el jefe si
   `currentUserService.CustomerId == task.CustomerId && currentUserService.RoleId ==
   <ParentRoleId>` — `ICurrentUserService.RoleId` (`api/LuxuryApp.Shared/Services/ICurrentUserService.cs:22`)
   ya trae el rol del usuario autenticado desde los claims, sin consulta adicional.
5. Si el rol jefe no tiene resolución (pasos 2 o 3 fallan) o el usuario que llama no lo tiene,
   **no hay jefe resoluble por este camino** — la única forma de aprobar/rechazar en ese caso es
   `SuperUsuario`/`Direccion` (mismo override de todo el módulo). No implementes ningún otro
   respaldo (nada de "responsable de respaldo" aquí — ese mecanismo es de asignación de tareas,
   `RN-ALT-018`, no de aprobación de justificaciones).

Impleméntalo como un método privado, por ejemplo `IsBossOfRequesterAsync(string requesterId, Guid
customerId)`, en el propio servicio.

## Tareas de Backend

Carpeta nueva, mismo patrón que `TaskChecklist/` y `TaskAttachment/`:
`api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Tasks/TaskJustification/`

### 1. DTOs

`DTOs/TaskJustificationRequestDTO.cs` (namespace `LuxuryApp.Application.DTOs`):
```csharp
public record TaskJustificationRequestDTO
{
    [Required]
    public Guid TasksId { get; set; }

    [Required]
    [MinLength(20)]
    [MaxLength(1000)]
    public string Reason { get; set; }
}
```

`DTOs/TaskJustificationDTO.cs` (namespace `LuxuryApp.Application.DTOs`), hereda de
`GuidIdEntityDTO` igual que `TaskChecklistItemDTO`: `TasksId`, `Reason`, `RequestedByUserId`,
`RequestedByUserName`, `ApprovedByUserId`, `ApprovedByUserName`, `State`, `RequestedAt`,
`ResolvedAt`.

### 2. Interfaz e implementación

`Interfaces/ITaskJustificationService.cs` (namespace `LuxuryApp.Application.Interfaces`):
```csharp
public interface ITaskJustificationService
{
    Task<ApiResponseDTO<List<TaskJustificationDTO>>> GetByTaskIdAsync(Guid tasksId);
    Task<ApiResponseDTO<TaskJustificationDTO>> RequestAsync(TaskJustificationRequestDTO dto);
    Task<ApiResponseDTO<TaskJustificationDTO>> ApproveAsync(Guid id);
    Task<ApiResponseDTO<TaskJustificationDTO>> RejectAsync(Guid id);
}
```

`Services/TaskJustificationAppService.cs`, mismo estilo de inyección por constructor primario que
`TaskChecklistAppService` (`ApplicationDbContext dbContext, ICurrentUserService currentUserService,
IMapper mapper`, más `ILogger<TaskJustificationAppService> logger` para la anomalía del paso 2).

**`RequestAsync`, en este orden:**
1. `dto` nulo o `Reason` vacío/menor a 20 caracteres tras `Trim()` → 400. (El `[MinLength]` del DTO
   no se valida solo en minimal APIs sin filtro de validación — revísalo tú mismo, no asumas; si
   confirmas que no hay validación automática en este proyecto, sí necesitas el chequeo manual
   aquí, igual que hace `TaskChecklistItemAddDTO` con su `[MaxLength(300)]`.)
2. Cargar la tarea (`dbContext.Tasks`, sin tracking para la lectura inicial). No existe → 404.
3. Autorización: `currentUserService.UserId == task.AssigneeId` **o** `CanManageAnyCustomer()`
   (mismo helper que `TaskChecklistAppService`, cópialo). Si no → 403 "Sólo el responsable puede
   solicitar justificación de esta tarea."
4. Ya existe una `TaskJustification` de esta tarea con `State == Solicitada` → 400 "Ya existe una
   justificación pendiente de aprobación para esta tarea." (evita duplicados concurrentes; no está
   numerada como RN explícita, es una guarda de sentido común que tú mismo puedes verificar no
   rompe ningún escenario de los flujos del análisis de negocio).
5. Crear la entidad: `TasksId`, `Reason = dto.Reason.Trim()`, `RequestedByUserId =
   currentUserService.UserId`, `State = TaskJustificationState.Solicitada`, `RequestedAt =
   DateTime.UtcNow`. Guardar.

**`ApproveAsync(Guid id)` / `RejectAsync(Guid id)`, mismo cuerpo compartido salvo el estado final:**
1. Cargar la `TaskJustification` con `Include(x => x.Tasks)`. No existe → 404.
2. `State != Solicitada` → 400 "Esta justificación ya fue resuelta." (no reabras una ya aprobada o
   rechazada — si se necesita solicitar de nuevo tras un rechazo, es una fila nueva, no reabrir la
   vieja).
3. `RN-ALT-004`, validación de servidor, no de interfaz: `currentUserService.UserId ==
   justification.RequestedByUserId` → 403 "No puedes aprobar tu propia justificación." (aplica
   igual para rechazar: tampoco te rechazas a ti mismo, es la misma protección).
4. Autorización: `IsBossOfRequesterAsync(...)` **o** `CanManageAnyCustomer()`. Si no → 403 "Sólo el
   jefe del responsable puede aprobar o rechazar esta justificación."
5. `State = Aprobada` (o `Rechazada`), `ApprovedByUserId = currentUserService.UserId`, `ResolvedAt
   = DateTime.UtcNow`. Guardar.

**`GetByTaskIdAsync`**: sin tracking, `Include(x => x.RequestedByUser).Include(x =>
x.ApprovedByUser)`, ordenado por `RequestedAt` descendente (la más reciente primero) — una tarea
puede tener varias filas si hubo un rechazo y una nueva solicitud.

### 3. Mapper

`Mapping/TaskJustificationMapper.cs` (namespace `LuxuryApp.Application.Tickets.Mapping`, mismo que
`TaskChecklistMapper`):
```csharp
public class TaskJustificationMapper : Profile
{
    public TaskJustificationMapper()
    {
        CreateMap<TaskJustification, TaskJustificationDTO>()
            .ForMember(dest => dest.RequestedByUserName,
                opt => opt.MapFrom(src => src.RequestedByUser != null ? src.RequestedByUser.FullName : null))
            .ForMember(dest => dest.ApprovedByUserName,
                opt => opt.MapFrom(src => src.ApprovedByUser != null ? src.ApprovedByUser.FullName : null));
    }
}
```
No necesitas `CreateMap<TaskJustificationRequestDTO, TaskJustification>()` si construyes la
entidad a mano en `RequestAsync` (recomendado, dado que varios campos —`State`,
`RequestedByUserId`, `RequestedAt`— no vienen del DTO).

### 4. Endpoints

`EndPoints/TaskJustificationsEndPoints.cs` (namespace `LuxuryApp.Application.EndPoints`), mismo
patrón que `TaskChecklistItemsEndPoints.cs`:
```csharp
public class TaskJustificationsEndPoints : IEndPointsModule
{
    public void MapEndPoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/task-justifications")
            .WithTags("Task Justifications")
            .RequireAuthorization()
            .AddEndpointFilter<LogUserActivityEndPointsFilter>();

        group.MapGet("by-task/{tasksId:guid}", async (Guid tasksId, ITaskJustificationService appService) =>
            TypedResults.Ok(await appService.GetByTaskIdAsync(tasksId)))
            .WithMetadata(new LogActivityMetadata("TaskJustification_GetByTask", "Consulta de justificaciones por tarea"));

        group.MapPost("", async (TaskJustificationRequestDTO dto, ITaskJustificationService appService) =>
            TypedResults.Ok(await appService.RequestAsync(dto)))
            .WithMetadata(new LogActivityMetadata("TaskJustification_Request", "Solicitud de justificación"));

        group.MapPatch("{id:guid}/approve", async (Guid id, ITaskJustificationService appService) =>
            TypedResults.Ok(await appService.ApproveAsync(id)))
            .WithMetadata(new LogActivityMetadata("TaskJustification_Approve", "Aprobación de justificación"));

        group.MapPatch("{id:guid}/reject", async (Guid id, ITaskJustificationService appService) =>
            TypedResults.Ok(await appService.RejectAsync(id)))
            .WithMetadata(new LogActivityMetadata("TaskJustification_Reject", "Rechazo de justificación"));
    }
}
```
Sin restricción de rol en el `MapGroup` (`RequireAuthorization()` a secas) — la autorización real
pasa dentro del servicio, igual que `TaskChecklistItemsEndPoints`, no en el endpoint.

### 5. Registro en DI

`api/LuxuryApp.Api/ServiceExtensions/DependencyInjection.Controllers.cs`, junto a
`ITaskChecklistAppService`/`ITaskAttachmentAppService` (línea 490-491):
```csharp
services.AddScoped<ITaskJustificationService, TaskJustificationAppService>();
```

### 6. Tests

`api/LuxuryApp.Tests/Application/Modules/OperationsLuxuryApp/Tasks/TaskJustification/TaskJustificationAppServiceTests.cs`,
con `ApplicationDbContext` en memoria real (mismo patrón que
`TaskChecklistAppServiceTests.cs`/`TaskAppServiceTests.cs`). Cubre como mínimo:

1. Alta correcta: responsable solicita, queda `Solicitada`, `RequestedByUserId` correcto.
2. Rechazo si `Reason` tiene menos de 20 caracteres.
3. Rechazo 403 si quien solicita no es el responsable ni admin.
4. Rechazo 400 si ya hay una `Solicitada` pendiente para la misma tarea.
5. **El caso central de `RN-ALT-004`:** el mismo usuario que solicitó intenta aprobar su propia
   justificación → 403, y el estado **no cambia** (verifica el `State` persistido, no sólo la
   respuesta).
6. Aprobación exitosa: siembra `OrgHierarchy` con el rol jefe correcto para el `CustomerId` de la
   tarea, el usuario que llama tiene ese rol jefe → `Aprobada`, `ApprovedByUserId` y `ResolvedAt`
   poblados.
7. Rechazo exitoso: mismo montaje que el 6, pero `RejectAsync` → `Rechazada`.
8. 403 cuando quien llama a `ApproveAsync` no es el jefe resuelto por `OrgHierarchy` (un tercero
   cualquiera, con o sin rol, que no es la cadena jefe→subordinado de esa tarea).
9. Anomalía de `RN-ALT-054`: el solicitante tiene 2 roles asignados en `UserRoles` → la aprobación
   por la vía de `OrgHierarchy` falla (no elige con `.First()`), y sólo un admin puede resolverla.

## Lo que NO debes hacer

- No toques `TaskAlertEngineService.cs` ni `TaskEscalationService.cs` — la consecuencia de una
  justificación aprobada sobre el ciclo de alertas (`RN-ALT-013`) es D11-06, no este ticket.
- No dispares ninguna notificación al jefe cuando se solicita una justificación. Es un vacío real
  (documentado en el tablero de la orquestación), pero no es de este ticket.
- No implementes ningún endpoint de listado global ni de "mis justificaciones pendientes de
  aprobar" — sólo por tarea (`by-task/{tasksId}`).
- No toques `TaskAppService.cs`, `Program.cs`, ni la entidad/migración de D11-04.
- No implementes frontend.

## Convenciones aplicables

- `CONVENTIONS.md` §4.1 y §6 (backend .NET 10, endpoints, DI)
- Archivos en UTF-8 sin mojibake

## Verificación obligatoria

```bash
dotnet build api/LuxuryApp.sln
dotnet test api/LuxuryApp.sln --filter TaskJustificationAppServiceTests
node scripts/audit-conventions.mjs
node scripts/scan-mojibake.mjs api
```

Pega la salida literal de los cuatro. Criterio: compila sin errores nuevos, los tests nuevos
pasan todos, `audit-conventions.mjs` no aumenta de 10, mojibake en cero sobre lo tocado.

## Reporte de finalización

1. Archivos creados/tocados, con una línea de qué hace cada uno
2. Salida literal de los cuatro comandos
3. Decisiones que tomaste por tu cuenta y por qué
4. Lo que NO hiciste y el motivo
5. Riesgos detectados que no estaban en este prompt

No avances al siguiente ticket. Espera la auditoría.
