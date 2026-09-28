namespace MantenimientoLuxuryApp.EquipmentInspections.Interfaces;
/// <summary>Interfaz del servicio de aplicación servicio.</summary>
public interface IEquipmentInspectionDefinitionAppService
{
    Task<ApiResponseDTO<List<EquipmentInspectionDefinitionListDTO>>> GetByMachineryAsync(Guid machineryId);
    Task<ApiResponseDTO<EquipmentInspectionDefinitionDTO>> GetByIdAsync(Guid id);
    Task<ApiResponseDTO<EquipmentInspectionDefinitionDTO>> AddAsync(EquipmentInspectionDefinitionAddOrEditDTO dto);
    Task<ApiResponseDTO<EquipmentInspectionDefinitionDTO>> UpdateAsync(Guid id, EquipmentInspectionDefinitionAddOrEditDTO dto);
    Task<ApiResponseDTO<bool>> ToggleActiveAsync(Guid id, bool isActive);
    Task<ApiResponseDTO<bool>> DeleteByIdAsync(Guid id);
}
