namespace MantenimientoLuxuryApp.MachineryDocument.EndPoints;
/// <summary>Servicio o componente relacionado con documento fin.</summary>
public sealed class MachineryDocumentEndPoints : IEndPointsModule
{
    /// <summary>Ejecuta la operación de fin.</summary>
    public void MapEndPoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/machinery-document")
                       .AddEndpointFilter<LogUserActivityEndPointsFilter>();

        // GET: api/machinery-document/list/{machineryId}
        group.MapGet("list/{machineryId:guid}", async (Guid machineryId, IMachineryDocumentAppService appService) =>
            TypedResults.Ok(await appService.GetAllAsync(machineryId)))
            .WithMetadata(new LogActivityMetadata("MachineryDocument_GetAll", "Consulta de documentos de maquinaria."));
    }
}
