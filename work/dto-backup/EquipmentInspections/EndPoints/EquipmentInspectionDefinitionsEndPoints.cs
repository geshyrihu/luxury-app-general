namespace MantenimientoLuxuryApp.EquipmentInspections.EndPoints;
/// <summary>Servicio o componente relacionado con fin.</summary>
public sealed class EquipmentInspectionDefinitionsEndPoints : IEndPointsModule
{
    /// <summary>Ejecuta la operación de fin.</summary>
    public void MapEndPoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/equipment-inspection-definitions")
                       .RequireAuthorization()
                       .AddEndpointFilter<LogUserActivityEndPointsFilter>();

        // GET: api/equipment-inspection-definitions/by-machinery/{machineryId}
        group.MapGet("by-machinery/{machineryId:guid}", async (Guid machineryId, IEquipmentInspectionDefinitionAppService appService) =>
            TypedResults.Ok(await appService.GetByMachineryAsync(machineryId)))
            .WithMetadata(new LogActivityMetadata("EquipmentInspectionDefinition_GetByMachinery", "Consulta de definiciones de inspeccion por maquinaria."));

        // GET: api/equipment-inspection-definitions/{id}
        group.MapGet("{id:guid}", async (Guid id, IEquipmentInspectionDefinitionAppService appService) =>
            TypedResults.Ok(await appService.GetByIdAsync(id)))
            .WithMetadata(new LogActivityMetadata("EquipmentInspectionDefinition_GetById", "Consulta de una definicion de inspeccion por ID."));

        // POST: api/equipment-inspection-definitions
        group.MapPost("", async (EquipmentInspectionDefinitionAddOrEditDTO dto, IEquipmentInspectionDefinitionAppService appService) =>
            TypedResults.Ok(await appService.AddAsync(dto)))
            .WithMetadata(new LogActivityMetadata("EquipmentInspectionDefinition_Add", "Creacion de una definicion de inspeccion de equipo."));

        // PUT: api/equipment-inspection-definitions/{id}
        group.MapPut("{id:guid}", async (Guid id, EquipmentInspectionDefinitionAddOrEditDTO dto, IEquipmentInspectionDefinitionAppService appService) =>
            TypedResults.Ok(await appService.UpdateAsync(id, dto)))
            .WithMetadata(new LogActivityMetadata("EquipmentInspectionDefinition_Update", "Actualizacion de una definicion de inspeccion de equipo."));

        // PUT: api/equipment-inspection-definitions/{id}/active/{isActive}
        group.MapPut("{id:guid}/active/{isActive:bool}", async (Guid id, bool isActive, IEquipmentInspectionDefinitionAppService appService) =>
            TypedResults.Ok(await appService.ToggleActiveAsync(id, isActive)))
            .WithMetadata(new LogActivityMetadata("EquipmentInspectionDefinition_ToggleActive", "Cambio de estado activo de una definicion de inspeccion."));

        // DELETE: api/equipment-inspection-definitions/{id}
        group.MapDelete("{id:guid}", async (Guid id, IEquipmentInspectionDefinitionAppService appService) =>
            TypedResults.Ok(await appService.DeleteByIdAsync(id)))
            .WithMetadata(new LogActivityMetadata("EquipmentInspectionDefinition_Delete", "Eliminacion de una definicion de inspeccion de equipo."));
    }
}
