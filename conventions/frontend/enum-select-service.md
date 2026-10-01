# enum-select-service.md — Servicio Frontend Centralizado para SelectItems

> **Estado:** Vigente  
> **Autorizado:** 2026-09-20  
> **Implementación real:** `appsweb/angular/src/app/core/services/enum-select.service.ts`

---

## 1. Propósito

Servicio **único y centralizado** en frontend para consumir **todos los SelectItems** (enums estáticos + catálogos dinámicos) desde los dos hubs backend oficiales:

| Hub Backend | Endpoint Base | Servicio Frontend |
|-------------|---------------|-------------------|
| **Enums estáticos** | `/api/select-item-enum/{enumName}` | `EnumSelectService.onLoadEnumList()` |
| **Datos dinámicos** | `/api/select-items/{catalogo}` | `EnumSelectService.onLoadSelectList()` |

---

## 2. Arquitectura del Servicio

```typescript
@Injectable({ providedIn: 'root' })  // Singleton global
export class EnumSelectService {
  private readonly apiResponseS = inject(ApiResponseService);

  // 1. Enums estáticos (backend: SelectItemEnumEndPoints)
  onLoadEnumList(nameEnum: string, defaultOption?: boolean): Observable<SelectItemDto[]> {
    const urlApi = Endpoints.EnumSelectItems.selectItemEnum(nameEnum, defaultOption?.toString());
    return from(this.apiResponseS.onGetList<SelectItemDto[]>(urlApi)).pipe(
      map((result) => result || []),
      catchError((error) => { console.error(`Error ${nameEnum}:`, error); return of([]); })
    );
  }

  // 2. Catálogos dinámicos (backend: SelectItemEndPoints)
  onLoadSelectList(nameEnum: string): Observable<SelectItemDto[]> {
    return from(this.apiResponseS.onGetSelectItem<SelectItemDto[]>(nameEnum)).pipe(
      map((result) => result || []),
      catchError((error) => { console.error(`Error ${nameEnum}:`, error); return of([]); })
    );
  }

  // 3. Métodos de conveniencia (uno por catálogo)
  areaMinutasDetalles = (d?: boolean) => this.onLoadEnumList("area-minutas-detalles", d);
  departament = (d?: boolean) => this.onLoadEnumList("departament", d);
  candidateProcessStage = (d?: boolean) => this.onLoadEnumList("candidate-process-stage", d);
  // ... 80+ métodos más
}
```

---

## 3. Patrones de Uso en Componentes

### A. Enums con opción "Selecciona..." (`defaultOption: true`)
```typescript
@Component({...})
export class MiComponente {
  status$ = this.enumSelectS.status(true);  // true = agrega opción "Selecciona..."

  constructor(private enumSelectS: EnumSelectService) {}
}
```
```html
<select [formControl]="form.get('status')">
  <option *ngFor="let item of status$ | async" [value]="item.value">
    {{ item.label }}
  </option>
</select>
```

### B. Enums sin opción default (`defaultOption: false` / omitido)
```typescript
tipoBaja$ = this.enumSelectS.tipoBaja();  // sin parámetro = sin opción default
```

### C. Catálogos dinámicos (sin defaultOption)
```typescript
bancos$ = this.enumSelectS.onLoadSelectList("banks");
empleados$ = this.enumSelectS.onLoadSelectList("employees-active/{{customerId}}");
```

---

## 4. Cache en Frontend: `shareReplay(1)` (PENDIENTE ESTÁNDAR)

> **Nota:** La implementación actual **NO usa `shareReplay(1)`**. Cada suscripción dispara HTTP request.

### Patrón Recomendado (a implementar):
```typescript
@Injectable({ providedIn: 'root' })
export class EnumSelectService {
  private readonly cache = new Map<string, Observable<SelectItemDto[]>>();

  onLoadEnumList(nameEnum: string, defaultOption?: boolean): Observable<SelectItemDto[]> {
    const key = `${nameEnum}:${defaultOption ?? 'no-default'}`;
    
    if (!this.cache.has(key)) {
      const urlApi = Endpoints.EnumSelectItems.selectItemEnum(nameEnum, defaultOption?.toString());
      const request$ = from(this.apiResponseS.onGetList<SelectItemDto[]>(urlApi)).pipe(
        map((result) => result || []),
        catchError((error) => { console.error(`Error ${nameEnum}:`, error); return of([]); }),
        shareReplay(1)  // 🔑 CACHE: comparte 1 suscripción, reemite a nuevos suscriptores
      );
      this.cache.set(key, request$);
    }
    
    return this.cache.get(key)!;
  }
}
```

| Sin `shareReplay(1)` | Con `shareReplay(1)` |
|----------------------|----------------------|
| Cada `async` pipe = 1 request HTTP | Primera suscripción = request, siguientes = cache |
| 3 dropdowns mismo enum = 3 requests | 3 dropdowns mismo enum = 1 request |
| Usuario navega back/forth = requests repetidos | Navegación instantánea |

---

## 5. Endpoints Constants (Frontend ↔ Backend Mapping)

**Archivo:** `core/constants/endpoints/select-item.endpoints.ts`

```typescript
export const EndpointsSelectItem = {
  SelectItems: {
    // Dinámicos (requieren customerId)
    employeeActive: (customerId: string) => `employees-active/${customerId}`,
    employeesByCustomer: (customerId: string) => `employees/${customerId}`,
    properties: (customerId: string) => `properties/${customerId}`,
    vacantes: (customerId: string) => `vacantes/${customerId}`,
    
    // Globales (sin parámetros)
    banks: "banks",
    categories: "categories",
    candidates: "candidates",
    documentCatalog: "document-catalog",
    useCFDI: "cfdi-uses",
    // ... 60+ más
  },
  
  EnumSelectItems: {
    // Enums estáticos (mapeo 1:1 con SelectItemEnumEndPoints.cs)
    selectItemEnum: (nameEnum: string, defaultOption?: string) => 
      `select-item-enum/${nameEnum}${defaultOption ? `/${defaultOption}` : ''}`,
  }
} as const;
```

---

## 6. Reglas Obligatorias

| Regla | Descripción |
|-------|-------------|
| **Un solo servicio** | `EnumSelectService` es la **única** forma de obtener SelectItems en frontend |
| **Nunca HTTP directo** | ❌ `this.http.get('/api/select-items/banks')` → ✅ `enumSelectS.onLoadSelectList('banks')` |
| **Nombres exactos** | El `nameEnum` DEBE coincidir con ruta backend (`SelectItemEnumEndPoints.cs` o `SelectItemEndPoints.cs`) |
| **Tipado** | Retorna `Observable<SelectItemDto[]>` — `SelectItemDto = { label: string; value: T }` |
| **Manejo de error** | `catchError` → retorna `of([])` (array vacío), nunca rompe el componente |

---

## 7. Catálogos Disponibles (Resumen)

### Enums Estáticos (`onLoadEnumList`)
```typescript
// Ejemplos - ver servicio completo para lista total (80+)
status, tipoBaja, tipoGasto, tipoJornada, typeContract, typePerson,
candidateProcessStage, candidateProcessStatus, maritalStatus, sex,
month, priorityLevel, visibilityLevel, severityLevel, incidentCategory,
rolLevel, roleType, typeMeeting, investigationStatus, billingMode, ...
```

### Catálogos Dinámicos (`onLoadSelectList`)
```typescript
// Globales
banks, categories, candidates, documentCatalog, useCFDI, paymentMethod,
measurementUnits, recruitmentSources, onboardingChecklistOptions, ...

// Por CustomerId (requieren parámetro)
employeeActive(customerId), employeesByCustomer(customerId),
properties(customerId), vacantes(customerId), providers(customerId),
machineryActiveByCustomer(customerId), tools(customerId), ...
```

---

## 8. Checklist al Agregar Nuevo SelectItem

- [ ] Backend: Agregar endpoint en `SelectItemEndPoints.cs` (dinámico) o `SelectItemEnumEndPoints.cs` (enum)
- [ ] Backend: Registrar en hub correspondiente
- [ ] Frontend: Agregar entrada en `select-item.endpoints.ts` (`SelectItems` o `EnumSelectItems`)
- [ ] Frontend: Agregar método de conveniencia en `EnumSelectService` (ej. `nuevoCatalogo = () => this.onLoadSelectList('nuevo-catalogo')`)
- [ ] Frontend: Documentar en componente que lo usa
- [ ] Test: Verificar que dropdown carga datos correctamente

---

## 9. Referencias

| Documento | Qué cubre |
|-----------|-----------|
| `select-items-centralization-rule.md` | Hubs únicos backend |
| `select-items-ttl-policy.md` | TTL backend (15min/5min/24h) |
| `select-item-filtering-rules.md` | Filtrado por rol/tenant en backend |
| `iendpointsmodule-pattern.md` | Patrón `IEndPointsModule` |
| `EnumSelectService.ts` | Implementación real |
| `select-item.endpoints.ts` | Mapeo frontend-backend |
