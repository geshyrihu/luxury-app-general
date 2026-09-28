namespace MantenimientoLuxuryApp.ElevatorEmergencyCall.Interfaces;
/// <summary>
/// Interfaz para el servicio de gestión de llamadas de emergencia de elevadores.
/// Permite rastrear y registrar eventos donde se activa la comunicación de emergencia en cabinas.
/// </summary>
public interface IElevatorsEmergencyCallAppService
{
    /// <summary>
    /// Obtiene un registro de llamada de emergencia por su ID.
    /// </summary>
    /// <param name="id">ID del registro.</param>
    Task<ApiResponseDTO<ElevatorsEmergencyCallAddOrEditDTO>> GetByIdAsync(Guid id);

    /// <summary>
    /// Recupera el historial de llamadas de emergencia para un cliente específico.
    /// </summary>
    /// <param name="customerId">ID del cliente.</param>
    Task<ApiResponseDTO<List<ElevatorsEmergencyCallDTO>>> GetAllAsync(Guid customerId);

    /// <summary>
    /// Obtiene el listado de elevadores disponibles del cliente para vincular a una llamada.
    /// </summary>
    /// <param name="customerId">ID del cliente.</param>
    Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>> GetElevatorsAsync(Guid customerId);

    /// <summary>
    /// Crea un nuevo registro de llamada de emergencia.
    /// </summary>
    /// <param name="DTO">Datos de la llamada.</param>
    Task<ApiResponseDTO<ElevatorsEmergencyCallDTO>> AddAsync(ElevatorsEmergencyCallAddOrEditDTO DTO);

    /// <summary>
    /// Actualiza la información de un registro de llamada existente.
    /// </summary>
    /// <param name="id">ID del registro.</param>
    /// <param name="DTO">Nuevos datos.</param>
    Task<ApiResponseDTO<ElevatorsEmergencyCallDTO>> UpdateAsync(Guid id, ElevatorsEmergencyCallAddOrEditDTO DTO);

    /// <summary>
    /// Elimina un registro de llamada de emergencia.
    /// </summary>
    /// <param name="id">ID del registro.</param>
    Task<ApiResponseDTO<bool>> DeleteByIdAsync(Guid id);
}
