namespace MantenimientoLuxuryApp.CalendariosMaestroEquipo.Interfaces;
/// <summary>
/// Interfaz para la gestión del Calendario Maestro de Equipos.
/// Permite programar y rastrear mantenimientos específicos para la maquinaria y activos.
/// </summary>
public interface ICalendarioMaestroEquipoAppService
{
    /// <summary>
    /// Obtiene los detalles de una entrada del calendario de equipos por su ID.
    /// </summary>
    /// <param name="id">ID del registro.</param>
    /// <returns>DTO con la información del calendario de equipo.</returns>
    Task<ApiResponseDTO<CalendarioMaestroEquipoDTO>> GetByIdAsync(Guid id);

    /// <summary>
    /// Recupera la lista completa de calendarios maestros de equipo.
    /// </summary>
    /// <returns>Arreglo de DTOs de calendario de equipo.</returns>
    Task<ApiResponseDTO<CalendarioMaestroEquipoDTO[]>> GetAllAsync();

    /// <summary>
    /// Registra una nueva programación en el calendario de equipos.
    /// </summary>
    /// <param name="DTO">Datos de la nueva entrada.</param>
    /// <returns>Entidad creada.</returns>
    Task<ApiResponseDTO<MasterCalendarEquipment>> AddAsync(CalendarioMaestroEquipoAddOrEditDTO DTO);

    /// <summary>
    /// Actualiza una programación existente en el calendario de equipos.
    /// </summary>
    /// <param name="id">ID del registro a modificar.</param>
    /// <param name="DTO">Nuevos datos.</param>
    /// <returns>Entidad actualizada.</returns>
    Task<ApiResponseDTO<MasterCalendarEquipment>> UpdateAsync(Guid id, CalendarioMaestroEquipoAddOrEditDTO DTO);

    /// <summary>
    /// Elimina una entrada del calendario de equipos por su identificador.
    /// </summary>
    /// <param name="id">ID del registro a eliminar.</param>
    /// <returns>Verdadero si la eliminación fue exitosa.</returns>
    Task<ApiResponseDTO<bool>> DeleteByIdAsync(Guid id);
}
