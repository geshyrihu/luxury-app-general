namespace MantenimientoLuxuryApp.ManualCallPointInventory.Interfaces;
/// <summary>Interfaz del servicio de aplicación servicio.</summary>
public interface IInventarioEstacionManualAppService
{
    Task<ApiResponseDTO<InventarioEstacionManualDTO[]>> GetAllAsync(Guid customerId);
    Task<ApiResponseDTO<InventarioEstacionManualAddOrEditDTO>> GetByIdAsync(Guid id);
    Task<ApiResponseDTO<InventarioEstacionManual>> AddAsync(InventarioEstacionManualAddOrEditDTO dto);
    Task<ApiResponseDTO<InventarioEstacionManual>> UpdateAsync(Guid id, InventarioEstacionManualAddOrEditDTO dto);
    Task<ApiResponseDTO<bool>> DeleteByIdAsync(Guid id);
    Task<ApiResponseDTO<bool>> DeleteAllByCustomerAsync(Guid customerId);
    Task<ImportPropertiesResultDTO> ImportFromExcelAsync(Guid customerId, IFormFile file);
}
