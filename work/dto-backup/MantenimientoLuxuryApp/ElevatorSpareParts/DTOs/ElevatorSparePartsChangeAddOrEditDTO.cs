namespace MantenimientoLuxuryApp.ElevatorSpareParts.DTOs;
/// <summary>Servicio o componente relacionado con agregar o edición DTO.</summary>
public record ElevatorSparePartsChangeAddOrEditDTO
{
    // Obtiene o establece .
    public string Folio { get; set; }
    // Obtiene o establece cliente identificador.
    public Guid CustomerId { get; set; }
    // Obtiene o establece identificador.
    public Guid MachineryId { get; set; }
    // Obtiene o establece fecha.
    public DateOnly ChangeDate { get; set; }
    // Obtiene o establece .
    public string Failure { get; set; }
    // Obtiene o establece nombre.
    public string PartName { get; set; }
    // Obtiene o establece .
    public string PartKey { get; set; }
    // Obtiene o establece precio.
    public decimal Price { get; set; }
    // Obtiene o establece .
    public string Supervised { get; set; }

}

