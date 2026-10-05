# Reglas de Negocio — Módulo Tasks (estado actual)

Fecha de corte: 2026-05-24

El módulo legal opera completamente sobre `Tasks`. Las tablas `Ticket` y `TicketTracking` fueron eliminadas. No existe código legacy activo.

---

## 1. Arquitectura del módulo

### Entidades principales

- `WorkGroup` — contenedor funcional y de visibilidad
- `WorkGroupCategories` — categoría visual y semántica del grupo
- `WorkGroupMembers` — participantes y admins del grupo
- `Tasks` — tarea individual
- `TaskFollowUp` — seguimiento conversacional/manual
- `TaskChangeLog` — auditoría de cambios de campo
- `LegalMatter` — catálogo de asuntos legales (conservado)
- `LegalMatterCategory` — categoría de asuntos legales (conservado)

### Extensión legal dentro de Tasks

El comportamiento legal se activa con `WorkGroup.IsLegalGroup == true`.

WorkGroup Legal global: `Id = 019df32f-4945-71c5-8fd0-ab574ea412cd`

Campos específicos de legal en `Tasks`:

- `IsInternal` — solicitud interna vs externa
- `DocumentCloud` — documentación en nube
- `DocumentEmail` — documentación por email
- `CustomerId` — aislamiento de cliente (el WorkGroup es global; el filtrado se hace por este campo)

---

## 2. Servicios principales

| Servicio | Responsabilidad |
|---|---|
| `TaskAppService` | CRUD de tasks, notificaciones, reportes legales, WhatsApp para grupos legales |
| `TaskLegalAppService` | CRUD de `LegalMatter`/`LegalMatterCategory`, PDF de resumen, resumen de tickets, creación automática de task legal (bajas de empleados) |
| `TaskLegalWhatsAppService` | Envío de WhatsApp al área legal (nuevo ticket / cambio de estado) |
| `RequestDismissalRequestedHandler` | Handler de evento de baja: crea task legal automáticamente si el empleado requirió asistencia legal |

### Endpoints activos para el flujo legal

| Endpoint | Método | Descripción |
|---|---|---|
| `api/tasks/Create` | POST | Crea task (incluido legal) |
| `api/tasks/Update/{id}` | PUT | Actualiza task |
| `api/tasks/legal/all` | GET | Lista todas las tasks legales (con filtro opcional `?customerId=`) |
| `api/tasks/legal/customer` | GET | Lista tasks legales del cliente autenticado |
| `api/tasks/legal/pending` | GET | Reporte de pendientes legales (`?isInternal=` / `?unassigned=`) |
| `api/tasks/{id}/status` | GET | Estado actual de la task |
| `api/tasks/{id}/status` | PATCH | Actualiza estado |
| `api/task-legal/SelectForAddTicket` | GET | Lista de asuntos legales para el formulario de nueva task |

---

## 3. Reglas de negocio

### 3.1 Visibilidad de grupos

Archivo: `WorkGroup/Services/TaskGroupAppService.cs`

- Roles `Administrador`, `SuperUsuario`, `Legal`, `SupervisionOperativa` ven todos los grupos del cliente sin necesidad de ser miembros.
- Otros roles solo ven grupos donde aparecen en `WorkGroupMembers`.
- `IsLegalGroup` se expone en el DTO para que el frontend altere UI y flujo.

### 3.2 Participantes de WorkGroup legal

Archivo: `WorkGroupMember/Services/TaskGroupMemberAppService.cs`

- En grupos normales: solo usuarios con acceso al cliente (`AccesoCustomers`), excluyendo staff de Luxury si el cliente no es Luxury.
- En grupos legales (`IsLegalGroup == true`): se incluyen empleados activos de Luxury en el pool y se omite la exclusión del staff interno.
- Regla global: se excluyen usuarios ya añadidos al grupo.

### 3.3 Creación de task

Archivo: `Tasks/Services/TaskAppService.cs`, método `CreateTaskAsync`

- Folio generado con `OnGenerateFolioTicketMessage(workGroupId)`.
- Si `AssigneeId` es null: se asigna el primer admin del grupo; si no hay admin, el creador.
- `CustomerId` se toma de `currentUserService.CustomerId` o del DTO como fallback.
- Si `ClosedDate` viene informado: estado inicial `Completed`. Si no: `NotStarted`.
- Si el WorkGroup es legal (`IsLegalGroup == true`): se envía WhatsApp vía `NotifyNewTicketAsync(title, folio, customerName, profession, taskId)`.
- Notificaciones: todos los admins del grupo + el asignado si no coincide con un admin.
- Correo con URL `/tasks/message/{taskId}/{workGroupId}`.

### 3.4 Actualización de task

Archivo: `Tasks/Services/TaskAppService.cs`, método `UpdateTaskAsync`

- `SaveChanged` audita cambios de `Title`, `Description` y `Priority` en `TaskChangeLog`.
- Estado inferido: `ClosedDate != null` → `Completed`; `ScheduledDate != null && ClosedDate == null` → `InProgress`; otro → `NotStarted`.
- Notificaciones: al creador si actualizó el asignado; al asignado si actualizó el creador; a ambos si actualizó un tercero.

### 3.5 Cambio rápido de estado

Archivo: `Tasks/Services/TaskAppService.cs`, método `UpdateTaskStatusAsync`

- Actualiza `Status` directamente.
- `Completed` → setea `ClosedDate = UtcNow`. Otro estado → limpia `ClosedDate`.
- Si el WorkGroup es legal y el nuevo estado es `Completed` o `Cancelled`: envía WhatsApp vía `NotifyStatusUpdateAsync(folio, status, taskId)`.
- No inserta `TaskFollowUp` ni `TaskChangeLog`. Si se necesita trazabilidad en el cambio de estado, debe usarse `CloseTaskAsync` o `ReopenAsync` en su lugar.

### 3.6 Cierre

Archivo: `Tasks/Services/TaskAppService.cs`, método `CloseTaskAsync`

- Requiere `ClosedById` existente.
- Actualiza `ClosedDate`, `ClosedById`, `Status = Completed`.
- Inserta `TaskFollowUp` automático indicando quién cerró la tarea.
- Notifica al creador si no fue quien cerró; notifica a los admins del grupo (excepto quien cerró).

### 3.7 Reapertura

Archivo: `Tasks/Services/TaskAppService.cs`, método `ReopenAsync`

- `ClosedDate = null`, `ClosedById = null`, `Status = Reopened`.
- Requiere motivo registrado en `TaskFollowUp`.
- Notifica a todos los admins del grupo y al asignado si no es admin.
- No valida que la tarea estuviera previamente en `Completed`.

### 3.8 Creación automática de task legal (baja de empleado)

Archivo: `Reclutamiento/RequestDismissal/Handlers/RequestDismissalRequestedHandler.cs`

- Se dispara cuando un empleado registra una baja con `LawyerAssistance == true`.
- Llama a `TaskLegalAppService.CreateLegalTaskAsync(dto)`.
- El método crea la task en el WorkGroup legal global, genera folio `LEG-xxx`, envía WhatsApp y notificación push al responsable (`administracion.juridico@luxurybuilding.com.mx`).
- El error en la creación del ticket es capturado y logueado sin afectar el flujo principal de la baja.

### 3.9 Listado de tasks legales

Archivo: `Tasks/Services/TaskAppService.cs`

- `GetLegalTasksAllAsync`: tasks donde `WorkGroup.IsLegalGroup == true`; acepta `customerId?` opcional para que el administrador filtre por cliente.
- `GetLegalTasksByCustomerAsync`: igual, filtrado por `currentUserService.CustomerId`.
- `GetLegalPendingReportAsync`: tasks legales con `Status != Completed`. Si `unassigned = true`, solo sin asignado; si `isInternal` tiene valor, filtra por ese campo.

### 3.10 Folio

- Tasks creadas por el frontend: `OnGenerateFolioTicketMessage(workGroupId)` — formato genérico del grupo.
- Tasks creadas por baja de empleado o desde `TaskLegalAppService.CreateLegalTaskAsync`: `OnGenerateFolioLegal()` — formato `LEG-xxx`.

---

## 4. WhatsApp — puntos de disparo

| Situación | Método | Quién lo llama |
|---|---|---|
| Nueva task en grupo legal (frontend) | `NotifyNewTicketAsync` | `TaskAppService.CreateTaskAsync` |
| Cambio de estado a `Completed`/`Cancelled` en grupo legal | `NotifyStatusUpdateAsync` | `TaskAppService.UpdateTaskStatusAsync` |
| Nueva task por baja de empleado con asistencia legal | `NotifyNewTicketAsync` | `TaskLegalAppService.CreateLegalTaskAsync` |

Números destino hardcodeados en `TaskLegalWhatsAppService`: `525559878523`, `525610633487`.

---

## 5. Roles y acceso

| Rol | Acceso al módulo legal |
|---|---|
| `Administrador`, `SuperUsuario` | Total — ven y operan todas las tasks legales de cualquier cliente |
| `Legal`, `CoordinacionLegal` | Acceso a vistas legales; pueden cambiar estado y agregar seguimientos |
| Creador de la task | Puede reabrir, programar |
| Asignado de la task | Puede cerrar, comentar |

Nota: `TaskController` aplica `[Authorize]` genérico con validación de rol por acción. Los endpoints `Delete` y `GetAllByCustomer` requieren `Administrador` o `SuperUsuario`.

---

## 6. Puntos de atención para cambios futuros

- **`IsInternal`**: el plan original era derivarlo del `TypePerson` del creador (Employee → interno, Provider → externo) y eliminar el campo. Esto quedó pendiente en Fase 6. Actualmente sigue como flag explícito en el formulario y en la entidad.
- **`UpdateTaskStatusAsync` no deja trazabilidad**: si en el futuro se requiere auditar cada cambio de estado legal, hay que agregar inserción de `TaskFollowUp` o `TaskChangeLog` en ese método.
- **Folio de tasks legales creadas por frontend**: estas reciben folio genérico del grupo, no `LEG-xxx`. Si se necesita unificar el formato, hay que llamar `OnGenerateFolioLegal()` condicionalmente cuando `WorkGroup.IsLegalGroup == true` en `CreateTaskAsync`.
- **Tests de `TaskAppService`**: el constructor tiene un parámetro `ITaskLegalWhatsAppService` que debe moquearse en todos los tests que instancien el servicio directamente (ya corregido en `TaskAppServiceTests.cs`).
