namespace MantenimientoLuxuryApp.MaintenanceLogs.EndPoints;
/// <summary>Servicio o componente relacionado con fin.</summary>
public sealed class BitacoraMantenimientoEndpoints : IEndPointsModule
{
    /// <summary>Ejecuta la operación de fin.</summary>
    public void MapEndPoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/bitacora-mantenimiento")
                       .AddEndpointFilter<LogUserActivityEndPointsFilter>();

        // GET: api/bitacora-mantenimiento/{id:guid}
        group.MapGet("{id:guid}", async (int id, IBitacoraMantenimientoAppService dataService) =>
            TypedResults.Ok(await dataService.FindByIdAsync(id)))
            .WithName("GetBitacoraMantenimiento")
            .WithMetadata(new LogActivityMetadata("BitacoraMantenimiento_GetById", "Consulta de bitácora de mantenimiento por ID."));

        // POST: api/bitacora-mantenimiento
        group.MapPost("", async (BitacoraMantenimientoAddOrEditDTO DTO, IBitacoraMantenimientoAppService dataService) =>
        {
            var result = await dataService.AddAsync(DTO);
            return TypedResults.CreatedAtRoute(result, "GetBitacoraMantenimiento", new { id = result.Data.Id });
        })
        .WithMetadata(new LogActivityMetadata("BitacoraMantenimiento_Add", "Creación de nueva bitácora de mantenimiento."));

        // DELETE: api/bitacora-mantenimiento/{id:guid}
        group.MapDelete("{id:guid}", async (Guid id, IBitacoraMantenimientoAppService dataService) =>
            TypedResults.Ok(await dataService.DeleteByIdAsync(id)))
            .WithMetadata(new LogActivityMetadata("BitacoraMantenimiento_Delete", "Eliminación de bitácora de mantenimiento."));
    }
}
