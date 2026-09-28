# endpoint-constants-as-const.md — `as const` Obligatorio en Endpoints Constants

> **Estado:** Vigente  
> **Autorizado:** 2026-09-20  
> **Implementación real:** `appsweb/angular/src/app/core/constants/endpoints/*.ts`

---

## 1. Regla: `as const` Obligatorio

**TODOS** los objetos de constantes de endpoints DEBEN usar `as const`.

```typescript
// ✅ CORRECTO
export const EndpointsAdmin = {
  UserAccounts: {
    getAll: (state: boolean) => `admin/user-accounts/list/${state}`,
    getById: (id: string) => `admin/user-accounts/${id}`,
  },
  Customers: {
    create: "customers",
    getById: (id: string) => `customers/${id}`,
  }
} as const;  // 🔑 OBLIGATORIO

// ❌ PROHIBIDO - Sin as const
export const EndpointsAdmin = {
  UserAccounts: {
    getAll: (state: boolean) => `admin/user-accounts/list/${state}`,
  }
  // TypeScript infiere tipos amplios (string, Function), pierde type-safety
};
```

---

## 2. Por Qué `as const`

| Sin `as const` | Con `as const` |
|----------------|----------------|
| Tipos inferidos: `string`, `Function` | Tipos literales exactos: `"customers"`, `(id: string) => string` |
| No autocompletado en IDE | Autocompletado completo: `EndpointsAdmin.UserAccounts.getById("123")` |
| No detección de typos | Error en compile-time si ruta no existe |
| Refactoring riesgoso | Refactoring seguro (cambio en constante propaga a usos) |

---

## 3. Ejemplos Reales en el Proyecto

### A. `select-item.endpoints.ts` (67 líneas)
```typescript
export const EndpointsSelectItem = {
  SelectItems: {
    accountingCatalogsByCustomer: (customerId: string, _year?: number) =>
      `accounting-catalogs/${customerId}`,
    applicationRoles: "application-roles",
    banks: "banks",
    candidates: "candidates",
    // ... 60+ entradas
  },
  EnumSelectItems: {
    selectItemEnum: (nameEnum: string, defaultOption?: string) =>
      `select-item-enum/${nameEnum}${defaultOption ? `/${defaultOption}` : ''}`,
  }
} as const;  // 🔑
```

### B. `admin.endpoints.ts` (254 líneas)
```typescript
export const EndpointsAdmin = {
  UserAccounts: {
    addRoleToUser: (id: string, allowedRoleType?: number | null) =>
      allowedRoleType !== null && allowedRoleType !== undefined
        ? `admin/user-accounts/add-role-to-user/${id}?allowedRoleType=${allowedRoleType}`
        : `admin/user-accounts/add-role-to-user/${id}`,
    createAccount: "admin/user-accounts/create-account",
    delete: (id: string) => `admin/user-accounts/delete/${id}`,
    // ... 20+ métodos
  },
  Customers: { /* ... */ },
  Catalogs: {
    Banks: { /* ... */ },
    CfdiUses: { /* ... */ },
    // ... 10+ catálogos
  }
} as const;  // 🔑
```

---

## 4. Inferencia de Tipos con `as const`

```typescript
// Con as const, TypeScript infiere:
type EndpointsAdminType = typeof EndpointsAdmin;
// Resulta en:
// {
//   UserAccounts: {
//     readonly createAccount: "admin/user-accounts/create-account";
//     readonly getById: (id: string) => string;
//     readonly getAll: (state: boolean) => string;
//     ...
//   };
//   readonly Customers: { ... };
// }

// Uso en servicios con type-safety total:
@Injectable({ providedIn: 'root' })
export class AdminService {
  getUsers(state: boolean): Observable<User[]> {
    // TypeScript sabe que EndpointsAdmin.UserAccounts.getAll existe y retorna string
    const url = EndpointsAdmin.UserAccounts.getAll(state);
    return this.http.get<User[]>(url);
  }
}
```

---

## 5. Reglas de Estructura

| Regla | Descripción |
|-------|-------------|
| **Un archivo por dominio** | `admin.endpoints.ts`, `select-item.endpoints.ts`, `reclutamiento.endpoints.ts` |
| **Objeto raíz `as const`** | El objeto exportado principal DEBE tener `as const` |
| **Funciones flecha tipadas** | Parámetros con tipos explícitos: `(id: string) => ...` |
| **Nombres en PascalCase** | `EndpointsAdmin`, `EndpointsSelectItem` |
| **Export named** | `export const EndpointsAdmin = ...` (no default) |

---

## 6. Archivo Raíz `endpoints.ts` (Legacy)

```typescript
// endpoints.ts - DEPRECATED (ver plan B3)
// Re-exporta todo para compatibilidad
export * from './admin.endpoints';
export * from './select-item.endpoints';
// ...

/**
 * @deprecated Desde 2026-09-20. Use imports directos.
 * Plan eliminación: 3 meses (2026-12-20).
 */
export const Endpoints = {
  ...EndpointsAdmin,
  ...EndpointsSelectItem,
  // ...
} as const;
```

> **Nota:** `endpoints.ts` TAMBIÉN debe tener `as const` para mantener type-safety durante migración.

---

## 7. Checklist al Crear/Modificar Endpoints Constants

- [ ] Archivo en `core/constants/endpoints/[modulo].endpoints.ts`
- [ ] Objeto exportado con `as const`
- [ ] Funciones con parámetros tipados: `(id: string, customerId: string) => ...`
- [ ] Rutas coinciden **exactamente** con backend (`IEndPointsModule.MapEndPoints`)
- [ ] Sin `as const` → **No aprobar PR**

---

## 8. Referencias

| Documento | Qué cubre |
|-----------|-----------|
| `frontend-api-endpoints.md` | Patrón de registro por dominio |
| `iendpointsmodule-pattern.md` | Backend `IEndPointsModule` |
| `enum-select-service.md` | Consumo en `EnumSelectService` |
| `admin.endpoints.ts` | Implementación real (254 líneas) |
| `select-item.endpoints.ts` | Implementación real (67 líneas) |