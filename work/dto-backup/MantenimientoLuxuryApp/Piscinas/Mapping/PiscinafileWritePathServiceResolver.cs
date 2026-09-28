namespace MantenimientoLuxuryApp.Piscinas.Mapping;

/// <summary>Resolver para URL segura de fotos de piscinas.</summary>
public class PiscinafileWritePathServiceResolver(IFileReadPathService fileReadPathService) : IValueResolver<Pool, PiscinaDTO, string>
{
    /// <summary>Resuelve URL segura de foto.</summary>
    public string Resolve(Pool piscina, PiscinaDTO destination, string member, ResolutionContext context)
         => fileReadPathService.GetPiscinaPhotoPath(piscina.CustomerId, piscina.PathImage);
}
