namespace MantenimientoLuxuryApp.Machinery.Services;
/// <summary>
/// Implementación del servicio de control de préstamos de herramientas.
/// </summary>
public class ControlPrestamoHerramientaAppService(ApplicationDbContext dbContext, IMapper mapper) : IControlPrestamoHerramientaAppService
{
    public async Task<ApiResponseDTO<ControlPrestamoHerramientaPagedListDTO>> GetAllIndexDTO(Guid customerId, PaginationCommonDTO pagination)
    {
        var query = dbContext.ToolLoans
            .Include(x => x.Tool)
            .Include(x => x.ApplicationUser)
            .Where(x => x.CustomerId == customerId);

        if (!string.IsNullOrWhiteSpace(pagination.Filter))
        {
            string filter = pagination.Filter.ToLower();
            query = query.Where(x => x.Tool.NameTool.ToLower().Contains(filter) ||
                                     x.ApplicationUser.FirstName.ToLower().Contains(filter) ||
                                     x.ApplicationUser.LastName.ToLower().Contains(filter) ||
                                     x.Observaciones.ToLower().Contains(filter));
        }

        int totalRecords = await query.CountAsync();

        if (string.IsNullOrWhiteSpace(pagination.SortField))
        {
            query = query.OrderByDescending(x => x.FechaSalida);
        }
        else
        {
            switch (pagination.SortField)
            {
                case "fechaSalida":
                    query = pagination.SortOrder == -1 ? query.OrderByDescending(x => x.FechaSalida) : query.OrderBy(x => x.FechaSalida);
                    break;
                case "fechaRegreso":
                    query = pagination.SortOrder == -1 ? query.OrderByDescending(x => x.FechaRegreso) : query.OrderBy(x => x.FechaRegreso);
                    break;
                case "tool":
                    query = pagination.SortOrder == -1 ? query.OrderByDescending(x => x.Tool.NameTool) : query.OrderBy(x => x.Tool.NameTool);
                    break;
                case "applicationUser":
                    query = pagination.SortOrder == -1 ? query.OrderByDescending(x => x.ApplicationUser.FirstName + " " + x.ApplicationUser.LastName) : query.OrderBy(x => x.ApplicationUser.FirstName + " " + x.ApplicationUser.LastName);
                    break;
                default:
                    query = query.OrderByDescending(x => x.FechaSalida);
                    break;
            }
        }

        var data = await query.Paginate(pagination).ToListAsync();

        var dtos = data.Select(x => new ControlPrestamoHerramientaListDTO
        {
            Id = x.Id,
            FechaSalida = x.FechaSalida,
            FechaRegreso = x.FechaRegreso,
            Tool = x.Tool?.NameTool,
            ApplicationUser = x.ApplicationUser?.FullName,
            Observaciones = x.Observaciones,
        }).ToList();

        var result = new ControlPrestamoHerramientaPagedListDTO
        {
            Items = dtos,
            TotalRecords = totalRecords
        };

        return ApiResponseDTO<ControlPrestamoHerramientaPagedListDTO>.SuccessResult(result);
    }

    public async Task<ApiResponseDTO<ControlPrestamoHerramientaDTO>> GetById(Guid id)
    {
        var entity = await dbContext.ToolLoans
            .Include(x => x.Tool)
            .Include(x => x.ApplicationUserResponsable)
            .Include(x => x.ApplicationUser)
            .FirstOrDefaultAsync(x => x.Id == id); // Changed to Async

        if (entity is null) return ApiResponseDTO<ControlPrestamoHerramientaDTO>.ErrorResult("No se encuentra el préstamo de herramienta", 404);
        return ApiResponseDTO<ControlPrestamoHerramientaDTO>.SuccessResult(mapper.Map<ControlPrestamoHerramientaDTO>(entity));
    }

    public async Task<ApiResponseDTO<ToolLoan>> AddAsync(ControlPrestamoHerramientaAddOrEditDTO DTO)
    {
        var model = mapper.Map<ToolLoan>(DTO);
        await dbContext.ToolLoans.AddAsync(model);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<ToolLoan>.SuccessResult(model);
    }

    public async Task<ApiResponseDTO<ToolLoan>> UpdateAsync(Guid id, ControlPrestamoHerramientaAddOrEditDTO DTO)
    {
        var model = mapper.Map<ToolLoan>(DTO);
        model.Id = id;
        dbContext.ToolLoans.Update(model);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<ToolLoan>.SuccessResult(model);
    }

    public async Task<ApiResponseDTO<bool>> DeleteByIdAsync(Guid id)
    {
        var entity = await dbContext.ToolLoans.FindAsync(id);
        if (entity == null)
        {
            return ApiResponseDTO<bool>.ErrorResult("Préstamo de herramienta no encontrado", 404);
        }
        dbContext.ToolLoans.Remove(entity);
        await dbContext.SaveChangesAsync();
        return ApiResponseDTO<bool>.SuccessResult(true);
    }
}



