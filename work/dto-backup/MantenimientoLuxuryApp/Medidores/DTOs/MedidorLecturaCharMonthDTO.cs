namespace MantenimientoLuxuryApp.Meters.DTOs;
/// <summary>Servicio o componente relacionado con DTO.</summary>
public record MedidorLecturaCharMonthDTO
{
    // Obtiene o establece .
    public DateOnly Fecha { get; set; }
    // Obtiene o establece .
    public decimal Lectura { get; set; }
}
