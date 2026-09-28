namespace MantenimientoLuxuryApp.EquipmentInspections.DTOs;
/// <summary>Servicio o componente relacionado con agregar o edición DTO.</summary>
public record EquipmentInspectionDefinitionAddOrEditDTO
{
    // Obtiene o establece cliente identificador.
    public Guid CustomerId { get; set; }
    // Obtiene o establece identificador.
    public Guid MachineryId { get; set; }
    // Obtiene o establece nombre.
    public string Name { get; set; }
    // Obtiene o establece descripción.
    public string Description { get; set; }
    // Obtiene o establece es activo.
    public bool IsActive { get; set; } = true;
    // Obtiene o establece recurrencia unidad.
    public RecurrenceUnit RecurrenceUnit { get; set; }
    // Obtiene o establece recurrencia.
    public int RecurrenceInterval { get; set; }
    // Obtiene o establece día de.
    public int? DayOfMonth { get; set; }
    // Obtiene o establece .
    public int? EstimatedDurationMinutes { get; set; }
    // Obtiene o establece por usuario identificador.
    public string CreatedByUserId { get; set; }
    // Obtiene o establece .
    public List<EquipmentInspectionDefinitionAssigneeInputDTO> Assignees { get; set; } = [];
    // Obtiene o establece semana días.
    public List<DayOfWeek> WeekDays { get; set; } = [];
    // Obtiene o establece .
    public List<EquipmentInspectionCriterionInputDTO> Criteria { get; set; } = [];
}

/// <summary>Servicio o componente relacionado con asignado DTO.</summary>
public record EquipmentInspectionDefinitionAssigneeInputDTO
{
    // Obtiene o establece usuario identificador.
    public string ApplicationUserId { get; set; }
    // Obtiene o establece es.
    public bool IsPrimary { get; set; }
}

/// <summary>Servicio o componente relacionado con DTO.</summary>
public record EquipmentInspectionCriterionInputDTO
{
    // Obtiene o establece título.
    public string Title { get; set; }
    // Obtiene o establece descripción.
    public string Description { get; set; }
    // Obtiene o establece .
    public int Position { get; set; }
    // Obtiene o establece es requerido.
    public bool IsRequired { get; set; } = true;
    // Obtiene o establece es activo.
    public bool IsActive { get; set; } = true;
}
