namespace MantenimientoLuxuryApp.FireEquipment.EndPoints;
/// <summary>Servicio o componente relacionado con fin.</summary>
public sealed class FireEquipmentResolveEndpoints : IEndPointsModule
{
    /// <summary>Ejecuta la operación de fin.</summary>
    public void MapEndPoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/fire-equipment-resolve")
                       .AddEndpointFilter<LogUserActivityEndPointsFilter>();

    }
}
