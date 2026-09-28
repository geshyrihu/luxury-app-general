namespace MantenimientoLuxuryApp.MaintenanceCalendars.DTOs;
/// <summary>Servicio o componente relacionado con elemento de estado PDF del cronograma anual.</summary>
public record CronogramaAnualPdfStatusItemDTO : GuidIdEntityDTO
{
    /// <summary>Mes del mantenimiento.</summary>
    public Month Month { get; set; }
    /// <summary>Tipo de mantenimiento.</summary>
    public TypeMaintance TypeMaintance { get; set; }
    /// <summary>Año del servicio programado.</summary>
    public int Year { get; set; }
    /// <summary>Estatus de la orden de servicio asociada.</summary>
    public string ServiceOrderStatus { get; set; }
}
