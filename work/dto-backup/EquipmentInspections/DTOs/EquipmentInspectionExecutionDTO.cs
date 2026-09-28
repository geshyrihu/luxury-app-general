namespace MantenimientoLuxuryApp.EquipmentInspections.DTOs;
/// <summary>Servicio o componente relacionado con DTO.</summary>
public record EquipmentInspectionExecutionDTO
{
    // Obtiene o establece identificador.
    public Guid Id { get; set; }
    // Obtiene o establece cliente identificador.
    public Guid CustomerId { get; set; }
    // Obtiene o establece identificador.
    public Guid MachineryId { get; set; }
    // Obtiene o establece nombre.
    public string MachineryName { get; set; }
    // Obtiene o establece identificador.
    public Guid EquipmentInspectionDefinitionId { get; set; }
    // Obtiene o establece nombre.
    public string DefinitionName { get; set; }
    // Obtiene o establece a usuario identificador.
    public string AssignedToUserId { get; set; }
    // Obtiene o establece a usuario nombre.
    public string AssignedToUserName { get; set; }
    // Obtiene o establece por usuario identificador.
    public string ExecutedByUserId { get; set; }
    // Obtiene o establece por usuario nombre.
    public string ExecutedByUserName { get; set; }
    // Obtiene o establece estatus.
    public Status Status { get; set; }
    // Obtiene o establece .
    public InspectionStatus? Severity { get; set; }
    // Obtiene o establece .
    public string Observations { get; set; }
    // Obtiene o establece fecha.
    public DateOnly ExecutionDate { get; set; }
    // Obtiene o establece .
    public DateTime? StartedAt { get; set; }
    // Obtiene o establece .
    public DateTime? CompletedAt { get; set; }
    // Obtiene o establece es cerrado.
    public bool IsClosed { get; set; }
    // Obtiene o establece cantidad.
    public int AdministrativeModificationCount { get; set; }
    // Obtiene o establece .
    public string AdministrativeModificationReason { get; set; }
    // Obtiene o establece desde identificador.
    public Guid? GeneratedFromQrLabelId { get; set; }
}

/// <summary>Servicio o componente relacionado con lista DTO.</summary>
public record EquipmentInspectionExecutionListDTO
{
    // Obtiene o establece identificador.
    public Guid Id { get; set; }
    // Obtiene o establece identificador.
    public Guid MachineryId { get; set; }
    // Obtiene o establece nombre.
    public string MachineryName { get; set; }
    // Obtiene o establece identificador.
    public Guid EquipmentInspectionDefinitionId { get; set; }
    // Obtiene o establece nombre.
    public string DefinitionName { get; set; }
    // Obtiene o establece a usuario identificador.
    public string AssignedToUserId { get; set; }
    // Obtiene o establece a usuario nombre.
    public string AssignedToUserName { get; set; }
    // Obtiene o establece estatus.
    public Status Status { get; set; }
    // Obtiene o establece .
    public InspectionStatus? Severity { get; set; }
    // Obtiene o establece fecha.
    public DateOnly ExecutionDate { get; set; }
    // Obtiene o establece es cerrado.
    public bool IsClosed { get; set; }
    // Obtiene o establece pendiente elementos cantidad.
    public int PendingItemsCount { get; set; }
    // Obtiene o establece total elementos cantidad.
    public int TotalItemsCount { get; set; }
}

/// <summary>Servicio o componente relacionado con detalle DTO.</summary>
public record EquipmentInspectionExecutionDetailDTO : EquipmentInspectionExecutionDTO
{
    // Obtiene o establece .
    public string QrLabelCode { get; set; }
    // Obtiene o establece elementos.
    public List<EquipmentInspectionExecutionItemDTO> Items { get; set; } = [];
    // Obtiene o establece imágenes.
    public List<EquipmentInspectionExecutionImageDTO> Images { get; set; } = [];
    // Obtiene o establece servicio orden.
    public List<Guid> ServiceOrderIds { get; set; } = [];
}

/// <summary>Servicio o componente relacionado con elemento DTO.</summary>
public record EquipmentInspectionExecutionItemDTO
{
    // Obtiene o establece identificador.
    public Guid Id { get; set; }
    // Obtiene o establece identificador.
    public Guid EquipmentInspectionCriterionId { get; set; }
    // Obtiene o establece título.
    public string CriterionTitle { get; set; }
    // Obtiene o establece descripción.
    public string CriterionDescription { get; set; }
    // Obtiene o establece .
    public int Position { get; set; }
    // Obtiene o establece es requerido.
    public bool IsRequired { get; set; }
    // Obtiene o establece es.
    public bool IsCompliant { get; set; }
    // Obtiene o establece .
    public string Observation { get; set; }
}

/// <summary>Servicio o componente relacionado con imagen DTO.</summary>
public record EquipmentInspectionExecutionImageDTO
{
    // Obtiene o establece identificador.
    public Guid Id { get; set; }
    // Obtiene o establece imagen ruta.
    public string ImagePath { get; set; }
    // Obtiene o establece .
    public string Caption { get; set; }
    // Obtiene o establece .
    public int Position { get; set; }
    // Obtiene o establece .
    public DateTime UploadedAt { get; set; }
    // Obtiene o establece por usuario identificador.
    public string UploadedByUserId { get; set; }
    // Obtiene o establece por usuario nombre.
    public string UploadedByUserName { get; set; }
}

/// <summary>Servicio o componente relacionado con inicio desde DTO.</summary>
public record EquipmentInspectionExecutionStartFromQrDTO
{
    // Obtiene o establece cliente identificador.
    public Guid CustomerId { get; set; }
    // Obtiene o establece .
    public string Code { get; set; }
    // Obtiene o establece identificador.
    public Guid? DefinitionId { get; set; }
}

/// <summary>Servicio o componente relacionado con DTO.</summary>
public record EquipmentInspectionExecutionCompleteDTO
{
    // Obtiene o establece .
    public InspectionStatus Severity { get; set; }
    // Obtiene o establece .
    public string Observations { get; set; }
    // Obtiene o establece elementos.
    public List<EquipmentInspectionExecutionItemInputDTO> Items { get; set; } = [];
    // Obtiene o establece imágenes.
    public List<EquipmentInspectionExecutionImageInputDTO> Images { get; set; } = [];
}

/// <summary>Servicio o componente relacionado con actualizar DTO.</summary>
public record EquipmentInspectionExecutionAdministrativeUpdateDTO
{
    // Obtiene o establece .
    public InspectionStatus Severity { get; set; }
    // Obtiene o establece .
    public string Observations { get; set; }
    // Obtiene o establece .
    public string Reason { get; set; }
    // Obtiene o establece elementos.
    public List<EquipmentInspectionExecutionItemInputDTO> Items { get; set; } = [];
    // Obtiene o establece imágenes.
    public List<EquipmentInspectionExecutionImageInputDTO> Images { get; set; } = [];
}

/// <summary>Servicio o componente relacionado con elemento DTO.</summary>
public record EquipmentInspectionExecutionItemInputDTO
{
    // Obtiene o establece identificador.
    public Guid EquipmentInspectionCriterionId { get; set; }
    // Obtiene o establece es.
    public bool IsCompliant { get; set; }
    // Obtiene o establece .
    public string Observation { get; set; }
}

/// <summary>Servicio o componente relacionado con imagen DTO.</summary>
public record EquipmentInspectionExecutionImageInputDTO
{
    // Obtiene o establece imagen ruta.
    public string ImagePath { get; set; }
    // Obtiene o establece .
    public string Caption { get; set; }
    // Obtiene o establece .
    public int Position { get; set; }
}
