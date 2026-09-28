namespace MantenimientoLuxuryApp.Machinery.Mapping;
/// <summary>Servicio o componente relacionado con mapeador.</summary>
public class ControlPrestamoHerramientaMapper : Profile
{
    public ControlPrestamoHerramientaMapper()
    {


        CreateMap<ControlPrestamoHerramientaDTO, ToolLoan>().ReverseMap()
             .ForMember(dest => dest.ApplicationUser, opt => opt.MapFrom(x => x.ApplicationUser.FullName))
             .ForMember(dest => dest.Tool, opt => opt.MapFrom(x => x.Tool.NameTool));

        CreateMap<ControlPrestamoHerramientaAddOrEditDTO, ToolLoan>().ReverseMap();
    }
}



