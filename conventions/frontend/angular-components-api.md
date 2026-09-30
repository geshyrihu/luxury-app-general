# Angular: Components API (input, model, standalone, OnPush)

**Última revisión:** 2026-08-06  
**Derivado de:** CONVENTIONS.md §4 (Frontend Rules) + exploración codebase  
**Severidad:** 🟠 ALTA — Patrón obligatorio en componentes nuevos

---

## Propósito

Documentar la **nueva API de componentes Angular 22**: `input()`, `model()`, `standalone`, y `ChangeDetectionStrategy.OnPush`. Define cuándo y cómo usar cada uno.

---

## Regla de Oro

```
Componentes en Angular 22 = Standalone + OnPush + input()/model() API

❌ NO: NgModule, @Input/@Output, ChangeDetectionDefault
✅ SÍ: standalone: true, OnPush, input()<T>(), model()<T>()
```

---

## 1. Standalone Components

### Estructura Mínima

```typescript
// ✅ CORRECTO: Standalone component
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '@ui/buttons/web/button.component';

@Component({
  selector: 'app-lectura-form',
  standalone: true, // ← OBLIGATORIO
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent // Importar directamente
  ],
  template: `
    <form [formGroup]="form">
      <input formControlName="lectura" />
      <app-button (click)="submit()">Guardar</app-button>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush // ← OBLIGATORIO
})
export class LecturaFormComponent {
  // Implementación
}
```

### Ventajas de Standalone

| Ventaja | Explicación |
|---------|-------------|
| ✅ Sin NgModule | No necesitar módulo contenedor |
| ✅ Imports claros | Todas las dependencias visibles en el componente |
| ✅ Lazy loading | Mejor code splitting y performance |
| ✅ Composición simple | Reutilizable sin wrapper module |
| ✅ Tree-shakeable | Angular elimina dependencias no usadas |

---

## 2. `input()` API (Read-Only Properties)

### Reemplaza `@Input`

**Ubicación real:** `appsweb/angular/src/app/shared/ui/base/accordion.base.ts`

```typescript
// ❌ VIEJO: @Input (Angular <16)
@Component({})
export class OldAccordionComponent {
  @Input() items: AccordionItem[] = [];
  @Input() expandedIds: string[] = [];
}

// ✅ NUEVO: input() API (Angular 22)
@Component({})
export class AccordionComponent {
  items = input<AccordionItem[]>([]); // Signal read-only
  expandedIds = input<string[]>([]); // Con default
  required = input.required<string>(); // Sin default, requerido
  optional = input<number>(); // Opcional, undefined
}
```

### Consumo en Template

```html
<!-- Acceso como función (signal) -->
<div *ngFor="let item of items()">
  <h3>{{ item.title }}</h3>
  <p>{{ item.content }}</p>
</div>

<!-- En computed -->
{{ isExpanded(required()) }}
```

### Ventajas

| Ventaja | Explicación |
|---------|-------------|
| ✅ Type-safe | Tipado en compilación |
| ✅ Lazy | Solo se procesa si se accede |
| ✅ Signals | Integración perfecta con signals |
| ✅ Computed | Crear propiedades derivadas fácilmente |

### Validar en Constructor

```typescript
export class AccordionComponent {
  items = input.required<AccordionItem[]>();
  
  constructor() {
    // Validar items al inicializar
    effect(() => {
      const itemsArray = this.items();
      if (itemsArray.length === 0) {
        console.warn('AccordionComponent: items vacío');
      }
    });
  }
}
```

---

## 3. `model()` API (Two-Way Binding)

### Reemplaza `@Input` + `@Output`

```typescript
// ❌ VIEJO: @Input + @Output
@Component({
  template: `<input [(ngModel)]="value">`
})
export class OldInputComponent {
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();
  
  onInput(val: string) {
    this.valueChange.emit(val);
  }
}

// ✅ NUEVO: model() API
@Component({
  template: `<input (change)="value.set($event.target.value)" />`
})
export class InputComponent {
  value = model<string>(''); // Signal + 2-way binding
  
  onInput(val: string) {
    this.value.set(val); // Automáticamente propaga al parent
  }
}
```

### Consumo (Parent → Child)

```typescript
// Parent
export class ParentComponent {
  searchText = signal<string>('');
}

// Template parent
<app-input-text [value]="searchText" />

// Child recibe en model()
export class InputTextComponent {
  value = model<string>('');
  
  onSearch(text: string) {
    this.value.set(text); // Propaga automáticamente al parent
  }
}
```

### Casos de Uso

| Caso | Patrón |
|------|--------|
| Input de usuario | `model<string>()` |
| Toggle visible/oculto | `model<boolean>()` |
| Filtro activo | `model<FilterDto>()` |
| Selector múltiple | `model<string[]>()` |

---

## 4. ChangeDetectionStrategy.OnPush

### Por Qué Es Obligatorio

```typescript
// ✅ CORRECTO: OnPush en todos los componentes nuevos
@Component({
  selector: 'app-medidor-card',
  changeDetection: ChangeDetectionStrategy.OnPush, // ← SIEMPRE
  template: `...`
})
export class MedidorCardComponent {}
```

### Cuándo Se Ejecuta Change Detection

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MedidorCardComponent {
  // Detecta cambios en estos casos:
  
  // 1. @Input cambió
  data = input<MedidorDto>();
  
  // 2. model() cambió
  selected = model<boolean>(false);
  
  // 3. Event listener disparó (click, change, etc)
  onClick() {
    this.handleClick(); // Change detection automático
  }
  
  // 4. Async subscription (promise/observable)
  constructor(private api: ApiService) {
    this.api.getData().subscribe(data => {
      // Change detection automático
    });
  }
  
  // 5. Signal cambió (pero tienes que "tocarlo")
  data = signal<MedidorDto | null>(null);
  
  ngOnInit() {
    effect(() => {
      const d = this.data(); // Leer signal dispara CD
      console.log('Data changed:', d);
    });
  }
}
```

### Performance Impact

```typescript
// ❌ MALO: ChangeDetectionStrategy.Default
// Change detection se ejecuta en CADA tick (muy frecuente)
// Componente padre con 1000 hijos = 1000 chequeos

// ✅ BUENO: ChangeDetectionStrategy.OnPush
// Change detection solo si inputs/events/signals cambian
// Componente padre con 1000 hijos = 0-1 chequeo (según eventos)
```

---

## 5. Componentes Base con Directivas

**Ubicación real:** `appsweb/angular/src/app/shared/ui/base/accordion.base.ts`

### Patrón: Directiva Base Reutilizable

```typescript
// ✅ CORRECTO: Directiva base con input()/model()
@Directive({
  selector: '[appAccordion]',
  standalone: true
})
export class AccordionDirective {
  // Propiedades que cualquier acordeón comparte
  items = input<AccordionItem[]>([]);
  expandedIds = model<string[]>([]); // Modificable desde parent
  
  // Métodos públicos
  toggleItem(id: string): void {
    const current = this.expandedIds();
    const updated = current.includes(id)
      ? current.filter(i => i !== id)
      : [...current, id];
    this.expandedIds.set(updated);
  }
  
  isExpanded(id: string): boolean {
    return this.expandedIds().includes(id);
  }
}

// Componente que usa directiva base
@Component({
  selector: 'app-accordion-web',
  hostDirective: [AccordionDirective], // Heredar propiedades
  template: `
    <div *ngFor="let item of items()">
      <button (click)="toggleItem(item.id)">
        {{ item.title }}
      </button>
      <div *ngIf="isExpanded(item.id)">
        {{ item.content }}
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccordionWebComponent {}
```

### Consumo

```html
<!-- Parent accede a directiva base -->
<app-accordion-web 
  [items]="items()"
  [(expandedIds)]="expandedIds">
</app-accordion-web>
```

---

## 6. Template Control Flow (Moderno)

### @if, @for, @switch (No *ngIf, *ngFor)

```typescript
// ❌ VIEJO: *ngIf, *ngFor (aún soportado pero deprecated)
<div *ngIf="isLoading">Loading...</div>
<div *ngFor="let item of items">{{ item.name }}</div>

// ✅ NUEVO: @if, @for (Angular 22)
@if (isLoading()) {
  <div>Loading...</div>
} @else {
  <div>Datos cargados</div>
}

@for (let item of items(); track item.id) {
  <div>{{ item.name }}</div>
}
```

### Ventajas

| Ventaja | Explicación |
|---------|-------------|
| ✅ Más legible | Control flow es keyword, no directiva |
| ✅ Track obligatorio | `track` previene bugs de reordenamiento |
| ✅ Performance | Mejor optimización del compilador |
| ✅ Type-safe | Type narrowing funciona mejor |

### @switch Control

```typescript
@switch (itemType()) {
  @case ('button') {
    <app-button>Click me</app-button>
  }
  @case ('input') {
    <input />
  }
  @default {
    <span>Unknown type</span>
  }
}
```

---

## 7. Verificaciones de Auditoría

### Checklist de Componentes

- [ ] ¿Componente es `standalone: true`?
- [ ] ¿ChangeDetectionStrategy es `OnPush`?
- [ ] ¿Usa `input()` en lugar de `@Input`?
- [ ] ¿Usa `model()` si hay 2-way binding?
- [ ] ¿Template usa `@if/@for/@switch` (no *ngIf/*ngFor)?
- [ ] ¿Acceso a inputs es función? (`{{ item() }}` no `{{ item }}`)
- [ ] ¿Sin NgModule, imports directos en componente?
- [ ] ¿Componentes base usan `hostDirective`?
- [ ] ¿input.required<T>() para propiedades obligatorias?
- [ ] ¿Track obligatorio en @for si es array de objetos?

### Comandos de Validación

```bash
# Buscar componentes sin standalone
grep -r "@Component" appsweb/angular/src/app --include="*.ts" | \
  grep -v "standalone: true"

# Buscar componentes sin OnPush
grep -r "@Component" appsweb/angular/src/app --include="*.ts" | \
  grep -v "changeDetection: ChangeDetectionStrategy.OnPush"

# Buscar @Input (debería reemplazarse con input())
grep -r "@Input()" appsweb/angular/src/app --include="*.ts"

# Buscar *ngIf (debería reemplazarse con @if)
grep -r "\*ngIf" appsweb/angular/src/app --include="*.html"

# Buscar *ngFor (debería reemplazarse con @for)
grep -r "\*ngFor" appsweb/angular/src/app --include="*.html"
```

---

## 8. Anti-patrones

| ❌ Incorrecto | ✅ Correcto | Razón |
|---|---|---|
| NgModule wrapper para componente | standalone: true | Más simple, sin boilerplate |
| @Input/@Output | input()/model() | Nueva API Angular 22, más simple |
| *ngIf/*ngFor | @if/@for/@switch | Control flow keyword, mejor performance |
| ChangeDetectionStrategy.Default | ChangeDetectionStrategy.OnPush | Mejor performance por defecto |
| Acceder input sin () | {{ item() }} | Signals requieren función |
| @for sin track | @for (...; track ...) | Previene bugs de reordenamiento |
| Componente base @Input | hostDirective base | Reutilización clara |
| Async pipe en template | Signals + effect | Evita subscripción oculta |

---

## 9. Referencias y Documentos Relacionados

- [CONVENTIONS.md §4 — Frontend Rules](../CONVENTIONS.md#4-frontend-rules)
- [angular-signals-and-state.md](./angular-signals-and-state.md) — Signals en componentes
- [angular-forms-pattern.md](./angular-forms-pattern.md) — FormControl con input()
- Angular Docs: [input() and model()](https://angular.io/guide/signals)

---

**Última actualización:** 2026-08-06  
**Vigencia:** Angular 22 (input/model API, @if/@for/@switch, OnPush)  
**Aplicable a:** Todos los componentes nuevos en el proyecto

