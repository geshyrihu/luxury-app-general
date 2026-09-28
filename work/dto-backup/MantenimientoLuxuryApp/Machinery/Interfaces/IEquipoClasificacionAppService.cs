namespace MantenimientoLuxuryApp.Machinery.Interfaces;
/// <summary>
/// Interfaz para el servicio de clasificación de equipos.
/// Gestiona el catálogo de tipos o categorías bajo las cuales se agrupa la maquinaria.
/// </summary>
public interface IEquipoClasificacionAppService
{
    /// <summary>Obtiene una clasificación específica por su ID.</summary>
    Task<ApiResponseDTO<EquipoClasificacionDTO>> GetByIdAsync(Guid id);
    /// <summary>Obtiene todas las clasificaciones de equipos disponibles.</summary>
    Task<ApiResponseDTO<EquipoClasificacionDTO[]>> GetAllAsync();
    /// <summary>Agrega una nueva clasificación de equipo.</summary>
    Task<ApiResponseDTO<EquipoClasificacionDTO>> AddAsync(EquipoClasificacionAddOrEditDTO DTO);
    /// <summary>Actualiza una clasificación existente.</summary>
    Task<ApiResponseDTO<EquipoClasificacionDTO>> UpdateAsync(Guid id, EquipoClasificacionAddOrEditDTO DTO);
    /// <summary>Elimina una clasificación de equipo.</summary>
    Task<ApiResponseDTO<bool>> DeleteByIdAsync(Guid id);
}

