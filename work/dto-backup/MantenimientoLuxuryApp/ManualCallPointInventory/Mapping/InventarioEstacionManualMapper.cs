namespace MantenimientoLuxuryApp.ManualCallPointInventory.Mapping;
/// <summary>Servicio o componente relacionado con mapeador.</summary>
public class InventarioEstacionManualMapper : Profile
{
    public InventarioEstacionManualMapper()
    {
        CreateMap<InventarioEstacionManualDTO, InventarioEstacionManual>()
            .ReverseMap()
            .ForMember(dest => dest.Photo, opt => opt.MapFrom<InventarioEstacionManualfileWritePathServiceResolver>())
            .ForMember(dest => dest.StationType, opt => opt.MapFrom(src => src.StationType.GetDisplayName()));

        CreateMap<InventarioEstacionManualAddOrEditDTO, InventarioEstacionManual>()
            .ForMember(dest => dest.Photo, options => options.Ignore());
    }
}
