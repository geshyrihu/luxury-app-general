# Angular Signals and Component Standards

> **Deep-dive:** las reglas generales están en CONVENTIONS.md §2 (Signals §2.9, Nombrado §2.10, Lazy loading §2.12) y §7 (Nombrado). Este archivo contiene ejemplos detallados.

## 3.3. Nomenclatura y Signals
- **Standalone**: Comportamiento por defecto. No escribir `standalone: true`.
- **Signals Obligatorios**: Prohibido `@Input()`, `@Output()` y `@ViewChild()`.
  - **Entradas**: `input()` o `input.required()`.
  - **Eventos**: `output()`.
  - **Doble Vía**: `model()`.
  - **Consultas**: `viewChild()` o `contentChild()`.
- **Clases**: `export class BankList` (sin sufijo `Component`).
- **Archivos de página**:
  - Listados: `bank-list.ts` y `bank-list.html`.
  - Formularios: `bank-form.ts` y `bank-form.html`.
  - Ubicación preferida: `pages/` dentro del feature.
- **Selectores**:
  - Listado: `selector: "app-bank-list"`.
  - Formulario: `selector: "app-bank-form"`.
- **Clases**:
  - Listado: `export class BankList`.
  - Formulario: `export class BankForm`.
- **Archivos de interfaces**:
  - Ubicación: `interfaces/` dentro del feature (no `models/`).
  - Nombre: `banks.dto.ts` para DTOs, `banks.interface.ts` para interfaces de dominio.
  - Interfaces: sin prefijo `I` (ej. `BankDto`, `BankFormGroup`).

## 3.17. Patrones de Import @core
- El alias `@core` apunta a `src/app/core/`. **Prohibido** rutas relativas (`../../`).
- **Barrel exports**: Botones e inputs tienen barrel exports por categoría.
  - `import { CustomButtonEdit, CustomButtonAdd } from "@core/components/buttons/web";`

## 3.10. Gestión de Rutas
- **Lazy Loading**: Uso obligatorio de `loadComponent` con importaciones dinámicas.
- **Security**: Rutas protegidas deben incluir `canActivate: [authGuard]`.

## 3.19. Comunicación entre Componentes
- **Hacia Hijos**: Signal-based Inputs.
- **Hacia Padres**: Outputs de Signals.
- **Global**: Servicios compartidos con signals (`signal()`, `computed()`).
