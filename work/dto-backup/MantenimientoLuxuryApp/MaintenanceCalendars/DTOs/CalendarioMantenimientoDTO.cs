namespace MantenimientoLuxuryApp.MaintenanceCalendars.DTOs;
/// <summary>Servicio o componente relacionado con DTO.</summary>
public record CalendarioMantenimientoDTO : GuidIdEntityDTO
{
    // Obtiene o establece .
    public string Sistema { get; set; }
    // Obtiene o establece categoría.
    public InventoryCategory InventoryCategory { get; set; }
    // Obtiene o establece nombre.
    public string NameMachinery { get; set; }
    // Obtiene o establece .
    public List<CalendarioMantenimientoItemsDTO> MaintenanceCalendars { get; set; }
}
