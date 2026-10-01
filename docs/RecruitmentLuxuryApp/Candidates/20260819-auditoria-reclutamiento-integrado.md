# Auditoría Integrada: Candidatos ↔ Solicitudes de Vacante ↔ Solicitudes de Alta

- **Fecha:** 2026-08-19
- **Alcance:** Módulo `Candidates` (Backend `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/` + Frontend `client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/`) y su cruce con `RequestPosition` (JobVacancyRequests) y `RequestEmployeeRegister` (StaffHiringRequests) hasta `Employee`.
- **Auditor:** Arquitecto de Software Senior (modo solo-lectura)
- **Marco normativo:** `CONVENTIONS.md` (vigente 2026-08-12), `conventions/core/*`, `docs-conventions/audit/*`, documento previo `docs/reporte_maestro/modulos/20260813-auditoria-reclutamiento-candidatos.md`.

---

## 1. Resumen Ejecutivo

### Estado general: 🟡 **MIXTO — Sólido en patrones, débil en fronteras e integración**

El núcleo del módulo cumple bien las convenciones estructurales modernas: DTOs 1-por-archivo, endpoints kebab-case con `[FromForm]` + `.DisableAntiforgery()` al 100%, enums con `DisplayName` español, `GetDisplayName()` en selectores, DI completa, transiciones de etapa validadas en backend, frontend 100% signals/standalone/OnPush/`@if/@for`, endpoints centralizados en `core/constants`, y **cero mojibake** verificado por el escáner canónico.

Sin embargo, la auditoría detectó **violaciones críticas de gates oficiales** que impiden considerar el módulo "Enterprise":

| Capa | Estado | Motivo |
|---|---|---|
| **UI / Iconos** | 🔴 | `audit:icon-names` falla: **4 iconos fuera del catálogo** en el módulo (regla §5.5). |
| **Apps / Fronteras** | 🔴 | `audit:apps` falla: `recursos-humanos.luxuryapp` (lado Employee) importa de `reclutamiento.luxuryapp` — viola aislamiento entre apps. |
| **API / Autenticación** | 🟠 | Políticas AND rompen acceso de entrevistadores a `interviewer-action`/`interview-response` (403). |
| **API / Archivos** | 🟠 | Fotos de candidato se guardan con extensión `.pdf`. |
| **API / Notificaciones** | 🟠 | Stub muerto: agendar entrevista **no notifica a nadie**. |
| **BD / Redundancia** | 🟠 | Duplicación de `Folio`, `ConfirmationFinish`, fechas y estados entre la cadena Position→Register→Process; `CandidateId` redundante en `StaffHiringRequests`. |
| **Tokens** | 🟢 | `audit:tokens` pasa (0 hardcodes en el módulo). |
| **UI Boundaries** | 🟢 | `audit:ui` pasa (fronteras shared/ui respetadas). |
| **Encoding** | 🟢 | `scan-mojibake.mjs` reporta 0 en `client/angular`. |
| **Emoji** | 🟢 | `audit:emoji` pasa. |
| **CSS** | 🟢 | `audit:css` no reporta hallazgos dentro de `candidates/` (el único archivo reclutamiento afectado está fuera del módulo, `request-dismissal/solicitud-baja-form.ts`). |

**Conclusión:** la deuda no está en el "qué" (arquitectura, naming, reactividad) sino en el "cómo se cierra": gates de iconos y design desalineados, autorización mal compuesta, notificaciones silenciadas y datos replicados a lo largo de la cadena de alta. El plan de acción (§5) prioriza cerrar esos huecos.

---

## 2. Mapeo de Flujos Críticos

### 2.1 Cadena de datos actual en BD

Tablas reales (nombres EF/DB):

```
RecruitmentCandidates ──1:N──(CandidateId)──> RecruitmentCandidateProcesses ──N:1──(RequestPositionId)──> JobVacancyRequests
        ^                                                                                                     │ 1:1 (PositionRequestId, único filtrado)
        │                                                                                                     ▼
        └────N:1──(CandidateId)── StaffHiringRequests ──N:1──(EmployeeId)──> Employees ──1:1(vía JobPositions.EmployeeId)──> JobPositions
```

- Índice único `IX_RecruitmentCandidateProcesses_CandidateId_RequestPositionId_Unique` (`ApplicationDbContext.cs:1147-1149`): **una candidatura por candidato+vacante** — invariante correcto.
- FKs con **Restrict** global (`ApplicationDbContext.cs:1073-1076`): no hay cascadas destructivas. ✅
- Último salto invertido: `Employees` no tiene FK de puesto; el vínculo vive en `JobPositions.EmployeeId` (1:1 filtrada).

### 2.2 Flujo: Postulación → Solicitud de Alta

```
1. Candidato se registra            POST /api/recruitment-candidates                (multipart, CV+foto)
2. Se crea proceso candidato-vacante POST /api/recruitment-candidate-processes       (CandidateProcess, etapa "Nuevo")
3. Pipeline de etapas               POST .../{id}/stage  (matriz ValidateProcessStageTransition)
   Nuevo → EntrevistaOperaciones → Seleccionado → AltaEnProceso → Contratado
   (con ramas: EnEspera, Rechazado, NoSePresento)
4. Alta del candidato               POST .../{id}/process-hiring  (ProcessHiringAsync, CON transacción)
   → crea RequestEmployeeRegister (StaffHiringRequests) + Employee + PersonData
   → sincroniza WorkPosition.EmployeeId, banco, clínica, emergencia
5. Contratado                        etapa final "Contratado"
```

Flujo alterno: `POST .../direct-hire/{requestPositionId}` crea `Employee` directo sobre una vacante **sin pasar por CandidateProcess** (transacción propia).

### 2.3 Fugas de datos e información redundante

1. **`RequestEmployeeRegister.CandidateId` es un puente redundante** (añadido en migración `CandidateV3.cs:172-176`). El candidato ya se alcanza por `Candidate→Process→Position→Register`; ahora existe también vínculo directo. Dos caminos, riesgo de divergencia (misma persona como candidato distinto).
2. **`Folio` duplicado** en `RequestPosition.Folio` (`RequestPosition.cs:15`) y `RequestEmployeeRegister.Folio` (`RequestEmployeeRegister.cs:32`) — mismo folio de la misma solicitud de alta en dos tablas.
3. **`ConfirmationFinish` duplicado** a ambos lados de la relación 1:1: `RequestPosition.cs:96` y `RequestEmployeeRegister.cs:71`. Dos booleanos que pueden desincronizarse.
4. **Fechas de selección/ingreso triplicadas**: `RequestPosition.SelectionDate/EntryDate` (:74,:81) vs `CandidateProcess.SelectedAt/HiredEntryDate` (:73,:85) vs `RequestEmployeeRegister.ExecutionDate` (:39). El mismo hecho del negocio vive en tres tablas.
5. **Estado duplicado en 4 niveles** sin relación de derivación declarada: `Candidate.Status`, `CandidateProcess.ProcessStatus`, `RequestPosition.Status`, `RequestEmployeeRegister.Status`.
6. **Fuente de reclutamiento dual en Candidate**: enum `RecruitmentSource` (legacy, "mantenida por compatibilidad", `Candidate.cs:107`) + `RecruitmentSourceId` catálogo (`Candidate.cs:116`, FK SetNull). La columna `Age` fue renombrada a `RecruitmentSource` (`CandidateV3.cs:127-130`) para preservar el enum legacy.
7. **Coherencia empleado-puesto no garantizada**: `StaffHiringRequests.EmployeeId` (empleado contratado) y `JobPositions.EmployeeId` (ocupante del puesto) pueden apuntar a empleados distintos; la capa app manipula ambas columnas por separado (`RequestEmployeeRegisterAppService.cs:855-868`, `WorkPositionAppService.cs:401`, `RequestSalaryModificationAppService.cs:180-191`).
8. **Sin fuga de datos personales copiados** ✅: el nombre del candidato NO se copia en RequestPosition/RequestEmployeeRegister/Employee — el nombre del empleado vive en `AspNetUsers` + `PersonData`. Correcto.

---

## 3. Auditoría de Convenciones (CONVENTIONS.md)

### 3.1 Backend — Nomenclatura y CQRS

| Regla | Estado | Evidencia |
|---|---|---|
| Patrón `*AppService` + `I*AppService` | ✅ Cumple (5/6 servicios) | `CandidateAppService`, `CandidateProcessAppService`, etc. |
| Excepciones legítimas de naming | ✅ | `CandidateAutomationService` (job), `CandidateNotificationCoordinatorService`, `MultiChannelAlertService` (infra). |
| 1 DTO = 1 archivo | ✅ 99% | Única desviación: `IMultiChannelAlertService.cs` contiene interfaz + enum `AlertSeverity` (2 tipos/archivo). |
| DTO con `Id` hereda `GuidIdEntityDTO` (§6.1) | 🔴 1 violación | `CandidateHiringDocumentListItemDto.cs:5` declara `Guid Id` sin herencia. |
| Nombres de comando `*Dto` | 🟠 Desviación | `CandidateDecisionRequest`, `ChangeStageApplicationRequest`, `ScheduleRecruitmentInterviewRequest`, `InterviewerActionRequest` usan sufijo `Request`. |
| CQRS | 🟠 No CQRS | Servicios clásicos, `ApplicationDbContext` inyectado directo, sin handlers. `CandidateProcessAppService.cs` = **2652 líneas / 28 métodos / god-class**. |
| Namespaces fijos (`LuxuryApp.Application.*`) | ✅ | Consistente con `backend-namespaces`. |
| Endpoints kebab-case | ✅ | `api/recruitment-candidates`, `api/recruitment-candidate-processes`, etc. |
| `[FromForm]` + `.DisableAntiforgery()` en multipart | ✅ 100% | Los 7 endpoints con `IFormFile` lo cumplen (`CandidateProcessEndPoint.cs:101,105,112,116,118,123,125,130,132,137`). |
| Orden de rutas literales antes de `{id:guid}` | ✅ | `CandidateProcessEndPoint.cs:19-94`. |
| Transiciones de estado validadas en backend | ✅ | `ValidateProcessStageTransition` (`CandidateProcessAppService.cs:1196-1210`). |
| Transacciones en operaciones multi-entidad | 🟠 Parcial | `ProcessHiringAsync`/`ProcessDirectHiringAsync` sí transaccionan; operaciones de archivos (delete/upload/CV) **no** (ver §4). |
| FluentValidation | 🟠 No presente | Solo data annotations parciales. |
| Código muerto / TODOs | ✅ | 0 TODO/FIXME/HACK. |

### 3.2 Frontend — Signals, OnPush y PrimeFlex

| Regla | Estado | Evidencia |
|---|---|---|
| `signal()`/`computed()`/`input()`/`model()` | ✅ 100% | `candidate-list.ts:46,48`, `candidate-detail.ts:39`, `candidate-application-list.ts:38-46`, `candidate-form.ts:107-115`. |
| `ChangeDetectionStrategy.OnPush` | ✅ 100% | Todos los componentes. |
| Standalone | ✅ 100% | Todos. |
| `@if/@for/@switch` (cero `*ngIf/*ngFor`) | ✅ 100% | En todos los templates del módulo. |
| Cero `| async` / `BehaviorSubject` | ✅ | Patrón de signals puro. |
| Suscripciones con `takeUntilDestroyed` | 🟠 Parcial | 3 suscripciones sin cleanup en `candidate-application-form.ts:127,131,136`; `paramMap` sin TUD en `candidate-recruitment-interviews.ts:112` y `candidate-work-position-candidates.ts:163,168`. |
| PrimeFlex (`p-*` classes) | ✅ Uso extendido | `p-3`, `p-4`, `flex-column`, `surface-border`, etc. |
| Estilos con tokens CSS | ✅ | Estilos propios 100% `var(--ds-*)`; 0 hex/rgba/px literales. |
| Estilos inline | 🔴 Violaciones | `candidate-interview-response.html:167`, `candidate-interviewer-queue.html:222`, `recruitment-agenda-list.html:114`, y ~60 en `modulo-candidates-doc.html`. |
| Lazy loading | ✅ 100% | 9 rutas con `loadComponent` (`candidates.routing.ts:14,27,40,53,66,79,92,105,119`). |
| Guards por ruta | ✅ | `authGuard` + `hasRolesGuard` en todas las rutas. Pero `allowedRoles` duplicado 8× (`:20,33,46,59,72,85,98,111,125`). |
| Endpoints centralizados | ✅ | Único `/api/` es un comentario; todo vía `EndpointsReclutamiento` desde `core/constants/endpoints/reclutamiento.endpoints`. |
| Servicios compartidos | ✅ | Ningún `HttpClient` directo; usa `ApiResponseService`/`DataConnectorService`/`EnumSelectService`. |

### 3.3 SelectItemEndPoints vs Enums

| Uso | Estado | Evidencia |
|---|---|---|
| SelectItem locales en módulo Candidates | ✅ Cero | No existe ningún `*SelectItem*.cs` dentro de `Candidates/`. |
| 🔴 **Colindante (integración): `RequestEmployeeRegisterAppService.GetSelectVacantesAsync`** devuelve `SelectItemDTO<Guid>` desde un módulo de negocio (`RequestEmployeeRegisterAppService.cs:101-114`), y `CandidateProcessAppService` lo inyecta (`CandidateProcessAppService.cs:15`). | 🔴 **Violación CRÍTICA** de `select-items-centralization-rule.md:46-54` — los selects de entidades dinámicas deben vivir en el hub `SelectItemEndPoints` de `SystemLuxuryApp`. | |
| Selectores de enums vía hub | ✅ | Motivos de rechazo vía `EnumSelectService` (`candidate-interview-feedback-form.ts:85-87`), fuentes vía `onGetSelectItem` (`candidate-form.ts:184-189`), banco y catálogo de documentos vía hubs. |
| Enums hardcodeados en dropdowns del feature | 🟠 | `candidate-application-list.ts:57-71` arma el dropdown de etapas iterando `CandidateProcessStage`; `candidate-interview-feedback-form.ts:88-99` idem para `CandidateDecision`. Contradice `../../../docs/SharedLuxuryApp/Conventions/20260726-guia-shared-reporte-maestro-legacy.md:120-123` (README que declara el uso de `EnumSelectService`). |
| `GetDisplayName()` en backend | ✅ | Amplio uso correcto; 4 usos de `ToString()` son para matching contra `role.Name` de BD (aceptable). |
| `[Display(Name="español")]` en enums | ✅ | Todos los enums del pipeline (`CandidateProcessStage`, `CandidateDecision`, etc.) lo tienen. |

---

## 4. GAPs y Deuda Técnica

### 🔴 Críticos

| # | Hallazgo | Evidencia | Regla |
|---|---|---|---|
| C1 | **`audit:icon-names` falla: 4 iconos fuera del catálogo** en el módulo. `sync-alt` (2 usos), `event-available-outline`, `unarchive-outline`, `how-to-reg`. Un icono inexistente no falla en runtime: simplemente no se dibuja. | `candidate-form.html:206,215`, `candidate-recruitment-interviews.html:292,302`, `candidate-work-position-candidates.html:303` | §5.5 Icon Usage Rule; gate `audit:icon-names` |
| C2 | **Select de vacantes fuera de hub**: `GetSelectVacantesAsync` expone `SelectItemDTO<Guid>` desde módulo de negocio, inyectado por `CandidateProcessAppService`. | `RequestEmployeeRegisterAppService.cs:101-114`, `CandidateProcessAppService.cs:15` | §6.1 Select Items Centralization Rule |
| C3 | **`audit:apps` falla: frontera de apps rota en la integración Employee←Candidatos**. `recursos-humanos.luxuryapp` importa de `reclutamiento.luxuryapp` (8 archivos: `employee-interviewer-queue.service.ts:4-5`, `employee-interviewer-queue.ts:10-13`, `employee-queue-candidate-detail-modal.ts:7,11-13`, `staff-board.ts:26-31,56-57`, `employee-form.ts:15`). | `audit:apps` (exit 1) | Frontend Rules: dominios aislados |

### 🟠 Altos

| # | Hallazgo | Evidencia |
|---|---|---|
| A1 | **Políticas de autorización AND-eadas bloquean entrevistadores**: `interview-response` y `interviewer-action` agregan `RequireInterviewerRole` sobre el group con `RequireRecruitmentRole`. En ASP.NET Core ambas políticas se AND-ean → resultado = solo `{Reclutamiento, Administrador, SuperUsuario}`. Entrevistadores legítimos (`GerenteOperaciones`, `GerenteAtencion`, `Contador`, `Legal`, `RecursosHumanos`, etc.) reciben **403** pese a que el servicio valida `IsInterviewerRole` (`CandidateProcessAppService.cs:2029-2039`). El override es inefectivo. | `CandidateProcessEndPoint.cs:78,84` vs `:11`; `DependencyInjection.Authorization.cs` (políticas `RequireRecruitmentRole` y `RequireInterviewerRole`). Patrón correcto ya usado en `InterviewerMatrixEndPoint.cs:14-16`. |
| A2 | **Fotos de candidato guardadas como `.pdf`**: `SaveCandidatePhotoAsync` usa `fileStorageService.SaveAsync` que fuerza extensión `.pdf` (`ISecureFileStorageService.cs:248`) y `GetContentType` devuelve `application/pdf`. Debe usar `SaveOrigExt`. | `CandidateAppService.cs:618-623`, `ISecureFileStorageService.cs:243-258` |
| A3 | **Notificación post-agenda es un stub vacío**: `NotifyProcessInterviewScheduledAsync` carga el proceso y no hace nada ("deprecated... will be handled via CandidateInterview events"). Es llamado en `ScheduleAsync` (`CandidateProcessAppService.cs:1127`) → **tras agendar entrevista nadie es notificado**. | `CandidateNotificationCoordinatorService.cs:256-265` |
| A4 | **Doble allowlist de roles entrevistador** (drift): `InterviewerMatrixAppService.cs:11-27` hardcodea 14 roles vs `CandidateInterviewerRoles.Values` compartido (8 roles). Dos fuentes de verdad. | `InterviewerMatrixAppService.cs:11-27`; `CandidateInterviewerRoles.cs:10-23` |
| A5 | **Orden archivo-vs-BD sin transacción** en operaciones de archivos: `DeleteAsync` borra el directorio del candidato en disco **antes** del `SaveChangesAsync` (`CandidateAppService.cs:388-389` vs `396-397`) → fallo de BD deja archivos perdidos; `CreateAsync` guarda CV/foto antes de guardar la entidad (archivos huérfanos si falla); `UploadHiringDocumentAsync` guarda nuevo, borra viejo y persiste sin transacción (`CandidateProcessAppService.cs:340-367`). | `CandidateAppService.cs:388-397`, `CandidateAppService.cs:227-238`, `CandidateProcessAppService.cs:340-367` |
| A6 | **`allowedRoles` duplicado 8×** en el routing; cualquier cambio de roles debe tocarse en 8 sitios. | `candidates.routing.ts:20,33,46,59,72,85,98,111,125` |
| A7 | **Tres fuentes de verdad para el status de agenda** con labels/severidades divergentes: `recruitment-shared/agenda-status-tag-options.ts:8-28` (11 códigos), `recruitment-agenda-list.ts:65-79` (5), `candidate-work-position-candidates.ts:67-83` (7). | Ídem |
| A8 | **Redundancia BD en la cadena de alta** (7 puntos, ver §2.3): `CandidateId` redundante, `Folio`/`ConfirmationFinish` duplicados, fechas triplicadas, estado en 4 niveles, coherencia Employee↔WorkPosition sin garantía. | `RequestPosition.cs`, `RequestEmployeeRegister.cs`, `CandidateProcess.cs` |

### 🟡 Medios / Bajos

| # | Hallazgo | Evidencia |
|---|---|---|
| M1 | `CandidateHiringDocumentListItemDto.cs:5` con `Id` sin `GuidIdEntityDTO`. | §6.1 (1:1 DTO) |
| M2 | `IsActive` fantasma: `InterviewerMatrixAppService.ToItemDto` fuerza `IsActive=true` ignorando el DTO input; el campo nunca persiste. | `InterviewerMatrixAppService.cs:37`; `InterviewerMatrixCreateOrUpdateDto.IsActive:21` |
| M3 | Servicio legacy `[Obsolete]` con endpoints vivos: `CandidateInterviewResultAppService` marcado `[Obsolete("Legacy feature...")]` pero registrado en DI (`DependencyInjection.Controllers.cs:96`) y con 3 endpoints activos. | `CandidateInterviewResult` completo |
| M4 | 12 métodos `Notify*Application*Async` legacy solo forwardean a `Process*` — peso muerto de compatibilidad. | `ICandidateNotificationCoordinatorService.cs:28-29,79-80,99-100,124-125,152-153,194-195,247-248,250-254,358-363,404-417,462-469` |
| M5 | `assignedUserIds` siempre vacío → `AssignedInterviewerName` vacío en vistas. | `CandidateProcessAppService.cs:539-541,591-592,639,690,759` |
| M6 | `GetInterviewerDisplayName` devuelve el ID crudo del usuario como "nombre" del entrevistador. | `CandidateNotificationCoordinatorService.cs:749-752` |
| M7 | `MultiChannelAlertService` crea `new HttpClient()` propio si no se inyecta. | `MultiChannelAlertService.cs:13,17` |
| M8 | `Guid.NewGuid()` (3 usos) vs `Guid.CreateVersion7()` en el resto. | `CandidateWorkExperienceAppService.cs:20`, `InterviewerMatrixAppService.cs:54`, `CandidateInterviewResultAppService.cs:58` |
| M9 | `IsRecruiterOrAdmin()` compara strings hardcodeadas en vez de políticas. | `CandidateProcessAppService.cs:2041-2045` |
| M10 | Basura en raíz del feature: 6 `.md` sin consumidores (`extructura.md`, `extructura-global-empelados.md`, `nueva-extructuraV2.md`, `nueva-extructuraV3.md`, `nuevos-requerimientos.md`, `prompt.md`) + `modulo-candidates-doc.html` (HTML autogenerado de 839 líneas con endpoints ficticios, roles obsoletos y ~60 estilos inline). | `candidates/` raíz; `../../../docs/SharedLuxuryApp/Conventions/20260726-guia-shared-reporte-maestro-legacy.md:127-128` no los referencia |
| M11 | `ValidateProcessStageTransition` cita `nueva-extructuraV3.md` en su docstring — referencia a un scratch del frontend que no es documentación oficial. | `CandidateProcessAppService.cs:1193` |
| M12 | README backend desactualizado: pipeline `EntrevistaReclutamiento` inexistente en el enum; rutas de hiring-documents no coinciden; `/api/recruitment-candidate-applications` documentado pero eliminado. | `README.md:60-61,75-76,80` |
| M13 | README frontend desactualizado: declara 4 rutas activas (hay 9). | `../../../docs/SharedLuxuryApp/Conventions/20260726-guia-shared-reporte-maestro-legacy.md:16-21` |
| M14 | Listados sin paginación server-side: `{page:1, recordsNumber:200}` fijo → riesgo de truncamiento. | `candidate-list.ts:66`, `candidate-application-list.ts:75`, `candidate-interview-pending-list.ts:86` |
| M15 | Doble fetch del mismo endpoint en detalle de candidato. | `candidate-detail.ts:60-75` |
| M16 | Ternario muerto (ambas ramas devuelven lo mismo). | `candidate-application-list.ts:73-82` |
| M17 | Icono roto: `<app-icon name="close">` — `app-icon` solo acepta `icon`; renderiza fallback `settings`. | `candidate-interview-response.html:177` |
| M18 | `createCandidateInline` sin chequeo de email duplicado (menos robusto que `CandidateForm`). | `candidate-application-form.ts:578-644` |
| M19 | Drag&drop de CV no valida MIME (solo tamaño 10 MB default). | `candidate-cv-upload.html:33`, `file-upload.ts:247-258` |
| M20 | Documentación frontend: `../../../docs/SharedLuxuryApp/Conventions/20260726-guia-shared-reporte-maestro-legacy.md:73-83` pipeline de 8 etapas no cubre las claves reales del mapa `candidate-stage-labels.ts`. | Ídem |
| M21 | Interfaz + enum en un archivo (`IMultiChannelAlertService.cs`), comandos `*Request` en vez de `*Dto`, `.RequireAuthorization("RequireRecruitmentRole")` redundante en `kpis`/`run-automation` (`CandidateProcessEndPoint.cs:28,37`). | Varios |
| M22 | Comentarios de `DependencyInjection.Authorization.cs` con box-drawing corrupto (mojibake de encoding en comentarios, no texto visible). | `DependencyInjection.Authorization.cs` (header + separadores) |

### Matriz de Reglas de Negocio (4 niveles)

| Nivel | Regla | Estado |
|---|---|---|
| 1 · Invariante | Un candidato no puede tener 2 procesos para la misma vacante (índice único). | ✅ Cumple |
| 1 · Invariante | Email y teléfono de candidato únicos (normalizados). | ✅ Cumple (`CandidateAppService.cs:212-218,257-263`) |
| 1 · Invariante | Un candidato contratado no debe duplicarse en 2 alzas — **no hay verificación cruzada** de candidato ya contratado en `direct-hire`/`process-hiring` (solo previene duplicado por vacante, no por persona). | 🟠 Brecha |
| 2 · Flujo | Transiciones de etapa válidas (matriz backend). | ✅ Cumple (`CandidateProcessAppService.cs:1196-1210`) |
| 2 · Flujo | Etapa final "Contratado" solo vía `AltaEnProceso`. | ✅ Cumple (matriz) |
| 2 · Flujo | No archivar candidato con procesos activos. | ✅ Cumple (`CandidateAppService.cs:409-413`) |
| 3 · Seguridad | Endpoints protegidos con política de roles. | 🟠 Brecha: `interviewer-action`/`interview-response` excluyen entrevistadores (A1) |
| 3 · Seguridad | DELETE candidato restringido; impacto evaluado antes de borrar. | ✅ Cumple (`delete-impact`) |
| 4 · Validación | CV/foto: tipo y tamaño validados en backend. | ✅ Cumple (delegado a `SecureFileStorageService.ValidateFile`) |
| 4 · Validación | Foto guardada con extensión correcta. | 🔴 No cumple (A2, `.pdf`) |
| 4 · Validación | Front y back coherentes (email único, PDF). | 🟠 Parcial (M18, M19) |

### Matriz de Permisos (endpoint × política)

| Grupo | Política base | Endpoints | Nota |
|---|---|---|---|
| `api/recruitment-candidates` (10) | `RequireInterviewerRole` | Get/GetById/DeleteImpact/Search/CheckDuplicate/Create/Update/Delete/Archive/Unarchive | Entrevistadores incluidos |
| `api/recruitment-candidate-processes` (28) | `RequireRecruitmentRole` | Tray/ByStage/Kpis/Automation/ById/ByCandidate/Agenda/Board/Queue/View/Create/Update/Multipart/Hiring/Stage/Decision… | 🔴 `interview-response` + `interviewer-action` intentan ampliar y **reducen** (A1) |
| `api/recruitment-candidate-work-experiences` (4) | `RequireInterviewerRole` | CRUD + ByCandidate | |
| `api/recruitment-candidate-interview-results` (3) | `RequireInterviewerRole` | Legacy `[Obsolete]` | |
| `api/recruitment-interviewer-matrix` (7) | `SoloSuperUsuario`; subgrupo `eligible-interviewers` `RequireInterviewerRole` | Matrix CRUD/board/resolve | Patrón de subgrupo correcto |

### Validaciones Front vs Back (tabla comparativa)

| Campo | Frontend | Backend | ¿Coinciden? |
|---|---|---|---|
| Email formato | `InputEmail` | `[EmailAddress]` | ✅ |
| Email único | `checkDuplicate()` async (`candidate-form.ts:272-305`) | Servicio (`CandidateAppService.cs:212-214,257-259`) | ✅ |
| Email único (flujo inline) | ❌ Sin chequeo | ✅ | 🟠 |
| CV tipo PDF | `accept=".pdf"`; drag&drop sin MIME | `SecureFileStorageService.ValidateFile` (firma binaria) | 🟠 |
| CV tamaño | Default 10 MB | Límite de `ValidateFile` | ✅ (back más estricto) |
| CURP | Sin validador de formato | — | 🟠 |

### Scripts de auditoría ejecutados

| Script | Resultado | Nota |
|---|---|---|
| `node scripts/scan-mojibake.mjs client/angular` | ✅ 0 | (La ruta `client/luxuryapp` no existe; se usó `client/angular`.) |
| `npm run audit:icon-names` | 🔴 exit 1 | 5 nombres fuera de catálogo; 4 en el módulo |
| `npm run audit:apps` | 🔴 exit 1 | Cross-app imports (Employee←Candidatos) |
| `npm run audit:css` | 🔴 exit 1 | Sin hallazgos dentro de `candidates/` |
| `npm run audit:tokens` | ✅ exit 0 | 0 hardcodes en el módulo |
| `npm run audit:ui` | ✅ exit 0 | Fronteras shared/ui OK |
| `npm run audit:emoji` | ✅ exit 0 | Genera `reports/emoji-audit.*` |

---

## 5. Plan de Acción

Prioridad ordenada por riesgo/impacto. Cada ítem indica archivos afectados y la regla que restaura.

### 🔴 Alta (corregir ya)

1. **Fix iconos fuera de catálogo (C1).** Validar contra el set real de Iconify `sync-alt`, `event-available-outline`, `unarchive-outline`, `how-to-reg`; dar de alta los conceptos en `app-icon.catalog.ts` o sustituirlos por nombres existentes. Archivos: `candidate-form.html:206,215`, `candidate-recruitment-interviews.html:292,302`, `candidate-work-position-candidates.html:303`. Gate: `audit:icon-names` verde.
2. **Reparar autorización de entrevistadores (A1).** Mover `interview-response` e `interviewer-action` a un subgrupo con política `RequireInterviewerRole` (patrón `InterviewerMatrixEndPoint.cs:14-16`), o cambiar la política base del group. Archivos: `CandidateProcessEndPoint.cs:11,78,84`. Test: un `GerenteOperaciones` debe poder responder entrevista (hoy 403).
3. **Mover `GetSelectVacantesAsync` al hub `SelectItemEndPoints` (C2).** Registrar la ruta en `SystemLuxuryApp/Infrastructure/SelectItem` y consumirla desde el servicio; eliminar el `SelectItemDTO<Guid>` del módulo de negocio. Requiere análisis de impacto (contrato consumido por frontend).
4. **Resolver fronteras de apps (C3).** Los 8 imports de `recursos-humanos.luxuryapp` → `reclutamiento.luxuryapp` deben migrar a tipos/estados en `shared` (DTOs de integración compartidos) o invertirse. Existe dependencia estructural: `Employee` necesita datos del pipeline de candidatos. Propuesta: contrato de integración en `shared` aprobado por Tech Lead. Gate: `audit:apps` verde.
5. **Corregir foto de candidato (A2).** Usar `SaveOrigExt` en `SaveCandidatePhotoAsync` (CV sí es PDF legítimo). Archivos: `CandidateAppService.cs:618-623`.
6. **Implementar notificación de agenda (A3).** Completar `NotifyProcessInterviewScheduledAsync` usando `INotificationDispatcher` (estándar §5.9.1) y el entrevistador/`ScheduledAt` de `CandidateInterview`.

### 🟠 Media (siguiente iteración)

7. **Unificar allowlist de entrevistadores (A4).** `InterviewerMatrixAppService` debe consumir `CandidateInterviewerRoles.Values`; eliminar la lista hardcodeada.
8. **Orden archivo-vs-BD (A5).** Transaccionar y reordenar: BD primero, disco después (patrón `CustomDocumentAppService` de CONVENTIONS §6.1); borrar disco solo tras commit.
9. **Resolver redundancia BD (A8).** Plan de migración aprobado: eliminar `RequestEmployeeRegister.CandidateId` redundante o declararlo fuente; unificar `Folio`/`ConfirmationFinish`; derivar fechas/estados de una sola tabla (candidato: `CandidateProcess` como fuente del estado del pipeline). Requiere FASE 0 + plan.
10. **Centralizar agenda status (A7).** Una sola fuente (componente compartido o catálogo) reemplazando las 3 listas.
11. **Constante única de `allowedRoles` (A6).** Extraer a constante del módulo.
13. **Refactor `CandidateProcessAppService` (2652 líneas).** Extraer: transiciones de etapa, alta de empleado (sync banco/clínica/emergencia), notificaciones, queries de bandejas.

### 🟡 Baja (mantenimiento)

14. **Limpiar basura del feature (M10):** eliminar 6 `.md` de raíz y `modulo-candidates-doc.html` (con aprobación); mover `recruitment-agenda-list.*` a subcarpeta.
15. **DTOs:** `CandidateHiringDocumentListItemDto` hereda `GuidIdEntityDTO` (M1); renombrar comandos `*Request` → `*Dto` (M21).
16. **Eliminar capa legacy:** depurar `CandidateInterviewResultAppService` `[Obsolete]` + 12 métodos `Notify*Application*` (M3, M4) tras confirmar consumo.
17. **Fix `IsActive` fantasma (M2), `assignedUserIds` (M5), `GetInterviewerDisplayName` (M6), `HttpClient` propio (M7), `Guid.NewGuid`→v7 (M8), strings de roles→políticas (M9).**
18. **Suscripciones sin cleanup (3.2):** `takeUntilDestroyed` en `candidate-application-form.ts:127,131,136` y `paramMap` (M18).
19. **Icono roto `<app-icon name=...>` (M17)** → `[icon]`.
20. **Paginación server-side (M14), doble fetch (M15), ternario muerto (M16).**
21. **Actualizar READMEs backend y frontend (M12, M13, M20)** y la referencia a `nueva-extructuraV3.md` en el docstring (M11).
22. **GUIDs hardcodeados de negocio (`CustomerLuxury.cs:10`)**: validar como constante oficial aprobada.

**Criterio de cierre (Enterprise):** `npm run lint` (audit:encoding + emoji + css + ui + apps + design + tokens) en verde, `audit:ds` en verde, `audit:icon-names` en verde, y reporte de redundancia BD con plan de migración aprobado.

---

## Anexo — Nota operativa

- La ruta `client/luxuryapp` indicada en `AGENTS.md` no existe en el repo (existen `client/angular`, `client/flutter`, `client/flutter-migration`). El escáner de mojibake se ejecutó contra `client/angular`. **Acción:** actualizar `AGENTS.md` a la ruta real.
- El módulo `candidates/` cuenta con los 3 docs frontend obligatorios (`../../../docs/SharedLuxuryApp/Conventions/20260726-guia-shared-reporte-maestro-legacy.md`, `setup.md`, `decisiones.md`) y README backend. ✅ Estructura documental §4.7 cumplida (salvo drift de contenido, M12/M13).
