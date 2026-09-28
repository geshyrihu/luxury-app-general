namespace MantenimientoLuxuryApp.RecepcionPipasAgua.EndPoints;
/// <summary>Servicio o componente relacionado con fin.</summary>
public sealed class RecepcionPipasAguaEndpoints : IEndPointsModule
{
    /// <summary>Ejecuta la operación de fin.</summary>
    public void MapEndPoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/recepcion-pipas-agua")
                       .AddEndpointFilter<LogUserActivityEndPointsFilter>();

        // GET: api/recepcion-pipas-agua/list/{customerId}
        group.MapGet("list/{customerId:guid}", async (Guid customerId, IRecepcionPipasAguaAppService appService) =>
            TypedResults.Ok(await appService.GetAllAsync(customerId)))
            .WithMetadata(new LogActivityMetadata("RecepcionPipasAgua_GetAll", "Consulta del listado de recepción de pipas de agua."));

        // GET: api/recepcion-pipas-agua/{id}
        group.MapGet("{id:guid}", async (Guid id, IRecepcionPipasAguaAppService appService) =>
            TypedResults.Ok(await appService.GetByIdAsync(id)))
            .WithMetadata(new LogActivityMetadata("RecepcionPipasAgua_GetById", "Consulta de un registro de recepción de pipa de agua por ID."));

        // POST: api/recepcion-pipas-agua
        group.MapPost("", async ([FromForm] RecepcionPipaAguaAddDTO DTO, IRecepcionPipasAguaAppService appService) =>
            TypedResults.Ok(await appService.AddAsync(DTO)))
            .DisableAntiforgery()
            .WithMetadata(new LogActivityMetadata("RecepcionPipasAgua_Add", "Registro de una nueva recepción de pipa de agua."));

        // PUT: api/recepcion-pipas-agua/{id}
        group.MapPut("{id:guid}", async (Guid id, [FromForm] RecepcionPipaAguaUpdateDTO DTO, IRecepcionPipasAguaAppService appService) =>
            TypedResults.Ok(await appService.UpdateAsync(id, DTO)))
            .DisableAntiforgery()
            .WithMetadata(new LogActivityMetadata("RecepcionPipasAgua_Update", "Actualización de un registro de recepción de pipa de agua."));

        // DELETE: api/recepcion-pipas-agua/{id}
        group.MapDelete("{id:guid}", async (Guid id, IRecepcionPipasAguaAppService appService) =>
            TypedResults.Ok(await appService.DeleteByIdAsync(id)))
            .WithMetadata(new LogActivityMetadata("RecepcionPipasAgua_Delete", "Eliminación de un registro de recepción de pipa de agua."));
    }
}
