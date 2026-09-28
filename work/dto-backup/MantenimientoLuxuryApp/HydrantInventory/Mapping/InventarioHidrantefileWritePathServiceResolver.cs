namespace MantenimientoLuxuryApp.HydrantInventory.Mapping;

/// <summary>Resolver para URL segura de fotos de hidrantes.</summary>
public class InventarioHidrantefileWritePathServiceResolver(IFileReadPathService fileReadPathService) : IValueResolver<InventarioHidrante, InventarioHidranteDTO, string>
{
    /// <summary>Resuelve URL segura de foto.</summary>
    public string Resolve(InventarioHidrante source, InventarioHidranteDTO destination, string member, ResolutionContext context)
         => fileReadPathService.GetHydrantPhotoPath(source.CustomerId, source.Photo);
}
