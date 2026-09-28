namespace MantenimientoLuxuryApp.MaintenanceCalendars.Mapping;
/// <summary>Servicio o componente relacionado con mapeador.</summary>
public class MaintenanceCalendarMapper : Profile
{
    public MaintenanceCalendarMapper()
    {

        CreateMap<MaintenanceCalendarIndexDTO, MaintenanceCalendar>().ReverseMap()
                 .ForMember(dest => dest.Provider, opt => opt.MapFrom(x => x.Provider.NameProvider))
                 .ForMember(dest => dest.Machinery, opt => opt.MapFrom(x => x.Machinery.NameMachinery));

        CreateMap<MaintenanceCalendar, MaintenanceCalendarAddOrEditDTO>().ReverseMap();

        CreateMap<MaintenanceCalendarDTO, MaintenanceCalendar>().ReverseMap()
            .ForMember(dest => dest.Month, resp => resp.MapFrom(x => x.Month.GetDisplayName()))
               .ForMember(dest => dest.ProviderId, options => options.Ignore())
               .ForMember(dest => dest.AccountingCatalog, options => options.Ignore())
               .ForMember(dest => dest.MachineryId, options => options.Ignore());

        CreateMap<MaintenanceCalendarListDTO, MaintenanceCalendar>().ReverseMap();


    }
}

