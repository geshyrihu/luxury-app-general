namespace MantenimientoLuxuryApp.PiscinasBitacora.DTOs;
/// <summary>
/// Resultado de la importación de bitácora desde Excel.
/// Reporta cuántas filas se insertaron, cuántas se omitieron por duplicadas,
/// y los errores de formato encontrados.
/// </summary>
public record PiscinaBitacoraImportResultDTO
{
    public int Inserted { get; set; }
    public int SkippedDuplicates { get; set; }
    public List<string> DuplicateKeys { get; set; } = new();
    public List<string> Errors { get; set; } = new();
}
