# 📊 Análisis de Warnings de EF Core - Decisiones Arquitectónicas

**Fecha:** 2026-08-01  
**Total Warnings:** 7 (5 de Global Query Filters + 2 de Decimal Precision)

---

## 🔴 CATEGORÍA 1: Global Query Filter Warnings (5 casos)

### Problema Base
Cuando una entidad tiene **global query filter** (ej: `IsDeleted == false`) y es el **required end** de una relación:
- El filtro puede excluir registros padres
- Los registros hijos quedan huérfanos (integridad referencial rota)
- EF Core advierte que podrían haber resultados inesperados

### Entidades Afectadas
1. **PeriodoNomina** ← DiasNoHabiles (required)
2. **GoogleCalendarEvent** ← GoogleCalendarGuest (required)
3. **NominaEncabezado** ← NominaDetalle (required)
4. **PrestamoEmpleado** ← PagoPrestamoNomina (required)
5. **Incident** ← RequestDismissalIncident + SuspensionDay (required)

### Soluciones Disponibles

#### ✅ OPCIÓN A: Hacer navegación OPTIONAL (RECOMENDADO)
```csharp
// Antes (required):
public required GoogleCalendarEvent GoogleCalendarEvent { get; set; }

// Después (optional):
public GoogleCalendarEvent? GoogleCalendarEvent { get; set; }
```
**Pros:** Simple, permite que hijo exista sin padre  
**Contras:** Cambia semántica (padre ahora puede ser nulo)  
**Impacto:** Bajo si la lógica ya maneja nulls

---

#### ⚠️ OPCIÓN B: Agregar filtro a AMBAS entidades
```csharp
// En OnModelCreating:
modelBuilder.Entity<GoogleCalendarEvent>()
    .HasQueryFilter(e => !e.IsDeleted); // Agregar aquí también

modelBuilder.Entity<GoogleCalendarGuest>()
    .HasQueryFilter(e => !e.IsDeleted); // Ya existe
```
**Pros:** Mantiene integridad referencial  
**Contras:** Requiere que ambas entidades tengan `IsDeleted`  
**Impacto:** Moderado (cambio en múltiples entities)

---

#### ❌ OPCIÓN C: Remover global filter del padre
```csharp
// NO recomendar para soft-delete patterns
```
**Contras:** Pierde el soft-delete del padre  
**Impacto:** Alto (cambio de patrón)

---

### Matriz de Decisión para cada entidad

| Entidad | Relación | Soft-Delete Ambas? | Impacto Query | Decisión Recomendada |
|---------|----------|-------------------|---------------|----------------------|
| **PeriodoNomina** | ← DiasNoHabiles | ✓ Sí | Bajo | OPCIÓN B (ambas tienen IsDeleted) |
| **GoogleCalendarEvent** | ← GoogleCalendarGuest | ✓ Parcial | Medio | OPCIÓN A (Guest puede no tener Event) |
| **NominaEncabezado** | ← NominaDetalle | ✓ Sí | Bajo | OPCIÓN B (ambas usan IsDeleted) |
| **PrestamoEmpleado** | ← PagoPrestamoNomina | ✓ Sí | Bajo | OPCIÓN B (ambas tienen IsDeleted) |
| **Incident** | ← RequestDismissalIncident + SuspensionDay | ✓ Sí | Alto | OPCIÓN B (mantener integridad crítica) |

---

## 🟡 CATEGORÍA 2: Decimal Precision Warnings (2 casos)

### Problema Base
Propiedades `decimal` sin especificar **precisión y escala** en SQL Server:
- Por defecto SQL Server usa `decimal(18,0)` (sin decimales)
- Valores se **truncan silenciosamente** si tienen decimales
- EF Core advierte sobre pérdida de datos potencial

### Entidades Afectadas
1. **ConfiguracionNomina.FactorPrimaVacacional** (decimales perdidos)
2. **OrdenCompraFactura.Monto** (decimales perdidos)

### Soluciones Disponibles

#### ✅ OPCIÓN A: HasPrecision (RECOMENDADO)
```csharp
modelBuilder.Entity<ConfiguracionNomina>()
    .Property(e => e.FactorPrimaVacacional)
    .HasPrecision(18, 4); // 18 dígitos total, 4 después del punto

modelBuilder.Entity<OrdenCompraFactura>()
    .Property(e => e.Monto)
    .HasPrecision(18, 2); // Típico para moneda
```
**Pros:** Explícito, moderno, fácil de leer  
**Impacto:** Bajo (solo metadata en DB)

---

#### ⚠️ OPCIÓN B: HasColumnType (Legacy)
```csharp
.HasColumnType("decimal(18,2)")
```
**Pros:** Preciso pero más verboso  
**Impacto:** Bajo

---

### Valores Recomendados por Caso de Uso

| Campo | Tipo | Precisión | Razón |
|-------|------|-----------|-------|
| **FactorPrimaVacacional** | Porcentaje/Factor | `decimal(18, 4)` | Factores pueden tener 4 decimales |
| **Monto** | Moneda | `decimal(18, 2)` | Estándar ISO 4217 (2 decimales) |

---

## 📋 Plan de Acción Recomendado

### PRIORIDAD ALTA: Decimal Precision (30 min)
```csharp
// En LuxuryApp.Infrastructure.Data.Entities → OnModelCreating
modelBuilder.Entity<ConfiguracionNomina>()
    .Property(e => e.FactorPrimaVacacional).HasPrecision(18, 4);

modelBuilder.Entity<OrdenCompraFactura>()
    .Property(e => e.Monto).HasPrecision(18, 2);
```
**Razón:** Evita pérdida de datos silenciosa  
**Riesgo si NO se hace:** Truncamiento de valores en producción

---

### PRIORIDAD MEDIA: Global Filters (1-2 horas)
Implementar OPCIÓN B para entidades críticas (Nomina, Incident):
```csharp
// Agregar HasQueryFilter a entidades "detalle"
modelBuilder.Entity<NominaDetalle>()
    .HasQueryFilter(e => !e.IsDeleted);

modelBuilder.Entity<RequestDismissalIncident>()
    .HasQueryFilter(e => !e.IsDeleted);

modelBuilder.Entity<SuspensionDay>()
    .HasQueryFilter(e => !e.IsDeleted);
```

**Razón:** Mantiene integridad referencial en soft-deletes  
**Riesgo si NO se hace:** Consultas pueden devolver resultados inconsistentes

---

### OPCIÓN A para GoogleCalendarEvent (Menor riesgo)
```csharp
public GoogleCalendarEvent? GoogleCalendarEvent { get; set; } // Nullable
```
**Razón:** Los eventos pueden desaparecer sin huérfanos  
**Riesgo:** Bajo (validar nullability en queries)

---

## 🎯 Estimación de Esfuerzo

| Tarea | Archivo | Líneas | Tiempo |
|-------|---------|--------|--------|
| Decimal Precision (ambas) | OnModelCreating | 2-4 | 5 min |
| Global Filters Nomina | OnModelCreating | 3-6 | 10 min |
| Global Filters Incident | OnModelCreating | 3-6 | 10 min |
| GoogleCalendarEvent Optional | Entities | 1 | 2 min |
| **Testing post-cambios** | Unit + Integration | - | 30 min |
| **TOTAL** | - | - | **~60 min** |

---

## ✅ Checklist Post-Implementación

- [ ] Decimals reciben precision correcta (18,2) o (18,4)
- [ ] Soft-delete entities tienen query filter consistente
- [ ] GoogleCalendarEvent.GoogleCalendarEvent es nullable
- [ ] Tests verifican integridad referencial
- [ ] Build sin warnings: ✅ 0 WRN
- [ ] Scalar documentation actualizada (si cambias schemas)

---

## 📌 Referencias

- Microsoft Docs: [Global Query Filters](https://docs.microsoft.com/en-us/ef/core/querying/filters)
- Microsoft Docs: [Data Validation - Precision](https://docs.microsoft.com/en-us/ef/core/modeling/entity-properties#precision-and-scale)
- Soft Delete Pattern: https://docs.microsoft.com/en-us/ef/core/querying/filters

