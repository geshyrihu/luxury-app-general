namespace MantenimientoLuxuryApp.PiscinasBitacora.Mapping;
/// <summary>
/// Perfil de mapeo para la bitácora de piscinas (PoolLog).
/// Los mapeos residen en su módulo de dominio para evitar acoplamiento cross-módulo
/// (anteriormente vivían en el módulo Pool).
/// </summary>
public class PiscinaBitacoraMapper : Profile
{
    public PiscinaBitacoraMapper()
    {
        CreateMap<PoolLog, PiscinaBitacoraDTO>().ReverseMap();
        CreateMap<PiscinaBitacoraAddOrEditDTO, PoolLog>();
    }
}