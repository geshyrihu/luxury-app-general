namespace MantenimientoLuxuryApp.PiscinasBitacora.EndPoints;
/// <summary>Servicio o componente relacionado con fin.</summary>
public sealed class PiscinaEndpoints : IEndPointsModule
{
    /// <summary>Ejecuta la operación de fin.</summary>
    public void MapEndPoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/piscina")
                       .RequireAuthorization()
                       .AddEndpointFilter<LogUserActivityEndPointsFilter>();

        // GET: api/piscina/list/{customerId}
        group.MapGet("list/{customerId:guid}", async (Guid customerId, IPiscinaAppService appService) =>
            TypedResults.Ok(await appService.GetAllAsync(customerId)))
            .WithMetadata(new LogActivityMetadata("Piscina_GetAll", "Consulta del listado de piscinas."));

        // GET: api/piscina/{id}
        group.MapGet("{id:guid}", async (Guid id, IPiscinaAppService appService) =>
            TypedResults.Ok(await appService.GetByIdAsync(id)))
            .WithMetadata(new LogActivityMetadata("Piscina_GetById", "Consulta de una piscina por ID."));

        // POST: api/piscina
        group.MapPost("", async ([FromForm] PiscinaAddOrEditDTO DTO, IPiscinaAppService appService) =>
            TypedResults.Ok(await appService.AddAsync(DTO)))
            .DisableAntiforgery()
            .WithMetadata(new LogActivityMetadata("Piscina_Add", "Creación de una nueva piscina."));

        // PUT: api/piscina/{id}
        group.MapPut("{id:guid}", async (Guid id, [FromForm] PiscinaAddOrEditDTO DTO, IPiscinaAppService appService) =>
            TypedResults.Ok(await appService.UpdateAsync(id, DTO)))
            .DisableAntiforgery()
            .WithMetadata(new LogActivityMetadata("Piscina_Update", "Actualización de una piscina."));

        // DELETE: api/piscina/{id}
        group.MapDelete("{id:guid}", async (Guid id, IPiscinaAppService appService) =>
            TypedResults.Ok(await appService.DeleteAsync(id)))
            .WithMetadata(new LogActivityMetadata("Piscina_Delete", "Eliminación de una piscina."));
    }
}
