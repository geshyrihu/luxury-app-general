# Backend: API Method Naming Conventions — .NET Standard

**Status:** ✅ VIGENTE (2026-09-11)  
**Severidad:** 🔴 CRÍTICA  
**Scope:** Interfaces, servicios y handlers en `LuxuryApp.Application/` y `LuxuryApp.Api/`  
**Autoridad:** .NET Standard Catalog (genérico, sin personalización Entity-específica)

---

## Regla Única: Catálogo CRUD Estándar .NET

> **Usar 6 patrones canónicos .NET. Sin variantes personalizadas por entidad. Criterion explícito siempre. Async obligatorio.**

| Método | Uso Principal | Convención | Ejemplo |
|--------|---------------|-----------|---------|
| `GetByIdAsync` | Obtener recurso único por ID | Siempre explícito con Id | `GetByIdAsync(Guid id)` |
| `GetListAsync` | Obtener colección completa | Retorno plural | `GetListAsync()` |
| `CreateAsync` | Crear recurso nuevo | Exclusivo para inserción | `CreateAsync(CreateDTO dto)` |
| `UpdateAsync` | Actualizar recurso existente | Requiere Id + cambios | `UpdateAsync(Guid id, UpdateDTO dto)` |
| `DeleteByIdAsync` | Eliminar por ID | Nombre explícito | `DeleteByIdAsync(Guid id)` |
| `DeleteRangeAsync` | Eliminar múltiples en lote | Recibe colección de Ids | `DeleteRangeAsync(IEnumerable<Guid> ids)` |

---

## 1️⃣ Operaciones CRUD — Patrones Canónicos

### 🟢 CREAR (Alta)

**Patrón:** `CreateAsync`

```csharp
// ✅ CORRECTO
public interface IBankAppService
{
    Task<ApiResponseDTO<BankResponseDTO>> CreateAsync(CreateBankDTO dto);
}

// ❌ NO — variantes personalizadas
AddAsync, CreateBankAsync, RegisterAsync, SaveAsync
```

**Criterio:** Si el método genera un nuevo ID y persiste un recurso nuevo → `CreateAsync`.

---

### 🔵 LEER (Consulta)

#### Lectura Individual (por ID)

**Patrón:** `GetByIdAsync`

```csharp
// ✅ CORRECTO
public interface IBankAppService
{
    Task<ApiResponseDTO<BankResponseDTO>> GetByIdAsync(Guid id);
}

// ❌ NO — genérico, sin Id explícito
GetAsync, GetBankByIdAsync, FindAsync
```

**Criterio:** Una sola entidad, criterio es el ID → `GetByIdAsync(id)`.

#### Lectura de Colección (Lista, búsqueda, filtro)

**Patrón:** `GetListAsync`

```csharp
// ✅ CORRECTO
public interface IBankAppService
{
    Task<ApiResponseDTO<IEnumerable<BankResponseDTO>>> GetListAsync();
    Task<ApiResponseDTO<PaginatedResult<BankResponseDTO>>> GetListAsync(int page, int size);
    // Sobrecarga con parámetros opcionales
}

// ❌ NO — variantes
ListAsync, GetAllAsync, GetBanksAsync, SearchAsync, FindAllAsync
```

**Criterio:** Retorna colección → `GetListAsync()` con parámetros opcionales (paginación, filtro).

---

### 🟡 ACTUALIZAR

**Patrón:** `UpdateAsync`

```csharp
// ✅ CORRECTO
public interface IBankAppService
{
    Task<ApiResponseDTO<BankResponseDTO>> UpdateAsync(Guid id, UpdateBankDTO dto);
}

// ❌ NO — variantes
EditAsync, ModifyAsync, SaveAsync, UpdateBankAsync
```

**Criterio:**
- Actualiza recurso existente → `UpdateAsync(id, dto)`
- Requiere ID + DTO con cambios

---

### 🔴 ELIMINAR (Baja)

#### Eliminar Uno (por ID)

**Patrón:** `DeleteByIdAsync`

```csharp
// ✅ CORRECTO
public interface IBankAppService
{
    Task<ApiResponseDTO<bool>> DeleteByIdAsync(Guid id);
}

// ❌ NO — genérico, sin Id explícito
DeleteAsync, RemoveAsync, DestroyAsync, DeleteBankByIdAsync
```

#### Eliminar Múltiples (Lote)

**Patrón:** `DeleteRangeAsync`

```csharp
// ✅ CORRECTO
public interface IBankAppService
{
    Task<ApiResponseDTO<bool>> DeleteRangeAsync(IEnumerable<Guid> ids);
}

// ❌ NO
DeleteAsync(params), DeleteMultipleAsync, DeleteManyAsync
```

**Criterio:** Siempre explícito → `DeleteByIdAsync` (uno) o `DeleteRangeAsync` (lote).

---

## 2️⃣ Acciones de Negocio — Extensión Controlada

> **Acciones de negocio (Approve, Process, Generate, etc.) se documentan en un módulo APARTE. No son parte del catálogo CRUD genérico.**

Ejemplos (fuera del catálogo estándar):
- `ApprovePurchaseOrderAsync(id)`
- `ProcessPaymentAsync(id)`
- `GenerateReportAsync(date)`

**Regla:** Si no es CRUD puro, documentar en sección "Business Actions" por módulo con justificación.

---

## 3️⃣ DTOs — Nombres y Ubicación

### Sufijo DTO Obligatorio

| Tipo | Patrón | Ejemplo |
|------|--------|---------|
| Respuesta/Lectura | `[Entity]DTO` o `[Entity]ResponseDTO` | `BankDTO`, `BankResponseDTO` |
| Creación | `Create[Entity]DTO` | `CreateBankDTO` |
| Actualización | `Update[Entity]DTO` | `UpdateBankDTO` |

**Criterio:** DTO siempre en MAYÚSCULAS (`DTO`, no `Dto`).

### Ubicación

```
LuxuryApp.Application/
└── AdminLuxuryApp/
    └── Banks/
        ├── DTOs/
        │   ├── BankDTO.cs          ← Un DTO por archivo
        │   ├── CreateBankDTO.cs
        │   └── UpdateBankDTO.cs
        ├── Services/
        │   └── IBankAppService.cs
        └── EndPoints/
            └── BankEndPoints.cs
```

**Regla:** Un DTO por archivo. Compartir solo si 2+ módulos la consumen (entonces va en Shared/).

---

## 4️⃣ Endpoints HTTP — Verbo y Ruta

### Mapeo Método → Verbo HTTP

| Método | Verbo HTTP | Ruta | Ejemplo |
|--------|-----------|------|---------|
| `GetByIdAsync` | `GET` | `/api/[resource]/{id}` | `GET /api/banks/123` |
| `GetListAsync` | `GET` | `/api/[resource]` | `GET /api/banks?page=1` |
| `CreateAsync` | `POST` | `/api/[resource]` | `POST /api/banks` |
| `UpdateAsync` | `PUT` | `/api/[resource]/{id}` | `PUT /api/banks/123` |
| `DeleteByIdAsync` | `DELETE` | `/api/[resource]/{id}` | `DELETE /api/banks/123` |
| `DeleteRangeAsync` | `DELETE` | `/api/[resource]/batch` | `DELETE /api/banks/batch` |

### ❌ PROHIBIDO

```
GET /api/banks/123/delete           ← Acción en GET (❌)
GET /api/banks/create               ← Acción en GET (❌)
POST /api/create-bank               ← Acción en ruta (❌)
POST /api/banks/123/approve         ← Business action, ver sección 2
```

---

## 5️⃣ Reglas de Estilo

### Async Obligatorio

```csharp
// ✅ CORRECTO — público asincronó
public Task<ApiResponseDTO<BankDTO>> GetByIdAsync(Guid id);

// ❌ NO — público sin Async
public Task<ApiResponseDTO<BankDTO>> GetById(Guid id);
```

**Regla:** Si es `public` y devuelve `Task/ValueTask`, **debe** terminar en `Async`.

### Criterion Explícito

```csharp
// ✅ CORRECTO — criterion claro
GetByIdAsync(Guid id)
DeleteByIdAsync(Guid id)

// ❌ NO — ambiguo
GetAsync()       // ¿Cuál Get?
DeleteAsync()    // ¿Qué eliminar?
FindAsync()      // ¿Criterio?
```

### Plural vs Singular

```csharp
// ✅ CORRECTO
GetListAsync()                          // Colección → plural
GetByIdAsync(Guid id)                   // Uno → singular
DeleteRangeAsync(IEnumerable<Guid> ids) // Múltiples → explícito
CreateAsync(CreateBankDTO dto)          // Singular (DTO singular)

// ❌ NO
GetListAsync()           // ✅ OK
GetItemsAsync()          // ❌ Singular
GetBankAsync()           // ❌ Singular si retorna colección
GetBanksAsync()          // ❌ Plural si retorna uno
```

---

## 6️⃣ Compatibilidad Mínima

**Alias a eliminar (sin reemplazo):**
- `AddAsync` → Use `CreateAsync`
- `Remove...` → Use `DeleteByIdAsync`
- `Edit...` → Use `UpdateAsync`
- `Destroy...` → Use `DeleteByIdAsync`

**Ventana de compatibilidad:** Máximo 1-2 sprints si hay consumidores externos.

---

## 7️⃣ Checklist para Code Review

| Ítem | Estado |
|------|--------|
| 1. Método es uno de: GetByIdAsync, GetListAsync, CreateAsync, UpdateAsync, DeleteByIdAsync, DeleteRangeAsync | `[ ]` |
| 2. Criterion explícito (no genérico Get, Delete) | `[ ]` |
| 3. Async obligatorio si público y asincronía visible | `[ ]` |
| 4. DTO termina en `DTO` (mayúsculas), uno por archivo | `[ ]` |
| 5. Endpoint usa verbo HTTP correcto | `[ ]` |
| 6. Ruta pluralizada; no acciones en GET | `[ ]` |
| 7. Retorno (uno vs colección) coincide con nombre | `[ ]` |
| 8. Sin alias personalizados por entidad | `[ ]` |

---

## 8️⃣ DTOs — Referencias Integradas

**Regla:** DTOs se nombran según `dto-naming-conventions.md` y se organizan según `dto-file-organization-rule.md`.

### Naming DTO

→ `conventions/backend/dto-naming-conventions.md`
- Sufijo `DTO` (mayúsculas)
- Patrones: `[Entity]DTO`, `Create[Entity]DTO`, `Update[Entity]DTO`
- Especializados: `[Entity]SummaryDTO`, `[Entity]FilterDTO`, `[Action][Entity]DTO`
- Herencia obligatoria: `GuidIdEntityDTO`

### Organización DTO

→ `conventions/backend/dto-file-organization-rule.md`
- **1 archivo = 1 DTO (SIN excepciones)**
- Nombre archivo coincide con nombre DTO
- Facilita búsqueda, reduce conflictos PR, limpia historia git

---

## 9️⃣ Referencias Generales

- **Fuente:** .NET Standard API Design (genérico, aplicable a cualquier servicio)
- **Plan maestro:** `docs/SharedLuxuryApp/Conventions/20260911-plan-shared-nombres-api.md` (Fases 1-7, estructura plana §6ter)
- **Estructura:** `CONVENTIONS_FOLDER_API.MD` §3, §5 (carpetas, namespaces)

---

**Última actualización:** 2026-09-11  
**Vigencia:** Hasta cambio formal de CONVENTIONS.md  
**Impacto:** 3,929 métodos públicos → 6 patrones estándar + DTOs integrados
