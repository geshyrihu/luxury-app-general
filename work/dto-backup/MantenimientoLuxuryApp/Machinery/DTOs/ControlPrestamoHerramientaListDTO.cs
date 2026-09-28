namespace MantenimientoLuxuryApp.Machinery.DTOs;
/// <summary>Servicio o componente relacionado con lista DTO.</summary>
public record ControlPrestamoHerramientaListDTO : GuidIdEntityDTO
{
    // Obtiene o establece .
    public DateTime FechaSalida { get; set; }
    // Obtiene o establece .
    public DateTime? FechaRegreso { get; set; }
    // Obtiene o establece usuario.
    public string ApplicationUser { get; set; }
    // Obtiene o establece .
    public string Tool { get; set; }
    // Obtiene o establece .
    public string Observaciones { get; set; }

}
