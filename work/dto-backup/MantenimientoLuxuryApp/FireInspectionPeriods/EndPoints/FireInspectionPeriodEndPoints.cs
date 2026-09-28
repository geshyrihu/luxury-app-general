namespace MantenimientoLuxuryApp.FireInspectionPeriods.EndPoints;
/// <summary>Servicio o componente relacionado con fin.</summary>
public sealed class FireInspectionPeriodEndPoints : IEndPointsModule
{
    /// <summary>Ejecuta la operación de fin.</summary>
    public void MapEndPoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/fire-inspection-period")
                       .RequireAuthorization();

        // GET: api/fire-inspection-period/list/{customerId}
        group.MapGet("list/{customerId:guid}", async (Guid customerId, IFireInspectionPeriodAppService appService) =>
            TypedResults.Ok(await appService.GetAllAsync(customerId)));

        // GET: api/fire-inspection-period/{id}
        group.MapGet("{id:guid}", async (Guid id, IFireInspectionPeriodAppService appService) =>
            TypedResults.Ok(await appService.GetByIdAsync(id)));

        // POST: api/fire-inspection-period
        group.MapPost("", async (FireInspectionPeriodAddOrEditDTO dto, IFireInspectionPeriodAppService appService) =>
            TypedResults.Ok(await appService.AddAsync(dto)));

        // PUT: api/fire-inspection-period/{id}
        group.MapPut("{id:guid}", async (Guid id, FireInspectionPeriodAddOrEditDTO dto, IFireInspectionPeriodAppService appService) =>
            TypedResults.Ok(await appService.UpdateAsync(id, dto)));

        // DELETE: api/fire-inspection-period/{id}
        group.MapDelete("{id:guid}", async (Guid id, IFireInspectionPeriodAppService appService) =>
            TypedResults.Ok(await appService.DeleteByIdAsync(id)));
    }
}
