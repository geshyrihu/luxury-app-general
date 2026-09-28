namespace MantenimientoLuxuryApp.ElevatorEmergencyCall.DTOs;
/// <summary>Servicio o componente relacionado con agregar o edición DTO.</summary>
public record ElevatorsEmergencyCallAddOrEditDTO
{
    // Obtiene o establece .
    public string Folio { get; set; }
    // Obtiene o establece cliente identificador.
    public Guid CustomerId { get; set; }
    // Obtiene o establece identificador.
    public Guid MachineryId { get; set; }
    // Obtiene o establece solicitud fecha.
    public DateOnly RequestDate { get; set; }
    // Obtiene o establece reporte.
    public string Report { get; set; }
    // Obtiene o establece solicitud.
    public string Request { get; set; }
    // Obtiene o establece .
    public string TechnicianWhoAttended { get; set; }
    // Obtiene o establece reportes.
    public string PersonWhoReports { get; set; }
}

