namespace MantenimientoLuxuryApp.Machinery.DTOs;
/// <summary>Servicio o componente relacionado con DTO.</summary>
public record ControlPrestamoHerramientaDTO : GuidIdEntityDTO
{
    // Obtiene o establece cliente identificador.
    public Guid CustomerId { get; set; }
    // Obtiene o establece .
    public DateTime FechaSalida { get; set; }
    // Obtiene o establece .
    public DateTime? FechaRegreso { get; set; }
    // Obtiene o establece usuario identificador.
    public string ApplicationUserId { get; set; }
    // Obtiene o establece usuario.
    public string ApplicationUser { get; set; }
    // Obtiene o establece identificador.
    public Guid ToolId { get; set; }
    // Obtiene o establece .
    public string Tool { get; set; }
    // Obtiene o establece .
    public string Observaciones { get; set; }
    // Obtiene o establece empleado identificador.
    public Guid? EmployeeResponsableId { get; set; }
}
