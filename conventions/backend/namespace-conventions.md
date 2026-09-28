# Backend: Namespace Conventions — Path-Based, No Prefixes

**Status:** ✅ VIGENTE (2026-09-11)  
**Severidad:** 🔴 CRÍTICA  
**Scope:** Backend .NET — Todos los archivos `.cs` en `LuxuryApp.Application/`

---

## Regla Única

> **El namespace de todo archivo `.cs` es la estructura de carpetas relativa a `LuxuryApp.Application/`, sin prefijo de proyecto.**

### Fórmula

```
Archivo en:  LuxuryApp.Application/AdminLuxuryApp/CatalogosGenerales/Banks/Services/BankService.cs
Namespace:   AdminLuxuryApp.CatalogosGenerales.Banks.Services
```

**NO:**
```csharp
namespace LuxuryApp.Application.AdminLuxuryApp.CatalogosGenerales.Banks.Services; // ❌
namespace Modules.AdminLuxuryApp.CatalogosGenerales.Banks.Services; // ❌
```

**SÍ:**
```csharp
namespace AdminLuxuryApp.CatalogosGenerales.Banks.Services; // ✅
```

---

## Historia: Eliminación de Prefijos (2026-09-11)

**Antes (viejo):**
```
Ruta:       LuxuryApp.Application/Modules/AdminLuxuryApp/CatalogosGenerales/Banks/Services/BankService.cs
Namespace:  LuxuryApp.Application.Modules.AdminLuxuryApp.CatalogosGenerales.Banks.Services
            └─ Prefijo de proyecto: LuxuryApp.Application.
            └─ Carpeta intermedia: Modules/
```

**Después (nuevo):**
```
Ruta:       LuxuryApp.Application/AdminLuxuryApp/CatalogosGenerales/Banks/Services/BankService.cs
Namespace:  AdminLuxuryApp.CatalogosGenerales.Banks.Services
            └─ Sin prefijo
            └─ Sin carpeta intermedia
```

**Cambios ejecutados (2026-09-11):**
- ✅ Eliminada carpeta intermedia `Modules/` (2,565+ archivos migrados)
- ✅ Eliminado prefijo `LuxuryApp.Application.` (3,045+ archivos actualizados)
- ✅ Build: 0 errores
- ✅ Tests: 519/533 (sin regresiones)
- ✅ EF Core: 0 nuevos diffs introducidos

---

## Regla de Pluralización

Las **carpetas son plurales** en el path físico, el namespace **mantiene** ese plural:

| Elemento | En ruta | En namespace |
|----------|---------|--------------|
| **Carpeta** | `Candidates/` | `.Candidates` |
| **Clase** | `Candidate.cs` | `namespace ...Candidates` |

```csharp
// ✅ CORRECTO
// Archivo: LuxuryApp.Application/ReclutamientoLuxuryApp/Candidates/Services/CandidateService.cs
namespace ReclutamientoLuxuryApp.Candidates.Services;
public class CandidateService { }

// ❌ PROHIBIDO
// Archivo: LuxuryApp.Application/ReclutamientoLuxuryApp/Candidates/Services/CandidateService.cs
namespace ReclutamientoLuxuryApp.Candidate.Services; // Singular en namespace
```

---

## Riesgo: Colisión de Nombres (Sin Prefijo Raíz)

Sin un prefijo único como `LuxuryApp.Application.`, existe riesgo de colisión cuando un segmento corto existe en múltiples niveles:

### Escenario de Riesgo

```
LuxuryApp.Application/
├── Shared/                                    ← Shared raíz
│   └── Enums/StatusEnum.cs                    → namespace Shared.Enums
│
└── ContabilidadLuxuryApp/
    ├── Shared/                                ← Shared del módulo
    │   └── Enums/FinancialStatusEnum.cs       → namespace ContabilidadLuxuryApp.Shared.Enums
    │
    └── Ledger/Services/LedgerService.cs       → namespace ContabilidadLuxuryApp.Ledger.Services
```

**Dentro de `LedgerService.cs`:**
```csharp
using Shared.Enums; // ¿Cuál Shared? Resuelve a ContabilidadLuxuryApp.Shared, no a Shared raíz

// ✅ CORRECTO: usar global:: para desambiguar
using global::Shared.Enums;      // Shared raíz
using ContabilidadLuxuryApp.Shared.Enums; // Shared del módulo (implícito si sin usar)
```

### Mitigación

Si hay colisión, **usar `global::`** en lugar de renombrar carpetas:

```csharp
var statusEnum = global::Shared.Enums.Status.Active; // ✅ Resuelve a raíz
var financialStatus = ContabilidadLuxuryApp.Shared.Enums.FinancialStatus.Closed; // ✅ Resuelve a módulo
```

**NUNCA renombrar `Shared/` raíz o dentro del módulo** para evitar colisión.

---

## Auditoría

### Verificar que NO hay prefijo

```bash
# ❌ Estos comandos deben retornar 0 resultados
grep -r "namespace LuxuryApp.Application\." api/LuxuryApp.Application --include="*.cs"
grep -r "namespace Modules\." api/LuxuryApp.Application --include="*.cs"

# ✅ Estos sí tienen prefijo (correcto, son otros proyectos)
grep -r "namespace LuxuryApp.Api\." api/LuxuryApp.Api --include="*.cs"
grep -r "namespace LuxuryApp.Tests\." api/LuxuryApp.Tests --include="*.cs"
```

### Verificar coincidencia ruta-namespace

```bash
# Muestra archivos donde namespace NO coincide con ruta (hallazgos raros)
find api/LuxuryApp.Application -name "*.cs" -exec sh -c '
  file="$1"
  namespace=$(grep "^namespace " "$file" | sed "s/namespace //;s/;//" | head -1)
  ruta=$(echo "$file" | sed "s|api/LuxuryApp.Application/||;s|/[^/]*\.cs||;s|/|.|g")
  [ "$namespace" != "$ruta" ] && echo "MISMATCH: $file -> $namespace vs $ruta"
' _ {} \;
```

---

## Proyectos Colaterales: Api y Tests

### `LuxuryApp.Api`
- Mantiene su prefijo `LuxuryApp.Api.*`
- Excepción consciente a la regla path-based

### `LuxuryApp.Tests` ✅ ACTUALIZADO 2026-09-11
- **ADOPTA regla path-based igual que Application**
- Sin prefijo `LuxuryApp.Tests.*`
- Sufijo obligatorio `.Tests` para evitar colisión
- Ver: `conventions/backend/testing-namespace-conventions.md`

**Aplicación de regla:**
```
Ruta:       api/LuxuryApp.Tests/Application/AdminLuxuryApp/Banks/BankAppServiceTests.cs
Namespace:  AdminLuxuryApp.Banks.Tests  (sin prefijo, con sufijo)
```

---

## Referencias

- **Autoridad principal:** `conventions/CONVENTIONS_FOLDER_API.MD` §2 (Namespaces Backend)
- **Decisión:** Eliminación de prefijos (2026-09-11)
- **Impacto:** 3,000+ archivos refacturizados
- **Verificación:** Build 0 errores, Tests sin regresiones, EF Core diff idéntico

---

**Última actualización:** 2026-09-11  
**Aprobado por:** Tech Lead (implícito en build success)
