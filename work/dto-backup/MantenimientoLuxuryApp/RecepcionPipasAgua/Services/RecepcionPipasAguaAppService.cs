namespace MantenimientoLuxuryApp.RecepcionPipasAgua.Services;
/// <summary>Servicio o componente relacionado con aplicación servicio.</summary>
public class RecepcionPipasAguaAppService(
    ApplicationDbContext dbContext,
    IImageStorageService imageStorageService,
    IFileWritePathService fileWritePathService,
    IFileReadPathService fileReadPathService
) : IRecepcionPipasAguaAppService
{
    /// <summary>Obtiene por identificador.</summary>
    public async Task<ApiResponseDTO<RecepcionPipaAguaDTO>> GetByIdAsync(Guid id)
    {
        var entity = await dbContext.WaterTruckDeliveries
            .AsNoTracking()
            .Include(x => x.ColaboradorMtto).ThenInclude(e => e.User)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (entity is null)
            return ApiResponseDTO<RecepcionPipaAguaDTO>.ErrorResult("Recepcion de pipa no encontrada", 404);

        return ApiResponseDTO<RecepcionPipaAguaDTO>.SuccessResult(MapToDTO(entity));
    }

    /// <summary>Obtiene todas.</summary>
    public async Task<ApiResponseDTO<List<RecepcionPipaAguaDTO>>> GetAllAsync(Guid customerId)
    {
        var data = await dbContext.WaterTruckDeliveries
            .AsNoTracking()
            .Include(x => x.ColaboradorMtto).ThenInclude(e => e.User)
            .Where(x => x.CustomerId == customerId)
            .OrderByDescending(x => x.HoraLlegada)
            .ToListAsync();

        return ApiResponseDTO<List<RecepcionPipaAguaDTO>>.SuccessResult(data.Select(MapToDTO).ToList());
    }

    /// <summary>Agrega .</summary>
    public async Task<ApiResponseDTO<WaterTruckDelivery>> AddAsync(RecepcionPipaAguaAddDTO dto)
    {
        var path = fileWritePathService.RecepcionPipasAguaDirectory(dto.CustomerId);

        var entity = new WaterTruckDelivery
        {
            CustomerId = dto.CustomerId,
            HoraLlegada = dto.HoraLlegada,
            HoraTermino = dto.HoraTermino,
            PlacasCamion = dto.PlacasCamion,
            Empresa = dto.Empresa,
            CapacidadPipa = dto.CapacidadPipa,
            NivelCisternaAntes = dto.NivelCisternaAntes,
            NivelCisternaDespues = dto.NivelCisternaDespues,
            LecturaMedidorInicial = dto.LecturaMedidorInicial,
            LecturaMedidorFinal = dto.LecturaMedidorFinal,
            CostoMetroCubico = dto.CostoMetroCubico,
            ColaboradorMttoId = dto.ColaboradorMttoId,
            GuardiaSeguridad = dto.GuardiaSeguridad,
        };

        if (dto.FotoPipaLlena != null)
            entity.FotoPipaLlena = imageStorageService.Save(dto.FotoPipaLlena, path);

        if (dto.FotoPipaVacia != null)
            entity.FotoPipaVacia = imageStorageService.Save(dto.FotoPipaVacia, path);

        if (dto.FotoIneChofer != null)
            entity.FotoIneChofer = imageStorageService.Save(dto.FotoIneChofer, path);

        if (dto.FotoPlacas != null)
            entity.FotoPlacas = imageStorageService.Save(dto.FotoPlacas, path);

        if (dto.FotoMedidorAntes != null)
            entity.FotoMedidorAntes = imageStorageService.Save(dto.FotoMedidorAntes, path);

        if (dto.FotoMedidorDespues != null)
            entity.FotoMedidorDespues = imageStorageService.Save(dto.FotoMedidorDespues, path);

        if (dto.FotoNivelAntes != null)
            entity.FotoNivelAntes = imageStorageService.Save(dto.FotoNivelAntes, path);

        if (dto.FotoNivelDespues != null)
            entity.FotoNivelDespues = imageStorageService.Save(dto.FotoNivelDespues, path);

        if (dto.FotoNota != null)
            entity.FotoNota = imageStorageService.Save(dto.FotoNota, path);

        dbContext.WaterTruckDeliveries.Add(entity);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<WaterTruckDelivery>.SuccessResult(entity);
    }

    /// <summary>Actualiza .</summary>
    public async Task<ApiResponseDTO<WaterTruckDelivery>> UpdateAsync(Guid id, RecepcionPipaAguaUpdateDTO dto)
    {
        var entity = await dbContext.WaterTruckDeliveries.FirstOrDefaultAsync(x => x.Id == id);
        if (entity is null)
            return ApiResponseDTO<WaterTruckDelivery>.ErrorResult("Recepcion de pipa no encontrada", 404);

        var path = fileWritePathService.RecepcionPipasAguaDirectory(dto.CustomerId);

        entity.CustomerId = dto.CustomerId;
        entity.HoraLlegada = dto.HoraLlegada;
        entity.HoraTermino = dto.HoraTermino;
        entity.PlacasCamion = dto.PlacasCamion;
        entity.Empresa = dto.Empresa;
        entity.CapacidadPipa = dto.CapacidadPipa;
        entity.NivelCisternaAntes = dto.NivelCisternaAntes;
        entity.NivelCisternaDespues = dto.NivelCisternaDespues;
        entity.LecturaMedidorInicial = dto.LecturaMedidorInicial;
        entity.LecturaMedidorFinal = dto.LecturaMedidorFinal;
        entity.CostoMetroCubico = dto.CostoMetroCubico;
        entity.ColaboradorMttoId = dto.ColaboradorMttoId;
        entity.GuardiaSeguridad = dto.GuardiaSeguridad;

        // Archivo nuevo reemplaza; flag de borrado sin archivo elimina;
        // ninguno de los dos conserva la foto actual.
        async Task<string> ResolveFotoAsync(string actual, IFormFile nueva, bool eliminar)
        {
            if (nueva != null)
            {
                if (!string.IsNullOrEmpty(actual))
                    await imageStorageService.DeleteAsync(path, actual);
                return imageStorageService.Save(nueva, path);
            }

            if (eliminar && !string.IsNullOrEmpty(actual))
            {
                await imageStorageService.DeleteAsync(path, actual);
                return null;
            }

            return actual;
        }

        entity.FotoPipaLlena = await ResolveFotoAsync(
            entity.FotoPipaLlena, dto.FotoPipaLlena, dto.EliminarFotoPipaLlena);
        entity.FotoPipaVacia = await ResolveFotoAsync(
            entity.FotoPipaVacia, dto.FotoPipaVacia, dto.EliminarFotoPipaVacia);
        entity.FotoIneChofer = await ResolveFotoAsync(
            entity.FotoIneChofer, dto.FotoIneChofer, dto.EliminarFotoIneChofer);
        entity.FotoPlacas = await ResolveFotoAsync(
            entity.FotoPlacas, dto.FotoPlacas, dto.EliminarFotoPlacas);
        entity.FotoMedidorAntes = await ResolveFotoAsync(
            entity.FotoMedidorAntes, dto.FotoMedidorAntes, dto.EliminarFotoMedidorAntes);
        entity.FotoMedidorDespues = await ResolveFotoAsync(
            entity.FotoMedidorDespues, dto.FotoMedidorDespues, dto.EliminarFotoMedidorDespues);
        entity.FotoNivelAntes = await ResolveFotoAsync(
            entity.FotoNivelAntes, dto.FotoNivelAntes, dto.EliminarFotoNivelAntes);
        entity.FotoNivelDespues = await ResolveFotoAsync(
            entity.FotoNivelDespues, dto.FotoNivelDespues, dto.EliminarFotoNivelDespues);
        entity.FotoNota = await ResolveFotoAsync(
            entity.FotoNota, dto.FotoNota, dto.EliminarFotoNota);

        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<WaterTruckDelivery>.SuccessResult(entity);
    }

    /// <summary>Elimina por identificador.</summary>
    public async Task<ApiResponseDTO<bool>> DeleteByIdAsync(Guid id)
    {
        var entity = await dbContext.WaterTruckDeliveries.FindAsync(id);
        if (entity is null)
            return ApiResponseDTO<bool>.ErrorResult("Recepcion de pipa no encontrada", 404);

        dbContext.WaterTruckDeliveries.Remove(entity);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<bool>.SuccessResult(true);
    }

    private RecepcionPipaAguaDTO MapToDTO(WaterTruckDelivery x) => new()
    {
        Id = x.Id,
        CustomerId = x.CustomerId,
        HoraLlegada = x.HoraLlegada,
        HoraTermino = x.HoraTermino,
        PlacasCamion = x.PlacasCamion,
        Empresa = x.Empresa,
        CapacidadPipa = x.CapacidadPipa,
        NivelCisternaAntes = x.NivelCisternaAntes,
        NivelCisternaDespues = x.NivelCisternaDespues,
        LecturaMedidorInicial = x.LecturaMedidorInicial,
        LecturaMedidorFinal = x.LecturaMedidorFinal,
        CostoMetroCubico = x.CostoMetroCubico,
        ColaboradorMttoId = x.ColaboradorMttoId?.ToString(),
        ColaboradorMtto = x.ColaboradorMtto?.User?.FullName,
        GuardiaSeguridad = x.GuardiaSeguridad,
        FotoPipaLlenaUrl = string.IsNullOrEmpty(x.FotoPipaLlena)
            ? string.Empty
            : fileReadPathService.GetRecepcionPipasAguaPhotoPath(x.CustomerId, x.FotoPipaLlena),
        FotoPipaVaciaUrl = string.IsNullOrEmpty(x.FotoPipaVacia)
            ? string.Empty
            : fileReadPathService.GetRecepcionPipasAguaPhotoPath(x.CustomerId, x.FotoPipaVacia),
        FotoIneChoferUrl = string.IsNullOrEmpty(x.FotoIneChofer)
            ? string.Empty
            : fileReadPathService.GetRecepcionPipasAguaPhotoPath(x.CustomerId, x.FotoIneChofer),
        FotoPlacasUrl = string.IsNullOrEmpty(x.FotoPlacas)
            ? string.Empty
            : fileReadPathService.GetRecepcionPipasAguaPhotoPath(x.CustomerId, x.FotoPlacas),
        FotoMedidorAntesUrl = string.IsNullOrEmpty(x.FotoMedidorAntes)
            ? string.Empty
            : fileReadPathService.GetRecepcionPipasAguaPhotoPath(x.CustomerId, x.FotoMedidorAntes),
        FotoMedidorDespuesUrl = string.IsNullOrEmpty(x.FotoMedidorDespues)
            ? string.Empty
            : fileReadPathService.GetRecepcionPipasAguaPhotoPath(x.CustomerId, x.FotoMedidorDespues),
        FotoNivelAntesUrl = string.IsNullOrEmpty(x.FotoNivelAntes)
            ? string.Empty
            : fileReadPathService.GetRecepcionPipasAguaPhotoPath(x.CustomerId, x.FotoNivelAntes),
        FotoNivelDespuesUrl = string.IsNullOrEmpty(x.FotoNivelDespues)
            ? string.Empty
            : fileReadPathService.GetRecepcionPipasAguaPhotoPath(x.CustomerId, x.FotoNivelDespues),
        FotoNotaUrl = string.IsNullOrEmpty(x.FotoNota)
            ? string.Empty
            : fileReadPathService.GetRecepcionPipasAguaPhotoPath(x.CustomerId, x.FotoNota),
        CreatedAt = x.CreatedAt,
    };
}
