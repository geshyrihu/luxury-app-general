namespace MantenimientoLuxuryApp.Machinery.Mapping;
/// <summary>Servicio o componente relacionado con mapeador.</summary>
public class MachineryMapper : Profile
{
    public MachineryMapper()
    {
        CreateMap<MachineryFichaTecnicaDTO, Equipment>()
               .ReverseMap()
            .ForMember(dest => dest.PhotoPath, opt => opt.MapFrom<MachineryFichaTecnicaPathResolver>())
            .ForMember(dest => dest.EquipoClasificacion, opt => opt.MapFrom(x => x.EquipoClasificacion.Descripcion))
            .ForMember(dest => dest.DateOfPurchase, opt => opt.MapFrom(x => x.DateOfPurchase.ToString("dd-MM-yyyy")))
            .ForMember(dest => dest.TechnicalSpecifications, opt => opt.MapFrom(x => Regex.Replace(x.TechnicalSpecifications, "<.*?>", string.Empty)))
            .ForMember(dest => dest.Observations, opt => opt.MapFrom(x => Regex.Replace(x.Observations, "<.*?>", string.Empty)));

        CreateMap<MachineryDTO, Equipment>()
            .ReverseMap()
           .ForMember(dest => dest.PhotoPath, opt => opt.MapFrom<MachineryfileWritePathServiceResolver>());

        CreateMap<Equipment, MachineryDetailDTO>().ReverseMap();
        CreateMap<MachineryAddOrEditDTO, Equipment>()
            .ForMember(dest => dest.PhotoPath, options => options.Ignore());

        CreateMap<EquipmentDocument, MachineryDocumentDTO>().ReverseMap();

        CreateMap<ServiceOrder, ListServiceHistoryDTO>()
            .ForMember(dest => dest.TypeMaintance, opt => opt.MapFrom(x => x.TypeMaintance.GetDisplayName()))
            .ForMember(dest => dest.Recurrence, opt => opt.MapFrom(x => x.MaintenanceCalendar != null ? x.MaintenanceCalendar.Recurrence.GetDisplayName() : ""))
            .ForMember(dest => dest.ExecutionDate, opt => opt.MapFrom(x => x.ExecutionDate.HasValue ? x.ExecutionDate.Value.ToString("dd-MM-yyyy") : ""))
            .ForMember(dest => dest.Provider, opt => opt.MapFrom(x => x.MaintenanceCalendar != null && x.MaintenanceCalendar.Provider != null ? x.MaintenanceCalendar.Provider.NameProvider : ""))
            .ForMember(dest => dest.Price, opt => opt.MapFrom(x => x.Price.ToString("C2")))
            .ForMember(dest => dest.EmployeeResponsable, opt => opt.MapFrom(x =>
                x.EmployeeResponsable != null && x.EmployeeResponsable.User != null
                    ? x.EmployeeResponsable.User.FullName : ""));
    }
}
