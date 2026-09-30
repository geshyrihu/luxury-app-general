# Auditoría de Cumplimiento — Módulo Reclutamiento > Candidates (Revisión)

**Fecha de auditoría:** 2026-08-13
**Auditor:** Agente de auditoría (análisis según CONVENTIONS.md §4.4)
**Módulo backend:** `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/`
**Módulo frontend:** `client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/`
**Estado:** Auditoría completa (estructura + contratos + seguridad + flujos + UI + testing)
**Resultado:** Incumplimientos críticos: 6 · Altos: 7 · Medios: 7 · Deuda documental: 2

> **Nota de trazabilidad:** Esta revisión complementa `20260813-auditoria-reclutamiento-candidatos.md`.
> Confirma el estado de los hallazgos previos (authorization sin policy, archivar sin
> validación, empalmes de agenda) y agrega hallazgos de convención no cubiertos

---

## 1. Resumen ejecutivo

El módulo cumple la estructura general del sistema rector (minimal APIs, `EndPoints/`,
nombres `AppService`, SelectItems centralizados, enums con `DisplayName`, file handling
seguro, `[FromForm]` en multipart, notificaciones centralizadas). Sin embargo, presenta:

- **6 hallazgos críticos**: 2 de organización de DTOs (violación de regla sin excepciones),
  directo fuera de la excepción `p-table`.
- **7 hallazgos altos**: autorización fragmentada (3 patrones en 8 EndPoints), transición
  de etapa sin validar en el modelo canónico, rutas front sin guard por rol, `confirm()`
  nativo, rutas hardcodeadas, librería de terceros para CV, magic numbers de `action`.
- **7 hallazgos medios**: email sin constraint UNIQUE en BD, email sin `[Required]` en DTO,
  colores hex en KPIs, inline px, `*ngIf` residual, rango de roles por orden de enum, docs.

**Reglas de negocio verificadas (RN-CAND):** 6 de 8 implementadas correctamente; 2 con
defensa parcial (RN-CAND-001 email único sin constraint BD; RN-CAND-007 transiciones solo
validadas en el modelo legacy).

---

## 2. Alcance

| Capa | Archivos auditados | Cobertura |
|------|--------------------|-----------|
| Backend | 8 EndPoints, 12 AppServices, ~40 DTOs, 5 subdominios (Candidate, CandidateApplication, CandidateProcess, CandidateInterview, InterviewerMatrix, CandidateWorkExperience, CandidateInterviewResult, CandidateDecisionReason, Notifications) | Estructura, naming, DTOs, seguridad, flujos, RN, file handling, notificaciones |
| Frontend | 10 rutas, ~30 componentes/plantillas, 5 specs, servicios (`candidate-interviewer-queue.service.ts`, `candidate-recruitment-interviews.service.ts`) | Standalone, signals, control flow, API access, UI/DS, diálogos, guards, tipado, a11y |
| Contratos | `core/constants/endpoints/reclutamiento.endpoints.ts`, `core/enums/candidate-application-stage.ts`, interfaces por submódulo | Correspondencia front/back |

No se validó flujo de edición en runtime (requiere ejecución de la app). Se marcó el
riesgo; la hidratación de `candidate-form`/`candidate-application-form` quedó pendiente
de verificación manual según `audit-module-conventions.md`.

---

## 3. Hallazgos por severidad

### 3.1 Incumplimientos críticos

| # | Hallazgo | Evidencia (archivo:línea) | Regla violada |
|---|----------|---------------------------|---------------|
| C1 | Múltiples DTOs en un mismo archivo | `CandidateApplication/DTOs/CandidateApplicationKpisDto.cs:106` (`FuenteKpiItem`); `CandidateApplication/DTOs/CandidateInterviewerQueueDto.cs:46` (`CandidateInterviewerQueueItemDto`); `CandidateApplication/DTOs/CandidateInterviewResponseDto.cs:28` (`CandidateInterviewTimelineItem`); `CandidateApplication/DTOs/InterviewerApplicationViewDto.cs:79,108` (`InterviewerActionRequest`, `enum InterviewerActionType`) | `dto-file-organization-rule.md` (1 archivo = 1 DTO, sin excepciones) |
| C2 | DTO con `Id` sin heredar `GuidIdEntityDTO` | `CandidateApplication/DTOs/CandidateInterviewResponseDto.cs:30` (`CandidateInterviewTimelineItem` → `public Guid Id`) | `backend-rules.md:97` |
| C3 | `ChangeDetectionStrategy.Eager` en componente del feature | `candidate/candidate-detail.ts:29` (único; resto del feature usa `OnPush`) | `frontend/angular-components-api.md` (OnPush siempre) |
| C4 | Icono `mdi mdi-close` en plantilla | `candidate-interview/candidate-interview-response.html:177` | `ui/icon-usage-rule.md` (`mdi:` retirado; usar `<app-icon>`) |
| C6 | `[(ngModel)]` sobre señal (mezcla reactividades) | `candidate-interview/candidate-interview-response.html:188` | `frontend/angular-signals-and-state.md` |

### 3.2 Incumplimientos altos

| # | Hallazgo | Evidencia | Regla violada |
|---|----------|-----------|---------------|
| A1 | Autorización fragmentada en 3 patrones dentro del módulo (lista de 9 roles inline repetida en 7 EndPoints + política `RequireRecruitmentRole` + política `SoloSuperUsuario`, con mezcla dentro del mismo archivo) | `CandidateEndPoint.cs:11`, `CandidateApplicationEndPoint.cs:11,28,97`, `CandidateInterviewEndPoint.cs:11,25`, `CandidateDecisionReasonEndPoint.cs:11`, `CandidateWorkExperienceEndPoint.cs:11`, `CandidateInterviewResultEndPoint.cs:11`, `CandidateProcessEndPoint.cs:11,64,70`, `InterviewerMatrixEndPoint.cs:11,15` | `backend-rules.md` (autorización explícita por endpoint, sin drift) |
| A2 | `ChangeStageAsync` del modelo canónico asigna `ToStage` sin validar transiciones | `CandidateProcess/Services/CandidateProcessAppService.cs:1029`; la validación solo existe en `CandidateApplicationAppService.cs:1396` | RN-CAND-007 (máquina de estados) |
| A3 | Rutas del feature protegidas solo con `authGuard` (sin guard por rol) mientras los endpoints exigen roles | `candidates.routing.ts:16,28,40,52,64,76,88,100,113`; `core/auth/guards/auth.guard.ts` sin lógica de roles | `frontend/angular-routing-guards.md` |
| A4 | `confirm()` nativo en vez de `DialogHandlerService.confirm()` (falla en mobile) | `candidate-interviewer-queue/candidate-interviewer-queue.ts:204` | `frontend/angular-dialog-modal-pattern.md` |
| A5 | Navegación con rutas hardcodeadas sin constantes `route-paths.ts` | `candidate-interview/candidate-interview-response.ts:105`; `candidate-interviewer-queue.ts:174,183`; `candidate-recruitment-interviews.ts:138,144`; `candidate-work-position-candidates.ts:217,223`; `recruitment-agenda-list.ts:137`; `candidate-interview-pending-list.html:7` | `frontend/frontend-rules.md` (patrón `route-paths.ts`) |
| A6 | Uso directo de `@iplab/ngx-file-upload` (dependencia UI de terceros en feature) | `recruitment-shared/candidate-cv-upload.ts:13-14` | `frontend/frontend-rules.md` (consumir desde shared/ui) |
| A7 | Magic numbers de contrato de acción de entrevistador | `candidate-interviewer-queue.ts:210` (`action: 1` = MarkNoShow), `:221` (`action: 3` = Approve) contra `InterviewerApplicationViewDto.cs:108` (`enum InterviewerActionType`) | `frontend-rules.md` (drift de contrato; sin magic numbers) |

### 3.3 Medios / deuda técnica

| # | Hallazgo | Evidencia |
|---|----------|-----------|
| M1 | `Candidate.Email` sin índice UNIQUE en BD (validación solo en app) | `CandidateAppService.cs:215-217,246-248`; `ApplicationDbContext` sin `HasIndex(...).IsUnique()` para `Candidate` → carrera de condiciones |
| M2 | `CandidateCreateOrUpdateDto.Email` sin `[Required]` ni `[EmailAddress]` | `Candidate/DTOs/CandidateCreateOrUpdateDto.cs:22` |
| M3 | Colores hex hardcodeados en KPIs | `candidate-application-kpis.ts:347-355,385-389,411-421,438,444,460` (`#3b82f6`, `#f59e0b`, `#8b5cf6`, `#22c55e`, `#16a34a`, `#ef4444`, `#6b7280`) |
| M4 | Inline px y breakpoints literales | `candidate-application-kpis.html:24` (`width: 48px; height: 48px`), `candidate-interview-response.html:167` (`max-width: 500px; min-width: 320px`), `:176` utility Tailwind |
| M5 | `*ngIf` residual en vez de `@if` | `candidate-application-kpis.html:1` |
| M6 | Rango de roles por orden de enum | `InterviewerMatrix/Services/InterviewerMatrixAppService.cs:254-255` (`role is >= ApplicationRoleEnum.Legal and <= ...Salvavidas`) — frágil, contradice `CandidateInterviewerRoles.Values` |
| M7 | Magic number de tamaño de archivo | `recruitment-shared/candidate-cv-upload.ts:123-124` (`FileUploadValidators.fileSize(10485760)`) |

### 3.4 Documentación

| # | Hallazgo | Evidencia |
|---|----------|-----------|
| D1 | README duplica un DTO en la estructura | `Candidates/README.md:153-154` (`CandidateApplicationProcessHiringDto.cs` listado dos veces) |
| D2 | README declara "faltantes" que el código ya implementa | `Candidates/README.md` vs `CandidateAppService.cs:398-402` (archivar con activas ya bloquea) y validación de email único en app |

---

## 4. Matriz de Reglas de Negocio (4 niveles)

| RN | Descripción | Nivel | Backend | Frontend | Estado |
|----|-------------|:----:|---------|----------|--------|
| RN-CAND-001 | Candidato singular por email (UNIQUE) | 1-Invariante | App: `CandidateAppService.cs:215,246` · BD: sin índice | — | ⚠️ Parcial (sin constraint BD) |
| RN-CAND-002 | 1:N Candidate ↔ CandidateApplication | 1-Invariante | `ApplicationDbContext` FK `CandidateId` no única | interfaces de submódulo | ✅ |
| RN-CAND-003 | CandidateApplication es bandeja canónica | 2-Flujo | `CandidateApplicationAppService.cs` + EndPoints | `candidate-application-list.ts` | ✅ |
| RN-CAND-004 | 1 entrevistador por postulación | 2-Flujo | `CandidateInterviewResultAppService.cs:60-63` | `candidate-interviewer-queue.ts` | ✅ |
| RN-CAND-005 | No crear Employee si candidato ya existe (filtrado por customerId + TypePerson) | 1-Invariante | `CandidateApplicationAppService.cs:1177-1182` | `candidate-process-hiring-modal.ts` | ✅ |
| RN-CAND-006 | No archivar candidato con postulaciones activas | 1-Invariante | `CandidateAppService.cs:398-402` (`CANDIDATE_HAS_ACTIVE_APPLICATIONS`) | `candidate-list.ts` | ✅ |
| RN-CAND-007 | Pipeline de etapas con transiciones validadas | 2-Flujo | Legacy: `CandidateApplicationAppService.cs:1396` · Canónico: **sin validar** `CandidateProcessAppService.cs:1029` | `candidate-stage-change-modal.ts` | ⚠️ Parcial |
| RN-CAND-020 | Solo 8 roles pueden entrevistar | 3-Seguridad | `CandidateInterviewerRoles.cs:15-25` | guard por rol ausente (A3) | ⚠️ Parcial |

### 3.5 (sic) Casos negativos auditados

- Duplicado de email → rechazado en app, pero sin constraint BD (carrera) — **M1**
- Doble agendamiento de entrevista → transición sin validar en modelo canónico — **A2**
- Archivar candidato con postulaciones activas → bloqueado (✅)
- Saltos arbitrarios de etapa (`Nuevo` → `Contratado` sin pre-requisitos) → permitidos en `CandidateProcessAppService.cs:1029` — **A2**
- Empalme horario de entrevistas → no validado (heredado de auditoría previa) — **A2 relacionado**

---

## 4b. Matriz de permisos (Endpoint × Rol)

| Endpoint | Métodos | Autorización actual | Coherente |
|----------|---------|---------------------|:---------:|
| `/api/recruitment-candidates` | GET, POST, PUT, PATCH(archive/unarchive) | Roles inline (9 roles) | ⚠️ Inline repetido |
| `/api/recruitment-candidate-applications` | GET, POST, PUT, stage, decision, cv, process-hiring | Inline + `RequireRecruitmentRole` (agenda/board/kpis/automation/queue/schedule) | ⚠️ Mezcla |
| `/api/recruitment-candidate-processes` | GET, kpis, POST, PUT, stage, decision, schedule, process-hiring | `RequireRecruitmentRole` (grupo); inline en interview-response/interviewer-action | ⚠️ Mezcla |
| `/api/recruitment-candidate-interviews` | feedback, GET, CRUD citas | Inline + `RequireRecruitmentRole` | ⚠️ |
| `/api/recruitment-candidate-decision-reasons` | GET, POST, PUT | Roles inline | ⚠️ |
| `/api/recruitment-candidate-work-experiences` | GET, POST, PUT, DELETE | Roles inline | ⚠️ |
| `/api/recruitment-candidate-interview-results` | POST, GET | Roles inline | ⚠️ |
| `/api/recruitment-interviewer-matrix` | CRUD, customer, board, resolve, eligible-interviewers | `SoloSuperUsuario` + inline | ⚠️ |

**Frontend:** 10 rutas todas con `authGuard` (sin rol) → **A3**.

---

## 5. Validaciones Front vs Back

| Campo | Frontend | Backend | Coinciden |
|-------|----------|---------|:---------:|
| Email formato | `candidate-form.ts` validators | `CandidateCreateOrUpdateDto` sin `[Required]`/`[EmailAddress]` | ❌ (M2) |
| Email único | — (sin validator async) | App: sí (`CandidateAppService.cs:215`); BD: no | ⚠️ |
| CV tipo/tamaño | `accept` + `fileSize(10485760)` magic | `[FromForm]` + `ISecureFileStorageService` | ⚠️ |
| Transición de etapa | `candidate-stage-change-modal.ts` resuelve transiciones | Legacy sí / Canónico no | ⚠️ (A2) |
| Contrato `action` | magic numbers 1/3 | `enum InterviewerActionType` | ❌ (A7) |

---

## 6. Diagrama de flujo (resumen)

```
candidates (list, authGuard)
  ├─ candidate-form (CRUD) ──> POST/PUT /api/recruitment-candidates
  ├─ archive ──> PATCH .../archive        [back valida postulaciones activas ✅]
  └─ candidate-application-list (authGuard)
        ├─ stage-change-modal ──> POST .../stage   [canónico SIN validar ⚠️]
        ├─ process-hiring-modal ──> POST .../process-hiring  [filtro email+customerId ✅]
        └─ interviews / interviewer-queue / recruitment-agenda / kpis (authGuard sin rol ⚠️)
```

---

## 7. Plan de remediación por fases

### Fase 1 — Inmediata (críticos; 1-2 semanas)

| # | Tarea | Archivos | Criterio de éxito |
|---|-------|----------|-------------------|
| T1 | Separar DTOs en archivos únicos (C1) | `CandidateApplication/DTOs/*.cs` (4 archivos) | 1 archivo = 1 DTO; compilación OK |
| T2 | Heredar `GuidIdEntityDTO` en `CandidateInterviewTimelineItem` (C2) | `CandidateInterviewResponseDto.cs` | Sin `Id` desnudo |
| T3 | Cambiar `ChangeDetectionStrategy.Eager` → `OnPush` (C3) | `candidate-detail.ts:29` | `OnPush` en todo el feature |
| T4 | Sustituir `mdi-close` por `<app-icon>` del catálogo (C4) | `candidate-interview-response.html:177` | 0 clases `mdi:`; icono visible |
| T6 | Reemplazar `[(ngModel)]` sobre señal (C6) | `candidate-interview-response.html:188` | Signals como única fuente |

### Fase 2 — Corto plazo (altos; 3-6 semanas)

| # | Tarea | Archivos | Criterio de éxito |
|---|-------|----------|-------------------|
| T7 | Unificar autorización por política por rol (A1) | 8 EndPoints del módulo | 1 patrón; sin inline repetido |
| T8 | Validar transiciones en `ChangeStageAsync` canónico (A2) | `CandidateProcessAppService.cs:1029` | Saltos inválidos → 400 |
| T9 | Agregar guard por rol en rutas candidates (A3) | `candidates.routing.ts` | Ruta sin rol → 403 |
| T10 | Migrar `confirm()` → `DialogHandlerService` (A4) | `candidate-interviewer-queue.ts:204` | Confirm en mobile |
| T11 | Mover navegaciones a `route-paths.ts` (A5) | 8 llamadas `navigate` + 1 `routerLink` | 0 rutas hardcodeadas |
| T12 | Sustituir `@iplab/ngx-file-upload` por wrapper shared (A6) | `candidate-cv-upload.ts` | Sin deps UI de terceros |
| T13 | Reemplazar magic numbers `action` por enum tipado (A7) | `candidate-interviewer-queue.ts:210,221` | Contrato tipado |

### Fase 3 — Medio plazo (medios; 2 meses)

| # | Tarea | Archivos | Criterio de éxito |
|---|-------|----------|-------------------|
| T14 | Migración: índice UNIQUE de email + limpieza duplicados (M1) | `ApplicationDbContext` + migración | Constraint UNIQUE en BD |
| T15 | `[Required]` + `[EmailAddress]` en email (M2) | `CandidateCreateOrUpdateDto.cs:22` | DTO valida email |
| T16 | Tokenizar colores de KPIs (M3) | `candidate-application-kpis.ts` | 0 hex; `var(--ds-*)` |
| T17 | Eliminar inline px y utility classes (M4) | `candidate-application-kpis.html`, `candidate-interview-response.html` | Tokens CSS |
| T18 | `@if` en vez de `*ngIf` (M5) | `candidate-application-kpis.html:1` | Control flow nuevo |
| T19 | Reemplazar rango de enum por allowlist explícita (M6) | `InterviewerMatrixAppService.cs:254` | `CandidateInterviewerRoles` |
| T20 | Constante de tamaño de archivo (M7) | `candidate-cv-upload.ts:123` | Constante tipada |
| T21 | Corregir README (D1, D2) | `Candidates/README.md` | Doc alineada al código |

---

## 8. Checklist por tarea (ejecutable)

- [ ] T1..T6: `dotnet build` sin errores + `npm run lint` sin violaciones nuevas (modo baseline)
- [ ] T7: revisión de políticas en `DependencyInjection.Authorization.cs`; sin drift entre EndPoints
- [ ] T8: caso de prueba: `POST stage` con `Nuevo → Contratado` debe responder 400
- [ ] T9: navegar a `/recruitment/candidates/applications` sin rol → 403
- [ ] T10: marcar No Asistió en vista móvil abre DialogHandlerService
- [ ] T14: script de dedupe de emails previo a migración; índice único aplicado
- [ ] T16: `npm run audit:design` sin hex fuera de baseline
- [ ] T21: `node scripts/scan-mojibake.mjs client/luxuryapp` con 0 mojibake antes de commit

---

## 9. Cumplimiento por convención

| Convención | Doc normativo | Estado |
|------------|---------------|:------:|
| DTOs 1 archivo = 1 DTO | `backend/dto-file-organization-rule.md` | ❌ C1 |
| DTOs heredan `GuidIdEntityDTO` | `backend-rules.md` | ❌ C2 |
| Minimal APIs + EndPoints | `backend-module-structure.md` | ✅ |
| SelectItems centralizados | `backend/select-items-centralization-rule.md` | ✅ |
| Enums con DisplayName es-ES | `backend/enum-display-name-extension.md` | ✅ |
| File handling seguro | `backend/document-read-write-pattern.md` | ✅ |
| `[FromForm]` en multipart | `backend-rules.md` | ✅ |
| Standalone + OnPush | `frontend/angular-components-api.md` | ❌ C3 |
| Signals / @if-@for | `frontend/angular-signals-and-state.md` | ❌ C6, M5 |
| Iconos `<app-icon>` | `ui/icon-usage-rule.md` | ❌ C4 |
| Tokens CSS sin hex/px | `ui/design-tokens-rule.md` | ❌ M3, M4 |
| Diálogos vía `DialogHandlerService` | `frontend/angular-dialog-modal-pattern.md` | ❌ A4 |
| Guards por rol | `frontend/angular-routing-guards.md` | ❌ A3 |
| Endpoints por constantes | `frontend/frontend-api-endpoints.md` | ✅ |
| API vía `ApiResponseService` | `frontend/frontend-generic-services-catalog.md` | ✅ |

---

## 10. Referencias

- `CONVENTIONS.md` §4.4 (Auditoría de Módulo) y §5.8 (Framework de auditoría)
- `conventions/audit/audit-module-conventions.md`
- `docs-conventions/audit/AUDIT_PROMPT_COMPREHENSIVE.md` / `AUDIT_CHECKLIST_COMPLETO.md`
- Auditorías previas: `20260810-auditoria-reclutamiento-candidatos.md`, `20260813-auditoria-reclutamiento-candidatos.md`
- Planes previos: `docs/plans/20260809-reclutamiento-candidatos-remediacion-plan.md`, `docs/plans/20260811-reclutamiento-candidates-frontend-ejecucion-plan.md`
- Docs de módulo: `Candidates/README.md`, `Candidates/Docs/documentacion-candidates.md`, `client/angular/.../candidates/docs/*`
