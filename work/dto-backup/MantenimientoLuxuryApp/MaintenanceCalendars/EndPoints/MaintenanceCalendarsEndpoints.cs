namespace MantenimientoLuxuryApp.MaintenanceCalendars.EndPoints;
/// <summary>Servicio o componente relacionado con fin.</summary>
public sealed class MaintenanceCalendarsEndpoints : IEndPointsModule
{
    /// <summary>Ejecuta la operación de fin.</summary>
    public void MapEndPoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/maintenance-calendars")
                       .RequireAuthorization()
                       .AddEndpointFilter<LogUserActivityEndPointsFilter>();

        // GET: api/maintenance-calendars/get/{id}
        group.MapGet("get/{id:guid}", async (Guid id, IMaintenanceCalendarAppService appService) =>
            TypedResults.Ok(await appService.GetByIdAsync(id)))
            .WithName("GetMaintenanceCalendar")
            .WithMetadata(new LogActivityMetadata("MaintenanceCalendar_GetById", "Consulta de registro de calendario de mantenimiento por ID."));

        // GET: api/maintenance-calendars/list-service/{machineryId}
        group.MapGet("list-service/{machineryId:guid}", async (Guid machineryId, IMaintenanceCalendarAppService appService) =>
            TypedResults.Ok(await appService.ListServiceAsync(machineryId)))
            .WithMetadata(new LogActivityMetadata("MaintenanceCalendar_ListService", "Lista de servicios programados de una maquinaria."));

        // GET: api/maintenance-calendars/of-machinery/{machineryId}
        group.MapGet("of-machinery/{machineryId:guid}", async (Guid machineryId, IMaintenanceCalendarAppService appService) =>
            TypedResults.Ok(await appService.GetOfMachineryAsync(machineryId)))
            .WithMetadata(new LogActivityMetadata("MaintenanceCalendar_GetOfMachinery", "Calendario de mantenimientos de un equipo."));

        // GET: api/maintenance-calendars/list/{customerId}/{month}
        group.MapGet("list/{customerId:guid}/{month:int}", async (Guid customerId, Month month, IMaintenanceCalendarAppService appService) =>
            TypedResults.Ok(await appService.GetAllAsync(customerId, month)))
            .WithMetadata(new LogActivityMetadata("MaintenanceCalendar_GetAll", "Listado de mantenimientos programados filtrado por mes."));

        // POST: api/maintenance-calendars
        group.MapPost("", async (MaintenanceCalendarAddOrEditDTO dto, IMaintenanceCalendarAppService appService) =>
            TypedResults.Ok(await appService.AddAsync(dto)))
            .WithMetadata(new LogActivityMetadata("MaintenanceCalendar_Add", "Programación de nuevo mantenimiento."));

        // PUT: api/maintenance-calendars/{id}
        group.MapPut("{id:guid}", async (Guid id, MaintenanceCalendarAddOrEditDTO dto, IMaintenanceCalendarAppService appService) =>
            TypedResults.Ok(await appService.UpdateAsync(id, dto)))
            .WithMetadata(new LogActivityMetadata("MaintenanceCalendar_Update", "Actualización de mantenimiento programado."));

        // DELETE: api/maintenance-calendars/{id}
        group.MapDelete("{id:guid}", async (Guid id, IMaintenanceCalendarAppService appService) =>
            TypedResults.Ok(await appService.DeleteByIdAsync(id)))
            .WithMetadata(new LogActivityMetadata("MaintenanceCalendar_Delete", "Eliminación de registro de calendario de mantenimiento."));

        // GET: api/maintenance-calendars/general-mantenimiento/{customerId}/{providerId}
        group.MapGet("general-mantenimiento/{customerId:guid}/{providerId:guid}", async (Guid customerId, Guid providerId, IMaintenanceCalendarAppService appService) =>
            TypedResults.Ok(await appService.GeneralMantenimientoAsync(customerId, providerId)))
            .WithMetadata(new LogActivityMetadata("MaintenanceCalendar_GeneralMantenimiento", "Resumen general de mantenimientos por cliente y proveedor."));

        // GET: api/maintenance-calendars/proveedores-calendario/{customerId}
        group.MapGet("proveedores-calendario/{customerId:guid}", async (Guid customerId, IMaintenanceCalendarAppService appService) =>
            TypedResults.Ok(await appService.ProveedoresCalendarioAsync(customerId)))
            .WithMetadata(new LogActivityMetadata("MaintenanceCalendar_ProveedoresCalendario", "Proveedores con mantenimientos en calendario."));

        // GET: api/maintenance-calendars/cronograma-anual/{customerId}/{filterId?}
        group.MapGet("cronograma-anual/{customerId:guid}", async (Guid customerId, IMaintenanceCalendarAppService appService) =>
            TypedResults.Ok(await appService.CronogramaAnualAsync(customerId, null)))
            .WithMetadata(new LogActivityMetadata("MaintenanceCalendar_CronogramaAnual", "Cronograma anual de mantenimientos."));

        group.MapGet("cronograma-anual/{customerId:guid}/{filterId:int}", async (Guid customerId, int filterId, IMaintenanceCalendarAppService appService) =>
            TypedResults.Ok(await appService.CronogramaAnualAsync(customerId, filterId)))
            .WithMetadata(new LogActivityMetadata("MaintenanceCalendar_CronogramaAnual", "Cronograma anual de mantenimientos filtrado."));

        group.MapGet("cronograma-anual-pdf-status/{customerId:guid}", async (Guid customerId, int? year, int? filterId, IMaintenanceCalendarAppService appService) =>
            TypedResults.Ok(await appService.GetCronogramaAnualPdfStatusAsync(customerId, filterId, year)))
            .WithMetadata(new LogActivityMetadata("MaintenanceCalendar_CronogramaAnualPdfStatus", "Cronograma anual para PDF con estado de órdenes de servicio."));

        // GET: api/maintenance-calendars/export-calendar/{customerId}
        group.MapGet("export-calendar/{customerId:guid}", async (Guid customerId, IMaintenanceCalendarAppService appService) =>
            TypedResults.Ok(await appService.ExportCalendarAsync(customerId)))
            .WithMetadata(new LogActivityMetadata("MaintenanceCalendar_ExportCalendar", "Exportación de calendario de mantenimientos."));

        // GET: api/maintenance-calendars/resumen-gastos/{customerId}
        group.MapGet("resumen-gastos/{customerId:guid}", async (Guid customerId, IMaintenanceCalendarAppService appService) =>
            TypedResults.Ok(await appService.GetResumenGastosAsync(customerId)))
            .WithMetadata(new LogActivityMetadata("MaintenanceCalendar_ResumenGastos", "Resumen de gastos proyectados vs reales."));

        // GET: api/maintenance-calendars/resumen/{customerId}
        group.MapGet("resumen/{customerId:guid}", async (Guid customerId, IMaintenanceCalendarAppService appService) =>
            TypedResults.Ok(await appService.GetResumenAsync(customerId)))
            .WithMetadata(new LogActivityMetadata("MaintenanceCalendar_Resumen", "Indicadores clave de cumplimiento del calendario."));
    }
}
