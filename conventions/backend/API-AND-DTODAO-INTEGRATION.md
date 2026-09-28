# API Métodos + DTOs — Integración Completa

**Status:** ✅ VIGENTE (2026-09-11)  
**Severidad:** 🔴 CRÍTICA  
**Propósito:** Alinear métodos API con DTOs de forma consistente

---

## Flujo Integrado: Método API → DTO → Endpoint HTTP

```
┌─────────────────────────────────────────────────────────────────┐
│                        OPERACIÓN CRUD                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Método API (genérico)    │    DTO (especializado)   │   HTTP    │
│  ─────────────────────────┼──────────────────────────┼─────────  │
│  GetByIdAsync(id)         │    [Entity]DTO           │   GET     │
│  GetListAsync()           │    [Entity]DTO           │   GET     │
│  CreateAsync(dto)         │    Create[Entity]DTO     │   POST    │
│  UpdateAsync(id, dto)     │    Update[Entity]DTO     │   PUT     │
│  DeleteByIdAsync(id)      │    (no DTO, retorna bool)│   DELETE  │
│  DeleteRangeAsync(ids)    │    (no DTO, retorna bool)│   DELETE  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1️⃣ Métodos API — 6 Patrones Estándar .NET

**Documento:** `conventions/backend/api-method-naming-conventions.md`

```csharp
// Interfaz de ejemplo
public interface IBankAppService
{
    // LEER
    Task<ApiResponseDTO<BankDTO>> GetByIdAsync(Guid id);
    Task<ApiResponseDTO<IEnumerable<BankDTO>>> GetListAsync();
    Task<ApiResponseDTO<PaginatedResult<BankDTO>>> GetListAsync(int page, int size);

    // CREAR
    Task<ApiResponseDTO<BankDTO>> CreateAsync(CreateBankDTO dto);

    // ACTUALIZAR
    Task<ApiResponseDTO<BankDTO>> UpdateAsync(Guid id, UpdateBankDTO dto);

    // ELIMINAR
    Task<ApiResponseDTO<bool>> DeleteByIdAsync(Guid id);
    Task<ApiResponseDTO<bool>> DeleteRangeAsync(IEnumerable<Guid> ids);
}
```

**Reglas:**
- ✅ 6 patrones genéricos (no personalizar por entidad)
- ✅ Async obligatorio (público)
- ✅ Criterion explícito (Id, Range, no GetAsync genérico)
- ❌ Sin variantes como `GetBankByIdAsync`, `CreateBankAsync`

---

## 2️⃣ DTOs — Naming y Organización

### 2A. Naming — Tipos de DTO

**Documento:** `conventions/backend/dto-naming-conventions.md`

| Tipo | Patrón | Ejemplo | Uso |
|------|--------|---------|-----|
| **Response/Lectura** | `[Entity]DTO` | `BankDTO` | GetByIdAsync, GetListAsync (salida) |
| **Creación** | `Create[Entity]DTO` | `CreateBankDTO` | CreateAsync (entrada) |
| **Actualización** | `Update[Entity]DTO` | `UpdateBankDTO` | UpdateAsync (entrada) |
| **Summary** | `[Entity]SummaryDTO` | `BankSummaryDTO` | GetListAsync ligero (pocas propiedades) |
| **Filtro** | `[Entity]FilterDTO` | `BankFilterDTO` | GetListAsync querystring |
| **Acción** | `[Action][Entity]DTO` | `ChangeStatusBankDTO` | Métodos de negocio (POST mutantes) |

**Reglas:**
- ✅ Sufijo `DTO` siempre en MAYÚSCULAS
- ✅ Prefijo describe entidad + operación
- ✅ Entidad en inglés singular (`Bank`, no `Banco`)
- ✅ Herencia obligatoria de `GuidIdEntityDTO` (para salida)
- ❌ No: `BankDto`, `BankViewModel`, `BankRequest`, `BankResponse`
- ❌ No: Spanglish (`PiscinaDTO`)
- ❌ No: Multi-propósito (`AddOrEditDTO`)

### 2B. Organización — 1 Archivo = 1 DTO

**Documento:** `conventions/backend/dto-file-organization-rule.md`

```
✅ CORRECTO:
DTOs/
  ├── BankDTO.cs              (un DTO por archivo)
  ├── CreateBankDTO.cs        (un DTO por archivo)
  ├── UpdateBankDTO.cs        (un DTO por archivo)
  └── BankSummaryDTO.cs       (un DTO por archivo)

❌ INCORRECTO:
DTOs/
  ├── BankDTOs.cs             (múltiples DTOs)
  │   ├── BankDTO
  │   ├── CreateBankDTO
  │   └── UpdateBankDTO
```

**Reglas:**
- ✅ 1 archivo = 1 DTO, SIN excepciones
- ✅ Nombre archivo coincide con nombre DTO
- ✅ Facilita búsqueda, reduce conflictos PR, limpia historia git
- ❌ No: múltiples public record/class por archivo
- ❌ No: nested classes o DTOs anónimos

---

## 3️⃣ Endpoints HTTP — Mapeo Método → Verbo

**Documento:** `conventions/backend/api-method-naming-conventions.md` §4

```csharp
// Endpoint Handler — Ejemplo
public class BankEndPoints : IEndpointModule
{
    public void MapEndpoints(WebApplication app)
    {
        // GET /api/banks/{id}
        app.MapGet("/api/banks/{id}", GetBankByIdHandler)
           .WithName("GetBankById");

        // GET /api/banks?page=1&size=10
        app.MapGet("/api/banks", GetBanksHandler)
           .WithName("GetBanks");

        // POST /api/banks
        app.MapPost("/api/banks", CreateBankHandler)
           .WithName("CreateBank");

        // PUT /api/banks/{id}
        app.MapPut("/api/banks/{id}", UpdateBankHandler)
           .WithName("UpdateBank");

        // DELETE /api/banks/{id}
        app.MapDelete("/api/banks/{id}", DeleteBankHandler)
           .WithName("DeleteBank");

        // DELETE /api/banks/batch
        app.MapDelete("/api/banks/batch", DeleteBanksHandler)
           .WithName("DeleteBanks");
    }
}
```

**Reglas:**
- ✅ GET → lectura (GetByIdAsync, GetListAsync)
- ✅ POST → creación (CreateAsync)
- ✅ PUT → actualización total (UpdateAsync)
- ✅ PATCH → actualización parcial (UpdateAsync + DTO parcial)
- ✅ DELETE → eliminación (DeleteByIdAsync, DeleteRangeAsync)
- ❌ No: acciones en GET
- ❌ No: verbos en rutas

---

## 4️⃣ Checklist Integrado — Code Review

### Métodos API
- [ ] Es uno de: GetByIdAsync, GetListAsync, CreateAsync, UpdateAsync, DeleteByIdAsync, DeleteRangeAsync
- [ ] Criterion explícito (no GetAsync genérico)
- [ ] Async obligatorio (público)
- [ ] Retorno coincide con nombre (uno vs colección)

### DTOs
- [ ] Sufijo `DTO` (mayúsculas)
- [ ] Tipo correcto: `[Entity]DTO`, `Create[Entity]DTO`, `Update[Entity]DTO`
- [ ] 1 archivo = 1 DTO
- [ ] Herencia de `GuidIdEntityDTO` (si es salida con Id)

### Endpoints
- [ ] Verbo HTTP correcto (GET/POST/PUT/DELETE)
- [ ] Ruta pluralizada, ID en URL, no en verbo
- [ ] Sin acciones en GET
- [ ] Nombre endpoint claro (GetBankById, CreateBank, etc.)

### Integración
- [ ] Método, DTO y endpoint están alineados
- [ ] Frontend puede generar desde Swagger sin confusión
- [ ] No hay variantes personalizadas (no `GetBankByIdAsync`, usar `GetByIdAsync`)

---

## 5️⃣ Ejemplo Completo: CRUD de Banco

### Paso 1: Definir DTOs

```csharp
// DTOs/BankDTO.cs
public record BankDTO : GuidIdEntityDTO
{
    public string Code { get; init; }
    public string Name { get; init; }
}

// DTOs/CreateBankDTO.cs
public record CreateBankDTO
{
    public string Code { get; init; }
    public string Name { get; init; }
}

// DTOs/UpdateBankDTO.cs
public record UpdateBankDTO
{
    public string Code { get; init; }
    public string Name { get; init; }
}
```

### Paso 2: Definir Interfaz de Servicio

```csharp
// Services/IBankAppService.cs
public interface IBankAppService
{
    Task<ApiResponseDTO<BankDTO>> GetByIdAsync(Guid id);
    Task<ApiResponseDTO<IEnumerable<BankDTO>>> GetListAsync();
    Task<ApiResponseDTO<BankDTO>> CreateAsync(CreateBankDTO dto);
    Task<ApiResponseDTO<BankDTO>> UpdateAsync(Guid id, UpdateBankDTO dto);
    Task<ApiResponseDTO<bool>> DeleteByIdAsync(Guid id);
}
```

### Paso 3: Implementar Servicio

```csharp
// Services/BankAppService.cs
public class BankAppService : IBankAppService
{
    private readonly IRepository<Bank> _repository;
    private readonly IMapper _mapper;

    public async Task<ApiResponseDTO<BankDTO>> GetByIdAsync(Guid id)
    {
        var bank = await _repository.GetByIdAsync(id);
        return bank == null
            ? ApiResponseDTO<BankDTO>.Fail("Bank not found")
            : ApiResponseDTO<BankDTO>.Ok(_mapper.Map<BankDTO>(bank));
    }

    public async Task<ApiResponseDTO<IEnumerable<BankDTO>>> GetListAsync()
    {
        var banks = await _repository.GetAllAsync();
        return ApiResponseDTO<IEnumerable<BankDTO>>.Ok(
            _mapper.Map<IEnumerable<BankDTO>>(banks)
        );
    }

    public async Task<ApiResponseDTO<BankDTO>> CreateAsync(CreateBankDTO dto)
    {
        var bank = new Bank { Code = dto.Code, Name = dto.Name };
        await _repository.AddAsync(bank);
        await _repository.SaveChangesAsync();
        return ApiResponseDTO<BankDTO>.Ok(_mapper.Map<BankDTO>(bank));
    }

    public async Task<ApiResponseDTO<BankDTO>> UpdateAsync(Guid id, UpdateBankDTO dto)
    {
        var bank = await _repository.GetByIdAsync(id);
        if (bank == null) return ApiResponseDTO<BankDTO>.Fail("Bank not found");
        
        bank.Code = dto.Code;
        bank.Name = dto.Name;
        await _repository.SaveChangesAsync();
        return ApiResponseDTO<BankDTO>.Ok(_mapper.Map<BankDTO>(bank));
    }

    public async Task<ApiResponseDTO<bool>> DeleteByIdAsync(Guid id)
    {
        var bank = await _repository.GetByIdAsync(id);
        if (bank == null) return ApiResponseDTO<bool>.Fail("Bank not found");
        
        _repository.Delete(bank);
        await _repository.SaveChangesAsync();
        return ApiResponseDTO<bool>.Ok(true);
    }
}
```

### Paso 4: Definir Endpoints

```csharp
// EndPoints/BankEndPoints.cs
public class BankEndPoints : IEndpointModule
{
    public void MapEndpoints(WebApplication app)
    {
        var group = app.MapGroup("/api/banks")
            .WithName("Banks")
            .WithOpenApi();

        group.MapGet("/{id}", GetBankById)
            .WithName("GetBankById");

        group.MapGet("/", GetBanks)
            .WithName("GetBanks");

        group.MapPost("/", CreateBank)
            .WithName("CreateBank");

        group.MapPut("/{id}", UpdateBank)
            .WithName("UpdateBank");

        group.MapDelete("/{id}", DeleteBank)
            .WithName("DeleteBank");
    }

    private static async Task<IResult> GetBankById(Guid id, IBankAppService service)
    {
        var result = await service.GetByIdAsync(id);
        return result.IsSuccess ? Results.Ok(result.Data) : Results.NotFound();
    }

    private static async Task<IResult> GetBanks(IBankAppService service)
    {
        var result = await service.GetListAsync();
        return Results.Ok(result.Data);
    }

    private static async Task<IResult> CreateBank(CreateBankDTO dto, IBankAppService service)
    {
        var result = await service.CreateAsync(dto);
        return result.IsSuccess ? Results.Created($"/banks/{result.Data.Id}", result.Data) : Results.BadRequest();
    }

    private static async Task<IResult> UpdateBank(Guid id, UpdateBankDTO dto, IBankAppService service)
    {
        var result = await service.UpdateAsync(id, dto);
        return result.IsSuccess ? Results.Ok(result.Data) : Results.NotFound();
    }

    private static async Task<IResult> DeleteBank(Guid id, IBankAppService service)
    {
        var result = await service.DeleteByIdAsync(id);
        return result.IsSuccess ? Results.NoContent() : Results.NotFound();
    }
}
```

---

## 6️⃣ Referencias Centralizadas

### Documentos Especializados

| Documento | Propósito | Severidad |
|-----------|-----------|-----------|
| `api-method-naming-conventions.md` | 6 patrones genéricos, criterion explícito, Async | 🔴 CRÍTICA |
| `dto-naming-conventions.md` | Sufijo DTO, tipos (Create/Update), especializado | 🔴 CRÍTICA |
| `dto-file-organization-rule.md` | 1 archivo = 1 DTO, SIN excepciones | 🔴 CRÍTICA |

### En CONVENTIONS.md

- §3.3 "Naming por tipo de pieza" — tabla de métodos + DTOs
- §3.4 "Fuente de verdad detallada" — Backend-Métodos API (🔴 CRÍTICA)

---

**Última actualización:** 2026-09-11  
**Vigencia:** Hasta cambio formal de CONVENTIONS.md  
**Status:** ✅ Integración completa validada — SIN conflictos
