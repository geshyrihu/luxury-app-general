# Angular: HTTP Interceptors (JWT, Offline, Image Handling)

**Última revisión:** 2026-08-06  
**Derivado de:** Exploración profunda codebase  
**Severidad:** 🔴 CRÍTICA — Patrones obligatorios en HTTP layer

---

## Propósito

Documentar los **3 interceptores funcionales** en Angular que manejan: autenticación JWT, modo offline, y transformación de imágenes. Define cómo funcionan, cuándo se ejecutan, y cómo agregar nuevos.

---

## Regla de Oro

```
Interceptores en app.config.ts = Únicos en el sistema

❌ NO: Crear interceptores adicionales sin documentar, duplicar lógica de JWT
✅ SÍ: Usar interceptores existentes, agregar solo si transversal y documentado
```

---

## 1. JWT Interceptor (Autenticación + Token Refresh)

**Ubicación:** `appsweb/angular/src/app/core/http/interceptors/jwt.interceptor.fn.ts`

**Tipo:** `HttpInterceptorFn` (funcional, no clase)

### Responsabilidades

1. **Inyectar Bearer Token** en todas las peticiones
2. **Renovar token automáticamente** si expira (401)
3. **Sincronizar múltiples requests** pendientes durante refresh
4. **Manejar errores de autenticación**

### Patrón: Token Refresh Sincronizado

**Problema:** Si N requests fallan con 401 simultáneamente:
- ❌ Cada request hace refresh (N refreshes)
- ✅ Primer request hace refresh, otros esperan nuevo token (1 refresh)

**Solución:**

```typescript
// State compartido (Singleton, sin inyección)
let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // PASO 1: Inyectar token en headers
  if (authService.userToken()) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authService.userToken()}`
      }
    });
  }
  
  // PASO 2: Manejar respuesta
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Solo manejar 401 (token expirado)
      if (error.status === 401 && !req.url.includes('/login')) {
        if (!isRefreshing) {
          // PASO 3a: Primer request hace refresh
          isRefreshing = true;
          
          return authService.refreshToken().pipe(
            switchMap((newSession: SessionDto) => {
              isRefreshing = false;
              refreshTokenSubject.next(newSession.token);
              
              // Re-intentar request original con nuevo token
              return next(addTokenToRequest(req, newSession.token));
            }),
            finalize(() => { isRefreshing = false; }),
            catchError((refreshError) => {
              // Refresh también falló → logout
              authService.logout();
              router.navigate(['/login']);
              return throwError(() => refreshError);
            })
          );
        } else {
          // PASO 3b: Otros requests esperan nuevo token
          return refreshTokenSubject.pipe(
            filter(token => token != null),
            take(1),
            switchMap((jwt) => next(addTokenToRequest(req, jwt!)))
          );
        }
      }
      
      return throwError(() => error);
    })
  );
};

function addTokenToRequest(req: HttpRequest<any>, token: string): HttpRequest<any> {
  return req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });
}
```

### Flujo Paso a Paso

```
Scenario: 3 requests simultáneos (GET, POST, DELETE)
         Todos fallan con 401 (token expirado)

T=0ms:  GET /api/data
        ├─ interceptor: inject token ✓
        └─ response: 401 → enter catchError
            ├─ isRefreshing = false
            └─ call refreshToken() ✓
            └─ isRefreshing = true

T=0ms:  POST /api/items (simultáneo)
        ├─ interceptor: inject token ✓
        └─ response: 401 → enter catchError
            ├─ isRefreshing = true (otro request en proceso)
            └─ wait for refreshTokenSubject.next() ✓

T=0ms:  DELETE /api/items/1 (simultáneo)
        ├─ interceptor: inject token ✓
        └─ response: 401 → enter catchError
            ├─ isRefreshing = true (otro request en proceso)
            └─ wait for refreshTokenSubject.next() ✓

T=250ms: refreshToken() completa con nuevo token
         ├─ isRefreshing = false
         ├─ refreshTokenSubject.next(newToken) → despierta GET, POST, DELETE
         ├─ GET: retry con nuevo token ✓
         ├─ POST: retry con nuevo token ✓
         └─ DELETE: retry con nuevo token ✓

Result: 1 refresh call, 3 retries sincronizadas
```

### Configuración en app.config.ts

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([
        imageFormDataInterceptor,  // Procesa imágenes
        offlineInterceptorFn,       // Cachea si no hay conexión
        jwtInterceptor,              // 🔴 JWT + refresh + sync
      ]),
      withFetch(),
    ),
  ],
};
```

---

## 2. Offline Interceptor (Cacheo en Modo Offline)

**Ubicación:** `appsweb/angular/src/app/core/http/interceptors/offline.interceptor.fn.ts`

**Tipo:** `HttpInterceptorFn` (funcional)

### Responsabilidades

1. **Detectar desconexión** (sin internet)
2. **Cachear peticiones GET** en memoria
3. **Responder con caché** cuando offline
4. **Sincronizar cuando vuelve conexión**

### Implementación

```typescript
export const offlineInterceptorFn: HttpInterceptorFn = (req, next) => {
  const connectivityService = inject(ConnectivityService);
  
  // Solo cachear GET (safe requests)
  if (req.method !== 'GET') {
    return next(req);
  }
  
  // Si no hay conexión
  if (!connectivityService.isOnline()) {
    // Intentar responder desde caché
    const cached = getCachedResponse(req.url);
    if (cached) {
      console.log('[OFFLINE] Returning cached response:', req.url);
      return of(cached);
    }
  }
  
  // Si hay conexión, hacer request normal y cachear
  return next(req).pipe(
    tap((response: HttpResponse<any>) => {
      if (response.status === 200) {
        cacheResponse(req.url, response);
      }
    }),
    catchError((error: HttpErrorResponse) => {
      // Si error de conexión, intentar caché
      if (error.status === 0 || !connectivityService.isOnline()) {
        const cached = getCachedResponse(req.url);
        if (cached) {
          console.log('[OFFLINE FALLBACK] Using cache:', req.url);
          return of(cached);
        }
      }
      return throwError(() => error);
    })
  );
};

// Cache en memoria
const responseCache = new Map<string, HttpResponse<any>>();

function cacheResponse(url: string, response: HttpResponse<any>): void {
  responseCache.set(url, response.clone());
}

function getCachedResponse(url: string): HttpResponse<any> | undefined {
  return responseCache.get(url);
}
```

### Patrón en ConnectivityService

```typescript
@Injectable({ providedIn: 'root' })
export class ConnectivityService {
  readonly isOnline = signal(navigator.onLine);
  
  constructor() {
    fromEvent(window, 'online').subscribe(() => this.isOnline.set(true));
    fromEvent(window, 'offline').subscribe(() => this.isOnline.set(false));
  }
}
```

---

## 3. Image FormData Interceptor (Transformación de Imágenes)

**Ubicación:** `appsweb/angular/src/app/core/http/interceptors/image-form-data.interceptor.fn.ts`

**Tipo:** `HttpInterceptorFn` (funcional)

### Responsabilidades

1. **Procesar imágenes en FormData** (HEIC → JPG)
2. **Validar tamaño** de archivo
3. **Comprimir** si es necesario
4. **Convertir HEIC/HEIF** (iPhone) a JPG

### Implementación Simplificada

```typescript
export const imageFormDataInterceptor: HttpInterceptorFn = (req, next) => {
  const imageProcessing = inject(ImageProcessingService);
  
  // Solo procesar FormData
  if (!(req.body instanceof FormData)) {
    return next(req);
  }
  
  // Extraer archivos de imagen del FormData
  const formData = req.body as FormData;
  const imageFiles: File[] = [];
  
  formData.forEach((value, key) => {
    if (value instanceof File && value.type.startsWith('image/')) {
      imageFiles.push(value);
    }
  });
  
  // Si hay imágenes, procesarlas
  if (imageFiles.length === 0) {
    return next(req);
  }
  
  // Procesar en paralelo
  return forkJoin(
    imageFiles.map(file => imageProcessing.processImage(file))
  ).pipe(
    switchMap((processedFiles) => {
      // Crear nuevo FormData con archivos procesados
      const newFormData = new FormData();
      
      let imageIndex = 0;
      formData.forEach((value, key) => {
        if (value instanceof File && value.type.startsWith('image/')) {
          newFormData.append(key, processedFiles[imageIndex]);
          imageIndex++;
        } else {
          newFormData.append(key, value);
        }
      });
      
      // Hacer request con FormData procesado
      return next(req.clone({ body: newFormData }));
    })
  );
};
```

### ImageProcessingService

```typescript
@Injectable({ providedIn: 'root' })
export class ImageProcessingService {
  async processImage(file: File): Promise<File> {
    // PASO 1: Detectar formato
    if (file.type === 'image/heic' || file.type === 'image/heif') {
      // PASO 2: Convertir HEIC → JPG usando heic-to
      return await this.convertHeicToJpg(file);
    }
    
    // PASO 3: Validar tamaño (máx 10MB)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('Image too large');
    }
    
    // PASO 4: Comprimir si es JPG/PNG
    if (['image/jpeg', 'image/png'].includes(file.type)) {
      return await this.compressImage(file);
    }
    
    return file;
  }
  
  private async convertHeicToJpg(file: File): Promise<File> {
    // Usar librería heic-to
    const jpgBlob = await heic2any({ blob: file });
    return new File([jpgBlob], file.name.replace('.heic', '.jpg'), {
      type: 'image/jpeg'
    });
  }
  
  private async compressImage(file: File): Promise<File> {
    // Usar canvas + image processing
    // ... implementación de compresión
  }
}
```

---

## 4. Verificaciones de Auditoría

### Checklist de Interceptores

- [ ] ¿JWT interceptor inyecta token en headers?
- [ ] ¿JWT interceptor sincroniza token refresh?
- [ ] ¿Offline interceptor cachea GET?
- [ ] ¿Image interceptor procesa FormData?
- [ ] ¿Orden de interceptores es correcto en app.config.ts?
- [ ] ¿Sin interceptores adicionales sin documentar?
- [ ] ¿Error handling en todos los interceptores?
- [ ] ¿No hay lógica de negocio en interceptores (solo cross-cutting)?

### Comandos de Validación

```bash
# Validar que solo hay 3 interceptores
grep -r "withInterceptors" appsweb/angular/src/app --include="*.ts" | \
  head -1 | grep -o "Interceptor" | wc -l

# Buscar si se crean interceptores nuevos
find appsweb/angular/src/app -name "*interceptor*.ts" -type f | \
  grep -v "core/http/interceptors"

# Validar orden en app.config
grep -A 10 "withInterceptors" appsweb/angular/src/app/app.config.ts
```

---

## 5. Anti-patrones

| ❌ Incorrecto | ✅ Correcto | Razón |
|---|---|---|
| Token refresh sin sincronizar | Usar refreshTokenSubject + filter | Evita N refreshes |
| Crear HttpInterceptor clase | Usar HttpInterceptorFn funcional | Angular 15+ sintaxis |
| Lógica de negocio en interceptor | Solo cross-cutting concerns | Separación de responsabilidades |
| Sin manejo de 401 | CatchError + logout | Experiencia de usuario |
| FormData directo al API | Procesar en interceptor | Centralización |
| Sin detección de offline | Usar ConnectivityService | UX mejorada |

---

## 6. Referencias y Documentos Relacionados

- [CONVENTIONS.md §4 — Frontend Rules](../CONVENTIONS.md#4-frontend-rules)
- [angular-services-catalog.md](./angular-services-catalog.md) — AuthService, ConnectivityService
- [angular-error-handling-pattern.md](./angular-error-handling-pattern.md) — Error handling
- Angular Docs: [HTTP Interceptors](https://angular.io/guide/http#intercepting-requests-and-responses)

---

**Última actualización:** 2026-08-06  
**Vigencia:** Angular 15+ (HttpInterceptorFn funcional)  
**Aplicable a:** Todos los requests HTTP en el proyecto
