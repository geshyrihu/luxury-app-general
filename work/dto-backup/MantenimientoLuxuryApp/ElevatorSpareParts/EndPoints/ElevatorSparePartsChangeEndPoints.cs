namespace MantenimientoLuxuryApp.ElevatorSpareParts.EndPoints;
/// <summary>Servicio o componente relacionado con fin.</summary>
public sealed class ElevatorSparePartsChangeEndPoints : IEndPointsModule
{
    /// <summary>Ejecuta la operación de fin.</summary>
    public void MapEndPoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/elevator-spare-parts-change")
                       .RequireAuthorization()
                       .AddEndpointFilter<LogUserActivityEndPointsFilter>();

        // GET: api/elevator-spare-parts-change/{id}
        group.MapGet("{id:guid}", async (Guid id, IElevatorSparePartsChangeAppService dataService) =>
            TypedResults.Ok(await dataService.GetByIdAsync(id)))
            .WithMetadata(new LogActivityMetadata("ElevatorSparePartsChange_GetById", "Consulta de cambio de refacción de elevador por ID."));

        // GET: api/elevator-spare-parts-change/list/{customerId}
        group.MapGet("list/{customerId:guid}", async (Guid customerId, IElevatorSparePartsChangeAppService dataService) =>
            TypedResults.Ok(await dataService.GetAllAsync(customerId)))
            .WithMetadata(new LogActivityMetadata("ElevatorSparePartsChange_GetAll", "Consulta del listado de cambios de refacciones de elevadores."));

        // GET: api/elevator-spare-parts-change/elevators/{customerId}
        group.MapGet("elevators/{customerId:guid}", async (Guid customerId, IElevatorSparePartsChangeAppService dataService) =>
            TypedResults.Ok(await dataService.GetElevatorsAsync(customerId)))
            .WithMetadata(new LogActivityMetadata("ElevatorSparePartsChange_GetElevators", "Consulta de listado de elevadores para cambio de refacciones."));

        // POST: api/elevator-spare-parts-change
        group.MapPost("", async (ElevatorSparePartsChangeAddOrEditDTO DTO, IElevatorSparePartsChangeAppService dataService) =>
            TypedResults.Ok(await dataService.AddAsync(DTO)))
            .WithMetadata(new LogActivityMetadata("ElevatorSparePartsChange_Add", "Creación de un nuevo registro de cambio de refacción de elevador."));

        // PUT: api/elevator-spare-parts-change/{id}
        group.MapPut("{id:guid}", async (Guid id, ElevatorSparePartsChangeAddOrEditDTO DTO, IElevatorSparePartsChangeAppService dataService) =>
            TypedResults.Ok(await dataService.UpdateAsync(id, DTO)))
            .WithMetadata(new LogActivityMetadata("ElevatorSparePartsChange_Update", "Actualización de un registro de cambio de refacción de elevador."));

        // DELETE: api/elevator-spare-parts-change/{id}
        group.MapDelete("{id:guid}", async (Guid id, IElevatorSparePartsChangeAppService dataService) =>
            TypedResults.Ok(await dataService.DeleteByIdAsync(id)))
            .WithMetadata(new LogActivityMetadata("ElevatorSparePartsChange_Delete", "Eliminación de un registro de cambio de refacción de elevador."));
    }
}
