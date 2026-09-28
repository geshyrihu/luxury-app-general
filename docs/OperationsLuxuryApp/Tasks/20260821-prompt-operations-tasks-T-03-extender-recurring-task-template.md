# TICKET T-03 — Extender `RecurringTaskTemplate` y migración

Trabajas en el repositorio LuxuryApp (.NET 10 + Angular 22). Antes de escribir código, lee
`CONVENTIONS.md` y `AGENTS.md`. Respeta la jerarquía de convenciones ahí definida.

## Contexto

`RecurringTaskTemplate` (tabla `TaskRecurringTemplates`) es la plantilla del motor de tareas
recurrentes que se está construyendo sobre el sistema de grupos de trabajo. Ya existe y ya
funciona para lo básico: título, descripción, recurrencia casera, vigencia y grupo. Le faltan
los campos que el módulo de alertas necesita para funcionar.

Este ticket **sólo cambia la entidad y su migración**. No toca servicios, no toca endpoints, no
implementa ninguna validación de negocio (eso es T-04) y no toca el generador de tareas. Es
exclusivamente esquema.

## Tareas de Backend

### 1. Modificar la entidad

Archivo:
`api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Operations/TaskEngine/RecurringTaskTemplate.cs`

Estado actual completo (para que tengas el punto de partida exacto):

```csharp
[Table("TaskRecurringTemplates")]
public class RecurringTaskTemplate : GuidIdEntity
{
    [Required] [MaxLength(100)] public string Title { get; set; }
    [MaxLength(500)] public string Description { get; set; }
    [Required] public RecurrencePattern Pattern { get; set; }
    [Range(1, 365)] public int Interval { get; set; } = 1;
    public DayOfWeek? DayOfWeek { get; set; }
    public int? DayOfMonth { get; set; }
    [Required] public DateOnly StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    [Required] [Column("WorkGroupId")] public Guid WorkGroupId { get; set; }
    public WorkGroup WorkGroup { get; set; }
    [Column("AssigneeId")] public string AssigneeId { get; set; }
    public ApplicationUser Assignee { get; set; }
    [Required] public RecurringTemplateStatus Status { get; set; } = RecurringTemplateStatus.Active;
    public HashSet<Tasks> GeneratedTasks { get; set; } = [];
}
```

Cámbiala a lo siguiente:

**a) Implementa `ITenantEntity`.**

```csharp
public class RecurringTaskTemplate : GuidIdEntity, ITenantEntity
{
    public Guid CustomerId { get; set; }
    public Customer Customer { get; set; }
    ...
```

Sigue el patrón exacto de `WorkGroup` en el mismo directorio (`WorkGroup.cs`), que ya implementa
`ITenantEntity` de esta forma. `ITenantEntity` está en `api/LuxuryApp.Shared/DTOs/ITenantEntity.cs`
y ya trae `[Required][Column("CustomerId")]` en la interfaz — no se heredan a la clase, así que
`CustomerId` en la entidad se declara simple, tal como en `WorkGroup`.

**b) Retira `Pattern`, `Interval`, `DayOfWeek`, `DayOfMonth`.** Agrega en su lugar:

```csharp
[Required(ErrorMessage = "El campo {0} es obligatorio")]
[MaxLength(500)]
[Display(Name = "Regla de Recurrencia")]
public string RecurrenceRule { get; set; }
```

Debe poder contener una RRULE de iCalendar completa (frecuencia, intervalo, días, `BYMONTHDAY`
múltiple). 500 caracteres es margen suficiente.

**c) Agrega la criticidad, reutilizando `PriorityLevel` (ya extendido en T-02, no crees otro
enum):**

```csharp
[Required(ErrorMessage = "El campo {0} es obligatorio")]
[Display(Name = "Criticidad")]
public PriorityLevel Criticality { get; set; } = PriorityLevel.Low;
```

**d) Agrega los días de aviso previo:**

```csharp
[Range(0, 30)]
[Display(Name = "Días de Aviso Previo")]
public int AdvanceNoticeDays { get; set; } = 3;
```

**e) Agrega el responsable de respaldo (nullable — sólo es obligatorio cuando la plantilla es
crítica, y esa validación es de T-04, no de este ticket):**

```csharp
[Column("BackupUserId")]
public string BackupUserId { get; set; }
public ApplicationUser BackupUser { get; set; }
```

**f) `AssigneeId` deja de comportarse como el responsable fijo de la plantilla.** No lo elimines
—se sigue usando como último recurso opcional en la cadena de resolución—, pero quítale cualquier
anotación que lo trate como obligatorio si la tuviera (verifica: en el estado actual no tiene
`[Required]`, así que probablemente no haya que tocar el atributo, sólo confirma que sigue así).

**g) Agrega el nombre del entregable esperado, y si el comprobante es obligatorio:**

```csharp
[MaxLength(150)]
[Display(Name = "Entregable Esperado")]
public string ExpectedDeliverableName { get; set; }

[Display(Name = "Comprobante Obligatorio")]
public bool RequiresAttachment { get; set; }
```

**No agregues** ningún campo relacionado con checklist, justificación o bitácora de alertas —
esos son entidades separadas de tickets posteriores (T-09, T-12, T-13). Este ticket es sólo la
plantilla.

### 2. Migración

Genera la migración de Entity Framework Core para estos cambios. El proyecto de datos es
`LuxuryApp.Infrastructure.Data`, el startup project para herramientas de EF es `LuxuryApp.Api`.
Verifica el comando exacto mirando `conventions/AUDIT_LAYERS_CHECKLIST.md` y las
migraciones más recientes en
`api/LuxuryApp.Infrastructure.Data/Data/Migrations/` (las últimas son de agosto de 2026 con
nombres como `CandidateV4`, `Ticket6InterviewDateTimeSplit`) para replicar la convención de
nombres del equipo. Nombra la migración de forma descriptiva, por ejemplo
`RecurringTaskTemplateAlertsFields`.

**Reglas de la migración, sin excepción:**

- **100% aditiva.** Nada de `DROP COLUMN` para `Pattern`, `Interval`, `DayOfWeek`, `DayOfMonth`
  todavía. Aunque los quitaste de la clase C#, **dejar esas columnas en la base de datos por ahora
  es más seguro que borrarlas** — el retiro físico de columnas es del ticket T-15, cuando ya se
  haya confirmado que no hay datos vivos (bloqueador B7, ya cerrado por el dueño: no está en uso).
  Si tu generador de migración de EF Core intenta un `DropColumn` automático para esas cuatro
  columnas porque ya no están en el modelo, **edita la migración generada a mano** para quitar esas
  líneas de `Up()` y sus contrapartes de `Down()`. Verifica el resultado antes de continuar.
- `CustomerId` nuevo en una tabla con filas existentes necesita valor por omisión o backfill. Como
  no hay datos en uso confirmados, usa `NOT NULL` sin default explícito **sólo si la tabla está
  vacía en desarrollo**; si tu entorno de desarrollo tiene datos de prueba en
  `TaskRecurringTemplates`, usa un valor temporal y decláralo en tu reporte.
- Índice nuevo: `(CustomerId, WorkGroupId)` — es el patrón de consulta que usará el generador más
  adelante.

### 3. `ApplicationDbContext`

Revisa si `RecurringTaskTemplate` necesita algún ajuste en `OnModelCreating` o si basta con las
anotaciones de la entidad (el patrón dominante en este repo es anotaciones + algunas
`IEntityTypeConfiguration` sueltas; `WorkGroup` no tiene configuración explícita adicional más
allá de sus anotaciones, así que probablemente aquí tampoco haga falta). No agregues Fluent API
si las anotaciones ya cubren el índice y las restricciones.

## Tareas de Frontend

Ninguna en este ticket.

## Lo que NO debes hacer

- No toques ningún servicio (`RecurringTaskGeneratorService`, `TaskAppService`, etc.)
- No crees endpoints nuevos
- No implementes validaciones de negocio (grupo activo, respaldo obligatorio en críticas, etc.)
- No borres columnas de la base de datos
- No crees las entidades `TaskChecklistItem`, `TaskJustification` ni `TaskAlertLog`
- No modifiques `TaskAttachment`

## Convenciones aplicables

- `CONVENTIONS.md` §4.1 — backend .NET, entidades y migraciones
- `conventions/operations/data-migration-protocol.md` — clasificación de
  migraciones reversibles vs irreversibles
- Nunca modificar enums compartidos existentes; `PriorityLevel` ya se extendió en T-02, aquí sólo
  se reutiliza
- Archivos en UTF-8 sin mojibake

## Verificación obligatoria

Corre y **pega la salida literal** de:

```bash
dotnet build api/LuxuryApp.sln
node scripts/audit-conventions.mjs
node scripts/scan-mojibake.mjs api
```

Si tu entorno tiene una base de datos de desarrollo accesible, intenta aplicar la migración
(`dotnet ef database update` desde el proyecto correspondiente) y pega el resultado. Si no tienes
base de datos disponible, dilo explícitamente en tu reporte — no es un fallo del ticket, es una
limitación del entorno, pero debe quedar declarada.

Criterio de éxito:
- La compilación pasa sin errores nuevos
- `audit-conventions.mjs` **no aumenta** su conteo actual de 10 errores
- `scan-mojibake.mjs` da cero sobre los archivos que tocaste
- La migración generada, revisada a mano, no contiene ningún `DropColumn` de las cuatro columnas
  legadas

## Criterio de PASO del ticket

Debe quedar demostrado en tu reporte:

1. La clase `RecurringTaskTemplate` compila con los 6 cambios pedidos y ningún otro
2. La migración es aditiva: pega el contenido de `Up()` para que se pueda revisar sin abrir el
   archivo
3. `RecurringTaskTemplate` implementa `ITenantEntity` siguiendo el mismo patrón que `WorkGroup`

## Reporte de finalización

Al terminar entrega:
1. Archivos tocados, con una línea de qué cambió en cada uno
2. Salida literal de los comandos de verificación
3. Decisiones que tomaste por tu cuenta y por qué (en particular: cómo resolviste el `CustomerId`
   si había datos de prueba, y si tu generador de EF intentó un `DropColumn`)
4. Lo que NO hiciste del ticket y el motivo
5. Riesgos que detectaste y no estaban en este prompt

No avances al siguiente ticket. Espera la auditoría.
