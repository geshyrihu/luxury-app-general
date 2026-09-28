# Plan de Remediacion - Operations Task Engine

**Fecha:** 2026-09-15  
**Origen:** `docs/reporte_maestro/modulos/20260915-qa_gap_analysis-operations-task-engine.md`  
**Backend:** `api/LuxuryApp.Application/Modules/OperationsLuxuryApp/Task/`  
**Frontend:** `appsweb/angular/src/app/modules/operations.luxuryapp/task-engine/`  
**Tipo:** plan de remediacion de auditoria  
**Estado:** Fase 1 backend en ejecucion; frontend bloqueado hasta liberacion explicita.

## Estado de ejecucion

### Backend ejecutado en esta tanda

- [x] Autorizacion de customer objetivo en `TaskAppService`, usando customer del contexto como alcance actual y `CustomerUsers` para alcance multi-customer.
- [x] Identidad server-side para creador, cierre, seguimiento y auditoria; se ignoran actores enviados por DTO.
- [x] Proteccion de lectura, actualizacion, cierre, prioridad, borrado, relevancia y programacion de tareas.
- [x] Validacion de transiciones principales y reapertura solo desde `Completed`.
- [x] Validacion de dependencias same-group y deteccion de ciclos.
- [x] Bloqueo de borrado de grupos con tareas, miembros o plantillas.
- [x] Seguimientos protegidos por customer/autor.
- [x] Pruebas focalizadas ajustadas a usuario autenticado de fixture.

### Pendiente antes de liberar frontend

- [ ] Completar autorizacion multi-customer en todos los subservicios restantes del motor (`Checklist`, `Attachments`, `WorkPlans`, `RecurringTaskCatalog`, reportes y jobs).
- [ ] Agregar pruebas negativas especificas para usuario multi-customer autorizado y customer fuera de alcance.
- [ ] Resolver constraints/idempotencia de Fase 2.
- [ ] Revisar y aprobar cambios backend con el responsable funcional.

### Frontend ejecutado en esta tanda

- [x] Guard anti doble-submit en `FormHelper`.
- [x] Booleano `isAdmin` acepta valor `false` valido.
- [x] Estados `loading` se liberan en listados de mis tareas y task list.
- [x] Preview de work plan usa `POST` para crear y recarga preview.
- [x] Handler de prioridad del work plan deja de lanzar `Method not implemented`.
- [x] Dialogo de envio recibe `year` y `numeroSemana`.

### Frontend pendiente

- [ ] Corregir handlers `Method not implemented` restantes y validar comportamiento funcional.
- [ ] Alinear todas las rutas frontend divergentes con endpoints backend.
- [ ] Cambiar mutaciones GET restantes a verbos HTTP de comando.
- [ ] Completar a11y, tokens, estilos inline y tests de integracion HTTP.

## 1. Resumen ejecutivo

El plan corrige todos los hallazgos de auditoria excepto `CRIT-002`, aceptado explicitamente como riesgo permitido para reporte anonimo por customer. La autorizacion no debe bloquear a roles con acceso a multiples customers: el `customerId` recibido identifica customer objetivo y debe validarse contra el alcance autorizado del usuario, el grupo relacionado y la accion solicitada.

## 2. FASE 0 - Problem statement y KPIs

### 2.1 Problem statement

Actualmente, usuarios operativos con alcance sobre uno o varios customers pueden consultar o modificar tareas mediante GUIDs sin una validacion uniforme del customer objetivo, grupo, propietario y permiso de accion, lo que resulta en riesgo de acceso indebido, estados invalidos, duplicados y contratos frontend/backend rotos.

El reporte anonimo por customer es una excepcion funcional aceptada y no forma parte de remediacion.

### 2.2 KPIs de control

| Metrica | Baseline auditoria | Target | Timeline | Verificacion |
|---|---:|---:|---|---|
| Operaciones sensibles con policy de recurso | 0 evidenciadas en endpoints criticos auditados | 100% | Fase 1 | Tests negativos por customer autorizado/no autorizado |
| Endpoints frontend con ruta divergente | 3 rutas confirmadas | 0 | Fase 2 | Smoke tests HTTP contra rutas Map reales |
| Mutaciones aceptadas por GET | 3 flujos confirmados | 0 | Fase 2 | Inventario endpoint + prueba de metodo HTTP |
| Reglas de unicidad protegidas bajo concurrencia | 0 pruebas concurrentes confirmadas | 100% de reglas criticas | Fase 2 | Tests paralelos + constraint/manejo de conflicto |
| Transiciones de estado sin validacion de origen | Al menos 2 operaciones confirmadas | 0 | Fase 1 | Matriz de transiciones y tests por estado |
| CRIT-002 | Riesgo aceptado | Excepcion documentada y separada | Cierre | Revision funcional del reporte y registro de aceptacion |

### 2.3 Matriz RN de remediacion

| ID | Nivel | Regla | Implementacion objetivo |
|---|---|---|---|
| RN-TASK-001 | 1 | Customer objetivo debe estar dentro del alcance autorizado del usuario; roles multi-customer son validos. | `TaskAccessPolicy`/servicio equivalente + validacion de grupo/tarea |
| RN-TASK-002 | 1 | Una ocurrencia recurrente produce una tarea unica por plantilla/fecha. | Indice unico + idempotencia |
| RN-TASK-003 | 1 | Una tarea tiene maximo una justificacion pendiente. | Constraint/transaccion + captura de conflicto |
| RN-TASK-004 | 2 | Estados solo transicionan desde origen valido y con prerrequisitos. | Servicio de transiciones |
| RN-TASK-005 | 2 | Dependencia pertenece al mismo grupo y no crea ciclos. | Validacion de grafo |
| RN-TASK-006 | 3 | Identidad de actor deriva de claims; customer objetivo puede venir del request solo despues de validar alcance. | Command DTOs + `ICurrentUserService` + autorizacion multi-customer |
| RN-TASK-007 | 3 | `CRIT-002` es excepcion funcional permitida. | Documentacion y exclusion explicita del plan |
| RN-TASK-008 | 4 | Contratos, enums, archivos y validaciones coinciden entre front/back. | DTO/interface/endpoint contract tests |

### 2.4 Pre-mortem

| Supuesto fallido | Impacto | Mitigacion | Fase |
|---|---|---|---|
| Se trata customer multi-customer como tenant unico | Usuarios validos pierden acceso | Policy recibe customer objetivo y consulta alcance autorizado, no igualdad simple | 1 |
| Se corrige UI pero no backend | Bypass por llamada directa continua | Tests HTTP negativos y autorizacion en servicios | 1 |
| Se agrega constraint sin manejar conflicto | Errores 500 en doble submit/job | Capturar `DbUpdateException` y devolver BusinessException idempotente | 2 |
| Se cambia ruta sin contrato compartido | Pantallas quedan en 404 | Inventario Map vs constants y smoke test antes de cerrar | 2 |
| Se modifica shared/DTO sin migracion | Rompe consumidores externos | Aislar DTOs locales y aprobar cambios transversales | Todas |

### 2.5 Flujos criticos

**Happy path multi-customer**

1. Usuario autenticado solicita tarea con `customerId` B.
2. Policy confirma que usuario tiene customer B en su alcance.
3. Policy confirma que grupo/tarea pertenece a B y rol permite accion.
4. Servicio ejecuta operacion y registra actor real.

**Sad path**

1. Usuario solicita customer C fuera de alcance.
2. Backend rechaza 403/BusinessException, sin filtrar existencia de tarea.
3. Frontend muestra error operativo claro.

**Edge path concurrente**

1. Dos requests crean misma ocurrencia recurrente o justificacion.
2. Solo una persiste.
3. Segunda respuesta es idempotente/negocio, no 500 ni duplicado.

## 3. Alcance

### Incluye

- Autorizacion por recurso y customer objetivo para roles single- y multi-customer.
- Estados, prerrequisitos, dependencias, borrado e integridad.
- Unicidad y concurrencia de recurrentes, alertas y justificaciones.
- DTOs de comandos y control de identidad server-side.
- Rutas, verbos HTTP, contratos, estados y prioridades frontend/backend.
- Loading/error handling, doble submit, accesibilidad y tokens del task-engine.
- Tests unitarios, integracion HTTP y pruebas negativas.

### Excluye

- Remediar `CRIT-002`; queda permitido por decision funcional.
- Cambiar politica de negocio del reporte anonimo.
- Reubicar namespaces o modificar shared sin plan de migracion y aprobacion.
- Nuevos requerimientos funcionales no descritos en auditoria.

## 4. Restricciones

- `customerId` del request se conserva cuando representa customer objetivo.
- No usar igualdad `customerId == currentCustomer` como unica regla para roles multi-customer.
- Nunca confiar en `ApplicationUserId`, `CreatorId`, `ClosedById` ni actor equivalente enviado por cliente.
- Backend sigue siendo autoridad final; guards y botones frontend no sustituyen policy.
- No modificar DTOs shared, interfaces shared, enums/catalogos centrales o rutas publicas sin analisis de impacto.
- Toda migracion de indice/constraint debe ser reversible y probada contra datos existentes.

## 5. Fases de ejecucion

### Fase 1 - Seguridad y dominio, inmediata

**Objetivo:** cerrar acceso indebido sin romper usuarios multi-customer.

Checklist:

- [ ] Inventariar roles oficiales y fuente real de customers autorizados por usuario.
- [ ] Definir policy `CanAccessCustomer(customerId, action)` y alcance por rol.
- [ ] Validar customer objetivo contra usuario, grupo y tarea en lecturas/mutaciones.
- [ ] Mantener `CRIT-002` como excepcion separada y documentada.
- [ ] Separar DTOs de comando de DTOs de respuesta; quitar actor/fechas/control fields del input.
- [ ] Resolver actor desde `ICurrentUserService`.
- [ ] Implementar matriz de transiciones y prerrequisitos.
- [ ] Proteger reapertura, cierre, status, prioridad, relevancia, orden y dependencia.
- [ ] Bloquear borrado con hijos/dependencias o aplicar politica aprobada de archivado.
- [ ] Agregar tests negativos single-customer, multi-customer autorizado y customer fuera de alcance.

Criterios de paso:

- Usuario multi-customer puede operar todos sus customers autorizados.
- Usuario fuera de alcance recibe rechazo uniforme sin fuga de datos.
- Ningun endpoint sensible acepta identidad del actor desde payload.
- No se puede saltar estado ni reabrir estado no permitido.
- Tests de autorizacion pasan en endpoints y servicios.

### Fase 2 - Concurrencia, integridad y contratos

Checklist:

- [ ] Agregar constraint unico de tarea recurrente por plantilla/fecha.
- [ ] Agregar unicidad/idempotencia para justificacion pendiente y alertas.
- [ ] Capturar conflictos de BD con `BusinessException` estable.
- [ ] Evaluar concurrency token para `TaskRecord` y estrategia de conflicto.
- [ ] Validar dependencias same-group y ciclos indirectos.
- [ ] Alinear constants frontend con rutas backend reales.
- [ ] Cambiar mutaciones GET a POST/PATCH/PUT y actualizar consumidores.
- [ ] Alinear `GanttStatus`, prioridades y serializacion.
- [ ] Agregar smoke tests HTTP frontend/backend.

Criterios de paso:

- Requests/jobs concurrentes no crean duplicados.
- Conflictos devuelven respuesta de negocio controlada.
- Todas las llamadas activas tienen endpoint backend existente y verbo correcto.
- Estados y prioridades tienen una sola tabla de mapeo verificable.

### Fase 3 - Frontend, UX y calidad

Checklist:

- [ ] Bloquear doble submit con guard de reentrada y estado finally.
- [ ] Corregir `onUpdatePriority` y otros handlers no implementados.
- [ ] Pasar year/week al dialogo de envio.
- [ ] Separar preview de create; manejar respuesta, error y loading.
- [ ] Corregir imports de specs y ejecutar templates reales en tests.
- [ ] Aplicar loading/error/finally en listados y reportes.
- [ ] Corregir `Validators.required` para booleano `isAdmin`.
- [ ] Sustituir interactivos no semanticos por botones accesibles.
- [ ] Corregir alt text, tokens, estilos inline y colores hardcodeados.

Criterios de paso:

- Build y suite focalizada pasan.
- No quedan handlers `Method not implemented` usados por templates.
- A11y y auditoria de tokens no agregan deuda nueva.

### Fase 4 - Documentacion y reauditoria

Checklist:

- [ ] Actualizar README tecnico con rutas reales y alcance multi-customer.
- [ ] Documentar RN y matriz de permisos.
- [ ] Registrar constraints/migraciones y rollback.
- [ ] Ejecutar auditoria de cierre y actualizar hallazgos.
- [ ] Registrar explicitamente aceptacion de `CRIT-002`.

## 6. Dependencias e impactos

| Dependencia | Impacto |
|---|---|
| Catalogo oficial de roles | Define alcance multi-customer y acciones permitidas. |
| `ICurrentUserService` / accessor de customer | Fuente de identidad y contexto; revisar API real antes de implementar. |
| DTOs y endpoints consumidos por otros modulos | Requieren analisis de consumidores y posible migracion compatible. |
| EF migrations/base desplegada | Constraints y cascadas deben validarse con datos reales. |
| Jobs Hangfire | Recurrentes y alertas necesitan idempotencia entre workers. |
| Frontend routing/constants | Cambios de verbo/ruta requieren actualizar todos los consumidores. |

## 7. Riesgos de ejecucion

- **Alto:** policy incorrecta bloquea usuarios multi-customer legitimos. Mitigacion: matriz autorizada por customer y pruebas de permisos positivos.
- **Alto:** constraint revela duplicados existentes. Mitigacion: backfill/deduplicacion reversible antes de aplicar indice.
- **Medio:** cambiar GET mutante puede romper bookmarks o consumidores legacy. Mitigacion: inventario y migracion versionada; no borrar ruta sin evidencia.
- **Medio:** corregir DTOs cambia contratos serializados. Mitigacion: endpoints versionados o DTO de comando local con respuesta estable.

## 8. Cierre esperado

El plan se considera completado cuando Fases 1-4 cumplen criterios, todos los hallazgos restantes de la auditoria tienen estado `resuelto` o `aceptado`, `CRIT-002` permanece registrado como excepcion permitida, y una nueva auditoria confirma autorizacion multi-customer correcta sin IDOR cross-scope.

No iniciar implementacion hasta aprobar este plan y confirmar catalogo de roles, fuente de customers autorizados y comportamiento deseado para transiciones de estado.
