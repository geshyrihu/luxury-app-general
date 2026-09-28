namespace MantenimientoLuxuryApp.EquipmentInspections.Services;
/// <summary>Servicio o componente relacionado con aplicación servicio.</summary>
public class EquipmentQrLabelAppService(
    ApplicationDbContext dbContext,
    ICurrentUserService currentUserService) : IEquipmentQrLabelAppService
{
    /// <summary>Obtiene por.</summary>
    public async Task<ApiResponseDTO<List<EquipmentQrLabelListDTO>>> GetByMachineryAsync(Guid machineryId)
    {
        var machinery = await dbContext.Equipment
            .AsNoTracking()
            .Where(x => x.Id == machineryId)
            .Select(x => new { x.Id, x.CustomerId })
            .FirstOrDefaultAsync();

        if (machinery == null)
            return ApiResponseDTO<List<EquipmentQrLabelListDTO>>.ErrorResult("La maquinaria indicada no existe.", 404);

        var accessError = ValidateCustomerAccess(machinery.CustomerId);
        if (!string.IsNullOrWhiteSpace(accessError))
            return ApiResponseDTO<List<EquipmentQrLabelListDTO>>.ErrorResult(accessError, 403);

        var rawData = await dbContext.EquipmentQrLabels
            .AsNoTracking()
            .Where(x => x.MachineryId == machineryId)
            .OrderByDescending(x => x.IsActive)
            .ThenBy(x => x.Name)
            .ThenBy(x => x.Code)
            .Select(x => new
            {
                Id = x.Id,
                MachineryId = x.MachineryId,
                MachineryName = x.Machinery.NameMachinery,
                Code = x.Code,
                Name = x.Name,
                QrType = x.QrType,
                DeepLink = x.DeepLink,
                IsActive = x.IsActive,
                PrintedAt = x.PrintedAt
            })
            .ToListAsync();

        var data = rawData.Select(x => new EquipmentQrLabelListDTO
        {
            Id = x.Id,
            MachineryId = x.MachineryId,
            MachineryName = x.MachineryName,
            Code = x.Code,
            Name = x.Name,
            QrType = x.QrType,
            QrTypeName = x.QrType.GetDisplayName(),
            DeepLink = x.DeepLink,
            IsActive = x.IsActive,
            PrintedAt = x.PrintedAt
        }).ToList();

        return ApiResponseDTO<List<EquipmentQrLabelListDTO>>.SuccessResult(data);
    }

    /// <summary>Obtiene por identificador.</summary>
    public async Task<ApiResponseDTO<EquipmentQrLabelDTO>> GetByIdAsync(Guid id)
    {
        var rawData = await dbContext.EquipmentQrLabels
            .AsNoTracking()
            .Where(x => x.Id == id)
            .Select(x => new
            {
                Id = x.Id,
                CustomerId = x.CustomerId,
                MachineryId = x.MachineryId,
                MachineryName = x.Machinery.NameMachinery,
                Code = x.Code,
                Name = x.Name,
                QrType = x.QrType,
                DeepLink = x.DeepLink,
                IsActive = x.IsActive,
                PrintedAt = x.PrintedAt,
                PrintedByUserId = x.PrintedByUserId,
                PrintedByUserName = x.PrintedByUser != null ? x.PrintedByUser.FullName : null,
                Notes = x.Notes,
                CreatedAt = x.CreatedAt
            })
            .FirstOrDefaultAsync();

        if (rawData == null)
            return ApiResponseDTO<EquipmentQrLabelDTO>.ErrorResult("La etiqueta QR no existe.", 404);

        var accessError = ValidateCustomerAccess(rawData.CustomerId);
        if (!string.IsNullOrWhiteSpace(accessError))
            return ApiResponseDTO<EquipmentQrLabelDTO>.ErrorResult(accessError, 403);

        var data = new EquipmentQrLabelDTO
        {
            Id = rawData.Id,
            CustomerId = rawData.CustomerId,
            MachineryId = rawData.MachineryId,
            MachineryName = rawData.MachineryName,
            Code = rawData.Code,
            Name = rawData.Name,
            QrType = rawData.QrType,
            QrTypeName = rawData.QrType.GetDisplayName(),
            DeepLink = rawData.DeepLink,
            IsActive = rawData.IsActive,
            PrintedAt = rawData.PrintedAt,
            PrintedByUserId = rawData.PrintedByUserId,
            PrintedByUserName = rawData.PrintedByUserName,
            Notes = rawData.Notes,
            CreatedAt = rawData.CreatedAt
        };

        return ApiResponseDTO<EquipmentQrLabelDTO>.SuccessResult(data);
    }

    /// <summary>Agrega .</summary>
    public async Task<ApiResponseDTO<EquipmentQrLabelDTO>> AddAsync(EquipmentQrLabelAddOrEditDTO dto)
    {
        if (dto.CustomerId == Guid.Empty)
            return ApiResponseDTO<EquipmentQrLabelDTO>.ErrorResult("El customerId es requerido.");

        if (dto.MachineryId == Guid.Empty)
            return ApiResponseDTO<EquipmentQrLabelDTO>.ErrorResult("La maquinaria es requerida.");

        var accessError = ValidateCustomerAccess(dto.CustomerId);
        if (!string.IsNullOrWhiteSpace(accessError))
            return ApiResponseDTO<EquipmentQrLabelDTO>.ErrorResult(accessError, 403);

        var machinery = await dbContext.Equipment
            .FirstOrDefaultAsync(x => x.Id == dto.MachineryId && x.CustomerId == dto.CustomerId);

        if (machinery == null)
            return ApiResponseDTO<EquipmentQrLabelDTO>.ErrorResult("La maquinaria indicada no existe o no pertenece al cliente.");

        var code = await GenerateUniqueCodeAsync(dto.CustomerId);

        var entity = new EquipmentQrLabel
        {
            CustomerId = dto.CustomerId,
            MachineryId = dto.MachineryId,
            Code = code,
            Name = string.IsNullOrWhiteSpace(dto.Name) ? $"QR {machinery.NameMachinery}" : dto.Name.Trim(),
            QrType = dto.QrType,
            DeepLink = BuildDeepLink(code),
            IsActive = dto.IsActive,
            Notes = string.IsNullOrWhiteSpace(dto.Notes) ? null : dto.Notes.Trim(),
            CreatedAt = DateTime.UtcNow,
            PrintedByUserId = null,
            PrintedAt = null
        };

        dbContext.EquipmentQrLabels.Add(entity);
        await dbContext.SaveChangesAsync();

        return await GetByIdAsync(entity.Id);
    }

    /// <summary>Ejecuta la operación de .</summary>
    public async Task<ApiResponseDTO<EquipmentQrLabelDTO>> RegenerateAsync(Guid id)
    {
        var entity = await dbContext.EquipmentQrLabels
            .FirstOrDefaultAsync(x => x.Id == id);

        if (entity == null)
            return ApiResponseDTO<EquipmentQrLabelDTO>.ErrorResult("La etiqueta QR no existe.", 404);

        var accessError = ValidateCustomerAccess(entity.CustomerId);
        if (!string.IsNullOrWhiteSpace(accessError))
            return ApiResponseDTO<EquipmentQrLabelDTO>.ErrorResult(accessError, 403);

        entity.Code = await GenerateUniqueCodeAsync(entity.CustomerId);
        entity.DeepLink = BuildDeepLink(entity.Code);
        entity.PrintedAt = DateTime.UtcNow;
        entity.PrintedByUserId = currentUserService.UserId;

        await dbContext.SaveChangesAsync();
        return await GetByIdAsync(entity.Id);
    }

    /// <summary>Descarga .</summary>
    public async Task<ApiResponseDTO<EquipmentQrDownloadItemDTO>> DownloadAsync(Guid id)
    {
        var qrLabel = await dbContext.EquipmentQrLabels
            .AsNoTracking()
            .Include(x => x.Machinery)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (qrLabel == null)
            return ApiResponseDTO<EquipmentQrDownloadItemDTO>.ErrorResult("La etiqueta QR no existe.", 404);

        var accessError = ValidateCustomerAccess(qrLabel.CustomerId);
        if (!string.IsNullOrWhiteSpace(accessError))
            return ApiResponseDTO<EquipmentQrDownloadItemDTO>.ErrorResult(accessError, 403);

        return ApiResponseDTO<EquipmentQrDownloadItemDTO>.SuccessResult(MapDownloadItem(qrLabel));
    }

    /// <summary>Descarga .</summary>
    public async Task<ApiResponseDTO<List<EquipmentQrDownloadItemDTO>>> DownloadBatchAsync(EquipmentQrBatchDownloadDTO dto)
    {
        if (dto.CustomerId == Guid.Empty)
            return ApiResponseDTO<List<EquipmentQrDownloadItemDTO>>.ErrorResult("El customerId es requerido.");

        var accessError = ValidateCustomerAccess(dto.CustomerId);
        if (!string.IsNullOrWhiteSpace(accessError))
            return ApiResponseDTO<List<EquipmentQrDownloadItemDTO>>.ErrorResult(accessError, 403);

        var query = dbContext.EquipmentQrLabels
            .AsNoTracking()
            .Include(x => x.Machinery)
            .Where(x => x.CustomerId == dto.CustomerId);

        if (dto.OnlyActive)
            query = query.Where(x => x.IsActive);

        if (dto.QrLabelIds.Count > 0)
            query = query.Where(x => dto.QrLabelIds.Contains(x.Id));

        if (dto.MachineryIds.Count > 0)
            query = query.Where(x => dto.MachineryIds.Contains(x.MachineryId));

        var data = await query
            .OrderBy(x => x.Machinery.NameMachinery)
            .ThenBy(x => x.Name)
            .ThenBy(x => x.Code)
            .ToListAsync();

        return ApiResponseDTO<List<EquipmentQrDownloadItemDTO>>.SuccessResult(data.Select(MapDownloadItem).ToList());
    }

    /// <summary>Ejecuta la operación de .</summary>
    public async Task<ApiResponseDTO<EquipmentQrResolveDTO>> ResolveAsync(string code)
    {
        if (string.IsNullOrWhiteSpace(code))
            return ApiResponseDTO<EquipmentQrResolveDTO>.ErrorResult("El codigo QR es requerido.");

        var qrLabel = await dbContext.EquipmentQrLabels
            .AsNoTracking()
            .Include(x => x.Machinery)
            .FirstOrDefaultAsync(x => x.Code == code.Trim());

        if (qrLabel == null)
            return ApiResponseDTO<EquipmentQrResolveDTO>.ErrorResult("La etiqueta QR no existe.", 404);

        var accessError = ValidateCustomerAccess(qrLabel.CustomerId);
        if (!string.IsNullOrWhiteSpace(accessError))
            return ApiResponseDTO<EquipmentQrResolveDTO>.ErrorResult(accessError, 403);

        if (!qrLabel.IsActive)
            return ApiResponseDTO<EquipmentQrResolveDTO>.ErrorResult("La etiqueta QR esta inactiva.");

        var today = DateOnly.FromDateTime(DateTimeExtension.GetMexicoDateOnly());

        var definitions = await dbContext.EquipmentInspectionDefinitions
            .AsNoTracking()
            .Include(x => x.WeekDays)
            .Where(x => x.CustomerId == qrLabel.CustomerId && x.MachineryId == qrLabel.MachineryId && x.IsActive)
            .OrderBy(x => x.Name)
            .ToListAsync();

        var suggestedDefinition = definitions.FirstOrDefault(x => ShouldGenerateForDate(x, today)) ?? definitions.FirstOrDefault();

        Guid? pendingExecutionId = null;
        if (suggestedDefinition != null)
        {
            pendingExecutionId = await dbContext.EquipmentInspectionExecutions
                .AsNoTracking()
                .Where(x => x.EquipmentInspectionDefinitionId == suggestedDefinition.Id && x.ExecutionDate == today && !x.IsClosed)
                .Select(x => (Guid?)x.Id)
                .FirstOrDefaultAsync();
        }

        var result = new EquipmentQrResolveDTO
        {
            CustomerId = qrLabel.CustomerId,
            MachineryId = qrLabel.MachineryId,
            MachineryName = qrLabel.Machinery.NameMachinery,
            MachineryLocation = qrLabel.Machinery.Ubication,
            QrLabelId = qrLabel.Id,
            QrLabelName = qrLabel.Name,
            Code = qrLabel.Code,
            QrType = qrLabel.QrType,
            QrTypeName = qrLabel.QrType.GetDisplayName(),
            DeepLink = qrLabel.DeepLink,
            SuggestedDefinitionId = suggestedDefinition?.Id,
            SuggestedDefinitionName = suggestedDefinition?.Name,
            HasPendingExecution = pendingExecutionId.HasValue,
            PendingExecutionId = pendingExecutionId
        };

        return ApiResponseDTO<EquipmentQrResolveDTO>.SuccessResult(result);
    }

    private async Task<string> GenerateUniqueCodeAsync(Guid customerId)
    {
        for (var attempt = 0; attempt < 5; attempt++)
        {
            var code = $"EQI-{Guid.CreateVersion7().ToString("N")[..12].ToUpperInvariant()}";
            var exists = await dbContext.EquipmentQrLabels.AnyAsync(x => x.CustomerId == customerId && x.Code == code);
            if (!exists)
                return code;
        }

        return $"EQI-{Guid.CreateVersion7():N}".ToUpperInvariant();
    }

    private static string BuildDeepLink(string code)
        => $"luxuryapp://equipment-inspection/{code}";

    private static EquipmentQrDownloadItemDTO MapDownloadItem(EquipmentQrLabel qrLabel)
    {
        return new EquipmentQrDownloadItemDTO
        {
            QrLabelId = qrLabel.Id,
            CustomerId = qrLabel.CustomerId,
            MachineryId = qrLabel.MachineryId,
            MachineryName = qrLabel.Machinery?.NameMachinery,
            MachineryLocation = qrLabel.Machinery?.Ubication,
            LabelName = qrLabel.Name,
            Code = qrLabel.Code,
            DeepLink = qrLabel.DeepLink,
            QrText = qrLabel.DeepLink,
            QrTypeName = qrLabel.QrType.GetDisplayName()
        };
    }

    private static bool ShouldGenerateForDate(EquipmentInspectionDefinition definition, DateOnly executionDate)
    {
        var startDate = DateOnly.FromDateTime(definition.CreatedAt.Date);
        if (executionDate < startDate)
            return false;

        return definition.RecurrenceUnit switch
        {
            RecurrenceUnit.Day => (executionDate.DayNumber - startDate.DayNumber) % definition.RecurrenceInterval == 0,
            RecurrenceUnit.Week => ShouldGenerateWeekly(definition, executionDate, startDate),
            RecurrenceUnit.Month => ShouldGenerateMonthly(definition, executionDate, startDate),
            _ => false
        };
    }

    private static bool ShouldGenerateWeekly(EquipmentInspectionDefinition definition, DateOnly executionDate, DateOnly startDate)
    {
        if (!definition.WeekDays.Any(x => x.WeekDay == executionDate.DayOfWeek))
            return false;

        var daysDifference = executionDate.DayNumber - startDate.DayNumber;
        var weeksDifference = daysDifference / 7;
        return weeksDifference % definition.RecurrenceInterval == 0;
    }

    private static bool ShouldGenerateMonthly(EquipmentInspectionDefinition definition, DateOnly executionDate, DateOnly startDate)
    {
        if (!definition.DayOfMonth.HasValue)
            return false;

        var expectedDay = Math.Min(definition.DayOfMonth.Value, DateTime.DaysInMonth(executionDate.Year, executionDate.Month));
        if (executionDate.Day != expectedDay)
            return false;

        var monthsDifference = (executionDate.Year - startDate.Year) * 12 + executionDate.Month - startDate.Month;
        return monthsDifference % definition.RecurrenceInterval == 0;
    }

    private string ValidateCustomerAccess(Guid customerId)
    {
        if (customerId == Guid.Empty)
            return "El customerId es requerido.";

        if (currentUserService.UserRole == nameof(ApplicationRoleEnum.SuperUsuario))
            return string.Empty;

        if (!currentUserService.CustomerId.HasValue)
            return "No fue posible identificar el customer del usuario autenticado.";

        if (currentUserService.CustomerId.Value != customerId)
            return "No tienes permisos para operar etiquetas QR de otro customer.";

        return string.Empty;
    }
}
