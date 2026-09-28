# 🧪 CONVENTIONS_TESTING.md — Reglas de Convenciones para LuxuryApp.Tests

> **Vigente desde:** 2026-09-11  
> **Fundamento:** `CONVENTIONS.md` (sistema rector) + `CONVENTIONS_FOLDER_API.MD` §2 (namespaces path-based)  
> **Aplicable a:** Todos los archivos `.cs` en `api/LuxuryApp.Tests/`

---

## 1️⃣ Convenciones de Número y Naming — Tests

| Artifact | Regla | Ejemplo |
|----------|-------|---------|
| 📁 Carpeta / Namespace | **Plural** (espeja Application) | `Banks/`, `Candidates/` |
| 🏷️ Clase Test | **Singular** + sufijo `Tests` | `BankAppServiceTests` |
| 📄 Archivo | **Singular** + sufijo `Tests` | `BankAppServiceTests.cs` |
| 🧬 Namespace | **Path + `.Tests`** | `AdminLuxuryApp.Banks.Tests` |
| 📦 Test Data | **Singular** + prefijo `Create` o `Mock` | `CreateBank()`, `MockCandidateService` |

---

## 2️⃣ Estructura Espejo — Tests sigue Application

**Application (Producción):**
```
LuxuryApp.Application/
└── AdminLuxuryApp/
    └── Banks/
        ├── Services/
        │   └── BankService.cs              → namespace AdminLuxuryApp.Banks.Services
        ├── Entities/
        │   └── Bank.cs
        └── DTOs/
            └── BankDetailDTO.cs
```

**Tests (Paralelo):**
```
LuxuryApp.Tests/Application/
└── AdminLuxuryApp/
    └── Banks/
        ├── BankAppServiceTests.cs          → namespace AdminLuxuryApp.Banks.Tests
        ├── BankEntityTests.cs              → namespace AdminLuxuryApp.Banks.Tests
        └── BankDTOTests.cs                 → namespace AdminLuxuryApp.Banks.Tests
```

✅ **Sin carpeta Modules/ en Tests.**  
✅ **Sin subfolders redundantes (Services/, Entities/) en Tests.**  
✅ **Todos los tests bajo un único namespace por módulo: `[Module].[Submodulo].Tests`.**

---

## 3️⃣ Convenciones de Clases Test

### 📌 Sufijo Obligatorio: `Tests`

| Entidad | Test | Patrón |
|---------|------|--------|
| `BankService` | `BankAppServiceTests` o `BankServiceTests` | `[Clase]Tests` |
| `Bank` (Entity) | `BankEntityTests` | `[Clase]EntityTests` |
| `BankDetailDTO` | `BankDTOTests` | `[Clase]Tests` |

✅ **Cada clase test tiene sufijo `Tests` obligatorio.**

### 📦 Métodos Test — Factory Methods

```csharp
namespace AdminLuxuryApp.Banks.Tests;

public class BankAppServiceTests
{
    // Factory para datos de prueba
    private static Bank CreateBank(
        string code = "BOA",
        string shortName = "Bank Of America"
    ) => new()
    {
        Id = Guid.NewGuid(),
        Code = code,
        ShortName = shortName
    };

    // Test method
    [Fact]
    public void CreateBankService_WithValidCode_Succeeds()
    {
        var bank = CreateBank(code: "JPM");
        // Assert...
    }
}
```

---

## 4️⃣ Checklist de Convención para Tests (PRs)

| # | Ítem | Estado |
|---|------|--------|
| 1 | 📁 Carpeta espeja estructura de Application (sin Modules/) | ✅ |
| 2 | 🏷️ Clase y archivo terminan en `Tests` | ✅ |
| 3 | 🧬 Namespace = `[Module].[Submodulo].Tests` | ✅ |
| 4 | 📦 Factory methods para datos (Create*, Mock*) | ✅ |
| 5 | ⚠️ Sin colisiones con namespace de Application | ✅ |
| 6 | 🔗 Usa `using` para namespaces de Application | ✅ |
| 7 | 🧪 Test cubre caso exitoso + casos error | ✅ |

---

## 5️⃣ Namespace — Regla Única (Path-Based)

### 🔴 Regla: Mismo patrón que Application + sufijo Tests

```
Ruta:       api/LuxuryApp.Tests/Application/AdminLuxuryApp/Banks/BankAppServiceTests.cs
Namespace:  AdminLuxuryApp.Banks.Tests

NO:         LuxuryApp.Tests.Application.ModuleApps.AdminLuxuryApp.Banks  ❌
NO:         LuxuryApp.Tests.Application.Modules.AdminLuxuryApp.Banks     ❌ (carpeta vieja)
SÍ:         AdminLuxuryApp.Banks.Tests                                   ✅
```

**Excepciones (Infrastructure):**

```
Ruta:       api/LuxuryApp.Tests/Application/Infrastructure/InMemoryDbContextFactory.cs
Namespace:  Infrastructure
```

---

## 6️⃣ Usings — Referencias a Application

Dentro de Tests, importar desde Application:

```csharp
// ✅ Correcto: referencia al namespace de Application
using AdminLuxuryApp.Banks.Services;
using SharedLuxuryApp.CatalogosGenerales.Banks.DTOs;

// ❌ Evitar: referencia al prefijo de Application
using LuxuryApp.Application.AdminLuxuryApp.Banks; // No existe post-2026-09-11
```

---

## 7️⃣ Auditoría de Convenciones — Testing

### Verificar estructura (sin Modules/)

```bash
# ❌ Debe retornar 0
find api/LuxuryApp.Tests/Application -type d -name "Modules"
```

### Verificar namespaces

```bash
# ❌ Estos comandos deben retornar 0
grep -r "^namespace LuxuryApp.Tests\." api/LuxuryApp.Tests --include="*.cs"
grep -r "^namespace .*ModuleApps\." api/LuxuryApp.Tests --include="*.cs"

# ✅ Verificar patrón correcto
grep -r "^namespace .*\.Tests$" api/LuxuryApp.Tests --include="*.cs" | wc -l
# Debe mostrar ~70 (tests con sufijo)
```

### Verificar sufijo en clases

```bash
# ❌ Archivos .cs SIN sufijo Tests (hallazgos raros)
find api/LuxuryApp.Tests -name "*.cs" ! -name "*Tests.cs" | grep -v "Factory\|Mock\|Fixture"
```

---

## Referencias

- **Autoridad principal:** `CONVENTIONS_FOLDER_API.MD` §2 (namespaces path-based)
- **Documento especializado:** `conventions/backend/testing-namespace-conventions.md`
- **Referencia en rector:** `CONVENTIONS.md` (agregar cuando se formalice)

---

**Última actualización:** 2026-09-11  
**Impacto:** 76 archivos reestructurados, patrón path-based aplicado a Testing
