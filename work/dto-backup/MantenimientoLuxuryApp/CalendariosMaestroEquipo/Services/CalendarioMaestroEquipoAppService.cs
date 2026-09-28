namespace MantenimientoLuxuryApp.CalendariosMaestroEquipo.Services;
/// <summary>Servicio o componente relacionado con aplicación servicio.</summary>
public class CalendarioMaestroEquipoAppService(ApplicationDbContext dbContext, IMapper mapper) : ICalendarioMaestroEquipoAppService
{
    /// <summary>Obtiene por identificador.</summary>
    public async Task<ApiResponseDTO<CalendarioMaestroEquipoDTO>> GetByIdAsync(Guid id)
    {
        var model = await dbContext.MasterCalendarEquipment
            .FirstOrDefaultAsync(x => x.Id == id);

        if (model is null)
            return ApiResponseDTO<CalendarioMaestroEquipoDTO>.ErrorResult("Equipo no encontrado", 404);

        var DTO = mapper.Map<CalendarioMaestroEquipoDTO>(model);
        return ApiResponseDTO<CalendarioMaestroEquipoDTO>.SuccessResult(DTO);
    }

    /// <summary>Obtiene todas.</summary>
    public async Task<ApiResponseDTO<CalendarioMaestroEquipoDTO[]>> GetAllAsync()
    {
        var data = await dbContext.MasterCalendarEquipment
            .Include(x => x.EquipoClasificacion)
            .ToListAsync();

        return ApiResponseDTO<CalendarioMaestroEquipoDTO[]>.SuccessResult(mapper.Map<CalendarioMaestroEquipoDTO[]>(data));
    }

    /// <summary>Agrega .</summary>
    public async Task<ApiResponseDTO<MasterCalendarEquipment>> AddAsync(CalendarioMaestroEquipoAddOrEditDTO DTO)
    {
        var entity = mapper.Map<MasterCalendarEquipment>(DTO);
        await dbContext.MasterCalendarEquipment.AddAsync(entity);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<MasterCalendarEquipment>.SuccessResult(entity);
    }

    /// <summary>Actualiza .</summary>
    public async Task<ApiResponseDTO<MasterCalendarEquipment>> UpdateAsync(Guid id, CalendarioMaestroEquipoAddOrEditDTO DTO)
    {
        var existingModel = await dbContext.MasterCalendarEquipment.FindAsync(id);
        if (existingModel == null)
        {
            return ApiResponseDTO<MasterCalendarEquipment>.ErrorResult("MasterCalendarEquipment no encontrado", 404);
        }

        var model = mapper.Map(DTO, existingModel);
        model.Id = id;

        dbContext.MasterCalendarEquipment.Update(model);
        await dbContext.SaveChangesAsync();

        return ApiResponseDTO<MasterCalendarEquipment>.SuccessResult(model);
    }

    /// <summary>Elimina por identificador.</summary>
    public async Task<ApiResponseDTO<bool>> DeleteByIdAsync(Guid id)
    {
        var entity = await dbContext.MasterCalendarEquipment.FindAsync(id);
        if (entity == null)
        {
            return ApiResponseDTO<bool>.ErrorResult("MasterCalendarEquipment no encontrado", 404);
        }
        dbContext.MasterCalendarEquipment.Remove(entity);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<bool>.SuccessResult(true);
    }
}