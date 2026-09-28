namespace MantenimientoLuxuryApp.ElevatorEmergencyCall.Services;
/// <summary>
/// Implementación del servicio de gestión de llamadas de emergencia de elevadores.
/// </summary>
public class ElevatorsEmergencyCallAppService(ApplicationDbContext dbContext, IMapper mapper) : IElevatorsEmergencyCallAppService
{
    public async Task<ApiResponseDTO<ElevatorsEmergencyCallAddOrEditDTO>> GetByIdAsync(Guid id)
    {
        var entity = await dbContext.ElevatorsEmergencyCall
            .Include(x => x.Customer)
            .Include(x => x.Machinery)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (entity == null)
            return ApiResponseDTO<ElevatorsEmergencyCallAddOrEditDTO>.ErrorResult("Registro no encontrado", 404);

        return ApiResponseDTO<ElevatorsEmergencyCallAddOrEditDTO>.SuccessResult(mapper.Map<ElevatorsEmergencyCallAddOrEditDTO>(entity));
    }

    public async Task<ApiResponseDTO<List<ElevatorsEmergencyCallDTO>>> GetAllAsync(Guid customerId)
    {
        var entities = await dbContext.ElevatorsEmergencyCall
            .Include(x => x.Customer)
            .Include(x => x.Machinery)
            .Where(x => x.CustomerId == customerId)
            .OrderBy(x => x.Folio)
            .ToListAsync();

        return ApiResponseDTO<List<ElevatorsEmergencyCallDTO>>.SuccessResult(mapper.Map<List<ElevatorsEmergencyCallDTO>>(entities));
    }

    public async Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>> GetElevatorsAsync(Guid customerId)
    {
        var elevators = await dbContext.Equipment
            .Where(x => x.CustomerId == customerId && x.EquipoClasificacionId == CustomersIdLuxury.ClasificasionEquipoElevadoresId)
            .ToListAsync();

        var result = elevators.Select(x => new SelectItemDTO<Guid>
        {
            Value = x.Id,
            Label = x.NameMachinery
        })
        .OrderBy(x => x.Label)
        .ToList();

        return ApiResponseDTO<List<SelectItemDTO<Guid>>>.SuccessResult(result);
    }

    public async Task<ApiResponseDTO<ElevatorsEmergencyCallDTO>> AddAsync(ElevatorsEmergencyCallAddOrEditDTO DTO)
    {
        var model = mapper.Map<ElevatorsEmergencyCall>(DTO);
        await dbContext.ElevatorsEmergencyCall.AddAsync(model);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<ElevatorsEmergencyCallDTO>.SuccessResult(mapper.Map<ElevatorsEmergencyCallDTO>(model));
    }

    public async Task<ApiResponseDTO<ElevatorsEmergencyCallDTO>> UpdateAsync(Guid id, ElevatorsEmergencyCallAddOrEditDTO DTO)
    {
        var model = mapper.Map<ElevatorsEmergencyCall>(DTO);
        if (model is null)
            return ApiResponseDTO<ElevatorsEmergencyCallDTO>.ErrorResult("Datos inválidos", 400);

        var existing = await dbContext.ElevatorsEmergencyCall.FindAsync(id);
        if (existing == null)
            return ApiResponseDTO<ElevatorsEmergencyCallDTO>.ErrorResult("Registro no encontrado", 404);

        mapper.Map(DTO, existing);
        existing.Id = id; // Ensure ID is preserved

        dbContext.ElevatorsEmergencyCall.Update(existing);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<ElevatorsEmergencyCallDTO>.SuccessResult(mapper.Map<ElevatorsEmergencyCallDTO>(existing));
    }

    public async Task<ApiResponseDTO<bool>> DeleteByIdAsync(Guid id)
    {
        var entity = await dbContext.ElevatorsEmergencyCall.FindAsync(id);
        if (entity == null)
            return ApiResponseDTO<bool>.ErrorResult("Registro no encontrado", 404);

        dbContext.ElevatorsEmergencyCall.Remove(entity);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<bool>.SuccessResult(true);
    }
}

