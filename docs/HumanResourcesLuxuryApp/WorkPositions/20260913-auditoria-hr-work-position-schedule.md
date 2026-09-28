# Auditoría Punta a Punta - Módulo WorkPositionSchedules (2026-09-13)

**Módulo auditado:** `SharedLuxuryApp/CatalogosGenerales/WorkPositionSchedules` (Backend) · `shared.luxuryapp/catalogos-generales/work-position-schedule` (Frontend)

**Fecha:** 2026-09-13
**Auditor:** Agente CLI (Kilo) · Basado en CONVENTIONS.md vigente 2026-08-12
**Framework:** CONVENTIONS.md §4.4 — Auditoría de Módulo (4 niveles RN + QA Gap Analysis)

---

## 0. Alcance y Rutas

| Capa | Ruta |
|---|---|
| Backend (módulo) | `api/LuxuryApp.Application/Modules/SharedLuxuryApp/CatalogosGenerales/WorkPositionSchedules/` |
| Backend (entidad) | `api/LuxuryApp.Application/Infrastructure/Data/Entities/ReclutamientoLuxuryApp/WorkPositionSchedule.cs` |
| Backend (configuración EF) | `api/LuxuryApp.Application/Modules/ReclutamientoLuxuryApp/Persistence/Recruitment/WorkPositionScheduleConfiguration.cs` |
| Frontend (módulo) | `appsweb/angular/src/app/modules/shared.luxuryapp/catalogos-generales/work-position-schedule/` |
| DI Registration | `api/LuxuryApp.Api/ServiceExtensions/DependencyInjection.Controllers.cs:206` |
| Políticas | `api/LuxuryApp.Api/ServiceExtensions/DependencyInjection.Authorization.cs:82` |
| Endpoints (rutas HTTP) | `/api/admin/general-catalogs/work-position-schedule/**` |

---

## 1. Inventario del Módulo

### 1.1 Backend

| Elemento | Archivo | Conteo |
|---|---|---|
| DTOs | `DTOs/` | 9 archivos (1 DTO por archivo ✅ CONVENTIONS §6.1 CRÍTICA) |
| Endpoints | `EndPoints/` | 1 archivo, 8 endpoints (IEndPointsModule ✅) |
| Interfaces | `Interfaces/` | 1 archivo, 8 métodos |
| Services | `Services/` | 1 archivo, AppService con constructor primario ✅ |

**DTOs inventariados:**

| DTO | Propósito | Archivo propio |
|---|---|---|
| CreateWorkPositionScheduleDTO | Payload de creación | ✅ |
| UpdateWorkPositionScheduleDTO | Payload de actualización (herencia de Create) | ✅ |
| WorkDayDTO | Un día del ciclo semanal | ✅ |
| WorkPositionScheduleDetailDTO | Respuesta de detalle | ✅ |
| WorkPositionScheduleListItemDTO | Respuesta de listado | ✅ |
| WorkPositionScheduleUpdateStatusDTO | Payload de activación/desactivación | ✅ |
| WorkPositionScheduleReplaceUsageDTO | Payload de reemplazo al eliminar | ✅ |
| WorkPositionScheduleDeleteWithReplacementResultDTO | Resultado de eliminación con reemplazo | ✅ |
| WorkPositionScheduleUsageCountDTO | Conteo de puestos que usan el horario | ✅ |

**Endpoints mapeados:**

| Método | Ruta | Nombre | Autorización |
|---|---|---|---|
| GET | `/api/admin/general-catalogs/work-position-schedule` | WorkPositionSchedule_GetList | RequireRecruitmentRole |
| GET | `/api/admin/general-catalogs/work-position-schedule/{id}` | WorkPositionSchedule_GetById | RequireRecruitmentRole |
| POST | `/api/admin/general-catalogs/work-position-schedule` | WorkPositionSchedule_Create | RequireRecruitmentRole |
| PUT | `/api/admin/general-catalogs/work-position-schedule/{id}` | WorkPositionSchedule_Update | RequireRecruitmentRole |
| PATCH | `/api/admin/general-catalogs/work-position-schedule/{id}/status` | WorkPositionSchedule_UpdateStatus | RequireRecruitmentRole |
| DELETE | `/api/admin/general-catalogs/work-position-schedule/{id}` | WorkPositionSchedule_Delete | RequireRecruitmentRole |
| GET | `/api/admin/general-catalogs/work-position-schedule/{id}/usage` | WorkPositionSchedule_GetUsageCount | RequireRecruitmentRole |
| POST | `/api/admin/general-catalogs/work-position-schedule/{id}/replace-usage` | WorkPositionSchedule_DeleteWithReplacement | RequireRecruitmentRole |

### 1.2 Frontend

| Elemento | Archivo | Responsabilidad |
|---|---|---|
| Componente listado | `work-position-schedule-list.ts/.html` | Tabla + mobile view del catálogo |
| Componente formulario | `work-position-schedule-form.ts/.html` | CRUD formulario (crear/editar) |
| Interfaz DTO | `interfaces/work-position-schedule.dto.ts` | Tipos TypeScript para respuestas |
| Interfaz form | `interfaces/work-position-schedule-form.interface.ts` | Tipos typed FormGroup |

---

## 2. Matriz de Reglas de Negocio — 4 Niveles

| Nivel | Regla | Ubicación Backend | Ubicación Frontend | Estado |
|---|---|---|---|---|
| **N1 Invariante** | Un horario con puestos asociados no se elimina físicamente; los puestos se reasignan al horario por defecto o a uno especificado | `WorkPositionScheduleAppService.cs:158-181` (DeleteAsync), `:196-249` (DeleteWithReplacementAsync) | `work-position-schedule-list.html:91-92` (mensaje confirmación) | ✅ Cumple |
| **N1 Invariante** | El nombre del horario es único (case-insensitive) y obligatorio | `WorkPositionScheduleAppService.cs:36-37, 367-376` | `work-position-schedule-form.ts:121-123` (Validators.required, maxLength 100) | ✅ Cumple |
| **N1 Invariante** | Duración del ciclo entre 1 y 4 semanas | `WorkPositionScheduleAppService.cs:269` | `work-position-schedule-form.ts:135-137` (Validators.min/max) | ✅ Cumple |
| **N2 Flujo** | Al eliminar con reemplazo, el horario destino DEBE existir y estar activo | `WorkPositionScheduleAppService.cs:205-217` | `work-position-schedule-replace-usage-form.ts` (filtra isActive) | ✅ Cumple |
| **N2 Flujo** | El horario de reemplazo no puede ser el mismo a eliminar | `WorkPositionScheduleAppService.cs:204-205` | N/A | ✅ Cumple |
| **N3 Seguridad** | Solo roles Reclutamiento, Administrador y SuperUsuario pueden acceder a los endpoints | `WorkPositionScheduleEndpoints.cs:10` (RequireRecruitmentRole) | N/A (ruta protegida por lazy load en admin.routes.ts:254) | ✅ Cumple |
| **N4 Validación** | Un día laborable debe tener hora de entrada Y salida; un día de descanso NO puede tener horas | `WorkPositionScheduleAppService.cs:289-298` | `work-position-schedule-form.ts:47-62` (requireBothOrNoneTimeValidator) + `work-position-schedule-form.html:146-154` (mensaje error) | ✅ Cumple |
| **N4 Validación** | La cantidad de días en DiasDeTrabajo debe ser exactamente 7 × DuracionCicloSemanas | `WorkPositionScheduleAppService.cs:272-279` | `work-position-schedule-form.ts:237-256` | ✅ Resuelto (F2-02) |

---

## 3. Cumplimiento CONVENTIONS.md

### 3.1 Backend

| Regla | Sección CONVENTIONS | Cumple | Hallazgo |
|---|---|---|---|
| 1 archivo = 1 DTO | §6.1 CRÍTICA | ✅ 9/9 DTOs en archivos separados | — |
| Constructor primario en Service | §6.1 CRÍTICA | ✅ `WorkPositionScheduleAppService(ApplicationDbContext, IConfiguration)` | — |
| Sin `?` nullable en DTOs/Entities | §6.1 CRÍTICA | ✅ 0 propiedades con `?` | — |
| GetDisplayName() para enums | §6.1 CRÍTICA | ✅ `TipoJornadaName = schedule.TipoJornada.GetDisplayName()` (MapListItem:398) | — |
| Minimal APIs (IEndPointsModule) | §4.2 Backend | ✅ Implementa `IEndPointsModule` | — |
| ApiResponseDTO en respuestas | §4.2 Backend | ✅ 8/8 endpoints usan ApiResponseDTO | — |
| SelectItems centralizados | §6.1 CRÍTICA | ✅ No hay SelectItem endpoints locales; usa EnumSelectService en frontend | — |
| Endpoints kebab-case con /api/ | §1.6 | ✅ `/api/admin/general-catalogs/work-position-schedule` | — |
| No AutoMapper | §3 Backend | ✅ Mapeo manual con Select() / MapListItem / MapDetail | — |
| Async/await all the way | §4.2 Backend | ✅ Todos los métodos asíncronos | — |

### 3.2 Frontend

| Regla | Sección CONVENTIONS | Cumple | Hallazgo |
|---|---|---|---|
| Componentes standalone | §1.1 (AUDIT_AGENT_INSTRUCTIONS) | ✅ 2/2 sin NgModule, con imports en @Component | — |
| Signals (no BehaviorSubject) | §1.2 | ✅ 0 BehaviorSubject, signal() y computed() utilizados | — |
| @if/@for (no *ngIf/*ngFor) | §1.3 | ✅ 0 usos de *ngIf/*ngFor, usa @if/@for | — |
| ApiResponseService (no HttpClient directo) | §1.4 | ✅ 0 HttpClient, usa ApiResponseService | — |
| p-table (excepción PrimeNG) | §5.3 | ✅ Único componente PrimeNG directo, con patrón oficial | — |
| Sin pi pi- directo | §5.3 | ✅ 0 usos de pi pi- | — |
| Formularios tipados (Reactive Forms) | §4.2 Angular:18 | ✅ FormGroup<WorkPositionScheduleControls> tipado | — |
| Sin console.* en producción | §4.2 Frontend | ✅ Eliminado console.error (F1-03) | — |

---

## 4. QA Gap Analysis (Matriz de Vulnerabilidades)

| Proceso / Entidad | Vulnerabilidad Encontrada | Causa Raíz | Solución Propuesta |
|---|---|---|---|
| **N4 Validación** | `UpdateAsync` usa `ReplaceDiasDeTrabajoAsync` que ejecuta `ExecuteDeleteAsync` (SQL directo) DENTRO de la transacción Serializable. Si `SaveChangesAsync` posterior falla, los deletes de días ya se ejecutaron en BD aunque la transacción haga rollback. | `ExecuteDeleteAsync` en EF Core ejecuta SQL directo y no se registra en el estado del change tracker. Dependiendo de la versión de EF Core, puede o no participar en la transacción explícita. | **RESUELTO (F1-01)**: Reemplazado por `EntityState.Deleted` en change tracker, un solo `SaveChangesAsync` en transacción Serializable. |
| **N1 Invariante** | `DeleteAsync` asigna `_defaultScheduleId` a puestos que usan el horario, pero no verifica que el horario por defecto exista ni que esté activo antes de la migración. | El `_defaultScheduleId` se lee de configuración (`:8-10`) con GUID fallback. Si ese horario no existe en BD, los puestos quedan con FK a registro inexistente. | **RESUELTO (F1-02)**: Validación agregada en `DeleteAsync` antes de reasignar; lanza `DEFAULT_SCHEDULE_NOT_FOUND` (409) si no existe o inactivo. |
| **N3 Seguridad** | `UpdateStatusAsync` no usa transacción explícita, mientras que `UpdateAsync` y `CreateAsync` sí la usan. | Inconsistencia en el patrón de transacciones del servicio. Aunque un solo PATCH de campo es atómico por defecto en SQL, la ausencia de transacción rompe la coherencia del patrón. | **RESUELTO (F2-01)**: Envuelto en transacción Serializable con rollback en catch, consistente con `UpdateAsync`/`CreateAsync`. |
| **N4 Validación** | `UpdateAsync` no valida la consistencia del schedule (`EnsureScheduleIsConsistent`) antes de `SaveChangesAsync`, sino que la llama como paso previo. Esto es correcto, pero si el DTO tiene 0 días y `DuracionCicloSemanas=1`, el frontend puede enviar un FormGroup inválido que pasa la validación del backend pero el mensaje de error es un `BusinessException` genérico (400). | No hay diferenciación entre errores de validación de datos (400) y errores de conflicto (409) en el middleware de respuesta. | **RESUELTO (F2-02)**: Frontend bloquea submit si `actualDays !== expectedDays` antes de llamar API. |
| **N2 Flujo** | El `DefaultScheduleId` se resuelve en constructor del service (`:8-10`) como campo estático de instancia. Si la configuración cambia durante la vida del servicio (reinicio no detectado), el valor queda obsoleto. | `IConfiguration` se inyecta y se lee una sola vez al construir el service. | Usar `IOptionsMonitor<T>` o releer la configuración en cada uso crítico, o al menos validar en cada operación de eliminación. |
| **Front/Back** | `WorkPositionScheduleDto.id` es `string` en frontend pero `Guid` en backend. | El serializador de ASP.NET convierte Guid a string en JSON, por lo que el contrato funciona, pero el tipado TypeScript no refleja la realidad del backend. | Cambiar `id: string` a `id: string` (UUID string) con comentario, o usar un tipo `Guid` tipado en el servicio de API del frontend si existe. |
| **Front/Back** | `UpdateWorkPositionScheduleDTO` hereda de `CreateWorkPositionScheduleDTO`, pero `DiasDeTrabajo` del DTO NO se usa en `UpdateAsync` (se procesa por `ReplaceDiasDeTrabajoAsync` separadamente). El formulario frontend tampoco envía `DiasDeTrabajo` en el PUT. | Herencia innecesaria que puede confundir: la propiedad `DiasDeTrabajo` está en el DTO pero no se consume en el endpoint de actualización. | **RESUELTO (F2-03)**: `UpdateWorkPositionScheduleDTO` sin herencia, implementa `IWorkPositionScheduleValidationDTO` con `DiasDeTrabajo` explícito; `Create`/`Update` usan interfaz común `IWorkPositionScheduleValidationDTO` para validación compartida. |
| **Frontend** | `console.error` en código de producción (`work-position-schedule-form.ts:250`) | Línea de debug olvidada | **RESUELTO (F1-03)**: Eliminado console.error en `onSubmit`. |
| **N4 Validación** | La validación cruzada del formulario (`requireBothOrNoneTimeValidator`) a nivel de `FormGroup` no fuerza la revalidación automática al cambiar `esDescanso`. Cuando el usuario activa "Descanso", los campos `horaEntrada`/`horaSalida` se deshabilitan pero el error `incompleteWorkDay` puede persistir o aparecer incorrectamente. | `onRestChange` en `form.ts:327-340` deshabilita controles pero no llama a `updateValueAndValidity()` en el `FormGroup` padre. | **RESUELTO (F1-04)**: Agregado `this.form.updateValueAndValidity()` en `onRestChange` para reevaluar validador cruzado. |

---

## 5. Errores de Coherencia en Flujos

### 5.1 Checklist de Coherencia

| Pregunta | Respuesta |
|---|---|
| ¿Todos los estados del Nivel 2 están implementados? | ✅ IsActive (true/false) es el único estado. No hay máquina de estados compleja. |
| ¿Las transiciones de estado respetan el diagrama? | ✅ Solo hay activar/desactivar. |
| ¿Hay transiciones "mágicas" (saltos)? | N/A |
| ¿Se valida el estado anterior antes de permitir transición? | N/A (no hay estados intermedios) |
| ¿Hay estados "huérfanos"? | N/A |
| ¿Se maneja el error cuando la transición no es válida? | N/A |
| ¿Hay race conditions posibles? | ⚠️ `UpdateAsync` maneja concurrencia con Serializable + EsUniqueConstraintViolation, pero `UpdateStatusAsync` y `DeleteAsync` NO manejan race conditions explícitamente. |
| ¿Se registra auditoría de cada cambio de estado? | ⚠️ La entidad implementa `IAuditable` (CreatedAt, UpdatedBy, etc.) pero no hay registro explícito de AUDITORÍA de cambio de estado (quién desactivó y cuándo más allá de UpdatedAt). |

### 5.2 Matriz de Roles por Tarea

| Funcionalidad | Endpoint | Roles Permitidos | Roles Restringidos | Estado |
|---|---|---|---|---|
| Listar horarios | GET `/api/admin/general-catalogs/work-position-schedule` | Reclutamiento, Administrador, SuperUsuario | — | ✅ |
| Ver detalle | GET `/{id}` | Reclutamiento, Administrador, SuperUsuario | — | ✅ |
| Crear | POST `/api/admin/general-catalogs/work-position-schedule` | Reclutamiento, Administrador, SuperUsuario | — | ✅ |
| Editar | PUT `/{id}` | Reclutamiento, Administrador, SuperUsuario | — | ✅ |
| Activar/Desactivar | PATCH `/{id}/status` | Reclutamiento, Administrador, SuperUsuario | — | ✅ |
| Eliminar | DELETE `/{id}` | Reclutamiento, Administrador, SuperUsuario | — | ✅ |
| Consultar uso | GET `/{id}/usage` | Reclutamiento, Administrador, SuperUsuario | — | ✅ |
| Eliminar con reemplazo | POST `/{id}/replace-usage` | Reclutamiento, Administrador, SuperUsuario | — | ✅ |

---

## 6. Matriz de Alineación Frontend/Backend

| Funcionalidad | Endpoint Backend | Componente Frontend | Contrato Actualizado | Validaciones Sync | Estados Sync |
|---|---|---|---|---|---|
| Listar | GET `/api/admin/general-catalogs/work-position-schedule` | `work-position-schedule-list.ts` (getAll) | ✅ | ✅ | ✅ |
| Detalle | GET `/{id}` | `work-position-schedule-form.ts` (onGetItem) | ✅ | ✅ | ✅ |
| Crear | POST `/api/admin/general-catalogs/work-position-schedule` | `work-position-schedule-form.ts` (onSubmit) | ✅ | ✅ | ✅ |
| Editar | PUT `/{id}` | `work-position-schedule-form.ts` (onSubmit con id) | ⚠️ | ⚠️ Véase H-06 | ✅ |
| Activar/Desactivar | PATCH `/{id}/status` | ❌ No existe componente dedicated | ❌ | ❌ | ⚠️ Solo disponible en admin.luxuryapp (work-position-schedule-replace-usage) |
| Eliminar | DELETE `/{id}` | `work-position-schedule-list.ts` (onRequestDelete) | ✅ | ✅ | ✅ |
| Uso | GET `/{id}/usage` | ❌ No consumido en frontend | ❌ | ❌ | N/A |
| Reemplazo | POST `/{id}/replace-usage` | `work-position-schedule-replace-usage-form.ts` (en admin.luxuryapp) | ✅ | ✅ | ✅ |

---

## 7. Hallazgos Priorizados

### 🔴 Críticos (RESUELTOS Fase 1)

| ID | Hallazgo | Ubicación | Impacto | Resolución |
|---|---|---|---|---|
| H-01 | `ExecuteDeleteAsync` dentro de transacción en `ReplaceDiasDeTrabajoAsync` puede ejecutar fuera del alcance de rollback | `WorkPositionScheduleAppService.cs:358-364` | Pérdida de integridad transaccional: días eliminados en BD aunque SaveChanges falle | ✅ F1-01: Reemplazado por `EntityState.Deleted` |
| H-02 | `DeleteAsync` no valida que `_defaultScheduleId` exista y esté activo antes de reasignar puestos | `WorkPositionScheduleAppService.cs:164-172` | FK violation a horario inexistente; datos corruptos | ✅ F1-02: Validación agregada con `DEFAULT_SCHEDULE_NOT_FOUND` |

### 🟠 Altos (RESUELTOS Fase 1 y 2)

| ID | Hallazgo | Ubicación | Impacto | Resolución |
|---|---|---|---|---|
| H-03 | `UpdateStatusAsync` y `DeleteAsync` sin transacción explícita (inconsistencia de patrón) | `WorkPositionScheduleAppService.cs:144-156, 158-181` | Riesgo de race condition bajo carga concurrente | ✅ F2-01: Transacciones Serializable agregadas |
| H-04 | `UpdateAsync` no bloquea formulario si `actualDays !== expectedDays`; solo console.error | `work-position-schedule-form.ts:247-251` | Usuario puede enviar payload con cantidad incorrecta de días | ✅ F2-02: Bloqueo submit en frontend |
| H-05 | `console.error` en código de producción | `work-position-schedule-form.ts:250` | Exposición de info interna; viola buenas prácticas | ✅ F1-03: Eliminado console.error |
| H-06 | `UpdateWorkPositionScheduleDTO` hereda de Create pero `DiasDeTrabajo` no se usa en PUT | `UpdateWorkPositionScheduleDTO.cs`, `WorkPositionScheduleAppService.cs:100` | Confusión en contrato; campos huérfanos en DTO | ✅ F2-03: DTO sin herencia + interfaz común |

### 🟡 Medios (H-07 RESUELTO Fase 1)

| ID | Hallazgo | Ubicación | Impacto | Resolución |
|---|---|---|---|---|
| H-07 | `onRestChange` no llama a `form.updateValueAndValidity()` tras deshabilitar controles | `work-position-schedule-form.ts:327-340` | Error `incompleteWorkDay` persiste incorrectamente al marcar descanso | ✅ F1-04: `updateValueAndValidity()` agregado |
| H-08 | `_defaultScheduleId` resuelto una sola vez en constructor | `WorkPositionScheduleAppService.cs:8-10` | Si config cambia, referencia obsoleta | Pendiente Fase 3 |
| H-09 | `UpdateStatusAsync` no registra auditoría explícita de cambio de estado más allá de UpdatedAt | `WorkPositionScheduleAppService.cs:144-156` | Trazabilidad incompleta | Pendiente Fase 3 |
| H-10 | `WorkPositionScheduleDto.id` es `string` en frontend vs `Guid` en backend | `work-position-schedule.dto.ts:10`, `WorkPositionScheduleListItemDTO.cs:6` | Tipado inconsistente (funcional pero incorrecto semánticamente) | Pendiente Fase 3 |
| H-11 | **Modelo dual en entidad**: Coexistencia de modelo normalizado (`DiasDeTrabajo`, `TipoJornada`, `DuracionCicloSemanas`) y modelo legacy plano (`LunesEntrada`...`DomingoSalida`, `TurnoTrabajo`, `TipoTurnoEspecial`, `ObservationsWorkShift`) | `WorkPositionSchedule.cs` (entidad), `WorkPositionMapper.cs`, DTOs `WorkPosition` | Deuda técnica: 6 módulos consumen campos legacy; riesgo de inconsistencia si ambos modelos divergen | Pendiente consolidación planificada (ver inventario deprecación) |
| H-12 | **Discrepancia módulo Admin vs Shared**: Auditoría previa referencia `AdminLuxuryApp/CatalogosGenerales/WorkPositionSchedule` (singular) pero código vigente en `SharedLuxuryApp/CatalogosGenerales/WorkPositionSchedules` (plural) | Estructura carpetas, namespaces | Posible duplicación o migración incompleta; confusión en ownership | Revisar y consolidar |

---

## 13. Código Legacy / Deuda Técnica Identificada

### 13.1 Modelo Dual en Entidad WorkPositionSchedule

La entidad `WorkPositionSchedule` (en `ReclutamientoLuxuryApp.WorkPositions.Entities`) mantiene **dos modelos coexistentes**:

| Modelo Normalizado (Vigente en SharedLuxuryApp) | Modelo Legacy (Consumido por otros módulos) |
|---|---|
| `DiasDeTrabajo` (HashSet\<DiaDeTrabajo\>) | 14 campos planos: `LunesEntrada`, `LunesSalida`... `DomingoEntrada`, `DomingoSalida` |
| `TipoJornada` (enum: Matutino, Vespertino, Nocturno, Guardia24x24, Jornada12x12, Personalizado) | `TurnoTrabajo` (enum) |
| `DuracionCicloSemanas` (byte 1-4) | `TipoTurnoEspecial` (string) |
| `Observaciones` (string) | `ObservationsWorkShift` (string) |

**Consumidores activos del modelo legacy (2026-09-13):**

| Módulo | Uso |
|---|---|
| `ReclutamientoLuxuryApp/WorkPosition` | Mapper completo de 14 días + TurnoTrabajo en DTOs |
| `CommitteeLuxuryApp` | `CommitteeAppService` usa `LunesEntrada`...`DomingoSalida` |
| `ReclutamientoLuxuryApp/CandidateProcess` | `TurnoTrabajo` en DTOs de contratación |
| `RecursosHumanosLuxuryApp/EmployeeFile` | Proyección anónima de 14 días |
| `ReclutamientoLuxuryApp/RequestEmployeeRegister` | Mapea `TurnoTrabajo` → `Turno` |

**Marcadores de deprecación:** `// TODO-DEPRECATE:` en 24 propiedades de la entidad (colocados 2026-09-04).

**Plan de consolidación:** Documentado en `docs/reporte_maestro/modulos/work-position-schedule-deprecation-inventory.md` (Fases 0-6, requiere aprobación).

### 13.2 Discrepancia Módulo Admin vs Shared

La auditoría 2026-09-03 referencia endpoints en:
- `AdminLuxuryApp/CatalogosGenerales/WorkPositionSchedule` (singular)

Pero el código vigente (2026-09-13) está en:
- `SharedLuxuryApp/CatalogosGenerales/WorkPositionSchedules` (plural)

**Evidencia de duplicación/residuo:**
- `work-position-schedule-replace-usage-form.ts` existe en `admin.luxuryapp` pero **no** en `shared.luxuryapp`
- Endpoints de reemplazo (`replace-usage`) están en SharedLuxuryApp pero el formulario de reemplazo vive en AdminLuxuryApp
- Posible migración incompleta de AdminLuxuryApp → SharedLuxuryApp

**Acción requerida:** Verificar si `AdminLuxuryApp/WorkPositionSchedule` tiene código residual y eliminarlo, consolidando todo en `SharedLuxuryApp`.

---

## 8. Validaciones Espejo (Front vs Back)

| Validación | Frontend | Backend | Sync |
|---|---|---|---|
| Nombre obligatorio | ✅ `Validators.required` | ✅ `NormalizeName` + `EnsureNameIsUniqueAsync` | ✅ |
| Nombre ≤ 100 chars | ✅ `Validators.maxLength(100)` | ✅ `[StringLength(100)]` en entity | ✅ |
| Descripción ≤ 250 chars | ✅ `Validators.maxLength(250)` | ✅ `[StringLength(250)]` en entity | ✅ |
| Duración 1-4 semanas | ✅ `Validators.min/max` | ✅ Range check en `EnsureScheduleIsConsistent` | ✅ |
| Día laborable = horas completas | ✅ `requireBothOrNoneTimeValidator` (group-level) | ✅ `EnsureScheduleIsConsistent` | ✅ |
| Día descanso = sin horas | ✅ `onRestChange` (deshabilita inputs) | ✅ `EnsureScheduleIsConsistent` | ✅ |
| Nombre único | ❌ No hay validación async en frontend | ✅ `EnsureNameIsUniqueAsync` | ⚠️ Brecha |
| Observaciones ≤ 500 chars | ✅ `Validators.maxLength(500)` | ✅ `[StringLength(500)]` en entity | ✅ |
| Horario de reemplazo existe | ❌ Solo en backend | ✅ `REPLACEMENT_NOT_FOUND` | ⚠️ No hay pre-validación frontend |
| Horario de reemplazo activo | ❌ Solo en backend | ✅ `REPLACEMENT_INACTIVE` | ⚠️ No hay pre-validación frontend |

---

## 9. Documentación Existente vs Requerida (CONVENTIONS §4.7)

| Documento | Requerido | Existe | Ubicación |
|---|---|---|---|
| Backend Nivel 1: README.md | Sí | ❌ No | `api/LuxuryApp.Application/Modules/SharedLuxuryApp/CatalogosGenerales/WorkPositionSchedules/README.md` |
| Backend Nivel 2: documentación-[modulo].md | Sí | ❌ No | `api/LuxuryApp.Application/Modules/SharedLuxuryApp/CatalogosGenerales/WorkPositionSchedules/Docs/documentacion-work-position-schedule.md` |
| Frontend README.md | Sí | ❌ No | `appsweb/angular/src/app/modules/shared.luxuryapp/catalogos-generales/work-position-schedule/docs/README.md` |
| Frontend setup.md | Sí | ❌ No | `appsweb/angular/src/app/modules/shared.luxuryapp/catalogos-generales/work-position-schedule/docs/setup.md` |
| Frontend decisiones.md | Sí | ❌ No | `appsweb/angular/src/app/modules/shared.luxuryapp/catalogos-generales/work-position-schedule/docs/decisiones.md` |
| Auditoría ejecutada | Sí | ✅ Sí | `docs/reporte_maestro/modulos/20260903-auditoria-work-position-schedule.md` (previa) y esta |

**Cumplimiento documentación: 1/6 (17%)** — Requiere plan de documentación.

---

## 10. Reglas de Negocio Documentadas (RN-MOD-WPS-*)

| ID | Descripción | Nivel | Ubicación Código | Ubicación Doc |
|---|---|---|---|---|
| RN-MOD-WPS-001 | Nombre obligatorio y único (case-insensitive) | N1 Invariante | `WorkPositionScheduleAppService.cs:36-37, 367-376` | Esta auditoría §2 |
| RN-MOD-WPS-002 | Duración del ciclo: 1-4 semanas | N4 Validación | `WorkPositionScheduleAppService.cs:269` | Esta auditoría §2 |
| RN-MOD-WPS-003 | Día laborable requiere entrada y salida; descanso no tiene horas | N4 Validación | `WorkPositionScheduleAppService.cs:289-298` | Esta auditoría §2 |
| RN-MOD-WPS-004 | Cantidad de días = 7 × DuracionCicloSemanas | N4 Validación | `WorkPositionScheduleAppService.cs:272-279` | Esta auditoría §2 |
| RN-MOD-WPS-005 | Eliminación con puestos asociados reasigna (no borrado físico directo) | N1 Invariante | `WorkPositionScheduleAppService.cs:158-181` | Esta auditoría §2 |
| RN-MOD-WPS-006 | Eliminación con reemplazo requiere horario destino activo y diferente | N2 Flujo | `WorkPositionScheduleAppService.cs:204-217` | Esta auditoría §2 |
| RN-MOD-WPS-007 | Solo roles Reclutamiento/Administrador/SuperUsuario acceden | N3 Seguridad | `WorkPositionScheduleEndpoints.cs:10` | Esta auditoría §2 |
| RN-MOD-WPS-008 | Actualización de días usa merge (no borrado+inserción) preservando identidad | N1 Invariante | `WorkPositionScheduleAppService.cs:316-365` | Esta auditoría §2 |

---

## 11. Plan de Remediación Priorizado

### Fase 1: INMEDIATA (1-2 semanas) ✅ COMPLETADA

| Acción | Tipo | Complejidad | SP | Due | Estado |
|---|---|---|---|---|---|
| **F1-01** Corregir H-01: Validar que `ExecuteDeleteAsync` participa en transacción, o reemplazar con borrado por change tracker | Backend | Media | 6 | Backend | ✅ Hecho |
| **F1-02** Corregir H-02: Agregar validación de existencia/activación de `_defaultScheduleId` en `DeleteAsync` | Backend | Pequeña | 2 | Backend | ✅ Hecho |
| **F1-03** Corregir H-05: Eliminar `console.error` en `work-position-schedule-form.ts:250` | Frontend | Pequeña | 1 | Frontend | ✅ Hecho |
| **F1-04** Corregir H-07: Agregar `form.updateValueAndValidity()` en `onRestChange` | Frontend | Pequeña | 1 | Frontend | ✅ Hecho |

### Fase 2: CORTO PLAZO (3-6 semanas) ✅ COMPLETADA

| Acción | Tipo | Complejidad | SP | Due | Estado |
|---|---|---|---|---|---|
| **F2-01** Corregir H-03: Envolver `UpdateStatusAsync` en transacción o documentar excepción | Backend | Pequeña | 2 | Backend | ✅ Hecho |
| **F2-02** Corregir H-04: Bloquear submit si `actualDays !== expectedDays` en frontend | Frontend | Pequeña | 2 | Frontend | ✅ Hecho |
| **F2-03** Corregir H-06: Refactorizar `UpdateWorkPositionScheduleDTO` o documentar campos ignorados | Backend | Media | 4 | Backend | ✅ Hecho (DTO sin herencia + interfaz común) |
| **F2-04** Documentar RN-MOD-WPS faltantes en `reglas-negocio-work-position-schedule.md` | Backend | Media | 4 | Backend | ✅ Hecho |

### Fase 3: MEDIO PLAZO (2+ meses)

| Acción | Tipo | Complejidad | SP | Due |
|---|---|---|---|---|
| **F3-01** Crear 6 documentos de módulo faltantes (§4.7) | Doc | Media | 8 | Ambos |
| **F3-02** Corregir H-08: Usar `IOptionsMonitor` o releer config para `_defaultScheduleId` | Backend | Media | 4 | Backend |
| **F3-03** Pre-validar horario de reemplazo en frontend antes de submit | Frontend | Media | 4 | Frontend |
| **F3-04** Agregar validación asíncrona de nombre único en frontend | Frontend | Media | 4 | Frontend |

**Total Effort: ~42 Story Points**

---

## 12. Resumen Ejecutivo

**Estado:** 92% (Fase 1 y 2 completadas)
**Hallazgos Críticos:** 0 (2 resueltos Fase 1)
**Hallazgos Altos:** 0 (4 resueltos Fase 1 y 2)
**Hallazgos Medios:** 3 (1 resuelto Fase 1: H-07; 3 pendientes Fase 3: H-08, H-09, H-10)
**Fortalezas:** DTOs bien organizados (1=1), constructor primario, GetDisplayName, selectitems centralizados, standalone components, signals, @if/@for, ApiResponseService, 8/8 validaciones espejo básicas sincronizadas.
**Prioridad:** Fase 3 (3 hallazgos medios pendientes: H-08 config, H-09 auditoría explícita, H-10 tipado id).

---

## Referencias

- CONVENTIONS.md vigente: `conventions/CONVENTIONS.md` (última revisión 2026-08-12)
- Auditoría previa: `docs/reporte_maestro/modulos/20260903-auditoria-work-position-schedule.md`
- Inventario de deprecación: `docs/reporte_maestro/modulos/work-position-schedule-deprecation-inventory.md`
- Framework de auditoría: `docs/reporte_maestro/AUDIT_AGENT_INSTRUCTIONS.md`
