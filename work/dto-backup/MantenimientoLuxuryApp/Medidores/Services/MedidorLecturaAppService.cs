namespace MantenimientoLuxuryApp.Meters.Services;
/// <summary>
/// Implementación del servicio de gestión de lecturas.
/// Incluye lógica para el cálculo de deltas de consumo diario y mensual, así como el formato de colores para gráficos por tipo de servicio.
/// </summary>
public class MedidorLecturaAppService(ApplicationDbContext dbContext, IMapper mapper) : IMedidorLecturaAppService
{
    /// <summary>
    /// Obtiene una lectura específica de medidor.
    /// </summary>
    public async Task<ApiResponseDTO<MedidorLecturaDTO>> GetByIdAsync(Guid id)
    {
        var model = await dbContext.MeterReadings.FindAsync(id)
            ?? throw new BusinessException("Lectura no encontrada", "LECTURA_NOT_FOUND", 404);
        return ApiResponseDTO<MedidorLecturaDTO>.SuccessResult(mapper.Map<MedidorLecturaDTO>(model));
    }

    public async Task<ApiResponseDTO<MedidorLecturaDTO>> GetUltimaLecturaAsync(Guid medidorId)
    {
        var data = await dbContext.MeterReadings
            .Where(x => x.MedidorId == medidorId)
            .OrderByDescending(x => x.FechaRegistro)
            .ToListAsync();

        if (data.Count == 0)
            return ApiResponseDTO<MedidorLecturaDTO>.SuccessResult(null); // O BusinessException? El original retornaba null. Mantengo null o Success(null).

        var model = await dbContext.MeterReadings.FirstOrDefaultAsync(x => x.Id == data[0].Id);
        return ApiResponseDTO<MedidorLecturaDTO>.SuccessResult(mapper.Map<MedidorLecturaDTO>(model));
    }

    public ApiResponseDTO<MedidorLecturaDTO[]> GetAll(Guid medidorId)
    {
        var data = dbContext.MeterReadings
            .Include(x => x.Meter)
            .ThenInclude(x => x.MedidorCategoria)
            .Where(x => x.MedidorId == medidorId)
            .OrderByDescending(x => x.FechaRegistro)
            .ToList();

        return ApiResponseDTO<MedidorLecturaDTO[]>.SuccessResult(mapper.Map<MedidorLecturaDTO[]>(data));
    }

    public ApiResponseDTO<IEnumerable<MedidorLecturaExcelDTO>> ExportExcel(Guid medidorId)
    {
        var data = dbContext.MeterReadings
            .Where(x => x.MedidorId == medidorId)
            .Select(x => new MedidorLecturaExcelDTO
            {
                FechaRegistro = x.FechaRegistro.ToString("dd/MM/yyyy"),
                Meter = x.Meter.Descripcion,
                NumeroMedidor = x.Meter.NumeroMedidor,
                Lectura = x.Lectura,
            }).ToList();

        return ApiResponseDTO<IEnumerable<MedidorLecturaExcelDTO>>.SuccessResult(data);
    }

    public async Task<ApiResponseDTO<DataSetChart>> DataGraficoDiariaAsync(Guid medidorId, DateTime fechaInicial, DateTime fechaFinal)
    {
        var fechaInicialDate = DateOnly.FromDateTime(fechaInicial);
        var fechaFinalDate = DateOnly.FromDateTime(fechaFinal);

        var lecturas = await dbContext.MeterReadings
            .Where(x => x.MedidorId == medidorId &&
                        x.FechaRegistro >= fechaInicialDate.AddDays(-1) &&
                        x.FechaRegistro <= fechaFinalDate)
            .ToListAsync();

        var medidor = await dbContext.Meters.FirstOrDefaultAsync(x => x.Id == medidorId);

        List<MedidorLecturaCharDTO> resultados = new();
        foreach (var item in lecturas)
        {
            MedidorLecturaCharDTO resultado = new()
            {
                Fecha = item.FechaRegistro.ToString("dd-MMM-yy")
            };
            var fechaAnterior = item.FechaRegistro.AddDays(-1);
            var lecturaAnterior = lecturas.Find(x => x.FechaRegistro == fechaAnterior);

            resultado.Lectura = lecturaAnterior != null ? item.Lectura - lecturaAnterior.Lectura : 0.0m;
            resultados.Add(resultado);
        }

        var remove = resultados.Find(x => x.Fecha == fechaInicialDate.AddDays(-1).ToString("dd-MMM-yy"));
        resultados.Remove(remove);

        List<string> categorias = resultados.Select(x => x.Fecha).ToList();
        List<decimal> series = resultados.Select(x => x.Lectura).ToList();

        string backgroundColor = "";
        string hoverBackgroundColor = "";


        if (medidor?.MedidorCategoriaId == CustomersIdLuxury.MedidorCategoriaGasId)
        {
            backgroundColor = "rgba(212, 172, 13,0.8)";
            hoverBackgroundColor = "rgba(212, 172, 13,0.9)";
        }
        else if (medidor?.MedidorCategoriaId == CustomersIdLuxury.MedidorCategoriaLuzId)
        {
            backgroundColor = "rgba(52, 195, 143, 0.8)";
            hoverBackgroundColor = "rgba(52, 195, 143, 0.9)";
        }
        else if (medidor?.MedidorCategoriaId == CustomersIdLuxury.MedidorCategoriaAguaId)
        {
            backgroundColor = "rgba(46, 134, 193,0.8)";
            hoverBackgroundColor = "rgba(46, 134, 193,0.9)";
        }
        var dataSet = new DataSetChart
        {
            BackgroundColor = backgroundColor,
            HoverBackgroundColor = hoverBackgroundColor,
            Label = medidor?.NumeroMedidor,
            Data = series,
            Labels = categorias,
        };
        return ApiResponseDTO<DataSetChart>.SuccessResult(dataSet);
    }

    public async Task<ApiResponseDTO<DataSetChart>> DataGraficoMensualAsync(Guid medidorId, DateTime fechaInicial, DateTime fechaFinal)
    {
        var fechaInicialDate = DateOnly.FromDateTime(fechaInicial);
        var fechaFinalDate = DateOnly.FromDateTime(fechaFinal);

        var lecturas = await dbContext.MeterReadings
            .Where(x => x.MedidorId == medidorId &&
                        x.FechaRegistro >= fechaInicialDate &&
                        x.FechaRegistro <= fechaFinalDate)
            .ToListAsync();

        var medidor = await dbContext.Meters.FirstOrDefaultAsync(x => x.Id == medidorId);

        List<MedidorLecturaCharMonthDTO> resultados = new();
        foreach (var item in lecturas)
        {
            MedidorLecturaCharMonthDTO resultado = new()
            {
                Fecha = item.FechaRegistro
            };
            var fechaAnterior = item.FechaRegistro.AddDays(-1);
            var lecturaAnterior = lecturas.Find(x => x.FechaRegistro == fechaAnterior);

            resultado.Lectura = lecturaAnterior != null ? item.Lectura - lecturaAnterior.Lectura : 0.0m;
            resultados.Add(resultado);
        }

        var resultadoMes = resultados.GroupBy(x => new { x.Fecha.Month, x.Fecha.Year }).Select(x => new
        {
            fecha = DateTimeExtension.GetDateOnly(x.Key.Year, x.Key.Month, 1).ToString("MMM-yy"),
            lecturas = x.Sum(y => y.Lectura)
        }).ToList();

        List<string> categorias = resultadoMes.Select(x => x.fecha).ToList();
        List<decimal> series = resultadoMes.Select(x => x.lecturas).ToList();

        string backgroundColor = "";
        string hoverBackgroundColor = "";
        if (medidor?.MedidorCategoriaId == CustomersIdLuxury.MedidorCategoriaGasId)
        {
            backgroundColor = "rgba(212, 172, 13,0.8)";
            hoverBackgroundColor = "rgba(212, 172, 13,0.9)";
        }
        else if (medidor?.MedidorCategoriaId == CustomersIdLuxury.MedidorCategoriaLuzId)
        {
            backgroundColor = "rgba(52, 195, 143, 0.8)";
            hoverBackgroundColor = "rgba(52, 195, 143, 0.9)";
        }
        else if (medidor?.MedidorCategoriaId == CustomersIdLuxury.MedidorCategoriaAguaId)
        {
            backgroundColor = "rgba(46, 134, 193,0.8)";
            hoverBackgroundColor = "rgba(46, 134, 193,0.9)";
        }

        var dataSet = new DataSetChart
        {
            BackgroundColor = backgroundColor,
            HoverBackgroundColor = hoverBackgroundColor,
            Label = medidor?.NumeroMedidor,
            Data = series,
            Labels = categorias,
        };
        return ApiResponseDTO<DataSetChart>.SuccessResult(dataSet);
    }

    public async Task<ApiResponseDTO<MeterReading>> AddAsync(MedidorLecturaAddOrEditDTO DTO, bool setFechaRegistro = true)
    {
        if (setFechaRegistro)
            DTO.FechaRegistro = DateOnly.FromDateTime(DateTimeExtension.GetMexicoDateOnly());
        var model = mapper.Map<MeterReading>(DTO);
        dbContext.MeterReadings.Add(model);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<MeterReading>.SuccessResult(model);
    }

    public ApiResponseDTO<bool> VerificarRegistroDelDia(Guid medidorId)
    {
        var date = DateOnly.FromDateTime(DateTimeExtension.GetMexicoDateOnly());
        var registroConFechaActual = dbContext.MeterReadings
            .OrderByDescending(x => x.FechaRegistro)
            .FirstOrDefault(x => x.MedidorId == medidorId);

        if (registroConFechaActual is null)
            return ApiResponseDTO<bool>.SuccessResult(false);

        var result = registroConFechaActual.FechaRegistro == date;
        return ApiResponseDTO<bool>.SuccessResult(result);
    }

    public async Task<ApiResponseDTO<MeterReading>> UpdateAsync(Guid id, MedidorLecturaAddOrEditDTO DTO)
    {
        var model = mapper.Map<MeterReading>(DTO);
        model.Id = id;
        dbContext.MeterReadings.Update(model);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<MeterReading>.SuccessResult(model);
    }

    public async Task<ApiResponseDTO<bool>> DeleteByIdAsync(Guid id)
    {
        var entity = await dbContext.MeterReadings.FindAsync(id)
             ?? throw new BusinessException("Lectura no encontrada", "LECTURA_NOT_FOUND", 404);

        dbContext.MeterReadings.Remove(entity);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<bool>.SuccessResult(true);
    }
}

