namespace MantenimientoLuxuryApp.EquipmentInspections.Services;
/// <summary>Servicio o componente relacionado con aplicación servicio.</summary>
public class EquipmentInspectionDefinitionAppService(ApplicationDbContext dbContext) : IEquipmentInspectionDefinitionAppService
{
    /// <summary>Obtiene por.</summary>
    public async Task<ApiResponseDTO<List<EquipmentInspectionDefinitionListDTO>>> GetByMachineryAsync(Guid machineryId)
    {
        var data = await dbContext.EquipmentInspectionDefinitions
            .AsNoTracking()
            .Where(x => x.MachineryId == machineryId)
            .OrderBy(x => x.Name)
            .Select(x => new EquipmentInspectionDefinitionListDTO
            {
                Id = x.Id,
                MachineryId = x.MachineryId,
                MachineryName = x.Machinery.NameMachinery,
                Name = x.Name,
                IsActive = x.IsActive,
                RecurrenceUnit = x.RecurrenceUnit,
                RecurrenceInterval = x.RecurrenceInterval,
                DayOfMonth = x.DayOfMonth,
                CriteriaCount = x.Criteria.Count,
                AssigneesCount = x.Assignees.Count
            })
            .ToListAsync();

        return ApiResponseDTO<List<EquipmentInspectionDefinitionListDTO>>.SuccessResult(data);
    }

    /// <summary>Obtiene por identificador.</summary>
    public async Task<ApiResponseDTO<EquipmentInspectionDefinitionDTO>> GetByIdAsync(Guid id)
    {
        var data = await dbContext.EquipmentInspectionDefinitions
            .AsNoTracking()
            .Where(x => x.Id == id)
            .Select(x => new EquipmentInspectionDefinitionDTO
            {
                Id = x.Id,
                CustomerId = x.CustomerId,
                MachineryId = x.MachineryId,
                MachineryName = x.Machinery.NameMachinery,
                Name = x.Name,
                Description = x.Description,
                IsActive = x.IsActive,
                RecurrenceUnit = x.RecurrenceUnit,
                RecurrenceInterval = x.RecurrenceInterval,
                DayOfMonth = x.DayOfMonth,
                EstimatedDurationMinutes = x.EstimatedDurationMinutes,
                CreatedAt = x.CreatedAt,
                CreatedByUserId = x.CreatedByUserId,
                CreatedByUserName = x.CreatedByUser.FullName,
                Assignees = x.Assignees
                    .OrderByDescending(a => a.IsPrimary)
                    .ThenBy(a => a.ApplicationUser.FullName)
                    .Select(a => new EquipmentInspectionDefinitionAssigneeDTO
                    {
                        ApplicationUserId = a.ApplicationUserId,
                        FullName = a.ApplicationUser.FullName,
                        IsPrimary = a.IsPrimary
                    })
                    .ToList(),
                WeekDays = x.WeekDays
                    .OrderBy(w => w.WeekDay)
                    .Select(w => w.WeekDay)
                    .ToList(),
                Criteria = x.Criteria
                    .OrderBy(c => c.Position)
                    .Select(c => new EquipmentInspectionCriterionDTO
                    {
                        Id = c.Id,
                        Title = c.Title,
                        Description = c.Description,
                        Position = c.Position,
                        IsRequired = c.IsRequired,
                        IsActive = c.IsActive
                    })
                    .ToList()
            })
            .FirstOrDefaultAsync();

        if (data == null)
            return ApiResponseDTO<EquipmentInspectionDefinitionDTO>.ErrorResult("La definicion de inspeccion no existe.");

        return ApiResponseDTO<EquipmentInspectionDefinitionDTO>.SuccessResult(data);
    }

    /// <summary>Agrega .</summary>
    public async Task<ApiResponseDTO<EquipmentInspectionDefinitionDTO>> AddAsync(EquipmentInspectionDefinitionAddOrEditDTO dto)
    {
        var validationError = ValidateDefinition(dto);
        if (!string.IsNullOrWhiteSpace(validationError))
            return ApiResponseDTO<EquipmentInspectionDefinitionDTO>.ErrorResult(validationError);

        var machineryExists = await dbContext.Equipment.AnyAsync(x => x.Id == dto.MachineryId && x.CustomerId == dto.CustomerId);
        if (!machineryExists)
            return ApiResponseDTO<EquipmentInspectionDefinitionDTO>.ErrorResult("La maquinaria indicada no existe o no pertenece al cliente.");

        var entity = new EquipmentInspectionDefinition
        {
            CustomerId = dto.CustomerId,
            MachineryId = dto.MachineryId,
            Name = dto.Name.Trim(),
            Description = string.IsNullOrWhiteSpace(dto.Description) ? null : dto.Description.Trim(),
            IsActive = dto.IsActive,
            RecurrenceUnit = dto.RecurrenceUnit,
            RecurrenceInterval = dto.RecurrenceInterval,
            DayOfMonth = dto.DayOfMonth,
            EstimatedDurationMinutes = dto.EstimatedDurationMinutes,
            CreatedAt = DateTime.UtcNow,
            CreatedByUserId = dto.CreatedByUserId
        };

        AddChildCollections(entity, dto);

        dbContext.EquipmentInspectionDefinitions.Add(entity);
        await dbContext.SaveChangesAsync();

        return await GetByIdAsync(entity.Id);
    }

    /// <summary>Actualiza .</summary>
    public async Task<ApiResponseDTO<EquipmentInspectionDefinitionDTO>> UpdateAsync(Guid id, EquipmentInspectionDefinitionAddOrEditDTO dto)
    {
        var validationError = ValidateDefinition(dto);
        if (!string.IsNullOrWhiteSpace(validationError))
            return ApiResponseDTO<EquipmentInspectionDefinitionDTO>.ErrorResult(validationError);

        var entity = await dbContext.EquipmentInspectionDefinitions
            .Include(x => x.Assignees)
            .Include(x => x.WeekDays)
            .Include(x => x.Criteria)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (entity == null)
            return ApiResponseDTO<EquipmentInspectionDefinitionDTO>.ErrorResult("La definicion de inspeccion no existe.");

        entity.MachineryId = dto.MachineryId;
        entity.Name = dto.Name.Trim();
        entity.Description = string.IsNullOrWhiteSpace(dto.Description) ? null : dto.Description.Trim();
        entity.IsActive = dto.IsActive;
        entity.RecurrenceUnit = dto.RecurrenceUnit;
        entity.RecurrenceInterval = dto.RecurrenceInterval;
        entity.DayOfMonth = dto.DayOfMonth;
        entity.EstimatedDurationMinutes = dto.EstimatedDurationMinutes;

        dbContext.EquipmentInspectionDefinitionAssignees.RemoveRange(entity.Assignees);
        dbContext.EquipmentInspectionDefinitionWeekDays.RemoveRange(entity.WeekDays);
        dbContext.EquipmentInspectionCriteria.RemoveRange(entity.Criteria);

        entity.Assignees.Clear();
        entity.WeekDays.Clear();
        entity.Criteria.Clear();

        AddChildCollections(entity, dto);

        await dbContext.SaveChangesAsync();
        return await GetByIdAsync(entity.Id);
    }

    /// <summary>Ejecuta la operación de activo.</summary>
    public async Task<ApiResponseDTO<bool>> ToggleActiveAsync(Guid id, bool isActive)
    {
        var entity = await dbContext.EquipmentInspectionDefinitions.FirstOrDefaultAsync(x => x.Id == id);
        if (entity == null)
            return ApiResponseDTO<bool>.ErrorResult("La definicion de inspeccion no existe.");

        entity.IsActive = isActive;
        await dbContext.SaveChangesAsync();

        return ApiResponseDTO<bool>.SuccessResult(true, isActive ? "Definicion activada correctamente." : "Definicion desactivada correctamente.");
    }

    /// <summary>Elimina por identificador.</summary>
    public async Task<ApiResponseDTO<bool>> DeleteByIdAsync(Guid id)
    {
        var entity = await dbContext.EquipmentInspectionDefinitions
            .Include(x => x.Assignees)
            .Include(x => x.WeekDays)
            .Include(x => x.Criteria)
            .Include(x => x.Executions)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (entity == null)
            return ApiResponseDTO<bool>.ErrorResult("La definicion de inspeccion no existe.");

        if (entity.Executions.Count > 0)
            return ApiResponseDTO<bool>.ErrorResult("No se puede eliminar una definicion que ya tiene ejecuciones historicas.");

        dbContext.EquipmentInspectionDefinitionAssignees.RemoveRange(entity.Assignees);
        dbContext.EquipmentInspectionDefinitionWeekDays.RemoveRange(entity.WeekDays);
        dbContext.EquipmentInspectionCriteria.RemoveRange(entity.Criteria);
        dbContext.EquipmentInspectionDefinitions.Remove(entity);

        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<bool>.SuccessResult(true, "Definicion eliminada correctamente.");
    }

    private static string ValidateDefinition(EquipmentInspectionDefinitionAddOrEditDTO dto)
    {
        if (dto.CustomerId == Guid.Empty)
            return "El customerId es requerido.";

        if (dto.MachineryId == Guid.Empty)
            return "La maquinaria es requerida.";

        if (string.IsNullOrWhiteSpace(dto.Name))
            return "El nombre de la definicion es requerido.";

        if (string.IsNullOrWhiteSpace(dto.CreatedByUserId))
            return "El usuario creador es requerido.";

        if (dto.RecurrenceInterval <= 0)
            return "El intervalo de recurrencia debe ser mayor que cero.";

        if (dto.Criteria.Count == 0)
            return "Debe capturar al menos un criterio de inspeccion.";

        if (dto.Assignees.Count == 0)
            return "Debe asignar al menos un responsable.";

        if (dto.Assignees.Count(x => x.IsPrimary) > 1)
            return "Solo puede existir un responsable principal por definicion.";

        if (dto.Assignees.Any(x => string.IsNullOrWhiteSpace(x.ApplicationUserId)))
            return "Todos los responsables deben tener usuario asignado.";

        if (dto.Criteria.Any(x => string.IsNullOrWhiteSpace(x.Title)))
            return "Todos los criterios deben tener titulo.";

        if (dto.Criteria.GroupBy(x => x.Position).Any(x => x.Count() > 1))
            return "Las posiciones de los criterios no se pueden repetir.";

        if (dto.RecurrenceUnit == RecurrenceUnit.Week && dto.WeekDays.Count == 0)
            return "Debe seleccionar al menos un dia de la semana para una recurrencia semanal.";

        if (dto.RecurrenceUnit == RecurrenceUnit.Month && (!dto.DayOfMonth.HasValue || dto.DayOfMonth < 1 || dto.DayOfMonth > 31))
            return "Debe indicar un dia del mes valido para la recurrencia mensual.";

        if (dto.RecurrenceUnit != RecurrenceUnit.Week && dto.WeekDays.Count > 0)
            return "Los dias de la semana solo aplican a recurrencias semanales.";

        if (dto.RecurrenceUnit != RecurrenceUnit.Month && dto.DayOfMonth.HasValue)
            return "El dia del mes solo aplica a recurrencias mensuales.";

        return string.Empty;
    }

    private static void AddChildCollections(EquipmentInspectionDefinition entity, EquipmentInspectionDefinitionAddOrEditDTO dto)
    {
        foreach (var assignee in dto.Assignees.DistinctBy(x => x.ApplicationUserId))
        {
            entity.Assignees.Add(new EquipmentInspectionDefinitionAssignee
            {
                ApplicationUserId = assignee.ApplicationUserId,
                IsPrimary = assignee.IsPrimary,
                CreatedAt = DateTime.UtcNow
            });
        }

        foreach (var weekDay in dto.WeekDays.Distinct().OrderBy(x => x))
        {
            entity.WeekDays.Add(new EquipmentInspectionDefinitionWeekDay
            {
                WeekDay = weekDay
            });
        }

        foreach (var criterion in dto.Criteria.OrderBy(x => x.Position))
        {
            entity.Criteria.Add(new EquipmentInspectionCriterion
            {
                Title = criterion.Title.Trim(),
                Description = string.IsNullOrWhiteSpace(criterion.Description) ? null : criterion.Description.Trim(),
                Position = criterion.Position,
                IsRequired = criterion.IsRequired,
                IsActive = criterion.IsActive,
                CreatedAt = DateTime.UtcNow
            });
        }
    }
}
