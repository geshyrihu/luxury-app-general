namespace MantenimientoLuxuryApp.RecepcionPipasAgua.Interfaces;
/// <summary>
/// Interfaz para el servicio de control de Recepción de Pipas de Agua.
/// Gestiona el registro, verificación (foto, cantidad, proveedor) y validación de suministro de agua potable mediante carros tanque.
/// </summary>
public interface IRecepcionPipasAguaAppService
{
    /// <summary>Obtiene el detalle de un registro de recepción por su ID.</summary>
    Task<ApiResponseDTO<RecepcionPipaAguaDTO>> GetByIdAsync(Guid id);
    /// <summary>Obtiene el historial completo de recepciones de agua para un condominio.</summary>
    Task<ApiResponseDTO<List<RecepcionPipaAguaDTO>>> GetAllAsync(Guid customerId);
    /// <summary>Registra una nueva recepción de pipa, validando los datos del proveedor y cantidad.</summary>
    Task<ApiResponseDTO<WaterTruckDelivery>> AddAsync(RecepcionPipaAguaAddDTO dto);
    /// <summary>Actualiza la información (ej: foto del ticket) de un registro existente.</summary>
    Task<ApiResponseDTO<WaterTruckDelivery>> UpdateAsync(Guid id, RecepcionPipaAguaUpdateDTO dto);
    /// <summary>Elimina un registro de recepción y su evidencia fotográfica asociada.</summary>
    Task<ApiResponseDTO<bool>> DeleteByIdAsync(Guid id);
}
