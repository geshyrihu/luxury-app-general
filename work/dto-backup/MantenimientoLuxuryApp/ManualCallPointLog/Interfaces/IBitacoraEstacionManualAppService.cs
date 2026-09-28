namespace MantenimientoLuxuryApp.ManualCallPointLog.Interfaces;
/// <summary>Interfaz del servicio de aplicación servicio.</summary>
public interface IBitacoraEstacionManualAppService
{
    Task<ApiResponseDTO<BitacoraEstacionManualDTO[]>> GetAllAsync(Guid stationId);
    Task<ApiResponseDTO<BitacoraEstacionManualAddOrEditDTO>> GetByIdAsync(Guid id);
    Task<ApiResponseDTO<BitacoraEstacionManual>> AddAsync(BitacoraEstacionManualAddOrEditDTO dto);
    Task<ApiResponseDTO<bool>> DeleteByIdAsync(Guid id);
}
