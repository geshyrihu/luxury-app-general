namespace MantenimientoLuxuryApp.MachineryDocument.DTOs;
/// <summary>Servicio o componente relacionado con documento DTO.</summary>
public record MachineryDocumentDTO : GuidIdEntityDTO
{
    // Obtiene o establece identificador.
    public Guid MachineryId { get; set; }
    // Obtiene o establece documento.
    public string Document { get; set; }
}

