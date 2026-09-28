namespace MantenimientoLuxuryApp.Machinery.Interfaces;
/// <summary>
/// Interfaz para el servicio de control de préstamos de herramientas.
/// Administra el registro, seguimiento y devolución de herramientas prestadas al personal.
/// </summary>
public interface IControlPrestamoHerramientaAppService
{
    /// <summary>Obtiene una lista paginada de los préstamos de herramientas de un cliente.</summary>
    Task<ApiResponseDTO<ControlPrestamoHerramientaPagedListDTO>> GetAllIndexDTO(Guid customerId, PaginationCommonDTO pagination);
    /// <summary>Obtiene el detalle de un préstamo específico por su ID.</summary>
    Task<ApiResponseDTO<ControlPrestamoHerramientaDTO>> GetById(Guid id);
    /// <summary>Registra un nuevo préstamo de herramienta.</summary>
    Task<ApiResponseDTO<ToolLoan>> AddAsync(ControlPrestamoHerramientaAddOrEditDTO DTO);
    /// <summary>Actualiza la información de un préstamo (ej: registra la devolución).</summary>
    Task<ApiResponseDTO<ToolLoan>> UpdateAsync(Guid id, ControlPrestamoHerramientaAddOrEditDTO DTO);
    /// <summary>Elimina el registro de un préstamo del historial.</summary>
    Task<ApiResponseDTO<bool>> DeleteByIdAsync(Guid id);
}




