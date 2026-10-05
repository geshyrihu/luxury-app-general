# TaskEngine - Entidades Consolidadas

> **Ruta:** `LuxuryApp.Infrastructure.Data\Data\Entities\Tenant\Operations\TaskEngine`
> **Fecha:** 2026-08-31
> **Total entidades:** 20 | **Enums externos:** 10

---

## Tabla de Contenidos

1. [Entidades Principales](#entidades-principales)
2. [Entidades de Seguimiento](#entidades-de-seguimiento)
3. [Plantillas y Recurrencia](#plantillas-y-recurrencia)
4. [Grupos de Trabajo](#grupos-de-trabajo)
5. [Planificación y Semanal](#planificación-y-semanal)
6. [Enums Externos](#enums-externos)
7. [Diagrama de Relaciones](#diagrama-de-relaciones)

---

## Entidades Principales

### Tasks (Tabla: `Tasks`)
**Archivo:** `Tasks.cs` | **Base:** `GuidIdEntity, IAuditable`

Entidad principal del módulo. Representa una tarea/ticket del sistema.

| Columna | Tipo | FK | Descripción |
|---------|------|----|-------------|
| `Id` | `Guid` | PK | Identificador único |
| `CustomerId` | `Guid?` | → `Customer` | Cliente asociado |
| `WorkGroupId` | `Guid` | → `WorkGroup` | Grupo de trabajo (columna: `TicketGroupId`) |
| `SortOrder` | `int` | | Ordenamiento |
| `Folio` | `string(20)` | | Folio de la tarea |
| `Title` | `string(100)` | | Título |
| `Description` | `string(2000)` | | Descripción |
| `MeetingDetailsId` | `Guid?` | → `MeetingDetails` | Pendiente de minuta |
| `ServiceOrderId` | `Guid?` | → `ServiceOrder` | Orden de servicio |
| `CreatedAt` | `DateTime` | | Fecha de creación |
| `CreatedBy` | `string` | | Usuario creador |
| `UpdatedAt` | `DateTime?` | | Última actualización |
| `UpdatedBy` | `string` | | Último editor |
| `ClosedDate` | `DateTime?` | | Fecha de cierre |
| `ScheduledDate` | `DateTime?` | | Fecha de programación |
| `ScheduledDay` | `DateOnly?` | | Día calendario México (migración) |
| `BreachedAt` | `DateTime?` | | Momento de incumplimiento formal |
| `BreachedDay` | `DateOnly?` | | Día calendario México (migración) |
| `LastAlertAt` | `DateTime?` | | Última alerta enviada |
| `LastAlertDay` | `DateOnly?` | | Día calendario México (migración) |
| `RecurrenceSourceDate` | `DateTime?` | | Fecha original de recurrencia |
| `RecurrenceSourceDay` | `DateOnly?` | | Día calendario México (migración) |
| `PlannedStartDate` | `DateTime?` | | Fecha planeada inicio (Gantt) |
| `PlannedStartDay` | `DateOnly?` | | Día calendario México (migración) |
| `PlannedEndDate` | `DateTime?` | | Fecha planeada fin (Gantt) |
| `PlannedEndDay` | `DateOnly?` | | Día calendario México (migración) |
| `ActualStartDate` | `DateTime?` | | Fecha real inicio |
| `ActualStartDay` | `DateOnly?` | | Día calendario México (migración) |
| `ActualEndDate` | `DateTime?` | | Fecha real fin |
| `ActualEndDay` | `DateOnly?` | | Día calendario México (migración) |
| `EstimatedHours` | `int?` | | Duración estimada (horas) |
| `Progress` | `int` | | Progreso 0-100% |
| `Priority` | `PriorityLevel` | | Prioridad (enum) |
| `Status` | `GanttStatus` | | Estado Gantt (enum) |
| `IsRelevant` | `bool` | | Es relevante |
| `CreatorId` | `string` | → `ApplicationUser` | Creador |
| `AssigneeId` | `string` | → `ApplicationUser` | Asignado |
| `ClosedById` | `string` | → `ApplicationUser` | Cerrado por |
| `BeforeWork` | `string(100)` | | Foto antes del trabajo |
| `AfterWork` | `string(100)` | | Foto después del trabajo |
| `ParentTaskId` | `Guid?` | → `Tasks` | Tarea padre (WBS) |
| `DependsOnTaskId` | `Guid?` | → `Tasks` | Dependencia (predecesora) |
| `IsMilestone` | `bool` | | Es hito |
| `TaskType` | `GanttTaskType` | | Tipo de tarea Gantt |
| `RecurringTemplateId` | `Guid?` | → `RecurringTaskTemplate` | Plantilla recurrente |
| `IsRecurring` | `bool` | | Es parte de serie recurrente |
| `RecurrencePattern` | `RecurrencePattern?` | | Patrón de recurrencia |
| `RecurrenceInterval` | `int?` | | Intervalo de recurrencia |
| `RecurrenceEndDate` | `DateTime?` | | Fin de recurrencia |
| `RecurrenceEndDay` | `DateOnly?` | | Día calendario México (migración) |
| `ParentRecurringTaskId` | `Guid?` | → `Tasks` | Tarea plantilla padre |
| `IsInternal` | `bool?` | | Interno/externo (TODO: eliminar Fase 6) |
| `DocumentCloud` | `bool?` | | Documento en nube |
| `DocumentEmail` | `bool?` | | Documento por email |
| `LegalMatterId` | `Guid?` | → `LegalMatter` | Asunto legal |
| `MigratedFromTicketId` | `Guid?` | | Migrado desde ticket |

**Índices:**
- `(CustomerId, Status, PlannedEndDate)`
- `(RecurringTemplateId, PlannedEndDate)`
- `(WorkGroupId, Status)`

**Colecciones:**
- `HashSet<TaskFollowUp> TaskFollowUps`
- `HashSet<TaskMessageReads> TaskMessageReads`
- `HashSet<Tasks> RecurringInstances`
- `HashSet<Tasks> SubTasks`

---

### TaskInstance (Tabla: `TaskInstances`)
**Archivo:** `TaskInstance.cs` | **Base:** `GuidIdEntity, ITenantEntity`

Instancia generada y asignada de una tarea recurrente.

| Columna | Tipo | FK | Descripción |
|---------|------|----|-------------|
| `Id` | `Guid` | PK | Identificador único |
| `TaskTemplateItemId` | `Guid` | → `TaskTemplateItem` | Ítem de plantilla origen |
| `CustomerId` | `Guid` | → `Customer` | Cliente |
| `Title` | `string` | | Título (copiado de plantilla) |
| `Description` | `string` | | Descripción |
| `Priority` | `PriorityLevel` | | Prioridad |
| `AssigneeId` | `string` | → `ApplicationUser` | Asignado |
| `Status` | `Status` | | Estado (enum Status) |
| `ScheduledDate` | `DateTime` | | Fecha programada |
| `ScheduledDay` | `DateOnly?` | | Día calendario México (migración) |
| `DueDate` | `DateTime?` | | Fecha límite |
| `DueDay` | `DateOnly?` | | Día calendario México (migración) |
| `CompletedAt` | `DateTime?` | | Fecha completado |
| `CompletedBy` | `string` | | Completado por |
| `CreatedAt` | `DateTime` | | Fecha creación |
| `CreatedFromRecurrenceDate` | `DateTime?` | | Fecha de recurrencia origen |
| `CreatedFromRecurrenceDay` | `DateOnly?` | | Día calendario México (migración) |

**Colecciones:**
- `HashSet<TaskComment> Comments`
- `HashSet<TaskAttachment> Attachments`

---

## Entidades de Seguimiento

### TaskFollowUp (Tabla: `TaskFollowUps`)
**Archivo:** `TaskFollowUp.cs` | **Base:** `GuidIdEntity`

Seguimientos/comentarios de una tarea.

| Columna | Tipo | FK | Descripción |
|---------|------|----|-------------|
| `Id` | `Guid` | PK | Identificador único |
| `TasksId` | `Guid` | → `Tasks` | Tarea (columna: `TicketMessageId`) |
| `UserId` | `string` | → `ApplicationUser` | Usuario |
| `CreatedAt` | `DateTime` | | Fecha de creación |
| `Description` | `string(200)` | | Descripción |

---

### TaskComment (Tabla: `TaskComments`)
**Archivo:** `TaskComment.cs` | **Base:** `GuidIdEntity`

Comentario en una instancia de tarea.

| Columna | Tipo | FK | Descripción |
|---------|------|----|-------------|
| `Id` | `Guid` | PK | Identificador único |
| `TaskInstanceId` | `Guid` | → `TaskInstance` | Instancia de tarea |
| `AuthorId` | `string` | → `ApplicationUser` | Autor |
| `Text` | `string` | | Contenido del comentario |
| `CreatedAt` | `DateTime` | | Fecha creación |

---

### TaskAttachment (Tabla: `TaskFiles`)
**Archivo:** `TaskAttachment.cs` | **Base:** `GuidIdEntity`

Archivo adjunto de una tarea.

| Columna | Tipo | FK | Descripción |
|---------|------|----|-------------|
| `Id` | `Guid` | PK | Identificador único |
| `TasksId` | `Guid` | → `Tasks` | Tarea |
| `RecurringTemplateId` | `Guid?` | → `RecurringTaskTemplate` | Plantilla recurrente (opcional) |
| `FilePath` | `string` | | Ruta/URL del archivo |
| `MimeType` | `string` | | Tipo MIME |
| `FileName` | `string` | | Nombre original |
| `CreatedAt` | `DateTime` | | Fecha creación |
| `CreatedBy` | `string` | | Usuario que cargó |

**Índices:** `(TasksId)`

---

### TaskMessageReads (Tabla: `TaskMessageReads`)
**Archivo:** `TaskMessageReads.cs` | **Base:** `GuidIdEntity`

Registro de lectura de mensajes por usuario.

| Columna | Tipo | FK | Descripción |
|---------|------|----|-------------|
| `Id` | `Guid` | PK | Identificador único |
| `TasksId` | `Guid` | → `Tasks` | Tarea (columna: `TicketMessageId`) |
| `ReaderUserId` | `string` | → `ApplicationUser` | Lector |
| `ReadingDate` | `DateTime` | | Fecha de lectura |
| `ReadingDay` | `DateOnly?` | | Día calendario México (migración) |

---

### TaskChangeLog (Tabla: `TaskAuditLogs`)
**Archivo:** `TaskChangeLog.cs` | **Base:** `GuidIdEntity`

Log de auditoría de cambios en tareas.

| Columna | Tipo | FK | Descripción |
|---------|------|----|-------------|
| `Id` | `Guid` | PK | Identificador único |
| `TasksId` | `Guid` | → `Tasks` | Tarea (columna: `TicketMessageId`) |
| `UserId` | `string` | → `ApplicationUser` | Usuario que hizo el cambio |
| `ChangedAt` | `DateTime` | | Fecha del cambio |
| `ChangeDescription` | `string(500)` | | Descripción del cambio |
| `ModifiedField` | `string(100)` | | Campo modificado |
| `OldValue` | `string(500)` | | Valor anterior |
| `NewValue` | `string(500)` | | Nuevo valor |

---

### TaskAlertLog (Tabla: `TaskAlertLogs`)
**Archivo:** `TaskAlertLog.cs` | **Base:** `GuidIdEntity`

Log de alertas enviadas para tareas.

| Columna | Tipo | FK | Descripción |
|---------|------|----|-------------|
| `Id` | `Guid` | PK | Identificador único |
| `TasksId` | `Guid` | → `Tasks` | Tarea |
| `AlertType` | `TaskAlertType` | | Tipo de alerta (enum) |
| `Channel` | `NotificationChannel` | | Canal de notificación (enum) |
| `RecipientUserId` | `string` | → `ApplicationUser` | Destinatario |
| `Delivered` | `bool` | | Entregado |
| `SentAt` | `DateTime` | | Fecha de envío |

**Índices:** `(TasksId, AlertType, SentAt)`

---

### TaskChecklistItem (Tabla: `TaskChecklistItems`)
**Archivo:** `TaskChecklistItem.cs` | **Base:** `GuidIdEntity`

Ítem de checklist de una tarea.

| Columna | Tipo | FK | Descripción |
|---------|------|----|-------------|
| `Id` | `Guid` | PK | Identificador único |
| `TasksId` | `Guid` | → `Tasks` | Tarea |
| `Description` | `string(300)` | | Descripción |
| `IsDone` | `bool` | | Completado |
| `DoneByUserId` | `string` | → `ApplicationUser` | Completado por |
| `DoneAt` | `DateTime?` | | Fecha completado |

**Índices:** `(TasksId)`

---

### TaskJustification (Tabla: `TaskJustifications`)
**Archivo:** `TaskJustification.cs` | **Base:** `GuidIdEntity`

Justificación de solicitudes de tareas.

| Columna | Tipo | FK | Descripción |
|---------|------|----|-------------|
| `Id` | `Guid` | PK | Identificador único |
| `TasksId` | `Guid` | → `Tasks` | Tarea |
| `Reason` | `string(1000)` | | Motivo (mín. 20 chars) |
| `RequestedByUserId` | `string` | → `ApplicationUser` | Solicitante |
| `ApprovedByUserId` | `string` | → `ApplicationUser` | Aprobador |
| `State` | `TaskJustificationState` | | Estado (enum) |
| `RequestedAt` | `DateTime` | | Fecha solicitud |
| `ResolvedAt` | `DateTime?` | | Fecha resolución |

**Índices:** `(TasksId, State)`

---

## Plantillas y Recurrencia

### TaskTemplate (Tabla: `TaskTemplates`)
**Archivo:** `TaskTemplate.cs` | **Base:** `GuidIdEntity`

Plantilla maestra que agrupa ítems de tareas recurrentes.

| Columna | Tipo | FK | Descripción |
|---------|------|----|-------------|
| `Id` | `Guid` | PK | Identificador único |
| `Name` | `string(100)` | | Nombre de plantilla |
| `Description` | `string(500)` | | Descripción |
| `RoleId` | `string` | → `ApplicationRole` | Rol asociado |
| `IsActive` | `bool` | | Activa |
| `CreatedAt` | `DateTime` | | Fecha creación |
| `CreatedBy` | `string` | | Usuario creador |

**Colecciones:**
- `HashSet<TaskTemplateItem> Items`
- `HashSet<TaskTemplateCustomer> TemplateCustomers`

---

### TaskTemplateItem (Tabla: `TaskTemplateItems`)
**Archivo:** `TaskTemplateItem.cs` | **Base:** `GuidIdEntity`

Ítem individual dentro de una plantilla con lógica de recurrencia.

| Columna | Tipo | FK | Descripción |
|---------|------|----|-------------|
| `Id` | `Guid` | PK | Identificador único |
| `TaskTemplateId` | `Guid` | → `TaskTemplate` | Plantilla padre |
| `Title` | `string(150)` | | Título del ítem |
| `Description` | `string(1000)` | | Descripción |
| `Priority` | `PriorityLevel` | | Prioridad |
| `SortOrder` | `int` | | Orden |
| `RecurrenceRule` | `string` | | Regla RRULE |
| `TimeWindowStart` | `TimeSpan?` | | Inicio ventana horaria |
| `TimeWindowEnd` | `TimeSpan?` | | Fin ventana horaria |
| `IsActive` | `bool` | | Activo |

**Colecciones:**
- `HashSet<CustomerTaskItemConfig> CustomerConfigs`
- `HashSet<TaskInstance> Instances`

---

### TaskTemplateCustomer (Tabla: `TaskCustomerTemplates`)
**Archivo:** `TaskTemplateCustomer.cs` | **Base:** `ITenantEntity`

Unión muchos a_many entre TaskTemplate y Customer.

| Columna | Tipo | FK | Descripción |
|---------|------|----|-------------|
| `TaskTemplateId` | `Guid` | → `TaskTemplate` | Plantilla |
| `CustomerId` | `Guid` | → `Customer` | Cliente |

---

### CustomerTaskItemConfig (Tabla: `TaskCustomerItemConfigs`)
**Archivo:** `CustomerTaskItemConfig.cs` | **Base:** (ninguna)

Configuración que vincula cliente con ítem de plantilla.

| Columna | Tipo | FK | Descripción |
|---------|------|----|-------------|
| `CustomerId` | `Guid` | → `Customer` | Cliente |
| `TaskTemplateItemId` | `Guid` | → `TaskTemplateItem` | Ítem de plantilla |

---

### RecurringTaskTemplate (Tabla: `TaskRecurringTemplates`)
**Archivo:** `RecurringTaskTemplate.cs` | **Base:** `GuidIdEntity, ITenantEntity`

Plantilla de tarea recurrente.

| Columna | Tipo | FK | Descripción |
|---------|------|----|-------------|
| `Id` | `Guid` | PK | Identificador único |
| `CustomerId` | `Guid` | → `Customer` | Cliente |
| `Title` | `string(100)` | | Título |
| `Description` | `string(500)` | | Descripción |
| `RecurrenceRule` | `string(500)` | | Regla de recurrencia |
| `Criticality` | `PriorityLevel` | | Criticidad |
| `AdvanceNoticeDays` | `int` | | Días de aviso previo (0-30) |
| `StartDate` | `DateOnly` | | Fecha inicio |
| `EndDate` | `DateOnly?` | | Fecha fin |
| `WorkGroupId` | `Guid` | → `WorkGroup` | Grupo de trabajo |
| `AssigneeId` | `string` | → `ApplicationUser` | Asignado |
| `BackupUserId` | `string` | → `ApplicationUser` | Usuario respaldo |
| `ExpectedDeliverableName` | `string(150)` | | Entregable esperado |
| `RequiresAttachment` | `bool` | | Requiere comprobante |
| `Status` | `RecurringTemplateStatus` | | Estado (enum) |

**Índices:** `(CustomerId, WorkGroupId)`

**Colecciones:**
- `HashSet<Tasks> GeneratedTasks`

---

## Grupos de Trabajo

### WorkGroup (Tabla: `TaskWorkGroups`)
**Archivo:** `WorkGroup.cs` | **Base:** `GuidIdEntity, ITenantEntity, IAuditable`

Grupo de trabajo para organizar tareas.

| Columna | Tipo | FK | Descripción |
|---------|------|----|-------------|
| `Id` | `Guid` | PK | Identificador único |
| `CustomerId` | `Guid` | → `Customer` | Cliente |
| `WorkGroupCategoriesId` | `Guid` | → `WorkGroupCategories` | Categoría (columna: `TicketGroupCategoryId`) |
| `CreatedAt` | `DateTime` | | Fecha creación |
| `CreatedBy` | `string` | | Usuario creador |
| `UpdatedAt` | `DateTime?` | | Última actualización |
| `UpdatedBy` | `string` | | Último editor |
| `Active` | `bool` | | Chat activo |
| `Visibility` | `VisibilityLevel` | | Nivel de visibilidad (enum) |
| `UserCreateId` | `string` | → `ApplicationUser` | Usuario creador |
| `IsLegalGroup` | `bool` | | Es grupo legal |

**Colecciones:**
- `HashSet<WorkGroupMembers> WorkGroupMembers`
- `HashSet<Tasks> Tasks`

---

### WorkGroupMembers (Tabla: `TaskWorkGroupMembers`)
**Archivo:** `WorkGroupMembers.cs` | **Base:** `GuidIdEntity`

Miembros de un grupo de trabajo.

| Columna | Tipo | FK | Descripción |
|---------|------|----|-------------|
| `Id` | `Guid` | PK | Identificador único |
| `WorkGroupId` | `Guid` | → `WorkGroup` | Grupo (columna: `TicketGroupId`) |
| `UserId` | `string` | → `ApplicationUser` | Usuario |
| `IsAdmin` | `bool` | | Es administrador |

---

## Planificación y Semanal

### TaskWorkPlan (Tabla: `TaskWorkPlans`)
**Archivo:** `TaskWorkPlan.cs` | **Base:** `GuidIdEntity, ITenantEntity`

Plan de trabajo semanal.

| Columna | Tipo | FK | Descripción |
|---------|------|----|-------------|
| `Id` | `Guid` | PK | Identificador único |
| `WeekNumber` | `int` | | Número de semana |
| `CustomerId` | `Guid` | → `Customer` | Cliente |
| `UserId` | `string` | → `ApplicationUser` | Usuario |
| `SendDate` | `DateTime` | | Fecha de envío |
| `SendDay` | `DateOnly?` | | Día calendario México (migración) |

**Colecciones:**
- `HashSet<TaskWeeklyWork> TaskWeeklyWork`

---

### TaskWeeklyWork (Tabla: `TaskWeeklyReports`)
**Archivo:** `TaskWeeklyWork.cs` | **Base:** `GuidIdEntity`

Reporte semanal de trabajo vinculado a tarea.

| Columna | Tipo | FK | Descripción |
|---------|------|----|-------------|
| `Id` | `Guid` | PK | Identificador único |
| `TaskWorkPlanId` | `Guid` | → `TaskWorkPlan` | Plan de trabajo |
| `TasksId` | `Guid` | → `Tasks` | Tarea (columna: `TicketMessageId`) |

---

### TaskServiceOrder (Tabla: `TaskServiceOrders`)
**Archivo:** `TaskServiceOrder.cs` | **Base:** (ninguna)

Unión entre tareas y órdenes de servicio.

| Columna | Tipo | FK | Descripción |
|---------|------|----|-------------|
| `TasksId` | `Guid` | → `Tasks` | Tarea (columna: `TicketMessageId`) |
| `ServiceOrderId` | `Guid` | → `ServiceOrder` | Orden de servicio |

---

## Enums Externos

### PriorityLevel
**Archivo:** `LuxuryApp.Shared/Enums/PriorityLevel.cs`

```csharp
public enum PriorityLevel
{
    [Display(Name = "Alta")]     High,
    [Display(Name = "Baja")]     Low,
    [Display(Name = "Crítica")]  Critical
}
```

---

### GanttStatus
**Archivo:** `LuxuryApp.Shared/Enums/GanttStatus.cs`

```csharp
public enum GanttStatus
{
    [Display(Name = "No Iniciada")]  NotStarted,
    [Display(Name = "En Proceso")]   InProgress,
    [Display(Name = "Completada")]   Completed,
    [Display(Name = "Reabierta")]    Reopened,
    [Display(Name = "Cancelada")]    Cancelled,
    [Display(Name = "En Espera")]    OnHold
}
```

---

### GanttTaskType
**Archivo:** `LuxuryApp.Shared/Enums/GanttTaskType.cs`

```csharp
public enum GanttTaskType
{
    [Display(Name = "Tarea")]    Task,
    [Display(Name = "Resumen")]  Summary,
    [Display(Name = "Hito")]     Milestone
}
```

---

### Status
**Archivo:** `LuxuryApp.Shared/Enums/Status.cs`

```csharp
public enum Status
{
    [Display(Name = "Pendiente")]      Pendiente,
    [Display(Name = "Concluido")]      Concluido,
    [Display(Name = "No Autorizado")]  noAutorizado,
    [Display(Name = "Proceso")]        Proceso,
    [Display(Name = "Cancelado")]      Cancelado
}
```

---

### RecurrencePattern
**Archivo:** `LuxuryApp.Shared/Enums/RecurrencePattern.cs`

```csharp
public enum RecurrencePattern
{
    [Display(Name = "Diario")]      Daily,
    [Display(Name = "Semanal")]     Weekly,
    [Display(Name = "Mensual")]     Monthly,
    [Display(Name = "Anual")]       Yearly,
    [Display(Name = "Cada X días")] EveryXDays,
    [Display(Name = "Personalizado")] Custom
}
```

---

### TaskAlertType
**Archivo:** `LuxuryApp.Shared/Enums/TaskAlertType.cs`

```csharp
public enum TaskAlertType
{
    [Display(Name = "Aviso Previo")]    AvisoPrevio,
    [Display(Name = "Recordatorio")]    Recordatorio,
    [Display(Name = "Vencida")]         Vencida,
    [Display(Name = "Escalación")]      Escalacion,
    [Display(Name = "Incumplimiento")]  Incumplimiento,
    [Display(Name = "Arrastre")]        Arrastre
}
```

---

### NotificationChannel
**Archivo:** `LuxuryApp.Shared/Enums/NotificationChannel.cs`

```csharp
public enum NotificationChannel
{
    [Display(Name = "Correo Electrónico")]  Email = 0,
    [Display(Name = "Push App")]            Push = 1,
    [Display(Name = "WhatsApp")]            WhatsApp = 2,
    [Display(Name = "En la Aplicación")]    InApp = 3,
    [Display(Name = "Push Web")]            PushWeb = 4
}
```

---

### VisibilityLevel
**Archivo:** `LuxuryApp.Shared/Enums/VisibilityLevel.cs`

```csharp
public enum VisibilityLevel
{
    [Display(Name = "Público")]      Public,
    [Display(Name = "Interno")]      Internal,
    [Display(Name = "Condominios")]  Condominiums
}
```

---

### RecurringTemplateStatus
**Archivo:** `LuxuryApp.Shared/Enums/RecurringTemplateStatus.cs`

```csharp
public enum RecurringTemplateStatus
{
    [Display(Name = "Activo")]    Active,
    [Display(Name = "Pausado")]   Paused,
    [Display(Name = "Cancelado")] Cancelled
}
```

---

### TaskJustificationState
**Archivo:** `LuxuryApp.Shared/Enums/TaskJustificationState.cs`

```csharp
public enum TaskJustificationState
{
    [Display(Name = "Solicitada")]  Solicitada,
    [Display(Name = "Aprobada")]    Aprobada,
    [Display(Name = "Rechazada")]   Rechazada
}
```

---

## Diagrama de Relaciones

```
┌─────────────────────────────────────────────────────────────────────┐
│                         TASK ENGINE                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐         ┌──────────────────┐                     │
│  │   WorkGroup   │◄────────│ WorkGroupMembers  │                     │
│  │  (Grupos)     │         │   (Miembros)      │                     │
│  └──────┬───────┘         └──────────────────┘                     │
│         │                                                           │
│         │ 1:N                                                       │
│         ▼                                                           │
│  ┌──────────────────────────────────────────────┐                  │
│  │                  Tasks                        │                  │
│  │  (Tarea principal)                            │                  │
│  │                                               │                  │
│  │  Self FK: ParentTaskId → Tasks (WBS)          │                  │
│  │  Self FK: DependsOnTaskId → Tasks (Predec.)   │                  │
│  │  Self FK: ParentRecurringTaskId → Tasks        │                  │
│  └──┬─────┬─────┬─────┬─────┬─────┬─────┬──────┘                  │
│     │     │     │     │     │     │     │                           │
│     │     │     │     │     │     │     └──► RecurringTaskTemplate  │
│     │     │     │     │     │     │                                 │
│     │     │     │     │     │     └──► TaskFollowUp                │
│     │     │     │     │     └──► TaskMessageReads                   │
│     │     │     │     └──► TaskChangeLog (AuditLogs)                │
│     │     │     └──► TaskAlertLog                                   │
│     │     └──► TaskChecklistItem                                    │
│     └──► TaskJustification                                          │
│                                                                     │
│  ┌──────────────────┐     ┌──────────────────┐                    │
│  │   TaskInstance    │────►│   TaskComment     │                    │
│  │  (Instancias)     │     │  (Comentarios)    │                    │
│  └──────────────────┘     └──────────────────┘                    │
│           ▲                                                         │
│           │                                                         │
│  ┌──────────────────┐     ┌──────────────────┐                    │
│  │ TaskTemplateItem  │────►│CustomerTaskItemConf│                    │
│  │  (Ítems Plant.)   │     │  (Config Cliente)  │                    │
│  └──────────────────┘     └──────────────────┘                    │
│           ▲                                                         │
│           │                                                         │
│  ┌──────────────────┐     ┌──────────────────┐                    │
│  │   TaskTemplate    │────►│TaskTemplateCustomer│                    │
│  │ (Plantilla Maestra)│     │ (Unión M:N)        │                    │
│  └──────────────────┘     └──────────────────┘                    │
│                                                                     │
│  ┌──────────────────┐     ┌──────────────────┐                    │
│  │  TaskWorkPlan     │────►│  TaskWeeklyWork   │                    │
│  │ (Plan Semanal)    │     │ (Reporte Semanal) │                    │
│  └──────────────────┘     └──────────────────┘                    │
│                                                                     │
│  ┌──────────────────┐     ┌──────────────────┐                    │
│  │ TaskAttachment    │     │ TaskServiceOrder   │                    │
│  │ (Archivos)        │     │ (Unión Servicio)   │                    │
│  └──────────────────┘     └──────────────────┘                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

Entidades Externas Referenciadas:
• Customer
• ApplicationUser / ApplicationRole
• MeetingDetails
• ServiceOrder
• LegalMatter
• WorkGroupCategories
```

---

## Entidades Externas Referenciadas (no incluidas)

Estas entidades se usan como FK pero viven fuera de TaskEngine:

| Entidad | Proyecto | Uso en TaskEngine |
|---------|----------|-------------------|
| `Customer` | Core | Clientes de tareas y plantillas |
| `ApplicationUser` | Identity | Usuarios (creador, asignado, etc.) |
| `ApplicationRole` | Identity | Roles de plantillas |
| `MeetingDetails` | Meetings | Pendientes de minuta |
| `ServiceOrder` | Service | Órdenes de servicio |
| `LegalMatter` | Legal | Asuntos legales |
| `WorkGroupCategories` | Shared | Categorías de grupos |

---

*Documento generado automáticamente desde código fuente.*
