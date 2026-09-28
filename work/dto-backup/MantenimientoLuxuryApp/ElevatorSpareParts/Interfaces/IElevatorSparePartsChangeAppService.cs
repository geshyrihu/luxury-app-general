namespace MantenimientoLuxuryApp.ElevatorSpareParts.Interfaces;
/// <summary>
/// Interfaz para el servicio de gestión de cambios de refacciones en elevadores.
/// Permite llevar un control histórico de las piezas sustituidas en cada equipo.
/// </summary>
public interface IElevatorSparePartsChangeAppService
{
    /// <summary>
    /// Obtiene los detalles de un registro de cambio de refacción por su ID.
    /// </summary>
    Task<ApiResponseDTO<ElevatorSparePartsChangeAddOrEditDTO>> GetByIdAsync(Guid id);

    /// <summary>
    /// Recupera la lista de cambios de refacciones realizados para un cliente.
    /// </summary>
    Task<ApiResponseDTO<List<ElevatorSparePartsChangeDTO>>> GetAllAsync(Guid customerId);

    /// <summary>
    /// Obtiene el listado de elevadores del cliente para asociar al cambio de pieza.
    /// </summary>
    Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>> GetElevatorsAsync(Guid customerId);

    /// <summary>
    /// Registra un nuevo cambio de refacción.
    /// </summary>
    Task<ApiResponseDTO<ElevatorSparePartsChangeDTO>> AddAsync(ElevatorSparePartsChangeAddOrEditDTO DTO);

    /// <summary>
    /// Actualiza la información de un cambio de pieza existente.
    /// </summary>
    Task<ApiResponseDTO<ElevatorSparePartsChangeDTO>> UpdateAsync(Guid id, ElevatorSparePartsChangeAddOrEditDTO DTO);

    /// <summary>
    /// Elimina un registro de cambio de refacción.
    /// </summary>
    Task<ApiResponseDTO<bool>> DeleteByIdAsync(Guid id);
}
