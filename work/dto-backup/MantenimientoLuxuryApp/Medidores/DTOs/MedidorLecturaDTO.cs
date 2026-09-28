namespace MantenimientoLuxuryApp.Meters.DTOs;
/// <summary>Servicio o componente relacionado con DTO.</summary>
public record MedidorLecturaDTO : GuidIdEntityDTO
{
    // Obtiene o establece identificador.
    public Guid MedidorId { get; set; }
    // Obtiene o establece .
    public MedidorDTO Meter { get; set; }
    // Obtiene o establece .
    public DateOnly FechaRegistro { get; set; }
    // Obtiene o establece .
    public string Lectura { get; set; }
    // Obtiene o establece empleado identificador.
    public Guid EmployeeId { get; set; }
    // Obtiene o establece usuario identificador.
    public string ApplicationUserId { get; set; }
}
