# Backend: Testing Namespace Conventions — Path-Based, No Prefixes

**Status:** ✅ VIGENTE (2026-09-11)  
**Severidad:** 🔴 CRÍTICA  
**Scope:** Todos los archivos `.cs` en `LuxuryApp.Tests/`

---

## Regla Única

> **El namespace de todo archivo test es la estructura de carpetas relativa a `LuxuryApp.Tests/Application/`, sin prefijo de proyecto, con sufijo `Tests` obligatorio.**

### Fórmula

```
Archivo en:  LuxuryApp.Tests/Application/AdminLuxuryApp/Banks/BankAppServiceTests.cs
Namespace:   AdminLuxuryApp.Banks.Tests
```

**NO:**
```csharp
namespace LuxuryApp.Tests.Application.AdminLuxuryApp.Banks; // ❌
namespace LuxuryApp.Tests.Application.Modules.AdminLuxuryApp.Banks; // ❌ (Modules eliminada)
```

**SÍ:**
```csharp
namespace AdminLuxuryApp.Banks.Tests; // ✅
```

---

## Alineación con Application

**Application (Producción):**
```
Ruta:       LuxuryApp.Application/AdminLuxuryApp/Banks/Services/BankService.cs
Namespace:  AdminLuxuryApp.Banks.Services
```

**Tests:**
```
Ruta:       LuxuryApp.Tests/Application/AdminLuxuryApp/Banks/BankAppServiceTests.cs
Namespace:  AdminLuxuryApp.Banks.Tests
```

**Diferencia:** Tests agrega sufijo `Tests` para evitar colisión con clases de Application.

---

## Cambios Implementados (2026-09-11)

**Antes:**
```
Ruta:       LuxuryApp.Tests/Application/Modules/AdminLuxuryApp/Banks/BankAppServiceTests.cs
Namespace:  LuxuryApp.Tests.Application.Modules.AdminLuxuryApp.Banks
            └─ Prefijo: LuxuryApp.Tests.
            └─ Carpeta intermedia: Modules/
```

**Después:**
```
Ruta:       LuxuryApp.Tests/Application/AdminLuxuryApp/Banks/BankAppServiceTests.cs
Namespace:  AdminLuxuryApp.Banks.Tests
            └─ Sin prefijo
            └─ Sin carpeta intermedia
            └─ Con sufijo Tests
```

**Cambios ejecutados (2026-09-11):**
- ✅ Eliminada carpeta intermedia `Modules/` (76 archivos reorganizados)
- ✅ Eliminado prefijo `LuxuryApp.Tests.` (76 archivos actualizados)
- ✅ Agregado sufijo `Tests` a todos namespaces
- ✅ Build: 0 errores esperados (mismo patrón que Application)

---

## Sufijo `Tests` — Por Qué Obligatorio

Sin `Tests` sufijo, habría colisión:

```csharp
// En Application
namespace AdminLuxuryApp.Banks.Services;
public class BankService { }

// En Tests — RIESGO DE COLISIÓN
namespace AdminLuxuryApp.Banks;  // ❌ Mismo namespace que Services
public class BankAppServiceTests { }

// SOLUCIÓN: Sufijo Tests
namespace AdminLuxuryApp.Banks.Tests; // ✅ Diferente namespace
public class BankAppServiceTests { }
```

**Regla de sufijo:**
- Si archivo test espeja clase de Application, usar sufijo `Tests`
- Ubicar archivos test en carpeta `Application/[Module]/` (sin subfolders de Services, Entities, etc.)
- Namespace = Module + `.Tests`

---

## Estructura de Carpetas

```
LuxuryApp.Tests/
├── Application/                  ← Nivel raíz (no tiene prefijo en namespace)
│   ├── Infrastructure/           → namespace *.Infrastructure
│   ├── AdminLuxuryApp/          → namespace AdminLuxuryApp.*.Tests
│   │   ├── Banks/
│   │   │   └── BankAppServiceTests.cs
│   │   └── [módulo]/
│   ├── AuthLuxuryApp/           → namespace AuthLuxuryApp.*.Tests
│   │   ├── AccountRecovery/
│   │   └── Auth/
│   └── [Módulo]/
```

**NO hay Modules/ carpeta en Tests.**

---

## Auditoría

### Verificar que NO hay prefijo

```bash
# ❌ Estos comandos deben retornar 0 resultados
grep -r "namespace LuxuryApp.Tests\." api/LuxuryApp.Tests --include="*.cs"
grep -r "namespace .*Modules\." api/LuxuryApp.Tests --include="*.cs"

# ✅ Estos sí deben encontrar el patrón correcto
grep -r "namespace .*\.Tests$" api/LuxuryApp.Tests --include="*.cs" | wc -l
# Debe mostrar 76 (o similar — cantidad de archivos test)
```

### Verificar estructura (carpeta Modules eliminada)

```bash
# ❌ Debe retornar 0
find api/LuxuryApp.Tests -type d -name "Modules"
```

---

## Referencia a Application

- **Autoridad:** `conventions/backend/namespace-conventions.md` (Application)
- **Alineación:** Mismo patrón path-based, adaptado con sufijo `Tests` para evitar colisiones
- **Decisión:** 2026-09-11, alineación de ambos proyectos bajo una sola regla

---

**Última actualización:** 2026-09-11  
**Impacto esperado:** 76 archivos reorganizados, 0 regresiones de build
