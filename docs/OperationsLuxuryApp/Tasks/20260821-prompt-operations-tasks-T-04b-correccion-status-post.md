# TICKET T-04b — Corrección: el POST de plantillas no debe devolver HTTP 400 en errores de negocio

Trabajas en el repositorio LuxuryApp. Este es un **ticket de corrección** de T-04, que quedó
aprobado salvo por este punto. Es de una sola línea.

## Qué salió mal

Archivo: `api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Tasks/RecurringTaskCatalog/EndPoints/RecurringTaskTemplatesEndPoints.cs`

El `POST` actual:

```csharp
group.MapPost("", async (RecurringTaskTemplateAddOrEditDTO dto, IRecurringTaskCatalogAppService appService) =>
{
    var result = await appService.CreateAsync(dto);
    if (!result.Success) return Results.BadRequest(result);

    return Results.CreatedAtRoute("GetRecurringTaskTemplate", new { id = result.Data.Id }, result);
})
```

El `if (!result.Success)` es correcto y necesario: sin él, `.Data.Id` lanzaría
`NullReferenceException` cuando `CreateAsync` rechaza la plantilla por alguna de sus validaciones
(grupo sin administradores, crítica sin respaldo, etc. — hay varias formas de fallar). Ese guardia
se queda.

**Lo que está mal es devolver `Results.BadRequest(result)`.** El resto de los endpoints del mismo
archivo (`GET {id}`, `GET list`, `PUT`, `PATCH`) siempre responden `TypedResults.Ok(...)`,
**incluso cuando el resultado es un error de negocio** — el éxito o fracaso viaja dentro del
cuerpo (`ApiResponseDTO.Success`), no en el código HTTP. Es el mismo patrón del archivo de
referencia `TaskGroupsEndpoints.cs`.

Verificado además contra el consumidor real:
`client/angular/src/app/core/http/services/api-response.service.ts` —
`processResponse`/`handleSuccess`/`handleError` leen `response.success` **asumiendo que la
respuesta ya llegó en 2xx**, dentro del callback normal de éxito de la petición HTTP. Un `400`
real hace que Angular lo trate como error de transporte y active el flujo de error HTTP, no el de
negocio — el toast y el manejo esperado no se disparan como en el resto del catálogo. Es un
defecto real para quien construya la pantalla en T-06, no un detalle de estilo.

El origen del error es el prompt original de T-04, que dio como referencia un archivo cuyo `POST`
nunca falla por reglas de negocio y por eso nunca necesitó decidir qué código HTTP usar en el
error.

## Tarea única

Mismo archivo. Cambia la rama de error del `POST` para que devuelva `200`, igual que el resto del
archivo, conservando el guardia que evita el `NullReferenceException`:

```csharp
group.MapPost("", async (RecurringTaskTemplateAddOrEditDTO dto, IRecurringTaskCatalogAppService appService) =>
{
    var result = await appService.CreateAsync(dto);
    if (!result.Success) return TypedResults.Ok(result);

    return Results.CreatedAtRoute("GetRecurringTaskTemplate", new { id = result.Data.Id }, result);
})
```

El éxito sigue devolviendo `201` vía `CreatedAtRoute`. Sólo cambia la rama de error, de `400` a
`200`.

## Lo que NO debes hacer

- No toques `RecurringTaskCatalogAppService.cs` ni ninguna validación de negocio: quedaron
  aprobadas tal como están.
- No toques `GET`, `PUT` ni `PATCH` en este archivo: ya siguen el patrón correcto.
- No toques ningún otro archivo del repositorio.

## Convenciones aplicables

- Consistencia de contrato HTTP dentro del mismo módulo de endpoints
- Archivos en UTF-8 sin mojibake

## Verificación obligatoria

Corre y **pega la salida literal** de:

```bash
dotnet build api/LuxuryApp.sln
node scripts/scan-mojibake.mjs api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Tasks/RecurringTaskCatalog
```

## Criterio de PASO del ticket

Que quede explícito en tu reporte: los cinco endpoints del archivo (`GET {id}`, `GET list`,
`POST`, `PUT`, `PATCH`) devuelven ahora el mismo código HTTP (`200`, salvo `201` en el POST
exitoso) sin importar si el resultado de negocio fue éxito o error.

## Reporte de finalización

1. Línea exacta cambiada
2. Salida literal de los dos comandos
3. Confirmación de que ningún otro endpoint del archivo se tocó

No avances al siguiente ticket. Espera la auditoría.
