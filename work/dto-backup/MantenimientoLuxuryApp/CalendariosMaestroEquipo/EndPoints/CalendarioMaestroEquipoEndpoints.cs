namespace MantenimientoLuxuryApp.CalendariosMaestroEquipo.EndPoints;
/// <summary>Servicio o componente relacionado con fin.</summary>
public sealed class CalendarioMaestroEquipoEndpoints : IEndPointsModule
{
    /// <summary>Ejecuta la operación de fin.</summary>
    public void MapEndPoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/calendario-maestro-equipo")
                       .RequireAuthorization(new AuthorizeAttribute { AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "SuperUsuario" })
                       .AddEndpointFilter<LogUserActivityEndPointsFilter>();

        // GET: api/calendario-maestro-equipo/{id:guid}
        group.MapGet("{id:guid}", async (Guid id, ICalendarioMaestroEquipoAppService dataService) =>
            TypedResults.Ok(await dataService.GetByIdAsync(id)))
            .WithName("GetCalendarioMaestroEquipo")
            .WithMetadata(new LogActivityMetadata("CalendarioMaestroEquipo_GetById", "Consulta de calendario maestro de equipo por ID."));

        // GET: api/calendario-maestro-equipo
        group.MapGet("", async (ICalendarioMaestroEquipoAppService dataService) =>
            TypedResults.Ok(await dataService.GetAllAsync()))
            .WithMetadata(new LogActivityMetadata("CalendarioMaestroEquipo_GetAll", "Consulta de listado de calendarios maestros de equipo."));

        // POST: api/calendario-maestro-equipo
        group.MapPost("", async (CalendarioMaestroEquipoAddOrEditDTO DTO, ICalendarioMaestroEquipoAppService dataService) =>
        {
            var result = await dataService.AddAsync(DTO);
            return TypedResults.CreatedAtRoute(result, "GetCalendarioMaestroEquipo", new { id = result.Data.Id });
        })
        .WithMetadata(new LogActivityMetadata("CalendarioMaestroEquipo_Add", "Creación de nuevo calendario maestro de equipo."));

        // PUT: api/calendario-maestro-equipo/{id:guid}
        group.MapPut("{id:guid}", async (Guid id, CalendarioMaestroEquipoAddOrEditDTO DTO, ICalendarioMaestroEquipoAppService dataService) =>
            TypedResults.Ok(await dataService.UpdateAsync(id, DTO)))
            .WithMetadata(new LogActivityMetadata("CalendarioMaestroEquipo_Update", "Actualización de calendario maestro de equipo."));

        // DELETE: api/calendario-maestro-equipo/{id:guid}
        group.MapDelete("{id:guid}", async (Guid id, ICalendarioMaestroEquipoAppService dataService) =>
            TypedResults.Ok(await dataService.DeleteByIdAsync(id)))
            .WithMetadata(new LogActivityMetadata("CalendarioMaestroEquipo_Delete", "Eliminación de calendario maestro de equipo."));
    }
}
