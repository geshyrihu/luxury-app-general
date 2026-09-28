# Remediación 3 — Catálogo de KPIs: el cliente sale del selector global (CustomerIdService)

Origen: revisión del Tech Lead sobre `/dashboard/metrics/catalog`. Plan padre: `20260921-plan-operations-dashboard.md`. Catálogo maestro: `20260921-especificacion-operations-dashboard-kpis.md`.
Solo se corrige lo que dice este documento. No toques backend, ni `dashboard-metrics*`, ni `kpi-catalog.config.ts`.

Archivos (bajo `appsweb\angular\src\app\modules\operations.luxuryapp\dashboard\metrics\catalog\`): `kpi-catalog.ts` y `kpi-catalog.html`.

## Problema

El Tech Lead pidió **usar `CustomerIdService`** (el cliente activo ya se cambia con el selector del header/toolbar de la app). La página agregó un SEGUNDO selector de cliente ("Cliente") dentro de los filtros. Está mal: duplica el selector del header.

## Cambios requeridos

1. **Quitar el select "Cliente"** de `kpi-catalog.html` y todo lo que solo lo soportaba en `kpi-catalog.ts`: `customerOptions`, `onCustomerSelect`, la inyección de `AuthService` si queda sin uso, y la importación/uso de `customerAccess`. No agregues ningún otro selector de cliente.
2. **El cliente activo se lee solo de `CustomerIdService`** (`customerId()`, `customerName()`), que ya está inyectado. Cuando el usuario cambia el cliente en el selector del header, la página debe reaccionar sola. Sigue el mismo patrón reactivo que `dashboard\unified-pending-dashboard.ts` (constructor con `effect(() => { const customerId = this.customerIdS.customerId(); if (customerId) { ... } })`) o un `computed` que lea esa misma señal; los valores de muestra y el "Alcance simulado" deben cambiar al cambiar el cliente del header.
3. **Distribución de la barra de filtros:** un solo select ("Rol a simular", `col-12 col-md-6`) y a su lado el bloque de solo lectura "Alcance simulado" (`col-12 col-md-6`), con una línea del cliente activo ("Cliente activo: <nombre> — se cambia desde el selector superior"). Sin selects de cliente.
4. **Estado de error del rol:** si la carga de `Endpoints.SelectItems.dashboardKpiRoles` falla o devuelve vacío, muestra bajo el select el mensaje "No se pudieron cargar los roles" en lugar de dejar el select vacío sin explicación.

## Nota (no es un cambio de código)

El select de rol se vio vacío en la prueba porque el proceso de la API se inició antes de agregar el endpoint `GET api/select-items/dashboard-kpi-roles`. Hay que **reiniciar la API**; no modifiques el backend por esto.

## Verificación obligatoria (pega la salida real)

- `npx ng build --configuration development` en `appsweb\angular`.
- Grep sobre `catalog\` que debe dar 0 coincidencias: `customerOptions|onCustomerSelect|customerAccess|setCustomerId|new Date|text-white|bg-black`.
- Confirma que no modificaste ningún otro archivo (lista los archivos que tocaste).

## Reporte

Reemplaza `D:\repos\luxuryapp-api\response.md` con un reporte nuevo y breve: qué cambiaste en cada punto (1-4), cómo lo verificaste y la salida real de build y grep. No copies reportes anteriores. Si crees que hay una mejor manera de hacer algo, PARA y repórtalo en lugar de hacerlo.
