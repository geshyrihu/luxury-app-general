namespace MantenimientoLuxuryApp.Meters.Interfaces;
/// <summary>
/// Interfaz para el servicio de gestión de medidores (Gas, Luz, Agua).
/// Administra los dispositivos de medición instalados en las propiedades de los clientes.
/// </summary>
public interface IMedidorAppService
{
    /// <summary>Obtiene la información técnica de un medidor por su ID.</summary>
    Task<ApiResponseDTO<MedidorDTO>> GetByIdAsync(Guid id);
    /// <summary>Obtiene todos los medidores activos asociados a un cliente.</summary>
    Task<ApiResponseDTO<MedidorDTO[]>> GetAllAsync(Guid customerId);
    /// <summary>Obtiene el listado de medidores que han sido marcados como inactivos.</summary>
    Task<ApiResponseDTO<MedidorDTO[]>> GetAllInactiveAsync(Guid customerId);
    /// <summary>Registra un nuevo medidor en el sistema con fecha automática de registro.</summary>
    Task<ApiResponseDTO<Meter>> AddAsync(MedidorAddOrEditDTO DTO);
    /// <summary>Actualiza la información de un medidor existente.</summary>
    Task<ApiResponseDTO<Meter>> UpdateAsync(Guid id, MedidorAddOrEditDTO DTO);
    /// <summary>Elimina un medidor del sistema.</summary>
    Task<ApiResponseDTO<bool>> DeleteByIdAsync(Guid id);
}

