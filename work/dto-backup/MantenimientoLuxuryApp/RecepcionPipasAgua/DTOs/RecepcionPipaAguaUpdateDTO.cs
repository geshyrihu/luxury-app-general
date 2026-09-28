#nullable enable
namespace MantenimientoLuxuryApp.RecepcionPipasAgua.DTOs;
/// <summary>Servicio o componente relacionado con actualizar DTO.</summary>
public record RecepcionPipaAguaUpdateDTO
{
    [Required(ErrorMessage = "Campo {0} requerido")]
    [Display(Name = "Cliente")]
    // Obtiene o establece cliente identificador.
    public Guid CustomerId { get; set; }

    [Required(ErrorMessage = "Campo {0} requerido")]
    [Display(Name = "Hora de llegada")]
    // Obtiene o establece .
    public DateTime HoraLlegada { get; set; }

    [Display(Name = "Hora de termino")]
    // Obtiene o establece .
    public DateTime? HoraTermino { get; set; }

    [Required(ErrorMessage = "Campo {0} requerido")]
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

    [Display(Name = "Lectura medidor inicial")]
    // Obtiene o establece .
    public decimal LecturaMedidorInicial { get; set; }

    [Display(Name = "Lectura medidor final")]
    // Obtiene o establece .
    public decimal LecturaMedidorFinal { get; set; }

    [Display(Name = "Costo por metro cubico")]
    // Obtiene o establece .
    public decimal CostoMetroCubico { get; set; }

    [Display(Name = "Colaborador de mantenimiento")]
    // Obtiene o establece identificador.
    public Guid? ColaboradorMttoId { get; set; }

    [Display(Name = "Guardia de seguridad testigo")]
    // Obtiene o establece .
    public string GuardiaSeguridad { get; set; } = string.Empty;

    [Display(Name = "Foto pipa llena")]
    // Obtiene o establece .
    public IFormFile? FotoPipaLlena { get; set; }

    [Display(Name = "Foto pipa vacia")]
    // Obtiene o establece .
    public IFormFile? FotoPipaVacia { get; set; }

    [Display(Name = "Foto INE chofer")]
    // Obtiene o establece .
    public IFormFile? FotoIneChofer { get; set; }

    [Display(Name = "Foto placas")]
    // Obtiene o establece .
    public IFormFile? FotoPlacas { get; set; }

    [Display(Name = "Foto medidor antes")]
    // Obtiene o establece .
    public IFormFile? FotoMedidorAntes { get; set; }

    [Display(Name = "Foto medidor despues")]
    // Obtiene o establece .
    public IFormFile? FotoMedidorDespues { get; set; }

    [Display(Name = "Foto nivel antes")]
    // Obtiene o establece .
    public IFormFile? FotoNivelAntes { get; set; }

    [Display(Name = "Foto nivel despues")]
    // Obtiene o establece .
    public IFormFile? FotoNivelDespues { get; set; }

    [Display(Name = "Foto nota")]
    // Obtiene o establece .
    public IFormFile? FotoNota { get; set; }


    [Display(Name = "Eliminar foto pipa llena")]
    // Obtiene o establece .
    public bool EliminarFotoPipaLlena { get; set; }

    [Display(Name = "Eliminar foto pipa vacia")]
    // Obtiene o establece .
    public bool EliminarFotoPipaVacia { get; set; }

    [Display(Name = "Eliminar foto INE chofer")]
    // Obtiene o establece .
    public bool EliminarFotoIneChofer { get; set; }

    [Display(Name = "Eliminar foto placas")]
    // Obtiene o establece .
    public bool EliminarFotoPlacas { get; set; }

    [Display(Name = "Eliminar foto medidor antes")]
    // Obtiene o establece .
    public bool EliminarFotoMedidorAntes { get; set; }

    [Display(Name = "Eliminar foto medidor despues")]
    // Obtiene o establece .
    public bool EliminarFotoMedidorDespues { get; set; }

    [Display(Name = "Eliminar foto nivel antes")]
    // Obtiene o establece .
    public bool EliminarFotoNivelAntes { get; set; }

    [Display(Name = "Eliminar foto nivel despues")]
    // Obtiene o establece .
    public bool EliminarFotoNivelDespues { get; set; }

    [Display(Name = "Eliminar foto nota")]
    // Obtiene o establece .
    public bool EliminarFotoNota { get; set; }
}
