namespace MantenimientoLuxuryApp.MachineryDocument.Interfaces;
/// <summary>
/// Interfaz para el servicio de documentos de maquinaria.
/// Permite gestionar y consultar los manuales, garantías y diagramas anexos a un equipo.
/// </summary>
public interface IMachineryDocumentAppService
{
    /// <summary>Obtiene todos los documentos asociados a una maquinaria específica.</summary>
    Task<ApiResponseDTO<MachineryDocumentDTO[]>> GetAllAsync(Guid machineryId);
}
