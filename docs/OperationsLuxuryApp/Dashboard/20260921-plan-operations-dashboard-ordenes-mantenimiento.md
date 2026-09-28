# Fase 1.3 — Órdenes de mantenimiento por categoría de inventario (datos reales)

Plan padre: `20260921-plan-operations-dashboard.md` · Catálogo maestro: `20260921-especificacion-operations-dashboard-kpis.md` (KPI-OP-01/02/03 + KPI-MT-*, ver P-1/P-2 abajo).
Objetivo: ver datos REALES en `/dashboard/metrics`: una tarjeta por cada `InventoryCategory` con las órdenes de mantenimiento (`ServiceOrders`) del **mes actual** (totales, pendientes, concluidas) y un cuarto indicador **"Pendientes pasados"** (pendientes de meses anteriores). Sin gráficos.

Regla de trabajo: el ejecutor solo hace lo que dice este documento. Si crees que hay una mejor manera, PARA y repórtalo. No modifiques los archivos pre-existentes del Dashboard (`DashboardAppService.cs`, `DashboardEndpoints.cs`, `IDashboardAppService.cs`, `unified-pending-dashboard*`, `container-dashboard*`, `dashboard-pending-items.ts`).

## Hechos verificados en el código (no los asumas de nuevo, léelos)

- `ServiceOrder` (`api/LuxuryApp.Application/Infrastructure/Data/Entities/OperationsLuxuryApp/ServiceOrders/ServiceOrder.cs`): `MachineryId` → `Machinery` (clase `Equipment`), `RequestDate` (DateOnly), `ExecutionDate` (DateOnly?), `Status` (`Status?`).
- La categoría vive en el equipo: `Equipment.InventoryCategory` (enum `Shared.Enums.InventoryCategory`, archivo `Shared/Enums/InventoryCategory.cs`). Valores activos: Equipos=1, Amenidades=2, Mobiliarios=3, Equipamiento=4, Gimnasio=5, Sistemas=6, BodegasCuartosMaquinas=7 ("Bodegas y Cuartos de Máquinas"), AreasComunes=8 ("Áreas Comunes"). El 9 (Pintura) está comentado: NO incluirlo.
- `Status` (`Shared/Enums/Status.cs`): `Pendiente`, `Concluido`, `noAutorizado`, `Proceso`, `Cancelado`.
- Cliente de una orden: `ServiceOrder.Machinery.CustomerId`.
- Las órdenes se miden por mes de `RequestDate`: `ServiceOrderAppService.cs` filtra con `x.RequestDate.Month == m && x.RequestDate.Year == y`. Usa el mismo criterio.

## Reglas de negocio (nuevas)

- **RN-DASH-040** Universo: `ServiceOrders` agrupadas por `Machinery.InventoryCategory`. Se devuelven SIEMPRE las 8 categorías activas, aun con 0 (una tarjeta por categoría, estable).
- **RN-DASH-041** Mes de medición = mes calendario (mes y año) de `RequestDate`. Por defecto el mes actual. Acepta `Month`/`Year` opcionales solo para poder verificar meses anteriores.
- **RN-DASH-042** (decisión del Tech Lead 2026-09-21) Pendientes = `Status` Pendiente o Proceso. Concluidas = `Status` Concluido, **Cancelado o noAutorizado** (estos dos se dan por concluidos). **Total = Pendientes + Concluidas** (o sea, todas las órdenes del mes). Todo del mes de medición.
- **RN-DASH-043** **Pendientes pasados** = órdenes con `Status` Pendiente o Proceso y `RequestDate` anterior al día 1 del mes de medición (todos los meses previos, sin límite inferior), misma categoría y mismo alcance de cliente. No entran en Total ni en Pendientes del mes.
- **RN-DASH-044** (decisión del Tech Lead 2026-09-21; regla PROPIA de este KPI, distinta de RN-DASH-020/021) Roles que ven las órdenes de mantenimiento:
  - Corporate: `GerenteMantenimiento`, `SupervisionOperativa`.
  - Staff: `Administrador`, `GerenteOperaciones`, `GerenteAtencion`, `JefeMantenimiento`.
  - `SuperUsuario` y `Direccion`: ven todo sin excepción.
  - **Todos, sin excepción, filtran por el cliente activo del header (`CustomerIdService`)**; ninguno agrega todos los clientes. `CustomerId` es obligatorio: sin él => `BusinessException` 400. Rol fuera de esta lista => `BusinessException` 403.
  - Errores con `BusinessException` (403/400), NUNCA `UnauthorizedAccessException`/`ArgumentException` (el `GlobalExceptionMiddleware` los devuelve como 500).
  - Esta lista es una constante nueva de este método. **NO amplíes** `CorporateRoles`/`StaffRoles`: el método `/operational` no cambia.

## A. Backend

Archivos (todos bajo `api/LuxuryApp.Application/Modules/OperationsLuxuryApp/Dashboard/`; son archivos creados en la Fase 1.1, sí puedes ampliarlos):
- `DTOs/MaintenanceOrdersByCategoryDTO.cs` (nuevo) y `DTOs/MaintenanceOrdersFilterDTO.cs` (nuevo). Un archivo = un DTO. **Sin propiedades `?`** (el proyecto usa `#nullable disable`; para "sin cliente" usa `Guid.Empty`, para "mes actual" `0`).
  - Filter: `Guid CustomerId` (obligatorio; `Guid.Empty` => 400), `int Month` (0 = actual), `int Year` (0 = actual).
  - Respuesta: un DTO contenedor con `int Month`, `int Year`, `string MonthName` (en español) y `List<MaintenanceOrdersCategoryItemDTO> Items` (un DTO más, archivo propio) con `int CategoryId`, `string Category` (DisplayName vía `GetDisplayName()`), `int Total`, `int Pending`, `int Completed`, `int PastPending`. Nombres en inglés (gobernanza anti-Spanglish).
- `Interfaces/IDashboardMetricsAppService.cs`: agrega `GetMaintenanceOrdersByCategoryAsync(MaintenanceOrdersFilterDTO filter)`.
- `Services/DashboardMetricsAppService.cs`: implementa el método. Valida el rol contra una lista propia de 8 roles (RN-DASH-044), con `currentUserService.UserRole` y `BusinessException`, y exige `CustomerId`. **NO modifiques** los arrays `CorporateRoles`/`StaffRoles` ni el comportamiento de `GetOperationalMetricsAsync`.
  - Consultas agregadas en base de datos (`GroupBy(so => so.Machinery.InventoryCategory)` con conteos condicionales); prohibido traer las órdenes a memoria para contarlas. Una consulta para el mes y otra para pendientes pasados, o una combinada.
  - "Mes actual": usa el mismo mecanismo de fecha "hoy" que emplea el proyecto en `ServiceOrderAppService`/servicios vecinos (no inventes uno; `IBusinessTimeService` está inactivo, NO lo actives). Si no hay un estándar claro, PARA y repórtalo.
  - Completa con ceros las categorías que no devuelva la consulta (las 8 activas siempre).
- `EndPoints/DashboardMetricsEndpoints.cs`: `GET api/dashboard/metrics/maintenance-orders` con `[AsParameters] MaintenanceOrdersFilterDTO`, mismo patrón del endpoint `/operational` ya existente (ya implementa `IEndPointsModule`; no registres nada más).
- No hay cambios de esquema ni migraciones. Si detectas falta de índice en `ServiceOrders.RequestDate`, repórtalo, no lo apliques.
- Si `api/LuxuryApp.Tests` ya tiene el patrón de pruebas para AppServices, agrega pruebas: 8 categorías siempre, mes actual vs pasado, pendientes pasados, rol Staff sin cliente => 400, rol no autorizado => 403. Si no hay patrón, repórtalo.

## B. Frontend

Archivos bajo `appsweb/angular/src/app/modules/operations.luxuryapp/dashboard/metrics/`:
- Endpoint: en `core/constants/endpoints/operations.endpoints.ts` (dentro de `Dashboard`, junto a `operationalMetrics`) agrega `maintenanceOrders: (params: string) => \`dashboard/metrics/maintenance-orders?${params}\``.
- `interfaces/maintenance-orders.dto.ts` (nuevo), y método en `services/dashboard-metrics.service.ts` (usa `ApiResponseService`, mismo patrón del método existente).
- Componente nuevo `components/maintenance-category-card.ts` (standalone, OnPush, signals, `input()`). **Antes de crearlo, revisa `shared/ui` (`app-stat-card`, `app-kpi-card`, `card`)**: si alguno permite mostrar 4 indicadores, úsalo; si no (hoy muestran un solo valor), crea este componente local y justifica en el reporte por qué no se reutilizó. Contenido de cada tarjeta:
  - Título = nombre de la categoría (con icono del catálogo `AppIcon`, elige uno razonable por categoría).
  - Valor principal grande = **Total** (etiqueta "Solicitudes totales").
  - Tres indicadores debajo, en una fila: **Pendientes**, **Concluidas**, **Pendientes pasados**. "Pendientes pasados" resalta con token de peligro cuando > 0 y con `title`/tooltip "Pendientes de meses anteriores a <mes>".
  - Estilos: **solo Bootstrap 5.3 + tokens `var(--ds-*)`** (NO hay Tailwind en este proyecto: `grid-cols-*`, `px-4`, `text-4xl`, `bg-[var(...)]` no funcionan). Tokens disponibles: `--ds-bg-surface`, `--ds-border`, `--ds-radius-lg`, `--ds-font-size-metric`, `--ds-font-size-help`, `--ds-font-size-micro`, `--ds-text-primary|secondary|muted`, `--ds-success`, `--ds-danger`, `--ds-warning`, `--ds-info`, `--ds-shadow-sm`. Verifica que cada token exista en `appsweb/angular/src/styles`.
- En `dashboard-metrics.ts/.html`: agrega, **arriba del contenido actual**, una sección "Órdenes de mantenimiento — <Mes Año>" con `row g-3` y `col-12 col-sm-6 col-xl-3` por categoría. **No borres ni modifiques el bloque actual** (KPIs/gráficos existentes): se retirará en otra fase.
  - Visibilidad: la sección solo se muestra si el rol está en la lista de RN-DASH-044 (8 roles); para otros roles no se renderiza ni se llama al endpoint.
  - Cliente: **no agregues selector de cliente**. TODOS los roles usan `CustomerIdService.customerId()` con `effect` como en `dashboard/unified-pending-dashboard.ts` (recarga al cambiar el cliente del header; no llames si el id está vacío). No hay rama "todos los clientes".
  - Sin filtros de fecha en esta sección: siempre mes actual.
  - Estados: cargando, error (mensaje claro), y las 8 tarjetas aunque estén en 0.
  - Prohibido `new Date()`/`formatDate`; el nombre del mes viene del backend (`MonthName`).

## Verificación obligatoria (pega salidas reales, no resúmenes)

1. Backend: `dotnet build` de `api/LuxuryApp.Application/LuxuryApp.Application.csproj` (si falla por archivos bloqueados por la API en ejecución, cita el mensaje exacto; no lo presentes como éxito).
2. Frontend: `npx ng build --configuration development` en `appsweb/angular`.
3. Greps sobre `dashboard/metrics/` que deben dar 0: `new Date|text-white|bg-black|#[0-9a-fA-F]{3,6}\b` y clases Tailwind en los archivos NUEVOS (`grid-cols-|px-4|text-4xl|bg-\[|text-\[|rounded-lg`).
4. Compara cifras con datos reales: elige 1 cliente y 1 categoría, cuenta a mano en la pantalla existente de Órdenes de servicio (o con una consulta) el mes actual y los pendientes de meses anteriores, y compáralos con el endpoint. Reporta ambos números.
5. Lista de archivos creados/modificados, y confirma que no tocaste los pre-existentes del Dashboard.

## Reporte

Reemplaza `D:\repos\luxuryapp-api\response.md` con un reporte nuevo y breve: archivos, decisiones, salida real de builds/greps, comparación de cifras del punto 4, y desviaciones o bloqueos reales. No copies reportes anteriores.

## Decisiones cerradas por el Tech Lead (2026-09-21)

- **P-2 resuelto:** `Cancelado` y `noAutorizado` cuentan como concluidos (RN-DASH-042).
- **P-7 resuelto:** solo los 8 roles de RN-DASH-044 ven estas tarjetas, todos filtrados por el cliente del header (`CustomerIdService`) (RN-DASH-044).
- Nota: el endpoint `/operational` (ya aprobado) conserva su definición previa de "concluida" (no pendiente y con `ExecutionDate`). No se toca en esta fase; se alineará cuando el Tech Lead lo decida.
