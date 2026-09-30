# Angular: Dialog/Modal Abstraction (Web & Mobile)

**Última revisión:** 2026-08-06  
**Derivado de:** Exploración profunda codebase  
**Severidad:** 🔴 CRÍTICA — Patrón obligatorio para UI interactiva

---

## Propósito


---

## Regla de Oro

```
Diálogos = DialogHandlerService Centralizado

✅ SÍ: Inyectar DialogHandlerService que auto-detecta plataforma
```

---

## 1. DialogHandlerService (Abstracción)

**Ubicación:** `appsweb/angular/src/app/core/services/dialog-handler.service.ts`

**Responsabilidad:** Unificar APIs web/mobile bajo `Promise<T>`

### Interface Unificada

```typescript
@Injectable({ providedIn: 'root' })
export class DialogHandlerService {
  private readonly platform = inject(PlatformService);
  private readonly modalController = inject(ModalController);   // Ionic
  
  /**
   * Abre un diálogo/modal con el mismo código para web y mobile.
   * @param component Componente a mostrar
   * @param data Datos a pasar al componente
   * @param title Título del diálogo
   * @param size Tamaño: 'sm' | 'md' | 'lg' | 'full'
   * @returns Promise con resultado al cerrar
   */
  async openDialog<T>(
    component: Type<any>,
    data: any = null,
    title: string = '',
    size: DialogSize = 'md'
  ): Promise<T | undefined> {
    if (this.platform.isMobile()) {
      return this.openMobileModal<T>(component, data, title);
    } else {
      return this.openDialogWeb<T>(component, data, title, size);
    }
  }
  
  /**
   */
  private openDialogWeb<T>(
    component: Type<any>,
    data: any,
    title: string,
    size: DialogSize
  ): Promise<T | undefined> {
    const width = this.getSizeWidth(size);
    
    const dialogRef = this.primeDialogService.open(component, {
      header: title,
      width: width,
      data: data,
      modal: true,
      closable: true,
      maximizable: false,
      baseZIndex: 10000,
      styleClass: `dialog-${size}`,
    });
    
    // Convertir callback a Promise
    return new Promise<T | undefined>((resolve) => {
      dialogRef.onClose.subscribe((result: T | undefined) => {
        resolve(result);
      });
    });
  }
  
  /**
   * Abre modal móvil (Ionic ModalController)
   */
  private async openMobileModal<T>(
    component: Type<any>,
    data: any,
    title: string
  ): Promise<T | undefined> {
    const modal = await this.modalController.create({
      component: IonicDialogModalComponent, // Wrapper
      componentProps: {
        innerComponent: component,
        innerData: data,
        title: title,
      },
    });
    
    await modal.present();
    
    const { data: result } = await modal.onDidDismiss();
    return result;
  }
  
  private getSizeWidth(size: DialogSize): string {
    switch (size) {
      case 'sm': return '30vw';
      case 'md': return '50vw';
      case 'lg': return '75vw';
      case 'full': return '95vw';
      default: return '50vw';
    }
  }
}

export type DialogSize = 'sm' | 'md' | 'lg' | 'full';
```

---

## 2. Consumo en Componentes

### Patrón: Mismo código para Web y Mobile

```typescript
// Component en feature (web o mobile, da igual)
@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [CommonModule]
})
export class ItemListComponent {
  private dialogHandler = inject(DialogHandlerService);
  
  async editItem(itemId: string): Promise<void> {
    // ✅ Mismo código para web y mobile
    const updated = await this.dialogHandler.openDialog<ItemDto>(
      EditItemComponent,
      { itemId },
      'Editar Item',
      'md'
    );
    
    if (updated) {
      console.log('Item actualizado:', updated);
      // Recargar lista
    }
  }
}
```

### Componente Insertado en Diálogo/Modal

```typescript
// Componente que se abre en el diálogo
@Component({
  selector: 'app-edit-item',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <form [formGroup]="form">
      <input formControlName="name" placeholder="Nombre" />
      
      <div class="actions">
        <button (click)="onCancel()">Cancelar</button>
        <button (click)="onSave()">Guardar</button>
      </div>
    </form>
  `
})
export class EditItemComponent {
  form = new FormGroup({
    name: new FormControl('', Validators.required)
  });
  
  // ✅ Inyectar DialogRef (web) o ModalController (mobile)
  // Ambos siguen el mismo patrón de close()
  private dialogRef = inject(DynamicDialogRef);
  
  onCancel(): void {
    this.dialogRef.close(null); // Cerrar sin resultado
  }
  
  onSave(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value); // Cerrar con resultado
    }
  }
}
```


---

## 3. IonicDialogModalComponent (Wrapper Móvil)

**Ubicación:** Componente interno para envolver diálogos en Ionic

```typescript
@Component({
  selector: 'app-ionic-dialog-modal',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, CommonModule],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ title }}</ion-title>
        <ion-buttons slot="start">
          <ion-button (click)="onClose()">Cerrar</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <!-- Renderizar componente inner dinámicamente -->
      <ng-container *ngIf="innerComponent">
        <ng-container *ngComponentOutlet="innerComponent; ngModuleFactory: moduleFactory"></ng-container>
      </ng-container>
    </ion-content>
  `
})
export class IonicDialogModalComponent {
  innerComponent: Type<any> | null = null;
  innerData: any = null;
  title: string = '';
  moduleFactory: NgModuleFactory<any> | null = null;
  
  private modalController = inject(ModalController);
  
  onClose(): void {
    this.modalController.dismiss(null);
  }
}
```

---

## 4. Patrones Avanzados

### A. Confirmación (Sí/No)

```typescript
// DialogHandlerService - método adicional
async confirm(
  title: string,
  message: string,
  confirmText = 'Sí',
  cancelText = 'Cancelar'
): Promise<boolean> {
  const result = await this.openDialog<boolean>(
    ConfirmComponent,
    { title, message, confirmText, cancelText },
    'Confirmar',
    'sm'
  );
  
  return result === true;
}

// Uso
const confirmed = await this.dialogHandler.confirm(
  '¿Eliminar item?',
  'Esta acción no se puede deshacer.'
);

if (confirmed) {
  await this.api.onDelete('api/items/123').toPromise();
}
```

### B. Diálogo con Resultado Tipado

```typescript
// Interface para resultado
export interface DialogResult<T> {
  action: 'save' | 'cancel' | 'delete';
  data?: T;
}

// Componente retorna tipado
export class EditComponent {
  private dialogRef = inject(DynamicDialogRef);
  
  onSave(): void {
    this.dialogRef.close<DialogResult<Item>>({
      action: 'save',
      data: this.form.value
    });
  }
}

// Consumo tipado
const result = await this.dialogHandler.openDialog<DialogResult<Item>>(
  EditComponent,
  { itemId: 123 },
  'Editar',
  'md'
);

if (result?.action === 'save') {
  // result.data es tipado como Item
}
```

---

## 5. Verificaciones de Auditoría

### Checklist de Diálogos/Modales

- [ ] ¿Usa DialogHandlerService para abrir diálogos?
- [ ] ¿No inyecta ModalController (Ionic) directamente?
- [ ] ¿Componentes dentro de diálogo usan DynamicDialogRef.close()?
- [ ] ¿Mismo código funciona en web y mobile?
- [ ] ¿DialogSize especificado correctamente?
- [ ] ¿Sin diálogos múltiples sin cerrar anteriores?
- [ ] ¿Error handling si componente no abre?

### Comandos de Validación

```bash
# Buscar uso de DialogService directo (debería ser 0 en features)
grep -r "inject(DialogService)" appsweb/angular/src/app/modules --include="*.ts" | wc -l

# Buscar uso de ModalController directo (debería ser 0 en features)
grep -r "inject(ModalController)" appsweb/angular/src/app/modules --include="*.ts" | wc -l

# Validar que se usa DialogHandlerService
grep -r "inject(DialogHandlerService)" appsweb/angular/src/app/modules --include="*.ts" | wc -l

# Buscar DynamicDialogRef en componentes (correcto)
grep -r "DynamicDialogRef" appsweb/angular/src/app --include="*.ts" | wc -l
```

---

## 6. Anti-patrones

| ❌ Incorrecto | ✅ Correcto | Razón |
|---|---|---|
| Inyectar `DialogService` directo | Usar `DialogHandlerService` | No funciona en mobile |
| Inyectar `ModalController` directo | Usar `DialogHandlerService` | No funciona en web |
| Código diferente para web/mobile | Mismo código en ambos | Mantenibilidad |
| Sin tamaño especificado | Siempre pasar `size` | UX consistente |
| Abrir múltiples diálogos | Esperar close anterior | Evita confusión |
| No esperar `onClose` | Siempre `await` el dialog | UX predecible |

---

## 7. Referencias y Documentos Relacionados

- [CONVENTIONS.md §4 — Frontend Rules](../CONVENTIONS.md#4-frontend-rules)
- [UI Desktop Rules](../ui/ui-desktop-rules.md) — Modales en desktop
- [UI Mobile Rules](../ui/ui-mobile-rules.md) — Modales en mobile
- [angular-services-catalog.md](./angular-services-catalog.md) — DialogHandlerService
- Ionic Docs: [ModalController](https://ionicframework.com/docs/api/modal)

---

**Última actualización:** 2026-08-06  
**Vigencia:** Angular 17+, Ionic 8+  
**Aplicable a:** Todos los componentes que abren diálogos/modales
