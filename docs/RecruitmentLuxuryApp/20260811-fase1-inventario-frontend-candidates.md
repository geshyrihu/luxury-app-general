# Fase 1 - Inventario Frontend Candidates

Fecha: 2026-08-11
Estado: Cerrado
Alcance auditado: `client/angular/src/app/modules/recruitment.luxuryapp/candidates`

---

## Objetivo

Dejar documentado el estado real del frontend de Candidates antes de seguir con
la migracion visual y funcional hacia el modelo nuevo de `CandidateProcess`.

---

## Hallazgos ejecutivos

1. El frontend actual sigue organizado alrededor de `CandidateApplication`,
   aunque el backend ya empezo a migrar a `CandidateProcess`.
2. Existen rutas nuevas de valor operativo, pero varias todavia consumen
   endpoints legacy o mixtos.
3. La documentacion viva del modulo ya no representa el mapa real de rutas ni
   la arquitectura actual del frontend.
4. Hoy ya existe separacion parcial entre vistas de Reclutamiento y
   Entrevistador, pero todavia no es total a nivel de servicios, labels y
   deep links.
5. El primer frente de riesgo no es visual sino de contrato:
   varias pantallas siguen llamando `CandidateApplications.*`.

---

## Rutas reales activas

Fuente de verdad auditada:
`D:\repos\luxuryapp-api\client\angular\src\app\apps\reclutamiento.luxuryapp\candidates\candidates.routing.ts`

| Ruta                                                               | Componente                        | Rol dominante | Estado actual                                  |
| ------------------------------------------------------------------ | --------------------------------- | ------------- | ---------------------------------------------- |
| `/recruitment/candidates/candidates`                               | `CandidateList`                   | Reclutamiento | Vigente                                        |
| `/recruitment/candidates/applications`                             | `CandidateApplicationList`        | Reclutamiento | Legacy funcional                               |
| `/recruitment/candidates/interviews`                               | `CandidateInterviewPendingList`   | Entrevistador | Mixto                                          |
| `/recruitment/candidates/interviews/respond`                       | `CandidateInterviewResponse`      | Entrevistador | Vigente, depende de legacy para acciones       |
| `/recruitment/candidates/interviewer-queue`                        | `CandidateInterviewerQueue`       | Entrevistador | Legacy funcional                               |
| `/recruitment/candidates/recruitment-agenda`                       | `RecruitmentAgendaList`           | Reclutamiento | Legacy funcional                               |
| `/recruitment/candidates/work-position/:workPositionId/candidates` | `CandidateWorkPositionCandidates` | Reclutamiento | Buena direccion UX, fuente de datos incorrecta |
| `/recruitment/candidates/kpis`                                     | `CandidateApplicationKpis`        | Reclutamiento | Legacy funcional                               |
| `/recruitment/candidates/recruitment-interviews`                   | `CandidateRecruitmentInterviews`  | Reclutamiento | Mixto                                          |

---

## Clasificacion por rol

### Exclusivo de Reclutamiento

- `CandidateList`
- `CandidateDetail`
- `CandidateForm`
- `CandidateApplicationList`
- `CandidateApplicationForm`
- `CandidateApplicationKpis`
- `CandidateProcessHiringModal`
- `CandidateStageChangeModal`
- `RecruitmentAgendaList`
- `CandidateRecruitmentInterviews`
- `CandidateRecruitmentScheduleModal`
- `CandidateWorkPositionCandidates`

### Exclusivo de Entrevistador

- `CandidateInterviewPendingList`
- `CandidateInterviewResponse`
- `CandidateInterviewerQueue`

### Shared interno valido

- `CandidateCvUpload`
- `CandidateDecisionReasonSelect`
- `CandidateStageBadge`
- `CandidateStageTimeline`
- `MappedPTag`

Nota:
los shared internos aun son validos mientras no mezclen reglas de negocio entre
roles. El riesgo principal no esta ahi, sino en los servicios y endpoints.

---

## Matriz de servicios y contratos

### Limpios o cercanos a limpio

| Archivo                                                  | Estado               | Comentario                                            |
| -------------------------------------------------------- | -------------------- | ----------------------------------------------------- |
| `candidates/candidate-list.ts`                           | Sano                 | Consume `Candidates.list`                             |
| `candidates/candidate-form.ts`                           | Sano con deuda menor | Consume `Candidates.*` y `CandidateWorkExperiences.*` |
| `recruitment-shared/candidate-decision-reason-select.ts` | Sano                 | Consume `CandidateDecisionReasons.catalog`            |

### Mixtos

| Archivo                                                                        | Estado | Comentario                                                                                                               |
| ------------------------------------------------------------------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------ |
| `candidate-recruitment-interviews/candidate-recruitment-interviews.service.ts` | Mixto  | Lee board y scheduling desde `CandidateApplications.*`, pero crear/reagendar/cancelar cita desde `CandidateInterviews.*` |
| `candidate-work-position-candidates/candidate-work-position-candidates.ts`     | Mixto  | UX nueva correcta, pero obtiene board desde servicio mixto                                                               |
| `candidate-interview/candidate-interview-response.ts`                          | Mixto  | Vista exclusiva del entrevistador, pero ejecuta accion contra `CandidateApplications.interviewerAction`                  |

### Legacy funcional

| Archivo                                                              | Estado           | Comentario                                                                                           |
| -------------------------------------------------------------------- | ---------------- | ---------------------------------------------------------------------------------------------------- |
| `candidate-applications/candidate-application-list.ts`               | Legacy           | Bandeja centrada en postulacion                                                                      |
| `candidate-applications/candidate-application-form.ts`               | Legacy expandido | Ya permite crear candidato + CV + experiencias, pero sigue escribiendo sobre `CandidateApplications` |
| `candidate-applications/candidate-stage-change-modal.ts`             | Legacy           | Cambio de etapa sobre `CandidateApplications.changeStage`                                            |
| `candidate-applications/candidate-process-hiring-modal.ts`           | Legacy           | Contrata desde `CandidateApplications.processHiring`                                                 |
| `candidate-interview/candidate-interview-pending-list.ts`            | Legacy           | Lista por etapa desde `CandidateApplications.listByStage`                                            |
| `candidate-interviewer-queue/candidate-interviewer-queue.service.ts` | Legacy           | Cola y acciones del entrevistador sobre `CandidateApplications.*`                                    |
| `recruitment-agenda-list.ts`                                         | Legacy           | Agenda de reclutamiento desde `CandidateApplications.recruitmentAgenda`                              |
| `candidate-applications/candidate-application-kpis.ts`               | Legacy           | KPIs y automatizacion sobre `CandidateApplications.*`                                                |

---

## Endpoints front hoy en uso

Fuente auditada:
`D:\repos\luxuryapp-api\client\angular\src\app\core\constants\endpoints\reclutamiento.endpoints.ts`

### Dominio Candidate limpio

- `Candidates.*`
- `CandidateWorkExperiences.*`
- `CandidateDecisionReasons.*`

### Dominio CandidateInterview nuevo

- `CandidateInterviews.create`
- `CandidateInterviews.byApplication`
- `CandidateInterviews.byApplicationNew`
- `CandidateInterviews.byWorkPosition`
- `CandidateInterviews.byInterviewer`
- `CandidateInterviews.reschedule`
- `CandidateInterviews.confirm`
- `CandidateInterviews.cancel`
- `CandidateInterviews.close`
- `CandidateInterviews.submitFeedback`

### Dominio legacy que todavia domina el frontend

- `CandidateApplications.list`
- `CandidateApplications.listByStage`
- `CandidateApplications.getById`
- `CandidateApplications.create`
- `CandidateApplications.update`
- `CandidateApplications.changeStage`
- `CandidateApplications.registerDecision`
- `CandidateApplications.uploadCv`
- `CandidateApplications.processHiring`
- `CandidateApplications.recruitmentAgenda`
- `CandidateApplications.recruitmentInterviewBoard`
- `CandidateApplications.recruitmentSchedule`
- `CandidateApplications.cancelRecruitmentSchedule`
- `CandidateApplications.kpis`
- `CandidateApplications.runAutomation`
- `CandidateApplications.interviewerView`
- `CandidateApplications.interviewerQueue`
- `CandidateApplications.interviewerAction`

Conclusion:
la mayor parte del frontend operativo aun depende de `CandidateApplications`.

---

## Documentacion desactualizada

### Archivos auditados

- `D:\repos\luxuryapp-api\client\angular\src\app\apps\reclutamiento.luxuryapp\candidates\docs\README.md`
- `D:\repos\luxuryapp-api\client\angular\src\app\apps\reclutamiento.luxuryapp\candidates\docs\setup.md`

### Diferencias detectadas

1. Ambos documentos siguen diciendo que solo existen tres rutas principales.
2. No reflejan las rutas:
   - `interviewer-queue`
   - `recruitment-agenda`
   - `work-position/:workPositionId/candidates`
   - `kpis`
   - `recruitment-interviews`
   - `interviews/respond`
3. Siguen describiendo el modulo desde la perspectiva de `CandidateApplication`
   como centro del flujo.

Decision:
estos documentos deben actualizarse despues de cerrar el corte funcional y no
antes, para no congelar otra vez una fotografia intermedia.

---

## Formularios y labels que ya no representan bien el modelo

### Riesgos claros

- Uso persistente del termino `postulacion` en flujos que ya operan como
  proceso + entrevista.
- Formularios de vacante que aun abren acciones nombradas como
  `Postular candidato`.
- Vista de trabajo por puesto que aterriza todavia al detalle de
  `applications`.
- Entrevistador ejecutando acciones sobre endpoints legacy aunque ya tenga
  componente exclusivo.

### Campos a revisar o retirar en fases siguientes

- `applicationDate`
- `recruitmentInterviewAt`
- labels visibles de `postulacion`
- campos visuales que sigan sugiriendo que el CV vive en la postulacion

---

## Lista exacta de pantallas a migrar

### Migracion prioritaria alta

1. `candidate-applications/candidate-application-form.ts`
2. `candidate-recruitment-interviews/candidate-recruitment-interviews.service.ts`
3. `recruitment-agenda-list.ts`
4. `candidate-work-position-candidates/candidate-work-position-candidates.ts`
5. `candidate-interviewer-queue/candidate-interviewer-queue.service.ts`
6. `candidate-interview/candidate-interview-pending-list.ts`

### Migracion prioritaria media

1. `candidate-applications/candidate-application-list.ts`
2. `candidate-applications/candidate-stage-change-modal.ts`
3. `candidate-applications/candidate-process-hiring-modal.ts`
4. `candidate-applications/candidate-application-kpis.ts`

---

## Lista exacta de pantallas que se mantienen

- `candidates/candidate-list.ts`
- `candidates/candidate-form.ts`
- `candidates/candidate-detail.ts`
- shared internos de CV, badges, timeline y razones

Estas pantallas se mantienen, pero deben consumir el flujo nuevo cuando
disparen proceso/entrevista.

---

## Lista exacta de rutas que quedan solo por compatibilidad temporal

- `/recruitment/candidates/applications`
- `/recruitment/candidates/interviews`

Nota:
no significa borrarlas hoy. Significa que ya no deben ser el centro del flujo
de negocio una vez cierren las fases de migracion visual.

---

## Recomendacion de siguiente ejecucion

### Fase 2 recomendada

Atacar primero el flujo principal desde Vacantes:

1. vacante -> seleccionar o crear candidato
2. cargar CV maestro del candidato
3. agendar entrevista en el mismo flujo
4. dejar de exponer lenguaje de `postulacion`

### Justificacion

Ese flujo es hoy el punto de entrada real del usuario y el que mas confunde la
logica de entidades.

---

## Cierre de Fase 1

Se considera cerrada porque ya existe:

- mapa real de rutas
- clasificacion por rol
- clasificacion por servicio
- lista exacta de pantallas a migrar
- lista exacta de pantallas a conservar
- lista exacta de rutas temporales legacy
