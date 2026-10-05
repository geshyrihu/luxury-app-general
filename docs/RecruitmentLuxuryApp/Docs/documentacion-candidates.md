# Documentación Técnica: Módulo Candidates

**Última revisión:** 2026-08-10
**Nivel:** 2 - Documentación Técnica Completa
**Audiencia:** Backend developers, tech leads, auditors
**Referencia:** [README.md](../README.md)

---

## Resumen Ejecutivo

Módulo que gestiona el **ciclo completo de candidatos** en proceso de reclutamiento:

1. **Captura:** Candidatos se registran (email, CV, experiencia)
2. **Postulación:** Se crean postulaciones a posiciones específicas
3. **Flujo:** 9 etapas + transiciones validadas
4. **Entrevistas:** Feedback estructurado de entrevistadores
5. **Decisión:** Aprobado/Rechazado/En espera
6. **Contratación:** Creación de Employee cuando se aprueba

**Stack:** .NET 10, Entity Framework Core, Minimal APIs

---

## 1. Visión Funcional

### Problema que Resuelve

Antes: Proceso manual, hojas de cálculo, datos dispersos
Ahora: Sistema centralizado con validaciones, flujo garantizado, auditoría completa

### Actores

| Actor             | Acción                                                           | RN Asociada |
| ----------------- | ---------------------------------------------------------------- | ----------- |
| **Reclutador**    | Crear/editar candidatos, gestionar postulaciones, cambiar etapas | RN-CAND-003 |
| **Entrevistador** | Registrar feedback en postulaciones asignadas                    | RN-CAND-020 |
| **Operaciones**   | Validar datos, mover a "OpsApproved"                             | RN-CAND-003 |
| **Admin**         | Gestión completa, crear catálogos                                | RN-CAND-006 |

---

## 2. Arquitectura Técnica

### Modelo de Datos

```
┌─────────────────────────────────┐
│         Candidate               │
├─────────────────────────────────┤
│ * Id: Guid                      │
│ * Email: string                 │ ⚠️ NO UNIQUE - HALLAZGO
│ * FirstName: string             │
│ * LastName: string              │
│ * PhoneNumber: string           │
│ * Status: CandidateStatus       │
│ * CreatedAt: DateTime           │
│ * ArchivedDate: DateTime?       │ ← Soft delete
├─────────────────────────────────┤
│ 1:N CandidateApplications       │
└─────────────────────────────────┘
         ↓ N:1
┌─────────────────────────────────┐
│     CandidateApplication        │
├─────────────────────────────────┤
│ * Id: Guid                      │
│ * CandidateId: Guid (FK)        │
│ * RequestPositionId: Guid (FK)  │
│ * Stage: enum (9 valores)       │
│ * AssignedInterviewerId: Guid?  │ ← 1 entrevistador
│ * CvFileName: string            │
│ * CvFileUrl: string             │
│ * AppliedDate: DateOnly         │
│ * ClosedAt: DateTime? (null=activo)
├─────────────────────────────────┤
│ 1:N CandidateInterviews         │
└─────────────────────────────────┘
         ↓ N:1
┌─────────────────────────────────┐
│      CandidateInterview         │
├─────────────────────────────────┤
│ * Id: Guid                      │
│ * CandidateApplicationId: Guid  │
│ * InterviewerId: Guid           │
│ * FeedbackDate: DateTime        │
│ * Rating: int (1-5)             │
│ * FeedbackText: string          │
└─────────────────────────────────┘
```

### Pipeline de Etapas

```
Nuevo (0)
  ├─→ PreFiltro (1) ────┐
  ├─→ Rechazado (7)     │
  └─→ NoSePresento (8)  │
                        ↓
         EnEspera (2)
          ├─→ EntrevistaReclutamiento (3)
          ├─→ Rechazado
          └─→ NoSePresento
               ↓
          EntrevistaOperaciones (4)
          ├─→ Seleccionado (5)
          ├─→ EnEspera
          ├─→ Rechazado
          └─→ NoSePresento
               ↓
          AltaEnProceso (6)
          ├─→ Contratado ← TERMINAL (ClosedAt set)
          └─→ Rechazado ← TERMINAL (ClosedAt set)

Otros terminales (no reversibles):
- Rechazado (puede llegar desde cualquier etapa)
- NoSePresento (puede llegar desde cualquier etapa)
```

### Enums Principales

```csharp
public enum CandidateStatus {
    Active = 1,
    Archived = 2
}

public enum CandidateApplicationStage {
    New = 0,
    PreFiltro = 1,
    EnEspera = 2,
    EntrevistaReclutamiento = 3,
    EntrevistaOperaciones = 4,
    Seleccionado = 5,
    AltaEnProceso = 6,
    Contratado = 7,
    Rechazado = 8,
    NoSePresento = 9
}

public enum CandidateDecision {
    Rejected = 1,
    Withdrawn = 2,
    OnHold = 3
}
```

---

## 3. Endpoints Documentados

### GET /api/recruitment-candidates

**Propósito:** Listar candidatos activos con paginación

**Parámetros Query:**

- `pageNumber: int` (default 1)
- `pageSize: int` (default 10)
- `searchTerm: string?` (busca en FirstName, LastName, Email)
- `status: CandidateStatus?` (filtro)

**Respuesta:**

```json
{
  "data": [
    {
      "id": "guid",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "fullName": "John Doe",
      "phoneNumber": "+57 300...",
      "status": "Active",
      "createdAt": "2026-08-10T10:30:00Z",
      "totalApplications": 3
    }
  ],
  "totalRecords": 50,
  "pageNumber": 1,
  "pageSize": 10
}
```

**Autorización:** ⚠️ `.RequireAuthorization()` SIN POLICY - HALLAZGO

---

### POST /api/recruitment-candidates

**Propósito:** Crear nuevo candidato

**Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phoneNumber": "+57 300...",
  "age": 30,
  "currentAddress": "Bogotá, CO",
  "livesNearWorkplace": true,
  "availability": "Inmediata",
  "salaryExpectation": 3000000,
  "experienceSummary": "10 años en...",
  "generalComments": "Candidato recomendado"
}
```

**Validaciones Backend:**

- ✅ FirstName, LastName: [Required]
- ❌ Email: [Required] FALTA
- ❌ Email: Unique check FALTA

**Respuesta:** `201 Created` con CandidateDetailDTO

**Autorización:** ⚠️ HALLAZGO

---

### POST /api/recruitment-candidate-applications/{id}/stage

**Propósito:** Cambiar etapa de postulación

**Body:**

```json
{
  "toStage": "EntrevistaReclutamiento",
  "comment": "Enviado a entrevista RH"
}
```

**Validaciones:**

```csharp
// Línea 222-275 en CandidateApplicationAppService

1. ✅ Postulación NO debe estar cerrada (ClosedAt == null)
2. ✅ No puede cambiar a mismo estado
3. ✅ Transición DEBE ser válida (ValidateStageTransition)
4. ✅ Si va a EntrevistaOperaciones:
   - Entrevistador DEBE estar asignado
   - Entrevistador DEBE estar activo
   - Entrevistador DEBE tener rol autorizado (8 roles)
   - Entrevistador DEBE perteneces a cliente de vacante
```

**Respuesta:** `200 OK` con etapa actualizada

**Autorización:** ⚠️ HALLAZGO

---

### POST /api/recruitment-candidate-applications/{id}/process-hiring

**Propósito:** Procesar contratación (crear Employee)

**Precondiciones:**

- Stage DEBE ser "Seleccionado"
- Todos los datos completos

**Algoritmo:**

```csharp
// Línea 374-437 en CandidateApplicationAppService

1. Validar stage == Seleccionado
2. Buscar usuario por email (⚠️ SIN CustomerId) - BÚSQUEDA AMBIGUA
3. Si existe: usar existente
   Si NO existe: crear nuevo Employee via RequestEmployeeRegister
4. Set CandidateApplication.EmployeeId
5. Set CandidateApplication.Stage = Contratado
6. Set CandidateApplication.ClosedAt = now
7. Return 200 OK
```

**Riesgo:** Si 2 clientes tienen usuario con mismo email → asigna al primero (ambiguo)

**Solución Recomendada:**

```csharp
var user = await dbContext.User
    .Where(x => x.Email == candidateEmail
            && x.CustomerId == customerId) // ← FALTA
    .FirstOrDefaultAsync();
```

---

### POST /api/recruitment-candidate-interviews/feedback

**Propósito:** Registrar feedback de entrevista

**Body:**

```json
{
  "candidateApplicationId": "guid",
  "rating": 4,
  "feedbackText": "Excelentes conocimientos técnicos, debe mejorar comunicación..."
}
```

**Validaciones:**

- ✅ Rol de entrevistador validado (CandidateInterviewerRoles.cs)
- ✅ Postulación DEBE estar en etapa EntrevistaOperaciones
- ✅ Rating: 1-5

**Efecto Secundario:**

- Crea registro en CandidateInterview
- Guarda feedback en BD

**Autorización:** ✅ Parcialmente validado en AppService

---

## 4. Flujos del Sistema

### Flujo 1: Crear Candidato

```
┌─ Reclutador POST /api/recruitment-candidates
│  ├─ Validar FirstName, LastName (requeridos)
│  ├─ Validar Email (requerido) ← FALTA VALIDAR EN DTO
│  ├─ Validar Email único ← FALTA VALIDAR
│  └─ Crear Candidate en BD
│     └─ Email SIN UNIQUE CONSTRAINT
│
└─ Return 201 Created (CandidateDetailDTO)
```

**Estado:** ⚠️ Parcial (email validation faltante)

---

### Flujo 2: Cambiar Etapa

```
┌─ Reclutador POST /api/recruitment-candidate-applications/{id}/stage
│  ├─ ValidateStageTransition() ← Línea 589-615
│  │  └─ Verificar transición válida según pipeline
│  │
│  ├─ Si va a EntrevistaOperaciones:
│  │  └─ ValidateInterviewerAssignmentAsync() ← Línea 537-587
│  │     ├─ Entrevistador asignado?
│  │     ├─ Entrevistador activo?
│  │     ├─ Rol autorizado (CandidateInterviewerRoles)?
│  │     └─ CustomerId coincide?
│  │
│  └─ Update Stage en BD (ClosedAt si terminal)
│
└─ Notificar (CandidateNotificationCoordinatorService)
```

**Estado:** ✅ Correcto (lógica bien implementada)

---

### Flujo 3: Procesar Contratación

```
┌─ Reclutador POST /api/recruitment-candidate-applications/{id}/process-hiring
│  ├─ Validar Stage == Seleccionado
│  │
│  ├─ Buscar usuario por email
│  │  └─ query: WHERE Email == candidateEmail ⚠️ SIN CustomerId
│  │     └─ RIESGO: Devuelve CUALQUIER usuario con ese email
│  │
│  ├─ Si existe usuario:
│  │  └─ Asignar como Employee ⚠️ RIESGO: Podría ser incorrecto
│  │
│  └─ Si NO existe:
│     └─ Crear Employee via RequestEmployeeRegister
│
└─ Set ClosedAt = now (terminal)
```

**Estado:** ⚠️ Búsqueda ambigua (crítica para auditoría)

---

## 5. Entidades & Propiedades

### Candidate

```csharp
public class Candidate : BaseEntity
{
    public string Email { get; set; } // ❌ NO UNIQUE - CRÍTICO
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string? PhoneNumber { get; set; }
    public int? Age { get; set; }
    public string? CurrentAddress { get; set; }
    public bool? LivesNearWorkplace { get; set; }
    public string? Availability { get; set; }
    public decimal? SalaryExpectation { get; set; }
    public string? ExperienceSummary { get; set; }
    public string? GeneralComments { get; set; }
    public CandidateStatus Status { get; set; } = CandidateStatus.Active;
    public DateTime CreatedAt { get; set; }
    public DateTime? ArchivedDate { get; set; }

    // Navegaciones
    public ICollection<CandidateApplication> Applications { get; set; }
}
```

### CandidateApplication

```csharp
public class CandidateApplication : BaseEntity
{
    public Guid CandidateId { get; set; }
    public Guid RequestPositionId { get; set; }
    public CandidateApplicationStage Stage { get; set; }
    public Guid? AssignedInterviewerId { get; set; } // ← 1 entrevistador
    public string? CvFileName { get; set; }
    public string? CvFileUrl { get; set; }
    public DateOnly AppliedDate { get; set; }
    public DateTime? InterviewedAt { get; set; }
    public DateTime? ClosedAt { get; set; } // ← null = activo
    public Guid? DecisionReasonId { get; set; }
    public string? DecisionComment { get; set; }

    // Navegaciones
    public Candidate Candidate { get; set; }
    public ApplicationRole RequestPosition { get; set; } // Referencia a RequestPosition
    public User? AssignedInterviewer { get; set; }
    public ICollection<CandidateInterview> Interviews { get; set; }
}
```

### CandidateInterview

```csharp
public class CandidateInterview : BaseEntity
{
    public Guid CandidateApplicationId { get; set; }
    public Guid InterviewerId { get; set; }
    public DateTime FeedbackDate { get; set; }
    public int Rating { get; set; } // 1-5
    public string? FeedbackText { get; set; }

    // Navegaciones
    public CandidateApplication Application { get; set; }
    public User Interviewer { get; set; }
}
```

---

## 6. Servicios & Métodos Clave

### CandidateAppService

| Método         | Firma                                           | Línea | Estado                               |
| -------------- | ----------------------------------------------- | ----- | ------------------------------------ |
| `GetListAsync` | `GetListAsync(PaginationRequest)`               | 45    | ✅ OK                                |
| `GetByIdAsync` | `GetByIdAsync(Guid)`                            | 60    | ✅ OK                                |
| `CreateAsync`  | `CreateAsync(CandidateCreateOrUpdateDTO)`       | 75    | ⚠️ Sin validar email único           |
| `UpdateAsync`  | `UpdateAsync(Guid, CandidateCreateOrUpdateDTO)` | 100   | ⚠️ Sin validar email único           |
| `ArchiveAsync` | `ArchiveAsync(Guid)`                            | 119   | ❌ Sin validar postulaciones activas |

**Todas las líneas referenciadas son aproximadas (ver código real)**

### CandidateApplicationAppService

| Método                               | Firma                                                   | Línea | Estado                         |
| ------------------------------------ | ------------------------------------------------------- | ----- | ------------------------------ |
| `ChangeStageAsync`                   | `ChangeStageAsync(Guid, ChangeStageApplicationRequest)` | 222   | ✅ Validaciones correctas      |
| `ValidateStageTransition`            | `ValidateStageTransition(from, to)`                     | 589   | ✅ Matriz completa             |
| `ValidateInterviewerAssignmentAsync` | `ValidateInterviewerAssignmentAsync(...)`               | 537   | ✅ Validaciones completas      |
| `ProcessHiringAsync`                 | `ProcessHiringAsync(Guid)`                              | 374   | ⚠️ Búsqueda de usuario ambigua |
| `RecordDecisionAsync`                | `RecordDecisionAsync(Guid, CandidateDecisionRequest)`   | 300   | ✅ OK                          |

### CandidateInterviewAppService

| Método                          | Firma                                                      | Estado |
| ------------------------------- | ---------------------------------------------------------- | ------ |
| `SubmitFeedbackAsync`           | `SubmitFeedbackAsync(CandidateInterviewFeedbackCreateDTO)` | ✅ OK  |
| `GetFeedbackByApplicationAsync` | `GetFeedbackByApplicationAsync(Guid)`                      | ✅ OK  |

---

## 7. Reglas de Negocio en Código

### RN-CAND-001: Email Único

**Declarada en:** [docs/architecture/reclutamiento-candidates-design.md](../../../docs/architecture/reclutamiento-candidates-design.md) (Principio 1)

**Implementación en Código:**

- ❌ **FALTA IMPLEMENTAR**

**Dónde Agregar:**

```csharp
// En ApplicationDbContext.OnModelCreating()
modelBuilder.Entity<Candidate>()
    .HasIndex(x => x.Email)
    .IsUnique()
    .HasName("IX_Candidate_Email_Unique");

// En CandidateAppService.CreateAsync()
var existing = await dbContext.Candidate
    .FirstOrDefaultAsync(x => x.Email == dto.Email);
if (existing != null)
    throw new BusinessException("Email ya existe en el sistema");

// En DTO
[Required]
[EmailAddress]
public string Email { get; set; }
```

---

### RN-CAND-003: CandidateApplication es Bandeja Canónica

**Implementación:** ✅ Implementada

**Código:**

- `CandidateApplicationListItemDTO` expone campos principales
- Endpoints sirven desde `CandidateApplicationAppService` (no Candidate)
- Frontend consume `/api/recruitment-candidate-applications` (no `/candidates`)

---

### RN-CAND-007: Pipeline de 9 Etapas con Transiciones Validadas

**Implementación:** ✅ Implementada (línea 589-615)

**Código:**

```csharp
private bool ValidateStageTransition(
    CandidateApplicationStage fromStage,
    CandidateApplicationStage toStage)
{
    return (fromStage, toStage) switch
    {
        (New, PreFiltro) => true,
        (New, Rechazado) => true,
        (New, NoSePresento) => true,
        // ... todos los casos válidos
        _ => false
    };
}
```

---

## 8. Bases de Datos

### Índices Principales

| Tabla                  | Índice                           | Tipo            | Propósito          |
| ---------------------- | -------------------------------- | --------------- | ------------------ |
| `Candidate`            | PK: Id                           | Clustered       | Identidad          |
| `Candidate`            | Email                            | ⚠️ FALTA UNIQUE | Validar unicidad   |
| `CandidateApplication` | PK: Id                           | Clustered       | Identidad          |
| `CandidateApplication` | (CandidateId, RequestPositionId) | UNIQUE          | Evitar duplicados  |
| `CandidateApplication` | Stage                            | Non-clustered   | Filtros frecuentes |
| `CandidateInterview`   | PK: Id                           | Clustered       | Identidad          |
| `CandidateInterview`   | CandidateApplicationId           | Foreign Key     | Joins              |

### Relaciones

```
Candidate (1) ─────→ (N) CandidateApplication
    Email (PK)          CandidateId (FK)

CandidateApplication (1) ─────→ (N) CandidateInterview
    Id (PK)                          CandidateApplicationId (FK)

CandidateApplication (N) ─────→ (1) RequestPosition
    RequestPositionId (FK)           Id (PK)
```

---

## 9. Performance

### Queries Críticas

**GET /api/recruitment-candidates**

- ✅ Paginado (no trae todos)
- ✅ `.Select()` solo campos necesarios (no full entity)

**GET /api/recruitment-candidate-applications**

- ✅ `.Include(x => x.Interviews)` para evitar N+1
- ⚠️ Verificar que no carga demasiados registros

### Recomendaciones

1. Crear índice UNIQUE en Email (mejora búsqueda de duplicados)
2. Crear índice en Stage (filtros frecuentes: "EnEspera", "Seleccionado", etc)
3. Considerar índice compuesto: (CustomerId, Stage, CreatedAt) para reportes

---

## 10. Performance & Caching

**Frontend:** PaginationStore con signals automáticas (no necesita manual cache)

**Backend:** AppServices sin caching explícito (datos son dinámicos)

---

## 11. Checklist de Validación

```
ENTIDADES:
  [✅] Candidate creada con campos principales
  [✅] CandidateApplication bien relacionada
  [✅] CandidateInterview como N:1
  [❌] Email sin UNIQUE constraint

ENDPOINTS:
  [✅] GET/POST/PUT implementados
  [✅] ChangeStage con validaciones
  [⚠️] ProcessHiring busca usuario ambiguamente
  [❌] Sin políticas de autorización especificadas

VALIDACIONES:
  [⚠️] FirstName/LastName: OK
  [❌] Email: no [Required] en DTO
  [❌] Email: no UNIQUE check
  [✅] Transiciones: OK
  [✅] Entrevistadores: OK

SEGURIDAD:
  [❌] Endpoints usan .RequireAuthorization() SIN POLICY
  [✅] Roles de entrevistador validados
  [✅] CustomerId validado en entrevistadores
  [⚠️] CustomerId NOT validado en proceso hiring

AUDITORÍA:
  [📋] Documento de auditoría: 20260810-auditoria-...
  [📋] 3 hallazgos críticos identificados
  [📋] Plan de remediación propuesto
```

---

## 12. Historial de Cambios

| Versión | Fecha      | Cambio                        |
| ------- | ---------- | ----------------------------- |
| v1.0    | 2026-08-10 | Documentación técnica inicial |
| v1.1    | TBD        | Post-remediación de hallazgos |

---

## 13. Contacto & Escalaciones

| Rol                    | Responsable | Contacto |
| ---------------------- | ----------- | -------- |
| **Propietario Módulo** | (TBD)       |          |
| **Backend Tech Lead**  | (TBD)       |          |
| **QA Lead**            | (TBD)       |          |

---

**Última Actualización:** 2026-08-10
**Estado:** ✅ Vigente con hallazgos críticos
**Próxima Revisión:** 2026-09-10 (post-remediación)
