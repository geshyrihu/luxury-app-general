namespace MantenimientoLuxuryApp.SmokeDetectorInventory.EndPoints;
/// <summary>Servicio o componente relacionado con fin.</summary>
public sealed class InventarioDetectorHumoEndpoints : IEndPointsModule
{
    /// <summary>Ejecuta la operación de fin.</summary>
    public void MapEndPoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/inventario-detector-humo")
                       .RequireAuthorization()
                       .AddEndpointFilter<LogUserActivityEndPointsFilter>();

        group.MapGet("list/{customerId:guid}", async (Guid customerId, IInventarioDetectorHumoAppService appService) =>
            TypedResults.Ok(await appService.GetAllAsync(customerId)))
            .WithMetadata(new LogActivityMetadata("InventarioDetectorHumo_GetAll", "Consulta de todo el inventario de detectores de humo por cliente."));

        group.MapGet("{id:guid}", async (Guid id, IInventarioDetectorHumoAppService appService) =>
            TypedResults.Ok(await appService.GetByIdAsync(id)))
            .WithName("GetInventarioDetectorHumo")
            .WithMetadata(new LogActivityMetadata("InventarioDetectorHumo_GetById", "Consulta de detector de humo por ID."));

        group.MapPost("", async ([FromForm] InventarioDetectorHumoAddOrEditDTO dto, IInventarioDetectorHumoAppService appService) =>
            TypedResults.Ok(await appService.AddAsync(dto)))
            .DisableAntiforgery()
            .WithMetadata(new LogActivityMetadata("InventarioDetectorHumo_Add", "Alta de detector de humo en inventario."));

        group.MapPut("{id:guid}", async (Guid id, [FromForm] InventarioDetectorHumoAddOrEditDTO dto, IInventarioDetectorHumoAppService appService) =>
            TypedResults.Ok(await appService.UpdateAsync(id, dto)))
            .DisableAntiforgery()
            .WithMetadata(new LogActivityMetadata("InventarioDetectorHumo_Update", "Actualización de detector de humo en inventario."));

        group.MapDelete("{id:guid}", async (Guid id, IInventarioDetectorHumoAppService appService) =>
            TypedResults.Ok(await appService.DeleteByIdAsync(id)))
            .WithMetadata(new LogActivityMetadata("InventarioDetectorHumo_Delete", "Baja de detector de humo en inventario."));

        group.MapDelete("all/{customerId:guid}", async (Guid customerId, IInventarioDetectorHumoAppService appService) =>
            TypedResults.Ok(await appService.DeleteAllByCustomerAsync(customerId)))
            .WithMetadata(new LogActivityMetadata("InventarioDetectorHumo_DeleteAll", "Baja de todas los detectores de humo del cliente."));

        group.MapPost("import/{customerId:guid}", async (Guid customerId, [FromForm] IFormFile file, IInventarioDetectorHumoAppService appService) =>
        {
            if (file == null || file.Length == 0)
            {
                return Results.BadRequest(ApiResponseDTO<string>.ErrorResult("No se ha subido ningún archivo."));
            }

            try
            {
                var result = await appService.ImportFromExcelAsync(customerId, file);
                if (result.HasErrors)
                {
                    return Results.BadRequest(ApiResponseDTO<ImportPropertiesResultDTO>.SuccessResult(result, "Se encontraron errores en la importación."));
                }
                return Results.Ok(ApiResponseDTO<ImportPropertiesResultDTO>.SuccessResult(result, "Importación completada correctamente."));
            }
            catch (Exception ex)
            {
                return Results.Json(ApiResponseDTO<string>.ErrorResult($"Ocurrió un error inesperado durante la importación: {ex.Message}", 500), statusCode: 500);
            }
        })
        .DisableAntiforgery()
        .WithMetadata(new LogActivityMetadata("InventarioDetectorHumo_Import", "Importación de detectores de humo desde archivo Excel."));
    }
}
