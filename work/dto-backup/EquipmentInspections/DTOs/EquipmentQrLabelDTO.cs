namespace MantenimientoLuxuryApp.EquipmentInspections.DTOs;
/// <summary>Servicio o componente relacionado con DTO.</summary>
public record EquipmentQrLabelDTO
{
    // Obtiene o establece identificador.
    public Guid Id { get; set; }
    // Obtiene o establece cliente identificador.
    public Guid CustomerId { get; set; }
    // Obtiene o establece identificador.
    public Guid MachineryId { get; set; }
    // Obtiene o establece nombre.
    public string MachineryName { get; set; }
    // Obtiene o establece .
    public string Code { get; set; }
    // Obtiene o establece nombre.
    public string Name { get; set; }
    // Obtiene o establece tipo.
    public EquipmentInspectionQrType QrType { get; set; }
    // Obtiene o establece tipo nombre.
    public string QrTypeName { get; set; }
    // Obtiene o establece .
    public string DeepLink { get; set; }
    // Obtiene o establece es activo.
    public bool IsActive { get; set; }
    // Obtiene o establece .
    public DateTime? PrintedAt { get; set; }
    // Obtiene o establece por usuario identificador.
    public string PrintedByUserId { get; set; }
    // Obtiene o establece por usuario nombre.
    public string PrintedByUserName { get; set; }
    // Obtiene o establece notas.
    public string Notes { get; set; }
    // Obtiene o establece .
    public DateTime CreatedAt { get; set; }
}

/// <summary>Servicio o componente relacionado con lista DTO.</summary>
public record EquipmentQrLabelListDTO
{
    // Obtiene o establece identificador.
    public Guid Id { get; set; }
    // Obtiene o establece identificador.
    public Guid MachineryId { get; set; }
    // Obtiene o establece nombre.
    public string MachineryName { get; set; }
    // Obtiene o establece .
    public string Code { get; set; }
    // Obtiene o establece nombre.
    public string Name { get; set; }
    // Obtiene o establece tipo.
    public EquipmentInspectionQrType QrType { get; set; }
    // Obtiene o establece tipo nombre.
    public string QrTypeName { get; set; }
    // Obtiene o establece .
    public string DeepLink { get; set; }
    // Obtiene o establece es activo.
    public bool IsActive { get; set; }
    // Obtiene o establece .
    public DateTime? PrintedAt { get; set; }
}

/// <summary>Servicio o componente relacionado con agregar o edición DTO.</summary>
public record EquipmentQrLabelAddOrEditDTO
{
    // Obtiene o establece cliente identificador.
    public Guid CustomerId { get; set; }
    // Obtiene o establece identificador.
    public Guid MachineryId { get; set; }
    // Obtiene o establece nombre.
    public string Name { get; set; }
    // Obtiene o establece tipo.
    public EquipmentInspectionQrType QrType { get; set; } = EquipmentInspectionQrType.Inspection;
    // Obtiene o establece es activo.
    public bool IsActive { get; set; } = true;
    // Obtiene o establece notas.
    public string Notes { get; set; }
}

/// <summary>Servicio o componente relacionado con DTO.</summary>
public record EquipmentQrResolveDTO
{
    // Obtiene o establece cliente identificador.
    public Guid CustomerId { get; set; }
    // Obtiene o establece identificador.
    public Guid MachineryId { get; set; }
    // Obtiene o establece nombre.
    public string MachineryName { get; set; }
    // Obtiene o establece .
    public string MachineryLocation { get; set; }
    // Obtiene o establece identificador.
    public Guid QrLabelId { get; set; }
    // Obtiene o establece nombre.
    public string QrLabelName { get; set; }
    // Obtiene o establece .
    public string Code { get; set; }
    // Obtiene o establece tipo.
    public EquipmentInspectionQrType QrType { get; set; }
    // Obtiene o establece tipo nombre.
    public string QrTypeName { get; set; }
    // Obtiene o establece .
    public string DeepLink { get; set; }
    // Obtiene o establece identificador.
    public Guid? SuggestedDefinitionId { get; set; }
    // Obtiene o establece nombre.
    public string SuggestedDefinitionName { get; set; }
    // Obtiene o establece tiene pendiente.
    public bool HasPendingExecution { get; set; }
    // Obtiene o establece pendiente identificador.
    public Guid? PendingExecutionId { get; set; }
}

/// <summary>Servicio o componente relacionado con DTO.</summary>
public record EquipmentQrBatchDownloadDTO
{
    // Obtiene o establece cliente identificador.
    public Guid CustomerId { get; set; }
    // Obtiene o establece .
    public List<Guid> MachineryIds { get; set; } = [];
    // Obtiene o establece .
    public List<Guid> QrLabelIds { get; set; } = [];
    // Obtiene o establece activo.
    public bool OnlyActive { get; set; } = true;
}

/// <summary>Servicio o componente relacionado con elemento DTO.</summary>
public record EquipmentQrDownloadItemDTO
{
    // Obtiene o establece identificador.
    public Guid QrLabelId { get; set; }
    // Obtiene o establece cliente identificador.
    public Guid CustomerId { get; set; }
    // Obtiene o establece identificador.
    public Guid MachineryId { get; set; }
    // Obtiene o establece nombre.
    public string MachineryName { get; set; }
    // Obtiene o establece .
    public string MachineryLocation { get; set; }
    // Obtiene o establece nombre.
    public string LabelName { get; set; }
    // Obtiene o establece .
    public string Code { get; set; }
    // Obtiene o establece .
    public string DeepLink { get; set; }
    // Obtiene o establece .
    public string QrText { get; set; }
    // Obtiene o establece tipo nombre.
    public string QrTypeName { get; set; }
    // Obtiene o establece .
    public decimal LabelWidthMm { get; set; } = 63.5m;
    // Obtiene o establece .
    public decimal LabelHeightMm { get; set; } = 38m;
}
