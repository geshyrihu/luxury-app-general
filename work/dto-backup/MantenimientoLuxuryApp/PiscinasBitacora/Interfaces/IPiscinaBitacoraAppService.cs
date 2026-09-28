namespace MantenimientoLuxuryApp.PiscinasBitacora.Interfaces;
/// <summary>
/// Interfaz para el servicio de bitácora de piscinas.
/// Registra las lecturas químicas (Cloro, pH, temperatura) y mantenimientos diarios realizados en los cuerpos de agua.
/// </summary>
public interface IPiscinaBitacoraAppService
{
    /// <summary>Obtiene un registro específico de la bitácora por su ID.</summary>
    Task<ApiResponseDTO<PiscinaBitacoraDTO>> GetByIdAsync(Guid id);
    /// <summary>Obtiene el historial completo de lecturas para una piscina específica.</summary>
    Task<ApiResponseDTO<PiscinaBitacoraDTO[]>> GetAllAsync(Guid piscinaId);
    /// <summary>Agrega un nuevo registro de lectura química o mantenimiento a la bitácora.</summary>
    Task<ApiResponseDTO<PiscinaBitacoraDTO>> AddAsync(PiscinaBitacoraAddOrEditDTO DTO);
    /// <summary>Actualiza los datos de un registro de bitácora existente.</summary>
    Task<ApiResponseDTO<PiscinaBitacoraDTO>> UpdateAsync(Guid id, PiscinaBitacoraAddOrEditDTO DTO);
    /// <summary>Exporta las lecturas de la bitácora de una alberca a formato Excel (filas).</summary>
    Task<ApiResponseDTO<IEnumerable<PiscinaBitacoraExcelDTO>>> ExportExcelAsync(Guid piscinaId);

    /// <summary>Importa lecturas desde Excel validando duplicados (PiscinaId + Fecha + Hora).</summary>
    Task<ApiResponseDTO<PiscinaBitacoraImportResultDTO>> ImportExcelAsync(Guid piscinaId, string applicationUserId, List<PiscinaBitacoraExcelRowDTO> rows);

    /// <summary>Elimina un registro de la bitácora.</summary>
    Task<ApiResponseDTO<bool>> DeleteByIdAsync(Guid id);
}

