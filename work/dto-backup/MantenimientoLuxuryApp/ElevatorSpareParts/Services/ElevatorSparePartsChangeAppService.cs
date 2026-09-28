namespace MantenimientoLuxuryApp.ElevatorSpareParts.Services;
/// <summary>
/// Implementación del servicio de gestión de cambios de refacciones en elevadores.
/// </summary>
public class ElevatorSparePartsChangeAppService(ApplicationDbContext dbContext, IMapper mapper) : IElevatorSparePartsChangeAppService
{
    public async Task<ApiResponseDTO<ElevatorSparePartsChangeAddOrEditDTO>> GetByIdAsync(Guid id)
    {
        var entity = await dbContext.ElevatorSparePartsChanges
            .Include(x => x.Customer)
            .Include(x => x.Machinery)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (entity == null)
            return ApiResponseDTO<ElevatorSparePartsChangeAddOrEditDTO>.ErrorResult("Registro no encontrado", 404);

        return ApiResponseDTO<ElevatorSparePartsChangeAddOrEditDTO>.SuccessResult(mapper.Map<ElevatorSparePartsChangeAddOrEditDTO>(entity));
    }

    public async Task<ApiResponseDTO<List<ElevatorSparePartsChangeDTO>>> GetAllAsync(Guid customerId)
    {
        var entities = await dbContext.ElevatorSparePartsChanges
            .Include(x => x.Customer)
            .Include(x => x.Machinery)
            .Where(x => x.CustomerId == customerId)
            .OrderBy(x => x.Folio)
            .ToListAsync();

        return ApiResponseDTO<List<ElevatorSparePartsChangeDTO>>.SuccessResult(mapper.Map<List<ElevatorSparePartsChangeDTO>>(entities));
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
        }).OrderBy(x => x.Label).ToList();

        return ApiResponseDTO<List<SelectItemDTO<Guid>>>.SuccessResult(result);
    }

    public async Task<ApiResponseDTO<ElevatorSparePartsChangeDTO>> AddAsync(ElevatorSparePartsChangeAddOrEditDTO DTO)
    {
        var model = mapper.Map<ElevatorSparePartsChange>(DTO);
        var customer = await dbContext.Customers.FirstOrDefaultAsync(x => x.Id == DTO.CustomerId);
        if (customer == null)
            return ApiResponseDTO<ElevatorSparePartsChangeDTO>.ErrorResult("Cliente no encontrado", 404);

        var count = await dbContext.ElevatorSparePartsChanges.CountAsync(x => x.CustomerId == DTO.CustomerId) + 1;
        string countString = count.ToString("D4");
        string folio = $"{customer.RFC[..3]}-{countString}";
        model.Folio = folio;

        await dbContext.ElevatorSparePartsChanges.AddAsync(model);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<ElevatorSparePartsChangeDTO>.SuccessResult(mapper.Map<ElevatorSparePartsChangeDTO>(model));
    }

    public async Task<ApiResponseDTO<ElevatorSparePartsChangeDTO>> UpdateAsync(Guid id, ElevatorSparePartsChangeAddOrEditDTO DTO)
    {
        var model = mapper.Map<ElevatorSparePartsChange>(DTO);
        if (model is null)
            return ApiResponseDTO<ElevatorSparePartsChangeDTO>.ErrorResult("Datos inválidos", 400);

        var existing = await dbContext.ElevatorSparePartsChanges.FindAsync(id);
        if (existing == null)
            return ApiResponseDTO<ElevatorSparePartsChangeDTO>.ErrorResult("Registro no encontrado", 404);

        mapper.Map(DTO, existing);
        existing.Id = id; // Ensure ID is preserved

        dbContext.ElevatorSparePartsChanges.Update(existing);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<ElevatorSparePartsChangeDTO>.SuccessResult(mapper.Map<ElevatorSparePartsChangeDTO>(existing));
    }

    public async Task<ApiResponseDTO<bool>> DeleteByIdAsync(Guid id)
    {
        var entity = await dbContext.ElevatorSparePartsChanges.FindAsync(id);
        if (entity == null)
            return ApiResponseDTO<bool>.ErrorResult("Registro no encontrado", 404);

        dbContext.ElevatorSparePartsChanges.Remove(entity);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<bool>.SuccessResult(true);
    }
}

