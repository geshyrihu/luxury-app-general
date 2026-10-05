# Processing Overlay Component

Componente reutilizable de overlay con indicador de progreso para operaciones de procesamiento.

## Propósito

Mostrar feedback visual claro al usuario durante operaciones CRUD (creación, actualización) que requieran

## Uso

### Básico

```html
<lux-processing-overlay
  [isProcessing]="isSubmitting()"
  [progress]="uploadProgress()"
  message="Guardando ticket..."
/>
```

### Con submensaje

```html
<lux-processing-overlay
  [isProcessing]="isSubmitting()"
  [progress]="processingProgress()"
  message="Procesando formulario..."
  submessage="Comprimiendo y validando imágenes"
/>
```

## API

### Inputs

| Propiedad      | Tipo             | DESCRIPCIÓN                    | Default           |
| -------------- | ---------------- | ------------------------------ | ----------------- |
| `isProcessing` | `boolean`        | Mostrar/ocultar overlay        | `false`           |
| `progress`     | `number`         | Porcentaje de progreso (0-100) | `0`               |
| `message`      | `string`         | Mensaje principal              | `"Procesando..."` |
| `submessage`   | `string \| null` | Mensaje secundario (opcional)  | `null`            |

## Características

- ✅ **Responsivo**: Se adapta automáticamente a mobile y desktop
- ✅ **Barra de progreso**: Visual feedback en tiempo real (0-100%)
- ✅ **Spinner animado**: Icono de carga giratorio
- ✅ **Mensajes flexibles**: Mensajes principal y secundario personalizables
- ✅ **Backdrop oscuro**: Desactiva interacción con el fondo

## Ejemplo en Formulario

```typescript
export class TaskForm {
  submitting = signal(false);
  processingProgress = signal(0);
  processingMessage = signal("Guardando ticket...");

  async onSubmit() {
    this.processingProgress.set(0);
    this.processingMessage.set("Preparando datos...");

    // Simular progreso en fases
    setTimeout(() => this.processingProgress.set(35), 800);
    setTimeout(() => {
      this.processingMessage.set("Enviando al servidor...");
      this.processingProgress.set(65);
    }, 1600);

    // Realizar operación
    await this.submit();

    // Finalizar
    this.processingProgress.set(100);
    this.processingMessage.set("¡Completado!");
  }
}
```

## Estructura de Archivos

```
shared/ui/
├── adaptive/processing-overlay/
│   ├── processing-overlay.ts (Componente principal adaptativo)
│   ├── processing-overlay.spec.ts
│   └── README.md (Este archivo)
├── web/processing-overlay/
│   └── processing-overlay.spec.ts
└── mobile/processing-overlay/
    ├── processing-overlay.ts (Versión Ionic/mobile)
    └── processing-overlay.spec.ts
```

## Notas de Desarrollo

- El componente usa `ChangeDetectionStrategy.OnPush` para optimizar rendimiento
- Los mensajes son inputs reactivos y pueden cambiar en tiempo real
- La barra de progreso anima suavemente usando `transition-all`
- El componente se importa desde el alias `@ui/adaptive/processing-overlay/processing-overlay`
