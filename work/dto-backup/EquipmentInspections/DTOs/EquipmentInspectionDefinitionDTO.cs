namespace MantenimientoLuxuryApp.EquipmentInspections.DTOs;
/// <summary>Servicio o componente relacionado con DTO.</summary>
public record EquipmentInspectionDefinitionDTO
{
    // Obtiene o establece identificador.
    public Guid Id { get; set; }
    // Obtiene o establece cliente identificador.
    public Guid CustomerId { get; set; }
    // Obtiene o establece identificador.
    public Guid MachineryId { get; set; }
    // Obtiene o establece nombre.
    public string MachineryName { get; set; }
    // Obtiene o establece nombre.
    public string Name { get; set; }
    // Obtiene o establece descripción.
    public string Description { get; set; }
    // Obtiene o establece es activo.
    public bool IsActive { get; set; }
    // Obtiene o establece recurrencia unidad.
    public RecurrenceUnit RecurrenceUnit { get; set; }
    // Obtiene o establece recurrencia.
    public int RecurrenceInterval { get; set; }
    // Obtiene o establece día de.
    public int? DayOfMonth { get; set; }
    // Obtiene o establece .
    public int? EstimatedDurationMinutes { get; set; }
    // Obtiene o establece .
    public DateTime CreatedAt { get; set; }
    // Obtiene o establece por usuario identificador.
    public string CreatedByUserId { get; set; }
    // Obtiene o establece por usuario nombre.
    public string CreatedByUserName { get; set; }
    // Obtiene o establece .
    public List<EquipmentInspectionDefinitionAssigneeDTO> Assignees { get; set; } = [];
    // Obtiene o establece semana días.
    public List<DayOfWeek> WeekDays { get; set; } = [];
    // Obtiene o establece .
    public List<EquipmentInspectionCriterionDTO> Criteria { get; set; } = [];
}

/// <summary>Servicio o componente relacionado con lista DTO.</summary>
public record EquipmentInspectionDefinitionListDTO
{
    // Obtiene o establece identificador.
    public Guid Id { get; set; }
    // Obtiene o establece identificador.
    public Guid MachineryId { get; set; }
    // Obtiene o establece nombre.
    public string MachineryName { get; set; }
    // Obtiene o establece nombre.
    public string Name { get; set; }
    // Obtiene o establece es activo.
    public bool IsActive { get; set; }
    // Obtiene o establece recurrencia unidad.
    public RecurrenceUnit RecurrenceUnit { get; set; }
    // Obtiene o establece recurrencia.
    public int RecurrenceInterval { get; set; }
    // Obtiene o establece día de.
    public int? DayOfMonth { get; set; }
    // Obtiene o establece cantidad.
    public int CriteriaCount { get; set; }
    // Obtiene o establece cantidad.
    public int AssigneesCount { get; set; }
}

/// <summary>Servicio o componente relacionado con asignado DTO.</summary>
public record EquipmentInspectionDefinitionAssigneeDTO
{
    // Obtiene o establece usuario identificador.
    public string ApplicationUserId { get; set; }
    // Obtiene o establece nombre.
    public string FullName { get; set; }
    // Obtiene o establece es.
    public bool IsPrimary { get; set; }
}

/// <summary>Servicio o componente relacionado con DTO.</summary>
public record EquipmentInspectionCriterionDTO
{
    // Obtiene o establece identificador.
    public Guid Id { get; set; }
    // Obtiene o establece título.
    public string Title { get; set; }
    // Obtiene o establece descripción.
    public string Description { get; set; }
    // Obtiene o establece .
    public int Position { get; set; }
    // Obtiene o establece es requerido.
    public bool IsRequired { get; set; }
    // Obtiene o establece es activo.
    public bool IsActive { get; set; }
}
