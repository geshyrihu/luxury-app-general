namespace MantenimientoLuxuryApp.CalendariosMaestroEquipo.Services;

public class CalendarioMaestroAppService(ApplicationDbContext dbContext) : ICalendarioMaestroAppService
{
    public async Task<ApiResponseDTO<CalendarioMaestroAddOrEditDTO>> GetAsyncByIdAsync(Guid id)
    {
        var model = await dbContext.MasterCalendars
                             .Include(x => x.MasterCalendarProvider)
                             .ThenInclude(x => x.Provider)
                             .FirstOrDefaultAsync(x => x.Id == id);

        if (model is null)
        {
            throw new BusinessException($"MasterCalendar with ID {id} not found.", "CALENDAR_NOT_FOUND", (int)HttpStatusCode.NotFound);
        }

        var DTO = new CalendarioMaestroAddOrEditDTO()
        {
            CalendarioMaestroEquipoId = model.CalendarioMaestroEquipoId,
            Mes = model.Mes,
            DescripcionServicio = model.DescripcionServicio,
            Observaciones = model.Observaciones,
            Proveedores = model.MasterCalendarProvider.Select(x => x.ProviderId).ToList(),
        };

        return ApiResponseDTO<CalendarioMaestroAddOrEditDTO>.SuccessResult(DTO);
    }

    public async Task<ApiResponseDTO<object>> GetAllAsync()
    {
        // Verificamos si hay algún registro con Mes = 0
        bool hayMesCero = await dbContext.MasterCalendars.AnyAsync(x => x.Mes == 0);

        if (hayMesCero)
        {
            // Si hay al menos un registro con Mes = 0, incrementamos todos los meses en +1
            var registrosActualizar = await dbContext.MasterCalendars.ToListAsync();
            foreach (var registro in registrosActualizar)
            {
                registro.Mes += 1; // Incrementamos el mes en 1
            }
            dbContext.MasterCalendars.UpdateRange(registrosActualizar);
            await dbContext.SaveChangesAsync();
        }

        // Recuperamos los datos después de la posible actualización
        var calendarioMaestro = await dbContext.MasterCalendars
            .Include(x => x.MasterCalendarEquipment)
            .ThenInclude(x => x.EquipoClasificacion)
            .Include(x => x.MasterCalendarProvider)
            .ThenInclude(x => x.Provider)
            .ToListAsync();

        // Agrupamos los resultados y formateamos la salida
        var result = calendarioMaestro.GroupBy(x => new
        {
            Index = x.Mes,
            MonthName = x.Mes.GetDisplayName(),
            Month = x.Mes
        })
        .Select(x => new
        {
            x.Key.Index,
            x.Key.MonthName,
            x.Key.Month,
            Items = x.Select(x => new
            {
                x.Id,
                x.DescripcionServicio,
                x.MasterCalendarEquipment.NombreEquipo,
                x.Observaciones,
                Proveedores = x.MasterCalendarProvider.Select(x => new
                {
                    x.Provider.Id,
                    x.Provider.NameComercial,
                    x.Provider.NameProvider
                })
            })
        })
        .OrderBy(x => x.Index)
        .ToList();

        return ApiResponseDTO<object>.SuccessResult(result);
    }

    public async Task<ApiResponseDTO<MasterCalendar>> AddAsync(CalendarioMaestroAddOrEditDTO DTO)
    {
        var model = new MasterCalendar()
        {
            CalendarioMaestroEquipoId = DTO.CalendarioMaestroEquipoId,
            DescripcionServicio = DTO.DescripcionServicio,
            Mes = DTO.Mes,
            Observaciones = DTO.Observaciones,
        };

        await dbContext.MasterCalendars.AddAsync(model);
        await dbContext.SaveChangesAsync(); // Necesario para obtener el ID generado

        foreach (var providerId in DTO.Proveedores)
        {
            var calendarioProveedor = new MasterCalendarProvider()
            {
                CalendarioMaestroId = model.Id,
                ProviderId = providerId
            };

            await dbContext.MasterCalendarProviders.AddAsync(calendarioProveedor);
        }
        await dbContext.SaveChangesAsync();

        return ApiResponseDTO<MasterCalendar>.SuccessResult(model);
    }

    public async Task<ApiResponseDTO<MasterCalendar>> UpdateAsync(Guid id, CalendarioMaestroAddOrEditDTO DTO)
    {
        var model = await dbContext.MasterCalendars.FirstOrDefaultAsync(x => x.Id == id);

        if (model is null)
        {
            throw new BusinessException($"MasterCalendar with ID {id} not found.", "CALENDAR_NOT_FOUND", (int)HttpStatusCode.NotFound);
        }

        model.CalendarioMaestroEquipoId = DTO.CalendarioMaestroEquipoId;
        model.DescripcionServicio = DTO.DescripcionServicio;
        model.Mes = DTO.Mes;
        model.Observaciones = DTO.Observaciones;

        dbContext.MasterCalendars.Update(model);

        var proveedoresActuales = await dbContext.MasterCalendarProviders
            .Where(x => x.CalendarioMaestroId == model.Id)
            .ToListAsync();

        foreach (var item in proveedoresActuales)
        {
            // Si el proveedor actual no viene en la nueva lista, se elimina
            if (!DTO.Proveedores.Contains(item.ProviderId))
            {
                dbContext.MasterCalendarProviders.Remove(item);
            }
        }

        foreach (var providerId in DTO.Proveedores)
        {
            var existe = proveedoresActuales.Find(x => x.ProviderId == providerId);
            if (existe is null)
            {
                await dbContext.MasterCalendarProviders.AddAsync(new MasterCalendarProvider()
                {
                    CalendarioMaestroId = model.Id,
                    ProviderId = providerId
                });
            }
        }
        await dbContext.SaveChangesAsync();

        return ApiResponseDTO<MasterCalendar>.SuccessResult(model);
    }

    public async Task<ApiResponseDTO<int>> DeleteAsync(Guid id)
    {
        var model = await dbContext.MasterCalendars
            .Include(x => x.MasterCalendarProvider)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (model is null)
        {
            throw new BusinessException($"MasterCalendar with ID {id} not found.", "CALENDAR_NOT_FOUND", (int)HttpStatusCode.NotFound);
        }

        var providersCount = model.MasterCalendarProvider.Count();
        dbContext.MasterCalendarProviders.RemoveRange(model.MasterCalendarProvider);
        dbContext.MasterCalendars.Remove(model);
        await dbContext.SaveChangesAsync();

        return ApiResponseDTO<int>.SuccessResult(providersCount);
    }
}