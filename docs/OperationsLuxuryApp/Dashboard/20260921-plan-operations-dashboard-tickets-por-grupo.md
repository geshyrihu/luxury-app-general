# Fase 1.4 — Tickets por grupo de trabajo (tarjetas, datos reales)

Plan padre: `20260921-plan-operations-dashboard.md` · Catálogo maestro: `20260921-especificacion-operations-dashboard-kpis.md` (KPI-TK-01, KPI-TK-02/03). Modelo a imitar: Fase 1.3 (`20260921-plan-operations-dashboard-ordenes-mantenimiento.md`), ya aprobada y con las tarjetas validadas por el Tech Lead.

Objetivo: en `/dashboard/metrics`, una tarjeta por **grupo de trabajo** del cliente activo, con los tickets del **mes actual** (totales, pendientes, concluidas) y un cuarto indicador **"Pendientes pasados"**. Sin gráficos.

Regla de trabajo: el ejecutor solo hace lo que dice este documento. Si crees que hay una mejor manera, PARA y repórtalo. No afirmes lo que no hayas verificado. No modifiques los archivos pre-existentes del Dashboard (`DashboardAppService.cs`, `DashboardEndpoints.cs`, `IDashboardAppService.cs`, `unified-pending-dashboard*`, `container-dashboard*`, `dashboard-pending-items.ts`) ni el comportamiento de `GetOperationalMetricsAsync`/`GetMaintenanceOrdersByCategoryAsync`.

## Decisiones del Tech Lead (2026-09-21)

- **Periodo** igual que mantenimiento: mes actual + "pendientes pasados".
- **Estados** (`GanttStatus`): Pendientes = `NotStarted`, `InProgress`, `OnHold`, `Reopened`. Concluidas = `Completed` + `Cancelled`.
- **Roles que ven estas tarjetas** (regla inicial; se afinará más adelante con filtros más profundos): TODOS los roles `RoleType.Staff` (26) + los `RoleType.Contractor` (4: Jardineria, Limpieza, Seguridad, Proveedor) + `SuperUsuario`, `Direccion`, y de Corporate solo `GerenteMantenimiento` y `SupervisionOperativa`. Fuente de verdad de los tipos: `ApplicationRoleAppService.CreateRoles()` (`api/LuxuryApp.Application/Modules/AdminLuxuryApp/SecurityPermissions/Access/ApplicationRole/Services/ApplicationRoleAppService.cs`).
- **Legal tiene su propio tratamiento:** los grupos con `WorkGroup.IsLegalGroup == true` se EXCLUYEN de estas tarjetas.
- Cliente: el activo del header (`CustomerIdService`), igual que mantenimiento; sin selector propio.

## Hechos verificados en el código (léelos, no los asumas)

- "Ticket" = `TaskRecord` (tabla `Tasks`, `api/.../Infrastructure/Data/Entities/OperationsLuxuryApp/Task/TaskRecords/Tasks.cs`): `WorkGroupId` → `WorkGroup`, `CustomerId` (Guid?), `Status` (`GanttStatus`), `Priority`, `CreatedAt`, `ClosedDate`, `TaskType` (`GanttTaskType`), `IsRecurring`.
- Grupo = `WorkGroup` (tabla `TaskWorkGroups`): `CustomerId`, `Active`, `IsLegalGroup`, `Visibility`, y `WorkGroupCategories.Name` (tabla `WorkGroupCategories`, campos `Name`, `Code`, `Color`, `Emoji`, `Departament`). El nombre visible del grupo es `WorkGroupCategories.Name` (así lo muestra `SelectItemTicketGroupListAsync`).
- El dashboard actual acota los tickets con `t.WorkGroup.CustomerId == customerId`; el bloque de legales usa `t.CustomerId`.
- `GanttStatus`: NotStarted, InProgress, Completed, Reopened, Cancelled, OnHold.

## Reglas de negocio (nuevas)

- **RN-DASH-050** Universo: tickets de los `WorkGroup` del cliente activo con `Active == true` y `IsLegalGroup == false`. Se devuelve una entrada por cada grupo (aun con 0), con `WorkGroupId` y el nombre `WorkGroupCategories.Name`.
- **RN-DASH-051** Mes de medición = mes calendario (mes y año) de `Tasks.CreatedAt`; por defecto el mes actual; `Month`/`Year` opcionales solo para verificación.
- **RN-DASH-052** Pendientes = estados NotStarted/InProgress/OnHold/Reopened; Concluidas = Completed/Cancelled; **Total = Pendientes + Concluidas** (tickets creados en el mes). Todo del mes de medición.
- **RN-DASH-053** **Pendientes pasados** = tickets en estados pendientes con `CreatedAt` anterior al día 1 del mes de medición (todos los meses previos), mismo grupo y cliente.
- **RN-DASH-054** Roles y cliente: rol permitido = la lista de las decisiones de arriba; rol fuera de la lista => `BusinessException` 403; `CustomerId` obligatorio => `BusinessException` 400. NUNCA `UnauthorizedAccessException`/`ArgumentException` (el `GlobalExceptionMiddleware` los devuelve como 500).

## Puntos que el ejecutor DEBE verificar y reportar (no los resuelve por su cuenta)

- **P-1** Cliente de un ticket: `Tasks.CustomerId` (nullable) vs `WorkGroup.CustomerId`. Usa `WorkGroup.CustomerId` (como el dashboard actual) y reporta cuántos tickets de un cliente tienen `Tasks.CustomerId` distinto o nulo, para confirmar que no hay divergencia.
- **P-8** `TaskType` (`GanttTaskType`, valores por leer en `Shared/Enums`): confirma qué valores son "ticket" real y cuáles son hitos/resúmenes del Gantt. Revisa también qué cuenta la pantalla existente de Tickets. Si hay tipos que NO deben contarse, PARA y repórtalo con números; no adivines. También reporta si las tareas recurrentes (`IsRecurring`) inflan los conteos.
- **P-9** Volumen: reporta cuántos grupos activos no legales tiene La Jolla y Avivia y el total de tickets del mes por cliente.

## A. Backend

Archivos en `api/LuxuryApp.Application/Modules/OperationsLuxuryApp/Dashboard/` (los creados en fases anteriores sí pueden ampliarse):
- `DTOs/TicketsByGroupFilterDTO.cs` (record sin valores por defecto: `public record TicketsByGroupFilterDTO(Guid CustomerId, int Month, int Year);`), `DTOs/TicketsByGroupDTO.cs` (`int Month`, `int Year`, `string MonthName`, `List<TicketsGroupItemDTO> Items`) y `DTOs/TicketsGroupItemDTO.cs` (`Guid GroupId`, `string Group`, `int Total`, `int Pending`, `int Completed`, `int PastPending`). Un archivo = un DTO. **Sin propiedades `?`**. Nombres en inglés.
- `Interfaces/IDashboardMetricsAppService.cs`: agrega `GetTicketsByGroupAsync(TicketsByGroupFilterDTO filter)`.
- `Services/DashboardMetricsAppService.cs`: implementa el método siguiendo el patrón de `GetMaintenanceOrdersByCategoryAsync` (mes actual con el mismo mecanismo de fecha que ese método; nombre del mes en español igual que ese método). Roles: **no dupliques listas a mano**: determina el `RoleType` del rol del usuario (`currentUserService.UserRole`) consultando el rol (usa el servicio/`RoleManager` que ya se use en el proyecto, con caché si existe un patrón) y permite `RoleType.Staff`, `RoleType.Contractor`, más los cuatro roles fijos por nombre (SuperUsuario, Direccion, GerenteMantenimiento, SupervisionOperativa). Si no hay forma limpia de obtener el `RoleType`, PARA y repórtalo. Consultas agregadas en base de datos (GroupBy por grupo, conteos condicionales; una consulta para el mes y otra para pendientes pasados); prohibido traer tickets a memoria para contarlos. Incluye siempre todos los grupos activos no legales del cliente aunque tengan 0 tickets.
- `EndPoints/DashboardMetricsEndpoints.cs`: `GET api/dashboard/metrics/tickets-by-group` con **parámetros del lambda** `[FromQuery] Guid? customerId, [FromQuery] int month = 0, [FromQuery] int year = 0` y construyendo el record dentro (NO uses `[AsParameters]`: en la Fase 1.3 provocó 500 y luego un fallo de arranque de la API).
- Sin cambios de esquema ni migraciones. Si falta índice en `Tasks.CreatedAt`/`WorkGroupId`, repórtalo, no lo apliques.
- Si `api/LuxuryApp.Tests` ya tiene patrón de pruebas para AppServices, agrega pruebas (todos los grupos incluidos aun en 0, exclusión de legales, mes actual vs pasado, pendientes pasados, rol no permitido 403, sin cliente 400). Si no, repórtalo.

## B. Frontend

Archivos bajo `appsweb/angular/src/app/modules/operations.luxuryapp/dashboard/metrics/`:
- `core/constants/endpoints/operations.endpoints.ts`: `Dashboard.ticketsByGroup: (params: string) => \`dashboard/metrics/tickets-by-group?${params}\``.
- `interfaces/tickets-by-group.dto.ts` y método en `services/dashboard-metrics.service.ts` (mismo patrón que `getMaintenanceOrdersByCategory`; envía siempre `month` y `year`).
- **Tarjeta:** las tarjetas de mantenimiento fueron aprobadas y se ven bien (`components/maintenance-category-card.ts`). Extrae su plantilla a un componente genérico reutilizable (por ejemplo `components/metric-indicators-card.ts`, con inputs: título, icono, total, pendientes, concluidas, pendientes pasados, nombre del mes) y haz que `maintenance-category-card` y el nuevo `ticket-group-card` lo usen, **sin cambiar cómo se ven las tarjetas de mantenimiento**. Solo Bootstrap 5.3 + tokens `var(--ds-*)` (no hay Tailwind). Icono: uno del catálogo `AppIcon` (por ejemplo `AppIcon.TicketOutline`); verifica que exista.
- `dashboard-metrics.ts/.html`: nueva sección "Tickets por grupo de trabajo — <Mes Año>" **debajo** de la de órdenes de mantenimiento, `row g-3` con `col-12 col-sm-6 col-xl-3`. Reglas: visible solo si el rol está en la lista de RN-DASH-054 (34 roles + 4 fijos; usa `ApplicationRole`); un `effect` que dependa SOLO de `CustomerIdService.customerId()` (mismo patrón que el de mantenimiento) y estados cargando / error explícito (incluye `null` como error) / vacío.
- **Ruta:** en `app/routing/pages.routes.ts`, agrega los roles nuevos (Staff restantes y Contractor) a `allowedRoles` de `dashboard/metrics`, sin quitar ninguno.
- **Importante:** los roles nuevos NO deben disparar las llamadas del bloque antiguo de métricas operativas (`/operational`), que responde 403 para ellos y muestra un aviso de error. Envuelve ese bloque, sus filtros y su carga en una condición `canViewOperational` (los 17 roles que hoy lo ven) y no llames al endpoint para el resto. Sin cambiar cómo se ve para esos 17 roles.

## Verificación obligatoria (pega salidas reales)

1. `dotnet build` de `api/LuxuryApp.Application/LuxuryApp.Application.csproj` (si falla por archivos bloqueados por la API en ejecución, cita el mensaje exacto).
2. **Arranque real de la API** (`dotnet run --project api/LuxuryApp.Api/LuxuryApp.Api.csproj` u homólogo): pega las líneas donde llega a "Application started" sin `[FTL] Application startup exception`, y detén el proceso que iniciaste.
3. `npx ng build --configuration development` en `appsweb/angular`.
4. Greps sobre `dashboard/metrics/` en archivos nuevos/modificados que deben dar 0: `new Date|text-white|bg-black|#[0-9a-fA-F]{3,6}\b|console\.` y clases Tailwind (`grid-cols-|px-4|text-4xl|bg-\[|text-\[|rounded-lg`).
5. Respuestas a P-1, P-8 y P-9 con números reales (consulta o pantalla).
6. Lista de archivos creados/modificados; confirma que no tocaste los pre-existentes del Dashboard.

## Reporte

Reemplaza `D:\repos\luxuryapp-api\response.md` con un reporte nuevo y breve (archivos, decisiones, salidas reales, respuestas a P-1/P-8/P-9, desviaciones o bloqueos reales). No copies reportes anteriores.

## Pruebas del orquestador después (no las hagas tú)

Con la API reiniciada: llamadas HTTP (sin mes/año → 200; con mes/año → 200; sin cliente → 400), tarjetas en el navegador con `admin` en La Jolla y Avivia, y comparación de cifras de un grupo contra la pantalla existente de Tickets.

## Puntos abiertos (no los resuelve el ejecutor)

- Con roles Staff/Contractor viendo conteos de TODOS los tickets del cliente (decisión inicial del Tech Lead), habrá que definir más adelante filtros por rol/grupo (`WorkGroupMember`, `Visibility`).
- Tratamiento propio de los grupos legales.
- El bloque antiguo de métricas operativas (tarjetas 0/0/0 d con filtros de fecha) sigue en la página; decidir si se retira.
