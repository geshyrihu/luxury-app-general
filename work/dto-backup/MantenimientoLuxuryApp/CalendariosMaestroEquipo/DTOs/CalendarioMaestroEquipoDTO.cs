namespace MantenimientoLuxuryApp.CalendariosMaestroEquipo.DTOs;
/// <summary>Servicio o componente relacionado con DTO.</summary>
public record CalendarioMaestroEquipoDTO : GuidIdEntityDTO
{
    // Obtiene o establece .
    public string NombreEquipo { get; set; }
    // Obtiene o establece identificador.
    public Guid EquipoClasificacionId { get; set; }
    // Obtiene o establece .
    public string EquipoClasificacion { get; set; }
}
