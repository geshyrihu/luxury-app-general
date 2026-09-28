namespace MantenimientoLuxuryApp.MachineryAsset.Services;
/// <summary>
/// Implementación del servicio de activos de maquinaria.
/// </summary>
public class MachineryAssetAppService(ApplicationDbContext dbContext) : IMachineryAssetAppService
{
    public async Task<ApiResponseDTO<List<object>>> ListAsync(Guid customerId)
    {
        //var machineryAsset = await dbContext.MachineryAsset
        //    .Include(x => x.Customer)
        //    .Where(x => x.CustomerId == CustomerId && x.IsActive)
        //    .ToListAsync();

        var machineries = await dbContext.Equipment
            .Where(x => x.State == State.Activo && x.CustomerId == customerId && x.InventoryCategory == InventoryCategory.Equipos)
            .ToListAsync();

        //var result = machineries.Select(x => new
        //{
        //    x.Id,
        //    x.Customer?.NameCustomer,
        //    Name = x.NameMachinery,
        //    Location = x.Ubication,
        //    MachineryAsset = machineryAsset.FirstOrDefault(m => m.MachineryBeforeId == x.Id)
        //}).ToList<object>();

        //return result;
        return ApiResponseDTO<List<object>>.SuccessResult(null);
    }
}

