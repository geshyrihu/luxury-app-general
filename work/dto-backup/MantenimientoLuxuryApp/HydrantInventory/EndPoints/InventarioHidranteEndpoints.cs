namespace MantenimientoLuxuryApp.HydrantInventory.EndPoints;
/// <summary>Servicio o componente relacionado con fin.</summary>
public sealed class InventarioHidranteEndpoints : IEndPointsModule
{
    /// <summary>Ejecuta la operación de fin.</summary>
    public void MapEndPoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/inventario-hidrante")
                       .RequireAuthorization()
                       .AddEndpointFilter<LogUserActivityEndPointsFilter>();

        // GET: api/inventario-hidrante/list/{customerId}
        group.MapGet("list/{customerId:guid}", async (Guid customerId, IInventarioHidranteAppService appService) =>
            TypedResults.Ok(await appService.GetAllAsync(customerId)))
            .WithMetadata(new LogActivityMetadata("InventarioHidrante_GetAll", "Consulta de todo el inventario de hidrantes por cliente."));

        // GET: api/inventario-hidrante/{id}
        group.MapGet("{id:guid}", async (Guid id, IInventarioHidranteAppService appService) =>
            TypedResults.Ok(await appService.GetByIdAsync(id)))
            .WithName("GetInventarioHidrante")
            .WithMetadata(new LogActivityMetadata("InventarioHidrante_GetById", "Consulta de hidrante por ID."));

        // POST: api/inventario-hidrante
        group.MapPost("", async (InventarioHidranteAddOrEditDTO dto, IInventarioHidranteAppService appService) =>
            TypedResults.Ok(await appService.AddAsync(dto)))
            .DisableAntiforgery()
            .WithMetadata(new LogActivityMetadata("InventarioHidrante_Add", "Alta de hidrante en inventario."));

        // PUT: api/inventario-hidrante/{id}
        group.MapPut("{id:guid}", async (Guid id, InventarioHidranteAddOrEditDTO dto, IInventarioHidranteAppService appService) =>
            TypedResults.Ok(await appService.UpdateAsync(id, dto)))
            .DisableAntiforgery()
            .WithMetadata(new LogActivityMetadata("InventarioHidrante_Update", "Actualización de hidrante en inventario."));

        // DELETE: api/inventario-hidrante/{id}
        group.MapDelete("{id:guid}", async (Guid id, IInventarioHidranteAppService appService) =>
            TypedResults.Ok(await appService.DeleteByIdAsync(id)))
            .WithMetadata(new LogActivityMetadata("InventarioHidrante_Delete", "Baja de hidrante en inventario."));
    }
}
