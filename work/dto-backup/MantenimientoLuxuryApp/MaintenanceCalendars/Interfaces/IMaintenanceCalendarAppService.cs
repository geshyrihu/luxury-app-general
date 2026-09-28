namespace MantenimientoLuxuryApp.MaintenanceCalendars.Interfaces;
/// <summary>
/// Interfaz para el servicio de calendario de mantenimientos.
/// Gestiona la programación, seguimiento y exportación de mantenimientos preventivos a lo largo del año.
/// </summary>
public interface IMaintenanceCalendarAppService
{
    /// <summary>Obtiene un registro específico del calendario de mantenimiento por su ID.</summary>
    Task<ApiResponseDTO<MaintenanceCalendarDTO>> GetByIdAsync(Guid id);
    /// <summary>Obtiene el calendario de mantenimientos programados para un equipo específico.</summary>
    Task<ApiResponseDTO<MaintenanceCalendarDTO[]>> GetOfMachineryAsync(Guid machineryId);
    /// <summary>Obtiene el listado de todos los mantenimientos programados de un cliente filtrado por mes.</summary>
    Task<ApiResponseDTO<List<object>>> GetAllAsync(Guid customerId, Month month);
    /// <summary>Lista los servicios de mantenimiento programados y realizados de una maquinaria.</summary>
    Task<ApiResponseDTO<List<MaintenanceCalendarListDTO>>> ListServiceAsync(Guid machineryId);

    /// <summary>Programa un nuevo mantenimiento en el calendario.</summary>
    Task<ApiResponseDTO<MaintenanceCalendar>> AddAsync(MaintenanceCalendarAddOrEditDTO DTO);
    /// <summary>Actualiza la programación o estado de un mantenimiento en el calendario.</summary>
    Task<ApiResponseDTO<MaintenanceCalendar>> UpdateAsync(Guid id, MaintenanceCalendarAddOrEditDTO DTO);
    /// <summary>Elimina un registro del calendario de mantenimiento.</summary>
    Task<ApiResponseDTO<bool>> DeleteByIdAsync(Guid id);

    /// <summary>Genera un resumen general del estatus de los mantenimientos por cliente, opcionalmente filtrado por proveedor.</summary>
    Task<ApiResponseDTO<List<object>>> GeneralMantenimientoAsync(Guid customerId, Guid? providerId);
    /// <summary>Obtiene los proveedores que tienen mantenimientos asignados en el calendario del cliente.</summary>
    Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>> ProveedoresCalendarioAsync(Guid customerId);
    /// <summary>Genera la vista del cronograma anual de mantenimiento (matriz de meses y equipos).</summary>
    Task<ApiResponseDTO<List<CalendarioMantenimientoDTO>>> CronogramaAnualAsync(Guid customerId, int? filtro);
    /// <summary>Genera la vista del cronograma anual con estado de órdenes de servicio para PDF.</summary>
    Task<ApiResponseDTO<List<CronogramaAnualPdfStatusDTO>>> GetCronogramaAnualPdfStatusAsync(Guid customerId, int? filtro, int? year);
    /// <summary>Exporta el calendario de mantenimientos a un formato procesable (ej. para Excel).</summary>
    Task<ApiResponseDTO<List<object>>> ExportCalendarAsync(Guid customerId);

    /// <summary>Obtiene un resumen de los gastos proyectados vs reales basados en el calendario.</summary>
    Task<ApiResponseDTO<ResumenGastosDTO>> GetResumenGastosAsync(Guid customerId);
    /// <summary>Obtiene indicadores clave (KPIs) del cumplimiento del calendario de mantenimiento.</summary>
    Task<ApiResponseDTO<object>> GetResumenAsync(Guid customerId);
}

