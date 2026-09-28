namespace MantenimientoLuxuryApp.EquipmentInspections.EndPoints;
/// <summary>Servicio o componente relacionado con fin.</summary>
public sealed class EquipmentQrLabelsEndPoints : IEndPointsModule
{
    /// <summary>Ejecuta la operación de fin.</summary>
    public void MapEndPoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/equipment-qr-labels")
                       .RequireAuthorization()
                       .AddEndpointFilter<LogUserActivityEndPointsFilter>();

        // GET: api/equipment-qr-labels/by-machinery/{machineryId}
        group.MapGet("by-machinery/{machineryId:guid}", async (Guid machineryId, IEquipmentQrLabelAppService appService) =>
            TypedResults.Ok(await appService.GetByMachineryAsync(machineryId)))
            .WithMetadata(new LogActivityMetadata("EquipmentQrLabel_GetByMachinery", "Consulta de etiquetas QR por maquinaria."));

        // GET: api/equipment-qr-labels/{id}
        group.MapGet("{id:guid}", async (Guid id, IEquipmentQrLabelAppService appService) =>
            TypedResults.Ok(await appService.GetByIdAsync(id)))
            .WithMetadata(new LogActivityMetadata("EquipmentQrLabel_GetById", "Consulta de una etiqueta QR por ID."));

        // POST: api/equipment-qr-labels
        group.MapPost("", async (EquipmentQrLabelAddOrEditDTO dto, IEquipmentQrLabelAppService appService) =>
            TypedResults.Ok(await appService.AddAsync(dto)))
            .WithMetadata(new LogActivityMetadata("EquipmentQrLabel_Add", "Creacion de una etiqueta QR para equipo."));

        // POST: api/equipment-qr-labels/{id}/regenerate
        group.MapPost("{id:guid}/regenerate", async (Guid id, IEquipmentQrLabelAppService appService) =>
            TypedResults.Ok(await appService.RegenerateAsync(id)))
            .WithMetadata(new LogActivityMetadata("EquipmentQrLabel_Regenerate", "Regeneracion de codigo y deep link de una etiqueta QR."));

        // GET: api/equipment-qr-labels/{id}/download
        group.MapGet("{id:guid}/download", async (Guid id, IEquipmentQrLabelAppService appService) =>
            TypedResults.Ok(await appService.DownloadAsync(id)))
            .WithMetadata(new LogActivityMetadata("EquipmentQrLabel_Download", "Consulta del payload de impresion de una etiqueta QR."));

        // POST: api/equipment-qr-labels/download-batch
        group.MapPost("download-batch", async (EquipmentQrBatchDownloadDTO dto, IEquipmentQrLabelAppService appService) =>
            TypedResults.Ok(await appService.DownloadBatchAsync(dto)))
            .WithMetadata(new LogActivityMetadata("EquipmentQrLabel_DownloadBatch", "Consulta del payload de impresion masiva de etiquetas QR."));

        // GET: api/equipment-qr-labels/resolve/{code}
        group.MapGet("resolve/{code}", async (string code, IEquipmentQrLabelAppService appService) =>
            TypedResults.Ok(await appService.ResolveAsync(code)))
            .WithMetadata(new LogActivityMetadata("EquipmentQrLabel_Resolve", "Resolucion de etiqueta QR a contexto de inspeccion."));
    }
}
