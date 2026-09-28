namespace MantenimientoLuxuryApp.PiscinasBitacora.Services;
/// <summary>
/// Implementación del servicio de bitácora de piscinas.
/// </summary>
public class PiscinaBitacoraAppService(ApplicationDbContext dbContext, IMapper mapper) : IPiscinaBitacoraAppService
{

    public async Task<ApiResponseDTO<PiscinaBitacoraDTO>> GetByIdAsync(Guid id)

    {

        var model = await dbContext.PoolLogs.FindAsync(id);

        if (model == null)

            return ApiResponseDTO<PiscinaBitacoraDTO>.ErrorResult("Bitácora no encontrada", 404);



        return ApiResponseDTO<PiscinaBitacoraDTO>.SuccessResult(mapper.Map<PiscinaBitacoraDTO>(model));

    }



    public async Task<ApiResponseDTO<PiscinaBitacoraDTO[]>> GetAllAsync(Guid piscinaId)

    {

        var data = await dbContext.PoolLogs

            .Where(x => x.PiscinaId == piscinaId)

            .OrderBy(x => x.Date).ThenBy(x => x.Hour)

            .ToListAsync();



        return ApiResponseDTO<PiscinaBitacoraDTO[]>.SuccessResult(mapper.Map<PiscinaBitacoraDTO[]>(data));

    }



    public async Task<ApiResponseDTO<PiscinaBitacoraDTO>> AddAsync(PiscinaBitacoraAddOrEditDTO DTO)

    {

        if (!await dbContext.Pools.AnyAsync(x => x.Id == DTO.PiscinaId))
            throw new BusinessException("La alberca especificada no existe.", "NOT_FOUND", 404);

        if (await dbContext.PoolLogs.AnyAsync(x => x.PiscinaId == DTO.PiscinaId && x.Date == DTO.Date && x.Hour == DTO.Hour))
            throw new BusinessException("Ya existe un registro de bitácora para esta alberca en la misma fecha y hora.", "DUPLICATE", 409);

        var model = mapper.Map<PoolLog>(DTO);

        dbContext.PoolLogs.Add(model);

        await dbContext.SaveChangesAsync();

        return ApiResponseDTO<PiscinaBitacoraDTO>.SuccessResult(mapper.Map<PiscinaBitacoraDTO>(model));

    }



    public async Task<ApiResponseDTO<PiscinaBitacoraDTO>> UpdateAsync(Guid id, PiscinaBitacoraAddOrEditDTO DTO)

    {

        var existing = await dbContext.PoolLogs.FirstOrDefaultAsync(x => x.Id == id);



        if (existing is null)

            return ApiResponseDTO<PiscinaBitacoraDTO>.ErrorResult("El registro no se encuentra", 404);



        mapper.Map(DTO, existing);

        dbContext.PoolLogs.Update(existing);

        await dbContext.SaveChangesAsync();

        return ApiResponseDTO<PiscinaBitacoraDTO>.SuccessResult(mapper.Map<PiscinaBitacoraDTO>(existing));

    }



    public async Task<ApiResponseDTO<bool>> DeleteByIdAsync(Guid id)

    {

        var entity = await dbContext.PoolLogs.FindAsync(id);

        if (entity is null)

            return ApiResponseDTO<bool>.ErrorResult("Bitácora no encontrada", 404);



        dbContext.PoolLogs.Remove(entity);

        await dbContext.SaveChangesAsync();

        return ApiResponseDTO<bool>.SuccessResult(true);

    }



    public async Task<ApiResponseDTO<IEnumerable<PiscinaBitacoraExcelDTO>>> ExportExcelAsync(Guid piscinaId)
    {
        var data = await dbContext.PoolLogs
            .Where(x => x.PiscinaId == piscinaId)
            .OrderBy(x => x.Date).ThenBy(x => x.Hour)
            .Select(x => new PiscinaBitacoraExcelDTO
            {
                Fecha = x.Date.ToString("dd/MM/yyyy", CultureInfo.InvariantCulture),
                Hora = x.Hour.ToString(@"hh\:mm", CultureInfo.InvariantCulture),
                Cl = x.Cl,
                Ph = x.Ph,
                Alkalinidad = x.Alkalinidad,
                Dureza = x.Dureza,
                Temperatura = x.Temperatura,
                AplicationCl = x.AplicationCl,
                AplicationPhMas = x.AplicationPhMas,
                AplicationPhMenos = x.AplicationPhMenos,
                Cepillado = x.Cepillado,
                Aspirado = x.Aspirado,
                Cenefas = x.Cenefas,
            })
            .ToListAsync();

        return ApiResponseDTO<IEnumerable<PiscinaBitacoraExcelDTO>>.SuccessResult(data);
    }

    public async Task<ApiResponseDTO<PiscinaBitacoraImportResultDTO>> ImportExcelAsync(Guid piscinaId, string applicationUserId, List<PiscinaBitacoraExcelRowDTO> rows)
    {
        var result = new PiscinaBitacoraImportResultDTO();

        if (!await dbContext.Pools.AnyAsync(p => p.Id == piscinaId))
            throw new BusinessException("La alberca especificada no existe.", "NOT_FOUND", 404);

        if (rows is null || rows.Count == 0)
            return ApiResponseDTO<PiscinaBitacoraImportResultDTO>.SuccessResult(result);

        var existingKeys = new HashSet<string>(
            (await dbContext.PoolLogs
                .Where(x => x.PiscinaId == piscinaId)
                .Select(x => new { x.Date, x.Hour })
                .ToListAsync())
            .Select(x => x.Date.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture) + "|" + x.Hour.ToString(@"hh\:mm", CultureInfo.InvariantCulture)));

        var seenInBatch = new HashSet<string>();
        var toInsert = new List<PoolLog>();

        foreach (var row in rows)
        {
            if (!DateOnly.TryParseExact(row.Fecha, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out var date) ||
                !TimeSpan.TryParseExact(row.Hora, @"hh\:mm", CultureInfo.InvariantCulture, out var hour))
            {
                result.Errors.Add($"Fila inválida ({row.Fecha} {row.Hora}): formato de fecha/hora incorrecto (use dd/MM/yyyy y hh:mm).");
                continue;
            }

            if (row.Cl is null || row.Ph is null || row.Temperatura is null)
            {
                result.Errors.Add($"Fila incompleta ({row.Fecha} {row.Hora}): Cl, Ph y Temperatura son obligatorios.");
                continue;
            }

            var key = date.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture) + "|" + hour.ToString(@"hh\:mm", CultureInfo.InvariantCulture);
            if (existingKeys.Contains(key) || !seenInBatch.Add(key))
            {
                result.SkippedDuplicates++;
                result.DuplicateKeys.Add($"{row.Fecha} {row.Hora}");
                continue;
            }

            toInsert.Add(new PoolLog
            {
                PiscinaId = piscinaId,
                Date = date,
                Hour = hour,
                Cl = row.Cl.Value,
                Ph = row.Ph.Value,
                Alkalinidad = row.Alkalinidad,
                Dureza = row.Dureza,
                Temperatura = row.Temperatura.Value,
                AplicationCl = row.AplicationCl ?? 0,
                AplicationPhMas = row.AplicationPhMas ?? 0,
                AplicationPhMenos = row.AplicationPhMenos ?? 0,
                Cepillado = row.Cepillado ?? false,
                Aspirado = row.Aspirado ?? false,
                Cenefas = row.Cenefas ?? false,
                ApplicationUserId = applicationUserId,
            });
        }

        if (toInsert.Count > 0)
        {
            dbContext.PoolLogs.AddRange(toInsert);
            await dbContext.SaveChangesAsync();
            result.Inserted = toInsert.Count;
        }

        return ApiResponseDTO<PiscinaBitacoraImportResultDTO>.SuccessResult(result);
    }

}



