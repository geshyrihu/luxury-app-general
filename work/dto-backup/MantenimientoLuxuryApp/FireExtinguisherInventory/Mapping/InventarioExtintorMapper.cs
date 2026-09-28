namespace MantenimientoLuxuryApp.FireExtinguisherInventory.Mapping;
/// <summary>Servicio o componente relacionado con mapeador.</summary>
public class InventarioExtintorMapper : Profile
{
    public InventarioExtintorMapper()
    {
        CreateMap<InventarioExtintorDTO, InventarioExtintor>()
            .ReverseMap()
            .ForMember(dest => dest.Photo, opt => opt.MapFrom<InventarioExtintorfileWritePathServiceResolver>()
            );

        CreateMap<InventarioExtintorAddOrEditDTO, InventarioExtintor>()
            .ForMember(dest => dest.Photo, options => options.Ignore());
    }
}

