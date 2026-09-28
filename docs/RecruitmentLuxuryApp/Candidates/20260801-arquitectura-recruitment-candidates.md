# Reclutamiento: Candidates Module - Architectural Design

**Última revisión:** 2026-08-10  
**Módulos:** Backend: `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/` | Frontend: `client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/`  
**Status:** ✅ Vigente (Auditoría 2026-08-09)

---

## Propósito

Documento **permanente** que explica las decisiones de diseño arquitectónico del módulo Candidates. Define por qué se separó Candidate vs CandidateApplication, cómo fluye un candidato por el pipeline, y qué acoplamiento existe con otros módulos.

---

## 1. Principios de Diseño (Irrompibles)

| Principio | Razón | Implicación |
|-----------|-------|------------|
| **No romper `RequestPosition`** | Solicitudes de posición son una entidad anterior, existente desde v1.0 | Cada CandidateApplication referencia exactamente una RequestPosition |
| **No crear Employee sin datos completos** | Compliance/RRHH requiere: número de empleado, salario, contrato, jefe | CandidateApplication → RequestEmployeeRegister → Employee (con validación) |
| **Capturar datos una sola vez** | No rellenar CV en múltiples formularios | CV se carga una sola vez en Candidate, se reutiliza en postulaciones |
| **Un entrevistador por candidato** | Evitar conflictos de feedback contradictorio | CandidateApplication.AssignedInterviewerId es singular (not array) |
| **Pipeline es público** | Transparencia: candidato puede ver dónde está | Enum `ApplicationStage` es inmutable, todos los clientes ven igual |
| **Decisión es final** | Rechazado o Contratado cierran el flujo | No permitir reactivar una postulación cerrada |

---

## 2. Entidades Principales (Por Qué Así)

### **Candidate** (Ficha Maestra - Singular por Persona)

```
Candidate (1 x persona) {
  Id: Guid
  Email: string (único en el sistema, clave natural)
  FullName: string
  PhoneNumber: string
  CvUrl: string (URL segura via IFileReadPathService)
  CreatedDate: DateTime
  ArchivedDate: DateTime? (soft delete)
}
```

**Decisión:** Candidate es la **entidad maestra de una persona física**. Independiente de postulaciones.

**Razón:** Una persona puede postularse a múltiples posiciones. No duplicar datos personales.

**Acoplamiento:** 
- ✅ 1:N con CandidateApplication (una persona, muchas postulaciones)
- ✅ CV es inmutable en Candidate (se captura 1 sola vez)
- ❌ Candidate NO referencia Employee (pueden ser dos personas diferentes)

---

### **CandidateApplication** (Postulación - Singular por Posición × Persona)

```
CandidateApplication (1 × RequestPosition × Candidate) {
  Id: Guid
  CandidateId: Guid (FK → Candidate)
  RequestPositionId: Guid (FK → RequestPosition) 
  Stage: ApplicationStage (enum: 10 valores)
  AppliedDate: DateTime
  AssignedInterviewerId: Guid? (FK → User/EmployeeAppService)
  DecisionDate: DateTime?
  DecisionReason: string?
  DecisionReasonId: Guid? (FK → CandidateDecisionReason)
  EmployeeId: Guid? (FK → Employee) [populated after "Hired"]
}
```

**Decisión:** CandidateApplication es la **bandeja canónica de seguimiento**. No Candidate.

**Razón:** 
- Candidato puede postularse a 5 posiciones → 5 aplicaciones diferentes
- Cada aplicación tiene su propio stage, entrevistador, decisión
- Es la entidad que se consulta en "Bandeja de Postulaciones"

**Acoplamiento:**
- ✅ N:1 con Candidate (muchas postulaciones de 1 persona)
- ✅ N:1 con RequestPosition (muchas postulaciones por posición)
- ✅ N:1 con CandidateInterview (múltiples entrevistas por aplicación)
- ✅ 1:1 con Employee (solo si Stage = Hired)
- ✅ Ref a RequestEmployeeRegister (para crear empleado)

---

### **CandidateInterview** (Retroalimentación - 1:N × Postulación)

```
CandidateInterview {
  Id: Guid
  CandidateApplicationId: Guid (FK → CandidateApplication)
  InterviewerUserId: Guid (FK → User)
  FeedbackDate: DateTime
  FeedbackText: string
  Rating: int (1-5)
}
```

**Decisión:** CandidateInterview es **N:1 con CandidateApplication**.

**Razón:** Una postulación puede tener múltiples entrevistas (técnica, recursos, gerencial).

**Acoplamiento:**
- ✅ N:1 con CandidateApplication
- ✅ Entrevistadores pueden ser diferentes por cada interview
- ✅ Solo lectura en aplicación (histórico)

---

### **CandidateDecisionReason** (Catálogo de Motivos)

```
CandidateDecisionReason {
  Id: Guid
  Name: string (ej: "No cumple requisitos técnicos")
  ReasonType: enum (Rejected | Withdrawn | OnHold)
  IsActive: bool
}
```

**Decisión:** Catálogo fijo de motivos de rechazo/cierre.

**Razón:** Compliance/Analytics necesita agrupar decisiones por motivo.

**Acoplamiento:**
- ✅ N:1 con CandidateApplication (referencia opcional)

---

## 3. Pipeline: Las 10 Etapas (Irrompible)

```
enum ApplicationStage {
  New = 0,                    // 📋 Postulación abierta
  AwaitingInterview = 1,      // ⏳ En cola para entrevistar
  Interviewed = 2,            // 🎤 Ya entrevistado
  AwaitingOpsReview = 3,      // 🔍 Esperando validación operaciones
  OpsApproved = 4,            // ✅ Operaciones aprueba
  AwaitingHiringProcess = 5,  // 📝 Esperando crear empleado
  Hired = 6,                  // 🎉 Empleado creado
  Rejected = 7,               // ❌ Rechazado (final)
  Withdrawn = 8,              // 🚪 Candidato retiró (final)
  OnHold = 9                  // ⏸️ En espera (temporal)
}
```

**Transiciones Válidas (Matriz):**

| Desde | A | Quién | Validación |
|------|---|------|-----------|
| New | AwaitingInterview | Reclutamiento | - |
| New | Rejected | Reclutamiento | Motivo requerido |
| New | OnHold | Reclutamiento | - |
| AwaitingInterview | Interviewed | Entrevistador asignado | CV validado |
| Interviewed | AwaitingOpsReview | Reclutamiento | Retroalimentación completada |
| Interviewed | Rejected | Reclutamiento | Motivo requerido |
| AwaitingOpsReview | OpsApproved | Operaciones | Datos completos |
| AwaitingOpsReview | Rejected | Operaciones | Motivo requerido |
| OpsApproved | AwaitingHiringProcess | Reclutamiento | - |
| AwaitingHiringProcess | Hired | Auto (backend) | RequestEmployeeRegister exitoso |
| AwaitingHiringProcess | Rejected | RH | Rechazo en crear empleado |
| OnHold | AwaitingInterview | Reclutamiento | - |
| OnHold | Rejected | Reclutamiento | Motivo requerido |
| Rejected | - | (final) | No reversible |
| Withdrawn | - | (final) | No reversible |
| Hired | - | (final) | No reversible |

**Reglas Críticas:**
- ❌ No saltar etapas (New → OpsApproved está prohibido)
- ❌ No retroceder una vez en estado final
- ✅ Solo Reclutamiento puede mover entre fases operacionales

---

## 4. Flujo de un Candidato (End-to-End)

```
┌─────────────────────────────────────────────────────────────┐
│ Semana 1: Postulación                                       │
├─────────────────────────────────────────────────────────────┤
│ 1. Candidate (persona) abre postulación                      │
│    → Si NO existe en BD: crear Candidate + CV                │
│    → Si EXISTE: reutilizar Candidate                         │
│                                                              │
│ 2. Crear CandidateApplication (postulación)                 │
│    → Stage = New                                             │
│    → LinkedTo: RequestPosition (ej: "Dev Senior - Bogotá")  │
│    → CV: FK a Candidate.CvUrl                               │
│                                                              │
│ 3. Sistema notifica Reclutamiento                            │
│    → "Nuevo candidato: Juan Pérez para Dev Senior"           │
│                                                              │
│ 4. Reclutamiento mueve a Stage = AwaitingInterview          │
│    → Sistema asigna Entrevistador (RequestPosition.Manager)  │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│ Semana 2: Entrevista                                         │
├─────────────────────────────────────────────────────────────┤
│ 5. Entrevistador realiza entrevista                          │
│    → Crea CandidateInterview (retroalimentación)             │
│    → Rating: 4/5 (muy bueno)                                 │
│    → Feedback: "Excelentes conocimientos en React..."        │
│                                                              │
│ 6. Reclutamiento mueve a Stage = Interviewed                │
│    → Sistema requiere: retroalimentación + CV validado       │
│                                                              │
│ 7. Reclutamiento mueve a Stage = AwaitingOpsReview          │
│    → Notifica a Operaciones para validar datos               │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│ Semana 3: Validación y Contratación                          │
├─────────────────────────────────────────────────────────────┤
│ 8. Operaciones valida:                                       │
│    ✅ Email único en sistema                                 │
│    ✅ No existe como Employee ya                             │
│    ✅ CV válido (sin malware)                                │
│    → Mueve a Stage = OpsApproved                             │
│                                                              │
│ 9. Reclutamiento mueve a Stage = AwaitingHiringProcess      │
│    → Crea RequestEmployeeRegister (solicitud de alta)       │
│                                                              │
│ 10. Backend: Auto-procesa (async job)                        │
│     → Valida datos para crear Employee                       │
│     → Crea Employee (número nómina, salario, jefe)           │
│     → Mueve CandidateApplication.Stage = Hired              │
│     → Popula CandidateApplication.EmployeeId                │
│     → Notifica RH                                            │
│                                                              │
│ 11. RH valida e incorpora Employee al sistema               │
│     → Fin del flujo (Hired es terminal)                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Acoplamiento Explícito (Qué Toca Este Módulo)

### Módulos que REFERENCIA:

| Módulo | Punto de Contacto | Tipo |
|--------|------------------|------|
| **RequestPosition** | CandidateApplication.RequestPositionId | FK |
| **RequestEmployeeRegister** | Crear solicitud al mover a AwaitingHiringProcess | API call |
| **EmployeeAppService** | CandidateApplication.EmployeeId (read-only después de hire) | FK |
| **Notificaciones** | Enviar emails en cada transición | Event |
| **FileStorage** | CV URL via IFileReadPathService | Service |

### Módulos que lo REFERENCIAN:

| Módulo | Cómo | Tipo |
|--------|------|------|
| **RequestPosition** | Bandeja de candidatos por posición | API read |
| **RequestEmployeeRegister** | Referencia CandidateApplication después de hire | FK |
| **Notificaciones** | Suscrito a eventos de CandidateApplication | Event subscriber |

### Red de Acoplamiento (Riesgos):

```
Candidate ← (1:N) ← CandidateApplication ← (N:1) → RequestPosition
                         ↓                               ↑
                    CandidateInterview        (requerida para postulación)
                         ↓
                    CandidateDecisionReason
                    
CandidateApplication → RequestEmployeeRegister → Employee
                       (create on AwaitingHiringProcess)
```

**Riesgo crítico:** Si RequestPosition se elimina, ¿qué pasa con postulaciones históricas? → **Usar soft delete, no delete físico**

---

## 6. Decisiones Tecnológicas (Por Qué Este Stack)

### Frontend (Angular 17+)
- ✅ Componentes standalone (no módulos)
- ✅ OnPush + signals para cambio de estado
- ✅ Reactive Forms + validación custom
- ✅ PrimeNG para tabla de postulaciones
- ✅ Ionic para versión mobile (bottom-sheet para transiciones)

### Backend (.NET 10)
- ✅ Minimal APIs (no MVC)
- ✅ Primary Constructors (dependency injection limpia)
- ✅ FluentValidation para reglas
- ✅ Entity Framework Core (no stored procedures)
- ✅ Mediator-like pattern (AppService → Domain)

### Validación
- ✅ Backend valida TODAS las transiciones (verdad única)
- ✅ Frontend previene UI invalid (UX, no seguridad)
- ✅ Notificaciones disparan eventos (async, no blocking)

---

## 6.1. Eliminación Permanente en Cascada (SuperUsuario)

Estrategia implementada para **limpiar datos y reiniciar pruebas desde cero**. El borrado
físico no se delega a `OnDelete(DeleteBehavior.Cascade)` de EF Core: se ejecuta
**manualmente y por lotes** en el `AppService` para preservar el historial y evitar
`DbUpdateException` por FKs `Restrict` (ej. `FK_RecruitmentCandidateProcesses_JobVacancyRequests_RequestPositionId`).

### Patrón (replicado en Candidate y RequestPosition)

1. **`GetDeleteImpactAsync(id)`** → `{entity}DeleteImpactDto` con conteos de dependencias.
   Consulta de solo lectura (`AsNoTracking`), sin mutar el contexto.
2. **`DeleteCascadeAsync(id)`** → elimina en orden hijo→padre: resultados de entrevista →
   feedbacks → entrevistas → historial de etapas → procesos/postulaciones → registros
   de alta/modificación salarial → entidad raíz. Todo en una sola `SaveChangesAsync`.
3. **Endpoints protegidos**: `DELETE {id}/cascade` con `RequireAuthorization("SoloSuperUsuario")`;
   `GET {id}/delete-impact` con el rol del grupo (entrevistador/reclutamiento).

### Entidades afectadas

| Entidad raíz | Base path | Dependencias eliminadas en cascada |
|--------------|-----------|------------------------------------|
| `Candidate` | `api/recruitment-candidates` | `CandidateProcess`, `CandidateApplication`, `CandidateInterview`, `CandidateInterviewFeedback`, `CandidateInterviewResult`, `CandidateStageHistory`, `CandidateWorkExperience`, `CandidateApplicationRole`, directorio de CV |
| `RequestPosition` (Vacante) | `api/request-position` | `CandidateProcess`, `CandidateApplication`, `CandidateInterview`, `CandidateInterviewFeedback`, `CandidateInterviewResult`, `CandidateStageHistory`, `RequestEmployeeRegister`, `RequestSalaryModification` |

### Frontend (UX)

- Botón "eliminar definitivamente" (`material-symbols-light:delete`, `severity=danger`)
  visible **solo para SuperUsuario** (`AspRoleService.roleSignal(ApplicationRole.SuperUsuario)`).
- Antes de eliminar se consulta `delete-impact` y se muestra confirmación `SweetAlert`
  con el desglose de registros afectados. Al confirmar se llama a `DELETE {id}/cascade`.

### Verificaciones de diseño

- [ ] ¿El borrado en cascada NUNCA usa `DeleteBehavior.Cascade` de EF Core? (siempre manual)
- [ ] ¿El endpoint `/cascade` exige política `SoloSuperUsuario`?
- [ ] ¿El prompt de confirmación muestra el impacto antes de eliminar?
- [ ] ¿Los conteos de `delete-impact` provienen de `AsNoTracking` (solo lectura)?

---

## 7. Histórico de Cambios Arquitectónicos

| Versión | Cambio | Razón | Fecha |
|---------|--------|-------|-------|
| v1.0 | Estructura inicial: Candidate, CandidateApplication | MVP | 2026-07-01 |
| v1.1 | Agregó CandidateInterview (feedback) | Auditoría encontró falta de retroalimentación | 2026-07-15 |
| v1.2 | Pipeline: 10 → 12 etapas | Operaciones necesitaba validación adicional | 2026-07-25 |
| v1.2.1 | Revertir a 10 etapas (simplificar) | Complejidad innecesaria encontrada en auditoría | 2026-08-09 |
| v2.0 | Modelo final (este documento) | Auditoría 2026-08-09 validó diseño | 2026-08-10 |
| v2.1 | Eliminación permanente en cascada (SuperUsuario) para Candidate y RequestPosition | Limpiar datos e iniciar pruebas desde cero sin violar FKs `Restrict` | 2026-08-15 |
| v2.2 | Cancelación de entrevista desde agenda + fix endpoint `by-stage` en pipeline | Gestión de citas desde la agenda y eliminar 404 (el endpoint de listado por etapa vive solo en `recruitment-candidate-applications`) | 2026-08-15 |

---

## 8. Verificaciones de Diseño (Si Algo Viola Esto = Bug)

- [ ] ¿Candidate es singular por persona? (único email)
- [ ] ¿CandidateApplication es 1:N con Candidate? (una persona, muchas postulaciones)
- [ ] ¿No se puede mover a Hired sin RequestEmployeeRegister?
- [ ] ¿No se puede retroceder desde estados finales?
- [ ] ¿Pipeline tiene exactamente 10 etapas?
- [ ] ¿AssignedInterviewerId es singular (no array)?
- [ ] ¿CV se carga 1 sola vez en Candidate?
- [ ] ¿No existe FK Candidate → Employee?
- [ ] ¿Todas las transiciones se validan en backend?

---

## 9. Referencias Relacionadas

- [PLAN] `docs/plans/20260804-reclutamiento-candidatos-modelo-tecnico.md` — Propuesta de implementación
- [AUDITORÍA] `docs/reporte_maestro/modulos/20260809-auditoria-reclutamiento-candidatos.md` — Validación del diseño
- [README] `api/.../Candidates/README.md` — Operativo: rutas, endpoints, roles
- [README] `client/angular/.../candidates/docs/README.md` — Operativo frontend

---

**Última actualización:** 2026-08-10  
**Vigencia:** Permanente (cambia solo con aprobación de Tech Lead)  
**Próxima revisión:** 2026-09-10 (si hay nuevos cambios)
