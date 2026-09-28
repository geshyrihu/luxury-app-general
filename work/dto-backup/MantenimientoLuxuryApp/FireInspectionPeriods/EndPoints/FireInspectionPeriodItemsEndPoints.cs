namespace MantenimientoLuxuryApp.FireInspectionPeriods.EndPoints;
/// <summary>Servicio o componente relacionado con elementos fin.</summary>
public sealed class FireInspectionPeriodItemsEndPoints : IEndPointsModule
{
    /// <summary>Ejecuta la operación de fin.</summary>
    public void MapEndPoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/fire-inspection-period-items")
                       .RequireAuthorization();

        // ---- Extintores ----
        group.MapGet("extintor/list/{periodId:guid}", async (Guid periodId, IFireInspectionPeriodItemsAppService appService) =>
            TypedResults.Ok(await appService.GetExtintoresAsync(periodId)));
        group.MapPost("extintor/{periodId:guid}/{extinguisherId:guid}", async (Guid periodId, Guid extinguisherId, IFireInspectionPeriodItemsAppService appService) =>
            TypedResults.Ok(await appService.AddExtintorAsync(periodId, extinguisherId)));
        group.MapDelete("extintor/{id:guid}", async (Guid id, IFireInspectionPeriodItemsAppService appService) =>
            TypedResults.Ok(await appService.RemoveExtintorAsync(id)));

        // ---- Hidrantes ----
        group.MapGet("hidrante/list/{periodId:guid}", async (Guid periodId, IFireInspectionPeriodItemsAppService appService) =>
            TypedResults.Ok(await appService.GetHidrantesAsync(periodId)));
        group.MapPost("hidrante/{periodId:guid}/{hydrantId:guid}", async (Guid periodId, Guid hydrantId, IFireInspectionPeriodItemsAppService appService) =>
            TypedResults.Ok(await appService.AddHidranteAsync(periodId, hydrantId)));
        group.MapDelete("hidrante/{id:guid}", async (Guid id, IFireInspectionPeriodItemsAppService appService) =>
            TypedResults.Ok(await appService.RemoveHidranteAsync(id)));

        // ---- Estaciones manuales ----
        group.MapGet("estacion/list/{periodId:guid}", async (Guid periodId, IFireInspectionPeriodItemsAppService appService) =>
            TypedResults.Ok(await appService.GetEstacionesAsync(periodId)));
        group.MapPost("estacion/{periodId:guid}/{stationId:guid}", async (Guid periodId, Guid stationId, IFireInspectionPeriodItemsAppService appService) =>
            TypedResults.Ok(await appService.AddEstacionAsync(periodId, stationId)));
        group.MapDelete("estacion/{id:guid}", async (Guid id, IFireInspectionPeriodItemsAppService appService) =>
            TypedResults.Ok(await appService.RemoveEstacionAsync(id)));

        // ---- Detectores de humo ----
        group.MapGet("detector/list/{periodId:guid}", async (Guid periodId, IFireInspectionPeriodItemsAppService appService) =>
            TypedResults.Ok(await appService.GetDetectoresAsync(periodId)));
        group.MapPost("detector/{periodId:guid}/{detectorId:guid}", async (Guid periodId, Guid detectorId, IFireInspectionPeriodItemsAppService appService) =>
            TypedResults.Ok(await appService.AddDetectorAsync(periodId, detectorId)));
        group.MapDelete("detector/{id:guid}", async (Guid id, IFireInspectionPeriodItemsAppService appService) =>
            TypedResults.Ok(await appService.RemoveDetectorAsync(id)));
    }
}
