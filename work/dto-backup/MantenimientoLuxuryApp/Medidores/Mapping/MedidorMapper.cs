namespace MantenimientoLuxuryApp.Meters.Mapping;
/// <summary>Servicio o componente relacionado con mapeador.</summary>
public class MedidorMapper : Profile
{
    public MedidorMapper()
    {
        CreateMap<MedidorDTO, Meter>().ReverseMap();
        CreateMap<MedidorAddOrEditDTO, Meter>();

        CreateMap<MedidorCategoriaDTO, MedidorCategoria>().ReverseMap();
        CreateMap<MedidorCategoriaAddOrEditDTO, MedidorCategoria>();
    }
}
