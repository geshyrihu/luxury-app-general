namespace MantenimientoLuxuryApp.FireInspectionPeriods.DTOs;
/// <summary>Servicio o componente relacionado con detalle DTO.</summary>
public record FireInspectionCycleDetailDTO : GuidIdEntityDTO
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
    // Obtiene o establece elementos.
    public FireCycleInspectionItemSummaryDTO[] Items { get; set; } = [];
}
