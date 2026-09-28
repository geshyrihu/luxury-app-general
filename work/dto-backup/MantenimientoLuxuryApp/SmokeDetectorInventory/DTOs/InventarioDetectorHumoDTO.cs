#nullable enable
namespace MantenimientoLuxuryApp.SmokeDetectorInventory.DTOs;
/// <summary>Servicio o componente relacionado con DTO.</summary>
public record InventarioDetectorHumoDTO : GuidIdEntityDTO
{
    // Obtiene o establece cliente identificador.
    public Guid CustomerId { get; set; }
    // Obtiene o establece tipo.
    public string DetectorType { get; set; } = string.Empty;
    // Obtiene o establece .
    public string Location { get; set; } = string.Empty;
    // Obtiene o establece .
    public string LocalCode { get; set; } = string.Empty;
    // Obtiene o establece .
    public string? Photo { get; set; }
    // Obtiene o establece usuario identificador.
    public string? ApplicationUserId { get; set; }
}
