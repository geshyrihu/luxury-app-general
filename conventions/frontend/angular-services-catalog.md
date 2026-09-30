# Angular: Services Catalog (70+ Shared Services)

**Última revisión:** 2026-08-06  
**Derivado de:** Exploración profunda codebase  
**Severidad:** 🔴 CRÍTICA — Patrón obligatorio antes de crear servicios propios

---

## Propósito

Documentar el catálogo completo de **70+ servicios compartidos** en el proyecto. Define qué servicios existen, para qué sirven, cómo inyectarlos, y cuándo crearlos vs. reutilizarlos.

---

## Regla de Oro

```
Servicios Compartidos = Single Source of Truth

❌ NO: Crear servicio local en feature si ya existe servicio compartido
✅ SÍ: Inyectar servicio existente de core/services
```

---

## 1. Servicios Centrales (core/services)

### API & HTTP

**ApiResponseService** (Ubicación: `core/http/services/`)
- Propósito: Procesamiento normalizado de respuestas API
- Métodos principales:
  - `onGetList<T>(url, params): Observable<T[]>`
  - `onGetPaged<T>(url, params): Observable<PagedResultDto<T>>`
  - `onPost<T>(url, data): Observable<T>`
  - `onPut<T>(url, data): Observable<T>`
  - `onPatch<T>(url, data): Observable<T>`
  - `onDelete<T>(url): Observable<T>`
  - `validateForm(form): boolean` — Valida y muestra errores
- Responsabilidad: Centraliza lógica de error handling, transformación de DTOs

```typescript
// Uso
private api = inject(ApiResponseService);

async loadData(): Promise<void> {
  const data = await this.api.onGetList<CobranzaDto>(
    'api/cobranza',
    { page: 1, recordsNumber: 10 }
  ).toPromise();
}
```

**DataConnectorService** (Base para HTTP)
- Propósito: Conector HTTP base (anterior a ApiResponseService, posiblemente deprecated)
- Status: Verificar si aún se usa

---

### Estado y Paginación

**PaginationStore<T>** (Ubicación: `core/services/pagination-store.ts`)
- Propósito: Paginación servidor genérica con signals
- Interface: Genérico `PaginationStore<T>`
- Métodos:
  - `configure(url, options): this` — Configurar URL y parámetros
  - `async load(request: PaginationRequest): Promise<void>` — Cargar página
  - `onLazyLoad(event: TableLazyLoadEvent): void` — Hook de p-table
  - `setFilter(filter: string): void` — Cambiar filtro
  - `setSort(field, order): void` — Cambiar orden
- Signals:
  - `data` — Items de la página actual
  - `totalRecords` — Total de registros
  - `loading` — Estado de carga
  - `request` — Parámetros actuales

```typescript
// Uso en componente
@Component({ providers: [PaginationStore] })
export class ListComponent {
  store = inject(PaginationStore<ItemDto>);
  
  ngOnInit() {
    this.store.configure('api/items', { recordsNumber: 20 });
  }
  
  onLazyLoad(event: TableLazyLoadEvent) {
    this.store.onLazyLoad(event);
  }
}

// Template
<p-table [value]="store.data()" [loading]="store.loading()"
  (onLazyLoad)="onLazyLoad($event)"></p-table>
```

**CobranzaOnlineStoreService** (Feature-specific, patrón reutilizable)
- Propósito: Estado centralizado para feature Cobranza Online
- Signals:
  - `dashboardData`, `analysisData`, `syncStatus`
  - `isLoading`, `isSyncing`, `isSilentSyncing`
- Methods:
  - `loadDashboard()`
  - `loadLocalData()` — Rehidratación desde localStorage
  - `clearStore()` — Limpiar caché

**Lección:** Patrón reutilizable para features complejas

---

### Logging

**ConsoleLoggerService** (Ubicación: `core/services/console-logger.service.ts`)
- Propósito: Logging con estilos CSS y emojis (solo en desarrollo)
- Métodos:
  - `logGetList(url, params)`
  - `logPost(url, data)`
  - `logSuccess(operation, data)`
  - `logError(operation, error)`
  - `logTrace(message, data)`
- Output: Logs estilizados en consola (ej: `%c[GET]` con colores)

```typescript
// Uso
private logger = inject(ConsoleLoggerService);
this.logger.logGetList('api/cobranza', params);
```

**ClientErrorLoggerService**
- Propósito: Registrar errores del cliente
- Tracking: De a dónde van los errores

---

### Notificaciones

**CustomToastService** (Ubicación: `core/services/custom-toast.service.ts`)
- Propósito: Mostrar notificaciones toast personalizadas
- Métodos:
  - `showSuccess(message: string)`
  - `showError(message: string)`
  - `showWarning(message: string)`
  - `showInfo(message: string)`
- Responsabilidad: Wrapper sobre `ngx-toastr`

```typescript
private toast = inject(CustomToastService);
this.toast.showSuccess('Guardado exitosamente');
```

**GlobalErrorService** (Ubicación: `core/http/services/global-error.service.ts`)
- Propósito: Capturar y almacenar errores globales
- Signals:
  - `lastError` — Último error capturado
  - `errors` — Historial de errores (max 50)
- Métodos:
  - `captureError(error: unknown): void`

---

### Diálogos y Modales

**DialogHandlerService** (Ubicación: `core/services/dialog-handler.service.ts`)
- Propósito: Abstracción web/mobile para diálogos
- Métodos:
  - `openDialog<T>(component, data, title, size): Promise<T>` — Auto-detecta web/mobile
  - `openMobileModal<T>(...)` — Inyecta ModalController (Ionic)
- Responsabilidad: Unificación de APIs web/mobile

```typescript
// Mismo código para web y mobile
const result = await this.dialogHandler.openDialog(
  EditComponent,
  { itemId: 123 },
  'Editar Item',
  'md'
);
```

---

### Almacenamiento

**StorageService** (Ubicación: `core/services/storage.service.ts`)
- Propósito: Acceso unificado a localStorage/sessionStorage
- Métodos:
  - `getItem<T>(key, storage): T | null`
  - `setItem(key, value, storage): void`
  - `removeItem(key, storage): void`
  - `clear(storage): void`
- Parámetro `storage`: 'local' | 'session'

---

### Autenticación

**AuthService** (Ubicación: `core/auth/services/auth.service.ts`)
- Propósito: Gestión de autenticación y sesión
- Signals:
  - `userToken` — Token JWT actual
  - `isAuthenticated` — Si usuario está autenticado
  - `currentUser` — Datos del usuario
- Métodos:
  - `login(credentials): Observable<SessionDto>`
  - `logout(): void`
  - `refreshToken(): Observable<SessionDto>` — Renovar JWT
  - `hasRole(role): boolean`
- Responsabilidad: Centraliza lógica de auth

```typescript
private auth = inject(AuthService);
const token = this.auth.userToken();
if (this.auth.isAuthenticated()) { ... }
```

---

### Enumeraciones y Catálogos

**EnumSelectService** (Ubicación: `core/services/enum-select.service.ts`)
- Propósito: Cargar enumeraciones desde API
- Métodos: 50+ métodos como:
  - `areaMinutasDetalles()`
  - `departament()`
  - `bloodType()`
  - `civilStatus()`
  - `tipoEmpleado()`
  - ... (uno por enum del backend)
- Responsabilidad: Centraliza catálogos de datos

```typescript
private enumService = inject(EnumSelectService);
const depts = await this.enumService.departament().toPromise();
```

**DateService**
- Propósito: Fuente única de parseo (lectura) y formateo (escritura) de fechas frente al API —
  preserva el día calendario correcto para campos `DateOnly` (`"yyyy-MM-dd"`) y respeta el instante
  UTC correcto para campos `DateTime`.
- **Lectura (API → UI):** `parseDate(value: any): Date | null`. No lo uses directamente en
  plantillas para mostrar fechas — usa el pipe `apiDate` (`shared/pipes/api-date.pipe.ts`), que ya
  lo envuelve junto con el `DatePipe` nativo.
- **Escritura (UI → API):** `getDateFormat(value: any): string` — convierte el `Date` de un
  `FormControl`/datepicker al día calendario local en `"yyyy-MM-dd"` antes de mandarlo al backend.
  **Obligatorio en todo `transformPayload`/`onSubmit` que envíe un campo de fecha capturado por el
  usuario.** Enviar el `Date` crudo del control (o `this.form.getRawValue()` sin pasar por este
  método) deja que `JSON.stringify` serialice vía `Date.prototype.toJSON()` (conversión UTC), el
  mismo riesgo de desfase de día que motivó `apiDate` en el sentido de lectura, ahora en escritura.
  Caso real: FH-2Xb corrigió 3 formularios que hacían exactamente esto (ver
   `docs/SharedLuxuryApp/FechasHoras/20260826-plan-shared-fechas-horas.md`, sección FH-2Xb).
  ```typescript
  transformPayload: () => ({
    ...this.form.getRawValue(),
    birth: this.dateS.getDateFormat(this.form.getRawValue().birth),
  }),
  ```

**ApiDatePipe (`apiDate`)**
- Propósito: Formatear fechas del API en plantillas sin el riesgo de desfase de día de `| date`
  directo. Envuelve `DateService.parseDate()` + `DatePipe` nativo.
- Uso: `{{ item.dueDate | apiDate }}` o `{{ item.dueDate | apiDate:'dd-MMM-yy' }}`.
- Obligatorio para cualquier campo de fecha proveniente del API — ver
  `frontend-prohibitions.md`.

**FormHelper**
- Propósito: Centralizar patrón de submit CRUD
- Método principal:
  - `submitCrud(options): Promise<any>` — POST/PUT/PATCH automático
- Responsabilidad: Reduce boilerplate en 140+ formularios

```typescript
// Antes: 20 líneas de código en cada formulario
// Ahora:
await FormHelper.submitCrud({
  form: this.form,
  api: this.api,
  endpoint: 'api/items',
  id: this.itemId,
  submitting: this.submitting,
});
```

---

### Búsqueda

**SearchService** (Ubicación: `core/services/search.service.ts`)
- Propósito: Búsqueda en menú hierárquico
- Métodos:
  - `searchTerm(term: string): void`
- Responsabilidad: Filtra items del menú

---

### Utilidades

**PlatformService**
- Propósito: Detectar plataforma (web/mobile/desktop)
- Métodos:
  - `isWeb(): boolean`
  - `isMobile(): boolean`
  - `isIos(): boolean`
  - `isAndroid(): boolean`

**CustomDocumentAppService** (Ubicación: específico de módulo)
- Propósito: Acceso a documentos con IFileReadPathService
- Patrón: Similar a backend `IFileReadPathService`

---

## 2. Servicios de Módulos (core/auth/services)

| Servicio | Propósito | Método Principal |
|----------|-----------|------------------|
| `JwtTokenService` | Decodificar y acceder claims del JWT | `getClaimsFromToken()` |
| `RoleService` | Verificar roles del usuario | `hasRole(role)` |
| `PermissionService` | Verificar permisos específicos | `canAccess(permission)` |

---

## 3. Servicios de Integración (Terceros)

### Firebase

**FirebaseService** (si existe)
- Propósito: Wrapper sobre Firebase SDK
- Responsabilidad: Centraliza llamadas a Firestore

### Iconos

**IconifyService**
- Propósito: Precargar iconos Iconify
- Método: `preloadIcons()` — APP_INITIALIZER

---

## 4. Servicios de HTTP Especializado (core/http/services)

| Servicio | Responsabilidad |
|----------|-----------------|
| `GlobalErrorHandler` | Captura errores globales, imprime a error service |
| `GlobalErrorService` | Almacena historial de errores |
| `ConnectivityService` | Detecta si está online/offline |

---

## 5. Patrón: Cuándo Crear vs. Reutilizar

### ✅ REUTILIZAR si existe servicio compartido

```typescript
// ✅ Correcto: Usar ApiResponseService existente
private api = inject(ApiResponseService);
const data = await this.api.onGetList('api/items').toPromise();

// ❌ Incorrecto: Crear LocalItemService que hace lo mismo
private http = inject(HttpClient); // Directo a HttpClient
const data = await this.http.get('api/items').toPromise();
```

### ✅ CREAR si es lógica específica del feature

```typescript
// ✅ Correcto: Feature-specific state (Cobranza)
@Injectable()
export class CobranzaOnlineStoreService {
  dashboardData = signal<DashboardDto | null>(null);
  // Lógica específica de Cobranza Online
}

// ✅ Correcto: Feature-specific form helper
@Injectable()
export class ItemFormHelper {
  // Métodos específicos para formulario de Items
}
```

### ❌ NO CREAR duplicados

```typescript
// ❌ Incorrecto: ToastService local en feature
// Ya existe CustomToastService en core/services

// ❌ Incorrecto: PaginationHelper en feature
// Ya existe PaginationStore en core/services

// ❌ Incorrecto: ErrorHandler en feature
// Ya existe GlobalErrorService en core
```

---

## 6. Verificaciones de Auditoría

### Checklist de Servicios

- [ ] ¿Usa servicios inyectados o instanciados directamente?
- [ ] ¿ApiResponseService para llamadas HTTP (no HttpClient directo)?
- [ ] ¿PaginationStore para paginación (no lógica manual)?
- [ ] ¿DialogHandlerService para diálogos (no DynamicDialog directo)?
- [ ] ¿CustomToastService para notificaciones (no ngx-toastr directo)?
- [ ] ¿StorageService para storage (no localStorage directo)?
- [ ] ¿AuthService para auth (no BehaviorSubject local)?
- [ ] ¿EnumSelectService para catálogos (no HTTP manual)?
- [ ] ¿No hay servicios duplicados en features?
- [ ] ¿Servicios específicos de feature están en providers del componente?

### Comandos de Validación

```bash
# Buscar HttpClient directo (debería estar minimizado)
grep -r "inject(HttpClient)" appsweb/angular/src/app/modules --include="*.ts" | \
  grep -v "core/services" | wc -l

# Buscar si se inyecta ApiResponseService
grep -r "inject(ApiResponseService)" appsweb/angular/src/app --include="*.ts" | wc -l

# Buscar diálogos que no usan DialogHandlerService
grep -r "inject(DialogService)" appsweb/angular/src/app/modules --include="*.ts" | wc -l

# Buscar servicios locales que duplican core
find appsweb/angular/src/app/modules -name "*service.ts" -type f | \
  grep -v "core/services" | head -20
```

---

## 7. Catálogo Completo de Servicios

**Ubicaciones:**
- `core/services/` (30+ servicios genéricos)
- `core/auth/services/` (7 servicios de auth)
- `core/http/services/` (4 servicios HTTP)
- `core/helpers/` (2+ helpers)
- `core/directives/` (5 directivas)
- Feature-specific: Múltiples stores (CobranzaOnlineStoreService, etc.)

---

## 8. Anti-patrones

| ❌ Incorrecto | ✅ Correcto | Razón |
|---|---|---|
| `this.http.get()` directo | `this.api.onGetList()` | Centralización, error handling |
| Crear `ToastService` local | Inyectar `CustomToastService` | No duplicar |
| `new DialogRef()` | Inyectar `DialogHandlerService` | Abstracción web/mobile |
| `localStorage.getItem()` | Inyectar `StorageService` | Unificación, testeable |
| BehaviorSubject en feature | Inyectar `AuthService` | Single source of truth |
| `FormBuilder` sin `FormHelper` | Usar `FormHelper.submitCrud()` | Reduce boilerplate 80% |
| Servicio sin `providedIn: 'root'` | Siempre `providedIn: 'root'` | Singleton guaranteed |

---

## 9. Referencias y Documentos Relacionados

- [CONVENTIONS.md §4 — Frontend Rules](../CONVENTIONS.md#4-frontend-rules)
- [Frontend Generic Services Catalog](./frontend-generic-services-catalog.md)
- [Angular: Services Best Practices](./angular-services-best-practices.md) — Complementario
- [angular-http-interceptors.md](./angular-http-interceptors.md) — HTTP layer
- [angular-error-handling-pattern.md](./angular-error-handling-pattern.md) — Error handling

---

**Última actualización:** 2026-08-06  
**Vigencia:** Angular 17+ (signals, injection API)  
**Aplicable a:** Todos los componentes y features que necesitan servicios
