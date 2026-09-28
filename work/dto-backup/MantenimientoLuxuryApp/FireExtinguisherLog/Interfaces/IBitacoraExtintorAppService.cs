namespace MantenimientoLuxuryApp.FireExtinguisherLog.Interfaces;

public interface IBitacoraExtintorAppService
{
    /// <summary>Historial de inspecciones de un extintor, descendente por fecha.</summary>
    Task<ApiResponseDTO<BitacoraExtintorDTO[]>> GetAllAsync(Guid extinguisherId);

    /// <summary>Obtiene una inspección por su ID.</summary>
    Task<ApiResponseDTO<BitacoraExtintorAddOrEditDTO>> GetByIdAsync(Guid id);

    /// <summary>Registra una nueva inspección. Llamado desde el checklist QR y el botón fallback.</summary>
    Task<ApiResponseDTO<BitacoraExtintor>> AddAsync(BitacoraExtintorAddOrEditDTO dto);

    /// <summary>Elimina un registro de inspección.</summary>
    Task<ApiResponseDTO<bool>> DeleteByIdAsync(Guid id);
}
