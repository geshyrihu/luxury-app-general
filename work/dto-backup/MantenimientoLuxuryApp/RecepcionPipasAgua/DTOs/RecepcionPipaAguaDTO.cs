#nullable enable
namespace MantenimientoLuxuryApp.RecepcionPipasAgua.DTOs;
/// <summary>Servicio o componente relacionado con DTO.</summary>
public record RecepcionPipaAguaDTO : GuidIdEntityDTO
{
    [Display(Name = "Cliente")]
    // Obtiene o establece cliente identificador.
    public Guid CustomerId { get; set; }

    [Display(Name = "Hora de llegada")]
    // Obtiene o establece .
    public DateTime HoraLlegada { get; set; }

    [Display(Name = "Hora de termino")]
    // Obtiene o establece .
    public DateTime? HoraTermino { get; set; }

    [Display(Name = "Placas del camion")]
    // Obtiene o establece .
    public string PlacasCamion { get; set; } = string.Empty;

    [Display(Name = "Empresa")]
    // Obtiene o establece .
    public string? Empresa { get; set; }

    [Display(Name = "Capacidad de la pipa (litros)")]
    // Obtiene o establece .
    public decimal CapacidadPipa { get; set; }

    [Display(Name = "Nivel cisterna antes")]
    // Obtiene o establece .
    public decimal NivelCisternaAntes { get; set; }

    [Display(Name = "Nivel cisterna despues")]
    // Obtiene o establece .
    public decimal NivelCisternaDespues { get; set; }

    [Display(Name = "Foto pipa llena")]
    // Obtiene o establece .
    public string FotoPipaLlenaUrl { get; set; } = string.Empty;

    [Display(Name = "Foto pipa vacia")]
    // Obtiene o establece .
    public string FotoPipaVaciaUrl { get; set; } = string.Empty;

    [Display(Name = "Foto INE chofer")]
    // Obtiene o establece .
    public string FotoIneChoferUrl { get; set; } = string.Empty;

    [Display(Name = "Lectura medidor inicial")]
    // Obtiene o establece .
    public decimal LecturaMedidorInicial { get; set; }

    [Display(Name = "Lectura medidor final")]
    // Obtiene o establece .
    public decimal LecturaMedidorFinal { get; set; }

    [Display(Name = "Costo por metro cubico")]
    // Obtiene o establece .
    public decimal CostoMetroCubico { get; set; }

    [Display(Name = "Foto nivel antes")]
    // Obtiene o establece .
    public string FotoNivelAntesUrl { get; set; } = string.Empty;

    [Display(Name = "Foto nivel despues")]
    // Obtiene o establece .
    public string FotoNivelDespuesUrl { get; set; } = string.Empty;

    [Display(Name = "Colaborador de mantenimiento")]
    // Obtiene o establece identificador.
    public string? ColaboradorMttoId { get; set; }

    // Obtiene o establece .
    public string? ColaboradorMtto { get; set; }

    [Display(Name = "Guardia de seguridad testigo")]
    // Obtiene o establece .
    public string GuardiaSeguridad { get; set; } = string.Empty;

    [Display(Name = "Foto placas")]
    // Obtiene o establece .
    public string FotoPlacasUrl { get; set; } = string.Empty;

    [Display(Name = "Foto medidor antes")]
    // Obtiene o establece .
    public string FotoMedidorAntesUrl { get; set; } = string.Empty;

    [Display(Name = "Foto medidor despues")]
    // Obtiene o establece .
    public string FotoMedidorDespuesUrl { get; set; } = string.Empty;

    [Display(Name = "Foto nota")]
    // Obtiene o establece .
    public string FotoNotaUrl { get; set; } = string.Empty;

    [Display(Name = "Creado el")]
    // Obtiene o establece .
    public DateTime CreatedAt { get; set; }
}
