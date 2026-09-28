namespace MantenimientoLuxuryApp.Meters.EndPoints;
/// <summary>Servicio o componente relacionado con fin.</summary>
public sealed class MedidorCategoriaEndPoints : IEndPointsModule
{
    /// <summary>Ejecuta la operación de fin.</summary>
    public void MapEndPoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/medidor-categoria")
                       .RequireAuthorization(new AuthorizeAttribute
                       {
                           AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme,
                           Roles = "SuperUsuario"
                       })
                       .AddEndpointFilter<LogUserActivityEndPointsFilter>();

        // GET: api/medidor-categoria/{id}
        group.MapGet("{id:guid}", async (Guid id, IMedidorCategoriaAppService appService) =>
            TypedResults.Ok(await appService.GetByIdAsync(id)))
            .WithName("GetMedidorCategoria")
            .WithMetadata(new LogActivityMetadata("MedidorCategoria_GetById", "Consulta de categoría de medidor por ID."));

        // GET: api/medidor-categoria
        group.MapGet("", async (IMedidorCategoriaAppService appService) =>
            TypedResults.Ok(await appService.GetAllAsync()))
            .WithMetadata(new LogActivityMetadata("MedidorCategoria_GetAll", "Consulta de todas las categorías de medidor."));

        // POST: api/medidor-categoria
        group.MapPost("", async (MedidorCategoriaAddOrEditDTO DTO, IMedidorCategoriaAppService appService) =>
            TypedResults.Ok(await appService.AddAsync(DTO)))
            .WithMetadata(new LogActivityMetadata("MedidorCategoria_Add", "Creación de nueva categoría de medidor."));

        // PUT: api/medidor-categoria/{id}
        group.MapPut("{id:guid}", async (Guid id, MedidorCategoriaAddOrEditDTO DTO, IMedidorCategoriaAppService appService) =>
            TypedResults.Ok(await appService.UpdateAsync(id, DTO)))
            .WithMetadata(new LogActivityMetadata("MedidorCategoria_Update", "Actualización de categoría de medidor."));

        // DELETE: api/medidor-categoria/{id}
        group.MapDelete("{id:guid}", async (Guid id, IMedidorCategoriaAppService appService) =>
            TypedResults.Ok(await appService.DeleteByIdAsync(id)))
            .WithMetadata(new LogActivityMetadata("MedidorCategoria_Delete", "Eliminación de categoría de medidor."));
    }
}
