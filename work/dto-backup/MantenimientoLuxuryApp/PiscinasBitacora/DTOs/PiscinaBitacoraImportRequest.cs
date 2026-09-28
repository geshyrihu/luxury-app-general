namespace MantenimientoLuxuryApp.PiscinasBitacora.DTOs;
/// <summary>
/// Cuerpo de la petición de importación de bitácora desde Excel.
/// </summary>
public record PiscinaBitacoraImportRequest
{
    public string ApplicationUserId { get; set; }
    public List<PiscinaBitacoraExcelRowDTO> Rows { get; set; }
}
