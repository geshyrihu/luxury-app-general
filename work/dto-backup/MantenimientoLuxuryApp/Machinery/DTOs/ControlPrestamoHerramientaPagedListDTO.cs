namespace MantenimientoLuxuryApp.Machinery.DTOs;
/// <summary>Servicio o componente relacionado con lista DTO.</summary>
public record ControlPrestamoHerramientaPagedListDTO
{
    // Obtiene o establece elementos.
    public IEnumerable<ControlPrestamoHerramientaListDTO> Items { get; set; } = [];
    // Obtiene o establece total.
    public int TotalRecords { get; set; }
}

