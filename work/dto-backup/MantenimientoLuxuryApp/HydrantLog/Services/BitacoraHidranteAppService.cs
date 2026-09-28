namespace MantenimientoLuxuryApp.HydrantLog.Services;
/// <summary>Servicio o componente relacionado con aplicación servicio.</summary>
public class BitacoraHidranteAppService(ApplicationDbContext dbContext) : IBitacoraHidranteAppService
{
    /// <summary>Obtiene todas.</summary>
    public async Task<ApiResponseDTO<BitacoraHidranteDTO[]>> GetAllAsync(Guid hydrantId)
    {
        var data = await dbContext.HydrantLogs
            .Where(x => x.HydrantId == hydrantId)
            .OrderByDescending(x => x.Date)
            .ThenByDescending(x => x.Hour)
            .Select(x => new BitacoraHidranteDTO
            {
                Id = x.Id,
                HydrantId = x.HydrantId,
                Date = x.Date,
                Hour = x.Hour,
                LabelPresent = x.LabelPresent,
                GlassIntact = x.GlassIntact,
                WrenchPresent = x.WrenchPresent,
                HoseOk = x.HoseOk,
                NozzlePresent = x.NozzlePresent,
                ValveOperational = x.ValveOperational,
                LockOk = x.LockOk,
                CabinetState = x.CabinetState,
                Observations = x.Observations,
                ApplicationUserId = x.ApplicationUserId,
            })
            .ToArrayAsync();
        return ApiResponseDTO<BitacoraHidranteDTO[]>.SuccessResult(data);
    }

    /// <summary>Obtiene por identificador.</summary>
    public async Task<ApiResponseDTO<BitacoraHidranteAddOrEditDTO>> GetByIdAsync(Guid id)
    {
        var model = await dbContext.HydrantLogs.FindAsync(id);
        if (model == null) return ApiResponseDTO<BitacoraHidranteAddOrEditDTO>.ErrorResult("Registro no encontrado", 404);
        var result = new BitacoraHidranteAddOrEditDTO
        {
            HydrantId = model.HydrantId,
            Date = model.Date,
            Hour = model.Hour,
            LabelPresent = model.LabelPresent,
            GlassIntact = model.GlassIntact,
            WrenchPresent = model.WrenchPresent,
            HoseOk = model.HoseOk,
            NozzlePresent = model.NozzlePresent,
            ValveOperational = model.ValveOperational,
            LockOk = model.LockOk,
            CabinetState = model.CabinetState,
            Observations = model.Observations,
            ApplicationUserId = model.ApplicationUserId,
        };
        return ApiResponseDTO<BitacoraHidranteAddOrEditDTO>.SuccessResult(result);
    }

    /// <summary>Agrega .</summary>
    public async Task<ApiResponseDTO<BitacoraHidrante>> AddAsync(BitacoraHidranteAddOrEditDTO dto)
    {
        var model = new BitacoraHidrante
        {
            HydrantId = dto.HydrantId,
            Date = dto.Date,
            Hour = dto.Hour,
            LabelPresent = dto.LabelPresent,
            GlassIntact = dto.GlassIntact,
            WrenchPresent = dto.WrenchPresent,
            HoseOk = dto.HoseOk,
            NozzlePresent = dto.NozzlePresent,
            ValveOperational = dto.ValveOperational,
            LockOk = dto.LockOk,
            CabinetState = dto.CabinetState,
            Observations = dto.Observations,
            ApplicationUserId = dto.ApplicationUserId,
        };
        dbContext.HydrantLogs.Add(model);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<BitacoraHidrante>.SuccessResult(model);
    }

    /// <summary>Elimina por identificador.</summary>
    public async Task<ApiResponseDTO<bool>> DeleteByIdAsync(Guid id)
    {
        var data = await dbContext.HydrantLogs.FindAsync(id);
        if (data == null) return ApiResponseDTO<bool>.ErrorResult("Registro no encontrado", 404);
        dbContext.HydrantLogs.Remove(data);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<bool>.SuccessResult(true);
    }
}
