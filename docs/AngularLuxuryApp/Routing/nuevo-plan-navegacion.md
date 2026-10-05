# Plan de Estandarización de Navegación — `navigate()` vs `routerLink`

> Basado en el inventario actual: ~168 navegaciones programáticas + ~77 declarativas = ~259 total

---

## 1. Diagnóstico Actual

| Patrón                        | Ocurrencias | Archivos |
| ----------------------------- | ----------- | -------- |
| `router.navigate()`           | ~102        | ~60      |
| `router.navigateByUrl()`      | ~66         | ~40      |
| `routerLink="..."` estático   | 23          | ~15      |
| `[routerLink]="..."` dinámico | 54          | ~30      |
| **Total**                     | **~259**    | **~103** |

### 1.1 Problemas Identificados

| #   | Problema                                                                                                                                                   | Ejemplo                                                                                   |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| N1  | **Mezcla sin criterio**: el mismo tipo de navegación se implementa con distintos patrones                                                                  | Una lista que navega a detalle usa `navigate()` en un componente y `[routerLink]` en otro |
| N2  | **Rutas hardcodeadas en .ts**: `router.navigate(['/purchases/orden-compra', id])` crea strings mágicos imposibles de trackear en compilación               | Si se renombra la ruta, el compilador no avisa                                            |
| N3  | **Rutas relativas frágiles**: `router.navigate(['../detail'], {relativeTo: route})` y `routerLink="../detail"` se rompen al cambiar la estructura de rutas | Dependen del contexto anidado                                                             |
| N4  | **`navigateByUrl()` sin tipo**: acepta strings planos, propenso a typos                                                                                    | `navigateByUrl('/purchases/orden-compra/' + id)`                                          |
| N5  | **Sin constantes de ruta**: no existe un `ROUTES` map centralizado                                                                                         | Las rutas se escriben como strings literales en ~259 lugares                              |

### 1.2 Distribución por Tipo de Acción

| Contexto                                        | Patrón Recomendado | ¿Qué se usa hoy?                        |
| ----------------------------------------------- | ------------------ | --------------------------------------- |
| Enlace en template HTML (menú, tabla, botón)    | `[routerLink]`     | ✅ 77 usos → bien                       |
| Navegación post-evento (submit, guard, service) | `navigate()`       | ✅ 168 usos → bien                      |
| Navegación desde servicio sin acceso a template | `navigate()`       | ✅ Bien                                 |
| Navegación con URL dinámica desde BD            | `navigateByUrl()`  | ⚠️ 66 usos → debe migrar a `navigate()` |
| Navegación relativa (volver, breadcrumb)        | `navigate()`       | ⚠️ 12 usos → frágiles                   |

---

## 2. Decisión: Usar `router.navigate()` como Único Patrón

### 2.1 Regla Principal

> **Usar SIEMPRE `router.navigate()`** con una referencia al `ROUTES` map.
>
> Prohibido: `router.navigateByUrl()`, strings hardcodeados en `router.navigate()`.
>
> permitido: `[routerLink]` en templates SOLO para enlaces estáticos de menú/sidebar.

### 2.2 Justificación

| Razón                 | Detalle                                                                                |
| --------------------- | -------------------------------------------------------------------------------------- |
| **Tipado**            | `navigate()` acepta array de segmentos, facilita migrar a rutas tipadas                |
| **Consistencia**      | Un solo patrón siempre, sin ambigüedad                                                 |
| **Testeabilidad**     | Más fácil de mockear `Router` que parsear `routerLink`                                 |
| **Refactor-friendly** | Con constantes de ruta, cambiar una ruta cambia en 1 lugar                             |
| **RelativeTo**        | `navigate()` soporta `{relativeTo: route}` que es más explícito que `routerLink="../"` |

---

## 3. Propuesta: Sistema de Constantes de Ruta

### 3.1 Archivo Central: `routing/route-paths.ts`

Crear un map de todas las rutas canónicas como constantes:

```typescript
// routing/route-paths.ts
export const ROUTES = {
  // Auth
  LOGIN: ["/auth", "login"],
  RECOVERY_PASSWORD: ["/auth", "recovery-password"],
  RESET_PASSWORD: ["/auth", "reset-password"],

  // Dashboard
  DASHBOARD: ["/dashboard"],

  // Compras
  COMPRAS: {
    SOLICITUDES: ["/compras", "solicitudes"],
    SOLICITUD_DETALLE: (id: string) => ["/compras", "solicitudes", id],
    ORDENES_COMPRA: ["/compras", "ordenes-compra"],
    ORDEN_COMPRA_DETALLE: (id: string) => ["/compras", "ordenes-compra", id],
    PRODUCTOS_SERVICIOS: ["/compras", "productos-servicios"],
    GASTOS_FIJOS: ["/compras", "gastos-fijos"],
  },

  // Recursos Humanos
  RECURSOS_HUMANOS: {
    DASHBOARD: ["/recursos-humanos"],
    MIS_PERMISOS: ["/recursos-humanos", "mis-permisos"],
    MIS_VACACIONES: ["/recursos-humanos", "mis-vacaciones"],
    APROBACIONES: ["/recursos-humanos", "aprobaciones"],
    HISTORIAL: ["/recursos-humanos", "historial"],
    NOMINA: {
      LISTA: ["/recursos-humanos", "nomina", "nominas"],
      DETALLE: (id: string) => ["/recursos-humanos", "nomina", "nominas", id],
      CONFIGURACION: ["/recursos-humanos", "nomina", "configuracion"],
      PERIODOS: ["/recursos-humanos", "nomina", "periodos"],
    },
  },

  // ... todos los módulos
} as const;
```

### 3.2 Archivo de Funciones Helper: `routing/navigate.helper.ts`

```typescript
// routing/navigate.helper.ts
import { inject } from "@angular/core";
import { Router, NavigationExtras } from "@angular/router";

export function useNavigate() {
  const router = inject(Router);

  return {
    to: (route: any[], extras?: NavigationExtras) =>
      router.navigate(route, extras),

    // Para navegación desde servicios (sin componente)
    fromService: (router: Router, route: any[], extras?: NavigationExtras) =>
      router.navigate(route, extras),

    // Para navegación relativa (reemplaza routerLink="../detail")
    relativeTo: (route: any[], relativeTo: any, extras?: NavigationExtras) =>
      router.navigate(route, { ...extras, relativeTo }),
  };
}
```

---

## 4. Reglas de Estandarización

### Regla 1: Siempre `navigate()` con `ROUTES`

✅ Correcto:

```typescript
this.router.navigate(ROUTES.COMPRAS.ORDEN_COMPRA_DETALLE(id));
```

❌ Incorrecto:

```typescript
this.router.navigate(["/purchases/orden-compra", id]);
this.router.navigateByUrl(`/purchases/orden-compra/${id}`);
```

### Regla 2: `[routerLink]` SOLO para estructuras de menú dinámico

✅ Correcto (sidebar):

```html
<a [routerLink]="item.routerLink">{{ item.label }}</a>
```

❌ Incorrecto (navegación post-evento en template):

```html
<button [routerLink]="['/compras/solicitudes']">Ir</button>
```

✅ Mejor:

```html
<button (click)="onClick()">Ir</button>
```

```typescript
onClick() {
  this.navigate.to(ROUTES.COMPRAS.SOLICITUDES);
}
```

### Regla 3: Prohibido `navigateByUrl()`

Migrar todos los usos actuales (~66):

| Uso Actual                                         | Migración                                           |
| -------------------------------------------------- | --------------------------------------------------- |
| `navigateByUrl('/auth/login')`                     | `navigate(ROUTES.LOGIN)`                            |
| `navigateByUrl(\`/purchases/orden-compra/${id}\`)` | `navigate(ROUTES.COMPRAS.ORDEN_COMPRA_DETALLE(id))` |
| `navigateByUrl(item.urlRoute)`                     | Requiere un map de rutas dinámicas (sección 5)      |

### Regla 4: Prohibido strings hardcodeados

Buscar y reemplazar todos los strings de ruta en `.ts` por referencias a `ROUTES.*`.

### Regla 5: Navegación relativa solo con `navigate()`

✅ Correcto:

```typescript
this.router.navigate(["../detalle", id], { relativeTo: this.route });
```

❌ Incorrecto:

```html
<a routerLink="../detalle/{{id}}">Detalle</a>
```

---

## 5. Manejo de Rutas Dinámicas (desde BD)

### 5.1 Problema

~30 navegaciones usan rutas que vienen de la BD (`item.urlRoute`, `customData.route`, etc.). No podemos tipar estas rutas con `ROUTES` porque son dinámicas.

### 5.2 Solución: Whitelist + Fallback

```typescript
// routing/route-whitelist.ts
const ROUTE_WHITELIST = new Set([
  "/dashboard",
  "/compras/solicitudes",
  "/compras/ordenes-compra",
  // ... todas las rutas canónicas válidas
]);

export function isRouteValid(route: string): boolean {
  return ROUTE_WHITELIST.has(route) || /^\/[a-z-]+(\/[a-z-]+)*$/.test(route);
}
```

```typescript
// En el sidebar / notificaciones
const route = item.urlRoute;
if (route && isRouteValid(route)) {
  this.router.navigate([route]);
} else {
  console.warn(`Ruta inválida desde BD: ${route}`);
}
```

---

## 6. Plan de Acción

### Fase 1: Crear infraestructura (Día 1)

| Tarea | DESCRIPCIÓN                                             |
| ----- | ------------------------------------------------------- |
| 1.1   | Crear `routing/route-paths.ts` con constantes de ruta   |
| 1.2   | Crear `routing/navigate.helper.ts` con helper           |
| 1.3   | Crear `routing/route-whitelist.ts` para rutas dinámicas |

### Fase 2: Migrar `navigateByUrl()` → `navigate()` (Días 2-3)

| Tarea | Ocurrencias                            |
| ----- | -------------------------------------- |
| 2.1   | Migrar auth/login (5)                  |
| 2.2   | Migrar header-employee-monitor.ts (6)  |
| 2.3   | Migrar juntas-mensuales-session.ts (6) |
| 2.4   | Migrar cobranza dashboards (4)         |
| 2.5   | Migrar staff-board.ts (3)              |
| 2.6   | Migrar nominas, nomina-dashboard (2)   |
| 2.7   | Migrar funding lists (2)               |
| 2.8   | Migrar resto de ocurrencias (~38)      |

### Fase 3: Reemplazar strings hardcodeados por `ROUTES.*` (Días 4-5)

| Tarea | Ocurrencias                                        |
| ----- | -------------------------------------------------- |
| 3.1   | Reemplazar en `purchases/` (~16 navegaciones)      |
| 3.2   | Reemplazar en `hr/` (~20 navegaciones)             |
| 3.3   | Reemplazar en `operations/` (~30 navegaciones)     |
| 3.4   | Reemplazar en `maintenance/` (~15 navegaciones)    |
| 3.5   | Reemplazar en `accounting/` (~12 navegaciones)     |
| 3.6   | Reemplazar en resto de archivos (~20 navegaciones) |

### Fase 4: Migrar `[routerLink]` en eventos (Día 6)

| Tarea | DESCRIPCIÓN                                                                |
| ----- | -------------------------------------------------------------------------- |
| 4.1   | Identificar `[routerLink]` en botones que deberían ser `(click)`           |
| 4.2   | Migrar a `navigate(ROUTES.*)` con `(click)`                                |
| 4.3   | Dejar `[routerLink]` solo en sidebar, menú móvil, footer, data-view-mobile |

### Fase 5: Validar rutas dinámicas (Día 7)

| Tarea | DESCRIPCIÓN                                                             |
| ----- | ----------------------------------------------------------------------- |
| 5.1   | Mapear todas las rutas que vienen de BD (notificaciones, sidebar, menú) |
| 5.2   | Agregar todas las rutas canónicas a `route-whitelist.ts`                |
| 5.3   | Agregar validación en sidebar y notificaciones                          |

### Fase 6: Eliminar `routerLink` relativo (Día 8)

| Tarea | Ocurrencias                                                                             |
| ----- | --------------------------------------------------------------------------------------- |
| 6.1   | Migrar `routerLink="../detail"` a `navigate(['../detail'], {relativeTo})` (3 templates) |
| 6.2   | Migrar `routerLink="../meeting-minutes-detail"` a `navigate()` (2 templates)            |

---

## 7. Resumen de Cambios

| Cambio                                            | Ocurrencias | Esfuerzo      |
| ------------------------------------------------- | ----------- | ------------- |
| `navigateByUrl()` → `navigate()` + `ROUTES.*`     | ~66         | 2-3 días      |
| Strings hardcodeados → `ROUTES.*`                 | ~102        | 2-3 días      |
| `[routerLink]` en eventos → `navigate()`          | ~20         | 1 día         |
| Rutas dinámicas → whitelist                       | ~30         | 1 día         |
| `routerLink` relativo → `navigate()` + relativeTo | ~5          | 0.5 día       |
| **Total**                                         | **~223**    | **~6-8 días** |

### Estado Post-Migración

| Patrón                             | Antes | Después         |
| ---------------------------------- | ----- | --------------- |
| `router.navigate()` con constantes | 0     | ~168            |
| `navigateByUrl()`                  | ~66   | 0               |
| `routerLink` en templates          | ~77   | ~57 (solo menú) |
| Strings hardcodeados               | ~259  | 0               |
| Rutas dinámicas sin validar        | ~30   | 0               |
