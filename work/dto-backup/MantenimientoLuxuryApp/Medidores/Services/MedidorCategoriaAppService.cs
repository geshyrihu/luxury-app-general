namespace MantenimientoLuxuryApp.Meters.Services;
/// <summary>
/// Implementación del servicio de gestión de categorías para medidores.
/// </summary>
public class MedidorCategoriaAppService(ApplicationDbContext dbContext, IMapper mapper) : IMedidorCategoriaAppService
{
    /// <summary>
    /// Recupera una categoría de medidor mapeada a su DTO de visualización.
    /// </summary>
    public async Task<ApiResponseDTO<MedidorCategoriaDTO>> GetByIdAsync(Guid id)
    {
        var model = await dbContext.MeterCategories.FindAsync(id);
        if (model == null) return ApiResponseDTO<MedidorCategoriaDTO>.ErrorResult("Categoría de medidor no encontrada.");
        return ApiResponseDTO<MedidorCategoriaDTO>.SuccessResult(mapper.Map<MedidorCategoriaDTO>(model));
    }

    public async Task<ApiResponseDTO<MedidorCategoriaDTO[]>> GetAllAsync()
    {
        var data = await dbContext.MeterCategories
            .OrderBy(x => x.NombreMedidorCategoria)
            .ToListAsync();
        return ApiResponseDTO<MedidorCategoriaDTO[]>.SuccessResult(mapper.Map<MedidorCategoriaDTO[]>(data));
    }

    public async Task<ApiResponseDTO<MedidorCategoria>> AddAsync(MedidorCategoriaAddOrEditDTO DTO)
    {
        var model = mapper.Map<MedidorCategoria>(DTO);
        dbContext.MeterCategories.Add(model);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<MedidorCategoria>.SuccessResult(model);
    }

    public async Task<ApiResponseDTO<MedidorCategoria>> UpdateAsync(Guid id, MedidorCategoriaAddOrEditDTO DTO)
    {
        var model = mapper.Map<MedidorCategoria>(DTO);
        model.Id = id;
        dbContext.MeterCategories.Update(model);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<MedidorCategoria>.SuccessResult(model);
    }

    public async Task<ApiResponseDTO<bool>> DeleteByIdAsync(Guid id)
    {
        var entity = await dbContext.MeterCategories.FindAsync(id);
        if (entity == null) return ApiResponseDTO<bool>.ErrorResult("Categoría de medidor no encontrada.");
        dbContext.MeterCategories.Remove(entity);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<bool>.SuccessResult(true, "Categoría de medidor eliminada correctamente.");
    }
}
