namespace MantenimientoLuxuryApp.HydrantLog.DTOs;
/// <summary>Servicio o componente relacionado con DTO.</summary>
public record BitacoraHidranteDTO : GuidIdEntityDTO
{
    // Obtiene o establece identificador.
    public Guid HydrantId { get; set; }
    // Obtiene o establece fecha.
    public DateOnly Date { get; set; }
    // Obtiene o establece .
    public TimeSpan Hour { get; set; }
    // Obtiene o establece .
    public bool LabelPresent { get; set; }
    // Obtiene o establece .
    public bool GlassIntact { get; set; }
    // Obtiene o establece .
    public bool WrenchPresent { get; set; }
    // Obtiene o establece .
    public bool HoseOk { get; set; }
    // Obtiene o establece .
    public bool NozzlePresent { get; set; }
    // Obtiene o establece .
    public bool ValveOperational { get; set; }
    // Obtiene o establece .
    public bool LockOk { get; set; }
    // Obtiene o establece estado.
    public CabinetState CabinetState { get; set; }
    // Obtiene o establece .
    public string Observations { get; set; }
    // Obtiene o establece usuario identificador.
    public string ApplicationUserId { get; set; }
}
