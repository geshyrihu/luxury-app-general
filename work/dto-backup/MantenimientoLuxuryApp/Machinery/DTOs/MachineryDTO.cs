namespace MantenimientoLuxuryApp.Machinery.DTOs;
/// <summary>Servicio o componente relacionado con DTO.</summary>
public record MachineryDTO : GuidIdEntityDTO
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
    public State State { get; set; }
    // Obtiene o establece fecha de.
    public DateOnly DateOfPurchase { get; set; }
    // Obtiene o establece categoría.
    public InventoryCategory InventoryCategory { get; set; }
    // Obtiene o establece .
    public string TechnicalSpecifications { get; set; }
    // Obtiene o establece .
    public string Observations { get; set; }
    // Obtiene o establece categoría identificador.
    public Guid CategoryId { get; set; }
    // Obtiene o establece categoría.
    public Category Category { get; set; }
    // Obtiene o establece cliente identificador.
    public Guid CustomerId { get; set; }
    // Obtiene o establece cliente.
    public Customer Customer { get; set; }
    // Obtiene o establece identificador.
    public Guid? EquipoClasificacionId { get; set; }
    // Obtiene o establece .
    public List<MaintenanceCalendar> MaintenanceCalendars { get; set; }
}
