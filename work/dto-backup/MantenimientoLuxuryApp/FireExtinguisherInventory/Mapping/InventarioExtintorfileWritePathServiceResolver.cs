namespace MantenimientoLuxuryApp.FireExtinguisherInventory.Mapping;

/// <summary>Resolver para URL segura de fotos de extintores.</summary>
public class InventarioExtintorfileWritePathServiceResolver(IFileReadPathService fileReadPathService) : IValueResolver<InventarioExtintor, InventarioExtintorDTO, string>
{
    /// <summary>Resuelve URL segura de foto.</summary>
    public string Resolve(InventarioExtintor source, InventarioExtintorDTO destination, string member, ResolutionContext context)
         => fileReadPathService.GetExtintorPhotoPath(source.CustomerId, source.Photo);
}
