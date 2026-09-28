#nullable enable
namespace MantenimientoLuxuryApp.FireInspectionPeriods.Services;
/// <summary>Servicio o componente relacionado con aplicación servicio.</summary>
public class FireCycleInspectionAppService(ApplicationDbContext dbContext) : IFireCycleInspectionAppService
{
    /// <summary>Ejecuta la operación de .</summary>
    public async Task<ApiResponseDTO<bool>> UpsertExtintorAsync(FireCycleInspectionExtintorAddOrEditDTO dto)
    {
        var existing = await dbContext.FireCycleInspectionExtinguishers
            .FirstOrDefaultAsync(x => x.FireInspectionCycleId == dto.FireInspectionCycleId && x.ExtinguisherId == dto.ExtinguisherId);

        if (existing != null)
        {
            existing.AdequatePressure = dto.AdequatePressure;
            existing.SafetyPinOk = dto.SafetyPinOk;
            existing.LabelsOk = dto.LabelsOk;
            existing.NoPhysicalDamage = dto.NoPhysicalDamage;
            existing.Observations = dto.Observations;
            existing.Status = FireItemStatus.Realizada;
            existing.InspectedAt = DateTime.UtcNow;
            existing.ApplicationUserId = dto.ApplicationUserId;
        }
        else
        {
            dbContext.FireCycleInspectionExtinguishers.Add(new FireCycleInspectionExtinguisher
            {
                FireInspectionCycleId = dto.FireInspectionCycleId,
                ExtinguisherId = dto.ExtinguisherId,
                AdequatePressure = dto.AdequatePressure,
                SafetyPinOk = dto.SafetyPinOk,
                LabelsOk = dto.LabelsOk,
                NoPhysicalDamage = dto.NoPhysicalDamage,
                Observations = dto.Observations,
                Status = FireItemStatus.Realizada,
                InspectedAt = DateTime.UtcNow,
                ApplicationUserId = dto.ApplicationUserId,
            });
        }
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<bool>.SuccessResult(true);
    }

    /// <summary>Ejecuta la operación de .</summary>
    public async Task<ApiResponseDTO<bool>> UpsertHidranteAsync(FireCycleInspectionHidranteAddOrEditDTO dto)
    {
        var existing = await dbContext.FireCycleInspectionHydrants
            .FirstOrDefaultAsync(x => x.FireInspectionCycleId == dto.FireInspectionCycleId && x.HydrantId == dto.HydrantId);

        if (existing != null)
        {
            existing.LabelPresent = dto.LabelPresent;
            existing.GlassIntact = dto.GlassIntact;
            existing.WrenchPresent = dto.WrenchPresent;
            existing.HoseOk = dto.HoseOk;
            existing.NozzlePresent = dto.NozzlePresent;
            existing.ValveOperational = dto.ValveOperational;
            existing.LockOk = dto.LockOk;
            existing.CabinetState = dto.CabinetState;
            existing.Observations = dto.Observations;
            existing.Status = FireItemStatus.Realizada;
            existing.InspectedAt = DateTime.UtcNow;
            existing.ApplicationUserId = dto.ApplicationUserId;
        }
        else
        {
            dbContext.FireCycleInspectionHydrants.Add(new FireCycleInspectionHydrant
            {
                FireInspectionCycleId = dto.FireInspectionCycleId,
                HydrantId = dto.HydrantId,
                LabelPresent = dto.LabelPresent,
                GlassIntact = dto.GlassIntact,
                WrenchPresent = dto.WrenchPresent,
                HoseOk = dto.HoseOk,
                NozzlePresent = dto.NozzlePresent,
                ValveOperational = dto.ValveOperational,
                LockOk = dto.LockOk,
                CabinetState = dto.CabinetState,
                Observations = dto.Observations,
                Status = FireItemStatus.Realizada,
                InspectedAt = DateTime.UtcNow,
                ApplicationUserId = dto.ApplicationUserId,
            });
        }
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<bool>.SuccessResult(true);
    }

    /// <summary>Ejecuta la operación de .</summary>
    public async Task<ApiResponseDTO<bool>> UpsertEstacionAsync(FireCycleInspectionEstacionAddOrEditDTO dto)
    {
        var existing = await dbContext.FireCycleInspectionStations
            .FirstOrDefaultAsync(x => x.FireInspectionCycleId == dto.FireInspectionCycleId && x.StationId == dto.StationId);

        if (existing != null)
        {
            existing.AccessibleAndVisible = dto.AccessibleAndVisible;
            existing.HousingOk = dto.HousingOk;
            existing.LeverOk = dto.LeverOk;
            existing.GlassIntact = dto.GlassIntact;
            existing.MountingSecure = dto.MountingSecure;
            existing.SignageOk = dto.SignageOk;
            existing.Observations = dto.Observations;
            existing.Status = FireItemStatus.Realizada;
            existing.InspectedAt = DateTime.UtcNow;
            existing.ApplicationUserId = dto.ApplicationUserId;
        }
        else
        {
            dbContext.FireCycleInspectionStations.Add(new FireCycleInspectionStation
            {
                FireInspectionCycleId = dto.FireInspectionCycleId,
                StationId = dto.StationId,
                AccessibleAndVisible = dto.AccessibleAndVisible,
                HousingOk = dto.HousingOk,
                LeverOk = dto.LeverOk,
                GlassIntact = dto.GlassIntact,
                MountingSecure = dto.MountingSecure,
                SignageOk = dto.SignageOk,
                Observations = dto.Observations,
                Status = FireItemStatus.Realizada,
                InspectedAt = DateTime.UtcNow,
                ApplicationUserId = dto.ApplicationUserId,
            });
        }
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<bool>.SuccessResult(true);
    }

    /// <summary>Ejecuta la operación de .</summary>
    public async Task<ApiResponseDTO<bool>> UpsertDetectorAsync(FireCycleInspectionDetectorAddOrEditDTO dto)
    {
        var existing = await dbContext.FireCycleInspectionDetectors
            .FirstOrDefaultAsync(x => x.FireInspectionCycleId == dto.FireInspectionCycleId && x.DetectorId == dto.DetectorId);

        if (existing != null)
        {
            existing.NoObstructions = dto.NoObstructions;
            existing.NoContamination = dto.NoContamination;
            existing.NoPhysicalDamage = dto.NoPhysicalDamage;
            existing.LedStatusOk = dto.LedStatusOk;
            existing.MountingSecure = dto.MountingSecure;
            existing.Observations = dto.Observations;
            existing.Status = FireItemStatus.Realizada;
            existing.InspectedAt = DateTime.UtcNow;
            existing.ApplicationUserId = dto.ApplicationUserId;
        }
        else
        {
            dbContext.FireCycleInspectionDetectors.Add(new FireCycleInspectionDetector
            {
                FireInspectionCycleId = dto.FireInspectionCycleId,
                DetectorId = dto.DetectorId,
                NoObstructions = dto.NoObstructions,
                NoContamination = dto.NoContamination,
                NoPhysicalDamage = dto.NoPhysicalDamage,
                LedStatusOk = dto.LedStatusOk,
                MountingSecure = dto.MountingSecure,
                Observations = dto.Observations,
                Status = FireItemStatus.Realizada,
                InspectedAt = DateTime.UtcNow,
                ApplicationUserId = dto.ApplicationUserId,
            });
        }
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<bool>.SuccessResult(true);
    }

    /// <summary>Obtiene .</summary>
    public async Task<ApiResponseDTO<FireCycleInspectionExtintorAddOrEditDTO?>> GetExtintorAsync(Guid cycleId, Guid extinguisherId)
    {
        var item = await dbContext.FireCycleInspectionExtinguishers
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.FireInspectionCycleId == cycleId && x.ExtinguisherId == extinguisherId);
        if (item == null) return ApiResponseDTO<FireCycleInspectionExtintorAddOrEditDTO?>.SuccessResult(null);
        return ApiResponseDTO<FireCycleInspectionExtintorAddOrEditDTO?>.SuccessResult(new FireCycleInspectionExtintorAddOrEditDTO
        {
            FireInspectionCycleId = item.FireInspectionCycleId,
            ExtinguisherId = item.ExtinguisherId,
            AdequatePressure = item.AdequatePressure,
            SafetyPinOk = item.SafetyPinOk,
            LabelsOk = item.LabelsOk,
            NoPhysicalDamage = item.NoPhysicalDamage,
            Observations = item.Observations,
            ApplicationUserId = item.ApplicationUserId ?? "",
        });
    }

    /// <summary>Obtiene .</summary>
    public async Task<ApiResponseDTO<FireCycleInspectionHidranteAddOrEditDTO?>> GetHidranteAsync(Guid cycleId, Guid hydrantId)
    {
        var item = await dbContext.FireCycleInspectionHydrants
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.FireInspectionCycleId == cycleId && x.HydrantId == hydrantId);
        if (item == null) return ApiResponseDTO<FireCycleInspectionHidranteAddOrEditDTO?>.SuccessResult(null);
        return ApiResponseDTO<FireCycleInspectionHidranteAddOrEditDTO?>.SuccessResult(new FireCycleInspectionHidranteAddOrEditDTO
        {
            FireInspectionCycleId = item.FireInspectionCycleId,
            HydrantId = item.HydrantId,
            LabelPresent = item.LabelPresent,
            GlassIntact = item.GlassIntact,
            WrenchPresent = item.WrenchPresent,
            HoseOk = item.HoseOk,
            NozzlePresent = item.NozzlePresent,
            ValveOperational = item.ValveOperational,
            LockOk = item.LockOk,
            CabinetState = item.CabinetState,
            Observations = item.Observations,
            ApplicationUserId = item.ApplicationUserId ?? "",
        });
    }

    /// <summary>Obtiene .</summary>
    public async Task<ApiResponseDTO<FireCycleInspectionEstacionAddOrEditDTO?>> GetEstacionAsync(Guid cycleId, Guid stationId)
    {
        var item = await dbContext.FireCycleInspectionStations
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.FireInspectionCycleId == cycleId && x.StationId == stationId);
        if (item == null) return ApiResponseDTO<FireCycleInspectionEstacionAddOrEditDTO?>.SuccessResult(null);
        return ApiResponseDTO<FireCycleInspectionEstacionAddOrEditDTO?>.SuccessResult(new FireCycleInspectionEstacionAddOrEditDTO
        {
            FireInspectionCycleId = item.FireInspectionCycleId,
            StationId = item.StationId,
            AccessibleAndVisible = item.AccessibleAndVisible,
            HousingOk = item.HousingOk,
            LeverOk = item.LeverOk,
            GlassIntact = item.GlassIntact,
            MountingSecure = item.MountingSecure,
            SignageOk = item.SignageOk,
            Observations = item.Observations,
            ApplicationUserId = item.ApplicationUserId ?? "",
        });
    }

    /// <summary>Obtiene .</summary>
    public async Task<ApiResponseDTO<FireCycleInspectionDetectorAddOrEditDTO?>> GetDetectorAsync(Guid cycleId, Guid detectorId)
    {
        var item = await dbContext.FireCycleInspectionDetectors
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.FireInspectionCycleId == cycleId && x.DetectorId == detectorId);
        if (item == null) return ApiResponseDTO<FireCycleInspectionDetectorAddOrEditDTO?>.SuccessResult(null);
        return ApiResponseDTO<FireCycleInspectionDetectorAddOrEditDTO?>.SuccessResult(new FireCycleInspectionDetectorAddOrEditDTO
        {
            FireInspectionCycleId = item.FireInspectionCycleId,
            DetectorId = item.DetectorId,
            NoObstructions = item.NoObstructions,
            NoContamination = item.NoContamination,
            NoPhysicalDamage = item.NoPhysicalDamage,
            LedStatusOk = item.LedStatusOk,
            MountingSecure = item.MountingSecure,
            Observations = item.Observations,
            ApplicationUserId = item.ApplicationUserId ?? "",
        });
    }
}
