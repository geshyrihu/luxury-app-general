namespace MantenimientoLuxuryApp.Machinery.Interfaces;
/// <summary>
/// Interfaz para el servicio de gestión de maquinaria y equipos.
/// Es el núcleo del módulo de operaciones, manejando el inventario, documentos técnicos, imágenes e históricos de servicio.
/// </summary>
public interface IMachineryAppService
{
    /// <summary>Lista los sistemas o agrupaciones de maquinaria de un cliente (ej: Sistema de Bombeo, Elevadores).</summary>
    Task<ApiResponseDTO<object>> ListEngineSystemsAsync(Guid customerId);
    /// <summary>Obtiene un resumen completo del inventario de maquinaria de un cliente.</summary>
    Task<ApiResponseDTO<object>> InventarioCompletoAsync(Guid customerId);

    /// <summary>Obtiene el detalle completo de un equipo específico.</summary>
    Task<ApiResponseDTO<MachineryDTO>> GetById(Guid id);
    /// <summary>Obtiene la ficha técnica detallada (especificaciones) de una maquinaria.</summary>
    Task<ApiResponseDTO<MachineryFichaTecnicaDTO>> GetFichaTecnica(Guid id);
    /// <summary>Obtiene la maquinaria en formato de tarjetas (cards) para visualización en UI.</summary>
    Task<ApiResponseDTO<object>> GetAllCardAsync(Guid customerId, State status, InventoryCategory inventoryCategory);
    /// <summary>Obtiene el listado de maquinaria aplicando filtros de estado y categoría.</summary>
    Task<ApiResponseDTO<object>> GetAllAsync(Guid customerId, State status, InventoryCategory inventoryCategory);

    /// <summary>Registra una nueva maquinaria en el inventario.</summary>
    Task<ApiResponseDTO<Equipment>> AddAsync(MachineryAddOrEditDTO DTO);
    /// <summary>Obtiene una maquinaria en formato SelectItem para listas desplegables.</summary>
    Task<ApiResponseDTO<SelectItemDTO<Guid>>> GetMachinerySelectItemAsync(Guid id);
    /// <summary>Actualiza la información técnica de una maquinaria.</summary>
    Task<ApiResponseDTO<Equipment>> UpdateAsync(Guid id, MachineryAddOrEditDTO DTO);
    /// <summary>Elimina un equipo del inventario.</summary>
    Task<ApiResponseDTO<Equipment>> DeleteAsync(Guid id);

    /// <summary>Actualiza masivamente las categorías de la maquinaria basándose en reglas predefinidas.</summary>
    Task<ApiResponseDTO<object>> UpdateCategoryAsync();

    /// <summary>Sube uno o más documentos (PDF, etc.) asociados a la maquinaria.</summary>
    Task<ApiResponseDTO<bool>> SubirDocumentoAsync(Guid machineryId, IFormFile[] files);
    /// <summary>Elimina un documento asociado a un equipo.</summary>
    Task<ApiResponseDTO<bool>> DeleteDocumentAsync(Guid id);

    /// <summary>Obtiene una lista de autocompletado para la búsqueda de inventario de maquinaria.</summary>
    Task<ApiResponseDTO<object>> GetAutocompeteInvAsync(Guid customerId);
    /// <summary>Obtiene un listado detallado (tabla) de la maquinaria aplicando filtros.</summary>
    Task<ApiResponseDTO<MachineryDetailDTO[]>> GetAllMachineryDetailAsync(Guid customerId, State status, InventoryCategory inventoryCategory);

    /// <summary>Genera o recupera las actas de entrega asociadas a la maquinaria del cliente.</summary>
    Task<ApiResponseDTO<object>> ActasEntregaAsync(Guid customerId);
    /// <summary>Genera un informe PDF consolidado del inventario de maquinaria.</summary>
    Task<ApiResponseDTO<object>> InformePdfAsync(Guid customerId, State status, InventoryCategory inventoryCategory);
    /// <summary>Obtiene el historial de servicios de mantenimiento realizados a una maquinaria específica.</summary>
    Task<ApiResponseDTO<List<ListServiceHistoryDTO>>> GetListServiceHistory(Guid machineryId);
}

