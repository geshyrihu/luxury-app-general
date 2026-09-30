# Angular: Application Initialization (app.config.ts)

**Última revisión:** 2026-08-06  
**Derivado de:** Exploración profunda codebase  
**Severidad:** 🔴 CRÍTICA — Patrón obligatorio para setup de app

---

## Propósito

Documentar la **configuración de aplicación Angular** en `app.config.ts`. Define providers, inicializadores, interceptores, librerías de terceros, y zoneless change detection.

---

## Regla de Oro

```
app.config.ts = Punto Central de Configuración

❌ NO: Configurar librerías en main.ts, crear bootstrapping manual, duplicar setup
✅ SÍ: Centralizar todos los providers en appConfig, usar APP_INITIALIZER para setup
```

---

## 1. Estructura Completa de app.config.ts

**Ubicación:** `appsweb/angular/src/app/app.config.ts`

```typescript
import { ApplicationConfig, LOCALE_ID, ErrorHandler } from '@angular/core';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptors, withFetch, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { provideEchartsCore } from 'ngx-echarts/core';
import { provideTranslateService } from '@ngx-translate/core';
import { provideServiceWorker } from '@angular/service-worker';
import { provideAppInitializer, provideAppInitializer } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from 'environments/environment';
import { APP_ROUTES } from './app.routes';
import { GlobalErrorHandler } from 'core/http/services/global-error-handler.service';
import { imageFormDataInterceptor, offlineInterceptorFn, jwtInterceptor } from 'core/http/interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    // ========== SECCIÓN 1: CHANGE DETECTION ==========
    provideZonelessChangeDetection(), // Angular 19: Sin NgZone
    
    // ========== SECCIÓN 2: ROUTING ==========
    provideRouter(
      APP_ROUTES,
      withPreloading(PreloadAllModules) // Precargar lazy modules
    ),
    
    // ========== SECCIÓN 3: HTTP CLIENT ==========
    provideHttpClient(
      withInterceptors([
        imageFormDataInterceptor,  // Procesa imágenes (HEIC → JPG)
        offlineInterceptorFn,      // Cachea si offline
        jwtInterceptor,            // Token + refresh sincronizado
      ]),
      withFetch() // Usar Fetch API en lugar de XHR
    ),
    
    // HttpClient sin interceptores (para casos especiales)
    {
      provide: 'HttpClientWithoutInterceptors',
      useFactory: (backend: HttpBackend) => new HttpClient(backend),
      deps: [HttpBackend],
    },
    
    // ========== SECCIÓN 4: INICIALIZADORES ==========
    provideAppInitializer(initializeAppState),
    provideAppInitializer(preloadIconifyIcons()),
    
    // ========== SECCIÓN 5: ANIMATIONS ==========
    provideAnimations(),
    
    // ========== SECCIÓN 6: UI LIBRARIES ==========
    // Toastr (notificaciones)
    provideToastr({
      timeOut: 4000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: true,
    }),
    // ECharts (gráficos)
    provideEchartsCore({
      echarts: () => import('echarts'),
    }),
    
    // ========== SECCIÓN 7: I18N ==========
    provideTranslateService({
      defaultLanguage: 'es',
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) =>
          new TranslateHttpLoader(
            http,
            './assets/i18n/',
            '.json'
          ),
        deps: [HttpClient],
      },
    }),
    
    // ========== SECCIÓN 8: LOCALIZATION ==========
    { provide: LOCALE_ID, useValue: 'es-MX' },
    
    // ========== SECCIÓN 9: FIREBASE ==========
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    
    // ========== SECCIÓN 10: PWA (Service Worker) ==========
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000', // Registrar después 30s
    }),
    
    // ========== SECCIÓN 11: ERROR HANDLING ==========
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
};

// ========== INICIALIZADORES ==========

/**
 * Inicializar estado de aplicación (auth, usuario, permisos, etc.)
 * Se ejecuta ANTES de cargar la ruta inicial
 */
function initializeAppState(): () => Promise<void> {
  return () => {
    const authService = inject(AuthService);
    const storageService = inject(StorageService);
    
    // PASO 1: Recuperar token del localStorage
    const token = storageService.getItem<string>('auth_token', 'local');
    
    // PASO 2: Validar token (no expirado)
    if (token && isTokenValid(token)) {
      authService.setToken(token);
      return Promise.resolve();
    }
    
    // PASO 3: Intentar refresh token si existe
    const refreshToken = storageService.getItem<string>('refresh_token', 'local');
    if (refreshToken) {
      return authService.refreshToken().toPromise()
        .then(() => {})
        .catch(() => {
          // Refresh falló, usuario debe reloguear
          authService.logout();
        });
    }
    
    // Sin token válido → usuario no autenticado
    return Promise.resolve();
  };
}

/**
 * Precargar iconos Iconify en memoria
 * Evita lag cuando se usan iconos la primera vez
 */
function preloadIconifyIcons(): () => Promise<void> {
  return () => {
    // Importar bundle de iconos más comunes
    return IconifyIcon.loadCollection('@mdi/js'); // MaterialDesignIcons
  };
}

// ========== CONFIGURACIÓN DE PRIMENG ==========

/**
 * Crear configuración de PrimeNG
 * Define tema, traducciones, y comportamientos globales
 */
function createPrimeNgConfig(): PrimeNGConfig {
  return {
    ripple: true, // Efecto ripple en botones
    zIndex: {
      modal: 1100,
      overlay: 1000,
      max: 2000,
    },
    csp: {
      nonce: getNonceValue(), // CSP nonce para seguridad
    },
  };
}

// ========== BOOTSTRAPPING ==========

/**
 * Punto de entrada (main.ts)
 * No cambia - simplemente usa appConfig
 */
// main.ts:
// bootstrapApplication(AppComponent, appConfig)
//   .catch(err => console.error(err));
```

---

## 2. main.ts (Punto de Entrada)

**Ubicación:** `appsweb/angular/src/main.ts`

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error('[Bootstrap Error]', err));
```

**Nota:** Código mínimo - toda la configuración está en `appConfig`.

---

## 3. Secciones Clave

### Sección 1: Change Detection (Zoneless)

```typescript
// Angular 19: Zoneless change detection
provideZonelessChangeDetection()

// Beneficios:
// ✅ Menos overhead de NgZone
// ✅ Performance mejorado
// ✅ Debugging más fácil
// ❌ Requiere OnPush + signals (no ChangeDetectionDefault)
```

### Sección 2: Routing con Preloading

```typescript
provideRouter(
  APP_ROUTES,
  withPreloading(PreloadAllModules) // Precargar todas las módulos lazy
)

// Alternativa: Estrategia personalizada
export class SelectivePreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    return route.data?.['preload'] ? load() : of(null);
  }
}

withPreloading(SelectivePreloadingStrategy)
```

### Sección 3: HTTP Client con Interceptores

```typescript
provideHttpClient(
  withInterceptors([
    imageFormDataInterceptor,  // PRIMERO: procesa imágenes
    offlineInterceptorFn,      // SEGUNDO: maneja offline
    jwtInterceptor,            // TERCERO: autentica
  ]),
  withFetch() // Usa Fetch API (mejor que XHR)
)

// Orden IMPORTA: Los interceptores se ejecutan en orden de definición
```

### Sección 4: APP_INITIALIZER (Setup Pre-Route)

```typescript
provideAppInitializer(initializeAppState),
provideAppInitializer(preloadIconifyIcons()),

// Cada inicializador:
// 1. Se ejecuta en orden
// 2. ANTES de cargar la ruta inicial
// 3. Puede hacer setup asincrónico
// 4. Si falla, toda la app falla (usar try/catch)
```

### Sección 5: Traducción (i18n)

```typescript
provideTranslateService({
  defaultLanguage: 'es',
  loader: provideTranslateHttpLoader({
    prefix: './assets/i18n/',
    suffix: '.json',
  }),
})

// Archivos esperados:
// assets/i18n/es.json
// assets/i18n/en.json
// assets/i18n/pt.json
```

### Sección 6: Firebase (Firestore + Auth)

```typescript
provideFirebaseApp(() => initializeApp(environment.firebase)),
provideAuth(() => getAuth()),
provideFirestore(() => getFirestore()),

// Nota: Se inicializa en providers (no lazy)
// Si no se usa en la app, comentar para ahorrar bundle
```

### Sección 7: PWA (Service Worker)

```typescript
provideServiceWorker('ngsw-worker.js', {
  enabled: !isDevMode(),
  registrationStrategy: 'registerWhenStable:30000',
})

// Registro diferido: Espera 30s después de stable
// Beneficio: No ralentiza inicio de app
```

### Sección 8: Error Handling Global

```typescript
{ provide: ErrorHandler, useClass: GlobalErrorHandler }

// Captura TODOS los errores uncaught
// Centraliza logging y mostrado a usuario
```

---

## 4. Verificaciones de Auditoría

### Checklist de app.config.ts

- [ ] ¿provideZonelessChangeDetection() presente?
- [ ] ¿provideRouter() con APP_ROUTES?
- [ ] ¿provideHttpClient() con withInterceptors?
- [ ] ¿Orden correcto de interceptores?
- [ ] ¿APP_INITIALIZER para setup?
- [ ] ¿LOCALE_ID = 'es-MX'?
- [ ] ¿Firebase solo si se usa?
- [ ] ¿ErrorHandler registrado?
- [ ] ¿Todas las librerías necesarias?
- [ ] ¿Sin providers duplicados?

### Comandos de Validación

```bash
# Validar que appConfig se usa en main.ts
grep -r "appConfig" appsweb/angular/src/main.ts

# Contar providers en appConfig
grep -c "provide" appsweb/angular/src/app/app.config.ts

# Buscar si hay config en otros lugares
grep -r "provideHttpClient\|provideRouter" appsweb/angular/src/app --include="*.ts" | \
  grep -v "app.config.ts"

# Validar interceptores en orden
grep -A 5 "withInterceptors" appsweb/angular/src/app/app.config.ts
```

---

## 5. Anti-patrones

| ❌ Incorrecto | ✅ Correcto | Razón |
|---|---|---|
| Configurar en main.ts | Usar appConfig | Centralización |
| Duplicar providers | Un único appConfig | No redundancia |
| Sin APP_INITIALIZER | Usar para setup | Setup before routing |
| Interceptores en orden incorrecto | image→offline→jwt | Ejecución garantizada |
| ChangeDetectionDefault + Zoneless | OnPush + Zoneless | Incompatible |
| Firebase en app si no se usa | Comentar providers | Reduce bundle |
| Sin ErrorHandler | Registrar GlobalErrorHandler | Errores uncaught no se capturan |

---

## 6. Bundle Size Impact

```
Tamaño por librería (aproximado):
- ng-bootstrap: ~??KB
- ECharts: ~1.2MB
- Firebase: ~300KB
- ngx-translate: ~50KB
- Ionic (si incluida): ~1.5MB

Recomendación: Comentar librerías no usadas en tu features actuales
```

---

## 7. Referencias y Documentos Relacionados

- [CONVENTIONS.md §4 — Frontend Rules](../CONVENTIONS.md#4-frontend-rules)
- [angular-services-catalog.md](./angular-services-catalog.md) — Servicios inyectados
- [angular-http-interceptors.md](./angular-http-interceptors.md) — Interceptores en detalle
- [angular-error-handling-pattern.md](./angular-error-handling-pattern.md) — GlobalErrorHandler
- Angular Docs: [ApplicationConfig](https://angular.io/api/core/ApplicationConfig)

---

**Última actualización:** 2026-08-06  
**Vigencia:** Angular 17+ (zoneless, ApplicationConfig)  
**Aplicable a:** Toda la aplicación



