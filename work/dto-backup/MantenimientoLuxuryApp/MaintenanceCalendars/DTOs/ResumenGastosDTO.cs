namespace MantenimientoLuxuryApp.MaintenanceCalendars.DTOs;
/// <summary>Servicio o componente relacionado con DTO.</summary>
public record ResumenGastosDTO
{
    // Obtiene o establece elementos.
    public IEnumerable<object> Items { get; set; }
    // Obtiene o establece total.
    public decimal TotalGastos { get; set; }
}
