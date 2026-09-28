# Auditoría: Reclutamiento / Candidates - 20260915

> Fuente rectora: `conventions/CONVENTIONS.md` (§4.4, §5.8, §6.1, §6bis).
> Módulo auditado:
> - Backend: `api/LuxuryApp.Application/Modules/RecruitmentLuxuryApp/Candidates/`
> - Frontend: `appsweb/angular/src/app/modules/recruitment.luxuryapp/candidates/`
>
> **Nota:** la auditoría previa `20260910-auditoria-reclutamiento-luxuryapp-api.md` está
> **DESACTUALIZADA**. Varios de sus hallazgos ya fueron remediados (validación de
> transiciones de etapa, chequeo de impacto al eliminar, unicidad de email/teléfono,
> validación real de PDF). Este reporte refleja el estado actual del código.

---

## 1. Resumen ejecutivo

Módulo funcionalmente maduro y significativamente endurecido respecto a la auditoría
anterior. La máquina de estados de `CandidateProcess` está validada en backend con
matriz completa de transiciones, hay control de concurrencia sobre vacante
(congelado de candidatos hermanos), unicidad normalizada de email/teléfono y
validación de PDF por magic bytes.

Los hallazgos que quedan son **estructurales** (servicios que exceden el límite de
300 líneas por ~10x), **de permisos** (políticas de autorización mal asignadas en
dos grupos de endpoints) y **de consistencia frontend** (pipe `date` nativo en un
listado, imports por ruta física `src/app`, literales de icono).

---

## 2. Matriz de Reglas de Negocio (4 niveles)

| Nivel | RN | Regla | Estado en código |
|-------|----|-------|------------------|
| 1 Invariante | RN-CAND-01 | Email de candidato único (normalizado) | ✅ `EMAIL_ALREADY_EXISTS` (409) + `NormalizedEmail` + `CheckDuplicateCandidateAsync` |
| 1 Invariante | RN-CAND-02 | Teléfono único (normalizado) | ✅ `PHONE_ALREADY_EXISTS` (409) + `NormalizedPhoneNumber` |
| 1 Invariante | RN-CAND-03 | Candidato archivado no puede postularse | ✅ `CANDIDATE_ARCHIVED` (400) en `CreateAsync` proceso |
| 2 Flujo | RN-CAND-10 | Transiciones de etapa restringidas | ✅ `ValidateProcessStageTransition` (matriz completa, §8) |
| 2 Flujo | RN-CAND-11 | Proceso cerrado no editable | ✅ `EnsureCandidateProcessEditable` |
| 2 Flujo | RN-CAND-12 | Una vacante no puede contratar 2 candidatos simultáneos | ✅ congelado de hermanos + `VacancyLockedMessage` |
| 2 Flujo | RN-CAND-13 | Entrevista no agendable < 30 min de anticipación | ✅ `INVALID_SCHEDULE_DATETIME` (400) |
| 3 Seguridad | RN-CAND-20 | Solo Reclutamiento gestiona candidatos | ⚠️ ver Hallazgo #3 (política `RequireInterviewerRole` en grupo base) |
| 3 Seguridad | RN-CAND-21 | Solo Reclutamiento edita experiencia laboral | ⚠️ ver Hallazgo #4 |
| 4 Validación | RN-CAND-30 | CV/documents solo PDF real | ✅ `HIRING_DOCUMENT_ONLY_PDF` + magic bytes (`DOCUMENT_INVALID_PDF`) |
| 4 Validación | RN-CAND-31 | Fecha de presentación ≥ hoy | ✅ `INVALID_PRESENTATION_DATE` (400) |
| 4 Validación | RN-CAND-32 | Email válido + datos mínimos de ex-empleado | ✅ `EMPLOYEE_EMAIL_REQUIRED` / `EMPLOYEE_PHONE_REQUIRED` (409) |

---

## 3. Hallazgos por severidad

### CRÍTICOS

Ninguno detectado en el estado actual.

### ALTOS

**H1 — `CandidateProcessAppService.cs` excede el límite de 300 líneas ~10x.**
- `CandidateProcesses/Services/CandidateProcessAppService.cs`: **7059 líneas físicas**
  (~3500 líneas de código; el archivo está doble-espaciado CRLF).
- `CandidateCore/Services/CandidateAppService.cs`: **1943 líneas físicas** (~831 código).
- Regla violada: §6bis #4 "Máximo 4-5 niveles... Límite de 300 líneas por clase".
- Riesgo: mantenibilidad, testabilidad, propensión a regresiones, merge conflicts.
- Remedio: estratificar en `SubServices`/`Helpers` por nivel (ver §9). El archivo ya
  agrupa responsabilidades (KPI, agenda, board, agenda entrevistador, hiring,
  documents, schedule, stage, presentation, decision) — son candidatos naturales a
  subservicios.

**H2 — Política de autorización incorrecta en `CandidateEndPoint`.**
- `CandidateEndPoint.cs:27` define el grupo base `api/recruitment-candidates` con
  `.RequireAuthorization("RequireInterviewerRole")`.
- Sobre ese grupo quedan SIN sobreescribir: `GET ""` (listar), `GET {id}` (detalle),
  `GET former-employees`, `GET {id}/delete-impact`, `GET search-by-phone`,
  `POST check-duplicate`, `POST former-employees/{id}/ensure-candidate`.
- Efecto: un usuario con **rol Entrevistador** puede listar candidatos y ver su
  detalle/datos personales. Debería ser `RequireRecruitmentRole`.
- Evidencia de que no es intencional: `CandidateProcessEndPoint.cs:17` sí usa
  `RequireRecruitmentRole` para el grupo principal y aísla `RequireInterviewerRole`
  solo al subgrupo de acciones del entrevistador (con comentario que explica el
  problema del AND de políticas, líneas 25-30).

**H3 — Política de autorización incorrecta en `CandidateWorkExperienceEndPoint`.**
- `CandidateWorkExperienceEndPoint.cs:17` define el grupo base
  `api/recruitment-candidate-work-experiences` con `.RequireAuthorization("RequireInterviewerRole")`.
- Efecto: un **Entrevistador** puede `POST` (crear), `PUT` (editar) y `DELETE`
  (borrar) experiencia laboral de un candidato. Debería ser `RequireRecruitmentRole`.

**H4 — Pipe `date` nativo sobre campo del API (regla de fechas).**
- `candidate-core/former-employee-talent-pool.html:93`:
  `{{ item.dateAdmission | date: "dd/MM/yyyy" }}`.
- Regla violada: §6.1 "Manejo de Fechas y Horas" → obligatorio `apiDate` pipe.
  `| date` parsea con la zona horaria del navegador y reintroduce el bug de "un día
  menos" en campos `DateOnly`.
- Remedio: `{{ item.dateAdmission | apiDate }}`.

### MEDIOS

**M1 — Propiedades DTO con `?` (nullable) en violación de §6.1.**
~30 propiedades en DTOs usan `?` (`SalaryExpectation`, `RecruitmentSourceId`,
`ScheduledAt`, `NextInterviewAt`, `BankId`, etc.). Regla vigente: `#nullable disable`
global, PROHIBIDO `?` en DTO/Entity; el null se maneja en lógica, no en la firma.
- Ubicaciones: `CandidateCore/DTOs/*`, `CandidateProcesses/DTOs/*`,
  `CandidatesWorkExperience/DTOs/*` (listado completo en §7).
- Nota: deuda sistemática del proyecto, no exclusiva de este módulo. Corregir en el
  mismo PR si se toca el archivo.

**M2 — Import por ruta física `src/app` en 4 archivos.**
Regla violada: §6bis.5 / CONVENTIONS_FOLDER-FRONT §1.7 (usar aliases, nunca `src/app`).
- `candidate-work-position-candidates.ts:18`
- `candidate-recruitment-interviews.ts:15`
- `candidate-interviewer-queue.ts:16`
- `candidate-interview/candidate-interview-response.ts:24`
- Todas importan `ROUTES` desde `src/app/routing/route-paths`. Debe existir/crearse
  el alias `@core/routing/...` correspondiente.

**M3 — Literales de icono `material-symbols-light:*` hardcodeados en `.ts`.**
- `candidate-applications/candidate-application-kpis.ts` (8 literales en objeto de
  datos: `work-outline`, `work-history`, `description`, `record-voice-over`,
  `error-outline`, `check-circle-outline`, `timer-outline`, `track-changes`).
- Regla §6.1 Iconos: forma objetivo `AppIcon.Clave` tipada; literal solo tolerable si
  es valor de catálogo. En `.ts`/datos se exige `AppIcon`.
- Los `iconClass="material-symbols-light:..."` en `.html` (62 apariciones) son patrón
  heredado "aceptable" mientras el valor esté en catálogo, pero deben migrar a
  `[icon]="AppIcon.X"`.

**M4 — `new Date(...)` en lógica de formularios (revisión manual de fechas).**
La mayoría son válidas (min/max de datepicker, validación de mayoría de edad en
`candidate-form.ts:65-69`). Dos casos a revisar por posible parseo de fecha del API:
- `candidate-recruitment-schedule-modal.ts:129-131`: `new Date(existing)` + corrección
  manual de offset — prefill de datepicker con corrección de zona; evaluar
  `DateService.parseDate()`.
- `candidate-interview-feedback-form.ts:239`: `new Date(value).toISOString()` al
  serializar — verificar que no envíe `Date` crudo (regla de escritura).

### BAJOS

**L1 — Documentación de módulo incompleta (regla §4.7).**
- Backend Nivel 1 `RecruitmentLuxuryApp/README.md` ✅ existe.
- Backend Nivel 2 `Docs/documentacion-candidates.md` ❌ no existe.
- Frontend: docs viven en `recruitment.luxuryapp/docs/` (README, setup, decisiones)
  ✅, pero existe `modulo-candidates-doc.html` (HTML legacy, candidato a eliminar/
  absorber) y no hay doc específico de `candidates/` (los pilotos históricos §4.7
  apuntaban a `candidates/docs/README.md`).

**L2 — Higiene de archivos backend.**
- Doble espaciado (blank line entre cada línea) en todos los `.cs` del módulo:
  infla el conteo de líneas y ensucia diffs.
- Comentarios XML placeholder sin actualizar: `CandidateEndPoint.cs:13`
  `/// Servicio o componente relacionado con fin.` (plantilla sin rellenar).

**L3 — Endpoint manual de automatización sin idempotencia.**
- `POST api/recruitment-candidate-processes/run-automation`
  (`CandidateProcessEndPoint.cs:91`) expone `ExecuteDailyMonitoringAsync` a
  `RequireRecruitmentRole` sin guard de idempotencia/rate-limit. Riesgo bajo.

**L4 — Enums de candidato en `@core/enums` compartido.**
`CandidateStatus`, `CandidateProcessStage`, `CandidateDecision`,
`CandidateInterviewProgressStatus` residen en `@core/enums/*` en vez de ser
submódulo-locales. Si no son consumidos por otros módulos, violan el aislamiento de
submódulos (CONVENTIONS_FOLDER-FRONT §1.2bis). Confirmar alcance antes de mover.

---

## 4. Matriz de permisos (endpoint × política)

| Endpoint | Método | Política efectiva | Esperado | Estado |
|----------|--------|-------------------|----------|--------|
| `/api/recruitment-candidates` | GET | RequireInterviewerRole ⚠️ | RequireRecruitmentRole | H2 |
| `/api/recruitment-candidates/{id}` | GET | RequireInterviewerRole ⚠️ | RequireRecruitmentRole | H2 |
| `/api/recruitment-candidates/former-employees` | GET | RequireInterviewerRole ⚠️ | RequireRecruitmentRole | H2 |
| `/api/recruitment-candidates/search-by-phone` | GET | RequireInterviewerRole ⚠️ | RequireRecruitmentRole | H2 |
| `/api/recruitment-candidates/check-duplicate` | POST | RequireInterviewerRole ⚠️ | RequireRecruitmentRole | H2 |
| `/api/recruitment-candidates` | POST | ExpedienteEmpleado | Reclutamiento | Verificar L5 |
| `/api/recruitment-candidates/{id}` | PUT | ExpedienteEmpleado | Reclutamiento | Verificar L5 |
| `/api/recruitment-candidates/{id}` | DELETE | ExpedienteEmpleado | Admin/Reclutamiento | Verificar L5 |
| `/api/recruitment-candidates/{id}/archive` | PATCH | ExpedienteEmpleado | Reclutamiento | Verificar L5 |
| `/api/recruitment-candidate-work-experiences` | POST | RequireInterviewerRole ⚠️ | RequireRecruitmentRole | H3 |
| `/api/recruitment-candidate-work-experiences/{id}` | PUT | RequireInterviewerRole ⚠️ | RequireRecruitmentRole | H3 |
| `/api/recruitment-candidate-work-experiences/{id}` | DELETE | RequireInterviewerRole ⚠️ | RequireRecruitmentRole | H3 |
| `/api/recruitment-candidate-processes` | GET/POST/PUT | RequireRecruitmentRole | ✅ | OK |
| `/api/recruitment-candidate-processes/{id}/stage` | POST | RequireRecruitmentRole | ✅ | OK |
| `/api/recruitment-candidate-processes/{id}/interview-response` | GET | RequireInterviewerRole | ✅ | OK |
| `/api/recruitment-candidate-processes/interviewer-action` | POST | RequireInterviewerRole | ✅ | OK |
| `/api/recruitment-candidate-processes/{id}/presentation-result` | POST | CanConfirmCandidatePresentation | ✅ | OK |

**L5 (verificar):** la política `ExpedienteEmpleado` es un nombre de dominio de
expediente/HR aplicado a candidatos. Confirmar con Tech Lead que otorga exactamente
los roles de Reclutamiento y no más (p. ej. que no habilite a un rol de expediente
ajeno a reclutamiento a borrar candidatos).

---

## 5. Validaciones Front vs Back (espejo)

| Campo/Regla | Frontend | Backend | Coinciden |
|-------------|----------|---------|-----------|
| Email formato | `input-email` (pattern) | normalizado + validación | ✅ |
| Email único | `check-duplicate` (async) | `EMAIL_ALREADY_EXISTS` + `CheckDuplicateCandidateAsync` | ✅ |
| Teléfono único | — | `PHONE_ALREADY_EXISTS` + `NormalizedPhoneNumber` | ✅ |
| PDF real | accept + tamaño UI | magic bytes (`DOCUMENT_INVALID_PDF`) | ✅ |
| Transición de etapa | select de etapas | `ValidateProcessStageTransition` | ✅ |
| Proceso cerrado editable | UI oculta | `EnsureCandidateProcessEditable` | ✅ |
| Fecha presentación ≥ hoy | datepicker min | `INVALID_PRESENTATION_DATE` | ✅ |
| Agendar entrevista ≥ +30 min | `minTime` (application-form.ts:561) | `INVALID_SCHEDULE_DATETIME` (MexicoTime) | ✅ |
| Mostrar fecha (lectura) | `apiDate` (mayoría) | — | ⚠️ 1 violación (`date` en talent-pool) H4 |

---

## 6. Errores de lógica (QA punta a punta — matriz de brechas)

| Proceso / Entidad | Vulnerabilidad | Causa raíz | Solución propuesta |
|-------------------|----------------|------------|--------------------|
| Listar candidatos | Entrevistador puede listar/ver detalle | política base `RequireInterviewerRole` en grupo | cambiar base a `RequireRecruitmentRole` |
| Experiencia laboral | Entrevistador puede crear/editar/borrar | política base `RequireInterviewerRole` | cambiar a `RequireRecruitmentRole` |
| Borrado candidato | Depende de `ExpedienteEmpleado`; verificar rol exacto | política de dominio cruzado | confirmar matriz de roles; si excede, política propia |
| Doble submit / duplicados | cubierto por unicidad + check-duplicate | — | OK (sin brecha) |
| Concurrencia vacante (2 contrataciones) | cubierto por congelado de hermanos | — | OK (sin brecha) |
| Candidato contratado 2 veces | `CheckDuplicateCandidateAsync` (Employee/Candidate/User) | — | OK (sin brecha) |
| Estado final revertido | `ValidateProcessStageTransition` bloquea desde `Contratado`/`Rechazado` | — | OK (sin brecha) |
| Borrado entidad con archivo | `RemoveHiringDocumentFileAsync` borra archivo físico | — | OK (verificar transacción) |

Sin implementar nada hasta aprobación (protocolo qa-punta-a-punta).

---

## 7. Inventario de propiedades DTO con `?` (M1)

`CandidateCore/DTOs`: `CandidateDetailDto` (`SalaryExpectation`, `RecruitmentSourceId`),
`CandidateListItemDto` (`RecruitmentSourceId`, `CurrentCandidateProcessId`,
`LastUpdatedAt`), `CreateCandidateDTO` (`SalaryExpectation`, `RecruitmentSourceId`),
`UpdateCandidateDTO` (`SalaryExpectation`, `RecruitmentSourceId`),
`FormerEmployeeTalentPoolItemDto` (`CandidateId`).

`CandidateProcesses/DTOs`: `CandidateProcessDetailDto` (`HiringRequestedAt`,
`ScheduledAt`, `ClosedAt`, `DecisionSentAt`), `CandidateProcessListItemDto`
(`HiringRequestedAt`, `ScheduledAt`), `CreateCandidateProcessDTO` (`ScheduledAt`),
`CreateCandidateApplicationDTO` (`RecruitmentInterviewAt`, `LivesNearWorkplace`),
`ChangeStageApplicationRequest` (`RecruitmentInterviewAt`, `OperationsInterviewAt`),
`CandidateHiringDocumentListItemDto` (`SubmittedAt`, `ValidatedAt`),
`CandidateInterviewerQueueDto`/`ItemDto` (`NextInterviewAt`, `InterviewId`,
`CandidateProcessId`, `OperationsInterviewAt`, `HiringRequestId`, `LastFeedbackAt`),
`CandidateInterviewResponseDto` (`CandidateProcessId`, `OperationsInterviewAt`),
`CandidateApplicationProcessHiringDto` (`BankId`), `CandidateRecruitmentAgendaItemDto`,
`CandidateRecruitmentInterviewBoardDto`/`ItemDto`, `InterviewerApplicationViewDto`,
`InterviewerActionRequest` (`NewScheduledAt`), `VacancyTimelineEventDTO`.

`CandidatesWorkExperience/DTOs`: `CandidateWorkExperienceDTO`, `CreateCandidateWorkExperienceDTO`,
`UpdateCandidateWorkExperienceDTO` (`MonthlyNetSalary`).

---

## 8. Máquina de estados vigente (backend)

`ValidateProcessStageTransition` (`CandidateProcessAppService.cs`):

```
Nuevo                  -> EntrevistaOperaciones, Rechazado, EnEspera
EntrevistaOperaciones  -> Seleccionado, Rechazado, NoSePresento, EnEspera
EnEspera               -> EntrevistaOperaciones, Rechazado, Seleccionado
Seleccionado           -> AltaEnProceso, PendingPresentation, Rechazado
PendingPresentation    -> ReadyForHire, PresentationRescheduled, PresentationNoShow, Rechazado
PresentationRescheduled-> ReadyForHire, PresentationNoShow, PendingPresentation, Rechazado
ReadyForHire           -> AltaEnProceso, Rechazado
PresentationNoShow     -> PendingPresentation, Rechazado
AltaEnProceso          -> Contratado, Rechazado
```

Transición no listada ⇒ `BusinessException(400, INVALID_STAGE_TRANSITION)`. Los estados
finales (`Contratado`, `Rechazado`, `NoSePresento`) no aparecen como origen ⇒ no
revertibles. Correcto.

---

## 9. Plan de remediación priorizado

1. **H2/H3 (permisos)** — cambiar política base a `RequireRecruitmentRole` en
   `CandidateEndPoint.cs:27` y `CandidateWorkExperienceEndPoint.cs:17`. *Esfuerzo: 10 min.*
2. **H4 (fecha)** — `former-employee-talent-pool.html:93` → `| apiDate`. *5 min.*
3. **M2 (alias)** — reemplazar `src/app/routing/route-paths` por alias oficial en 4 archivos.
4. **M3 (iconos)** — migrar 8 literales de `candidate-application-kpis.ts` a `AppIcon.*`.
5. **H1 (líneas)** — refactor `CandidateProcessAppService` en SubServices por dominio
   (KPI, agenda, board, hiring, documents, schedule, stage, presentation, decision);
   idem `CandidateAppService`. Requiere plan + aprobación Tech Lead (regla §6bis #4).
6. **M1 (nullable)** — eliminar `?` en DTOs al tocar cada archivo (deuda sistemática).
7. **L1/L2/L4** — documentación Nivel 2, limpieza de HTML legacy y doble espaciado,
   confirmar alcance de enums en `@core/enums`.

---

## 10. Checklist de validación

- [x] Identifiqué entidades y enums (Candidate, CandidateProcess, RequestPosition, WorkExperience)
- [x] Verifiqué [Authorize]/políticas en todos los endpoints
- [x] Verifiqué guards frontend (authGuard + hasRolesGuard en 9 rutas)
- [x] Comparé validaciones front vs back (tabla §5)
- [x] Verifiqué máquina de estados y transiciones prohibidas
- [x] Verifiqué eliminación/archivado e impacto
- [x] Verifiqué duplicados y concurrencia
- [x] Verifiqué reglas de fechas (backend ✅, frontend 1 violación)
- [x] Verifiqué aliases, endpoints centralizados, iconos, tokens

**Conformidades destacadas:** namespaces path-based correctos, 1 DTO = 1 archivo,
primary constructors, `GetDisplayName()`, sin `DateTime.Now/Today`, sin SelectItem local,
sin URLs hardcodeadas, `[FromForm]` + `DisableAntiforgery` con análisis, validación PDF real.
