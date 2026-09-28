# Remediación 5 (menor) — `maintenance-orders`: month/year deben ser opcionales en el backend

Plan padre: `20260921-plan-operations-dashboard-ordenes-mantenimiento.md`. Prioridad baja: la Fase 1.3 ya funciona en pantalla; esto es robustez.

Regla de trabajo: solo lo que dice este documento. Si crees que hay una mejor manera, PARA y repórtalo. No afirmes lo que no hayas verificado.

## Problema (verificado)

`GET api/dashboard/metrics/maintenance-orders?customerId=<id>` sin `month`/`year` devuelve **500** (`BadHttpRequestException: Required parameter "int Month" was not provided from query string`). La Remediación 4 lo esquivó en el frontend (`dashboard-metrics.service.ts` siempre manda `month=0&year=0`), pero el endpoint sigue frágil para cualquier otro cliente (Swagger, Flutter, pruebas). Causa: en `MaintenanceOrdersFilterDTO` los inicializadores (`= 0`) no vuelven opcionales los `int` cuando el DTO se usa con `[AsParameters]`.
(`OperationalMetricsFilterDTO`/`Guid CustomerId` NO tiene este problema: verificado en el navegador, `/operational` sin `customerId` responde 200. No lo toques.)

## Cambio requerido

Solo backend, `api/LuxuryApp.Application/Modules/OperationsLuxuryApp/Dashboard/`:

1. Haz opcionales `Month` y `Year` **sin usar `?` en propiedades** (regla del proyecto: `#nullable disable`, prohibido `?` en propiedades de DTOs). Opción recomendada: convertir `DTOs/MaintenanceOrdersFilterDTO.cs` en un `record` con constructor primario y valores por defecto: `public record MaintenanceOrdersFilterDTO(Guid CustomerId = default, int Month = 0, int Year = 0);` (verifica que el binder de `[AsParameters]` respeta los valores por defecto del constructor). Si eso no funciona, PARA y reporta; alternativa aprobada: quitar `[AsParameters]` en `EndPoints/DashboardMetricsEndpoints.cs` y recibir `Guid customerId = default, int month = 0, int year = 0` como parámetros del lambda, construyendo el DTO dentro.
2. No cambies `DashboardMetricsAppService.cs`, las reglas RN-DASH-040 a 044, ni el frontend.

## Verificación obligatoria (pega salidas reales)

1. `dotnet build` de `api/LuxuryApp.Application/LuxuryApp.Application.csproj` (si falla por archivos bloqueados por la API en ejecución, cita el mensaje exacto).
2. Prueba HTTP real contra la API (reinicia tu API o dile al Tech Lead que la reinicie): `GET .../maintenance-orders?customerId=<id de La Jolla>` **sin** `month`/`year` → 200 con el mes actual; con `month=9&year=2026` → 200; sin `customerId` → 400 (`BusinessException`), no 500. Si no puedes autenticarte para probar, dilo explícitamente; el orquestador lo verificará.
3. Lista de archivos que tocaste.

## Reporte

Reemplaza `D:\repos\luxuryapp-api\response.md` con un reporte nuevo y breve (cambio, verificación y desviaciones reales). No copies el reporte anterior.
