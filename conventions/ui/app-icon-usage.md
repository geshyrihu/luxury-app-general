# Frontend UI: app-icon Component Usage

**Status:** ✅ VALIDADO (2026-08-14)  
**Severidad:** 🟡 IMPORTANTE  
**Scope:** Frontend Angular — Icon system

---

## Patrón Correcto

### ✅ OBLIGATORIO

```html
<!-- Usar app-icon con catálogo tipado -->
<app-icon icon="material-symbols-light:person" />

<!-- Con binding -->
<app-icon [icon]="dynamicIconName" />

<!-- Con size (si aplica) -->
<app-icon icon="material-symbols-light:check" size="lg" />

<!-- En botones -->
<button>
  <app-icon icon="material-symbols-light:edit" />
  Editar
</button>
```

### ❌ PROHIBIDO

```html
<!-- Nunca strings literales fuera de app-icon -->
<i class="material-symbols-light:person"></i>

<!-- Nunca PrimeIcons (deprecado) -->
<i class="pi pi-user"></i>
<app-icon icon="pi:user" />

<!-- Nunca hardcoding clases CSS -->
<span class="icon-user"></span>

<!-- Nunca mezclar sistemas -->
<font-awesome-icon icon="user"></font-awesome-icon>
```

---

## Componente

**Ubicación:** `appsweb/angular/src/app/shared/ui/shared/app-icon/`

**Características:**
- ✅ Input tipado (`AppIconName` desde catálogo)
- ✅ Computed para resolver iconos
- ✅ OnPush change detection
- ✅ Iconify-icon integrado
- ✅ Tamaño configurable (em-based)

**Interfaz:**
```typescript
@Component({
  selector: "app-icon",
  // ...
})
export class AppIcon {
  icon = input<AppIconName | null | undefined>();
  // Resuelve automático vía resolveIconifyIcon()
}
```

---

## Catálogo

**Ubicación:** `app-icon.catalog.ts`

```typescript
export type AppIconName = 
  | "material-symbols-light:person"
  | "material-symbols-light:edit"
  | "material-symbols-light:delete"
  // ... más iconos
```

**Verificación:** Gate `npm run audit:icon-names` detecta:
- Iconos no en catálogo
- Catálogo huérfanos
- Nombres inconsistentes

---

## Uso en Botones

```typescript
// ✅ CORRECTO: wrapper que encapsula iconos
<iw-button-item
  label="Editar"
  iconClass="material-symbols-light:edit"
  (clicked)="onEdit()"
/>

// ✅ CORRECTO: app-icon explícito
<button (click)="onDelete()">
  <app-icon icon="material-symbols-light:delete" />
  Eliminar
</button>
```

---

## Accesibilidad

```html
<!-- ✅ CORRECTO: icon-only button con aria-label -->
<button aria-label="Editar usuario">
  <app-icon icon="material-symbols-light:edit" />
</button>

<!-- ✅ CORRECTO: icon + texto -->
<button>
  <app-icon icon="material-symbols-light:save" />
  Guardar
</button>

<!-- ❌ PROHIBIDO: icon sin label -->
<button>
  <app-icon icon="material-symbols-light:edit" />
</button>
```

---

## Checklist

- [ ] ¿Usar app-icon para TODO icono?
- [ ] ¿Icon en catálogo (AppIconName)?
- [ ] ¿No hay strings literales de iconos?
- [ ] ¿Buttonicon-only tiene aria-label?
- [ ] ¿No mezclar sistemas (no pi:, fa-)?

---

## Referencia

- **Component:** `AppIcon` (Signals, OnPush, Standalone)
- **Catalog:** `app-icon.catalog.ts` (typesafe)
- **Gate:** `npm run audit:icon-names`
- **OWASP A11Y:** icon-only buttons require accessible name
