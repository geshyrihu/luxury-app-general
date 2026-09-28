# TICKET T-13b — Servicio y endpoints del checklist de tareas

Trabajas en el repositorio LuxuryApp (.NET 10, `api/`). Antes de escribir código, lee
`CONVENTIONS.md` y `AGENTS.md`. Este ticket construye el CRUD de `TaskChecklistItem` (entidad ya
creada y aprobada en T-13a) — sin tocar `CloseTaskAsync` ni el "cierre endurecido" (eso es T-13c),
sin frontend (eso es T-13d).

## Contexto

`TaskChecklistItem` (`api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Operations/TaskEngine/TaskChecklistItem.cs`,
tabla `TaskChecklistItems`) ya existe, aprobada en T-13a: `TasksId`, `Description`, `IsDone`,
`DoneByUserId`, `DoneAt`. No hay entidad de "plantilla de checklist" en el plan — los pasos se
agregan directamente sobre una `Tasks` concreta, ad-hoc (a diferencia de `AsambleaChecklistTemplate`,
que sí es un catálogo reutilizable; **no sigas ese patrón**, es de otro módulo con otro diseño).

**Referencia de convención exacta a copiar** — el módulo hermano de T-04, ya aprobado, en
`api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Tasks/RecurringTaskCatalog/`:
- DTOs: `DTOs/RecurringTaskTemplateDTO.cs`, `DTOs/RecurringTaskTemplateAddOrEditDTO.cs`
- Interfaz: `Interfaces/IRecurringTaskCatalogAppService.cs`
- Servicio: `Services/RecurringTaskCatalogAppService.cs`
- Endpoints: `EndPoints/RecurringTaskTemplatesEndPoints.cs`
- Mapper: `Mapping/RecurringTaskCatalogMapper.cs`

Copia namespaces, estilo de `ApiResponseDTO<T>.SuccessResult(...)`/`ErrorResult(...)`, e inyección
por constructor primario (`ApplicationDbContext dbContext, ICurrentUserService
currentUserService, IMapper mapper`) exactamente como en esos archivos.

## Estructura nueva

Carpeta: `api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Tasks/TaskChecklist/`
(hermana de `RecurringTaskCatalog/`, mismo nivel), con las mismas subcarpetas
(`DTOs/`, `Interfaces/`, `Services/`, `EndPoints/`, `Mapping/`).

### DTOs

`TaskChecklistItemDTO` (respuesta, hereda `GuidIdEntityDTO` igual que `RecurringTaskTemplateDTO`):
`TasksId`, `Description`, `IsDone`, `DoneByUserId`, `DoneByUserName` (nombre completo, resuelto
igual que `WorkGroupName` en `RecurringTaskTemplateDTO` — vía `.ForMember` en el mapper), `DoneAt`.

`TaskChecklistItemAddDTO` (alta): `TasksId` (`[Required]`), `Description` (`[Required]`,
`[MaxLength(300)]` — mismo límite que la entidad).

### Interfaz `ITaskChecklistAppService`

```csharp
Task<ApiResponseDTO<List<TaskChecklistItemDTO>>> GetByTaskIdAsync(Guid tasksId);
Task<ApiResponseDTO<TaskChecklistItemDTO>> AddAsync(TaskChecklistItemAddDTO dto);
Task<ApiResponseDTO<TaskChecklistItemDTO>> ToggleDoneAsync(Guid id);
Task<ApiResponseDTO<bool>> DeleteAsync(Guid id);
```

### Servicio `TaskChecklistAppService`

- `GetByTaskIdAsync`: lista los items de una `Tasks`, ordenados por `CreateDate`/fecha de alta
  (usa el orden natural de inserción si la entidad no tiene columna de orden — no le agregues una
  columna nueva, fuera de alcance). Valida que la `Tasks` exista (404 si no) y que
  `currentUserService.CustomerId` coincida con `Tasks.CustomerId` salvo
  `CanManageAnyCustomer()` (mismo patrón exacto que
  `RecurringTaskCatalogAppService.cs:24` — cópialo, incluido el helper privado
  `CanManageAnyCustomer()`).
- `AddAsync`: valida `Tasks` existente y permiso de cliente (mismo patrón). Crea el
  `TaskChecklistItem` con `IsDone = false`. No pongas límite de cantidad de items — no está en el
  plan.
- `ToggleDoneAsync`: obtiene el item (404 si no existe), valida permiso vía la `Tasks` relacionada
  (necesitas incluir/cargar `Tasks` o consultar `Tasks.CustomerId` por separado). Si `IsDone` es
  `false`, lo marca `true`, `DoneByUserId = currentUserService.UserId`,
  `DoneAt = DateTime.UtcNow`. Si ya es `true`, lo revierte a `false` y limpia `DoneByUserId`/
  `DoneAt` a `null` — es un alternador, no una acción de un solo sentido.
- `DeleteAsync`: borra físicamente el item (a diferencia de `RecurringTaskTemplate`, que no
  permite borrado físico — `TaskChecklistItem` sí, porque son pasos de trabajo, no catálogo).
  Valida existencia y permiso igual que los anteriores.

### Endpoints — `TaskChecklistItemsEndPoints`

Grupo `api/task-checklist-items`, mismo estilo que `RecurringTaskTemplatesEndPoints.cs`
(`.WithTags(...)`, `.RequireAuthorization()`, `.AddEndpointFilter<LogUserActivityEndPointsFilter>()`,
`.WithMetadata(new LogActivityMetadata(...))` en cada ruta):

| Verbo | Ruta | Servicio |
| --- | --- | --- |
| GET | `by-task/{tasksId:guid}` | `GetByTaskIdAsync` |
| POST | `` | `AddAsync` |
| PATCH | `toggle-done/{id:guid}` | `ToggleDoneAsync` |
| DELETE | `{id:guid}` | `DeleteAsync` |

No restrinjas por rol (`RequireAuthorization(new AuthorizeAttribute { Roles = ... })`) como sí
hace T-04 en alta/edición de plantilla — marcar un paso como hecho o agregar uno es una acción
operativa de cualquier usuario autenticado con acceso a la tarea, la validación de permiso real ya
la hace el servicio comparando `CustomerId`.

### Mapper `TaskChecklistMapper`

`CreateMap<TaskChecklistItem, TaskChecklistItemDTO>()` con `.ForMember(x => x.DoneByUserName, opt
=> opt.MapFrom(x => x.DoneByUser != null ? x.DoneByUser.FullName : null))`, más
`CreateMap<TaskChecklistItemAddDTO, TaskChecklistItem>()`. Mismo estilo que
`RecurringTaskCatalogMapper.cs`.

### Registro en DI

Archivo: `api/LuxuryApp.Api/ServiceExtensions/DependencyInjection.Controllers.cs`

Junto a la línea `services.AddScoped<IRecurringTaskCatalogAppService,
RecurringTaskCatalogAppService>();` (línea ~489), agrega:

```csharp
services.AddScoped<ITaskChecklistAppService, TaskChecklistAppService>();
```

Los endpoints (`IEndPointsModule`) se auto-descubren — no los registres a mano en ningún otro
lado; confirma que el auto-discovery ya existente los recoja (mismo mecanismo que usan los demás
módulos de esta migración a Minimal API).

## Lo que NO debes hacer

- No modifiques `CloseTaskAsync`, `TaskAppService.cs`, ni ningún flujo de cierre — es T-13c.
- No crees frontend.
- No le agregues plantilla/catálogo de checklist reutilizable — no está en el plan, cada
  `TaskChecklistItem` se agrega directo a una `Tasks`.
- No toques `TaskAttachment`, `RecurringTaskTemplate`, ni nada de T-13a.
- No agregues restricción de cantidad de items ni de orden manual — fuera de alcance.

## Verificación obligatoria

```bash
dotnet build api/LuxuryApp.sln
```

Pega la salida literal. Si hay pruebas unitarias del proyecto vecino (`RecurringTaskCatalog`) que
sirvan de referencia de cómo se testea un `AppService` en este repo, agrega al menos 2-3 tests
equivalentes para `TaskChecklistAppService` (alta, toggle en ambos sentidos, borrado) y corre
`dotnet test` sobre el proyecto de tests, pegando la salida literal.

## Criterio de PASO

- CRUD completo y funcional: listar por tarea, agregar, alternar hecho/no-hecho, borrar.
- Todas las operaciones validan que la `Tasks` pertenezca al cliente en contexto (salvo
  SuperUsuario/Dirección), igual que el resto del módulo.
- `ToggleDoneAsync` es reversible: alternar dos veces deja el item en su estado y campos
  originales (`DoneByUserId`/`DoneAt` en `null` si vuelve a `false`).
- `dotnet build` pasa sin errores nuevos.

## Reporte de finalización

1. Archivos creados/modificados, con una línea de qué hace cada uno
2. Salida literal de `dotnet build` (y de `dotnet test` si agregaste pruebas)
3. Decisiones que tomaste por tu cuenta y por qué
4. Lo que NO hiciste del ticket y el motivo
5. Riesgos detectados que no estaban en este prompt

No avances al siguiente ticket. Espera la auditoría.
