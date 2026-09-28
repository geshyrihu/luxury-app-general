namespace MantenimientoLuxuryApp.MaintenanceCalendars.DTOs;
/// <summary>Servicio o componente relacionado con agregar o edición DTO.</summary>
public record MaintenanceCalendarAddOrEditDTO
{
    [Required(ErrorMessage = "El campo {0} es obligatorio")]
    // Obtiene o establece identificador.
    public Guid MachineryId { get; set; }
    // Obtiene o establece tipo.
    public TypeMaintance TypeMaintance { get; set; }
    // Obtiene o establece recurrencia.
    public Recurrence Recurrence { get; set; }
    // Obtiene o establece .
    public Month? Month { get; set; }
    // Obtiene o establece precio.
    public decimal Price { get; set; }
    // Obtiene o establece .
    public string Activity { get; set; }
    // Obtiene o establece .
    public string Observation { get; set; }
    // Obtiene o establece proveedor identificador.
    public Guid ProviderId { get; set; }
    // Obtiene o establece cliente identificador.
    public Guid CustomerId { get; set; }
    // Obtiene o establece usuario identificador.
    public string ApplicationUserId { get; set; }
    // Obtiene o establece catálogo identificador.
    public Guid AccountingCatalogId { get; set; }
}
