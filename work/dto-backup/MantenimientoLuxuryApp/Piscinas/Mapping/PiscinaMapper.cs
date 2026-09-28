using MantenimientoLuxuryApp.Piscinas.Mapping;

namespace MantenimientoLuxuryApp.PiscinasBitacora.Mapping;
/// <summary>Servicio o componente relacionado con mapeador.</summary>
public class PiscinaMapper : Profile
{
    public PiscinaMapper()
    {
        CreateMap<PiscinaDTO, Pool>()
            .ReverseMap()
            .ForMember(dest => dest.PathImage, opt => opt.MapFrom<PiscinafileWritePathServiceResolver>())
            .ForMember(dest => dest.TypePiscina, opt => opt.MapFrom(x => x.TypePiscina.GetDisplayName()));

        CreateMap<PiscinaAddOrEditDTO, Pool>().ReverseMap()
            .ForMember(dest => dest.PathImage, options => options.Ignore());
    }
}
