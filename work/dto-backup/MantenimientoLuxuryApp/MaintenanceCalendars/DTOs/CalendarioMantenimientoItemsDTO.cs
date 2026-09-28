namespace MantenimientoLuxuryApp.MaintenanceCalendars.DTOs;
/// <summary>Servicio o componente relacionado con elementos DTO.</summary>
public record CalendarioMantenimientoItemsDTO : GuidIdEntityDTO
{
    // Obtiene o establece .
    public Month Month { get; set; }
    // Obtiene o establece tipo.
    public TypeMaintance TypeMaintance { get; set; }
}
