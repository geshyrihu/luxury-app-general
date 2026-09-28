namespace MantenimientoLuxuryApp.FireInspectionPeriods.EndPoints;
/// <summary>Servicio o componente relacionado con fin.</summary>
public sealed class FireCycleInspectionEndPoints : IEndPointsModule
{
    /// <summary>Ejecuta la operación de fin.</summary>
    public void MapEndPoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/fire-cycle-inspection")
                       .RequireAuthorization();

        // GET: api/fire-cycle-inspection/extintor/{cycleId}/{extinguisherId}
        group.MapGet("extintor/{cycleId:guid}/{extinguisherId:guid}", async (Guid cycleId, Guid extinguisherId, IFireCycleInspectionAppService appService) =>
            TypedResults.Ok(await appService.GetExtintorAsync(cycleId, extinguisherId)));

        // POST: api/fire-cycle-inspection/extintor
        group.MapPost("extintor", async (FireCycleInspectionExtintorAddOrEditDTO dto, IFireCycleInspectionAppService appService) =>
            TypedResults.Ok(await appService.UpsertExtintorAsync(dto)));

        // GET: api/fire-cycle-inspection/hidrante/{cycleId}/{hydrantId}
        group.MapGet("hidrante/{cycleId:guid}/{hydrantId:guid}", async (Guid cycleId, Guid hydrantId, IFireCycleInspectionAppService appService) =>
            TypedResults.Ok(await appService.GetHidranteAsync(cycleId, hydrantId)));

        // POST: api/fire-cycle-inspection/hidrante
        group.MapPost("hidrante", async (FireCycleInspectionHidranteAddOrEditDTO dto, IFireCycleInspectionAppService appService) =>
            TypedResults.Ok(await appService.UpsertHidranteAsync(dto)));

        // GET: api/fire-cycle-inspection/estacion/{cycleId}/{stationId}
        group.MapGet("estacion/{cycleId:guid}/{stationId:guid}", async (Guid cycleId, Guid stationId, IFireCycleInspectionAppService appService) =>
            TypedResults.Ok(await appService.GetEstacionAsync(cycleId, stationId)));

        // POST: api/fire-cycle-inspection/estacion
        group.MapPost("estacion", async (FireCycleInspectionEstacionAddOrEditDTO dto, IFireCycleInspectionAppService appService) =>
            TypedResults.Ok(await appService.UpsertEstacionAsync(dto)));

        // GET: api/fire-cycle-inspection/detector/{cycleId}/{detectorId}
        group.MapGet("detector/{cycleId:guid}/{detectorId:guid}", async (Guid cycleId, Guid detectorId, IFireCycleInspectionAppService appService) =>
            TypedResults.Ok(await appService.GetDetectorAsync(cycleId, detectorId)));

        // POST: api/fire-cycle-inspection/detector
        group.MapPost("detector", async (FireCycleInspectionDetectorAddOrEditDTO dto, IFireCycleInspectionAppService appService) =>
            TypedResults.Ok(await appService.UpsertDetectorAsync(dto)));
    }
}
