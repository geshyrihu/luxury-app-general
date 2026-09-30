# service-dependency-limit.md — Límite de Inyección de Dependencias en Services

> **Estado:** Vigente  
> **Autorizado:** 2026-09-20  
> **Referencia:** CONVENTIONS.md §6bis (300 líneas → SubServices), CONVENTIONS_FOLDER_API.MD §5

---

## 1. Regla: Máximo 7 Dependencias Inyectadas

```csharp
// ✅ ACEPTABLE (7 dependencias)
public class SelectItemAppService(
    ApplicationDbContext dbContext,           // 1. Datos
    UserManager<ApplicationUser> UserManager, // 2. Usuarios
    RoleManager<ApplicationRole> roleManager, // 3. Roles
    IFileReadPathService fileReadPathService, // 4. Archivos
    ICurrentUserService currentUserService,   // 5. Usuario actual
    IMemoryCache cache,                       // 6. Caché
    IAspelCobranzaHausAppService aspel...     // 7. Integración externa
) : ISelectItemAppService

// ❌ EXCEDE LÍMITE (8+ dependencias) → Evaluar SubServices
public class MiServicio(
    Dependency1 d1, Dependency2 d2, Dependency3 d3, Dependency4 d4,
    Dependency5 d5, Dependency6 d6, Dependency7 d7, Dependency8 d8  // 8!
) : IMiServicio
```

---

## 2. Por Qué 7

| Rango | Clasificación | Acción |
|-------|---------------|--------|
| **1-3** | Service simple | ✅ OK |
| **4-7** | Service coordinador | ✅ OK (límite suave) |
| **8-10** | Olor a "God Service" | ⚠️ Evaluar división |
| **10+** | God Service confirmado | 🔴 Refactor obligatorio a SubServices |

> **Basado en:** Clean Architecture, Dependency Rule, experiencia del equipo LuxuryApp.

---

## 3. Cuándo Dividir en SubServices (Regla §6bis)

### Señales de Alerta
- Service supera **300 líneas** (regla §6bis)
- Service inyecta **8+ dependencias**
- Service tiene **múltiples responsabilidades** (ej: CRUD + reportes + integración + validaciones)
- Tests difíciles de escribir (muchos mocks)

### Estrategia de División

| Responsabilidad | SubService Sugerido |
|-----------------|---------------------|
| Consultas de solo lectura (SelectItems, catálogos) | `MiModuloReadService` |
| Operaciones de escritura (Create/Update/Delete) | `MiModuloWriteService` |
| Validaciones de negocio complejas | `MiModuloValidationService` |
| Integraciones externas (Aspel, OneSignal, WhatsApp) | `MiModuloIntegrationService` |
| Reportes/Exportaciones | `MiModuloReportService` |
| Helpers/Utilidades puras | `MiModulo/Helpers/` |

---

## 4. Ejemplo Real: SelectItemAppService (7 deps - LÍMITE)

```csharp
// SelectItemAppService.cs - 7 dependencias (EN LÍMITE)
public class SelectItemAppService(
    ApplicationDbContext dbContext,              // 1. BD principal
    UserManager<ApplicationUser> UserManager,    // 2. Identity Users
    RoleManager<ApplicationRole> roleManager,    // 3. Identity Roles
    IFileReadPathService fileReadPathService,    // 4. Archivos
    ICurrentUserService currentUserService,      // 5. Usuario actual (tenant/rol)
    IMemoryCache cache,                          // 6. Caché en memoria
    IAspelCobranzaHausAppService aspelCobranza   // 7. Integración externa Aspel
) : ISelectItemAppService
```

**Análisis:**
- 3 son infraestructura técnica (DbContext, UserManager, RoleManager) → **necesarias**
- 2 son servicios de dominio (FileRead, CurrentUser) → **necesarias**
- 1 es infraestructura transversal (MemoryCache) → **necesaria**
- 1 es integración externa (Aspel) → **candidata a SubService si crece**

**Decisión:** Se mantiene en 7 porque:
1. Es un **Service coordinador** de catálogos (responsabilidad única: "obtener listas de selección")
2. La lógica de cada método es simple (query + cache + return)
3. Dividirlo crearía más complejidad que beneficio actual

**Monitoreo:** Si agrega 8va dependencia → crear `SelectItemAspelIntegrationService`

---

## 5. Checklist al Crear/Modificar Service

- [ ] Contar dependencias inyectadas en constructor
- [ ] Si **≤ 7** → OK (documentar por qué si es 6-7)
- [ ] Si **8-10** → Evaluar: ¿responsabilidades mezcladas? → Dividir en SubServices
- [ ] Si **10+** → Refactor obligatorio a SubServices
- [ ] Verificar línea count: si **> 300 líneas** → SubServices (regla §6bis)
- [ ] Tests: ¿requieren > 5 mocks? → señal de división

---

## 6. Ubicación de SubServices (Regla §6bis / CONVENTIONS_FOLDER_API.MD)

| Nivel | Ubicación | Alcance |
|-------|-----------|---------|
| **1 — Submódulo** | `[Submodulo]/SubServices/` | Solo ese submódulo |
| **2 — Módulo** | `[Modulo]/SubServices/` | Varios submódulos del mismo módulo |
| **3 — SharedLuxuryApp** | `SharedLuxuryApp/SubServices/` | Múltiples módulos distintos |

> **Ejemplo:** `RecruitmentLuxuryApp/Candidates/SubServices/CandidateValidationService.cs`

---

## 7. Referencias

| Documento | Qué cubre |
|-----------|-----------|
| CONVENTIONS.md §6bis | SubServices/Helpers, 300 líneas |
| CONVENTIONS_FOLDER_API.MD §5 | Reglas de Submódulos |
| CONVENTIONS_FOLDER_API.MD §6 | Árbol de decisión Shared/SharedLuxuryApp |
| `SelectItemAppService.cs` | Caso real en límite (7 deps) |
