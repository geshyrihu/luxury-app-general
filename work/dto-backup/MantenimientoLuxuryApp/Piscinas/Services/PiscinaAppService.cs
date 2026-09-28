namespace MantenimientoLuxuryApp.PiscinasBitacora.Services;
/// <summary>
/// Implementación del servicio de gestión de piscinas.
/// </summary>
public class PiscinaAppService(

    ApplicationDbContext dbContext,
    IMapper mapper,
    IImageStorageService imgService,
    IFileReadPathService fileReadPathService,
    IFileWritePathService fileWritePathService) : IPiscinaAppService
{
    public async Task<ApiResponseDTO<PiscinaDTO>> GetByIdAsync(Guid id)
    {
        var model = await dbContext.Pools.FindAsync(id);
        if (model == null)
            throw new BusinessException("Pool no encontrada.", "NOT_FOUND", 404);

        var mapping = mapper.Map<PiscinaDTO>(model);
        mapping.PathImage = fileReadPathService.GetPiscinaPhotoPath(model.CustomerId, model.PathImage);
        return ApiResponseDTO<PiscinaDTO>.SuccessResult(mapping);
    }

    public async Task<ApiResponseDTO<PiscinaDTO[]>> GetAllAsync(Guid customerId)
    {
        var data = await dbContext.Pools
            .Where(x => x.CustomerId == customerId)
            .OrderBy(x => x.Name)
            .ToListAsync();

        var dtos = mapper.Map<PiscinaDTO[]>(data);
        return ApiResponseDTO<PiscinaDTO[]>.SuccessResult(dtos);
    }

    public async Task<ApiResponseDTO<PiscinaDTO>> AddAsync(PiscinaAddOrEditDTO DTO)
    {
        var entity = mapper.Map<Pool>(DTO);
        if (DTO.PathImage != null)
        {
            string path = fileWritePathService.PiscinaDirectory(DTO.CustomerId);
            entity.PathImage = imgService.Save(DTO.PathImage, path, 600, 600);
        }

        dbContext.Pools.Add(entity);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<PiscinaDTO>.SuccessResult(mapper.Map<PiscinaDTO>(entity));
    }

    public async Task<ApiResponseDTO<PiscinaDTO>> UpdateAsync(Guid id, PiscinaAddOrEditDTO DTO)
    {
        var model = await dbContext.Pools.FirstOrDefaultAsync(x => x.Id == id);
        if (model is null)
            throw new BusinessException("Pool no encontrada para actualizar.", "NOT_FOUND", 404);

        model = mapper.Map(DTO, model);

        if (DTO.PathImage != null)
        {
            string path = fileWritePathService.PiscinaDirectory(DTO.CustomerId);
            string nameFile = imgService.Save(DTO.PathImage, path, 600, 600);
            if (!string.IsNullOrEmpty(model.PathImage))
            {
                await imgService.DeleteAsync(path, model.PathImage);
            }
            model.PathImage = nameFile;
        }

        model.ApplicationUserId = DTO.ApplicationUserId;
        model.Id = id;
        dbContext.Pools.Update(model);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<PiscinaDTO>.SuccessResult(mapper.Map<PiscinaDTO>(model));
    }

    public async Task<ApiResponseDTO<PiscinaDTO>> DeleteAsync(Guid id)
    {
        var model = await dbContext.Pools.FirstOrDefaultAsync(x => x.Id == id);
        if (model is null)
            throw new BusinessException("Pool no encontrada para eliminar.", "NOT_FOUND", 404);

        if (await dbContext.PoolLogs.AnyAsync(x => x.PiscinaId == id))
            throw new BusinessException("No se puede eliminar la alberca porque tiene registros de bitácora asociados.", "HAS_DEPENDENTS", 400);

        if (!string.IsNullOrEmpty(model.PathImage))
        {
            string path = fileWritePathService.PiscinaDirectory(model.CustomerId);
            await imgService.DeleteAsync(path, model.PathImage);
        }
        dbContext.Pools.Remove(model);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<PiscinaDTO>.SuccessResult(mapper.Map<PiscinaDTO>(model));
    }
}
