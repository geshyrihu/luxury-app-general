# 🔌 API Architecture - Minimal APIs & Clean Architecture

## Stack

- **.NET 10** (C# 13/14)
- **Minimal APIs** (no MVC controllers)
- **Entity Framework Core 10**
- **SQL Server / PostgreSQL**
- **Vertical Slice Architecture** (por dominio)
- **Dependency Injection** nativo de .NET

---

## Estructura del Proyecto

```
LuxuryApp.Api/
├── Program.cs                   # Configuración principal (Startup)
├── appsettings.json             # Config global (GITIGNORED)
├── appsettings.json.example     # Plantilla sin secretos
├── Features/                    # Minimal API Endpoints
│   ├── Auth/
│   │   ├── LoginEndpoint.cs
│   │   └── RefreshTokenEndpoint.cs
│   ├── Vault/
│   │   └── VaultSecretsEndpoints.cs
│   └── Health/
│       └── HealthCheckEndpoint.cs
└── [Otros directorios...]

LuxuryApp.Application/
├── Moduls/                      # Vertical Slices por dominio
│   ├── CobranzaLuxuryApp/       # Dominio: Cobranza
│   │   ├── CobranzaNativa/
│   │   │   ├── Contracts/       # DTOs
│   │   │   ├── Core/            # Lógica de negocio
│   │   │   │   ├── Charges/
│   │   │   │   ├── Payments/
│   │   │   │   └── Services/    # App Services
│   │   │   └── Repositories/    # Data access
│   │   └── CobranzaOnline/
│   ├── AdminLuxuryApp/          # Dominio: Administración
│   └── [Otros dominios...]
└── Endpoints/                   # Interface para registrar endpoints

LuxuryApp.Infrastructure/
├── Data/                        # EF Core DbContext
│   ├── ApplicationDbContext.cs
│   └── Migrations/
├── Vault/                       # Sistema de Vault (AES-256-GCM)
├── External/                    # Integraciones externas
└── Repositories/                # Generic repository pattern

LuxuryApp.Shared/
├── DTOs/                        # Contracts compartidos
├── Interfaces/                  # Interfaces públicas
└── Constants/                   # Enums, constantes
```

---

## Configuración en Program.cs

### Estructura Base

```csharp
var builder = WebApplication.CreateBuilder(args);

// 1. Configuración
var config = builder.Configuration;

// 2. Servicios (DI)
builder.Services.AddApplicationServices(config);
builder.Services.AddInfrastructureServices(config);
builder.Services.AddVaultServices(config);

// 3. Build
var app = builder.Build();

// 4. Middleware
if (app.Environment.IsDevelopment()) { }
app.UseHttpsRedirection();
app.UseAuthorization();

// 5. Mapping de Endpoints
var group = app.MapGroup("api").RequireAuthorization();
app.MapEndpoints(group);

// 6. Seeders (data iniciales)
await app.RunMigrationsAsync();
await app.RunSeedersAsync();

// 7. Start
app.Run();
```

---

## Minimal APIs Pattern

### Estructura Recomendada

```csharp
// Features/Auth/LoginEndpoint.cs
using LuxuryApp.Application.Endpoints;

namespace LuxuryApp.Api.Features.Auth;

public sealed class LoginEndpoint : IEndpointModule
{
    public void MapEndpoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/auth");
        
        group.MapPost("login", HandleLogin)
            .WithName("Login")
            .WithOpenApi()
            .Produces<LoginResponse>(StatusCodes.Status200OK)
            .Produces<ProblemDetails>(StatusCodes.Status401Unauthorized);
    }

    private static async Task<IResult> HandleLogin(
        LoginRequest request,
        IAuthenticationService authService,
        ISecretProvider secretProvider,
        CancellationToken ct)
    {
        try
        {
            var jwtKey = await secretProvider.GetSecretAsync("JwtSigningKey");
            var result = await authService.AuthenticateAsync(request, jwtKey, ct);
            
            return result.IsSuccess
                ? TypedResults.Ok(new LoginResponse { Token = result.Value })
                : TypedResults.Unauthorized();
        }
        catch (Exception ex)
        {
            // Log error
            return TypedResults.Problem(detail: ex.Message, statusCode: 500);
        }
    }
}

// Record de request/response
public record LoginRequest(string Username, string Password);
public record LoginResponse(string Token);
```

### Interface IEndpointModule

```csharp
namespace LuxuryApp.Application.Endpoints;

public interface IEndpointModule
{
    void MapEndpoints(IEndpointRouteBuilder app);
}
```

### Registro Automático de Endpoints

```csharp
// Extension en Program.cs
public static void MapEndpoints(this WebApplication app, IEndpointRouteBuilder group)
{
    var endpointType = typeof(IEndpointModule);
    
    var modules = typeof(Program).Assembly.GetTypes()
        .Where(p => p.IsAssignableTo(endpointType) && !p.IsAbstract)
        .Select(Activator.CreateInstance)
        .Cast<IEndpointModule>();

    foreach (var module in modules)
    {
        module.MapEndpoints(group);
    }
}
```

---

## Vertical Slice / Dominio-Driven

### Organización por Módulo

```
Moduls/CobranzaLuxuryApp/
├── CobranzaNativa/
│   ├── Contracts/
│   │   ├── DTOs/
│   │   │   ├── ChargeResponseDTO.cs
│   │   │   ├── CreateChargeDTO.cs
│   │   │   └── UpdateChargeDTO.cs
│   │   └── ExternalCompatibility/
│   │       └── DTOs/
│   ├── Core/
│   │   ├── Charges/
│   │   │   ├── DTOs/
│   │   │   ├── Services/
│   │   │   │   ├── ChargeAppService.cs
│   │   │   │   └── ChargesGeneratorService.cs
│   │   │   └── Repositories/
│   │   ├── Payments/
│   │   ├── Fines/
│   │   └── Templates/
│   ├── Repositories/
│   │   └── ChargeRepository.cs
│   ├── Entities/
│   │   └── Charge.cs
│   └── Mappings/
│       └── ChargeMappings.cs
└── Endpoint/
    ├── ChargeListEndpoint.cs
    ├── ChargeDetailEndpoint.cs
    ├── CreateChargeEndpoint.cs
    └── UpdateChargeEndpoint.cs
```

### App Service Pattern

```csharp
// Core/Charges/Services/ChargeAppService.cs
public sealed class ChargeAppService
{
    private readonly IChargeRepository _chargeRepository;
    private readonly IChargeValidationService _validationService;

    public ChargeAppService(IChargeRepository chargeRepository, ...)
    {
        _chargeRepository = chargeRepository;
        _validationService = validationService;
    }

    public async Task<Result<ChargeResponseDTO>> CreateChargeAsync(
        CreateChargeDTO dto,
        CancellationToken ct)
    {
        // Validación
        var validationResult = await _validationService.ValidateAsync(dto);
        if (!validationResult.IsValid)
            return Result.Failure(validationResult.Errors);

        // Creación
        var charge = Charge.Create(dto.Amount, dto.PropertyId, dto.UserId);

        // Persistencia
        await _chargeRepository.AddAsync(charge, ct);
        await _chargeRepository.SaveChangesAsync(ct);

        // Mapeo a DTO
        return Result.Success(ChargeMapper.ToDTO(charge));
    }
}
```

---

## Dependency Injection

### Extensiones de Configuración

```csharp
// Extensions/ServiceCollectionExtensions.cs
namespace LuxuryApp.Api.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // Servicios de aplicación
        services.AddScoped<IAuthenticationService, AuthenticationService>();
        services.AddScoped<IChargeAppService, ChargeAppService>();
        
        // Validadores
        services.AddScoped<IChargeValidationService, ChargeValidationService>();
        
        return services;
    }

    public static IServiceCollection AddInfrastructureServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // DbContext
        var connectionString = configuration.GetConnectionString("SQLServerConnection")
            ?? throw new InvalidOperationException("Connection string not found");
        
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(connectionString));

        // Repositories
        services.AddScoped<IChargeRepository, ChargeRepository>();
        services.AddScoped<IPropertyRepository, PropertyRepository>();

        // External Services
        services.AddHttpClient<WhatsAppService>();
        services.AddHttpClient<EmailService>();

        return services;
    }
}
```

### En Program.cs

```csharp
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddInfrastructureServices(builder.Configuration);
builder.Services.AddVaultServices(builder.Configuration);
```

---

## Error Handling

### Result Pattern

```csharp
public sealed class Result<T>
{
    public bool IsSuccess { get; }
    public T Value { get; }
    public string Error { get; }

    public static Result<T> Success(T value) => new() { IsSuccess = true, Value = value };
    public static Result<T> Failure(string error) => new() { IsSuccess = false, Error = error };
}

// Uso
var result = await chargeService.CreateChargeAsync(dto);
if (!result.IsSuccess)
    return TypedResults.BadRequest(result.Error);

return TypedResults.Ok(result.Value);
```

### Global Exception Handler

```csharp
// Middleware
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        var exceptionHandlerPathFeature = context.Features.Get<IExceptionHandlerPathFeature>();
        var exception = exceptionHandlerPathFeature?.Error;

        var response = new ProblemDetails
        {
            Title = "An error occurred",
            Detail = exception?.Message,
            Status = StatusCodes.Status500InternalServerError,
            Instance = context.Request.Path
        };

        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(response);
    });
});
```

---

## Validación

### Fluent Validation

```csharp
// Validators/CreateChargeDTOValidator.cs
public class CreateChargeDTOValidator : AbstractValidator<CreateChargeDTO>
{
    public CreateChargeDTOValidator()
    {
        RuleFor(x => x.Amount)
            .GreaterThan(0)
            .WithMessage("Amount must be greater than 0");

        RuleFor(x => x.PropertyId)
            .NotEmpty()
            .WithMessage("Property ID is required");

        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("User ID is required");
    }
}

// En Endpoint
var validator = new CreateChargeDTOValidator();
var validationResult = await validator.ValidateAsync(request);
if (!validationResult.IsValid)
    return TypedResults.BadRequest(validationResult.Errors);
```

---

## Logging

### Serilog

```json
// appsettings.json
{
  "Serilog": {
    "MinimumLevel": {
      "Default": "Information",
      "Override": {
        "Microsoft": "Warning",
        "System": "Warning"
      }
    },
    "WriteTo": [
      { "Name": "Console" },
      {
        "Name": "File",
        "Args": {
          "path": "logs/app-.txt",
          "rollingInterval": "Day",
          "outputTemplate": "{Timestamp:G} [{Level:u3}] {Message:lj}{NewLine}{Exception}"
        }
      }
    ]
  }
}
```

### En Código

```csharp
private readonly ILogger<ChargeAppService> _logger;

public async Task<Result<ChargeResponseDTO>> CreateChargeAsync(...)
{
    _logger.LogInformation("Creating charge for property {PropertyId}", dto.PropertyId);
    
    try
    {
        // ...
        _logger.LogInformation("Charge created successfully: {ChargeId}", charge.Id);
        return Result.Success(dto);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error creating charge");
        throw;
    }
}
```

---

## Migraciones de Datos

### Crear Migración

```bash
cd LuxuryApp.Infrastructure

dotnet ef migrations add AddChargeTable \
    --startup-project ../LuxuryApp.Api \
    --output-dir Data/Migrations
```

### Ejecutar Migraciones

```csharp
// En Program.cs
public static async Task RunMigrationsAsync(this WebApplication app)
{
    using (var scope = app.Services.CreateScope())
    {
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        await db.Database.MigrateAsync();
    }
}

app.RunMigrationsAsync().GetAwaiter().GetResult();
```

---

## Testing

→ Ver [TESTING.md](./TESTING.md)

---

## Relacionado

- [CONVENTIONS.md](../../CONVENTIONS.md) — Reglas de arquitectura
- [../../../docs/SystemLuxuryApp/Security/20260801-arquitectura-system-vault.md](./../../../docs/SystemLuxuryApp/Security/20260801-arquitectura-system-vault.md) — Sistema de Vault propio
- [../../../docs/SharedLuxuryApp/Architecture/20260801-arquitectura-shared-database.md](./../../../docs/SharedLuxuryApp/Architecture/20260801-arquitectura-shared-database.md) — EF Core y migraciones
- [MINIMAL_API_MIGRATION.md](./MINIMAL_API_MIGRATION.md) — MVC → Minimal APIs

---

**Última actualización:** 2026-07-26  
**Propiedad:** Tech Team
