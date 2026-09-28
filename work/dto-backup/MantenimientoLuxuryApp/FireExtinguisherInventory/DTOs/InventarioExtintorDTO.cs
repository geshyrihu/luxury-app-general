namespace MantenimientoLuxuryApp.FireExtinguisherInventory.DTOs;
/// <summary>Servicio o componente relacionado con DTO.</summary>
public record InventarioExtintorDTO : GuidIdEntityDTO
{
    // Obtiene o establece cliente identificador.
    public Guid CustomerId { get; set; }
    // Obtiene o establece tipo.
    public string ExtinguisherType { get; set; }
    // Obtiene o establece fecha.
    public string ExpirationDate { get; set; }
    // Obtiene o establece .
    public string Location { get; set; }
    // Obtiene o establece .
    public string LocalCode { get; set; }
    // Obtiene o establece .
    public string Photo { get; set; }
    // Obtiene o establece usuario identificador.
    public string ApplicationUserId { get; set; }
}
