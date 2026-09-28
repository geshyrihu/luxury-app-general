namespace MantenimientoLuxuryApp.MaintenanceCalendars.DTOs;
/// <summary>Servicio o componente relacionado con lista DTO.</summary>
public record MaintenanceCalendarListDTO : GuidIdEntityDTO
{

    // Obtiene o establece recurrencia.
    public string Recurrence { get; set; }
    // Obtiene o establece .
    public string Activity { get; set; }
    // Obtiene o establece precio.
    public decimal Price { get; set; }
    // Obtiene o establece identificador.
    public Guid MachineryId { get; set; }
    // Obtiene o establece identificador.
    public int? CompraSubCuentaId { get; set; }
}
