# Auditoría: Reclutamiento / WorkPositions (Puestos de Trabajo)

**Fecha:** 2026-09-24
**Backend:** `api/LuxuryApp.Application/Modules/RecruitmentLuxuryApp/WorkPositions/` (+ entidades en `Infrastructure/Data/Entities/RecruitmentLuxuryApp/WorkPositions/`, configuración en `Persistence/Recruitment/WorkPositionScheduleConfiguration.cs`)
**Frontend:** `appsweb/angular/src/app/modules/operations.luxuryapp/work-positions/` (+ módulo hermano `recruitment.luxuryapp/work-positions/`, del que depende el formulario)
**Marco aplicado:** `conventions/operations/audit-agent-instructions.md` (Phase 1 + Phase 2), `conventions/audit/audit-prompt-comprehensive.md`, RN de 4 niveles.
**Método:** lectura completa de los 17 archivos backend, 11 archivos frontend y 6 del módulo hermano; greps de Fase 1 con conteo; verificación cruzada contra migraciones, DbContext, motor de políticas RRHH y rutas. **No se ejecutó build, tests ni la aplicación**: lo marcado *por verificar* requiere ejecución o consulta a BD.

> Documentos previos del módulo: `20260916-plan-workposition-schedule.md` y `20260916-qa_gap_analysis_workpositions.md`. Esta auditoría los contrasta con el código actual (§8).

---

## 1. Resumen ejecutivo

| Indicador | Valor |
|---|---|
| Cumplimiento CONVENTIONS combinado | **≈ 54 %** (Frontend 46 %, Backend 62 %) — objetivo 95 % |
| Problemas | 🔴 3 · 🟠 8 · 🟡 13 · 🔵 2 |
| RN identificadas | 17 (0 documentadas en Fase 0; solo RN-HRP-001/003 tienen documento externo) · ✓ 6 · ⚠️ 8 · ❌ 3 |
| Deuda estimada | **113 story points** (objetivo < 30) |
| Prioridad | **Inmediata** para PRIM-001, 002, 003 (seguridad y flujo roto) |

**Fortalezas verificadas**
- Sin `ControllerBase`, `BehaviorSubject`, `*ngIf/*ngFor` ni módulos NgModule; signals y `@if/@for` en todo el front.
- Listado por cliente con Backend-Driven UI correcto: el backend calcula `CanRequestDismissal/CanRequestVacancy/CanModifySalary/CanViewSensitiveData` y anula folio y sueldos (`WorkPositionAppService.cs:175-205`, RN-HRP-002/003).
- Creación y cambio de horario en transacción `Serializable` (`:550-627`). El reemplazo por *copy-on-write* protege hoy los horarios que pudieran seguir compartidos, pero con el modelo 1:1 confirmado pasa a ser un rodeo transitorio (ACC-017).
- Baja lógica en lugar de borrado físico; logging estructurado en todas las operaciones; `LogActivityMetadata` en cada endpoint.
- La validación "no editar horario de puesto inactivo" que el QA del 16-sep señalaba como faltante **ya existe** (`:564-569`).

**Correcciones a mi análisis preliminar (para transparencia)**
- "Sin validators" **no es hallazgo del módulo**: hay 0 clases `*Validator` en todo `Modules/`. Se reporta como brecha sistémica.
- `UpdateAsync` **sí es atómico**: todos los cambios van en un único `SaveChanges`. No se reporta falta de transacción.
- El texto dañado del módulo son **erratas y caracteres perdidos**, no mojibake: el patrón `Ã|Â|U+FFFD` da 0 coincidencias.
- `DuracionCicloSemanas` incorrecto es **MEDIA**, no alta: la simulación de nómina usa primero las semanas físicas de los días (`PayrollSimulationEngineService.cs:127`).

---

## 2. Verificación rápida (Phase 1)

| Aspecto | Frontend | Backend | Evidencia |
|---|---|---|---|
| Estructura | ⚠️ | ✓ | 6 componentes, 0 NgModule (standalone es default en Angular 22; 2/6 lo declaran). 1 `@ViewChild` (`work-position-list.ts:100`). BE: 0 `ControllerBase`, 1 `IEndPointsModule` |
| State management | ✓ | — | 0 `BehaviorSubject`; 20 usos de `signal/computed/effect` |
| Templates | ✓ | — | 0 `*ngIf/*ngFor`; 47 `@if/@for` |
| API access | ❌ | ✓ | 10 usos de `ApiResponseService`, pero `HttpClient` directo en `recruitment.luxuryapp/work-positions/interfaces/work-position.service.ts:7,16`; 6 literales de endpoint (§7) |
| Endpoints | — | ⚠️ | kebab-case y `api/` ✓; `GET .../assign-employee/...` muta estado |
| DTOs | — | ⚠️ | En `DTOs/` del submódulo (conforme a `CONVENTIONS_FOLDER_API.MD` §6.1; el template dice `Contracts/DTOs`, desactualizado). 3 DTOs casi idénticos. 0 validators (sistémico) |
| Responses | — | ✓ | 100 % de retornos del servicio usan `ApiResponseDTO`. HTTP siempre 200 (sistémico, §6) |
| Design tokens | ❌ | — | `work-position-list.scss`: 3 literales (`2px`, `8px`, `13px`); `work-position-form.ts:66-76`: 10 reglas con `rem/px` hardcodeados. 0 colores hex/rgb |
| SELECTs centralizados | ⚠️ | ✓ | `<select tipoJornada>` con 7 opciones y números mágicos (`work-position-form.html:164-172`). Todos los enums del módulo tienen `[Display(Name)]` |
| UI shared | ⚠️ | — | 16 controles nativos (`<input/select/textarea/button/table`): form 13, details 2, hours 1 |
| a11y | ⚠️ | — | `aria-*`: list 3, resto 0. 0 `<img>` sin alt. Headings solo en details/hours |
| Responsive | ⚠️ | — | 0 `@media`; horario con `min-width: 826px` y scroll horizontal (`work-position-form.ts:67`) |
| Tests | ❌ | ❌ | 0 specs FE; 0 tests de `WorkPositionAppService` (solo existe `WorkPositionOrgChartAppServiceTests`) |
| Encoding | ✓ | ✓ | `Ã|Â|U+FFFD` = 0 |

**Brechas principales:** (1) rutas de descripción de puesto inexistentes; (2) mutaciones sin motor de políticas RRHH; (3) fuga de sueldos fuera del listado; (4) regla "un empleado, un puesto" incumplida en `Assign`; (5) horario: sin validación de servidor y formulario que bloquea el alta.

---

## 3. Reglas de negocio (Phase 2 · STEP 2.1)

No existe Fase 0 para el submódulo; **todas son implícitas** salvo las RN-HRP, documentadas en `docs/HumanResourcesLuxuryApp/HrPolicyEngine/20260902-business-rules-hr-policy-engine.md`. IDs propuestos `RN-WP-NNN`.

`S = WorkPositionAppService.cs` (`Services/`).

| ID | Regla | Nivel | Backend | Frontend | Estado |
|---|---|---|---|---|---|
| RN-WP-001 | Un empleado ocupa un solo puesto a la vez | 1-Invariante | `S:234-243`, `S:321-331` ✓; `S:438-473` (`Assign`) ❌ | — | ⚠️ |
| RN-WP-002 | Folio automático `{NumeroCliente}-{RolCode}-{NNN}` | 1-Invariante | `S:281-291` (sin índice único, sin `Folio` en `Persistence/`) | — | ⚠️ |
| RN-WP-003 | Crear puesto genera `JobDescription` por defecto | 1-Invariante | `S:219-232` | — | ✓ |
| RN-WP-004 | Horario = exactamente 28 días (7×4) sin duplicados | 1-Invariante | `S:629-653` | `work-position-form.ts:47-59` | ✓ |
| RN-WP-005 | El puesto no se borra físicamente; la baja libera al empleado | 1-Invariante | `S:393-394` | list mobile `:260` | ⚠️ (README promete cascada de solicitudes; no existe) |
| RN-WP-006 | Cada puesto tiene a lo sumo un horario propio; ningún horario se comparte (catálogo deprecado, decisión 2026-09-24) | 1-Invariante | `S:582-610` solo lo simula con *copy-on-write*; el modelo no lo impone (sin índice único, entidad y configuración de catálogo) | — | ⚠️ |
| RN-WP-007 | Estados Activo↔Inactivo (Delete→Inactivo, Activate→Activo) | 2-Flujo | `S:393`, `S:505` (sin validar estado previo) | list `statusFilter` | ⚠️ |
| RN-WP-008 | No se modifica el horario de un puesto inactivo | 2-Flujo | `S:564-569` | — | ✓ |
| RN-WP-009 | El horario a modificar debe pertenecer al puesto | 2-Flujo | `S:571-575` | — | ✓ |
| RN-WP-010 | (RN-HRP-001, actualizada 2026-09-24) Autoridad estructural sobre puestos: `SuperUsuario` y `Direccion` total; roles autorizados total; roles restringidos solo sobre puestos de terceros (incluye editar horario); el resto ninguna. Aplica a alta, edición, baja, reactivar, asignar, desasignar y horario | 3-Seguridad | Solo en solicitudes; **no** en mutaciones del puesto; `Direccion` fuera de `AuthorizedRoles` | `canEditCurrentSalary` por rol | ❌ |
| RN-WP-011 | (RN-HRP-003) Sueldo/Folio se anulan sin `CanViewSensitiveData` | 3-Seguridad | ✓ `S:191-204`; ❌ `S:60-91`, ⚠️ `S:37-58`, `S:13-35` | list `showSalaryColumn` | ❌ |
| RN-WP-012 | Solo `CanManageStructuralHr` modifica el sueldo del empleado | 3-Seguridad | `S:10-11`, `S:247`, `S:334` | `work-position-form.ts:131-133` (solo RH+SU) | ⚠️ (FE/BE difieren, ver PRIM-010) |
| RN-WP-013 | Aislamiento por cliente (decisión 2026-09-24): cada usuario opera solo puestos de su cliente (su `CustomerId` o un cliente activo de `CustomerUsers`); `SuperUsuario` y `Direccion`, todos | 3-Seguridad | ✓ Implementada en `WorkPositionAppService` (`EnsureCustomerAccessAsync`, `EnsureCanManagePositionAsync`, `ResolveAccessibleCustomerIdsAsync`) con el mismo criterio de `TaskFollowUpAppService`. `ITenantEntity` sigue siendo solo un marcador (no hay filtro global) | — | ✓ (pendiente verificar en ambiente) |
| RN-WP-014 | Sueldo ≥ 0 | 4-Validación | `S:247`, `S:334` (ignora en silencio si es negativo); `SueldoBase` sin validar | `form.ts:170` (`min(0)`) | ⚠️ |
| RN-WP-015 | Nombre ≤ 100, observaciones ≤ 500 | 4-Validación | Solo `HasMaxLength` en BD (`WorkPositionScheduleConfiguration.cs`) | `form.ts:136,139` | ⚠️ |
| RN-WP-016 | Día laborable exige entrada y salida; descanso no lleva horas | 4-Validación | ❌ | `form.ts:47-53` | ❌ backend |
| RN-WP-017 | Cliente, rol y horario existentes y activos al crear/editar | 4-Validación | `S:254-279`, `S:344-355` | — | ✓ |

**Total:** 17 RN · 2 con documento externo (12 %) · 15 implícitas · ✓ 6 · ⚠️ 8 · ❌ 3.

---

## 4. Matriz de roles por tarea (STEP 2.2)

El grupo del endpoint solo exige `RequireAuthorization()` (`WorkPositionEndPoints.cs:8-10`); no hay `RequireRole` ni política por ruta. La autorización efectiva depende del servicio.

| Funcionalidad | Endpoint | Restricción backend | Restricción frontend | Estado |
|---|---|---|---|---|
| Listar por cliente | `GET list-by-customer/{c}/{state}` | Sanitización por rol (`S:175-205`) | Columna sueldo por `canViewSensitiveData` | ✓ |
| Listado general | `GET all-general` | **Ninguna** (devuelve `Sueldo`/`SueldoBase`) | — | ❌ |
| Ver puesto | `GET {id}` | Ninguna (devuelve `SueldoBase`, prestaciones) | — | ⚠️ |
| Ver para editar | `GET for-edit/{id}` | Ninguna (devuelve `Sueldo`) | Modal detalle lo consume sin filtrar | ⚠️ |
| Crear | `POST` | Solo el sueldo se condiciona (`S:247`) | — | ❌ |
| Editar | `PUT {id}` | Solo el sueldo (`S:334`) | Input sueldo deshabilitado para RH/SU | ⚠️ |
| Baja lógica | `DELETE {id}` | **Ninguna** | Solo menú móvil, sin condicionar por flags | ❌ |
| Asignar empleado | `GET assign-employee/...` | Solo mismo cliente (`S:449-451`) | recruitment-staff-board | ❌ |
| Desasignar | `PATCH {id}/unassign-employee` | **Ninguna** | recruitment-staff-board | ❌ |
| Reactivar | `PATCH {id}/activate` | **Ninguna** | recruitment-staff-board | ❌ |
| Ver/editar horario | `GET/PUT {id}/schedule` | **Ninguna** | Formulario | ❌ |
| Ver horas | `GET hours/{id}` | Ninguna | Modales details/hours | ⚠️ |

*Rutas frontend:* `recruitment.routes.ts:46-56` y `recruitment.routing.ts:32-42` solo declaran `title/breadcrumb`; en `routing/directory.routing.ts:70` la ruta `internal-staff` lleva únicamente `authGuard`. Cualquier usuario autenticado llega a las pantallas que mutan puestos; **por verificar** si el menú las oculta por rol.

---

## 5. Errores de coherencia en flujos (STEP 2.3)

| Tipo | Descripción | Ubicación | Severidad |
|---|---|---|---|
| Validación faltante | `Assign` no libera al empleado de su puesto previo | `S:438-473` | 🟠 |
| Validación faltante | `Add/Update` con `EmployeeId` no verifican que el empleado pertenezca al mismo cliente (`Assign` sí) | `S:234-252`, `S:321-339` | 🟠 |
| Transición sin control | `Activate` no valida estado previo ni que el cliente siga activo | `S:494-511` | 🟡 |
| Integridad | `Delete` deja solicitudes vigentes (vacante/baja/salario) y el horario sin cambios | `S:379-412` | 🟠 |
| Inconsistencia | `TipoJornada` es libre respecto a los días: nada los relaciona (ni en FE ni en BE) | `S:589`, `form.html:164` | 🟡 |
| Concurrencia | Sin `RowVersion`: dos ediciones simultáneas del puesto → *last write wins* | `WorkPosition.cs` | 🟡 |
| Race condition | Folio por `COUNT+1`; solo lo protege `Serializable` en `AddAsync`; sin índice único | `S:281-291` | 🟡 |
| Código muerto | `catch (BusinessException)` en `DeleteByIdAsync`; `ApplyDiasDeTrabajoAsync` borra hijos de un horario recién creado (colección vacía) | `S:401-405`, `S:655-667` | 🔵 |
| Auditoría | ✓ `IAuditable` + `LogActivityMetadata` en todos los endpoints | `WorkPosition.cs`, endpoints | ✓ |

---

## 6. Dudas técnicas (STEP 2.4)

| ID | Descripción | Ubicación | Tipo | Impacto | Recomendación |
|---|---|---|---|---|---|
| DUDA-001 | ~~¿El horario es 1:1 con el puesto o catálogo compartido?~~ **RESUELTA (2026-09-24, dueño del módulo):** el horario es **1:1 con el puesto**; el catálogo compartido está **deprecado**. La entidad, la configuración y `AddAsync`/`UpdateAsync` (`WorkPositionScheduleId`) siguen con el modelo de catálogo: es un defecto de implementación, ver ACC-017 | `WorkPositionSchedule.cs:1-20`, `Configuration.cs`, `S:268-279` | ~~Diseño ambiguo~~ Decisión tomada | ALTA | Materializar el 1:1 (ACC-017) y documentarlo como RN-WP-006 |
| DUDA-002 | Al dar de baja un puesto, ¿qué pasa con solicitudes pendientes y con su horario? README/XML doc dicen "cascada" | `S:379-412`, README | Regla implícita | ALTA | Definir en Fase 0 nivel 2 |
| DUDA-003 | Editar el sueldo desde el formulario del puesto modifica `Employee.Salary` directo, **saltándose el flujo de `SalaryChangeRequests`** que ya existe | `S:247-250`, `S:334-337` | Regla implícita / posible bypass | ALTA | Aclarar si es intencional (alta inicial) o cerrar el atajo |
| DUDA-004 | ~~¿RN-HRP-001 aplica a mutaciones del puesto o solo a solicitudes?~~ **RESUELTA (2026-09-24, dueño del módulo):** aplica también a las mutaciones del puesto. Autoridad: `SuperUsuario` y `Direccion` sobre todo; roles autorizados sobre todo; roles restringidos (`Administrador`, `GerenteOperaciones`, `GerenteAtencion`, `Asistente`) **sí pueden editar el horario** de puestos de terceros; el resto, nada. Consecuencia: PRIM-025 y ACC-018 | doc RN-HRP (§0.2, §0.3) | Alcance de RN | ~~ALTA~~ Decisión tomada | Actualizar RN-HRP-001 y aplicar ACC-002/018 |
| DUDA-005 | 28 días fijos aun para ciclos de 1 semana: ¿límite de diseño o simplificación? | `S:631` | Valor hardcodeado | MEDIA | Documentar como RN o parametrizar por `DuracionCicloSemanas` |
| DUDA-006 | `IWorkPositionForm.state` es `boolean`; el backend espera enum `State` (`Activo/Inactivo`, sin `JsonStringEnumConverter` visible). ¿Cómo se serializa el select? | `work-position.model.ts`, `form.ts:171`, `Program.cs:139-145` | Contrato | MEDIA | Verificar en ejecución |
| DUDA-007 | Sueldo negativo se ignora en silencio (no error) | `S:247`, `S:334` | Regla implícita | BAJA | Responder 400 |
| DUDA-008 | ¿Por qué `Sueldo` en el DTO de puesto es sueldo del empleado y no del puesto (`SueldoBase`)? Semántica dual | DTOs `Sueldo`/`SueldoBase` | Modelo | MEDIA | Documentar en glosario |
| DUDA-009 | ~~**Modelo multi-cliente:** ¿un usuario puede operar puestos de cualquier `Customer` o solo los de su propio `CustomerId`?~~ **RESUELTA (2026-09-24, dueño del módulo):** cada usuario opera **solo su propio cliente**; `Direccion` y `SuperUsuario` **siempre** tienen acceso a todo | `ITenantEntity.cs`, `WorkPositionAppService` | ~~Regla de negocio ausente~~ Decisión tomada | ~~ALTA~~ | Implementada como RN-WP-013 (ACC-019) |

---

## 7. Problemas funcionales (PRIM)

### 🔴 Críticos

**PRIM-001 — `JobDescriptionForm` apunta a rutas que no existen**
- *Descripción:* `job-description-form.ts:91` (`GET`) y `:165` (`POST/PUT`) usan `operation/recruitment/job-descriptions`. El backend expone `api/job-descriptions` (`JobDescriptionEndPoints.cs:15`); `grep "operation/recruitment"` en `LuxuryApp.Api`/`Application` solo encuentra `performance-evaluations`. `work-position-details.ts:74` sí usa la ruta correcta.
- *Impacto:* el formulario de descripción del puesto se abre desde `staff-board-list` y `recruitment-staff-board`; cargar o guardar la descripción respondería 404. Bloquea RN-WP-003 en su seguimiento (la descripción "Pendiente de edición" nunca se completa desde esa pantalla).
- *Reproducción:* 1) abrir Plantilla → puesto → editar descripción; 2) guardar. **Actual:** 404 esperado; **Esperado:** persistir. *Por verificar en ejecución.*
- *Causa raíz:* strings hardcodeados en lugar de `Endpoints.JobDescriptions.*` (`reclutamiento.endpoints.ts:20-26` ya los define).
- *Solución:* usar `Endpoints.JobDescriptions.getById/base`. **Complejidad:** Pequeña.

**PRIM-002 — Las mutaciones del puesto no pasan por el motor de políticas RRHH**
- *Descripción:* `IHrActionPolicyService` solo se usa para el sueldo (`S:10-11`). `AddAsync`, `UpdateAsync`, `DeleteByIdAsync`, `AssignEmployeeAsync`, `UnassignEmployeeAsync`, `ActivateAsync` y `UpdateScheduleAsync` no invocan `EnsureCanManageStructuralHr`, como sí hacen los servicios de solicitudes (`SolicitudBajaAppService.cs:261,337`, `RequestPositionAppService.cs:67,227`, `RequestSalaryModificationAppService.cs:61,281`).
- *Impacto:* cualquier usuario autenticado (incluidos `Administrador`, `GerenteOperaciones`, `Asistente`, que RN-HRP-001 declara sin autoridad estructural) puede dar de baja un puesto, vaciarlo o reasignarlo llamando el endpoint directamente. Es el escenario "cURL" del propio documento RN-HRP.
- *Reproducción:* 1) autenticarse con rol `Asistente`; 2) `DELETE api/work-positions/{id}`. **Actual:** 200 y puesto Inactivo; **Esperado:** 403 `HR_FORBIDDEN`.
- *Solución:* `EnsureCanManageStructuralHr(await ResolveWorkPositionRoleAsync(id))` en cada mutación; para `Add`, resolver el rol destino desde `ApplicationRoleId`. **Complejidad:** Media.

**PRIM-003 — Fuga de sueldos y datos confidenciales fuera del listado**
- *Descripción:* el listado anula datos sensibles (RN-HRP-003) pero `GetAllGeneralAsync` (`S:60-91`) devuelve `Sueldo` y `SueldoBase` de **todos** los puestos activos sin filtro, como `object` anónimo; `GetForEditAsync` (`S:37-58`, mapper `Sueldo` en `WorkPositionMapper.cs`) y `GetByIdAsync` (`S:13-35`, `SueldoBase`) tampoco filtran.
- *Impacto:* un rol operativo obtiene el tabulador completo de la plantilla con una sola llamada, anulando la separación de funciones.
- *Reproducción:* con rol `Asistente`, `GET api/work-positions/all-general`. **Actual:** sueldos formateados; **Esperado:** vacío/nulo o 403.
- *Solución:* aplicar `CanViewConfidentialHrData` por fila (igual que `S:183-204`), tipar el DTO y eliminar `object`. **Complejidad:** Media.

### 🟠 Altos

**PRIM-004 — `AssignEmployeeAsync` no libera al empleado de su puesto previo** (`S:438-473`)
`AddAsync`/`UpdateAsync` lo hacen; `Assign` no. Un empleado puede quedar en dos puestos (o fallar con excepción si existe índice único; *por verificar*). Reproducción: asignar el mismo usuario a dos puestos del mismo cliente. Impacta organigrama y nómina. **Complejidad:** Pequeña.

**PRIM-005 — Mass-assignment y validación de propiedad en `UpdateAsync`/`AddAsync`** (`S:357`, `S:234-252`)
`mapper.Map(DTO, model)` copia `CustomerId`, `Folio`, `State`, `EmployeeId` y `SueldoBase` desde el cliente. Se puede reescribir el folio, cambiar el cliente del puesto o asignar un empleado de otro cliente. *Por verificar* si el filtro de tenant lo impide en escritura. **Solución:** DTOs sin campos que el servidor calcula (`Folio`, `CustomerId` en update, `TipoJornada*`) y mapper con `Ignore`. **Complejidad:** Media.

**PRIM-006 — `DeleteByIdAsync` no implementa lo que documenta** (`S:379-412`, README, `IWorkPositionAppService.cs`)
Solo pone `State=Inactivo` y `EmployeeId=null`; no cierra solicitudes de vacante/baja/salario pendientes ni el horario. La UI las seguirá mostrando (`GetAsyncAll` filtra por `Status` Pendiente/Proceso). Depende de DUDA-002. **Complejidad:** Media.

**PRIM-007 — El formulario impide crear un puesto sin completar 28 días y el guardado no es atómico** (`work-position-form.ts:266-270`, `:372`, `:290-299`)
Los 28 días nacen con `esDescanso=false` y sin horas → `workDayValidator` los marca inválidos → `onSubmit` retorna sin guardar el puesto. Además el puesto y el horario se guardan en dos llamadas: si la segunda falla queda "puesto guardado, horario no". *Reproducción:* abrir "nuevo puesto", llenar rol y sueldo base, guardar. **Actual:** no guarda; **Esperado:** guardar puesto (horario opcional o con plantilla). **Complejidad:** Media.

**PRIM-008 — Sin validación de servidor del horario** (`S:546-627`, `CreateWorkPositionScheduleDTO.cs`)
`IWorkPositionScheduleValidationDTO` no tiene ninguna implementación de validación. El backend solo comprueba cantidad (28) y duplicados; no valida `Name` requerido, `Observaciones ≤ 500`, `NumeroSemanaCiclo ∈ 1..4` (el `[Range]` de la entidad no se ejecuta en `SaveChanges`), horas obligatorias en días laborables, ni que un descanso no traiga horas. Cualquier cliente distinto del formulario Angular persiste datos inválidos. **Complejidad:** Media.

**PRIM-009 — Asignación por `GET` con efectos secundarios** (`WorkPositionEndPoints.cs:59`)
`GET assign-employee/{user}/{position}` modifica estado. Viola la semántica HTTP (prefetch, caches, logs de solo lectura). Debe ser `POST`/`PATCH`, como `unassign` y `activate`. Requiere cambio coordinado en `reclutamiento.endpoints.ts` y `recruitment-staff-board.ts:291,314`. **Complejidad:** Pequeña.

**PRIM-025 — `Direccion` no tiene autoridad estructural en el motor de políticas** (`HrActionPolicyService.cs`, `AuthorizedRoles`)
El rol `Direccion` no aparece en ningún punto de `Shared/Policies/`; `AuthorizedRoles` solo contiene `SuperUsuario`, `RecursosHumanos`, `Reclutamiento`, `GerenteMantenimiento` y `SupervisionOperativa`. Por la regla "falla cerrado", Dirección hoy no ve folios ni sueldos en el listado (`CanViewSensitiveData=false`), no recibe las banderas `CanRequest*` y recibe 403 al solicitar baja, vacante o modificación salarial. Contradice la decisión del dueño (2026-09-24): **`SuperUsuario` y `Direccion` tienen acceso a todo**. Reproducción: autenticarse como `Direccion`, cargar `list-by-customer` → folios y sueldos nulos. Severidad 🟠: un rol de gobierno queda sin acceso a datos que la decisión le reconoce. Además, la política no tiene tests. **Complejidad:** Pequeña (ACC-018).

**PRIM-027 — Sin aislamiento por cliente en las operaciones por `Guid`** — ✅ **CORREGIDO en código el 2026-09-24 (ACC-019)**, pendiente de verificación en ambiente
`ITenantEntity` no está implementada en el `ApplicationDbContext` (ver RN-WP-013). `GetById`, `GetForEdit`, `Delete`, `Activate`, `Assign`, `Unassign`, `GetHours`, `GetSchedule` y `UpdateSchedule` cargan el puesto solo por `Id` y `AddAsync` acepta cualquier `CustomerId`; ninguna comprueba que el puesto pertenezca al cliente del usuario (`ICurrentUserService.CustomerId`). Con el guard de política (ACC-002) queda acotado por rol, pero un rol autorizado de un cliente puede operar puestos de otro si conoce el `Guid`. **Severidad 🟠 condicionada a DUDA-009**: si el personal de la administradora opera legítimamente varios clientes, es una decisión de diseño y no un defecto. *Por verificar en ejecución* (prueba S-05). **Complejidad:** Media; **no** entra en la Fase 1. **Resolución:** decisión del dueño (DUDA-009): cada usuario opera solo su cliente y `Direccion`/`SuperUsuario` todos. Se aplica a las 3 lecturas por `Guid`, el listado por cliente, `GetHours`, `GetSchedule`, las 7 mutaciones y el listado general (filtrado a los clientes del usuario). Riesgo residual: **el personal de RRHH/Reclutamiento debe tener sus clientes en `CustomerUsers`**; si no, pierde acceso (ver consulta de diagnóstico en el plan §13).

### 🟡 Medios

| ID | Problema | Ubicación | Solución | Compl. |
|---|---|---|---|---|
| PRIM-010 | Permiso de sueldo distinto en FE y BE: backend autoriza a 5 roles (`AuthorizedRoles`: SU, RH, Reclutamiento, GerenteMantenimiento, SupervisionOperativa); el formulario solo habilita RH y SU y calcula el permiso en el cliente, contra RN-HRP-004 | `form.ts:131-133`, `HrActionPolicyService.cs` | Exponer `canModifySalary` en `for-edit` y obedecerlo | Peq. |
| PRIM-011 | `UpdateScheduleAsync` crea un horario nuevo sin copiar `Descripcion`, y `DuracionCicloSemanas` queda en 1 (default C#); la migración `20260916211954` re-agregó la columna con `defaultValue: 0` para filas legadas y el seeder legado usa 4. Tres valores para el mismo concepto. La nómina usa las semanas físicas primero, por eso no es alta | `S:584-592`, migración, `LegacyWorkPositionScheduleSeeder.cs:119` | Derivar `DuracionCicloSemanas` de los días y normalizar filas en 0; `Descripcion` se conserva sola al pasar a actualización en sitio (ACC-017) | Peq. |
| PRIM-012 | `TipoJornada` es decorativo: ningún handler autocompleta días al elegir "Matutino", y el backend guarda el array tal cual (recomendación del QA 16-sep sin implementar). El listado muestra "Turno" con un texto que puede no corresponder a las horas reales | `form.html:164`, `S:589` | `ScheduleTemplateBuilder` en backend para tipos ≠ Personalizado | Media |
| PRIM-013 | Folio por `COUNT+1` sin índice único en `Persistence/`; README dice `{RFC}-{SortOrder}-...`, código usa `{NumeroCliente}-{Code}-NNN`. `CreateWorkPositionDTO` recibe `Folio`, `DiasDeTrabajo`, `TipoJornada*` que el servicio ignora | `S:281-291`, README, `CreateWorkPositionDTO.cs` | Índice único `(CustomerId, Folio)` tras validar duplicados; limpiar DTO | Media |
| PRIM-014 | Contrato FE/BE: `IWorkPositionHours.observaciones` y `work-position-hours.html:9` esperan un campo que `WorkPositionHoursDTO` no envía (binding muerto). `IWorkPositionForm.state` es `boolean` frente al enum `State` del backend (DUDA-006) | `work-position.model.ts`, `WorkPositionHoursDTO.cs` | Agregar campo o quitar binding | Peq. |
| PRIM-015 | Código muerto y duplicado en FE: `work-positions-for-edit.ts` (271 líneas + html) no lo referencia ninguna ruta y duplica la lógica de horario con validadores divergentes (`!entry && !exit` vs `!entry \|\| !exit`); `onValidateCustomerId`/`onValidateShowTIcket` siempre devuelven `true`; `TableCaption`/iconos posiblemente sin uso | `recruitment.luxuryapp/work-positions/interfaces/work-positions-for-edit.ts`, `list.ts:272-287` | Eliminar | Peq. |
| PRIM-016 | Estructura FE fuera de convención: `models/` (prohibido, debe ser `interfaces/`) y `*.service.ts` por feature con `HttpClient` directo, `environment` manual y `console.error`; 6 literales de endpoint (`job-description-form.ts:91,165`, `details.ts:65,67,75`, `hours.ts:56`) y 6 `any` (`form.ts:218`, `details.ts:34,35,65,74`, `jd-form.ts:90`); endpoints `schedule` y `hours` no existen en `Endpoints.WorkPositions` | ver ubicaciones | Tipar, mover a `interfaces/`, usar `ApiResponseService` + `Endpoints` | Media |
| PRIM-017 | UI: 10 reglas CSS en `styles: [...]` con `rem/px` literales, 3 literales en `work-position-list.scss`; 16 controles nativos en vez de componentes `Custom*`/shared; 0 `aria-*` en form/details/hours; horario móvil con `min-width: 826px`; `<select>` de jornada con números mágicos; paridad Desktop/Mobile rota: **Eliminar** existe solo en el menú móvil (`list.html:258-260`), no en la tabla desktop | ver §2 | Migrar a tokens y UI shared; SELECT desde `SelectItemEnumEndPoints` | Grande |
| PRIM-018 | Rendimiento y consultas: `GetAsyncAll` con 3 subconsultas correlacionadas por fila y `Documents.Any()` dos veces, sin paginación; formatea moneda en el API (`"C"`) y expone `SueldoFiltro` numérico duplicado; magic string `"Asignar"` que el FE interpreta (`list.ts:268`); `GetForEditAsync`/`GetScheduleAsync` sin `AsNoTracking`, este último consulta el horario dos veces; el mapper repite 4 veces la proyección de `DiasDeTrabajo` | `S:93-208`, `S:513-544`, `WorkPositionMapper.cs` | Proyección única, DTO numérico, formateo en FE | Media |
| PRIM-019 | Sin pruebas del servicio (17 RN, 13 endpoints, 0 tests) | `LuxuryApp.Tests/` | Ver plan | Grande |
| PRIM-020 | Documentación: README del 2026-06-25 sin endpoints `/schedule`, folio y cascada erróneos; no existen los 6 documentos de §4.7 ni Fase 0; el plan 16-sep marca como hechos (`[x]`) pasos que el código no refleja (§8) | README, `docs/RecruitmentLuxuryApp/WorkPositions/` | Regenerar | Media |
| PRIM-026 | `BusinessException` tragada por `catch (Exception)`: `AddAsync`, `UpdateAsync`, `AssignEmployeeAsync` y `UpdateScheduleAsync` capturan cualquier excepción y devuelven "Error al …". Los códigos `WORK_POSITION_SCHEDULE_DAYS_COUNT_MISMATCH` y `WORK_POSITION_SCHEDULE_DUPLICATE_DAYS` (`S:634-652`) lanzados por `ApplyDiasDeTrabajoAsync` nunca llegan al cliente, y un guard de política puesto dentro devolvería un error genérico en vez de 403. Reproducción: `PUT .../schedule` con 27 días → error genérico, no 400 con código | `S:300-305`, `S:372-376`, `S:468-472`, `S:621-626` | `catch (BusinessException) { rollback; throw; }` antes del genérico; guards fuera del `try` (se resuelve dentro de ACC-002) | Peq. |
| PRIM-021 | Nomenclatura Anti-Spanglish: DTOs/entidad mezclan español e inglés (`SueldoBase`, `TieneVales`, `DiasDeTrabajo`, `Observaciones` vs columnas `SalaryBase`, `HasVouchers`, `Observations`). Sujeto a las fases de `GOVERNANCE-ANTI-SPANGLISH-RULES.md` | DTOs y entidades | Alinear al plan de migración | Grande |

### 🔵 Bajos / informativos

- **PRIM-022 — Erratas:** `list.ts:280,285` ("Lígica"), `work-position.model.ts` ("(Employee.Id) é para navegar"), `S:471` ("asignar the empleado"), `WorkPosition.cs:36` (`"Rol de Aplicacin"`, falta la "ó" en un `[Display]` visible), `WorkPositionListDto`/`WorkPositionHoursDTO` con comentarios autogenerados vacíos ("Obtiene o establece .").
- **PRIM-023 — HTTP 200 en errores** (`TypedResults.Ok(...)` en 12 de 13 endpoints; `ResponseCode` solo viaja en el cuerpo; no se encontró mapeo global en `LuxuryApp.Api`). Es convención de todo el API; el front lee `Success`. Solo `POST` distingue 201/400.
- **PRIM-024 — AutoMapper (CERRADO para este módulo, decisión 2026-09-24):** el dueño del módulo aclara que la prohibición de AutoMapper aplica **solo a proyecciones de datos** (consultas a BD), no al mapeo en memoria. WorkPositions usa `IMapper`/`Profile` únicamente en memoria (0 `ProjectTo`) y sus proyecciones de consulta son manuales con `.Select()` (`S:64-88`, `S:98-173`), por lo que **cumple**. Queda pendiente reflejar el alcance en `conventions/core/governance-by-role.md:132` y `conventions/operations/available-features.md:44`, hoy redactados como prohibición total, y revisar los 11 `ProjectTo` del API (0 en este módulo).

---

## 8. Contraste con documentos previos (16-sep)

| Afirmación | Realidad en código (24-sep) |
|---|---|
| Plan 1.1: horario 1:1, `WorkPositionId` en `WorkPositionSchedule` `[x]` | La entidad no tiene `WorkPositionId`; sigue `HashSet<WorkPosition> WorkPositions` (`WorkPositionSchedule.cs`) y la configuración relaciona `WorkPositions` con `Restrict`. El aislamiento existe solo por *copy-on-write* en `UpdateScheduleAsync` |
| Plan 1.3: migración que **clona** horarios existentes `[x]` | `20260916211954_WorkPositionScheduleOneToOne.cs` solo agrega `CycleWeeksDuration` (default 0) y `Description`; no hay SQL de clonado. El único clonado es `LegacyWorkPositionScheduleSeeder`, que se dispara a mano (`UpdateDataBaseService.cs:23`) y solo cubre los puestos presentes en `ResultadosHorarios.csv`. Los demás pueden seguir compartiendo horario |
| **Decisión del dueño (2026-09-24)** | El modelo objetivo es 1:1 y el catálogo está deprecado. Los pasos 1.1-1.3 del plan siguen **pendientes** y deben desmarcarse. Ver ACC-017 |
| Plan 3.3 (UI de horario) `[ ]` | Implementada dentro de `work-position-form` (no en `recruitment.luxuryapp/.../for-edit`, que quedó huérfano) |
| QA: `UpdateScheduleAsync` no verifica estado del puesto | Corregido: `S:564-569` |
| QA: backend no regenera días para `TipoJornada` ≠ Personalizado | Sigue pendiente (PRIM-012) |
| QA: soft delete debe desactivar el horario | Sigue pendiente (PRIM-006) |

---

## 9. Matriz de alineación Frontend/Backend (STEP 2.3)

| Funcionalidad | Endpoint backend | Componente frontend | Contrato | Validaciones | Estados |
|---|---|---|---|---|---|
| Listar por cliente | `GET list-by-customer` | `WorkPositionList` | ✓ | — | ✓ |
| Crear puesto | `POST` | `WorkPositionForm` | ⚠️ envía campos ignorados por BE | ⚠️ solo FE | ⚠️ `state` |
| Editar puesto | `PUT {id}` + `GET for-edit` | `WorkPositionForm` | ⚠️ | ⚠️ | ⚠️ |
| Eliminar | `DELETE {id}` | Menú móvil (no desktop) | ✓ | — | ⚠️ |
| Activar/Asignar/Desasignar | `PATCH`, `GET`, `PATCH` | `recruitment-staff-board` | ✓ | — | ✓ |
| Horario | `GET/PUT {id}/schedule` | `WorkPositionForm` + `WorkPositionService` | ✓ | ❌ solo FE | ✓ |
| Horas (solo lectura) | `GET hours/{id}` | `WorkPositionHours`, `WorkPositionDetails` | ⚠️ `observaciones` inexistente | — | ✓ |
| Descripción del puesto | `job-descriptions/*` | `JobDescriptionForm` | ❌ ruta errónea | ✓ | ✓ |
| Detalle | `GET for-edit`, `GET hours`, `GET job-descriptions/{id}` | `WorkPositionDetails` | ⚠️ `any` | — | ✓ |

---

## 10. Cumplimiento CONVENTIONS.md

Método: ✓ = 1, ⚠️ = 0,5, ❌ = 0; promedio simple por regla (no ponderado por severidad).

### Frontend — 46 % (6/13)

| Regla | Cumple | Hallazgo |
|---|---|---|
| Standalone components | ✓ | 6/6 (default Angular 22) |
| Signals, sin decoradores | ⚠️ | 1 `@ViewChild` (`list.ts:100`) → `viewChild()` |
| Control flow `@if/@for` | ✓ | 0 legado / 47 nuevo |
| `ApiResponseService`, sin `HttpClient` | ⚠️ | 1 archivo con `HttpClient` + servicio por feature |
| Endpoints centralizados (`Endpoints.*`) | ❌ | 6 literales en 3 archivos |
| Estructura de carpetas (`interfaces/`, no `models/`) | ⚠️ | 1 `models/`, servicio dentro de `interfaces/` |
| Tipado sin `any` | ⚠️ | 6 `any` |
| Design tokens (Regla Crítica 8) | ❌ | 3 literales SCSS + 10 reglas inline |
| Componentes UI shared | ⚠️ | 16 controles nativos |
| Accesibilidad | ⚠️ | `aria` solo en list |
| Responsive / Desktop-Mobile | ⚠️ | 0 `@media`; *delete* solo móvil |
| Backend-Driven UI (RN-HRP-004) | ⚠️ | `canEditCurrentSalary` por rol |
| Sin código muerto/duplicado | ❌ | componente `for-edit` huérfano (271 líneas) |

### Backend — 62 % (8/13)

| Regla | Cumple | Hallazgo |
|---|---|---|
| Minimal APIs (`IEndPointsModule`) | ✓ | 0 `ControllerBase` |
| Ubicación de DTOs (`CONVENTIONS_FOLDER_API` §6.1) | ✓ | `DTOs/` del submódulo |
| `ApiResponseDTO` | ✓ | 100 % |
| Logging | ✓ | estructurado en todas las operaciones |
| Nullable (sin `string?`) | ✓ | solo `Nullable<T>` de valor |
| Naming de endpoints / verbos | ⚠️ | `GET` que muta |
| Duplicación de DTOs/mapper | ⚠️ | 3 DTOs casi idénticos; 4 proyecciones repetidas |
| Validación de entrada en servidor | ⚠️ | solo 28 días y duplicados |
| Consistencia transaccional | ⚠️ | ok en `Add`/`Schedule`; `Delete` sin cascada |
| Autorización RRHH (RN-HRP-001/003) | ❌ | PRIM-002, PRIM-003 |
| Sin AutoMapper en proyecciones de datos (alcance acordado 2026-09-24) | ✓ | 0 `ProjectTo`; proyecciones con `.Select()`; `IMapper` solo en memoria |
| Tests | ❌ | 0 |
| Documentación (§4.7 + README) | ❌ | 0 de 6 documentos; README obsoleto |

**Cumplimiento combinado:** (46 % + 62 %) / 2 = **54 %**. Objetivo: 95 %.

---

## 11. Plan de acción

> **Estado 2026-09-24:** la Fase 1 (ACC-001, 002, 003, 004, 005, 018, 019) está **implementada en código con tests** (55 verdes) y **pendiente de verificación en ambiente** (S-03, S-05, S-10, consulta de diagnóstico); detalle en el registro de ejecución del plan (§12). Quedan abiertos PRIM-006 a 024 y DUDA-002 y 003.
>
> **Plan derivado (Fase 1, 32 SP):** `20260924-remediacion-reclutamiento-work-positions.md` (ACC-001, 002, 003, 004, 005, 018 y 019; PRIM-026 se cierra dentro de ACC-002). Las Fases 2 y 3 se planifican al cerrar la Fase 1; ACC-017 lleva plan de migración propio.

Propietario entre paréntesis. Puntos: 2-4 pequeña, 6-8 media, 10-16 grande.

### Fase 1 — INMEDIATA (1-2 semanas) · 32 SP
| ID | Acción | Resuelve | SP | Criterio de éxito |
|---|---|---|---|---|
| ACC-001 | (FE) Usar `Endpoints.JobDescriptions.*` en `job-description-form.ts` | PRIM-001 | 2 | Cargar y guardar descripción responde 200 |
| ACC-002 | (BE) `EnsureCanManageStructuralHr` con el rol del puesto destino en las 7 mutaciones, **incluido `UpdateScheduleAsync`**: los roles restringidos pasan sobre puestos de terceros (decisión 2026-09-24). En `Add` el rol destino sale de `ApplicationRoleId`; en `Update`, del rol actual y del nuevo si cambia | PRIM-002 | 8 | `Asistente` edita el horario de un puesto de tercero (200); sobre el puesto de otro `Asistente` recibe 403; `Mensajeria` recibe 403 |
| ACC-003 | (BE) Filtrado por `CanViewConfidentialHrData` en `all-general`, `for-edit`, `{id}` + DTO tipado | PRIM-003 | 6 | Sin sueldos para roles no autorizados |
| ACC-004 | (BE) `Assign` libera puesto previo | PRIM-004 | 3 | Un empleado nunca aparece en 2 puestos |
| ACC-005 | (BE) DTO de update sin `CustomerId/Folio/State`; validar empleado del mismo cliente | PRIM-005 | 4 | Test que rechaza cambio de folio/cliente |
| ACC-018 | (BE) Agregar `Direccion` a `AuthorizedRoles` de `HrActionPolicyService` (junto a `SuperUsuario`: acceso total, decisión 2026-09-24); crear tests unitarios de la política (hoy no existen); revisar el efecto en `CanEditCurrentSalary` y en `FilterAllowedRecipientRoles` (RN-HRP-005) | PRIM-025 | 3 | Dirección ve folios y sueldos en el listado, no recibe 403 al solicitar baja/vacante y recibe las notificaciones estructurales |
| ACC-019 | (BE) **Acceso por cliente** (PRIM-027 / DUDA-009, RN-WP-013): `EnsureCustomerAccessAsync` en lecturas y mutaciones por `Guid`, filtrado del listado general, `SuperUsuario` y `Direccion` sin restricción; tests. ✅ **Implementada 2026-09-24** | PRIM-027 | 6 | Un usuario de otro cliente recibe 403 `CUSTOMER_FORBIDDEN` en todas las operaciones; el listado general solo trae sus clientes |

### Fase 2 — CORTO PLAZO (3-6 semanas) · 51 SP
| ID | Acción | Resuelve | SP |
|---|---|---|---|
| ACC-006 | (BE) Validación de servidor del horario (RN-WP-015/016, `1..4`) | PRIM-008 | 6 |
| ACC-007 | (FE) Permitir guardar puesto sin horario o con plantilla; guardado en dos pasos con estado claro | PRIM-007 | 8 |
| ACC-008 | (BE) Cerrar `Delete`: cascada de solicitudes pendientes (depende de DUDA-002). El horario no se desactiva: con 1:1 vive y muere con el puesto y se conserva al reactivarlo | PRIM-006 | 4 |
| ACC-009 | (BE+FE) `assign-employee` a `POST`/`PATCH` | PRIM-009 | 3 |
| ACC-010 | (BE) `TipoJornada` → generador de días; derivar y normalizar `DuracionCicloSemanas` (con actualización en sitio del ACC-017, `Descripcion` ya no se pierde) | PRIM-011/012 | 6 |
| ACC-011 | (BE) Índice único `(CustomerId, Folio)` tras validar duplicados; limpiar DTO create | PRIM-013 | 6 |
| ACC-012 | (BE) Tests del servicio (RN-WP-001, 005, 008, 010, 011 y flujos de horario) | PRIM-019 | 10 |
| ACC-017 | (BE) **Materializar el 1:1** (plan 16-sep pasos 1.1-1.3): 1) consulta de diagnóstico de horarios compartidos; 2) migración que **clona** los compartidos; 3) índice único filtrado sobre `JobPositions.WorkPositionScheduleId`; 4) entidad y configuración de un solo puesto por horario (fuera `HashSet<WorkPosition>`); 5) `UpdateScheduleAsync` pasa a **actualización en sitio** (se elimina el conteo de usuarios y el copy-on-write); 6) retirar `WorkPositionScheduleId`, `WorkPositionScheduleName` y `WorkPositionScheduleDescription` de los DTOs de alta/edición y las validaciones `scheduleExists` (`S:268-279`, `S:344-355`, `S:363-364`) | DUDA-001 | 8 |

### Fase 3 — MEDIO PLAZO (2 meses) · 30 SP
| ID | Acción | Resuelve | SP |
|---|---|---|---|
| ACC-013 | (FE) Limpieza: borrar `for-edit`, `models/`, servicio por feature; endpoints y tipos; permisos backend-driven (PRIM-010, 014-016) | PRIM-010/014/015/016 | 8 |
| ACC-014 | (FE) Tokens, componentes shared, a11y, responsive, delete en desktop, SELECT de jornada centralizado | PRIM-017 | 10 |
| ACC-015 | (BE) Perf del listado, DTO numérico, unificar proyecciones del mapper | PRIM-018 | 6 |
| ACC-016 | (Docs) Fase 0 + 6 documentos §4.7 + README + reconciliar plan 16-sep | PRIM-020 | 6 |

**Total: 113 SP.** Pendientes de decisión, sin puntaje: PRIM-021 (Anti-Spanglish, según fases del gobierno), PRIM-023 (HTTP 200, sistémico). PRIM-024 (AutoMapper) queda cerrado para este módulo con el alcance acordado.

**Dependencias:** ACC-002/003 comparten el resolver de rol (hacer juntas) · **ACC-018 entra junto con ACC-002**: si se valida la política en las mutaciones sin agregar `Direccion` a los roles autorizados, Dirección quedaría bloqueada · ACC-008 espera respuesta a DUDA-002 · ACC-017 va antes que ACC-010 y ACC-011 · ACC-011 requiere consulta previa de duplicados en BD · ACC-009 exige desplegar BE y FE a la vez.

---

## 12. Métricas

| Métrica | Valor | Target | Status |
|---|---|---|---|
| Cobertura de tests (servicio de puestos) | 0 % | 80 % | 🔴 |
| Cumplimiento CONVENTIONS | 54 % | 95 % | 🔴 |
| Deuda técnica | 113 SP | < 30 | 🔴 |
| RN documentadas en Fase 0 | 12 % (2/17) | 100 % | 🔴 |
| RN cumplidas (✓) | 35 % (6/17) | 100 % | 🔴 |
| Endpoints con autorización efectiva por política | 1/13 (listado) | 13/13 | 🔴 |
| Mojibake (`Ã\|Â\|U+FFFD`) | 0 | 0 | 🟢 |

---

## 13. Control de calidad y límites de esta auditoría

- Cada hallazgo cita archivo y línea, leídos del código en esta fecha. `S:` abrevia `Services/WorkPositionAppService.cs`.
- **No verificado (requiere ejecución o BD):** 404 de `job-descriptions` en runtime (PRIM-001); efecto del filtro de tenant en escrituras (PRIM-005); existencia de índice único sobre `EmployeeId` (PRIM-004); serialización de `state` (DUDA-006); guard por rol en la ruta padre (§4); si hay duplicados de folio en datos reales (ACC-011).
- **No cubierto:** rendimiento real con datos de producción, contraste de color, revisión visual Desktop/Mobile, el módulo `JobDescriptions` en sí, y los consumidores externos de `WorkPositionMapper` (`RequestPositionAppService`, `RecruitmentEmailService`).
- Los cambios de código de esta auditoría **no se aplicaron**. Según la convención, la remediación sigue el flujo de planes (`plan-creation-protocol`) y requiere aprobación.

## 14. Referencias

- `conventions/CONVENTIONS.md` §3bis-9, §4.7, §6ter · `conventions/CONVENTIONS_FOLDER_API.MD` · `conventions/operations/audit-agent-instructions.md`
- `docs/HumanResourcesLuxuryApp/HrPolicyEngine/20260902-business-rules-hr-policy-engine.md` (RN-HRP-001..005)
- `docs/RecruitmentLuxuryApp/WorkPositions/20260916-plan-workposition-schedule.md`, `20260916-qa_gap_analysis_workpositions.md`
- Ejemplo de referencia: `docs/RecruitmentLuxuryApp/Candidates/20260813-auditoria-reclutamiento-candidatos.md`
