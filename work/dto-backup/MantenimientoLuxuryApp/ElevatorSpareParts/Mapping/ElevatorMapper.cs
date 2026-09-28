namespace MantenimientoLuxuryApp.ElevatorSpareParts.Mapping;
/// <summary>Servicio o componente relacionado con mapeador.</summary>
public class ElevatorMapper : Profile
{
    public ElevatorMapper()
    {

        CreateMap<ElevatorSparePartsChange, ElevatorSparePartsChangeDTO>()
            .ForMember(dest => dest.ChangeDate, opt => opt.MapFrom(x => x.ChangeDate.ToString("dd-MMM-yy")))
            .ForMember(dest => dest.Machinery, opt => opt.MapFrom(x => x.Machinery.NameMachinery));

        CreateMap<ElevatorSparePartsChangeAddOrEditDTO, ElevatorSparePartsChange>().ReverseMap();


        CreateMap<ElevatorsEmergencyCall, ElevatorsEmergencyCallDTO>()
            .ForMember(dest => dest.RequestDate, opt => opt.MapFrom(x => x.RequestDate.ToString("dd-MMM-yy")))
            .ForMember(dest => dest.RequestDateFilter, opt => opt.MapFrom(x => x.RequestDate.ToDateTime(TimeOnly.MinValue)))
            .ForMember(dest => dest.Machinery, opt => opt.MapFrom(x => x.Machinery.NameMachinery));
        CreateMap<ElevatorsEmergencyCallAddOrEditDTO, ElevatorsEmergencyCall>().ReverseMap();

    }
}

