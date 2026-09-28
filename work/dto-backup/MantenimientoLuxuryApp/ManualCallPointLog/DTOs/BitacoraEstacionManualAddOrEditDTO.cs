namespace MantenimientoLuxuryApp.ManualCallPointLog.DTOs;
/// <summary>Servicio o componente relacionado con agregar o edición DTO.</summary>
public record BitacoraEstacionManualAddOrEditDTO
{
    // Obtiene o establece identificador.
    public Guid StationId { get; set; }
    // Obtiene o establece fecha.
    public DateOnly Date { get; set; }
    // Obtiene o establece .
    public TimeSpan Hour { get; set; }
    // Obtiene o establece y.
    public bool AccessibleAndVisible { get; set; }
    // Obtiene o establece .
    public bool HousingOk { get; set; }
    // Obtiene o establece .
    public bool LeverOk { get; set; }
    // Obtiene o establece .
    public bool GlassIntact { get; set; }
    // Obtiene o establece .
    public bool MountingSecure { get; set; }
    // Obtiene o establece .
    public bool SignageOk { get; set; }
    // Obtiene o establece .
    public string Observations { get; set; }
    // Obtiene o establece usuario identificador.
    public string ApplicationUserId { get; set; }
}
