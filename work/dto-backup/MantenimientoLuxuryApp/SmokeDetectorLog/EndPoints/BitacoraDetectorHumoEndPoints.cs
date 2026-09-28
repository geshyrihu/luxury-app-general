namespace MantenimientoLuxuryApp.SmokeDetectorLog.EndPoints;
/// <summary>Servicio o componente relacionado con fin.</summary>
public sealed class BitacoraDetectorHumoEndPoints : IEndPointsModule
{
    /// <summary>Ejecuta la operación de fin.</summary>
    public void MapEndPoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/bitacora-detector-humo")
                       .RequireAuthorization()
                       .AddEndpointFilter<LogUserActivityEndPointsFilter>();

        // GET: api/bitacora-detector-humo/list/{detectorId}
        group.MapGet("list/{detectorId:guid}", async (Guid detectorId, IBitacoraDetectorHumoAppService appService) =>
            TypedResults.Ok(await appService.GetAllAsync(detectorId)))
            .WithMetadata(new LogActivityMetadata("BitacoraDetectorHumo_GetAll", "Consulta del historial de inspecciones de un detector de humo."));

        // GET: api/bitacora-detector-humo/{id}
        group.MapGet("{id:guid}", async (Guid id, IBitacoraDetectorHumoAppService appService) =>
            TypedResults.Ok(await appService.GetByIdAsync(id)))
            .WithName("GetBitacoraDetectorHumo")
            .WithMetadata(new LogActivityMetadata("BitacoraDetectorHumo_GetById", "Consulta de una inspección de detector de humo por ID."));

        // POST: api/bitacora-detector-humo
        group.MapPost("", async (BitacoraDetectorHumoAddOrEditDTO dto, IBitacoraDetectorHumoAppService appService) =>
            TypedResults.Ok(await appService.AddAsync(dto)))
            .WithMetadata(new LogActivityMetadata("BitacoraDetectorHumo_Add", "Registro de inspección de detector de humo."));

        // DELETE: api/bitacora-detector-humo/{id}
        group.MapDelete("{id:guid}", async (Guid id, IBitacoraDetectorHumoAppService appService) =>
            TypedResults.Ok(await appService.DeleteByIdAsync(id)))
            .WithMetadata(new LogActivityMetadata("BitacoraDetectorHumo_Delete", "Eliminación de una inspección de detector de humo."));
    }
}
