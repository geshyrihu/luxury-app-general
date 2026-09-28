using ClosedXML.Excel;
namespace MantenimientoLuxuryApp.SmokeDetectorInventory.Services;
/// <summary>Servicio o componente relacionado con aplicación servicio.</summary>
public class InventarioDetectorHumoAppService(IMapper mapper,
                                              ApplicationDbContext dbContext,
                                              IImageStorageService imgService,
                                              IFileWritePathService fileWritePathService,
                                              IFileReadPathService photoPath) : IInventarioDetectorHumoAppService
{
    /// <summary>Obtiene por identificador.</summary>
    public async Task<ApiResponseDTO<InventarioDetectorHumoAddOrEditDTO>> GetByIdAsync(Guid id)
    {
        var model = await dbContext.SmokeDetectors.FindAsync(id);
        if (model == null) return ApiResponseDTO<InventarioDetectorHumoAddOrEditDTO>.ErrorResult("Detector de humo no encontrado", 404);
        var result = new InventarioDetectorHumoAddOrEditDTO
        {
            CurrentPhoto = photoPath.GetSmokeDetectorPhotoPath(model.CustomerId, model.Photo),
            CustomerId = model.CustomerId,
            ApplicationUserId = model.ApplicationUserId,
            DetectorType = model.DetectorType,
            Location = model.Location,
            LocalCode = model.LocalCode,
        };
        return ApiResponseDTO<InventarioDetectorHumoAddOrEditDTO>.SuccessResult(result);
    }

    /// <summary>Obtiene todas.</summary>
    public async Task<ApiResponseDTO<InventarioDetectorHumoDTO[]>> GetAllAsync(Guid customerId)
    {
        var data = await dbContext.SmokeDetectors
            .Where(x => x.CustomerId == customerId)
            .OrderBy(x => x.Location)
            .ToListAsync();
        return ApiResponseDTO<InventarioDetectorHumoDTO[]>.SuccessResult(mapper.Map<InventarioDetectorHumoDTO[]>(data));
    }

    /// <summary>Agrega .</summary>
    public async Task<ApiResponseDTO<InventarioDetectorHumo>> AddAsync(InventarioDetectorHumoAddOrEditDTO DTO)
    {
        var model = mapper.Map<InventarioDetectorHumo>(DTO);
        if (DTO.Photo != null)
        {
            var path = fileWritePathService.SmokeDetectorDirectory(DTO.CustomerId);
            string nameFile = imgService.Save(DTO.Photo, path);
            model.Photo = nameFile;
        }
        dbContext.SmokeDetectors.Add(model);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<InventarioDetectorHumo>.SuccessResult(model);
    }

    /// <summary>Actualiza .</summary>
    public async Task<ApiResponseDTO<InventarioDetectorHumo>> UpdateAsync(Guid id, InventarioDetectorHumoAddOrEditDTO DTO)
    {
        var entity = await dbContext.SmokeDetectors.FirstOrDefaultAsync(x => x.Id == id);
        if (entity == null) return ApiResponseDTO<InventarioDetectorHumo>.ErrorResult("Detector de humo no encontrado", 404);
        entity = mapper.Map(DTO, entity);
        if (DTO.Photo != null)
        {
            var path = fileWritePathService.SmokeDetectorDirectory(DTO.CustomerId);
            string nameFile = imgService.Save(DTO.Photo, path);
            if (entity.Photo != null)
            {
                await imgService.DeleteAsync(path, entity.Photo);
            }
            entity.Photo = nameFile;
        }
        dbContext.SmokeDetectors.Update(entity);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<InventarioDetectorHumo>.SuccessResult(entity);
    }

    /// <summary>Elimina por identificador.</summary>
    public async Task<ApiResponseDTO<bool>> DeleteByIdAsync(Guid id)
    {
        var data = await dbContext.SmokeDetectors.FindAsync(id);
        if (data == null) return ApiResponseDTO<bool>.ErrorResult("Detector de humo no encontrado", 404);
        var path = fileWritePathService.SmokeDetectorDirectory(data.CustomerId);
        if (data.Photo != null)
        {
            await imgService.DeleteAsync(path, data.Photo);
        }
        dbContext.SmokeDetectors.Remove(data);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<bool>.SuccessResult(true);
    }

    /// <summary>Elimina todas por cliente.</summary>
    public async Task<ApiResponseDTO<bool>> DeleteAllByCustomerAsync(Guid customerId)
    {
        var records = await dbContext.SmokeDetectors
            .Where(x => x.CustomerId == customerId)
            .ToListAsync();

        foreach (var record in records)
        {
            if (record.Photo != null)
            {
                var path = fileWritePathService.SmokeDetectorDirectory(record.CustomerId);
                await imgService.DeleteAsync(path, record.Photo);
            }
            dbContext.SmokeDetectors.Remove(record);
        }

        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<bool>.SuccessResult(true);
    }

    /// <summary>Importa desde.</summary>
    public async Task<ImportPropertiesResultDTO> ImportFromExcelAsync(Guid customerId, IFormFile file)
    {
        var result = new ImportPropertiesResultDTO();

        using var stream = new MemoryStream();
        await file.CopyToAsync(stream);
        stream.Position = 0;

        try
        {
            var workbook = new XLWorkbook(stream);
            var worksheet = workbook.Worksheet(1);
            if (worksheet == null)
            {
                result.Errors.Add("El archivo de Excel está vacío o no contiene hojas de cálculo.");
                return result;
            }

            var rowCount = worksheet.LastRowUsed() is not null
                ? worksheet.LastRowUsed()!.RowNumber()
                : 0;
            if (rowCount <= 1)
            {
                result.Errors.Add("El archivo de Excel no contiene datos, solo el encabezado.");
                return result;
            }

            var existing = await dbContext.SmokeDetectors
                .Where(x => x.CustomerId == customerId)
                .ToListAsync();

            var existingDict = existing
                .GroupBy(x => $"{x.Location?.Trim().ToUpper()}|{x.LocalCode?.Trim().ToUpper()}")
                .ToDictionary(g => g.Key, g => g.First());

            for (int row = 2; row <= rowCount; row++)
            {
                var location = worksheet.Cell(row, 1).GetValue<string>()?.Trim();
                var localCode = worksheet.Cell(row, 2).GetValue<string>()?.Trim();
                var detectorTypeStr = worksheet.Cell(row, 3).GetValue<string>()?.Trim();

                if (string.IsNullOrWhiteSpace(location) || string.IsNullOrWhiteSpace(localCode))
                {
                    result.Errors.Add($"Fila {row}: Las columnas 'Ubicación' y 'Código Local' son obligatorias.");
                    continue;
                }

                SmokeDetectorType detectorType;
                if (string.IsNullOrWhiteSpace(detectorTypeStr) ||
                    !TryParseSmokeDetectorType(detectorTypeStr, out detectorType))
                {
                    result.Errors.Add($"Fila {row}: Tipo de detector '{detectorTypeStr}' no válido. Valores permitidos: Ionización, Óptico (Fotoeléctrico), Térmico, Dual (Ionización + Óptico), Aclimate.");
                    continue;
                }

                var key = $"{location.ToUpper()}|{localCode.ToUpper()}";
                var isNew = !existingDict.TryGetValue(key, out var existingEntity);
                var entity = isNew ? new InventarioDetectorHumo() : existingEntity;

                entity.CustomerId = customerId;
                entity.DetectorType = detectorType;
                entity.Location = location;
                entity.LocalCode = localCode;

                if (isNew)
                {
                    dbContext.SmokeDetectors.Add(entity);
                    result.CreatedCount++;
                }
                else
                {
                    result.UpdatedCount++;
                }
            }

            await dbContext.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            result.Errors.Add($"Error al procesar el archivo: {ex.Message}");
        }

        return result;
    }

    private static bool TryParseSmokeDetectorType(string value, out SmokeDetectorType result)
    {
        foreach (SmokeDetectorType enumValue in Enum.GetValues<SmokeDetectorType>())
        {
            if (enumValue.GetDisplayName().Equals(value, StringComparison.OrdinalIgnoreCase))
            {
                result = enumValue;
                return true;
            }
        }
        if (Enum.TryParse<SmokeDetectorType>(value, ignoreCase: true, out result))
            return true;
        result = default;
        return false;
    }
}
