namespace MantenimientoLuxuryApp.MaintenanceLogs.DTOs;
/// <summary>Servicio o componente relacionado con agregar o edición DTO.</summary>
public record BitacoraMantenimientoAddOrEditDTO
{
    // Obtiene o establece .
    public bool Emergencia { get; set; }
    // Obtiene o establece identificador.
    public Guid MachineryId { get; set; }
    // Obtiene o establece .
    public string Descripcion { get; set; }

    // Obtiene o establece usuario identificador.
    public string ApplicationUserId { get; set; }
}
