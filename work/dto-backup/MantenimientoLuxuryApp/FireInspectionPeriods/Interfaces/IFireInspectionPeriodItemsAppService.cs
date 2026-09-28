namespace MantenimientoLuxuryApp.FireInspectionPeriods.Interfaces;
/// <summary>Interfaz del servicio de elementos aplicación servicio.</summary>
public interface IFireInspectionPeriodItemsAppService
{
    Task<ApiResponseDTO<object[]>> GetExtintoresAsync(Guid periodId);
    Task<ApiResponseDTO<bool>> AddExtintorAsync(Guid periodId, Guid extinguisherId);
    Task<ApiResponseDTO<bool>> RemoveExtintorAsync(Guid id);

    Task<ApiResponseDTO<object[]>> GetHidrantesAsync(Guid periodId);
    Task<ApiResponseDTO<bool>> AddHidranteAsync(Guid periodId, Guid hydrantId);
    Task<ApiResponseDTO<bool>> RemoveHidranteAsync(Guid id);

    Task<ApiResponseDTO<object[]>> GetEstacionesAsync(Guid periodId);
    Task<ApiResponseDTO<bool>> AddEstacionAsync(Guid periodId, Guid stationId);
    Task<ApiResponseDTO<bool>> RemoveEstacionAsync(Guid id);

    Task<ApiResponseDTO<object[]>> GetDetectoresAsync(Guid periodId);
    Task<ApiResponseDTO<bool>> AddDetectorAsync(Guid periodId, Guid detectorId);
    Task<ApiResponseDTO<bool>> RemoveDetectorAsync(Guid id);
}
