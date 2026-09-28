# QA Gap Analysis: HumanResourcesLuxuryApp / Evaluation

Fecha: 2026-09-22
Alcance:

- Backend: `api/LuxuryApp.Application/Modules/HumanResourcesLuxuryApp/Evaluation/`
- Frontend: `appsweb/angular/src/app/modules/human-resources.luxuryapp/evaluation/`
- Consumidores, contratos, rutas, DI, persistencia y configuracion fuera de esas carpetas.

Metodo: inspeccion estatica punta a punta. No se ejecutaron pruebas ni se modifico codigo. Hallazgos deben remediarse solo despues de aprobacion explicita.

## Resultado Ejecutivo

El modulo no esta aislado. Tiene consumidores funcionales fuera de las carpetas objetivo y duplicacion de rutas/endpoints de acceso.

Riesgos principales:

1. Autorizacion insuficientemente especifica: endpoints solo exigen usuario autenticado.
2. Creacion permite que cliente determine `EvaluatorId`, plantilla, empleado y respuestas sin validar coherencia de tenant o pertenencia.
3. Evaluaciones completadas pueden actualizarse o eliminarse sin bloqueo de estado.
4. Pantalla de historial existe en rutas, pero componente no consume ningun endpoint.
5. Se exponen dos superficies backend para el mismo servicio y dos arboles de rutas frontend.

## Consumidores Fuera Del Alcance Fisico

| Consumidor | Evidencia | Tipo |
|---|---|---|
| Endpoint alterno de Reclutamiento | `api/LuxuryApp.Application/Modules/RecruitmentLuxuryApp/EndPoints/OperationRecruitmentPerformanceEvaluationsEndPoints.cs:15-67` | Expone create, update, result, history y delete usando `IPerformanceEvaluationAppService`. |
| Expediente de empleado backend | `api/LuxuryApp.Application/Modules/RecruitmentLuxuryApp/EmployeeFile/Services/EmployeeFileAppService.cs:927-977` | Lee `EvaluationStaffs`, plantilla, evaluador y resultados. |
| Endpoint de expediente | `api/LuxuryApp.Application/Modules/RecruitmentLuxuryApp/EmployeeFile/EndPoints/EmployeeFileEndPoints.cs:85-89` | Expone `GET api/hr/employee-files/{employeeId}/evaluations`. |
| Expediente de empleado frontend | `appsweb/angular/src/app/modules/recruitment.luxuryapp/employee-file/human-resources/employee-registry/employee-file-detail.ts:250-258` | Consume historial/resumen de evaluaciones. |
| Renovacion de contratos | `api/LuxuryApp.Application/Modules/LegalLuxuryApp/EmployeeContracts/Services/ContractRenewalAppService.cs:103-123,166-197` | Valida estado y enlaza `PerformanceEvaluationId`. |
| Eliminacion de clientes | `api/LuxuryApp.Application/Modules/AdminLuxuryApp/Customers/Customers/Services/CustomerAppService.cs:521-545,775-785` | Elimina evaluaciones, categorias y plantillas por tenant. |
| SelectItems compartido | `api/LuxuryApp.Application/Modules/SharedLuxuryApp/SelectItem/Services/SelectItemAppService.cs:923-925`; endpoint en `.../SelectItemEndPoints.cs:60` | Alimenta selector de plantillas. |
| Frontend SelectItems | `appsweb/angular/src/app/modules/human-resources.luxuryapp/evaluation/evaluation-template/performance-evaluation/realizar-evaluacion.ts:162-176` | Consume plantillas desde hub compartido. |
| DI y contratos de compilacion | `api/LuxuryApp.Api/ServiceExtensions/DependencyInjection.Controllers.cs:393,490`; `api/LuxuryApp.Api/GlobalUsings.cs:394-403`; `api/LuxuryApp.Tests/GlobalUsings.cs:207-217` | Registro y consumo transversal. |
| Rutas Angular duplicadas | `appsweb/angular/src/app/routing/employee-evaluation.routing.ts:3-106`; `appsweb/angular/src/app/modules/human-resources.luxuryapp/human-resources.routes.ts:401-494` | Mismas pantallas bajo `/employee-evaluation/*` y `/recursos-humanos/evaluation/*`. |
| Lista blanca frontend | `appsweb/angular/src/app/routing/route-whitelist.ts:268-275` | Mantiene rutas legacy `/employee-evaluation/*`. |

## Matriz De Hallazgos

| ID | Severidad | Proceso / Entidad | Vulnerabilidad encontrada | Causa raiz | Solucion propuesta |
|---|---|---|---|---|---|
| EVAL-001 | Critica | Todos los endpoints | `RequireAuthorization()` no restringe roles ni politica especifica. Cualquier usuario autenticado alcanza CRUD, lectura, borrado e historial. | `PerformanceEvaluationsEndPoints` y `TemplateEvaluationEndPoints` solo aplican autenticacion general (`PerformanceEvaluationsEndPoints.cs:15-19`; `TemplateEvaluationEndPoints.cs:19-23`). | Definir matriz endpoint-rol y aplicar politicas/roles en backend. Mantener guards frontend solo como UX, nunca como control de seguridad. |
| EVAL-002 | Critica | Crear evaluacion / tenant | El cliente controla `EvaluatorId`, `EvaluatedId`, `EvaluationTemplateId` y respuestas. El servicio solo comprueba que exista el empleado y luego persiste (`PerformanceEvaluationAppService.cs:481-539`). No valida plantilla activa, pertenencia del empleado al mismo cliente, pertenencia de preguntas a plantilla ni que el evaluador sea el usuario actual. | DTO acepta identificadores externos y `CreateAsync` mapea directamente (`CreatePerformanceEvaluationDTO.cs:9-27`; `PerformanceEvaluationMappingProfile.cs:35`). | Derivar evaluador del contexto actual; validar cadena tenant empleado-plantilla-preguntas; rechazar IDs cruzados y plantillas inactivas; validar respuestas completas y unicas. |
| EVAL-003 | Alta | Actualizar evaluacion | Se puede modificar una evaluacion `Completed`; no existe comprobacion de estado antes de actualizar. Ademas, respuestas enviadas con pregunta inexistente se ignoran silenciosamente (`PerformanceEvaluationAppService.cs:329-415`). | Ausencia de maquina de estados y validacion de conjunto esperado. | Bloquear actualizacion de estados finales; validar que el conjunto recibido coincida con preguntas activas; devolver error explicito ante respuestas faltantes, duplicadas o ajenas. |
| EVAL-004 | Alta | Borrar evaluacion | `DELETE` permite borrado fisico sin comprobar estado, actor, tenant explicito ni dependencias externas. Renovacion de contratos guarda `PerformanceEvaluationId` (`ContractRenewalAppService.cs:166-197`). | Endpoint publica delete a cualquier autenticado y servicio elimina entidad/respuestas (`PerformanceEvaluationAppService.cs:437-477`). | Prohibir borrado de evaluaciones referenciadas o finalizadas; usar soft delete/auditoria o proceso administrativo controlado; verificar dependencias antes de eliminar. |
| EVAL-005 | Alta | Crear/editar plantilla | `CustomerId` llega desde cliente y los endpoints no muestran autorizacion de tenant/rol. La entidad es `ITenantEntity`, pero el contexto inspeccionado aplica filtro global de soft-delete, no se observo aqui un filtro tenant global (`ApplicationDbContext.cs:3223-3250`). | Confianza en `CustomerId` del DTO (`CreateEvaluationTemplateDTO.cs:19-23`) y consultas por ID entregado (`TemplateEvaluationAppService.cs:13-29`). | Obtener tenant del contexto, ignorar/rechazar `CustomerId` arbitrario y verificar acceso al cliente en cada operacion. Confirmar politica tenant del runtime con prueba de integracion. |
| EVAL-006 | Alta | Actualizar plantilla | `SyncCategories` usa nombre como clave (`Dictionary<string, Guid>`). Dos categorias con mismo nombre colisionan y pueden asociar preguntas a categoria incorrecta; IDs de otra plantilla se ignoran sin error (`TemplateEvaluationAppService.cs:221-323,327-421`). | Identidad de sincronizacion basada en nombre y validacion de pertenencia inexistente. | Sincronizar por ID dentro de la plantilla; validar IDs de categoria/pregunta, nombres repetidos y devolver errores de dominio. |
| EVAL-007 | Alta | Borrar plantilla / integridad referencial | El borrado fisico elimina preguntas, categorias y plantilla, pero no carga/elimina evaluaciones asociadas (`TemplateEvaluationAppService.cs:83-135`). Puede fallar por FK o romper historial segun cascadas configuradas. | El metodo no protege historial ni verifica referencias. | Impedir borrar plantilla usada; desactivar/versionar plantilla. Si existe borrado administrativo, eliminar dependencias en orden y con prueba FK/cascade. |
| EVAL-008 | Alta | Historial por empleado | Ruta Angular esta publicada, pero `HistorialEvaluacion` es componente vacio y no llama `historyByEmployee` (`historial-evaluacion.ts:1-9`). | Pantalla/ruta creada sin implementar flujo de datos. | Implementar carga, estados loading/error/empty y render del DTO; agregar prueba de ruta y contrato. |
| EVAL-009 | Media | Superficie de API | El mismo servicio se expone en `/api/performance-evaluations/*` y `/api/operation/recruitment/performance-evaluations/*`, con operaciones duplicadas. Front solo usa principalmente la primera; constants alternas mantienen endpoint de historial. | Endpoint de modulo duplicado fuera de `Evaluation`. | Declarar una superficie canonica, migrar consumidores y retirar la otra tras observabilidad/pruebas de compatibilidad. |
| EVAL-010 | Media | Rutas frontend | Las mismas pantallas estan registradas en `employee-evaluation.routing.ts` y `human-resources.routes.ts`; whitelist conserva rutas legacy. Esto duplica navegacion y puede producir permisos/menu/telemetria divergentes. | Dos owners de routing para un solo feature. | Elegir owner unico, migrar enlaces y eliminar whitelist/rutas legacy cuando no existan consumidores. |
| EVAL-011 | Media | Validacion de puntajes | `UpdateEvaluationAnswerDTO` no tiene `[Range(1,5)]`; el servicio asigna `Score` directamente. La entidad tiene `[Range]`, pero no debe asumirse validacion automatica de entidades en este flujo (`UpdateEvaluationAnswerDTO.cs:9-23`; `PerformanceEvaluationAppService.cs:363-377`). | Validacion espejo incompleta y dependencia implicitamente optimista del ORM. | Validar rango en DTO/validator y repetir regla en servicio antes de persistir; probar valores 0, 6 y negativos. |
| EVAL-012 | Media | Consistencia de contratos | `EvaluationTemplateId` del DTO de creacion es `string`, mientras entidad usa `Guid`; `EvaluatedId` se documenta como ApplicationUser pero se consulta como Employee ID (`CreatePerformanceEvaluationDTO.cs:15-19`; `PerformanceEvaluationAppService.cs:485-510`). | Naming y tipos no representan el contrato real. | Cambiar contrato a `Guid` y nombres semanticos (`EmployeeId`, `TemplateId`) mediante migracion coordinada; agregar pruebas de serializacion. |
| EVAL-013 | Alta | Regla de negocio RN-PERFEVAL-004 | La documentacion del modulo establece que el evaluador se asigna automaticamente desde usuario actual (`reglas-negocio-rrhh-hr.md:1650-1662`), pero create conserva `EvaluatorId` recibido del cliente; solo update lo sobrescribe (`PerformanceEvaluationAppService.cs:351-354,481-510`). | Regla aprobada no reflejada en todo el flujo. | Aplicar asignacion automatica tambien en create y actualizar documentacion/contratos si la regla cambia. |

## Casos De Stress

| Caso | Resultado observado |
|---|---|
| Doble submit de crear | No se observa idempotency key ni indice unico funcional para evitar evaluaciones duplicadas. Debe probarse con dos POST concurrentes. |
| Evaluacion completada + PUT | Permitido por ausencia de validacion de `Status`. |
| Evaluacion completada + DELETE | Permitido por endpoint/servicio; riesgo mayor por referencias en contratos y expedientes. |
| Pregunta de otra plantilla | No se valida en create; puede guardarse respuesta cruzada. |
| Empleado de otro tenant | No se valida explicitamente en create; riesgo depende de controles globales no visibles en este flujo. |
| Categoria duplicada | Colisiona `categoryMap[DTOCat.Name]`; ultima entrada sobrescribe la anterior. |
| Historial frontend | Ruta funciona, componente no tiene consumidor API ni UI de datos. |

## Veredicto

Auditoria punta a punta: **no conforme**.

El modulo tiene consumidores externos confirmados y dependencias persistentes que deben incluirse en cualquier remediacion. Prioridad de correccion: `EVAL-001`, `EVAL-002`, `EVAL-003`, `EVAL-004`, luego integridad de plantillas y consolidacion de superficies/rutas.
