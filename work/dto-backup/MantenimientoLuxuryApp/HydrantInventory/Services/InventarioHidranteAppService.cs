namespace MantenimientoLuxuryApp.HydrantInventory.Services;
/// <summary>Servicio o componente relacionado con aplicación servicio.</summary>
public class InventarioHidranteAppService(IMapper mapper,
                                          ApplicationDbContext dbContext,
                                          IImageStorageService imgService,
                                          IFileWritePathService fileWritePathService,
                                          IFileReadPathService photoPath) : IInventarioHidranteAppService
{
    /// <summary>Obtiene por identificador.</summary>
    public async Task<ApiResponseDTO<InventarioHidranteAddOrEditDTO>> GetByIdAsync(Guid id)
    {
        var model = await dbContext.Hydrants.FindAsync(id);
        if (model == null) return ApiResponseDTO<InventarioHidranteAddOrEditDTO>.ErrorResult("Hidrante no encontrado", 404);
        var result = new InventarioHidranteAddOrEditDTO
        {
            CurrentPhoto = photoPath.GetHydrantPhotoPath(model.CustomerId, model.Photo),
            CustomerId = model.CustomerId,
            ApplicationUserId = model.ApplicationUserId,
            HydrantType = model.HydrantType,
            CabinetNumber = model.CabinetNumber,
            Location = model.Location,
            LocalCode = model.LocalCode,
        };
        return ApiResponseDTO<InventarioHidranteAddOrEditDTO>.SuccessResult(result);
    }

    /// <summary>Obtiene todas.</summary>
    public async Task<ApiResponseDTO<InventarioHidranteDTO[]>> GetAllAsync(Guid customerId)
    {
        var data = await dbContext.Hydrants
            .Where(x => x.CustomerId == customerId)
            .OrderBy(x => x.Location)
            .ToListAsync();
        return ApiResponseDTO<InventarioHidranteDTO[]>.SuccessResult(mapper.Map<InventarioHidranteDTO[]>(data));
    }

    /// <summary>Agrega .</summary>
    public async Task<ApiResponseDTO<InventarioHidrante>> AddAsync(InventarioHidranteAddOrEditDTO DTO)
    {
        var model = mapper.Map<InventarioHidrante>(DTO);
        if (DTO.Photo != null)
        {
            var path = fileWritePathService.HydrantDirectory(DTO.CustomerId);
            string nameFile = imgService.Save(DTO.Photo, path);
            model.Photo = nameFile;
        }
        dbContext.Hydrants.Add(model);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<InventarioHidrante>.SuccessResult(model);
    }

    /// <summary>Actualiza .</summary>
    public async Task<ApiResponseDTO<InventarioHidrante>> UpdateAsync(Guid id, InventarioHidranteAddOrEditDTO DTO)
    {
        var entity = await dbContext.Hydrants.FirstOrDefaultAsync(x => x.Id == id);
        if (entity == null) return ApiResponseDTO<InventarioHidrante>.ErrorResult("Hidrante no encontrado", 404);
        entity = mapper.Map(DTO, entity);
        if (DTO.Photo != null)
        {
            var path = fileWritePathService.HydrantDirectory(DTO.CustomerId);
            string nameFile = imgService.Save(DTO.Photo, path);
            if (entity.Photo != null)
            {
                await imgService.DeleteAsync(path, entity.Photo);
            }
            entity.Photo = nameFile;
        }
        dbContext.Hydrants.Update(entity);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<InventarioHidrante>.SuccessResult(entity);
    }

    /// <summary>Elimina por identificador.</summary>
    public async Task<ApiResponseDTO<bool>> DeleteByIdAsync(Guid id)
    {
        var data = await dbContext.Hydrants.FindAsync(id);
        if (data == null) return ApiResponseDTO<bool>.ErrorResult("Hidrante no encontrado", 404);
        var path = fileWritePathService.HydrantDirectory(data.CustomerId);
        if (data.Photo != null)
        {
            await imgService.DeleteAsync(path, data.Photo);
        }
        dbContext.Hydrants.Remove(data);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<bool>.SuccessResult(true);
    }
}
