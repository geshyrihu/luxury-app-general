#nullable enable
namespace MantenimientoLuxuryApp.FireInspectionPeriods.Interfaces;
/// <summary>Interfaz del servicio de aplicación servicio.</summary>
public interface IFireCycleInspectionAppService
{
    Task<ApiResponseDTO<bool>> UpsertExtintorAsync(FireCycleInspectionExtintorAddOrEditDTO dto);
    Task<ApiResponseDTO<bool>> UpsertHidranteAsync(FireCycleInspectionHidranteAddOrEditDTO dto);
    Task<ApiResponseDTO<bool>> UpsertEstacionAsync(FireCycleInspectionEstacionAddOrEditDTO dto);
    Task<ApiResponseDTO<bool>> UpsertDetectorAsync(FireCycleInspectionDetectorAddOrEditDTO dto);

    Task<ApiResponseDTO<FireCycleInspectionExtintorAddOrEditDTO?>> GetExtintorAsync(Guid cycleId, Guid extinguisherId);
    Task<ApiResponseDTO<FireCycleInspectionHidranteAddOrEditDTO?>> GetHidranteAsync(Guid cycleId, Guid hydrantId);
    Task<ApiResponseDTO<FireCycleInspectionEstacionAddOrEditDTO?>> GetEstacionAsync(Guid cycleId, Guid stationId);
    Task<ApiResponseDTO<FireCycleInspectionDetectorAddOrEditDTO?>> GetDetectorAsync(Guid cycleId, Guid detectorId);
}
