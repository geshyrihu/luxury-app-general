namespace MantenimientoLuxuryApp.MachineryAsset.DTOs;
/// <summary>Servicio o componente relacionado con DTO.</summary>
public record MachineryFichaTecnicaDTO : GuidIdEntityDTO
{
    // Obtiene o establece nombre.
    public string NameMachinery { get; set; }
    // Obtiene o establece .
    public string Ubication { get; set; }
    // Obtiene o establece .
    public string Brand { get; set; }
    // Obtiene o establece .
    public string Serie { get; set; }
    // Obtiene o establece modelo.
    public string Model { get; set; }
    // Obtiene o establece ruta.
    public string PhotoPath { get; set; }
    // Obtiene o establece estado.
    public string State { get; set; }
    // Obtiene o establece categoría.
    public string InventoryCategory { get; set; }
    // Obtiene o establece fecha de.
    public string DateOfPurchase { get; set; }
    // Obtiene o establece .
    public string TechnicalSpecifications { get; set; }
    // Obtiene o establece .
    public string Observations { get; set; }
    // Obtiene o establece .
    public string EquipoClasificacion { get; set; }
}
