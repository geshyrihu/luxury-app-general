namespace MantenimientoLuxuryApp.MaintenanceCalendars.Services;
/// <summary>
/// Implementación del servicio de programación y control del calendario de mantenimiento preventivo.
/// Integra la planificación operativa con el módulo de proyecciones financieras para impactar el flujo de caja.
/// </summary>
public class MaintenanceCalendarAppService(
    ApplicationDbContext dbContext,
    IMapper mapper,
    IFileReadPathService pathService,
    IProjectedExpenseRealTimeService projectedExpenseRealTime,
    IHttpContextAccessor httpContextAccessor) : IMaintenanceCalendarAppService
{
    private string GetExcludedConnectionId() => httpContextAccessor.HttpContext?.Request.Headers["X-Connection-Id"];
    public async Task<ApiResponseDTO<MaintenanceCalendarDTO>> GetByIdAsync(Guid id)
    {
        var data = await dbContext.MaintenanceCalendars
            .Include(x => x.AccountingCatalog)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (data is null) return ApiResponseDTO<MaintenanceCalendarDTO>.ErrorResult("No encontrado", ["El calendario no existe"]);

        SelectItemDTO<Guid> provider = new();
        SelectItemDTO<Guid> machiney = new();
        SelectItemDTO<Guid> cuenta = new();
        if (data.AccountingCatalogId != null)
        {
            cuenta.Value = data.AccountingCatalogId.Value;
            cuenta.Label = data.AccountingCatalog.DescripcionCuenta;
        }
        var providerResult = await dbContext.Providers.FindAsync(data.ProviderId);
        provider.Value = providerResult?.Id ?? Guid.Empty;
        provider.Label = providerResult?.NameProvider ?? "";
        var machineryResult = await dbContext.Equipment.FindAsync(data.MachineryId);
        machiney.Value = machineryResult?.Id ?? Guid.Empty;
        machiney.Label = machineryResult?.NameMachinery ?? "";

        var result = mapper.Map<MaintenanceCalendarDTO>(data);
        result.ProviderId = provider;
        result.MachineryId = machiney;
        result.AccountingCatalog = cuenta;
        return ApiResponseDTO<MaintenanceCalendarDTO>.SuccessResult(result);
    }

    public async Task<ApiResponseDTO<MaintenanceCalendarDTO[]>> GetOfMachineryAsync(Guid machineryId)
    {
        var data = await dbContext.MaintenanceCalendars
            .Where(x => x.MachineryId == machineryId)
            .OrderBy(x => x.Month)
            .ToListAsync();

        return ApiResponseDTO<MaintenanceCalendarDTO[]>.SuccessResult(mapper.Map<MaintenanceCalendarDTO[]>(data));
    }

    public async Task<ApiResponseDTO<List<object>>> GetAllAsync(Guid customerId, Month month)
    {
        var data = await dbContext.MaintenanceCalendars
            .Include(x => x.Machinery)
            .Include(x => x.Provider)
            .Include(x => x.ServiceOrder) // Include ServiceOrder
            .Where(x => x.Machinery.State == State.Activo &&
                        x.Machinery.CustomerId == customerId &&
                        x.Month == month)
            .ToListAsync();

        var result = data.Select(x => new
        {
            Nombre = x.Machinery.NameMachinery,
            Actividad = x.Activity,
            Provider = x.Provider.NameComercial,
            Recurrencia = x.Recurrence.GetDisplayName(),
            InventoryCategory = x.Machinery.InventoryCategory.GetDisplayName(),
            Precio = x.Price,
            x.Id,
            FechaServicio = x.Month.GetDisplayName(),
            FechaServicioFiltro = x.Month,
            HasServiceOrder = x.ServiceOrder.Any() // Add the flag
        }).OrderBy(x => x.InventoryCategory).ToList<object>();

        return ApiResponseDTO<List<object>>.SuccessResult(result);
    }

    public async Task<ApiResponseDTO<List<MaintenanceCalendarListDTO>>> ListServiceAsync(Guid machineryId)
    {
        var data = await dbContext.MaintenanceCalendars
            .Where(x => x.MachineryId == machineryId)
            .OrderBy(x => x.Month)
            .ToListAsync();

        return ApiResponseDTO<List<MaintenanceCalendarListDTO>>.SuccessResult(mapper.Map<List<MaintenanceCalendarListDTO>>(data));
    }

    public async Task<ApiResponseDTO<MaintenanceCalendar>> AddAsync(MaintenanceCalendarAddOrEditDTO DTO)
    {
        var initialMonth = DTO.Month ?? Month.Enero;
        var targetMonths = CalculateRecurrenceMonths(initialMonth, DTO.Recurrence);

        var existingEntries = await dbContext.MaintenanceCalendars
            .Where(mc => mc.MachineryId == DTO.MachineryId && targetMonths.Contains(mc.Month.Value))
            .Select(mc => mc.Month.Value)
            .ToListAsync();

        var monthsToAdd = targetMonths.Except(existingEntries);

        var newEntries = new List<MaintenanceCalendar>();
        foreach (var month in monthsToAdd)
        {
            var newEntry = mapper.Map<MaintenanceCalendar>(DTO);
            newEntry.Month = month;
            newEntries.Add(newEntry);
        }

        if (!newEntries.Any())
        {
            // Return the existing entry for the initial month if no new entries were added.
            var existingInitialEntry = await dbContext.MaintenanceCalendars
                .FirstOrDefaultAsync(mc => mc.MachineryId == DTO.MachineryId && mc.Month == initialMonth);
            return ApiResponseDTO<MaintenanceCalendar>.SuccessResult(existingInitialEntry ?? new MaintenanceCalendar());
        }

        await dbContext.MaintenanceCalendars.AddRangeAsync(newEntries);
        await dbContext.SaveChangesAsync();

        // Handle ProjectedExpense creation and notification
        if (DTO.Price > 0 && DTO.AccountingCatalogId != Guid.Empty)
        {
            var machinery = await dbContext.Equipment.FindAsync(DTO.MachineryId);
            var catalog = await dbContext.AccountingCatalogs.FindAsync(DTO.AccountingCatalogId);
            var newBudgetExecutions = new List<BudgetExecution>();

            foreach (var entry in newEntries)
            {
                var budgetExecution = new BudgetExecution
                {
                    CustomerId = machinery.CustomerId,
                    MaintenanceCalendarId = entry.Id,
                    AccountingCatalogId = DTO.AccountingCatalogId,
                    ExecutionMonth = entry.Month.Value,
                    BudgetedAmount = entry.Price,
                    Concept = "Mantenimiento Programado",
                    Description = entry.Activity,
                    ExpenseType = ExpenseType.Variable, // Default value
                    ProviderId = entry.ProviderId,
                    IsManualEntry = false,
                    IsFromCalendar = true,
                    IsFromRecurrence = DTO.Recurrence != Recurrence.Eventual,
                    Recurrence = DTO.Recurrence
                };
                newBudgetExecutions.Add(budgetExecution);
            }

            if (newBudgetExecutions.Any())
            {
                await dbContext.BudgetExecutions.AddRangeAsync(newBudgetExecutions);
                await dbContext.SaveChangesAsync();

                // Send SignalR notifications
                var fiscalYearForSignal = DateTime.UtcNow.Year + 1;
                var excludedConnectionId = GetExcludedConnectionId();

                foreach (var be in newBudgetExecutions)
                {
                    var notificationDTO = new ProjectedExpenseUpdateDTO
                    {
                        Action = "add",
                        Key = $"{catalog.CodigoCuenta}-{(int)be.ExecutionMonth}",
                        ProjectedExpenseId = be.Id,
                        CustomerId = be.CustomerId,
                        FiscalYear = fiscalYearForSignal,
                    };
                    await projectedExpenseRealTime.SendUpdateAsync(notificationDTO, excludedConnectionId);
                }
            }
        }

        return ApiResponseDTO<MaintenanceCalendar>.SuccessResult(newEntries.FirstOrDefault(e => e.Month == initialMonth) ?? new MaintenanceCalendar());
    }

    public async Task<ApiResponseDTO<MaintenanceCalendar>> UpdateAsync(Guid id, MaintenanceCalendarAddOrEditDTO DTO)
    {
        var entryBeingEdited = await dbContext.MaintenanceCalendars.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        if (entryBeingEdited == null) return ApiResponseDTO<MaintenanceCalendar>.ErrorResult("No encontrado", ["No se encontró el registro para actualizar"]);

        var originalActivity = entryBeingEdited.Activity;
        var machinery = await dbContext.Equipment.AsNoTracking().FirstAsync(m => m.Id == DTO.MachineryId);
        var customerId = machinery.CustomerId;

        var allEventsForFamily = await dbContext.MaintenanceCalendars
            .Where(x => x.MachineryId == DTO.MachineryId && x.Activity == originalActivity)
            .ToListAsync();

        var familyEventIds = allEventsForFamily.Select(e => e.Id).ToList();
        var linkedBudgetExecutions = await dbContext.BudgetExecutions
            .Include(be => be.AccountingCatalog)
            .Where(be => be.MaintenanceCalendarId.HasValue && familyEventIds.Contains(be.MaintenanceCalendarId.Value))
            .ToDictionaryAsync(be => be.MaintenanceCalendarId.Value);

        var notificationsToSend = new List<ProjectedExpenseUpdateDTO>();
        var fiscalYearForSignal = DateTime.UtcNow.Year + 1;
        var excludedConnectionId = GetExcludedConnectionId();

        if (DTO.Activity != originalActivity && allEventsForFamily.Any())
        {
            await dbContext.ServiceOrders
                .Where(so => so.MaintenanceCalendarId.HasValue && familyEventIds.Contains(so.MaintenanceCalendarId.Value) && so.Status == Status.Pendiente)
                .ExecuteUpdateAsync(setters => setters.SetProperty(so => so.Activity, DTO.Activity));
        }

        var newMonths = CalculateRecurrenceMonths(DTO.Month.Value, DTO.Recurrence);
        var eventsToDelete = allEventsForFamily.Where(e => !newMonths.Contains(e.Month.Value)).ToList();
        var monthsInFamily = allEventsForFamily.Select(e => e.Month.Value).ToList();
        var monthsToUpdate = newMonths.Intersect(monthsInFamily).ToList();
        var monthsToCreate = newMonths.Except(monthsInFamily).ToList();

        // Process Deletions
        if (eventsToDelete.Any())
        {
            var serviceOrdersToUpdate = await dbContext.ServiceOrders.Where(so => so.MaintenanceCalendarId.HasValue && eventsToDelete.Select(e => e.Id).Contains(so.MaintenanceCalendarId.Value)).ToListAsync();
            foreach (var so in serviceOrdersToUpdate) { so.MaintenanceCalendarId = null; }

            foreach (var eventToDelete in eventsToDelete)
            {
                if (linkedBudgetExecutions.TryGetValue(eventToDelete.Id, out var be))
                {
                    notificationsToSend.Add(new ProjectedExpenseUpdateDTO { Action = "remove", Key = $"{be.AccountingCatalog.CodigoCuenta}-{(int)be.ExecutionMonth}", CustomerId = customerId, FiscalYear = fiscalYearForSignal });
                    dbContext.BudgetExecutions.Remove(be);
                }
            }
            dbContext.MaintenanceCalendars.RemoveRange(eventsToDelete);
        }

        // Process Updates
        foreach (var monthToUpdate in monthsToUpdate)
        {
            var eventToUpdate = allEventsForFamily.First(e => e.Month == monthToUpdate);
            linkedBudgetExecutions.TryGetValue(eventToUpdate.Id, out var existingBe);

            bool hadBe = eventToUpdate.Price > 0 && eventToUpdate.AccountingCatalogId.HasValue && eventToUpdate.AccountingCatalogId.Value != Guid.Empty;
            bool willHaveBe = DTO.Price > 0 && DTO.AccountingCatalogId != Guid.Empty;

            if (hadBe && !willHaveBe && existingBe != null)
            {
                notificationsToSend.Add(new ProjectedExpenseUpdateDTO { Action = "remove", Key = $"{existingBe.AccountingCatalog.CodigoCuenta}-{(int)existingBe.ExecutionMonth}", CustomerId = customerId, FiscalYear = fiscalYearForSignal });
                dbContext.BudgetExecutions.Remove(existingBe);
            }
            else if (!hadBe && willHaveBe)
            {
                var newBe = new BudgetExecution
                {
                    MaintenanceCalendarId = eventToUpdate.Id,
                    CustomerId = customerId,
                    IsFromCalendar = true,
                    AccountingCatalogId = DTO.AccountingCatalogId,
                    ExecutionMonth = monthToUpdate,
                    BudgetedAmount = DTO.Price,
                    Concept = "Mantenimiento Programado",
                    Description = DTO.Activity,
                    ExpenseType = ExpenseType.Variable,
                    ProviderId = DTO.ProviderId,
                    IsManualEntry = false,
                    IsFromRecurrence = DTO.Recurrence != Recurrence.Eventual,
                    Recurrence = DTO.Recurrence
                };
                dbContext.BudgetExecutions.Add(newBe);
            }
            else if (hadBe && willHaveBe && existingBe != null)
            {
                if (existingBe.AccountingCatalogId != DTO.AccountingCatalogId || existingBe.ExecutionMonth != monthToUpdate || existingBe.BudgetedAmount != DTO.Price)
                {
                    notificationsToSend.Add(new ProjectedExpenseUpdateDTO { Action = "remove", Key = $"{existingBe.AccountingCatalog.CodigoCuenta}-{(int)existingBe.ExecutionMonth}", CustomerId = customerId, FiscalYear = fiscalYearForSignal });

                    existingBe.AccountingCatalogId = DTO.AccountingCatalogId;
                    existingBe.ExecutionMonth = monthToUpdate;
                    existingBe.BudgetedAmount = DTO.Price;
                    existingBe.Description = DTO.Activity;
                    existingBe.ProviderId = DTO.ProviderId;
                    existingBe.Recurrence = DTO.Recurrence;
                    existingBe.IsFromRecurrence = DTO.Recurrence != Recurrence.Eventual;
                }
            }
            mapper.Map(DTO, eventToUpdate);
            eventToUpdate.Month = monthToUpdate;
        }

        // Process Creations
        if (monthsToCreate.Any())
        {
            foreach (var month in monthsToCreate)
            {
                var newEntry = mapper.Map<MaintenanceCalendar>(DTO);
                newEntry.Month = month;
                dbContext.MaintenanceCalendars.Add(newEntry);
                if (DTO.Price > 0 && DTO.AccountingCatalogId != Guid.Empty)
                {
                    var newBe = new BudgetExecution
                    {
                        MaintenanceCalendar = newEntry,
                        CustomerId = customerId,
                        IsFromCalendar = true,
                        AccountingCatalogId = DTO.AccountingCatalogId,
                        ExecutionMonth = month,
                        BudgetedAmount = DTO.Price,
                        Concept = "Mantenimiento Programado",
                        Description = DTO.Activity,
                        ExpenseType = ExpenseType.Variable,
                        ProviderId = DTO.ProviderId,
                        IsManualEntry = false,
                        IsFromRecurrence = DTO.Recurrence != Recurrence.Eventual,
                        Recurrence = DTO.Recurrence
                    };
                    dbContext.BudgetExecutions.Add(newBe);
                }
            }
        }

        await dbContext.SaveChangesAsync();

        // Send all notifications after saving changes
        var finalFamilyEventIds = await dbContext.MaintenanceCalendars
            .Where(mc => mc.MachineryId == DTO.MachineryId && mc.Activity == DTO.Activity)
            .Select(mc => mc.Id)
            .ToListAsync();

        var allBeForFamily = await dbContext.BudgetExecutions
            .Include(be => be.AccountingCatalog)
            .Where(be => be.MaintenanceCalendarId.HasValue && finalFamilyEventIds.Contains(be.MaintenanceCalendarId.Value))
            .ToListAsync();

        foreach (var be in allBeForFamily)
        {
            if (notificationsToSend.All(n => n.Key != $"{be.AccountingCatalog.CodigoCuenta}-{(int)be.ExecutionMonth}" || n.Action != "add"))
            {
                notificationsToSend.Add(new ProjectedExpenseUpdateDTO { Action = "add", Key = $"{be.AccountingCatalog.CodigoCuenta}-{(int)be.ExecutionMonth}", ProjectedExpenseId = be.Id, CustomerId = customerId, FiscalYear = fiscalYearForSignal });
            }
        }

        foreach (var notification in notificationsToSend.DistinctBy(n => new { n.Key, n.Action }))
        {
            await projectedExpenseRealTime.SendUpdateAsync(notification, excludedConnectionId);
        }

        var updatedEntry = await dbContext.MaintenanceCalendars.AsNoTracking().FirstOrDefaultAsync(mc => mc.Id == id);
        return ApiResponseDTO<MaintenanceCalendar>.SuccessResult(updatedEntry ?? entryBeingEdited);
    }

    public async Task<ApiResponseDTO<bool>> DeleteByIdAsync(Guid id)
    {
        var orders = await dbContext.ServiceOrders.Where(x => x.MaintenanceCalendarId == id).ToListAsync();
        foreach (var item in orders)
        {
            item.MaintenanceCalendarId = null;
            dbContext.ServiceOrders.Update(item);
        }

        var entity = await dbContext.MaintenanceCalendars.FirstOrDefaultAsync(x => x.Id == id);
        if (entity == null) return ApiResponseDTO<bool>.ErrorResult("No encontrado", ["El calendario no existe"]);

        var budgetExecution = await dbContext.BudgetExecutions
            .Include(be => be.AccountingCatalog)
            .FirstOrDefaultAsync(be => be.MaintenanceCalendarId == id);

        ProjectedExpenseUpdateDTO notificationDTO = null;
        if (budgetExecution != null)
        {
            var machinery = await dbContext.Equipment.AsNoTracking().FirstAsync(m => m.Id == entity.MachineryId);
            notificationDTO = new ProjectedExpenseUpdateDTO
            {
                Action = "remove",
                Key = $"{budgetExecution.AccountingCatalog.CodigoCuenta}-{(int)budgetExecution.ExecutionMonth}",
                ProjectedExpenseId = budgetExecution.Id,
                CustomerId = machinery.CustomerId,
                FiscalYear = DateTime.UtcNow.Year + 1,
            };
            dbContext.BudgetExecutions.Remove(budgetExecution);
        }

        dbContext.MaintenanceCalendars.Remove(entity);
        await dbContext.SaveChangesAsync();

        if (notificationDTO != null)
        {
            await projectedExpenseRealTime.SendUpdateAsync(notificationDTO, GetExcludedConnectionId());
        }

        return ApiResponseDTO<bool>.SuccessResult(true);
    }
    private List<Month> CalculateRecurrenceMonths(Month startMonth, Recurrence recurrence)
    {
        var months = new List<Month>();
        int start = (int)startMonth;

        switch (recurrence)
        {
            case Recurrence.Eventual:
            case Recurrence.Anual:
                months.Add((Month)start);
                break;
            case Recurrence.Semestral:
                for (int i = 0; i < 2; i++)
                    months.Add((Month)((start + i * 6 - 1) % 12 + 1));
                break;
            case Recurrence.Quimestral: // Every 5 months
                for (int i = 0; i < 2; i++) // Typically 2 per year, not a clean division
                    months.Add((Month)((start + i * 5 - 1) % 12 + 1));
                break;
            case Recurrence.Cuatrimestral: // Every 4 months
                for (int i = 0; i < 3; i++)
                    months.Add((Month)((start + i * 4 - 1) % 12 + 1));
                break;
            case Recurrence.Trimestral:
                for (int i = 0; i < 4; i++)
                    months.Add((Month)((start + i * 3 - 1) % 12 + 1));
                break;
            case Recurrence.Bimestral:
                for (int i = 0; i < 6; i++)
                    months.Add((Month)((start + i * 2 - 1) % 12 + 1));
                break;
            case Recurrence.Mensual:
                for (int i = 1; i <= 12; i++)
                    months.Add((Month)i);
                break;
        }
        return months.Distinct().OrderBy(m => m).ToList();
    }


    public async Task<ApiResponseDTO<List<object>>> GeneralMantenimientoAsync(Guid customerId, Guid? providerId)
    {
        Thread.CurrentThread.CurrentCulture = new CultureInfo("es-Mx");
        Thread.CurrentThread.CurrentUICulture = new CultureInfo("es-Mx");

        var data = await dbContext.MaintenanceCalendars
            .Include(x => x.Machinery)
            .Include(x => x.Provider)
            .Where(x => x.Machinery.CustomerId == customerId)
            .OrderBy(x => x.Month)
            .ToListAsync();

        if (providerId != null)
        {
            data = data.Where(x => x.ProviderId == providerId).ToList();
        }

        var result = data.GroupBy(x => new
        {
            Month = x.Month.GetDisplayName(),
            MonthNumber = (int)x.Month.Value
        }
            ).Select(x => new
            {
                Mes = x.Key,
                Servicios = x.Select(y => new
                {
                    Equipo = y.Machinery.NameMachinery,
                    Dia = y.Month.GetDisplayName(),
                    Recurrencia = y.Recurrence.GetDisplayName(),
                    Costo = string.Format("{0:C}", y.Price),
                    Actividad = y.Activity,
                    Proveedor = y.Provider.NameProvider,
                    Obsevaciones = y.Observation,
                    Img = pathService.GetMachineyPhotoPath(customerId, y.Machinery.PhotoPath)
                }).ToList()
            })
            .OrderBy(x => x.Mes.MonthNumber)
            .ToList<object>();
        return ApiResponseDTO<List<object>>.SuccessResult(result);
    }

    public async Task<ApiResponseDTO<List<SelectItemDTO<Guid>>>> ProveedoresCalendarioAsync(Guid customerId)
    {
        var data = await dbContext.MaintenanceCalendars
            .Include(x => x.Provider)
            .Where(x => x.Machinery.CustomerId == customerId)
            .ToListAsync();

        var proveedores = data.GroupBy(x => new { Value = x.ProviderId, Label = x.Provider.NameComercial })
            .Select(x => new SelectItemDTO<Guid>
            {
                Label = x.Key.Label,
                Value = x.Key.Value
            }).ToList();
        return ApiResponseDTO<List<SelectItemDTO<Guid>>>.SuccessResult(proveedores);
    }

    public async Task<ApiResponseDTO<List<CalendarioMantenimientoDTO>>> CronogramaAnualAsync(Guid customerId, int? filtro)
    {
        var data = await dbContext.Equipment
            .Include(x => x.EquipoClasificacion)
            .Include(x => x.MaintenanceCalendars)
            .Where(x => x.State == State.Activo && x.CustomerId == customerId && x.MaintenanceCalendars.Count > 0)
            .OrderBy(x => x.EquipoClasificacion.Descripcion)
            .Select(x => new CalendarioMantenimientoDTO
            {
                Id = x.Id,
                Sistema = x.EquipoClasificacion.Descripcion,
                InventoryCategory = x.InventoryCategory,
                NameMachinery = x.NameMachinery,
                MaintenanceCalendars = x.MaintenanceCalendars.Select(y => new CalendarioMantenimientoItemsDTO
                {
                    Id = y.Id,
                    Month = y.Month.Value,
                    TypeMaintance = y.TypeMaintance
                }).ToList()
            }).ToListAsync();

        if (filtro == 9)
        {
            foreach (var item in data)
            {
                item.MaintenanceCalendars.RemoveAll(x => x.TypeMaintance != TypeMaintance.Pintura);
            }
            data.RemoveAll(x => x.MaintenanceCalendars.Count == 0);
        }
        if (filtro == 11)
        {
            foreach (var item in data)
            {
                item.MaintenanceCalendars.RemoveAll(x => x.TypeMaintance != TypeMaintance.Carpinteria);
            }
            data.RemoveAll(x => x.MaintenanceCalendars.Count == 0);
        }
        if (filtro == 2)
        {
            data = data.Where(x => x.InventoryCategory == InventoryCategory.Amenidades).ToList();
        }
        if (filtro == 8)
        {
            data = data.Where(x => x.InventoryCategory == InventoryCategory.AreasComunes).ToList();
        }
        if (filtro == 7)
        {
            data = data.Where(x => x.InventoryCategory == InventoryCategory.BodegasCuartosMaquinas).ToList();
        }
        if (filtro == 1)
        {
            data = data.Where(x => x.InventoryCategory == InventoryCategory.Equipos).ToList();
        }
        if (filtro == 5)
        {
            data = data.Where(x => x.InventoryCategory == InventoryCategory.Gimnasio).ToList();
        }
        if (filtro == 6)
        {
            data = data.Where(x => x.InventoryCategory == InventoryCategory.Sistemas).ToList();
        }
        return ApiResponseDTO<List<CalendarioMantenimientoDTO>>.SuccessResult(data);
    }

    public async Task<ApiResponseDTO<List<object>>> ExportCalendarAsync(Guid customerId)
    {
        DateTimeFormatInfo formatoFecha = CultureInfo.CurrentCulture.DateTimeFormat;
        var items = await dbContext.MaintenanceCalendars
            .Include(x => x.Machinery)
            .Include(x => x.Provider)
            .Where(x => x.Machinery.CustomerId == customerId && x.Machinery.State == State.Activo)
            .OrderBy(x => x.Machinery.NameMachinery)
            .ToListAsync();

        var result = items.Select(x => new
        {
            Equipo = x.Machinery.NameMachinery,
            Frecuencia = x.Recurrence,
            Actividad = x.Activity,
            Proveedor = x.Provider.NameProvider,
            FechaServicio = x.Month.GetDisplayName(),
        })
        .OrderBy(x => x.FechaServicio)
        .ToList<object>();
        return ApiResponseDTO<List<object>>.SuccessResult(result);
    }

    public async Task<ApiResponseDTO<ResumenGastosDTO>> GetResumenGastosAsync(Guid customerId)
    {
        var data = await dbContext.MaintenanceCalendars
                   .Include(x => x.Machinery)
                   .Include(x => x.AccountingCatalog)
                   .Where(x => x.Machinery.CustomerId == customerId && x.AccountingCatalogId != null)
                   .ToListAsync();
        decimal totales = 0;

        foreach (var item in data)
        {
            totales += item.Price;
        }

        var cuentas = data
            .GroupBy(x => $"{x.AccountingCatalog.CodigoCuenta} - {x.AccountingCatalog.DescripcionCuenta}")
              .Select(x => new
              {
                  Cuenta = x.Key,
                  SubCuentas = x.GroupBy(y => $"{y.AccountingCatalog.CodigoCuenta} - {y.AccountingCatalog.DescripcionCuenta}")
                   .Select(y => new
                   {
                       SubCuenta = y.Key,
                       Items = y.Select(z => new
                       {
                           z.Id,
                           IdEquipo = z.MachineryId,
                           Equipo = z.Machinery.NameMachinery,
                           Recurrencia = z.Recurrence.GetDisplayName(),
                           Mes = z.Month.GetDisplayName(),
                           Servicio = z.Activity,
                           Costo = decimal.Round(z.Price, 0),

                       })
                       .OrderBy(z => z.Mes)
                       .ToList(),
                       CostoTotal = decimal.Round(y.Sum(z => z.Price), 0),
                   }).ToList()
              }).ToList();

        var result = new ResumenGastosDTO
        {
            Items = cuentas,
            TotalGastos = decimal.Round(totales, 0),
        };

        return ApiResponseDTO<ResumenGastosDTO>.SuccessResult(result);
    }

    public async Task<ApiResponseDTO<object>> GetResumenAsync(Guid customerId)
    {
        var data = await dbContext.MaintenanceCalendars
                   .Include(x => x.Machinery)
                   .Include(x => x.AccountingCatalog)
                   .Where(x => x.Machinery.CustomerId == customerId && x.AccountingCatalogId != null)
                   .ToListAsync();

        var totales = data.GroupBy(x => new { Cuenta = $"{x.AccountingCatalog.CodigoCuenta} - {x.AccountingCatalog.DescripcionCuenta}" })
            .Select(x => new
            {
                Cuenta = x.Key,
                Total = decimal.Round(x.Sum(y => y.Price), 0),
                CostoMensual = decimal.Round(x.Sum(y => y.Price) / 12, 0),
            }).ToList();

        return ApiResponseDTO<object>.SuccessResult(totales);
    }

    public async Task<ApiResponseDTO<List<CronogramaAnualPdfStatusDTO>>> GetCronogramaAnualPdfStatusAsync(Guid customerId, int? filtro, int? year)
    {
        var query = dbContext.Equipment
            .Include(x => x.EquipoClasificacion)
            .Include(x => x.MaintenanceCalendars)
                .ThenInclude(mc => mc.ServiceOrder)
            .Where(x => x.State == State.Activo && x.CustomerId == customerId && x.MaintenanceCalendars.Count > 0);

        if (year.HasValue)
        {
            query = query.Where(x => x.MaintenanceCalendars.Any(mc => mc.FechaServicio.Year == year.Value));
        }

        var data = await query
            .OrderBy(x => x.EquipoClasificacion.Descripcion)
            .Select(x => new CronogramaAnualPdfStatusDTO
            {
                Id = x.Id,
                Sistema = x.EquipoClasificacion.Descripcion,
                InventoryCategory = x.InventoryCategory,
                NameMachinery = x.NameMachinery,
                Items = x.MaintenanceCalendars.Select(y => new CronogramaAnualPdfStatusItemDTO
                {
                    Id = y.Id,
                    Month = y.Month.Value,
                    TypeMaintance = y.TypeMaintance,
                    Year = y.FechaServicio.Year,
                    ServiceOrderStatus = CalcularEstadoServicio(y.ServiceOrder)
                }).ToList()
            }).ToListAsync();

        if (filtro == 9)
        {
            foreach (var item in data)
            {
                item.Items.RemoveAll(x => x.TypeMaintance != TypeMaintance.Pintura);
            }
            data.RemoveAll(x => x.Items.Count == 0);
        }
        if (filtro == 11)
        {
            foreach (var item in data)
            {
                item.Items.RemoveAll(x => x.TypeMaintance != TypeMaintance.Carpinteria);
            }
            data.RemoveAll(x => x.Items.Count == 0);
        }
        if (filtro == 2)
        {
            data = data.Where(x => x.InventoryCategory == InventoryCategory.Amenidades).ToList();
        }
        if (filtro == 8)
        {
            data = data.Where(x => x.InventoryCategory == InventoryCategory.AreasComunes).ToList();
        }
        if (filtro == 7)
        {
            data = data.Where(x => x.InventoryCategory == InventoryCategory.BodegasCuartosMaquinas).ToList();
        }
        if (filtro == 1)
        {
            data = data.Where(x => x.InventoryCategory == InventoryCategory.Equipos).ToList();
        }
        if (filtro == 5)
        {
            data = data.Where(x => x.InventoryCategory == InventoryCategory.Gimnasio).ToList();
        }
        if (filtro == 6)
        {
            data = data.Where(x => x.InventoryCategory == InventoryCategory.Sistemas).ToList();
        }
        return ApiResponseDTO<List<CronogramaAnualPdfStatusDTO>>.SuccessResult(data);
    }

    private static string CalcularEstadoServicio(ICollection<ServiceOrder> serviceOrders)
    {
        if (serviceOrders == null || !serviceOrders.Any()) return string.Empty;

        if (serviceOrders.Any(so => so.Status == Status.Concluido)) return Status.Concluido.GetDisplayName();
        if (serviceOrders.Any(so => so.Status == Status.Pendiente)) return Status.Pendiente.GetDisplayName();
        if (serviceOrders.Any(so => so.Status == Status.Proceso)) return Status.Proceso.GetDisplayName();
        if (serviceOrders.Any(so => so.Status == Status.noAutorizado)) return Status.noAutorizado.GetDisplayName();
        if (serviceOrders.Any(so => so.Status == Status.Cancelado)) return Status.Cancelado.GetDisplayName();

        return string.Empty;
    }
}

