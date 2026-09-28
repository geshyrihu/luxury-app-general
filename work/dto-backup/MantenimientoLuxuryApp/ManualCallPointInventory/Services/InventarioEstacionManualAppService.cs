using ClosedXML.Excel;
namespace MantenimientoLuxuryApp.ManualCallPointInventory.Services;
/// <summary>Servicio o componente relacionado con aplicación servicio.</summary>
public class InventarioEstacionManualAppService(IMapper mapper,
                                                ApplicationDbContext dbContext,
                                                IImageStorageService imgService,
                                                IFileWritePathService fileWritePathService,
                                                IFileReadPathService photoPath) : IInventarioEstacionManualAppService
{
    /// <summary>Obtiene por identificador.</summary>
    public async Task<ApiResponseDTO<InventarioEstacionManualAddOrEditDTO>> GetByIdAsync(Guid id)
    {
        var model = await dbContext.ManualCallPoints.FindAsync(id);
        if (model == null) return ApiResponseDTO<InventarioEstacionManualAddOrEditDTO>.ErrorResult("Estación manual no encontrada", 404);
        var result = new InventarioEstacionManualAddOrEditDTO
        {
            CurrentPhoto = photoPath.GetManualCallPointPhotoPath(model.CustomerId, model.Photo),
            CustomerId = model.CustomerId,
            ApplicationUserId = model.ApplicationUserId,
            StationType = model.StationType,
            Location = model.Location,
            LocalCode = model.LocalCode,
        };
        return ApiResponseDTO<InventarioEstacionManualAddOrEditDTO>.SuccessResult(result);
    }

    /// <summary>Obtiene todas.</summary>
    public async Task<ApiResponseDTO<InventarioEstacionManualDTO[]>> GetAllAsync(Guid customerId)
    {
        var data = await dbContext.ManualCallPoints
            .Where(x => x.CustomerId == customerId)
            .OrderBy(x => x.Location)
            .ToListAsync();
        return ApiResponseDTO<InventarioEstacionManualDTO[]>.SuccessResult(mapper.Map<InventarioEstacionManualDTO[]>(data));
    }

    /// <summary>Agrega .</summary>
    public async Task<ApiResponseDTO<InventarioEstacionManual>> AddAsync(InventarioEstacionManualAddOrEditDTO DTO)
    {
        var model = mapper.Map<InventarioEstacionManual>(DTO);
        if (DTO.Photo != null)
        {
            var path = fileWritePathService.ManualCallPointDirectory(DTO.CustomerId);
            string nameFile = imgService.Save(DTO.Photo, path);
            model.Photo = nameFile;
        }
        dbContext.ManualCallPoints.Add(model);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<InventarioEstacionManual>.SuccessResult(model);
    }

    /// <summary>Actualiza .</summary>
    public async Task<ApiResponseDTO<InventarioEstacionManual>> UpdateAsync(Guid id, InventarioEstacionManualAddOrEditDTO DTO)
    {
        var entity = await dbContext.ManualCallPoints.FirstOrDefaultAsync(x => x.Id == id);
        if (entity == null) return ApiResponseDTO<InventarioEstacionManual>.ErrorResult("Estación manual no encontrada", 404);
        entity = mapper.Map(DTO, entity);
        if (DTO.Photo != null)
        {
            var path = fileWritePathService.ManualCallPointDirectory(DTO.CustomerId);
            string nameFile = imgService.Save(DTO.Photo, path);
            if (entity.Photo != null)
            {
                await imgService.DeleteAsync(path, entity.Photo);
            }
            entity.Photo = nameFile;
        }
        dbContext.ManualCallPoints.Update(entity);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<InventarioEstacionManual>.SuccessResult(entity);
    }

    /// <summary>Elimina por identificador.</summary>
    public async Task<ApiResponseDTO<bool>> DeleteByIdAsync(Guid id)
    {
        var data = await dbContext.ManualCallPoints.FindAsync(id);
        if (data == null) return ApiResponseDTO<bool>.ErrorResult("Estación manual no encontrada", 404);
        var path = fileWritePathService.ManualCallPointDirectory(data.CustomerId);
        if (data.Photo != null)
        {
            await imgService.DeleteAsync(path, data.Photo);
        }
        dbContext.ManualCallPoints.Remove(data);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<bool>.SuccessResult(true);
    }

    /// <summary>Elimina todas por cliente.</summary>
    public async Task<ApiResponseDTO<bool>> DeleteAllByCustomerAsync(Guid customerId)
    {
        var records = await dbContext.ManualCallPoints
            .Where(x => x.CustomerId == customerId)
            .ToListAsync();

        foreach (var record in records)
        {
            if (record.Photo != null)
            {
                var path = fileWritePathService.ManualCallPointDirectory(record.CustomerId);
                await imgService.DeleteAsync(path, record.Photo);
            }
            dbContext.ManualCallPoints.Remove(record);
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

            var lastRowUsed = worksheet.LastRowUsed();
            var lastRow = lastRowUsed != null ? lastRowUsed.RowNumber() : 0;
            if (lastRow <= 1)
            {
                result.Errors.Add("El archivo de Excel no contiene datos, solo el encabezado.");
                return result;
            }

            var existing = await dbContext.ManualCallPoints
                .Where(x => x.CustomerId == customerId)
                .ToListAsync();

            var existingDict = existing
                .GroupBy(x => $"{x.Location?.Trim().ToUpper()}|{x.LocalCode?.Trim().ToUpper()}")
                .ToDictionary(g => g.Key, g => g.First());

            for (int row = 2; row <= lastRow; row++)
            {
                var location = worksheet.Cell(row, 1).GetValue<string>()?.Trim();
                var localCode = worksheet.Cell(row, 2).GetValue<string>()?.Trim();
                var stationTypeStr = worksheet.Cell(row, 3).GetValue<string>()?.Trim();

                if (string.IsNullOrWhiteSpace(location) || string.IsNullOrWhiteSpace(localCode))
                {
                    result.Errors.Add($"Fila {row}: Las columnas 'Ubicación' y 'Código Local' son obligatorias.");
                    continue;
                }

                ManualStationType stationType;
                if (string.IsNullOrWhiteSpace(stationTypeStr) ||
                    !TryParseManualStationType(stationTypeStr, out stationType))
                {
                    result.Errors.Add($"Fila {row}: Tipo de estación '{stationTypeStr}' no válido. Valores permitidos: Convencional, Analógica Direccionable, Ruptura de Cristal.");
                    continue;
                }

                var key = $"{location.ToUpper()}|{localCode.ToUpper()}";
                var isNew = !existingDict.TryGetValue(key, out var existingEntity);
                var entity = isNew ? new InventarioEstacionManual() : existingEntity;

                entity.CustomerId = customerId;
                entity.StationType = stationType;
                entity.Location = location;
                entity.LocalCode = localCode;

                if (isNew)
                {
                    dbContext.ManualCallPoints.Add(entity);
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

    private static bool TryParseManualStationType(string value, out ManualStationType result)
    {
        foreach (ManualStationType enumValue in Enum.GetValues<ManualStationType>())
        {
            if (enumValue.GetDisplayName().Equals(value, StringComparison.OrdinalIgnoreCase))
            {
                result = enumValue;
                return true;
            }
        }
        if (Enum.TryParse<ManualStationType>(value, ignoreCase: true, out result))
            return true;
        result = default;
        return false;
    }
}
