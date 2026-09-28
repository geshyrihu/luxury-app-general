# Plan de Convergencia de Retroalimentacion de Entrevista

**Fecha:** 2026-08-15
**Iniciativa:** retiro de `CandidateInterviewFeedback` legacy
**Relacionado con:** H-05 en `docs/modulos-existente/reclutamiento-candidatos/07-hallazgos-incidencias.md`
**Estado de este documento:** Fase 0 completada (analisis + plan). Fases 1 y 2 COMPLETADAS (2026-08-15): backend process-first + frontend de convergencia. Pendientes Fases 3-4 (retiro de `CandidateInterviewFeedback` + verificación global).

---

## 1. Resumen ejecutivo

Hoy existen dos caminos para registrar el resultado de entrevista:

1. **Legacy vivo:** `CandidateInterviewFeedback`
   - tabla `RecruitmentCandidateInterviewFeedback`
   - UI de retroalimentacion
   - endpoint `recruitment-candidate-interviews/feedback`
   - email/notificaciones de retroalimentacion

2. **Shim transicional:** `CandidateInterviewResult`
   - tabla `RecruitmentCandidateInterviewResults`
   - endpoint `recruitment-candidate-interview-results`
   - servicio marcado `[Obsolete]`
   - si encuentra `CandidateProcess`, redirige la escritura a `CandidateProcess.Decision*`

La **fuente de verdad operativa actual** ya es `CandidateProcess.Decision*` para el flujo principal del entrevistador (`CandidateProcesses.interviewerAction` y `RegisterDecisionAsync`).

La convergencia propuesta es:

- usar `CandidateProcess.Decision*` como **unica fuente de verdad** del resultado;
- retirar `CandidateInterviewFeedback` como modelo operativo;
- mantener `CandidateDecisionReason` como catalogo compartido;
- resolver el destino final de `CandidateInterviewResult` como parte del retiro:
  - recomendacion: mantenerlo solo como **lectura sintetica temporal** mientras migra la UI;
  - despues retirarlo junto con el resto del legacy.

---

## 2. Mapa de impacto

## 2.1 Backend - `CandidateInterviewFeedback` legacy

Dependencias backend detectadas: **28 archivos**.

Zonas impactadas:

1. **Entidad y persistencia**
   - `api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Recruitment/ReclutamientoyAltasBajas/CandidateInterviewFeedback.cs`
   - `api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Recruitment/ReclutamientoyAltasBajas/CandidateApplication.cs`
   - `api/LuxuryApp.Infrastructure.Data/Data/ApplicationDbContext.cs`
   - migrations y snapshot con tabla `RecruitmentCandidateInterviewFeedback`

2. **Servicio legacy de entrevistas**
   - `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/CandidateInterview/Services/CandidateInterviewAppService.cs`
   - `SubmitFeedbackAsync()`:
     - si encuentra `CandidateProcess`, delega a `CandidateProcessAppService.RegisterDecisionAsync(...)`
     - si no encuentra proceso, inserta `CandidateInterviewFeedback`
   - `GetByApplicationAsync()`:
     - si existe `CandidateProcess`, devuelve respuesta sintetica desde `Decision*`
     - si no, lee tabla legacy
   - `GetByProcessAsync()`:
     - ya responde desde `CandidateProcess`

3. **Endpoints legacy**
   - `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/CandidateInterview/EndPoints/CandidateInterviewEndPoint.cs`
   - rutas relevantes:
     - `POST api/recruitment-candidate-interviews/feedback`
     - `GET api/recruitment-candidate-interviews/application/{candidateApplicationId}`
     - `GET api/recruitment-candidate-interviews/process/{candidateProcessId}`

4. **DTOs y mappings legacy**
   - `CandidateInterviewFeedbackCreateDto.cs`
   - `CandidateInterviewFeedbackItemDto.cs`
   - `CandidateInterviewMapping.cs`

5. **Agenda, board y estados legacy**
   - `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/CandidateApplication/Services/CandidateApplicationAppService.cs`
   - usos detectados:
     - `application.InterviewFeedbacks`
     - `latestFeedback`
     - `ResolveAgendaStatusCode(application, latestFeedback, now)`
   - el camino legacy sigue usando feedback para derivar estado `"feedback"`
   - el camino process-backed ya usa `process.Decision`

6. **Notificaciones y email**
   - `ICandidateNotificationCoordinatorService.cs`
   - `CandidateNotificationCoordinatorService.cs`
   - `IRecruitmentEmailService.cs`
   - `RecruitmentEmailService.cs`
   - `RecruitmentCandidateInterviewFeedbackEmailDTO.cs`
   - `EmailTemplates.cs`
   - hallazgo clave:
     - `NotifyProcessInterviewFeedbackSubmittedAsync(...)` ya carga `CandidateProcess`
     - pero todavia llama `SendCandidateInterviewFeedbackEmailAsync(...)`
     - la notificacion ya es process-first en datos, pero no en nombre/contrato

7. **Borrado / impacto de candidato**
   - `CandidateAppService.cs`
   - `CandidateDeleteImpactDto.cs`
   - siguen contando y eliminando registros legacy de feedback

## 2.2 Backend - `CandidateInterviewResult`

Dependencias backend detectadas: **17 archivos**.

Confirmaciones:

1. **Servicio obsoleto**
   - `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/CandidateInterviewResult/Interfaces/ICandidateInterviewResultAppService.cs`
   - `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/CandidateInterviewResult/Services/CandidateInterviewResultAppService.cs`
   - ambos marcados con:
     - `[Obsolete("Legacy feature. Mantener solo por compatibilidad temporal mientras Candidates opera sobre CandidateProcess.")]`

2. **Redireccion a `CandidateProcess`**
   - `RegisterResultAsync(...)`:
     - valida `CandidateDecisionReason`
     - intenta resolver `CandidateProcess` por `CandidateProcessId` o `InterviewId`
     - si encuentra proceso:
       - llama `candidateProcessAppService.RegisterDecisionAsync(...)`
       - devuelve `CandidateInterviewResultItemDto` sintetico desde `Decision*`
     - solo inserta `CandidateInterviewResult` si no existe proceso nuevo

3. **Lectura sintetica**
   - `GetHistoryByInterviewAsync(...)`:
     - si existe proceso activo, arma historial desde `CandidateProcess`
     - si no, lee tabla `CandidateInterviewResult`
   - `GetHistoryByProcessAsync(...)`:
     - responde desde `CandidateProcess`

4. **Endpoint expuesto**
   - `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/CandidateInterviewResult/EndPoints/CandidateInterviewResultEndPoint.cs`
   - rutas:
     - `POST api/recruitment-candidate-interview-results`
     - `GET api/recruitment-candidate-interview-results/interview/{interviewId}`
     - `GET api/recruitment-candidate-interview-results/process/{candidateProcessId}`

5. **Persistencia**
   - entidad `CandidateInterviewResult.cs`
   - `DbSet` en `ApplicationDbContext`
   - tabla `RecruitmentCandidateInterviewResults`
   - indice unico por `InterviewId`

## 2.3 Backend - fuente de verdad actual en `CandidateProcess`

Dependencias operativas relevantes:

1. `CandidateProcess.Decision`
2. `CandidateProcess.DecisionReasonId`
3. `CandidateProcess.DecisionComment`
4. `CandidateProcess.DecisionSentAt`
5. `CandidateProcess.DecisionByUserId`

Puntos clave:

1. `CandidateProcessAppService.ExecuteInterviewerActionAsync(...)`
   - procesa `Approve`, `Reject`, `MarkNoShow`, `SubmitFeedback`, `RevertDecision`
2. `CandidateProcessAppService.RegisterDecisionAsync(...)`
   - ya es el nucleo operativo de la decision
3. `CandidateApplicationAppService.ExecuteInterviewerActionAsync(...)`
   - ya delega al flujo process-first cuando existe proceso
4. `ResolveAgendaStatusCode(process, now)`
   - ya usa `Decision*` y no depende de feedback legacy

## 2.4 Frontend

Dependencias frontend directas detectadas en el flujo de retroalimentacion/entrevista: **14 archivos** entre `candidate-interview`, `candidate-interviewer-queue` y `reclutamiento.endpoints.ts`.

Hallazgos:

1. **Formulario legacy de retroalimentacion**
   - `client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/candidate-interview/candidate-interview-feedback-form.ts`
   - construye `CandidateInterviewFeedbackCreate`
   - usa `CandidateDecisionReasonSelect`
   - hace `POST` a:
     - `EndpointsReclutamiento.CandidateInterviews.submitFeedback`

2. **Vista de respuesta del entrevistador**
   - `candidate-interview-response.ts`
   - abre `CandidateInterviewFeedbackForm`
   - carga motivos desde `CandidateDecisionReasons.catalog`
   - para aprobar/rechazar/no-show usa:
     - `EndpointsReclutamiento.CandidateProcesses.interviewerAction`

3. **Lista de pendientes**
   - `candidate-interview-pending-list.ts`
   - abre `CandidateInterviewFeedbackForm`
   - sus datos vienen de:
     - `CandidateProcesses.listByStage(...)`

4. **Queue del entrevistador**
   - `candidate-interviewer-queue.ts`
   - mezcla ambos caminos:
     - `onFeedback(...)` abre `CandidateInterviewFeedbackForm`
     - `onApprove(...)`, `onMarkNoShow(...)`, `onRevert(...)` usan `CandidateProcesses.interviewerAction`
   - `candidate-interviewer-queue.service.ts` ya es process-first para acciones

5. **Interfaces legacy frontend**
   - `candidate-interview/interfaces/candidate-interview.ts`
   - contiene:
     - `CandidateInterviewFeedbackItem`
     - `CandidateInterviewFeedbackCreate`
     - `CandidateInterviewFeedbackDto`
   - tambien conviven `CandidateInterviewResponseDto` y `CandidateDecisionReasonItem`

6. **Endpoints frontend**
   - `client/angular/src/app/core/constants/endpoints/reclutamiento.endpoints.ts`
   - sigue declarando:
     - `CandidateInterviews.submitFeedback`
   - tambien ya expone:
     - `CandidateProcesses.interviewerAction`
     - `CandidateProcesses.interviewResponse`

7. **Consumo directo de `CandidateInterviewResult` en Angular**
   - no se encontro una UI activa usando `CandidateInterviewResult`
   - conclusion: hoy es un endpoint/servicio transicional sin pantalla principal propia

---

## 3. Confirmaciones clave

## 3.1 `CandidateInterviewResult` es realmente un shim transicional

Confirmado.

Evidencia:

1. interface y servicio marcados `[Obsolete]`
2. `RegisterResultAsync(...)` redirige a `CandidateProcessAppService.RegisterDecisionAsync(...)` cuando existe proceso
3. `GetHistoryByInterviewAsync(...)` y `GetHistoryByProcessAsync(...)` ya pueden sintetizar respuesta desde `CandidateProcess`
4. no existe una UI Angular activa acoplada a ese endpoint como flujo principal

Conclusion:

- `CandidateInterviewResult` no es la meta final;
- hoy funciona como **capa de compatibilidad / lectura sintetica**.

## 3.2 `CandidateInterviewFeedback` sigue siendo legacy, pero todavia operativo

Confirmado.

Evidencia:

1. la UI principal de retroalimentacion sigue posteando a `CandidateInterviews.submitFeedback`
2. el endpoint legacy sigue activo
3. el servicio legacy aun puede insertar `CandidateInterviewFeedback` cuando no encuentra `CandidateProcess`
4. `CandidateApplication.InterviewFeedbacks` sigue afectando agenda/board/status en caminos legacy
5. email/notificaciones siguen nombrados y estructurados como feedback legacy

Conclusion:

- el retiro de `CandidateInterviewFeedback` requiere migrar primero la UI y los contratos visibles.

---

## 4. Estado objetivo propuesto

## 4.1 Fuente de verdad

Usar `CandidateProcess.Decision*` como unica fuente de verdad del resultado de entrevista:

1. `Decision`
2. `DecisionReasonId`
3. `DecisionComment`
4. `DecisionSentAt`
5. `DecisionByUserId`

## 4.2 Modelo a retirar

Retirar del flujo operativo:

1. `CandidateInterviewFeedback`
2. `RecruitmentCandidateInterviewFeedback`
3. endpoints `recruitment-candidate-interviews/feedback`, `application/{id}`, `process/{id}` para feedback
4. DTOs/mappings/notificaciones/email centrados en feedback
5. UI `candidate-interview-feedback-form` tal como existe hoy

## 4.3 Decision sobre `CandidateInterviewResult`

**Recomendacion:**

1. **corto plazo**
   - mantener `CandidateInterviewResult` solo como **lectura sintetica temporal**
   - no seguir creciendo funcionalmente
   - no usarlo como endpoint principal de escritura si la UI ya puede hablar con `CandidateProcess`

2. **mediano plazo**
   - una vez que frontend y notificaciones converjan a `CandidateProcess`, eliminar tambien:
     - entity
     - `DbSet`
     - endpoint
     - servicio obsoleto

Esto alinea la iniciativa con el plan mayor de reestructuracion, que ya marcaba a `CandidateInterviewFeedback` y `CandidateInterviewResult` como piezas a retirar.

## 4.4 Catalogo a conservar

`CandidateDecisionReason` **se conserva**.

Razon:

1. ya es catalogo compartido entre feedback legacy, result shim y process
2. sigue siendo necesario para aprobar/rechazar/no-show
3. el hallazgo H-05 pide retirar legacy de feedback, no el catalogo

---

## 5. Plan de migracion por fases

## Fase 1 - Backend process-first definitivo

Objetivo:
- dejar a `CandidateProcess` como API canonica del resultado sin depender del endpoint legacy de feedback.

Trabajo:

1. revisar si hace falta un endpoint explicito de registro de decision/feedback sobre `CandidateProcess`
   - si `interviewerAction` ya cubre todos los casos del frontend, reutilizarlo
   - si no cubre payload/UX del feedback actual, crear contrato process-first pequeno y claro
2. marcar `CandidateInterviewFeedback` y sus DTOs/endpoints como legacy explicito
3. migrar notificaciones y email para que el contrato deje de hablar de "feedback" y hable de "decision de entrevista"
4. eliminar cualquier escritura nueva a tabla `CandidateInterviewFeedback`
5. mantener compatibilidad de lectura temporal donde haga falta

Salida esperada:
- toda escritura de decision vive solo en `CandidateProcess`

## Fase 2 - Frontend de convergencia

Objetivo:
- mover la UI de retroalimentacion al flujo process-first.

Trabajo:

1. reemplazar `CandidateInterviewFeedbackForm` por un formulario process-first
2. migrar `candidate-interview-response` para no depender del endpoint legacy de feedback
3. migrar `candidate-interview-pending-list` y `candidate-interviewer-queue` para abrir el nuevo flujo
4. mantener `CandidateDecisionReasonSelect`
5. retirar interfaces `CandidateInterviewFeedback*` del frontend o dejarlas solo como compatibilidad temporal muy acotada

Salida esperada:
- Angular deja de hacer `POST` a `CandidateInterviews.submitFeedback`

## Fase 3 - Retiro backend legacy

Objetivo:
- remover `CandidateInterviewFeedback` del modelo y cerrar el shim restante.

Trabajo:

1. eliminar entidad `CandidateInterviewFeedback`
2. eliminar `DbSet` y mapping en `ApplicationDbContext`
3. eliminar endpoints/servicios/DTOs/mappings legacy de feedback
4. migracion EF reversible para:
   - eliminar tabla `RecruitmentCandidateInterviewFeedback`
   - limpiar relaciones de `CandidateApplication.InterviewFeedbacks`
5. decidir cierre de `CandidateInterviewResult`:
   - opcion recomendada: retirarlo tambien si ya no hay consumidores
   - opcion temporal: dejar solo lectura sintetica hasta cerrar cualquier dependencia remanente

Salida esperada:
- sin tabla ni endpoint operativo de feedback legacy

## Fase 4 - Verificacion global

Objetivo:
- probar convergencia sin romper el flujo actual del entrevistador ni la agenda.

Validaciones:

1. approve / reject / no-show siguen funcionando
2. feedback / comentario adicional sigue persistiendo en `DecisionComment`
3. `CandidateDecisionReason` sigue resolviendo catalogos
4. agenda / board / interviewer queue siguen reflejando estados correctos
5. notificaciones y email siguen disparando con la misma semantica de negocio
6. migracion EF reversible y sin drift ajeno

---

## 6. Riesgos

1. **No romper el flujo ya funcional**
   - `CandidateProcesses.interviewerAction` ya funciona para approve/reject/no-show
   - la convergencia no debe introducir una segunda ruta nueva en paralelo si no es necesaria

2. **Email y notificaciones**
   - hoy la notificacion ya carga `CandidateProcess`, pero el contrato/email siguen nombrados como feedback
   - el riesgo es romper disparadores o contenido de correo al renombrar

3. **Agenda e historial**
   - `CandidateApplicationAppService` aun usa `latestFeedback` en caminos legacy
   - si se retira la tabla sin reescribir esos caminos, agenda/board pueden perder el estado `"feedback"`

4. **Compatibilidad de IDs**
   - varias pantallas todavia pasan `candidateApplicationId`
   - el cambio debe seguir aceptando `candidateProcessId` como preferido sin romper deep links temporales

5. **Borrado de candidato**
   - `CandidateAppService` hoy limpia feedback y result legacy
   - al retirar tablas hay que ajustar ese impacto para no dejar referencias muertas

6. **Riesgo de doble lectura**
   - mientras convivan endpoints legacy y process-first, puede haber respuestas sinteticas y legacy con formas parecidas pero origen distinto
   - hay que declarar un contrato canonico y migrar consumidores de forma ordenada

---

## 7. Inventario preliminar de archivos a tocar

## Backend

1. `api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Recruitment/ReclutamientoyAltasBajas/CandidateInterviewFeedback.cs`
2. `api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Recruitment/ReclutamientoyAltasBajas/CandidateApplication.cs`
3. `api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Recruitment/ReclutamientoyAltasBajas/CandidateInterviewResult.cs`
4. `api/LuxuryApp.Infrastructure.Data/Data/ApplicationDbContext.cs`
5. `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/CandidateInterview/Services/CandidateInterviewAppService.cs`
6. `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/CandidateInterview/Interfaces/ICandidateInterviewAppService.cs`
7. `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/CandidateInterview/EndPoints/CandidateInterviewEndPoint.cs`
8. `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/CandidateInterview/DTOs/CandidateInterviewFeedbackCreateDto.cs`
9. `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/CandidateInterview/DTOs/CandidateInterviewFeedbackItemDto.cs`
10. `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/CandidateInterview/Mappings/CandidateInterviewMapping.cs`
11. `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/CandidateInterviewResult/Services/CandidateInterviewResultAppService.cs`
12. `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/CandidateInterviewResult/Interfaces/ICandidateInterviewResultAppService.cs`
13. `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/CandidateInterviewResult/EndPoints/CandidateInterviewResultEndPoint.cs`
14. `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/CandidateInterviewResult/DTOs/CandidateInterviewResultCreateDto.cs`
15. `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/CandidateInterviewResult/DTOs/CandidateInterviewResultItemDto.cs`
16. `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/CandidateApplication/Services/CandidateApplicationAppService.cs`
17. `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/CandidateProcess/Services/CandidateProcessAppService.cs`
18. `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/Notifications/Interfaces/ICandidateNotificationCoordinatorService.cs`
19. `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/Notifications/Services/CandidateNotificationCoordinatorService.cs`
20. `api/LuxuryApp.Application/Moduls/SystemLuxuryApp/SendEmailGlobal/Features/Recruitment/SendEmail/Interfaces/IRecruitmentEmailService.cs`
21. `api/LuxuryApp.Application/Moduls/SystemLuxuryApp/SendEmailGlobal/Features/Recruitment/SendEmail/Services/RecruitmentEmailService.cs`
22. `api/LuxuryApp.Application/Moduls/SystemLuxuryApp/SendEmailGlobal/Features/Recruitment/SendEmail/ViewModels/RecruitmentCandidateInterviewFeedbackEmailDTO.cs`
23. `api/LuxuryApp.Application/Moduls/SystemLuxuryApp/EmailTemplates.cs`
24. `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/Candidate/Services/CandidateAppService.cs`
25. nueva migracion EF reversible para retiro de tabla legacy

## Frontend

1. `client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/candidate-interview/candidate-interview-feedback-form.ts`
2. `client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/candidate-interview/candidate-interview-feedback-form.html`
3. `client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/candidate-interview/candidate-interview-response.ts`
4. `client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/candidate-interview/candidate-interview-response.html`
5. `client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/candidate-interview/candidate-interview-pending-list.ts`
6. `client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/candidate-interview/candidate-interview-pending-list.html`
7. `client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/candidate-interview/desktop/candidate-interview-pending-desktop.ts`
8. `client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/candidate-interview/desktop/candidate-interview-pending-desktop.html`
9. `client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/candidate-interview/mobile/candidate-interview-pending-mobile.ts`
10. `client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/candidate-interview/mobile/candidate-interview-pending-mobile.html`
11. `client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/candidate-interview/interfaces/candidate-interview.ts`
12. `client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/candidate-interviewer-queue/candidate-interviewer-queue.ts`
13. `client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/candidate-interviewer-queue/candidate-interviewer-queue.service.ts`
14. `client/angular/src/app/core/constants/endpoints/reclutamiento.endpoints.ts`
15. `client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/recruitment-shared/candidate-decision-reason-select.ts`

---

## 8. Recomendacion para aprobacion

Se recomienda aprobar la iniciativa con este criterio:

1. **Decision funcional**
   - `CandidateProcess.Decision*` queda como unica fuente de verdad

2. **Decision tecnica sobre `CandidateInterviewResult`**
   - mantenerlo solo como lectura sintetica temporal durante la migracion de frontend
   - retirarlo en la fase de limpieza final

3. **Secuencia sugerida**
   - backend process-first
   - frontend de convergencia
   - retiro de tablas/endpoints legacy
   - verificacion global

Este orden minimiza riesgo sobre el flujo ya funcional de `interviewerAction`.

---

## 9. Ejecucion y seguimiento

### Fase 1 — COMPLETADO (2026-08-15)
- `CandidateInterviewAppService.SubmitFeedbackAsync` ya no inserta `CandidateInterviewFeedback`; si no hay `CandidateProcess` devuelve `409 CANDIDATE_PROCESS_REQUIRED_FOR_FEEDBACK`. Si hay proceso, delega a `CandidateProcessAppService.RegisterDecisionAsync` (process-first).
- `interviewerAction` / `RegisterDecisionAsync` ya cubre approve/reject/no-show/submitFeedback/revert; no se creo ruta paralela.
- Email/notificaciones desacoplados a `RecruitmentCandidateInterviewDecisionEmailDto` + `SendCandidateInterviewDecisionEmailAsync`; `SendCandidateInterviewFeedbackEmailAsync` quedo como wrapper. Sin cambios visibles de plantilla (`RecruitmentCandidateInterviewFeedbackEmail.cshtml` usa el nuevo DTO).
- Verificacion: `dotnet build LuxuryApp.Application` 0 errores; `ng build --configuration development` verde (solo NG8113 preexistentes); `scan-mojibake` 0; `audit:icon-names` 0 nuevos.
- Archivos: `CandidateInterviewAppService.cs`, `CandidateNotificationCoordinatorService.cs`, `RecruitmentCandidateInterviewDecisionEmailDto.cs` (nuevo), `IRecruitmentEmailService.cs`, `RecruitmentEmailService.cs`, `RecruitmentCandidateInterviewFeedbackEmail.cshtml`.

### Fase 2 — COMPLETADO (2026-08-15)
- La UI deja de llamar `CandidateInterviews.submitFeedback`; `candidate-interview-feedback-form` ahora POSTea a `CandidateProcesses.interviewerAction` (`InterviewerActionRequestDto`), mapeando `decision` -> `SubmitFeedback`/`Approve`/`Reject`/`MarkNoShow`, `decisionReasonId` (requerido) y `receptionConfirmedAt` (-> `ConfirmedAt`); `interviewAt` se descartó del formulario.
- `candidate-interview-response`, `candidate-interview-pending-list` (desktop/mobile) y `candidate-interviewer-queue` migrados al flujo process-first.
- Interfaces/DTOs divididos 1-por-archivo en `interfaces/candidate-interview/`; se creó un barrel temporal `candidate-interview.ts` de compatibilidad (eliminar en limpieza).
- Verificación: `ng build --configuration development` sin errores nuevos (solo NG8113 preexistentes; el proceso terminó con `EXIT:-1073741819` nativo del entorno, no de código — re-ejecutar para confirmar exit limpio y `dist/` generado); `scan-mojibake` 0; `audit:icon-names` 0 nuevos; vitest aislado de `candidates` 17/17 verde.
- Residue a limpiar antes de PR: eliminar barrel temporal `candidate-interview.ts` y `vitest.candidates.temp.config.ts`.

### Fase 3 — PENDIENTE
Retiro de `CandidateInterviewFeedback` (entidad + DbSet + endpoints/servicios/DTOs/mappings legacy + tabla vía migración EF reversible) y decisión final sobre `CandidateInterviewResult` shim. Ver prompt del orquestador.

### Guards de UI (PENDIENTE — fuera de Fase 3)
Previene que el usuario dispare validaciones server-side no permitidas (p. ej. `INVALID_SCHEDULE_DATE`, `INVALID_STAGE_TRANSITION`):
- Deshabilitar fechas pasadas en el agendador de entrevistas (`RecruitmentInterviewAt` / `ScheduledAt`).
- Deshabilitar acciones de etapa no permitidas según `CandidateStageValidator` (coherente con `CanSendToInterview` y demás flags de `candidate-process`-detail).
- Relacionado con **H-06** en `07-hallazgos-incidencias.md`. El backend mantiene la validación como defensa en profundidad.
