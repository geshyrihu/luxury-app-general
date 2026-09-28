namespace MantenimientoLuxuryApp.EquipmentInspections.Interfaces;
/// <summary>Interfaz del servicio de aplicación servicio.</summary>
public interface IEquipmentQrLabelAppService
{
    Task<ApiResponseDTO<List<EquipmentQrLabelListDTO>>> GetByMachineryAsync(Guid machineryId);
    Task<ApiResponseDTO<EquipmentQrLabelDTO>> GetByIdAsync(Guid id);
    Task<ApiResponseDTO<EquipmentQrLabelDTO>> AddAsync(EquipmentQrLabelAddOrEditDTO dto);
    Task<ApiResponseDTO<EquipmentQrLabelDTO>> RegenerateAsync(Guid id);
    Task<ApiResponseDTO<EquipmentQrDownloadItemDTO>> DownloadAsync(Guid id);
    Task<ApiResponseDTO<List<EquipmentQrDownloadItemDTO>>> DownloadBatchAsync(EquipmentQrBatchDownloadDTO dto);
    Task<ApiResponseDTO<EquipmentQrResolveDTO>> ResolveAsync(string code);
}
