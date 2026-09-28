# Fase 1.5 — Contratos y pólizas próximos a vencer (tarjetas, datos reales)

Plan padre: `20260921-plan-operations-dashboard.md` · Catálogo maestro: `20260921-especificacion-operations-dashboard-kpis.md` (KPI-LG-01). Modelo a imitar: Fase 1.3/1.4 (mantenimiento y tickets), ya aprobadas.

Objetivo: en `/dashboard/metrics`, una tarjeta por **tipo de contrato** (`TypeOfContract`) del cliente activo, con el total de contratos/pólizas próximos a vencer (≤45 días). Sin gráficos, sin desglose de pendientes/concluidas (a diferencia de mantenimiento y tickets: aquí es un solo número por tarjeta).

Regla de trabajo: el ejecutor solo hace lo que dice este documento. Si crees que hay una mejor manera, PARA y repórtalo. No afirmes lo que no hayas verificado. No modifiques los archivos pre-existentes del Dashboard (`DashboardAppService.cs`, `DashboardEndpoints.cs`, `IDashboardAppService.cs`, `unified-pending-dashboard*`, `container-dashboard*`, `dashboard-pending-items.ts`) ni el comportamiento de los métodos ya aprobados (`GetOperationalMetricsAsync`, `GetMaintenanceOrdersByCategoryAsync`, `GetTicketsByGroupAsync`). El bloque "7. Contratos (Por vencer)" de `DashboardAppService.cs` (regla de 45 días ya existente) se queda igual; esta fase NO lo reemplaza, es una vista nueva y paralela.

## Decisiones del Tech Lead (2026-09-21)

- **Umbral:** 45 días (el mismo que ya usa `DashboardAppService.cs`), no 60.
- **Tipos:** los 4 valores de `TypeOfContract` (Fijo, Polizas, Remodelaciones, BuildingInsurancePolicy). Siempre las 4 tarjetas, aun con 0.
- **Roles que ven esta sección:** `Legal`, `SuperUsuario`, `Direccion`, `Administrador`, `GerenteOperaciones`, `GerenteAtencion`, `SupervisionOperativa`, `GerenteMantenimiento`. Ningún otro rol (nota: `CoordinacionLegal` queda fuera, a diferencia de otras secciones).
- **Cliente:** igual que mantenimiento/tickets — TODOS estos 8 roles filtran por el cliente activo del header (`CustomerIdService`), sin vista agregada multi-cliente ni selector propio.

## Hechos verificados en el código (léelos, no los asumas)

- Entidad real: `ContratoPoliza` (tabla `InsurancePolicies`, `api/.../Infrastructure/Data/Entities/LegalLuxuryApp/Legal/ContractPolicy/ContratoPoliza.cs`): `CustomerId`, `ProviderId`→`Provider`, `Description`, `StartDate` (DateOnly), `EndDate` (DateOnly?), `IsCurrent` (bool), `TypeOfContract` (enum `Shared.Enums.TypeOfContract`: Fijo, Polizas, Remodelaciones, BuildingInsurancePolicy).
- Regla de "por vencer" YA existente en `DashboardAppService.cs` líneas ~458-467: `IsCurrent == true && EndDate.HasValue && EndDate.Value <= hoy+45días`. Sin cota inferior (esto también incluye contratos ya vencidos que siguen marcados `IsCurrent`). Usa exactamente el mismo criterio, con 45 días, en el método nuevo.
- No hay periodo mensual aquí: es una fotografía del momento (a diferencia de mantenimiento/tickets, que miden por mes de creación). No agregues `Month`/`Year` al filtro.

## Reglas de negocio (nuevas)

- **RN-DASH-060** Universo: `ContratoPoliza` del cliente activo, `IsCurrent == true`, agrupado por `TypeOfContract`. Se devuelve una entrada por cada uno de los 4 valores del enum (aun con 0).
- **RN-DASH-061** "Por vencer" = `EndDate.HasValue && EndDate.Value <= hoy + 45 días` (mismo criterio que `DashboardAppService.cs`, sin cota inferior).
- **RN-DASH-062** Roles y cliente: rol permitido = los 8 de la lista de arriba; rol fuera de la lista => `BusinessException` 403; `CustomerId` obligatorio => `BusinessException` 400. NUNCA `UnauthorizedAccessException`/`ArgumentException`.

## A. Backend

Archivos en `api/LuxuryApp.Application/Modules/OperationsLuxuryApp/Dashboard/` (los creados en fases anteriores sí pueden ampliarse):
- `DTOs/ContractsExpiringFilterDTO.cs` (record sin valores por defecto: `public record ContractsExpiringFilterDTO(Guid CustomerId);`) — sin `Month`/`Year`, este KPI no es mensual.
- `DTOs/ContractsExpiringDTO.cs` (`int DaysThreshold`, `List<ContractsExpiringTypeItemDTO> Items`) y `DTOs/ContractsExpiringTypeItemDTO.cs` (`int TypeId`, `string TypeName`, `int Total`). Un archivo = un DTO. **Sin propiedades `?`**. Nombres en inglés.
- `Interfaces/IDashboardMetricsAppService.cs`: agrega `GetContractsExpiringAsync(ContractsExpiringFilterDTO filter)`.
- `Services/DashboardMetricsAppService.cs`: implementa el método. Roles: lista propia de constantes (los 8 de RN-DASH-062, por nombre, igual que hizo `GetMaintenanceOrdersByCategoryAsync`; no reutilices `RoleType` aquí porque la lista no coincide con ningún `RoleType` completo). Una sola consulta agregada en base de datos (`GroupBy(c => c.TypeOfContract)`, `Count()`); prohibido traer contratos a memoria para contarlos. Completa siempre los 4 valores del enum aunque la consulta no los devuelva. Usa `GetDisplayName()` para el nombre del tipo (ya usado en `MaintenanceOrdersCategoryItemDTO`/`TicketsGroupItemDTO`, mismo patrón).
- `EndPoints/DashboardMetricsEndpoints.cs`: `GET api/dashboard/metrics/contracts-expiring` con **parámetro del lambda** `[FromQuery] Guid? customerId` (sin `month`/`year`), construyendo el record dentro. NO uses `[AsParameters]`.
- Sin cambios de esquema ni migraciones. Si falta índice en `InsurancePolicies.EndDate`/`CustomerId`, repórtalo, no lo apliques.
- Si `api/LuxuryApp.Tests` ya tiene patrón de pruebas para AppServices, agrega pruebas (los 4 tipos incluidos aun en 0, umbral de 45 días exacto —un contrato a 46 días no cuenta, uno a 45 sí—, rol no permitido 403, sin cliente 400). Si no, repórtalo.

## B. Frontend

Archivos bajo `appsweb/angular/src/app/modules/operations.luxuryapp/dashboard/metrics/`:
- `core/constants/endpoints/operations.endpoints.ts`: `Dashboard.contractsExpiring: (params: string) => \`dashboard/metrics/contracts-expiring?${params}\``.
- `interfaces/contracts-expiring.dto.ts` (dentro de `metrics/interfaces/`, no fuera — en la Fase 1.4 esto se colocó mal y hubo que corregirlo) y método en `services/dashboard-metrics.service.ts` (mismo patrón que `getTicketsByGroup`, sin `month`/`year`).
- **Tarjeta:** este KPI muestra un solo número por tarjeta (sin pendientes/concluidas/pendientes pasados). Si existe el componente genérico que ya extrajeron en fases previas (`components/metric-indicators-card.ts` o como se haya llamado), evalúa si sirve con menos indicadores o si conviene un componente más simple `components/contract-type-card.ts` (icono, título = nombre del tipo, valor = total, texto "vencen en ≤45 días"). Decide por consistencia visual con las tarjetas ya aprobadas (incluidas y sin romperlas); si reutilizas un componente compartido, no le cambies la apariencia a mantenimiento/tickets. Solo Bootstrap 5.3 + tokens `var(--ds-*)` (no hay Tailwind). Icono: uno del catálogo `AppIcon` por tipo de contrato (por ejemplo `AppIcon.FileDocument` para Fijo, `AppIcon.ShieldCheck` para Pólizas y Seguro del Inmueble, `AppIcon.Tools`/similar para Remodelaciones — verifica que cada nombre exista, no inventes).
- `dashboard-metrics.ts`: agrega `canViewContracts = computed(...)` con los 8 roles exactos de RN-DASH-062 (usa `ApplicationRole`, sin reutilizar `canViewMaintenance`/`canViewTickets` aunque se parezcan: son listas independientes). Un `effect` que dependa SOLO de `CustomerIdService.customerId()` (mismo patrón que mantenimiento/tickets) y llame solo si `canViewContracts()` (con `untracked`). Estados cargando / error explícito (incluye `null` como error) / vacío (aunque "vacío" no debería pasar: siempre hay 4 tipos).
- `dashboard-metrics.html`: nueva sección "Contratos y pólizas por vencer (≤45 días)" envuelta en `@if (canViewContracts()) { ... }`, `row g-3` con `col-12 col-sm-6 col-xl-3`, en el mismo estilo que las secciones de mantenimiento y tickets. Colócala en el orden que consideres más natural junto a esas dos (repórtalo).

## No toques

Backend (`DashboardMetricsAppService.cs` en lo que ya existía, DTOs previos, endpoints previos), `maintenance-category-card.ts`, `tickets-by-group-card.ts`, los efectos de mantenimiento/tickets, el bloque de métricas operativas, ni el catálogo `/dashboard/metrics/catalog`.

## Verificación obligatoria (pega salidas reales, no un resumen)

1. `dotnet build` de `api/LuxuryApp.Application/LuxuryApp.Application.csproj` (si falla por archivos bloqueados por la API en ejecución, cita el mensaje exacto).
2. **Arranque real de la API** (`dotnet run --project api/LuxuryApp.Api/LuxuryApp.Api.csproj` u homólogo): pega las líneas donde llega a "Application started" sin `[FTL] Application startup exception`, y detén el proceso que iniciaste. (En la Fase 1.3 un `record` con valores por defecto usado con `[AsParameters]` tumbó la API entera; este documento ya pide NO usar `[AsParameters]`, pero igual verifica el arranque real.)
3. `npx ng build --configuration development` en `appsweb/angular`.
4. Grep sobre `appsweb/angular/src/app/modules/operations.luxuryapp/dashboard/` que debe dar 0 coincidencias de `contracts-expiring.dto` fuera de `metrics/interfaces/`.
5. Greps sobre `dashboard/metrics/` en archivos nuevos/modificados que deben dar 0: `new Date|text-white|bg-black|#[0-9a-fA-F]{3,6}\b|console\.` y clases Tailwind (`grid-cols-|px-4|text-4xl|bg-\[|text-\[|rounded-lg`).
6. Prueba con al menos un contrato real cercano al límite: reporta un caso con `EndDate` a 44, 45 y 46 días de hoy, y confirma que el de 45 sí cuenta y el de 46 no.
7. Lista de archivos creados/modificados; confirma que no tocaste los pre-existentes del Dashboard ni las secciones de mantenimiento/tickets.

## Reporte

Reemplaza `D:\repos\luxuryapp-api\response.md` con un reporte nuevo y breve (archivos, decisiones, salidas reales de los 7 puntos de arriba, desviaciones o bloqueos reales). No copies reportes anteriores. No declares "completado con éxito" sin haber pegado las salidas reales que pide este documento.

## Pruebas del orquestador después (no las hagas tú)

Con la API reiniciada: llamada HTTP sin `customerId` → 400; con `customerId` → 200 con los 4 tipos; tarjetas en el navegador con `admin` en La Jolla y Avivia; comparación de cifras contra el bloque "Contratos (Por vencer)" ya existente en el dashboard actual (mismo criterio de 45 días, debe coincidir el total sumando los 4 tipos).
