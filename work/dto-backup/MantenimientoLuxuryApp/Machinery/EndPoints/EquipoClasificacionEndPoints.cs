namespace MantenimientoLuxuryApp.Machinery.EndPoints;
/// <summary>Servicio o componente relacionado con fin.</summary>
public sealed class EquipoClasificacionEndPoints : IEndPointsModule
{
    /// <summary>Ejecuta la operación de fin.</summary>
    public void MapEndPoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/equipo-clasificacion")
                       .RequireAuthorization(new AuthorizeAttribute
                       {
                           AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme,
                           Roles = "SuperUsuario"
                       })
                       .AddEndpointFilter<LogUserActivityEndPointsFilter>();

        // GET: api/equipo-clasificacion/{id}
        group.MapGet("{id:guid}", async (Guid id, IEquipoClasificacionAppService appService) =>
            TypedResults.Ok(await appService.GetByIdAsync(id)))
            .WithName("GetEquipoClasificacion")
            .WithMetadata(new LogActivityMetadata("EquipoClasificacion_GetById", "Consulta de clasificación de equipo por ID."));

        // GET: api/equipo-clasificacion
        group.MapGet("", async (IEquipoClasificacionAppService appService) =>
            TypedResults.Ok(await appService.GetAllAsync()))
            .WithMetadata(new LogActivityMetadata("EquipoClasificacion_GetAll", "Consulta de todas las clasificaciones de equipo."));

        // POST: api/equipo-clasificacion
        group.MapPost("", async (EquipoClasificacionAddOrEditDTO DTO, IEquipoClasificacionAppService appService) =>
            TypedResults.Ok(await appService.AddAsync(DTO)))
            .WithMetadata(new LogActivityMetadata("EquipoClasificacion_Add", "Creación de nueva clasificación de equipo."));

        // PUT: api/equipo-clasificacion/{id}
        group.MapPut("{id:guid}", async (Guid id, EquipoClasificacionAddOrEditDTO DTO, IEquipoClasificacionAppService appService) =>
            TypedResults.Ok(await appService.UpdateAsync(id, DTO)))
            .WithMetadata(new LogActivityMetadata("EquipoClasificacion_Update", "Actualización de clasificación de equipo."));

        // DELETE: api/equipo-clasificacion/{id}
        group.MapDelete("{id:guid}", async (Guid id, IEquipoClasificacionAppService appService) =>
            TypedResults.Ok(await appService.DeleteByIdAsync(id)))
            .WithMetadata(new LogActivityMetadata("EquipoClasificacion_Delete", "Eliminación de clasificación de equipo."));
    }
}
