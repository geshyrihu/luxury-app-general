namespace MantenimientoLuxuryApp.Machinery.DTOs;
/// <summary>Servicio o componente relacionado con agregar o edición DTO.</summary>
public record ControlPrestamoHerramientaAddOrEditDTO
{
    // Obtiene o establece cliente identificador.
    public Guid CustomerId { get; set; }
    // Obtiene o establece .
    public DateTime FechaSalida { get; set; }
    // Obtiene o establece .
    public DateTime? FechaRegreso { get; set; }
    // Obtiene o establece identificador.
    public Guid ToolId { get; set; }
    // Obtiene o establece .
    public string Observaciones { get; set; }
    // Obtiene o establece usuario identificador.
    public string ApplicationUserResponsableId { get; set; }
    // Obtiene o establece usuario identificador.
    public string ApplicationUserId { get; set; }
}
