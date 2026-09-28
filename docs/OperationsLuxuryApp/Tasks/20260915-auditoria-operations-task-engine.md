# QA Gap Analysis: Operations Task Engine

**Fecha:** 2026-09-15  
**Alcance backend:** `api/LuxuryApp.Application/Modules/OperationsLuxuryApp/Task/`  
**Alcance frontend:** `appsweb/angular/src/app/modules/operations.luxuryapp/task-engine/`  
**Metodo:** auditoria estatica punta a punta, matriz de 4 niveles y stress test de estados, concurrencia, integridad y validaciones.  
**Estado:** NO APTO para cierre.

## Resumen ejecutivo

El riesgo dominante es control de acceso por recurso. La mayoria de endpoints solo valida autenticacion y los servicios consultan o mutan por GUID sin comprobar cliente objetivo autorizado, grupo, propietario o rol efectivo. El modulo permite que ciertos roles trabajen sobre multiples customers; por tanto, `customerId` enviado representa el customer objetivo en contexto y no debe rechazarse por no coincidir con un unico customer actual. Debe validarse contra el conjunto de customers autorizados para el usuario y contra el customer del grupo/tarea.

Se confirmaron ademas cambios de estado sin maquina de transiciones, mass assignment desde DTOs, carreras de duplicidad en tareas recurrentes y justificaciones, dependencias entre tareas sin validacion de grupo/ciclos, y varias llamadas frontend a rutas inexistentes.

## Hallazgos criticos

| ID | Proceso / entidad | Vulnerabilidad encontrada | Causa raiz | Evidencia | Solucion propuesta |
|---|---|---|---|---|---|
| CRIT-001 | Task / lectura y mutacion | Falta autorizacion por recurso: un rol con alcance multi-customer debe poder operar customers autorizados, pero un GUID de tarea/customer no autorizado no debe bastar. | Servicios cargan por `id` y no validan `CanAccessCustomer(customerId)` + pertenencia grupo/tarea + permiso de operacion. | `TasksEndpoints.cs:13-15,25-31,103-107`; `TaskAppService.cs:48-55,89-103,1407-1421` | Policy/service central que acepte customer objetivo dentro del alcance multi-customer del usuario y valide grupo/tarea, propiedad y accion. |
| CRIT-002 | Reporte de cliente | Endpoint anonimo permite consultar datos operativos arbitrarios y usa `IgnoreQueryFilters()`. | Riesgo aceptado explicitamente por responsable funcional para reporte publico por customer. | `TaskReportEndpoints.cs:27-31`; `TasksReportAppService.cs:136-165` | **PERMITIDO por decision del usuario.** Excluido del plan de remediacion. Mantenerlo como riesgo aceptado y no confundirlo con autorizacion de endpoints autenticados. |
| CRIT-003 | TaskFollowUp | Se puede listar, crear y borrar seguimiento de cualquier tarea; autor falsificable por DTO. | `ApplicationUserId` viene del cliente y no se valida acceso a tarea ni propiedad del seguimiento. | `TaskFollowUpAppService.cs:6-11,30-54` | Resolver usuario desde claims; validar acceso a tarea; restringir borrado por propietario/rol/estado; auditar cambios. |

## Hallazgos altos

| ID | Proceso / entidad | Vulnerabilidad encontrada | Causa raiz | Evidencia | Solucion propuesta |
|---|---|---|---|---|---|
| ALTO-001 | Maquina de estados | Se permite cualquier `GanttStatus`; reapertura no exige estado previo ni prerrequisitos. | Endpoint expuesto bajo auth general y servicio asigna estado directamente. | `TasksEndpoints.cs:72-74,106-107`; `TaskAppService.cs:1277-1303,1407-1421` | Definir transiciones permitidas y prerrequisitos en backend; devolver BusinessException clara; probar estados finales y concurrencia. |
| ALTO-002 | Tareas recurrentes | Dos workers simultaneos pueden crear la misma tarea. | Check-then-insert sin indice unico ni captura de conflicto. | `RecurringTaskGenerationService.cs:100-114`; test solo secuencial `RecurringTaskGenerationServiceTests.cs:26-31` | Indice unico `(RecurringTemplateId, PlannedEndDate)`, idempotencia/lock y manejo de `DbUpdateException`. |
| ALTO-003 | Alertas recurrentes | Alertas duplicadas bajo concurrencia y fallos que bloquean reintentos. | Lectura de log separada del envio; se marca `LastAlertAt` aunque envio falle. | `TaskAlertEngineService.cs:38-45,100-150` | Operacion idempotente con constraint unico, estado de entrega separado y reintento controlado. |
| ALTO-004 | Justificaciones | Doble solicitud simultanea puede insertar dos pendientes. | Validacion `AnyAsync` no protegida por constraint/transaccion serializable. | `TaskJustificationAppService.cs:45-62`; snapshot `...Designer.cs:11614` | Constraint unico parcial/logico por tarea y estado pendiente; capturar conflicto como BusinessException. |
| ALTO-005 | WorkGroup | Eliminacion de grupo sin revisar tareas, miembros, plantillas ni planes. | `Delete` directo sin regla de dependencias ni politica de soft delete. | `TaskGroupAppService.cs:164-170`; relaciones de `WorkGroup.cs:40-42` | Bloquear borrado con hijos activos o aplicar archivado; verificar cascadas en migracion y prueba de integridad. |
| ALTO-006 | Dependencias de tareas | Se aceptan predecesoras de otro grupo y ciclos indirectos. | Solo se bloquea `taskId == predecessorId`. | `TaskAppService.cs:1485-1495` | Validar mismo grupo, estado permitido y deteccion de ciclo antes de guardar. |
| ALTO-007 | Task DTOs | Mass assignment: cliente puede enviar `CustomerId`, creador, asignado, cierre y dependencia. | `CreateTaskDTO` hereda campos operativos de `UpdateTaskDTO`; servicio copia valores sin autoridad. | `UpdateTaskDTO.cs:9-23`; `TaskAppService.cs:779-824` | Separar DTOs de comando; derivar identidad/tenant/fechas de contexto y servidor. |
| ALTO-008 | Frontend API | Tres rutas activas no coinciden con backend y producen 404. | Constantes legacy no sincronizadas con Map endpoints. | `operations.endpoints.ts:54-56,78`; backend `TaskGroupsEndpoints.cs:18`, `TasksEndpoints.cs:55,68` | Centralizar contrato y agregar smoke tests HTTP para cada endpoint consumido. |
| ALTO-009 | Frontend reportes | Plan preview dispara endpoint de creacion mediante GET, sin esperar resultado ni manejar error. | Confusion entre endpoint `preview` y `create`; falta estado de envio. | `task-report-work-plan-preview.ts:178-205` | Usar verbo/endpoint de comando solo en accion explicita; `await`, loading, error y refresh. |
| ALTO-010 | Frontend reportes | Dialogo de envio recibe `{}`; year y week llegan `undefined`. | Los parametros no se pasan al abrir el dialogo. | `task-operation-report.ts:628-649`; `send-operation-report.ts:26-28` | Pasar `year` y `numeroSemana`; validar datos antes de construir request. |
| ALTO-011 | Frontend formularios | Doble submit posible; `FormHelper` no rechaza llamada mientras `submitting()` es true. | Estado visual no funciona como guard de reentrada. | `form-helper.ts:66-73` | Guard atomico de submit y boton disabled; test con dos invocaciones sincronas. |
| ALTO-012 | Frontend permisos | Rutas solo usan `authGuard`; no reflejan permisos funcionales. | Autorizacion queda implicitamente en UI/backend y genera accesos que terminan en 403. | `tickets.routing.ts:3-10,41-170` | Guards por permiso/rol para rutas y acciones; mantener backend como autoridad final. |

## Hallazgos medios y bajos

| ID | Hallazgo | Evidencia |
|---|---|---|
| MED-001 | Adjuntos confian en `ContentType`; no se verifica tamano, extension real ni magic bytes en capa visible. | `TaskAttachmentAppService.cs:37-47` |
| MED-002 | Prioridad frontend no coincide con backend: TS incluye `Medium/Urgent`, C# `High/Low/Critical`, con ordinales distintos. | `task-priority.enum.ts:1-6`; `PriorityLevel.cs:6-24` |
| MED-003 | Front no modela estados backend `Cancelled` y `OnHold`. | `task-message-status.enum.ts:1-5`; `GanttStatus.cs:6-42` |
| MED-004 | `task-reads/by-message` no tiene endpoint backend equivalente. | `operations.endpoints.ts:155`; `TaskMessageReadEndpoints.cs:8-16` |
| MED-005 | Mutaciones usan `GET`: progreso, relevancia y prioridad. Riesgo de cache/retry involuntario. | `task-list.ts:490-496,520-526,555-575`; `TasksEndpoints.cs:43-45,68-70,80-82` |
| MED-006 | Selector `isAdmin` usa `Validators.required`; `false` es invalido y bloquea rol Participante. | `task-group-participant.ts:65-83` |
| MED-007 | Varios listados no liberan `loading` ni manejan rechazo; UI puede quedar bloqueada. | `task-list.ts:349-362`; reportes `task-operation-report.ts:286-376` |
| MED-008 | Test imports apuntan a `tasks/services/date-range-storage.service`, ruta inexistente. | `task-date-range-selector.spec.ts:5`; `task-weekly-report-preview.spec.ts:7` |
| MED-009 | Specs reemplazan templates reales por `Mock`; no detectan bindings, a11y ni handlers rotos. | `task-operation-report.spec.ts:148-154`; `task-report-work-plan.spec.ts:115-121` |
| MED-010 | Handler `onUpdatePriority` lanza `Method not implemented` y existe en template. | `task-report-work-plan.ts:169-175`; `task-report-work-plan.html:101-112` |
| MED-011 | Interactivos no semanticos, `alt="."`, estilos inline y colores `rgba` hardcodeados violan a11y/tokens. | `task-report-work-plan.html:101-112`; `task-view.html:349-370,457-480`; `task-list.ts:118-124` |
| MED-012 | Namespaces no siguen politica path-based vigente y README documenta rutas antiguas. | `TasksEndpoints.cs:1`; `TaskRecords/README.md:13-32` |
| BAJO-001 | DTO con multiples clases publicas. | `LegalTaskListItemDTO.cs:21-33` |
| BAJO-002 | Estado singleton mutable (`year`, `numeroSemana`, status) puede contaminar reportes entre vistas. | `task.service.ts:5-40` |

## Matriz de reglas de negocio

| ID | Nivel | Regla inferida | Estado |
|---|---|---|---|
| RN-TASK-001 | 1 Invariante | Tarea debe pertenecer a customer/grupo autorizado y no puede mutarse fuera de ese alcance. Roles multi-customer pueden seleccionar cualquier customer de su alcance autorizado. | INCUMPLIDA: CRIT-001 |
| RN-TASK-002 | 1 Invariante | Una ocurrencia recurrente produce como maximo una tarea por plantilla y fecha. | INCUMPLIDA bajo concurrencia: ALTO-002 |
| RN-TASK-003 | 1 Invariante | Una tarea no debe tener mas de una justificacion pendiente. | INCUMPLIDA bajo concurrencia: ALTO-004 |
| RN-TASK-004 | 2 Flujo/estado | Transiciones de estado deben respetar estado origen, prerrequisitos y estados finales. | INCUMPLIDA: ALTO-001 |
| RN-TASK-005 | 2 Flujo/estado | Dependencias deben permanecer en mismo grupo y ser aciclicas. | INCUMPLIDA: ALTO-006 |
| RN-TASK-006 | 3 Seguridad | Autor y tenant se derivan del contexto autenticado, no del payload. | INCUMPLIDA: CRIT-003, ALTO-007 |
| RN-TASK-007 | 3 Seguridad | Reporte anonimo queda permitido por decision funcional; su riesgo se acepta fuera del alcance de remediacion. | ACEPTADA COMO EXCEPCION: CRIT-002 |
| RN-TASK-008 | 4 Validacion | Front y backend comparten valores y contratos de estado/prioridad. | INCUMPLIDA: MED-002, MED-003 |

No se encontro FASE 0 documentada para este submodulo. Las reglas anteriores son inferidas del codigo y deben validarse con responsable funcional antes de remediar.

## Matriz de permisos observada

| Operacion | Endpoint | Backend observado | Brecha |
|---|---|---|---|
| Leer tarea | `GET api/tasks/{id}` | Auth general | Sin validacion de customer objetivo autorizado/grupo |
| Crear/editar | `POST api/tasks/create`, `PUT api/tasks/update/{id}` | Auth general | Payload controla campos sensibles |
| Cambiar estado | `PATCH api/tasks/{id}/status` | Auth general | Sin rol, ownership, transicion o prerrequisito |
| Reabrir | `POST api/tasks/reopen` | Auth general | Sin estado origen ni autor de DTO |
| Seguimientos | `GET/POST/DELETE api/task-follow-up/*` | Auth general | Acceso y autor no vinculados a usuario actual |
| Reporte cliente | `GET api/task-report/get-report-client/*` | Anonymous | Permitido por decision funcional; riesgo aceptado |
| Borrar tarea | `DELETE api/tasks/{id}/{customerId}` | Admin/SuperUsuario | Falta validacion de dependencias y cliente real |
| Legal | `GET api/tasks/legal/*` | Roles legales en algunos endpoints | `legal/customer` queda solo con auth general |

## Validaciones frontend vs backend

| Campo/flujo | Frontend | Backend | Resultado |
|---|---|---|---|
| Estado | Enum parcial y filtros UI | Acepta cualquier `GanttStatus` | Desalineado y manipulable |
| Prioridad | `Low, Medium, High, Urgent` | `High, Low, Critical` | Desalineado |
| Autor | Usa IDs de auth en varias llamadas | Algunos servicios confian en DTO/path | Riesgo de suplantacion |
| Submit | Estado `submitting`, sin guard de reentrada | Endpoint procesa cada request | Duplicidad posible |
| Dependencia | Selector por grupo | Servicio no valida grupo/ciclo | Validacion espejo faltante |
| Archivos | UI limita presentacion | Validacion efectiva no demostrada en servicio | Requiere prueba de magic bytes/tamano |

## Flujo de riesgo principal

```text
Usuario autenticado
  -> GET /api/tasks/{id}
  -> servicio busca solo por GUID
  -> obtiene tarea de otro cliente
  -> PATCH /api/tasks/{id}/status
  -> servicio asigna cualquier GanttStatus
  -> persiste sin validar actor, estado previo ni prerrequisitos
```

## Orfandad, cascadas y concurrencia

- Existen relaciones hijas hacia `TaskRecord` para checklist, adjuntos, seguimientos, justificaciones y lecturas, pero no hay pruebas de borrado del padre.
- `TaskRecord` no muestra token de concurrencia (`RowVersion`/equivalente); actualizaciones simultaneas pueden perder cambios.
- Relaciones self-reference (`DependsOnTask`, `ParentTask`, `ParentRecurringTask`) requieren validacion de ciclo y grupo.
- Indices revisados para hijos son simples por `TasksId`; no prueban unicidad de reglas de negocio.

## Cobertura y verificaciones

Existe cobertura unitaria parcial para checklist, adjuntos, justificaciones y generacion recurrente secuencial. Faltan pruebas de:

- IDOR y aislamiento por tenant/cliente en cada endpoint.
- permisos por rol y recurso.
- transiciones invalidas y estados finales.
- doble submit y concurrencia real.
- constraint/unicidad de recurrentes, alertas y justificaciones.
- cascadas, restricciones y huérfanos al borrar.
- smoke tests frontend contra rutas backend reales.

El intento de suite frontend focalizada excedio 120 segundos y no produjo resultado concluyente. No se ejecuto build completo ni pruebas de integracion backend en esta auditoria.

## Plan de remediacion priorizado

| Fase | Acciones | Criterio de salida |
|---|---|---|
| Inmediata | CRIT-001..003, ALTO-001, ALTO-007 | Cada endpoint sensible rechaza cross-tenant/IDOR; reporte no expone datos anonimos; payload no controla identidad; tests negativos pasan. |
| Corto plazo | ALTO-002..006, ALTO-008..012 | Constraints y transacciones idempotentes; maquina de estados; dependencias validas; rutas front alineadas; doble submit bloqueado. |
| Medio plazo | MED-001..012, BAJO-001..002 | Contratos tipados sincronizados, a11y/tokens corregidos, tests con templates reales, namespaces/docs migrados mediante plan aprobado. |

## Decision de cierre

No aprobar remediacion parcial que solo oculte botones frontend. Backend debe ser autoridad de autorizacion, estado, identidad y unicidad. En autorizacion, `customerId` no se elimina del contrato: se valida como customer objetivo dentro del alcance multi-customer del usuario. `CRIT-002` queda expresamente permitido y fuera del plan; los demas hallazgos requieren el plan formal asociado antes de modificar shared/contratos o reubicar namespaces.
