namespace MantenimientoLuxuryApp.ManualCallPointLog.EndPoints;
/// <summary>Servicio o componente relacionado con fin.</summary>
public sealed class BitacoraEstacionManualEndPoints : IEndPointsModule
{
    /// <summary>Ejecuta la operación de fin.</summary>
    public void MapEndPoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/bitacora-estacion-manual")
                       .RequireAuthorization()
                       .AddEndpointFilter<LogUserActivityEndPointsFilter>();

        // GET: api/bitacora-estacion-manual/list/{stationId}
        group.MapGet("list/{stationId:guid}", async (Guid stationId, IBitacoraEstacionManualAppService appService) =>
            TypedResults.Ok(await appService.GetAllAsync(stationId)))
            .WithMetadata(new LogActivityMetadata("BitacoraEstacionManual_GetAll", "Consulta del historial de inspecciones de una estación manual."));

        // GET: api/bitacora-estacion-manual/{id}
        group.MapGet("{id:guid}", async (Guid id, IBitacoraEstacionManualAppService appService) =>
            TypedResults.Ok(await appService.GetByIdAsync(id)))
            .WithName("GetBitacoraEstacionManual")
            .WithMetadata(new LogActivityMetadata("BitacoraEstacionManual_GetById", "Consulta de una inspección de estación manual por ID."));

        // POST: api/bitacora-estacion-manual
        group.MapPost("", async (BitacoraEstacionManualAddOrEditDTO dto, IBitacoraEstacionManualAppService appService) =>
            TypedResults.Ok(await appService.AddAsync(dto)))
            .WithMetadata(new LogActivityMetadata("BitacoraEstacionManual_Add", "Registro de inspección de estación manual."));

        // DELETE: api/bitacora-estacion-manual/{id}
        group.MapDelete("{id:guid}", async (Guid id, IBitacoraEstacionManualAppService appService) =>
            TypedResults.Ok(await appService.DeleteByIdAsync(id)))
            .WithMetadata(new LogActivityMetadata("BitacoraEstacionManual_Delete", "Eliminación de una inspección de estación manual."));
    }
}
