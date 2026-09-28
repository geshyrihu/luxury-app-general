namespace MantenimientoLuxuryApp.Meters.DTOs;
/// <summary>Servicio o componente relacionado con DTO.</summary>
public record MedidorDTO : GuidIdEntityDTO
{
    // Obtiene o establece cliente identificador.
    public Guid CustomerId { get; set; }
    // Obtiene o establece identificador.
    public Guid MedidorCategoriaId { get; set; }
    // Obtiene o establece .
    public MedidorCategoriaDTO MedidorCategoria { get; set; }
    // Obtiene o establece .
    public bool MedidorActivo { get; set; }
    // Obtiene o establece .
    public decimal ConsumoDiarioMaximo { get; set; }
    // Obtiene o establece .
    public DateOnly? FechaRegistro { get; set; }
    // Obtiene o establece .
    public string NumeroMedidor { get; set; }
    // Obtiene o establece .
    public string Descripcion { get; set; }
}
