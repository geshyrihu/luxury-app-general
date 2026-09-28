namespace MantenimientoLuxuryApp.CalendariosMaestroEquipo.DTOs;
/// <summary>Servicio o componente relacionado con agregar o edición DTO.</summary>
public record CalendarioMaestroAddOrEditDTO
{
    [Required(ErrorMessage = "El campo {0} es obligatorio")]
    // Obtiene o establece identificador.
    public Guid CalendarioMaestroEquipoId { get; set; }
    [Required(ErrorMessage = "El campo {0} es obligatorio")]
    // Obtiene o establece .
    public Month Mes { get; set; }
    [Required(ErrorMessage = "El campo {0} es obligatorio")]
    // Obtiene o establece .
    public string DescripcionServicio { get; set; }
    // Obtiene o establece .
    public string Observaciones { get; set; }
    // Obtiene o establece .
    public List<Guid> Proveedores { get; set; }
}
