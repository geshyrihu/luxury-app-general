namespace MantenimientoLuxuryApp.MachineryAsset.Interfaces;
/// <summary>Interfaz del servicio de aplicación servicio.</summary>
public interface IMachineryAssetAppService
{
    /// <summary>Obtiene la lista de activos de maquinaria registrados para un cliente.</summary>
    Task<ApiResponseDTO<List<object>>> ListAsync(Guid customerId);
}

