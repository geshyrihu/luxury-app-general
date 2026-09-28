namespace MantenimientoLuxuryApp.Meters.DTOs;
/// <summary>Servicio o componente relacionado con DTO.</summary>
public record MedidorLecturaExcelDTO : GuidIdEntityDTO
{
    // Obtiene o establece .
    public string Meter { get; set; }
    // Obtiene o establece .
    public string NumeroMedidor { get; set; }
    // Obtiene o establece .
    public string FechaRegistro { get; set; }
    // Obtiene o establece .
    public decimal Lectura { get; set; }
}
