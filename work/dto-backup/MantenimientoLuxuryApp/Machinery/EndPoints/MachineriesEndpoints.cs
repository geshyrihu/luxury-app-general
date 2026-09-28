namespace MantenimientoLuxuryApp.Machinery.EndPoints;
/// <summary>Servicio o componente relacionado con fin.</summary>
public sealed class MachineriesEndpoints : IEndPointsModule
{
    /// <summary>Ejecuta la operación de fin.</summary>
    public void MapEndPoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/machineries")
                       .RequireAuthorization()
                       .AddEndpointFilter<LogUserActivityEndPointsFilter>();

        // GET: api/machineries/list-engine-systems/{customerId}
        group.MapGet("list-engine-systems/{customerId:guid}", async (Guid customerId, IMachineryAppService appService) =>
            TypedResults.Ok(await appService.ListEngineSystemsAsync(customerId)))
            .WithMetadata(new LogActivityMetadata("Machineries_ListEngineSystems", "Lista sistemas/agrupaciones de maquinaria."));

        // GET: api/machineries/inventario-completo/{customerId}
        group.MapGet("inventario-completo/{customerId:guid}", async (Guid customerId, IMachineryAppService appService) =>
            TypedResults.Ok(await appService.InventarioCompletoAsync(customerId)))
            .WithMetadata(new LogActivityMetadata("Machineries_InventarioCompleto", "Resumen completo del inventario de maquinaria."));

        // GET: api/machineries/{id}
        group.MapGet("{id:guid}", async (Guid id, IMachineryAppService appService) =>
            TypedResults.Ok(await appService.GetById(id)))
            .WithName("GetMachinery")
            .WithMetadata(new LogActivityMetadata("Machineries_GetById", "Consulta de maquinaria por ID."));

        // GET: api/machineries/fichatecnica/{id}
        group.MapGet("fichatecnica/{id:guid}", async (Guid id, IMachineryAppService appService) =>
            TypedResults.Ok(await appService.GetFichaTecnica(id)))
            .WithMetadata(new LogActivityMetadata("Machineries_GetFichaTecnica", "Consulta de ficha técnica de maquinaria."));

        // GET: api/machineries/get-all-card/{customerId}
        group.MapGet("get-all-card/{customerId:guid}", async (Guid customerId, [FromQuery] State status, [FromQuery] InventoryCategory inventoryCategory, IMachineryAppService appService) =>
            TypedResults.Ok(await appService.GetAllCardAsync(customerId, status, inventoryCategory)))
            .WithMetadata(new LogActivityMetadata("Machineries_GetAllCard", "Consulta de maquinaria en formato tarjetas."));

        // GET: api/machineries/get-all/{customerId}
        group.MapGet("get-all/{customerId:guid}", async (Guid customerId, [FromQuery] State status, [FromQuery] InventoryCategory inventoryCategory, IMachineryAppService appService) =>
            TypedResults.Ok(await appService.GetAllAsync(customerId, status, inventoryCategory)))
            .WithMetadata(new LogActivityMetadata("Machineries_GetAll", "Consulta de listado de maquinaria."));

        // GET: api/machineries/get-all-detail/{customerId}
        group.MapGet("get-all-detail/{customerId:guid}", async (Guid customerId, [FromQuery] State status, [FromQuery] InventoryCategory inventoryCategory, IMachineryAppService appService) =>
            TypedResults.Ok(await appService.GetAllMachineryDetailAsync(customerId, status, inventoryCategory)))
            .WithMetadata(new LogActivityMetadata("Machineries_GetAllDetail", "Consulta de listado detallado de maquinaria."));

        // POST: api/machineries
        group.MapPost("", async ([FromForm] MachineryAddOrEditDTO dto, IMachineryAppService appService) =>
            TypedResults.Ok(await appService.AddAsync(dto)))
            .DisableAntiforgery()
            .WithMetadata(new LogActivityMetadata("Machineries_Add", "Alta de maquinaria."));

        // GET: api/machineries/get-machinery-select-item/{id}
        group.MapGet("get-machinery-select-item/{id:guid}", async (Guid id, IMachineryAppService appService) =>
            TypedResults.Ok(await appService.GetMachinerySelectItemAsync(id)))
            .WithMetadata(new LogActivityMetadata("Machineries_GetSelectItem", "Consulta de maquinaria para selector."));

        // PUT: api/machineries/{id}
        group.MapPut("{id:guid}", async (Guid id, [FromForm] MachineryAddOrEditDTO dto, IMachineryAppService appService) =>
            TypedResults.Ok(await appService.UpdateAsync(id, dto)))
            .DisableAntiforgery()
            .WithMetadata(new LogActivityMetadata("Machineries_Update", "Actualización de maquinaria."));

        // DELETE: api/machineries/{id}
        group.MapDelete("{id:guid}", async (Guid id, IMachineryAppService appService) =>
            TypedResults.Ok(await appService.DeleteAsync(id)))
            .WithMetadata(new LogActivityMetadata("Machineries_Delete", "Baja de maquinaria."));

        // PUT: api/machineries/update-category
        group.MapPut("update-category", async (IMachineryAppService appService) =>
            TypedResults.Ok(await appService.UpdateCategoryAsync()))
            .WithMetadata(new LogActivityMetadata("Machineries_UpdateCategory", "Actualización masiva de categorías."));

        // POST: api/machineries/subir-documento/{machineryId}
        group.MapPost("subir-documento/{machineryId:guid}", async (Guid machineryId, IFormFile[] files, IMachineryAppService appService) =>
            TypedResults.Ok(await appService.SubirDocumentoAsync(machineryId, files)))
            .DisableAntiforgery()
            .WithMetadata(new LogActivityMetadata("Machineries_UploadDocument", "Subida de documentos de maquinaria."));

        // DELETE: api/machineries/delete-document/{id}
        group.MapDelete("delete-document/{id:guid}", async (Guid id, IMachineryAppService appService) =>
            TypedResults.Ok(await appService.DeleteDocumentAsync(id)))
            .WithMetadata(new LogActivityMetadata("Machineries_DeleteDocument", "Eliminación de documento de maquinaria."));

        // GET: api/machineries/get-autocompete-inv/{customerId}
        group.MapGet("get-autocompete-inv/{customerId:guid}", async (Guid customerId, IMachineryAppService appService) =>
            TypedResults.Ok(await appService.GetAutocompeteInvAsync(customerId)))
            .WithMetadata(new LogActivityMetadata("Machineries_GetAutocompleteInv", "Autocompletado de inventario de maquinaria."));

        // GET: api/machineries/actas-entrega/{customerId}
        group.MapGet("actas-entrega/{customerId:guid}", async (Guid customerId, IMachineryAppService appService) =>
            TypedResults.Ok(await appService.ActasEntregaAsync(customerId)))
            .WithMetadata(new LogActivityMetadata("Machineries_ActasEntrega", "Actas de entrega de maquinaria."));

        // GET: api/machineries/informe-pdf/{customerId}
        group.MapGet("informe-pdf/{customerId:guid}", async (Guid customerId, [FromQuery] State status, [FromQuery] InventoryCategory inventoryCategory, IMachineryAppService appService) =>
            TypedResults.Ok(await appService.InformePdfAsync(customerId, status, inventoryCategory)))
            .WithMetadata(new LogActivityMetadata("Machineries_InformePdf", "Informe PDF de inventario de maquinaria."));

        // GET: api/machineries/service-history/{machineryId}
        group.MapGet("service-history/{machineryId:guid}", async (Guid machineryId, IMachineryAppService appService) =>
            TypedResults.Ok(await appService.GetListServiceHistory(machineryId)))
            .WithMetadata(new LogActivityMetadata("Machineries_ServiceHistory", "Historial de servicios de maquinaria."));
    }
}
