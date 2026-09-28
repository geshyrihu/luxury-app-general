namespace MantenimientoLuxuryApp.HydrantInventory.Mapping;
/// <summary>Servicio o componente relacionado con mapeador.</summary>
public class InventarioHidranteMapper : Profile
{
    public InventarioHidranteMapper()
    {
        CreateMap<InventarioHidranteDTO, InventarioHidrante>()
            .ReverseMap()
            .ForMember(dest => dest.Photo, opt => opt.MapFrom<InventarioHidrantefileWritePathServiceResolver>())
            .ForMember(dest => dest.HydrantType, opt => opt.MapFrom(src => src.HydrantType.GetDisplayName()));

        CreateMap<InventarioHidranteAddOrEditDTO, InventarioHidrante>()
            .ForMember(dest => dest.Photo, options => options.Ignore());
    }
}
