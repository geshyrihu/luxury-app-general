# 06 - Execution Handoff

## Propósito

Este documento traduce el plan de reestructuración a instrucciones ejecutables, precisas y sin ambigüedad para el agente que codificará.

No sustituye el plan formal. Lo operacionaliza.

---

## 1. Resultado Esperado

Al terminar la reestructuración:

- `CandidateApplication` deja de ser dueño de la agenda de entrevistas.
- existe una entidad formal `CandidateInterview`.
- existe una entidad formal `CandidateInterviewResult`.
- la experiencia laboral del candidato es estructurada.
- el flujo principal de Reclutamiento queda así:

`Candidato -> Postulación -> Cita de entrevista -> Resultado -> Alta`

- la UI de Reclutamiento permite:
  - registrar candidato
  - cargar CV
  - asignar vacante
  - crear entrevista inicial
  - reagendar/cancelar entrevista
  - ver detalle por puesto con activos e histórico

---

## 2. Reglas de Ejecución para el Agente

### 2.1 Sí debe hacer

- leer primero:
  - `CONVENTIONS.md`
  - `docs/modulos-nuevos/reestructuracion-reclutamiento-candidates/04-implementation-plan.md`
  - este archivo
- trabajar solo sobre `client/angular`, nunca `client/luxuryapp`
- actualizar documentación del módulo cuando cierre una fase
- validar con build y typecheck al cierre de cada fase

### 2.2 No debe hacer

- no mezclar componentes de Reclutamiento con componentes exclusivos del entrevistador
- no dejar lecturas legacy a medias
- no eliminar columnas legacy antes de migrar lectura/escritura
- no mover shared sin análisis explícito
- no inventar nuevos roles fuera del catálogo

---

## 3. Fuente de Verdad por Etapa

### Estado actual

- maestro candidato: `Candidate`
- postulación: `CandidateApplication`
- agenda embebida: `CandidateApplication.RecruitmentInterviewAt`, `OperationsInterviewAt`, `OperationsInterviewAssignedToUserId`
- feedback legacy: `CandidateInterviewFeedback`

### Estado objetivo

- maestro candidato: `Candidate`
- experiencia laboral: `CandidateWorkExperience`
- postulación: `CandidateApplication`
- cita: `CandidateInterview`
- resultado: `CandidateInterviewResult`
- matriz: `InterviewerMatrix`
- alta documental: `RequestEmployeeRegisterFile`

---

## 4. Fases Ejecutables

## Fase 1 - Inventario Técnico Obligatorio

### Objetivo

Detectar todos los lugares donde el sistema actual depende del modelo legacy.

### Archivos backend a inspeccionar mínimo

- `D:/repos/luxuryapp-api/api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Recruitment/ReclutamientoyAltasBajas/Candidate.cs`
- `D:/repos/luxuryapp-api/api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Recruitment/ReclutamientoyAltasBajas/CandidateApplication.cs`
- `D:/repos/luxuryapp-api/api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Recruitment/ReclutamientoyAltasBajas/CandidateInterviewFeedback.cs`
- `D:/repos/luxuryapp-api/api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/CandidateApplication/Services/CandidateApplicationAppService.cs`
- `D:/repos/luxuryapp-api/api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/CandidateInterview/Services/CandidateInterviewAppService.cs`
- `D:/repos/luxuryapp-api/api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/Notifications/Services/CandidateNotificationCoordinatorService.cs`

### Archivos frontend a inspeccionar mínimo

- `D:/repos/luxuryapp-api/client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/candidate-application/candidate-application-form.ts`
- `D:/repos/luxuryapp-api/client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/candidate-application/candidate-application-list.ts`
- `D:/repos/luxuryapp-api/client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/candidate-recruitment-interviews/candidate-recruitment-interviews.ts`
- `D:/repos/luxuryapp-api/client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/candidate-recruitment-interviews/candidate-recruitment-schedule-modal.ts`
- `D:/repos/luxuryapp-api/client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/recruitment-agenda-list.ts`
- `D:/repos/luxuryapp-api/client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/candidate-interviewer-queue/candidate-interviewer-queue.ts`

### Entregable

Crear o actualizar una sección en `decisiones.md` con:

- usos de columnas legacy
- endpoints afectados
- componentes afectados
- orden recomendado de migración

### Criterio de aceptación

- existe inventario explícito de lecturas y escrituras legacy

---

## Fase 2 - Nuevo Modelo de Datos

### Objetivo

Introducir las nuevas entidades sin romper compilación.

### Crear entidades nuevas

#### A. `CandidateWorkExperience`

Nombre de dominio en español: `ExperienciaLaboralCandidato`

Propósito:

- historial laboral estructurado por candidato

Propiedades mínimas:

- `Id`
- `CandidateId`
- `CompanyName`
- `JobPosition`
- `StartDate`
- `EndDate`
- `MonthlyNetSalary`
- `DepartureReason`
- auditoría

#### B. `CandidateInterview`

Nombre de dominio en español: `CitaEntrevistaCandidato`

Propiedades mínimas:

- `Id`
- `CandidateApplicationId`
- `InterviewType`
- `InterviewerUserId`
- `InterviewerRole`
- `ScheduledAt`
- `Status`
- `ScheduleStatus`
- `ProposedRescheduleAt`
- `RescheduleComment`
- `ConfirmedAt`
- `ClosedAt`
- `Notes`
- auditoría

#### C. `CandidateInterviewResult`

Nombre de dominio en español: `ResultadoEntrevistaCandidato`

Propiedades mínimas:

- `Id`
- `InterviewId`
- `Decision`
- `DecisionReasonId`
- `AdditionalComment`
- `EvaluatedAt`
- `EvaluatedByUserId`
- auditoría

#### D. `InterviewerMatrix`

Nombre de dominio en español: `MatrizEntrevistadores`

Propiedades mínimas:

- `Id`
- `CustomerId`
- `WorkPositionRole`
- `InterviewerRole`
- `IsActive`
- auditoría

#### E. `RequestEmployeeRegisterFile`

Nombre de dominio en español: `DocumentoAltaEmpleado`

Propiedades mínimas:

- `Id`
- `RequestEmployeeRegisterId`
- `DocumentType`
- `IsSubmitted`
- `FilePath`
- `FileName`
- `UploadDate`
- `IsValidated`
- `ValidationNotes`
- `ValidatedAt`
- `ValidatedByUserId`
- auditoría

### Modificar entidades existentes

#### `Candidate`

Agregar:

- `IsInTalentPool`
- `TalentPoolNotes`

Mantener `ExperienceSummary` solo de forma transitoria.

#### `CandidateApplication`

Mantener temporalmente:

- `RecruitmentInterviewAt`
- `OperationsInterviewAt`
- `OperationsInterviewAssignedToUserId`

No remover en esta fase.

### Migración

Crear migración de esquema para:

- nuevas tablas
- nuevas columnas
- cambio de índice único a no único donde aplique

### Criterio de aceptación

- compila backend
- migración generada
- no se ha roto frontend

---

## Fase 3 - Contratos Backend Nuevos

### Objetivo

Crear servicios y endpoints del nuevo dominio de entrevistas.

### Nuevos grupos lógicos esperados

- `CandidateWorkExperience`
- `CandidateInterview`
- `CandidateInterviewResult`
- `InterviewerMatrix`

### Reglas

- 1 DTO por archivo
- endpoints separados por feature
- no meter múltiples responsabilidades en `CandidateApplicationAppService`

### Backend mínimo a crear o reorganizar

#### Entrevistas

Capacidades:

- crear cita
- reagendar cita
- confirmar cita
- cancelar cita
- cerrar cita por no asistencia
- cerrar cita con rechazo
- cerrar cita con aprobación
- listar citas por postulación
- listar citas por puesto
- listar citas por entrevistador

#### Resultados

Capacidades:

- registrar resultado
- consultar historial por entrevista

### Regla de dominio

La postulación ya no agenda directo. Crea entrevistas.

### Criterio de aceptación

- existe API de entrevistas sin depender de columnas legacy para crear nuevas citas

---

## Fase 4 - Migración de Lógica Operativa

### Objetivo

Cambiar la lectura/escritura del flujo real al nuevo modelo.

### Reemplazos obligatorios

#### Antes

- agenda desde `CandidateApplication.RecruitmentInterviewAt`
- agenda desde `CandidateApplication.OperationsInterviewAt`
- respuesta desde `CandidateInterviewFeedback`

#### Después

- agenda desde `CandidateInterview`
- resultado desde `CandidateInterviewResult`

### Servicios que deben migrarse

- `GetRecruitmentAgendaAsync`
- `GetRecruitmentInterviewBoardAsync`
- `GetInterviewerQueueAsync`
- `GetInterviewResponseAsync`
- notificaciones de nueva entrevista
- notificaciones de escalación

### Criterio de aceptación

- agenda y tableros leen datos nuevos reales
- datos de prueba visibles en UI

---

## Fase 5 - Configuración de Matriz desde Admin

### Objetivo

La matriz de entrevistadores no debe administrarse desde Reclutamiento. Debe configurarse desde:

- `D:/repos/luxuryapp-api/client/angular/src/app/apps/admin.luxuryapp`

### Resultado esperado

Crear una feature administrativa para `InterviewerMatrix` donde un usuario autorizado configure por `customer`:

- rol del puesto
- rol entrevistador
- estatus activo/inactivo

### Reglas

- Admin configura.
- Reclutamiento consume.
- No duplicar UI de configuración dentro de `reclutamiento.luxuryapp`.

### Tareas exactas

- crear componente/listado/form en `admin.luxuryapp`
- crear servicio frontend de Admin para `api/recruitment-interviewer-matrix`
- permitir CRUD por customer
- documentar permisos esperados
- validar que el backend de entrevistas pueda resolver entrevistador a partir de esta matriz

### Criterio de aceptación

- la matriz se configura desde Admin por customer
- Reclutamiento ya no necesita capturar manualmente el rol entrevistador como fuente de verdad

---

## Fase 6 - Frontend Reclutamiento

### Objetivo

Hacer coherente la experiencia de Reclutamiento.

### Cambio funcional obligatorio 1

#### Lista de candidatos

Desde:

- alta de candidato

Hacia:

- alta de candidato
- captura de experiencia laboral
- posibilidad de continuar directo a “Asignar vacante y entrevista”

### Cambio funcional obligatorio 2

#### Formulario actual `CandidateApplicationForm`

Convertirlo conceptualmente en:

`Agregar candidato y entrevista`

Debe permitir:

- seleccionar candidato existente o crear nuevo
- seleccionar vacante
- cargar CV
- guardar fecha de registro automática
- capturar fecha y hora de entrevista
- capturar notas iniciales
- crear postulación
- crear entrevista inicial

### Cambio funcional obligatorio 3

#### Lista de vacantes

En la columna de candidatos:

- quitar nombre plano como resumen principal
- mostrar icono o CTA de detalle
- llevar a `/recruitment/candidates/work-position/:workPositionId/candidates`

En edición de vacante:

- CTA principal debe ser explícito:
  - `Agregar candidato y entrevista`

No debe quedarse ambiguo como “postular” sin contexto.

### Cambio funcional obligatorio 4

#### `candidate-work-position-candidates`

Debe volverse el detalle principal del puesto.

Debe mostrar:

- datos del puesto
- datos de la vacante
- candidatos activos
- candidatos históricos
- entrevistas activas
- entrevistas cerradas
- fecha/hora
- estatus
- entrevistador
- CV
- accesos a reagendar/cancelar/ver detalle

### Criterio de aceptación

- el flujo de Reclutamiento se puede completar sin ambigüedad desde vacantes o candidatos

---

## Fase 7 - Frontend Entrevistador

### Objetivo

Mantener separado el flujo del entrevistador.

### Reglas

- no reutilizar formularios de Reclutamiento para el entrevistador
- el entrevistador responde sobre una entrevista, no edita una postulación

### Vistas mínimas

- cola de entrevistas propias
- vista de respuesta
- confirmación / solicitud de cambio / no asistencia / rechazo / aprobación

### Criterio de aceptación

- un entrevistador no ve opciones de reclutamiento

---

## Fase 8 - Emails, SignalR, Push, OneSignal

### Objetivo

Actualizar rutas y destinatarios.

### Reglas

- los links deben construirse completos, no relativos simples
- usar el patrón del servicio de email donde se arma ruta pública completa
- distinguir por actor:
  - Reclutamiento -> detalle por puesto o postulación operativa
  - Entrevistador -> respuesta de entrevista

### Evento mínimo a corregir

- nueva postulación con entrevista creada
- nueva entrevista enviada
- entrevista vencida
- escalación

### Ruta recomendada para Reclutamiento

- detalle por puesto:
  - `/recruitment/candidates/work-position/{workPositionId}/candidates`

### Ruta recomendada para Entrevistador

- respuesta directa:
  - `/recruitment/candidates/interviews/respond?applicationId={id}`

### Criterio de aceptación

- email llega con botón
- botón abre la ruta correcta por rol
- push e in-app apuntan al mismo destino lógico

---

## Fase 9 - Retiro de Legacy

### Objetivo

Eliminar deuda técnica vieja solo cuando todo lo nuevo esté funcionando.

### Remover

- `RecruitmentInterviewAt`
- `OperationsInterviewAt`
- `OperationsInterviewAssignedToUserId`
- `CandidateInterviewFeedback`
- lecturas de `ExperienceSummary` como fuente principal

### Precondiciones

- agenda ya lee `CandidateInterview`
- resultados ya leen `CandidateInterviewResult`
- UI ya opera sobre lo nuevo
- migración histórica validada

### Criterio de aceptación

- no hay referencias productivas al modelo viejo

---

## 5. Archivos Esperados por el Agente

## Backend - nuevos o modificados

### Entidades / mappings / configuración EF

- carpeta de entidad para experiencias
- carpeta de entidad para entrevistas
- carpeta de entidad para resultados
- carpeta de entidad para matriz
- carpeta de entidad para documentos de alta

### Application layer

- nuevo feature folder `CandidateWorkExperience`
- nuevo feature folder `CandidateInterview`
- nuevo feature folder `CandidateInterviewResult`
- opcional: `InterviewerMatrix`

### Documentación backend

- actualizar `Candidates/README.md`
- actualizar `Candidates/Docs/documentacion-candidates.md`

## Frontend - nuevos o modificados

- `candidate-form.*`
- `candidate-application-form.*`
- `candidate-application-list.*`
- `candidate-recruitment-interviews.*`
- `candidate-recruitment-schedule-modal.*`
- `recruitment-agenda-list.*`
- `candidate-work-position-candidates.*`
- servicios e interfaces necesarias
- `candidates.routing.ts`

### Documentación frontend

- `candidates/docs/README.md`
- `candidates/docs/setup.md`
- `candidates/docs/decisiones.md`

---

## 6. Validaciones Obligatorias al Cierre de Cada Fase

- `dotnet build`
- `npx tsc --noEmit`
- validación manual del flujo afectado
- actualizar documentación de la fase

---

## 7. Prompt Copiar y Pegar para Agente Ejecutor

```md
Lee y obedece en este orden:

1. D:/repos/luxuryapp-api/CONVENTIONS.md
2. D:/repos/luxuryapp-api/docs/modulos-nuevos/reestructuracion-reclutamiento-candidates/04-implementation-plan.md
3. D:/repos/luxuryapp-api/docs/modulos-nuevos/reestructuracion-reclutamiento-candidates/06-execution-handoff.md

Objetivo:
Ejecutar la reestructuración integral del módulo Candidates/Reclutamiento conforme al plan aprobado.

Reglas:
- Trabaja solo sobre client/angular, no client/luxuryapp.
- No mezcles componentes de Reclutamiento con componentes de entrevistador.
- No elimines campos legacy hasta la fase de retiro.
- Usa apply_patch para ediciones manuales.
- Actualiza documentación del módulo al cierre de cada fase.

Empieza por Fase 1 y Fase 2:
- inventario técnico completo
- creación del nuevo modelo de datos

Después continúa fase por fase sin detenerte mientras no haya bloqueo real.

Al cerrar cada fase reporta:
- archivos tocados
- reglas de negocio cubiertas
- validaciones ejecutadas
- riesgos pendientes
```
