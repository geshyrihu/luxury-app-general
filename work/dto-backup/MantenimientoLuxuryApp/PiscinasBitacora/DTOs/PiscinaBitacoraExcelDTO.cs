namespace MantenimientoLuxuryApp.PiscinasBitacora.DTOs;
/// <summary>
/// Fila de la bitácora de alberca para exportación a Excel.
/// Fecha/Hora se exponen como texto en formato dd/MM/yyyy y hh:mm para edición manual.
/// </summary>
public record PiscinaBitacoraExcelDTO
{
    public string Fecha { get; set; }
    public string Hora { get; set; }
    public double? Cl { get; set; }
    public double? Ph { get; set; }
    public double? Alkalinidad { get; set; }
    public double? Dureza { get; set; }
    public double? Temperatura { get; set; }
    public double? AplicationCl { get; set; }
    public double? AplicationPhMas { get; set; }
    public double? AplicationPhMenos { get; set; }
    public bool? Cepillado { get; set; }
    public bool? Aspirado { get; set; }
    public bool? Cenefas { get; set; }
}
