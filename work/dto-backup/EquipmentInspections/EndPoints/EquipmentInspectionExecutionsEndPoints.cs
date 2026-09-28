namespace MantenimientoLuxuryApp.EquipmentInspections.EndPoints;
/// <summary>Servicio o componente relacionado con fin.</summary>
public sealed class EquipmentInspectionExecutionsEndPoints : IEndPointsModule
{
    /// <summary>Ejecuta la operación de fin.</summary>
    public void MapEndPoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/equipment-inspection-executions")
                       .RequireAuthorization()
                       .AddEndpointFilter<LogUserActivityEndPointsFilter>();

        // GET: api/equipment-inspection-executions/pending/{customerId}
        group.MapGet("pending/{customerId:guid}", async (Guid customerId, IEquipmentInspectionExecutionAppService appService) =>
            TypedResults.Ok(await appService.GetPendingAsync(customerId)))
            .WithMetadata(new LogActivityMetadata("EquipmentInspectionExecution_GetPending", "Consulta de inspecciones de equipo pendientes."));

        // GET: api/equipment-inspection-executions/by-machinery/{machineryId}
        group.MapGet("by-machinery/{machineryId:guid}", async (Guid machineryId, IEquipmentInspectionExecutionAppService appService) =>
            TypedResults.Ok(await appService.GetByMachineryAsync(machineryId)))
            .WithMetadata(new LogActivityMetadata("EquipmentInspectionExecution_GetByMachinery", "Consulta del historial de inspecciones por maquinaria."));

        // GET: api/equipment-inspection-executions/{id}
        group.MapGet("{id:guid}", async (Guid id, IEquipmentInspectionExecutionAppService appService) =>
            TypedResults.Ok(await appService.GetByIdAsync(id)))
            .WithMetadata(new LogActivityMetadata("EquipmentInspectionExecution_GetById", "Consulta del detalle de una ejecucion de inspeccion de equipo."));

        // POST: api/equipment-inspection-executions/start-from-qr
        group.MapPost("start-from-qr", async (EquipmentInspectionExecutionStartFromQrDTO dto, IEquipmentInspectionExecutionAppService appService) =>
            TypedResults.Ok(await appService.StartFromQrAsync(dto)))
            .WithMetadata(new LogActivityMetadata("EquipmentInspectionExecution_StartFromQr", "Inicio de una inspeccion de equipo desde QR."));

        // POST: api/equipment-inspection-executions/start-manual/{definitionId}
        group.MapPost("start-manual/{definitionId:guid}", async (Guid definitionId, IEquipmentInspectionExecutionAppService appService) =>
            TypedResults.Ok(await appService.StartManualAsync(definitionId)))
            .WithMetadata(new LogActivityMetadata("EquipmentInspectionExecution_StartManual", "Inicio manual de una inspeccion de equipo."));

        // PUT: api/equipment-inspection-executions/{id}/complete
        group.MapPut("{id:guid}/complete", async (Guid id, EquipmentInspectionExecutionCompleteDTO dto, IEquipmentInspectionExecutionAppService appService) =>
            TypedResults.Ok(await appService.CompleteAsync(id, dto)))
            .WithMetadata(new LogActivityMetadata("EquipmentInspectionExecution_Complete", "Cierre de una ejecucion de inspeccion de equipo."));

        // PUT: api/equipment-inspection-executions/{id}/administrative-update
        group.MapPut("{id:guid}/administrative-update", async (Guid id, EquipmentInspectionExecutionAdministrativeUpdateDTO dto, IEquipmentInspectionExecutionAppService appService) =>
            TypedResults.Ok(await appService.AdministrativeUpdateAsync(id, dto)))
            .WithMetadata(new LogActivityMetadata("EquipmentInspectionExecution_AdministrativeUpdate", "Ajuste administrativo de una inspeccion cerrada de equipo."));
    }
}
