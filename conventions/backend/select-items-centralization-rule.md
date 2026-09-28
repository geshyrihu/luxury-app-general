# Regla Crítica: Centralización de SELECTs de Enums y Valores

**Versión:** 1.1  
**Fecha:** 2026-07-31  
**Severidad:** 🔴 CRÍTICA  
**Estatus:** Vigente y obligatoria

---

## Propósito

Garantizar que **todos los SELECTs** provienen de **hubs centralizados oficiales**,
evitando duplicación, inconsistencia y endpoints ad hoc en módulos de negocio.

---

## Arquitectura: Dos Hubs Centralizados

| Tipo de SELECT | Hub oficial | Ruta API | Ubicación en código |
|:---|:---|:---|:---|
| **Enums y catálogos estáticos** | SharedLuxuryApp | `GET /api/select-item-enum/{ruta-mapeada}` | `api/LuxuryApp.Application/Modules/SharedLuxuryApp/Endpoints/SelectItemEnumEndPoints.cs` |
| **Entidades y datos dinámicos** | SystemLuxuryApp | `GET /api/select-items/{ruta}` | `api/LuxuryApp.Application/Modules/SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs` |

**Nota:** `{ruta-mapeada}` no es un parámetro genérico; cada enum se registra con una
ruta explícita (ej. `severity-level`, `blood-type`). Consultar el archivo del hub
antes de consumir o agregar una ruta nueva.

**Regla transversal:** Ningún módulo de dominio (CobranzaNativa, SolicitudCompra, etc.)
puede exponer endpoints SelectItem propios. Solo los dos hubs anteriores.

---

## La Regla Explícita

### ✅ OBLIGATORIO

```
SELECTs de enums y catálogos estáticos → SelectItemEnumEndPoints
  └─ GET /api/select-item-enum/{ruta-mapeada}?defaultOption

SELECTs de entidades/datos dinámicos (usuarios, bancos, roles, etc.)
  └─ SelectItemEndPoints
  └─ GET /api/select-items/{ruta}
```

### ❌ PROHIBIDO

```
NUNCA hacer lo siguiente:
1. Crear SelectItem endpoints en módulos de negocio individuales
2. Crear SelectItemDTO en módulos individuales
3. Hacer queries directas a enums desde frontend
4. Implementar selectitem helpers en servicios de módulo de dominio
```

### 🔴 CRÍTICA: NUNCA modificar un SelectItem/SelectItemEnum existente

Si el catálogo actual NO se adapta a nuevas necesidades:

- ✅ CORRECTO: crear un SelectItem/SelectItemEnum **nuevo** con nombre distinto, registrarlo en el hub y usarlo.
- ❌ PROHIBIDO: modificar el SelectItem/SelectItemEnum existente (rompe a los servicios que ya lo consumen).

**Por qué:** cada módulo asume que la lista tiene los valores que tenía cuando la integró. Cambiarla afecta a todos los consumidores a la vez.

```
Hoy:  Módulo A lee SelectItem "Status" → valores [Abierto, Cerrado, Liquidado]
      Módulo B valida: "Solo Abierto y Cerrado" (no Liquidado)

Si modificas: SelectItem "Status" → [Abierto, Cerrado, Liquidado, Pendiente]

RESULTADO: Módulo A ahora obtiene "Pendiente", Módulo B lo rechaza → ERROR.
           Módulo C (que esperaba Liquidado) falla si no está.
```

**Solución:** crear `SelectItemStatusExtended` con [Abierto, Cerrado, Liquidado, Pendiente] y usarlo solo en el módulo que lo necesita.

**Impacto auditoría:** hallazgo CRÍTICO si existen endpoints SelectItem fuera de los dos hubs centralizados, o si un SelectItem/SelectItemEnum fue modificado después de su creación.

---

## Flujo Obligatorio — Enums (SharedLuxuryApp)

```
PASO 1: Frontend necesita SELECT de enum
├─ Ejemplo: usuario desea elegir "Severity Level" en form
└─ NO hace query directa ni llama endpoint del módulo de negocio

PASO 2: Frontend invoca hub de enums
├─ GET /api/select-item-enum/severity-level
└─ Header: Accept-Language (para i18n si aplica)

PASO 3: SelectItemEnumEndPoints mapea la ruta
├─ Valida que el enum existe en la autoridad central
├─ Obtiene valores desde el enum actual (vivo en código)
└─ Aplica caché 24h por enum

PASO 4: Retorna contrato estándar
├─ SelectItemDTO<int>
├─ { id: 1, value: "CRITICAL", text: "Crítica" }
└─ Array de opciones, opcional con defaultOption

PASO 5: Frontend usa respuesta
├─ Llena <select>, <mat-select>, o componente dropdown
└─ Usuario elige valor, frontend envía `id` (no `value`)
```

---

## Flujo Obligatorio — Entidades dinámicas (SystemLuxuryApp)

Cuando el SELECT depende de datos de base de datos o contexto (usuarios, bancos,
roles, almacenes, etc.), usar el hub `SelectItemEndPoints`:

```
PASO 1: Frontend necesita SELECT dinámico
└─ Ejemplo: elegir banco, rol de aplicación o usuario por customerId

PASO 2: Frontend invoca hub de entidades
└─ GET /api/select-items/{ruta}  (ej. banks, application-roles, almacenes/{customerId})

PASO 3: SelectItemEndPoints delega a ISelectItemAppService
└─ Retorna SelectItemDTO según contrato del servicio centralizado

PASO 4: Frontend usa respuesta con el mismo patrón de dropdown oficial
```

**Ubicación:** `api/LuxuryApp.Application/Modules/SystemLuxuryApp/SelectItem/EndPoints/SelectItemEndPoints.cs`

**Regla:** No crear rutas `api/select-items/*` ni `api/select-item-enum/*` fuera de
estos dos archivos hub.

---

## Implementación en SelectItemEnumEndPoints

### Cómo agregar un nuevo enum

**Ubicación:** `api/LuxuryApp.Application/Modules/SharedLuxuryApp/Endpoints/SelectItemEnumEndPoints.cs`

```csharp
// En MapGroup o durante registration:

Map<SeverityLevel>(
    route: "severity-level",
    operationId: "EnumSelectItem_GetSeverityLevel",
    summary: "Obtiene lista de severidades disponibles"
);

Map<IncidentCategory>(
    route: "incident-category", 
    operationId: "EnumSelectItem_GetIncidentCategory",
    summary: "Obtiene categorías de incidente"
);

// Método genérico Map<TEnum> internamente:
// ✓ Valida que TEnum es un enum
// ✓ Obtiene valores actuales
// ✓ Mapea a SelectItemDTO<int>
// ✓ Cachea 24h
```

### Caché Centralizado

```csharp
private static readonly TimeSpan TtlEnum = TimeSpan.FromHours(24);

// En endpoint resolver:
// if (cache.TryGetValue(cacheKey, out var cachedResult))
//    return cachedResult;
// else
//    fetch → cache → return

// Impacto: Frontend obtiene respuesta en <10ms si está cacheada
```

### Contrato SelectItemDTO

```csharp
public record SelectItemDTO<T>
{
    public T Id { get; init; }
    public string Value { get; init; }      // enum name: "CRITICAL"
    public string Text { get; init; }       // 🔴 DEBE ser DisplayName en ESPAÑOL
}

// 🔴 REGLA CRÍTICA: Text = DisplayName del enum (siempre en español)
// ✅ Ejemplo correcto de respuesta:
[
  { id: 1, value: "CRITICAL", text: "Crítica" },
  { id: 2, value: "HIGH", text: "Alta" },
  { id: 3, value: "MEDIUM", text: "Media" },
  { id: 4, value: "LOW", text: "Baja" }
]

// ❌ PROHIBIDO: Devolver raw enum names
[
  { id: 1, value: "CRITICAL", text: "CRITICAL" },      // ← INCORRECTO
  { id: 2, value: "HIGH", text: "HIGH" }                // ← INCORRECTO
]
```

### Cómo Obtener DisplayName (Implementación)

**En SelectItemEnumEndPoints:**

```csharp
// ✅ OBLIGATORIO: Usar extensión GetDisplayName()
// (Definida en api/LuxuryApp.Application/Shared/Extensions/EnumExtensions.cs)

Map<SeverityLevel>(
    route: "severity-level",
    operationId: "EnumSelectItem_GetSeverityLevel",
    handler: async () =>
    {
        var items = Enum.GetValues(typeof(SeverityLevel))
            .Cast<SeverityLevel>()
            .Select(e => new SelectItemDTO<int>
            {
                Id = (int)e,
                Value = e.ToString(),              // "CRITICAL", "HIGH", etc.
                Text = e.GetDisplayName()          // "Crítica", "Alta", etc. ← Extensión
            })
            .ToList();
        
        return Results.Ok(items);
    }
);
```

**Extensión (ubicada en Shared):**

```csharp
// api/LuxuryApp.Application/Shared/Extensions/EnumExtensions.cs
public static class EnumExtensions
{
    /// <summary>
    /// Obtiene el DisplayName del valor enum en español.
    /// </summary>
    public static string GetDisplayName<T>(this T value) where T : Enum
    {
        var memberInfo = value.GetType()
            .GetMember(value.ToString())
            .FirstOrDefault();
        
        var attribute = memberInfo?
            .GetCustomAttribute<DisplayAttribute>();
        
        return attribute?.Name ?? value.ToString();
    }
}
```

**Uso en cualquier lugar:**

```csharp
// Inspections service:
var frequencyName = inspection.Frequency.GetDisplayName();  // "Semanal"

// DTO mapping:
return new InspectionDTO
{
    Id = inspection.Id,
    Frequency = inspection.Frequency.GetDisplayName(),  // ← Una línea elegante
    Severity = inspection.Severity.GetDisplayName()
};
```

**Enum con DisplayName (obligatorio):**

```csharp
// ✅ CORRECTO: Cada enum value debe tener DisplayName
public enum SeverityLevel
{
    [Display(Name = "Crítica")]
    CRITICAL = 1,
    
    [Display(Name = "Alta")]
    HIGH = 2,
    
    [Display(Name = "Media")]
    MEDIUM = 3,
    
    [Display(Name = "Baja")]
    LOW = 4
}

// ❌ PROHIBIDO: Enums sin DisplayName
public enum BadSeverity
{
    CRITICAL = 1,   // ← Sin Display attribute
    HIGH = 2,
    MEDIUM = 3
}
```

---

## Validación en Auditoría

### STEP 1.8: Verificar SELECTs (Centralización Obligatoria)

**Objetivo:** Asegurar que NO existen endpoints SelectItem repartidos por módulos.

### Búsqueda 1: Verificar unicidad

```bash
# ✅ Debe haber SOLO 1 coincidencia (en SharedLuxuryApp)
grep -r "SelectItemEnumEndPoints" {backend_path}

# Esperado:
# SharedLuxuryApp/Endpoints/SelectItemEnumEndPoints.cs:public class SelectItemEnumEndPoints
# Resultado: 1 archivo
```

### Búsqueda 2: Encontrar violaciones (endpoints en módulos)

```bash
# ❌ NO debe haber ningún resultado
find {backend_path} -name "*SelectItem*.cs" -not -path "*/SharedLuxuryApp/*"

# Esperado: 0 resultados

# Si encuentra algo:
# ❌ VIOLACIÓN CRÍTICA ENCONTRADA
# Plan de acción: consolidar endpoints y migrar consumidores
```

### Búsqueda 3: Detectar queries directas a enums (PROHIBIDO)

```bash
# ❌ NO debe haber query directo fuera de SelectItemEnumEndPoints
grep -r "\.ToSelectList\|\.ToSelectItemDTO" {backend_path} | grep -v "SelectItemEnumEndPoints"

# Esperado: 0 resultados

# Si encuentra algo:
# ❌ VIOLACIÓN ENCONTRADA
# Ejemplo: IncidentService haciendo "incidents.Select(x => new SelectItemDTO(...))"
# Plan de acción: deletegar al endpoint centralizado
```

### Tabla de Resultados de Auditoría

| Búsqueda | Esperado | Actual | Status | Severidad |
|:---|:---|:---|:---|:---|
| SelectItemEnumEndPoints existe | 1 resultado | ? | ✓ OK / ❌ CRÍTICO | CRÍTICA |
| Endpoints en módulos | 0 resultados | ? | ✓ OK / ❌ CRÍTICO | CRÍTICA |
| Queries directas fuera | 0 resultados | ? | ✓ OK / ⚠️ ALTA | ALTA |

---

## Por Qué Esta Regla (Why)

### Problemas que Evita

1. **Duplicación:** Cada módulo inventa su propia forma de obtener enums
   - Incidentes: `GET /incidents/select-severity`
   - Inspecciones: `GET /inspections/select-severity`
   - Tickets: `GET /tickets/select-severity`
   - ❌ 3 endpoints idénticos, mantenimiento imposible

2. **Inconsistencia:** Respuestas diferente según el módulo
   ```json
   // Incidentes devuelve:
   { id: 1, name: "CRITICAL" }
   
   // Inspecciones devuelve:
   { code: 1, label: "Crítica" }
   
   // Tickets devuelve:
   { value: 1, display: "CRITICAL", text: "Crítica" }
   ```

3. **Mantenimiento:** Si hay que cambiar un enum, hay que tocar N módulos
   - Cambio: SeverityLevel ahora tiene 5 valores en lugar de 4
   - Impacto: Revisar N endpoints, N servicios, N pruebas

4. **Cache ineficiente:** Cada módulo cachea por separado
   - Incidentes cachea por 1 hora
   - Inspecciones cachea por 30 min
   - Tickets sin caché
   - ❌ Múltiples llamadas a BD para lo mismo

### Beneficios de Centralizar

✅ **Single Source of Truth:** Un lugar donde viven todos los enums  
✅ **Contrato único:** Frontend sabe exactamente qué esperar  
✅ **Caché eficiente:** Todos comparten el mismo caché 24h  
✅ **Fácil mantenimiento:** Cambiar enum → cambiar 1 lugar  
✅ **Auditoría simple:** `grep SelectItemEnumEndPoints` → debe devolver 1  
✅ **Testing centralizado:** Pruebas en 1 lugar, validan para todos

---

## Cómo Aplicar Esta Regla

### Escenario 1: Módulo Nuevo Necesita un SELECT

**PASOS:**

1. Módulo tiene un enum nuevo: `MyEnum`
2. Necesita mostrar opciones en un formulario

**HACER:**

```csharp
// ✅ CORRECTO: Agregar a SelectItemEnumEndPoints

Map<MyEnum>(
    route: "my-enum",
    operationId: "EnumSelectItem_GetMyEnum",
    summary: "Obtiene opciones de MyEnum"
);
```

**NO HACER:**

```csharp
// ❌ INCORRECTO: Crear endpoint en módulo
[HttpGet("select-my-enum")]
public IActionResult GetMyEnumSelectItems()
{
    var items = Enum.GetValues(typeof(MyEnum))...
    return Ok(items);
}
```

### Escenario 2: Encontrar Violación en Auditoría

**PASOS:**

1. Auditoría encuentra: `InspectionModule/Endpoints/SelectItemEndPoints.cs`
2. Contiene: SELECT de enums específicos del módulo

**PLAN DE ACCIÓN:**

- [ ] Extraer enums a `ApplicationEnums/Inspections/InspectionStatus.cs` (si no existen)
- [ ] Registrar en `SelectItemEnumEndPoints.Map<InspectionStatus>(...)`
- [ ] Actualizar consumidores (frontend, otros módulos) a usar nuevo endpoint
- [ ] Eliminar `SelectItemEndPoints.cs` del módulo
- [ ] Validar con grep que no quedan traces

**Estimación:** 1-2 sprints según número de enums y consumidores

---

## Excepciones y Casos Especiales

### ¿Qué si el enum es muy específico del módulo?

❌ **NO APLICA EXCEPCIÓN**

Incluso si es específico, debe ir en `SelectItemEnumEndPoints`:
- Registrarlo bajo ruta `{modulo-name}-{enum-name}`
- Ejemplo: `GET /api/select-item-enum/incident-priority`
- Código: `Map<IncidentPriority>("incident-priority", ...)`

Razones:
- Otro módulo podría necesitar los mismos valores (p.ej. filtros globales)
- Centralización sigue siendo más mantenible
- Caché compartida es más eficiente

### ¿Qué si necesito transformar valores antes de enviar?

✅ **PERMITIDO: Lógica en SelectItemEnumEndPoints**

```csharp
Map<OrderStatus>(
    route: "order-status",
    operationId: "EnumSelectItem_GetOrderStatus",
    handler: async (IOrderService service) =>
    {
        var items = Enum.GetValues(typeof(OrderStatus))
            .Cast<OrderStatus>()
            .Select(s => new SelectItemDTO<int>
            {
                Id = (int)s,
                Value = s.ToString(),
                Text = GetDisplayName(s),  // ← Lógica centralizada OK
                // Ejemplo: OrderStatus.Pending → "Pendiente de envío" (i18n + logic)
            });
        
        return Results.Ok(items.OrderBy(x => x.Text));
    }
);
```

❌ **PROHIBIDO: Lógica dispersa en módulos**

No cada módulo con su propia transformación.

---

## Matriz de Severidad

| Hallazgo | Descripción | Severidad | Plan Acción |
|:---|:---|:---|:---|
| SelectItemEndPoints en módulo encontrado | Endpoint distribuido fuera de shared | 🔴 CRÍTICA | Consolidar + migrar |
| SelectItemDTO creado en módulo | Contrato duplicado | 🔴 CRÍTICA | Deletegar a compartido |
| Query directo a enum en servicio | `.ToSelectList()` fuera del endpoint | 🟠 ALTA | Mover a SelectItemEnumEndPoints |
| Enum sin registro en SelectItemEnumEndPoints | Enum existe pero no disponible centralmente | 🟠 ALTA | Registrar en endpoint |
| Caché con TTL diferente | Módulo cachea con lógica propia | 🟡 MEDIA | Usar caché centralizado |

---

## Checklist de Cumplimiento

**Para cada módulo:**

- [ ] ¿Existe algún archivo `*SelectItem*.cs` fuera de `SharedLuxuryApp/`?
  - Esperado: NO
  - Si YES: hallazgo CRÍTICO

- [ ] ¿Hay queries directas a enums (`.ToSelectList()`, `.ToSelectItemDTO()`)?
  - Esperado: NO (salvo en SelectItemEnumEndPoints)
  - Si YES: hallazgo ALTA

- [ ] ¿Todos los enums del módulo están registrados en SelectItemEnumEndPoints?
  - Esperado: SÍ
  - Si NO: hallazgo ALTA

- [ ] ¿Frontend llama `GET /api/select-item-enum/*` para selects?
  - Esperado: SÍ
  - Si NO: revisar si usa endpoint viejo del módulo

---

## Referencia

- **Backend Rules:** [backend-rules.md - SELECTs](./backend-rules.md#regla-crítica-selects-de-enums-y-valores-centralización)
- **Auditoría:** [audit-agent-instructions.md - STEP 1.8](../operations/audit-agent-instructions.md)
- **Convenciones:** [CONVENTIONS.md §6.1 - Reglas Especiales](../CONVENTIONS.md#61-shared-contratos-y-dtos)

---

**Vigente desde:** 2026-07-30  
**Última revisión:** 2026-07-30  
**Estado:** CRÍTICA - Obligatoria para todos los módulos
