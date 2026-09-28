namespace MantenimientoLuxuryApp.MaintenanceLogs.DTOs;
/// <summary>Servicio o componente relacionado con DTO.</summary>
public record BitacoraMantenimientoDTO : GuidIdEntityDTO
{
    // Obtiene o establece .
    public string Machinery { get; set; }
    // Obtiene o establece .
    public bool Emergencia { get; set; }
    // Obtiene o establece .
    public DateTime FechaRegistro { get; set; }
    // Obtiene o establece .
    public string Descripcion { get; set; }
    // Obtiene o establece usuario identificador.
    public string ApplicationUserId { get; set; }
    // Obtiene o establece usuario nombre.
    public string UserName { get; set; }
    // Obtiene o establece identificador.
    public Guid CustmerId { get; set; }
}
