# Remediación 6 (URGENTE) — La API no arranca por el binding de `MaintenanceOrdersFilterDTO`

Origen: `D:\repos\luxuryapp-api\logs.txt` (arranque de las 18:15). Causa introducida por la Remediación 5 (`20260921-remediacion-operations-dashboard-binding.md`), cuya opción recomendada usaba `Guid CustomerId = default`.

Regla de trabajo: solo lo que dice este documento. No cambies nada más. Si crees que hay una mejor manera, PARA y repórtalo. No afirmes lo que no hayas verificado.

## Hallazgo (verificado en los logs)

`[FTL] Application startup exception — System.ArgumentException: Argument types do not match` en
`Expression.Constant` ← `RequestDelegateFactory.BindParameterFromValue` ← `BindParameterFromProperties` (binder de `[AsParameters]`) al construir los endpoints. La API entera se detiene en el arranque ("Hosting failed to start").
Motivo: `public record MaintenanceOrdersFilterDTO(Guid CustomerId = default, int Month = 0, int Year = 0);` — el valor por defecto `default` de un `Guid` (struct) llega al binder como `null` y no coincide con el tipo `Guid`. Los `int = 0` no dan problema; el `Guid = default` sí.

## Cambio requerido (solo estos dos archivos, en `api/LuxuryApp.Application/Modules/OperationsLuxuryApp/Dashboard/`)

1. `DTOs/MaintenanceOrdersFilterDTO.cs`: deja el `record` SIN valores por defecto (no lo uses con `[AsParameters]`):
   `public record MaintenanceOrdersFilterDTO(Guid CustomerId, int Month, int Year);`
2. `EndPoints/DashboardMetricsEndpoints.cs`, endpoint `/maintenance-orders`: quita `[AsParameters]` y recibe los valores como parámetros del lambda con valores por defecto, construyendo el DTO dentro:
   `async ([FromQuery] Guid? customerId, [FromQuery] int month = 0, [FromQuery] int year = 0, IDashboardMetricsAppService appService) => { var result = await appService.GetMaintenanceOrdersByCategoryAsync(new MaintenanceOrdersFilterDTO(customerId ?? Guid.Empty, month, year)); return Results.Ok(result); }`
   (Los `?` son solo en un parámetro del lambda, no en una propiedad de DTO; está permitido. Ajusta el orden/atributos para que compile: los parámetros con valor por defecto van después de los obligatorios; el servicio se inyecta por DI, no por query.)
   No toques el endpoint `/operational` ni `DashboardMetricsAppService.cs`.

## Verificación obligatoria (pega salidas reales)

1. `dotnet build` de `api/LuxuryApp.Application/LuxuryApp.Application.csproj` (si falla por archivos bloqueados por la API en ejecución, cita el mensaje exacto).
2. **Arranque real:** inicia la API (`dotnet run --project api/LuxuryApp.Api/LuxuryApp.Api.csproj`, o el mismo comando con que el Tech Lead la levanta) y confirma en la salida que llega a "Now listening"/"Application started" SIN `[FTL] Application startup exception`. Pega las líneas relevantes y luego detén el proceso que hayas iniciado.
3. Lista de archivos que tocaste.

## Reporte

Reemplaza `D:\repos\luxuryapp-api\response.md` con un reporte nuevo y breve (cambio, verificación, desviaciones reales). No copies el reporte anterior.

## Pruebas HTTP que hará el orquestador después (no las hagas tú)

Sin `month`/`year` → 200 con el mes actual; con `month=8&year=2026` → 200; sin `customerId` → 400.
