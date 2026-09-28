namespace MantenimientoLuxuryApp.PiscinasBitacora.DTOs;
/// <summary>Servicio o componente relacionado con DTO.</summary>
public record PiscinaDTO : GuidIdEntityDTO
{

    [MaxLength(100)]
    [Display(Name = "Nombre de Alberca")]
    // Obtiene o establece nombre.
    public string Name { get; set; }

    [MaxLength(100)]
    [Display(Name = "Ubicación")]
    // Obtiene o establece .
    public string Ubication { get; set; }

    [Display(Name = "Metros cubicos")]
    // Obtiene o establece .
    public double Volumen { get; set; }

    [Display(Name = "Imagen")]
    // Obtiene o establece ruta imagen.
    public string PathImage { get; set; }

    // Obtiene o establece tipo.
    public string TypePiscina { get; set; }
}

