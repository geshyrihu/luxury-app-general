namespace MantenimientoLuxuryApp.ManualCallPointInventory.Mapping;

/// <summary>Resolver para URL segura de fotos de estaciones manuales.</summary>
public class InventarioEstacionManualfileWritePathServiceResolver(IFileReadPathService fileReadPathService) : IValueResolver<InventarioEstacionManual, InventarioEstacionManualDTO, string>
{
    /// <summary>Resuelve URL segura de foto.</summary>
    public string Resolve(InventarioEstacionManual source, InventarioEstacionManualDTO destination, string member, ResolutionContext context)
         => fileReadPathService.GetManualCallPointPhotoPath(source.CustomerId, source.Photo);
}
