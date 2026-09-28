#nullable enable
namespace MantenimientoLuxuryApp.SmokeDetectorInventory.DTOs;
/// <summary>Servicio o componente relacionado con agregar o edición DTO.</summary>
public record InventarioDetectorHumoAddOrEditDTO
{
    // Obtiene o establece cliente identificador.
    public Guid CustomerId { get; set; }
    // Obtiene o establece tipo.
    public SmokeDetectorType DetectorType { get; set; }
    // Obtiene o establece .
    public string Location { get; set; } = string.Empty;
    // Obtiene o establece .
    public string LocalCode { get; set; } = string.Empty;
    // Obtiene o establece .
    public IFormFile? Photo { get; set; }
    // Obtiene o establece actual.
    public string? CurrentPhoto { get; set; }
    // Obtiene o establece usuario identificador.
    public string? ApplicationUserId { get; set; }
}
