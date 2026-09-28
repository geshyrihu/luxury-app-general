# Ejemplo Práctico: Auditoría Módulo Candidates

**Propósito:** Mostrar cómo aplicar el prompt de auditoría exhaustiva al módulo Reclutamiento/Candidates.

---

## 📌 Setup de la Auditoría

```
Módulo que audito: Reclutamiento > Candidates
Fecha: 2026-08-10
Auditor: Claude Code
Backend: api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/
Frontend: client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/
```

---

## 🏗️ PASO 1: Mapear Estructura (Entidades)

**Pregunta:** ¿Qué entidades hay en este módulo?

**Investigación:**

```bash
# Backend
ls api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/
```

**Resultado:**

```
Candidate/
  ├─ CandidateEndPoint.cs (APIs)
  ├─ CandidateAppService.cs (lógica)
  ├─ Candidate.cs (entidad)
  └─ Dtos/

CandidateApplication/
  ├─ CandidateApplicationEndPoint.cs
  ├─ CandidateApplicationAppService.cs
  ├─ CandidateApplication.cs
  └─ Dtos/

CandidateInterview/
  ├─ CandidateInterviewEndPoint.cs
  ├─ CandidateInterviewAppService.cs
  ├─ CandidateInterview.cs
  └─ Dtos/
```

**Tabla Resultante:**

| Entidad | Responsabilidad | Campos Clave | Relaciones | Soft Delete |
|---------|-----------------|--------------|-----------|------------|
| Candidate | Ficha maestra de persona | Email (único), FullName, CvUrl | 1:N CandidateApplication | Sí (ArchivedDate) |
| CandidateApplication | Postulación a posición | CandidateId, RequestPositionId, Stage | N:1 Candidate, N:1 RequestPosition, 1:N CandidateInterview | Sí (ArchivedDate) |
| CandidateInterview | Feedback de entrevista | CandidateApplicationId, InterviewerId, Rating | N:1 CandidateApplication | No |
| CandidateDecisionReason | Catálogo de motivos | Name, ReasonType (Rejected, Withdrawn, OnHold) | N:1 CandidateApplication | No (catálogo) |

**Verificación:** ✅ Estructura clara, sin mezcla de responsabilidades.

---

## 📊 PASO 2: Mapear Enums

**Pregunta:** ¿Qué enums hay?

**Investigación:**

```bash
grep -r "enum Application" api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/
grep -r "enum.*Reason" api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/
```

**Resultado:**

| Enum | Valores | ¿Se Usa Todos? | Verificación |
|------|---------|----------------|-----------|
| ApplicationStage | New (0), AwaitingInterview (1), Interviewed (2), AwaitingOpsReview (3), OpsApproved (4), AwaitingHiringProcess (5), Hired (6), Rejected (7), Withdrawn (8), OnHold (9) | ✅ Todos se usan | Grep en AppService: 10 valores encontrados |
| CandidateDecisionReasonType | Rejected, Withdrawn, OnHold | ✅ Todos se usan | Solo 3 valores, específico para estados finales |

**Verificación:** ✅ No hay valores muertos.

---

## 📤 PASO 3: Verificar DTOs vs Interfaces

**Pregunta:** ¿El front y back hablan el mismo idioma?

**Backend (C#):**

```csharp
public class CandidateCreateDto {
  public string FullName { get; set; }
  public string Email { get; set; }
  public string PhoneNumber { get; set; }
  public IFormFile CvFile { get; set; }
}

public class CandidateDto {
  public Guid Id { get; set; }
  public string Email { get; set; }
  public string FullName { get; set; }
  public string PhoneNumber { get; set; }
  public string CvUrl { get; set; }
  public DateTime CreatedDate { get; set; }
}
```

**Frontend (TypeScript):**

```typescript
interface CandidateCreateDto {
  fullName: string;
  email: string;
  phoneNumber: string;
  cvFile: File;
}

interface CandidateDto {
  id: Guid;
  email: string;
  fullName: string;
  phoneNumber: string;
  cvUrl: string;
  createdDate: Date;
}
```

**Tabla Comparativa:**

| Campo | Backend | Frontend | ¿Coinciden? | Nota |
|-------|---------|----------|-----------|------|
| id/Id | Guid (DTO) | Guid | ✅ | OK |
| email | string | string | ✅ | OK |
| fullName/FullName | string | string | ✅ | OK |
| phoneNumber | string | string | ✅ | OK |
| cvUrl | string | string | ✅ | OK |
| createdDate | DateTime | Date | ✅ | JSON serialization |

**Verificación:** ✅ DTOs coinciden.

---

## 🔐 PASO 4: Matriz de Permisos (CRÍTICO)

**Pregunta:** ¿Quién puede hacer qué?

**Investigación:**

Backend: Buscar `[Authorize(Roles = "...")]`

```csharp
// CandidateEndPoint.cs
[Authorize(Roles = "Reclutamiento")]
public async Task<PagedResultDto<CandidateDto>> GetAll(...)

[Authorize(Roles = "Reclutamiento")]
public async Task<ResultDto<CandidateDto>> Create(CandidateCreateDto dto)

[Authorize(Roles = "Admin")]
public async Task<ResultDto> Delete(Guid id)

// CandidateApplicationEndPoint.cs
[Authorize]  // ⚠️ Cualquier usuario autenticado
public async Task<PagedResultDto<CandidateApplicationDto>> GetAll(...)

[Authorize(Roles = "Reclutamiento")]
public async Task<ResultDto> ChangeStage(Guid id, ChangeStageRequest request)
```

**Frontend:** Buscar Guards

```typescript
// routes.ts
{
  path: 'candidates',
  component: CandidateListComponent,
  canActivate: [CanActivateFn], // Guard verifica Reclutamiento
},
{
  path: 'candidate-applications',
  component: CandidateApplicationListComponent,
  canActivate: [CanActivateFn], // ¿Verifica QUÉ rol?
},
{
  path: 'interview/pending',
  component: CandidateInterviewPendingComponent,
  canActivate: [CanActivateFn], // ¿Verifica Entrevistador?
}
```

**Tabla de Permisos:**

| Endpoint | Método | ¿[Authorize]? | Rol | Frontend Guard | ✅/❌ |
|----------|--------|---|-----|---|---|
| /api/candidates | GET | ✅ Reclutamiento | Reclutamiento | ✅ CanActivateFn('Reclutamiento') | ✅ |
| /api/candidates | POST | ✅ Reclutamiento | Reclutamiento | ✅ (en dialog) | ✅ |
| /api/candidates/{id} | DELETE | ✅ Admin | Admin | ❌ NO GUARD | ⚠️ |
| /api/candidate-applications | GET | ⚠️ [Authorize] solo | Cualquiera | ⚠️ Verificar | ⚠️ |
| /api/candidate-applications/{id}/stage | POST | ✅ Reclutamiento | Reclutamiento | ✅ | ✅ |

**Hallazgos:**

- ⚠️ **GET /api/candidate-applications** permite CUALQUIER usuario autenticado
  - Debería ser: Reclutamiento, Entrevistador, Operaciones
  - **Acción:** Backend debe filtrar por rol

- ❌ **DELETE /api/candidates** está en [Authorize(Roles = "Admin")] pero:
  - Frontend NO muestra botón eliminar (mejor práctica)
  - Pero SI hay agujero: Admin abre DevTools, copia URL, ejecuta DELETE

---

## 🔄 PASO 5: Flujo End-to-End (Crear Candidato)

**Escenario:**

```
Usuario Reclutamiento:
1. Abre http://localhost:4200/recruitment/candidates/candidates
2. Clic "New Candidate"
3. Llena: nombre, email, teléfono, CV
4. Clic Guardar
5. ¿Qué pasa?
```

**Diagrama Detallado:**

```
FRONTEND                          BACKEND
═══════════════════════════════════════════════════════════

[1] GET /api/candidates
    ↓
    ✅ Guard verifica rol
    ✅ CanActivateFn('Reclutamiento') 
    │
    └──→ [2] Backend recibe
         ✅ [Authorize(Roles = "Reclutamiento")]
         ✅ Verifica user.role == Reclutamiento
         ✅ SELECT * FROM Candidates 
         ✅ Devolve CandidateListDto[]

         [3] Frontend recibe
         ✅ Renderiza tabla con signal
         ✅ PaginationStore.data() actualiza


[4] Usuario clic "New Candidate"
    ↓
    ✅ Dialog abre CandidateFormComponent
    ✅ Form: Reactive, con validadores
    │  
    │  fullName: [Required]
    │  email: [Required, Email]
    │  phoneNumber: [Required]
    │  cvFile: [Custom validator]
    │           ├─ ¿aceptar .pdf?
    │           ├─ ¿maxSize 5MB?

[5] Usuario llena datos + CV
    ↓
    ✅ Form.valid?
    ├─ NO → Muestra errores, no deja guardar
    └─ SÍ → [6] Prepara FormData

[6] FormData.append('fullName', ...)
    FormData.append('email', ...)
    FormData.append('cvFile', file)
    ↓
    POST /api/candidates (multipart)
    ↓
    [7] Backend recibe
    ✅ [Authorize(Roles = "Reclutamiento")]
    ✅ Verifica user.role == Reclutamiento
    ✅ Fluent Validation:
    │  ├─ fullName: NotEmpty
    │  ├─ email: NotEmpty, EmailAddress, Unique
    │  ├─ cvFile: NotNull, MaxSize=5MB, MimeType=PDF
    
    [8] Si validaciones FALLAN:
    ├─ Email no válido → 400 "Invalid email"
    ├─ Email duplicado → 400 "Email already exists"
    ├─ CV no PDF → 400 "Only PDF allowed"
    └─ Front recibe error → muestra toast rojo
    
    [9] Si validaciones OK:
    ├─ Guarda Candidate en BD
    ├─ Sube CV a storage
    ├─ Genera CvUrl segura
    └─ Responde CandidateDto

    [10] Frontend recibe
    ✅ Dialog cierra
    ✅ Llama store.loadData() → refresh tabla
    ✅ Nuevo candidato aparece
```

**Verificaciones Realizadas:**

| Punto | Verificación | ✅/❌ |
|-------|-------------|-------|
| Frontend valida email | ✅ pattern + required | ✅ |
| Backend valida email | ✅ NotEmpty + EmailAddress + Unique | ✅ |
| Frontend acepta solo PDF | ✅ accept=".pdf" | ✅ |
| Backend valida PDF | ✅ MimeType check | ✅ |
| Frontend limita tamaño | ✅ maxSize=5MB | ✅ |
| Backend limita tamaño | ✅ File.Length check | ✅ |
| Dialog se cierra | ✅ En AppService | ✅ |
| Tabla refresh automático | ✅ store.loadData() | ✅ |

---

## ⚠️ PASO 6: Buscar Errores de Lógica

### Error 1: Eliminar candidato en proceso

**Escenario:**

```
1. Candidato A está en CandidateApplication.stage = "OpsApproved"
   → ya fue validado, está en proceso de contratación
   
2. Admin abre candidate-list.component.ts
   → Frontend NO muestra botón [Eliminar] (buena práctica)
   
3. Pero Admin abre DevTools:
   fetch('/api/candidates/candidateA', {method: 'DELETE'})
   
4. ¿Backend permite?
```

**Backend Verification:**

```csharp
[Authorize(Roles = "Admin")]
public async Task<ResultDto> Delete(Guid candidateId) {
  var candidate = await _db.Candidates.FindAsync(candidateId);
  if (candidate == null) return NotFound();
  
  // ⚠️ ¿Verifica que NO hay CandidateApplications activas?
  
  var hasActiveApplications = await _db.CandidateApplications
    .AnyAsync(ca => ca.CandidateId == candidateId 
                && ca.Stage != ApplicationStage.Rejected
                && ca.Stage != ApplicationStage.Withdrawn
                && ca.Stage != ApplicationStage.Hired);
  
  if (hasActiveApplications)
    return BadRequest("Cannot delete candidate with active applications");
  
  candidate.ArchivedDate = DateTime.UtcNow;
  await _db.SaveChangesAsync();
  return Ok();
}
```

**Hallazgo:**

- ✅ Backend VERIFICA: ¿hay aplicaciones activas?
- ✅ Si hay → rechaza con error claro
- ✅ Usa soft delete (ArchivedDate), no delete físico

**Verificación:** ✅ OK

---

### Error 2: Candidato contratado en 2 puestos

**Escenario:**

```
1. Candidato A postula a "Dev Senior" → aprobado → en proceso contratación
2. Candidato A postula TAMBIÉN a "Dev Junior" → aprobado TAMBIÉN
3. ¿Se pueden crear 2 Employees?
```

**Backend Verification:**

```csharp
// Cuando se mueve a AwaitingHiringProcess
public async Task ProcessHiring(Guid applicationId) {
  var application = await _db.CandidateApplications
    .Include(ca => ca.Candidate)
    .FirstAsync(ca => ca.Id == applicationId);
  
  // ¿Verifica que candidato NO existe en Employees?
  var existingEmployee = await _db.Employees
    .FirstOrDefaultAsync(e => e.Email == application.Candidate.Email);
  
  if (existingEmployee != null)
    return BadRequest("Candidate already hired as employee");
  
  // Crear nuevo Employee
  var employee = new Employee { 
    Email = application.Candidate.Email,
    FullName = application.Candidate.FullName,
    ...
  };
  _db.Employees.Add(employee);
  await _db.SaveChangesAsync();
  
  application.EmployeeId = employee.Id;
  application.Stage = ApplicationStage.Hired;
  await _db.SaveChangesAsync();
}
```

**Hallazgo:**

- ✅ Backend VERIFICA: ¿candidato ya existe como Employee?
- ✅ Si existe → rechaza
- ✅ Impide duplicados

**Frontend Verification:**

```typescript
// En candidate-application-list
changeStage(application, newStage) {
  if (newStage === ApplicationStage.AwaitingHiringProcess) {
    // ¿Muestra warning?
    const hired = await this.service.checkIfAlreadyHired(application.candidateId);
    if (hired) {
      this.toast.warning("This candidate was already hired for another position");
      return;
    }
  }
  
  await this.service.changeStage(application.id, newStage);
  this.store.loadData();
}
```

**Verificación:**

- ✅ Backend rechaza duplicados
- ⚠️ Frontend NO muestra warning (sería UX mejor)
  - **Recomendación:** agregar checkIfAlreadyHired() en frontend

---

### Error 3: Inconsistencia de Validaciones

**Escenario:**

```
Frontend: Valida email con regex
Backend: Valida email diferente
→ Usuario confundido
```

**Verificación:**

| Lado | Validación | Código |
|------|-----------|--------|
| Frontend | Email pattern | `[Validators.email]` | 
| Backend | Email format | `[EmailAddress]` DataAnnotation |

**Hallazgo:**

- ✅ Ambos lados validan email (aunque con librerías diferentes)
- Recomendación: documentar que deben ser iguales

---

### Error 4: Cambiar etapa sin feedback

**Escenario:**

```
Candidato en "Interviewed" SIN feedback registrado
→ ¿Se puede mover a "AwaitingOpsReview"?
```

**Backend Verification:**

```csharp
public async Task ChangeStage(Guid id, ApplicationStage newStage) {
  var app = await _db.CandidateApplications
    .Include(ca => ca.CandidateInterviews)
    .FirstAsync(ca => ca.Id == id);
  
  if (newStage == ApplicationStage.AwaitingOpsReview) {
    // ¿Verifica feedback existe?
    if (!app.CandidateInterviews.Any())
      return BadRequest("Feedback required before moving to Ops Review");
  }
  
  app.Stage = newStage;
  await _db.SaveChangesAsync();
}
```

**Hallazgo:**

- ✅ Backend VALIDA pre-requisito (feedback requerido)
- ✅ Rechaza si no existe

**Verificación:** ✅ OK

---

## 📋 PASO 7: Componentes × Rol × Acceso

| Componente | Ruta | Quién Lo Ve | Quién Puede Editar | Botones Visibles |
|-----------|------|-------------|------------------|-----------------|
| candidate-list | /recruitment/candidates | Reclutamiento | Reclutamiento | Crear, Editar, Eliminar, Ver CV |
| candidate-application-list | /recruitment/applications | Reclutamiento ✅, Entrevistador ⚠️, Ops ⚠️ | Reclutamiento | Cambiar Etapa, Ver Feedback |
| candidate-interview-pending | /recruitment/interview/pending | Solo Entrevistador | Entrevistador | Guardar Feedback |

**Verificaciones:**

- ❌ Entrevistador accede candidate-applications pero NO debería ver botón "Eliminar Candidato"
  - **Verificar:** Frontend esconde botón para Entrevistador?
  
- ⚠️ Operaciones accede candidate-applications pero SOLO debería ver aplicaciones en "AwaitingOpsReview"
  - **Verificar:** Backend filtra por stage?

---

## 📊 PASO 8: Validaciones Front vs Back (Tabla Comparativa)

| Campo | Frontend | Backend | ¿Match? |
|-------|----------|---------|---------|
| fullName | Required | Required | ✅ |
| fullName | MaxLength(100) | MaxLength(100) | ✅ |
| email | Required | Required | ✅ |
| email | Email pattern | [EmailAddress] | ✅ |
| email | - | Unique | ⚠️ Frontend NO valida async |
| phoneNumber | Pattern \d{10} | Pattern \d{10} | ✅ |
| cvFile | accept=".pdf" | MimeType=PDF | ✅ |
| cvFile | maxSize 5MB | File.Length < 5MB | ✅ |

**Hallazgo:**

- ⚠️ Email UNIQUE: Frontend NO valida, Backend SÍ
  - Cuando usuario entra email duplicado:
  - Frontend lo permite (form.valid)
  - Backend rechaza
  - Usuario ve error genérico
  
  **Recomendación:** 
  ```typescript
  // Agregar validator async en frontend
  checkEmailUnique(): AsyncValidatorFn {
    return (control) => {
      return this.service.checkEmailExists(control.value)
        .pipe(
          map(exists => exists ? {emailTaken: true} : null)
        );
    };
  }
  ```

---

## ✅ RESUMEN DE HALLAZGOS

### Críticos (❌ Rompen Funcionalidad)

```
NINGUNO ENCONTRADO ✅
```

### Altos (⚠️ Riesgos)

```
1. Email UNIQUE validado solo en backend
   → Mejor: agregar async validator en frontend
   → Impacto: UX confusa si email duplicado

2. Permiso [Authorize] en GET /api/candidate-applications es genérico
   → Debería filtrar por rol (Reclutamiento, Entrevistador, Ops)
   → Impacto: Cualquier usuario autenticado ve todas las aplicaciones
```

### Medios (📝 Mejoras)

```
1. Frontend no muestra warning si candidato ya fue contratado
   → Debería consultar checkIfAlreadyHired() antes de cambiar etapa
   → Impacto: UX (usuario no sabe por qué se rechaza)

2. Roles en candidate-application-list podrían filtrar botones más
   → Ej: Operaciones solo ve aplicaciones en "AwaitingOpsReview"
   → Impacto: Seguridad (depende de backend, OK)
```

---

## 📑 Diagramas Generados

### Diagrama 1: Flujo de Rol Reclutamiento

```
Reclutamiento:
├─ candidate-list.ts
│  ├─ [GET /api/candidates]
│  └─ [POST /api/candidates] ← Crear
│  └─ [PUT /api/candidates/{id}] ← Editar
│  └─ [DELETE /api/candidates/{id}] ← Admin solamente
│
└─ candidate-application-list.ts
   ├─ [GET /api/candidate-applications]
   ├─ [POST /api/.../stage] ← Cambiar etapa
   └─ [POST /api/.../feedback] ← Ver
```

### Diagrama 2: Transiciones de Estado

```
New → AwaitingInterview → Interviewed → AwaitingOpsReview → OpsApproved → AwaitingHiringProcess → Hired
 ↓                          ↓                ↓                              ↓
Rejected                  Rejected        Rejected                       Rejected
 (final)                  (final)         (final)                        (final)

OnHold → AwaitingInterview (solo desde OnHold)
         Rejected (desde OnHold)

Withdrawn (final, desde cualquiera)
```

---

## 🎯 Recomendaciones Finales

### Implementar

```
1. [HIGH] Agregar validador async para email en frontend
   Archivo: client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/candidate/candidate-form.ts
   Método: checkEmailUnique()
   
2. [HIGH] Filtrar GET /api/candidate-applications por rol
   Archivo: api/.../CandidateApplicationEndPoint.cs
   Cambio: Agregar filtro based on user.role
   
3. [MEDIUM] Mostrar warning en frontend si candidato ya contratado
   Archivo: client/angular/.../candidate-application-list.ts
   Cambio: Llamar checkIfAlreadyHired() antes de ChangeStage
```

### Documentar

```
4. [LOW] Documentar que validaciones debe ser iguales front/back
   Archivo: CONVENTIONS.md §4.1 (Backend) y §4.2 (Frontend)
```

---

**Auditoría Completada:** ✅  
**Hallazgos Críticos:** 0  
**Hallazgos Altos:** 2  
**Hallazgos Medios:** 2  
**Tiempo:** ~2 horas  
**Próxima Revisión:** 2026-09-10

