namespace MantenimientoLuxuryApp.Machinery.Services;
/// <summary>
/// Implementación central del servicio de inventario de maquinaria.
/// Combina información técnica, fotografías, manuales y el historial operativo (Bitácoras y Órdenes de Servicio).
/// </summary>
public class MachineryAppService(
    ApplicationDbContext dbContext,
    IMapper mapper,
    ISecureFileStorageService fileStorageService,
    IImageStorageService imageRepository,
    IFileWritePathService fileWritePathService,
    IFileReadPathService fileReadPathService,
    ILogger<MachineryAppService> logger) : IMachineryAppService
{

    public async Task<ApiResponseDTO<object>> ListEngineSystemsAsync(Guid customerId)
    {
        var data = await dbContext.Equipment
            .Include(x => x.EquipoClasificacion)
            .Where(x => x.CustomerId == customerId && x.InventoryCategory == InventoryCategory.Equipos)
            .ToListAsync();

        var result = data.GroupBy(x => x.EquipoClasificacion)
            .Select(systemGroup => new
            {
                System = systemGroup.Key.Descripcion,
                Ubications = systemGroup
                    .GroupBy(x => x.Ubication)
                    .Select(ubicationGroup => new
                    {
                        Ubication = ubicationGroup.Key,
                        Items = ubicationGroup.Select(m => new
                        {
                            m.Id,
                            m.NameMachinery,
                            PhotoPath = fileReadPathService.GetMachineryFilePath(customerId, m.PhotoPath),
                            m.InventoryCategory,
                        })
                        .OrderBy(x => x.NameMachinery)
                        .ToList(),
                        Count = ubicationGroup.Count()
                    })
                    .OrderBy(x => x.Ubication)
                    .ToList()
            })
            .OrderBy(x => x.System)
            .ToList();

        return ApiResponseDTO<object>.SuccessResult(result);
    }

    public async Task<ApiResponseDTO<object>> InventarioCompletoAsync(Guid customerId)
    {
        var inventario = await dbContext.Equipment
            .Include(x => x.EquipoClasificacion)
            .Where(x => x.CustomerId == customerId && x.State == State.Activo)
            .OrderBy(x => x.InventoryCategory)
            .ToListAsync();

        var result = inventario
            .GroupBy(x => x.InventoryCategory)
            .Select(x => new
            {
                Categoria = x.Key.GetDisplayName(),
                items = x.Select(m => new
                {
                    m.NameMachinery,
                    Sistema = m.EquipoClasificacion.Descripcion,
                    PhotoPath = fileReadPathService.GetMachineryFilePath(customerId, m.PhotoPath),
                    m.Ubication,
                    m.Brand,
                    m.Serie,
                    m.TechnicalSpecifications,
                    m.Model,
                })
                .OrderBy(m => m.Sistema)
                .ToList()
            })
            .ToList();

        return ApiResponseDTO<object>.SuccessResult(result);
    }

    public async Task<ApiResponseDTO<MachineryDTO>> GetById(Guid id)
    {
        var data = await dbContext.Equipment.FirstOrDefaultAsync(x => x.Id == id);
        if (data == null) return ApiResponseDTO<MachineryDTO>.ErrorResult("Maquinaria no encontrada", 404);

        return ApiResponseDTO<MachineryDTO>.SuccessResult(mapper.Map<MachineryDTO>(data));
    }

    public async Task<ApiResponseDTO<MachineryFichaTecnicaDTO>> GetFichaTecnica(Guid id)
    {
        var data = await dbContext.Equipment.Include(x => x.EquipoClasificacion).FirstOrDefaultAsync(x => x.Id == id);
        if (data == null) return ApiResponseDTO<MachineryFichaTecnicaDTO>.ErrorResult("Ficha técnica no encontrada", 404);
        return ApiResponseDTO<MachineryFichaTecnicaDTO>.SuccessResult(mapper.Map<MachineryFichaTecnicaDTO>(data));
    }

    public async Task<ApiResponseDTO<object>> GetAllCardAsync(Guid customerId, State status, InventoryCategory inventoryCategory)
    {
        var data = await dbContext.Equipment
            .Include(x => x.EquipoClasificacion)
            .Include(x => x.MaintenanceCalendars)
            .Where(x => x.CustomerId == customerId && x.State == status && x.InventoryCategory == inventoryCategory)
            .ToListAsync();

        var result = data.Select(x => new
        {
            x.InventoryCategory,
            x.Id,
            x.NameMachinery,
            EquipoClasificacion = x.EquipoClasificacion.Descripcion,
            PhotoPath = fileReadPathService.GetMachineryFilePath(customerId, x.PhotoPath),
            x.Ubication,
            MaintenanceCalendarsCount = x.MaintenanceCalendars.Count
        })
        .GroupBy(x => x.EquipoClasificacion)
        .Select(g => new
        {
            EquipoClasificacion = g.Key.ToUpper(),
            Machinery = g.ToList()
        })
        .ToList();

        return ApiResponseDTO<object>.SuccessResult(result);
    }


    public async Task<ApiResponseDTO<object>> GetAllAsync(Guid customerId, State status, InventoryCategory inventoryCategory)
    {
        var data = await dbContext.Equipment
            .Include(x => x.EquipoClasificacion)
            .Include(x => x.MaintenanceCalendars)
                .ThenInclude(x => x.Provider)
            .Include(x => x.MaintenanceCalendars)
                .ThenInclude(mc => mc.ServiceOrder) // Include Service Orders
            .Where(x => x.CustomerId == customerId && x.State == status && x.InventoryCategory == inventoryCategory)
            .ToListAsync();

        var result = data.Select(x => new
        {
            x.Id,
            MaintenanceCalendars = x.MaintenanceCalendars.Count,
            x.NameMachinery,
            EquipoClasificacion = x.EquipoClasificacion.Descripcion,
            PhotoPath = fileReadPathService.GetMachineryFilePath(customerId, x.PhotoPath),
            x.Ubication,
            MaintenanceCalendar = x.MaintenanceCalendars.Select(mc => new
            {
                mc.Id,
                mc.MachineryId,
                mc.Activity,
                Month = mc.Month.GetDisplayName(),
                MonthNumber = (mc.Month.HasValue ? (int)mc.Month.Value : 0),
                mc.Price,
                Recurrence = mc.Recurrence.GetDisplayName(),
                mc.Provider.NameProvider,
                HasServiceOrder = mc.ServiceOrder.Any() // Add the flag
            }).OrderBy(mc => mc.MonthNumber).ToList()
        })
        .OrderBy(x => x.EquipoClasificacion)
        .ThenBy(x => x.Ubication)
        .ToList();

        return ApiResponseDTO<object>.SuccessResult(result);
    }

    public async Task<ApiResponseDTO<Equipment>> AddAsync(MachineryAddOrEditDTO DTO)
    {
        if (DTO.Brand == "null") DTO.Brand = null;
        if (DTO.Observations == "null") DTO.Observations = null;
        if (DTO.Model == "null") DTO.Model = null;
        if (DTO.Serie == "null") DTO.Serie = null;

        var entity = mapper.Map<Equipment>(DTO);

        if (DTO.PhotoPath != null)
        {
            string path = fileWritePathService.MachineryDirectory(DTO.CustomerId);
            entity.PhotoPath = imageRepository.Save(DTO.PhotoPath, path, 600, 600);
        }

        dbContext.Equipment.Add(entity);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<Equipment>.SuccessResult(entity);
    }

    public async Task<ApiResponseDTO<SelectItemDTO<Guid>>> GetMachinerySelectItemAsync(Guid id)
    {
        var item = await dbContext.Equipment.FindAsync(id);
        if (item == null) return ApiResponseDTO<SelectItemDTO<Guid>>.ErrorResult("Maquinaria no encontrada", 404);
        return ApiResponseDTO<SelectItemDTO<Guid>>.SuccessResult(new SelectItemDTO<Guid>
        {
            Value = item.Id,
            Label = item.NameMachinery
        });
    }

    public async Task<ApiResponseDTO<Equipment>> UpdateAsync(Guid id, MachineryAddOrEditDTO DTO)
    {
        if (DTO.Brand == "null") DTO.Brand = null;
        if (DTO.Observations == "null") DTO.Observations = null;
        if (DTO.Model == "null") DTO.Model = null;
        if (DTO.Serie == "null") DTO.Serie = null;

        var entity = await dbContext.Equipment.FirstOrDefaultAsync(x => x.Id == id);
        if (entity == null) return ApiResponseDTO<Equipment>.ErrorResult("Maquinaria no encontrada", 404);

        mapper.Map(DTO, entity);

        if (DTO.PhotoPath != null)
        {
            string path = fileWritePathService.MachineryDirectory(DTO.CustomerId);
            string nameFile = imageRepository.Save(DTO.PhotoPath, path, 600, 600);
            if (entity.PhotoPath != null)
            {
                await imageRepository.DeleteAsync(path, entity.PhotoPath);
            }
            entity.PhotoPath = nameFile;
        }

        dbContext.Equipment.Update(entity);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<Equipment>.SuccessResult(entity);
    }

    public async Task<ApiResponseDTO<Equipment>> DeleteAsync(Guid id)
    {
        var entity = await dbContext.Equipment.FindAsync(id);
        if (entity == null) return ApiResponseDTO<Equipment>.ErrorResult("Maquinaria no encontrada", 404);

        await using var transaction = await dbContext.Database.BeginTransactionAsync();
        try
        {
            dbContext.Equipment.Remove(entity);
            await dbContext.SaveChangesAsync();
            await transaction.CommitAsync();
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            logger.LogError(ex, "Error al eliminar maquinaria {Id}", id);
            throw;
        }

        if (entity.PhotoPath != null)
        {
            try
            {
                string path = fileWritePathService.MachineryDirectory(entity.CustomerId);
                await imageRepository.DeleteAsync(path, entity.PhotoPath);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error al eliminar archivo de maquinaria {Id} en {Path}", id, entity.PhotoPath);
            }
        }
        return ApiResponseDTO<Equipment>.SuccessResult(entity);
    }

    public async Task<ApiResponseDTO<object>> UpdateCategoryAsync()
    {
        var items = await dbContext.Equipment.ToListAsync();
        foreach (var item in items)
        {
            item.InventoryCategory = InventoryCategory.Equipos;
            dbContext.Equipment.Update(item);
        }
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<object>.SuccessResult(true);
    }

    public async Task<ApiResponseDTO<bool>> SubirDocumentoAsync(Guid machineryId, IFormFile[] files)
    {
        var entity = await dbContext.Equipment.FirstOrDefaultAsync(x => x.Id == machineryId);
        if (entity == null) return ApiResponseDTO<bool>.ErrorResult("Maquinaria no encontrada", 404);

        string path = fileWritePathService.MachineryDirectory(entity.CustomerId);
        foreach (var file in files)
        {
            var nameFile = await fileStorageService.SaveAsync(file, path);
            EquipmentDocument machineryDocument = new()
            {
                MachineryId = entity.Id,
                Document = nameFile
            };
            dbContext.EquipmentDocuments.Add(machineryDocument);
        }
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<bool>.SuccessResult(true);
    }

    public async Task<ApiResponseDTO<bool>> DeleteDocumentAsync(Guid id)
    {
        var machineryDocument = await dbContext.EquipmentDocuments.FirstOrDefaultAsync(x => x.Id == id);
        if (machineryDocument == null) return ApiResponseDTO<bool>.ErrorResult("Documento de maquinaria no encontrado", 404);
        var entity = await dbContext.Equipment.FirstOrDefaultAsync(x => x.Id == machineryDocument.MachineryId);
        string path = fileWritePathService.MachineryDirectory(entity.CustomerId);

        dbContext.EquipmentDocuments.Remove(machineryDocument);
        await dbContext.SaveChangesAsync();
        fileStorageService.DeleteFile(path, machineryDocument.Document);
        return ApiResponseDTO<bool>.SuccessResult(true);
    }

    public async Task<ApiResponseDTO<object>> GetAutocompeteInvAsync(Guid customerId)
    {
        var data = await dbContext.Equipment
            .Where(x => x.CustomerId == customerId && x.State == State.Activo)
            .ToListAsync();

        var result = data.Select(x => new
        {
            Label = x.NameMachinery,
            Value = x.Id
        }).ToList();
        return ApiResponseDTO<object>.SuccessResult(result);
    }

    public async Task<ApiResponseDTO<MachineryDetailDTO[]>> GetAllMachineryDetailAsync(Guid customerId, State status, InventoryCategory inventoryCategory)
    {
        var data = await dbContext.Equipment
            .Where(x => x.CustomerId == customerId && x.State == status && x.InventoryCategory == inventoryCategory)
            .OrderBy(x => x.State).ThenBy(x => x.NameMachinery)
            .ToListAsync();

        return ApiResponseDTO<MachineryDetailDTO[]>.SuccessResult(mapper.Map<MachineryDetailDTO[]>(data));
    }

    public async Task<ApiResponseDTO<object>> ActasEntregaAsync(Guid customerId)
    {
        var customer = await dbContext.Customers.FindAsync(customerId);
        var data = await dbContext.Equipment
            .Where(x => x.CustomerId == customerId)
            .OrderBy(x => x.InventoryCategory).ThenBy(x => x.Ubication)
            .ToListAsync();

        var result = data.Select(x => new
        {
            LogoCustomer = fileReadPathService.GetCustomerPhotoPath(customer.PhotoPath),
            RazonSocial = customer.NameCustomer,
            Equipo = x.NameMachinery,
            Marca = x.Brand,
            Modelo = x.Model,
            Especificaciones = x.TechnicalSpecifications,
            Ubicacion = x.Ubication,
            FotoEquipo = fileReadPathService.GetMachineryFilePath(customerId, x.PhotoPath),
            Observaciones = x.Observations,
        });
        return ApiResponseDTO<object>.SuccessResult(result);
    }

    public async Task<ApiResponseDTO<object>> InformePdfAsync(Guid customerId, State status, InventoryCategory inventoryCategory)
    {
        var data = await dbContext.Equipment
            .Where(x => x.CustomerId == customerId && x.State == status && x.InventoryCategory == inventoryCategory)
            .OrderBy(x => x.State).ThenBy(x => x.NameMachinery)
            .ToListAsync();

        foreach (var item in data)
        {
            if (item.TechnicalSpecifications is null)
            {
                item.TechnicalSpecifications = "";
                dbContext.Equipment.Update(item);
            }
            if (item.Observations is null)
            {
                item.Observations = "";
                dbContext.Equipment.Update(item);
            }
        }
        await dbContext.SaveChangesAsync();

        var result = data
            .GroupBy(x => x.Ubication)
            .Select(x => new
            {
                Ubication = x.Key,
                Items = x.Select(m => new
                {
                    m.Id,
                    PhotoPath = fileReadPathService.GetMachineryFilePath(customerId, m.PhotoPath),
                    m.NameMachinery,
                    m.Brand,
                    m.DateOfPurchase,
                    m.Observations,
                    m.TechnicalSpecifications,
                    m.Model,
                }).ToList()
            })
            .OrderBy(x => x.Ubication)
            .ToList();
        return ApiResponseDTO<object>.SuccessResult(result);
    }

    public async Task<ApiResponseDTO<List<ListServiceHistoryDTO>>> GetListServiceHistory(Guid machineryId)
    {
        var data = await dbContext.ServiceOrders
            .Include(x => x.Machinery)
            .Include(x => x.MaintenanceCalendar.Provider)
            .Include(x => x.EmployeeResponsable)
                .ThenInclude(x => x.User)
            .Where(x => x.MachineryId == machineryId && x.Status == Status.Concluido)
            .ToListAsync();

        return ApiResponseDTO<List<ListServiceHistoryDTO>>.SuccessResult(mapper.Map<List<ListServiceHistoryDTO>>(data));
    }
}


