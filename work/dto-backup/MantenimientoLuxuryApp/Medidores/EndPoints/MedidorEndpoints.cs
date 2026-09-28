namespace MantenimientoLuxuryApp.Meters.EndPoints;
/// <summary>Servicio o componente relacionado con fin.</summary>
public sealed class MedidorEndpoints : IEndPointsModule
{
    /// <summary>Ejecuta la operación de fin.</summary>
    public void MapEndPoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/medidor")
            .RequireAuthorization()
            .AddEndpointFilter<LogUserActivityEndPointsFilter>();

        group.MapGet("{id:guid}", async (Guid id, IMedidorAppService appService) =>
            TypedResults.Ok(await appService.GetByIdAsync(id)))
            .WithName("GetMedidor")
            .WithMetadata(new LogActivityMetadata("Medidor_GetById", "Consulta de un medidor por ID."));

        group.MapGet("list/{customerId:guid}", async (Guid customerId, IMedidorAppService appService) =>
            TypedResults.Ok(await appService.GetAllAsync(customerId)))
            .WithMetadata(new LogActivityMetadata("Medidor_GetAllActive", "Consulta del listado de medidores activos."));

        group.MapGet("get-all-inactive/{customerId:guid}", async (Guid customerId, IMedidorAppService appService) =>
            TypedResults.Ok(await appService.GetAllInactiveAsync(customerId)))
            .WithMetadata(new LogActivityMetadata("Medidor_GetAllInactive", "Consulta del listado de medidores inactivos."));

        group.MapPost("", async (MedidorAddOrEditDTO DTO, IMedidorAppService appService) =>
        {
            var result = await appService.AddAsync(DTO);
            return Results.CreatedAtRoute("GetMedidor", new { id = result.Data.Id }, result);
        })
        .WithMetadata(new LogActivityMetadata("Medidor_Add", "Creación de un nuevo medidor."));

        group.MapPut("{id:guid}", async (Guid id, MedidorAddOrEditDTO DTO, IMedidorAppService appService) =>
            TypedResults.Ok(await appService.UpdateAsync(id, DTO)))
            .WithMetadata(new LogActivityMetadata("Medidor_Update", "Actualización de un medidor."));

        group.MapDelete("{id:guid}", async (Guid id, IMedidorAppService appService) =>
            TypedResults.Ok(await appService.DeleteByIdAsync(id)))
            .WithMetadata(new LogActivityMetadata("Medidor_Delete", "Eliminación de un medidor."));
    }
}
