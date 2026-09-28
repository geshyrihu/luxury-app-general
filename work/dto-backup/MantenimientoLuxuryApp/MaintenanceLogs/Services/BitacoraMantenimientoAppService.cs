namespace MantenimientoLuxuryApp.MaintenanceLogs.Services;
/// <summary>
/// Implementación del servicio de bitácora de mantenimiento (Log).
/// </summary>
public class BitacoraMantenimientoAppService(IMapper mapper, ApplicationDbContext dbContext) : IBitacoraMantenimientoAppService
{
    public async Task<ApiResponseDTO<BitacoraMantenimientoDTO>> FindByIdAsync(int id)
    {
        var model = await dbContext.MaintenanceLogs.FindAsync(id);
        if (model == null)
        {
            return ApiResponseDTO<BitacoraMantenimientoDTO>.ErrorResult("No encontrado", ["La bitácora no existe"]);
        }
        var DTO = mapper.Map<BitacoraMantenimientoDTO>(model);
        return ApiResponseDTO<BitacoraMantenimientoDTO>.SuccessResult(DTO);
    }

    public async Task<ApiResponseDTO<List<BitacoraMantenimientoDashboardDTO>>> BitacoraDashboardAsync(Guid customerId, DateTime fechaInicial, DateTime fechaFinal)
    {
        var response = await dbContext.MaintenanceLogs
            .Include(x => x.Machinery)
            .Include(x => x.ApplicationUser)
            .Where(x => x.Machinery.CustomerId == customerId && x.FechaRegistro >= fechaInicial && x.FechaRegistro <= fechaFinal.AddDays(1)).ToListAsync();

        var result = response.Select(x => new BitacoraMantenimientoDashboardDTO
        {
            Id = x.Id,
            Machinery = x.Machinery.NameMachinery,
            FechaRegistro = Convert.ToString(x.FechaRegistro),
            Descripcion = x.Descripcion,
            UserName = $"{x.ApplicationUser.FirstName} {x.ApplicationUser.LastName}",
            ApplicationUserId = x.ApplicationUserId,
        })
        .OrderByDescending(x => x.FechaRegistro)
        .ToList();

        return ApiResponseDTO<List<BitacoraMantenimientoDashboardDTO>>.SuccessResult(result);
    }

    public async Task<ApiResponseDTO<List<BitacoraMantenimientoDTO>>> BitacoraIndividualAsync(Guid machineryId, DateTime fechaInicial, DateTime fechaFinal)
    {
        var response = await dbContext.MaintenanceLogs
                .Include(p => p.ApplicationUser)
                .Where(x => x.MachineryId == machineryId && x.FechaRegistro >= fechaInicial && x.FechaRegistro <= fechaFinal.AddDays(1)).ToListAsync();

        var result = response.Select(x => new BitacoraMantenimientoDTO
        {
            Id = x.Id,
            Machinery = x.Machinery.NameMachinery,
            FechaRegistro = x.FechaRegistro,
            Descripcion = x.Descripcion,
            UserName = $"{x.ApplicationUser.FirstName} {x.ApplicationUser.LastName}",
            ApplicationUserId = x.ApplicationUserId
        })
         .OrderByDescending(x => x.FechaRegistro)
         .ToList();

        return ApiResponseDTO<List<BitacoraMantenimientoDTO>>.SuccessResult(result);
    }

    public async Task<ApiResponseDTO<List<BitacoraMantenimientoDTO>>> GetAllBitacoraMantenimientoDTO(Guid customerId, DateTime fechaInicial, DateTime fechaFinal)
    {
        var response = await dbContext.MaintenanceLogs
               .Include(x => x.Machinery)
               .Include(p => p.ApplicationUser)
               .Where(x => x.Machinery.CustomerId == customerId && x.FechaRegistro >= fechaInicial && x.FechaRegistro <= fechaFinal.AddDays(1)).ToArrayAsync();

        var data = response.Select(x => new BitacoraMantenimientoDTO
        {
            Id = x.Id,
            Machinery = x.Machinery.NameMachinery,
            CustmerId = x.Machinery.CustomerId,
            FechaRegistro = x.FechaRegistro,
            Descripcion = x.Descripcion,
            Emergencia = x.Emergencia,
            UserName = $"{x.ApplicationUser.FirstName} {x.ApplicationUser.LastName}",
            ApplicationUserId = x.ApplicationUserId
        })
          .OrderByDescending(x => x.FechaRegistro)
          .ToList();

        return ApiResponseDTO<List<BitacoraMantenimientoDTO>>.SuccessResult(data);
    }

    public async Task<ApiResponseDTO<MaintenanceLog>> AddAsync(BitacoraMantenimientoAddOrEditDTO DTO)
    {
        var model = mapper.Map<MaintenanceLog>(DTO);
        model.FechaRegistro = DateTime.UtcNow;
        await dbContext.MaintenanceLogs.AddAsync(model);
        await dbContext.SaveChangesAsync();

        return ApiResponseDTO<MaintenanceLog>.SuccessResult(model);
    }

    public async Task<ApiResponseDTO<bool>> DeleteByIdAsync(Guid id)
    {
        var entity = await dbContext.MaintenanceLogs.FindAsync(id);
        if (entity == null)
        {
            return ApiResponseDTO<bool>.ErrorResult("No encontrado", ["El registro no existe"]);
        }
        dbContext.MaintenanceLogs.Remove(entity);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<bool>.SuccessResult(true);
    }
}


