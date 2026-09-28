# 🗄️ Database Architecture - EF Core 10

## Configuración

### DbContext

```csharp
// LuxuryApp.Infrastructure/Data/ApplicationDbContext.cs
public sealed class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // DbSets por dominio
    public DbSet<Charge> Charges { get; set; }
    public DbSet<Property> Properties { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Payment> Payments { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configuraciones por entidad
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }

    // Override SaveChangesAsync para auditoría
    public override async Task<int> SaveChangesAsync(CancellationToken ct = default)
    {
        var timestamp = DateTime.UtcNow;
        var userId = GetCurrentUserId();

        // Auditoría automática
        foreach (var entry in ChangeTracker.Entries())
        {
            if (entry.Entity is IAuditableEntity auditable)
            {
                if (entry.State == EntityState.Added)
                {
                    auditable.CreatedAt = timestamp;
                    auditable.CreatedBy = userId;
                }

                if (entry.State == EntityState.Modified)
                {
                    auditable.UpdatedAt = timestamp;
                    auditable.UpdatedBy = userId;
                }
            }
        }

        return await base.SaveChangesAsync(ct);
    }

    private string GetCurrentUserId()
    {
        // Implementar según contexto actual (httpcontext, claims, etc.)
        return "system";
    }
}
```

### Registración en DI

```csharp
// Program.cs o Extension
var connectionString = configuration.GetConnectionString("SQLServerConnection");
services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString, sqlOptions =>
    {
        sqlOptions.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName);
        sqlOptions.EnableRetryOnFailure(maxRetryCount: 3, maxRetryDelaySeconds: 30);
    }));
```

---

## Entidades

### Pattern: Base Entity

```csharp
// Core/Entities/BaseEntity.cs
public abstract class BaseEntity
{
    public Guid Id { get; protected set; } = Guid.CreateVersion7();
    public DateTime CreatedAt { get; set; }
    public string CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string UpdatedBy { get; set; }
}

// Interfaz para auditoría automática
public interface IAuditableEntity
{
    DateTime CreatedAt { get; set; }
    string CreatedBy { get; set; }
    DateTime? UpdatedAt { get; set; }
    string UpdatedBy { get; set; }
}
```

### Ejemplo: Charge Entity

```csharp
// Domain/Entities/Charge.cs
[Table("Charges")]
public class Charge : BaseEntity, IAuditableEntity
{
    public Guid PropertyId { get; set; }
    public Guid UserId { get; set; }
    public decimal Amount { get; set; }
    public string Description { get; set; }
    public DateTime DueDate { get; set; }
    public ChargeStatus Status { get; set; }

    // Relaciones
    public Property Property { get; set; }
    public User User { get; set; }
    public ICollection<Payment> Payments { get; set; }

    // Factory method
    public static Charge Create(decimal amount, Guid propertyId, Guid userId, DateTime dueDate)
    {
        if (amount <= 0) throw new ArgumentException("Amount must be positive");
        if (propertyId == Guid.Empty) throw new ArgumentException("PropertyId is required");

        return new Charge
        {
            Amount = amount,
            PropertyId = propertyId,
            UserId = userId,
            DueDate = dueDate,
            Status = ChargeStatus.Pending
        };
    }
}

// Enum
public enum ChargeStatus
{
    Pending = 1,
    Paid = 2,
    Overdue = 3,
    Cancelled = 4
}
```

---

## Entity Configuration (Fluent API)

### Pattern: IEntityTypeConfiguration

```csharp
// Data/EntityConfigurations/ChargeConfiguration.cs
public sealed class ChargeConfiguration : IEntityTypeConfiguration<Charge>
{
    public void Configure(EntityTypeBuilder<Charge> builder)
    {
        builder.HasKey(x => x.Id);

        // Propiedades
        builder.Property(x => x.Amount)
            .HasPrecision(18, 2)
            .IsRequired();

        builder.Property(x => x.Description)
            .HasMaxLength(500);

        builder.Property(x => x.Status)
            .HasConversion<int>();

        // Índices
        builder.HasIndex(x => x.PropertyId);
        builder.HasIndex(x => x.UserId);
        builder.HasIndex(x => x.DueDate);
        builder.HasIndex(x => new { x.PropertyId, x.Status });

        // Relaciones
        builder.HasOne(x => x.Property)
            .WithMany(p => p.Charges)
            .HasForeignKey(x => x.PropertyId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        // Valores por defecto
        builder.Property(x => x.CreatedAt)
            .HasDefaultValueSql("GETUTCDATE()");

        // Queries shadow properties
        builder.Property<DateTime>("_deletedAt").HasColumnName("DeletedAt");
    }
}
```

### Auto-Registro de Configuraciones

```csharp
// En OnModelCreating del DbContext
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);
    
    // Buscar todas las configuraciones
    modelBuilder.ApplyConfigurationsFromAssembly(
        typeof(ApplicationDbContext).Assembly
    );
}
```

---

## Migraciones

### Crear Migración

```bash
# En directorio del proyecto
cd LuxuryApp.Infrastructure

# Crear migración
dotnet ef migrations add AddChargeTable \
    --startup-project ../LuxuryApp.Api \
    --output-dir Data/Migrations

# Migraciones pendientes
dotnet ef migrations list

# Remover última migración (no aplicada)
dotnet ef migrations remove
```

### Archivo de Migración

```csharp
// Data/Migrations/20260726000000_AddChargeTable.cs
public partial class AddChargeTable : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "Charges",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                PropertyId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                Status = table.Column<int>(type: "int", nullable: false),
                CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                CreatedBy = table.Column<string>(type: "nvarchar(450)", maxLength: 450, nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Charges", x => x.Id);
                table.ForeignKey(
                    name: "FK_Charges_Properties_PropertyId",
                    column: x => x.PropertyId,
                    principalTable: "Properties",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Restrict);
            });

        migrationBuilder.CreateIndex(
            name: "IX_Charges_PropertyId",
            table: "Charges",
            column: "PropertyId");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(name: "Charges");
    }
}
```

### Aplicar Migraciones

```bash
# Aplicar migraciones
dotnet ef database update --startup-project ../LuxuryApp.Api

# Aplicar hasta una migración específica
dotnet ef database update 20260726000000_AddChargeTable

# Revertir última migración
dotnet ef database update <previous-migration-name>
```

---

## Providers: SQL Server vs PostgreSQL

### Configuración Dual

```csharp
// appsettings.json
{
  "Database": {
    "Provider": "SqlServer"  // o "PostgreSql"
  }
}

// Extension en Program.cs
public static IServiceCollection AddDatabaseServices(
    this IServiceCollection services,
    IConfiguration configuration)
{
    var databaseProvider = configuration["Database:Provider"];
    var connectionString = databaseProvider switch
    {
        "PostgreSql" => configuration.GetConnectionString("PostgreSQLConnection"),
        _ => configuration.GetConnectionString("SQLServerConnection")
    };

    if (databaseProvider == "PostgreSql")
    {
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(connectionString));
    }
    else
    {
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(connectionString));
    }

    return services;
}
```

### Migraciones por Provider

```bash
# SQL Server
dotnet ef migrations add AddChargeTable -c ApplicationDbContext \
    -p LuxuryApp.Infrastructure -s LuxuryApp.Api

# PostgreSQL (mismo DbContext, diferentes migraciones)
# EF Core maneja ambas automáticamente
```

---

## Queries

### Repository Pattern

```csharp
// Infrastructure/Repositories/ChargeRepository.cs
public sealed class ChargeRepository : IChargeRepository
{
    private readonly ApplicationDbContext _db;

    public ChargeRepository(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<Charge> GetByIdAsync(Guid id, CancellationToken ct)
    {
        return await _db.Charges
            .Include(x => x.Property)
            .Include(x => x.Payments)
            .FirstOrDefaultAsync(x => x.Id == id, ct);
    }

    public async Task<List<Charge>> GetByPropertyAsync(Guid propertyId, CancellationToken ct)
    {
        return await _db.Charges
            .Where(x => x.PropertyId == propertyId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync(ct);
    }

    public async Task AddAsync(Charge charge, CancellationToken ct)
    {
        await _db.Charges.AddAsync(charge, ct);
    }

    public async Task SaveChangesAsync(CancellationToken ct)
    {
        await _db.SaveChangesAsync(ct);
    }
}
```

### Queries Complejas

```csharp
// Specification Pattern (opcional)
public class GetChargesByPropertySpecification : Specification<Charge>
{
    public GetChargesByPropertySpecification(Guid propertyId)
    {
        Query
            .Where(c => c.PropertyId == propertyId)
            .Include(c => c.Property)
            .Include(c => c.Payments)
            .OrderByDescending(c => c.DueDate);
    }
}

// Uso
var spec = new GetChargesByPropertySpecification(propertyId);
var charges = await _repository.GetBySpecAsync(spec, ct);
```

---

## Performance

### Índices

```csharp
// En ChargeConfiguration
builder.HasIndex(x => x.PropertyId);
builder.HasIndex(x => x.Status);
builder.HasIndex(x => new { x.PropertyId, x.Status });  // Composite
```

### Include vs Lazy Loading

```csharp
// ✅ BUENO: Eager loading (una query)
var charge = await _db.Charges
    .Include(x => x.Property)
    .Include(x => x.Payments)
    .FirstOrDefaultAsync(x => x.Id == id);

// ❌ MALO: N+1 queries (lazy loading sin tracking)
var charge = await _db.Charges.FirstOrDefaultAsync(x => x.Id == id);
var property = charge.Property;  // Extra query

// ✅ ALTERNATIVA: AsNoTracking para queries de solo lectura
var charge = await _db.Charges
    .AsNoTracking()
    .Include(x => x.Property)
    .FirstOrDefaultAsync(x => x.Id == id);
```

### Proyecciones

```csharp
// ✅ BUENO: Select solo campos necesarios
var chargesDto = await _db.Charges
    .Where(x => x.PropertyId == propertyId)
    .Select(x => new ChargeDTO
    {
        Id = x.Id,
        Amount = x.Amount,
        Status = x.Status,
        PropertyName = x.Property.Name
    })
    .ToListAsync();
```

---

## Seeders

### Patrón de Seeder

```csharp
// Data/Seeders/InitialDataSeeder.cs
public static class InitialDataSeeder
{
    public static async Task SeedAsync(ApplicationDbContext db)
    {
        if (await db.Properties.AnyAsync())
            return;  // Ya tiene datos

        // Crear propiedades de prueba
        var properties = new[]
        {
            Property.Create("Dept 101", "Building A"),
            Property.Create("Dept 102", "Building A")
        };

        await db.Properties.AddRangeAsync(properties);
        await db.SaveChangesAsync();
    }
}

// En Program.cs
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await db.Database.MigrateAsync();
    await InitialDataSeeder.SeedAsync(db);
}
```

---

## Relacionado

- [CONVENTIONS.md](../../CONVENTIONS.md) — Reglas de arquitectura
- [../../../docs/SharedLuxuryApp/Architecture/20260801-arquitectura-shared-api.md](./../../../docs/SharedLuxuryApp/Architecture/20260801-arquitectura-shared-api.md) — Estructura de APIs
- [TESTING.md](./TESTING.md) — Testing de datos

---

**Última actualización:** 2026-07-26  
**Propiedad:** Tech Team
