namespace MantenimientoLuxuryApp.EquipmentInspections.Interfaces;
/// <summary>Interfaz del servicio de aplicación servicio.</summary>
public interface IEquipmentInspectionExecutionAppService
{
    Task<ApiResponseDTO<List<EquipmentInspectionExecutionListDTO>>> GetPendingAsync(Guid customerId);
    Task<ApiResponseDTO<List<EquipmentInspectionExecutionListDTO>>> GetByMachineryAsync(Guid machineryId);
    Task<ApiResponseDTO<EquipmentInspectionExecutionDetailDTO>> GetByIdAsync(Guid id);
    Task<ApiResponseDTO<EquipmentInspectionExecutionDetailDTO>> StartFromQrAsync(EquipmentInspectionExecutionStartFromQrDTO dto);
    Task<ApiResponseDTO<EquipmentInspectionExecutionDetailDTO>> StartManualAsync(Guid definitionId);
    Task<ApiResponseDTO<EquipmentInspectionExecutionDetailDTO>> CompleteAsync(Guid id, EquipmentInspectionExecutionCompleteDTO dto);
    Task<ApiResponseDTO<EquipmentInspectionExecutionDetailDTO>> AdministrativeUpdateAsync(Guid id, EquipmentInspectionExecutionAdministrativeUpdateDTO dto);
}
