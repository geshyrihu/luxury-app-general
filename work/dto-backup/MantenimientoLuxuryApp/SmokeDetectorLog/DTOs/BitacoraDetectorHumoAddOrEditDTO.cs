namespace MantenimientoLuxuryApp.SmokeDetectorLog.DTOs;
/// <summary>Servicio o componente relacionado con agregar o edición DTO.</summary>
public record BitacoraDetectorHumoAddOrEditDTO
{
    // Obtiene o establece identificador.
    public Guid DetectorId { get; set; }
    // Obtiene o establece fecha.
    public DateOnly Date { get; set; }
    // Obtiene o establece .
    public TimeSpan Hour { get; set; }
    // Obtiene o establece .
    public bool NoObstructions { get; set; }
    // Obtiene o establece .
    public bool NoContamination { get; set; }
    // Obtiene o establece .
    public bool NoPhysicalDamage { get; set; }
    // Obtiene o establece estatus.
    public bool LedStatusOk { get; set; }
    // Obtiene o establece .
    public bool MountingSecure { get; set; }
    // Obtiene o establece .
    public string Observations { get; set; }
    // Obtiene o establece usuario identificador.
    public string ApplicationUserId { get; set; }
}
