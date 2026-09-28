# Orquestación D-11 — Organigrama por rol (`OrgHierarchy` de puesto a rol)

**Fecha:** 2026-08-21 · **Protocolo:** `AGENTS.md` §Protocolo de Orquestación (mismo que
`20260820-alertas-tareas-recurrentes-orquestacion.md`)
**Origen:** dependencia D-11 de `docs/modulos-existente/alertas-tareas-recurrentes/03-riesgos-dependencias.md:82`
(RS-01 cerrado 2026-08-20 "por diseño": el organigrama pasa a `ApplicationRole` + `CustomerId`
obligatorio). Bloqueaba T-12 de la orquestación de Alertas de Tareas Recurrentes.

**Decisión tomada 2026-08-21 (por el usuario, explícita):** reemplazar `OrgHierarchy` de verdad
— no crear una entidad paralela — y rediseñar el organigrama de RH para que funcione sobre roles
en vez de puestos. Alcance mayor al de una dependencia menor: toca esquema, un servicio de
backend completo y un feature de frontend completo con su propia lógica de árbol.

## Qué existe hoy (investigado antes de tocar nada)

- **Backend:** `WorkPositionOrgChartAppService.cs`
  (`api/LuxuryApp.Application/Moduls/RecursosHumanosLuxuryApp/Employees/EmployeeOrganigrama/Services/`)
  — `GetTreeAsync(customerId)` y `ReassignAsync(request)`, con detección de ciclos y recálculo de
  niveles, sobre `OrgHierarchy.ParentWorkPositionId`/`ChildWorkPositionId`.
- **Frontend:** `org-chart.ts` (796 líneas) + `.html` (476 líneas) en
  `client/angular/src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/employees/org-chart/`
  — dos vistas (`ngx-graph` para "ver", tabla plana para "editar"), drag-and-drop nativo HTML5 +
  selección por clic, 4 helpers con sus propios tests:
  - `org-chart-graph-adapter.ts` — arma nodos/links para `ngx-graph`. Asume **un solo empleado
    por nodo** (`secondaryLabel`, `isVacant`) — no generaliza a "un rol con N empleados".
  - `org-chart-grouping.ts` — **la pieza clave**: agrupa sintéticamente en el cliente los
    hermanos-hoja que comparten el mismo rol cuando son ≥3, con IDs sintéticos
    `GROUP__<parentId>__<roleDisplayName>` y expandir/colapsar. Es literalmente un parche de
    frontend para el problema que un modelo Rol→Rol resolvería de forma nativa (un nodo de rol ES
    el grupo). Con el rediseño, este archivo probablemente **desaparece casi entero**.
  - `org-chart-tree-ops.ts` — navegación de árbol genérica (buscar, hermanos, reordenar). Sin
    supuestos de empleado/puesto — reutilizable casi tal cual.
  - `org-chart-validation.ts` — detección de ciclos (genérica, reutilizable) + regla de "no
    reasignar un nodo de grupo sin expandirlo" (artefacto del parche de agrupación, probablemente
    ya no aplica).
- **Nadie más consume `OrgHierarchy` ni `reportsToWorkPositionId`** — confirmado por grep
  exhaustivo en frontend y backend. El blast radius real es: la entidad, un servicio de backend,
  y un feature de frontend — nada de expediente de empleado, nada de otras pantallas.
- **`ApplicationRole`** (`Roles` table, hereda `IdentityRole`) ya tiene CRUD completo
  (`roles-list.ts`/`role-form.ts` en `admin.luxuryapp/seguridad-permisos/application-role/`), pero
  **no tiene `CustomerId`** — es una definición global compartida entre clientes (consistente con
  cómo se usa `ApplicationRoleEnum` en el resto del código, ej. `TaskEscalationService.cs`). Esto
  es correcto y no hace falta tocarlo: lo que se vuelve por-cliente es la **arista** de jerarquía
  (`OrgHierarchy`), no el catálogo de roles en sí.

## Riesgo de datos — verificar antes de migrar

`OrganizationHierarchy` (tabla física de `OrgHierarchy`) es un feature de RH ya en uso. **No se
sabe si tiene filas reales.** Antes de generar la migración destructiva, el primer ticket exige
correr y reportar:
```sql
SELECT COUNT(*) FROM OrganizationHierarchy;
```
Si el conteo es distinto de cero, **no se continúa sin decisión explícita** — mismo protocolo que
ya se siguió en T-15/T-13a de la otra orquestación (verificación antes de romper, nunca después).

## Tablero de tickets

| Ticket | Contenido | Tamaño | Depende de | Estado |
| --- | --- | :-: | --- | :-: |
| **D11-01** | Esquema: `OrgHierarchy` de puesto a rol + `CustomerId` obligatorio (sólo entidad + migración, sin lógica) | S | — | 🟡 Detenido por guardia de datos — continúa en D11-01b |
| **D11-01b** | Continuación: truncar `OrganizationHierarchy` (autorizado, datos de desarrollo) y completar el esquema | XS | D11-01 | ✅ Aprobado — repo con build roto hasta D11-02 (esperado) |
| **D11-02** | Backend: reescribir `WorkPositionOrgChartAppService` sobre roles (árbol con roster de miembros por nodo) + arreglar `EmployeeFileAppService.cs:380` | M | D11-01b | ✅ Aprobado |
| **D11-03** | Frontend: adaptar `org-chart.ts` y sus 4 helpers al árbol por rol; retirar/simplificar `org-chart-grouping.ts` | M | D11-02 | ✅ Aprobado |
| **D11-04** | Retomar T-12 (justificación con aprobación del jefe) — esquema: enum `TaskJustificationState` + entidad `TaskJustification` + migración, sin lógica, mismo patrón que T-09/T-13a | S | D11-02 | ✅ Aprobado |
| **D11-05** | Servicio `ITaskJustificationService` (solicitar/aprobar/rechazar) + endpoints — `RN-ALT-004` (no auto-aprobación, jefe resuelto vía `OrgHierarchy` por rol), `RN-ALT-012` (solicitar no detiene alertas), `RN-ALT-023` (sólo el jefe aprueba/rechaza), `RN-ALT-035` (motivo ≥ 20 caracteres) | M | D11-04 | ✅ Aprobado |
| **D11-06** | Integración con el motor: `RN-ALT-013` — una justificación `Aprobada` saca la tarea del ciclo de `TaskAlertEngineService`/`TaskEscalationService`; `Rechazada` la deja seguir igual que hoy | S | D11-05 | ✅ Aprobado |
| **D11-07** | Frontend: panel de justificación embebido en `task-view` (solicitar + aprobar/rechazar), mismo molde que `TaskChecklistPanel` de T-13e | M | D11-06 | ✅ Aprobado |

**Nota de split (2026-08-21):** T-12 original era un solo ticket "M". Se parte en cuatro —esquema,
servicio, integración con el motor, frontend— siguiendo el mismo criterio ya aplicado en T-03/T-04,
T-09/T-09b y T-13a-e de la otra orquestación: cada migración y cada capa se auditan mejor solas.
Los prompts de D11-06 y D11-07 se redactan cuando el ticket anterior esté aprobado, no antes —
regla de oro del protocolo (§1).

**Riesgo declarado, no resuelto en D11-05, sin ticket todavía:** solicitar una justificación no
dispara ningún aviso a quien tendría que aprobarla — el jefe sólo se entera si consulta la tarea o
si D11-07 (frontend) le muestra pendientes activamente. Igual que el resto de esta orquestación,
se documenta como riesgo conocido en vez de improvisarse dentro de un ticket que no lo pedía;
queda pendiente decidir si se resuelve en D11-07 (badge/lista de pendientes) o en un ticket propio
de notificación.

## Prompts entregados

| Ticket | Archivo |
| --- | --- |
| D11-01 | [`../../../docs/HumanResourcesLuxuryApp/OrgChart/20260821-prompt-hr-orgchart-D11-01-esquema-orghierarchy-roles.md`](./../../../docs/HumanResourcesLuxuryApp/OrgChart/20260821-prompt-hr-orgchart-D11-01-esquema-orghierarchy-roles.md) |
| D11-01b | [`../../../docs/HumanResourcesLuxuryApp/OrgChart/20260821-prompt-hr-orgchart-D11-01b-continuar-truncar-y-migrar.md`](./../../../docs/HumanResourcesLuxuryApp/OrgChart/20260821-prompt-hr-orgchart-D11-01b-continuar-truncar-y-migrar.md) |
| D11-02 | [`../../../docs/HumanResourcesLuxuryApp/OrgChart/20260821-prompt-hr-orgchart-D11-02-backend-organigrama-roles.md`](./../../../docs/HumanResourcesLuxuryApp/OrgChart/20260821-prompt-hr-orgchart-D11-02-backend-organigrama-roles.md) |
| D11-03 | [`../../../docs/HumanResourcesLuxuryApp/OrgChart/20260821-prompt-hr-orgchart-D11-03-frontend-organigrama-roles.md`](./../../../docs/HumanResourcesLuxuryApp/OrgChart/20260821-prompt-hr-orgchart-D11-03-frontend-organigrama-roles.md) |
| D11-04 | [`../../../docs/HumanResourcesLuxuryApp/OrgChart/20260821-prompt-hr-orgchart-D11-04-esquema-taskjustification.md`](./../../../docs/HumanResourcesLuxuryApp/OrgChart/20260821-prompt-hr-orgchart-D11-04-esquema-taskjustification.md) |
| D11-05 | [`../../../docs/HumanResourcesLuxuryApp/OrgChart/20260821-prompt-hr-orgchart-D11-05-servicio-taskjustification.md`](./../../../docs/HumanResourcesLuxuryApp/OrgChart/20260821-prompt-hr-orgchart-D11-05-servicio-taskjustification.md) |
| D11-06 | [`../../../docs/HumanResourcesLuxuryApp/OrgChart/20260821-prompt-hr-orgchart-D11-06-integracion-motor-alertas.md`](./../../../docs/HumanResourcesLuxuryApp/OrgChart/20260821-prompt-hr-orgchart-D11-06-integracion-motor-alertas.md) |
| D11-07 | [`../../../docs/HumanResourcesLuxuryApp/OrgChart/20260821-prompt-hr-orgchart-D11-07-frontend-task-justification-panel.md`](./../../../docs/HumanResourcesLuxuryApp/OrgChart/20260821-prompt-hr-orgchart-D11-07-frontend-task-justification-panel.md) |

---

## Auditoría

### Detalle — D11-01 (detenido por guardia de datos)

El ejecutor corrió `SELECT COUNT(*) FROM OrganizationHierarchy` como pedía el prompt y obtuvo
**46**, distinto de cero — se detuvo correctamente sin tocar la entidad, `WorkPosition`,
`ApplicationDbContext` ni generar migración, exactamente como indicaba el criterio de PASO. No es
una falla del ejecutor ni del ticket: la guardia de datos hizo justo lo que debía.

Antes de decidir, intenté verificar por consulta directa si la conversión puesto→rol de esas 46
filas sería mecánica o tendría conflictos (mismo rol subordinado reportando a roles superiores
distintos). El modo automático bloqueó la consulta completa (JOIN a `WorkPosition`/`ApplicationRole`)
por tocar la base de datos directamente; alcancé a confirmar por una consulta más simple
(`INFORMATION_SCHEMA.TABLES`) que la tabla física real de `ApplicationRole` es `AspNetRoles`, no
`Roles` como dice el atributo `[Table("Roles")]` de la clase — mismo patrón de discrepancia que
`Tasks`/`Task` en T-07 de la otra orquestación. Documentado en D11-01b para que el ejecutor lo
verifique en la migración generada.

**Decisión del usuario (2026-08-21):** truncar `OrganizationHierarchy` — son 46 filas de
desarrollo, sin riesgo de pérdida de información real. Continúa en D11-01b.

### Detalle — D11-01b (aprobado)

Verifiqué entidad, `WorkPosition.cs`, Fluent API y la migración generada línea por línea — todo
coincide con el prompt. Hallazgo real bien manejado por el ejecutor: EF generó
`RenameColumn(ChildWorkPositionId → CustomerId)` en vez de Drop+Add (heurística normal de EF al
emparejar columnas `Guid` no-nulas) — inofensivo sólo porque la tabla quedó vacía por el truncado
del Paso 0 (confirmado: `Total 0`). FK de roles usa `AspNetRoles`, confirmado.

Los 13 errores de `dotnet build api/LuxuryApp.sln` son exactamente los previstos por el prompt
(consumidores fuera de alcance) más un hallazgo del ejecutor que mi propio grep no había detectado:
`EmployeeFileAppService.cs:380` también usa `WorkPosition.ParentHierarchies`. El ejecutor priorizó
correctamente "no tocar esos archivos" sobre "build sin errores" — demostró que el esquema en sí
está sano compilando `LuxuryApp.Infrastructure.Data.csproj` en aislado (0 errores). Es mi propia
contradicción de scoping, no un fallo del ejecutor.

**Estado real del repo:** no compila completo hasta que D11-02 actualice
`WorkPositionOrgChartAppService.cs` y `EmployeeFileAppService.cs:380`. Esperado, pero urgente de
cerrar.

**Veredicto: ✅ Aprobado.** Sigue D11-02.

### Detalle — D11-02 (aprobado)

Verifiqué las 6 consultas a `OrgHierarchy` dentro del servicio — todas filtran `CustomerId`, sin
excepción (el riesgo #1 del prompt). Los 5 tests lo prueban empíricamente, incluyendo uno no
pedido explícitamente que exige la misma garantía desde `GetTreeAsync`, no sólo `ReassignAsync`.
Revisé `git diff` del endpoint: cambio mínimo y preciso, `RequireAuthorization("SoloSuperUsuario")`
ya existía antes (no es una restricción nueva sin avisar). `ManagerName` desapareció por completo
(DTO + servicio), confirmado por grep.

`dotnet build api/LuxuryApp.sln` falló por bloqueo de archivos (el servidor local seguía
corriendo) — no por error de código. Verifiqué de forma independiente compilando
`LuxuryApp.Application.csproj` y `LuxuryApp.Tests.csproj` por separado: **0 errores en ambos**.
`dotnet test --filter WorkPositionOrgChartAppServiceTests` → **5/5 pasan**.

**Cambio de contrato para D11-03:** la ruta de reasignación pasó de
`PATCH work-position-org-chart/reassign` a `PATCH work-position-org-chart/reassign/{customerId}`
— antes `customerId` iba en el cuerpo, ahora va en la URL.

**Veredicto: ✅ Aprobado.** Sigue D11-03.

### Detalle — D11-03 (aprobado)

Verifiqué exhaustivamente: cero referencias sueltas a `workPositionId` como identidad de nodo (la
única que queda es correcta, `member.workPositionId` como `track` del roster). `executeReassign`
usa `Endpoints.OrgChart.reassign(customerId)` con el payload `IRoleOrgChartReassignRequest`
correcto. `totalNodes`/`vacantCount` quedaron como dos métricas separadas y bien definidas
(conteo de roles vs. suma de miembros vacantes), tal como pedía el prompt. `org-chart-grouping.ts`
y su spec fueron eliminados sin dejar referencias. `org-chart-validation.ts` quitó el bloque
`isGroup` correctamente. El panel lateral de miembros (`lx-sidebar`) muestra roster completo con
foto/iniciales, nombre, folio, estado, email, teléfono — decisión de diseño razonable del
ejecutor, confirmé que `lx-sidebar`/`lx-avatar`/`lx-toast` son componentes reales del proyecto.

**Verificación independiente:** `vitest run` sobre toda la carpeta `org-chart/` → 4 archivos,
**21/21 tests pasan**. `scan-mojibake.mjs` sobre los 12 archivos tocados → 0 mojibake. No repetí
el `npm run build` completo del ejecutor (ya reportado en verde, con sólo warnings `NG8113`
preexistentes no relacionados) dada la revisión de código ya exhaustiva.

**Veredicto: ✅ Aprobado.** D-11 completo (esquema, backend, frontend). Sigue D11-04 — retomar
T-12 de la otra orquestación.

### Detalle — D11-04 (aprobado)

Leí los 6 archivos completos, no sólo lo pegado en el reporte. `TaskJustificationState.cs` con los
3 valores exactos del prompt y `[Display(Name = ...)]` en español. `TaskJustification.cs` coincide
carácter por carácter con la entidad propuesta: `[Index(nameof(TasksId), nameof(State))]`,
`Reason` con `[MinLength(20)] [MaxLength(1000)]`, `ApprovedByUserId`/`ResolvedAt` nulables,
`State` con default `Solicitada`. Sin ninguna restricción a nivel de base de datos que compare
`ApprovedByUserId` contra `RequestedByUserId` — correcto, esa es `RN-ALT-004` y queda para D11-05.

`ApplicationDbContext.cs:477` agrega el `DbSet` junto a `TaskChecklistItem`, mismo patrón.
`SelectItemEnumEndPoints.cs:81` registra `Map<TaskJustificationState>("task-justification-state",
"EnumSelectItem_GetTaskJustificationState", ...)`, ubicado correctamente en el bloque alfabético
de la "T". La migración `20260822025730_TaskJustification` es 100% aditiva (`CreateTable` + 3
índices), `Down()` sólo hace `DropTable`. La FK a tareas usa `principalTable: "Task"` (singular),
siguiendo el hallazgo ya cerrado de T-07/T-08 — el ejecutor no se desvió. Verifiqué el snapshot en
las dos ubicaciones (definición de entidad y relaciones): coincide exactamente con la migración,
sin huecos.

**Verifiqué el alcance por timestamps, no sólo por `git status`** (el repo de `api/` tiene
decenas de archivos sin comitear de tickets previos ya aprobados, así que `git diff` contra HEAD no
sirve para aislar este ticket): los 6 archivos declarados se modificaron entre 20:56 y 21:02 del
2026-08-21; `TaskAppService.cs`, `TaskEscalationService.cs`, `TaskAlertEngineService.cs` y
`Program.cs` conservan su timestamp de tickets anteriores, sin tocar en esta corrida.

**Verificación independiente, no acepté el reporte sin más:**
- `dotnet build LuxuryApp.sln` normal falló por el mismo bloqueo de archivos que reportó el
  ejecutor (proceso `LuxuryApp.Api` corriendo) — confirmado que es bloqueo de archivos, no error de
  compilación. Repetí con `-o` a una carpeta temporal aislada: **0 errores**, coincide.
- `node scripts/audit-conventions.mjs`: sigue en **10** errores preexistentes, sin regresión.
- `node scripts/scan-mojibake.mjs api`: **14** ocurrencias, todas en archivos ajenos a este ticket
  (BOM en `EmployeeDocument`, migraciones de `CandidateV3/V4`, `Ticket6InterviewDateTimeSplit`,
  `TaskChecklistItemAndAttachmentRepoint`, `OrgHierarchyRoleBased`, `InitialLuxuryAppLogs`) — cero
  en los 6 archivos de D11-04, coincide con el reporte de que bajó de 17 a 14 tras quitar el BOM.

**Veredicto: ✅ Aprobado, sin corrección.** Sigue D11-05 (servicio `ITaskJustificationService` +
endpoints).

### Detalle — D11-05 (aprobado)

Leí los 8 archivos completos (servicio, interfaz, endpoints, 2 DTOs, mapper, línea de DI, tests).
El orden de validación de `ResolveAsync` (compartido por `ApproveAsync`/`RejectAsync`) coincide
exactamente con el prompt: 404 si no existe → 400 si ya se resolvió → 403 `RN-ALT-004` (el propio
solicitante nunca puede resolver la suya, **sin excepción para admin**, verifiqué que el chequeo de
auto-aprobación corre antes que `CanManageAnyCustomer()`, no después) → 403 si no es jefe ni admin.
`IsBossOfRequesterAsync` implementa la cadena tal como se pidió: rol del solicitante vía
`dbContext.UserRoles` (nunca `ICurrentUserService`, porque no es el usuario autenticado),
`RN-ALT-054` respetada — si el solicitante tiene 0 o más de un rol, no usa `.First()`/`.Single()`
ciego, cuenta con `requesterRoleIds.Count != 1`, registra `logger.LogWarning` y devuelve `false`
en vez de lanzar excepción; `OrgHierarchy` filtrado por `CustomerId + ChildRoleId + IsActive`;
comparación final contra `currentUserService.RoleId` (claims, sin consulta extra), exactamente
como especificaba el prompt.

Los 9 tests cubren los 9 casos pedidos, incluido el más importante (`RN-ALT-004`: el propio
solicitante intenta aprobar, verifica que el `State` persistido **no cambió**, no sólo la
respuesta) y el de la anomalía de dos roles — con un plus no pedido explícitamente: ese mismo test
verifica que, tras fallar la resolución por jefe, un admin (`Direccion`) sí puede resolverla,
demostrando el único camino de salida que el prompt preveía para ese caso.

**Decisión propia del ejecutor, razonable y declarada:** agregó una guarda de `CustomerId` en
`GetByTaskIdAsync` (`ValidateTaskCustomerAccessAsync`) para que no cualquier usuario autenticado
pueda leer justificaciones de una tarea de otro cliente por `tasksId` — el prompt no la pedía
explícitamente pero es el mismo patrón ya usado en `TaskChecklistAppService.ValidateTaskAccess`.
**Hallazgo menor, no bloqueante:** esa guarda no tiene test dedicado entre los 9 (ninguno ejercita
`GetByTaskIdAsync` con un `CustomerId` distinto al de la tarea). Riesgo bajo — es el mismo patrón
ya probado en otros servicios del módulo — no amerita ticket de corrección, sólo queda anotado.

**Verifiqué el alcance por timestamps** (mismo motivo que en D11-04: `git diff` no aísla nada en
este repo con tantos tickets sin comitear): los 8 archivos se tocaron entre 21:22 y 21:30 del
2026-08-21; `TaskAlertEngineService.cs`, `TaskEscalationService.cs`, `TaskAppService.cs` y
`Program.cs` conservan su timestamp de tickets anteriores.

**Verificación independiente, no acepté el reporte sin más:**
- `dotnet build LuxuryApp.sln -o .tmp-audit-build` (carpeta aislada, evita el mismo bloqueo de
  archivos que reportó el ejecutor): **0 errores**.
- `dotnet test LuxuryApp.sln --filter TaskJustificationAppServiceTests` contra ese build: **9/9
  pasan**, coincide con lo reportado.
- `node scripts/audit-conventions.mjs`: sigue en **10**, sin regresión.
- `node scripts/scan-mojibake.mjs` sobre las 2 carpetas tocadas (7 archivos): **cero** mojibake.

**Veredicto: ✅ Aprobado, sin corrección.** Sigue D11-06 — integración con el motor
(`RN-ALT-013`: una justificación `Aprobada` saca la tarea del ciclo de alertas/escalación).

### Detalle — D11-06 (aprobado)

**Desviación real respecto al prompt, y correcta.** Mi prompt sugería agregar el filtro
directamente a la consulta base (`.Where(x => !dbContext.TaskJustification.Any(...))`), pero mis
propios criterios de test (punto 1) exigían que `TasksEvaluated` **siguiera contando** la tarea
con justificación aprobada — contradicción mía: `TasksEvaluated = tasks.Count` se fija justo
después de cargar la lista, así que filtrarla en la consulta base la habría sacado también de ese
conteo. El ejecutor detectó la contradicción, la declaró explícitamente en su reporte ("no puse el
filtro en la consulta base, porque el propio prompt pedía que `TasksEvaluated` siguiera contando")
y resolvió con `HasApprovedJustificationAsync(task.Id)` como primer `if` dentro del `try` del
bucle, antes de cualquier otra lógica — en ambos archivos, mismo helper línea por línea
(`dbContext.TaskJustification.AsNoTracking().AnyAsync(x => x.TasksId == taskId && x.State ==
TaskJustificationState.Aprobada)`, sin `Include`). Correcto: sigue el criterio de PASO real (mis
tests) por encima de mi sugerencia de implementación literal, mismo tipo de buen juicio que ya se
vio en T-04 (discrepancia "seis rutas") y T-13d.

En `TaskEscalationService`, verifiqué que el `continue` por justificación aprobada ocurre **antes**
de `ProcessIncumplimientoOrArrastreAsync` — por eso `BreachedAt` nunca se marca para esas tareas
(confirmado también por el test 5, que lo verifica directamente contra el `DbContext`, no sólo por
el resultado agregado).

Los 5 tests declarados están, con nombres descriptivos que igualan exactamente los 5 casos
pedidos (`WhenOverdueTaskHasApprovedJustification_DoesNotSendAlert`,
`WhenOverdueTaskHasRejectedJustification_SendsVencida`,
`WhenOverdueTaskHasPendingJustification_SendsVencida`,
`WhenThreeDaysOverdueTaskHasApprovedJustification_DoesNotEscalate`,
`WhenFiveDaysOverdueTaskHasApprovedJustification_DoesNotMarkBreach`), con aserciones adicionales
no pedidas explícitamente pero útiles (`LastAlertAt` nulo, `notificationMock` nunca invocado) que
refuerzan la garantía real, no sólo el conteo.

**Verifiqué el alcance por timestamps**: los 4 archivos declarados se tocaron entre 21:37 y 21:40
del 2026-08-21; `TaskAppService.cs`, `Program.cs` y el servicio de D11-05 conservan su timestamp
anterior, sin tocar.

**Verificación independiente, no acepté el reporte sin más:**
- `dotnet build LuxuryApp.sln -o .tmp-audit-build`: **0 errores**.
- `dotnet test LuxuryApp.sln --filter "TaskAlertEngineServiceTests|TaskEscalationServiceTests"`:
  **22/22 pasan** (17 preexistentes + 5 nuevos), coincide con lo reportado.
- `node scripts/audit-conventions.mjs`: sigue en **10**, sin regresión.
- `node scripts/scan-mojibake.mjs` sobre los 4 directorios tocados (6 archivos): **cero**.

**Veredicto: ✅ Aprobado, sin corrección.** D-11 core (esquema, servicio, integración con el
motor) completo. Sigue D11-07 — frontend `task-justification-modal`.

### Detalle — D11-07 (aprobado)

Leí los 7 archivos completos. El panel sigue el molde de `TaskChecklistPanel` línea por línea
(misma estructura de signals, `ngOnInit` con `Promise.all`, `ChangeDetectionStrategy.Eager`,
mismas clases `surface-card`/`surface-ground`/`il-button`, tokens `var(--ds-radius-md)` /
`var(--surface-border)` en vez de valores hardcodeados). Confirmé el detalle que más me preocupaba
al escribir el prompt: `state` llega como número (`0/1/2`) y el componente **no** lo hardcodea a
texto en ningún punto — `stateLabel()` resuelve siempre contra el `Map` construido desde
`onGetEnumSelectItem(Endpoints.SelectItems.taskJustificationState)`, y la única comparación por
número (`TASK_JUSTIFICATION_STATE.Solicitada`) es para lógica interna, no para lo que ve el
usuario — exactamente la distinción que pedía el prompt.

Verifiqué el cumplimiento de `RN-ALT-004` en la interfaz: el `@if` de los botones "Aprobar"/
"Rechazar" en `task-justification-panel.html:43-46` exige `j.requestedByUserId !==
authS.applicationUserId`, y el test 6 lo prueba explícitamente. No se implementó ninguna
resolución de "quién es el jefe" en el cliente — los botones se ofrecen a cualquier tercero, tal
como pedía el prompt, dejando la autorización real al 403 del servidor (D11-05).

`Endpoints.TaskJustifications` (`operations.endpoints.ts:110-115`) y
`Endpoints.SelectItems.taskJustificationState` (`select-item.endpoints.ts:49`) coinciden
carácter por carácter con las rutas reales del backend verificadas en D11-05/D11-04. La
integración en `task-view.html:184-187`/`task-view.ts` es puntual: import + entrada en `imports`
+ una etiqueta nueva con los dos `Input` correctos (`t.id`, `t.assigneeId` — confirmé que
`assigneeId` es un campo real de `TasksViewDTO.cs:53`, no inventado).

**Verifiqué la afirmación del reporte sobre `task-view.spec.ts`, no la acepté sin más:** corrí ese
archivo de forma independiente — falla exactamente como describió (`goBack` espera
`["/Tasks/messages","group-1"]`, la app navega a `["/tickets","messages","group-1"]"`), y los
otros 3 tests del archivo pasan. Confirmé por timestamps que es un problema preexistente y ajeno
a este ticket: `route-paths.ts` cambió el 2026-08-21 16:53 (antes de que D11-07 empezara a las
21:54) y `task-view.spec.ts` no se toca desde 2026-07-24 — la ruta cambió en algún ticket anterior
sin que nadie actualizara este test. No es una regresión de D11-07. No amerita ticket de
corrección dentro de esta orquestación (es deuda de otro módulo/ruteo), pero queda anotado.

**Verificación independiente, no acepté el reporte sin más:**
- `npx vitest run task-justification-panel.spec.ts --config vitest.cobranza-nativa.config.ts`:
  **6/6 pasan**, coincide con lo reportado.
- `node scripts/scan-mojibake.mjs` sobre los 6 archivos tocados: **cero**.
- No repetí `npm run build` completo — la revisión de código fue exhaustiva (los 7 archivos
  íntegros) y no hay cambios de tipado ambiguos que un build hubiera detectado y la lectura no.

**Veredicto: ✅ Aprobado, sin corrección.** Con esto, D-11 completo (esquema, backend, frontend
del organigrama por rol) y la retoma de T-12 (D11-04 a D11-07, justificación con aprobación del
jefe) quedan cerrados. No quedan tickets abiertos en esta orquestación.
