# Angular: Signals, State & Caching Pattern

**Última revisión:** 2026-08-06  
**Derivado de:** CONVENTIONS.md §4 (Frontend Rules) + exploración codebase  
**Severidad:** 🔴 CRÍTICA — Patrón obligatorio en todo componente/servicio Angular 22

---

## Propósito

Documentar el patrón de **signals como fuente única de verdad** para estado en Angular. Define cuándo usar `signal()`, `computed()`, `effect()`, y cómo cachear/invalidar datos.

---

## Regla de Oro

```
Estado en Angular 22 = WritableSignal + computed() + effect()

❌ NO: BehaviorSubject, .subscribe(), async pipe
✅ SÍ: signal(), computed(), effect(), {{ signal() }} o injected signals
```

Excepciones documentadas:
- **BehaviorSubject permitido SOLO** en: interceptores (JWT refresh), eventos globales (error), SignalR (tiempo real)
- **Migrando**: GlobalErrorService, SignalRService, JWT interceptor (heredados)

---

## 1. Signal Fundamentals

### `signal()` — Estado Mutable

```typescript
// ✅ CORRECTO: WritableSignal local a componente
export class CobranzaOnlineAnalysisComponent {
  selectedMeasure = signal<string>('all');
  filterText = signal<string>('');
  isLoading = signal<boolean>(false);
  
  updateFilter(text: string) {
    this.filterText.set(text); // .set() para reemplazar
    this.isLoading.update(prev => !prev); // .update() para transformación
  }
}
```

**Cuándo usar:**
- Estado local del componente (inputs del usuario, toggles, flags)
- Datos mutables en servicios de estado (Store Services)
- Flags de carga, error

**Ubicación real encontrada:**
- `appsweb/angular/src/app/modules/cobranza.luxuryapp/cobranza-online/state/cobranza-online-store.service.ts:15-25`
- `appsweb/angular/src/app/modules/committee.luxuryapp/cobranza/committee-cobranza-detail-modal.ts:30-40`

---

### `computed()` — Estado Derivado (Read-only)

```typescript
// ✅ CORRECTO: Cálculos que reaccionan automáticamente
export class CobranzaOnlineAnalysisComponent {
  cobranzaData = signal<CobranzaDto[]>([]);
  selectedMeasure = signal<string>('all');
  
  // Computed recalcula automáticamente cuando cobranzaData o selectedMeasure cambia
  filteredCobranza = computed(() => {
    const data = this.cobranzaData();
    const measure = this.selectedMeasure();
    return data.filter(item => measure === 'all' || item.measure === measure);
  });
  
  // Cálculo derivado: título que reacciona a cambios
  cuotaPromedioSubtitulo = computed(() => {
    const filtered = this.filteredCobranza();
    return filtered.length > 0 
      ? (filtered.reduce((sum, i) => sum + i.amount, 0) / filtered.length).toFixed(2)
      : '0.00';
  });
}
```

**Ubicación real encontrada:**
- `cobranza-online-analysis.ts:85-96` (cuotaPromedioSubtitulo computed)
- `medidor-lectura-form.ts` (cálculos de validación)

**Ventajas:**
- ✅ Automático: no hay que disparar manualmente
- ✅ Lazy: solo se recalcula si inputs cambian
- ✅ Type-safe: compilador verifica tipos

**Antipatrón:**
```typescript
// ❌ NO: Recalcular manualmente en ngOnInit/subscribe
ngOnInit() {
  this.cobranzaData$.subscribe(data => {
    this.filtered = data.filter(...); // ❌ manual, propenso a olvidar
  });
}
```

---

### `effect()` — Reactividad con Efectos Secundarios

```typescript
// ✅ CORRECTO: effect() para reacciones automáticas
export class CobranzaOnlineStoreService {
  dashboardData = signal<DashboardDto | null>(null);
  syncStatus = signal<'idle' | 'loading' | 'synced'>('idle');
  
  constructor(private api: ApiResponseService) {
    // effect() se ejecuta automáticamente cuando dashboardData cambia
    effect(() => {
      const data = this.dashboardData();
      if (data) {
        console.log('Dashboard data loaded:', data);
        this.saveToLocalStorage('dashboard', data); // Efecto secundario
      }
    });
    
    // effect() para recargas automáticas con polling
    effect(() => {
      const status = this.syncStatus();
      if (status === 'idle') {
        this.loadDashboard(); // Recarga automática
      }
    });
  }
  
  loadDashboard() {
    this.syncStatus.set('loading');
    this.api.onGetList<DashboardDto>(/* ... */).subscribe(data => {
      this.dashboardData.set(data);
      this.syncStatus.set('synced');
    });
  }
}
```

**Ubicación real encontrada:**
- `cobranzaOnlineStoreService.ts:41-56` (efectos de sincronización)
- `medidores-list.ts:4` (recarga automática)

**Cuándo usar:**
- Persistencia en localStorage/sessionStorage
- Polling automático
- Sincronización entre signals
- Efectos de validación

**Ciclo de vida:**
- ✅ effect() se ejecuta en setup + cada vez que dependencia cambia
- ✅ Se limpian automáticamente con destroy de componente/servicio
- ❌ NO return cleanup function — Angular lo maneja

---

## 2. Store Services Pattern (Estado Centralizado)

**Ubicación real:** `appsweb/angular/src/app/modules/cobranza.luxuryapp/cobranza-online/state/cobranza-online-store.service.ts`

### Estructura Obligatoria

```typescript
import { Injectable, computed, effect, signal } from '@angular/core';
import { ApiResponseService } from '@core/http/services/api-response.service';

@Injectable({ providedIn: 'root' })
export class CobranzaOnlineStoreService {
  // PASO 1: Datos primitivos (WritableSignal)
  dashboardData = signal<DashboardDto | null>(null);
  analysisData = signal<AnalysisDto | null>(null);
  selectedPeriod = signal<string>('current');
  
  // PASO 2: Flags operacionales
  isLoading = signal<boolean>(false);
  hasError = signal<boolean>(false);
  errorMessage = signal<string>('');
  
  // PASO 3: Datos derivados (computed)
  totalAmount = computed(() => {
    const data = this.dashboardData();
    return data?.total ?? 0;
  });
  
  isDataReady = computed(() => {
    return !this.isLoading() && this.dashboardData() !== null;
  });
  
  // PASO 4: Efectos (automáticos)
  constructor(private api: ApiResponseService) {
    // Effect 1: Guardar datos cacheados en localStorage
    effect(() => {
      const data = this.dashboardData();
      if (data) {
        localStorage.setItem('cobranza-cache', JSON.stringify(data));
      }
    });
    
    // Effect 2: Reload automático cuando período cambia
    effect(() => {
      const period = this.selectedPeriod();
      this.loadDashboard(period);
    });
  }
  
  // PASO 5: Métodos públicos que mutan signals
  async loadDashboard(period?: string): Promise<void> {
    this.isLoading.set(true);
    this.hasError.set(false);
    
    try {
      const response = await this.api.onGetList<DashboardDto>(
        `api/dashboard?period=${period || this.selectedPeriod()}`
      ).toPromise();
      
      this.dashboardData.set(response);
    } catch (error) {
      this.hasError.set(true);
      this.errorMessage.set('Failed to load dashboard');
    } finally {
      this.isLoading.set(false);
    }
  }
  
  // PASO 6: Método para invalidar caché
  clearStore(): void {
    this.dashboardData.set(null);
    this.analysisData.set(null);
    this.isLoading.set(false);
    this.hasError.set(false);
    localStorage.removeItem('cobranza-cache');
  }
  
  // PASO 7: Rehidratación desde caché
  loadLocalData(): void {
    const cached = localStorage.getItem('cobranza-cache');
    if (cached) {
      try {
        this.dashboardData.set(JSON.parse(cached));
      } catch {
        this.clearStore();
      }
    }
  }
}
```

### Consumo en Componentes

```typescript
// ✅ CORRECTO: Inyectar servicio, usar signals directamente
@Component({
  selector: 'app-dashboard',
  template: `
    <div *ngIf="store.isLoading()">Loading...</div>
    <div *ngIf="store.isDataReady()">
      <h1>Total: {{ store.totalAmount() }}</h1>
      <p>Period: {{ store.selectedPeriod() }}</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  protected store = inject(CobranzaOnlineStoreService);
  
  // Cambiar período dispara effect automáticamente
  changePeriod(period: string): void {
    this.store.selectedPeriod.set(period);
  }
}
```

**Ubicación real encontrada:**
- `committee-cobranza-detail-modal.ts` — consumen CobranzaOnlineStoreService
- `cobranza-online-wrapper.ts` — disparan carga de datos

---

## 3. Caching Strategy

### Niveles de Caché

| Nivel | Ubicación | TTL | Invalidación |
|---|---|---|---|
| **Memoria (Signal)** | Store Service | Session | `clearStore()` o cambio de período |
| **localStorage** | Browser | Indefinido | `clearStore()` o manual |
| **HTTP Cache** | ApiResponseService | 5-10min | Automático por header |

### Patrón: Lectura → Caché → HTTP → Persistencia

```typescript
export class CobranzaOnlineStoreService {
  // Caché en memoria
  dashboardData = signal<DashboardDto | null>(null);
  
  loadDashboard(forceRefresh = false): void {
    // PASO 1: Validar caché en memoria
    if (this.dashboardData() && !forceRefresh) {
      return; // Usar caché
    }
    
    // PASO 2: Validar caché en localStorage
    if (!forceRefresh) {
      const cached = localStorage.getItem('cobranza-dashboard');
      if (cached && this.isValidCache(cached)) {
        this.dashboardData.set(JSON.parse(cached));
        return; // Usar localStorage
      }
    }
    
    // PASO 3: HTTP request (caché en ApiResponseService automática)
    this.isLoading.set(true);
    this.api.onGetList<DashboardDto>('api/dashboard').subscribe({
      next: (data) => {
        this.dashboardData.set(data);
        // PASO 4: Persistir en localStorage
        localStorage.setItem('cobranza-dashboard', JSON.stringify({
          data,
          timestamp: Date.now()
        }));
      },
      error: (err) => this.handleError(err),
      complete: () => this.isLoading.set(false)
    });
  }
  
  private isValidCache(cached: string): boolean {
    try {
      const obj = JSON.parse(cached);
      const age = Date.now() - obj.timestamp;
      return age < 5 * 60 * 1000; // 5 minutos
    } catch {
      return false;
    }
  }
}
```

### Invalidación Explícita

```typescript
// ✅ CORRECTO: Invalidar cuando datos se creen/actualicen
async createCobranza(dto: CreateCobranzaDto): Promise<void> {
  await this.api.onPost<CobranzaDto>('api/cobranza', dto).toPromise();
  
  // Invalidar cachés relacionados
  this.store.clearStore(); // o selectivamente:
  this.store.dashboardData.set(null);
  
  // Recargar datos frescos
  this.store.loadDashboard();
}
```

---

## 4. Migración desde BehaviorSubject

### Casos de Migración

| Heredado | Moderno | Ubicación Actual |
|---|---|---|
| `BehaviorSubject<T>` | `signal<T>` | GlobalErrorService, CobranzaOnlineStoreService |
| `Observable.subscribe()` | `effect()` | Interceptor JWT, SignalR |
| `async pipe` | `{{ signal() }}` en templates | Todos los templates |

### Patrón de Migración: Paso a Paso

**Antes (BehaviorSubject):**
```typescript
export class ErrorService {
  private error$ = new BehaviorSubject<string>('');
  error$ = this.error$.asObservable();
  
  setError(msg: string): void {
    this.error$.next(msg);
  }
}

// En componente:
@Component({
  template: `<p>{{ error$ | async }}</p>`
})
export class ErrorDisplayComponent {
  error$ = inject(ErrorService).error$;
}
```

**Después (Signals):**
```typescript
export class ErrorService {
  error = signal<string>('');
  
  setError(msg: string): void {
    this.error.set(msg);
  }
}

// En componente:
@Component({
  template: `<p>{{ service.error() }}</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorDisplayComponent {
  service = inject(ErrorService);
}
```

**Ventajas de migrar:**
- ✅ Menos boilerplate (no async pipe)
- ✅ OnPush automático (mejor performance)
- ✅ Debugging más fácil (sin subscriptions ocultas)
- ✅ Type-safe: compilador verifica acceso

---

## 5. Verificaciones de Auditoría

### Checklist de Signals

- [ ] ¿Componentes nuevos usan `signal()` para estado local? (no @Input/$event)
- [ ] ¿Servicios de estado usan Store Service pattern?
- [ ] ¿Se usan `computed()` para cálculos derivados? (no `.subscribe()` manual)
- [ ] ¿Se usan `effect()` para efectos secundarios? (no ngOnInit/ngOnDestroy)
- [ ] ¿Templates acceden signals como funciones? (`{{ signal() }}` no `{{ signal | async }}`)
- [ ] ¿BehaviorSubject solo en excepciones documentadas? (JWT, SignalR, eventos)
- [ ] ¿Store Services tienen clearStore() + loadLocalData() para caché?
- [ ] ¿Componentes tienen OnPush + ChangeDetectionStrategy?

### Comandos de Validación

```bash
# Buscar BehaviorSubject (solo excepciones permitidas)
grep -r "new BehaviorSubject" appsweb/angular/src/app --include="*.ts" \
  | grep -v "jwt.interceptor" \
  | grep -v "SignalRService" \
  | grep -v "GlobalErrorService"

# Validar signals en uso
grep -r "signal<" appsweb/angular/src/app --include="*.ts" | wc -l

# Buscar async pipe (debería disminuir)
grep -r "| async" appsweb/angular/src/app --include="*.html"

# Validar Store Services
find appsweb/angular/src/app -name "*store.service.ts" -type f
```

---

## 6. Referencias y Documentos Relacionados

- [CONVENTIONS.md §4 — Frontend Rules](../CONVENTIONS.md#4-frontend-rules)
- [angular-components-api.md](./angular-components-api.md) — input(), model() API
- [angular-forms-pattern.md](./angular-forms-pattern.md) — FormGroup con signals
- [architecture-shared-ui.md](../../appsweb/angular/src/app/shared/ui/arquitectura-shared-ui.md)

---

## 7. Antipatrones

| ❌ Incorrecto | ✅ Correcto | Razón |
|---|---|---|
| `new BehaviorSubject()` en servicios | `signal()` en servicios | Signals más simple, tipado, reactivo |
| `.subscribe()` en componentes | `effect()` en servicios | effect() automático, se limpia solo |
| `async pipe` en templates | `{{ signal() }}` | Sin subscripción oculta, OnPush seguro |
| `computed()` con .subscribe() | `computed()` con solo signals | Evita subscripción manual, lazy |
| Efectos sin error handling | `effect()` con try/catch | BehaviorSubject/Observable tienen error |
| BehaviorSubject fuera excepciones | Solo en JWT/SignalR/EventEmitter | Mantener coherencia del sistema |

---

**Última actualización:** 2026-08-06  
**Vigencia:** Angular 22 (signals estables)  
**Aplicable a:** Todos los componentes y servicios nuevos

