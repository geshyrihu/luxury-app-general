# Angular: Routing & Functional Guards

**Última revisión:** 2026-08-06  
**Derivado de:** CONVENTIONS.md §4 (Frontend Rules) + exploración codebase  
**Severidad:** 🟠 ALTA — Patrón obligatorio en rutas y seguridad

---

## Propósito

Documentar el patrón de **functional guards** para proteger rutas. Define cuándo usar CanActivateFn, cómo combinar múltiples guards, lazy loading, y guard precedence.

---

## Regla de Oro

```
Guards en Angular 17+ = Functional Guards (CanActivateFn)

❌ NO: Guardianes de clase (class Guard implements CanActivate)
✅ SÍ: Functional guards (CanActivateFn), composables con `compose()`
```

---

## 1. Functional Guard Pattern

### Guard Simple (Autenticación)

**Ubicación real:** `appsweb/angular/src/app/core/auth/guards/auth.guard.ts`

```typescript
// ✅ CORRECTO: Guard funcional
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // PASO 1: Validar autenticación
  if (authService.isAuthenticated()) {
    return true; // Permitir navegación
  }
  
  // PASO 2: Redirigir a login si no autenticado
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });
  return false; // Rechazar navegación
};
```

### Guard con Verificación Async

```typescript
// ✅ CORRECTO: Guard con promesa/observable
export const permissionGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Retornar observable/promesa
  return authService.checkPermissions().pipe(
    map(hasPermission => {
      if (hasPermission) {
        return true;
      } else {
        router.navigate(['/access-denied']);
        return false;
      }
    })
  );
};
```

### Guard con Role-Based Access

```typescript
// ✅ CORRECTO: Guard que verifica roles
export const roleGuard = (requiredRole: string): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    
    const userRole = authService.getUserRole();
    
    if (userRole === requiredRole || authService.hasAdmin()) {
      return true;
    }
    
    router.navigate(['/unauthorized']);
    return false;
  };
};
```

---

## 2. Routing Configuration

### Regla crítica de `MenuItem[]` con PrimeNG en standalone components

Cuando un shell o feature standalone alimente `MenuItem[]` a `Menubar`,
`Menu`, `TieredMenu`, `MegaMenu`, `PanelMenu`, `ContextMenu` o wrappers
equivalentes de PrimeNG, la navegación no debe declararse con `routerLink`
dentro del objeto `MenuItem`.

```typescript
// ❌ PROHIBIDO
readonly items: MenuItem[] = [
  { label: "Vacantes", routerLink: ["/recruitment/requests/vacancies"] },
];

// ✅ CORRECTO
readonly items: MenuItem[] = [
  {
    label: "Vacantes",
    command: () => this.router.navigateByUrl("/recruitment/requests/vacancies"),
  },
];
```

**Regla operativa:**

- `routerLink` sí se permite en templates Angular normales.
- En `MenuItem[]` de PrimeNG usados desde standalone components, usar `command`
  + `Router.navigate()` o `Router.navigateByUrl()`.
- La auditoría debe revisar este punto aunque el build compile limpio.

**Motivo:** PrimeNG puede materializar internamente `RouterLink` con un
injector que no hereda bien `ActivatedRoute`, causando
`NG0201: No provider found for ActivatedRoute` solo en runtime.

### Estructura Completa de Rutas

**Ubicación real:** `appsweb/angular/src/app/app.routes.ts`

```typescript
import { Routes } from '@angular/router';
import { authGuard } from '@core/auth/guards/auth.guard';
import { committeeGuard } from '@core/guards/committee.guard';
import { roleGuard } from '@core/guards/role.guard';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  
  // ========== PUBLIC ROUTES (Sin guards) ==========
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component')
      .then(m => m.LoginComponent)
  },
  
  // ========== PROTECTED ROUTES (authGuard obligatorio) ==========
  {
    path: 'dashboard',
    loadComponent: () => import('./layout/layout-employee.component')
      .then(m => m.LayoutEmployeeComponent),
    canActivate: [authGuard], // Proteger con auth
    children: [
      {
        path: 'home',
        loadComponent: () => import('./apps/dashboard/home.component')
          .then(m => m.HomeComponent)
      },
      {
        path: 'cobranza',
        loadChildren: () => import('./apps/cobranza.luxuryapp/cobranza.routes')
          .then(m => m.COBRANZA_ROUTES),
        canActivate: [authGuard] // Replicar en subrutas
      }
    ]
  },
  
  // ========== ROLE-BASED ROUTES (Múltiples guards) ==========
  {
    path: 'admin',
    loadComponent: () => import('./layout/layout-admin.component')
      .then(m => m.LayoutAdminComponent),
    canActivate: [
      authGuard,                      // 1. Autenticado
      roleGuard('AdminLuxuryApp')    // 2. Es administrador
    ],
    children: [
      {
        path: 'users',
        loadComponent: () => import('./apps/admin/users/users.component')
          .then(m => m.UsersComponent)
      }
    ]
  },
  
  // ========== FEATURE-SPECIFIC ROUTES (Guards específicos) ==========
  {
    path: 'committee',
    loadComponent: () => import('./layout/layout-committee.component')
      .then(m => m.LayoutCommitteeComponent),
    canActivate: [
      authGuard,
      committeeGuard // Guard específico para comisión
    ],
    children: [
      {
        path: 'cobranza',
        loadChildren: () => import('./apps/committee.luxuryapp/committee.routes')
          .then(m => m.COMMITTEE_ROUTES)
      }
    ]
  },
  
  // ========== FALLBACK (página no encontrada) ==========
  {
    path: '**',
    loadComponent: () => import('./not-found/not-found.component')
      .then(m => m.NotFoundComponent)
  }
];
```

### Feature Routing con Guards

**Ubicación real:** `appsweb/angular/src/app/modules/cobranza.luxuryapp/cobranza.routes.ts`

```typescript
// Rutas de feature (sub-aplicación)
export const COBRANZA_ROUTES: Routes = [
  {
    path: '',
    component: CobranzaWrapperComponent, // Componente maestro
    children: [
      {
        path: 'online',
        loadComponent: () => import('./cobranza-online/cobranza-online.component')
          .then(m => m.CobranzaOnlineComponent)
      },
      {
        path: 'analysis',
        loadComponent: () => import('./cobranza-analysis/cobranza-analysis.component')
          .then(m => m.CobranzaAnalysisComponent),
        canActivate: [authGuard] // Proteger ruta específica
      },
      {
        path: 'detail/:id',
        loadComponent: () => import('./cobranza-detail/cobranza-detail.component')
          .then(m => m.CobranzaDetailComponent)
      }
    ]
  }
];
```

---

## 3. Lazy Loading Pattern

### Cargar Componentes Dinámicamente

```typescript
// ✅ CORRECTO: Lazy load componente + guard
{
  path: 'cobranza',
  loadComponent: () => import('./apps/cobranza/cobranza.component')
    .then(m => m.CobranzaComponent),
  canActivate: [authGuard] // Proteger antes de cargar
}

// ✅ CORRECTO: Lazy load feature (múltiples rutas)
{
  path: 'committee',
  loadChildren: () => import('./apps/committee.luxuryapp/committee.routes')
    .then(m => m.COMMITTEE_ROUTES),
  canActivate: [authGuard, committeeGuard]
}
```

### Prerrender vs Lazy Load

```typescript
// ✅ CORRECTO: Rutas públicas (precargar)
{
  path: 'public',
  loadComponent: () => import('./public/public.component')
    .then(m => m.PublicComponent),
  // Sin guard → carga inmediata en build
}

// ✅ CORRECTO: Rutas protegidas (lazy load)
{
  path: 'private',
  loadComponent: () => import('./private/private.component')
    .then(m => m.PrivateComponent),
  canActivate: [authGuard] // Guard rechaza si necesario
  // Carga solo si autenticado
}
```

---

## 4. Guard Composition & Precedence

### Orden de Ejecución de Guards

```typescript
{
  path: 'sensitive-route',
  component: SensitiveComponent,
  canActivate: [
    authGuard,           // 1️⃣ Se ejecuta PRIMERO
    roleGuard('Admin'),  // 2️⃣ Se ejecuta SEGUNDO (solo si authGuard retorna true)
    permissionGuard      // 3️⃣ Se ejecuta TERCERO (solo si roleGuard retorna true)
  ]
}

// Si authGuard retorna false → roleGuard y permissionGuard NO se ejecutan
// Si roleGuard retorna false → permissionGuard NO se ejecuta
```

### Composición Manual de Guards

```typescript
// ✅ CORRECTO: Crear guard compuesto
export const protectedCobranzaGuard: CanActivateFn = (route, state) => {
  const auth = inject(authGuard);
  const committee = inject(committeeGuard);
  
  // Ambos guards deben retornar true
  return auth(route, state) && committee(route, state);
};

// Usar en rutas
{
  path: 'cobranza',
  canActivate: [protectedCobranzaGuard]
}
```

---

## 5. Error Handling & Navigation

### Redirect Patterns

```typescript
// ✅ CORRECTO: Redirect con queryParams
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  }
  
  // Guardar URL destino para redirigir después del login
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });
  return false;
};

// En LoginComponent: leer returnUrl y navegar
export class LoginComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  async onLoginSuccess(): Promise<void> {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    await this.router.navigateByUrl(returnUrl);
  }
}
```

### Manejo de Errores

```typescript
// ✅ CORRECTO: Guard con error handling
export const permissionGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  return authService.checkPermissions().pipe(
    map(hasPermission => hasPermission),
    
    // Manejar errores de la API
    catchError(error => {
      console.error('Permission check failed:', error);
      router.navigate(['/error']);
      return of(false);
    })
  );
};
```

---

## 6. Route Parameters & Data

### Acceder a Parámetros

```typescript
// Ruta con parámetro
{
  path: 'detail/:id',
  component: DetailComponent,
  canActivate: [detailGuard]
}

// Guard accede a parámetro
export const detailGuard: CanActivateFn = (route, state) => {
  const id = route.paramMap.get('id');
  console.log('Accessing detail:', id);
  return true;
};

// Componente accede a parámetro
export class DetailComponent {
  private route = inject(ActivatedRoute);
  
  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      // Cargar detalles
    });
  }
}
```

### Route Data (Metadatos)

```typescript
// ✅ CORRECTO: Pasar datos a través de ruta
{
  path: 'reports',
  component: ReportsComponent,
  data: { title: 'Reportes', requiredRole: 'AdminLuxuryApp' }
}

// Guard accede a data
export const roleDataGuard: CanActivateFn = (route) => {
  const requiredRole = route.data['requiredRole'];
  const authService = inject(AuthService);
  
  return authService.hasRole(requiredRole);
};
```

---

## 7. Verificaciones de Auditoría

### Checklist de Routing & Guards

- [ ] ¿Todas las rutas protegidas tienen `canActivate: [authGuard]`?
- [ ] ¿Guards son funcionales (CanActivateFn) no clases?
- [ ] ¿Rutas con datos sensibles tienen múltiples guards?
- [ ] ¿Lazy loading está configurado en rutas feature?
- [ ] ¿Guards retornan false + router.navigate() si rechazan?
- [ ] ¿Async guards usan catchError() para manejar errores?
- [ ] ¿returnUrl se pasa en queryParams para login?
- [ ] ¿Componentes leen params con route.paramMap.get()?
- [ ] ¿No hay rutas públicas sin guards en lugar incorrecto?
- [ ] ¿Feature routes tienen estructura clara (path + loadChildren)?

### Comandos de Validación

```bash
# Validar que hay guards en app.routes.ts
grep -n "canActivate" appsweb/angular/src/app/app.routes.ts

# Buscar rutas sin guards (potencial riesgo)
grep -n "path:" appsweb/angular/src/app/app.routes.ts | \
  grep -v "canActivate" | grep -v "'login'" | grep -v "'public'"

# Contar guards funcionales
grep -r "CanActivateFn" appsweb/angular/src/app --include="*.ts" | wc -l

# Buscar clase guards antiguos (debería ser 0)
grep -r "implements CanActivate" appsweb/angular/src/app --include="*.ts"

# Validar loadComponent/loadChildren
grep -n "loadComponent\|loadChildren" appsweb/angular/src/app/app.routes.ts
```

---

## 8. Anti-patrones

| ❌ Incorrecto | ✅ Correcto | Razón |
|---|---|---|
| Guardianes de clase (implements CanActivate) | Functional guards (CanActivateFn) | Más simple, composable, sin DI class |
| Un solo guard para todo | Múltiples guards por responsabilidad | Separación de concerns, reutilizable |
| Guard sin error handling | Guard con catchError | No rompe navegación si API falla |
| Rutas sin guards en protected areas | Siempre canActivate + authGuard | Seguridad por defecto |
| Lazy load sin guards | Guards ANTES de loadComponent/loadChildren | Guard rechaza antes de descargar |
| Redirect sin returnUrl | router.navigate + queryParams returnUrl | Mejor UX post-login |
| Guard que no retorna boolean/observable | Retornar true/false/Observable<boolean> | Angular requiere valores válidos |

---

## 9. Referencias y Documentos Relacionados

- [CONVENTIONS.md §4 — Frontend Rules](../CONVENTIONS.md#4-frontend-rules)
- [angular-signals-and-state.md](./angular-signals-and-state.md) — Guards con signals
- [angular-components-api.md](./angular-components-api.md) — ActivatedRoute en componentes
- Angular Docs: [Router Guards](https://angular.io/guide/router-tutorial-hero#preventing-unauthorized-access)

---

**Última actualización:** 2026-08-06  
**Vigencia:** Angular 15+ (Functional Guards)  
**Aplicable a:** Todas las rutas en el proyecto
