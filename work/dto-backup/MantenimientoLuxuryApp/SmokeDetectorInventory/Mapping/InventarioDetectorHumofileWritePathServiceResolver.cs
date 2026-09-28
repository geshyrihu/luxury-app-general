namespace MantenimientoLuxuryApp.SmokeDetectorInventory.Mapping;

/// <summary>Resolver para URL segura de fotos de detectores de humo.</summary>
public class InventarioDetectorHumofileWritePathServiceResolver(IFileReadPathService fileReadPathService) : IValueResolver<InventarioDetectorHumo, InventarioDetectorHumoDTO, string>
{
    /// <summary>Resuelve URL segura de foto.</summary>
    public string Resolve(InventarioDetectorHumo source, InventarioDetectorHumoDTO destination, string member, ResolutionContext context)
         => fileReadPathService.GetSmokeDetectorPhotoPath(source.CustomerId, source.Photo);
}
