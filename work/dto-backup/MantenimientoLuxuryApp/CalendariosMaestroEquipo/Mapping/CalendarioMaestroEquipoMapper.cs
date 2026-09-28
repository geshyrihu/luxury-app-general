namespace MantenimientoLuxuryApp.CalendariosMaestroEquipo.Mapping;
/// <summary>Servicio o componente relacionado con mapeador.</summary>
public class CalendarioMaestroEquipoMapper : Profile
{
    public CalendarioMaestroEquipoMapper()
    {
        CreateMap<CalendarioMaestroEquipoDTO, MasterCalendarEquipment>().ReverseMap()
              .ForMember(dest => dest.EquipoClasificacion, opt => opt.MapFrom(x => x.EquipoClasificacion.Descripcion));

        CreateMap<CalendarioMaestroEquipoAddOrEditDTO, MasterCalendarEquipment>();

    }
}
