# TICKET T-09 — Entidad `TaskAlertLog` y su migración

Trabajas en el repositorio LuxuryApp. Antes de escribir código, lee `CONVENTIONS.md` y
`AGENTS.md`.

Este ticket **es sólo esquema**, siguiendo el mismo patrón que T-03 y T-07: la entidad y su
migración, nada de lógica de negocio. El motor de alertas que la usa es el ticket siguiente
(T-09b).

## Contexto

El motor de alertas necesita una bitácora: qué alerta se envió, sobre qué tarea, a quién, por qué
canal, cuándo, y si el canal confirmó la entrega o no. Es la pieza que impide repetir el error de
`SmsService` (reportar éxito sin haber entregado nada) — `RN-ALT-006` exige que ninguna alerta se
marque como entregada sin confirmación real del canal.

## Tareas de Backend

### 1. Enum `TaskAlertType`

Archivo nuevo: `api/LuxuryApp.Shared/Enums/TaskAlertType.cs`

```csharp
namespace LuxuryApp.Shared.Enums;

public enum TaskAlertType
{
    [Display(Name = "Aviso Previo")]
    AvisoPrevio,

    [Display(Name = "Recordatorio")]
    Recordatorio,

    [Display(Name = "Vencida")]
    Vencida,

    [Display(Name = "Escalacion")]
    Escalacion,

    [Display(Name = "Incumplimiento")]
    Incumplimiento,

    [Display(Name = "Arrastre")]
    Arrastre
}
```

Corrige los acentos que falten en los `Display(Name = ...)` según corresponda en español (revisa
cómo se escriben en otros enums del repo, por ejemplo `RecurringTemplateStatus`, para mantener el
mismo criterio de acentuación).

Regístralo en `api/LuxuryApp.Application/Moduls/SharedLuxuryApp/Endpoints/SelectItemEnumEndPoints.cs`
con `Map<TaskAlertType>(...)`, mismo patrón que los demás enums ahí (`priority-level`,
`ticket-message-status`). Elige una ruta y un nombre de acción descriptivos, coherentes con los
existentes.

**No reutilices ni modifiques `NotificationChannel`** para el canal de la alerta — ya existe y se
reutiliza tal cual, no es parte de este enum nuevo.

### 2. Entidad `TaskAlertLog`

Archivo nuevo:
`api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Operations/TaskEngine/TaskAlertLog.cs`

```csharp
[Table("TaskAlertLogs")]
public class TaskAlertLog : GuidIdEntity
{
    [Required]
    [Column("TasksId")]
    public Guid TasksId { get; set; }
    public Tasks Tasks { get; set; }

    [Required]
    public TaskAlertType AlertType { get; set; }

    [Required]
    public NotificationChannel Channel { get; set; }

    [Required]
    [Column("RecipientUserId")]
    public string RecipientUserId { get; set; }
    public ApplicationUser Recipient { get; set; }

    [Required]
    public bool Delivered { get; set; }

    [Required]
    public DateTime SentAt { get; set; } = DateTime.UtcNow;
}
```

Ajusta nombres/tipos si algo no coincide exactamente con las convenciones de las entidades
vecinas en la misma carpeta (`TaskComment.cs`, `TaskAttachment.cs`) — sigue el mismo estilo de
anotaciones que ya usan.

Agrega índice `(TasksId, AlertType, SentAt)` — es la consulta que usará el motor de alertas para
decidir si ya se envió un tipo de alerta reciente sobre una tarea, y la que usará el futuro
tablero de cumplimiento.

**Nota, no requiere ninguna acción de tu parte:** `Tasks` declara `[Table("Tasks")]`, pero el
nombre físico real de esa tabla es `Task` (singular) — ya documentado en T-08. La relación FK
funciona igual a través de EF sin que tengas que hacer nada especial; sólo es para que no te
sorprenda si lo ves al revisar la migración generada.

### 3. `ApplicationDbContext`

Agrega `public DbSet<TaskAlertLog> TaskAlertLog { get; set; }` junto a los `DbSet` vecinos
(`TaskAttachment`, `TaskComment`) en `api/LuxuryApp.Infrastructure.Data/Data/ApplicationDbContext.cs`.

### 4. Migración

Genera la migración. Nómbrala `TaskAlertLog`. Es una tabla nueva, completamente aditiva — no hay
backfill posible ni necesario.

## Lo que NO debes hacer

- No implementes ningún servicio que escriba en esta tabla — eso es T-09b.
- No toques `RecurringTaskGenerationService.cs` ni ningún otro servicio existente.
- No modifiques `NotificationChannel` ni ningún otro enum compartido existente.
- No apliques la migración a ninguna base de datos.
- No toques `Program.cs`.

## Convenciones aplicables

- `CONVENTIONS.md` §4.1, y las reglas críticas 6/7 (SELECT centralizado, `DisplayName` en
  español) para el enum nuevo
- Archivos en UTF-8 sin mojibake

## Verificación obligatoria

```bash
dotnet build api/LuxuryApp.sln
node scripts/audit-conventions.mjs
node scripts/scan-mojibake.mjs api
```

Pega la salida literal de los tres. Criterio: compila sin errores nuevos, `audit-conventions.mjs`
no aumenta de 10, mojibake en cero sobre lo tocado.

## Criterio de PASO del ticket

Pega en tu reporte el contenido completo de `Up()` de la migración.

## Reporte de finalización

1. Archivos creados/tocados, con una línea de qué hace cada uno
2. Salida literal de los tres comandos
3. Decisiones que tomaste por tu cuenta y por qué
4. Lo que NO hiciste y el motivo
5. Riesgos detectados que no estaban en este prompt

No avances al siguiente ticket. Espera la auditoría.
