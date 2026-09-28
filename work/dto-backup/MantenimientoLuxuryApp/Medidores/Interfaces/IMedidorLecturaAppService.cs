namespace MantenimientoLuxuryApp.Meters.Interfaces;
/// <summary>
/// Interfaz para el servicio de gestión de lecturas de medidores.
/// Encargado del registro diario, histórico, exportación a Excel y generación de datos para gráficos de consumo.
/// </summary>
public interface IMedidorLecturaAppService
{
    /// <summary>Obtiene una lectura específica por su identificador.</summary>
    Task<ApiResponseDTO<MedidorLecturaDTO>> GetByIdAsync(Guid id);
    /// <summary>Obtiene la lectura más reciente registrada para un medidor determinado.</summary>
    Task<ApiResponseDTO<MedidorLecturaDTO>> GetUltimaLecturaAsync(Guid medidorId);
    /// <summary>Obtiene el historial completo de lecturas de un medidor, ordenado por fecha descendente.</summary>
    ApiResponseDTO<MedidorLecturaDTO[]> GetAll(Guid medidorId);
    /// <summary>Genera una colección de datos optimizada para la exportación de lecturas a Excel.</summary>
    ApiResponseDTO<IEnumerable<MedidorLecturaExcelDTO>> ExportExcel(Guid medidorId);
    /// <summary>Obtiene datos de consumo diario calculados (diferencia entre lecturas) para visualización gráfica.</summary>
    Task<ApiResponseDTO<DataSetChart>> DataGraficoDiariaAsync(Guid medidorId, DateTime fechaInicial, DateTime fechaFinal);
    /// <summary>Obtiene datos de consumo mensual agrupados para visualización gráfica.</summary>
    Task<ApiResponseDTO<DataSetChart>> DataGraficoMensualAsync(Guid medidorId, DateTime fechaInicial, DateTime fechaFinal);
    /// <summary>Registra una nueva lectura de medidor, validando opcionalmente la fecha de registro.</summary>
    Task<ApiResponseDTO<MeterReading>> AddAsync(MedidorLecturaAddOrEditDTO DTO, bool setFechaRegistro = true);
    /// <summary>Verifica si ya existe un registro de lectura para el medidor en el día actual.</summary>
    ApiResponseDTO<bool> VerificarRegistroDelDia(Guid medidorId);
    /// <summary>Actualiza una lectura previamente registrada.</summary>
    Task<ApiResponseDTO<MeterReading>> UpdateAsync(Guid id, MedidorLecturaAddOrEditDTO DTO);
    /// <summary>Elimina un registro de lectura de la base de datos.</summary>
    Task<ApiResponseDTO<bool>> DeleteByIdAsync(Guid id);
}
