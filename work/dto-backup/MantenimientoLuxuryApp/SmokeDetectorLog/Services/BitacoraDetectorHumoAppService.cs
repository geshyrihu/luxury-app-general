namespace MantenimientoLuxuryApp.SmokeDetectorLog.Services;
/// <summary>Servicio o componente relacionado con aplicación servicio.</summary>
public class BitacoraDetectorHumoAppService(ApplicationDbContext dbContext) : IBitacoraDetectorHumoAppService
{
    /// <summary>Obtiene todas.</summary>
    public async Task<ApiResponseDTO<BitacoraDetectorHumoDTO[]>> GetAllAsync(Guid detectorId)
    {
        var data = await dbContext.SmokeDetectorLogs
            .Where(x => x.DetectorId == detectorId)
            .OrderByDescending(x => x.Date)
            .ThenByDescending(x => x.Hour)
            .Select(x => new BitacoraDetectorHumoDTO
            {
                Id = x.Id,
                DetectorId = x.DetectorId,
                Date = x.Date,
                Hour = x.Hour,
                NoObstructions = x.NoObstructions,
                NoContamination = x.NoContamination,
                NoPhysicalDamage = x.NoPhysicalDamage,
                LedStatusOk = x.LedStatusOk,
                MountingSecure = x.MountingSecure,
                Observations = x.Observations,
                ApplicationUserId = x.ApplicationUserId,
            })
            .ToArrayAsync();
        return ApiResponseDTO<BitacoraDetectorHumoDTO[]>.SuccessResult(data);
    }

    /// <summary>Obtiene por identificador.</summary>
    public async Task<ApiResponseDTO<BitacoraDetectorHumoAddOrEditDTO>> GetByIdAsync(Guid id)
    {
        var model = await dbContext.SmokeDetectorLogs.FindAsync(id);
        if (model == null) return ApiResponseDTO<BitacoraDetectorHumoAddOrEditDTO>.ErrorResult("Registro no encontrado", 404);
        var result = new BitacoraDetectorHumoAddOrEditDTO
        {
            DetectorId = model.DetectorId,
            Date = model.Date,
            Hour = model.Hour,
            NoObstructions = model.NoObstructions,
            NoContamination = model.NoContamination,
            NoPhysicalDamage = model.NoPhysicalDamage,
            LedStatusOk = model.LedStatusOk,
            MountingSecure = model.MountingSecure,
            Observations = model.Observations,
            ApplicationUserId = model.ApplicationUserId,
        };
        return ApiResponseDTO<BitacoraDetectorHumoAddOrEditDTO>.SuccessResult(result);
    }

    /// <summary>Agrega .</summary>
    public async Task<ApiResponseDTO<BitacoraDetectorHumo>> AddAsync(BitacoraDetectorHumoAddOrEditDTO dto)
    {
        var model = new BitacoraDetectorHumo
        {
            DetectorId = dto.DetectorId,
            Date = dto.Date,
            Hour = dto.Hour,
            NoObstructions = dto.NoObstructions,
            NoContamination = dto.NoContamination,
            NoPhysicalDamage = dto.NoPhysicalDamage,
            LedStatusOk = dto.LedStatusOk,
            MountingSecure = dto.MountingSecure,
            Observations = dto.Observations,
            ApplicationUserId = dto.ApplicationUserId,
        };
        dbContext.SmokeDetectorLogs.Add(model);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<BitacoraDetectorHumo>.SuccessResult(model);
    }

    /// <summary>Elimina por identificador.</summary>
    public async Task<ApiResponseDTO<bool>> DeleteByIdAsync(Guid id)
    {
        var data = await dbContext.SmokeDetectorLogs.FindAsync(id);
        if (data == null) return ApiResponseDTO<bool>.ErrorResult("Registro no encontrado", 404);
        dbContext.SmokeDetectorLogs.Remove(data);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<bool>.SuccessResult(true);
    }
}
