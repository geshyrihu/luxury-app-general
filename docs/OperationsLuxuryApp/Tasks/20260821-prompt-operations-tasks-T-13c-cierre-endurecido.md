# TICKET T-13c — Cierre endurecido: checklist completo + comprobante obligatorio

Trabajas en el repositorio LuxuryApp (.NET 10, `api/`). Antes de escribir código, lee
`CONVENTIONS.md` y `AGENTS.md`. Este ticket agrega **validaciones de bloqueo** al cierre de una
tarea — no crea entidades ni endpoints nuevos, usa lo que ya aprobaron T-13a (`TaskAttachment`
reapuntada, `TaskChecklistItem`) y T-13b (CRUD de checklist).

## Contexto y regla exacta a aplicar

`RN-ALT-034`, en su forma **final y vigente** (no la versión original del plan, que ataba el
comprobante sólo a la criticidad — fue modificada explícitamente):
`docs/modulos-existente/alertas-tareas-recurrentes/06-analisis-flujos-simplificacion.md:349`:
*"el comprobante deja de depender sólo de la criticidad: lo declara cada obligación"*. Esa
declaración ya existe como el campo `RecurringTaskTemplate.RequiresAttachment` (booleano,
aprobado desde T-03/T-04, consumido por el formulario de catálogo en T-06 como el checkbox
"Requiere adjunto").

**Regla exacta a implementar en `CloseTaskAsync`:**

1. **Checklist completo.** Si la tarea tiene algún `TaskChecklistItem` con `IsDone == false`, no
   se puede cerrar.
2. **Comprobante obligatorio condicionado a la plantilla.** Sólo si la tarea nació de una
   plantilla recurrente (`Tasks.RecurringTemplateId` no es `null`) y esa plantilla tiene
   `RequiresAttachment == true`: debe existir al menos un `TaskAttachment` con `TasksId` igual al
   de la tarea. Si `RecurringTemplateId` es `null` (tarea manual, no generada por el motor
   recurrente) o la plantilla no exige comprobante, esta validación no aplica — no es un
   requisito universal de cierre, es específico de este módulo.

## Dónde va el cambio

Archivo: `api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Tasks/Tasks/Services/TaskAppService.cs`,
método `CloseTaskAsync(Guid id, TasksCloseDTO DTO)` (línea ~875).

Inserta la validación **después** de la comprobación de `closedByUser == null` (línea ~888) y
**antes** de `string path = fileWritePathService.TicketDirectory(DTO.CustomerId);` (línea ~891) —
es decir, antes de que el método empiece a mutar `entity` o a escribir archivos. Si la validación
falla, retorna inmediatamente con `ApiResponseDTO<TasksCloseDTO>.ErrorResult(...)`, igual que ya
hacen los otros `return` tempranos de ese mismo método.

Ejemplo de forma (ajusta nombres si el estilo exacto del archivo difiere en detalles menores, pero
la lógica debe ser esta):

```csharp
var pendingChecklistCount = await dbContext.TaskChecklistItem
    .AsNoTracking()
    .CountAsync(x => x.TasksId == id && !x.IsDone);

if (pendingChecklistCount > 0)
{
    return ApiResponseDTO<TasksCloseDTO>.ErrorResult(
        $"No se puede cerrar la tarea: quedan {pendingChecklistCount} paso(s) del checklist sin confirmar.");
}

if (entity.RecurringTemplateId.HasValue)
{
    var requiresAttachment = await dbContext.RecurringTaskTemplate
        .AsNoTracking()
        .Where(x => x.Id == entity.RecurringTemplateId.Value)
        .Select(x => x.RequiresAttachment)
        .FirstOrDefaultAsync();

    if (requiresAttachment)
    {
        var hasAttachment = await dbContext.TaskAttachment
            .AsNoTracking()
            .AnyAsync(x => x.TasksId == id);

        if (!hasAttachment)
        {
            return ApiResponseDTO<TasksCloseDTO>.ErrorResult(
                "No se puede cerrar la tarea: la plantilla exige un comprobante documental y no se ha adjuntado ninguno.");
        }
    }
}
```

No uses `entity.CustomerId` para esta consulta — el filtro correcto es `RecurringTemplateId`,
tal como está arriba.

## Lo que NO debes hacer

- No toques `TaskChecklistItem`, `TaskAttachment`, ni sus servicios/endpoints (T-13a/T-13b, ya
  aprobados) — sólo **consultas** de lectura contra ellos desde `CloseTaskAsync`.
- No agregues un endpoint para subir el comprobante — sigue sin existir un flujo de subida de
  `TaskAttachment`; eso es T-13d (frontend) o un ticket de backend aparte si hace falta un
  endpoint de subida que hoy no existe. Este ticket sólo **valida presencia**, no gestiona la
  carga.
- No cambies el criterio de `RN-ALT-034` para que dependa de `Priority == Critical` — esa versión
  quedó reemplazada explícitamente por `RequiresAttachment` (ver cita arriba). Si encuentras
  código o comentarios que todavía atan el comprobante a la criticidad, repórtalo como hallazgo,
  no lo repliques.
- No toques ninguna otra parte de `CloseTaskAsync` (notificaciones, `BeforeWork`/`AfterWork`,
  etc.) — sólo agregas las dos validaciones tempranas.

## Verificación obligatoria

```bash
dotnet build api/LuxuryApp.sln
```

Agrega tests para `CloseTaskAsync` (o extiende el archivo de tests que ya exista para
`TaskAppService`, si lo hay — revísalo antes de crear uno nuevo) cubriendo al menos:
1. Cierre bloqueado por checklist pendiente.
2. Cierre bloqueado por comprobante faltante en plantilla con `RequiresAttachment = true`.
3. Cierre permitido cuando el checklist está completo y el comprobante existe (o no se exige).
4. Cierre permitido para una tarea sin `RecurringTemplateId` (tarea manual, sin las validaciones
   nuevas).

Corre `dotnet test` filtrando esos tests y pega la salida literal.

## Criterio de PASO

- `CloseTaskAsync` rechaza el cierre si hay pasos de checklist sin confirmar.
- `CloseTaskAsync` rechaza el cierre si la plantilla exige comprobante y no hay ninguno.
- Una tarea sin plantilla recurrente, o con plantilla que no exige comprobante, cierra sin esa
  segunda validación.
- `dotnet build` pasa sin errores nuevos.

## Reporte de finalización

1. Cambios exactos hechos en `CloseTaskAsync`, con número de línea
2. Salida literal de `dotnet build` y de los tests nuevos/extendidos
3. Decisiones que tomaste por tu cuenta y por qué
4. Lo que NO hiciste del ticket y el motivo
5. Riesgos detectados que no estaban en este prompt (en particular, si encontraste que
   `CloseTaskAsync` se invoca desde algún otro lugar que dependa del comportamiento anterior sin
   estas validaciones — por ejemplo, un job o proceso automático de cierre — repórtalo antes de
   asumir que sólo se llama manualmente)

No avances al siguiente ticket. Espera la auditoría.
