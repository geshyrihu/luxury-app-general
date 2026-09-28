namespace MantenimientoLuxuryApp.CalendariosMaestroEquipo.EndPoints;
/// <summary>Servicio o componente relacionado con fin.</summary>
public sealed class CalendarioMaestroEndpoints : IEndPointsModule
{
    /// <summary>Ejecuta la operación de fin.</summary>
    public void MapEndPoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/calendario-maestro")
                       //.RequireAuthorization("SoloSuperUsuario")
                       .AddEndpointFilter<LogUserActivityEndPointsFilter>();

        // GET: api/calendario-maestro/{id:guid}
        group.MapGet("{id:guid}", async (Guid id, ICalendarioMaestroAppService dataService) =>
            TypedResults.Ok(await dataService.GetAsyncByIdAsync(id)))
            .WithName("GetCalendarioMaestro")
            .WithMetadata(new LogActivityMetadata("CalendarioMaestro_GetById", "Consulta de calendario maestro por ID."));

        // GET: api/calendario-maestro/list
        group.MapGet("list", async (ICalendarioMaestroAppService dataService) =>
            TypedResults.Ok(await dataService.GetAllAsync()))
            .WithMetadata(new LogActivityMetadata("CalendarioMaestro_GetAll", "Consulta de listado de calendarios maestros."));

        // POST: api/calendario-maestro
        group.MapPost("", async (CalendarioMaestroAddOrEditDTO DTO, ICalendarioMaestroAppService dataService) =>
        {
            var result = await dataService.AddAsync(DTO);
            return TypedResults.CreatedAtRoute(result, "GetCalendarioMaestro", new { id = result.Data.Id });
        })
        .WithMetadata(new LogActivityMetadata("CalendarioMaestro_Add", "Creación de nuevo calendario maestro."));

        // PUT: api/calendario-maestro/{id:guid}
        group.MapPut("{id:guid}", async (Guid id, CalendarioMaestroAddOrEditDTO DTO, ICalendarioMaestroAppService dataService) =>
            TypedResults.Ok(await dataService.UpdateAsync(id, DTO)))
            .WithMetadata(new LogActivityMetadata("CalendarioMaestro_Update", "Actualización de calendario maestro."));

        // DELETE: api/calendario-maestro/{id:guid}
        group.MapDelete("{id:guid}", async (Guid id, ICalendarioMaestroAppService dataService) =>
            TypedResults.Ok(await dataService.DeleteAsync(id)))
            .WithMetadata(new LogActivityMetadata("CalendarioMaestro_Delete", "Eliminación de calendario maestro."));
    }
}
