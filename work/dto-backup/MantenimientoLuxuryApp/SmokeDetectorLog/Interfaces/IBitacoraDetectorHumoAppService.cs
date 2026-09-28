namespace MantenimientoLuxuryApp.SmokeDetectorLog.Interfaces;
/// <summary>Interfaz del servicio de aplicación servicio.</summary>
public interface IBitacoraDetectorHumoAppService
{
    Task<ApiResponseDTO<BitacoraDetectorHumoDTO[]>> GetAllAsync(Guid detectorId);
    Task<ApiResponseDTO<BitacoraDetectorHumoAddOrEditDTO>> GetByIdAsync(Guid id);
    Task<ApiResponseDTO<BitacoraDetectorHumo>> AddAsync(BitacoraDetectorHumoAddOrEditDTO dto);
    Task<ApiResponseDTO<bool>> DeleteByIdAsync(Guid id);
}
