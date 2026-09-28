namespace MantenimientoLuxuryApp.MaintenanceCalendars.DTOs;
/// <summary>Servicio o componente relacionado con DTO de estado PDF del cronograma anual.</summary>
public record CronogramaAnualPdfStatusDTO : GuidIdEntityDTO
{
    /// <summary>Sistema o clasificación del equipo.</summary>
    public string Sistema { get; set; }
    /// <summary>Categoría de inventario.</summary>
    public InventoryCategory InventoryCategory { get; set; }
    /// <summary>Nombre de la maquinaria.</summary>
    public string NameMachinery { get; set; }
    /// <summary>Items de mantenimiento con su estatus de orden de servicio.</summary>
    public List<CronogramaAnualPdfStatusItemDTO> Items { get; set; }
}
