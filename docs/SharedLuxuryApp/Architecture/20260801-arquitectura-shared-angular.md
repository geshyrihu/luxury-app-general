# Arquitectura y Convenciones (Angular 22+)

Este documento establece las reglas fundamentales de desarrollo en Angular para **LuxuryApp**. Su propósito es asegurar un código moderno, seguro, de alto rendimiento y fácil de mantener.

## 1. Componentes Standalone
**Regla:** Todos los componentes, directivas y pipes nuevos deben ser `standalone: true`.
- **Por qué:** Angular 22 fomenta fuertemente la eliminación de `NgModule`. Los componentes standalone mejoran el _tree-shaking_, reducen el tamaño del bundle y simplifican el árbol de inyección de dependencias (DI).
- **Ejemplo:**
```typescript
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, PrimeNgComponents],
  templateUrl: './user-profile.html'
})
export class UserProfileComponent {}
```

## 2. Reactividad con Signals
**Regla:** Priorizar **Signals** (`signal`, `computed`, `effect`, `linkedSignal`, `resource`) sobre RxJS (`BehaviorSubject`, `ReplaySubject`) para el estado local del componente.
- **Por qué:** Signals ofrece una reactividad de grano fino, sin necesidad de suscripciones manuales ni pérdida de rendimiento por la detección de cambios global de `Zone.js`. RxJS debe reservarse únicamente para flujos asíncronos complejos o basados en eventos (como WebSockets o `debounceTime`).
- **Ejemplo:**
```typescript
// Uso de Signals en lugar de RxJS para estado síncrono
counter = signal(0);
double = computed(() => this.counter() * 2);

increment() {
  this.counter.update(v => v + 1);
}
```

## 3. Control Flow Nativo (@if, @for, @switch)
**Regla:** Reemplazar `*ngIf`, `*ngFor` y `*ngSwitch` por el nuevo Control Flow incorporado en el framework.
- **Por qué:** Es significativamente más rápido en ejecución, reduce la importación de `CommonModule` y mejora la legibilidad de las plantillas.
- **Ejemplo:**
```html
<!-- En lugar de *ngIf -->
@if (user()) {
  <p>Hola {{ user().name }}</p>
} @else {
  <p>Por favor, inicie sesión</p>
}

<!-- En lugar de *ngFor -->
@for (item of items(); track item.id) {
  <li>{{ item.name }}</li>
} @empty {
  <li>No hay elementos</li>
}
```

## 4. Inyección de Dependencias
**Regla:** Utilizar la función `inject()` en lugar de la inyección por constructor.
- **Por qué:** Reduce el _boilerplate_, facilita la herencia de componentes, permite funciones factoría puras y previene constructores masivos.
- **Ejemplo:**
```typescript
export class DataService {
  private http = inject(HttpClient);
}
```

## 5. HTTP Client con Fetch
**Regla:** Emplear `provideHttpClient(withFetch())` en `app.config.ts`.
- **Por qué:** Utiliza la API nativa de Fetch del navegador, lo que es necesario para Server-Side Rendering (SSR) eficiente y Edge functions, reduciendo problemas heredados de XHR.

## 6. Manejo de Librerías Externas
**Regla:** Antes de agregar una librería externa (como para gráficos, excels, editores), evaluar si:
1. Existe una API nativa del navegador.
2. Angular / Angular CDK ya lo provee.
3. El _bundle size_ no afecta el rendimiento (usar Bundle Analyzer si es necesario).
- **Ejemplo:** No utilizar `jwt-decode` (se puede usar `atob()`). Utilizar CDK para Drag and Drop.

---
_Nota: Esta migración es progresiva. El código heredado no se romperá automáticamente, pero todo código nuevo (o refactorizado) debe adherirse estrictamente a estas directrices._
