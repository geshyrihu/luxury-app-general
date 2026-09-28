namespace MantenimientoLuxuryApp.FireInspectionPeriods.Services;
/// <summary>Servicio o componente relacionado con aplicación servicio.</summary>
public class FireInspectionPeriodAppService(ApplicationDbContext dbContext) : IFireInspectionPeriodAppService
{
    /// <summary>Obtiene todas.</summary>
    public async Task<ApiResponseDTO<FireInspectionPeriodDTO[]>> GetAllAsync(Guid customerId)
    {
        var data = await dbContext.FireInspectionPeriods
            .AsNoTracking()
            .Where(x => x.CustomerId == customerId)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new FireInspectionPeriodDTO
            {
                Id = x.Id,
                CustomerId = x.CustomerId,
                Name = x.Name,
                Description = x.Description,
                StartDate = x.StartDate,
                Frecuencia = x.Frecuencia,
                IsActive = x.IsActive,
                TotalItems =
                    dbContext.FireInspectionPeriodExtinguishers.Count(e => e.FireInspectionPeriodId == x.Id) +
                    dbContext.FireInspectionPeriodHydrants.Count(e => e.FireInspectionPeriodId == x.Id) +
                    dbContext.FireInspectionPeriodStations.Count(e => e.FireInspectionPeriodId == x.Id) +
                    dbContext.FireInspectionPeriodDetectors.Count(e => e.FireInspectionPeriodId == x.Id),
            })
            .ToArrayAsync();
        return ApiResponseDTO<FireInspectionPeriodDTO[]>.SuccessResult(data);
    }

    /// <summary>Obtiene por identificador.</summary>
    public async Task<ApiResponseDTO<FireInspectionPeriodAddOrEditDTO>> GetByIdAsync(Guid id)
    {
        var model = await dbContext.FireInspectionPeriods.FindAsync(id);
        if (model == null) return ApiResponseDTO<FireInspectionPeriodAddOrEditDTO>.ErrorResult("Periodo no encontrado", 404);
        return ApiResponseDTO<FireInspectionPeriodAddOrEditDTO>.SuccessResult(new FireInspectionPeriodAddOrEditDTO
        {
            CustomerId = model.CustomerId,
            Name = model.Name,
            Description = model.Description,
            StartDate = model.StartDate,
            Frecuencia = model.Frecuencia,
            IsActive = model.IsActive,
            ApplicationUserId = model.ApplicationUserId,
        });
    }

    /// <summary>Agrega .</summary>
    public async Task<ApiResponseDTO<FireInspectionPeriod>> AddAsync(FireInspectionPeriodAddOrEditDTO dto)
    {
        var model = new FireInspectionPeriod
        {
            CustomerId = dto.CustomerId,
            Name = dto.Name,
            Description = dto.Description,
            StartDate = dto.StartDate,
            Frecuencia = dto.Frecuencia,
            IsActive = dto.IsActive,
            ApplicationUserId = dto.ApplicationUserId,
            CreatedAt = DateTime.UtcNow,
        };
        dbContext.FireInspectionPeriods.Add(model);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<FireInspectionPeriod>.SuccessResult(model);
    }

    /// <summary>Actualiza .</summary>
    public async Task<ApiResponseDTO<bool>> UpdateAsync(Guid id, FireInspectionPeriodAddOrEditDTO dto)
    {
        var model = await dbContext.FireInspectionPeriods.FindAsync(id);
        if (model == null) return ApiResponseDTO<bool>.ErrorResult("Periodo no encontrado", 404);
        model.Name = dto.Name;
        model.Description = dto.Description;
        model.StartDate = dto.StartDate;
        model.Frecuencia = dto.Frecuencia;
        model.IsActive = dto.IsActive;
        model.ApplicationUserId = dto.ApplicationUserId;
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<bool>.SuccessResult(true);
    }

    /// <summary>Elimina por identificador.</summary>
    public async Task<ApiResponseDTO<bool>> DeleteByIdAsync(Guid id)
    {
        var model = await dbContext.FireInspectionPeriods.FindAsync(id);
        if (model == null) return ApiResponseDTO<bool>.ErrorResult("Periodo no encontrado", 404);
        dbContext.FireInspectionPeriods.Remove(model);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<bool>.SuccessResult(true);
    }
}
