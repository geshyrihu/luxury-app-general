namespace MantenimientoLuxuryApp.MaintenanceLogs.Mapping;
/// <summary>Servicio o componente relacionado con mapeador.</summary>
public class BitacoraMantenimientoMapper : Profile
{
    public BitacoraMantenimientoMapper()
    {
        CreateMap<BitacoraMantenimientoAddOrEditDTO, MaintenanceLog>();
    }
}
