# Angular: Forms Pattern (Reactive, Typed, Validated)

**Última revisión:** 2026-08-06  
**Derivado de:** CONVENTIONS.md §4 (Frontend Rules) + exploración codebase  
**Severidad:** 🟠 ALTA — Patrón obligatorio en formularios

---

## Propósito

Documentar el patrón de **Reactive Forms tipadas y fuertemente validadas**. Define estructura, validadores custom, manejo de errores, y cómo integrar con signals.

---

## Regla de Oro

```
Formularios en Angular 22 = Reactive Forms + Typed FormGroup + Custom Validators

❌ NO: Template Forms (*ngModel), FormArray sin tipado
✅ SÍ: FormBuilder + IFormType interface + Validators custom
```

---

## 1. Typed FormGroup Pattern

### Interface + FormGroup Tipado

**Ubicación real:** `appsweb/angular/src/app/modules/medidores.luxuryapp/` (MedidorLecturaForm.ts)

```typescript
// PASO 1: Definir interfaz del formulario
export interface IMedidorLecturaForm {
  medidorId: FormControl<number>;
  lecturaAnterior: FormControl<number>;
  lecturaActual: FormControl<number>;
  observaciones: FormControl<string>;
  fotosUrls: FormControl<string[]>;
}

// PASO 2: Crear FormGroup tipado
export class MedidorLecturaFormComponent {
  private fb = inject(FormBuilder);
  
  // FormGroup<IMedidorLecturaForm> = type-safe
  lecturaForm = this.fb.group<IMedidorLecturaForm>({
    medidorId: this.fb.control<number>(0, [Validators.required, Validators.min(1)]),
    lecturaAnterior: this.fb.control<number>(0, [Validators.required]),
    lecturaActual: this.fb.control<number>(0, [
      Validators.required,
      this.lecturaActualValidator()
    ]),
    observaciones: this.fb.control<string>('', [Validators.maxLength(500)]),
    fotosUrls: this.fb.control<string[]>([], [Validators.required]) // Array tipado
  });
  
  // PASO 3: Acceso type-safe a controles
  get lecturaActual(): FormControl<number> {
    return this.lecturaForm.get('lecturaActual') as FormControl<number>;
  }
  
  get medidorId(): FormControl<number> {
    return this.lecturaForm.get('medidorId') as FormControl<number>;
  }
  
  // PASO 4: Validador custom
  private lecturaActualValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const lecturaAnterior = this.lecturaForm?.get('lecturaAnterior')?.value ?? 0;
      const lecturaActual = control.value;
      
      return lecturaActual > lecturaAnterior 
        ? null 
        : { lecturaDecreased: true };
    };
  }
  
  // PASO 5: Obtener datos tipados
  getFormData(): IMedidorLecturaForm {
    return this.lecturaForm.getRawValue(); // Tipado automáticamente
  }
}
```

### Validación de Tipos en Compilación

```typescript
// ✅ CORRECTO: El compilador valida tipo
this.lecturaForm.get('lecturaActual')?.valueChanges.subscribe((val: number) => {
  // val es number, tipado automáticamente
  console.log(val + 10);
});

// ❌ ERROR: Compilador rechaza tipos incorrectos
this.lecturaForm.get('lectura').valueChanges; // ERROR: 'lectura' no existe en interface
this.lecturaForm.get('lecturaActual')?.setValue('texto'); // ERROR: string no es number
```

---

## 2. Validadores Custom

### Validador Simple (Single Field)

```typescript
export class MedidorLecturaFormComponent {
  private fb = inject(FormBuilder);
  
  // Validador que verifica que lectura aumenta
  private lecturaActualValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const lecturaAnterior = this.lecturaForm?.get('lecturaAnterior')?.value ?? 0;
      const lecturaActual = control.value;
      
      if (lecturaActual > lecturaAnterior) {
        return null; // Válido
      } else {
        return {
          lecturaDecreased: {
            expected: lecturaAnterior,
            received: lecturaActual
          }
        };
      }
    };
  }
}
```

### Validador Cruzado (Multiple Fields)

```typescript
export class CandidateApplicationFormComponent {
  private fb = inject(FormBuilder);
  
  applicationForm = this.fb.group<ICandidateApplicationForm>(
    {
      startDate: this.fb.control<Date>(new Date(), [Validators.required]),
      endDate: this.fb.control<Date>(new Date(), [Validators.required]),
      contractType: this.fb.control<string>('', [Validators.required])
    },
    {
      validators: [this.dateRangeValidator()] // Cross-field validator
    }
  );
  
  // Validador que cruza múltiples campos
  private dateRangeValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const startDate = formGroup.get('startDate')?.value;
      const endDate = formGroup.get('endDate')?.value;
      
      if (!startDate || !endDate) return null;
      
      return endDate > startDate 
        ? null 
        : { invalidDateRange: { start: startDate, end: endDate } };
    };
  }
}
```

### Validador Async (API Call)

```typescript
export class CandidateApplicationFormComponent {
  private fb = inject(FormBuilder);
  private api = inject(ApiResponseService);
  
  applicationForm = this.fb.group({
    candidateName: this.fb.control(
      '',
      [Validators.required],
      [this.uniqueCandidateValidator()] // Async validators como tercer param
    )
  });
  
  // Validador que llama a la API
  private uniqueCandidateValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }
      
      return this.api.onGet<{ exists: boolean }>(
        `api/candidates/exists?name=${control.value}`
      ).pipe(
        map(response => response.exists ? { candidateExists: true } : null),
        catchError(() => of(null)) // Si API falla, no rechazar el formulario
      );
    };
  }
}
```

---

## 3. Manejo de Errores en Formularios

### Mostrar Errores en Template

```html
<!-- ✅ CORRECTO: Validar control y mostrar error específico -->
<input 
  formControlName="lecturaActual"
  type="number" />

<ng-container *ngIf="lecturaActual.invalid && lecturaActual.touched">
  <span *ngIf="lecturaActual.errors?.['required']" class="error">
    Lectura actual es requerida
  </span>
  <span *ngIf="lecturaActual.errors?.['lecturaDecreased']" class="error">
    Lectura debe ser mayor a {{ lecturaForm.get('lecturaAnterior')?.value }}
  </span>
  <span *ngIf="lecturaActual.errors?.['min']" class="error">
    Lectura mínima: {{ lecturaActual.errors?.['min']?.['min'] }}
  </span>
</ng-container>

<!-- ✅ CORRECTO: Deshabilitar submit hasta que sea válido -->
<button 
  type="submit"
  [disabled]="lecturaForm.invalid || isSubmitting()">
  Guardar Lectura
</button>
```

### Patrones de Error Handling

```typescript
export class MedidorLecturaFormComponent {
  private api = inject(ApiResponseService);
  
  isSubmitting = signal<boolean>(false);
  submitError = signal<string>('');
  
  async submitForm(): Promise<void> {
    if (this.lecturaForm.invalid) {
      this.submitError.set('Por favor completa todos los campos requeridos');
      return;
    }
    
    this.isSubmitting.set(true);
    this.submitError.set('');
    
    try {
      const formData = this.getFormData();
      await this.api.onPost<MedidorLecturaDto>(
        'api/medidores/lectura',
        formData
      ).toPromise();
      
      // Success handling
      this.lecturaForm.reset();
    } catch (error) {
      // Error handling por tipo
      if (error instanceof HttpErrorResponse) {
        if (error.status === 400) {
          this.submitError.set(error.error.message); // Backend validation error
        } else if (error.status === 409) {
          this.submitError.set('Lectura duplicada en ese período');
        } else {
          this.submitError.set('Error al guardar. Intenta nuevamente.');
        }
      }
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
```

---

## 4. Integración con Signals

### Patrón: FormGroup + Signals

```typescript
export class MedidorLecturaFormComponent {
  private fb = inject(FormBuilder);
  private store = inject(MedidorStoreService);
  
  // FormGroup tipado
  lecturaForm = this.fb.group<IMedidorLecturaForm>({
    medidorId: this.fb.control<number>(0, [Validators.required]),
    lecturaActual: this.fb.control<number>(0, [Validators.required]),
    observaciones: this.fb.control<string>('', [])
  });
  
  // Signals para estado de UI
  isSubmitting = signal<boolean>(false);
  submitSuccess = signal<boolean>(false);
  
  constructor() {
    // Effect: guardar en store cuando formulario es válido
    effect(() => {
      if (this.lecturaForm.valid && !this.isSubmitting()) {
        // Auto-save drafts en localStorage
        const draft = this.lecturaForm.getRawValue();
        localStorage.setItem('lectura-draft', JSON.stringify(draft));
      }
    });
  }
  
  // Cargar datos previos desde store
  loadMedidor(medidorId: number): void {
    const medidor = this.store.getMedidor(medidorId);
    if (medidor) {
      this.lecturaForm.patchValue({
        medidorId: medidor.id,
        lecturaAnterior: medidor.lastReading
      });
    }
  }
}
```

### Patrón: FormGroup con FormArray (Dinámico)

```typescript
export interface IPhotoForm {
  url: FormControl<string>;
  caption: FormControl<string>;
}

export class MedidorLecturaFormComponent {
  private fb = inject(FormBuilder);
  
  lecturaForm = this.fb.group({
    medidorId: this.fb.control<number>(0),
    fotos: this.fb.array<FormGroup<IPhotoForm>>([]) // Array tipado
  });
  
  get fotosArray(): FormArray {
    return this.lecturaForm.get('fotos') as FormArray;
  }
  
  // Agregar foto dinámicamente
  addPhoto(url: string, caption: string): void {
    const photoForm = this.fb.group<IPhotoForm>({
      url: this.fb.control<string>(url, [Validators.required]),
      caption: this.fb.control<string>(caption, [Validators.maxLength(200)])
    });
    
    this.fotosArray.push(photoForm);
  }
  
  // Remover foto
  removePhoto(index: number): void {
    this.fotosArray.removeAt(index);
  }
}
```

---

## 5. Custom Input Components con Signals

**Ubicación real:** `appsweb/angular/src/app/shared/ui/inputs/custom-input-*`

### Patrón: Custom Input con FormControl

```typescript
// ✅ CORRECTO: Custom input que funciona con FormControl + Signals
@Component({
  selector: 'app-custom-input-text',
  template: `
    <div class="input-wrapper">
      <label>{{ label() }}</label>
      <input 
        [formControl]="control"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        (blur)="onBlur()" />
      <span class="error" *ngIf="control.invalid && control.touched">
        {{ errorMessage() }}
      </span>
    </div>
  `,
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomInputTextComponent {
  // Inputs con nueva API
  label = input<string>('');
  placeholder = input<string>('');
  disabled = input<boolean>(false);
  
  // FormControl desde parent (Reactive Forms)
  control = input.required<FormControl<string>>();
  
  // Derived state
  errorMessage = computed(() => {
    const ctrl = this.control();
    if (ctrl.errors?.['required']) return 'Este campo es requerido';
    if (ctrl.errors?.['minlength']) return 'Mínimo 3 caracteres';
    return '';
  });
  
  onBlur(): void {
    this.control().markAsTouched();
  }
}
```

### Consumo en Formulario

```typescript
// ✅ CORRECTO: Usar custom input con formControl
<app-custom-input-text
  [control]="lecturaForm.get('observaciones') as FormControl<string>"
  [label]="'Observaciones'"
  [placeholder]="'Agrega notas...'" />
```

---

## 6. Verificaciones de Auditoría

### Checklist de Formularios

- [ ] ¿Formulario usa Reactive Forms (FormBuilder, FormGroup)?
- [ ] ¿FormGroup es tipado con interface IFormType?
- [ ] ¿Todos los controles tienen Validators?
- [ ] ¿Validadores custom tienen lógica clara + tests?
- [ ] ¿Errores se muestran específicamente en template?
- [ ] ¿Submit está deshabilitado si formulario es inválido?
- [ ] ¿Async validators usan catchError para no rechazar?
- [ ] ¿FormArray está tipado si se usa?
- [ ] ¿Componentes custom inputs usan input() API?
- [ ] ¿Error handling tiene try/catch + tipos específicos?

### Comandos de Validación

```bash
# Buscar Template Forms (debería retornar 0)
grep -r "ngModel" appsweb/angular/src/app --include="*.html" --include="*.ts"

# Validar Reactive Forms en uso
grep -r "FormBuilder\|FormGroup\|FormControl" appsweb/angular/src/app --include="*.ts" | wc -l

# Buscar formularios sin interface IForm
grep -r "FormGroup(" appsweb/angular/src/app --include="*.ts" | grep -v "FormGroup<"

# Validar validadores custom
find appsweb/angular/src/app -name "*validator*" -type f
```

---

## 7. Anti-patrones

| ❌ Incorrecto | ✅ Correcto | Razón |
|---|---|---|
| Template Forms (*ngModel) | Reactive Forms (FormBuilder) | Más testeable, tipado, validaciones claras |
| FormGroup sin interface | FormGroup<IFormType> | Type safety en compilación |
| Validators sin tipos | Validators custom tipados | Legible, reutilizable, testeable |
| Mostrar errores genéricos | Errores específicos por tipo | Mejor UX, usuario sabe qué corregir |
| FormArray sin tipado | FormArray<FormGroup<IType>> | Type-safe, refactoring seguro |
| Async validators sin catchError | catchError(() => of(null)) | No rechaza form si API falla |
| Submit siempre habilitado | Deshabilitar si form.invalid | Evita errores de validación |

---

## 8. Referencias y Documentos Relacionados

- [CONVENTIONS.md §4 — Frontend Rules](../CONVENTIONS.md#4-frontend-rules)
- [angular-signals-and-state.md](./angular-signals-and-state.md) — Signals en formularios
- [angular-components-api.md](./angular-components-api.md) — input() y model() API
- Angular Docs: [Reactive Forms](https://angular.io/guide/reactive-forms)

---

**Última actualización:** 2026-08-06  
**Vigencia:** Angular 22 (Reactive Forms, input() API)  
**Aplicable a:** Todos los formularios en el proyecto

