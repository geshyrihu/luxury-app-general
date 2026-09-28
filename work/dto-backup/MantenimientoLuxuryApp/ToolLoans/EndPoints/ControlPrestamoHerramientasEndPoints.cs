namespace MantenimientoLuxuryApp.BitacorasExtintor.EndPoints;
/// <summary>Servicio o componente relacionado con fin.</summary>
public sealed class ControlPrestamoHerramientasEndPoints : IEndPointsModule
{
    /// <summary>Ejecuta la operación de fin.</summary>
    public void MapEndPoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/control-prestamo-herramientas")
                       .RequireAuthorization()
                       .AddEndpointFilter<LogUserActivityEndPointsFilter>();

        // GET: api/control-prestamo-herramientas/list/{customerId}?...
        group.MapGet("list/{customerId:guid}", async (Guid customerId, PaginationCommonDTO paginator, IControlPrestamoHerramientaAppService dataService) =>
            TypedResults.Ok(await dataService.GetAllIndexDTO(customerId, paginator)))
            .WithMetadata(new LogActivityMetadata("ControlPrestamoHerramientas_GetAll", "Consulta del listado de prestamos de herramientas."));

        // GET: api/control-prestamo-herramientas/{id}
        group.MapGet("{id:guid}", async (Guid id, IControlPrestamoHerramientaAppService dataService) =>
            TypedResults.Ok(await dataService.GetById(id)))
            .WithName("ToolLoan")
            .WithMetadata(new LogActivityMetadata("ControlPrestamoHerramientas_GetById", "Consulta de un prestamo de herramienta por ID."));

        // PUT: api/control-prestamo-herramientas/{id}
        group.MapPut("{id:guid}", async (Guid id, ControlPrestamoHerramientaAddOrEditDTO DTO, IControlPrestamoHerramientaAppService dataService) =>
            TypedResults.Ok(await dataService.UpdateAsync(id, DTO)))
            .WithMetadata(new LogActivityMetadata("ControlPrestamoHerramientas_Update", "Actualizacion de un prestamo de herramienta."));

        // POST: api/control-prestamo-herramientas
        group.MapPost("", async (ControlPrestamoHerramientaAddOrEditDTO DTO, IControlPrestamoHerramientaAppService dataService) =>
            TypedResults.Ok(await dataService.AddAsync(DTO)))
            .WithMetadata(new LogActivityMetadata("ControlPrestamoHerramientas_Add", "Creacion de un nuevo prestamo de herramienta."));

        // DELETE: api/control-prestamo-herramientas/{id}
        group.MapDelete("{id:guid}", async (Guid id, IControlPrestamoHerramientaAppService dataService) =>
            TypedResults.Ok(await dataService.DeleteByIdAsync(id)))
            .WithMetadata(new LogActivityMetadata("ControlPrestamoHerramientas_Delete", "Eliminacion de un prestamo de herramienta."));
    }
}
