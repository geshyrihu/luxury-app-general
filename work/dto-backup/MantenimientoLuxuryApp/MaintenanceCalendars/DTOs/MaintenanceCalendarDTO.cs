namespace MantenimientoLuxuryApp.MaintenanceCalendars.DTOs;
/// <summary>Servicio o componente relacionado con DTO.</summary>
public record MaintenanceCalendarDTO : GuidIdEntityDTO
{
    // Obtiene o establece cliente identificador.
    public Guid CustomerId { get; set; }
    // Obtiene o establece identificador.
    public SelectItemDTO<Guid> MachineryId { get; set; }
    // Obtiene o establece recurrencia.
    public Recurrence Recurrence { get; set; }
    // Obtiene o establece tipo.
    public TypeMaintance TypeMaintance { get; set; }

    // Obtiene o establece .
    public string Month { get; set; }
    // Obtiene o establece .
    public string Activity { get; set; }
    // Obtiene o establece proveedor identificador.
    public SelectItemDTO<Guid> ProviderId { get; set; }
    // Obtiene o establece .
    public string Observation { get; set; }
    // Obtiene o establece precio.
    public decimal Price { get; set; }
    // Obtiene o establece usuario.
    public string User { get; set; }
    // Obtiene o establece catálogo.
    public SelectItemDTO<Guid> AccountingCatalog { get; set; }
}
