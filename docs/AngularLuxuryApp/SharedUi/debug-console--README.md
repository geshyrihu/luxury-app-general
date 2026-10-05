# Debug Console Component

Consola de debugging integrada en la app para diagnosticar problemas en producción, especialmente en iPhone sin Mac.

## Problema que Resuelve

En iPhone, no tienes acceso a Safari DevTools sin Mac. Esta consola captura todos los `console.log()`, `console.error()`, etc. y los muestra en un overlay flotante dentro de la app.

## Uso Rápido

### 1. Inyectar en App Root

En tu componente principal (ej: `app.component.ts`):

```typescript
import { DebugConsoleService } from "src/app/core/services/debug-console.service";
import { LxDebugConsole } from "@ui/adaptive/debug-console/debug-console";

export class AppComponent {
  debugConsole = inject(DebugConsoleService);

  // En el template:
  // @if (debugConsole.showConsole()) {
  //   <lux-debug-console [logs]="debugConsole.logs()" />
  // }
}
```

### 2. Template

```html
@if (debugConsole.showConsole()) {
<lux-debug-console [logs]="debugConsole.logs()" />
}

<!-- O agregalo a la raíz para que siempre esté disponible -->
<main>
  <!-- contenido de la app -->
</main>

@if (debugConsole.showConsole()) {
<lux-debug-console [logs]="debugConsole.logs()" />
}
```

### 3. Activar en Producción (iPhone)

En el navegador de iPhone (Safari/Chrome):

```javascript
// Abre DevTools (F12 en desktop o console en mobile)
// Pega esto en la consola:
localStorage.setItem('DEBUG_MODE', 'true');
location.reload();

// Luego, agrega esta lógica en tu app.component.ts:
ngOnInit() {
  const debugMode = localStorage.getItem('DEBUG_MODE') === 'true';
  if (debugMode) {
    this.debugConsole.showConsole.set(true);
  }
}
```

## Características

- ✅ Captura automática de `console.log/error/warn/info`
- ✅ Timestamps en cada log
- ✅ Código de colores por nivel (error=rojo, warn=amarillo, etc.)
- ✅ Muestra últimos 100 logs
- ✅ Botón para limpiar logs
- ✅ Toggle show/hide
- ✅ Responsive (se adapta a mobile)
- ✅ No afecta performance

## Ejemplo Real: Diagnosticar Error de Imagen en iPhone

### Paso 1: Activar en iPhone

```javascript
localStorage.setItem("DEBUG_MODE", "true");
location.reload();
```

### Paso 2: Intentar subir foto

- Abre el formulario de tickets
- Selecciona foto de la galería
- Observa los logs en pantalla

### Paso 3: Busca logs con `[IMAGE_PROCESS]` o `[COMPRESS]`

```
[10:15:45] [LOG] [IMAGE_PROCESS] Iniciando compresión: 6.70MB → 5.00MB
[10:15:46] [LOG] [COMPRESS] Dimensiones originales: 5600x3200px
[10:15:47] [ERROR] [COMPRESS] Error al cargar imagen: ENOENT
```

### Paso 4: Reporta el error

Toma screenshot de los logs o cópialo y envíalo.

## API

### DebugConsoleService

```typescript
debugConsole.log("Mi mensaje");
debugConsole.error("Error:", error);
debugConsole.warn("Advertencia");
debugConsole.showConsole.set(true); // Mostrar consola
debugConsole.toggleConsole(); // Toggle show/hide
debugConsole.clearLogs(); // Limpiar logs
```

### Propiedades

```typescript
debugConsole.logs(); // Signal<LogEntry[]> - Array de logs
debugConsole.showConsole(); // Signal<boolean> - Mostrar/ocultar
```

## Notas de Desarrollo

- Automáticamente intercepta `console.log/error/warn/info`
- No requiere cambiar código existente (funciona automáticamente)
- Se recomienda solo activar en producción con flag localStorage
- Los logs se pierden al refrescar la página (normal)
- Máximo 100 logs (evita memory leaks)

## Estructura

```
shared/ui/
├── adaptive/debug-console/
│   ├── debug-console.ts
│   ├── debug-console.spec.ts
│   └── README.md
└── base/
└── web/
└── mobile/
```

## Solución Alternativa: Sentry

Para producción a largo plazo, considera usar **Sentry.io**:

- Captura errores automáticamente
- Funciona en iOS/Android/web
- Dashboard web para análisis
- Gratis hasta cierto límite
