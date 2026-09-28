namespace MantenimientoLuxuryApp.EquipmentInspections.Services;
/// <summary>Servicio o componente relacionado con aplicación servicio.</summary>
public class EquipmentInspectionExecutionAppService(
    ApplicationDbContext dbContext,
    ICurrentUserService currentUserService,
    IResponsablesClienteAppService responsablesClienteAppService,
    INotificationDispatcher notificationDispatcher,
    ISendEmailService sendEmailService,
    IConfiguration configuration,
    ILogger<EquipmentInspectionExecutionAppService> logger) : IEquipmentInspectionExecutionAppService
{
    private static readonly HashSet<string> AdministrativeRoles =
    [
        nameof(ApplicationRoleEnum.Administrador),
        nameof(ApplicationRoleEnum.JefeMantenimiento),
        nameof(ApplicationRoleEnum.SuperUsuario)
    ];

    /// <summary>Obtiene pendiente.</summary>
    public async Task<ApiResponseDTO<List<EquipmentInspectionExecutionListDTO>>> GetPendingAsync(Guid customerId)
    {
        var accessError = ValidateCustomerAccess(customerId);
        if (!string.IsNullOrWhiteSpace(accessError))
            return ApiResponseDTO<List<EquipmentInspectionExecutionListDTO>>.ErrorResult(accessError, 403);

        await GeneratePendingExecutionsAsync(customerId, DateOnly.FromDateTime(DateTimeExtension.GetMexicoDateOnly()));

        var query = dbContext.EquipmentInspectionExecutions
            .AsNoTracking()
            .Where(x => x.CustomerId == customerId && !x.IsClosed);

        var data = await query
            .OrderBy(x => x.ExecutionDate)
            .ThenBy(x => x.Machinery.NameMachinery)
            .ThenBy(x => x.EquipmentInspectionDefinition.Name)
            .Select(x => new EquipmentInspectionExecutionListDTO
            {
                Id = x.Id,
                MachineryId = x.MachineryId,
                MachineryName = x.Machinery.NameMachinery,
                EquipmentInspectionDefinitionId = x.EquipmentInspectionDefinitionId,
                DefinitionName = x.EquipmentInspectionDefinition.Name,
                AssignedToUserId = x.AssignedToUserId,
                AssignedToUserName = x.AssignedToUser != null ? x.AssignedToUser.FullName : null,
                Status = x.Status,
                Severity = x.Severity,
                ExecutionDate = x.ExecutionDate,
                IsClosed = x.IsClosed,
                TotalItemsCount = x.Items.Count,
                PendingItemsCount = x.Items.Count(i => !i.IsCompliant)
            })
            .ToListAsync();

        return ApiResponseDTO<List<EquipmentInspectionExecutionListDTO>>.SuccessResult(data);
    }

    /// <summary>Obtiene por.</summary>
    public async Task<ApiResponseDTO<List<EquipmentInspectionExecutionListDTO>>> GetByMachineryAsync(Guid machineryId)
    {
        var machinery = await dbContext.Equipment
            .AsNoTracking()
            .Where(x => x.Id == machineryId)
            .Select(x => new { x.Id, x.CustomerId })
            .FirstOrDefaultAsync();

        if (machinery == null)
            return ApiResponseDTO<List<EquipmentInspectionExecutionListDTO>>.ErrorResult("La maquinaria indicada no existe.", 404);

        var accessError = ValidateCustomerAccess(machinery.CustomerId);
        if (!string.IsNullOrWhiteSpace(accessError))
            return ApiResponseDTO<List<EquipmentInspectionExecutionListDTO>>.ErrorResult(accessError, 403);

        var data = await dbContext.EquipmentInspectionExecutions
            .AsNoTracking()
            .Where(x => x.MachineryId == machineryId)
            .OrderByDescending(x => x.ExecutionDate)
            .ThenByDescending(x => x.StartedAt)
            .Select(x => new EquipmentInspectionExecutionListDTO
            {
                Id = x.Id,
                MachineryId = x.MachineryId,
                MachineryName = x.Machinery.NameMachinery,
                EquipmentInspectionDefinitionId = x.EquipmentInspectionDefinitionId,
                DefinitionName = x.EquipmentInspectionDefinition.Name,
                AssignedToUserId = x.AssignedToUserId,
                AssignedToUserName = x.AssignedToUser != null ? x.AssignedToUser.FullName : null,
                Status = x.Status,
                Severity = x.Severity,
                ExecutionDate = x.ExecutionDate,
                IsClosed = x.IsClosed,
                TotalItemsCount = x.Items.Count,
                PendingItemsCount = x.Items.Count(i => !i.IsCompliant)
            })
            .ToListAsync();

        return ApiResponseDTO<List<EquipmentInspectionExecutionListDTO>>.SuccessResult(data);
    }

    /// <summary>Obtiene por identificador.</summary>
    public async Task<ApiResponseDTO<EquipmentInspectionExecutionDetailDTO>> GetByIdAsync(Guid id)
    {
        var data = await dbContext.EquipmentInspectionExecutions
            .AsNoTracking()
            .Where(x => x.Id == id)
            .Select(x => new EquipmentInspectionExecutionDetailDTO
            {
                Id = x.Id,
                CustomerId = x.CustomerId,
                MachineryId = x.MachineryId,
                MachineryName = x.Machinery.NameMachinery,
                EquipmentInspectionDefinitionId = x.EquipmentInspectionDefinitionId,
                DefinitionName = x.EquipmentInspectionDefinition.Name,
                AssignedToUserId = x.AssignedToUserId,
                AssignedToUserName = x.AssignedToUser != null ? x.AssignedToUser.FullName : null,
                ExecutedByUserId = x.ExecutedByUserId,
                ExecutedByUserName = x.ExecutedByUser != null ? x.ExecutedByUser.FullName : null,
                Status = x.Status,
                Severity = x.Severity,
                Observations = x.Observations,
                ExecutionDate = x.ExecutionDate,
                StartedAt = x.StartedAt,
                CompletedAt = x.CompletedAt,
                IsClosed = x.IsClosed,
                AdministrativeModificationCount = x.AdministrativeModificationCount,
                AdministrativeModificationReason = x.AdministrativeModificationReason,
                GeneratedFromQrLabelId = x.GeneratedFromQrLabelId,
                QrLabelCode = x.GeneratedFromQrLabel != null ? x.GeneratedFromQrLabel.Code : null,
                Items = x.Items
                    .OrderBy(i => i.Position)
                    .Select(i => new EquipmentInspectionExecutionItemDTO
                    {
                        Id = i.Id,
                        EquipmentInspectionCriterionId = i.EquipmentInspectionCriterionId,
                        CriterionTitle = i.EquipmentInspectionCriterion.Title,
                        CriterionDescription = i.EquipmentInspectionCriterion.Description,
                        Position = i.Position,
                        IsRequired = i.EquipmentInspectionCriterion.IsRequired,
                        IsCompliant = i.IsCompliant,
                        Observation = i.Observation
                    })
                    .ToList(),
                Images = x.Images
                    .OrderBy(i => i.Position)
                    .ThenBy(i => i.UploadedAt)
                    .Select(i => new EquipmentInspectionExecutionImageDTO
                    {
                        Id = i.Id,
                        ImagePath = i.ImagePath,
                        Caption = i.Caption,
                        Position = i.Position,
                        UploadedAt = i.UploadedAt,
                        UploadedByUserId = i.UploadedByUserId,
                        UploadedByUserName = i.UploadedByUser != null ? i.UploadedByUser.FullName : null
                    })
                    .ToList(),
                ServiceOrderIds = x.ServiceOrders.Select(s => s.Id).ToList()
            })
            .FirstOrDefaultAsync();

        if (data == null)
            return ApiResponseDTO<EquipmentInspectionExecutionDetailDTO>.ErrorResult("La ejecucion de inspeccion no existe.", 404);

        var accessError = ValidateCustomerAccess(data.CustomerId);
        if (!string.IsNullOrWhiteSpace(accessError))
            return ApiResponseDTO<EquipmentInspectionExecutionDetailDTO>.ErrorResult(accessError, 403);

        return ApiResponseDTO<EquipmentInspectionExecutionDetailDTO>.SuccessResult(data);
    }

    /// <summary>Inicia desde.</summary>
    public async Task<ApiResponseDTO<EquipmentInspectionExecutionDetailDTO>> StartFromQrAsync(EquipmentInspectionExecutionStartFromQrDTO dto)
    {
        if (string.IsNullOrWhiteSpace(currentUserService.UserId))
            return ApiResponseDTO<EquipmentInspectionExecutionDetailDTO>.ErrorResult("No fue posible identificar al usuario autenticado.", 403);

        if (dto.CustomerId == Guid.Empty)
            return ApiResponseDTO<EquipmentInspectionExecutionDetailDTO>.ErrorResult("El customerId es requerido.");

        if (string.IsNullOrWhiteSpace(dto.Code))
            return ApiResponseDTO<EquipmentInspectionExecutionDetailDTO>.ErrorResult("El codigo QR es requerido.");

        var accessError = ValidateCustomerAccess(dto.CustomerId);
        if (!string.IsNullOrWhiteSpace(accessError))
            return ApiResponseDTO<EquipmentInspectionExecutionDetailDTO>.ErrorResult(accessError, 403);

        var qrLabel = await dbContext.EquipmentQrLabels
            .Include(x => x.Machinery)
            .FirstOrDefaultAsync(x => x.CustomerId == dto.CustomerId && x.Code == dto.Code.Trim());

        if (qrLabel == null)
            return ApiResponseDTO<EquipmentInspectionExecutionDetailDTO>.ErrorResult("La etiqueta QR no existe.", 404);

        if (!qrLabel.IsActive)
            return ApiResponseDTO<EquipmentInspectionExecutionDetailDTO>.ErrorResult("La etiqueta QR esta inactiva.");

        var definition = await ResolveDefinitionForStartAsync(qrLabel.MachineryId, qrLabel.CustomerId, dto.DefinitionId);
        if (definition == null)
            return ApiResponseDTO<EquipmentInspectionExecutionDetailDTO>.ErrorResult("No existe una definicion activa disponible para este equipo.");

        var execution = await EnsureExecutionForTodayAsync(definition, qrLabel.Id, true);
        return await GetByIdAsync(execution.Id);
    }

    /// <summary>Inicia .</summary>
    public async Task<ApiResponseDTO<EquipmentInspectionExecutionDetailDTO>> StartManualAsync(Guid definitionId)
    {
        if (string.IsNullOrWhiteSpace(currentUserService.UserId))
            return ApiResponseDTO<EquipmentInspectionExecutionDetailDTO>.ErrorResult("No fue posible identificar al usuario autenticado.", 403);

        var definition = await dbContext.EquipmentInspectionDefinitions
            .Include(x => x.Assignees)
            .Include(x => x.Criteria)
            .Include(x => x.WeekDays)
            .FirstOrDefaultAsync(x => x.Id == definitionId);

        if (definition == null)
            return ApiResponseDTO<EquipmentInspectionExecutionDetailDTO>.ErrorResult("La definicion de inspeccion no existe.", 404);

        var accessError = ValidateCustomerAccess(definition.CustomerId);
        if (!string.IsNullOrWhiteSpace(accessError))
            return ApiResponseDTO<EquipmentInspectionExecutionDetailDTO>.ErrorResult(accessError, 403);

        if (!definition.IsActive)
            return ApiResponseDTO<EquipmentInspectionExecutionDetailDTO>.ErrorResult("La definicion de inspeccion esta inactiva.");

        var execution = await EnsureExecutionForTodayAsync(definition, null, true);
        return await GetByIdAsync(execution.Id);
    }

    /// <summary>Ejecuta la operación de .</summary>
    public async Task<ApiResponseDTO<EquipmentInspectionExecutionDetailDTO>> CompleteAsync(Guid id, EquipmentInspectionExecutionCompleteDTO dto)
    {
        var userId = currentUserService.UserId;
        if (string.IsNullOrWhiteSpace(userId))
            return ApiResponseDTO<EquipmentInspectionExecutionDetailDTO>.ErrorResult("No fue posible identificar al usuario autenticado.", 403);

        var execution = await dbContext.EquipmentInspectionExecutions
            .Include(x => x.EquipmentInspectionDefinition).ThenInclude(x => x.Criteria)
            .Include(x => x.Machinery)
            .Include(x => x.Items)
            .Include(x => x.Images)
            .Include(x => x.ServiceOrders)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (execution == null)
            return ApiResponseDTO<EquipmentInspectionExecutionDetailDTO>.ErrorResult("La ejecucion de inspeccion no existe.", 404);

        var accessError = ValidateCustomerAccess(execution.CustomerId);
        if (!string.IsNullOrWhiteSpace(accessError))
            return ApiResponseDTO<EquipmentInspectionExecutionDetailDTO>.ErrorResult(accessError, 403);

        if (execution.IsClosed)
            return ApiResponseDTO<EquipmentInspectionExecutionDetailDTO>.ErrorResult("La inspeccion ya fue cerrada.");

        var validationError = ValidateCompletionPayload(execution, dto.Items);
        if (!string.IsNullOrWhiteSpace(validationError))
            return ApiResponseDTO<EquipmentInspectionExecutionDetailDTO>.ErrorResult(validationError);

        ApplyExecutionItems(execution, dto.Items);
        ReplaceExecutionImages(execution, dto.Images, userId);

        execution.Observations = string.IsNullOrWhiteSpace(dto.Observations) ? null : dto.Observations.Trim();
        execution.Severity = dto.Severity;
        execution.ExecutedByUserId = userId;
        execution.StartedAt ??= DateTime.UtcNow;
        execution.CompletedAt = DateTime.UtcNow;
        execution.Status = Status.Concluido;
        execution.IsClosed = true;

        var shouldNotifyUrgency = dto.Severity == InspectionStatus.Urgente;
        if (shouldNotifyUrgency && execution.ServiceOrders.Count == 0)
            dbContext.ServiceOrders.Add(CreateServiceOrderFromExecution(execution));

        await dbContext.SaveChangesAsync();

        if (shouldNotifyUrgency)
            await NotifyUrgentExecutionAsync(execution);

        return await GetByIdAsync(id);
    }

    /// <summary>Ejecuta la operación de actualizar.</summary>
    public async Task<ApiResponseDTO<EquipmentInspectionExecutionDetailDTO>> AdministrativeUpdateAsync(Guid id, EquipmentInspectionExecutionAdministrativeUpdateDTO dto)
    {
        var userId = currentUserService.UserId;
        if (string.IsNullOrWhiteSpace(userId))
            return ApiResponseDTO<EquipmentInspectionExecutionDetailDTO>.ErrorResult("No fue posible identificar al usuario autenticado.", 403);

        var execution = await dbContext.EquipmentInspectionExecutions
            .Include(x => x.EquipmentInspectionDefinition).ThenInclude(x => x.Criteria)
            .Include(x => x.Machinery)
            .Include(x => x.Items)
            .Include(x => x.Images)
            .Include(x => x.ServiceOrders)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (execution == null)
            return ApiResponseDTO<EquipmentInspectionExecutionDetailDTO>.ErrorResult("La ejecucion de inspeccion no existe.", 404);

        var accessError = ValidateCustomerAccess(execution.CustomerId);
        if (!string.IsNullOrWhiteSpace(accessError))
            return ApiResponseDTO<EquipmentInspectionExecutionDetailDTO>.ErrorResult(accessError, 403);

        if (!AdministrativeRoles.Contains(currentUserService.UserRole))
            return ApiResponseDTO<EquipmentInspectionExecutionDetailDTO>.ErrorResult("No tienes permisos para modificar administrativamente esta inspeccion.", 403);

        if (!execution.IsClosed)
            return ApiResponseDTO<EquipmentInspectionExecutionDetailDTO>.ErrorResult("La modificacion administrativa solo aplica a inspecciones cerradas.");

        if (string.IsNullOrWhiteSpace(dto.Reason))
            return ApiResponseDTO<EquipmentInspectionExecutionDetailDTO>.ErrorResult("El motivo de la modificacion administrativa es requerido.");

        var validationError = ValidateCompletionPayload(execution, dto.Items);
        if (!string.IsNullOrWhiteSpace(validationError))
            return ApiResponseDTO<EquipmentInspectionExecutionDetailDTO>.ErrorResult(validationError);

        var previousSeverity = execution.Severity;

        ApplyExecutionItems(execution, dto.Items);
        ReplaceExecutionImages(execution, dto.Images, userId);

        execution.Severity = dto.Severity;
        execution.Observations = string.IsNullOrWhiteSpace(dto.Observations) ? null : dto.Observations.Trim();
        execution.LastModifiedAt = DateTime.UtcNow;
        execution.LastModifiedByUserId = userId;
        execution.AdministrativeModificationReason = dto.Reason.Trim();
        execution.AdministrativeModificationCount += 1;

        var shouldNotifyUrgency = dto.Severity == InspectionStatus.Urgente && previousSeverity != InspectionStatus.Urgente;
        if (shouldNotifyUrgency && execution.ServiceOrders.Count == 0)
            dbContext.ServiceOrders.Add(CreateServiceOrderFromExecution(execution));

        await dbContext.SaveChangesAsync();

        if (shouldNotifyUrgency)
            await NotifyUrgentExecutionAsync(execution);

        return await GetByIdAsync(id);
    }

    private async Task GeneratePendingExecutionsAsync(Guid customerId, DateOnly executionDate)
    {
        var definitions = await dbContext.EquipmentInspectionDefinitions
            .Include(x => x.Assignees)
            .Include(x => x.Criteria)
            .Include(x => x.WeekDays)
            .Where(x => x.CustomerId == customerId && x.IsActive)
            .ToListAsync();

        var createdExecutions = new List<EquipmentInspectionExecution>();

        foreach (var definition in definitions)
        {
            if (!ShouldGenerateForDate(definition, executionDate))
                continue;

            var exists = await dbContext.EquipmentInspectionExecutions
                .AnyAsync(x => x.EquipmentInspectionDefinitionId == definition.Id && x.ExecutionDate == executionDate);

            if (exists)
                continue;

            createdExecutions.Add(BuildExecution(definition, executionDate, null));
            definition.LastGeneratedAt = DateTime.UtcNow;
        }

        if (createdExecutions.Count == 0)
            return;

        dbContext.EquipmentInspectionExecutions.AddRange(createdExecutions);
        await dbContext.SaveChangesAsync();
    }

    private async Task<EquipmentInspectionExecution> EnsureExecutionForTodayAsync(
        EquipmentInspectionDefinition definition,
        Guid? qrLabelId,
        bool markAsStarted)
    {
        var today = DateOnly.FromDateTime(DateTimeExtension.GetMexicoDateOnly());

        var existing = await dbContext.EquipmentInspectionExecutions
            .FirstOrDefaultAsync(x => x.EquipmentInspectionDefinitionId == definition.Id && x.ExecutionDate == today);

        if (existing == null)
        {
            existing = BuildExecution(definition, today, qrLabelId);
            dbContext.EquipmentInspectionExecutions.Add(existing);
        }
        else if (qrLabelId.HasValue && !existing.GeneratedFromQrLabelId.HasValue)
        {
            existing.GeneratedFromQrLabelId = qrLabelId;
        }

        if (markAsStarted && existing.Status == Status.Pendiente)
        {
            existing.Status = Status.Proceso;
            existing.StartedAt ??= DateTime.UtcNow;
        }

        definition.LastGeneratedAt = DateTime.UtcNow;
        await dbContext.SaveChangesAsync();
        return existing;
    }

    private EquipmentInspectionExecution BuildExecution(EquipmentInspectionDefinition definition, DateOnly executionDate, Guid? qrLabelId)
    {
        var primaryAssigneeId = definition.Assignees.FirstOrDefault(x => x.IsPrimary)?.ApplicationUserId
            ?? definition.Assignees.Select(x => x.ApplicationUserId).FirstOrDefault();

        var execution = new EquipmentInspectionExecution
        {
            CustomerId = definition.CustomerId,
            MachineryId = definition.MachineryId,
            EquipmentInspectionDefinitionId = definition.Id,
            AssignedToUserId = primaryAssigneeId,
            Status = Status.Pendiente,
            ExecutionDate = executionDate,
            GeneratedFromQrLabelId = qrLabelId,
            IsClosed = false
        };

        foreach (var criterion in definition.Criteria.Where(x => x.IsActive).OrderBy(x => x.Position))
        {
            execution.Items.Add(new EquipmentInspectionExecutionItem
            {
                EquipmentInspectionCriterionId = criterion.Id,
                IsCompliant = false,
                Observation = null,
                Position = criterion.Position
            });
        }

        return execution;
    }

    private async Task<EquipmentInspectionDefinition> ResolveDefinitionForStartAsync(Guid machineryId, Guid customerId, Guid? definitionId)
    {
        if (definitionId.HasValue)
        {
            return await dbContext.EquipmentInspectionDefinitions
                .Include(x => x.Assignees)
                .Include(x => x.Criteria)
                .Include(x => x.WeekDays)
                .FirstOrDefaultAsync(x => x.Id == definitionId.Value && x.MachineryId == machineryId && x.CustomerId == customerId && x.IsActive);
        }

        var definitions = await dbContext.EquipmentInspectionDefinitions
            .Include(x => x.Assignees)
            .Include(x => x.Criteria)
            .Include(x => x.WeekDays)
            .Where(x => x.MachineryId == machineryId && x.CustomerId == customerId && x.IsActive)
            .OrderBy(x => x.Name)
            .ToListAsync();

        if (definitions.Count == 1)
            return definitions[0];

        return definitions.FirstOrDefault(x => ShouldGenerateForDate(x, DateOnly.FromDateTime(DateTimeExtension.GetMexicoDateOnly())));
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

    private static string ValidateCompletionPayload(EquipmentInspectionExecution execution, List<EquipmentInspectionExecutionItemInputDTO> items)
    {
        if (items.Count == 0)
            return "Debe capturar al menos un criterio para completar la inspeccion.";

        var activeCriteria = execution.EquipmentInspectionDefinition.Criteria
            .Where(x => x.IsActive)
            .OrderBy(x => x.Position)
            .ToList();

        if (items.GroupBy(x => x.EquipmentInspectionCriterionId).Any(x => x.Count() > 1))
            return "No se puede enviar mas de una respuesta para el mismo criterio.";

        var sentCriteriaIds = items.Select(x => x.EquipmentInspectionCriterionId).ToHashSet();

        var missingRequired = activeCriteria
            .Where(x => x.IsRequired && !sentCriteriaIds.Contains(x.Id))
            .Select(x => x.Title)
            .ToList();

        if (missingRequired.Count > 0)
            return $"Faltan respuestas en criterios requeridos: {string.Join(", ", missingRequired)}.";

        if (items.Any(x => !activeCriteria.Any(c => c.Id == x.EquipmentInspectionCriterionId)))
            return "Se enviaron criterios que no pertenecen a la definicion activa de la inspeccion.";

        return string.Empty;
    }

    private static void ApplyExecutionItems(EquipmentInspectionExecution execution, List<EquipmentInspectionExecutionItemInputDTO> items)
    {
        foreach (var input in items)
        {
            var existingItem = execution.Items.FirstOrDefault(x => x.EquipmentInspectionCriterionId == input.EquipmentInspectionCriterionId);
            if (existingItem == null)
                continue;

            existingItem.IsCompliant = input.IsCompliant;
            existingItem.Observation = string.IsNullOrWhiteSpace(input.Observation) ? null : input.Observation.Trim();
        }
    }

    private void ReplaceExecutionImages(EquipmentInspectionExecution execution, List<EquipmentInspectionExecutionImageInputDTO> images, string userId)
    {
        dbContext.EquipmentInspectionExecutionImages.RemoveRange(execution.Images);
        execution.Images.Clear();

        foreach (var image in images
                     .Where(x => !string.IsNullOrWhiteSpace(x.ImagePath))
                     .OrderBy(x => x.Position)
                     .ThenBy(x => x.ImagePath))
        {
            execution.Images.Add(new EquipmentInspectionExecutionImage
            {
                ImagePath = image.ImagePath.Trim(),
                Caption = string.IsNullOrWhiteSpace(image.Caption) ? null : image.Caption.Trim(),
                Position = image.Position,
                UploadedAt = DateTime.UtcNow,
                UploadedByUserId = userId
            });
        }
    }

    private ServiceOrder CreateServiceOrderFromExecution(EquipmentInspectionExecution execution)
    {
        return new ServiceOrder
        {
            MachineryId = execution.MachineryId,
            EquipmentInspectionExecutionId = execution.Id,
            WasAutoGeneratedFromInspection = true,
            Activity = $"Atender hallazgo urgente de inspeccion: {execution.EquipmentInspectionDefinition.Name}",
            Observations = execution.Observations,
            RequestDate = execution.ExecutionDate,
            TypeMaintance = TypeMaintance.Correctivo,
            Status = Status.Pendiente,
            Price = 0m,
            CumplimientoActividades = false,
            EquiposOperando = false,
            OcacionoDanos = false,
            CalidadTrabajos = false
        };
    }

    private async Task NotifyUrgentExecutionAsync(EquipmentInspectionExecution execution)
    {
        try
        {
            var recipients = await ResolveUrgentRecipientsAsync(execution.CustomerId);
            if (recipients.Count == 0)
                return;

            var title = "Inspeccion urgente de equipo";
            var message = $"Se detecto un hallazgo urgente en el equipo {execution.Machinery.NameMachinery} durante la inspeccion {execution.EquipmentInspectionDefinition.Name}.";

            foreach (var recipient in recipients)
            {
                if (string.IsNullOrWhiteSpace(recipient.Id))
                    continue;

                try
                {
                    await notificationDispatcher.DispatchAsync(new NotificationRequestDTO
                    {
                        ApplicationUserId = recipient.Id,
                        Title = title,
                        Body = message,
                        Category = NotificationCategory.Urgente,
                        Channels = [NotificationChannel.InApp, NotificationChannel.Push, NotificationChannel.PushWeb]
                    });
                }
                catch (Exception ex)
                {
                    logger.LogError(
                        ex,
                        "Error enviando notificacion interna de inspeccion urgente al usuario {UserId} en ejecucion {ExecutionId}.",
                        recipient.Id,
                        execution.Id);
                }
            }

            var recipientEmails = recipients
                .Select(x => x.Email)
                .Where(x => !string.IsNullOrWhiteSpace(x))
                .Distinct()
                .ToList();

            if (recipientEmails.Count == 0)
                return;

            var body = BuildUrgentEmailBody(execution);
            var sendEmailDTO = new SendEmailDTO(configuration)
            {
                Subject = $"URGENTE | {execution.Machinery.NameMachinery} | {execution.EquipmentInspectionDefinition.Name}",
                Body = body,
                To = recipientEmails,
                ToCC = [],
                ToBcc = []
            };

            await sendEmailService.OnSendEmailAsync(sendEmailDTO);
        }
        catch (Exception ex)
        {
            logger.LogError(
                ex,
                "Error general notificando la urgencia de la ejecucion de inspeccion {ExecutionId}.",
                execution.Id);
        }
    }

    private async Task<List<ApplicationUserGetInfoDTO>> ResolveUrgentRecipientsAsync(Guid customerId)
    {
        var recipients = new List<ApplicationUserGetInfoDTO>();
        recipients.AddRange(await responsablesClienteAppService.OnGetAdministradorAsync(customerId));
        recipients.AddRange(await responsablesClienteAppService.OnGetJefeMantenimientoAsync(customerId));

        return recipients
            .Where(x => !string.IsNullOrWhiteSpace(x.Id))
            .GroupBy(x => x.Id)
            .Select(x => x.First())
            .ToList();
    }

    private static string BuildUrgentEmailBody(EquipmentInspectionExecution execution)
    {
        var observations = string.IsNullOrWhiteSpace(execution.Observations)
            ? "Sin observaciones capturadas."
            : execution.Observations;

        return $"""
<html>
<body style="font-family: Arial, sans-serif; color: #333;">
    <h2 style="color: #b42318;">Hallazgo urgente en inspeccion de equipo</h2>
    <p>Se detecto una inspeccion urgente que requiere atencion inmediata.</p>
    <table style="border-collapse: collapse; width: 100%; max-width: 720px;">
        <tr>
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Equipo</td>
            <td style="border: 1px solid #ddd; padding: 8px;">{execution.Machinery.NameMachinery}</td>
        </tr>
        <tr>
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Ubicacion</td>
            <td style="border: 1px solid #ddd; padding: 8px;">{execution.Machinery.Ubication}</td>
        </tr>
        <tr>
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Inspeccion</td>
            <td style="border: 1px solid #ddd; padding: 8px;">{execution.EquipmentInspectionDefinition.Name}</td>
        </tr>
        <tr>
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Fecha</td>
            <td style="border: 1px solid #ddd; padding: 8px;">{execution.ExecutionDate:dd/MM/yyyy}</td>
        </tr>
        <tr>
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Observaciones</td>
            <td style="border: 1px solid #ddd; padding: 8px;">{observations}</td>
        </tr>
    </table>
    <p style="margin-top: 16px;">La orden de servicio correctiva fue registrada automaticamente si aun no existia una vinculada.</p>
</body>
</html>
""";
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
            return "No tienes permisos para operar inspecciones de otro customer.";

        return string.Empty;
    }
}
