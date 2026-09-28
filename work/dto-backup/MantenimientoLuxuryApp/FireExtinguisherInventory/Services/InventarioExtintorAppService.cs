namespace MantenimientoLuxuryApp.FireExtinguisherInventory.Services;
/// <summary>
/// Implementación del servicio de gestión del inventario de extintores.
/// Controla imágenes, ubicaciones y vigencias del equipo contra incendios.
/// </summary>
public class InventarioExtintorAppService(IMapper mapper,
                                          ApplicationDbContext dbContext,
                                          IImageStorageService imgService,
                                          IFileWritePathService fileWritePathService,
                                          IFileReadPathService photoPath) : IInventarioExtintorAppService
{
    public async Task<ApiResponseDTO<InventarioExtintorAddOrEditDTO>> GetByIdAsync(Guid id)
    {
        var model = await dbContext.FireExtinguishers.FindAsync(id);
        if (model == null) return ApiResponseDTO<InventarioExtintorAddOrEditDTO>.ErrorResult("Inventario de extintor no encontrado", 404);
        var result = new InventarioExtintorAddOrEditDTO
        {
            CurrentPhoto = photoPath.GetExtintorPhotoPath(model.CustomerId, model.Photo),
            CustomerId = model.CustomerId,
            ApplicationUserId = model.ApplicationUserId,
            ExtinguisherType = model.ExtinguisherType,
            ExpirationDate = model.ExpirationDate,
            Location = model.Location,
            LocalCode = model.LocalCode,
        };
        return ApiResponseDTO<InventarioExtintorAddOrEditDTO>.SuccessResult(result);
    }

    public async Task<ApiResponseDTO<InventarioExtintorDTO[]>> GetAllAsync(Guid customerId)
    {
        var culture = new System.Globalization.CultureInfo("es-MX");
        var entities = await dbContext.FireExtinguishers
            .Where(x => x.CustomerId == customerId)
            .OrderBy(x => x.Location)
            .ToListAsync();
        var data = entities.Select(x => new InventarioExtintorDTO
        {
            Id = x.Id,
            CustomerId = x.CustomerId,
            ExtinguisherType = x.ExtinguisherType.GetDisplayName(),
            ExpirationDate = x.ExpirationDate.ToString("dd-MMM-yy", culture),
            Location = x.Location,
            LocalCode = x.LocalCode,
            Photo = photoPath.GetExtintorPhotoPath(x.CustomerId, x.Photo),
            ApplicationUserId = x.ApplicationUserId,
        }).ToArray();
        return ApiResponseDTO<InventarioExtintorDTO[]>.SuccessResult(data);
    }

    public async Task<ApiResponseDTO<object>> GetAllGroupAsync(Guid customerId)
    {
        var data = await dbContext.FireExtinguishers
            .Where(x => x.CustomerId == customerId)
            .ToListAsync();

        var result = data.GroupBy(x => x.ExtinguisherType).Select(group => new
        {
            Type = group.Key.GetDisplayName(),
            Locations = group.GroupBy(x => x.Location).Select(locationGroup => new
            {
                Location = locationGroup.Key,
                Count = locationGroup.Count(),
                Extinguishers = locationGroup.Select(x => new { x.Id, x.Location })
            })
        });
        return ApiResponseDTO<object>.SuccessResult(result);
    }

    public async Task<ApiResponseDTO<InventarioExtintor>> AddAsync(InventarioExtintorAddOrEditDTO DTO)
    {
        var model = mapper.Map<InventarioExtintor>(DTO);
        if (DTO.Photo != null)
        {
            var path = fileWritePathService.ExtintorDirectory(DTO.CustomerId);
            string nameFile = imgService.Save(DTO.Photo, path);
            model.Photo = nameFile;
        }
        dbContext.FireExtinguishers.Add(model);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<InventarioExtintor>.SuccessResult(model);
    }

    public async Task<ApiResponseDTO<InventarioExtintor>> UpdateAsync(Guid id, InventarioExtintorAddOrEditDTO DTO)
    {
        var entity = await dbContext.FireExtinguishers.FirstOrDefaultAsync(x => x.Id == id);
        if (entity == null) return ApiResponseDTO<InventarioExtintor>.ErrorResult("Inventario de extintor no encontrado", 404);
        entity = mapper.Map(DTO, entity);
        if (DTO.Photo != null)
        {
            var path = fileWritePathService.ExtintorDirectory(DTO.CustomerId);
            string nameFile = imgService.Save(DTO.Photo, path);
            if (entity.Photo != null)
            {
                await imgService.DeleteAsync(path, entity.Photo);
            }
            entity.Photo = nameFile;
        }
        dbContext.FireExtinguishers.Update(entity);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<InventarioExtintor>.SuccessResult(entity);
    }

    public async Task<ApiResponseDTO<bool>> DeleteByIdAsync(Guid id)
    {
        var data = await dbContext.FireExtinguishers.FindAsync(id);
        if (data == null) return ApiResponseDTO<bool>.ErrorResult("Inventario de extintor no encontrado", 404);
        var path = fileWritePathService.ExtintorDirectory(data.CustomerId);
        if (data.Photo != null)
        {
            await imgService.DeleteAsync(path, data.Photo);
        }
        dbContext.FireExtinguishers.Remove(data);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<bool>.SuccessResult(true);
    }
}
