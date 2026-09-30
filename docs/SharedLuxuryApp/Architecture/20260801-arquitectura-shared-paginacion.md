# 📄 Paginación Canónica — Frontend + Backend

**Sección CONVENTIONS.md:** §9 (Backend)  
**Contrato único:** `PaginationCommonDTO` (.NET) ↔ `PaginationRequest` (Angular)  
**Status:** ✅ Implementado y requerido

---

## 🎯 Principio

**Un único contrato de paginación para todo el proyecto.** Frontend y backend hablan el mismo lenguaje:
- Request: `page`, `recordsNumber`, `filter`, `sortField`, `sortOrder`
- Response: `items`, `totalRecords`
- Semántica: 1-indexed (página 1 es la primera)
- Máximo: 200 registros por página (se trunca automáticamente)

---

## 🔷 Backend (.NET 10)

### Contrato: `PaginationCommonDTO`

**Ubicación:** `LuxuryApp.Shared/DTOs/PaginationCommonDTO.cs`

```csharp
namespace LuxuryApp.Shared.DTOs;

public class PaginationCommonDTO
{
    public const int MaxRecordsNumber = 200;  // Tope máximo
    
    [Display(Name = "Página")]
    public int Page { get; set; } = 1;
    
    [Display(Name = "Número de Registros")]
    public int RecordsNumber { get; set; } = 30;  // Default 30, trunca a 200
    
    [Display(Name = "Filtro")]
    public string Filter { get; set; }
    
    [Display(Name = "Campo de Ordenamiento")]
    public string SortField { get; set; }
    
    [Display(Name = "Ordenamiento")]
    public int? SortOrder { get; set; } = 1;  // 1 = ASC, -1 = DESC
    
    /// Binding para Minimal APIs (reemplaza [AsParameters])
    public static ValueTask<PaginationCommonDTO?> BindAsync(HttpContext context)
    {
        // Lee del query string con defaults cuando faltan parámetros
        // Permite: ?page=2&recordsNumber=50&filter=john&sortField=name&sortOrder=-1
    }
}
```

### Uso en Endpoint

**✅ BIEN — Usar `BindAsync`:**

```csharp
public class GetUsersEndpoint : IEndpointModule
{
    public void MapEndpoint(RouteGroupBuilder group) =>
        group
            .MapGet("/")
            .Produces<ApiResponseDTO<PagedResultDTO<UserDTO>>>()
            .HandlerAsync(HandleAsync);

    public async Task<IResult> HandleAsync(
        PaginationCommonDTO pagination,  // ← Binding automático vía BindAsync
        [FromServices] IUserRepository repository,
        CancellationToken cancellation)
    {
        var (items, total) = await repository
            .QueryAsNoTracking()
            .ApplyFilter(pagination.Filter)          // SearchText en propiedades
            .ApplySort(pagination.SortField, pagination.SortOrder)
            .Paginate(pagination)                     // Extension: Skip/Take
            .ToPagedResultAsync(total, cancellation);

        return Results.Ok(new ApiResponseDTO<PagedResultDTO<UserDTO>>(
            data: new PagedResultDTO<UserDTO>
            {
                Items = items,
                TotalRecords = total
            }
        ));
    }
}

// Extension para Paginate
public static class PaginationExtensions
{
    public static IQueryable<T> Paginate<T>(
        this IQueryable<T> query,
        PaginationCommonDTO pagination)
    {
        var skip = (pagination.Page - 1) * pagination.RecordsNumber;
        return query.Skip(skip).Take(pagination.RecordsNumber);
    }
}
```

**❌ MALO — Usar `[AsParameters]`:**

```csharp
// Trata Page/RecordsNumber como OBLIGATORIOS
// Si client no envía ?page=1&recordsNumber=30 → 400 "Required parameter"
[Produces<ApiResponseDTO<PagedResultDTO<UserDTO>>>()]
public async Task<IResult> GetUsers(
    [AsParameters] PaginationCommonDTO pagination)  // ❌ MAL
```

### Respuesta

**Usar `PagedResultDTO<T>`:**

```csharp
public class PagedResultDTO<T>
{
    [Display(Name = "Elementos")]
    public List<T> Items { get; set; }
    
    [Display(Name = "Total de Registros")]
    public int TotalRecords { get; set; }
}
```

**Response HTTP:**

```json
{
  "success": true,
  "data": {
    "items": [
      { "id": "1", "name": "John Doe" },
      { "id": "2", "name": "Jane Smith" }
    ],
    "totalRecords": 150
  },
  "message": ""
}
```

---

## 🅰️ Frontend (Angular 22)

### Contrato: `PaginationRequest`

**Ubicación:** `client/angular/src/app/core/interfaces/pagination-request.dto.ts`

```typescript
export interface PaginationRequest {
  page: number;              // 1-indexed
  recordsNumber: number;     // 1-200 (trunca backend)
  filter?: string;           // Búsqueda global
  sortField?: string;        // Campo para ordernar
  sortOrder?: number;        // 1 = ASC, -1 = DESC
}

export const PAGINATION_MAX_RECORDS = 200;
export const PAGINATION_DEFAULT_SIZE = 30;

// Request inicial
export function defaultPaginationRequest(): PaginationRequest {
  return {
    page: 1,
    recordsNumber: PAGINATION_DEFAULT_SIZE,
    filter: "",
    sortField: "",
    sortOrder: 1,
  };
}
```

### PaginationStore (Señal)

**Ubicación:** `client/angular/src/app/core/stores/pagination.store.ts`

Gestiona estado paginado con Signals:

```typescript
import { signal, computed } from '@angular/core';
import { PaginationRequest, defaultPaginationRequest } from '../interfaces';

export class PaginationStore<T> {
  private items = signal<T[]>([]);
  private totalRecords = signal(0);
  private currentRequest = signal<PaginationRequest>(defaultPaginationRequest());
  private isLoading = signal(false);

  // Public signals
  items$ = this.items.asReadonly();
  totalRecords$ = this.totalRecords.asReadonly();
  currentRequest$ = this.currentRequest.asReadonly();
  isLoading$ = this.isLoading.asReadonly();

  // Computed
  pageCount = computed(() =>
    Math.ceil(this.totalRecords() / this.currentRequest().recordsNumber)
  );

  constructor(private api: SomeApiService) {}

  loadPage(request: PaginationRequest) {
    this.isLoading.set(true);
    this.currentRequest.set(request);

    this.api.getPagedData(request).subscribe(
      (response) => {
        this.items.set(response.items);
        this.totalRecords.set(response.totalRecords);
        this.isLoading.set(false);
      },
      () => this.isLoading.set(false)
    );
  }

  nextPage() {
    const current = this.currentRequest();
    this.loadPage({
      ...current,
      page: current.page + 1,
    });
  }

  previousPage() {
    const current = this.currentRequest();
    if (current.page > 1) {
      this.loadPage({
        ...current,
        page: current.page - 1,
      });
    }
  }

  sort(sortField: string, sortOrder: number = 1) {
    this.loadPage({
      ...this.currentRequest(),
      page: 1,
      sortField,
      sortOrder,
    });
  }
}
```

### Uso en Componente

**✅ BIEN — Usar Store:**

```typescript
import { Component, inject } from '@angular/core';
import { PaginationStore } from '@core/stores';

@Component({
  selector: 'app-users-list',
  imports: [CommonModule, CustomPaginatorComponent],
  template: `
    <div class="users-container">
      <!-- Header -->
      <h2>Usuarios</h2>
      <input
        placeholder="Buscar..."
        (change)="onSearch($event.target.value)"
      />

      <!-- Tabla -->
      <table>
        <thead>
          <tr>
            <th (click)="store.sort('name')">Nombre</th>
            <th (click)="store.sort('email')">Email</th>
          </tr>
        </thead>
        <tbody>
          @for (user of store.items$() | async; track user.id) {
            <tr>
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
            </tr>
          }
        </tbody>
      </table>

      <!-- Paginador -->
      @if ((store.isLoading$() | async) === false) {
        <app-custom-paginator
          [currentPage]="(store.currentRequest$() | async).page"
          [pageCount]="store.pageCount()"
          (pageChange)="store.loadPage({
            ...store.currentRequest$(),
            page: $event
          })"
        />
      }
    </div>
  `,
})
export class UsersListComponent {
  store = inject(PaginationStore<UserDTO>);

  ngOnInit() {
    this.store.loadPage(defaultPaginationRequest());
  }

  onSearch(query: string) {
    this.store.loadPage({
      ...this.store.currentRequest$(),
      page: 1,
      filter: query,
    });
  }
}
```


**Helper:** `lazyLoadToPaginationRequest`

```typescript

export function lazyLoadToPaginationRequest(
  event: TableLazyLoadEvent,
  fallbackSize: number = PAGINATION_DEFAULT_SIZE
): PaginationRequest {
  const rows = event.rows ?? fallbackSize;
  const first = event.first ?? 0;
  
  return {
    page: Math.floor(first / rows) + 1,  // Convertir first → page
    recordsNumber: Math.min(rows, PAGINATION_MAX_RECORDS),
    filter: (event.globalFilter as string) ?? "",
    sortField: (event.sortField as string) ?? "",
    sortOrder: event.sortOrder ?? 1,
  };
}
```

**Uso en p-table:**

```typescript
@Component({
  selector: 'app-users-table',
  template: `
    <p-table
      [value]="store.items$()"
      [lazy]="true"
      [loading]="store.isLoading$()"
      [totalRecords]="store.totalRecords$()"
      (onLazyLoad)="onLazyLoad($event)"
    >
      <p-column field="name" header="Nombre" sortable></p-column>
      <p-column field="email" header="Email" sortable></p-column>
    </p-table>
  `,
})
export class UsersTableComponent {
  store = inject(PaginationStore<UserDTO>);

  onLazyLoad(event: TableLazyLoadEvent) {
    const pagination = lazyLoadToPaginationRequest(event);
    this.store.loadPage(pagination);
  }
}
```

---

## 🔗 Query Parameters

**Frontend → Backend:**

```
GET /api/admin/catalogs/banks?page=2&recordsNumber=50&filter=BBVA&sortField=name&sortOrder=1

Backend interpreta:
- page: 2
- recordsNumber: 50
- filter: "BBVA"
- sortField: "name"
- sortOrder: 1 (ascendente)

Skip: (2-1) * 50 = 50 registros
Take: 50 registros
```

**Omitir parámetros** (usan defaults):

```
GET /api/admin/catalogs/banks
→ page=1, recordsNumber=30, filter="", sortOrder=1
```

---

## ⚠️ Reglas Obligatorias

| Regla | Backend | Frontend | Razón |
|-------|---------|----------|-------|
| Máximo 200 | ✅ Trunca en DTO | ✅ Envía min(rows, 200) | Evitar queries enormes |
| Page 1-indexed | ✅ Empieza en 1 | ✅ Empieza en 1 | Semantica clara |
| Default 30 | ✅ DTO default | ✅ Const default | Consistencia |
| Use BindAsync | ✅ OBLIGATORIO | N/A | Parámetros opcionales |
| Skip-Take antes | ✅ IQueryable | ✅ Backend | Evita N+1 |
| Filter primeiro | ✅ Where antes | N/A | Performance |

---

## 🚫 Anti-Patrones

**❌ Enumerable.Skip/Take después:**
```csharp
var all = repository.GetAll().ToList();  // ← Trae TODO
var page = all.Skip(skip).Take(take);    // ← Paginación en memoria
```

**❌ Usar [AsParameters]:**
```csharp
public IResult GetUsers([AsParameters] PaginationCommonDTO p)  // ← Falla sin ?page=
```

**❌ Hardcodear defaults en frontend:**
```typescript
// Cada componente con su propio default
const pageSize = 25;  // ← Inconsistente con backend (30)
```

**❌ Response sin totalRecords:**
```json
{
  "items": [...],
  "currentPage": 1
  // ← Falta totalRecords para calcular última página
}
```

---

## 📋 Checklist: Implementar Paginación

### Backend

- [ ] DTO hereda de `PaginationCommonDTO` (o lo recibe)
- [ ] Endpoint mapea con `BindAsync` automático
- [ ] Query: `.Where()` filtro → `.OrderBy()` → `.Paginate()`
- [ ] Response: `ApiResponseDTO<PagedResultDTO<T>>`
- [ ] Documentar: `[Display]` en propiedades
- [ ] Test: página 1, página 2, sin parámetros (defaults)

### Frontend

- [ ] Interfaz `PaginationRequest` espejo del backend
- [ ] Store usa Signals (`signal()`, `computed()`)
- [ ] Helper: `defaultPaginationRequest()`, `lazyLoadToPaginationRequest()`
- [ ] Componente: inyecta store, llama `loadPage()`
- [ ] Paginador visual: muestra página actual / total
- [ ] Test: cambio de página, búsqueda, sort

---

## 🔍 Debugging

**Backend - Ver query enviada:**
```csharp
var query = context.Request.QueryString.Value;
// Output: ?page=1&recordsNumber=30&filter=john&sortField=name
```

**Frontend - Ver qué envía:**
```typescript
console.log('Paginación enviada:', store.currentRequest$());
// Output: { page: 1, recordsNumber: 30, filter: 'john', sortField: 'name', sortOrder: 1 }
```

**Network tab:**
```
Request: GET /api/admin/catalogs/banks?page=2&recordsNumber=50...
Response: { data: { items: [...], totalRecords: 1234 }, success: true }
```

---

## 📚 Referencias

- **Backend:** `LuxuryApp.Shared/DTOs/PaginationCommonDTO.cs`
- **Frontend:** `client/angular/src/app/core/interfaces/pagination-request.dto.ts`
- **Store:** `client/angular/src/app/core/stores/pagination.store.ts`
- **CONVENTIONS.md:** §9 (Backend)

---

**Última actualización:** 2026-07-27  
**Versión:** 1.0  
**Status:** ✅ Implementado, obligatorio
