namespace MantenimientoLuxuryApp.Meters.Interfaces;
/// <summary>
/// Interfaz para el servicio de gestión de categorías de medidores.
/// Define los tipos de servicios medibles soportados (ej: Gas, Energía Eléctrica, Agua potable).
/// </summary>
public interface IMedidorCategoriaAppService
{
    /// <summary>Obtiene una categoría de medidor por su identificador.</summary>
    Task<ApiResponseDTO<MedidorCategoriaDTO>> GetByIdAsync(Guid id);
    /// <summary>Obtiene el listado completo de categorías de medidores disponibles.</summary>
    Task<ApiResponseDTO<MedidorCategoriaDTO[]>> GetAllAsync();
    /// <summary>Crea una nueva categoría de medidor.</summary>
    Task<ApiResponseDTO<MedidorCategoria>> AddAsync(MedidorCategoriaAddOrEditDTO DTO);
    /// <summary>Actualiza una categoría de medidor existente.</summary>
    Task<ApiResponseDTO<MedidorCategoria>> UpdateAsync(Guid id, MedidorCategoriaAddOrEditDTO DTO);
    /// <summary>Elimina una categoría de medidor.</summary>
    Task<ApiResponseDTO<bool>> DeleteByIdAsync(Guid id);
}

