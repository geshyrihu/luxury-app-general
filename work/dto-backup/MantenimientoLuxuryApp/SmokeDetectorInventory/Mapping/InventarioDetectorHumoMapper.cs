namespace MantenimientoLuxuryApp.SmokeDetectorInventory.Mapping;
/// <summary>Servicio o componente relacionado con mapeador.</summary>
public class InventarioDetectorHumoMapper : Profile
{
    public InventarioDetectorHumoMapper()
    {
        CreateMap<InventarioDetectorHumoDTO, InventarioDetectorHumo>()
            .ReverseMap()
            .ForMember(dest => dest.Photo, opt => opt.MapFrom<InventarioDetectorHumofileWritePathServiceResolver>())
            .ForMember(dest => dest.DetectorType, opt => opt.MapFrom(src => src.DetectorType.GetDisplayName()));

        CreateMap<InventarioDetectorHumoAddOrEditDTO, InventarioDetectorHumo>()
            .ForMember(dest => dest.Photo, options => options.Ignore());
    }
}
