namespace MantenimientoLuxuryApp.FireInspectionPeriods.Interfaces;
/// <summary>Interfaz del servicio de aplicación servicio.</summary>
public interface IFireInspectionCycleAppService
{
    Task<ApiResponseDTO<FireInspectionCycleDTO[]>> GetAllAsync(Guid customerId);
    Task<ApiResponseDTO<FireInspectionCycleDetailDTO>> GetDetailAsync(Guid id);
    Task<ApiResponseDTO<FireInspectionCycleDetailDTO>> GetActiveByPeriodAsync(Guid periodId);
    Task<ApiResponseDTO<bool>> GenerateCycleForPeriodAsync(Guid periodId);
}
