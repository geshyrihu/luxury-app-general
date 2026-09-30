# Auditoría: ReclutamientoLuxuryApp - 20260910

## 1. Hallazgos Críticos (Errores que ROMPEN Lógica)

- ❌ Falta de autorización en endpoint DELETE /api/candidates/{id}: no [Authorize(Roles = "Admin")], lo que permite a usuarios no admin eliminar candidatos.
- ❌ Endpoint POST /api/candidate-applications/{id}/stage permite cambiar de etapa sin validar pre-requisitos (p. ej., de "Interviewed" a "New" sin feedback).
- ❌ Eliminación de candidato sin revisar si tiene postulaciones activas (CandidateApplication) — riesgo de pérdida de historial.
- ❌ Falta de validación de unicidad de email en backend; el frontend solo verifica en tiempo real, pero el backend permite duplicados.
- ❌ Validación de tipo y tamaño de archivo CV solo en frontend; backend no verifica MIME type ni tamaño, permitiendo subir archivos no PDF o >5MB.
- ❌ Cambio de etapa sin verificar pre-requisitos (p. ej., pasar de "Interviewed" a "New" sin feedback) — rompe lógica de negocio.
- ❌ Botón "Eliminar" visible en la lista de candidatos para roles que no tienen permiso de eliminación (p. ej., Entrevistador).

## 2. Matriz de Permisos

| Endpoint | Método | Acción | Rol Requerido | ¿Front lo Llama? | ¿Hay Guard? |
|----------|--------|--------|---------------|-----------------|-------------|
| /api/candidates | GET | Listar | Reclutamiento | ✅ SÍ | ✅ CanActivateFn |
| /api/candidates | POST | Crear | Reclutamiento | ✅ SÍ | ✅ CanActivateFn |
| /api/candidates/{id} | GET | Ver | Reclutamiento | ✅ SÍ | ✅ CanActivateFn |
| /api/candidates/{id} | DELETE | Eliminar | Admin | ✅ NO (oculto) | ✅ CanActivateFn |
| /api/candidate-applications/{id}/stage | POST | Cambiar etapa | Reclutamiento | ✅ SÍ | ✅ CanActivateFn |
| /api/candidate-applications/{id}/stage/hired | POST | Cambiar a Hired | Reclutamiento | ✅ SÍ | ✅ CanActivateFn |
| /api/candidate-applications/{id} | DELETE | Eliminar aplicación | Admin | ✅ NO (oculto) | ✅ CanActivateFn |

## 3. Validaciones Inconsistentes

- **Email**: Frontend valida formato y unicidad en tiempo real; backend solo verifica formato, no unicidad → riesgo de duplicados.
- **CV file**: Frontend accept=".pdf", backend solo verifica extensión; no verifica MIME type ni tamaño → permite subir archivos no PDF o >5MB.
- **Tamaño archivo**: Frontend limita a 5MB, backend no verifica → posible subir archivos grandes.
- **Botones visibles**: Botón "Eliminar" visible para Reclutamiento aunque backend requiere Admin → inconsistencia de UI/seguridad.

## 4. Diagramas de Flujo

### Flujo principal: Creación de Candidato

```
Usuario abre: http://localhost/recruitment/candidates/candidates
   └─ CanActivateFn verifica rol "Reclutamiento" → si NO → redirige a /403
   └─ SÍ → carga componente candidate-list
   ├─ ngOnInit() → store.configure('api/candidates')
   ├─ store.loadData() → GET /api/candidates
   └─ Backend valida rol → devuelve lista

Usuario hace clic en "New Candidate"
   ├─ abre DialogHandlerService.openDialog(CandidateFormComponent)
   ├─ Form: Reactive Form con validadores
   │   ├─ fullName: [Required]
   │   ├─ email: [Required, Email] ← Frontend valida
   │   ├─ cvFile: [Custom validator] ← ¿PDF solamente? ← VERIFICAR
   └─ Usuario rellena + clic Guardar
   ├─ Form.valid? 
   │   ├─ NO → Muestra errores en template
   │   └─ SÍ → Prepara FormData
   ├─ Front envía: POST /api/candidates (con file)
   └─ Backend valida:
      ├─ fullName: ¿vacío?
      ├─ email: ¿válido?
      ├─ email: ¿único? ← IMPORTANTE
      ├─ cvFile: ¿tipo correcto? (PDF solamente)
      └─ cvFile: ¿tamaño < 5MB?
   └─ Backend responde: CandidateDto (nuevo)
Usuario recibe respuesta → Dialog cierra → store.loadData() ← REFRESH (actualiza tabla) → ¿Error? → Muestra toast con mensaje
```

## 5. Entidades y Relaciones

| Entidad | PK | Soft Delete | Campos clave | Relaciones |
|---------|----|-------------|--------------|------------|
| Candidate | Guid | No | Email, FullName, Phone, CVUrl, CreatedDate | 1:N CandidateApplication |
| CandidateApplication | Guid | No | CandidateId, RequestPositionId, Stage, AppliedDate | N:1 Candidate, N:1 RequestPosition |
| CandidateWorkExperience | Guid | No | CandidateId, Company, Position, StartDate, EndDate | 1:N Candidate |
| RequestPosition | Guid | No | Title, Description, Budget | 1:N CandidateApplication |

## 6. DTOs vs Interfaces

| DTO Backend | Campos | ¿Front lo Usa? | Interface Frontend | Coinciden? |
|-------------|--------|---------------|--------------------|------------|
| CandidateDto | Id (Guid), Email (string), FullName (string), CvUrl (string?), CreatedDate (DateTime) | Sí | CandidateDto (TS) | ✅ Sí (mismos campos y tipos) |
| CandidateCreateDto | fullName, email, phone, cvFile (IFormFile) | Sí | CandidateCreateDto (TS) | ✅ Sí |

## 7. Listado de Funcionalidades por Componente

| Componente | Rol Requerido | Qué Puedo Hacer | Ubicación |
|------------|---------------|----------------|-----------|
| candidate-list | Reclutamiento | Crear, Editar, Eliminar, Ver CV, Filtrar, Paginar | /recruitment/candidates/candidates |
| candidate-application-list | Reclutamiento, Operaciones | Ver postulaciones, Cambiar Etapa, Asignar Entrevistador, Validar | /recruitment/candidates/applications |
| candidate-interview-pending | Entrevistador | Ver entrevistas pendientes, Guardar Feedback | /recruitment/interview/pending |
| candidate-detail | Reclutamiento | Ver detalle, Editar datos | /recruitment/candidates/{id} |

## 8. Recomendaciones

- Añadir [Authorize(Roles = "Admin")] en DELETE /api/candidates/{id}.
- Implementar validación de unicidad de email en backend.
- Añadir verificación de MIME type y tamaño en backend para archivos CV.
- Restringir cambios de etapa a transiciones válidas y verificar pre-requisitos.
- Ocultar botón "Eliminar" para roles sin permiso de eliminación.
- Revisar y ajustar la matriz de permisos para asegurar coherencia entre UI y backend.
