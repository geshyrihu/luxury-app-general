namespace MantenimientoLuxuryApp.ElevatorEmergencyCall.DTOs;
/// <summary>Servicio o componente relacionado con DTO.</summary>
public record ElevatorsEmergencyCallDTO : GuidIdEntityDTO
{
    // Obtiene o establece .
    public string Folio { get; set; }
    // Obtiene o establece .
    public string Machinery { get; set; }
    // Obtiene o establece solicitud fecha.
    public string RequestDate { get; set; }
    // Obtiene o establece solicitud fecha filtro.
    public DateTime RequestDateFilter { get; set; }
    // Obtiene o establece reporte.
    public string Report { get; set; }
    // Obtiene o establece solicitud.
    public string Request { get; set; }
    // Obtiene o establece .
    public string TechnicianWhoAttended { get; set; }
    // Obtiene o establece reportes.
    public string PersonWhoReports { get; set; }
}

