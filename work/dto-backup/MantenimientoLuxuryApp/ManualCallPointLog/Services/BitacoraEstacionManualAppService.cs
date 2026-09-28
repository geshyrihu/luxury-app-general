namespace MantenimientoLuxuryApp.ManualCallPointLog.Services;
/// <summary>Servicio o componente relacionado con aplicación servicio.</summary>
public class BitacoraEstacionManualAppService(ApplicationDbContext dbContext) : IBitacoraEstacionManualAppService
{
    /// <summary>Obtiene todas.</summary>
    public async Task<ApiResponseDTO<BitacoraEstacionManualDTO[]>> GetAllAsync(Guid stationId)
    {
        var data = await dbContext.ManualCallPointLogs
            .Where(x => x.StationId == stationId)
            .OrderByDescending(x => x.Date)
            .ThenByDescending(x => x.Hour)
            .Select(x => new BitacoraEstacionManualDTO
            {
                Id = x.Id,
                StationId = x.StationId,
                Date = x.Date,
                Hour = x.Hour,
                AccessibleAndVisible = x.AccessibleAndVisible,
                HousingOk = x.HousingOk,
                LeverOk = x.LeverOk,
                GlassIntact = x.GlassIntact,
                MountingSecure = x.MountingSecure,
                SignageOk = x.SignageOk,
                Observations = x.Observations,
                ApplicationUserId = x.ApplicationUserId,
            })
            .ToArrayAsync();
        return ApiResponseDTO<BitacoraEstacionManualDTO[]>.SuccessResult(data);
    }

    /// <summary>Obtiene por identificador.</summary>
    public async Task<ApiResponseDTO<BitacoraEstacionManualAddOrEditDTO>> GetByIdAsync(Guid id)
    {
        var model = await dbContext.ManualCallPointLogs.FindAsync(id);
        if (model == null) return ApiResponseDTO<BitacoraEstacionManualAddOrEditDTO>.ErrorResult("Registro no encontrado", 404);
        var result = new BitacoraEstacionManualAddOrEditDTO
        {
            StationId = model.StationId,
            Date = model.Date,
            Hour = model.Hour,
            AccessibleAndVisible = model.AccessibleAndVisible,
            HousingOk = model.HousingOk,
            LeverOk = model.LeverOk,
            GlassIntact = model.GlassIntact,
            MountingSecure = model.MountingSecure,
            SignageOk = model.SignageOk,
            Observations = model.Observations,
            ApplicationUserId = model.ApplicationUserId,
        };
        return ApiResponseDTO<BitacoraEstacionManualAddOrEditDTO>.SuccessResult(result);
    }

    /// <summary>Agrega .</summary>
    public async Task<ApiResponseDTO<BitacoraEstacionManual>> AddAsync(BitacoraEstacionManualAddOrEditDTO dto)
    {
        var model = new BitacoraEstacionManual
        {
            StationId = dto.StationId,
            Date = dto.Date,
            Hour = dto.Hour,
            AccessibleAndVisible = dto.AccessibleAndVisible,
            HousingOk = dto.HousingOk,
            LeverOk = dto.LeverOk,
            GlassIntact = dto.GlassIntact,
            MountingSecure = dto.MountingSecure,
            SignageOk = dto.SignageOk,
            Observations = dto.Observations,
            ApplicationUserId = dto.ApplicationUserId,
        };
        dbContext.ManualCallPointLogs.Add(model);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<BitacoraEstacionManual>.SuccessResult(model);
    }

    /// <summary>Elimina por identificador.</summary>
    public async Task<ApiResponseDTO<bool>> DeleteByIdAsync(Guid id)
    {
        var data = await dbContext.ManualCallPointLogs.FindAsync(id);
        if (data == null) return ApiResponseDTO<bool>.ErrorResult("Registro no encontrado", 404);
        dbContext.ManualCallPointLogs.Remove(data);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<bool>.SuccessResult(true);
    }
}
