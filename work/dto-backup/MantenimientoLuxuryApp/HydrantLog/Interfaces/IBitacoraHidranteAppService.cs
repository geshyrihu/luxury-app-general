namespace MantenimientoLuxuryApp.HydrantLog.Interfaces;
/// <summary>Interfaz del servicio de aplicación servicio.</summary>
public interface IBitacoraHidranteAppService
{
    Task<ApiResponseDTO<BitacoraHidranteDTO[]>> GetAllAsync(Guid hydrantId);
    Task<ApiResponseDTO<BitacoraHidranteAddOrEditDTO>> GetByIdAsync(Guid id);
    Task<ApiResponseDTO<BitacoraHidrante>> AddAsync(BitacoraHidranteAddOrEditDTO dto);
    Task<ApiResponseDTO<bool>> DeleteByIdAsync(Guid id);
}
