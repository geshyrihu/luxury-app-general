namespace MantenimientoLuxuryApp.Machinery.Mapping;
/// <summary>Servicio o componente relacionado con mapeador.</summary>
public class EquipoClasificacionMapper : Profile
{
    public EquipoClasificacionMapper()
    {
        CreateMap<EquipoClasificacion, EquipoClasificacionDTO>().ReverseMap();
        CreateMap<EquipoClasificacionAddOrEditDTO, EquipoClasificacion>();
    }
}

