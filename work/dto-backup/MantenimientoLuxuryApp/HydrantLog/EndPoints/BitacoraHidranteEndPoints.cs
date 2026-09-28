namespace MantenimientoLuxuryApp.HydrantLog.EndPoints;
/// <summary>Servicio o componente relacionado con fin.</summary>
public sealed class BitacoraHidranteEndPoints : IEndPointsModule
{
    /// <summary>Ejecuta la operación de fin.</summary>
    public void MapEndPoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/bitacora-hidrante")
                       .RequireAuthorization()
                       .AddEndpointFilter<LogUserActivityEndPointsFilter>();

        // GET: api/bitacora-hidrante/list/{hydrantId}
        group.MapGet("list/{hydrantId:guid}", async (Guid hydrantId, IBitacoraHidranteAppService appService) =>
            TypedResults.Ok(await appService.GetAllAsync(hydrantId)))
            .WithMetadata(new LogActivityMetadata("BitacoraHidrante_GetAll", "Consulta del historial de inspecciones de un hidrante."));

        // GET: api/bitacora-hidrante/{id}
        group.MapGet("{id:guid}", async (Guid id, IBitacoraHidranteAppService appService) =>
            TypedResults.Ok(await appService.GetByIdAsync(id)))
            .WithName("GetBitacoraHidrante")
            .WithMetadata(new LogActivityMetadata("BitacoraHidrante_GetById", "Consulta de una inspección de hidrante por ID."));

        // POST: api/bitacora-hidrante
        group.MapPost("", async (BitacoraHidranteAddOrEditDTO dto, IBitacoraHidranteAppService appService) =>
            TypedResults.Ok(await appService.AddAsync(dto)))
            .WithMetadata(new LogActivityMetadata("BitacoraHidrante_Add", "Registro de inspección de hidrante."));

        // DELETE: api/bitacora-hidrante/{id}
        group.MapDelete("{id:guid}", async (Guid id, IBitacoraHidranteAppService appService) =>
            TypedResults.Ok(await appService.DeleteByIdAsync(id)))
            .WithMetadata(new LogActivityMetadata("BitacoraHidrante_Delete", "Eliminación de una inspección de hidrante."));
    }
}
