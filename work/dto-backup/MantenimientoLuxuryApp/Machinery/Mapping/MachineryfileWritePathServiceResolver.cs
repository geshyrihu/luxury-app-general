namespace MantenimientoLuxuryApp.Machinery.Mapping;

/// <summary>Resolver para URL segura de fotos de maquinaria.</summary>
public class MachineryfileWritePathServiceResolver(IFileReadPathService fileReadPathService) : IValueResolver<Equipment, MachineryDTO, string>
{
    /// <summary>Resuelve URL segura de foto.</summary>
    public string Resolve(Equipment machinery, MachineryDTO destination, string member, ResolutionContext context)
         => fileReadPathService.GetMachineryFilePath(machinery.CustomerId, machinery.PhotoPath);
}
