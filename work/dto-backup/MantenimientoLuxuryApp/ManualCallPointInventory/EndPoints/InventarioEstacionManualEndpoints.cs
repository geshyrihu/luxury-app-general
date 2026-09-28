namespace MantenimientoLuxuryApp.ManualCallPointInventory.EndPoints;
/// <summary>Servicio o componente relacionado con fin.</summary>
public sealed class InventarioEstacionManualEndpoints : IEndPointsModule
{
    /// <summary>Ejecuta la operación de fin.</summary>
    public void MapEndPoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/inventario-estacion-manual")
                       .RequireAuthorization()
                       .AddEndpointFilter<LogUserActivityEndPointsFilter>();

        group.MapGet("list/{customerId:guid}", async (Guid customerId, IInventarioEstacionManualAppService appService) =>
            TypedResults.Ok(await appService.GetAllAsync(customerId)))
            .WithMetadata(new LogActivityMetadata("InventarioEstacionManual_GetAll", "Consulta de todo el inventario de estaciones manuales por cliente."));

        group.MapGet("{id:guid}", async (Guid id, IInventarioEstacionManualAppService appService) =>
            TypedResults.Ok(await appService.GetByIdAsync(id)))
            .WithName("GetInventarioEstacionManual")
            .WithMetadata(new LogActivityMetadata("InventarioEstacionManual_GetById", "Consulta de estación manual por ID."));

        group.MapPost("", async ([FromForm] InventarioEstacionManualAddOrEditDTO dto, IInventarioEstacionManualAppService appService) =>
            TypedResults.Ok(await appService.AddAsync(dto)))
            .DisableAntiforgery()
            .WithMetadata(new LogActivityMetadata("InventarioEstacionManual_Add", "Alta de estación manual en inventario."));

        group.MapPut("{id:guid}", async (Guid id, [FromForm] InventarioEstacionManualAddOrEditDTO dto, IInventarioEstacionManualAppService appService) =>
            TypedResults.Ok(await appService.UpdateAsync(id, dto)))
            .DisableAntiforgery()
            .WithMetadata(new LogActivityMetadata("InventarioEstacionManual_Update", "Actualización de estación manual en inventario."));

        group.MapDelete("{id:guid}", async (Guid id, IInventarioEstacionManualAppService appService) =>
            TypedResults.Ok(await appService.DeleteByIdAsync(id)))
            .WithMetadata(new LogActivityMetadata("InventarioEstacionManual_Delete", "Baja de estación manual en inventario."));

        group.MapDelete("all/{customerId:guid}", async (Guid customerId, IInventarioEstacionManualAppService appService) =>
            TypedResults.Ok(await appService.DeleteAllByCustomerAsync(customerId)))
            .WithMetadata(new LogActivityMetadata("InventarioEstacionManual_DeleteAll", "Baja de todas las estaciones manuales del cliente."));

        group.MapPost("import/{customerId:guid}", async (Guid customerId, [FromForm] IFormFile file, IInventarioEstacionManualAppService appService) =>
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
        .WithMetadata(new LogActivityMetadata("InventarioEstacionManual_Import", "Importación de estaciones manuales desde archivo Excel."));
    }
}
