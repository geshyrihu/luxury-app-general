namespace MantenimientoLuxuryApp.MachineryAsset.EndPoints;
/// <summary>Servicio o componente relacionado con fin.</summary>
public sealed class MachineryAssetEndPoints : IEndPointsModule
{
    /// <summary>Ejecuta la operación de fin.</summary>
    public void MapEndPoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/machinery-asset")
                       .RequireAuthorization()
                       .AddEndpointFilter<LogUserActivityEndPointsFilter>();

        // GET: api/machinery-asset/List/{customerId}
        group.MapGet("list/{customerId:guid}", async (Guid customerId, IMachineryAssetAppService appService) =>
            TypedResults.Ok(await appService.ListAsync(customerId)))
            .WithMetadata(new LogActivityMetadata("MachineryAsset_GetList", "Consulta del listado de activos de maquinaria."));
    }
}
