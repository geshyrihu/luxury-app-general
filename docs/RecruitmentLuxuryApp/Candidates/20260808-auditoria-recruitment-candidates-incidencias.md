# Hallazgos e Incidencias — Reclutamiento Candidatos (R-01/R-02/R-03 + cierre)

**Fecha:** 2026-08-15
**Estado del módulo:** R-01, R-02, R-03 y Fases 4-5 COMPLETADOS. Listo para PR.
**Propósito:** registro de todo lo identificado durante implementación y pruebas, fuera y dentro del alcance R.

---

## H-01 (info) La migración EF agrupa R-01 + R-02 + R-03

- `AddEmployeeDocument` (`api/LuxuryApp.Infrastructure.Data/Data/Migrations/20260815123713_AddEmployeeDocument.cs`) contiene:
  - `RecruitmentCandidates.RecruitmentSource` → **R-01**
  - `StaffHiringRequests.CandidateId` (+ FK/índice) → **R-02**
  - `EmployeeDocuments` (+ índice único `EmployeeId`+`DocumentTypeId`) → **R-03**
- **Por qué:** esos cambios de modelo no se migraron al cerrar cada fase; se acumularon como pendientes. No es drift de otros módulos.
- Reversible (`Down` elimina tabla, columnas e índices). `Program.cs:211` (`MigrateAsync`) la aplica en startup.
- **Acción:** desplegar código + migración en el mismo PR.

---

## H-02 (deuda preexistente, FUERA de alcance R) Suite global `npm test` en rojo

- Regresiones observadas en módulos ajenos: `chart-wrapper.stories.ts`, `image-analysis-dialog.component.spec.ts`, y specs de `supplier`, `mantenimiento`, `operations`, `legal`, `admin`, `recursos-humanos`.
- No atribuibles a R-01/R-02/R-03 (nuestros cambios viven en `reclutamiento.luxuryapp/candidates` y `core/enum-select`, `core/endpoints`).
- **Acción:** seguimiento aparte; no bloquea el despliegue del alcance R (si el gate exige suite global 100% verde, queda bloqueado por deuda externa).

---

## H-03 (RESUELTO) `candidate-list-mobile.spec.ts` en rojo

- **Síntoma:** 6 falls, `No provider found for ActivatedRoute` en `CandidateListMobile`.
- **Causa:** el `TestBed` no proveía router; un componente de `@ui/mobile` (dependencia del árbol de imports) lo requiere. El componente, su spec y `@ui/mobile` no fueron tocados por R → deuda de test preexistente.
- **Fix (fuera de alcance R, estabilización):** se añadió `provideRouter([])` al `providers` del `TestBed` en
  `client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/candidate/mobile/candidate-list-mobile.spec.ts`.
- **Verificación:** vitest 6/6 verde. Carpeta `candidates/` queda 20/20.

---

## H-04 (RESUELTO) `INVALID_STAGE_TRANSITION` al crear/actualizar postulación con entrevista

- **Síntoma (log `data.txt`):** `Excepción no controlada: Transicion de etapa invalida: No se puede pasar de 'Nuevo' a 'EntrevistaReclutamiento'.`
  `BusinessException` (`INVALID_STAGE_TRANSITION`, 400).
- **Traza:** `CandidateProcessAppService.CreateFromFormAsync` (`.../CandidateProcess/Services/CandidateProcessAppService.cs:968`)
  → `ChangeStageAsync` (`:1114`/`:1126`) → `CandidateStageValidator.ValidateStageTransition` (`.../Candidates/Shared/Validators/CandidateStageValidator.cs:32`).
- **Causa:** al crear/actualizar una postulación **y** agendar entrevista (`RecruitmentInterviewAt` con valor), el proceso arranca en `Nuevo` (`CreateAsync`, `:918`) y el código intenta saltar en **un solo paso** a `EntrevistaReclutamiento`. El validador solo permite `Nuevo` → {`PreFiltro`, `Rechazado`, `NoSePresento`}; `EntrevistaReclutamiento` solo es válido desde `PreFiltro`/`EnEspera`.
- **Mismo bug en 2 métodos:** `CreateFromFormAsync:968` y `UpdateFromFormAsync:1037`.
- **Contradicción de diseño:** la UI expone "enviar a entrevista" desde `Nuevo` (`CanSendToInterview = CurrentStage is Nuevo`, `:1738`), pero el validador lo prohibía → el validador estaba desactualizado respecto a la intención del flujo.
- **Fix (hotfix, FUERA de alcance R):** se agregó `EntrevistaReclutamiento` a las transiciones permitidas desde `Nuevo` en
  `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/Shared/Validators/CandidateStageValidator.cs:13-14`.
  Al ser el validador compartido, resuelve ambos métodos (y cualquier `Nuevo`→`EntrevistaReclutamiento`, p.ej. `ScheduleAsync`).
- **Verificación:** `dotnet build LuxuryApp.Application` → 0 errores. (El build de la solución completa mostró MSB3021/MSB3027 por el `LuxuryApp.Api` corriendo; no son errores de compilación.)
- **Acción para probar:** detener/reiniciar el `LuxuryApp.Api` (libera lock de `bin/`) y reconstruir; reintentar "crear postulación + agendar entrevista".

---

## H-05 (análisis, FUERA de alcance R) Doble modelo en Retroalimentación de entrevista — desfase UI vs backend

- **Síntoma percibido:** la UI de "Retroalimentación de entrevista" sigue activa y el "motivo de decisión" sigue presente; el usuario sospechó falta de sincronización/actualización.
- **Hechos:**
  - El backend tiene **dos modelos paralelos** para el resultado de entrevista:
    - **Legacy** `CandidateInterviewFeedback` (tabla `RecruitmentCandidateInterviewFeedback`): aún totalmente cableado — `CandidateInterviewAppService.SubmitFeedbackAsync` / `GetByApplicationAsync` / `GetByProcessAsync`, mapeos, notificaciones y email (`SendCandidateInterviewFeedbackEmailAsync`).
    - **Nuevo** `CandidateInterviewResult` (tabla `RecruitmentCandidateInterviewResults`, índice único `InterviewId`): comentario explícito *"sustituye a CandidateInterviewFeedback"* (`api/.../CandidateInterviewResult.cs:5`); tiene `CandidateInterviewResultAppService` (`RegisterResultAsync`, `GetHistoryByInterviewAsync`, `GetHistoryByProcessAsync`) y `CandidateInterviewResultEndPoint`.
  - **Frontend:** `candidate-interview-feedback-form.ts` escribe al flujo **legacy** (`EndpointsReclutamiento.CandidateInterviews.submitFeedback` → `CandidateInterviewFeedbackCreate`). **No existe componente de UI para `CandidateInterviewResult`** (no hay referencia angular a `CandidateInterviewResult`). `candidate-interview-response.ts` usa endpoints legacy (`CandidateProcesses.interviewResponse`, `CandidateProcesses.interviewerAction`) y `CandidateDecisionReason` para aprobar/rechazar/no-show.
  - Documentado previamente: `docs/.../20260811-estructura-tablas-actual-candidates.md:451` marca *"Resultado de entrevista | CandidateInterviewFeedback | CandidateInterviewResult | doble modelo"*; `:459` indica que la migración a `CandidateInterview` + `CandidateInterviewResult` *"todavía no se completa el retiro de estructuras legacy"*.
- **Riesgo:** doble fuente de verdad; el feedback se escribe en la tabla legacy mientras el backend introdujo `CandidateInterviewResult` como nueva fuente → riesgo de datos divergentes y de que el retiro planeado deje la UI sin destino.
- **Alcance:** FUERA de R-01/R-02/R-03. Ya existe plan de reestructuración en `docs/modulos-nuevos/reestructuracion-reclutamiento-candidates/` y `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/Docs/20260811-plan-api-reestructuracion-candidates.md`.
- **Acción recomendada:** trackear como iniciativa aparte — migrar la UI de retroalimentación a `CandidateInterviewResult` y retirar `CandidateInterviewFeedback` / `CandidateDecisionReason` según el plan de migración existente. No plegarlo a R.

### H-05.1 Estado del "motivo de decisión" (`CandidateDecisionReason`)

- **No fue eliminado.** Su eliminación está explícitamente **FUERA de alcance** en `04-plan-implementacion.md:33` ("Eliminación de `CandidateInterviewFeedback` / `CandidateDecisionReason` (plan de migración aparte)").
- Sigue **requerido** en:
  - `candidate-interview-feedback-form.ts`: `decisionReasonId` con `Validators.required` (líneas 63-66).
  - `candidate-interview-response.ts`: `confirmAction` exige `reasonId` para `reject` / `markNoShow`.
- Por tanto, verlo presente en la retroalimentación es el comportamiento esperado, no un residual.

### H-05.2 Progreso de la convergencia (iniciativa aparte)
- **Fase 1 COMPLETADA (2026-08-15):** backend process-first; `SubmitFeedbackAsync` ya no inserta `CandidateInterviewFeedback` (devuelve `409` si no hay proceso); email/notificaciones desacoplados a `CandidateProcess` (`SendCandidateInterviewDecisionEmailAsync`); `SendCandidateInterviewFeedbackEmailAsync` quedó como wrapper. Detalle en `08-plan-convergencia-retroalimentacion.md` §9.
- **Fase 2 PENDIENTE:** migrar la UI (`candidate-interview-feedback-form`, `candidate-interview-response`, `candidate-interview-pending-list`, `candidate-interviewer-queue`) para dejar de llamar `CandidateInterviews.submitFeedback`; resolver destino de `receptionConfirmedAt`/`interviewAt`.
- **Fases 3-4 PENDIENTES:** retiro de `CandidateInterviewFeedback` (entidad + DbSet + tabla + migración EF) y verificación global.

### H-06 (observación, FUERA de alcance de R y de la convergencia) Error "No se puede agendar una entrevista en el pasado"
- **Síntoma (log 2026-08-15 11:27):** `BusinessException INVALID_SCHEDULE_DATE` — "No se puede agendar una entrevista en el pasado".
- **Traza:** `CandidateProcessAppService.CreateFromFormAsync` (`.../CandidateProcess/Services/CandidateProcessAppService.cs:955`) → `CreateAsync` (:900) → `EnsureInterviewSchedulingAllowedAsync` (:2083).
- **Causa:** la guarda rechaza `ScheduledAt` (i.e. `RecruitmentInterviewAt`) cuando es >5 min anterior a `DateTime.UtcNow`. Regla de negocio **preexistente**; NO fue tocada en R-01/R-02/R-03, Fase 1 ni Fase 2.
- **Contexto:** mismo flujo "crear postulación + agendar entrevista" que corrigió H-04 (transición de etapa); superada esa, esta es la siguiente guarda del flujo.
- **Probable causa:** dato de prueba con fecha de entrevista en el pasado. Si se usó fecha futura y aún falla, podría ser desfase de zona horaria (frontend local vs backend UTC) y sería bug real.
- **Estado:** PENDIENTE (no se corrige en esta iniciativa de convergencia).
- **Mitigación acordada:** controlar desde el frontend que el usuario no pueda realizar lo no permitido — p. ej. deshabilitar fechas pasadas en el agendador de entrevistas y deshabilitar acciones de etapa no permitidas por el validador de transiciones. Registrado como "Guards de UI" pendiente en `08-plan-convergencia-retroalimentacion.md`.
- **Nota:** el backend debe seguir validando (defensa en profundidad); el guard de UI mejora la experiencia pero no sustituye la validación server-side.

---

## NG8113 preexistentes (FUERA de alcance R — no tocar)

- `src/app/apps/cobranza.luxuryapp/cobranza-online/cobranza-online-wrapper.ts`
- `src/app/apps/reclutamiento.luxuryapp/candidates/candidate-recruitment-interviews/candidate-recruitment-schedule-modal.ts`
- `src/app/apps/reclutamiento.luxuryapp/candidates/recruitment-agenda-list.ts`
