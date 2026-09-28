# Análisis de Flujos - Módulo Reclutamiento LuxuryApp

## Información General del Módulo

**Nombre:** Reclutamiento y Altas/Bajas  
**Descripción:** Sistema integral de gestión de reclutamiento que cubre el ciclo completo: solicitud de vacantes, postulación de candidatos, proceso de entrevistas, decisiones, altas de personal, bajas y modificaciones salariales.

**Arquitectura:** Backend .NET 10 (Minimal APIs + Domain Events) | Frontend Angular 22 (Standalone Components + Signals)

---

## Roles Involucrados

| Rol | Descripción | Permisos Clave |
|-----|-------------|----------------|
| **Candidato** | Postulante externo | Postularse a vacantes, ver estado |
| **Reclutador (RRHH)** | Gestión completa del pipeline | Crear vacantes, gestionar candidatos, agendar entrevistas, procesar altas |
| **Gerente Operaciones** | Entrevista técnica/operativa | Recibir candidatos, agendar/realizar entrevistas, dar feedback |
| **Administrador Cliente** | Solicita vacantes, aprueba altas | Solicitar vacantes, confirmar presentación, validar documentos |
| **Gerente Atención** | Supervisión cliente | Vista de procesos de su cliente |
| **Sistema** | Automatizaciones y notificaciones | Monitoreo diario, envío emails, alertas multi-canal (Slack/Teams) |

---

## Flujos Principales (End-to-End)

### 1. FLUJO: Solicitud de Vacante (Request Position)

**Actores:** Administrador Cliente → Sistema → Reclutador

```
Cliente Admin          Backend (API)              Eventos/Notificaciones
    │                      │                            │
    ├── POST /api/request-positions (crear vacante)    │
    │                      │                            │
    │                      ├── Guardar RequestPosition │
    │                      ├── Status = Pendiente      │
    │                      │                            │
    │                      └── Dispara RequestPositionCreatedEvent
    │                                            │
    │                                            ├── RequestPositionHandler
    │                                            │    └── SendSolicitudVacanteEmailAsync
    │                                            │         (notifica a equipo reclutamiento)
    │                                            │
    │                                            └── CandidateNotificationCoordinator
    │                                                 └── NotifyProcessCreatedAsync
    │                                                      ├── InApp + Push + PushWeb a stakeholders
    │                                                      ├── MultiChannelAlert (Slack/Teams)
    │                                                      └── Email reclutamiento
    │
    └── 201 Created + Vacante creada
```

**Endpoints:**
- `POST api/request-positions` - Crear vacante
- `GET api/request-positions` - Listar vacantes
- `GET api/request-positions/{id}` - Detalle vacante

**Estados Vacante:** `Pendiente` → `Proceso` → `Concluido` / `Cancelado`

---

### 2. FLUJO: Postulación de Candidato (Candidate Application)

**Actores:** Reclutador → Sistema → Candidato (pasivo) → Gerente Operaciones

```
Reclutador              Backend (API)                    Notificaciones
    │                         │                              │
    ├── POST /api/recruitment-candidate-processes/multipart │
    │    (CandidateProcessCreateOrUpdateDto + CV)          │
    │                         │                              │
    │                         ├── Validar: vacante Pendiente │
    │                         ├── Validar: no duplicado      │
    │                         ├── Crear CandidateProcess     │
    │                         │    Stage = Nuevo             │
    │                         │    ProcessStatus = Abierto   │
    │                         ├── Append StageHistory        │
    │                         │                              │
    │                         └── Dispara CandidateProcessCreatedEvent (implícito)
    │                                            │
    │                                            ├── CandidateNotificationCoordinator
    │                                            │    └── NotifyProcessCreatedAsync
    │                                            │         ├── Stakeholders (Admin, Gerente Ops, Gerente Atención)
    │                                            │         ├── MultiChannelAlert (Info)
    │                                            │         └── Email reclutamiento
    │                                            │
    │                                            └── (Si hay entrevista agendada)
    │                                                 └── NotifyProcessInterviewScheduledAsync
    │                                                      └── Email + InApp al entrevistador
    │
    └── 200 OK + CandidateProcess creado
```

**Endpoints:**
- `POST api/recruitment-candidate-processes/multipart` - Crear con CV
- `POST api/recruitment-candidate-processes` - Crear JSON
- `GET api/recruitment-candidate-processes` - Bandeja operativa (tray)
- `GET api/recruitment-candidate-processes/by-stage/{stage}` - Filtrar por etapa

**Etapas (CandidateProcessStage):**
```
Nuevo → EnEspera → EntrevistaOperaciones → Seleccionado → AltaEnProceso → Contratado
                    ↘ Rechazado / NoSePresento
```

---

### 3. FLUJO: Gestión de Entrevistas (Interview Management)

**Actores:** Reclutador ↔ Gerente Operaciones ↔ Sistema

```
Reclutador                    Backend                    Entrevistador (Gerente Ops)
    │                          │                              │
    ├── POST /{id}/schedule    │                              │
    │    (ScheduleRecruitment  │                              │
    │     InterviewRequest)    │                              │
    │                          ├── Validar: stage=Entrevista  │
    │                          ├── Crear/Actualizar CandidateInterview
    │                          ├── Asignar InterviewerUserId  │
    │                          ├── ScheduledAt                │
    │                          │                              │
    │                          └── Dispara NotifyProcessInterviewScheduledAsync
    │                                            │
    │                                            ├── InApp + Push + PushWeb al entrevistador
    │                                            ├── Email con detalles + enlace respuesta
    │                                            └── MultiChannelAlert (Warning)
    │
    ├── (Entrevistador accede a /interview-response)          │
    │                          │                              │
    │                          ├── GET /{id}/interview-response
    │                          │    Retorna CandidateInterviewResponseDto
    │                          │                              │
    │                          └── POST /interviewer-action   │
    │                               (InterviewerActionRequest)│
    │                                        │                │
    │                                        ├── ExecuteInterviewerActionAsync
    │                                        │    Acciones: Confirmar, Reagendar, Cancelar, Feedback
    │                                        │                │
    │                                        │    Si Feedback (Aprobar/Rechazar):
    │                                        │         ├── ChangeStageAsync
    │                                        │         ├── NotifyProcessInterviewFeedbackSubmittedAsync
    │                                        │         │    └── Email + InApp a Reclutadores
    │                                        │         │
    │                                        │         └── Si Aprobar → Stage=Seleccionado
    │                                        │              ├── NotifyProcessPresentationHiringRequestGeneratedAsync
    │                                        │              │    └── Pregenera SolicitudAlta
    │                                        │              └── NotifySiblingCandidatesFrozenAsync
    │                                        │                   └── Pausa otros candidatos, cancela entrevistas
    │                                        │
    │                                        └── Notificaciones según acción
    │
    └── 200 OK
```

**Endpoints Entrevista:**
- `POST /{id}/schedule` - Agendar
- `POST /{id}/cancel-schedule` - Cancelar
- `GET /{id}/interview-response` - Vista entrevistador (RequireInterviewerRole)
- `POST /interviewer-action` - Acciones entrevistador (RequireInterviewerRole)

**Acciones Entrevistador (InterviewerActionRequest):**
- `ConfirmAttendance` - Confirma asistencia
- `Reschedule` - Reagendar
- `Cancel` - Cancelar
- `SubmitFeedback` - Enviar decisión (Aprobar/Rechazar) + razón + comentario

---

### 4. FLUJO: Decisión Final y Alta (Hiring Process)

**Actores:** Reclutador → Sistema → Administrador Cliente → Sistema → Reclutador

```
Reclutador                  Backend                     Admin Cliente
    │                          │                           │
    │  (Candidato en Seleccionado o AltaEnProceso)        │
    │                          │                           │
    ├── POST /{id}/process-hiring                         │
    │    (CandidateApplicationProcessHiringDto + docs)    │
    │                          │                           │
    │                          ├── Validar: Stage ∈ {Seleccionado, ReadyForHire, AltaEnProceso}
    │                          ├── Validar: CV obligatorio │
    │                          ├── ResolveOrCreateEmployeeId
    │                          │    (busca por email o crea ApplicationUser + Employee)
    │                          ├── RequestEmployeeRegisterAppService.OnSolicitudAltaAsync
    │                          │    │                      │
    │                          │    ├── Crea RequestEmployeeRegister
    │                          │    │    Status = Proceso
    │                          │    │                      │
    │                          │    └── Dispara RequestEmployeeRegisterCreatedEvent
    │                          │         │                 │
    │                          │         ├── RequestEmployeeRegisterHandler
    │                          │         │    └── OnSendEmailAltaSistemasAsync
    │                          │         │         (notifica a sistemas: nómina, accesos, etc.)
    │                          │         │
    │                          │         └── CandidateNotificationCoordinator
    │                          │              └── NotifyProcessPresentationHiringRequestGeneratedAsync
    │                          │                   ├── Reclutadores: InApp + Email
    │                          │                   └── MultiChannelAlert (Warning)
    │                          │
    │                          ├── ChangeStage → AltaEnProceso
    │                          │
    │                          └── 200 OK "Alta procesada"
    │                                                   │
    │                                                   ├── Completa formulario SolicitudAltaForm
    │                                                   │    (datos bancarios, contrato, docs)
    │                                                   ├── POST /api/recruitment-requests/solicitud-alta
    │                                                   │                          │
    │                                                   │                          └── RequestEmployeeRegisterAppService
    │                                                   │                               ├── Valida y actualiza RequestEmployeeRegister
    │                                                   │                               ├── Dispara RequestEmployeeRegisterConfirmedEvent
    │                                                   │                               │         │
    │                                                   │                               │         └── RequestEmployeeRegisterHandler
    │                                                   │                               │              └── EmployeeContractGeneratorService.GenerateContractOnConfirmedAsync
    │                                                   │                               │
    │                                                   │                               └── NotifyProcessReceptionConfirmedAsync (si aplica)
    │                                                   │
    │                          (Segunda llamada - confirmar contratación)
    ├── POST /{id}/complete-hiring                       │
    │                          │                           │
    │                          ├── Validar: Stage = AltaEnProceso
    │                          ├── CompleteHiringProcessAsync
    │                          │    ├── Stage = Contratado
    │                          │    ├── ProcessStatus = Cerrado
    │                          │    ├── ClosedAt = Now
    │                          │    ├── RequestPosition.Status = Concluido
    │                          │    ├── CloseSiblingCandidateProcessesAsync
    │                          │    │    (pausa otros candidatos de misma vacante)
    │                          │    │
    │                          │    └── NotifySiblingCandidatesFrozenAsync
    │                          │
    │                          └── 200 OK "Contratación finalizada"
    │
    └── Flujo completo
```

**Endpoints Alta:**
- `POST /{id}/process-hiring` - Procesar alta (multipart con docs)
- `POST /{id}/complete-hiring` - Confirmar contratación
- `POST /direct-hire/{requestPositionId}` - Alta directa sin pipeline
- `POST /{id}/hiring-documents` - Subir docs contratación
- `POST /hiring-documents/{id}/validate` - Validar docs
- `GET /{id}/hiring-documents` - Listar docs

---

### 5. FLUJO: Solicitud de Baja (Dismissal)

**Actores:** Administrador/Reclutador → Sistema → Legal (opcional)

```
Admin/Reclutador           Backend                        Legal (si aplica)
    │                         │                              │
    ├── POST /api/recruitment-requests/solicitud-baja       │
    │    (multipart: form + archivos renuncia/evidencia)    │
    │                         │                              │
    │                         ├── RequestDismissalAppService.OnSolicitudBajaAsync
    │                         │    ├── Crea RequestDismissal
    │                         │    ├── Folio BAJ{folio:D5}
    │                         │    ├── Guarda archivos soporte
    │                         │    │
    │                         │    └── Dispara RequestDismissalRequestedEvent
    │                         │         │
    │                         │         └── RequestDismissalRequestedHandler
    │                         │              │
    │                         │              └── Si LawyerAssistance = true
    │                         │                   └── TaskLegalAppService.CreateLegalTaskAsync
    │                         │                        (Ticket legal para abogado)
    │                         │
    │                         └── 200 OK
    │
    └── Flujo completo
```

**Tipos de Baja (typeOfDeparture):**
- `0` = Renuncia (requiere archivo firmado)
- `1` = Abandono
- `2` = Despido (requiere evidencia)
- `3` = Evaluación (requiere evaluaciones en sistema)
- `4` = Faltas (requiere acta administrativa)

---

### 6. FLUJO: Modificación Salarial (Salary Modification)

**Actores:** Administrador/Reclutador → Sistema

```
Admin/Reclutador           Backend
    │                         │
    ├── POST /api/recruitment-requests/solicitud-modificacion-salario
    │    (multipart: form + archivos soporte)
    │                         │
    │                         ├── RequestSalaryModificationAppService.OnSolicitudModificacionSalarioAsync
    │                         │    ├── Crea RequestSalaryModification
    │                         │    ├── Folio MSM{folio:D5}
    │                         │    ├── Datos: salario actual/nuevo, fecha ejecución, retroactivo
    │                         │    ├── Puede ligar a vacante (isCoveringVacancy)
    │                         │    └── Guarda archivos soporte
    │                         │
    │                         └── 200 OK
    │
    └── Flujo completo
```

**Estados:** `Pendiente` → `Proceso` → `Concluido` / `Cancelado`

---

### 7. FLUJO: Automatizaciones y Monitoreo (Background Jobs)

**Actor:** Sistema (Scheduler)

```
Sistema (Daily Job)           Backend
    │                            │
    ├── POST /run-automation     │
    │                            ├── CandidateAutomationService.ExecuteDailyMonitoringAsync
    │                            │    │
    │                            │    ├── Detectar procesos estancados (StageStalled)
    │                            │    │    └── NotifyProcessStageStalledAsync
    │                            │    │
    │                            │    ├── Detectar entrevistas pendientes agenda
    │                            │    │    └── NotifyProcessOperationsInterviewAgendaPendingAsync
    │                            │    │
    │                            │    ├── Detectar entrevistas < 24h (recordatorio)
    │                            │    │    └── NotifyProcessOperationsInterviewReminderAsync
    │                            │    │
    │                            │    ├── Detectar entrevistas vencidas sin feedback
    │                            │    │    └── NotifyProcessOperationsInterviewOverdueAsync
    │                            │    │         └── MultiChannelAlert (Critical)
    │                            │    │
    │                            │    └── Escalar entrevistas muy vencidas
    │                            │         └── NotifyProcessOperationsInterviewEscalatedAsync
    │                            │
    │                            └── 200 OK
    │
    └── Ejecución diaria programada
```

---

### 8. FLUJO: Confirmación de Presentación (Candidate Presentation)

**Actores:** Operaciones (autorizado) → Sistema → Reclutador

```
Operaciones (CanConfirmCandidatePresentation)   Backend              Reclutador
    │                                            │                       │
    ├── POST /{id}/presentation-result          │                       │
    │    (ConfirmPresentationRequestDto)        │                       │
    │                                            │                       │
    │                                            ├── CandidateProcessAppService.ConfirmPresentationAsync
    │                                            │    ├── Valida proceso
    │                                            │    ├── Marca PresentationConfirmedAt
    │                                            │    ├── Pregenera SolicitudAlta (RequestEmployeeRegister)
    │                                            │    │    Status = Proceso
    │                                            │    │
    │                                            │    └── Dispara NotifyProcessPresentationHiringRequestGeneratedAsync
    │                                            │         ├── Reclutadores: InApp + Email
    │                                            │         └── MultiChannelAlert (Warning)
    │                                            │
    │                                            └── 200 OK
    │
    └── (Opcional) POST /{id}/reconfirm-presentation
         (Regenera solicitud de alta si faltante)
```

---

## Eventos de Dominio (Domain Events)

| Evento | Handler | Acción Principal |
|--------|---------|------------------|
| `RequestPositionCreatedEvent` | `RequestPositionHandler` | Email notificación vacante |
| `RequestEmployeeRegisterCreatedEvent` | `RequestEmployeeRegisterHandler` | Email a sistemas (nómina, accesos) |
| `RequestEmployeeRegisterConfirmedEvent` | `RequestEmployeeRegisterHandler` | Generar contrato trabajo |
| `RequestDismissalRequestedEvent` | `RequestDismissalRequestedHandler` | Ticket legal si requiere abogado |
| `RequestSalaryModificationCreatedEvent` | (pendiente) | Notificaciones |
| `CandidateProcessCreatedEvent` (implícito) | `CandidateNotificationCoordinator` | Notificar stakeholders |
| `CandidateProcessStageChangedEvent` (implícito) | `CandidateNotificationCoordinator` | Notificar según etapa |

---

## Notificaciones Multi-Canal

**Canales:** `InApp` + `Push` + `PushWeb` (todos los eventos candidatos)

**Tipos de Alerta (MultiChannelAlertService):**
- `Info` - Nueva postulación
- `Warning` - Entrevista pendiente, solicitud alta pregenerada
- `Critical` - Entrevista vencida, escalamiento

**Plantillas Email (RecruitmentEmailService):**
- `SendSolicitudVacanteEmailAsync` - Nueva vacante
- `SendCandidateApplicationCreatedEmailAsync` - Nueva postulación
- `SendCandidateSentToInterviewEmailAsync` - Candidato a entrevista
- `SendCandidateInterviewTrackingEmailAsync` - Seguimiento entrevista
- `SendCandidateInterviewDecisionEmailAsync` - Decisión entrevista
- `SendCandidateReceptionConfirmedEmailAsync` - Recepción confirmada
- `SendCandidateApplicationStageStalledEmailAsync` - Estancado

---

## Endpoints API Resumen (CandidateProcessEndPoint.cs)

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/api/recruitment-candidate-processes` | Bandeja operativa (paginada) | RequireRecruitmentRole |
| GET | `/by-stage/{stage}` | Filtrar por etapa | RequireRecruitmentRole |
| GET | `/kpis` | KPIs reclutamiento | RequireRecruitmentRole |
| POST | `/run-automation` | Ejecutar monitoreo diario | RequireRecruitmentRole |
| GET | `/{id}` | Detalle proceso | RequireRecruitmentRole |
| GET | `/candidate/{candidateId}` | Procesos por candidato | RequireRecruitmentRole |
| GET | `/recruitment-agenda` | Agenda reclutamiento | RequireRecruitmentRole |
| GET | `/recruitment-board` | Tablero por vacante | RequireRecruitmentRole |
| GET | `/interviewer-queue` | Cola entrevistas | RequireRecruitmentRole |
| GET | `/interviewer-view` | Vista entrevistador | RequireRecruitmentRole |
| GET | `/employee-interviewer-queue/{customerId}` | Cola entrevistador x cliente | RequireInterviewerRole |
| GET | `/request-position/{id}` | Detalle por vacante | RequireRecruitmentRole |
| GET | `/request-position/{id}/timeline` | Timeline candidatos x vacante | RequireRecruitmentRole |
| GET | `/work-position/{id}` | Detalle por puesto trabajo | RequireRecruitmentRole |
| POST | `` | Crear proceso (JSON) | RequireRecruitmentRole |
| POST | `/multipart` | Crear proceso (multipart+CV) | RequireRecruitmentRole |
| PUT | `/{id}` | Actualizar proceso (JSON) | RequireRecruitmentRole |
| PUT | `/{id}/multipart` | Actualizar proceso (multipart) | RequireRecruitmentRole |
| POST | `/{id}/process-hiring` | Procesar alta (multipart) | ExpedienteEmpleado |
| POST | `/direct-hire/{requestPositionId}` | Alta directa sin pipeline | ExpedienteEmpleado |
| POST | `/{id}/hiring-documents` | Subir doc contratación | ExpedienteEmpleado |
| DELETE | `/{id}/hiring-documents/{docId}/file` | Eliminar archivo doc | ExpedienteEmpleado |
| GET | `/{id}/hiring-documents` | Listar docs contratación | RequireRecruitmentRole |
| POST | `/hiring-documents/{docId}/validate` | Validar doc | ExpedienteEmpleado |
| POST | `/{id}/schedule` | Agendar entrevista | RequireRecruitmentRole |
| POST | `/{id}/cancel-schedule` | Cancelar entrevista | RequireRecruitmentRole |
| POST | `/{id}/stage` | Cambiar etapa | RequireRecruitmentRole |
| POST | `/{id}/complete-hiring` | Confirmar contratación | RequireRecruitmentRole |
| POST | `/{id}/presentation-result` | Confirmar presentación | CanConfirmCandidatePresentation |
| POST | `/{id}/reconfirm-presentation` | Reconfirmar presentación | CanConfirmCandidatePresentation |
| POST | `/{id}/decision` | Registrar decisión final | RequireRecruitmentRole |
| GET | `/{id}/interview-response` | Vista respuesta entrevista | RequireInterviewerRole |
| POST | `/interviewer-action` | Acciones entrevistador | RequireInterviewerRole |

---

## Frontend Components Clave (Angular)

| Componente | Ruta | Descripción |
|------------|------|-------------|
| `SolicitudesClienteList` | `/reclutamiento/solicitudes-cliente` | Lista vacantes, altas, bajas, mod.salarial |
| `VacanteForm` | Modal | Crear/editar vacante + gestionar candidato |
| `CandidateApplicationForm` | Modal | Postular candidato + agendar entrevista |
| `SolicitudAltaForm` | Modal | Formulario alta empleado |
| `SolicitudBajaForm` | Modal | Formulario baja empleado |
| `SolicitudModificacionSalarioForm` | Modal | Formulario modificación salarial |
| `EmployeeForm` | `/directorio/employee-form` | Ficha empleado (bancarios, clínicos, docs) |
| `RecruitmentStaffBoard` | Tablero reclutamiento | Vista tablero/kanban |

---

## Estructura de Datos Clave (DTOs)

### CandidateProcess (Pipeline Principal)
```csharp
CandidateProcess {
  Id, CandidateId, RequestPositionId
  CurrentStage: Nuevo|EnEspera|EntrevistaOperaciones|Seleccionado|AltaEnProceso|Contratado|Rechazado|NoSePresento
  ProcessStatus: Abierto|Cerrado
  RegisterDate, ClosedAt
  StageHistory[] { FromStage, ToStage, ChangedAt, ChangedByUserId, Comment }
  Interviews[] { InterviewerUserId, ScheduledAt, Status, Feedback, Decision, DecisionReason }
}
```

### RequestPosition (Vacante)
```csharp
RequestPosition {
  Id, Folio, WorkPositionId, ApplicationUserId (solicitante)
  Status: Pendiente|Proceso|Concluido|Cancelado
  RequestDate, SelectionDate, EntryDate, DateFinish
}
```

### RequestEmployeeRegister (Solicitud Alta)
```csharp
RequestEmployeeRegister {
  Id, Folio, CandidateId?, PositionRequestId?
  EmployeeId, Boss, CandidateName, CustomerAddress
  TypeContractRegister, AdditionalInformation
  Status: Pendiente|Proceso|Concluido|Cancelado
}
```

### RequestDismissal (Solicitud Baja)
```csharp
RequestDismissal {
  Id, Folio, EmployeeId, ApplicationRoleId
  TypeOfDeparture: Renuncia|Abandono|Despido|Evaluacion|Faltas
  ExecutionDate, LastDayOfWork, ReasonForLeaving
  LawyerAssistance, EmployeeInformed
  DiscountDescriptions[]
  SupportFiles[]
}
```

### RequestSalaryModification (Mod. Salarial)
```csharp
RequestSalaryModification {
  Id, Folio, EmployeeId, WorkPositionId
  CurrentSalary, FinalSalary, ExecutionDate, Retroactive
  ApplicationRoleCurrentId, ApplicationRoleNewId
  IsCoveringVacancy, VacancyId
  AdditionalInformation, SupportFiles[]
}
```

---

## Casos Borde y Reglas de Negocio Críticas

1. **Vacante bloqueada:** Solo se asignan candidatos a vacantes en `Pendiente`
2. **Duplicados:** Un candidato no puede postularse dos veces a la misma vacante
3. **CV obligatorio:** Requerido para procesar alta (`ProcessHiringAsync`)
4. **Concurrencia alta:** `CloseSiblingCandidateProcessesAsync` pausa otros candidatos al contratar uno
5. **Entrevistador aislado:** Endpoints `/interview-response` y `/interviewer-action` usan `RequireInterviewerRole` (NO `RequireRecruitmentRole`)
6. **Automatización diaria:** Detecta estancados, pendientes agenda, recordatorios, vencidos, escalamientos
7. **Documentos alta:** Solo PDF, validación por RRHH, versionado de archivos
8. **Alta directa:** `ProcessDirectHiringAsync` salta pipeline candidatos, crea Employee + RequestEmployeeRegister + cierra vacante en una transacción

---

## Referencias de Código para Diagramas

### Backend
- `CandidateProcessEndPoint.cs:10-214` - Todos los endpoints
- `CandidateProcessAppService.cs` - Lógica de negocio completa
- `CandidateNotificationCoordinatorService.cs` - Todas las notificaciones
- `RequestPositionHandler.cs` - Evento creación vacante
- `RequestEmployeeRegisterHandler.cs` - Eventos alta
- `RequestDismissalRequestedHandler.cs` - Evento baja

### Frontend
- `candidate-application-form.ts` - Postulación + entrevista
- `vacante-form.ts` - Gestión vacante + link a candidato
- `solicitud-alta-form.ts` - Alta empleado
- `solicitud-baja-form.ts` - Baja empleado
- `solicitud-modificacion-salario-form.ts` - Mod. salarial
- `solicitudes-cliente-list.ts` - Lista maestra

---

## Para Generar Diagramas de Secuencia

Usar este análisis como fuente de verdad. Cada flujo principal tiene:
1. **Actores** (swimlanes)
2. **Endpoints HTTP** (mensajes sincrónicos)
3. **Eventos de dominio** (mensajes asíncronos)
4. **Notificaciones** (ramificación multi-canal)
5. **Cambios de estado** (etapas, status)
6. **Reglas de validación** (guard conditions)

Los diagramas deben reflejar la arquitectura **Minimal API + Domain Events + MediatR-like handlers** del backend y **Standalone Components + Signals + Reactive Forms** del frontend.