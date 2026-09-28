namespace MantenimientoLuxuryApp.PiscinasBitacora.DTOs;
/// <summary>Servicio o componente relacionado con DTO.</summary>
public record PiscinaBitacoraDTO : GuidIdEntityDTO
{
    // Obtiene o establece identificador.
    public Guid AlbercaId { get; set; }
    // Obtiene o establece .
    public string Alberca { get; set; }
    // Obtiene o establece .
    public TimeSpan Hour { get; set; }
    // Obtiene o establece fecha.
    public DateOnly Date { get; set; }
    public string DateString => new DateTime(Date.Year, Date.Month, Date.Day, Hour.Hours, Hour.Minutes, 00, DateTimeKind.Local).ToString("g");
    public DateTime Filtro => new(Date.Year, Date.Month, Date.Day, Hour.Hours, Hour.Minutes, 00, DateTimeKind.Local);

    // Obtiene o establece .
    public double Cl { get; set; }
    // Obtiene o establece .
    public double Ph { get; set; }
    // Obtiene o establece .
    public double Alkalinidad { get; set; }
    // Obtiene o establece .
    public double Dureza { get; set; }
    // Obtiene o establece .
    public double Temperatura { get; set; }
    // Obtiene o establece .
    public double AplicationCl { get; set; }
    // Obtiene o establece .
    public double AplicationPhMas { get; set; }
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
    // Obtiene o establece usuario.
    public string ApplicationUser { get; set; }
}
