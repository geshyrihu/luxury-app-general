namespace MantenimientoLuxuryApp.Meters.Services;
/// <summary>
/// Implementación del servicio de gestión de dispositivos de medición.
/// Maneja la clasificación por tipo de servicio (Gas, Agua, Luz) y el estado de actividad de los medidores.
/// </summary>
public class MedidorAppService(ApplicationDbContext dbContext, IMapper mapper) : IMedidorAppService
{
    /// <summary>
    /// Obtiene un medidor validando su existencia; lanza BusinessException en caso contrario.
    /// </summary>
    public async Task<ApiResponseDTO<MedidorDTO>> GetByIdAsync(Guid id)
    {
        var model = await dbContext.Meters.FindAsync(id)
            ?? throw new BusinessException("Meter no encontrado", "MEDIDOR_NOT_FOUND", 404);
        return ApiResponseDTO<MedidorDTO>.SuccessResult(mapper.Map<MedidorDTO>(model));
    }

    public async Task<ApiResponseDTO<MedidorDTO[]>> GetAllAsync(Guid customerId)
    {
        var data = await dbContext.Meters
            .Include(x => x.MedidorCategoria)
            .Where(x => x.CustomerId == customerId && x.MedidorActivo)
            .OrderBy(x => x.MedidorCategoriaId)
            .ToListAsync();

        return ApiResponseDTO<MedidorDTO[]>.SuccessResult(mapper.Map<MedidorDTO[]>(data));
    }

    public async Task<ApiResponseDTO<MedidorDTO[]>> GetAllInactiveAsync(Guid customerId)
    {
        var data = await dbContext.Meters
            .Where(x => x.CustomerId == customerId && !x.MedidorActivo)
            .OrderBy(x => x.MedidorCategoriaId)
            .ToListAsync();

        return ApiResponseDTO<MedidorDTO[]>.SuccessResult(mapper.Map<MedidorDTO[]>(data));
    }

    public async Task<ApiResponseDTO<Meter>> AddAsync(MedidorAddOrEditDTO DTO)
    {
        DTO.FechaRegistro = DateOnly.FromDateTime(DateTimeExtension.GetMexicoDateOnly());
        var model = mapper.Map<Meter>(DTO);
        dbContext.Meters.Add(model);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<Meter>.SuccessResult(model);
    }

    public async Task<ApiResponseDTO<Meter>> UpdateAsync(Guid id, MedidorAddOrEditDTO DTO)
    {
        var model = mapper.Map<Meter>(DTO);
        model.Id = id;
        dbContext.Meters.Update(model);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<Meter>.SuccessResult(model);
    }

    public async Task<ApiResponseDTO<bool>> DeleteByIdAsync(Guid id)
    {
        var entity = await dbContext.Meters.FindAsync(id)
             ?? throw new BusinessException("Meter no encontrado", "MEDIDOR_NOT_FOUND", 404);

        dbContext.Meters.Remove(entity);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<bool>.SuccessResult(true);
    }
}

