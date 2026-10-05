# Candidates Frontend Decision Guide

Ultima revision: `2026-08-16`
Uso: decisiones de ubicacion y mantenimiento post-refactor V3

## Regla base

Antes de cambiar el frontend, confirmar si el cambio pertenece a:

- `candidate`
- `candidate-process`
- `candidate-interview`
- `recruitment-shared`

La regla de cierre es simple:

- si afecta decision, agenda, reprogramacion, alta o documentos, cae en flujo `process-first`
- si solo afecta ficha del candidato, cae en `candidates/`
- si es reutilizable dentro del feature, cae en `recruitment-shared/`

## Decisiones vigentes

### D1. Fuente de verdad del pipeline

La fuente de verdad del flujo es `CandidateProcess`.

Implicaciones:

- nuevas decisiones usan `interviewerAction`
- las pantallas no deben volver a escribir a `CandidateInterviewFeedback`
- `CandidateApplicationId` queda solo como compatibilidad de salida cuando haga falta

### D2. Motivos de rechazo

Los motivos de rechazo se consumen desde el hub central via `EnumSelectService`.

Implicaciones:

- no usar `CandidateDecisionReasonSelect`
- no usar catalogos locales cargados por endpoint propio
- no crear wrappers de catalogo legacy

### D3. Feedback de entrevista

El formulario de retroalimentacion ya no captura `interviewAt`.

Implicaciones:

- la fecha de entrevista vive en agenda y entrevistas programadas
- `receptionConfirmedAt` viaja como confirmacion de recepcion del proceso
- `decision`, `decisionReason` y `additionalComment` se envian al proceso

### D4. Alta de empleado

El alta es orquestada y atomica.

Implicaciones:

- el modal de alta captura datos personales, direccion, contacto, salud, banco y turno
- `RecruitmentSource` se hereda del candidato; no se edita en el alta
- la segunda llamada de `ProcessHiringAsync` consolida `Contratado`

### D5. Documentacion de contratacion

Los documentos de contratacion viven en el expediente del empleado.

Implicaciones:

- usar `RecruitmentDocumentType` del hub
- reutilizar `candidate-cv-upload` para la carga
- el CV permanece en el candidato

### D6. Pipeline de etapas

El pipeline vigente tiene 8 etapas.

Implicaciones:

- no documentar 10 etapas
- no reintroducir stages legacy
- no asumir que `CurrentStage` cambia cuando la vacante se cierra en cascada

### D7. Compatibilidad legacy

Se conservan algunas superficies legacy por compatibilidad temporal.

Implicaciones:

- no agregar features nuevas a `CandidateApplication`
- no reactivar `CandidateInterviewFeedback`
- si una pantalla vieja sigue leyendo contratos de compatibilidad, documentarlo antes de tocarlo

## Guia rapida de ubicacion

### Cambio visual

- ficha o listado de candidato: `candidates/`
- decision, pendientes o cola de entrevistas: `candidate-interview/` o `candidate-interviewer-queue/`
- agenda: `candidate-recruitment-interviews/` o `recruitment-agenda-list.*`
- helper reutilizable interno: `recruitment-shared/`

### Cambio de formulario

- candidato: `candidates/candidate-form.*`
- decision o feedback: `candidate-interview/*response*` o `*feedback-form*`
- alta: `candidate-applications/candidate-process-hiring-modal.*`
- documentos: modal de hiring documents

### Cambio de contrato

- tipos locales en `interfaces/`
- enums siempre via hub
- no crear arrays locales para decisiones, fuentes o turnos

## Reglas que no se deben romper

- no reintroducir escrituras a `CandidateInterviewFeedback`
- no volver al catalogo legacy `CandidateDecisionReason`
- no mover el CV al expediente del empleado
- no crear endpoints o enums duplicados si el hub ya existe
- no documentar rutas o servicios que ya no representan el flujo vigente

## Referencias

- `docs/README.md`
- `docs/plans/20260815-candidates-refactor-v3-plan.md`
- `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/README.md`
