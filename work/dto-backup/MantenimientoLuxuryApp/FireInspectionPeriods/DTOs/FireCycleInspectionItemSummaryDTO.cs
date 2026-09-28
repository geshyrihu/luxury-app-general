namespace MantenimientoLuxuryApp.FireInspectionPeriods.DTOs;
/// <summary>Servicio o componente relacionado con elemento DTO.</summary>
public record FireCycleInspectionItemSummaryDTO
{
    // Obtiene o establece identificador.
    public Guid InspectionId { get; set; }
    // Obtiene o establece identificador.
    public Guid EquipmentId { get; set; }
    // Obtiene o establece tipo.
    public string EquipmentType { get; set; }
    // Obtiene o establece .
    public string Location { get; set; }
    // Obtiene o establece .
    public string LocalCode { get; set; }
    // Obtiene o establece tipo descripción.
    public string TypeDescription { get; set; }
    // Obtiene o establece estatus.
    public FireItemStatus Status { get; set; }
    // Obtiene o establece .
    public DateTime? InspectedAt { get; set; }
}
