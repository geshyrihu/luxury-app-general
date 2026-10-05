# Comparativo Arquitectónico: Entidades (Actual vs. Refactorizado)

Este documento muestra cómo evolucionará el modelo de dominio de **Cobranza Nativa** para soportar la automatización, las integraciones y las nuevas reglas de negocio estrictas.

---

## 1. Entidad: `CobranzaPayment` (Pagos)

Actualmente, el registro de pago es transaccional pero carece de blindaje contra duplicidad de referencias y no tiene la bandera explícita para la exportación de lotes a Aspel.

### 🔴 Estructura Actual
```csharp
public class CobranzaPayment : GuidIdEntity, ITenantEntity
{
    public Guid PropertyId { get; set; }
    public decimal Amount { get; set; }
    public DateOnly PaymentDate { get; set; }
    public string Reference { get; set; } // Texto libre, sin restricción UNIQUE
    public PaymentStatus Status { get; set; }
    public Guid? CoiPolicyId { get; set; } // Referencia a la póliza en COI (si existe API)
    // ...
}
```

### 🟢 Estructura Refactorizada (Lo Nuevo)
```csharp
public class CobranzaPayment : GuidIdEntity, ITenantEntity
{
    // ... propiedades existentes ...

    // [CAMBIO]: La configuración de EF Core (`EntityTypeConfiguration`) agregará:
    // builder.HasIndex(p => p.Reference).IsUnique();
    public string Reference { get; set; } 

    // [NUEVO]: Bandera para el flujo de Exportación a Aspel mediante Layout (Fase 1)
    [Column("IsExportedToAspel")]
    public bool IsExportedToAspel { get; set; } = false;

    // [NUEVO]: Fecha en la que se generó el layout que contiene este pago
    [Column("ExportedAt")]
    public DateTime? ExportedAt { get; set; }

    // [COMPORTAMIENTO NUEVO]: Los métodos del dominio (Domain Driven Design)
    // impedirán cualquier intento de borrado. Solo se permitirá reversar.
}
```

---

## 2. Entidad: `Charge` (Cargos)

El cargo actual ya está muy bien estructurado (`Amount`, `Balance`, `DiscountDeadline`, etc.). Los cambios aquí son de comportamiento (dominio) y de exportación.

### 🔴 Estructura Actual
```csharp
public class Charge : GuidIdEntity, ITenantEntity
{
    public Guid PropertyId { get; set; }
    public string Concept { get; set; }
    public decimal Amount { get; set; }
    public decimal AmountPaid { get; set; }
    public DateOnly DueDate { get; set; }
    public DateOnly? DiscountDeadline { get; set; }
    public decimal? DiscountAvailable { get; set; }
    // ...
}
```

### 🟢 Estructura Refactorizada (Lo Nuevo)
```csharp
public class Charge : GuidIdEntity, ITenantEntity
{
    // ... propiedades existentes ...

    // [NUEVO]: Bandera para el flujo de Exportación a Aspel mediante Layout (Fase 1)
    [Column("IsExportedToAspel")]
    public bool IsExportedToAspel { get; set; } = false;

    [Column("ExportedAt")]
    public DateTime? ExportedAt { get; set; }

    // [COMPORTAMIENTO NUEVO]: 
    // - Al crear el cargo, la lógica del constructor forzará que `Concept` 
    //   no sea nulo, ni "Cargo Genérico" (RN-COB-003).
    // - Si la regla de excepción de fin de semana aplica, el `DiscountDeadline` 
    //   se seteará internamente al Lunes siguiente.
}
```

---

## 3. Entidad: `Property` / `Member` (Propiedades y Dueños)

Esta es la entidad que más cambios requiere para soportar el **Panel de Preferencias de Notificaciones**.

### 🔴 Estructura Actual
*La entidad actual no tiene preferencias granulares de notificación para el módulo de cobranza, asumiendo envíos globales.*

### 🟢 Estructura Refactorizada (Lo Nuevo)
```csharp
public class Property : GuidIdEntity // (o la entidad Owner/Member correspondiente)
{
    // ... propiedades existentes ...

    // [NUEVO]: Value Object o Columnas directas para el control granular
    [Column("CanReceiveCobranzaSms")]
    public bool CanReceiveCobranzaSms { get; set; } = true;

    [Column("CanReceiveCobranzaWhatsApp")]
    public bool CanReceiveCobranzaWhatsApp { get; set; } = true;

    [Column("CanReceiveCobranzaEmail")]
    public bool CanReceiveCobranzaEmail { get; set; } = true;
}
```

---

## 4. Entidad Nueva: `AspelExportBatch` (Lotes de Exportación)

Para manejar la generación de layouts (Excel/TXT) de forma ordenada y no volver a exportar lo mismo dos veces, se requiere una entidad de control de lotes.

### 🟢 Estructura Nueva
```csharp
[Table("AspelExportBatches")]
public class AspelExportBatch : GuidIdEntity, ITenantEntity
{
    public Guid CustomerId { get; set; }
    
    // Mes y Año del cierre contable (ej. "2026-07")
    [Required]
    public string Period { get; set; } 
    
    public DateTime GeneratedAt { get; set; }
    
    // Ruta del archivo Excel/TXT generado para poder volver a descargarlo
    public string LayoutFileUrl { get; set; }
    
    // Cantidad de cargos y pagos incluidos en este layout
    public int TotalChargesExported { get; set; }
    public int TotalPaymentsExported { get; set; }
}
```

---

## Resumen del Impacto en Base de Datos
1. **Migrations:** Se generará una migración añadiendo `IsExportedToAspel` y `ExportedAt` a `Charges` y `Payments`.
2. **Migrations:** Se añadirán las 3 columnas booleanas de notificaciones a la tabla de Propiedades/Dueños.
3. **Migrations:** Se creará la nueva tabla `AspelExportBatches`.
4. **Constraints:** Se añadirá la restricción de Índice Único (`UNIQUE INDEX`) al campo `Reference` en la tabla `Payments`.
