namespace MantenimientoLuxuryApp.Meters.Mapping;
/// <summary>Servicio o componente relacionado con mapeador.</summary>
public class MedidorLecturaMapper : Profile
{
    public MedidorLecturaMapper()
    {


        CreateMap<MeterReading, MedidorLecturaDTO>().ReverseMap();
        CreateMap<MedidorLecturaAddOrEditDTO, MeterReading>();

    }
}

