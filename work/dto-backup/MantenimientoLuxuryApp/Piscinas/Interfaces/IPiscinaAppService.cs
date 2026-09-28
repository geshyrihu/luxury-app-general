namespace MantenimientoLuxuryApp.PiscinasBitacora.Interfaces;
/// <summary>
/// Interfaz para el servicio de gestión de piscinas y cuerpos de agua.
/// Administra el inventario de instalaciones acuáticas, sus características (volumen) y fotografías.
/// </summary>
public interface IPiscinaAppService
{
    /// <summary>Obtiene la información técnica de una piscina por su ID.</summary>
    Task<ApiResponseDTO<PiscinaDTO>> GetByIdAsync(Guid id);
    /// <summary>Obtiene el listado completo de piscinas pertenecientes a un cliente.</summary>
    Task<ApiResponseDTO<PiscinaDTO[]>> GetAllAsync(Guid customerId);
    /// <summary>Registra una nueva piscina en el sistema.</summary>
    Task<ApiResponseDTO<PiscinaDTO>> AddAsync(PiscinaAddOrEditDTO DTO);
    /// <summary>Actualiza las características o imagen de una piscina existente.</summary>
    Task<ApiResponseDTO<PiscinaDTO>> UpdateAsync(Guid id, PiscinaAddOrEditDTO DTO);
    /// <summary>Elimina el registro de una piscina y su imagen asociada.</summary>
    Task<ApiResponseDTO<PiscinaDTO>> DeleteAsync(Guid id);
}

