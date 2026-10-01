# Angular: Testing Patterns (Unit, Integration)

**Última revisión:** 2026-08-06  
**Derivado de:** CONVENTIONS.md §4 (Frontend Rules) + exploración codebase  
**Severidad:** 🟡 MEDIA — Recomendado para nuevas features/servicios

---

## Propósito

Documentar patrones de testing en Angular: TestBed setup, mocking de servicios, testing de componentes standalone, y criterios de cobertura.

---

## Regla de Oro

```
Cobertura Mínima = 70% (statements, branches, functions)

❌ NO: Tests vacíos, solo "Happy Path", sin mocking
✅ SÍ: TestBed configurado, servicios mockeados, casos edge
```

---

## 1. TestBed Setup

### Configuración Básica

**Ubicación real:** `appsweb/angular/src/app/core/services/connectivity.service.spec.ts`

```typescript
import { TestBed } from '@angular/core/testing';
import { ConnectivityService } from './connectivity.service';

describe('ConnectivityService', () => {
  let service: ConnectivityService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConnectivityService]
    });
    
    // Inyectar servicio después de configurar
    service = TestBed.inject(ConnectivityService);
  });
  
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
  it('should detect online status', () => {
    expect(service.isOnline()).toBe(true);
  });
});
```

### Setup con Imports

```typescript
describe('LecturaFormComponent', () => {
  let component: LecturaFormComponent;
  let fixture: ComponentFixture<LecturaFormComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LecturaFormComponent,
        ReactiveFormsModule,
        CommonModule
      ],
      providers: [
        // Servicios reales
        FormBuilder
      ]
    }).compileComponents();
    
    fixture = TestBed.createComponent(LecturaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Ejecutar ngOnInit
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

---

## 2. Mocking Servicios

### Crear Mock Service

```typescript
// ✅ CORRECTO: Mock service con interfaz compartida
class MockApiService implements Partial<ApiResponseService> {
  onGetList<T>() {
    return of([]);
  }
  
  onPost<T>() {
    return of(null as T);
  }
  
  onDelete() {
    return of(void 0);
  }
}

describe('CobranzaDetailComponent', () => {
  let component: CobranzaDetailComponent;
  let mockApi: MockApiService;
  
  beforeEach(async () => {
    mockApi = new MockApiService();
    
    await TestBed.configureTestingModule({
      imports: [CobranzaDetailComponent],
      providers: [
        { provide: ApiResponseService, useValue: mockApi }
      ]
    }).compileComponents();
    
    fixture = TestBed.createComponent(CobranzaDetailComponent);
    component = fixture.componentInstance;
  });
  
  it('should load data on init', fakeAsync(() => {
    spyOn(mockApi, 'onGetList').and.returnValue(
      of([{ id: 1, name: 'Test' }])
    );
    
    fixture.detectChanges(); // ngOnInit
    tick();
    
    expect(mockApi.onGetList).toHaveBeenCalled();
  }));
});
```

### Usar jasmine.createSpyObj

```typescript
// ✅ CORRECTO: Crear mock con spyObj
describe('MedidorService', () => {
  let service: MedidorService;
  let mockApi: jasmine.SpyObj<ApiResponseService>;
  
  beforeEach(() => {
    mockApi = jasmine.createSpyObj('ApiResponseService', [
      'onGetList',
      'onPost',
      'onDelete'
    ]);
    
    TestBed.configureTestingModule({
      providers: [
        MedidorService,
        { provide: ApiResponseService, useValue: mockApi }
      ]
    });
    
    service = TestBed.inject(MedidorService);
  });
  
  it('should fetch medidores', () => {
    const mockData = [{ id: 1, lectura: 100 }];
    mockApi.onGetList.and.returnValue(of(mockData));
    
    service.loadMedidores();
    
    expect(mockApi.onGetList).toHaveBeenCalledWith('api/medidores');
  });
});
```

---

## 3. Testing Components

### Testing Inputs & Outputs

```typescript
describe('MedidorCardComponent', () => {
  let component: MedidorCardComponent;
  let fixture: ComponentFixture<MedidorCardComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedidorCardComponent]
    }).compileComponents();
    
    fixture = TestBed.createComponent(MedidorCardComponent);
    component = fixture.componentInstance;
  });
  
  it('should display medidor data', () => {
    // Usar input() API
    fixture.componentRef.setInput('data', {
      id: 1,
      name: 'Medidor 1',
      lectura: 100
    });
    
    fixture.detectChanges();
    
    expect(component.data().id).toBe(1);
  });
  
  it('should emit when card clicked', () => {
    spyOn(component.selected, 'emit');
    
    const card = fixture.debugElement.query(By.css('.card'));
    card.nativeElement.click();
    
    expect(component.selected.emit).toHaveBeenCalled();
  });
});
```

### Testing Async Operations

```typescript
describe('CobranzaOnlineStoreService', () => {
  let service: CobranzaOnlineStoreService;
  let mockApi: jasmine.SpyObj<ApiResponseService>;
  
  beforeEach(() => {
    mockApi = jasmine.createSpyObj('ApiResponseService', [
      'onGetList'
    ]);
    
    TestBed.configureTestingModule({
      providers: [
        CobranzaOnlineStoreService,
        { provide: ApiResponseService, useValue: mockApi }
      ]
    });
    
    service = TestBed.inject(CobranzaOnlineStoreService);
  });
  
  it('should load dashboard data', fakeAsync(() => {
    const mockData = { total: 5000 };
    mockApi.onGetList.and.returnValue(of(mockData));
    
    service.loadDashboard();
    tick(); // Esperar promesas
    
    expect(service.dashboardData()).toEqual(mockData);
  }));
  
  it('should handle error in loadDashboard', fakeAsync(() => {
    mockApi.onGetList.and.returnValue(
      throwError(() => new Error('API Error'))
    );
    
    service.loadDashboard();
    tick();
    
    expect(service.hasError()).toBe(true);
  }));
});
```

### Testing Signals

```typescript
describe('MedidorListComponent', () => {
  let component: MedidorListComponent;
  let fixture: ComponentFixture<MedidorListComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedidorListComponent]
    }).compileComponents();
    
    fixture = TestBed.createComponent(MedidorListComponent);
    component = fixture.componentInstance;
  });
  
  it('should update filtered list when filter signal changes', () => {
    component.items.set([
      { id: 1, name: 'Active', active: true },
      { id: 2, name: 'Inactive', active: false }
    ]);
    
    component.filterActive.set(true); // Cambiar signal
    
    expect(component.filteredItems().length).toBe(1);
    expect(component.filteredItems()[0].name).toBe('Active');
  });
  
  it('should update count when items signal changes', () => {
    component.items.set([{ id: 1, name: 'Test', active: true }]);
    
    expect(component.itemCount()).toBe(1);
  });
});
```

---

## 4. Testing Forms

### Testing Validation

```typescript
describe('MedidorLecturaFormComponent', () => {
  let component: MedidorLecturaFormComponent;
  let fixture: ComponentFixture<MedidorLecturaFormComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedidorLecturaFormComponent, ReactiveFormsModule]
    }).compileComponents();
    
    fixture = TestBed.createComponent(MedidorLecturaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  
  it('should invalidate if lectura actual < lectura anterior', () => {
    component.lecturaForm.patchValue({
      lecturaAnterior: 100,
      lecturaActual: 50 // Menor (inválido)
    });
    
    const lecturaActualControl = component.lecturaForm.get('lecturaActual');
    expect(lecturaActualControl?.hasError('lecturaDecreased')).toBe(true);
  });
  
  it('should validate if lectura actual > lectura anterior', () => {
    component.lecturaForm.patchValue({
      lecturaAnterior: 100,
      lecturaActual: 150 // Mayor (válido)
    });
    
    expect(component.lecturaForm.get('lecturaActual')?.valid).toBe(true);
  });
  
  it('should disable submit button if form invalid', () => {
    component.lecturaForm.setErrors({ 'required': true });
    fixture.detectChanges();
    
    const submitButton = fixture.debugElement.query(
      By.css('button[type="submit"]')
    );
    expect(submitButton.nativeElement.disabled).toBe(true);
  });
});
```

---

## 5. Testing HTTP Calls

### Usando HttpClientTestingModule

```typescript
describe('MedidorService', () => {
  let service: MedidorService;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MedidorService]
    });
    
    service = TestBed.inject(MedidorService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  
  afterEach(() => {
    httpMock.verify(); // Verificar que no hay requests pendientes
  });
  
  it('should fetch medidores from API', () => {
    service.getMedidores().subscribe(data => {
      expect(data.length).toBe(2);
      expect(data[0].name).toBe('Medidor 1');
    });
    
    const req = httpMock.expectOne('api/medidores');
    expect(req.request.method).toBe('GET');
    
    req.flush([
      { id: 1, name: 'Medidor 1' },
      { id: 2, name: 'Medidor 2' }
    ]);
  });
  
  it('should handle HTTP error', () => {
    service.getMedidores().subscribe({
      next: () => fail('Should have failed'),
      error: (error) => {
        expect(error.status).toBe(404);
      }
    });
    
    const req = httpMock.expectOne('api/medidores');
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
  });
});
```

---

## 6. Coverage Requirements

### Métricas de Cobertura

```yaml
# .nycrc.json o karma.conf.js

"coverageThreshold": {
  "global": {
    "branches": 70,
    "functions": 70,
    "lines": 70,
    "statements": 70
  },
  "each": {
    "branches": 60,
    "functions": 60,
    "lines": 60,
    "statements": 60
  }
}
```

### Ejecutar Cobertura

```bash
# Generar reporte de cobertura
ng test --code-coverage

# Abrir reporte
open coverage/index.html
```

---

## 7. Verificaciones de Auditoría

### Checklist de Testing

- [ ] ¿TestBed configurado correctamente?
- [ ] ¿Servicios están mockeados (no HTTP real)?
- [ ] ¿Async operations usan fakeAsync/tick?
- [ ] ¿Tests cubren happy path + error cases?
- [ ] ¿Cobertura ≥ 70% (statements)?
- [ ] ¿Sin console.log en tests (mantener limpio)?
- [ ] ¿Tests son independientes (no orden)?
- [ ] ¿Descripciones de tests son claras?
- [ ] ¿httpMock.verify() en afterEach?
- [ ] ¿Fixtures se limpian entre tests?

### Comandos de Validación

```bash
# Ejecutar tests
ng test

# Tests con cobertura
ng test --code-coverage

# Tests en CI (headless)
ng test --watch=false --browsers=ChromeHeadless

# Ver qué líneas no están cubiertas
open coverage/index.html
```

---

## 8. Anti-patrones

| ❌ Incorrecto | ✅ Correcto | Razón |
|---|---|---|
| HTTP real en tests | Mockeado con HttpClientTestingModule | Tests deben ser rápidos, offline |
| Tests sin TestBed | TestBed.configureTestingModule | Necesario para inyección |
| Async sin fakeAsync/tick | fakeAsync + tick() | Control explícito de tiempo |
| Tests que dependen del orden | beforeEach resets | Tests deben ser independientes |
| Servicios reales mockeados incompletamente | jasmine.createSpyObj | Todos los métodos disponibles |
| Sin tests de error | Happy path + error cases | Cobertura incompleta |
| console.log en tests | Limpiar antes de commit | Ruido en salida |
| Cobertura sin verificación | 70% mínimo obligatorio | Evita regresiones |

---

## 9. Referencias y Documentos Relacionados

- [CONVENTIONS.md §4 — Frontend Rules](../CONVENTIONS.md#4-frontend-rules)
- [angular-signals-and-state.md](./angular-signals-and-state.md) — Testing signals
- [angular-forms-pattern.md](./angular-forms-pattern.md) — Testing forms
- Angular Docs: [Testing Guide](https://angular.io/guide/testing)
- Jasmine Docs: [Getting Started](https://jasmine.github.io/)

---

**Última actualización:** 2026-08-06  
**Vigencia:** Angular 22 (TestBed, async testing utilities)  
**Aplicable a:** Todos los servicios y componentes nuevos en el proyecto

