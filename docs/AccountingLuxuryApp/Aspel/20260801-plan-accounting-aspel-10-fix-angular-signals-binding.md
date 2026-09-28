# 🧠 Plan Rápido: Corrección de Filtros en Angular (Signals + ngModel)

> **Instrucciones para el Agente CLI:**
> Los filtros del Dashboard no están reaccionando porque usaste `[(ngModel)]` directamente sobre un `WritableSignal`. Esto no enlaza correctamente los cambios del usuario hacia la señal.

### Prompt de Ejecución (Copiar y pegar al Agente CLI)
```text
Corrige el enlace de datos (Two-Way Binding) en el Dashboard:
1. Abre `mock-aspel-dashboard.html`.
2. Busca todas las apariciones de `[(ngModel)]` que estén atadas a señales y cámbialas por la sintaxis correcta de división de lectura/escritura de señales:
   - Cambia `[(ngModel)]="year"` por `[ngModel]="year()" (ngModelChange)="year.set($event)"`
   - Cambia `[(ngModel)]="period"` por `[ngModel]="period()" (ngModelChange)="period.set($event)"`
   - Cambia `[(ngModel)]="tipoEmpresa"` por `[ngModel]="tipoEmpresa()" (ngModelChange)="tipoEmpresa.set($event)"`
   - Cambia `[(ngModel)]="nivel"` por `[ngModel]="nivel()" (ngModelChange)="nivel.set($event)"`
   - Cambia `[(ngModel)]="numCtaPapa"` por `[ngModel]="numCtaPapa()" (ngModelChange)="numCtaPapa.set($event)"`
3. Verifica que la tabla ahora sí recargue con datos distintos cuando cambias los dropdowns y presionas "Actualizar corte".
```
