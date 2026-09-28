namespace MantenimientoLuxuryApp.Machinery.DTOs;
/// <summary>Servicio o componente relacionado con agregar o edición DTO.</summary>
public record EquipoClasificacionAddOrEditDTO
{
    [Required(ErrorMessage = "El campo {0} es obligatorio")]
    [Display(Name = "Descripción")]
    // Obtiene o establece .
    public string Descripcion { get; set; }
}

