namespace MantenimientoLuxuryApp.Machinery.Services;
/// <summary>
/// Implementación del servicio de catálogo de clasificación de equipos.
/// </summary>
public class EquipoClasificacionAppService(ApplicationDbContext dbContext, IMapper mapper) : IEquipoClasificacionAppService
{
    public async Task<ApiResponseDTO<EquipoClasificacionDTO>> GetByIdAsync(Guid id)
    {
        var model = await dbContext.EquipmentClassifications.FindAsync(id);
        if (model == null) return ApiResponseDTO<EquipoClasificacionDTO>.ErrorResult("Clasificación de equipo no encontrada.");
        return ApiResponseDTO<EquipoClasificacionDTO>.SuccessResult(mapper.Map<EquipoClasificacionDTO>(model));
    }

    public async Task<ApiResponseDTO<EquipoClasificacionDTO[]>> GetAllAsync()
    {
        var data = await dbContext.EquipmentClassifications
            .OrderBy(x => x.Descripcion)
            .ToListAsync();
        return ApiResponseDTO<EquipoClasificacionDTO[]>.SuccessResult(mapper.Map<EquipoClasificacionDTO[]>(data));
    }

    public async Task<ApiResponseDTO<EquipoClasificacionDTO>> AddAsync(EquipoClasificacionAddOrEditDTO DTO)
    {
        var model = mapper.Map<EquipoClasificacion>(DTO);
        var entity = (await dbContext.EquipmentClassifications.AddAsync(model)).Entity;
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<EquipoClasificacionDTO>.SuccessResult(mapper.Map<EquipoClasificacionDTO>(entity));
    }

    public async Task<ApiResponseDTO<EquipoClasificacionDTO>> UpdateAsync(Guid id, EquipoClasificacionAddOrEditDTO DTO)
    {
        var model = mapper.Map<EquipoClasificacion>(DTO);
        model.Id = id;
        dbContext.EquipmentClassifications.Update(model);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<EquipoClasificacionDTO>.SuccessResult(mapper.Map<EquipoClasificacionDTO>(model));
    }

    public async Task<ApiResponseDTO<bool>> DeleteByIdAsync(Guid id)
    {
        var entity = await dbContext.EquipmentClassifications.FindAsync(id);
        if (entity == null)
            return ApiResponseDTO<bool>.ErrorResult("Clasificación de equipo no encontrada.");
        dbContext.EquipmentClassifications.Remove(entity);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<bool>.SuccessResult(true, "Clasificación de equipo eliminada correctamente.");
    }
}

