namespace MantenimientoLuxuryApp.FireExtinguisherInventory.Interfaces;
/// <summary>
/// Interfaz para el servicio de gestión del inventario de extintores.
/// Permite controlar la ubicación, tipo, capacidad y fechas de recarga de los equipos contra incendios.
/// </summary>
public interface IInventarioExtintorAppService
{
    /// <summary>
    /// Obtiene un extintor por su identificador único.
    /// </summary>
    Task<ApiResponseDTO<InventarioExtintorAddOrEditDTO>> GetByIdAsync(Guid id);

    /// <summary>
    /// Recupera la lista completa de extintores para un cliente específico.
    /// </summary>
    Task<ApiResponseDTO<InventarioExtintorDTO[]>> GetAllAsync(Guid customerId);

    /// <summary>
    /// Obtiene un resumen agrupado (ej. por piso o área) del inventario de extintores.
    /// </summary>
    Task<ApiResponseDTO<object>> GetAllGroupAsync(Guid customerId);

    /// <summary>
    /// Añade un nuevo extintor al inventario del cliente.
    /// </summary>
    Task<ApiResponseDTO<InventarioExtintor>> AddAsync(InventarioExtintorAddOrEditDTO DTO);

    /// <summary>
    /// Actualiza la información técnica o de mantenimiento de un extintor.
    /// </summary>
    Task<ApiResponseDTO<InventarioExtintor>> UpdateAsync(Guid id, InventarioExtintorAddOrEditDTO DTO);

    /// <summary>
    /// Elimina físicamente un extintor del inventario.
    /// </summary>
    Task<ApiResponseDTO<bool>> DeleteByIdAsync(Guid id);
}
