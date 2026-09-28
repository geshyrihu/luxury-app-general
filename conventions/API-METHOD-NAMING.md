# 🔴 API METHOD NAMING — .NET Standard Catalog

**Status:** ✅ VIGENTE (2026-09-11)  
**Patrón:** 6 métodos genéricos .NET (sin Entity-específico)  
**Fuente:** .NET Standard + `conventions/backend/api-method-naming-conventions.md`

---

## 6 Métodos CRUD Estándar

| Método | Uso | Ejemplo |
|--------|-----|---------|
| **GetByIdAsync** | Obtener uno por ID | `GetByIdAsync(Guid id)` |
| **GetListAsync** | Obtener colección | `GetListAsync()`, `GetListAsync(page, size)` |
| **CreateAsync** | Crear nuevo | `CreateAsync(CreateDTO dto)` |
| **UpdateAsync** | Actualizar existente | `UpdateAsync(Guid id, UpdateDTO dto)` |
| **DeleteByIdAsync** | Eliminar por ID | `DeleteByIdAsync(Guid id)` |
| **DeleteRangeAsync** | Eliminar lote | `DeleteRangeAsync(IEnumerable<Guid> ids)` |

---

## Firma de Ejemplo

```csharp
public interface IBankAppService
{
    // LEER
    Task<ApiResponseDTO<BankDTO>> GetByIdAsync(Guid id);
    Task<ApiResponseDTO<IEnumerable<BankDTO>>> GetListAsync();
    Task<ApiResponseDTO<PaginatedResult<BankDTO>>> GetListAsync(int page, int size);

    // CREAR
    Task<ApiResponseDTO<BankDTO>> CreateAsync(CreateBankDTO dto);

    // ACTUALIZAR
    Task<ApiResponseDTO<BankDTO>> UpdateAsync(Guid id, UpdateBankDTO dto);

    // ELIMINAR
    Task<ApiResponseDTO<bool>> DeleteByIdAsync(Guid id);
    Task<ApiResponseDTO<bool>> DeleteRangeAsync(IEnumerable<Guid> ids);
}
```

---

## ❌ PROHIBIDO (Variantes Personalizadas)

```csharp
// NO USE ESTOS:
CreateBankAsync(dto)              // ← Use CreateAsync
GetBankByIdAsync(id)              // ← Use GetByIdAsync
GetBanksAsync()                   // ← Use GetListAsync
UpdateBankAsync(id, dto)          // ← Use UpdateAsync
DeleteBankByIdAsync(id)           // ← Use DeleteByIdAsync
AddAsync, RegisterAsync           // ← Use CreateAsync
EditAsync, ModifyAsync, SaveAsync // ← Use UpdateAsync
RemoveAsync, DestroyAsync         // ← Use DeleteByIdAsync
ListAsync, FindAsync, SearchAsync // ← Use GetListAsync
```

---

## HTTP Mapping

| Método | Verbo | Ruta |
|--------|-------|------|
| GetByIdAsync | GET | `/api/resource/{id}` |
| GetListAsync | GET | `/api/resource` |
| CreateAsync | POST | `/api/resource` |
| UpdateAsync | PUT | `/api/resource/{id}` |
| DeleteByIdAsync | DELETE | `/api/resource/{id}` |
| DeleteRangeAsync | DELETE | `/api/resource/batch` |

---

## Checklist — Copy & Paste para Code Review

- [ ] Método es GetByIdAsync, GetListAsync, CreateAsync, UpdateAsync, DeleteByIdAsync o DeleteRangeAsync
- [ ] Criterion explícito (Id, Range, sin GetAsync genérico)
- [ ] Async obligatorio (público asincronó)
- [ ] DTO termina en DTO (mayúsculas)
- [ ] Endpoint verbo HTTP correcto
- [ ] Sin personalización Entity-específica

---

**Ref:** `conventions/backend/api-method-naming-conventions.md` (completo)
