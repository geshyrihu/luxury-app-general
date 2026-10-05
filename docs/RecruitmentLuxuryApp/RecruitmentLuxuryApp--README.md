# Modulo Candidates (Backend)

Ultima revision: `2026-08-16`
Estado: `Vigente post-refactor V3`

## Estado actual

El backend de reclutamiento candidatos opera en patron `process-first`.

- `CandidateProcess` es la fuente de verdad del pipeline.
- `Candidate` conserva la ficha maestra y el CV.
- `ProcessHiringAsync` orquesta el alta hacia empleado.
- `EmployeeDocument` guarda documentacion de contratacion en expediente del empleado.
- El cierre de vacante ahora cierra en cascada los procesos abiertos con `VacanteCerrada`.

## Agregados funcionales ya vigentes

### R-01

- `Candidate.RecruitmentSource`
- DTOs de candidato alineados a `FuenteReclutamiento`

### R-02

- alta orquestada de empleado
- distribucion real hacia persona, direccion, banco, salud, emergencia y turno
- transaccion atomica

### R-03

- `EmployeeDocument`
- `RecruitmentDocumentType`
- carga, listado y validacion de documentos de contratacion
- CV separado del expediente del empleado

## Fuente de verdad del flujo

Servicios principales:

- `CandidateAppService`
- `CandidateProcessAppService`
- `RequestPositionAppService`
- `CandidateNotificationCoordinatorService`

Reglas vigentes:

- decisiones de entrevista se registran sobre `CandidateProcess`
- `CandidateInterviewFeedback` ya no debe recibir escrituras nuevas
- `CandidateApplication` queda como superficie legacy de compatibilidad

## Etapas vigentes

Fuente de verdad:

- `CandidateProcessStage`

Pipeline vigente:

1. `Nuevo`
2. `EntrevistaReclutamiento`
3. `EntrevistaOperaciones`
4. `NoSePresento`
5. `Rechazado`
6. `Seleccionado`
7. `AltaEnProceso`
8. `Contratado`

## Endpoints relevantes

- `/api/recruitment-candidates`
- `/api/recruitment-candidate-processes`
- `/api/recruitment-candidate-processes/interviewer-action`
- `/api/recruitment-candidate-processes/{id}/schedule`
- `/api/recruitment-candidate-processes/{id}/process-hiring`
- `/api/recruitment-candidate-processes/{applicationId}/hiring-documents`
- `/api/recruitment-candidate-processes/{documentId}/validate`

Compatibilidad temporal:

- `/api/recruitment-candidate-applications`

No debe usarse para trabajo nuevo:

- endpoints de escritura de `CandidateInterviewFeedback`

## Cierre de vacante en cascada

Cuando una `RequestPosition` cambia a estado de cierre real:

- busca procesos abiertos de esa vacante
- los marca `ProcessStatus = Cerrado`
- asigna `ClosureReason = VacanteCerrada`
- asigna `ClosedAt`
- conserva `CurrentStage`

Hook vigente:

- `RequestPositionAppService.UpdateAsync`

## Documentacion y migracion

- La migracion de `EmployeeDocument` forma parte del despliegue aprobado.
- `Program.cs` aplica migraciones en startup.
- `nueva-extructuraV2.md` y `nueva-extructuraV3.md` quedan ejecutadas al `2026-08-16`.

## Deuda conocida fuera de este cierre

- `openAltaForm` y `EmployeeProviderForm` siguen acoplados
- `staff-board/interviewer-view.interface.ts` y `staff-board-interviewer.service.ts` siguen muertos sin retirar
- persiste una superficie legacy de compatibilidad en `CandidateApplication`

## Referencias

- `Docs/documentacion-candidates.md`
- `docs/plans/20260815-candidates-refactor-v3-plan.md`
- `client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/docs/README.md`
