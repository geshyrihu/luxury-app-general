# Checklist Completo de Auditoría: Todos los Puntos

**Uso:** Marca ✅ mientras auditas. Si algo está ❌, agrega a "Hallazgos".

---

## 📌 ANTES DE EMPEZAR

**Módulo que voy a auditar:** ___________________  
**Fecha:** ___________________  
**Auditor:** ___________________  

```
Léele esto ANTES:
- [ ] Leo CONVENTIONS.md (para saber qué debe cumplir)
- [ ] Leo el código del módulo (back + front)
- [ ] Abro dos ventanas: una en backend, otra en frontend
- [ ] Tengo a mano: DTOs, interfaces, endpoints, componentes
```

---

## 🏗️ SECCIÓN A: ESTRUCTURA (Back)

### A1. Entidades Principales

```
Entidades identificadas:
- [ ] Entidad maestra (ej: Candidate)
- [ ] Entidades secundarias (ej: CandidateApplication)
- [ ] Entidades catálogo (ej: CandidateDecisionReason)

Verificar POR CADA ENTIDAD:
```

| Entidad | Verificar | ✅/❌ | Nota |
|---------|----------|-------|------|
| | ¿Tiene responsabilidad clara (no mezcla datos)? | | |
| | ¿Tiene PrimaryKey? | | |
| | ¿Usa soft delete (ArchivedDate)? | | |
| | ¿Tiene ForeignKeys válidas? | | |
| | ¿No hay relaciones circulares? | | |

### A2. Enums del Módulo

```
Enums identificados:
- [ ] Enum de estados (ej: ApplicationStage)
- [ ] Enum de roles (ej: UserRole)
- [ ] Otros enums (ej: DecisionType)

Verificar POR CADA ENUM:
```

| Enum | Valores | Verificar | ✅/❌ |
|------|---------|-----------|-------|
| | | ¿Se usa TODOS los valores en el código? | |
| | | ¿Hay valores duplicados? | |
| | | ¿Los nombres son claros? | |
| | | ¿El ordenamiento tiene sentido? | |

### A3. Data Transfer Objects (DTOs)

```
DTOs identificados:
- [ ] DTO para listar
- [ ] DTO para crear
- [ ] DTO para actualizar
- [ ] DTO para respuesta

Verificar POR CADA DTO:
```

| DTO | Verificar | ✅/❌ |
|-----|-----------|-------|
| | ¿Tiene propiedad redundante? (ej: Id y AnotherIdView?) | |
| | ¿Frontend recibe el mismo DTO? | |
| | ¿Todos los campos están documentados? | |
| | ¿Hay campos null que podrían ser problema? | |

---

## 🔒 SECCIÓN B: SEGURIDAD Y PERMISOS (Back)

### B1. Autorización en Endpoints

```
Verificar CADA endpoint:
```

| Endpoint | Método | ¿Tiene [Authorize]? | Rol Requerido | ✅/❌ |
|----------|--------|-------------------|---------------|-------|
| /api/[entity] | GET | ✅/❌ | | |
| /api/[entity] | POST | ✅/❌ | | |
| /api/[entity]/{id} | GET | ✅/❌ | | |
| /api/[entity]/{id} | PUT | ✅/❌ | | |
| /api/[entity]/{id} | DELETE | ✅/❌ | | |
| ... | | | | |

**Hallazgos:**
- ❌ Si falta [Authorize] en algún endpoint: **CRÍTICO**
- ❌ Si [Authorize] no especifica Roles: ¿es intencional?

### B2. Validaciones de Datos en Backend

```
Verificar POR CADA DTO POST/PUT:
```

| Campo | Validar Qué | Cómo Backend Valida | ✅/❌ |
|-------|-------------|-------------------|-------|
| email | ¿Formato válido? | [EmailAddress] | |
| email | ¿Único? | FluentValidation | |
| nombre | ¿No vacío? | [Required] | |
| archivo | ¿Tipo correcto (PDF)? | MimeType check | |
| archivo | ¿Tamaño < 5MB? | File.Length | |
| estado | ¿Valor permitido (Enum)? | Switch/Case | |

**Hallazgos:**
- ❌ Si Backend PERMITE algo que Front NO permite: falsa seguridad
- ❌ Si Backend NO valida: agujero de seguridad

---

## 🎨 SECCIÓN C: FRONT (Angular)

### C1. Interfaces (Tipos)

```
Verificar QUE COINCIDAN con Backend DTOs:
```

| DTO Backend | Interface Frontend | ¿Campos Coinciden? | ✅/❌ |
|------------|------------------|-------------------|-------|
| CandidateDto | CandidateDto | id, email, fullName... | |
| | | ¿Mismo tipo (string, Guid, Date)? | |
| | | ¿Mismo nullable (?)? | |

### C2. Componentes (Visuales)

```
Verificar CADA COMPONENTE:
```

| Componente | Ubicación | Rol Requerido | ¿Qué Hace? | ¿Tiene Guard? | ✅/❌ |
|-----------|-----------|---------------|-----------|--------------|-------|
| candidate-list | /recruitment/candidates | Reclutamiento | Listar, crear, editar | CanActivateFn | |
| ... | | | | | |

**Verificar:**
- ❌ ¿El componente NO tiene guard pero debería? (agujero)
- ❌ ¿Guard verifica rol correcto? (ej: Entrevistador puede entrar?)

### C3. Formularios (Validaciones)

```
Verificar CADA FORM:
```

| Form | Campo | Validador | Frontend | Backend | ¿Coinciden? |
|------|-------|-----------|----------|---------|------------|
| CandidateForm | email | email | ✅ pattern | ✅ [EmailAddress] | ✅ |
| | email | unique | ❌ NO | ✅ SÍ | ❌ Inconsistente |
| | cvFile | .pdf only | ✅ accept=".pdf" | ✅ MimeType | ✅ |
| | cvFile | <5MB | ✅ | ✅ | ✅ |

**Hallazgos:**
- ❌ Frontend valida "email unique" pero no existe validador async
- ✅ Archivo PDF validado en ambos lados

### C4. Manejo de Errores

```
Verificar:
```

- [ ] ¿Cuando backend rechaza, frontend muestra error?
- [ ] ¿El error es claro para el usuario? (no stack trace)
- [ ] ¿Se intenta guardar de nuevo automáticamente?
- [ ] ¿Hay timeout si servidor no responde?

---

## 📊 SECCIÓN D: FLUJOS DE DATOS

### D1. Flujo Principal: Crear Candidato

```
Paso 1: Usuario ve lista (GET /api/candidates)
- [ ] ¿Endpoint tiene [Authorize(Roles = "Reclutamiento")]?
- [ ] ¿Frontend tiene Guard que verifica rol?
- [ ] ¿Backend filtra solo por role?

Paso 2: Usuario clic "Crear"
- [ ] ¿Abre formulario o dialog?
- [ ] ¿Formulario pre-valida campos?

Paso 3: Usuario llena email
- [ ] Frontend valida: email@example.com
- [ ] ¿Verifica formato?
- [ ] ¿Verifica unique (async)?
  - ❌ Si NO → Backend lo rechazará → Error confuso

Paso 4: Usuario sube CV
- [ ] Frontend: accept=".pdf" → ¿solo PDF?
- [ ] ¿Muestra tamaño?
- [ ] Backend: ¿verifica MIME type?
- [ ] Backend: ¿verifica tamaño?
  - ❌ Si solo frontend valida tamaño → Usuario en mobile puede subir 10MB

Paso 5: Usuario clic "Guardar"
- [ ] Frontend valida form.valid
- [ ] Frontend prepara FormData
- [ ] Frontend hace POST /api/candidates
- [ ] Backend: [Authorize(Roles = "Reclutamiento")]?
  - [ ] ¿Verifica user IS Reclutamiento?
  - ❌ Si NO → Entrevistador podría crear candidatos
  
Paso 6: Backend recibe
- [ ] ¿Valida fullName no vacío?
- [ ] ¿Valida email formato?
- [ ] ¿Valida email ÚNICO?
- [ ] ¿Valida CV es PDF?
- [ ] ¿Valida tamaño < 5MB?

Paso 7: Backend guarda
- [ ] ¿Crea Candidate?
- [ ] ¿Guarda CV en storage?
- [ ] ¿Genera URL segura del CV?

Paso 8: Frontend recibe respuesta
- [ ] ¿Dialog cierra?
- [ ] ¿Tabla refresh (store.loadData())?
- [ ] ¿Muestra toast "Candidato creado"?
- [ ] ¿Nuevo candidato aparece en tabla?
```

### D2. Flujo: Cambiar Etapa de Candidato

```
Escenario: Candidato en "New" → cambiar a "AwaitingInterview"

Paso 1: Usuario clic en aplicación
- [ ] ¿Ve botón "Change Stage"?
- [ ] ¿Solo Reclutamiento lo ve?

Paso 2: Usuario abre modal/dialog
- [ ] ¿Se carga lista de etapas?
- [ ] ¿Se muestra TODAS o solo válidas?
  - ✅ Mejor: solo etapas válidas desde "New"

Paso 3: Usuario selecciona "AwaitingInterview"
- [ ] ¿Frontend previene transición inválida?
- [ ] ¿Backend valida transición?
  - ❌ Si solo frontend → User abre DevTools y fuerza "Hired"

Paso 4: Backend procesa
- [ ] ¿Verifica que transición es válida?
- [ ] ¿Verifica pre-requisitos?
  - ej: ¿requiere entrevistador asignado?
  - ej: ¿requiere feedback completado?
  
Paso 5: Backend rechaza o acepta
- [ ] ¿Si rechaza, responde con 400 + mensaje claro?
- [ ] ¿Si acepta, actualiza BD?

Paso 6: Frontend actualiza UI
- [ ] ¿Modal cierra?
- [ ] ¿Tabla refresh?
- [ ] ¿Nueva etapa aparece?
```

### D3. Flujo: Eliminar Candidato

```
⚠️ PUNTO CRÍTICO: ¿Se permite eliminar si está en proceso?

Paso 1: Usuario abre candidate-list
- [ ] ¿Ve botón [Eliminar]?
- [ ] ¿Solo Admin?
- [ ] ¿Escondido si candidato tiene postulaciones activas?

Paso 2: Backend recibe DELETE /api/candidates/{id}
- [ ] ¿Verifica [Authorize(Roles = "Admin")]?
- [ ] ¿Revisa si hay CandidateApplications no finalizadas?
  - [ ] Si SÍ → rechaza: "No se puede eliminar, hay postulaciones activas"
  - ❌ Si NO → ELIMINA → BD inconsistente

Paso 3: Si soft delete
- [ ] ¿Marca ArchivedDate?
- [ ] ¿Frontend oculta candidatos archivados?
- [ ] ¿Backend excluye archivados de GETs?
```

---

## ⚠️ SECCIÓN E: ERRORES DE LÓGICA (BUSCAR ESTOS)

### E1. Eliminación en Cascada

```
❌ ERROR: Si Candidate se elimina, ¿qué pasa con CandidateApplication?

Backend check:
- [ ] ¿CandidateApplication.CandidateId tiene FK?
- [ ] ¿ON DELETE está como qué?
  - [ ] CASCADE: Si elimino Candidate → se eliminan postulaciones ❌ MAL
  - [ ] RESTRICT: Si elimino y hay postulaciones → error ✅ BIEN
  - [ ] SET NULL: Se pone NULL (posible si no requerido)

Si está CASCADE:
- [ ] Se puede perder historial de contratación ❌
- [ ] Recomendación: cambiar a RESTRICT o usar soft delete
```

### E2. Duplicados de Email

```
❌ ERROR: ¿Dos candidatos con mismo email?

Backend check:
- [ ] ¿Email tiene UNIQUE constraint en BD?
- [ ] ¿Backend verifica UNIQUE antes de insertar?
- [ ] ¿Error que retorna es claro?

Frontend check:
- [ ] ¿Existe validator async checkEmailUnique()?
- [ ] ¿Se llama en tiempo real o al guardar?
```

### E3. Candidato Contratado en 2 Puestos

```
❌ ERROR: Mismo candidato aprobado para 2 posiciones distintas

Escenario:
1. Candidato A postula a "Dev Senior" → aprobado → en proceso de contratación
2. Candidato A postula a "Dev Junior" → también aprobado
3. ¿Se puede crear 2 Employees?

Backend check:
- [ ] ¿Verifica si candidato ya existe en BD Employees?
  - [ ] Por email?
  - [ ] Por IdNumber?
- [ ] ¿Qué pasa con la segunda postulación?
  - [ ] Se rechaza automáticamente?
  - [ ] Se deja en espera?

Frontend check:
- [ ] ¿Muestra warning: "Este candidato ya fue contratado"?
- [ ] ¿Impide cambiar etapa a Hired?
```

### E4. Estados Inválidos

```
❌ ERROR: ¿Se puede pasar de estado A → B si no debería?

Matriz de transiciones válidas:
```

| De | A | ¿Permitido? | Backend Valida? | ¿Qué Falta? |
|----|----|-----------|-----------------|-----------|
| New | AwaitingInterview | ✅ | ✅ | - |
| New | Hired | ❌ | ❓ | ¿Rechaza? |
| Interviewed | New | ❌ | ❓ | ¿Rechaza? (no atrás) |
| Rejected | AwaitingInterview | ❌ | ❓ | ¿Rechaza? (final) |

```
Verificar:
- [ ] ¿Backend tiene switch/case validando transiciones?
- [ ] ¿Rechaza con 400 si transición inválida?
```

### E5. Pre-requisitos Olvidados

```
❌ ERROR: ¿Se puede cambiar de etapa sin cumplir requisitos?

Por etapa:
```

| Etapa | Pre-requisitos | Backend Valida? |
|-------|---|---|
| Interviewed | ¿Existe feedback? | ✅/❌ |
| AwaitingOpsReview | ¿CV validado? | ✅/❌ |
| OpsApproved | ¿Email único? | ✅/❌ |
| AwaitingHiringProcess | ¿Datos completos para crear Employee? | ✅/❌ |

```
Verificar:
- [ ] Backend valida pre-requisitos antes de permitir transición
```

### E6. Inconsistencia de Validaciones

```
❌ ERROR: Frontend valida algo que backend NO valida

Ejemplos:
- [ ] Frontend: email format check (regex)
  - Backend: NO valida formato → usuario confundido
  
- [ ] Frontend: archivo PDF only (accept=".pdf")
  - Backend: NO valida MIME type → usuario sube DOCX

- [ ] Frontend: phone pattern \d{10}
  - Backend: pattern \d{7-15} → diferentes validaciones
```

---

## 🔐 SECCIÓN F: PERMISOS Y ROLES

### F1. Matriz de Acceso por Rol

```
Hacer tabla POR CADA ROL:
```

| Rol | Componentes Que Ve | Acciones Que Puede Hacer |
|-----|------------------|------------------------|
| Reclutamiento | candidate-list, candidate-application-list, interview-results | Crear, Editar, Eliminar, Cambiar Etapa |
| Entrevistador | candidate-interview-pending, (aplicaciones en AwaitingInterview) | Ver, Feedback |
| Operaciones | candidate-application-list (solo OpsReview) | Validar, Cambiar a OpsApproved/Rejected |
| Admin | TODO | TODO |

### F2. Frontend Guards

```
Verificar cada ruta:
```

| Ruta | ¿Tiene Guard? | ¿Verifica Rol? | Rol Requerido |
|------|--------------|----------------|--------------|
| /recruitment/candidates | ✅/❌ | ✅/❌ | Reclutamiento |
| /recruitment/applications | ✅/❌ | ✅/❌ | Reclutamiento, Entrevistador, Ops |
| /recruitment/interview/pending | ✅/❌ | ✅/❌ | Entrevistador |

**Hallazgo:**
- ❌ Si ruta NO tiene guard: Entrevistador podría abrir candidate-list

### F3. Backend [Authorize]

```
Verificar cada endpoint:
```

| Endpoint | [Authorize]? | Roles? | ✅/❌ |
|----------|-------------|--------|-------|
| GET /api/candidates | ✅/❌ | Reclutamiento | |
| POST /api/candidates | ✅/❌ | Reclutamiento | |
| DELETE /api/candidates/{id} | ✅/❌ | Admin | |
| POST /api/.../stage | ✅/❌ | Reclutamiento, Ops (diferente por estado) | |

**Hallazgo:**
- ❌ Si DELETE no tiene [Authorize(Roles = "Admin")]: agujero de seguridad

---

## 📝 SECCIÓN G: DOCUMENTACIÓN Y CÓDIGO

### G1. Nombres Claros

```
Verificar:
- [ ] ¿Clases tienen nombres que describen qué hacen?
  - ✅ CandidateApplicationService
  - ❌ CandidateService (ambiguo)
  
- [ ] ¿Métodos tienen nombres que describen resultado?
  - ✅ GetAllActiveApplications()
  - ❌ GetData()
  
- [ ] ¿Variables no tienen nombres genéricos?
  - ✅ candidateApplications
  - ❌ items, data, list
```

### G2. Comentarios

```
Verificar:
- [ ] ¿Hay comentarios explicando POR QUÉ (no QUÉ)?
- [ ] ¿Hay TODOs sin resolver?
- [ ] ¿Hay código comentado (dead code)?
```

---

## 📊 SECCIÓN H: PERFORMANCE (Opcional)

### H1. Queries a Base de Datos

```
Verificar:
- [ ] ¿GET /api/candidates trae todos o paginados?
  - ❌ Todos: problema si hay 100k candidatos
  - ✅ Paginados: mejor

- [ ] ¿Hay lazy loading de datos relacionados?
  - ¿include()? .Include(c => c.CandidateApplications)?
  
- [ ] ¿Hay N+1 queries?
  - ❌ Loop sobre candidatos y query cada uno
  - ✅ Single query con Include()
```

---

## 📋 SECCIÓN I: RESUMEN DE HALLAZGOS

### Críticos (❌ Rompen Funcionalidad)

```
- [ ] Falta [Authorize] en endpoint sensible
- [ ] Eliminación en cascada borra datos
- [ ] Permite transición de estado inválida
- [ ] Email no es único (duplicados)
- [ ] Frontend y backend validan diferente
- [ ] Guard faltante en ruta sensible
```

### Altos (⚠️ Riesgo de Datos)

```
- [ ] Pre-requisitos no validados
- [ ] Soft delete no implementado pero debería
- [ ] Error handling incompleto
- [ ] Toast/mensaje confuso para usuario
```

### Medios (📝 Mejoras)

```
- [ ] Nombre de clase/método no claro
- [ ] Falta comentario explicando lógica
- [ ] Validación inconsistente (aunque funciona)
```

---

## ✅ CHECKUP FINAL

Antes de cerrar auditoría:

```
- [ ] Creé matriz de permisos (roles × endpoints)
- [ ] Creé diagrama de flujos (end-to-end)
- [ ] Identifiqué 3+ errores de lógica
- [ ] Comparé validaciones front vs back
- [ ] Verifiqué pre-requisitos de etapas
- [ ] Verifiqué que eliminación NO rompe integridad
- [ ] Generé reporte con recomendaciones
- [ ] Revisé con alguien (code review)
```

---

**Reporte a generar cuando termines:** `docs/[ModuleLuxuryApp]/[Submodulo]/YYYYMMDD-auditoria-[modulo]-[submodulo].md` (estructura plana, `CONVENTIONS.md` §6ter)

