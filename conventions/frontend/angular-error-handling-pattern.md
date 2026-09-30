# Angular: Error Handling Pattern (Global + Local)

**Última revisión:** 2026-08-06  
**Derivado de:** Exploración profunda codebase  
**Severidad:** 🔴 CRÍTICA — Patrón obligatorio para manejo de errores

---

## Propósito

Documentar el patrón de **manejo de errores global + local** en Angular. Define GlobalErrorHandler, GlobalErrorService, error logging, y manejo en componentes.

---

## Regla de Oro

```
Errores = Captura Global + Logging + User Feedback

❌ NO: console.error() directo, ignorar errores, mostrar detalles técnicos al usuario
✅ SÍ: GlobalErrorHandler → GlobalErrorService → CustomToastService (usuario)
```

---

## 1. GlobalErrorHandler (Nivel Plataforma)

**Ubicación:** `appsweb/angular/src/app/core/http/services/global-error-handler.service.ts`

**Tipo:** `ErrorHandler` (Angular error boundary)

**Responsabilidad:** Capturar TODOS los errores (componentes, servicios, async, etc.)

### Implementación

```typescript
import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler extends ErrorHandler {
  private errorService = inject(GlobalErrorService);
  private clientErrorLogger = inject(ClientErrorLoggerService);
  private logger = inject(ConsoleLoggerService);
  
  override handleError(error: unknown): void {
    // PASO 1: Normalizar error
    const normalizedError = this.normalizeError(error);
    
    // PASO 2: Registrar en servicio global
    this.errorService.captureError(normalizedError);
    
    // PASO 3: Loguear (desarrollo)
    this.logger.logError('GlobalErrorHandler', normalizedError);
    
    // PASO 4: Enviar a servidor (producción)
    if (!this.isDevelopment()) {
      this.clientErrorLogger.logError(normalizedError);
    }
    
    // PASO 5: Mostrar al usuario (toast)
    this.showUserFriendlyMessage(normalizedError);
  }
  
  private normalizeError(error: unknown): AppError {
    if (error instanceof Error) {
      return {
        type: 'error',
        message: error.message,
        stack: error.stack,
        timestamp: new Date(),
        context: this.extractContext(),
      };
    }
    
    if (typeof error === 'string') {
      return {
        type: 'error',
        message: error,
        timestamp: new Date(),
      };
    }
    
    return {
      type: 'error',
      message: 'Unknown error',
      details: JSON.stringify(error),
      timestamp: new Date(),
    };
  }
  
  private extractContext(): string {
    // Extraer información de contexto (componente, ruta, usuario)
    const router = inject(Router);
    const auth = inject(AuthService);
    
    return `Route: ${router.url}, User: ${auth.currentUser()?.email}`;
  }
  
  private showUserFriendlyMessage(error: AppError): void {
    const toast = inject(CustomToastService);
    
    // No mostrar stack traces al usuario
    const message = this.getUserMessage(error);
    toast.showError(message);
  }
  
  private getUserMessage(error: AppError): string {
    // Mapear errores técnicos a mensajes amigables
    if (error.message.includes('404')) {
      return 'Recurso no encontrado';
    }
    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      return 'Sesión expirada. Por favor inicia sesión nuevamente';
    }
    if (error.message.includes('500')) {
      return 'Error del servidor. Por favor intenta más tarde';
    }
    
    // Mensaje genérico
    return 'Ha ocurrido un error. Por favor intenta nuevamente';
  }
  
  private isDevelopment(): boolean {
    return !environment.production;
  }
}

// Registro en app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
};

interface AppError {
  type: 'error' | 'warning' | 'info';
  message: string;
  stack?: string;
  details?: string;
  timestamp: Date;
  context?: string;
}
```

---

## 2. GlobalErrorService (Almacenamiento)

**Ubicación:** `appsweb/angular/src/app/core/http/services/global-error.service.ts`

**Responsabilidad:** Almacenar historial de errores en signals

### Implementación

```typescript
@Injectable({ providedIn: 'root' })
export class GlobalErrorService {
  readonly lastError = signal<AppError | null>(null);
  readonly errors = signal<AppError[]>([]);
  
  private readonly maxErrors = 50; // Limit de historial
  
  captureError(error: AppError): void {
    // Actualizar último error
    this.lastError.set(error);
    
    // Agregar al historial
    this.errors.update((list) => {
      const newList = [error, ...list];
      
      // Limitar tamaño del historial
      return newList.length > this.maxErrors
        ? newList.slice(0, this.maxErrors)
        : newList;
    });
  }
  
  clearErrors(): void {
    this.errors.set([]);
    this.lastError.set(null);
  }
  
  // Obtener errores de tipo específico
  getErrorsByType(type: 'error' | 'warning' | 'info'): AppError[] {
    return this.errors().filter(e => e.type === type);
  }
  
  // Obtener último error de tipo
  getLastErrorOfType(type: 'error' | 'warning' | 'info'): AppError | null {
    return this.errors().find(e => e.type === type) ?? null;
  }
}
```

---

## 3. ClientErrorLoggerService (Logging a Servidor)

**Ubicación:** `appsweb/angular/src/app/core/services/client-error-logger.service.ts`

**Responsabilidad:** Enviar errores a servidor para análisis

### Implementación

```typescript
@Injectable({ providedIn: 'root' })
export class ClientErrorLoggerService {
  private api = inject(ApiResponseService);
  private auth = inject(AuthService);
  
  logError(error: AppError): void {
    const payload: ClientErrorDto = {
      message: error.message,
      stack: error.stack,
      timestamp: error.timestamp,
      url: window.location.href,
      userAgent: navigator.userAgent,
      userId: this.auth.currentUser()?.id,
      context: error.context,
    };
    
    // Enviar sin bloquear la aplicación
    this.api.onPost('api/errors/log', payload).subscribe({
      next: () => console.log('Error logged to server'),
      error: (err) => console.error('Failed to log error:', err), // No loopear
    });
  }
}

interface ClientErrorDto {
  message: string;
  stack?: string;
  timestamp: Date;
  url: string;
  userAgent: string;
  userId?: string;
  context?: string;
}
```

---

## 4. Error Handling en Componentes/Servicios

### Patrón A: Try/Catch con Signals

```typescript
@Component({
  selector: 'app-edit-item',
  standalone: true,
})
export class EditItemComponent {
  private api = inject(ApiResponseService);
  private toast = inject(CustomToastService);
  
  isSubmitting = signal(false);
  submitError = signal<string>('');
  
  async saveItem(data: ItemDto): Promise<void> {
    this.isSubmitting.set(true);
    this.submitError.set(''); // Limpiar error anterior
    
    try {
      await this.api.onPost<ItemDto>('api/items', data).toPromise();
      this.toast.showSuccess('Item guardado');
    } catch (error) {
      const message = this.extractErrorMessage(error);
      this.submitError.set(message);
      this.toast.showError(message);
    } finally {
      this.isSubmitting.set(false);
    }
  }
  
  private extractErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      // Errores HTTP con mensaje del backend
      return error.error?.message || `Error ${error.status}`;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return 'Error desconocido';
  }
}
```

### Patrón B: RxJS catchError

```typescript
loadItems(): void {
  this.api.onGetList<ItemDto>('api/items').pipe(
    catchError((error) => {
      console.error('Failed to load items:', error);
      this.toast.showError('No se pudieron cargar los items');
      
      // Retornar valor por defecto para que la cadena continúe
      return of([]);
    })
  ).subscribe(items => {
    this.items.set(items);
  });
}
```

### Patrón C: Validación de Formulario

```typescript
// ApiResponseService.validateForm() centraliza validación
if (!this.api.validateForm(this.form)) {
  // validateForm() muestra errores en toast
  return false;
}

// Si forma es válida, proceder
await this.api.onPost('api/items', this.form.value).toPromise();
```

---

## 5. Jerarquía de Errores

```
┌─────────────────────────────────────────┐
│  Error en Componente/Servicio/Async    │
└──────────────────┬──────────────────────┘
                   │
         (uncaught) ↓
┌─────────────────────────────────────────┐
│    GlobalErrorHandler.handleError()     │
│  1. Normalizar error                    │
│  2. GlobalErrorService.captureError()   │
│  3. ConsoleLoggerService.logError()     │
│  4. ClientErrorLoggerService.logError() │
│  5. CustomToastService.showError()      │
└─────────────────────────────────────────┘
                   │
                   ↓
         ┌─────────────────────┐
         │ User sees friendly  │
         │ error message       │
         │ (no technical info) │
         └─────────────────────┘
```

---

## 6. Verificaciones de Auditoría

### Checklist de Error Handling

- [ ] ¿GlobalErrorHandler registrado en app.config.ts?
- [ ] ¿Servicios HTTP usan try/catch o catchError?
- [ ] ¿Formularios validan antes de submit?
- [ ] ¿Errores no exponen información técnica al usuario?
- [ ] ¿Componentes muestran submitError signal?
- [ ] ¿Sin console.error() directo (usar logger)?
- [ ] ¿Sin ignorar excepciones silenciosamente?
- [ ] ¿Errores 401 disparan logout?

### Comandos de Validación

```bash
# Validar GlobalErrorHandler registrado
grep -r "ErrorHandler" appsweb/angular/src/app/app.config.ts

# Buscar console.error sin loguear
grep -r "console.error" appsweb/angular/src/app/modules --include="*.ts" | \
  grep -v "logger\|errorService"

# Validar try/catch en async operations
grep -r "try.*catch" appsweb/angular/src/app --include="*.ts" | wc -l

# Buscar catchError en RxJS
grep -r "catchError" appsweb/angular/src/app --include="*.ts" | wc -l
```

---

## 7. Anti-patrones

| ❌ Incorrecto | ✅ Correcto | Razón |
|---|---|---|
| `console.error()` directo | Usar logger + ErrorService | Centralización, rastreo |
| Ignorar errores con `.catch()` vacío | `catchError` con manejo | Debugging más fácil |
| Mostrar stack trace al usuario | Usuario-friendly message | UX mejorada |
| Sin validación de formulario | Usar `api.validateForm()` | Previene errores |
| Sin manejo de 401 | Logout + redirect a login | Sesión expirada manejada |
| Error sin retry | Implementar retry con `retry()` | Mayor confiabilidad |

---

## 8. Referencias y Documentos Relacionados

- [CONVENTIONS.md §4 — Frontend Rules](../CONVENTIONS.md#4-frontend-rules)
- [angular-services-catalog.md](./angular-services-catalog.md) — GlobalErrorService
- [angular-http-interceptors.md](./angular-http-interceptors.md) — JWT 401 handling
- Angular Docs: [Error Handling](https://angular.io/guide/errors)

---

**Última actualización:** 2026-08-06  
**Vigencia:** Angular 22  
**Aplicable a:** Todos los componentes y servicios

