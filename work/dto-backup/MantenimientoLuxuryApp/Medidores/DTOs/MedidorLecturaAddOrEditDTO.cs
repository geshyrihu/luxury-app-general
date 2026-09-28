namespace MantenimientoLuxuryApp.Meters.DTOs;
/// <summary>Servicio o componente relacionado con agregar o edición DTO.</summary>
public record MedidorLecturaAddOrEditDTO
{
    // Obtiene o establece identificador.
    public Guid MedidorId { get; set; }
    // Obtiene o establece .
    public DateOnly? FechaRegistro { get; set; }
    // Obtiene o establece .
    public string Lectura { get; set; }

    // Obtiene o establece usuario identificador.
    public string ApplicationUserId { get; set; }
}
