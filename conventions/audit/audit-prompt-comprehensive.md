# Prompt de Auditoría Exhaustiva: Front + Back + Flujos + Permisos

**Para:** Auditar módulos completos con enfoque en errores de lógica y coherencia  
**Tiempo:** 4-6 horas por módulo  
**Requisitos:** Leer código (front + back), entender flujos de negocio

---

## 📋 Introducción

Este prompt audita un módulo COMPLETO verificando que:
1. ✅ Front y Back hablan el mismo idioma (DTOs, validaciones)
2. ✅ Los permisos (roles) se respetan en todas partes
3. ✅ Los flujos de datos son coherentes (sin "callejones sin salida")
4. ✅ No hay errores de lógica que rompan el flujo de negocio

**Resultado esperado:** Reporte con diagramas + matriz de permisos + lista de errores encontrados.

---

## 🔍 SECCIÓN 1: Auditoría de Estructura (Back + Front)

### 1.1 Entidades (Backend)

**Pregunta:** ¿Qué entidades hay y cuál es su responsabilidad?

**Buscar en:** `api/LuxuryApp.Application/Moduls/[ModuleName]/`

```
📝 Hacer Tabla:

| Entidad | Responsabilidad | Campos Clave | Relaciones | Soft Delete? |
|---------|-----------------|--------------|-----------|-------------|
| Candidate | Persona física que aplica | Email, FullName, CV | 1:N CandidateApplication | Sí/No |
| CandidateApplication | Postulación a puesto | CandidateId, RequestPositionId, Stage | N:1 Candidate, N:1 RequestPosition | Sí/No |
| ... | ... | ... | ... | ... |
```

**Verificar:**
- ❓ ¿Cada entidad tiene 1 responsabilidad clara? (no mezcla candidato con postulación)
- ❓ ¿Las relaciones tiene sentido? (no hay FKs circulares)
- ❓ ¿Cuál es la entidad "maestra"? (la que muestra en listados principales)

---

### 1.2 Enums (Backend)

**Pregunta:** ¿Qué enums hay y cuáles son los valores permitidos?

**Buscar en:** Código C# de entidades

```
📝 Hacer Tabla:

| Enum | Valores | Significado | ¿Quién lo cambia? | ¿Es Final? |
|------|---------|-------------|------------------|-----------|
| ApplicationStage | New, AwaitingInterview, Interviewed, ... | Estado de postulación | Backend validando | ¿Se puede volver atrás? |
| Role | Reclutamiento, Operaciones, Entrevistador | Rol de usuario | Admin solamente | Sí/No |
| ... | ... | ... | ... | ... |
```

**Verificar:**
- ❓ ¿El enum tiene valores que NUNCA se usan? (código muerto)
- ❓ ¿Se puede pasar de estado A → B directamente o hay validación?
- ❓ ¿Hay estados finales que no se pueden revertir?

---

### 1.3 DTOs (Backend)

**Pregunta:** ¿Qué información viaja del back al front y viceversa?

**Buscar en:** `api/.../Dtos/` y contratos en endpoints

```
📝 Hacer Tabla (IMPORTANTE):

| DTO | Usado en | Campos | ¿Validación? | ¿Front Valida También? |
|-----|----------|--------|------------|----------------------|
| CandidateCreateDto | POST /api/candidates | fullName, email, phone, cvFile | BackEnd (Required, Email) | Front (Reactive Form) |
| CandidateApplicationListDto | GET /api/applications | id, candidateId, stage, ... | - | - |
| ... | ... | ... | ... | ... |
```

**Verificar:**
- ❓ ¿El front recibe el mismo DTO que el back envía?
- ❓ ¿Hay campos en el DTO que el front NO muestra? (datos ocultos)
- ❓ ¿El front envía campos que el back NO espera? (datos ignorados)

---

### 1.4 Interfaces (Frontend Angular)

**Pregunta:** ¿Los tipos del front coinciden con los DTOs del back?

**Buscar en:** `client/angular/.../interfaces/` y `candidate.dto.ts`

```
📝 Hacer Comparación:

BACKEND DTO:
```csharp
public class CandidateDto {
  public Guid Id { get; set; }
  public string Email { get; set; }
  public string FullName { get; set; }
  public string? CvUrl { get; set; }
  public DateTime CreatedDate { get; set; }
}
```

FRONTEND INTERFACE:
```typescript
interface CandidateDto {
  id: Guid;
  email: string;
  fullName: string;
  cvUrl?: string;
  createdDate: Date;
}
```

**Verificar:**
- ❓ ¿Mismos campos (id vs Id, email vs Email)?
- ❓ ¿Mismo tipo (string, Guid, DateTime)?
- ❓ ¿Mismos campos requeridos vs opcionales?
- ❓ ¿El front tiene campos que el back NO devuelve?

---

## 🔐 SECCIÓN 2: Matriz de Permisos y Acceso

### 2.1 Roles del Sistema

**Pregunta:** ¿Quién puede hacer qué?

**Buscar en:** 
- Backend: `[AuthorizeAttribute(Roles = "...")]`
- Frontend: `if (this.authService.hasRole('...'))`

```
📝 Hacer Tabla de Roles:

| Rol | Descripción | ¿Acceso a Módulo? | ¿Acceso Completo? |
|-----|-------------|------------------|------------------|
| Reclutamiento | Recluta candidatos | ✅ Sí | ✅ Crear, Editar, Eliminar |
| Entrevistador | Realiza entrevistas | ✅ Parcial | ❌ Solo ver + feedback |
| Operaciones | Valida datos | ✅ Parcial | ❌ Solo validar |
| Admin | Total | ✅ Sí | ✅ Todo |
```

---

### 2.2 Matriz Endpoint × Rol × Acción

**Pregunta:** ¿Qué rol puede llamar qué endpoint y hacer qué acción?

**Buscar en:** Backend endpoints con `[Authorize]`

```
📝 Hacer Tabla GRANDE (crítica):

| Endpoint | Método | Acción | Rol Requerido | ¿Front lo Llama? | ¿Hay Guard? |
|----------|--------|--------|---------------|-----------------|------------|
| /api/candidates | GET | Listar | Reclutamiento | ✅ SÍ | ✅ CanActivateFn |
| /api/candidates | POST | Crear | Reclutamiento | ✅ SÍ | ✅ CanActivateFn |
| /api/candidates/{id} | DELETE | Eliminar | Admin | ✅ SÍ (escondido?) | ❌ NO |
| /api/candidate-applications/{id}/stage | POST | Cambiar etapa | Reclutamiento | ✅ SÍ | ✅ CanActivateFn |
| /api/candidate-applications/{id}/stage | POST | Cambiar a Hired | Reclutamiento | ✅ SÍ | ✅ CanActivateFn |
| ... | ... | ... | ... | ... | ... |
```

**Verificar:**
- ❓ ¿Hay endpoint en backend que el front NO llama? (código muerto)
- ❓ ¿El front llama endpoint sin verificar permisos? (agujero de seguridad)
- ❓ ¿El front tiene botón "Eliminar" pero solo lo ve Admin? (coherencia)
- ❓ ¿El backend rechaza operación pero front ya deletó? (error en UX)

---

### 2.3 Componentes × Rol × Acceso

**Pregunta:** ¿Qué rol ve qué componente?

**Buscar en:** Frontend: rutas con guards + componentes con `@if (isAdmin)`

```
📝 Hacer Tabla:

| Componente | Ruta | Quién lo Ve | Quién Puede Editar | Botones Visibles |
|-----------|------|-------------|------------------|-----------------|
| candidate-list | /recruitment/candidates | Reclutamiento | Reclutamiento | Crear, Editar, Eliminar |
| candidate-application-list | /recruitment/applications | Reclutamiento, Entrevistador, Ops | Solo Reclutamiento | Cambiar Etapa, Feedback |
| candidate-interview-pending | /recruitment/interview/pending | Solo Entrevistador | Entrevistador | Guardar Feedback |
| ... | ... | ... | ... | ... |
```

**Verificar:**
- ❓ ¿Entrevistador ve botón "Eliminar Candidato"? ❌ Error
- ❓ ¿Reclutamiento puede cambiar etapa pero sin validaciones? ❌ Error
- ❓ ¿El rol correcto ve el componente? ✅ OK

---

## 🔄 SECCIÓN 3: Flujos de Datos (End-to-End)

### 3.1 Diagrama de Flujo Principal

**Pregunta:** ¿Cómo fluyen los datos desde que el usuario entra hasta que se guardan?

**Ejemplo (Candidatos):**

```
┌─ Usuario abre: http://localhost/recruitment/candidates/candidates
│  └─ CanActivateFn verifica: ¿Tienes rol "Reclutamiento"? 
│     ├─ NO → Redirige a /403
│     └─ SÍ → Carga componente
│
├─ candidate-list.component.ts carga
│  ├─ ngOnInit() → Llama store.configure('api/candidates')
│  ├─ store.loadData() → HTTP GET /api/candidates
│  ├─ Backend: [Authorize(Roles = "Reclutamiento")] ✅
│  └─ Backend valida: ¿Es Reclutamiento? → Devuelve lista
│
├─ Backend devuelve: CandidateListDto[]
│  ├─ Front recibe: signals en PaginationStore.data()
│  ├─ Template: *ngFor="let candidate of store.data()"
│  └─ Renderiza tabla
│
├─ Usuario hace clic en "New Candidate"
│  ├─ abre DialogHandlerService.openDialog(CandidateFormComponent)
│  ├─ Form: Reactive Form con validadores
│  │  ├─ fullName: [Required]
│  │  ├─ email: [Required, Email] ← Frontend valida
│  │  ├─ cvFile: [Custom validator] ← ¿PDF solamente? ← VERIFICAR
│  └─ Usuario rellena + clic Guardar
│
├─ Form.valid? 
│  ├─ NO → Muestra errores en template
│  └─ SÍ → Prepara FormData (multipart/form-data)
│
├─ Front envía: POST /api/candidates (con file)
│  ├─ Backend: [Authorize(Roles = "Reclutamiento")] ✅
│  ├─ Backend valida AGAIN:
│  │  ├─ fullName: ¿vacío?
│  │  ├─ email: ¿válido?
│  │  ├─ email: ¿único? ← IMPORTANTE
│  │  ├─ cvFile: ¿tipo correcto? (PDF solamente)
│  │  ├─ cvFile: ¿tamaño < 5MB?
│  └─ Backend responde: CandidateDto (nuevo)
│
├─ Front recibe respuesta
│  ├─ ¿Success? → Dialog cierra
│  ├─ store.loadData() ← REFRESH (actualiza tabla)
│  └─ ¿Error? → Muestra toast con mensaje
│
└─ FINAL: Tabla actualiza y muestra nuevo candidato
```

**Verificar:**
- ❓ ¿Front y Back validan LO MISMO? (email válido, file PDF)
- ❓ ¿Front valida algo que back NO valida? → Falsa seguridad
- ❓ ¿Back valida algo que front NO valida? → Sorpresas en producción
- ❓ ¿Si falla en backend, front sabe qué mostrar? (error handling)

---

### 3.2 Diagrama por Rol

**Pregunta:** ¿Cada rol ve/hace cosas diferentes?

**Ejemplo (Candidatos):**

```
RECLUTAMIENTO ve:
  ├─ candidate-list.ts
  │  ├─ [Crear] ✅
  │  ├─ [Editar] ✅
  │  ├─ [Eliminar] ✅
  │  └─ [Ver CV] ✅
  └─ candidate-application-list.ts
     ├─ [Ver Todas] ✅
     ├─ [Cambiar Etapa] ✅
     ├─ [Asignar Entrevistador] ✅
     └─ [Ver Feedback] ✅

ENTREVISTADOR ve:
  ├─ candidate-list.ts → ❌ (NO VE)
  ├─ candidate-application-list.ts
  │  ├─ [Ver Postulaciones] ✅ (solo las mías)
  │  ├─ [Cambiar Etapa] ❌
  │  └─ [Ver Feedback] ✅
  └─ candidate-interview-pending.ts
     ├─ [Ver Pendientes] ✅
     ├─ [Guardar Feedback] ✅
     └─ [Cambiar Etapa] ❌

OPERACIONES ve:
  ├─ candidate-list.ts → ❌
  └─ candidate-application-list.ts
     ├─ [Ver Postulaciones] ✅ (en "AwaitingOpsReview")
     ├─ [Cambiar Etapa] ✅ (solo "OpsApproved" o "Rejected")
     └─ [Validar Datos] ✅
```

**Verificar:**
- ❓ ¿El rol correcto ve cada componente?
- ❓ ¿Hay botones visibles que el rol NO debería ver?
- ❓ ¿El backend rechaza acción de rol no autorizado?

---

## ⚠️ SECCIÓN 4: Errores de Lógica (CRÍTICA)

### 4.1 Estados Imposibles

**Pregunta:** ¿Hay situaciones donde la lógica se quiebra?

```
❌ ERROR EJEMPLO 1: Eliminar candidato en proceso de contratación

Flujo posible (rompe lógica):
1. Reclutamiento aprueba Candidato A para posición "Dev"
   → CandidateApplication.stage = "OpsApproved"
   
2. Usuario Admin abre candidate-list.ts
   → Ve botón [Eliminar]
   → Clic → DELETE /api/candidates/{candidateId}
   
3. Backend: ¿Verifica que candidato NO esté en proceso?
   ├─ NO ❌ → ELIMINA → BD inconsistente
   └─ SÍ ✅ → RECHAZA → Error 400
   
VERIFICAR:
- ¿Backend revisa si hay CandidateApplication en estado ≠ Final?
- ¿Frontend esconde botón [Eliminar] si hay postulaciones activas?
```

```
❌ ERROR EJEMPLO 2: Mismo candidato aprobado para 2 posiciones

Flujo posible (rompe lógica):
1. Candidato A postula a "Dev Senior" (applicationA)
   → Reclutamiento lo aprueba y mueve a "OpsApproved"
   
2. Candidato A TAMBIÉN postula a "Dev Junior" (applicationB)
   → Reclutamiento lo aprueba TAMBIÉN
   
3. Backend intenta crear 2 Employees (mismo email)
   → ¿Permite duplicado?
   ├─ SÍ ❌ → Candidato existe 2 veces
   └─ NO ✅ → Una se rechaza
   
VERIFICAR:
- ¿Backend evita Employees con email duplicado?
- ¿Frontend muestra warning: "Este candidato ya fue contratado"?
- ¿Qué pasa con la otra postulación?
```

```
❌ ERROR EJEMPLO 3: Inconsistencia Front vs Back validaciones

Flujo posible (rompe lógica):
1. Frontend: formulario de CV solo acepta PDF
   <input type="file" accept=".pdf" />
   
2. Usuario abre DevTools y cambia accept=".pdf" → accept="*"
   → Carga archivo DOCX
   
3. Backend: solo espera PDF
   ├─ NO valida ❌ → Guarda DOCX en BD
   └─ SÍ valida ✅ → Rechaza con 400
   
VERIFICAR:
- ¿Backend valida tipo MIME de archivo?
- ¿Backend valida tamaño máximo?
- ¿Backend rechaza con error claro?
```

```
❌ ERROR EJEMPLO 4: Cambiar etapa sin datos requeridos

Flujo posible (rompe lógica):
1. Candidato en "Interviewed" sin feedback
   
2. Reclutamiento intenta mover a "AwaitingOpsReview"
   
3. Backend: ¿Verifica que existe feedback?
   ├─ NO ❌ → MUEVE → Etapa sin datos
   └─ SÍ ✅ → RECHAZA → "Se requiere feedback"
   
VERIFICAR:
- ¿Backend valida pre-requisitos de cada etapa?
- ¿Frontend muestra validación?
```

```
❌ ERROR EJEMPLO 5: Permisos en Backend no sincronizados con Frontend

Flujo posible (rompe seguridad):
1. Frontend: Solo Admin ve botón [Eliminar]
   
2. Entrevistador abre DevTools:
   → Copia URL DELETE /api/candidates/123
   → Ejecuta en consola: fetch('/api/candidates/123', {method: 'DELETE'})
   
3. Backend: ¿Verifica permisos?
   ├─ NO ❌ → ELIMINA → Agujero de seguridad
   └─ SÍ ✅ → RECHAZA → 403 Unauthorized
   
VERIFICAR:
- ¿Backend tiene [Authorize] en TODOS los endpoints?
- ¿Frontend Guard verifica rol ANTES de cargar componente?
```

---

### 4.2 Checklist de Errores Comunes a Buscar

```
VALIDACIONES INCONSISTENTES:
- [ ] Email: ¿Valida front y back? (formato, unicidad)
- [ ] Archivo CV: ¿Mismo tipo aceptado front y back?
- [ ] Tamaño archivo: ¿Mismo límite front y back?
- [ ] Números: ¿Mismo rango permitido?
- [ ] Strings: ¿Mismo largo máximo?

DATOS HUÉRFANOS:
- [ ] Si Candidato se elimina, ¿qué pasa con CandidateApplications?
- [ ] Si RequestPosition se elimina, ¿qué pasa con postulaciones?
- [ ] ¿Hay foreign keys con ON DELETE = ?
   ├─ CASCADE (peligroso)
   ├─ SET NULL (posible)
   └─ RESTRICT (seguro)

ESTADOS FINALES:
- [ ] ¿Estados finales (Hired, Rejected) se pueden revertir?
- [ ] ¿Hay transiciones prohibidas que backend permite?
- [ ] ¿Se puede eliminar un candidato en estado final?

PERMISOS:
- [ ] ¿Todos los endpoints tienen [Authorize]?
- [ ] ¿Los Guard de rutas coinciden con los roles del endpoint?
- [ ] ¿Frontend esconde botones que backend rechazaría?
- [ ] ¿Hay endpoints sin [Authorize] que deberían tenerlo?

DATOS DUPLICADOS:
- [ ] ¿Email único en Candidate?
- [ ] ¿Mismo candidato puede postular 2 veces a misma posición?
- [ ] ¿Hay registros duplicados en tabla de auditoría?

ERRORES DE LÓGICA:
- [ ] ¿Cambiar etapa valida pre-requisitos (ej: feedback)?
- [ ] ¿Eliminar candidato revisa si está en proceso?
- [ ] ¿Crear Employee revisa si candidato ya existe?
```

---

## 📊 SECCIÓN 5: Diagrama de Componentes (Visual)

**Pregunta:** ¿Cómo se conectan los componentes?

**Hacer Diagrama (ASCII o Mermaid):**

```
┌──────────────────────────────────────────────────────────┐
│                    RECRUITMENT MODULE                     │
├──────────────────────────────────────────────────────────┤
│                                                            │
│  RECLUTAMIENTO (Rol)                                       │
│  ├─ candidate-list.ts                                     │
│  │  └─ [Crear, Editar, Eliminar, Ver CV]                 │
│  └─ candidate-application-list.ts                         │
│     └─ [Ver Todas, Cambiar Etapa, Asignar Entrevistador] │
│                                                            │
│  ENTREVISTADOR (Rol)                                       │
│  └─ candidate-interview-pending.ts                        │
│     └─ [Ver Pendientes, Guardar Feedback]                │
│                                                            │
│  OPERACIONES (Rol)                                         │
│  └─ candidate-application-list.ts (filtrado)              │
│     └─ [Validar, Cambiar Etapa a OpsApproved/Rejected]   │
│                                                            │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ BACKEND (API)                                       │  │
│  ├─────────────────────────────────────────────────────┤  │
│  │ POST /api/candidates (Reclutamiento)                │  │
│  │ GET /api/candidates                                 │  │
│  │ PUT /api/candidates/{id}                            │  │
│  │ DELETE /api/candidates/{id} (solo Admin)            │  │
│  │ GET /api/candidate-applications                     │  │
│  │ POST /api/candidate-applications/{id}/stage         │  │
│  │ POST /api/candidate-interviews/{id}/feedback        │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                            │
└──────────────────────────────────────────────────────────┘
```

---

## 📋 SECCIÓN 6: Validaciones Front vs Back

**Pregunta:** ¿Cuáles validaciones hace cada lado?

```
📝 Hacer Tabla Comparativa:

| Campo | Validación Frontend | Validación Backend | ¿Coinciden? |
|-------|-------------------|------------------|-----------|
| Email | Required, Email (Regex) | Required, Email, Unique | ⚠️ Parcial |
| FullName | Required, MaxLength(100) | Required | ❌ Inconsistente |
| Phone | Regex \d{10} | Regex \d{7-15} | ❌ Diferente |
| CV File | accept=".pdf", maxSize=5MB | maxSize=5MB, MIME type | ✅ OK |
| Stage | Enum (select) | Enum + validation | ✅ OK |
```

**Verificar:**
- ❓ ¿Qué valida SOLO front? (false sense of security)
- ❓ ¿Qué valida SOLO back? (sorpresas para usuario)
- ❓ ¿Debería validar ambos?

---

## 📑 SECCIÓN 7: Listado de Funcionalidades por Componente

**Pregunta:** ¿Qué puedo hacer en cada componente?

```
📝 Hacer Tabla:

| Componente | Rol Requerido | ¿Qué Puedo Hacer? | Ubicación |
|-----------|---------------|------------------|-----------|
| candidate-list | Reclutamiento | Crear nuevo candidato | /recruitment/candidates/candidates |
| | | Editar datos | |
| | | Eliminar | |
| | | Ver CV | |
| | | Filtrar por nombre | |
| | | Paginar | |
| | | Ordenar columnas | |
| | | | |
| candidate-application-list | Reclutamiento | Ver postulaciones | /recruitment/candidates/applications |
| | | Cambiar etapa | |
| | | Asignar entrevistador | |
| | | Ver feedback | |
| | | Filtrar por etapa | |
| | Entrevistador | Ver postulaciones mías | /recruitment/candidates/applications |
| | | Ver feedback | |
| | | (SIN cambiar etapa) | |
| | Operaciones | Ver postulaciones en review | /recruitment/candidates/applications |
| | | Aprobar/Rechazar | |
| | | (SIN cambiar a otros estados) | |
| | | | |
| candidate-interview-pending | Entrevistador | Ver entrevistas pendientes | /recruitment/candidates/interview/pending |
| | | Guardar feedback (rating + texto) | |
| | | (SIN crear candidato) | |
```

---

## 🤖 SECCIÓN F: Análisis de Automatización

**Pregunta:** ¿Qué pasos manuales hoy podrían ser automáticos en el futuro?

### F.1: Inventario de Pasos Manuales

Mapear CADA paso del flujo end-to-end (usa SECCIÓN 4 como referencia):

```
📝 Hacer Tabla:

| Paso | Acción | Manual? | Automizable? | Pre-requisito | ROI |
|------|--------|---------|-----------|-------------|-----|
| 1 | Crear solicitud | SÍ | SÍ (calendar) | Nada | BAJO |
| 2 | Asignar candidato | SÍ | **SÍ** (from HR) | HR API | ALTO |
| 3 | Calcular etapa | NO | Ya auto | - | - |
| 4 | Revisar candidato | SÍ | NO (humano) | - | - |
| 5 | Aprobar | SÍ | PODRÍA (audit) | Paso 4 ✅ | MEDIO |
| 6 | Exportar | SÍ | **SÍ** (ClosedXML) | Export svc | ALTO |
| 7 | Integrar sistema | SÍ | **SÍ** (API) | Ext API exists | MUY ALTO |
```

**Cómo llenar:**
- **Manual?:** ¿Lo hace un usuario hoy (no automático)?
- **Automizable?:** ¿Podría serlo (SÍ/NO/PODRÍA)?
- **Pre-requisito:** ¿Qué debe existir primero?
- **ROI:** Estimación: BAJO (<1h manual/mes) / MEDIO (1-4h) / ALTO (4h+)

---

### F.2: Quick Wins vs Strategic

Separar automatizaciones por esfuerzo:

```
QUICK WINS (1-2 semanas, poco código):
├─ Exportar a formato pago (8h) → elimina 20 min manual/mes
└─ Auto-trigger en cambio de estado (4h) → elimina 10 min manual/mes

MEDIUM (3-4 semanas, requiere integración):
├─ Sync de datos desde HR module (16h) → elimina 2h manual/mes
└─ Auto-aprobación si todos aprobaron (6h) → elimina 15 min manual/mes

STRATEGIC (1-2+ meses, dependencias externas):
├─ Integración con Contabilidad (24h) → elimina 1h manual/mes
└─ Sincronización con nómina (20h) → elimina 1.5h manual/mes
```

**Guardar en auditoría:** Listado de quick wins (para primer sprint post-auditoría)

---

### F.3: Pre-requisitos (CRÍTICO)

Verificar que existen ANTES de poder automatizar:

```
Automatización    │ Pre-requisito 1         │ Pre-requisito 2        │ ¿Existe Hoy?
──────────────────┼────────────────────────┼───────────────────────┼──────────
Auto-sync datos   │ API de origen (.../list)│ Scheduler/Webhook      │ ❌ NO
Auto-export       │ ClosedXML service ✅   │ Formato especificado   │ ⚠️ PARCIAL
Auto-integración  │ API externa documentada │ Mapping de campos      │ ❓ VERIFICAR
```

**Buscar en código:**
```bash
# ¿Existe ClosedXML?
grep -r "ClosedXML" api/

# ¿Hay endpoint de origen para sync?
grep -r "public.*Get.*List" api/LuxuryApp.Application/Moduls/HR/

# ¿Hay configuración de scheduler?
grep -r "Hangfire\|BackgroundJob\|Timer" api/
```

---

## 🎯 SECCIÓN 8: Reporte Final Esperado

**Estructura del reporte que debes generar:**

```markdown
# Auditoría: [Módulo] - [Fecha]

## 1. Hallazgos Críticos (Errores que ROMPEN Lógica)
- ❌ [Descripción del error]
- ✅ [Si no hay errores, listar OK]

## 2. Matriz de Permisos
[Tabla con roles × endpoints × acceso]

## 3. Validaciones Inconsistentes
[Tabla front vs back]

## 4. Diagramas de Flujo
[Diagrama ASCII/Mermaid]

## 5. Entidades y Relaciones
[Tabla con estructura]

## 6. DTOs vs Interfaces
[Comparación front vs back]

## 7. Listado de Funcionalidades
[Tabla de qué hace cada componente]

## 8. Recomendaciones
- [ ] Acción 1
- [ ] Acción 2
```

---

## ✅ Checklist Final de Auditoría

Antes de dar por completada la auditoría, verifica:

```
ESTRUCTURA:
- [ ] Identifiqué todas las entidades
- [ ] Identifiqué todos los enums
- [ ] Identifiqué todos los DTOs
- [ ] Verifiqué interfaces vs DTOs

PERMISOS:
- [ ] Creé matriz de roles
- [ ] Verifiqué que backend tiene [Authorize]
- [ ] Verifiqué que frontend tiene Guards
- [ ] Verifiqué coherencia

FLUJOS:
- [ ] Dibujé flujo principal (end-to-end)
- [ ] Dibujé flujos por rol
- [ ] Identifiqué estados imposibles
- [ ] Identifiqué transiciones prohibidas

VALIDACIONES:
- [ ] Comparé validaciones front vs back
- [ ] Identifiqué inconsistencias
- [ ] Identifiqué validaciones faltantes

LÓGICA:
- [ ] Busqué errores de eliminación
- [ ] Busqué duplicados
- [ ] Busqué datos huérfanos
- [ ] Busqué cambios de estado sin pre-requisitos

GENERÉ REPORTE:
- [ ] Con matrices de permisos
- [ ] Con diagramas de flujo
- [ ] Con listado de funcionalidades
- [ ] Con recomendaciones claras
```

---

**Nota:** Este prompt es GENÉRICO. Personalízalo según el módulo que audites.  
**Tiempo esperado:** 4-6 horas por módulo completo.  
**Resultado:** Reporte con 10-15 tablas + 3-5 diagramas + lista de errores.

