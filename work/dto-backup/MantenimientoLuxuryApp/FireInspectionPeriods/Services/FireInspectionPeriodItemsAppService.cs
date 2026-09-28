namespace MantenimientoLuxuryApp.FireInspectionPeriods.Services;
/// <summary>Servicio o componente relacionado con elementos aplicación servicio.</summary>
public class FireInspectionPeriodItemsAppService(ApplicationDbContext dbContext) : IFireInspectionPeriodItemsAppService
{
    /// <summary>Obtiene .</summary>
    public async Task<ApiResponseDTO<object[]>> GetExtintoresAsync(Guid periodId)
    {
        var data = await dbContext.FireInspectionPeriodExtinguishers
            .AsNoTracking()
            .Where(x => x.FireInspectionPeriodId == periodId)
            .Join(dbContext.FireExtinguishers, i => i.ExtinguisherId, e => e.Id, (i, e) => new
            {
                i.Id,
                i.ExtinguisherId,
                e.Location,
                e.LocalCode,
                TypeDescription = e.ExtinguisherType.GetDisplayName(),
            })
            .Cast<object>()
            .ToArrayAsync();
        return ApiResponseDTO<object[]>.SuccessResult(data);
    }

    /// <summary>Agrega .</summary>
    public async Task<ApiResponseDTO<bool>> AddExtintorAsync(Guid periodId, Guid extinguisherId)
    {
        var exists = await dbContext.FireInspectionPeriodExtinguishers
            .AnyAsync(x => x.ExtinguisherId == extinguisherId);
        if (exists) return ApiResponseDTO<bool>.ErrorResult("El extintor ya pertenece a un periodo de inspección.", 409);

        dbContext.FireInspectionPeriodExtinguishers.Add(new FireInspectionPeriodExtinguisher
        {
            FireInspectionPeriodId = periodId,
            ExtinguisherId = extinguisherId,
        });
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<bool>.SuccessResult(true);
    }

    /// <summary>Quita .</summary>
    public async Task<ApiResponseDTO<bool>> RemoveExtintorAsync(Guid id)
    {
        var item = await dbContext.FireInspectionPeriodExtinguishers.FindAsync(id);
        if (item == null) return ApiResponseDTO<bool>.ErrorResult("Item no encontrado", 404);
        dbContext.FireInspectionPeriodExtinguishers.Remove(item);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<bool>.SuccessResult(true);
    }

    /// <summary>Obtiene .</summary>
    public async Task<ApiResponseDTO<object[]>> GetHidrantesAsync(Guid periodId)
    {
        var data = await dbContext.FireInspectionPeriodHydrants
            .AsNoTracking()
            .Where(x => x.FireInspectionPeriodId == periodId)
            .Join(dbContext.Hydrants, i => i.HydrantId, h => h.Id, (i, h) => new
            {
                i.Id,
                i.HydrantId,
                h.Location,
                h.LocalCode,
                TypeDescription = h.HydrantType.GetDisplayName(),
            })
            .Cast<object>()
            .ToArrayAsync();
        return ApiResponseDTO<object[]>.SuccessResult(data);
    }

    /// <summary>Agrega .</summary>
    public async Task<ApiResponseDTO<bool>> AddHidranteAsync(Guid periodId, Guid hydrantId)
    {
        var exists = await dbContext.FireInspectionPeriodHydrants
            .AnyAsync(x => x.HydrantId == hydrantId);
        if (exists) return ApiResponseDTO<bool>.ErrorResult("El hidrante ya pertenece a un periodo de inspección.", 409);

        dbContext.FireInspectionPeriodHydrants.Add(new FireInspectionPeriodHydrant
        {
            FireInspectionPeriodId = periodId,
            HydrantId = hydrantId,
        });
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<bool>.SuccessResult(true);
    }

    /// <summary>Quita .</summary>
    public async Task<ApiResponseDTO<bool>> RemoveHidranteAsync(Guid id)
    {
        var item = await dbContext.FireInspectionPeriodHydrants.FindAsync(id);
        if (item == null) return ApiResponseDTO<bool>.ErrorResult("Item no encontrado", 404);
        dbContext.FireInspectionPeriodHydrants.Remove(item);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<bool>.SuccessResult(true);
    }

    /// <summary>Obtiene .</summary>
    public async Task<ApiResponseDTO<object[]>> GetEstacionesAsync(Guid periodId)
    {
        var data = await dbContext.FireInspectionPeriodStations
            .AsNoTracking()
            .Where(x => x.FireInspectionPeriodId == periodId)
            .Join(dbContext.ManualCallPoints, i => i.StationId, s => s.Id, (i, s) => new
            {
                i.Id,
                i.StationId,
                s.Location,
                s.LocalCode,
                TypeDescription = s.StationType.GetDisplayName(),
            })
            .Cast<object>()
            .ToArrayAsync();
        return ApiResponseDTO<object[]>.SuccessResult(data);
    }

    /// <summary>Agrega .</summary>
    public async Task<ApiResponseDTO<bool>> AddEstacionAsync(Guid periodId, Guid stationId)
    {
        var exists = await dbContext.FireInspectionPeriodStations
            .AnyAsync(x => x.StationId == stationId);
        if (exists) return ApiResponseDTO<bool>.ErrorResult("La estación manual ya pertenece a un periodo de inspección.", 409);

        dbContext.FireInspectionPeriodStations.Add(new FireInspectionPeriodStation
        {
            FireInspectionPeriodId = periodId,
            StationId = stationId,
        });
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<bool>.SuccessResult(true);
    }

    /// <summary>Quita .</summary>
    public async Task<ApiResponseDTO<bool>> RemoveEstacionAsync(Guid id)
    {
        var item = await dbContext.FireInspectionPeriodStations.FindAsync(id);
        if (item == null) return ApiResponseDTO<bool>.ErrorResult("Item no encontrado", 404);
        dbContext.FireInspectionPeriodStations.Remove(item);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<bool>.SuccessResult(true);
    }

    /// <summary>Obtiene .</summary>
    public async Task<ApiResponseDTO<object[]>> GetDetectoresAsync(Guid periodId)
    {
        var data = await dbContext.FireInspectionPeriodDetectors
            .AsNoTracking()
            .Where(x => x.FireInspectionPeriodId == periodId)
            .Join(dbContext.SmokeDetectors, i => i.DetectorId, d => d.Id, (i, d) => new
            {
                i.Id,
                i.DetectorId,
                d.Location,
                d.LocalCode,
                TypeDescription = d.DetectorType.GetDisplayName(),
            })
            .Cast<object>()
            .ToArrayAsync();
        return ApiResponseDTO<object[]>.SuccessResult(data);
    }

    /// <summary>Agrega .</summary>
    public async Task<ApiResponseDTO<bool>> AddDetectorAsync(Guid periodId, Guid detectorId)
    {
        var exists = await dbContext.FireInspectionPeriodDetectors
            .AnyAsync(x => x.DetectorId == detectorId);
        if (exists) return ApiResponseDTO<bool>.ErrorResult("El detector ya pertenece a un periodo de inspección.", 409);

        dbContext.FireInspectionPeriodDetectors.Add(new FireInspectionPeriodDetector
        {
            FireInspectionPeriodId = periodId,
            DetectorId = detectorId,
        });
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<bool>.SuccessResult(true);
    }

    /// <summary>Quita .</summary>
    public async Task<ApiResponseDTO<bool>> RemoveDetectorAsync(Guid id)
    {
        var item = await dbContext.FireInspectionPeriodDetectors.FindAsync(id);
        if (item == null) return ApiResponseDTO<bool>.ErrorResult("Item no encontrado", 404);
        dbContext.FireInspectionPeriodDetectors.Remove(item);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<bool>.SuccessResult(true);
    }
}
