namespace MantenimientoLuxuryApp.PiscinasBitacora.DTOs;
/// <summary>
/// DTO para la creación y edición de una piscina o alberca.
/// Transporta la información técnica y la imagen representativa de la instalación.
/// </summary>
public record PiscinaAddOrEditDTO : GuidIdEntityDTO
{
    /// <summary>
    /// Identificador del cliente (condominio) al que pertenece la piscina.
    /// </summary>
    public Guid CustomerId { get; set; }

    /// <summary>
    /// Nombre descriptivo de la alberca (ej: Alberca Techada, Chapoteadero).
    /// </summary>
    [Required(ErrorMessage = "El nombre es obligatorio.")]
    [MaxLength(100, ErrorMessage = "El nombre no debe exceder 100 caracteres.")]
    public string Name { get; set; }

    /// <summary>
    /// Ubicación física dentro del condominio.
    /// </summary>
    [Required(ErrorMessage = "La ubicación es obligatoria.")]
    [MaxLength(100, ErrorMessage = "La ubicación no debe exceder 100 caracteres.")]
    public string Ubication { get; set; }

    /// <summary>
    /// Volumen total de agua en metros cúbicos (mayor o igual a 0).
    /// </summary>
    [Range(0, 1000000, ErrorMessage = "El volumen debe estar entre 0 y 1,000,000.")]
    public double Volumen { get; set; }

    /// <summary>
    /// Archivo de imagen de la piscina para identificación visual.
    /// </summary>
    public IFormFile PathImage { get; set; }

    /// <summary>
    /// Tipo de piscina (Cloro, Salina, etc.).
    /// </summary>
    public TypePiscina TypePiscina { get; set; }

    /// <summary>
    /// Identificador del usuario que realiza el registro o actualización.
    /// </summary>
    public string ApplicationUserId { get; set; }
}
