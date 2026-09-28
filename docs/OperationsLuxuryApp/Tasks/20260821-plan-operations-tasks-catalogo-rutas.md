# Catálogo de rutas Angular — Tareas Recurrentes, Ticket/Tasks y Organigrama por rol

**Fecha:** 2026-08-21 · Cubre las dos orquestaciones cerradas hoy:
`20260820-alertas-tareas-recurrentes-orquestacion.md` y
`20260821-d11-organigrama-roles-orquestacion.md`.

Todas las rutas verificadas leyendo `client/angular/src/app/routing/pages.routes.ts` y los
archivos de ruteo hijos (`tickets.routing.ts`, `recurring-tasks.routing.ts`,
`directory.routing.ts`) y `client/angular/src/app/routing/route-whitelist.ts` — no son rutas
supuestas.

---

## 1. Ticket / Tasks (`/tickets`, `/Tasks`, `/tasks` — alias, mismo archivo)

`pages.routes.ts` monta el mismo `ticketsRoutes` (`tickets.routing.ts`) bajo **tres** prefijos
distintos (`tickets`, `Tasks`, `tasks`) — es deuda de ruteo legado documentada en el propio
archivo ("no se ha definido una ruta principal"), no un error de este catálogo. Usa `/tickets/...`
como referencia; los otros dos funcionan igual.

| Ruta completa | Componente | Qué hace |
| --- | --- | --- |
| `/tickets/groups-list` | `TaskGroupList` | Alta/edición de grupos de trabajo (`WorkGroup`) y sus administradores |
| `/tickets/my-assignments` | `MyAssignedTasksList` | Tareas asignadas al usuario en sesión |
| `/tickets/my-requests` | `MyRequestsTask` | Tareas que el usuario en sesión solicitó |
| `/tickets/messages/:ticketGroupId` | `TaskList` | Listado de tareas de un grupo |
| `/tickets/pending-board/:ticketGroupId` | `TaskPendingBoard` | Tablero de pendientes del grupo |
| **`/tickets/message/:ticketMessageId/:ticketGroupId`** | **`TaskView`** | **Detalle de una tarea. Aquí viven los 3 paneles nuevos de esta orquestación** (ver §1.1) |
| `/tickets/reports` | `TaskReport` | Reportes generales de tickets |
| `/tickets/summary` | `TaskMessageReportResumen` | Resumen de tickets |
| `/tickets/work-plan` | `TaskReportWorkPlan` | Plan de trabajo |
| `/tickets/work-plan-preview` | `TaskReportWorkPlanPreview` | Vista previa del plan de trabajo |
| `/tickets/weekly-report` | `TaskMessageOperationReport` | Reporte semanal operativo |
| `/tickets/weekly-report-preview` | `TaskWeeklyReportPreview` | Vista previa del reporte semanal |
| `/tickets/legal` | `TicketLegalListaCliente` | Tickets legales por cliente |
| `/tickets/legal/:ticketGroupId` | `TaskList` (reusado) | Listado de tickets legales de un grupo |

Todas whitelisteadas en `route-whitelist.ts:253-265`.

### 1.1 Qué se agregó dentro de `TaskView` en esta orquestación

`TaskView` carga la tarea con `Endpoints.Tasks.view(id)` (`TaskAppService.GetByIdTaskViewDTO`,
motor **nuevo** — la entidad `Tasks`, no la legada `TaskInstance`). Dentro de
`task-view.html:184-187`, en este orden:

1. **`<app-task-checklist-panel [tasksId]="t.id" />`** (T-13e) — checklist de pasos + comprobantes
   (`TaskChecklistItem`, `TaskAttachment`). Bloquea el cierre si falta algo y la plantilla exige
   comprobante (`RN-ALT-034`, `TaskAppService.CloseTaskAsync`).
2. **`<app-task-justification-panel [tasksId]="t.id" [assigneeId]="t.assigneeId" />`** (D11-07,
   hoy) — historial de justificaciones, formulario de solicitud para el responsable, botones de
   aprobar/rechazar para cualquier tercero que no sea el propio solicitante (el servidor valida
   quién es realmente el jefe vía `OrgHierarchy`, D11-05; el cliente no repite esa lógica).

No hay ruta propia para estos paneles — no son pantallas, son secciones embebidas del detalle de
tarea. Para probarlos, entra a cualquier tarea real por `/tickets/message/:id/:groupId`.

---

## 2. Tareas Recurrentes (`/recurring-tasks`)

⚠️ **Convive un motor legado (a retirar en T-15) con el motor nuevo.** No es evidente desde el
menú — lo confirmé leyendo qué interfaz/entidad consume cada componente.

| Ruta completa | Componente | Motor | Qué hace |
| --- | --- | :-: | --- |
| `/recurring-tasks` | `TaskTemplateList` | 🔴 Legado (`TaskTemplate`) | Catálogo de plantillas del motor viejo — candidato a retiro en T-15 |
| `/recurring-tasks/:id/items` | `TaskTemplateItems` | 🔴 Legado (`TaskTemplate`) | Items de una plantilla legada |
| `/recurring-tasks/customer-config` | `CustomerConfig` | 🔴 Legado (`CustomerTaskItemConfig`) | Configuración de items por cliente, motor viejo |
| `/recurring-tasks/my-tasks` | `DailyTaskList` | 🔴 Legado (`TaskInstance`) | "Mis tareas diarias" del motor viejo |
| `/recurring-tasks/compliance` | `RecurringTaskComplianceDashboard` | 🟢 **Nuevo** (`Tasks`, T-14b) | Tablero de cumplimiento: conteos por grupo/área/persona, K5 de comprobante en críticas |

Whitelisteadas: `/recurring-tasks`, `/recurring-tasks/customer-config`,
`/recurring-tasks/compliance`, `/recurring-tasks/my-tasks` (`route-whitelist.ts:309-312`).
`/recurring-tasks/:id/items` no aparece explícita — es una ruta con parámetro, no necesariamente
cubierta por el whitelist estático (no lo confirmé más a fondo, fuera del alcance de este catálogo).

### 2.1 Componente sin ruta — no accesible desde la navegación real

**El catálogo del motor nuevo (T-06: `recurring-task-catalog-list` +
`recurring-task-catalog-form`, en
`client/angular/src/app/apps/operations.luxuryapp/task-engine/recurring-tasks/catalog/`) no está
cableado a ningún archivo de ruteo.** Confirmé con `grep` sobre `client/angular/src/app/routing/`
— cero referencias a `recurring-task-catalog`. Fue una decisión explícita del ticket T-06
("sin cablear routing") y ningún ticket posterior lo conectó. Es la pantalla real donde se crean
las `RecurringTaskTemplate` del motor nuevo (con `Criticality`, `AdvanceNoticeDays`,
`BackupUserId`, `RecurrenceRule`) — sin una ruta, hoy sólo se puede ejercitar por test unitario
(`vitest`) o instanciando el componente a mano. Si vas a probar el flujo completo del motor nuevo
de punta a punta, esto es lo primero que te va a faltar — dímelo si quieres que te arme el ticket
de una línea para cablearla (un `path` más en `recurring-tasks.routing.ts`, mismo patrón que
`compliance`).

---

## 3. Organigrama (`/directory/work-position-org-chart`)

| Ruta completa | Componente | Qué hace |
| --- | --- | --- |
| `/directory/work-position-org-chart` | `OrgChart` | Árbol del organigrama **por rol** (D11-03): vista "ver" (`ngx-graph`, un nodo por rol con su roster de miembros) y vista "editar" (tabla plana, reasignar jefe de un rol vía drag-and-drop/selección). Consume `WorkPositionOrgChartAppService` (D11-02), rutas `GET work-position-org-chart/tree/{customerId}` y `PATCH work-position-org-chart/reassign/{customerId}` |

Whitelisteada en `route-whitelist.ts:119`. El título de menú sigue diciendo "Organigrama de
Puestos" (`directory.routing.ts:72-73`) — es un rótulo desactualizado tras D11-02/03 (ahora es por
rol, no por puesto); no afecta la función, sólo el texto que ve el usuario en el breadcrumb/menú.

---

## Resumen para pruebas

- **Justificación con aprobación del jefe (D11-04 a D11-07):** entra a cualquier tarea real por
  `/tickets/message/:ticketMessageId/:ticketGroupId` — el panel está siempre visible debajo del
  checklist.
- **Organigrama por rol (D-11):** `/directory/work-position-org-chart`.
- **Tablero de cumplimiento del motor nuevo:** `/recurring-tasks/compliance`.
- **Catálogo de plantillas del motor nuevo (T-06):** no tiene ruta todavía — ver §2.1.
- Todo lo demás bajo `/recurring-tasks` (excepto `/compliance`) es el motor **viejo**, pendiente de
  retiro en T-15 — no lo confundas con el nuevo al probar.
