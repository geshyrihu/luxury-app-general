namespace MantenimientoLuxuryApp.SmokeDetectorInventory.Interfaces;
/// <summary>Interfaz del servicio de aplicación servicio.</summary>
public interface IInventarioDetectorHumoAppService
{
    Task<ApiResponseDTO<InventarioDetectorHumoDTO[]>> GetAllAsync(Guid customerId);
    Task<ApiResponseDTO<InventarioDetectorHumoAddOrEditDTO>> GetByIdAsync(Guid id);
    Task<ApiResponseDTO<InventarioDetectorHumo>> AddAsync(InventarioDetectorHumoAddOrEditDTO dto);
    Task<ApiResponseDTO<InventarioDetectorHumo>> UpdateAsync(Guid id, InventarioDetectorHumoAddOrEditDTO dto);
    Task<ApiResponseDTO<bool>> DeleteByIdAsync(Guid id);
    Task<ApiResponseDTO<bool>> DeleteAllByCustomerAsync(Guid customerId);
    Task<ImportPropertiesResultDTO> ImportFromExcelAsync(Guid customerId, IFormFile file);
}
