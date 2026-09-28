# Plan de Remediación — Reclutamiento / WorkPositions (Fase 1: Inmediata)

## 0. Metadata

| Campo | Valor |
|---|---|
| Fecha | 2026-09-24 |
| Tipo | Remediación (nace de auditoría) |
| Reporte origen | `docs/RecruitmentLuxuryApp/WorkPositions/20260924-auditoria-reclutamiento-work-positions.md` |
| Acciones cubiertas | ACC-001, ACC-002, ACC-003, ACC-004, ACC-005, ACC-018 (26 SP) y ACC-019 acceso por cliente (6 SP, añadida en la ejecución; ver §13) |
| Problemas que cierra | PRIM-001, 002, 003, 004, 005, 025 y PRIM-026 (nuevo, ver §3.4) |
| Plan relacionado | `20260916-plan-workposition-schedule.md` (pasos 1.1-1.3 pasan a ACC-017, **Fase 2**, plan propio) |
| Flujo | Maestro/chalán: este plan lo ejecuta otro agente; el autor audita el diff contra §6 |
| Aprobación requerida | Sí, antes de ejecutar. Incluye **cambio en shared** (T-02): decisión del dueño 2026-09-24 ya registrada en `20260902-business-rules-hr-policy-engine.md` §0.4 |
| Tech Lead / responsable de datos | Dueño del módulo (sin migración en esta fase, ver §3.5) |

---

## FASE 0 — Pre-planeación

### 0.1 Problem Statement + KPIs

1. Actualmente, **los roles sin autoridad estructural** (`Legal`, `Mensajeria`, `SistemasGeneral`, y los operativos sobre puestos de su propio anillo) sufren de **ausencia de control de acceso en el backend** cuando llaman `DELETE`, `PUT`, `POST` o `PATCH` sobre `api/work-positions`, lo que resulta en **bajas, reasignaciones y cambios de sueldo sin autorización ni traza de política** (RN-HRP-001).
2. Actualmente, **`Direccion`** sufre de **bloqueo por la política de RRHH** (`AuthorizedRoles` no la incluye) cuando consulta el listado o solicita bajas, vacantes y modificaciones salariales, lo que resulta en **folios y sueldos nulos y respuestas 403** para un rol que la decisión del dueño declara con acceso total.
3. Actualmente, **cualquier usuario autenticado** sufre de **exposición de sueldos** cuando consulta `all-general`, `for-edit` o `{id}`, lo que resulta en el volcado del tabulador completo (RN-HRP-003).
4. Actualmente, **RRHH y Reclutamiento** sufren de **pérdida de consistencia** cuando asignan un empleado que ya ocupa otro puesto, lo que resulta en empleados en dos puestos y organigramas y nóminas duplicados.
5. Actualmente, **quien edita una descripción de puesto** sufre de **rutas inexistentes** (`operation/recruitment/job-descriptions`), lo que resulta en que la descripción nunca se carga ni se guarda desde esa pantalla.

| KPI | Baseline (2026-09-24) | Target | Timeline |
|---|---|---|---|
| Mutaciones de `WorkPositionAppService` con guard de política | 0 / 7 | 7 / 7 | Fin Sprint 2 |
| Endpoints de lectura que exponen sueldo sin sanear | 3 (`all-general`, `for-edit`, `{id}`) | 0 | Fin Sprint 2 |
| Roles del enum clasificados y probados en la política | 0 de 42 | 42 de 42 (matriz completa) | Fin Sprint 1 |
| `Direccion` con `CanViewSensitiveData=true` en el listado | No | Sí | Fin Sprint 1 |
| Empleados asignados a más de un puesto (dato real) | Sin medir (ver §3.5, consulta de diagnóstico) | 0 | Antes de Sprint 1 (medición); 0 tras Sprint 2 |
| Llamadas de `JobDescriptionForm` con 404 | 2 rutas (GET y POST/PUT) | 0 | Fin Sprint 1 |
| `BusinessException` que llega al cliente con su código HTTP desde mutaciones | 0 / 4 métodos con `try/catch(Exception)` | 4 / 4 | Fin Sprint 2 |

### 0.2 Matriz de reglas de negocio

IDs de `RN-WP-*` definidos en la auditoría §3; `RN-HRP-*` en `20260902-business-rules-hr-policy-engine.md`.

| ID | Nivel | Regla | Componente que la implementa (§3) |
|---|---|---|---|
| RN-WP-001 | 1-Invariante | Un empleado ocupa un solo puesto a la vez | T-05 `WorkPositionAppService.AssignEmployeeAsync` (+ homogeneizar `AddAsync`/`UpdateAsync`) |
| RN-WP-010 (RN-HRP-001) | 3-Seguridad | Autoridad estructural: `SuperUsuario`/`Direccion` total; autorizados total; restringidos solo sobre terceros; resto ninguna. Aplica a las 7 mutaciones | T-02 `HrActionPolicyService`; T-03 guards en `WorkPositionAppService` |
| RN-WP-011 (RN-HRP-003) | 3-Seguridad | Sin `CanViewSensitiveData`, sueldo y folio no salen del backend | T-04 `GetAllGeneralAsync`, `GetForEditAsync`, `GetByIdAsync` |
| RN-WP-012 | 3-Seguridad | Solo `CanManageStructuralHr` modifica el sueldo del empleado | Ya implementada (`CanEditCurrentSalary`); T-02 cambia quién califica (incluye `Direccion`) |
| RN-WP-013 | 3-Seguridad | Aislamiento por tenant. **Hoy no se impone** (`ITenantEntity` es solo marcador, ver auditoría PRIM-027/DUDA-009); **fuera de Fase 1**, solo se registra el resultado de S-05 | T-06 valida empleado del mismo cliente; verificación S-05 |
| RN-WP-017 | 4-Validación | Cliente, rol y empleado existen y pertenecen al mismo cliente | T-06 |
| RN-WP-003 (efecto) | 1-Invariante | Descripción del puesto editable | T-01 (rutas de `JobDescriptionForm`) |
| RN-WP-018 (nueva) | 4-Validación | Una `BusinessException` lanzada en una mutación llega al cliente con su código (400/403), no como error genérico | T-03 (`catch (BusinessException)` antes del genérico) |

### 0.3 Riesgos, pre-mortem y flujos

**Pre-mortem — "salió a producción y fue un desastre; ¿qué lo causó?"**

| # | Causa | Mitigación | Responsable |
|---|---|---|---|
| R1 | Se activan los guards (T-03) sin haber agregado `Direccion` (T-02): Dirección pierde todo el módulo | T-02 se fusiona y despliega **antes o junto** con T-03; prueba S-03 | Ejecutor / Auditor |
| R2 | El guard queda **dentro** de un `try/catch(Exception)` y el 403 se convierte en "Error al actualizar…" (200 con `Success=false`) | Guard fuera del `try` o `catch (BusinessException)` previo (§3.4); prueba de integración por método | Ejecutor |
| R3 | Sanear `Sueldo` a 0 en `for-edit` y que el formulario lo reenvíe por `PUT`, destruyendo el sueldo | `CanViewConfidentialHrData` y `CanManageStructuralHr` son la misma regla: quien no ve, no puede mutar (403 antes de mapear). Prueba S-06 | Ejecutor |
| R4 | Agregar `Direccion` habilita que edite `Employee.Salary` desde el formulario del puesto, saltándose `SalaryChangeRequests` (DUDA-003, abierta) | Se mantiene fuera de Fase 1 pero se **declara** como efecto conocido; decisión del dueño antes de Sprint 2 | Dueño del módulo |
| R5 | `Direccion` entra a los destinatarios de correos de bajas/vacantes/sueldos (RN-HRP-005) sin aviso | Comunicar; listar consumidores de `FilterAllowedRecipientRoles` en el PR | Ejecutor |
| R6 | Ya existen empleados en dos puestos y el nuevo `Assign` los "arregla" en silencio al reasignar | Consulta de diagnóstico previa (§3.5); el log registra cada puesto liberado | Dueño del módulo |
| R7 | La UI sigue mostrando botones a roles sin autoridad y ahora reciben 403 | QA de Sprint 2: verificar mensaje de error visible; el filtrado de UI por banderas queda en Fase 3 (PRIM-010) | Auditor |
| R8 | Cambiar el contrato de `all-general` rompe un consumidor no detectado (no hay consumidor en Angular ni en el API; no existe `flutter/` en la raíz) | Mantener nombres y tipos JSON idénticos; avisar en el PR | Ejecutor |
| R9 | Se asume aislamiento por cliente que **no existe** (`ITenantEntity` sin aplicar): el guard de política limita por rol, no por cliente; un rol autorizado podría operar puestos de otro cliente por `Guid` | No se corrige en Fase 1 (depende de DUDA-009); S-05 documenta el comportamiento real; hallazgo PRIM-027 | Dueño del módulo |

**Flujos (alimentan los criterios de §6)**

| Tipo | Flujo | Resultado esperado |
|---|---|---|
| Happy | `RecursosHumanos` da de baja el puesto de un `Asistente` | 200, puesto `Inactivo`, empleado liberado |
| Happy | `Direccion` carga `list-by-customer` | `CanViewSensitiveData=true`, folio y sueldos presentes |
| Happy | `Asistente` edita el horario del puesto de un `Mensajeria` | 200 |
| Sad | `Asistente` intenta `DELETE` del puesto de otro `Asistente` | 403 `HR_FORBIDDEN` (cuerpo `ApiResponseDTO`, HTTP 403) |
| Sad | `Legal` intenta `POST api/work-positions` | 403 |
| Sad | `Asistente` consulta `for-edit` de un puesto de otro `Asistente` | 200 con `Sueldo=0`, `SueldoBase=0`, `Folio=null`, `CanViewSensitiveData=false` |
| Edge | Asignar a B un empleado que ocupa A | A queda sin empleado; B con empleado; un único `SaveChanges` |
| Edge | `PUT` con `Folio` y `CustomerId` distintos a los del puesto | Se ignoran; el puesto conserva folio y cliente |
| Edge | `PUT` con `EmployeeId` de otro cliente | 404 "Empleado no encontrado." |
| Edge | `PUT .../schedule` con 27 días | 400 con código `WORK_POSITION_SCHEDULE_DAYS_COUNT_MISMATCH` (hoy: error genérico) |
| Edge | Usuario con rol no parseable a `ApplicationRoleEnum` | 403 (falla cerrado) |

---

## 1. Resumen ejecutivo

**Problema:** el módulo de puestos no impone en el backend quién puede mutar, filtra sueldos de forma inconsistente, deja pasar asignaciones duplicadas y tiene una pantalla apuntando a rutas inexistentes; y `Direccion`, con acceso total por decisión del dueño, hoy queda bloqueada por el motor de políticas.

**Solución:** cerrar la brecha en 6 tareas (26 SP): incorporar `Direccion` a la política (con tests de la matriz completa), aplicar la política en las 7 mutaciones (garantizando que su 403 llegue al cliente), sanear las 3 lecturas con sueldo, liberar el puesto previo al asignar, endurecer `UpdateAsync` y corregir las rutas de la descripción del puesto.

**Beneficios:** cumplimiento de RN-HRP-001/003 en backend (no solo en la UI), un empleado en un solo puesto, Dirección operativa, y una base con tests (política de los 42 roles + reglas del servicio) sobre la que se apoyan las Fases 2 y 3.

---

## 2. Alcance y restricciones

**IN-SCOPE (Fase 1)**
- T-01 rutas de `JobDescriptionForm` (FE).
- T-02 `Direccion` en `AuthorizedRoles` + tests de la política (BE, **shared del módulo**).
- T-03 guards de política en las 7 mutaciones + propagación de `BusinessException` (BE).
- T-04 saneo de sueldo/folio en `GetAllGeneralAsync`, `GetForEditAsync`, `GetByIdAsync` + ocultar sueldo en el modal de detalle (BE + `work-position-details.html`).
- T-05 `AssignEmployeeAsync` libera el puesto previo; homogeneizar `Add`/`Update` (BE).
- T-06 `UpdateAsync`: proteger `CustomerId`/`Folio`, validar empleado del mismo cliente y rol existente (BE).

**OUT-OF-SCOPE (fases posteriores o decisión pendiente)**
- Materializar el horario 1:1 (ACC-017, migración y SQL de clonado): **plan propio, Fase 2**.
- `Delete` con cascada de solicitudes (ACC-008, depende de DUDA-002).
- Validación de servidor del horario (ACC-006), formulario (ACC-007), `assign-employee` a `POST/PATCH` (ACC-009), índice único de folio (ACC-011).
- Limpieza de FE (ACC-013), tokens/UI (ACC-014), rendimiento (ACC-015), documentación (ACC-016).
- DUDA-003 (sueldo del puesto que salta `SalaryChangeRequests`) y DUDA-002.

**Restricciones (reglas madre)**
- No asumir, verificar: cada tarea trae su verificación previa.
- **No tocar shared sin control especial:** solo T-02 toca `RecruitmentLuxuryApp/Shared/Policies/` y solo la lista `AuthorizedRoles`. **No** se agregan métodos a `IHrActionPolicyService` (la resolución del rol destino en `Add` se hace con un helper privado del servicio).
- No romper contratos sensibles: los nombres y tipos JSON de `all-general` no cambian.
- Un archivo = un DTO; sin `?` en propiedades nuevas; constructores primarios; `DateTimeExtension` para fechas; mensajes en español correcto (ver `scan-mojibake.mjs` = 0).
- `AutoMapper`: solo `IMapper.Map` en memoria; prohibido `ProjectTo` (`backend-rules.md`).
- No reubicar archivos por iniciativa propia. No agregar dependencias.
- Backend-Driven UI (RN-HRP-004): el front no calcula permisos por rol; solo obedece `canViewSensitiveData`.

---

## 3. Arquitectura y diseño técnico

`S = api/LuxuryApp.Application/Modules/RecruitmentLuxuryApp/WorkPositions/Services/WorkPositionAppService.cs` (líneas de la revisión del 2026-09-24; pueden desplazarse).

### 3.1 T-01 · Rutas de `JobDescriptionForm` (FE, 2 SP)
- **Verificar antes:** reproducir el 404 (`GET api/operation/recruitment/job-descriptions/{id}` con un token válido). Si **no** falla, detener y reportar (el PRIM-001 se reevalúa).
- `job-description-form.ts:91`: `Endpoints.JobDescriptions.getById(this.id())`.
- `job-description-form.ts:165`: `endpoint: Endpoints.JobDescriptions.base`.
- Import: `import { Endpoints } from "@core/constants/endpoints/endpoints";` (mismo import que `work-position-list.ts`).
- Existen **dos** definiciones de estos endpoints (`reclutamiento.endpoints.ts:20-26` y `operation-recruitment.endpoints.ts:14-15`); usar `Endpoints.JobDescriptions` (la que consumen `ai.service.ts` y los modales de vacante). La duplicidad se reporta pero **no** se corrige aquí.
- No tocar los literales de `work-position-details.ts` ni `work-position-hours.ts` (ACC-013).

### 3.2 T-02 · `Direccion` en la política + tests (BE, 3 SP) — **shared**
- `HrActionPolicyService.cs`: agregar `ApplicationRoleEnum.Direccion` a `AuthorizedRoles`, con comentario `// RN-HRP-001 (2026-09-24): acceso total`.
- Actualizar el resumen XML de `IHrActionPolicyService` si nombra los grupos.
- Tests (nuevo archivo `api/LuxuryApp.Tests/Application/Services/HrActionPolicyServiceTests.cs`, namespace `Services.Tests`; xUnit + FluentAssertions + Moq; `ICurrentUserService` con `Mock`; `ApplicationDbContext` con `UseInMemoryDatabase` solo para `ResolveWorkPositionRoleAsync`). Cubrir **los 42 valores** de `ApplicationRoleEnum` (verificado 2026-09-24; solo 10 están nombrados en la política y los otros 32 quedan sin autoridad por falla cerrado) como solicitante contra cada objetivo posible (los 42 roles y `null`):

| Solicitante | Objetivo total/autorizado | Objetivo restringido | Objetivo sin autoridad | Objetivo `null` |
|---|---|---|---|---|
| `SuperUsuario`, `Direccion`, autorizados (4) | true | true | true | true |
| Restringidos (4) | true | **false** | true | true |
| Sin autoridad (`Legal`, `CoordinacionLegal`, `SistemasGeneral`, `Mensajeria`) | false | false | false | false |
| Rol no parseable | `ResolveCurrentUserRole()` = `null` y `EnsureCanManageStructuralHr` lanza 403 (falla cerrado) | | | |

  Más: `CanViewConfidentialHrData` = misma matriz; `EnsureCanManageStructuralHr` lanza `BusinessException` con `Code == "HR_FORBIDDEN"` y `StatusCode == 403`; `FilterAllowedRecipientRoles` incluye `Direccion`.
- **Revisión de impacto (en la descripción del PR):** listar los consumidores de la política: `SolicitudBajaAppService`, `RequestPositionAppService`, `RequestSalaryModificationAppService`, `RecruitmentEmailService`, `WorkPositionAppService`. Declarar el efecto: `Direccion` ve folios y sueldos, puede solicitar bajas/vacantes/salarios, edita el sueldo actual del empleado desde el formulario y recibe las notificaciones de RN-HRP-005.

### 3.3 T-03 · Guards en las 7 mutaciones (BE, 8 SP)
- Helper privado en `WorkPositionAppService`:
  `private async Task<ApplicationRoleEnum?> ResolveRoleByIdAsync(string applicationRoleId)` → `dbContext.Roles` (`Id == applicationRoleId`) → `Enum.TryParse<ApplicationRoleEnum>(role.Name, out var r) ? r : null`.
- Reutilizar `hrPolicyService.EnsureCanManageStructuralHr(ApplicationRoleEnum?)` y `ResolveWorkPositionRoleAsync(Guid)` (ya existen).

| Método | Guard | Ubicación |
|---|---|---|
| `AddAsync` | rol de `DTO.ApplicationRoleId` (`ResolveRoleByIdAsync`) | Primera acción, **antes** de `BeginTransactionAsync`. Si el rol no existe se conserva el 404 actual |
| `UpdateAsync` | rol actual del puesto (`ResolveWorkPositionRoleAsync(id)`) y, si `DTO.ApplicationRoleId != model.ApplicationRoleId`, también el rol nuevo | Después de confirmar que el puesto existe y **antes** del `try` |
| `DeleteByIdAsync` | `ResolveWorkPositionRoleAsync(id)` | Antes de `BeginTransactionAsync` |
| `AssignEmployeeAsync` | `ResolveWorkPositionRoleAsync(workPositionId)` | Antes del `try` |
| `UnassignEmployeeAsync` | `ResolveWorkPositionRoleAsync(id)` | Primera acción |
| `ActivateAsync` | `ResolveWorkPositionRoleAsync(id)` | Primera acción |
| `UpdateScheduleAsync` | `ResolveWorkPositionRoleAsync(workPositionId)` | Antes de `BeginTransactionAsync` |

- Un puesto inexistente devuelve `null` como rol: por diseño de la política, `Legal`/`Mensajeria`/etc. recibirán 403 antes que 404. Es aceptado y se documenta en el PR.
- Las **lecturas de horario y horas** (`GetHoursAsync`, `GetScheduleAsync`) **no** llevan guard.

### 3.4 T-03 (cont.) · Propagación de `BusinessException` — PRIM-026
Los métodos con `try { … } catch (Exception ex) { … return ErrorResult("Error al …") }` (`AddAsync`, `UpdateAsync`, `AssignEmployeeAsync`, `UpdateScheduleAsync`) capturan **cualquier** excepción. Consecuencias hoy: (a) un guard lanzado dentro devolvería un error genérico; (b) `ApplyDiasDeTrabajoAsync` lanza `BusinessException` con códigos `WORK_POSITION_SCHEDULE_DAYS_COUNT_MISMATCH` y `WORK_POSITION_SCHEDULE_DUPLICATE_DAYS` que **nunca llegan al cliente**.
- Regla: guards **fuera** del `try` (tabla anterior) **y** en `AddAsync` y `UpdateScheduleAsync` un `catch (BusinessException) { await transaction.RollbackAsync(); throw; }` **antes** del `catch (Exception)`; en `UpdateAsync` y `AssignEmployeeAsync` (sin transacción) un `catch (BusinessException) { throw; }` equivalente. `GlobalExceptionMiddleware` ya traduce `BusinessException` a `ApiResponseDTO` con su `StatusCode`.
- Sin cambio de firmas ni de contrato para respuestas de éxito.

### 3.5 Migración de datos y prevención de pérdida
**No aplica en Fase 1:** sin cambios de esquema, tablas ni datos (ACC-017 lleva su propio plan de migración con SQL de clonado y validación post-migración según `data-migration-protocol.md`).

**Sí aplica una consulta de diagnóstico de solo lectura, previa al Sprint 1** (no modifica nada; ejecuta el dueño del módulo sobre el ambiente objetivo):

```sql
-- Empleados asignados a más de un puesto (R6, KPI de RN-WP-001)
SELECT EmployeeId, COUNT(*) AS Puestos
FROM JobPositions
WHERE EmployeeId IS NOT NULL
GROUP BY EmployeeId
HAVING COUNT(*) > 1;
-- ESPERADO: 0 filas. Si hay filas, entregarlas al ejecutor antes de T-05.
```

### 3.6 T-04 · Saneo de sueldo y folio (BE + FE, 6 SP)
- Regla única de visibilidad: `hrPolicyService.CanViewConfidentialHrData(requesterRole, targetRole)` con `requesterRole = hrPolicyService.ResolveCurrentUserRole()`. Sin rol parseable → no ve (falla cerrado). Mismo patrón que `S:175-205`.
- `GetAllGeneralAsync`:
  - Reemplazar el tipo anónimo por un DTO nuevo `WorkPositionGeneralDTO` (**un archivo**, `WorkPositions/DTOs/WorkPositionGeneralDTO.cs`, con exactamente las propiedades actuales: `Departament, Id, CustomerId, Cliente, ApplicationRoleId, ApplicationRoleName, NumeroCliente, Sueldo, SueldoBase, Foto, Cubierta, EmployeeName, WorkPositionScheduleId, WorkPositionScheduleName, TipoJornadaName, DuracionCicloSemanas, Observaciones`). Los tipos y nombres JSON no cambian.
  - Proyectar además `ApplicationRole.Name` (campo interno, `[JsonIgnore]`, como `ApplicationRoleRawName` en `WorkPositionListDTO`).
  - Cambiar `IWorkPositionAppService.GetAllGeneralAsync` a `ApiResponseDTO<List<WorkPositionGeneralDTO>>` y ajustar el endpoint si hiciera falta.
  - Post-proceso por fila: si no puede ver → `Sueldo = null`, `SueldoBase = null`.
  - Verificar **antes** que no existan consumidores: `grep -rn "all-general" appsweb api --include=*.ts --include=*.cs` (esperado: solo el endpoint, la interfaz y el servicio) y reportarlo en el PR.
- `GetForEditAsync` (`UpdateWorkPositionDTO`) y `GetByIdAsync` (`WorkPositionRequestDTO`):
  - Añadir `public bool CanViewSensitiveData { get; set; }` a ambos DTOs (`[Display(Name = "Puede ver datos sensibles")]`, sin `?`).
  - Tras `mapper.Map`, resolver el rol destino (`model.ApplicationRole?.Name`) y, si no puede ver: `Sueldo = 0`, `SueldoBase = 0` y (solo en `UpdateWorkPositionDTO`) `Folio = null`. Establecer `CanViewSensitiveData` en ambos casos.
  - Motivo del `0` (no `null`): las propiedades son `decimal` y la regla de `?` prohíbe cambiar el tipo. El riesgo de reenvío por `PUT` (R3) se descarta porque quien no ve tampoco puede mutar (T-03).
- Frontend (único cambio): `work-position-details.html:84-89` — envolver las filas "Sueldo base" y "Sueldo" en `@if (g.canViewSensitiveData) { … }`. No se agregan estilos ni componentes.
- Comprobación previa de consumidores de `getById`: `candidate-work-position-candidates.ts:183` y flujos de vacantes — confirmar que solo se ven con roles con autoridad o que la plantilla no muestra sueldo.

### 3.7 T-05 · `AssignEmployeeAsync` libera el puesto previo (BE, 3 SP)
- Tras encontrar `employeeExist` (`S:449-457`) y antes de asignar:
  ```csharp
  var previous = await dbContext.JobPositions
      .Where(x => x.EmployeeId == employeeExist.Id && x.Id != workPositionId)
      .ToListAsync();
  foreach (var p in previous)
  {
      logger.LogInformation("Desasignando empleado {EmployeeId} del puesto previo {OldWorkPositionId}", employeeExist.Id, p.Id);
      p.EmployeeId = null;
  }
  ```
  Todo dentro del mismo `SaveChanges` existente (atómico).
- Homogeneizar `AddAsync` (`S:236-243`) y `UpdateAsync` (`S:323-331`): `FirstOrDefaultAsync` → `ToListAsync` con el mismo bucle (por si ya hay duplicados legados).
- No cambiar el comportamiento cuando el puesto destino ya tiene otro empleado (queda reemplazado como hoy; se deja el log).

### 3.8 T-06 · Endurecer `UpdateAsync` y `AddAsync` (BE, 4 SP)
- `UpdateAsync`: capturar `var currentCustomerId = model.CustomerId; var currentFolio = model.Folio;` **antes** de `mapper.Map(DTO, model)` y restaurarlos después (mismo patrón que `currentJobDescriptionId`, `S:341-361`). `State` **se mantiene editable** (queda bajo el guard de T-03).
- Validar en `Add` y `Update`: si `DTO.EmployeeId != null`, el empleado debe existir con `e.User.CustomerId == <cliente del puesto>`; si no → `ErrorResult("Empleado no encontrado.", 404)`. Mismo criterio que `AssignEmployeeAsync`.
- `UpdateAsync`: si `DTO.ApplicationRoleId` cambia, verificar que el rol exista (`dbContext.Roles`); si no → 404 "No se encuentra el rol." (hoy fallaría con excepción de FK y error genérico).
- **Verificación, no implementación:** comprobar en ejecución si `POST` crea un puesto con un `CustomerId` ajeno (RN-WP-013). Se sabe por lectura de código que **no existe filtro de tenant** (`ITenantEntity` no se aplica); registrar el resultado de S-05 en el PR y **no** corregir aquí (PRIM-027 / DUDA-009).
- No tocar `WorkPositionScheduleId` (se retira en ACC-017).

---

## 4. Backlog de tareas

| ID | Acción | Tarea | SP | Depende de | Archivos |
|---|---|---|---|---|---|
| T-01 | ACC-001 | Rutas de `JobDescriptionForm` a `Endpoints.JobDescriptions` | 2 | — | `job-description-form.ts` |
| T-02 | ACC-018 | `Direccion` en `AuthorizedRoles` + tests de la política (42 roles) | 3 | — | `HrActionPolicyService.cs`, `IHrActionPolicyService.cs` (solo XML), `HrActionPolicyServiceTests.cs` (nuevo) |
| T-05 | ACC-004 | `Assign` libera puesto previo; homogeneizar `Add`/`Update` | 3 | Consulta §3.5 | `WorkPositionAppService.cs` |
| T-06 | ACC-005 | Proteger `CustomerId`/`Folio`; validar empleado y rol | 4 | — | `WorkPositionAppService.cs` |
| T-03 | ACC-002 | Guards en 7 mutaciones + propagación de `BusinessException` | 8 | **T-02** | `WorkPositionAppService.cs` |
| T-04 | ACC-003 | Saneo en 3 lecturas + `WorkPositionGeneralDTO` + `canViewSensitiveData` en FE | 6 | **T-02**, T-03 (mismo helper de rol) | `WorkPositionAppService.cs`, `IWorkPositionAppService.cs`, DTOs (`WorkPositionGeneralDTO` nuevo; `UpdateWorkPositionDTO`, `WorkPositionRequestDTO`), `work-position-details.html` |
| T-07 | — | Tests del servicio (nuevo `WorkPositionAppServiceTests.cs`, InMemory) que cubran cada criterio de §6 | (dentro de T-03/04/05/06) | — | `LuxuryApp.Tests/Application/Services/` |

**Total: 26 SP.** T-07 no suma puntos: cada tarea entrega sus propios tests (los de `UpdateScheduleAsync` que usan `ExecuteDeleteAsync` deben detenerse en el guard/validación previa, porque el proveedor InMemory no soporta `ExecuteDelete`).

---

## 5. Fases de ejecución

**Sprint 1 (≈ 5 días) — 12 SP**
1. Consulta de diagnóstico §3.5 (dueño).
2. T-01, T-02, T-05, T-06 (en ese orden; PR-A = T-01 frontend; PR-B = T-02 con su revisión de impacto; PR-C = T-05 + T-06).
- **Criterio de paso:** `dotnet build` sin errores; `dotnet test` verde con la matriz de 42 roles y los tests de T-05/T-06; `Direccion` obtiene `CanViewSensitiveData=true` en `list-by-customer`; el formulario de descripción carga y guarda con 200.

**Sprint 2 (≈ 5 días) — 14 SP**
3. T-03 y T-04 (PR-D, un único PR backend con el helper de rol compartido; el cambio de `work-position-details.html` en el mismo PR).
- **Criterio de paso:** las pruebas S-01…S-07 de §6 pasan; las 7 mutaciones y las 3 lecturas cumplen los gates de auditoría; `BusinessException` llega al cliente en los 4 métodos.

**Orden de despliegue:** T-02 nunca después de T-03 (R1). Sin migración; todo es reversible por revert de PR.

---

## 6. Criterios de completitud (ejecutables — los usa el auditor sobre el diff)

**Gates automáticos**

| # | Comando / verificación | Esperado |
|---|---|---|
| G-01 | `dotnet build api/LuxuryApp.sln` | 0 errores; sin warnings nuevos |
| G-02 | `dotnet test api/LuxuryApp.Tests --filter "FullyQualifiedName~HrActionPolicy\|FullyQualifiedName~WorkPositionAppService"` | Todos verdes |
| G-03 | `grep -rn "operation/recruitment/job-descriptions" appsweb/angular/src` | 0 |
| G-04 | `grep -c "EnsureCanManageStructuralHr" WorkPositionAppService.cs` | ≥ 8 (7 mutaciones + segundo guard de `UpdateAsync` por cambio de rol) |
| G-05 | `grep -n "catch (BusinessException)" WorkPositionAppService.cs` | Presente en `UpdateScheduleAsync` y `DeleteByIdAsync` (en `Add`, `Update` y `Assign` el guard va **fuera** del `try`, y nada dentro lanza `BusinessException`; ver registro de ejecución) |
| G-06 | `grep -n "ApiResponseDTO<object>" IWorkPositionAppService.cs` | 0 (ya no hay retorno anónimo) |
| G-07 | `grep -rn "Direccion" HrActionPolicyService.cs` | Aparece en `AuthorizedRoles` |
| G-08 | `grep -rn "\.ProjectTo<" api/LuxuryApp.Application/Modules/RecruitmentLuxuryApp/WorkPositions` | 0 |
| G-09 | Propiedades nuevas en DTOs sin `?` (`git diff` de `DTOs/`) | 0 líneas con `?` en propiedades añadidas |
| G-10 | `node scripts/scan-mojibake.mjs` | 0 |
| G-11 | `git diff --stat` | Solo los archivos listados en §4; sin `Shared/` salvo `HrActionPolicyService.cs` e `IHrActionPolicyService.cs` |

**Pruebas funcionales (Postman/cURL, ambiente de pruebas, con tokens por rol)**

| # | Prueba | Esperado |
|---|---|---|
| S-01 | `Asistente` → `DELETE` del puesto de otro `Asistente` | HTTP 403, `Errors` contiene `HR_FORBIDDEN` |
| S-02 | `Asistente` → `PUT .../schedule` sobre puesto de `Mensajeria` | 200 |
| S-03 | `Direccion` → `list-by-customer` y `POST` de solicitud de baja | Folios/sueldos presentes; sin 403 |
| S-04 | `Legal` → `POST api/work-positions`, `PATCH .../activate`, `PATCH .../unassign-employee` | 403 en los tres |
| S-05 | `POST` con `CustomerId` de otro cliente (rol autorizado) | Registrar el resultado; si crea el puesto, abrir hallazgo (no corregir en Fase 1) |
| S-06 | `Asistente` → `GET for-edit`, `GET {id}`, `GET all-general` sobre puesto de otro `Asistente` | Sueldo/SueldoBase nulos o 0; `Folio` nulo; `canViewSensitiveData=false` |
| S-07 | `PUT .../schedule` con 27 días | HTTP 400, código `WORK_POSITION_SCHEDULE_DAYS_COUNT_MISMATCH` |
| S-08 | Asignar empleado que ocupa A a B | A sin empleado, B con empleado |
| S-09 | `PUT` con `Folio` y `CustomerId` modificados | Ambos sin cambio en BD |
| S-10 | Abrir descripción de puesto desde el tablero y guardar | 200 en GET y en PUT/POST |

**Definición de terminado:** G-01…G-11 y S-01…S-10 en verde; KPIs de §0.1 alcanzados; ningún archivo fuera de alcance modificado; PR con la revisión de impacto de T-02 y el resultado de S-05; auditoría del diff aprobada.

---

## 7. Riesgos y mitigaciones
Ver la tabla de pre-mortem en §0.3 (R1-R8, con responsable y mitigación). Riesgo residual explícito: **R4** (efecto de `Direccion` sobre `Employee.Salary` y DUDA-003) queda abierto hasta decisión del dueño; no bloquea la Fase 1.

## 8. Dependencias externas
- Ambiente de pruebas con usuarios de al menos 5 roles (`SuperUsuario`, `Direccion`, `Asistente` ×2, `Legal`, `RecursosHumanos`).
- Acceso de solo lectura a la BD del ambiente para la consulta §3.5.
- Paquetes de prueba ya presentes (`xunit`, `Moq`, `FluentAssertions`, `EF Core InMemory`); no se agregan dependencias.

## 9. Métricas y KPIs de éxito
Los de §0.1, medidos al cierre de cada sprint. Adicionales: cumplimiento backend de la auditoría 62 % → ≥ 70 % al cerrar Fase 1 (recalcular con la matriz de la auditoría §10) y deuda 107 SP → 81 SP.

## 10. Plan de rollback
- Sin migración ni cambios de datos: revertir el/los PR.
- T-02 se revierte con una sola línea (quitar `Direccion` de `AuthorizedRoles`); si se revierte T-02 **debe** revertirse también T-03 (R1).
- El diagnóstico §3.5 es de solo lectura: no requiere respaldo. Referencia de respaldo de `data-migration-protocol.md`: aplica a ACC-017, no a esta fase.

## 11. Revisión posterior a la implementación
Al cerrar: ¿se cumplieron los KPIs? ¿Cuántos empleados duplicados reveló el diagnóstico? ¿S-05 confirmó o descartó la brecha de tenant? ¿La UI mostró 403 a roles sin autoridad (R7) y cuántos botones deben pasar a Backend-Driven UI en Fase 3? ¿Se resolvió DUDA-003? Documentar en `docs/RecruitmentLuxuryApp/WorkPositions/YYYYMMDD-changelog-reclutamiento-work-positions.md` y actualizar la auditoría (§7, §10, §11).

---

## Instrucciones para el agente ejecutor (chalán)
1. Leer primero `conventions/CONVENTIONS.md` §3bis "Guía Rápida por Tarea" (crear/modificar backend y frontend) y `conventions/backend/backend-rules.md`.
2. Ejecutar **una tarea a la vez** en el orden de §5, con la verificación previa de cada una. Si una verificación previa contradice el plan, **detenerse y reportar**.
3. No abrir alcance: cualquier hallazgo nuevo se anota en el PR, no se corrige.
4. Cada PR incluye: archivos tocados, salida de G-01…G-11, resultado de las pruebas S aplicables y, en T-02, la revisión de impacto.
5. Entregar el diff al autor del plan para auditoría; no fusionar sin ella.

---

## 12. Registro de ejecución (2026-09-24)

Ejecutado directamente por el autor del plan a petición del dueño ("ejecuta directo"), en lugar del flujo maestro/chalán. No se hizo commit.

### 12.1 Resultado por tarea

| Tarea | Estado | Evidencia |
|---|---|---|
| T-01 | ✅ Código | `job-description-form.ts` usa `Endpoints.JobDescriptions.getById/base`; G-03 = 0; el backend expone `GET {id}`, `POST`, `PUT {id}` en `api/job-descriptions`. **No** se reprodujo antes el 404 en runtime |
| T-02 | ✅ Código y tests | `Direccion` en `AuthorizedRoles`; `HrActionPolicyServiceTests`: 22 pruebas verdes |
| T-05 | ✅ Código y tests | `ReleaseEmployeeFromOtherPositionsAsync` en `Assign`, `Add` y `Update` (`ToListAsync`); 3 pruebas |
| T-06 | ✅ Código y tests | Se restauran `CustomerId` y `Folio`; empleado del mismo cliente (404); rol inexistente al cambiar (404); 3 pruebas |
| T-03 | ✅ Código y tests | 8 llamadas a `EnsureCanManageStructuralHr` (G-04); `catch (BusinessException)` en `UpdateScheduleAsync`; 6 pruebas |
| T-04 | ✅ Código y tests | `WorkPositionGeneralDTO` nuevo, `CanViewSensitiveData` en 2 DTOs, `work-position-details.html` oculta sueldos; 4 pruebas |

### 12.2 Gates

| Gate | Resultado |
|---|---|
| G-01 build | Los proyectos `Application` y `Tests` compilan. `LuxuryApp.Api` **no pudo copiar** `LuxuryApp.Application.dll` porque el proceso `LuxuryApp.Api` (PID 44824, servidor local del dueño) lo tiene bloqueado (MSB3027); no hay errores de compilación de C#. No se detuvo el proceso |
| G-02 tests | 47/47 en verde (`HrActionPolicyServiceTests`, `WorkPositionAppServiceTests`, `WorkPositionOrgChartAppServiceTests`). Suite completa: 636 verdes, 16 fallos, 2 omitidos. Los 16 son ajenos: 9 de `CandidateProcessSmokeTests` (lista fija de roles de alto nivel en `CandidateProcessWriteService.cs:~895`), `EmployeeDataValidationServiceTests` (datos bancarios), `UpdateAsync` de Bank/PaymentMethod/UsoCFDI/MeasurementUnit/Charge, `PeriodClosure`, `CustomerDataCompany`. **No se corrió baseline en HEAD**: `api/` tiene decenas de cambios sin commit de otros trabajos |
| G-03 | 0 ✅ |
| G-04 | 8 ✅ (≥ 8) |
| G-05 | Ajustado (ver 12.3) ✅ |
| G-06 | 0 ✅ |
| G-07 | ✅ |
| G-08 | 0 ✅ |
| G-09 | ⚠️ `WorkPositionGeneralDTO` conserva `Guid?` y `byte?` (tipos de valor anulables) para no cambiar el JSON del tipo anónimo previo; es el mismo patrón de `WorkPositionDTO`. Ninguna referencia nueva con `?` |
| G-10 | ✅ 0 en los 5 paths tocados. El escaneo sin ruta recorre todo el repo y reporta 236 480 coincidencias preexistentes (no se investigó su origen) |
| G-11 | ✅ Solo archivos de §4 + los 2 archivos de tests; `Shared/` solo `HrActionPolicyService.cs` |
| tsc (front) | Sin errores en los archivos tocados; `tsc` reporta errores preexistentes en `inventory/` |

### 12.3 Desviaciones respecto al plan
1. **`catch (BusinessException)` solo en `UpdateScheduleAsync` (nuevo) y `DeleteByIdAsync` (ya existía):** en `Add`, `Update` y `Assign` los guards van fuera del `try` y nada dentro lanza `BusinessException`; añadirlo habría sido código muerto. G-05 se ajustó.
2. **`GetAllGeneralAsync`:** el `ApplicationRoleName` del listado ya es el nombre crudo del rol, por lo que `WorkPositionGeneralDTO` no lleva `ApplicationRoleRawName` (no se agregó propiedad interna).
3. **`UpdateAsync`:** el guard del rol actual usa `ResolveRoleByIdAsync(model.ApplicationRoleId)` en lugar de `ResolveWorkPositionRoleAsync(id)`, para evitar una consulta extra (el puesto ya está cargado). Misma semántica.
4. **Cifra de roles:** el plan hablaba de 14 roles; `ApplicationRoleEnum` tiene **42**. Solo 10 están nombrados en la política; los otros 32 quedan sin autoridad. Corregido en el plan y en el documento RN-HRP (§0.4). Los tests cubren los 42.

### 12.4 No ejecutado (requiere ambiente o decisión del dueño)
- **Consulta de diagnóstico §3.5** (empleados en más de un puesto): requiere BD; pendiente.
- **Pruebas funcionales S-01…S-10 con tokens reales:** no las corrí yo. Los tests InMemory cubren S-01, S-02, S-04, S-06, S-07, S-08 y S-09 a nivel de servicio. **S-03** y **S-10** fueron confirmados por el dueño en pruebas y desarrollo (ver §13.1); **S-05** queda cubierto por ACC-019 y pendiente de verificación en ambiente.
- **Reproducción previa del 404 de PRIM-001** (T-01) y confirmación de que el formulario carga y guarda en la UI.
- **Prueba de que los tests detectan la regresión:** no se verificó revirtiendo cada cambio.

### 12.5 Hallazgos nuevos durante la ejecución
- **RN-WP-013 estaba mal en la auditoría:** `ITenantEntity` no se aplica en el `ApplicationDbContext`; el filtro citado (`:3253`) es de borrado lógico. Nuevos PRIM-027 y DUDA-009 (modelo multi-cliente); R9 en §0.3.
- `CandidateProcessWriteService` usa su **propia lista fija** de roles de alto nivel para entrevistadores (sin `Direccion`): otro punto donde "Dirección tiene acceso a todo" no se refleja. Fuera de este plan.
- La proyección de `GetAllGeneralAsync` (`x.Employee.User.FullName`) lanza `NullReferenceException` en el proveedor InMemory cuando el puesto no tiene empleado; SQL Server la traduce con LEFT JOIN. Solo afecta a los tests.

---

## 13. Ampliación: acceso por cliente (ACC-019 · PRIM-027 · DUDA-009), 2026-09-24

### 13.1 Decisiones del dueño
- **R1:** el dueño confirmó, en ambientes de **pruebas y desarrollo**, el punto 1 pedido tras la Fase 1: que `Direccion` ve folios y sueldos en el listado (S-03) y que el formulario de descripción del puesto carga y guarda (S-10). Sobre el resultado de la creación con `CustomerId` ajeno (S-05) no dio detalle; con ACC-019 ese caso queda bloqueado por diseño. La consulta de empleados duplicados sigue sin resultado.
- **R2 (DUDA-009):** cada usuario opera **solo su propio cliente**. **`Direccion` y `SuperUsuario` siempre tienen acceso a todo.**

### 13.2 Diseño (mismo criterio que `TaskFollowUpAppService.CanAccessTaskAsync`)
- `WorkPositionAppService` inyecta `ICurrentUserService` (el registro DI no cambia; se resuelve por tipo).
- `CanManageAnyCustomer()`: `UserRole` es `SuperUsuario` o `Direccion`.
- `EnsureCustomerAccessAsync(customerId)`: pasa si es administrador global, o si `currentUser.CustomerId == customerId`, o si existe una fila de `CustomerUsers` (usuario, cliente) con **cliente activo**. Si no: `BusinessException` **403 `CUSTOMER_FORBIDDEN`**. El header `X-Customer-Id` **no** se usa (lo envía el cliente HTTP).
- `EnsureCanManagePositionAsync(id)`: una consulta trae `CustomerId` y rol del puesto; primero acceso al cliente y luego la política RRHH. Sustituye los guards por Id de Delete, Assign, Unassign, Activate y UpdateSchedule. Si el puesto no existe se exige autoridad estructural genérica y el método devuelve 404.
- **Lecturas** con el cliente del puesto cargado: `GetById`, `GetForEdit`, `GetHours`, `GetSchedule`. **Listado por cliente:** sobre el `customerId` recibido. **Alta:** sobre `DTO.CustomerId`. **Edición:** sobre el cliente vigente del puesto (no el del DTO).
- **`GetAllGeneralAsync`:** `ResolveAccessibleCustomerIdsAsync()` devuelve `null` (todos) para administradores globales o la lista de clientes del usuario (su `CustomerId` + `CustomerUsers` activos); la consulta se filtra por esa lista.
- `ITenantEntity` **no** se toca: sigue siendo un marcador. Un filtro global de tenant en `ApplicationDbContext` es un cambio de plataforma (shared) fuera de este plan.

### 13.3 Verificación
- 7 pruebas nuevas en `WorkPositionAppServiceTests`: usuario de otro cliente recibe `CUSTOMER_FORBIDDEN` en 12 operaciones (2 roles); cliente activo de `CustomerUsers` da acceso; cliente **inactivo** de `CustomerUsers` no; `SuperUsuario` y `Direccion` operan cualquier cliente; el listado general se filtra por cliente.
- Los tests existentes se ajustaron: el usuario simulado lleva `UserId` y `CustomerId` (cliente "001").
- **Mutación controlada:** al desactivar el guard de cliente fallan 3 pruebas (2 del caso de otro cliente y la del cliente inactivo); archivo restaurado idéntico.
- Grupo `WorkPosition`/`HrActionPolicy`: 55 en verde. Suite completa: 643 verdes, mismos 16 fallos ajenos que antes, sin regresiones.

### 13.4 Riesgo de despliegue y consulta de diagnóstico previa (solo lectura)
Quien hoy opera puestos de **varios** clientes sin estar en `CustomerUsers` para ellos **perderá el acceso**: el sistema no exigía nada. El acceso a un cliente viene de `CustomerUsers` (así se arma también la lista de clientes del login, `AuthAppService.GetCustomerAccessAsync`). Antes de desplegar, el dueño debe verificar que el personal de RRHH, Reclutamiento, Gerentes y Supervisión tenga asignados sus clientes:

```sql
-- Clientes activos SIN asignación para cada usuario activo de roles operativos de RRHH (revisar a mano).
SELECT u.Id AS UserId, u.UserName, r.Name AS Rol, u.CustomerId AS ClientePropio,
       (SELECT COUNT(*) FROM CustomerUsers cu WHERE cu.UserId = u.Id) AS ClientesAsignados
FROM Users u
JOIN AspNetUserRoles ur ON ur.UserId = u.Id
JOIN Roles r ON r.Id = ur.RoleId
WHERE r.Name IN ('RecursosHumanos','Reclutamiento','GerenteMantenimiento','SupervisionOperativa',
                 'Administrador','GerenteOperaciones','GerenteAtencion','Asistente')
  AND u.Active = 1
ORDER BY ClientesAsignados, r.Name;
-- Interpretación: un usuario con ClientesAsignados = 0 solo opera su ClientePropio.
```
*(Tablas y columnas tomadas del modelo de EF: `Users`, `Roles`, `AspNetUserRoles`, `CustomerUsers.UserId`. No se ejecutó contra ninguna BD.)*

### 13.5 Pendiente
- Verificar en ambiente: S-05 debe dar **403 `CUSTOMER_FORBIDDEN`** para un usuario no global que envíe un `CustomerId` ajeno, y la UI (tablero de plantilla y reclutamiento) debe seguir cargando para RRHH con la asignación de clientes de §13.4. La consulta de empleados duplicados (§3.5) sigue pendiente.
- Fuera de alcance, sin decidir: respuesta **404** en lugar de 403 para no revelar la existencia de puestos de otro cliente (hoy un puesto inexistente responde 404 y uno ajeno 403); `CandidateProcessWriteService` y su lista fija de roles de alto nivel sin `Direccion`.
