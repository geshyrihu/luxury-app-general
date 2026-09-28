namespace MantenimientoLuxuryApp.Machinery.DTOs;
/// <summary>Servicio o componente relacionado con DTO.</summary>
public record EquipoClasificacionDTO : GuidIdEntityDTO
{
    [Required(ErrorMessage = "El campo {0} es obligatorio")]
    [Display(Name = "Descripción")]
    // Obtiene o establece .
    public string Descripcion { get; set; }
}

