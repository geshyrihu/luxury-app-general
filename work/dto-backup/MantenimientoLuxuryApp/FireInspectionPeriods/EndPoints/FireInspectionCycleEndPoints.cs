namespace MantenimientoLuxuryApp.FireInspectionPeriods.EndPoints;
/// <summary>Servicio o componente relacionado con fin.</summary>
public sealed class FireInspectionCycleEndPoints : IEndPointsModule
{
    /// <summary>Ejecuta la operación de fin.</summary>
    public void MapEndPoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/fire-inspection-cycle")
                       .RequireAuthorization();

        // GET: api/fire-inspection-cycle/list/{customerId}
        group.MapGet("list/{customerId:guid}", async (Guid customerId, IFireInspectionCycleAppService appService) =>
            TypedResults.Ok(await appService.GetAllAsync(customerId)));

        // GET: api/fire-inspection-cycle/{id}
        group.MapGet("{id:guid}", async (Guid id, IFireInspectionCycleAppService appService) =>
            TypedResults.Ok(await appService.GetDetailAsync(id)));

        // GET: api/fire-inspection-cycle/active/{periodId}
        group.MapGet("active/{periodId:guid}", async (Guid periodId, IFireInspectionCycleAppService appService) =>
            TypedResults.Ok(await appService.GetActiveByPeriodAsync(periodId)));

        // POST: api/fire-inspection-cycle/generate/{periodId}
        group.MapPost("generate/{periodId:guid}", async (Guid periodId, IFireInspectionCycleAppService appService) =>
            TypedResults.Ok(await appService.GenerateCycleForPeriodAsync(periodId)));
    }
}
