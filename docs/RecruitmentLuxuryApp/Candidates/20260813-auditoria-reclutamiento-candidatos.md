# Auditoría Exhaustiva: Módulo Reclutamiento > Candidates

**Fecha de Auditoría:** 2026-08-13  
**Auditor:** Antigravity AI  
**Módulo Auditado:** Reclutamiento > Candidates  
**Backend:** `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/`  
**Frontend:** `client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/`  
**Estado:** ✅ Auditoría Completada  
**Hallazgos Críticos:** 4 | Altos:** 3 | Medios:** 2

---

## 📊 Resumen Ejecutivo

La auditoría actual ha evaluado el estado de cumplimiento del módulo bajo las convenciones rectoras, así como los nuevos **requerimientos explícitos** solicitados. 

**Estado de Remediación (respecto a la auditoría del 2026-08-10):**
- ❌ Los endpoints continúan sin Políticas de Autorización (`RequireAuthorization()` sin `Policy`).
- ❌ La eliminación/archivado de candidatos sigue sin validar si el candidato tiene postulaciones activas.
- ❌ Falta comprobación de empalmes horarios (overlapping) al agendar entrevistas.

---

## 1. Verificación de Requerimientos Explícitos

| Requerimiento | Frontend | Backend | Estado General | Notas y Hallazgos |
|--------------|----------|---------|----------------|-------------------|
| **Registrar candidatos** | ✅ Implementado | ✅ Implementado | ✅ OK | Funcional en `CandidateAppService.CreateAsync`. |
| **Archivar candidatos** | ✅ Implementado | ❌ Incompleto | 🔴 CRÍTICO | El backend (`ArchiveAsync`) **no valida** si el candidato tiene postulaciones activas, rompiendo la integridad (Fallo heredado). |
| **Desarchivar candidatos** | ✅ Implementado | ✅ Implementado | ✅ OK | Funcional. |
| **Filtrar candidatos** | ✅ Implementado | ✅ Implementado | ✅ OK | Filtros soportados en paginación (`GetListAsync`). |
| **Eliminar permanentemente (confirmación y cascada)** | ✅ Implementado | ✅ Implementado | ✅ OK | El backend usa `GetDeleteImpactAsync` y borra en cascada. |
| **Agenda: Matriz de Entrevistadores por default** | ✅ Implementado | ✅ Implementado | ✅ OK | Funcional mediante `InterviewerMatrix` en `CreateInterviewAsync`. |
| **Agenda: No fechas pasadas** | ⚠️ Falta Frontend | ❌ Falta Backend | 🔴 CRÍTICO | `CreateInterviewAsync` no verifica si `dto.ScheduledAt < DateTime.UtcNow`. |
| **Agenda: No candidato misma vacante** | ⚠️ Falta Frontend | ⚠️ Parcial | 🟠 ALTO | El backend transiciona la postulación existente en vez de crear otra, pero no bloquea explícitamente el doble-agendamiento (agendar cuando ya hay agenda existente en curso). |
| **Agenda: No empalmar hora/día para otra vacante** | ❌ No Implementado | ❌ No Implementado | 🔴 CRÍTICO | El sistema no consulta si el candidato (`CandidateId`) ya tiene otra entrevista cruzada en `CandidateInterview` a la misma hora. |
| **Agenda: Notificaciones (Push, Email, App, WA)** | ✅ Frontend Llama | ⚠️ Falta Orquestador | 🟠 ALTO | `SubmitFeedbackAsync` notifica pero `CreateInterviewAsync` delega a `CandidateProcessAppService` donde falta asegurar triggers cross-channel completos. |
| **KPIs de entrevistas y filtro por estado** | ✅ Implementado | ✅ Implementado | ✅ OK | Rutas `CandidateInterviewItemDto`. |
| **Cancelar entrevista (detona notificación)** | ✅ Implementado | ✅ Implementado | ✅ OK | `CancelInterviewAsync` detona cancelación en `CandidateProcessAppService`. |
| **Ver respuesta de entrevista** | ✅ Implementado | ✅ Implementado | ✅ OK | Soportado mediante los ItemDtos que devuelven Rating/FeedbackText. |
| **Entrevistador Queue (`/directory/employee-interviewer-queue`)** | ✅ Implementado | ✅ Implementado | ✅ OK | Listado de vacantes, KPIs, CV y opción de respuesta operando correctamente. |

---

## 2. Matriz de Reglas de Negocio (Niveles 1-4)

Fuente: `docs/architecture/reclutamiento-candidates-design.md` y Requerimientos Adicionales.

### Nivel 1: Invariantes de Dominio

| RN | Descripción | Implementación | Estado |
|----|------------|---|--------|
| **RN-CAND-001** | Candidato es singular por email | ❌ Faltan constraints en DTO/BD | 🔴 CRÍTICO |
| **RN-CAND-006** | No se archiva candidato con postulaciones activas | ❌ Método `ArchiveAsync` en Backend | 🔴 CRÍTICO |
| **RN-CAND-NEW1** | Entrevista no puede tener fecha pasada | ❌ Método `CreateInterviewAsync` | 🔴 CRÍTICO |
| **RN-CAND-NEW2** | Candidato no puede tener entrevistas empalmadas | ❌ Falta query preventiva | 🔴 CRÍTICO |

### Nivel 2: Flujos y Transiciones

Las etapas del sistema están funcionando correctamente bajo el flujo del `CandidateProcess`, y los métodos como `CreateInterviewAsync` adaptaron lógica legacy hacia el nuevo orquestador de etapas, lo cual es positivo y previene estados fantasmas.

### Nivel 3: Seguridad y Autorización

| Recurso | Rol Autorizado | Implementación | Estado |
|---------|---|---|--------|
| **Todos los Endpoints** (`CandidateEndPoint`, `CandidateInterviewEndPoint`) | Especificado por endpoint | ❌ `.RequireAuthorization()` sin Policy | 🔴 CRÍTICO |

**Impacto:** 24 Endpoints están utilizando la autorización base, lo que permite que CUALQUIER usuario autenticado acceda a endpoints de creación, edición o borrado, rompiendo la segregación de funciones entre "Reclutamiento" y "Entrevistador".

---

## 3. Cumplimiento de Normativas (Script de Verificación Rápida)

### Frontend (Angular)
- **Standalone:** Cumplido (0 `*.module.ts`).
- **Signals:** 25 usos de Signals, sin BehaviorSubject legacy ✅.
- **Flujo de Control:** Predominancia de `@if`/`@for` (21 usos) vs legacy `*ngIf` (1 uso residual).
- **Consumo de APIs:** Uso del `ApiResponseService` en 23 locaciones ✅. Sin `HttpClient` directos.
- **Diseño Visual:** Cero usos detectados de colores Hex/RGB quemados. Cero px fijos (CSS Hardcoded). Todo se consume vía variables del Design System ✅.

### Backend (.NET)
- **Minimal APIs:** Correctamente en uso.
- **DTOs:** 38 DTOs, todos posicionados correctamente en la carpeta Contracts ✅.
- **Validaciones FluentValidation:** ❌ Cero (0) implementaciones detectadas de `*Validator.cs`. (Los DTOs podrían usar validadores con data-annotations, pero FluentValidation es el estándar preferido para reglas compuestas como fechas pasadas o empalmes).
- **SelectItems Centralizados:** Cumplido (0 violaciones de select items en módulo).

---

## 4. Plan de Remediación (Backlog de Acciones)

Para resolver las discrepancias y errores identificados, se deben implementar las siguientes tareas:

### 🔴 Prioridad Crítica (Inmediato)
1. **Validaciones en Agenda de Entrevistas (`CandidateInterviewAppService.cs`):**
   - Incorporar validación: `if (dto.ScheduledAt < DateTime.UtcNow) throw new BusinessException("No se pueden agendar entrevistas en el pasado.", "INVALID_DATE", 400);`.
   - Incorporar validación de empalme: Buscar en BD si `CandidateInterview` existe para ese `CandidateId` en la ventana de `ScheduledAt` (ej. +/- 1 hora).
2. **Validación al Archivar (`CandidateAppService.cs`):**
   - En `ArchiveAsync`, revisar: `bool hasActive = await dbContext.CandidateApplication.AnyAsync(x => x.CandidateId == id && x.ClosedAt == null);`. Bloquear si es verdadero.
3. **Políticas de Autorización en Endpoints:**
   - Modificar `RequireAuthorization()` a `RequireAuthorization(Policy = "Require[Role]Policy")` en los 24 mapeos de la API, separando claramente permisos de RRHH vs Entrevistadores.
4. **Validación de unicidad de Email (`Candidate.cs`):**
   - Insertar una migración para agregar index único y asegurar que en la creación/actualización exista una verificación de `Email` único.

### 🟠 Prioridad Alta (Corto Plazo)
5. **Verificación cross-channel Notificaciones:**
   - Confirmar que `candidateProcessAppService.ScheduleAsync` llama a la capa orquestadora que envía Push, Email y WhatsApp, como lo hace `SubmitFeedbackAsync`.
6. **Constraint de Doble Agenda (Misma vacante):**
   - Retornar error si se intenta agendar una nueva entrevista cuando ya existe una pendiente/activa en la misma postulación.

---

**Firma Auditor AI:** Antigravity  
**Fecha:** 2026-08-13  
