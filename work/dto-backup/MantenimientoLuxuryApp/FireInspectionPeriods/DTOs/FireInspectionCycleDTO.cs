namespace MantenimientoLuxuryApp.FireInspectionPeriods.DTOs;
/// <summary>Servicio o componente relacionado con DTO.</summary>
public record FireInspectionCycleDTO : GuidIdEntityDTO
{
    // Obtiene o establece identificador.
    public Guid FireInspectionPeriodId { get; set; }
    // Obtiene o establece nombre.
    public string PeriodName { get; set; }
    // Obtiene o establece inicio.
    public DateOnly PeriodStart { get; set; }
    // Obtiene o establece fin.
    public DateOnly PeriodEnd { get; set; }
    // Obtiene o establece estatus.
    public FireCycleStatus Status { get; set; }
    // Obtiene o establece .
    public DateTime GeneratedAt { get; set; }
    // Obtiene o establece total elementos.
    public int TotalItems { get; set; }
    // Obtiene o establece pendiente elementos.
    public int PendingItems { get; set; }
    // Obtiene o establece elementos.
    public int CompletedItems { get; set; }
}
