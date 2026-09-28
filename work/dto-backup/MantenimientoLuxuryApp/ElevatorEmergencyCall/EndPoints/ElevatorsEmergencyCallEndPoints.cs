namespace MantenimientoLuxuryApp.ElevatorEmergencyCall.EndPoints;
/// <summary>Servicio o componente relacionado con fin.</summary>
public sealed class ElevatorsEmergencyCallEndPoints : IEndPointsModule
{
    /// <summary>Ejecuta la operación de fin.</summary>
    public void MapEndPoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/elevators-emergency-call")
                       .RequireAuthorization()
                       .AddEndpointFilter<LogUserActivityEndPointsFilter>();

        // GET: api/elevators-emergency-call/{id}
        group.MapGet("{id:guid}", async (Guid id, IElevatorsEmergencyCallAppService dataService) =>
            TypedResults.Ok(await dataService.GetByIdAsync(id)))
            .WithMetadata(new LogActivityMetadata("ElevatorsEmergencyCall_GetById", "Consulta de llamada de emergencia de elevador por ID."));

        // GET: api/elevators-emergency-call/list/{customerId}
        group.MapGet("list/{customerId:guid}", async (Guid customerId, IElevatorsEmergencyCallAppService dataService) =>
            TypedResults.Ok(await dataService.GetAllAsync(customerId)))
            .WithMetadata(new LogActivityMetadata("ElevatorsEmergencyCall_GetAll", "Consulta del listado de llamadas de emergencia de elevadores."));

        // GET: api/elevators-emergency-call/elevators/{customerId}
        group.MapGet("elevators/{customerId:guid}", async (Guid customerId, IElevatorsEmergencyCallAppService dataService) =>
            TypedResults.Ok(await dataService.GetElevatorsAsync(customerId)))
            .WithMetadata(new LogActivityMetadata("ElevatorsEmergencyCall_GetElevators", "Consulta de listado de elevadores para llamadas de emergencia."));

        // POST: api/elevators-emergency-call
        group.MapPost("", async (ElevatorsEmergencyCallAddOrEditDTO DTO, IElevatorsEmergencyCallAppService dataService) =>
            TypedResults.Ok(await dataService.AddAsync(DTO)))
            .WithMetadata(new LogActivityMetadata("ElevatorsEmergencyCall_Add", "Creación de un nuevo registro de llamada de emergencia de elevador."));

        // PUT: api/elevators-emergency-call/{id}
        group.MapPut("{id:guid}", async (Guid id, ElevatorsEmergencyCallAddOrEditDTO DTO, IElevatorsEmergencyCallAppService dataService) =>
            TypedResults.Ok(await dataService.UpdateAsync(id, DTO)))
            .WithMetadata(new LogActivityMetadata("ElevatorsEmergencyCall_Update", "Actualización de un registro de llamada de emergencia de elevador."));

        // DELETE: api/elevators-emergency-call/{id}
        group.MapDelete("{id:guid}", async (Guid id, IElevatorsEmergencyCallAppService dataService) =>
            TypedResults.Ok(await dataService.DeleteByIdAsync(id)))
            .WithMetadata(new LogActivityMetadata("ElevatorsEmergencyCall_Delete", "Eliminación de un registro de llamada de emergencia de elevador."));
    }
}
