# Candidates Frontend Docs

Ultima revision: `2026-08-16`
Scope: `client/angular/src/app/modules/recruitment.luxuryapp/candidates`
Estado: `Vigente post-refactor V3`

## Estado actual

El frontend de `Candidates` opera en patron `process-first`.

- La fuente de verdad del pipeline es `CandidateProcess`.
- `CandidateApplication` queda solo como superficie legacy de compatibilidad; no debe recibir trabajo nuevo.
- La UI de entrevistas y decision ya no escribe a `CandidateInterviewFeedback`.
- Los motivos de rechazo se consumen desde el hub de enums via `EnumSelectService`.

## Rutas activas

- `recruitment/candidates/candidates`
- `recruitment/candidates/applications`
- `recruitment/candidates/interviews`
- `recruitment/candidates/recruitment-agenda`

## Submodulos activos

- `candidates/`
  - ficha del candidato
  - captura pre-alta
  - fuente de reclutamiento heredada en detalle y formularios
- `candidate-applications/`
  - compatibilidad visual con bandejas existentes
  - apertura de detalle y modales ligados al proceso
- `candidate-interview/`
  - respuestas del entrevistador
  - formularios process-first
  - pendientes de entrevista
- `candidate-interviewer-queue/`
  - cola operativa de entrevistas
- `candidate-recruitment-interviews/`
  - agenda y listado de entrevistas
- `recruitment-shared/`
  - CV upload reutilizable
  - badges y helpers del feature

## Endpoints consumidos

Fuente de verdad:

- `src/app/core/constants/endpoints/reclutamiento.endpoints.ts`

Endpoints activos del refactor:

- `recruitment-candidates`
- `recruitment-candidate-processes`
- `recruitment-candidate-processes/interviewer-action`
- `recruitment-candidate-processes/{id}/schedule`
- `recruitment-candidate-processes/{id}/process-hiring`
- `recruitment-candidate-processes/{applicationId}/hiring-documents`
- `recruitment-candidate-processes/{documentId}/validate`
- `recruitment-candidate-applications`
  - solo compatibilidad de pantallas o navegacion heredada

No se debe introducir trabajo nuevo en:

- `recruitment-candidate-interviews/feedback`
- catalogos locales de `CandidateDecisionReason`

## Pipeline vigente

Fuente de verdad:

- `CandidateProcessStage`

Etapas vigentes del refactor:

1. `Nuevo`
2. `EntrevistaReclutamiento`
3. `EntrevistaOperaciones`
4. `NoSePresento`
5. `Rechazado`
6. `Seleccionado`
7. `AltaEnProceso`
8. `Contratado`

Reglas importantes:

- No se conserva un pipeline de 10 etapas en frontend.
- Cuando se cierra una vacante, los procesos abiertos se cierran en cascada sin cambiar `CurrentStage`.

## Flujo funcional vigente

### Candidato

1. Crear o editar candidato.
2. Capturar `RecruitmentSource` desde el hub.
3. Consultar detalle y CV del candidato.

### Proceso

1. Crear proceso sobre vacante.
2. Agendar entrevista.
3. Registrar decision con `interviewerAction`.
4. Avanzar a `Seleccionado`, `Rechazado`, `NoSePresento` o `AltaEnProceso`.

### Alta

1. Abrir `candidate-process-hiring-modal`.
2. Capturar datos del alta orquestada.
3. Ejecutar las dos llamadas de `ProcessHiringAsync` hasta `Contratado`.

### Documentacion de contratacion

1. Subir documentos al expediente del empleado.
2. Listarlos y validarlos desde el modal correspondiente.
3. Mantener el CV en el candidato; no se mueve al expediente del empleado.

## Convenciones vigentes

- Componentes standalone + `ChangeDetectionStrategy.OnPush`.
- Estado con `signal()` y `computed()`.
- Selectores de enums desde `EnumSelectService`.
- Tipos en `interfaces/`, un DTO o interfaz por archivo.
- Sin `CandidateDecisionReasonSelect`.
- Sin listas hardcodeadas para enums del dominio.

## Archivos relacionados

- `docs/decisiones.md`
- `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/README.md`
- `docs/plans/20260815-candidates-refactor-v3-plan.md`
