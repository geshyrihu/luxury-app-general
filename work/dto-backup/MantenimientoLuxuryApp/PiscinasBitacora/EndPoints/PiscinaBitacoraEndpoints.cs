namespace MantenimientoLuxuryApp.PiscinasBitacora.EndPoints;
/// <summary>Servicio o componente relacionado con fin.</summary>
public sealed class PiscinaBitacoraEndpoints : IEndPointsModule
{
    /// <summary>Ejecuta la operación de fin.</summary>
    public void MapEndPoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/piscina-bitacora")
                       .RequireAuthorization()
                       .AddEndpointFilter<LogUserActivityEndPointsFilter>();

        // GET: api/piscina-bitacora/list/{piscinaId}
        group.MapGet("list/{piscinaId:guid}", async (Guid piscinaId, IPiscinaBitacoraAppService appService) =>
            TypedResults.Ok(await appService.GetAllAsync(piscinaId)))
            .WithMetadata(new LogActivityMetadata("PiscinaBitacora_GetAll", "Consulta del listado de bitácora de piscina."));

        // GET: api/piscina-bitacora/{id}
        group.MapGet("{id:guid}", async (Guid id, IPiscinaBitacoraAppService appService) =>
            TypedResults.Ok(await appService.GetByIdAsync(id)))
            .WithMetadata(new LogActivityMetadata("PiscinaBitacora_GetById", "Consulta de un registro de bitácora de piscina por ID."));

        // POST: api/piscina-bitacora
        group.MapPost("", async (PiscinaBitacoraAddOrEditDTO DTO, IPiscinaBitacoraAppService appService) =>
            TypedResults.Ok(await appService.AddAsync(DTO)))
            .WithMetadata(new LogActivityMetadata("PiscinaBitacora_Add", "Creación de un nuevo registro de bitácora de piscina."));

        // PUT: api/piscina-bitacora/{id}
        group.MapPut("{id:guid}", async (Guid id, PiscinaBitacoraAddOrEditDTO DTO, IPiscinaBitacoraAppService appService) =>
            TypedResults.Ok(await appService.UpdateAsync(id, DTO)))
            .WithMetadata(new LogActivityMetadata("PiscinaBitacora_Update", "Actualización de un registro de bitácora de piscina."));

        // DELETE: api/piscina-bitacora/{id}
        group.MapDelete("{id:guid}", async (Guid id, IPiscinaBitacoraAppService appService) =>
            TypedResults.Ok(await appService.DeleteByIdAsync(id)))
            .WithMetadata(new LogActivityMetadata("PiscinaBitacora_Delete", "Eliminación de un registro de bitácora de piscina."));

        // GET: api/piscina-bitacora/export-excel/{piscinaId}
        group.MapGet("export-excel/{piscinaId:guid}", async (Guid piscinaId, IPiscinaBitacoraAppService appService) =>
            TypedResults.Ok(await appService.ExportExcelAsync(piscinaId)))
            .WithMetadata(new LogActivityMetadata("PiscinaBitacora_ExportExcel", "Exportación a Excel de la bitácora de la alberca."));

        // POST: api/piscina-bitacora/import-excel/{piscinaId}
        group.MapPost("import-excel/{piscinaId:guid}", async (Guid piscinaId, PiscinaBitacoraImportRequest request, IPiscinaBitacoraAppService appService) =>
            TypedResults.Ok(await appService.ImportExcelAsync(piscinaId, request.ApplicationUserId, request.Rows)))
            .WithMetadata(new LogActivityMetadata("PiscinaBitacora_ImportExcel", "Importación de lecturas de bitácora desde Excel (valida duplicados)."));
    }
}
