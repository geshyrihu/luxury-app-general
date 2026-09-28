namespace MantenimientoLuxuryApp.CalendariosMaestroEquipo.DTOs;
/// <summary>Servicio o componente relacionado con agregar o edición DTO.</summary>
public record CalendarioMaestroEquipoAddOrEditDTO
{
    [Required(ErrorMessage = "El campo {0} es obligatorio")]
    // Obtiene o establece .
    public string NombreEquipo { get; set; }
    [Required(ErrorMessage = "El campo {0} es obligatorio")]
    // Obtiene o establece identificador.
    public Guid EquipoClasificacionId { get; set; }
}
