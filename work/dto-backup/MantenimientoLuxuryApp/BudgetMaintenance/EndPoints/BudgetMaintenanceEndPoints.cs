namespace MantenimientoLuxuryApp.BudgetMaintenance.EndPoints;
/// <summary>Servicio o componente relacionado con fin.</summary>
public sealed class BudgetMaintenanceEndPoints : IEndPointsModule
{
    /// <summary>Ejecuta la operación de fin.</summary>
    public void MapEndPoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/budget-maintenance")
                       .RequireAuthorization()
                       .AddEndpointFilter<LogUserActivityEndPointsFilter>();

        // GET: api/budget-maintenance/SummaryOfExpenses/{customerId}
        group.MapGet("summary-of-expenses/{customerId:guid}", async (Guid customerId, IMaintenanceCalendarAppService appService) =>
            TypedResults.Ok(await appService.GetResumenGastosAsync(customerId)))
            .WithMetadata(new LogActivityMetadata("PresupuestoMantenimiento_GetSummaryOfExpenses", "Consulta del resumen de gastos de mantenimiento."));

        // GET: api/budget-maintenance/ResumenGastos/{customerId}
        group.MapGet("resumen-gastos/{customerId:guid}", async (Guid customerId, IMaintenanceCalendarAppService appService) =>
            TypedResults.Ok(await appService.GetResumenAsync(customerId)))
            .WithMetadata(new LogActivityMetadata("PresupuestoMantenimiento_GetExpensesSummary", "Consulta del resumen de gastos de mantenimiento (vista alternativa)."));
    }
}
