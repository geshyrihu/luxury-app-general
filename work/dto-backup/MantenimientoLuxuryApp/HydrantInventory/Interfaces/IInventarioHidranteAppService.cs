namespace MantenimientoLuxuryApp.HydrantInventory.Interfaces;
/// <summary>Interfaz del servicio de aplicación servicio.</summary>
public interface IInventarioHidranteAppService
{
    Task<ApiResponseDTO<InventarioHidranteDTO[]>> GetAllAsync(Guid customerId);
    Task<ApiResponseDTO<InventarioHidranteAddOrEditDTO>> GetByIdAsync(Guid id);
    Task<ApiResponseDTO<InventarioHidrante>> AddAsync(InventarioHidranteAddOrEditDTO dto);
    Task<ApiResponseDTO<InventarioHidrante>> UpdateAsync(Guid id, InventarioHidranteAddOrEditDTO dto);
    Task<ApiResponseDTO<bool>> DeleteByIdAsync(Guid id);
}
