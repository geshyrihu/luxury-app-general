namespace MantenimientoLuxuryApp.FireExtinguisherLog.EndPoints;
/// <summary>Servicio o componente relacionado con fin.</summary>
public sealed class BitacoraExtintorEndPoints : IEndPointsModule
{
    /// <summary>Ejecuta la operación de fin.</summary>
    public void MapEndPoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/bitacora-extintor")
                       .RequireAuthorization()
                       .AddEndpointFilter<LogUserActivityEndPointsFilter>();

        // GET: api/bitacora-extintor/list/{extinguisherId}
        group.MapGet("list/{extinguisherId:guid}", async (Guid extinguisherId, IBitacoraExtintorAppService appService) =>
            TypedResults.Ok(await appService.GetAllAsync(extinguisherId)))
            .WithMetadata(new LogActivityMetadata("BitacoraExtintor_GetAll", "Consulta del historial de inspecciones de un extintor."));

        // GET: api/bitacora-extintor/{id}
        group.MapGet("{id:guid}", async (Guid id, IBitacoraExtintorAppService appService) =>
            TypedResults.Ok(await appService.GetByIdAsync(id)))
            .WithName("GetBitacoraExtintor")
            .WithMetadata(new LogActivityMetadata("BitacoraExtintor_GetById", "Consulta de una inspección de extintor por ID."));

        // POST: api/bitacora-extintor
        group.MapPost("", async (BitacoraExtintorAddOrEditDTO dto, IBitacoraExtintorAppService appService) =>
            TypedResults.Ok(await appService.AddAsync(dto)))
            .WithMetadata(new LogActivityMetadata("BitacoraExtintor_Add", "Registro de inspección de extintor."));

        // DELETE: api/bitacora-extintor/{id}
        group.MapDelete("{id:guid}", async (Guid id, IBitacoraExtintorAppService appService) =>
            TypedResults.Ok(await appService.DeleteByIdAsync(id)))
            .WithMetadata(new LogActivityMetadata("BitacoraExtintor_Delete", "Eliminación de una inspección de extintor."));
    }
}
