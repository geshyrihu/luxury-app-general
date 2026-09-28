namespace MantenimientoLuxuryApp.FireInspectionPeriods.DTOs;
/// <summary>Servicio o componente relacionado con agregar o edición DTO.</summary>
public record FireInspectionPeriodAddOrEditDTO
{
    // Obtiene o establece cliente identificador.
    public Guid CustomerId { get; set; }
    // Obtiene o establece nombre.
    public string Name { get; set; }
    // Obtiene o establece descripción.
    public string Description { get; set; }
    // Obtiene o establece inicio fecha.
    public DateOnly StartDate { get; set; }
    // Obtiene o establece .
    public Recurrence Frecuencia { get; set; }
    // Obtiene o establece es activo.
    public bool IsActive { get; set; } = true;
    // Obtiene o establece usuario identificador.
    public string ApplicationUserId { get; set; }
}
