# TICKET T-04 — Servicio de catálogo de obligaciones recurrentes

Trabajas en el repositorio LuxuryApp (.NET 10 + Angular 22). Antes de escribir código, lee
`CONVENTIONS.md` y `AGENTS.md`. Respeta la jerarquía de convenciones ahí definida.

## Contexto

T-03 dejó la entidad `RecurringTaskTemplate` extendida y su migración aplicada, sin ninguna
lógica de negocio. Este ticket construye el servicio que la administra: alta, edición, listado y
las validaciones que hacen que una plantilla mal configurada no pueda guardarse. Es la primera
pieza con endpoints reales del módulo.

**Dónde vive el código nuevo.** El motor vigente actual está mal ubicado bajo
`ReclutamientoLuxuryApp` y se retira en un ticket futuro (T-15). No pongas código nuevo ahí. El
modelo de negocio ancla la obligación al **grupo de trabajo**
(`api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Tasks/`), así que el servicio nuevo vive
como submódulo hermano de `WorkGroup/` y `WorkGroupMember/` en esa misma carpeta:

```
api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Tasks/RecurringTaskCatalog/
├── DTOs/
├── Interfaces/
├── Services/
├── EndPoints/
└── Mapping/
```

Usa `api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Tasks/WorkGroup/` como referencia de
convención en cada capa: mismo estilo de interfaz, mismo patrón de endpoints con
`IEndPointsModule`, mismo uso de AutoMapper (`Profile`) para el mapeo.

## Reglas de negocio que este servicio debe implementar

Todas están documentadas en
`docs/modulos-existente/alertas-tareas-recurrentes/02-business-rules-analysis.md` y su enmienda
`02b-enmienda-anclaje-grupos.md`. Resumen operativo:

| Regla | Qué exige |
| --- | --- |
| `RN-ALT-030` | `RecurrenceRule` debe ser una RRULE válida del estándar iCalendar |
| `RN-ALT-042` | No se puede guardar una plantilla contra un grupo **sin administradores** |
| `RN-ALT-044` | No se puede anclar una plantilla a un grupo con `Visibility == Public` |
| `RN-ALT-021` (reescrita) | Crear/editar plantillas: sólo `SuperUsuario`, `Direccion`, `Administrador`, y sólo sobre grupos del cliente en contexto |
| `RN-ALT-055` (nueva, ver `04-implementation-plan.md`) | Marcar una plantilla como `Critical` está restringido a `SuperUsuario` y `Direccion` |
| `RN-ALT-003` / `RN-ALT-033` | Si `Criticality == Critical`, `BackupUserId` es **obligatorio** |
| Rango de días | `AdvanceNoticeDays` entre 0 y 30 (ya lo impone `[Range]` en la entidad; valídalo también en el servicio con un mensaje de error claro, no dejes que sea un `DbUpdateException` genérico) |

**No implementes en este ticket** (son de tickets posteriores):
- `RN-ALT-043` (detectar grupo desactivado *después* de creada la plantilla) — es lógica del
  generador, T-08.
- `RN-ALT-041` (elegir responsable de forma determinista entre administradores) — también del
  generador, T-08.
- Checklist, justificación, bitácora de alertas, comprobante — T-09/T-12/T-13.
- Sugerencia automática de dependencia entre obligaciones (`RN-ALT-063`) — no está programada
  todavía en el tablero; si la implementas, es alcance no pedido.

## Tareas de Backend

### 1. Interfaz del servicio

`api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Tasks/RecurringTaskCatalog/Interfaces/IRecurringTaskCatalogAppService.cs`

Namespace `LuxuryApp.Application.Interfaces` (sigue la convención del proyecto, no crees un
namespace nuevo). Métodos:

- `Task<ApiResponseDTO<RecurringTaskTemplateDTO>> GetByIdAsync(Guid id)`
- `Task<ApiResponseDTO<List<RecurringTaskTemplateDTO>>> GetAllByCustomerAsync(Guid customerId, Guid? workGroupId, bool activeOnly)`
- `Task<ApiResponseDTO<RecurringTaskTemplateDTO>> CreateAsync(RecurringTaskTemplateAddOrEditDTO dto)`
- `Task<ApiResponseDTO<RecurringTaskTemplateDTO>> UpdateAsync(Guid id, RecurringTaskTemplateAddOrEditDTO dto)`
- `Task<ApiResponseDTO<bool>> ToggleStatusAsync(Guid id)` — alterna únicamente entre `Active` y
  `Paused`. No implementes `Cancelled` en este ticket: no hay flujo de cancelación definitivo
  todavía.

Documenta cada método con un comentario XML de una línea, como en `ITaskGroupAppService.cs`.

### 2. DTOs

`api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Tasks/RecurringTaskCatalog/DTOs/`

- `RecurringTaskTemplateAddOrEditDTO` — todos los campos capturables: `Title`, `Description`,
  `RecurrenceRule`, `Criticality` (tipo `PriorityLevel`), `AdvanceNoticeDays`, `StartDate`,
  `EndDate`, `WorkGroupId`, `BackupUserId`, `ExpectedDeliverableName`, `RequiresAttachment`. Con
  las anotaciones `[Required]`/`[MaxLength]` que correspondan, espejo de la entidad.
- `RecurringTaskTemplateDTO` — modelo de lectura para listas y detalle. Incluye, además de los
  campos anteriores: `Id`, `Status`, `WorkGroupName` (del grupo relacionado, no un `Guid` pelón),
  `CustomerId`.

### 3. Servicio

`api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Tasks/RecurringTaskCatalog/Services/RecurringTaskCatalogAppService.cs`

Inyecta `ApplicationDbContext dbContext` y `ICurrentUserService currentUserService`. **No inyectes
`UserManager` para resolver el rol**: `ICurrentUserService.UserRole` ya trae el rol único del
usuario autenticado (`api/LuxuryApp.Shared/Services/ICurrentUserService.cs`) — es un solo string,
no una lista, porque la plataforma ya opera bajo la convención de un rol por usuario. Úsalo
directamente: `currentUserService.UserRole is "SuperUsuario" or "Direccion"`.

**Resolución del cliente:** sigue el patrón ya usado en
`TaskAppService.CreateTaskAsync` (`CustomerId = currentUserService.CustomerId ?? DTO.CustomerId`)
— prioriza el cliente del contexto de sesión; si es nulo (caso de `SuperUsuario` gestionando
varios clientes), usa el que venga en el DTO. **No agregues `CustomerId` al
`RecurringTaskTemplateAddOrEditDTO`** si no lo necesitas para ese fallback — evalúalo y decide;
si lo agregas, documenta por qué en tu reporte.

**Validaciones de `CreateAsync` y `UpdateAsync`, en este orden, cada una con su propio mensaje de
error vía `ApiResponseDTO<T>.ErrorResult(...)`:**

1. El grupo (`WorkGroupId`) existe.
2. El grupo pertenece al cliente en contexto (o el usuario es `SuperUsuario`/`Direccion`).
3. `WorkGroup.Active == true` — si no, error explícito: "No se puede anclar una obligación a un
   grupo inactivo" (`RN-ALT-043` es sobre detectarlo después de creada; aquí sólo se impide
   crearla contra un grupo ya inactivo).
4. `WorkGroup.Visibility != VisibilityLevel.Public` (`RN-ALT-044`).
5. Existe al menos un `WorkGroupMembers` con `IsAdmin == true` para ese `WorkGroupId`
   (`RN-ALT-042`). Consulta directa a `dbContext.WorkGroupMembers`, no reutilices
   `GetAdministratorGroupAsync` de `TaskAppService` — está en otro servicio y no vale la pena
   acoplar los dos módulos por un `Any()`.
6. `RecurrenceRule` parsea como RRULE válida. Usa
   `new Ical.Net.DataTypes.RecurrencePattern(dto.RecurrenceRule)` dentro de un `try/catch`; si
   lanza, error claro indicando que la regla de recurrencia no es válida.
7. `AdvanceNoticeDays` entre 0 y 30 inclusive.
8. Si `Criticality == PriorityLevel.Critical`:
   - El usuario debe ser `SuperUsuario` o `Direccion` (`RN-ALT-055`). Si no, error explícito —
     no un 403 genérico, sino un mensaje que diga que marcar crítica está restringido.
   - `BackupUserId` no puede ser nulo ni vacío (`RN-ALT-003`/`033`).
   - `BackupUserId`, si viene, debe existir como `ApplicationUser` activo.

Si **cualquier** validación falla, no se guarda nada — no hay guardado parcial.

**`GetAllByCustomerAsync`:** filtra siempre por el cliente en contexto salvo rol admin (mismo
criterio que el punto 2), opcionalmente por `WorkGroupId` si se pasa, y por `Status == Active` si
`activeOnly` es `true`.

### 4. Mapeo

`api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Tasks/RecurringTaskCatalog/Mapping/RecurringTaskCatalogMapper.cs`

`Profile` de AutoMapper, mismo patrón que `WorkGroupMapper.cs`. Mapea `RecurringTaskTemplate` ↔
`RecurringTaskTemplateDTO` y `RecurringTaskTemplateAddOrEditDTO` → `RecurringTaskTemplate`,
resolviendo `WorkGroupName` desde `WorkGroup.WorkGroupCategories`... revisa qué campo de
`WorkGroup` sirve como nombre visible (no tiene un campo `Name` directo — probablemente lo
correcto es usar el nombre de `WorkGroupCategories`, o si no hay nombre propio del grupo,
documenta cuál usaste y por qué).

### 5. Endpoints

`api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Tasks/RecurringTaskCatalog/EndPoints/RecurringTaskTemplatesEndPoints.cs`

Implementa `IEndPointsModule` (se auto-registra por reflexión, no hay que engancharlo a mano).
Ruta base `api/recurring-task-templates`. Seis rutas, espejo de `TaskGroupsEndpoints.cs`:

- `GET {id:guid}` — sin restricción de rol adicional, sólo autenticado
- `GET list/{customerId:guid}` — con querystring opcionales `workGroupId` y `activeOnly`
- `POST ""` — `RequireAuthorization(new AuthorizeAttribute { Roles = "SuperUsuario,Direccion,Administrador" })`
- `PUT {id:guid}` — mismos roles
- `PATCH toggle-status/{id:guid}` — mismos roles

Usa `LogActivityMetadata` en cada endpoint, mismo estilo que el archivo de referencia.

### 6. Registro en el contenedor de dependencias

Archivo: `api/LuxuryApp.Api/ServiceExtensions/DependencyInjection.Controllers.cs`

Agrega una línea junto al registro de `ITaskGroupAppService` (línea 488):

```csharp
services.AddScoped<IRecurringTaskCatalogAppService, RecurringTaskCatalogAppService>();
```

Si el proyecto usa un `AutoMapper.Profile` con registro automático por ensamblado (revisa cómo se
registra `WorkGroupMapper`), no necesitas registrar el nuevo `Profile` a mano; si es manual,
regístralo igual que los demás.

## Tareas de Frontend

Ninguna en este ticket. La pantalla que consume estos endpoints es T-06.

## Lo que NO debes hacer

- No toques `RecurringTaskGeneratorService.cs` ni `RecurringTaskSchedulerJob.cs`.
- No implementes `RN-ALT-041`, `RN-ALT-043` (comportamiento del generador), checklist,
  justificación, bitácora de alertas ni comprobante.
- No implementes eliminación física de plantillas.
- No crees el estado `Cancelled` en el flujo de `ToggleStatusAsync`.
- No toques `Tasks.cs`, `TaskAttachment.cs` ni ninguna entidad fuera de lo ya extendido en T-03.
- Antes de prohibirte tocar algo yo debería haber verificado que nada se rompe por ello: si al
  implementar este ticket descubres que algo fuera de esta lista deja de compilar por una
  dependencia real (como pasó en T-03 con el job legado), corrígelo de forma mínima y decláralo
  explícitamente en tu reporte — no lo dejes roto por seguir la letra de esta lista.

## Convenciones aplicables

- `CONVENTIONS.md` §4.1 — backend .NET: servicios, DTOs, endpoints, Minimal API
- `ApiResponseDTO<T>` para toda respuesta, `TypedResults` en los endpoints
- `ICurrentUserService` para resolver usuario/rol/cliente, nunca confiar en parámetros del
  cliente para el `CustomerId` cuando existe contexto de sesión
- Archivos en UTF-8 sin mojibake

## Verificación obligatoria

Corre y **pega la salida literal** de:

```bash
dotnet build api/LuxuryApp.sln
node scripts/audit-conventions.mjs
node scripts/scan-mojibake.mjs api
```

Criterio de éxito:
- La compilación pasa sin errores nuevos
- `audit-conventions.mjs` **no aumenta** su conteo actual de 10 errores
- `scan-mojibake.mjs` da cero sobre los archivos que tocaste

## Criterio de PASO del ticket

Debe quedar demostrado en tu reporte, con razonamiento sobre el código (no hace falta base de
datos para esto, son casos de código):

1. Crear una plantilla contra un grupo sin administradores es rechazada, con mensaje explícito.
2. Crear una plantilla `Critical` sin `BackupUserId` es rechazada.
3. Un usuario con rol `Administrador` que intenta crear una plantilla `Critical` es rechazado
   (sólo `SuperUsuario`/`Direccion` pueden).
4. Una `RecurrenceRule` inválida (por ejemplo, `"esto no es una rrule"`) es rechazada antes de
   tocar la base de datos.
5. Un grupo con `Visibility == Public` no puede recibir una plantilla nueva.

## Reporte de finalización

Al terminar entrega:
1. Archivos tocados/creados, con una línea de qué hace cada uno
2. Salida literal de los tres comandos
3. Decisiones que tomaste por tu cuenta y por qué (en particular: cómo resolviste el nombre
   visible del grupo para el DTO de lectura, y si agregaste `CustomerId` al DTO de alta)
4. Lo que NO hiciste del ticket y el motivo
5. Riesgos que detectaste y no estaban en este prompt

No avances al siguiente ticket. Espera la auditoría.
