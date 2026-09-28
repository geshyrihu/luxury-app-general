namespace MantenimientoLuxuryApp.FireExtinguisherInventory.EndPoints;
/// <summary>Servicio o componente relacionado con fin.</summary>
public sealed class InventarioExtintorEndpoints : IEndPointsModule
{
    /// <summary>Ejecuta la operación de fin.</summary>
    public void MapEndPoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/inventario-extintor")
                       .RequireAuthorization()
                       .AddEndpointFilter<LogUserActivityEndPointsFilter>();

        // GET: api/inventario-extintor/list/{customerId}
        group.MapGet("list/{customerId:guid}", async (Guid customerId, IInventarioExtintorAppService appService) =>
            TypedResults.Ok(await appService.GetAllAsync(customerId)))
            .WithMetadata(new LogActivityMetadata("InventarioExtintor_GetAll", "Consulta de todo el inventario de extintores por cliente."));

        // GET: api/inventario-extintor/get-all-group/{customerId}
        group.MapGet("get-all-group/{customerId:guid}", async (Guid customerId, IInventarioExtintorAppService appService) =>
            TypedResults.Ok(await appService.GetAllGroupAsync(customerId)))
            .WithMetadata(new LogActivityMetadata("InventarioExtintor_GetAllGroup", "Consulta de inventario de extintores agrupado."));

        // GET: api/inventario-extintor/{id}
        group.MapGet("{id:guid}", async (Guid id, IInventarioExtintorAppService appService) =>
            TypedResults.Ok(await appService.GetByIdAsync(id)))
            .WithName("GetInventarioExtintor")
            .WithMetadata(new LogActivityMetadata("InventarioExtintor_GetById", "Consulta de extintor por ID."));

        // POST: api/inventario-extintor
        group.MapPost("", async ([FromForm] InventarioExtintorAddOrEditDTO dto, IInventarioExtintorAppService appService) =>
            TypedResults.Ok(await appService.AddAsync(dto)))
            .DisableAntiforgery()
            .WithMetadata(new LogActivityMetadata("InventarioExtintor_Add", "Alta de extintor en inventario."));

        // PUT: api/inventario-extintor/{id}
        group.MapPut("{id:guid}", async (Guid id, [FromForm] InventarioExtintorAddOrEditDTO dto, IInventarioExtintorAppService appService) =>
            TypedResults.Ok(await appService.UpdateAsync(id, dto)))
            .DisableAntiforgery()
            .WithMetadata(new LogActivityMetadata("InventarioExtintor_Update", "Actualización de extintor en inventario."));

        // DELETE: api/inventario-extintor/{id}
        group.MapDelete("{id:guid}", async (Guid id, IInventarioExtintorAppService appService) =>
            TypedResults.Ok(await appService.DeleteByIdAsync(id)))
            .WithMetadata(new LogActivityMetadata("InventarioExtintor_Delete", "Baja de extintor en inventario."));
    }
}
