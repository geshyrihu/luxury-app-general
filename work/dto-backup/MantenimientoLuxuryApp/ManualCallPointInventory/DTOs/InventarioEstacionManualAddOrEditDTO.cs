namespace MantenimientoLuxuryApp.ManualCallPointInventory.DTOs;
/// <summary>Servicio o componente relacionado con agregar o edición DTO.</summary>
public record InventarioEstacionManualAddOrEditDTO
{
    // Obtiene o establece cliente identificador.
    public Guid CustomerId { get; set; }
    // Obtiene o establece tipo.
    public ManualStationType StationType { get; set; }
    // Obtiene o establece .
    public string Location { get; set; }
    // Obtiene o establece .
    public string LocalCode { get; set; }
    // Obtiene o establece .
    public IFormFile Photo { get; set; }
    // Obtiene o establece actual.
    public string CurrentPhoto { get; set; }
    // Obtiene o establece usuario identificador.
    public string ApplicationUserId { get; set; }
}
