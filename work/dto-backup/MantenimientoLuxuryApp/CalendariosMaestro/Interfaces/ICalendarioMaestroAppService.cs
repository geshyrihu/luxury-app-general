namespace MantenimientoLuxuryApp.CalendariosMaestroEquipo.Interfaces;
/// <summary>
/// Interfaz para la gestión del Calendario Maestro.
/// Define las operaciones para administrar los eventos y mantenimientos programados a nivel global.
/// </summary>
public interface ICalendarioMaestroAppService
{
    /// <summary>
    /// Obtiene un registro del calendario maestro por su identificador único.
    /// </summary>
    /// <param name="id">ID del registro.</param>
    /// <returns>DTO con la información del calendario.</returns>
    Task<ApiResponseDTO<CalendarioMaestroAddOrEditDTO>> GetAsyncByIdAsync(Guid id);

    /// <summary>
    /// Recupera la lista completa de registros del calendario maestro.
    /// </summary>
    /// <returns>Listado de objetos de calendario.</returns>
    Task<ApiResponseDTO<object>> GetAllAsync();

    /// <summary>
    /// Registra una nueva entrada en el calendario maestro.
    /// </summary>
    /// <param name="DTO">Datos de la nueva entrada.</param>
    /// <returns>Entidad creada.</returns>
    Task<ApiResponseDTO<MasterCalendar>> AddAsync(CalendarioMaestroAddOrEditDTO DTO);

    /// <summary>
    /// Actualiza una entrada existente en el calendario maestro.
    /// </summary>
    /// <param name="id">ID del registro a modificar.</param>
    /// <param name="DTO">Nuevos datos.</param>
    /// <returns>Entidad actualizada.</returns>
    Task<ApiResponseDTO<MasterCalendar>> UpdateAsync(Guid id, CalendarioMaestroAddOrEditDTO DTO);

    /// <summary>
    /// Elimina un registro del calendario maestro.
    /// </summary>
    /// <param name="id">ID del registro a eliminar.</param>
    /// <returns>Número de registros afectados.</returns>
    Task<ApiResponseDTO<int>> DeleteAsync(Guid id);
}
