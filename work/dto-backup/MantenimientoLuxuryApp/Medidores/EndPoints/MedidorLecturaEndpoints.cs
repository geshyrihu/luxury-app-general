namespace MantenimientoLuxuryApp.Meters.EndPoints;
/// <summary>Servicio o componente relacionado con fin.</summary>
public sealed class MedidorLecturaEndpoints : IEndPointsModule
{
    /// <summary>Ejecuta la operación de fin.</summary>
    public void MapEndPoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/medidorlectura")
            .RequireAuthorization()
            .AddEndpointFilter<LogUserActivityEndPointsFilter>();

        group.MapGet("{id:guid}", async (Guid id, IMedidorLecturaAppService appService) =>
            TypedResults.Ok(await appService.GetByIdAsync(id)))
            .WithName("GetMedidorLectura")
            .WithMetadata(new LogActivityMetadata("MedidorLectura_GetById", "Consulta de una lectura de medidor por ID."));

        group.MapGet("ultima-lectura/{medidorId:guid}", async (Guid medidorId, IMedidorLecturaAppService appService) =>
            TypedResults.Ok(await appService.GetUltimaLecturaAsync(medidorId)))
            .WithMetadata(new LogActivityMetadata("MedidorLectura_GetLast", "Consulta de la última lectura de un medidor."));

        group.MapGet("list/{medidorId:guid}", (Guid medidorId, IMedidorLecturaAppService appService) =>
            TypedResults.Ok(appService.GetAll(medidorId)))
            .WithMetadata(new LogActivityMetadata("MedidorLectura_GetAll", "Consulta del listado de lecturas de un medidor."));

        group.MapGet("export-excel/{medidorId:guid}", (Guid medidorId, IMedidorLecturaAppService appService) =>
            TypedResults.Ok(appService.ExportExcel(medidorId)))
            .WithMetadata(new LogActivityMetadata("MedidorLectura_ExportExcel", "Exportación a Excel de las lecturas de un medidor."));

        group.MapGet("data-grafico-diaria/{medidorId:guid}/{fechaInical:datetime}/{fechaFinal:datetime}", async (Guid medidorId, DateTime fechaInical, DateTime fechaFinal, IMedidorLecturaAppService appService) =>
            TypedResults.Ok(await appService.DataGraficoDiariaAsync(medidorId, fechaInical, fechaFinal)))
            .WithMetadata(new LogActivityMetadata("MedidorLectura_GetDailyChartData", "Consulta de datos para gráfico diario de lecturas de medidor."));

        group.MapGet("data-grafico-mensual/{medidorId:guid}/{fechaInical:datetime}/{fechaFinal:datetime}", async (Guid medidorId, DateTime fechaInical, DateTime fechaFinal, IMedidorLecturaAppService appService) =>
            TypedResults.Ok(await appService.DataGraficoMensualAsync(medidorId, fechaInical, fechaFinal)))
            .WithMetadata(new LogActivityMetadata("MedidorLectura_GetMonthlyChartData", "Consulta de datos para gráfico mensual de lecturas de medidor."));

        group.MapPost("", async (MedidorLecturaAddOrEditDTO DTO, IMedidorLecturaAppService appService) =>
        {
            var result = await appService.AddAsync(DTO, true);
            return Results.CreatedAtRoute("GetMedidorLectura", new { id = result.Data.Id }, result);
        })
        .WithMetadata(new LogActivityMetadata("MedidorLectura_Add", "Creación de una nueva lectura de medidor."));

        group.MapPost("admin-create-lectura", async (MedidorLecturaAddOrEditDTO DTO, IMedidorLecturaAppService appService) =>
        {
            var result = await appService.AddAsync(DTO, false);
            return Results.CreatedAtRoute("GetMedidorLectura", new { id = result.Data.Id }, result);
        })
        .WithMetadata(new LogActivityMetadata("MedidorLectura_AdminAdd", "Creación de una nueva lectura de medidor por un administrador."));

        group.MapGet("verificar-registro-del-dia/{medidorId:guid}", (Guid medidorId, IMedidorLecturaAppService appService) =>
            TypedResults.Ok(appService.VerificarRegistroDelDia(medidorId)))
            .WithMetadata(new LogActivityMetadata("MedidorLectura_CheckDailyRecord", "Verificación de registro de lectura del día para un medidor."));

        group.MapPut("{id:guid}", async (Guid id, MedidorLecturaAddOrEditDTO DTO, IMedidorLecturaAppService appService) =>
            TypedResults.Ok(await appService.UpdateAsync(id, DTO)))
            .WithMetadata(new LogActivityMetadata("MedidorLectura_Update", "Actualización de una lectura de medidor."));

        group.MapDelete("{id:guid}", async (Guid id, IMedidorLecturaAppService appService) =>
            TypedResults.Ok(await appService.DeleteByIdAsync(id)))
            .WithMetadata(new LogActivityMetadata("MedidorLectura_Delete", "Eliminación de una lectura de medidor."));
    }
}
