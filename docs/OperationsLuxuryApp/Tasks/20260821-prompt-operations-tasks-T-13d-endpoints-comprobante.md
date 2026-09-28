# TICKET T-13d — Endpoints de subida/consulta/borrado de `TaskAttachment` (comprobante)

Trabajas en el repositorio LuxuryApp (.NET 10, `api/`). Antes de escribir código, lee
`CONVENTIONS.md` y `AGENTS.md`. Este ticket construye el CRUD de subida de `TaskAttachment`
(entidad ya reapuntada en T-13a) — **es lo único que falta para que T-13c tenga sentido en la
práctica**: hoy `CloseTaskAsync` valida que exista un `TaskAttachment`, pero no existe ningún
endpoint para crear uno. Sin este ticket, ninguna tarea con `RequiresAttachment = true` se puede
cerrar jamás.

Este ticket es sólo backend. El frontend (subir el archivo desde la UI, mostrarlo en el detalle
de la tarea) es T-13e, después de que este quede aprobado.

## Contexto — patrón de documentos del proyecto (obligatorio, no inventes uno nuevo)

`TaskAttachment` (`api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Operations/TaskEngine/TaskAttachment.cs`,
tabla `TaskFiles`) tiene `TasksId`, `RecurringTemplateId` (nullable), `FilePath`, `MimeType`,
`FileName`, `CreatedAt`, `CreatedBy`.

El proyecto ya tiene los servicios de documentos que **debes reutilizar tal cual**, sin crear
alternativas:
- `IFileWritePathService.TicketDirectory(Guid customerId)` — mismo método que ya usa
  `CloseTaskAsync` para `BeforeWork`/`AfterWork`
  (`TaskAppService.cs:923`, `string path = fileWritePathService.TicketDirectory(DTO.CustomerId);`).
  Las tareas se siguen llamando "Ticket" en el almacenamiento de archivos por razones históricas
  — es el directorio correcto para adjuntos de `Tasks`, no crees uno nuevo tipo `TaskDirectory`.
- `IFileReadPathService.GetTicketPhotoPath(Guid customerId, string photoPath)` — devuelve una URL
  segura (`GetSecureFileUrl(...)` por dentro), no una ruta física. A pesar del nombre "Photo" es
  genérico, funciona igual para PDF.
- `ISecureFileStorageService.SaveAsync(IFormFile document, string path)` — persiste el archivo y
  devuelve el **nombre generado** (UUID) que va en `TaskAttachment.FilePath`. `DeleteFile(string
  path, string fileName)` para el borrado físico.

Referencia de flujo completo (alta + borrado con archivo real) a copiar:
`api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/CustomDocument/Services/CustomDocumentAppService.cs`
— método `AddAsync` (líneas 77-106) para el patrón de subida, `DeleteAsync` (líneas 135-171) para
el patrón de borrado con transacción. Usa `fileWritePathService.TicketDirectory(customerId)` en
vez de `fileWritePathService.DocumentTypeDirectory(...)` — es la única diferencia de fondo, ese
archivo usa un directorio por `DocumentType` que no aplica aquí.

## Estructura nueva

Carpeta: `api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Tasks/TaskAttachment/`
(hermana de `TaskChecklist/` y `RecurringTaskCatalog/`), con las subcarpetas `DTOs/`,
`Interfaces/`, `Services/`, `EndPoints/`, `Mapping/`.

### DTOs

`TaskAttachmentDTO` (respuesta, hereda `GuidIdEntityDTO`): `TasksId`, `RecurringTemplateId`,
`FileName`, `Path` (URL segura resuelta con `fileReadPathService.GetTicketPhotoPath(...)`, **no**
expongas `FilePath` crudo — mismo criterio que el patrón de documentos del proyecto: en BD el UUID,
en la respuesta la URL), `MimeType`, `CreatedAt`, `CreatedByName` (nombre completo, resuelto vía
`.ForMember` en el mapper igual que `DoneByUserName` en T-13b).

`TaskAttachmentUploadDTO` (alta, multipart): `TasksId` (`[Required]`), `File` (`IFormFile`,
`[Required]`). **No incluyas `RecurringTemplateId` en el DTO de entrada** — se resuelve del lado
del servidor desde `Tasks.RecurringTemplateId` de la tarea indicada, nunca del cliente (evita que
alguien falsifique el vínculo a una plantilla que no le corresponde).

### Interfaz `ITaskAttachmentAppService`

```csharp
Task<ApiResponseDTO<List<TaskAttachmentDTO>>> GetByTaskIdAsync(Guid tasksId);
Task<ApiResponseDTO<TaskAttachmentDTO>> UploadAsync(TaskAttachmentUploadDTO dto);
Task<ApiResponseDTO<bool>> DeleteAsync(Guid id);
```

### Servicio `TaskAttachmentAppService`

- Reutiliza el mismo patrón de validación de acceso que T-13b
  (`TaskChecklistAppService.cs` — `ValidateTaskAccessAsync`/`ValidateTaskAccess` +
  `CanManageAnyCustomer()`); cópialo, no lo dupliques con lógica distinta.
- `UploadAsync`: valida MIME permitido — **sólo PDF o imagen**, tal como dice el comentario de la
  entidad (`TaskAttachment.cs:36`, `"Tipo MIME del archivo (ej: image/png, application/pdf)"`).
  Rechaza cualquier otro `dto.File.ContentType` con un error claro, antes de llamar
  `fileStorageService.SaveAsync(...)`. Resuelve `RecurringTemplateId` desde
  `task.RecurringTemplateId` (la `Tasks` ya cargada al validar acceso), no del DTO.
  `CreatedBy = currentUserService.UserId`.
- `DeleteAsync`: seguí el patrón transaccional de `CustomDocumentAppService.DeleteAsync` (borra el
  registro de BD y el archivo físico; si el archivo físico falla, no dejes un registro huérfano).

### Endpoints — `TaskAttachmentsEndPoints`

Grupo `api/task-attachments`, mismo estilo (`.WithTags(...)`, `.RequireAuthorization()`,
`.AddEndpointFilter<LogUserActivityEndPointsFilter>()`, `.WithMetadata(new LogActivityMetadata(...))`):

| Verbo | Ruta | Servicio | Notas |
| --- | --- | --- | --- |
| GET | `by-task/{tasksId:guid}` | `GetByTaskIdAsync` | |
| POST | `` | `UploadAsync` | `[FromForm] TaskAttachmentUploadDTO DTO`, `.DisableAntiforgery()` — mismo patrón que `CustomerImagesEndpoints.cs:13-15` |
| DELETE | `{id:guid}` | `DeleteAsync` | |

Sin restricción de rol, igual criterio que T-13b: subir o borrar un comprobante es una acción
operativa validada por pertenencia al cliente, no por rol.

### Mapper `TaskAttachmentMapper`

`CreateMap<TaskAttachment, TaskAttachmentDTO>()` con `.ForMember(x => x.Path, opt =>
opt.MapFrom((src, _, _, ctx) => ((IFileReadPathService)ctx.Items["fileReadPathService"])...`) —
**si AutoMapper no tiene fácil acceso al servicio de rutas dentro del `.ForMember`, no fuerces
eso**: resuelve `Path` manualmente en el servicio después de mapear (patrón más simple, ya usado
en otros lados del proyecto: mapea el DTO sin `Path`, luego asigna
`dto.Path = fileReadPathService.GetTicketPhotoPath(customerId, entity.FilePath)` línea aparte).
Prioriza que funcione y sea legible sobre forzar todo dentro del mapper.

### Registro en DI

Junto a `services.AddScoped<ITaskChecklistAppService, TaskChecklistAppService>();` en
`api/LuxuryApp.Api/ServiceExtensions/DependencyInjection.Controllers.cs`, agrega:

```csharp
services.AddScoped<ITaskAttachmentAppService, TaskAttachmentAppService>();
```

## Lo que NO debes hacer

- No modifiques `CloseTaskAsync`, `TaskChecklistAppService`, ni nada de T-13a/T-13b/T-13c.
- No crees un nuevo método en `IFileWritePathService`/`IFileReadPathService` — `TicketDirectory`
  y `GetTicketPhotoPath` ya existen y son los correctos.
- No crees frontend — es T-13e.
- No permitas subir tipos MIME fuera de PDF/imagen.
- No aceptes `RecurringTemplateId` como entrada del cliente.

## Verificación obligatoria

```bash
dotnet build api/LuxuryApp.sln
```

Agrega tests del `AppService` siguiendo el estilo de `TaskChecklistAppServiceTests.cs` (T-13b):
alta con MIME válido, rechazo con MIME inválido, borrado, y rechazo cross-cliente. Corre
`dotnet test` filtrando esos tests y pega la salida literal.

Como verificación adicional de que T-13c ahora es alcanzable en la práctica: agrega o describe un
test (puede ser en `TaskAppServiceTests.cs` o uno de integración ligera) que suba un
`TaskAttachment` real vía este nuevo servicio y luego confirme que `CloseTaskAsync` ya no lo
bloquea — si no es práctico como test automatizado, explica en el reporte cómo lo verificaste
manualmente.

## Criterio de PASO

- Subir, listar y borrar comprobantes funciona de punta a punta contra almacenamiento real (no
  simulado) en los tests.
- Sólo PDF e imagen se aceptan.
- `RecurringTemplateId` se resuelve del servidor, nunca del DTO de entrada.
- Después de subir un adjunto a una tarea con plantilla `RequiresAttachment = true`, `CloseTaskAsync`
  ya no la bloquea (o quedó explicado cómo se verificó si no hay test automatizado para esto).
- `dotnet build` pasa sin errores nuevos.

## Reporte de finalización

1. Archivos creados/modificados, con una línea de qué hace cada uno
2. Salida literal de `dotnet build` y de los tests
3. Decisiones que tomaste por tu cuenta y por qué
4. Lo que NO hiciste del ticket y el motivo
5. Riesgos detectados que no estaban en este prompt

No avances al siguiente ticket. Espera la auditoría.
