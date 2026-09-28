namespace MantenimientoLuxuryApp.ManualCallPointInventory.DTOs;
/// <summary>Servicio o componente relacionado con DTO.</summary>
public record InventarioEstacionManualDTO : GuidIdEntityDTO
{
    // Obtiene o establece cliente identificador.
    public Guid CustomerId { get; set; }
    // Obtiene o establece tipo.
    public string StationType { get; set; }
    // Obtiene o establece .
    public string Location { get; set; }
    // Obtiene o establece .
    public string LocalCode { get; set; }
    // Obtiene o establece .
    public string Photo { get; set; }
    // Obtiene o establece usuario identificador.
    public string ApplicationUserId { get; set; }
}
