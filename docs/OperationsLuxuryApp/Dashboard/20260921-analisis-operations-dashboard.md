# Reconocimiento de Estructura — Módulo Dashboard (OperationsLuxuryApp)

> **Tipo de documento:** análisis (PASO 0.5 — Reconocimiento de Estructura de Entidades, skill `planeacion-modulos`)
> **Fecha:** 2026-09-21
> **Origen del trabajo:** `D:\repos\luxuryapp-api\prompt.md` (especificación "Dashboard LuxuryApp" — transformar el dashboard actual de listados a un tablero con KPIs y gráficos)
> **Tipo de tarea:** B — Ampliación de módulo existente
> **Rutas de trabajo**
> - Backend: `api/LuxuryApp.Application/Modules/OperationsLuxuryApp/Dashboard/`
> - Frontend: `appsweb/angular/src/app/modules/operations.luxuryapp/dashboard/`
> **Objetivo en una frase:** transformar el Dashboard actual (tabla de "pendientes" agregados de 14 fuentes distintas) en un tablero con KPIs numéricos y gráficos, con acceso diferenciado por rol.

> ⚠️ Este documento es puramente descriptivo de lo que existe hoy. No propone cambios ni decisiones de diseño — eso corresponde a los pasos 1-4 (Discovery, FASE 0, Riesgos, Plan).

---

## 0. Discrepancia de rutas detectada (corregir antes de continuar)

Existen **tres versiones distintas** de dónde viven las entidades del sistema:

| Fuente | Ruta declarada |
|---|---|
| Prompt/contexto de la tarea | `api/LuxuryApp.Infrastructure.Data/Data/Entities/{System\|Tenant}/...` |
| `conventions/CONVENTIONS.md:117` | `api/LuxuryApp.Application/Modules/[Modulo]/Domain/Entities/` |
| **Real, verificado en disco** | `api/LuxuryApp.Application/Infrastructure/Data/Entities/[Modulo]LuxuryApp/[Submodulo]/` |

No existe proyecto `LuxuryApp.Infrastructure.Data` en el repo, ni carpeta `Domain/Entities` dentro de `Modules/*`. Todas las rutas de este documento usan la ruta **real**. Se recomienda que Tech Lead actualice `CONVENTIONS.md §1️⃣` cuando corresponda; no se toca aquí porque está fuera del alcance de esta ampliación.

También existe `api/.kilo/worktrees/nebulous-crane/.../Dashboard` — es un worktree de otro agente, no el árbol activo. Se ignoró.

---

## 1. Backend Dashboard actual

Ruta: `api/LuxuryApp.Application/Modules/OperationsLuxuryApp/Dashboard/` — **5 archivos, 5 revisados (100%)**.

| Archivo | Tipo | Propósito |
|---|---|---|
| `README.md` | Doc | Describe 4 endpoints (última actualización 2026-06-25) |
| `Interfaces/IDashboardAppService.cs` | Interfaz | `GetFiltroMinutasAreaAsync`, `GetGlobalPendingItemsAsync` |
| `Services/DashboardAppService.cs` (597 líneas) | AppService | Lógica central — ver detalle abajo |
| `DTOs/DashboardAnalysisDTO.cs` | DTO | `Context`, `Tone` (default "Ejecutivo"), `CustomerId` — input del resumen IA |
| `EndPoints/DashboardEndpoints.cs` | Minimal API | 4 rutas bajo `api/dashboard` |

**Endpoints reales:**
- `POST api/dashboard/send-executive-report/{customerId}`
- `GET api/dashboard/filtro-minutas-area/{meetingId}/{areaMinutasDetalles}/{estatus?}`
- `GET api/dashboard/global-pending-items/{customerId}` — endpoint principal, consumido por el frontend
- `POST api/dashboard/analyze` — resumen ejecutivo vía IA, cacheado 20 min en `IMemoryCache`

**`GetGlobalPendingItemsAsync(customerId)`** agrega, según el rol del usuario (`currentUserService.UserRole`), hasta 14 fuentes distintas en una lista unificada `List<PendingItemDTO>`:

1. Roles restringidos (técnicos, seguridad, jardinería, etc.) → solo `Tasks` propios (`Module = "Tickets"`), corta el método.
2. Roles Legal → minutas de área Legal + `Tasks` de `WorkGroup.IsLegalGroup` (`Module = "Legal"`), corta el método.
3. Rol Contador → minutas de área Contable, corta el método.
4. Órdenes de Servicio (`ServiceOrders`, `Status Pendiente/Proceso`, `Machinery.State Activo`) — roles gerenciales/mantenimiento. `Module = "Mantenimiento"`.
5. Tickets (`Tasks`, `Status != Completed`) — todos ven algo, solo roles de alto acceso ven todos. `Module = "Tickets"`.
6. "Mis Tickets" — duplicado de (5) filtrado siempre por `AssigneeId`.
7. Minutas (`MeetingAgendas`, `Pendiente/Proceso`). `Module = "Minutas"`.
8. Minutas por área según rol.
9. Tickets Legales/Admin (`Tasks` de `WorkGroup.IsLegalGroup`).
10. Contratos por vencer (`InsurancePolicies`, `EndDate <= hoy+45d`). `Module = "Polizas"`.
11-14. Reclutamiento: Bajas, Altas, Vacantes, Modificaciones Salariales.

Cada `PendingItemDTO`: `Id, Module, Title, Description, Status, Date, FormattedDate, Responsible, UrlRoute, Priority, Metadata, LastFollowup, LastFollowupDate`.

**Conclusión clave:** no existe entidad "Ticket" — lo que el negocio llama "tickets" es `TaskRecord` (tabla `Tasks`) agrupado por `WorkGroup`.

También existe un módulo hermano **`ManagementDashboard`** (mismo padre `OperationsLuxuryApp`) con submódulos independientes (`AbsentStaff`, `LegalContracts`, `LegalTasks`, `RecruitmentSummary`, `WeeklyAgenda`, 36 archivos) — confirmada su existencia y estructura estándar, no leído en detalle porque no es el foco de esta ampliación.

---

## 2. Frontend Dashboard actual

Ruta: `appsweb/angular/src/app/modules/operations.luxuryapp/dashboard/` — **12 archivos, 12 revisados** (8 con lectura completa, 4 `.spec.ts` solo listados).

| Archivo | Componente | Rol |
|---|---|---|
| `container-dashboard.ts/.html` | `ContainerDashboard` | Selector raíz: rol `Condomino`/`Comite` → `MiEdificio`; resto → `DashboardPendingItems` |
| `dashboard-pending-items.ts` | `DashboardPendingItems` | Calcula módulos visibles por rol (`showMinutes`, `showTickets`, `showMaintenance`, `showLegal`, `showRecruitment`, `showLegalStatus`, `showPolicies`) |
| `unified-pending-dashboard.ts/.html` | `UnifiedPendingDashboard` | Vista desktop (tabla `AppTable`). Consume `Endpoints.Dashboard.globalPendingItems(customerId)`. Calcula `daysOpen` client-side (días naturales, no hábiles). Botones "Generar reporte diario" (IA) y "Enviar reporte ejecutivo" |
| `unified-pending-dashboard-mobile.ts/.html` | `UnifiedPendingDashboardMobile` | Misma fuente agrupada por módulo, iconos Ionicons |
| `interfaces/pending-item.dto.ts` | Interfaz TS | Espejo del DTO backend |
| `*.spec.ts` (4) | Tests | Existen, no se auditó cobertura |

**No existen componentes de gráficos en el Dashboard actual** — es 100% tabular. No hay KPIs numéricos, tendencias ni métricas de SLA en la UI.

---

## 3. Roles reales vs. los 5 propuestos en la especificación

Ruta: `api/LuxuryApp.Application/Modules/AdminLuxuryApp/SecurityPermissions/Access/ApplicationRole/Services/ApplicationRoleAppService.cs`, método `CreateRoles()` (líneas 125-285) — sincroniza **43 roles reales**, agrupados en Dirección/Sistema, Corporativos, Operativos/staff, Clientes, Proveedores/contratistas.

**⚠️ Verificación crítica — ninguno de los 5 roles de la especificación existe literalmente:**

| Rol propuesto | ¿Existe? | Rol real más cercano |
|---|---|---|
| `AdminLuxuryApp` | ❌ NO | `SuperUsuario` (System) o `Administrador` (Staff) |
| `OperationsManager` | ❌ NO | `GerenteOperaciones` |
| `FinanceManager` | ❌ NO | `Contador` o `Cobranza` (no hay rol "gerente" de finanzas) |
| `SupportTeam` | ❌ NO | Sin equivalente claro — más cercano: `Sistemas`, `Recepcionista`, `SupervisionOperativa`, o el grupo de "roles restringidos" que hoy solo ven sus propios tickets |
| `Executive` | ❌ NO (como nombre) | Existe `RoleType.Executive` como **categoría**, asignada solo al rol `Direccion` |

**Implicación:** la especificación de roles es aspiracional. Se requiere decisión explícita: (a) mapear los 5 conceptos a roles reales existentes, o (b) dar de alta roles nuevos en el array `rolesConfig` de `CreateRoles()`. Importante: `RemoveUnwantedRoles()` (línea 290) **elimina automáticamente** cualquier rol que no esté en ese array — un rol creado fuera de él se borraría en la siguiente sincronización.

La autorización del Dashboard actual está hardcodeada con listas de `ApplicationRoleEnum` dispersas dentro de `DashboardAppService.cs`, no vía esquema de permisos declarativo.

---

## 4. Entidades de "operaciones pendientes"

Ruta real: `api/LuxuryApp.Application/Infrastructure/Data/Entities/OperationsLuxuryApp/` (26 subcarpetas; 4 revisadas en detalle).

- **`ServiceOrders/ServiceOrder.cs`** (`DbSet` confirmado) — orden de servicio de mantenimiento. Campos: `RequestDate`, `ExecutionDate?` (→ tiempo de resolución = diferencia), `Status`, `Price` (único campo monetario a nivel de operación individual en todo Operations), flags de calidad.
- **`Task/TaskRecords/Tasks.cs`** (clase `TaskRecord`, tabla `Tasks`) — es la entidad "ticket" real (modelo tipo Gantt). Campos relevantes: `CreatedAt`, `ClosedDate`, `PlannedStartDate/EndDate` vs `ActualStartDate/EndDate`, **`BreachedAt`/`BreachedDay`** (tolerancia de 5 días hardcodeada — el embrión más cercano a "SLA" que existe), `LastAlertAt`, `Status` (`GanttStatus`), `Priority`. Comentarios en código (`MigratedFromTicketId`, `TODO: Eliminar en Fase 6`) confirman que hubo una entidad "Ticket" independiente, migrada/fusionada dentro de `Tasks`.
- **`WorkGroups/WorkGroup.cs`** — agrupador de tareas (cola/categoría), con `IsLegalGroup`.
- **`AdministrativeIncidents/`** (7 archivos) — incidentes/sanciones de personal, no service-desk al cliente (solo listado, no leído en detalle).

Conteo: 26 subcarpetas encontradas, 4 con contenido revisado.

---

## 5. Entidades de tickets/soporte/SLA — GAP CONFIRMADO

Búsqueda (`*ticket*`, `*sla*`, `*support*`) en todo `Entities/`: 3 falsos positivos, ninguno de service-desk al cliente:
- `AccountingLuxuryApp/BudgetProposals/BudgetProposalItemSupportFile.cs`
- `OperationsLuxuryApp/MonthlyMeetings/Assemblies/AssemblySupportRequest.cs`
- `OperationsLuxuryApp/Providers/PersonProviderSupport.cs`

**No existe ninguna entidad `Ticket`, `SupportTicket`, `SLA` o `ServiceLevelAgreement`.** El concepto de "ticket" fue absorbido dentro de `TaskRecord` (evidencia explícita en el propio código: `MigratedFromTicketId`, comentario "CAMPOS LEGALES (MIGRACIÓN DESDE TICKET)").

Esto confirma que las métricas de "Tickets abiertos/cerrados" y "SLA cumplidos vs. incumplidos" pedidas en la especificación **no tienen hoy una entidad dedicada de soporte que las respalde**. Lo que existe hoy:
- `TaskRecord.Status` (`GanttStatus`) → cubre parcialmente abiertos/cerrados si se reinterpreta `Tasks` como "tickets".
- `TaskRecord.BreachedAt/BreachedDay` → único rastro de incumplimiento de plazo, con tolerancia de 5 días **hardcodeada**, no configurable por tipo/prioridad/cliente.

---

## 6. Entidades financieras (ingresos/costos/margen por operación)

Ruta real: `api/LuxuryApp.Application/Infrastructure/Data/Entities/AccountingLuxuryApp/` (25 archivos, todos listados por nombre, no leídos campo-por-campo):

- `AccountingCatalogs/` — catálogo contable general.
- `AccountingOnline/` (10 archivos) — espejo/sincronización del sistema externo Aspel COI, contabilidad general de la empresa, no ligada a operaciones individuales.
- `Budget/`, `BudgetProposals/` — presupuesto y propuestas de gasto con flujo de aprobación.
- `FinancialAccounting/` (7 archivos) — reportes financieros y libro mayor a nivel de tenant/cliente.
- `Fundings/Funding.cs` — financiamiento, no ligado a operación individual.

**GAP confirmado:** no existe ninguna entidad que registre ingreso, costo o margen a nivel de una operación/ticket individual. El único campo monetario ligado a una operación puntual es `ServiceOrder.Price` (es un costo, no hay ingreso ni margen). No hay vínculo estructural entre Accounting y Operations a nivel granular (podría existir en `CollectionsLuxuryApp`, no explorado en esta pasada).

---

## 7. Librerías de gráficos ya instaladas en frontend

`appsweb/angular/package.json`: `chart.js ^4.5.1` + `ng2-charts ^8.0.0` (wrapper Angular de Chart.js). No hay `ngx-charts`, `d3` standalone, `ApexCharts`, `ag-charts` ni `highcharts`.

**Ya existe un catálogo de componentes de gráficos reutilizables** en `appsweb/angular/src/app/shared/ui/web/charts/` (14 archivos, motor Chart.js confirmado):
- `chart-wrapper.ts` — envoltorio genérico `<app-chart-wrapper>` (`bar|line|area|pie|doughnut|radar|polarArea`), usa tokens de diseño `--ds-*`.
- `chart-adapters.ts` — adaptadores de datos crudos → formato Chart.js con theming.
- `pie-chart.ts`, `advanced-pie-chart.ts`, `custom-bar-chart.ts`, `multi-axis-chart.ts`, `radar-chart.ts` — componentes especializados ya construidos.
- Catálogo de demostración: `modules/admin.luxuryapp/infrastructure/catalog-component-ui/charts/catalog-charts/`.
- `core/services/chart-generator.service.ts` — servicio auxiliar (no leído en detalle).

**Conclusión: no se requiere instalar ninguna librería nueva de gráficos.** La ampliación debe reutilizar `<app-chart-wrapper>` + adaptadores existentes (regla madre "no duplicar").

---

## 8. `IBusinessTimeService` — confirmado NO activo

Ruta: `api/LuxuryApp.Application/Shared/Time/IBusinessTimeService.cs` — archivo completo (43 líneas) comentado en su totalidad. No hay implementación, no hay registro en DI, no hay referencias activas en `LuxuryApp.Application`.

**Implicación:** cualquier "tiempo de resolución" o "SLA en días hábiles" (que requeriría excluir fines de semana/festivos y usar zona horaria de tenant) no tiene hoy servicio centralizado. Los cálculos actuales son ad-hoc y en días naturales:
- Backend: `DashboardAppService.ToDateTime(DateOnly)` es un helper trivial.
- Frontend: `UnifiedPendingDashboard.getDaysSinceFollowup()` y `daysOpen` usan `new Date()` y diferencia de milisegundos directa, sin zona horaria de tenant.
- `TaskRecord.BreachedAt` tampoco usa `IBusinessTimeService`.

---

## Resumen de cobertura de la investigación

| Área | Archivos encontrados | Revisados en detalle |
|---|---|---|
| Backend Dashboard | 5 | 5 (100%) |
| Backend ManagementDashboard (hermano) | 36 | 0 contenido (solo estructura) |
| Frontend Dashboard | 12 | 8 completos + 4 `.spec.ts` listados |
| `ApplicationRoleAppService.cs` | 1 | 1 (100%, `CreateRoles()` transcrito) |
| Entidades `OperationsLuxuryApp/` | 26 subcarpetas | 4 con contenido leído |
| Entidades `AccountingLuxuryApp/` | 25 archivos | listado completo, 0 leídos campo-por-campo |
| Búsqueda ticket/SLA/support | 3 falsos positivos | 3 (confirmado que no aplican) |
| Charts frontend | 14 archivos + 1 servicio | 1 en detalle, resto confirmado por nombre |
| `IBusinessTimeService` | 1 | 1 (100%, confirmado comentado) |

## Decisiones pendientes antes de continuar a Discovery (PASO 1)

1. **Roles**: mapear los 5 conceptos de la especificación a roles reales, o dar de alta roles nuevos en `rolesConfig`.
2. **Tickets/SLA**: decidir si se reinterpreta `TaskRecord` como "ticket" (sin nueva entidad) o se modela un catálogo de SLA configurable — hoy la tolerancia de 5 días está hardcodeada.
3. **Financiero por operación**: no existe hoy ingreso/margen a nivel de operación individual — decidir si el alcance de esta ampliación incluye construir esa estructura desde cero (impacto alto) o si los KPIs financieros del Dashboard se alimentan de reportes agregados existentes (`FinancialAccounting`) en vez de por-operación.
4. **`IBusinessTimeService`**: decidir si se activa (día hábil, zona horaria de tenant) para el KPI de "tiempo de resolución", o si se mantiene el cálculo ad-hoc actual (días naturales).
5. **Librería de gráficos**: confirmado — reutilizar Chart.js/ng2-charts + `shared/ui/web/charts`, no instalar nada nuevo.
