# Plan de Remediación — Módulo Reclutamiento > Candidates

**Fecha:** 2026-08-13
**Versión:** Única vigente (consolida planes previos 2026-08-04/05/09/11, eliminados)
**Alcance:** Backend `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/` + Frontend `client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/`
**Duración estimada:** 3 fases (~6-8 semanas)
**Severidad:** 🔴 CRÍTICA (DTOs en archivos compartidos, PrimeNG directo, iconos retirados, guards sin rol)
**Basado en:** `docs/reporte_maestro/modulos/20260813-auditoria-reclutamiento-candidatos-revision.md`
**Estado:** Pendiente de aprobación Tech Lead

---

## Resumen Ejecutivo

La auditoría del 2026-08-13 detectó **6 críticos, 7 altos, 7 medios y 2 documentales** en
Candidates. El trabajo funcional previo (flujo inline de postulación, agenda, KPIs,
notificaciones, navegación Reclutamiento) quedó ejecutado y **no se revierte**; este plan
cubre solo la deuda de convenciones y lógica detectada en esta revisión.

Plan:
1. **Fase 1** (1-2 sem): Remediación de incumplimientos críticos (6 tareas)
2. **Fase 2** (3-6 sem): Remediación de incumplimientos altos (7 tareas)
3. **Fase 3** (2 meses): Deuda media + documentación (8 tareas)

---

## Fase 1 — Críticos (1-2 semanas)

### Objetivo
Eliminar violaciones críticas de convención que ponen en riesgo visibilidad de iconos,
integridad de DTOs y correcta reactividad.

### Tareas

**1.1 Separar DTOs en archivos únicos (C1)**

Cada tipo debe vivir en su propio archivo (`dto-file-organization-rule.md`, sin excepciones).

- [x] Crear `CandidateApplication/DTOs/FuenteKpiItem.cs` con `FuenteKpiItem` (mover de `CandidateApplicationKpisDto.cs:106`)
- [x] Crear `CandidateApplication/DTOs/CandidateInterviewerQueueItemDto.cs` (mover de `CandidateInterviewerQueueDto.cs:46`)
- [x] Crear `CandidateApplication/DTOs/CandidateInterviewTimelineItem.cs` (mover de `CandidateInterviewResponseDto.cs:28`)
- [x] Crear `CandidateApplication/DTOs/InterviewerActionRequest.cs` y `InterviewerActionType.cs` (mover de `InterviewerApplicationViewDto.cs:79,108`)
- [x] Actualizar `using` y referencias en AppServices/EndPoints que consumen esos tipos
- [x] `dotnet build` sin errores

**Deliverable:** 4 archivos multi-DTO eliminados; 1 archivo = 1 DTO en todo el módulo.

---

**1.2 Heredar `GuidIdEntityDTO` en `CandidateInterviewTimelineItem` (C2)**

- [x] Cambiar `public record CandidateInterviewTimelineItem` → hereda `GuidIdEntityDTO` (`CandidateInterviewResponseDto.cs:28`)
- [x] Eliminar `public Guid Id` explícito (`:30`)
- [x] `dotnet build` sin errores

**Deliverable:** Cero DTOs con `Id` sin herencia en el módulo.

---

**1.3 `ChangeDetectionStrategy.OnPush` en `candidate-detail` (C3)**

- [x] Cambiar `ChangeDetectionStrategy.Eager` → `ChangeDetectionStrategy.OnPush` (`candidate/candidate-detail.ts:29`)
- [x] Verificar que el template no dependa de detección agresiva (async pipes/signals ya usados)
- [x] Correr specs `candidate-detail.spec.ts`

**Deliverable:** 100% del feature con `OnPush`.

---

**1.4 Sustituir `mdi-close` por `<app-icon>` (C4)**

- [x] Eliminar `<i class="mdi mdi-close text-xl">` (`candidate-interview-response.html:177`)
- [x] Reemplazar por `<app-icon>` con nombre del catálogo `app-icon.catalog.ts` (ej. `material-symbols-light:close`)
- [x] Declarar `AppIconComponent` en `imports` del componente
- [x] `npm run audit:icon-names` sin nuevos hallazgos

**Deliverable:** 0 clases `mdi:`/`pi pi-` en el feature.

---

**1.5 Quitar `p-progressBar` de PrimeNG (C5)**

- [x] Eliminar `import { ProgressBarModule } from "primeng/progressbar"` (`candidate-application-kpis.ts:15`)
- [x] Reemplazar `<p-progressBar>` del template por wrapper oficial de `shared/ui` (o `@ui/*` equivalente)
- [x] Verificar que el único PrimeNG restante en el feature es `p-table`
- [x] `npm run lint` sin violaciones nuevas (modo baseline)

**Deliverable:** Sin PrimeNG directo fuera de la excepción `p-table`.

---

**1.6 Reemplazar `[(ngModel)]` sobre señal (C6)**

- [x] Eliminar `[(ngModel)]="selectedReasonId"` (`candidate-interview-response.html:188`)
- [x] Usar evento explícito sobre la señal (`onChange`/`@output` del control) o `link` de signal
- [x] Eliminar `FormsModule` de imports si ya no se usa
- [x] Correr spec del componente

**Deliverable:** Signals como única fuente de verdad en el feature.

---

## Fase 2 — Altos (3-6 semanas)

### Objetivo
Cerrar brechas de seguridad, autorización y contratos: unificar políticas, validar
transiciones de etapa y proteger rutas por rol.

### Tareas

**2.1 Unificar autorización por política (A1)**

- [ ] Inventariar los 3 patrones actuales en los 8 EndPoints (inline 9 roles, `RequireRecruitmentRole`, `SoloSuperUsuario`)
- [ ] Definir políticas por rol en `DependencyInjection.Authorization.cs` (p. ej. `RequireRecruitmentRole`, `RequireInterviewerRole`, `RequireAdminRole`)
- [ ] Reemplazar la lista inline de 9 roles por la política correspondiente en cada `RequireAuthorization`
- [ ] Verificar que `CandidateProcessEndPoint.cs:64,70` y `CandidateApplicationEndPoint.cs:97` pasan a política
- [ ] Revisar que no quede drift entre archivos del mismo módulo
- [ ] Test manual: rol sin permiso → 403

**Deliverable:** Un solo patrón de autorización en el módulo; cero strings de roles repetidos.

---

**2.2 Validar transiciones en `ChangeStageAsync` canónico (A2)**

- [ ] Reutilizar/extraer `ValidateStageTransition()` del modelo legacy (`CandidateApplicationAppService.cs:1396`) a un validador compartido
- [ ] Llamarlo en `CandidateProcessAppService.cs:1029` antes de `model.CurrentStage = request.ToStage`
- [ ] Retornar `BusinessException` (400) ante transición inválida
- [ ] Validar también bloqueos de agenda (no empalme, no fecha pasada) heredados de auditoría previa
- [ ] Test: `POST /api/recruitment-candidate-processes/{id}/stage` con `Nuevo → Contratado` → 400

**Deliverable:** RN-CAND-007 cumplida en el modelo canónico; sin saltos arbitrarios.

---

**2.3 Guard por rol en rutas candidates (A3)**

- [ ] Crear/`reutilizar` un guard funcional por rol (`CanActivateFn`) verificando el rol del usuario
- [ ] Aplicarlo en `candidates.routing.ts:16,28,40,52,64,76,88,100,113` (junto a `authGuard`)
- [ ] Mapear rol requerido por ruta contra roles de los endpoints backend correspondientes
- [ ] Test: navegar a `applications` sin rol → 403

**Deliverable:** Cada ruta del feature con guard por rol coherente con backend.

---

**2.4 Migrar `confirm()` a `DialogHandlerService` (A4)**

- [ ] Reemplazar `confirm(...)` (`candidate-interviewer-queue.ts:204`) por `DialogHandlerService.confirm(...)`
- [ ] Ajustar el flujo async de `onMarkNoShow`
- [ ] Verificar comportamiento en vista mobile

**Deliverable:** Cero `confirm()`/`alert()` nativos en el feature.

---

**2.5 Navegación por constantes (A5)**

- [ ] Agregar rutas de candidates a `core/routing/route-paths.ts` (bloque `RECLUTAMIENTO`)
- [ ] Reemplazar los 8 `navigate("/recruitment/candidates/...")` + 1 `routerLink` por las constantes:
  - `candidate-interview-response.ts:105`
  - `candidate-interviewer-queue.ts:174,183`
  - `candidate-recruitment-interviews.ts:138,144`
  - `candidate-work-position-candidates.ts:217,223`
  - `recruitment-agenda-list.ts:137`
  - `candidate-interview-pending-list.html:7`
- [ ] Verificar que `route-paths.ts` no entre en conflicto con rutas existentes

**Deliverable:** 0 rutas hardcodeadas; navegación vía constantes.

---

**2.6 Sustituir `@iplab/ngx-file-upload` (A6)**

- [ ] Verificar si existe wrapper oficial de subida de archivos en `shared/ui` (o el patrón de `Document Display Pattern`)
- [ ] Si no existe, proponer wrapper y esperar aprobación antes de crear
- [ ] Migrar `candidate-cv-upload.ts:13-14` al wrapper
- [ ] Validar flujo CV en alta de candidato y en postulación

**Deliverable:** Sin dependencias UI de terceros en el feature.

---

**2.7 Reemplazar magic numbers de `action` (A7)**

- [ ] Definir en frontend un tipo/enum que replique `InterviewerActionType` backend (`InterviewerApplicationViewDto.cs:108`)
- [ ] Sustituir `action: 1` (`candidate-interviewer-queue.ts:210`) por el enum `MarkNoShow`
- [ ] Sustituir `action: 3` (`:221`) por `Approve`
- [ ] Verificar el servicio `candidate-interviewer-queue.service.ts` mapea el enum a su valor de contrato

**Deliverable:** Contrato de acción tipado; cero magic numbers.

---

## Fase 3 — Medios + Documentación (2 meses)

### Objetivo
Cerrar deuda media de persistencia, validación, tokens y documentación.

### Tareas

**3.1 Índice UNIQUE de email en BD (M1)**

- [ ] Script de dedupe de emails previo a migración (identificar/merge duplicados existentes)
- [ ] Configurar `HasIndex(x => x.Email).IsUnique()` en `ApplicationDbContext` (config de `Candidate`)
- [ ] Crear migración EF Core
- [ ] Mantener validación en app (`CandidateAppService.cs:215,246`) como primera barrera
- [ ] Test: insertar email duplicado → error de constraint

**Deliverable:** RN-CAND-001 con constraint real en BD.

---

**3.2 `[Required]` + `[EmailAddress]` en email (M2)**

- [ ] Agregar atributos a `CandidateCreateOrUpdateDto.Email` (`Candidate/DTOs/CandidateCreateOrUpdateDto.cs:22`)
- [ ] Alinear validación del formulario frontend (`candidate-form.ts`)
- [ ] `dotnet build` + spec de form

**Deliverable:** Email validado en DTO y frontend de forma consistente.

---

**3.3 Tokenizar colores de KPIs (M3)**

- [ ] Mover los hex de `candidate-application-kpis.ts:347-355,385-389,411-421,438,444,460` a tokens `var(--ds-*)`/`--primary-*`
- [ ] Definir mapping de etapa→token (no literal)
- [ ] `npm run audit:design` sin hex fuera de baseline

**Deliverable:** 0 hex literales en el feature.

---

**3.4 Eliminar inline px y utility classes (M4)**

- [ ] `candidate-application-kpis.html:24` (`width: 48px; height: 48px`) → tokens de tamaño/spacing
- [ ] `candidate-interview-response.html:167` (`max-width: 500px; min-width: 320px`) → tokens/responsive
- [ ] `candidate-interview-response.html:176` (utility Tailwind `hover:bg-gray-100`) → clases DS
- [ ] `npm run audit:css` sin violaciones nuevas

**Deliverable:** 0 inline styles/utility classes; solo tokens.

---

**3.5 `@if` en vez de `*ngIf` (M5)**

- [ ] Sustituir `*ngIf="loading()"` por `@if (loading())` (`candidate-application-kpis.html:1`)
- [ ] Revisar el resto del feature por `*ngIf`/`*ngFor` residuales
- [ ] `npm run lint`

**Deliverable:** 100% control flow nuevo (`@if`/`@for`).

---

**3.6 Allowlist explícita de roles (M6)**

- [ ] Reemplazar el rango de enum (`InterviewerMatrixAppService.cs:254-255`) por la allowlist `CandidateInterviewerRoles.Values`
- [ ] Verificar RN-CAND-020 no se altera
- [ ] Test unitario de `IsCorporateOrStaffRole`

**Deliverable:** Sin dependencia de orden de enum; allowlist centralizada.

---

**3.7 Constante de tamaño de archivo (M7)**

- [ ] Extraer `10485760` (`candidate-cv-upload.ts:123`) a constante tipada (con nombre y unidad)
- [ ] Alinear límite con validación backend si difiere
- [ ] Documentar límite

**Deliverable:** Cero magic numbers; límites auditables.

---

**3.8 Alinear README (D1, D2)**

- [ ] Corregir duplicado de `CandidateApplicationProcessHiringDto.cs` en `Candidates/README.md:153-154`
- [ ] Actualizar estados de hallazgos ya remediados (email único app, archivar con activas, políticas)
- [ ] Verificar rutas/endpoints publicados contra código real
- [ ] `node scripts/scan-mojibake.mjs client/luxuryapp` → 0 mojibake

**Deliverable:** README sin contradicciones con el código.

---

## Cronograma

```
Semana 1-2 (2026-08-17 a 2026-08-30):
  └─ Fase 1: T1-T6 (críticos)
     └─ Entregable: PR remediación críticos

Semana 3-6 (2026-08-31 a 2026-09-26):
  └─ Fase 2: T7-T13 (altos)
     └─ Entregable: PR seguridad/contratos/rutas

Semana 7-8 (2026-09-27 a 2026-10-10):
  └─ Fase 3: T14-T21 (medios + docs)
     └─ Entregable: PR persistencia/tokens/docs

Cierre:
  └─ Re-auditoría del módulo (0 críticos y 0 altos)
```

---

## Recursos Requeridos

| Recurso | Cantidad | Fase |
|---------|----------|------|
| Backend Developer | 1 FTE | Fases 1-2-3 |
| Frontend Developer | 1 FTE | Fases 1-2-3 |
| Tech Lead (review + aprobación migración) | 0.5 FTE | Fases 2-3 |
| DBA (dedupe emails + migración índice) | 4 horas | Fase 3 (3.1) |

---

## Validación de Éxito

✅ **Backend:**
- [ ] 1 archivo = 1 DTO en todo el módulo
- [ ] Cero DTOs con `Id` sin `GuidIdEntityDTO`
- [ ] Autorización por política única; sin inline de roles
- [ ] `ChangeStageAsync` rechaza transiciones inválidas (400)
- [ ] Índice UNIQUE de email en BD
- [ ] Email `[Required]` + `[EmailAddress]` en DTO

✅ **Frontend:**
- [ ] 100% `OnPush`; 0 `*ngIf`/`*ngFor`
- [ ] Sin PrimeNG fuera de `p-table`
- [ ] 0 `mdi:`/`pi pi-`; `<app-icon>` declarado
- [ ] 0 hex/px literales fuera de tokens
- [ ] Guards por rol en todas las rutas
- [ ] Navegación por constantes; 0 rutas hardcodeadas
- [ ] Sin `confirm()`/`alert()` nativos
- [ ] Contrato de `action` tipado

✅ **Cierre:**
- [ ] Re-auditoría: 0 críticos y 0 altos
- [ ] `npm run lint` sin violaciones nuevas (baseline)
- [ ] `npm run audit:design` sin hex fuera de baseline
- [ ] `node scripts/scan-mojibake.mjs client/luxuryapp` → 0 mojibake

---

## Riesgos y Mitigación

| Riesgo | Severidad | Mitigación |
|--------|-----------|-----------|
| Separar DTOs rompe contratos consumidos | 🔴 CRÍTICA | Compilación + revisión de `using`; PR aislado |
| Cambio a política de autorización bloquea roles legítimos | 🔴 CRÍTICA | Test manual por rol antes de merge |
| Validar transiciones canónicas rompe flujo operativo | 🟠 ALTA | Validar matriz de transiciones contra escenarios reales en staging |
| Migración email UNIQUE falla por duplicados | 🔴 CRÍTICA | Dedupe previo + backup; migración reversible |
| Wrapper CV compartido aún no existe | 🟠 ALTA | Proponer wrapper y esperar aprobación antes de crear (no asumir) |

---

## Dependencias

- `CONVENTIONS.md` §4.4, §5.8 y `audit-module-conventions.md` ✅
- `dto-file-organization-rule.md` ✅ (documento normativo)
- `ui/icon-usage-rule.md` + `app-icon.catalog.ts` ✅
- `shared/ui` wrapper de subida de archivos 🟡 (puede requerir propuesta + aprobación, tarea 2.6)
- `DependencyInjection.Authorization.cs` ✅ (políticas ya registradas para `RequireRecruitmentRole`/`SoloSuperUsuario`)
- Auditoría: `docs/reporte_maestro/modulos/20260813-auditoria-reclutamiento-candidatos-revision.md` ✅

---

**Plan aprobado:** Pendiente Tech Lead
**Próximo paso:** Aprobar Fase 1 e iniciar T1-T6