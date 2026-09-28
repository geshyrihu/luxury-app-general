# Remediación 8 — Fase 1.4 (tickets por grupo): roles no llegan a la página y bloque viejo sin condicionar

Plan padre: `20260921-plan-operations-dashboard-tickets-por-grupo.md`. Revisión del orquestador sobre el código real (no sobre el reporte).

Regla de trabajo: solo lo que dice este documento. Si crees que hay una mejor manera, PARA y repórtalo. No afirmes lo que no hayas verificado. **La sección de Verificación es obligatoria con salidas reales; un reporte sin esas salidas no se considera válido.**

Archivos bajo `appsweb/angular/src/app/`.

## Hallazgos verificados

1. **`routing/pages.routes.ts`, ruta `dashboard/metrics`:** `allowedRoles` sigue con los 17 roles originales. Los 26 roles `RoleType.Staff` restantes y los 4 `RoleType.Contractor` (a los que el backend de tickets ya da acceso) no pueden entrar a la página: `hasRolesGuard` los redirige. Confirma la lista completa de roles Staff y Contractor consultando `ApplicationRoleAppService.CreateRoles()` (`api/LuxuryApp.Application/Modules/AdminLuxuryApp/SecurityPermissions/Access/ApplicationRole/Services/ApplicationRoleAppService.cs`), no la inventes.
2. **`modules/operations.luxuryapp/dashboard/metrics/dashboard-metrics.html`/`.ts`:** el bloque de métricas operativas (barra de filtros `<app-dashboard-metrics-filters>` + las 3 tarjetas Completadas/Pendientes/Tiempo promedio) no está condicionado a ningún rol. El `effect` de `loadMetrics` se dispara para cualquier usuario en cuanto `currentFilter` tiene valor (los filtros emiten en su `ngOnInit`), sin importar el rol. Con los roles nuevos habilitados en el punto 1, esto les mostrará un toast de error ("No se pudieron cargar las métricas operativas") apenas entren.
3. **`modules/operations.luxuryapp/dashboard/interfaces/tickets-by-group.dto.ts`:** está fuera de `dashboard/metrics/`. Debe vivir en `dashboard/metrics/interfaces/tickets-by-group.dto.ts`, junto con `operational-metrics.dto.ts` y `maintenance-orders.dto.ts`.
4. **`dashboard-metrics.ts`, efecto de tickets:** depende de `currentFilter()` además de `CustomerIdService.customerId()`. El plan pedía que dependiera SOLO del cliente (igual que el efecto de mantenimiento). Como está, cambiar la fecha o el tipo de operación en los filtros antiguos vuelve a pedir los tickets sin necesidad.
5. **Sin guard de rol en frontend para tickets:** cualquier usuario autenticado llama a `/tickets-by-group`; si no tiene permiso, el 403 se ignora en silencio (`catch` en `loadTicketsMetrics`). El plan pedía que la sección fuera visible, y se llamara al endpoint, solo para los roles permitidos.

## Cambios requeridos

### A. `routing/pages.routes.ts`

Agrega a `allowedRoles` de la ruta `dashboard/metrics` los 26 roles `RoleType.Staff` (los 7 que ya están, más los restantes: técnicos, seguridad, recepción, jardinería, etc. — verifícalos en el código, no los inventes) y los 4 `RoleType.Contractor`. No quites ninguno de los 17 ya presentes.

### B. `dashboard-metrics.ts`

1. Agrega `canViewTickets = computed(...)`, con la MISMA lista de roles que usa el backend en `GetTicketsByGroupAsync` (RoleType.Staff + RoleType.Contractor + SuperUsuario + Direccion + GerenteMantenimiento + SupervisionOperativa) — usa `ApplicationRole` explícitamente (igual que `canViewMaintenance`); no dupliques a mano si existe una forma de listarlos desde un enum/constante compartida en el frontend, si no existe créala en este mismo archivo con un comentario que referencie RN-DASH-054.
2. Agrega `canViewOperational = computed(...)` con los 17 roles que hoy ya ven el bloque de métricas operativas (Corporate: los 10 de `isCorporate()` menos overlaps + Staff: Administrador, GerenteOperaciones, GerenteAtencion, Asistente, Contador, Cobranza, JefeMantenimiento — usa la unión real, no la reinventes: son los mismos roles que ya estaban en `allowedRoles` de la ruta ANTES de este cambio).
3. Separa el `effect` de tickets del de `currentFilter`: debe depender SOLO de `CustomerIdService.customerId()` (y de `canViewTickets()` leído con `untracked`, igual que hace `canViewMaintenance` en el efecto de mantenimiento). Quita la lectura de `currentFilter`/`tFilter` de ese efecto. Para el `resolvedCustomerId` de Corporate (drill-down), usa `untracked(() => this.isCorporate())` igual que ya hace el efecto de mantenimiento con `canViewMaintenance`.
4. No llames a `loadTicketsMetrics` si `!canViewTickets()`.

### C. `dashboard-metrics.html`

1. Envuelve el bloque completo de métricas operativas (el `<app-dashboard-metrics-filters>` y el `@if (loading())...@else if (hasError())...@else if (metrics(); as m)...@else...` que le sigue) en `@if (canViewOperational()) { ... }`.
2. Envuelve la sección de tickets (`@if (ticketsLoading())...`) en `@if (canViewTickets()) { ... }`.

### D. Reubicar el archivo

Mueve `dashboard/interfaces/tickets-by-group.dto.ts` a `dashboard/metrics/interfaces/tickets-by-group.dto.ts` y actualiza los 2-3 imports que lo referencian (`dashboard-metrics.ts`, `components/tickets-by-group-card.ts`, `services/dashboard-metrics.service.ts`). No dejes el archivo duplicado ni un archivo vacío en la ubicación vieja.

## No toques

Backend (`DashboardMetricsAppService.cs`, DTOs, endpoint), `maintenance-category-card.ts`, el efecto de mantenimiento, ni el catálogo `/dashboard/metrics/catalog`.

## Verificación obligatoria (pega salidas reales, no un resumen)

1. `npx ng build --configuration development` en `appsweb/angular` — pega la salida completa hasta "Application bundle generation complete" o el error.
2. Grep sobre `appsweb/angular/src/app/modules/operations.luxuryapp/dashboard/` que debe dar 0 coincidencias fuera de `metrics/`: busca `tickets-by-group.dto` en archivos que NO estén bajo `metrics/`.
3. Pega el bloque `allowedRoles` completo y actualizado de la ruta `dashboard/metrics` en `pages.routes.ts`.
4. Lista de archivos creados/modificados/movidos.

## Reporte

Reemplaza `D:\repos\luxuryapp-api\response.md` con un reporte nuevo (puntos A-D, verificación con las 4 salidas de arriba, desviaciones reales). No copies el reporte anterior. No declares "completado con éxito" sin haber pegado las salidas reales que pide este documento.
