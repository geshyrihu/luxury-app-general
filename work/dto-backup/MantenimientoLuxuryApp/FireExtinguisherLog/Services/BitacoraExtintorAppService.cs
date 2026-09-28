namespace MantenimientoLuxuryApp.FireExtinguisherLog.Services;
/// <summary>Servicio o componente relacionado con aplicación servicio.</summary>
public class BitacoraExtintorAppService(ApplicationDbContext dbContext) : IBitacoraExtintorAppService
{
    /// <summary>Obtiene todas.</summary>
    public async Task<ApiResponseDTO<BitacoraExtintorDTO[]>> GetAllAsync(Guid extinguisherId)
    {
        var data = await dbContext.FireExtinguisherLogs
            .Where(x => x.ExtinguisherId == extinguisherId)
            .OrderByDescending(x => x.Date)
            .ThenByDescending(x => x.Hour)
            .Select(x => new BitacoraExtintorDTO
            {
                Id = x.Id,
                ExtinguisherId = x.ExtinguisherId,
                Date = x.Date,
                Hour = x.Hour,
                AdequatePressure = x.AdequatePressure,
                SafetyPinOk = x.SafetyPinOk,
                LabelsOk = x.LabelsOk,
                NoPhysicalDamage = x.NoPhysicalDamage,
                Observations = x.Observations,
                ApplicationUserId = x.ApplicationUserId,
            })
            .ToArrayAsync();
        return ApiResponseDTO<BitacoraExtintorDTO[]>.SuccessResult(data);
    }

    /// <summary>Obtiene por identificador.</summary>
    public async Task<ApiResponseDTO<BitacoraExtintorAddOrEditDTO>> GetByIdAsync(Guid id)
    {
        var model = await dbContext.FireExtinguisherLogs.FindAsync(id);
        if (model == null) return ApiResponseDTO<BitacoraExtintorAddOrEditDTO>.ErrorResult("Registro no encontrado", 404);
        var result = new BitacoraExtintorAddOrEditDTO
        {
            ExtinguisherId = model.ExtinguisherId,
            Date = model.Date,
            Hour = model.Hour,
            AdequatePressure = model.AdequatePressure,
            SafetyPinOk = model.SafetyPinOk,
            LabelsOk = model.LabelsOk,
            NoPhysicalDamage = model.NoPhysicalDamage,
            Observations = model.Observations,
            ApplicationUserId = model.ApplicationUserId,
        };
        return ApiResponseDTO<BitacoraExtintorAddOrEditDTO>.SuccessResult(result);
    }

    /// <summary>Agrega .</summary>
    public async Task<ApiResponseDTO<BitacoraExtintor>> AddAsync(BitacoraExtintorAddOrEditDTO dto)
    {
        var model = new BitacoraExtintor
        {
            ExtinguisherId = dto.ExtinguisherId,
            Date = dto.Date,
            Hour = dto.Hour,
            AdequatePressure = dto.AdequatePressure,
            SafetyPinOk = dto.SafetyPinOk,
            LabelsOk = dto.LabelsOk,
            NoPhysicalDamage = dto.NoPhysicalDamage,
            Observations = dto.Observations,
            ApplicationUserId = dto.ApplicationUserId,
        };
        dbContext.FireExtinguisherLogs.Add(model);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<BitacoraExtintor>.SuccessResult(model);
    }

    /// <summary>Elimina por identificador.</summary>
    public async Task<ApiResponseDTO<bool>> DeleteByIdAsync(Guid id)
    {
        var data = await dbContext.FireExtinguisherLogs.FindAsync(id);
        if (data == null) return ApiResponseDTO<bool>.ErrorResult("Registro no encontrado", 404);
        dbContext.FireExtinguisherLogs.Remove(data);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<bool>.SuccessResult(true);
    }
}
