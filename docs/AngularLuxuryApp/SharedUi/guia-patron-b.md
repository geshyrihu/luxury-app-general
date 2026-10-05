# 📂 Catálogo UI > Guía de Patrón B (Vistas Híbridas)

📅 Última Revisión: 2026-07-17
🛡️ Estado: Vigente
👤 Responsable: Antigravity / UI Team

Esta guía rápida sirve como referencia para evitar las malas prácticas bloqueadas por la gobernanza de UI (`audit:design`). Si estás creando un listado CRUD (vista compleja), **DEBES** seguir el Patrón B para respetar el Design System y mantener la compatibilidad móvil y web sin usar estilos locales.

## ❌ Lo que ya NO se puede hacer

```html
<!-- PROHIBIDO:
 1. Usar style="..." o [style]
 3. Ignorar la plataforma móvil -->
<div style="padding: 20px; background-color: var(--ds-bg-surface);">
  <p-table [value]="data">...</p-table>
</div>
```

## ✅ El Patrón B (La forma correcta)

La vista principal es un **Wrapper** que inyecta la vista correspondiente según el dispositivo.

### 1. El Wrapper (`feature-wrapper.ts`)

```typescript
import { Component, inject } from "@angular/core";
import { PlatformService } from "@core/services/platform.service";
import { FeatureWebComponent } from "./feature-web.ts";
import { FeatureMobileComponent } from "./feature-mobile.ts";

@Component({
  selector: "app-feature-wrapper",

  imports: [FeatureWebComponent, FeatureMobileComponent],
  template: `
    @if (platform.isMobile()) {
      <app-feature-mobile />
    } @else {
      <app-feature-web />
    }
  `,
})
export class FeatureWrapper {
  platform = inject(PlatformService);
}
```

### 2. Vista Web (`feature-web.html`)

Usa el catálogo `@ui/web` y clases de PrimeFlex. **Nunca** uses estilos inline.

```html
<div class="card p-fluid m-3">
  <!-- Layout con PrimeFlex en vez de style="..." -->
  <div class="flex justify-content-between align-items-center mb-4">
    <h2 class="text-xl font-semibold m-0 text-color">Gestión de Usuarios</h2>
    <!-- Uso del catálogo @ui en lugar de botones nativos -->
    <il-button-add (onClick)="openCreateModal()" />
  </div>

  <!-- Usar nuestro componente del Design System -->
  <app-data-table [data]="items()" [columns]="cols" (onEdit)="edit($event)">
  </app-data-table>
</div>
```

### 3. Vista Móvil (`feature-mobile.html`)

Usa el catálogo `@ui/mobile` y PrimeFlex.

```html
<!-- Wrapper móvil de nuestro Design System -->
<app-data-view-mobile [title]="'Gestión de Usuarios'">
  <!-- Iteración de items móvil -->
  @for (item of items(); track item.id) {
  <ili-list-item>
    <div class="flex flex-column gap-2">
      <p class="font-semibold m-0 text-color">{{ item.name }}</p>
      <p class="text-xs m-0 text-color-secondary">{{ item.role }}</p>
    </div>
    <!-- Action Menu debe ir dentro de <div slot="end"> si es Ionic puro, o como dicta @ui -->
    <ili-action-menu end (onEdit)="edit(item)" />
  </ili-list-item>
  } @empty {
  <app-empty-state message="No hay elementos. Crea el primero." />
  }

  <!-- Fab Button nativo -->
  <ili-fab-button (onClick)="openCreateModal()" />
</app-data-view-mobile>
```

> [!TIP]
> Toda la lógica (Signals, llamadas a API, estado) **debe** residir en un archivo compartido (`feature-base.service.ts`) que es inyectado por igual en la vista web y móvil. ¡No dupliques código de lógica de negocio!
