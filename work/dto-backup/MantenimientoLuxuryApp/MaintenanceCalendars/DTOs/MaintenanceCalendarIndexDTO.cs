namespace MantenimientoLuxuryApp.MaintenanceCalendars.DTOs;
/// <summary>Servicio o componente relacionado con DTO.</summary>
public record MaintenanceCalendarIndexDTO : GuidIdEntityDTO
{

    // Obtiene o establece identificador.
    public Guid MachineryId { get; set; }
    // Obtiene o establece .
    public string Machinery { get; set; }
    // Obtiene o establece recurrencia.
    public Recurrence? Recurrence { get; set; }
    // Obtiene o establece día.
    public int Day { get; set; }
    // Obtiene o establece .
    public int Month { get; set; }
    // Obtiene o establece precio.
    public decimal Price { get; set; }
    // Obtiene o establece .
    public string Activity { get; set; }
    // Obtiene o establece .
    public string Observation { get; set; }
    // Obtiene o establece proveedor identificador.
    public Guid ProviderId { get; set; }
    // Obtiene o establece proveedor.
    public string Provider { get; set; }
    // Obtiene o establece cliente identificador.
    public Guid CustomerId { get; set; }
}
