namespace MantenimientoLuxuryApp.ElevatorSpareParts.DTOs;
/// <summary>Servicio o componente relacionado con DTO.</summary>
public record ElevatorSparePartsChangeDTO : GuidIdEntityDTO
{
    // Obtiene o establece .
    public string Folio { get; set; }
    // Obtiene o establece cliente.
    public string Customer { get; set; }
    // Obtiene o establece .
    public string Machinery { get; set; }
    // Obtiene o establece fecha.
    public string ChangeDate { get; set; }
    // Obtiene o establece .
    public string Failure { get; set; }
    // Obtiene o establece nombre.
    public string PartName { get; set; }
    // Obtiene o establece .
    public string PartKey { get; set; }
    // Obtiene o establece precio.
    public string Price { get; set; }
    // Obtiene o establece .
    public string Supervised { get; set; }
}

