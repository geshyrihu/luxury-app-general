namespace MantenimientoLuxuryApp.FireInspectionPeriods.Services;
/// <summary>Servicio o componente relacionado con aplicación servicio.</summary>
public class FireInspectionCycleAppService(ApplicationDbContext dbContext) : IFireInspectionCycleAppService
{
    private static readonly Dictionary<Recurrence, int> FrequencyDays = new()
    {
        { Recurrence.Mensual,        30 },
        { Recurrence.Bimestral,      60 },
        { Recurrence.Trimestral,     90 },
        { Recurrence.Cuatrimestral, 120 },
        { Recurrence.Quimestral,    150 },
        { Recurrence.Semestral,     180 },
        { Recurrence.Anual,         365 },
    };

    /// <summary>Obtiene todas.</summary>
    public async Task<ApiResponseDTO<FireInspectionCycleDTO[]>> GetAllAsync(Guid customerId)
    {
        var data = await dbContext.FireInspectionCycles
            .AsNoTracking()
            .Where(x => x.CustomerId == customerId)
            .OrderByDescending(x => x.PeriodStart)
            .Select(x => new FireInspectionCycleDTO
            {
                Id = x.Id,
                FireInspectionPeriodId = x.FireInspectionPeriodId,
                PeriodName = x.Period.Name,
                PeriodStart = x.PeriodStart,
                PeriodEnd = x.PeriodEnd,
                Status = x.Status,
                GeneratedAt = x.GeneratedAt,
                TotalItems =
                    x.ExtintorInspections.Count +
                    x.HidranteInspections.Count +
                    x.EstacionInspections.Count +
                    x.DetectorInspections.Count,
                PendingItems =
                    x.ExtintorInspections.Count(i => i.Status == FireItemStatus.Pendiente) +
                    x.HidranteInspections.Count(i => i.Status == FireItemStatus.Pendiente) +
                    x.EstacionInspections.Count(i => i.Status == FireItemStatus.Pendiente) +
                    x.DetectorInspections.Count(i => i.Status == FireItemStatus.Pendiente),
                CompletedItems =
                    x.ExtintorInspections.Count(i => i.Status == FireItemStatus.Realizada) +
                    x.HidranteInspections.Count(i => i.Status == FireItemStatus.Realizada) +
                    x.EstacionInspections.Count(i => i.Status == FireItemStatus.Realizada) +
                    x.DetectorInspections.Count(i => i.Status == FireItemStatus.Realizada),
            })
            .ToArrayAsync();
        return ApiResponseDTO<FireInspectionCycleDTO[]>.SuccessResult(data);
    }

    /// <summary>Obtiene detalle.</summary>
    public async Task<ApiResponseDTO<FireInspectionCycleDetailDTO>> GetDetailAsync(Guid id)
    {
        var cycle = await dbContext.FireInspectionCycles
            .AsNoTracking()
            .Where(x => x.Id == id)
            .Select(x => new { x.Id, x.FireInspectionPeriodId, PeriodName = x.Period.Name, x.PeriodStart, x.PeriodEnd, x.Status })
            .FirstOrDefaultAsync();

        if (cycle == null) return ApiResponseDTO<FireInspectionCycleDetailDTO>.ErrorResult("Ciclo no encontrado", 404);

        var extintores = await dbContext.FireCycleInspectionExtinguishers
            .AsNoTracking()
            .Where(x => x.FireInspectionCycleId == id)
            .Join(dbContext.FireExtinguishers, i => i.ExtinguisherId, e => e.Id, (i, e) => new FireCycleInspectionItemSummaryDTO
            {
                InspectionId = i.Id,
                EquipmentId = i.ExtinguisherId,
                EquipmentType = "Extintor",
                Location = e.Location,
                LocalCode = e.LocalCode,
                TypeDescription = e.ExtinguisherType.GetDisplayName(),
                Status = i.Status,
                InspectedAt = i.InspectedAt,
            })
            .ToListAsync();

        var hidrantes = await dbContext.FireCycleInspectionHydrants
            .AsNoTracking()
            .Where(x => x.FireInspectionCycleId == id)
            .Join(dbContext.Hydrants, i => i.HydrantId, h => h.Id, (i, h) => new FireCycleInspectionItemSummaryDTO
            {
                InspectionId = i.Id,
                EquipmentId = i.HydrantId,
                EquipmentType = "Hidrante",
                Location = h.Location,
                LocalCode = h.LocalCode,
                TypeDescription = h.HydrantType.GetDisplayName(),
                Status = i.Status,
                InspectedAt = i.InspectedAt,
            })
            .ToListAsync();

        var estaciones = await dbContext.FireCycleInspectionStations
            .AsNoTracking()
            .Where(x => x.FireInspectionCycleId == id)
            .Join(dbContext.ManualCallPoints, i => i.StationId, s => s.Id, (i, s) => new FireCycleInspectionItemSummaryDTO
            {
                InspectionId = i.Id,
                EquipmentId = i.StationId,
                EquipmentType = "EstacionManual",
                Location = s.Location,
                LocalCode = s.LocalCode,
                TypeDescription = s.StationType.GetDisplayName(),
                Status = i.Status,
                InspectedAt = i.InspectedAt,
            })
            .ToListAsync();

        var detectores = await dbContext.FireCycleInspectionDetectors
            .AsNoTracking()
            .Where(x => x.FireInspectionCycleId == id)
            .Join(dbContext.SmokeDetectors, i => i.DetectorId, d => d.Id, (i, d) => new FireCycleInspectionItemSummaryDTO
            {
                InspectionId = i.Id,
                EquipmentId = i.DetectorId,
                EquipmentType = "DetectorHumo",
                Location = d.Location,
                LocalCode = d.LocalCode,
                TypeDescription = d.DetectorType.GetDisplayName(),
                Status = i.Status,
                InspectedAt = i.InspectedAt,
            })
            .ToListAsync();

        var detail = new FireInspectionCycleDetailDTO
        {
            Id = cycle.Id,
            FireInspectionPeriodId = cycle.FireInspectionPeriodId,
            PeriodName = cycle.PeriodName,
            PeriodStart = cycle.PeriodStart,
            PeriodEnd = cycle.PeriodEnd,
            Status = cycle.Status,
            Items = [.. extintores, .. hidrantes, .. estaciones, .. detectores],
        };
        return ApiResponseDTO<FireInspectionCycleDetailDTO>.SuccessResult(detail);
    }

    /// <summary>Genera para.</summary>
    public async Task<ApiResponseDTO<bool>> GenerateCycleForPeriodAsync(Guid periodId)
    {
        var period = await dbContext.FireInspectionPeriods
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == periodId);

        if (period == null) return ApiResponseDTO<bool>.ErrorResult("Periodo no encontrado", 404);
        if (!period.IsActive) return ApiResponseDTO<bool>.ErrorResult("El periodo no está activo", 400);

        var today = DateOnly.FromDateTime(DateTimeExtension.GetMexicoDateOnly());
        var horizon = today.AddDays(15);

        // Determine cycle duration from recurrence (Eventual gets a 365-day window)
        int intervalDays = period.Frecuencia == Recurrence.Eventual
            ? 365
            : FrequencyDays.GetValueOrDefault(period.Frecuencia, 30);

        // Fix any stale cycles that were created with the old 14-day hard-coded window
        var existingCycles = await dbContext.FireInspectionCycles
            .Where(x => x.FireInspectionPeriodId == periodId && x.Status != FireCycleStatus.Vencido)
            .ToListAsync();

        bool staleCorrected = false;
        foreach (var sc in existingCycles)
        {
            var correctEnd = sc.PeriodStart.AddDays(intervalDays - 1);
            if (sc.PeriodEnd != correctEnd)
            {
                sc.PeriodEnd = correctEnd;
                staleCorrected = true;
            }
        }
        if (staleCorrected) await dbContext.SaveChangesAsync();

        var existingStarts = existingCycles.Select(x => x.PeriodStart).ToHashSet();
        var candidateStarts = GetCandidateStarts(period, today, horizon);

        var extintores = await dbContext.FireInspectionPeriodExtinguishers.Where(x => x.FireInspectionPeriodId == periodId).Select(x => x.ExtinguisherId).ToListAsync();
        var hidrantes = await dbContext.FireInspectionPeriodHydrants.Where(x => x.FireInspectionPeriodId == periodId).Select(x => x.HydrantId).ToListAsync();
        var estaciones = await dbContext.FireInspectionPeriodStations.Where(x => x.FireInspectionPeriodId == periodId).Select(x => x.StationId).ToListAsync();
        var detectores = await dbContext.FireInspectionPeriodDetectors.Where(x => x.FireInspectionPeriodId == periodId).Select(x => x.DetectorId).ToListAsync();

        bool generated = false;
        foreach (var start in candidateStarts)
        {
            if (existingStarts.Contains(start)) continue;

            var cycle = new FireInspectionCycle
            {
                CustomerId = period.CustomerId,
                FireInspectionPeriodId = period.Id,
                PeriodStart = start,
                PeriodEnd = start.AddDays(intervalDays - 1),
                Status = FireCycleStatus.Pendiente,
                GeneratedAt = DateTime.UtcNow,
            };
            dbContext.FireInspectionCycles.Add(cycle);
            await dbContext.SaveChangesAsync();

            foreach (var id in extintores)
                dbContext.FireCycleInspectionExtinguishers.Add(new FireCycleInspectionExtinguisher { FireInspectionCycleId = cycle.Id, ExtinguisherId = id, Status = FireItemStatus.Pendiente });
            foreach (var id in hidrantes)
                dbContext.FireCycleInspectionHydrants.Add(new FireCycleInspectionHydrant { FireInspectionCycleId = cycle.Id, HydrantId = id, Status = FireItemStatus.Pendiente });
            foreach (var id in estaciones)
                dbContext.FireCycleInspectionStations.Add(new FireCycleInspectionStation { FireInspectionCycleId = cycle.Id, StationId = id, Status = FireItemStatus.Pendiente });
            foreach (var id in detectores)
                dbContext.FireCycleInspectionDetectors.Add(new FireCycleInspectionDetector { FireInspectionCycleId = cycle.Id, DetectorId = id, Status = FireItemStatus.Pendiente });

            await dbContext.SaveChangesAsync();
            generated = true;
        }

        return ApiResponseDTO<bool>.SuccessResult(staleCorrected || generated);
    }

    private static List<DateOnly> GetCandidateStarts(FireInspectionPeriod period, DateOnly today, DateOnly horizon)
    {
        var result = new List<DateOnly>();
        var start = period.StartDate;

        if (period.Frecuencia == Recurrence.Eventual)
        {
            if (start <= horizon) result.Add(start);
            return result;
        }

        var frequencyDays = new Dictionary<Recurrence, int>
        {
            { Recurrence.Mensual, 30 }, { Recurrence.Bimestral, 60 },
            { Recurrence.Trimestral, 90 }, { Recurrence.Cuatrimestral, 120 },
            { Recurrence.Quimestral, 150 }, { Recurrence.Semestral, 180 },
            { Recurrence.Anual, 365 },
        };

        if (!frequencyDays.TryGetValue(period.Frecuencia, out int intervalDays) || intervalDays <= 0)
            return result;

        while (start <= horizon)
        {
            result.Add(start);
            start = start.AddDays(intervalDays);
        }
        return result;
    }

    /// <summary>Obtiene activo por.</summary>
    public async Task<ApiResponseDTO<FireInspectionCycleDetailDTO>> GetActiveByPeriodAsync(Guid periodId)
    {
        var today = DateOnly.FromDateTime(DateTimeExtension.GetMexicoDateOnly());
        var cycle = await dbContext.FireInspectionCycles
            .AsNoTracking()
            .Where(x => x.FireInspectionPeriodId == periodId
                        && x.PeriodStart <= today
                        && x.PeriodEnd >= today
                        && x.Status != FireCycleStatus.Vencido)
            .OrderByDescending(x => x.PeriodStart)
            .Select(x => new { x.Id })
            .FirstOrDefaultAsync();

        if (cycle == null)
            return ApiResponseDTO<FireInspectionCycleDetailDTO>.SuccessResult(null);

        var detail = await GetDetailAsync(cycle.Id);
        return ApiResponseDTO<FireInspectionCycleDetailDTO>.SuccessResult(detail.Data);
    }
}
