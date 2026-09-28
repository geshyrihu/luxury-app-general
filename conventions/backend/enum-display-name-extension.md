# Extensión GetDisplayName() para Enums

**Versión:** 1.0  
**Fecha:** 2026-07-30  
**Aplica a:** Todos los enums en backend

---

## Propósito

Crear un **método de extensión único** `GetDisplayName()` que simplifique la obtención del `DisplayName` desde cualquier enum en el código.

---

## Implementación Obligatoria

**Ubicación:** `api/LuxuryApp.Application/Shared/Extensions/EnumExtensions.cs` (ya existe, verificado 2026-09-09)

```csharp
using System.ComponentModel.DataAnnotations;

namespace Shared.Extensions;

/// <summary>
/// Extensiones para obtener DisplayName de enums.
/// REGLA CRÍTICA: Todos los enums deben usarlas para listados.
/// </summary>
public static class EnumExtensions
{
    /// <summary>
    /// Obtiene el DisplayName del valor enum en español.
    /// Si no tiene atributo Display, devuelve el ToString().
    /// </summary>
    public static string GetDisplayName<T>(this T value) where T : Enum
    {
        var type = value.GetType();
        var memberInfo = type.GetMember(value.ToString()).FirstOrDefault();
        
        if (memberInfo == null)
            return value.ToString();
        
        var attribute = memberInfo.GetCustomAttribute<DisplayAttribute>();
        return attribute?.Name ?? value.ToString();
    }
}
```

---

## Uso

### ✅ Patrón Obligatorio

```csharp
// Ejemplo 1: En un servicio, obtener DisplayName de un enum
public InspectionDTO MapToDTO(Inspection inspection)
{
    return new InspectionDTO
    {
        Id = inspection.Id,
        Frequency = inspection.Frequency.GetDisplayName(),  // ← Extensión
        Severity = inspection.Severity.GetDisplayName(),    // ← Extensión
        Status = inspection.Status.GetDisplayName()         // ← Extensión
    };
}

// Ejemplo 2: En SelectItemEnumEndPoints
var items = Enum.GetValues(typeof(SeverityLevel))
    .Cast<SeverityLevel>()
    .Select(e => new SelectItemDTO<int>
    {
        Id = (int)e,
        Value = e.ToString(),
        Text = e.GetDisplayName()  // ← Extensión (simplificado)
    })
    .ToList();

// Ejemplo 3: En reportes o listados
var frequencyText = inspection.Frequency.GetDisplayName();  // "Semanal"
var severityText = inspection.Severity.GetDisplayName();    // "Crítica"
```

---

## Enum Declaration (Obligatorio)

**TODOS los enums DEBEN tener Display atributos:**

```csharp
// ✅ CORRECTO
public enum FrequencyType
{
    [Display(Name = "Diaria")]
    DAILY = 1,
    
    [Display(Name = "Semanal")]
    WEEKLY = 2,
    
    [Display(Name = "Mensual")]
    MONTHLY = 3,
    
    [Display(Name = "Trimestral")]
    QUARTERLY = 4,
    
    [Display(Name = "Anual")]
    YEARLY = 5
}

// ❌ PROHIBIDO: Sin Display atributos
public enum BadEnum
{
    DAILY = 1,
    WEEKLY = 2
}
```

---

## Comparación: Antes vs Después

### ANTES (Tedioso)

```csharp
// Sin extensión: repetir lógica en cada lugar
private static string GetDisplayName<T>(T value) where T : Enum
{
    var memberInfo = value.GetType()
        .GetMember(value.ToString())
        .FirstOrDefault();
    
    var attribute = memberInfo?
        .GetCustomAttribute<DisplayAttribute>();
    
    return attribute?.Name ?? value.ToString();
}

// Usar:
var text = GetDisplayName(inspection.Frequency);
```

### DESPUÉS (Elegante)

```csharp
// Con extensión: una sola línea, en cualquier lugar
var text = inspection.Frequency.GetDisplayName();  // "Semanal"
```

---

## Auditoría

### STEP 1.8 - Búsqueda 5: Verificar uso de GetDisplayName()

```bash
# Verificar que SelectItemEnumEndPoints usa extensión GetDisplayName()
grep -n "\.GetDisplayName()" {backend_path}/Modules/SharedLuxuryApp/Endpoints/SelectItemEnumEndPoints.cs

# Esperado: ≥1 resultado (confirmando uso de extensión)

# Buscar patrones viejos (PROHIBIDO)
grep -r "GetCustomAttribute<DisplayAttribute>" {backend_path} | grep -v "EnumExtensions"

# Esperado: 0 resultados (no duplicar lógica)
```

### STEP 1.8 - Búsqueda 6: Validar que NO hay selects sin GetDisplayName()

```bash
# Buscar selects que devuelven enums SIN GetDisplayName()
grep -r "\.ToString()" {backend_path} | grep -i "enum\|frequency\|severity\|status"

# Revisar manualmente si son selects y si deberían usar GetDisplayName()
```

---

## Criterios de Cumplimiento

| Aspecto | Esperado | Status | Severidad |
|:---|:---|:---|:---|
| EnumExtensions.cs existe | SÍ | ✓/❌ | CRÍTICA |
| GetDisplayName() está en Shared.Extensions | SÍ | ✓/❌ | CRÍTICA |
| Todos enums tienen [Display(Name="...")] | 100% | ✓/⚠️/❌ | CRÍTICA |
| SelectItemEnumEndPoints usa GetDisplayName() | 100% | ✓/⚠️/❌ | CRÍTICA |
| No hay duplicación de lógica GetDisplayName | 0 duplicaciones | ✓/❌ | ALTA |

---

## FAQ

### ¿Qué pasa si un enum NO tiene Display atributo?

GetDisplayName() devuelve el ToString() del enum (raw name):
```csharp
[Display(Name = "Crítica")]
CRITICAL = 1;              // GetDisplayName() → "Crítica"

HIGH = 2;                  // GetDisplayName() → "HIGH" (fallback)
```

**Pero esto es VIOLACIÓN CRÍTICA.** Todos los enums DEBEN tener Display.

### ¿Puedo usar GetDisplayName() en el frontend?

❌ NO. Esta extensión es solo backend.

Frontend recibe el `Text` (DisplayName) desde SelectItemEnumEndPoints:
```json
{ id: 1, value: "CRITICAL", text: "Crítica" }  ← Ya es DisplayName
```

Frontend solo usa `text`, nunca hace GetDisplayName().

### ¿Dónde va la extensión EnumExtensions.cs?

**Ubicación obligatoria:**
```
api/LuxuryApp.Application/Shared/
└── Extensions/
    └── EnumExtensions.cs
```

Namespace: `Shared.Extensions`

### ¿Se puede usar en DTOs?

✅ SÍ, para MapToDTO:
```csharp
public InspectionDTO MapToDTO(Inspection inspection)
{
    return new InspectionDTO
    {
        FrequencyName = inspection.Frequency.GetDisplayName(),
        // ...
    };
}
```

---

## Referencia

- [Backend Rules - DisplayName en Español](../backend/backend-rules.md)
- [Select Items Centralization Rule](../backend/select-items-centralization-rule.md)
- [CONVENTIONS.md §6.1](../CONVENTIONS.md#61-shared-contratos-y-dtos)

---

**Vigente desde:** 2026-07-30  
**Estado:** CRÍTICA - Obligatoria para todos los enums  
**Pattern:** Extensión centralizada, reutilizable, elegante
