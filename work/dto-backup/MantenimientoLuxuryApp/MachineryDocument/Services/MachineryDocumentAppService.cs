namespace MantenimientoLuxuryApp.MachineryDocument.Services;
/// <summary>
/// Implementación del servicio de gestión de documentos (PDF, garantías) asociados a maquinaria.
/// </summary>
public class MachineryDocumentAppService(ApplicationDbContext dbContext, IMapper mapper) : IMachineryDocumentAppService
{
    public async Task<ApiResponseDTO<MachineryDocumentDTO[]>> GetAllAsync(Guid machineryId)
    {
        var data = await dbContext.EquipmentDocuments
            .Where(x => x.MachineryId == machineryId)
            .ToListAsync();

        if (data == null || data.Count == 0)
            return ApiResponseDTO<MachineryDocumentDTO[]>.SuccessResult(Array.Empty<MachineryDocumentDTO>());

        return ApiResponseDTO<MachineryDocumentDTO[]>.SuccessResult(mapper.Map<MachineryDocumentDTO[]>(data));
    }
}

