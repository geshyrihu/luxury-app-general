namespace MantenimientoLuxuryApp.Machinery.Mapping;

/// <summary>Resolver para URL segura de ficha técnica de maquinaria.</summary>
public class MachineryFichaTecnicaPathResolver(IFileReadPathService fileReadPathService) : IValueResolver<Equipment, MachineryFichaTecnicaDTO, string>
{
    /// <summary>Resuelve URL segura de ficha técnica.</summary>
    public string Resolve(Equipment machinery, MachineryFichaTecnicaDTO destination, string member, ResolutionContext context)
         => fileReadPathService.GetMachineryFilePath(machinery.CustomerId, machinery.PhotoPath);
}
