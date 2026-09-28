namespace MantenimientoLuxuryApp.FireExtinguisherLog.DTOs;
/// <summary>Servicio o componente relacionado con agregar o edición DTO.</summary>
public record BitacoraExtintorAddOrEditDTO
{
    // Obtiene o establece identificador.
    public Guid ExtinguisherId { get; set; }
    // Obtiene o establece fecha.
    public DateOnly Date { get; set; }
    // Obtiene o establece .
    public TimeSpan Hour { get; set; }
    // Obtiene o establece .
    public bool AdequatePressure { get; set; }
    // Obtiene o establece .
    public bool SafetyPinOk { get; set; }
    // Obtiene o establece .
    public bool LabelsOk { get; set; }
    // Obtiene o establece .
    public bool NoPhysicalDamage { get; set; }
    // Obtiene o establece .
    public string Observations { get; set; }
    // Obtiene o establece usuario identificador.
    public string ApplicationUserId { get; set; }
}
