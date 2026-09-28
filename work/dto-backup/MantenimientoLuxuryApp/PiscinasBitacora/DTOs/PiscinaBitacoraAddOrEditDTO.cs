namespace MantenimientoLuxuryApp.PiscinasBitacora.DTOs;
/// <summary>Servicio o componente relacionado con agregar o edición DTO.</summary>
public record PiscinaBitacoraAddOrEditDTO
{
    // Obtiene o establece identificador.
    public Guid PiscinaId { get; set; }
    // Obtiene o establece fecha.
    public DateOnly Date { get; set; }
    // Obtiene o establece .
    public TimeSpan Hour { get; set; }

    [Range(0.0, 100000.0, ErrorMessage = "El valor de Cl debe ser mayor o igual a 0.")]
    // Obtiene o establece .
    public double Cl { get; set; }

    [Range(0.0, 100000.0, ErrorMessage = "El valor de pH debe ser mayor o igual a 0.")]
    // Obtiene o establece .
    public double Ph { get; set; }

    [Range(0.0, 100000.0, ErrorMessage = "El valor de alcalinidad debe ser mayor o igual a 0.")]
    // Obtiene o establece .
    public double? Alkalinidad { get; set; }

    [Range(0.0, 100000.0, ErrorMessage = "El valor de dureza debe ser mayor o igual a 0.")]
    // Obtiene o establece .
    public double? Dureza { get; set; }

    [Range(0.0, 100000.0, ErrorMessage = "La temperatura debe ser mayor o igual a 0.")]
    // Obtiene o establece .
    public double Temperatura { get; set; }

    [Range(0.0, 100000.0, ErrorMessage = "La aplicación de Cl debe ser mayor o igual a 0.")]
    // Obtiene o establece .
    public double AplicationCl { get; set; }

    [Range(0.0, 100000.0, ErrorMessage = "La aplicación de pH+ debe ser mayor o igual a 0.")]
    // Obtiene o establece .
    public double AplicationPhMas { get; set; }

    [Range(0.0, 100000.0, ErrorMessage = "La aplicación de pH- debe ser mayor o igual a 0.")]
    // Obtiene o establece .
    public double AplicationPhMenos { get; set; }

    // Obtiene o establece .
    public bool Cepillado { get; set; }
    // Obtiene o establece .
    public bool Aspirado { get; set; }
    // Obtiene o establece .
    public bool Cenefas { get; set; }

    // Obtiene o establece usuario identificador.
    public string ApplicationUserId { get; set; }
}
