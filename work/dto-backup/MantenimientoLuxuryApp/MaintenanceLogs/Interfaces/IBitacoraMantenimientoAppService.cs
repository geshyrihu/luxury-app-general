namespace MantenimientoLuxuryApp.MaintenanceLogs.Interfaces;
/// <summary>
/// Interfaz para el servicio de bitácora de mantenimiento.
/// Gestiona los registros históricos de actividades, fallas y reparaciones realizadas en los equipos.
/// </summary>
public interface IBitacoraMantenimientoAppService
{
    /// <summary>Obtiene un registro específico de la bitácora por su ID numérico.</summary>
    Task<ApiResponseDTO<BitacoraMantenimientoDTO>> FindByIdAsync(int id);

    /// <summary>Obtiene todos los registros de bitácora de un cliente en un rango de fechas.</summary>
    Task<ApiResponseDTO<List<BitacoraMantenimientoDTO>>> GetAllBitacoraMantenimientoDTO(Guid customerId, DateTime fechaInicial, DateTime fechaFinal);

    /// <summary>Obtiene el historial de bitácora de una maquinaria específica en un rango de fechas.</summary>
    Task<ApiResponseDTO<List<BitacoraMantenimientoDTO>>> BitacoraIndividualAsync(Guid machineryId, DateTime fechaInicial, DateTime fechaFinal);

    /// <summary>Obtiene datos consolidados de la bitácora para su visualización en el dashboard operativo.</summary>
    Task<ApiResponseDTO<List<BitacoraMantenimientoDashboardDTO>>> BitacoraDashboardAsync(Guid customerId, DateTime fechaInicial, DateTime fechaFinal);

    /// <summary>Agrega un nuevo registro de novedad, falla o mantenimiento a la bitácora.</summary>
    Task<ApiResponseDTO<MaintenanceLog>> AddAsync(BitacoraMantenimientoAddOrEditDTO DTO);

    /// <summary>Elimina un registro de la bitácora.</summary>
    Task<ApiResponseDTO<bool>> DeleteByIdAsync(Guid id);
}


