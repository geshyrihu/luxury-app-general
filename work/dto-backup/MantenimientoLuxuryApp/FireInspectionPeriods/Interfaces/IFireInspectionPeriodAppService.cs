namespace MantenimientoLuxuryApp.FireInspectionPeriods.Interfaces;
/// <summary>Interfaz del servicio de aplicación servicio.</summary>
public interface IFireInspectionPeriodAppService
{
    Task<ApiResponseDTO<FireInspectionPeriodDTO[]>> GetAllAsync(Guid customerId);
    Task<ApiResponseDTO<FireInspectionPeriodAddOrEditDTO>> GetByIdAsync(Guid id);
    Task<ApiResponseDTO<FireInspectionPeriod>> AddAsync(FireInspectionPeriodAddOrEditDTO dto);
    Task<ApiResponseDTO<bool>> UpdateAsync(Guid id, FireInspectionPeriodAddOrEditDTO dto);
    Task<ApiResponseDTO<bool>> DeleteByIdAsync(Guid id);
}
